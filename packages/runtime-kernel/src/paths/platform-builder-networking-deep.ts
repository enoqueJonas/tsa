import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const tcpIpGuide: LearningResource = { title: "Cloudflare Learning Center — What is TCP/IP?", url: "https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/" };
const ipAddressing: LearningResource = { title: "RFC 1918 — Address Allocation for Private Internets", url: "https://datatracker.ietf.org/doc/html/rfc1918" };
const tcpRfc: LearningResource = { title: "RFC 9293 — Transmission Control Protocol", url: "https://datatracker.ietf.org/doc/html/rfc9293" };
const udpRfc: LearningResource = { title: "RFC 768 — User Datagram Protocol", url: "https://datatracker.ietf.org/doc/html/rfc768" };
const dnsGuide: LearningResource = { title: "Cloudflare Learning Center — What is DNS?", url: "https://www.cloudflare.com/learning/dns/what-is-dns/" };
const tlsGuide: LearningResource = { title: "Cloudflare Learning Center — What is TLS?", url: "https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/" };
const ipMan: LearningResource = { title: "ip(8) Linux manual", url: "https://man7.org/linux/man-pages/man8/ip.8.html" };
const ssMan: LearningResource = { title: "ss(8) Linux manual", url: "https://man7.org/linux/man-pages/man8/ss.8.html" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type Section = { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } };

