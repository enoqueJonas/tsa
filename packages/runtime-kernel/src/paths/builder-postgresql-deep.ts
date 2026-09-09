import type { LearningResource, LessonBlock } from "../activities";
import type { Lesson } from "./lesson";

interface DataLessonSpec {
    id: string;
    title: string;
    introduction: string;
    outcomes: string[];
    sections: Array<{ id: string; title: string; body: string; code?: string }>;
    warning?: string;
    assignment: string[];
    resources: LearningResource[];
    practiceObjective: string;
    practiceInstructions: string[];
    knowledgeCheck: string;
}

const postgresDocs: LearningResource = { title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/current/" };
const djangoQueryDocs: LearningResource = { title: "Django — Making queries", url: "https://docs.djangoproject.com/en/stable/topics/db/queries/" };
const djangoMigrationDocs: LearningResource = { title: "Django — Migrations", url: "https://docs.djangoproject.com/en/stable/topics/migrations/" };

function lesson(spec: DataLessonSpec): Lesson {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: spec.outcomes },
        ...spec.sections.flatMap<LessonBlock>((section) => [
            { type: "heading", id: section.id, text: section.title, level: 2 },
            { type: "paragraph", text: section.body },
            ...(section.code ? [{ type: "code", language: "sql", code: section.code } satisfies LessonBlock] : []),
        ]),
        ...(spec.warning
            ? [{ type: "callout", tone: "warning", title: "Engineering caution", body: spec.warning } satisfies LessonBlock]
            : []),
        { type: "heading", id: "assignment", text: "Assignment", level: 2 },
        { type: "list", ordered: true, items: spec.assignment },
        { type: "resources", title: "Required and supporting reading", resources: spec.resources },
    ];

    return {
        id: `relational-data-and-postgresql-${spec.id}`,
        title: spec.title,
        activities: [
            {
                id: `relational-data-and-postgresql-${spec.id}-reading`,
                title: `${spec.title}: Concepts and Mental Model`,
                estimatedMinutes: 25,
                content: { type: "reading", body: spec.introduction, blocks },
            },
            {
                id: `relational-data-and-postgresql-${spec.id}-practice`,
                title: `${spec.title}: Engineering Practice`,
                estimatedMinutes: 35,
                content: {
                    type: "practical",
                    objective: spec.practiceObjective,
                    scenario: "Use the evolving Steward service-registry data model. Preserve useful SQL, schema notes and evidence so later Builder modules can build on the same system.",
                    instructions: spec.practiceInstructions,
                    deliverables: ["Working SQL or schema change", "Observed output", "Short engineering note explaining the result and trade-offs"],
                    completionCriteria: ["The result is demonstrated against realistic Steward data.", "At least one failure, edge case or alternative is examined.", "The learner can explain what PostgreSQL is doing rather than only copy syntax."],
                },
            },
            {
                id: `relational-data-and-postgresql-${spec.id}-check`,
                title: `${spec.title}: Knowledge Check`,
                estimatedMinutes: 10,
                content: { type: "reflection", prompt: spec.knowledgeCheck },
            },
        ],
    };
}

