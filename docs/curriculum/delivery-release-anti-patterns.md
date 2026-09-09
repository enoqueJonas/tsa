# Release Engineering Anti-patterns

## Rebuild after approval

**Problem:** QA/UAT validates one artifact, then production rebuilds from the same tag or commit.

**Why it fails:** the production bytes may differ because dependencies, base images or build tooling changed.

**Preferred:** build once, store immutably, promote the same artifact.

## Treat a version label as immutable proof

**Problem:** `1.6.0` or `latest` is accepted as sufficient release identity.

**Why it fails:** labels can be mutable.

**Preferred:** preserve digest/hash alongside the human-friendly version.

## Ceremonial approval

**Problem:** a human clicks approve only after visually confirming an automated check is green.

**Why it fails:** it adds delay without meaningful judgment.

**Preferred:** automate deterministic gates; reserve human approval for context, risk acceptance or authorization.

## Pipeline success equals release success

**Problem:** deployment job exit code 0 closes the release.

**Why it fails:** runtime may be unhealthy, wrong version or unable to serve a real client path.

**Preferred:** verify observed runtime identity and representative behavior.

## Rollback means 'previous image'

**Problem:** the procedure starts the previous image without considering database/external state.

**Why it fails:** older code may be incompatible with state already mutated by the new release.

**Preferred:** establish compatibility and recovery strategy before deployment.

## Runbook as command dump

**Problem:** documentation lists commands without prerequisites, expected results or stop conditions.

**Why it fails:** operators cannot safely decide whether to continue.

**Preferred:** document state, evidence, decision points and recovery alongside automation entry points.
