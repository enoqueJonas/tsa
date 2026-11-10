#!/usr/bin/env python3
"""Real, disposable Alertmanager API -> routing/grouping/inhibition -> localhost receiver.
Uses the official prom/alertmanager:v0.28.1 image via Docker on GitHub Linux runners.
Does NOT run Prometheus, PagerDuty, email, Grafana, or Steward itself.
"""
import datetime as dt
import json
import os
import socket
import subprocess
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

IMAGE = "prom/alertmanager:v0.28.1"
TEMPLATE = Path("labs/reliability-alertmanager/alertmanager.yml.template")
assert "__RECEIVER_PORT__" in TEMPLATE.read_text(encoding="utf8")

def free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]

class State:
    attempts = []
    fail_receiver = False
    lock = threading.Lock()

class Receiver(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_POST(self):
        size = int(self.headers.get("Content-Length", "0"))
        if size <= 0 or size > 150_000:
            self.send_error(400)
            return
        payload = json.loads(self.rfile.read(size))
        names = sorted(alert["labels"]["alertname"] for alert in payload["alerts"])
        services = sorted(set(alert["labels"].get("service") for alert in payload["alerts"]))
        with State.lock:
            should_fail = (State.fail_receiver and self.path == "/reliability"
                           and "SyntheticDeliveryFailure" in names)
            State.attempts.append({
                "route": self.path, "status": payload["status"],
                "names": names, "services": services,
                "response": 503 if should_fail else 200,
            })
        self.send_response(503 if should_fail else 200)
        self.send_header("Content-Length", "0")
        self.end_headers()

def request_json(url, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    method = "POST" if data is not None else "GET"
    req = Request(url, data=data, method=method,
                  headers={"Content-Type": "application/json"})
    try:
        with urlopen(req, timeout=3) as response:
            return response.status, response.read()
    except HTTPError as exc:
        with exc:
            return exc.code, exc.read()

def iso(seconds_from_now):
    return (dt.datetime.now(dt.timezone.utc)
            + dt.timedelta(seconds=seconds_from_now)).isoformat().replace("+00:00", "Z")

def event(name, service, team, start, end, extra=None):
    labels = {"alertname": name, "service": service, "team": team,
              "environment": "tsa-loopback", "severity": "ticket"}
    if extra:
        labels.update(extra)
    return {"labels": labels, "annotations": {"summary": "synthetic test"},
            "startsAt": start, "endsAt": end}

def accepted_events():
    with State.lock:
        return [e.copy() for e in State.attempts if e["response"] == 200]

def all_attempts():
    with State.lock:
        return [e.copy() for e in State.attempts]

def await_event(predicate, name, timeout=18):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        events = all_attempts()
        if any(predicate(e) for e in events):
            return
        time.sleep(0.2)
    raise AssertionError(name + ": no matching receiver observation: "
                         + json.dumps(all_attempts(), sort_keys=True))

def selected(service, route=None, status="firing"):
    return [x for x in accepted_events()
            if service in x["services"] and x["status"] == status
            and (route is None or x["route"] == route)]

def perform(base):
    def post(alerts):
        code, body = request_json(base + "/api/v2/alerts", alerts)
        assert code == 200, ("Alertmanager API rejected alert", code, body[:300])

    start, end = iso(-45), iso(90)

    # Two distinct alerts share all route group_by labels, but not alertname.
    post([event("StewardErrorSpike", "steward-api", "reliability", start, end),
          event("StewardLatencyHigh", "steward-api", "reliability", start, end)])
    await_event(lambda e: e["response"] == 200 and e["route"] == "/reliability"
                and e["services"] == ["steward-api"]
                and e["names"] == ["StewardErrorSpike", "StewardLatencyHigh"],
                "two grouped alerts must reach the reliability route")
    assert len(selected("steward-api", "/reliability")) == 1
    print("REAL_ALERTMANAGER_GROUP_PASS: 2 alerts, 1 actual webhook, team=reliability")

    # Redelivery of the identical alert labels must not cause a second
    # notification before repeat_interval=30s. No guarantee after 30s.
    post([event("StewardErrorSpike", "steward-api", "reliability", start, end),
          event("StewardLatencyHigh", "steward-api", "reliability", start, end)])
    time.sleep(3)
    assert len(selected("steward-api", "/reliability")) == 1, (
        "Duplicate API submissions generated a second notification too early")
    print("REAL_ALERTMANAGER_DEDUP_PASS: identical re-post does not immediately notify twice")

    post([event("SuspiciousLoginSpike", "steward-auth", "security", start, end)])
    await_event(lambda e: e["route"] == "/security" and e["response"] == 200
                and e["services"] == ["steward-auth"], "team-specific security route")
    assert not selected("steward-auth", "/reliability")
    print("REAL_ALERTMANAGER_ROUTE_PASS: owner=security delivered only to security webhook")

    post([event("FallbackTest", "steward-unknown", "unassigned", start, end)])
    await_event(lambda e: e["route"] == "/fallback" and e["response"] == 200
                and e["services"] == ["steward-unknown"], "fallback route")
    print("REAL_ALERTMANAGER_FALLBACK_PASS: unmatched owner went to explicit test-only fallback")

    # Parent and derivative are submitted together before group_wait elapses.
    post([event("DatabaseDown", "steward-database", "reliability", start, end),
          event("ApiDependencyFailed", "steward-database", "reliability", start, end)])
    await_event(lambda e: e["route"] == "/reliability"
                and e["services"] == ["steward-database"] and e["response"] == 200,
                "inhibition parent delivery")
    parent_receipts = selected("steward-database", "/reliability")
    assert len(parent_receipts) == 1
    assert parent_receipts[0]["names"] == ["DatabaseDown"], (
        "Derivative symptom was not inhibited by its matching parent")
    print("REAL_ALERTMANAGER_INHIBIT_PASS: DatabaseDown delivered, derivative suppressed")

    # A 503 response proves FAILED receiver delivery; do not falsely record
    # a successful notification. Recovery is proved with a NEW alert group,
    # not by promising an Alertmanager retry schedule.
    with State.lock:
        State.fail_receiver = True
    post([event("SyntheticDeliveryFailure", "steward-failure", "reliability", start, end)])
    await_event(lambda e: e["route"] == "/reliability" and e["response"] == 503
                and e["services"] == ["steward-failure"], "receiver 503 boundary")
    assert not selected("steward-failure", "/reliability")
    print("REAL_ALERTMANAGER_503_PASS: actual receiver rejected notification")

    with State.lock:
        State.fail_receiver = False
    post([event("FreshRecovery", "steward-recovered", "reliability", start, end)])
    await_event(lambda e: e["route"] == "/reliability" and e["response"] == 200
                and e["services"] == ["steward-recovered"], "fresh delivery after recovery")
    print("REAL_ALERTMANAGER_RECOVERY_PASS: fresh group reached recovered receiver")

    # An updated end time for the SAME labels/startsAt makes the already
    # delivered security alert resolve. Prove actual resolved webhook.
    post([event("SuspiciousLoginSpike", "steward-auth", "security", start, iso(-1))])
    await_event(lambda e: e["route"] == "/security" and e["response"] == 200
                and e["status"] == "resolved" and e["services"] == ["steward-auth"],
                "resolved webhook after recovery", timeout=18)
    print("REAL_ALERTMANAGER_RESOLVED_PASS: actual resolved security webhook observed")
    print("REAL_ALERTMANAGER_API_BOUNDARY_ONLY: no Prometheus-to-Alertmanager transport, "
          "production receiver, external pager or human acknowledgment")

def main():
    assert os.name == "posix", "Docker host networking lab requires Linux"
    receiver_port = free_port()
    manager_port = free_port()
    assert receiver_port != manager_port
    receiver = ThreadingHTTPServer(("127.0.0.1", receiver_port), Receiver)
    worker = threading.Thread(target=receiver.serve_forever, daemon=True)
    worker.start()
    container = None
    try:
        with tempfile.TemporaryDirectory(prefix="tsa-am-real-") as scratch:
            config = Path(scratch) / "alertmanager.yml"
            config.write_text(TEMPLATE.read_text(encoding="utf8").replace(
                "__RECEIVER_PORT__", str(receiver_port)), encoding="utf8")
            # GitHub Linux runners are isolated; no external receiver,
            # production credentials or remote webhooks. localhost only.
            cmd = ["docker", "run", "--rm", "--network", "host",
                   "-v", str(config) + ":/etc/alertmanager.yml:ro",
                   "--entrypoint", "/bin/alertmanager", IMAGE,
                   "--config.file=/etc/alertmanager.yml",
                   "--web.listen-address=127.0.0.1:" + str(manager_port),
                   "--cluster.listen-address="]
            container = subprocess.Popen(cmd, stdout=subprocess.DEVNULL,
                                         stderr=subprocess.PIPE, text=True)
            base = "http://127.0.0.1:" + str(manager_port)
            deadline = time.monotonic() + 35
            while time.monotonic() < deadline:
                if container.poll() is not None:
                    raise AssertionError("Alertmanager exited: "
                                         + container.stderr.read()[-2000:])
                try:
                    status, _ = request_json(base + "/-/ready")
                    if status == 200:
                        break
                except (OSError, URLError):
                    pass
                time.sleep(0.25)
            else:
                raise AssertionError("Official Alertmanager never became ready")
            perform(base)
    finally:
        if container is not None and container.poll() is None:
            container.terminate()
            try:
                container.wait(timeout=6)
            except subprocess.TimeoutExpired:
                container.kill()
                container.wait(timeout=4)
        receiver.shutdown()
        receiver.server_close()
        worker.join(timeout=3)

if __name__ == "__main__":
    main()
