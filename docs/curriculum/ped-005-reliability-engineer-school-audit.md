# Reliability Engineer — PED-005 school-wide source audit

Status: IN PROGRESS. No independent learner validation claimed.

## Actual school boundaries

The Reliability Engineer source is `packages/runtime-kernel/src/paths/reliability-engineer.ts` and assembles **16 paths**. All paths currently go through `prepareReliability`, which injects a brief generic model and additional preparation reading before original practical activities. These injected pages are not evidence of conceptual depth and may obscure the original lesson order. Inspect and improve actual source readings before declaring instructional remediation.

1. Reliability and SRE Foundations — `reliability-sre-foundations-deep.ts`.
2. Service Level Engineering — `reliability-service-level-engineering-deep.ts`.
3. Observability — `reliability-observability-deep.ts` and `reliability-tracing-backend-decision.ts`.
4. Production Logging — `reliability-production-logging-deep.ts` and `reliability-central-logging-decision.ts`.
5. Metrics, Prometheus and Grafana — `reliability-metrics-prometheus-grafana-deep.ts`.
6. Distributed Tracing — `reliability-distributed-tracing-implementation-deep.ts`.
7. Observability Stack Integration — `reliability-observability-stack-integration-deep.ts`.
8. Alerting and On-call — `reliability-alerting-on-call-deep.ts`.
9. Alertmanager Implementation — `reliability-alertmanager-implementation-deep.ts`.
10. Database Stewardship — `reliability-database-stewardship-deep.ts`.
11. Performance and Capacity — `reliability-performance-capacity-deep.ts`.
12. Resilience and Distributed Failure — `reliability-resilience-distributed-failure-deep.ts`.
13. Data Protection and Disaster Recovery — `reliability-data-protection-disaster-recovery-deep.ts`.
14. Incident Management — `reliability-incident-management-deep.ts`.
15. Fault Injection — `reliability-fault-injection-deep.ts`.
16. Steward Reliability Program milestone — `reliability-steward-reliability-program-deep.ts`.

## High-priority gap: Graylog as observable data flow

The current Graylog decision gate and Stack Integration practical specify deployments, ingestion, fields, correlation, incident search and retention. However, the earlier learner-facing concepts need direct examples distinguishing event emission, shipping, input acceptance, parsing, indexing, search, permissions and retention. Requiring a learner to deploy Graylog is not equivalent to teaching the architecture or how to diagnose missing events. Add a safe original-source local example with valid structured events, a malformed record, an uncorrelated record and a query/recovery discussion. Verify exact published code in CI.

## Evidence and completion conditions

- Structural wiring and browser traversal are separate from readable conceptual depth.
- Exact source-code examples should execute in CI when feasible and show both expected and failed paths.
- Real Graylog, Prometheus, OpenTelemetry/Tempo, Alertmanager, PostgreSQL recovery, load and fault labs remain **UNVERIFIED** until actually executed.
- Independent learner teach-back, genuine incident reconstruction, progress persistence and rendered-page instructional review remain **UNVERIFIED**.
- Preserve existing activity IDs; changing generic wrapper IDs requires a migration/re-entry impact check.
- Keep [issue #327](https://github.com/enoqueJonas/tsa/issues/327) open until school-wide learner acceptance evidence exists.
