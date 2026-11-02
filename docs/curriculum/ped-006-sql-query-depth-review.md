# PED-006 — Builder SQL querying, joins, aggregation and CTE depth review

Date: 2026-11-01
Parent: [#318](https://github.com/enoqueJonas/tsa/issues/318)
Specific work: [#330](https://github.com/enoqueJonas/tsa/issues/330)
Teaching source: `packages/runtime-kernel/src/paths/builder-postgresql-deep.ts`
Practical source: `packages/runtime-kernel/src/paths/builder-postgresql-quality.ts`
Live regression: `scripts/check-builder-postgresql-live-lab.mjs`
CI: `.github/workflows/curriculum-audit.yml`, `builder-postgresql-lab`

## Scope and why the original source failed

The learner is in Builder (not Engineering Apprentice). We are checking the subsequent Builder curriculum for the same defect reported in Web/API: *valid but superficial content that names concepts before teaching mechanics or provides unexecutable exercises*. All earlier lesson and activity IDs are retained.

On review, the original SQL sequence placed **Aggregation before JOINs** even though its first worked count used a LEFT JOIN. It described NULL logic, relational cardinality, ON-versus-WHERE, JOIN row multiplication, group grain and HAVING without enough independent expected outputs to distinguish understanding from copying SQL. The Filtering practical even mentioned a technical_owner column that the documented fixture never defined. Subqueries and Common Table Expressions had two conceptual paragraphs each and no runnable bad case.

## Learner sequence after remediation

| Order | Lesson | Original deficiency | Now taught and evidenced in source | Gate |
| --- | --- | --- | --- | --- |
| SQL filtering | Filtering and Ordering Queries | TRUE/FALSE/UNKNOWN, precedence and deterministic ordering named but not traced; phantom technical_owner | Executable wrong/right retired-record leak, NULL and NOT UNKNOWN, explicit sort output, transfer search | Source REMEDIATED; live DB test separate |
| SQL JOIN | INNER, LEFT and RIGHT JOINs | Originally later than Aggregation; OUTER JOIN and multiplication introduced in lists | Five actual queries: owner, optional environment, ON-vs-WHERE, RIGHT-vs-LEFT, directed dependency; 5/6/4 count trace | Source REMEDIATED; live DB test separate |
| SQL aggregation | Aggregation, GROUP BY and HAVING | Grouping counted JOIN rows before JOIN had been taught | Team counts, read-only synthetic missing Team with VALUES, WHERE/ON/HAVING, 3-vs-2 Payments overcount and DISTINCT with limitations | Source REMEDIATED; live DB test separate |
| Subqueries | Subqueries | IN, EXISTS and scalar subqueries compressed into two conceptual entries | Complete IN, correlated EXISTS, correlated scalar count; dangerous NOT IN with nullable values and safe NOT EXISTS; independent anti-join transfer | Source REMEDIATED; live DB test separate |
| CTEs | Common Table Expressions | No meaningful recursive trace or demonstrated cycle guard | Two-stage priority dependency report; Payroll → Payments → Identity recursive chain; a read-only A ↔ B cycle with visited-node guard; CTE vs view/materialized view distinction | Source REMEDIATED; live DB test separate |

The revised sequence is `Filtering → JOINs → Aggregation → Subqueries → CTEs → Transactions`. We deliberately removed WITH/CTE usage from the synthetic empty-Team aggregation case *before* the dedicated CTE lesson. `VALUES` is introduced and explained as a read-only row source. These are not five unrelated PostgreSQL demos: all business-data queries use the canonical five-Service fixture established by the preceding schema/seed lesson. The isolated NULL and graph-cycle examples create only constant VALUES rows.

## External research map (source → concept → teaching translation)

Primary material was inspected online as reference, not copied wholesale. CMU's official course schedule and lecture links were verified; **full video playback and watching were not performed or claimed**.

| Reference | Exact taught concept | Translation into TSA |
| --- | --- | --- |
| [PostgreSQL — Comparison Functions and Operators](https://www.postgresql.org/docs/current/functions-comparison.html) | NULL comparison, predicate truth values | Two observable WHERE result sets plus UNKNOWN/NOT UNKNOWN demonstration |
| [PostgreSQL — Table Expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html) | FROM/JOIN/WHERE/GROUP BY/HAVING pipeline, OUTER JOIN preservation, ON-vs-WHERE placement, alias roles | Joined Payroll/Payments trace, result-row cardinality, WHERE-filter counterexample |
| [PostgreSQL — Joins Between Tables](https://www.postgresql.org/docs/current/tutorial-join.html) | Pair matching and unmatched-row behavior | Team ownership and Environment join exercises with literal predicted output |
| [PostgreSQL — Aggregate Functions Tutorial](https://www.postgresql.org/docs/current/tutorial-agg.html) | COUNT, GROUP BY, HAVING and WHERE restrictions | Payments 3-versus-2 overcount, synthetic zero-group, explicit active-service group threshold |
| [PostgreSQL — VALUES Lists](https://www.postgresql.org/docs/current/queries-values.html) | Inline read-only constant relations | Zero-Service Team and isolated NULL/cycle counterexample without premature CTE usage |
| [PostgreSQL — Subquery Expressions](https://www.postgresql.org/docs/current/functions-subquery.html) | Correlated EXISTS, IN and NOT IN with NULL | Existence and anti-existence contracts; safe demonstration of a failed query's empty output |
| [PostgreSQL — WITH Queries](https://www.postgresql.org/docs/current/queries-with.html) | Staged query, recursive anchor/step, cycle protection, materialization | Two-stage dependency counts; multi-hop graph traversal; read-only cyclic graph with guard |
| [CMU 15-445/645 Fall 2025 schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) | Lecture #02 Modern SQL, #11 Sorting and Aggregations, #12 Join Algorithms | Optional deeper university lectures and notes. Logical SQL teaching precedes algorithmic optimization; no claim of watching full recordings |

**Resource philosophy:** PostgreSQL official docs establish exact semantics; the official CMU course provides an optional deep route to the physical algorithms and theory. All essential explanations, expected outputs and negative cases are authored directly in TSA. The learner must not need to watch a video just to complete the local lesson.

## Verification boundaries

The source-extracted live integration runner starts a real PostgreSQL 17 server in a disposable CI service (database: `tsa_steward_lab`) and runs the **exact code blocks published in the lesson source** via psql. It verifies the temporary-session failure after reconnect, persistent schema/seed counts, positive queries, expected NULL/aggregation behavior, directed recursive traversal, invalid foreign key, and uniqueness rejection. An earlier runner revision successfully executed its then-current 13 published SQL cases; any expanded 20-case results must be checked at the **final commit** rather than inherited from earlier runs. No CI credentials or test databases are reused for production.

Not demonstrated even by a green SQL job: a novice learner following the tutorial without guidance; access from a real macOS or other developer environment; mobile reading usability, readable code blocks, time estimates, or the learner's independent ability to explain and repair a new SQL query. These remain UNVERIFIED until actual learner review. The entire Builder school is not VALIDATED.

## Remaining audit

1. Transactions and ACID: execute the complete multi-write rollback and positive commit, test two sessions, and explain read consistency before introducing isolation levels.
2. Constraints, keys and schema design: ensure all migrations are consistent with the canonical fixture and do not rely on a non-existing slug.
3. Normalization, indexes, query plans and performance: improve worked examples, realistic datasets, failure analyses and SQL execution where possible.
4. Postgres operational practice, Django/ORM-dependent lessons and the subsequent Builder modules.
5. Learner-rendered review and independent transfer tasks; thereafter audit subsequent schools for the same quality defect rather than treating prior structural PASS classifications as pedagogical proof.

## ACID and isolation continuation — 2026-11-01

Transactions and ACID was too broad and lacked a complete failing/committed example. The source now has two separate lessons: **Transactions and ACID** and **Concurrent Transactions and Isolation Levels**. The first includes three exact scripts for a rolled-back Service, a two-row Service/Environment commit, and a CHECK-violation recovery using SAVEPOINT. The second includes a disposable probe and interleaved two-client psql protocols for Read Committed and Repeatable Read. Original transaction activity IDs remain stable; the isolation split adds three activities.

Research anchors: [PostgreSQL transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html), [PostgreSQL isolation behavior](https://www.postgresql.org/docs/current/transaction-iso.html), [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), and the optional [CMU 15-445 Fall 2025 lectures 17–20](https://15445.courses.cs.cmu.edu/fall2025/schedule.html). Primary documentation grounds implicit transactions, savepoints, statement versus transaction snapshots, no dirty reads, SQLSTATE 40001 retry, and the limits of declarative constraints. The course schedule was inspected; no full-video viewing is claimed.

The separate live PostgreSQL 17 runner now verifies rollback/commit/reconnect/savepoint error and coordinates two independent psql processes to observe 10→10→20 at Read Committed versus 10→10→20 with a stable middle snapshot at Repeatable Read. Results are not inherited from the earlier green CI. Even a successful integration test would not simulate crash-recovery durability, prove Serializable's anomaly detection, validate novice teach-back, or replace a rendered/mobile reading review. **Source remediated; acceptance still pending.**


## Product contract recovery and cross-table readiness (2026-11-01)

A wider Builder-school audit uncovered an upstream contradiction: `docs/product/steward.md` defines `Service.lifecycle` as development/uat/production/retired and the explicit rule that a production-stage Service requires a production Environment. Some previously rewritten Python/Web/API/Django/SQL lessons had incorrectly standardized lifecycle to active/retired, using the SQL teaching fixture rather than the higher-authority product contract. Restored the product vocabulary across modules and aligned PostgreSQL seed, ORM fields, HTTP examples and inter-module regression checks. The separate operational `active` flag is not an additional lifecycle stage. The data fixture intentionally includes Payroll API in the production stage with no production Environment, now explicitly documented as an *invalid business state* to investigate, not release-ready data.

Added **Production Readiness: A Cross-Table Business Invariant** immediately following correlated SQL subqueries, with `readiness_missing.sql` (NOT EXISTS detects Payroll), `readiness_repair.sql` (inside a transaction, missing count 0; ROLLBACK restores violation), and a transfer exercise to design production transition and last-deployment-delete API tests. Database constraints alone cannot enforce the reverse existence requirement; [PostgreSQL documentation](https://www.postgresql.org/docs/current/ddl-constraints.html) confirms CHECK constraints cannot reference other table rows, while FOREIGN KEY checks referencing-child → referenced-parent direction. The isolated PostgreSQL 17 runner now executes the exact lesson snippets before declaring this behavior tested. DRF [object-permission documentation](https://www.django-rest-framework.org/api-guide/permissions/) separately warns list actions are not automatically filtered by object permissions; the Builder security module has an explicit independent policy matrix and list/detail enforcement transfer.

Verification gates: full CI at the final head and source-extracted negative SQL test must pass before calling the lesson technically verified. A green suite is not a novice teach-back or comprehensive independent learning assessment. **Status: Remediated in authored source; learner acceptance pending.**
