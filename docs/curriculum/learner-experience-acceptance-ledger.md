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

### 2026-10-17 — Builder Python: Functions → Collections → Modules → Exceptions vertical slice

- **Executed disposable Python reference implementation** (Linux Python 3): importable `steward/services.py` and `steward/registry.py`, explicit `create_service`, eligibility, active-state changes and summary, three-service registry, lookup, filtering, domain validation, typed missing-service failure, and silent import smoke test. The example produced `PASS: functions, lifecycle, registry, validation and missing lookup` plus `PASS: imports silent`. This was an independent reproduction of lesson requirements, **not a test of student-authored solutions**.
- **Learner continuity finding:** Control Flow already disallows boolean ages, but the later Exceptions quality practical only said "integer" and did not require regression of `True` (or whitespace-only input). The learner could accidentally reintroduce a bug during refactoring and still satisfy its stated criteria. Strengthened the Exceptions practical and acceptance criteria to preserve these invariants, include 0 as valid, and discourage circular exception imports (`08d7a9b`).
- **Pending:** actual lesson-based execution with learner-authored implementations in multiple OS environments, the remainder of Python (especially OOP), web/API, rendered progress/UX and full school acceptance.

### 2026-10-17 — Builder Python OOP prerequisite-order correction

- Inspected actual `programmingWithPythonRichLessons` export order and OOP lesson examples: classes/instances with `__init__`/`self` → encapsulation → composition → inheritance → polymorphism → decorators → properties/class methods/dataclasses → OOP design. This order is intentional; source dictionary order in quality overrides is not the learner order.
- **Confirmed defect:** the **Encapsulation and Invariants** practical prematurely demanded a read-only `@property` even though the authored explanation explicitly defers properties until AFTER the Decorators lesson. A novice could not satisfy this practical using only concepts taught so far. Replaced with an ordinary `get_lifecycle()` method, and clarified that `_lifecycle` is privacy-by-convention rather than enforcement (`bfdc1d8`). The later Class Features practical still introduces and tests real `@property` when the prerequisite exists.
- Independently executed a compact Python OOP reference scenario: `__init__`, distinct `self` instances, lifecycle state transitions, failure preserving state, and rejecting invalid age values including `True` all passed. This verifies a bounded reference implementation, **not** all lesson snippets or learner submissions.
- Pending OOP coverage: execute the inheritance, composition, polymorphism, decorator and property examples in the actual learner sequence, inspect all outputs, and validate UI/progress. No school/module accepted yet.

### 2026-10-17 — Builder OOP: composition through class features, prerequisite and negative-state tests

- Reviewed authored examples and quality-practice contracts for composition, inheritance, polymorphism, decorators and class features in the actual learner sequence.
- **Confirmed pedagogical gap:** the class-features lesson asked learners to implement a validated property setter (absolute-zero rule) but showed only a read-only property; the required `@name.setter` mechanism and unchanged-state failure path were never demonstrated. Added a self-contained worked setter example, execution trace and rule explanation (`22c8a50`). Updated quality practical and completion criteria to require the same negative-state assertion (`533957b`).
- Executed local Python checks for composition/delegation and swapping collaborators, inherited parent initialization, duck-typed notifier behavior, `functools.wraps` preserving metadata while forwarding keyword arguments, frozen dataclass equality/reassignment rejection and the setter's failure preserving state. All tested checks passed on the execution host; this is a bounded independent reproduction, not browser/learner execution or a full snippet census.
- Pending: exact per-code-block outputs for the rest of the OOP module; full class-feature and design-decision exercises, complete Steward regression suite, TypeScript build and rendered learner UX. **In review.**

### 2026-10-17 — Builder Python: dependency recreation and debugging boundary contracts

