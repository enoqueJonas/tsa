import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { virtualizationDeepLessons } from "./platform-builder-virtualization-deep";

function alignToRocky<T>(value: T): T {
    if (Array.isArray(value)) return value.map((item) => alignToRocky(item)) as T;

    if (value && typeof value === "object") {
        const record = value as Record<string, unknown>;
        if (typeof record.url === "string" && record.url.includes("documentation.ubuntu.com")) {
            return {
                ...Object.fromEntries(Object.entries(record).map(([key, item]) => [key, alignToRocky(item)])),
                title: "Rocky Linux documentation",
                url: "https://docs.rockylinux.org/",
            } as T;
        }

        return Object.fromEntries(
            Object.entries(record).map(([key, item]) => [key, alignToRocky(item)]),
        ) as T;
    }

    if (typeof value === "string") {
        return value
            .replaceAll("Ubuntu Server", "Rocky Linux")
            .replaceAll("Ubuntu VM", "Rocky Linux VM")
            .replaceAll("Ubuntu", "Rocky Linux") as T;
    }

    return value;
}

const rockyVirtualizationLessons = virtualizationDeepLessons.map((lesson) => alignToRocky(lesson));

const practices: Record<string, PracticalContent> = {
    "Virtual Machines and Hypervisors": {
        type: "practical",
        objective: "Choose a virtualization boundary for Steward because it solves an operational problem, not because more VMs look more enterprise.",
        scenario: "The Rocky Linux Steward host must become independently bootable and recoverable from the development workstation while still sharing a finite physical machine with future TSA platform services.",
        instructions: [
            "Identify the physical host, virtualization implementation and the guest boundary you will use.",
            "List the state isolated by the Steward VM: kernel, packages, processes, filesystem and reboot lifecycle.",
            "List at least three dependencies that remain shared with the physical host.",
            "Compare one-VM and multi-VM designs for the current Steward stage and reject any VM that has no distinct lifecycle, security or failure-boundary reason.",
            "Record how the chosen virtualization layer could itself fail and what evidence would distinguish that failure from a guest failure.",
        ],
        deliverables: ["Host/guest boundary diagram", "Shared-failure inventory", "VM-count decision"],
        completionCriteria: [
            "Every VM has a stated operational reason to exist.",
            "The learner distinguishes guest isolation from physical-host dependency.",
            "The design remains the smallest useful virtualization model for the current Steward stage.",
        ],
    },
    "VM CPU, Memory and Storage": {
        type: "practical",
        objective: "Size the Rocky Linux Steward VM from observed host capacity and create explicit headroom for the enterprise services that arrive later.",
        scenario: "The homelab must eventually host delivery, data and platform components. Consuming the entire machine for the first VM would make later Jenkins, Nexus, Redis, RabbitMQ, Kong and observability work impossible or misleading.",
        instructions: [
            "Capture physical-host CPU, memory, storage and current utilization.",
            "Choose the initial Steward VM vCPU, RAM and disk allocation and state the evidence behind each value.",
            "Reserve explicit host headroom for the host OS and future TSA platform services rather than allocating every available resource.",
            "Define the guest and host signals that would show CPU contention, memory pressure or storage pressure.",
            "Run one controlled workload or observation and compare guest-visible resources with host-side allocation/pressure.",
            "State which change would be scale-up, which would be workload optimization, and which would require a topology decision instead of simply adding resources.",
        ],
        deliverables: ["Host capacity baseline", "VM resource budget", "Future-service headroom plan", "Pressure-signal map"],
        completionCriteria: [
            "Allocations are evidence-based and leave deliberate platform headroom.",
            "Guest metrics are not confused with physical capacity.",
            "The learner can explain how overcommit could make multiple enterprise services fail together.",
        ],
    },
    "Virtual Networking Modes": {
        type: "practical",
        objective: "Place the Rocky Linux Steward VM on a network that preserves the LAN and WireGuard access model established in Networking Foundations.",
        scenario: "Steward works inside the guest, but the virtualization mode can either preserve the intended private-management boundary or accidentally hide it behind host-only/NAT convenience behavior.",
        instructions: [
            "Compare NAT, bridged and host-only behavior for the actual administration and client paths you need.",
            "Choose the mode that makes the guest's network identity and trust boundary explicit.",
            "Record guest address, prefix, route, DNS and listening sockets.",
            "Prove ordinary intended client reachability to Steward and prove the private WireGuard/management path still behaves as designed.",
            "Trace one packet path through guest interface, virtual switch/bridge, physical interface and upstream network.",
            "Create or simulate one virtualization-layer reachability fault and identify why it is not a Rocky Linux application/service failure.",
        ],
        deliverables: ["Virtual network decision", "End-to-end packet path", "Client and VPN reachability evidence", "Virtual-layer failure diagnosis"],
        completionCriteria: [
            "The VM does not depend on an unexplained hypervisor convenience path.",
            "Public/user, private-management and backend boundaries remain conceptually distinct.",
            "The learner can localize a failure to guest, virtual network or physical network evidence.",
        ],
    },
    "Snapshots and Recovery": {
        type: "practical",
        objective: "Use snapshots as a reversible experiment mechanism while proving that they are not the backup strategy for Steward or PostgreSQL.",
        scenario: "A risky Rocky Linux configuration change should be cheap to reverse, but the platform must not create false confidence by treating a snapshot on the same physical storage as disaster recovery.",
        instructions: [
            "Record where snapshot metadata and blocks physically live before creating one.",
            "Create a snapshot before a controlled OS/service configuration change.",
            "Apply and verify the change, then roll back and prove the prior service state returns.",
            "Identify what would happen if the physical host disk were lost while the snapshot existed.",
            "Explain the consistency risk of snapshotting PostgreSQL while it is active.",
            "Write the handoff: snapshots remain a lab/change-safety tool; database backup/restore and platform recovery deepen later under Reliability Engineering.",
        ],
        deliverables: ["Snapshot location/evidence", "Change-and-rollback record", "Snapshot-versus-backup decision", "Database consistency note"],
        completionCriteria: [
            "Rollback is demonstrated rather than assumed.",
            "Snapshot and independent backup are never described as equivalent.",
            "Stateful-service consistency and the shared physical-storage failure domain are explicit.",
        ],
    },
};

export const virtualizationQualityLessons: Lesson[] = rockyVirtualizationLessons.map((lesson) => {
    const practical = practices[lesson.title];
    if (!practical) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical" ? { ...activity, content: practical } : activity,
        ),
    };
});
