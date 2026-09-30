import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const rfc959: LearningResource = { title: "RFC 959 — File Transfer Protocol", url: "https://www.rfc-editor.org/rfc/rfc959" };
const opensshSftp: LearningResource = { title: "OpenSSH documentation", url: "https://www.openssh.com/manual.html" };
const pythonCsv: LearningResource = { title: "Python csv module", url: "https://docs.python.org/3/library/csv.html" };

interface Spec {
    id: string;
    title: string;
    intro: string;
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[];
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
        { type: "heading", id: `${spec.id}-outcomes`, text: "What you need to reason about", level: 2 },
        { type: "list", items: spec.criteria },
    ];
    for (const section of spec.sections) {
        blocks.push({ type: "heading", id: `${spec.id}-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, text: section.title, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
        if (section.code) blocks.push(section.code.caption
            ? { type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption }
            : { type: "code", language: section.code.language, code: section.code.code });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward integration boundary", body: "This path adds a file-based integration channel because a legacy enterprise dependency cannot consume Steward's REST API. The file channel is not allowed to become a second source of truth: Steward remains authoritative for its domain state and must validate every imported change." });
    blocks.push({ type: "resources", title: "Continue learning", resources: spec.resources ?? [rfc959, opensshSftp, pythonCsv] });

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
        sections: [
            { title: "A file contract has envelope and record semantics", paragraphs: ["The record format is only one part of the interface. The envelope answers which producer created the delivery, which contract version it follows, which business period or sequence it represents, how the consumer knows the upload is complete and how duplicate delivery is recognized. The records answer field names, types, required/optional/null behavior, encoding, delimiter/quoting and stable identifiers.", "Two teams can agree on CSV columns and still fail integration if one writes UTF-8 while another assumes a local encoding, one interprets an empty value as null while another treats it as an empty string, or filenames are reused so replay cannot be distinguished from a new business delivery."] },
            { title: "Identity and authority must survive the file boundary", paragraphs: ["Names are usually poor integration identity because they can change or collide. Exchange stable Steward identifiers and define whether an inbound value is authoritative, a proposal, or reference information. A syntactically valid file must never gain authority to bypass Steward's ownership and domain rules.", "Version the contract independently from filenames chosen for convenience. A consumer should be able to reject an unsupported version deliberately rather than discovering incompatibility halfway through row processing."] },
            { title: "Handoff must distinguish incomplete from complete delivery", paragraphs: ["A consumer must not process bytes while the producer is still writing them. One common convention is to upload under a temporary name and atomically rename into the agreed incoming name only after the transfer completes on the same filesystem. Another managed-transfer workflow may expose an explicit completion marker. The contract must state which event transfers ownership to the consumer.", "Acknowledgement is also part of the protocol: accepted, rejected and partially processed must have defined meaning. A transport-level successful upload does not prove that the business records were accepted."] , code: { language: "text", caption: "One explicit batch handoff", code: "producer: inventory_20260930.csv.part\n       write + close\n       rename → inventory_20260930_v1.csv\n                    ↓ ownership transfers\nconsumer: claim → validate envelope/version → validate records\n                    ↓\n          accepted OR rejected(result artifact)" } },
            { title: "Replay behavior is a contract decision", paragraphs: ["Networks retry and operators resend files. Define a delivery identity such as producer + business date + sequence, optionally strengthened with a checksum. Decide whether an identical replay is ignored, acknowledged as already processed or deliberately reprocessed. If the same identity arrives with different content, treat that as a conflict requiring investigation rather than silently applying it.", "Checksums can detect accidental content change; they do not by themselves authenticate the producer. Transport identity, signatures or other security controls are separate concerns and are deepened later."] },
        ],
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
        sections: [
            { title: "FTP separates control from transferred data", paragraphs: ["The client opens a control connection to the server and sends authentication, navigation and transfer commands there. Directory listings and file contents use separate data connections. A successful control login therefore does not prove that the data path is reachable.", "Troubleshooting FTP requires identifying which channel failed instead of treating the protocol as one connection."] },
            { title: "Active and passive modes change data-connection direction", paragraphs: ["In active mode the client advertises an endpoint and the server initiates the data connection toward the client. Client-side firewalls and NAT often make that awkward. In passive mode the server advertises a data endpoint and the client initiates the data connection, which is generally easier for clients behind NAT.", "Passive mode still requires a deliberately bounded server-side data-port policy; it is not a reason to expose an arbitrary port range."], code: { language: "text", caption: "Control direction stays stable while the data path changes", code: "ACTIVE:  client --control--> server; server --data--> client\nPASSIVE: client --control--> server; client --data--> server" } },
            { title: "Treat FTP as a legacy compatibility constraint", paragraphs: ["Traditional FTP does not provide transport confidentiality for credentials or content. TSA operates it only in a constrained learner-owned environment to understand a legacy enterprise dependency, not as a recommended modern transport.", "Dedicated accounts, narrow directories and restricted network exposure reduce blast radius but do not turn clear-text FTP into a secure protocol. Later migration should preserve the already-defined file contract while replacing the transport."] },
            { title: "Transport success is not business acceptance", paragraphs: ["A completed byte transfer still needs the agreed completion handoff, file/version validation and Steward domain validation. Invalid credentials, control-channel success with data-channel failure, interrupted transfer, filesystem permission failure and business rejection are different failure classes and should produce different evidence."] },
        ],
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
        sections: [
            { title: "The file itself has a processing state machine", paragraphs: ["Treat arrival, claim, validation, processing and completion as explicit states rather than one loop that scans a directory. A useful lifecycle might be incoming → processing → processed or rejected, with archive/retention handled deliberately. The transition into processing establishes which worker owns the delivery.", "Moving or renaming a file can be a useful atomic claim when the filesystem semantics support it, but directory position alone is weak durable business evidence. Persist the delivery identity and processing outcome so a restart can distinguish new, in-progress and already-applied work."] , code: { language: "text", caption: "Separate transport arrival from processing outcome", code: "transfer complete\n      ↓\n  INCOMING\n      ↓ atomic claim\n PROCESSING ── validation failure ─→ REJECTED\n      │\n      ├─ crash → recovery examines durable delivery state\n      ↓\n domain effects committed\n      ↓\n PROCESSED → retention/archive" } },
            { title: "Idempotency protects effects, not just file names", paragraphs: ["Idempotency means processing the same logical delivery again does not create an additional business effect. A filename alone is unsafe if producers can rename or regenerate deliveries. Define a stable idempotency identity and store it durably alongside processing status.", "Row-level effects may also need stable identities when partial processing is possible. The design must answer what happens if rows 1–50 commit and the worker dies on row 51: roll back the whole file, resume deterministically, or record row outcomes. The correct choice depends on the business contract, but ambiguity is not acceptable."] },
            { title: "Validate in layers before changing authoritative state", paragraphs: ["First validate the file envelope: producer, version, expected delivery identity and basic integrity. Then parse records and validate structural fields. Finally apply Steward domain rules and authorization/authority rules through application services rather than direct uncontrolled SQL writes.", "A rejected record should produce a stable non-sensitive identifier and reason. Do not make operators infer failure from a stack trace, and do not leak secrets or unnecessary personal data into rejection artifacts."] },
            { title: "Crash points define the recovery design", paragraphs: ["Reason explicitly about failure before claim, after claim, after some domain changes and after all effects but before the success marker is persisted. If the durable idempotency record and domain mutation are not coordinated, a restart can either lose work or duplicate it.", "System Thinker does not assume exactly-once execution. Instead, design at-least-once attempts plus idempotent effects or a transaction boundary that makes the chosen unit atomic where feasible, then prove the behavior by killing the worker at controlled points."] },
        ],
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
