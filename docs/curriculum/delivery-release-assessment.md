# Release Engineering Assessment Rubric

## 1. Artifact identity

**Pass:** Candidate is tied to source revision, CI run, internal package identity and immutable OCI digest. No rebuild occurs during promotion.

**Needs work:** Evidence relies mainly on branch/tag names or mutable image tags.

## 2. Promotion design

**Pass:** Gates have explicit risk questions, evidence and failure actions. Human approval represents real judgment or authorization.

**Needs work:** Gates are generic stages or ceremonial clicks.

## 3. Deployment evidence

**Pass:** Release record connects approved candidate to target, deployment execution, migration result and observed runtime identity.

**Needs work:** Pipeline success is treated as proof of runtime success.

## 4. Verification

**Pass:** Health plus representative Steward behavior is verified. The learner explains what each check can and cannot prove.

**Needs work:** Only process/container status is checked.

## 5. Failure handling

**Pass:** One controlled failure is detected, evidence preserved and recovery chosen according to pre-defined state/compatibility reasoning.

**Needs work:** Recovery is improvised after failure or assumes previous image always means safe rollback.

## 6. Operational handoff

**Pass:** Another engineer can follow the runbook and reconstruct the release from stored evidence.

**Needs work:** Critical steps depend on undocumented commands, machine state or the learner's memory.

## Exit decision

Pass the module only when all six dimensions are demonstrated with real Steward evidence or an explicitly justified equivalent. Do not award completion for documentation alone when the corresponding release behavior has not been exercised.
