# PED-005 — Quality Steward school-wide author-source audit

**School:** Quality Steward (issue [#328](https://github.com/enoqueJonas/tsa/issues/328))
**Parent:** [#318](https://github.com/enoqueJonas/tsa/issues/318)
**Status:** **SOURCE REVISIONS MERGED AND MATCHING-HEAD CI GREEN; rendered browser checked; real integrations and uncoached learner validation remain OPEN.**
**Merged source branches:** `curriculum/quality-steward-source-depth-v1` (PR #344) and `curriculum/quality-steward-short-readings-depth-v2` (PR #345).

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

- [x] Source commits matched successful 19/19 GitHub Actions matrices: #41627876550 (PR #344, 416 activities) and #41632027647 (PR #345, 428 activities), including build, curriculum and source-derived examples.
- [x] Synthetic Chromium traversed 428 desktop and 428 mobile activities (390px), checked rendered content, no page overflow, progression and legacy generated-ID recovery. This is NOT independent human experience.
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

**Technical merge gate met:** [workflow #41632027647](https://github.com/enoqueJonas/tsa/actions/runs/41632027647) passed **19/19 jobs** at exact PR #345 head `de1a9b74a0029ce0288f785d53966ea71aac6ae6`. PR #345 merged into `master` at `35d2d3f9`. This proves the limited classroom/source/browser checks, NOT uncoached learning or real Steward/enterprise integration behavior.

## Final merged-source evidence and learner-validation boundary — 2026-11-03

The original 12 Quality Steward modules have been source-remediated through two merged PRs:

| Integration | Exact verification | Source-to-UI contract |
|---|---|---|
| [PR #344](https://github.com/enoqueJonas/tsa/pull/344) → `c76c8782` | [19/19 CI](https://github.com/enoqueJonas/tsa/actions/runs/41627876550), 416 desktop and mobile activities | No generated wrappers, Java prerequisite order, executed examples and original unit/API/browser evidence |
| [PR #345](https://github.com/enoqueJonas/tsa/pull/345) → `35d2d3f9` | [19/19 CI](https://github.com/enoqueJonas/tsa/actions/runs/41632027647), 428 desktop and mobile activities | Deepened actual shallow readings, 4 focused browser event lessons, exact local Chromium fixture positive/negative verification and overflow repair |

The local Chromium event test specifically observed a rejected bad upload, actual downloaded CSV contents, popup Page identity, iframe-scoped DOM, dialog dismissal/acceptance and safe cleanup. Its native file-control intrinsic width initially overflowed at 390px; element-level geometry identified the cause and the responsive CSS fix passed at exact head. No fake Steward UI was claimed.

**Still open, not implied by source length or automated green:** independent novice teach-back and unseen transfer scored against a rubric; manual qualitative review of rendered lesson clarity; authorized Steward/IdP/real PostgreSQL or Testcontainers-backed workflows; real Playwright Java against a genuine product interface (where one exists); actual GitLab Runner schedules/alert delivery; genuine k6 workload; and accessible human interaction verification. These are the conditions for [#328](https://github.com/enoqueJonas/tsa/issues/328), which remains OPEN. Source-level remediation and learner validation are separate evidence classes.

## Third short-reading corrective pass — Java and API foundations

The Quality learner browser evidence from the merged PR #345, full 428-activity desktop traversal, identifies new shortest original readings: `quality-java-functional-java-001` (1208 chars), `quality-java-annotations-reflection-001` (1226), `browser-environment-browser-state-001` (1232), `quality-java-equality-object-contracts-001` (1273), `quality-java-exceptions-resources-001` (1286), `browser-environment-local-remote-001` (1334), `api-integration-mocking-virtualization-001` (1349), `quality-java-generics-collections-001` (1351), `api-integration-rest-assured-model-001` (1361), `browser-environment-browserstack-001` (1426), `api-integration-schema-contract-001` (1434) and `quality-java-types-modeling-001` (1455). **Character count is a diagnostic, not a substitute for educational judgment.**

The next focused branch `curriculum/quality-steward-java-api-foundations-v3` retains every original reading ID and adds six standalone **Java 17** worked source programs into the original Java readings, addressing: shallow record immutability, value equality/hash buckets, typed collections/erasure, checked failure and resource cleanup, annotation retention/reflection/engine boundaries, and stream laziness/Optional absence. `scripts/check-quality-java-deep-lessons.mjs` compiles and executes all six sources from their exact published data, plus five deterministic wrong-implementation mutations. Copyable source blocks appear in the actual rendered lesson rather than a generic prep wrapper.

Three short API readings now have worked mechanism/negative/transfer sections: REST Assured protocol configuration versus independent business oracle, JSON structural validation versus consumer/domain compatibility, and service virtualization versus real provider compatibility. These explain that prior localhost authorization fixtures and simulated services do not establish actual Steward/IdP outcomes.

The browser-state/local-remote/provider readings are now deepened in original source too, and a real Chromium fixture demonstrates safe non-authenticated localStorage/sessionStorage/BrowserContext isolation. The code-only branch passed all 19/19 jobs at `da45fd5`, but a merge with newer master documentation requires the new merge-commit head to run the full matrix again. Real learner and external product evidence remains UNVERIFIED.

## Fourth original-reading editorial pass — risk, isolation and pairwise (2026-11-03)

A third accepted [PR #346](https://github.com/enoqueJonas/tsa/pull/346) was merged into `master` at `fd5191a07dd615d6b40a6624494d775747ec7a4e`, after a 19/19 matching-head CI and 428-activity full Quality desktop/mobile traversal. Its final rendered shortest-reading report singled out **12 further original readings** (1463–1577 characters). A short reading can be good; the problem is whether it actually defines, demonstrates, falsifies and transfers the topic.

[Draft PR #347](https://github.com/enoqueJonas/tsa/pull/347) revises **each of those exact original reading activities** without renaming the IDs or adding generic orientation wrappers:

| Original reading (shortlist) | Added mechanism, test and negative | Independent transfer |
|---|---|---|
| Cross-browser | Supported OS/engine matrix versus incidental rendering; keyboard defect compared against API evidence | Firefox ESR picker failure and matrix expansion |
| Unit isolation | Subject/collaborator REAL vs DOUBLE boundaries; live PostgreSQL uniqueness distinct from pure policy oracle | Transactional outbox and adverse publisher failure |
| Unit coverage | Statement/branch/mutation distinction; owner/active/locked false green | Uncovered high-risk authorization branch despite 96% coverage |
| Unit feedback | Cost versus evidence level; first-failure signal instead of raw suite speed | Mock-all-DB proposal challenged by real-schema gate |
| Risk-based Testing | Ordinal **priority index is not probability**; risk→oracle→level→decision mapping | Stale external index, latency and release uncertainty |
| Shift-left/right | Requirement clarification → JUnit/real API → safe runtime observation, not production mutation | 401 spike after signing-key rotation |
| API client boundaries | Typed product operation vs transport factory; negative status and after-state retained | 202 accepted batch with independent durable outcome |
| Database assertions | Response/status versus committed side effects; true transaction visibility and schema | Partial async batch write under bounded polling |
| Requirements analysis | Actor, state, expected denial and postcondition clarified; no invented contract | Inactive-session revocation ambiguity |
| Pairwise combinations | **Python 3 full covering-array proof:** 4 rows cover 12/12 pairs from 8 possible three-factor combinations; force a missing three-way critical case | Four dimensions with constrained valid combinations |
| JUnit extensions | Jupiter engine, BeforeEach/AfterEach, scoped store and parameter-resolver tradeoffs | Reject hidden global auto-setup and scope leaks |
| Java interfaces/composition | **Java 17 full program:** two independent injected TokenProviders; hardcoded-token mutation fails | When interface vs plain function earns abstraction |

CI source assertions in `scripts/check-quality-original-depth-v4.mjs` execute the **exact authored** Python/Java and verify deterministic negative mutations; the full learner browser traverses all 428 Quality activities at desktop and 390px, checks the new headings and copyable code. These only prove local teaching fixture mechanics, not a real Steward or JUnit extension environment.

**Current exit state:** source revisions in PR #347 are pending matching-head 19/19 CI. Uncoached novice transfer, manual editorial learner evaluation and authorized Steward/PostgreSQL/IdP/Playwright Java/GitLab/k6 remain **UNVERIFIED**. Keep issue #328 open after source merge.

## Fifth original-reading remediation: test discovery, oracles and state — 2026-11-03

The fourth corrective [PR #347](https://github.com/enoqueJonas/tsa/pull/347) merged to master at `c95a6df63030fc8dd9254d47539c1b3b2edfd853` following exact-head [19/19 CI #41635821612](https://github.com/enoqueJonas/tsa/actions/runs/41635821612) and 428 desktop/mobile learner activities. The next 12 shortest rendered readings still required content review. Length is only a triage signal: what matters is whether the learner can predict, execute, challenge and transfer the mechanism.

The fifth source pass is recorded under `curriculum/quality-steward-state-oracles-junit-v5`. It strengthens **original readings without replacing IDs or injecting generic wrappers**:

| Original scope | Source mechanism | Negative/control evidence |
|---|---|---|
| API test design | Contract actor/state matrix; status versus committed and asynchronous outcomes | A 403 may still mutate ownership |
| Test doubles and mocks/stubs/fakes | Fake/stub/spy responsibilities, isolation and independently observable postconditions | Spy call success with wrong persisted state; fake PostgreSQL constraints |
| State transitions | Full `proposed → active → deprecated → retired` classroom model with explicit transition relation | Exact source Python test rejects retired→active and verifies no state/event mutation; deliberate mutant must fail |
| Test oracles | Documented rule versus weak status-only assertion; independent before/after state | Exact source Python shows a simulated 403 with forbidden mutation and failing wrong-implementation control |
| Playwright runtime | Runtime/Browser/Context/Page ownership, storage lifecycle | Reuses the independently executed local Chromium context-isolation fixture; no fabricated Java browser execution |
| Environment parity and browser differences | Artifact/config/IdP/CSP/edge differences; supported engine/OS and input-mode evidence | False parity and engine-vs-API root-cause counterexamples |
| Test strategy and testability | Risk→level→oracle→gate mapping; controllability/observability/isolation | Skipped critical checks, unsafe test-only bypasses and missing async completion |
| Maven Surefire/Failsafe | **Real committed Maven `pom.xml`** with Surefire `test` and Failsafe `integration-test`+`verify` | Source-aware CI must observe 4 Surefire Jupiter tests and 1 Failsafe Jupiter test; no zero-test false green |
| JUnit Platform/Jupiter | Full original Java JUnit test with `@Test`, `@BeforeEach`, `@ParameterizedTest`, and a real `BeforeEachCallback` extension | A deliberate policy `OR` mutant must trigger a genuine JUnit assertion failure and non-zero Maven exit |

### New disposable teaching fixture

- `labs/quality-junit-lifecycle/pom.xml`, `PolicyTest.java` and `ProtocolIT.java` are **in-process classroom fixtures**; they do NOT contact Steward, IdP, a database, a browser or real external dependencies. The distinction between 'Failsafe selects *IT' and 'real integration occurred' is explicit.
- Both Maven/JUnit source examples are printed in their original learner-facing readings and checked **byte-for-byte** against the exact files that CI executes by `scripts/check-quality-junit-maven-lifecycle.mjs`.
- `scripts/check-quality-state-oracles-v5.mjs` executes the exact source-published Python state/authorization oracle programs plus forbidden side-effect mutants.
- The school-wide rendered browser guard checks each of the twelve targeted original headings and copyable sources; full desktop and 390px mobile traversals remain release gates.

**Current status:** full matching-head 19/19 CI required before merge. Even if it passes, this does not certify independent novice competence, real Steward permission/persistence behavior, real Java Playwright automation against a product UI, authorized IdP/PostgreSQL integration, production-like environment parity or actual k6/GitLab operational evidence. Keep [#328](https://github.com/enoqueJonas/tsa/issues/328) open for genuine external labs and uncoached learner scoring.

## Sixth focused learner-facing pass — reproducible defect evidence and responsive behavior

Earlier [PR #348](https://github.com/enoqueJonas/tsa/pull/348) merged at `cf457640c78d4c2f1f2370901731bb41d67b70c4`; final exact-head [19/19 CI](https://github.com/enoqueJonas/tsa/actions/runs/41649471145) passed genuine Maven JUnit/Failsafe teaching-fixture checks, independent state/oracle mutations and all **428 Quality activities desktop/mobile**. The new shortest-rendered list starts with Defect Evidence, Integration Boundaries and Responsive Testing. Rather than chasing word counts, the next pass targets their **lack of independently reproducible observation**.

### Controlled local defect and four-viewport exercise

- `apps/web/public/labs/quality-browser-events.html` now serves the same legitimate teaching fixture as before, with an **opt-in teaching defect**, `?teach-defect=owner-mismatch`. Default download is **exactly** `record_id,owner\n42,team7\n`; controlled incorrect download is `record_id,owner\n42,team9\n`. Both carry no customer information or credentials.
- `scripts/check-quality-browser-event-lab.py` runs in real Chromium at **320, 390, 768 and 1280 CSS pixels**, checks the actual heading, no unintended document-level overflow, focus on the named Read sample state button, keyboard Enter activation and the expected visible result. It then exercises the wrong-owner query switch and saves the exact observed CSV, screenshot and redacted JSON reproduction evidence under the CI artifact directory.
- The original `quality-engineering-defect-evidence-001` explains facts versus hypotheses, exact reproduction, expected versus observed CSV bytes, release identity and consequence versus priority. It uses the real local teaching defect; do **not** report a production incident or invent a Steward endpoint.
- The original `browser-environment-responsive-testing-001` now uses the **actual local fixture path** in its illustrative Java Playwright example, replacing the previously hypothetical `/services` browser page and `Add service` button. The executable Python Chromium lab proves the reported observable browser behavior. Java-specific browser execution remains **unverified**, honestly labelled.
- The original `api-integration-integration-boundaries-001` distinguishes a pure rule test, the already source-executed localhost HTTP negative and a **not-yet-accessible** real Steward+IdP+PostgreSQL/API boundary. It does not claim mock evidence proves production persistence.
- All existing activity IDs remain stable. The full school-wide learner browser script checks the updated original reading headings and preserves cross-school regression tests.

**Exit conditions:** exact-head 19/19 GitHub Actions workflow and all 428 original Quality desktop/mobile activities, local responsive and defect fixture proof. **Still open:** real Steward API/UI/IdP/PostgreSQL, actual Java Playwright against a product, genuine k6/GitLab schedules and independently scored uncoached novice transfer. An automated fixture and word count do not satisfy those.

## Seventh original-reading pass — Maven/JUnit selection, lifetime and dependency graph

[PR #349](https://github.com/enoqueJonas/tsa/pull/349) merged at `1f1ca6cab2e89cbe0d89d7322ac46f0f1463d383`. Its final [19/19 matching-head Actions](https://github.com/enoqueJonas/tsa/actions/runs/41651025598) verified all 428 Quality activities desktop/mobile and a real isolated Chromium defect/keyboard/viewport lab. It did **not** prove any live Steward incident or novice teaching competence.

The next substantive weakness was not an arbitrary character threshold: the original Maven and JUnit Tags/Lifecycle lessons did not independently show what Maven actually selected. [Draft PR #350](https://github.com/enoqueJonas/tsa/pull/350) specifically addresses four original readings while retaining all original activity IDs:

- **Maven lifecycle:** run the committed Java 17 fixture with `mvn -B -ntp -f labs/quality-junit-lifecycle/pom.xml clean test` versus `verify`; inspect Surefire and Failsafe XML per-class counts and confirm `*IT` is absent from Surefire. A successful build with no selected tests is not acceptable evidence.
- **Dependencies:** version-pin Maven's dependency plugin, run `dependency:tree`, distinguish the **direct test-scope** JUnit Jupiter aggregate from transitive Jupiter API/engine and JUnit Platform dependencies, and explain scope/classpath/repository resolution. This deliberately does **not** simulate internal Nexus.
- **JUnit tags:** publish an actual executable `TagFilteringExampleTest.java` with one `smoke` + `fixture` test and one separate `regression` test. Check exact selected XML count for `-Dgroups=smoke` and `regression`; an empty intersection `smoke & regression` must not authorize a release even if Maven reports success. A mutation that changes a tag must be caught by changed selection count.
- **JUnit test lifecycle:** publish a second actual `LifecycleOwnershipTest.java` proving two distinct instances, beforeEach/afterEach ownership and afterAll cleanup counts. A PER_CLASS mutation fails the independent expected instance count.

`scripts/check-quality-maven-selection-v7.mjs` validates **byte-for-byte displayed POM/Java against executed source**, executes baseline 4+2+2 Surefire plus 1 Failsafe test and three selected tag-expression subsets, checks the dependency graph and proves both mutants. The earlier source-published v5 POM was updated consistently with the exact executable POM.

**Merge gate:** all **19/19** exact-head CI jobs, actual Maven XML counters and 428 rendered desktop/mobile Quality activities. **Still not validated:** actual Steward/IdP/real DB, production-like GitLab schedule, genuine k6, Java Playwright against a real product UI, uncoached independent learner scoring. This is execution-mechanics proof, not a whole-school learning verdict.

## Eighth source-depth pass — partitions, unknown-commit retries and owner-scoped cleanup

The seventh source repair [PR #350](https://github.com/enoqueJonas/tsa/pull/350) merged at `94ebc47ce3643915f3919aa72a7bbfcde51ca0cd` after an exact-head [19/19 successful CI matrix](https://github.com/enoqueJonas/tsa/actions/runs/41653126452) and 428 full Quality desktop/mobile activities. It executed real Maven/JUnit tag selection, test-instance lifetime and dependency evidence.

[Draft PR #351](https://github.com/enoqueJonas/tsa/pull/351) strengthens three additional **original** readings. Each example is a standalone Python 3 program published in the actual lesson and checked against its exact source. None purports to be a real Steward or IdP product test.

- **Equivalence partitioning:** classify hypothetical criticality fields by behavior rather than string shape. Eight cases cover ordinary valid, missing, wrong type, unsupported and a conditional high-approval rule. The deliberate mutant `HIGH → LOW` in the approval predicate must fail. These values/rules are **classroom assumptions**, not approved Steward requirements.
- **Negative API/resilience:** a disposable SQLite DB with separate writer and observer connections demonstrates a committed business effect followed by a **simulated lost response**. A retry with the same idempotency key and payload must observe only the earlier effect; key reuse with a different payload must conflict; a denied actor must not mutate. A mutant that inserts a second effect on retry fails the independent committed-row-count oracle. This does **not** prove actual HTTP loss, distributed concurrency, expiry/TTL, real PostgreSQL or a live API.
- **Data setup/cleanup:** a separate in-memory SQLite program creates fixtures owned by run-A/run-B/run-C. It proves a failed test still cleans its own run-C data and cannot delete run-B's state. A broad unscoped DELETE mutant must fail.

`scripts/check-quality-partitions-retry-v8.mjs` executes the exact three source-published Python programs and tests the three mutants. The full original-lesson browser guard checks the three new headings and rendered code, while the 12-module Quality desktop and 390px mobile traversal remains unchanged. No prelude wrapper chapters were added and previously published lesson IDs remain stable.

**Status:** PR #351 is draft until **matching-head 19/19 CI**. **Learner validated? NO.** Actual authorized Steward/IdP/PostgreSQL, GitLab schedules, real Java Playwright/browser against a product, k6 workload and independently scored uncoached learner competence remain outstanding in [#328](https://github.com/enoqueJonas/tsa/issues/328). Source execution is not product truth.
