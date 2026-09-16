import type { Lesson } from "./lesson";

export const bareMetalFoundationsDeepLessons: Lesson[] = [
    {
        id: "bare-metal-firmware-boot-chain",
        title: "Firmware, UEFI and the Boot Chain",
        activities: [
            {
                id: "bare-metal-firmware-boot-chain-reading",
                title: "Before the Operating System",
                estimatedMinutes: 45,
                content: {
                    type: "reading",
                    body: "A host can fail before Rocky Linux or Proxmox has any chance to help. Treat POST, firmware, boot media, bootloader, kernel and userspace as separate ownership boundaries. UEFI/GPT is the modern baseline; legacy BIOS/MBR remains comparison knowledge. Secure Boot and CPU virtualization extensions are controls to understand, not settings to disable reflexively.",
                    blocks: [
                        { type: "heading", id: "boot-chain", text: "Boot is a chain of independently testable stages", level: 2 },
                        { type: "code", language: "text", code: "power -> POST/hardware init -> UEFI firmware -> boot entry/media -> bootloader -> kernel/initramfs -> userspace/services", caption: "A failure symptom should be localized to the earliest stage that did not complete." },
                        { type: "paragraph", text: "Firmware owns hardware initialization and boot selection. The OS owns neither a missing disk in firmware nor a disabled virtualization extension. Conversely, a healthy firmware screen does not prove the kernel or service layer is healthy." },
                        { type: "heading", id: "uefi", text: "UEFI, GPT and Secure Boot", level: 2 },
                        { type: "paragraph", text: "Know why modern installations normally use UEFI with GPT, how firmware boot entries select media, and what Secure Boot validates. Record the current state before changing it. If a platform requires a Secure Boot change, document the compatibility reason and security consequence rather than following a generic installation recipe." },
                        { type: "resources", title: "Supporting references", resources: [{ title: "Red Hat — Working with GRUB 2", url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_monitoring_and_updating_the_kernel/assembly_making-persistent-changes-to-the-grub-boot-loader_managing-monitoring-and-updating-the-kernel" }, { title: "UEFI Forum", url: "https://uefi.org/" }] },
                    ],
                },
            },
            {
                id: "bare-metal-firmware-boot-chain-practical",
                title: "Inventory the pre-OS platform",
                estimatedMinutes: 100,
                content: {
                    type: "practical",
                    objective: "Create a reproducible firmware/boot baseline for the machine intended to become the TSA homelab hypervisor and prove that you can identify the boundary at which a boot problem occurs.",
                    scenario: "The future Proxmox host must be understood before its disks are changed. Another engineer should be able to tell what firmware mode, boot path and virtualization capability existed before installation.",
                    instructions: ["Record manufacturer/model, CPU, RAM, storage devices, NICs and firmware/BIOS version without exposing serial numbers publicly.", "Enter firmware setup and record UEFI/legacy mode, boot order, Secure Boot state and CPU virtualization-extension state (Intel VT-x/VT-d or AMD-V/IOMMU as available).", "Confirm whether the intended installation disk and removable installation media are visible to firmware.", "Identify the existing partition-table/boot mode where safe without modifying the current system.", "Build a boot-stage diagnostic table from power/POST through userspace with one observable symptom and one appropriate evidence source per stage.", "Perform one safe recovery-media/temporary-boot-menu exercise without changing the production boot order permanently; prove you can select the normal boot path again.", "Document every setting changed and restore any temporary change."],
                    deliverables: ["Sanitized hardware/firmware inventory", "UEFI/boot/security/virtualization baseline", "Boot-stage diagnostic table", "Temporary boot/recovery exercise evidence", "Change-and-restore record"],
                    completionCriteria: ["The learner distinguishes firmware, bootloader, kernel and userspace failures.", "Virtualization support is verified rather than assumed.", "Secure Boot state is documented with rationale for any change.", "No destructive disk operation is required.", "The machine returns to its original working boot path."],
                },
            },
        ],
    },
    {
        id: "bare-metal-hardware-health",
        title: "Hardware Health and SMART Evidence",
        activities: [
            {
                id: "bare-metal-hardware-health-reading",
                title: "Hardware can degrade while software still runs",
                estimatedMinutes: 35,
                content: {
                    type: "reading",
                    body: "A production-like homelab needs a small hardware-health baseline. SMART is evidence about supported storage devices, not a guarantee against failure. Temperatures, memory symptoms, firmware inventory and kernel hardware messages help separate degrading hardware from application defects. RAID, snapshots and backups solve different problems and will be treated separately in the storage path.",
                    blocks: [
                        { type: "heading", id: "health-boundaries", text: "Observe before replacing", level: 2 },
                        { type: "paragraph", text: "Record device identity, SMART overall status and relevant error/health counters where the device exposes them. Do not interpret one vendor-specific attribute mechanically. Combine device evidence with OS/kernel logs and the observed symptom." },
                        { type: "resources", title: "Supporting reference", resources: [{ title: "smartmontools", url: "https://www.smartmontools.org/" }] },
                    ],
                },
            },
            {
                id: "bare-metal-hardware-health-practical",
                title: "Establish the hardware-health baseline",
                estimatedMinutes: 90,
                content: {
                    type: "practical",
                    objective: "Collect a safe hardware-health baseline that can later be compared when Proxmox, NAS or VM symptoms suggest a substrate failure.",
                    scenario: "A future storage or VM incident should not begin with guessing whether the disk, host or guest is failing.",
                    instructions: ["From a booted Linux environment or another safe supported environment, inventory visible block devices and map them back to the physical inventory.", "Use smartctl where supported to capture SMART identity/health and relevant counters; record explicitly when USB bridges or hardware do not expose SMART.", "Inspect kernel/system hardware messages for disk, memory, thermal or NIC errors using tools appropriate to the current environment.", "Record available temperature/health sensor evidence where supported.", "Create warning/escalation rules based on change and error evidence rather than claiming one SMART field predicts failure.", "Model one failure symptom (for example repeated I/O errors or a disk absent from firmware) and state which evidence would distinguish hardware from filesystem/application failure."],
                    deliverables: ["Block-device-to-physical-device map", "SMART/health baseline or documented unsupported boundary", "Hardware log/sensor evidence", "Hardware-vs-software diagnostic decision record"],
                    completionCriteria: ["Health evidence is tied to a specific device.", "Unsupported telemetry is recorded rather than invented.", "SMART is not described as backup or guaranteed failure prediction.", "The learner can identify evidence that belongs below the filesystem/OS layer."],
                },
            },
        ],
    },
    {
        id: "bare-metal-recovery-oob-power",
        title: "Recovery, Out-of-Band Management and Power Boundaries",
        activities: [
            {
                id: "bare-metal-recovery-oob-power-reading",
                title: "When the normal management path is gone",
                estimatedMinutes: 40,
                content: {
                    type: "reading",
                    body: "Remote SSH and web consoles depend on a working host and network path. Enterprise servers may provide an independent management controller through IPMI/iDRAC/iLO-class interfaces. TSA requires the mental model but does not require expensive server hardware. Physical console/recovery media remains the budget-homelab fallback. Power loss is also a platform event: graceful shutdown ordering matters once Proxmox and NAS dependencies exist.",
                    blocks: [
                        { type: "heading", id: "oob", text: "Out-of-band is a separate trust and failure boundary", level: 2 },
                        { type: "paragraph", text: "If the owned hardware exposes an out-of-band controller, inspect it and secure its management access. Otherwise document what such a controller would allow: remote power control, console access and hardware telemetry even when the host OS is unavailable. Do not expose a management controller directly to the public internet." },
                        { type: "heading", id: "power", text: "Graceful shutdown is dependency-aware", level: 2 },
                        { type: "paragraph", text: "A UPS can buy shutdown time; it is not infinite availability. Later, define an order that protects guests and storage before the hypervisor loses power. A UPS purchase remains optional until cost and service criticality justify it." },
                    ],
                },
            },
            {
                id: "bare-metal-recovery-oob-power-practical",
                title: "Prove a local recovery path",
                estimatedMinutes: 90,
                content: {
                    type: "practical",
                    objective: "Demonstrate how you would recover administrative control when the normal OS/network management path is unavailable, without requiring enterprise out-of-band hardware.",
                    scenario: "The future hypervisor does not answer on the management network. You need a recovery path that does not depend on the failed service itself.",
                    instructions: ["Document the normal remote-management path and every dependency it requires.", "Identify the learner-owned fallback: physical keyboard/display, serial console where available, temporary recovery media or actual OOB controller.", "If hardware exposes IPMI/iDRAC/iLO-class management, inspect its firmware/version/network boundary and secure access; otherwise document the conceptual capability and skip hands-on configuration.", "Simulate loss of the normal management path safely (for example disable a test VM interface or use a non-production lab host) and recover through an independent path.", "Draft the future Proxmox/NAS graceful shutdown dependency order for a power event.", "State what a UPS would and would not protect and define the condition under which buying one becomes justified."],
                    deliverables: ["Normal-versus-recovery management path diagram", "Recovery exercise evidence", "Conditional OOB evidence or bounded design note", "Proxmox/NAS shutdown-order draft", "UPS decision boundary"],
                    completionCriteria: ["Recovery does not depend entirely on the failed normal management path.", "OOB management is not mandated when hardware lacks it.", "Management interfaces are treated as sensitive.", "Power protection is distinguished from backup and high availability."],
                },
            },
        ],
    },
    {
        id: "bare-metal-platform-readiness-gate",
        title: "Bare-Metal Readiness Gate for Proxmox",
        activities: [
            {
                id: "bare-metal-platform-readiness-gate-practical",
                title: "Approve the machine for hypervisor installation",
                estimatedMinutes: 75,
                content: {
                    type: "practical",
                    objective: "Make an evidence-based go/no-go decision for using the selected machine as the TSA Proxmox host before destructive hypervisor installation begins.",
                    scenario: "Installing a hypervisor changes the machine's role and may overwrite storage. Treat that transition as a controlled platform change rather than clicking through an installer.",
                    instructions: ["Review the hardware/firmware inventory, virtualization-extension evidence, NIC availability, disk-health baseline and intended management network.", "Identify which disk(s) may be erased and prove any valuable data has an independent recovery path before installation.", "Record current firmware settings and a rollback/reinstallation path.", "Check Proxmox VE hardware requirements against the actual machine and identify any unsupported/weak boundary.", "Create a risk register covering single-host failure, disk failure, power loss, management-network loss and unavailable recovery media.", "Approve the host only if the evidence supports the intended lab workload; otherwise document the smallest remediation or alternate hardware decision."],
                    deliverables: ["Proxmox host readiness checklist", "Destructive-change/data-safety evidence", "Platform risk register", "Go/no-go decision with rationale"],
                    completionCriteria: ["The decision is based on observed hardware rather than assumed compatibility.", "Destructive storage impact is explicit.", "A local recovery/reinstallation path exists.", "Known single-host and power failure domains are accepted deliberately rather than hidden."],
                },
            },
        ],
    },
];