- Inspected the final four Python checkpoint contracts: Pythonic iteration, static type feedback, dependency management and boundary-level debugging. Identified a setup-safety issue in the environment recreation step: unconditional `Delete .venv` could remove diagnostic data or user content if the path was misidentified; the instruction now requires verifying the target and preserving needed diagnostics before recreation (`4f6aa79`).
- Identified an import-validation regression risk in the debugging assignment: coercing an external `age_days` input without specifying its allowed lexical format can accidentally accept booleans or decimal-like values and undermine earlier domain rules. The task now requires accepting a well-formed decimal integer string, converting it at the import boundary, and rejecting booleans and malformed text, specifically `unknown` and `184.5` (`4f6aa79`, `d493f4d`).
- **Scope of evidence:** static review and committed exercise-contract corrections in this pass. No claim that these modified debugging/import tests or clean-install workflows have been executed against a complete learner project. Type-checking, install reproducibility, OOP capstone, TypeScript build and rendered UI still require verification.

### 2026-10-17 — Builder Python final capstone: executable reference and packaging limitation

- Strengthened the actual Python final lab: preserve the full domain scope in fallback reading text; demand automated negative-state tests for lifecycle, criticality, self-dependency and duplicate dependencies; require unchanged state on rejected mutations; verify installed imports from outside repository cwd (`1fa49a0`).
- Created a disposable **reference implementation outside TSA repo**, with `steward/domain.py`, `pyproject.toml` and `unittest` coverage. Five tests passed: valid dependency, invalid lifecycle, invalid criticality, rejected self-dependency with unchanged state, and rejected duplicate with unchanged state.
- Observed meaningful environment distinction: invoking unittest from outside the uninstalled project failed with `ModuleNotFoundError`; running from project root passed. A project-local `.venv` was created and pip available, but editable installation **failed** with `BackendUnavailable: Cannot import setuptools.build_meta` because the environment lacked an accessible setuptools build backend and network provisioning was unavailable. **Therefore packaging/clean-environment acceptance is FAILED/BLOCKED, not verified.** An installed import from outside cwd was not achieved.
- Pending: provision `setuptools` build backend (or choose an available declared backend) and rerun build/install plus external-cwd imports; obtain clean type-check evidence; run full learner Python capstone, application UI and TypeScript build. No claim of complete capstone acceptance.

### 2026-10-17 — Builder Python packaging failure follow-up

- Revisited the previously documented failed editable install (`BackendUnavailable: Cannot import setuptools.build_meta`) and audited the learner-facing dependency management lesson. Added an explicit explanation of `pyproject.toml` `[build-system]`, the dependency on an available build backend, the distinction between offline provisioning and malformed package code, and the need to test installed imports outside source cwd. Example TOML is illustrative and requires `setuptools` availability (`6d24c11`, quote correction `998fefb`).
- Fixed incorrect escaped newlines in a virtual-environment troubleshooting code block; it now renders separate shell commands (`6d24c11`).
- **Acceptance remains blocked:** these commits improve guidance; they do not demonstrate a successful clean-environment editable installation or a full TypeScript build. Re-run install with a properly provisioned backend and record the exact logs before changing status.

### 2026-10-17 — Python capstone packaging: partial unblock with a provisioned backend

- Re-ran the **existing disposable reference implementation** in `/mnt/data/tsa-python-capstone-verification`; not a learner solution and not TSA's application package. Five domain unittest cases passed again.
- Attempted offline `pip install --no-index --no-build-isolation` inside a newly created `venv --system-site-packages`: **failed** with `BackendUnavailable`. Inspection showed that venv resolved an incomplete Debian system namespace named `setuptools` under `/usr/lib/python3/dist-packages`, whereas the externally provisioned `/opt/pyvenv` interpreter has a complete setuptools distribution. The mere presence of a `setuptools` import name is therefore not sufficient evidence that `setuptools.build_meta` exists.
- Using the **provisioned Python interpreter** and `python -m pip install --no-index --no-build-isolation --target /tmp/tsa-package-install-target <reference-project>` successfully built a wheel and installed the reference package. From `/tmp`, with `PYTHONPATH=/tmp/tsa-package-install-target`, importing `steward.domain` resolved to the **installed target copy**. This proves an offline install is feasible **when the build backend is already available**, not that a self-contained fresh venv can recreate the project or that standard editable install succeeds.
- Remaining acceptance: documented bootstrap for a truly isolated venv, editable install, dependency locking, installed entry point and mypy checks; school status stays **In review**. No full web application build or browser verification in this pass.

