# PED-005 — Quality Steward school-wide author-source audit

**School:** Quality Steward (issue [#328](https://github.com/enoqueJonas/tsa/issues/328))
**Parent:** [#318](https://github.com/enoqueJonas/tsa/issues/318)
**Status:** **SOURCE REWRITE COMPLETE FOR REVIEW — final matching-head CI/whole-school browser confirmation pending; learner validation and external integrations not established.**
**Branch:** `curriculum/quality-steward-source-depth-v1`

## What counts as evidence

Follow the **twelve actual paths** below in the published learner order. A generated model chapter or prep page is not evidence that a topic was taught. Each original reading must define new terms before using them, demonstrate the mechanism with a worked and explained example, address a plausible negative/failure, compare alternatives where relevant, then permit uncoached transfer. Preserve original activity IDs. A code check is not learner validation; unexecuted GitLab, browser, Java, API, k6 and enterprise demonstrations are **UNVERIFIED**.

## Source inventory and disposition

| # | Path ID / actual source | First-pass finding / action | Evidence gate |
|---|---|---|---|
| 1 | `quality-engineering` — `quality-engineering-deep.ts` | Source has authentic risk, test level/type, strategy and testability sections, but too many conceptual lists are not grounded in measured risk decisions. **TARGETED IMPROVEMENT** | Compare risk-driven unit/component/integration/system levels; show a real wrong-oracle failure and defensible release rationale. |
| 2 | `test-analysis-and-design` — `quality-test-analysis-design-deep.ts` | Original partition, boundary, decision-table, transition and oracle lessons retained. Added **actual source-published Python** inclusive 3–80 contract with six independent expected results and deliberately incorrect exclusive-bound negative. **PARTIALLY REMEDIATED** | Run `node scripts/check-quality-boundary-value-source.mjs` on exact committed source; develop independent requirement-to-cases transfer on a different domain, not the worked one. |
| 3 | `java-for-test-framework-engineering` — `quality-java-test-engineering-deep.ts` | **INCORRECT prerequisite order**: discovery, JUnit lifecycle, parameterization and extensions preceded classes/objects, object contracts and annotations. Reordered existing 18 lessons: JVM → Java object/type/composition and language mechanics → annotations → Maven mechanics → JUnit. Original IDs retained. **PARTIALLY REMEDIATED** | Compile/run published Java and JUnit examples; verify failure discovery and `mvn test` with pinned toolchain; inspect rendered progression. |
| 4 | `unit-and-component-testing` — `quality-unit-component-testing-deep.ts` | Authored test boundary, doubles, state vs interaction assertions and coverage concepts; several standalone Java fragments lack an executing end-to-end example. **TARGETED IMPROVEMENT** | Demonstrate assertion red/green on a defect and fake-vs-real database limitation. |
| 5 | `api-and-integration-testing` — `quality-api-integration-testing-deep.ts` | Deep original HTTP/REST Assured, Jackson, auth, contracts, persistence and async lessons. **TARGETED VERIFICATION** | Run authorized/unauthorized/duplicate API requests and assert state after failure; live Steward API/identity environment **UNVERIFIED**. |
| 6 | `automation-framework-engineering` — `quality-automation-framework-engineering-deep.ts` | Real architecture/logging/reports/retries/flake lessons; many risk lists still demand runnable proof. **TARGETED IMPROVEMENT** | Demonstrate ordered-state defect, retry preserves original failure, correct JUnit lifecycle and safe artifact retention. |
| 7 | `browser-and-environment-testing` — `quality-browser-surface-decision.ts`, `quality-browser-environment-testing-deep.ts` | Original decision was a practice before prerequisite explanation. Added substantive lesson contrasting DOM, frontend and API contracts, forbidden transfer scenario and misleading green click. **PARTIALLY REMEDIATED** | Decide on a genuine product browser surface; Playwright UI/keyboard/session tests **UNVERIFIED** until real surface exists. |
| 8 | `reusable-test-infrastructure` — `quality-reuse-internal-library-deep.ts` | Existing author source intentionally avoids premature extraction without a second product. **SUFFICIENT SOURCE SCOPE, VALIDATION OPEN** | Show two real consumers and stable API before extracting; do not invent a second test system. |
| 9 | `non-functional-quality` — `quality-performance-tool-decision.ts`, `quality-non-functional-deep.ts` | Original tool decision was a practical before workload concepts; added reading on latency/throughput/error population, open-vs-closed generation, 5 arrivals/sec and generator-limited false green. **PARTIALLY REMEDIATED** | Disposable bounded load/error threshold and generator diagnostic; k6/Locust and accessibility manual checks **UNVERIFIED**. |
| 10 | `quality-in-containers-and-ci` — `quality-containers-ci-deep.ts` | Authored Docker/Testcontainers/GitLab topics have real technical scope; environment commands require actual execution proof. **TARGETED VERIFICATION** | Isolated container/database, deterministic failing assertion that fails pipeline, retained reports; real GitLab pipeline **UNVERIFIED**. |
| 11 | `continuous-and-scheduled-quality-execution` — `quality-continuous-scheduled-execution-deep.ts` | Trigger/schedule/notification/recovery practical instructions are product-specific, not generic. **TARGETED VERIFICATION** | Real SCM and scheduled GitLab pipeline events with non-green failure and received alert **UNVERIFIED**. |
| 12 | `steward-quality-platform` — `quality-steward-milestone-deep.ts` | Existing comprehensive strategy-to-decision milestone; no evidence that a learner has independently produced the artifacts. **TARGETED VERIFICATION** | Review traceability, positive and negative automated proof, report identity, release decision and uncoached independent challenge. |

## Cross-school structural remediation

1. Removed `strengthenQualityPath` which prepended one template 30-minute “worked model” reading to **every** Quality path and inserted an artificial 20-minute “quality preparation” reading before **every** practical.
2. Original source-authored activities are retained. The Quality school still has twelve paths; the Quality branch now tests that original first instruction exists, generic wrappers do not return, activity IDs are unique and practicals have source-specific evidence criteria.
3. New actual prerequisite readings were inserted **inside their originating decision lessons** for Browser Surface and Performance Tool Choice, rather than pasting a universal overview into all modules.
4. Existing Java lesson IDs were *reordered*, not rewritten or discarded. Prior progress should remain attached by stable activity ID; old generated completion IDs may be retained as historical evidence but must not inflate current progress.
5. Added source-derived off-by-one failure detection for the original Boundary Value Analysis lesson. Its example is explicitly illustrative: no unsupported Steward length rule is asserted.

## Additional source-depth repairs now committed

- **Java first principles (source, not wrapper):** before the 18 existing topics, `From Java Source to a Running Program` and `Classes, Instances, Constructors, this and State` introduce a complete `javac`/`java` program, bytecode/JVM, two independent objects and a deliberate `static` field state-leak failure. Source-derived CI: `scripts/check-quality-java-first-principles.mjs`.
- **Unit Testing:** added a compilable 4-case illustrative owner/active/unlocked policy oracle inside the ORIGINAL `Designing Unit Tests` reading. Deliberate `&&`-to-`||` mistake must cause real nonzero assertion. Source-derived CI: `scripts/check-quality-unit-oracle.mjs`.
- **API/Integration:** added isolated Java 17 loopback `HttpServer`/`HttpClient` contract proof in the ORIGINAL HTTP semantics reading. A denied 403 POST must leave the owner unchanged, checked via a subsequent GET; mutating owner before the denial must fail. The precondition header is explicitly a test-only switch, **NOT authentication or Steward production evidence**. Source-derived CI: `scripts/check-quality-http-denial.mjs`.
- **Quality Engineering:** original Test Levels and Test Types reading now traces a forbidden transfer through unit, component, real database/transaction, API and genuine browser boundaries, naming what a lower-level green check cannot prove.
- **Rendered source checks:** `scripts/check-school-learner-browser.py` now checks original headings and copyable code in selected Quality readings and seeds obsolete generated IDs to test that old completion history cannot inflate current progress.
- **Audit disposition:** all original path sources were surveyed; further detailed per-lesson review remains, and original Test Analysis, Java, Unit, API, Browser, Performance and Quality Engineering source have received targeted revisions. No statement of whole-school completion is justified yet.

## Exit gates (not yet completed)

- [ ] Run **final matching-head** `pnpm test`, `pnpm build`, curriculum audit and source-derived Python check in GitHub Actions; record SHA and counts.
- [ ] Traverse **all Quality Steward rendered activities** desktop/mobile, verify exact first lesson, copyable code blocks, practical/reflection completion, reload and legacy-generated-ID re-entry. Scripted browser evidence ≠ independent human experience.
- [ ] Run real local Java/JUnit, isolated API/database, test-runner and negative acceptance cases where safe and feasible.
- [ ] Resolve remaining explanatory gaps in original authored source modules; do not mistake this initial source survey or wrapper deletion for completion.
- [ ] Review representative rendered pages manually and obtain scored independent uncoached learner teach-back and unfamiliar-domain transfer.
- [ ] Keep unexecuted browser/client, GitLab, production/enterprise and permission-dependent work clearly **UNVERIFIED**.
- [ ] Update #328 and the canonical tracker only with matching-head evidence; mark **REMEDIATED** only for a completed whole-school source pass, **VALIDATED** only with independent learner evidence.

## Learner-order and retry-evidence continuation (2026-11-03)

- Corrected API prerequisite inversion: original HTTP Semantics before raw HTTP milestone; REST Assured model before REST Assured installation/build. Existing IDs preserved.
- Corrected Browser prerequisite inversion: original Playwright runtime, DOM/accessibility locators, auto-waiting, navigation, browser state and surface selection before implementation milestones, without changing authored IDs.
- Java source/object state is taught before typing, annotations and JUnit discovery. These prerequisite relationships are enforced in the source contract.
- Original Automation Framework retries lesson now contains compilable Java: attempt 1 FAIL, attempt 2 PASS, final RECOVERED_UNSTABLE. A negative mutation removing history must cause nonzero assertion; exact learner program executes in a new CI step and critical rendered copyability check.
- Final matching-head 19-job CI, real Steward API/DB/GitLab/browser test system, and independent novice transfer remain UNVERIFIED.

## School-wide source checkpoint — final teaching pass (2026-11-03)

The twelve paths have now received a deliberate source review. Each identified *systemic* deficit was repaired **at the actual authored lesson** rather than by a generated path-level wrapper. The following dispositions identify what was changed and what cannot yet be claimed.

| Path | Source-level disposition and direct evidence | External/learner acceptance |
|---|---|---|
| 1. Quality Engineering | Original test-level/type reading now follows one forbidden-transfer risk through rule/unit, fake-backed component, real DB, API/read-after-denial and optional real browser boundaries. | Human test-level transfer remains unscored. |
| 2. Test Analysis | Original boundary lesson publishes executable Python on 3–80 inclusive length, six known outcomes and an exclusive-bound mutation. `check-quality-boundary-value-source.mjs` extracts and runs the **displayed** program. Other original techniques include condition, partition, decision-table, transition, pairwise, exploration and independent oracle reasoning. | Real Steward rules must still be confirmed; synthetic name length is explicitly illustrative. |
| 3. Java/JUnit | Java/JDK/source/bytecode and classes, constructors, `this`, independent state and static-state failure are separate new lessons before original type/object/JUnit instruction. Original 18 IDs retained and reordered; `check-quality-java-first-principles.mjs` compiles source programs and rejects filename/static-state mutants. | JUnit examples use available CI JDK; an independent novice still must demonstrate Java competence. |
| 4. Unit/Component | Original unit-reading includes a Java four-case authorization oracle and reproducible `&&`/ `||` mutation; `check-quality-unit-oracle.mjs` compiles it and asserts nonzero failure. Doubles, isolation and real-DB boundaries retained. | Does not establish actual Steward authorization without a real API/DB. |
| 5. API/Integration | Original HTTP reading now precedes raw-protocol milestone and REST Assured introduction. Runnable Java localhost server/client proves 403 and **read-after-denial unchanged state**; mutation that changes state despite 403 must fail. `check-quality-http-denial.mjs`. | Fixture header is not authentication. Actual Steward/IdP/PostgreSQL and async side effects remain UNVERIFIED. |
| 6. Framework Engineering | Original retries reading now runs bounded attempts that retain first failure and differentiate RECOVERED_UNSTABLE from clean pass; removing attempt history must produce nonzero assertion. `check-quality-retry-evidence.mjs`. Existing distinct logging, framework boundaries, Allure and quarantine lessons retained. | Product-dependent JUnit/Allure/GitLab plumbing remains UNVERIFIED. |
| 7. Browser & Environment | Genuine browser-surface decision now teaches DOM/frontend/API evidence boundary before its practice. Original Playwright runtime, contexts, locators, auto-waiting, navigation and state teach before Playwright implementation milestone. | No artificial Steward UI created. Real Playwright/browser product tests remain UNVERIFIED unless a genuine client exists. |
| 8. Reusable Test Infrastructure | Original boundary reading now explains a versioned Maven library, two-consumer requirement, why a Steward transfer client must remain domain-specific, compatibility/semver, false-generalization negative and an independent StockLedger transfer. | No fake second product or premature tsa-test-core package is claimed. |
| 9. Non-functional Quality | All **13 original conceptual topics** now receive distinct mechanisms, counterexamples and transfer in `quality-nonfunctional-source-depth.ts`. Original performance reading runs exact-source Python showing fast 503s falsify a latency-only gate and no-success latency is UNKNOWN; `check-quality-performance-population.mjs`. Workload model comes before tool choice. | Actual k6/Locust load, WCAG manual evaluation, real environment and approvals remain UNVERIFIED. |
| 10. Containers & CI | All **22 original conceptual topics** now receive topic-specific runtime, security, networking, failure and transfer cases in `quality-ci-source-depth.ts`. Original gate reading adds Java six-case decision and fail-open missing-test mutation; `check-quality-ci-gate.mjs`. | CI simulations are distinct from live GitLab Runner/Testcontainers/secret controls; real execution remains UNVERIFIED. |
| 11. Scheduled Quality | Split original broad path by introducing separate detailed GitLab workflow/job-source teaching and scheduled ownership/notification instruction before their practices. Version-grounded YAML distinguishes MR, default branch and schedule selection with retained JUnit artifacts; `check-quality-gitlab-selection.mjs` parses exact source and rejects a workflow schedule omission. | Real GitLab scheduled trigger and received notification remain UNVERIFIED. |
| 12. Milestone | Added a separate Q-43/Q-44 evidence-to-decision reading with three false greens (403 with mutation, skipped mandatory check, fast errors), followed by an **unseen asynchronous outcome** practical and five-item scoring rubric. | The rubric is authored but **no uncoached learner has been scored**. |

### Regression/acceptance evidence hierarchy

1. **Source integrity:** original IDs preserved; generated 30-minute and 20-minute wrappers explicitly forbidden; learner-order prerequisite edges enforced in `check-resolved-practical-contracts.mjs`.
2. **Source execution:** original Java/Python test and mutation programs, plus YAML static selection validation, run in the triggered full workflow; these establish their narrow **classroom/local** claims.
3. **Scripted learner browser:** `check-school-learner-browser.py` traverses Quality and selected original teaching headings/copyable examples, and verifies synthetic IndexedDB re-entry ignores retired wrapper IDs. This is not manual editorial/learning review.
4. **Human/external acceptance:** real independently executed Steward, PostgreSQL/Testcontainers, GitLab, Playwright, load/accessibility exercises and scored novice transfer remain **UNVERIFIED** until evidence is collected. No production-level claims arise from locally simulated examples.

**Technical signoff gate:** full matching-head 19-job workflow, including production build, cross-school and Quality browser, must succeed **after the last code and ledger commit**. At that point this school's **instructional source lane** may be recorded as REMEDIATED; #328/#315 remain open for learner and external environment validation.

## Follow-up quality review: 12 short original readings and overloaded browser lesson (2026-11-03)

**Baseline verified:** PR #344 merged as `c76c8782` with matching-head 19/19 GitHub Actions success (`41627876550`), 416 desktop activities, 416 mobile activities at 390px, copyable source examples, legacy activity re-entry and full production build. This certifies structural/execution coverage, **not independent teaching quality**.

**Unresolved pedagogical signal:** the 12 shortest actual original readings rendered at 1072–1203 visible characters. Source-level inspection confirmed several had two short sections and a practical prompt with limited conceptual progression. A real learner could not be assumed to independently explain the underlying mechanism from that evidence.

[Draft PR #345](https://github.com/enoqueJonas/tsa/pull/345) adds original-activity teaching depth for:

| Original learning area | Original IDs retained | New mechanism / counterexample / independent transfer |
|---|---|---|
| Test Analysis | exploratory-testing, negative-testing, traceability | charter–observation–revision cycle, state-after-denial oracles, versioned risk-to-execution graph and an unfamiliar payment/OTP example |
| API foundations | api-auth, filters-observability, specifications | explicit token/caller/audience lifecycle, failure-safe REST Assured filter/redaction, immutable specification vs scenario-specific auth/status |
| Browser foundations | navigation-network, ui-test-selection, advanced-browser-interactions, browser-diagnostics, browser-parallelism, page-components | readiness beyond load, evidence-level choice, event ownership, layered diagnostics, context vs database isolation and extracting Page Objects only from demonstrated repetition |
| Additional authorization-testing depth | auth-testing (already a separate original reading) | role/resource matrix, HTTP 401/403 vs optional privacy-driven 404, state after forbidden action |

**Necessary split:** retain original `browser-environment-advanced-browser-interactions` learning identity as Event Ownership, then teach `browser-environment-file-transfer-interactions`, `browser-environment-popup-browser-ownership`, `browser-environment-iframe-contexts`, and `browser-environment-blocking-dialogs` as four new sequential authored lessons (12 new activities). An implementation example for one event must no longer be mistaken for coverage of the other three.

**Automated regression hooks:** `check-quality-short-reading-depth.mjs` ensures all topic-specific case maps retain worked explanation, disconfirming failures and independent transfer; `check-resolved-practical-contracts.mjs` enforces the new order; full browser traversal checks exact original headings, meaningful rendered length, no horizontal overflow and unchanged prior activity IDs.

**Claims withheld:** executing Playwright Java against a real product surface, Steward IdP/Postgres/HTTP, actual protected GitLab events, k6 load and independently assessed novice capability remain **UNVERIFIED**. Long text and green CI cannot certify learning. Issue #328 remains open through learner evaluation.

## Focused browser interaction verification: local fixture (2026-11-03)

The post-short-reading pass now includes a committed, **non-product** event laboratory to avoid teaching event-oriented Playwright purely as vocabulary. Its static assets are under `apps/web/public/labs/`; after a normal `pnpm build`, serve `apps/web/out` on loopback and open `/labs/quality-browser-events.html`. The visible interface deliberately states it is a local-only fixture, not a Steward owner console.

The actual scoped proof `scripts/check-quality-browser-event-lab.py` runs **real Chromium** at 390px against the exported site and checks:
- a deterministic .txt file **accepted** and altered bytes **rejected**;
- a download event registered before click, saved with the expected filename, with **actual CSV bytes** checked;
- a popup event registered before click, a distinct Page with record identity, then explicit closure;
- an iframe-specific locator and labelled input, not an unscoped parent-document query;
- a blocking `confirm()` explicitly **dismissed then accepted**, with distinct observable state and reset.

The four new focused readings now provide the exact build/server commands, URL, expected output and negative evidence; their practical objective names the local fixture instead of falsely requiring a Steward browser surface. The test uses Python's Playwright bindings to verify browser-event **semantics**, while the course's Java-specific library APIs are documented separately. Neither proves a real Steward UI, authentication, remote GitLab, customer data or independently observed human competence.

A pre-final CI run uncovered one overstrict prerequisite assertion that required specialized dialogs before a diagnostic lesson already taught in the original early browser foundation. Fixed the contract to enforce **diagnostics before specialized browser event ownership**, while retaining files → popups → frames → dialogs order.

**Merge gate:** complete the full 19-job CI matrix including this real local Chromium fixture and strict 12-module 390px traversal at the exact current PR #345 head. Avoid promoting the new teaching from merely existing source files.
