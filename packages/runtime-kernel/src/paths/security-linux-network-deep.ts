import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const linuxSecurity: LearningResource = { title: "Linux Security Hardening", url: "https://www.cyberciti.biz/tips/linux-security.html" };
const openssh: LearningResource = { title: "OpenSSH Manual", url: "https://man.openbsd.org/sshd_config" };
const cisLinux: LearningResource = { title: "CIS Benchmarks", url: "https://www.cisecurity.org/cis-benchmarks" };
const mozillaTls: LearningResource = { title: "Mozilla SSL Configuration Generator", url: "https://ssl-config.mozilla.org/" };

type Spec = {
    id: string;
    title: string;
    intro: string;
    principles: string[];
    steward: string[];
    practice: string[];
    reflection: string;
    warning?: string;
};

function blocksFor(spec: Spec): LessonBlock[] {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.intro },
        { type: "heading", id: `${spec.id}-principles`, text: "Core principles", level: 2 },
        { type: "list", items: spec.principles },
        { type: "heading", id: `${spec.id}-steward`, text: "Apply it to Steward", level: 2 },
        ...spec.steward.map((text): LessonBlock => ({ type: "paragraph", text })),
    ];

    if (spec.warning) {
        blocks.push({ type: "callout", tone: "warning", title: "Operational risk", body: spec.warning });
    }

    blocks.push({
        type: "callout",
        tone: "steward",
        title: "Stewardship checkpoint",
        body: "Host and network security should reduce reachable attack paths without making the system unmaintainable. Every hardening decision should preserve a documented administrative path, observable evidence and a recovery plan.",
    });
    blocks.push({ type: "resources", title: "Continue learning", resources: [linuxSecurity, openssh, cisLinux, mozillaTls] });
    return blocks;
}

