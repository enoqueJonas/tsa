# Release Engineering Definition of Done

A Steward release is done only when:

1. the approved candidate is identified immutably;
2. the deployment used that exact candidate;
3. required state transitions/migrations completed as planned;
4. observed runtime identity matches the approved artifact;
5. defined health and representative client checks pass;
6. release evidence is preserved and reviewable;
7. the known-good recovery path remains understood after the change.

A pipeline displaying green is therefore an input to the release decision, not the definition of release success.

## Failed release definition

A failed release is handled completely only when:

1. promotion or deployment has stopped according to defined criteria;
2. failure evidence and affected state are preserved;
3. rollback or forward recovery is selected based on compatibility rather than habit;
4. service is returned to an intended state;
5. runtime/client behavior is verified again;
6. the runbook/process is corrected when the failure exposed an undocumented assumption.
