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
| platform-builder | `platform-builder-bare-metal-foundations-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-budget-homelab-quality` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-computer-os-quality` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-configuration-management-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-core-infrastructure-services-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-enterprise-file-directory-services-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-enterprise-storage-nas-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-implementation-milestones` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-linux-administration-quality` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-milestone-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-networking-quality` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-os-patching-lifecycle-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-packet-tracer-network-engineering-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-proxmox-homelab-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-proxmox-milestone` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-virtualization-quality` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| platform-builder | `platform-builder-windows-powershell-enterprise-deep` | In review | In review | In review | — | — | School-wide composition triage; execution and UI unverified |
| delivery-engineer | `delivery-artifact-supply-chain-quality` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-automation-shell-deep` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-containers-docker-quality` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-continuous-delivery-quality` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-continuous-integration-quality` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-configuration-management-quality` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-engineer-milestone-deep` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-migration-exercises-deep` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-production-schema-evolution-deep` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-release-engineering-quality` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| delivery-engineer | `delivery-software-foundations-quality` | In review | In review | In review | — | — | Full-school source triage; real delivery rehearsal/UX pending |
| cloud-engineer | `cloud-architecture-cost-quality` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-hosting-models-quality` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-building-blocks-quality` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-certificate-lifecycle-operations-deep` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-engineer-milestone-deep` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-orchestration-gitops-deep` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-progressive-delivery-canary-deep` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-object-storage-implementation-deep` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-infrastructure-as-code-quality` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-internet-networking-quality` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| cloud-engineer | `cloud-vps-operations-quality` | In review | In review | In review | — | — | School-wide source triage, rendered labs unverified |
| quality-steward | `quality-api-integration-testing-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-automation-framework-engineering-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-browser-environment-testing-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-browser-surface-decision` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-performance-tool-decision` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-containers-ci-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-java-test-engineering-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-continuous-scheduled-execution-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-non-functional-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-engineering-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-steward-milestone-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-reuse-internal-library-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-test-analysis-design-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| quality-steward | `quality-unit-component-testing-deep` | In review | In review | In review | — | — | Source-level school triage; learner execution and UX outstanding |
| security-steward | `security-application-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-artifact-signing-verification-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-container-delivery-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-enterprise-directory-federation-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-foundations-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-identity-secrets-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-internal-pki-machine-trust-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-internal-pki-milestone` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-linux-network-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-secure-file-transfer-migration-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-steward-milestone-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-threat-modeling-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-vault-implementation-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-vulnerability-laboratory-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| security-steward | `security-web-api-threats-deep` | In review | In review | In review | — | — | School-wide source composition inspected; operational lab validation outstanding |
| reliability-engineer | `reliability-alerting-on-call-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-alertmanager-implementation-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-central-logging-decision` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-database-stewardship-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-data-protection-disaster-recovery-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-distributed-tracing-implementation-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-fault-injection-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-incident-management-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-metrics-prometheus-grafana-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-observability-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-observability-stack-integration-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-performance-capacity-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-production-logging-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-sre-foundations-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-resilience-distributed-failure-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-service-level-engineering-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-steward-reliability-program-deep` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| reliability-engineer | `reliability-tracing-backend-decision` | In review | In review | In review | — | — | Curriculum source and reading integrity triage; practical labs pending |
| architect | `architect-evaluation-governance-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| architect | `architect-architecture-fundamentals-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| architect | `architect-milestone-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| architect | `architect-architectural-styles-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| architect | `architect-data-architecture-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| architect | `architect-domain-modeling-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| architect | `architect-integration-and-messaging-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| architect | `architect-modularity-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| architect | `architect-resilience-architecture-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| architect | `architect-scalability-distributed-systems-deep` | In review | In review | In review | — | — | Source-level audit; real learner portfolio and UX pending |
| technical-steward | `technical-steward-architecture-governance-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-change-service-governance-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-controls-compliance-assurance-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-engineering-governance-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-handbook-standards-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-milestone-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-security-data-governance-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-technical-debt-health-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-technical-leadership-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-third-party-lifecycle-risk-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-technology-governance-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-technology-risk-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| technical-steward | `technical-steward-strategy-capability-deep` | In review | In review | In review | — | — | Whole-school source triage; learner-level acceptance pending |
| professional-engineer | `professional-engineer-capstone-problem-discovery-deep` | In review | In review | In review | — | — | Seven-path source audit; actual capstone evidence and UX pending |
| professional-engineer | `professional-engineer-capstone-engineering-proposal-deep` | In review | In review | In review | — | — | Seven-path source audit; actual capstone evidence and UX pending |
| professional-engineer | `professional-engineer-independent-build-deep` | In review | In review | In review | — | — | Seven-path source audit; actual capstone evidence and UX pending |
| professional-engineer | `professional-engineer-production-readiness-deep` | In review | In review | In review | — | — | Seven-path source audit; actual capstone evidence and UX pending |
| professional-engineer | `professional-engineer-defence-deep` | In review | In review | In review | — | — | Seven-path source audit; actual capstone evidence and UX pending |
| professional-engineer | `professional-engineer-professional-practice-deep` | In review | In review | In review | — | — | Seven-path source audit; actual capstone evidence and UX pending |
| professional-engineer | `professional-engineer-portfolio-reflection-deep` | In review | In review | In review | — | — | Seven-path source audit; actual capstone evidence and UX pending |

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

