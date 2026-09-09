import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
import { computerAndOsFoundationsDeepLessons } from "./platform-builder-computer-os-deep";
import { linuxAdministrationDeepLessons } from "./platform-builder-linux-administration-deep";
import { networkingFoundationsDeepLessons } from "./platform-builder-networking-deep";

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = {
        id: `${lessonId}-001`,
        title,
        estimatedMinutes: title.startsWith("Milestone:") ? 240 : practical ? 60 : 12,
        content: practical
            ? {
                  type: "practical",
                  objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the learner-managed Steward platform.`,
                  scenario: "Use Steward API and the infrastructure you control. Prefer direct observation, commands, diagrams and configuration evidence over memorized definitions.",
                  instructions: [
                      "State the platform behavior or infrastructure outcome you need to achieve.",
                      "Build or configure the smallest environment that proves the concept.",
                      "Inspect the system with appropriate operating-system or networking tools.",
                      "Introduce at least one realistic failure or misconfiguration and diagnose it.",
                      "Record commands, topology, configuration and observations so the work is reproducible.",
                  ],
                  deliverables: ["Working infrastructure or diagnostic evidence", "Reproducible engineering notes"],
                  completionCriteria: [
                      "The learner can explain what happens below the application layer.",
                      "The result is demonstrated on learner-managed infrastructure.",
                      "At least one failure path is investigated rather than avoided.",
                  ],
              }
            : {
                  type: "reading",
                  body: focus ?? `This breadth lesson establishes ${title} as a platform-engineering capability. Deep authoring will later add full TSA teaching, examples, researched resources and knowledge checks.`,
              },
    };

    return { id: lessonId, title, activities: [activity] };
}

function path(id: string, title: string, lessons: Lesson[]): LearningPath {
    return { id, title, lessons };
}

export const computerAndOsFoundations = path("computer-and-os-foundations", "Computer and Operating-System Foundations", computerAndOsFoundationsDeepLessons);
export const linuxAdministration = path("linux-administration", "Linux Administration", linuxAdministrationDeepLessons);
export const networkingFoundations = path("networking-foundations", "Networking Foundations", networkingFoundationsDeepLessons);

export const virtualization = path("virtualization", "Virtualization", [
    lesson("virtualization", "Virtual Machines and Hypervisors"),
    lesson("virtualization", "VM CPU, Memory and Storage"),
    lesson("virtualization", "Virtual Networking Modes"),
    lesson("virtualization", "Snapshots and Recovery"),
    lesson("virtualization", "Lab: Build an Ubuntu Server VM", "Create the first dedicated Ubuntu Server VM for TSA, configure networking and SSH, install the application stack and prove that Steward API can be operated independently of the development environment."),
]);

export const budgetHomelab = path("budget-homelab", "Building the Budget Homelab", [
    lesson("budget-homelab", "Designing a Learning Homelab"),
    lesson("budget-homelab", "Choosing Budget Hardware"),
    lesson("budget-homelab", "CPU, RAM, Storage and NIC Trade-offs"),
    lesson("budget-homelab", "Power, Noise and Reliability"),
    lesson("budget-homelab", "Ethernet Switches and Cabling"),
    lesson("budget-homelab", "Designing the Home Network Topology"),
    lesson("budget-homelab", "Static Addressing"),
    lesson("budget-homelab", "Multiple Hosts and VMs"),
    lesson("budget-homelab", "Remote Administration"),
    lesson("budget-homelab", "Local Firewalling"),
    lesson("budget-homelab", "Local DNS Concepts"),
    lesson("budget-homelab", "Reverse Proxies"),
    lesson("budget-homelab", "Storage and Backups"),
    lesson("budget-homelab", "Safe Exposure and Isolation"),
    lesson("budget-homelab", "VLAN Concepts"),
    lesson("budget-homelab", "Planning Capacity for Internal Platform Services", "Reserve realistic compute, memory, storage and network capacity for future internal services such as CI runners, Nexus Repository, monitoring and security tooling without installing them prematurely."),
    lesson("budget-homelab", "Lab: Move Steward API into the Homelab", "Move Steward API from the laptop-only VM environment onto budget learner-owned hardware connected through a physical switch, document addressing/topology and prove remote administration and service recovery."),
]);

export const stewardHomelabV1 = path("steward-homelab-v1", "Platform Builder Milestone", [
    lesson("steward-homelab-v1", "Milestone: Steward Homelab v1", "Deliver a documented learner-managed homelab where Steward API runs as a Linux service on physical or virtualized budget infrastructure. Include topology, addressing, switching, SSH, permissions, service management, firewalling, DNS/reverse-proxy approach, backups, recovery evidence and capacity reserved for later internal platform services such as Nexus and CI runners."),
]);

export const platformBuilderPaths: LearningPath[] = [
    computerAndOsFoundations,
    linuxAdministration,
    networkingFoundations,
    virtualization,
    budgetHomelab,
    stewardHomelabV1,
];
