import type { AuthoredLesson } from "./normalize-authored-curriculum";
// Protocol and implementation references:
const coreServiceReferences = [
 "https://bind9.readthedocs.io/",
 "https://kb.isc.org/docs/isc-dhcp-44-manual-pages-dhcpd",
 "https://chrony-project.org/documentation.html",
 "https://datatracker.ietf.org/doc/html/rfc1034",
 "https://datatracker.ietf.org/doc/html/rfc2131",
 "https://datatracker.ietf.org/doc/html/rfc5905",
];

const coreServiceTeaching: Record<string, { title: string; description: string }[]> = {
    "infra-services-boundary": [
        { title: "DNS, DHCP and time answer different bootstrap questions", description: "DNS maps names and service records to information clients use to locate endpoints; DHCP gives a client network parameters such as address, prefix, gateway and DNS resolver; NTP/chrony disciplines clocks against time sources. They depend on one another in real systems but are not interchangeable. A host can have a valid DHCP lease yet fail by name because DNS is wrong, or reach a domain controller by IP while authentication fails because its clock is too far out of sync." },
    ],
    "authoritative-dns": [
        { title: "Worked DNS trace before configuration", description: "Suppose a client asks for api.steward.lab. A stub resolver sends the question to its configured recursive resolver; that resolver either has a cached answer or follows the DNS delegation chain until it finds the authoritative zone. A record owned by the steward.lab authority contains the service address, whereas the client resolver address delivered by DHCP is only where the question is sent. Before editing a zone, write down the queried name, expected type, authoritative server, TTL and the resolver the client will consult. Compare dig @SERVER api.steward.lab A with dig api.steward.lab A to distinguish authority from recursion. An NXDOMAIN answer, timeout and stale cache have different causes." },

        { title: "Authority owns records; recursion finds answers", description: "An authoritative server answers from zones for which it is a source of truth. A recursive resolver accepts a client's question, follows/delegates queries as needed and can cache the resulting answer for its TTL. If nas.lab.example is owned by the homelab authoritative zone, that server owns the original record; a client-facing resolver may return a cached copy without becoming authoritative for the zone." },
        { title: "TTL makes DNS changes deliberately non-instant", description: "A resolver that cached an answer with 300 seconds of TTL can legitimately keep serving that cached value until the remaining TTL expires. Changing the authoritative A record therefore does not guarantee every client immediately sees the new address. Diagnose which resolver answered, whether the answer is authoritative/cached and the remaining TTL before concluding that the zone change failed." },
    ],
    "dhcp-service": [
        { title: "DHCP is a lease negotiation, not just an address list", description: "A new IPv4 client that does not yet have usable network configuration broadcasts to discover DHCP service. The server can offer an address and options, the client requests the selected offer, and the server acknowledges a lease. The lease has a lifetime and is renewed rather than treated as permanent ownership. Server lease state and client lease state therefore provide evidence for different points in the lifecycle." },
        { title: "Reservations and dynamic pools solve different needs", description: "A dynamic pool lends any available address from a range. A reservation maps a known client identity, commonly a MAC/client identifier in a simple lab, to a predictable address while still delivering DHCP options centrally. Infrastructure can therefore keep predictable addressing without manually duplicating gateway/DNS settings on every host, provided the DHCP dependency and bootstrap risk are acceptable." },
    ],
    "dhcp-failures-relay": [
        { title: "Routers separate the client broadcast from a remote DHCP server", description: "Initial DHCP discovery is broadcast on the client's local Layer-2 segment and ordinary routers do not forward that broadcast as if it were normal routed unicast. A DHCP relay on the routed boundary receives the local request and forwards it toward a server on another subnet, carrying information about the client-side network so the server can choose the correct scope. Without the relay, a healthy remote server may never see the client's discovery." },
    ],
    "ntp-chrony": [
        { title: "Synchronization is measured correction, not matching displayed clocks", description: "Chrony compares the local clock with one or more time sources, estimates offset and frequency error, and disciplines the system clock over time. Seeing similar human-readable timestamps on two hosts is weak evidence; chronyc tracking/sources exposes which source is selected, estimated offset and synchronization state." },
        { title: "Wall clock and elapsed time have different semantics", description: "Civil/system time can be corrected because it represents a timestamp that should agree with external time. A monotonic clock is designed to move forward for measuring elapsed duration and is not stepped backward by wall-clock correction. Logs, certificates and token expiry need trustworthy wall time; request duration and timeout measurement should use monotonic elapsed-time semantics." },
    ],
};