### 2026-10-17 — Platform Builder: entire-school composition review

- **Canonical curriculum:** `platform-builder.ts` composes 15 learner paths (Computer/OS, Linux, Networking, Packet Tracer, Virtualization, Bare Metal, Budget Homelab, Proxmox, Storage/NAS, DNS/DHCP/Time, Ansible, Patching, Windows/PowerShell, Enterprise Directory/File, Steward Homelab milestone). Some have multiple logical source files and intermediate implementation milestones.
- **Source wiring reviewed:** inspected all 17 source-module entry files represented by the Platform Builder census, plus the canonical path composition. Confirmed intermediate implementation milestones are placed before the final review activity in relevant paths.
- **Reading fallback:** Ansible configuration-management source now includes authored paragraph content in its fallback reading body (current source verified). Other legacy reading factory patterns warrant review, particularly enterprise file/directory services.
- **Not accepted:** realistic VM/hardware inventory, OS-specific commands, storage operations, networking labs, recovery drills, resource links, displayed UI and progress/re-entry have not been fully validated in real environments. Source-level coverage is not sufficient to claim school completion.

### 2026-10-17 — Delivery Engineer: eleven-module source composition review

- **Canonical order:** software delivery foundations, shell automation, Docker, CI, CD/deployment, configuration management, artifact/dependency supply chain (`internal-dependency-management.ts`), release engineering, schema evolution, CI platform migration and Delivery milestone. Verified actual imports and path order in `delivery-engineer.ts`.
- **Reading integrity fixes:** substantive paragraph sequences now preserved in reading-body fallback for software delivery (`2c863f0`), shell (`0a7a9db`), containers (`f8f8ae3`), CI (`e435432`), CD (`d26c121`) and release engineering (`007ef48`). Prior factory behavior gave only the introduction while deeper authored material lived in blocks.
- **Scope note:** 11 logical modules recorded. Quality-layer overrides and dedicated deep lessons supply exercises; this review does not establish that a learner can execute their specific environment, nor that CI recovery or migration works.
- **Acceptance gates still open:** real GitLab/Nexus or substitute stack prerequisites, compose and container persistence, schema expansion/backfill/rollback in real PostgreSQL, failed-run recovery, artifact promotion and identity, release rollback, migration and platform operation, browser usability, resource/dependency references. Never mark accepted from source traversal alone.

### 2026-10-17 — Cloud Engineer: complete eleven-path source-composition triage

- Confirmed canonical progression in `cloud-engineer.ts`: hosting models → VPS → Internet networking → TLS certificates → cloud building blocks → S3-like storage → infrastructure as code → Kubernetes/OpenShift/GitOps → progressive canary → cost/architecture → Steward Internet Environment milestone.
- Inspected all 11 teaching/deep sources represented by the school, along with actual canonical path imports and the quality-wrapper layering. Existing sequencing generally builds operational vocabulary before orchestration and canary releases.
- **Teaching fallback defects corrected:** seven factories provided only `spec.intro` as fallback reading body despite long authored explanatory blocks. Full paragraph prose is now available in Hosting (`7d75f09`), VPS (`8179926`), networking (`2c0d030`), cloud building blocks (`e5aaadd`), Kubernetes/GitOps (`85a16bd`), cost (`c4210ab`) and IaC (`908643d`).
- **Still unverified:** real VPS provisioning, DNS/TLS renewal, object storage access policies, IaC plan/apply/destroy, cluster resource constraints, canary rollback decision, security/cost trade-offs, link relevance, learner-facing UX and final internet milestone. No completion certification from source inspection.

