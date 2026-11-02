import type {LearningResource} from "../activities/content";
type Section={title:string;paragraphs:string[];code?:{language:string;caption:string;code:string}};
// Continuous OBS-01 fictional scenario; no claim that later enterprise integrations are deployed.
export const operationalBridgeDistributed:Record<string,Section[]> = {
  "Redis and the Cache-Aside Pattern": [
    {
      "title": "OBS-01 — cache a recorded-owner read, not a permission decision",
      "paragraphs": [
        "The fictional OBS-01 read asks which Team Steward currently records as owner; that is not the same as approving a transfer. A Redis entry must be derived from PostgreSQL after enforcing the current caller's access. An unsafe key such as `service:123:owner` can leak an answer across Team scopes if read permissions differ. A safer cache contract includes the relevant tenant/Team authorization scope, response/representation version and bounded lifetime, with authorization rechecked against trustworthy context on each read.",
        "Record before measurement that caching introduces a second *copy* of state, not a second *authority*. Compare an indexed PostgreSQL query, response pagination and cache-aside under an observed workload before selecting Redis. Independent challenge: a previously authorized Team loses access while its cached response still exists. Explain how your key, authorization check and revocation/invalidation policy prevent continued disclosure without inventing an enterprise IAM integration."
      ],
      "code": {
        "language": "text",
        "caption": "Illustrative cache key; every scope must be derived from verified server-side authorization",
        "code": "cache key: owner-record:{verified_team_scope}:{service_id}:{view_version}\nsource: PostgreSQL registry (authoritative)\nread: trusted caller -> authorization -> scoped cache -> DB fallback on miss\nwrite: authorized DB COMMIT -> post-commit invalidation or proven bounded staleness\nnegative: revoked Team cannot read old response from any cache key\nNEVER: let caller supply an unchecked team_scope key fragment"
      }
    }
  ],
  "Cache Invalidation, Staleness and Failure": [
    {
      "title": "Stale owner data is a silent integrity fault",
      "paragraphs": [
        "An owner transfer commits to PostgreSQL but cache deletion times out. The next permitted lookup can return the old Team with HTTP 200, even when monitoring sees healthy Redis and a healthy API. Define a freshness contract before choosing a TTL: can responders tolerate 30 seconds, or must the response be current for incident escalation? Without an approved business answer, do not assert that a chosen TTL makes the design acceptable.",
        "Build a negative test that keeps the stale value, changes ownership through the approved domain service and then reads with the same authorized scope. Capture both stored and returned owners, the cache key/TTL and the mismatch. If the owner field is safety/authorization-sensitive, bypass cache or require a stronger consistency check rather than treating a cache hit as authoritative evidence."
      ]
    }
  ],
  "Dead-Letter Queues and Poison Messages": [
    {
      "title": "A configured dead-letter exchange is not proof of successful quarantine",
      "paragraphs": [
        "Earlier RabbitMQ labs demonstrated poison-message rejection, x-death evidence and operator replay in a disposable classic queue. An important missing negative case is a configured DLX whose routing key has no bound destination. A basic `nack(requeue=False)` means the consumer rejects the delivery; it does not guarantee that the message exists safely in a visible quarantine queue. Broker configuration, queue type and failure semantics determine what actually happens.",
        "Before production sign-off, stop the line on an unbound or unavailable quarantine route. In a disposable experiment, intentionally remove a DLQ binding, publish one tagged poison event and compare actual queue counts, broker logging and the configured dead-letter safety mode. Restore the binding and prove an authorized operator can replay *the original* event identity through a confirmed publish before acknowledging the quarantined copy. Do not infer clustered or quorum at-least-once guarantees from the prior single-node classic-queue run."
      ],
      "code": {
        "language": "text",
        "caption": "Proposed failure drill; must be executed in a disposable broker before claiming it passed",
        "code": "normal:  poison -> basic_nack(requeue=False) -> DLX binding -> quarantine\nnegative: poison -> basic_nack(requeue=False) -> DLX with NO matching binding\nOBSERVE: broker logs, source/quarantine counts, policy, queue type\nFAIL: cannot prove a durable quarantined copy / unknown retention\nREPAIR: restore binding + quarantine policy; republish with confirm\nNEVER: acknowledge original quarantine delivery before confirmed replay"
      }
    }
  ],
  "Ordering and Eventual Consistency": [
    {
      "title": "Business revision must survive inverted event arrival",
      "paragraphs": [
        "The earlier live RabbitMQ exercise published retirement version 8 before production version 7 and then duplicated version 8. This is an application-originated revision inversion, not evidence that RabbitMQ itself broke FIFO ordering. A projection should compare the aggregate's business version before applying a later-arriving event. Deduplicating only by event ID prevents repeats of the *same event* but does not prevent a different older event from regressing lifecycle state.",
        "Counterexample: a consumer tracks processed_event IDs but unconditionally writes the owner/lifecycle from each new ID. A delayed v7 event with its own ID can overwrite already applied v8, yielding a logically impossible state despite 'exactly once per ID' bookkeeping. Independent practice: provide a monotonic version test and explain what happens if multiple producers assign conflicting versions. Ordering guarantees must be justified at the authoritative producer boundary."
      ]
    }
  ],
  "Publishing Events Reliably: The Transactional Outbox": [
    {
      "title": "Four distinct handoffs cannot be collapsed into one success",
      "paragraphs": [
        "A service-owner change and an outbox intent can commit together in PostgreSQL. The publisher then reads intent and sends to RabbitMQ, which may confirm receipt. A consumer processes and acknowledges, and an external notification provider may accept a separate request. These are four different responsibilities; a publisher confirm knows nothing about whether a consumer applied a domain effect or whether an email reached a human.",
        "Label each durable state and crash window. A publisher crash after broker confirm but before updating the outbox means the same event may be published again; stable IDs and consumer deduplication handle the local effect. A consumer crash after provider acceptance but before local mark can produce a duplicated *external* side effect unless the provider supports an idempotency contract or reconciliation. Previous CI proves a bounded local PostgreSQL effect, not provider-level exactly-once behavior."
      ],
      "code": {
        "language": "text",
        "caption": "At-least-once notification trace; not a promise of delivery to a human",
        "code": "PG transaction: domain owner change + outbox record COMMITTED\npublisher: outbox pending -> RabbitMQ publish -> publisher confirm\nconsumer: event delivered -> local effect/dedupe COMMIT -> consumer ACK\nprovider: separate remote side effect (may time out AFTER accepting)\nAMBIGUOUS: provider accepted, reply lost -> reconciliation/key contract needed\nBROKER CONFIRM != consumer ACK != provider accepted != human notified"
      }
    }
  ],
  "RabbitMQ versus Kafka: Different Messaging Models": [
    {
      "title": "Choose by observed ownership and replay needs, not a vendor slogan",
      "paragraphs": [
        "For the proposed OBS-01 notification, a small bounded queue with routing, acknowledgements, idempotency and an operator-owned DLQ may be sufficient; whether RabbitMQ is justified at all depends on asynchronous requirements and operations staff. Kafka's retained partitions and group offsets may justify a different workload when independent analytical consumers must replay historical data, but introducing Kafka does not remove the application's authorization and exactly-once side-effect problems.",
        "Write two different acceptance cases: (A) one delayed notification with bounded retries, and (B) one multi-consumer audit stream with explicit retention, replay and ordering per Service. Compare operational cost, consumer autonomy, ordering constraints and failure recovery; set a revisit threshold based on measured requirements. Do not claim current Steward traffic has either requirement without evidence."
      ]
    }
  ]
};
export const operationalBridgeFailure:Record<string,Section[]> = {
  "Thinking in Failure Modes": [
    {
      "title": "Carry the same misleading-owner outcome through three boundaries",
      "paragraphs": [
        "Start with one invented OBS-01 mismatch: a legacy batch proposes TEAM-B, the Steward domain correctly rejects an unauthorized transfer, but the response writer or a stale Redis cache still displays TEAM-B as if it were authoritative. The root cause is not just 'Redis down' or 'invalid CSV'. Trace the producer's source claim, file envelope/proposal authority, database decision, cache provenance and responder-facing interpretation. A technical 200 response can coexist with an incorrect escalation.",
        "Derive four independent controls rather than listing generic resilience patterns: prevent a file row from bypassing the domain policy; detect a discrepancy between authoritative PostgreSQL and exposed read model; contain the wrong-owner display by marking freshness and source; recover by invalidating/repairing affected projections and reviewing wrongly escalated incidents. Label which controls actually exist in Builder v1 and which are proposed."
      ],
      "code": {
        "language": "text",
        "caption": "Fictional failure chain with distinct evidence tiers",
        "code": "TRIGGER: external review proposes owner TEAM-B (not approved)\nPOLICY: Steward should reject TEAM-A -> TEAM-B for unauthorized caller\nFAULT: stale/incorrect read model still displays TEAM-B as recorded owner\nIMPACT: responder escalates to wrong Team during OBS-01\nDETECT: compare authoritative row, approval log, cache value and response\nRECOVER: invalidate/repair derived view; audit affected lookups\nUNVERIFIED: live enterprise CMDB, IdP, incident history"
      }
    }
  ],
  "Resource Exhaustion": [
    {
      "title": "Compute backlog before choosing more consumers",
      "paragraphs": [
        "Suppose a fictional batch producer sends 150 owner-review rows per second for ten minutes while the authorized Steward consumer can sustainably validate only 100 per second. The backlog grows by 50 rows per second and accumulates approximately 30,000 unprocessed rows. This is queueing pressure even if RabbitMQ itself reports healthy. Doubling consumers cannot solve a serial approval authority, a locked database row or a downstream provider that allows only 100 operations per second.",
        "Independent task: propose one bounded-rate or backpressure control and one explicit stop condition. State the business freshness SLA and whether stale owner-review proposals should expire instead of being replayed after the fact. Measure queue age, oldest delivery, authorization rejects, database lock waits and consumer service time; avoid hiding overload by increasing unbounded retry counts."
      ],
      "code": {
        "language": "text",
        "caption": "Hypothetical queue balance, not observed Steward throughput",
        "code": "arrival=150 rows/s; service=100 rows/s; duration=600 s\nnet backlog growth=(150-100)*600=30,000 rows\nIf source stops and consumer stays at 100 rows/s: drain >=300 s\nAssumes stable rates, no retries and no competing work\nReal rates / SLO / backlog-age histogram: UNVERIFIED"
      }
    }
  ],
  "Human and Operational Failure": [
    {
      "title": "One operator replay can undo a correct technical recovery",
      "paragraphs": [
        "After a correctly rejected owner-proposal file, an operator sees a quarantine entry and resends it manually. Without checking the unchanged delivery ID, immutable original payload, authorization scope, version and prior rejection reason, the operator can reintroduce a forbidden intent or mask an audit trail. Likewise, accepting a new SFTP host key without an approved rotation record can connect automation to the wrong endpoint.",
        "Treat production replay as a privileged, auditable change: who requested it, who approved it, what exact byte digest/event ID was replayed, which quarantined reason is now resolved, and what negative test guarantees no unauthorized mutation. Separate a laboratory replay after a simulated capability upgrade from real operator permission and external vendor key management. If evidence is missing, keep the message quarantined rather than calling the recovery complete."
      ]
    }
  ]
};
export const operationalBridgeDecisions:Record<string,Section[]> = {
  "Architecture Characteristics Introduction": [
    {
      "title": "OBS-01 turns adjectives into quality scenarios",
      "paragraphs": [
        "Do not assign 'high performance' or 'high availability' to a diagram without a stakeholder and measurable impact. For the fictional recorded-owner lookup, define a proposed scenario: a responder requests an authorized owner record during an incident; the system returns the verified recorded value within an agreed latency budget under a stated workload, and marks stale or unverified ownership separately. The actual latency target, workload, cost and decision owner are currently proposals, not measured production commitments.",
        "Classify business correctness/authorization separately from the p95 response time. A 15 ms cache hit that leaks another Team's record or returns a stale owner is not a success. An engineering trade-off should protect forbidden transitions and source semantics first, then compare performance optimizations against the approved quality target and cost."
      ]
    }
  ],
  "Decision Drivers": [
    {
      "title": "Rank alternatives before choosing the outbox or broker",
      "paragraphs": [
        "Take the proposed owner-change notification and consider three credible alternatives: send synchronously after commit, persist a DB outbox and use one background worker, or publish through RabbitMQ using a DB outbox. All three still require authorization before the authoritative write. Drivers include required response latency, notification durability, bounded retries, external provider idempotency, on-call staffing and expected load; the scoring should never assume volume or an SLA that has not been measured.",
        "Record a decision table with 'known', 'assumed' and 'requires stakeholder approval' flags rather than numbers that imply false precision. In small workloads, a one-database outbox worker may beat a new broker on operations burden. RabbitMQ can be a valuable deliberate learning exercise while remaining unjustified as a production default. Ask the learner which evidence would invalidate their provisional choice."
      ],
      "code": {
        "language": "text",
        "caption": "Decision alternatives and evidence gaps; no universal winner",
        "code": "A synchronous email:   +simple; -provider on critical path; provider timeout ambiguous\nB PostgreSQL outbox: +durable intent; -worker/retries; provider idempotency still needed\nC outbox+RabbitMQ:    +routing/buffering; -broker/DLQ/claims/ops cost\nNON-NEGOTIABLE: trusted authorization + atomic domain record\nUNKNOWN: approved p95, delivery SLO, provider contract, operations capacity\nPROVISIONAL: choose based on evidence; do not count tutorial tech as business mandate"
      }
    }
  ],
  "Architecture Decision Records": [
    {
      "title": "An ADR must reference a falsifiable failure, not just a preference",
      "paragraphs": [
        "Write a provisional ADR for OBS-01 notification delivery with the actual domain-commit crash window from the earlier outbox lab as supporting evidence. Context: transfer must not be reported complete before PostgreSQL commits; notification is potentially asynchronous only if stakeholders approve that semantic separation. State alternative A (synchronous provider), B (database outbox worker), and C (outbox plus broker). Record why an option fits current ownership and operation constraints, who will investigate backlog, and which assumptions are unresolved.",
        "An ADR status of Proposed is more honest than Accepted when the provider's idempotency contract, approval D-01, or service-level objective is missing. Add explicit reversal signals: measured queue backlog beyond the approved age, provider retry failures, operating cost or multiple independent consumers with a genuine replay requirement. A decision record that cannot be refuted by new observations preserves no useful reasoning."
      ]
    }
  ],
  "Evaluating Trade-offs": [
    {
      "title": "Challenge the choice under two changed premises",
      "paragraphs": [
        "First assume the notification provider is available 99.99% of the time with p95 below 20 ms and the feature has one consumer. Synchronous delivery may now be tolerable if business semantics require it; a broker's fixed operating cost may be hard to justify. Next assume provider outages last an hour while owner transfers must remain usable and three independent consumers need durable events; a DB outbox with brokered fan-out becomes more plausible. These are hypothetical sensitivity cases, not measured system facts.",
        "Give the learner two counterfactuals: the Team authorization policy becomes externally governed, and the Redis owner cache leaks data after an access revocation. Which ADR needs revision, which controls are domain invariants that cannot be traded away, and which experiments resolve uncertainty? Evaluate reversibility and owner accountability rather than relying on arbitrary weighted numeric totals."
      ]
    }
  ]
};
export const operationalBridgeReferences:Record<"distributed"|"failure"|"decisions",LearningResource[]> = {
  "distributed": [
    {
      "title": "RabbitMQ — publisher confirms and consumer acknowledgements have separate scopes",
      "url": "https://www.rabbitmq.com/docs/confirms",
      "kind": "reference"
    },
    {
      "title": "RabbitMQ — dead-letter routing and delivery limitations",
      "url": "https://www.rabbitmq.com/docs/dlx",
      "kind": "reference"
    }
  ],
  "failure": [
    {
      "title": "Google SRE book — incident response and failure analysis",
      "url": "https://sre.google/sre-book/table-of-contents/",
      "kind": "reference"
    }
  ],
  "decisions": [
    {
      "title": "arc42 — quality scenarios and measurable constraints",
      "url": "https://docs.arc42.org/section-10/",
      "kind": "reference"
    }
  ]
};
