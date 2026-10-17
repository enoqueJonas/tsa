import type { AuthoredLearningPath, AuthoredLesson } from "./normalize-authored-curriculum";
import { bareMetalFoundationsDeepLessons } from "./platform-builder-bare-metal-foundations-deep";
import { budgetHomelabQualityLessons } from "./platform-builder-budget-homelab-quality";
import { computerAndOsFoundationsQualityLessons } from "./platform-builder-computer-os-quality";
import { configurationManagementDeepLessons } from "./platform-builder-configuration-management-deep";
import { coreInfrastructureServicesDeepLessons } from "./platform-builder-core-infrastructure-services-deep";
import { enterpriseFileAndDirectoryServicesDeepLessons } from "./platform-builder-enterprise-file-directory-services-deep";
import { enterpriseStorageNasDeepLessons } from "./platform-builder-enterprise-storage-nas-deep";
import { coreInfrastructureImplementationMilestone, osLifecycleImplementationMilestone, windowsEnterpriseImplementationMilestone } from "./platform-builder-implementation-milestones";
import { linuxAdministrationQualityLessons } from "./platform-builder-linux-administration-quality";
import { stewardHomelabV1DeepLessons } from "./platform-builder-milestone-deep";
import { networkingFoundationsQualityLessons } from "./platform-builder-networking-quality";
import { osPatchingLifecycleDeepLessons } from "./platform-builder-os-patching-lifecycle-deep";
import { packetTracerNetworkEngineeringDeepLessons } from "./platform-builder-packet-tracer-network-engineering-deep";
import { proxmoxHomelabDeepLessons } from "./platform-builder-proxmox-homelab-deep";
import { proxmoxImplementationMilestone } from "./platform-builder-proxmox-milestone";
import { virtualizationQualityLessons } from "./platform-builder-virtualization-quality";
import { windowsPowerShellEnterpriseDeepLessons } from "./platform-builder-windows-powershell-enterprise-deep";

const platformFieldGuides: Record<string, { title: string; notes: string[] }> = {
    "computer-and-os-foundations": { title: "Identify the layer before fixing the symptom", notes: ["Trace an application request through hardware resources, the kernel, processes, sockets and storage. Collect process state and a listening-port observation before guessing at service failure.", "A process can be running but unable to read its configuration; a healthy network interface does not prove a listening application.", "Explain which observation ruled out the neighboring layer before changing configuration."] },
    "linux-administration": { title: "Prove the system's current state before changing it", notes: ["Record the running identity with id, service state with systemctl, recent logs with journalctl and persistent mounts with findmnt. Prefer a dedicated disposable guest.", "A service that launches in an interactive shell may still fail at boot because its environment, working directory or permissions differ.", "Use an application-level health request after restart, not only a green systemctl status."] },
    "networking-foundations": { title: "Follow one packet across explicit boundaries", notes: ["Record source and destination addresses, DNS resolution, route selection, transport socket and firewall policy before troubleshooting. Compare dig, ip route, ss and curl observations.", "A successful ping does not prove TCP availability; an IP-level connection does not prove the DNS name is correct.", "Preserve the known-good path and local access before changing remote routing or firewall policy."] },
    "packet-tracer-network-engineering": { title: "Predict traffic before watching the animation", notes: ["Label VLAN membership, subnet masks, default gateways, trunks and permitted services. Record expected source-to-destination forwarding and return route.", "An access-port VLAN error, missing route and ACL denial can all look like a timeout; inspect interfaces, tables and policy separately.", "Save a working Packet Tracer topology before deliberately changing one variable."] },
    "virtualization": { title: "Separate the guest from its hypervisor", notes: ["Draw the physical host, virtual CPU/RAM, virtual disk backing, guest NIC, bridge and network uplink. Explain which fault affects one VM and which affects all guests.", "A guest snapshot on the same host datastore is not independent recovery after host or storage loss.", "Verify boot, storage and connectivity from within the guest as well as from the hypervisor."] },
    "bare-metal-foundations": { title: "Map the boot and recovery chain", notes: ["Record physical model, firmware settings, boot media, hypervisor compatibility and local-console recovery before installation.", "A missing firmware boot entry is not an application failure; unsupported virtualization settings can prevent guest start despite a healthy OS.", "Do not change firmware security settings without recording initial state and an authorized rollback path."] },
    "budget-homelab": { title: "Budget around failure domains, not only purchase cost", notes: ["List the current host, RAM, storage, networking and power constraints. Mark what is already owned, what is assumed and what must be bought.", "More virtual machines do not create independent physical availability; all guests may share the same power and disk.", "Establish a safe capacity headroom and recovery plan before adding workloads."] },
    "proxmox-homelab-platform": { title: "Keep management access independently recoverable", notes: ["Record Proxmox host identity, NIC and bridge mapping, management subnet, guest storage pools and physical-console access.", "A reachable guest does not imply a healthy management plane; a reachable Proxmox UI does not prove workload health.", "Do not change the only management route without a tested local or out-of-band recovery method."] },
    "enterprise-storage-nas": { title: "Follow bytes through the storage stack", notes: ["Map virtual disk to PV, VG, LV, filesystem, mount, NFS or SMB export and separate client. Use read-only identity and capacity observations before changing disks.", "RAID is not an independent backup and successful mounting does not prove correct access rights or recoverability.", "Use disposable test files and compare checksums after any backup and restore."] },
    "core-infrastructure-services": { title: "Separate authority, allocation and time", notes: ["For DNS record the authoritative zone and client resolver; for DHCP record the assigned address, gateway and resolver; for NTP inspect time synchronization.", "A valid lease does not prove DNS answers; a correct DNS record does not guarantee clients have a usable cached answer.", "In a lab network, isolate any DHCP service from unmanaged production or home LAN clients."] },
    "platform-configuration-management": { title: "Identify which component owns each setting", notes: ["Record inventory scope, SSH identities, Ansible-managed files and image-provisioned files before applying changes. Capture a dry-run diff when supported.", "A successful first apply does not prove idempotence; overlapping image and Ansible ownership can create silent drift.", "Repeat a converged run and record whether changes remain, while keeping secrets outside committed inventory."] },
    "os-patching-lifecycle": { title: "Measure exposure and preserve rollback", notes: ["Record package or kernel baseline, vendor advisory, risk and maintenance window. Identify affected applications and dependent hosts.", "Installed kernel version and running kernel version can differ until reboot; package updates may require service restart.", "Recheck application health after patching and stop staged rollout on failure."] },
    "windows-powershell-enterprise": { title: "Distinguish Windows identity, service and domain layers", notes: ["Record local versus domain identity, service startup account, NTFS rights, Windows Event Log and DNS/time dependencies.", "Service Control Manager status alone does not prove application availability; domain trust is not the same as a local account.", "Test changes in a dedicated Windows VM and use event evidence before widening permissions."] },
    "enterprise-infrastructure-services": { title: "Choose the right sharing and identity boundary", notes: ["Map NFS export paths, SMB shares, client identity mapping, file ACLs and AD/domain authority. Note which machine owns file bytes.", "A successful share connection does not prove that the effective user can safely read and write intended files.", "Test permitted and denied operations from a second client before declaring the service available."] },
    "steward-homelab-v1": { title: "Prove the integrated platform end to end", notes: ["Map the Steward request through DNS, network routing, VM, Linux service, database, persistent storage and dependent infrastructure. Define a known-good request and recovery checkpoint.", "A healthy individual component does not establish an operational platform; a single Proxmox host is not highly available.", "Capture one reproducible normal run, one bounded injected failure, root-cause localization and verified recovery."] },
};

