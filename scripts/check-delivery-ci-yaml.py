"""Source-derived GitLab job graph teaching proof: LOCAL simulator, NOT GitLab.
Parse the exact YAML rendered in the original Jobs, Stages and Dependencies
reading, execute its actual job scripts in separate temporary workspaces, and
show wrong dependency or missing artifact breaks the evidence contract.
"""
from __future__ import annotations

import copy
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

import yaml

SOURCE = Path("packages/runtime-kernel/src/paths/delivery-ci-dependency-worked.ts").read_text()
match = re.search(r'export const ciGitlabCandidateYaml = ("(?:\\.|[^"\\])*");', SOURCE)
assert match, "Could not extract byte-exact published GitLab YAML"
published = json.loads(match.group(1))
pipeline = yaml.safe_load(published)
assert isinstance(pipeline, dict), "Published YAML did not parse to a job mapping"

STAGES = ["verify", "build", "inspect"]
JOBS = ["fixture_check", "unit_test", "candidate_manifest", "candidate_audit"]
SHA = "d" * 40  # Invented revision, NOT an actual repository SHA

def dependencies(job):
    needs = job.get("needs", [])
    return [(item, True) if isinstance(item, str)
            else (item["job"], item.get("artifacts", True))
            for item in needs]

def validate_structure(config):
    assert config["default"]["image"] == "python:3.12-slim", "Learner YAML must declare a Python-capable Docker executor image"
    assert config["stages"] == STAGES
    assert all(name in config for name in JOBS)
    assert config["fixture_check"]["stage"] == "verify"
    assert config["unit_test"]["stage"] == "verify"
    assert config["candidate_manifest"]["stage"] == "build"
    assert config["candidate_audit"]["stage"] == "inspect"
    assert {name for name, _ in dependencies(config["candidate_manifest"])} == {"fixture_check", "unit_test"}, (
        "A required check is missing from candidate eligibility; stage order does NOT rescue an incomplete needs graph"
    )
    assert dependencies(config["candidate_audit"]) == [("candidate_manifest", True)]
    assert config["candidate_manifest"]["artifacts"]["paths"] == ["candidate.txt"]
    for name in JOBS:
        job = config[name]
        assert job.get("allow_failure") is not True, "Mandatory gate is marked allow_failure"
        assert job.get("when", "on_success") == "on_success", "Mandatory candidate must not bypass failed checks"
        assert isinstance(job["script"], str) and job["script"].strip(), f"Missing real shell content: {name}"
    return True

assert validate_structure(pipeline)
print("PASS published GitLab YAML parses and declares complete mandatory graph", flush=True)

def run_local(config, inject_unit_failure=False):
    """Narrow teaching executor: honors *only* explicit needs and declared
    artifacts. It does not reproduce GitLab Runner setup, stages/rules semantics,
    protected branches, credentials, caches, registries or pipeline creation.
    """
    statuses = {}
    commands = {}
    with tempfile.TemporaryDirectory(prefix="tsa-ci-graph-") as directory:
        root = Path(directory)
        for name in JOBS:
            job = config[name]
            required = dependencies(job)
            if any(statuses.get(dep) != "PASSED" for dep, _ in required):
                statuses[name] = "BLOCKED"
                continue
            workspace = root / name
            workspace.mkdir()
            for dependency, needs_artifacts in required:
                if not needs_artifacts:
                    continue
                for artifact in config[dependency].get("artifacts", {}).get("paths", []):
                    previous = root / dependency / artifact
                    if previous.exists():
                        shutil.copy2(previous, workspace / artifact)
            environment = os.environ.copy()
            environment["CI_COMMIT_SHA"] = SHA
            environment["TSA_FAIL_UNIT"] = "1" if inject_unit_failure else "0"
            result = subprocess.run(["bash", "-e", "-o", "pipefail", "-c", job["script"]],
                                    cwd=workspace, env=environment,
                                    capture_output=True, text=True, timeout=10)
            commands[name] = (result.returncode, result.stdout, result.stderr)
            statuses[name] = "PASSED" if result.returncode == 0 else "FAILED"
        return statuses, commands

positive, trace = run_local(pipeline)
assert positive == {name: "PASSED" for name in JOBS}, f"Published local job scripts failed: {positive}, {trace}"
assert "candidate identity verified" in trace["candidate_audit"][1]
print("PASS exact source job scripts and same-commit manifest transferred through declared artifact", flush=True)

negative, evidence = run_local(pipeline, inject_unit_failure=True)
assert negative == {
    "fixture_check": "PASSED",
    "unit_test": "FAILED",
    "candidate_manifest": "BLOCKED",
    "candidate_audit": "BLOCKED",
}, f"Required unit failure did not block both candidate and downstream audit: {negative}"
assert evidence["unit_test"][0] != 0
print("PASS failed exact unit script blocks candidate creation AND audit, preserving independent check result", flush=True)

unsafe = copy.deepcopy(pipeline)
unsafe["candidate_manifest"]["needs"] = ["fixture_check"]
try:
    validate_structure(unsafe)
    raise AssertionError("Unsafe missing-unit-test needs graph passed source-derived acceptance")
except AssertionError as exc:
    if "Unsafe missing-unit-test needs graph passed" in str(exc):
        raise
status, unsafe_results = run_local(unsafe, inject_unit_failure=True)
assert status["unit_test"] == "FAILED"
assert status["candidate_manifest"] == "PASSED" and status["candidate_audit"] == "PASSED", (
    "Expected demonstrate unsafe missing-needs bypass rather than merely assert on YAML string"
)
print("PASS deliberate missing-needs mutant demonstrates candidate built despite FAILED mandatory test", flush=True)

no_artifact = copy.deepcopy(pipeline)
no_artifact["candidate_audit"]["needs"] = [{"job": "candidate_manifest", "artifacts": False}]
try:
    validate_structure(no_artifact)
    raise AssertionError("Unsafe missing artifact transfer passed source-derived acceptance")
except AssertionError as exc:
    if "Unsafe missing artifact transfer passed" in str(exc):
        raise
state, records = run_local(no_artifact)
assert state["candidate_manifest"] == "PASSED" and state["candidate_audit"] == "FAILED"
assert records["candidate_audit"][0] != 0
print("PASS missing-artifact mutant rejects false provenance despite an upstream green job", flush=True)

waiver = copy.deepcopy(pipeline)
waiver["unit_test"]["allow_failure"] = True
try:
    validate_structure(waiver)
    raise AssertionError("Unsafe allow_failure passed mandatory evidence policy")
except AssertionError as exc:
    if "Unsafe allow_failure passed" in str(exc):
        raise
print("PASS mandatory gate marked allow_failure is rejected before claiming real GitLab compatibility", flush=True)

print("LIMIT: local GitLab-like DAG fixture only; no GitLab Runner, image registry, protected variables or independent learner assessment", flush=True)
