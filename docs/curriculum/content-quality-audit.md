# TSA Content Quality and Enterprise Alignment Audit

## Purpose

This audit records the completion of the first curriculum-wide **Content Quality and Enterprise Alignment baseline pass**. It does not mean TSA is frozen or that every future learner will experience every lesson perfectly. It means the current curriculum has been reviewed against the standards established after Build Deep and the known structural gaps have been implemented or explicitly converted into evidence-based decision gates.

The continuing rule remains: future learner evidence may justify targeted repairs. Strong content should not be rewritten merely for stylistic uniformity.

## Baseline outcome

**Build Wide: complete.**  
**Build Deep: complete.**  
**Content Quality baseline pass: complete.**  
**Enterprise capability alignment baseline: complete.**

The curriculum now has a coherent progression from engineering reasoning through application development, systems thinking, platform operation, delivery, cloud/platform engineering, quality, security, reliability, architecture, governance and independent professional engineering.

## Content-quality standard applied

The baseline pass used the following guardrails:

- preserve strong authored teaching rather than rewriting it wholesale;
- remove or replace generic engineering-practice scaffolds when they flatten distinct capabilities into the same exercise;
- allow implementation helpers in code when lesson questions, practice, evidence and completion criteria remain capability-specific;
- use Steward as the continuing system where that creates authentic continuity;
- do not force Steward to absorb architecture or infrastructure solely to satisfy a curriculum topic;
- include failure, uncertainty or an alternative where it exposes something meaningful;
- require evidence that proves the capability being claimed;
- reduce scaffolding as the learner advances so later schools demand independent judgment.

## School-level status

### 01 — Engineering Apprentice

The school remains the reasoning foundation for the journey. Its investigation, systems-thinking, trade-off, debugging, evidence and communication practices are intentionally broader than product implementation and establish the evidence-first vocabulary reused later.

**Status: preserve.**

### 02 — Builder

Builder received the first full Content Quality pass. Programming with Python, Web/API, Django, PostgreSQL and Software Craft were deepened where practical work had become repetitive. Identity/authorization and the Steward API milestone were already comparatively strong and were preserved.

The internal dependency thread was retained: genuinely reusable concerns may become `steward-common`, but only when a defensible reuse boundary exists.

**Status: baseline complete.**

### 03 — System Thinker

Requirements, boundaries, modeling, components/dependencies, data flow, failure modes and architecture decisions received content-quality treatment. Distributed-state and messaging reasoning was added so Redis/RabbitMQ/Kafka-related infrastructure appears only after the learner understands caching, asynchronous communication, delivery semantics, idempotency, dead-lettering, ordering and eventual consistency.

The obsolete generic lesson scaffold was removed from the school orchestrator after all active paths were backed by authored modules.

**Status: baseline complete.**

### 04 — Platform Builder

Platform Builder was aligned to the enterprise-Linux path using Rocky Linux with RHEL-family operational concepts while preserving transferable Linux knowledge. Networking, virtualization and homelab work were deepened around evidence-driven troubleshooting and controlled access/exposure.

**Status: baseline complete.**

### 05 — Delivery Engineer

Delivery Engineer was aligned around one strong enterprise implementation per capability: Jenkins for CI/CD orchestration, Ansible for configuration management, Docker/OCI concepts for containers, and the Nexus-style private artifact/dependency platform for internal packages and images.

The obsolete generic lesson scaffold was removed after authored content-quality paths became authoritative.

**Status: baseline complete.**

### 06 — Cloud Engineer

Cloud Engineer was aligned around budget-conscious enterprise capabilities: OpenTofu/Terraform concepts, Kong, Kubernetes, OpenShift and Argo CD/GitOps. The curriculum distinguishes reverse proxy, load balancer, API gateway, ingress and application responsibilities and keeps domain authorization inside Steward.

The obsolete generic Cloud lesson scaffold was removed after all active paths were backed by authored content-quality/deep modules.