function richLesson(
    title: string,
    introduction: string,
    outcomes: string[],
    sections: Section[],
    objective: string,
    instructions: string[],
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `networking-foundations-${slug(title)}`;
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

    blocks.push({ type: "callout", tone: "steward", title: "Steward connection", body: "Treat the client-to-Steward path as a chain of independently observable network decisions. Do not say 'the network is down' when you can identify whether the fault is local addressing, switching, routing, name resolution, transport, firewall policy, TLS or the listening application socket." });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 35, content: { type: "reading", body: introduction, blocks } },
            {
                id: `${id}-practice`,
                title: `${title}: Network Practice`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Use the Linux host or VM that operates Steward API. Capture real network evidence rather than relying on diagrams alone.",
                    instructions,
                    deliverables: ["Commands and outputs from the real host", "A short explanation of what the evidence proves", "One Steward-specific failure or reachability implication"],
                    completionCriteria: ["The evidence comes from the learner-managed Steward environment.", "The learner explains the mechanism rather than only the command syntax.", "The finding is placed at the correct network layer or boundary."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const networkingFoundationsDeepLessons: Lesson[] = [
    richLesson(
        "Networking Mental Models: OSI and TCP/IP",
        "Layer models are useful when they help you localize responsibility. They become harmful when treated as trivia. A platform engineer should use layers to ask which mechanism must work next for a Steward request to move from client to application.",
        ["Use OSI/TCP-IP as diagnostic models rather than memorization exercises.", "Map a Steward request across link, internet, transport and application concerns.", "Recognize encapsulation and decapsulation as data crosses layers."],
        [
            { title: "Layers separate questions", paragraphs: ["At one moment you may be asking whether Ethernet can reach the gateway; at another whether IP knows a route; at another whether TCP established a connection; and finally whether HTTP received a valid response. These are different questions even though the user experiences one failed request.", "The models do not perfectly match every modern implementation. Their value is disciplined fault localization and vocabulary."] },
            { title: "Follow one request", paragraphs: ["A browser or curl process creates application data. The operating system places that data into a transport flow, IP packets and link-layer frames appropriate for each hop. The receiver reverses those abstractions before Django sees the request.", "When troubleshooting, move through the path with evidence instead of restarting arbitrary components."], code: { language: "text", code: "HTTP\n  ↓\nTCP connection\n  ↓\nIP packet / route\n  ↓\nEthernet or virtual link\n  ↓\n... network ...\n  ↓\nSteward listening socket", caption: "A request crosses several independently testable responsibilities." } },
        ],
        "Draw and verify the actual client-to-Steward path, labeling one observable fact at each major layer.",
        ["Choose a real client that can reach Steward.", "Record the destination hostname/IP and port.", "Identify the interface and route chosen by the client or server.", "Identify the listening socket on the server.", "Map each observation to the layer/question it answers."],
        ["Why are layered models useful during incident diagnosis?", "What does encapsulation mean operationally?", "Why can HTTP fail even when IP connectivity works?"],
        [tcpIpGuide, ipMan, ssMan],
    ),
    richLesson(
        "Ethernet and Switching",
        "Within a local network, Ethernet and switching determine how frames move between interfaces. Before packets can be routed elsewhere, a host must usually reach the appropriate next hop on its local link.",
        ["Explain MAC addresses and Ethernet frames at a practical level.", "Explain how a switch learns where to forward frames.", "Distinguish local-link forwarding from IP routing."],
        [
            { title: "MAC addresses identify link interfaces", paragraphs: ["A MAC address is used for delivery on a local Ethernet segment. It is not an internet-wide route. At each routed hop, link-layer addressing can change even though the IP destination remains the same.", "This distinction is essential when a host can reach devices in the same LAN but not destinations beyond its gateway."] },
            { title: "Switches learn from traffic", paragraphs: ["An Ethernet switch builds a forwarding table by observing source MAC addresses on ports. Known destinations are forwarded toward the learned port; unknown destinations may be flooded within the broadcast domain.", "A switch does not normally decide which IP network should receive a packet. That is the router's role."], code: { language: "bash", code: "ip link\nip neigh\nip route", caption: "Inspect link identity, neighbor knowledge and routing separately." } },
        ],
        "Identify the Ethernet or virtual-link interfaces used by the Steward host and explain what the local switch or virtual switch must know.",
        ["Record interface names and MAC addresses.", "Identify the default gateway's neighbor entry.", "Explain whether Steward traffic crosses a physical switch, virtual switch or both.", "State what symptom you would expect from a broken local-link path."],
        ["Why is a MAC address not a substitute for an IP address?", "How does a switch learn forwarding information?", "What is the boundary between switching and routing?"],
        [tcpIpGuide, ipMan],
    ),
    richLesson(
        "IP Addressing",
        "IP addressing answers two questions: which network is this interface attached to, and which host address identifies it within that scope? Correct addressing is foundational to every later reachability decision.",
        ["Read IPv4 addresses and prefix lengths.", "Distinguish private, loopback and routable addresses.", "Explain why an address must be interpreted together with its prefix."],
        [
            { title: "An address includes network context", paragraphs: ["Writing 192.168.10.20 without its prefix hides critical information. With /24, the host considers 192.168.10.0–255 local to that prefix; with a different prefix, the local-network decision changes.", "The address and prefix therefore influence whether the host sends directly to a neighbor or toward a router."] },
            { title: "Special scopes matter", paragraphs: ["127.0.0.1 is loopback and only reaches the same host. RFC 1918 ranges are private addressing and are commonly used inside homelabs. A service bound only to loopback can work locally while remaining unreachable from every other machine.", "That is a common platform failure: the application is healthy, but it listens on the wrong address scope."], code: { language: "bash", code: "ip -br addr\nip route get 8.8.8.8\nss -ltnp", caption: "Address assignment, route selection and listening address answer different questions." } },
        ],
        "Document the Steward host's addresses and determine which address should be used by a LAN client.",
        ["Record all IPv4 addresses and prefixes.", "Mark loopback versus LAN-facing interfaces.", "Record the address on which Steward listens.", "Explain whether that binding permits remote LAN access."],
        ["Why is an IP address incomplete without a prefix?", "Why can binding to 127.0.0.1 make a healthy service unreachable remotely?", "What are RFC 1918 addresses used for?"],
        [ipAddressing, ipMan],
    ),
    richLesson(
        "Subnetting",
        "Subnetting is not arithmetic for its own sake. It defines which addresses a host treats as directly reachable and how an address space is divided into manageable network boundaries.",
        ["Determine network and host portions from CIDR prefixes.", "Reason about same-subnet versus routed destinations.", "Use subnet boundaries to design a small homelab intentionally."],
        [
            { title: "The prefix drives the local decision", paragraphs: ["A /24 leaves 8 IPv4 host bits; a /26 leaves 6. More important than memorizing counts is understanding the operational consequence: devices outside the local prefix require routing.", "If two hosts are configured with inconsistent masks, each can form a different belief about whether the other is local, producing confusing asymmetric failures."] },
            { title: "Plan before assigning", paragraphs: ["For a small TSA homelab, a simple subnet is usually enough. Complexity should be introduced only when it teaches a real boundary such as management, services or guest traffic.", "VLANs arrive later in the school; subnetting gives the IP structure those boundaries will use."], code: { language: "text", code: "Example: 192.168.50.0/24\nNetwork: 192.168.50.0\nHosts:   192.168.50.1 - 192.168.50.254\nBroadcast:192.168.50.255", caption: "Use CIDR to reason about reachability, not only host counts." } },
        ],
        "Calculate and verify the subnet containing the Steward host and its gateway.",
        ["Record Steward's address/prefix.", "Derive the network range.", "Confirm the gateway is reachable within the expected local prefix.", "Choose two safe static addresses that could later be assigned to homelab hosts without colliding with the current DHCP plan."],
        ["What determines whether a destination is considered local?", "What can go wrong when two hosts use inconsistent subnet masks?", "Why should subnet complexity be justified by a real boundary?"],
        [ipMan, ipAddressing],
    ),
    richLesson(
        "ARP",
        "On IPv4 Ethernet networks, Address Resolution Protocol connects IP-level next-hop decisions to link-layer delivery. The host may know which IP it needs next and still be unable to send until it resolves the corresponding MAC address.",
        ["Explain why ARP is needed on local IPv4 links.", "Read the Linux neighbor table.", "Connect stale or missing neighbor resolution to reachability symptoms."],
        [
            { title: "Routing chooses an IP next hop; ARP resolves the link destination", paragraphs: ["If the destination is local, the host resolves that destination's MAC. If the destination is remote, it usually resolves the default gateway's MAC instead. ARP therefore acts after the IP routing decision has selected the next hop.", "This is why looking only at IP routes can miss a local-link failure."] },
            { title: "Neighbor state is evidence", paragraphs: ["Linux exposes neighbor entries through ip neigh. Entries transition through states as the kernel confirms or loses reachability.", "A failed neighbor resolution for the gateway points you toward link-layer reachability, not DNS or HTTP."], code: { language: "bash", code: "ip route get <destination-ip>\nip neigh show\nping -c 1 <gateway-ip>\nip neigh show", caption: "Observe route selection and neighbor resolution together." } },
        ],
        "Observe neighbor resolution for the Steward host's gateway and one same-subnet peer.",
        ["Capture the neighbor table before traffic.", "Generate traffic to the gateway and a LAN peer.", "Capture the table again.", "Explain which MAC address would be used for a remote internet destination and why."],
        ["When does a host ARP for the destination versus the gateway?", "Why can a correct route still fail at ARP?", "What does the Linux neighbor table tell you?"],
        [ipMan, tcpIpGuide],
    ),
    richLesson(
        "TCP and UDP",
        "Transport protocols define how application data is carried between endpoints. TCP provides an ordered reliable byte stream with connection state; UDP provides datagrams with much less transport machinery. The correct choice depends on application semantics.",
        ["Contrast TCP and UDP behavior.", "Explain connection establishment and reliability at a practical level.", "Connect transport choice to HTTP/DNS and Steward behavior."],
        [
            { title: "TCP maintains connection state", paragraphs: ["TCP establishes shared connection state, sequences bytes, retransmits lost data and controls flow. These properties are valuable for HTTP APIs but introduce state, timers and failure modes such as connection refusal and timeout.", "A successful ping does not prove TCP port 8000 or 443 is reachable because ICMP reachability and transport reachability are different tests."] },
            { title: "UDP preserves datagram boundaries", paragraphs: ["UDP does not establish a TCP-style connection or guarantee delivery. Applications that use it must tolerate loss, duplication or reordering as appropriate. DNS commonly uses UDP for many queries, while modern protocols can layer richer behavior above UDP.", "Do not reduce the distinction to 'TCP good, UDP fast.' Start from the semantics the application needs."], code: { language: "bash", code: "ss -ltnp\nss -lunp\ncurl -v http://<steward-host>:<port>/", caption: "Inspect which transport sockets actually exist on the host." } },
        ],
        "Identify every TCP or UDP socket relevant to serving and resolving a Steward request.",
        ["Capture listening TCP/UDP sockets.", "Identify Steward's application port.", "Identify whether the host uses UDP/TCP for DNS queries in your environment.", "Explain which failure would produce connection refused versus timeout."],
        ["What reliability properties does TCP add?", "Why does ping success not prove an HTTP service is reachable?", "Why is 'UDP is faster' an incomplete design argument?"],
        [tcpRfc, udpRfc, ssMan],
    ),
    richLesson(
        "Ports and Sockets",
        "IP addresses identify hosts or interfaces; ports identify transport endpoints used by applications. A listening socket is the concrete operating-system evidence that a service is prepared to accept traffic on a particular address/port combination.",
        ["Explain ports as transport-layer endpoint identifiers.", "Interpret listening versus established sockets.", "Distinguish binding to loopback, one interface or all interfaces."],
        [
            { title: "A socket is more specific than a port number", paragraphs: ["Saying 'Steward runs on port 8000' is incomplete. The important fact is which protocol and local address are bound, for example TCP 127.0.0.1:8000 versus TCP 0.0.0.0:8000.", "These bindings have very different exposure properties even though the numeric port is identical."] },
            { title: "Observe ownership", paragraphs: ["Linux can show which process owns a listening socket. This links network behavior back to the service manager and application process.", "When a client receives connection refused, confirm whether anything is listening before changing firewall rules."], code: { language: "bash", code: "sudo ss -ltnp\nsudo ss -tnp | head\nsystemctl status steward", caption: "Tie the socket to the process and service lifecycle." } },
        ],
        "Prove which process owns Steward's listening socket and whether that binding permits the intended clients.",
        ["Capture the listening address, port and PID/process.", "Test locally through loopback.", "Test from another host using the LAN address.", "Explain any difference in behavior using the binding evidence."],
        ["Why is 'port 8000' alone insufficient to describe exposure?", "What is the difference between listening and established sockets?", "What should you inspect first after connection refused?"],
        [ssMan, tcpRfc],
    ),
    richLesson(
        "Routing",
        "Routing determines which next hop and interface a host uses to reach an IP destination. Every request to Steward depends on routing decisions on the client, server and any routers between them.",
        ["Read a Linux routing table.", "Explain longest-prefix match and default routes.", "Use route lookup to predict a packet's next hop."],
        [
            { title: "Routes are ordered by specificity", paragraphs: ["The kernel selects the most specific matching route. A directly connected /24 therefore beats a default /0 route for addresses inside that local network.", "The default route is not 'the internet route' in a magical sense; it is simply the fallback when no more specific route matches."] },
            { title: "Return paths matter", paragraphs: ["A request can reach Steward while the response fails if the server or an intermediate device lacks a correct return path. Asymmetric routing is possible and can interact badly with stateful firewalls.", "Always reason in both directions rather than drawing a one-way arrow from client to server."], code: { language: "bash", code: "ip route\nip route get <client-ip>\nip route get 1.1.1.1\ntraceroute <destination>", caption: "Ask the kernel which route it will actually select." } },
        ],
        "Document the route from the Steward host to a LAN client and to an external destination.",
        ["Capture the routing table.", "Use ip route get for the client and an external IP.", "Identify next hop and interface in each case.", "Draw both request and return directions for the LAN path."],
        ["What is longest-prefix match?", "What role does the default route play?", "Why must troubleshooting include the return path?"],
        [ipMan, tcpIpGuide],
    ),
    richLesson(
        "DHCP",
        "DHCP automates host network configuration such as addresses, prefixes, gateways and DNS servers. It reduces manual work, but dynamic configuration must be reconciled with the need for stable addresses in a homelab.",
        ["Explain what DHCP supplies to a client.", "Distinguish dynamic leases from reservations and static host configuration.", "Identify collision and drift risks when assigning server addresses."],
        [
            { title: "DHCP distributes network parameters", paragraphs: ["A DHCP client can receive more than an IP address: subnet information, default gateway, DNS servers and lease duration may all be supplied. A host can therefore lose useful connectivity even when its address still looks plausible if other parameters are wrong.", "Inspect the complete configuration, not only the IPv4 address."] },
            { title: "Servers need predictable addressing", paragraphs: ["Steward clients, DNS records and reverse proxies need a stable way to find the service. That can be achieved with a DHCP reservation or a carefully managed static address outside the dynamic pool.", "Randomly choosing a static address inside the DHCP pool risks an address conflict later."], code: { language: "bash", code: "ip -br addr\nip route\nresolvectl status", caption: "Verify the address, gateway and resolver configuration actually installed on the host." } },
        ],
        "Determine how the Steward host receives its network configuration and propose a safe stable-address strategy.",
        ["Identify whether the address is DHCP-provided or static.", "Record gateway and DNS configuration.", "Find the router/DHCP pool if accessible.", "Choose reservation or static addressing and explain how you will avoid collisions."],
        ["What parameters can DHCP provide besides an IP address?", "Why do services benefit from stable addressing?", "Why is manually choosing an address inside the DHCP pool risky?"],
        [ipMan, dnsGuide],
    ),
    richLesson(
        "DNS",
        "DNS maps names to records that applications can use. For operators, DNS is a separate dependency from IP reachability: a service may work perfectly by address while failing by hostname.",
        ["Explain recursive resolution at a useful operational level.", "Distinguish A/AAAA and common name-resolution concerns.", "Use dig/resolvectl to separate DNS failure from network failure."],
        [
            { title: "Names are resolved before most connections", paragraphs: ["When a client uses steward.lab, the name must be translated into an address before TCP can connect. This creates a distinct failure boundary before the application port is even tested.", "A successful curl by IP alongside failure by hostname strongly points toward name resolution rather than the Steward process itself."] },
            { title: "Local DNS makes homelabs maintainable", paragraphs: ["Hard-coding server IPs into bookmarks, scripts and configs scales poorly. A small local DNS record can provide a stable service name while allowing the underlying address to be managed centrally.", "The record should describe the service boundary the client needs, not every internal process."], code: { language: "bash", code: "resolvectl status\ndig steward.lab\ngetent hosts steward.lab\ncurl -v http://steward.lab:<port>/", caption: "Test resolution independently before testing the application path." } },
        ],
        "Create or document a name-resolution path for Steward and prove name and address tests independently.",
        ["Record the current DNS resolver.", "Query the Steward hostname if one exists.", "Test Steward directly by IP.", "Test by hostname.", "Explain which evidence would distinguish stale DNS from an application outage."],
        ["Why can a service work by IP but fail by hostname?", "What is an A record?", "Why is DNS a separate failure boundary from TCP?"],
        [dnsGuide],
    ),
    richLesson(
        "NAT",
        "Network Address Translation rewrites addressing information as traffic crosses a boundary. Home networks commonly use NAT so many private hosts can share one public address, but NAT is not the same mechanism as a firewall.",
        ["Explain source NAT in a typical home network.", "Explain why inbound access usually needs explicit mapping or another access mechanism.", "Distinguish NAT from filtering policy."],
        [
            { title: "Outbound home traffic commonly uses source NAT", paragraphs: ["A Steward host may use a private RFC 1918 address while the router rewrites outbound traffic to a public address. Return traffic is mapped back using connection state maintained at the NAT device.", "This allows private hosts to initiate internet connections without being directly globally addressed."] },
            { title: "Inbound exposure is a separate decision", paragraphs: ["Publishing Steward from the internet usually requires an explicit forwarding, reverse-tunnel/VPN or other gateway mechanism. It should not be done merely because the service can be exposed.", "A NAT mapping also does not replace host or network firewall policy. Translation answers where traffic goes; filtering decides whether it is allowed."], code: { language: "text", code: "LAN client → 192.168.x.y (no NAT required)\nSteward host → Internet → router performs source NAT\nInternet → Steward requires explicit inbound design", caption: "NAT behavior depends on which boundary traffic crosses." } },
        ],
        "Trace whether NAT is involved in LAN-to-Steward and Steward-to-internet traffic.",
        ["Record Steward's private address.", "Identify the default gateway/NAT device.", "Explain why a same-LAN client normally does not need NAT to reach Steward.", "Document the safest current decision for internet exposure: no exposure unless a later requirement justifies it."],
        ["What problem does source NAT solve in a home network?", "Why is NAT not a firewall?", "Why does inbound reachability require additional design?"],
        [ipAddressing, tcpIpGuide],
    ),
    richLesson(
        "Firewalls",
        "A firewall enforces traffic policy. Correct administration requires knowing the direction, protocol, address and port being filtered, then proving whether the rule actually matches the path under investigation.",
        ["Explain allow/deny policy in stateful host firewalls.", "Use UFW/nftables evidence to reason about Steward reachability.", "Avoid weakening policy as a troubleshooting shortcut."],
        [
            { title: "Policy should follow intended exposure", paragraphs: ["If Steward should be reachable only from the homelab LAN, the firewall should encode that boundary instead of opening the port globally. Least exposure is the network equivalent of least privilege.", "The right rule depends on the service binding and topology; opening a port cannot fix a service that listens only on loopback."] },
            { title: "Inspect before changing", paragraphs: ["Troubleshooting should establish whether a socket exists, whether routes are correct and whether the firewall is dropping the intended flow. Disabling the firewall destroys useful evidence and may create a new security problem.", "Prefer a narrow temporary rule or logging when experimentation is necessary."], code: { language: "bash", code: "sudo ufw status verbose\nsudo nft list ruleset\nsudo ss -ltnp\ncurl -v http://<steward-ip>:<port>/", caption: "Correlate policy with the listening socket and the actual client test." } },
        ],
        "Document and test the minimum firewall rule needed for intended Steward clients.",
        ["Record current host-firewall policy.", "Identify the Steward listening port and intended source network.", "If a rule is required, make it as narrow as practical.", "Test from an allowed source and, where safe, from a source that should not be allowed.", "Record evidence instead of disabling the firewall."],
        ["Why can opening a firewall port fail to fix reachability?", "What does least exposure mean?", "Why is disabling the firewall a poor first diagnostic step?"],
        [ssMan, ipMan],
    ),
    richLesson(
        "HTTP and TLS from the Network Perspective",
        "HTTP is application-layer behavior carried over a transport connection, while TLS adds authenticated encryption between endpoints. Platform engineers must separate DNS, TCP, TLS and HTTP failures even when users experience all of them as 'the website is down.'",
        ["Trace an HTTP(S) request through DNS, TCP, TLS and HTTP stages.", "Explain what TLS certificates authenticate.", "Use curl/openssl output to localize handshake versus application failures."],
        [
            { title: "HTTPS has several prerequisites", paragraphs: ["The client generally resolves a name, establishes TCP, performs a TLS handshake and only then exchanges HTTP messages. A timeout before TCP, certificate-name mismatch and HTTP 500 are therefore categorically different failures.", "The fastest diagnosis starts by identifying the last successful stage."] },
            { title: "TLS protects the connection boundary", paragraphs: ["TLS encrypts traffic and allows the client to authenticate the server identity represented by the certificate. Certificate trust, validity period and hostname matching are part of the connection contract.", "In later modules a reverse proxy may terminate TLS in front of Steward. For now, understand exactly where encryption begins and ends rather than assuming 'HTTPS' applies everywhere internally."], code: { language: "bash", code: "curl -v https://steward.example/\nopenssl s_client -connect steward.example:443 -servername steward.example", caption: "Verbose client evidence shows DNS, connection and TLS stages separately." } },
        ],
        "Trace one HTTP or HTTPS request to Steward and mark the exact boundary where TLS is or would be terminated.",
        ["Use curl -v against the current Steward endpoint.", "Record the resolved address and TCP connection target.", "If TLS exists, inspect certificate subject/SAN and issuer.", "If TLS does not yet exist, document where a future reverse proxy would terminate it and what traffic would remain inside the LAN."],
        ["What stages normally precede an HTTPS response?", "What does a certificate hostname mismatch indicate?", "Why can HTTP 500 prove the network path is largely working?"],
        [tlsGuide, tcpRfc],
    ),
    richLesson(
        "Network Troubleshooting Tools",
        "Tools are useful only when each command answers a precise question. Effective network troubleshooting moves from local configuration to path, name resolution, transport and application evidence without randomly cycling through commands.",
        ["Choose ip, ss, ping, traceroute, dig and curl based on the question being tested.", "Build an evidence-driven troubleshooting sequence.", "Recognize the limits of each tool."],
        [
            { title: "Ask one question at a time", paragraphs: ["ip addr asks what addresses are configured. ip route asks how destinations are selected. ping tests one form of IP/ICMP reachability. ss inspects local sockets. dig tests DNS. curl exercises transport plus HTTP and optionally TLS.", "No single command proves 'the network works.' Each narrows the search space."] },
            { title: "Start near the failure", paragraphs: ["For remote Steward failure, first decide whether the server is healthy locally, whether it is listening on the intended address, whether the client resolves the right destination and whether routes/firewalls permit the path. The exact sequence can change with the symptom, but every step should have a hypothesis.", "Record failed as well as successful evidence; negative results are often more diagnostic."], code: { language: "bash", code: "ip -br addr\nip route\nip neigh\nss -ltnp\ndig <name>\nping -c 3 <ip>\ntraceroute <ip>\ncurl -v http://<host>:<port>/", caption: "A toolkit is not a checklist; select commands to test explicit hypotheses." } },
        ],
        "Create a one-page Steward network diagnostic runbook that maps symptoms to the next evidence-gathering command.",
        ["Define at least five symptoms: name failure, timeout, connection refused, TLS failure and HTTP error.", "For each symptom, state the first two questions you would test.", "Map each question to a command and expected evidence.", "Use the runbook once against the healthy Steward environment to capture a baseline."],
        ["Why does ping not prove an application port is open?", "What question does ss answer that traceroute does not?", "Why should every troubleshooting command have a hypothesis?"],
        [ipMan, ssMan, dnsGuide],
    ),
    {
        id: "networking-foundations-lab-diagnose-a-broken-service-path",
        title: "Lab: Diagnose a Broken Service Path",
        activities: [
            {
                id: "networking-foundations-lab-diagnose-a-broken-service-path-brief",
                title: "Build the healthy path baseline",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "Before breaking anything, capture enough evidence to explain why a healthy client can reach Steward. The baseline becomes your comparison point during diagnosis.",
                    blocks: [
                        { type: "heading", id: "baseline", text: "Required baseline", level: 2 },
                        { type: "list", items: ["Client and Steward IP/prefix", "Default gateway and selected route", "Relevant neighbor entry", "DNS answer if a hostname is used", "Steward listening address/port/process", "Host firewall rule affecting the port", "Successful curl output from the client"] },
                        { type: "callout", tone: "warning", title: "Protect remote access", body: "Do not introduce a firewall, routing or SSH change that can lock you out of the machine unless you have console access or another proven recovery path." },
                    ],
                },
            },
            {
                id: "networking-foundations-lab-diagnose-a-broken-service-path-practical",
                title: "Break, localize and recover the path",
                estimatedMinutes: 120,
                content: {
                    type: "practical",
                    objective: "Introduce one controlled network failure between a client and Steward, diagnose the exact failed boundary using evidence, then restore service and prove recovery.",
                    scenario: "Use the learner-managed Steward host. Choose a failure such as wrong listening address, narrow firewall denial, incorrect local DNS entry or a safe route/address misconfiguration that can be recovered without losing administration access.",
                    instructions: [
                        "Capture the healthy baseline first.",
                        "Choose exactly one controlled failure and state your predicted symptom before applying it.",
                        "Reproduce the client-visible failure.",
                        "Use a hypothesis-driven sequence of ip, ss, ping/traceroute, dig, firewall inspection and curl as appropriate.",
                        "Record the last confirmed-good boundary and first confirmed-bad boundary.",
                        "Restore the original configuration.",
                        "Repeat the healthy tests and prove recovery.",
                        "Write a short incident-style timeline including symptom, evidence, root cause and corrective action.",
                    ],
                    deliverables: ["Healthy network baseline", "Failure hypothesis and controlled change", "Command/output diagnostic transcript", "Root-cause explanation at the correct network boundary", "Recovery evidence", "Updated network troubleshooting runbook"],
                    completionCriteria: ["The failure is deliberate and recoverable.", "Diagnosis identifies a specific boundary instead of saying 'network issue'.", "The chosen commands are justified by hypotheses.", "Recovery returns the environment to the documented baseline.", "The learner can explain why nearby layers were not the root cause."],
                },
            },
            {
                id: "networking-foundations-lab-diagnose-a-broken-service-path-review",
                title: "Networking Foundations Exit Review",
                estimatedMinutes: 20,
                content: {
                    type: "reflection",
                    prompt: "1. Draw the complete client-to-Steward path and label switching, routing, name resolution, transport, firewall and application-socket boundaries.\n2. Which single piece of evidence most quickly localized your controlled failure?\n3. Which troubleshooting step would have wasted time, and why?\n4. What network assumption must the Virtualization module preserve when Steward moves between host and VM boundaries?",
                },
            },
        ],
    },
];
