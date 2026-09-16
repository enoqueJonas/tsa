# Curriculum Dependency and Milestone Progression Audit — Closure

Status: **remediation complete; final build verification pending**

This document closes the curriculum-wide audit stamped in `curriculum-dependency-and-milestone-progression-audit.md`. The audit was triggered by two concrete defects: Proxmox appearing before the homelab it was supposed to inhabit, and infrastructure paths ending psychologically on reassessment/ADR work instead of making the implemented capability the achievement.

## Standard applied

Every school was reviewed against two independent questions:

1. **Dependency order:** does each path appear after the knowledge/environment it consumes and before the capabilities that depend on it?
2. **Milestone progression:** where TSA claims implementation/operation depth, does the learner actually build/integrate/break/recover/operate the capability before reassessing or governing it?

The intended progression is:

> Learn → Design → Build → Integrate → Break → Recover/Operate → Reassess

Reassessment remains important, but it is not a substitute for implementation.

## School-by-school result

| School | Dependency result | Milestone/progression result |
| --- | --- | --- |
| Engineering Apprentice | No ordering defect confirmed | Foundations remain appropriately scaffolded; no artificial implementation milestone added. |
| Builder | **Remediated** — relational data/PostgreSQL now precedes Django persistence/ORM engineering. | Steward API v1 remains the implementation milestone. |
| System Thinker | No ordering defect confirmed | System-design portfolio is intentionally a design milestone because this school's capability is systems reasoning; implementation continues in later schools. |
| Platform Builder | **Remediated** — Building the Budget Homelab now precedes Proxmox; subsequent storage/core-services/configuration/lifecycle/mixed-estate paths consume the platform in dependency order. | **Remediated** — explicit implementation milestones added where closing reassessment/records were overshadowing the operated capability. |
| Delivery Engineer | No blocking ordering defect confirmed | Delivery milestone already proves source→CI→Nexus→promotion→runtime→failure/recovery; no replacement needed. |
| Cloud Engineer | No blocking ordering defect confirmed | Cloud milestone already provisions and operates the real internet environment; reassessment/cost work follows implementation evidence. |
| Quality Steward | No blocking ordering defect confirmed | Quality milestone is an evidence-producing quality platform, not a review-only artifact. |
| Security Steward | Dependency chain remains coherent: foundations/threats → host/delivery → identity/secrets/Vault → PKI/federation → migration/application hardening. | **Remediated** — internal PKI now has a live machine-trust milestone before the ownership/Vault-PKI ADR. |
| Reliability Engineer | **Remediated** — logging, metrics and distributed tracing are implemented before Observability Stack Integration. | Reliability program remains implementation/operations driven. |
| Architect | **Remediated** — Domain Modeling now precedes Modularity/Architectural Styles so structure follows understood domain boundaries. | Architect milestone remains an architecture-evolution milestone; its product is an evidence-backed architecture decision/evolution, appropriate to the school. |
| Technical Steward | No blocking ordering defect confirmed | Governance/standards/leadership outputs are the actual capability of the school; they are not mistaken for infrastructure implementation. |
| Professional Engineer | Correct sequence retained: discovery → proposal → independent build → production readiness → defence. | Independent Build is explicitly implementation-first and the later defence evaluates completed engineering work. |

## Remediations delivered

### Platform Builder dependency graph

The major platform sequence is now intentionally:

`Computer/OS → Linux → Networking → Packet Tracer → Virtualization → Bare Metal → Build Homelab → Proxmox → Storage/NAS → DNS/DHCP/Time → Configuration Management → OS Lifecycle → Windows/Mixed Estate → Enterprise File/Directory → File/Batch Integration → Platform Builder Milestone`

This makes the physical/topology/capacity decision before installing the concrete hypervisor.

### Virtual-first NAS

The NAS path now treats the Proxmox-hosted Rocky NAS as the first real implementation. It must be consumed from another VM, operated, failed, recovered and restored from backup. Only after that does the learner reassess whether measured capacity/performance/failure-domain evidence justifies a dedicated physical NAS.

### Explicit infrastructure implementation milestones

The following capabilities now have a visible implementation achievement before their closing reassessment/ADR/capability record:

- Proxmox: **Build and Operate the Proxmox Virtualization Platform**
- Enterprise Storage/NAS: **Build and Operate the Virtual NAS**
- Core Infrastructure: **Operate DNS, DHCP and Time as Homelab Infrastructure**
- Configuration Management: **Build and Operate the Rocky Configuration Baseline**
- OS Lifecycle: **Patch and Recover the Rocky Fleet**
- Windows: **Build and Operate the Mixed Windows/Linux Estate**
- Internal PKI: **Operate Steward Internal Machine Trust**

These milestones deliberately reuse earlier labs. They consolidate evidence into an operated capability rather than creating duplicate demo infrastructure.

## Changes deliberately not made

The audit did **not** convert every reflection, ADR, architecture record or defence into a build project. Those outputs are correct when the capability being taught is itself analysis, architecture, governance, handoff or professional defence, or when they occur after a real implementation milestone.

The audit also did not add more products merely to make milestones look larger. Existing technology-ownership decisions remain in force: one primary implementation per capability unless a migration/replacement scenario justifies temporary coexistence.

## Final gate

Curriculum progression remediation is considered complete when current `master` passes:

```bash
pnpm build
```

A clean build is the final structural gate. It does not replace the pedagogical audit above; both must be satisfied.
