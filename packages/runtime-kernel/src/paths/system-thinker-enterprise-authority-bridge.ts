import type {LearningResource} from "../activities/content";
type EnterpriseBridgeSection={title:string;paragraphs:string[];code?:{language:string;caption:string;code:string}};
// OBS-01 is a fictional teaching scenario; it does not establish approved ownership-transfer policy.
export const enterpriseBridgeBySpec:Record<string,EnterpriseBridgeSection[]> = {
  "contract": [
    {
      "title": "OBS-01 — a CSV record is evidence, not an ownership command",
      "paragraphs": [
        "The previous Data Flow module ended with a fictional OBS-01 service-owner lookup, a proposed ownership transfer and an unresolved decision D-01 about who may approve that transfer. The legacy governance platform now supplies a nightly inventory file. Define its rows as observations or change requests; do not equate the file producer with the authoritative transfer approver. An inbound row containing `service_id,proposed_owner_team_id` may be structurally valid while the proposed Team is forbidden by Steward's domain policy.",
        "The record envelope needs stable producer identity, business date, sequence, contract version, checksum and completion marker. A consumer first identifies delivery, then verifies the contract, then validates each proposed business action with trusted actor/approval evidence. The producer may know which Team appears in its system but that alone does not give it rights to overwrite the owning Team in PostgreSQL. Mark all directory/approval integrations proposed until actual policy D-01 is resolved."
      ],
      "code": {
        "language": "text",
        "caption": "Fictional inbound file contract; no permission is implied by the CSV",
        "code": "delivery_id=legacy-registry/2026-11-02/004\ncontract_version=owner-review-v1\nfinal_name=owner_review_20261102_004.csv\nsha256=<computed from actual complete bytes>\n\nservice_id,proposed_owner_team_id,proposal_id\nsvc-123,team-b,prop-007\n\nreceipt != parse success != proposal accepted != authorized owner transfer\nIf D-01 approval cannot be verified: do not mutate Service.owner_team_id"
      }
    },
    {
      "title": "Two deliveries with the same ID are not two approvals",
      "paragraphs": [
        "Test three distinct cases: the same delivery identifier and same byte checksum arrives twice, the same delivery identifier arrives with a different checksum, and a new delivery proposes a forbidden Team change. The first follows the documented identical-replay response without a second domain effect. The second is a contract conflict, even if CSV rows are individually valid. The third is a domain authorization rejection independent of transport success.",
        "Independent practice: write an acceptance report with separate statuses for transport receipt, envelope validity, each row's application result and the final delivery state. Explain why returning one generic `accepted` value would hide a partially rejected file. If a real Steward mutation has not been executed with the proper policy context, mark business application UNVERIFIED."
      ]
    }
  ],
  "batch-lifecycle": [
    {
      "title": "Trace a crash across file, row and database boundaries",
      "paragraphs": [
        "A file moving from incoming to processing is a claim, not proof of durable row effects. Consider a three-row OBS-01 review batch: row 1 is applied, row 2 references an unknown Service, and the worker crashes before row 3. A filesystem rename may be atomic within one filesystem, but it does not wrap the three database mutations in one transaction. Choose whether the file is all-or-nothing, per-row committed, or staged pending approval, and make that contract visible before writing recovery logic.",
        "To recover per-row processing, persist a stable business delivery ID plus row identity and disposition in the same local transaction as each authorized domain effect. On restart, replay only unfinished rows, re-emit the same completed result for processed rows and keep rejected rows separate from transport faults. This is a design requirement to verify against a live Steward adapter; the current teaching file/SQLite replay experiment alone does not prove the complete application workflow."
      ],
      "code": {
        "language": "text",
        "caption": "Recovery table for an explicitly hypothetical per-row commit policy",
        "code": "row 1: permitted, SQL effect+row outcome COMMITTED -> retry reads prior outcome\nrow 2: unknown Service, REJECTED -> no domain effect, reason recorded\nrow 3: not attempted before process crash -> retry validation and policy\nfile delivery: PARTIAL / needs final decision, never silently SUCCESS\nCRITICAL: row identity must be stable; checksum collision/changed intent => conflict"
      }
    },
    {
      "title": "Choose between per-file and per-row atomicity deliberately",
      "paragraphs": [
        "All-or-nothing file processing may use a single local database transaction if the file is bounded and every row shares one authoritative store; it makes recovery simpler but can hold locks and roll back valid records because one row is invalid. Per-row processing isolates bad records, but requires a stable result ledger, transparent partial status and explicit business policy for when the producer may correct and resend a row.",
        "A successful checksum verifies equality to the expected bytes, not producer authenticity. If the expected checksum is delivered by an unauthenticated source, an attacker can replace both file and checksum. Independently select one processing contract for a small daily inventory and defend the atomicity scope, security assumption, rejection artifact and restart behavior; never claim a filesystem handoff is a distributed transaction."
      ]
    }
  ],
  "shared-file-boundary": [
    {
      "title": "Transport migration changes a trust boundary, not the business contract",
      "paragraphs": [
        "Compare an NFS-mounted inbox, legacy FTP and managed SFTP for this same owner-review file. NFS exposes shared storage semantics and filesystem permission/mount failure; FTP transports bytes with separate control/data channels but no default encryption; SFTP tunnels transfer through SSH identity and host-key verification. None of these technologies authenticates an individual business approver or validates a proposed owner transfer for Steward.",
        "Before deciding to migrate from FTP to SFTP, hold constant the file envelope, stable delivery ID, row schema, quarantine/acceptance vocabulary and deduplication rules. Only then compare protocol-level confidentiality, host trust, automation credentials, transfer completion, user/key rotation and operations. Challenge the proposed architecture if someone introduces a new domain writer simply because a managed SFTP gateway is available."
      ]
    }
  ],
  "secure-transfer-readiness": [
    {
      "title": "Prove the security change does not manufacture authority",
      "paragraphs": [
        "The pinned-host-key SFTP exercise proves which SSH host the client connected to and whether its public-key identity was accepted. It does not prove that the uploaded CSV came from an approved domain officer, that its Team membership assertions are current, or that Steward should apply its content. A server may be honest about transport yet carry a malformed, duplicated or unauthorized business proposal.",
        "Operational readiness must therefore include two separate review gates: transport trust (approved fingerprint, key-rotation procedure, dedicated remote account, bounded directory and refusal tests) and application authority (verified producer mapping, delivery identity, forbidden Team case, row rejection and recovery proof). Keep the Security Steward migration as a future acceptance dependency; the disposable AsyncSSH loopback test is not a vendor security sign-off."
      ]
    },
    {
      "title": "Evidence required before retiring the FTP endpoint",
      "paragraphs": [
        "Create a cutover matrix for a known-good final file, partial `.part` upload, incorrect host key, revoked client key, identical replay, changed-content replay, invalid contract version and unauthorized owner proposal. A transport migration passes only if each case has an observable result and a named operational or business owner for unresolved failures.",
        "Stop condition: if the SFTP endpoint works but downstream Steward acceptance and replay remain unverified, do not retire FTP solely on a successful encrypted upload. Document a rollback window, route ownership, in-flight delivery identity reconciliation and credential revocation plan; avoid dual ingestion that can apply the same business change twice."
      ]
    }
  ]
};
export const enterpriseBridgeReferences:Record<string,LearningResource[]> = {
  "contract": [
    {
      "title": "Python CSV reader — record parsing and newline/encoding rules",
      "url": "https://docs.python.org/3/library/csv.html",
      "kind": "reference"
    }
  ],
  "batch-lifecycle": [
    {
      "title": "PostgreSQL transactions and atomicity",
      "url": "https://www.postgresql.org/docs/current/tutorial-transactions.html",
      "kind": "reference"
    }
  ],
  "shared-file-boundary": [
    {
      "title": "OpenSSH SFTP and SSH trust documentation",
      "url": "https://www.openssh.com/manual.html",
      "kind": "reference"
    }
  ],
  "secure-transfer-readiness": [
    {
      "title": "AsyncSSH SFTP API — protocol scope of the local lab",
      "url": "https://asyncssh.readthedocs.io/en/latest/api.html",
      "kind": "reference"
    }
  ]
};
