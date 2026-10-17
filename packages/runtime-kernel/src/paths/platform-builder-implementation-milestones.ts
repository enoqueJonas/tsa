import type { AuthoredLesson } from "./normalize-authored-curriculum";

function milestone(id: string, title: string, objective: string, scenario: string, instructions: string[], deliverables: string[], completionCriteria: string[]): AuthoredLesson {
    const walkthroughs: Record<string, string> = {
        "core-infrastructure-operated-services-milestone": "Start with a client whose address, gateway, resolver and clock are known. Draw the dependency chain: DHCP supplies address/gateway/resolver settings; DNS resolves the Steward name; Chrony supplies time synchronization. Record successful dig, route, lease and chronyc observations before injecting exactly one lab failure. A healthy DNS server alone does not prove the client is using it. Recover the failed service and repeat the original client operation.",
        "os-lifecycle-operated-fleet-milestone": "Treat the release as a staged change: capture package/kernel versions and service health; identify vendor advisory, dependency impact and rollback checkpoint; patch a disposable canary VM; observe whether a restart or reboot is needed; run the exact pre-change health request again; then either accept or restore. Installed kernel and running kernel can differ. Do not claim recovery without a tested restore or rollback path.",
        "windows-mixed-estate-operated-milestone": "Draw the trust and dependency boundaries among Windows identity, AD DS, DNS, time, SMB and the Steward consumer. Test name resolution, domain identity, file access allowed and denied, and application-visible health separately. A successful domain join does not prove share authorization; a running Windows service does not prove its endpoint responds. Capture event logs and reproduce one controlled failure before recovery.",
    };
    const walkthrough = walkthroughs[id];
    if (!walkthrough) throw new Error(`Unknown Platform Builder milestone: ${id}`);
    return { id, title, activities: [
        { type: "reading", title: `${title}: worked verification sequence`, description: walkthrough },
        { type: "practical", title, objective, scenario, instructions, deliverables, completionCriteria },
    ] };
}

export const coreInfrastructureImplementationMilestone = milestone(
    "core-infrastructure-operated-services-milestone",
    "Milestone: Operate DNS, DHCP and Time as Homelab Infrastructure",
    "Prove DNS, DHCP and time work together as real dependencies of the homelab and recover correctly after failure.",
    "The individual services are configured. The milestone must prove that representative Proxmox/Rocky/Steward consumers actually depend on them and can be diagnosed without hidden hosts-file/manual state.",
    ["Capture the authoritative DNS, controlled DHCP and time-source topology.", "Provision or reboot a disposable client and prove intended addressing, DNS resolution and time synchronization.", "Resolve and reach representative homelab services by name.", "Execute one DNS failure, one DHCP/options failure and one bounded time-skew failure using the established safe labs.", "Recover each dependency and verify the consumer path afterward.", "Produce the core-infrastructure operations and bootstrap runbook."],
    ["Integrated service topology", "Consumer evidence", "Three failure/recovery records", "Bootstrap and operations runbook"],
    ["Representative consumers use the services rather than simulated documentation only.", "DNS, DHCP and time failures are distinguished by evidence.", "The environment recovers without undocumented hosts-file/manual fixes."],
);

export const osLifecycleImplementationMilestone = milestone(
    "os-lifecycle-operated-fleet-milestone",
    "Milestone: Patch and Recover the Rocky Fleet",
    "Execute a complete staged maintenance cycle across the learner-operated Rocky fleet.",
    "Patch management is useful only when a real fleet can move from known pre-change state through canary maintenance, reboot/verification and recovery with evidence.",
    ["Generate the timestamped pre-maintenance fleet posture report through the existing Ansible workflow, including installed versus running kernels, pending updates, and advisory-metadata limitations.", "Inspect and approve a real supported update set before changing the canary Rocky guest; if no supported updates are pending, record the no-change finding and defer the live patch execution rather than manufacturing a downgrade or calling a no-op a completed rollout.", "When a real update is available, patch one canary Rocky guest, handle required reboot and verify platform/workload health.", "Continue to at least one additional guest only after the canary passes; record the fail-closed decision if it does not.", "For an actual update, diagnose a controlled regression in a disposable canary and verify recovery. If no update is available, perform and label a separate safe fault-injection drill; never present it as a post-update incident.", "Verify running kernels and application/dependency health after maintenance.", "Publish the maintenance record and next-window posture."],
    ["Fleet pre-maintenance report", "Canary-to-fleet patch evidence", "Reboot/kernel verification", "Regression/recovery evidence", "Maintenance record"],
    ["At least two hosts pass through the staged workflow when supported updates are available; otherwise the live-rollout gate remains explicitly incomplete, with genuine no-update evidence retained.", "A failed health gate blocks wider rollout.", "Recovery is executed and verified rather than merely described."],
);

export const windowsEnterpriseImplementationMilestone = milestone(
    "windows-mixed-estate-operated-milestone",
    "Milestone: Build and Operate the Mixed Windows/Linux Estate",
    "Prove the bounded Windows estate works as an integrated enterprise boundary rather than a collection of isolated Windows exercises.",
    "The lab now has Windows Server, PowerShell administration, AD/DNS, policy and Linux interoperability. The milestone must prove those pieces work together and fail in diagnosable ways.",
    ["Capture the Windows Server/domain, separate member, Rocky, DNS and file-service topology using synthetic identities only; a domain controller alone cannot provide evidence of policy applying across a separate member boundary.", "If a legally available disposable Windows member is not yet available, record the resource/licensing constraint and leave the domain-member acceptance gate pending; do not substitute domain-controller-local policy output for member evidence.", "When a member is available, authenticate a synthetic domain user on it and prove the intended GPO result using member-side policy evidence.", "Run remote PowerShell evidence collection through the controlled management path.", "Exercise one cross-OS SMB path and cross-authority DNS resolution.", "Break one DNS/domain-discovery or policy-scope dependency, diagnose it and recover it.", "Produce the mixed-estate operations/handoff runbook."],
    ["Mixed-estate topology", "Domain/GPO evidence", "Remote PowerShell evidence", "Cross-OS integration evidence", "Failure/recovery evidence", "Operations runbook"],
    ["Centralized synthetic identity and one policy are proven on a separate member boundary.", "Linux and Windows interoperate through at least one real service path.", "A mixed-estate dependency failure is diagnosed and recovered from evidence."],
);
