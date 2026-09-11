import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const rockyLinux: LearningResource = { title: "Rocky Linux documentation", url: "https://docs.rockylinux.org/" };
const systemd: LearningResource = { title: "systemd documentation", url: "https://systemd.io/" };
const wireGuard: LearningResource = { title: "WireGuard documentation", url: "https://www.wireguard.com/quickstart/" };
const nginx: LearningResource = { title: "NGINX documentation", url: "https://nginx.org/en/docs/" };

function reading(title: string, body: string, sections: Array<{ heading: string; paragraphs: string[]; list?: string[] }>, resources: LearningResource[] = [rockyLinux]): Lesson {
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
        "The Platform Builder milestone is an operational proof, not a diagram exercise. Steward should now run on learner-managed Rocky Linux infrastructure with explicit compute, operating-system, network, storage, access and recovery boundaries. The milestone consolidates that work into evidence another engineer can review.",
        [
            { heading: "What the milestone proves", paragraphs: ["The learner can operate Steward below the application layer, explain how clients and administrators reach it, identify shared failure domains and recover from controlled infrastructure failures without weakening the host's security model."], list: ["Known host and VM inventory", "Rocky Linux service lifecycle with SELinux enforcing", "Verified client and management network paths", "WireGuard-protected administrative access", "firewalld policy with positive and negative reachability evidence", "Persistent-state backup and restore evidence", "Capacity assumptions for later enterprise platform services"] },
            { heading: "Reuse, reconcile, improve", paragraphs: ["Bring forward the strongest evidence from Linux Administration, Networking, Virtualization and the Budget Homelab. If two artifacts disagree, reconcile them before submission. The portfolio should describe the current running system, not several historical versions mixed together."] },
            { heading: "Boundary with later schools", paragraphs: ["Do not install Jenkins, Nexus, Kong, Keycloak, Prometheus or other later-school platforms simply to make the homelab look mature. Platform Builder proves the substrate, access boundaries and operating model. Delivery, Cloud, Security and Reliability add those services only when the curriculum has established the requirement."] },
        ],
        [rockyLinux, systemd, wireGuard, nginx],
    ),
    gate(
        "Gate 1: Infrastructure and Topology Baseline",
        "Produce one authoritative view of the current Steward homelab and prove that every important compute and network boundary in it is understood.",
        ["Reconcile the physical and logical topology into one current baseline.", "List physical hosts, VMs, Rocky Linux guests/hosts, interfaces, IP addresses, gateways, service roles and ownership.", "Mark public-application, private-management and backend/service traffic as distinct paths even when they currently share physical equipment.", "Mark shared failure domains such as one physical host, one disk, one switch, one router or one power source.", "For each major boundary, state how you would prove whether it is healthy."],
        ["Current physical/logical topology", "Host and VM inventory", "Address, traffic-class and service inventory", "Shared-failure-domain notes"],
        ["The topology matches the running environment.", "No important host or network boundary exists only in the learner's memory.", "Public, management and backend traffic are not conflated.", "Shared physical dependencies are acknowledged rather than mistaken for redundancy."],
    ),
    gate(
        "Gate 2: Rocky Linux Service and Administrative Control",
        "Prove that Steward is operated as a real Rocky Linux service through a controlled administrative path rather than as a developer-owned foreground process.",
        ["Show the dedicated Steward service identity, files/directories it needs and permissions it actually has.", "Show the systemd unit and the commands used to start, stop, restart, inspect and enable the service.", "Show how configuration is supplied without embedding secrets in source control.", "Prove SELinux remains enforcing and show the relevant process/file context evidence for Steward; explain any policy adjustment from AVC evidence rather than disabling enforcement.", "Prove key-based SSH administration through the intended private/WireGuard path and record the recovery path if remote access is misconfigured.", "Use journal evidence to explain one recent service start or restart."],
        ["Service identity and permission evidence", "systemd lifecycle evidence", "SELinux enforcing/context evidence", "Configuration/secrets handling note", "WireGuard/SSH administration evidence", "Relevant journal excerpt or observation"],
        ["Steward runs independently of an interactive shell.", "The service does not require unrestricted root execution.", "SELinux is enforcing and any exception is justified by observed policy evidence.", "Administrative access follows the private-management path.", "Another engineer can identify how the service is managed and where to inspect failures."],
    ),
    gate(
        "Gate 3: Network Reachability, VPN and Policy",
        "Prove the intended client-to-Steward and administrator-to-platform paths from name/address resolution through routing, VPN, firewall policy and application entry point.",
        ["Capture a healthy Steward request from a separate client and document each observable boundary along the path.", "Show the listener address/port and firewalld rules that intentionally permit the required application path.", "Prove the WireGuard management path independently: interface/address, route and handshake evidence must be distinguishable.", "Demonstrate that SSH or another selected management resource succeeds from an authorized VPN client and fails from the non-VPN/untrusted path.", "Document the local DNS and reverse-proxy design, including any deliberately deferred part.", "Demonstrate one additional denied or non-exposed backend path so the policy is proven in both directions.", "Record whether the current home network has direct inbound public addressing, port-forwarding capability or CGNAT constraints for the future Cloud Engineer public-edge work."],
        ["Healthy application-path evidence", "WireGuard management-path evidence", "Listener and firewalld evidence", "Positive/negative administration reachability", "DNS/reverse-proxy note", "Backend denied-path evidence", "CGNAT/public-addressing readiness note"],
        ["A successful HTTP response is supported by lower-layer evidence rather than treated as the only proof.", "The intended exposure is explicit and minimal.", "SSH/management access is not broadly public.", "Database and other backend-only services are not exposed as user-facing entry points.", "DNS, VPN, firewalling, routing, proxying and application failures are distinguishable in the documentation."],
    ),
    gate(
        "Gate 4: Persistence, Backup and Recovery",
        "Prove that the persistent state required to reconstruct Steward is known and that at least one recovery path has actually been tested.",
        ["Inventory persistent state: PostgreSQL data/backups, service configuration, reverse-proxy configuration, WireGuard/firewall configuration, systemd unit files and other non-generated operational state.", "Identify the filesystem or device backing each important path.", "Create a backup using the current homelab strategy and record where it resides relative to the primary failure domain.", "Restore a safe copy or isolated instance and record the verification result.", "State the current acceptable data-loss and recovery assumptions and distinguish them from later Reliability Engineer RPO/RTO work."],
        ["Persistent-state inventory", "Storage/mount evidence", "Backup record", "Restore test evidence", "Recovery assumptions"],
        ["The learner can distinguish backup from snapshot and from source control.", "The backup is not accepted solely because a file exists.", "At least one restoration path is demonstrated with evidence.", "The exercise does not pretend that a VM snapshot replaces database recovery."],
    ),
    gate(
        "Gate 5: Failure Drill and Operational Diagnosis",
        "Demonstrate evidence-driven recovery from one controlled infrastructure failure without guessing across layers or disabling protective controls.",
        ["Choose one recoverable failure below the application code: systemd configuration, permission, SELinux context/policy, firewalld rule, WireGuard route, VM network, storage path, DNS/proxy configuration or similar.", "Record the healthy baseline before introducing the fault.", "Introduce the failure deliberately and state the observed symptom without naming the cause prematurely.", "Work from broad boundary checks toward the failing layer and record the last confirmed-good and first confirmed-bad observations.", "Restore service without solving the exercise by disabling SELinux, firewalld or the VPN boundary.", "Verify the original client and management paths again.", "Write a short prevention or faster-detection improvement proportional to the failure."],
        ["Failure scenario", "Diagnostic timeline", "Command/output evidence", "Recovery verification", "One improvement proposal"],
        ["The failure is controlled and recoverable.", "Diagnosis follows evidence rather than random configuration changes.", "The learner identifies the correct infrastructure boundary before applying the fix.", "Security/network controls remain enabled after recovery.", "Recovery includes end-to-end verification."],
    ),
    gate(
        "Gate 6: Capacity and Enterprise Platform Readiness",
        "Produce a realistic capacity and dependency handoff for the next schools without prematurely installing future enterprise services.",
        ["Record total and currently available CPU, RAM, storage and relevant network capacity.", "Estimate current Steward/PostgreSQL consumption from observation, not vendor sizing tables.", "Reserve a reasonable envelope for later Jenkins, Nexus, Redis, RabbitMQ, Kong, Keycloak and observability components, while stating that the exact placement may change when those schools justify them.", "Identify the first resource likely to constrain growth and what measurement would justify expansion.", "State which future services should remain management-only, backend-only or public-edge facing by default.", "List operational assumptions Delivery Engineer must inherit: host/VM placement, WireGuard access, storage, network boundaries and unresolved risks."],
        ["Current capacity baseline", "Enterprise-service capacity envelope", "Exposure-class handoff", "Likely first constraint and measurement trigger", "Delivery Engineer handoff"],
        ["Capacity numbers are tied to the learner's actual hardware.", "Future services are planned but not installed only to satisfy the milestone.", "Capacity planning preserves enough headroom to continue the enterprise path.", "The handoff makes the existing platform usable as the substrate for Delivery Engineer without prematurely fixing later architecture decisions."],
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
                    objective: "Assemble one reviewable evidence pack that proves Steward Homelab v1 is understandable, operable, access-controlled and recoverable.",
                    scenario: "A second engineer should be able to review the platform without relying on verbal explanation from the learner.",
                    instructions: ["Create a single index that links to each current artifact rather than copying the same information into several documents.", "Remove stale topology, addresses or commands that no longer describe the environment.", "For each artifact, state what question it answers and when it was last verified.", "Include current Rocky Linux, SELinux, firewalld and WireGuard assumptions where they affect operation or access.", "Include at least one known limitation or residual risk rather than presenting the homelab as production-grade.", "End with a concise Delivery Engineer handoff: what exists, how Steward runs, how the homelab is administered, where artifacts may later be hosted, and what must not be assumed."],
                    deliverables: ["Indexed Platform Builder evidence pack", "Current-state verification notes", "Known limitations and residual risks", "Delivery Engineer handoff"],
                    completionCriteria: ["Every major Platform Builder capability is supported by current evidence.", "Contradictory or stale artifacts have been reconciled.", "The environment can be understood and operated by another engineer from the documentation.", "The handoff preserves the enterprise-path boundaries without installing later-school tooling early."],
                },
            },
            {
                id: "steward-homelab-v1-review-and-exit-002",
                title: "Platform Builder Exit Reflection",
                estimatedMinutes: 20,
                content: {
                    type: "reflection",
                    prompt: "If your development laptop disappeared today, what parts of Steward would continue to run, which Rocky Linux and network controls would still protect it, what parts of the homelab could you still administer or recover through the private management path, and which remaining dependency would prevent a full reconstruction? Use evidence from the milestone rather than assumptions.",
                },
            },
        ],
    },
];
