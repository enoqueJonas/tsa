import type { Lesson } from "./lesson";

export const windowsPowerShellEnterpriseDeepLessons: Lesson[] = [
    {
        id: "windows-enterprise-boundary",
        title: "Windows in a Linux-Primary Enterprise Platform",
        summary: "Build enough Windows Server literacy to operate mixed estates without turning TSA into a second operating-system certification track.",
        objectives: ["Compare Windows and Rocky administration boundaries.", "Identify Windows services, registry, event logs, NTFS, shares and domain identity as distinct operational layers.", "Design a disposable Windows lab on Proxmox."],
        activities: [{ type: "exercise", title: "Mixed-estate responsibility map", description: "Design a bounded Proxmox lab with one Windows Server evaluation VM and, where resources permit, one Windows client/member VM. Map equivalents and non-equivalents between systemd/services, journald/Event Log, POSIX/NTFS permissions, SSH/WinRM, local/domain identity and Linux/Windows DNS behavior. Record licensing/evaluation constraints and do not make Windows the TSA primary server OS." }],
    },
    {
        id: "windows-server-vm",
        title: "Build and Baseline Windows Server",
        summary: "Provision Windows Server as a managed Proxmox guest and establish a recoverable administrative baseline.",
        objectives: ["Install and identify a Windows Server guest correctly.", "Configure stable networking, naming and time.", "Capture system and service evidence before adding enterprise roles."],
        activities: [{ type: "practical", title: "Windows Server baseline", objective: "Create a disposable but repeatable Windows infrastructure VM.", scenario: "The TSA homelab needs a Windows boundary for mixed-enterprise administration and directory-service exercises.", instructions: ["Install a legally available Windows Server evaluation image on Proxmox and document edition/evaluation expiry.", "Apply an intentional hostname, stable lab addressing and the existing homelab time source.", "Install Proxmox guest integration components where appropriate and capture CPU/RAM/disk/network evidence.", "Inspect services, processes, network configuration and Event Viewer before role installation.", "Create a recovery point consistent with the Proxmox snapshot-versus-backup lessons and state its limitations."], deliverables: ["VM specification", "Windows baseline evidence", "Evaluation/licensing note", "Recovery-point decision"], completionCriteria: ["The VM is reachable only through intended lab boundaries.", "Baseline state is evidenced before AD/DNS changes.", "A recovery path exists without calling a snapshot a backup."] }],
    },
    {
        id: "powershell-administration",
        title: "PowerShell as an Administrative Interface",
        summary: "Use PowerShell objects, pipelines and scripts for repeatable administration instead of treating it as Bash with different syntax.",
        objectives: ["Work with cmdlets, objects, properties, methods and the pipeline.", "Discover commands/help rather than memorize scripts.", "Automate repeatable inventory and state checks."],
        activities: [{ type: "practical", title: "PowerShell evidence script", objective: "Produce structured Windows operational evidence repeatably.", scenario: "A steward must inventory a Windows host without clicking through multiple GUI panels.", instructions: ["Use Get-Help/Get-Command/Get-Member to investigate unfamiliar cmdlets.", "Query OS, disks, services, processes, IP configuration and selected event-log data as objects.", "Filter/sort/select using the pipeline and explain why formatting should be deferred until output presentation.", "Write a small idempotent/read-only inventory script that emits useful structured evidence to console plus JSON or CSV.", "Run it twice and compare results."], deliverables: ["PowerShell script", "Structured output", "Short Bash-versus-PowerShell object-model comparison"], completionCriteria: ["The script uses object properties rather than parsing formatted screen text.", "It is safe to rerun.", "The learner can discover an unfamiliar command through built-in help."] }],
    },
    {
        id: "windows-services-events",
        title: "Services, Processes and Event Logs",
        summary: "Diagnose Windows workload failures through service state, process evidence and event channels rather than GUI-only trial and error.",
        objectives: ["Inspect/start/stop services with PowerShell.", "Query relevant event logs programmatically.", "Correlate a failed service with observable host symptoms."],
        activities: [{ type: "practical", title: "Windows service incident", objective: "Break and diagnose a safe Windows service.", scenario: "A Windows-hosted dependency becomes unavailable while the VM itself remains online.", instructions: ["Select a non-critical lab service whose stop/start is safe.", "Capture healthy process/service/network evidence.", "Stop or misconfigure the bounded test service, observe client symptom and query relevant events with PowerShell.", "Recover the service and verify the client path.", "Record a Windows diagnostic sequence analogous to the Linux service runbook without assuming identical internals."], deliverables: ["Healthy/failing/recovered evidence", "Event-log query evidence", "Windows service runbook"], completionCriteria: ["The failed layer is identified before recovery.", "PowerShell evidence is included.", "The exercise is not GUI-only."] }],
    },
    {
        id: "ntfs-smb-permissions",
        title: "NTFS and Share Permissions",
        summary: "Understand the two authorization layers behind Windows file shares and compare them with the existing NAS/Samba boundary.",
        objectives: ["Distinguish NTFS ACLs from SMB share permissions.", "Reason about effective access across both layers.", "Test least privilege with positive and negative identities."],
        activities: [{ type: "practical", title: "Windows SMB authorization lab", objective: "Implement and troubleshoot a least-privilege Windows share.", scenario: "A team share must allow one group to modify data while another identity is denied.", instructions: ["Create a dedicated data directory and SMB share on disposable lab storage.", "Create local test users/groups initially and assign explicit NTFS/share permissions.", "Test allowed and denied access from another machine.", "Change one layer so access fails despite the other appearing permissive; diagnose effective access.", "Restore least privilege without using Everyone Full Control as the fix.", "Compare this model with the Linux Samba/NFS permissions learned earlier."], deliverables: ["ACL/share configuration", "Positive/negative tests", "Effective-access incident evidence"], completionCriteria: ["NTFS and share permissions are separately evidenced.", "A two-layer permission failure is diagnosed.", "Blanket world/full-control fixes are rejected."] }],
    },
    {
        id: "winrm-remoting",
        title: "Remote Administration with PowerShell Remoting",
        summary: "Operate Windows remotely through authenticated management rather than relying on interactive desktop access.",
        objectives: ["Explain WinRM/PowerShell remoting trust and network boundaries.", "Execute remote inventory safely.", "Avoid disabling authentication or broad firewall protections to make remoting work."],
        activities: [{ type: "practical", title: "Remote Windows administration", objective: "Administer the Windows guest from another controlled endpoint.", scenario: "Routine server administration must not require an RDP session for every task.", instructions: ["Enable/configure PowerShell remoting only on the controlled lab network using supported authentication.", "Restrict firewall reachability to the intended management source/network.", "Run remote commands that collect service and system evidence.", "Create a deliberate reachability/authentication failure, distinguish network from credential/trust failure, then recover.", "Document when RDP is still appropriate and why it is not the automation interface."], deliverables: ["Remoting configuration", "Remote command evidence", "Failure/recovery evidence", "Management-boundary note"], completionCriteria: ["Remote commands work from an intended management endpoint.", "Authentication/security is not bypassed.", "At least one remoting failure is diagnosed by layer."] }],
    },
    {
        id: "active-directory-foundations",
        title: "Active Directory, DNS and Domain Identity",
        summary: "Build a small synthetic AD domain to understand enterprise Windows identity and its dependency on DNS.",
        objectives: ["Explain forest/domain/DC/OU/user/group/computer boundaries.", "Operate a single lab domain controller.", "Connect AD authentication to DNS and time dependencies."],
        activities: [{ type: "practical", title: "Synthetic Active Directory domain", objective: "Create and operate a bounded AD DS domain with synthetic identities.", scenario: "The mixed-enterprise lab needs centralized Windows identity that can later be compared and integrated with LDAP/Keycloak federation.", instructions: ["Promote the dedicated Windows Server lab VM to a single-domain AD DS domain controller using a non-public lab namespace consistent with the DNS design.", "Install/configure the required AD-integrated DNS role and document how this DNS authority relates to the existing Linux homelab DNS rather than creating ambiguous authority.", "Create OUs for synthetic teams/workstations and synthetic users/groups only.", "Use PowerShell AD cmdlets to query and create at least part of the directory structure.", "Verify DNS SRV records/time state required for domain discovery/authentication.", "Document why one DC is a learning topology, not production HA."], deliverables: ["AD/DNS architecture diagram", "OU/user/group evidence", "PowerShell AD evidence", "Single-DC risk note"], completionCriteria: ["Synthetic domain identities authenticate.", "AD DNS dependency is evidenced.", "No real personal/corporate identities are imported."] }],
    },
    {
        id: "domain-join-gpo",
        title: "Domain Join and Group Policy",
        summary: "Apply centralized identity and one safe machine policy to a member system, then diagnose policy delivery.",
        objectives: ["Join a Windows member to the domain.", "Understand computer/user policy scope and inheritance.", "Verify Group Policy from client-side evidence."],
        activities: [{ type: "practical", title: "Join and govern a Windows member", objective: "Prove centralized identity and policy reach a separate machine boundary.", scenario: "A workstation/member server must use domain identity and receive an organization-controlled baseline setting.", instructions: ["Provision or reuse a disposable Windows member VM where licensing/resources permit; if constrained, document the smallest legally available alternative before proceeding.", "Point the member at the correct AD DNS path and join it to the synthetic domain.", "Authenticate with a synthetic domain user and inspect resulting identity/group membership.", "Create one safe GPO such as a non-destructive security/audit setting and link it to the intended OU.", "Run policy update/result tools and prove the policy is applied.", "Break DNS or OU/GPO scope safely so policy/domain discovery fails, diagnose, then restore."], deliverables: ["Domain-join evidence", "GPO configuration/result evidence", "Failure/recovery record"], completionCriteria: ["A separate member uses domain identity.", "One GPO is actually applied and verified.", "DNS/scope failure is diagnosed rather than fixed by random rejoining."] }],
    },
    {
        id: "windows-linux-interoperability",
        title: "Linux–Windows Interoperability",
        summary: "Use the existing TSA network/file/identity boundaries to prove mixed-estate interoperability rather than building isolated Windows exercises.",
        objectives: ["Consume SMB across OS boundaries.", "Resolve names consistently between Linux and Windows authority boundaries.", "Prepare AD identities for later federation without prematurely replacing Keycloak."],
        activities: [{ type: "practical", title: "Mixed-estate integration", objective: "Make Rocky and Windows systems interoperate through intentional services.", scenario: "The enterprise estate contains both platforms and the stewardship model must cross their boundaries.", instructions: ["Access the Windows SMB test share from a Rocky client or access the existing Samba share from Windows and capture identity/permission behavior.", "Configure DNS forwarding/delegation between the lab DNS authorities as appropriate so representative Linux and AD names resolve without hosts-file duplication.", "Query AD LDAP/DNS service information from the Linux side without storing privileged domain credentials in source control.", "Document the future identity flow AD/LDAP → Keycloak federation → Steward OIDC and explicitly keep Steward authorization separate from directory groups unless mapped by policy."], deliverables: ["Cross-OS file-service evidence", "Cross-authority DNS evidence", "Directory interoperability evidence", "Future federation boundary diagram"], completionCriteria: ["At least one real cross-OS service path works.", "DNS authority is not ambiguous.", "AD is not incorrectly made Steward's direct authorization database."] }],
    },
    {
        id: "windows-enterprise-reassessment",
        title: "Reassess Windows Operational Depth",
        summary: "Decide what a Technical Steward must own versus what belongs to specialist Windows/AD administration.",
        objectives: ["Define transferable mixed-estate competencies.", "Identify specialist boundaries such as multi-site AD, advanced PKI and enterprise endpoint management.", "Preserve Linux as TSA's primary implementation platform."],
        activities: [{ type: "exercise", title: "Mixed-enterprise capability record", description: "Produce an architecture and responsibility record covering Windows Server, PowerShell, WinRM, AD/DNS, GPO, SMB and Rocky interoperability. Mark what was implemented, what is intentionally bounded, and what would require a Windows/AD specialist (multi-DC/site topology, complex trusts, AD CS at enterprise scale, SCCM/Intune-class endpoint management). Define how later Keycloak federation and internal PKI exercises reuse this lab without making Windows a second permanent technology stack everywhere." }],
    },
];