function teachCoreService(id: string, activities: AuthoredLesson["activities"]): AuthoredLesson["activities"] {
    const sections = coreServiceTeaching[id] ?? [];
    return [...sections.map((section) => ({ type: "reading" as const, title: section.title, description: section.description })), ...activities];
}

export const coreInfrastructureServicesDeepLessons: AuthoredLesson[] = [
    {
        id: "infra-services-boundary",
        title: "DNS, DHCP and Time as Infrastructure",
        summary: "Treat naming, address assignment and time synchronization as operated dependencies rather than invisible conveniences.",
        objectives: ["Explain DNS, DHCP and NTP responsibility boundaries.", "Map which TSA systems fail when each service is wrong or unavailable.", "Design a bounded homelab service topology without replacing the household/ISP network accidentally."],
        activities: teachCoreService("infra-services-boundary", [{ type: "exercise", title: "Infrastructure dependency map", description: "Map Proxmox, Rocky guests, NAS, Steward, Keycloak/TLS and observability to DNS, DHCP and time dependencies. Define authoritative versus recursive DNS responsibility, DHCP scope boundaries and the intended time source before deployment." }]),
    },
    {
        id: "authoritative-dns",
        title: "Operate Authoritative Homelab DNS",
        summary: "Own a private DNS namespace and prove forward and reverse resolution from multiple hosts.",
        objectives: ["Create a private authoritative zone.", "Operate A/AAAA/CNAME/PTR records at an appropriate level.", "Use DNS evidence instead of hosts-file workarounds.", "Distinguish authoritative answers from recursive resolution and caching."],
        activities: teachCoreService("authoritative-dns", [{ type: "practical", title: "Authoritative DNS lab", objective: "Make TSA homelab names resolvable through an actual DNS service.", scenario: "Proxmox and Rocky services need stable names; manually maintaining `/etc/hosts` does not scale or expose DNS failure modes.", instructions: ["Deploy BIND on a dedicated/bounded Rocky infrastructure VM or justify an equivalent authoritative implementation.", "Create a private lab zone and reverse zone that do not conflict with public or mDNS naming conventions.", "Add records for representative infrastructure such as NAS and Steward hosts.", "Query authoritative answers directly with `dig` and then through configured clients.", "Validate forward and reverse lookup from at least two machines.", "Change a record deliberately, observe `TTL`/cache behavior, and preserve before/after query evidence.", "Query the authoritative server directly and then a recursive/caching resolver; identify AA/recursion behavior and explain which component owns the original answer versus cached retrieval."], deliverables: ["Zone/configuration evidence", "Forward/reverse query proof", "TTL/cache observation"], completionCriteria: ["Names resolve without hosts-file dependency.", "Authority and recursion are distinguishable.", "Reverse resolution is exercised."] }]),
    },
    {
        id: "dns-failure-operations",
        title: "Break and Diagnose DNS",
        summary: "Diagnose wrong answers, stale answers and unavailable resolvers before blaming the application.",
        objectives: ["Trace resolver configuration and query path.", "Distinguish NXDOMAIN, timeout, wrong answer and stale cache.", "Recover DNS while preserving incident evidence."],
        activities: [{ type: "practical", title: "DNS incident drill", objective: "Create and recover distinct DNS failures.", scenario: "Steward appears unavailable by name while IP connectivity may still work.", instructions: ["Capture a healthy resolution baseline including resolver, authority and `TTL`.", "Introduce a wrong test record and prove the resulting destination mismatch.", "Restore the record and explain/observe cache expiry or flush behavior.", "Stop or firewall the lab DNS service safely and compare DNS timeout with successful direct-IP network evidence.", "Recover service and write a client→resolver→authority diagnostic sequence."], deliverables: ["Wrong-record incident", "Resolver-outage incident", "DNS diagnostic runbook"], completionCriteria: ["At least two distinct DNS failure classes are diagnosed.", "Application and network failure are not conflated with DNS.", "Recovery is verified from a client."] }],
    },
    {
        id: "dhcp-service",
        title: "Operate DHCP Scopes and Reservations",
        summary: "Control dynamic address assignment on an isolated TSA network and understand leases, reservations, options and exhaustion.",
        objectives: ["Design a non-conflicting DHCP scope.", "Configure leases, gateway/DNS options and reservations.", "Observe the DHCP lifecycle from a real client."],
        activities: teachCoreService("dhcp-service", [{ type: "practical", title: "Isolated DHCP lab", objective: "Operate DHCP without creating a rogue server on the household/corporate LAN.", scenario: "A dedicated Proxmox bridge/VLAN needs repeatable client addressing and infrastructure reservations.", instructions: ["Create or identify an isolated lab VLAN/bridge where the learner controls the only intended DHCP authority.", "Deploy a DHCP server on Rocky Linux and define subnet, bounded pool, lease times, gateway/DNS options appropriate to that isolated network.", "Acquire a lease from a disposable client and inspect server/client lease evidence.", "Create a MAC-based reservation for a representative infrastructure client and verify the expected address.", "Renew/release the client lease and record the lifecycle.", "Prove the DHCP server is not answering on unintended networks."], deliverables: ["Scope/reservation configuration", "Client/server lease evidence", "Network-boundary proof"], completionCriteria: ["No rogue DHCP is introduced outside the controlled lab segment.", "Dynamic lease and reservation both work.", "The assigned DNS/gateway options are explainable."] }]),
    },
    {
        id: "dhcp-failures-relay",
        title: "DHCP Exhaustion, Wrong Options and Relay",
        summary: "Diagnose DHCP incidents and connect local broadcast behavior to routed enterprise networks.",
        objectives: ["Recognize scope exhaustion and incorrect option symptoms.", "Explain why DHCP needs relay across routed boundaries.", "Implement relay where the lab topology safely supports it."],
        activities: teachCoreService("dhcp-failures-relay", [{ type: "practical", title: "DHCP failure and relay lab", objective: "Break address assignment in controlled ways and recover it.", scenario: "Clients on a lab segment cannot obtain usable network configuration, but several different DHCP layers can be responsible.", instructions: ["Shrink a disposable DHCP pool enough to demonstrate controlled exhaustion with test clients or lease manipulation; capture server evidence and restore capacity.", "Serve an intentionally wrong DNS option to a disposable client, prove address acquisition succeeds while name resolution fails, then correct it.", "Using Packet Tracer first, demonstrate DHCP relay across a routed boundary and inspect the relay behavior.", "If the physical/Proxmox lab has a safe routed VLAN boundary, implement a real relay there; otherwise preserve the Packet Tracer implementation plus an exact physical transfer plan.", "Create a diagnostic sequence covering client link → broadcast/VLAN → relay → server → scope → options."], deliverables: ["Exhaustion evidence", "Wrong-option incident", "DHCP relay evidence/transfer plan", "DHCP runbook"], completionCriteria: ["Exhaustion and wrong options are distinguished.", "Relay is implemented at least in the network-device lab.", "The production/home LAN is never used as an unsafe DHCP experiment."] }]),
    },
    {
        id: "ntp-chrony",
        title: "Operate Time Synchronization with Chrony",
        summary: "Make clock synchronization observable and understand why distributed systems require trustworthy time.",
        objectives: ["Inspect wall clock, monotonic time and synchronization state.", "Configure Rocky Linux clients with chrony.", "Relate time correctness to TLS, authentication, logs and incident correlation.", "Explain why elapsed-time measurement should not assume wall clock is monotonic."],
        activities: teachCoreService("ntp-chrony", [{ type: "practical", title: "Chrony synchronization lab", objective: "Prove infrastructure hosts are synchronized to an intentional source.", scenario: "Authentication tokens, certificates and incident timelines assume clocks are sufficiently aligned.", instructions: ["Inspect `timedatectl` and `chronyc sources`/`chronyc tracking` on representative Rocky hosts.", "Configure the intended upstream source(s) and document whether the lab uses external NTP directly or a bounded internal time source.", "Verify synchronization/offset evidence from at least two hosts.", "Compare timestamps for one cross-host request/event.", "Record acceptable offset expectations for the homelab and what would trigger investigation."], deliverables: ["Time-source architecture", "chrony tracking/source evidence", "Cross-host timestamp comparison"], completionCriteria: ["Synchronization is evidenced rather than inferred from displayed clock time.", "The chosen time authority is explicit.", "Time is connected to concrete distributed-system dependencies."] }]),
    },
    {
        id: "clock-skew-failure",
        title: "Clock Skew as a Security and Observability Incident",
        summary: "Create bounded time skew and observe failures that can masquerade as identity, TLS or logging problems.",
        objectives: ["Recognize clock-skew symptoms.", "Recover synchronization safely.", "Use multiple signals to reconstruct incident ordering."],
        activities: [{ type: "practical", title: "Time-skew incident", objective: "Observe a real dependency fail or become misleading because one disposable host has incorrect time.", scenario: "A distributed request or authentication flow behaves unexpectedly while network connectivity remains healthy.", instructions: ["Use a disposable VM and capture its healthy `chrony` state.", "Temporarily isolate/disable synchronization and introduce a bounded clock offset large enough to affect a safe TLS/token/logging experiment without touching the Proxmox host.", "Capture the resulting symptom and timestamps.", "Compare wall-clock timestamps with a monotonic/elapsed-time measurement and explain why NTP clock correction can make civil time unsuitable for measuring durations.", "Diagnose time state before changing application configuration.", "Restore correct time/synchronization and verify the affected flow recovers.", "Document why changing time on databases/hypervisors/production-like nodes can be dangerous."], deliverables: ["Healthy/skewed/recovered time evidence", "Affected dependency evidence", "Clock-skew incident note"], completionCriteria: ["The failure is reproduced on a disposable guest only.", "Clock skew is identified from evidence.", "Synchronization and dependent behavior are both verified after recovery."] }],
    },
    {
        id: "infra-services-integration",
        title: "Integrate Core Services into the Homelab",
        summary: "Move representative infrastructure from ad-hoc naming/address/time assumptions onto the operated services and define bootstrap dependencies.",
        objectives: ["Use DNS names consistently for selected TSA services.", "Keep infrastructure addressing stable without making every machine static by hand.", "Identify circular bootstrap dependencies."],
        activities: [{ type: "practical", title: "Homelab service cutover", objective: "Adopt DNS/DHCP/time deliberately across the existing homelab.", scenario: "The services work in isolation; they now need to become trustworthy dependencies of Proxmox/Rocky/NAS/Steward without creating an unrecoverable circular dependency.", instructions: ["Select representative Rocky/NAS/Steward endpoints and move client references to the lab DNS names.", "Use reservations or documented static addressing for infrastructure whose address must remain available during DHCP failure; justify each choice.", "Ensure time synchronization is configured for representative infrastructure nodes.", "Document how DNS/DHCP/time services themselves obtain stable addressing and names.", "Reboot one client and one infrastructure-service VM in a safe order and verify naming, addressing and time recover."], deliverables: ["Updated dependency map", "Addressing policy", "Reboot/recovery evidence", "Bootstrap-order record"], completionCriteria: ["Core services are actually consumed by the homelab.", "Bootstrap dependencies are explicit.", "Recovery does not depend on undocumented manual state."] }],
    },
    {
        id: "infra-services-reassessment",
        title: "Reassess Availability and Ownership",
        summary: "Decide when single-instance lab infrastructure is sufficient and when redundancy or external authority becomes justified.",
        objectives: ["Identify the blast radius of losing DNS/DHCP/time.", "Separate learning-platform simplicity from production HA claims.", "Define evidence-based triggers for redundant infrastructure services."],
        activities: [{ type: "exercise", title: "Core services architecture record", description: "Document current DNS, DHCP and time authorities, their host/storage/network dependencies, recovery order and single points of failure. Compare plausible redundant DNS/DHCP/time designs but do not add permanent duplicate services without a justified availability requirement. Define the evidence that would trigger redundancy later." }],
    },
];