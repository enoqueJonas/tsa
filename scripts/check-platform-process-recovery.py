"""Verify process failure and HTTP recovery as separate observable events.

This is a disposable child process running an ephemeral localhost service,
not systemd or a deployed Steward application. It never touches production.
"""
import http.server
import os
import signal
import socket
import subprocess
import sys
import textwrap
import time
import urllib.error
import urllib.request

with socket.socket() as sock:
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
url = f"http://127.0.0.1:{port}/health"
code = textwrap.dedent("""
    import http.server
    import sys
    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            data = b"synthetic-child-ok\\n"
            self.send_response(200)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        def log_message(self, *args):
            pass
    http.server.HTTPServer(("127.0.0.1", int(sys.argv[1])), Handler).serve_forever()
""")

def request_ok():
    try:
        with urllib.request.urlopen(url, timeout=0.3) as response:
            return response.status == 200 and response.read() == b"synthetic-child-ok\\n"
    except (urllib.error.URLError, TimeoutError, OSError):
        return False

def await_state(expected, seconds=6):
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        if request_ok() is expected:
            return
        time.sleep(0.07)
    raise AssertionError(f"HTTP state did not become {expected}: {url}")

def spawn():
    return subprocess.Popen([sys.executable, "-u", "-c", code, str(port)], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

child = spawn()
try:
    await_state(True)
    initial_pid = child.pid
    assert child.poll() is None
    print("PASS spawned child process and independently verified HTTP response")
    child.send_signal(signal.SIGTERM)
    child.wait(timeout=5)
    await_state(False)
    print("PASS SIGTERM ended child and HTTP request independently failed")
    child = spawn()
    assert child.pid != initial_pid
    await_state(True)
    print("PASS new child PID restored HTTP response")
finally:
    if child.poll() is None:
        child.terminate()
        try:
            child.wait(timeout=5)
        except subprocess.TimeoutExpired:
            child.kill()
            child.wait(timeout=5)
