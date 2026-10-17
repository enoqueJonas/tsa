"""Execute disposable filesystem/symlink observations for Platform Builder.

Only files created inside a temporary directory are modified. This is
Ubuntu CI evidence, never proof of learner NAS/Proxmox storage recovery.
"""
import os
from pathlib import Path
import stat
import subprocess
import tempfile


def check(*command):
    return subprocess.run(command, capture_output=True, text=True, check=True, timeout=10).stdout


with tempfile.TemporaryDirectory(prefix="tsa-platform-fs-") as sandbox:
    root = Path(sandbox)
    original = root / "example.txt"
    original.write_text("sample\n", encoding="utf-8")
    link = root / "current"
    link.symlink_to(original)
    assert link.is_symlink()
    assert link.resolve() == original.resolve()
    assert link.read_text(encoding="utf-8") == "sample\n"
    print("PASS symlink points to an independently readable file")

    details = check("stat", str(original))
    assert "Size:" in details and "File:" in details
    assert original.name in check("ls", "-la", str(root))
    print("PASS stat and ls identify a disposable file")

    original.chmod(0o640)
    mode = stat.S_IMODE(original.stat().st_mode)
    assert mode == 0o640
    print("PASS POSIX file mode changed and independently observed")

    mount = check("df", "-hT", str(root))
    assert "Filesystem" in mount
    backing = check("findmnt", "-T", str(root))
    assert backing.strip()
    print("PASS backing filesystem observations are available")

    original.unlink()
    assert link.is_symlink() and not link.exists()
    print("PASS dangling symlink distinguished from an existing target")
