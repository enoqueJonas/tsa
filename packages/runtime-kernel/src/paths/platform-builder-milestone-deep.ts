import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const ubuntu: LearningResource = { title: "Ubuntu Server documentation", url: "https://documentation.ubuntu.com/server/" };
const systemd: LearningResource = { title: "systemd documentation", url: "https://systemd.io/" };
const nginx: LearningResource = { title: "NGINX documentation", url: "https://nginx.org/en/docs/" };

function reading(title: string, body: string, sections: Array<{ heading: string; paragraphs: string[]; list?: string[] }>, resources: LearningResource[] = [ubuntu]): Lesson {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const blocks: LessonBlock[] = [{ type: "paragraph", text: body }];
    for (const section of sections) {
        const id = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        blocks.push({ type: "heading", id, text: section.heading, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
        if (section.list) blocks.push({ type: "list", items: section.list });
    }
    blocks.push({ type: "resources", title: "Supporting references", resources });
    return { id: `steward-homelab-v1-${slug}`, title, activities: [{ id: `steward-homelab-v1-${slug}-001`, title, estimatedMinutes: 30, content: { type: "reading", body, blocks } }] };
}

function gate(title: string, objective: string, instructions: string[], deliverables: string[], completionCriteria: string[]): Lesson {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
        id: `steward-homelab-v1-${slug}`,
        title,
        activities: [{
            id: `steward-homelab-v1-${slug}-001`,
            title,
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective,
                scenario: "Treat the current Steward homelab as a platform that another engineer must be able to inspect, operate, break safely and recover. Reuse evidence from prior Platform Builder labs where it is still valid; do not recreate artifacts only for presentation.",
                instructions,
                deliverables,
                completionCriteria,
            },
        }],
    };
}