### 2026-10-17 — Broad outstanding acceptance audit: expanded CI coverage and honest blockers

- Inspected the existing CI workflow and cross-school browser traversal. Discovered that the matrix omitted the first three schools (Engineering Apprentice, Builder, Platform Builder), even though nine later schools were traversed. Extended school allowlist and browser matrix to include all twelve school slugs (`c370c4e`, `d578e1a`). This **schedules** browser tests in GitHub Actions on subsequent pushes; it is not proof these newly included tests already passed. The existing platform-specific browser job is independent of whole-school coverage.
- Revisited the disposable Python capstone's failed environment install. In an isolated venv with deliberately pre-provisioned local copies of setuptools, setuptools metadata and _distutils_hack, `pip install --no-index --no-build-isolation -e <reference-project>` **succeeded**, installed project metadata, and import from another directory resolved to the source tree through editable-install linkage (expected for editable installs). Five domain tests passed. This demonstrates **offline editable installation with an explicitly seeded backend**, not self-bootstrapping clean venv reproducibility or a wheel-installed import.
- The CI workflow already specifies `pnpm install --frozen-lockfile`, curriculum-integrity audits, Python/Java example checks, several Platform/Delivery drills, `pnpm build`, and synthetic browser traversals. These are valuable gates but do **not** constitute executed infrastructure exercises, human submissions or a full curriculum pedagogical sign-off.
- This runner cannot resolve `github.com` over network to clone and locally build the full TSA repository; GitHub connector file access and commits do work. A check for GitHub combined commit statuses returned an empty status array; therefore no build/CI pass is claimed here. **The global audit cannot honestly be marked completed.** Remaining gates: verify actual CI run for new matrix; run full TS build and check outputs; inspect real rendered activities/mobile progression; repeat significant labs against target OS/infrastructure; review learner artifacts; audit resource links and feedback quality; sign off each module only after all five ledger dimensions have evidence.

- Verified the three new browser matrix keys against actual `technical-stewardship-journey.ts` school IDs (`engineering-apprentice`, `builder`, `platform-builder`); this confirms identifiers, **not their CI execution**.

### 2026-10-17 — User-executed TypeScript verification: parser blocker corrected

- User ran local `pnpm typecheck`: 178 TypeScript parse errors in `technical-steward-technical-leadership-deep.ts`, starting at lines 40/46. Direct source inspection found **two double-newline sequences embedded as literal line breaks inside double-quoted TypeScript lesson strings** (Decision-making and Mentoring); a string cannot cross raw physical lines in this syntax. Replaced those two sequences with escaped `\\n\\n` in the source so both worked scenarios remain readable in the runtime while the file parses (`80b35ff`).
- User's separate outputs: curriculum integrity audit passed for 196 runtime path files; 12 Python sample checks passed; Java example passed; `turbo test` ran zero test tasks and therefore is **not** evidence of tests passing. Local `pnpm typecheck`/build must be rerun after the fix; no green result claimed.

### 2026-10-17 — User-confirmed green typecheck/build; expanded OOP executable verification

- User executed `pnpm typecheck` on commit `faef2c79`: `@tsa/runtime-kernel` TypeScript check **passed** (one executed task). User also executed `pnpm build`: runtime-kernel build and Next.js static web build **both passed** (two executed tasks; production compile and static routes `/`, `/_not-found`). This closes the previously reported TypeScript parse/typecheck/build blockers for that snapshot. A green static build is not proof of application behavior.
- Broadened the `scripts/check-python-teaching-examples.mjs` CI executable sample set from **12 to 22**: ten explicitly selected independently runnable OOP examples, covering construction, separate `self` instances, composition basics, first-class functions, decorator transformation/metadata, read-only/validated properties, class/static methods and frozen dataclasses (`2f14f3a`). This is a new coverage requirement; the 22-sample result must be run and evidenced, not assumed green.
- `pnpm test` was reported as zero tasks in prior user output. Do not count as a passing test suite. Browser matrix tests, complete domain labs and mobile progress persistence remain pending.

### 2026-10-17 — Replace no-op test command with executable curriculum smoke tests

