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

## Completion rule

Remediate all 11 paths at source with executable safe examples and failure cases, then advance to Cloud Engineer. Independently scored learner teach-back, visual manual review and production infrastructure are tracked separately; do not let them trigger endless new features within this school.