export const stewardHomelabV1DeepLessons: Lesson[] = [
    reading(
        "Milestone Brief: Steward Homelab v1",
        "The Platform Builder milestone is an operational proof, not a diagram exercise. Steward should now run on learner-managed infrastructure with explicit compute, Linux, network, storage, access and recovery boundaries. The milestone consolidates that work into evidence another engineer can review.",
        [
            { heading: "What the milestone proves", paragraphs: ["The learner can operate the system below the application layer, explain how clients reach it, identify which components share failure domains and recover from controlled infrastructure failures."], list: ["Known host and VM inventory", "Reproducible Linux service lifecycle", "Verified network path and policy", "Protected administrative access", "Persistent-state backup and restore evidence", "Capacity assumptions for later internal platform services"] },
            { heading: "Reuse, reconcile, improve", paragraphs: ["Bring forward the strongest evidence from Linux Administration, Networking, Virtualization and the Budget Homelab. If two artifacts disagree, reconcile them before submission. The portfolio should describe the current running system, not several historical versions mixed together." ] },
            { heading: "Boundary with later schools", paragraphs: ["Do not install CI, Nexus, Prometheus or security platforms simply to make the homelab look mature. Platform Builder proves the substrate and operating model. Delivery, Reliability and Security schools will add those services when their requirements exist." ] },
        ],
        [ubuntu, systemd, nginx],
    ),
    gate(
        "Gate 1: Infrastructure and Topology Baseline",
        "Produce one authoritative view of the current Steward homelab and prove that every important compute and network boundary in it is understood.",
        ["Reconcile the physical and logical topology into one current baseline.", "List physical hosts, VMs, operating systems, interfaces, IP addresses, gateways, service roles and ownership.", "Mark shared failure domains such as one physical host, one disk, one switch, one router or one power source.", "For each major boundary, state how you would prove whether it is healthy."],
        ["Current physical/logical topology", "Host and VM inventory", "Address and service inventory", "Shared-failure-domain notes"],
        ["The topology matches the running environment.", "No important host or network boundary exists only in the learner's memory.", "Shared physical dependencies are acknowledged rather than mistaken for redundancy."],
    ),
    gate(
        "Gate 2: Linux Service and Administrative Control",
        "Prove that Steward is operated as a real Linux service through a controlled administrative path rather than as a developer-owned foreground process.",
        ["Show the dedicated service identity, files/directories it needs and permissions it actually has.", "Show the systemd unit and the commands used to start, stop, restart, inspect and enable the service.", "Show how configuration is supplied without embedding secrets in source control.", "Prove key-based remote administration and record the recovery path if remote access is misconfigured.", "Use journal evidence to explain one recent service start or restart."],
        ["Service identity and permission evidence", "systemd lifecycle evidence", "Configuration/secrets handling note", "SSH administration evidence", "Relevant journal excerpt or observation"],
        ["Steward runs independently of an interactive shell.", "The service does not require unrestricted root execution.", "Another engineer can identify how the service is managed and where to inspect failures."],
    ),
    gate(
        "Gate 3: Network Reachability and Policy",
        "Prove the intended client-to-Steward path from name/address resolution through transport, firewall policy and application entry point.",
        ["Capture a healthy request from a separate client and document each observable boundary along the path.", "Show the listener address/port and the firewall rules that intentionally permit the path.", "Document the local DNS and reverse-proxy design, including any deliberately deferred part.", "Demonstrate one denied or non-exposed path so the policy is proven in both directions.", "Record which parts of the path are local-link, routed, proxied or translated."],
        ["Healthy path evidence", "Listener and firewall evidence", "DNS/reverse-proxy note", "Denied-path evidence", "Client-to-service path narrative"],
        ["A successful HTTP response is supported by lower-layer evidence rather than treated as the only proof.", "The intended exposure is explicit and minimal.", "DNS, firewalling, routing, proxying and application failures are distinguishable in the documentation."],
    ),
    gate(
        "Gate 4: Persistence, Backup and Recovery",
        "Prove that the persistent state required to reconstruct Steward is known and that at least one recovery path has actually been tested.",
        ["Inventory persistent state: database data, service configuration, reverse-proxy configuration, unit files and other non-generated operational state.", "Identify the filesystem or device backing each important path.", "Create a backup using the current homelab strategy and record where it resides relative to the primary failure domain.", "Restore a safe copy or isolated instance and record the verification result.", "State the current acceptable data-loss and recovery assumptions."],
        ["Persistent-state inventory", "Storage/mount evidence", "Backup record", "Restore test evidence", "Recovery assumptions"],
        ["The learner can distinguish backup from snapshot and from source control.", "The backup is not accepted solely because a file exists.", "At least one restoration path is demonstrated with evidence."],
    ),
    gate(
        "Gate 5: Failure Drill and Operational Diagnosis",
        "Demonstrate evidence-driven recovery from one controlled infrastructure failure without guessing across layers.",
        ["Choose one recoverable failure below the application code: service configuration, permission, host firewall, VM network, storage path, DNS/proxy configuration or similar.", "Record the healthy baseline before introducing the fault.", "Introduce the failure deliberately and state the observed symptom without naming the cause prematurely.", "Work from broad boundary checks toward the failing layer and record the last confirmed-good and first confirmed-bad observations.", "Restore service and verify the original client path again.", "Write a short prevention or faster-detection improvement proportional to the failure."],
        ["Failure scenario", "Diagnostic timeline", "Command/output evidence", "Recovery verification", "One improvement proposal"],
        ["The failure is controlled and recoverable.", "Diagnosis follows evidence rather than random configuration changes.", "The learner identifies the correct infrastructure boundary before applying the fix.", "Recovery includes end-to-end verification."],
    ),
    gate(
        "Gate 6: Capacity and Future Platform Readiness",
        "Produce a realistic capacity and dependency handoff for the next school without prematurely installing future platform services.",
        ["Record total and currently available CPU, RAM, storage and relevant network capacity.", "Estimate current Steward consumption from observation, not vendor sizing tables.", "Reserve a reasonable envelope for later CI runners, Nexus Repository and supporting delivery services.", "Identify the first resource likely to constrain growth and what measurement would justify expansion.", "List operational assumptions Delivery Engineer must inherit: host/VM placement, network access, persistent storage, administrative access and unresolved risks."],
        ["Current capacity baseline", "Reserved-capacity plan", "Likely first constraint and measurement trigger", "Delivery Engineer handoff"],
        ["Capacity numbers are tied to the learner's actual hardware.", "Future services are planned but not installed only to satisfy the milestone.", "The handoff makes the existing platform usable as the substrate for Delivery Engineer."],
    ),
    {
        id: "steward-homelab-v1-review-and-exit",
        title: "Milestone Review and Exit Criteria",
        activities: [
            {
                id: "steward-homelab-v1-review-and-exit-001",
                title: "Assemble the Platform Builder Evidence Pack",
                estimatedMinutes: 90,
                content: {
                    type: "practical",
                    objective: "Assemble one reviewable evidence pack that proves Steward Homelab v1 is understandable, operable and recoverable.",
                    scenario: "A second engineer should be able to review the platform without relying on verbal explanation from the learner.",
                    instructions: ["Create a single index that links to each current artifact rather than copying the same information into several documents.", "Remove stale topology, addresses or commands that no longer describe the environment.", "For each artifact, state what question it answers and when it was last verified.", "Include at least one known limitation or residual risk rather than presenting the homelab as production-grade.", "End with a concise Delivery Engineer handoff: what exists, how Steward runs, where artifacts may later be hosted, and what must not be assumed."],
                    deliverables: ["Indexed Platform Builder evidence pack", "Current-state verification notes", "Known limitations and residual risks", "Delivery Engineer handoff"],
                    completionCriteria: ["Every major Platform Builder capability is supported by current evidence.", "Contradictory or stale artifacts have been reconciled.", "The environment can be understood and operated by another engineer from the documentation.", "The handoff preserves the existing system and infrastructure rather than redesigning it for the next school."],
                },
            },
            {
                id: "steward-homelab-v1-review-and-exit-002",
                title: "Platform Builder Exit Reflection",
                estimatedMinutes: 20,
                content: {
                    type: "reflection",
                    prompt: "If your development laptop disappeared today, what parts of Steward would continue to run, what parts of the homelab could you still administer or recover, and which remaining dependency would prevent a full reconstruction? Use evidence from the milestone rather than assumptions.",
                },
            },
        ],
    },
];
