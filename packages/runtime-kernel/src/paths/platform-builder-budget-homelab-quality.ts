import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { budgetHomelabDeepLessons } from "./platform-builder-budget-homelab-deep";

function normalizeEnterpriseBaseline<T>(value: T): T {
    if (typeof value === "string") {
        return value
            .replaceAll("Ubuntu Server", "Rocky Linux")
            .replaceAll("Ubuntu", "Rocky Linux")
            .replaceAll("https://documentation.ubuntu.com/server/", "https://docs.rockylinux.org/")
            .replaceAll("Tailscale", "WireGuard")
            .replaceAll("https://tailscale.com/kb", "https://www.wireguard.com/quickstart/") as T;
    }
    if (Array.isArray(value)) return value.map((item) => normalizeEnterpriseBaseline(item)) as T;
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, normalizeEnterpriseBaseline(item)]),
        ) as T;
    }
    return value;
}

const practices: Record<string, PracticalContent> = {
    "Designing a Learning Homelab": {
        type: "practical",
        objective: "Design the smallest homelab topology that can host Steward now and grow into the later TSA enterprise platform without premature complexity.",
        scenario: "You have limited hardware and money, but later schools will add Jenkins, Nexus, Redis, RabbitMQ, Kong, observability and security services. The design must reserve a path for them without installing them now.",
        instructions: ["Inventory the hardware and network equipment you actually own.", "Draw the smallest topology that separates administration, workload and future platform-service responsibilities.", "Mark the Rocky Linux compute boundary, Steward placement, management path and current single points of failure.", "Reserve logical space for later platform services without assigning a separate VM to every future tool.", "State three additions you deliberately defer and the requirement that would justify each."],
        deliverables: ["Physical and logical topology", "Current-versus-future capability map", "Deferred-complexity decisions"],
        completionCriteria: ["Every component has a current learning purpose.", "Future enterprise services have a plausible landing zone.", "The topology is small enough to operate with the learner's actual resources."],
    },
    "Choosing Budget Hardware": {
        type: "practical",
        objective: "Choose or reuse hardware from measurable workload and expansion requirements rather than brand or appearance.",
        scenario: "The homelab must support Rocky Linux virtualization and leave room for later enterprise services on a constrained budget.",
        instructions: ["Compare at least two realistic owned/used-hardware options.", "Record CPU virtualization support, RAM ceiling, storage expandability, NIC capability, power draw and replacement risk.", "Estimate which later TSA services can coexist on each option.", "Identify the cheapest option that still preserves a credible upgrade path.", "Document the bottleneck most likely to force the next hardware purchase."],
        deliverables: ["Hardware comparison", "Capacity/upgrade rationale", "Budget decision"],
        completionCriteria: ["The decision is evidence-based.", "RAM/storage/network constraints are considered alongside CPU.", "No purchase is required solely to make the lab look enterprise-like."],
    },
    "CPU, RAM, Storage and NIC Trade-offs": {
        type: "practical",
        objective: "Create a resource envelope for Steward and future enterprise services using real host measurements.",
        scenario: "The host can run Steward today, but uncontrolled VM growth could leave no capacity for Jenkins, Nexus, Redis, RabbitMQ, Kong or observability later.",
        instructions: ["Measure current host CPU, memory, storage and NIC characteristics.", "Record current Rocky/Steward usage under an ordinary workload.", "Create conservative headroom targets for later services.", "Identify which resources may be overcommitted and which should not be.", "Define the measurements that would trigger a scale-up or new-host decision."],
        deliverables: ["Resource envelope", "Headroom table", "Capacity trigger criteria"],
        completionCriteria: ["Future capacity is reserved explicitly.", "The plan distinguishes burstable CPU from harder memory/storage constraints.", "Expansion decisions are linked to observed pressure."],
    },
    "Power, Noise and Reliability": {
        type: "practical",
        objective: "Treat power and physical environment as operational dependencies of the Steward platform.",
        scenario: "The lab is technically correct but must remain safe, affordable and recoverable during real household power or cooling interruptions.",
        instructions: ["Record approximate steady and peak power requirements for active devices.", "Inspect ventilation, cable placement and shutdown access.", "Define the shutdown sequence for Steward/PostgreSQL and virtualization hosts during an extended outage.", "Identify what a UPS would protect and what it would not.", "Record the physical failure that currently has the largest blast radius."],
        deliverables: ["Physical operations checklist", "Power-loss shutdown plan", "Reliability limitation"],
        completionCriteria: ["The lab can be shut down deliberately.", "Database/filesystem risk from abrupt loss is understood.", "A UPS is not treated as a backup or availability solution by itself."],
    },
    "Ethernet Switches and Cabling": {
        type: "practical",
        objective: "Build and document a physical Layer-2 path whose failures can be localized instead of hidden.",
        scenario: "Multiple homelab hosts now depend on the switch and cabling between them.",
        instructions: ["Map each connected device to a switch/router port.", "Record negotiated link speed and interface identity on the Rocky host.", "Label or otherwise identify important cables.", "Introduce one safe link interruption and observe the exact host/network symptoms.", "Decide whether a managed switch is justified now or only when VLAN work requires it."],
        deliverables: ["Port/cable map", "Link-state evidence", "Managed-switch decision"],
        completionCriteria: ["Physical links are traceable.", "A link failure is distinguishable from routing or application failure.", "Hardware capability is bought only when a learning requirement needs it."],
    },
    "Designing the Home Network Topology": {
        type: "practical",
        objective: "Turn the homelab into an explainable network with explicit public, private-management and backend boundaries.",
        scenario: "The lab now has a Rocky host, Steward and VPN administration. Later public ingress must not collapse those traffic classes into one flat network.",
        instructions: ["Draw physical and logical network views.", "Mark LAN, WireGuard management and backend-only service paths.", "Identify where routing, NAT and firewalld policy are enforced.", "Show where a future Kong/public edge can connect without exposing SSH, PostgreSQL, Redis or RabbitMQ.", "Trace one administrator path and one Steward client path end to end."],
        deliverables: ["Physical topology", "Logical trust-boundary diagram", "Two end-to-end path traces"],
        completionCriteria: ["Traffic classes are explicit.", "Future public exposure has a defined boundary.", "Management and backend ports are not assumed public."],
    },
    "Static Addressing": {
        type: "practical",
        objective: "Create a predictable address plan with one source of truth and no collision with dynamic allocation.",
        scenario: "Steward and future platform services need stable identities, but manually scattered static IPs would create drift.",
        instructions: ["Inspect the current DHCP range and gateway.", "Choose DHCP reservations or deliberate static addresses for infrastructure.", "Document hostname, IP, prefix, gateway, DNS and owner for each infrastructure endpoint.", "Reboot or renew one endpoint and prove its identity remains predictable.", "Verify route and name resolution from another client."],
        deliverables: ["Address plan", "Source-of-truth record", "Post-restart verification"],
        completionCriteria: ["Infrastructure addresses do not collide with the dynamic pool.", "Address ownership is documented.", "Stability is proven after lifecycle change."],
    },
    "Multiple Hosts and VMs": {
        type: "practical",
        objective: "Place workloads across physical and virtual boundaries according to failure domain, capacity and lifecycle needs.",
        scenario: "Adding VMs can create the illusion of resilience even when every guest shares one physical failure domain.",
        instructions: ["Create an inventory of physical hosts and VMs.", "For each workload, record its physical failure domain.", "Identify which future services may share a VM and which might eventually deserve isolation.", "Model loss of the primary physical host and list every affected service.", "State the evidence that would justify adding a second physical compute host later."],
        deliverables: ["Compute inventory", "Failure-domain map", "Placement decision record"],
        completionCriteria: ["Virtual isolation is not confused with physical redundancy.", "Placement reflects lifecycle/capacity needs.", "Additional hosts are justified by evidence rather than aspiration."],
    },
    "Remote Administration": {
        type: "practical",
        objective: "Operate the homelab remotely through the private WireGuard management path while preserving a local recovery route.",
        scenario: "SSH must be useful away from the server, but direct public SSH exposure is not the default TSA management model.",
        instructions: ["Verify SSH key access to the Rocky host from the LAN.", "Verify the WireGuard management path from an authorized client.", "Confirm SSH is not intentionally exposed through the future/public application path.", "Document the recovery path if WireGuard or SSH configuration breaks.", "Record which later interfaces such as Jenkins, Nexus and operations dashboards will inherit the private-management rule."],
        deliverables: ["LAN and VPN SSH evidence", "Negative exposure evidence", "Recovery runbook"],
        completionCriteria: ["Remote administration works without public SSH exposure.", "A broken VPN does not remove every recovery option.", "Future control-plane services inherit a clear access policy."],
    },
    "Local Firewalling": {
        type: "practical",
        objective: "Implement minimum host reachability with firewalld and prove both allowed and denied paths.",
        scenario: "Several services listen on the Rocky host, but only explicit application and management paths should be reachable from each network zone.",
        instructions: ["Inventory listening sockets before changing policy.", "Map interfaces/sources to appropriate firewalld zones.", "Permit only required Steward and WireGuard/management traffic.", "Test an intended connection from the correct source.", "Test at least one denied port or source and capture the failure.", "Record runtime and permanent rules and verify policy survives reload."],
        deliverables: ["Socket-to-policy map", "firewalld configuration evidence", "Positive/negative reachability proof"],
        completionCriteria: ["Rules correspond to documented paths.", "Denied traffic is tested explicitly.", "Policy survives the intended lifecycle."],
    },
    "Local DNS Concepts": {
        type: "practical",
        objective: "Give homelab services stable internal names and make the authoritative resolution path observable.",
        scenario: "IP memorization is becoming brittle as hosts, VMs and later platform services accumulate.",
        instructions: ["Choose an internal naming convention that will not conflict with public domains you do not own.", "Define where the authoritative local mapping lives.", "Create names for the Rocky Steward endpoint and at least one future/internal service placeholder only if useful.", "Query the resolver directly and compare with client resolution.", "Change one underlying address in a safe test and prove the service identity can remain stable through DNS."],
        deliverables: ["Naming convention", "Resolver evidence", "Name-to-address lifecycle test"],
        completionCriteria: ["Names have one documented authority.", "DNS is diagnosed independently of transport/application health.", "Internal naming does not pretend to own arbitrary public namespaces."],
    },
    "Reverse Proxies": {
        type: "practical",
        objective: "Expose Steward through one controlled local HTTP entry point while keeping the application listener behind the proxy boundary.",
        scenario: "Steward currently listens on an application port directly. The homelab needs a stable ingress boundary before the later Kong/public-edge evolution.",
        instructions: ["Record the current direct Steward listener.", "Configure the local reverse proxy to route to that upstream.", "Preserve Host and forwarding metadata deliberately.", "Restrict direct upstream reachability where practical and verify the proxy path from a client.", "Break one upstream/proxy setting and use proxy plus application evidence to localize the failure.", "Document why this local reverse proxy is not yet the same capability as the later Kong API gateway."],
        deliverables: ["Proxy configuration", "Client/upstream evidence", "Proxy-vs-gateway distinction"],
        completionCriteria: ["Clients have one intentional local HTTP entry point.", "The upstream relationship is observable.", "Gateway responsibilities are not prematurely assigned to the reverse proxy."],
    },
    "Storage and Backups": {
        type: "practical",
        objective: "Create and actually restore a copy of the Steward state that cannot be recreated from source alone.",
        scenario: "The homelab now contains persistent application, database and operational configuration whose loss would exceed a simple reinstall.",
        instructions: ["Inventory persistent versus reproducible state.", "Choose a backup destination outside the primary disk failure domain where possible.", "Back up representative PostgreSQL/configuration state using the methods already appropriate to this stage.", "Restore into a safe isolated location and verify the restored artifact/data.", "Record current recovery-point and recovery-time assumptions.", "Identify which backup/restore concerns will deepen later in Reliability Engineer."],
        deliverables: ["Persistent-state inventory", "Backup evidence", "Restore proof", "Current RPO/RTO assumptions"],
        completionCriteria: ["At least one restore is actually performed.", "The backup is not just another copy on the same primary path where avoidable.", "Later database reliability work has an explicit handoff."],
    },
    "Safe Exposure and Isolation": {
        type: "practical",
        objective: "Prove the homelab's current exposure boundary before any public-internet requirement is introduced.",
        scenario: "Steward is useful on the LAN and management VPN. Public exposure will come later through a deliberate edge, not through opportunistic router port forwarding.",
        instructions: ["List every currently reachable service by source network.", "Classify each as application, management/control-plane or backend-only.", "Verify one management resource is reachable only through the intended private path.", "Confirm PostgreSQL and any existing backend dependency are not publicly exposed.", "Record whether the ISP/router environment uses public addressing or CGNAT and what that means for later public ingress.", "Sketch the later Kong/public-edge path without implementing it yet."],
        deliverables: ["Exposure matrix", "Positive/negative access evidence", "CGNAT/public-edge readiness note"],
        completionCriteria: ["Current exposure is measured rather than assumed.", "Management and backend boundaries are preserved.", "Public ingress is explicitly deferred to the later enterprise edge capability."],
    },
    "VLAN Concepts": {
        type: "practical",
        objective: "Evaluate and, where hardware permits, demonstrate segmentation without confusing VLANs with complete security policy.",
        scenario: "The homelab may eventually separate management, workload and guest traffic, but segmentation should exist only if the equipment and learning need support it.",
        instructions: ["Identify two traffic classes that could justify separate VLANs.", "If managed switching/routing is available, create a small test segmentation; otherwise produce the exact planned access/trunk/routing design.", "Show where inter-VLAN routing would occur.", "Define the firewall policy required to make segmentation meaningful.", "Test or predict one flow that should be allowed and one that should be denied.", "State whether VLAN complexity is justified in the current physical lab."],
        deliverables: ["VLAN/segmentation design", "Routing-policy map", "Adopt/defer decision"],
        completionCriteria: ["VLANs are not treated as security by themselves.", "Routing and firewall policy are explicit.", "Deferring VLANs is acceptable when hardware or requirements do not justify them."],
    },
    "Planning Capacity for Internal Platform Services": {
        type: "practical",
        objective: "Reserve a realistic capacity envelope for the enterprise capabilities that later TSA schools will add without installing them prematurely.",
        scenario: "The same lab must eventually host or support Jenkins, Nexus, Redis, RabbitMQ, Kong, Keycloak and observability components while remaining usable on budget hardware.",
        instructions: ["Record current steady-state CPU, RAM, storage and network use.", "Create provisional capacity buckets for delivery, data/integration, edge/identity and observability services.", "Mark which services may initially share compute and which would be first candidates for isolation.", "Define warning thresholds that would trigger right-sizing, shutdown of unused labs or another host.", "Reserve backup/storage growth separately from runtime capacity.", "State which capacity assumptions must be re-measured when each later service is actually introduced."],
        deliverables: ["Enterprise service capacity envelope", "Placement assumptions", "Growth/threshold plan"],
        completionCriteria: ["The plan covers the stamped enterprise path.", "No future tool is installed simply because capacity was reserved for it.", "Every estimate is explicitly provisional until measured under the real service."],
    },
};

const normalizedLessons = normalizeEnterpriseBaseline(budgetHomelabDeepLessons);

export const budgetHomelabQualityLessons: Lesson[] = normalizedLessons.map((lesson) => {
    const practical = practices[lesson.title];
    if (!practical) return lesson;
    return {
        ...lesson,
        activities: [
            ...lesson.activities,
            {
                id: `${lesson.id}-practice`,
                title: `${lesson.title}: Homelab Practice`,
                estimatedMinutes: 50,
                content: practical,
            },
        ],
    };
});
