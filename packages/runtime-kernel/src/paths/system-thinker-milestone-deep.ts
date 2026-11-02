import type { LearningPath } from "./learning-path";

export const stewardApiSystemDesignPortfolioDeep: LearningPath = {
    id: "steward-api-system-design-portfolio",
    title: "System Thinker Milestone",
    lessons: [{
        id: "steward-api-system-design-portfolio-milestone",
        title: "Milestone: Steward API System Design Portfolio",
        activities: [
            {
                id: "steward-api-system-design-portfolio-brief",
                title: "Milestone Brief: Steward System Design Portfolio",
                estimatedMinutes: 30,
                content: {
                    type: "reading",
                    body: "Continue from the exact Steward API v1 Builder checkpoint and the System Thinker artifacts created against it. Turn that same system into one coherent system-design portfolio, then analyze the deliberately introduced cache and asynchronous-delivery pressures used by TSA to teach distributed state. The goal is to connect requirements, boundaries, models, dependencies, data flow, failure reasoning and architecture decisions without pretending the technologies are free.",
                    blocks: [
                        { type: "heading", id: "mission", text: "Mission", level: 2 },
                        { type: "paragraph", text: "Begin from the PostgreSQL-backed Steward repository you completed in Builder. Record its commit/tag and current runtime topology before adding anything. Reconcile what already exists before adding anything. TSA then supplies two credible learning scenarios: a high-volume catalogue read remains expensive after ordinary database/query improvements, and post-commit lifecycle side effects must survive slow or unavailable consumers without delaying the authoritative transaction." },
                        { type: "heading", id: "technology-contract", text: "Technology learning contract", level: 2 },
                        { type: "paragraph", text: "Redis is TSA's primary cache implementation and RabbitMQ is TSA's primary broker implementation for these scenarios. You will implement them to learn the operational and correctness consequences. You must still compare the simpler baseline and credible alternatives. Kafka is a comparison technology here, not a second permanent broker." },
                        { type: "heading", id: "required-evidence", text: "Required evidence set", level: 2 },
                        { type: "list", items: [
                            "Problem statement, stakeholder/actor map and prioritized functional + quality requirements",
                            "System context with explicit system, trust and ownership boundaries",
                            "Container/component views and one lifecycle/state model",
                            "Responsibility and dependency map with coupling findings",
                            "At least three important data-flow views, including one failure-oriented flow",
                            "Cache-pressure evidence, Redis authority/staleness/invalidation/fallback evidence and a keep/remove condition",
                            "Async-side-effect pressure, RabbitMQ delivery/retry/idempotency/DLQ evidence and a keep/remove condition",
                            "RabbitMQ-versus-Kafka comparison without a duplicate Kafka production implementation",
                            "Failure portfolio covering dependency, state, saturation and operational failure",
                            "At least two evidence-backed ADRs with alternatives, consequences and revisit conditions",
                            "A final open-questions and next-school handoff section"
                        ] },
                        { type: "callout", tone: "warning", title: "Scenario-forced learning, not architecture theatre", body: "The scenarios intentionally create reasons to learn Redis and RabbitMQ. Do not invent additional caches, brokers or microservices. The lesson is to understand these technologies deeply enough to implement, break, defend and later remove them—not to maximize component count." },
                    ],
                },
            },
            {
                id: "steward-api-system-design-portfolio-gate-1",
                title: "Gate 1: Reconcile Requirements, Context and Vocabulary",
                estimatedMinutes: 90,
                content: {
                    type: "practical",
                    objective: "Create one consistent system baseline before distributed learning scenarios change the topology.",
                    scenario: "Your earlier artifacts were produced against the Builder v1 system incrementally. Establish one traceable baseline from the actual repository commit/tag, requirements and diagrams before attributing problems or solutions to new infrastructure.",
                    instructions: [
                        "Record the exact Builder v1 repository commit/tag, database baseline and run instructions that this portfolio analyzes.", "Review the problem statement and remove implementation language that defines the product in terms of Django folders or endpoints.",
                        "Reconcile stakeholders, actors and external systems.",
                        "Reconcile functional requirements around ownership, lifecycle, criticality, environments, dependencies, membership/access and reviews.",
                        "Rank important quality requirements using scenarios rather than adjectives.",
                        "Review system, trust and ownership boundaries and retain genuine uncertainties.",
                        "Create a canonical Steward vocabulary.",
                        "Record the pre-Redis/pre-RabbitMQ baseline so later evidence can show exactly what changed."
                    ],
                    deliverables: ["Traceable Builder v1 code/runtime checkpoint", "Reconciled problem + requirements baseline", "Canonical vocabulary", "Reviewed context/boundaries", "Pre-distribution baseline"],
                    completionCriteria: ["Every System Thinker artifact can be traced to the same Builder v1 baseline or explicitly marked as a later proposed/implemented change.", "Requirements describe needed behavior rather than code structure.", "Actors and boundaries are coherent.", "The baseline can be compared with later distributed topology.", "Vocabulary is consistent."],
                },
            },
            {
                id: "steward-api-system-design-portfolio-gate-2",
                title: "Gate 2: Model Responsibilities and New Pressures",
                estimatedMinutes: 150,
                content: {
                    type: "practical",
                    objective: "Model Steward responsibilities and prove what new capability the supplied cache and async scenarios require.",
                    scenario: "Two new pressures have arrived, but the organization does not want infrastructure that merely hides weak SQL or unnecessary synchronous coupling.",
                    instructions: [
                        "Refine the current container/component and dependency views before adding Redis or RabbitMQ.",
                        "For the catalogue-read scenario, inspect query shape, pagination, N+1 behavior and indexing first; record why the supplied workload still warrants a shared cache experiment.",
                        "For the lifecycle-side-effect scenario, separate the authoritative mutation from the side effect and state why the side effect may complete later.",
                        "Model Redis as derived cache state with PostgreSQL remaining authoritative.",
                        "Model RabbitMQ as transport state and identify producer, exchange/queue, consumer and the business meaning of pending work.",
                        "Compare at least one simpler alternative for each capability and record the new failure modes introduced by the selected technology."
                    ],
                    deliverables: ["Reviewed structural model", "Cache pressure statement", "Async pressure statement", "Authority/dependency classification", "Alternative comparison"],
                    completionCriteria: ["Redis does not become a second source of truth.", "RabbitMQ does not own authorization or authoritative mutation.", "The pressure exists independently of the selected product.", "Alternatives are credible rather than straw men."],
                },
            },
            {
                id: "steward-api-system-design-portfolio-gate-3",
                title: "Gate 3: Implement and Break the Distributed Boundaries",
                estimatedMinutes: 240,
                content: {
                    type: "practical",
                    objective: "Gain hands-on experience with Redis and RabbitMQ while proving their correctness and failure boundaries.",
                    scenario: "The organization approved bounded implementations for the two supplied pressures. You must now prove what happens in normal operation and when the new dependencies fail.",
                    instructions: [
                        "Implement a cache-aside Redis slice for the selected catalogue read and capture uncached, miss, hit, expiry and eviction evidence; prove the key includes every input dimension that changes the representation.",
                        "Define freshness tolerance and demonstrate a stale-read case after an authoritative change.",
                        "Implement post-commit invalidation or another justified strategy and prove Redis-unavailable fallback behavior.",
                        "Implement one RabbitMQ producer/consumer flow for the lifecycle side effect with a minimal stable event contract; configure and prove the intended durability/publisher-confirm semantics, bounded consumer prefetch and one backward-compatible contract evolution.",
                        "Demonstrate acknowledgement timing, consumer outage, bounded retry, duplicate delivery/idempotent effect and dead-letter handling.",
                        "For a local database-backed consumer effect, prove that stable processed-event identity and the effect commit atomically in one local transaction; if the chosen effect is external, document the remaining ambiguity and boundary-supported idempotency mechanism.",
                        "Carry forward the implemented PostgreSQL transactional outbox, restartable publisher and RabbitMQ consumer; reproduce the database-commit/message-publication crash window, prove restart recovery from durable publication intent, demonstrate concurrent publisher claiming/coordination and define dispatched-row retention plus oldest-pending observability.",
                        "Record the operational evidence needed to distinguish API, PostgreSQL, Redis, broker and consumer failures."
                    ],
                    deliverables: ["Redis implementation/failure evidence", "RabbitMQ implementation/failure evidence", "Consistency/publication analysis", "Cross-referenced failure portfolio"],
                    completionCriteria: ["The learner has actually implemented both primary technologies.", "PostgreSQL authority remains explicit.", "Staleness and cache outage are demonstrated.", "Duplicate/redelivery behavior is handled deliberately.", "Consumer-side idempotency does not leave an avoidable crash gap between local effect and processed-event identity.", "The system does not claim exactly-once behavior without proof."],
                },
            },
            {
                id: "steward-api-system-design-portfolio-gate-4",
                title: "Gate 4: Defend Primary Technologies and Alternatives",
                estimatedMinutes: 135,
                content: {
                    type: "practical",
                    objective: "Turn implementation evidence into explicit architecture decisions without accumulating redundant technologies.",
                    scenario: "A review asks why Steward uses Redis and RabbitMQ, whether Kafka should also be deployed, and what would make either current component removable later.",
                    instructions: [
                        "Write ADRs for the cache and asynchronous-delivery decisions using evidence from the exercises.",
                        "Compare Redis with retaining the database-only path and identify a measurable removal/revisit trigger.",
                        "Compare RabbitMQ with synchronous execution and Kafka for the stated workload.",
                        "Do not implement Kafka as a second permanent broker; use documentation, a bounded conceptual/experimental comparison or architecture evidence.",
                        "Record consequences, assumptions, operational costs and observable revisit triggers.",
                        "Identify one plausible future migration trigger and the evidence that would justify undertaking it."
                    ],
                    deliverables: ["Cache ADR", "Messaging ADR", "RabbitMQ/Kafka comparison", "Retention/removal/migration triggers"],
                    completionCriteria: ["Technology selection is tied to the supplied scenario and evidence.", "Alternatives are understood without redundant production implementation.", "Operational costs are explicit.", "Each primary technology has a revisit/removal condition."],
                },
            },
            {
                id: "steward-api-system-design-portfolio-gate-5",
                title: "Gate 5: Assemble the Reviewable Portfolio",
                estimatedMinutes: 120,
                content: {
                    type: "practical",
                    objective: "Assemble a portfolio that shows Steward before and after the deliberate distributed-system learning scenarios.",
                    scenario: "A senior engineer should be able to understand not only the final topology but the pressures and decisions that caused it to change.",
                    instructions: [
                        "Create a portfolio index with purpose, scope and navigation.",
                        "Order evidence from baseline problem/context through pressure, implementation, failure and decisions.",
                        "For every diagram/model state the question, audience, evidence, assumptions and omissions.",
                        "Show current-state versus future/migration possibilities explicitly.",
                        "Remove redundant artifacts that do not add a useful perspective.",
                        "Finish with a Platform Builder handoff that identifies the exact Steward revision and every runtime process now required: API, PostgreSQL, Redis, RabbitMQ, outbox publisher and lifecycle-event consumer. Include start/stop commands, configuration-key names without secret values, listeners/ports, persistent or durable state, Redis key/TTL/invalidation contract, RabbitMQ exchange/queue/DLQ topology, PostgreSQL migration/outbox state, process dependencies, one known-good request/event flow and the failure/recovery evidence Platform must preserve."
                    ],
                    deliverables: ["Portfolio index", "Curated evidence set", "Consistency checklist", "Executable Platform Builder runtime handoff"],
                    completionCriteria: ["A reviewer can navigate without oral guidance.", "The original simple baseline remains visible.", "The reasons for Redis/RabbitMQ are traceable.", "Future alternatives are not confused with current deployed components.", "Another engineer can identify and start every current Steward runtime process from the handoff without reconstructing topology from lesson history."],
                },
            },
            {
                id: "steward-api-system-design-portfolio-independent-transfer",
                title: "Independent Transfer: Design an Unfamiliar Service",
                estimatedMinutes: 150,
                content: {
                    type: "practical",
                    objective: "Independently transfer System Thinker reasoning to a domain that is not the rehearsed Steward API, and defend an economical architecture using evidence.",
                    scenario: "A university needs a room-booking service for two campuses. Only authorized campus coordinators may approve a booking; the same physical room must not be booked for overlapping periods. PostgreSQL is available. A separate university identity provider authenticates users; a legacy facilities system exports a nightly CSV inventory; an audit system exposes only SOAP; email delivery can take 2 seconds and be intermittently unavailable. Initial traffic is around 300 booking requests per day. The product owner requests Redis, Kafka and microservices because 'enterprise systems use them', but provides no performance measurements or operational staff to maintain them. You may ask the reviewer at most three scope questions; after that, state your assumptions and proceed.",
                    instructions: [
                        "Without copying the Steward diagrams, write one concise problem statement, stakeholders, actor goals and a table separating facts from explicit assumptions.",
                        "Define four functional requirements, two measurable quality requirements and one non-functional constraint. State acceptance evidence and at least one counterexample for each critical requirement.",
                        "Draw a context diagram with actor, university identity provider, nightly CSV producer, SOAP audit service and outbound email provider; label boundaries and relationship direction. Then draw a minimal deployable view and one interaction/sequence trace.",
                        "Define how the database enforces the no-overlapping-booking invariant under concurrent requests; identify an implementation strategy and a competing alternative with trade-offs. Demonstrate the race as two overlapping requests in an isolated test if your environment permits; otherwise keep the claim UNVERIFIED.",
                        "Specify the file delivery identity, final-name handoff, version/rejection rules, replay behavior, and what remains authoritative on import. Show a concrete conflicting-replay case.",
                        "Define the SOAP boundary, what the adapter must translate and how to distinguish transport failure, contract validation and business failure.",
                        "Decide which side effects may be asynchronous. Compare synchronous email, database outbox plus worker, and a broker; explicitly evaluate the simpler option before adding RabbitMQ. Explain what happens when the database commit succeeds and the email provider is down.",
                        "Reject or justify Redis, Kafka and microservices based on actual requirements, measurable triggers, operating cost and failure behavior, not on previous course technology choices.",
                        "Produce two brief ADRs, one failure-recovery runbook and a five-minute uncoached explanation. Mark every diagram-only/runtime-unobserved statement as an assumption or UNVERIFIED.",
                    ],
                    deliverables: [
                        "New-domain problem framing and acceptance matrix",
                        "Context, deployable and sequence diagrams with explicit ownership/trust boundaries",
                        "Concurrency and source-of-truth analysis with test evidence or UNVERIFIED marking",
                        "CSV and SOAP boundary contracts with failure cases",
                        "Asynchronous-effect and infrastructure choice ADRs",
                        "Failure-recovery runbook and independent explanation",
                    ],
                    completionCriteria: [
                        "Human reviewer scores six dimensions 0/1/2: (1) problem & evidence, (2) boundaries/diagrams, (3) invariant/concurrency, (4) CSV & SOAP semantics, (5) async/failure & technology trade-offs, (6) independent defence and limitations.",
                        "Score 0 = absent, wrong, or unargued; 1 = partially correct but needs prompting or omits a consequential failure; 2 = correct, justified, appropriately detailed, and independently defended with relevant evidence.",
                        "Transfer PASS requires at least 10/12 and no zero in any dimension, plus at least one independently diagnosed unexpected case. A copied Steward answer is not transfer.",
                        "A green build or automated traversal cannot award the human transfer PASS; record assessor, date, learner responses, failed decisions and corrections separately.",
                    ],
                },
            },
            {
                id: "steward-api-system-design-portfolio-exit",
                title: "Milestone Review and Exit Criteria",
                estimatedMinutes: 40,
                content: {
                    type: "reflection",
                    prompt: [
                        "1. What was Steward's topology before the distributed learning scenarios?",
                        "2. Which simpler database/query fixes were considered before the Redis exercise?",
                        "3. What data remains authoritative when Redis is stale or unavailable?",
                        "4. What product behavior allowed the RabbitMQ side effect to complete asynchronously?",
                        "5. Where can duplicate delivery occur, what makes the consumer effect safe, and which part of that safety is atomic only within the local database?",
                        "6. Which Redis key dimensions, eviction behavior and representation-version rule protect cache correctness?",
                        "7. What RabbitMQ durability, publisher-confirm and prefetch choices did you prove, and what do they not guarantee?",
                        "8. How do concurrent outbox publishers coordinate, and how do you detect and clean old outbox state?",
                        "9. Where can PostgreSQL commit while publication fails, and how is that gap recovered?",
                        "10. Why is RabbitMQ the primary implementation for this scenario instead of deploying RabbitMQ and Kafka together?",
                        "11. Under what future workload would Kafka become a credible migration candidate?",
                        "12. What evidence would justify removing Redis?",
                        "13. Which new failure mode surprised you most after adding distributed state?",
                        "14. What responsibility moves into Platform Builder now that these dependencies must be operated?"
                    ].join("\n"),
                },
            },
        ],
    }],
};
