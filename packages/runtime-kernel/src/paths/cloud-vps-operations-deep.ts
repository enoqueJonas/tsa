import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const digitalOceanDroplets: LearningResource = { title: "DigitalOcean Droplet documentation", url: "https://docs.digitalocean.com/products/droplets/" };
const linodeCompute: LearningResource = { title: "Akamai Cloud Computing documentation", url: "https://techdocs.akamai.com/cloud-computing/docs" };
const openssh: LearningResource = { title: "OpenSSH manual pages", url: "https://www.openssh.com/manual.html" };
const ubuntuSecurity: LearningResource = { title: "Ubuntu Server security documentation", url: "https://documentation.ubuntu.com/server/how-to/security/" };
const systemd: LearningResource = { title: "systemd manual", url: "https://www.freedesktop.org/software/systemd/man/latest/" };

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
    blocks.push({ type: "callout", tone: "steward", title: "Steward VPS checkpoint", body: "Treat the VPS as a real internet-connected Linux host, not as a remote development laptop. Reuse the Delivery Engineer artifact, configuration and release discipline, and keep provider controls, host controls and application controls visibly separate." });
    blocks.push({ type: "resources", title: "Continue learning", resources: spec.resources });

    return {
        id: `vps-operations-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `vps-operations-${spec.id}-001`, title: spec.title, estimatedMinutes: 40, content: { type: "reading", body: spec.intro, blocks } },
            {
                id: `vps-operations-${spec.id}-002`,
                title: `Apply: ${spec.title}`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective: `Apply ${spec.title} to the Steward VPS design.`,
                    scenario: "Steward has a working homelab delivery platform and a chosen remote-hosting direction. Build the remote host without bypassing the engineering controls already established.",
                    instructions: spec.practice,
                    deliverables: ["VPS engineering evidence", "Short operating decision note", "Successful and failure-path verification"],
                    completionCriteria: ["The decision is tied to concrete Steward requirements.", "Administrative access and exposure are explicit.", "The learner can explain the provider-versus-host responsibility boundary."],
                },
            },
            { id: `vps-operations-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: spec.questions.join("\n\n"), minimumCharacters: 180 } },
        ],
    };
}

