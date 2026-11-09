// Cloud Engineer module 3: deepen ORIGINAL Internet Networking readings and practices.
// The exact Python TLS exercise remains loopback-only and does not touch any VPS or CA.
export type NetworkDepthSection={heading:string;paragraphs:string[]};
export const cloudNetworkMechanismSections:Record<string,NetworkDepthSection[]> = {
  "public-private-addressing": [
    {
      "heading": "Follow one packet from public destination to a listening socket",
      "paragraphs": [
        "An IPv4 address is a routeable endpoint identifier, not a declaration that an application is listening. A provider may route a public address to the VPS interface or map it through network address translation. The operating system then checks the destination, routing and firewall before delivering a TCP connection to a socket bound to a chosen local address and port. A process bound to 127.0.0.1 accepts local connections, while a process bound to 0.0.0.0 is potentially reachable via all IPv4 interfaces, subject to firewall rules.",
        "Create a table showing external client IP, DNS result, public destination, provider firewall, guest firewall, listening address, reverse proxy and private upstream. For each boundary record a command and negative observation; localhost curl alone proves neither that public clients can connect nor that unintended clients are denied. Dual-stack IPv6 requires its own route and listener review."
      ]
    },
    {
      "heading": "Distinguish NAT, private address and application authorization",
      "paragraphs": [
        "A private RFC1918 IPv4 address identifies a host on a scoped network; NAT can translate outbound traffic to a public source, but that does not establish a publicly accessible inbound path. A globally routeable IPv6 address may be present with no IPv4 port mapping. A firewall denying a TCP port, an application refusing an unauthenticated request and a failed TLS hostname check are different forms of rejection and protect different layers.",
        "For the real Steward service, expose only the gateway boundary needed for users and restrict database, queues and administration. A successful HTTPS response proves some network stages, but the application must still reject an unauthorized cross-team mutation. Network reachability must not be misreported as business authorization."
      ]
    }
  ],
  "internet-routing": [
    {
      "heading": "Separate IP path selection from the application request",
      "paragraphs": [
        "Routers forward packets using destination prefixes and routing policies. A DNS resolver chooses an address, then the client's operating system selects a route and source address, then routers and middleboxes decide whether the packets reach the target network. No single traceroute result proves every intermediary: some routers suppress ICMP, return incomplete paths or route return traffic differently. A TCP connection can fail after a successful DNS answer without the DNS layer being wrong.",
        "Use ip route get and a short targeted TCP connection test from an authorized client to identify the intended next hop and destination. If a route exists but TCP fails, examine provider firewall, Linux filtering and listening socket separately. Do not turn an uncertain route into a precise physical geography claim merely because a hop name contains a location."
      ]
    },
    {
      "heading": "Explain the diagnostic meaning of timeout, refusal and successful handshake",
      "paragraphs": [
        "A TCP timeout usually means the connection did not complete within the observation period; it could be packet filtering, unreachable address or transport loss. An immediate connection refusal indicates a reachable endpoint or intermediary rejected the connection, often because no process is listening, though filtering devices can also reject. A completed TCP handshake only proves transport reachability, not valid HTTPS identity, correct gateway route or healthy Steward API behavior.",
        "Record observation time, target name/IP, address family, source network and tool error. Compare connection to an intentionally healthy port with one intentionally closed port in a disposable environment, then continue independently to TLS validation and HTTP status. On a real external VPS use an authorized vantage point; do not scan arbitrary third-party hosts."
      ]
    }
  ],
  "domains-dns-records": [
    {
      "heading": "Distinguish delegation from a single cached answer",
      "paragraphs": [
        "DNS maps domain names to record data using a distributed hierarchy. A recursive resolver may use its cache, follow delegations or query an authoritative server. An A record contains an IPv4 address, AAAA contains IPv6, CNAME aliases one owner name to another, NS delegates authority, and TXT can carry verification policy material. A successful answer from one recursive resolver does not prove that the registrar delegated the zone to the intended authoritative servers.",
        "Draw the path: root/TLD delegation, NS set, authoritative zone, recursive cache and final A/AAAA answer. Use explicit test names reserved for documentation; avoid creating fake public records and calling them observed. To publish Steward, verify the actual registrar and authoritative DNS records from a separate client and compare them with the provider's verified public endpoint."
      ]
    },
    {
      "heading": "Do not confuse hostname identity and certificate validity",
      "paragraphs": [
        "A DNS record tells a client where to connect; it does not cryptographically certify that the responding server is authorized for the name. HTTPS subsequently validates a server certificate against the requested hostname and a trusted issuer, and application authorization is another boundary again. An attacker controlling a stale DNS cache might redirect traffic, but a correctly verified TLS connection should reject a server lacking the intended trusted certificate identity.",
        "During an address change, record both old and new DNS values, TTL expectations, certificate name coverage and rollback conditions. Verify A and AAAA records separately when dual-stack clients exist. Testing directly against the new IP with the correct TLS server name can isolate DNS routing without disabling hostname verification."
      ]
    }
  ],
  "dns-resolution-troubleshooting": [
    {
      "heading": "Trace the resolver cache and authority before blaming the server",
      "paragraphs": [
        "A recursive resolver can return a cached A/AAAA record until its TTL expires; a second resolver may return newer data. NXDOMAIN indicates a name does not exist according to the observed resolution context, while SERVFAIL can reflect resolver/upstream or DNSSEC errors. A local hosts-file override can bypass recursive DNS entirely. None of these outcomes alone establishes that the VPS web service is listening or accepting HTTPS.",
        "Start with the chosen hostname, record which recursive resolver answers, inspect TTL and record type, and compare with the authoritative path using dig when available. Avoid treating one dig +trace response as if it were the request path every browser used. A real external check should name the resolver and timestamp so delayed cache convergence can be reasoned about later."
      ]
    },
    {
      "heading": "Separate DNS bypass from TLS bypass",
      "paragraphs": [
        "When a DNS record is wrong but a target host is already provisioned, a client can connect to an explicit IP while preserving the desired HTTPS hostname through a suitable tool. This isolates address resolution from the TLS server-name and certificate chain. A curl --insecure flag removes a critical trust signal; it may make a test pass for the wrong reason and must not be used as ordinary diagnosis.",
        "Compare the DNS-resolved IP, TCP connection, TLS hostname verification and HTTP response independently. Mark the exact layer that changed when the test succeeds. The live localhost TLS fixture in the later certificate topic bypasses public DNS intentionally yet still checks the hostname; it is not evidence that real public DNS records are correct."
      ]
    }
  ],
  "tls-certificates": [
    {
      "heading": "Explain the certificate chain and hostname decision",
      "paragraphs": [
        "A TLS server certificate binds a public key to DNS names through the Subject Alternative Name extension. A client checks validity dates, intended hostname, issuer chain and trust anchor before treating the peer as authentic. The client normally receives a leaf certificate and often intermediate certificates; the root trust anchor is held by the client. Encryption alone does not authenticate the intended server if verification has been disabled.",
        "A self-signed training certificate can be explicitly trusted by a disposable client for a local exercise, but it should not be silently installed as a system-wide trusted root or used as the public production certificate. The correct deployment contract includes issuer, SAN list, private-key custody, chain delivery, renewal and failure monitoring. A certificate with the right hostname from an untrusted issuer must still be rejected."
      ]
    },
    {
      "heading": "Run real TLS handshakes with both correct and unsafe trust paths",
      "paragraphs": [
        "The copyable Python/OpenSSL program launches a TLS server only on 127.0.0.1 with a disposable one-day certificate for api.steward.test. A client that deliberately trusts that one certificate and supplies the correct server_hostname completes a genuine TLS connection and simple HTTP GET. A client with the correct trust anchor but wrong hostname fails; a normal system-trust client also rejects the unknown local issuer. All files and ports are temporary and no public DNS, ACME or VPS configuration is touched.",
        "Expected markers are TLS_TRUSTED_LOCAL_CERT_AND_CORRECT_NAME_OK, TLS_WRONG_HOSTNAME_REJECTED, TLS_UNTRUSTED_LOCAL_CERT_REJECTED, TLS_LOOPBACK_ONLY_AND_REJECTION_COUNT_VERIFIED and TLS_NOT_REAL_DNS_ACME_PUBLIC_CA_OR_VPS_CONFIG. Changing the wrong-host value to the approved hostname must fail a negative assertion. The exercise teaches real TLS semantics, not public certificate issuance or renewal."
      ]
    },
    {
      "heading": "Treat certificate renewal as an availability dependency",
      "paragraphs": [
        "An ACME client proves control of a name through a selected challenge mechanism and obtains a short-lived certificate; the gateway must deploy a current leaf/intermediate chain and reload it safely. Different challenges require different DNS or HTTP reachability. Renewal may fail because of expired registration, wrong DNS, blocked challenge port, provider API credentials or invalid gateway reload. A running server with an expired certificate may fail for most real clients despite appearing healthy to a local process monitor.",
        "In the authorized Steward deployment, record the ACME challenge path, certificate expiry, responsible service, key permissions, reload mechanism and alert threshold. Rehearse renewal against staging or an equivalent safe process, then independently verify the presented certificate's SAN/issuer/expiry from outside. Do not claim this occurred merely because the localhost TLS fixture succeeded."
      ]
    }
  ],
  "https-tls-termination": [
    {
      "heading": "Distinguish TLS endpoint, HTTP reverse proxy and private upstream",
      "paragraphs": [
        "At a public HTTPS gateway, the client negotiates TLS with the gateway certificate and then sends an HTTP request inside that encrypted connection. The gateway selects a route, forwards to an internal service and returns the response. If gateway→upstream uses plaintext HTTP on a private interface, the gateway is the cryptographic endpoint and the private segment relies on network isolation; re-encryption and mutual TLS alter the trust model.",
        "Map which component owns the public hostname, private key, certificate rotation, HTTP routing rules, client identity headers and application health. A 200 from a gateway static page does not prove the Django API, outbox publisher or RabbitMQ consumer are healthy. Test an actual authenticated API path and a denied unauthorized call after deployment."
      ]
    },
    {
      "heading": "Explain SNI, Host and forwarded headers as separate inputs",
      "paragraphs": [
        "During a TLS handshake, Server Name Indication tells the gateway which certificate/virtual host a client expects before HTTP begins. After TLS, the HTTP Host header and path can inform routing. Forwarded/X-Forwarded-* headers may convey original scheme/IP but are spoofable if arbitrary clients may set them. The application should trust these headers only from a controlled proxy and should have a known host allowlist.",
        "With a correct certificate for api.example but an invalid upstream Host mapping, TLS can succeed while the gateway returns 404 or routes to the wrong service. Conversely, an HTTPS request to the right IP with an incorrect hostname should fail identity verification first. Diagnose the two independently rather than disabling hostname checks or globally trusting client-supplied forwarded headers."
      ]
    }
  ],
  "reverse-proxies": [
    {
      "heading": "Follow the data plane without confusing it with deployment tooling",
      "paragraphs": [
        "A reverse proxy accepts client requests and forwards them to one or more upstream application services. It may terminate TLS, enforce size/time limits, preserve client context and select a healthy upstream, but the application still owns business authorization and database transactions. NGINX, Kong or an ingress controller can perform this role at different learning stages; the concept is the role, not a claim that one particular product is always necessary.",
        "For the current Steward VPS baseline, choose the simplest approved gateway already earned in the lesson sequence. Document the public listener, private upstream bind, routing rule, TLS certificate, timeout policy and failure behavior. Later Kong or Kubernetes topics may introduce gateway and declarative controllers; do not install them prematurely just to demonstrate a reverse-proxy definition."
      ]
    },
    {
      "heading": "Predict four observable failure layers",
      "paragraphs": [
        "Wrong DNS can route users to the wrong host, a blocked gateway port can prevent TCP handshakes, a wrong TLS name prevents authenticated handshakes, and a stopped upstream may produce a 502/503 while the gateway itself remains responsive. These outcomes are distinguishable with resolver answers, curl connection errors, openssl s_client and gateway/upstream logs; guessing from a browser's generic 'site unavailable' message loses diagnostic precision.",
        "In a safe local or approved lab, introduce one change at a time, collect before/failure/after outputs, then revert it. A successful localhost proxy request is not proof that the real public firewall, DNS, TLS issuer, gateway route or deployed Steward service is correctly configured."
      ]
    }
  ],
  "ingress-concepts": [
    {
      "heading": "Distinguish the abstract inbound boundary from a Kubernetes object",
      "paragraphs": [
        "Ingress means handling inbound client traffic into a system; an HTTP reverse proxy is one implementation. In Kubernetes, an Ingress API resource describes host/path routing but requires a running ingress controller to act. A Gateway API controller is another model with different resources and policies. Writing an Ingress manifest alone does not create external reachability, allocate a load balancer or guarantee certificates.",
        "At this point Steward can be published through a deliberate single VPS gateway. Only later Cloud Orchestration should compare Kubernetes Ingress and Gateway objects, ingress-controller identity, network endpoints, service routing and cluster security. Avoid teaching a new controller as a mandatory prerequisite for simple HTTPS."
      ]
    },
    {
      "heading": "Keep ownership of the inbound trust chain visible",
      "paragraphs": [
        "A routed request passes DNS, provider network, any load balancer, firewall, gateway TLS endpoint, internal service and application authorization. Every hop introduces a responsibility and an observable status. The correct architecture minimizes public exposure and records which party is allowed to configure or inspect each boundary.",
        "Draw both a current simple VPS route and a future Kubernetes-managed route. For each, mark where TLS is terminated, where original client identity is asserted, where routing is decided and where request authorization occurs. If the diagram cannot identify the trust origin of forwarded headers, the design is not yet ready for deployment."
      ]
    }
  ],
  "internet-firewalls": [
    {
      "heading": "Differentiate packet filtering from an unbound service",
      "paragraphs": [
        "A provider security group/firewall may filter packets before they reach the guest, while a host firewall processes the packets that reach the operating system. A socket bound to loopback cannot accept public destination traffic even if provider port 5432 is accidentally opened. Conversely a public bind plus a permissive host and provider rule can expose a database; the model depends on address family and IPv6, not only IPv4.",
        "Inventory listening addresses with ss and approved ingress policy at both levels. Test one intended public HTTPS route and one forbidden database/queue route from an authorized external vantage point. Capture source IP/family and error timing. A local connection refusal is not evidence that the provider has blocked the same port from the internet."
      ]
    },
    {
      "heading": "Use a recoverable change process for rule updates",
      "paragraphs": [
        "Firewall changes can immediately sever SSH before the operator can reverse a mistake. Maintain a working second session, provider console and a time-bounded rollback plan. Apply the minimum specific source CIDR/protocol/port rule and test allowed and denied paths after every change. An ephemeral debug rule must have a documented expiry and an owner.",
        "The right fix for a 502 error is rarely to open all ports. Separate the upstream application error from provider filtering and TLS identity. If no independent external client or safe rollback path exists, explicitly mark the network negative test NOT_TESTED rather than simulating a production denial."
      ]
    }
  ],
  "exposure-attack-surface": [
    {
      "heading": "Inventory what an attacker can actually reach",
      "paragraphs": [
        "An attack surface is the set of externally accessible interfaces and behaviors that may be exercised by an unauthorized actor. Public DNS names, sockets, admin panels, unauthenticated API routes, exposed metrics, database ports and weak TLS all contribute in different ways. A process running on a VPS is not automatically public, but a container mapping or dual-stack listener can change exposure without anyone editing the primary gateway.",
        "Collect listening sockets, container port mappings, provider/host rules, DNS A/AAAA records and approved public services. Rank each exposed surface by need and plausible impact. Remove unnecessary listeners rather than trying to protect every accidental public port with an extra login prompt."
      ]
    },
    {
      "heading": "Do not mistake network isolation for tenant authorization",
      "paragraphs": [
        "Even with PostgreSQL and RabbitMQ on private interfaces, a public Django API must reject requests from actors who do not own the requested resource. A proxy can authenticate a user at the edge, but the application must still enforce object-level permissions. A valid TLS certificate proves the gateway's key/name identity, not that a logged-in Team A user may mutate Team B's service.",
        "Before publishing Steward, test one authorized API operation, one denied cross-team operation and one asynchronous event path; check the API, outbox and consumer identities. A simple health endpoint cannot establish the full authorization or data-integrity contract."
      ]
    },
    {
      "heading": "Keep monitoring and denial evidence bounded",
      "paragraphs": [
        "Do not run broad scans of third-party networks to manufacture security evidence. The learner should restrict probing to an owned VPS or disposable local lab, record explicit expected open ports, and verify deliberate closed paths using targeted connections. Security Steward will deepen vulnerability discovery; Cloud Engineer must already make the exposure inventory accurate and the rollback path safe.",
        "When a denial test is absent, write NOT_TESTED and include the exact vantage point or permission needed. No architecture should be described as secure solely because a diagram uses the words 'private network', 'HTTPS' or 'firewall'."
      ]
    }
  ]
};
export const cloudNetworkAppliedPractices:Record<string,string[]> = {
  "public-private-addressing": [
    "Trace \"Follow one packet from public destination to a listening socket\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Distinguish NAT, private address and application authorization\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health."
  ],
  "internet-routing": [
    "Trace \"Separate IP path selection from the application request\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Explain the diagnostic meaning of timeout, refusal and successful handshake\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health."
  ],
  "domains-dns-records": [
    "Trace \"Distinguish delegation from a single cached answer\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Do not confuse hostname identity and certificate validity\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health."
  ],
  "dns-resolution-troubleshooting": [
    "Trace \"Trace the resolver cache and authority before blaming the server\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Separate DNS bypass from TLS bypass\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health.",
    "Compare resolver answer, selected IP, TCP reachability and TLS server_hostname without ever using curl --insecure to make an unknown identity appear valid."
  ],
  "tls-certificates": [
    "Trace \"Explain the certificate chain and hostname decision\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Treat certificate renewal as an availability dependency\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health.",
    "Execute the exact local Python/OpenSSL TLS program from this reading, preserve its five TLS_* markers, and deliberately substitute an accepted hostname or issuer to show the negative security assertion fails."
  ],
  "https-tls-termination": [
    "Trace \"Distinguish TLS endpoint, HTTP reverse proxy and private upstream\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Explain SNI, Host and forwarded headers as separate inputs\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health."
  ],
  "reverse-proxies": [
    "Trace \"Follow the data plane without confusing it with deployment tooling\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Predict four observable failure layers\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health."
  ],
  "ingress-concepts": [
    "Trace \"Distinguish the abstract inbound boundary from a Kubernetes object\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Keep ownership of the inbound trust chain visible\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health."
  ],
  "internet-firewalls": [
    "Trace \"Differentiate packet filtering from an unbound service\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Use a recoverable change process for rule updates\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health."
  ],
  "exposure-attack-surface": [
    "Trace \"Inventory what an attacker can actually reach\" from real DNS and TCP/TLS observations, documenting each tool, layer, expected result and one deliberately failed boundary. Label unavailable public infrastructure as NOT_TESTED instead of inventing observed hosts or certificates.",
    "Use \"Keep monitoring and denial evidence bounded\" to predict what an unauthorized client would observe and what the operator can safely restore. Record which successful check cannot prove application authorization or worker health."
  ]
};
