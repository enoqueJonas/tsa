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

## 2026-11-04 — Identity/Auth learner-order repair (source pass, human review open)

**Finding:** The previous first identity lesson mixed vocabulary with an unexplained instruction to implement a new Django User model. By that point the Builder learner has already migrated Django's default auth tables. Changing AUTH_USER_MODEL after initial migrations is a major migration operation, not a novice setup step. The subsequent password lesson then showed unexecutable pseudocode (`User(email=...)`, undefined `raw_password`, undefined `candidate`, undefined `AuthenticationFailed`) instead of a runnable verifier demonstration.

**Teaching remediation:**
- Keep the initial Identity in Software Systems lesson conceptual: identity versus account, profile, credential and session; stable identifiers; trusted claims; human versus machine subjects; memberships. It uses a generic community library example, not an obligatory Steward project.
- Split out **Create User Accounts and Team Memberships in Django** after the concept lesson. Use the already-migrated built-in Django User, reference `settings.AUTH_USER_MODEL` in a new Membership table, teach explicit team role and uniqueness, generate/review a dedicated migration, and seed two accounts with no usable passwords. Introduce machine-identity infrastructure neither here nor by accident.
- The Password Storage lesson now runs a complete `get_user_model()` / `set_password()` / `check_password()` / `authenticate()` experiment against the seeded learner, including a deliberately rejected wrong password and a disabled account with a correct password. The script restores account state, and no real password is printed.
- Remove the generic repeated Steward callout from every Identity reading and give practical/reflection activities topic-specific titles.
- The real PostgreSQL/Django integration test extends the existing migrated registry schema, applies an independently generated Membership migration, executes the exact source-published seed and credential code, and rejects a duplicate membership with a database constraint.
- The source guard checks the actual Identity → Membership → Authentication/Authorization → Password chapter order and rejects the former unexecutable User snippet.

**State:** This branch is an instructional/source correction. The matching-head workflow, browser rendering and any manual novice independent transfer must be recorded separately. **Learner validated: NO.** Identity remains open for later token and resource-permission end-to-end testing; the earlier pure-Python refresh-token and authorization matrix checks do not prove a real authenticated DRF API.

## 2026-11-04 — Software Craft Git basics and regression investigation (source pass)

**Finding:** Software Craft opened with abstract Git narration plus `git show <commit>` (a shell-unfriendly placeholder) and `git bisect start` without known good/bad revisions. Its practical override immediately required an existing, suitably dirty Steward repository and an unexplained regression, so the learner had no reproducible first Git exercise.

**Remediation:**
- Rebuild **Git as an Engineering Tool** around two complete local commits in `tsa-git-review-lab`: working tree → index → history, selective staging, a deliberately untracked note, safe restore of a scratch edit, HEAD/HEAD~1 inspection and real expected observations.
- Split **Investigate Bugs with Git History** into a second lesson with a reproducible four-commit `tsa-git-bisect-lab`. A known-good and known-bad commit are identified by persistent local tags; `git bisect run` executes a deterministic test and the learner checks the first faulty commit and resets bisect state.
- Update both published practical overrides so neither lesson requires an unexplained Steward change or remote repository to teach Git mechanics; apply the method to Steward only as a later transfer.
- Replace the common injected Steward callout and generic learning-outcome text in Software Craft with explicit outcomes per topic and human-oriented practical titles.
- Add a real source-extracted Bash regression suite which creates both scratch repositories, verifies only the intended file was committed, detects the defect with `git bisect`, and confirms branch restoration. It deliberately does not run arbitrary Git cleanup on the learner's actual repository.

**Evidence limits:** Full matching-head CI and rendered browser checks are separate gates. This source correction does not establish that a beginner can use the material independently. **Learner validated: NO.** Continue the remaining Software Craft lessons, their resolved practicals and actual learner transfer before marking the whole module complete.

## 2026-11-04 — Branch and merge-conflict learner-order repair

**Finding:** Software Craft's Branching and Collaboration lesson explained merge strategies but assumed a working Steward branch or remote PR and did not provide an independent executable branch or conflict experiment. The one existing code block only inspected an arbitrary repository, and conflict resolution remained purely conceptual.

