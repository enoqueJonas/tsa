import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { networkingFoundationsDeepLessons } from "./platform-builder-networking-deep";

const practices: Record<string, PracticalContent> = {
    "Networking Mental Models: OSI and TCP/IP": {
        type: "practical",
        objective: "Trace one real Steward request across independently testable network boundaries instead of treating connectivity as one opaque system.",
        scenario: "A user reports that Steward is unavailable. You need a diagnostic map that tells you exactly which question to ask at link, IP, transport, TLS and application boundaries.",
        instructions: ["Choose a real client and one working Steward request.", "Capture the destination name, resolved address and port.", "Record interface, route and listening-socket evidence.", "Map each observation to the layer/question it answers.", "Introduce one safe failure such as a wrong port or stopped listener and identify the first boundary that fails.", "Write the minimum evidence sequence you would collect before saying 'network issue'."],
        deliverables: ["Client-to-Steward boundary map", "Healthy and failed-path evidence", "Diagnostic sequence"],
        completionCriteria: ["Each observation answers a distinct network question.", "The learner identifies a last-known-good and first-known-bad boundary.", "The diagnosis does not collapse all failures into vague network language."],
    },
    "Ethernet and Switching": {
        type: "practical",
        objective: "Explain the local-link path between the Steward host, its gateway and another LAN peer using interface and neighbor evidence.",
        scenario: "Steward is reachable from one device on the LAN but not another. Before blaming IP routing, determine what the local Ethernet or virtual-switch path must do.",
        instructions: ["Record the relevant interface names and MAC addresses.", "Capture neighbor-table entries for the gateway and one same-subnet peer.", "Identify whether the path crosses a physical switch, virtual switch or both.", "Explain which destination MAC is used for local versus routed traffic.", "State one link-layer failure symptom and how you would distinguish it from a routing failure."],
        deliverables: ["Local-link topology", "Neighbor evidence", "Switching-vs-routing failure note"],
        completionCriteria: ["MAC and IP responsibilities are not conflated.", "The actual local path is tied to observed interfaces.", "A link failure is distinguished from an IP-layer failure."],
    },
    "IP Addressing": {
        type: "practical",
        objective: "Prove which Steward addresses are loopback, LAN-reachable and unsuitable for remote clients.",
        scenario: "Steward works with curl on the server but a second device cannot connect. Determine whether the application is bound to the wrong address scope.",
        instructions: ["Record all IPv4 addresses/prefixes on the Steward host.", "Inspect the address on which Steward listens.", "Test loopback and LAN access separately.", "Predict the result of binding only to 127.0.0.1 and verify safely.", "Document the address/binding that a LAN client should use and why."],
        deliverables: ["Address-scope inventory", "Binding/reachability evidence", "LAN listener decision"],
        completionCriteria: ["Loopback and LAN-facing scope are distinguished.", "Listening address is verified rather than assumed.", "Remote reachability is proven from another host."],
    },
    "Subnetting": {
        type: "practical",
        objective: "Design and verify the smallest useful subnet structure for the Steward homelab without creating complexity for its own sake.",
        scenario: "You want enough address structure to support future management and service boundaries, but unnecessary subnetting would make the lab harder to operate.",
        instructions: ["Calculate the current Steward subnet from its address/prefix.", "Confirm the gateway belongs to the expected local network.", "Identify the DHCP range before proposing static addresses.", "Design one simple management/service separation option and explain what new routing requirement it creates.", "Reject the design if the boundary does not yet solve a real problem."],
        deliverables: ["Current subnet calculation", "Address-allocation plan", "Boundary decision"],
        completionCriteria: ["CIDR is used to reason about reachability.", "Static addressing avoids DHCP conflicts.", "Any extra subnet has a stated operational purpose."],
    },
    "ARP": {
        type: "practical",
        objective: "Observe how a routed decision becomes local Ethernet delivery through neighbor resolution.",
        scenario: "The route table looks correct, but traffic still cannot leave the subnet. Determine whether next-hop neighbor resolution is succeeding.",
        instructions: ["Capture the route selected for a same-subnet peer and an internet destination.", "Capture ip neigh before and after generating traffic.", "Identify which address is resolved for each case.", "Explain why remote traffic normally resolves the gateway MAC rather than the final destination MAC.", "Record one failed-neighbor symptom and the layer it implicates."],
        deliverables: ["Route/neighbor evidence", "Next-hop explanation", "ARP failure diagnosis"],
        completionCriteria: ["Route selection and neighbor resolution are treated as separate steps.", "The correct next-hop MAC reasoning is demonstrated.", "A neighbor failure is not misdiagnosed as DNS or HTTP."],
    },
    "TCP and UDP": {
        type: "practical",
        objective: "Connect transport semantics to real Steward and DNS sockets instead of reducing TCP/UDP to memorized definitions.",
        scenario: "Ping works, but Steward does not. Determine what transport evidence is actually required to prove the application port is reachable.",
        instructions: ["Inventory relevant listening TCP and UDP sockets.", "Identify Steward's transport endpoint and the resolver's likely transport use.", "Demonstrate a successful TCP connection to Steward.", "Compare connection-refused and timeout behavior using safe tests.", "Explain why ICMP reachability does not prove TCP service reachability."],
        deliverables: ["Socket inventory", "Transport failure comparison", "Steward transport explanation"],
        completionCriteria: ["TCP/UDP are explained from semantics and evidence.", "Refusal and timeout are distinguished.", "Ping is not treated as an application-health test."],
    },
    "Ports and Sockets": {
        type: "practical",
        objective: "Map Steward's listening sockets to owning processes, bind addresses and expected clients.",
        scenario: "A firewall rule appears correct, but there is no evidence that an application is actually listening on the expected endpoint.",
        instructions: ["Use ss to identify Steward's listening socket and owning process.", "Record protocol, local address and port.", "Compare a wildcard listener with a loopback-only listener conceptually or in a safe test.", "Identify one backend socket that should not be exposed to ordinary clients.", "Build a small listener inventory with intended audience for each endpoint."],
        deliverables: ["Listener/process map", "Bind-scope evidence", "Exposure intent table"],
        completionCriteria: ["A firewall-open port is not confused with a listening service.", "Bind scope is explicit.", "Backend and user-facing sockets have different exposure intent."],
    },
    "Routing": {
        type: "practical",
        objective: "Prove which route Linux selects for local, VPN and internet destinations and explain the next hop for each.",
        scenario: "Steward's host has more than one possible path as the homelab grows. Guessing from the route-table shape is no longer enough.",
        instructions: ["Capture the route table and default route.", "Use ip route get for a LAN peer and an internet destination.", "Record the chosen interface, source address and next hop.", "Add a hypothetical private/VPN subnet and explain what route would be required.", "Identify one asymmetric or missing-route failure that could make one direction work while the other fails."],
        deliverables: ["Route-decision evidence", "Destination-path table", "Asymmetry/missing-route analysis"],
        completionCriteria: ["Route selection is demonstrated per destination.", "Source address and next hop are included.", "Return-path reasoning is considered."],
    },
    "DHCP": {
        type: "practical",
        objective: "Separate dynamic host configuration from the stable addressing requirements of a server environment.",
        scenario: "A reboot changes an address and breaks bookmarks, firewall assumptions or DNS records. Decide what should remain dynamic and what needs a stable identity.",
        instructions: ["Identify how the current host obtained its address, gateway and DNS settings.", "Record the active DHCP lease or equivalent evidence where available.", "Identify the current DHCP pool on the learner-managed network if accessible.", "Compare static host configuration with a DHCP reservation for Steward.", "Choose the most maintainable stable-address approach for the current lab and document the collision-avoidance rule."],
        deliverables: ["DHCP evidence", "Stable-address decision", "Collision-avoidance note"],
        completionCriteria: ["DHCP's role in supplying more than an IP address is understood.", "Server stability is addressed deliberately.", "The chosen method does not create unmanaged address conflicts."],
    },
    "DNS": {
        type: "practical",
        objective: "Trace Steward name resolution from query to returned address and distinguish DNS failure from service failure.",
        scenario: "Connecting by IP works, but the Steward hostname fails. Determine whether the fault belongs to name resolution or the application path.",
        instructions: ["Record the host's configured resolver.", "Resolve a known public name and the Steward name using dig or an equivalent tool.", "Compare a successful lookup with an intentionally nonexistent name.", "Test Steward by IP and by name and interpret any difference.", "Design a local DNS name for the homelab that avoids editing every client's hosts file."],
        deliverables: ["Resolver/query evidence", "Name-vs-IP comparison", "Local DNS design note"],
        completionCriteria: ["DNS is isolated as its own dependency.", "NXDOMAIN/lookup failure is distinguished from TCP/application failure.", "The local naming approach has an explicit owner/source of truth."],
    },
    "NAT": {
        type: "practical",
        objective: "Explain how private Steward traffic crosses a NAT boundary and why outbound translation is different from inbound publication.",
        scenario: "The homelab reaches the internet successfully, but internet clients cannot initiate connections to Steward. Explain why that is expected.",
        instructions: ["Record Steward's private address and the network's observed public address where safe.", "Trace an outbound request and identify where address translation occurs conceptually.", "Explain why successful outbound NAT does not create an inbound Steward mapping.", "Model the minimum router port-forward required for direct publication without implementing it yet.", "Identify how CGNAT would prevent that design even if the home router is configured correctly."],
        deliverables: ["Private-to-public NAT model", "Inbound-vs-outbound explanation", "CGNAT constraint note"],
        completionCriteria: ["NAT is not confused with firewalling.", "Inbound publication is treated as a separate deliberate mapping.", "CGNAT is recognized as an upstream constraint."],
    },
    "Firewalls": {
        type: "practical",
        objective: "Use Rocky Linux firewalld to prove that reachability is policy, not simply whether a process listens.",
        scenario: "Steward should be reachable from an approved network path while backend and administrative ports remain closed to ordinary clients.",
        instructions: ["Inspect active firewalld zones, interfaces and current rules.", "Identify the smallest rule required for the intended Steward LAN path.", "Test one permitted and one denied connection from another host.", "Compare runtime and permanent configuration and make persistence explicit.", "Verify PostgreSQL or another backend-only port is not opened merely for convenience.", "Record the rollback command/path for the rule change."],
        deliverables: ["Zone/rule evidence", "Positive and negative reachability proof", "Firewall change and rollback record"],
        completionCriteria: ["The rule is narrower than 'open everything'.", "Allowed and denied behavior are both tested.", "Backend ports remain private."],
    },
    "HTTP and TLS from the Network Perspective": {
        type: "practical",
        objective: "Separate DNS, TCP, TLS and HTTP evidence while tracing a secure request toward Steward.",
        scenario: "A browser says the site is unavailable, but that single message could represent several different failures.",
        instructions: ["Resolve the target name and record the resulting address.", "Prove the TCP endpoint is reachable.", "Use openssl s_client or equivalent to inspect a TLS handshake/certificate where available.", "Use curl -v to inspect the HTTP exchange.", "Create a four-stage DNS -> TCP -> TLS -> HTTP diagnostic table with one representative failure at each stage."],
        deliverables: ["Protocol-stage evidence", "Certificate/TLS observation", "Layered failure table"],
        completionCriteria: ["TLS and HTTP are not treated as the same protocol stage.", "Each test has a clear hypothesis.", "The learner can identify the first failing stage."],
    },
    "Network Troubleshooting Tools": {
        type: "practical",
        objective: "Diagnose one controlled Steward reachability failure by choosing tools from hypotheses rather than running a memorized command list.",
        scenario: "A request fails after a network change. You must preserve evidence and narrow the fault before changing configuration.",
        instructions: ["Capture a healthy baseline first.", "Introduce one safe failure such as wrong DNS, a closed firewall rule, incorrect port or broken route in a controlled environment.", "Write the first hypothesis before selecting a command.", "Use a small subset of ip, ss, dig, curl, nc, traceroute, openssl s_client or tcpdump as justified.", "Record the last confirmed-good and first confirmed-bad boundary.", "Restore the environment and prove recovery from the client."],
        deliverables: ["Healthy baseline", "Hypothesis-driven diagnostic transcript", "Recovery proof"],
        completionCriteria: ["Tools are selected because they answer stated questions.", "The failure is localized before repair.", "Recovery is verified from the client perspective."],
    },
};

