"""Validate a disposable systemd unit definition without starting host services.

systemd-analyze verify checks unit syntax and dependency semantics. It does
NOT prove systemd manager activation, application health, or Rocky Linux.
"""
from pathlib import Path
import shutil
import subprocess
import tempfile

binary = shutil.which("systemd-analyze")
if not binary:
    raise AssertionError("systemd-analyze is required for this CI verification")

with tempfile.TemporaryDirectory(prefix="tsa-systemd-") as folder:
    unit = Path(folder) / "tsa-steward-synthetic.service"
    unit.write_text(
        "[Unit]\nDescription=Disposable TSA example HTTP service\nAfter=network.target\n"
        "[Service]\nType=simple\nUser=nobody\nExecStart=/usr/bin/python3 -m http.server 8765 --bind 127.0.0.1\n"
        "Restart=on-failure\nRestartSec=2s\nNoNewPrivileges=true\n"
        "[Install]\nWantedBy=multi-user.target\n", encoding="utf-8"
    )
    result = subprocess.run(
        [binary, "verify", str(unit)],
        capture_output=True, text=True, timeout=15
    )
    assert result.returncode == 0, (
        f"Systemd unit verification failed:\n{result.stdout}\n{result.stderr}"
    )
    print("PASS disposable systemd unit passes systemd-analyze verify")
    contents = unit.read_text(encoding="utf-8")
    assert "Restart=on-failure" in contents and "NoNewPrivileges=true" in contents
    print("PASS explicit restart and privilege policy present in sample unit")
    # Compare a genuine invalid unit with the known-good example. This verifies
    # that the checker can reject a missing executable, not just accept syntax.
    invalid = Path(folder) / "tsa-invalid-synthetic.service"
    invalid.write_text(contents.replace(
        "/usr/bin/python3 -m http.server 8765 --bind 127.0.0.1",
        "/nonexistent/tsa-intentionally-missing-binary",
    ), encoding="utf-8")
    rejected = subprocess.run(
        [binary, "verify", str(invalid)],
        capture_output=True, text=True, timeout=15,
    )
    assert rejected.returncode != 0, (
        "systemd-analyze unexpectedly accepted a nonexistent ExecStart binary"
    )
    print("PASS systemd-analyze rejects deliberately invalid ExecStart target")
    # A syntactically valid unit can still be unsafe if it runs as root.
    # Independently reject dangerous policy drift in the inspected sample.
    assert "User=root" not in contents and "User=nobody" in contents, (
        "Example unit must run under a non-root synthetic identity"
    )
    assert "Restart=always" not in contents, (
        "Exercise assumes failure-triggered recovery, not unconditional restarts"
    )
    print("PASS sample policy keeps a non-root identity and failure-only restart")


