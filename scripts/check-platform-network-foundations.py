"""Execute local TCP, UDP and resolver evidence without external network access.

The exercises are scoped to localhost on a disposable CI runner, not the
learner's VM routing, firewall, DNS, WireGuard or external connectivity.
"""
import socket
import threading

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.bind(("127.0.0.1", 0))
    server.listen(1)
    port = server.getsockname()[1]
    received = []
    def serve():
        conn, address = server.accept()
        with conn:
            received.append(conn.recv(1024))
            conn.sendall(b"tcp-response")
    worker = threading.Thread(target=serve, daemon=True)
    worker.start()
    with socket.create_connection(("127.0.0.1", port), timeout=3) as client:
        client.sendall(b"tcp-request")
        assert client.recv(1024) == b"tcp-response"
    worker.join(timeout=3)
    assert not worker.is_alive()
    assert received == [b"tcp-request"]
    print("PASS TCP loopback request, accept and response")

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as server:
    server.bind(("127.0.0.1", 0))
    server.settimeout(3)
    port = server.getsockname()[1]
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as client:
        client.sendto(b"udp-request", ("127.0.0.1", port))
        message, source = server.recvfrom(1024)
        assert message == b"udp-request"
        server.sendto(b"udp-response", source)
        client.settimeout(3)
        reply, reply_source = client.recvfrom(1024)
        assert reply == b"udp-response"
        assert reply_source[1] == port
    print("PASS UDP datagram send, receipt and response")

names = socket.getaddrinfo("localhost", None, type=socket.SOCK_STREAM)
assert names
addresses = {result[4][0] for result in names}
assert "127.0.0.1" in addresses or "::1" in addresses
print("PASS local hostname resolution using configured system resolver")
