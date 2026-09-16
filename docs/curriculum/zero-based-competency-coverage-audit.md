# TSA Zero-Based Competency Coverage Audit

## Why this audit exists

TSA previously completed breadth, content-quality, enterprise implementation-depth and cross-school continuity audits. Those audits were effective at testing the depth and sequencing of capabilities already present in the curriculum. They were less effective at discovering an important capability domain that had never entered TSA's inventory.

The triggering example is network engineering. Platform Builder already teaches strong host/application networking through Linux and the Steward homelab, but it does not currently provide a real network-device engineering laboratory comparable to a CCNA-aligned Cisco Packet Tracer progression. Because that capability was absent from the inventory, an implementation-depth audit could not flag it.

A second review immediately exposed two related platform omissions: the implemented virtualization lab still prescribes Ubuntu even though TSA's primary enterprise Linux trajectory is the Red Hat ecosystem, and virtualization is taught from the guest/VM perspective without requiring the learner to operate a real homelab hypervisor platform such as Proxmox VE. These findings reinforce that completeness must be checked from the target engineer outward rather than from the existing curriculum inward.

This audit therefore starts from the target engineer, not from the existing TSA table of contents.

## Audit question

> Could a TSA graduate enter an unfamiliar enterprise environment, identify the major technical domains in front of them, reason about their boundaries and failure modes, and perform the level of implementation/operation that TSA's Technical Steward profile reasonably requires?

This does **not** mean TSA must turn into a certification bundle or teach every enterprise product. A domain can be intentionally bounded. The requirement is that the boundary is deliberate rather than accidental.

## Classification

Each domain receives one of four classifications:

- **Deeply taught** — meaningful implementation and operational evidence already exists.
- **Adequately bounded** — the learner gets enough hands-on understanding for TSA's target profile; specialist depth is intentionally outside scope.
- **Partial** — relevant material exists, but an important enterprise capability is not exercised strongly enough.
- **Gap** — the capability is materially absent and should be considered for remediation.

A technology name, reading link, conceptual comparison or incidental use does not count as capability coverage.

## Zero-based competency map

