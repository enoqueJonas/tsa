// Cloud module 6: split an overloaded introduction into six focused real-protocol readings.
// Keep all original activity IDs -001 through -005 and original practicals.
export type ObjectFocusSection={heading:string;paragraphs:string[]};
export type ObjectFocusReading={id:string;title:string;estimatedMinutes:number;body:string;sections:ObjectFocusSection[]};
export const objectStorageFocusedReadings:ObjectFocusReading[]=[
  {
    "id": "cloud-object-storage-implementation-006",
    "title": "Object identity: buckets, keys and application references",
    "estimatedMinutes": 55,
    "body": "Separate the application record, object-store identifier and filesystem semantics before uploading evidence.",
    "sections": [
      {
        "heading": "Explain why a bucket/key is not a POSIX path",
        "paragraphs": [
          "An S3-compatible store organizes objects by bucket and key. A key may contain slash characters such as reports/team-a/id-47.txt, but those characters are naming convention rather than a hierarchical filesystem API with directory ownership, POSIX rename, open file handles or advisory locks. A request retrieves one object representation, and upload usually replaces the visible current representation at that key according to the store's semantics. Applications cannot safely treat this like append-in-place on a mounted drive.",
          "In Steward, PostgreSQL remains the authoritative place for export owner, request status, logical export ID, content checksum and the authorized user. Object storage holds the bytes. A durable record should bind logical export ID to bucket/key and—when versioning is used—the version ID. Do not use a guessed human file name as a unique object key, and do not assume that knowing the key grants permission to read it."
        ]
      },
      {
        "heading": "Design for identity collision and multi-tenant isolation",
        "paragraphs": [
          "Two users can independently request a report named service-list.csv. If the object key is only reports/service-list.csv, the second upload can replace the first. Allocate stable identity before generation, such as reports/<owner-id>/<export-id>/content.csv, and reject unsupported characters or path-like user input before choosing the key. Use server-generated IDs, not a user-supplied display name, to distinguish objects. A prefix is a naming and policy aid, not an access-control check by itself.",
          "Test both legitimate and maliciously similar prefixes: reports/team-a/file.txt must be allowed only to Team A, while reports/team-a-private/file.txt must not inherit Team A access simply because its name starts similarly. Validate ownership in Steward before issuing a download and separately prove the actual storage identity is denied by policy when it tries to cross the boundary."
        ]
      },
      {
        "heading": "Observe a lifecycle boundary that is not the database transaction",
        "paragraphs": [
          "An export request may create a PostgreSQL status row, generate bytes, upload an object and then update the row with its storage location. A database transaction does not atomically commit a remote object write. If the upload fails, marking the export ready produces a permanently broken user experience. If an upload succeeds but the DB commit fails, a versioned orphan may remain and need reconciliation.",
          "Model the state transitions PENDING → UPLOADING → AVAILABLE only after an acknowledged object persistence and checksum; keep a recoverable FAILED/RETRYABLE state when S3 is unavailable. Design an idempotent export ID and bounded retry so restarting a worker does not silently overwrite someone else's evidence. Later Reliability work must add reconciliation and orphan cleanup instead of assuming any two remote systems form one atomic transaction."
        ]
      }
    ]
  },
  {
    "id": "cloud-object-storage-implementation-007",
    "title": "S3 consistency, overwrite and versioned recovery",
    "estimatedMinutes": 60,
    "body": "Distinguish an object key from an immutable version, and test the chosen store's visibility guarantees.",
    "sections": [
      {
        "heading": "Follow PUT, GET, HEAD and LIST as separate API operations",
        "paragraphs": [
          "A successful S3 PutObject returns an API result; a later GetObject retrieves bytes for one bucket/key, while HeadObject returns metadata without transferring the full body. ListObjectsV2 enumerates visible keys under a chosen prefix but does not implement POSIX directory listing or object locks. The consistency guarantee defines when these operations reflect a recent put, overwrite or delete. Modern Amazon S3 documents strong consistency for relevant operations, but a different S3-compatible implementation must be evaluated against its own documented version and configuration.",
          "Build a test using a uniquely named disposable key: PUT synthetic payload A, GET and checksum it, overwrite with B, GET again, HEAD and LIST as needed, then delete and observe the actual status. Record success and visibility for the specific server and version rather than asserting all S3 stores have identical semantics or reporting timing that was never measured."
        ]
      },
      {
        "heading": "Explain version IDs and delete markers without promising backup",
        "paragraphs": [
          "When bucket versioning is enabled, each normal write to the same key can create a new immutable version identifier. GetObject with an explicit VersionId can retrieve a prior representation even when the latest visible object has changed. A normal delete in a versioned bucket may create a delete marker, making unversioned GET return not found while earlier versions remain individually retrievable. Permanent version deletion or lifecycle expiry can still remove those bytes.",
          "The real MinIO exercise enables versioning on its dedicated disposable bucket, stores synthetic A and B at the same key, verifies two version IDs, then requires GET of A by its old ID. It adds a delete marker, observes a failed latest GET, retrieves the old version and restores a visible copy. That proves those particular API behaviors on the tested server; it does not prove cross-region recovery, account loss protection, backup retention or automatic incident repair."
        ]
      },
      {
        "heading": "Make expected failures observable rather than treating every 404 alike",
        "paragraphs": [
          "A client may see NoSuchKey because a key was never created, because a delete marker is current, because a malformed version ID was requested or because a policy intentionally obscures existence. The same visible error message need not carry the same operational meaning. Check the resource, returned error code, versioning status and action scope rather than assuming a missing object is proof of lost bytes.",
          "For Steward, record a legitimate exporter identity, bucket and key from PostgreSQL, and any exact version ID that the business process promises. During recovery, restore only an authorized version after confirming its SHA-256 and owner; a blind latest-version copy could reintroduce stale or unauthorized content. Keep a separate protected backup or replication policy if RPO/RTO require survival beyond one versioned bucket."
        ]
      }
    ]
  },
  {
    "id": "cloud-object-storage-implementation-008",
    "title": "IAM, SigV4 and presigned object capabilities",
    "estimatedMinutes": 65,
    "body": "Distinguish signed S3 requests, application authorization, scoped storage permissions and temporary bearer URLs.",
    "sections": [
      {
        "heading": "Trace who is allowed to sign which API request",
        "paragraphs": [
          "An S3 client typically signs requests using its configured credentials and the SigV4 process. The server evaluates that credential identity, operation, bucket/key and configured policies. A 403 for an invalid signature is authentication failure; it does not prove that a valid runtime identity lacks DeleteObject on a real policy. A separate least-privilege policy test must authenticate as the intended runtime identity and check allowed put/get alongside a forbidden delete or cross-tenant get.",
          "The real disposable fixture deliberately uses an ADMIN training identity for creating buckets and changing versioning; it does NOT demonstrate safe production credentials. In the learner's homelab exercise, create a distinct non-admin Steward identity, scope it to the correct bucket/prefix, require a necessary operation to succeed and a forbidden operation to be denied. Never embed long-lived storage secrets into a browser, exported file or Git history."
        ]
      },
      {
        "heading": "Presigned URLs are temporary bearer capabilities, not user sessions",
        "paragraphs": [
          "A presigned GET URL contains signing material that permits a limited HTTP request to a specific bucket/key until its validity expires or other controls invalidate the signer. The recipient can use the URL without having the signer's long-lived keys. Because possession may authorize use, leaking it in logs, chat, analytics or referrer headers can expose data during its lifetime. A signed URL does not independently verify that a particular Steward user is allowed to see an export.",
          "Require Steward to perform its user/team authorization before generating the URL. Make the operation GET-only, scope one concrete object/version, choose a short justified expiry and avoid printing the full URL. The real MinIO lab generates a SigV4 URL and successfully downloads through unsigned HTTP to the local server after a separate application guard; the guard is an explicit teaching model and must be replaced by actual Steward permissions in the integration lab."
        ]
      },
      {
        "heading": "Separate credential denial from network and business denial",
        "paragraphs": [
          "A deliberately invalid access key or signature should result in an authentication error from the reachable object store, while DNS failure, connection refusal or timeout proves that no successful policy decision was necessarily made. An authenticated identity receiving AccessDenied on DeleteObject demonstrates an authorization boundary, but a local code function that returns False does not substitute for a bucket policy on the server.",
          "Write an evidence table with caller identity, action, resource, expected HTTP/code, observed result and what the result can actually establish. Do not invent an IAM principal from a successful admin upload. The implementation lab remains incomplete until a non-admin identity is observed on the actual S3 service, and a prohibited action fails because of effective policy rather than an unavailable endpoint."
        ]
      }
    ]
  },
  {
    "id": "cloud-object-storage-implementation-009",
    "title": "End-to-end object integrity beyond ETag",
    "estimatedMinutes": 55,
    "body": "Trace bytes across generation, signed PUT, at-rest persistence and retrieval using an explicit digest contract.",
    "sections": [
      {
        "heading": "Define one content digest that Steward owns end to end",
        "paragraphs": [
          "Steward generates a byte sequence and calculates SHA-256 before storage. After upload, a retrieved byte sequence can be hashed again and compared to the expected SHA-256 stored in an authoritative record. Comparing only content length, a successful HTTP status, or a loosely documented ETag is not sufficient to detect every replacement. For multipart uploads and some encryption modes, an S3 ETag may not equal the file's MD5 and is not generally the application's SHA-256.",
          "The real boto3 experiment stores a synthetic SHA-256 in object metadata and independently hashes bytes retrieved by GetObject. It tests that two successive versions return the correct representations. That is an integrity check for this transaction, not proof that the remote server cannot be compromised or that it will retain the object forever."
        ]
      },
      {
        "heading": "Make corruption and wrong-key behavior fail visibly",
        "paragraphs": [
          "If the requested key is correct but its bytes have changed, a checksum mismatch must fail the export verification rather than silently accepting 'some object'. If the key points to another team's blob, a cryptographically correct checksum still does not authorize disclosure. Integrity, identity and authorization are three independent requirements and each needs its own negative case.",
          "Take a disposable copy of the real lab and deliberately alter expected payload bytes or corrupt the saved digest; the assertion must fail. Keep a separate negative test where a Team A request asks for the Team B prefix and the application refuses to mint a download URL. If a live S3 service returns an ETag with a familiar shape, record it only as an HTTP/object metadata field unless the chosen implementation explicitly specifies its checksum contract."
        ]
      },
      {
        "heading": "Plan multipart, retries and large export costs explicitly",
        "paragraphs": [
          "Large uploads may use multiple parts, parallelism and independent retries; partial uploads can consume storage until aborted or expired. If the source stream cannot be reread, a failed part may require regenerating the export and choosing a stable identity/retry policy. Encryption, network bandwidth and object size may alter checksums, ETag formats and costs. A one-line PutObject for a small local fixture deliberately avoids those complications.",
          "For a production-oriented Steward export, state size thresholds, retry limits, failed multipart cleanup, how a digest is computed before upload and how a consumer verifies it. Include the server-returned status and exact VersionId where applicable. Classify multipart and encrypted-object behavior NOT_TESTED until exercised against the actual chosen server rather than extrapolating from a tiny example."
        ]
      }
    ]
  },
  {
    "id": "cloud-object-storage-implementation-010",
    "title": "Retention, outages, backup and object-store recovery",
    "estimatedMinutes": 70,
    "body": "Identify which state survives a restart, delete or account outage, and distinguish a recoverable version from an independent backup.",
    "sections": [
      {
        "heading": "A persisted volume is not a durable recovery plan",
        "paragraphs": [
          "An S3-compatible server may store object data in an attached disk volume that survives a container restart, yet still lose data after a disk failure, accidental permanent deletion, account compromise or provider-region outage. Versioning protects selected overwrite/deletion cases while retention, replication and backup address different risks. A completed lifecycle policy can destroy valid evidence on schedule; its rule must match legal and business retention requirements.",
          "The runnable real MinIO lab uses a Docker-backed volume controlled by its CI harness, restarts the same disposable container and retrieves the previously written bytes and SHA-256. That is a narrow process-restart durability observation. It does not test independent media loss, restore from backup, multi-node failure, ransomware, lifecycle expiry, legal hold or point-in-time recovery."
        ]
      },
      {
        "heading": "Treat a failed PUT as failed persistence, not a successful export",
        "paragraphs": [
          "If the S3 endpoint becomes unreachable, the uploader may receive a connection error or timeout after some bytes have been transmitted. It must not mark the export AVAILABLE unless it has a sufficiently strong confirmation and can reconcile ambiguous results. For retries, use an idempotent identity, check current status/version and avoid publishing a success record that refers to missing data.",
          "The learner source deliberately attempts to PUT synthetic data to a closed loopback port and confirms the operation is not treated as committed. It also tests invalid credentials against the real reachable S3 API. These prove two failure classes but do not demonstrate actual application retry behavior, queue redelivery or a real failover. In Steward, separately test the API/export status transition when the chosen object store is isolated."
        ]
      },
      {
        "heading": "Choose a recovery point and prove the requested object identity",
        "paragraphs": [
          "After deletion with versioning, restoring an older version requires an operator to select the correct version ID, verify that the bytes belong to the authorized export and make the intended representation visible. A successful GET of an older version is not evidence that the business workflow has reconciled its PostgreSQL status. If the entire bucket or account disappears, old versions in the same system may be unavailable and an independent backup or replication strategy is required.",
          "Define RPO/RTO for evidence objects, administrative identities that may restore them, and a safe way to validate a restored copy without overwriting production. Record the chosen recovery point, computed SHA-256, owning export ID, elapsed restore time and client-visible behavior. Distinguish this real future drill from the automatic MinIO container restart in CI."
        ]
      }
    ]
  },
  {
    "id": "cloud-object-storage-implementation-011",
    "title": "Live S3 lab: versioning, signed requests, denial and restart",
    "estimatedMinutes": 95,
    "body": "Run the exact learner source against a dedicated loopback MinIO instance; capture protocol evidence without claiming the real Steward homelab is complete.",
    "sections": [
      {
        "heading": "Prepare an isolated server and explicit test credentials",
        "paragraphs": [
          "Prerequisites: Docker with an accessible local MinIO image, Python 3 and boto3, a disposable bucket named tsa-lab- followed by eight to twenty-four lowercase letters/digits, and four test-only environment variables TSA_S3_ENDPOINT, TSA_S3_BUCKET, TSA_S3_KEY and TSA_S3_SECRET. Use an endpoint in the form http://127.0.0.1:PORT. Bind MinIO's API only to host loopback and give it a dedicated persistent test volume. Do not reuse a banking, personal or production bucket or any real IAM credentials.",
          "The code below refuses a non-loopback endpoint and a bucket without the disposable prefix. It uses an admin test identity only for creating a bucket and setting versioning, so passing the script does not satisfy the separate practical requirement to create a restricted Steward runtime identity. The CI harness handles Docker start/restart/cleanup; a learner running it manually must start the server separately, install boto3 and supply their own disposable credentials."
        ]
      },
      {
        "heading": "Run real versioning, authorization-boundary and integrity checks",
        "paragraphs": [
          "Execute the published Python with argument exercise. It creates the disposable bucket, enables versioning, writes approved synthetic bytes, verifies SHA-256 on retrieval, overwrites the same key, retrieves its prior version ID, creates a delete marker, recovers older bytes and mints a short-lived presigned GET only after a local Team A guard. It makes a deliberately bad-signature request to the real server and checks that the server denies it. A second request targets a deliberately unreachable loopback port and must never be treated as completed persistence.",
          "Expected S3_REAL_* markers distinguish actual signed S3 API evidence from S3_APPLICATION_GUARD_* markers, which show a local authorization model only. For real least-privilege evidence, use a distinct non-admin identity and test an action that policy forbids—bad credentials are not enough. Never paste a presigned bearer URL or private key into the audit report. An AWS account or public endpoint is unnecessary for this lab."
        ]
      },
      {
        "heading": "Restart the real service and verify stored bytes independently",
        "paragraphs": [
          "After the exercise phase finishes, restart the disposable MinIO container while retaining the same dedicated volume. Once its health endpoint reports ready, rerun the exact same Python source with argument verify and the same bucket name. The verifier reads the stable object, checks exact bytes and SHA-256, and reports S3_REAL_RESTART_PERSISTED_BYTES_AND_SHA256_VERIFIED. A fresh container with no volume or a changed bucket must fail; no false recovery claim should appear.",
          "This is not a completed real Steward export integration, real authorization policy, S3 multipart semantics, independent backup restore or production high availability. Those remain in original practicals -002 through -004. The source tests enforce the learned API mechanics and specific failure cases; the original reflection -005 still requires an independent human answer rather than synthetic progress."
        ]
      }
    ]
  }
];
export const objectStorageExtraPractices:Record<string,string[]>={
  "cloud-object-storage-implementation-002": [
    "Run the focused -011 local MinIO S3 exercise on a dedicated loopback instance, but record that its training admin identity is not the required restricted runtime identity. Create a separate real non-admin account for the original practical and prove one allowed operation and one forbidden action from that identity.",
    "Use a dedicated volume and restart the S3 service without deleting it. Independently retrieve the exact object and its SHA-256 after the restart; also state which whole-volume/account failure and true backup restore this does not prove."
  ],
  "cloud-object-storage-implementation-003": [
    "Capture the actual S3 VersionId, object key and SHA-256 separately from Steward's authorized owner/export ID. When one upload fails, keep the export status failed or pending; do not claim a remote object put and local DB update are atomic.",
    "Run a real signed GET from the local fixture after a Team A authorization decision, then demonstrate the corresponding Team B request is rejected by real Steward policy before signing. A local prefix function is only a model, not production authorization."
  ],
  "cloud-object-storage-implementation-004": [
    "Use a versioned disposable key to demonstrate overwrite, delete marker, old-version retrieval and authorized recovery, then compare this to an independent backup or whole-bucket restoration. Do not call a process restart a backup restore.",
    "Test invalid signature denial separately from unreachable endpoint, and explain why neither proves denial by an effective scoped runtime policy. After recovery, verify a previously persisted object by exact bytes and independently calculated SHA-256."
  ]
};