const specs: LessonSpec[] = [
    {
        id: "choosing-budget-vps",
        title: "Choosing a Budget VPS",
        intro: "A budget VPS is a deliberate compromise between cost, control and provider capability. The cheapest instance is useful only if its region, resources, recovery options and networking are sufficient for the workload you intend to run.",
        sections: [
            { heading: "Start with the workload", paragraphs: ["For Steward, estimate memory for Linux, Docker, the API process and any colocated supporting services before comparing providers. Storage size, storage type, transfer allowance, IPv4 availability and snapshot pricing can matter as much as the advertised CPU count.", "Provider choice should also account for region proximity, console/recovery access, API quality, billing model and the ability to resize later."], list: ["CPU and memory sufficient for the current Steward workload.", "Persistent storage and snapshot capability.", "A region with acceptable latency to intended users.", "Predictable monthly cost and transfer assumptions.", "Provider console or rescue path for SSH failures.", "A clear upgrade path without redesigning the whole environment."] },
            { heading: "Shared CPU is still real capacity", paragraphs: ["Low-cost instances often share physical CPU resources. That is acceptable for a small learning and low-traffic Steward environment if performance expectations are modest. The engineering mistake is assuming marketing labels such as vCPU mean guaranteed dedicated throughput."] },
            { heading: "Do not buy future architecture", paragraphs: ["Choose the smallest credible instance for the current remote environment. Cloud Engineer will teach scaling and managed-service trade-offs later; purchasing an oversized server now hides the capacity reasoning the curriculum is trying to develop."] },
        ],
        practice: ["Compare at least two current VPS instance types that could host Steward.", "Record region, CPU, RAM, storage, transfer, IPv4, backups/snapshot options and estimated monthly cost.", "Choose one and state which measurable condition would trigger a resize or architecture change."],
        questions: ["Why is the lowest monthly price not enough to choose a VPS?", "Which Steward workload measurement would justify moving to a larger instance?"],
        resources: [digitalOceanDroplets, linodeCompute],
    },
    {
        id: "provisioning-server",
        title: "Provisioning a Server",
        intro: "Provisioning creates a provider resource, but a newly created VM is only the beginning of a usable server. A repeatable baseline must establish identity, operating system, administrative access and the state expected by later configuration automation.",
        sections: [
            { heading: "Provisioning inputs are architecture", paragraphs: ["Region, image, instance size, SSH keys, hostname, network attachment and backup settings define the first state of the VPS. Capture those values as engineering decisions rather than clicking through a provider console without a record."] },
            { heading: "Bootstrap versus configuration management", paragraphs: ["Keep bootstrap minimal. The provider may inject an SSH key or cloud-init data, but host packages, users, Docker prerequisites and Steward runtime state should remain in the configuration-management path already built in Delivery Engineer wherever practical."] },
            { heading: "Verify from the outside", paragraphs: ["After provisioning, verify provider status, assigned addresses and administrative connectivity. Record the exact host identity so later DNS, firewall and deployment evidence refer to the same machine."], code: { language: "bash", caption: "Initial host evidence", code: "hostnamectl\nip addr\nuname -a\ncat /etc/os-release" } },
        ],
        practice: ["Write the exact provisioning inputs for the chosen Steward VPS before creating it.", "Provision the server and record provider resource ID, hostname, region and IP addresses.", "Connect with the intended administrative identity and capture the operating-system baseline.", "Identify which remaining host state belongs in Ansible rather than one-off bootstrap commands."],
        questions: ["Why should bootstrap remain smaller than ongoing configuration management?", "Which provisioning values must remain stable enough for later DNS and deployment automation?"],
        resources: [digitalOceanDroplets, ubuntuSecurity],
    },
    {
        id: "public-ip-addressing",
        title: "Public IP Addressing",
        intro: "A public IP makes a host reachable through internet routing, but reachability is not the same as intended access. Cloud engineering requires knowing which address is externally routed, which services listen on it and which controls decide whether packets are accepted.",
        sections: [
            { heading: "Provider address versus host listener", paragraphs: ["The provider assigns or routes an address to the VPS, while the guest operating system exposes sockets. A service bound to 127.0.0.1 is not externally reachable even if the VM has a public IP; a service bound to 0.0.0.0 may be reachable if provider and host firewalls allow it."] },
            { heading: "IPv4 scarcity and IPv6", paragraphs: ["Public IPv4 addresses may be separately priced or limited. IPv6 provides a much larger address space but introduces its own routing and firewall considerations. Do not assume IPv6 exposure is harmless merely because you are focusing on IPv4 rules."] },
            { heading: "Inspect the complete path", paragraphs: ["When connectivity fails, distinguish address assignment, routing, provider firewall, host firewall and process listener rather than changing every layer at once."], code: { language: "bash", caption: "Inspect address and listeners", code: "ip addr\nip route\nss -lntp" } },
        ],
        practice: ["Record the Steward VPS public and private addresses if present.", "List every listening TCP socket and classify whether it should be local-only, administratively reachable or public application traffic.", "Test one intentionally allowed path and one intentionally denied path from an external client."],
        questions: ["Why does a public IP not automatically make every process reachable?", "Which layers can block an inbound request before it reaches Steward?"],
        resources: [ubuntuSecurity],
    },
    {
        id: "securing-ssh-access",
        title: "Securing SSH Access",
        intro: "SSH is the administrative control plane for a small VPS. Losing it can lock you out; exposing it carelessly creates a high-value attack path. Secure access therefore needs both strong authentication and a tested recovery route.",
        sections: [
            { heading: "Keys before passwords", paragraphs: ["Use key-based authentication for routine administration and avoid shared credentials. Each human or automation identity should have its own key material so access can be attributed and revoked independently.", "Do not disable the only working recovery path until a second session has proved the new configuration works."] },
            { heading: "Root access and privilege", paragraphs: ["A common baseline is to use a named administrative account and privilege escalation rather than routine direct root login. The important principle is accountability and least necessary privilege, not copying a hardening checklist without understanding the recovery implications."] },
            { heading: "Verify effective SSH configuration", paragraphs: ["Inspect the server's effective sshd configuration, not only the file you edited. Configuration includes files may alter the final result."], code: { language: "bash", caption: "Inspect SSH state", code: "sudo sshd -T | grep -E 'passwordauthentication|permitrootlogin|pubkeyauthentication'\nsudo systemctl status ssh" } },
        ],
        practice: ["Create or confirm a named administrative account with key-based SSH access.", "Prove a second session works before changing authentication policy.", "Document direct-root and password-authentication policy and justify each choice.", "Verify the provider console or rescue path that would recover from an SSH misconfiguration."],
        questions: ["Why is testing a second SSH session before closing the first operationally important?", "Why should administrative identities not share one SSH private key?"],
        resources: [openssh, ubuntuSecurity],
    },
    {
        id: "provider-firewalls",
        title: "Provider Firewalls and Security Controls",
        intro: "Provider firewalls filter traffic before it reaches the guest operating system. They complement host firewalls rather than replacing them, and their value comes from making the outer network policy explicit.",
        sections: [
            { heading: "Two different enforcement points", paragraphs: ["A provider firewall is configured in the cloud control plane; a host firewall is enforced inside Linux. Keeping both lets you reduce exposure even if one configuration is accidentally weakened, but duplicated rules must remain understandable."] },
            { heading: "Default-deny inbound", paragraphs: ["For the Steward VPS, public inbound traffic should be limited to what the current stage actually needs. SSH may be restricted to a known administrative source where practical, while HTTP/HTTPS exposure is introduced deliberately in the later Internet Networking module."] },
            { heading: "Prove denial", paragraphs: ["A firewall configuration screenshot is weaker evidence than a network test. Verify both an allowed administrative path and a blocked port from outside the provider network."] },
        ],
        practice: ["Define the minimum provider-firewall rules required before Steward is publicly published.", "Apply the rules and record source ranges, protocols and ports.", "Test the intended SSH path from an external client.", "Test an unapproved port and preserve the rejection/timeout evidence."],
        questions: ["Why keep a host firewall if the provider already offers one?", "What evidence demonstrates that a denied path is actually denied?"],
        resources: [digitalOceanDroplets, ubuntuSecurity],
    },
    {
        id: "os-lifecycle-patching",
        title: "OS Lifecycle and Patching",
        intro: "A VPS gives you a server, not an automatically maintained operating system. Package updates, security fixes, reboots and distribution lifecycle remain customer responsibilities unless a managed service explicitly takes them over.",
        sections: [
            { heading: "Know the support window", paragraphs: ["Choose a maintained distribution release and know when standard support ends. An old image that still boots is not an acceptable long-term platform merely because the application starts."] },
            { heading: "Patching is a controlled change", paragraphs: ["Updates can change kernels, libraries and service behavior. Record when patching occurs, identify reboot requirements and preserve a way to verify Steward afterward. Automation should reduce repetition without turning updates into invisible mutations."] },
            { heading: "Inspect pending state", paragraphs: ["Package-manager output and reboot indicators provide evidence of host state."], code: { language: "bash", caption: "Ubuntu patch baseline", code: "sudo apt update\napt list --upgradable\ntest -f /var/run/reboot-required && cat /var/run/reboot-required || true" } },
        ],
        practice: ["Record the VPS distribution version and support status.", "List available updates and classify whether the host needs immediate security maintenance.", "Apply updates through a documented maintenance procedure.", "Verify SSH, Docker and Steward runtime behavior after patching and after any required reboot."],
        questions: ["Why is OS patching still your responsibility on an ordinary VPS?", "What should be verified after a host reboot besides 'the VM is online'?"],
        resources: [ubuntuSecurity, systemd],
    },
    {
        id: "remote-recovery",
        title: "Remote Recovery Concepts",
        intro: "Remote infrastructure changes the failure model because physical access is unavailable. Recovery must account for broken SSH, boot failures, firewall mistakes and configuration changes that prevent the normal administrative path from working.",
        sections: [
            { heading: "Out-of-band control", paragraphs: ["Provider consoles, rescue environments, serial consoles and recovery modes are independent of normal SSH access. They are not substitutes for correct administration; they are the path used when normal administration is unavailable."] },
            { heading: "Recovery starts before failure", paragraphs: ["Know how to enter recovery mode, where important configuration lives and how to identify the last change before you need those steps. A recovery feature you have never located or tested is an assumption, not a capability."] },
            { heading: "Prefer reversible experiments", paragraphs: ["When changing SSH, firewall or boot-critical configuration, keep a known-good session open and make one controlled change at a time. This preserves evidence about which change caused the loss of access." ] },
        ],
        practice: ["Document the provider's console or rescue mechanism for the Steward VPS.", "Identify the steps you would use to recover from a broken SSH configuration and from an overly restrictive host firewall.", "Perform a safe recovery-path drill that does not intentionally corrupt persistent Steward data.", "Record the last-good/first-bad evidence used during the drill."],
        questions: ["Why is provider-console access considered out-of-band relative to SSH?", "What makes a recovery path proven rather than merely documented?"],
        resources: [digitalOceanDroplets, linodeCompute],
    },
    {
        id: "backups-snapshots",
        title: "Backups and Snapshots",
        intro: "Snapshots and backups can both preserve state, but they solve different recovery problems. A machine snapshot is convenient for whole-server recovery while an application-aware backup may be more appropriate for PostgreSQL or other persistent data.",
        sections: [
            { heading: "Snapshot is infrastructure state", paragraphs: ["A provider snapshot usually captures virtual disk state at a point in time. It can recreate a server image quickly, but application consistency depends on what was happening when the snapshot was taken."] },
            { heading: "Backup is defined by recovery objective", paragraphs: ["A backup strategy starts with what must be recovered: database rows, configuration, repository data or an entire host. The useful evidence is a successful restore into a safe target, not the existence of a scheduled backup job."] },
            { heading: "Do not confuse replication with backup", paragraphs: ["A copied disk or highly available volume can reproduce accidental deletion just as efficiently as the original. Recovery requires retained historical state and a tested restore procedure."] },
        ],
        practice: ["Inventory persistent Steward state on the VPS and classify what requires application-aware backup versus host-level snapshot.", "Configure the minimum provider snapshot/backup capability justified by the current stage.", "Perform one safe restore test to a temporary target or isolated location.", "Record restore duration, recovered identity/state and cleanup of temporary paid resources."],
        questions: ["Why can a VM snapshot be insufficient as a PostgreSQL backup strategy?", "What evidence proves a backup is usable?"],
        resources: [digitalOceanDroplets, ubuntuSecurity],
    },
];

