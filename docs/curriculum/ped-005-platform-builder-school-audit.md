# PED-005 — Platform Builder school-wide instructional audit

**Started:** 2026-11-02  
**Scope:** **Platform Builder only**, issue [#323](https://github.com/enoqueJonas/tsa/issues/323).  
**Base:** `curriculum/platform-builder-pedagogical-audit` branched from `curriculum/system-thinker-pedagogical-audit` after System Thinker source remediation was closed. This is a **stacked branch**, not an independent merge of #333.  
**State:** FULL-SCHOOL INVENTORY INITIATED; substantive lesson-by-lesson learner-order classification/remediation remains in progress. No claim of independent learner validation.

## Canonical order — all 15 paths

The real entrypoint is `packages/runtime-kernel/src/paths/platform-builder.ts`. A generated operational-readiness reading currently precedes each imported lesson collection; **do not credit this short introduction as proof that its underlying lessons teach deeply**.

| Order | Path | Canonical teaching sources to inspect | Specific evidence and failure to challenge | Status |
| --- | --- | --- | --- | --- |
| 1 | Computer and Operating-System Foundations | `platform-builder-computer-os-deep.ts`, `platform-builder-computer-os-quality.ts` | CPU, memory, kernel/process, filesystem and I/O: explain mechanism before metrics; observe one resource fault without unsafe changes | SOURCE READING IN PROGRESS |
| 2 | Linux Administration | `platform-builder-linux-administration-deep.ts`, `platform-builder-linux-administration-quality.ts` | RPM/DNF/Rocky conventions, users/groups, permissions/SELinux, systemd, journalctl, SSH; trace negative service-health vs process-running behavior | SOURCE READING IN PROGRESS |
| 3 | Networking Foundations | `platform-builder-networking-deep.ts`, `platform-builder-networking-quality.ts` | Link vs route vs DNS vs listener vs TLS/application; a runnable positive/negative packet and connection trace | NOT YET CLASSIFIED |
| 4 | Network Engineering with Cisco Packet Tracer | `platform-builder-packet-tracer-network-engineering-deep.ts` | L2/VLAN/subnet/gateway/trunk/ACL failures; Packet Tracer environment dependency clearly stated | NOT YET CLASSIFIED |
| 5 | Virtualization | `platform-builder-virtualization-deep.ts`, `platform-builder-virtualization-quality.ts` | Host/guest isolation and resource overcommit; failure domain, guest networking, snapshot vs backup | NOT YET CLASSIFIED |
| 6 | Bare-Metal Platform Foundations | `platform-builder-bare-metal-foundations-deep.ts` | Firmware/boot/device discovery/recovery; avoid physical destructive instructions without explicit safeguard | NOT YET CLASSIFIED |
| 7 | Building the Budget Homelab | `platform-builder-budget-homelab-deep.ts`, `platform-builder-budget-homelab-quality.ts` | Hardware/power/storage cost, Linux baselines, network topology, operational evidence vs assumed purchases | NOT YET CLASSIFIED |
| 8 | Proxmox VE Homelab Platform | `platform-builder-proxmox-homelab-deep.ts`, `platform-builder-proxmox-milestone.ts` | Management access recovery, bridges, storage, service/VM restart; distinguish host health from workload health | NOT YET CLASSIFIED |
| 9 | Enterprise Storage and NAS Operations | `platform-builder-enterprise-storage-nas-deep.ts` | Real PV/VG/LV/filesystem/NFS/SMB dependencies; destructive storage commands must use disposable targets and recovery evidence | NOT YET CLASSIFIED |
| 10 | Core Infrastructure Services: DNS, DHCP and Time | `platform-builder-core-infrastructure-services-deep.ts`, `platform-builder-implementation-milestones.ts` | Resolver/authoritative DNS, lease vs actual routing, NTP/time drift; prohibit unmanaged DHCP on a home network | NOT YET CLASSIFIED |
| 11 | Configuration Management with Ansible | `platform-builder-configuration-management-deep.ts` | Idempotence vs first successful apply, SSH identity, inventory scope, drift, check mode and secrets | NOT YET CLASSIFIED |
| 12 | OS Patching and Lifecycle Operations | `platform-builder-os-patching-lifecycle-deep.ts`, `platform-builder-implementation-milestones.ts` | Package version vs running kernel, reboot/service verification, staged rollback | NOT YET CLASSIFIED |
| 13 | Windows and PowerShell Mixed-Enterprise Operations | `platform-builder-windows-powershell-enterprise-deep.ts`, `platform-builder-implementation-milestones.ts` | PowerShell/NTFS/Event Log/domain vs local identity, reachable service; real Windows VM required to claim runtime proof | NOT YET CLASSIFIED |
| 14 | Enterprise File and Directory Services | `platform-builder-enterprise-file-directory-services-deep.ts` | SMB/NFS/export ACL/identity and AD authority; positive and denied second-client access | NOT YET CLASSIFIED |
| 15 | Platform Builder Milestone | `platform-builder-milestone-deep.ts` | End-to-end Steward on Rocky/Proxmox: known-good request, fault localisation, restore and next-school handoff | NOT YET CLASSIFIED |

## Confirmed architectural quality concern in the curriculum source

The `path(...)` helper in `platform-builder.ts` injects a **single short operational-readiness reading for every one of the 15 paths**. It is built from three brief notes (`platformFieldGuides`) rather than an explained mechanism and worked trace. These may serve as useful *orientation*, but must **not** be used as independent depth evidence or as a substitute for the actual module lessons. Audit real readings/practices under every one of the 15 paths. This is the same structural-vs-instructional distinction that triggered PED-005, not a reason to inflate every reading.

The Linux curriculum has a second, testable concern: the underlying `platform-builder-linux-administration-deep.ts` was authored with Ubuntu language while `platform-builder-linux-administration-quality.ts` recursively transforms strings to Rocky Linux/RPM/DNF conventions through `rockyize`. Conversion of narration and shell commands is not equivalent to verifying actual RHEL-family behavior. Check every executable command, package name, service unit, SELinux/firewalld assumption and displayed output **after** transformation, and repair materially wrong examples at source. This is a **potential inconsistency requiring inspection**, not a claim that a particular command already failed.

## School-wide stop rule

1. Classify **every existing actual lesson** (not only the prepended orientation) as Rich / Thin / Templated / Incorrect with a concrete finding and source file.
2. Rewrite confirmed deficiencies for prerequisites, definitions, internal mechanism, grounded example, alternative, failure/recovery and independent practice; split overloaded lessons.
3. Execute practical **safe disposable** examples and negative tests, capture actual outputs; mark vendor/hypervisor/Windows/managed-infrastructure-only cases UNVERIFIED where unavailable. Run curriculum integrity, build and existing rendered browser traversal; manually sampled visual evidence cannot be faked by a scripted traversal.
4. When the **entire school source** is instructionally remediated with test evidence, mark **REMEDIATED — SOURCE AUDIT CLOSED** and advance to Delivery Engineer. Preserve unresolved **learner-scored** validation or external managed infrastructure in a non-blocking follow-up; do not keep generating increasingly speculative edge cases forever.

**No PASS claim now** for the Platform Builder school. This file is the scope and diagnosis kickoff, not a completed remediation.