function path(id: string, title: string, lessons: AuthoredLesson[]): AuthoredLearningPath {
    const guide = platformFieldGuides[id];
    if (!guide) throw new Error(`Missing Platform Builder prerequisite guide: ${id}`);
    const readiness: AuthoredLesson = {
        id: `${id}-operational-readiness`,
        title: `Operational readiness: ${guide.title}`,
        activities: [{ type: "reading", title: guide.title, description: guide.notes.join("\\n\\n") }],
    };
    return { id, title, lessons: [readiness, ...lessons] };
}
function beforeClosingReview(lessons: AuthoredLesson[], milestone: AuthoredLesson): AuthoredLesson[] { return [...lessons.slice(0, -1), milestone, ...lessons.slice(-1)]; }

export const computerAndOsFoundations = path("computer-and-os-foundations", "Computer and Operating-System Foundations", computerAndOsFoundationsQualityLessons);
export const linuxAdministration = path("linux-administration", "Linux Administration", linuxAdministrationQualityLessons);
export const networkingFoundations = path("networking-foundations", "Networking Foundations", networkingFoundationsQualityLessons);
export const packetTracerNetworkEngineering = path("packet-tracer-network-engineering", "Network Engineering with Cisco Packet Tracer", packetTracerNetworkEngineeringDeepLessons);
export const virtualization = path("virtualization", "Virtualization", virtualizationQualityLessons);
export const bareMetalFoundations = path("bare-metal-foundations", "Bare-Metal Platform Foundations", bareMetalFoundationsDeepLessons);
export const budgetHomelab = path("budget-homelab", "Building the Budget Homelab", budgetHomelabQualityLessons);
export const proxmoxHomelab = path("proxmox-homelab-platform", "Proxmox VE Homelab Platform", beforeClosingReview(proxmoxHomelabDeepLessons, proxmoxImplementationMilestone));
export const enterpriseStorageNas = path("enterprise-storage-nas", "Enterprise Storage and NAS Operations", enterpriseStorageNasDeepLessons);
export const coreInfrastructureServices = path("core-infrastructure-services", "Core Infrastructure Services: DNS, DHCP and Time", beforeClosingReview(coreInfrastructureServicesDeepLessons, coreInfrastructureImplementationMilestone));
export const platformConfigurationManagement = path("platform-configuration-management", "Configuration Management with Ansible", configurationManagementDeepLessons);
export const osPatchingLifecycle = path("os-patching-lifecycle", "OS Patching and Lifecycle Operations", beforeClosingReview(osPatchingLifecycleDeepLessons, osLifecycleImplementationMilestone));
export const windowsPowerShellEnterprise = path("windows-powershell-enterprise", "Windows and PowerShell Mixed-Enterprise Operations", beforeClosingReview(windowsPowerShellEnterpriseDeepLessons, windowsEnterpriseImplementationMilestone));
export const enterpriseInfrastructureServices = path("enterprise-infrastructure-services", "Enterprise File and Directory Services", enterpriseFileAndDirectoryServicesDeepLessons);
export const stewardHomelabV1 = path("steward-homelab-v1", "Platform Builder Milestone", stewardHomelabV1DeepLessons);

export const platformBuilderPaths: AuthoredLearningPath[] = [
    computerAndOsFoundations,
    linuxAdministration,
    networkingFoundations,
    packetTracerNetworkEngineering,
    virtualization,
    bareMetalFoundations,
    budgetHomelab,
    proxmoxHomelab,
    enterpriseStorageNas,
    coreInfrastructureServices,
    platformConfigurationManagement,
    osPatchingLifecycle,
    windowsPowerShellEnterprise,
    enterpriseInfrastructureServices,
    stewardHomelabV1,
];
