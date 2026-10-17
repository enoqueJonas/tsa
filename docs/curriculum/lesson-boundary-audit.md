# Curriculum lesson-boundary audit — inventory

> Initial module inventory, not a finding of pedagogical completeness. Each module below requires inspection for overloaded concepts, missing prerequisites, worked examples and output traces.

## Evidence-based completion gates (current)

The audit is tracked in GitHub Issue #314. **Source presence is not pedagogical approval**:

| Gate | Current finding |
| --- | --- |
| Logical curriculum inventory | 134 of 134 source files inspected for presence and basic shape; complete structural census in `source-census.md`. |
| School module wiring | School and Academy aggregator imports reconciled with inventory; static drift guard added. |
| Delivery practical enrichment | 82 title-to-quality-practical pairs matched; automated parity guard added. |
| Artifact Supply Chain source-level reading/practical audit | 25 authored lesson specifications and 23 quality override profiles examined; specific fixes committed. |
| Lesson-by-lesson pedagogical approval across schools | Not complete; historical checkboxes are progress markers, not approval of every activity. |
| Executable examples and expected outputs | Selected examples corrected; comprehensive per-code-block verification open. |
| Automated `pnpm audit:curriculum` and latest `pnpm build` | Not confirmed after latest changes. Earlier build success was reported by the user. |
| Rendered lesson checks and real learner labs | Open; actual Steward infrastructure and exercise execution have not been verified. |

## Review criteria

1. Does each lesson have one coherent objective and enough space to explain new mechanisms?
2. Does it teach prerequisites before using them?
3. Do runnable examples demonstrate behavior with expected output and execution explanation?
4. Is the reading technically clear without becoming superficial or artificially introductory?
5. Do practical activities build independently demonstrable evidence?

## School module inventory

### builder

Status: **Not yet audited**.

- [x] `builder-python-quality`
- [x] `builder-web-api-quality`
- [x] `builder-django-quality`
- [x] `builder-postgresql-quality`
- [x] `builder-identity-auth-deep`
- [x] `builder-software-craft-quality`
- [ ] `builder-milestone-deep`

### system-thinker

Status: **Not yet audited**.

- [x] `system-thinker-requirements-quality`
- [x] `system-thinker-boundaries-quality`
- [x] `system-thinker-modeling-quality`
- [ ] `system-thinker-components-quality`
- [ ] `system-thinker-data-flow-quality`
- [ ] `system-thinker-soap-xml-deep`
- [ ] `system-thinker-enterprise-file-integration-deep`
- [ ] `system-thinker-distributed-state-messaging-deep`
- [ ] `system-thinker-failure-quality`
- [ ] `system-thinker-architecture-decisions-quality`
- [ ] `system-thinker-milestone-deep`

### platform-builder

Status: **Not yet audited**.

- [ ] `platform-builder-bare-metal-foundations-deep`
- [ ] `platform-builder-budget-homelab-quality`
- [ ] `platform-builder-computer-os-quality`
- [ ] `platform-builder-configuration-management-deep`
- [ ] `platform-builder-core-infrastructure-services-deep`
- [ ] `platform-builder-enterprise-file-directory-services-deep`
- [ ] `platform-builder-enterprise-storage-nas-deep`
- [ ] `platform-builder-implementation-milestones`
- [ ] `platform-builder-linux-administration-quality`
- [ ] `platform-builder-milestone-deep`
- [x] `platform-builder-networking-quality`
- [ ] `platform-builder-os-patching-lifecycle-deep`
- [ ] `platform-builder-packet-tracer-network-engineering-deep`
- [ ] `platform-builder-proxmox-homelab-deep`
- [ ] `platform-builder-proxmox-milestone`
- [ ] `platform-builder-virtualization-quality`
- [ ] `platform-builder-windows-powershell-enterprise-deep`

### delivery-engineer

Status: **Not yet audited**.

- [x] `delivery-artifact-supply-chain-quality` — 25 lessons / 23 quality-enriched practicals + 2 integrated labs; source audit complete, execution/render validation open.
- [ ] `delivery-automation-shell-deep`
- [x] `delivery-containers-docker-quality`
- [ ] `delivery-continuous-delivery-quality`
- [x] `delivery-continuous-integration-quality`
- [ ] `delivery-configuration-management-quality`
- [ ] `delivery-engineer-milestone-deep`
- [ ] `delivery-migration-exercises-deep`
- [ ] `delivery-production-schema-evolution-deep`
- [x] `delivery-release-engineering-quality`
- [ ] `delivery-software-foundations-quality`

### cloud-engineer

Status: **Not yet audited**.

- [x] `cloud-architecture-cost-quality`
- [x] `cloud-hosting-models-quality`
- [x] `cloud-building-blocks-quality`
- [ ] `cloud-certificate-lifecycle-operations-deep`
- [ ] `cloud-engineer-milestone-deep`
- [ ] `cloud-orchestration-gitops-deep`
- [ ] `cloud-progressive-delivery-canary-deep`
- [ ] `cloud-object-storage-implementation-deep`
- [x] `cloud-infrastructure-as-code-quality`
- [ ] `cloud-internet-networking-quality`
- [ ] `cloud-vps-operations-quality`

### quality-steward

Status: **Not yet audited**.

- [x] `quality-api-integration-testing-deep`
- [x] `quality-automation-framework-engineering-deep`
- [ ] `quality-browser-environment-testing-deep`
- [ ] `quality-browser-surface-decision`
- [ ] `quality-performance-tool-decision`
- [ ] `quality-containers-ci-deep`
- [ ] `quality-java-test-engineering-deep`
- [ ] `quality-continuous-scheduled-execution-deep`
- [ ] `quality-non-functional-deep`
- [ ] `quality-engineering-deep`
- [ ] `quality-steward-milestone-deep`
- [ ] `quality-reuse-internal-library-deep`
- [ ] `quality-test-analysis-design-deep`
- [ ] `quality-unit-component-testing-deep`

