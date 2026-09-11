import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const redisDocs: LearningResource = { title: "Redis Documentation", url: "https://redis.io/docs/latest/" };
const rabbitmqDocs: LearningResource = { title: "RabbitMQ Documentation", url: "https://www.rabbitmq.com/docs" };
const rabbitmqReliability: LearningResource = { title: "RabbitMQ Reliability Guide", url: "https://www.rabbitmq.com/docs/reliability" };
const kafkaDocs: LearningResource = { title: "Apache Kafka Documentation", url: "https://kafka.apache.org/documentation/" };
const microservicesPatterns: LearningResource = { title: "Transactional Outbox Pattern", url: "https://microservices.io/patterns/data/transactional-outbox.html" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function richLesson(
    title: string,
    introduction: string,
    outcomes: string[],
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[],
    practice: {
        objective: string;
        scenario: string;
        instructions: string[];
        deliverables: string[];
        completionCriteria: string[];
    },
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `distributed-state-and-messaging-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: outcomes },
    ];

    for (const section of sections) {
        blocks.push({ type: "heading", id: slug(section.title), text: section.title, level: 2 });
        for (const text of section.paragraphs) blocks.push({ type: "paragraph", text });
        if (section.code) {
            blocks.push(section.code.caption
                ? { type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption }
                : { type: "code", language: section.code.language, code: section.code.code });
        }
    }

    blocks.push({
        type: "callout",
        tone: "steward",
        title: "Steward connection",
        body: "Redis and RabbitMQ enter Steward only when a measured or modeled system pressure justifies them. They are new dependencies with new failure modes, not badges of architectural maturity.",
    });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 35, content: { type: "reading", body: introduction, blocks } },
            { id: `${id}-practice`, title: `${title}: Engineering Practice`, estimatedMinutes: 50, content: { type: "practical", ...practice } },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const distributedStateAndMessagingDeepLessons: Lesson[] = [
    richLesson(
        "When Distributed State Is Justified",
        "Adding a cache, broker or background worker changes Steward from one application plus PostgreSQL into a distributed system with more state, more ownership and more ways to be wrong. System Thinker therefore starts with pressure and evidence, not products.",
        [
            "Distinguish a demonstrated system pressure from speculative scale.",
            "Identify whether latency, throughput, temporal coupling or workload isolation is the real problem.",
            "Compare simpler fixes before adding distributed infrastructure.",
            "Define acceptance evidence and failure cost before selecting a technology.",
        ],
        [
            { title: "Name the pressure before the mechanism", paragraphs: ["A slow service-catalogue endpoint may be caused by an inefficient query, N+1 access, missing pagination or an inappropriate index. Redis should not hide a problem that PostgreSQL or application design can solve more simply.", "Likewise, a slow notification call does not automatically require messaging. If notification is required for the business operation to be considered complete, making it asynchronous changes the product contract rather than merely improving performance."] },
            { title: "Every new state store creates a correctness question", paragraphs: ["A cache can be stale. A queue can redeliver. A worker can fail after changing state but before acknowledging a message. The engineering decision must include what users may observe when those things happen.", "The first design artifact should therefore be a pressure statement: symptom, affected flow, evidence, target outcome, simpler alternatives considered and the new failure modes you are willing to own."], code: { language: "text", code: "Pressure: GET /services p95 grows above target on representative data\nEvidence: database query + serialization dominate latency\nSimpler fixes checked: query plan, pagination, N+1, indexes\nCandidate capability: read cache\nNew risks: stale catalogue, invalidation mistakes, cache outage", caption: "Lead with evidence, then name the capability." } },
        ],
        {
            objective: "Write two evidence-based capability proposals for Steward and reject at least one unjustified distributed-system idea.",
            scenario: "A design review proposes Redis, RabbitMQ and Kafka because the product is 'becoming enterprise'. You must determine which problem, if any, each technology would actually solve.",
            instructions: ["Choose one read-performance pressure and one post-transaction side effect in Steward.", "For each, state the observable problem and what evidence would prove it exists.", "List at least two simpler alternatives before adding infrastructure.", "Describe the consistency or delivery semantics the product actually needs.", "Record the new dependency and failure modes created by the candidate solution.", "Reject one technology addition whose problem statement is not strong enough yet."],
            deliverables: ["Two capability pressure statements", "Alternative comparison", "Rejected speculative addition with rationale"],
            completionCriteria: ["Every proposed component has a named problem and acceptance evidence.", "At least one simpler alternative is evaluated fairly.", "The rejected addition is rejected because of weak drivers, not because the technology is unfamiliar."],
        },
        ["Why can caching hide a database problem?", "How can asynchrony change product semantics?", "What must be known before adding a new distributed state store?"],
        [redisDocs, rabbitmqDocs],
    ),
    richLesson(
        "Redis and the Cache-Aside Pattern",
        "A cache trades some freshness and operational simplicity for faster or cheaper repeated reads. Redis is TSA's primary implementation because it makes shared cache state, expiry and failure visible while keeping the underlying caching model transferable.",
        ["Explain cache-aside reads and writes.", "Choose cache keys and values from access patterns.", "Use TTL as a bounded-staleness control rather than a substitute for invalidation design.", "Keep PostgreSQL authoritative for Steward domain state."],
        [
            { title: "PostgreSQL remains the source of truth", paragraphs: ["In cache-aside, Steward asks Redis first for a cacheable representation. On a miss it reads PostgreSQL, returns the result and populates Redis. The cache accelerates access; it does not become the authoritative owner of Service data.", "The distinction matters when Redis is empty, unavailable or stale. Steward must still have a correct path to authoritative data unless the product deliberately chooses a different availability model."] },
            { title: "Cache the question, not the database table", paragraphs: ["Choose keys around real access patterns such as a service detail representation or a bounded catalogue query. Avoid copying arbitrary tables into Redis because that creates a second data model without a consumer-driven reason.", "TTL limits how long an entry can survive without refresh, but a five-minute TTL still permits five minutes of wrong ownership data after a change. Freshness requirements belong to the product and risk model."], code: { language: "text", code: "GET /services/payments-api\n  → Redis GET steward:service:payments-api\n      hit  → return cached representation\n      miss → PostgreSQL → serialize → Redis SETEX → return\n\nAuthoritative write always goes to PostgreSQL first.", caption: "Cache-aside accelerates a read path while preserving an authority boundary." } },
        ],
        {
            objective: "Add a measured cache-aside experiment to one Steward read path without making Redis authoritative.",
            scenario: "Representative service-catalogue data now makes one high-volume read path materially slower than its agreed target after query and ORM issues have already been addressed.",
            instructions: ["Capture the uncached baseline with representative data.", "Choose one cacheable query and define the freshness tolerance.", "Design the Redis key, cached value and TTL.", "Implement or prototype cache-aside behavior.", "Demonstrate miss, hit and expiry paths.", "Compare latency/query evidence and decide whether the cache earns its operational cost."],
            deliverables: ["Baseline evidence", "Cache contract: key/value/TTL/source-of-truth", "Hit/miss/expiry evidence", "Keep-or-remove decision note"],
            completionCriteria: ["PostgreSQL remains authoritative.", "The cache addresses a measured access pattern.", "Freshness tolerance is explicit.", "The learner can remove Redis and explain the correctness behavior that remains."],
        },
        ["What remains authoritative in cache-aside?", "Why is a TTL not a complete invalidation strategy?", "Why should cache keys follow access patterns rather than tables?"],
        [redisDocs],
    ),
    richLesson(
        "Cache Invalidation, Staleness and Failure",
        "The hardest cache bugs are often correctness bugs rather than outages. A stale owner, lifecycle or criticality value can look perfectly healthy while causing the wrong engineering decision. Cache design therefore needs explicit invalidation and failure semantics.",
        ["Identify stale-cache risk after writes.", "Compare invalidate-on-write with TTL-only behavior.", "Define cache-unavailable behavior.", "Recognize cache stampede and hot-key risks at a conceptual level."],
        [
            { title: "Invalidation is part of the write contract", paragraphs: ["If a Service changes ownership, any cached representation containing ownership becomes stale immediately. The write path needs a strategy: invalidate the relevant keys, update them after commit, or tolerate bounded staleness because the product says that is safe.", "Invalidate only after the authoritative transaction succeeds. Deleting a cache entry before a database transaction later rolls back can create unnecessary misses; populating new data before commit can expose state that never became authoritative."] },
            { title: "Cache failure should be deliberate", paragraphs: ["For most Steward registry reads, Redis failure should usually degrade to PostgreSQL rather than turn a performance optimization into total outage. But fallback can increase database load exactly when many callers miss the cache, so availability and overload interact.", "A stampede occurs when many requests recompute the same expired value at once. System Thinker should recognize the risk; sophisticated prevention belongs only where workload evidence justifies it."], code: { language: "text", code: "Service update\n  → validate + authorize\n  → PostgreSQL transaction COMMIT\n  → invalidate steward:service:<slug>\n  → next read repopulates from authoritative state\n\nRedis unavailable on read\n  → bypass cache → PostgreSQL\n  → emit cache failure evidence", caption: "Correctness follows the authoritative commit; the cache is secondary." } },
        ],
        {
            objective: "Break the Steward cache deliberately and define safe stale-data and outage behavior.",
            scenario: "The first Redis experiment improved latency, but a service ownership change is still visible with the old owner for several minutes and operations asks what happens if Redis goes down completely.",
            instructions: ["Change cached Steward data and reproduce a stale read.", "Classify which cached fields can tolerate staleness and which are security/operationally sensitive.", "Implement or specify post-commit invalidation for the chosen path.", "Stop Redis and observe the application behavior.", "Measure or reason about the fallback load on PostgreSQL.", "Document one stampede/hot-key scenario and a threshold that would justify a stronger control later."],
            deliverables: ["Staleness reproduction", "Invalidation rule", "Cache outage evidence", "Fallback/blast-radius note"],
            completionCriteria: ["Staleness is demonstrated, not merely described.", "Invalidation occurs relative to authoritative commit semantics.", "Redis outage behavior is explicit.", "The design does not silently turn cached authorization state into the source of truth."],
        },
        ["Why can stale cache data be more dangerous than an obvious cache outage?", "When should invalidation happen relative to commit?", "Why can cache fallback create a database overload risk?"],
        [redisDocs],
    ),
    richLesson(
        "RabbitMQ: Queues, Exchanges and Consumers",
        "Asynchronous messaging decouples when work happens, not whether the work must be correct. RabbitMQ is TSA's primary broker because exchanges, queues, routing, acknowledgements and dead-lettering make delivery mechanics concrete.",
        ["Distinguish producer, exchange, queue and consumer responsibilities.", "Explain routing separately from storage.", "Choose a real Steward side effect that may complete after the request.", "Keep authorization and authoritative mutation in the synchronous domain transaction."],
        [
            { title: "A broker creates a second lifecycle", paragraphs: ["A Steward lifecycle change can commit successfully while a notification or audit projection happens later. The HTTP operation and the asynchronous effect now have separate success states. Users and operators need to know which one defines the business transaction.", "Do not move correctness-critical authorization into a worker merely to make the request faster. The API must decide whether the lifecycle mutation is allowed before committing it."] },
            { title: "Exchanges route; queues retain work for consumers", paragraphs: ["A producer publishes a message to an exchange with routing information. Bindings determine which queues receive it. Consumers receive from queues and acknowledge processing according to the delivery contract.", "For Steward, a domain event such as ServiceLifecycleChanged can feed a notification worker or audit projection when a real consumer exists. The event should describe a fact that already became true, not a wish that might still be rejected."], code: { language: "text", code: "Steward API\n  → publish ServiceLifecycleChanged\n      → exchange: steward.events\n          → queue: steward.notifications → Notification Worker\n          → queue: steward.audit         → Audit Worker", caption: "One fact may be routed to multiple independently operated consumers." } },
        ],
        {
            objective: "Model and run a minimal RabbitMQ flow for one justified Steward post-commit side effect.",
            scenario: "Lifecycle changes now require an engineer notification, but notification provider latency and outages must not block the authoritative Steward mutation.",
            instructions: ["Define the synchronous business transaction and the asynchronous side effect separately.", "Design one event name and minimal payload using stable identifiers.", "Create an exchange, queue and binding appropriate for the experiment.", "Publish after a successful Steward state change or simulate the publication boundary safely.", "Consume the message and record the resulting side effect.", "Stop the consumer and prove accepted work remains observable rather than disappearing silently."],
            deliverables: ["Message topology diagram", "Event contract", "Producer/consumer evidence", "Consumer-down behavior evidence"],
            completionCriteria: ["The asynchronous effect has a real consumer.", "Authorization/domain correctness remains synchronous.", "Routing and queue retention are understood separately.", "The learner can explain what 'request succeeded' means while the side effect is pending."],
        },
        ["What is the difference between an exchange and a queue?", "Why should a domain event describe a fact that already happened?", "What business behavior must remain synchronous in the Steward example?"],
        [rabbitmqDocs],
    ),
    richLesson(
        "Acknowledgements, Retries and Delivery Semantics",
        "A broker can redeliver work when consumers fail. This is useful only when the consumer understands what may already have happened. Reliable messaging is therefore about observable delivery semantics and idempotent effects, not claiming magical exactly-once execution.",
        ["Explain manual acknowledgement timing.", "Recognize at-most-once and at-least-once trade-offs.", "Design bounded retry rather than infinite immediate requeue.", "Treat duplicate delivery as a normal case under at-least-once processing."],
        [
            { title: "Acknowledge after the effect you own", paragraphs: ["If a worker acknowledges before performing its side effect, a crash can lose work. If it performs the effect and crashes before acknowledgement, RabbitMQ may redeliver the message and the effect may run twice.", "That second case is why at-least-once delivery and idempotent consumers belong together. The system should not pretend that the broker knows whether an external email, database write or HTTP call completed before the crash."] },
            { title: "Retry is a policy, not a loop", paragraphs: ["Immediate unlimited requeue can turn one persistent failure into a hot loop. Retry policy should define retryable failures, delay/backoff, attempt limits and what happens after the limit.", "Transient network failure and invalid event schema are not the same. A poison message that can never succeed should leave the normal retry path and become inspectable."], code: { language: "text", code: "consume message\n  → validate contract\n  → perform idempotent effect\n  → ACK\n\ntransient failure → delayed/bounded retry\npermanent/poison failure → dead-letter path\ncrash after effect before ACK → possible redelivery", caption: "Delivery semantics must include the ambiguous crash window." } },
        ],
        {
            objective: "Reproduce RabbitMQ redelivery and define a bounded retry policy for a Steward consumer.",
            scenario: "The notification worker occasionally crashes after receiving a lifecycle event. Operations sees duplicate notifications and a rapidly growing retry loop during provider outages.",
            instructions: ["Process one message successfully with manual acknowledgement.", "Force a failure before acknowledgement and observe redelivery.", "Force a failure after a simulated side effect but before acknowledgement and document the ambiguity.", "Classify transient versus permanent failures for the consumer.", "Define retry delay/backoff and a maximum attempt count.", "Record what evidence must identify a message across attempts."],
            deliverables: ["Redelivery evidence", "Failure classification", "Retry policy", "Ambiguous-effect analysis"],
            completionCriteria: ["The learner can explain why redelivery can happen after a side effect.", "Retry is bounded.", "Permanent failures do not loop forever.", "The design does not claim exactly-once behavior without a mechanism that proves it."],
        },
        ["Why can acknowledging too early lose work?", "Why can acknowledging after a side effect still create duplicates?", "What makes a retry policy bounded and operationally safe?"],
        [rabbitmqReliability, rabbitmqDocs],
    ),
    richLesson(
        "Idempotent Consumers and Duplicate Delivery",
        "Idempotency makes repeating the same logical operation safe. In messaging, it is often the control that turns duplicate delivery from a correctness defect into expected behavior.",
        ["Define idempotency in terms of externally visible effect.", "Use stable message/event identifiers for deduplication where needed.", "Prefer naturally idempotent updates when possible.", "Identify when deduplication state itself becomes an operational dependency."],
        [
            { title: "The message may be delivered more than once", paragraphs: ["A lifecycle event with event_id evt-123 may be processed, the worker may crash before acknowledging, and the same message may arrive again. Sending a second email may be tolerable in one context and unacceptable in another; inserting duplicate audit rows may corrupt evidence.", "Consumers should define their idempotency boundary explicitly. A database-backed processed-event record, unique operation key or naturally idempotent upsert are common approaches."] },
            { title: "Idempotency belongs to the effect, not the HTTP verb", paragraphs: ["A consumer that sets a projection to lifecycle='retired' may naturally converge when repeated. A consumer that increments a counter or sends a payment-like instruction does not. The same event can therefore require different protections in different consumers.", "Deduplication storage can grow forever if retention is undefined. Even a safety mechanism has lifecycle and capacity concerns."], code: { language: "text", code: "event_id = evt-123\nif processed_event.exists(evt-123):\n    ACK and stop\nelse:\n    perform side effect\n    record evt-123 as processed\n    ACK", caption: "A simplified deduplication boundary; production ordering and transaction details still matter." } },
        ],
        {
            objective: "Make one Steward consumer safe under duplicate delivery and prove it with a repeated event.",
            scenario: "Audit projection records occasionally appear twice because messages can be redelivered after worker crashes.",
            instructions: ["Choose a consumer effect and state whether it is naturally idempotent.", "Publish or replay the same event identifier twice.", "Capture the incorrect duplicate effect if one exists.", "Add a deduplication or idempotent-write strategy.", "Replay again and prove the externally visible effect occurs once.", "Define retention/cleanup expectations for any deduplication state introduced."],
            deliverables: ["Duplicate reproduction", "Idempotency strategy", "Before/after evidence", "Deduplication-state lifecycle note"],
            completionCriteria: ["Duplicate delivery is treated as expected behavior.", "The protected effect is demonstrated as idempotent.", "The solution uses stable operation identity rather than timing guesses.", "New deduplication state has an ownership/lifecycle explanation."],
        },
        ["What makes an operation idempotent?", "Why can two consumers of the same event need different duplicate controls?", "What new problem can deduplication storage create?"],
        [rabbitmqReliability],
    ),
    richLesson(
        "Dead-Letter Queues and Poison Messages",
        "Some messages should stop retrying. Dead-lettering gives permanently failed or policy-rejected work an inspectable destination so the normal queue can continue making progress.",
        ["Recognize poison-message behavior.", "Define dead-letter conditions.", "Preserve diagnostic context without leaking secrets.", "Design operator action for inspect, repair, replay or discard."],
        [
            { title: "A permanent failure is not a slow transient failure", paragraphs: ["An event with an unsupported schema version, missing required identifier or impossible domain reference may never succeed no matter how many times it is retried. Requeueing it forever wastes capacity and can hide newer valid work.", "A dead-letter queue is not a trash can. It is an operational state requiring ownership, alerts or review rules, diagnostic metadata and a deliberate replay/discard process."] },
            { title: "Replay must preserve safety", paragraphs: ["If an operator repairs configuration and replays a dead-lettered event, duplicate-delivery and idempotency rules still apply. Replaying should not bypass the controls used on normal delivery.", "Capture failure class, original event identifier, attempt information and correlation context where safe. Do not put credentials or sensitive token material into diagnostic headers."], code: { language: "text", code: "main queue\n  → consume\n      → retryable failure → bounded retry\n      → permanent/attempts exhausted → DLQ\n                                    ↓\n                             inspect / repair\n                                    ↓\n                              controlled replay", caption: "Dead-lettering creates an explicit recovery workflow." } },
        ],
        {
            objective: "Create and recover one controlled poison-message scenario in the Steward messaging flow.",
            scenario: "A malformed lifecycle event is repeatedly failing and consuming worker capacity while valid events wait behind it.",
            instructions: ["Define what makes the chosen message permanently invalid.", "Route it through the normal consumer and demonstrate failure.", "Apply the retry limit and dead-letter behavior.", "Inspect the DLQ evidence needed to diagnose the failure.", "Correct the underlying issue or message in a controlled lab path and replay it.", "Verify idempotency and record who owns DLQ review in a real system."],
            deliverables: ["Poison-message evidence", "DLQ policy", "Diagnostic record", "Controlled replay evidence"],
            completionCriteria: ["Permanent failure no longer blocks normal processing indefinitely.", "The DLQ has an operational owner and action model.", "Replay uses the same correctness controls as normal delivery.", "Diagnostic data excludes secrets."],
        },
        ["What makes a poison message different from a transient failure?", "Why is a DLQ not simply a trash can?", "What safety controls still apply during replay?"],
        [rabbitmqDocs, rabbitmqReliability],
    ),
    richLesson(
        "Ordering and Eventual Consistency",
        "Asynchronous systems can expose valid intermediate states. Eventual consistency means replicas, projections or side effects may converge after the authoritative change rather than at the same instant. That delay must be acceptable to the product and safe under message ordering behavior.",
        ["Explain eventual consistency through observable Steward behavior.", "Identify where ordering matters and where it does not.", "Avoid assuming global message order.", "Design consumers that reject or handle stale events deliberately."],
        [
            { title: "Intermediate state becomes part of the user experience", paragraphs: ["If Steward commits lifecycle='retired' and an audit/search projection updates later, two views may temporarily disagree. The design must define which view is authoritative and how long inconsistency may reasonably persist.", "Eventual consistency is not an excuse for undefined behavior. It requires a convergence story, observability and a product decision that delayed agreement is acceptable."] },
            { title: "Ordering is scoped", paragraphs: ["Two events about the same Service may need causal ordering while events for unrelated services may not. Broker topology, concurrent consumers, retries and requeue can all affect observed order.", "Consumers can carry aggregate version or occurred_at metadata and reject stale updates where appropriate. Do not invent a global ordering requirement unless the domain truly needs one."], code: { language: "text", code: "Service 42 version 7: lifecycle → deprecated\nService 42 version 8: lifecycle → retired\n\nProjection receives v8 then v7\n  → without version check: state regresses\n  → with version check: ignore stale v7", caption: "Ordering controls should follow the domain scope that needs them." } },
        ],
        {
            objective: "Model one temporary inconsistency and one out-of-order event for Steward, then define safe convergence behavior.",
            scenario: "A background projection briefly shows an older lifecycle value after the authoritative Steward record has already changed twice.",
            instructions: ["Identify the authoritative state and the eventually consistent derivative.", "Define an acceptable convergence window.", "Create or simulate two ordered updates for one Service.", "Deliver or reason through them out of order.", "Add a version/timestamp rule only if it safely resolves the chosen scenario.", "Document what users/operators should trust while the derivative lags."],
            deliverables: ["Consistency-boundary diagram", "Out-of-order reproduction or simulation", "Convergence rule", "Authority/freshness note"],
            completionCriteria: ["The source of truth is explicit.", "Temporary disagreement is bounded by a product/operational expectation.", "Ordering requirements are scoped to the domain need.", "The consumer cannot silently regress known state in the demonstrated scenario."],
        },
        ["What does eventual consistency require besides patience?", "Why should ordering be scoped rather than assumed global?", "How can version metadata prevent projection regression?"],
        [rabbitmqDocs],
    ),
    richLesson(
        "Publishing Events Reliably: The Transactional Outbox",
        "A difficult messaging failure occurs between committing PostgreSQL state and publishing the corresponding event. If those two actions are independent, Steward can persist a real change and then crash before RabbitMQ ever learns about it.",
        ["Describe the dual-write problem.", "Explain the transactional outbox pattern conceptually.", "Separate authoritative domain commit from asynchronous publication.", "Recognize that outbox delivery is still at-least-once and consumers still need idempotency."],
        [
            { title: "Database commit plus broker publish is a dual write", paragraphs: ["Writing Service lifecycle to PostgreSQL and publishing ServiceLifecycleChanged to RabbitMQ are two different systems. A crash between them can lose the event; publishing first can announce a fact whose database transaction later rolls back.", "Retries alone do not close this gap because the application may not know which side succeeded after a crash."] },
            { title: "Store the intent to publish inside the database transaction", paragraphs: ["With an outbox, the same PostgreSQL transaction writes the domain change and an outbox record. A separate publisher reads undispatched outbox rows, publishes them and marks progress. The broker publication is still not magically exactly once, so duplicate publication remains possible.", "The value is that a committed domain fact has durable evidence that publication is owed. Recovery can resume after process failure."], code: { language: "text", code: "PostgreSQL transaction:\n  UPDATE service ...\n  INSERT outbox(event_id, type, payload, status='pending')\nCOMMIT\n\npublisher:\n  read pending outbox\n  publish to RabbitMQ\n  mark dispatched\n\nconsumer: still idempotent", caption: "The outbox closes the lost-publication gap by making publication intent durable with the domain change." } },
        ],
        {
            objective: "Reproduce the database-to-broker dual-write gap and design an outbox-based recovery path.",
            scenario: "Steward successfully retires a Service, then the process crashes before its lifecycle event reaches RabbitMQ. The database is correct but downstream consumers never learn the fact.",
            instructions: ["Diagram the naive database-then-publish sequence.", "Mark the crash window and prove what state survives on each side.", "Define an outbox record with stable event identity and minimal payload/metadata.", "Place domain change plus outbox insert in one local transaction conceptually or in a controlled implementation.", "Model publisher retry after process restart.", "Demonstrate or explain why duplicate publication is still possible and how consumer idempotency handles it."],
            deliverables: ["Dual-write failure timeline", "Outbox schema/contract", "Recovery flow", "Duplicate-publication analysis"],
            completionCriteria: ["A committed domain change cannot silently lose all publication intent in the proposed design.", "The outbox does not claim distributed exactly-once semantics.", "Publisher and consumer responsibilities are distinct.", "The learner can explain why PostgreSQL transactionality cannot directly include RabbitMQ."],
        },
        ["What is the dual-write problem?", "What guarantee does an outbox add?", "Why does an outbox not remove the need for idempotent consumers?"],
        [microservicesPatterns, rabbitmqReliability],
    ),
    richLesson(
        "RabbitMQ versus Kafka: Different Messaging Models",
        "RabbitMQ and Kafka both move data between producers and consumers, but they optimize for different mental models. TSA uses RabbitMQ first to make queueing and delivery mechanics concrete, then teaches Kafka as an architectural alternative rather than a second parallel implementation track.",
        ["Contrast brokered queues with a retained event log.", "Explain RabbitMQ competing consumers and Kafka consumer groups conceptually.", "Recognize replay/retention as a Kafka strength and operational commitment.", "Choose based on workload and semantics rather than popularity."],
        [
            { title: "RabbitMQ emphasizes routed work delivery", paragraphs: ["RabbitMQ fits work queues, routed messages, acknowledgements and per-message delivery/retry patterns naturally. Consumers usually care about receiving work and acknowledging completion; messages need not become a long-term history by default.", "That makes it a strong first implementation for Steward notifications, background jobs and integration events where the immediate problem is asynchronous delivery and failure handling."] },
            { title: "Kafka emphasizes a durable partitioned log", paragraphs: ["Kafka retains ordered records in partitions for a configured period and lets consumer groups track their own offsets. This supports replay, stream processing and high-throughput event histories, but introduces partitioning, retention and consumer-lag concerns.", "Kafka should enter a Steward architecture decision only if those capabilities match real drivers. 'More scalable' is not a sufficient requirement."], code: { language: "text", code: "RabbitMQ question: which queue(s) should receive this message, and was the work acknowledged?\nKafka question: which partition contains this record, how long is it retained, and where is each consumer group's offset?", caption: "The products overlap, but their primary operating models differ." } },
        ],
        {
            objective: "Write a RabbitMQ-versus-Kafka decision note for a concrete Steward workload without implementing Kafka.",
            scenario: "A reviewer proposes replacing RabbitMQ with Kafka before the first production-like workload exists, arguing that Kafka is 'enterprise scale'.",
            instructions: ["Define the exact Steward workload being evaluated.", "Rank drivers such as replay, throughput, routing flexibility, operational simplicity, retention and consumer independence.", "Compare RabbitMQ and Kafka against those drivers.", "State what evidence is currently missing.", "Choose one for the present and define an observable trigger that would justify revisiting the decision."],
            deliverables: ["Driver table", "RabbitMQ/Kafka comparison", "Current decision", "Revisit trigger"],
            completionCriteria: ["The comparison is workload-specific.", "Kafka is understood conceptually without creating a duplicate implementation track.", "The selected technology is not justified by popularity or vague scale claims.", "Revisit conditions are observable."],
        },
        ["What retained-log capability makes Kafka materially different from a normal queue-first model?", "Why is RabbitMQ a useful first implementation for TSA?", "What evidence should trigger a RabbitMQ-versus-Kafka reevaluation?"],
        [rabbitmqDocs, kafkaDocs],
    ),
    {
        id: "distributed-state-and-messaging-lab-evolve-steward-with-redis-and-rabbitmq",
        title: "Lab: Evolve Steward with Redis and RabbitMQ",
        activities: [
            {
                id: "distributed-state-and-messaging-lab-evolve-steward-with-redis-and-rabbitmq-brief",
                title: "Add only the infrastructure Steward has earned",
                estimatedMinutes: 30,
                content: {
                    type: "reading",
                    body: "This lab evolves Steward from a single API/database system into a deliberately distributed system. Redis and RabbitMQ are added only for two justified capabilities: a measured cacheable read path and a post-commit asynchronous side effect with a real consumer.",
                    blocks: [
                        { type: "heading", id: "required-capabilities", text: "Required capabilities", level: 2 },
                        { type: "list", items: ["One measured Redis cache-aside read path", "Explicit invalidation and cache-outage behavior", "One RabbitMQ exchange/queue/consumer flow", "Manual acknowledgement and bounded retry behavior", "Idempotent duplicate handling", "Dead-letter handling", "One eventual-consistency/ordering scenario", "A database-to-broker publication reliability design, preferably an outbox"] },
                        { type: "callout", tone: "warning", title: "Do not distribute the domain", body: "Steward remains one authoritative domain application unless evidence says otherwise. Redis is not a second source of truth, RabbitMQ is not the owner of business rules, and this lab is not permission to split Steward into microservices." },
                        { type: "resources", title: "Implementation references", resources: [redisDocs, rabbitmqDocs, rabbitmqReliability] },
                    ],
                },
            },
            {
                id: "distributed-state-and-messaging-lab-evolve-steward-with-redis-and-rabbitmq-practice",
                title: "Distributed-system evidence pass",
                estimatedMinutes: 300,
                content: {
                    type: "practical",
                    objective: "Add Redis and RabbitMQ to Steward for justified capabilities and prove both the value and the new failure semantics.",
                    scenario: "Steward now has enough representative usage to justify one shared read cache and one asynchronous side effect. A design review will reject the additions unless you can show their measured benefit, correctness boundaries and failure behavior.",
                    instructions: ["Start with pressure statements and baseline evidence for both additions.", "Implement one Redis cache-aside path with explicit key, value, TTL, source-of-truth and post-commit invalidation behavior.", "Demonstrate cache hit, miss, stale-data risk, invalidation and Redis-unavailable fallback.", "Define one Steward event for a real consumer such as notification or audit processing.", "Create RabbitMQ exchange, queue and binding topology and run producer/consumer flow.", "Demonstrate consumer downtime, manual acknowledgement and at least one redelivery.", "Make the consumer idempotent for duplicate delivery and prove it by replaying one stable event ID.", "Configure or model bounded retry plus a DLQ and recover one poison-message scenario.", "Demonstrate or simulate one out-of-order/eventual-consistency case and define the authority/convergence rule.", "Analyze the database-commit/broker-publication crash window and implement or design a transactional outbox appropriate to the project stage.", "Write a RabbitMQ-versus-Kafka decision note with an observable revisit trigger.", "Update Steward system/dependency/data-flow diagrams to show the new components, contracts and failure relationships."],
                    deliverables: ["Redis performance/correctness evidence", "RabbitMQ topology and event contract", "Retry/idempotency/DLQ evidence", "Consistency/ordering analysis", "Outbox or publication-reliability design", "RabbitMQ-vs-Kafka decision note", "Updated system diagrams"],
                    completionCriteria: ["Both additions have demonstrated drivers rather than speculative justifications.", "PostgreSQL remains authoritative for Steward domain state.", "Redis failure and staleness behavior are explicit.", "RabbitMQ consumers tolerate duplicate delivery according to the chosen effect.", "Retry is bounded and poison messages become inspectable.", "Asynchronous publication has a recovery story across process failure.", "The learner can identify at least three new failure modes introduced by the added infrastructure."],
                },
            },
            {
                id: "distributed-state-and-messaging-lab-evolve-steward-with-redis-and-rabbitmq-review",
                title: "Distributed-system defence",
                estimatedMinutes: 25,
                content: { type: "reflection", prompt: "1. What evidence justified Redis, and what would make you remove it?\n2. Which Steward data remains authoritative when Redis disagrees with PostgreSQL?\n3. Where can RabbitMQ redeliver a message after the consumer already produced an effect?\n4. How does your idempotency strategy make that duplicate safe?\n5. What happens after retry attempts are exhausted?\n6. Where can the database commit succeed while event publication fails, and how does your design recover?\n7. Which state is allowed to be eventually consistent, for how long, and why?\n8. What concrete future evidence would make Kafka a better fit than RabbitMQ?" },
            },
        ],
    },
];