**Teaching changes:**
- Rebuild **Branching and Collaboration** using a fresh `tsa-git-branch-lab` with one base commit, one feature commit, a three-dot diff against the merge base, a deliberately no-fast-forward merge with two parents, and safe local branch deletion. Pull requests and squash/rebase are compared without making an external provider or shared history a prerequisite.
- Split **Resolve a Merge Conflict** into its own lesson. A scratch `tsa-git-conflict-lab` creates truly conflicting same-line edits to greeting.txt, captures the expected merge refusal and markers, resolves the explicit Portuguese-default/French-fallback requirement, and commits a two-parent merge.
- Revise both published practical overrides to match the actual lab commands, expected evidence and domain-compatibility checks. No real Steward repository is modified by the introductory lessons.
- Add source-derived Bash tests verifying branch state, merge ancestry, intentional conflict, clean resolution, absence of markers, final values and restored clean worktree. Keep the earlier Git staging and bisect regression tests intact.

**Evidence limits:** Passing shell CI would prove reproducible Git operations, not that an uncoached learner independently knows when to select merge/squash/rebase or resolve a real product conflict. Human rendered review and transfer remain OPEN. Do not call the entire Builder school learner-validated.

## 2026-11-04 — Readable Code role-contract correction

**Finding:** The existing Readable Code lesson displayed a short Django `can_manage_service()` query using the literal role values `maintainer` and `owner`, although the preceding, actually executed Identity lesson defined only `Membership.Role.VIEWER` and `Membership.Role.MAINTAINER`. It also omitted the Membership import and user/Service fixtures. Thus a learner could copy a non-runnable code fragment or infer an invented permission, while the published practical required a real Steward refactor without first teaching an independent example.

**Remediation:**
- Rebuild the concept around a stated, precise policy: the active actor must have a maintainer membership in the Service's actual owning Team; neither a viewer nor a member of a different Team can manage it.
- Start with complete pure-Python data and two implementations. Explain meaningful names, cohesion, coupling, and focused extraction; execute three allow/deny cases and prove unchanged outputs.
- Only then use the real Django Membership model and `Membership.Role.MAINTAINER`, with explicit imports, seeded learner accounts and a disposable Service, four real decisions (authorized, viewer, cross-Team, disabled account), and a `finally` restoring mutated account/role state.
- Update the final published practical override to rehearse the same sequence rather than introduce unrelated project complexity first.
- Add the pure-Python script to source-derived Craft smoke checks and add the Django script to the existing dedicated PostgreSQL/Django integration test after the Identity source-published seed. Guard against reintroducing an undeclared owner role.

**Evidence:** branch source is changed, full matching-head CI and rendered browser checks must be verified after final commit. Source execution does not demonstrate novice independent understanding or real endpoint authorization. **Human reviewed / learner validated: NO.** Remaining Software Craft lessons and the Builder synthesis milestone remain open in issue #321.

## 2026-11-04 — Separation of Concerns beginner mechanism and negative transfer

**Finding:** The existing reading named HTTP, authorization, domain policy, persistence and SOLID concepts but did not define any runnable example before requiring students to refactor an unspecified Steward request path. A beginner could repeat architectural terms without understanding the reason to split functions, how to preserve behavior or how authorization order prevents unwanted mutation.

**Remediation:**
- Replace the generic passage with an independent community-library checkout example: precise concerns, reasons to change, original all-in-one function and focused parsing/permission/domain/response functions.
- Publish one complete pure-Python script with five cases and exact outputs (200, 400, 403, 404 and 409). Compare original and separated response objects and stored book state for each case so structural changes do not silently change behavior.
- Demonstrate a deliberately incorrect `bool(members)` authorization shortcut that would permit unregistered users whenever any member exists. The source-derived smoke test mutates `member_can_borrow`, executes the actual script and requires an AssertionError, instead of claiming a check is effective solely because the happy path passed.
- Explicitly state that the catalogue dictionary is neither a database transaction nor a running HTTP application. Explain what additional evidence an actual Django/PostgreSQL write requires. SOLID/DI architecture is not piled into the same lesson.
- Replace the published practical override with the same independently executable learning order; only then invite a narrow, verified Steward transfer.

**Status:** Matching-head full CI and browser checks not yet established for this branch. Independent novice understanding, manual rendered UX, and a real Steward request-path transfer remain OPEN. **Builder learner-validated: NO.**

## 2026-11-04 — Refactoring taught through a real before/after boundary

**Finding:** The Refactoring lesson described behavior-preserving restructuring but its only example declared an old and new one-line Team-ID equality check side by side. A learner was never given a real original program to change, a verifiable sequence of transformations, a boundary condition, or a test demonstrated to fail after an accidental change. The published practice jumped directly into an unspecified Steward hotspot.