### security-steward

Status: **Not yet audited**.

- [x] `security-application-deep`
- [ ] `security-artifact-signing-verification-deep`
- [ ] `security-container-delivery-deep`
- [ ] `security-enterprise-directory-federation-deep`
- [ ] `security-foundations-deep`
- [ ] `security-identity-secrets-deep`
- [ ] `security-internal-pki-machine-trust-deep`
- [ ] `security-internal-pki-milestone`
- [ ] `security-linux-network-deep`
- [ ] `security-secure-file-transfer-migration-deep`
- [ ] `security-steward-milestone-deep`
- [ ] `security-threat-modeling-deep`
- [ ] `security-vault-implementation-deep`
- [ ] `security-vulnerability-laboratory-deep`
- [ ] `security-web-api-threats-deep`

### reliability-engineer

Status: **Not yet audited**.

- [ ] `reliability-alerting-on-call-deep`
- [ ] `reliability-alertmanager-implementation-deep`
- [ ] `reliability-central-logging-decision`
- [ ] `reliability-database-stewardship-deep`
- [ ] `reliability-data-protection-disaster-recovery-deep`
- [ ] `reliability-distributed-tracing-implementation-deep`
- [ ] `reliability-fault-injection-deep`
- [ ] `reliability-incident-management-deep`
- [ ] `reliability-metrics-prometheus-grafana-deep`
- [x] `reliability-observability-deep`
- [ ] `reliability-observability-stack-integration-deep`
- [ ] `reliability-performance-capacity-deep`
- [ ] `reliability-production-logging-deep`
- [ ] `reliability-sre-foundations-deep`
- [ ] `reliability-resilience-distributed-failure-deep`
- [ ] `reliability-service-level-engineering-deep`
- [ ] `reliability-steward-reliability-program-deep`
- [ ] `reliability-tracing-backend-decision`

### architect

Status: **Not yet audited**.

- [ ] `architect-evaluation-governance-deep`
- [x] `architect-architecture-fundamentals-deep`
- [ ] `architect-milestone-deep`
- [ ] `architect-architectural-styles-deep`
- [ ] `architect-data-architecture-deep`
- [x] `architect-domain-modeling-deep`
- [ ] `architect-integration-and-messaging-deep`
- [ ] `architect-modularity-deep`
- [ ] `architect-resilience-architecture-deep`
- [ ] `architect-scalability-distributed-systems-deep`

### technical-steward

Status: **Not yet audited**.

- [ ] `technical-steward-architecture-governance-deep`
- [ ] `technical-steward-change-service-governance-deep`
- [ ] `technical-steward-controls-compliance-assurance-deep`
- [ ] `technical-steward-engineering-governance-deep`
- [ ] `technical-steward-handbook-standards-deep`
- [ ] `technical-steward-milestone-deep`
- [ ] `technical-steward-security-data-governance-deep`
- [ ] `technical-steward-technical-debt-health-deep`
- [ ] `technical-steward-technical-leadership-deep`
- [ ] `technical-steward-third-party-lifecycle-risk-deep`
- [ ] `technical-steward-technology-governance-deep`
- [x] `technical-steward-technology-risk-deep`
- [ ] `technical-steward-strategy-capability-deep`

### professional-engineer

Status: **Not yet audited**.

- [ ] `professional-engineer-capstone-problem-discovery-deep`
- [ ] `professional-engineer-capstone-engineering-proposal-deep`
- [ ] `professional-engineer-independent-build-deep`
- [ ] `professional-engineer-production-readiness-deep`
- [ ] `professional-engineer-defence-deep`
- [x] `professional-engineer-professional-practice-deep`
- [ ] `professional-engineer-portfolio-reflection-deep`

## Known findings and actions

- [x] Python OOP was overloaded as one lesson; split into sequenced lessons.
- [x] Rebuild Python encapsulation, composition, inheritance, polymorphism, decorators and design explanations.
- [x] Separate decorator mechanics from class-feature decorators.
- [x] Add an object-reference diagram for composition.
- [ ] Review rendered OOP lessons and practical activities.
- [ ] Review each module above and document specific findings before editing.
- [ ] Re-run curriculum audit and build after remediation.

## Review batch 1 — Builder and System Thinker

The following entries have been inspected for module structure and lesson-title progression; this is a **structural pass**, not a full block-by-block pedagogical approval. The `*-quality` modules primarily decorate practical activities and inherit teaching content from separate `*-deep` or `*-rich` modules. Therefore, counting code blocks or lesson headings in the quality wrapper alone is misleading.

| Module | Observation | Follow-up |
| --- | --- | --- |
| Builder Web/API | Teaching comes from `builder-web-api-deep`; it introduces HTTP request/response and network layers separately. | Inspect individual response-contract examples for visible outcomes. |
| Builder Django | Teaching comes from `builder-django-rich`; uses a concept-to-code block mapper that supports expected output. | Inspect every concept's code for meaningful runtime behavior. |
| Builder PostgreSQL | Teaching comes from `builder-postgresql-deep`; SQL sections support optional expected output. | Review examples where result tables would aid understanding. |
| Builder Identity/Auth | Distinguishes identity, authentication, authorization, password verification and security boundaries. | Review code-level prerequisite ordering. |
| Builder Software Craft | Distinguishes Git history, staging, restore/revert/reset and architecture boundaries. | Preserve advanced depth; review practice evidence. |
| System Thinker Requirements | Distinguishes stakeholders, actors, quality attributes, constraints and acceptance criteria. | Review worked examples and validation evidence. |
| System Thinker Boundaries | Separates system context, responsibility, trust and ownership boundaries. | Review diagram interpretation tasks. |
| System Thinker Modeling | Separates model scope, C4 views, state transitions and diagram-as-code. | Review actual learner diagrams. |

