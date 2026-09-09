# Steward Release Record — Example Shape

This is a structural example only. Learners must replace every value with evidence from their own Steward release.

```yaml
release: steward-api-1.6.0
candidate: 1.6.0-rc.2
source:
  commit: a91c4e2
  ci_run: 1842
artifacts:
  steward_common:
    version: 2.1.0
    sha256: "..."
  api_image:
    repository: nexus.internal/steward/api
    digest: sha256:7d...
change:
  migrations:
    - 0042_service_criticality
  configuration:
    - STEWARD_PUBLIC_URL
promotion:
  technical_checks: passed
  migration_review: passed
  acceptance: accepted
  production_authorization: approved
deployment:
  environment: production
  execution: deploy-291
  migration_result: passed
verification:
  observed_digest: sha256:7d...
  health: passed
  representative_api_check: passed
  decision: accepted
recovery:
  last_known_good: 1.5.3
  last_known_good_digest: sha256:2a...
  rollback_compatible: true
```

The record is useful because each field should link to stronger underlying evidence. The YAML itself is not proof if values are copied manually without verification.
