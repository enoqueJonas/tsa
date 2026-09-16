import type { AuthoredLesson } from "./normalize-authored-curriculum";

function milestone(id: string, title: string, objective: string, scenario: string, instructions: string[], deliverables: string[], completionCriteria: string[]): AuthoredLesson {
    return { id, title, activities: [{ type: "practical", title, objective, scenario, instructions, deliverables, completionCriteria }] };
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
    ["Generate the pre-maintenance fleet report through the existing Ansible workflow.", "Patch one canary Rocky guest, handle required reboot and verify platform/workload health.", "Continue to at least one additional guest only after the canary passes.", "Demonstrate one deterministic post-update regression on a disposable/canary target and execute the documented recovery choice.", "Verify running kernels and application/dependency health after maintenance.", "Publish the maintenance record and next-window posture."],
    ["Fleet pre-maintenance report", "Canary-to-fleet patch evidence", "Reboot/kernel verification", "Regression/recovery evidence", "Maintenance record"],
    ["At least two hosts pass through the staged workflow.", "A failed health gate blocks wider rollout.", "Recovery is executed and verified rather than merely described."],
);

export const windowsEnterpriseImplementationMilestone = milestone(
    "windows-mixed-estate-operated-milestone",
    "Milestone: Build and Operate the Mixed Windows/Linux Estate",
    "Prove the bounded Windows estate works as an integrated enterprise boundary rather than a collection of isolated Windows exercises.",
    "The lab now has Windows Server, PowerShell administration, AD/DNS, policy and Linux interoperability. The milestone must prove those pieces work together and fail in diagnosable ways.",
    ["Capture the Windows Server/domain, member, Rocky, DNS and file-service topology using synthetic identities only.", "Authenticate a synthetic domain user on the member and prove the intended GPO result.", "Run remote PowerShell evidence collection through the controlled management path.", "Exercise one cross-OS SMB path and cross-authority DNS resolution.", "Break one DNS/domain-discovery or policy-scope dependency, diagnose it and recover it.", "Produce the mixed-estate operations/handoff runbook."],
    ["Mixed-estate topology", "Domain/GPO evidence", "Remote PowerShell evidence", "Cross-OS integration evidence", "Failure/recovery evidence", "Operations runbook"],
    ["Centralized synthetic identity and one policy are proven on a separate member boundary.", "Linux and Windows interoperate through at least one real service path.", "A mixed-estate dependency failure is diagnosed and recovered from evidence."],
);
