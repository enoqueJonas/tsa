# Lab: Execute a Steward Release — Evidence Guide

The lab is successful only if another engineer can reconstruct what happened.

## Successful release evidence

Preserve:

- reviewed source commit;
- CI run and required-check result;
- `steward-common` version/hash where used;
- Steward image repository and immutable digest;
- release candidate/version;
- gate results and approvals;
- target environment;
- migration result;
- deployment execution identifier/log;
- observed running artifact identity;
- health/dependency verification;
- representative client/API verification;
- final release decision.

## Controlled failure evidence

Preserve:

- candidate identity;
- deliberately introduced safe failure;
- predicted detection boundary;
- first trustworthy failure signal;
- state already changed at detection time;
- stop/rollback/recovery decision;
- known-good/repaired artifact identity;
- final runtime/client verification;
- runbook correction if an assumption was missing.

## Evidence quality

Prefer machine-generated identifiers, logs and stored pipeline outputs over screenshots. A screenshot may supplement evidence but should not replace an available immutable identifier or machine-readable result.

Do not fabricate a field merely to make the record look complete. An explicit `unknown` is useful because it exposes the next delivery-platform improvement.
