# Release Engineering Review Checklist

Use this checklist before declaring the Release Engineering module complete.

## Identity

- [ ] Source revision is explicit.
- [ ] CI run is explicit.
- [ ] Internal package versions/hashes are explicit where relevant.
- [ ] Steward OCI digest is explicit.
- [ ] The candidate is not rebuilt between verification and promotion.

## Gates

- [ ] Every gate answers a named risk question.
- [ ] Deterministic conditions are automated where practical.
- [ ] Human approval is reserved for actual judgment/authorization.
- [ ] Failed gates stop promotion visibly.

## Deployment evidence

- [ ] Target environment is explicit.
- [ ] Deployment execution is preserved.
- [ ] Migration outcome is preserved.
- [ ] Observed runtime identity matches the approved artifact.
- [ ] Client-level verification exists in addition to health/process checks.

## Recovery

- [ ] Last-known-good artifact is retrievable without rebuilding it.
- [ ] Rollback compatibility with database/state is understood.
- [ ] Forward recovery is acknowledged where rollback is unsafe.
- [ ] One controlled failed release has been exercised.
- [ ] Recovery was independently verified.

## Runbook

- [ ] Prerequisites and access are stated.
- [ ] Commands/pipeline entry points include expected results and stop conditions.
- [ ] Verification and recovery paths are documented.
- [ ] Evidence to preserve is listed.
- [ ] The procedure can be followed without the author's personal memory.

## Handoff to the milestone

The release process is ready for the Delivery Engineer milestone only when it composes the CI, Nexus, configuration-management and deployment work already built rather than creating a parallel manual process.