| Domain | Current evidence | Classification | Audit decision |
| --- | --- | --- | --- |
| Software engineering and API development | Python, Django, PostgreSQL, software craft, API/auth, continuing Steward implementation | Deeply taught | Keep |
| Systems thinking and integration | boundaries, data flow, dependencies, failure modes, RabbitMQ/Redis, file/batch integration | Deeply taught | Keep |
| Linux administration | dedicated Linux administration, systemd, permissions, services, network/security operation, but current VM lab still prescribes Ubuntu while the intended primary enterprise path is Red Hat-compatible | **Partial — Z0** | Standardize the primary learner-owned enterprise Linux environment on Rocky Linux; retain distro comparison only where pedagogically useful |
| Computer/OS fundamentals | CPU, memory, I/O, processes, kernel/user space, filesystems, real machine evidence | Deeply taught | Keep |
| Virtualization fundamentals | hypervisor model, CPU/memory/storage allocation, virtual networking, snapshots and a real VM build/failure lab | Deeply taught at VM level | Keep fundamentals |
| Homelab hypervisor operations | no required learner-operated virtualization platform; current lab can be completed with a desktop hypervisor without operating the host/platform layer | **Gap — Z0.5** | Add Proxmox VE as the primary homelab hypervisor and operate VM, virtual network, storage, snapshot/backup and host lifecycle boundaries |
| Physical homelab/platform building | budget homelab, real hosts, networking and later platform services | Deeply taught for current scope | Integrate Proxmox rather than treating each service as a physical host |
| Host/application networking | Ethernet/ARP, IPv4/CIDR, TCP/UDP, routing, DHCP, DNS, NAT, firewalls, TLS, troubleshooting, WireGuard | Deeply taught | Keep |
| Network-device engineering | no sequenced IOS/switch/router laboratory; VLAN/STP/EtherChannel/inter-VLAN/OSPF/ACL operation is not exercised as a network in its own right | **Gap — Z1** | Add CCNA-aligned Packet Tracer laboratory progression before/alongside physical homelab networking |
| Enterprise Windows administration | AD/Kerberos are context around LDAP federation, but there is no meaningful Windows Server/PowerShell/WinRM/GPO administration path | **Gap — Z2** | Add bounded mixed-enterprise Windows/PowerShell administration rather than a full Windows certification course |
| Enterprise directory and federation | LDAP implementation, Keycloak federation, OIDC, lifecycle/outage/trust exercises; AD/Kerberos context | Deeply taught on primary path | Keep; Z2 supplies missing Windows-side operational literacy |
| Core infrastructure services | DNS/DHCP are used and diagnosed; certificate lifecycle exists; authoritative service operation and time synchronization are not a coherent learner-owned infrastructure-services lab | **Partial — Z3** | Add bounded DNS/DHCP/NTP service operations and failure labs, preferably using the homelab |
| Local storage/filesystem administration | filesystems/mounts and storage boundaries are taught; NFS/object storage/backup exist, but block-device administration and failure handling are not yet a clear end-to-end path | **Partial — Z4** | Expand into Enterprise Storage & NAS Operations: block devices, LVM, filesystems, RAID/redundancy, capacity, NFS/SMB service, monitoring, failure, expansion and recovery |
| File/object/artifact storage | NFS, bounded SMB, S3-compatible object storage, Nexus, backup boundaries | Deeply taught | Keep; NAS provides the concrete file-storage substrate without replacing object/artifact/database storage |
| Database engineering and operations | PostgreSQL development plus dedicated Reliability database stewardship and production schema evolution | Deeply taught | Keep |
| Backup, restore and disaster recovery | dedicated data-protection/disaster-recovery path plus database and storage recovery boundaries | Deeply taught | Keep |
| Messaging/cache/integration middleware | RabbitMQ, Redis, file/batch integration, failure/idempotency and architecture reassessment | Deeply taught | Keep |
| CI/CD and release engineering | Jenkins, Nexus, immutable artifacts, provenance/SBOM, scheduled/SCM-triggered quality, Argo CD/Rollouts | Deeply taught | Keep |
| Configuration management and IaC | Ansible/configuration management plus OpenTofu/IaC and GitOps progression | Deeply taught | Keep |
| Containers and orchestration | Docker, Kubernetes, bounded OpenShift migration/delta, GitOps/progressive delivery | Deeply taught | Keep |
| Cloud/internet operations | VPS, DNS/TLS, cloud building blocks, networking, IaC, object storage, cost/architecture | Deeply taught | Keep |
| Security engineering | application/API, Linux/network, container/delivery, threat modeling, vulnerability lab, Vault, identity, artifact signing | Deeply taught | Keep |
| PKI and machine trust | public TLS/certificate lifecycle is strong; internal CA/trust distribution and service-to-service certificate identity are not clearly exercised as a lifecycle | **Partial — Z5** | Add bounded internal PKI/trust-store/mTLS lifecycle work if it can be integrated without duplicating Vault/Keycloak/TLS responsibilities |
| Observability | Prometheus, Grafana, Graylog, OpenTelemetry, Tempo, Alertmanager and cross-signal incident work | Deeply taught | Keep |
| Reliability/SRE | SLOs, alerting/on-call, incidents, resilience, fault injection, DB stewardship, DR, performance/capacity | Deeply taught | Keep |
| Performance/capacity | Quality non-functional testing plus dedicated Reliability performance/capacity engineering | Deeply taught | Keep |
| Architecture | architecture fundamentals/styles, DDD/modularity, data/integration, distributed systems, resilience and governance | Deeply taught | Keep |
| Governance/technical stewardship | controls/compliance, service/change governance, standards, risk, third-party lifecycle, technical debt and leadership | Deeply taught | Keep |
| Independent transfer of skill | Professional Engineer blank/independent capstone, production readiness and defence | Deeply taught | Keep |

