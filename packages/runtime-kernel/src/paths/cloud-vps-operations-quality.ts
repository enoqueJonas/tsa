import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { vpsOperationsDeepLessons } from "./cloud-vps-operations-deep";

const practices: Record<string, PracticalContent> = {
    "Choosing a Budget VPS": {
        type: "practical",
        objective: "Choose a VPS for Steward from measured workload, recovery and cost constraints rather than advertised instance labels.",
        scenario: "Steward now needs an internet-hosted environment, but oversizing the first server would hide the capacity decisions Cloud Engineer is meant to develop.",
        instructions: [
            "Measure or estimate the current Steward runtime memory, CPU, storage and transfer needs from the homelab baseline.",
            "Compare at least two credible VPS offers on region, vCPU model, RAM, disk, transfer, IPv4, snapshots/backups and rescue-console capability.",
            "Calculate the realistic monthly baseline including separately billed address or backup features.",
            "Reject one option explicitly and record which constraint makes it weaker.",
            "Choose the smallest credible option and define the observable threshold that would trigger resize, separation of a component or a different hosting model."
        ],
        deliverables: ["Steward capacity baseline", "VPS comparison and rejection evidence", "Selection and resize trigger"],
        completionCriteria: ["The selected size follows workload evidence rather than future-proofing guesswork.", "Recovery capability and total monthly cost are part of the decision.", "A rejected alternative is explained with concrete trade-offs."],
    },
    "Provisioning a Server": {
        type: "practical",
        objective: "Provision a Rocky Linux Steward VPS with a minimal, reviewable bootstrap contract that hands ongoing host state back to Ansible.",
        scenario: "The provider console can create a working server quickly, but one-off clicking and shell history must not become the authoritative infrastructure definition.",
        instructions: [
            "Write the intended region, Rocky Linux image/version, instance size, hostname, SSH key, networking and backup inputs before provisioning.",
            "Provision the VPS and record its provider resource ID, public/private addresses and operating-system identity.",
            "Connect with the intended administrative identity and capture the initial host baseline.",
            "List every manual bootstrap action performed and classify whether it is provider bootstrap, temporary access establishment or state Ansible should own.",
            "Reconcile the VPS with the existing Delivery Engineer inventory rather than creating a separate manual configuration path."
        ],
        deliverables: ["Provisioning contract", "Rocky Linux host identity evidence", "Bootstrap-to-Ansible ownership map"],
        completionCriteria: ["The server uses the established Rocky/RHEL-family baseline.", "Bootstrap is deliberately smaller than ongoing configuration management.", "Another engineer can identify exactly which host state is provider-created and which is Ansible-owned."],
    },
    "Public IP Addressing": {
        type: "practical",
        objective: "Trace Steward's inbound network path from public address to process listener and prove that reachability is intentionally different for public, management and backend traffic.",
        scenario: "The VPS has an internet-routable address, but that fact alone must not turn every listening socket into a public service.",
        instructions: [
            "Record the VPS IPv4/IPv6 and any private addresses plus the routes that make them usable.",
            "Inventory listening sockets and classify each as public application, private management, backend-only or accidental exposure.",
            "Trace one intended connection through provider firewall, Rocky firewalld and process bind address.",
            "From an external client, prove one allowed path and one deliberately denied path.",
            "Correct any listener or rule whose exposure does not match its classification, then repeat the test."
        ],
        deliverables: ["Address/listener map", "End-to-end path trace", "Allowed and denied external evidence"],
        completionCriteria: ["Public IP ownership is not confused with service exposure.", "Provider and host controls are distinguished.", "Backend-only services are not externally reachable."],
    },
    "Securing SSH Access": {
        type: "practical",
        objective: "Establish a recoverable, attributable SSH administration path without making the public VPS depend on shared or routine root credentials.",
        scenario: "SSH is currently the control plane for the VPS. Hardening it carelessly can cause lockout; leaving it permissive creates an oversized attack surface.",
        instructions: [
            "Create or verify a named administrative identity using its own SSH key and justified privilege escalation.",
            "Open a second tested session before changing sshd policy and inspect the effective configuration with sshd -T.",
            "Define and apply the direct-root and password-authentication policy, then prove the intended login still works.",
            "Attempt one login path that policy should reject and preserve the failure evidence.",
            "Verify the provider console/rescue route that can recover access if SSH becomes unavailable."
        ],
        deliverables: ["SSH identity/policy record", "Allowed and rejected authentication evidence", "Out-of-band recovery proof"],
        completionCriteria: ["Administrative access is attributable to an identity.", "A rejected path proves policy enforcement.", "Hardening does not rely on an untested lockout assumption."],
    },
    "Provider Firewalls and Security Controls": {
        type: "practical",
        objective: "Define the VPS outer network policy and prove how provider controls complement Rocky firewalld without duplicating rules blindly.",
        scenario: "Steward is not publicly published yet. The provider edge should expose only the administration path needed now while preserving a clear future HTTP/HTTPS boundary.",
        instructions: [
            "Write the minimum inbound/outbound policy required at this stage and the reason for every permitted rule.",
            "Apply provider-firewall rules and compare them with the existing firewalld policy on Rocky Linux.",
            "Prove the approved management path from an external client.",
            "Probe at least one unapproved port externally and preserve denial evidence.",
            "Remove any rule that exists only because an earlier troubleshooting attempt opened it temporarily."
        ],
        deliverables: ["Provider/host firewall matrix", "Positive reachability evidence", "Negative reachability evidence"],
        completionCriteria: ["Default-deny inbound behavior is demonstrable.", "Each enforcement layer has a clear purpose.", "Temporary troubleshooting exposure is not left behind."],
    },
    "OS Lifecycle and Patching": {
        type: "practical",
        objective: "Operate Rocky Linux patching as a controlled change with observable pre/post Steward health rather than an invisible maintenance command.",
        scenario: "The provider maintains the physical host, but the guest operating system remains your responsibility and can change underneath Steward when packages or kernels are updated.",
        instructions: [
            "Record the Rocky Linux release and support status and inspect pending updates with DNF.",
            "Classify the maintenance risk, including whether a reboot or service restart is expected.",
            "Capture pre-maintenance SSH, container/runtime and representative Steward behavior.",
            "Apply the approved updates using the documented host-management path and reboot if required.",
            "Repeat the same checks and investigate any difference before declaring maintenance successful."
        ],
        deliverables: ["Patch baseline", "Maintenance execution evidence", "Before/after Steward verification"],
        completionCriteria: ["Rocky/RHEL-family DNF operations replace stale Ubuntu apt assumptions.", "Patching is tied to a maintenance and verification decision.", "A reachable VM alone is not treated as proof Steward recovered."],
    },
    "Remote Recovery Concepts": {
        type: "practical",
        objective: "Prove one out-of-band recovery path for the Steward VPS before an actual lockout or boot failure makes it necessary.",
        scenario: "The server is remote and has no physical-access fallback. Provider console/rescue capability is therefore part of the operational design, not a feature to discover during an incident.",
        instructions: [
            "Document the provider console, serial or rescue mechanism and the authentication required to reach it.",
            "Choose a safe recoverable failure such as an intentionally invalid non-critical SSH include or temporary firewall rule.",
            "Predict the first symptom and the evidence that identifies the last-good/first-bad change.",
            "Use the out-of-band path to inspect and repair the condition without touching valuable Steward data.",
            "Verify normal SSH and Steward behavior afterward and update the recovery procedure with anything the drill exposed."
        ],
        deliverables: ["Recovery runbook", "Controlled failure evidence", "Out-of-band repair and normal-path verification"],
        completionCriteria: ["Recovery is exercised rather than merely described.", "The drill is safe and reversible.", "The final state is independently verified through the normal administration and application paths."],
    },
    "Backups and Snapshots": {
        type: "practical",
        objective: "Separate machine snapshots from application-aware backup and prove at least one restore path for Steward state.",
        scenario: "The VPS provider offers snapshots, but rebuilding a server and recovering PostgreSQL or other persistent Steward data are different recovery problems.",
        instructions: [
            "Inventory the state that would be lost if the VPS disappeared and classify host configuration, application artifact, database data and other persistence separately.",
            "Decide what a provider snapshot can recover and what requires application-aware backup.",
            "Create the chosen backup/snapshot evidence and record retention/location assumptions.",
            "Restore into an isolated target or otherwise perform a safe recovery drill rather than overwriting the active environment.",
            "Verify recovered Steward data or host state and record the measured recovery limitations."
        ],
        deliverables: ["Recovery-state inventory", "Snapshot-versus-backup decision", "Restore evidence and limitations"],
        completionCriteria: ["Snapshot and backup are not treated as synonyms.", "At least one recovery path is proven by restore evidence.", "The strategy identifies what cannot be recovered from the tested mechanism."],
    },
};

