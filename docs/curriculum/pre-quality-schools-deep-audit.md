# Pre-Quality Schools — Deep Audit Program

Status: active audit program

## Scope

This program applies the same audit standard used for Quality, Security, Reliability, Architect and Technical Steward to:

1. Engineering Apprentice
2. Builder
3. System Thinker
4. Platform Builder
5. Delivery Engineer
6. Cloud Engineer

Professional Engineer is audited separately as the journey-wide proof layer.

## Non-negotiable checks for every school

### Runtime completeness
- Every declared lesson/path is reachable through the school's runtime aggregator and academy journey.
- Milestones and inserted implementation lessons are not stranded.
- Authored/deep/quality wrappers do not silently replace or omit lessons.
- `pnpm audit:curriculum` remains the merge regression check.

### Sequence and prerequisites
- Concepts precede abstractions/products.
- Labs depend only on skills already taught or explicitly scaffolded.
- Later schools do not compensate for missing foundational instruction that belongs earlier.
- Advanced enterprise tools appear only when their prerequisite mental model exists.

### Steward evolution
- Each school changes the same Steward system in a pedagogically justified way.
- New infrastructure/products solve a learning/system problem rather than resume breadth.
- Milestones synthesize the school rather than repeat lesson checklists.
- Reusable internal products are extracted only after a demonstrated reuse boundary.

### Resource quality
- Lesson-specific resources rather than generic module bundles.
- Primary/official documentation first for implementation mechanics.
- High-quality conceptual references for principles/trade-offs.
- Video/course resources complement rather than replace durable primary references.
- Resource count stays focused.

### Technology consistency
- GitLab CI/CD is canonical.
- Jenkins implementation must not appear.
- Product names do not substitute for concepts.
- Deprecated/stale technology assumptions are corrected.
- Current tool usage remains consistent across schools.

### Duplication boundaries
- Builder teaches implementation fundamentals; System Thinker teaches system reasoning.
- Platform Builder teaches host/network/infrastructure operation; Delivery teaches software change flow.
- Delivery teaches artifact/release automation; Cloud teaches internet/cloud platform responsibilities.
- Cloud must not prematurely absorb Security, Reliability or Architect curricula.
- Earlier schools may introduce a concept only to the depth required for their immediate work.

## School-specific audit questions

### Engineering Apprentice
- Does it teach terminal/Git/debugging/engineering reasoning before framework work?
- Are exercises real enough to prepare the Builder without becoming a second programming course?
- Is Git/version-control workflow current and GitLab-compatible?

### Builder
- Does Python precede Django abstraction?
- Does relational/SQL understanding precede ORM dependence?
- Are HTTP/API, authn/authz and software craft explicit?
- Does Steward API v1 integrate the sequence?
- Is steward-common extraction earned rather than pre-created?

### System Thinker
- Does problem framing precede diagrams?
- Are boundaries, dependencies and data flows understood before SOAP/XML or messaging?
- Are SOAP/file/batch/messaging taught as integration models, not arbitrary enterprise-tool breadth?
- Do failure analysis and ADRs reassess earlier integration decisions?

### Platform Builder
- Does computer/OS → Linux → networking → virtualization → physical/homelab progression hold?
- Are Packet Tracer and Proxmox implementation tools attached to understood network/virtualization concepts?
- Do DNS/DHCP/time, storage, Ansible, patching, Windows/PowerShell and file/directory services form one coherent mixed-enterprise platform?
- Is the 16-path scope justified, or are some paths better moved/merged?

### Delivery Engineer
- Does software delivery reasoning precede Docker/CI/CD?
- Is GitLab CI/CD canonical everywhere?
- Are artifacts/Nexus, configuration, release engineering and schema evolution integrated into one change-to-production model?
- Is the CI-platform migration exercise still pedagogically useful without making Jenkins a target implementation?
- Does Delivery stop before Cloud orchestration/GitOps ownership?

### Cloud Engineer
- Do hosting/VPS/internet-networking concepts precede cloud building blocks and IaC?
- Are certificate lifecycle and object storage introduced from concrete operational needs?
- Does Kubernetes/OpenShift/GitOps appear only after containers, networking, infrastructure and delivery prerequisites?
- Is canary delivery justified by deployment/risk concepts rather than tool novelty?
- Does cloud architecture/cost synthesize rather than become an Architect preview?

## Execution order

Audit in dependency order:

```text
Engineering Apprentice
→ Builder
→ System Thinker
→ Platform Builder
→ Delivery Engineer
→ Cloud Engineer
→ cross-school runtime/resource regression
```

Fix each school before using it as a prerequisite for the next audit.
