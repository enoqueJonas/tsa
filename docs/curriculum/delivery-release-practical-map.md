# Release Engineering Practical Map

The module's practical work is cumulative.

| Lesson | Steward evidence produced |
| --- | --- |
| Release Candidates | Candidate identity record tied to source, CI, packages and OCI digest |
| Promotion and Gates | Gate/risk/evidence matrix |
| Deployment Evidence | Source-to-runtime release record structure |
| Release Observability | Post-deployment verification sequence |
| Release Failure Handling | Stop/rollback/forward-recovery decision model |
| Release Runbooks | Versioned executable release procedure |
| Execute a Steward Release | Successful release record + controlled failure/recovery record |
| Review | Remaining ambiguity, ceremony and recovery assumptions |

## Reuse rule

Do not create a new artifact for each lesson when the previous artifact should evolve. For example, the candidate record should become part of the final release record, and the gate matrix should become part of the runbook/release procedure.

The objective is one coherent release system, not a folder full of disconnected coursework documents.
