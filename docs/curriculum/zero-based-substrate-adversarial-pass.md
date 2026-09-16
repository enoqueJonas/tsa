# TSA Zero-Based Audit — Adversarial Substrate Pass

## Purpose

This pass exists because the first zero-based audit still accepted several abstractions too early. In particular, `VM exists` was initially treated as sufficient virtualization coverage until the missing hypervisor-operations layer exposed Proxmox VE as a gap. The method here is therefore adversarial: start below Steward and ask what an operator must understand at every layer even if TSA never named that layer.

The pass reviewed the substrate as separate responsibilities rather than as one broad `infrastructure` category:

**physical environment → firmware/boot → compute host → hypervisor → guest OS → OS lifecycle → block storage → filesystem/file service → physical/network devices → infrastructure services → trust/identity → ingress/traffic → application/runtime → delivery → observability → recovery**.

A neighboring capability does not satisfy the layer automatically.

## What the pass confirmed is already stronger than it first appears

The existing Budget Homelab material already requires hardware inventory and sizing, CPU/RAM/storage/NIC trade-offs, power/noise/reliability reasoning, a controlled power-loss shutdown plan, physical Ethernet/cabling mapping, multiple-host failure-domain analysis, WireGuard-based private administration, local firewalling, local DNS reasoning, reverse-proxy operation, backup/restore, exposure analysis and VLAN decision-making.

The Linux Administration path already establishes Rocky Linux as the primary RHEL-compatible operating environment for Linux administration, including DNF/RPM, systemd, SELinux/firewalld context, storage/mount inspection, SSH and operational diagnostics. Therefore Z0 should be implemented as a **consistency sweep**, not as a new Linux curriculum: remaining stale Ubuntu assumptions must be removed from virtualization/other paths while preserving already-correct Rocky material.

These findings prevent unnecessary new technologies from being added merely because the first audit summary was too coarse.

## New finding Z6 — Bare-metal boot, firmware and hardware-health operations

**Classification: Partial.**

TSA teaches CPU, memory, storage and I/O concepts and later makes the learner choose physical homelab hardware. However, there is not yet a coherent operational bridge between `this is a computer` and `the OS/hypervisor is running`.

A Technical Steward does not need datacenter-technician depth, but should be able to reason about a host that fails **before Linux or Proxmox starts**.

### Required bounded capability

- identify BIOS/UEFI and firmware as layers distinct from the OS;
- inspect and deliberately configure boot order for installation/recovery media;
- distinguish UEFI/GPT concepts from legacy BIOS/MBR at an operational level;
- understand Secure Boot and virtualization-extension settings without disabling security controls reflexively;
- inspect CPU virtualization support before Proxmox installation;
- understand POST/firmware/bootloader/kernel/userspace as separate failure stages;
- inspect basic disk health with SMART where the hardware exposes it;
- record firmware/BIOS version and hardware inventory as part of the homelab baseline;
- perform one safe boot/recovery-path exercise and diagnose which layer owns the failure;
- understand out-of-band management (IPMI/iDRAC/iLO-class capability) conceptually and inspect it if owned hardware provides it, without requiring enterprise server hardware purchases;
- connect UPS/power-loss planning to graceful Proxmox/NAS shutdown without turning UPS hardware into a mandatory early purchase.

This should be integrated around the physical-homelab/Proxmox transition, not become a separate hardware-certification course.

## New finding Z7 — Operating-system patching and lifecycle management

**Classification: Partial.**

Linux Administration already teaches controlled DNF/RPM package installation/update and verification. That is necessary but narrower than owning the lifecycle of an operating system that hosts production-like services.

The missing capability is the operational change cycle around **security updates, kernel updates, reboot requirements, maintenance windows, compatibility, rollback/recovery and fleet consistency**.

### Required bounded capability

- inspect available Rocky Linux security/package updates before applying them;
- distinguish routine package change from kernel/OS lifecycle change;
- define a maintenance window and pre-change verification for Steward/Proxmox-hosted services;
- take only recovery artifacts that are actually useful and state what a VM snapshot can and cannot recover;
- patch a learner-owned Rocky Linux server and verify service health afterward;
- perform a kernel update followed by the required reboot and prove the running kernel actually changed;
- deliberately model or encounter one post-update regression and choose rollback, restore or forward-fix based on evidence;
- automate bounded patch reporting/execution with Ansible later rather than relying permanently on manual SSH;
- monitor patch age/compliance at a simple learner-owned level;
- document when a major-version upgrade is a migration rather than `dnf upgrade`;
- keep Proxmox host lifecycle separate from Rocky guest lifecycle and later exercise both at the appropriate stage.

