import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { computerAndOsFoundationsDeepLessons } from "./platform-builder-computer-os-deep";

const practices: Record<string, PracticalContent> = {
    "CPU, Memory, Storage and I/O": {
        type: "practical",
        objective: "Build a resource baseline for the Steward host and defend one evidence-backed hypothesis about the first likely bottleneck under higher load.",
        scenario: "Steward feels responsive on the current machine, but the team has no baseline for CPU, memory or storage behavior. Before buying hardware or tuning software, establish what the host actually has and how Steward uses it.",
        instructions: [
            "Record CPU architecture, logical CPU count and current load, then explain what those numbers do and do not tell you about application capacity.",
            "Record total, available and swap memory; explain why low free memory alone is not evidence of memory pressure.",
            "Map storage devices, mounted filesystems, capacity and filesystem type for the paths Steward and PostgreSQL use.",
            "Exercise one representative Steward workflow while observing process CPU and memory consumption plus host-level activity.",
            "Choose the resource you currently expect to constrain Steward first and write the evidence for that hypothesis.",
            "Define one measurement or controlled load experiment that would falsify your hypothesis rather than merely confirm it.",
        ],
        deliverables: ["Host resource baseline", "Observed Steward resource evidence", "Bottleneck hypothesis with falsification test"],
        completionCriteria: ["Capacity, throughput and latency are not treated as interchangeable.", "The hypothesis is grounded in observations from the real host.", "The learner names evidence that would prove the current hypothesis wrong."],
    },
    "What an Operating System Does": {
        type: "practical",
        objective: "Trace one Steward request through the operating-system abstractions it depends on and explain how a failure below the application would surface above it.",
        scenario: "A request fails even though the Django code path looks correct. The investigation must move beneath framework abstractions and identify which operating-system services make the request possible.",
        instructions: [
            "Choose one concrete Steward HTTP request and start from the client connection rather than from a Python function.",
            "Trace the request through the application process to the OS abstractions it depends on: sockets, process scheduling, virtual memory, filesystem access and time where relevant.",
            "For each abstraction, identify one plausible failure or constraint and the symptom the application or user would observe.",
            "Separate behavior controlled mainly by Steward from behavior mediated primarily by the operating system.",
            "Identify one point where a framework error message could mislead an engineer into debugging application code when the actual cause is beneath it.",
        ],
        deliverables: ["Request-to-OS dependency trace", "Failure symptom mapping", "Application-vs-OS responsibility note"],
        completionCriteria: ["The trace reaches real operating-system abstractions rather than stopping at Django.", "At least one application symptom is linked to a lower-level cause.", "Responsibility boundaries are explicit enough to guide troubleshooting."],
    },
    "Kernel Space and User Space": {
        type: "practical",
        objective: "Inspect Steward-related process privileges and justify the minimum operating-system access each service actually requires.",
        scenario: "A permission problem tempts the team to run Steward as root. Before changing privileges, determine which process needs access to which resource and whether the boundary can be fixed without broadening authority.",
        instructions: [
            "Identify the OS users that own the Steward application and PostgreSQL processes in your environment.",
            "List the files, directories, sockets, ports and other resources each process genuinely needs.",
            "Find one permission boundary you can inspect directly and record the current owner/group/mode or equivalent access evidence.",
            "Construct one realistic permission failure and state the narrowest ownership, group or permission change that would fix it.",
            "Explain why running the process as root would solve the symptom while creating a larger security and operational problem.",
            "Record one privilege that the process does not need and should therefore not receive.",
        ],
        deliverables: ["Process privilege inventory", "Permission-boundary evidence", "Least-privilege remediation note"],
        completionCriteria: ["Root is not confused with kernel mode.", "Required privileges are tied to concrete resources.", "The proposed fix narrows access instead of bypassing the privilege boundary."],
    },
    "Processes and Threads": {
        type: "practical",
        objective: "Map Steward's actual runtime process topology and observe what happens when one process is deliberately stopped.",
        scenario: "The source repository looks like one application, but production behavior depends on the runtime process tree. The team needs to know which process owns work, which process supervises others and what a partial process failure looks like.",
        instructions: [
            "Start Steward in the environment used for Platform Builder and capture its process tree with PIDs and parent-child relationships.",
            "Inspect one representative process for state, credentials and open file descriptors.",
            "If workers or threads exist, identify them from OS evidence rather than framework assumptions.",
            "Choose one non-destructive process to stop deliberately and record the immediate service behavior.",
            "Observe whether the process stays down, is restarted by a supervisor or causes sibling processes to fail.",
            "Write the operational restart target: which process or service unit should an operator actually restart and why?",
        ],
        deliverables: ["Runtime process topology", "Process-state/open-descriptor evidence", "Controlled process-failure observation", "Restart-target decision"],
        completionCriteria: ["Runtime architecture is derived from the running system, not inferred only from source code.", "The learner distinguishes a process from a thread or worker where relevant.", "The restart decision follows observed supervision and failure behavior."],
    },
    "Filesystems": {
        type: "practical",
        objective: "Map Steward's important filesystem assumptions to real mount, ownership and capacity evidence, then analyze one filesystem failure path.",
        scenario: "Steward works on one machine but fails after deployment because a path exists with different ownership, sits on a different mount, or reaches a capacity/read-only condition. Treat filesystem layout as part of the runtime architecture.",
        instructions: [
            "Identify the important paths for application code/configuration, PostgreSQL data, logs and backups in the current environment.",
            "For each path, record owner/group/permissions and determine the backing mount and filesystem rather than treating the pathname as the storage boundary.",
            "Identify which paths are ephemeral, reconstructable or contain authoritative/persistent state.",
            "Choose one important filesystem and model what Steward would observe if it became full or read-only.",
            "State which signal would distinguish capacity exhaustion, permission failure and missing-path failure during diagnosis.",
            "Review the backup path and explain whether it shares the same failure domain as the data it is intended to protect.",
        ],
        deliverables: ["Steward filesystem map", "Ownership/mount/capacity evidence", "Filesystem failure diagnosis matrix", "Backup failure-domain note"],
        completionCriteria: ["Paths are connected to backing filesystems and ownership evidence.", "Persistent state is distinguished from reconstructable data.", "The backup location is evaluated as a failure domain, not merely as another directory."],
    },
};

export const computerAndOsFoundationsQualityLessons: Lesson[] = computerAndOsFoundationsDeepLessons.map((lesson) => {
    const practical = practices[lesson.title];
    if (!practical) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical" ? { ...activity, content: practical } : activity,
        ),
    };
});
