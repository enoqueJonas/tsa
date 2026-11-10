#!/usr/bin/env python3
"""Real, disposable Alertmanager API -> routing/grouping/inhibition -> localhost receiver.
Uses the official prom/alertmanager:v0.28.1 image via Docker on GitHub Linux runners.
Does NOT run Prometheus, PagerDuty, email, Grafana, or Steward itself.
"""
import datetime as dt
import json
import os
import socket
import sqlite3
import subprocess
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

IMAGE = "prom/alertmanager:v0.28.1"
RETRY_MODE = os.getenv("TSA_AM_RETRY_MODE", "baseline")
assert RETRY_MODE in {"baseline", "transient-503", "permanent-503", "nonretryable-400", "ambiguous-503", "ambiguous-no-idempotency"}, RETRY_MODE
TEMPLATE = Path(os.environ.get("TSA_ALERTMANAGER_CONFIG",
                               "labs/reliability-alertmanager/alertmanager.yml.template"))
assert "__RECEIVER_PORT__" in TEMPLATE.read_text(encoding="utf8")

def free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]

class State:
    attempts = []
    fail_receiver = False
    retry_http_status = 503
    effect_db = None
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
        # Webhook transport receipt identity, not a mere alertname match.
        identities = [{
            "labels": dict(alert["labels"]),
            "startsAt": alert.get("startsAt"),
            "fingerprint": alert.get("fingerprint"),
        } for alert in payload["alerts"]]
        with State.lock:
            should_fail = (State.fail_receiver and self.path == "/reliability"
                           and "SyntheticDeliveryFailure" in names)
            response_code = State.retry_http_status if should_fail else 200
            # Durable side effect can COMMIT before HTTP 503 is returned.
            # Retrying this identical webhook must not commit it twice.
            if State.effect_db is not None and self.path == "/reliability" and (
                names == ["SyntheticDeliveryFailure"]
            ):
                identity = json.dumps({
                    "groupKey": payload.get("groupKey"),
                    "identities": identities,
                    "status": payload["status"]
                }, sort_keys=True, separators=(",", ":"))
                with sqlite3.connect(State.effect_db) as db:
                    operation = ("INSERT INTO delivery_effects(identity, effect) VALUES (?,?)"
                                 if RETRY_MODE == "ambiguous-no-idempotency"
                                 else "INSERT OR IGNORE INTO delivery_effects(identity, effect) VALUES (?,?)")
                    db.execute(operation, (identity, "synthetic-runbook-dispatch"))
                    db.commit()
            State.attempts.append({
                "route": self.path, "status": payload["status"],
                "names": names, "services": services,
                "response": response_code,
                "identities": identities,
                "groupKey": payload.get("groupKey"),
                "observed_monotonic": time.monotonic(),
            })
        self.send_response(response_code)
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

def committed_effects():
    assert State.effect_db is not None
    # Separate SQLite connection reads the real committed on-disk effect.
    with sqlite3.connect(State.effect_db) as db:
        return db.execute("SELECT identity, effect FROM delivery_effects ORDER BY id").fetchall()


