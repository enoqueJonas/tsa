import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const postgresRoles: LearningResource = {
    title: "PostgreSQL — Database Roles",
    url: "https://www.postgresql.org/docs/current/user-manag.html",
};
const postgresLocks: LearningResource = {
    title: "PostgreSQL — Explicit Locking and Deadlocks",
    url: "https://www.postgresql.org/docs/current/explicit-locking.html",
};
const postgresExplain: LearningResource = {
    title: "PostgreSQL — Using EXPLAIN",
    url: "https://www.postgresql.org/docs/current/using-explain.html",
};
const postgresBackup: LearningResource = {
    title: "PostgreSQL — Backup and Restore",
    url: "https://www.postgresql.org/docs/current/backup.html",
};

type DatabaseLessonSpec = {
    id: string;
    title: string;
    intro: string;
    principles: string[];
    stewardContext: string[];
    objective: string;
    scenario: string;
    instructions: string[];
    deliverables: string[];
    completionCriteria: string[];
    reflection: string;
};

function databaseLesson(spec: DatabaseLessonSpec): Lesson {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.intro },
        { type: "heading", id: `${spec.id}-operating-model`, text: "Operating model", level: 2 },
        { type: "list", items: spec.principles },
        { type: "heading", id: `${spec.id}-steward`, text: "Steward database context", level: 2 },
        ...spec.stewardContext.map((text): LessonBlock => ({ type: "paragraph", text })),
        {
            type: "callout",
            tone: "steward",
            title: "Database stewardship boundary",
            body: "The goal is not to turn every engineer into a specialist DBA. The goal is to understand enough database operational behavior to detect risk, gather credible evidence, make safe application changes and collaborate effectively with database specialists.",
        },
        {
            type: "resources",
            title: "Continue learning",
            resources: [postgresRoles, postgresLocks, postgresExplain, postgresBackup],
        },
    ];

    return {
        id: `database-stewardship-${spec.id}`,
        title: spec.title,
        activities: [
            {
                id: `database-stewardship-${spec.id}-001`,
                title: spec.title,
                estimatedMinutes: 50,
                content: { type: "reading", body: spec.intro, blocks },
            },
            {
                id: `database-stewardship-${spec.id}-002`,
                title: `Operate: ${spec.title}`,
                estimatedMinutes: 75,
                content: {
                    type: "practical",
                    objective: spec.objective,
                    scenario: spec.scenario,
                    instructions: spec.instructions,
                    deliverables: spec.deliverables,
                    completionCriteria: spec.completionCriteria,
                },
            },
            {
                id: `database-stewardship-${spec.id}-003`,
                title: `Review: ${spec.title}`,
                estimatedMinutes: 15,
                content: {
                    type: "reflection",
                    prompt: spec.reflection,
                    minimumCharacters: 220,
                },
            },
        ],
    };
}

