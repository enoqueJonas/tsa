# Reliability Engineer — Steward Evolution Contract

Status: canonical implementation contract

## Purpose

Reliability Engineer turns Steward from a system that can be built, tested and secured into a system whose user-visible behavior can be measured, operated, recovered and defended under failure.

The school does not begin by installing an observability stack. It begins by defining which user journeys and dependency behaviors must be reliable, then adds the minimum telemetry and controls needed to answer those questions.

## Governing loop

```text
user/dependent-system expectation
        ↓
reliability risk
        ↓
SLI / objective / recovery expectation
        ↓
telemetry required to observe it
        ↓
operational control
        ↓
failure / load / incident evidence
        ↓
measured recovery and residual risk
```

A dashboard is not reliability. A healthy pod is not user-visible health. A backup is not recovery until restore is demonstrated. An alert is not useful merely because it fires.

## Increment 1 — Reliability risk and service objectives

Artifacts:
- reliability risk map
- critical user/dependent-system journeys
- SLIs and SLOs
- error-budget policy
- initial recovery expectations

Constraints:
- objectives precede telemetry-tool selection
- distinguish SLOs from contractual SLAs
- do not select targets solely because an industry example uses them

## Increment 2 — Telemetry architecture

Define the questions logs, metrics and traces must answer.

Artifacts:
- telemetry design
- service/release/environment identity model
- correlation/context propagation contract
- tracing-backend decision
- central-logging decision

Constraint:
Collect telemetry because it answers an operational question; do not instrument everything by default.

## Increment 3 — Production logging

Artifacts:
- structured Steward logs
- useful levels/events
- request/trace/correlation context
- privacy/redaction policy
- centralized searchable logging
- retention/ownership decision

The canonical Steward reliability program uses Graylog for centralized logs unless a later architecture decision deliberately replaces it.

## Increment 4 — Metrics and dashboards

Artifacts:
- Steward application metrics
- dependency/platform metrics
- Prometheus scrape/evaluation evidence
- PromQL for user-visible traffic/errors/latency
- recording rules where justified
- Grafana operational dashboard

Constraints:
- labels must avoid uncontrolled cardinality
- dashboards start with service symptoms, not CPU vanity panels
- metrics and dashboards map back to SLIs/risks

## Increment 5 — Distributed tracing

Artifacts:
- OpenTelemetry trace context
- representative end-to-end Steward trace
- selected tracing backend implementation
- trace/log/metric correlation
- sampling/cost decision

Constraint:
Tracing is justified by distributed diagnostic questions; it does not replace logs or metrics.

## Increment 6 — Cross-signal observability

Prove an investigation path:
`user symptom → SLI/metric → trace → correlated logs → dependency evidence`.

Record blind spots and telemetry cost/ownership.

## Increment 7 — Alerting and Alertmanager

Artifacts:
- page-worthy symptom alerts
- SLO/error-budget alert logic where justified
- routing/grouping/inhibition
- receivers/escalation
- runbooks
- firing and resolution evidence

Constraints:
- alerts require an expected human action
- avoid paging on every underlying cause
- alert ownership must be explicit

## Increment 8 — PostgreSQL operational stewardship

Artifacts:
- privilege/connection baseline
- query-plan and slow-query evidence
- lock/deadlock reasoning
- safe migration procedure
- database health/capacity indicators
- backup/restore evidence

Constraint:
Database reliability is evaluated from application/data correctness and recovery needs, not only server uptime.

## Increment 9 — Performance and capacity

Artifacts:
- workload/release/environment manifest
- latency/throughput/saturation baseline
- bottleneck evidence
- capacity/headroom estimate
- next likely limiting resource

Reuse Quality Steward's trustworthy performance-measurement discipline; Reliability Engineer adds operational capacity/headroom decisions rather than reteaching k6 fundamentals.

## Increment 10 — Distributed resilience

Artifacts:
- timeout/retry/backoff policy
- idempotency boundary
- graceful-degradation decisions
- queue/backpressure behavior
- dependency/cascading-failure evidence

Constraint:
Availability controls must never bypass authentication, authorization, integrity or data-safety guarantees established earlier.

## Increment 11 — Data protection and disaster recovery

Artifacts:
- protected-state inventory
- backup integrity evidence
- tested restore
- measured RPO/RTO
- database/artifact/configuration recovery procedures

Constraint:
Replication, snapshots, pod recreation and GitOps reconciliation are not automatically backups or data recovery.

## Increment 12 — Incident operations

Artifacts:
- incident roles and communication model
- timestamped decision/timeline record
- mitigation/recovery evidence
- contributing-factor analysis
- blameless postmortem
- corrective actions with owners/closure evidence

## Increment 13 — Fault injection

Only after observability, recovery and incident controls exist.

Artifacts:
- hypothesis/steady state
- bounded blast radius
- abort conditions
- injected condition
- detection/diagnosis/recovery evidence
- corrected reliability gap

Constraint:
Random chaos is not a reliability experiment.

## Increment 14 — Steward Reliability Program

The final review integrates:
- SLO/error-budget evidence
- Graylog/Prometheus/Grafana and tracing evidence
- actionable alerts/runbooks
- PostgreSQL operational evidence
- capacity/headroom
- resilience/dependency controls
- measured RPO/RTO
- incident/postmortem evidence
- controlled fault experiment
- dependency ownership
- unresolved reliability risks
- explicit "What We Cannot Claim Yet"

## Boundaries with previous schools

### Quality Steward
Quality proves release/test behavior and trustworthy performance experiments. Reliability consumes those baselines and turns them into production-oriented service objectives, capacity decisions and operational evidence.

### Security Steward
Security owns adversarial risk, identity/secrets/PKI and security controls. Reliability must preserve those controls during degradation/recovery and must not trade away integrity/authentication/authorization merely to improve availability.

## Boundaries with later schools

Architect may change the topology/products after evaluating complexity and trade-offs. Technical Steward later governs ownership, policy and organizational operating models. Reliability Engineer must expose evidence and residual operational risk rather than pre-deciding those governance choices.

## Runtime integrity

Every Reliability lesson/milestone must remain reachable through `reliabilityEngineerPaths` and `academy-journey.ts`. Run:

```bash
pnpm audit:curriculum
```

before merging curriculum changes.
