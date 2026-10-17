"""Exercise non-destructive operating-system observation examples in Linux CI.

These observations are from the disposable GitHub Actions Ubuntu runner;
they do not certify learner Rocky Linux or a deployed Steward process.
"""
import os
import re
import subprocess


def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True, timeout=15)


cpu = run("nproc").stdout.strip()
assert cpu.isdigit() and int(cpu) >= 1, cpu
print("PASS nproc reports a positive count")

vmstat = run("vmstat", "1", "5").stdout.strip().splitlines()
assert len(vmstat) >= 7, f"Expected headers and five reports: {vmstat}"
samples = [line for line in vmstat if re.match(r"^\s*\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+", line)]
assert len(samples) == 5, f"Expected exactly five vmstat reports, got {len(samples)}"
print("PASS vmstat emits five bounded reports")

pid = os.getpid()
with open(f"/proc/{pid}/status", encoding="utf-8") as status:
    text = status.read()
assert f"Pid:\t{pid}" in text, "Cannot match procfs status to the running process"
assert os.path.isdir(f"/proc/{pid}/fd")
print("PASS procfs process status and descriptor directory are observable")
fields = run("grep", "-E", "^(Name|Pid|PPid|Threads):", f"/proc/{pid}/status").stdout
for label in ("Name:", "Pid:", "PPid:", "Threads:"):
    assert label in fields, f"Missing {label} in procfs status"
print("PASS procfs grep example exposes process and thread fields")


device = run("stat", "/var")
assert "File:" in device.stdout
print("PASS existing /var target is inspectable with stat")
