# TSA learner-experience acceptance ledger

**Purpose:** Make actual teaching quality and usable learning experience the acceptance criteria. This ledger supersedes old checkbox counts as evidence of pedagogical sign-off, without replacing the historical `lesson-boundary-audit.md` or source census.

**Working branch:** `curriculum/oop-depth-reconstruction`. **State at creation (2026-10-17):** every entry below is **Not accepted** pending a complete learner-facing module review. Historical source inspection, synthetic browser traversal, and green builds never automatically change status.

## Review contract

For each module inspect the **composed learner-facing module**, including lessons imported from `*-deep` or `*-rich` sources and quality-layer practical overrides. Assess: **Concepts** (prerequisites, accurate mechanisms, depth, examples/output), **Practicals** (setup, executable steps, failure paths, progressive independence, evidence), **Continuity** (Steward prerequisite/artifact and technology lifecycle), **Resources** (exact, current, useful references), **UX** (rendered readability, code widths, navigation, responsive behavior and progress). Record a concrete defect with source/lesson ID and fix; re-read the resulting learner page. A module is Accepted only when all five are reviewed and there are no blocking defects. Where real infrastructure is unavailable, write **External lab unverified**, never imply execution.

Status legend: **Not started** = full pedagogical review not performed; **In review** = active findings; **Blocked** = learner-facing defect or material verification gap; **Accepted** = five dimensions reviewed with linked evidence. Technical build/CI is a separate operational gate, not the score for learning quality.

## Cross-module journey gates

- Engineering Apprentice: inspect the school entry point and its actual lessons (the 134-entry structural census starts with Builder; Apprentice must NOT be omitted from the learner journey).
- At each school transition validate tools, accounts, VM/runtime state, artifact paths, ownership, approved dependencies and prerequisites introduced earlier.
- Validate persistence/re-entry, completion states, back/forward navigation, desktop readability and narrow/mobile layout in meaningful longer sessions.
- At acceptance, compare independent learner work against criteria; internal editorial approval alone cannot prove learning effectiveness.

## Module acceptance matrix

