# Final Zero-Based Adversarial Curriculum Audit

## Purpose

This pass deliberately ignores TSA's table of contents and asks what an unfamiliar enterprise environment can reasonably demand from the target Technical Steward profile. It is a breadth-and-seam audit after Z0–Z7 remediation, not another audit of whether existing lesson titles sound complete.

## Method

The pass tests the seams between: hardware/firmware → hypervisor → network → storage → operating system → configuration → identity/trust → application/data → delivery → cloud/orchestration → quality/security → observability/reliability → architecture/governance.

A capability counts only when TSA gives the learner an appropriate level of implementation or bounded hands-on evidence. A tool mention, reading or adjacent capability does not count.

## Result

The Z0–Z7 remediation set closed the previously confirmed substrate gaps: Rocky/RHEL consistency, Packet Tracer network-device engineering, bare-metal/firmware operations, Proxmox, enterprise storage/NAS, learner-operated DNS/DHCP/time, Windows/PowerShell mixed-enterprise operations, internal PKI/machine trust and OS patch/lifecycle operations.

The final seam pass found one additional worthwhile gap.

### Z8 — General configuration management: GAP → REMEDIATED

Ansible had become hands-on inside OS patching, but that proves patch orchestration rather than configuration management as an operating model. A steward still needed to learn desired state, inventory, reusable roles, idempotence, drift, handlers, canary configuration changes, secret boundaries and ownership between VM templates, host configuration, application deployment, orchestration and Vault.

Remediation: `Configuration Management with Ansible` in Platform Builder. It uses the existing Proxmox/Rocky estate and does not introduce another configuration-management product.

## Adversarial candidates rejected as new mandatory schools/paths

The following were rechecked and remain intentionally bounded or already owned elsewhere rather than being converted into tool-collection requirements:

- dedicated SAN/storage-array administration — outside the target profile; block/file/object/artifact/backup boundaries are already taught;
- enterprise Wi-Fi engineering — useful specialization, not required for TSA's target profile;
- mandatory multi-node Proxmox/HA cluster — concepts are required, expensive physical HA is not;
- mandatory IPMI/iDRAC/iLO hardware — conceptual/OOB literacy plus hands-on when available is sufficient;
- SCCM/Intune-class endpoint management — specialist Windows fleet management remains explicitly bounded;
- multiple configuration-management products — Ansible is the primary implementation; alternatives need scenario pressure;
- HAProxy/Keepalived merely for exposure — reverse proxy, ingress/gateway, Kubernetes service routing and resilience concepts already have owners;
- a second logging, metrics, tracing, secrets, artifact or GitOps stack — rejected by the established anti-zoo ownership model;
- full CCNA certification preparation — TSA requires transferable network engineering depth, not exam-topic completeness;
- full Windows/AD specialist administration — TSA requires mixed-estate literacy and bounded operation, not a second primary platform specialization.

## Build/schema finding

The audit also exposed a curriculum-engine integrity problem: several recent deep-remediation files used a compact authoring activity shape (`type`, `objective`, `instructions`, etc.) directly where the runtime requires canonical activities (`id`, `estimatedMinutes`, `content`). This is the direct cause of the 59 TypeScript errors observed in the final build.

The hardening fix introduces an explicit normalization boundary for compact authored activities before the academy journey reaches the UI/runtime, including stable generated activity IDs and duplicate-ID validation. This preserves the rich remediation content while restoring the runtime contract.

## Completion rule

After Z8 and the schema/build hardening are merged, no additional broad enterprise competency gap was confirmed by this pass. Future additions require either a new target-profile responsibility or evidence from real work that the current capability boundary is insufficient. TSA should not expand merely because another enterprise product exists.

The final technical gate remains a clean `pnpm build` from current `master` after pulling the merged hardening PR.
