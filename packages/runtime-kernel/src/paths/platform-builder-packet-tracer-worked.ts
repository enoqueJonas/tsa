import type {LearningResource} from "../activities/content";
// PED-005 Packet Tracer: teach protocols and device observation before demanding a lab.
// Cisco IOS snippets are illustrative; not evidence of Packet Tracer or hardware execution.
export const packetTracerWorkedTeaching: Record<string, Array<{title:string;paragraphs:string[];code?:{language:string;caption:string;code:string}}>> = {
  "IPv4 Subnetting and VLSM": [
    {
      "title": "How VLSM turns host counts into non-overlapping forwarding boundaries",
      "paragraphs": [
        "Start with 192.168.80.0/24 and four real needs: users 60 hosts, servers 28, management 12 and a point-to-point transit 2. A conventional IPv4 subnet reserves the network and broadcast address; a /26 yields 62 usable, a /27 yields 30, a /28 yields 14 and a /30 yields 2. Assign largest first so a small early allocation does not fragment the remaining space. Put users in 192.168.80.0/26, servers in .64/27, management in .96/28 and transit in .112/30. The network and gateway are not interchangeable: choose usable gateway addresses within each prefix, then record the next-hop on both ends.",
        "Run the published Python calculation below. The code confirms all four subnets lie inside the /24, do not overlap and fit their requested hosts. The negative control deliberately proposes /27 for 60 users and rejects it (30 usable); that is a sizing error even if a configuration interface accepts /27. A positive arithmetic result does not prove router interfaces, routing tables or Packet Tracer switch ports are configured. Save an addressing table first, then use IOS `show ip interface brief` and route observations in your isolated .pkt lab."
      ],
      "code": {
        "language": "python",
        "caption": "VLSM planning: 60/28/12/2 hosts, disjoint prefixes, rejected under-sized /27",
        "code": "from ipaddress import ip_network, ip_address\nrequests = [(\"users\", 60), (\"servers\", 28), (\"management\", 12), (\"transit\", 2)]\nsubnets = list(ip_network(\"192.168.80.0/24\").subnets(new_prefix=26))\n# Allocate largest first, then subdivide the unused /26 for smaller demands.\nusers = subnets[0]\nremaining = list(subnets[1].subnets(new_prefix=27))\nservers = remaining[0]\nsmall = list(remaining[1].subnets(new_prefix=28))\nmanagement = small[0]\ntransit = list(small[1].subnets(new_prefix=30))[0]\nallocated = [users, servers, management, transit]\nfor (label, hosts), network in zip(requests, allocated):\n    assert network.num_addresses - 2 >= hosts\n    assert network.subnet_of(ip_network(\"192.168.80.0/24\"))\n    print(f\"{label}: {network} usable={network.num_addresses - 2}\")\nfor i, network in enumerate(allocated):\n    for other in allocated[i + 1:]:\n        assert not network.overlaps(other)\nbad = ip_network(\"192.168.80.0/27\")\nassert bad.num_addresses - 2 < requests[0][1]\nprint(\"wrong /27 for 60 users: rejected\")\nassert ip_address(\"192.168.80.129\") in servers\nprint(\"server gateway .129 is on-link:\", True)"
      }
    },
    {
      "title": "Subnet mask mismatch can create asymmetric forwarding",
      "paragraphs": [
        "When a server on 192.168.80.130/27 talks to a client outside 192.168.80.128/27, its default gateway should forward packets. If its mask is mistakenly /24, the server may believe the remote client is local and ARP for an address that is not on its link, producing a one-way-looking failure. Use Packet Tracer's source/next-hop simulation and compare host address/mask/gateway, connected route and neighbor state; do not change every subnet just because one ping fails.",
        "Checkpoint: invent a different set of host requirements, allocate from a fresh /24 without overlaps, then explain why the largest-first plan matters and deliberately under-size one subnet. The code here proves arithmetic only. Whether the simulator supports each IOS command or the physical route is up remains UNVERIFIED until device logs and client tests exist."
      ]
    }
  ],
  "Inter-VLAN Routing and Default Gateways": [
    {
      "title": "Follow one VLAN 10 to VLAN 20 packet through router-on-a-stick",
      "paragraphs": [
        "A host in VLAN 10 (192.168.80.10/26) needs 192.168.80.1 as its default gateway to reach a server in VLAN 20 (192.168.80.70/27). The host sends an Ethernet frame toward the router's VLAN-10 MAC, retaining the server's destination IP. A switch access port accepts untagged frames for its assigned VLAN; a configured trunk carries VLAN identity to the router. A router subinterface for VLAN 10 receives the frame, performs an IP route lookup and forwards over VLAN-20 encapsulation with a new link-layer destination. VLAN tags do not turn switching into routing.",
        "Compare two legitimate implementations: router-on-a-stick with 802.1Q subinterfaces shares one physical router uplink and is easy to visualize, while a multilayer switch uses switched virtual interfaces (SVIs) and can route locally with different port/performance characteristics. In both cases each endpoint still needs a correct IP prefix and default gateway. A green physical link proves neither VLAN tagging nor gateway correctness."
      ],
      "code": {
        "language": "text",
        "caption": "Topology-dependent IOS illustration; interface names/features differ by Packet Tracer device",
        "code": "interface GigabitEthernet0/0.10\n encapsulation dot1Q 10\n ip address 192.168.80.1 255.255.255.192\ninterface GigabitEthernet0/0.20\n encapsulation dot1Q 20\n ip address 192.168.80.65 255.255.255.224\n! Parent interface must be enabled; the switch uplink must be trunk.\n! Inspect: show interfaces trunk (switch); show ip interface brief (router)\n! Test clients within VLAN, then across VLAN, then break one gateway deliberately."
      }
    },
    {
      "title": "Diagnose gateway mismatch before blaming a trunk",
      "paragraphs": [
        "If same-VLAN connectivity works but inter-VLAN traffic fails, check endpoint gateway and prefix, VLAN trunk allowance, router subinterfaces/SVI up-state, and return route in that order. A wrong default gateway may prevent the host from sending off-link; a missing VLAN tag may prevent the gateway from receiving the packet; a working router route with an outbound ACL denial is a separate cause. Capture one deliberately wrong gateway negative case and prove recovery after restoring the expected gateway.",
        "Do not accept a packet-animation screenshot as sufficient evidence. Record the client address/prefix/gateway, `show vlan brief`, `show interfaces trunk` and Layer-3 interface status; explain which observation discriminates incorrect endpoint configuration, VLAN membership, missing route or policy. Packet Tracer itself is an exercise environment, not a real enterprise router certification."
      ]
    }
  ],
  "DHCP, Relay and NAT/PAT": [
    {
      "title": "A DHCP relay connects broadcast discovery to an explicitly routed server",
      "paragraphs": [
        "An unconfigured client initially lacks a usable local IPv4 address. DHCP discovery normally starts as a local broadcast; routers do not routinely flood such broadcasts into other VLANs. On a client-facing routed interface, a configured relay (for example Cisco `ip helper-address` for the designated DHCP server) forwards the request toward a server that maintains the proper subnet scope. The lease response should provide an address, correct prefix, gateway and DNS resolver. A DHCP ACK alone does not prove the router reaches Steward or that the DNS server can resolve the service name.",
        "Worked failure: put the DHCP server in VLAN 20 and a client in VLAN 10. Without a correct helper target or a route to the server, a VLAN-10 client may fail to acquire a lease even while a VLAN-20 client succeeds. Before changing NAT, inspect the client lease, helper on the correct routed ingress interface, server scope, routes and return path. Use a controlled Packet Tracer network only; never attach a competing DHCP server to an unmanaged home/company LAN."
      ]
    },
    {
      "title": "PAT rewrites a transport mapping, not the application's identity",
      "paragraphs": [
        "Assume branch client 192.168.80.10:51000 talks to 203.0.113.80:443 through an edge router. PAT may rewrite the packet source to the edge's outside IP with another available source port, storing a translation mapping to restore the matching reply. It does not automatically permit unsolicited inbound connections; that requires an explicit separate destination-translation/filtering design. A failed outbound request might be caused by internal routing, absent NAT inside/outside classification, a missing matching access policy, or an unreachable remote host.",
        "Test in stages: first prove client-to-edge gateway connectivity and route; then prove a non-translated internal packet; finally observe `show ip nat translations` or supported equivalent while generating outbound traffic. A missing translation entry cannot by itself say whether the NAT rule or the input route was wrong; inspect which precondition was satisfied. Avoid using the real internet or unknown addresses in Packet Tracer as though external DNS/TLS were independently verified."
      ],
      "code": {
        "language": "text",
        "caption": "Expected PAT trace, illustrative addresses and ports; exact mappings depend on router config",
        "code": "Before edge PAT: 192.168.80.10:51000 -> 203.0.113.80:443\nAfter edge PAT:  198.51.100.10:40001 -> 203.0.113.80:443\nReturn packet:   203.0.113.80:443 -> 198.51.100.10:40001\nRestored inside: 203.0.113.80:443 -> 192.168.80.10:51000"
      }
    }
  ],
  "IPv6 Addressing and Routing Fundamentals": [
    {
      "title": "IPv6 has link-local and global scope, but no Ethernet ARP",
      "paragraphs": [
        "IPv6 hosts ordinarily have a link-local address in fe80::/10 used for on-link neighbor and router discovery, and may have a global unicast address for wider reachability. Unlike IPv4 ARP, IPv6 Neighbor Discovery uses ICMPv6 messages to resolve a link neighbor and discover routers. A default router is commonly learned through Router Advertisements, but the lab must check what the selected Packet Tracer device actually supports. Do not assign an IPv4 gateway concept to an IPv6 address without explaining link-local next-hop scope and the interface it belongs to.",
        "Example: VLAN 10 uses 2001:db8:10::/64 and VLAN 20 uses 2001:db8:20::/64 (documentation-only prefixes). A client on VLAN 10 can reach another VLAN-10 address without routing, but reaching VLAN 20 requires a router with IPv6 forwarding and both prefixes/routes known. `show ipv6 interface brief`, `show ipv6 route` and `show ipv6 neighbors` (where supported) test distinct interface, route and neighbor questions. Do not infer an IPv6 route from successful IPv4 pings."
      ]
    },
    {
      "title": "A dual-stack failure can affect only one protocol",
      "paragraphs": [
        "After proving IPv4 still works, deliberately break only the VLAN-20 IPv6 prefix, route or router-advertisement configuration in a disposable .pkt file. The same service may remain reachable over IPv4 yet fail over IPv6; a browser attempting both protocols can make the symptom appear intermittent. Record which address family the client chose before modifying ACLs or resetting the switch.",
        "Check a same-link IPv6 ping, a routed IPv6 ping, the router's IPv6 next hop and a separate negative destination. Restoration is not demonstrated until both families are tested independently. The module does not claim Packet Tracer's IPv6 simulator reproduces every real Neighbor Discovery, SLAAC, privacy address or firewall behavior."
      ]
    }
  ],
  "Capstone: Enterprise Branch Network": [
    {
      "title": "Work one end-to-end acceptance matrix before integrating features",
      "paragraphs": [
        "Your branch design includes user VLAN, Steward server VLAN, management VLAN, upstream/edge and remote secondary site. Start with explicit policies: user HTTPS to Steward allowed; user management SSH denied; administrator management SSH via intended route allowed; server outbound DNS/NTP allowed where required; unintended inbound public access denied. For each row record client source, destination, address family, port, expected result and the device/interface enforcing it. Missing rules should be marked unanswered rather than silently treated as allow.",
        "Trace one user-to-Steward HTTPS flow from access VLAN and gateway, switch trunk, inter-VLAN routing, optional firewall ACL, listening server, and response route. Record evidence from both endpoints and the relevant router/switch counters. A successful request plus a denied management connection shows two different requirements; neither can be inferred from green interface LEDs or a saved .pkt file."
      ]
    },
    {
      "title": "Fault-card acceptance and simulator handoff are distinct evidence lanes",
      "paragraphs": [
        "Inject five faults one at a time into a disposable saved copy: wrong access VLAN, missing trunk allowance, stale endpoint gateway, OSPF neighbor/advertisement mismatch and ACL applied in wrong direction. Before each injection write a predicted first failing boundary; then collect show-command and client output and recover to the last known-good checkpoint. Do not mix five simultaneous changes; that makes causality untestable and encourages reset-by-guessing.",
        "The final evidence should distinguish 'tested in Packet Tracer', 'tested on actual Proxmox/Rocky/hardware' and 'not tested'. Simulated STP convergence, DHCP relay and IOS ACL behavior do not certify physical switch syntax, production firewall persistence, Wi-Fi isolation or vendor interoperability. Transfer decisions belong in the later homelab modules, where hardware availability and safe management recovery are explicit."
      ]
    }
  ]
};
export const packetTracerWorkedResources:LearningResource[] = [
  {
    "title": "Cisco Packet Tracer (version-dependent CLI and device features)",
    "url": "https://www.netacad.com/cisco-packet-tracer"
  },
  {
    "title": "Python ipaddress — deterministic IPv4/VLSM calculations",
    "url": "https://docs.python.org/3/library/ipaddress.html"
  },
  {
    "title": "RFC 4632 — CIDR address allocation",
    "url": "https://www.rfc-editor.org/rfc/rfc4632"
  },
  {
    "title": "RFC 4291 — IPv6 addressing architecture",
    "url": "https://www.rfc-editor.org/rfc/rfc4291"
  }
];