## Confirmed findings

### Z0 — Primary enterprise Linux consistency

**Finding:** partial/inconsistent implementation.

TSA's primary enterprise Linux trajectory is the Red Hat ecosystem, but the implemented virtualization lab still explicitly prescribes Ubuntu Server. That creates unnecessary distro churn before later Red Hat/OpenShift-oriented work.

Rocky Linux should become the primary free, learner-owned RHEL-compatible distribution for the Platform Builder VM and homelab server path. The curriculum should teach transferable Linux concepts and may compare Debian/Ubuntu conventions where useful, but it should not accidentally establish Ubuntu as the canonical TSA server and then switch ecosystems later.

Remediation must search the curriculum for distro-specific assumptions rather than changing one lab title only. Package management, service/network configuration, firewalling, paths and commands must be checked for compatibility with the selected Rocky Linux version.

### Z0.5 — Proxmox VE homelab virtualization platform

**Finding:** genuine gap.

TSA teaches what a VM and hypervisor are and makes the learner build and break a VM. It does not currently make the learner **operate the virtualization platform itself**. A desktop hypervisor can satisfy the existing lab while leaving virtual switches/bridges, host storage, VM lifecycle, resource contention, platform backup and host maintenance largely opaque.

The physical homelab should therefore introduce **Proxmox VE** as the primary learner-operated hypervisor platform when suitable x86-64 homelab hardware becomes available. Proxmox is not being added as vendor trivia; it creates a practical miniature datacenter boundary on inexpensive hardware.

Minimum capability:

1. Install and secure a Proxmox VE host on learner-owned hardware.
2. Understand management-plane addressing and safe administrative access.
3. Create Rocky Linux VM templates and independently managed VMs.
4. Allocate and observe vCPU, memory and disk resources; reason about overcommit.
5. Configure Linux bridges and later VLAN-aware virtual networking tied to the physical managed switch.
6. Understand local storage pools and how VM virtual disks map to physical storage.
7. Operate VM lifecycle: create, start/stop, clone/template, snapshot and delete with evidence.
8. Configure and test VM backup/restore while preserving the distinction between snapshot and independent backup.
9. Introduce a guest failure and a host/platform-layer failure and localize them correctly.
10. Perform a bounded host maintenance/upgrade exercise with recovery planning.
11. Understand migration/HA/cluster concepts without requiring an expensive multi-node production cluster unless later hardware makes that useful.
12. Document which services belong as VMs, which storage should remain independent, and which failure domains remain shared by a single Proxmox host.

The progression should remain staged: an early local Rocky Linux VM teaches guest/server administration before the learner owns physical homelab hardware; Proxmox arrives when the homelab is built and turns those VM concepts into platform operations.

### Z1 — Network-device engineering and Packet Tracer

**Finding:** genuine gap.

The existing networking curriculum is strong, but its center of gravity is the Linux host, Steward reachability and the physical homelab. That is not the same learning problem as configuring and troubleshooting a multi-device network.

TSA should add a **CCNA-aligned, not CCNA-certification-driven** Packet Tracer sequence. The capability target is network reasoning, not Cisco trivia.

Minimum progression:

1. IOS CLI and device/interface inspection.
2. IPv4 subnetting and VLSM applied to a topology.
3. Basic switch operation and MAC learning.
4. VLANs, access ports and 802.1Q trunks.
5. Inter-VLAN routing.
6. STP and loop prevention, including a deliberately broken/redundant topology.
7. EtherChannel/link aggregation.
8. Static and default routing.
9. Single-area OSPF and route diagnosis.
10. DHCP and relay concepts in a routed topology.
11. NAT/PAT.
12. Standard/extended ACL policy and negative tests.
13. IPv6 addressing/routing fundamentals.
14. Multi-device troubleshooting lab with several injected faults.
15. Final Packet Tracer enterprise-branch topology that produces an addressing plan, topology diagram, configuration evidence and troubleshooting record.