- Confirmed user-run `pnpm typecheck` and `pnpm build` both passed on branch `faef2c79`; static/compile gate closed for that snapshot.
- Earlier `pnpm test` exited successfully but executed **zero** tasks through Turbo, creating a misleading green indicator. Replaced root `pnpm test` with Node's built-in test runner; added `scripts/tests/curriculum-smoke.test.mjs` containing three executable process-level assertions: curriculum structural integrity, Python teaching snippets (22 expected), and Java DI teaching sample (`886f5bd`, `5a74fd1`). These are **curriculum smoke/integration checks, not application unit tests or browser E2E**.
- Added `pnpm test` as a required GitHub Actions curriculum-audit workflow step (`8bfdb6d`). All ten additional OOP captions were present in source during connector inspection; **runtime pass of the new 22-sample check and smoke suite is pending**. Do not count this as executed/passing until user or CI reports it.
- Outstanding: actual tests of runtime learning progress/persistence and UI, E2E execution and browser artifacts, additional negative paths and real target-environment labs.

### 2026-10-17 — First smoke-test execution and scoped deferral

- User ran `pnpm test`: curriculum integrity and Java example smoke tests passed; Python example smoke test failed because nine newly selected OOP blocks were not extracted. Source-level check identified that most OOP samples use **quoted object property names** (e.g. `"caption"`, `"code"`) while the AST helper only recognized identifier-form property names. Updated extractor to accept both identifier and string-literal property names (`4cbc1fa`). The resulting 22-example run still needs confirmation.
- At user direction, **defer testing learner curriculum loading, lesson navigation, completion recording and persistence/re-entry for now**. Do not treat those learner-functionality gates as passed. Continue other chosen curriculum checks without automatically expanding to those deferred tests.

### 2026-10-17 — Python content-check coverage expanded; learner workflow tests deferred

- Confirmed extractor supports quoted and unquoted object-literal properties after `4cbc1fa`, addressing the user-reported nine sample-extraction failures; **no new user/CI execution result yet**.
- Extended Python self-contained examples from 22 to **28**: added account invalid-state contrast and enforced invariant, single-parent inheritance, notifier duck typing, return-value contract mismatch, and domain ownership/lifecycle design (`87340f5`). Updated smoke-suite acceptance assertion accordingly (`3909c55`). These are independently executable code snippets; examples requiring an earlier code block remain outside this standalone execution set and should be checked by a stateful fixture later.
- Per user instruction, continue to **skip learner-functionality tests** (curriculum loading/navigation, completion recording, progress restoration). These remain explicitly unverified and not accepted; this pass targets educational content examples only.

### 2026-10-17 — Python stateful examples: additional regression gates

- Expanded Python teaching-code checker with **four stateful, isolated execution sequences** (`eb87d07`, newline delimiter correction `d6ba9c0`): (1) valid Account construction followed by failed withdrawal/deposit; (2) Engine construction, Car delegation, collaborator replacement and fake; (3) inherited Vehicle/Bicycle, Car override, Bus constructor; (4) notifier implementations followed by missing-method failure. Each sequence executes all code blocks in order and compares concatenated printed output, avoiding misleading standalone execution of examples that deliberately rely on an earlier block.
- The self-contained example target remains **28**; four new stateful sequences are separate checks. These checks are committed but not yet reported passing by a user or CI run. Per user choice, no learner progress/navigation/persistence tests were introduced.

### 2026-10-17 — Python stateful snippet attribution hardened

- Reviewed the four newly added Python stateful sequences and identified a false-positive hazard: comparison of a **single concatenated stdout string** could pass even when an earlier block printed output attributed to a later block. Modified the checker to emit a boundary after each executed block and compare **each block's output** against its own published output (`b4938ca`). Sequences still share interpreter state within each lesson but run independently of one another.
- This change has not yet been verified by a fresh `pnpm test` run. User explicitly deferred UI navigation/completion/progress-persistence tests; no such tests were introduced.

### 2026-10-17 — Python checker coverage transparency (content audit)