const specs: DataLessonSpec[] = [
    {
        id: "relational-model",
        title: "The Relational Model",
        introduction: "A relational database is not a spreadsheet with an API. It represents facts as relations and uses keys, constraints and relational operations to preserve meaning while data changes. Steward needs this discipline because ownership, environments and dependencies are relationships, not nested blobs that happen to look convenient in one response.",
        outcomes: ["Explain rows, columns, relations and keys without relying on ORM terminology.", "Distinguish identity from attributes.", "Model many-to-one and many-to-many facts explicitly.", "Recognize when duplicated facts create inconsistency risk."],
        sections: [
            { id: "facts-as-relations", title: "Model facts as relations", body: "Treat each table as a set of facts of one kind. A service fact should not duplicate the owning team's name everywhere; it should reference the team identity. This gives the database one authoritative place for each fact." },
            { id: "steward-shape", title: "A first Steward relational shape", body: "Teams own services; services run in environments; services depend on other services. These are separate relations because they have different cardinalities, lifecycles and constraints.", code: "CREATE TABLE team (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE\n);\n\nCREATE TABLE service (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL,\n  owning_team_id bigint NOT NULL REFERENCES team(id)\n);" },
        ],
        warning: "Do not choose table boundaries by mirroring JSON payloads. API representation and relational storage solve different problems.",
        assignment: ["Sketch the Steward entities and relationships without Django model syntax.", "Mark primary keys, foreign keys and cardinalities.", "Identify one fact that would become inconsistent if duplicated."],
        resources: [postgresDocs],
        practiceObjective: "Create a minimal relational model for Team, Service, Environment and ServiceDependency.",
        practiceInstructions: ["Draw the relations and cardinalities first.", "Create the tables in PostgreSQL.", "Insert a small dataset with two teams and three services.", "Demonstrate one relationship query and explain why the model avoids duplicated ownership facts."],
        knowledgeCheck: "1. Why is a foreign key more than a convenient integer column?\n2. What is the difference between entity identity and an attribute such as service name?\n3. Why should service dependencies be represented as a relation rather than a comma-separated column?",
    },
    {
        id: "sql-crud",
        title: "SQL SELECT, INSERT, UPDATE and DELETE",
        introduction: "SQL is the language used to ask the database for facts and to change those facts deliberately. Builder-level competence means understanding the set-based effect of each statement, not just knowing four verbs.",
        outcomes: ["Read and write basic data manipulation statements.", "Predict the affected row set before mutation.", "Use RETURNING to inspect mutations.", "Avoid accidental full-table updates and deletes."],
        sections: [
            { id: "read-and-write", title: "Read and write sets", body: "SELECT describes the rows and columns you want returned. INSERT introduces facts. UPDATE transforms matching facts. DELETE removes matching facts. UPDATE and DELETE become dangerous when the matching set is not understood.", code: "INSERT INTO service (name, owning_team_id)\nVALUES ('Payments API', 1)\nRETURNING id, name;\n\nUPDATE service\nSET name = 'Payments Service'\nWHERE id = 1\nRETURNING id, name;" },
            { id: "mutation-discipline", title: "Mutation discipline", body: "Before a destructive statement, run the same predicate as a SELECT. In production engineering, knowing the target set is part of the change, not optional caution." },
        ],
        warning: "UPDATE service SET lifecycle = 'retired'; is valid SQL and may be catastrophic. Syntax correctness says nothing about business intent.",
        assignment: ["Insert Steward teams and services using explicit column lists.", "Update one service using a selective predicate and RETURNING.", "Delete only disposable test data after proving the target set with SELECT."],
        resources: [postgresDocs],
        practiceObjective: "Manipulate Steward data while proving exactly which rows each mutation affects.",
        practiceInstructions: ["Create at least five rows.", "Write a SELECT matching the rows you intend to change.", "Run UPDATE with RETURNING.", "Create and safely delete one disposable row.", "Record the before/after evidence."],
        knowledgeCheck: "1. Why should a mutation predicate be inspected as a SELECT first?\n2. What does RETURNING give you?\n3. Why is an INSERT column list preferable to relying on table column order?",
    },
    {
        id: "filtering-ordering",
        title: "Filtering and Ordering Queries",
        introduction: "Useful registry questions depend on precise predicates and deterministic ordering. WHERE decides which facts qualify; ORDER BY decides how the result is presented. Mixing those concerns leads to subtle bugs and unstable pagination.",
        outcomes: ["Compose predicates with comparison, IN, NULL and boolean logic.", "Reason about SQL three-valued logic.", "Use deterministic multi-column ordering.", "Recognize unsafe assumptions around NULL."],
        sections: [
            { id: "predicates", title: "Predicates define the candidate set", body: "AND narrows, OR broadens, and parentheses make intent explicit. NULL is not equal to anything, including NULL, so use IS NULL and IS NOT NULL.", code: "SELECT id, name, criticality\nFROM service\nWHERE lifecycle = 'active'\n  AND criticality IN ('high', 'critical')\nORDER BY criticality DESC, name ASC, id ASC;" },
            { id: "determinism", title: "Ordering must be deterministic", body: "When multiple rows share the same primary sort value, add a stable tie-breaker such as id. This becomes essential when pagination is introduced." },
        ],
        assignment: ["Query active high/critical Steward services.", "Write one predicate involving NULL.", "Add a stable tie-breaker to each ordered query."],
        resources: [postgresDocs],
        practiceObjective: "Build a small catalogue of precise Steward filters and explain their truth conditions.",
        practiceInstructions: ["Seed rows containing varied lifecycle, criticality and nullable fields.", "Write at least five WHERE clauses.", "Include AND/OR grouping and NULL handling.", "Demonstrate deterministic ordering when values tie."],
        knowledgeCheck: "1. Why does column = NULL not do what many beginners expect?\n2. What does a tie-breaker solve in ORDER BY?\n3. When can OR unintentionally broaden a result set?",
    },
    {
        id: "aggregation",
        title: "Aggregation, GROUP BY and HAVING",
        introduction: "Steward must answer questions about groups of facts: services per team, dependency counts, critical services per lifecycle and environments per service. Aggregation turns row-level data into system-level evidence.",
        outcomes: ["Use COUNT, MIN, MAX and aggregate expressions.", "Group rows at the correct grain.", "Distinguish WHERE from HAVING.", "Detect misleading counts caused by joins."],
        sections: [
            { id: "grain", title: "Choose the grouping grain", body: "GROUP BY defines one output row per group. Ask what one result row means before writing the query. If one row should mean one team, group by team identity, not every service attribute.", code: "SELECT t.id, t.name, COUNT(s.id) AS service_count\nFROM team t\nLEFT JOIN service s ON s.owning_team_id = t.id\nGROUP BY t.id, t.name\nHAVING COUNT(s.id) >= 2\nORDER BY service_count DESC;" },
            { id: "where-having", title: "WHERE before grouping, HAVING after grouping", body: "WHERE removes source rows before aggregation. HAVING removes groups after aggregates have been computed. They answer different questions." },
        ],
        warning: "Joining multiple one-to-many relations before COUNT can multiply rows and inflate totals. Inspect the row shape before trusting aggregates.",
        assignment: ["Count services by owning team.", "Find teams with at least two active services.", "Explain whether filtering lifecycle belongs in WHERE or HAVING for your query."],
        resources: [postgresDocs],
        practiceObjective: "Produce trustworthy registry metrics using grouping and aggregation.",
        practiceInstructions: ["Create data for teams with zero, one and multiple services.", "Use LEFT JOIN so zero-service teams remain observable.", "Add HAVING for a group-level threshold.", "Verify the count manually against source rows."],
        knowledgeCheck: "1. What does grouping grain mean?\n2. Why can JOINs inflate COUNT?\n3. Give one condition that belongs in WHERE and one that belongs in HAVING.",
    },
    {
        id: "joins",
        title: "INNER, LEFT and RIGHT JOINs",
        introduction: "JOINs are where the relational model becomes useful. They reconstruct connected facts without duplicating them. Choosing join semantics is an engineering decision about which missing relationships should remain visible.",
        outcomes: ["Explain INNER and outer join result sets.", "Choose join direction based on the question.", "Detect accidental row multiplication.", "Query self-referential service dependencies."],
        sections: [
            { id: "join-semantics", title: "Join semantics express inclusion", body: "INNER JOIN keeps only matched pairs. LEFT JOIN keeps every left-side row even when no right-side row exists. That distinction lets Steward expose data-quality gaps such as services without environments.", code: "SELECT s.name, e.name AS environment\nFROM service s\nLEFT JOIN environment e ON e.service_id = s.id\nORDER BY s.name, e.name;" },
            { id: "self-reference", title: "Dependencies join Service twice", body: "A ServiceDependency relation references a source service and a target service. Aliases let one table play two roles in the same query.", code: "SELECT src.name AS service, dst.name AS depends_on\nFROM service_dependency d\nJOIN service src ON src.id = d.source_service_id\nJOIN service dst ON dst.id = d.target_service_id;" },
        ],
        assignment: ["List every service and its owning team.", "List every service even when no environment exists.", "List dependency edges with human-readable source and target names."],
        resources: [postgresDocs],
        practiceObjective: "Answer non-trivial Steward questions with deliberate join semantics.",
        practiceInstructions: ["Seed at least one service without an environment.", "Compare INNER JOIN and LEFT JOIN outputs.", "Write the self-join dependency query.", "Explain one case where a RIGHT JOIN can be rewritten more readably as LEFT JOIN by swapping table order."],
        knowledgeCheck: "1. Why would INNER JOIN hide a service with missing environment data?\n2. What causes row multiplication?\n3. Why do dependency queries need aliases?",
    },
    {
        id: "subqueries",
        title: "Subqueries",
        introduction: "A subquery lets one query depend on the result of another. It is useful when the mental model is naturally staged: first identify a set or value, then use it to answer the outer question.",
        outcomes: ["Use scalar, IN and EXISTS subqueries.", "Recognize correlated subqueries.", "Choose EXISTS when testing existence.", "Compare a subquery with an equivalent join."],
        sections: [
            { id: "exists", title: "EXISTS expresses a yes/no relationship", body: "When the question is whether at least one related row exists, EXISTS often states the intent directly and avoids accidental duplication.", code: "SELECT s.id, s.name\nFROM service s\nWHERE EXISTS (\n  SELECT 1\n  FROM environment e\n  WHERE e.service_id = s.id\n    AND e.kind = 'production'\n);" },
            { id: "correlation", title: "Correlated subqueries depend on the outer row", body: "The inner query can reference the current outer service. Think carefully about execution and readability; PostgreSQL may transform plans, but you still need to understand the logical relationship." },
        ],
        assignment: ["Find services with at least one production environment using EXISTS.", "Find services owned by teams whose names match a subquery result.", "Rewrite one subquery as a JOIN and compare readability."],
        resources: [postgresDocs],
        practiceObjective: "Use subqueries where they clarify staged or existence-based reasoning.",
        practiceInstructions: ["Write an EXISTS query.", "Write an IN subquery.", "Produce an equivalent JOIN for one of them.", "Run EXPLAIN and record whether the physical plans differ meaningfully on your dataset."],
        knowledgeCheck: "1. When does EXISTS communicate intent better than JOIN?\n2. What makes a subquery correlated?\n3. Why should logical SQL structure and physical execution plan be considered separately?",
    },
    {
        id: "ctes",
        title: "Common Table Expressions",
        introduction: "Common Table Expressions name intermediate query results. Their main Builder value is not cleverness; it is making a multi-stage data question inspectable and reviewable.",
        outcomes: ["Use WITH to name intermediate result sets.", "Break complex queries into meaningful stages.", "Use recursive CTEs conceptually for graph traversal.", "Avoid using CTEs merely to make simple queries longer."],
        sections: [
            { id: "staged-query", title: "Name the stages of a question", body: "A CTE can first identify critical services, then count their dependencies. Each stage should have a clear meaning that can be queried independently while debugging.", code: "WITH critical_services AS (\n  SELECT id, name\n  FROM service\n  WHERE criticality = 'critical'\n)\nSELECT cs.name, COUNT(d.id) AS dependency_count\nFROM critical_services cs\nLEFT JOIN service_dependency d ON d.source_service_id = cs.id\nGROUP BY cs.id, cs.name;" },
            { id: "recursive", title: "Recursive CTEs and dependency graphs", body: "Recursive CTEs can walk dependency chains, but cycles must be considered. TSA will revisit graph and architecture analysis later; here the goal is to recognize the tool and its risks." },
        ],
        assignment: ["Refactor one multi-stage Steward query using WITH.", "Run the CTE body by itself to verify the intermediate set.", "Describe how a dependency cycle could affect a recursive traversal."],
        resources: [postgresDocs],
        practiceObjective: "Make a complex Steward query easier to inspect using named stages.",
        practiceInstructions: ["Choose a query with filtering plus aggregation or dependency traversal.", "Create at least two logical stages.", "Validate each stage independently.", "Compare the final result with an equivalent non-CTE query."],
        knowledgeCheck: "1. What problem does a CTE solve for human readers?\n2. Why can recursive graph queries require cycle protection?\n3. When is a CTE unnecessary?",
    },
    {
        id: "transactions-acid",
        title: "Transactions and ACID",
        introduction: "A transaction defines one unit of database change. Steward will often need multiple writes to succeed or fail together—for example creating a service and its required initial production environment. Transactions protect invariants across those steps.",
        outcomes: ["Explain atomicity, consistency, isolation and durability operationally.", "Group related writes in a transaction.", "Use rollback intentionally.", "Distinguish application validation from transactional guarantees."],
        sections: [
            { id: "atomic-change", title: "One business change, one transaction", body: "Atomicity means observers should not see half of a logically indivisible change. If a required second write fails, the first should not remain committed.", code: "BEGIN;\n\nINSERT INTO service (name, owning_team_id)\nVALUES ('Ledger API', 1)\nRETURNING id;\n\n-- insert required related data here\n\nCOMMIT;" },
            { id: "acid", title: "ACID is behavior, not marketing", body: "Consistency depends on the invariants you actually encode. Isolation controls interaction between concurrent transactions. Durability concerns committed changes surviving failures. Learn each property through observable behavior." },
        ],
        warning: "Wrapping invalid business logic in a transaction does not make it correct. Transactions preserve the database guarantees you have actually defined.",
        assignment: ["Identify one Steward operation requiring multiple writes.", "Run it in a transaction and force the second step to fail.", "Verify rollback leaves no partial state."],
        resources: [postgresDocs],
        practiceObjective: "Prove atomic behavior for a multi-step Steward data change.",
        practiceInstructions: ["Begin a transaction.", "Perform two related writes.", "Force one failure and ROLLBACK.", "Repeat with valid data and COMMIT.", "Query afterward to prove the difference."],
        knowledgeCheck: "1. What does atomicity prevent?\n2. Why does consistency depend on constraints and rules?\n3. What is the difference between ROLLBACK and compensating later with another write?",
    },
    {
        id: "constraints-keys",
        title: "Constraints, Keys and Relationships",
        introduction: "Constraints turn assumptions into executable rules. If Steward says a service slug is unique or a dependency cannot reference missing services, the database should protect those facts where possible.",
        outcomes: ["Use PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL and CHECK.", "Choose constraints based on invariants.", "Understand referential actions.", "Avoid relying only on application validation for durable rules."],
        sections: [
            { id: "invariants", title: "Encode invariants close to the data", body: "Application checks can race or be bypassed by another writer. Database constraints provide a final shared line of defense for all clients.", code: "CREATE TABLE service (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  slug text NOT NULL UNIQUE,\n  criticality text NOT NULL CHECK (criticality IN ('low','medium','high','critical')),\n  owning_team_id bigint NOT NULL REFERENCES team(id)\n);" },
            { id: "dependency-uniqueness", title: "Relationship constraints matter too", body: "A dependency table can forbid duplicates with a composite UNIQUE constraint. Self-dependency can be blocked with a CHECK constraint." , code: "ALTER TABLE service_dependency\nADD CONSTRAINT uq_service_dependency UNIQUE (source_service_id, target_service_id),\nADD CONSTRAINT no_self_dependency CHECK (source_service_id <> target_service_id);" },
        ],
        assignment: ["List Steward invariants that belong in the database.", "Implement at least one CHECK and one composite UNIQUE constraint.", "Attempt invalid writes and capture the failures."],
        resources: [postgresDocs],
        practiceObjective: "Move important Steward assumptions into enforceable PostgreSQL constraints.",
        practiceInstructions: ["Add unique service slug enforcement.", "Add allowed criticality values.", "Protect service dependencies from duplicates and self-reference.", "Attempt each invalid case and record the database response."],
        knowledgeCheck: "1. Why can an application-only uniqueness check race?\n2. What is a composite unique constraint?\n3. Which kinds of rules are difficult to express as simple database constraints?",
    },
    {
        id: "schema-design",
        title: "Schema Design",
        introduction: "Schema design translates domain meaning into tables, columns, relationships and constraints that can survive changing queries and application code. Good schema design begins with facts and invariants, not framework convenience.",
        outcomes: ["Derive tables from domain facts.", "Choose data types intentionally.", "Model cardinality explicitly.", "Separate durable domain data from presentation concerns."],
        sections: [
            { id: "design-sequence", title: "A useful design sequence", body: "Start with the questions the system must answer, identify facts and identities, define relationships and cardinalities, encode invariants, then test the model using representative queries and changes." },
            { id: "service-review", title: "Model reviews as facts with their own lifecycle", body: "A ServiceReview should not be a handful of columns repeatedly overwritten on Service if historical reviews matter. A separate relation can preserve review time, reviewer and result." },
        ],
        assignment: ["Write five questions Steward must answer.", "Map each question to relations and keys.", "Review whether every stored field represents a durable fact rather than UI convenience."],
        resources: [postgresDocs],
        practiceObjective: "Produce and defend a coherent PostgreSQL schema for the full Builder-level Steward domain.",
        practiceInstructions: ["Include Team, Membership, Service, Environment, ServiceDependency and ServiceReview.", "Annotate cardinalities and delete/update implications.", "Add key constraints.", "Test the design against at least five registry questions and two change scenarios."],
        knowledgeCheck: "1. Why should queries influence schema review without dictating every table shape?\n2. When does a concept deserve its own table?\n3. Why are data types part of domain modeling?",
    },
    {
        id: "normalization",
        title: "Normalization and Denormalization Trade-offs",
        introduction: "Normalization reduces duplicated facts and update anomalies. Denormalization intentionally duplicates or precomputes data to serve a proven need. The engineering skill is knowing which problem you are solving and which consistency cost you are accepting.",
        outcomes: ["Explain update, insertion and deletion anomalies.", "Recognize basic normalization problems.", "Distinguish derived data from authoritative facts.", "Justify denormalization with evidence."],
        sections: [
            { id: "anomalies", title: "Duplicated facts create anomalies", body: "If every Service row stores owning_team_name, renaming a team requires many coordinated updates. A missed row creates two competing truths. A foreign key to Team avoids that anomaly." },
            { id: "denormalization", title: "Denormalize deliberately", body: "A cached dependency_count may improve a proven hot path, but then you own synchronization and stale-data behavior. Measure first; do not preemptively copy facts everywhere." },
        ],
        warning: "Do not use 'performance' as a generic reason to denormalize before measuring a real query and considering indexes or better access patterns.",
        assignment: ["Find one duplicated fact in a deliberately bad Steward schema.", "Describe its update anomaly.", "Propose one hypothetical denormalization and document the consistency mechanism it would require."],
        resources: [postgresDocs],
        practiceObjective: "Normalize a flawed Steward schema and evaluate one evidence-based denormalization scenario.",
        practiceInstructions: ["Create or inspect a schema with duplicated ownership/environment facts.", "Refactor it into authoritative relations.", "Demonstrate how one update becomes safer.", "Write a short decision note for or against one denormalized field."],
        knowledgeCheck: "1. What is an update anomaly?\n2. Why is denormalization not automatically bad?\n3. What evidence should exist before adding duplicated derived data?",
    },
    {
        id: "indexes",
        title: "Indexes",
        introduction: "Indexes are additional data structures that trade storage and write cost for faster access paths. Adding one is an optimization decision tied to real predicates, joins and ordering patterns—not a badge of database sophistication.",
        outcomes: ["Explain the purpose and cost of an index.", "Choose index columns from access patterns.", "Understand composite index ordering at a practical level.", "Use EXPLAIN to verify whether an index participates."],
        sections: [
            { id: "access-path", title: "Indexes create alternative access paths", body: "A sequential scan reads table pages broadly. An index may let PostgreSQL locate a small subset efficiently. For small tables a sequential scan can still be cheaper, so 'index exists' does not imply 'index should be used'.", code: "CREATE INDEX idx_service_lifecycle_criticality\nON service (lifecycle, criticality);\n\nEXPLAIN ANALYZE\nSELECT id, name\nFROM service\nWHERE lifecycle = 'active'\n  AND criticality = 'critical';" },
            { id: "write-cost", title: "Every index has a write cost", body: "INSERT, UPDATE and DELETE may also maintain indexes. Unused indexes consume space and increase write work, so treat them as production assets that require justification." },
        ],
        assignment: ["Identify a Steward query worth indexing.", "Create an index based on its predicate or join.", "Compare plans before and after and explain what changed—or why nothing changed."],
        resources: [postgresDocs],
        practiceObjective: "Use evidence to add one useful Steward index instead of indexing by intuition.",
        practiceInstructions: ["Capture EXPLAIN ANALYZE before the index.", "Create a candidate index.", "Capture the new plan.", "Compare cost, timing and chosen scan type.", "Document the write/storage trade-off."],
        knowledgeCheck: "1. Why might PostgreSQL ignore an available index?\n2. What cost does an index add to writes?\n3. Why does composite column order matter?",
    },
    {
        id: "query-plans",
        title: "Query Plans and EXPLAIN",
        introduction: "EXPLAIN turns performance reasoning from guesswork into evidence. PostgreSQL chooses physical operators—scans, joins, sorts and aggregates—based on estimated cost and statistics. Builder engineers should be able to read the broad story of a plan.",
        outcomes: ["Run EXPLAIN and EXPLAIN ANALYZE safely.", "Identify scan, join, sort and aggregate nodes.", "Compare estimates with actual rows.", "Use plans to form performance hypotheses."],
        sections: [
            { id: "logical-physical", title: "SQL says what; the plan says how", body: "The same logical query can be executed using different physical strategies. A plan tree shows the chosen strategy and estimated work.", code: "EXPLAIN (ANALYZE, BUFFERS)\nSELECT t.name, COUNT(s.id)\nFROM team t\nLEFT JOIN service s ON s.owning_team_id = t.id\nGROUP BY t.id, t.name;" },
            { id: "estimates", title: "Estimated rows versus actual rows", body: "Large estimation errors can point to stale statistics, skew or correlated predicates. Do not jump straight to adding indexes; first understand where the planner's picture differs from reality." },
        ],
        warning: "EXPLAIN ANALYZE executes the query. On mutating statements, wrap carefully in a transaction and roll back, or avoid ANALYZE entirely.",
        assignment: ["Explain a join+aggregate Steward query.", "Identify the major nodes.", "Compare estimated and actual row counts.", "Write one performance hypothesis supported by the plan."],
        resources: [postgresDocs],
        practiceObjective: "Read and explain the execution plan of a meaningful Steward query.",
        practiceInstructions: ["Choose a query with at least one join.", "Run EXPLAIN ANALYZE BUFFERS.", "Annotate scan, join and aggregate nodes.", "Record the largest estimate/actual mismatch.", "Propose one evidence-based next investigation."],
        knowledgeCheck: "1. What is the difference between EXPLAIN and EXPLAIN ANALYZE?\n2. Why are row-estimate errors interesting?\n3. Why should a slow query not automatically lead to an index?",
    },
    {
        id: "query-performance",
        title: "Query Performance",
        introduction: "Performance work is an investigation: define the symptom, reproduce it, measure the plan and data shape, change one relevant factor, then compare. SQL style alone rarely explains performance.",
        outcomes: ["Define a measurable query-performance problem.", "Distinguish latency, throughput and resource use.", "Investigate data volume and selectivity.", "Avoid premature micro-optimization."],
        sections: [
            { id: "performance-loop", title: "Use an evidence loop", body: "Start from an observable requirement such as 'service search p95 exceeds 300 ms on representative data'. Capture query, parameters, plan and row counts before changing code." },
            { id: "levers", title: "Common performance levers", body: "Better predicates, indexes, reduced row width, fewer round trips, better joins, pagination and avoiding N+1 patterns are common levers. The right lever depends on evidence." },
        ],
        assignment: ["Define one measurable Steward query symptom.", "Capture baseline timing and plan.", "Change one factor and compare.", "Record whether the evidence supports keeping the change."],
        resources: [postgresDocs],
        practiceObjective: "Run a small controlled query-performance investigation.",
        practiceInstructions: ["Generate enough representative data to make the query non-trivial.", "Capture baseline EXPLAIN ANALYZE.", "Apply one change such as an index or query rewrite.", "Re-measure under the same conditions.", "Write a conclusion with limitations."],
        knowledgeCheck: "1. Why must performance goals be measurable?\n2. What makes a before/after comparison credible?\n3. Name three performance levers other than adding an index.",
    },
    {
        id: "postgresql-practice",
        title: "PostgreSQL in Practice",
        introduction: "Using PostgreSQL professionally includes more than SQL syntax. Connections, roles, schemas, backups, extensions and operational visibility shape whether an application can be run safely. Builder introduces these concepts before later platform and reliability schools go deeper.",
        outcomes: ["Navigate psql and inspect database objects.", "Explain databases, schemas and roles.", "Use least-privilege application credentials conceptually.", "Recognize basic operational commands and metadata."],
        sections: [
            { id: "psql", title: "Interrogate the database directly", body: "Use psql to inspect tables, constraints, indexes and active connections. Direct database literacy helps separate application bugs from data or schema facts." },
            { id: "roles", title: "Application roles should be deliberate", body: "The application should not normally connect as a PostgreSQL superuser. Database privileges are another boundary that limits blast radius." },
        ],
        assignment: ["Connect to the Steward database with psql.", "Inspect tables, indexes and constraints.", "Describe the privileges the application role actually needs."],
        resources: [postgresDocs],
        practiceObjective: "Operate a local Steward PostgreSQL database without depending entirely on Django tooling.",
        practiceInstructions: ["Connect with psql.", "List relations and describe the service table.", "Inspect indexes and constraints using PostgreSQL metadata or psql commands.", "Create or document a non-superuser application role approach."],
        knowledgeCheck: "1. Why is direct psql literacy useful even when using an ORM?\n2. Why should an app avoid superuser credentials?\n3. What is the distinction between a PostgreSQL database and schema?",
    },
    {
        id: "django-orm",
        title: "Django ORM",
        introduction: "The Django ORM maps Python expressions to SQL and relational operations. It is productive when you understand the SQL shape it produces. The goal is not to avoid SQL; it is to use a higher-level interface without losing database reasoning.",
        outcomes: ["Translate basic QuerySets into expected SQL operations.", "Use select_related and prefetch_related deliberately.", "Inspect generated SQL.", "Avoid treating QuerySets as ordinary in-memory lists."],
        sections: [
            { id: "lazy", title: "QuerySets are lazy query descriptions", body: "Building a QuerySet usually does not hit the database until evaluation. Chaining methods modifies the query description. Know when iteration, len, serialization or conversion causes execution." },
            { id: "inspect-sql", title: "Inspect what the ORM asks PostgreSQL to do", body: "Django exposes QuerySet.query and database logging. Use them while learning so model-level convenience remains connected to SQL reality.", code: "# conceptual Django shell example\nqs = Service.objects.filter(lifecycle='active').select_related('owning_team')\nprint(qs.query)" },
        ],
        assignment: ["Write QuerySets for three Steward questions.", "Inspect the generated SQL.", "Explain where joins and predicates appear."],
        resources: [djangoQueryDocs, postgresDocs],
        practiceObjective: "Implement Steward queries in the Django ORM while proving their SQL shape.",
        practiceInstructions: ["Write one filtered query.", "Write one relationship query with select_related.", "Write one aggregate/annotate query.", "Inspect SQL for all three and compare with hand-written equivalents."],
        knowledgeCheck: "1. What does QuerySet laziness mean?\n2. Why should generated SQL be inspectable?\n3. When is select_related appropriate?",
    },
    {
        id: "orm-vs-sql",
        title: "ORM versus SQL",
        introduction: "ORM and SQL are not opposing philosophies. They are interfaces with different strengths. A mature engineer chooses the simplest interface that preserves clarity, correctness and maintainability for the problem at hand.",
        outcomes: ["Compare ORM and SQL trade-offs.", "Recognize when raw SQL improves clarity or capability.", "Avoid escaping to SQL just because an ORM query is unfamiliar.", "Preserve parameterization when using raw SQL."],
        sections: [
            { id: "choose-interface", title: "Choose based on the problem", body: "Routine model queries often belong in the ORM. Complex reporting, database-specific features or carefully tuned queries may be clearer in SQL. Team familiarity and testability matter too." },
            { id: "safety", title: "Raw SQL must remain parameterized", body: "Moving from ORM to SQL does not justify string interpolation with untrusted values. Use database parameter binding." },
        ],
        assignment: ["Implement one Steward query in ORM and SQL.", "Compare readability, generated plan and coupling.", "Write a decision note for which version you would keep."],
        resources: [djangoQueryDocs, postgresDocs],
        practiceObjective: "Make an evidence-based ORM-versus-SQL choice for a non-trivial Steward query.",
        practiceInstructions: ["Choose a join/aggregate registry question.", "Implement it in Django ORM.", "Implement equivalent parameterized SQL.", "Compare SQL plans and maintenance cost.", "Select one and justify the decision."],
        knowledgeCheck: "1. Give a case where raw SQL can be preferable.\n2. Why should unfamiliar ORM syntax not automatically trigger raw SQL?\n3. What safety rule applies to user-controlled values in raw SQL?",
    },
    {
        id: "n-plus-one",
        title: "The N+1 Query Problem",
        introduction: "N+1 occurs when loading a collection causes one initial query plus one or more additional queries per row for related data. It is easy to create through serializers and property access, and it often looks harmless on tiny development datasets.",
        outcomes: ["Recognize N+1 behavior from query logs.", "Use select_related for single-valued relationships.", "Use prefetch_related for multi-valued relationships.", "Measure query count before and after."],
        sections: [
            { id: "shape", title: "N+1 is a round-trip pattern", body: "If listing 100 services triggers 101 queries because owning_team is fetched separately for every service, latency grows with result size even if each query is fast." },
            { id: "fix", title: "Fetch relationships intentionally", body: "select_related uses SQL joins for foreign-key/one-to-one data. prefetch_related performs additional bounded queries and assembles multi-valued relationships in Python." },
        ],
        assignment: ["Create an N+1 service listing intentionally.", "Capture query count.", "Fix it using the correct relationship-loading strategy and compare."],
        resources: [djangoQueryDocs],
        practiceObjective: "Detect and eliminate an N+1 query in a Steward API-style access pattern.",
        practiceInstructions: ["Load multiple services and touch owning_team for each.", "Capture database query count/logs.", "Apply select_related.", "Repeat for a multi-valued relation using prefetch_related.", "Record before/after query counts."],
        knowledgeCheck: "1. Why does N+1 often escape notice in development?\n2. select_related versus prefetch_related: what is the practical distinction?\n3. Why is query count evidence stronger than assuming the optimization worked?",
    },
    {
        id: "migrations",
        title: "Database Migrations",
        introduction: "A migration is a versioned change to durable data structure. It must work not only on an empty developer database but on existing data, under deployment constraints, and in a sequence other engineers can reproduce.",
        outcomes: ["Explain schema versus data migrations.", "Review generated Django migrations instead of trusting them blindly.", "Plan backward-compatible multi-step changes.", "Recognize risky table rewrites and data assumptions."],
        sections: [
            { id: "versioned-schema", title: "Schema changes are production changes", body: "Adding a non-null column to a populated table, changing a type or adding a uniqueness constraint can fail or lock data. The safe path may require multiple deployable steps." },
            { id: "expand-contract", title: "Expand before contract", body: "For compatibility-sensitive changes, add the new structure first, migrate writers/readers and data, then remove the old structure later. This reduces tight coupling between deployment timing and schema state." },
        ],
        warning: "Never assume a migration is safe because makemigrations generated it successfully. Generated code still requires engineering review.",
        assignment: ["Design a migration that adds a required Steward field to existing services.", "Split it into safe steps if necessary.", "Describe rollback and compatibility considerations."],
        resources: [djangoMigrationDocs, postgresDocs],
        practiceObjective: "Execute and review a non-trivial Steward schema evolution with existing data.",
        practiceInstructions: ["Seed existing services.", "Add a new field that ultimately must be non-null.", "Plan and implement the migration in safe stages.", "Verify existing data remains valid.", "Document the forward and rollback story."],
        knowledgeCheck: "1. Why can a generated migration still be unsafe?\n2. What is the expand-contract pattern?\n3. Why are existing rows part of migration design?",
    },
    {
        id: "concurrency",
        title: "Concurrency Fundamentals",
        introduction: "Correct code can fail when two correct requests run at the same time. Concurrency exposes races around uniqueness, read-modify-write cycles and state transitions. PostgreSQL transactions, constraints and locks are tools for making those interactions explicit.",
        outcomes: ["Recognize race conditions in read-then-write logic.", "Explain isolation at a practical level.", "Use uniqueness constraints as concurrency-safe guards.", "Understand when row locking may be needed."],
        sections: [
            { id: "race", title: "Read-then-write can race", body: "Two requests can both check that a service slug is unused and then both attempt insertion. An application check alone cannot guarantee uniqueness; the database constraint arbitrates the concurrent writes." },
            { id: "locking", title: "Locks protect contested state", body: "SELECT ... FOR UPDATE can serialize changes to selected rows inside a transaction. Use it when the business operation truly requires coordination, not as a blanket fix for uncertainty.", code: "BEGIN;\nSELECT id, lifecycle\nFROM service\nWHERE id = 42\nFOR UPDATE;\n-- validate and perform coordinated state change\nCOMMIT;" },
        ],
        assignment: ["Describe a concurrent Steward operation that could race.", "Identify whether a constraint, transaction or row lock is the right protection.", "Explain the failure behavior of the losing transaction."],
        resources: [postgresDocs],
        practiceObjective: "Reproduce one race or contention scenario and apply a database-level protection.",
        practiceInstructions: ["Open two database sessions.", "Attempt a conflicting change such as duplicate slug creation or coordinated state update.", "Observe what happens without adequate protection.", "Apply a constraint or locking strategy.", "Repeat and document the new behavior."],
        knowledgeCheck: "1. Why can 'check then insert' fail under concurrency?\n2. What protection does a unique constraint provide that an app check does not?\n3. When might SELECT FOR UPDATE be appropriate?",
    },
    {
        id: "lab-persist-query",
        title: "Lab: Persist and Query Steward API Data",
        introduction: "This lab converts the Django Steward skeleton into a database-backed service registry whose schema and query behavior can be defended with evidence. The goal is not merely to make models migrate; it is to prove that the relational design supports the domain questions the product exists to answer.",
        outcomes: ["Implement the complete Builder-level relational model.", "Use constraints to protect domain invariants.", "Answer non-trivial registry questions in SQL and ORM.", "Use EXPLAIN to inspect important access paths.", "Demonstrate safe migration and concurrency reasoning."],
        sections: [
            { id: "required-domain", title: "Required relational domain", body: "Persist Team, Membership, Service, Environment, ServiceDependency and ServiceReview. Preserve ownership, lifecycle, criticality and dependency meaning. Use PostgreSQL-specific evidence rather than hiding every operation behind Django." },
            { id: "proof", title: "The deliverable is a working database plus evidence", body: "Your review packet should include schema constraints, representative SQL, equivalent ORM where useful, query-plan output, migration notes and at least one negative/concurrent case." },
        ],
        warning: "Do not optimize by intuition. Establish representative data, query behavior and plans before introducing performance-specific schema changes.",
        assignment: ["Implement the full Steward relational schema in Django/PostgreSQL.", "Enforce unique slugs, allowed lifecycle/criticality, valid relationships, no self-dependencies and no duplicate dependencies.", "Write SQL for services by team, high-criticality services, dependency counts, services missing production environments and recent reviews.", "Implement useful equivalents in Django ORM and inspect generated SQL.", "Use EXPLAIN ANALYZE on at least two important queries and justify one index.", "Demonstrate one safe migration on existing data and one concurrency-related invariant."],
        resources: [postgresDocs, djangoQueryDocs, djangoMigrationDocs],
        practiceObjective: "Produce the PostgreSQL-backed Steward data layer that later authentication and software-craft modules can safely build on.",
        practiceInstructions: ["Create representative data for multiple teams, memberships, services, environments, reviews and dependency edges.", "Prove all required constraints with positive and negative cases.", "Answer at least five non-trivial questions in direct SQL.", "Implement ORM equivalents where maintainable and inspect their SQL.", "Capture query-plan evidence and add only justified indexes.", "Perform one schema evolution against populated data.", "Submit a short data-engineering review explaining decisions, risks and remaining limitations."],
        knowledgeCheck: "Defend your lab as if another engineer were reviewing it: Which invariants are protected by PostgreSQL? Which remain in application code and why? Which query was most expensive? What evidence justified your indexing decision? What migration or concurrency risk remains most important?",
    },
];

export const relationalDataAndPostgresqlDeepLessons: Lesson[] = specs.map(lesson);
