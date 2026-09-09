import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const ubuntu: LearningResource = { title: "Ubuntu Server documentation", url: "https://documentation.ubuntu.com/server/" };
const proxmox: LearningResource = { title: "Proxmox VE documentation", url: "https://pve.proxmox.com/pve-docs/" };
const tailscale: LearningResource = { title: "Tailscale documentation", url: "https://tailscale.com/kb" };
const nginx: LearningResource = { title: "NGINX documentation", url: "https://nginx.org/en/docs/" };

function blocks(title: string, intro: string, sections: Array<{ heading: string; body: string; list?: string[]; code?: { language: string; code: string } }>, resources: LearningResource[] = [ubuntu]): LessonBlock[] {
    const result: LessonBlock[] = [{ type: "paragraph", text: intro }];
    for (const section of sections) {
        const id = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        result.push({ type: "heading", id, text: section.heading, level: 2 }, { type: "paragraph", text: section.body });
        if (section.list) result.push({ type: "list", items: section.list });
        if (section.code) result.push({ type: "code", language: section.code.language, code: section.code.code });
    }
    result.push({ type: "callout", tone: "steward", title: "Steward checkpoint", body: `Apply ${title.toLowerCase()} to the learner-managed Steward environment. Record the decision, evidence and operational consequence rather than only the final configuration.` });
    result.push({ type: "resources", title: "Continue learning", resources });
    return result;
}

function reading(id: string, title: string, intro: string, sections: Parameters<typeof blocks>[2], resources?: LearningResource[]): Lesson {
    return { id: `budget-homelab-${id}`, title, activities: [{ id: `budget-homelab-${id}-001`, title, estimatedMinutes: 35, content: { type: "reading", body: intro, blocks: blocks(title, intro, sections, resources) } }] };
}