function lessonFrom(spec: Spec): Lesson {
    return {
        id: `linux-and-network-security-${spec.id}`,
        title: spec.title,
        activities: [
            {
                id: `linux-and-network-security-${spec.id}-001`,
                title: spec.title,
                estimatedMinutes: 45,
                content: { type: "reading", body: spec.intro, blocks: blocksFor(spec) },
            },
            {
                id: `linux-and-network-security-${spec.id}-002`,
                title: `Harden: ${spec.title}`,
                estimatedMinutes: 55,
                content: {
                    type: "practical",
                    objective: `Apply ${spec.title} to the learner-controlled Steward environment.`,
                    scenario: "Work only on the learner-managed Steward hosts and lab network. Record the before state, change one control intentionally, verify access and service behavior, and retain a recovery path before closing administrative access.",
                    instructions: spec.practice,
                    deliverables: ["Before/after security evidence", "Configuration or command evidence", "Verification and recovery note"],
                    completionCriteria: ["The control reduces a named Steward threat or exposure.", "Legitimate service and administrative behavior is retested.", "The learner can explain how to recover if the change locks out access or breaks service."],
                },
            },
            {
                id: `linux-and-network-security-${spec.id}-003`,
                title: `Knowledge Check: ${spec.title}`,
                estimatedMinutes: 10,
                content: { type: "reflection", prompt: spec.reflection, minimumCharacters: 200 },
            },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "users-groups-permissions",
        title: "Users, Groups and Permissions",
        intro: "Linux access control begins with identities, groups and ownership. Secure administration depends on separating human accounts from service accounts and granting only the file, process and device access each role actually needs.",
        principles: ["Use named human accounts rather than shared administrator identities.", "Run services under dedicated non-login accounts.", "Use groups to express shared responsibility deliberately.", "Treat ownership and mode bits as part of the application security boundary."],
        steward: ["Steward API, PostgreSQL, reverse proxy and automation identities should not all share one operating-system account.", "Configuration, logs, package caches and deployment directories should be owned by the identity that needs them, not made broadly writable to avoid permission errors."],
        practice: ["Inventory human and service accounts on the Steward host.", "Map each service to its effective user and groups.", "Find world-writable or unexpectedly group-writable Steward paths.", "Correct one unjustified permission and verify service behavior."],
        reflection: "Why is running Steward components under one convenient shared account dangerous even when the server is not internet-facing?",
    },
    {
        id: "privilege-sudo",
        title: "Privilege and sudo",
        intro: "Administrative privilege should be temporary, attributable and scoped. sudo is safer than permanent root usage only when policies are narrow enough to preserve meaningful separation.",
        principles: ["Avoid routine interactive work as root.", "Grant commands or roles, not blanket privilege, where practical.", "Require attribution for administrative actions.", "Review inherited group membership and sudo rules regularly."],
        steward: ["A Steward operator may need to restart a service without needing unrestricted access to database files or repository credentials.", "CI identities should not gain host-level sudo merely because deployment automation is easier that way."],
        practice: ["Review sudo-capable users and groups.", "Identify one task that currently requires excessive privilege.", "Define a narrower operational path for that task.", "Verify both allowed and denied behavior."],
        reflection: "Explain the difference between controlled privilege escalation and simply giving an operator permanent root capability.",
    },
    {
        id: "ssh-hardening",
        title: "SSH Hardening",
        intro: "SSH is often the highest-value administrative entry point on a Linux host. Hardening means controlling who can connect, how they authenticate, from where, and how failures are observed without accidentally destroying the only recovery path.",
        principles: ["Prefer key-based authentication for administration.", "Disable direct root login when a tested alternative exists.", "Restrict reachable users and sources where appropriate.", "Test a second session before closing the current administrative connection."],
        steward: ["Steward homelab hosts should expose SSH only where administration requires it, with named users and auditable keys.", "Changing sshd settings is operationally sensitive: a secure configuration that strands the operator is still a failed engineering change."],
        practice: ["Capture the current SSH authentication and root-login settings.", "Establish and verify key-based access.", "Apply one justified sshd hardening change.", "Open a new session before closing the old one and document recovery access."],
        reflection: "Why should SSH hardening be treated as both a security change and a reliability change?",
        warning: "Never disable the current authentication path until an independent replacement path has been verified from a separate session or console."],
    },
    {
        id: "host-firewalls",
        title: "Host Firewalls",
        intro: "A host firewall constrains which network paths are allowed to reach local services. It complements, rather than replaces, network segmentation and secure service configuration.",
        principles: ["Start from required flows rather than a generic port list.", "Prefer explicit allow rules and a constrained default posture.", "Consider source as well as destination port.", "Verify rules from the perspective of both permitted and denied clients."],
        steward: ["Steward may require public HTTPS, private PostgreSQL access and restricted SSH. Those are three different trust relationships and should not receive identical exposure.", "A database bound privately but reachable through an overly broad host firewall is still unnecessarily exposed."],
        practice: ["Create a required-flow table for Steward.", "Inspect current listening ports and firewall rules.", "Remove or constrain one unnecessary reachable path.", "Verify expected allow and deny cases from another host or namespace."],
        reflection: "Why is opening port 5432 only because PostgreSQL uses it weaker reasoning than defining exactly which Steward component should be able to reach PostgreSQL?",
    },
    {
        id: "service-exposure",
        title: "Service Exposure",
        intro: "A running service becomes an attack surface when it listens on an interface or socket reachable by actors who do not need it. Reducing exposure is often safer than trying to harden every unnecessary endpoint.",
        principles: ["Inventory what is listening before assuming what is exposed.", "Bind administrative and data services to the narrowest useful interface.", "Remove or disable unused daemons.", "Distinguish local-only, internal and public services."],
        steward: ["PostgreSQL, internal metrics, development servers and administrative dashboards should not inherit public exposure merely because the host has a public interface.", "Reverse proxying can create a deliberate public boundary while keeping application workers on loopback or an internal network."],
        practice: ["Enumerate listening TCP and UDP sockets.", "Classify every Steward-related listener as public, internal, local or unnecessary.", "Constrain one overexposed listener.", "Retest application connectivity after the change."],
        reflection: "Explain why removing an unnecessary listener can be a stronger security control than adding authentication to it.",
    },
    {
        id: "patching-windows",
        title: "Patching and Vulnerability Windows",
        intro: "Patching reduces exposure to known vulnerabilities, but production-minded patching also considers compatibility, restart requirements, rollback and the time between disclosure and remediation.",
        principles: ["Know which packages and kernels are security-relevant.", "Separate update availability from successful remediation.", "Test restart and rollback requirements.", "Track exceptions instead of silently deferring updates."],
        steward: ["A patched package that has not been loaded because the service was never restarted may leave Steward exposed.", "Repository, reverse-proxy, PostgreSQL and runtime updates can have different maintenance risks and should be handled intentionally."],
        practice: ["Identify pending security updates on a Steward host.", "Choose one update and document expected restart/compatibility impact.", "Apply it in the learner environment.", "Verify the new version, service health and whether reboot/restart is still required."],
        reflection: "Why is 'apt upgrade completed' insufficient evidence that a vulnerability window is closed?",
    },
    {
        id: "file-secret-permissions",
        title: "File and Secret Permissions",
        intro: "Secrets frequently leak through ordinary filesystem mistakes: permissive environment files, copied credentials, readable backups, shell histories and deployment artifacts.",
        principles: ["Minimize which identities can read secret-bearing files.", "Keep secrets out of source-controlled and broadly readable paths.", "Treat backups and generated files as potential secret copies.", "Rotate credentials when exposure cannot be confidently ruled out."],
        steward: ["Database passwords, JWT signing material, Nexus credentials and CI/deployment tokens should not be readable by unrelated service accounts or normal users.", "A correctly permissioned source file does not help if a backup or generated `.env` copy is world-readable."],
        practice: ["Locate Steward secret-bearing files without printing their values.", "Inspect ownership and modes.", "Find duplicate or stale copies.", "Correct one permission issue and document whether credential rotation is warranted."],
        reflection: "Why should secret-file assessment include copies, backups and generated artifacts rather than only the application's primary configuration file?",
    },
    {
        id: "logging-auditing",
        title: "Security Logging and Auditing",
        intro: "Host security depends on being able to reconstruct significant actions: logins, privilege use, service changes, failures and suspicious access attempts. Logs become security evidence only when they are sufficiently attributable and retained.",
        principles: ["Capture authentication and privilege events.", "Preserve timestamps and identity context.", "Know which logs are local-only and what happens if the host is compromised.", "Avoid collecting secrets in logs while preserving investigative value."],
        steward: ["Steward host evidence should connect SSH access, sudo actions, service lifecycle events and application/security findings where possible.", "Later Reliability Engineer work may centralize telemetry, but Security Steward should already understand which host events matter."],
        practice: ["Locate SSH, sudo and service-management events for Steward.", "Perform one authorized administrative action and trace its evidence.", "Identify one important event that is currently hard to attribute.", "Propose or apply an audit/logging improvement."],
        reflection: "What would you need in the logs to determine who restarted Steward, when they did it and whether privilege escalation was involved?",
    },
    {
        id: "segmentation",
        title: "Network Segmentation Concepts",
        intro: "Segmentation limits which systems can directly communicate, reducing lateral movement and making trust relationships explicit. Good segmentation is based on required flows rather than arbitrary subnet count.",
        principles: ["Group systems by trust and communication requirements.", "Allow necessary flows across boundaries and deny unrelated paths.", "Do not treat a subnet as automatically trusted.", "Use segmentation together with identity and host controls."],
        steward: ["Public ingress, application services, PostgreSQL, internal repositories and administrative access do not all need unrestricted east-west connectivity.", "Even a small homelab can model segmentation through VLANs, VM networks, firewall zones or isolated container networks."],
        practice: ["Draw Steward network zones and required cross-zone flows.", "Identify one lateral path that is broader than required.", "Model or implement a narrower boundary.", "Verify that intended application traffic still succeeds."],
        reflection: "Why is 'internal network' not a sufficient security boundary for Steward?",
    },
    {
        id: "admin-boundaries",
        title: "Administrative Network Boundaries",
        intro: "Administrative interfaces deserve stronger isolation than ordinary application traffic because they often bypass or modify controls protecting the rest of the system.",
        principles: ["Separate management reachability from public service reachability.", "Restrict administrative sources and identities.", "Avoid exposing dashboards or database administration ports directly to the internet.", "Document emergency access rather than creating hidden permanent bypasses."],
        steward: ["SSH, database administration, Nexus administration and future observability administration should have explicit management paths.", "An administrator authenticated to Steward's web application is not automatically trusted to administer the operating system or artifact repository."],
        practice: ["Inventory Steward administrative interfaces.", "Classify who needs each interface and from where.", "Constrain one administrative path to a management boundary.", "Document normal and emergency access."],
        reflection: "Why should application administrator privilege and infrastructure administrator reachability remain separate concepts?",
    },
    {
        id: "tls-certificates",
        title: "TLS Configuration and Certificate Hygiene",
        intro: "TLS protects data in transit only when endpoints use trusted certificates, current protocol settings, correct names and operationally managed renewal. Encryption alone does not prove the peer is the intended system.",
        principles: ["Use certificates whose identity matches the service name.", "Disable obsolete protocol/cipher configurations where supported.", "Track expiry and renewal as operational controls.", "Verify certificate chains and hostname validation from the client perspective."],
        steward: ["Steward's public HTTPS endpoint, internal repository and other internal TLS services can each have different trust chains, but clients should still verify the intended peer.", "Internal does not justify permanently bypassing certificate verification."],
        practice: ["Inspect the certificate and protocol characteristics of a Steward TLS endpoint.", "Verify hostname, chain and expiry.", "Identify one weak or operationally fragile TLS property.", "Improve it where practical and retest from a client."],
        reflection: "Why does encrypting a connection with a certificate that clients do not correctly verify still leave a meaningful security gap?",
    },
];