const wireGuardLesson: Lesson = {
    id: "networking-foundations-wireguard-private-management-network",
    title: "WireGuard and Private Management Access",
    activities: [
        {
            id: "networking-foundations-wireguard-private-management-network-reading",
            title: "WireGuard and Private Management Access",
            estimatedMinutes: 45,
            content: {
                type: "reading",
                body: "A VPN is useful when it creates an explicit trusted network path across an untrusted network. In TSA, WireGuard is the primary implementation for private administrative access: SSH and later Jenkins, Nexus and operations interfaces should not become public merely because Steward itself may eventually be public.",
                blocks: [
                    { type: "heading", id: "tunnel-model", text: "A routed encrypted interface", level: 2 },
                    { type: "paragraph", text: "WireGuard creates a virtual network interface whose peers authenticate with public keys. AllowedIPs acts as both a routing declaration and a peer traffic selector. The important mental model is not 'remote login tool' but an encrypted routed network between explicitly configured peers." },
                    { type: "heading", id: "control-plane", text: "Separate user traffic from management traffic", level: 2 },
                    { type: "code", language: "text", code: "Public user path (later): Internet -> HTTPS edge -> Steward\nManagement path: Engineer -> WireGuard -> SSH / Jenkins / Nexus\nBackend path: Steward -> PostgreSQL / Redis / RabbitMQ", caption: "Different audiences deserve different network paths." },
                    { type: "paragraph", text: "A VPN does not replace service authentication, host patching or least privilege. It limits network reachability and creates a deliberate management boundary. Later schools will add identity, gateway policy and stronger operational controls on top of this network boundary." },
                    { type: "heading", id: "routing", text: "Routes and AllowedIPs must agree", level: 2 },
                    { type: "paragraph", text: "When a VPN connection succeeds but a private service remains unreachable, investigate route selection, forwarding, firewalld policy and the service listener independently. A green WireGuard handshake proves peer communication, not application reachability." },
                    { type: "resources", title: "Required and supporting reading", resources: [{ title: "WireGuard Quick Start", url: "https://www.wireguard.com/quickstart/" }, { title: "WireGuard conceptual overview", url: "https://www.wireguard.com/" }] },
                ],
            },
        },
        {
            id: "networking-foundations-wireguard-private-management-network-practical",
            title: "Build the Steward management VPN",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Build a learner-owned WireGuard path to the Rocky Linux Steward environment and make at least one administrative resource reachable only through the private/VPN route.",
                scenario: "Steward's user-facing API may later become public, but SSH and future Jenkins/Nexus interfaces must have a separate management path that is not directly reachable from an untrusted network.",
                instructions: ["Choose a non-overlapping private VPN subnet and document why it does not collide with existing LAN routes.", "Create WireGuard keys for the Rocky Linux peer and one administrator client without exposing private keys in project evidence.", "Configure the peers, AllowedIPs and routes needed for the management path.", "Use firewalld to permit the VPN transport and restrict the chosen management service to the intended private/VPN path.", "Prove the WireGuard handshake and route selection independently from application access.", "From the authorized client, prove the management resource is reachable through the VPN.", "From a non-VPN/untrusted path, prove the same management resource is not directly reachable.", "Document how the design changes if the homelab sits behind CGNAT and why an outbound/site-to-site tunnel to a public edge can solve that later."],
                deliverables: ["VPN topology and address plan", "Sanitized WireGuard configuration evidence", "Route/firewalld evidence", "Positive VPN reachability proof", "Negative non-VPN reachability proof", "CGNAT handoff note"],
                completionCriteria: ["Private keys are not committed or exposed as evidence.", "VPN connectivity and application reachability are verified as separate concerns.", "At least one administrative resource is reachable only through the intended private/VPN path.", "The solution does not expose PostgreSQL, Redis, RabbitMQ or other backend-only services publicly.", "The learner can explain how this management plane will coexist with a later public Kong/HTTPS path."],
            },
        },
        {
            id: "networking-foundations-wireguard-private-management-network-review",
            title: "VPN boundary review",
            estimatedMinutes: 15,
            content: { type: "reflection", prompt: "Explain the difference between a successful WireGuard handshake, a correct route, an allowed firewall path and a reachable application socket. Which Steward resources belong on the public, management and backend planes, and what would you change if your ISP placed the homelab behind CGNAT?", minimumCharacters: 250 },
        },
    ],
};

const enhanced = networkingFoundationsDeepLessons.map((lesson) => {
    const practical = practices[lesson.title];
    if (!practical) return lesson;
    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical" ? { ...activity, content: practical } : activity,
        ),
    };
});

const labIndex = enhanced.findIndex((lesson) => lesson.title === "Lab: Diagnose a Broken Service Path");
const insertionIndex = labIndex === -1 ? enhanced.length : labIndex;

export const networkingFoundationsQualityLessons: Lesson[] = [
    ...enhanced.slice(0, insertionIndex),
    wireGuardLesson,
    ...enhanced.slice(insertionIndex),
];
