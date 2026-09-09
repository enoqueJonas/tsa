import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const cloudflareDns: LearningResource = { title: "Cloudflare Learning Center — DNS", url: "https://www.cloudflare.com/learning/dns/what-is-dns/" };
const letsEncrypt: LearningResource = { title: "Let's Encrypt — How it works", url: "https://letsencrypt.org/how-it-works/" };
const mdnTls: LearningResource = { title: "MDN — Transport Layer Security", url: "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security" };
const nginxDocs: LearningResource = { title: "NGINX documentation", url: "https://nginx.org/en/docs/" };
const cloudflareRouting: LearningResource = { title: "Cloudflare Learning Center — Internet routing", url: "https://www.cloudflare.com/learning/network-layer/internet-protocol/" };

interface LessonSpec {
    id: string;
    title: string;
    intro: string;
    sections: Array<{ heading: string; paragraphs: string[]; list?: string[]; code?: { language: string; code: string; caption?: string } }>;
    practice: string[];
    questions: string[];
    resources: LearningResource[];
}

function richLesson(spec: LessonSpec): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: spec.intro }];
    for (const section of spec.sections) {
        blocks.push({ type: "heading", id: section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text: section.heading, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
        if (section.list) blocks.push({ type: "list", items: section.list });
        if (section.code) blocks.push({ type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward network checkpoint", body: "Trace the complete request path from a real external client to the Steward process. Every DNS record, firewall rule, listener, proxy hop and TLS boundary should exist for a reason and should be independently testable." });
    blocks.push({ type: "resources", title: "Continue learning", resources: spec.resources });

    return {
        id: `internet-networking-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `internet-networking-${spec.id}-001`, title: spec.title, estimatedMinutes: 40, content: { type: "reading", body: spec.intro, blocks } },
            {
                id: `internet-networking-${spec.id}-002`,
                title: `Apply: ${spec.title}`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective: `Apply ${spec.title} to the Steward internet environment.`,
                    scenario: "The Steward VPS already exists and can be administered safely. Build internet reachability deliberately without weakening the administrative boundary or hiding failures behind a single 'site unavailable' symptom.",
                    instructions: spec.practice,
                    deliverables: ["Network-path evidence", "Versioned configuration or decision note", "Successful and failed-path proof"],
                    completionCriteria: ["The request path is explainable hop by hop.", "Application exposure is narrower than administrative access.", "Failure evidence identifies the broken layer rather than guessing."],
                },
            },
            { id: `internet-networking-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: spec.questions.join("\n\n"), minimumCharacters: 180 } },
        ],
    };
}

const specs: LessonSpec[] = [
    {
        id: "public-private-addressing",
        title: "Public and Private Addressing",
        intro: "Internet exposure starts with understanding which addresses are globally routable and which exist only inside a private network. A service can listen correctly and still be unreachable because the address boundary is wrong.",
        sections: [
            { heading: "Public and private scopes", paragraphs: ["Private IPv4 ranges are intended for internal networks and are not globally routed on the public internet. A VPS usually has at least one provider-assigned public address and may also have private addresses used inside the provider network.", "The application process does not need to bind directly to the public address. A reverse proxy can listen on the host's external interface and forward to Steward on a loopback or private container address."], list: ["Public address: globally reachable when routing and firewall policy allow it.", "Private address: reachable only inside the relevant private routing domain.", "Loopback: host-local only.", "Container bridge address: usually local to the container networking domain."] },
            { heading: "Address scope is an exposure decision", paragraphs: ["Binding Steward directly to 0.0.0.0 can be appropriate inside a controlled container network but should not be confused with authorizing public access. Listener scope, host firewall, provider firewall and reverse-proxy configuration are separate controls."] },
        ],
        practice: ["Inventory every address currently associated with the Steward VPS, host, containers and application listeners.", "For each, classify the scope and identify which component can reach it.", "Change nothing yet; document the intended external-to-internal address path for HTTPS traffic."],
        questions: ["Why does binding a process to 0.0.0.0 not automatically make it internet-accessible?", "Why is it often preferable for the application process itself not to own the public listener?"],
        resources: [cloudflareRouting],
    },
    {
        id: "internet-routing",
        title: "Internet Routing Concepts",
        intro: "A public IP address is only useful because networks exchange routes that tell packets how to move toward that address. You do not need to operate BGP to troubleshoot a VPS, but you do need a mental model of how packets cross networks.",
        sections: [
            { heading: "Packets cross administrative domains", paragraphs: ["An external request leaves the client network, traverses multiple routers and autonomous systems, enters the provider network and is delivered to the VPS. The reverse path may not be identical, but the service still depends on end-to-end reachability in both directions."] },
            { heading: "Routing failure versus service failure", paragraphs: ["If packets never reach the VPS, restarting NGINX will not fix the problem. Conversely, successful ICMP or TCP reachability does not prove the application works. Troubleshooting should move layer by layer rather than treating every symptom as an application defect."], code: { language: "bash", caption: "Basic path evidence", code: "traceroute steward.example.com\n# or on systems where available\ntracepath steward.example.com" } },
        ],
        practice: ["From an external client, capture the route or path evidence toward the VPS public IP.", "Record the last point you can observe before provider infrastructure takes over.", "Explain how you would distinguish a routing problem from a closed TCP port."],
        questions: ["Why can a service be healthy while still being unreachable from the internet?", "What does a successful TCP connection prove that traceroute does not?"],
        resources: [cloudflareRouting],
    },
    {
        id: "domains-dns-records",
        title: "Domains and DNS Records",
        intro: "DNS gives stable names to changing infrastructure. For Steward, the domain should point users toward the intended public entry point without coupling them to an IP address they must remember.",
        sections: [
            { heading: "Names are indirection", paragraphs: ["An A record maps a name to an IPv4 address and an AAAA record maps to IPv6. CNAME records alias one name to another name. DNS does not open firewall ports, configure TLS or prove the application is healthy; it only helps clients find an address."] },
            { heading: "Design the name before creating records", paragraphs: ["Choose a stable hostname such as api.steward.example that reflects the service role. Keep administrative names and public application names distinct where useful. Avoid pointing multiple unrelated services at one name simply because the VPS has one address."] },
        ],
        practice: ["Choose the Steward public hostname and document why it is stable enough for clients.", "Create or plan the minimum required DNS record for the VPS public address.", "Record TTL and explain how it affects later address changes."],
        questions: ["What does an A record prove and what does it not prove?", "Why is DNS indirection useful even when the VPS public IP is currently static?"],
        resources: [cloudflareDns],
    },
    {
        id: "dns-resolution-troubleshooting",
        title: "DNS Resolution and Troubleshooting",
        intro: "DNS failures are easy to misdiagnose because browsers collapse many different problems into a single error page. Resolve the name independently before debugging TLS or the application.",
        sections: [
            { heading: "Trace resolution explicitly", paragraphs: ["A resolver may answer from cache, forward to another resolver or query authoritative servers. Tools such as dig let you inspect the returned record, TTL and authoritative path rather than guessing from browser behavior."], code: { language: "bash", caption: "Inspect Steward DNS", code: "dig api.steward.example A\ndig +trace api.steward.example" } },
            { heading: "Cache changes timing", paragraphs: ["Changing a DNS record does not instantly replace every cached answer. TTL determines how long resolvers may retain the previous result. During migration, compare answers from multiple resolvers and test the target IP directly when needed." ] },
        ],
        practice: ["Query Steward's hostname from at least two independent resolvers.", "Compare the returned address and TTL.", "Temporarily test the VPS by IP or hosts-file override and explain what that isolates from DNS."],
        questions: ["Why can two clients temporarily resolve the same hostname differently after a DNS change?", "What does testing the target by IP help isolate?"],
        resources: [cloudflareDns],
    },
    {
        id: "tls-certificates",
        title: "TLS Certificates and Certificate Authorities",
        intro: "TLS protects the confidentiality and integrity of traffic and lets clients authenticate the server identity they intended to reach. A certificate is part of that trust chain, not merely a browser decoration.",
        sections: [
            { heading: "Identity and trust", paragraphs: ["A certificate binds a public key to one or more DNS names and is signed through a certificate-authority chain trusted by the client. The client also verifies that the certificate is valid for the requested hostname and time period."] },
            { heading: "Automated issuance", paragraphs: ["ACME-based services such as Let's Encrypt automate proving control of a domain and issuing certificates. Automation is valuable because certificates expire and manual renewal creates avoidable outage risk."], list: ["Private key must remain protected.", "Certificate must match the public hostname.", "Renewal path must be automated and testable.", "Expired certificates are operational failures even when the application is healthy."] },
        ],
        practice: ["Inspect the certificate requirements for the chosen Steward hostname.", "Document where the private key will live and which process needs access.", "Choose an ACME challenge method appropriate for the current VPS architecture and explain the dependency it introduces."],
        questions: ["What does a trusted certificate authenticate?", "Why is automated certificate renewal an operational requirement rather than a convenience?"],
        resources: [letsEncrypt, mdnTls],
    },
    {
        id: "https-tls-termination",
        title: "HTTPS and TLS Termination",
        intro: "TLS termination is the point where encrypted client traffic is decrypted. That boundary determines which component owns certificates and what traffic remains encrypted or trusted behind it.",
        sections: [
            { heading: "Terminate deliberately", paragraphs: ["For the Steward VPS, a reverse proxy such as NGINX can terminate TLS on port 443 and forward HTTP to the application over a local or tightly controlled private network path. This keeps certificate handling out of the Django process while preserving one clear public entry point."] },
            { heading: "Forwarded request context", paragraphs: ["When a proxy terminates TLS, the application may need trusted forwarded headers to know the original scheme and client information. Only trust such headers from the known proxy boundary; arbitrary internet clients must not be able to spoof them."], code: { language: "text", caption: "Request boundary", code: "client --HTTPS--> reverse proxy --HTTP/private--> Steward API" } },
        ],
        practice: ["Draw the exact TLS termination point for Steward.", "List which component owns the certificate, private key and port 443 listener.", "Document which forwarded headers the application needs and why they are trusted only from the proxy."],
        questions: ["What changes operationally when TLS terminates at a reverse proxy?", "Why should an application not blindly trust X-Forwarded-* headers from every client?"],
        resources: [mdnTls, nginxDocs],
    },
    {
        id: "reverse-proxies",
        title: "Reverse Proxies",
        intro: "A reverse proxy is an application-facing network boundary that accepts client requests and forwards them to one or more backend services. It centralizes public listening, TLS and selected HTTP policy without replacing the application itself.",
        sections: [
            { heading: "One public edge, narrower backend", paragraphs: ["Steward can listen only on localhost or a private container network while NGINX owns ports 80 and 443. This reduces accidental direct exposure and gives a stable public endpoint even if the internal application port changes."] },
            { heading: "Proxy failures are their own layer", paragraphs: ["A 502 response often means the proxy is reachable but cannot obtain a valid response from the backend. That is different from DNS failure, TLS handshake failure or application-level 500. Preserve those distinctions during troubleshooting."], code: { language: "nginx", caption: "Minimal Steward proxy shape", code: "server {\n    listen 443 ssl;\n    server_name api.steward.example;\n\n    location / {\n        proxy_pass http://127.0.0.1:8000;\n        proxy_set_header Host $host;\n        proxy_set_header X-Forwarded-Proto $scheme;\n    }\n}" } },
        ],
        practice: ["Configure or draft the minimal Steward reverse-proxy virtual host.", "Keep the backend listener non-public.", "Deliberately stop the backend and record how the proxy failure differs from a closed public port."],
        questions: ["Why is a reverse proxy not the same thing as the application server?", "What does an HTTP 502 tell you that a TCP timeout does not?"],
        resources: [nginxDocs],
    },
    {
        id: "ingress-concepts",
        title: "Ingress Concepts",
        intro: "Ingress is the controlled path by which external traffic enters a system. In a single-VPS architecture the ingress may be one reverse proxy; in larger platforms it may involve load balancers, gateways and orchestrator-specific routing.",
        sections: [
            { heading: "Ingress is a role, not a product name", paragraphs: ["The important question is where external traffic first crosses into infrastructure you operate and how it is routed afterward. On the Steward VPS, NGINX plus provider and host firewall rules form a simple ingress path.", "Later cloud-native systems may use managed load balancers or Kubernetes ingress controllers, but adding those components now would not improve the current requirement by itself."] },
            { heading: "Keep the path visible", paragraphs: ["Every additional ingress hop adds configuration, failure modes and observability requirements. Add a layer only when it solves a concrete requirement such as multiple backends, managed TLS, global routing or load distribution." ] },
        ],
        practice: ["Label each component in Steward's external request path as routing, filtering, TLS termination or application handling.", "Identify the current ingress boundary.", "State one future requirement that could justify replacing the single-VPS ingress with a managed load balancer or gateway."],
        questions: ["Why is ingress better understood as a system role than as one specific technology?", "What cost does every additional ingress hop introduce?"],
        resources: [nginxDocs],
    },
    {
        id: "internet-firewalls",
        title: "Internet-facing Firewalls",
        intro: "Internet-facing firewall policy should expose only the traffic required for the service and preserve a separate administrative path. Public application access and SSH administration are different trust boundaries.",
        sections: [
            { heading: "Layer provider and host controls", paragraphs: ["The provider firewall can reject unwanted traffic before it reaches the VPS. The host firewall provides another policy boundary close to the operating system. Using both can be useful, but only if their combined policy is documented rather than contradictory."] },
            { heading: "Application ports should be minimal", paragraphs: ["Typical public Steward exposure should be 443 and optionally 80 for redirect or ACME challenge behavior. The internal application port and database port should not be publicly reachable. SSH should be restricted as tightly as the provider and user environment allow."], list: ["443/tcp: public HTTPS application traffic.", "80/tcp: optional redirect/ACME path.", "22/tcp: administrative path, restricted separately.", "8000/tcp and 5432/tcp: not public internet services."] },
        ],
        practice: ["Write the intended provider and host firewall matrices for Steward.", "From an external client, prove HTTPS is reachable and at least one intentionally closed backend/database port is not.", "Record how SSH is restricted differently from public application access."],
        questions: ["Why should a database port remain closed even if the database requires authentication?", "What is the benefit of proving a denied path as well as an allowed path?"],
        resources: [cloudflareRouting],
    },
    {
        id: "exposure-attack-surface",
        title: "Exposure, Attack Surface and Administrative Boundaries",
        intro: "Every reachable service expands the system's attack surface and operational responsibility. Cloud networking discipline means knowing exactly which interfaces are public, which are administrative and which are internal only.",
        sections: [
            { heading: "Reachability creates responsibility", paragraphs: ["A service that is not intended for public users should not be exposed simply because authentication exists. Public reachability means internet scanning, malformed traffic and future software vulnerabilities can reach the service boundary."] },
            { heading: "Separate user and operator paths", paragraphs: ["Steward users need HTTPS access to the API. Operators need SSH or another administrative mechanism. These paths have different identities, allowed sources, logging needs and failure consequences. Keeping them separate makes later Security Steward controls much clearer."] },
            { heading: "Minimize before hardening", paragraphs: ["The simplest attack surface reduction is often not exposing a service at all. Security tools cannot compensate for unnecessary listeners and broad firewall rules. First remove reachability that has no requirement; then harden what remains." ] },
        ],
        practice: ["Create an exposure inventory for every listening Steward VPS port and classify it as public-user, administrative, internal or unintended.", "Remove or close one unnecessary reachable path if one exists.", "Document the remaining public and administrative boundaries for later Security Steward work."],
        questions: ["Why is authentication not sufficient justification for exposing an internal service publicly?", "What is the operational value of separating the user ingress path from the administrative path?"],
        resources: [mdnTls],
    },
];

const publishLab: Lesson = {
    id: "internet-networking-publish-steward-lab",
    title: "Lab: Publish Steward API with DNS and TLS",
    activities: [
        {
            id: "internet-networking-publish-steward-lab-001",
            title: "External Request Path Plan",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Define the complete external request path before exposing Steward publicly.",
                scenario: "The VPS is already provisioned, recoverable and administratively accessible. Publish only the application path required for users while preserving the existing management boundary.",
                instructions: ["Choose the public Steward hostname and map it to the VPS public address.", "Draw client → DNS → provider network/firewall → host firewall → TLS/reverse proxy → Steward API.", "Define public, administrative and internal-only ports.", "Define the certificate issuance/renewal path and where private key material lives.", "Record the expected failure signal at each hop."],
                deliverables: ["External request-path diagram", "DNS/firewall/listener matrix", "TLS ownership and renewal note"],
                completionCriteria: ["Every hop has an explicit role.", "The backend API and database are not public listeners.", "Administrative access is not conflated with user ingress."],
            },
        },
        {
            id: "internet-networking-publish-steward-lab-002",
            title: "Publish and Verify Steward",
            estimatedMinutes: 180,
            content: {
                type: "practical",
                objective: "Expose the versioned Steward release through DNS and HTTPS and prove the end-to-end path from an external client.",
                scenario: "Use the already-deployed immutable Steward release. Do not rebuild the application just to publish it on the internet.",
                instructions: ["Create the DNS record and verify authoritative/resolver responses.", "Configure the reverse proxy and automated TLS certificate issuance.", "Apply provider and host firewall rules for the intended public path.", "Verify the certificate chain and hostname from an external client.", "Verify the health endpoint and one representative authenticated Steward API request.", "Capture the running release identity so the external response can be tied back to the approved artifact."],
                deliverables: ["DNS evidence", "TLS/reverse-proxy configuration", "External HTTPS verification", "Release-identity evidence"],
                completionCriteria: ["The hostname resolves correctly.", "HTTPS validates without bypassing certificate checks.", "A representative API path works externally.", "The response is traceable to the known deployed Steward release."],
            },
        },
        {
            id: "internet-networking-publish-steward-lab-003",
            title: "Break the Network Path Deliberately",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Demonstrate layer-by-layer network troubleshooting without guessing.",
                scenario: "Introduce safe, reversible failures one at a time so each layer produces recognizable evidence.",
                instructions: ["Choose at least two safe failures from different layers, such as wrong DNS target, blocked 443, stopped reverse proxy or stopped backend.", "Predict the expected client symptom before introducing each failure.", "Use independent tools to identify the broken layer.", "Restore the intended configuration after each test.", "Verify the full external path after recovery."],
                deliverables: ["Failure predictions", "Diagnostic command/output evidence", "Recovered external verification"],
                completionCriteria: ["The diagnosis identifies the failed layer.", "Recovery restores the original known configuration.", "No broad firewall opening or TLS bypass is used as a shortcut."],
            },
        },
        {
            id: "internet-networking-publish-steward-lab-004",
            title: "Internet Networking Review",
            estimatedMinutes: 30,
            content: {
                type: "reflection",
                prompt: "Trace one successful external Steward request from DNS lookup through the final application response and name the evidence available at each boundary. Then identify the narrowest remaining network assumption that Cloud Building Blocks or later Security Steward work should improve without adding unnecessary complexity.",
                minimumCharacters: 250,
            },
        },
    ],
};

export const internetNetworkingDeepLessons: Lesson[] = [...specs.map(richLesson), publishLab];
