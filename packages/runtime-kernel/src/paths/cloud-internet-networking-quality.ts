import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { internetNetworkingDeepLessons } from "./cloud-internet-networking-deep";

const practices: Record<string, PracticalContent> = {
    "Public and Private Addressing": {
        type: "practical",
        objective: "Prove which Steward addresses are public, private, loopback-only and container-local before publishing any new listener.",
        scenario: "The VPS is internet-routable, but the Steward application, gateway and database must not all inherit the same exposure merely because they share one host.",
        instructions: [
            "Inventory the VPS public/private addresses, loopback addresses, container networks and every Steward-related listener.",
            "Classify each listener as public-user, management, backend-only or unintended.",
            "Draw the intended HTTPS path from the public address to Kong and then to the Steward backend.",
            "Test one address/listener pair that should be reachable and one that should not be reachable from an external client.",
            "Record any listener whose binding scope is broader than its actual requirement and decide whether to narrow it."
        ],
        deliverables: ["Address/listener inventory", "Public-to-backend path diagram", "Positive and negative reachability evidence"],
        completionCriteria: ["Address scope and authorization are treated as separate controls.", "The Steward backend and database are not treated as public services.", "At least one denied path is proven externally."],
    },
    "Internet Routing Concepts": {
        type: "practical",
        objective: "Separate internet-routing reachability from TCP, gateway and application failures using evidence from an external client.",
        scenario: "A Steward request fails from outside the VPS. Restarting application components blindly would hide which layer actually failed.",
        instructions: [
            "Capture route/path evidence toward the Steward public address from an external network.",
            "Test TCP reachability to the intended public HTTPS port independently of HTTP behavior.",
            "Compare a routing/path failure, a closed-port symptom and a reachable-gateway/application failure.",
            "Write a short troubleshooting order that moves from routing to transport to TLS/gateway to application.",
            "Use the order against one real or controlled failure and preserve the first trustworthy evidence of the failed layer."
        ],
        deliverables: ["Path evidence", "Layered troubleshooting decision tree", "Failure diagnosis evidence"],
        completionCriteria: ["The diagnosis does not infer application health from route visibility.", "TCP evidence is distinguished from HTTP evidence.", "The learner identifies the failed layer before changing configuration."],
    },
    "Domains and DNS Records": {
        type: "practical",
        objective: "Create a stable public Steward name without coupling clients to a remembered VPS address or exposing administrative services through the same naming contract.",
        scenario: "The VPS has an address, but users need a durable application endpoint and operators need a separate management boundary.",
        instructions: [
            "Choose the public Steward API hostname and document why it represents the service rather than the current machine.",
            "Create the minimum A/AAAA record required for the public edge and record the TTL.",
            "Keep public application naming separate from any private management naming convention.",
            "Verify authoritative and recursive answers from an external resolver.",
            "Describe how you would change the public target later without changing the Steward API identity presented to users."
        ],
        deliverables: ["DNS record design", "Resolver evidence", "Naming-boundary decision"],
        completionCriteria: ["The public name represents the service, not a specific host forever.", "Management naming is not accidentally published as user ingress.", "TTL implications for a target change are understood."],
    },
    "DNS Resolution and Troubleshooting": {
        type: "practical",
        objective: "Diagnose DNS independently from TLS and application behavior, including cache/TTL effects during a controlled target change.",
        scenario: "Two clients disagree about where the Steward hostname points after a DNS change, while the service itself may still be healthy.",
        instructions: [
            "Query the Steward hostname through at least two independent resolvers and record answers plus TTLs.",
            "Query the authoritative path where practical and distinguish authoritative data from cached recursive answers.",
            "Use an IP/hosts-file override to test the intended gateway while bypassing DNS resolution only.",
            "Explain what the override proves and what it does not prove about certificate hostname validation.",
            "Record a DNS-specific recovery or wait decision instead of changing gateway/application configuration unnecessarily."
        ],
        deliverables: ["Multi-resolver evidence", "DNS-vs-service isolation evidence", "TTL/cache decision note"],
        completionCriteria: ["DNS is tested as its own dependency.", "A direct-IP test is not mistaken for a valid production HTTPS path.", "Cache behavior is incorporated into the diagnosis."],
    },
    "TLS Certificates and Certificate Authorities": {
        type: "practical",
        objective: "Establish an automated certificate lifecycle for the public Steward hostname at the Kong gateway boundary.",
        scenario: "Steward is ready for public HTTPS. A certificate that works only until its first expiry is not an operational solution.",
        instructions: [
            "Define the certificate subject/hostname requirements for the Steward public endpoint.",
            "Choose an ACME challenge approach compatible with the current DNS and gateway design.",
            "Document where certificate and private-key material are stored, which process can read them and which identities must not.",
            "Obtain or stage the certificate lifecycle and verify the complete chain and hostname from an external client.",
            "Document how renewal is automated and how you will prove a renewed certificate is actually loaded by the gateway."
        ],
        deliverables: ["TLS ownership model", "Certificate-chain evidence", "Renewal and reload procedure"],
        completionCriteria: ["The certificate matches the public Steward hostname.", "Private-key access is narrower than general application access.", "Renewal includes post-renewal verification rather than only a scheduled command."],
    },
    "HTTPS and TLS Termination": {
        type: "practical",
        objective: "Make Kong the Steward public TLS termination boundary while keeping the application backend on a private/local path.",
        scenario: "The enterprise progression needs one deliberate API edge. Kong should own public HTTP/TLS policy; Django should not become its own internet-facing gateway.",
        instructions: [
            "Configure the intended public 443 listener at Kong and route only the required Steward API service/path to the backend.",
            "Keep the Steward application listener local or on a tightly controlled private/container network.",
            "Configure the minimum trusted forwarded-header behavior required by Django and identify which source is allowed to supply those headers.",
            "Verify the certificate and one HTTPS request externally, then attempt direct external access to the backend port and prove it is denied.",
            "Compare Kong with a simpler NGINX reverse-proxy design and explain why Kong is retained here: later gateway policy, routing and enterprise API controls—not because NGINX is incapable of TLS proxying."
        ],
        deliverables: ["Kong TLS/service-route configuration", "External HTTPS evidence", "Denied backend-access evidence", "Kong-vs-NGINX decision"],
        completionCriteria: ["Kong is the public edge implementation.", "The backend cannot be reached directly from the public internet.", "Forwarded trust is scoped to the known gateway boundary."],
    },
    "Reverse Proxies": {
        type: "practical",
        objective: "Use Kong as the implemented Steward reverse-proxy/API-gateway edge and learn NGINX as a valid simpler alternative rather than building two competing public edges.",
        scenario: "The learner already understands reverse-proxy mechanics. The enterprise path now needs one authoritative public edge that can later carry gateway policy without duplicating infrastructure.",
        instructions: [
            "Model the reverse-proxy responsibility separately from the Steward application responsibility.",
            "Configure a Kong Service and Route for the current Steward backend using the narrowest useful public path.",
            "Stop the Steward backend deliberately and capture the gateway-visible failure; then restore it and verify recovery.",
            "Compare that failure with a closed public 443 path so the gateway layer and network layer remain distinguishable.",
            "Document which NGINX capabilities overlap with this design and which future Kong capabilities justify keeping Kong as the chosen implementation."
        ],
        deliverables: ["Kong service/route evidence", "Gateway failure/recovery evidence", "Reverse-proxy alternative comparison"],
        completionCriteria: ["Only one authoritative public reverse-proxy/gateway implementation is operated.", "Gateway failure is distinguished from transport failure.", "The technology choice is justified by the journey, not by fashion."],
    },
    "Ingress Concepts": {
        type: "practical",
        objective: "Define Steward ingress as a system role and place Kong correctly within it without prematurely adding Kubernetes ingress or managed load balancers.",
        scenario: "The public request path now contains DNS, provider filtering, host filtering, Kong and Steward. Additional ingress components should appear only when a requirement demands them.",
        instructions: [
            "Label each hop in the current public path as naming, routing, filtering, TLS/gateway or application handling.",
            "Identify the exact point where traffic first enters infrastructure you operate and the point where Kong becomes authoritative for application routing.",
            "List one requirement that Kong already solves and one requirement it does not solve by itself.",
            "Define a future condition that would justify a managed load balancer, Kubernetes/OpenShift ingress/router or global edge.",
            "Explicitly reject one unnecessary ingress component for the current single-VPS topology and explain the operational cost avoided."
        ],
        deliverables: ["Ingress responsibility map", "Current-vs-future edge decision", "Rejected-complexity rationale"],
        completionCriteria: ["Ingress is not equated to one product.", "Kong has a clear responsibility boundary.", "Future components are requirement-driven rather than preinstalled."],
    },
    "Internet-facing Firewalls": {
        type: "practical",
        objective: "Prove a default-deny public network policy where users reach Kong over HTTPS while management and backend services follow separate paths.",
        scenario: "Publishing Steward must not turn SSH, Django, PostgreSQL, Jenkins or Nexus into public internet services.",
        instructions: [
            "Create one matrix combining provider-firewall and Rocky firewalld intent for public, management and backend traffic.",
            "Allow the public HTTPS path to Kong and only the minimum optional HTTP path needed for redirect/ACME behavior.",
            "Keep SSH restricted according to the management design and keep Steward backend/database/CI/artifact ports non-public.",
            "From an external client prove HTTPS succeeds and at least two sensitive/non-public ports fail.",
            "Check for policy contradictions where one layer appears open only because another layer currently blocks the traffic."
        ],
        deliverables: ["Two-layer firewall matrix", "Allowed HTTPS evidence", "Denied sensitive-port evidence"],
        completionCriteria: ["Public-user and management access have different policies.", "Backend and platform administration ports are not internet-exposed.", "The learner understands the effective policy across both firewall layers."],
    },
    "Exposure, Attack Surface and Administrative Boundaries": {
        type: "practical",
        objective: "Minimize the final Steward internet attack surface before later Security Steward controls are introduced.",
        scenario: "The public API is now reachable. The next risk is assuming authentication makes every other service safe to expose as well.",
        instructions: [
            "Inventory every listening port on the VPS and classify it as public-user, management, internal/backend or unintended.",
            "Verify externally which of those ports are actually reachable rather than relying only on local listener output.",
            "Remove, rebind or firewall one unnecessary path if one exists.",
            "Confirm Jenkins, Nexus, PostgreSQL and direct Steward backend access remain outside the public-user path.",
            "Produce a boundary handoff for Security Steward that states what is public today, what is private, and which identities operate each boundary."
        ],
        deliverables: ["Exposure inventory", "Attack-surface reduction evidence", "Security-boundary handoff"],
        completionCriteria: ["Reachability is minimized before adding security tooling.", "Authentication is not used as justification for unnecessary public exposure.", "Later security work receives a clear, evidence-backed network boundary."],
    },
};

