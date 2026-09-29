import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const rhelNfs: LearningResource = { title: "Red Hat — Deploying an NFS server", url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_file_systems/deploying-an-nfs-server_managing-file-systems" };
const opensshSftp: LearningResource = { title: "OpenSSH — sftp and sshd documentation", url: "https://www.openssh.com/manual.html" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "System Thinker produced a file-integration handoff contract without assuming infrastructure existed. Platform Builder now consumes that contract against the NFS/file-service capability already built in the homelab and proves the operating boundary with a real batch exchange." },
    { type: "callout", tone: "steward", title: "Build the handoff, not another file server", body: "Reuse the existing learner-owned NFS service. This path implements producer/consumer lifecycle, identity, permissions, transfer boundary, failure and recovery. It must not create a second NFS stack just to satisfy the lesson." },
    { type: "resources", title: "Implementation references", resources: [rhelNfs, opensshSftp] },
];

export const enterpriseFileIntegrationImplementationDeepLessons: Lesson[] = [
    {
        id: "platform-enterprise-file-batch-integration",
        title: "Implement the Enterprise File and Batch Integration Boundary",
        activities: [
            {
                id: "platform-enterprise-file-batch-integration-001",
                title: "From System Design Handoff to Platform Contract",
                estimatedMinutes: 45,
                content: {
                    type: "reading",
                    body: "Reopen the System Thinker NFS and managed-transfer handoff. Validate its assumptions against the Platform Builder topology, existing NFS export, identities, DNS and storage ownership before implementing the exchange.",
                    blocks,
                },
            },
            {
                id: "platform-enterprise-file-batch-integration-002",
                title: "Build and Break the Batch Exchange",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Implement one end-to-end Steward file/batch flow using the existing shared-file capability and prove safe lifecycle, access and recovery behavior.",
                    scenario: "A Steward producer creates a bounded batch file for another internal component while an external/legacy boundary exchanges discrete files through managed transfer. Implement the internal path now and preserve the external transport as a separately owned boundary rather than making both systems share a filesystem.",
                    instructions: [
                        "Reopen the System Thinker file-integration topology and NFS implementation handoff; record any assumption that changed after the Platform Builder infrastructure was built.",
                        "Reuse the existing learner-owned NFS export or create a justified bounded export on the same file-service capability; do not deploy a parallel file server.",
                        "Implement a producer path that writes to a temporary/staging name, validates completion and atomically promotes the file into the consumer-visible state.",
                        "Implement a consumer path that claims or records processed files idempotently and moves completed/rejected files into explicit lifecycle states.",
                        "Create least-privilege producer and consumer identities/permissions and prove an unauthorized identity cannot read or mutate the exchange.",
                        "Trace one batch from source to transport/share to identity/access decision to receiver and durable processing evidence.",
                        "Model the external legacy boundary with SFTP/managed-transfer semantics and, where the homelab permits, perform one bounded SFTP transfer using a dedicated account. Do not make the external system mount the internal NFS share.",
                        "Interrupt the NFS service or client connectivity during processing, restore it and prove the flow does not silently duplicate or partially process the batch.",
                        "Repeat or replay a previously delivered file and prove the chosen idempotency/claim rule.",
                        "Update the original System Thinker handoff with the implemented topology, operational ownership, failure observations and remaining Security Steward work such as stronger machine trust or managed-transfer hardening.",
                    ],
                    deliverables: [
                        "Updated System Thinker-to-Platform Builder handoff",
                        "End-to-end producer/share/consumer evidence",
                        "File lifecycle and idempotency evidence",
                        "Producer/consumer permission proof",
                        "NFS outage and recovery record",
                        "Managed-transfer boundary evidence or executable design",
                        "Security handoff for later hardening",
                    ],
                    completionCriteria: [
                        "The implemented flow consumes the earlier System Thinker design rather than starting from an unrelated demo.",
                        "The existing Platform Builder file-service capability is reused instead of duplicated.",
                        "A complete file can be distinguished from staging, claimed, processed, rejected and archived states.",
                        "Least-privilege access is demonstrated with both allowed and denied operations.",
                        "An outage and a duplicate/replay condition are reproduced and recovered without silent double processing.",
                        "NFS shared-filesystem semantics and SFTP/managed-transfer semantics remain distinct boundaries with explicit ownership.",
                    ],
                },
            },
        ],
    },
];