def perform_same_notification_retry(base):
    """One alert submission; observe same webhook notification across 503->200.

    An unrelated new alert is NOT a retry. 400 is deliberately non-retryable
    for the bounded initial notification context; no permanent guarantee.
    """
    response_code = 400 if RETRY_MODE == "nonretryable-400" else 503
    with State.lock:
        State.fail_receiver = True
        State.retry_http_status = response_code

    alert = event("SyntheticDeliveryFailure", "steward-retry", "reliability",
                  iso(-5), iso(300), extra={"proof_case": "same-rejected-alert"})
    code, body = request_json(base + "/api/v2/alerts", [alert])
    assert code == 200, ("One synthetic Alertmanager API submission rejected",
                         code, body[:300])
    api_submissions = 1

    def receipt_of(status):
        return [x for x in all_attempts()
                if x["response"] == status
                and x["route"] == "/reliability"
                and x["names"] == ["SyntheticDeliveryFailure"]
                and x["services"] == ["steward-retry"]
                and x["status"] == "firing"
                and len(x["identities"]) == 1
                and x["identities"][0]["labels"].get("proof_case")
                == "same-rejected-alert"]

    await_event(lambda e: e["response"] == response_code
                and e["services"] == ["steward-retry"]
                and e["names"] == ["SyntheticDeliveryFailure"],
                "first actual receiver rejection", timeout=16)
    rejected = receipt_of(response_code)
    assert len(rejected) >= 1, "Expected at least one real 503/400 receiver rejection"
    first = rejected[0]
    assert first["groupKey"] and first["identities"][0]["fingerprint"], (
        "Original webhook lacked observable group and alert fingerprint")
    assert first["identities"][0]["startsAt"], "Original webhook lacked startsAt"
    assert not receipt_of(200), "Cannot count a rejected request as delivered"
    print("REAL_ALERTMANAGER_SAME_ALERT_REJECTED_PASS: first HTTP "
          + str(response_code) + ", one API submission, no accepted webhook",
          flush=True)
    ambiguous = RETRY_MODE in {"ambiguous-503", "ambiguous-no-idempotency"}
    if ambiguous:
        first_effects = committed_effects()
        assert len(first_effects) == 1, (
            "AMBIGUOUS_COMMIT_BEFORE_503_MISSING: rejected receiver POST "
            "did not persist exactly one genuine SQLite side effect")
        print("REAL_AMBIGUOUS_503_COMMIT_PASS: SQLite side effect committed "
              "before webhook returned HTTP 503; API submissions=1", flush=True)

    with State.lock:
        # In permanent 503 mutant do NOT recover: the unchanged positive
        # retry oracle must refuse to call a new unrelated alert successful.
        if RETRY_MODE != "permanent-503":
            State.fail_receiver = False

    if RETRY_MODE == "nonretryable-400":
        # Alertmanager's notifier marks 4xx unrecoverable. This verifies
        # no immediate retry within the first 8s, not "never retried".
        time.sleep(8)
        assert len(receipt_of(200)) == 0, (
            "HTTP 400 generated an unexpected immediate successful retry")
        assert len(receipt_of(400)) == 1, (
            "Unexpected duplicate 400 notification within the tested window")
        print("REAL_ALERTMANAGER_400_UNRECOVERABLE_PASS: no immediate "
              "same-alert retry within 8s; later group intervals UNTESTED",
              flush=True)
        return

    # Do not submit the same alert again; RetryStage must retry this exact
    # notification within the 20s group_interval, before a 1m repeat interval.
    deadline = time.monotonic() + 19
    while time.monotonic() < deadline and not receipt_of(200):
        time.sleep(.2)
    delivered = receipt_of(200)
    if not delivered:
        raise AssertionError("SAME_ALERT_RETRY_NOT_PROVEN: "
                             "receiver never accepted the original rejected "
                             "alert without another API submission; attempts="
                             + json.dumps(all_attempts(), default=str))
    success = delivered[0]
    assert api_submissions == 1, "Another API submission invalidates retry proof"
    assert success["groupKey"] == first["groupKey"], (
        "Unrelated grouped notification was misclassified as retry")
    assert success["identities"] == first["identities"], (
        "Different fingerprint/labels/startsAt was misclassified as same alert")
    assert success["status"] == first["status"] == "firing"
    assert success["observed_monotonic"] > first["observed_monotonic"]
    assert success["observed_monotonic"] - first["observed_monotonic"] < 20, (
        "Same alert arrived after notification context/repeat window")
    assert all(x["route"] == "/reliability" for x in rejected + delivered)
    print("REAL_ALERTMANAGER_SAME_ALERT_503_RETRY_PASS: "
          "one API submit, first webhook 503, then 200 with matching "
          "fingerprint, labels, startsAt, groupKey, firing state",
          flush=True)
    if ambiguous:
        later_effects = committed_effects()
        if len(later_effects) != 1 or later_effects[0] != first_effects[0]:
            raise AssertionError("DUPLICATE_NOTIFICATION_EFFECT_DETECTED: "
                                 "same real webhook retried, but SQLite "
                                 "committed " + str(len(later_effects))
                                 + " side effects; not exactly-once effect")
        print("REAL_AMBIGUOUS_RETRY_IDEMPOTENT_EFFECT_PASS: "
              "two real receiver attempts, one durable SQLite effect, "
              "same groupKey/fingerprint and only one producer POST",
              flush=True)
    print("SAME_ALERT_RETRY_LOCAL_ONLY: no durable queue guarantee, "
          "external pager, Prometheus source or human ACK", flush=True)


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
            if RETRY_MODE in {"ambiguous-503", "ambiguous-no-idempotency"}:
                State.effect_db = str(Path(scratch) / "webhook_effects.sqlite3")
                with sqlite3.connect(State.effect_db) as db:
                    db.execute("CREATE TABLE delivery_effects ("
                               "id INTEGER PRIMARY KEY, identity TEXT NOT NULL, "
                               "effect TEXT NOT NULL)")
                    if RETRY_MODE == "ambiguous-503":
                        db.execute("CREATE UNIQUE INDEX unique_notification_effect "
                                   "ON delivery_effects(identity)")
                    db.commit()
            config = Path(scratch) / "alertmanager.yml"
            config_text = TEMPLATE.read_text(encoding="utf8").replace(
                "__RECEIVER_PORT__", str(receiver_port))
            if RETRY_MODE != "baseline":
                # Disposable retry-specific context: 20s for notification
                # RetryStage; 1m repeat interval so a <20s success proves
                # actual retry rather than a scheduled repeat notification.
                config_text = config_text.replace("group_wait: 2s",
                                                  "group_wait: 1s")
                config_text = config_text.replace("group_interval: 5s",
                                                  "group_interval: 20s")
                config_text = config_text.replace("repeat_interval: 30s",
                                                  "repeat_interval: 1m")
            config.write_text(config_text, encoding="utf8")
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
            if RETRY_MODE == "baseline":
                perform(base)
            else:
                perform_same_notification_retry(base)
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
