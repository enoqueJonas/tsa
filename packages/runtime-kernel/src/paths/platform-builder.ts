import type { AuthoredLearningPath, AuthoredLesson } from "./normalize-authored-curriculum";
import { bareMetalFoundationsDeepLessons } from "./platform-builder-bare-metal-foundations-deep";
import { budgetHomelabQualityLessons } from "./platform-builder-budget-homelab-quality";
import { computerAndOsFoundationsQualityLessons } from "./platform-builder-computer-os-quality";
import { configurationManagementDeepLessons } from "./platform-builder-configuration-management-deep";
import { coreInfrastructureServicesDeepLessons } from "./platform-builder-core-infrastructure-services-deep";
import { enterpriseFileAndDirectoryServicesDeepLessons } from "./platform-builder-enterprise-file-directory-services-deep";
import { enterpriseStorageNasDeepLessons } from "./platform-builder-enterprise-storage-nas-deep";
import { enterpriseFileIntegrationDeepLessons } from "./system-thinker-enterprise-file-integration-deep";
import { linuxAdministrationQualityLessons } from "./platform-builder-linux-administration-quality";
import { stewardHomelabV1DeepLessons } from "./platform-builder-milestone-deep";
import { networkingFoundationsQualityLessons } from "./platform-builder-networking-quality";
import { osPatchingLifecycleDeepLessons } from "./platform-builder-os-patching-lifecycle-deep";
import { packetTracerNetworkEngineeringDeepLessons } from "./platform-builder-packet-tracer-network-engineering-deep";
import { proxmoxHomelabDeepLessons } from "./platform-builder-proxmox-homelab-deep";
import { proxmoxImplementationMilestone } from "./platform-builder-proxmox-milestone";
import { virtualizationQualityLessons } from "./platform-builder-virtualization-quality";
import { windowsPowerShellEnterpriseDeepLessons } from "./platform-builder-windows-powershell-enterprise-deep";

function path(id: string, title: string, lessons: AuthoredLesson[]): AuthoredLearningPath { return { id, title, lessons }; }

export const computerAndOsFoundations = path("computer-and-os-foundations", "Computer and Operating-System Foundations", computerAndOsFoundationsQualityLessons);
export const linuxAdministration = path("linux-administration", "Linux Administration", linuxAdministrationQualityLessons);
export const networkingFoundations = path("networking-foundations", "Networking Foundations", networkingFoundationsQualityLessons);
export const packetTracerNetworkEngineering = path("packet-tracer-network-engineering", "Network Engineering with Cisco Packet Tracer", packetTracerNetworkEngineeringDeepLessons);
export const virtualization = path("virtualization", "Virtualization", virtualizationQualityLessons);
export const bareMetalFoundations = path("bare-metal-foundations", "Bare-Metal Platform Foundations", bareMetalFoundationsDeepLessons);
export const budgetHomelab = path("budget-homelab", "Building the Budget Homelab", budgetHomelabQualityLessons);
const proxmoxLessons = [...proxmoxHomelabDeepLessons.slice(0, -1), proxmoxImplementationMilestone, ...proxmoxHomelabDeepLessons.slice(-1)];
export const proxmoxHomelab = path("proxmox-homelab-platform", "Proxmox VE Homelab Platform", proxmoxLessons);
export const enterpriseStorageNas = path("enterprise-storage-nas", "Enterprise Storage and NAS Operations", enterpriseStorageNasDeepLessons);
export const coreInfrastructureServices = path("core-infrastructure-services", "Core Infrastructure Services: DNS, DHCP and Time", coreInfrastructureServicesDeepLessons);
export const platformConfigurationManagement = path("platform-configuration-management", "Configuration Management with Ansible", configurationManagementDeepLessons);
export const osPatchingLifecycle = path("os-patching-lifecycle", "OS Patching and Lifecycle Operations", osPatchingLifecycleDeepLessons);
export const windowsPowerShellEnterprise = path("windows-powershell-enterprise", "Windows and PowerShell Mixed-Enterprise Operations", windowsPowerShellEnterpriseDeepLessons);
export const enterpriseInfrastructureServices = path("enterprise-infrastructure-services", "Enterprise File and Directory Services", enterpriseFileAndDirectoryServicesDeepLessons);
export const enterpriseFileIntegration = path("enterprise-file-integration", "Enterprise File and Batch Integration", enterpriseFileIntegrationDeepLessons);
export const stewardHomelabV1 = path("steward-homelab-v1", "Platform Builder Milestone", stewardHomelabV1DeepLessons);

// Dependency order is intentional: foundations and physical design precede the
// concrete hypervisor; the resulting virtual platform then hosts storage and
// infrastructure services before configuration/lifecycle and mixed-estate work.
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
    enterpriseFileIntegration,
    stewardHomelabV1,
];
