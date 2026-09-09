# Example Steward release evidence record

```text
release: steward-api 1.4.0
source: 9d83f41
ci: run-1842 / required checks passed
steward-common: 2.1.0 / sha256:<package-hash>
image: nexus.internal/steward/api@sha256:<image-digest>
candidate: 1.4.0-rc.2
approval: release-review-2026-09-09
target: homelab-prod
migration: 0042-0044 / rollback-compatible=yes
deployment: deploy-run-381
runtime image: sha256:<image-digest>
health: pass
representative API check: pass
result: verified runtime
```

The example demonstrates shape, not values the learner should copy. Real evidence must come from the learner's own Steward release.
