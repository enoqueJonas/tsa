# Release Engineering — Controlled Failure Drill

The purpose of this drill is to prove release decision-making and recovery without manufacturing destructive failure.

## Choose one safe failure

Examples:

- required runtime configuration is deliberately invalid;
- a non-destructive dependency is unavailable;
- representative post-deployment verification is designed to fail for the candidate;
- a candidate fails a promotion gate before deployment.

Do not corrupt persistent Steward data merely to demonstrate recovery.

## Before execution

Record:

- candidate version and digest;
- expected detection boundary;
- current known-good release;
- whether any migration/state change will occur;
- stop/rollback/recovery criteria;
- expected verification after recovery.

## During execution

1. Run the normal release path until the controlled failure occurs.
2. Capture the first trustworthy evidence of failure.
3. Stop further promotion or mutation when the defined criterion is met.
4. Preserve relevant logs, pipeline identifiers and artifact identity.
5. Apply the recovery path chosen before the drill.

## After recovery

Prove:

- intended runtime artifact identity;
- health/dependency behavior;
- representative Steward client/API behavior;
- no hidden manual change is required for the system to remain healthy.

## Review

Answer:

- Was the failure detected where predicted?
- Did the runbook contain enough information to act?
- Did rollback depend on an assumption about database or persistent state?
- Was the last-known-good artifact immediately retrievable from Nexus?
- What should be automated or clarified before the Delivery Engineer milestone?
