#!/usr/bin/env python3
"""Official Prometheus -> official Alertmanager -> real localhost webhook.
Synthetic metric source, never a production responder or Steward deployment.
Requires Linux Docker host networking. Uses the exact files published in TSA.
"""
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

PROMETHEUS_IMAGE = "prom/prometheus:v3.13.3"
ALERTMANAGER_IMAGE = "prom/alertmanager:v0.28.1"
RULE_VARIANT = os.getenv("TSA_FORWARD_RULE_VARIANT", "correct")
assert RULE_VARIANT in {"correct", "wrong-condition"}, RULE_VARIANT
SCENARIO = os.getenv("TSA_FORWARD_SCENARIO", "normal")
assert SCENARIO in {"normal", "alertmanager-outage", "outage-without-disconnect"}, SCENARIO
AM_TEMPLATE = Path("labs/reliability-alertmanager/alertmanager.yml.template")
assert AM_TEMPLATE.exists()

def port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]

class Source:
    active = False
    receipts = []
    lock = threading.Lock()

class MetricSource(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass
    def do_GET(self):
        if self.path != "/metrics":
            self.send_error(404)
            return
        with Source.lock:
            value = int(Source.active)
        body = ("# HELP tsa_forwarding_probe Synthetic controlled alert condition.\n"
                "# TYPE tsa_forwarding_probe gauge\n"
                f'tsa_forwarding_probe{{service="steward-api",environment="tsa-loopback"}} {value}\n').encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; version=0.0.4; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

class Receiver(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass
    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0"))
        assert 0 < length < 100000
        payload = json.loads(self.rfile.read(length))
        alert_names = [a.get("labels", {}).get("alertname") for a in payload.get("alerts", [])]
        observation = {
            "path": self.path, "status": payload.get("status"),
            "alert_names": alert_names,
            "alert_statuses": [a.get("status") for a in payload.get("alerts", [])]
        }
        with Source.lock:
            Source.receipts.append(observation)
        self.send_response(200)
        self.send_header("Content-Length", "0")
        self.end_headers()

def query(url):
    try:
        with urlopen(Request(url), timeout=3) as res:
            return res.status, res.read().decode()
    except HTTPError as exc:
        return exc.code, exc.read().decode()

def wait_for(description, predicate, seconds=55):
    stop = time.monotonic()+seconds
    while time.monotonic()<stop:
        with Source.lock:
            snap = [x.copy() for x in Source.receipts]
        if predicate(snap):
            return snap
        time.sleep(.3)
    raise AssertionError(description + ": no qualifying receiver delivery; receipts=" + json.dumps(snap))

def start_container(cmd):
    return subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)

def main():
    assert os.name=="posix", "Requires a disposable Linux Docker runner"
    metrics_port, am_port, prom_port, webhook_port = port(), port(), port(), port()
    am_container_name = "tsa-forward-am-" + str(am_port)
    assert len({metrics_port,am_port,prom_port,webhook_port})==4
    metrics = ThreadingHTTPServer(("127.0.0.1", metrics_port), MetricSource)
    receiver = ThreadingHTTPServer(("127.0.0.1", webhook_port), Receiver)
    threads=[]
    for server in (metrics, receiver):
        t=threading.Thread(target=server.serve_forever,daemon=True)
        t.start()
        threads.append(t)
    children=[]
    try:
        with tempfile.TemporaryDirectory(prefix="tsa-forwarding-") as d:
            root=Path(d)
            # Prometheus image runs as an unprivileged user. The temporary
            # directory is 0700 by default; allow traversal of just this
            # disposable lab directory. Files remain read-only Docker mounts.
            os.chmod(root, 0o755)
            am_config=root/"alertmanager.yml"
            am_config.write_text(AM_TEMPLATE.read_text().replace("__RECEIVER_PORT__",str(webhook_port)))
            condition = "== 1" if RULE_VARIANT=="correct" else "== 0"
            (root/"rules.yml").write_text(
                "groups:\n  - name: tsa-probe\n    interval: 1s\n    rules:\n"
                "      - alert: TSAForwardingProbe\n"
                f"        expr: tsa_forwarding_probe{{service=\"steward-api\"}} {condition}\n"
                "        for: 0s\n        labels:\n"
                "          severity: ticket\n          team: reliability\n"
                "        annotations:\n          summary: Synthetic notification transport proof\n"
            )
            (root/"prometheus.yml").write_text(
                "global:\n  scrape_interval: 1s\n  evaluation_interval: 1s\n"
                "rule_files:\n  - /etc/tsa/rules.yml\n"
                "alerting:\n  alertmanagers:\n"
                f"  - static_configs:\n    - targets: ['127.0.0.1:{am_port}']\n"
                "scrape_configs:\n  - job_name: steward-api\n"
                "    static_configs:\n"
                f"      - targets: ['127.0.0.1:{metrics_port}']\n"
            )
            am_command = [
                "docker","run","--rm","--network","host",
                "--name",am_container_name,
                "-v",str(am_config)+":/etc/alertmanager.yml:ro",
                "--entrypoint","/bin/alertmanager",ALERTMANAGER_IMAGE,
                "--config.file=/etc/alertmanager.yml",
                "--web.listen-address=127.0.0.1:"+str(am_port),
                "--cluster.listen-address="
            ]
            children.append(start_container(am_command))
            children.append(start_container([
                "docker","run","--rm","--network","host",
                "-v",str(root)+":/etc/tsa:ro","--entrypoint","/bin/prometheus",
                PROMETHEUS_IMAGE,"--config.file=/etc/tsa/prometheus.yml",
                "--web.listen-address=127.0.0.1:"+str(prom_port),
                "--storage.tsdb.path=/tmp/tsa-prometheus",
                "--storage.tsdb.retention.time=1h",
                "--rules.alert.resend-delay=5s"
            ]))
            for name,url in [("Alertmanager","http://127.0.0.1:"+str(am_port)+"/-/ready"),
                             ("Prometheus","http://127.0.0.1:"+str(prom_port)+"/-/ready")]:
                deadline=time.monotonic()+35
                while time.monotonic()<deadline:
                    for component, child in zip(("Alertmanager", "Prometheus"), children):
                        if child.poll() is not None:
                            diagnostic = child.stderr.read()[-2500:] if child.stderr else ""
                            raise AssertionError(component + " container exited before ready; exit="
                                                 + str(child.returncode) + " stderr=" + diagnostic)
                    try:
                        if query(url)[0]==200:
                            break
                    except (URLError,TimeoutError,ConnectionError):
                        pass
                    time.sleep(.25)
                else:
                    raise AssertionError(name+" never became ready")
            # Require both real Prometheus scrape and alert query to have actual series.
            target_url="http://127.0.0.1:"+str(prom_port)+"/api/v1/query?query=up%7Bjob%3D%22steward-api%22%7D"
            deadline=time.monotonic()+20
            while time.monotonic()<deadline:
                data=json.loads(query(target_url)[1])
                items=data.get("data",{}).get("result",[])
                if items and items[0].get("value",[])[1]=="1":
                    break
                time.sleep(.25)
            else:
                raise AssertionError("Prometheus did not scrape actual localhost /metrics")
            print("REAL_PROMETHEUS_SCRAPE_PASS: up=1 for synthetic local metrics source",flush=True)
            # A broken ==0 alert fires before the intended incident.
            # Wait past the disposable 2s Alertmanager group_wait, then fail.
            time.sleep(5)
            with Source.lock:
                baseline_receipts = list(Source.receipts)
            assert not any("TSAForwardingProbe" in x["alert_names"]
                           for x in baseline_receipts), (
                "Premature alert before synthetic impact condition: "
                + json.dumps(baseline_receipts))
            print("PROMETHEUS_FORWARDING_BASELINE_PASS: inactive gauge sent no alert",flush=True)
            if SCENARIO in {"alertmanager-outage", "outage-without-disconnect"}:
                # This branch runs real Prometheus+AM after readiness, but
                # intentionally makes Alertmanager unreachable as the alert fires.
                if SCENARIO == "alertmanager-outage":
                    # Hard loss of Alertmanager availability rather than a
                    # suspended TCP socket whose timeout may exceed the test.
                    # Disposable --rm container; restart a new instance below.
                    subprocess.run(["docker","stop","--time","1",am_container_name],
                                   check=True,timeout=16,stdout=subprocess.DEVNULL)
                with Source.lock:
                    Source.active = True
                alert_api = "http://127.0.0.1:"+str(prom_port)+"/api/v1/alerts"
                until = time.monotonic() + 24
                while time.monotonic() < until:
                    result = json.loads(query(alert_api)[1])
                    if any(a.get("labels",{}).get("alertname")=="TSAForwardingProbe"
                           and a.get("state")=="firing"
                           for a in result.get("data",{}).get("alerts",[])):
                        break
                    time.sleep(.3)
                else:
                    raise AssertionError("Prometheus itself never evaluated synthetic alert firing")
                print("PROMETHEUS_RULE_STILL_FIRING_WHILE_ALERTMANAGER_UNREACHABLE_PASS",
                      flush=True)
                # This metric is observed from the real Prometheus process.
                # An inaccessible receiver is NOT a successful notification.
                errors_query = ("http://127.0.0.1:"+str(prom_port)
                                +"/api/v1/query?query=prometheus_notifications_errors_total")
                stop = time.monotonic() + 32
                while time.monotonic() < stop:
                    with Source.lock:
                        early_receipts = [x.copy() for x in Source.receipts]
                    assert not any("TSAForwardingProbe" in x["alert_names"]
                                   and x["status"]=="firing" for x in early_receipts), (
                        "Receiver accepted an alert during an asserted Alertmanager outage: "
                        +json.dumps(early_receipts))
                    result = json.loads(query(errors_query)[1])
                    values=result.get("data",{}).get("result",[])
                    if any(float(x.get("value",[0,"0"])[1])>0 for x in values):
                        break
                    time.sleep(.35)
                else:
                    report = query("http://127.0.0.1:"+str(prom_port)+"/metrics")[1]
                    observed = [line for line in report.splitlines()
                                if line.startswith("prometheus_notifications_")
                                and not line.startswith("#")]
                    raise AssertionError(
                        "Expected real Prometheus notification errors during unavailable Alertmanager; "
                        + "observed=" + json.dumps(observed[:30]))
                print("REAL_PROMETHEUS_NOTIFICATION_ERRORS_PASS: firing rule but failed forwarding",
                      flush=True)
                if SCENARIO == "alertmanager-outage":
                    # A new disposable container restores the same config
                    # and localhost receiver. This is a hard restart, not
                    # proof of restoring persisted notification state.
                    am_recovery = [x for x in am_command]
                    am_recovery[am_recovery.index(am_container_name)] = (
                        am_container_name + "-restarted")
                    children.append(start_container(am_recovery))
                    deadline = time.monotonic() + 35
                    while time.monotonic() < deadline:
                        if children[-1].poll() is not None:
                            raise AssertionError("Restarted Alertmanager exited before ready: "
                                                 + children[-1].stderr.read()[-1700:])
                        try:
                            if query("http://127.0.0.1:"+str(am_port)+"/-/ready")[0] == 200:
                                break
                        except (URLError, TimeoutError, ConnectionError):
                            pass
                        time.sleep(.3)
                    else:
                        raise AssertionError("Restarted Alertmanager did not become ready")
                # Do not assume the rejected alert was buffered or retry
                # exactly once: prove a fresh actual HTTP delivery after recovery.
                wait_for("recovered Alertmanager firing webhook",lambda xs:any(
                    x["path"]=="/reliability" and x["status"]=="firing"
                    and "TSAForwardingProbe" in x["alert_names"] for x in xs),seconds=65)
                print("REAL_PROMETHEUS_ALERTMANAGER_RECOVERY_PASS: post-outage receiver accepted firing",
                      flush=True)
            else:
                with Source.lock:
                    Source.active=True
            received=wait_for("Prometheus-generated firing alert",lambda xs:any(
                x["path"]=="/reliability" and x["status"]=="firing"
                and "TSAForwardingProbe" in x["alert_names"] for x in xs))
            assert len([x for x in received if "TSAForwardingProbe" in x["alert_names"] and x["path"]!="/reliability"])==0
            print("PROMETHEUS_TO_ALERTMANAGER_TO_WEBHOOK_FIRING_PASS: actual delivery",flush=True)
            with Source.lock:
                Source.active=False
            wait_for("Prometheus-generated resolved alert",lambda xs:any(
                x["path"]=="/reliability" and x["status"]=="resolved"
                and "TSAForwardingProbe" in x["alert_names"] for x in xs),seconds=55)
            print("PROMETHEUS_TO_ALERTMANAGER_TO_WEBHOOK_RESOLVED_PASS: real resolved delivery",flush=True)
            print("LOCAL_ONLY: real Prometheus/Alertmanager transport, synthetic signal, no Steward/PagerDuty/human acknowledgment",flush=True)
    finally:
        for p in children:
            if p.poll() is None:
                p.terminate()
        for p in children:
            if p.poll() is None:
                try: p.wait(timeout=7)
                except subprocess.TimeoutExpired: p.kill()
            if p.stderr: p.stderr.close()
        for server in (metrics,receiver):
            server.shutdown()
            server.server_close()
        for t in threads: t.join(timeout=3)

if __name__=="__main__":
    main()
