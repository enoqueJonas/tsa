# Steward Progressive Delivery

## Decision

Cloud Engineer must implement one bounded canary release for Steward after Kubernetes/OpenShift, Argo CD and production schema-evolution foundations exist.

Kubernetes rolling updates remain the normal baseline. Canary is introduced only when a release has enough risk that limited exposure plus evidence-driven promotion provides meaningful control.

## Tool ownership

- Jenkins builds/tests and publishes the immutable candidate through the existing release chain.
- Nexus/registry preserves candidate identity.
- Argo CD reconciles desired deployment configuration from Git.
- Kubernetes/OpenShift executes workloads.
- Argo Rollouts controls the selected canary rollout state machine; it does not replace Argo CD as the GitOps authority.
- Prometheus provides automated release-analysis signals.
- Grafana/Graylog/Tempo remain observability investigation surfaces according to their existing responsibilities.

## Primary strategy

Canary is TSA's primary progressive-delivery implementation. Blue/green is compared as an alternative and may be selected later when its trade-offs fit a real scenario. TSA does not permanently operate both strategies merely for exposure.

The canary must progress through multiple bounded exposure stages rather than immediately replacing all stable replicas. The learner must define observation windows and measurable promotion/abort criteria.

## Compatibility gate

Stable and candidate versions must be safe to run concurrently before traffic splitting begins. PostgreSQL schema/data, RabbitMQ message contracts, Redis/cache assumptions and public API behavior must be reviewed. Progressive traffic control cannot repair an incompatible database migration.

## Mandatory failure evidence

The learner must deploy a candidate that passes startup/readiness but violates a real analysis criterion under representative traffic. Prometheus-backed automated analysis must stop, pause or abort that candidate before full exposure while the stable service remains available.

Loss of the analysis dependency itself must fail safe according to the documented policy. Missing telemetry is not evidence that a candidate is healthy.

## Recovery boundary

Aborting canary traffic changes which application version receives requests; it does not automatically reverse persistent data changes. Recovery therefore inherits the production schema-evolution compatibility and forward-fix rules.

## Reassessment

Architect/Technical Steward may retain canary, simplify to ordinary rolling deployment, or migrate to blue/green/another mechanism when operational evidence justifies it. Argo Rollouts is not permanent architecture merely because it was mandatory learning material.
