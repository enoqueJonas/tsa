# Reliability Engineer — Deep Curriculum Audit

Status: active regression record  
Evolution contract: `reliability-engineer-evolution.md`

## Audit conclusion

Reliability Engineer already has strong breadth and a realistic enterprise topology. Its primary structural weaknesses were sequencing and documentation drift rather than missing headline SRE topics.

## Canonical progression

1. Reliability and SRE Foundations
2. Service Level Engineering
3. Observability
4. Production Logging
5. Metrics / Prometheus / Grafana
6. Distributed Tracing
7. Observability Stack Integration
8. Alerting and On-call
9. Alertmanager Operations
10. Database Stewardship
11. Performance and Capacity
12. Resilience and Distributed Failure
13. Data Protection and Disaster Recovery
14. Incident Management
15. Fault Injection
16. Steward Reliability Program

## Findings resolved

### SLOs followed the telemetry stack
The runtime previously built logs/metrics/traces and integrated the observability stack before teaching service-level engineering. That encouraged tool-first telemetry. SLI/SLO/error-budget reasoning now precedes observability so instrumentation answers defined reliability questions.

### Journey documentation lagged runtime
The journey omitted distributed tracing, observability integration, Alertmanager, database stewardship and the actual 16-stage progression. It is now aligned with runtime.

### No incremental reliability evolution contract
The new contract makes the Steward system evolve from user-visible objectives to telemetry, operations, recovery, incidents and bounded fault experiments. It explicitly rejects dashboard/install theatre.

## Strong existing areas

- Google SRE-derived foundations and SLO/error-budget reasoning.
- OpenTelemetry concepts plus concrete distributed tracing implementation.
- Prometheus/PromQL/Grafana depth including dashboard anti-patterns and platform/delivery metrics.
- explicit cross-signal observability integration.
- actionable alert/runbook thinking plus real Alertmanager operations.
- PostgreSQL operational stewardship including plans, locks, migrations, backup/restore and capacity.
- performance/capacity material that can build on Quality Steward's measurement discipline.
- distributed failure controls: timeouts, retries, jitter, idempotency, backpressure, graceful degradation and retry storms.
- disaster recovery with restore evidence and RPO/RTO.
- incident response/postmortem/corrective-action practice.
- hypothesis-driven fault injection with blast-radius and recovery verification.
- final Reliability Program that requires evidence across application and enterprise dependencies.

## Important pedagogical boundaries

### Quality → Reliability
Do not reteach k6/test-framework mechanics merely because performance appears again. Quality establishes trustworthy controlled measurements; Reliability uses them for capacity, headroom, service objectives and operational decisions.

### Security → Reliability
Do not weaken authorization, identity, secret, PKI or data-integrity controls to keep a service superficially available. Reliability degradation behavior must preserve security invariants.

### Reliability → Architect
Reliability may expose that Graylog, Tempo, RabbitMQ, Redis, OpenShift, etc. add operational cost. Architect later decides whether the topology remains justified. Reliability should measure and expose that cost, not hide it.

## Resource audit status

Resources are generally authoritative—Google SRE, OpenTelemetry, Prometheus, Grafana, PostgreSQL, AWS reliability material and official product docs—but several modules still reuse broad module-level bundles for every lesson.

A dedicated Reliability resource pass should route exact references for:
- SLO/error-budget/windowing topics;
- OpenTelemetry context/instrumentation/sampling;
- structured logging/correlation/privacy;
- Prometheus metric types, PromQL, recording rules and Grafana dashboard design;
- Alertmanager routing/grouping/inhibition;
- PostgreSQL EXPLAIN/locks/connections/backup;
- timeout/retry/idempotency/backpressure patterns;
- PostgreSQL recovery and disaster-recovery evidence;
- incident/postmortem practice.

## Runtime/CI integrity

`reliabilityEngineerPaths` contains every major deep module and standalone decision lesson. The school is wired into `academy-journey.ts`. The repository-wide Jenkins search is currently clean.

The repository integrity guard remains:

```bash
pnpm audit:curriculum
```

## Regression questions

- Is user-visible reliability defined before telemetry?
- Does every dashboard/metric/log/trace answer an operational question?
- Are SLOs chosen from user expectations rather than copied targets?
- Does an alert require a human action?
- Is a backup actually restored?
- Are RPO/RTO measured rather than asserted?
- Is capacity based on a reproducible workload/environment/release?
- Are retries bounded and safe for the operation's idempotency semantics?
- Does graceful degradation preserve security/integrity?
- Is fault injection bounded by steady state, blast radius and abort conditions?
- Does incident analysis distinguish root trigger from contributing systemic factors?
- Does the final review expose unsupported claims and residual risks?
- Is every declared lesson reachable in runtime?
