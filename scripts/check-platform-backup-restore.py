"""Verify actual backup/restore integrity inside disposable CI storage.

No real system files, NAS shares, databases or cloud backups are accessed.
"""
from hashlib import sha256
from pathlib import Path
import shutil
import tempfile

def digest(path):
    return sha256(path.read_bytes()).hexdigest()

with tempfile.TemporaryDirectory(prefix="tsa-restore-") as folder:
    root = Path(folder)
    live = root / "live"
    backup = root / "backup"
    restored = root / "restored"
    live.mkdir()
    (live / "configuration.env").write_text("HOST=localhost\nMODE=lab\n", encoding="utf-8")
    (live / "records.csv").write_text("id,value\n1,original\n2,verified\n", encoding="utf-8")
    expected = {f.name: digest(f) for f in live.iterdir()}
    shutil.copytree(live, backup)
    assert {f.name: digest(f) for f in backup.iterdir()} == expected
    print("PASS backup matches original file hashes")

    (live / "configuration.env").write_text("HOST=changed\n", encoding="utf-8")
    (live / "records.csv").unlink()
    assert {f.name: digest(f) for f in live.iterdir()} != expected
    print("PASS destructive lab mutation is detectable")

    shutil.copytree(backup, restored)
    actual = {f.name: digest(f) for f in restored.iterdir()}
    assert actual == expected, (actual, expected)
    assert (restored / "records.csv").read_text(encoding="utf-8").count("\n") == 3
    print("PASS independent restore reconstructs file inventory and SHA256 hashes")

    # A corrupt backup must be rejected rather than treated as recoverable.
    (backup / "records.csv").write_text("corrupted\n", encoding="utf-8")
    assert digest(backup / "records.csv") != expected["records.csv"]
    print("PASS corrupted backup is detected through integrity mismatch")
