# Steward Release Recovery Matrix

Rollback is a compatibility decision, not a reflex.

| Situation | State changed? | Previous app compatible? | Preferred direction |
| --- | --- | --- | --- |
| Candidate fails before deployment | No runtime change | Yes | Stop; create/fix a new candidate |
| Deployment automation fails before mutation | None or incomplete | Usually | Restore intended known state and retry only after diagnosis |
| New app unhealthy, no schema/state change | Application only | Yes | Roll back to known-good immutable artifact |
| New app unhealthy after backward-compatible migration | Schema changed compatibly | Proven yes | Rollback may be valid; verify data/application behavior |
| New app unhealthy after backward-incompatible migration | Schema changed incompatibly | No | Contain and forward-recover or restore data according to tested recovery plan |
| External irreversible side effect occurred | External state changed | Depends | Do not assume application rollback reverses side effect; contain and repair explicitly |

## Required reasoning

Before each consequential Steward release, record:

- what state the release can mutate;
- whether the previous application can run against the resulting state;
- whether data restoration is available and tested where required;
- the exact known-good artifact identity;
- the evidence that will trigger recovery;
- how healthy service will be verified afterward.

A runbook that says only `deploy previous tag` is incomplete whenever database or external state can change.
