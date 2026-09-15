import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const openssh: LearningResource = { title: "OpenSSH manuals", url: "https://www.openssh.com/manual.html" };
const sshKeygen: LearningResource = { title: "ssh-keygen manual", url: "https://man.openbsd.org/ssh-keygen" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "System Thinker deliberately implemented a legacy FTP exchange and prepared its secure-transfer contract. Security Steward now executes the migration: SFTP becomes the authoritative transfer path, coexistence is bounded, trust and machine identity are explicit, rollback is rehearsed and FTP is removed rather than left as a permanent parallel channel." },
    { type: "heading", id: "boundaries", text: "Transport changes; domain contract stays stable", level: 2 },
    { type: "list", items: [
        "SFTP is SSH File Transfer Protocol, not FTP wrapped in SSH and not FTPS.",
        "The Steward file format, stable identifiers, idempotency, acknowledgement/rejection and batch lifecycle remain transport-independent.",
        "SSH host-key verification authenticates the server; client key/service identity authenticates the integration workload.",
        "FTP and SFTP may coexist only during an explicit migration window with one authoritative processing rule.",
        "Migration is complete only when FTP credentials/listener/firewall exposure are disabled and post-cutover evidence is healthy."
    ] },
    { type: "callout", tone: "steward", title: "No permanent dual transport", body: "Keeping FTP enabled 'just in case' preserves the original security risk and doubles the operating surface. Rollback is a bounded migration capability, not an indefinite architecture." },
    { type: "resources", title: "Continue learning", resources: [openssh, sshKeygen] },
];

