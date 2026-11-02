import type {LearningResource} from "../activities/content";
type MessagingTeachingSection = {title:string;paragraphs:string[];code?:{language:string;caption?:string;code:string}};
export const messagingSemanticsWorked:Record<string,MessagingTeachingSection[]> = {
    "Acknowledgements, Retries and Delivery Semantics": [
        {
            "title": "Separate three independent completion boundaries",
            "paragraphs": [
                "The publisher, broker and consumer do not share one atomic success flag. First, the publisher issues basic.publish on a channel. A RabbitMQ *publisher confirm* can show that the broker accepted responsibility under the configured queue/durability conditions; it cannot show that a consumer has run or committed an effect. Second, the broker delivers a message with a *delivery tag* on a consumer channel. Third, the consumer issues basic.ack after completing the work it owns. The tag belongs to the channel and is not the stable event ID; acknowledging an unknown tag or the wrong channel is a protocol error.",
                "Trace evt-42: the publisher receives a confirm; RabbitMQ stores/delivers the message; the consumer writes a new audit projection in a local transaction; the consumer acknowledges its delivery. If the consumer dies before committing, a later delivery must safely retry. If it dies after committing but before acknowledgement, RabbitMQ can redeliver. Publisher confirmation alone cannot distinguish those two outcomes, and consumer acknowledgement does not make the external provider's earlier actions atomic.",
                "Compare three paths before changing code: auto-ack or ack-before-effect loses work on a crash; effect-before-manual-ack permits redelivery and requires idempotency; effect plus deduplication identity in one local database transaction allows the same event to be repeated without duplicating that local effect. For an external email or remote payment, a local transaction cannot cover the remote side: use its idempotency API if available or explicitly record the remaining ambiguity."
            ],
            "code": {
                "language": "text",
                "caption": "Two independent acknowledgements and the crash window",
                "code": "Producer -- publish evt-42 --> Exchange -> Queue\nProducer <-- publisher confirm --- RabbitMQ (not consumer success)\nRabbitMQ -- deliver(tag=5, event_id=evt-42) --> Consumer\nConsumer -- COMMIT local effect + processed(evt-42) --> Database\nConsumer -- basic.ack(tag=5, same channel) --> RabbitMQ\n\nCrash before commit -> redelivery must retry safely\nCrash after commit, before ack -> redelivery must NOT repeat local effect\nPublisher confirm + consumer ack are NOT one end-to-end transaction"
            }
        },
        {
            "title": "Retry decisions must distinguish transient, permanent and unknown outcomes",
            "paragraphs": [
                "A connection timeout to an email provider is ambiguous; a schema-version mismatch that cannot parse is permanent until code or message changes. Classify errors before retrying. An immediate basic.nack(requeue=true) can return a message to a ready queue and create a hot retry loop, especially with several consumers. Prefer a documented delayed, bounded retry policy and an inspectable terminal state. RabbitMQ's quorum queue delivery limit and separate retry queues have different semantics; don't assume any topology counts attempts automatically unless its actual configuration proves it.",
                "Worked policy proposal—not a product-approved SLA: try up to three processing attempts using delays chosen against the provider recovery window. A permanently invalid contract version is dead-lettered without waiting for three attempts. A provider timeout uses a bounded retry; after exhaustion, the event moves to a supervised dead-letter destination. Require a stable event ID across attempts, correlation metadata without secrets, a metric for the oldest unresolved event and one owner for replay decisions.",
                "Failure diagnosis: a spike of ready messages with few unacknowledged deliveries suggests consumers cannot keep up or are absent; many unacknowledged messages may mean prefetch/concurrency or slow handlers; rapidly increasing redeliveries can mean a hot loop. Interpret these with actual broker metrics, not guessed causes. In the lab, stop a consumer after its effect and before ack, inspect real redelivery and prove a single durable effect."
            ]
        }
    ],
    "Dead-Letter Queues and Poison Messages": [
        {
            "title": "A DLX routes a failed delivery; a DLQ stores it",
            "paragraphs": [
                "In RabbitMQ, a dead-letter exchange (DLX) is an exchange, not automatically a queue. The source queue is configured to publish certain messages to that exchange; a binding routes them to an inspectable dead-letter queue (DLQ). AMQP 0-9-1 basic.reject/basic.nack with requeue=false can trigger dead-lettering. Messages may also be dead-lettered after TTL expiration, queue length limits or quorum-queue delivery limits. A message sent to a DLX still needs a matching binding and a functioning destination: declaring only the DLX is not sufficient.",
                "Imagine a Steward event with schema_version=999. The consumer cannot interpret the contract and rejects it with requeue=false. RabbitMQ routes it through the configured DLX to the DLQ. Meanwhile valid lifecycle events continue through the primary queue. A separate operator review process identifies the failed event ID, failure category, contract version and timestamp. Redacting authorization tokens and personally identifying content is part of diagnostics, not an optional cosmetic step.",
                "Do not treat publisher confirms to the original queue as proof of dead-letter durability. The dead-letter path introduces a second routing and persistence responsibility. RabbitMQ's specific dead-letter reliability guarantees depend on queue type and configuration; the real lab must verify the chosen topology under destination outage or missing binding rather than asserting every DLX guarantees delivery."
            ],
            "code": {
                "language": "text",
                "caption": "Source queue → dead-letter exchange → bound quarantine queue",
                "code": "exchange: steward.lifecycle -> main queue: steward.lifecycle.work\n  consumer validates message:\n    valid + effect committed -> basic.ack\n    invalid contract -> basic.nack(requeue=false)\n      |  (requires source queue DLX configuration)\n      v\n  dead-letter exchange: steward.lifecycle.dlx\n      |  (explicit routing key / binding)\n      v\n  dead-letter queue: steward.lifecycle.quarantine\n      -> operator inspection -> controlled repair/re-publish\n\nNo DLX, wrong binding or unavailable target: inspect actual broker behavior."
            }
        },
        {
            "title": "Replaying a dead letter is a new delivery, not proof of recovery",
            "paragraphs": [
                "Replaying after a fix is a new publication of the *same logical event*, normally preserving its stable event ID so the consumer can recognize duplicates. If the operator changes business meaning, version and audit the correction explicitly rather than silently overwriting history. Apply the same schema, team authorization, idempotency and state-version checks as the main queue. A replay that simply returns to the DLQ is not recovery.",
                "Use a deliberate runbook: quarantine a known poison event; capture current source and target queue counts and selected safe headers; isolate the fault (unsupported version versus transient dependency); repair code/configuration or issue a documented corrected event; republish with confirms; acknowledge the original quarantined delivery only after publication has been accepted by the broker; then observe the consumer-owned effect and final backlog, not merely the publish confirm. Uncertainty remains if the consumer has not yet executed.",
                "Negative cases: missing DLX binding sends the event nowhere useful; unbounded retries requeue the poison message forever; changing the event ID on every retry bypasses deduplication; a replayed v7 update after v8 without a version guard can regress a projection. These failures need separate evidence. The independent lab should show one real poison event being quarantined and replayed after correction, retaining both original and recovery audit records."
            ]
        }
    ],
    "Ordering and Eventual Consistency": [
        {
            "title": "Why FIFO queue arrival does not mean globally ordered business effects",
            "paragraphs": [
                "A queue can enqueue and deliver messages in FIFO order under specific conditions. That does not mean *effects* must commit in FIFO order. Two consumers can receive v7 and v8 and finish at different times; a failed v7 may be requeued after v8 has already been applied. RabbitMQ also supports multiple queues and routing patterns; there is no single global order across all services. If the business needs per-Service order, enforce the order at the consumer's durable state boundary.",
                "Use a monotonic aggregate version assigned by Steward in the same authoritative transaction as the domain change, not the consumer's wall clock. For Service svc-42, v7 is production and v8 is retired (valid Steward lifecycle values). The projection receives v8 first, then the delayed v7, then duplicate v8. Without a version check it regresses to production. With a compare-and-set where *incoming version must be greater than stored version*, it remains retired.",
                "Distinguish a *full-state* event from a *patch*. A v8 full-state snapshot can be applied without v7. A v8 patch that assumes v7's fields may require gap detection, buffering/reconciliation or fetching authoritative state. A version guard prevents regression but does not automatically fill missing earlier transformations. Declare the type of event and the convergence mechanism in the contract."
            ]
        },
        {
            "title": "Run an executable projection that refuses stale events",
            "paragraphs": [
                "The following single-file Python 3 program models a local SQL projection using SQLite, not RabbitMQ. Execute python projection_order.py. Expected output: event v8: applied; projection=(8, 'retired'); event v7: ignored; projection=(8, 'retired'); event v8: ignored; projection=(8, 'retired'). SQLite's ON CONFLICT WHERE guard evaluates the row version atomically within this one local database operation, preventing an older update from replacing a newer one.",
                "The boundary is deliberate. This code proves monotonic local projection behavior under the supplied sequence, but it does NOT prove RabbitMQ redelivery, consumer concurrency, PostgreSQL row-lock behavior, broker ordering or actual eventual convergence after an outage. The staged RabbitMQ lab must publish the same stable event IDs in deliberately reversed order using real processes, then inspect the resulting database and monitor time-to-convergence. A projection that has not received v8 at all will remain stale; the version check cannot summon missing events.",
                "Independent variation: add v9 with a valid later lifecycle transition in a new domain where that transition is permitted, and test that only new versions advance. For Steward specifically, do not invent a lifecycle transition from retired back to production; exercise v6 uat → v7 production → v8 retired instead."
            ],
            "code": {
                "language": "python",
                "caption": "Executable SQL version guard: v8 retired, late v7 production and duplicate v8",
                "code": "import sqlite3\n\nevents = [\n    (\"svc-42\", 8, \"retired\"),     # newer event arrives first\n    (\"svc-42\", 7, \"production\"),  # late old event must not regress state\n    (\"svc-42\", 8, \"retired\"),     # duplicate is harmless\n]\ndb = sqlite3.connect(\":memory:\")\ndb.execute(\"\"\"CREATE TABLE projection(\n    service_id TEXT PRIMARY KEY,\n    version INTEGER NOT NULL,\n    lifecycle TEXT NOT NULL\n)\"\"\")\n\nfor service_id, version, lifecycle in events:\n    with db:  # one atomic SQLite write for this local projection\n        change = db.execute(\"\"\"\n            INSERT INTO projection(service_id, version, lifecycle) VALUES (?, ?, ?)\n            ON CONFLICT(service_id) DO UPDATE SET\n                version=excluded.version,\n                lifecycle=excluded.lifecycle\n            WHERE excluded.version > projection.version\n        \"\"\", (service_id, version, lifecycle))\n    current = db.execute(\n        \"SELECT version, lifecycle FROM projection WHERE service_id=?\",\n        (service_id,)\n    ).fetchone()\n    print(f\"event v{version}: {'applied' if change.rowcount else 'ignored'}; projection={current}\")\n\ndb.close()"
            }
        }
    ]
};
export const messagingSemanticsReferences:LearningResource[] = [
    {
        "title": "RabbitMQ — Consumer Acknowledgements and Publisher Confirms",
        "url": "https://www.rabbitmq.com/docs/confirms",
        "kind": "reference",
        "purpose": "Official explanation of independent publisher/consumer acknowledgements, delivery tags, prefetch and redelivery."
    },
    {
        "title": "RabbitMQ — Dead Letter Exchanges",
        "url": "https://www.rabbitmq.com/docs/dlx",
        "kind": "reference",
        "purpose": "Official DLX triggers, routing/policy/queue-type semantics and dead-letter reliability limitations."
    },
    {
        "title": "RabbitMQ — Queues and Message Ordering",
        "url": "https://www.rabbitmq.com/docs/queues",
        "kind": "reference",
        "purpose": "Distinguish FIFO enqueue/dequeue from ordering under requeue and parallel consumers."
    },
    {
        "title": "RabbitMQ official deep dive — At-Least-Once Dead Lettering",
        "url": "https://blog.rabbitmq.com/blog/2022/03/29/at-least-once-dead-lettering",
        "kind": "reference",
        "purpose": "Substantive engineering article on dead-letter safety, quorum queues and failure trade-offs."
    },
    {
        "title": "Cloud X Berry — RabbitMQ Will Finally Make Sense After This Video",
        "url": "https://www.youtube.com/watch?v=pr4oBqxh4v4",
        "kind": "video",
        "purpose": "Optional 5-minute high-level visualization of exchanges, acks, redelivery and DLQ; does not replace the technical worked traces."
    }
];
