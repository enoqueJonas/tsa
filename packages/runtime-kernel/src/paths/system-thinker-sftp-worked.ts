import type {LearningResource} from "../activities/content";

// Exactly learner-visible Python executed by scripts/check-system-thinker-sftp.mjs.
// Demonstrates local SSH protocol, not production security or external Steward integration.
export const sftpWorkedSections = [
  {
    "title": "SSH is the transport; SFTP is its file subsystem",
    "paragraphs": [
      "An SFTP transfer is not an FTP control connection with TLS added. SSH authenticates the server's **host key** and the client's **user key**, negotiates an encrypted transport and opens an SFTP subsystem on an SSH channel. The file protocol sends operations such as opening, writing, listing and renaming remote paths. FTPS instead preserves FTP semantics and secures them with TLS; this is why an FTP passive-port configuration does not magically become an SFTP one.",
      "In this isolated lab the client must trust an expected host public key for `[127.0.0.1]:<assigned-port>` and the server must authorize the client's key. A client that sets `known_hosts=None` may connect without verifying the server's identity, defeating the purpose of this exercise. Never silence host-key verification merely to make a test pass. Real key provisioning, revocation, ACLs, ciphers, audit logs and bastion/routing policy belong in the later Security Steward deployment.",
      "The program starts a genuine AsyncSSH SFTP server on a disposable loopback TCP port and uses an independent SSH client session over the network protocol. A `chroot`-style SFTP path mapping keeps the example's file operations inside a temporary exercise directory. This is a library-level virtual path mapping, **not** an OS-enforced jail or a production isolation boundary."
    ]
  },
  {
    "title": "Execute positive and negative SSH authentication and SFTP delivery",
    "paragraphs": [
      "Prerequisites: Python 3.12, a disposable virtual environment and the earlier file-envelope/replay-identity lessons. Install `python -m pip install 'asyncssh>=2.20,<3'`. Save the entire code as `sftp_local.py` and execute `python sftp_local.py`. No live enterprise credentials are needed. The script generates ephemeral client/host keys inside a temporary directory and removes them afterward.",
      "First the client presents a *wrong pinned server host key*: SSH setup must refuse the connection before files can be read or written. Next the client uses an unauthorized user key; the server must deny authentication. A valid, pinned connection then uploads a partially written CSV to `daily.csv.part`. Only after writing the complete content does it rename the file to `daily.csv`. The client downloads the final file and compares the SHA-256 digest of the received bytes against the original data.",
      "Expected output, in order: `wrong SSH host key refused: True`, `wrong client public key refused: True`, `partial upload not consumer-ready: True`, `completed SFTP rename visible: True`, `remote SFTP round-trip SHA256 matches: True`, `stopped SSH transport connection refused: True`. The script must exit with status zero, and failures must not be hidden. This proves one real loopback SSH/SFTP transfer and distinct rejection boundaries, not a remote managed-file-transfer endpoint or an authorized Steward domain mutation.",
      "A completed rename only signals file readiness **under the agreed producer/consumer convention**. It does not validate CSV fields, schema version, business authority, checksum manifest or idempotent replay. Combine the transfer proof with the earlier file-handoff SQLite ledger to reject repeats and conflicting same-ID deliveries. The consumer must still check its own file contract and ownership rules."
    ],
    "code": {
      "language": "python",
      "caption": "Real local SFTP with pinned SSH host key, user-key rejection, partial upload, rename, integrity and connection outage",
      "code": "# Local SFTP/SSH protocol experiment. Requires Python 3.12 and AsyncSSH.\n# python -m pip install 'asyncssh>=2.20,<3'\n# This is an isolated loopback lab, NOT a managed enterprise SFTP service.\nimport asyncio\nimport hashlib\nimport tempfile\nfrom pathlib import Path\n\nimport asyncssh\n\nCONTENT = b\"service_id,lifecycle\\nsvc-42,retired\\n\"\n\nasync def connect(port, key, known_hosts):\n    return await asyncssh.connect(\n        \"127.0.0.1\",\n        port=port,\n        username=\"learner\",\n        client_keys=[key],\n        known_hosts=str(known_hosts),\n        password=None,\n        agent_path=None,\n        login_timeout=5,\n    )\n\nasync def run():\n    with tempfile.TemporaryDirectory(prefix=\"tsa-sftp-\") as scratch:\n        root = Path(scratch)\n        remote = root / \"remote\"\n        remote.mkdir()\n        user_key = asyncssh.generate_private_key(\"ssh-ed25519\")\n        other_key = asyncssh.generate_private_key(\"ssh-ed25519\")\n        server_key = asyncssh.generate_private_key(\"ssh-ed25519\")\n        wrong_server_key = asyncssh.generate_private_key(\"ssh-ed25519\")\n\n        auth_file = root / \"authorized_keys\"\n        auth_file.write_bytes(user_key.export_public_key())\n\n        server = await asyncssh.listen(\n            \"127.0.0.1\", 0,\n            server_host_keys=[server_key],\n            authorized_client_keys=str(auth_file),\n            sftp_factory=lambda channel: asyncssh.SFTPServer(\n                channel, chroot=str(remote)),\n        )\n        port = server.get_port()\n        assert port > 0\n        trusted = root / \"known_hosts\"\n        # The nonstandard port belongs in OpenSSH's [host]:port syntax.\n        trusted.write_bytes(\n            f\"[127.0.0.1]:{port} \".encode() + server_key.export_public_key())\n        untrusted = root / \"wrong_known_hosts\"\n        untrusted.write_bytes(\n            f\"[127.0.0.1]:{port} \".encode() +\n            wrong_server_key.export_public_key())\n\n        try:\n            try:\n                async with await connect(port, user_key, untrusted):\n                    raise AssertionError(\"Bad host key was trusted\")\n            except asyncssh.Error:\n                print(\"wrong SSH host key refused: True\")\n\n            try:\n                async with await connect(port, other_key, trusted):\n                    raise AssertionError(\"Unauthorized client was allowed\")\n            except asyncssh.PermissionDenied:\n                print(\"wrong client public key refused: True\")\n\n            async with await connect(port, user_key, trusted) as conn:\n                async with conn.start_sftp_client() as sftp:\n                    # A partial remote name is deliberately NOT consumer-ready.\n                    async with sftp.open(\"/daily.csv.part\", \"wb\") as upload:\n                        await upload.write(CONTENT[:12])\n                        before = await sftp.listdir(\"/\")\n                        assert \"daily.csv.part\" in before\n                        assert \"daily.csv\" not in before\n                        print(\"partial upload not consumer-ready: True\")\n                        await upload.write(CONTENT[12:])\n                    # Same remote SFTP directory: rename marks complete delivery.\n                    await sftp.rename(\"/daily.csv.part\", \"/daily.csv\")\n                    after = await sftp.listdir(\"/\")\n                    assert \"daily.csv\" in after and \"daily.csv.part\" not in after\n                    print(\"completed SFTP rename visible: True\")\n                    download = root / \"downloaded.csv\"\n                    await sftp.get(\"/daily.csv\", str(download))\n                    good = (\n                        hashlib.sha256(download.read_bytes()).digest() ==\n                        hashlib.sha256(CONTENT).digest()\n                    )\n                    assert good\n                    print(\"remote SFTP round-trip SHA256 matches: True\")\n        finally:\n            server.close()\n            await server.wait_closed()\n        try:\n            async with await connect(port, user_key, trusted):\n                raise AssertionError(\"Stopped provider unexpectedly accepted SSH\")\n        except OSError:\n            print(\"stopped SSH transport connection refused: True\")\n\nasyncio.run(run())"
    }
  },
  {
    "title": "What this experiment leaves to the secure migration",
    "paragraphs": [
      "Make an evidence table comparing the old FTP loopback test and the new SFTP loopback test. FTP's passive data connection and plaintext credential risk disappear from the SFTP protocol, but host-key onboarding, client-key lifecycle, server-side file permissions, route trust, timeout budgets and key rotation are new operational responsibilities. A hostname change or key rotation should be treated as an explicit trust-change event with an audited verification procedure.",
      "Negative challenge: disable host-key pinning in a throwaway copy, and explain exactly why the transfer may still succeed while the security evidence becomes invalid. Then simulate consumer crash after rename: the file remains present. Reprocessing must be safe because the envelope/ledger deduplicates the durable delivery identity, not because SFTP is encrypted.",
      "The protocol experiment does **not** test actual remote transport across a firewall, FTPS negotiation, third-party vendor identity, host certificates, production ciphers, vulnerability posture or Storage-to-Steward integration. The Security Steward lesson must retain responsibility for secure deployment and migration/cutover sign-off."
    ]
  }
];
export const sftpWorkedResources: LearningResource[] = [
  {
    "title": "AsyncSSH — SFTP server/client examples",
    "url": "https://asyncssh.readthedocs.io/en/latest/",
    "kind": "reference"
  },
  {
    "title": "AsyncSSH — SFTPServer path mapping and server options",
    "url": "https://asyncssh.readthedocs.io/en/latest/api.html",
    "kind": "reference"
  },
  {
    "title": "OpenSSH — client host-key verification",
    "url": "https://www.openssh.com/manual.html",
    "kind": "reference"
  },
  {
    "title": "RFC 4251 — SSH Protocol Architecture",
    "url": "https://www.rfc-editor.org/rfc/rfc4251",
    "kind": "reference"
  }
];