const lessons: DatabaseLessonSpec[] = [
    {
        id: "roles-privileges",
        title: "Database Roles and Least Privilege",
        intro: "Application database credentials are production identities. A service account that can create roles, drop schemas or read unrelated data expands the blast radius of application compromise and operator mistakes.",
        principles: [
            "Separate application runtime privileges from migration/administration privileges.",
            "Grant the smallest object and action scope required by each workload.",
            "Review inherited privileges and default privileges, not only explicit GRANT statements.",
            "Treat credential rotation and ownership as part of database operations.",
        ],
        stewardContext: [
            "Steward's runtime identity should perform normal application reads/writes without owning the entire PostgreSQL cluster.",
            "Schema migration work may legitimately require broader privileges, but that identity should not become the permanent runtime credential.",
        ],
        objective: "Design and verify a least-privilege PostgreSQL role model for Steward.",
        scenario: "A compromised Steward runtime token must not automatically become permission to administer the database platform.",
        instructions: [
            "Inventory the database actions required by Steward runtime, migrations and administrative recovery.",
            "Define separate roles or privilege sets for those responsibilities.",
            "Verify one allowed runtime operation and at least two operations that the runtime identity must be denied.",
            "Record how credentials are issued, rotated and revoked in the current environment.",
        ],
        deliverables: ["Role/privilege matrix", "GRANT/REVOKE evidence", "Denied-operation evidence", "Credential lifecycle note"],
        completionCriteria: [
            "Runtime privileges are narrower than administrative privileges.",
            "Denied operations are demonstrated rather than assumed.",
            "The role model supports required application behavior without broad ownership shortcuts.",
        ],
        reflection: "Why is a database account that merely ‘works’ an insufficient production design, and which privileges would create the largest Steward blast radius if misused?",
    },
    {
        id: "connections-pooling",
        title: "Connections, Pools and Exhaustion",
        intro: "Database connections are finite resources. Application concurrency, worker processes and deployment scaling can exhaust PostgreSQL long before CPU or memory appears saturated.",
        principles: [
            "Know PostgreSQL connection limits and reserved capacity.",
            "Treat application pools as admission control rather than an unlimited accelerator.",
            "Observe active, idle and waiting connections under load.",
            "Size pools across all application replicas and background workers, not one process in isolation.",
        ],
        stewardContext: [
            "A harmless-looking pool size multiplied across Steward replicas can consume the entire database connection budget.",
            "Connection exhaustion often surfaces as application latency or timeouts, so database and application telemetry must be correlated.",
        ],
        objective: "Measure Steward connection behavior and define a defensible connection-pool budget.",
        scenario: "Steward is scaled from one application process to multiple workers and the database begins rejecting or delaying connections.",
        instructions: [
            "Record PostgreSQL's effective connection limit and currently reserved/administrative capacity.",
            "Measure Steward active, idle and waiting connections at baseline and under a controlled concurrent workload.",
            "Calculate the worst-case aggregate pool demand across application replicas and workers.",
            "Choose a pool limit and timeout behavior that preserves headroom and fails predictably under exhaustion.",
        ],
        deliverables: ["Connection budget", "Baseline/load connection evidence", "Pool sizing rationale", "Exhaustion behavior note"],
        completionCriteria: [
            "Pool sizing accounts for aggregate application concurrency.",
            "Headroom for administration/recovery is preserved.",
            "Exhaustion behavior is observable and bounded rather than an unexplained hang.",
        ],
        reflection: "Why can increasing a connection pool make a saturated Steward system slower or less reliable instead of increasing throughput?",
    },
    {
        id: "slow-queries-plans",
        title: "Slow Queries and Query-plan Evidence",
        intro: "Slow-query work begins with evidence about frequency, latency and plan behavior. Indexes and rewrites are changes with costs, not universal fixes.",
        principles: [
            "Identify expensive queries from workload evidence rather than intuition.",
            "Use EXPLAIN/EXPLAIN ANALYZE carefully to understand plan shape and estimates.",
            "Evaluate indexes against realistic data volume and write overhead.",
            "Retest end-to-end behavior after database changes.",
        ],
        stewardContext: [
            "Service search, ownership filtering or dependency traversal may become expensive as Steward data grows.",
            "A query that is fast in a developer database may choose a different plan or become I/O-heavy with production-like cardinality.",
        ],
        objective: "Investigate one realistic Steward slow-query candidate and produce an evidence-backed improvement decision.",
        scenario: "A Steward endpoint breaches its latency expectation under realistic data volume, but application CPU remains healthy.",
        instructions: [
            "Identify the SQL generated for the affected request and capture execution frequency/latency where available.",
            "Run EXPLAIN or EXPLAIN ANALYZE in a learner-controlled environment with representative data.",
            "Identify cardinality-estimate, scan, join or sorting evidence relevant to the delay.",
            "Test one targeted change such as an index, query rewrite, reduced round trips or ORM loading strategy.",
            "Compare before/after request and query evidence and record any new write/storage cost.",
        ],
        deliverables: ["Slow-query evidence", "Query plan", "Before/after comparison", "Optimization trade-off note"],
        completionCriteria: [
            "The suspected query is linked to user-visible latency.",
            "The proposed improvement is supported by plan/runtime evidence.",
            "New costs such as write amplification or index storage are acknowledged.",
        ],
        reflection: "What evidence would make you reject an apparently faster index-based solution for Steward?",
    },
    {
        id: "locks-deadlocks",
        title: "Locks, Blocking and Deadlocks",
        intro: "Transactions protect consistency by coordinating concurrent access, but lock waits and deadlocks can turn correct business logic into production latency or failed requests.",
        principles: [
            "Distinguish a long-running query from a query waiting on another transaction.",
            "Inspect blockers and waiters before terminating sessions blindly.",
            "Keep transactions as small and predictable as domain correctness allows.",
            "Deadlocks are resolved by aborting work; applications must handle the resulting failure safely.",
        ],
        stewardContext: [
            "Concurrent ownership changes, dependency updates or bulk lifecycle operations can contend on shared rows.",
            "The useful question is not only which statement failed, but which transaction relationship created the wait cycle.",
        ],
        objective: "Reproduce and diagnose controlled lock contention and deadlock behavior in Steward's PostgreSQL environment.",
        scenario: "Two concurrent Steward workflows touch shared records in conflicting order and one request times out or is aborted by PostgreSQL.",
        instructions: [
            "Create a learner-controlled blocking scenario with two sessions and identify the blocking and waiting transactions.",
            "Capture the PostgreSQL evidence that distinguishes lock waiting from ordinary slow execution.",
            "Create or analyze a safe deadlock example and observe PostgreSQL's resolution behavior.",
            "Identify the application-level ordering, transaction scope or retry/idempotency behavior needed to reduce impact.",
        ],
        deliverables: ["Blocking-session evidence", "Deadlock evidence", "Application impact analysis", "Mitigation proposal"],
        completionCriteria: [
            "The learner can identify blocker and waiter relationships.",
            "Deadlock behavior is reproduced only in learner-controlled infrastructure.",
            "Mitigation preserves domain consistency rather than simply disabling concurrency controls.",
        ],
        reflection: "Why is killing a blocked database session not a sufficient root-cause fix for recurring Steward lock contention?",
    },
    {
        id: "safe-migrations",
        title: "Operationally Safe Database Migrations",
        intro: "A migration that is logically correct can still be operationally unsafe if it locks a large table, rewrites data for too long, breaks rolling compatibility or leaves rollback assumptions untested.",
        principles: [
            "Review lock and rewrite behavior before production execution.",
            "Prefer expand/contract patterns when application versions overlap.",
            "Separate long data backfills from schema changes where useful.",
            "Define observation and stop conditions for risky migrations.",
        ],
        stewardContext: [
            "Delivery Engineer already automated migrations; Reliability must now challenge whether a specific migration is safe under realistic data volume and concurrent traffic.",
            "Compatibility matters when old and new Steward instances can coexist during rolling or GitOps-driven deployment.",
        ],
        objective: "Assess a Steward schema change for lock, compatibility and recovery risk before release.",
        scenario: "A new Steward feature requires a non-null field and data backfill on a table that is actively read and written.",
        instructions: [
            "Describe the desired schema/data end state and the current application compatibility constraints.",
            "Identify operations that may acquire strong locks, rewrite rows or run for a long duration.",
            "Design a staged migration/backfill approach where needed.",
            "Define telemetry, timeout/stop conditions and recovery actions for the release.",
            "Prove old/new application compatibility for the overlap period when rolling deployment is used.",
        ],
        deliverables: ["Migration risk review", "Staged execution plan", "Compatibility evidence", "Stop/recovery criteria"],
        completionCriteria: [
            "Lock and duration risks are explicit.",
            "Application/database version overlap is addressed.",
            "Recovery is more concrete than ‘restore the backup if needed’.",
        ],
        reflection: "Why can a perfectly valid Django migration still be unacceptable to run directly in a busy Steward production environment?",
    },
    {
        id: "backup-restore-rpo-rto",
        title: "Database Backup, Restore and Recovery Evidence",
        intro: "A backup is only a recovery capability after restore has been proven. Database reliability therefore depends on restore testing, recovery objectives and evidence that the recovered data is usable by the application.",
        principles: [
            "Tie backup frequency and retention to RPO, not habit.",
            "Measure restoration against RTO in a controlled drill.",
            "Verify application-level integrity after restore.",
            "Protect backup credentials and storage as sensitive infrastructure.",
        ],
        stewardContext: [
            "The Disaster Recovery module covers system-level recovery; this lesson focuses specifically on PostgreSQL recovery evidence and its application consequences.",
            "Restoring an old database while deploying a newer incompatible Steward version is not successful recovery.",
        ],
        objective: "Prove that Steward PostgreSQL backups can restore a usable application state within defined recovery objectives.",
        scenario: "Assume the primary Steward database is unavailable and the latest approved backup must be restored into learner-controlled recovery infrastructure.",
        instructions: [
            "State Steward's assumed database RPO and RTO and explain the trade-offs.",
            "Restore a selected backup into an isolated recovery target.",
            "Measure restore duration and identify data potentially lost relative to the failure point.",
            "Run application-level verification against the recovered database, including schema compatibility and critical domain records.",
            "Record gaps between the measured outcome and the recovery objectives.",
        ],
        deliverables: ["RPO/RTO statement", "Restore execution evidence", "Application integrity checks", "Recovery-gap analysis"],
        completionCriteria: [
            "Recovery is demonstrated through restore, not inferred from backup success.",
            "Recovered data is verified through Steward behavior or queries.",
            "Measured results are compared with the stated objectives.",
        ],
        reflection: "What would make a technically successful PostgreSQL restore still count as a failed Steward recovery?",
    },
    {
        id: "database-capacity-health",
        title: "Database Capacity and Health Review",
        intro: "Database health combines workload, latency, connections, locks, storage growth, vacuum/maintenance behavior and recovery readiness. No single dashboard number can summarize it safely.",
        principles: [
            "Review service symptoms together with database resource signals.",
            "Track storage and table/index growth before exhaustion.",
            "Watch connection, lock and query trends over time.",
            "Turn findings into prioritized operational actions rather than dashboard decoration.",
        ],
        stewardContext: [
            "PostgreSQL is a durable dependency of Steward, so database health belongs in the Reliability Program alongside API, Redis, RabbitMQ, Kong and platform health.",
            "The purpose is to recognize when specialist DBA help is needed and arrive with evidence that shortens the investigation.",
        ],
        objective: "Produce a reviewable Steward database-health assessment and operational backlog.",
        scenario: "Before the Reliability milestone, the team needs evidence that PostgreSQL capacity and recovery risks are visible rather than hidden behind application-level green checks.",
        instructions: [
            "Collect a representative snapshot of latency, connections, locks, storage growth and backup/restore state.",
            "Identify at least three trends or thresholds that deserve ongoing observation.",
            "Classify findings by immediate risk, growth risk and evidence gap.",
            "Create a prioritized backlog with ownership and remeasurement triggers.",
        ],
        deliverables: ["Database health review", "Trend/threshold set", "Prioritized database operations backlog", "Escalation criteria"],
        completionCriteria: [
            "The assessment combines application and database evidence.",
            "Capacity/recovery risks are distinguishable from ordinary utilization.",
            "The learner identifies when deeper DBA expertise is appropriate.",
        ],
        reflection: "Which database-health signals would make you escalate a Steward incident to a database specialist, and what evidence should you collect before doing so?",
    },
];

