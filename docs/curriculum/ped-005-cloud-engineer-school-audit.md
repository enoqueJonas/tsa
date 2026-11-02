# PED-005 — Cloud Engineer school-wide pedagogical audit

**Date:** 2026-11-02  
**School:** Cloud Engineer only; [issue #324](https://github.com/enoqueJonas/tsa/issues/324), depth-reset [#318](https://github.com/enoqueJonas/tsa/issues/318).  
**Branch:** `curriculum/cloud-engineer-source-depth-v1`, created from Delivery Engineer source-remediation merge `186059364`.  
**Acceptance:** structurally complete ≠ source instruction remediated ≠ rendered/human learner validated.

## Full learner-order source inventory (11 paths)

The entrypoint is `packages/runtime-kernel/src/paths/cloud-engineer.ts`. Its generic `teachCloudPath` prepends a one-page model to each path and a summary before each practical; these **are NOT teaching-depth evidence**. Actual authored sources and `*-quality.ts` practical overlays must be assessed instead. Current ratings below are **source triage**, not an assertion that independent beginners mastered the topic.

| Order | Path | Actual authored sources | Source inventory and first judgement | Remediation / remaining proof |
|---|---|---|---|---|
| 1 | Cloud and Hosting Models | `cloud-hosting-models-deep.ts`, `cloud-hosting-models-quality.ts` | Six concept readings + lab; differentiated IaaS/PaaS/SaaS, responsibility, region/zone, elasticity and costs. TARGETED source review | Check complete worked cost comparison and no cloud-account assumptions before required exercises; no human learner proof |
| 2 | VPS Operations | `cloud-vps-operations-deep.ts`, `cloud-vps-operations-quality.ts` | Eight readings + lab on provisioning, SSH, provider firewall, OS patching, snapshots and recovery. TARGETED source review | Validate command preconditions, emergency access, SSH failure recovery and actual authorized disposable VPS execution |
| 3 | Internet Networking | `cloud-internet-networking-deep.ts`, `cloud-internet-networking-quality.ts` | Ten readings + lab separating address scope, DNS, routing, TLS, proxy, ingress and firewall. TARGETED source review | Trace one real client request from DNS through TLS/SNI to Steward and execute negative DNS/TLS/proxy failures |
| 4 | Certificate Lifecycle | `cloud-certificate-lifecycle-operations-deep.ts` | Five operational activities + review and introductory trust-chain mechanics. TARGETED | Confirm from-zero certificate-chain interpretation, renewal versus actual proxy reload and expiry-negative evidence |
| 5 | Cloud Building Blocks | `cloud-building-blocks-deep.ts`, `cloud-building-blocks-quality.ts` | Twelve separate service-family readings + lab with compute, block/object storage, networking, IAM, managed database and recovery. TARGETED | Verify concrete account/provider differences and prerequisites; do not turn service catalog into architecture by labels |
| 6 | Object Storage | `cloud-object-storage-implementation-deep.ts` | Five substantial activities, including boundaries for object keys, ETag, versioning and presigned access. TARGETED | Verify object identity/checksum, denied access, real storage policy and recovery on disposable backend |
| 7 | Infrastructure as Code | `cloud-infrastructure-as-code-deep.ts`, `cloud-infrastructure-as-code-quality.ts` | Sixteen actual source readings + lab; covers OpenTofu, state, locking, import, partial apply, drift, remote state, secrets and teardown. TARGETED | Execute no-credential local plan + negative state/replace case and verify plan's limits; do not assert plan means service healthy |
| 8 | Kubernetes, OpenShift and GitOps | `cloud-orchestration-gitops-deep.ts`, `cloud-kubernetes-foundations-worked.ts` | Sixteen concept readings and four-part migration milestone. Initial source census found **almost no commands or runnable manifests across the first fifteen concepts**; introductory definitions alone did not let a novice independently trace reconciled scheduling. THIN → IN REMEDIATION | Twelve original lessons now teach container→cluster problem, API/controller/scheduler/kubelet trace, disposable kind setup, complete Nginx Deployment, labels/readiness/resources, Pod replacement, complete ClusterIP Service and EndpointSlice/port-forward verification, plus negative image and mismatched-selector cases. Original IDs preserved; no generic wrapper for this path. Remaining original lessons (Service, DNS, NetworkPolicy, storage, RBAC, OpenShift, GitOps, Argo CD) require safe inspectable examples and negative execution. **No kind/OpenShift cluster was run.** |
| 9 | Progressive Delivery with Canary Releases | `cloud-progressive-delivery-canary-deep.ts` | Single deep concept reading and five staged activities: statistical evidence, baseline, Argo Rollouts vs Argo CD, abort, state rollback limits. TARGETED | Need actual bounded traffic/analysis, low-sample inconclusive branch and dependency proof; do not assert canary safety from ten requests |
| 10 | Cloud Architecture and Cost | `cloud-architecture-cost-deep.ts`, `cloud-architecture-cost-quality.ts` | Twelve decision readings + lab: availability, resilience, cost units, RPO/RTO, budgets, right-sizing and hybrid boundaries. TARGETED | Require grounded cost units/prices from actual provider and controlled recovery; a generic score is not enough |
| 11 | Cloud Engineer Milestone | `cloud-engineer-milestone-deep.ts` | Integrated internet environment and evidence gates, including external request and recovery. TARGETED | Never claim full internet reachability, ingress, TLS, data persistence or cost accounting without deployed real end-to-end verification |

## First remediation checkpoint: Kubernetes foundations

**Evidence from actual authored reading:** `cloud-kubernetes-foundations-worked.ts` supplies targeted new sections for twelve existing lessons, not a generic appendix. It establishes vocabulary and boundaries before commands, an isolated `kind-tsa-ped005` context, a complete two-replica nonproduction Deployment, readiness/resource declarations, a controlled Pod-replacement observation, a separately declared Service with selected endpoints and a deliberately empty-selector Service. It explains why the Nginx image tag is not an approved immutable Steward artifact and why reconciliation does not imply application health or genuine node-failure high availability.

**Source validator (expanded to twelve covered lessons):** `scripts/check-cloud-k8s-lesson-source.mjs` extracts the exact published YAML, parses it using Python/PyYAML, checks Deployment selector-to-template labels, readiness, resources, replica count, healthy/empty Service selectors, intentionally unschedulable Pod, unbound PVC, deliberately failing readiness probe, namespaced RBAC allow-only rules and an illustrative OpenShift Route. It does not execute any cluster. This checks a teaching fixture and its wiring, **not a running Kubernetes cluster**.

**Wrapper correction:** the Cloud entrypoint no longer inserts a shallow generated path orientation and preparation activities before each real Kubernetes reading/practical. `scripts/check-resolved-practical-contracts.mjs` requires the 16 original teaching readings + milestone, their corresponding original practical and transfer reflection, without treating wrappers as substantive evidence.

**Required next steps in learner order:** finish real exercised termination/eviction and rollout-capacity examples, GitOps/Argo CD, and the OpenShift migration lab; then validate the rendered lesson sequence. The first twelve concepts now have additional source teaching, but the full school includes other Cloud paths and environment-dependent labs. Include from-zero commands with expected observations, negative cases, safe disposal, source-derived checks and a separate real-cluster evidence ledger. Continue other Cloud paths **within this school** before switching to Reliability or another school.


### Additional K8s source work (concept lessons 5–14)

Added directly to the authored lessons, without creating a separate generic overview: unschedulable Pod from impossible node selector; cluster DNS lookup while explicitly refusing to claim kind's default CNI enforces NetworkPolicy; a deliberately unbound PVC and correct boundary to backup/recovery; fake ConfigMap/Secret dry-run and environment-variable reload caveat; Running-but-not-Ready Pod with deliberately bad readiness probe; namespace-scoped read-only ServiceAccount/Role/RoleBinding and denied delete; OpenShift platform-only `oc` read-only introspection; illustrative OpenShift Route with TLS edge termination and SCC/Operator trade-offs. All shell examples state prerequisites and use a named disposable context or fail closed on missing OpenShift target information. No real cluster was run by this audit.

**Still requiring source-level coverage:** graceful termination and disruption, node pressure/eviction/rollout capacity, GitOps authority transfer, Argo CD drift and its operational recovery; existing conceptual source is substantial, so any further code must earn its place. Real OpenShift SCC/Routes and any NetworkPolicy deny proof remain UNVERIFIED.

## Truth-in-evidence gates

- Structural CI and Playwright browser traversal: **pending on this new branch**.
- Source-authored manifest YAML check: **pending new branch CI**. Exact manifest parser is a useful safety net, not Kubernetes execution.
- Real kind Kubernetes and enterprise OpenShift environment: **UNVERIFIED**; no cluster access was used by this audit.
- Manual rendered-page instructional depth, progress re-entry, independent teach-back and genuine lab completion: **UNVERIFIED**.
- Cloud Engineer status: **SOURCE AUDIT IN PROGRESS; NOT LEARNER VALIDATED**. Issue #324 must remain open.
