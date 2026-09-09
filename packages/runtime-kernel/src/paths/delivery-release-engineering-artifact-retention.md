# Release-aware artifact retention

Release Engineering depends on the artifact-management policy built in the preceding module.

At minimum, do not delete:
- the currently deployed release artifact;
- the selected last-known-good rollback artifact;
- artifacts still referenced by active environments;
- evidence needed to explain a recent failed release.

Retention can later become more sophisticated, but cleanup must not silently destroy the recovery path described by the release runbook.
