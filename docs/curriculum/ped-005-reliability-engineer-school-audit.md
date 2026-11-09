# PED-005 — Reliability Engineer whole-school source audit

**Date:** 2026-11-02. **Issue:** [#327](https://github.com/enoqueJonas/tsa/issues/327), parent [#318](https://github.com/enoqueJonas/tsa/issues/318).  
**Branch:** `curriculum/reliability-engineer-source-depth-v1`, based on merged Cloud Engineer source remediation, `master` `0561c500`.  
**School:** Reliability Engineer, 16 learning paths. **Acceptance lanes:** structural wiring ≠ authored instructional depth ≠ independent learner validation.

## Learner-order real-source inventory

`packages/runtime-kernel/src/paths/reliability-engineer.ts` combines 16 paths. The legacy assembler prepended a **generic 30-minute reliability model** to every path and a **generic 20-minute preparation** before every practical, duplicating source instructions and hiding missing prerequisite readings. These **TEMPLATED, not source-depth** pages have now been removed across all 16 paths. Actual authored reading/practical/reflection IDs remain, with new source readings added only where genuine teaching prerequisites were absent. The real, sometimes practice-only source must be audited rather than counting generated headings as evidence.

| # | Path | Actual authored sources | First source judgment and risk | Remaining learner proof |
|---|---|---|---|---|
| 1 | Reliability and SRE Foundations | `reliability-sre-foundations-deep.ts` | Concept/quality/failure readings and practicals present; SOURCE REVIEW REQUIRED | Trace user-level loss versus healthy host |
| 2 | Service Level Engineering | `reliability-service-level-engineering-deep.ts` | SLIs, SLOs and error budgets present, but verify denominator and missing-data cases | Execute correct numerator, denominator and error-budget calculations |
| 3 | Observability | `reliability-observability-deep.ts`, `reliability-tracing-backend-decision.ts` | Eight source concepts plus backend decision; added an executable synthetic 503 diagnostic joining error ratio, sanitized event and linked/missing spans. No real monitoring implied | Reproduce one failing user request using logs/metrics/traces |
| 4 | Production Logging | `reliability-production-logging-deep.ts`, `reliability-central-logging-decision.ts`, **`reliability-graylog-event-trace.ts`** | All eight original logging concept readings deepened with distinct mechanisms/failure/transfer plus Graylog stack decision and GELF lifecycle reading. **SOURCE REMEDIATED for core concepts, live Graylog UNVERIFIED** | Real sanitized emitted→transported→indexed→searched event, negative transport/parse stage and recovery |
| 5 | Metrics, Prometheus and Grafana | `reliability-metrics-prometheus-grafana-deep.ts` | Source includes 13 distinct concepts but many overview sections; risk of graph familiarity without rate/label semantics | Actual counter/rate/histogram and missing-data alert failures |
| 6 | Distributed Tracing | `reliability-distributed-tracing-implementation-deep.ts` | One substantial reading plus three implementation activities. Validate real context/span propagation and runtime evidence | Trace root/child spans and missing downstream propagation |
| 7 | Observability Stack Integration | `reliability-observability-stack-integration-deep.ts` | Originally PRACTICAL-ONLY; now starts with genuine authored symptom→metric→log→span→action→verification reading, then original implementation practice | Source-authored prerequisite written and generic wrapper removed; real incident execution and cross-signal query still UNVERIFIED |
| 8 | Alerting and On-call | `reliability-alerting-on-call-deep.ts` | Symptom-based alerts and runbooks. Source-level demonstration needs alert signal/response/closure evidence | Owned alert, delivered notification and actionable recovery |
| 9 | Alertmanager Implementation | `reliability-alertmanager-implementation-deep.ts` | Actual operational reading exists and covers routing/silencing; no duplicate alerting system | Real receiver, grouping, silence expiry and resolved event |
| 10 | Database Stewardship | `reliability-database-stewardship-deep.ts` | Deep PostgreSQL-oriented source and labs; inspect role, query, transaction and backup preconditions | Execute safe SQL query/lock/failure paths on disposable database |
| 11 | Performance and Capacity | `reliability-performance-capacity-deep.ts` | Latency, saturation, capacity and meaningful baselines; avoid fabricated SLO wins from one sample | Bounded load with p95/error-rate plus bottleneck evidence |
| 12 | Resilience and Distributed Failure | `reliability-resilience-distributed-failure-deep.ts` | Timeouts, retries, idempotency and failure boundaries. Source must prove duplicate-side-effect safety | Execute correct retry/backoff and negative idempotency case |
| 13 | Data Protection and Disaster Recovery | `reliability-data-protection-disaster-recovery-deep.ts` | Backup/PITR/DR objectives present; never replace restore with screenshot | Isolated point-in-time restore, elapsed RTO and data validation |
| 14 | Incident Management | `reliability-incident-management-deep.ts` | Detection/response/timeline/postmortem present; test human decision quality not labels | Tabletop stabilization, incident commander actions, verified fixes |
| 15 | Fault Injection | `reliability-fault-injection-deep.ts` | Bounded hypothesis/blast radius is taught; protect real Steward state | Approved disposable fault/abort and consumer-level verification |
| 16 | Reliability Engineer Milestone | `reliability-steward-reliability-program-deep.ts` | Originally PRACTICAL-ONLY; now begins with an authored evidence/measurement/restore/claim-provenance brief before original milestone practices | Source-authored milestone brief added; real cross-signal fault, restoration and independent handoff still UNVERIFIED |

**Decision:** stay in Reliability Engineer until this entire school has received source-level instructional review. Do not move to another school just because the 16 paths compile. Some existing source readings are deep enough to preserve, but neither length nor presence of readings proves a novice can execute the lab.

## First actual remediation — GELF event lifecycle before Graylog dashboard

The new `reliability-graylog-event-trace.ts` is placed **after** the centralized-logging choice and **before** the later stack integration path. It is a full teaching lesson with a real authored reading, practical and independent transfer reflection. Existing lesson IDs are untouched.

The exact source-published Python 3 standard-library code creates a sanitized GELF 1.1 event with a current timestamp, sends it only to a `127.0.0.1` socket using a short single UDP datagram, checks the recovered structured fields and rejects a deliberately missing required `short_message`. This is **a local socket and strict portable producer contract**, not live Graylog. Graylog's own parser may be more lenient in some versions. The lesson then traces source → shipper → GELF/other input → processing/stream → journal/search data node → index → time-bounded searchable query, and contrasts UDP delivery limitations with TCP/HTTP/TLS. The real follow-up practical requires a learner-owned Graylog instance and an actual query hit.

Source references: [Graylog GELF format](https://go2docs.graylog.org/current/getting_in_log_data/gelf_format.html), [input behavior](https://go2docs.graylog.org/current/getting_in_log_data/inputs.htm), [log lifecycle](https://go2docs.graylog.org/current/planning_your_deployment/the_log_lifecycle.htm). These references confirm producer fields, input/transport boundaries and index/search lifecycle; they do not establish any learner's actual Graylog deployment.

**Source test:** `scripts/check-reliability-graylog-event-trace.mjs` extracts and runs exact published learner Python, verifying the local success and malformed-negative result and blocking false assertions of Graylog indexing. Full curriculum CI is required for this branch.

## School-wide source reconstruction checkpoint

- **Wrapper correction:** `reliability-engineer.ts` now surfaces the original learning path lessons directly for all 16 paths. The removed generated 30-minute orientation and repeated 20-minute preparation blocks are not counted as learner depth. `scripts/check-resolved-practical-contracts.mjs` verifies direct source reading/practice and the original Graylog decision → GELF lifecycle order. New authored reading activities were placed at the beginning of Observability Integration and the Reliability Milestone, which previously began immediately with demanding implementation practices.
- **Original eight Production Logging readings:** `reliability-logging-source-depth.ts` enriches event schema and type invariants, level semantics versus alert severity, ID propagation through asynchronous messages, trace/request distinction, emit/ship/input/parse/journal/index/search, log-volume arithmetic and sampling, redaction-before-ingest, retention/index responsibilities and independent negative investigations. These additions render inside the original eight concept readings through `extraLoggingBlocks(spec.id)`; no replacement generic page is used.
- **Original Observability readings:** `reliability-observability-source-proof.ts` contains one standard-library Python synthetic incident model: four requests including one 503, a single matching sanitized timeout event, two related spans and one unlinked worker span. It prints 0.25 aggregate errors, exactly one matching event, two linked spans and one unlinked worker. It explicitly teaches why missing propagation does not establish causality and why request IDs belong in logs/traces rather than metric labels. The exercise is attached to the actual Logs/Metrics/Traces and Telemetry Design readings, not a generated orientation.
- **Automated source checks:** `scripts/check-reliability-logging-source-depth.mjs` covers the eight actual logging topics; `scripts/check-reliability-observability-source-proof.mjs` extracts and executes the literal learner Python, including the missing-context negative. The branch workflow now includes these alongside the original GELF loopback test. Neither test runs Graylog, Prometheus, Grafana or Tempo.
- **Intentional boundaries:** Existing stronger source topics (database locks, SLIs/SLOs, retries, backup/recovery, incident command and hypothesis-driven fault injection) are retained instead of rewritten merely for length. Their complete infrastructure and independent learner validation remain on the issue ledger. A source-level pass cannot mark all 16 paths learner validated.

The official Graylog [GELF 1.1 specification](https://go2docs.graylog.org/current/getting_in_log_data/gelf_format.html) confirms portable required fields and also distinguishes the current server parser's more permissive behavior; the [Graylog Inputs](https://go2docs.graylog.org/current/getting_in_log_data/inputs.htm) and [data-management](https://go2docs.graylog.org/current/making_sense_of_your_log_data/manage_your_log_data.htm) references support the ingest/stream/index distinction. A local GELF UDP socket proves neither an indexed search result nor retention.


### New exact SLI and metrics worked source — 2026-11-02

The source-audit continuation added `reliability-sli-metrics-worked.ts` to the actual Service Level Engineering and Metrics original readings (original IDs unchanged). Four SLI teaching contexts explain eligible/good event sets, missing denominators, asynchronous lifecycle completion, allowed error budget, multi-window alerts and low traffic; three Metrics teaching contexts explain counter-reset `rate()`, valid denominator and label identity, classic cumulative histogram buckets and empty Prometheus vectors. The exact local Python event-population, request budget, histogram and PromQL printing examples are exercised by `scripts/check-reliability-sli-metrics-worked.mjs` in CI. These are **synthetic/local source checks**, not a real Prometheus scrape, running Steward SLI or Graylog query. Matching-head CI and independent learner transfer remain required.


### Tracing handoff and missing-context source proof

The original `reliability-distributed-tracing-implementation-deep.ts` reading now includes `reliability-tracing-propagation-worked.ts`, a W3C `traceparent` field explanation and standard-library Python positive synthetic message propagation / missing-header negative case. `scripts/check-reliability-tracing-propagation.mjs` executes the **exact published source snippet** in CI. This demonstrates correct local ID syntax and a modeled header handoff, **not** running RabbitMQ propagation, OpenTelemetry SDK export, Tempo indexing, sampling or real span retrieval. Those still require the learner-owned environment, rendered review and independent transfer validation.

## Remaining source and evidence gates

- [x] Inventory all **16 paths** and remove synthetic wrappers; add genuine first-principles teaching for the two originally practice-only paths; remediate original logging and observability source gaps. Independent module teach-back remains open.
- [ ] Execute local examples wherever feasible and add source-derived regression tests; do not claim tests not run.
- [ ] Prove real Graylog input, search, retention, role and malformed/lost/late event behavior in an approved disposable environment.
- [ ] Trace one real incident across Graylog logs, Prometheus metrics and a tracing backend; an attractive dashboard is not sufficient.
- [ ] Inspect rendered learning pages and progress persistence/re-entry; verify independent novice teach-back/application.
- [ ] Run complete matching-head CI and only then merge source work. Keep issue #327 open for learner validation.

**Current status:** School-wide source inventory and targeted instructional reconstruction substantially advanced; full matching-head CI, real infrastructure labs and learner transfer remain open. **NOT LEARNER-VALIDATED.**


## Consolidated Reliability source execution evidence (from PR #342)

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


## Forward learner-depth continuation — 9 November 2026, stacked on Cloud draft #404

**Draft:** [PR #408](https://github.com/enoqueJonas/tsa/pull/408). Based on `06673bdf`, Cloud final milestone draft #404. All previous original learning-progress IDs are unchanged.

### Reliability module 1 — first original SRE lesson, actual service boundary

- `reliability-sre-source-depth.ts` now embeds the **complete learner-copyable Python 3 localhost HTTP and temporary SQLite** example in the original `reliability-and-sre-reliability-quality-attribute-001` reading. The first paired original practical requires the learner to execute it and falsify two wrong implementations.
- It contrasts GET `/health` 200 with POST `/register` 503; rejects a false HTTP 200 without a committed SQLite record; denies unauthorized POST 403; then verifies a recovered 201 through a **separate SQLite read connection**. The SQLite file is disposable; this is neither actual Steward nor real distributed durability.
- `scripts/check-reliability-sre-source-depth.mjs` executes the exact source and rejects (1) HTTP-status-only success, (2) skipped committed write, and (3) bypassed authorization. Full matching-head workflow acceptance remains required.

### Reliability module 2 — actual event population, deadline and incomplete instrumentation

**Original IDs unchanged.** `reliability-service-level-engineering-deep.ts` now wires `reliability-service-level-lifecycle-evidence.ts` into the original `slis`, `error-budgets` and `windowing` readings and adds explicit source-running/negative-transfer tasks to their original applied practicals.

- The exact published Python 3 script creates and commits four synthetic operations in a disposable SQLite file, matches three consumer effects through a `LEFT JOIN` from a **separate connection**, and treats an effect as timely only if completed within 60 seconds of commit. At `as_of=120`, the entire cohort is mature. Two of four qualify; one is late and one absent, so the *classroom lifecycle SLI* is 50.00%, not the misleading synthetic 5/5 HTTP acknowledgments.
- With a **hypothetical** 90% success SLO, the event-based budget is 0.4 event-equivalents; two failures consume it 5.00 times. This fraction is an accounting construct, not 0.4 actual failed requests. Four events do not establish long-term service performance.
- The synthetic event export omits one of four committed operations, producing coverage 3/4. Metric-only conclusions cannot treat omitted events as green; the example reports `MANUAL_REVIEW_OBSERVABILITY_GAP`.
- The synthetic short event-time window [20,50) has one timely effect in three committed operations. Its stated minimum 20 samples is an illustrative local decision rule only—not a universal paging standard. The exercise also forces a false early evaluation at `as_of=75` to fail rather than misclassify unfinished operations.
- `scripts/check-reliability-sli-metrics-worked.mjs` executes the exact source and rejects five deliberate mistakes: dropped missing effect via inner join, all-commits-success assumption, late-effect acceptance, hidden missing telemetry and immature cohort evaluation.

### CI gate correction from actual failing evidence

The previous exact-head [curriculum workflow #42637465134](https://github.com/enoqueJonas/tsa/actions/runs/42637465134) failed **only** in the cross-school Cloud browser traversal: `steward-internet-environment-gate-1-hosting-architecture-001` rightly disabled blank Next. The test had assumed all activities were click-through. This is a **test-contract defect**, not a reason to bypass Cloud's operational evidence requirements.

`scripts/check-school-learner-browser.py` now verifies the original final Cloud first gate remains disabled with its visible self-attestation warning; records two inspected original activities and eight **NOT_BROWSER_VERIFIED** operational activities. It does NOT fabricate evidence, mark the gate passed or claim whole-milestone traversal. Any other unexpectedly disabled next action remains a test failure.

### Current acceptance boundary

- [ ] Confirm latest matching-head 19-job CI, source-extraction tests, full `pnpm test`, `pnpm audit:curriculum`, `pnpm build` and real rendered reading/practical evidence. Superseded workflows and source-only checks do not count.
- [ ] Independently examine the learner's comprehension and unaided transfer, using fresh variants not copied from public practice.
- [ ] Run production-appropriate Steward/PostgreSQL/RabbitMQ/Graylog/Prometheus/Tempo investigations and independently verify live business side effects; local SQLite is **not** that evidence.
- [ ] Continue in learner order to burn-rate alerts and policy decisions, then remaining Reliability original modules.
- [ ] Keep #327 OPEN and both #404/#408 draft/unmerged until their separate acceptance conditions are met.
