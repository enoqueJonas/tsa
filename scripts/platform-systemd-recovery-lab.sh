#!/usr/bin/env bash
# Disposable, real systemd-manager restart drill for a dedicated Rocky Linux VM.
# This script must be executed locally on the learner-owned VM, NOT in CI.
set -Eeuo pipefail
if [[ "${EUID}" -eq 0 ]]; then echo "Run as a normal sudo-capable user, not root." >&2; exit 2; fi
if [[ "$(ps -p 1 -o comm=)" != "systemd" ]]; then echo "Requires systemd as PID 1." >&2; exit 2; fi
for c in sudo systemctl python3 curl mktemp; do command -v "$c" >/dev/null || { echo "Missing $c" >&2; exit 2; }; done
unit="tsa-recovery-lab-${UID}-$$"
work="$(mktemp -d)"
port=""
cleanup() {
  sudo systemctl stop "${unit}.service" >/dev/null 2>&1 || true
  sudo rm -f "/etc/systemd/system/${unit}.service"
  sudo systemctl daemon-reload >/dev/null 2>&1 || true
  rm -rf -- "$work"
}
trap cleanup EXIT
# Allocate the port in a private localhost-only listener then close it.
port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1",0)); print(s.getsockname()[1]); s.close()')"
cat > "$work/server.py" <<'PY'
import http.server
import sys
class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        data = b"tsa-systemd-recovery-ok\n" if self.path == "/health" else b"not found\n"
        self.send_response(200 if self.path == "/health" else 404)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)
    def log_message(self, *_):
        pass
http.server.HTTPServer(("127.0.0.1", int(sys.argv[1])), Handler).serve_forever()
PY
chmod 755 "$work"
chmod 644 "$work/server.py"
sudo tee "/etc/systemd/system/${unit}.service" >/dev/null <<EOF
[Unit]
Description=Disposable TSA systemd recovery exercise
[Service]
Type=simple
User=$(id -un)
WorkingDirectory=$work
ExecStart=$(command -v python3) $work/server.py $port
Restart=on-failure
RestartSec=1s
NoNewPrivileges=true
[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl start "${unit}.service"
healthy() { curl --noproxy '*' --fail --silent --max-time 1 "http://127.0.0.1:$port/health" | grep -qx "tsa-systemd-recovery-ok"; }
for attempt in {1..40}; do healthy && break; sleep 0.25; done
healthy || { echo "FAIL initial HTTP health"; exit 1; }
oldpid="$(systemctl show "${unit}.service" --value -p MainPID)"
[[ "$oldpid" =~ ^[1-9][0-9]*$ ]] || { echo "FAIL invalid initial PID"; exit 1; }
echo "PASS initial PID=$oldpid and HTTP response"
sudo kill -KILL "$oldpid"
newpid=""
for attempt in {1..80}; do
  current="$(systemctl show "${unit}.service" --value -p MainPID)"
  if [[ "$current" =~ ^[1-9][0-9]*$ && "$current" != "$oldpid" ]] && healthy; then newpid="$current"; break; fi
  sleep 0.25
done
[[ -n "$newpid" ]] || { sudo journalctl -u "${unit}.service" -n 30 --no-pager; echo "FAIL no systemd-managed recovery"; exit 1; }
sudo systemctl is-active --quiet "${unit}.service"
restarts="$(systemctl show "${unit}.service" --value -p NRestarts)"
[[ "$restarts" =~ ^[1-9][0-9]*$ ]] || { echo "FAIL systemd did not record a restart (NRestarts=$restarts)" >&2; exit 1; }
policy="$(systemctl show "${unit}.service" --value -p Restart)"
[[ "$policy" == "on-failure" ]] || { echo "FAIL unexpected restart policy: $policy" >&2; exit 1; }
echo "PASS systemd policy=$policy NRestarts=$restarts"
echo "PASS automatic systemd restart old_pid=$oldpid new_pid=$newpid and independent HTTP health"
sudo journalctl -u "${unit}.service" -n 20 --no-pager
