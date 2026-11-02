# PED-005 — Delivery Engineer school-wide instructional audit

**Date:** 2026-11-02  
**School:** Delivery Engineer only, [#325](https://github.com/enoqueJonas/tsa/issues/325)  
**Source baseline:** integrated `master` at `9aa7a4c5` (prior Delivery audit PR #337 superseded by #338); current continuation branch `curriculum/delivery-engineer-source-depth-v2`.  
**Status:** IN PROGRESS — not whole-school remediated or learner validated

## Real learner-order inventory

The assembly source is `packages/runtime-kernel/src/paths/delivery-engineer.ts`. It defines **11 paths**, adds a `fieldwork-orientation` lesson to ten directly constructed paths, and injects an additional worked reading ahead of practical activities. These automatically generated teaching wrappers **are not accepted as proof of instructional depth**: the underlying sources, Docker commands, shell scripts, CI YAML, artifact and rollback mechanics must be reviewed independently.

| Order | Canonical path | Source inspection / evidence |
| --- | --- | --- |
| 1 | Software Delivery Foundations | `delivery-software-foundations-quality.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 2 | Automation and Shell | `delivery-automation-shell-deep.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 3 | Containers and Docker | `delivery-containers-docker-quality.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 4 | Continuous Integration | `delivery-continuous-integration-quality.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 5 | Continuous Delivery and Deployment | `delivery-continuous-delivery-quality.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 6 | Configuration Management | `delivery-configuration-management-quality.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 7 | Artifact, Dependency and Supply Chain | `internal-dependency-management.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 8 | Release Engineering | `delivery-release-engineering-quality.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 9 | Production Database Schema Evolution | `delivery-production-schema-evolution-deep.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 10 | CI Platform Migration Exercise | `delivery-migration-exercises-deep.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |
| 11 | Delivery Engineer Milestone | `delivery-engineer-milestone-deep.ts`; actual readings, code, practices, negative paths and prerequisite order to be classified |

## Initial learner-source findings and remediation

**Path 1 — Software Delivery Foundations:** the practices require a real commit-to-image-digest chain rather than trusting a mutable `latest` tag. Authored source review remains in progress; CI green does not prove a real deployed digest.

**Path 2 — Automation and Shell:** existing source has six substantive concepts and an integrative lab. Its strict-mode and pipeline discussion is directionally correct, but a learner should execute a single complete negative example that distinguishes a failed precondition, an upstream pipeline error hidden by a successful filter, a failure revealed by `pipefail` and a mutation that does **not** occur when the precondition fails. Added this focused worked case **inside the pre-existing Pipes, Exit Codes and Failure reading**, without a generated extra lesson or changed progress IDs. Its Bash code is published in `delivery-shell-failure-worked.ts` and `scripts/check-delivery-shell-negative.mjs` runs the **same code** on a disposable local shell with positive and negative assertions. No production deployment or network required.

**Remaining lessons:** this is not a clearance for Docker, containers, CI/CD, release promotion, data migrations or the milestone. Every canonical path must be evaluated. Where real Docker, registry, production-like approvals or homelab are unavailable, mark **UNVERIFIED**, not fabricated PASS.

## Path 1 — Software Delivery Foundations, authored lesson disposition

This review inspects `delivery-software-foundations-deep.ts` directly, not the additional `delivery-engineer.ts` fieldwork orientation or practice-preparation wrappers. The latter may prompt useful investigations but cannot teach a novice the missing concepts. The attached `delivery-software-foundations-quality.ts` practicals are generally concrete, yet assignment specificity **does not compensate for missing prior instruction**.

| Real authored lesson (learner order) | Source disposition at baseline | Actual finding / required remediation |
| --- | --- | --- |
| The Source-to-Production Lifecycle | THIN → TARGETED IMPROVEMENT | Two short authored sections named lifecycle states but gave no runnable artifact evidence or nonzero mismatch gate. Expanded **the existing reading** with exact definitions, commit→CI→artifact→approval→deployment→consumer verification trace, a disposable source-published SHA-256 Python demonstration (success exit 0, changed-bytes exit 23), precise digest limits and an independent scenario. |
| Git Workflows | TARGETED IMPROVEMENT | Already has a concrete blocked authorization regression, but lacks an executed repository integration example and novice explanation of fast-forward/review/branch divergence. |
| Pull Requests and Reviews | THIN | Two abstract sections; lacks a complete example PR diff/evidence review, contradictory result and a merge decision. |
| Earn steward-common Through Two External Consumers | TARGETED IMPROVEMENT | Architecturally sound rejection of fabricated reuse, but the first Python consumer needs a from-zero example and clear distinction between transport and domain logic. |
| Semantic Versioning | THIN | MAJOR/MINOR/PATCH named but compatibility contract, pre-1.0 caveats, API break counterexamples and classification exercise are not taught before the assignment. |
| Conventional Commits | THIN | Three sample messages but no parsing of header/scope/! and no worked BREAKING CHANGE footer or revert decision. |
| Release Notes and Changelogs | THIN | Impact framing correct, but lacks a before/after release note including actionable migration and rollback consequences. |
| Build Artifacts | THIN | Immutable artifact claimed but bytes/digest/provenance and the tag-versus-digest difference are not demonstrated in this lesson. |
| Environment Promotion | TARGETED IMPROVEMENT | Already has a useful UAT/production conceptual trace; needs a concrete admission gate with failure status and runtime verification. |

**Execution evidence for first reading:** `scripts/check-delivery-lifecycle-identity.mjs` extracts the *same Python code* authored in `delivery-lifecycle-identity-worked.ts`, which is appended to the actual Lifecycle reading, and asserts exit 0 for unchanged bytes / exit 23 for deliberately modified bytes. Matching-head GitHub CI and browser evidence remain pending until the workflow completes. This exercise **does not** prove OCI manifest-digest behavior, a running container image, production deployment or novice comprehension.

**Path 1 is NOT complete.** Remaining lessons above require actual teaching remediation, not reassignment of their ratings. No other Delivery Engineer path is cleared by this update.

## Current continuation checkpoint: authored Foundations + Docker

**Software Delivery Foundations path 1:** the original nine teaching readings have been expanded in their actual source file using `delivery-lifecycle-identity-worked.ts` (first reading) and `delivery-software-foundations-enrichment.ts` (remaining eight). This is deliberately different from adding another short intro wrapper. The assembler now uses the nine authored lesson/practice pairs without generated `fieldwork-orientation` or per-practical preparation placeholders for this path. `scripts/check-resolved-practical-contracts.mjs` was changed to reject missing original teaching depth (all nine activities require at least five actual heading sections and a real practice). The published artifact-gate Python has both a successful and a nonzero negative execution test.

**Automation and Shell path 2:** the existing six authored concept readings, practicals and integrative lab are retained; the previously added exact Bash pipeline/pipefail and guarded mutation regression on `master` is the focused runtime proof. A complete real-learner review and any environment-specific Steward automation remain separate.

**Containers and Docker path 3:** direct source read-through covered the fifteen teaching readings in `delivery-containers-docker-deep.ts` plus the attached realistic practices in `delivery-containers-docker-quality.ts`. The original readings are uneven; the well-motivated examples in VM/container boundaries, images and layers, Dockerfiles, build context, multi-stage trade-offs, volumes, networking, Compose and health checks are retained, not rewritten for cosmetic word counts. Five concrete gaps received added mechanisms and worked diagnostic cases *inside* their original readings in `delivery-docker-operational-depth.ts`:

| Docker authored lesson | Original source diagnosis | Current source action / remaining evidence |
| --- | --- | --- |
| Containers versus Virtual Machines | TARGETED | Existing guest/kernel/container failure-layer example retained; physical-host observation UNVERIFIED |
| Namespaces and cgroups Concepts | TARGETED | Added exact namespace vs cgroup explanation, disposal-safe inspection commands, cgroup-v1/v2 expectations and failure transfer; real daemon execution UNVERIFIED |
| Docker Architecture | THIN | Added client → daemon → containerd/runtime control path, read-only endpoint diagnosis and permission versus application failure cases; real daemon UNVERIFIED |
| Images and Layers | TARGETED | Existing Dockerfile cache invalidation walkthrough retained; reproducible build measurements UNVERIFIED |
| Writing Dockerfiles | TARGETED | Existing non-root signal/exec-form explanation and illustrative Dockerfile retained; actual clean Steward build UNVERIFIED |
| Build Context | TARGETED | Existing .dockerignore mechanism/example retained; local-secret exclusion test UNVERIFIED |
| Multi-stage Builds | TARGETED | Existing compatible builder/runtime example retained; actual stage build and native-library compatibility UNVERIFIED |
| Volumes | TARGETED | Existing disposable BusyBox volume recreate example retained; actual host data survival and backup proof UNVERIFIED |
| Container Networking | TARGETED | Existing listener, service DNS, host port and firewall boundary example retained; actual topology proof UNVERIFIED |
| Docker Compose | TARGETED | Existing startup versus database readiness walkthrough retained; full Steward Compose stack UNVERIFIED |
| Health Checks | TARGETED | Existing live versus ready distinction retained; database-outage negative probe UNVERIFIED |
| Container Registries | THIN | Added OCI tags, manifest versus platform digest, remote registry authorization and approval trace; real push/pull UNVERIFIED |
| Image Tags and Versioning | TARGETED | Existing moved-tag A/B example retained; registry digest comparison UNVERIFIED |
| Image Optimization | THIN | Added measured cold/warm build, dependency input/cache invalidation, size-vs-startup trade-offs; live timings UNVERIFIED |
| Container Debugging | THIN | Added first-failing-boundary decision tree, read-only Docker commands and an illustrative listener/bind-address incident; live failure/recovery UNVERIFIED |

This source correction is **not** whole-path approval from just five targeted supplements; the other authored readings and realistic multi-service lab must be checked in a proper disposable Docker environment, and independent learner transfer remains pending. The school has eleven paths; paths 4–11 have not yet been cleared. Preserve source quality and move through actual learner order rather than repeatedly reworking hypothetical corner cases.

**Latest branch head:** matching CI / scripted browser traversal requires checking the final code-and-documentation commit after changes; do not reuse earlier green checks for a newer head. Independent rendered-depth judgment, enterprise infrastructure and uncoached learner transfer are NOT VALIDATED.

## Path 4 — Continuous Integration learner-order source pass

Inspected the real `delivery-continuous-integration-deep.ts` reading source, all **13 authored concept lessons** and the integrated lab, with practical expectations in `delivery-continuous-integration-quality.ts`. Existing generic path orientation/pre-lab preparation remains visible in the assembler and is **not** counted as substantive teaching.

| Authored lesson | Baseline | Corrective evidence / limitation |
| --- | --- | --- |
| CI Pipeline Architecture | THIN | Expanded a precise event → commit → runner → checks → outputs → enforced policy model, contrasting merge-check evidence with promotion and runtime verification |
| Jobs, Stages and Dependencies | TARGETED | Retained correct conceptual dependency graph and added **source-published executable Python** fail-closed local job simulation; unit check failure returns **17**, blocks image-build and publish |
| GitLab Runners and Execution Infrastructure | TARGETED | Expanded executor identity, job scheduling, secret privileges and compromised runner response |
| GitHub Actions and GitLab CI/CD | THIN | Added behavior-migration comparison (triggers, nonzero failures, credentials, exact artifacts); GitLab remains authoritative |
| Self-hosted Runners | THIN | Added host/executor trust map, recovery from secret exposure, disk and identity management |
| Caching | TARGETED (retained) | Existing declared-input/cold-path negative case is meaningful; actual clean GitLab Runner still UNVERIFIED |
| Pipeline Artifacts | TARGETED (retained) | Existing origin-linked artifact versus cache behavior retained; real transfer into build/publish UNVERIFIED |
| Secrets and Variables | THIN | Added protected-ref/permission and masking-limits explanation, unsafe log/artifact negative example, credential response |
| Parallelism | THIN | Added dependency-critical-path versus runner saturation example and shared-database contention failure |
| Automated Checks | THIN | Added oracle/risks framework and precise false-green omitted-test example |
| Test Stages | THIN | Added unit/component/integration/end-to-end boundaries, PostgreSQL outbox failure and evidence interpretation |
| Quality Gates | TARGETED (retained) | Existing authorization-regression gate and justified exception already teach a decision, not a generic checkbox |
| Building Containers in CI | TARGETED (retained) | Existing `.gitlab-ci.yml` example explicitly says it builds only and does not publish; true image/registry behavior requires homelab CI proof |

The published `ciDependencyPython` snippet is in `delivery-ci-dependency-worked.ts`, attached to the actual Jobs, Stages and Dependencies reading and executed by `scripts/check-delivery-ci-dependency.mjs`. Its positive and negative paths prove the **modelled** dependency decision only; no GitLab pipeline or image publish is simulated as having run. Full runtime GitLab Runner, Nexus upload, proper protected job scheduling, independent novice transfer and human rendered-depth judgment remain **UNVERIFIED**. All existing learner IDs preserved. CI is a **source pass** rather than an infrastructure certification.

**Next learner-order path is 5 — Continuous Delivery and Deployment; paths 5–11 remain outstanding.** Do not call the school REMEDIATED or VALIDATED based on this partial pass. Matching-head automated workflow must be confirmed after these source/doc changes.

## Paths 5–6 — continuing source-level audit (not closed)

### Path 5 — Continuous Delivery and Deployment

Read the ten original concept lessons in `delivery-continuous-delivery-deep.ts` and the authored four-activity deployment/rollback lab, with related practical contracts in `delivery-continuous-delivery-quality.ts`. Five thin-to-targeted lessons now have original-reading content in `delivery-cd-operational-depth.ts`: CI vs continuous delivery vs continuous deployment (explicit decision contract and timeline), environment management (schema/config/secret/data boundaries), deployment automation (precondition→rollout→client verification→recovery), release approvals (immutable candidate/risk ownership) and rolling deployments (actual replication, health gating, mixed-version message incompatibility). **No new nominal introductory wrapper was added; original IDs remain stable.**

| Original authored lesson | Source disposition / evidence |
| --- | --- |
| CI vs Continuous Delivery vs Continuous Deployment | THIN → TARGETED: operational definitions, three distinct completion gates, classified transfer |
| Environment Management | THIN → TARGETED: artifact versus environment inputs, schema mismatch and async topology limitations |
| Deployment Automation | THIN → TARGETED: concrete admission/precondition/run/verify/recovery, digest mismatch BLOCK decision |
| Release Approvals | THIN → TARGETED: evidence-bound approval, rejection and exception scope |
| Database Migrations During Deployment | TARGETED, existing expand/backfill/contract and rollback safety material; real migration rehearsal unverified |
| Rollback | RICH, already has worked schema-coexistence and three-role recovery case; retained |
| Rolling Deployments | THIN → TARGETED: capacity/readiness/mixed-version and single-node deferral |
| Blue-Green Deployments | RICH, existing traffic-switch and shared-data rollback limitations; retained |
| Canary Deployment Concepts | TARGETED, existing small-sample false-confidence case; no real production traffic claim |
| Feature Flag Concepts | RICH, already describes activation failures, owners and cleanup; retained |

**Not run:** GitLab deployment to a disposable Rocky/Compose environment, real registry pull, managed approval, real schema migration or rollback. These are environment-specific and not justified by source-only checks. The lesson source is more complete, but the full practical recovery contract and real learner transfer remain unverified.

### Path 6 — Configuration Management

Direct source `delivery-configuration-management-deep.ts` has six authored readings plus a substantial Ansible lab, and includes drift, desired state, Ansible fundamentals, inventory, playbooks and roles. A **demonstrated prerequisite-order defect** was found: the first Ansible Fundamentals code block invoked `ansible -i inventory.ini steward_api` before the following Inventories lesson defined any usable `inventory.ini` or required SSH identity. The first reading now supplies a self-contained disposable **localhost inventory** and expected `ansible.builtin.ping` result (`pong`, not ICMP), contrasts a no-matched-host case, then explicitly labels the original remote host commands as a preview until the next lesson. It also clarifies package presence versus cache refresh and that idempotency requires observed changed-state evidence.

Source disposition: Configuration Drift **TARGETED** (diagnosis scenarios but no live repair); Desired State and Idempotency **TARGETED** (correct mechanism, real convergence not run); Ansible Fundamentals **THIN → TARGETED** (prerequisite corrected); Inventories **TARGETED** (clear topology, authorized host mapping needed); Playbooks **TARGETED** (correct state/handler examples, live execution not run); Roles Concepts **THIN** (structure taught but from-zero role creation, handler wiring and failure are still too compressed). Existing full multi-host lab remains **UNVERIFIED** without authorized Ansible nodes. Do not count an Ansible syntax example as a successful convergence proof.

**Remaining school sequence:** finish any required concrete Configuration Management source gaps, then assess Path 7 Artifact/Dependency/Supply Chain, 8 Release Engineering, 9 Production Schema Evolution, 10 CI Platform Migration and 11 Milestone in order. Uncoached learner validation stays separate from this audit; do not close #325 or mark this school VALIDATED.

## Paths 7–11 — school-wide authored-source findings

### Path 7 — Artifact and Dependency Supply Chain

Reviewed the 23 topic-level reading/practice/reflection specs and two integration labs in `delivery-artifact-supply-chain-deep.ts`, with the richer per-title expectations from `delivery-artifact-supply-chain-quality.ts` and the source/package prerequisites from `internal-dependency-management.ts`.

**Contradiction fixed:** the Python distribution practical falsely asserted that `steward-cli` and `steward-release-check` already existed as two independent consumers and that `steward-common` therefore **must** be created. The npm publication/consumption and internal-versioning practicals likewise assumed production shared packages existed. These four practicals now accept **either** a real earned package (if independent consumer evidence exists) **or** a clearly labeled disposable teaching fixture, while prohibiting claims that a fixture is a Steward dependency. This restores consistency with the earlier conditional extraction gate and the milestone. The pip example no longer hardcodes a possibly nonexistent `steward-common==1.2.0`; it takes `PACKAGE_SPEC` and requires an approved Nexus index. A tag/digest inspection sample no longer assumes RepoDigests[0] exists on a locally built image.

**Concept-remediation targets inside original readings:** `delivery-supply-chain-depth.ts` adds concrete trust/negative cases for (1) public versus private dependency resolution, (2) hosted/proxy/group authority, (3) Nexus placement, persistent metadata and restore, (4) role-based registry permissions and credential revocation, and (5) prerelease promotion without mutating artifact bytes. Existing detailed worked examples of private Python/npm/OCI publication, package versioning, retention of deployed rollback digests, provenance, SBOM, signature limitations and scanner triage were retained.

**Still UNVERIFIED:** real Nexus installation, storage restore, private TLS, hosted/group resolution and dependency-confusion negative test, actual source→OCI digest pull, role-denied publication, clean package installs, generated SBOM and signed provenance. This path is not certified by tests of TS lesson structure alone.

### Path 8 — Release Engineering

Source includes six substantive authored concept readings, a four-part integrated release lab and a review; critically, `delivery-release-engineering-quality.ts` **overlays the otherwise generic `Apply:` practicals with six distinct title-specific scenarios**. Read the actual enriched practicals before labeling them repetitive. Retain the verified teaching distinctions: candidate vs approved release vs deployment vs observed runtime; immutable digest/correct registry identity; stopped promotion on mismatch; data rollback versus application rollback; before/after client verification; exercised runbook. **Real** release, recovery and independent handoff evidence remains UNVERIFIED. No cosmetic expansion added.

### Path 9 — Production Database Schema Evolution

One dense foundational reading and five subsequent practice/reflection activities already teach expand → compatible coexistence → bounded restartable backfill → switch → safe contract, concurrency guards and lost rollback windows. A real defect in the initial SQL demonstration was corrected: a missing `customers` table and display-only escaped newlines made it non-standalone. The reading now publishes a **transactional, disposable PostgreSQL fixture** using `CREATE TEMP TABLE`, expansion, synthetic backfill, missing count **2 → 0** and `ROLLBACK`. `scripts/check-delivery-schema-expansion.mjs` extracts this exact authored SQL, executes it in the existing PostgreSQL CI job and asserts both counts. **Green matching-head CI required** before claiming this executed successfully. Real rolling database load, backfill interruption and production-scale locks remain UNVERIFIED.

### Path 10 — CI Platform Migration Exercise

One authored reading, practical and review already distinguish job syntax from verified semantic equivalence. The example makes GitLab the canonical target, requires equivalent successful/negative runs and one authoritative publisher during cutover, and **explicitly allows a fictional legacy Jenkinsfile as a labeled fixture if no actual Jenkins exists**, preventing another fabricated infrastructure dependency. Existing source is adequate for the conceptual/fixture exercise; a real two-platform cutover remains UNVERIFIED and must never be claimed when only the fixture ran.

### Path 11 — Delivery Engineer Milestone

Eight detailed milestone units (brief; gates for source/artifacts, infrastructure, promotion, runtime verification, failure/recovery and handoff; exit review) already demand exact digest and three process roles, real GitLab Runner and Nexus evidence, authorized vs forbidden API paths, outbox→RabbitMQ consumer completion, an immutable rollback target and no duplicate publishing platform. The milestone correctly makes `steward-common` conditional on genuine extraction, not a compulsory artifact. Keep these real pass/fail requirements instead of creating another broad review checklist. No actual learner homelab release or unaided handoff has been observed: NOT VALIDATED.

### Quality judgment across the eleven-path school

Every path has been read at the **source-content and practical-contract level**, and concrete contradictory prerequisites and generic teaching gaps have been corrected. However:

- **Automated structural / source-example evidence:** updated TS lesson sources, exact Python allow/block controls and the new PostgreSQL source-derived check require final matching-head pipeline success.
- **Source-level instructional depth:** concrete mechanisms, negative paths and independently transferable decisions are now present across inspected areas, but source review cannot establish that the rendered experience feels comprehensive to a novice; generated orientation/preparation wrappers still exist on paths 2–11 and are not counted as substantive lessons.
- **Learner-validation lane:** actual Docker/Nexus/GitLab/Ansible/Steward stack exercises, rendered-lesson depth reviews, uncoached novice explanations and recovery demonstrations are still outstanding. Do not mark the Delivery Engineer school learner-validated or close #325 merely on code and CI.

**Merge policy:** PR #339 stays **draft** until its final head passes the full workflow and the source changes are reviewed; final learner validation may remain separately open, explicitly named and evidence-backed. Next human step after a green build: run the rendered Delivery Engineer school end to end with real learners and an isolated homelab, recording failure cases and teaching gaps by exact lesson ID.

## Completion rule

Remediate all 11 paths at source with executable safe examples and failure cases, then advance to Cloud Engineer. Independently scored learner teach-back, visual manual review and production infrastructure are tracked separately; do not let them trigger endless new features within this school.
