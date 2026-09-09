# Release Engineering lesson quality notes

The module should teach engineering decisions, not product-button walkthroughs.

Good evidence:
- exact candidate identity;
- reason for a gate;
- runtime verification;
- migration/rollback reasoning;
- a tested runbook.

Weak evidence:
- screenshots of a green pipeline without artifact identity;
- 'deployed successfully' with no client verification;
- a release tag with no digest/hash;
- a rollback command never exercised;
- a manual approval with no stated decision criterion.
