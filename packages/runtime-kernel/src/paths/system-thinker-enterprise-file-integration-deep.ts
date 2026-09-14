import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const rfc959: LearningResource = { title: "RFC 959 — File Transfer Protocol", url: "https://www.rfc-editor.org/rfc/rfc959" };
const opensshSftp: LearningResource = { title: "OpenSSH documentation", url: "https://www.openssh.com/manual.html" };
const pythonCsv: LearningResource = { title: "Python csv module", url: "https://docs.python.org/3/library/csv.html" };

interface Spec {
    id: string;
    title: string;
    intro: string;
    practiceTitle: string;
    scenario: string;
    instructions: string[];
    deliverables: string[];
    criteria: string[];
    questions: string[];
    resources?: LearningResource[];
}

function lesson(spec: Spec): Lesson {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.intro },
        { type: "callout", tone: "steward", title: "Steward integration boundary", body: "This path adds a file-based integration channel because a legacy enterprise dependency cannot consume Steward's REST API. The file channel is not allowed to become a second source of truth: Steward remains authoritative for its domain state and must validate every imported change." },
        { type: "resources", title: "Continue learning", resources: spec.resources ?? [rfc959, opensshSftp, pythonCsv] },
    ];

    return {
        id: `system-thinker-enterprise-file-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `system-thinker-enterprise-file-${spec.id}-001`, title: spec.title, estimatedMinutes: 45, content: { type: "reading", body: spec.intro, blocks } },
            { id: `system-thinker-enterprise-file-${spec.id}-002`, title: spec.practiceTitle, estimatedMinutes: 120, content: { type: "practical", objective: spec.practiceTitle, scenario: spec.scenario, instructions: spec.instructions, deliverables: spec.deliverables, completionCriteria: spec.criteria } },
            { id: `system-thinker-enterprise-file-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: spec.questions.join("\n\n"), minimumCharacters: 220 } },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "contract",
        title: "File-Based Integration Contracts",
        intro: "A file interface is still an API contract. Filename, format version, encoding, delimiter, required fields, date/number representation, checksum, producer identity, delivery window and acknowledgement rules all affect interoperability. A shared folder without a contract is only accidental integration.",
        practiceTitle: "Define the Steward Service-Inventory Exchange Contract",
        scenario: "A legacy governance/reporting platform cannot call the Steward REST API. It must receive a nightly export of the service catalogue and may return a controlled ownership-review input file. Define the exchange before writing transfer code.",
        instructions: [
            "Define the outbound inventory file purpose, producer, consumer, schedule, naming convention and versioning rule.",
            "Choose CSV or another intentionally simple interchange format and define encoding, headers, required fields, null handling, dates and stable identifiers.",
            "Define an inbound file contract that cannot silently overwrite authoritative Steward state; identify which fields are requests/proposals versus authoritative changes.",
            "Specify acknowledgement/rejection behavior, duplicate-file handling, checksum or integrity expectations where useful, retention and replay policy.",
            "Create at least five representative contract test examples: valid, malformed row, unknown service identifier, duplicate delivery and unsupported format version.",
        ],
        deliverables: ["Versioned file-interface contract", "Example valid and invalid files", "Authority/ownership map", "Contract test matrix"],
        criteria: ["The contract is precise enough for independent producer and consumer implementations.", "Stable Steward identifiers are used rather than names as implicit identity.", "Inbound files cannot bypass Steward business validation.", "Duplicate/replay and version incompatibility behavior is explicit."],
        questions: ["Why is a CSV file still an API contract?", "Which fields may a legacy system propose without becoming authoritative for Steward's domain?"],
    },
    {
        id: "legacy-ftp",
        title: "Legacy FTP Integration",
        intro: "FTP remains common in long-lived enterprise batch integrations. Its separate control/data connections, active/passive modes and clear-text security model create operating and firewall behavior that engineers still encounter even when they would not select FTP for a new secure integration.",
        practiceTitle: "Implement a Controlled Legacy FTP Exchange",
        scenario: "The legacy governance platform can initially deliver and retrieve files only through FTP. Implement that constraint in the learner-owned environment so its protocol behavior and risks are understood before Security Steward later migrates the channel.",
        instructions: [
            "Deploy a learner-owned FTP service with a dedicated non-admin Steward integration account and a narrow exchange directory.",
            "Configure and demonstrate one working passive-mode transfer from a separate client; inspect the control connection and the separate data connection behavior.",
            "Investigate active versus passive mode and document which firewall/NAT assumptions differ; do not expose unnecessary port ranges.",
            "Upload a complete test file through the agreed handoff convention and prove the Steward-side consumer does not process a still-uploading temporary file.",
            "Deliberately test invalid credentials, unavailable FTP service, interrupted transfer and insufficient permissions.",
            "Capture the security findings: credential/data confidentiality, server exposure, account lifecycle and why this is a legacy compatibility boundary rather than TSA's preferred secure design.",
        ],
        deliverables: ["FTP service/client configuration", "Active/passive protocol note", "Successful transfer evidence", "Interrupted/failed transfer evidence", "Legacy security-risk record"],
        criteria: ["FTP is actually operated between separate endpoints.", "The learner can explain control/data connections and active/passive behavior.", "Incomplete files are prevented from entering processing.", "Failure behavior is demonstrated.", "The integration is explicitly marked for later secure migration rather than normalized as a modern default."],
        questions: ["Why can FTP be harder to pass through firewalls than SFTP?", "Why is knowing how to operate FTP still useful even if you should not choose it for a new secure integration?"],
        resources: [rfc959],
    },
    {
        id: "batch-lifecycle",
        title: "Batch File Processing Lifecycle",
        intro: "Reliable file integration requires more than noticing a new filename. Files need lifecycle states, claim semantics, validation, idempotency and durable processing evidence so restarts and duplicate deliveries do not corrupt the authoritative system.",
        practiceTitle: "Build the Steward File Import Worker",
        scenario: "Steward receives the legacy ownership-review file after transfer. Build a worker that treats the file as an asynchronous batch input, validates it and records deterministic outcomes without turning the shared directory into application state.",
        instructions: [
            "Implement explicit incoming, processing, processed, rejected and archive states or an equivalent lifecycle with clear ownership transitions.",
            "Claim an incoming file atomically before processing so two worker instances cannot knowingly process the same file concurrently.",
            "Validate file-level contract/version before row-level data validation.",
            "Use a durable idempotency key based on a defined file identity such as source + business date + sequence/checksum; prove the same delivery cannot apply domain changes twice.",
            "Process rows through Steward application/domain validation rather than direct uncontrolled database writes.",
            "Produce a deterministic result/rejection artifact containing non-sensitive row identifiers and reasons.",
            "Simulate a worker crash after claim and another after partial row handling. Define/recover the state without silent duplicate effects.",
        ],
        deliverables: ["Import worker implementation", "File-state transition diagram", "Idempotency evidence", "Validation/rejection artifact", "Crash/restart recovery evidence"],
        criteria: ["File processing has explicit lifecycle states.", "Duplicate delivery cannot duplicate an authoritative effect.", "Rows are validated through Steward's domain rules.", "Crash recovery is deterministic and demonstrated.", "Rejected input is explainable without leaking sensitive data."],
        questions: ["Why is moving a file into a processing directory useful but insufficient as the only idempotency mechanism?", "Why should the file worker call domain/application logic instead of writing directly to PostgreSQL?"],
    },
    {
        id: "shared-file-boundary",
        title: "Shared Filesystem versus Managed File Transfer",
        intro: "NFS and FTP/SFTP can all move bytes between systems, but they create different coupling. A mounted shared filesystem exposes path and filesystem semantics continuously; managed file transfer exchanges discrete files between independently operated endpoints.",
        practiceTitle: "Integrate the Platform Builder NFS Service Without Confusing It with FTP",
        scenario: "Steward already has the NFS service built in Platform Builder. Use it for an internal trusted batch boundary while the external legacy platform uses managed file transfer. Compare the failure and ownership models rather than treating all file movement as one mechanism.",
        instructions: [
            "Use the existing homelab NFS service as an internal exchange/archive location for one justified Steward component interaction.",
            "Draw separate paths for NFS-mounted access and FTP-delivered files, showing who mounts what and which boundary crosses organizational/system ownership.",
            "Demonstrate how NFS server unavailability differs from an FTP endpoint being unavailable between scheduled transfers.",
            "Document permission/identity coupling for NFS versus transfer-account ownership for FTP.",
            "Decide where processed/rejected/archive files should live now and which part may later move to object storage.",
        ],
        deliverables: ["NFS + transfer integration topology", "Failure comparison", "Identity/permission comparison", "Storage placement decision"],
        criteria: ["NFS and FTP are used for distinct justified responsibilities.", "The learner can explain continuous mount coupling versus discrete transfer coupling.", "The design does not make the external legacy system mount the internal NFS share merely for convenience."],
        questions: ["When is NFS a better fit than managed file transfer?", "What new coupling appears when two applications depend on the same mounted filesystem?"],
    },
    {
        id: "secure-transfer-readiness",
        title: "Secure File Transfer Readiness: SFTP and FTPS",
        intro: "SFTP and FTPS both protect file transfer but are different protocols. SFTP runs over SSH and usually uses a single connection model; FTPS adds TLS to FTP and retains FTP's protocol shape. Security Steward will perform the actual migration after the legacy baseline is understood.",
        practiceTitle: "Prepare the FTP-to-SFTP Migration Contract",
        scenario: "Security policy will prohibit the legacy clear-text FTP path. Prepare a bounded migration design that preserves the Steward file contract and batch semantics while changing only the transport responsibility.",
        instructions: [
            "Compare FTP, explicit/implicit FTPS and SFTP on transport security, port/firewall behavior, identity/credential options, server support and operational compatibility.",
            "Select SFTP as TSA's primary secure file-transfer target unless a documented scenario constraint makes FTPS necessary.",
            "Define what must remain unchanged across migration: file contract, delivery identity, idempotency semantics, acknowledgement/rejection behavior and processing lifecycle.",
            "Define temporary coexistence, cutover, rollback and FTP decommission conditions for the later Security Steward exercise.",
            "Identify evidence the later migration must produce before FTP can be disabled.",
        ],
        deliverables: ["FTP/SFTP/FTPS comparison", "Selected secure-transfer decision", "Migration contract", "Cutover/rollback/decommission criteria"],
        criteria: ["SFTP is not confused with FTP over TLS.", "Migration changes transport without unnecessarily rewriting the batch domain contract.", "Temporary coexistence has an explicit end state.", "The later security exercise has measurable acceptance evidence."],
        questions: ["Why is SFTP not simply secure FTP?", "Which parts of the file integration should remain stable when the transport changes?"],
        resources: [rfc959, opensshSftp],
    },
];

export const enterpriseFileIntegrationDeepLessons: Lesson[] = specs.map(lesson);