**Confirmed cross-module prerequisite defect fixed:** introductory Python OOP practical previously required Team composition before the Composition lesson. The task is now in the later Composition practical (`5e64311`).

## Review batch 2

Inspected selected Cloud, Quality, Security and Architecture modules. The Cloud quality wrappers delegate teaching to deep source modules. Quality API and framework modules separate HTTP semantics, contracts, authentication, logging and retry policy. Security application modules distinguish authentication, authorization and validation. These observations do not establish complete pedagogical quality.

**Confirmed and fixed:** `architect-domain-modeling-deep` combined entities, value objects and aggregates into one brief lesson. Commit `c1019ec` splits them into three substantive lessons on identity, value equality and consistency boundaries, with Steward examples and exercises.

## Review batch 3 — cross-school sampling

Inspected lesson sequences in Cloud Hosting, Cloud Cost, IaC, Security Application, Reliability Observability, Technical Risk, Professional Practice, Platform Networking and Delivery CI/Docker. Most of these already separate major named concepts, but a lesson-title scan does not establish conceptual depth. `*-quality` wrappers may import content from corresponding `*-deep` modules. Keep advanced subject matter advanced while checking prerequisite order.

**Architect remediation extended:** commit `e925ee5` adds runnable, output-bearing Python examples to the three newly split identity, value-object and aggregate lessons. Each demonstrates a specific mechanism and explains the observed result.

## Review batch 4 — Technology Risk

Confirmed a teaching-quality issue: Technology Risk lessons used substantial prose in the reading body but supplied only a resources block, with no worked reasoning sequence. Commit `94d0132` places the lesson explanation into reading blocks and adds worked risk scenarios for identification, likelihood/impact, inherent/residual exposure, appetite/tolerance, treatment and acceptance. The examples distinguish observation, uncertainty, consequence, evidence, control effectiveness and authority. Remaining risk lessons still need detailed review.

## Review batch 5 — Professional Practice

Confirmed a lack of worked decision sequences in `professional-engineer-professional-practice-deep`: lessons supplied substantive conceptual prose and practice tasks but no specific case connecting a situation, defensible decision, evidence and trade-off. Commit `3a272ee` adds one worked decision to each of the six lessons, preserving their existing advanced content and exercises. This is a targeted instructional improvement, not a claim that the entire school is audited.

## Review batch 6 — Observability

Confirmed a gap in `reliability-observability-deep`: each lesson offered principles and Steward exercises but lacked an explicit diagnostic walkthrough mapping a question to signals and an interpretation. Commit `9a552d2` adds question/evidence/interpretation examples to all eight conceptual lessons. The examples cover monitoring versus observability, signals, telemetry design, correlation, instrumentation, tracing, golden signals and telemetry cost. These are reasoning examples, not fabricated runtime measurements.

## Review batch 7 — Python OOP practical progression

Confirmed a major gap: after splitting Python OOP into individual lessons, the quality-layer practical mapping covered Composition but not the six other new lessons. Those lessons therefore retained generic practical instructions instead of progressive, domain-specific engineering tasks. Commit `75c20ed` adds targeted practical activities for Encapsulation, Inheritance, Polymorphism, Decorators, Python Class Features and OOP Design, with runnable evidence and negative tests. Commit `1b5f61c` labels inheritance snippets that depend on the earlier Vehicle definition as continuations. The broader Python curriculum still requires review outside OOP.

## Review batch 8 — Application Security

Confirmed that the twelve application-security conceptual lessons presented principles and practical tasks without an explicit worked case connecting threat scenario, control, positive/negative verification and reasoning. Commit `f733a55` adds a concrete control-and-verification case to each lesson. The cases distinguish authentication from authorization, validation from access control, generic errors from protected diagnostics, and configuration from verified security properties. This does not imply security assurance for the actual Steward implementation; learners must still implement and test controls in their own environment.

## Review batch 9 — Architecture Fundamentals

Confirmed that nine architecture-fundamentals lessons provided principles and exercises but lacked a worked decision showing why the concept matters to a concrete system. Commit `3588615` adds situation/reasoning/evidence walkthroughs for architectural significance, design boundaries, drivers, quality attributes, constraints, trade-offs, ownership, fitness checks and ADR documentation. These are illustrative decisions; learners still need to evaluate their actual Steward architecture.

## Review batch 10 — System Thinker components and data flow

Inspected the source lessons behind `system-thinker-components-quality` and `system-thinker-data-flow-quality` rather than treating the quality wrapper as teaching content. Both have distinct lesson objectives, practices and checks, but the introductory reading used mostly general descriptions and conceptual diagrams where a concrete decision trace would help learners test understanding.

- Commit `1ec8d5b` adds a registration-based worked responsibility decision that separates permission, lifecycle invariants and persistence. It explicitly marks the model as illustrative pending comparison with the Steward implementation.
- Commit `2198260` adds a positive and negative registration-flow walkthrough distinguishing authentication, authorization, domain validation, persistence and observed contract outcomes. It makes clear these are expected outcomes, not asserted runtime test results.

This is a **targeted content improvement**, not a full pass over either module. Remaining lessons, practice/rendering, the complete school sequence, and actual local audit/build still require validation.

## Review batch 11 — Distributed messaging outbox

Inspected the distributed-state and messaging module's lesson sequence, particularly transactional outbox. The module already splits distributed-state justification, caching, queueing, idempotency, dead-lettering, ordering and outbox into distinct lessons; this is useful structural granularity, not evidence that every lesson is complete. The outbox lesson described the dual-write failure but lacked a stepwise explanation of specific crash windows and the resulting committed/pending/duplicate states. Commit `c19fa77` adds a worked event-ID trace covering rollback, committed pending intent, published-but-not-marked duplication and ambiguous broker outcomes. The example distinguishes publisher recovery from consumer idempotency and avoids unsupported exactly-once claims. Remaining lessons and actual behavior/rendering still need review.