export const budgetHomelabDeepLessons: Lesson[] = [
    reading("design", "Designing a Learning Homelab", "A useful homelab is not a miniature datacenter assembled for photographs. It is a controlled environment where you can build, break, observe and recover real systems without risking your daily machine.", [
        { heading: "Start with capabilities", body: "Design from learning outcomes: Linux administration, networking, virtualization, deployment, artifact storage, CI, monitoring and security. Hardware exists to support those capabilities, not the other way around.", list: ["Separate experimentation from the daily workstation", "Make failures recoverable", "Prefer components you can inspect and replace", "Leave room for later TSA platform services"] },
        { heading: "Define the first topology", body: "Begin with the smallest useful topology: an administration workstation, one compute host or VM host, a switch/router path and Steward as the first workload. Complexity should enter only when a lesson requires it." },
    ]),
    reading("hardware", "Choosing Budget Hardware", "Budget engineering means maximizing useful capability per unit of money, power and maintenance effort—not buying the cheapest device in isolation.", [
        { heading: "Reuse before buying", body: "An old business desktop, mini PC or laptop can be an excellent first server when it supports 64-bit virtualization, adequate RAM, replaceable storage and reliable Ethernet." },
        { heading: "Evaluate total cost", body: "Purchase price is only one cost. Include RAM/storage upgrades, adapters, replacement power supplies, electricity, noise and the time required to work around proprietary limitations.", list: ["Used business mini PC", "Used small-form-factor desktop", "Existing laptop with Ethernet", "Single-board computer only when its architecture and I/O fit the workload"] },
    ]),
    reading("resources", "CPU, RAM, Storage and NIC Trade-offs", "Homelab capacity is a constraint system. A fast CPU cannot compensate for exhausted RAM, unreliable storage or a poor network interface.", [
        { heading: "Allocate from workload evidence", body: "Estimate concurrent VMs and services, then budget memory first because it often becomes the practical virtualization ceiling. CPU overcommit can be tolerable for bursty labs; memory exhaustion is far less forgiving." },
        { heading: "Storage and network matter", body: "Prefer SSD storage for VM responsiveness and predictable Ethernet for server workloads. Record whether storage is replaceable and whether the NIC is supported by the intended operating system." },
    ]),
    reading("power", "Power, Noise and Reliability", "A homelab that is too loud, hot or expensive to leave available will not become dependable infrastructure.", [
        { heading: "Treat the room as part of the system", body: "Power draw, ventilation, cable placement and fan noise influence whether the platform can run safely and consistently." },
        { heading: "Design graceful failure", body: "Unexpected power loss can corrupt filesystems and databases. Backups and shutdown procedures matter before a UPS is affordable; a UPS improves the design but does not replace recovery planning." },
    ]),
    reading("switching", "Ethernet Switches and Cabling", "The physical link is the bottom of every service path in the homelab. A switch and a few cables create a real Layer-2 environment that software-only labs often hide.", [
        { heading: "Keep Layer 2 explicit", body: "Know which device is connected to which switch port, negotiated link speed and which broadcast domain it belongs to. Label cables when the topology grows." },
        { heading: "Buy for the next experiment", body: "A basic gigabit switch is enough for early work. Managed switching becomes useful when VLANs and segmentation become real learning requirements; do not pay for enterprise features you cannot yet use." },
    ]),
    reading("topology", "Designing the Home Network Topology", "A topology should explain paths and boundaries: where administration enters, where workloads live, what routes traffic and what should not be reachable.", [
        { heading: "Draw before configuring", body: "Create a physical and logical view with device names, interfaces, subnets, gateways and service roles. The diagram is a troubleshooting instrument, not decoration." },
        { heading: "Separate roles conceptually", body: "Even on one physical host, distinguish management, workload and later platform-service responsibilities. This makes future migration and segmentation easier to reason about." },
    ]),
    reading("addressing", "Static Addressing", "Servers need stable identities, but stability can come from either host configuration or DHCP reservations. The engineering requirement is predictable addressing with one source of truth.", [
        { heading: "Choose an address plan", body: "Reserve a small range or DHCP reservations for infrastructure and document gateway, prefix, DNS and ownership. Avoid random static addresses inside the router's dynamic pool." },
        { heading: "Verify rather than assume", body: "After configuration, inspect interface address, route and name resolution, then test from another host.", code: { language: "bash", code: "ip -br addr\nip route\nresolvectl status\nping -c 3 <gateway>" } },
    ]),
    reading("hosts", "Multiple Hosts and VMs", "The moment a homelab has multiple compute boundaries, placement becomes an architectural decision: which workload runs where, and what remains shared when one host fails?", [
        { heading: "Name every compute boundary", body: "Use stable hostnames and maintain an inventory containing physical host, VM, IP address, operating system, purpose and owner." },
        { heading: "Understand correlated failure", body: "Five VMs on one mini PC are five isolated guests but still share one power supply, storage controller and physical NIC. Virtual separation is not physical redundancy." },
    ], [ubuntu, proxmox]),
    reading("remote-admin", "Remote Administration", "A homelab becomes infrastructure when it can be operated without attaching a keyboard and monitor to every machine.", [
        { heading: "SSH is the primary control path", body: "Use key authentication, named administrative identities and least privilege. Keep a recovery path before changing remote-access configuration." },
        { heading: "Private remote access", body: "If administration is needed away from home, prefer a private overlay or VPN approach rather than exposing SSH directly to the public Internet without a strong reason." },
    ], [ubuntu, tailscale]),
    reading("firewall", "Local Firewalling", "A listening service and a reachable service are different facts. Host firewall policy is one explicit boundary between them.", [
        { heading: "Default to minimum reachability", body: "Permit only the management and application paths the topology requires. Record source, destination, protocol and port for every intentional rule." },
        { heading: "Test both allowed and denied paths", body: "A firewall change is not proven by one successful request. Confirm the intended source can connect and an unintended source or port cannot." },
    ]),
    reading("dns", "Local DNS Concepts", "Memorizing IP addresses does not scale. Local names create stable service identities that can survive address or host changes.", [
        { heading: "Separate names from addresses", body: "Choose a local naming approach appropriate to the network and document which resolver is authoritative. Avoid casually inventing public-looking names you do not control." },
        { heading: "Diagnose resolution independently", body: "When a name fails, query the resolver directly before blaming the application. DNS success still does not prove TCP, TLS or HTTP success." },
    ]),
    reading("proxy", "Reverse Proxies", "A reverse proxy gives clients one controlled HTTP entry point while the application can remain bound to an internal address or port.", [
        { heading: "Understand the new boundary", body: "The proxy terminates a client connection and creates another connection upstream. That introduces configuration, logs, headers, timeouts and a new failure point—but also centralizes routing and later TLS policy." },
        { heading: "Proxy Steward deliberately", body: "Keep Steward's application listener private where practical and expose the intended HTTP entry point through the proxy. Preserve host and forwarding information needed by the application.", code: { language: "nginx", code: "location / {\n    proxy_pass http://127.0.0.1:8000;\n    proxy_set_header Host $host;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n}" } },
    ], [nginx]),
    reading("backups", "Storage and Backups", "Persistent state is the part of the homelab you cannot simply reinstall. Backups therefore need a defined scope, destination and restoration test.", [
        { heading: "Inventory persistent state", body: "Identify Steward database data, configuration, reverse-proxy configuration, service units and operational documentation. Not every generated file deserves backup." },
        { heading: "A backup is unproven until restored", body: "Keep at least one copy outside the failure domain of the primary disk and periodically restore into a safe location. Record recovery steps and the amount of acceptable data loss." },
    ]),
    reading("exposure", "Safe Exposure and Isolation", "Making a lab service reachable from the Internet changes the threat model. Convenience is not sufficient justification for public exposure.", [
        { heading: "Prefer private reachability", body: "For learning and personal administration, LAN access or authenticated private networking is often enough. Public ingress should be introduced only when a later requirement genuinely needs it." },
        { heading: "Map trust boundaries", body: "Document which interfaces are trusted, which users can administer the host and which application endpoints are reachable from each network. Isolation must be testable." },
    ], [tailscale]),
    reading("vlans", "VLAN Concepts", "VLANs let a managed Layer-2 network carry multiple logical broadcast domains. They are useful for learning segmentation, but they do not create security by themselves.", [
        { heading: "Access and trunk mental model", body: "An access port places an endpoint into one VLAN; a trunk can carry tagged traffic for multiple VLANs between VLAN-aware devices. Routing is required for traffic to cross subnets." },
        { heading: "Segmentation requires policy", body: "Creating VLAN 10 and VLAN 20 does not prevent communication if the router freely routes between them. The security outcome comes from routing and firewall policy plus verification." },
    ]),
    reading("capacity", "Planning Capacity for Internal Platform Services", "Later TSA schools add CI runners, Nexus Repository, monitoring and security tooling. Platform Builder should reserve plausible capacity without installing those systems prematurely.", [
        { heading: "Create a capacity envelope", body: "Record current host resources, current Steward usage and a conservative reserve for later services. Include RAM, CPU, storage growth, backup space and network ports." },
        { heading: "Do not build tomorrow's platform today", body: "Capacity planning is not permission to install Nexus, Jenkins, Prometheus or security scanners now. Preserve the learning sequence: reserve resources and document assumptions; later schools will justify and operate each service." },
    ]),
    {
        id: "budget-homelab-lab",
        title: "Lab: Move Steward API into the Homelab",
        activities: [
            { id: "budget-homelab-lab-001", title: "Migration Brief", estimatedMinutes: 25, content: { type: "reading", body: "Move Steward from a laptop-centered exercise into learner-owned infrastructure without losing the operational evidence built so far.", blocks: blocks("Move Steward API into the Homelab", "This lab is a migration and operations exercise, not a hardware-shopping contest. Use the infrastructure you actually have and document limitations honestly.", [
                { heading: "Required outcome", body: "Steward runs on the homelab compute boundary, is remotely administered, has predictable addressing, minimum firewall reachability, a documented name/proxy approach and a recoverable persistent-state plan." },
                { heading: "Preserve evidence", body: "Capture topology, inventory, addressing, service status, listening sockets, firewall rules, client request evidence and backup/restore evidence before declaring the migration complete." },
            ]) } },
            { id: "budget-homelab-lab-002", title: "Build and Prove the Homelab", estimatedMinutes: 180, content: { type: "practical", objective: "Operate Steward API on learner-owned homelab infrastructure and prove the complete administration and service path.", scenario: "Use physical budget hardware where available, or the closest learner-owned virtualized equivalent. Do not buy equipment solely to satisfy the exercise.", instructions: ["Draw the physical and logical topology and create a host/VM/IP/service inventory.", "Configure predictable addressing and verify gateway, routing and DNS behavior.", "Establish key-based remote administration and document the recovery path.", "Run Steward as the dedicated Linux service built earlier and expose only the intended service path.", "Configure and verify local firewall policy; document the local DNS and reverse-proxy approach even if one is intentionally deferred.", "Identify persistent state, create a backup and perform a safe restoration test.", "Record current resource use and reserve capacity assumptions for later CI, Nexus, monitoring and security services.", "Introduce one recoverable infrastructure failure, diagnose its boundary, restore service and record the evidence."], deliverables: ["Physical and logical topology", "Host, VM, address and service inventory", "Remote administration and firewall evidence", "Steward service and client-reachability evidence", "Backup and restoration record", "Capacity plan for later platform services", "Controlled failure and recovery record"], completionCriteria: ["Steward is no longer dependent on the development laptop as its runtime environment.", "Another engineer could reconstruct the intended topology and administration path from the documentation.", "Persistent state has a tested recovery path.", "Later platform services have capacity assumptions but have not been prematurely installed.", "One infrastructure failure is localized and recovered using evidence."] } },
            { id: "budget-homelab-lab-003", title: "Homelab Readiness Review", estimatedMinutes: 25, content: { type: "reflection", prompt: "Which single physical or logical dependency can still take the entire Steward homelab offline, why is that acceptable at this learning stage, and what evidence would justify removing that dependency later?" } },
        ],
    },
];
