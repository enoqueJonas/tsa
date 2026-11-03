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

## Current source changes (PR #342)

- All 16 Reliability paths now directly expose authored source lessons, removing synthetic `-reliability-model` and `-reliability-preparation` pages; original activity IDs stay unchanged. This reduces inflated activity counts and changes re-entry sequence. Existing progress stored under generated IDs may need a separate migration assessment.
- The original Production Logging `structured-logs` and `centralized-logging` readings now contain substantive event schema, Graylog ingestion/index/query boundaries, explicit negative diagnostics, and a standalone standard-library Python fixture proving valid correlation plus malformed and uncorrelated cases. Only this local Python example is executable without external services; a CI script extracts the exact learner source.
- The original Observability Stack Integration module now begins with a source-authored reading that explains each component and a 502 incident trace before requiring multi-tool deployment. Real integration remains UNVERIFIED.
- The Steward Reliability milestone now starts with a source-authored evidence-chain reading and ends with an independent counterevidence reflection. This is a curriculum requirement, not a completed independent learner assessment.
- Source contracts reject reintroduction of the generic Reliability wrappers across all 16 paths. Structural tests and whole-school rendered-browser traversal are required on the final matching commit.

## Remaining work within Reliability Engineer

The 16-path inventory is complete, but the full source-by-source quality and independent execution audit remains open. Priority beyond logging: SLI error-budget windows and missing-data counterexamples; Prometheus histogram and label cardinality experiments; trace propagation and sampling loss; Alertmanager route and silence diagnosis; reproducible incident timelines; safe fault injection with abort criteria; disaster recovery from real disposable restores. Do not infer real backend behavior from models or passing website traversal.

## SLI and error-budget worked evidence

Original `service-level-engineering-deep.ts` readings for SLIs, error budgets and measurement windows now contain source-specific explanation and an executable, synthetic Python numerator/denominator model. It distinguishes three valid attempts, two successes, one intentionally excluded event, a failed 90% objective and an empty-window `UNKNOWN` result. The CI source check executes the exact published code and guards against counting missing observations as healthy service. Real traffic metrics, burn-rate paging and trustworthy instrumentation remain **UNVERIFIED**.
