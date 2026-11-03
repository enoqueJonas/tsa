# PED-005 — Quality Steward school-wide author-source audit

**School:** Quality Steward (issue [#328](https://github.com/enoqueJonas/tsa/issues/328))
**Parent:** [#318](https://github.com/enoqueJonas/tsa/issues/318)
**Status:** **IN PROGRESS — initial whole-school source survey, targeted repairs committed; CI and independent learner validation not yet established.**
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
