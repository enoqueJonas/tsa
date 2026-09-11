import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { relationalDataAndPostgresqlDeepLessons } from "./builder-postgresql-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
    "relational-data-and-postgresql-relational-model-practice": {
        objective: "Turn a tempting document-shaped Steward design into a relational model whose facts, identities and relationships can survive change.",
        scenario: "A teammate proposes storing each Steward service as one large JSON object containing the owning team name, environments and a comma-separated dependency list because it looks like the API response. Review the proposal before it becomes the database design.",
        instructions: [
            "Write down the facts Steward must preserve independently: teams, services, environments and directed dependencies.",
            "Model those facts as relations with primary keys, foreign keys and cardinalities before writing SQL.",
            "Create the tables in PostgreSQL and seed two teams, three services, multiple environments and at least two dependency edges.",
            "Rename one team and show why normalized ownership changes in one authoritative place.",
            "Write one query that reconstructs a useful API-facing view from the normalized facts.",
            "Record one inconsistency that the original JSON/comma-separated design would make easy to create."
        ],
        deliverables: ["Relational diagram or schema sketch", "Working PostgreSQL schema and seed SQL", "Relationship query output", "Short modeling decision note"],
        completionCriteria: ["Each stored relation represents a clear kind of fact.", "Ownership and dependencies are modeled with keys rather than duplicated text.", "The learner can explain why storage structure does not need to mirror API JSON."],
    },
    "relational-data-and-postgresql-sql-crud-practice": {
        objective: "Perform data changes with a disciplined preview-mutate-verify workflow that makes accidental broad updates difficult.",
        scenario: "You have been asked to correct several Steward records directly in PostgreSQL after a bad import. The request is legitimate, but a careless UPDATE or DELETE could affect the entire registry.",
        instructions: [
            "Seed at least five service rows including one disposable test record.",
            "For every UPDATE or DELETE, first run the exact predicate as a SELECT and save the result.",
            "Use UPDATE ... RETURNING to change one precisely identified service.",
            "Delete only the disposable row after proving the target set.",
            "Intentionally write, but do not execute, one dangerous predicate-free mutation and annotate why PostgreSQL would accept it.",
            "Compare before/after row sets and record the evidence."
        ],
        deliverables: ["Preview SELECTs", "Safe mutation SQL using RETURNING", "Before/after evidence", "Mutation safety note"],
        completionCriteria: ["Every executed mutation has an evidenced target set.", "No destructive statement relies on table order or an implicit assumption.", "The learner can explain why syntactically valid SQL can still be operationally dangerous."],
    },
    "relational-data-and-postgresql-filtering-ordering-practice": {
        objective: "Build precise, deterministic Steward catalogue queries and expose the bugs caused by NULL and ambiguous boolean logic.",
        scenario: "The Engineering Portal needs filters for active critical services, services missing a technical owner, and stable ordered results for later pagination. A first implementation returns surprising rows when NULL and OR are involved.",
        instructions: [
            "Seed services with mixed lifecycle, criticality and nullable technical-owner values, including tied sort values.",
            "Write at least five predicates using AND, OR, IN, IS NULL and parentheses.",
            "Create one deliberately incorrect NULL comparison and capture the unexpected result.",
            "Create one ambiguous AND/OR predicate, then add parentheses to make the intended truth conditions explicit.",
            "Add deterministic ordering with an explicit tie-breaker and demonstrate stable output across repeated runs.",
            "Write the expected truth conditions for each query before comparing them with PostgreSQL output."
        ],
        deliverables: ["Query catalogue", "NULL failure evidence", "Boolean-precedence correction", "Deterministic ordering evidence"],
        completionCriteria: ["NULL is handled with SQL semantics rather than ordinary equality assumptions.", "Boolean grouping is explicit where intent could be misread.", "Every ordered result intended for pagination has a stable tie-breaker."],
    },
    "relational-data-and-postgresql-aggregation-practice": {
        objective: "Produce registry metrics that remain trustworthy when teams have zero services and joins can multiply rows.",
        scenario: "Leadership asks for services per team and high-criticality service counts. A dashboard query appears to overcount after environments are joined into the same report.",
        instructions: [
            "Seed teams with zero, one and multiple services, plus multiple environments for at least one service.",
            "Write a LEFT JOIN aggregation that keeps zero-service teams visible.",
            "Add a HAVING threshold for teams with at least two qualifying services.",
            "Join environments in a way that deliberately inflates COUNT and inspect the pre-aggregation row shape.",
            "Correct the metric using an appropriate query shape and verify it manually against source rows.",
            "Explain which filters belong in WHERE and which are genuinely group-level conditions for HAVING."
        ],
        deliverables: ["Correct aggregation queries", "Inflated-count reproduction", "Manual verification table", "Metric-grain explanation"],
        completionCriteria: ["The meaning of one output row is stated before grouping.", "Zero-service teams are handled deliberately rather than accidentally disappearing.", "The final counts are verified against source data and are not trusted merely because the SQL executed."],
    },
    "relational-data-and-postgresql-joins-practice": {
        objective: "Choose join semantics from the business question and use missing relationships as useful data-quality evidence.",
        scenario: "A Steward review report must show every service, including services missing an environment. An INNER JOIN implementation silently hides precisely the incomplete records the report is supposed to reveal.",
        instructions: [
            "Seed at least one service with no environment and one service with multiple environments.",
            "Run equivalent INNER JOIN and LEFT JOIN queries and compare which services disappear or multiply.",
            "Write the dependency query that joins Service twice through ServiceDependency using meaningful aliases.",
            "Trace one multiplied row back to its one-to-many relationship and explain why the result is correct rather than duplicate corruption.",
            "Rewrite one RIGHT JOIN question as a LEFT JOIN by reversing table order and compare readability.",
            "Choose the join semantics for the review report and justify the decision from the report's purpose."
        ],
        deliverables: ["INNER/LEFT comparison output", "Dependency self-join query", "Row-multiplication explanation", "Join-semantics decision note"],
        completionCriteria: ["Missing related data remains visible when the question requires it.", "Aliases make source and target service roles unambiguous.", "The learner can distinguish legitimate one-to-many multiplication from an erroneous join."],
    },
    "relational-data-and-postgresql-subqueries-practice": {
        objective: "Use EXISTS, IN and JOIN deliberately rather than treating subqueries as a stylistic trick.",
        scenario: "You need to find services that have at least one production environment. Three engineers propose EXISTS, IN and JOIN solutions and claim theirs is always faster.",
        instructions: [
            "Implement the production-environment question with EXISTS.",
            "Implement a logically equivalent solution using JOIN and, where sensible, IN.",
            "Compare result correctness first, including duplicate behavior.",
            "Run EXPLAIN on the alternatives using the same dataset and parameters.",
            "Identify whether PostgreSQL transforms them into similar physical plans or meaningfully different ones.",
            "Choose the version you would keep based on intent, correctness and evidence rather than folklore."
        ],
        deliverables: ["Equivalent query variants", "EXPLAIN evidence", "Duplicate-behavior check", "Query-shape decision note"],
        completionCriteria: ["EXISTS is understood as an existence test, not a magic performance keyword.", "Logical SQL structure is distinguished from PostgreSQL's chosen physical plan.", "The kept query is justified by readability and evidence."],
    },
    "relational-data-and-postgresql-ctes-practice": {
        objective: "Turn a difficult multi-stage registry question into inspectable query stages and reason about recursion safely.",
        scenario: "A dependency-risk query has become difficult to review because filtering, aggregation and dependency traversal are buried in one statement. The team needs a version that can be debugged stage by stage.",
        instructions: [
            "Choose a non-trivial Steward query involving filtering plus aggregation or dependency traversal.",
            "Break it into named CTE stages whose names describe business meaning rather than implementation detail.",
            "Run each stage independently and verify its intermediate row set.",
            "Produce an equivalent non-CTE query and compare readability and plan shape.",
            "Sketch a recursive dependency traversal and identify how a cycle could cause repeated traversal.",
            "Document the cycle-protection strategy you would require before using recursion on untrusted dependency data."
        ],
        deliverables: ["Staged CTE query", "Intermediate-stage evidence", "Equivalent non-CTE query", "Recursive-cycle safety note"],
        completionCriteria: ["Each CTE stage has a clear reason to exist.", "Intermediate results can be independently inspected.", "Recursive traversal is not proposed without explicit cycle handling."],
    },
    "relational-data-and-postgresql-transactions-acid-practice": {
        objective: "Prove atomic behavior for a multi-write Steward operation by observing both rollback and commit outcomes.",
        scenario: "Registering a production service requires the Service row and an initial production Environment. A failure after the first insert currently leaves an impossible half-created service.",
        instructions: [
            "Define the invariant the multi-write operation must preserve.",
            "Execute the two writes inside an explicit transaction and force the second write to fail.",
            "ROLLBACK and query the database to prove that no partial service remains.",
            "Repeat with valid data and COMMIT, then prove both facts are durable.",
            "Repeat the failing scenario without a transaction in disposable data to observe the partial-state risk.",
            "Map what you observed to atomicity and explain which consistency rules still depend on constraints or application logic."
        ],
        deliverables: ["Transactional SQL", "Rollback evidence", "Successful commit evidence", "ACID behavior explanation"],
        completionCriteria: ["The failed operation leaves no partial durable state when protected by the transaction.", "The learner distinguishes atomicity from business-rule correctness.", "The explanation is based on observed database state rather than definitions alone."],
    },
    "relational-data-and-postgresql-constraints-keys-practice": {
        objective: "Move durable Steward invariants from comments and application checks into PostgreSQL where the database can enforce them for every writer.",
        scenario: "A second import process will soon write to the same database as Django. Rules currently enforced only in serializer validation could be bypassed by the importer or race under concurrent requests.",
        instructions: [
            "List candidate invariants and classify which belong in PostgreSQL, application code, or both.",
            "Add UNIQUE protection for service slug and a CHECK for allowed criticality values.",
            "Protect ServiceDependency from self-reference and duplicate source-target pairs.",
            "Choose and justify referential actions for at least one foreign key rather than accepting defaults blindly.",
            "Attempt each invalid write directly in SQL and capture PostgreSQL's rejection.",
            "Identify one important Steward rule that cannot be represented safely as a simple row constraint and explain where it remains enforced."
        ],
        deliverables: ["Invariant classification", "Constraint DDL/migration", "Negative-case database errors", "Boundary note for application-only rule"],
        completionCriteria: ["Durable row/relationship invariants are protected independently of Django validation.", "Invalid writes are demonstrated directly against PostgreSQL.", "The learner can explain both the power and limits of database constraints."],
    },
    "relational-data-and-postgresql-schema-design-practice": {
        objective: "Design the complete Builder-level Steward schema from product questions and change scenarios, not from framework convenience.",
        scenario: "Steward is moving from prototype to a durable internal service registry. Before the team commits to migrations, you must defend whether the schema can answer today's questions and survive foreseeable changes.",
        instructions: [
            "Write at least five product questions the database must answer and two realistic change scenarios.",
            "Model Team, Membership, Service, Environment, ServiceDependency and ServiceReview with explicit identities and cardinalities.",
            "Choose data types and nullability intentionally and annotate why important fields have those choices.",
            "Specify keys, uniqueness, checks and referential actions that protect core meaning.",
            "Walk each product question through the schema and identify required joins or aggregations.",
            "Walk the two change scenarios through the design and identify any schema coupling or history-loss risk."
        ],
        deliverables: ["Defended schema diagram", "Question-to-schema trace", "Constraint/data-type rationale", "Change-scenario review"],
        completionCriteria: ["Every table represents durable domain facts rather than UI layout.", "The schema can answer the required registry questions without storing contradictory copies of the same fact.", "Important type, nullability and referential-action choices have explicit reasoning."],
    },
    "relational-data-and-postgresql-normalization-practice": {
        objective: "Repair update anomalies first, then evaluate denormalization only when a measured access problem justifies its consistency cost.",
        scenario: "A prototype duplicated owning_team_name and dependency_count on each Service row to make reads easy. Team renames are already producing inconsistent records, while someone argues that all duplicated fields are necessary for performance.",
        instructions: [
            "Reproduce the ownership-name update anomaly in a deliberately flawed schema or sample table.",
            "Refactor ownership into an authoritative Team relation and prove a rename now has one source of truth.",
            "Identify which remaining values are authoritative facts and which are derived values.",
            "Choose one hypothetical derived field such as dependency_count and define the read benefit it might provide.",
            "Document how that value would be kept synchronized, what stale behavior would look like and how failures would be repaired.",
            "Decide whether to denormalize now; a justified 'no' is a valid result."
        ],
        deliverables: ["Anomaly reproduction", "Normalized schema/refactor evidence", "Derived-data consistency model", "Denormalization decision record"],
        completionCriteria: ["The update anomaly is demonstrated rather than only described.", "Normalization removes competing authoritative facts.", "Any proposed denormalization has a concrete synchronization and failure model backed by a real need."],
    },
    "relational-data-and-postgresql-indexes-practice": {
        objective: "Treat an index as a measurable production trade-off by proving when PostgreSQL uses it and what cost it introduces.",
        scenario: "A frequently used Steward catalogue query is becoming slow as data grows. The first suggestion is to add indexes to every filtered column. You must establish whether one targeted index actually improves the access path.",
        instructions: [
            "Generate enough representative service data that scan choice is meaningful.",
            "Choose one real predicate/join/order pattern and capture EXPLAIN ANALYZE before adding an index.",
            "Create one candidate single or composite index based on that access pattern.",
            "Capture the new plan and compare scan type, estimated/actual rows, timing and buffers where available.",
            "Run an INSERT/UPDATE workload or reason from measured evidence about the additional maintenance/storage cost.",
            "Test one query where PostgreSQL still chooses a sequential scan and explain why that can be correct."
        ],
        deliverables: ["Before/after plans", "Index DDL", "Measured comparison", "Index keep/remove decision"],
        completionCriteria: ["The index is tied to a demonstrated access pattern rather than naming convention.", "The learner can explain why PostgreSQL may ignore an available index.", "Read benefit and write/storage cost are both acknowledged."],
    },
    "relational-data-and-postgresql-query-plans-practice": {
        objective: "Read the broad execution story of a real Steward query and turn plan evidence into the next investigation rather than random tuning.",
        scenario: "A join-and-aggregation query is slower than expected. Another engineer says the SQL 'looks simple', but nobody has inspected what PostgreSQL is actually doing.",
        instructions: [
            "Choose a meaningful query with at least one join and aggregation or sort.",
            "Run EXPLAIN first, then EXPLAIN (ANALYZE, BUFFERS) when it is safe to execute.",
            "Annotate the major scan, join, sort and aggregate nodes from leaves to root.",
            "Compare estimated rows with actual rows and identify the largest mismatch.",
            "Identify where most time or buffer work appears to occur without immediately changing the query.",
            "Write one next investigation that follows from the plan evidence and one tempting but unsupported optimization you are deliberately not doing."
        ],
        deliverables: ["Annotated execution plan", "Estimate-vs-actual observations", "Performance hypothesis", "Rejected premature-optimization note"],
        completionCriteria: ["EXPLAIN and EXPLAIN ANALYZE are distinguished correctly.", "The plan is interpreted as a tree of physical work, not a wall of numbers.", "The proposed next step follows from observed evidence."],
    },
    "relational-data-and-postgresql-query-performance-practice": {
        objective: "Run a controlled database-performance investigation with a measurable symptom, representative data and a defensible before/after comparison.",
        scenario: "Steward's service-search endpoint has a p95 target of 300 ms but is exceeding it on a larger catalogue. You are asked to improve it without introducing cargo-cult indexes or rewriting everything in raw SQL.",
        instructions: [
            "Define the exact query, representative parameters, data volume and measurable symptom before tuning.",
            "Capture baseline timing, row count and EXPLAIN ANALYZE evidence under repeatable conditions.",
            "Form one hypothesis involving a plausible lever such as predicate shape, index, row width, pagination or round-trip count.",
            "Change only the factor needed to test that hypothesis and rerun under the same conditions.",
            "Compare results and decide whether to keep, revert or continue investigating.",
            "Document limitations such as warm caches, local hardware, small concurrency or synthetic data."
        ],
        deliverables: ["Performance problem statement", "Baseline evidence", "Single-hypothesis change", "Before/after comparison and conclusion"],
        completionCriteria: ["The investigation starts from a measurable symptom rather than 'make SQL faster'.", "Conditions are controlled enough for the comparison to mean something.", "The conclusion includes limitations and may legitimately reject the attempted optimization."],
    },
    "relational-data-and-postgresql-postgresql-practice-practice": {
        objective: "Operate Steward's PostgreSQL instance directly enough to distinguish application behavior from database facts and to collaborate intelligently with a DBA later.",
        scenario: "The API is reporting database errors, but the Django logs are inconclusive. You have shell access to the learner-owned database host and must inspect PostgreSQL directly without using superuser privileges for the application.",
        instructions: [
            "Connect with psql using an administrative learning account and separately identify the application's non-superuser role.",
            "Inspect databases/schemas, tables, columns, constraints and indexes using psql metadata commands or catalog queries.",
            "Inspect current connections and identify which role/database the Steward application uses.",
            "Create or document the minimum privileges the application role needs and name at least two privileges it should not have.",
            "Take a logical backup of the local Steward database using the PostgreSQL tooling appropriate to your setup and verify that the backup artifact exists and is readable by the intended operator.",
            "Write a short handoff note listing what a future DBA/reliability investigation would still need to cover: restore testing, pooling, locks, replication/HA, capacity and operational monitoring."
        ],
        deliverables: ["psql inspection transcript", "Application-role privilege note", "Local logical-backup evidence", "DBA/reliability handoff note"],
        completionCriteria: ["The learner can inspect core PostgreSQL objects without depending on Django admin tooling.", "The application is not assumed to require superuser privileges.", "Backup creation is introduced as an operational concept without pretending Builder has completed production DBA training."],
    },
    "relational-data-and-postgresql-django-orm-practice": {
        objective: "Use Django's ORM productively while maintaining a visible mental link to the SQL and database work it causes.",
        scenario: "A teammate says the ORM means the team no longer needs to think about SQL. Review several Steward QuerySets and prove what PostgreSQL is actually being asked to do.",
        instructions: [
            "Implement one filtered service query, one relationship query and one aggregate/annotate query in Django ORM.",
            "Before evaluating each QuerySet, predict whether it has executed yet and what operation should trigger execution.",
            "Inspect the generated SQL and compare predicates, joins and grouping with your prediction.",
            "Run one QuerySet twice in different evaluation patterns and observe when database access occurs.",
            "Identify one ORM expression that is clear and one where SQL knowledge is necessary to judge correctness or cost.",
            "Record the rule you would use for deciding when to inspect generated SQL during development."
        ],
        deliverables: ["Three Steward QuerySets", "Generated SQL evidence", "QuerySet evaluation observations", "ORM transparency note"],
        completionCriteria: ["The learner can explain QuerySet laziness with observed execution behavior.", "Generated SQL is inspected rather than assumed.", "The ORM is treated as a database interface, not as a replacement for relational reasoning."],
    },
    "relational-data-and-postgresql-orm-vs-sql-practice": {
        objective: "Choose between Django ORM and parameterized SQL for one non-trivial query using evidence about clarity, capability and maintenance.",
        scenario: "A reporting query involving joins and aggregation is becoming awkward in the ORM. One engineer wants raw SQL immediately; another insists raw SQL should never exist in a Django service.",
        instructions: [
            "Choose one real Steward reporting question with joins or aggregation.",
            "Implement a maintainable ORM version and inspect the generated SQL.",
            "Implement an equivalent raw-SQL version using parameter binding for all external values.",
            "Compare correctness, readability, testability, generated/hand-written plan shape and PostgreSQL-specific coupling.",
            "Change one requirement slightly and estimate which implementation is easier to evolve safely.",
            "Write an ADR-style decision selecting one implementation for this query without generalizing the answer to every query."
        ],
        deliverables: ["ORM implementation", "Parameterized SQL implementation", "Plan/maintenance comparison", "Query-level decision record"],
        completionCriteria: ["Both implementations produce equivalent business results.", "Raw SQL contains no unsafe string interpolation of external values.", "The selected approach is justified for this query rather than by ideology."],
    },
    "relational-data-and-postgresql-n-plus-one-practice": {
        objective: "Make an N+1 problem visible in measurements, fix it with the appropriate loading strategy and prove the query-count improvement.",
        scenario: "The service-list endpoint is fast with five records but becomes unexpectedly chatty with hundreds because the serializer accesses owning team and environments for each service.",
        instructions: [
            "Create representative data with enough services and relationships for query-count growth to be obvious.",
            "Implement or reproduce a listing that touches owning_team for each service and record database query count.",
            "Fix the single-valued relationship using select_related and measure again.",
            "Reproduce a multi-valued relationship access and fix it with prefetch_related.",
            "Compare both query count and the amount/shape of data fetched so the solution is not judged by count alone.",
            "State the dataset size at which you measured and why tiny development data can hide the problem."
        ],
        deliverables: ["N+1 reproduction", "Before/after query counts", "select_related/prefetch_related implementation", "Measurement note"],
        completionCriteria: ["The original query count grows with result size in a way the learner can explain.", "The fix uses the relationship-loading strategy appropriate to each relation.", "Improvement is demonstrated with evidence rather than assumed from code changes."],
    },
    "relational-data-and-postgresql-migrations-practice": {
        objective: "Evolve a populated Steward schema through deployable stages rather than treating generated migrations as safe by default.",
        scenario: "Every production Service must eventually have a required technical_owner field, but thousands of existing rows do not have one. A single generated NOT NULL migration would fail or force an unsafe default.",
        instructions: [
            "Seed existing services that lack the new field.",
            "Design an expand-contract style sequence: add compatible structure, populate/backfill safely, migrate readers/writers, then tighten the constraint.",
            "Generate Django migrations but inspect the actual operations before applying them.",
            "Apply the stages to populated data and verify old rows remain valid at every deployable point.",
            "Simulate a bad backfill assumption or constraint failure and record how you detect/recover before proceeding.",
            "Document forward, rollback and mixed-version compatibility considerations."
        ],
        deliverables: ["Staged migration plan", "Reviewed Django migrations", "Populated-data execution evidence", "Forward/rollback compatibility note"],
        completionCriteria: ["No stage assumes an empty database.", "Generated migrations are reviewed as production changes.", "The final constraint is introduced only after existing data and application compatibility have been addressed."],
    },
    "relational-data-and-postgresql-concurrency-practice": {
        objective: "Reproduce a real race between two database sessions and select the smallest database protection that preserves the Steward invariant.",
        scenario: "Two requests attempt the same logical operation at nearly the same time. Sequential tests pass, but production-like concurrency can create duplicate slugs or conflicting lifecycle transitions.",
        instructions: [
            "Choose either duplicate service creation or a contested state transition as the invariant under test.",
            "Open two PostgreSQL sessions and coordinate them so both observe the precondition before either completes.",
            "Demonstrate the incorrect or conflicting behavior when protection is insufficient.",
            "Apply the smallest suitable mechanism: a UNIQUE constraint, transaction/isolation choice or SELECT ... FOR UPDATE where coordination is genuinely required.",
            "Repeat the two-session experiment and capture what the losing/blocked transaction observes.",
            "Explain why blanket locking would be a worse design than the chosen protection."
        ],
        deliverables: ["Two-session race transcript", "Database protection change", "Protected rerun evidence", "Concurrency decision note"],
        completionCriteria: ["The race is actually reproduced with overlapping sessions rather than only described.", "The selected protection matches the invariant being protected.", "Failure/blocking behavior of the competing transaction is understood."],
    },
};

export const relationalDataAndPostgresqlQualityLessons: Lesson[] = relationalDataAndPostgresqlDeepLessons.map((lesson) => ({
    ...lesson,
    activities: lesson.activities.map((activity) => {
        if (activity.content.type !== "practical") return activity;
        const practice = practices[activity.id];
        if (!practice) return activity;
        return { ...activity, content: { type: "practical", ...practice } };
    }),
}));
