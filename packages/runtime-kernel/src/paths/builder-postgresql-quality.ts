import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { djangoDependentPostgresqlDeepLessons, relationalDataAndPostgresqlDeepLessons } from "./builder-postgresql-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
    "relational-data-and-postgresql-from-memory-to-durable-data-practice": {
        objective: "Demonstrate cross-process persistence and its limitations before adopting a database.",
        scenario: "The existing Steward HTTP server stores data in process memory. A user assumes that a successful HTTP response makes that data durable. Test that assumption using disposable state.",
        instructions: [
            "Create an empty scratch directory, save the exact published persistence_lab.py, and run reset, add-payments, read, add-identity, read as separate commands.",
            "Capture the file after each write and state exactly which process owns the dictionary versus which file persists.",
            "Run corrupt and read. Record stdout, exit status 2, and recover with reset. Do not execute this against a real registry.",
            "Reason through two simultaneous snapshot reads and overwriting writes, identifying the lost-update hazard without claiming to have reproduced a race.",
            "Compare memory, file snapshots and PostgreSQL for one-user demos versus Steward's multi-writer registry. Explain what would have to change before claiming crash-safe writes."
        ],
        deliverables: ["Five-command transcript and snapshot contents", "Corruption negative case and recovery", "Two-writer lost-update timeline", "Storage choice decision record"],
        completionCriteria: ["The learner has reproduced persistence across separate Python processes.", "The negative JSON corruption is observed and the recovery documented.", "The limits of the exercise (no concurrency or crash safety) are not presented as verified.", "A database is chosen for explicit Steward requirements rather than assumed universally necessary."]
    },
    "relational-data-and-postgresql-postgresql-first-connection-practice": {
        objective: "Use a real PostgreSQL connection and independently discover psql's built-in commands.",
        scenario: "A librarian has access to an approved PostgreSQL server but needs to learn how to inspect the connection, find built-in help and distinguish the shell, psql and SQL. No database objects or containers are required.",
        instructions: [
            "Reuse the native PostgreSQL installation or approved training-server connection verified in the preceding setup lesson. Record the host, port, role and database without copying any password.",
            "From your operating-system shell, run the working psql command. Explain what -h, -p, -U and -d select; do not copy prompts into the command.",
            "At the psql prompt, run \\conninfo, \\l and \\du. Then enter SELECT current_database(), current_user, 2+2; with a semicolon. Classify the three backslash commands as client instructions and SELECT as server-executed SQL.",
            "Run \\? to find psql's built-in command list. Run \\h SELECT to obtain help for an SQL statement. Explain why \\? and \\h are different; identify \\d and \\dt in help but save table inspection until the lesson in which a real table exists.",
            "Use \\c to reconnect to a database for which you already have permission (the same maintenance database is fine). Verify the selected database again and quit using \\q. Start a fresh session and explain why PostgreSQL still runs after psql exits.",
            "On a disposable local setup, try connecting to a deliberately nonexistent database and classify the error. On a restricted supplied server, do not test unauthorized access; instead explain how a missing client, refused connection, rejected login, missing database and SQL syntax error differ."
        ],
        deliverables: ["Connection diagram labeling shell, psql client, server, database and role", "Authenticated SELECT result or precise access blocker", "Transcript using \\conninfo, \\l, \\du, \\?, \\h, \\c and \\q", "One observed safe error or justified restriction plus error classification"],
        completionCriteria: ["The learner can identify the program that executes SQL and the one that interprets backslash commands.", "The session is real and no future tooling is required.", "The learner uses help rather than guessing unfamiliar commands.", "No database table, container runtime or production credentials are needed."]
    },
    "relational-data-and-postgresql-relational-model-practice": {
        objective: "Explain keys and relationships using an isolated Author/Book experiment before applying the model to Steward.",
        scenario: "The preceding PostgreSQL lessons created a durable books table and introduced temporary-table lifetime. Now build a separate two-table example to show how a foreign key connects facts without copying author information into every book.",
        instructions: [
            "In tsa_library, inspect the existing library.books table without changing it, then create author_example and book_example using the reading's exact CREATE TEMP TABLE statements in a single psql session.",
            "Insert the two authors and three books. For each book, identify the author_id that references author_example(id). Explain why this relationship is one-to-many.",
            "Attempt the published insert with author_id 999 and capture the foreign-key violation. Count the remaining three books; distinguish a rejected reference from a missing table.",
            "Draw Author → Book and a proposed BookAuthor linking table for the many-to-many case. Explain the duplicate-author-name update anomaly.",
            "Close psql and reconnect. Demonstrate that the temporary example tables have disappeared while the durable library.books table remains.",
            "Only after understanding the library example, transfer the idea to Steward: explain why service.owning_team_id should reference a Team identifier and how a ServiceDependency link can represent a directed relationship. The later Steward seed lab establishes the permanent project dataset."
        ],
        deliverables: ["Author/Book relationship diagram and proposed many-to-many link", "Foreign-key rejection and unchanged three-row evidence", "Temporary-versus-durable table lifetime proof", "Short explanation transferring the model to Team and Service"],
        completionCriteria: ["Examples match the authored lesson's actual author_example/book_example names and records.", "A real FK rejection is observed before the temporary session ends.", "The learner does not confuse table lifetime with referential integrity.", "Steward is used as an application after the general mechanism is understood."]
    },
    "relational-data-and-postgresql-steward-schema-and-seed-practice": {
        objective: "Build one permanent, consistent, disposable PostgreSQL teaching dataset that supports the next SQL lessons.",
        scenario: "The original lesson sequence later queried columns and relationships without defining them. Establish a single documented schema plus seed data, then verify both successful joins and constraint failures.",
        instructions: [
            "Confirm you are connected to a freshly provisioned empty tsa_steward_lab database; do not drop or overwrite tables in an existing database.",
            "Save the published steward_schema_seed.sql exactly and execute it with psql -X -v ON_ERROR_STOP=1 -1 -f steward_schema_seed.sql.",
            "Save and run verify_steward_seed.sql in a new connection. Check team counts (Identity 1, Payments 2, Platform 2), one missing Payroll environment and both dependency edges.",
            "Attempt the two separately documented invalid inserts: foreign-key orphan and duplicate Service name. Capture distinct errors and verify five original Services remain.",
            "Explain why the operational active flag is distinct from the canonical lifecycle stages development/uat/production/retired; the fixture deliberately contains one production-stage Service without a production Environment as diagnostic negative data, not a valid release record. Fake .invalid endpoints are not suitable for live HTTP tests.",
            "Commit SQL scripts, expected results and a concise documented reset/reprovisioning procedure for this disposable learning database."
        ],
        deliverables: ["Atomic baseline SQL run", "Three expected verification query result sets", "Two negative constraint transcripts", "Post-run integrity query", "Reproduction instructions"],
        completionCriteria: ["All later-referenced baseline columns exist in the seed schema.", "Five Services, three Teams, four Environment rows and two directed dependencies are proved, not guessed.", "No destructive commands are directed at real or shared data.", "No PostgreSQL pass is inferred from source-only or SQLite-based checks."]
    },
    "relational-data-and-postgresql-sql-crud-practice": {
        objective: "Update an existing Steward row with a predictable, verified target set.",
        scenario: "You need to test a corrected Steward Service field without permanently altering the canonical five-Service dataset. Preview one known Service, change one attribute and restore the original value.",
        instructions: [
            "Start with the canonical five-Service fixture; choose one existing Service and save its current attribute value before any UPDATE.",
            "Use SELECT with the exact intended UPDATE predicate to inspect matching rows and record the expected count.",
            "Apply UPDATE ... SET ... WHERE ... RETURNING to change one known attribute; explain the difference between zero, one and multiple affected rows.",
            "Run a fresh SELECT to verify the changed attribute, then use another selective UPDATE to restore the exact original value; prove all five teaching Services remain unchanged.",
            "Write but do not execute a predicate-free UPDATE example and explain why valid SQL can still be destructive.",
            "Keep this exercise focused on UPDATE; the next lesson treats row deletion separately."
        ],
        deliverables: ["Read-only preview and expected row count", "UPDATE/RETURNING transcript", "Before/after verification", "Explanation of a broad-predicate failure"],
        completionCriteria: ["The original canonical fixture rows are left intact.", "The UPDATE result matches the intended single record.", "The learner can diagnose why a WHERE predicate matters."]
    },
    "relational-data-and-postgresql-filtering-ordering-practice": {
        objective: "Predict exact SQL predicate results, diagnose NULL/precedence failures, and produce deterministic ordered queries on the canonical Steward seed.",
        scenario: "An engineer accidentally includes Legacy Gateway in a production-stage Service report. Diagnose why a valid query leaks a retired record and prove the correction against the unchanged five-service dataset.",
        instructions: [
            "Start with the canonical steward_schema_seed.sql baseline; do not assume technical_owner exists or add unexplained columns.",
            "Run filter_boolean.sql and annotate the retained row set before/after parentheses. Explain the AND/OR binding with the named Legacy Gateway row.",
            "Run filter_null.sql and explain UNKNOWN, NOT UNKNOWN, IS NULL and which rows WHERE retains.",
            "Run filter_order.sql; show that its chosen order is alphabetical rather than a business severity ranking.",
            "Independently construct a production-stage Service search using ILIKE 'pay%' and stable ORDER BY name, id, then change case and verify the result.",
            "Describe how OFFSET pages can change under inserts and why ORDER BY alone does not solve snapshot consistency."
        ],
        deliverables: ["Executed Boolean and NULL transcripts", "Truth table explaining UNKNOWN", "Independent search query and output", "Deterministic sort and pagination limitation note"],
        completionCriteria: ["All named rows are predicted and compared with the real PostgreSQL output.", "A retired Service cannot enter a production-only result through Boolean-precedence mistakes.", "No column absent from the canonical fixture is used without an explicit migration.", "No textual criticality order is mistaken for domain severity rank."]
    },
    "relational-data-and-postgresql-aggregation-practice": {
        objective: "Reproduce inaccurate database metrics caused by row multiplication and correct them at the intended business grain.",
        scenario: "Steward reports three services for Payments, but the canonical dataset contains two. Prove the query is counting joined environment rows rather than service identities.",
        instructions: [
            "Run aggregate_team.sql and predict the three Team counts before executing.",
            "Run the read-only aggregate_zero.sql VALUES-row example with synthetic Unassigned Team and contrast COUNT(*)=1 with COUNT(s.id)=0.",
            "Run aggregate_having.sql and explain why HAVING is a group filter, and lifecycle belongs in ON when a LEFT JOIN must keep empty teams.",
            "Run aggregate_inflation.sql and inspect the raw join inputs behind Payments=3 versus distinct service_count=2.",
            "Run aggregate_nulls.sql and distinguish COUNT(*) (5), COUNT(retired_at) (1) and criticality FILTER (2).",
            "Independently write a per-Team report distinguishing services, production-stage services and actual production deployments, describing the grain of each metric."
        ],
        deliverables: ["Five verified aggregate transcripts", "Manual row-count reconciliation", "Zero-case demonstration", "Independent metric report", "Explanation of COUNT DISTINCT limitations for sums"],
        completionCriteria: ["Every number is reconciled to original Service/Environment rows.", "Empty parent records do not disappear unintentionally.", "The learner can explain why DISTINCT is one targeted fix rather than a universal response to a bad JOIN.", "WHERE, ON and HAVING have separate documented responsibilities."]
    },
    "relational-data-and-postgresql-joins-practice": {
        objective: "Predict and execute JOIN results and debug missing and multiplied rows before aggregating them.",
        scenario: "An INNER JOIN review report hides Payroll API because it has no Environment; an apparently equivalent LEFT JOIN report loses Payroll again when a production filter is moved from ON to WHERE.",
        instructions: [
            "Run join_owner.sql and trace a Service-to-Team foreign key for every one of the five seeded services.",
            "Run join_optional.sql and explain the two Payments rows and Payroll's NULL Environment.",
            "Run join_on_where.sql twice; show why the ON variant keeps Payroll while the WHERE variant omits it.",
            "Run join_right.sql and demonstrate the equivalent LEFT JOIN query preserving unmatched Service rows.",
            "Run join_dependencies.sql and map both directed edges using source and destination aliases.",
            "Independently count plain Service rows (5), Service LEFT JOIN Environment rows (6) and the INNER JOIN rows (4). Predict them first, then execute."
        ],
        deliverables: ["Five executable JOIN outputs", "Pair matching and NULL-extension diagram", "ON-vs-WHERE failure diagnosis", "Directed dependency reconstruction", "Count prediction and actual reconciliation"],
        completionCriteria: ["The matching predicate, join type, and one-to-many cardinality are explained separately.", "LEFT/RIGHT preservation and ON/WHERE filtering are demonstrated with real missing relationships.", "The learner can explain why a Service can appear twice without being duplicated in persistent storage.", "The JOIN module is completed before the Aggregation module."]
    },
    "relational-data-and-postgresql-subqueries-practice": {
        objective: "Use IN, EXISTS, scalar and anti-existence queries with precise row-shape predictions and a reproducible NULL failure.",
        scenario: "An operator must find Services with and without production deployments. A NOT IN query unexpectedly returns no results when the candidate list contains NULL.",
        instructions: [
            "Use the unchanged five-Service database fixture; run subquery_in.sql, subquery_exists.sql and subquery_scalar.sql and state each inner query's output shape.",
            "Run the isolated subquery_not_in.sql example; record why the first query returns zero rows while the NOT EXISTS version returns 2 and 3.",
            "Independently write correlated NOT EXISTS and LEFT anti-join queries for Services without a production Environment.",
            "Compare the two results with the fixture's Payroll API and Legacy Gateway; do not infer algorithmic performance superiority from syntax.",
            "Explain when a scalar subquery is invalid because it produces multiple rows and when JOIN can increase outer-row cardinality."
        ],
        deliverables: ["Four source-extracted SQL transcripts", "NULL truth-condition diagnosis", "Two independently authored anti-join queries", "Query-shape decision note"],
        completionCriteria: ["The learner predicts result sets before execution.", "NOT IN with nullable values does not silently pass as equivalent to NOT EXISTS.", "Correlation is explicitly tied to the outer Service identity.", "The chosen form matches the question before optimization."]
    },
    "relational-data-and-postgresql-ctes-practice": {
        objective: "Build inspectable staged queries and a terminating directed dependency traversal without confusing WITH with persistent storage.",
        scenario: "A registry reviewer wants critical service dependency counts and the transitive dependency chain of Payroll API. The dependency graph may contain cycles.",
        instructions: [
            "Run cte_priority.sql and verify the three exact priority-service outgoing edge counts.",
            "Execute and explain each nonrecursive CTE stage independently before trusting the combined query.",
            "Run cte_recursive.sql and trace depth 0 Payroll API to depth 2 Identity API; explain each visited-node guard operation.",
            "Run the isolated cte_cycle.sql with VALUES two-node cycle and show that A and B appear once each.",
            "Create a new staged query based on a concrete registry question and compare readability with its non-CTE equivalent.",
            "Distinguish a query-scoped CTE, a session TEMP table, a persistent VIEW and a materialized view; do not claim query tuning or plan materialization without EXPLAIN evidence."
        ],
        deliverables: ["Three published SQL transcripts", "Anchor/recursive-step/path diagram", "Two-node cycle termination evidence", "Independent staged query", "CTE storage and plan boundary note"],
        completionCriteria: ["Cycle guard is actually executed and output verified.", "Recursive query cannot loop indefinitely on the provided example.", "The learner explains the lifetime and materialization limitations of WITH.", "Examples use the existing ServiceDependency fixture without unannounced schema mutations."]
    },
    "relational-data-and-postgresql-transactions-acid-practice": {
        objective: "Demonstrate transaction atomicity with real PostgreSQL commit/rollback evidence and recover from a deliberately invalid statement using a SAVEPOINT.",
        scenario: "A production Service and its initial Environment are two rows representing one required business registration. Without one transaction, a failing Environment creation can leave a half-created Service.",
        instructions: [
            "Establish a disposable PostgreSQL lab with the seeded Steward tables; explain why foreign-key integrity does not by itself require every Service to have an Environment.",
            "Save and execute the published txn_rollback.sql script. Capture inside=1, after=0 and a fresh-connection read of 0.",
            "Save and execute txn_commit.sql; verify both Service and Environment in another psql connection. Run it only once against the clean fixture.",
            "Execute txn_savepoint.sql. Record the intended CHECK violation, rollback-to-savepoint and valid committed replacement Environment. Do not weaken the CHECK or globally suppress psql errors.",
            "Produce a separate autocommit thought experiment that shows the half-state risk without modifying the shared fixture.",
            "Distinguish atomicity, declared consistency, isolation and durability, including limitations of the exercises, then safely remove only the educational records."
        ],
        deliverables: ["Rollback and new-connection transcript", "Two-row commit evidence", "SAVEPOINT recovery and error transcript", "ACID versus business invariant explanation"],
        completionCriteria: ["The observed rollback leaves no Service after reconnect.", "A committed Service and Environment are both visible to a new session.", "The real CHECK failure is captured and does not escape to production data.", "The learner does not claim a simulated power outage or automatic domain consistency."]
    },
    "relational-data-and-postgresql-concurrent-transactions-and-isolation-levels-practice": {
        objective: "Prove PostgreSQL's Read Committed and Repeatable Read visibility differences through two independently coordinated psql sessions.",
        scenario: "Two workers read the same state while one commits an update. Their outputs differ even though neither reads uncommitted data. Explain the snapshot boundary rather than calling every changed value a race-condition bug.",
        instructions: [
            "Create the dedicated tsa_isolation_probe table only in an isolated learning database and start two independent psql terminals A and B.",
            "Follow isolation_read_committed.txt step by step. Capture A=10 initially, A=10 while B's update is uncommitted, and A=20 after B commits.",
            "Reset the probe to 10 and follow isolation_repeatable_read.txt. Capture A=10 initially and still 10 after B commits, then 20 after A ends.",
            "Draw a timeline showing both session boundaries, snapshots and the COMMIT that changes what future reads may observe.",
            "Contrast PostgreSQL's Read Uncommitted behavior, Repeatable Read limitations and SQLSTATE 40001 whole-transaction retry for Serializable.",
            "Clean up only the dedicated probe after recording evidence; do not interpret a single-session script as a concurrency demonstration."
        ],
        deliverables: ["Two-terminal Read Committed transcript", "Two-terminal Repeatable Read transcript", "Snapshot/commit timeline", "Isolation and retry decision record"],
        completionCriteria: ["The test actually uses separate concurrent database connections.", "The learner can explain the post-B-commit read difference between isolation levels.", "No dirty-read claim contradicts PostgreSQL behavior.", "Serializable is not marked tested merely because Read Committed/Repeatable Read ran."]
    },
    "relational-data-and-postgresql-constraints-keys-practice": {
        objective: "Move durable Steward invariants from comments and application checks into PostgreSQL where the database can enforce them for every writer.",
        scenario: "The database is about to gain more than one writer when the following Django module maps the schema. Any invariant protected only by the current Python application boundary could then be bypassed by direct SQL, imports or concurrent writers.",
        instructions: [
            "List candidate invariants and classify which belong in PostgreSQL, application code, or both.",
            "Inspect the existing Service.name UNIQUE and criticality CHECK constraints first. Then run the reversible lesson's slug-column/UNIQUE migration; explain why adding the same constraints again would fail rather than blindly applying duplicates.",
            "Verify the existing ServiceDependency self-reference CHECK and UNIQUE(source_service_id,target_service_id) with direct negative inserts; do not redundantly add constraints already in the canonical seed.",
            "Choose and justify surrogate/natural/composite key usage where applicable, then choose and justify referential actions for at least one foreign key rather than accepting defaults blindly.",
            "Attempt each invalid write directly in SQL and capture PostgreSQL's rejection.",
            "Identify the production-readiness rule that cannot be represented safely as a single-table CHECK and explain where it remains enforced."
        ],
        deliverables: ["Invariant classification", "Constraint DDL/migration", "Negative-case database errors", "Boundary note for application-only rule"],
        completionCriteria: ["Durable row/relationship invariants are protected independently of any future framework or writer.", "Invalid writes are demonstrated directly against PostgreSQL.", "The learner can explain both the power and limits of database constraints."],
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
            "Identify which remaining values are authoritative facts and which are derived values. For one composite-key relation, check whether every non-key fact depends on the whole key; for one ordinary table, identify any transitive non-key dependency.",
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
            "Create one candidate single or composite B-tree index based on that access pattern; for a composite index, test a leading-column query and a non-leading-column query and compare planner choices.",
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
            "Annotate the major scan, join, sort and aggregate nodes from leaves to root; identify the specific scan/join strategy names PostgreSQL chose and multiply rows by loops where relevant.",
            "Compare estimated rows with actual rows and identify the largest mismatch.",
            "Identify where most time or buffer work appears to occur without immediately changing the query.",
            "Write one next investigation that follows from the plan evidence and one tempting but unsupported optimization you are deliberately not doing."
        ],
        deliverables: ["Annotated execution plan", "Estimate-vs-actual observations", "Performance hypothesis", "Rejected premature-optimization note"],
        completionCriteria: ["EXPLAIN and EXPLAIN ANALYZE are distinguished correctly.", "The plan is interpreted as a tree of physical work, not a wall of numbers.", "The proposed next step follows from observed evidence."],
    },
    "relational-data-and-postgresql-query-performance-practice": {
        objective: "Run a controlled database-performance investigation with a measurable symptom, representative data and a defensible before/after comparison.",
        scenario: "A representative Steward catalogue SQL query is exceeding a provisional 300 ms database-query budget on the larger seeded dataset. Investigate the database access path before the later Django/API module turns it into an HTTP endpoint.",
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
        objective: "Diagnose a PostgreSQL connection, schema or object problem using read-only client and server evidence.",
        scenario: "A learner reports that a table has disappeared although psql connects successfully. Gather evidence about the actual database, schema, role, objects and current backend before deciding what failed.",
        instructions: [
            "Connect to the authorized learning database. Record \\conninfo, \\l, \\dn, \\du and the results of SELECT current_database(), current_user, current_schema(); without exposing secrets.",
            "Use \\dt library.* and \\d library.books against tsa_library, or inspect the documented public tables in the disposable Steward SQL fixture. Explain which database and schema each listing refers to.",
            "Run the source-published postgresql_inspect.sql when using the Steward fixture, comparing the actual table names with the expected inventory instead of assuming every database has those tables.",
            "Run the source-published read-only postgresql_session.sql to observe pg_backend_pid() and your own row in pg_stat_activity. Explain why another user's query text may be unavailable.",
            "Investigate a harmless missing-object lookup or an unqualified search_path surprise. Distinguish client-not-found, refused connection, failed authentication, wrong database, missing relation and permission-denied errors.",
            "Write a short diagnosis listing observed facts, remaining uncertainties and a next check. Do not issue GRANT, modify roles, take backups or change server settings here: the next two lessons teach permissions and backup/restore separately."
        ],
        deliverables: ["psql connection/schema/table inventory", "Read-only catalog and own-session evidence", "Error-stage diagnosis with a justified next check"],
        completionCriteria: ["The reported connection and database are established from observations rather than guesses.", "A missing object is not conflated with an authentication or privilege problem.", "No administrative changes, backups, secrets or destructive commands are required."]
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


export const djangoDependentPostgresqlQualityLessons: Lesson[] = djangoDependentPostgresqlDeepLessons.map((lesson) => ({
    ...lesson,
    activities: lesson.activities.map((activity) => {
        if (activity.content.type !== "practical") return activity;
        const practice = practices[activity.id];
        if (!practice) return activity;
        return { ...activity, content: { type: "practical", ...practice } };
    }),
}));
