// Cloud Engineer canonical module 3; no original progress IDs modified.
// DNS program uses reserved test domain and documentation-only IP.
export type CloudNetworkDepthSection={heading:string;paragraphs:string[];codeKey?:string};
export const cloudNetworkDepth:Record<string,CloudNetworkDepthSection[]> = {
  "public-private-addressing": [
    {
      "heading": "Apply address scope to each actual Steward listener",
      "paragraphs": [
        "Public IPv4 is internet-routable when its network/provider route and policy allow delivery; RFC 1918 private ranges such as 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 are not publicly routed. Loopback 127.0.0.0/8 is meaningful inside one network namespace, not 'the same service' across two containers. A listener bound to 0.0.0.0 occupies all IPv4 interfaces in its own namespace, which differs from Docker publishing that port on the public host.",
        "Draw a request path with separate labels for provider-assigned public address, public reverse proxy, private container bridge, loopback-bound worker/DB and security policy. A container that cannot reach a host's 127.0.0.1 is not necessarily failing networking; it may be connecting to its own loopback namespace."
      ]
    },
    {
      "heading": "Prove negative reachability rather than assume NAT protects users",
      "paragraphs": [
        "Source NAT generally allows a private workload to initiate outbound connections while keeping reply state; it does not automatically create a public inbound route. IPv6 can supply globally scoped addresses without IPv4 NAT, making IPv6 host and provider firewall checks essential. Public DNS A and AAAA records can expose different paths even if they share one name.",
        "An outbound curl success proves only an egress path and remote response. A valid negative test needs an external client attempting a prohibited database or management port, plus server-side listener and firewall observations. The earlier VPS loopback proof is useful for local scope but is not external firewall evidence."
      ]
    }
  ],
  "internet-routing": [
    {
      "heading": "Follow destination prefixes and next-hop decisions",
      "paragraphs": [
        "Routers forward packets based on destination prefixes in route tables, usually selecting the most specific matching route. A device on the client's LAN sends traffic for a remote VPS to its default gateway; transit networks and the provider then move it toward the address. Autonomous systems exchange reachability using protocols such as BGP, but a Cloud Engineer primarily needs the observable path and the point at which authority shifts to an ISP/provider.",
        "A successful traceroute is not a proof of every hop's forwarding policy: middleboxes may suppress or rate-limit probes, paths may be asymmetric and load-balanced, and filtering ICMP does not necessarily block TCP 443. Treat timeouts in intermediate traceroute hops as unknown, not definitive outages."
      ]
    },
    {
      "heading": "Isolate DNS, route, transport and application failures",
      "paragraphs": [
        "If a name fails to resolve, first confirm authoritative DNS before investigating the VPS. If resolution returns the expected address but an external TCP connection times out, inspect provider routing/firewalls and host listeners. If TCP connects but TLS fails, inspect SNI, certificate chain and client trust. If HTTPS succeeds but the API returns 403, the network path may be healthy while authorization blocks the request.",
        "Record at least one definitive observation at each layer: resolved A/AAAA, route/interface where applicable, TCP handshake, verified TLS connection, HTTP status and authenticated application result. Restarting NGINX in response to a DNS delegation failure does not fix the actual boundary."
      ]
    }
  ],
  "domains-dns-records": [
    {
      "heading": "Distinguish a domain, zone, record and effective delegation",
      "paragraphs": [
        "A domain name is a hierarchical identifier, while a DNS zone is the set of records administered by a particular authoritative nameserver service. A domain can contain delegated child zones. The registrar holds or directs changes to registration and delegated NS records; the authoritative DNS provider publishes resource records; a recursive resolver caches answers for clients. These roles may be provided by one company but are distinct.",
        "An A record maps a name to an IPv4 address; AAAA to IPv6; CNAME aliases one name to another; MX selects mail exchangers; TXT carries arbitrary text including some domain-validation tokens. A CNAME at a zone apex may have provider-specific flattening behavior and cannot generally coexist with other records at the same owner name. Use explicit DNS provider behavior rather than treating all record types as strings."
      ]
    },
    {
      "heading": "Design an unambiguous HTTPS name before moving traffic",
      "paragraphs": [
        "Use an application subdomain for Steward's public HTTPS endpoint, with explicit responsibility for A/AAAA, certificate issuance, TTL and change approval. Choose whether clients are to reach a public reverse proxy, a load balancer or one VPS. Do not point DNS directly to PostgreSQL, SSH or worker ports. A new record may propagate through caches according to TTL; the records' presence in the admin console does not prove clients now resolve them.",
        "Before cutover, query the authoritative nameservers and several recursive resolvers to see actual records, TTLs and possible DNSSEC failures. Preserve previous address/digest and rollback plan; a short TTL reduces cache lifetime but does not guarantee instantaneous traffic movement."
      ]
    }
  ],
  "dns-resolution-troubleshooting": [
    {
      "heading": "Walk the resolver chain from a client query to authoritative data",
      "paragraphs": [
        "An application typically asks the OS resolver to resolve a hostname; a configured recursive resolver answers from cache or follows delegation from root to TLD to zone authority. Responses distinguish NOERROR with an address, NOERROR with no matching record, and NXDOMAIN for a name that does not exist. A DNS transaction ID matches replies to queries; the response contains header flags, question, answers and TTL values.",
        "A local hosts-file entry can bypass intended DNS lookups, a recursive cache can return an old address, and an authoritative server can disagree with another due to unpropagated changes. Diagnose 'name not found' by inspecting the actual resolver, record type, zone authority and response code instead of assuming every missing A record indicates a down VPS."
      ]
    },
    {
      "heading": "Execute an actual local UDP DNS A/NXDOMAIN packet exchange",
      "paragraphs": [
        "The runnable Python fixture starts a UDP DNS-like server solely on 127.0.0.1 and sends two actual DNS wire queries. It validates a transaction ID, response code, answer count and a single A record for api.steward.test., then proves missing.steward.test. returns NXDOMAIN with no answers. The .test zone and 192.0.2.10 documentation address are reserved examples, not live Steward DNS records.",
        "Run the code in a disposable local Python 3 interpreter. Expect DNS_LOCAL_A_RECORD_AND_TRANSACTION_ID_VERIFIED and DNS_LOCAL_NXDOMAIN_REJECTED_AS_MISSING. The small service does not implement recursive resolution, DNSSEC, TCP fallback, EDNS, authoritative delegation or public DNS provider behavior. For a real domain, use dig with an explicitly chosen resolver and compare authoritative NS answers separately."
      ],
      "codeKey": "dns"
    },
    {
      "heading": "Separate an expired cache from a name or service outage",
      "paragraphs": [
        "A TTL is a caching lifetime recommendation for a DNS record, not an application health signal. Cached success may continue during an authoritative outage, while a cold resolver may fail; negative responses may also be cached. Changing the A record does not retroactively cancel copies already held by clients and DNS infrastructure.",
        "Test resolution and application reachability independently, from more than one network if possible. If DNS resolves to a stale but valid IP, follow the actual TCP/TLS request to that address and decide whether lowering the TTL before planned cutover, retaining the old endpoint temporarily or updating delegation is the proper recovery step."
      ]
    }
  ],
  "tls-certificates": [
    {
      "heading": "Separate encryption, authentication and trust-chain verification",
      "paragraphs": [
        "TLS encrypts the connection and authenticates the server's claimed identity using certificates and proof of private-key possession. A client verifies the certificate chain to a trusted root, checks validity dates and the hostname/SAN, and negotiates supported protocol/cipher properties. Encrypting bytes to an attacker-controlled host does not provide authentication when the client ignores certificate verification.",
        "A certificate for api.steward.test. is not automatically valid for unrelated hostnames. A compromised private key requires revocation/replacement and investigation, not merely installing another copy. The CA issues under a validation process but cannot guarantee that your application authorization code is safe."
      ]
    },
    {
      "heading": "Plan issuance and automated renewal without exposing private keys",
      "paragraphs": [
        "Certificate issuance commonly requires domain or HTTP challenge control; the chosen method must match public reachability and internal DNS constraints. Store keys with restricted ownership and ensure proxy reload happens after successful renewal, with monitoring well ahead of expiration. Do not paste private keys into GitLab variables without approved protection or embed them in images.",
        "A successful TLS handshake from localhost does not show whether an external client can resolve, route to or trust the endpoint. Perform hostname-specific validation from an independent client and reject deliberately wrong hostnames/expired certificates without disabling verification."
      ]
    }
  ],
  "https-tls-termination": [
    {
      "heading": "Choose deliberately where TLS terminates and what remains trusted",
      "paragraphs": [
        "TLS may terminate at a public reverse proxy or managed load balancer, which then forwards requests to a private application listener. The hop from proxy to application can be plain HTTP inside a controlled local network or separately encrypted depending on threat model; the choice affects credentials, observability, key handling and network policy. 'HTTPS at the edge' does not prove that an untrusted actor cannot reach the backend directly.",
        "Set upstream address boundaries so the backend is not publicly reachable. Validate the received scheme/host and proxy forwarding headers only when sent by a known trusted hop; an external client that can inject X-Forwarded-Proto or X-Forwarded-For must not be able to forge security context."
      ]
    },
    {
      "heading": "Diagnose SNI, certificate and HTTP routing separately",
      "paragraphs": [
        "Server Name Indication carries the hostname in the TLS ClientHello so a multi-site listener can select an appropriate certificate before HTTP headers are available. A valid certificate for one name may coexist on the same IP with another; the selected virtual host and HTTP Host header route are further decisions. Incorrect SNI may lead to certificate mismatch even though TCP connects.",
        "Use an explicitly trusted CA path and inspect the negotiated certificate hostname from an external client. A 404 from the reverse proxy after a verified TLS handshake means the TLS boundary worked but application routing did not; a TLS alert or certificate error occurs earlier."
      ]
    }
  ],
  "reverse-proxies": [
    {
      "heading": "A reverse proxy is a controlled public ingress, not a replacement for the backend",
      "paragraphs": [
        "A reverse proxy listens for client requests, negotiates TLS, matches host/path routing, may enforce request-size/time limits and forwards to an upstream application. It is 'reverse' because clients address the public service rather than selecting arbitrary forward destinations. For Steward, NGINX may be the only public host listener while API and PostgreSQL remain on private networks.",
        "A load balancer can be a reverse proxy but the terms emphasize different functions: load balancing chooses backend instances; reverse proxying mediates the request path. Neither automatically provides application-level authentication or removes cross-team authorization requirements."
      ]
    },
    {
      "heading": "Inspect each failure boundary as a separate result",
      "paragraphs": [
        "Client DNS lookup, TCP to proxy, TLS handshake, proxy route selection, upstream TCP, application response and database query can each fail independently. A 502 often indicates an upstream gateway failure; a 504 indicates an upstream timeout; a valid 403 might indicate intentional application denial. Only logs and matching request IDs establish the correct layer and owner.",
        "Configure explicit upstream timeouts and request context propagation, but treat inbound forwarding headers as untrusted unless the proxy strips/rebuilds them. A backend service accidentally published on all host interfaces bypasses proxy security and logging, even when the public URL works normally."
      ]
    }
  ],
  "ingress-concepts": [
    {
      "heading": "Distinguish the ingress function from a Kubernetes Ingress resource",
      "paragraphs": [
        "Ingress is the boundary through which external traffic enters a service environment. On one VPS it may be NGINX and a provider firewall. In Kubernetes, Ingress is an API resource describing HTTP/HTTPS routes that requires an Ingress controller to reconcile it into actual data-plane configuration. The resource alone does not create a load balancer, public address, TLS identity or healthy backend.",
        "Modern cluster setups may use the Gateway API with GatewayClass, Gateway and HTTPRoute instead of or alongside Ingress, providing clearer separation of infrastructure and route ownership. The right introduction point is later Cloud orchestration: here the learner needs the ingress role and request path before memorizing Kubernetes object names."
      ]
    },
    {
      "heading": "Trace client-to-service identity through ingress hops",
      "paragraphs": [
        "Write the sequence user hostname → DNS → public IP → provider network → edge listener → route rule → internal service endpoint. Attach the policy/owner to every step and note how health checks select backends. A route can exist but still fail because no healthy endpoints are registered or the controller cannot provision the required listener.",
        "Do not deploy Kong, OpenShift Routes or a cluster just to illustrate ingress before their prerequisites. First establish a credible HTTPS route on the selected VPS and prove forbidden database/administrative ports remain private."
      ]
    }
  ],
  "internet-firewalls": [
    {
      "heading": "Separate stateless rules, stateful return traffic and app authorization",
      "paragraphs": [
        "A firewall decides whether packets or connections should be forwarded or delivered based on source/destination, interface, protocol, port and often connection state. A stateful allow rule for new inbound HTTPS commonly permits established replies; an outbound request and its return path are different from arbitrary new inbound connections. A default-deny rule needs explicit established/related and management allowances to avoid locking out an active administrator.",
        "Provider virtual firewalls and Linux nftables/firewalld may both apply, and Docker port publishing may involve netfilter forwarding behavior. Do not assume a single INPUT rule protects all forwarded container traffic. Inspect the actual packet path and rule ordering under the configured networking mode."
      ]
    },
    {
      "heading": "Prove intended exposure from an independent client",
      "paragraphs": [
        "Specify a policy matrix: permitted public TCP 443, restricted administration, private database, private queue, no unexplained exposed metrics. Test both positive and negative paths over IPv4 and IPv6 where available and record exact source/destination addresses, protocol, timestamps and packet/result evidence.",
        "A refused TCP connection and a timeout have different likely causes; neither is proof of correct authentication. Do not change production firewall state to get a passing exercise. Use an authorized disposable target and an out-of-band recovery path before testing fail-closed rules."
      ]
    }
  ],
  "exposure-attack-surface": [
    {
      "heading": "Enumerate exposed behaviors, not merely open ports",
      "paragraphs": [
        "Attack surface includes the public reverse proxy, API routes, authentication endpoints, admin dashboards, SSH, logs/metrics exporters and software management interfaces. A system with only TCP 443 externally open can still have insecure administrative HTTP routes exposed through that port; similarly a private database may be reachable through SSRF or overly broad internal roles.",
        "Inventory external DNS names, resolved addresses, TLS certificates, ports, HTTP routes, identity requirements, software versions and allowed source networks. Classify each endpoint by purpose and who may access it, not just by whether a port is open."
      ]
    },
    {
      "heading": "Prove denial at both network and application layers",
      "paragraphs": [
        "A provider firewall should block unsolicited private/database ports, while the application must reject a logged-in client trying to modify another team’s records. An HTTP 403 through the authorized HTTPS endpoint may be a successful security test when the caller lacks permission; a blocked TCP connection only tests network reachability.",
        "Prioritize reducing privilege and public exposure before buying additional security products. Re-test after load balancer/DNS/proxy changes because routing decisions can bypass previously assumed policies. Record which observations are from localhost, which are from real external networks and which are inferred from configuration only."
      ]
    }
  ]
};
export const cloudNetworkPractices:Record<string,string[]> = {
  "public-private-addressing": [
    "Inventory both IPv4/IPv6 and each container/host network namespace, including interface bindings and Docker published ports.",
    "From a separate client, prove one expected allowed path and one disallowed management/database path; local only does not count as external verification."
  ],
  "internet-routing": [
    "Explain a failure where DNS works and TCP 443 fails, using specific route/firewall/listener observations rather than restarting an arbitrary service.",
    "Compare traceroute with a TCP handshake and explain why silent intermediate routers are not automatically a routing outage."
  ],
  "domains-dns-records": [
    "Write an ownership/delegation map for registrar, zone DNS provider, recursive resolver, HTTPS endpoint and TLS issuer.",
    "Create a proposed A/AAAA change with TTL, verification queries, rollback address and provider permission requirements, but do not change a live domain without authorization."
  ],
  "dns-resolution-troubleshooting": [
    "Execute the exact localhost UDP A/NXDOMAIN source and capture all three DNS_* output markers; mutate a transaction ID or NXDOMAIN check in a disposable copy.",
    "For a real name, compare intended authoritative A/AAAA with actual recursive cached answers, recorded TTL and live TCP/TLS reachability."
  ],
  "tls-certificates": [
    "Build a client trust checklist for chain, hostname/SAN, validity, issuer, private-key custody and automated renewal.",
    "Explain a certificate mismatch or stale HTTPS endpoint without disabling TLS verification."
  ],
  "https-tls-termination": [
    "Draw both TLS and HTTP backend hops and decide where proxy headers become trusted.",
    "Test wrong SNI/Host and a blocked backend direct path on an authorized disposable setup, preserving diagnostic evidence."
  ],
  "reverse-proxies": [
    "Map DNS→proxy TCP/TLS→route→backend→database and identify each failure-specific status.",
    "Demonstrate one 502/504 vs intentional 403 distinction and how request IDs expose the broken layer."
  ],
  "ingress-concepts": [
    "Compare simple VPS NGINX ingress with Kubernetes Ingress controller and Gateway API concepts only at a boundary level.",
    "Do not create a Kubernetes cluster until later orchestration modules; focus on demonstrating one minimal safe HTTPS entry path."
  ],
  "internet-firewalls": [
    "Map authorized public HTTPS, restricted SSH and denied database/queue exposure over both IP families.",
    "Use provider plus host policy evidence and an external client test; explain why Docker forwarding may differ from host INPUT."
  ],
  "exposure-attack-surface": [
    "Inventory endpoints, routes, authentication, admin surfaces and exported metrics, not only listening ports.",
    "Provide both a network negative test and a distinct authenticated cross-team authorization denial for the same deployed release."
  ]
};