Packet Tracer should precede the point where the learner is expected to understand real switch/router behavior in the homelab. Physical equipment then becomes transfer-of-learning rather than the first place switching/routing concepts are encountered.

### Z2 — Windows/PowerShell mixed-enterprise operations

**Finding:** genuine gap.

TSA intentionally chose Linux as its primary server platform. That should remain true. However, a Technical Steward working in enterprise environments should not encounter Windows Server, PowerShell, AD-integrated identity or remote Windows administration as an opaque foreign domain.

This should be a bounded implementation, not a second operating-system school. A disposable Windows Server evaluation/lab VM is sufficient where licensing permits.

Minimum capability:

- PowerShell objects, pipeline, remoting and repeatable administration;
- Windows service/process/event-log inspection;
- users/groups/permissions and NTFS/share distinction;
- basic WinRM/remoting boundary;
- Windows DNS/AD relationship at an operational level;
- domain join and synthetic AD users/groups in a learner-owned lab where practical;
- Group Policy mental model plus one safe policy exercise;
- one Linux↔Windows interoperability scenario, ideally SMB and/or identity;
- one failure investigation using PowerShell/Event Viewer rather than GUI-only clicking.

The goal is mixed-enterprise literacy and transfer, not MCSE-style breadth.

### Z3 — Core infrastructure services as operated services

**Finding:** partial.

TSA teaches clients and dependencies around DNS/DHCP very well, and later certificate work is operational. What is less explicit is ownership of the small infrastructure services that make a network function.

A bounded homelab path should make the learner operate authoritative/local DNS, DHCP scope/reservation/relay behavior where feasible, and NTP/chrony time synchronization. The failure exercises matter: stale/wrong DNS, exhausted or incorrect DHCP scope, and clock skew affecting TLS/auth/log correlation.

This should not introduce a permanent product zoo. The lab may use lightweight implementations and retain only services justified by the final homelab.

### Z4 — Enterprise Storage & NAS Operations

**Finding:** partial.

TSA has strong storage *boundary* coverage: filesystems, NFS, object storage, Nexus, database storage and backup. The missing layer is the administrator's path from physical/virtual block devices to an operated file-storage service.

The remediation should build a learner-operated NAS/file-server boundary rather than treating LVM as isolated command practice. The exact implementation may begin virtually and later move to dedicated hardware if the cost/failure-domain trade-off justifies it.

Required progression:

1. Inspect disks and block devices and understand device/filesystem boundaries.
2. Partition where appropriate and create LVM physical volumes, volume groups and logical volumes.
3. Create filesystems, mount them persistently and validate ownership/permissions.
4. Grow a logical volume and filesystem safely while preserving data.
5. Create and recover from controlled capacity and inode exhaustion.
6. Implement RAID/redundancy using safe virtual disks or suitable physical hardware; distinguish redundancy from backup.
7. Expose selected file storage through NFS and bounded SMB interoperability.
8. Consume the share from another TSA host/VM and observe client/server failure behavior.
9. Monitor capacity, filesystem health and storage-service availability.
10. Introduce disk/service/mount/permission failures and diagnose the correct layer.
11. Perform backup/restore with an independent recovery boundary rather than treating RAID, snapshot or another directory as backup.
12. Reassess whether the NAS should remain virtual on Proxmox or become physically independent, explicitly comparing cost, performance and shared failure domains.

The NAS must not become TSA's universal storage answer. PostgreSQL remains relational storage, S3-compatible storage remains object storage, Nexus remains artifact storage, and backup storage retains its own recovery boundary.

### Z5 — Internal PKI and machine trust

**Finding:** partial, remediation subject to anti-duplication design.

TSA already has strong public TLS certificate lifecycle work. What is not clearly owned is private trust: internal CA hierarchy, issuing a workload certificate, trust-store distribution, revocation/rotation and service-to-service TLS identity.

