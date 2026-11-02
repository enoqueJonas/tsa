// PED-005: specific worked homelab mechanisms attached to existing lessons, not an orientation wrapper.
export const budgetHomelabWorkedSections:Record<string,Array<{heading:string;body:string;list?:string[];code?:{language:string;code:string}}>> = {
  "Designing a Learning Homelab": [
    {
      "heading": "Start from one recoverable Steward request",
      "body": "The first capability is not a rack photograph: it is a test request from an administrator workstation to a Rocky Linux Steward VM, plus enough logging, addressing and storage to reproduce a failure. Draw the physical host, hypervisor if any, guest virtual NIC, switch/router, the client, application listener and persistence. Give each boundary a named owner. An application 200 result proves this request path only; it says nothing about backup recovery or whether the management interface is exposed to unrelated clients."
    },
    {
      "heading": "A small homelab is an intentionally single-failure-domain system",
      "body": "One Proxmox host can run several isolated VMs without providing physical high availability. If host power or its only disk fails, all those guests disappear together. Compare a disposable VM snapshot for local experiment rollback, an independent backup on separate hardware/media for host loss, and a second host only when capacity or availability evidence justifies the added expense. The simplest credible starting plan marks physical host, router and storage as shared failure points and records a reachable local-console recovery path."
    }
  ],
  "Choosing Budget Hardware": [
    {
      "heading": "Calculate total cost of ownership before comparing brands",
      "body": "A used mini PC and a repurposed workstation can differ in RAM ceiling, idle draw, spare NIC/drive bays, replaceable parts and firmware virtualization support. Compare purchase price plus expected annual power: watts × 24 × 365 ÷ 1000 gives kWh/year; multiply by the learner's actual tariff without inventing a Mozambique retail price. A 20 W idle difference is about 175.2 kWh/year. Test a candidate with actual usable RAM, virtualization flags, fan/noise placement, storage SMART condition and a power measurement where available."
    },
    {
      "heading": "Choose failure containment, not the cheapest headline price",
      "body": "A cheap device with soldered low RAM, dying SSD and no recovery media can cost more in lost learning time than a slightly larger used machine. Distinguish recoverable experiment failures from loss of personal files or management access. An alternative to immediate purchase is a disposable VM on the existing workstation, but that shares power and disk with the workstation and should not be described as independent infrastructure. The correct procurement decision states the minimum workload, excluded services and next measured upgrade trigger."
    }
  ],
  "CPU, RAM, Storage and NIC Trade-offs": [
    {
      "heading": "Compute a conservative capacity envelope, then reject a seductive overcommit",
      "body": "Use real host total RAM, keep an explicit host/hypervisor reserve, then budget VM memory separately from application residency and filesystem cache. The Python calculation below is a deliberately simple *reservation model*: 16 GiB physical, 4 GiB reserved, and VM envelopes of 4+2+4 GiB leave 2 GiB uncommitted. A proposed extra 4 GiB VM fails the planning invariant even if the hypervisor technically permits overcommit. Overcommit can be appropriate with measured low simultaneous use, but it is not free memory and it creates a shared pressure failure domain.",
      "code": {
        "language": "python",
        "code": "# Disposable planning calculation; GiB are estimates, not real host measurements.\nhost_gib = 16\nreserved_host_gib = 4\nservices = {\"steward\": 4, \"database\": 2, \"tools\": 4}\ncommitted = reserved_host_gib + sum(services.values())\nassert committed == 14\nassert committed <= host_gib\nprint(\"host total: 16 GiB\")\nprint(\"reserved OS/host: 4 GiB\")\nprint(\"VM budgets: 10 GiB\")\nprint(\"unallocated headroom: 2 GiB\")\nplanned_extra_vm = 4\nassert committed + planned_extra_vm > host_gib\nprint(\"proposed extra 4 GiB VM: exceeds 16 GiB host budget\")\nprint(\"single physical host independent failure domains: 1\")"
      }
    },
    {
      "heading": "CPU, storage latency and network bandwidth need their own evidence",
      "body": "A VM allocated four vCPUs may still wait for physical CPU schedules; a PostgreSQL write can stall on storage latency even when disk capacity is high; a gigabit NIC label does not establish end-to-end application throughput. Compare nproc/lscpu, memory available and swap activity, iostat/latency where installed, and actual per-interface counters under the same service request. State one falsification threshold, such as sustained swap-in or high I/O wait under normal traffic, before buying more hardware. The model is not evidence of a real host's consumption."
    }
  ],
  "Power, Noise and Reliability": [
    {
      "heading": "Power and environment are operational dependencies",
      "body": "The homelab host, router, switch and NAS may all share one socket or UPS and may experience the same outage. A claimed uptime target must include those dependencies, cooling and safe shutdown, not only the Proxmox VM status. Estimate load and available UPS runtime from actual device measurements or vendor specifications. Never simulate power failure by unplugging a machine holding non-disposable data; use a scripted guest shutdown or a controlled disposable workload and record whether the filesystem and service start cleanly."
    },
    {
      "heading": "Recovery evidence is different from a successful reboot",
      "body": "An OS returning to a login screen does not prove Steward restarted or PostgreSQL retained consistent data. Capture a known-good transaction marker, simulate a bounded guest/process outage, then verify the marker, listener, application response and management access after recovery. Compare a controlled shutdown (flushable writes) with sudden host loss (possibly incomplete writes) without assuming both are safe. Identify which failure cannot be tested on the available equipment and label it UNVERIFIED."
    }
  ],
  "Ethernet Switches and Cabling": [
    {
      "heading": "Follow one frame rather than using 'network cable' as a diagnosis",
      "body": "A client can have a link light while the switch access port is in the wrong VLAN, the default gateway is unavailable or the server listens on loopback. Ethernet frames use local MAC delivery; the switch learns source MAC-to-port membership and forwards within a broadcast domain. Before buying managed switches, decide whether the current exercise actually needs 802.1Q tags, managed VLANs or two separate physical segments. Unmanaged switching is adequate for a simple one-LAN case but cannot teach VLAN tagging/port isolation through configuration evidence."
    },
    {
      "heading": "Observe physical and logical failure separately",
      "body": "Use interface state, negotiated speed/duplex where available, error/drop counters and known-good patch cable evidence before blaming routing. A damaged cable or mismatched negotiated link can cause loss even when DNS records are correct. In a disposable topology, deliberately disconnect one non-critical guest path and compare the interface result with an ACL-denied TCP connection: the symptoms may both look like failure, but the first changes local link evidence and the second does not."
    }
  ],
  "Designing the Home Network Topology": [
    {
      "heading": "Trace the management plane and the data plane separately",
      "body": "An administrator connecting to the hypervisor UI can change or delete VMs, while a client calling Steward uses an application endpoint. These are different trust boundaries even if both share one physical switch. Map client IP/prefix, route, virtual bridge, host firewall, guest interface, DNS and listening socket. Place management access behind a private LAN or appropriate VPN boundary rather than automatically port-forwarding Proxmox/SSH. Demonstrate from a second device which resources are intentionally unreachable."
    },
    {
      "heading": "A network diagram must predict the first failing hop",
      "body": "A good topology records interfaces, VLANs if used, gateway addresses, services, next hops and actual name authorities. Scenario: local curl returns 200 but another LAN client times out. Test local listening address, guest route, bridge uplink and firewall instead of reconfiguring DNS without evidence. Scenario: the service hostname resolves to an old address but the explicit IP works; DNS/cache is implicated. Use a single controlled change and rollback, then repeat the end-to-end application request."
    }
  ],
  "Static Addressing": [
    {
      "heading": "Choose reservations and fixed addresses by bootstrap ownership",
      "body": "A server needs a predictable address for DNS/firewall/management, but this can be a host-managed static IP or DHCP reservation. A reservation depends on the DHCP service being available for a new lease; a manual address depends on correct prefix, gateway and resolver configuration. Infrastructure used to restore DHCP/DNS must not have an undocumented circular dependency on those very services. Draw which device can boot and be administered when DHCP or internal DNS is down."
    },
    {
      "heading": "Do not accidentally assign a DHCP pool address",
      "body": "Before choosing a fixed address, inventory DHCP scope, reservations and current leases. A duplicate IPv4 address may create intermittent ARP neighbor changes that look like random reachability failures. In an isolated network, record the host prefix and gateway, verify its chosen route with ip route get, and check ip neigh after bounded traffic. Use the actual lab LAN plan rather than copying demonstration addresses into a real office subnet."
    }
  ],
  "Multiple Hosts and VMs": [
    {
      "heading": "Logical guests are not independent physical availability",
      "body": "Two Rocky VMs on one Proxmox host have separate OS processes and disks at the guest layer but depend on the same hypervisor, power, storage controller and uplink. This means one guest restart can be isolated while a host reboot affects both. Show a failure-domain matrix for VM process, guest OS, hypervisor, underlying physical storage and shared router. Different VMs do not automatically imply independent failover of PostgreSQL or a load-balanced Steward service."
    },
    {
      "heading": "Measure the cost of another boundary before creating it",
      "body": "One combined VM reduces operational overhead but couples the application and database lifecycle. Splitting into separate VMs makes resource limits, backups and failure scope clearer but increases IP/DNS/patch/recovery work. Begin with a bounded application + PostgreSQL arrangement and create a new guest only when a learning outcome needs an independent lifecycle, a security boundary or measured capacity. Preserve dependency/restore order rather than counting VM icons as architecture maturity."
    }
  ],
  "Remote Administration": [
    {
      "heading": "Remote access is an authority boundary, not just a shortcut",
      "body": "SSH authenticates an operator to a specific server using a key and server host-key trust; that is different from the service account's local file permissions and from a VPN's routing/access policy. Record the authorized source networks, service account, SSH public/private-key placement and out-of-band/local-console recovery. An attacker with access to the management network still must pass SSH authentication; SSH success does not mean the operator should receive unrestricted sudo privileges."
    },
    {
      "heading": "Prove new access before disabling the old path",
      "body": "During hardening, keep a currently working management session and console access while testing key-based login from a second session. Confirm the server identity/host key, permitted principal and least-privilege actions. A VPN or private interface is preferable to exposing SSH from the public internet, but a successful WireGuard handshake alone does not prove the SSH daemon listens on the private address or that firewalld permits the flow. A lab lacking a second client should mark isolation UNVERIFIED, not silently pass."
    }
  ],
  "Local Firewalling": [
    {
      "heading": "A listening socket and an allowed incoming flow are distinct",
      "body": "When Steward binds to 127.0.0.1:8000, it accepts local loopback traffic but cannot be reached through the server's LAN IP regardless of a broad firewall exception. When it binds to the correct guest IP, a firewalld zone or upstream ACL may still deny the packet. Compare ss -ltnp, active zone assignments, routes and an application curl from the correct client source. Do not treat a ping as proof that TCP/HTTP traffic is permitted."
    },
    {
      "heading": "Runtime experimentation needs a recovery path",
      "body": "Before changing a remote host firewall, record the current zone/rules and keep console access. A runtime-only narrow rule can be tested and later made permanent once safe; changing interface zone binding can lock out administration. Demonstrate one positive allowed client and one denied client without opening SSH, databases or hypervisor management publicly. An Ubuntu CI loopback socket test is not evidence of real Rocky firewalld enforcement."
    }
  ],
  "Local DNS Concepts": [
    {
      "heading": "Name resolution has authority, cache and connectivity stages",
      "body": "A client asking for steward.lab may check a local hosts entry, a stub resolver/cache, a recursive resolver and authoritative records. The DNS response yields an address and TTL; that does not prove the service is reachable on that IP, TLS trusts the name or HTTP returns 200. Diagnose NXDOMAIN (negative name result), SERVFAIL (server could not complete resolution) and a query timeout as distinct failure classes. Trace name → address → route → TCP → application rather than simply flushing every cache."
    },
    {
      "heading": "Use a stable name without hiding the bootstrap path",
      "body": "If internal DNS runs as a VM that itself needs DHCP and the Proxmox management network depends on its name, recovery can become circular after a reboot. Keep enough stable addressing to administer the host and restore DNS independently; use records for services where name portability actually helps. When a service moves IPs, test current authoritative data and client cache behavior before declaring an outage solved."
    }
  ],
  "Reverse Proxies": [
    {
      "heading": "The reverse proxy adds a second HTTP failure boundary",
      "body": "With NGINX in front of Steward, the client connects to proxy address/port, then NGINX initiates an upstream request to the Django/Gunicorn listener. A client HTTP 502 can mean the proxy is healthy but the upstream socket is refused or the upstream response is invalid; an HTTP 404 may come from the proxy route or from Steward itself. Trace server_name/listen, upstream proxy_pass, Host and forwarded headers, local upstream curl and remote client curl separately. Never infer backend health solely from the proxy process being active."
    },
    {
      "heading": "Terminate and forward TLS deliberately",
      "body": "The proxy may terminate TLS and forward HTTP on a controlled private interface, or pass encrypted traffic through according to the design. In the first model the client trusts the proxy's certificate for steward.lab; a backend that accepts untrusted forwarded headers from arbitrary clients may misclassify original scheme, IP or host. Configure only intended trusted proxies and preserve private backend reachability rather than exposing both NGINX and Gunicorn publicly. Compare an NGINX reload after syntax validation with a backend restart; they change different failure domains."
    }
  ],
  "Storage and Backups": [
    {
      "heading": "Distinguish a backup job from an independent recovery point",
      "body": "A snapshot captures a VM/disk state convenient for local rollback but may share the host datastore and fail when that storage is destroyed. An independent backup must copy needed data to a separately recoverable location with a known retention/restore procedure. PostgreSQL live files are not necessarily a consistent application-level backup if copied without database-aware capture; identify the required database backup and any attached files/configuration/secrets before deciding the method."
    },
    {
      "heading": "Restore a disposable identity and prove the application result",
      "body": "Create a known test record and a checksum for relevant small fixture files, take a supported backup, then restore into a **new disposable target** rather than overwriting the running service. Verify database consistency, record availability and the client-to-Steward request. An empty destination with green backup status is not enough; failure tests should include backup target unavailable, insufficient capacity or omitted config, with safe stop conditions and a declared acceptable recovery point. Never use an untested backup as proof of production recoverability."
    }
  ],
  "Safe Exposure and Isolation": [
    {
      "heading": "Separate client, management and private backend roles",
      "body": "The client needs an authorized HTTP entry point, not direct access to PostgreSQL, Redis, RabbitMQ or Proxmox management. Establish a flow matrix by source network, destination service/port, business purpose and identity requirement. Restrict administration via a private route/VPN and service credentials; VPN routing is not a replacement for application authentication. Trace how exposing a general firewall port to the internet expands attack surface beyond the original demo."
    },
    {
      "heading": "Prove intended denial without creating a risky public service",
      "body": "For a disposable LAN, test one allowed Steward HTTP flow from the client and one denied backend/management connection from a non-authorized source. Confirm allowed reachability does not accidentally include SSH or database ports. If a second isolated source device is unavailable, document that negative network enforcement was **not observed**, rather than describing a successful local curl as a firewall security test. Preserve a trusted management channel before each policy change."
    }
  ],
  "VLAN Concepts": [
    {
      "heading": "VLAN membership changes link broadcast domains, not IPv4 routing on its own",
      "body": "An access port places ordinary untagged endpoint frames into a configured VLAN, while an 802.1Q trunk conveys multiple VLAN identities between cooperating switches/routers. A switch learns MAC addresses in each VLAN; two endpoints in different VLANs require a configured Layer-3 gateway/route and appropriate policy to communicate. A tagged link existing in a diagram does not prove both ends agree on allowed VLANs and native/untagged behavior."
    },
    {
      "heading": "Make segmentation falsifiable in an isolated topology",
      "body": "Design management VLAN and workload VLAN with specific port membership, prefixes, gateways, trunk allowances and intentional ACLs. Before routing is added, cross-VLAN traffic should fail by design while same-VLAN traffic succeeds. After inter-VLAN routing is configured, only approved paths should succeed; a wrong access VLAN or missing trunk allowance should be diagnosed from device state, not by loosening every ACL. If hardware cannot configure VLANs, keep it as a simulation or documented architecture decision, not a real network PASS."
    }
  ],
  "Planning Capacity for Internal Platform Services": [
    {
      "heading": "Reserve resources by lifecycle, not one VM per product name",
      "body": "Delivery, identity, messaging and observability services have different peak load, storage retention and recovery requirements; listing GitLab, Nexus, Keycloak, Redis and Graylog does not establish current need. Model host reserve, Steward/database baseline, and optional future envelopes separately. Their planned placement is a reversible hypothesis until each tool is measured under representative requests. Distinguish persistent queues/artifacts/log retention from ephemeral application compute and avoid promising all services fit on a single low-RAM host."
    },
    {
      "heading": "Introduce explicit stop thresholds rather than forecasting without data",
      "body": "Set conservative alarms for memory available/swap, disk capacity and write latency, CPU pressure and backup growth based on actual machine baseline, then define a response (stop unused guests, reduce retention with preservation, move storage or buy hardware). A host with 2 GiB unallocated headroom cannot safely promise another 4 GiB VM at full simultaneous demand; the published capacity example makes this refusal observable. A plan with unknown vendor requirements should be marked provisional rather than called enterprise readiness."
    }
  ]
};