function alignRockyLinux(lesson: Lesson): Lesson {
    return {
        ...lesson,
        activities: lesson.activities.map((activity) => {
            if (activity.content.type !== "reading" || !activity.content.blocks) return activity;
            return {
                ...activity,
                content: {
                    ...activity.content,
                    blocks: activity.content.blocks.map((block) => {
                        if (block.type === "code" && block.caption === "Ubuntu patch baseline") {
                            return {
                                ...block,
                                caption: "Rocky Linux patch baseline",
                                code: "sudo dnf check-update || true\nsudo dnf updateinfo list --security || true\nsudo dnf upgrade --refresh",
                            };
                        }
                        return block;
                    }),
                },
            };
        }),
    };
}

function enrichLesson(lesson: Lesson): Lesson {
    const aligned = alignRockyLinux(lesson);
    const practice = practices[aligned.title];
    if (!practice) return aligned;
    return {
        ...aligned,
        activities: aligned.activities.map((activity) =>
            activity.content.type === "practical" && activity.title.startsWith("Apply:")
                ? { ...activity, title: `${aligned.title}: Steward VPS Investigation`, estimatedMinutes: 60, content: practice }
                : activity,
        ),
    };
}

export const vpsOperationsQualityLessons: Lesson[] = vpsOperationsDeepLessons.map(enrichLesson);