## Review batch 12 — SOAP/XML and enterprise file contracts

Reviewed source teaching sections in `system-thinker-soap-xml-deep` and `system-thinker-enterprise-file-integration-deep`, focusing on failure interpretation and file handoff/replay. Both modules already cover distinct contract and lifecycle mechanisms but some lessons lacked a specific end-to-end outcome trace.

- Commit `b8aa947`: the SOAP Envelope/Fault lesson now traces connection unavailability, HTTP/SOAP binding rejection, SOAP Fault and valid response as different diagnostic layers. The trace labels its cases illustrative and separates retry decisions from error classification.
- Commit `bf51432`: the enterprise file-contract lesson now traces incomplete .part delivery, final-name handoff, accepted delivery, identical replay and conflicting replay. It explicitly bounds atomic-rename assumptions and distinguishes expected behavior from observed tests.

These are targeted instructional improvements, **not** full module clearance. Still required: inspect other SOAP/file lessons and practicals, check rendered content, perform curriculum audit/build and record learner validation.

## Review batch 13 — Failure Modes and Architecture Decisions remediation

After inspecting both source lesson modules and their quality activities, addressed the two pending teaching gaps. Commit `ffda281` adds a worked stale-ownership failure chain, distinguishing trigger, incorrect behavior, impact and candidate prevention/detection/containment/recovery controls. Commit `efdf06e` adds an end-to-end hypothetical synchronous-versus-asynchronous notification trade-off, with evidence requirements, costs, and reconsideration triggers. These are source-content remediations, not evidence that the complete modules have passed learner testing. Build, automated audit and rendered-content validation remain pending.

## Review batch 14 — System Thinker milestone handoff and Platform bare metal

Inspected the System Thinker milestone artifact gates. The milestone already requires a traceable Builder checkpoint, reconciled models, Redis/RabbitMQ evidence, failure analysis, and ADRs; this is a structural inspection only, not proof that the completed portfolio or rendered learner flow is sufficient. Began Platform Builder source review with `platform-builder-bare-metal-foundations-deep`. The Hardware Health lesson had a heading ('Observe before replacing') immediately followed by the next heading, leaving its diagnostic concept without an explanatory sequence. Commit `c25618b` supplies a concrete, illustrative hardware-versus-application I/O investigation with bounded SMART evidence and missing-telemetry handling. Remaining Platform lessons, final rendered verification and audit/build have not been completed.

## Review batch 15 — Platform Builder homelab capacity

Inspected the budget-homelab, computer/OS and virtualization quality wrappers and their source lesson relationships. These modules include applied resource and operating-system investigations; the wrappers alone cannot establish reading quality. The budget-homelab CPU/RAM/storage/NIC lesson stated memory constraints but provided no worked resource-allocation calculation. Commit `f9878a9` adds an explicitly hypothetical 16 GiB host budget, separating host reserve, guest allocation and remaining headroom; it warns that allocation arithmetic does not substitute for monitoring. Remaining lesson mechanisms and generated rendered content have not received a full review; automated audit and build are not yet run.

## Review batch 16 — Platform Builder virtualization networking

Inspected the teaching content in `platform-builder-virtualization-deep.ts`, not only its quality wrapper. The Virtual Networking Modes lesson already contrasts NAT and bridging and includes diagnostic commands, but it did not connect those commands into a clear troubleshooting sequence. Commit `b1394b6` adds an illustrative connection-failure trace separating application listening, guest address/route, NAT or bridged topology, and firewall/upstream policy. The content is not represented as actual learner output. This is one targeted improvement; remaining Platform modules and rendered/build checks still require review.

## Review batch 17 — Linux systemd diagnostics

Inspected Linux Administration teaching source, its Rocky Linux quality wrapper, plus Platform Proxmox and NAS lesson sources. The quality wrapper adapts Ubuntu-origin material to the Rocky Linux learning baseline, so raw source terminology alone is not sufficient evidence of the learner-visible runtime text. The systemd lesson distinguished service activation from application readiness but lacked a concrete investigation sequence. Commit `16c5249` adds an active-unit/unreachable-application walkthrough, checking supervisor evidence, logs, listening socket, local request and network/security boundary without claiming invented command output. Proxmox and NAS inspections were exploratory, not module sign-off. Local automated audit/build and rendered experience remain pending.

## Review batch 18 — Enterprise NAS NFS access diagnosis

Reviewed Proxmox backup/restore and Enterprise NAS source lessons. Both already require hands-on restore evidence, distinguish snapshots from independent backup, and acknowledge single-host failure domains. The NAS NFS teaching distinguished identity/export layers conceptually but offered no stepwise case of an apparently successful mount followed by a denied write. Commit `01fb60d` adds a worked client mount → server export → numeric identity → filesystem permission diagnosis, with explicit evidence boundaries and without unsafe blanket permission changes. This is targeted source remediation; no full Proxmox/NAS pedagogical clearance or local build/render validation is claimed.

## Review batch 19 — Platform infrastructure and configuration management

Inspected configuration-management, core infrastructure (DNS/DHCP/time) and enterprise file/directory source content. The infrastructure lessons distinguish DNS authority/recursion, DHCP relay, chrony/time semantics, network-file permissions and directory identity. The configuration-management drift lesson explained check/diff conceptually but lacked a concrete decision sequence for legitimate versus unauthorized drift. Commit `e739c29` adds a worked canary-oriented investigation: inspect a manual change, compare declared ownership, decide whether to codify or revert it, validate configuration and service behavior, and repeat to test idempotence. Further lesson-by-lesson inspection remains pending; no local build, automated curriculum audit or rendered verification has been performed.

## Review batch 20 — Packet Tracer first-lab prerequisites

