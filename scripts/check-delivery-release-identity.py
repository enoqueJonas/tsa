#!/usr/bin/env python3
"""Synthetic release-identity contract for Steward's three runtime roles.

Runs with standard-library Python only; no Docker, Nexus, GitLab or production
credentials are accessed. Production identity requires independent reads of the
actual registry and runtime, not this disposable fixture.
"""
from dataclasses import dataclass
import hashlib


ROLES = ("api", "outbox-publisher", "lifecycle-consumer")


def digest(content: bytes) -> str:
    return "sha256:" + hashlib.sha256(content).hexdigest()


@dataclass(frozen=True)
class Candidate:
    commit: str
    ci_run: str
    images: dict[str, str]


def accept(candidate: Candidate, running: dict[str, str], authorized_commit: str, authorized_run: str) -> None:
    """Reject missing, unauthorized, altered or mismatched release evidence."""
    if candidate.commit != authorized_commit or candidate.ci_run != authorized_run:
        raise ValueError("source revision or CI execution not authorized")
    if set(candidate.images) != set(ROLES) or set(running) != set(ROLES):
        raise ValueError("missing or unexpected runtime role")
    for role in ROLES:
        expected = candidate.images[role]
        observed = running[role]
        if not expected.startswith("sha256:") or len(expected) != 71:
            raise ValueError(f"{role}: invalid digest identity")
        if expected != observed:
            raise ValueError(f"{role}: runtime digest differs from promoted candidate")


def reject_case(label: str, candidate: Candidate, running: dict[str, str], commit: str, run: str) -> None:
    try:
        accept(candidate, running, commit, run)
    except ValueError as error:
        print(f"PASS rejected {label}: {error}")
    else:
        raise AssertionError(f"unsafe release accepted: {label}")


def main() -> None:
    commit = "f" * 40
    ci_run = "trusted-ci-run-123"
    images = {role: digest(f"isolated fixture for {role} v1".encode()) for role in ROLES}
    candidate = Candidate(commit=commit, ci_run=ci_run, images=images)
    running = dict(images)
    accept(candidate, running, commit, ci_run)
    print("PASS all three role digests match authorized candidate")

    # A tag such as :latest can be repointed after approval. A tag is not
    # carried as proof of identity: changing resolved bytes must fail.
    replaced_tag = dict(running)
    replaced_tag["api"] = digest(b"repointed latest")
    reject_case("mutable-tag replacement", candidate, replaced_tag, commit, ci_run)

    missing_role = dict(running)
    missing_role.pop("outbox-publisher")
    reject_case("missing runtime evidence", candidate, missing_role, commit, ci_run)

    reject_case("untrusted CI run", candidate, running, commit, "untrusted-run")
    reject_case("unapproved source revision", candidate, running, "0" * 40, ci_run)

    invalid_candidate = Candidate(commit, ci_run, {**images, "api": "latest"})
    reject_case("tag instead of digest", invalid_candidate, running, commit, ci_run)
    print("PASS synthetic release identity fail-closed contract")


if __name__ == "__main__":
    main()
