# TSA Zero-Based Competency Coverage Audit

## Why this audit exists

TSA previously completed breadth, content-quality, enterprise implementation-depth and cross-school continuity audits. Those audits were effective at testing the depth and sequencing of capabilities already present in the curriculum. They were less effective at discovering an important capability domain that had never entered TSA's inventory.

The triggering example is network engineering. Platform Builder already teaches strong host/application networking through Linux and the Steward homelab, but it does not currently provide a real network-device engineering laboratory comparable to a CCNA-aligned Cisco Packet Tracer progression. Because that capability was absent from the inventory, an implementation-depth audit could not flag it.

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
| Linux administration | dedicated Linux administration, systemd, permissions, services, network/security operation | Deeply taught | Keep |
| Computer/OS fundamentals | CPU, memory, I/O, processes, kernel/user space, filesystems, real machine evidence | Deeply taught | Keep |
| Virtualization | hypervisor model, CPU/memory/storage allocation, virtual networking, snapshots, real Ubuntu VM build/failure lab | Adequately bounded | Keep; specialist hypervisor-cluster administration is not required |
| Physical homelab/platform building | budget homelab, real hosts, networking and later platform services | Deeply taught for TSA scope | Keep |
| Host/application networking | Ethernet/ARP, IPv4/CIDR, TCP/UDP, routing, DHCP, DNS, NAT, firewalls, TLS, troubleshooting, WireGuard | Deeply taught | Keep |
| Network-device engineering | no sequenced IOS/switch/router laboratory; VLAN/STP/EtherChannel/inter-VLAN/OSPF/ACL operation is not exercised as a network in its own right | **Gap — Z1** | Add CCNA-aligned Packet Tracer laboratory progression before/alongside physical homelab networking |
| Enterprise Windows administration | AD/Kerberos are context around LDAP federation, but there is no meaningful Windows Server/PowerShell/WinRM/GPO administration path | **Gap — Z2** | Add bounded mixed-enterprise Windows/PowerShell administration rather than a full Windows certification course |
| Enterprise directory and federation | LDAP implementation, Keycloak federation, OIDC, lifecycle/outage/trust exercises; AD/Kerberos context | Deeply taught on primary path | Keep; Z2 supplies missing Windows-side operational literacy |
| Core infrastructure services | DNS/DHCP are used and diagnosed; certificate lifecycle exists; authoritative service operation and time synchronization are not a coherent learner-owned infrastructure-services lab | **Partial — Z3** | Add bounded DNS/DHCP/NTP service operations and failure labs, preferably using the homelab |
| Local storage/filesystem administration | filesystems/mounts and storage boundaries are taught; NFS/object storage/backup exist, but block-device administration and failure handling are not yet a clear end-to-end path | **Partial — Z4** | Deepen with partitions, LVM, filesystem growth, disk exhaustion/failure and RAID concepts/appropriate hands-on work |
| File/object/artifact storage | NFS, bounded SMB, S3-compatible object storage, Nexus, backup boundaries | Deeply taught | Keep |
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

### Z4 — Block storage and filesystem operations

**Finding:** partial.

TSA has strong storage *boundary* coverage: filesystems, NFS, object storage, Nexus, database storage and backup. The missing layer is the administrator's path from a block device to a resilient/growable filesystem.

Required remediation should include partition/block-device inspection, LVM physical/volume/logical concepts with a real grow/resize exercise, filesystem creation/mount/persistence, capacity/inode exhaustion and recovery, and RAID failure/redundancy concepts. RAID should be hands-on only if the lab environment can model it safely; otherwise a virtual-disk lab is enough.

The target is to understand what sits underneath `/var/lib/postgresql`, NFS or a VM disk—not to become a storage-array specialist.

### Z5 — Internal PKI and machine trust

**Finding:** partial, remediation subject to anti-duplication design.

TSA already has strong public TLS certificate lifecycle work. What is not clearly owned is private trust: internal CA hierarchy, issuing a workload certificate, trust-store distribution, revocation/rotation and service-to-service TLS identity.

Before implementation, this finding must be designed against existing Keycloak, Vault and certificate-lifecycle ownership. If added, the exercise should use one bounded internal CA/mTLS scenario and finish with clear authority boundaries rather than creating another permanent security platform.

## Domains explicitly reviewed and not reopened

The zero-based approach also prevented false positives. Several areas that initially look like likely omissions are already materially present:

- **Virtualization:** TSA has an actual VM/hypervisor path with resource allocation, virtual networking, snapshots and a real Ubuntu Server VM lab. A full Proxmox/VMware cluster curriculum is not necessary for the target profile.
- **Database operations:** Reliability has dedicated database stewardship in addition to Builder PostgreSQL and Delivery schema evolution.
- **Backup/DR:** Reliability has a dedicated data-protection/disaster-recovery path.
- **Performance/capacity:** both Quality and Reliability cover this from different responsibilities.
- **Hardware/OS fundamentals:** Platform Builder explicitly starts from CPU, memory, storage, I/O, kernel/user space, processes and filesystems before platform abstraction.

These domains should not receive extra technologies merely to make the curriculum look broader.

## Remediation order

The findings should be implemented in dependency order, one focused PR at a time:

1. **Z1 Network Engineering with Packet Tracer** — foundational and useful before deeper physical homelab networking.
2. **Z4 Block Storage and Filesystem Operations** — strengthens the machine/storage substrate before enterprise services depend on it.
3. **Z3 Core Infrastructure Services** — operate DNS/DHCP/NTP on the now-better-understood network/platform substrate.
4. **Z2 Windows/PowerShell Mixed-Enterprise Operations** — introduce a bounded second-OS environment after core platform fundamentals.
5. **Z5 Internal PKI and Machine Trust** — design last because it must reuse the mature network, identity, secrets and certificate boundaries without duplicating them.

Each remediation must still satisfy TSA's implementation-depth standard where appropriate: learn → design → implement → integrate → break → operate → reassess. The depth may be deliberately bounded for Z2/Z5.

## New completeness rule

TSA must not again declare curriculum completeness using only an internally generated capability inventory.

Future completeness reviews require two independent questions:

1. **Internal depth:** Are the capabilities TSA already claims to teach implemented, integrated, broken, operated and reassessed to the required depth?
2. **External breadth:** Starting from the target engineer rather than the curriculum, is an important capability domain missing or accidentally underweighted?

A curriculum is complete only when both questions have been answered.

## Decision

The previous enterprise remediation remains valid; its work is not undone. However, the stronger zero-based audit reopens **curriculum completeness** with five findings: **Z1 and Z2 are genuine gaps; Z3, Z4 and Z5 are partial capability gaps requiring bounded remediation/design.**

The next implementation work starts with **Z1: CCNA-aligned Network Engineering with Cisco Packet Tracer** in Platform Builder, integrated with the existing Linux networking and physical homelab progression rather than replacing either one.