| School | Module | Concepts | Practicals | Continuity | Resources | UX | Overall / evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| engineering-apprentice | **Engineering Foundations: 9 conceptual lessons + 4 Workbench lessons** | In review | — | — | — | — | In review; first shell example corrected; full enumeration pending |
| builder | `builder-python-quality` | In review | In review | In review | — | — | Source-path triage: 20 lessons / 19 explicit practical overrides; rendered and execution review pending |
| builder | `builder-web-api-quality` | In review | In review | In review | — | — | Source triage completed; full learner verification pending |
| builder | `builder-django-quality` | In review | In review | In review | — | — | Source triage completed; full learner verification pending |
| builder | `builder-postgresql-quality` | In review | In review | In review | — | — | Source triage completed; full learner verification pending |
| builder | `builder-identity-auth-deep` | In review | In review | In review | — | — | Source triage completed; full learner verification pending |
| builder | `builder-software-craft-quality` | In review | In review | In review | — | — | Source triage completed; full learner verification pending |
| builder | `builder-milestone-deep` | In review | In review | In review | — | — | Source triage completed; full learner verification pending |
| system-thinker | `system-thinker-requirements-quality` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-boundaries-quality` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-modeling-quality` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-components-quality` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-data-flow-quality` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-soap-xml-deep` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-enterprise-file-integration-deep` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-distributed-state-messaging-deep` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-failure-quality` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-architecture-decisions-quality` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| system-thinker | `system-thinker-milestone-deep` | In review | In review | In review | — | — | Source-composition triage; real learner verification pending |
| platform-builder | `platform-builder-bare-metal-foundations-deep` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-budget-homelab-quality` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-computer-os-quality` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-configuration-management-deep` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-core-infrastructure-services-deep` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-enterprise-file-directory-services-deep` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-enterprise-storage-nas-deep` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-implementation-milestones` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-linux-administration-quality` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-milestone-deep` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-networking-quality` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-os-patching-lifecycle-deep` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-packet-tracer-network-engineering-deep` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-proxmox-homelab-deep` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-proxmox-milestone` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-virtualization-quality` | — | — | — | — | — | Not started |
| platform-builder | `platform-builder-windows-powershell-enterprise-deep` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-artifact-supply-chain-quality` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-automation-shell-deep` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-containers-docker-quality` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-continuous-delivery-quality` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-continuous-integration-quality` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-configuration-management-quality` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-engineer-milestone-deep` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-migration-exercises-deep` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-production-schema-evolution-deep` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-release-engineering-quality` | — | — | — | — | — | Not started |
| delivery-engineer | `delivery-software-foundations-quality` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-architecture-cost-quality` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-hosting-models-quality` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-building-blocks-quality` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-certificate-lifecycle-operations-deep` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-engineer-milestone-deep` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-orchestration-gitops-deep` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-progressive-delivery-canary-deep` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-object-storage-implementation-deep` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-infrastructure-as-code-quality` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-internet-networking-quality` | — | — | — | — | — | Not started |
| cloud-engineer | `cloud-vps-operations-quality` | — | — | — | — | — | Not started |
| quality-steward | `quality-api-integration-testing-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-automation-framework-engineering-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-browser-environment-testing-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-browser-surface-decision` | — | — | — | — | — | Not started |
| quality-steward | `quality-performance-tool-decision` | — | — | — | — | — | Not started |
| quality-steward | `quality-containers-ci-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-java-test-engineering-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-continuous-scheduled-execution-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-non-functional-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-engineering-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-steward-milestone-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-reuse-internal-library-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-test-analysis-design-deep` | — | — | — | — | — | Not started |
| quality-steward | `quality-unit-component-testing-deep` | — | — | — | — | — | Not started |
| security-steward | `security-application-deep` | — | — | — | — | — | Not started |
| security-steward | `security-artifact-signing-verification-deep` | — | — | — | — | — | Not started |
| security-steward | `security-container-delivery-deep` | — | — | — | — | — | Not started |
| security-steward | `security-enterprise-directory-federation-deep` | — | — | — | — | — | Not started |
| security-steward | `security-foundations-deep` | — | — | — | — | — | Not started |
| security-steward | `security-identity-secrets-deep` | — | — | — | — | — | Not started |
| security-steward | `security-internal-pki-machine-trust-deep` | — | — | — | — | — | Not started |
| security-steward | `security-internal-pki-milestone` | — | — | — | — | — | Not started |
| security-steward | `security-linux-network-deep` | — | — | — | — | — | Not started |
| security-steward | `security-secure-file-transfer-migration-deep` | — | — | — | — | — | Not started |
| security-steward | `security-steward-milestone-deep` | — | — | — | — | — | Not started |
| security-steward | `security-threat-modeling-deep` | — | — | — | — | — | Not started |
| security-steward | `security-vault-implementation-deep` | — | — | — | — | — | Not started |
| security-steward | `security-vulnerability-laboratory-deep` | — | — | — | — | — | Not started |
| security-steward | `security-web-api-threats-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-alerting-on-call-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-alertmanager-implementation-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-central-logging-decision` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-database-stewardship-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-data-protection-disaster-recovery-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-distributed-tracing-implementation-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-fault-injection-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-incident-management-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-metrics-prometheus-grafana-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-observability-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-observability-stack-integration-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-performance-capacity-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-production-logging-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-sre-foundations-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-resilience-distributed-failure-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-service-level-engineering-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-steward-reliability-program-deep` | — | — | — | — | — | Not started |
| reliability-engineer | `reliability-tracing-backend-decision` | — | — | — | — | — | Not started |
| architect | `architect-evaluation-governance-deep` | — | — | — | — | — | Not started |
| architect | `architect-architecture-fundamentals-deep` | — | — | — | — | — | Not started |
| architect | `architect-milestone-deep` | — | — | — | — | — | Not started |
| architect | `architect-architectural-styles-deep` | — | — | — | — | — | Not started |
| architect | `architect-data-architecture-deep` | — | — | — | — | — | Not started |
| architect | `architect-domain-modeling-deep` | — | — | — | — | — | Not started |
| architect | `architect-integration-and-messaging-deep` | — | — | — | — | — | Not started |
| architect | `architect-modularity-deep` | — | — | — | — | — | Not started |
| architect | `architect-resilience-architecture-deep` | — | — | — | — | — | Not started |
| architect | `architect-scalability-distributed-systems-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-architecture-governance-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-change-service-governance-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-controls-compliance-assurance-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-engineering-governance-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-handbook-standards-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-milestone-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-security-data-governance-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-technical-debt-health-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-technical-leadership-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-third-party-lifecycle-risk-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-technology-governance-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-technology-risk-deep` | — | — | — | — | — | Not started |
| technical-steward | `technical-steward-strategy-capability-deep` | — | — | — | — | — | Not started |
| professional-engineer | `professional-engineer-capstone-problem-discovery-deep` | — | — | — | — | — | Not started |
| professional-engineer | `professional-engineer-capstone-engineering-proposal-deep` | — | — | — | — | — | Not started |
| professional-engineer | `professional-engineer-independent-build-deep` | — | — | — | — | — | Not started |
| professional-engineer | `professional-engineer-production-readiness-deep` | — | — | — | — | — | Not started |
| professional-engineer | `professional-engineer-defence-deep` | — | — | — | — | — | Not started |
| professional-engineer | `professional-engineer-professional-practice-deep` | — | — | — | — | — | Not started |
| professional-engineer | `professional-engineer-portfolio-reflection-deep` | — | — | — | — | — | Not started |

## Findings and review journal

### 2026-10-17 — Initial acceptance baseline

- Imported **134** logical module entries from `source-census.md` spanning **11** schools; added Engineering Apprentice explicitly because it is absent from that structural file. Neither file count nor a historical checked box is proof of pedagogical acceptance.
- Historical remediation and synthetic-browser evidence remain in `lesson-boundary-audit.md`, `curriculum-wide-audit-status.md` and `curriculum-audit-acceptance.md`. Avoid copying their status claims into this ledger as acceptance.
- Technical Leadership: two worked examples improved in `a7f135a`; full module is still **Not started** for acceptance because its other readings, practicals and rendered experience remain unverified.

## Review-entry template

```md
### [date] [school] / [module] — In review
- Learner-facing activity IDs / inspected pages:
- Concepts: finding / evidence / fix commit / recheck
- Practicals: finding / evidence / fix commit / recheck
- Continuity: prerequisite and actual-stack evidence
- Resources: relevant deep links verified / deficiencies
- UX: viewports, reading and practice workflow, screenshots or observations
- External labs: executed evidence OR explicitly unverified
- Overall: Blocked / In review / Accepted (with rationale)
```

### 2026-10-17 — Engineering Apprentice / Shell and Filesystem: first learner-path finding

- **Inspected:** first reading, guided practice and knowledge check in `engineering-apprentice-workbench-deep.ts`; this is a **partial** reading review, not a full module acceptance.
- **Finding:** first demonstrative command was `ls -la ~/tsa`, though that directory had not been created or explained as a prerequisite. A novice executing the first example could receive a missing-path error despite following the lesson. Later path-example commands also assumed `~/projects/notes/todo.txt` exists without labeling the snippet illustrative.
- **Fix:** `00fe495` changes the first command to `ls -la ~` (existing home directory), explains variable output, and explicitly labels the later sample as requiring pre-existing files.
- **Pending:** enumerate the Apprentice school's composed lessons, review all reading/practical/reflection activities and render the affected page; no live learner or browser execution claimed for this edit.

### 2026-10-17 — Engineering Apprentice / Workbench module: complete source-activity triage

- **Scope reviewed:** all four authored lessons in `engineering-apprentice-workbench-deep.ts` — Terminal/Shell/Filesystem, Git/Version-Control, Developer Inspection (Processes/Ports/Text), HTTP from the Command Line. Each has reading, guided practice, reflection and independent lab (**16 learner activities**). Reviewed their source instructions and learning progression, not the complete Apprentice school or the rendered website.
- **Sequence:** shell/path/streams → Git state/history → local process/listener → HTTP request/response. Guided task → knowledge check → independent lab progression is present in each lesson. All four labs ask for reproducible, inspectable evidence.
- **Confirmed corrected instructional defects:** nonexistent `~/tsa` target in the first shell example (`00fe495`); first Git `git diff` incorrectly promised an untracked-file diff, plus unconfigured local commit identity, platform-inconsistent `pgrep -af`, and misleading POST success expectation from a static `http.server` (`d02da7b`); re-running a pre-existing practice Git directory could replace README, `git fetch origin` was shown without a configured remote, and the public HTTP GET had no offline alternative (`df47b0f`).
- **Unverified:** code examples have been inspected for source-level coherence but not all run in a controlled macOS/Linux setup; no full rendered reading/practical UX review; no actual learner independent lab submissions; no live remote Git or external endpoint evidence.
- **Disposition:** Workbench source-activity triage completed with targeted fixes, **NOT accepted** as a learner-tested module. The Apprentice school remains **In review** until the other composed school activities and website experience are covered.

### 2026-10-17 — Engineering Apprentice canonical composition and foundations first pass

- Verified canonical wiring in `engineering-foundations.ts`: `engineering-apprentice-rich.ts` has **nine** conceptual lessons (Thinking Like an Engineer, Systems Thinking, Trade-offs, Debugging Mindset, Engineering Decisions, Evidence and Technical Reasoning, Learning as an Engineering Skill, Communicating Technical Work, Engineering Investigation) followed by **four** Workbench lessons. `engineering-apprentice-lessons.ts` is explicitly legacy, not the canonical learner-facing source.
- **Source-level finding:** the nine conceptual `richLesson` reading activities carried the generic fallback body `Deep TSA lesson for ${title}` even though substantial structured blocks existed. This risks misleading fallback/alternate consumers and weakens content integrity. Commit `e48be3e` derives the body from actual explanatory paragraph blocks.
- **Beginner access finding:** generic practical scenario could push a novice toward a real project and imply an experiment without access to one; it now permits a bounded, explicitly hypothetical exercise and warns against presenting illustrative measurements as observed. The first problem-framing practical names the slow API example as a fallback.
- **Remaining:** detailed review of nine lessons' individual examples/checks and Engineering Investigation milestone, actual rendered pages, navigation/progress and learner lab verification. These nine are **not pedagogically accepted** by this first pass.

### 2026-10-17 — Engineering Apprentice: all 13 canonical lessons source-level audit pass

- **Scope:** read the canonical `engineering-foundations.ts` composition, all eight foundation `richLesson` reading/practical/check templates, Engineering Investigation's brief/build/defence, and previously reviewed four Workbench readings/guided practices/checks/labs. In total **13 conceptual/technical lessons**: eight foundational concept lessons, four Workbench lessons, one final investigation milestone. The eight foundation lessons have 3 activities each, the four Workbench lessons 4 each, and milestone 3: **43 authored learner activities**.
- **Critical prerequisite/sequence finding:** the milestone appeared *before* Workbench and demanded authentic investigation/evidence despite the concrete CLI/Git/process/HTTP tools being taught later. `7633771` moves the capstone to the end of the canonical displayed learning path.
- **Practical ambiguity:** a beginner without an external project lacked a reproducible first investigation. `22bd4e8` provides a bounded local HTTP server / client / filesystem investigation and Git-state alternative, requires genuine observed outputs instead of simulated evidence, clarifies safe failure recreation and provides explicit first-project fallback options in systems/trade-offs lessons.
- **Source teaching assessment:** the eight named foundation readings include worked cases/illustrations, engineering practices and knowledge checks; Workbench has progressive guided/independent activities. This is a **source-level educational triage** only, not proof of successful learner outcomes. Remaining subjective concerns (readability, example interpretation, independent learner performance) need the actual browser and learner pilot.
- **Next acceptance gates:** inspect displayed pages at desktop/mobile sizes, perform local experiments following the published instructions, confirm progression/resume behavior, and review independent submissions. **Engineering Apprentice is not accepted until these are observed.**

### 2026-10-17 — Builder / Programming with Python: whole-module source progression review

- **Canonical wiring:** `builder.ts` uses `builder-python-quality.ts`, composed from `builder-python-rich.ts` and the foundational values/types source. Reviewed the complete listed **20-lesson sequence**: environment, values/types, control flow, functions, collections, modules, errors, OOP, encapsulation, composition, inheritance, polymorphism, decorators, class features, OOP design, comprehensions, type hints, dependency management, debugging, final lab. The quality wrapper contains **19** named practical overrides; the final integrated lab lives in the rich source.
- **Teaching fallback defect corrected (`34ab112`):** the quality wrapper replaced substantive lesson `body` with only the first paragraph even when the reading included many paragraphs. It now retains all authored explanatory paragraph text as a newline-separated body, while preserving rich blocks. This protects alternate reading renderers and summaries from systematically truncated explanations.
- **Practical completion defect corrected (`cf2eb75`):** six OOP practicals used the identical generic test \"runs in steward-core / behavior evidence captured / explains tradeoffs\" despite teaching distinct mechanisms. Replaced with verifiable module-specific criteria for encapsulation, inheritance, polymorphism, decorators, class features and design choices. Composition already has appropriately targeted criteria.
- **Progression observation:** the practicals explicitly grow a `steward-core` workspace from dictionaries to validated functions, registry modules, objects, collaborating teams, static contracts, installable metadata and a debugging scenario. This is desirable progressive project continuity. Do not treat a key-count alone as proof of instruction quality.
- **Acceptance limit:** all module stages and quality-layer activity contracts were triaged at source level, but this was not complete manual study of every code/explanation block nor execution of the 20 lessons. Full syntax/output verification, learner rendered UX, source-to-browser consistency and actual independent lab completion remain open. **Status: In review, not Accepted.**

### 2026-10-17 — Builder: all seven learning paths — source-level acceptance pass

- **Path order verified in `builder.ts`:** Programming with Python → Web/API Foundations → Relational Data and PostgreSQL → Django and API Engineering (including Django-dependent data topics) → Identity, Authentication and Authorization → Software Craft → Steward API v1 milestone. The canonical boundaries intentionally teach SQL before Django ORM and move ORM-specific PostgreSQL lessons into the Django path.
- **Practical scope inspected:** Web/API has 8 explicit quality-layer practical contracts; PostgreSQL quality layer has 20 mappings (including Django-dependent exercises); Django quality layer 14; Software Craft quality layer 14. Python has 19 named overrides plus its integrated lab. Identity/Auth and milestone have directly authored reading/practical activities. All are wired from actual deep/rich sources, not independent placeholder modules.
- **Confirmed cross-path reading defects corrected:** Web/API lesson factory used only its *first paragraph* as reading body while authoring subsequent explanation in structured blocks (`b5b7be7`). Django rich lesson factory stored only introductory prose in `body` although detailed explanatory paragraphs followed in blocks (`8e7f982`). Software Craft lesson factory exhibited the same omission (`a43db9a`). Those factories now preserve full paragraph sequences in body, without changing their structured rendering blocks.
- **Existing strengths, not certification:** Builder's sequence retains domain/project continuity across Python registry, HTTP contract, PostgreSQL schema, Django implementation, authentication boundaries, software craftsmanship and final Steward API. Identity/Auth directly specifies security negative outcomes, and the final milestone requests reproducible technical evidence. Presence and wording alone do not prove execution or comprehension.
- **Outstanding blockers to acceptance:** follow every rendered teaching page and its practical in the browser; exercise all environment-dependent examples in a safe learner setup; inspect low-level code/example correctness and expected-output accuracy; verify resource links and usability; independently execute cross-team access denials and Builder capstone from a clean checkout. The present pass is an **entire Builder source/wiring/teaching-contract triage**, not 100% detailed prose/code verification. All seven Builder paths remain **In review**.

### 2026-10-17 — System Thinker: all eleven modules — source-level triage

- **Canonical order reviewed:** requirements, boundaries, modeling, components, data flow, enterprise file/batch, SOAP/XML, distributed state/messaging, failure modes, architecture decisions, final Steward system-design portfolio. The final milestone inherits a specific Builder v1 checkpoint and requires explicit integration and state ownership analysis.
- **Substantive cross-module finding:** all **ten teaching-source factories** for the non-milestone modules stored only a brief introduction/objective in the `reading.body` even while authoring substantial paragraph explanations as rich blocks. Corrected each source to retain the entire authored paragraph sequence in the fallback reader text: requirements `cd55082`; boundaries `0e685e6`; modeling `227a6a1`; data flow `d90c67c`; architecture decisions `e7dfe46`; components `237235a`; failure modes `42ee802`; file integration `0202d5a`; SOAP/XML `f544aab`; distributed state/messaging `2412286`.
- **Exercise wiring:** quality-layer contracts are present for requirements, boundaries, modeling, components, data flow, failures and architecture decisions. Enterprise file/batch, SOAP/XML and distributed-state have dedicated deep implementation material. These exercises have not been executed by this source-level pass.
- **Acceptance limits:** resource URL reachability, exact example output, infrastructure lab execution (Redis/RabbitMQ and file/SOAP scenarios), rendered website usability, and independent portfolio quality remain unverified. No module is marked accepted based on source inspection alone.
