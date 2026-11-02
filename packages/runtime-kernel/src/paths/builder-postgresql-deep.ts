import type { LearningResource, LessonBlock } from "../activities";
import type { Lesson } from "./lesson";

interface DataLessonSpec {
    id: string;
    title: string;
    introduction: string;
    outcomes: string[];
    sections: Array<{ id: string; title: string; body: string; code?: string; output?: string; caption?: string; language?: string }>;
    warning?: string;
    assignment: string[];
    resources: LearningResource[];
    practiceObjective: string;
    practiceInstructions: string[];
    knowledgeCheck: string;
}

const pgIntroVideo: LearningResource = { title: "CMU Database Systems — Relational Model and Algebra (lecture 1)", url: "https://www.youtube.com/watch?v=7NPIENPr-zk", kind: "video", read: "Entire lecture (advanced optional extension)", purpose: "Distinguish relational model, keys and physical storage; use after the first worked model." };
const postgresDocs: LearningResource = { title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/current/" };
const djangoQueryDocs: LearningResource = { title: "Django — Making queries", url: "https://docs.djangoproject.com/en/stable/topics/db/queries/" };
const djangoMigrationDocs: LearningResource = { title: "Django — Migrations", url: "https://docs.djangoproject.com/en/stable/topics/migrations/" };
const pgDdl: LearningResource = { title: "PostgreSQL — Data Definition", url: "https://www.postgresql.org/docs/current/ddl.html", kind: "reference" };
const pgQueries: LearningResource = { title: "PostgreSQL — Queries", url: "https://www.postgresql.org/docs/current/queries.html", kind: "reference" };
const pgFunctions: LearningResource = { title: "PostgreSQL — Aggregate Functions", url: "https://www.postgresql.org/docs/current/functions-aggregate.html", kind: "reference" };
const pgWith: LearningResource = { title: "PostgreSQL — WITH Queries", url: "https://www.postgresql.org/docs/current/queries-with.html", kind: "reference" };
const pgTransactions: LearningResource = { title: "PostgreSQL — Transaction Isolation", url: "https://www.postgresql.org/docs/current/transaction-iso.html", kind: "reference" };
const pgConstraints: LearningResource = { title: "PostgreSQL — Constraints", url: "https://www.postgresql.org/docs/current/ddl-constraints.html", kind: "reference" };
const pgIndexes: LearningResource = { title: "PostgreSQL — Indexes", url: "https://www.postgresql.org/docs/current/indexes.html", kind: "reference" };
const pgExplain: LearningResource = { title: "PostgreSQL — Using EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html", kind: "reference" };
const pgComparison: LearningResource = { title: "PostgreSQL — Comparison Functions", url: "https://www.postgresql.org/docs/current/functions-comparison.html", kind: "reference" };
const pgJoinTutorial: LearningResource = { title: "PostgreSQL — Joins Between Tables", url: "https://www.postgresql.org/docs/current/tutorial-join.html", kind: "reference" };
const pgAggregationTutorial: LearningResource = { title: "PostgreSQL — Aggregate Functions", url: "https://www.postgresql.org/docs/current/tutorial-agg.html", kind: "reference" };
const pgCmuModernSql: LearningResource = { title: "CMU 15-445 Fall 2025 — Modern SQL lecture", url: "https://15445.courses.cs.cmu.edu/fall2025/schedule.html", kind: "course", read: "Lecture 02; open linked notes and video", purpose: "Optional deeper explanation of SQL semantics and relational algebra" };
const pgPsql: LearningResource = { title: "PostgreSQL — psql", url: "https://www.postgresql.org/docs/current/app-psql.html", kind: "reference" };
const pgLocks: LearningResource = { title: "PostgreSQL — Explicit Locking", url: "https://www.postgresql.org/docs/current/explicit-locking.html", kind: "reference" };
const resourcesByDataLesson: Record<string, LearningResource[]> = {
 "relational-model":[pgDdl,pgIntroVideo],"sql-crud":[pgQueries],"filtering-ordering":[pgComparison,pgQueries,pgCmuModernSql],aggregation:[pgAggregationTutorial,pgFunctions],joins:[pgJoinTutorial,pgQueries],
 subqueries:[{ title: "PostgreSQL — Subquery Expressions", url: "https://www.postgresql.org/docs/current/functions-subquery.html", kind: "reference" }],ctes:[pgWith],"transactions-acid":[{ title: "PostgreSQL — Transactions", url: "https://www.postgresql.org/docs/current/tutorial-transactions.html", kind: "reference" }, pgConstraints],"concurrent-transactions-and-isolation-levels":[pgTransactions,pgLocks],"constraints-keys":[pgConstraints],"schema-design":[pgDdl],
 normalization:[pgDdl],indexes:[pgIndexes],"query-plans":[pgExplain],"query-performance":[pgExplain],"postgresql-practice":[pgPsql],
 "django-orm":[djangoQueryDocs],"orm-vs-sql":[djangoQueryDocs,pgQueries],"n-plus-one":[djangoQueryDocs,pgExplain],migrations:[djangoMigrationDocs,pgDdl],
 concurrency:[pgTransactions,pgLocks],
};

function lesson(spec: DataLessonSpec): Lesson {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: spec.outcomes },
        ...spec.sections.flatMap<LessonBlock>((section) => [
            { type: "heading", id: section.id, text: section.title, level: 2 },
            { type: "paragraph", text: section.body },
            ...(section.code ? [{ type: "code", language: section.language ?? "sql", code: section.code, caption: section.caption, output: section.output } satisfies LessonBlock] : []),
        ]),
        ...(spec.warning
            ? [{ type: "callout", tone: "warning", title: "Engineering caution", body: spec.warning } satisfies LessonBlock]
            : []),
        { type: "heading", id: "assignment", text: "Assignment", level: 2 },
        { type: "list", ordered: true, items: spec.assignment },
        { type: "resources", title: "Required and supporting reading", resources: Array.from(new Map([...(resourcesByDataLesson[spec.id] ?? []), ...spec.resources].map((resource) => [resource.url, resource])).values()) },
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
                    deliverables: ["Working SQL or schema change", "Reproducible evidence containing setup/query and observed output", "Short engineering note explaining the result and trade-offs"],
                    completionCriteria: ["Another learner could reproduce the result against the recorded Steward data/setup.", "At least one failure, edge case or alternative is executed and its observed result is recorded.", "The learner can explain what PostgreSQL is doing rather than only copy syntax."],
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
        "id": "from-memory-to-durable-data",
        "title": "From In-Memory State to Durable Data",
        "introduction": "The Steward registry you built in Python and the local Web/API lab can keep a Service record in a dictionary for as long as its process runs. Stop that process and the dictionary is gone. This is not a database bug; it is the starting limitation of volatile application state. Before learning tables or installing PostgreSQL, discover which problem persistence solves and why simply writing a JSON file is both useful and insufficient for a growing multi-user application.",
        "outcomes": [
            "Distinguish process memory, a file snapshot, persistent storage and a database management system.",
            "Demonstrate an actual process restart without losing a file-backed service record.",
            "Identify concurrent-update, partial-write, query and integrity failures of a naïve JSON snapshot.",
            "Explain why Steward should migrate to a relational model without claiming every project needs PostgreSQL."
        ],
        "sections": [
            {
                "id": "state-lifetime",
                "title": "Where does the data live while the program runs?",
                "body": "A Python dictionary is an object in a particular running process. It is fast to access and excellent for calculations or temporary state, but the runtime does not automatically turn it into durable records. A client calling GET /services receives a serialized representation; it has not learned whether the server used memory, a JSON file or PostgreSQL. A 200 response and a persistent result are separate guarantees. Restart the synthetic API from Web/API Foundations: its in-memory collection resets. The first engineering question is what must survive a restart and who may update it, not which database logo to choose."
            },
            {
                "id": "storage-choices",
                "title": "Memory, file, database: different responsibilities",
                "body": "Memory makes one process's current state accessible. A file lets bytes survive the process that wrote them, assuming a functioning storage system. A database management system coordinates operations over organized data, including queries, constraints, transactions, client connections and concurrent access. A relational database represents facts in tables linked by values and keys; a document database groups structured documents; a key–value store retrieves by key; an append-only event log preserves a sequence of events. Each solves a different workload and makes trade-offs in querying, relationships, operation semantics and complexity. 'Durable' is a property to verify under defined failures, not a promise that power loss, file corruption or backup mistakes can never happen."
            },
            {
                "id": "file-lab",
                "title": "A real two-process persistence experiment",
                "body": "Use Python 3 with no package installation. Create a disposable directory, save the following source as persistence_lab.py and execute the commands in the next section from inside that directory. Every command runs a new Python process. This lab deliberately saves a complete JSON snapshot and never touches your existing Steward repository. reset destroys only the snapshot in that disposable directory; corrupt deliberately damages it so you can observe a negative case. Inspect the file between commands.",
                "language": "python",
                "caption": "persistence_lab.py — published executable file-backed experiment",
                "code": "from pathlib import Path\nimport json\nimport sys\n\nFILE = Path(\"steward-snapshot.json\")\nif len(sys.argv) != 2 or sys.argv[1] not in {\"reset\", \"add-payments\", \"add-identity\", \"read\", \"corrupt\"}:\n    raise SystemExit(\"Use reset, add-payments, add-identity, read or corrupt\")\n\naction = sys.argv[1]\nif action == \"reset\":\n    FILE.write_text('{\"services\": []}\\n', encoding=\"utf-8\")\n    print(\"RESET: []\")\nelif action == \"corrupt\":\n    FILE.write_text('{\"services\": [', encoding=\"utf-8\")\n    print(\"CORRUPTED\")\nelse:\n    try:\n        data = json.loads(FILE.read_text(encoding=\"utf-8\"))\n    except (FileNotFoundError, json.JSONDecodeError):\n        print(\"ERROR: missing or invalid snapshot\")\n        raise SystemExit(2)\n    if action == \"read\":\n        print(\"READ:\", \", \".join(item[\"name\"] for item in data[\"services\"]))\n    else:\n        name = \"Payments API\" if action == \"add-payments\" else \"Identity API\"\n        data[\"services\"].append({\"id\": len(data[\"services\"]) + 1, \"name\": name})\n        FILE.write_text(json.dumps(data, indent=2) + \"\\n\", encoding=\"utf-8\")\n        print(\"ADDED:\", name)",
                "output": "reset → RESET: []\nadd-payments → ADDED: Payments API\nread (new process) → READ: Payments API\nadd-identity → ADDED: Identity API\nread (new process) → READ: Payments API, Identity API\ncorrupt → CORRUPTED\nread → ERROR: missing or invalid snapshot (exit 2)\nreset + read → RESET: [] then READ:"
            },
            {
                "id": "run-experiment",
                "title": "Run, observe and explain the failure",
                "body": "From an empty disposable directory: run python3 persistence_lab.py reset; python3 persistence_lab.py add-payments; python3 persistence_lab.py read; python3 persistence_lab.py add-identity; python3 persistence_lab.py read. Each invocation exits before the next starts, so seeing both names proves cross-process file persistence, not a living Python dictionary. Then run python3 persistence_lab.py corrupt and python3 persistence_lab.py read; the last command must exit 2 rather than silently inventing a new valid record. Recover with python3 persistence_lab.py reset followed by read. The order matters: the deliberate corruption is destructive inside your scratch directory. An absent file and malformed JSON are different root causes that this small script intentionally reports with the same public message; a production system would log more detail."
            },
            {
                "id": "concurrency",
                "title": "Why the file solution does not scale to two writers",
                "body": "Imagine two processes read a snapshot containing one service at the same moment. A adds a Payments record in its private in-memory copy; B adds an Identity record in its different private copy. Both write the entire JSON file. Whichever writes last can silently erase the other addition: a lost update. The script above does not simulate concurrent execution or protect against it. It also truncates the target file during replacement, making interruptions dangerous. Atomic file replacement can help with partial writes but does not by itself solve concurrent decisions, referential integrity, queries or authorization. These are reasons to explore database transactions and constraints, not proof that PostgreSQL prevents every mistake automatically."
            },
            {
                "id": "decision",
                "title": "Choose storage based on invariants and workload",
                "body": "For a disposable one-user demonstration, an in-memory dictionary may be sufficient. For a small single-user configuration, a carefully managed file may be reasonable. For a shared service registry, Steward needs independent Team and Service facts, queries over dependencies, multiple writers, controlled schema changes, and consistent ownership rules. A relational database is a defensible choice for those requirements. The next two lessons establish a working PostgreSQL session and then derive a relational schema from facts; they do not ask you to install Django, run an ORM or accept a complex API as a prerequisite."
            }
        ],
        "warning": "The JSON experiment does not prove crash-safe or concurrent storage. Do not store real credentials or customer data in the example snapshot; use disposable sample records only.",
        "assignment": [
            "Execute every published file command in a clean scratch directory and capture exit statuses, JSON file contents and independent-process outputs.",
            "Explain the two-writer lost-update timeline without claiming to have executed a concurrency test.",
            "Compare an in-memory store, a file and a relational database for a single-user prototype versus a team-owned service registry."
        ],
        "resources": [
            {
                "title": "Python Standard Library — json",
                "url": "https://docs.python.org/3/library/json.html",
                "kind": "reference",
                "purpose": "Understand serialization/deserialization and malformed JSON errors."
            },
            {
                "title": "PostgreSQL — Tutorial: Introduction and Getting Started",
                "url": "https://www.postgresql.org/docs/current/tutorial.html",
                "kind": "reference",
                "purpose": "Understand why a server database adds a connection/query/transaction model beyond writing a JSON file."
            },
            {
                "title": "CMU Database Systems (Fall 2025) — Lecture 1: Relational Model and Algebra",
                "url": "https://www.youtube.com/watch?v=7NPIENPr-zk",
                "kind": "video",
                "read": "Full introductory lecture; pause at the model vs SQL discussion",
                "purpose": "Compare relational facts, keys, physical storage and alternative models; advanced follow-up, not a prerequisite for the first SQL command."
            }
        ],
        "practiceObjective": "Prove that in-memory state and persistent state have different lifetimes; identify exactly why snapshot files do not suffice as Steward's multi-user data layer.",
        "practiceInstructions": [
            "Create a fresh scratch directory and save the lesson's Python code as persistence_lab.py; run reset, add-payments, read, add-identity and read as five separate processes.",
            "Record the exact file JSON after the second add and tie each output to process or file state.",
            "Run corrupt and read; capture the nonzero exit and explain what failed. Recover using reset and read.",
            "Draw a two-writer lost-update timeline; distinguish that thought experiment from the failures actually executed.",
            "Write a three-option storage decision record with query, concurrency, constraints, crash recovery, operational burden and growth assumptions."
        ],
        "knowledgeCheck": "Without looking at the source, explain (1) why restarting an HTTP server can erase records even though the client saw 201; (2) what changed after using a file; (3) how two correct single-process writes can lose data; (4) one case where a PostgreSQL deployment would be unnecessary."
    },
    {
        "id": "postgresql-first-connection",
        "title": "PostgreSQL: Server, Client and Your First Session",
        "introduction": "A PostgreSQL table is not something a code example can conjure up by itself. PostgreSQL is a running database server that accepts authenticated connections. psql is a separate client that sends SQL to that server. Before asking you to CREATE TABLE, this lesson establishes those components, an isolated learning database, a successful command, an intentional failure and repeatable setup evidence.",
        "outcomes": [
            "Separate PostgreSQL server, server process, cluster, database, schema, connection role and psql client.",
            "Connect to an explicitly selected disposable learning database without assuming a preinstalled local server.",
            "Run a multi-statement SQL file with deterministic error handling and inspect its result.",
            "Diagnose missing client, refused connection, authentication, missing database and SQL errors as distinct failures."
        ],
        "sections": [
            {
                "id": "architecture",
                "title": "Two programs, one protocol boundary",
                "body": "The server owns and coordinates database state. The client psql is a terminal program that opens a PostgreSQL connection, authenticates as a role, chooses a database, and submits SQL. Your shell, psql and the PostgreSQL server are three different execution contexts. A server instance can manage several named databases; schemas are namespaces inside one database. A PostgreSQL cluster in this context is the managed collection of databases under one server installation, not automatically a high-availability cluster. A role controls identity and privileges; it is not the same object as the database. This vocabulary prevents the common mistake of typing SQL into a shell or believing installation of psql starts a server."
            },
            {
                "id": "installation",
                "title": "Establish prerequisites without inventing credentials",
                "body": "You need an available PostgreSQL server (local, container-based or course-provided), psql installed, and a database/role for which you have permission. Follow the official PostgreSQL installation and Getting Started documentation appropriate to your operating system; do not run arbitrary privileged setup commands from a lesson. Run psql --version to verify the client binary, but recognize that a version string says nothing about server availability. For a local standard setup, inspect pg_isready -h 127.0.0.1 -p 5432; a ready signal means a listener answers, not that your credentials are valid. A hosted course database may use a different host, port or TLS requirement. Have your instructor or installation guide provision a dedicated database named tsa_steward_lab and an authorized non-superuser role. Do not perform these experiments on a production or shared application database."
            },
            {
                "id": "connection",
                "title": "Connect deliberately and identify the target",
                "body": "Use the host, port, role and database from your setup, not arbitrary guesses. PostgreSQL client utilities can use PGHOST, PGPORT, PGUSER and PGDATABASE environment variables; do not put passwords in the command text or committed source. For a local lab, set PGHOST=127.0.0.1, PGPORT=5432, PGDATABASE=tsa_steward_lab and PGUSER to your provisioned role in your shell. Type psql -X to enter an interactive session, use \\conninfo to inspect the active connection, SELECT current_database(), current_user; to prove its context, \\dt to list visible tables, and \\q to exit. Flags and meta-commands are interpreted by psql; SELECT is SQL executed by the server. Record the database/role but never include secrets in your evidence.",
                "language": "bash",
                "caption": "Shell commands — connection diagnostics, not SQL",
                "code": "psql --version\npg_isready -h 127.0.0.1 -p 5432\n# After setting PGHOST, PGPORT, PGUSER, PGDATABASE for YOUR lab:\npsql -X -v ON_ERROR_STOP=1 -c 'SELECT current_database(), current_user, 2 + 2 AS four;'\n# Expected: tsa_steward_lab | <your role> | 4"
            },
            {
                "id": "session-sql",
                "title": "A complete first SQL file: temporary tables and session scope",
                "body": "Write the following to first_session.sql, then run psql -X -v ON_ERROR_STOP=1 -f first_session.sql from your shell with the lab PG* variables set. CREATE TEMP TABLE defines a table limited to this database session; INSERT adds two rows; SELECT retrieves the ordered result; BEGIN/ROLLBACK demonstrate that an extra row inside the transaction is discarded. Running a fresh psql command to select from tsa_session_probe afterwards will fail because a temporary table does not survive the original connection. Contrast this intentionally temporary database table with the file snapshot in the previous lesson and the durable Team table we will build next.",
                "language": "sql",
                "caption": "first_session.sql — run only in a disposable PostgreSQL lab database",
                "code": "CREATE TEMP TABLE tsa_session_probe (\n  id integer PRIMARY KEY,\n  service_name text NOT NULL\n);\nINSERT INTO tsa_session_probe (id, service_name)\nVALUES (1, 'Payments API'), (2, 'Identity API');\nSELECT id, service_name FROM tsa_session_probe ORDER BY id;\nBEGIN;\nINSERT INTO tsa_session_probe (id, service_name) VALUES (3, 'Temporary Service');\nROLLBACK;\nSELECT count(*) AS remaining FROM tsa_session_probe;",
                "output": "CREATE TABLE\nINSERT 0 2\n id | service_name\n----+----------------\n  1 | Payments API\n  2 | Identity API\n(2 rows)\nBEGIN\nINSERT 0 1\nROLLBACK\n remaining\n-----------\n         2\n(1 row)"
            },
            {
                "id": "negative-cases",
                "title": "Classify failures by the boundary that actually failed",
                "body": "If psql --version is not found, the client is not available on PATH; no database query was attempted. If the host refuses a connection, no PostgreSQL session was established. A password or role error means the server responded but denied authentication. A database-does-not-exist error means the requested database name was not available; check PGDATABASE and provisioning. A syntax error or missing-relation error occurs only after reaching the SQL engine. With ON_ERROR_STOP=1 a noninteractive psql script stops on SQL error rather than silently continuing. Prove the missing-table case by running psql -X -v ON_ERROR_STOP=1 -c 'SELECT * FROM tsa_session_probe;' in a NEW session; it should fail even though the earlier session's SELECT worked."
            },
            {
                "id": "model-next",
                "title": "The next durable table is a design decision",
                "body": "A temporary table is useful for isolated experiments, but Steward Teams must survive a client disconnect. In the next lesson we create persistent tables in the dedicated learning database. SQL column definitions, primary keys, references and nullability will come from the facts the application must maintain, not from copying JSON responses. Keep your connection notes and a clean SQL file as the starting point. When an example says 'run this query,' you can now name the server, database, client and permissions needed to make that instruction meaningful."
            }
        ],
        "warning": "Do not paste passwords into shell history, screenshots, committed environment files or public issue comments. Never create/drop learning tables in a production database. SQL sample outputs assume the disposable database and stated commands; PostgreSQL has not been executed by the automated source-only regression.",
        "assignment": [
            "Verify the client and server separately and record the observed outcome, including any setup or access blocker.",
            "Connect to the dedicated lab database; run SELECT current_database(), current_user, 2+2 and record the expected 4.",
            "Execute first_session.sql and compare both result sets against the published output.",
            "Open a second psql session and demonstrate that the temporary table is absent; classify the error.",
            "Document the five diagnostic boundaries and the precise database/role the next lesson will use."
        ],
        "resources": [
            {
                "title": "PostgreSQL Official Tutorial — Getting Started",
                "url": "https://www.postgresql.org/docs/current/tutorial-start.html",
                "kind": "reference",
                "purpose": "Server installation, role, database, and connection prerequisites."
            },
            {
                "title": "PostgreSQL Official Tutorial — Accessing a Database",
                "url": "https://www.postgresql.org/docs/current/tutorial-accessdb.html",
                "kind": "reference",
                "purpose": "Interactive psql, SQL commands and psql meta-command distinction."
            },
            {
                "title": "PostgreSQL — psql Reference",
                "url": "https://www.postgresql.org/docs/current/app-psql.html",
                "kind": "reference",
                "purpose": "Script execution, ON_ERROR_STOP, connection flags and error exit behavior."
            }
        ],
        "practiceObjective": "Establish and prove an actual PostgreSQL lab connection before any subsequent schema exercise assumes one.",
        "practiceInstructions": [
            "Provision or obtain a dedicated lab PostgreSQL database and role; document installation choice, privileges and blocked prerequisites without exposing credentials.",
            "Run the shell diagnostics and the query reporting database, role and 4. Distinguish the client from the server.",
            "Save and execute first_session.sql with ON_ERROR_STOP; capture its 2-row output and final count 2.",
            "Use a second psql process to query the temporary table and capture the expected missing-relation error.",
            "Draw a five-layer failure triage tree covering unavailable client, refused transport, rejected login, nonexistent database and SQL execution failure.",
            "Explain why the next lesson's permanent Team table differs from the disposable session table."
        ],
        "knowledgeCheck": "Without notes, (1) trace shell → psql → PostgreSQL server → selected database/schema; (2) state why psql --version does not prove connectivity; (3) explain temporary vs persistent table lifetime; (4) choose the most informative observation for authentication failure versus missing relation."
    },
    {
        id: "relational-model",
        title: "The Relational Model",
        introduction: "A relational database stores structured data in tables and lets those tables relate to one another through values such as keys. Rows represent individual records; columns describe the values each record can hold. The relational model goes further than this physical picture: it gives us a disciplined way to represent facts and relationships so that data can change without duplicating or contradicting the same fact in many places. Steward needs that discipline for teams, services, environments and dependencies.",
        outcomes: ["Explain rows, columns, relations and keys without relying on ORM terminology.", "Distinguish identity from attributes.", "Model many-to-one and many-to-many facts explicitly.", "Recognize when duplicated facts create inconsistency risk."],
        sections: [
            { id: "table-mental-model", title: "Start with table, row and column", body: "Suppose we need to store teams. A table named team describes one kind of data. Each row represents one team. Columns such as id and name describe values recorded for every row. A primary key identifies each row independently of display values that may change.", code: "CREATE TEMP TABLE team (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE\n);\n\nINSERT INTO team (name) VALUES ('Payments'), ('Platform');\n\nSELECT id, name FROM team ORDER BY id;", caption: "One-session temporary Team relation; close psql after this model", output: " id |   name\n----+----------\n  1 | Payments\n  2 | Platform\n(2 rows)" },
            { id: "facts-as-relations", title: "From tables to relational facts", body: "These snippets are deliberately TEMP experiments in one psql session; their tables disappear after disconnect. The table/row/column picture is useful, but the relational model is about meaning rather than spreadsheet layout. Treat a table as representing facts of one kind. If a Service belongs to a Team, repeating the team name inside every service row duplicates a fact that can change. Store the Team once, give it stable identity, and let Service reference that identity." },
            { id: "steward-shape", title: "A first Steward relational shape", body: "Teams own services; services run in environments; services depend on other services. These are separate relations because they have different cardinalities, lifecycles and constraints.", code: "CREATE TEMP TABLE service (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL,\n  owning_team_id bigint NOT NULL REFERENCES team(id)\n);" },
            { id: "database-vocabulary", title: "Database, schema, table, row and column are different scopes", body: "A PostgreSQL server can host multiple databases. Inside a database, schemas are namespaces for objects such as tables. A table defines columns and constraints; each row records one fact instance. PostgreSQL commonly uses the public schema by default, but relying on defaults without understanding the namespace becomes confusing once applications, extensions or multiple teams share a database." },
            { id: "data-types", title: "Column types constrain representation", body: "Choose types from the fact being stored: bigint/identity for generated numeric identifiers, text for unconstrained text, boolean for true/false state, date for calendar dates, timestamptz for instants that must survive timezone presentation, numeric for exact decimal quantities, and uuid when UUID identity is deliberately required. A type does not encode every domain rule, but it prevents entire classes of invalid representation." , code: "CREATE TEMP TABLE environment (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  service_id bigint NOT NULL REFERENCES service(id),\n  name text NOT NULL,\n  kind text NOT NULL CHECK (kind IN ('development','staging','production')),\n  created_at timestamptz NOT NULL DEFAULT now()\n);" },
            { id: "null-meaning", title: "NULL means missing/unknown, not empty or zero", body: "NULL is a marker for absence of a value under SQL semantics. It is different from an empty string, zero and false. Decide whether absence is legitimate for each column; use NOT NULL when every valid row must contain the fact. Excessive nullable columns often indicate unclear lifecycle or table boundaries." },
        ],
        warning: "Do not choose table boundaries by mirroring JSON payloads. API representation and relational storage solve different problems.",
        assignment: ["Sketch the Steward entities and relationships without Django model syntax.", "Mark primary keys, foreign keys and cardinalities.", "Identify one fact that would become inconsistent if duplicated."],
        resources: [postgresDocs],
        practiceObjective: "Design the Steward model and prove its identity/relationship semantics using disposable temporary tables.",
        practiceInstructions: ["Draw the relations and cardinalities first.", "Use temporary example tables in a single psql session; the next lesson creates the durable baseline.", "Insert a small dataset with two teams and three services.", "Demonstrate one relationship query and explain why the model avoids duplicated ownership facts."],
        knowledgeCheck: "1. Why is a foreign key more than a convenient integer column?\n2. What is the difference between entity identity and an attribute such as service name?\n3. Why should service dependencies be represented as a relation rather than a comma-separated column?",
    },
    {
        "id": "steward-schema-and-seed",
        "title": "A Reproducible Steward Schema and Seed Dataset",
        "introduction": "Knowing the meaning of a relation does not yet give you a working database for every later SQL exercise. Earlier draft material invented service columns, environment kinds and dependencies at different points, producing SQL that cannot be run from the previous lesson's schema. Here we derive one explicit, disposable, versioned teaching dataset and prove it works. The rest of this module should use this baseline unless the activity deliberately evolves it.",
        "outcomes": [
            "Create Team, Service, Environment and ServiceDependency using declared SQL fields, types and constraints.",
            "Explain the relationship between PostgreSQL's persistent table definitions and the earlier disposable TEMP examples.",
            "Seed related rows by stable business meaning rather than guessing generated numeric IDs.",
            "Prove a missing relationship remains observable and foreign keys reject orphan writes."
        ],
        "sections": [
            {
                "id": "checkpoint",
                "title": "Do not run a second schema into unknown existing tables",
                "body": "Precondition: you have a working connection to a dedicated, empty tsa_steward_lab learning database using the previous lesson's server/client/role instructions. The temporary Team/Service demonstrations in The Relational Model should have been run in a different psql session and discarded when that session closed. This script creates permanent tables; unlike TEMP tables, they survive client disconnect. Do not add IF NOT EXISTS as a way to hide that you are connected to an old or incompatible schema. If CREATE TABLE says the relation already exists, stop, inspect \\dt and your target database, and create a new disposable lab database or explicitly reset under supervision; do not drop arbitrary tables."
            },
            {
                "id": "facts",
                "title": "Define facts, identities and integrity before writing rows",
                "body": "Team has its own identity and unique name; Service holds an immutable generated database identity and a Team foreign key. Service's name is unique here as an explicit *teaching assumption*, not a universal fact about all registries. Environment describes one deployed placement of one Service and has a kind limited to development, staging or production. A directed ServiceDependency relates source → target and forbids a self-edge and duplicates. The `active` operational flag is not the same concept as `lifecycle`: a temporarily unavailable production-lifecycle service need not be retired. `criticality` is a declared priority and `retired_at` records a timestamp where one exists. The domain/API interface does not have to expose every SQL column. Generated IDs are not stable seed assumptions; the foreign key lookup follows Team identity."
            },
            {
                "id": "schema",
                "title": "Create the schema and dataset in one explicit script",
                "body": "Save the following exactly as steward_schema_seed.sql in a scratch directory. Connect to the verified empty learning database and run psql -X -v ON_ERROR_STOP=1 -1 -f steward_schema_seed.sql. The -1 flag wraps a file in one transaction: an SQL error stops the script and rolls back the changes, rather than leaving a half-created baseline. The .invalid URLs are deliberate non-routable placeholders for local teaching data; no real endpoints or customer records are involved. Inspect all table names and foreign-key directions before running. Never run this file against production or any database that contains valuable data. The canonical Steward product specification defines lifecycle values development/uat/production/retired. These describe a service lifecycle stage, while Environment.kind describes an actual deployed placement; a production-stage Service should have a production Environment. Payroll API deliberately violates that requirement in the fixture so later JOIN and validation labs can find it. This fixture therefore contains a known business-policy defect for investigation, not a fully compliant production registry.",
                "language": "sql",
                "caption": "steward_schema_seed.sql — complete one-time PostgreSQL teaching fixture",
                "code": "CREATE TABLE team (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE\n);\n\nCREATE TABLE service (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE,\n  owning_team_id bigint NOT NULL REFERENCES team(id),\n  endpoint text NOT NULL,\n  active boolean NOT NULL DEFAULT true,\n  age_days integer NOT NULL DEFAULT 0 CHECK (age_days >= 0),\n  lifecycle text NOT NULL DEFAULT 'development' CHECK (lifecycle IN ('development', 'uat', 'production', 'retired')),\n  criticality text NOT NULL DEFAULT 'medium' CHECK (criticality IN ('low', 'medium', 'high', 'critical')),\n  retired_at timestamptz\n);\n\nCREATE TABLE environment (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  service_id bigint NOT NULL REFERENCES service(id),\n  name text NOT NULL,\n  kind text NOT NULL CHECK (kind IN ('development', 'uat', 'staging', 'production')),\n  UNIQUE (service_id, name)\n);\n\nCREATE TABLE service_dependency (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  source_service_id bigint NOT NULL REFERENCES service(id),\n  target_service_id bigint NOT NULL REFERENCES service(id),\n  UNIQUE (source_service_id, target_service_id),\n  CHECK (source_service_id <> target_service_id)\n);\n\nINSERT INTO team (name) VALUES ('Payments'), ('Platform'), ('Identity');\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Payments API', id, 'https://payments.example.invalid/api', true, 184, 'production', 'high'\nFROM team WHERE name = 'Payments';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Payroll API', id, 'https://payroll.example.invalid/api', true, 55, 'production', 'critical'\nFROM team WHERE name = 'Payments';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Identity API', id, 'https://identity.example.invalid/api', true, 350, 'production', 'critical'\nFROM team WHERE name = 'Identity';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Catalogue API', id, 'https://catalogue.example.invalid/api', true, 10, 'production', 'medium'\nFROM team WHERE name = 'Platform';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality, retired_at)\nSELECT 'Legacy Gateway', id, 'https://legacy.example.invalid/api', false, 1600, 'retired', 'low', now()\nFROM team WHERE name = 'Platform';\n\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Primary', 'production' FROM service\nWHERE name IN ('Payments API', 'Identity API', 'Catalogue API');\n\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Preprod', 'staging' FROM service WHERE name = 'Payments API';\n\nINSERT INTO service_dependency (source_service_id, target_service_id)\nSELECT src.id, dst.id FROM service src CROSS JOIN service dst\nWHERE src.name = 'Payments API' AND dst.name = 'Identity API';\n\nINSERT INTO service_dependency (source_service_id, target_service_id)\nSELECT src.id, dst.id FROM service src CROSS JOIN service dst\nWHERE src.name = 'Payroll API' AND dst.name = 'Payments API';"
            },
            {
                "id": "verify",
                "title": "Observe rows, missing relationships and dependency direction",
                "body": "Run the verification queries in the *same named learning database*, now in a new psql session. The first result must report Identity=1, Payments=2 and Platform=2; their order is alphabetical. The LEFT JOIN in the second query deliberately keeps Payroll API even though it has no environment, producing NULL for kind. Payments API should have two kinds. The dependency query must show Payments API depends on Identity API, and Payroll API depends on Payments API. If any count or edge differs, inspect the actual seed and stop before following another lesson; do not 'fix' the result by adding DISTINCT blindly.",
                "language": "sql",
                "caption": "verify_steward_seed.sql — three result shapes the learner can predict",
                "code": "SELECT t.name AS team, COUNT(s.id) AS services\nFROM team t LEFT JOIN service s ON s.owning_team_id = t.id\nGROUP BY t.id, t.name ORDER BY t.name;\n\nSELECT s.name, e.kind\nFROM service s LEFT JOIN environment e ON e.service_id = s.id\nWHERE s.name IN ('Payroll API', 'Payments API')\nORDER BY s.name, e.kind;\n\nSELECT src.name AS service, dst.name AS depends_on\nFROM service_dependency d\nJOIN service src ON src.id = d.source_service_id\nJOIN service dst ON dst.id = d.target_service_id\nORDER BY src.name;",
                "output": "Team counts: Identity | 1; Payments | 2; Platform | 2.\nEnvironment results: Payments API | production; Payments API | staging; Payroll API | NULL.\nDependencies: Payments API → Identity API; Payroll API → Payments API."
            },
            {
                "id": "negative",
                "title": "Make the constraint boundary fail safely",
                "body": "Attempt a separate INSERT that references owning_team_id = -1 and supplies just name and endpoint; it must fail with a foreign-key violation and leave the Service count unchanged. Then attempt to insert another Service named Payments API and observe the UNIQUE violation. Run these as separate psql -c statements with ON_ERROR_STOP enabled, not as part of your successful baseline file. The exact error wording and generated internal key names depend on PostgreSQL. This proves *these two* constraints respond to these invalid rows; it does not prove that the whole domain model has been fully validated or that transactions solve all races.",
                "language": "sql",
                "caption": "Expected failures — run one at a time only after creating the lab fixture",
                "code": "INSERT INTO service (name, owning_team_id, endpoint)\nVALUES ('Orphan', -1, 'https://orphan.example.invalid');\n\nINSERT INTO service (name, owning_team_id, endpoint)\nSELECT 'Payments API', id, 'https://duplicate.example.invalid'\nFROM team WHERE name = 'Payments';"
            },
            {
                "id": "why-next",
                "title": "Carry one coherent baseline into subsequent SQL topics",
                "body": "SELECT/UPDATE/DELETE, WHERE/ORDER BY, grouping, JOIN, EXISTS, CTE, indexing and EXPLAIN all need a reproducible data shape. This fixture supplies fields they later query: lifecycle, criticality, retired_at, endpoint, environment.kind and directed dependency keys. Those later lessons must declare any further changes they require. Before a mutation exercise, checkpoint the learning database and select the exact rows to be affected. A clean fixture supports repeatability, but a five-row table cannot establish real-world index-performance improvements; performance experiments must generate suitably sized representative data and measure cautiously."
            }
        ],
        "warning": "Database fixture commands are intentionally persistent; run only in a freshly provisioned disposable lab database. The seed script is source-reviewed but not executed against an actual PostgreSQL server by the current automated test.",
        "assignment": [
            "Create the four-table schema and seed in a clean isolated PostgreSQL learning database, saving output of the atomic -1 script run.",
            "Run the three verification queries and reconcile every row with the stated cardinalities and expected missing relationship.",
            "Trigger the negative foreign-key and duplicate-name writes in isolation and prove that the original five-service dataset remains unchanged.",
            "Explain why this fixture uses multiple relations rather than embedding team name, environments and dependencies as comma-separated Service fields.",
            "Keep the SQL files under a versioned learning checkpoint; no customer or production data."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Data Definition",
                "url": "https://www.postgresql.org/docs/current/ddl.html",
                "kind": "reference",
                "purpose": "Table, namespace, field and schema definitions."
            },
            {
                "title": "PostgreSQL — Constraints",
                "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
                "kind": "reference",
                "purpose": "Foreign keys, CHECK, UNIQUE and domain invariants."
            },
            {
                "title": "PostgreSQL — psql",
                "url": "https://www.postgresql.org/docs/current/app-psql.html",
                "kind": "reference",
                "purpose": "Understand ON_ERROR_STOP and the -1 atomic file execution flag."
            },
            {
                "title": "CMU Database Systems (Fall 2025) — Modern SQL lecture",
                "url": "https://www.youtube.com/watch?v=O5gU9NQjCAs",
                "kind": "video",
                "read": "Lecture 2; optional advanced SQL model lecture",
                "purpose": "Deepen the difference between logical declarative SQL and engine execution; course outline reviewed, recording not watched here."
            }
        ],
        "practiceObjective": "Create a coherent durable SQL fixture and verify that every later Builder SQL example has its required named fields and relationships.",
        "practiceInstructions": [
            "Confirm that the selected PostgreSQL database is dedicated, empty and not production. Do not hide duplicate tables using IF NOT EXISTS.",
            "Run the full published steward_schema_seed.sql using psql -X -v ON_ERROR_STOP=1 -1 and retain the transcript.",
            "Run verify_steward_seed.sql in a separate session and compare the exact Team counts, NULL environment and dependency edges.",
            "Trigger the missing-Team foreign key and duplicate Service failures separately; verify all five original Services remain.",
            "Mark which API/domain fields came from earlier Python core versus which became explicit database teaching assumptions, and defend active/lifecycle distinction.",
            "Write a reproducible setup note that lets a second learner create a fresh instance without copying screenshots or hardcoded IDs."
        ],
        "knowledgeCheck": "Predict the output after two inserts of the same Service name, and after joining a Service that has no Environment. Explain why a foreign key is a rule, not simply an integer column; why SQL row order needs ORDER BY; and why a five-row EXPLAIN plan cannot establish a performance win."
    },
    {
        id: "sql-crud",
        title: "SQL SELECT, INSERT, UPDATE and DELETE",
        introduction: "SQL is the language used to ask the database for facts and to change those facts deliberately. Builder-level competence means understanding the set-based effect of each statement, not just knowing four verbs.",
        outcomes: ["Read and write basic data manipulation statements.", "Predict the affected row set before mutation.", "Use RETURNING to inspect mutations.", "Avoid accidental full-table updates and deletes."],
        sections: [
            { id: "read-and-write", title: "Read first, then change deliberately", body: "`SELECT` reads rows without changing them. `INSERT` creates rows. `UPDATE` changes existing rows. `DELETE` removes rows. SQL statements operate on sets: a `WHERE` predicate can match zero, one or many rows, so the first skill is understanding which set a statement targets.", code: "SELECT id, name\nFROM service\nORDER BY id;\n\nINSERT INTO service (name, owning_team_id, endpoint)\nSELECT 'Telemetry API', id, 'https://telemetry.example.invalid/api'\nFROM team WHERE name = 'Platform'\nRETURNING id, name;\n\nUPDATE service\nSET name = 'Telemetry Service'\nWHERE name = 'Telemetry API'\nRETURNING id, name;" },
            { id: "mutation-discipline", title: "Mutation discipline", body: "Before a destructive statement, run the same predicate as a `SELECT`. In production engineering, knowing the target set is part of the change, not optional caution." },
            { id: "select-shape", title: "SELECT can project expressions, aliases and distinct values", body: "The SELECT list controls the output shape, not only which stored columns appear. Expressions can derive values and AS aliases make result meaning explicit. DISTINCT removes duplicate result rows after projection; use it because duplicate rows are semantically unwanted, not to hide an incorrect join.", code: "SELECT DISTINCT\n  owning_team_id,\n  lower(name) AS normalized_name\nFROM service;" },
            { id: "insert-many-conflict", title: "INSERT can add sets of rows and handle declared conflicts", body: "A VALUES clause can insert multiple rows. PostgreSQL's ON CONFLICT can deliberately ignore or update a row when a specified uniqueness conflict occurs. That is useful for genuinely idempotent ingestion/upsert semantics, but it should not conceal unexpected duplicates.", code: "INSERT INTO team (name)\nVALUES ('Payments'), ('Identity')\nON CONFLICT (name) DO NOTHING\nRETURNING id, name;" },
            { id: "ddl-dml", title: "Separate structure changes from data changes", body: "CREATE, ALTER and DROP change database objects/definitions and are commonly described as DDL. SELECT/INSERT/UPDATE/DELETE operate on data and are commonly grouped as DML/query operations. PostgreSQL can execute many DDL changes transactionally, but schema evolution still has compatibility and locking consequences covered later." },
        ],
        warning: "UPDATE service SET lifecycle = 'retired'; is valid SQL and may be catastrophic. Syntax correctness says nothing about business intent.",
        assignment: ["Insert Steward teams and services using explicit column lists.", "Update one service using a selective predicate and RETURNING.", "Delete only disposable test data after proving the target set with SELECT."],
        resources: [postgresDocs],
        practiceObjective: "Manipulate Steward data while proving exactly which rows each mutation affects.",
        practiceInstructions: ["Create at least five rows.", "Write a SELECT matching the rows you intend to change.", "Run UPDATE with RETURNING.", "Create and safely delete one disposable row.", "Record the before/after evidence."],
        knowledgeCheck: "1. Why should a mutation predicate be inspected as a SELECT first?\n2. What does RETURNING give you?\n3. Why is an INSERT column list preferable to relying on table column order?",
    },
    {
        "id": "filtering-ordering",
        "title": "Filtering and Ordering Queries",
        "introduction": "A registry query can return the wrong answer even though its SQL is syntactically valid. Before relying on filters and ordering for operational decisions, understand the logical pipeline: read candidate rows from a named table, evaluate one predicate per row, retain only TRUE results, project the requested columns, and order the resulting rows. The five-Service dataset from the previous lab is the reproducible reference throughout. You do not need an ORM, Django project or production environment.",
        "outcomes": [
            "Predict the exact selected rows for AND, OR, IN, parentheses, pattern and NULL predicates.",
            "Explain why SQL has TRUE, FALSE and UNKNOWN in predicate evaluation.",
            "Distinguish filtering from projection and explicit ordering, including ties and NULL sorting.",
            "Use actual Steward rows to diagnose a retired-record leak caused by operator precedence."
        ],
        "sections": [
            {
                "id": "mental-model",
                "title": "FROM, WHERE, SELECT and ORDER BY: four different jobs",
                "body": "FROM identifies the source relation; WHERE evaluates a Boolean condition for each candidate row; SELECT chooses the output columns/expressions; ORDER BY sorts the final result. SQL is declarative: this is a useful logical model, not a promise of the physical execution order selected by the PostgreSQL optimizer. On the seed fixture the five services are Payments API (active/high), Payroll API (active/critical), Identity API (active/critical), Catalogue API (active/medium) and Legacy Gateway (retired/low). Predict results with that row set before running a query. The database has no inherent stable row order: a SELECT without ORDER BY cannot promise an alphabetical or insertion-order page."
            },
            {
                "id": "truth-tables",
                "title": "A predicate is evaluated for every candidate row",
                "body": "Comparisons such as lifecycle = 'production' produce TRUE or FALSE for a non-NULL lifecycle. AND requires both operands TRUE; OR requires at least one TRUE. Without parentheses, PostgreSQL evaluates AND more tightly than OR, so A AND B OR C means (A AND B) OR C. IN ('high','critical') is a convenient membership predicate. A mistake in grouping can include records that should be excluded even when each individual comparison is correct.",
                "language": "sql",
                "caption": "filter_boolean.sql — retired-record leak and its corrected predicate",
                "code": "SELECT name FROM service\nWHERE lifecycle = 'production' AND criticality = 'critical'\n   OR name = 'Legacy Gateway'\nORDER BY name;\n\nSELECT name FROM service\nWHERE lifecycle = 'production'\n  AND (criticality = 'critical' OR name = 'Legacy Gateway')\nORDER BY name;",
                "output": "Unparenthesized: Identity API, Legacy Gateway, Payroll API.\nParenthesized: Identity API, Payroll API. Legacy Gateway is excluded because its lifecycle is retired."
            },
            {
                "id": "null-logic",
                "title": "NULL means unknown/absent data, not an ordinary value",
                "body": "Most ordinary comparisons against SQL NULL evaluate to UNKNOWN, not TRUE or FALSE. WHERE retains only TRUE rows: FALSE and UNKNOWN are both rejected. NOT UNKNOWN remains UNKNOWN. Therefore retired_at = NULL never identifies the unretired records; retired_at IS NULL does. These are SQL truth conditions, not Python None or JSON null behavior. In this fixture the four production-lifecycle services have retired_at NULL and Legacy Gateway has a retirement timestamp. No field named technical_owner exists yet; do not write a query against it until a later schema change has defined it.",
                "language": "sql",
                "caption": "filter_null.sql — wrong equality, correct IS NULL and UNKNOWN",
                "code": "SELECT name FROM service\nWHERE retired_at = NULL\nORDER BY name;\n\nSELECT name FROM service\nWHERE retired_at IS NULL\nORDER BY name;\n\nSELECT COALESCE((NULL::text = 'x')::text, 'UNKNOWN') AS equals_x,\n       COALESCE((NOT (NULL::text = 'x'))::text, 'UNKNOWN') AS not_equals_x;",
                "output": "First query: zero rows.\nSecond query: Catalogue API, Identity API, Payments API, Payroll API.\nThird query: UNKNOWN | UNKNOWN."
            },
            {
                "id": "ordering",
                "title": "Sort keys are not automatically unique",
                "body": "If you order by criticality alone, all services with the same criticality tie. PostgreSQL does not promise which tied row comes first, and LIMIT can expose that instability. Use an explicit stable tie-breaker, such as a unique id, after a meaningful primary sort key. DESC and ASC indicate direction; NULLS FIRST or NULLS LAST make missing values' placement explicit when relevant. LIMIT bounds the output but OFFSET counts skipped result rows: the earlier Web/API module showed why offset pagination can shift when rows are inserted or deleted. One execution that happens to print the same order twice does not prove stability.",
                "language": "sql",
                "caption": "filter_order.sql — deterministic top results with a unique tie-breaker",
                "code": "SELECT name, criticality\nFROM service\nWHERE lifecycle = 'production'\nORDER BY name ASC, id ASC\nLIMIT 3;",
                "output": "Catalogue API | medium\nIdentity API | critical\nPayments API | high. This is alphabetical order by name; it deliberately does not rank severity."
            },
            {
                "id": "complete",
                "title": "Predict, run, inspect and transfer",
                "body": "First predict the results of the three published query blocks. Execute each against the unchanged seed and compare the exact chosen rows. Then write a new query: all production-lifecycle Services whose name starts with 'Pay' regardless of case, ordered by name and id. Compare ILIKE 'pay%' with LIKE 'pay%' under your database collation and show why a leading wildcard can be an expensive search form on ordinary B-tree indexes. For a second independent case, find services where retired_at is present; use IS NOT NULL. Explain the difference between output order and filter semantics before moving to joins."
            }
        ],
        "warning": "Never treat NULL as a quoted string 'NULL', or infer that a query without ORDER BY has stable row order. Text sorting of criticality is lexicographic, not a business severity ranking.",
        "assignment": [
            "Predict and execute the wrong/right Boolean query and annotate why Legacy Gateway leaked.",
            "Run the NULL query; explain three-valued SQL logic and write IS NOT NULL independently.",
            "Implement two stable filter+sort queries without copying the samples, including one ILIKE pattern and one tied key.",
            "Record the seed version and queries so another learner can reproduce the selected rows."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Comparison Functions and Operators",
                "url": "https://www.postgresql.org/docs/current/functions-comparison.html",
                "kind": "reference",
                "purpose": "Precise TRUE/FALSE/NULL comparison semantics, IS NULL and distinctness."
            },
            {
                "title": "PostgreSQL — Table Expressions / WHERE",
                "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html",
                "kind": "reference",
                "purpose": "Read the documented logical FROM/WHERE/grouping pipeline."
            },
            {
                "title": "CMU 15-445 Fall 2025 — Modern SQL (lecture and notes)",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lecture #02 Modern SQL; notes and video from course schedule",
                "purpose": "Optional university-level theory for predicates, query representation and SQL semantics."
            }
        ],
        "practiceObjective": "Demonstrate correct SQL filtering and ordering with observed positive and negative cases on the unchanged Steward teaching dataset.",
        "practiceInstructions": [
            "Run filter_boolean.sql with and without parentheses; record the retired Legacy Gateway leak and explain AND/OR precedence.",
            "Run filter_null.sql and prove equality with NULL differs from IS NULL; produce an independent truth table for UNKNOWN and NOT UNKNOWN.",
            "Run filter_order.sql and explain its sort keys; avoid treating lexical criticality ordering as operational severity.",
            "Build the independent active-Pay* query using ILIKE and record exact rows; compare with a case-sensitive alternative.",
            "Demonstrate deterministic pagination ordering with id tie-breaker, noting that it does not solve offset shifts after concurrent writes."
        ],
        "knowledgeCheck": "Without copying queries: Why can (A AND B) OR C return a retired service? What does WHERE do with UNKNOWN? Why is ORDER BY criticality DESC potentially wrong for severity priority, and what makes a LIMIT page deterministic?"
    },
    {
        "id": "joins",
        "title": "INNER, LEFT and RIGHT JOINs",
        "introduction": "The Team, Service and Environment tables intentionally store separate facts. To answer 'who owns this Service?' or 'which services have no environment?' you must combine rows by explicit matching conditions. A JOIN is not an ORM feature or magical spreadsheet lookup: it forms pairs of rows according to an ON predicate, and the join type decides which unmatched records survive. Learn the actual output multiplicities before using joins inside a metric.",
        "outcomes": [
            "Trace join matching between primary/foreign-key values and predict result rows.",
            "Compare INNER, LEFT and RIGHT joins and the null-extension of unmatched rows.",
            "Explain the meaningful difference between an outer join predicate in ON versus WHERE.",
            "Diagnose one-to-many row multiplication and use aliases for directed self-relationships."
        ],
        "sections": [
            {
                "id": "keys-to-pairs",
                "title": "Trace one matching rule before naming join types",
                "body": "On the seed fixture each Service has one owning_team_id referencing Team.id. For each Service row, PostgreSQL can logically look for the Team row whose id matches. The output combines chosen columns from both matching rows; this is a conceptual model, not the physical join algorithm used by the engine. A FOREIGN KEY constrains existing references but does not automatically select a Team name; the query must ask for it. Aliases s and t distinguish similarly named id/name columns, and ORDER BY makes output reproducible.",
                "language": "sql",
                "caption": "join_owner.sql — reconstruct the authoritative owner",
                "code": "SELECT s.name AS service, t.name AS team\nFROM service AS s\nINNER JOIN team AS t ON t.id = s.owning_team_id\nORDER BY s.name;",
                "output": "Catalogue API | Platform\nIdentity API | Identity\nLegacy Gateway | Platform\nPayments API | Payments\nPayroll API | Payments"
            },
            {
                "id": "missing-pairs",
                "title": "INNER versus LEFT: decide whether missing relationships stay visible",
                "body": "The fixture's Payroll API is intentionally recorded in the production lifecycle without a production Environment, violating Steward's product readiness rule; the missing deployment is deliberately retained as a diagnostic negative case, not a valid release record. The fixture's Payroll API has no row in Environment. An INNER JOIN between Service and Environment omits Payroll altogether; a LEFT JOIN returns the Service row and fills the absent Environment columns with SQL NULL. Conversely, Payments API has two Environment rows (production and staging), so a one-to-many join produces TWO result rows for Payments. This is not duplication in the table—it is the number of matching pairs in the join result. Predict 3 rows for Payroll/Payments under LEFT JOIN and 2 rows under INNER JOIN.",
                "language": "sql",
                "caption": "join_optional.sql — keep Payroll and expose two Payments environments",
                "code": "SELECT s.name AS service, e.kind AS environment_kind\nFROM service s\nLEFT JOIN environment e ON e.service_id = s.id\nWHERE s.name IN ('Payments API', 'Payroll API')\nORDER BY s.name, e.kind NULLS LAST;",
                "output": "Payments API | production\nPayments API | staging\nPayroll API | NULL"
            },
            {
                "id": "on-versus-where",
                "title": "A subtle failure: a WHERE filter can undo an outer join",
                "body": "LEFT JOIN performs matching and null-extension before the final WHERE filter. Put the production-only match condition in ON and every selected Service survives; put e.kind = 'production' in WHERE and Payroll's null-extended row fails the predicate, disappearing from the result. Moving filters is not a harmless formatting change for outer joins. Use this example to debug reports that 'lost' services with missing deployments.",
                "language": "sql",
                "caption": "join_on_where.sql — two different results from one predicate",
                "code": "SELECT s.name, e.kind\nFROM service s\nLEFT JOIN environment e\n  ON e.service_id = s.id AND e.kind = 'production'\nWHERE s.name IN ('Payments API', 'Payroll API')\nORDER BY s.name;\n\nSELECT s.name, e.kind\nFROM service s\nLEFT JOIN environment e ON e.service_id = s.id\nWHERE s.name IN ('Payments API', 'Payroll API')\n  AND e.kind = 'production'\nORDER BY s.name;",
                "output": "Filter in ON: Payments API | production; Payroll API | NULL.\nFilter in WHERE: Payments API | production only."
            },
            {
                "id": "right-full",
                "title": "RIGHT JOIN and FULL JOIN are alternate preservation choices",
                "body": "RIGHT JOIN preserves every row from the table to its right, filling unmatched left values with NULL; it is the mirror of LEFT JOIN. Swap table positions and rewrite most straightforward RIGHT JOIN queries as LEFT JOIN without changing preservation semantics. FULL JOIN retains unmatched rows from both sides. CROSS JOIN creates all combinations even without a matching relationship: five Services cross three Teams would create fifteen pairs; use CROSS JOIN intentionally, not by forgetting ON. A NATURAL JOIN silently chooses equally named columns as matching keys and can change meaning when schemas evolve; explicit ON is safer for teaching and review.",
                "language": "sql",
                "caption": "join_right.sql — RIGHT JOIN rewritten as the equivalent LEFT JOIN",
                "code": "SELECT s.name AS service, e.kind\nFROM environment e\nRIGHT JOIN service s ON s.id = e.service_id\nWHERE s.name = 'Payroll API';\n\nSELECT s.name AS service, e.kind\nFROM service s\nLEFT JOIN environment e ON e.service_id = s.id\nWHERE s.name = 'Payroll API';",
                "output": "Both queries: Payroll API | NULL."
            },
            {
                "id": "self-join",
                "title": "When one table plays two roles: directed dependencies",
                "body": "A ServiceDependency has source_service_id and target_service_id. Both columns reference Service, so join the Service relation twice under different aliases: src means 'dependent service' and dst means 'the service it depends on'. Without two roles, a query cannot display human-readable names for both ends. On the fixture, Payments API depends on Identity API, and Payroll API depends on Payments API; direction matters when diagnosing impact.",
                "language": "sql",
                "caption": "join_dependencies.sql — decode both ends of a directed edge",
                "code": "SELECT src.name AS service, dst.name AS depends_on\nFROM service_dependency d\nJOIN service src ON src.id = d.source_service_id\nJOIN service dst ON dst.id = d.target_service_id\nORDER BY src.name;",
                "output": "Payments API | Identity API\nPayroll API | Payments API"
            },
            {
                "id": "transfer",
                "title": "Predict cardinality before using a JOIN in a count",
                "body": "Before the next Aggregation lesson, prove three row counts on the same five-service fixture: Service alone has 5 rows; Service LEFT JOIN Environment has 6 rows because Payments has two environments and Payroll/Legacy have none; Service INNER JOIN Environment has 4 rows because only Payments, Identity and Catalogue have environments. Your actual fixture has four Environment rows (Payments 2, Identity 1, Catalogue 1). A report that counts joined rows instead of Service identities may inflate totals. Write the joined row list first; never apply DISTINCT blindly to hide a model error."
            }
        ],
        "warning": "An INNER JOIN can hide rows with missing relationships. An outer join followed by a WHERE filter on the optional side can accidentally do the same. JOIN row multiplication is expected and must be explained before aggregation.",
        "assignment": [
            "Predict and run the ownership and optional-environment queries; annotate which rows are paired and which are null-extended.",
            "Execute both ON/WHERE variants, name the boundary where Payroll disappears, and correct a hypothetical broken report.",
            "Rewrite the RIGHT JOIN example as LEFT JOIN, and explain which table's rows are preserved.",
            "Execute the directed dependency query and explain why joining Service once is insufficient.",
            "Compute total row counts of a left and inner join without copying output; record what one row means."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Joins Between Tables",
                "url": "https://www.postgresql.org/docs/current/tutorial-join.html",
                "kind": "reference",
                "purpose": "First-principles JOIN examples and unmatched-row behavior."
            },
            {
                "title": "PostgreSQL — Table Expressions / Joined Tables",
                "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html",
                "kind": "reference",
                "purpose": "Authoritative INNER/LEFT/RIGHT/FULL semantics and ON-versus-WHERE counterexample."
            },
            {
                "title": "CMU 15-445 Fall 2025 — Join Algorithms",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lecture #12 and its notes/video; optional after learning logical JOIN semantics",
                "purpose": "Deepen the difference between logical joins and physical nested-loop, hash, and sort-merge algorithms, which the Builder lesson does not implement."
            }
        ],
        "practiceObjective": "Trace and execute the five named JOIN experiments with correct cardinalities and intentional missing-relationship diagnosis.",
        "practiceInstructions": [
            "Run join_owner.sql; identify each Service's authoritative Team using its foreign key.",
            "Run join_optional.sql and explain why Payments appears twice but Payroll remains as a NULL row.",
            "Run join_on_where.sql and show exactly why filtering e.kind in WHERE removes Payroll.",
            "Run join_right.sql and explain preservation symmetry rather than claiming RIGHT JOIN is always needed.",
            "Run join_dependencies.sql; trace each directed edge.",
            "Independently write queries counting service rows, LEFT JOIN rows and INNER JOIN rows. Compare with 5, 6 and 4 on the unmodified seed."
        ],
        "knowledgeCheck": "How can LEFT JOIN create more rows than exist in the left table? Why does a WHERE filter on an optional joined field remove an unmatched row? What makes two Service aliases necessary in a dependency query, and when does a RIGHT JOIN preserve different rows than a LEFT JOIN?"
    },
    {
        "id": "aggregation",
        "title": "Aggregation, GROUP BY and HAVING",
        "introduction": "The previous JOIN experiments proved that a result row is not always a business entity: Payments API produced two rows because it has two Environments. Aggregation magnifies that difference. A database can correctly count rows and still answer the wrong business question. Learn the grouping grain, WHERE-versus-HAVING stage and NULL-aware counting before publishing dashboard numbers.",
        "outcomes": [
            "Predict aggregate output from the seed fixture and choose the grouping grain.",
            "Explain COUNT(*) versus COUNT(nullable expression) on an outer join.",
            "Distinguish WHERE before GROUP BY from HAVING after grouping.",
            "Reproduce and correct a metric inflated by joining a one-to-many relationship.",
            "Assess when COUNT(DISTINCT) or preaggregation is the better query shape."
        ],
        "sections": [
            {
                "id": "count-grain",
                "title": "A count answers a question about a specific population",
                "body": "COUNT(*) counts input rows, not abstract Services. COUNT(s.id) counts non-NULL matched Service identities and therefore returns zero for a Team with no Services under a LEFT JOIN. COUNT(*) in that same zero-Service team still counts the one null-extended Team row and incorrectly yields 1 if you call it service_count. Decide the *grain* of the report (one Team per result row) and the *population* (Services, not joined Environment records) before writing SQL. The baseline has Teams Identity=1, Payments=2, Platform=2; add a hypothetical empty Team only with a read-only VALUES/UNION ALL CTE, never silently mutate the shared fixture.",
                "language": "sql",
                "caption": "aggregate_team.sql — group at Team identity with a valid Service count",
                "code": "SELECT t.name AS team, COUNT(s.id) AS service_count\nFROM team t\nLEFT JOIN service s ON s.owning_team_id = t.id\nGROUP BY t.id, t.name\nORDER BY t.name;",
                "output": "Identity | 1\nPayments | 2\nPlatform | 2"
            },
            {
                "id": "zero-case",
                "title": "Test the zero-related-row case without changing the dataset",
                "body": "To see why COUNT(*) and COUNT(s.id) differ, use VALUES to provide one *virtual row* named Unassigned with an impossible Team id -999. VALUES makes a read-only row source: (VALUES (-999, 'Unassigned')) AS t(id, name) gives its two columns meaningful names. LEFT JOIN creates one null-extended result; COUNT(*) returns 1, while COUNT(s.id) returns 0. No table is created or modified. The later CTE lesson will teach how to name longer query stages; this example needs no CTE.",
                "language": "sql",
                "caption": "aggregate_zero.sql — count joined rows versus real Service identities",
                "code": "SELECT t.name, COUNT(*) AS joined_rows, COUNT(s.id) AS service_count\nFROM (VALUES (-999::bigint, 'Unassigned'::text)) AS t(id, name)\nLEFT JOIN service s ON s.owning_team_id = t.id\nGROUP BY t.name\nORDER BY t.name;",
                "output": "Unassigned | 1 | 0"
            },
            {
                "id": "where-having",
                "title": "Filter rows before grouping or groups after grouping",
                "body": "The meaningful logical sequence is FROM/JOIN, WHERE (filter source rows), GROUP BY (form groups), aggregates (calculate a summary), HAVING (keep groups), and finally projection/order. WHERE cannot reference COUNT(s.id) in the same grouping query: the count does not exist until after grouping. HAVING COUNT(s.id) >= 2 is a group-level condition. To count only production-stage Services, put s.lifecycle = 'production' in the JOIN's ON clause when you must preserve empty Teams; putting it in WHERE after LEFT JOIN can eliminate zero-count teams. On this seed Payments has 2 production-stage Services, Platform 1, Identity 1.",
                "language": "sql",
                "caption": "aggregate_having.sql — filter active matches then threshold groups",
                "code": "SELECT t.name, COUNT(s.id) AS production_services\nFROM team t\nLEFT JOIN service s\n  ON s.owning_team_id = t.id AND s.lifecycle = 'production'\nGROUP BY t.id, t.name\nHAVING COUNT(s.id) >= 2\nORDER BY t.name;",
                "output": "Payments | 2"
            },
            {
                "id": "inflation",
                "title": "A technically correct COUNT can be a false dashboard metric",
                "body": "Now join each Service to its Environments as well as its Team, then COUNT(s.id). Payments API has two Environment rows, so the Payments Team's two Services contribute THREE joined rows: two Payments API and one Payroll API null-extended row. That makes the displayed Payments service count 3 even though exactly two distinct Services exist. COUNT(DISTINCT s.id) corrects the *identity count*; another robust approach is to aggregate Service at Team grain before joining unrelated one-to-many tables. DISTINCT may not be correct for SUM(some_amount), because two different services can legitimately have equal amounts. Show the inflated source row set before choosing a fix.",
                "language": "sql",
                "caption": "aggregate_inflation.sql — observe overcount and correctly count Service identities",
                "code": "SELECT t.name AS team,\n       COUNT(s.id) AS wrong_count,\n       COUNT(DISTINCT s.id) AS service_count\nFROM team t\nLEFT JOIN service s ON s.owning_team_id = t.id\nLEFT JOIN environment e ON e.service_id = s.id\nGROUP BY t.id, t.name\nORDER BY t.name;",
                "output": "Identity | 1 | 1\nPayments | 3 | 2\nPlatform | 2 | 2"
            },
            {
                "id": "filter-and-nulls",
                "title": "COUNT, FILTER and NULL choose different populations",
                "body": "COUNT(*) counts all Service rows (5); COUNT(retired_at) counts rows whose retirement timestamp is not NULL (1). PostgreSQL FILTER (WHERE criticality='critical') calculates only the matching subset inside that aggregate without discarding noncritical rows from other aggregates. SUM, AVG, MIN and MAX generally ignore NULL inputs and may return NULL when no input values remain. Always label dashboard metrics by exactly which rows entered the computation.",
                "language": "sql",
                "caption": "aggregate_nulls.sql — define two populations in one report",
                "code": "SELECT COUNT(*) AS all_services,\n       COUNT(retired_at) AS retired_with_timestamp,\n       COUNT(*) FILTER (WHERE criticality = 'critical') AS critical_services\nFROM service;",
                "output": "5 | 1 | 2"
            },
            {
                "id": "handoff",
                "title": "Independent verification: predict before calculating",
                "body": "With no further insertions, calculate the expected aggregates on paper, run each published query, and reconcile every discrepancy. Then write your own query returning one row per Team with total Services, production-stage Services and production Environment count. Decide whether production Environment count means placements or Services with a production deployment: one Service could have more than one production placement, and the two business questions are different. Explicitly separate joined rows from Service identities. SQL can answer either question; only the engineering requirement determines which is right."
            }
        ],
        "warning": "Never add DISTINCT to a dashboard query simply to make a number look plausible. First name the grain and inspect intermediate joined rows; a wrong metric can be faithfully computed from an incorrectly shaped input.",
        "assignment": [
            "Predict all published aggregate outputs from the fixture before running them.",
            "Run aggregate_zero.sql and explain why COUNT(*) returns 1 for the synthetic empty Team.",
            "Run aggregate_inflation.sql, identify the doubled Payments API row and justify COUNT(DISTINCT s.id) for this specific metric.",
            "Compare WHERE and HAVING using the active-service threshold; preserve zero-service teams deliberately.",
            "Write an independent grouped report with three precise metrics and documented business meaning."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Aggregate Functions Tutorial",
                "url": "https://www.postgresql.org/docs/current/tutorial-agg.html",
                "kind": "reference",
                "purpose": "Worked introduction to COUNT/GROUP BY/HAVING and why aggregates cannot appear in WHERE."
            },
            {
                "title": "PostgreSQL — Table Expressions / GROUP BY and HAVING",
                "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html",
                "kind": "reference",
                "purpose": "Authoritative ordering of WHERE, GROUP BY and HAVING transformations."
            },
            {
                "title": "CMU 15-445 Fall 2025 — Sorting and Aggregations Algorithms",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lecture #11 and notes/video; optional advanced mechanism study",
                "purpose": "Extend logical aggregation to physical database algorithms and their trade-offs."
            }
        ],
        "practiceObjective": "Use actual PostgreSQL grouped results to disprove two misleading counts and implement a report with an explicitly chosen grain.",
        "practiceInstructions": [
            "Run aggregate_team.sql and verify Identity=1, Payments=2, Platform=2.",
            "Run aggregate_zero.sql; explain the exact difference between COUNT(*) and COUNT(s.id) for a team with no service.",
            "Run aggregate_having.sql and prove that the group threshold is applied after matching production-stage Services.",
            "Run aggregate_inflation.sql and inspect the Payments join input before choosing DISTINCT or preaggregation.",
            "Run aggregate_nulls.sql; compare COUNT(*), COUNT(nonnull retired_at), and FILTER count against the fixture.",
            "Produce an independent grouped report with totals, active counts, production deployments and clear labels."
        ],
        "knowledgeCheck": "Why can COUNT(*) over a LEFT JOIN show 1 for a team with no services? Why is COUNT(DISTINCT service.id) appropriate for one metric but not a universal fix for SUM? When does a filter belong in JOIN ON instead of WHERE, and when is HAVING required?"
    },
    {
        "id": "subqueries",
        "title": "Subqueries",
        "introduction": "A subquery is a SELECT whose result is used inside another SQL query. It can supply a single value, a set of candidate values, or an existence test. The crucial beginner skill is predicting what *shape* the inner query returns and what the outer query does with that shape. Use the existing Team, Service and Environment fixture; none of the examples creates tables or requires an ORM.",
        "outcomes": [
            "Distinguish scalar, IN and EXISTS subquery results.",
            "Explain correlation: a reference to the current outer row inside the inner query.",
            "Predict EXISTS versus JOIN result cardinality and why EXISTS does not duplicate the outer Service row.",
            "Diagnose NULL poisoning in NOT IN and implement a correctly correlated NOT EXISTS alternative."
        ],
        "sections": [
            {
                "id": "three-shapes",
                "title": "Ask what the inner query returns before composing SQL",
                "body": "A scalar subquery returns one column in at most one row and can be used as one value; if it produces more than one row in a scalar context PostgreSQL raises an error. IN expects one comparable column of values; EXISTS only asks whether the inner result has any row at all. A subquery in FROM produces a derived table with rows and columns. None of these forms guarantees a faster physical execution by syntax alone: PostgreSQL's planner may transform an EXISTS into a semi-join or choose other access paths. We are deciding the logical question first, not guessing performance."
            },
            {
                "id": "in",
                "title": "IN expresses membership in a computed set",
                "body": "Suppose we want Services owned by the Payments Team. An inner query returns the Team's id, and the outer query selects Services with owning_team_id in that set. Under the fixture this returns Payments API and Payroll API. You could write the same request using JOIN, but IN avoids bringing Team columns into the output when you only need membership. This example returns exactly one Team id because Team.name is unique; if the name matched multiple Teams, IN still asks whether each Service owner appears among the values.",
                "language": "sql",
                "caption": "subquery_in.sql — derive a set of owning Team identities",
                "code": "SELECT s.name\nFROM service s\nWHERE s.owning_team_id IN (\n  SELECT t.id FROM team t WHERE t.name = 'Payments'\n)\nORDER BY s.name;",
                "output": "Payments API\nPayroll API"
            },
            {
                "id": "exists",
                "title": "EXISTS asks a yes/no question for each outer Service",
                "body": "Which Services have at least one production Environment? The inner SELECT refers to the current Service row as s.id, so it is *correlated*. EXISTS returns TRUE for that outer row if any matching Environment exists; SELECT 1 is a conventional placeholder, because EXISTS does not need the Environment's output columns. With the seed, Catalogue API, Identity API and Payments API qualify. Unlike a plain join to environments, EXISTS never expands a single outer Service into multiple output rows; it tests existence rather than returning matched pairs.",
                "language": "sql",
                "caption": "subquery_exists.sql — correlate an existence test to one Service",
                "code": "SELECT s.name\nFROM service s\nWHERE EXISTS (\n  SELECT 1 FROM environment e\n  WHERE e.service_id = s.id AND e.kind = 'production'\n)\nORDER BY s.name;",
                "output": "Catalogue API\nIdentity API\nPayments API"
            },
            {
                "id": "scalar",
                "title": "Scalar subqueries yield one value for one outer row",
                "body": "A correlated SELECT COUNT(*) always returns a single count row for each Team, including zero when there are no matches. This makes an understandable comparison with JOIN + GROUP BY from the previous lesson, though it is not a blanket performance recommendation. If the subquery instead returned several service names in scalar context, PostgreSQL would reject it; use IN, EXISTS, ARRAY aggregation or a JOIN according to the intended output shape.",
                "language": "sql",
                "caption": "subquery_scalar.sql — one count per Team",
                "code": "SELECT t.name,\n       (SELECT COUNT(*) FROM service s WHERE s.owning_team_id = t.id) AS services\nFROM team t\nORDER BY t.name;",
                "output": "Identity | 1\nPayments | 2\nPlatform | 2"
            },
            {
                "id": "negative",
                "title": "NOT IN is dangerous when the candidate set includes NULL",
                "body": "This counterexample does not touch the Steward tables. The VALUES expressions create tiny read-only row sources and AS c(x)/AS b(y) name their columns. The inner values are 1 and NULL. For x=2, '2 NOT IN (1,NULL)' is not TRUE: it is UNKNOWN because 2 might equal the missing value. WHERE excludes UNKNOWN, so the NOT IN query returns no rows. A correctly correlated NOT EXISTS asks whether a real matching row exists and returns 2 and 3. Do not blindly replace every NOT IN with NOT EXISTS without specifying the matching columns and NULL policy; understand the semantics first.",
                "language": "sql",
                "caption": "subquery_not_in.sql — the NULL trap and a safe anti-existence test",
                "code": "SELECT c.x FROM (VALUES (1),(2),(3)) AS c(x)\nWHERE c.x NOT IN (\n  SELECT b.y FROM (VALUES (1),(NULL)) AS b(y)\n)\nORDER BY c.x;\n\nSELECT c.x FROM (VALUES (1),(2),(3)) AS c(x)\nWHERE NOT EXISTS (\n  SELECT 1 FROM (VALUES (1),(NULL)) AS b(y)\n  WHERE b.y = c.x\n)\nORDER BY c.x;",
                "output": "NOT IN query: zero rows because the blocked set contains NULL.\nNOT EXISTS query: 2, 3."
            },
            {
                "id": "transfer",
                "title": "Prove equivalence before arguing optimization",
                "body": "Now answer a new question: which Services do **not** have a production Environment? Use correlated NOT EXISTS; predict Payroll API and Legacy Gateway (and any other Service without a production placement) before running. On this fixture Payroll API and Legacy Gateway do not have environments, while the others do, so those two names are correct. Then write an equivalent LEFT JOIN ... ON production + WHERE e.service_id IS NULL query and explain why optional JOIN filters belong in ON for that pattern. Compare plans with EXPLAIN if you have a real PostgreSQL lab but do not claim one form is invariably faster."
            }
        ],
        "warning": "NOT IN with nullable subquery values and an uncorrelated NOT EXISTS are common logic defects. A syntactically valid query can silently omit every expected row.",
        "assignment": [
            "Predict and run the IN, EXISTS and scalar examples on the unchanged seed.",
            "Execute the isolated NOT IN/NOT EXISTS negative case and explain each TRUE/FALSE/UNKNOWN outcome.",
            "Write a new NOT EXISTS query for Services without production and an equivalent LEFT JOIN anti-join; verify identical results.",
            "Compare logical result cardinality and write a plan-inspection note without asserting the optimizer always executes subqueries literally."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Subquery Expressions",
                "url": "https://www.postgresql.org/docs/current/functions-subquery.html",
                "kind": "reference",
                "purpose": "Authoritative EXISTS, IN, NOT IN and NULL behavior."
            },
            {
                "title": "PostgreSQL — Table Expressions",
                "url": "https://www.postgresql.org/docs/current/queries-table-expressions.html",
                "kind": "reference",
                "purpose": "Derived tables, subqueries and the distinction between JOIN and existence tests."
            },
            {
                "title": "CMU 15-445 Fall 2025 — Modern SQL",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lecture #02 Modern SQL notes/video (optional)",
                "purpose": "Extend the mental model from nested SQL syntax to relational transformations."
            }
        ],
        "practiceObjective": "Choose IN, EXISTS, scalar or anti-existence subqueries based on result shape and prove the NULL trap with executable evidence.",
        "practiceInstructions": [
            "Run the three subquery examples and explain the exact output shape of the inner SELECT for each.",
            "Execute subquery_not_in.sql and show why the first query returns no rows but the correctly correlated NOT EXISTS returns 2 and 3.",
            "Write independent anti-existence and LEFT anti-join queries for Services without production; predict and compare results.",
            "Record the difference between logical row count and the physical strategy chosen by EXPLAIN.",
            "Review NULL policy and the intended uniqueness/cardinality before accepting an equivalent rewrite."
        ],
        "knowledgeCheck": "If a subquery yields three rows, can it be a scalar expression? Why does EXISTS ignore SELECT 1 values? What does NULL do to NOT IN, and why can EXISTS avoid outer-row duplication?"
    },
    {
        "id": "ctes",
        "title": "Common Table Expressions",
        "introduction": "As queries grow, repeatedly nested expressions become hard to inspect. WITH gives intermediate SELECT results names so that a query can be read and verified in stages. The name is only scoped to the single statement: it is not a persistent table, a migration or a guaranteed optimization fence. Recursive CTEs can also follow graph edges using a seed step and a repeat step, but only when termination and cycles are deliberately handled.",
        "outcomes": [
            "Write a nonrecursive CTE as a staged query and inspect each stage.",
            "Distinguish the temporary query result of WITH from persistent and TEMP PostgreSQL tables.",
            "Use WITH RECURSIVE to traverse directed Steward dependencies with a cycle guard.",
            "Explain why CTE materialization or inlining is planner dependent, not an unconditional performance claim."
        ],
        "sections": [
            {
                "id": "stages",
                "title": "Name one question, then name its intermediate answers",
                "body": "We want the number of outgoing dependencies for every high-or-critical Service. First priority_services identifies the three Services Payments API (high), Payroll API (critical) and Identity API (critical). Next dependency_counts groups directed edges by source_service_id. The final SELECT preserves Services with zero outgoing dependencies using LEFT JOIN and COALESCE, which changes NULL aggregate absence into zero. This query is readable because each named result has a precise role, not because more lines are automatically better.",
                "language": "sql",
                "caption": "cte_priority.sql — inspectable two-stage priority dependency count",
                "code": "WITH priority_services AS (\n  SELECT id, name FROM service\n  WHERE criticality IN ('high', 'critical')\n),\ndependency_counts AS (\n  SELECT source_service_id, COUNT(*) AS outgoing\n  FROM service_dependency\n  GROUP BY source_service_id\n)\nSELECT p.name, COALESCE(d.outgoing, 0) AS outgoing\nFROM priority_services p\nLEFT JOIN dependency_counts d ON d.source_service_id = p.id\nORDER BY p.name;",
                "output": "Identity API | 0\nPayments API | 1\nPayroll API | 1"
            },
            {
                "id": "inspect",
                "title": "Validate stages separately before trusting the final result",
                "body": "Run SELECT id,name FROM service WHERE criticality IN ('high','critical') ORDER BY name; as the first stage. Then separately run SELECT source_service_id, COUNT(*) FROM service_dependency GROUP BY source_service_id ORDER BY source_service_id; as the second stage. Finally execute cte_priority.sql and reconcile every edge with the seed. A CTE does not promise PostgreSQL actually materializes each stage: modern PostgreSQL may inline nonrecursive, side-effect-free CTEs as part of planning. Explain what the logical names mean without inventing a physical plan."
            },
            {
                "id": "recursive",
                "title": "A recursive CTE has an anchor and a repeated transition",
                "body": "A Service depends on another Service, which may in turn depend on another. For Payroll API, the first row is the starting Service at depth 0. The recursive member follows source → target dependency edges and increments depth. Repeat until there is no unseen next Service. The path bigint[] contains visited Service IDs; NOT (next id = ANY(path)) prevents revisiting a node in a cycle. On the fixture the chain is Payroll API → Payments API → Identity API, with depths 0, 1 and 2. This is a small graph traversal, not a claim that PostgreSQL uses any particular search ordering. The final ORDER BY makes presentation deterministic.",
                "language": "sql",
                "caption": "cte_recursive.sql — bounded dependency walk with visited-node guard",
                "code": "WITH RECURSIVE walk(service_id, depth, path) AS (\n  SELECT id, 0, ARRAY[id]\n  FROM service WHERE name = 'Payroll API'\n  UNION ALL\n  SELECT d.target_service_id, w.depth + 1,\n         w.path || d.target_service_id\n  FROM walk w\n  JOIN service_dependency d ON d.source_service_id = w.service_id\n  WHERE NOT (d.target_service_id = ANY(w.path))\n)\nSELECT s.name, w.depth\nFROM walk w JOIN service s ON s.id = w.service_id\nORDER BY w.depth, s.name;",
                "output": "Payroll API | 0\nPayments API | 1\nIdentity API | 2"
            },
            {
                "id": "cycle-case",
                "title": "Prove cycle safety without altering the shared fixture",
                "body": "A self-reference CHECK only prohibits A → A; it does not prohibit A → B → A. The following isolated read-only query creates a two-edge conceptual cycle using VALUES, then uses the same visited-node technique. Without its WHERE condition the recursion would repeat A and B indefinitely unless interrupted by an external limit; do not execute the unsafe version. With cycle protection it stops at A depth 0, B depth 1. This makes termination an observable part of the exercise rather than a footnote.",
                "language": "sql",
                "caption": "cte_cycle.sql — read-only cyclic graph and explicit termination",
                "code": "WITH RECURSIVE edges(src, dst) AS (\n  VALUES ('A'::text, 'B'::text), ('B'::text, 'A'::text)\n),\nwalk(node, path, depth) AS (\n  SELECT 'A'::text, ARRAY['A'::text], 0\n  UNION ALL\n  SELECT e.dst, w.path || e.dst, w.depth + 1\n  FROM walk w\n  JOIN edges e ON e.src = w.node\n  WHERE NOT (e.dst = ANY(w.path))\n)\nSELECT node, depth FROM walk ORDER BY depth;",
                "output": "A | 0\nB | 1"
            },
            {
                "id": "tradeoffs",
                "title": "WITH is neither a stored view nor always faster SQL",
                "body": "A CTE's scope is one statement; a VIEW is a named persistent database query definition, while a MATERIALIZED VIEW stores a computed result that must be refreshed. A TEMP TABLE is a real table visible to one session. A nonrecursive SELECT CTE may be inlined by PostgreSQL; explicit MATERIALIZED/NOT MATERIALIZED options can affect planning under certain conditions. Avoid such tuning until you inspect EXPLAIN and have a representative performance need. Use WITH for a genuinely staged question, not to bury a one-line predicate inside unnecessary names."
            },
            {
                "id": "independent",
                "title": "Extend the traversal without hiding domain assumptions",
                "body": "Build a report of all direct outgoing dependencies for each critical Service and compare it with the recursive closure of Payroll API. If the product asks for unique impacted Services, a graph can have multiple distinct paths to the same node; the simple recursive example records paths and may produce repeated nodes across separate paths. State how the business question handles cycles, paths, deduplication and maximum depth before turning a teaching example into production code."
            }
        ],
        "warning": "An unguarded recursive UNION ALL can loop indefinitely on cyclic data. Do not experiment with unsafe recursive queries or alter production dependency edges. CTE syntax alone says nothing about the actual query plan or performance.",
        "assignment": [
            "Execute cte_priority.sql and verify Identity 0, Payments 1 and Payroll 1 outgoing dependencies.",
            "Execute cte_recursive.sql and draw Payroll → Payments → Identity with depths 0,1,2.",
            "Execute cte_cycle.sql against its isolated VALUES graph and explain exactly why it terminates.",
            "Write one new nonrecursive CTE that makes a two-stage registry query clearer, and justify why you chose it over a simpler SELECT.",
            "Explain the trade-offs between CTE, VIEW, materialized view and session TEMP table without confusing their lifetimes."
        ],
        "resources": [
            {
                "title": "PostgreSQL — WITH Queries (Common Table Expressions)",
                "url": "https://www.postgresql.org/docs/current/queries-with.html",
                "kind": "reference",
                "purpose": "Nonrecursive composition, recursion evaluation and materialization boundaries."
            },
            {
                "title": "PostgreSQL — Subquery Expressions",
                "url": "https://www.postgresql.org/docs/current/functions-subquery.html",
                "kind": "reference",
                "purpose": "Distinguish named CTE stages from nested scalar/existence queries."
            },
            {
                "title": "CMU 15-445 Fall 2025 — Modern SQL",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lecture #02 and notes, optional",
                "purpose": "University-level context for declarative query representation and staged reasoning."
            }
        ],
        "practiceObjective": "Use published CTE queries to show staged reporting, a terminating directed dependency walk and a separate cycle-negative example.",
        "practiceInstructions": [
            "Execute the two-stage priority dependency query and reconcile the three expected counts.",
            "Inspect each nonrecursive stage alone and explain why a named CTE is helpful here.",
            "Run the recursive Payroll chain and use the depth/path to explain the anchor and repeated step.",
            "Run the read-only two-node cycle example and demonstrate why the visited-node guard stops recursion.",
            "Write an independent WITH query with a justified stage decomposition and a clear expected outcome.",
            "Document why query readability does not prove physical materialization or performance improvement."
        ],
        "knowledgeCheck": "What survives after a WITH statement ends? Why does recursive UNION ALL need a termination guard on graph cycles? What does the visited array prevent, and what are the differences between a query CTE and a persistent view?"
    },
    {
        "id": "production-readiness-invariant",
        "title": "Production Readiness: A Cross-Table Business Invariant",
        "introduction": "A database can satisfy every declared foreign key and still contain a Service that violates Steward's release-readiness rule. In the canonical product, a production-stage Service must have at least one production Environment. The five-Service SQL teaching fixture deliberately includes Payroll API with lifecycle production but no production Environment: this is negative test data, not a valid production registry. Diagnose, temporarily repair and reason about the invariant.",
        "outcomes": [
            "Translate a written business invariant into a correlated NOT EXISTS query.",
            "Explain the difference between a lifecycle stage and a registered deployment.",
            "Prove a one-direction foreign key cannot require every qualifying parent to have a matching child.",
            "Demonstrate a reversible repair and specify which authorized API operations must protect the invariant."
        ],
        "sections": [
            {
                "id": "two-dimensions",
                "title": "Production stage and production deployment are distinct facts",
                "body": "Service.lifecycle describes development, UAT, production or retired stage. Environment.kind describes a deployed placement. The same word production occurs in both, but one does not imply the other. If a Service claims production lifecycle without a production Environment, Steward's product rule is broken. In the fixture Payroll API intentionally demonstrates this condition; do not call the fixture production-ready."
            },
            {
                "id": "detect",
                "title": "Find the missing child without false positives",
                "body": "For every Service in the production stage, the correlated NOT EXISTS checks whether at least one production Environment exists. It returns Payroll API on the teaching seed. A LEFT JOIN followed by e.kind <> 'production' is wrong: it could flag a staging row even when another production row exists. Ask which absence the business rule really cares about.",
                "language": "sql",
                "caption": "readiness_missing.sql — detect production-stage Services without production deployment",
                "code": "SELECT s.name\nFROM service s\nWHERE s.lifecycle='production'\n  AND NOT EXISTS (\n    SELECT 1 FROM environment e\n    WHERE e.service_id=s.id AND e.kind='production'\n  )\nORDER BY s.name;",
                "output": "Payroll API"
            },
            {
                "id": "reversible",
                "title": "Repair the evidence in a transaction, then roll it back",
                "body": "Insert Payroll's missing production Environment inside BEGIN/ROLLBACK, count remaining violations, and verify zero inside the transaction. ROLLBACK keeps the seed unchanged so future lessons can reproduce the negative case. A real release operation would COMMIT a valid state; this reversible learning demonstration is not a production release procedure.",
                "language": "sql",
                "caption": "readiness_repair.sql — reversible cross-table invariant repair",
                "code": "BEGIN;\nINSERT INTO environment(service_id,name,kind)\nSELECT id,'Primary','production'\nFROM service WHERE name='Payroll API';\nSELECT count(*) AS violations\nFROM service s\nWHERE s.lifecycle='production'\n  AND NOT EXISTS (\n    SELECT 1 FROM environment e\n    WHERE e.service_id=s.id AND e.kind='production'\n  );\nROLLBACK;",
                "output": "INSERT 0 1; violations 0; ROLLBACK; rerunning readiness_missing.sql returns Payroll API."
            },
            {
                "id": "foreign-key",
                "title": "A foreign key only enforces the direction you declared",
                "body": "Environment.service_id REFERENCES service(id) prevents an Environment from pointing to a missing Service. It does not require every Service to have an Environment, even when its lifecycle is production. A simple Service CHECK cannot generally query another table. The authorized application/domain transition may need to create or validate a deployment in one transaction; triggers/stored procedures may offer stronger centralized enforcement at a complexity cost. Every update path—and removal of the last production deployment—must preserve the rule."
            },
            {
                "id": "transfer",
                "title": "Convert the SQL diagnosis into two negative API tests",
                "body": "Test a request setting lifecycle from UAT to production with no production Environment. The API may reject with a documented conflict or atomically create a valid deployment under authorization, but it must not silently commit incomplete state. Also test deletion of the last production Environment from an already production-stage Service. Changing the route shape cannot bypass the policy. Verify not only the response but the unchanged database state after each forbidden operation; consider concurrent requests changing related records."
            }
        ],
        "warning": "This is an intentionally noncompliant fixture for learning. Do not claim that a valid FOREIGN KEY implies release readiness.",
        "assignment": [
            "Run readiness_missing.sql and explain why Payroll API is returned.",
            "Run readiness_repair.sql, confirm zero violations inside its transaction, then verify Payroll API is again reported after rollback.",
            "Diagram the FK direction and the inverse business requirement.",
            "Write API-level negative tests for production transition and deletion of the final production Environment, with unchanged-state assertions.",
            "Explain where authorization, transactions and race conditions affect this rule."
        ],
        "resources": [
            {
                "title": "Steward canonical product contract",
                "url": "https://github.com/enoqueJonas/tsa/blob/curriculum/oop-depth-reconstruction/docs/product/steward.md",
                "kind": "reference",
                "purpose": "Canonical lifecycle and deployment readiness invariant."
            },
            {
                "title": "PostgreSQL — Subquery Expressions",
                "url": "https://www.postgresql.org/docs/current/functions-subquery.html",
                "kind": "reference",
                "purpose": "Correlated NOT EXISTS semantics."
            },
            {
                "title": "PostgreSQL — Constraints",
                "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
                "kind": "reference",
                "purpose": "Foreign-key direction and cross-table limitations."
            }
        ],
        "practiceObjective": "Prove a cross-table Steward production-readiness violation, reverse a temporary repair and design proper API enforcement.",
        "practiceInstructions": [
            "Execute published readiness_missing.sql and verify Payroll API is the only violation.",
            "Execute readiness_repair.sql and verify zero inside, then confirm the negative fixture remains after rollback.",
            "Explain why foreign-key integrity does not imply existence of a qualifying Environment.",
            "Specify both API mutation routes that must enforce the rule and record negative test outcomes."
        ],
        "knowledgeCheck": "Why does a valid Environment.service_id FK permit a production-stage Service without a production Environment? How could a concurrent last-Environment deletion invalidate a previously checked transition?"
    },
    {
        "id": "transactions-acid",
        "title": "Transactions and ACID",
        "introduction": "The Steward schema now contains a Service and its production Environment in two related tables. Writing those facts with two unrelated autocommit statements can leave a half-created Service if the second write fails. A transaction is the database-controlled boundary that lets related writes become visible together or be abandoned together. We will observe that behavior in PostgreSQL before asking what happens when *two* transactions run concurrently; that is the separate next lesson.",
        "outcomes": [
            "Predict which rows persist when COMMIT versus ROLLBACK ends one multi-statement operation.",
            "Prove atomicity using two distinct PostgreSQL connections, not a Python simulation.",
            "Explain ACID without conflating constraints, concurrency and crash recovery.",
            "Recover deliberately from an SQL error using a SAVEPOINT and an explicit partial rollback."
        ],
        "sections": [
            {
                "id": "business-invariant",
                "title": "Start with the invariant, not the acronym",
                "body": "For this exercise, a newly registered production Service must have a corresponding Environment of kind production. Service and Environment live in separate rows; the database's existing foreign key ensures each Environment belongs to a real Service, but it does **not** demand that every Service has an Environment. Two successive autocommit INSERTs can therefore leave a Service without its required first deployment if the second operation fails. Write both facts in one explicit transaction. This is an application-level business requirement protected by coordinating the writes, not a new automatic guarantee of the foreign key."
            },
            {
                "id": "commands",
                "title": "BEGIN opens a boundary; COMMIT publishes it; ROLLBACK abandons it",
                "body": "PostgreSQL executes each standalone SQL statement in a transaction implicitly when an explicit transaction is absent, but separate standalone commands do not form one all-or-nothing business operation. BEGIN makes a multi-command transaction; changes inside it are visible to subsequent reads in that same session, but not to other sessions until COMMIT. ROLLBACK reverses uncommitted table changes. Observe the count before and after rollback in one script, then use a new psql process to verify that no Service survived. Generated sequence/identity counters can advance despite rollback, so never assume a rolled-back INSERT makes an identity value reusable.",
                "language": "sql",
                "caption": "txn_rollback.sql — demonstrate a deliberate rollback of a Service insert",
                "code": "BEGIN;\nINSERT INTO service (name, owning_team_id, endpoint)\nSELECT 'Txn Rollback Demo', id, 'https://rollback.example.invalid/api'\nFROM team WHERE name = 'Payments';\nSELECT 'inside' AS stage, count(*) FROM service WHERE name = 'Txn Rollback Demo';\nROLLBACK;\nSELECT 'after' AS stage, count(*) FROM service WHERE name = 'Txn Rollback Demo';",
                "output": "inside | 1\nafter | 0. A separate session also finds zero rows."
            },
            {
                "id": "success",
                "title": "Commit two related facts and verify them from a second connection",
                "body": "The same principle applies when both writes are valid. The first INSERT adds the Service; the second locates its generated identity by its unique teaching name and creates the Environment. COMMIT makes both rows available to a new connection. Run the following in the dedicated disposable learning database with psql -X -v ON_ERROR_STOP=1 -f txn_commit.sql. Run it only once on a fresh exercise fixture, since the unique Service name is intentional. A connection in a different psql process should observe both rows. In the automated test the demo rows are cleaned after verification to keep the five-Service seed intact.",
                "language": "sql",
                "caption": "txn_commit.sql — commit Service plus initial Environment together",
                "code": "BEGIN;\nINSERT INTO service (name, owning_team_id, endpoint)\nSELECT 'Txn Commit Demo', id, 'https://commit.example.invalid/api'\nFROM team WHERE name = 'Payments';\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Initial', 'production'\nFROM service WHERE name = 'Txn Commit Demo';\nCOMMIT;\nSELECT s.name, e.kind\nFROM service s JOIN environment e ON e.service_id = s.id\nWHERE s.name = 'Txn Commit Demo';",
                "output": "Txn Commit Demo | production. The same pair is readable in a new connection."
            },
            {
                "id": "acid",
                "title": "Four guarantees, four different questions",
                "body": "**Atomicity**: do the related changes commit together or not? **Consistency**: does each committed state respect the invariants enforced by database constraints and the application's transactional behavior? A transaction does not invent the business requirement that every production Service have an Environment. **Isolation**: what may a concurrent transaction observe, and which interleavings can change outcomes? It is not simply 'transactions never interfere'. **Durability**: once PostgreSQL acknowledges COMMIT under its configured durability guarantees, it maintains the committed changes through failures according to WAL, storage and recovery assumptions. Observing a row after reconnect is evidence of commit visibility, **not** a simulated power-failure durability test. Isolation gets its own learner lesson next; WAL and recovery mechanisms are studied in later platform/reliability modules."
            },
            {
                "id": "error",
                "title": "An error can abort the current transaction",
                "body": "A bad Environment.kind such as 'unknown' violates the seed's CHECK constraint. In PostgreSQL, after a statement error inside BEGIN the transaction is in an aborted state: ordinary statements fail until ROLLBACK, or ROLLBACK TO an existing SAVEPOINT. The demo below first creates a Service, establishes a savepoint, deliberately triggers the CHECK failure, rolls back to the savepoint, then inserts a valid Environment and commits. Notice the psql-only \\set directives: the command-line runner normally uses ON_ERROR_STOP=1, so this *teaching script deliberately turns it off only for the one expected failure*. Restore it immediately, then execute ROLLBACK TO SAVEPOINT; do not normalize suppressing real production errors. The expected CHECK failure is printed on stderr even though the script completes successfully.",
                "language": "sql",
                "caption": "txn_savepoint.sql — recover from one expected SQL error",
                "code": "BEGIN;\nINSERT INTO service (name, owning_team_id, endpoint)\nSELECT 'Txn Savepoint Demo', id, 'https://savepoint.example.invalid/api'\nFROM team WHERE name = 'Payments';\nSAVEPOINT before_invalid_kind;\n\\set ON_ERROR_STOP off\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Invalid', 'unknown'\nFROM service WHERE name = 'Txn Savepoint Demo';\n\\set ON_ERROR_STOP on\nROLLBACK TO SAVEPOINT before_invalid_kind;\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Recovered', 'production'\nFROM service WHERE name = 'Txn Savepoint Demo';\nCOMMIT;\nSELECT s.name, e.kind\nFROM service s JOIN environment e ON e.service_id = s.id\nWHERE s.name = 'Txn Savepoint Demo';",
                "output": "stderr: a CHECK constraint violation for kind='unknown'.\nstdout: Txn Savepoint Demo | production. The rejected Environment row does not persist."
            },
            {
                "id": "counterexample",
                "title": "Why a successful transaction can still be wrong",
                "body": "Consider BEGIN; INSERT Service without Environment; COMMIT. The database accepts this because its foreign key only constrains Environment → Service, not Service → Environment completeness. Atomicity was satisfied, yet the intended business invariant was not. Similarly, COMMIT of a misleading status or a duplicate fact outside a declared uniqueness rule is not automatically correct. A reliable design combines database constraints for local invariants, carefully scoped transactions for multi-row changes and application/domain validation for rules the database cannot express as a simple constraint. Never use an unprotected two-statement service creation flow merely because your demonstration data looks valid."
            },
            {
                "id": "lab-steps",
                "title": "Reproduction sequence and failure diagnosis",
                "body": "First establish the canonical five-Service Steward seed in a *disposable* PostgreSQL lab. Save the three published scripts exactly as txn_rollback.sql, txn_commit.sql and txn_savepoint.sql. Run the rollback script and capture 1→0. Run the commit script and prove its resulting Service and Environment appear in a separate psql session. Run the savepoint script; capture both the expected CHECK error and the eventual committed production Environment. If the script exits before ROLLBACK TO, check that psql's ON_ERROR_STOP was temporarily disabled for the one expected statement, and restore a clean transaction/connection; do not mask the exception by changing the CHECK constraint. These scripts add no real production data and their demo Services should be cleaned under a controlled rollback/teardown procedure after the exercise."
            }
        ],
        "warning": "A transaction is not magic: the PostgreSQL sequence/identity generator is not transactional, a CHECK failure leaves a transaction aborted until rollback-to-savepoint, and a COMMIT cannot compensate for a missing business invariant. Never run these educational INSERTs against a live/shared registry.",
        "assignment": [
            "Execute rollback, commit and savepoint teaching scripts in an isolated lab with separate-process verification.",
            "Explain the uncommitted versus committed visibility and report the exact observed status and affected rows.",
            "Write a new multi-row Service+Environment transaction that deliberately violates a constraint, then repair it without publishing partial state.",
            "Give distinct, accurate operational explanations for A, C, I and D—including what the local exercise does *not* prove."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Transactions tutorial",
                "url": "https://www.postgresql.org/docs/current/tutorial-transactions.html",
                "kind": "reference",
                "purpose": "Source for implicit statement transactions, BEGIN/COMMIT/ROLLBACK and SAVEPOINT error recovery."
            },
            {
                "title": "PostgreSQL — Constraints",
                "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
                "kind": "reference",
                "purpose": "Distinguish declared referential/check constraints from an application-level multi-row invariant."
            },
            {
                "title": "CMU 15-445 Fall 2025 — Concurrency Control Theory",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lecture #17 (optional deep theory; watch linked lecture if desired)",
                "purpose": "Research the deeper concurrency context after mastering transaction commands; full video viewing not claimed."
            }
        ],
        "practiceObjective": "Execute complete PostgreSQL rollback, commit and savepoint evidence with a single explicit business invariant rather than memorize ACID vocabulary.",
        "practiceInstructions": [
            "Verify the dedicated disposable lab and seeded Team/Service tables before changing data.",
            "Run txn_rollback.sql, predict inside=1 and after=0, and verify zero from a fresh connection.",
            "Run txn_commit.sql, verify Service+production Environment from a new connection, and explain COMMIT visibility.",
            "Run txn_savepoint.sql in psql with its temporary ON_ERROR_STOP setting; capture the expected constraint error, rollback-to-savepoint and valid final state.",
            "Explain why a transaction that commits only Service without Environment can still violate the domain requirement.",
            "Classify which ACID properties these tests observe and which require more complex concurrency/crash-recovery experiments."
        ],
        "knowledgeCheck": "If a Service INSERT succeeds and the Environment INSERT fails, what remains under autocommit versus BEGIN/ROLLBACK? Why might an id sequence skip numbers after rollback? What does ROLLBACK TO SAVEPOINT repair, and why do atomic operations not automatically prove business correctness?"
    },
    {
        "id": "concurrent-transactions-and-isolation-levels",
        "title": "Concurrent Transactions and Isolation Levels",
        "introduction": "Now that a transaction boundary is real, the next question is what happens when *two independent database sessions* read and write overlapping data. Isolation is not a binary safety switch. PostgreSQL's default Read Committed takes a fresh snapshot for each statement; Repeatable Read retains a stable snapshot for a transaction's queries; Serializable adds detection and may abort a conflicting transaction. We will observe a concurrent read change with two terminals before discussing anomalies and retries.",
        "outcomes": [
            "Distinguish two PostgreSQL connections from two commands in one connection, and name a snapshot's role.",
            "Reproduce a nonrepeatable read under Read Committed and stable repeated reads under Repeatable Read.",
            "Understand that PostgreSQL does not allow dirty reads and Read Uncommitted behaves like Read Committed.",
            "Differentiate stable snapshot, row-level locking, uniqueness constraints and Serializable retry requirements."
        ],
        "sections": [
            {
                "id": "session",
                "title": "Two clients are two concurrent views of the same database",
                "body": "A psql session owns a connection and transaction state; another psql terminal uses a different connection even when both select the same database. PostgreSQL's multi-version concurrency control (MVCC) lets readers see appropriate committed row versions without simply exposing an uncommitted write. The snapshot answers 'which committed versions may this statement/transaction see?' If A updates a row but has not committed, B at ordinary Read Committed sees the old committed value. When A commits, B's next SELECT may see the newly committed value. This is correct behavior for Read Committed, not inconsistent SQL parsing."
            },
            {
                "id": "setup",
                "title": "Use a disposable counter, not real Steward business rows",
                "body": "To isolate the concurrency mechanism, use an independent table with one row. Execute the setup once in the dedicated lab database. Do not replace, delete or lock existing Team or Service data to demonstrate snapshots. Use two distinct psql terminals with separate transactions named A and B, and execute each command only at the indicated stage. The CI exercise uses two independent psql child processes and waits for each stated observation before continuing; a single connection running both scripts cannot prove concurrent visibility.",
                "language": "sql",
                "caption": "isolation_setup.sql — one isolated probe row for the two-session exercise",
                "code": "CREATE TABLE tsa_isolation_probe (\n  id integer PRIMARY KEY,\n  value integer NOT NULL\n);\nINSERT INTO tsa_isolation_probe (id, value) VALUES (1, 10);\nSELECT value FROM tsa_isolation_probe WHERE id = 1;",
                "output": "10"
            },
            {
                "id": "rc",
                "title": "Read Committed: a fresh statement can see a new commit",
                "body": "Follow this exact two-terminal protocol after setup. A begins a Read Committed transaction and reads 10. B begins and updates to 20 but has not committed; A reads 10 again because it cannot see B's uncommitted value (no dirty read). B commits; A reads 20 on its next statement because Read Committed uses a new statement-level snapshot. A then commits. Note: seeing 10 then 20 within A is called a nonrepeatable read, not proof that PostgreSQL 'lost' an update. Every observed value has an explanation in the commit timeline.",
                "language": "text",
                "caption": "isolation_read_committed.txt — interleave these commands between two psql sessions",
                "code": "Session A: BEGIN ISOLATION LEVEL READ COMMITTED;\nSession A: SELECT value FROM tsa_isolation_probe WHERE id = 1;  -- 10\nSession B: BEGIN;\nSession B: UPDATE tsa_isolation_probe SET value = 20 WHERE id = 1;\nSession A: SELECT value FROM tsa_isolation_probe WHERE id = 1;  -- 10 (B uncommitted)\nSession B: COMMIT;\nSession A: SELECT value FROM tsa_isolation_probe WHERE id = 1;  -- 20\nSession A: COMMIT;",
                "output": "A observations: 10, 10, 20. B's uncommitted value never appears."
            },
            {
                "id": "rr",
                "title": "Repeatable Read: a stable transaction snapshot",
                "body": "Reset the probe to value 10 *outside* either transaction. A begins Repeatable Read and executes the first SELECT, establishing its snapshot. B then changes the value to 20 and commits. A's next SELECT still returns 10 because its snapshot is stable. After A commits, a brand-new SELECT sees 20. In PostgreSQL, the Repeatable Read snapshot is established at the first non-transaction-control statement, not necessarily at the literal BEGIN line; this distinction matters when demonstrating timing. Repeated reads are stable, but write skew and other serialization anomalies still require additional protection. The independent concurrency lesson does not imply Repeatable Read is equivalent to Serializable.",
                "language": "text",
                "caption": "isolation_repeatable_read.txt — repeat after resetting the probe to 10",
                "code": "Session B: UPDATE tsa_isolation_probe SET value = 10 WHERE id = 1;  -- autocommit reset\nSession A: BEGIN ISOLATION LEVEL REPEATABLE READ;\nSession A: SELECT value FROM tsa_isolation_probe WHERE id = 1;  -- 10, snapshot acquired\nSession B: BEGIN;\nSession B: UPDATE tsa_isolation_probe SET value = 20 WHERE id = 1;\nSession B: COMMIT;\nSession A: SELECT value FROM tsa_isolation_probe WHERE id = 1;  -- still 10\nSession A: COMMIT;\nSession A: SELECT value FROM tsa_isolation_probe WHERE id = 1;  -- new statement: 20",
                "output": "A observations: 10, 10, 20; the middle value is stable even after B commits."
            },
            {
                "id": "phenomena",
                "title": "Different phenomena require different protection",
                "body": "A dirty read would expose uncommitted data; PostgreSQL's Read Uncommitted behaves like Read Committed and does not permit dirty reads. A nonrepeatable read means a repeated row read changes after another commit; the Read Committed example demonstrates this. A phantom means the set of rows matching a predicate changes; PostgreSQL's Repeatable Read prevents phantoms even though the SQL standard permits implementations with weaker guarantees. A serialization anomaly means committed concurrent transactions cannot be explained by any valid serial ordering; Repeatable Read does not prevent all such anomalies. Serializable uses monitoring and may reject an unsafe transaction with SQLSTATE 40001. The application must retry the **entire transaction**, including the reads and decision, not only replay the last INSERT. A UNIQUE constraint solves duplicate-key insertion at the shared data boundary but cannot express every cross-row budget/coverage invariant."
            },
            {
                "id": "locks",
                "title": "Snapshots are not locks; isolation is not a performance badge",
                "body": "Read Committed usually allows more observable changes across statements; Repeatable Read trades those changes for a stable view; Serializable strengthens cross-transaction correctness but can require retries and incur overhead. Explicit SELECT ... FOR UPDATE can lock selected rows before computing a decision involving those rows. It is not suitable as a blanket remedy, because a lock can block other workers, cause deadlocks in inconsistent acquisition order, and still fail to protect a relationship involving nonexistent rows. Choose a concrete invariant and minimum sufficient mechanism—constraints, transaction scope, lock or Serializable—then test the concurrent scenario. Later concurrency material explores conflicting writes and state transitions in more depth."
            },
            {
                "id": "lab",
                "title": "Observe, record and teach the timeline independently",
                "body": "Write the A/B command timeline before running it and label each value as uncommitted, committed but outside A's snapshot, or visible to A's current query. Run the protocols on the disposable probe, verify that A's Read Committed sequence is 10→10→20 and Repeatable Read sequence 10→10→20 for *different reasons*, and explain the middle read difference relative to the moment B commits. The crucial comparison is the SELECT **after** B COMMIT: 20 at Read Committed, 10 at Repeatable Read. Record the exact transaction boundaries, identify one scenario requiring Serializable or explicit locks, and clean up only the dedicated probe table after recording evidence."
            }
        ],
        "warning": "Do not mistake a sequential script in one psql session for a concurrency test. PostgreSQL does not permit dirty reads, and Serializable retries must repeat the complete logical transaction. The described probe is disposable; do not demonstrate races on production tables.",
        "assignment": [
            "Run the two-terminal Read Committed protocol and explain each read value including the uncommitted interval.",
            "Run the Repeatable Read protocol against a freshly reset probe; identify the statement that establishes A's snapshot.",
            "Draw a timestamped matrix of A/B transactions with first read, pending write, commit and second read.",
            "Explain why a uniqueness constraint and Serializable isolation prevent different classes of bugs, and identify an example requiring whole-transaction retry.",
            "Without executing a dangerous uncontrolled race, predict what would happen if A tries to UPDATE a row changed since the Repeatable Read snapshot."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Transaction Isolation",
                "url": "https://www.postgresql.org/docs/current/transaction-iso.html",
                "kind": "reference",
                "purpose": "PostgreSQL-specific MVCC, snapshot timing, anomalies, Read Uncommitted caveat and Serializable retries."
            },
            {
                "title": "PostgreSQL — Explicit Locking",
                "url": "https://www.postgresql.org/docs/current/explicit-locking.html",
                "kind": "reference",
                "purpose": "Understand why row locks are a targeted alternative to automatic snapshot guarantees."
            },
            {
                "title": "CMU 15-445 Fall 2025 — Concurrency Control and MVCC lectures",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lectures #17–#20 on concurrency theory, locking, timestamp ordering and MVCC; optional videos",
                "purpose": "In-depth explanatory companion for mechanisms not implemented inside this Builder lesson; full videos not asserted watched."
            }
        ],
        "practiceObjective": "Run a real two-session PostgreSQL experiment that distinguishes per-statement Read Committed snapshots from a Repeatable Read transaction snapshot.",
        "practiceInstructions": [
            "Create the dedicated tsa_isolation_probe table in a disposable lab; verify value 10 from a separate psql connection.",
            "Run the interleaved A/B Read Committed timeline, capturing A=10 before B's update, A=10 while B uncommitted, and A=20 after B commits.",
            "Reset probe to 10; run A in Repeatable Read and capture A=10 before and A=10 after B commits, then A=20 after A ends.",
            "Annotate each snapshot and commit boundary; compare observed values without claiming this proves Serializable behavior.",
            "Predict one UPDATE-after-snapshot conflict and document the need to abort/retry the complete transaction if serialization fails.",
            "Remove only the dedicated probe table when the exercise is finished."
        ],
        "knowledgeCheck": "Why can A at Read Committed see different committed values without ever seeing dirty data? What event establishes PostgreSQL's Repeatable Read snapshot? Can two Repeatable Read transactions still cause serialization anomalies, and what must a client retry on SQLSTATE 40001?"
    },
    {
        "id": "constraints-keys",
        "title": "Constraints, Keys and Relationships",
        "introduction": "A database is useful partly because a rule can survive multiple clients. What does it mean to make an invariant executable rather than put it in a comment? We will inspect existing Steward constraints, predict four real constraint failures, then evolve the schema with one explicit, reversible example. This builds on the SQL fixture; do not recreate its tables.",
        "outcomes": [
            "Explain PRIMARY KEY, UNIQUE, NOT NULL, CHECK and FOREIGN KEY by the condition each prevents.",
            "Observe a rejected direct SQL write even when no API or Django validation runs.",
            "Distinguish row identity, domain uniqueness, relationship lifecycle and multi-row business policy.",
            "Add a new constraint safely after checking the existing rows."
        ],
        "sections": [
            {
                "id": "model",
                "title": "From domain statement to machine-enforced invariant",
                "body": "A primary key identifies a row and prohibits NULL/duplicates. A separate UNIQUE constraint protects a domain fact such as Service.name, even if an identity id already exists. NOT NULL forbids absent values; CHECK evaluates a Boolean expression on each row (in PostgreSQL CHECK does not reject UNKNOWN, so add NOT NULL when NULL is not valid). A FOREIGN KEY connects child references to parent identities and controls orphan records. The fixture already declares Team.name UNIQUE, Service.name UNIQUE, Service.owning_team_id REFERENCES Team, Environment.kind CHECK, ServiceDependency edge UNIQUE and no-self-dependency CHECK. These are *different* promises and the database—not a DRF serializer—rejects violating statements."
            },
            {
                "id": "inspect",
                "title": "Discover the constraints that actually exist",
                "body": "A design diagram is not proof of deployed constraints. Query pg_constraint with pg_get_constraintdef to view PostgreSQL's actual definitions for the four real fixture tables. Distinguish constraint names from SQLSTATE or the user-visible wording; avoid tests depending on automatically generated names. The result includes table-specific primary and uniqueness constraints, foreign keys and checks. A logical meaning belongs in your documentation; the database catalog is the runtime evidence.",
                "caption": "constraints_inspect.sql — inspect actual deployed integrity rules",
                "code": "SELECT conrelid::regclass::text AS relation, contype, pg_get_constraintdef(oid) AS rule\nFROM pg_constraint\nWHERE conrelid IN ('team'::regclass,'service'::regclass,'environment'::regclass,'service_dependency'::regclass)\nORDER BY relation, contype, rule;"
            },
            {
                "id": "failures",
                "title": "Prove constraint enforcement without breaking the fixture",
                "body": "Run the following statements *one by one* in a psql script with \\set ON_ERROR_STOP off only during the intentional failures, then restore it. A duplicate Team name violates UNIQUE; an orphan Service owner violates FK; an invalid Environment.kind violates CHECK; a self-referential dependency violates CHECK. In each case PostgreSQL should reject the statement and preserve the original seed. A failed statement in a standalone autocommit context does not abort subsequent standalone statements, but inside BEGIN you must ROLLBACK or roll back to a savepoint as taught previously.",
                "caption": "constraints_failures.sql — four isolated invalid inserts",
                "code": "INSERT INTO team(name) VALUES ('Payments');\nINSERT INTO service(name, owning_team_id, endpoint)\nVALUES ('Orphan Demo', -1, 'https://orphan.example.invalid');\nINSERT INTO environment(service_id,name,kind)\nSELECT id,'Bad','unknown' FROM service WHERE name='Payments API';\nINSERT INTO service_dependency(source_service_id,target_service_id)\nSELECT id,id FROM service WHERE name='Payments API';"
            },
            {
                "id": "evolve",
                "title": "Evolve an existing table rather than recreate it",
                "body": "Add a slug in a transaction. First inspect collisions of the proposed name-derived slug; then add a nullable column, backfill, enforce NOT NULL and UNIQUE, verify lookup, and ROLLBACK this teaching experiment to leave the fixture unchanged. In a production migration a long-running backfill and constraint/locking strategy may require multiple deployable steps; the small transactional demo is not a deployment plan. The special value identity remains the surrogate row key, while slug is an additional public uniqueness rule.",
                "caption": "constraints_slug.sql — reversible uniqueness evolution",
                "code": "BEGIN;\nSELECT lower(replace(name,' ','-')) AS candidate, count(*)\nFROM service GROUP BY candidate HAVING count(*) > 1;\nALTER TABLE service ADD COLUMN slug text;\nUPDATE service SET slug = lower(replace(name,' ','-'));\nALTER TABLE service ALTER COLUMN slug SET NOT NULL;\nALTER TABLE service ADD CONSTRAINT uq_service_slug UNIQUE(slug);\nSELECT name,slug FROM service ORDER BY name;\nROLLBACK;",
                "output": "Collision query: zero rows; five Service name/slug pairs; after ROLLBACK the slug column does not exist."
            },
            {
                "id": "lifecycle",
                "title": "FOREIGN KEY actions are domain policy, not convenience",
                "body": "NO ACTION is PostgreSQL's default referential action and can be deferred when declared DEFERRABLE; RESTRICT refuses a referenced change immediately. CASCADE propagates deletion to children and SET NULL clears references when permitted. Deleting a Team should not silently delete banking/registry Services just because CASCADE is easier to type. The fixture's non-nullable ownership reference prevents orphaning Services. Ask which object owns the lifecycle before choosing any delete action. A CHECK generally cannot enforce the business rule 'all newly production-stage Services require production Environment' across two tables; use controlled transactions and application/domain policy."
            }
        ],
        "assignment": [
            "Run the deployed-constraints catalog query and explain at least one rule for each table.",
            "Execute four negative statements in disposable autocommit mode and record the different constraint failures and unchanged row count.",
            "Execute the staged slug transaction and prove that ROLLBACK removes both data and schema changes.",
            "Explain why a Team deletion should not CASCADE onto Services without explicit domain approval."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Constraints",
                "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
                "kind": "reference",
                "purpose": "Correct NULL CHECK, foreign-key, uniqueness and deferability semantics"
            },
            {
                "title": "PostgreSQL — ALTER TABLE",
                "url": "https://www.postgresql.org/docs/current/ddl-alter.html",
                "kind": "reference",
                "purpose": "Schema changes as explicit tracked operations"
            }
        ],
        "practiceObjective": "Explain PRIMARY KEY, UNIQUE, NOT NULL, CHECK and FOREIGN KEY by the condition each prevents.",
        "practiceInstructions": [
            "Run the deployed-constraints catalog query and explain at least one rule for each table.",
            "Execute four negative statements in disposable autocommit mode and record the different constraint failures and unchanged row count.",
            "Execute the staged slug transaction and prove that ROLLBACK removes both data and schema changes.",
            "Explain why a Team deletion should not CASCADE onto Services without explicit domain approval."
        ],
        "knowledgeCheck": "Why does CHECK (x > 0) accept NULL unless NOT NULL also exists? Why is a PRIMARY KEY not sufficient for all domain uniqueness? What difference does a FOREIGN KEY enforce versus an application precheck?",
        "warning": "Only execute changing SQL in a dedicated disposable PostgreSQL learning database. Predict the resulting rows and constraints before running a statement, and do not treat a five-row fixture as representative performance evidence."
    },
    {
        "id": "schema-design",
        "title": "Schema Design",
        "introduction": "A schema is a model of durable facts and the questions an application must answer—not an arbitrary mapping from screen fields to database columns. Steward's initial four-table fixture intentionally excludes Membership and ServiceReview history. We will make those missing concepts explicit, determine their cardinalities and show why overwriting one column destroys historical evidence.",
        "outcomes": [
            "Derive relations and keys from independently evolving domain facts.",
            "Use one-to-many and many-to-many cardinalities to choose appropriate foreign keys and unique pairs.",
            "Distinguish current-state columns from append-only review history.",
            "Construct and query a temporary schema extension with justified nullability and access boundaries."
        ],
        "sections": [
            {
                "id": "facts",
                "title": "Start with five questions, not CREATE TABLE syntax",
                "body": "What Teams own Services? Which Services depend on Identity API? Where is a Service deployed? Who can maintain the owning Team? Who reviewed the Service last quarter? The existing Team/Service/Environment/Dependency tables answer the first three questions. The last two require distinct facts with their own lifetimes: TeamMembership (person, team, role, active state) and ServiceReview (service, reviewer, review result, timestamp). Neither is merely an array of display labels on the Service row. A user may belong to several teams; a Service may receive multiple reviews over time."
            },
            {
                "id": "cardinality",
                "title": "Translate each business statement into a key rule",
                "body": "Each Service must have exactly one owning Team: owning_team_id NOT NULL REFERENCES team(id). Each Team can own zero or many Services: no Team-side Service column is needed. A membership needs one Team and one subject; UNIQUE(team_id, subject) protects one current membership per pair in this simplified model. A review has one Service and a historical event timestamp; multiple reviews are valid, so UNIQUE(service_id) would be wrong. A review's id provides stable event identity even if two reviews happen at the same second. These are teaching assumptions: in a regulated system, retention, PII, reviewer identity and historical membership changes need explicit policy."
            },
            {
                "id": "executable",
                "title": "Create two additional facts in session-limited tables",
                "body": "The following TEMP relations let you explore membership and review history without redefining the existing permanent schema. This disposable sketch deliberately uses ordinary bigint columns for team_id and service_id rather than declaring foreign keys across the temporary/permanent table boundary. Therefore it does NOT prove referential enforcement for these new concepts: the production design would declare actual foreign keys in managed persistent tables. Insert sample records tied to Team/Service identities, not guessed numeric IDs, then query the history. Closing the session drops both TEMP tables. Use pseudonymous subjects only; do not create user credentials in a plain text column.",
                "caption": "schema_extension.sql — disposable memberships and historical reviews",
                "code": "CREATE TEMP TABLE team_membership (\n  team_id bigint NOT NULL,\n  subject text NOT NULL,\n  role text NOT NULL CHECK(role IN ('viewer','maintainer')),\n  PRIMARY KEY(team_id,subject)\n);\nCREATE TEMP TABLE service_review (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  service_id bigint NOT NULL,\n  reviewer text NOT NULL,\n  verdict text NOT NULL CHECK(verdict IN ('pass','followup')),\n  reviewed_at timestamptz NOT NULL\n);\nINSERT INTO team_membership(team_id,subject,role)\nSELECT id,'demo-reviewer','maintainer' FROM team WHERE name='Payments';\nINSERT INTO service_review(service_id,reviewer,verdict,reviewed_at)\nSELECT id,'demo-reviewer','followup','2026-01-10T10:00:00Z' FROM service WHERE name='Payments API';\nINSERT INTO service_review(service_id,reviewer,verdict,reviewed_at)\nSELECT id,'demo-reviewer','pass','2026-02-10T10:00:00Z' FROM service WHERE name='Payments API';\nSELECT verdict FROM service_review ORDER BY reviewed_at;",
                "output": "followup; pass. Both review facts remain observable in the same session."
            },
            {
                "id": "history",
                "title": "Current status and an event stream answer different questions",
                "body": "A Service.current_verdict column could answer 'what is the most recent verdict?' but overwriting it cannot answer 'what was the previous verdict?' or 'who changed it?'. An append-only review relation preserves those separate events; a current view can be derived using ORDER BY reviewed_at DESC, id DESC LIMIT 1. An audit trail also needs a policy for corrections, integrity, retention and access control; simply adding timestamps does not make it tamper-proof. Decide whether reviewers should be referenced by a user identity table rather than free text when building the real domain."
            },
            {
                "id": "tradeoffs",
                "title": "Data types and defaults are engineering policy",
                "body": "Use timestamptz for instants whose timezone matters; plain timestamp is a wall-clock value without timezone. Use text CHECK for small fixed values in an exercise, but consider how new statuses and backward-compatible migrations are handled. Do not silently default a missing reviewer to an administrative identity, or a missing ownership to a random Team. Use NULL only when absence is legitimate and clearly named. Decide ON DELETE behavior from the lifecycle of each fact, not from a generic ORM default."
            }
        ],
        "assignment": [
            "Write a question-to-relation trace for all six Steward entities.",
            "Execute the two TEMP relations and query historical revisions in one psql session.",
            "Prove why UNIQUE(service_id) is wrong for ServiceReview and why the TeamMembership primary key is composite.",
            "Produce a schema decision note covering cardinality, data types, deletion and history retention."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Table Basics",
                "url": "https://www.postgresql.org/docs/current/ddl-basics.html",
                "kind": "reference",
                "purpose": "Persistent data types and relational tables"
            },
            {
                "title": "PostgreSQL — Constraints",
                "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
                "kind": "reference",
                "purpose": "Cardinality and key enforcement"
            }
        ],
        "practiceObjective": "Derive relations and keys from independently evolving domain facts.",
        "practiceInstructions": [
            "Write a question-to-relation trace for all six Steward entities.",
            "Execute the two TEMP relations and query historical revisions in one psql session.",
            "Prove why UNIQUE(service_id) is wrong for ServiceReview and why the TeamMembership primary key is composite.",
            "Produce a schema decision note covering cardinality, data types, deletion and history retention."
        ],
        "knowledgeCheck": "Why can two reviews for one Service be legitimate while two current memberships for the same subject/team may not? What would be lost by storing only current_verdict?",
        "warning": "Only execute changing SQL in a dedicated disposable PostgreSQL learning database. Predict the resulting rows and constraints before running a statement, and do not treat a five-row fixture as representative performance evidence."
    },
    {
        "id": "normalization",
        "title": "Normalization and Denormalization Trade-offs",
        "introduction": "Normalization is not a contest to remove every repeated string. It is the discipline of giving a durable fact one authoritative home so that changes cannot create contradictory truths. Work through a failed ownership design, identify its functional dependency, and then prove the normalized model handles the same question without repeating Team names.",
        "outcomes": [
            "Demonstrate an actual update anomaly in a deliberately flawed representation.",
            "Use functional dependency to distinguish key ownership from another table's facts.",
            "Explain practical 1NF, 2NF and 3NF without applying them as slogans.",
            "Justify denormalization only with a measured query and an explicit consistency owner."
        ],
        "sections": [
            {
                "id": "failure",
                "title": "A Team rename should be one fact, not a distributed update",
                "body": "A flawed service row stores both owning_team_id and owning_team_name. Two Services with the same owning_team_id can accidentally have different names after a partial rename. The actual Team.name is the authoritative fact and service.owning_team_id is the reference. On a multi-user system, enforcing rename synchronization manually across all Service rows is brittle; a single Team row makes the update coherent. This is an **update anomaly**, not a PostgreSQL software defect."
            },
            {
                "id": "demo",
                "title": "Make an anomaly observable without damaging the fixture",
                "body": "Use a TEMP table for the deliberately bad model and two Services under the same Team. Rename only one record. PostgreSQL allows the two contradictory names because there is no rule tying the duplicate text to a shared Team row. Compare that with the real JOIN, which gets Team.name from one authoritative row. Closing psql clears the broken example. For a fair comparison, ask what happens if a Team is renamed and whether the Service domain still knows the correct identity.",
                "caption": "normalization_anomaly.sql — two competing team names in one duplicated column",
                "code": "CREATE TEMP TABLE bad_service(\n  service text PRIMARY KEY,\n  owning_team_id integer NOT NULL,\n  owning_team_name text NOT NULL\n);\nINSERT INTO bad_service VALUES\n('Payments API',1,'Payments'),('Payroll API',1,'Payments');\nUPDATE bad_service SET owning_team_name='Payments Division'\nWHERE service='Payments API';\nSELECT service,owning_team_name FROM bad_service ORDER BY service;",
                "output": "Payments API | Payments Division; Payroll API | Payments. The same team identity now has two names."
            },
            {
                "id": "dependencies",
                "title": "Functional dependencies explain why the anomaly exists",
                "body": "Under the Steward domain, Team.id → Team.name: one Team identity determines one Team name. Service.id → Service.owning_team_id: one Service identity determines its owning Team. If Service also stores Team.name, Service.id → Team.id → Team.name creates an indirect, duplicated fact. Third Normal Form asks you to move that non-key fact to the relation whose key actually determines it. In a relation with composite key (source_service_id, target_service_id), a fact determined by only source_service_id belongs to Service, not the dependency edge; that is the kind of partial dependency 2NF prevents. 1NF is about well-defined relational attribute values and avoiding repeating groups, not a ban on JSON types in all PostgreSQL designs."
            },
            {
                "id": "alternate",
                "title": "Denormalization can be rational but carries a maintenance contract",
                "body": "A materialized dependency_count or Team name snapshot can avoid repeated joins for a proven heavy read workload. But who updates it when dependencies change? What happens between the authoritative update and the cached snapshot update? How stale may an operational dashboard be? If the business requires exact current counts, a stale cache can be worse than a slower query. First compare actual plans and representative data volume; then choose caching, indexed query, materialized view or denormalized column based on measured latency and the tolerable consistency window."
            },
            {
                "id": "transfer",
                "title": "Independent redesign exercise",
                "body": "Consider a Service record containing [environment_1_name, environment_2_name] and dependencies as a comma-separated string. Determine which concepts need child relations to support arbitrary cardinality, foreign-key checks and joins. Then argue whether storing a historical display snapshot of a Team name on an audit event is acceptable even though current ownership should not duplicate it. Historical snapshots deliberately answer a different question from normalized current state; avoid absolutist rules."
            }
        ],
        "assignment": [
            "Run the exact TEMP anomaly example and identify the two competing names.",
            "Trace functional dependencies for Team, Service and ServiceDependency.",
            "Redesign the flawed model using a Team foreign key and query the authoritative name.",
            "Write a denormalization decision record identifying latency evidence, synchronization mechanism and permitted staleness."
        ],
        "resources": [
            {
                "title": "CMU Database Systems — Relational Design and Normal Forms",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "reference",
                "purpose": "Academic depth for functional dependencies and logical schema design"
            },
            {
                "title": "PostgreSQL — Data Definition",
                "url": "https://www.postgresql.org/docs/current/ddl.html",
                "kind": "reference",
                "purpose": "Separate tables, keys and relational facts"
            }
        ],
        "practiceObjective": "Demonstrate an actual update anomaly in a deliberately flawed representation.",
        "practiceInstructions": [
            "Run the exact TEMP anomaly example and identify the two competing names.",
            "Trace functional dependencies for Team, Service and ServiceDependency.",
            "Redesign the flawed model using a Team foreign key and query the authoritative name.",
            "Write a denormalization decision record identifying latency evidence, synchronization mechanism and permitted staleness."
        ],
        "knowledgeCheck": "What makes a duplicated fact an update anomaly? How does a partial-key dependency differ from a transitive dependency? When is a deliberately frozen historical name legitimate?",
        "warning": "Only execute changing SQL in a dedicated disposable PostgreSQL learning database. Predict the resulting rows and constraints before running a statement, and do not treat a five-row fixture as representative performance evidence."
    },
    {
        "id": "indexes",
        "title": "Indexes",
        "introduction": "Why not put an index on every column? An index is an additional physical structure maintained during writes to let PostgreSQL locate or order selected rows efficiently. First prove that the planner can choose not to use an available index on a small table, then build a larger disposable table to observe scan behavior and describe the B-tree's trade-offs. This lesson is about evidence, not promising faster queries.",
        "outcomes": [
            "Distinguish heap/sequential scanning from B-tree index lookup and ordering.",
            "Measure a candidate index on representative, disposable data and inspect the plan.",
            "Explain composite ordering, selectivity, write amplification and why unused indexes cost resources.",
            "Identify UNIQUE constraint enforcement versus ordinary performance indexes."
        ],
        "sections": [
            {
                "id": "mechanism",
                "title": "What an index changes physically",
                "body": "A B-tree maps ordered key values to locations of matching rows, reducing the need to inspect unrelated heap pages when a query is selective. PostgreSQL usually stores table tuples separately from index entries, so an Index Scan may still fetch heap data. An Index Only Scan is possible only when required columns are available through the index and tuple visibility permits it. A Seq Scan may outperform an index for a tiny table or when a large fraction of rows matches. PostgreSQL's planner estimates costs from statistics, table size, locality and available algorithms."
            },
            {
                "id": "small",
                "title": "Show why five Service rows cannot prove a speedup",
                "body": "The canonical Steward fixture contains only five Services. Run EXPLAIN SELECT ... WHERE name='Payments API' and read the reported scan node; it may be an index lookup because Service.name UNIQUE created a unique index, or the optimizer may choose a Seq Scan. Neither means a rule that indexes always/never help. Do not infer a production-scale latency improvement from a tiny microsecond result. Use the next disposable dataset for a meaningful change in row shape and candidate filtering.",
                "caption": "index_small.sql — inspect an already indexed unique Service name",
                "code": "EXPLAIN SELECT id,name FROM service WHERE name='Payments API';"
            },
            {
                "id": "lab",
                "title": "Build a deliberately larger scratch relation",
                "body": "Generate 15,000 predictable records into a TEMP table with generate_series (PostgreSQL's set-returning series function, introduced here). Start without an index; ANALYZE collects statistics; EXPLAIN (ANALYZE, BUFFERS) records actual plan, row count and buffer behavior. Create a B-tree index on the lookup key, ANALYZE again and compare the plan for a selective exact match. Record whether the planner actually switched methods; performance measurements vary with caching and CI hardware and are not universal. This is scratch data only: TEMP table disappears with its connection.",
                "caption": "index_lab.sql — compare actual physical plans on 15000 temporary rows",
                "code": "CREATE TEMP TABLE tsa_index_probe AS\nSELECT n AS id, 'service-' || lpad(n::text,5,'0') AS slug, (n % 4) AS priority\nFROM generate_series(1,15000) AS g(n);\nANALYZE tsa_index_probe;\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM tsa_index_probe WHERE slug='service-14999';\nCREATE INDEX tsa_probe_slug_idx ON tsa_index_probe(slug);\nANALYZE tsa_index_probe;\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM tsa_index_probe WHERE slug='service-14999';"
            },
            {
                "id": "composite",
                "title": "Index order is a property of workload, not naming preference",
                "body": "A B-tree on (lifecycle, criticality) has ordered entries first by lifecycle, then criticality within each lifecycle. Equality on the leading lifecycle column may help bound the search; criticality alone need not use the same prefix efficiently. PostgreSQL can use various access strategies, including skip scans in applicable versions, so 'never used' is too absolute. Columns used for equality, range, join and ordering—and their selectivity—should drive the choice. For a selective slug lookup, a single-column B-tree is simpler."
            },
            {
                "id": "costs",
                "title": "Indexes slow some writes and occupy storage",
                "body": "An INSERT often needs to add entries to every relevant index; UPDATE of indexed values must maintain those entries; DELETE later requires cleanup/vacuum. Unique indexes reject duplicate keys, but declare business uniqueness as a UNIQUE constraint to express domain intent. Do not create a redundant index on an existing primary/unique key without checking catalog definitions. You should be able to justify both the read improvement and the write/storage cost in a short review."
            }
        ],
        "assignment": [
            "Execute EXPLAIN on the canonical Service fixture and explain why its five rows are inconclusive.",
            "Run index_lab.sql in one psql session; record pre/post plan nodes, actual row counts and buffer activity.",
            "Explain which real Service queries benefit from an index on (lifecycle,criticality) versus a unique slug.",
            "Write a measurable decision: when should the extra index remain or be removed?"
        ],
        "resources": [
            {
                "title": "PostgreSQL — Indexes",
                "url": "https://www.postgresql.org/docs/current/indexes.html",
                "kind": "reference",
                "purpose": "B-tree access, multicolumn index rules and index costs"
            },
            {
                "title": "PostgreSQL — EXPLAIN",
                "url": "https://www.postgresql.org/docs/current/using-explain.html",
                "kind": "reference",
                "purpose": "Plan behavior and cost evidence"
            },
            {
                "title": "CMU 15-445 Fall 2025 — Indexes, Query Planning and Execution",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lectures #08–#09 and #13–#15, optional deep dive",
                "purpose": "Compare B-tree internals and physical query algorithms with declarative SQL; full recordings not claimed watched"
            }
        ],
        "practiceObjective": "Distinguish heap/sequential scanning from B-tree index lookup and ordering.",
        "practiceInstructions": [
            "Execute EXPLAIN on the canonical Service fixture and explain why its five rows are inconclusive.",
            "Run index_lab.sql in one psql session; record pre/post plan nodes, actual row counts and buffer activity.",
            "Explain which real Service queries benefit from an index on (lifecycle,criticality) versus a unique slug.",
            "Write a measurable decision: when should the extra index remain or be removed?"
        ],
        "knowledgeCheck": "Why might PostgreSQL deliberately use Seq Scan when an index exists? What work does each index add to writes? Why does creating a UNIQUE constraint imply indexing but not all indexes imply uniqueness?",
        "warning": "Only execute changing SQL in a dedicated disposable PostgreSQL learning database. Predict the resulting rows and constraints before running a statement, and do not treat a five-row fixture as representative performance evidence."
    },
    {
        "id": "query-plans",
        "title": "Query Plans and EXPLAIN",
        "introduction": "SQL expresses which answer you want. PostgreSQL's query planner selects how to produce it: scans, joins, sorts and aggregate operators. EXPLAIN reveals that physical plan, while EXPLAIN ANALYZE executes the query and adds actual observations. The goal is to explain each plan node's role and avoid false performance inferences.",
        "outcomes": [
            "Distinguish estimates from measured rows, loops and buffers.",
            "Read a plan from lower operators through final output.",
            "Explain when Hash Join, Nested Loop, Sort and Aggregate nodes can appear.",
            "Use a safe read-only EXPLAIN ANALYZE without changing business data."
        ],
        "sections": [
            {
                "id": "physical",
                "title": "Logical join versus physical implementation",
                "body": "The previous JOIN lesson taught the set of row pairs returned by ON. PostgreSQL may execute that logical join as a Nested Loop (probe another input per row), a Hash Join (build an in-memory hash table on one side then probe with the other), or a Merge Join (consume sorted inputs). The same query can use different physical plans when table size or statistics change. Do not rewrite correct SQL solely because one tiny sample shows an unfamiliar node."
            },
            {
                "id": "read-plan",
                "title": "Read the plan from the leaves upward",
                "body": "Scans produce rows; a Join combines them; Sort orders them; Aggregate/HashAggregate groups and calculates metrics. Plans usually show estimated startup/total cost and estimated rows, then, with ANALYZE, actual times/rows/loops. The actual row count is per loop, so loops matter when estimating total work. With BUFFERS, shared hit/read show buffer-cache activity, not necessarily physical disk writes in a simple one-to-one mapping. Costs are planner units, not milliseconds. The final runtime includes startup, execution and instrumentation factors."
            },
            {
                "id": "run",
                "title": "Observe a safe join/aggregate plan",
                "body": "The fixture query below is read-only. It must return Identity 1, Payments 2, Platform 2 independent of the physical join plan. Compare EXPLAIN without ANALYZE and EXPLAIN (ANALYZE, BUFFERS) to see the added evidence; record scan nodes, join type, aggregation node and row estimates. The five-row source is suitable for learning node names, not for judging scalability.",
                "caption": "explain_join.sql — inspect query plan and correct grouped result",
                "code": "EXPLAIN (ANALYZE, BUFFERS)\nSELECT t.name, COUNT(s.id) AS n\nFROM team t LEFT JOIN service s ON s.owning_team_id=t.id\nGROUP BY t.id,t.name\nORDER BY t.name;"
            },
            {
                "id": "wrong-fix",
                "title": "Estimated rows are hypotheses, not guarantees",
                "body": "PostgreSQL uses statistics to estimate selectivity and result sizes. A bad row estimate may arise from stale statistics, correlated predicates, skew or misleading sample size. ANALYZE updates statistics; it is not the same as EXPLAIN ANALYZE. Before adding an index, inspect predicates, row counts, result width and the data distribution. EXPLAIN ANALYZE on UPDATE/DELETE actually performs the mutation; never run it on live data without an appropriately controlled rollback, and remember even rolled-back changes can cause side effects in some operations."
            },
            {
                "id": "interpret",
                "title": "Avoid optimizing a synthetic benchmark",
                "body": "If query A is 0.1ms and B 0.08ms on a CI runner, noise and cache warmth can dominate. Record hardware, PostgreSQL version, data size, parameters, plan and repeated runs. A plan may improve CPU work while increasing storage/write cost, or behave differently with real correlated data. The learner's task is to form a falsifiable performance hypothesis rather than award a trophy to an index after one execution."
            }
        ],
        "assignment": [
            "Execute explain_join.sql and annotate source scans, join and aggregate nodes.",
            "Explain planner cost versus actual time and why loops × rows per loop matters.",
            "Produce an EXPLAIN (non-executing) plan for a different read query.",
            "Identify one realistic row-estimation hypothesis and design a safe experiment to test it."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Using EXPLAIN",
                "url": "https://www.postgresql.org/docs/current/using-explain.html",
                "kind": "reference",
                "purpose": "Planner outputs, timings and scan strategies"
            },
            {
                "title": "CMU 15-445 Fall 2025 — Indexes, Query Planning and Execution",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lectures #08–#09 and #13–#15, optional deep dive",
                "purpose": "Compare B-tree internals and physical query algorithms with declarative SQL; full recordings not claimed watched"
            }
        ],
        "practiceObjective": "Distinguish estimates from measured rows, loops and buffers.",
        "practiceInstructions": [
            "Execute explain_join.sql and annotate source scans, join and aggregate nodes.",
            "Explain planner cost versus actual time and why loops × rows per loop matters.",
            "Produce an EXPLAIN (non-executing) plan for a different read query.",
            "Identify one realistic row-estimation hypothesis and design a safe experiment to test it."
        ],
        "knowledgeCheck": "What is the difference between EXPLAIN and EXPLAIN ANALYZE? Why is cost not latency? What makes a plan decision credible if a query has a small dataset?",
        "warning": "Only execute changing SQL in a dedicated disposable PostgreSQL learning database. Predict the resulting rows and constraints before running a statement, and do not treat a five-row fixture as representative performance evidence."
    },
    {
        "id": "query-performance",
        "title": "Query Performance",
        "introduction": "Performance engineering means defining a symptom, creating a representative workload, recording a baseline, changing one factor and retaining only changes justified by evidence. A clever SQL rewrite is not a goal; a measured improvement for an actual use case is.",
        "outcomes": [
            "Define p50/p95 latency, throughput and row-volume requirements rather than 'fast'.",
            "Separate database server time from network and application serialization time.",
            "Design a controlled before/after comparison including data distribution and warm-up.",
            "Identify risks of unbounded lists, N+1 requests, OFFSET pagination and premature indexes."
        ],
        "sections": [
            {
                "id": "goal",
                "title": "An objective has a workload and a threshold",
                "body": "'Search p95 ≤ 300ms at 40 requests/s over 100,000 Services' is testable; 'faster SQL' is not. p95 summarizes the slow tail of a latency distribution; throughput describes work completed per unit time. PostgreSQL EXPLAIN ANALYZE measures database execution in a local query, not HTTP end-to-end time, TLS, queueing, DRF serialization or network effects. Define which layer you measured. A query can have good p50 and unacceptable p95 under load."
            },
            {
                "id": "control",
                "title": "Change one variable at a time",
                "body": "Seed a representative number of rows with relevant selectivity and skew, run the same query/parameters repeatedly before and after an index or rewritten predicate, and record row counts, plan nodes and median/spread. Avoid changing query, index, hardware and data simultaneously. Cold-cache and warm-cache conditions may differ. A tiny sample with only five Services is inadequate for most optimization conclusions."
            },
            {
                "id": "patterns",
                "title": "What typical bottlenecks look like",
                "body": "An unbounded list returns excessive rows and JSON bytes; pagination must define stable ordering and permission filtering. An N+1 Django view can send one query per Service relationship; the remedy is usually fetching related data deliberately, not changing one index. A large OFFSET forces skipping many rows; keyset pagination can help when the ordering keys and consistency semantics are suitable. A wide SELECT * may fetch data that the client never uses. Indexing helps selective predicates, but an index on every field increases write costs."
            },
            {
                "id": "baseline",
                "title": "A repeatable workload and inspectable result",
                "body": "Use the 15,000-row scratch fixture from Indexes or establish it in a new psql session. Compare an equality lookup and a low-selectivity priority predicate. Record the before/after EXPLAIN plan and actual row count, but do not claim an SLA based on one local run. Explain whether the query is CPU-bound, scan-heavy or round-trip-bound from evidence rather than guesses.",
                "caption": "performance_probe.sql — compare selective and broad predicates",
                "code": "CREATE TEMP TABLE tsa_perf_probe AS\nSELECT n AS id, (n % 4) AS priority, 'svc-' || n::text AS name\nFROM generate_series(1,15000) AS g(n);\nANALYZE tsa_perf_probe;\nEXPLAIN (ANALYZE, BUFFERS) SELECT id FROM tsa_perf_probe WHERE id=14777;\nEXPLAIN (ANALYZE, BUFFERS) SELECT id FROM tsa_perf_probe WHERE priority=1;"
            },
            {
                "id": "decision",
                "title": "Decide what to keep, and write down uncertainty",
                "body": "State the observed baseline, intervention, resulting plan and timings, test environment and known limitations. If plans do not change after creating an index, that is valuable evidence: investigate selectivity, table size, ANALYZE statistics and query shape instead of forcing an index. If improving one query slows writes, quantify the cost and decide based on the actual product workload. This is an evidence-backed choice, not a rule that every measured improvement deserves a deployment."
            }
        ],
        "assignment": [
            "Write a measurable query objective with traffic/data assumptions and acceptance threshold.",
            "Run the disposable performance_probe.sql and inspect two contrasting plans.",
            "Choose one candidate index or predicate change, run controlled comparisons and document results and caveats.",
            "Explain how you would measure HTTP end-to-end p95 separately from database EXPLAIN timing."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Performance Tips",
                "url": "https://www.postgresql.org/docs/current/performance-tips.html",
                "kind": "reference",
                "purpose": "Explain, statistics and benchmark limits"
            },
            {
                "title": "PostgreSQL — EXPLAIN",
                "url": "https://www.postgresql.org/docs/current/using-explain.html",
                "kind": "reference",
                "purpose": "Interpretation of actual-versus-estimated query costs"
            },
            {
                "title": "CMU 15-445 Fall 2025 — Indexes, Query Planning and Execution",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "read": "Lectures #08–#09 and #13–#15, optional deep dive",
                "purpose": "Compare B-tree internals and physical query algorithms with declarative SQL; full recordings not claimed watched"
            }
        ],
        "practiceObjective": "Define p50/p95 latency, throughput and row-volume requirements rather than 'fast'.",
        "practiceInstructions": [
            "Write a measurable query objective with traffic/data assumptions and acceptance threshold.",
            "Run the disposable performance_probe.sql and inspect two contrasting plans.",
            "Choose one candidate index or predicate change, run controlled comparisons and document results and caveats.",
            "Explain how you would measure HTTP end-to-end p95 separately from database EXPLAIN timing."
        ],
        "knowledgeCheck": "How do database execution time and API request latency differ? Why could a valid index change slow overall throughput? What makes a before/after comparison credible?",
        "warning": "Only execute changing SQL in a dedicated disposable PostgreSQL learning database. Predict the resulting rows and constraints before running a statement, and do not treat a five-row fixture as representative performance evidence."
    },
    {
        "id": "postgresql-practice",
        "title": "PostgreSQL in Practice",
        "introduction": "The database is a server with roles, connections, schemas and maintenance responsibilities. A local exercise may function when connected as the owner, yet fail when an application role lacks SELECT or a table exists in another schema. Learn to inspect effective identity, privileges and running sessions before assuming an ORM or PostgreSQL server has broken.",
        "outcomes": [
            "Inspect connection, current database, role, search path, visible tables and constraints.",
            "Distinguish a role that owns schema objects from a narrowly privileged application role.",
            "Use psql introspection and SQL metadata to diagnose failures without exposing credentials.",
            "Explain which backups and restore tests must be owned by operations and reliability work."
        ],
        "sections": [
            {
                "id": "context",
                "title": "A connection has more identity than its hostname",
                "body": "psql is a client; it connects to one PostgreSQL server endpoint, selects a database, authenticates as a role and uses a search_path to resolve unqualified table names into schemas. SELECT current_database(), current_user, current_schema() are real checks, not assumptions. A successful login does not grant every table privilege. Database CONNECT, schema USAGE and table SELECT/INSERT/UPDATE/DELETE are distinct authorization boundaries."
            },
            {
                "id": "toolkit",
                "title": "Use the client and catalogs as evidence",
                "body": "In interactive psql, \\conninfo explains the current connection, \\l lists databases, \\dn schemas, \\dt tables, \\d service describes an object and \\du describes roles. These backslash commands are interpreted by the client, not sent as SQL; the command-line syntax must use an actual backslash in a psql terminal. The following SQL query can run noninteractively in the dedicated lab. Compare the reported database/user/schema with what your project config expects.",
                "caption": "postgresql_inspect.sql — verify connection and visible Service relation",
                "code": "SELECT current_database(), current_user, current_schema();\nSELECT table_name FROM information_schema.tables\nWHERE table_schema='public' AND table_name IN ('team','service','environment','service_dependency')\nORDER BY table_name;",
                "output": "First query: tsa_steward_lab | tsa_learner | public (under the CI lab setup).\nSecond query: environment, service, service_dependency, team."
            },
            {
                "id": "privilege",
                "title": "Least privilege is a design that can be tested",
                "body": "A schema owner/migration role may CREATE/ALTER tables, while a runtime application role should normally receive only the minimum operations needed. An API that lists Services may need SELECT on Service and Team, but creating Services requires INSERT and SELECT of related tables, with extra sequence privileges depending on identity/default setup. Avoid application superuser credentials and never commit passwords to a repo. Some privileges are inherited through roles; explain the effective privileges rather than blindly guessing GRANT strings."
            },
            {
                "id": "operational",
                "title": "Connection failures have distinct causes",
                "body": "Missing psql executable is a client setup failure; connection refused is usually a transport/listener issue; role authentication failure happens before authorization; missing database is a target-selection error; permission denied on a relation is an authenticated session that lacks a SQL privilege; missing relation may be wrong search_path, schema or migration state. The next action differs for each. Use psql -X -v ON_ERROR_STOP=1 when scripting; inspect errors rather than swallowing failures."
            },
            {
                "id": "backup",
                "title": "A backup is not a recoverability claim until restore works",
                "body": "pg_dump produces a logical export for a chosen database; it is not the same as a physical WAL-based backup or point-in-time recovery. A restore drill must verify that the data can be reconstructed and queried in an isolated destination, with tested credentials and time limits. These operations belong to later Platform and Reliability courses; Builder must recognize the handoff, not pretend that a copied SQL file proves recovery."
            }
        ],
        "assignment": [
            "Run the connection/catalog query and document observed database, role and visible objects without secrets.",
            "Use psql meta-commands to inspect one table and one role; map each to the relevant SQL catalog.",
            "Design a least-privilege role for a read-only Service viewer and predict permission-denied behavior.",
            "Write a diagnosis table for client missing, listener failure, bad credentials, schema mismatch and insufficient privileges."
        ],
        "resources": [
            {
                "title": "PostgreSQL — psql Client",
                "url": "https://www.postgresql.org/docs/current/app-psql.html",
                "kind": "reference",
                "purpose": "Connection and object introspection"
            },
            {
                "title": "PostgreSQL — Privileges",
                "url": "https://www.postgresql.org/docs/current/ddl-priv.html",
                "kind": "reference",
                "purpose": "Rights and schema/table boundaries"
            }
        ],
        "practiceObjective": "Inspect connection, current database, role, search path, visible tables and constraints.",
        "practiceInstructions": [
            "Run the connection/catalog query and document observed database, role and visible objects without secrets.",
            "Use psql meta-commands to inspect one table and one role; map each to the relevant SQL catalog.",
            "Design a least-privilege role for a read-only Service viewer and predict permission-denied behavior.",
            "Write a diagnosis table for client missing, listener failure, bad credentials, schema mismatch and insufficient privileges."
        ],
        "knowledgeCheck": "Why does successful login not prove SELECT privilege on Service? How do database versus schema differ? What evidence would prove an actual backup can be restored?",
        "warning": "Only execute changing SQL in a dedicated disposable PostgreSQL learning database. Predict the resulting rows and constraints before running a statement, and do not treat a five-row fixture as representative performance evidence."
    },
    {
        "id": "django-orm",
        "title": "Django ORM: QuerySets, Evaluation and SQL",
        "introduction": "Django QuerySets are lazy descriptions of relational queries, not preloaded Python lists. Their value is expressing familiar data questions through models while PostgreSQL remains responsible for filtering, joins, grouping and transactional consistency. Before optimizing or trusting a serializer, trace a QuerySet from Python construction to actual SQL and identify the exact point at which it queries the server.",
        "outcomes": [
            "Construct a QuerySet without accidentally executing it and distinguish its lazy representation from evaluated rows.",
            "Inspect generated SQL and predict WHERE, JOIN and ORDER BY clauses from the model expression.",
            "Compare list(), iterator(), count(), exists() and per-object relationship access by database behavior.",
            "Use the same canonical Service.owning_team FK and production lifecycle semantics as the SQL lab."
        ],
        "sections": [
            {
                "id": "map",
                "title": "Mapping a ForeignKey creates an SQL relationship, not an in-memory pointer",
                "body": "The Django-managed lab defines Team, Service and Environment. Service.owning_team is a ForeignKey; PostgreSQL stores its identity as service.owning_team_id. In Python the field acts like an attribute: assigning a Team instance makes Django save the referenced identity. PostgreSQL still checks referential integrity; Django's model convenience does not make a missing Team legal. A QuerySet over Service can select related Team fields by generating SQL JOINs. A model object is not a guarantee that related rows have been fetched."
            },
            {
                "id": "lazy",
                "title": "Query construction is different from execution",
                "body": "filter(lifecycle='production') returns a QuerySet describing a predicate; .order_by('name','id') changes its SQL sort; select_related('owning_team') instructs the ORM to fetch a single-valued relationship with a JOIN. Most QuerySet construction remains lazy. Iteration/list()/len() evaluates and caches data; count() may issue SELECT COUNT(*) instead of materializing all rows; exists() asks whether a row exists. Beware that repr(), slicing with a step, boolean evaluation or serialization can also trigger SQL. Once a QuerySet result cache exists, repeated iteration of that same instance may reuse rows, but a *new* QuerySet typically queries again."
            },
            {
                "id": "runnable",
                "title": "Prove no SQL before evaluation, then observe the actual JOIN",
                "body": "Run this in python manage.py shell after migrating the separate Django-managed lab. CaptureQueriesContext counts actual SQL statements for this connection. Inspecting str(qs.query) renders the planned SQL but does not fetch rows; list(qs) executes. Compare with the generated SQL from the earlier PostgreSQL JOIN lesson. This example works with zero or many Service rows; the measured statement count rather than a guessed record name is the assertion.",
                "language": "python",
                "caption": "orm_lazy.py — real QuerySet evaluation and related-Team JOIN",
                "code": "from django.db import connection\nfrom django.test.utils import CaptureQueriesContext\nfrom registry.models import Service\n\nwith CaptureQueriesContext(connection) as recorded:\n    qs = (Service.objects.filter(lifecycle=\"production\")\n          .select_related(\"owning_team\").order_by(\"name\", \"id\"))\n    query = str(qs.query)\n    assert \"JOIN\" in query.upper() and \"ORDER BY\" in query.upper()\n    before_evaluation = len(recorded)\n    rows = [(s.name, s.owning_team.name) for s in qs]\n    after_evaluation = len(recorded)\nassert before_evaluation == 0\nassert after_evaluation == 1\nprint(\"ORM lazy:\", before_evaluation, \"SQL statements before evaluation; then\", after_evaluation)\nprint(\"Services found:\", len(rows))",
                "output": "ORM lazy: 0 SQL statements before evaluation; then 1. Services found depends on the Django lab's seeded rows."
            },
            {
                "id": "query-count",
                "title": "exists, count and list answer different questions",
                "body": "If the API only needs to decide whether a production-stage Service exists, .exists() avoids transporting the whole relation. For a count, .count() usually issues an aggregate query, but the exact number of server round trips depends on whether the QuerySet result is already cached. list(qs) materializes model instances with associated object allocation and data transfer. Use QuerySet.explain() on a read query to ask PostgreSQL for a plan; query plan cost and network latency are separate concerns. The next N+1 lesson demonstrates how a harmless-looking attribute access can multiply queries."
            },
            {
                "id": "negative",
                "title": "The cache can hide a bad access pattern in an experiment",
                "body": "When measuring SQL, create a *fresh* QuerySet inside each CaptureQueriesContext; reusing a previously evaluated list or QuerySet can falsely report zero additional queries. A select_related join is appropriate for owning_team, a single-valued FK, but generally not for the reverse Environment collection; many-valued relationships require a different retrieval plan, introduced later. Explain which real SQL statements the framework sent, not merely which Python methods appeared."
            }
        ],
        "assignment": [
            "Execute orm_lazy.py in the separate Django/PostgreSQL lab and capture the printed SQL and query count.",
            "Before executing, predict the roles of WHERE lifecycle, JOIN Team, ORDER BY name and id.",
            "Compare .exists(), .count() and list() for one question without mistakenly reusing a cached queryset.",
            "Explain why select_related is not a universal solution for every related collection."
        ],
        "resources": [
            {
                "title": "Django 5.2 — Making Queries",
                "url": "https://docs.djangoproject.com/en/5.2/topics/db/queries/",
                "kind": "reference",
                "purpose": "QuerySet evaluation and relationships."
            },
            {
                "title": "Django 5.2 — QuerySet API",
                "url": "https://docs.djangoproject.com/en/5.2/ref/models/querysets/",
                "kind": "reference",
                "purpose": "Exact lazy evaluation, select_related and query diagnostics."
            },
            {
                "title": "PostgreSQL — Using EXPLAIN",
                "url": "https://www.postgresql.org/docs/current/using-explain.html",
                "kind": "reference",
                "purpose": "Underlying execution-plan mechanism."
            }
        ],
        "practiceObjective": "Prove that the ORM is a declarative SQL interface by measuring construction, evaluation and one related JOIN.",
        "practiceInstructions": [
            "Migrate the isolated Django lab and execute orm_lazy.py.",
            "Record SQL, row count, zero statements at construction and one at evaluation.",
            "Compare count/exists/list and show which behavior was actually observed.",
            "Explain one case in which accessing related fields can unexpectedly trigger queries."
        ],
        "knowledgeCheck": "When does a QuerySet query PostgreSQL? Can reading qs.query execute the query? What does select_related change physically? Why should you create a fresh QuerySet when measuring query counts?"
    },
    {
        "id": "orm-vs-sql",
        "title": "ORM versus SQL: Equivalent Answers, Different Boundaries",
        "introduction": "ORM and raw SQL are not rival doctrines. Both submit relational operations to PostgreSQL; the important engineering question is which interface preserves correctness, safety, observability and maintainability for a particular operation. Compare an actual case-insensitive Service name search written in both interfaces, using bound parameters. Then deliberately contrast a string-interpolated query that would be unsafe with untrusted input.",
        "outcomes": [
            "Prove an ORM and parameterized SQL query return the same Service identities.",
            "Explain how bound parameters differ from interpolating untrusted input into executable SQL syntax.",
            "Choose an ORM, raw SQL or database view based on real complexity and performance evidence.",
            "Explain which transaction/authorization boundaries remain necessary regardless of query interface."
        ],
        "sections": [
            {
                "id": "equivalence",
                "title": "Start by specifying the same logical relation",
                "body": "Our query is: return Service names containing 'pay', sorted by name. The ORM form is .filter(name__icontains=needle).order_by('name').values_list('name',flat=True). PostgreSQL ILIKE offers equivalent case-insensitive pattern matching for a simple ASCII substring. QuerySet parameterization is built into Django's expression compiler. Raw cursor.execute supports a SQL text containing %s placeholders plus a separate parameters list; the driver binds those values safely. Both operate on the *same database* and must use the same data and result-order contract before comparing performance."
            },
            {
                "id": "execute",
                "title": "Run both on the same PostgreSQL connection",
                "body": "Execute this inside the Django shell with the canonical registry model. The query works even if no matching Service exists, though the full lab ordinarily has Payments API and Payroll API. The percent characters inside the parameter make a substring pattern; do not manually quote the placeholder in the SQL text. Assert result equality and print the outcome. This is SQL-backed execution, not a Python imitation of database filtering.",
                "language": "python",
                "caption": "orm_equivalence.py — identical ORM and bound-SQL results",
                "code": "from django.db import connection\nfrom registry.models import Service\n\nneedle = \"pay\"\norm_names = list(Service.objects.filter(\n    name__icontains=needle).order_by(\"name\").values_list(\"name\", flat=True))\nwith connection.cursor() as cursor:\n    cursor.execute(\n        \"SELECT name FROM service WHERE name ILIKE %s ORDER BY name\",\n        [\"%\" + needle + \"%\"],\n    )\n    sql_names = [row[0] for row in cursor.fetchall()]\nassert orm_names == sql_names, (orm_names, sql_names)\nprint(\"ORM/SQL equivalent:\", len(orm_names), \"matching Services\")",
                "output": "ORM/SQL equivalent: N matching Services, where N depends on the test database."
            },
            {
                "id": "unsafe",
                "title": "A SQL injection risk is about syntax crossing a trust boundary",
                "body": "Do not construct SQL as '... WHERE name = ' + user_input or using f-strings around untrusted values. A malicious value can terminate a quote or introduce an unintended expression, changing the SQL parsed by PostgreSQL. A bound parameter is sent as data, not an SQL identifier or arbitrary syntax. Parameter placeholders generally cannot substitute for table names or ORDER BY column identifiers: those must be chosen from a server-owned allowlist. Do not execute a vulnerable string against the real registry simply to prove it is vulnerable. The safe experiment is to pass a quote or wildcard-like string through the bound parameter and observe a normal zero/matching result, not a changed query structure."
            },
            {
                "id": "tradeoffs",
                "title": "Choosing based on team and operational cost",
                "body": "Routine CRUD and relationship traversal are often clearest through the ORM, which integrates with model constraints, transactions and existing Django code. PostgreSQL-specific reporting, window functions, extensions or complex recursive SQL can sometimes be clearer in well-reviewed parameterized SQL. But raw SQL also couples the code to table/column naming, migrations and database dialect. Performance is not decided by ORM-versus-SQL alone: inspect generated SQL and EXPLAIN with representative data. A hand-crafted SQL statement can be slower than an ORM-generated one and vice versa."
            },
            {
                "id": "boundary",
                "title": "Authorization is not automatically provided by either API",
                "body": "Neither QuerySet.filter nor cursor.execute proves the subject is allowed to see the requested Service. Apply the same trusted Team scope and query result contract in either implementation. A careless raw-SQL reporting endpoint could bypass an ORM manager that normally scopes rows, while an unscoped Service.objects.all() is equally dangerous. For each query identify where permission filtering, schema assumptions, transaction scope, data binding and output mapping occur. Compare them explicitly in review."
            }
        ],
        "assignment": [
            "Run orm_equivalence.py with actual data and record both result sets.",
            "Write a second equivalent query involving Team ownership and compare its returned rows before considering speed.",
            "Test a name containing a quote via a bound parameter without interpolating it into SQL.",
            "Write a decision record: choose ORM or SQL, list evidence and name one query-authorization risk to defend."
        ],
        "resources": [
            {
                "title": "Django — Performing raw SQL queries",
                "url": "https://docs.djangoproject.com/en/5.2/topics/db/sql/",
                "kind": "reference",
                "purpose": "Cursor placeholders and model query alternatives."
            },
            {
                "title": "Django — QuerySet API",
                "url": "https://docs.djangoproject.com/en/5.2/ref/models/querysets/",
                "kind": "reference",
                "purpose": "ORM query semantics and generated SQL."
            },
            {
                "title": "PostgreSQL — SQL Syntax",
                "url": "https://www.postgresql.org/docs/current/sql-syntax.html",
                "kind": "reference",
                "purpose": "SQL literal/identifier distinction and server parsing."
            }
        ],
        "practiceObjective": "Compare equivalent real ORM and bound PostgreSQL queries, including untrusted-input handling and authorization risk.",
        "practiceInstructions": [
            "Run orm_equivalence.py and check identical results.",
            "Add one JOIN-based question and map it to ORM fields versus raw table columns.",
            "Test a quoted text needle with bound parameters, never with interpolation.",
            "Inspect explain plans where useful, and document which interface better preserves team needs."
        ],
        "knowledgeCheck": "When does ORM syntax still generate SQL? What does cursor.execute's params argument prevent? Can you bind a column name as %s? Why does a raw SQL query require the same authorization as an ORM query?"
    },
    {
        "id": "n-plus-one",
        "title": "The N+1 Problem: Measure Related-Object Queries",
        "introduction": "An ORM query that fetches ten Services can return in one database round trip, yet a loop touching each Service's owning Team may trigger another ten SELECTs. That 1+N pattern is an N+1 query. It matters because network/DB round-trip overhead and repeated work grow with the number of returned rows even if each SELECT is individually fast. Build a deterministic lab, measure the defect, then choose select_related for a single-valued FK and prefetch_related for a many-valued reverse relation.",
        "outcomes": [
            "Observe exactly 1+N queries for uncached Service.owning_team access and one query after select_related.",
            "Demonstrate prefetch_related reduces reverse Environment loading to a bounded number of queries.",
            "Explain why one-to-many joins can multiply result rows and why select_related is limited to single-valued relationships.",
            "Defend query-count measurement without conflating it with production latency."
        ],
        "sections": [
            {
                "id": "mechanism",
                "title": "The hidden SELECT in a seemingly harmless property",
                "body": "Django normally stores the Team identity in Service.owning_team_id. When an uncached Service object is asked for .owning_team, the ORM must fetch the Team record unless it was populated already. A typical list serializer loops through N distinct Service objects, causing one Service SELECT plus one Team SELECT for every item. Two Services owned by the same Team may still cause separate Team lookups because the objects are not necessarily sharing one global relation cache. This cost is mostly invisible in a five-row development database, but scales with the number of objects."
            },
            {
                "id": "measure",
                "title": "Run an intentionally inefficient listing and then fix it",
                "body": "The executable shell lab creates four disposable Services owned by one teaching Team; the name prefix ensures the measurement is isolated from other data. CaptureQueriesContext counts exact SQL statements after seeding. The first fresh QuerySet yields 1+4 = 5 (one list query and four Team lazy fetches). With select_related('owning_team') the second fresh QuerySet performs one SQL query that joins Team. Verify the results are identical and compare statement counts before and after; no timing claims are necessary.",
                "language": "python",
                "caption": "nplusone_fk.py — measure five queries versus one on the same Service rows",
                "code": "from django.db import connection\nfrom django.test.utils import CaptureQueriesContext\nfrom registry.models import Team, Service\n\nteam, _ = Team.objects.get_or_create(name=\"N1 Teaching Team\")\nfor n in range(4):\n    Service.objects.get_or_create(\n        name=f\"N1 Demo {n}\",\n        defaults={\"owning_team\": team, \"endpoint\": f\"https://n1-{n}.example.invalid\"},\n    )\ndef listing(queryset):\n    return [(row.name, row.owning_team.name) for row in queryset]\n\nwith CaptureQueriesContext(connection) as before:\n    slow = listing(Service.objects.filter(name__startswith=\"N1 Demo\").order_by(\"name\"))\nwith CaptureQueriesContext(connection) as after:\n    fast = listing(Service.objects.filter(name__startswith=\"N1 Demo\")\n                   .select_related(\"owning_team\").order_by(\"name\"))\nassert slow == fast and len(slow) == 4\nassert len(before) == 5, len(before)\nassert len(after) == 1, len(after)\nprint(\"N+1 owner queries:\", len(before), \"->\", len(after))",
                "output": "N+1 owner queries: 5 -> 1"
            },
            {
                "id": "reverse",
                "title": "The reverse Environment collection needs a different approach",
                "body": "A Service can have many Environment rows. Combining them through an ordinary JOIN can multiply the Service result rows and change the apparent list cardinality; select_related cannot fetch an arbitrary many-valued reverse FK collection. Instead prefetch_related('environment_set') performs one Service query and one additional Environment query, then associates each child list to the correct Service object in memory. If some Services have no Environments, they still remain in the outer collection. The exact default reverse accessor in this teaching model is environment_set because no related_name was configured; rename it only if the model definition changes and tests follow."
            },
            {
                "id": "verify-reverse",
                "title": "Prove two queries for a multi-valued relation",
                "body": "Run this after the preceding N+1 demo so the four Services exist. Seed one Environment per Service without modifying production data; the Django-managed lab is isolated. Inspect the SQL count for the prefetch variant, and verify that every Service has one teaching Environment. A prefetch can still use significant memory for a huge related collection; if the API needs only aggregate counts, a database-side annotation may be better than loading every child.",
                "language": "python",
                "caption": "nplusone_reverse.py — prefetch a many-valued Environment relation",
                "code": "from django.db import connection\nfrom django.test.utils import CaptureQueriesContext\nfrom registry.models import Environment, Service\n\nrows = list(Service.objects.filter(name__startswith=\"N1 Demo\"))\nassert len(rows) == 4\nfor row in rows:\n    Environment.objects.get_or_create(\n        service=row, name=\"Teaching\", defaults={\"kind\": \"development\"},\n    )\nwith CaptureQueriesContext(connection) as queries:\n    results = list(Service.objects.filter(name__startswith=\"N1 Demo\")\n                   .order_by(\"name\").prefetch_related(\"environment_set\"))\n    groups = [[e.name for e in service.environment_set.all()] for service in results]\nassert len(queries) == 2, len(queries)\nassert len(groups) == 4 and all(group == [\"Teaching\"] for group in groups)\nprint(\"N+1 reverse queries:\", len(queries), \"for\", len(results), \"Services\")",
                "output": "N+1 reverse queries: 2 for 4 Services"
            },
            {
                "id": "diagnose",
                "title": "Choose the retrieval shape from the relationship, not the method name",
                "body": "For Service → owning Team (many-to-one) use select_related when the API needs Team fields for each Service. For Service → many Environments, use prefetch_related when the API needs child lists. For a count per Service, annotate a Count rather than loading all Environment records may be more efficient. For paginated lists, apply authorization and page ordering before fetching related rows, then inspect actual query count. Query-count regression guards are valuable, but physical execution time depends on row volume, indexes, DB load, cache and connection distance; do not claim a guaranteed latency improvement from 5→1 queries alone."
            }
        ],
        "assignment": [
            "Execute nplusone_fk.py and record 5 versus 1 actual database queries and identical output.",
            "Execute nplusone_reverse.py and record 2 statements for four Services plus their environments.",
            "Inspect the SQL of one select_related and one prefetch query; describe which joins run in PostgreSQL and which association happens in Python.",
            "Describe a case in which prefetching every child wastes memory and an aggregate count would be preferable."
        ],
        "resources": [
            {
                "title": "Django 5.2 — QuerySet select_related and prefetch_related",
                "url": "https://docs.djangoproject.com/en/5.2/ref/models/querysets/",
                "kind": "reference",
                "purpose": "Official FK JOIN, reverse relationship prefetch, evaluation and memory semantics."
            },
            {
                "title": "Django 5.2 — Testing Tools",
                "url": "https://docs.djangoproject.com/en/5.2/topics/testing/tools/",
                "kind": "reference",
                "purpose": "Query-count testing and observable SQL."
            },
            {
                "title": "PostgreSQL — EXPLAIN",
                "url": "https://www.postgresql.org/docs/current/using-explain.html",
                "kind": "reference",
                "purpose": "Database plans remain distinct from network round-trip counts."
            }
        ],
        "practiceObjective": "Reproduce a real N+1 with the canonical Django/PostgreSQL models and prove bounded query counts using the right retrieval tool.",
        "practiceInstructions": [
            "Run the exact FK and reverse examples in the dedicated Django lab.",
            "Record 5→1 and 2 query counts; if they differ inspect caching and QuerySet freshness rather than modifying expected numbers.",
            "Compare output equality with and without eager loading.",
            "Write an API serialization example that would trigger N+1 and protect it with an automated query-count regression."
        ],
        "knowledgeCheck": "Why does owning_team_id alone not imply Team fields are loaded? Why can't select_related fetch a one-to-many collection? Is fewer SQL statements a proof of faster p95 latency?"
    },
    {
        "id": "migrations",
        "title": "Database Migrations: Expand, Backfill, Validate, Contract",
        "introduction": "Database schema is persistent shared state, not a Python class declaration that can be replaced whenever code changes. A migration changes what existing writers/readers can safely assume, and must tolerate populated rows and mixed application versions during rollout. Use the canonical Service fixture to perform a reversible expand/backfill/constraint example, then relate each step to Django's historical migration model.",
        "outcomes": [
            "Distinguish migration source files, applied migration history, model code and actual PostgreSQL schema.",
            "Demonstrate why adding a required column without a backfill can reject existing data.",
            "Run reversible expand/backfill/constraint steps and verify old rows survive.",
            "Explain backward-compatible deployment sequencing and the difference between rollback and roll-forward."
        ],
        "sections": [
            {
                "id": "four-states",
                "title": "Separate the model, migration files, ledger and database rows",
                "body": "The current Django models.py describes application state. Migration files contain ordered schema/data operations and dependencies; the django_migrations table records which changes were applied; PostgreSQL's catalog plus existing rows record the installed reality. A migration can be valid Python and still fail when applied to data that violates a new constraint. Before migrating, capture row counts, current schema and old application expectations, then inspect sqlmigrate and database state. You must know whether the database is the SQL-fixture lab or the separate Django migration-managed lab."
            },
            {
                "id": "failure-first",
                "title": "A NOT NULL requirement cannot retroactively invent values",
                "body": "Imagine every Service must eventually have a technical_owner contact. Existing five Services do not have this column. The SQL fragment ALTER TABLE service ADD COLUMN technical_owner text NOT NULL would fail with nonempty data unless it has a valid DEFAULT or a staged population. A fabricated default contact merely to satisfy the DDL may be inaccurate. The safe general pattern is expand (add nullable field without breaking old writers), backfill real values with verification, update application readers/writers, and contract (enforce NOT NULL/UNIQUE only after old writes are no longer possible). The exact order may vary by deployment architecture and locking concerns."
            },
            {
                "id": "run",
                "title": "Execute a reversible microcosm on actual seeded PostgreSQL rows",
                "body": "This script deliberately starts and ends with a ROLLBACK in the disposable SQL lab. PostgreSQL's transactional DDL lets the added column and backfilled values be undone together in this local exercise. The values are synthetic teaching contact strings, not real staff. Count before and after, assert no missing owner when tightening NOT NULL, then roll back. A real rollout would use separate deployments and not keep all phases inside one enormous transaction.",
                "language": "sql",
                "caption": "migration_expand_contract.sql — populated-data backfill with reversible DDL",
                "code": "BEGIN;\nALTER TABLE service ADD COLUMN technical_owner text;\nSELECT count(*) AS missing_before FROM service\nWHERE technical_owner IS NULL;\nUPDATE service\nSET technical_owner = lower(replace(name,' ','.')) || '@example.invalid';\nSELECT count(*) AS missing_after FROM service\nWHERE technical_owner IS NULL;\nALTER TABLE service ALTER COLUMN technical_owner SET NOT NULL;\nSELECT count(*) AS rows_preserved FROM service;\nROLLBACK;\nSELECT count(*) AS remaining_column\nFROM information_schema.columns\nWHERE table_name='service' AND column_name='technical_owner';",
                "output": "missing_before 5; missing_after 0; rows_preserved 5; remaining_column 0 after ROLLBACK."
            },
            {
                "id": "historical",
                "title": "Django data migrations use the model at the time of migration",
                "body": "Inside a Django migrations.RunPython operation, use apps.get_model('registry','Service') to obtain the historical model matching that migration step, rather than import the current registry.models.Service, which will evolve. Use the database alias from schema_editor.connection.alias for multi-database setups. A schema migration adding nullable technical_owner and a later data migration that populates existing rows must have explicit dependencies before an AlterField NOT NULL operation. Data migrations also need idempotency/reversibility decisions: if re-running or rolling back could destroy user changes, document why forward recovery may be safer. These steps are more than adding a field to Python code."
            },
            {
                "id": "locking",
                "title": "Schema operations have concurrency and deployment costs",
                "body": "ALTER TABLE and index creation may take locks and/or rewrite data depending on operation and PostgreSQL version. A million-row backfill inside one transaction can generate substantial WAL, hold locks and make rollback expensive. Creating a UNIQUE index concurrently on a large table can reduce blocking but requires special non-atomic migration planning. An empty local database proves syntax only. Before production, estimate row volume, old/new app overlap, migration duration, lock profile, failure recovery and actual constraints; test with populated copies and controlled permissions."
            },
            {
                "id": "transfer",
                "title": "Change data with a deployment compatibility plan",
                "body": "Design a two-release scenario: old app ignores technical_owner, new app begins writing it, and old app continues receiving requests during rollout. Decide which schema changes are safe before each release and exactly when NOT NULL can be enforced. Predict failure if the constraint is tightened while the old writer is still active. Record how to detect incomplete backfill, how to pause/retry safely and what data could be lost on backward migration. Unlike source-only changes, a destructive schema migration is not made safe by Git revert."
            }
        ],
        "warning": "Use only the disposable SQL fixture for migration_expand_contract.sql. Real production schema migrations need staged deployment, database ownership, lock/recovery review and populated-data evidence.",
        "assignment": [
            "Run the SQL migration example and record all four expected counts plus the absence of the column afterward.",
            "Write a matching Django migration sequence and explain where historical models and database alias apply.",
            "Design an old/new application deployment timeline with a precise point when enforcing NOT NULL is safe.",
            "Explain two cases where rolling forward is safer than reverting a destructive migration."
        ],
        "resources": [
            {
                "title": "Django 5.2 — Migrations",
                "url": "https://docs.djangoproject.com/en/5.2/topics/migrations/",
                "kind": "reference",
                "purpose": "Historical models, migration graph, data migration and deployment considerations."
            },
            {
                "title": "Django 5.2 — Migration Operations",
                "url": "https://docs.djangoproject.com/en/5.2/ref/migration-operations/",
                "kind": "reference",
                "purpose": "RunPython and RunSQL behavior, atomicity and database aliases."
            },
            {
                "title": "PostgreSQL — ALTER TABLE",
                "url": "https://www.postgresql.org/docs/current/sql-altertable.html",
                "kind": "reference",
                "purpose": "Schema change semantics, constraints and locking."
            }
        ],
        "practiceObjective": "Safely evolve a populated Steward schema using a measured backfill and explicitly reason about old/new code compatibility.",
        "practiceInstructions": [
            "Execute migration_expand_contract.sql and capture before/after counts.",
            "Translate its stages into Django operations for the separate Django-managed database.",
            "Demonstrate an old client writer after expand but before contract and explain why it would fail afterward.",
            "Record lock, data retention, reverse/forward and security risks."
        ],
        "knowledgeCheck": "Why can a migration pass on an empty database and fail on populated records? Why should RunPython use historical models? When does a NOT NULL constraint become compatible with old writers?"
    },
    {
        "id": "concurrency",
        "title": "Concurrency Fundamentals: Two Writers, One Unique Identity",
        "introduction": "Two independent transactions can each decide that a new Service name is available, then race to create it. A sequential test that checks name availability before insert is not a concurrency guarantee. PostgreSQL's UNIQUE constraint arbitrates the conflict at the shared data boundary; one transaction may wait for another's uncommitted write, then succeed or fail depending on the first transaction's outcome. The exercise requires two real connected psql clients and the canonical Team/Service fixture.",
        "outcomes": [
            "Trace a check-then-insert race and distinguish observed committed state from uncommitted writes.",
            "Run two concurrent inserts of the same complete Service row and observe the second session block/reject.",
            "Explain why a database UNIQUE constraint is the durable arbiter rather than an API existence check.",
            "Compare uniqueness arbitration with row-locking and Serializable retries for other types of invariants."
        ],
        "sections": [
            {
                "id": "check-then-insert",
                "title": "The first SELECT is not a reservation",
                "body": "Suppose A and B both run SELECT count(*) FROM service WHERE name='Concurrent Guard Demo' and see 0. Each local read is correct: neither has committed that name yet. If the application then inserts only after the check, two writers can still race; a serializer uniqueness validator cannot close the gap. The unique Service.name constraint in the seed is the database-level invariant. Depending on timing, B's insert may block while A's same-key insert is uncommitted. After A commits, B fails with SQLSTATE 23505; after A rolls back, B can insert. These cases must be distinguished. Transaction wrappers alone don't guarantee no name conflict."
            },
            {
                "id": "complete-schema",
                "title": "Use the actual Service schema, not a fictitious slug-only INSERT",
                "body": "The earlier sample INSERT INTO service(slug) VALUES('payments-api') was invalid for this fixture: Service has required name, owning_team_id and endpoint fields, and slug was added only in a separate reversible migration. The real concurrency lab inserts name, owning_team_id and endpoint using a Team lookup by unique name. The two psql terminals have separate transactions; do not attempt to run the interleaved transcript as one SQL script. The CI concurrency runner coordinates two real subprocess connections and checks that B did not succeed while A held the uncommitted same-name row.",
                "language": "text",
                "caption": "concurrency_unique_two_sessions.txt — two actual psql terminals and a unique-name conflict",
                "code": "Session A: BEGIN;\nSession B: BEGIN;\nSession A: SELECT count(*) FROM service WHERE name='Concurrent Guard Demo';  -- 0\nSession B: SELECT count(*) FROM service WHERE name='Concurrent Guard Demo';  -- 0\nSession A:\nINSERT INTO service(name,owning_team_id,endpoint)\nSELECT 'Concurrent Guard Demo',id,'https://guard.example.invalid/a'\nFROM team WHERE name='Payments';\n-- A has not committed yet.\nSession B:\nINSERT INTO service(name,owning_team_id,endpoint)\nSELECT 'Concurrent Guard Demo',id,'https://guard.example.invalid/b'\nFROM team WHERE name='Payments';\n-- B waits for A's outcome (do not wait for B to finish before committing A).\nSession A: COMMIT;\n-- B receives a duplicate-key error (SQLSTATE 23505), rolls back.\nSession B: ROLLBACK;\n-- Verify exactly one row exists, then delete only the disposable demo Service.",
                "output": "Two initial availability reads: 0, 0. A INSERT succeeds without commit; B is blocked; A COMMIT releases B; B reports duplicate key (23505). Exactly one named row survives until lab cleanup."
            },
            {
                "id": "locks",
                "title": "Row locks work on existing rows, uniqueness protects absent values",
                "body": "SELECT ... FOR UPDATE locks selected existing rows, useful for transitions where a row's current state determines eligibility. It cannot simply lock a Service row that does not exist yet, so it is not a substitute for a declared unique key. For duplicate Service.name, UNIQUE is smaller and more reliable. For a production-ready Service whose last deployment is being deleted, locking the existing Service row can coordinate cooperating commands, as taught in Django. If you need serializable cross-row decisions, PostgreSQL SERIALIZABLE can abort a conflicting transaction and the application must retry the entire logical operation."
            },
            {
                "id": "retry",
                "title": "Treat expected constraint failure as part of API behavior",
                "body": "The loser must not leak a raw duplicate-key stack trace to the client. The API can return its documented conflict response or use a narrow idempotent upsert policy where appropriate. Do not blindly retry the same non-idempotent INSERT: a legitimate existing record may now occupy the key. In a retry policy, check whether the caller is authorized to read/update the existing row. A transaction in a failed state requires rollback before more statements; use a new connection/transaction when retrying. Deadlocks and SERIALIZABLE serialization failures have different SQLSTATE and retry semantics."
            },
            {
                "id": "transfer",
                "title": "Select a mechanism from the actual invariant",
                "body": "Create two mini-scenarios: (1) two users create Service names that normalize to the same slug; (2) production transition races with deleting a Service's final production Environment. For scenario 1, define a unique index/constraint on the authoritative normalized identifier and test simultaneous insertion. For scenario 2, both commands must coordinate on the same existing Service row and re-evaluate deployment state in a transaction. Explain why identical locking applied to both situations would be overengineering. Finally state the evidence needed to consider this race reproduced—two independently connected PostgreSQL sessions, an observed blocking/failure boundary, and a verified final row count."
            }
        ],
        "warning": "Do not execute the teaching race on a shared production database. The two terminals must be coordinated; never wait indefinitely on the blocked writer. Use the declared Service.name uniqueness, not a slug column absent from the canonical seed.",
        "assignment": [
            "Predict the A/B timeline and write down both SELECT results and the expected losing INSERT outcome.",
            "Run two independent psql sessions against an isolated fixture using the complete INSERT statements.",
            "Capture and explain the blocked second write, duplicate-key error and final count of one, then remove only the teaching record.",
            "Compare uniqueness with SELECT FOR UPDATE and Serializable retries on a separate business invariant."
        ],
        "resources": [
            {
                "title": "PostgreSQL — Unique Constraints",
                "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
                "kind": "reference",
                "purpose": "Database uniqueness and concurrent writer semantics."
            },
            {
                "title": "PostgreSQL — Transaction Isolation",
                "url": "https://www.postgresql.org/docs/current/transaction-iso.html",
                "kind": "reference",
                "purpose": "Conflicts and retry behavior."
            },
            {
                "title": "PostgreSQL — Explicit Locking",
                "url": "https://www.postgresql.org/docs/current/explicit-locking.html",
                "kind": "reference",
                "purpose": "Row-level coordination and deadlock considerations."
            }
        ],
        "practiceObjective": "Reproduce a real two-session uniqueness race against the complete canonical Service schema, not a fictional slug-only table.",
        "practiceInstructions": [
            "Record the two pre-check results before starting either write.",
            "Run Session A and B inserts concurrently, capture B's wait and the 23505 error after A commits.",
            "Verify exactly one matching Service persists until cleanup and that Team/ownership is valid.",
            "Compare the appropriate mechanism for the missing-row uniqueness race versus an existing Service readiness transition."
        ],
        "knowledgeCheck": "Why can two SELECT count(*)=0 results both be correct? Why does SELECT FOR UPDATE not lock a nonexistent target row? What should a client do after the UNIQUE constraint rejects a new Service?"
    },
    {
        id: "lab-persist-query",
        title: "Lab: Persist and Query Steward API Data",
        introduction: "This lab produces the PostgreSQL data foundation for Steward before Django is introduced. The goal is to prove that the relational design, constraints and query behavior support the domain questions the product exists to answer using direct database evidence.",
        outcomes: ["Implement the complete Builder-level relational model.", "Use constraints to protect domain invariants.", "Answer non-trivial registry questions in SQL.", "Use EXPLAIN to inspect important access paths.", "Demonstrate transaction and concurrency reasoning."],
        sections: [
            { id: "required-domain", title: "Required relational domain", body: "Persist Team, Membership, Service, Environment, ServiceDependency and ServiceReview. Preserve ownership, lifecycle, criticality and dependency meaning. Work directly with PostgreSQL so the relational behavior is understood before Django later introduces an ORM." },
            { id: "proof", title: "The deliverable is a working database plus evidence", body: "Your review packet should include schema constraints, representative SQL, query-plan output, transaction evidence and at least one negative/concurrent case." },
        ],
        warning: "Do not optimize by intuition. Establish representative data, query behavior and plans before introducing performance-specific schema changes.",
        assignment: ["Implement the full Steward relational schema directly in PostgreSQL.", "Enforce unique slugs, allowed lifecycle/criticality, valid relationships, no self-dependencies and no duplicate dependencies.", "Write SQL for services by team, high-criticality services, dependency counts, services missing production environments and recent reviews.", "Use EXPLAIN ANALYZE on at least two important queries and justify one index.", "Demonstrate one multi-step transaction with rollback/commit evidence and one concurrency-related invariant.", "Export or preserve reproducible schema/seed SQL that the following Django module can map without redefining the domain."],
        resources: [postgresDocs, djangoQueryDocs, djangoMigrationDocs],
        practiceObjective: "Produce the PostgreSQL Steward data foundation that the following Django module can map deliberately rather than learning the database only through an ORM.",
        practiceInstructions: ["Create representative data for multiple teams, memberships, services, environments, reviews and dependency edges.", "Prove all required constraints with positive and negative cases.", "Answer at least five non-trivial questions in direct SQL.", "Capture query-plan evidence and add only justified indexes.", "Demonstrate rollback/commit behavior for a multi-step change.", "Exercise one concurrency-sensitive invariant from two sessions.", "Submit reproducible schema/seed SQL and a short data-engineering review explaining decisions, risks and remaining limitations."],
        knowledgeCheck: "Defend your lab as if another engineer were reviewing it: Which invariants are protected by PostgreSQL? Which rules will still need application-level behavior later and why? Which query was most expensive? What evidence justified your indexing decision? What concurrency risk remains most important?",
    },
];

export const djangoDependentDataLessonIds = new Set(["django-orm", "orm-vs-sql", "n-plus-one", "migrations"]);

/**
 * Builder sequencing boundary:
 * Django/ORM-specific material remains defined here temporarily for safe relocation,
 * but is not learner-facing in the PostgreSQL path. Django is introduced in the
 * following Django and API Engineering path; framework-dependent data lessons must
 * not become prerequisites for learning the framework itself.
 */
export const djangoDependentPostgresqlDeepLessons: Lesson[] = specs
    .filter((spec) => djangoDependentDataLessonIds.has(spec.id))
    .map(lesson);

export const relationalDataAndPostgresqlDeepLessons: Lesson[] = specs
    .filter((spec) => !djangoDependentDataLessonIds.has(spec.id))
    .map(lesson);