- Audited the executable example checker itself and identified an evidence blind spot: reporting 28 standalone samples and four stateful sequences could be mistaken for verification of **every** Python example. Added an AST-based census of all literal `language: "python"` code blocks; after checking, it prints total source blocks, distinct targeted captions and **unverified blocks with published output**, including their captions (`5ef84d5`, formatting `9457697`). This is a review report, not an assertion that every remaining example is broken.
- The four stateful sequences compare per-block stdout to published output (prior commit `b4938ca`). Current content checks and the new coverage report require a fresh `pnpm test` result. We do not mark all Python examples audited solely because the curated subset passes.
- As directed, learner navigation, completion and progress-persistence tests are **deferred**, not silently declared passed; full curriculum-wide acceptance still requires separate practical/infrastructure and rendered content evidence.

### 2026-10-17 — Consolidated source-level code review across all schools

- Expanded Python OOP stateful fixture coverage to **six sequences**, adding (i) separate Car instance identity/state tracing and (ii) rejecting a lifecycle change without corrupting earlier valid state (`5490bbd`). The standalone sample target remains **28**. The smoke suite now asserts the exact 28 + six sequence result instead of only matching its prefix (`7d3c503`). Fresh runtime proof is pending.
- Added the existing `report-curriculum-code-evidence.mjs` full-source inventory as a fourth executable `pnpm test` smoke assertion (`ec65c4a`). This checks the report runs over **all TypeScript path modules** and identifies literal code blocks without adjacent expected output, plus suspicious commands for human triage. **This is source-level census, not proof that every module's code has executed or that every exercise is pedagogically accepted.**
- Corrected CI environment-order bug: Python 3.12 and Java 17 are now installed before the `pnpm test` smoke suite invokes those interpreters (`38f4df2`). Prior workflow could depend on implicit runner preinstalls.
- The requested one-pass review has advanced static cross-school coverage and Python code exercises, but the broader **runtime/VM-specific verification of every curriculum module remains outstanding**; no evidence of an actual full-repository runtime test run is available from this session. Per user instruction, learner navigation, completion and progress-persistence tests remain deferred.

### 2026-10-17 — User-confirmed build; cross-school evidence triage refinement

- User reported a **successful build** after the latest curriculum commits. This confirms their local build result, but **does not establish** that the expanded `pnpm test` suite, infrastructure labs or all authored examples passed.
- Reviewed the shared cross-school code evidence reporter. Its previous flat inventory provided file/line candidates but no comparative view across technology languages or modules. Added **per-language breakdown** (source code records, literal examples, examples with output evidence, human-review candidates) and ranked modules with unresolved observable examples (`0b41b42`). Required the breakdown in the smoke-test report assertion (`01b6a7a`).
- This is a triage improvement, not an assertion that all examples execute; scripts and language-specific pedagogical exercises still require separate verification. Learner navigation, completion and progress persistence remain deferred per user instruction.

### 2026-10-17 — Executed curriculum smoke suite and code-evidence candidate triage

- User ran `pnpm test` locally after pulling `4da6704d`. **All four smoke tests passed**: structure/integrity, Python (28 standalone and six stateful sequences), Java dependency-injection example and full-school source code evidence inventory. The distinct `pnpm report:curriculum-examples` command also completed successfully: **196 source files, 410 code records, 18 heuristic candidates**, 0 potentially unsafe literal teaching commands by the current regex. These are actual user-run results, not inferred.
- Inspected all 18 flagged locations in the seven identified modules. They include URL/text illustration, intentionally non-resolving API request templates, environment-variable-gated host/network diagnostics, platform-specific observation commands, and examples whose captions already document expected behavior. A missing literal fixed-output field is **not automatically a defect** when output genuinely varies by host or the block is a command template.
- Refined the report to distinguish literal examples lacking both output and descriptive caption guidance from context-dependent examples with such guidance (`738477f`). This reduces false-positive prioritization without claiming command execution. The remaining conditional execution/VM labs and educational correctness of individual exercises are still open. Run the updated report after pulling to see the new grouping.
- Per user request, do not introduce navigation/completion/progress-persistence tests.

### 2026-10-17 — Cross-school practical contract census introduced

