# Steward release failure decision matrix

| Failure point | Example | Default action | Required proof after action |
| --- | --- | --- | --- |
| Candidate verification | tests fail | reject candidate | no promotion occurred |
| Pre-deploy | target/config precondition missing | stop | target remains last-known-good |
| Startup | container unhealthy | rollback if state unchanged | old digest healthy |
| Post-deploy verification | API behavior fails | rollback if compatible | representative client path healthy |
| Compatible migration + app regression | old app remains schema-compatible | rollback app | old digest + data behavior verified |
| Irreversible/incompatible state change | old app cannot safely use new state | contain and forward-repair/recover | repaired state and client behavior verified |

This is a reasoning aid, not a universal incident policy. The learner must adapt it to the actual Steward release and migration behavior.
