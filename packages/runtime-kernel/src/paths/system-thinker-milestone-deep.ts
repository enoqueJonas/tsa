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
                    body: "Turn Steward API v1 into one coherent system-design portfolio, then analyze the deliberately introduced cache and asynchronous-delivery pressures used by TSA to teach distributed state. The goal is to connect requirements, boundaries, models, dependencies, data flow, failure reasoning and architecture decisions without pretending the technologies are free.",
                    blocks: [
                        { type: "heading", id: "mission", text: "Mission", level: 2 },
                        { type: "paragraph", text: "Begin from the simpler PostgreSQL-backed Steward baseline. Reconcile what already exists before adding anything. TSA then supplies two credible learning scenarios: a high-volume catalogue read remains expensive after ordinary database/query improvements, and post-commit lifecycle side effects must survive slow or unavailable consumers without delaying the authoritative transaction." },
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
                    scenario: "Your earlier artifacts were produced incrementally. Establish what Steward v1 actually is before attributing problems or solutions to new infrastructure.",
                    instructions: [
                        "Review the problem statement and remove implementation language that defines the product in terms of Django folders or endpoints.",
                        "Reconcile stakeholders, actors and external systems.",
                        "Reconcile functional requirements around ownership, lifecycle, criticality, environments, dependencies, membership/access and reviews.",
                        "Rank important quality requirements using scenarios rather than adjectives.",
                        "Review system, trust and ownership boundaries and retain genuine uncertainties.",
                        "Create a canonical Steward vocabulary.",
                        "Record the pre-Redis/pre-RabbitMQ baseline so later evidence can show exactly what changed."
                    ],
                    deliverables: ["Reconciled problem + requirements baseline", "Canonical vocabulary", "Reviewed context/boundaries", "Pre-distribution baseline"],
                    completionCriteria: ["Requirements describe needed behavior rather than code structure.", "Actors and boundaries are coherent.", "The baseline can be compared with later distributed topology.", "Vocabulary is consistent."],
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
                        "Implement a cache-aside Redis slice for the selected catalogue read and capture uncached, miss, hit and expiry evidence.",
                        "Define freshness tolerance and demonstrate a stale-read case after an authoritative change.",
                        "Implement post-commit invalidation or another justified strategy and prove Redis-unavailable fallback behavior.",
                        "Implement one RabbitMQ producer/consumer flow for the lifecycle side effect with a minimal stable event contract.",
                        "Demonstrate acknowledgement timing, consumer outage, bounded retry, duplicate delivery/idempotent effect and dead-letter handling.",
                        "Expose the database-commit/message-publication crash window and implement or design the recovery/outbox strategy appropriate to the exercise.",
                        "Record the operational evidence needed to distinguish API, PostgreSQL, Redis, broker and consumer failures."
                    ],
                    deliverables: ["Redis implementation/failure evidence", "RabbitMQ implementation/failure evidence", "Consistency/publication analysis", "Cross-referenced failure portfolio"],
                    completionCriteria: ["The learner has actually implemented both primary technologies.", "PostgreSQL authority remains explicit.", "Staleness and cache outage are demonstrated.", "Duplicate/redelivery behavior is handled deliberately.", "The system does not claim exactly-once behavior without proof."],
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
                        "Finish with a Platform Builder handoff describing what operating PostgreSQL, Redis, RabbitMQ and Steward on real hosts now requires."
                    ],
                    deliverables: ["Portfolio index", "Curated evidence set", "Consistency checklist", "Platform Builder handoff"],
                    completionCriteria: ["A reviewer can navigate without oral guidance.", "The original simple baseline remains visible.", "The reasons for Redis/RabbitMQ are traceable.", "Future alternatives are not confused with current deployed components."],
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
                        "5. Where can duplicate delivery occur and what makes the consumer effect safe?",
                        "6. Where can PostgreSQL commit while publication fails, and how is that gap recovered?",
                        "7. Why is RabbitMQ the primary implementation for this scenario instead of deploying RabbitMQ and Kafka together?",
                        "8. Under what future workload would Kafka become a credible migration candidate?",
                        "9. What evidence would justify removing Redis?",
                        "10. Which new failure mode surprised you most after adding distributed state?",
                        "11. What responsibility moves into Platform Builder now that these dependencies must be operated?"
                    ].join("\n"),
                },
            },
        ],
    }],
};