**Status: baseline complete.**

### 07 — Quality Steward

Quality Steward already had substantial deep-authored content. The baseline pass preserved risk-based testing, analysis/design, component/API testing, framework engineering, browser/environment testing, non-functional quality and CI integration while closing two deferred decisions from the breadth audit:

1. **Browser-surface decision gate** — the learner must first prove that Steward has a meaningful browser-facing product surface. A fake UI must not be created merely to justify Playwright or cross-browser exercises.
2. **Performance-tool decision gate** — Locust, k6 or another candidate is evaluated against Steward workloads, CI/container execution, observability integration and learning cost before one primary implementation is selected.

The obsolete generic Quality Steward fallback generator was removed.

`tsa-test-core` remains a testing-infrastructure product only where stable generic behavior has real consumers; Steward-specific workflows and assertions remain domain test code.

**Status: baseline complete.**

### 08 — Security Steward

Security Steward uses dedicated deep-authored modules for foundations, threat modeling, web/API threats, isolated vulnerability laboratories, Linux/network security, container/delivery security, enterprise identity/secrets, application security and the final security assessment.

The enterprise identity path introduces Keycloak and OIDC/OAuth 2.0 concepts while preserving Steward's ownership of domain authorization. Secrets progress beyond `.env` into storage, injection, rotation, revocation, auditability and workload-identity concepts.

Offensive exercises remain learner-controlled and isolated, with mitigation and retest evidence required.

**Status: baseline complete.**

### 09 — Reliability Engineer

Reliability operates the whole accumulated platform rather than only the Django process. Existing modules cover SRE foundations, observability, logging, Prometheus/Grafana, service levels, alerting/on-call, performance/capacity, distributed failure, disaster recovery, incidents and fault injection.

The baseline pass closed three enterprise gaps:

- **Tracing backend decision gate** — Tempo, Jaeger or no backend is chosen from concrete diagnostic questions, not stack completeness.
- **Centralized logging decision gate** — one primary logging implementation is selected after comparing Loki, OpenSearch/ELK-style approaches and lighter alternatives against investigation needs, retention/privacy and learner-owned infrastructure constraints.
- **Database Stewardship module** — a dedicated DBA-awareness strand now covers roles/least privilege, connection budgets/pooling, slow-query and query-plan evidence, locks/deadlocks, safe migrations, backup/restore/RPO/RTO evidence and database health/capacity. It culminates in an evidence-driven database incident and operational-readiness review.

**Status: baseline complete.**

### 10 — Architect

Architect already uses evidence-backed modules for fundamentals, modularity, architecture styles, domain modeling, data architecture, integration/messaging, scalability/distributed systems, resilience and architecture governance.

The curriculum explicitly accepts retaining a modular monolith, shared database boundary or simpler platform when evidence supports it. Redis, RabbitMQ, Kafka, Kong, Jenkins, Kubernetes/OpenShift, GitOps and managed/self-managed services are architecture options with operational costs—not graduation badges.

The obsolete generic Architect fallback generator was removed.

**Status: baseline complete.**

### 11 — Technical Steward

Technical Steward remains intentionally downstream of hands-on engineering. Governance is connected to artifacts, incidents, controls, architecture, internal packages and platform ownership the learner has already encountered.

COBIT, ITIL, ISO management-system thinking and NIST frameworks are used as vocabularies and comparison lenses. The curriculum explicitly rejects mechanical framework stacking and checklist compliance. Controls must map to a real governance, risk, accountability or service-management problem and have operating evidence.

**Status: baseline complete.**

### 12 — Professional Engineer

Professional Engineer remains an independent capstone rather than another Steward extension. The learner must transfer TSA judgment to a substantial problem, produce an engineering proposal, build independently, run a production-readiness review and defend decisions.