Inspected Platform OS patching, Windows/PowerShell and Packet Tracer source lessons. The first Packet Tracer lab required learners to navigate IOS command modes and diagnose interface state but passed no teaching sections to its brief, leaving the mechanism to be discovered during the practical. Commit `f155103` adds prerequisite-first explanations of user/privileged/configuration modes, a prompt-to-mode command trace, and an interface-state interpretation walkthrough before the lab. The content labels expected behavior rather than fabricating runtime output. The OS patching and Windows modules received initial structural inspection only; further content review, rendered inspection and automated build/audit remain pending.

## Review batch 21 — Windows PowerShell pipeline teaching

Inspected Platform Builder Windows/PowerShell and OS patching sources beyond the initial structural pass. The PowerShell lesson states that pipelines carry objects and that early formatting is harmful, but offered no concrete worked transformation. Commit `80cd4be` adds a stepwise object/property/filter/select explanation and contrasts premature table formatting; host-dependent results are correctly treated as observations, not fabricated console output. OS patching already distinguishes DNF transaction success from workload validation and installed from running kernels. Further Windows and patching lesson-by-lesson review, rendered experience and audit/build remain pending.

## Review batch 22 — Platform milestone handoff and Delivery shell example

Inspected Platform Builder's integrated milestone gates (core infrastructure, patch lifecycle, Windows estate, Proxmox, and the main Steward homelab portfolio). The gates require observed cross-system and recovery evidence rather than completion by diagram alone; this is structural review, not a completed learner run. Began Delivery Engineer content review. In `delivery-automation-shell-deep.ts`, the `set -euo pipefail` health-check example referenced `health_url` without defining it, which makes the snippet fail under `set -u` when copied independently. Commit `bd6ebe2` supplies an explicit positional-argument/default URL before use. This remedies a concrete independently-runnable-example defect; build and learner rendering remain unverified.

## Review batch 23 — Delivery CI dependency behavior

Inspected Delivery Engineer continuous-integration, Docker and release-engineering lesson sources. The Jobs, Stages and Dependencies section discussed parallel work and prerequisite relationships but did not give learners a complete passing/failing execution trace. Commit `c040d6c` adds a worked Steward job graph, independent versus gated work, a failed unit-test outcome, explicit policy-dependent lint gating, and immutable image handoff. This is targeted source improvement only; remaining lessons, rendered content, automated curriculum audit and local build are unverified.

## Review batch 24 — Docker, Release Engineering and Delivery breadth

Inspected the 15 source Docker lesson titles and confirmed that all 15 have corresponding investigation activities in the quality wrapper. Inspected the six core Release Engineering reading lessons and confirmed all six have matching practice overrides; additional release lab/review content is composed separately and still requires individual validation. Sampled their instruction and evidence design, and inspected Delivery continuous delivery, migration, configuration management, software foundations, artifact supply chain, CI and school milestone sources. This is **not** a finished activity-by-activity pedagogical sign-off.

Remediations committed: `7591086` and `1e24027` strengthen Docker volume lifecycle and add a disposable executable persistence demonstration with expected output; `2de93f3` adds a worked release regression decision distinguishing process health, functional failure, backwards-compatible rollback and forward repair; `ce9c279` adds an explicit expand/backfill/switch/contract field migration through old/new application coexistence.

**Outstanding:** individual lesson activity-level depth verification, prerequisite sequencing, example-output review, full school and 133-module curriculum review, automated `pnpm audit:curriculum`, `pnpm build`, and rendered inspection. The connected GitHub editor cannot run local `pnpm` here; attempted Git access from local container failed due unavailable network resolution. Do not infer passing build or whole-school approval from successful source commits.

## Review batch 25 — Activity inventory: Docker and Release Engineering

Inspected the complete 15-title Docker source/quality pairing and 6-title core Release Engineering source/quality pairing, plus the three release-lab practices and final review. Each of the 21 core lesson/practical pairs has a practical contract with objective, scenario, instructions, deliverables and completion criteria; this does **not** prove the instructions will succeed in a learner environment. The matrix records the strongest source-level teaching question or implemented correction for each activity rather than pretending the labs were executed.

| Lesson/activity | Source-level audit focus | Unresolved validation |
| --- | --- | --- |
| Docker: Containers vs VMs | Boundary and failure scope; worked guest/container comparison added | Runtime evidence and rendered-content verification pending |
| Docker: Namespaces/cgroups | Kernel-visibility versus resource-enforcement distinction and practical | Runtime evidence and rendered-content verification pending |
| Docker: Architecture | CLI/daemon privilege path and practical | Runtime evidence and rendered-content verification pending |
| Docker: Images/Layers | Image/container distinction; cache-invalidation scenario added | Runtime evidence and rendered-content verification pending |
| Docker: Dockerfiles | PID 1/process contract; representative Dockerfile, not assumed repo build | Runtime evidence and rendered-content verification pending |
| Docker: Build Context | `.dockerignore` file pattern example and build-context risk added | Runtime evidence and rendered-content verification pending |
| Docker: Multi-stage Builds | Build-time versus runtime responsibility; decision practical | Runtime evidence and rendered-content verification pending |
| Docker: Volumes | Executable disposable named-volume lifecycle and expected output | Runtime evidence and rendered-content verification pending |
| Docker: Networking | Client/host/bridge and inter-container DNS path walkthrough | Runtime evidence and rendered-content verification pending |
| Docker: Compose | Startup order versus readiness worked race | Runtime evidence and rendered-content verification pending |
| Docker: Health Checks | Liveness-versus-readiness observation and failure case | Runtime evidence and rendered-content verification pending |
| Docker: Registries | Internal artifact authority and reproduction contract | Runtime evidence and rendered-content verification pending |
| Docker: Image Tags | Mutable-tag/digest mismatch worked scenario | Runtime evidence and rendered-content verification pending |
| Docker: Optimization | Measure/rebuild/comparison practical rather than size fetish | Runtime evidence and rendered-content verification pending |
| Docker: Debugging | Boundary-first investigation and failure injection | Runtime evidence and rendered-content verification pending |
| Release: Candidates | Immutable candidate manifest and mutation ambiguity practical | Runtime evidence and rendered-content verification pending |
| Release: Promotion/Gates | Exact-digest approval invalidation and reject path | Runtime evidence and rendered-content verification pending |
| Release: Deployment Evidence | Client checks; corrected local image ID versus registry digest and required URL/token inputs | Runtime evidence and rendered-content verification pending |
| Release: Observability | Before/after, release identity, health versus behavior | Runtime evidence and rendered-content verification pending |
| Release: Failure Handling | Compatible/incompatible data-state recovery walkthrough | Runtime evidence and rendered-content verification pending |
| Release: Runbooks | Command preconditions, expected evidence, stop and exercised-runbook practice | Runtime evidence and rendered-content verification pending |
| Release Lab: Release Plan | Candidate/version/gates/recovery plan exercise | Runtime evidence and rendered-content verification pending |
| Release Lab: Promote/Verify | Same artifact, deployment and client evidence exercise | Runtime evidence and rendered-content verification pending |
| Release Lab: Fail/Recover | Controlled negative scenario and recovery exercise | Runtime evidence and rendered-content verification pending |
| Release Review | Reflective readiness/recovery/identity distinctions | Runtime evidence and rendered-content verification pending |