### 2026-10-17 — Quality Steward: full school source-composition review

- **Canonical lesson path composition reviewed in `quality-steward.ts`:** Quality Engineering, Test Analysis/Design, Java for Test Framework Engineering, Unit/Component Testing, API/Integration Testing, Automation Framework Engineering, Browser/Environment Testing (with browser-surface decision), Reusable Test Infrastructure, Non-functional Quality (with tool selection), Quality in Containers/CI, Continuous/Scheduled Execution, final Quality platform milestone. 12 learning paths / 14 source-module entries.
- **Reading integrity corrections:** full authored explanatory paragraphs now available in fallback reading body for API/Integration (`098d056`), Automation Framework (`2c88ec7`), Browser (`00e0b56`), Containers/CI (`56ff9b2`), Java (`9404d65`), Quality Engineering (`7805ef6`), Unit/Component (`c196b21`), Test Analysis (`377bf96`) and Non-functional Quality (`7bfce99`). Structured blocks remain intact.
- **Outstanding learner-level acceptance:** verify executable Java/Python test examples, environment/container prerequisites and reproducible outputs, browser UI testing and data handling, meaningful CI quality gates, trade-offs of performance tooling, failure diagnostics and final portfolio, source links, visible experience at realistic breakpoints. Source-level study is NOT equivalent to learner verification; none of the school modules is marked Accepted.

### 2026-10-17 — Security Steward: full school source-composition audit

- Inspected canonical `security-steward.ts` composition: 14 teaching paths and 15 logical source entries, including an intermediate internal PKI milestone before its closing review.
- The learning journey covers foundational reasoning, system threat modeling, web/API risks, controlled vulnerability exercises, application security, host/network security, container and artifact controls, identity and secrets, certificate trust, directory federation, secure transfers, and the final Steward assessment.
- **Reading-body concern confirmed:** multiple factories contain extended explanatory rich blocks but only their initial paragraph in fallback `body` text. Candidate sources include foundations, threat modeling, web/API, application, container delivery, Linux/network, vulnerability lab, enterprise federation and secrets. Remediation not yet applied in this pass.
- **Acceptance outstanding:** laboratory isolation and ethical scope, safety of examples, actual reproducibility of certificate and identity exercises, command correctness, resource relevance, visual reading experience, and independent final security assessment. No execution evidence collected in this pass. Modules are in review, not accepted.

### 2026-10-17 — Reliability Engineer: completed reading-body restoration and school inventory

- Reviewed the canonical 16-path order in `reliability-engineer.ts`: SRE/SLIs → observability + logs + metrics + tracing → integrated stack → alerting/Alertmanager → DB stewardship, performance, resilience, recovery, incidents → fault injection → milestone. The logical source census holds 18 module entries because decision lessons are composed into paths.
- **Verified repository state after interrupted call:** 10 sources (SRE foundations, SLOs, observability, production logging, metrics, alerting, database, performance, resilience and recovery) already contain the full-paragraph reading-body fix. These edits were present on the branch despite the previous interruption; no new commits were needed for those files.
- **Completed remaining fixes:** incident management (`d8aacea`) and fault injection (`7881019`) now also expose all authored paragraph text, rather than only an introduction, in fallback reading bodies.
- **Acceptance remains open:** Prometheus/Grafana/Tempo/Alertmanager labs, telemetry signal fidelity, SLO mathematics, PostgreSQL recovery evidence, fault injection blast-radius controls, reproducible incident simulation, reference links, rendered learner UX and final reliability milestone have not been exercised/verified. No school modules marked Accepted from source edits alone.

### 2026-10-17 — Architect: all ten path sources inspected

- Verified canonical `architect.ts` progression: fundamentals, domain modeling, modularity, architecture styles, data architecture, integration and messaging, scalability, resilience, architecture evaluation/governance and final Steward Architecture Evolution. Domain boundaries precede selection of architecture styles.
- Inspected source shape of all ten modules. Data, integration, scalability, resilience and evaluation modules already construct a full reading body, while four lesson factories used only introductions despite extensive paragraph blocks. Corrected these in fundamentals (`a5b3289`), domain modeling (`d7cad80`), modularity (`66fd2cf`) and architecture styles (`012286f`).
- **Limits:** individual architecture alternatives, diagrams, decisions, measurable quality attributes and capstone evidence still need line-by-line and learner-level verification. Resource checking, browser page usability, independent execution and final portfolio review not performed. No path accepted from source inspection alone.

