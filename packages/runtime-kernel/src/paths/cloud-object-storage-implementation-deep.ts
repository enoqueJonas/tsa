import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const awsS3: LearningResource = { title: "Amazon S3 User Guide", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" };
const minio: LearningResource = { title: "MinIO documentation", url: "https://min.io/docs/minio/linux/index.html" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "Object storage is already part of the Cloud Engineer mental model. This path closes the implementation-depth gap: Steward must now use a real S3-compatible service for data that genuinely fits bucket/key/API semantics." },
    { type: "heading", id: "object-storage-boundary", text: "Choose the storage model deliberately", level: 2 },
    { type: "list", items: [
        "PostgreSQL remains authoritative relational application state.",
        "NFS/SMB provide mounted shared-file semantics where a filesystem contract is required.",
        "Nexus distributes versioned software artifacts and packages.",
        "S3-compatible object storage holds durable blobs such as generated exports, evidence bundles, report archives or selected backup artifacts."
    ] },
    { type: "callout", tone: "steward", title: "Primary learning implementation", body: "Run one learner-owned S3-compatible implementation in the homelab, using MinIO or another compatible implementation that exposes the required S3 semantics. Provider S3 can be compared later; the exercise must not depend on buying a cloud account." },
    { type: "resources", title: "Continue learning", resources: [awsS3, minio] },
];

export const objectStorageImplementationDeepLessons: Lesson[] = [
    {
        id: "cloud-object-storage-implementation",
        title: "S3-Compatible Object Storage for Steward",
        activities: [
            { id: "cloud-object-storage-implementation-001", title: "From Object-storage Design to Operation", estimatedMinutes: 45, content: { type: "reading", body: "Implement object storage only after identifying a Steward workload whose semantics justify it.", blocks } },
            {
                id: "cloud-object-storage-implementation-002",
                title: "Deploy and Secure the Object Store",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Operate a real S3-compatible object store in the TSA homelab.", scenario: "Steward produces durable export/evidence bundles that must survive application restarts and should not live in the API container filesystem or be treated as software packages in Nexus.", instructions: [
                    "Select a learner-owned S3-compatible implementation such as MinIO and document why it satisfies the learning boundary.",
                    "Deploy it with explicit persistence, network/DNS and recovery assumptions; do not leave important data inside an ephemeral container layer.",
                    "Create a bounded Steward bucket and a key-prefix/naming strategy that identifies environment, object type and stable object identity without pretending prefixes are POSIX directories.",
                    "Create separate administrative and Steward runtime identities. Give the runtime only the bucket/object actions required by the selected use case.",
                    "Prove allowed put/get/list behavior and at least one denied operation caused by policy rather than a broken client.",
                    "Enable transport protection appropriate to the homelab and ensure credentials are not committed, logged or embedded in object names/metadata.",
                    "Record capacity/persistence assumptions and how the service itself would be backed up or reconstructed."
                ], deliverables: ["Object-store topology", "Persistence configuration", "Bucket/key contract", "Least-privilege policy", "Allowed/denied access evidence", "Recovery responsibility note"], completionCriteria: ["A real S3-compatible service is running and reachable by a non-admin Steward identity.", "Object data survives a normal service/container restart.", "Least privilege is demonstrated with both success and denial evidence.", "The learner can explain why this data belongs in object storage instead of PostgreSQL, NFS or Nexus."] },
            },
            {
                id: "cloud-object-storage-implementation-003",
                title: "Integrate Steward Export Evidence",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Make object storage part of a real Steward workflow rather than an isolated storage demo.", scenario: "An authorized Steward user requests a service-inventory export/evidence bundle. The generated blob must be retained independently of the API process and retrievable by stable metadata without turning the object store into Steward's relational database.", instructions: [
                    "Implement or adapt one bounded Steward workflow that writes the generated export/evidence object through the S3 API.",
                    "Keep business metadata and authorization decisions in Steward/PostgreSQL where appropriate; store the blob and object-specific metadata in object storage.",
                    "Persist the object key/reference needed to retrieve the blob without exposing storage administrator credentials to clients.",
                    "Retrieve the object through an authorized Steward path and prove an unauthorized user cannot obtain another team's protected export.",
                    "Upload two objects with intentionally similar human names and prove stable keys/identities avoid accidental overwrite.",
                    "Define integrity verification using checksums/ETag semantics appropriate to the client and implementation rather than assuming an ETag is always a simple MD5.",
                    "Capture end-to-end evidence from request/generation through object persistence and retrieval."
                ], deliverables: ["Steward object-storage integration", "Object-reference model", "Authorization evidence", "Overwrite/integrity evidence", "End-to-end workflow record"], completionCriteria: ["Steward actually writes and retrieves a real object through the S3-compatible API.", "The blob is not stored in the application container filesystem as the authoritative copy.", "Application authorization remains explicit rather than being delegated accidentally to knowledge of an object key.", "The object reference remains stable and collision behavior is understood."] },
            },
            {
                id: "cloud-object-storage-implementation-004",
                title: "Operate Lifecycle, Failure and Recovery",
                estimatedMinutes: 150,
                content: { type: "practical", objective: "Exercise object-storage lifecycle and failure semantics under controlled pressure.", scenario: "Exports accumulate, credentials can be wrong, and the object store can become unavailable. Steward must have explicit retention and degradation behavior rather than assuming durable storage is infallible.", instructions: [
                    "Define and implement a retention/lifecycle rule for the selected object class, using a safe short-lived test prefix/object where needed to prove behavior.",
                    "If versioning is supported and justified for the exercise, enable it on a bounded bucket/test path and demonstrate recovery from an overwrite or deletion; otherwise document the chosen deletion-recovery boundary.",
                    "Stop or isolate the object store during an attempted Steward write/read. Observe timeout/error behavior and ensure the application does not claim the export succeeded when persistence failed.",
                    "Test invalid/revoked runtime credentials and distinguish authorization failure from service unavailability.",
                    "Recover service and verify previously committed objects remain readable.",
                    "Compare this failure with an NFS outage and explain how API/object semantics change application handling.",
                    "Add the object store to the appropriate backup/recovery and observability inventory for later Reliability work."
                ], deliverables: ["Lifecycle/retention evidence", "Deletion/overwrite recovery evidence or explicit boundary", "Outage investigation", "Credential-failure evidence", "Recovery verification", "Object-vs-file failure comparison"], completionCriteria: ["Retention/lifecycle behavior is implemented rather than only diagrammed.", "Steward distinguishes failed object persistence from successful business completion.", "At least two failure classes are reproduced and diagnosed.", "Previously committed data is verified after service recovery.", "The learner can distinguish object-store outage behavior from mounted-file-service failure." ] },
            },
            { id: "cloud-object-storage-implementation-005", title: "Defend the Storage Architecture", estimatedMinutes: 20, content: { type: "reflection", prompt: "Defend the Steward data placement across PostgreSQL, NFS/SMB, Nexus and S3-compatible object storage. Explain the object key and access-policy design, lifecycle/recovery boundary, one failure you reproduced, and what evidence would justify migrating the homelab implementation to a managed cloud object store later.", minimumCharacters: 350 } },
        ],
    },
];