function alignEnterpriseEdge(lesson: Lesson): Lesson {
    if (lesson.title === "Lab: Publish Steward API with DNS and TLS") {
        return {
            ...lesson,
            activities: lesson.activities.map((activity) => {
                if (activity.content.type !== "practical") return activity;
                const instructions = activity.content.instructions.map((instruction) =>
                    instruction
                        .replace("TLS/reverse proxy", "TLS/Kong gateway")
                        .replace("reverse proxy", "Kong gateway")
                        .replace("Configure the reverse proxy and automated TLS certificate issuance.", "Configure Kong as the public gateway/TLS termination boundary and automate certificate issuance/renewal.")
                        .replace("stopped reverse proxy", "stopped Kong gateway")
                );
                return {
                    ...activity,
                    content: {
                        ...activity.content,
                        instructions,
                        deliverables: activity.content.deliverables.map((item) => item.replace("TLS/reverse-proxy configuration", "TLS/Kong gateway configuration")),
                    },
                };
            }),
        };
    }
    return lesson;
}

function enrichLesson(lesson: Lesson): Lesson {
    const aligned = alignEnterpriseEdge(lesson);
    const practice = practices[aligned.title];
    if (!practice) return aligned;
    const activities = aligned.activities.filter((activity) => !(activity.content.type === "practical" && activity.title.startsWith("Apply:")));
    return {
        ...aligned,
        activities: [
            ...activities,
            {
                id: `${aligned.id}-practice`,
                title: `${aligned.title}: Steward Network Investigation`,
                estimatedMinutes: 60,
                content: practice,
            },
        ],
    };
}

export const internetNetworkingQualityLessons: Lesson[] = internetNetworkingDeepLessons.map(enrichLesson);