Before implementation, this finding must be designed against existing Keycloak, Vault and certificate-lifecycle ownership. If added, the exercise should use one bounded internal CA/mTLS scenario and finish with clear authority boundaries rather than creating another permanent security platform.

## Domains explicitly reviewed and not reopened

The zero-based approach also prevented false positives. Several areas that initially look like likely omissions are already materially present:

- **Virtualization fundamentals:** TSA has an actual VM/hypervisor path with resource allocation, virtual networking, snapshots and a real VM lab. Z0 corrects its distro consistency and Z0.5 adds the missing hypervisor-platform operations; these do not invalidate the existing fundamentals.
- **Database operations:** Reliability has dedicated database stewardship in addition to Builder PostgreSQL and Delivery schema evolution.
- **Backup/DR:** Reliability has a dedicated data-protection/disaster-recovery path.
- **Performance/capacity:** both Quality and Reliability cover this from different responsibilities.
- **Hardware/OS fundamentals:** Platform Builder explicitly starts from CPU, memory, storage, I/O, kernel/user space, processes and filesystems before platform abstraction.

These domains should not receive extra technologies merely to make the curriculum look broader.

## Remediation order

The findings should be implemented in dependency order, one focused PR at a time:

1. **Z0 Linux Platform Consistency** — establish Rocky Linux as the canonical free RHEL-compatible learner server and remove stale Ubuntu assumptions before building more platform curriculum on top.
2. **Z1 Network Engineering with Packet Tracer** — learn network-device reasoning before depending on real managed-switch behavior.
3. **Z0.5 Proxmox VE Homelab Platform** — introduce the learner-operated hypervisor when physical homelab hardware is available; integrate bridges/VLANs with the network knowledge from Z1.
4. **Z4 Enterprise Storage & NAS Operations** — build block/LVM/filesystem/RAID/NAS capability on the virtualized and networked substrate, while preserving independent-storage trade-off analysis.
5. **Z3 Core Infrastructure Services** — operate DNS/DHCP/NTP on the now-better-understood network/platform substrate.
6. **Z2 Windows/PowerShell Mixed-Enterprise Operations** — introduce a bounded second-OS environment, naturally hosted as a VM on the homelab where appropriate.
7. **Z5 Internal PKI and Machine Trust** — design last because it must reuse the mature network, identity, secrets and certificate boundaries without duplicating them.

Each remediation must still satisfy TSA's implementation-depth standard where appropriate: learn → design → implement → integrate → break → operate → reassess. The depth may be deliberately bounded for Z2/Z5.

## New completeness rule

TSA must not again declare curriculum completeness using only an internally generated capability inventory.

Future completeness reviews require two independent questions:

1. **Internal depth:** Are the capabilities TSA already claims to teach implemented, integrated, broken, operated and reassessed to the required depth?
2. **External breadth:** Starting from the target engineer rather than the curriculum, is an important capability domain missing or accidentally underweighted?

A curriculum is complete only when both questions have been answered.

The external-breadth review must explicitly challenge at least these layers rather than treating them as implied by neighboring topics: physical hardware, firmware/boot, hypervisor platform, guest OS, block storage, file storage, network devices, infrastructure services, identity/trust, mixed operating systems, application runtime, delivery, observability and recovery. A capability can be intentionally bounded, but the audit must record that decision.

## Decision

The previous enterprise remediation remains valid; its work is not undone. However, the stronger zero-based audit reopens **curriculum completeness** with seven findings: **Z0 is a platform-consistency correction; Z0.5, Z1 and Z2 are genuine gaps; Z3, Z4 and Z5 are partial capability gaps requiring bounded remediation/design.**

The next implementation work starts with **Z0: Rocky Linux platform consistency**, followed by **Z1: CCNA-aligned Network Engineering with Cisco Packet Tracer**. Proxmox then becomes the real homelab virtualization substrate rather than a conceptual hypervisor mention.
