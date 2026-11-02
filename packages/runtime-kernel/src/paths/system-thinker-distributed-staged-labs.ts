import type { Lesson } from "./lesson";
import {redisLivePrimerSections,rabbitLivePrimerSections} from "./system-thinker-distributed-live-primer";
import {realOutboxWorkedSections} from "./system-thinker-real-outbox-worked";
import type { LessonBlock, LearningResource } from "../activities/content";

const redis: LearningResource = { title:"Redis — Run Open Source on Docker", url:"https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/", kind:"reference" };
const rabbit: LearningResource = { title:"RabbitMQ — Work Queues and Manual Acks (Python)", url:"https://www.rabbitmq.com/tutorials/tutorial-two-python", kind:"reference" };
const confirms: LearningResource = { title:"RabbitMQ — Consumer Acknowledgements and Publisher Confirms", url:"https://www.rabbitmq.com/docs/confirms", kind:"reference" };
const redisVideo: LearningResource = { title:"Redis — Cache-Aside Pattern", url:"https://www.youtube.com/watch?v=AJhTduDOVCs", kind:"video", purpose:"Optional visualization of cache-aside, not a substitute for the local Steward experiment." };

type Section = { title: string; paragraphs: string[]; code?: { language: string; caption: string; code: string } };
type Practice = { objective:string; scenario:string; instructions:string[]; deliverables:string[]; criteria:string[] };
function stage(id: string, title: string, intro: string, sections: Section[], practice: Practice, questions: string[], readMinutes: number, practiceMinutes: number): Lesson {
    const prefix = "distributed-state-and-messaging-" + id;
    const blocks: LessonBlock[] = [
        { type:"paragraph", text:intro },
        { type:"heading", id:prefix+"-outcomes", text:"Mechanism and verification boundary", level:2 },
    ];
    for (const section of sections) {
        blocks.push({ type:"heading", id:prefix+"-"+section.title.toLowerCase().replace(/[^a-z0-9]+/g,"-"), text:section.title, level:2 });
        for (const paragraph of section.paragraphs) blocks.push({ type:"paragraph", text:paragraph });
        if (section.code) blocks.push({type:"code",language:section.code.language,caption:section.code.caption,code:section.code.code});
    }
    blocks.push({type:"callout",tone:"warning",title:"Evidence tier",body:"Commands are a reproducible local starting point, not evidence of live integration. Redis/RabbitMQ/Steward experiments are UNVERIFIED until executed in the learner environment, including failure injection."});
    blocks.push({type:"resources",title:"Reference and optional reinforcement",resources:[redis,rabbit,confirms,redisVideo]});
    return { id:prefix,title,activities:[
        {id:prefix+"-reading",title:title+": Mechanisms",estimatedMinutes:readMinutes,content:{type:"reading",body:blocks.filter(b=>b.type==="paragraph").map(b=>b.text).join("\n\n"),blocks}},
        {id:prefix+"-practice",title:title+": Runtime Evidence",estimatedMinutes:practiceMinutes,content:{type:"practical",objective:practice.objective,scenario:practice.scenario,instructions:practice.instructions,deliverables:practice.deliverables,completionCriteria:practice.criteria}},
        {id:prefix+"-check",title:title+": Independent Defence",estimatedMinutes:15,content:{type:"reflection",prompt:questions.map((q,i)=>(i+1)+". "+q).join("\n"),minimumCharacters:220}},
    ]};
}
export const distributedStateStagedLabs: Lesson[] = [
    stage("redis-lab", "Lab 1: Redis Cache-Aside, Staleness and Outage", "A Redis server and a PostgreSQL-backed Steward application are two separate processes with different authority. Before touching app code, prove the dependency is reachable and disposable. A container is a packaged process environment; the commands below only start/inspect/stop the lab process. Docker administration is taught later, so this small bootstrap does not assume the learner already knows Docker.", [
    {
        "title": "Isolate a disposable Redis dependency",
        "paragraphs": [
            "Prerequisite: the working Builder Steward API and PostgreSQL. Docker must already be installed and running, or an instructor must provide an equivalent isolated Redis endpoint. A Docker command starts a local test process, not a production deployment; keep its port bound to 127.0.0.1 and do not expose an unauthenticated cache to a network.",
            "Run the Bash commands below in a terminal, one line at a time. docker run starts the server in the background; --rm discards the container when stopped; -p binds host loopback 6379 to container port 6379; docker exec runs redis-cli inside that container. PING proves server reachability but not application integration. SET creates a short-lived probe; GET reads it. After 30 seconds the probe expires. Always stop the container after the exercise."
        ],
        "code": {
            "language": "bash",
            "caption": "Local Redis bootstrap, observable commands and cleanup",
            "code": "docker version\ndocker run --rm -d --name tsa-redis -p 127.0.0.1:6379:6379 redis:7-alpine\ndocker exec tsa-redis redis-cli PING\n# expected: PONG\ndocker exec tsa-redis redis-cli SET tsa:probe ok EX 30\n# expected: OK\ndocker exec tsa-redis redis-cli GET tsa:probe\n# expected: ok (before 30 seconds)\n# after the application outage experiment:\ndocker stop tsa-redis"
        }
    },
    ...redisLivePrimerSections,
    {
        "title": "Keep authority in PostgreSQL and observe a miss, hit, stale read and outage",
        "paragraphs": [
            "Choose one existing GET /services query whose full result is derived from PostgreSQL. Cache the response for a bounded key that includes every query, authorization scope and response-version dimension that changes the representation. A key such as services:all is unsafe for users with different team permissions because it may leak another team's response.",
            "First observe the uncached SQL result, then a cache miss that populates Redis and a hit that avoids recomputing the same permitted result. Change the authoritative data using an allowed Steward write; without invalidation, observe whether Redis serves the old representation. Restore correctness using post-commit invalidation or a bounded TTL and explain residual stale windows. Stop Redis and prove the authorized read still works through PostgreSQL, while cache failures are observable in logs/metrics.",
            "A successful PING or redis-cli GET does not prove that Steward's permission-scoped API safely uses Redis. The learner must capture HTTP + database evidence and check a cross-team negative read. If no running Redis is available, mark the integration UNVERIFIED rather than asserting these outcomes."
        ]
    }
], {
    "objective": "Implement and measure one permission-safe cache-aside path in the real Steward API.",
    "scenario": "The catalogue GET path has a measured performance problem after SQL/index/pagination checks. Redis is now a justified experiment, not a new data owner.",
    "instructions": [
        "Confirm the explicit baseline query/latency and reject speculative performance claims.",
        "Start an isolated Redis dependency; preserve command output proving PONG.",
        "Implement key namespace/version, team-scoped authorization, TTL and cache-aside miss/hit paths.",
        "Demonstrate MISS→HIT; compare correct HTTP payload and SQL behavior.",
        "Write to PostgreSQL, reproduce stale response risk and then prove the chosen invalidation or expiry behavior.",
        "Stop Redis; assert authorized API request still produces a correct response from PostgreSQL and no cross-team leakage.",
        "Record keep/remove decision using observed performance and newly introduced failure cost.",
        "Clean up the disposable server."
    ],
    "deliverables": [
        "Baseline evidence and query/index alternatives",
        "Redis bootstrap record",
        "Scoped key/value/TTL contract",
        "Miss/hit/invalidation/outage HTTP evidence",
        "Cross-team negative test",
        "Keep/remove ADR"
    ],
    "criteria": [
        "Redis never becomes domain authority",
        "Only authorized data is cached per scope",
        "The invalidation and outage outcomes were observed in a real runtime",
        "Lab is UNVERIFIED if Redis or the API were not run"
    ]
}, [
    "Why is a successful Redis PING not enough?",
    "Which key fields prevent permission leakage?",
    "What happens when the DB commit succeeds but cache invalidation fails?"
], 30, 120),
    stage("rabbitmq-lab", "Lab 2: RabbitMQ Delivery, Acknowledgement and Replay", "A message broker accepts work now for a consumer to process later. Delivery and business effect are different events. This lesson isolates the message lifecycle before integrating the real Steward handler and its database idempotency rule.", [
    {
        "title": "Start a disposable broker and inspect its state",
        "paragraphs": [
            "Use Docker only as a local lab bootstrap; if the application already runs against an isolated instructor-provisioned broker, substitute that endpoint explicitly. The management image below is development-only, loopback-bound and uses local default credentials; never publish these ports to an untrusted network.",
            "A publisher sends to an exchange; a binding routes to a queue; a consumer receives, performs its effect and acknowledges. A successful broker startup is not proof that events are processed. The queue command reveals ready and unacknowledged counts. Stop the container when finished."
        ],
        "code": {
            "language": "bash",
            "caption": "Local RabbitMQ bootstrap and observable queue state",
            "code": "docker version\ndocker run --rm -d --name tsa-rmq -p 127.0.0.1:5672:5672 -p 127.0.0.1:15672:15672 rabbitmq:4-management\n# Wait until the broker completes startup, then:\ndocker exec tsa-rmq rabbitmq-diagnostics -q ping\n# expected: Ping succeeded\ndocker exec tsa-rmq rabbitmqctl list_queues name messages_ready messages_unacknowledged\n# after the broker exercise:\ndocker stop tsa-rmq"
        }
    },
    ...rabbitLivePrimerSections,
    {
        "title": "Acknowledge the owned effect, not merely receipt",
        "paragraphs": [
            "When a message arrives, the consumer must first validate the contract, then perform its local effect and only then acknowledge. If the process crashes after completing the effect but before ack, the broker can redeliver. Acknowledgements cannot prevent duplicate effects: persistence and deduplication inside the handler must do that.",
            "Use the RabbitMQ official Python work-queue tutorial as a starter for broker message mechanics, but TSA must own the full learning explanation: queue declaration, durable messages, manual ack, prefetch, reconnect and poison-message handling are separate decisions. The independent test is to kill the consumer before ack, restart it and observe the redelivery flag/queue evidence. Merely replaying a JSON object into a pure Python function is not evidence of RabbitMQ redelivery.",
            "Before connecting Steward's authoritative data, run a disposable consumer that only prints the event ID. Then add a real database-backed idempotency guard; confirm the same event ID triggers at most one durable effect even when delivery repeats. For permanent failure use bounded retries and a dead-letter destination that operators can inspect; blindly requeueing forever is an operational defect."
        ]
    }
], {
    "objective": "Implement a real RabbitMQ producer and consumer with redelivery-safe effects.",
    "scenario": "A lifecycle mutation commits in Steward and a non-blocking notification needs delivery, but the notification provider may fail or be slow.",
    "instructions": [
        "Define event version, stable event ID, business entity ID and bounded payload.",
        "Run a loopback-only broker and prove it is reachable; note this does not yet prove delivery.",
        "Implement an exchange/binding/queue, publish persistent messages with an appropriate confirm policy, and run the consumer.",
        "Make the consumer do its local effect before manual ack; configure bounded prefetch.",
        "Crash the consumer between effect and acknowledgement, restart, and capture actual broker redelivery.",
        "Implement a transactionally protected dedupe record with the consumer's local database effect; repeat stable ID and prove no second effect.",
        "Demonstrate bounded transient retry and poison-message delivery to an inspectable DLQ, with a safe replay procedure.",
        "Stop the broker and record how outages are surfaced and recovered."
    ],
    "deliverables": [
        "Broker topology and event contract",
        "Producer/consumer source",
        "Observed ack/redelivery and replay evidence",
        "Atomic idempotency proof",
        "DLQ/poison message/recovery record"
    ],
    "criteria": [
        "Real broker/consumer communication is observed",
        "Crash and replay do not duplicate authoritative effect",
        "Publisher confirms and consumer acks are not treated as interchangeable guarantees",
        "No broker run means UNVERIFIED"
    ]
}, [
    "Why can delivery happen twice after the business effect succeeded?",
    "Why doesn't publisher confirm prove that the consumer processed the event?",
    "What prevents a poison message from looping forever?"
], 35, 150),
    stage("outbox-lab", "Lab 3: Transactional Outbox, Ordering and Restart Recovery", "A database transaction cannot atomically commit to PostgreSQL and confirm a separate RabbitMQ publish without a distributed transaction. The transactional outbox keeps the domain change and intent to publish together, then deliberately accepts at-least-once publication with idempotent consumers.", [
    {
        "title": "Trace both sides of the dual-write failure",
        "paragraphs": [
            "Incorrect design A commits the Steward lifecycle state first, then sends directly to RabbitMQ. A process crash between the two operations leaves a committed state with no event. Incorrect design B sends first and commits the state later: an event can be consumed even if the database subsequently rolls back. A retry alone cannot make this atomic.",
            "With an outbox, the same PostgreSQL transaction writes the domain mutation and a pending outbox row containing a stable event ID and payload. The publisher later reads pending rows, publishes with confirms, and marks them delivered. A crash after publish but before marking may publish the event again; the consumer must therefore remain idempotent. The outbox is not exactly-once delivery."
        ],
        "code": {
            "language": "text",
            "caption": "Crash windows that the implemented test must distinguish",
            "code": "BEGIN PostgreSQL transaction\n  validate and update Steward lifecycle\n  insert outbox(event_id, payload, status='pending')\nCOMMIT  <-- domain state and publication intent become durable together\n\npublisher reads pending row -> publish with broker confirm\n    crash before confirm: retry later (maybe duplicated)\n    confirm succeeds -> mark delivered in PostgreSQL\n    crash before mark: publish again after restart (duplicated)\nconsumer stores event_id + its local effect atomically -> ACK\n\nNever replace these steps with a diagram-only claim: force each crash window in the running services."
        }
    },
    {
        "title": "Ordering is a domain decision, not a queue superstition",
        "paragraphs": [
            "Messages for the same Service may arrive late or out of order because of concurrent publishers, redelivery or parallel consumers. Include entity version or another domain ordering signal; if a consumer sees version 3 after version 4, it should not regress derived state to version 3. No global ordering is assumed.",
            "Measure queue growth, unprocessed outbox rows and oldest-event age. Define cleanup/retention only after delivery is durable and auditable, and prove concurrency handling when two outbox publishers race to claim the same row."
        ]
    }
    ...realOutboxWorkedSections,
], {
    "objective": "Implement and prove a durable event publication pipeline in PostgreSQL and RabbitMQ.",
    "scenario": "Steward's lifecycle event must survive a crash at any point between domain commit and consumer processing.",
    "instructions": [
        "Define outbox schema, status, event version and unique stable ID based on the actual Builder database, not a separate toy state store.",
        "Insert outbox intent in the same PostgreSQL transaction as a representative authorized lifecycle mutation.",
        "With broker unavailable, commit the mutation and prove a pending row remains; restart broker/publisher and capture eventual publication.",
        "Crash after broker confirmation but before outbox-delivered marking; restart and prove duplicate publish is harmless to the consumer.",
        "Run two publisher instances and show a concurrency-safe claim strategy rather than assuming they cannot overlap.",
        "Publish versions out of order for one Service and prove the target effect does not regress.",
        "Document retention, replay, monitoring and the limits of publisher confirm/consumer ack.",
        "Record actual SQL, logs, message IDs, queue state and consumer outcomes as evidence."
    ],
    "deliverables": [
        "Transactional SQL/app implementation",
        "Down-broker restart recovery",
        "After-confirm crash/replay proof",
        "Concurrent publisher claim evidence",
        "Out-of-order delivery test",
        "Operations/retention note"
    ],
    "criteria": [
        "Committed mutation always leaves durable pending intent",
        "At-least-once publishing is handled without duplicate effects",
        "Out-of-order events cannot regress derived state",
        "No PostgreSQL+RabbitMQ runtime means UNVERIFIED"
    ]
}, [
    "Where does the transaction boundary actually end?",
    "Why is the outbox not exactly-once message delivery?",
    "What ordering signal protects one Service without requiring global broker order?"
], 35, 165),
    stage("distributed-defence", "Lab 4: Distributed Steward System Defence", "This is a synthesis, not the place to introduce Redis, message routing or SQL transactions for the first time. It is an independent architecture defence supported by the three preceding runtime labs and a coherent system baseline.", [
    {
        "title": "Defend the simplest working architecture",
        "paragraphs": [
            "Compare baseline and distributed topology using real evidence, not technology counts. The architecture is successful only if it preserves authority/authorization, improves the named requirements and exposes a credible recovery story.",
            "If one of the earlier stages is UNVERIFIED, present that as an explicit gap, not a pass. Explain what would be needed to validate it; do not invent screenshots or runtime results."
        ]
    }
], {
    "objective": "Reconcile all three staged labs and defend the real observed architecture.",
    "scenario": "Steward now includes one justified cache and one durable asynchronous side effect. Reviewers challenge every dependency and recovery claim.",
    "instructions": [
        "Present versioned source and the pre-distribution Steward baseline.",
        "Reproduce one Redis miss/hit/invalidation and unavailable fallback.",
        "Reproduce one RabbitMQ redelivery with exactly one protected durable consumer effect.",
        "Reproduce outbox restart and duplicate publish without losing the lifecycle event.",
        "Defend alternatives including no cache, synchronous side effect, Redis removal and RabbitMQ-versus-Kafka.",
        "Show updated context/container/data-flow views with authority, trust, ownership, failure and recovery boundaries.",
        "Record any unexecuted or environment-dependent test as UNVERIFIED."
    ],
    "deliverables": [
        "Integrated runnable repository",
        "Observed failure and recovery evidence",
        "Updated model and ADRs",
        "Independent design defence",
        "Unverified evidence ledger"
    ],
    "criteria": [
        "Source of truth remains PostgreSQL",
        "Each new dependency has evidence-backed purpose",
        "Recovery scenarios are observed, not imagined",
        "All gaps and limitations are explicitly recorded"
    ]
}, [
    "Which new component would you remove first and under what threshold?",
    "Which failure was hidden before and visible after the design change?",
    "What would make Kafka a justified future choice?"
], 20, 75),
];
