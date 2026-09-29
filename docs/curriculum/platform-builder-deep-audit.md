# Platform Builder — Deep Curriculum Audit

Status: structural, boundary and resource audit complete

## Purpose

Platform Builder teaches the learner to operate the substrate beneath Steward: machine, operating system, network, virtualization, storage, foundational infrastructure services, configuration state, OS lifecycle and a bounded mixed Windows/Linux enterprise estate.

It is not a catalogue of infrastructure products. Each implementation exists to make a previously abstract platform responsibility observable and operable.

## Canonical progression

1. Computer and Operating-System Foundations
2. Linux Administration
3. Networking Foundations
4. Network Engineering with Cisco Packet Tracer
5. Virtualization
6. Bare-Metal Platform Foundations
7. Building the Budget Homelab
8. Proxmox VE Homelab Platform
9. Enterprise Storage and NAS Operations
10. Core Infrastructure Services: DNS, DHCP and Time
11. Configuration Management with Ansible
12. OS Patching and Lifecycle Operations
13. Windows and PowerShell Mixed-Enterprise Operations
14. Enterprise File and Directory Services
15. Platform Builder Milestone

## Finding resolved: duplicated System Thinker curriculum

Platform Builder previously re-exported `system-thinker-enterprise-file-integration-deep.ts`.

That path belongs to System Thinker, where file/batch exchange is learned as an integration contract and interaction model.

Platform Builder already advances the concern correctly through:
- block/file storage;
- NFS and SMB;
- mounts and permissions;
- capacity and recovery;
- LDAP/AD identity boundaries;
- service operation.

The duplicate runtime export was removed.

## Why the breadth is justified

The 15-path scope forms four coherent layers:

### Host fundamentals
computer/OS → Linux → networking → network lab → virtualization

### Learner-operated physical/virtual platform
bare metal → budget homelab → Proxmox

### Shared infrastructure
storage/NAS → DNS/DHCP/time → Ansible → patch lifecycle

### Mixed-enterprise operation
Windows/PowerShell → file/directory services → integrated milestone

The school should not be reduced merely because it contains many products. Reduction is warranted only when two paths teach the same responsibility or a technology has no demonstrated platform purpose.

## Resource remediation

Strong existing references already existed for OS, Linux, networking, virtualization, bare metal, Packet Tracer and enterprise file/directory services.

Added primary references for previously unsupported operational paths:
- Proxmox VE documentation/admin/backup material;
- Red Hat storage, LVM, filesystem and NFS material plus Samba;
- BIND, ISC DHCP, Chrony and DNS/DHCP/NTP RFCs;
- Ansible playbooks, inventory and Vault;
- Rocky/DNF/Red Hat security-update and Ansible DNF references;
- Microsoft Windows Server, PowerShell, AD DS, remoting and file-server references.

## Strong existing decisions

### Product mechanics follow concepts
Networking foundations precede Packet Tracer. Virtualization precedes Proxmox. Linux operation precedes Ansible and patch automation.

### Physical reality is not hidden
Bare-metal firmware/boot/hardware health and local recovery precede turning a host into Proxmox infrastructure.

### Snapshots are not backups
The curriculum repeatedly requires independent recovery reasoning and verified restore.

### NAS is not universal storage
The storage module explicitly distinguishes block, file, object, artifact, relational and backup storage.

### Core services are real dependencies
DNS, DHCP and time are operated, broken and recovered rather than treated as invisible network conveniences.

### Configuration ownership is explicit
Templates/images, Ansible, application deployment, runtime orchestration and secrets must have explicit non-conflicting authorities.

### Patching is an operational change
Package-manager success is not accepted as service health. Canary rollout, reboot/kernel state and workload verification are required.

### Windows is deliberately bounded
Windows Server/PowerShell/AD are taught to the depth needed for mixed-enterprise operation without turning TSA into a parallel Windows certification track.

### Milestones are implementation gates
Proxmox, core infrastructure, OS lifecycle and Windows have implementation milestones before their closing reassessments. The final Platform milestone consolidates the actual current substrate.

## Boundaries

### System Thinker
System Thinker owns integration semantics/contracts. Platform Builder owns the infrastructure that enables those interactions.

### Delivery Engineer
Platform Builder manages host configuration and lifecycle. Delivery owns build/test/package/artifact/release flow for software changes.

### Cloud Engineer
Platform Builder owns learner-operated hosts/VMs/network/storage. Cloud later introduces provider abstractions, IaC, container orchestration and GitOps from this concrete base.

### Security Steward
Baseline least privilege, SSH protection, SELinux, firewall boundaries and secure administration are operational hygiene. Threat modeling, adversarial validation, secrets platforms, PKI and security programs remain Security.

### Reliability Engineer
Platform Builder performs failure/recovery drills to learn infrastructure behavior. SLOs, observability systems, alerting/on-call, capacity engineering and DR programs remain Reliability.

## Regression questions

- Can the learner explain the physical machine beneath the VM?
- Can they operate Linux without relying on GUI-only workflows?
- Can they trace a request through host/network boundaries?
- Does Packet Tracer deepen networking rather than replace networking theory?
- Can they distinguish guest, hypervisor and physical-host failure?
- Can they restore rather than merely snapshot?
- Are storage types chosen by responsibility rather than familiarity?
- Can DNS/DHCP/time failures be diagnosed independently?
- Is configuration authority unambiguous?
- Does a failed patch canary block wider rollout?
- Can Windows be administered through PowerShell objects/evidence rather than GUI clicking?
- Are synthetic identities used for directory labs?
- Is System Thinker file-integration content absent from Platform runtime?
- Does the final milestone describe the actual running platform?
