# Steward Release Runbook Template

The runbook should describe the decisions around automation, not duplicate deterministic pipeline logic by hand.

## 1. Preconditions

- Required access and identities
- Target environment
- Approved candidate version and immutable digest
- Required configuration present
- Migration plan reviewed
- Last-known-good release identified and retrievable

**Stop if:** candidate identity, required evidence or recovery assumptions are ambiguous.

## 2. Verify candidate

Confirm source revision, CI run, Nexus package/image identities and required checks.

**Expected result:** every piece of evidence resolves to the same candidate.

## 3. Evaluate promotion gates

For each gate, record the risk question, evidence, result and owner.

**Stop if:** a required gate fails or has no trustworthy evidence.

## 4. Deploy

Trigger the existing automated deployment path using the approved immutable artifact identity. Do not rebuild the application for the target environment.

Record deployment execution and migration outcome.

## 5. Verify runtime

At minimum verify:

1. observed running artifact identity;
2. process/container health;
3. required dependency path;
4. representative authenticated Steward behavior;
5. relevant post-deployment error evidence.

**Success:** the exact approved candidate is serving the intended behavior.

## 6. Failure decision

If verification fails, preserve evidence before changing state.

Choose only a pre-understood path:

- stop before further state change;
- rollback to the known-good artifact when application/data compatibility permits;
- forward-recover when rollback would be unsafe because of state or migration changes.

Do not assume starting the previous image reverses database state.

## 7. Verify recovery

Repeat runtime and client-level verification. Record the final running artifact and state.

## 8. Close the release record

Preserve links/identifiers for:

- source commit;
- CI run;
- internal package artifacts;
- OCI digest;
- gate/approval evidence;
- deployment execution;
- runtime verification;
- failure/recovery evidence if applicable.

## 9. Improve the runbook

If execution required undocumented knowledge, update this runbook in version control. A procedure that works only for its author is not complete operational documentation.