Additional committed corrections after batch 24: `77b4e06` (networking/Compose/health traces), `3520658` (isolation, caching and digest examples), `89db687` (build-context example), `05b588b` (promotion gate), `fba936f` and `ec3d3ac` (release verification script and OCI digest provenance). An attempted `b867c6a` edit was a no-op and must not be counted as remediation. All 25 listed activities were reviewed for intended learning objective and evidence contract; learner run, TypeScript compilation, full visual check, and deeper source review across other modules remain outstanding.

## Review batch 26 — Additional Delivery remediations and cross-school reconnaissance

Further Delivery Engineer fixes: `f8162f8` replaces a mismatched Ubuntu `ansible.builtin.apt` example with the Rocky Linux `ansible.builtin.dnf` package module; `4b87385` adds a regression guard in the curriculum integrity audit. A branch-scoped GitHub Actions workflow was introduced by `7249371` to run `pnpm audit:curriculum` and `pnpm build` on branch pushes. No workflow runs had been reported for the inspected commits, so **CI/build pass remains unverified**, and the editor environment still cannot clone the repository locally to execute it.

Performed a broad, non-sign-off structural reconnaissance across samples from Cloud Engineer, Quality Steward, Security Steward, Reliability Engineer, Architect, Technical Steward and Professional Engineer, including authored-lesson sources whose practical blocks are not represented by literal `type: "practical"` text. Do not use such regex counts to claim missing exercises. A single bulk attempt to fetch all 133 inventory modules exceeded the connected tool-call cap; **no full curriculum-wide activity inspection has been completed**. Remaining modules stay unchecked until source-level review and specific evidence are recorded.

## Review batch 26 — Delivery completeness checks and executable CI guard

Verified lesson/practice title coverage through the quality wrappers for Delivery Software Foundations (9), Automation/Shell (6 source lessons), Configuration Management (6), Continuous Integration (13), Continuous Delivery (10), Docker (15), and Release Engineering (6 core lessons plus 3 release-lab activities and review). Structural matching is not evidence of actually completing learner exercises or visual validation. Corrected the inherited Debian `ansible.builtin.apt`/`docker.io` example in Delivery Configuration Management to the Rocky Linux `ansible.builtin.dnf` baseline (`f8162f8`). Added Docker multi-stage builder/runtime mechanics with explicit portability and missing-process-command warning (`93b3936`).

A branch-scoped GitHub Actions workflow `.github/workflows/curriculum-audit.yml` (`7249371`) was added to run `pnpm install --frozen-lockfile`, `pnpm audit:curriculum`, and `pnpm build` on a GitHub-hosted Node 22 runner, using pnpm 10.26.1. **No workflow run appeared when the commit was checked**, so this is a validation mechanism, not a passing result; inspect Actions configuration, branch-workflow triggering and CI evidence before approving changes.

The 133-module inventory remains a progress checklist, not a certification. A large share of modules still requires substantive lesson-by-lesson review; source inspection alone cannot validate the learner runtime, lab infrastructure, generated pages, or final build. Keep this limitation visible in Issue #314.

## Review batch 27 — Build confirmation and Delivery rollback

User reports a successful local build on the working branch. Record this as **user-reported `pnpm build` success**, not independently observed assistant execution; the exact commit and whether `pnpm audit:curriculum` was run are not established. In the Continuous Delivery rollback lesson, commit `25c7988` adds an explicit decision trace for application image rollback when schema versions coexist, including asynchronous publisher/consumer compatibility, client-level recovery verification and when forward repair is required. Continue individual activity review; successful compilation alone does not establish pedagogical quality or completed curriculum coverage.

## Review batch 28 — Blue-green rollback boundary

Inspected Continuous Delivery's Blue-Green teaching and associated practical contract. Commit `c1dcd3b` adds a concrete sequence of direct candidate verification, traffic switch, observed client verification, failure detection, route reversal and shared-database/external-event caveats. It avoids conflating duplicated application processes with independent persistent state. Automated audit and rendered inspection are not yet independently verified after these commits.

## Review batch 29 — Canary and feature flags

Inspected the Continuous Delivery canary and feature-flag reading/practical pairs. Commit `9d71e56` adds an evidence-limited 5%-traffic/ten-request example explaining why zero observed errors cannot justify promotion, and a reversible feature-activation example that explicitly excludes irreversible data/external effects. The practical contracts already require a defer decision when traffic/observability is insufficient and flag ownership/removal conditions. This is content remediation, not evidence of production canary execution. User-reported earlier successful build predates this edit; curriculum audit and current build remain unverified.

## Review batch 30 — Delivery shell and Ansible executable evidence

