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

## Metrics, PromQL and counter semantics

The original `reliability-metrics-prometheus-grafana-deep.ts` metric-types and PromQL lessons now explain counter resets versus gauges, matching numerator/denominator populations, no-traffic/zero denominators, bounded labels and classic histogram `le` aggregation. A source-published Python reset counterexample is executed in CI: a naïve `last-first` gives a misleading negative count while reset-aware increases remain positive. Actual Prometheus queries/histograms against a deployed Steward instance are **UNVERIFIED**; no live scrape or dashboard claim follows from source text.

## Original-reading source review — complete school inventory, individual gate status

These statuses describe the **source and executable evidence checked**, not independent learner mastery:

| # | Path | Source-level assessment and evidence | Still unverified |
|---|---|---|---|
| 1 | Reliability/SRE | Seven original concept lessons, service quality and failure/recovery questions, risk-map lab. Original sources retained. | Real baseline SLI/risk interview and independent acceptance |
| 2 | Service Level Engineering | Original SLI, error-budget and window lessons now demonstrate valid/good populations, negative failed SLO and missing-data `UNKNOWN`. Exact local Python is checked. | Real instrumentation and windowed burn-rate |
| 3 | Observability | Eight existing source concept readings with scenario/question/signal/interpretation cases and telemetry lab. | Real source-to-backend cross-signal completeness |
| 4 | Production Logging | Original structured and centralized logging readings explain emission/shipper/input/parser/index/query stages; local malformed/uncorrelated negative fixture is executable. | Real Graylog indexing/search, lost log and retention/permissions |
| 5 | Prometheus/Grafana | Original metrics and PromQL readings now include rate/error ratio and histogram queries; local reset-aware counter fixture corrected from **17 to 14** increments after a CI-found arithmetic defect. | Real Prometheus rate/histogram evaluation and Grafana evidence |
| 6 | Distributed Tracing | Original OpenTelemetry/Tempo reading now carries a real two-hop localhost HTTP traceparent test with an invalid-header denial. | Actual OTel SDK, collector, sampling, Tempo query and async broker |
| 7 | Observability Stack Integration | Added an original instructional reading before the former deployment-only lab: metric 502 symptom, log-event cause, propagation/sampling gaps and missing-log negative diagnosis. | Live Graylog+Prometheus+Grafana+Tempo incident |
| 8 | Alerting/On-call | Eight existing concept readings, paging policy and runbook labs. | Rule/route/runbook exercises with a learner-run receiver |
| 9 | Alertmanager | Original reading now exercises a real localhost webhook with a successful notification, deliberate receiver 503, and fresh post-recovery delivery. | Actual Prometheus→Alertmanager routing, inhibition/retry/silence |
| 10 | Database Stewardship | Original slow-query plan lesson adds **real PostgreSQL 17** 50k-row temporary-table SQL, EXPLAIN ANALYZE before/after an index and scoped rollback; source-derived CI runs it against an isolated service. | Steward database locks, transaction recovery, migrations and production plans |
| 11 | Performance/Capacity | Original latency lesson now executes mean/median/nearest-rank p95 with a synthetic 500 ms tail; small-sample limitation stated. | Controlled real traffic, saturation and representative percentiles |
| 12 | Resilience/Distributed Failure | Original retry/idempotency readings now execute localhost 503 **after synthetic commit**, stable-key replay and duplicate changed-key negative. | Durable transaction identity, concurrency and real downstream failure |
| 13 | Data Protection/DR | Original backup-integrity and restore readings now execute isolated filesystem restore with SHA-256 match and deliberate corrupted-backup rejection. | PostgreSQL restore, S3 object recovery, dependency ordering and measured RPO/RTO |
| 14 | Incident Management | Original timeline/root-cause readings now execute UTC ordering, duplicate removal and separate hypothesis handling; causal certainty explicitly limited. | Genuine incident exercise, independently tested timeline and corrective actions |
| 15 | Fault Injection | Original controlled-failure lesson uses the same isolated 503-after-commit experiment with explicit recovery/negative behavior and no shared infrastructure. | Scoped real Steward fault injection with abort/rollback |
| 16 | Reliability Milestone | Added original evidence-chain reading and adversarial transfer reflection; retains all existing milestone practicals. | Independent learner defense, live recovery and cross-signal proof |

### Execution and truthfulness gates

- `scripts/check-reliability-logging-source.mjs` executes the **exact** published SLI, event-parser, counter and associated local models. A past matching-head check correctly found a false 17-increment assertion; code and expectation were corrected to 14.
- `scripts/check-reliability-transport-proofs.mjs` executes the **exact** published local HTTP tracing, receiver 503/recovery, isolated file restore, ambiguous commit/retry, latency-tail and chronology programs.
- `scripts/check-reliability-postgres-source.mjs` runs the **exact** authored SQL on a temporary PostgreSQL 17 database in GitHub Actions, with no persistent relation after rollback.
- `scripts/check-school-learner-browser.py` now expects 14 specifically named new instruction headings in the rendered Reliability school, and copyable code in the relevant original readings. This catches failures that a text source search cannot.
- The final matching-head 19-job workflow must pass after these additions. Older green runs and superseded/cancelled runs are **not** evidence for the latest commit.
- The original activity IDs are retained. Previously generated model and preparation activity IDs were removed; progress migration/re-entry for these artificial IDs has not been independently inspected.
- Infrastructure-dependent labs and **uncoached novice teach-back remain UNVERIFIED**. Do not close issue #327 or advertise full learner validation based on source/execution CI.

### Graylog-specific teaching and learner re-entry evidence

The former Observability Stack Integration practical began with the unexplained instruction "Deploy Graylog." A distinct original `reliability-observability-stack-integration-graylog-lab-guide` source reading now **precedes the actual deployment practical**. It is grounded in the official Graylog 7.2 Compose/Inputs/GELF documentation and explains MongoDB, Data Node/OpenSearch and Graylog responsibilities, prerequisites including Linux Docker `vm.max_map_count`, `GRAYLOG_PASSWORD_SECRET` and `GRAYLOG_ROOT_PASSWORD_SHA2`, disposable host-only ports, official sample files, first-run/preflight login, input stream/index routing, a locally generated synthetic GELF HTTP event, missing-message negative diagnosis and bounded teardown. The learner must select the actual version-matched official Compose files and inspect ports/volumes before using the commands; the guide is **not** a fabricated tested Compose deployment.

Source contracts require these details, and the Reliability browser traversal checks the page's rendered teaching heading and copyable commands. The Reliability browser now also performs a synthetic practical-evidence plus reflection **IndexedDB reload/re-entry** test on the first original path after wrapper removal. This establishes storage/re-entry behavior only when its final matching-head browser job passes; it is not a novice comprehension assessment or a migration test for previously stored synthetic wrapper IDs.

Official authoritative references: [Graylog containerized deployment](https://go2docs.graylog.org/current/downloading_and_installing_graylog/graylog_and_docker.htm), [Graylog Docker first run](https://go2docs.graylog.org/current/downloading_and_installing_graylog/docker_installation.htm), [Inputs](https://go2docs.graylog.org/current/getting_in_log_data/setup_an_input.htm), [GELF HTTP input](https://go2docs.graylog.org/current/getting_in_log_data/gelf.html), and [official demo Compose repository](https://github.com/Graylog2/docker-compose).
