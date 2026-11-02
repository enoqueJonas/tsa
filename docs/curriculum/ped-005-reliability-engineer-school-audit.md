# PED-005 — Reliability Engineer whole-school source audit

**Date:** 2026-11-02. **Issue:** [#327](https://github.com/enoqueJonas/tsa/issues/327), parent [#318](https://github.com/enoqueJonas/tsa/issues/318).  
**Branch:** `curriculum/reliability-engineer-source-depth-v1`, based on merged Cloud Engineer source remediation, `master` `0561c500`.  
**School:** Reliability Engineer, 16 learning paths. **Acceptance lanes:** structural wiring ≠ authored instructional depth ≠ independent learner validation.

## Learner-order real-source inventory

`packages/runtime-kernel/src/paths/reliability-engineer.ts` combines 16 paths. It currently prepends a **generic 30-minute reliability model** to every path and a **generic 20-minute preparation** before every practical, mostly duplicating the source practical's first instructions. These artificial readings are **TEMPLATED, not source depth**, and should be removed only after checking that original paths have genuine concept lessons. The real, sometimes practice-only source must be audited rather than counting generated headings as evidence.

| # | Path | Actual authored sources | First source judgment and risk | Remaining learner proof |
|---|---|---|---|---|
| 1 | Reliability and SRE Foundations | `reliability-sre-foundations-deep.ts` | Concept/quality/failure readings and practicals present; SOURCE REVIEW REQUIRED | Trace user-level loss versus healthy host |
| 2 | Service Level Engineering | `reliability-service-level-engineering-deep.ts` | SLIs, SLOs and error budgets present, but verify denominator and missing-data cases | Execute correct numerator, denominator and error-budget calculations |
| 3 | Observability | `reliability-observability-deep.ts`, `reliability-tracing-backend-decision.ts` | Eight source concepts plus backend decision; source contains worked signal questions. Avoid dashboard-before-question | Reproduce one failing user request using logs/metrics/traces |
| 4 | Production Logging | `reliability-production-logging-deep.ts`, `reliability-central-logging-decision.ts`, **`reliability-graylog-event-trace.ts`** | Eight concept readings + Graylog-versus-alternative decision, but first audit found no complete executable source-lab from GELF event through Graylog input and search. **THIN → IN REMEDIATION** | Real sanitized emitted→transported→indexed→searched event, negative transport/parse stage and recovery |
| 5 | Metrics, Prometheus and Grafana | `reliability-metrics-prometheus-grafana-deep.ts` | Source includes 13 distinct concepts but many overview sections; risk of graph familiarity without rate/label semantics | Actual counter/rate/histogram and missing-data alert failures |
| 6 | Distributed Tracing | `reliability-distributed-tracing-implementation-deep.ts` | One substantial reading plus three implementation activities. Validate real context/span propagation and runtime evidence | Trace root/child spans and missing downstream propagation |
| 7 | Observability Stack Integration | `reliability-observability-stack-integration-deep.ts` | **PRACTICAL-ONLY** (Graylog/Prometheus/Grafana implementation and cross-signal incident); generic wrapper disguises missing independent first-principles integration reading | Write a real source-authored teaching prerequisite before removing wrapper; run actual incident and cross-signal pivot |
| 8 | Alerting and On-call | `reliability-alerting-on-call-deep.ts` | Symptom-based alerts and runbooks. Source-level demonstration needs alert signal/response/closure evidence | Owned alert, delivered notification and actionable recovery |
| 9 | Alertmanager Implementation | `reliability-alertmanager-implementation-deep.ts` | Actual operational reading exists and covers routing/silencing; no duplicate alerting system | Real receiver, grouping, silence expiry and resolved event |
| 10 | Database Stewardship | `reliability-database-stewardship-deep.ts` | Deep PostgreSQL-oriented source and labs; inspect role, query, transaction and backup preconditions | Execute safe SQL query/lock/failure paths on disposable database |
| 11 | Performance and Capacity | `reliability-performance-capacity-deep.ts` | Latency, saturation, capacity and meaningful baselines; avoid fabricated SLO wins from one sample | Bounded load with p95/error-rate plus bottleneck evidence |
| 12 | Resilience and Distributed Failure | `reliability-resilience-distributed-failure-deep.ts` | Timeouts, retries, idempotency and failure boundaries. Source must prove duplicate-side-effect safety | Execute correct retry/backoff and negative idempotency case |
| 13 | Data Protection and Disaster Recovery | `reliability-data-protection-disaster-recovery-deep.ts` | Backup/PITR/DR objectives present; never replace restore with screenshot | Isolated point-in-time restore, elapsed RTO and data validation |
| 14 | Incident Management | `reliability-incident-management-deep.ts` | Detection/response/timeline/postmortem present; test human decision quality not labels | Tabletop stabilization, incident commander actions, verified fixes |
| 15 | Fault Injection | `reliability-fault-injection-deep.ts` | Bounded hypothesis/blast radius is taught; protect real Steward state | Approved disposable fault/abort and consumer-level verification |
| 16 | Reliability Engineer Milestone | `reliability-steward-reliability-program-deep.ts` | **PRACTICAL-ONLY**, four milestone gates; generic overview cannot substitute for a genuine evidence-based brief | Create source-authored milestone brief; run cross-signal failure, recovery and handoff |

**Decision:** stay in Reliability Engineer until this entire school has received source-level instructional review. Do not move to another school just because the 16 paths compile. Some existing source readings are deep enough to preserve, but neither length nor presence of readings proves a novice can execute the lab.

## First actual remediation — GELF event lifecycle before Graylog dashboard

The new `reliability-graylog-event-trace.ts` is placed **after** the centralized-logging choice and **before** the later stack integration path. It is a full teaching lesson with a real authored reading, practical and independent transfer reflection. Existing lesson IDs are untouched.

The exact source-published Python 3 standard-library code creates a sanitized GELF 1.1 event with a current timestamp, sends it only to a `127.0.0.1` socket using a short single UDP datagram, checks the recovered structured fields and rejects a deliberately missing required `short_message`. This is **a local socket and strict portable producer contract**, not live Graylog. Graylog's own parser may be more lenient in some versions. The lesson then traces source → shipper → GELF/other input → processing/stream → journal/search data node → index → time-bounded searchable query, and contrasts UDP delivery limitations with TCP/HTTP/TLS. The real follow-up practical requires a learner-owned Graylog instance and an actual query hit.

Source references: [Graylog GELF format](https://go2docs.graylog.org/current/getting_in_log_data/gelf_format.html), [input behavior](https://go2docs.graylog.org/current/getting_in_log_data/inputs.htm), [log lifecycle](https://go2docs.graylog.org/current/planning_your_deployment/the_log_lifecycle.htm). These references confirm producer fields, input/transport boundaries and index/search lifecycle; they do not establish any learner's actual Graylog deployment.

**Source test:** `scripts/check-reliability-graylog-event-trace.mjs` extracts and runs exact published learner Python, verifying the local success and malformed-negative result and blocking false assertions of Graylog indexing. Full curriculum CI is required for this branch.

## Remaining source and evidence gates

- [ ] Source-review and targeted remediation **all 16 paths**, especially the two practice-only paths, without generated orientation/preparation filler.
- [ ] Execute local examples wherever feasible and add source-derived regression tests; do not claim tests not run.
- [ ] Prove real Graylog input, search, retention, role and malformed/lost/late event behavior in an approved disposable environment.
- [ ] Trace one real incident across Graylog logs, Prometheus metrics and a tracing backend; an attractive dashboard is not sufficient.
- [ ] Inspect rendered learning pages and progress persistence/re-entry; verify independent novice teach-back/application.
- [ ] Run complete matching-head CI and only then merge source work. Keep issue #327 open for learner validation.

**Current status:** Source inventory recorded and first log-path remediation implemented. **NOT SOURCE-COMPLETE OR LEARNER-VALIDATED.**