const lab: Lesson = {
    id: "linux-and-network-security-steward-hardening-lab",
    title: "Lab: Harden the Steward Hosts and Network Path",
    activities: [
        {
            id: "linux-and-network-security-steward-hardening-lab-001",
            title: "Baseline Host and Exposure",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Create an evidence-based security baseline for the learner-controlled Steward host and network path.",
                scenario: "Use the actual Steward homelab or VM environment. Connect findings back to the Security Foundations inventory, threat model and vulnerability work instead of inventing unrelated hardening tasks.",
                instructions: ["Inventory users, groups, sudo capability, service identities and secret-bearing paths.", "Enumerate listeners, firewall rules, network zones and administrative interfaces.", "Inspect SSH, patch state, logging and TLS characteristics.", "Map each material exposure to a named threat or asset."],
                deliverables: ["Host security baseline", "Network-flow/exposure map", "Prioritized hardening backlog"],
                completionCriteria: ["The baseline reflects observed state.", "Findings are traceable to real Steward assets or boundaries.", "The backlog prioritizes risk rather than benchmark score alone."],
            },
        },
        {
            id: "linux-and-network-security-steward-hardening-lab-002",
            title: "Implement and Verify Hardening",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Reduce Steward host and network attack surface without losing maintainability or recovery capability.",
                scenario: "Select the highest-value controls that are safe to implement in the learner environment and change them incrementally.",
                instructions: ["Harden identities/permissions and at least one administrative path.", "Constrain unnecessary service or network exposure.", "Apply justified SSH, firewall, patching or TLS improvements.", "Verify application functionality, administration and recovery after each control."],
                deliverables: ["Hardening change set", "Before/after evidence", "Functional and administrative retest evidence"],
                completionCriteria: ["Controls reduce named attack paths.", "Expected Steward behavior still works.", "Administrative recovery remains documented and tested where feasible."],
            },
        },
        {
            id: "linux-and-network-security-steward-hardening-lab-003",
            title: "Close Findings and Record Residual Risk",
            estimatedMinutes: 75,
            content: {
                type: "practical",
                objective: "Turn host/network hardening into durable Security Steward evidence.",
                scenario: "Update the existing security artifacts so later Container/Delivery Security and the final milestone inherit verified state rather than assumptions.",
                instructions: ["Mark each selected finding as mitigated, partially mitigated, accepted or deferred.", "Attach retest evidence and ownership.", "Record residual risk and operational trade-offs.", "Identify controls that should later become automated configuration, monitoring or regression checks."],
                deliverables: ["Updated security findings", "Residual-risk register", "Hardening evidence package", "Follow-up automation candidates"],
                completionCriteria: ["Status claims are evidence-backed.", "Residual risk is explicit.", "Outputs are reusable by later Security Steward modules."],
            },
        },
    ],
};

export const linuxAndNetworkSecurityDeepLessons: Lesson[] = [...specs.map(lessonFrom), lab];
