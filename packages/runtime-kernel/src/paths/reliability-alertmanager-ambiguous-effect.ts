import type { LessonBlock } from "../activities/content";
// New focused lesson complements existing source-published real Alertmanager Python.
export const alertmanagerAmbiguousEffectBlocks: LessonBlock[] = [
  {
    "type": "heading",
    "id": "retry-ack-ambiguity",
    "level": 2,
    "text": "A failed webhook acknowledgment does not mean the receiver did nothing"
  },
  {
    "type": "paragraph",
    "text": "The preceding same-notification retry exercise proves that official Alertmanager can resend a rejected HTTP 503 webhook with the same group key, alert fingerprint, labels and startsAt. That proves transport retry; it says nothing about whether the receiver already committed a side effect before the 503. An external endpoint can persist an incident record, enqueue a ticket or initiate a page, then fail while writing its HTTP acknowledgment. Retrying that request can duplicate the operation. This is an ambiguous outcome, not a clean failed operation."
  },
  {
    "type": "heading",
    "id": "retry-ack-sqlite-boundary",
    "level": 2,
    "text": "Give the receiver a durable idempotency boundary"
  },
  {
    "type": "paragraph",
    "text": "In the exact executable Python source in the previous real Alertmanager runtime reading, the receiver computes a canonical identity from the webhook groupKey, complete per-alert labels, startsAt, fingerprint and firing status. The disposable local SQLite table delivery_effects stores an identity and a synthetic runbook-dispatch effect. A UNIQUE INDEX on identity and INSERT OR IGNORE ensure that retrying this same identity cannot create a second committed row. The insert COMMIT happens before the receiver deliberately returns HTTP 503; on retry, a 200 is returned, but the same identity still has exactly one row. The table is created on disk and independently queried through a new SQLite connection, so evidence is not a mock counter or a Python list."
  },
  {
    "type": "code",
    "language": "sql",
    "caption": "The receiver's real SQLite idempotency contract (illustrative schema and inserts, executed by the source-published Python)",
    "code": "CREATE TABLE delivery_effects (\n    id INTEGER PRIMARY KEY,\n    identity TEXT NOT NULL,\n    effect TEXT NOT NULL\n);\nCREATE UNIQUE INDEX unique_notification_effect ON delivery_effects(identity);\nINSERT OR IGNORE INTO delivery_effects(identity, effect)\nVALUES ('canonical-webhook-identity', 'synthetic-runbook-dispatch');\n-- Run the same INSERT again: the index prevents a duplicate.\nSELECT identity, COUNT(*) AS committed_effects\nFROM delivery_effects\nGROUP BY identity;"
  },
  {
    "type": "heading",
    "id": "retry-ack-real-positive",
    "level": 2,
    "text": "Exercise a genuine 503 after committed side effect, then the same retry"
  },
  {
    "type": "paragraph",
    "text": "From an authorized disposable Linux host with Docker, execute the ambiguous-503 mode. The official Alertmanager container sends one real alert after one /api/v2/alerts submission. The localhost receiver commits one SQLite side effect and replies 503, triggering Alertmanager's retry stage. The receiver then becomes healthy, receives the same fingerprint/groupKey/startsAt/labels and answers 200. A new SQLite connection must still observe one row, not two. The expected markers distinguish the commit-before-503 evidence, the identity-matched retry and the unique durable effect; they do not imply the human read a page."
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Real Alertmanager, ambiguous HTTP acknowledgment, on-disk idempotent effect",
    "code": "TSA_AM_RETRY_MODE=ambiguous-503 python3 scripts/check-reliability-alertmanager-runtime.py"
  },
  {
    "type": "heading",
    "id": "retry-ack-mutation",
    "level": 2,
    "text": "Prove why transport retry alone is unsafe for a non-idempotent receiver"
  },
  {
    "type": "paragraph",
    "text": "Use the same incoming alert, same real two webhook attempts and same HTTP 503→200 recovery, but disable the database uniqueness index and use ordinary INSERT. This deliberate mutation must fail with DUPLICATE_NOTIFICATION_EFFECT_DETECTED after SQLite commits two rows. A test that merely checks a second HTTP 200 would incorrectly pass this broken receiver. Do not change expected outcome, alert identity or Alertmanager configuration to make the negative succeed. The CI gate requires this exact failure marker after the initial committed effect and the real retry."
  },
  {
    "type": "code",
    "language": "bash",
    "caption": "Non-idempotent receiver mutant: duplicate committed effect must be caught",
    "code": "TSA_AM_RETRY_MODE=ambiguous-no-idempotency python3 scripts/check-reliability-alertmanager-runtime.py"
  },
  {
    "type": "heading",
    "id": "retry-ack-limits",
    "level": 2,
    "text": "Name the boundary where exactly-once still fails"
  },
  {
    "type": "paragraph",
    "text": "A single local SQLite UNIQUE constraint proves at-most-one committed row for one canonical key. It does not guarantee exactly-once execution of a different external action (email, Slack, PagerDuty, payment or remote ticket API). For those, an idempotency key must cross the external boundary, or a transactional outbox with stable event IDs and idempotent downstream consumers must be designed and verified. Alertmanager may retry with different grouping/notification identity after configuration changes or across future incidents. Document how keys are scoped, retained, expired and tested. Never treat a local webhook HTTP 200 as a human acknowledgment or a business outcome."
  },
  {
    "type": "resources",
    "title": "First-party references for Alertmanager and SQLite behavior",
    "resources": [
      {
        "title": "Alertmanager notification pipeline and webhook",
        "url": "https://prometheus.io/docs/alerting/latest/notification_examples/"
      },
      {
        "title": "SQLite ON CONFLICT and uniqueness",
        "url": "https://sqlite.org/lang_conflict.html"
      },
      {
        "title": "SQLite unique indexes",
        "url": "https://sqlite.org/lang_createindex.html"
      }
    ]
  }
];
