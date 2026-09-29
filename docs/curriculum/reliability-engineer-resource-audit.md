# Reliability Engineer — Learning Resource Audit

Status: complete module-level resource audit

## Goal

Reliability resources must answer the exact operational question in the lesson. Broad SRE/product documentation is useful as orientation, but it must not replace the specific material needed to define an SLO, propagate context, write PromQL, diagnose PostgreSQL contention, design a retry policy or prove recovery.

## Selection policy

1. Prefer Google SRE material for reliability principles and operating practices.
2. Prefer official OpenTelemetry, Prometheus, Grafana, PostgreSQL and Alertmanager documentation for implementation mechanics.
3. Prefer a specific chapter/page over a product documentation homepage.
4. Reuse Quality Steward performance resources only where measurement mechanics are genuinely needed; Reliability focuses on capacity/headroom/operational decisions.
5. Resource selection follows the reliability question, not the installed product.

## Completed targeting

### Service Level Engineering
- SLI/SLO semantics → Google SRE SLO material
- error budgets/release decisions → Error Budget Policy
- windowing/SLO alerting → Alerting on SLOs

### Observability
- monitoring vs observability → SRE monitoring guidance
- signals → OpenTelemetry signals
- correlation/context → OpenTelemetry context propagation
- instrumentation → OpenTelemetry instrumentation
- cost/noise → OpenTelemetry sampling + SRE monitoring

### Production Logging
- structured events → OpenTelemetry log data model
- correlation/trace context → OpenTelemetry context
- privacy/security → OWASP logging guidance
- centralized/event-stream model → Twelve-Factor/OpenTelemetry

### Prometheus and Grafana
- metric types → Prometheus metric types
- instrumentation/labels → Prometheus instrumentation and naming
- PromQL → querying docs
- recording rules → recording-rule docs
- dashboard design → Grafana dashboard docs

### PostgreSQL Stewardship
- roles → PostgreSQL roles
- connections → runtime connection configuration/statistics
- query plans → EXPLAIN/ANALYZE
- locks/deadlocks → locking/statistics
- safe migrations → ALTER TABLE + locking
- backup/recovery → PostgreSQL backup
- capacity/health → monitoring statistics

### Alerting and On-call
- symptoms/actionability → SRE practical/SLO alerting
- alert fatigue/severity/escalation/handover → Being On-Call
- routing → Alertmanager
- runbooks → SRE on-call/alerting material

### Distributed Resilience
- timeouts/backoff/jitter → AWS Builders' Library
- safe retries/idempotency → idempotent API guidance
- circuit breakers → Azure Circuit Breaker
- queue/backpressure → Queue-Based Load Leveling
- cascading/partial failure → Google SRE/Azure reliability patterns

### Data Protection and Disaster Recovery
- backup strategy/integrity → CISA + PostgreSQL
- restore testing → PostgreSQL + AWS DR
- RPO/RTO → AWS DR + PostgreSQL continuous archiving/PITR
- database recovery → PostgreSQL backup/PITR
- broader artifact/config recovery → AWS/CISA

### Incident Management
- detection/triage/roles/communication/mitigation → Google SRE incident response
- root cause/contributing factors/blameless practice → Google SRE postmortem culture
- corrective actions → postmortem workbook guidance

## Modules intentionally not over-routed

Alertmanager implementation, distributed tracing implementation and other focused implementation paths already have narrow authoritative resource sets. They should only be split further when an activity needs materially different documentation; link-count inflation is not a goal.

## Regression checks

- Does the first resource directly support the lesson's main mechanism?
- Is a broad homepage used where an exact official page exists?
- Does the resource belong to Reliability rather than reteaching Quality?
- Are SLO resources teaching user-visible objectives rather than tool metrics?
- Are telemetry resources aligned to the signal/context actually implemented?
- Are database resources tied to the operational behavior under study?
- Do resilience resources explain the failure/control semantics before framework code?
- Does recovery guidance require restore evidence rather than backup status?
- Does incident material separate response, causal analysis and postmortem learning?
- Would removing a resource make the lesson more focused? If not, remove it.

## Completion state

The major Reliability Engineer conceptual modules now use lesson-specific resource routing. Future work is maintenance: validate links during substantial curriculum edits and deepen a focused implementation path only when the exercise itself demonstrates the need.
