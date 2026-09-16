import type { AuthoredLesson } from "./normalize-authored-curriculum";

export const proxmoxImplementationMilestone: AuthoredLesson = {
    id: "proxmox-operated-platform-milestone",
    title: "Milestone: Build and Operate the Proxmox Virtualization Platform",
    summary: "Consolidate the Proxmox path into one working learner-operated virtualization platform before reassessing its future architecture.",
    objectives: [
        "Prove the physical-host → Proxmox → network/storage → Rocky guest chain end to end.",
        "Operate lifecycle, backup/restore, failure diagnosis and maintenance on the implemented platform.",
        "Create a trustworthy platform handoff for the storage and infrastructure-service modules that follow.",
    ],
    activities: [{
        type: "practical",
        title: "Build and prove the Proxmox platform",
        objective: "Deliver an operated Proxmox platform that can safely host the next TSA infrastructure capabilities.",
        scenario: "The homelab design and bare-metal readiness work are complete. Proxmox must now be proven as actual infrastructure rather than ending the module with an architecture discussion.",
        instructions: [
            "Capture the final physical host, Proxmox version/kernel, management boundary, bridges/VLANs, storage pools and Rocky template topology.",
            "Provision a fresh Rocky guest from the maintained template and prove unique host/network/SSH identity.",
            "Verify a representative guest can reach only its intended network paths and trace the virtual-to-physical path.",
            "Back up a disposable guest, remove it and perform a verified restore.",
            "Inject one guest-layer and one platform-layer failure from the earlier drills, diagnose each from evidence and recover them.",
            "Execute or replay the documented maintenance workflow and verify host, storage, networking and representative guests afterward.",
            "Produce the virtualization platform runbook and handoff for the virtual NAS and core infrastructure services that follow.",
        ],
        deliverables: [
            "Final Proxmox platform topology",
            "Fresh VM provisioning evidence",
            "Virtual-to-physical network/storage evidence",
            "Verified VM restore",
            "Two-layer failure and recovery evidence",
            "Platform maintenance evidence",
            "Virtualization operations runbook",
        ],
        completionCriteria: [
            "A fresh Rocky VM can be provisioned repeatably from the maintained platform.",
            "Backup recovery is demonstrated rather than assumed.",
            "Guest and hypervisor failures are distinguished and recovered from evidence.",
            "The platform is ready to host the following NAS and infrastructure-service work.",
        ],
    }],
};