const lab: Lesson = {
    id: "database-stewardship-operational-review",
    title: "Lab: Run the Steward Database Stewardship Review",
    activities: [
        {
            id: "database-stewardship-operational-review-001",
            title: "Investigate a Slow or Saturated Database Path",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Run an evidence-driven database incident investigation against learner-controlled Steward infrastructure.",
                scenario: "A critical Steward request becomes slow under load. Determine whether query execution, connection exhaustion, lock waiting or another database condition is responsible.",
                instructions: [
                    "Reproduce the affected workload safely.",
                    "Capture application latency/request identity and PostgreSQL connection/query/lock evidence.",
                    "Test competing hypotheses instead of assuming the first slow query is causal.",
                    "Apply or propose the smallest justified remediation and retest.",
                ],
                deliverables: ["Incident timeline", "Database evidence set", "Hypothesis log", "Retest result"],
                completionCriteria: [
                    "The root-cause conclusion is evidence-backed or explicitly remains unresolved.",
                    "Application and database observations are correlated.",
                    "The remediation does not simply move risk elsewhere without acknowledgement.",
                ],
            },
        },
        {
            id: "database-stewardship-operational-review-002",
            title: "Prove Recovery and Operational Readiness",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Combine privilege, migration and recovery evidence into a database operational-readiness review.",
                scenario: "The Reliability milestone needs evidence that PostgreSQL can be operated, changed and recovered safely—not only queried successfully.",
                instructions: [
                    "Review the runtime/migration role separation.",
                    "Select one schema-change risk and show its safe execution or rollout plan.",
                    "Run or reference a controlled restore drill and verify application compatibility.",
                    "Record outstanding database risks, ownership and escalation triggers for the Reliability Program.",
                ],
                deliverables: ["Database readiness review", "Privilege evidence", "Migration safety evidence", "Recovery evidence", "Residual-risk backlog"],
                completionCriteria: [
                    "The review includes preventive, operational and recovery controls.",
                    "Unverified assumptions are visible.",
                    "Database risks feed the broader Steward Reliability Program.",
                ],
            },
        },
    ],
};

export const databaseStewardshipDeepLessons: Lesson[] = [...lessons.map(databaseLesson), lab];
