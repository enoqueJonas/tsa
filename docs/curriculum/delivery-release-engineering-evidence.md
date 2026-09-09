# Steward Release Evidence Template

Use this template in the Release Engineering lab and Delivery Engineer milestone. Replace examples with evidence from the actual release.

## Candidate identity

- Release/version:
- Source commit:
- CI run:
- `steward-common` version and artifact hash:
- Steward OCI repository:
- Steward OCI digest:
- Migration set:
- Required configuration assumptions:

## Promotion gates

For every gate record:

| Gate | Risk question | Evidence | Result | Owner |
| --- | --- | --- | --- | --- |
| Technical verification | Did the exact candidate pass required checks? | | | |
| Migration compatibility | Can the planned data transition be executed and recovered safely? | | | |
| Acceptance | Has required behavior been accepted? | | | |
| Environment authorization | Is this exact candidate authorized for this target now? | | | |

Delete or adapt gates that do not apply. Do not preserve ceremonial approvals.

## Pre-deployment state

- Target environment:
- Current running release/digest:
- Last-known-good artifact available in Nexus:
- Database/schema state:
- Rollback compatibility:
- Stop criteria:
- Rollback criteria:
- Forward-recovery condition:

## Deployment execution

- Start/end time:
- Automation/pipeline execution:
- Artifact requested:
- Migration result:
- Deployment result:

## Runtime verification

Record observed evidence, not only intended configuration.

- Running image identity/digest:
- Health/readiness result:
- Critical dependency reachability:
- Representative authenticated Steward API/client result:
- Relevant error/log check:
- Final release decision:

## Failure/recovery record

When a release is stopped or rejected:

- First trustworthy failure evidence:
- Failure boundary:
- State already changed:
- Decision: stop / rollback / forward recovery:
- Artifact/state used for recovery:
- Client-level recovery verification:
- Runbook correction required:

## Handoff

Link the source revision, CI evidence, Nexus artifacts, approval record, deployment execution and runtime verification so another engineer can reconstruct the release without asking the person who performed it.
