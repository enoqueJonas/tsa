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
| builder | `builder-python-quality` | — | — | — | — | — | Not started |
| builder | `builder-web-api-quality` | — | — | — | — | — | Not started |
| builder | `builder-django-quality` | — | — | — | — | — | Not started |
| builder | `builder-postgresql-quality` | — | — | — | — | — | Not started |
| builder | `builder-identity-auth-deep` | — | — | — | — | — | Not started |
| builder | `builder-software-craft-quality` | — | — | — | — | — | Not started |
| builder | `builder-milestone-deep` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-requirements-quality` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-boundaries-quality` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-modeling-quality` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-components-quality` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-data-flow-quality` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-soap-xml-deep` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-enterprise-file-integration-deep` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-distributed-state-messaging-deep` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-failure-quality` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-architecture-decisions-quality` | — | — | — | — | — | Not started |
| system-thinker | `system-thinker-milestone-deep` | — | — | — | — | — | Not started |
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