Compared the Delivery Engineer Ansible Fundamentals connectivity snippet with its immediately subsequent Inventory example. The teaching used the nonexistent `steward_hosts` group while the demonstrated inventory names `steward_api` and `ci_runners`; commit `fb8fce1` aligns command group and explicit `inventory.ini` filename. In Shell Pipes/Exit Codes, commit `0f43547` supplies a self-contained producer-failure pipeline demonstration with expected exit-status output (0 without pipefail, 1 with pipefail), before introducing network/JSON dependencies. The Make lesson previously referenced project-specific scripts without demonstrating the order; commit `9b88e4c` adds a minimal executable Makefile and expected output while explicitly distinguishing orchestration demonstration from real project validation.

**Validation:** these are source edits on the existing audit branch and postdate the user's last reported successful build. Local execution, application build and rendered activity behavior on the new commits are not yet evidenced.

## Review batch 31 — CI cache and Nexus dependency authority

Reviewed the CI Caching lesson and the Artifact Supply Chain public-proxy activity. Commit `a210f5a` adds a warm-cache versus clean-runner failure diagnosis, requiring missing inputs be declared rather than silently preserved in mutable workspace state. Commit `4a066b7` adds a dependency-confusion scenario showing that Nexus group/proxy caching is not equivalent to authority for an internal package and requires source, namespace, version and checksum verification. Further lesson-level curriculum review, learner execution, render validation and post-change build evidence remain pending.

## Review batch 32 — Artifact retention and quality-gate decisions

Inspected Delivery Artifact Supply Chain's retention exercise and the CI Quality Gates lesson. Commit `5bf5ce1` introduces a concrete release-in-use scenario that prevents age-only cleanup from deleting a still-deployed or rollback-required image and makes dependency retention/retrieval explicit. Commit `3459d22` traces a mandatory failing authorization test, rejecting promotion despite a green build, and differentiates a controlled release-scoped exception from silently weakening future policy. Source edits remain unverified in current build and rendered lessons; user-reported earlier build predates these commits.

## Review batch 33 — SBOM-to-deployment interpretation

Inspected the Software Bill of Materials lesson and practical. Commit `77443c4` adds a worked trace from image digest A and component X version 1.2 to an advisory, explicitly separating component presence from exploitability and release-B state. The lesson now requires correlating artifact identity, affected-version information and actual deployments rather than treating an SBOM or scan result as a verdict. This source edit is not a verified learner execution or current build result.

## Review batch 34 — Artifact Supply Chain source inventory

Inspected all 25 authored Artifact Supply Chain lesson specifications: repository roles and architecture; Python/npm/OCI distribution; Nexus setup and permissions; producer/consumer mechanics; cache, version and retention policy; provenance, SBOM, signing, scanning; and two integrated labs. Each spec supplies a reading with sections, a practical task and a knowledge check. This is source-content coverage only, not successful execution of its lab.

Commits `ff06a3b` and `40ef07a` improve Python-package publication prerequisites/results and immutable image-digest handoff. Prior batches remediated proxy authority, deployed-artifact retention, and SBOM interpretation. Remaining: live Nexus/configuration tests, package-publish and clean-consumer tests, security failure exercises, UI inspection, latest audit/build. Do not represent source review as operational completion.

## Review batch 35 — Artifact practical contracts and canonical CI source

Artifact Supply Chain source audit found that **all 25 distinct practicals inherited the same generic objective, deliverables and completion criteria**, even where their operational learning goals were unrelated. Commit `1b3d3bd` replaces this one-size-fits-all contract with 25 subject-specific objectives, evidence deliverables and acceptance criteria. It preserves original subject-specific exercise instructions and explicitly respects the decision not to invent `steward-common` unless a real package and consumers exist. This resolves a substantive practical-assessment-quality gap, not merely prose polish.

The CI container-build reading also taught a GitHub Actions YAML example despite GitLab CI/CD being TSA's chosen delivery platform. Commits `d39a591` and `eb9f99c` replace it with a GitLab job dependency illustration and fix the TS string escaping. Runner/Docker access, check-script availability, publishing and registry digest recording are identified as separate prerequisites or subsequent steps. These edits require fresh `pnpm audit:curriculum`, `pnpm build` and rendered lesson validation; no post-change build success has been observed.

## Review batch 36 — Curriculum audit regression guards

Added `32b5a0d` to `scripts/audit-curriculum-integrity.mjs`. The audit now checks that every one of the 25 Artifact Supply Chain source lessons has exactly one subject-specific practical contract (no missing or orphan mapping) and that the Delivery CI container-build walkthrough uses canonical GitLab CI/CD rather than GitHub Actions. The contract matching was inspected against current source: **25 lesson IDs and 25 matching contracts, zero missing or orphan keys**. This is a source-level static check only; the full audit script and build have not been executed by this assistant after these commits.

## Review batch 37 — Cross-school worked examples and syntax honesty

Broadened review beyond Delivery Engineer into Architect, Reliability Engineer and Quality Steward. `a9d1386` adds a port-and-adapter implementation change trace to Architect Hexagonal Architecture; `06b370b` adds a falsifiable, bounded dependency-failure scenario with baseline, perturbation, observable queue behavior and recovery expectations to Reliability Fault Injection. In Quality Java Test Engineering, the shared lesson renderer labeled Maven CLI code as Java. Commit `d235b1e` makes Maven-lifecycle examples shell-language blocks while keeping real Java snippets in Java. This is an honest syntax and readability correction; it does not establish complete cross-school audit sign-off.

## Review batch 38 — Inventory completeness and rendered Supply Chain contracts

Compared the logical curriculum module checklist with runtime-kernel source files and Delivery Engineer path wiring. **The checklist omitted the actually wired `delivery-artifact-supply-chain-quality` path**. Added it to Delivery Engineer, increasing the logical checklist from 133 to **134** entries. The runtime source tree contains additional `*-deep`, `*-rich` and `*-quality` files backing those logical modules; do not mistake source-file count for a count of independent school modules.

