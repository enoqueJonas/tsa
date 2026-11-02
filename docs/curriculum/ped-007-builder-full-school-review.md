# PED-007 — Builder entire-school instructional-depth review

Date: 2026-11-01
Scope: **Builder** only, across all seven learner-order modules
Issue: [#331](https://github.com/enoqueJonas/tsa/issues/331), parent [#318](https://github.com/enoqueJonas/tsa/issues/318)

## Acceptance model — do not collapse these states

1. **Structurally complete**: chapters/activities resolve and load; IDs, paths, build and basic rendering checks pass.
2. **Source remediated**: authored lessons teach motivation, first principles, independent examples, observed failures, alternatives/trade-offs and meaningful practice. Concepts introduced before use; split overloaded lessons.
3. **Technically verified**: the **exact learner-visible examples** and representative negative paths run with expected results in declared environments. A pure Python mock does not prove HTTP, Django, concurrent PostgreSQL or production security.
4. **Learner validated**: a novice actually completes a task without following a canned answer, explains why it works and transfers it to a new realistic case. This is **not established** by source review, CI, or scripted browser traversal.

## Canonical contract — product documentation wins over teaching fixture

[Steward product spec](../product/steward.md) defines lifecycle as `development | uat | production | retired`, and requires a Service at `production` lifecycle to have a **production Environment**. Environment.kind describes an actual deployment, not lifecycle itself. A separate `active` operational Boolean may appear in a SQL fixture, but is *not* a lifecycle stage. The persistence relation is `Service.owning_team_id → Team.id`; Django's `owning_team` ForeignKey provides that column, while a public API representation may name ownership differently if a mapping is explicit.

**Lesson/fixture correction:** The five-Service SQL seed has one **deliberately invalid record** — Payroll API is production-stage but has no production Environment. This is diagnostic teaching data for LEFT JOIN, NOT EXISTS and release-readiness exercises, not a valid released system. The new cross-table invariant lab observes Payroll, adds a production Environment inside a transaction, observes zero violations and rolls back to restore the negative fixture. Django follows with an authorized, atomic, Service-row-locked promotion/deletion command and DB-backed positive/negative checks.

## Module-by-module evidence

| Learner order | Module | Depth remediation in authored source | Executed/automated evidence | Remaining learner gate |
| --- | --- | --- | --- | --- |
| 1 | Programming with Python | Prior first-principles work rebuilt OOP and functional mechanics; fixed lifecycle domain drift; avoided generic fallback content; added detailed decorators course reference | Existing lesson-source Python regression + school continuity tests, including accepted/rejected lifecycle | Independently review every reading and executable lab; novice should explain decorators, methods, state, exceptions without prerequisite jumps |
| 2 | Web & API Foundations | Client/server and HTTP lab rewritten; URL/query path split; richer requests, 200/404, retries, JSON/REST, API errors and contracts; corrected lifecycle example | Actual published Python local HTTP regression, SQL/API source guards; browser traverse | Novice independently trace request/response and compare client/server with alternative architecture, then debug unseen failure |
| 3 | Relational Data & PostgreSQL | Added persistence and first database connection; corrected model/seed; joins before aggregation, complete filtering/joins/aggregates/subqueries/recursive CTEs; split ACID/concurrency; rebuilt constraints, schema, normalization, indexing/plans/performance/operations; added cross-table readiness | Dedicated PostgreSQL 17 CI job runs source-extracted SQL, positive/negative writes, real two-session MVCC, schema and rollback checks; catches wrong database target | Learner sets up a real DB, explains plan and cardinality, transfers a previously unseen SQL query and demonstrates source-of-truth readiness rule |
| 4 | Django & API Engineering | Added clean venv/HTTP primer and separated migrations/ORM DB; corrected ownership/lifecycle; rebuilt project boundaries, migration evolution, API versioning, validation, errors, filtering, pagination, OpenAPI and configuration; introduced atomic production-readiness commands | Django/DRF installed in CI on separate new PostgreSQL DB, migrations applied, source-extracted route/serializer/model/commands exercised; API versioning, filtering, config and error examples checked | Learner independently creates and migrates project and implements end-to-end permission-scoped DRF Service API; validate all public HTTP contracts and failed state mutations |
| 5 | Identity / Authentication / Authorization | Kept identity/authentication/authorization distinctions; added six-case subject/action/object access-policy matrix and executable refresh-token family replay model, with explicit limitations | Exact published pure Python policy/replay code runs in curriculum smoke; production token provider, concurrency and HTTP enforcement are not inferred | Actually exercise JWT login/refresh/revoke, Team Membership scoped list/detail/update, nested routes and cross-team negative HTTP writes in a running Steward API |
| 6 | Software Craft | Extended refactoring, tests, config, logging, public error mapping with executable positive and negative examples | Exact source-extracted Python checks in curriculum smoke: stable behavior, rejection, secret absence | Novice explains a real refactor, detects a seeded defect, judges dependency/config/logging trade-offs on a different Service |
| 7 | Steward API v1 milestone | Existing gate sequence retained: domain and contract review, full integrated release, SQL/ORM evidence, authentication/authorization, API documentation, operational readiness and handoff | Automated static/browser curriculum checks cover availability of the milestone pages; these **do not** build the learner's application | Learner supplies actual integrated repository, executable tests, DB/migration evidence, production-readiness and cross-Team security proof and operational handoff |

## Research base and limits

Authoritative first-party technical references: [Python documentation](https://docs.python.org/3/), [PostgreSQL documentation](https://www.postgresql.org/docs/current/), [Django documentation](https://docs.djangoproject.com/en/5.2/), [DRF](https://www.django-rest-framework.org/), [OWASP API Security](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/), and the original [Steward product specification](../product/steward.md).

In-depth supporting sources where relevant: [CMU 15-445 Fall 2025 database lecture schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html), optional linked videos/notes on SQL, joins, query execution, B-trees, MVCC, and [Real Python decorators course](https://realpython.com/courses/python-decorators-101/). Additional Django/DRF in-depth videos attached to learner resources. Course schedules/chapters and references have been inspected for relevance; **full external video viewing is not represented as performed**. References support research; a lesson must remain complete even if the student never clicks external links.

For the detailed SQL defect→teaching→evidence map, see [PED-006](./ped-006-sql-query-depth-review.md). Lesson-specific implementation is in `packages/runtime-kernel/src/paths/builder-*.ts`, and source-extracted regression scripts are in `scripts/check-builder-*.mjs`.

## Findings not solvable by declaring CI green

- Rendering and usability must be inspected in the *actual* browser: whether the learner begins at page top, text/code is readable and scrollable on desktop/mobile, progress survives reload, and no exercise hides executable prerequisites.
- The existing curriculum smoke and browser traversal do not measure explanation, reasoning, retention or independent application. A novice transfer assessment is still required per module.
- The PostgreSQL negative fixture is valid for teaching missing deployments, but students must not infer the released Steward v1 domain accepts that state.
- A pure authorization function and refresh-token state model do not prove DRF end-to-end enforcement or provider-specific replay handling; the milestone must supply that proof.
- Safe production readiness requires all mutation routes to preserve the rule; even an application command using a Service row lock can be bypassed by direct ORM/SQL writes unless access paths are controlled.
- Build/test passes do not establish that current resources have been fully watched. Separate actual source verification from implied video use.

**Current decision:** Builder source remediation is substantial and broad, with multiple executed integration contracts. **Builder learner-validated: NO.** Do not merge this into a school-ready claim without independent evidence and a reviewed latest-head CI report.

## Rendered-activity acceptance follow-up — 2026-11-02

**Finding origin:** the previous 15/15 workflow included a browser traversal reporting **333 Builder activities across seven modules**, but its sorted shortest-reading report (explicitly informational, not failing) exposed real deficiencies. The following conceptual reading pages were just 418–1491 rendered characters:

- `software-craft-internal-package-design-001` — **418** characters; this content was injected through `internal-dependency-management.ts` by `academy-journey.ts`, so the earlier Software Craft source audit missed it.
- `relational-data-and-postgresql-orm-vs-sql-reading` — 1,128; `n-plus-one-reading` — 1,134; `django-orm-reading` — 1,265; `migrations-reading` — 1,392.
- `software-craft-performance-awareness-reading` — 1,491.

These readings were **not acceptable as self-contained conceptual instruction** despite structural/browser success. They were rewritten with prerequisite mechanics, worked examples and expected positive/negative outcomes. The Django/SQL lessons now use actual Django/PostgreSQL to demonstrate QuerySet laziness (zero query construction, one evaluation), bound SQL/ORM equivalence, five-to-one N+1 FK queries, two-query prefetch, populated-data expand/backfill/contract migration and a concurrent UNIQUE-name race with two real PostgreSQL sessions. The hidden internal-package lesson now explains Python modules versus import packages versus installable distributions, actual-consumer boundaries, version promises, PEP 440/SemVer nuance, an executable breaking consumer and valid deferral of speculative extraction. Performance Awareness now distinguishes p50/p95, DB execution versus HTTP latency, synthetic slow-tail observation and the decision to make no performance change when evidence is weak. All executable Python examples are covered by source-extracted tests.

**Learner-facing UI defect:** `learning-experience.tsx` updated activity content without resetting scroll position. A long reading could deliver the next lesson with the viewport halfway down the page. On activity/restore changes the UI now scrolls to the top. `check-school-learner-browser.py` explicitly scrolls to the bottom before Builder transitions, checks the new activity starts at scrollY <= 8, checks the first two activities on mobile for **each** of seven modules at 390px, and includes rendered-depth guards for the six previously short conceptual readings with a copyable example.

**Cross-content practical drift:** PostgreSQL practicals still described a removed `active` Service lifecycle stage, despite earlier SQL source fixes, and recommended re-adding existing constraints; Django practicals presented the wrong health route and could imply migrating the SQL fixture rather than using a separate migration-managed database. These were corrected and source-guarded.

**CI infrastructure failure identified and repaired:** GitHub's moving `ubuntu-latest` selected Ubuntu 26.04, unsupported by the installed Playwright 1.58 Chromium browser. All browser jobs failed during installation before exercising the application. Browser jobs are pinned to `ubuntu-24.04`, while SQL/validate jobs can use their own default supported environments.

**Evidence limits:** A rendered character count is a *regression signal*, not proof of intellectual quality. Copyable code that executes on a disposable lab is stronger but does not measure novice teach-back. Browser synthetic progress does not certify learner mastery or real deployment. The latest GitHub Actions run must be checked at the **exact branch head**; never inherit a prior green result after edits. **Learner-validated still NO**.

### Suggested real novice transfer tasks (unobserved)

1. Python: receive a new invalid Service state/ownership example and explain the exact failed condition, repair it and add a test without copying the model answer.
2. Web/API: trace a request that returns a 404 versus a connection refusal, then diagnose retry/duplicate-write behavior.
3. PostgreSQL: query a new service deployment dataset with a missing production Environment, explain cardinality and safely repair while preserving constraints; interpret an unexpectedly different query plan.
4. Django/DRF: build and migrate one new relation from a clean lab, implement permission-scoped read/write endpoints with negative cases and explain generated SQL and N+1 avoidance.
5. Identity/Auth: diagnose an authenticated cross-Team mutation attempt plus refresh-token reuse, proving both response and unchanged state.
6. Software Craft: refactor a known slow/unsafe Service query with observable contract tests, justify no-change where measurable benefit is absent, and explain a real package extraction boundary.
7. Steward API v1: hand off a running repo with a working production transition, cross-Team denial, partial mutation rollback, token/session policy and reproducible setup/diagnosis.

These tasks are specifications for independent learner assessment, **not evidence that a student has completed them**.
