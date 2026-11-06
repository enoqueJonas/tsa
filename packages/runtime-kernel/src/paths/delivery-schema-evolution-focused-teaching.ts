// Future learner scope only: Delivery Engineer module 9, not previously studied Builder PostgreSQL.
// Original IDs -001 through -006 are preserved. Three focused new readings precede existing practicals.
export type SchemaFocusedSection={heading:string;paragraphs:string[]};
export type SchemaFocusedReading={id:string;title:string;estimatedMinutes:number;body:string;sections:SchemaFocusedSection[]};
export const schemaFocusedReadings:SchemaFocusedReading[]=[
  {
    "id": "delivery-production-schema-evolution-007",
    "title": "Compatibility before migration: old and new applications",
    "estimatedMinutes": 50,
    "body": "Understand why a schema transition is not one atomic deployment and define who remains compatible.",
    "sections": [
      {
        "heading": "Identify the independently changing systems",
        "paragraphs": [
          "During a rolling release, application instances, background workers, SQL schema, existing rows and rollback candidates do not advance atomically. An old API replica can still execute SELECT owner_name while a new replica wants owner_team_id. Before writing a migration, inventory actual readers/writers, scheduled jobs, payload contracts and the support window for old application builds. A passing migration command cannot tell you which clients are still alive.",
          "Expansion introduces a new nullable representation while keeping all queries and writes used by old clients valid. The compatibility phase must define whether old or new ownership is authoritative, whether both representations are written, and what happens when a mapping is missing. Contract, by contrast, is intentionally destructive and must not be an automatic follow-up to a successful migration."
        ]
      },
      {
        "heading": "Work a complete ownership-representation transition",
        "paragraphs": [
          "Begin with service(id, owner_name) holding values like Team A. The new model needs owner_team_id, a stable integer key. Add owner_team_id as nullable without renaming or dropping owner_name. Define an explicit name-to-ID mapping, including ambiguous and unknown owners. Deploy compatibility-capable code that maintains both representations during overlap; do not assume a database default or a backfill can replace live dual-write correctness.",
          "Backfill historical rows in bounded transactions only after deciding how application writes during the migration interact with it. Verify every row's actual mapping rather than merely counting non-null values. Switch readers only when verified and observed; contract owner_name only after old clients and rollback paths are retired. In Django, this ordinarily requires separate migrations and release stages, not one automatically generated migration script."
        ]
      },
      {
        "heading": "Recognize lock and recovery boundaries before touching production",
        "paragraphs": [
          "A PostgreSQL ALTER TABLE statement may require locks that contend with active traffic. Its lock level and rewrite cost depend on operation, server release, table state and concurrent transactions. An ADD COLUMN of a nullable field can still wait on another transaction. Investigate documented lock behavior, use representative non-production load and bound waiting with a suitable lock_timeout; a successful four-row teaching example cannot establish low production impact.",
          "Application rollback and data rollback are separate: old code may be safe while expanded schema retains owner_name, but old code may be incompatible after new-only writes or after DROP COLUMN. Restoring a database snapshot may discard legitimate changes made since backup. Plan recovery as forward-fix, compatible application rollback or authorized point-in-time restore according to actual persisted state."
        ]
      }
    ]
  },
  {
    "id": "delivery-production-schema-evolution-008",
    "title": "Live PostgreSQL: concurrent writes and restartable backfill",
    "estimatedMinutes": 80,
    "body": "Execute two database sessions, catch a stale worker update, and reconcile an interrupted migration.",
    "sections": [
      {
        "heading": "Understand the lost-update hazard under READ COMMITTED",
        "paragraphs": [
          "A backfill worker reads owner_name=Team A and computes owner_team_id=10. Before its UPDATE, a user transfers the service to Team B. A compatibility writer commits owner_name=Team B and owner_team_id=20. If the worker later executes UPDATE ... WHERE id=1, it may silently overwrite the more recent value with 10. Merely reading first inside a transaction does not lock the row; PostgreSQL's READ COMMITTED isolation obtains a fresh snapshot per statement.",
          "A defensible conditional UPDATE checks the row's current eligibility, for example owner_team_id IS NULL AND owner_name='Team A', when the compatibility writer always maintains both representations. This is a compare-and-set-like guard, not a universal rule: ambiguous legacy values, independently updated columns, transaction isolation choices and concurrent migrations may require a row version, explicit locks or reconciliation queue. The predicate needs its own adversarial test."
        ]
      },
      {
        "heading": "Execute two actual PostgreSQL connections, not an in-memory simulation",
        "paragraphs": [
          "The exact Python source below starts and removes a named disposable PostgreSQL 16-alpine Docker container without exposing ports. One live psql session begins a READ COMMITTED transaction, queries Team A and stays open. A separate psql connection commits Team B/20. The first session attempts the guarded stale UPDATE and must affect no row. The source then checks persisted Team B/20. This exercises real database concurrency while keeping the synthetic data and service completely isolated from work databases.",
          "Run it with python3 and Docker Engine; an initial image pull may require network access. Its disposable password exists only inside the isolated training container and is not appropriate for real infrastructure. Expect PG_EXPAND_OLD_READER_WRITER_STILL_VALID and PG_CONCURRENT_STALE_BACKFILL_REJECTED. The program is intentionally limited to four fabricated rows; it cannot certify a real Steward migration, connection pool or production lock behavior."
        ]
      },
      {
        "heading": "Interrupt, resume and reconcile rather than trust a completion count",
        "paragraphs": [
          "A backfill unit commits id=2 in a bounded update and ends that operation. A second fresh psql connection resumes only rows whose new representation is still absent; repeating the same batch must be a no-op. Finally the fixture checks both missing rows and semantic mappings for all four rows, including the concurrent Team B transfer. These independent checks distinguish an idempotent restart from a successful-looking row-count metric that hides wrong values.",
          "Expected output also includes PG_PARTIAL_BATCH_RESUMED_IDEMPOTENTLY_WITH_RECONCILIATION. The fixture does not physically kill a distributed worker or persist a lease/checkpoint beyond the database; a real production backfill must design bounded paging, progress tracking, retries, conflict records, throttling, replica lag checks and a way to correct skipped or ambiguous rows before switching."
        ]
      }
    ]
  },
  {
    "id": "delivery-production-schema-evolution-009",
    "title": "Switch, recover, and contract only with evidence",
    "estimatedMinutes": 55,
    "body": "Decide exactly when old code becomes unsafe and what proves destructive cleanup is allowed.",
    "sections": [
      {
        "heading": "Make rollback decisions at each schema and data checkpoint",
        "paragraphs": [
          "Before expansion, old code normally understands its current state. After expansion but before new-only writes, old code may continue working because the old column exists. After a partially completed backfill, compatibility depends on writers and readers; count-only success does not prove correctness. After switching new representation to authoritative, a rollback may still be possible only if old code continues receiving data it understands. Once the old representation is removed, deploying the old application alone cannot restore its SQL contract.",
          "Document for each stage: running client versions, authoritative representation, missing/conflicting rows, reversible actions, backup/recovery point, and safe recovery option. A SQL rollback migration that drops newly populated columns may destroy user changes. Sometimes a forward fix with data reconciliation is safer than reversing persistence."
        ]
      },
      {
        "heading": "Define a non-automatic gate for the destructive contract",
        "paragraphs": [
          "The runnable PostgreSQL proof models three independent prerequisites: no remaining old readers, expired approved rollback window, and zero unreconciled rows. It intentionally blocks each unsafe state. Only after those inputs are explicitly declared resolved does the disposable example execute DROP COLUMN owner_name, after which it demonstrates that an old SQL query fails while new SQL still works. This distinguishes a deliberate breaking contract from an accidental migration failure.",
          "The old-reader and rollback-window booleans in the fixture are inputs, NOT discovery of live clients from PostgreSQL. In real Steward work, require authoritative deployed-version inventory across API, workers, cron, reports, integrations and rollback images, a monitored observation window, integrity evidence and authorized approval. If any evidence is unknown, contract must remain NOT_TESTED/blocked."
        ]
      },
      {
        "heading": "Test PostgreSQL DDL locking separately from row-update race correctness",
        "paragraphs": [
          "A guarded UPDATE avoids this particular stale-worker overwrite but says little about schema-change locks. An ALTER TABLE may wait behind transactions or hold a lock that delays application requests; table rewrite and index costs may matter. In a representative disposable load test, deliberately hold a conflicting transaction, configure bounded lock_timeout, measure the error and inspect pg_stat_activity/pg_locks. Reject infinite retries or surprise production lock storms.",
          "The small real PostgreSQL Docker script does not reproduce production data volume, active jobs, WAL growth, replication lag, long transactions, point-in-time restore or rolling service deployment. Those are separate acceptance tasks. A passing script establishes a narrow, important failure mechanism and informs the release plan; it does not certify a zero-downtime migration."
        ]
      }
    ]
  }
];
export const schemaFocusedExtraPractices:Record<string,string[]>={
  "delivery-production-schema-evolution-003": [
    "Run the exact PostgreSQL 16 Docker fixture published in the new concurrent-write reading. Preserve its five PG_* markers, and explain precisely which checks involve two live database connections versus synthetic external gates.",
    "In a disposable copy replace the stale-worker guarded UPDATE WHERE id=1 AND owner_team_id IS NULL AND owner_name='Team A' with WHERE id=1. Require a failed safety assertion and inspect the newer Team B/20 value that would be overwritten.",
    "Stop after an initially committed bounded batch, resume through a fresh database session, rerun to prove idempotence and query the old-to-new semantic mapping, not merely the count of non-null IDs."
  ],
  "delivery-production-schema-evolution-004": [
    "Write the application rollback versus data recovery matrix for pre-expand, expanded/coexistence, partial backfill, new-authority switch and post-contract states.",
    "Exercise each fixture contract-gate blocker separately, then explain why a real old-client inventory and rollback expiry cannot be deduced from a database connection alone."
  ],
  "delivery-production-schema-evolution-005": [
    "Before real contract, gather old API/worker/scheduled-job inventory and supportable rollback evidence instead of setting fictional booleans to false.",
    "Perform a separate approved PostgreSQL DDL lock-timeout rehearsal under representative non-production load; the four-row concurrency example is not production DDL safety evidence."
  ]
};
