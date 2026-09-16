import type { Lesson } from "./lesson";

export const osPatchingLifecycleDeepLessons: Lesson[] = [
    {
        id: "os-patching-risk-model",
        title: "Patch Risk, Exposure and Change Windows",
        summary: "Treat operating-system patching as a security and availability change rather than a blind package-manager command.",
        objectives: ["Distinguish security errata, routine package updates, kernel updates and major OS migrations.", "Prioritize changes using exposure and impact.", "Define maintenance evidence and recovery before changing a host."],
        activities: [{ type: "exercise", title: "Rocky patch decision", description: "Inventory the Steward Rocky host's installed release/kernel and available updates. Classify security-relevant versus routine changes, identify exposed services, define the maintenance window, pre-change health checks, recovery artifact and abort criteria. Explain why both never-patch and patch-immediately-without-verification are unsafe policies." }],
    },
    {
        id: "os-patching-rocky-maintenance",
        title: "Patch a Rocky Linux Workload Host",
        summary: "Execute a controlled DNF maintenance window and prove the workload, not merely DNF, is healthy afterward.",
        objectives: ["Inspect package provenance and pending updates.", "Apply bounded updates with before/after evidence.", "Detect whether a reboot or service restart is operationally required."],
        activities: [{ type: "practical", title: "Rocky maintenance window", objective: "Patch a learner-operated Steward Rocky VM safely.", scenario: "The VM has accumulated supported Rocky updates while Steward remains in service.", instructions: ["Capture release, running kernel, package state, disk capacity, mounts, time sync and representative Steward health before change.", "Use DNF/RPM tooling to inspect repositories and pending updates; record the relevant security/package changes without dumping sensitive configuration.", "Confirm a current usable backup/recovery point and explain whether it is application-consistent; do not call a same-disk snapshot an independent backup.", "Apply the bounded update set through DNF and preserve transaction/history evidence.", "Identify services/processes affected and whether a reboot is required or justified.", "Run the same host and Steward verification after package changes before closing the window."], deliverables: ["Pre-change baseline", "Update/errata decision record", "DNF transaction evidence", "Post-change verification", "Recovery-point statement"], completionCriteria: ["Available updates are inspected before application.", "Package-manager success is not the final health check.", "Recovery assumptions are explicit."] }],
    },
    {
        id: "os-patching-kernel-reboot",
        title: "Kernel Update and Controlled Reboot",
        summary: "Prove that installing a kernel and actually booting it are separate states, then verify every critical dependency after restart.",
        objectives: ["Distinguish installed from running kernel.", "Plan shutdown/start dependencies.", "Recover from a reboot-related regression without random intervention."],
        activities: [{ type: "practical", title: "Kernel lifecycle drill", objective: "Apply a kernel update and prove the intended kernel is running after reboot.", scenario: "A security update installs a newer kernel, but the server is still executing the old one until maintenance completes.", instructions: ["Record running kernel and installed kernel packages before the change.", "Install an available supported kernel update when one exists; if already current, preserve the exercise for the next real kernel update rather than fabricating a downgrade.", "Define shutdown/start order and out-of-band/console recovery path before reboot.", "Reboot during the maintenance window and prove the running kernel changed to the intended supported version.", "Verify storage mounts, network/DNS/time, systemd services and Steward behavior after boot.", "Inspect boot/journal evidence for regressions and record the known-good kernel/recovery route if the new kernel fails."], deliverables: ["Installed-versus-running kernel evidence", "Reboot plan", "Post-boot platform/workload verification", "Kernel recovery procedure"], completionCriteria: ["The running kernel is verified explicitly.", "Post-reboot verification crosses OS and application layers.", "A boot failure has a documented recovery path."] }],
    },
    {
        id: "os-patching-regression-recovery",
        title: "Patch Regression and Recovery",
        summary: "Respond to a post-update failure by identifying the changed layer and choosing rollback, restore or forward-fix deliberately.",
        objectives: ["Correlate a regression with package/change history.", "Choose recovery based on state and blast radius.", "Preserve evidence while restoring service."],
        activities: [{ type: "practical", title: "Post-update incident drill", objective: "Diagnose and recover a deterministic maintenance regression.", scenario: "Health checks fail after maintenance; reverting everything blindly could damage state or hide the actual fault.", instructions: ["Create a safe deterministic regression associated with the maintenance exercise, such as a deliberately incompatible disposable configuration/package dependency; do not corrupt production data.", "Detect the failure through the normal health check and preserve timestamps, DNF history, journal and service evidence.", "Identify whether the failed layer is package, configuration, kernel, service dependency or application.", "Choose and execute the safest bounded recovery: configuration forward-fix, package rollback where supported/safe, known-good boot, or VM restore for disposable state.", "Verify service and data integrity after recovery.", "Write the decision criteria that made rollback/restore/forward-fix appropriate and what would make each unsafe."], deliverables: ["Regression timeline", "Layered diagnosis", "Recovery evidence", "Rollback-versus-forward-fix decision"], completionCriteria: ["Failure is diagnosed before recovery action.", "Recovery does not rely on an unverified snapshot assumption.", "Steward health and relevant data are verified afterward."] }],
    },
    {
        id: "os-patching-fleet-ansible",
        title: "Patch Multiple Rocky Hosts with Ansible",
        summary: "Move from one-host shell administration to repeatable, observable fleet maintenance without turning automation into an uncontrolled reboot button.",
        objectives: ["Use inventory and idempotent Ansible tasks for update inspection/execution.", "Stage changes across multiple hosts.", "Keep reboot and health verification explicit."],
        activities: [{ type: "practical", title: "Ansible patch orchestration", objective: "Operate a small Rocky VM fleet with repeatable patch reporting and staged execution.", scenario: "The Proxmox homelab now contains multiple Rocky guests and manual SSH-by-SSH patching no longer provides reliable consistency or evidence.", instructions: ["Use at least two disposable/appropriate Rocky guests from the existing Proxmox environment and create an Ansible inventory grouped by operational role.", "Build a playbook/role that reports release, kernel and pending update state before changing anything.", "Add bounded DNF update execution using privilege escalation and idempotent modules rather than opaque shell loops.", "Patch one canary guest first, run host/workload health checks, then continue to the next host only when the canary is healthy.", "Handle reboot-required state explicitly and wait for the host to return before verification.", "Run the playbook again and inspect changed/ok results to reason about idempotence.", "Protect credentials/keys and keep secrets out of inventory committed to Git."], deliverables: ["Versioned Ansible inventory/playbook without secrets", "Pre-patch fleet report", "Canary-then-fleet execution evidence", "Reboot/health verification", "Second-run idempotence evidence"], completionCriteria: ["At least two hosts are operated through the same declared automation.", "Canary health gates broader execution.", "Reboots and post-change verification are not hidden inside an unobservable script."] }],
    },
    {
        id: "os-patching-compliance-observability",
        title: "Patch Age and Lifecycle Visibility",
        summary: "Make stale operating systems visible before an audit or incident discovers them.",
        objectives: ["Define useful patch-age/lifecycle signals.", "Distinguish vulnerability presence from patch compliance.", "Route actionable stale-host evidence through existing observability."],
        activities: [{ type: "practical", title: "Patch posture dashboard", objective: "Expose a bounded view of Rocky host lifecycle state through the existing monitoring stack.", scenario: "Automation exists, but no operator can answer which hosts are stale, running old kernels or approaching unsupported releases.", instructions: ["Define a small host posture dataset/metric containing OS release, running kernel, last successful maintenance timestamp and pending-security-update count or a justified equivalent.", "Expose/collect it through the existing Prometheus-compatible monitoring environment without creating a parallel monitoring stack.", "Create a Grafana view for stale maintenance age, kernel mismatch and OS lifecycle state.", "Define warning policy for hosts beyond the chosen maintenance-age threshold and document exceptions rather than silently excluding them.", "Demonstrate one controlled stale/mismatch condition and its alert/query evidence.", "Explain why patch age alone does not prove vulnerability remediation and how vulnerability scanning complements it later/elsewhere."], deliverables: ["Patch posture signals", "Grafana evidence", "Staleness policy", "Controlled alert/query evidence"], completionCriteria: ["Operators can identify stale hosts without interactive login.", "Kernel installed/running mismatch is visible or queryable.", "The solution reuses existing observability ownership."] }],
    },
    {
        id: "os-patching-proxmox-boundary",
        title: "Separate Proxmox Host and Rocky Guest Lifecycles",
        summary: "Keep hypervisor maintenance and guest OS patching as separate change domains even when one engineer owns both in the homelab.",
        objectives: ["Identify host-versus-guest patch dependencies.", "Avoid coupling every guest update to a hypervisor reboot.", "Sequence infrastructure maintenance by blast radius."],
        activities: [{ type: "exercise", title: "Two-layer maintenance plan", description: "Using the existing Proxmox maintenance lab, write a quarterly-style maintenance plan that separates Proxmox repositories/kernel/platform updates from Rocky guest DNF/kernel updates. Include backups, guest ordering, canary strategy, host reboot blast radius, post-maintenance checks and recovery. Explain why a Proxmox snapshot does not replace independent recovery and why updating every layer simultaneously makes incident localization harder." }],
    },
    {
        id: "os-major-version-migration",
        title: "Major OS Version Change Is a Migration",
        summary: "Treat a major Rocky/RHEL-family release transition as workload migration with compatibility proof, not as routine monthly patching.",
        objectives: ["Assess support lifecycle and application compatibility.", "Prefer rebuild-and-migrate when it provides clearer rollback.", "Define coexistence, cutover and decommission evidence."],
        activities: [{ type: "exercise", title: "Rocky major-version migration design", description: "Assume the current Steward Rocky major release approaches end of support. Design a replacement VM on the next supported major release using the Proxmox template/configuration-management capabilities. Define compatibility tests, data/config migration, old/new coexistence, cutover, rollback window and old-host decommission. Do not execute an unsupported in-place major upgrade merely to satisfy the exercise." }],
    },
    {
        id: "os-patching-reassessment",
        title: "Reassess the Patch Operating Model",
        summary: "Turn the labs into a sustainable maintenance policy whose automation depth matches the size and criticality of the TSA estate.",
        objectives: ["Define ownership, cadence and emergency patch rules.", "Choose what is automated versus approval-gated.", "Retain evidence without building unnecessary enterprise tooling."],
        activities: [{ type: "exercise", title: "Patch management ADR and runbook", description: "Produce the final TSA OS lifecycle model: Rocky guest cadence, emergency security-change path, Ansible canary/fleet workflow, reboot policy, patch-age monitoring, exception expiry, recovery requirements, Proxmox host maintenance boundary and major-release migration trigger. State what would justify a dedicated enterprise patch-management platform later; do not add one merely for tool exposure." }],
    },
];