Production readiness explicitly covers deployment, observability, security, performance, failure behavior, recovery, operational ownership, risk/control evidence, dependency/supply-chain readiness and cost/capacity. A valid readiness outcome may be release, conditional release, defer or redesign.

**Status: baseline complete.**

## Enterprise capability coverage

The primary enterprise-capability progression is now represented in the learner-facing runtime:

| Capability | Primary TSA implementation / treatment |
| --- | --- |
| Enterprise Linux | Rocky Linux with RHEL-family concepts |
| Configuration management | Ansible |
| Backend | Python + Django/DRF |
| Relational data | PostgreSQL |
| Cache | Redis |
| Messaging | RabbitMQ, with Kafka comparison |
| Enterprise identity | Keycloak + OIDC/OAuth 2.0 |
| API gateway | Kong |
| Source control | Git + GitHub |
| CI/CD | Jenkins, with hosted CI comparison |
| Artifact/dependency repository | Nexus-style private repository |
| Containers | Docker/OCI, with Podman concepts where useful |
| Infrastructure as Code | OpenTofu with Terraform/HCL model concepts |
| Orchestration | Kubernetes |
| Enterprise application platform | OpenShift |
| GitOps | Argo CD |
| Secrets lifecycle | self-hosted/Vault-style concepts where practical |
| Metrics | Prometheus |
| Visualization | Grafana |
| Centralized logs | evidence-based selection of one primary stack |
| Tracing | evidence-based backend decision rather than mandatory stack expansion |
| Database operations | Reliability Database Stewardship strand |

This table is a teaching baseline, not a command that every component must remain in Steward's final architecture.

## Breadth-audit watch items closure

The original breadth audit identified several items requiring deliberate treatment during deep/content-quality authoring. Their current status is:

- **Browser-testing target — closed:** explicit browser-surface decision gate added.
- **Performance-tool selection — closed:** explicit tool-comparison/selection gate added.
- **Distributed-systems examples — closed for baseline:** System Thinker introduces distributed-state/messaging reasoning; later Reliability and Architect use controlled failure/architecture evidence without forcing unnecessary service decomposition.
- **Tracing depth — closed:** tracing-backend decision gate added.
- **Security laboratory isolation — closed:** Security Steward labs are explicitly learner-controlled, isolated, mitigation-oriented and retested.
- **Governance frameworks — closed:** Technical Steward explicitly teaches framework concepts without certification-objective/checklist memorization.

## Generic-template audit

The Content Quality standard does not prohibit reusable TypeScript helpers. It prohibits generic learning experiences that make unrelated capabilities feel like the same exercise.

During this pass, obsolete generic lesson generators were removed from school orchestrators where authored paths had made them unnecessary, including System Thinker, Delivery Engineer, Cloud Engineer, Quality Steward and Architect. Security Steward had already been converted to dedicated deep-authored paths.

Remaining helper functions inside authored modules are acceptable when they only reduce code repetition and the lesson-specific context, engineering question, practice, evidence and completion criteria remain materially different.

## What remains after this baseline

No known curriculum-wide implementation gap currently requires another school, a broad new module family or a second equivalent enterprise tool for the same capability.

Future curriculum work should therefore be triggered by evidence, such as:

- learner confusion or repeated failure that reveals a teaching gap;
- obsolete or incorrect technical guidance;
- an enterprise capability whose current implementation no longer teaches the intended model well;
- a real Steward/product evolution that creates a new learning need;
- runtime/product UX limitations that prevent learners from completing or preserving evidence effectively.

The next large body of work may therefore shift from curriculum authoring toward the **TSA learning platform itself**: durable accounts/progress, submissions/evidence, review workflows, project state, assessment/review mechanics and richer learner experience. Those product capabilities should be designed separately rather than disguised as curriculum content.

## Decision

**The first TSA Content Quality and Enterprise Alignment baseline pass is complete.**

The curriculum is ready for an implementation/build verification and then for continued platform/product development or targeted learner-evidence-driven curriculum repairs.
