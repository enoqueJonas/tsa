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


## Graylog indexed-search teaching — 9 November 2026, incremental Reliability module 4

**Source:** `packages/runtime-kernel/src/paths/reliability-graylog-indexed-search-contract.ts`, rendered in one **new focused reading** `logging-graylog-event-lifecycle-indexed-search-reading`, inserted after the original `logging-graylog-event-lifecycle-001` and before the unchanged original practical `logging-graylog-event-lifecycle-002`. The original intro remains responsible for GELF schema/UDP only; the new reading teaches schema-to-row matching and live search verification before the practical. All three previously existing progress IDs are preserved.

### Problem, mechanism and actual acceptance boundary

The original lesson explained GELF schema, transport, processing, indexing and querying, but the executable sample observed **only loopback UDP**. It could not independently prove even the search-response *verification contract*. A reader might wrongly treat GELF HTTP `202 Accepted` as proof of indexed, queryable evidence.

The new **exact source-published Python 3** contract is built around documented Graylog 7.2 GELF HTTP `POST /gelf` and Search Scripting API `POST /api/search/messages`. The latter returns columnar `schema` plus `datarows`; a valid search proof must match the **specific unique `request_id`, `event` and `outcome` in the actual returned row**, not merely HTTP 200 or any row.

- **Default mode is explicitly fake**: a disposable localhost Python HTTP handler synthesizes accepted GELF transport + scripted search response shape. `DEMO_CONTRACT_PASS` is a verifier behavior test, emphatically **not Graylog ingest/index/search**.
- Local negative scenarios: `TSA_DEMO_SCENARIO=ack_only` (202 but no rows); `wrong_id` (unrelated ID); `missing_field` (request ID absent); `search_denied` (403); `input_down` (503). All must exit nonzero. Source mutations reveal why skipping HTTP status, exact indexed ID or the search result can falsely accept a negative.
- **Live mode is opt-in and NOT EXECUTED in this source pass:** `python3 graylog_search.py --live` requires `TSA_GRAYLOG_VERIFY_LIVE=1`, explicit learner-owned GELF input and search API URLs plus credentials from the environment; external URLs require HTTPS, with loopback-only HTTP permitted. It makes one sanitized event with a unique ID and polls an actual search API for a bounded time; no credentials are embedded in source. A real passing hit could show **one queryable event at that time**, not retention, actual Steward emission, all-users access, high-volume durability or operator competence.
- Exact-source Node gate `scripts/check-reliability-graylog-event-trace.mjs` executes the local script and negative variants, with explicit no-live-environment isolation; rendered-browser gate in `scripts/check-school-learner-browser.py` checks the real original reading/practical, copyable code, provenance warning and 390px layout.
- **Technical status:** newest matching-head workflow result still required before calling this particular change technically verified; prior green #42639689108 refers only to the preceding HTTP/SQLite and SLO batch.

### Vendor provenance

Graylog's versioned documentation: [GELF HTTP Input](https://go2docs.graylog.org/current/getting_in_log_data/gelf.html) documents `/gelf` and 202 acceptance-for-processing; [Search Scripting API](https://go2docs.graylog.org/current/making_sense_of_your_log_data/simple_search_scripting_api.htm) documents POST message search, query, `schema`, `datarows` and search ranges. Actual deployment/version compatibility must be checked by the learner.

**Open:** Real Graylog input → journal → processing/stream → index/data node → exact search, with input outage and recovery, time skew, privacy/role/retention checks. Existing global Reliability issue #327 and independent learner validation stay OPEN; PR #408 remains DRAFT/UNMERGED stacked on Cloud #404. No real Graylog instance or actual indexed hit was claimed from CI.


## Original Observability + Production Logging correlation boundary — 9 November 2026

