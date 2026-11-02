# PED-005 — Delivery Engineer school-wide instructional audit

**Date:** 2026-11-02  
**School:** Delivery Engineer only, [#325](https://github.com/enoqueJonas/tsa/issues/325)  
**Branch:** `curriculum/delivery-engineer-pedagogical-audit` (stacked on Platform Builder [PR #335](https://github.com/enoqueJonas/tsa/pull/335))  
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

## Completion rule

Remediate all 11 paths at source with executable safe examples and failure cases, then advance to Cloud Engineer. Independently scored learner teach-back, visual manual review and production infrastructure are tracked separately; do not let them trigger endless new features within this school.