**Teaching correction:**
- Give an independent refund policy with a concrete contract (paid order, not previously refunded, up to and including day 30). The original script is a complete standalone Python program and tests six positive, negative, boundary, denial-priority and mutation-side-effect cases.
- Introduce Extract Function as one named transformation to a separate refund_rejection_reason helper. Publish a second complete Python program whose externally observed request_refund arguments, results and refunded flags remain unchanged for all six cases.
- Explicitly mutate `> 30` into `>= 30` on the after example and require the day-30 assertion to fail; source-extracted curriculum smoke executes both original and new scripts and the faulty mutant.
- Explain why a 45-day policy or a changed denial priority would be a business change rather than refactoring; avoid introducing a hierarchy or speculative framework to teach one function extraction.
- Align the final published practical override with the exact independent scripts and move any real Steward refactor to a separate evidence-based transfer step.

**Evidence limits:** Exact-head CI and rendered browser traversal must pass separately. Successful Python execution is not evidence a novice can independently recognize a maintainability problem, stop refactoring appropriately, or transfer to an unfamiliar Steward function. Human review and learner transfer remain OPEN.

## 2026-11-04 — Code Review and Technical Debt split

**Finding:** A single ~3.3k-character lesson compressed reviewing correctness/security changes and managing maintenance costs into one reading. It had no complete patch or executable review target, yet the published practical immediately required an existing Steward PR and a technical-debt item. These are different skills, and no current code defect should be relabeled as deferrable debt.

**Teaching remediation:**
- Retitle the existing lesson **Review a Code Change** while retaining its original activity ID through a stable-ID override. Read one simplified invoice-export diff against two requirements: keep customer isolation and exclude archived records.
- Publish an intentionally unsafe, standalone Python candidate that drops ownership filtering. A negative test must raise AssertionError and identify foreign invoice INV-200. The source-extracted smoke test expects the actual failure.
- Publish a complete corrected program that applies both filters, with customers 11, 22 and no records. The positive and cross-customer negative cases execute in CI.
- Teach actionable blocker wording, requirement questions versus optional suggestions, evidence-based severity and re-review of the final diff; explicitly distinguish the simple Python list from authenticated HTTP authorization.
- Add an independent **Managing Technical Debt** lesson that contrasts the existing invoice leak (defect) with two currently functioning but duplicated CSV parsers (plausible debt). Include a concrete example record with evidence, unmeasured cost, options, owner, decision, test requirements and observable revisit trigger.
- Align both published practical overrides with the learner order; neither requires inventing an existing Steward pull request or issue. Later transfer may use actual repository evidence.

**Evidence gates:** Matching-head full workflow, source-extracted Python checks and browser traversal are separately verified after the final commit. No uncoached novice review or true authenticated API security assessment is implied. Builder learner-validated remains **NO**.

## 2026-11-04 — Python package basics before dependency ownership

**Finding:** The original Managing Dependencies lesson gave high-level advice about direct/transitive packages, security and internal reuse, but never taught a complete `python -m pip` and virtual-environment inspection sequence. Its practical immediately demanded a mature Steward dependency audit. The learner had no independent way to verify where pip installed packages or why an import succeeded in one environment and failed in another.

**Remediation:**
- Add an independently understandable **Inspect Python Packages** lesson before Managing Dependencies, explicitly defining interpreter, import module/package, installable distribution, pip and virtual environment.
- Provide a complete macOS/Linux `python3 -m venv` lab without network, Docker or server prerequisites. Use the isolated interpreter to inspect pip version, list, show, freeze, check and `sys.executable`/`importlib.metadata` and distinguish what each command proves.
- Provide a clearly optional Django install in the disposable environment when a trusted package source and network exist; inspect its direct versus transitive package metadata, without pretending it is present in an offline venv.
- Rebuild **Managing Dependencies** around real Django/DRF direct requirements versus Django's asgiref/sqlparse transitives, version ranges versus resolved versions, selection criteria, updates and tested rollback, and avoiding speculative internal packages.
- Align the two post-composition practical overrides with this order and actual commands. The source-extracted CI check executes the exact offline shell block in a temporary directory, validates the interpreter and metadata output, checks `pip check` and verifies that a deliberately nonexistent import is unavailable. No download is necessary.
- Verify external learning references against Python Packaging User Guide and pip guidance rather than pointing learners to a mismatched Pipenv tutorial.

**Evidence limits:** Full matching-head CI, rendered browser inspection and independent novice transfer remain separate from source correctness. Package security, supported versions and a real Steward dependency-upgrade decision are not established merely by running pip metadata commands. Builder learner-validated remains NO.
