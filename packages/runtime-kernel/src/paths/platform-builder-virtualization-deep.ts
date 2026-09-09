import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const ubuntuVirtualization: LearningResource = { title: "Ubuntu virtualization documentation", url: "https://documentation.ubuntu.com/server/how-to/virtualisation/" };
const libvirtDocs: LearningResource = { title: "libvirt documentation", url: "https://libvirt.org/docs.html" };
const qemuDocs: LearningResource = { title: "QEMU documentation", url: "https://www.qemu.org/docs/master/" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function richLesson(
    title: string,
    introduction: string,
    outcomes: string[],
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[],
    objective: string,
    instructions: string[],
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `virtualization-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: outcomes },
    ];

    for (const section of sections) {
        blocks.push({ type: "heading", id: slug(section.title), text: section.title, level: 2 });
        for (const text of section.paragraphs) blocks.push({ type: "paragraph", text });
        if (section.code) {
            blocks.push(section.code.caption
                ? { type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption }
                : { type: "code", language: section.code.language, code: section.code.code });
        }
    }

    blocks.push({ type: "callout", tone: "steward", title: "Steward connection", body: "Virtualization is useful here only when it creates a clearer operational boundary for Steward: an independently bootable host with explicit CPU, memory, storage and network assumptions that can be inspected, broken and recovered." });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 35, content: { type: "reading", body: introduction, blocks } },
            {
                id: `${id}-practice`,
                title: `${title}: Platform Practice`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Use the learner-managed environment that will host Steward API. Prefer observed VM behavior and configuration evidence over vendor-specific button sequences.",
                    instructions,
                    deliverables: ["VM configuration or command evidence", "Short explanation of the operational trade-off"],
                    completionCriteria: ["The learner can explain the boundary created by the VM.", "The evidence distinguishes host resources from guest-visible resources.", "At least one choice is justified in terms of Steward operation rather than convenience alone."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const virtualizationDeepLessons: Lesson[] = [
    richLesson(
        "Virtual Machines and Hypervisors",
        "A virtual machine is not just 'another computer in a window.' It is an isolation boundary implemented by a hypervisor that presents virtual CPU, memory, storage and devices to a guest operating system while sharing physical hardware with other workloads.",
        ["Explain the role of a hypervisor.", "Distinguish host, guest and VM boundaries.", "Compare type-1 and hosted hypervisor models without treating the labels as performance guarantees.", "Identify which failures remain shared at the physical-host layer."],
        [
            { title: "The boundary is logical, not magical", paragraphs: ["A VM receives virtual hardware and runs its own kernel. That gives strong operational separation from another guest, but every guest still depends on the physical host, hypervisor and underlying storage/networking.", "For Steward, the useful question is what the VM isolates: package state, service configuration, process namespace, filesystem layout and reboot lifecycle. It does not eliminate host-level power, disk or hypervisor failure."] },
            { title: "Choose virtualization for an outcome", paragraphs: ["Virtualization is valuable when you need independent lifecycle, reproducible operating-system state or safer experiments. It is waste when added only because a platform diagram looks more advanced.", "The TSA goal is therefore to make Steward independently operable from the development laptop, not to maximize VM count."], code: { language: "text", code: "Physical host\n  └── Hypervisor\n      ├── Ubuntu VM: Steward API\n      └── Future VM: platform services", caption: "One physical machine can expose multiple independently managed guest boundaries." } },
        ],
        "Describe the host/guest boundary for the machine that will run Steward and identify which failure modes are isolated versus shared.",
        ["Identify the physical host and virtualization technology you will use.", "List what is isolated inside the Steward VM.", "List at least three failures that would still affect the VM from outside it.", "State why one VM is enough at this stage instead of creating several by default."],
        ["What does the hypervisor virtualize for a guest?", "Why does a VM not remove the physical host as a failure dependency?", "When does adding another VM create useful isolation?"],
        [ubuntuVirtualization, libvirtDocs, qemuDocs],
    ),
    richLesson(
        "VM CPU, Memory and Storage",
        "Virtual resources are allocations backed by real host capacity. Overcommitting them can be useful, but only when you understand the contention and failure behavior that appears when multiple guests demand the same finite resources at once.",
        ["Relate vCPU and guest memory to physical host capacity.", "Explain overcommit and contention.", "Distinguish virtual disk size from physical storage consumption and performance.", "Choose conservative resources for Steward based on evidence rather than guesswork."],
        [
            { title: "vCPU is scheduled work", paragraphs: ["A vCPU is not a dedicated physical core unless the platform is configured that way. The hypervisor schedules guest CPU work onto physical CPUs, so allocating more vCPUs than a workload can use may add complexity without improving throughput.", "Use the machine baseline from Computer and OS Foundations to size Steward initially, then adjust from observed CPU pressure rather than from arbitrary production-like numbers."] },
            { title: "Memory pressure crosses guest boundaries", paragraphs: ["Guest memory must ultimately be backed by host memory. If the host becomes pressured, multiple VMs can slow simultaneously even when each guest appears correctly configured.", "Virtual disks add another layer: guest filesystem behavior depends on the virtual disk format, host filesystem, physical device and cache path beneath it."], code: { language: "bash", code: "free -h\nlsblk\ndf -h\n# compare these inside the guest with host-side VM allocation", caption: "Always compare what the guest sees with what the host actually provides." } },
        ],
        "Create a resource budget for the Steward VM and defend each allocation against host capacity and expected workload.",
        ["Record host CPU, memory and free storage.", "Choose initial vCPU, RAM and virtual disk allocation for Steward.", "Explain what symptom would justify increasing each resource.", "Reserve enough host capacity for the host OS and future TSA services."],
        ["Why can allocating more vCPUs fail to improve performance?", "What is resource overcommit?", "Why is a 50 GB virtual disk not automatically 50 GB of physically consumed storage?"],
        [ubuntuVirtualization, libvirtDocs],
    ),
    richLesson(
        "Virtual Networking Modes",
        "A VM can be perfectly healthy and still be unreachable because its virtual network boundary is wrong. NAT, bridged and host-only style networks create different reachability, address ownership and failure behavior.",
        ["Explain common virtual networking modes.", "Choose between NAT and bridged reachability for Steward.", "Trace packets through guest, virtual switch and physical network boundaries.", "Recognize when host firewall or hypervisor networking is the broken layer."],
        [
            { title: "NAT hides the guest behind another address", paragraphs: ["In a NAT-style VM network, the guest can usually initiate outbound connections while inbound access requires forwarding or hypervisor-specific rules. This is convenient for isolated development but can obscure how another machine on the LAN reaches Steward.", "If the learning goal is remote administration from another physical device, the networking mode must make that path explicit rather than accidentally relying on the host as an invisible proxy."] },
            { title: "Bridging makes the guest a LAN participant", paragraphs: ["A bridged guest typically receives or uses an address on the same LAN as the host and can be reached more directly by other LAN devices, subject to firewall and switch policy.", "Bridging is not automatically better. It creates a clearer network identity but also exposes the guest to more of the local network, so firewalling and address planning matter."], code: { language: "bash", code: "ip addr\nip route\nip neigh\nss -lntp\nping <gateway>\ncurl http://<steward-vm-ip>:<port>", caption: "Validate identity, route, neighbor reachability and listening sockets as separate boundaries." } },
        ],
        "Choose and validate a virtual networking mode for Steward that supports SSH administration and client access from the intended network.",
        ["Document the selected networking mode.", "Record guest IP, default route and DNS settings.", "Prove SSH access from the administration machine.", "Prove Steward access from an intended client.", "Explain one failure symptom caused by the hypervisor/virtual-switch layer rather than the guest OS."],
        ["What reachability trade-off does NAT introduce?", "What changes when a guest is bridged onto the LAN?", "Why can a listening service remain unreachable even when the guest OS is healthy?"],
        [ubuntuVirtualization, libvirtDocs],
    ),
    richLesson(
        "Snapshots and Recovery",
        "Snapshots are useful learning and recovery tools, but they are not backups. They capture VM state relative to underlying storage and can make experiments reversible, while still sharing failure dependencies with the original host and storage.",
        ["Explain what a VM snapshot captures.", "Distinguish snapshot, clone and backup.", "Use snapshots for controlled experiments rather than permanent state management.", "Recognize consistency risks when snapshotting stateful services."],
        [
            { title: "Snapshots optimize rollback", paragraphs: ["A snapshot lets you return a VM to an earlier state quickly. That is ideal before a package upgrade, configuration experiment or destructive lab because it lowers the cost of exploration.", "But a snapshot stored on the same host is not protection against host disk failure, theft or corruption. Backup requires an independent recovery copy with tested restore behavior."] },
            { title: "Stateful systems need consistency reasoning", paragraphs: ["A running PostgreSQL instance may have in-memory and on-disk state in transition when a VM snapshot is taken. Hypervisor snapshots can be crash-consistent rather than application-consistent unless the workload is quiesced or coordinated.", "For TSA, use snapshots to support learning, but keep database backup and restore as a separate operational responsibility."], code: { language: "text", code: "Snapshot → fast rollback on same virtualization environment\nBackup   → independent copy for recovery after loss\nClone    → new VM derived from existing state", caption: "These mechanisms solve different recovery problems." } },
        ],
        "Plan one safe snapshot experiment for Steward and document why the snapshot does not replace a real backup.",
        ["Take or plan a snapshot before a controlled configuration change.", "Perform the change and validate its effect.", "Rollback and verify the original service state.", "Document where the snapshot data physically lives.", "Describe how Steward database recovery would differ from VM rollback."],
        ["Why is a snapshot not a backup?", "What does crash-consistent mean?", "When is a snapshot especially useful in a learning homelab?"],
        [ubuntuVirtualization, libvirtDocs],
    ),
    {
        id: "virtualization-lab-build-an-ubuntu-server-vm",
        title: "Lab: Build an Ubuntu Server VM",
        activities: [
            {
                id: "virtualization-lab-build-an-ubuntu-server-vm-brief",
                title: "Build the Steward VM deliberately",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "This lab creates the first dedicated server boundary for Steward. The finished VM must be independently bootable, remotely administrable and understandable from resource, storage and network evidence.",
                    blocks: [
                        { type: "heading", id: "required-evidence", text: "Required evidence", level: 2 },
                        { type: "list", items: ["Host capacity and chosen VM resource budget", "Ubuntu Server guest installation", "Guest addressing and networking mode", "SSH key access", "Steward and PostgreSQL running inside the guest", "systemd-owned Steward lifecycle", "One snapshot/rollback experiment", "One diagnosed VM-layer or guest-layer failure"] },
                        { type: "callout", tone: "warning", title: "Do not hide the network", body: "The lab is incomplete if Steward works only through a hypervisor convenience feature you cannot explain. Document the actual guest address, route, listener and access path." },
                    ],
                },
            },
            {
                id: "virtualization-lab-build-an-ubuntu-server-vm-build",
                title: "Build, operate and break the VM",
                estimatedMinutes: 150,
                content: {
                    type: "practical",
                    objective: "Create a dedicated Ubuntu Server VM that runs Steward independently of the development environment and prove its resource, network, service and recovery boundaries.",
                    scenario: "Treat this VM as the first real server in the TSA platform. Keep the design minimal and observable.",
                    instructions: [
                        "Record physical-host CPU, memory and storage before allocating the VM.",
                        "Create the VM with justified vCPU, RAM and disk values.",
                        "Install Ubuntu Server and create a non-root administrative user.",
                        "Configure a deliberate networking mode and document guest IP, route and DNS.",
                        "Configure key-based SSH and prove remote administration from another terminal or machine.",
                        "Install the Steward runtime and PostgreSQL, then operate Steward through systemd using the Linux Administration standard.",
                        "Prove Steward is reachable through the documented network path.",
                        "Create a snapshot, make one safe configuration change, verify it, then rollback and re-verify service state.",
                        "Introduce one recoverable failure at either VM configuration or guest-service level and diagnose the correct boundary before fixing it.",
                        "Record one risk that remains shared with the physical host and one capacity assumption to carry into the homelab design."],
                    deliverables: ["VM build sheet with resource budget", "Network and SSH evidence", "Steward/systemd service evidence", "Snapshot/rollback record", "Failure diagnosis record", "Handoff notes for Building the Budget Homelab"],
                    completionCriteria: ["The VM boots and operates independently from the development process.", "Steward is managed as a Linux service inside the guest.", "Remote access follows a documented network path.", "Snapshot behavior is correctly distinguished from backup.", "A controlled failure is localized to the correct host/virtualization/guest/application boundary."]
                }
            },
            { id: "virtualization-lab-build-an-ubuntu-server-vm-review", title: "Virtualization Lab Review", estimatedMinutes: 15, content: { type: "reflection", prompt: "1. Which responsibilities are now isolated inside the VM?\n2. Which physical-host failures can still take Steward down?\n3. Why did you choose the VM's networking mode?\n4. What did the snapshot protect you from, and what did it not protect you from?\n5. Which constraint should influence the budget homelab design next?" } }
        ]
    }
];