**Context:** Continues draft [PR #408](https://github.com/enoqueJonas/tsa/pull/408), whose immediately prior indexed-search reading had an exact-head 19/19 green workflow at `c10414b3`. The following changes are *new* and require their own matching-head verification.

### Existing lessons strengthened, no original ID changes

- Observability `observability-correlation-context-001/002`: new source-linked executable Python 3 standard-library **actual loopback HTTP** `POST /register`, SQLite authoritative operation + outbox commits, separate consumer connection, and independent auditor query. Two requests return HTTP 202; **both have actual durable outbox records and final effect rows**. The first worker retains the original 32-hex W3C-style trace ID; the second deliberately drops worker trace context while preserving the request ID and completing the effect. The reader must distinguish broken observability from broken business outcomes.
- Observability `observability-instrumentation-001/002`: explicitly shows why an `operation_committed` event and an `effect_committed` log are not interchangeable with actual database facts. A producer's HTTP acknowledgement is not proof of final processing. The learner must mutate logging independently from persistence and verify the consequences.
- Production Logging `logging-correlation-ids-001/002`: requires interpreting the **same preceding real local experiment**, investigating request_id, trace_id and operation_id separately, showing why timestamps alone cannot establish a cross-worker relationship, and why a correlation ID never authorizes a request.
- Production Logging `logging-privacy-security-001/002`: the same actual local POST includes an explicitly **fake** `Bearer DO_NOT_LOG_CLASSROOM_TOKEN` header, while event emission uses a strict allowlist. A deliberate source mutation inserting the Authorization field must fail instead of silently publishing a token. Only synthetic values are safe test fixtures.

The new source map `reliability-observability-correlation-evidence.ts` renders into the **original** Correlation and Instrumentation readings. `scripts/check-reliability-observability-source-proof.mjs` executes **exact learner-published** Python and four negative source mutations: dropped healthy worker trace context, dropped consumer request ID, missing actual consumer effect commit and leaking synthetic Authorization into the emitter. Browser regression verifies source headings, code Copy, applied original practicals and 390px rendering; no new wrapper lessons or changed activity IDs.

### Evidence boundary

This runs real localhost HTTP and real disposable SQLite commits and an independently queried durable effect. The worker is an in-process simulated separate consumer connection: **no RabbitMQ deliveries, publisher retries, real Steward services, live Graylog indexing, Tempo exporter or OpenTelemetry SDK**. The example's W3C-shaped `traceparent` demonstrates a context-carrying mechanism, not a verified real distributed trace or compliant real producer integration. In-memory logs demonstrate a source allowlist; **real centralized indexing and retention remain a separate unverified acceptance gate**.

At this audit entry the latest matching-head workflow is still in progress; passing the old 19/19 run from the previous module does not certify this new code. Human uncoached learner-transfer and live integration continue as OPEN in issue #327.


## Metrics/Prometheus/Grafana real local scrape lesson — 10 November 2026

**Branch:** draft [PR #408](https://github.com/enoqueJonas/tsa/pull/408), stacked on draft Cloud/Delivery PR #404. This batch follows the previously exact-head green 19/19 Observability/Logging continuation; it needs a **new matching-head CI run** before technical acceptance.

### Actual source and original activity placement

New `packages/runtime-kernel/src/paths/reliability-metrics-scrape-evidence.ts` renders via `metricsScrapeEvidenceBlocks(spec.id)` in a **new focused Prometheus scrape-failure reading** and the existing original PromQL/Grafana readings. The original Prometheus Architecture introduction, practical and reflection retain their IDs; the new source reading is inserted **between** original `-001` fundamentals and `-002` practical rather than adding a 6,000-character program to the introductory page.

- **Prometheus Architecture focused reading `metrics-prometheus-grafana-prometheus-architecture-scrape-failures-reading`:** preserves the original `-001` for fundamentals and gives the 65-minute executable lab its own page. It publishes Python 3 standard-library localhost `ThreadingHTTPServer` responds to real `POST /register`, `GET /health` and `GET /metrics`. Text exposition defines `http_requests_total` with two bounded `route="/register"`/`status_class` counter series (preinitialized `2xx=0`, `5xx=0`). A caller independently records observed 201/503/201 outcomes and confirms two successes + one failure in scraped counters. No user/request IDs enter metric labels.
- **Zero traffic:** both initialized counters read zero but denominator is zero; class marks ratio `UNKNOWN`, **not** a healthy 0% error rate.
- **Scrape outage:** the metrics HTTP endpoint returns 503 despite the user API and `/health` returning successful responses. The local *modeled scrape outcome* is `up=0`, with absent metrics and interval reported as UNKNOWN, not magically substituted with zeros.
- **Stale-but-HTTP-200 exporter:** a deliberately defective metrics endpoint returns its previous text snapshot with 200, while a fourth actual client POST has succeeded. A naive transport-only `up=1` would miss the fact that the independently caller-observed request count is four and exposed total remains three. On recovery a fresh scrape shows three successes and one failure.
- **PromQL original reading `metrics-prometheus-grafana-promql-001`:** reuses the above real endpoint and distinguishes configured-target failure (`up=0`), fully absent/stale discovery and a good scrape of stale exporter text. It teaches independent target inventory, evaluation windows, empty/zero denominator, labels, `/api/v1/targets`, `up{job="steward-api"}`, and `absent_over_time(up{job="steward-api"}[10m])` without presenting any one query as an explanation for all outages.
- **Grafana original reading `metrics-prometheus-grafana-grafana-001`:** teaches explicit **No data / Error / alert NoData** expectations separately from green business metrics. Real panel behavior requires separately run Prometheus + Grafana and a disposable target; classroom localhost source is insufficient.
- Original paired practical activities `-002` for all three topics now require source-executed changed-case diagnosis and/or real infrastructure verification with explicit **NOT_TESTED/UNVERIFIED** reporting when absent.

`scripts/check-reliability-metrics-scrape-evidence.mjs` executes the **exact authored Python from the reading**, checks actual output, then runs six deliberate wrong-source mutations for false zero denominator, failed scrape treated healthy, stale-200 accepted as fresh, undercounted 5xx, removed zero-initialized class and dropped caller-side verification. Each mutation must fail a source assertion. GitHub Actions `curriculum-audit.yml` includes this gate. The original browser traversal checks the preserved introduction, inserted focused reading, copyable source, practical transfer and 390px layout.

### What these results could and could not establish

The new program **does use real local HTTP requests and real Prometheus-compatible text exposition**; the scrape is run by Python `urllib`, not Prometheus itself. Its local `up` printout **models** a single fetch result; it does **not** query a genuine Prometheus-generated `up` series or exercise Prometheus's TSDB, scrape scheduler, staleness markers, rate/increase evaluation, service discovery, relabeling or Grafana rendering. A `/register` 201/503 is an explicit **synthetic HTTP response**, not proof of Steward's durable business effects. The cumulative 1/3=33.33% illustration is **not** a five-minute PromQL rate, real SLI or alert evaluation.

The learner must still run a real Prometheus server against an approved target, demonstrate a 503 scrape plus disappearance and recovery with exact PromQL evaluation, verify actual Grafana NoData/alert behavior and independently explain changed-case conclusions. Real deployment and uncoached learner validation remain OPEN under #327, with PR #408 DRAFT/UNMERGED.

**Primary references:** [Prometheus job/instance and generated up](https://prometheus.io/docs/concepts/jobs_instances/) and [PromQL selectors, lookback and stale samples](https://prometheus.io/docs/prometheus/latest/querying/basics/).


## Recording Rules → Actionable Alerting: real Prometheus expression-engine tests — 10 November 2026

**Decision:** The immediately preceding metrics/scrape batch's [matching-head workflow #42766248507](https://github.com/enoqueJonas/tsa/actions/runs/42766248507) was **CANCELLED** after 18/19 jobs, not fully green; the Cloud browser had not completed. Do not inherit a green result from an older SHA. This new batch must earn its own matching-head 20-job workflow.

### Original learner order and genuine source

- Preserved original Recording Rules Concepts reading `metrics-prometheus-grafana-recording-rules-001`, original practical `-002` and reflection `-003`; inserted one focused 75-minute `metrics-prometheus-grafana-recording-rules-promtool-reading` **between** original reading/practical. This follows the rule to split complicated mechanisms into multiple lessons without deleting progress IDs.
- Committed **real Prometheus rule-engine inputs**, not a Python approximation, at `labs/reliability-prometheus-rules/steward.rules.yml` and `steward.test.yml`. They are embedded byte-for-byte as copyable YAML in `reliability-prometheus-rule-engine-depth.ts`. Three recording rules compute completed HTTP 5-minute request rates, 5xx rates and a matched `route`-label error ratio using `rate()` before `sum by (route)`. A user-error alert adds a minimum-traffic filter on route and `for: 2m`; a configured scrape failure uses `up{job="steward-api"} == 0`, while a **missing** expected target uses `absent_over_time(up{job="steward-api"}[5m])`. No universal `or vector(0)` hides missing telemetry. Demo 20%/0.10 req/sec thresholds and severity=ticket are **teaching policy**, not production SLO or paging authority.
- `steward.test.yml` exercises five official Prometheus test groups: healthy→sustained 5xx, initialized zero-traffic counters, sustained failed configured target, transient scrape failure and absent expected target. The tests assert both PromQL recording-rule labels/values and pending/firing alert states. Original Prometheus source already explains localhost scrape failures but those tests did not execute PromQL; this new fixture targets that missing rule-engine boundary.
- The original `alerting-and-on-call-actionable-alerts-001/002/003` IDs remain. `reliability-actionable-alerts-depth.ts` now teaches distinct stages of raw metric → Prometheus evaluation → Alertmanager transport → human action. The unchanged original practical now requires a real `promtool` result, a wrong-source test and separate actual notification receipt before claiming any operational alert delivery.

### Technical gates and deliberate source failures

- `scripts/check-reliability-prometheus-rule-engine.mjs` asserts the **two displayed YAML strings equal the exact committed fixture bytes**, checks original ID/wiring and incident categories, and emits three deliberate wrong-rule fixtures: `up==1` substituted for failure, 2xx+5xx mistakenly counted in the error numerator, and `up==0` substituted for missing-target detection.
- The `validate` workflow runs that source guard. New independent `prometheus-rule-engine` job runs **official `promtool`** from the versioned `prom/prometheus:v3.13.3` image on read-only mounted lab sources, with container network disabled. It runs `promtool check rules` and `promtool test rules` against genuine Prometheus expression/alert semantics, then requires all three wrong-source fixtures to fail with the unchanged expected test data. No synthetic Python replacement or acceptance-by-static-text.
- The original Reliability Playwright traversal checks fundamentals, the focused YAML+commands, negative-control transfer, original actionable alert teaching and original practice at 390px.

### Independent acceptance still outstanding

Real `promtool test rules` on **synthetic samples** can prove correct rule-engine evaluation and distinguish some missing-data states; it does **not** mean any actual Steward metrics, Prometheus target, persistent TSDB, production query coverage, Grafana panel, Alertmanager notification/deduplication, on-call acknowledgement or runbook effectiveness was observed. The source explicitly requires a live restricted test environment for those steps. Uncoached learner teach-back remains OPEN. Keep Reliability issue #327 OPEN; draft PR #408 remains stacked on draft #404 and unmerged.


## Actual Alertmanager delivery routing, grouping, inhibition, and 503/recovery — 10 November 2026

The preceding Prometheus recording-rule batch has exact-head **20/20 SUCCESS** for `2fafd6f8e3845405bdffb45163783227102bbfd8` in [CI #42778669823](https://github.com/enoqueJonas/tsa/actions/runs/42778669823), including real `promtool` expression evaluation on synthetic time series. This new Alertmanager batch has **not** inherited that evidence and must independently pass the enlarged 21-job workflow.

### Source gap and teaching split

The pre-existing original Alertmanager reading `reliability-alertmanager-implementation-001` already contained a standard-library localhost HTTP webhook that manually delivered fake `firing`, received 503, and manually sent `resolved`. This genuinely demonstrated only the **receiver** HTTP interface, **not Alertmanager** routing/grouping/inhibition/delivery. Prior source labeling was appropriately explicit. The original practicals `-002`, `-003` and reflection `-004` remained unproven as real running infrastructure.

Two focused readings have now been inserted **after original `-001`, before original `-002`** without renaming or deleting any old activity IDs:
- `reliability-alertmanager-implementation-route-mechanics-reading`: real routing tree semantics, `group_wait`/ `group_interval` / `repeat_interval`, duplicate suppression, scoped parent/derivative inhibition, safe fallback, and exact source YAML with no remote receiver.
- `reliability-alertmanager-implementation-live-delivery-reading`: exact source-published Python runner that executes the official pinned Alertmanager **`prom/alertmanager:v0.28.1`** Docker image on Linux, binds a real HTTP receiver to OS-selected `127.0.0.1` port, renders the single committed config template, posts test alerts to the **actual Alertmanager v2 API**, and inspects actual resulting receiver webhooks. It demonstrates a matched group of two alerts becoming one notification, immediate duplicate suppressions, security-team and fallback routes, parent `DatabaseDown` inhibiting related `ApiDependencyFailed`, a genuine receiver 503, fresh notification after receiver recovery, and resolved webhook. Receiver attempts and HTTP-200 accepted deliveries are tracked separately.

The runtime lab source is `scripts/check-reliability-alertmanager-runtime.py`, template `labs/reliability-alertmanager/alertmanager.yml.template`, published **byte-identically** in `reliability-alertmanager-real-runtime.ts`. The group/interval values (2s/5s/30s) and `severity=ticket` are disposable classroom settings, **not production paging policy**.

### Test claims and negative controls

- `scripts/check-reliability-alertmanager-source.mjs` asserts byte-level parity of learner-visible config/Python and committed executed files, preserved original IDs and original paired practice transfer requirements. It generates **four** isolated intentionally wrong configs: split grouping via `alertname`, wrong security matcher, broken parent inhibition, and wrong reliability route.
- New dedicated GitHub Actions `real-alertmanager-delivery` job runs the **actual** official Alertmanager Docker image, proves all receiver observations against source-published learner Python, and requires each wrong config to fail actual receiver assertions. CI browser traversal checks both focused readings, source Copy, original activity IDs and 390px layout.
- The original practicals `-002` and `-003` now explicitly demand that real lab and mutated config outcomes before any claim of real Alertmanager operation. Failures of a local receiver (HTTP 503), missing owner route, grouping mistakes and dependency inhibition cannot be declared handled merely from YAML. A resolved notification is observed at the receiver rather than inferred from alert labels.

### Strict remaining operational boundary

This actual Alertmanager runtime lab uses **synthetic alert arrays manually posted via the `/api/v2/alerts` API**, bypassing Prometheus. Therefore it **does not prove** the missing Prometheus rule→Alertmanager forwarding edge, production service discovery, production Alertmanager HA/cluster state, true external email/Slack/PagerDuty receipt, Alertmanager retry of a previously rejected request, end-user acknowledgment, on-call response or unaided learner competence. A successfully delivered **fresh group after recovery** is not proof that an older HTTP 503 was retried or that exactly-once notification semantics exist.

Real deployed Steward/Prometheus→Alertmanager and recipient evidence remains explicitly **UNVERIFIED** under issue #327. PR #408 stays DRAFT/UNMERGED, stacked on draft #404.


## Real Prometheus → Alertmanager transport continuation — 10 November 2026

The Alertmanager branch already had a real official `prom/alertmanager:v0.28.1` runtime harness with grouping, team routing, inhibition, fallback, duplicate suppression, 503 receiver failures, fresh-group recovery and resolved webhooks. This is valuable **but its driver posts synthetic alerts directly to Alertmanager `/api/v2/alerts`**. That path alone cannot establish that an actual Prometheus evaluation reaches Alertmanager.

This continuation adds `scripts/check-reliability-prometheus-to-alertmanager.py` and its byte-identical copyable source in `reliability-prometheus-to-alertmanager-proof.ts`, in a new focused 75-minute `reliability-alertmanager-implementation-prometheus-forwarding-reading` **before** the original Alertmanager practical `-002`. All original Alertmanager activity IDs `-001`, `-002`, `-003`, `-004` and earlier focused readings are preserved.

**Real component boundaries in CI:** run official `prom/prometheus:v3.13.3` with a one-second scrape and rule-evaluation interval, official `prom/alertmanager:v0.28.1`, a synthetic localhost `/metrics` gauge server, and a localhost-only webhook receiver. Verify Prometheus **API** reports `up{job="steward-api"}=1`; an inactive baseline does not produce a premature alert; a controlled metric transition `0→1` causes an actual **firing** webhook; transition `1→0` causes an actual **resolved** webhook. Do not accept mere 200 from the alert-forwarding API: check receiver observations and status, alertname and intended route. The run cleans up disposable Docker processes and web servers.

**Negative source control:** `TSA_FORWARD_RULE_VARIANT=wrong-condition` inverses the Prometheus rule, which should fire during the inactive baseline. The exact same real integration runner must reject it; changing expected output or treating a wrong alert as correct is prohibited. The original practical now requires independent real forwarding observations, while still making clear that synthetic controlled gauge ≠ Steward request SLI, production alert routing or human acknowledgement.

**First failed diagnostic and corrected design:** A suspended Alertmanager left a TCP connection hanging and the real Prometheus notification-error counter did not increase before the bounded timeout; `/api/v1/alerts` still showed FIRING, so this was not valid evidence of a rejected notification. The lab now performs a **hard stop of the disposable Alertmanager container** (explicit connection refusal), observes real Prometheus notification errors while the rule remains firing, and starts a fresh disposable container before requiring receiver delivery. This tests hard unavailability and re-establishment, **not** recovery of the old Alertmanager notification log or durable replay of arbitrary unsent alerts.

**Second failed oracle and corrective proof:** Under a hard outage, Prometheus's own `/metrics` endpoint exposed **6 notification errors, 6 dropped notifications, zero successful sends** while `/api/v1/alerts` remained FIRING. The first test mistakenly looked for the internal counters using `/api/v1/query`, which correctly returned no vector because this synthetic Prometheus config does not scrape itself. The test now parses actual self-exposed `/metrics` counters, explicitly distinguishes error and drop totals, and requires receiver silence before restarting the routing process. This does not claim any arbitrary lost notification was durably retained or delivered later.

**Technical status:** CI of this new code requires matching-head verification. The earlier successful Prometheus rule unit tests with `promtool` do not substitute for this transport test. This test's real containers are local lab infrastructure, not a deployed target, production pager, real operator ACK, historical telemetry retention or independent learner verification. Keep #327 OPEN and draft #408 UNMERGED.


## Alertmanager outage while real Prometheus keeps firing — 10 November 2026

**Existing verified baseline:** [run #42801179078](https://github.com/enoqueJonas/tsa/actions/runs/42801179078) was exact-head 21/21 green for official Prometheus→Alertmanager→localhost webhook using a controlled synthetic gauge. That test was not an outage test. This continuation adds real transport failure and recovery; it **requires a NEW matching-head workflow** before any resilience acceptance.

### New original-path teaching and test boundary

The 60-minute focused reading `reliability-alertmanager-implementation-outage-recovery-reading` follows the focused real Prometheus-forwarding reading **before** the original `-002` Alertmanager deployment practical. The existing `-001/-002/-003/-004` IDs, route-mechanics and live-delivery focused readings are preserved. Original recovery practice `reliability-alertmanager-implementation-003` requires actual observed Prometheus rule state, notification error and later webhook rather than a hypothetical outage. The new reading deliberately *reuses* the source already published in the preceding forwarding reading instead of duplicating a large Python script.

In `TSA_FORWARD_SCENARIO=alertmanager-outage`, the exact learner-visible `scripts/check-reliability-prometheus-to-alertmanager.py` executes official `prom/prometheus:v3.13.3` and `prom/alertmanager:v0.28.1` in isolated Linux Docker host-network lab with localhost synthetic metrics and receiver. It verifies an inactive baseline with no delivery; stops only the real Alertmanager container, producing a hard transport failure while the source gauge becomes 1; requires **Prometheus's real `/api/v1/alerts` to report FIRING**; requires actual `prometheus_notifications_errors_total` and `prometheus_notifications_dropped_total` greater than zero from **Prometheus's own `/metrics` HTTP endpoint** (the standalone test does not self-scrape these into TSDB, so `/api/v1/query` cannot find them); and prohibits any receiver firing receipt while the router is stopped. Then restart a fresh disposable Alertmanager with the same local routing config, prove an actual successful firing webhook, toggle synthetic metric back to 0 and prove separate resolved webhook. A 5-second `--rules.alert.resend-delay` is a **disposable lab acceleration**, not a production recommendation or guarantee of replay timing. The failure duration and recovery success do not establish arbitrary network-partition tolerance or long-term queue durability.

**Negative mutation:** `TSA_FORWARD_SCENARIO=outage-without-disconnect` keeps the listener working but retains the outage oracle: accepted premature firing or missing Prometheus errors must cause a nonzero program exit. CI rejects a startup error or syntax error as a valid negative by requiring specifically the expected failed-outage assertion text. The source guard requires newly introduced scenario markers and preserves byte identity of learner-visible Python and CI runner. Reliability browser checks enforce focused heading, copyable instructions, original recovery practice and 390px rendering.

### Claims that remain unverified

A successful local test would verify genuine Prometheus and Alertmanager transport failure/resumption against **synthetic signals**, but not actual Steward lifecycle measurements, real external pager/SMTP, notification persistence across arbitrary duration, real HA multi-Alertmanager topology, human acknowledgment, realistic receiver credentials, disaster-mode escalation or uncoached learner teach-back. Do not call a 200 webhook a human ACK. Keep issue #327 OPEN and PR #408 DRAFT/UNMERGED, stacked on draft #404.


## Same rejected Alertmanager webhook retry, not merely fresh delivery — 10 November 2026

**Current acceptance state:** this source batch requires its own exact-head GitHub Actions run. Previous run [#42813888940](https://github.com/enoqueJonas/tsa/actions/runs/42813888940) successfully verified real Prometheus→Alertmanager transport, outage, error/drop signals and recovery. It did **not** test whether Alertmanager retries the *same* receiver-rejected notification after transient receiver recovery. The earlier `SyntheticDeliveryFailure` 503 test proved rejection; its `FreshRecovery` success used a **different** alert and cannot support a retry claim.

### Exact lesson order and operational mechanism

Original `reliability-alertmanager-implementation-001/-002/-003/-004` IDs and all earlier focused readings are preserved. One focused 65-minute `reliability-alertmanager-implementation-same-notification-retry-reading` now follows the existing real Alertmanager runtime reading, before focused Prometheus-forwarding/outage readings and the original `-002` practical. Original `-003` recovery practical now requires evidence for three explicit cases (real 503→200 identical notification, 400 no immediate retry, and unrecovered 503 failing the positive oracle). The lab program is still authored **once** in `scripts/check-reliability-alertmanager-runtime.py`, and the exact same source code is displayed in the preceding runtime reading via the byte-identity guard against `reliability-alertmanager-real-runtime.ts`.

**Real positive mode** `TSA_AM_RETRY_MODE=transient-503`: spin up the official `prom/alertmanager:v0.28.1` with localhost-only webhook. Use one actual API submission of `SyntheticDeliveryFailure` with fixed bounded test labels, start and sufficiently future end time. The first genuine receiver POST must be HTTP 503; a responder flips to healthy; a second actual POST must return HTTP 200 **within the 20-second notification context** and **before the one-minute repeat interval**. Both webhook attempts must share the same `groupKey`, complete labels, `startsAt`, `fingerprint`, firing state, destination and service. No additional `/api/v2/alerts` POST is permitted. A separately created FreshRecovery alert is explicitly insufficient.

**Real 4xx contrast** `TSA_AM_RETRY_MODE=nonretryable-400`: a matching receiver HTTP 400 must be recorded, then **no accepted same-event retry within eight seconds**, while the disposable group interval is 20 seconds. This is deliberately a bounded negative observation, NOT a statement the alert will never appear again. The webhook retrier treats 5xx as potentially recoverable and 400 as unrecoverable; both cases rely on the actual pinned binary, not a fake Python retry emulator. Primary source: <https://github.com/prometheus/alertmanager/blob/main/notify/util.go> and <https://github.com/prometheus/alertmanager/blob/main/notify/webhook/webhook.go>.

**Unrecovered changed-case control** `TSA_AM_RETRY_MODE=permanent-503`: leave the receiver rejecting, retain the same positive identity-and-accepted-delivery oracle, and require the real run to fail with the explicit `SAME_ALERT_RETRY_NOT_PROVEN` marker. A submitted/accepted Alertmanager API request or a 503 retry attempt is never reclassified as successful webhook delivery. CI tests the intended failure reason.

**Fixture and timing scope:** only this disposable mode overrides `group_wait=1s`, `group_interval=20s`, `repeat_interval=1m`, to keep the notification pipeline alive long enough for an observable retry while bounding its separation from scheduled repeating. These numbers are **not production recommendations**. Legacy baseline and four wrong-route/group/inhibition mutant tests still run unchanged. CI includes dedicated official-binary runs for all three scenarios plus browser reading/practical and 390px checks.

**Remaining unverified:** true HTTP 503→200 acceptance will establish a bounded single-instance retry using one synthetic alert; it does not prove a durable notification queue after Alertmanager process crash, arbitrary retry horizons, TLS/network partitions, HA cross-instance deduplication, external pager/recipient identity, a person actually acknowledging a page, Steward production metric correctness or independent learner understanding. Draft PR #408 remains UNMERGED, and issue #327 OPEN.


## Ambiguous HTTP 503 after committed receiver side effect — 10 November 2026

**Verified predecessor, not this head:** [GitHub Actions #42819017344](https://github.com/enoqueJonas/tsa/actions/runs/42819017344) completed 21/21 SUCCESS at `875784d1e60770c16119d25f7a67207bb0510977`, proving that official Alertmanager v0.28.1 retries the **same** previously 503-rejected notification, matching `groupKey`, fingerprint, complete labels, `startsAt`, firing status and destination after a single Alertmanager API submission. HTTP 400 nonretryable contrast and permanent 503 failure were tested. That predecessor **did not** prove that retrying a receiver that already COMMITTED work is safe.

### Focused new learning boundary and real changed-case program

- New 60-minute focused reading `reliability-alertmanager-implementation-ambiguous-side-effect-reading`, positioned after existing `same-notification-retry-reading` and before the forwarding/outage lessons. The original `reliability-alertmanager-implementation-001/-002/-003/-004` IDs, all existing focused readings and progress continuity remain intact. Original practical `-003` now requires the database commit and duplicate-effect mutation, not merely HTTP 503→200 transport.
- `scripts/check-reliability-alertmanager-runtime.py` is the **same source-published** pinned official Alertmanager v0.28.1 loopback driver as before, guarded byte-for-byte against the learner-visible `alertmanagerLocalRuntimePython` and copyable Python in `reliability-alertmanager-real-runtime.ts`. Only the new scoped modes allocate a disposable on-disk SQLite database `delivery_effects`, under the test's temporary directory.
- Positive `TSA_AM_RETRY_MODE=ambiguous-503`: first actual webhook makes a **committed SQLite insert** for the canonical notification identity (`groupKey`, alert fingerprint, complete labels, `startsAt`, firing status) **before returning HTTP 503**. A separate SQLite connection must already see one committed row after that rejected receiver HTTP response. Without another `/api/v2/alerts` submission, official Alertmanager retries the identical notification. The recovered endpoint returns HTTP 200; a new SQLite query still returns **exactly one** row, enforced by a `UNIQUE INDEX` and `INSERT OR IGNORE`. HTTP response success is verified separately from the persisted effect.
- Deliberate `TSA_AM_RETRY_MODE=ambiguous-no-idempotency`: execute the **same 503→200 transport retry**, but remove the uniqueness constraint and use ordinary `INSERT`. The independent SQLite query must detect **two committed effects** and fail with `DUPLICATE_NOTIFICATION_EFFECT_DETECTED`, even though the second HTTP webhook was accepted. The negative CI gate demands the real pre-503 committed row, actual identity-matched retry, and the specific duplicate-effect assertion, not a timeout or startup failure.
- Source guard requires real SQLite operation, learner reading and original practical wiring. Browser checks the focused SQL/code commands and original practical at 390px. New CI real-container steps run both positive and negative modes after the prior retry and 400/permanent-503 cases. Exact-head CI acceptance of **this** batch remains required.

### Remaining limitations

One durable SQLite unique key prevents duplicate committed rows for a given **local canonical webhook identity**. It does **not** guarantee exactly-once execution of external email, ticketing, Slack, PagerDuty or payment APIs; downstream idempotency/outbox/acknowledgment and recovery from process/DB crash must be separately demonstrated. Grouping key and fingerprint changes across alert/route configuration can change the identity scope. Do not infer that an HTTP 200 means a human read a page or that synthetic `runbook-dispatch` is real operational action. Keep Reliability issue #327 OPEN, PR #408 DRAFT/UNMERGED, stacked on draft #404.


## Source-exact 1h/5m burn-rate alert policy — 10 November 2026

**Completed predecessor:** [CI #42823883072](https://github.com/enoqueJonas/tsa/actions/runs/42823883072) was exact-head **21/21 green** for the bounded real Alertmanager retry + committed SQLite side-effect ID. This new batch moves forward to the original Service Level Engineering curriculum instead of extending the same notifier microtopic. Its own exact-head CI must pass separately.

### Lesson placement and quantitative meaning

Added 75-minute `service-level-engineering-windowing-promtool-burn-rate-reading` immediately after original `service-level-engineering-windowing-001` and before the existing `-002` practical. All original `-001/-002/-003` ID patterns for every Service-Level topic are preserved. The original `service-level-engineering-windowing-002` practical now requires actual official Prometheus rule-engine tests, a derived 14.4x threshold, exact 1h/5m pair, and deliberate changed-source failures. This complements — rather than replaces — prior source-extracted SQLite lifecycle SLI cohort work.

Hypothetical **99.9% request success SLO** gives a 0.1% allowed bad-event fraction. The Google SRE Workbook 30-day (720h) **2% budget in 1h** heuristic leads to `0.02 × 720 / 1 = 14.4x`; corresponding request error ratio is `14.4 × 0.001 = 0.0144 = 1.44%`. One-hour ratio must exceed threshold AND the current five-minute ratio must exceed threshold. An explicit **>0.1 requests/s in 5m** gate and **for:2m** delay are classroom low-volume safeguards, not a universal response policy. Severity remains **ticket**, never a production page.

**Critical caveat:** a time-based 2%-of-month budget projection assumes reasonably stationary request volume for an event-based request SLO. During variable traffic the actual monthly request-count budget must use measured event totals, not extrapolate a clock fraction. This synthetic request-5xx population does not establish Steward asynchronous committed-to-consumer-completion success, real workload impact, or valid on-call urgency.

### Genuine Prometheus engine and counterexamples

Committed exact source:
- `labs/reliability-slo-burn/steward-burn.rules.yml` (1h/5m bounded aggregate classic-counter recording rules + alert).
- `labs/reliability-slo-burn/steward-burn.test.yml` (seven official promtool unit-test scenarios over initialized 1m counters).
- `packages/runtime-kernel/src/paths/reliability-slo-burn-engine-depth.ts` (copyable exact source YAML and first-principles derivation).
- `scripts/check-reliability-slo-burn-engine.mjs` (display byte identity, original progress ID checks and generation of wrong-source mutants).

Official pinned `prom/prometheus:v3.13.3` **promtool check rules** and **promtool test rules** are required in the original `prometheus-rule-engine` CI job. Positive: steady 2% errors produces 0.02 in both ratios and a synthetic ticket alert. Negative: 0.5% healthy traffic, recovered current five-minute window with a stale bad 1h average, new brief short spike with clean 1h average, low-volume 100% errors below the traffic floor, initialized no-traffic counters, and entirely missing telemetry. No missing vector is converted into a fake zero/green result.

Three real wrong-source cases must fail with *unchanged* official unit-test expectations: swapping AND for OR (false alarms after recovery or short spikes), mistakenly treating 2xx successes as bad events in the numerator, and deleting the low-volume condition. The real Prometheus rule engine, not a separate Python reimplementation, decides their correctness. Browser traversal must render the new 75-minute reading with three copyable blocks, unchanged paired practical and 390px viewport without overflow.

### Pending acceptance boundaries

This batch **has no matching-head green claim until CI finishes**. Even when green, proof is synthetic official rule evaluation and rendered instruction, not live Steward telemetry, Prometheus scheduler/TSDB retention, Grafana panel NoData policy, approved notification route, human on-call ACK, or independent novice transfer. Keep issue #327 OPEN, draft PR #408 DRAFT/UNMERGED, stacked on upstream draft #404.
