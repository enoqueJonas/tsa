# Release Engineering Exit Criteria

The module is complete when the learner can demonstrate all of the following with Steward evidence.

## Release identity

A candidate resolves to a source commit, CI run, internal package identity and immutable OCI digest. The artifact evaluated before promotion is the artifact later deployed.

## Promotion

Every required gate names a risk question and evidence. Failed gates visibly prevent promotion. Human approval is used only where judgment or authorization is genuinely required.

## Deployment

The deployment path consumes the approved artifact from the internal repository and records the target and execution result. Environment configuration does not require rebuilding application bytes.

## Verification

The learner proves observed runtime identity, process/health state, critical dependency behavior and at least one representative Steward client/API path.

## Recovery

The last-known-good artifact is available without rebuilding an old commit. The learner can explain when rollback is safe, when state/migration compatibility makes it unsafe and when forward recovery is required.

One safe controlled failure has been executed and recovered using pre-defined criteria.

## Documentation

A versioned release runbook and release evidence record allow another competent engineer to execute and review the process without undocumented personal knowledge.

## Final reflection

Explain the difference between:

1. a source revision that passed CI;
2. a release candidate stored in Nexus;
3. an approved release;
4. a successful deployment execution; and
5. a verified healthy runtime.

These states are connected, but none should be treated as proof of the next one.