### 2026-10-17 — Technical Steward: 13-path school source review and strategy depth correction

- Confirmed all 13 paths in `technical-steward.ts`: leadership, engineering governance, technology governance, strategy/capability, risk, controls/compliance, architecture governance, security/data governance, change/service governance, third-party lifecycle, technical debt, handbook/standards and final milestone.
- Audited the entry and reading-body composition of all 13 authored source files: most already preserve the full lesson body and do not suffer the earlier intro-only problem. **Do not mechanically rewrite these again.**
- **Substantive teaching-depth issue:** the six Technology Strategy and Capability Planning readings consisted of short abstract paragraphs (~300–630 characters) asking learners to make strategy decisions without first modeling the reasoning. Commit `07df020` adds six distinct worked Steward examples (outcomes/horizons, exclusions, capability maps, prioritization, build/buy/learn/retire, and uncertainty-aware roadmaps), each with a diagnostic question and reasoning challenge. The fallback reading text includes the worked example.
- **Pending:** full individual examples and exercises review throughout leadership/governance schools; resource accuracy, real decision evidence, UX and learner artifacts. Source-level review is not acceptance.

### 2026-10-17 — Professional Engineer: complete seven-path source review

- Verified canonical path order: professional practice/ethics → problem discovery → proposal → independent build → production readiness → portfolio/reflection → engineering defence. This appropriately demands a genuinely new capstone domain rather than cloning Steward.
- Inspected all seven authored path sources. Most long-form capstone readings already retain complete `body` with additional requirements or review standard; professional practice includes six distinct worked ethical decisions; portfolio sources expose complete paragraph bodies. No blanket reading-body rewrite was required.
- Learner acceptance observation: capstone stages require explicit, traceable real evidence, deliberately rejected options, reproducible production/rollback claims and a credible *no-go* readiness outcome. Independent transfer, not a recycled Steward implementation, is the intended competence bar.
- Remains unverified: independent capstone feasibility for learner constraints; quality of worked examples inside every individual lesson; adequacy of instructor feedback/rubrics; accessibility and usability of long-form study and submissions; ability to execute the full end-to-end project and independently defend its evidence. Full acceptance requires actual learner artifacts and rendered journey verification. **All seven paths In review.**

### 2026-10-17 — Learner-facing verification pass 2: Engineering Apprentice / Shell workbench

- Began the **second pass** on actual learner-facing content, not just module wiring. Inspected the Terminal, Shell and Filesystem lesson, its guided practice, reflection and independent lab as composed in `engineering-apprentice-workbench-deep.ts`.
- Corrected the stdout/stderr example to explicitly establish its disposable working directory; clarified quoting-example workspace state. Replaced a beginner help example that could unexpectedly launch interactive pagers / assumed GNU `ls --help` on macOS with non-interactive Git command discovery and explicit macOS `man ls` instructions (`0534d30`).
- **Actual local execution evidence:** executed the lesson's disposable file creation/copy, pipe + sort/uniq, grep redirection, environment inheritance and exit-status cases in a shell. Observed expected two alpha / one beta counts, exported `TSA_ENV=learning`, successful file existence, and controlled missing-file failure. This is a bounded Unix-compatible local reproduction, **not** execution of every workbench exercise on both macOS and Linux.
- Pending: complete guided/independent lab as a novice; validate Git, process and HTTP workbenches, static-site rendered UI, reading fallback coverage and learner persistence. Shell lesson has initial reproducibility evidence, **not acceptance**.

### 2026-10-17 — Learner-facing verification pass 2: Git / process / HTTP workbench

- Reviewed all four canonical Apprentice workbench lessons including Git, developer process inspection, and HTTP requests; checked reading, guided exercises, knowledge prompts and independent laboratories.
- Executed a disposable local Git repository workflow: initial untracked README, staged diff, two commits, feature branch and non-conflicting merge. Verified statuses and inspected history. A fast-forward merge is valid for this arrangement; learners should not expect a synthetic merge commit unless branches diverge.
- Executed a locally bound Python static HTTP server to reproduce GET 200, missing resource 404, JSON POST 501 Unsupported Method, and an unused-port connection failure with curl `http_code=000` (not a real HTTP response status). No claims of a POST-capable server.
- Source fixes: bind the developer-inspection server to `127.0.0.1` to avoid inadvertently listening on public interfaces; explicitly qualify the unused-port assumption and curl's `000` pseudo-value; preserve the full authored paragraphs in `reading.body` for *all four* workbench lessons while retaining rich blocks (`d795449`, newline correction `fbf1b2d`).
- **Limits:** the above validates a subset of commands on a Linux container, not whole guided and independent learner submissions on macOS/Linux, nor actual rendered page flow/progress. No acceptance sign-off yet.

