import type {LearningResource} from "../activities/content";
// Connected Steward LAN case. Not evidence of production routing or live host configuration.
export const platformNetworkingTraceByTitle: Record<string, {title:string;paragraphs:string[];code?:{language:string;caption:string;code:string}}[]> = {
  "Networking Mental Models: OSI and TCP/IP": [
    {
      "title": "Read a packet journey as encapsulated responsibilities, not an OSI mnemonic",
      "paragraphs": [
        "Start from a browser request to https://steward.lab. The resolver must supply an address, the OS must choose a route, the transport must establish a TCP connection, TLS must authenticate and protect that connection, and only then does HTTP deliver an application request. At each step one layer takes a higher-level payload and adds information relevant to its own responsibility. The receiving host processes these layers in reverse. A routing table does not inspect Django URLs; Django cannot repair a failed ARP neighbor lookup.",
        "Encapsulation is about protocol boundaries: a TCP segment is carried inside an IP packet, and the packet rides over a per-hop link frame. The frame's MAC addresses can change when a router forwards the packet; the IP destination generally remains 192.168.50.20 unless a NAT device deliberately rewrites addressing. A single user-visible timeout may represent a wrong address, missing route, failed TCP SYN or stalled server. Name the last proven layer before guessing why the request failed."
      ]
    }
  ],
  "Ethernet and Switching": [
    {
      "title": "Worked frame: which MAC does the client actually need?",
      "paragraphs": [
        "In the connected Steward homelab example, the client is 192.168.50.70/26 and Steward is 192.168.50.20/26. Their /26 networks are different, so the client sends its Ethernet frame toward router 192.168.50.65—not directly to Steward's MAC. On the first link, the frame destination is the router's MAC while the IP destination remains 192.168.50.20. The router removes the old link header and creates an appropriate new one on the next link. Never infer an end-to-end MAC destination from an IP address.",
        "A switch learns the *source* MAC and ingress port when it receives a frame. A known destination can be forwarded on a learned port; an unknown unicast may be flooded within that VLAN/broadcast domain. That is different from a router consulting an IP route. If the client cannot resolve its gateway's link-layer address, it cannot even deliver the first frame; if the gateway forwards correctly but the server route is wrong, a pure Ethernet switch fix will not repair the return path."
      ]
    }
  ],
  "IP Addressing": [
    {
      "title": "A prefix and a bind address answer different questions",
      "paragraphs": [
        "192.168.50.20/26 is an IPv4 host address with a 26-bit network prefix. That network spans 192.168.50.0 through 192.168.50.63; 192.168.50.70 therefore requires a next-hop router under that prefix. The address alone, without the prefix, is insufficient to predict the host's on-link decision. This is a configuration on the interface and route table, not a promise that a router or firewall actually permits the connection.",
        "A listening service bound to 127.0.0.1:8000 receives loopback traffic on the same host; a service bound to 0.0.0.0:8000 asks the OS to listen on all local IPv4 addresses, subject to the actual socket, host firewall and routing. 0.0.0.0 is not an address that a remote client should place into its destination URL. A local curl success with a failed remote curl may arise from bind scope, not wrong DNS or a dead application."
      ]
    }
  ],
  "Subnetting": [
    {
      "title": "Work the full /26 decision and reproduce a mask mismatch",
      "paragraphs": [
        "Run the complete Python 3 standard-library program below before touching interface configuration. The client 192.168.50.70/26 belongs to 192.168.50.64/26; its on-link router is .65. Steward 192.168.50.20/26 belongs to 192.168.50.0/26; its return-path router is .1. Neither endpoint should ARP directly for the remote endpoint under correctly configured /26 networks. A router must know both connected networks and allow the traffic.",
        "Now change only the Steward prefix from /26 to /24. The *wrongly configured* server believes .70 is directly reachable and may send ARP for .70 on its local /26 Ethernet, even though the client's correct network is elsewhere. The client and server can therefore form different next-hop decisions; failure may be one-way or intermittent depending on topology and proxy ARP. The program demonstrates CIDR arithmetic and an inconsistent local belief only; it does **not** prove live routing, ACL or Ethernet packet delivery."
      ],
      "code": {
        "language": "python",
        "caption": "Execute the actual cross-subnet /26 reachability and incorrect /24 negative-control calculation",
        "code": "from ipaddress import ip_interface, ip_address\n\nserver = ip_interface(\"192.168.50.20/26\")\nclient = ip_interface(\"192.168.50.70/26\")\nserver_gw = ip_address(\"192.168.50.1\")\nclient_gw = ip_address(\"192.168.50.65\")\n\nassert server_gw in server.network\nassert client_gw in client.network\nassert client.ip not in server.network\nassert server.ip not in client.network\nprint(\"server subnet:\", server.network)\nprint(\"client subnet:\", client.network)\nprint(\"client next hop for .20:\", client_gw)\nprint(\"server next hop for .70:\", server_gw)\nwrong_server = ip_interface(\"192.168.50.20/24\")\nassert client.ip in wrong_server.network\nprint(\"incorrect /24 treats remote .70 as local:\", True)"
      }
    }
  ],
  "ARP": [
    {
      "title": "Trace route selection before resolving a neighbor MAC",
      "paragraphs": [
        "For client 192.168.50.70/26 reaching 192.168.50.20, the kernel first uses the route table to select a next-hop IP (192.168.50.65). Only then does ARP resolve the MAC address for that next hop on the local IPv4 Ethernet segment. On the other side of the router, the router resolves the server's MAC on 192.168.50.0/26. ARP broadcasts are local-link requests; they are not sent across routers as an internet-wide discovery mechanism.",
        "A new neighbor entry may move from INCOMPLETE to REACHABLE, STALE or FAILED depending on traffic and reachability checks; STALE alone is not proof of an outage. In a disposable network lab, compare `ip route get 192.168.50.20` and `ip neigh show` before/after a bounded request. When a gateway neighbor cannot be resolved, repair local link/VLAN/ARP before investigating HTTP. When the gateway resolves but no response arrives, routing, return path and policy remain distinct candidates."
      ]
    }
  ],
  "Ports and Sockets": [
    {
      "title": "Listener ownership versus remote reachability",
      "paragraphs": [
        "A socket is an OS endpoint identified by protocol plus local bind address/port and, for an established TCP connection, remote peer coordinates. The same host can run Steward on 127.0.0.1:8000 and return HTTP 200 locally while no remote client can connect. Inspect `ss -ltnp` for the exact address and owning process; a PID in the output does not prove the handler returns valid HTTP or that packets traverse external firewalls.",
        "For a bounded negative control, compare three distinct observations: port closed => TCP connect refusal (when reached and rejected); listener bound only to loopback => remote connection cannot reach that listener; listener reachable but `/bad-route` => HTTP 404 proves that TCP and HTTP request processing succeeded. Do not call the third case a routing failure. The later Network Troubleshooting lab and local loopback CI drill distinguish these outcomes without opening production ports."
      ]
    }
  ],
  "Routing": [
    {
      "title": "The reply needs a route as much as the request does",
      "paragraphs": [
        "The client sends traffic for server .20 through gateway .65. That router needs a route to 192.168.50.0/26 and the server needs a route back toward 192.168.50.64/26 through gateway .1. A valid client forward route cannot prove the server's return route is correct. A TCP handshake can fail with a silent timeout even though one interface, neighbor table and forward hop look healthy. Draw both arrows before diagnosing a missing response.",
        "Linux route selection generally prefers the most specific matching prefix (longest-prefix match), then applies other route-selection rules. `ip route get 192.168.50.70` from the server predicts the selected next hop under its local state; it does not guarantee actual router forwarding. Compare the expected route with observed interface and neighbor state, and record an explicit negative control by changing a simulated subnet or using a deliberately unreachable test destination in an isolated topology."
      ]
    }
  ],
  "DHCP": [
    {
      "title": "Work through address leasing without confusing DHCP with routing",
      "paragraphs": [
        "For a new client on an isolated 192.168.50.64/26 lab network, DHCP commonly follows Discover, Offer, Request and Acknowledge to obtain a temporary address lease. The server can also propose a subnet prefix, default gateway and DNS resolver through DHCP options. DHCP does not itself make the router forward packets and does not prove that the resolver can answer the client's names. A lease of 192.168.50.70/26 with gateway .65 is a configuration result, not an end-to-end health check.",
        "A lease renewal or reboot can change the client's address when policy and reservations differ; a service that needs a stable name should not assume today's random lease will persist. In the lab, inspect client lease/route/resolver state rather than installing a new DHCP server on a shared home LAN. A rogue DHCP service could alter addresses and default routes of unrelated users. For an independent failure case, suppose DHCP supplies a correct address but a wrong /24 prefix: the same wrong-on-link decision in the subnetting lesson appears even if DNS and the lease process both succeeded."
      ]
    }
  ],
  "DNS": [
    {
      "title": "DNS answers a name question, not a connectivity question",
      "paragraphs": [
        "Suppose `steward.lab` resolves to 192.168.50.20. The client resolver may consult a local hosts file, cache, stub service, forwarding recursive resolver or authoritative name server; these sources have different responsibilities. A correct A record gives an address but does not verify that the server listens there, the route exists or TLS trusts the server's certificate. An old cached answer can send the same hostname to a stale address after redeployment.",
        "Diagnose deliberately: resolve the name and record resolver, address and TTL/cache behavior; then request the explicit known address and port to isolate name resolution from routing and TCP. A DNS failure may be NXDOMAIN, SERVFAIL or timeout, with different meanings. Do not invent authoritative DNS availability for the disposable local CI test; that runner only proves configured localhost resolution."
      ]
    }
  ],
  "NAT": [
    {
      "title": "Follow a translated flow and explain why replies usually work but unsolicited inbound does not",
      "paragraphs": [
        "Suppose a homelab client 192.168.50.70:51900 connects through a NAT router to a public service. With source NAT, the router may substitute its public address and a translated source port while recording a short-lived flow mapping. Return packets matching that mapping can be translated back to the inside client. That observed outbound success does not imply a remote internet client can initiate a new connection to Steward: inbound access requires an explicit destination-translation/forwarding policy or a reverse proxy/VPN design, plus allowed routes, firewall policy and a listening service.",
        "NAT is address/port translation, not proof of encryption or identity. Do not equate RFC1918 private address space with a security boundary that replaces host authorization. A failure matrix should distinguish an absent NAT mapping, an incorrect destination port forward, a blocked firewall rule and a server bound only to loopback; all can look like inbound timeouts, but their repairs occur at different boundaries. Later WireGuard/VPN work is a more appropriate place for private administration than blindly forwarding SSH from the public internet."
      ]
    }
  ],
  "Firewalls": [
    {
      "title": "Stateful policy depends on the flow, zone and direction",
      "paragraphs": [
        "A firewall answers whether a specific traffic flow is permitted, not whether the application has a correct handler. A host may have a healthy TCP listener on 192.168.50.20:8000 while a firewalld zone blocks connections from client 192.168.50.70; a route can be correct while the filter denies it. Stateful filtering may permit packets associated with an established connection while rejecting unrelated inbound new connections. Source zone, destination address/port, direction and connection state determine the effective outcome.",
        "A robust learner exercise predicts three cases before any rule change: Steward bound only to 127.0.0.1 (not reachable remotely even if 8000/tcp is allowed), Steward bound to LAN but blocked by host policy, and Steward bound plus narrowly permitted client. Inspect the actual zone/interface assignment and current runtime-versus-permanent rules before changing firewalld. Preserve console access and a rollback, then test from a genuinely separate client. No single-machine CI loopback result proves a real firewall denial across a LAN."
      ]
    }
  ],
  "HTTP and TLS from the Network Perspective": [
    {
      "title": "A TCP connection is necessary for HTTPS but not sufficient",
      "paragraphs": [
        "After DNS resolves steward.lab and IP routing reaches 192.168.50.20:443, the TCP three-way handshake can succeed while TLS still fails. TLS compares server identity and trust to the requested hostname, negotiates cryptographic settings and establishes protected records; a wrong certificate name, expired certificate or untrusted issuer is not a missing route. Only after TLS setup can an HTTPS request be processed. An HTTP 404 or 500 is evidence that the server returned an application-level response, not that ARP, DNS or TCP are currently broken.",
        "For a bounded diagnosis, record five checkpoints separately: resolved address, chosen next hop, TCP connection result, TLS certificate/hostname result, and HTTP response code. Testing https://192.168.50.20 while the certificate is valid only for steward.lab can fail hostname verification even though https://steward.lab is correct. Avoid making TLS pass by disabling certificate verification; that hides an authentication failure rather than repairing it. A self-signed local certificate can be trusted through an explicit lab CA, but the production enterprise trust chain remains outside this lesson."
      ]
    }
  ],
  "Network Troubleshooting Tools": [
    {
      "title": "One failure tree, each observation rules out only one layer",
      "paragraphs": [
        "For `https://steward.lab` served at 192.168.50.20 behind the two /26 networks, start with five hypotheses: wrong DNS record; wrong route/return route; unresolved gateway neighbor; refused TCP listener or host ACL; invalid TLS certificate or HTTP application path. Capture a prediction for each before running commands. Name lookup only rules on DNS, route lookup only predicts local next-hop selection, `ss` observes server sockets and `curl` observes the complete client-side result. No one observation establishes every downstream condition.",
        "An engineer should be able to explain **why** the next test follows. If the name fails but connecting to the known IP works, investigate resolver/cache state. If the name resolves but TCP refuses, inspect listener binding. If TCP succeeds and TLS fails, inspect hostname, certificate chain and trust rather than adding a firewall port. If HTTP returns 404, the application handled the request but no matching route was found. Record a normal request, a single injected failure, the evidence that localized it and a verified recovery on an isolated lab."
      ]
    }
  ]
};
export const platformNetworkingTraceResources: LearningResource[] = [
  {
    "title": "Python ipaddress module — IPv4Interface and network membership",
    "url": "https://docs.python.org/3/library/ipaddress.html"
  },
  {
    "title": "RFC 4632 — CIDR address aggregation and prefixes",
    "url": "https://www.rfc-editor.org/rfc/rfc4632"
  },
  {
    "title": "RFC 826 — Ethernet ARP",
    "url": "https://www.rfc-editor.org/rfc/rfc826"
  },
  {
    "title": "RFC 1812 — Router requirements",
    "url": "https://www.rfc-editor.org/rfc/rfc1812"
  }
];