- Following user confirmation of the passing four-test curriculum smoke suite, added `scripts/report-curriculum-practicals.mjs` to inventory explicit `type: "practical"` objects across all runtime path files, flagging missing/short **objectives, scenarios, instructions, deliverables and completion criteria** while separately counting computed/template-driven fields (`145cc68`). Added `pnpm report:curriculum-practicals` (`4c6d062`) and a fifth smoke-test assertion that the report executes (`53fba27`).
- This is **source triage only**. Dynamic lesson factories and final rendered practical contracts still need pedagogical scrutiny. No claims are made that every practical passes acceptance or that this newly added command has been executed on the user's system. The previously deferred learner workflow tests remain out of scope.

### 2026-10-17 — User-confirmed five smoke checks; practical audit false-positive correction

- User executed `pnpm report:curriculum-practicals` across 196 path files, reporting 607 literal practical content objects, 84 computed contracts and 96 heuristic missing/weak candidates. Their `pnpm test` executed **five checks, all passed**. This is verified execution evidence, not full pedagogical acceptance.
- Examined representative flagged files from Builder, Architect, Platform, Quality, Technical Steward and the normalization helper. The original heuristic erroneously treated **valid computed variables / template literals / identifiers** as missing or weak content, and short but legitimate deliverable names as deficient. Reworked source reporter to distinguish truly absent fields, empty literal values and computed contracts requiring separate resolved-content inspection (`f9b3ec4`). The tool no longer counts a computed contract as a literal defect and reports a ranked list of actual source-level candidates.
- This correction is committed but the **new report result remains unexecuted** in the user's environment. This triage does not certify that resolved dynamic lessons meet their learning objectives. Learner navigation, completion and progress-persistence tests remain deferred by request.

### 2026-10-17 — User-run practical report: 69 candidates reclassified by syntax

- User ran the refined source report: 196 path files, 607 explicit practical objects, 84 computed-field objects, **69 supposed missing/empty candidates**. This is a source-level candidate count, not 69 demonstrated bad exercises. Review found repeated **shorthand properties** (`scenario`, `instructions`, `deliverables`) and **object spread composition** (`{ type: "practical", ...practice }`) incorrectly counted as absent. Updated auditor to classify both as indirect/resolved-at-runtime contracts rather than confirmed missing values (`8ae4cc7`).
- Follow-up report must be executed to determine whether any truly absent fields remain; checks of template-generated/resolved activity content are still outside source-only heuristics. The previously user-confirmed five smoke tests passed for the earlier script version; current report revision awaits execution. Learner workflow tests remain deferred at user's direction.

### 2026-10-17 — Practical source contract gate confirmed

- User executed practical source audit on `db98382d`: **196 files, 607 explicit practical objects, 129 computed-field objects (13 with spread), 0 missing/empty literal contract candidates**. User also executed `pnpm test`: **5 passed, 0 failed**. These findings close the *explicit literal field-presence* gate, not full learner-facing exercise acceptance.
- Strengthened the automated practical smoke assertion to require **zero missing/empty literal candidates**, so the check fails if a future change reintroduces a detectable omission (`8040aa3`). Before this change, it would pass as long as the report executed, even if it reported missing fields.
- Outstanding: resolve/inspect the **129 computed-field practical objects** and factory-produced exercises for substantive quality, evidence-specific completion criteria, and prerequisites. No learner navigation, completion or progress-persistence testing per user deferral.

### 2026-10-17 — Resolved practical contract validation (new, pending run)

- User reconfirmed `pnpm test`: **5/5 passing**, including zero missing/empty literal source candidates. This is reliable source-level evidence but not a resolved-content check.
- Added `scripts/check-resolved-practical-contracts.mjs` (`f5a1618`) and `pnpm check:resolved-practicals` (`1426850`). The script loads the actual assembled `technicalStewardshipJourney` through a local TypeScript-to-CommonJS require hook, traverses all schools/paths/lessons/activities, and checks every **resolved** `practical` activity for nonempty objective, scenario, instructions, deliverables and completion criteria. This directly addresses shorthand/computed/spread practical definitions that source-level heuristics cannot check.
- **Not yet executed:** failures could expose actual content defects or a module-loading issue; do not claim green until script returns successfully. This script inspects content contracts only, NOT learner navigation, completion state or persistence (all deferred by user).