All 25 supply-chain lesson specifications are present. The actual learner-facing pipeline overrides **23 normal practicals with subject-specific quality profiles** and leaves the two integrated labs with source-level contracts. Verified title correspondence: 23 matching profiles, zero missing or orphan titles. Commit `0899d66` now enforces profile-to-lesson parity and ensures the inventory includes the wired module; `b245249` repairs the inventory. The source-level module audit is complete, but operational Nexus/package exercises and rendered UI checks are not. The broader 134-module content audit is not yet complete.

## Review batch 39 — Delivery quality-wrapper parity

Verified exact reading/practical profile title matches for six other Delivery Engineer quality modules: Software Foundations 9/9, Docker 15/15, CI 13/13, Continuous Delivery 10/10, Configuration Management 6/6 and Release Engineering 6/6. Along with Artifact Supply Chain's 23/23, **82 normal lesson title/profile pairs** now have verified coverage; standalone shell, schema, migration, integrated labs and milestone use other structures and are not counted in this metric. There were no missing or orphan profile titles among the six pairs. Commit `61fd905` adds enforceable static parity checks for these six wrappers so future title changes cannot silently drop exercise enrichment. This guards curriculum wiring, not the teaching quality or execution success of individual exercises.

## Review batch 40 — Security threat-modeling boundary reasoning

Inspected the Security Steward trust-boundary lesson and practical. Commit `719cfe9` adds a concrete valid-token-but-unauthorized-service-mutation trace across Kong, API authorization and database persistence, including denied and allowed outcome requirements. The change distinguishes identity proof, token checks, and authorization against authoritative ownership policy. It provides a scenario for the lesson's boundary/control matrix; the result is a teaching example and still needs rendered review and current build confirmation.

## Review batch 41 — Virtual networking prerequisite ordering

Revisited the Platform Builder virtualization lesson and fixed a teaching-order regression. The worked guest reachability diagnosis referred to bridging before the lesson explained the bridging mechanism. Commit `1fd08c0` places Bridging before the worked scenario, preserving the NAT → bridging → comparative diagnosis progression. This source-level sequencing correction still requires current audit/build and rendered inspection.

## Review batch 41 — School-level inventory wiring validation

Compared import declarations in Academy and all ten school aggregators against the 134-entry logical lesson-module inventory. All directly imported module sources with `-quality`, `-rich`, `-deep`, `-milestone(s)` or `-decision` suffixes appear in the checklist; no other missing direct school imports were found. The indirect `delivery-artifact-supply-chain-quality` path is independently checked through the supply-chain composition guards. Commit `81acbce` enforces direct aggregator-to-inventory parity in the curriculum integrity audit, preventing recurrence of the previously omitted Supply Chain logical module. This is broad **structural wiring coverage**, not 134 pedagogical approvals.

## Review batch 42 — Cloud TLS and Quality decision-table coverage

Inspected the Cloud certificate lifecycle practical and Quality Steward decision-table example. Commit `00710f6` adds a client-side OpenSSL certificate/SNI/hostname verification walkthrough with an intentional wrong-hostname negative case and machine-specific result interpretation. Commit `57a6229` repairs an incomplete three-condition decision table: all eight binary combinations are now represented, rather than four examples that could be mistaken for exhaustive rule coverage. Both teach observable evidence before claiming system correctness. New source edits require fresh audit/build and learner rendering.

## Review batch 42 — Complete 134-module structural source census

Fetched and inspected the declared source files for **all 134 logical module entries** across the eleven schools, with no missing/unreadable sources. The reproducible reference is `docs/curriculum/source-census.md` (completion commit `65b4de5`), which records each source file and simple literal reading/practical/code/output markers. Its interpretation section explicitly warns that `*-quality` wrappers delegate learning content and factories produce activities dynamically. The source census proves file coverage, not that all rendered lessons have been deeply read or their activities executed. The historical inventory currently has **26 marked** entries and **108 unmarked**; marks represent earlier review tracking, not 25 certified courses. The remaining pedagogical, build, activity-execution and visual checks cannot be closed from this census alone.

## Review batch 43 — Runnable virtual-network evidence

Revisited Platform Builder Virtual Networking from the earlier worked-example remediation. The reading previously mixed guest-local inspection and client-side connection testing in one command block and used angle-bracket pseudo-placeholders such as `ping <gateway>` / `curl http://<ip>:<port>`, which a shell interprets as redirection rather than valid runnable arguments. Commit `f37ec6d` splits guest-side interface/route/socket evidence from client-side HTTP reachability and adds required shell variable checks instead of misleading placeholders. Commit `09d22e5` corrects the embedded TypeScript string quoting. The NAT → Bridging → Worked diagnosis sequence was fixed earlier in `1fd08c0`. No guest/client command results or post-change build have been observed.

## Review batch 44 — Governance metrics interpretation

Reviewed Technical Steward Engineering Health's KPI-vs-KRI learning activity. Commit `ca5d9ef` adds a quantified hypothetical where change lead time improves while the fraction of deployed services with unsupported critical dependencies worsens. The example teaches why a positive delivery-performance trend cannot by itself certify lower technology risk, and explicitly calls for denominator, period, ownership and escalation rules. No observed Steward KPI/KRI figures are asserted. No GitHub Actions workflow run was returned for the newest commit when checked; current automated build/audit and rendered teaching verification remain open.

## Review batch 43 — Shell concept-first sequencing

Revisited the Delivery shell pipeline lesson and found the worked `pipefail` failure trace was presented before the section explaining the underlying pipeline exit-status mechanism. Commit `129dd48` reorders the two blocks so the explanation precedes the executable comparison; commit `18b137f` adds a static curriculum-audit guard against recurrence. Current rendered, audit and build results remain unverified after these source changes.
