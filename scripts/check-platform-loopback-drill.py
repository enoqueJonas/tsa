"""Safe infrastructure boundary drill: service reachability, outage, restoration.

Runs on a disposable CI loopback service. It does NOT validate the user's
Proxmox, Rocky Linux, firewalld, WireGuard, NFS, or Windows environment.
"""
from contextlib import closing
import http.server
import socket
import threading
import urllib.error
import urllib.request


def free_port():
    with closing(socket.socket()) as conn:
        conn.bind(("127.0.0.1", 0))
        return conn.getsockname()[1]


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        body = b"Steward synthetic health: ok\n"
        self.send_response(200)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


def check(url):
    with urllib.request.urlopen(url, timeout=3) as response:
        assert response.status == 200
        assert b"synthetic health: ok" in response.read()


port = free_port()
url = f"http://127.0.0.1:{port}/health"
server = http.server.HTTPServer(("127.0.0.1", port), Handler)
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
check(url)
print("PASS healthy local HTTP listener")

server.shutdown()
thread.join(timeout=3)
server.server_close()
try:
    check(url)
except (urllib.error.URLError, ConnectionRefusedError, TimeoutError, OSError):
    print("PASS listener outage detected independently of application data")
else:
    raise AssertionError("Outage test did not observe a failed connection")

server = http.server.HTTPServer(("127.0.0.1", port), Handler)
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
check(url)
print("PASS service restored and end-to-end HTTP path verified")
server.shutdown()
thread.join(timeout=3)
server.server_close()