### 2026-10-17 — Apprentice practical rerun: Git fast-forward and local HTTP distinctions

- **Executed from clean disposable state in a Linux shell:** initialized a Git repository, configured repository-local identity, committed a README, created and committed a feature branch, checked out the original branch and merged it. The merge completed as **fast-forward** (no merge commit); this confirms why a novice must not be promised a merge node when histories did not diverge.
- **Executed local HTTP comparisons:** bound Python's static HTTP server to `127.0.0.1:8765`; `curl` returned GET existing 200, GET missing 404, static-server JSON POST 501, and an absent-port connection failure with curl's `000` reporting value (not an HTTP status). Verified commands with `--noproxy '*'` to avoid proxy configuration interfering with local observations; used `--max-time` for failure-boundary examples.
- **Curriculum changes** (`9a0fecdf`): clarify fast-forward versus merge-commit outcomes in the Git guided lab; use direct localhost curl for process and HTTP examples; explicitly address occupied ports and safe Ctrl+C stopping of a foreground server.
- This is a command-level partial reproduction, not evidence that the whole novice exercise, independent assessment, or rendered website was validated. **Engineering Apprentice remains In Review.**

### 2026-10-17 — Second verification pass, independent disposable reproduction

- Executed a fresh temporary Git repository: untracked file behavior, empty unstaged diff before tracking, staging, three commits, branch switch, fast-forward merge, `git restore` of an unstaged edit, and final clean working tree. These checkpoints passed.
- Executed a local loopback-only Python static server with `curl`: GET existing resource **200**, missing path **404**, POST JSON **501**, and connection to unused adjacent port `curl` **000** with nonzero client status. Verified listener with Linux `ss`.
- **Process inspection lesson improvement**: clarify port collision handling, loopback scope, multiple `pgrep` matches and ownership verification before termination (commit `1fca03a`).
- **Verification caveat**: the disposable shell driver exited with signal 15 during cleanup because of shell background process bookkeeping, even though the Git and HTTP assertions had produced successful observations. Treat this as a harness cleanup issue, not evidence that the full lesson lab passed. OS-specific `lsof`/macOS behavior and actual student-submission flow remain unverified.

### 2026-10-17 — Builder Python learner verification: fresh workspace and venv failure guidance

- Executed an isolated Python baseline in a disposable environment: `python3 -m venv .venv`, `.venv/bin/python -m pip --version`, importable `steward/services.py`, and `main.py` output `Steward workspace ready` all succeeded in the Linux test runtime (Python 3.13). This confirms only the **happy-path setup** on that runtime.
- Inspected Builder's *Setting Up a Python Engineering Environment* learner reading and quality-layer practical. Previously the lesson explained choosing interpreters but did not teach how to distinguish an incomplete virtual environment from pip bootstrap/ensurepip failure. Added staged diagnosis, verification of active interpreter and pip, notes for `--without-pip` diagnostic isolation, and an explicit stop condition before installing dependencies (commit `637a026`).
- This does not validate macOS Homebrew Python or diagnose any particular user machine; venv failure cases and other Builder Python lessons are still unexecuted. School acceptance remains open.

### 2026-10-17 — Builder Python: Control Flow business-rule edge case

- Reviewed the composed Control Flow reading and quality-layer practical against its previous Service dictionary checkpoint and next Functions checkpoint.
- **Defect:** the practical required an integer `age_days` but did not test the surprising `bool` subtype behavior: `isinstance(True, int)` is true, meaning naive validator implementations accept a boolean as one day old.
- Added a mechanism-first teaching paragraph and an explicit runnable comparison of `184`, `-1`, `'old'`, and `True` (commits `aeec01d`, `b421b17`). Updated the practical and observable acceptance criterion to reject `age_days=True` (`9ee70f4`).
- **Executed the exact edge-case logic locally** with Python: results `184: True`, `-1: False`, `'old': False`, `True: False`; assertions passed. This verifies this example, not the complete Python module. Other learner labs, full capstone, browser UX and build remain open.