const stewardVpsLab: Lesson = {
    id: "vps-operations-steward-vps-lab",
    title: "Lab: Provision the Steward VPS",
    activities: [
        {
            id: "vps-operations-steward-vps-lab-001",
            title: "VPS Build Plan",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Define the remote Steward host before provisioning it.",
                scenario: "Cloud and Hosting Models selected a budget-conscious remote hosting direction. Convert that decision into one explicit Linux-host design without skipping provider, access, cost or recovery constraints.",
                instructions: ["Choose provider, region, instance size and OS using the previous hosting decision evidence.", "Define public/private addressing and the minimum provider-firewall policy.", "Define the administrative SSH identity, key strategy and provider-console recovery route.", "Define which host state will be applied by Ansible and which small bootstrap steps remain provider-side.", "Define snapshot/backup expectations and a monthly cost ceiling."],
                deliverables: ["VPS build plan", "Administrative-access design", "Network/firewall baseline", "Backup and cost assumptions"],
                completionCriteria: ["The server size is justified by current Steward needs.", "Normal and recovery administrative paths are explicit.", "No public application port is opened merely for convenience."],
            },
        },
        {
            id: "vps-operations-steward-vps-lab-002",
            title: "Provision and Configure the Host",
            estimatedMinutes: 180,
            content: {
                type: "practical",
                objective: "Provision the VPS and converge it to a repeatable Steward host baseline.",
                scenario: "Use provider provisioning for the machine and reuse the Delivery Engineer configuration-management work for ongoing host state.",
                instructions: ["Provision the VPS and capture provider resource identity, region and assigned addresses.", "Establish a named key-based administrative account and verify recovery access before tightening SSH policy.", "Apply the provider firewall and host firewall boundaries.", "Run the existing Ansible role/playbook, adapting inventory and variables only where the remote environment genuinely differs.", "Patch the operating system through the documented maintenance path.", "Record a second idempotent Ansible run and explain any remaining changes."],
                deliverables: ["Provisioned VPS evidence", "SSH and firewall evidence", "Ansible run output", "OS lifecycle baseline"],
                completionCriteria: ["The VPS can be administered without a shared password.", "Host configuration is reproducible rather than shell-history dependent.", "A second configuration run is clean or every remaining change is explained."],
            },
        },
        {
            id: "vps-operations-steward-vps-lab-003",
            title: "Deploy Steward from the Existing Release Path",
            estimatedMinutes: 150,
            content: {
                type: "practical",
                objective: "Deploy a known Steward release to the VPS without rebuilding it on the server.",
                scenario: "The Delivery Engineer school already produced immutable Steward artifacts and a release process. The VPS must become a new deployment target for that process, not a manual copy of the application source tree.",
                instructions: ["Select one known Steward release and record source commit, CI run and Nexus image digest.", "Give the VPS read-only access required to consume the release artifact.", "Deploy the exact image through the existing deployment automation or runbook.", "Verify the running artifact identity and application health from an administrative path.", "Do not publish the service broadly to the internet yet; DNS/TLS/public application exposure belongs to Internet Networking."],
                deliverables: ["Release identity", "Remote deployment evidence", "Runtime health evidence", "Explicit exposure boundary"],
                completionCriteria: ["The VPS does not build Steward from source.", "The running image resolves to the known Nexus artifact.", "Application exposure remains limited to the current curriculum boundary."],
            },
        },
        {
            id: "vps-operations-steward-vps-lab-004",
            title: "Recovery and Handoff",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Prove the remote host can be recovered and hand it to the Internet Networking module.",
                scenario: "Before making Steward publicly reachable, prove that administration, host recovery and persistent-state assumptions are known.",
                instructions: ["Exercise one safe remote-recovery scenario using provider console/rescue access or an equivalent documented drill.", "Perform one snapshot or backup restore test in an isolated target where practical.", "Verify Steward is still deployable and administratively reachable afterward.", "Record the exact public address, intended future DNS name, currently allowed ports and ports deliberately deferred.", "Record current monthly run-rate and remove temporary recovery resources that would continue billing."],
                deliverables: ["Recovery drill evidence", "Restore evidence", "Internet Networking handoff", "Current cost record"],
                completionCriteria: ["Administrative recovery does not depend solely on SSH working.", "At least one backup/snapshot path has been restored safely.", "The next module receives a known host/network baseline rather than an undocumented server."],
            },
        },
        {
            id: "vps-operations-steward-vps-lab-005",
            title: "VPS Operations Review",
            estimatedMinutes: 30,
            content: {
                type: "reflection",
                prompt: "If SSH stopped working on the Steward VPS tonight, what exact independent control path would you use, what evidence tells you the host you recover is the correct one, and which parts of Steward could be reconstructed from versioned automation versus restored persistent state?\n\nWhich port or service should remain intentionally unexposed until the Internet Networking module, and why?",
                minimumCharacters: 250,
            },
        },
    ],
};

export const vpsOperationsDeepLessons: Lesson[] = [...specs.map(richLesson), stewardVpsLab];
