# PED-005 — Platform Builder learner-order read-through, module 3 Networking Foundations

**Date:** 2026-11-02  
**School:** Platform Builder, issue [#323](https://github.com/enoqueJonas/tsa/issues/323), draft [PR #335](https://github.com/enoqueJonas/tsa/pull/335).  
**Status:** Networking source-level TARGETED REMEDIATION COMMITTED; matching-head full CI and uncoached learner validation distinct. Not full Platform Builder school completion.

## Exact teaching source and learner order

Entry: `platform-builder-networking-deep.ts` builds 14 core lessons; `platform-builder-networking-quality.ts` replaces exercises with tested evidence requirements and introduces the separate WireGuard management-plane lesson before the final broken-path lab. `platform-builder-networking-running-case.ts` contributes **13 specific worked lesson sections**, not a generated preface or an extra broad chapter. The existing TCP/UDP lesson already teaches connection state, flow/congestion control and UDP and therefore was deliberately not inflated.

| # | Real learner-facing lesson | Source disposition | Concrete mechanism or open limitation |
| --- | --- | --- | --- |
| 3.1 | Networking Mental Models: OSI and TCP/IP | **TARGETED REMEDIATION** | Request layer and encapsulation trace; IP destination versus changing link MAC and TCP/TLS/HTTP consequences |
| 3.2 | Ethernet and Switching | **TARGETED REMEDIATION** | Switch source-MAC learning and client-to-gateway frame when remote server on a second subnet |
| 3.3 | IP Addressing | **TARGETED REMEDIATION** | CIDR address plus prefix and 127.0.0.1 versus 0.0.0.0 listener interpretation |
| 3.4 | Subnetting | **TARGETED REMEDIATION + RUNNABLE NEGATIVE** | Exact Python stdlib .20/26 versus .70/26 with legal local gateways; wrong /24 creates contradictory local-link belief, plus independent /27-or-/28 transfer |
| 3.5 | ARP | **TARGETED REMEDIATION** | Next-hop selected by IP route before local IPv4 neighbor resolution; a STALE neighbor is not proof of outage |
| 3.6 | TCP and UDP | **RICH — retained** | Existing TCP handshake/flow-control/congestion-control/UDP boundary explanation and practical; no duplicative bridge required |
| 3.7 | Ports and Sockets | **TARGETED REMEDIATION** | TCP listener vs firewall vs 404; loopback, LAN bind, rejected socket and remote reachability separated |
| 3.8 | Routing | **TARGETED REMEDIATION** | Bidirectional route/return route, longest-prefix selection, wrong-server-mask asymmetry |
| 3.9 | DHCP | **TARGETED REMEDIATION** | Discover/Offer/Request/Ack lease plus default gateway/DNS options, wrong mask and rogue DHCP safety |
| 3.10 | DNS | **TARGETED REMEDIATION** | Name authority/cache/resolver chain; NXDOMAIN vs SERVFAIL vs timeout, DNS resolution ≠ working service |
| 3.11 | NAT | **TARGETED REMEDIATION** | Stateful outbound source translation vs explicit inbound destination translation and management-plane exposure |
| 3.12 | Firewalls | **TARGETED REMEDIATION** | Listener, route and stateful zone/source rule distinction with allowed/denied clients and remote-lockout risk |
| 3.13 | HTTP and TLS from the Network Perspective | **TARGETED REMEDIATION** | TCP success vs TLS hostname/trust failure vs HTTP 404/500, no insecure verification bypass |
| 3.14 | Network Troubleshooting Tools | **TARGETED REMEDIATION** | Hypothesis-led failure tree with five distinct boundaries, last known-good vs first bad evidence |
| 3.15 | WireGuard and Private Management Access | **SOURCE PRESENT — RUNTIME UNVERIFIED** | Dedicated VPN lab in quality source, positive/negative management-path assertions; real handshakes/rules not executed on live test network |
| 3.16 | Lab: Diagnose a Broken Service Path | **SOURCE PRESENT — RUNTIME PARTIAL** | Integrated failure and recovery practice; CI proves isolated TCP/UDP/localhost, not a real router/host firewall/remote DNS |

## Worked network: a complete forward and return explanation

- Steward service interface `192.168.50.20/26` belongs to `192.168.50.0/26`, with on-link router `.1`.
- Client `192.168.50.70/26` belongs to `192.168.50.64/26`, with on-link router `.65`.
- The client sends its initial frame to **the gateway's MAC**, keeping **Steward's IP destination** `.20`; the router forwards on the server-side link and constructs a new link frame.
- The server must route its reply back to the client's network. A wrong `/24` mask on the server makes it believe `.70` is local and try ARP instead of using router `.1`; this is an asymmetric belief, **not** proof of a particular deployed router defect.
- An untrusted DNS reply, closed TCP listener, firewall refusal, invalid TLS server identity and HTTP 404 have different responsible boundaries, and the learner must not fix them with the same blind "network" change.

**Published executable**: Python 3 `ipaddress.ip_interface` demonstrates correct /26 networks, gateway membership and the mistaken /24 local belief with fixed assertions and observable stdout. Script `scripts/check-platform-builder-network-case.mjs` extracts the **actual rendered source literal** and executes the program, while the practice asks for an **independent new /27 or /28 problem**. Existing CI `scripts/check-platform-network-foundations.py` executes local TCP, UDP and resolver behavior on an Ubuntu runner, which **does not prove** a two-subnet routed topology or a functioning Rocky/WireGuard/Packet Tracer environment.

## Truthful confidence and remaining work

This pass fixes missing conceptual continuity in the 14 original lessons without changing their activity IDs. It does **not** prove that a novice can independently troubleshoot a live routed network. WireGuard handshakes, real firewall zones, authenticated DNS/TLS, Packet Tracer multi-device forwarding and a physically separate negative client need an isolated environment and independent assessment. Mark them **UNVERIFIED**, not PASSED, until evidence exists.

**Next module in the same school:** module 4 Cisco Packet Tracer, followed by virtualization/bare metal/homelab and remaining Platform Builder modules. Do not restart System Thinker or skip this school's modules.
