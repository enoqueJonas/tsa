import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const packetTracer: LearningResource = { title: "Cisco Packet Tracer", url: "https://www.netacad.com/cisco-packet-tracer" };
const ciscoNetworking: LearningResource = { title: "Cisco Networking Academy", url: "https://www.netacad.com/" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lab(
    title: string,
    body: string,
    outcomes: string[],
    instructions: string[],
    deliverables: string[],
    completionCriteria: string[],
    estimatedMinutes = 120,
): Lesson {
    const id = `packet-tracer-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: body },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: outcomes },
        { type: "callout", tone: "steward", title: "Vendor syntax, transferable model", body: "Cisco IOS is the implementation medium for this lab. Treat commands as evidence of switching, routing and policy behavior rather than as trivia to memorize. The transferable skill is predicting packet behavior, proving it with device state, breaking it deliberately and localizing the fault." },
        { type: "resources", title: "Required and supporting resources", resources: [packetTracer, ciscoNetworking] },
    ];

    return {
        id,
        title,
        activities: [
            { id: `${id}-brief`, title: `${title}: Engineering Brief`, estimatedMinutes: 30, content: { type: "reading", body, blocks } },
            {
                id: `${id}-lab`,
                title: `${title}: Packet Tracer Lab`,
                estimatedMinutes,
                content: {
                    type: "practical",
                    objective: outcomes.join(" "),
                    scenario: "You are building the network beneath a small enterprise branch that will eventually host and expose Steward. Build the smallest topology that proves the capability, preserve healthy evidence, inject a fault, diagnose it from device state and restore service.",
                    instructions,
                    deliverables,
                    completionCriteria,
                },
            },
            { id: `${id}-review`, title: `${title}: Network Review`, estimatedMinutes: 15, content: { type: "reflection", prompt: "1. What forwarding or control-plane decision made the healthy topology work?\n2. Which show-command evidence proved that decision?\n3. What did the injected fault change?\n4. What was the last-known-good and first-known-bad boundary?\n5. Which concept transfers unchanged to a non-Cisco network?" } },
        ],
    };
}

export const packetTracerNetworkEngineeringDeepLessons: Lesson[] = [
    lab(
        "IOS CLI and Device Evidence",
        "Packet Tracer gives TSA a safe multi-device network laboratory. Begin by learning how a router or switch exposes interface, configuration, neighbor and forwarding state. The goal is not command memorization: it is to stop treating the network as an invisible pipe.",
        ["Navigate Cisco IOS user, privileged and configuration modes.", "Inspect interfaces and running configuration.", "Configure device identity and interface addressing.", "Use device evidence to distinguish administrative-down, protocol-down and addressing faults."],
        ["Create one router, one switch and two end hosts.", "Name the devices and document the physical/logical links.", "Configure interface descriptions and required IPv4 addresses.", "Use show running-config, show ip interface brief and relevant interface commands to capture a healthy baseline.", "Save the configuration and prove it survives a simulated restart where Packet Tracer supports it.", "Shut one required interface administratively, predict the symptom before testing, diagnose the state from IOS evidence, restore it and prove recovery."],
        ["Starter .pkt topology", "Device/interface inventory", "Healthy IOS evidence", "Administrative-down failure and recovery record"],
        ["The learner can move safely between IOS modes.", "Interface state is proven from device evidence.", "The fault is localized before configuration is changed.", "The restored topology passes end-to-end connectivity tests."],
        100,
    ),
    lab(
        "IPv4 Subnetting and VLSM",
        "Enterprise addressing is a capacity and routing design problem. Use VLSM to turn host requirements into explicit prefixes, gateways and non-overlapping networks before configuring devices.",
        ["Calculate IPv4 network, broadcast and usable ranges.", "Allocate VLSM prefixes from host requirements.", "Create an addressing plan before configuration.", "Detect overlapping or incorrect-prefix faults from symptoms and evidence."],
        ["Start with an assigned private /24 and branch requirements for at least four differently sized networks.", "Allocate prefixes largest-first and record network, prefix, usable range, broadcast and gateway for each segment.", "Build a routed Packet Tracer topology using at least three of the planned subnets.", "Configure hosts and router interfaces only after the addressing table is complete.", "Prove same-subnet and routed reachability.", "Introduce one wrong mask or overlapping addressing error, diagnose why the affected path fails, correct it and update the evidence."],
        ["VLSM worksheet/addressing table", "Addressed .pkt topology", "Route/interface evidence", "Incorrect-prefix diagnosis"],
        ["All allocated networks are non-overlapping.", "Host requirements fit their selected prefixes.", "Configured addresses match the design source of truth.", "A subnetting fault is diagnosed without random readdressing."],
    ),
    lab(
        "Switching, VLANs and 802.1Q Trunks",
        "A switched LAN becomes an enterprise network only when broadcast domains and access policy are deliberate. Build VLAN boundaries, observe MAC learning and carry multiple VLANs across an 802.1Q trunk.",
        ["Explain switch MAC learning and forwarding.", "Create VLANs for distinct branch roles.", "Configure access ports and an 802.1Q trunk.", "Use MAC, VLAN and trunk state to diagnose Layer-2 faults."],
        ["Build two access switches with users from at least two departments/VLANs.", "Generate traffic and inspect learned MAC addresses before adding segmentation.", "Create the VLANs consistently and assign access ports according to the topology plan.", "Configure an 802.1Q trunk between switches and explicitly control the VLANs that must traverse it.", "Prove same-VLAN communication across the trunk and prove different VLANs remain isolated before routing exists.", "Break one access VLAN or trunk allowance/native setting, use show vlan brief, show interfaces trunk and MAC-table evidence to localize it, then restore service."],
        ["VLAN/port matrix", "Switching .pkt topology", "MAC/VLAN/trunk evidence", "Layer-2 fault record"],
        ["Broadcast domains match the VLAN design.", "The trunk carries only intended VLANs.", "Isolation is tested as well as reachability.", "The injected fault is localized at Layer 2 before repair."],
    ),
    lab(
        "Inter-VLAN Routing and Default Gateways",
        "VLAN separation creates a routing requirement. Make that boundary explicit by implementing inter-VLAN routing and proving that endpoint default gateways determine whether traffic can leave its local subnet.",
        ["Implement inter-VLAN routing using router-on-a-stick or a Packet Tracer Layer-3 switch.", "Map VLANs to routed interfaces/SVIs and gateways.", "Trace a packet between VLANs.", "Diagnose gateway and encapsulation faults."],
        ["Extend the previous VLAN topology with a deliberate Layer-3 boundary.", "Choose router-on-a-stick or multilayer switching and justify the choice for the lab.", "Configure one gateway per VLAN and the required 802.1Q/routed interfaces.", "Prove intra-VLAN and inter-VLAN communication separately.", "Trace the expected source MAC, destination gateway MAC and routed next segment for one cross-VLAN flow.", "Break one endpoint gateway or subinterface/SVI configuration, diagnose it from host and device evidence, restore it and prove recovery."],
        ["Inter-VLAN .pkt topology", "Gateway/interface map", "Cross-VLAN packet trace", "Gateway/routing fault record"],
        ["Each VLAN has one deliberate Layer-3 gateway.", "Cross-VLAN traffic is routed rather than accidentally bridged.", "The learner can explain the Layer-2 and Layer-3 address changes across the path.", "Negative and positive reachability are both demonstrated."],
    ),
    lab(
        "STP and EtherChannel Resilience",
        "Redundant Ethernet links create both availability and loop risk. Spanning Tree must intentionally block a loop while EtherChannel can combine compatible links into one logical forwarding relationship.",
        ["Explain why Layer-2 loops are destructive.", "Observe STP root and port roles.", "Build redundant links without creating uncontrolled forwarding loops.", "Configure and validate EtherChannel and diagnose member/configuration mismatch."],
        ["Create a three-switch topology with redundant Layer-2 paths.", "Before adding the redundant link, predict where a loop would exist without STP.", "Inspect STP root election and port roles/states after redundancy is added.", "Choose and configure the intended root bridge instead of accepting an accidental root.", "Build an EtherChannel from at least two compatible physical links and validate the logical bundle.", "Break one EtherChannel member/configuration parameter and separately fail one redundant path; observe convergence/impact, diagnose from STP/EtherChannel evidence and restore."],
        ["Redundant-switch .pkt topology", "STP root/port-role evidence", "EtherChannel evidence", "Failure/convergence record"],
        ["The topology contains intentional redundancy without uncontrolled loops.", "Root placement is deliberate.", "EtherChannel members have compatible configuration.", "The learner distinguishes STP behavior from link-bundle behavior."],
        150,
    ),
    lab(
        "Static, Default and OSPF Routing",
        "As the branch grows beyond one router, reachability depends on route ownership and next-hop knowledge. Establish static/default routing first, then introduce single-area OSPF because maintaining every route manually has become operational pressure.",
        ["Read a routing table and distinguish connected, static, default and OSPF-learned routes.", "Configure static and default routes.", "Implement single-area OSPF across multiple routers.", "Diagnose missing routes and failed OSPF adjacency."],
        ["Build at least three routers representing branch, core and upstream/remote networks.", "Bring up the topology using connected routes plus explicit static/default routes and prove end-to-end reachability.", "Record the maintenance burden created by adding another routed network.", "Replace appropriate internal static routes with single-area OSPF while keeping the external/default boundary explicit.", "Inspect neighbor and route evidence and identify which routes are connected, static/default and OSPF learned.", "Break one OSPF adjacency or advertisement and diagnose the resulting route loss before restoring it."],
        ["Multi-router .pkt topology", "Static/default route baseline", "OSPF neighbor and route evidence", "Routing failure diagnosis", "Static-versus-OSPF trade-off note"],
        ["Every remote subnet has an explainable route and return route.", "OSPF adjacency and learned routes are proven from device state.", "The default route is not confused with internal dynamic routing.", "The learner can identify a control-plane failure before testing applications."],
        160,
    ),
    lab(
        "DHCP, Relay and NAT/PAT",
        "Client configuration and internet egress become infrastructure responsibilities once multiple routed networks exist. Centralize DHCP where useful, relay requests across a router boundary and translate private addresses deliberately at the edge.",
        ["Configure DHCP scopes for routed client networks.", "Use DHCP relay when the server is not in the client broadcast domain.", "Implement NAT/PAT at an explicit inside/outside boundary.", "Separate address-assignment failure from routing and translation failure."],
        ["Add a DHCP service to the routed branch topology and define at least two client scopes with correct gateway/DNS options.", "Place one client subnet across a router boundary and configure DHCP relay/helper behavior.", "Prove clients receive addresses from the intended scope and record lease/configuration evidence.", "Add an upstream network representing the internet and configure PAT for branch private addresses at the edge.", "Prove internal routing first, then outbound translated connectivity and inspect translation state.", "Break DHCP relay or NAT inside/outside/rule configuration, predict which stage fails, diagnose it and restore service."],
        ["DHCP scope plan", "Relay and client lease evidence", "NAT/PAT configuration and translation evidence", "Infrastructure-service failure record"],
        ["Clients receive correct network parameters without manual addressing.", "Broadcast-domain boundaries explain why relay is required.", "NAT occurs only at the intended edge.", "DHCP, routing and NAT are tested as separate stages."],
        150,
    ),
    lab(
        "ACL Policy and Negative Testing",
        "Routing answers where traffic can go; policy answers where traffic may go. Use standard and extended ACLs to enforce a small branch policy and prove both intended access and intended denial.",
        ["Translate a traffic requirement into ordered ACL rules.", "Choose standard versus extended ACL placement deliberately.", "Apply ACLs to the correct interface and direction.", "Use counters and negative tests to diagnose policy behavior."],
        ["Define a policy such as users may reach Steward HTTPS, administrators may reach the management subnet, and ordinary users may not reach management services.", "Write the traffic matrix before writing IOS ACL syntax.", "Implement one standard and one extended ACL only where each solves a real requirement.", "Apply each ACL to a deliberate interface/direction and prove allowed flows.", "Run explicit denied-flow tests and inspect ACL counters/evidence.", "Introduce a rule-order or direction error, diagnose why a legitimate or denied flow behaves incorrectly, fix it and re-run the full traffic matrix."],
        ["Traffic-policy matrix", "ACL configuration/evidence", "Positive and negative test results", "ACL fault diagnosis"],
        ["Policy begins as source/destination/protocol intent rather than IOS syntax.", "Allowed and denied paths are both evidenced.", "Implicit deny and rule ordering are understood.", "A policy failure is distinguished from missing routing."],
        130,
    ),
    lab(
        "IPv6 Addressing and Routing Fundamentals",
        "A Technical Steward should recognize and operate a basic dual-stack network rather than treating IPv6 as an exotic future protocol. Build enough IPv6 to understand addressing, neighbor discovery, gateways and routing without turning TSA into an IPv6 specialist course.",
        ["Recognize global unicast and link-local IPv6 addressing roles.", "Configure IPv6 on router interfaces and hosts.", "Prove routed IPv6 reachability.", "Diagnose a basic IPv6 addressing or route fault independently from IPv4."],
        ["Add IPv6 prefixes to at least two routed LANs in an existing topology while preserving IPv4.", "Record interface global and link-local addresses.", "Configure or observe the endpoint default-router behavior supported by Packet Tracer.", "Prove same-link and routed IPv6 connectivity and inspect IPv6 route/neighbor evidence.", "Break one IPv6 prefix, gateway or routing assumption while leaving IPv4 healthy.", "Use that asymmetry to prove the failure belongs specifically to the IPv6 path, then restore it."],
        ["Dual-stack addressing table", "IPv6 route/neighbor evidence", "Dual-stack .pkt topology", "IPv6-only failure diagnosis"],
        ["IPv4 and IPv6 are treated as independent protocol paths.", "Link-local and global addresses are not conflated.", "At least one routed IPv6 flow succeeds.", "A broken IPv6 path is diagnosed without disturbing working IPv4."],
        120,
    ),
    lab(
        "Capstone: Enterprise Branch Network",
        "Integrate the network-device skills into one branch topology that could credibly sit beneath the TSA homelab. The capstone is complete only when the healthy design, security boundaries, redundancy and troubleshooting evidence all agree.",
        ["Design a multi-device branch network from requirements.", "Integrate segmentation, routing, infrastructure services, edge translation and access policy.", "Operate the topology from a documented source of truth.", "Diagnose multiple injected faults systematically.", "Translate the simulated design into constraints for the physical TSA homelab."],
        ["Design a branch with at least user, management and server VLANs; redundant switching; at least three routed devices or equivalent routed boundaries; an upstream/internet network; and a remote/secondary network.", "Produce the topology diagram, VLSM/IPv6 addressing plan, VLAN/port matrix, routing design and traffic-policy matrix before final configuration.", "Implement VLANs/trunks, deliberate STP root placement, an EtherChannel, inter-VLAN routing, OSPF, DHCP/relay, PAT and ACL policy. Add bounded IPv6 routing to at least two segments.", "Place a simulated Steward server in the server network and prove intended client access while management access remains restricted by the policy matrix.", "Capture show-command evidence for interfaces, VLAN/trunks, STP/EtherChannel, routes/OSPF, DHCP where available, NAT and ACLs.", "Create at least five fault cards spanning different layers, such as wrong access VLAN, blocked trunk VLAN, bad gateway, failed OSPF advertisement, incorrect ACL direction, DHCP relay failure or NAT error. Inject them one at a time without revealing the answer during diagnosis.", "For every fault, write a hypothesis, identify last-known-good/first-known-bad evidence, repair only after localization, and prove recovery from the affected endpoint.", "Save the final .pkt file and write a transfer note identifying which parts can be reproduced with the actual homelab router/switches and which remain simulation-only until hardware supports them."],
        ["Final enterprise-branch .pkt file", "Topology diagram", "IPv4 VLSM and bounded IPv6 addressing plan", "VLAN/port and traffic-policy matrices", "Healthy IOS evidence pack", "Five-fault troubleshooting journal", "Packet Tracer-to-homelab transfer note"],
        ["The design has no unexplained network or VLAN.", "All required user, server and management paths match the traffic-policy matrix.", "Redundancy does not create an uncontrolled Layer-2 loop.", "Dynamic routing and edge/default routing have explicit ownership.", "Five faults are localized from evidence before repair.", "The learner can explain the design without relying on Packet Tracer animation alone."],
        300,
    ),
];