export const secureFileTransferMigrationDeepLessons: Lesson[] = [
    {
        id: "security-secure-file-transfer-migration",
        title: "FTP to SFTP Secure Transfer Migration",
        activities: [
            { id: "security-secure-file-transfer-migration-001", title: "From Legacy Compatibility to Secure Transfer", estimatedMinutes: 45, content: { type: "reading", body: "Execute the migration contract prepared earlier without rewriting the batch domain merely because the transport changes.", blocks } },
            {
                id: "security-secure-file-transfer-migration-002",
                title: "Build the SFTP Trust and Identity Boundary",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Operate a learner-owned SFTP endpoint with explicit server trust, least-privilege machine identity and narrow filesystem access.", scenario: "Security policy prohibits Steward's clear-text FTP exchange. The legacy integration has been upgraded to support SFTP, but production cutover requires a trustworthy endpoint and non-human service identity.", instructions: [
                    "Deploy/configure an OpenSSH SFTP endpoint on a separate learner-owned endpoint or justified file-transfer host; expose only the SSH/SFTP network path required by the integration.",
                    "Create a dedicated non-interactive service identity for the Steward exchange and constrain it to the required transfer directory using appropriate SFTP-only/chroot/filesystem controls where supported.",
                    "Use key-based client authentication for the integration identity; protect the private key according to the existing TSA secrets-management boundary and never commit it to Git/evidence.",
                    "Capture the server SSH host-key fingerprint through a trusted/bootstrap channel and pin/verify it in the automated client known-hosts policy rather than disabling host-key checking.",
                    "Prove a valid integration key can transfer within the intended directory and that an unrelated key/account or forbidden filesystem path is denied.",
                    "Rotate the client key or equivalent service credential once and prove the retired credential can no longer authenticate."
                ], deliverables: ["SFTP topology", "Restricted service-account configuration", "Host-key trust evidence", "Allowed/denied access evidence", "Client-key rotation/revocation evidence", "Secret-handling note"], completionCriteria: ["SFTP is actually operated between separate endpoints.", "The integration uses a non-human least-privilege identity.", "Host-key verification is enabled and understood.", "Forbidden access is demonstrated.", "A retired client credential is proven unusable." ] },
            },
            {
                id: "security-secure-file-transfer-migration-003",
                title: "Prove File-Contract Parity over SFTP",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Move the existing Steward batch exchange to SFTP without changing its domain contract or reliability semantics.", scenario: "Transport security is changing, but downstream processing must still recognize the same file identity, version, lifecycle and idempotency rules.", instructions: [
                    "Reuse the versioned file-interface contract and representative valid/invalid fixtures created in System Thinker; do not invent an SFTP-specific business format.",
                    "Transfer an outbound Steward inventory and an inbound ownership-review file through SFTP using the same complete-file handoff convention.",
                    "Process the inbound file through the existing Steward batch worker and prove the same validation, acknowledgement/rejection and domain-authorization behavior remains in force.",
                    "Deliver the same business file once through FTP and once through SFTP during the controlled test window and prove durable idempotency prevents duplicate domain effects.",
                    "Interrupt an SFTP upload and prove the partial file cannot enter processing; recover/retry the transfer deterministically.",
                    "Compare FTP and SFTP evidence for ports/firewall behavior, credential confidentiality, server identity and operational failure modes."
                ], deliverables: ["SFTP contract-parity evidence", "Batch-worker result evidence", "Cross-transport duplicate/idempotency proof", "Interrupted-transfer recovery", "FTP-vs-SFTP operational comparison"], completionCriteria: ["Changing transport does not bypass or duplicate Steward domain validation.", "The same file contract works across the migration boundary.", "Cross-transport duplicate delivery cannot duplicate an authoritative effect.", "Incomplete SFTP uploads are excluded from processing.", "The learner can explain the security/operational delta from FTP." ] },
            },
            {
                id: "security-secure-file-transfer-migration-004",
                title: "Run Bounded FTP and SFTP Coexistence",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Exercise cutover and rollback while preventing two live transports from becoming two authorities.", scenario: "The partner needs a short migration window where FTP remains available as a rollback path while SFTP is validated. Both paths must not independently apply the same business delivery.", instructions: [
                    "Define a short coexistence window, authoritative transport rule and named cutover point before enabling dual availability.",
                    "Run at least one representative delivery through the old FTP path and one through SFTP while preserving a single processing/idempotency authority.",
                    "Switch the authoritative delivery path to SFTP and verify outbound/inbound transfer, acknowledgement/rejection, processing freshness and expected schedule.",
                    "After cutover, deliberately make SFTP unavailable and execute the pre-defined rollback decision once while FTP is still inside the approved coexistence window.",
                    "Restore SFTP, re-establish host-key/identity trust as necessary, repeat the cutover and prove the recovered secure path is healthy.",
                    "Record the exact evidence and deadline that close the rollback window; no vague 'keep FTP for a while' criterion is allowed."
                ], deliverables: ["Coexistence plan", "Authoritative-transport rule", "Initial cutover evidence", "SFTP failure/FTP rollback exercise", "Second cutover evidence", "Rollback-window closure criteria"], completionCriteria: ["Dual availability is time-bounded.", "Only one processing authority exists during coexistence.", "Rollback is actually rehearsed before FTP removal.", "SFTP is restored and successfully becomes authoritative again.", "The end of the rollback window is measurable." ] },
            },
            {
                id: "security-secure-file-transfer-migration-005",
                title: "Decommission FTP and Prove the Security End State",
                estimatedMinutes: 150,
                content: { type: "practical", objective: "Remove the insecure compatibility surface after the secure path satisfies its migration gates.", scenario: "SFTP has completed the agreed observation window. Leaving FTP listener, credentials or firewall paths active would preserve unnecessary attack surface and make the migration incomplete.", instructions: [
                    "Verify the SFTP observation/cutover criteria are satisfied and no approved partner/job still depends on FTP.",
                    "Disable/revoke the legacy FTP integration account credentials and stop/disable the FTP service or listener.",
                    "Remove FTP-specific public/network firewall exposure and unnecessary passive port ranges while preserving required SFTP access.",
                    "From the former client endpoint, prove FTP connection/authentication/transfer is no longer possible and SFTP still succeeds.",
                    "Search deployment/runbook/configuration references for obsolete FTP endpoints/credentials and remove or archive them according to policy.",
                    "Capture final exposure/listener inventory and update the Steward file-integration decision/runbook so SFTP is the supported secure transport."
                ], deliverables: ["Decommission gate", "FTP account/service removal evidence", "Firewall exposure reduction", "Negative FTP + positive SFTP proof", "Configuration cleanup record", "Final secure-transfer runbook"], completionCriteria: ["FTP is no longer an available production-compatible transfer path.", "Legacy credentials are revoked/removed.", "FTP-specific network exposure is removed.", "SFTP remains functional after cleanup.", "Documentation has one supported authoritative transport rather than permanent dual infrastructure." ] },
            },
            { id: "security-secure-file-transfer-migration-006", title: "Defend the Secure Transfer Migration", estimatedMinutes: 20, content: { type: "reflection", prompt: "Explain why SFTP is not FTPS or 'FTP over SSH', how SSH host-key trust and client service identity protect different sides of the connection, which Steward file/batch semantics stayed unchanged, why coexistence had to be bounded, what made rollback safe, and what evidence justified permanently disabling FTP.", minimumCharacters: 350 } },
        ],
    },
];
