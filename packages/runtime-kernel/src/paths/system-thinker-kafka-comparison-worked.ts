// System Thinker: deep comparison that avoids outdated queue-versus-log slogans.
// Sources are first-party Kafka ecosystem/RabbitMQ docs. The runnable Python
// example is conceptual; no Kafka cluster is claimed to have been executed.
export const kafkaComparisonWorkedSections = [
  {
    "title": "The actual difference: routing state, storage state and consumer progress",
    "paragraphs": [
      "RabbitMQ's common AMQP work-queue design uses exchanges to route an event to one or more queues. A queue tracks delivery state for its messages: a consumer receives a delivery, performs its effect and acknowledges that delivery tag on the same channel. If a channel closes before acknowledgement, the broker can redeliver; a `basic.nack(requeue=False)` may send it to a configured dead-letter exchange. Durable queues and persistent messages need publisher confirms to establish broker-side acceptance. The broker knows delivery state, not whether your external side effect committed.",
      "Kafka's traditional event-stream design stores records in topic partitions, each with an offset (a position within that partition). A consumer fetches retained records and a consumer group commits a position so a restarted member knows where to resume. Consumption does not itself erase those records. Two independent groups can process the same log at separate speeds; a group can rewind while the needed records are still retained. Records are ordered only within a partition, not globally across all partitions.",
      "Do not teach an absolute product split. RabbitMQ **Streams** provide retained, replayable logs; modern Kafka also supports queue-oriented share groups in supported versions. The meaningful comparison is the precise queue type, stream feature, Kafka group mode, failure requirements, operational capability and installed broker/client versions—not which vendor historically used a given marketing label."
    ]
  },
  {
    "title": "Trace three events and two independent reader positions",
    "paragraphs": [
      "The following complete Python 3 example is intentionally a small model rather than a Kafka client: a retained log holds created, owner-changed and retired events at offsets 0, 1 and 2. The audit group reads two records while the reporting group reads one; their bookmarks differ even though they use the same retained log. Rewinding audit to offset 1 replays two records without requiring the producer to republish them.",
      "Run `python kafka_offsets.py`. Expected output: `audit reads: ['created', 'owner-changed']`, `report reads: ['created']`, `audit next offset: 2`, `report next offset: 1`, `audit replay from offset 1: ['owner-changed', 'retired']`, `retained record count: 3`. The code shows the offset mental model; it does not demonstrate Kafka group rebalance, broker retention policies, partition leader failure or durable offset commits. Those require an actual Kafka deployment if Kafka later becomes justified.",
      "Predict the failure: if audit commits offset 2 **before** its database effect, then crashes, it may skip the effect on restart; if it persists the effect **before** committing the offset and crashes, offset 1 may replay. The correct design must be safe for repeats and choose its effect/offset ordering deliberately. Compare the same risk to RabbitMQ acknowledging before versus after an effect."
    ],
    "code": {
      "language": "python",
      "caption": "Runnable conceptual Kafka offset and replay trace for two consumer groups (no Kafka broker)",
      "code": "# This is a pure Python learning model, NOT a Kafka implementation.\n# Compare independent group bookmarks on one retained partition.\nlog = [(0, \"created\"), (1, \"owner-changed\"), (2, \"retired\")]\nposition = {\"audit\": 0, \"report\": 0}\n\ndef read(group, count):\n    start = position[group]\n    batch = [(offset, value) for offset, value in log if offset >= start][:count]\n    if batch:\n        position[group] = batch[-1][0] + 1  # next offset to read\n    return [value for _, value in batch]\n\nprint(\"audit reads:\", read(\"audit\", 2))\nprint(\"report reads:\", read(\"report\", 1))\nprint(\"audit next offset:\", position[\"audit\"])\nprint(\"report next offset:\", position[\"report\"])\n# An explicit rewind is possible while data is retained.\nposition[\"audit\"] = 1\nprint(\"audit replay from offset 1:\", read(\"audit\", 2))\nprint(\"retained record count:\", len(log))"
    }
  },
  {
    "title": "Workload decisions that force concrete trade-offs",
    "paragraphs": [
      "Case A — Steward sends about 30 lifecycle notifications per day. One consumer performs a bounded side effect, retry with backoff is required, poison messages must be parked and inspected, and no replayable multi-year event stream has been requested. A straightforward RabbitMQ queue is reasonable *only after* comparing the current synchronous design and an outbox-plus-worker without a broker. The scale figure alone does not justify messaging; the delayed/failing provider and desired transaction boundary are the actual drivers.",
      "Case B — independently deployed search indexers, audit analysis and change-data consumers must reprocess several days of retained service events, using different consumer speeds. Kafka's partitioned retained log and consumer-group offsets become materially relevant. Evaluate partition keys (same Service ID to preserve per-Service ordering), expected event throughput, maximum retention, lag/recovery, contract evolution, storage growth and actual operator skill. RabbitMQ Streams may also serve parts of this workload, so compare the specific feature and tested versions before choosing.",
      "Case C — someone demands a ten-year audit history. Neither a normal RabbitMQ work queue nor an arbitrarily short Kafka retention setting is by itself a compliant archive. Decide what is authoritative, legally required, immutable or queryable first, then select storage and retention accordingly. An append-only database audit table or archive may be simpler than a streaming cluster.",
      "Stress test the decision with a consumer down for 48 hours, a malformed poison event, two duplicates and a replay requested after retention has expired. For each architecture predict what evidence remains, which operator action is possible and what data might be lost. If the answer is unknown, the decision is unresolved—not automatically a win for either broker."
    ]
  },
  {
    "title": "A migration trigger must be observable",
    "paragraphs": [
      "Keep RabbitMQ for Steward's current constrained notification workflow unless measurements expose a missing requirement such as long-lived independent replay by multiple groups at material throughput. Define a threshold such as 'two independent consumers require replay over seven days at a representative observed event volume, and the present RabbitMQ queue-based design cannot provide it without additional infrastructure'. Validate this with a workload test and consider RabbitMQ Streams, Kafka, a database change log or an external event platform.",
      "If Kafka is eventually selected, the migration design must include source ownership, dual-running/coexistence cost, event ID/schema stability, partition key, offset initialization, replay limits, duplicate suppression, observability and rollback. Do not deploy Kafka alongside RabbitMQ merely to claim architectural sophistication. The test is whether the additional system removes a measured constraint worth its operating cost."
    ]
  }
];
export const kafkaComparisonResources = [
  {
    "title": "Apache Kafka — Consumer group and offset design",
    "url": "https://docs.confluent.io/kafka/design/consumer-design.html",
    "kind": "reference"
  },
  {
    "title": "RabbitMQ — Queues, Acknowledgements and Publisher Confirms",
    "url": "https://www.rabbitmq.com/docs/confirms",
    "kind": "reference"
  },
  {
    "title": "RabbitMQ — Streams and Superstreams",
    "url": "https://www.rabbitmq.com/docs/streams",
    "kind": "reference"
  },
  {
    "title": "RabbitMQ — Comparison with Apache Kafka (vendor perspective; cross-check claims)",
    "url": "https://www.rabbitmq.com/docs/compare/kafka",
    "kind": "reference"
  },
  {
    "title": "Confluent — Offset commitments and consumer recovery",
    "url": "https://docs.confluent.io/platform/current/clients/consumer.html",
    "kind": "reference"
  }
];