The goal is patch/change ownership, not introducing a commercial endpoint-management product.

## Candidates challenged and deliberately not reopened

### Power and UPS

**Adequately bounded.** The homelab already treats power, ventilation, shutdown sequencing, UPS purpose/limitations and physical failure blast radius as operational concerns. A UPS may become a justified homelab purchase later, but TSA does not need to mandate one to teach the capability.

### Reverse proxy / ingress / load balancing

**Not reopened as a new substrate gap.** The homelab operates a reverse proxy; later Kong owns the enterprise edge; Kubernetes/OpenShift and progressive delivery introduce service/traffic distribution at platform level. HAProxy/Keepalived would add technology unless a later explicit high-availability requirement demonstrates a capability that these paths cannot exercise. HA and failover concepts remain important, but a new permanent load-balancer product is not justified by this audit alone.

### Remote administration / bastion access

**Adequately bounded for the current path.** SSH key administration, WireGuard private management, firewalld and a local recovery path are already explicit. A dedicated bastion/jump-host product should only be introduced if scale or trust-boundary pressure later justifies it.

### Enterprise server out-of-band management

**Conceptual/bounded under Z6.** IPMI/iDRAC/iLO literacy is valuable, but requiring enterprise server hardware would violate the budget-homelab principle. Hands-on work is conditional on available hardware.

### Enterprise Wi-Fi engineering

**Intentionally bounded.** TSA's target profile benefits from understanding wireless as part of the environment, but controller/AP/RF design is a networking specialization and is not required to make the current wired Packet Tracer + managed-switch + homelab progression credible.

### SAN/storage-array administration

**Intentionally bounded.** Z4 will provide block/LVM/filesystem/RAID/NAS operations and TSA already distinguishes file, object, relational, artifact and backup storage. Fibre Channel/iSCSI SAN specialization is not required unless a later architecture scenario genuinely needs it. iSCSI may be compared or demonstrated opportunistically, but should not become another permanent platform merely for breadth.

### Mail infrastructure

**Intentionally bounded.** Applications and Alertmanager may use email as a notification channel, but operating SMTP relays, MX, SPF, DKIM and DMARC is not core to the target Technical Steward profile. It can be introduced only if a future Steward requirement makes mail infrastructure itself an owned service.

## Updated remediation implications

The current remediation set is now:

1. **Z0 — Rocky Linux consistency sweep.**
2. **Z1 — CCNA-aligned Packet Tracer network engineering.**
3. **Z6 — Bare-metal boot/firmware/hardware-health foundations**, placed immediately before or as the entry to physical homelab/Proxmox ownership.
4. **Z0.5 — Proxmox VE homelab virtualization platform.**
5. **Z4 — Enterprise Storage & NAS Operations.**
6. **Z3 — learner-operated DNS/DHCP/NTP infrastructure services.**
7. **Z7 — OS patching/lifecycle operations**, beginning on Rocky Linux and later integrating Ansible/fleet evidence without moving advanced tools earlier than their school.
8. **Z2 — bounded Windows Server/PowerShell mixed-enterprise operations.**
9. **Z5 — bounded internal PKI/machine-trust lifecycle.**

Sequencing inside the curriculum may split a finding across schools where capability maturity requires it. The finding number is an audit identifier, not a demand that all work live in one lesson.

## Audit conclusion

This adversarial pass found **two additional partial gaps (Z6 and Z7)** and rejected several tempting false positives. The important correction is methodological: TSA must inspect the seams between layers, not merely the named technologies inside each layer.

The remediation phase should not begin until this addendum is accepted alongside the main zero-based audit. Once accepted, implementation should proceed one focused PR at a time and every new capability must preserve the anti-zoo rule: add a technology only when the learning problem requires an implementation, not because an enterprise engineer may encounter the product somewhere.
