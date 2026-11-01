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
 subqueries:[{ title: "PostgreSQL — Subquery Expressions", url: "https://www.postgresql.org/docs/current/functions-subquery.html", kind: "reference" }],ctes:[pgWith],"transactions-acid":[pgTransactions],"constraints-keys":[pgConstraints],"schema-design":[pgDdl],
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
        { type: "resources", title: "Required and supporting reading", resources: resourcesByDataLesson[spec.id] ?? spec.resources },
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
                "body": "Team has its own identity and unique name; Service holds an immutable generated database identity and a Team foreign key. Service's name is unique here as an explicit *teaching assumption*, not a universal fact about all registries. Environment describes one deployed placement of one Service and has a kind limited to development, staging or production. A directed ServiceDependency relates source → target and forbids a self-edge and duplicates. The `active` operational flag is not the same concept as `lifecycle`: a temporarily unavailable active-lifecycle service need not be retired. `criticality` is a declared priority and `retired_at` records a timestamp where one exists. The domain/API interface does not have to expose every SQL column. Generated IDs are not stable seed assumptions; the foreign key lookup follows Team identity."
            },
            {
                "id": "schema",
                "title": "Create the schema and dataset in one explicit script",
                "body": "Save the following exactly as steward_schema_seed.sql in a scratch directory. Connect to the verified empty learning database and run psql -X -v ON_ERROR_STOP=1 -1 -f steward_schema_seed.sql. The -1 flag wraps a file in one transaction: an SQL error stops the script and rolls back the changes, rather than leaving a half-created baseline. The .invalid URLs are deliberate non-routable placeholders for local teaching data; no real endpoints or customer records are involved. Inspect all table names and foreign-key directions before running. Never run this file against production or any database that contains valuable data.",
                "language": "sql",
                "caption": "steward_schema_seed.sql — complete one-time PostgreSQL teaching fixture",
                "code": "CREATE TABLE team (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE\n);\n\nCREATE TABLE service (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE,\n  owning_team_id bigint NOT NULL REFERENCES team(id),\n  endpoint text NOT NULL,\n  active boolean NOT NULL DEFAULT true,\n  age_days integer NOT NULL DEFAULT 0 CHECK (age_days >= 0),\n  lifecycle text NOT NULL DEFAULT 'active' CHECK (lifecycle IN ('active', 'retired')),\n  criticality text NOT NULL DEFAULT 'medium' CHECK (criticality IN ('low', 'medium', 'high', 'critical')),\n  retired_at timestamptz\n);\n\nCREATE TABLE environment (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  service_id bigint NOT NULL REFERENCES service(id),\n  name text NOT NULL,\n  kind text NOT NULL CHECK (kind IN ('development', 'staging', 'production')),\n  UNIQUE (service_id, name)\n);\n\nCREATE TABLE service_dependency (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  source_service_id bigint NOT NULL REFERENCES service(id),\n  target_service_id bigint NOT NULL REFERENCES service(id),\n  UNIQUE (source_service_id, target_service_id),\n  CHECK (source_service_id <> target_service_id)\n);\n\nINSERT INTO team (name) VALUES ('Payments'), ('Platform'), ('Identity');\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Payments API', id, 'https://payments.example.invalid/api', true, 184, 'active', 'high'\nFROM team WHERE name = 'Payments';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Payroll API', id, 'https://payroll.example.invalid/api', true, 55, 'active', 'critical'\nFROM team WHERE name = 'Payments';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Identity API', id, 'https://identity.example.invalid/api', true, 350, 'active', 'critical'\nFROM team WHERE name = 'Identity';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Catalogue API', id, 'https://catalogue.example.invalid/api', true, 10, 'active', 'medium'\nFROM team WHERE name = 'Platform';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality, retired_at)\nSELECT 'Legacy Gateway', id, 'https://legacy.example.invalid/api', false, 1600, 'retired', 'low', now()\nFROM team WHERE name = 'Platform';\n\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Primary', 'production' FROM service\nWHERE name IN ('Payments API', 'Identity API', 'Catalogue API');\n\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Preprod', 'staging' FROM service WHERE name = 'Payments API';\n\nINSERT INTO service_dependency (source_service_id, target_service_id)\nSELECT src.id, dst.id FROM service src CROSS JOIN service dst\nWHERE src.name = 'Payments API' AND dst.name = 'Identity API';\n\nINSERT INTO service_dependency (source_service_id, target_service_id)\nSELECT src.id, dst.id FROM service src CROSS JOIN service dst\nWHERE src.name = 'Payroll API' AND dst.name = 'Payments API';"
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
                "body": "Comparisons such as lifecycle = 'active' produce TRUE or FALSE for a non-NULL lifecycle. AND requires both operands TRUE; OR requires at least one TRUE. Without parentheses, PostgreSQL evaluates AND more tightly than OR, so A AND B OR C means (A AND B) OR C. IN ('high','critical') is a convenient membership predicate. A mistake in grouping can include records that should be excluded even when each individual comparison is correct.",
                "language": "sql",
                "caption": "filter_boolean.sql — retired-record leak and its corrected predicate",
                "code": "SELECT name FROM service\nWHERE lifecycle = 'active' AND criticality = 'critical'\n   OR name = 'Legacy Gateway'\nORDER BY name;\n\nSELECT name FROM service\nWHERE lifecycle = 'active'\n  AND (criticality = 'critical' OR name = 'Legacy Gateway')\nORDER BY name;",
                "output": "Unparenthesized: Identity API, Legacy Gateway, Payroll API.\nParenthesized: Identity API, Payroll API. Legacy Gateway is excluded because its lifecycle is retired."
            },
            {
                "id": "null-logic",
                "title": "NULL means unknown/absent data, not an ordinary value",
                "body": "Most ordinary comparisons against SQL NULL evaluate to UNKNOWN, not TRUE or FALSE. WHERE retains only TRUE rows: FALSE and UNKNOWN are both rejected. NOT UNKNOWN remains UNKNOWN. Therefore retired_at = NULL never identifies the unretired records; retired_at IS NULL does. These are SQL truth conditions, not Python None or JSON null behavior. In this fixture the four active-lifecycle services have retired_at NULL and Legacy Gateway has a retirement timestamp. No field named technical_owner exists yet; do not write a query against it until a later schema change has defined it.",
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
                "code": "SELECT name, criticality\nFROM service\nWHERE lifecycle = 'active'\nORDER BY name ASC, id ASC\nLIMIT 3;",
                "output": "Catalogue API | medium\nIdentity API | critical\nPayments API | high. This is alphabetical order by name; it deliberately does not rank severity."
            },
            {
                "id": "complete",
                "title": "Predict, run, inspect and transfer",
                "body": "First predict the results of the three published query blocks. Execute each against the unchanged seed and compare the exact chosen rows. Then write a new query: all active services whose name starts with 'Pay' regardless of case, ordered by name and id. Compare ILIKE 'pay%' with LIKE 'pay%' under your database collation and show why a leading wildcard can be an expensive search form on ordinary B-tree indexes. For a second independent case, find services where retired_at is present; use IS NOT NULL. Explain the difference between output order and filter semantics before moving to joins."
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
                "body": "The fixture's Payroll API has no row in Environment. An INNER JOIN between Service and Environment omits Payroll altogether; a LEFT JOIN returns the Service row and fills the absent Environment columns with SQL NULL. Conversely, Payments API has two Environment rows (production and staging), so a one-to-many join produces TWO result rows for Payments. This is not duplication in the table—it is the number of matching pairs in the join result. Predict 3 rows for Payroll/Payments under LEFT JOIN and 2 rows under INNER JOIN.",
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
                "body": "The meaningful logical sequence is FROM/JOIN, WHERE (filter source rows), GROUP BY (form groups), aggregates (calculate a summary), HAVING (keep groups), and finally projection/order. WHERE cannot reference COUNT(s.id) in the same grouping query: the count does not exist until after grouping. HAVING COUNT(s.id) >= 2 is a group-level condition. To count only active Services, put s.lifecycle = 'active' in the JOIN's ON clause when you must preserve empty Teams; putting it in WHERE after LEFT JOIN can eliminate zero-count teams. On this seed Payments has 2 active Services, Platform 1, Identity 1.",
                "language": "sql",
                "caption": "aggregate_having.sql — filter active matches then threshold groups",
                "code": "SELECT t.name, COUNT(s.id) AS active_services\nFROM team t\nLEFT JOIN service s\n  ON s.owning_team_id = t.id AND s.lifecycle = 'active'\nGROUP BY t.id, t.name\nHAVING COUNT(s.id) >= 2\nORDER BY t.name;",
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
                "body": "With no further insertions, calculate the expected aggregates on paper, run each published query, and reconcile every discrepancy. Then write your own query returning one row per Team with total Services, active Services and production Environment count. Decide whether production Environment count means placements or Services with a production deployment: one Service could have more than one production placement, and the two business questions are different. Explicitly separate joined rows from Service identities. SQL can answer either question; only the engineering requirement determines which is right."
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
            "Run aggregate_having.sql and prove that the group threshold is applied after matching active services.",
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
        id: "transactions-acid",
        title: "Transactions and ACID",
        introduction: "A transaction defines one unit of database change. Steward will often need multiple writes to succeed or fail together—for example creating a service and its required initial production environment. Transactions protect invariants across those steps.",
        outcomes: ["Explain atomicity, consistency, isolation and durability operationally.", "Group related writes in a transaction.", "Use rollback intentionally.", "Distinguish application validation from transactional guarantees."],
        sections: [
            { id: "atomic-change", title: "One business change, one transaction", body: "Atomicity means observers should not see half of a logically indivisible change. If a required second write fails, the first should not remain committed.", code: "BEGIN;\n\nINSERT INTO service (name, owning_team_id, endpoint)\nSELECT 'Ledger API', id, 'https://ledger.example.invalid/api'\nFROM team WHERE name = 'Payments'\nRETURNING id;\n\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Primary', 'production'\nFROM service WHERE name = 'Ledger API';\n\nCOMMIT;" },
            { id: "acid", title: "ACID is behavior, not marketing", body: "Consistency depends on the invariants you actually encode. Isolation controls interaction between concurrent transactions. Durability concerns committed changes surviving failures. Learn each property through observable behavior." },
            { id: "boundaries", title: "BEGIN, COMMIT and ROLLBACK define the explicit boundary", body: "Without an explicit multi-statement transaction, clients commonly operate in autocommit mode where each successful statement becomes its own transaction. BEGIN starts a transaction block, COMMIT makes its successful changes durable/visible according to isolation rules, and ROLLBACK abandons the transaction's uncommitted changes." },
            { id: "isolation-levels", title: "Isolation is about concurrent observations", body: "PostgreSQL's default Read Committed gives each statement a snapshot appropriate to that statement, so two SELECTs in one transaction can observe different committed data. Repeatable Read provides a stable transaction snapshot and PostgreSQL prevents additional serialization-style anomalies at Serializable by aborting transactions that cannot safely coexist. Stronger isolation can require application retry logic." },
            { id: "concurrency-phenomena", title: "Name the anomalies you are trying to prevent", body: "A dirty read observes another transaction's uncommitted change; a nonrepeatable read sees a row change between reads; phantom-style changes alter the qualifying set; write skew/lost-update patterns arise from concurrent decisions over shared state. PostgreSQL does not permit dirty reads, but application invariants still require deliberate isolation, constraints or locking." },
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
            { id: "invariants", title: "Encode invariants close to the data", body: "Application checks can race or be bypassed by another writer. Database constraints provide a shared line of defense. Evolve the existing fixture rather than trying to CREATE service a second time. The following staged slug addition assumes every existing service has a unique name-derived slug; inspect collisions before enforcing uniqueness.", code: "ALTER TABLE service ADD COLUMN slug text;\n\n-- Backfill before adding NOT NULL and UNIQUE; inspect duplicates first.\nUPDATE service SET slug = lower(replace(name, ' ', '-'));\nALTER TABLE service ALTER COLUMN slug SET NOT NULL;\nALTER TABLE service ADD CONSTRAINT uq_service_slug UNIQUE (slug);" },
            { id: "dependency-uniqueness", title: "Relationship constraints matter too", body: "The preceding seed already declares a composite UNIQUE and a self-edge CHECK. Inspect those existing constraints, then test that a duplicate or self-dependency is rejected; do not ADD duplicate definitions." , code: "SELECT conname, pg_get_constraintdef(oid)\nFROM pg_constraint\nWHERE conrelid = 'service_dependency'::regclass\nORDER BY conname;\n\n-- The seed schema already declares UNIQUE(source, target) and a self-edge CHECK." },
            { id: "key-kinds", title: "Primary, natural, surrogate and composite keys answer different questions", body: "A primary key is the table's chosen row identity and is unique/non-null. A natural key comes from domain data, such as a genuinely stable external identifier. A surrogate key is generated for database identity, such as bigint identity or UUID. A composite key uses multiple columns. Surrogate identity does not remove the need for UNIQUE constraints on domain facts that must also be unique." },
            { id: "fk-actions", title: "Foreign-key actions define lifecycle coupling", body: "ON DELETE/UPDATE actions such as RESTRICT/NO ACTION, CASCADE and SET NULL determine what PostgreSQL does when referenced identity changes or disappears. Choose them from domain lifecycle: deleting a Team should not silently delete all active Services merely because CASCADE is convenient.", code: "owning_team_id bigint NOT NULL\n  REFERENCES team(id) ON DELETE RESTRICT" },
            { id: "check-boundary", title: "Constraints are powerful but not every rule fits one row", body: "NOT NULL, UNIQUE, CHECK and FOREIGN KEY cover many durable invariants. Rules involving aggregates, complex cross-row lifecycle state or external systems may require transactions, application/domain logic or other database mechanisms. Put a rule at the lowest shared layer that can enforce it correctly without creating an opaque design." },
        ],
        assignment: ["List Steward invariants that belong in the database.", "Inspect the CHECK and composite UNIQUE already enforced in the seed; add and validate a new slug uniqueness rule.", "Attempt invalid writes and capture the failures."],
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
            { id: "cardinality-optionality", title: "Cardinality and optionality become constraints", body: "For every relationship ask both how many and whether absence is allowed: one Team owns many Services; each Service must have exactly one owning Team; a Service can have zero or many Environments. Foreign keys, NOT NULL and uniqueness constraints translate those decisions into enforceable structure." },
            { id: "time-and-history", title: "Current state and history are different models", body: "A lifecycle column answers current state. A separate review/event/history relation answers how state evolved. Do not add history tables automatically, but if the product must answer 'who reviewed this service last quarter?', overwriting the current row cannot preserve that fact." },
            { id: "naming-defaults", title: "Names and defaults become long-lived interfaces", body: "Use consistent singular/plural and identifier conventions across tables/columns. Defaults should represent a legitimate domain default, not merely save typing. A default that silently invents ownership, lifecycle or security-sensitive state can hide missing input." },
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
            { id: "normal-forms", title: "Use normal forms as anomaly tests, not ceremony", body: "At a practical level, first normal form asks for scalar/relationally structured values rather than repeating groups in one column. Second normal form matters when a composite key exists: non-key facts should depend on the whole key. Third normal form pushes you to remove non-key facts that actually depend on another non-key fact. The goal is one authoritative home for each fact, not reciting form numbers." },
            { id: "example-normalize", title: "Normalize by following functional dependency", body: "If Service stores owning_team_id and owning_team_name, the team name depends on Team identity rather than Service identity. Put the name on Team and reference Team from Service. If a dependency relation's key is (source_service_id, target_service_id), facts about the source Service itself do not belong duplicated on that edge." },
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
            { id: "btree", title: "B-tree is the ordinary default, not the only index family", body: "PostgreSQL B-tree indexes support common equality/range/order access patterns and are the default CREATE INDEX method. PostgreSQL also provides index methods such as GIN, GiST, SP-GiST, BRIN and hash for different data/operator patterns. Builder should master B-tree reasoning first and research another method only when the data/operator requirement earns it." },
            { id: "composite-prefix", title: "Composite indexes are ordered structures", body: "For a B-tree index on (lifecycle, criticality), predicates constraining the leading lifecycle column usually make the index broadly useful; a query only on criticality may not benefit in the same way. Column order should come from actual predicates, equality/range behavior and ordering requirements—not from whichever field sounds most important." },
            { id: "selectivity", title: "Selectivity influences whether an index is worthwhile", body: "An index is most compelling when it can avoid reading much of the table. A boolean column with roughly half the table matching may be a poor standalone index target, while a selective slug lookup is different. PostgreSQL's planner combines statistics, estimated rows and I/O/CPU costs rather than applying an 'index always faster' rule." },
            { id: "unique-index", title: "Uniqueness and indexing are related but different intents", body: "PostgreSQL implements UNIQUE constraints using unique indexes, but declare a domain uniqueness rule as a constraint when that is the meaning. Create a plain index when the intent is access performance. This keeps schema intent readable." },
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
            { id: "plan-reading", title: "Read plans from the leaves toward the result", body: "Plan nodes form a tree. Leaf scans produce rows; joins combine inputs; sorts reorder; aggregate nodes group/compute; upper nodes consume lower output. With ANALYZE, loops × rows per loop matters when estimating how much work a node actually produced." },
            { id: "scan-types", title: "Scan and join names tell a physical story", body: "Seq Scan reads broadly from the table; Index Scan follows an index and then heap/table tuples as needed; Index Only Scan may satisfy selected data from the index when visibility permits; Bitmap scans can combine/use index matches in batches. Nested Loop, Hash Join and Merge Join are common join strategies chosen for different input shapes and ordering/costs." },
            { id: "buffers", title: "BUFFERS adds I/O evidence", body: "EXPLAIN (ANALYZE, BUFFERS) reports buffer activity that helps distinguish work served from shared cache versus blocks read, written or dirtied. Timing varies with cache/warm-up and machine load, so interpret one run cautiously and compare under controlled conditions." },
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
            { id: "psql-toolkit", title: "A small psql vocabulary makes the database inspectable", body: "Useful psql meta-commands include \\l to list databases, \\c to connect, \\dn to list schemas, \\dt to list tables, \\d table_name to describe a relation, \\du to inspect roles and \\q to exit. Meta-commands are psql client commands, not SQL sent to PostgreSQL.", language: "text", code: "\\l\n\\c tsa_steward_lab\n\\dn\n\\dt\n\\d service\n\\du" },
            { id: "connection", title: "A connection identifies server, database and role", body: "A PostgreSQL connection commonly needs host, port, database and user/role plus an authentication method/credential. PostgreSQL's conventional port is 5432, but configuration may differ. A successful network connection does not imply the role has permission to use every schema/table." },
            { id: "privileges", title: "Privileges should match application operations", body: "Roles can receive privileges such as CONNECT on a database, USAGE on a schema and SELECT/INSERT/UPDATE/DELETE on selected tables/sequences as required. Ownership and superuser powers are broader than ordinary application access. Later Security work hardens this further; Builder should at least stop treating 'database login' as all-or-nothing access." },
            { id: "metadata", title: "System catalogs and information_schema expose metadata", body: "psql convenience commands ultimately inspect PostgreSQL metadata. information_schema provides standardized views for many schema facts while pg_catalog exposes PostgreSQL-specific details. Knowing metadata exists helps you verify constraints/indexes programmatically rather than relying only on GUI views." },
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
            { id: "race", title: "Read-then-write can race", body: "Two requests can both check that a service slug is unused and then both attempt insertion. The problem is the gap between the read and the write: each transaction can make a locally reasonable decision before either has observed the other transaction's uncommitted change. Merely wrapping both steps in transactions does not make that decision atomic. A database UNIQUE constraint arbitrates the conflicting writes at the shared data boundary." },
            { id: "unique-race", title: "See what the losing writer experiences", body: "Suppose transaction A and transaction B both decide that payments-api is unused. A inserts first but has not committed. When B attempts the same unique value, PostgreSQL cannot safely accept a second committed duplicate, so B may wait for A's transaction outcome. If A commits, B's insert fails with a uniqueness violation; if A rolls back, B can proceed. The application must treat that database result as part of the normal concurrent outcome rather than assuming its earlier pre-check guaranteed success.", code: "-- Session A                         -- Session B\nBEGIN;                               BEGIN;\nINSERT INTO service (slug)           -- an earlier pre-check may also have\nVALUES ('payments-api');             -- reported no matching committed row\n                                     INSERT INTO service (slug)\n                                     VALUES ('payments-api');\n-- B cannot safely commit a duplicate yet\nCOMMIT;                              -- B is released and receives unique violation" },
            { id: "locking", title: "Row locks serialize changes to existing contested state", body: "SELECT ... FOR UPDATE acquires a row-level lock on the selected rows and holds it until the surrounding transaction ends. If transaction A locks Service 42, a competing transaction that needs a conflicting lock on that row waits until A commits or rolls back. After the wait, the second transaction must reason from the state it can now observe; the lock is coordination, not permission to reuse a stale decision made before waiting.", code: "BEGIN;\nSELECT id, lifecycle\nFROM service\nWHERE id = 42\nFOR UPDATE;\n-- validate the locked/current state and perform the coordinated change\nCOMMIT; -- or ROLLBACK; either releases the transaction's row lock" },
            { id: "constraint-vs-lock", title: "Choose the protection that matches the invariant", body: "Use a UNIQUE or other database constraint when the invariant can be expressed directly in the schema; every writer then shares the same arbiter. Use row locking when an operation must coordinate a decision around existing rows whose state can change concurrently. Use stronger isolation when correctness depends on a broader set of reads that cannot be protected by one simple constraint or row lock. These mechanisms can be combined, but adding a transaction around unsafe read-then-write logic is not by itself a concurrency strategy." },
            { id: "deadlocks", title: "Waiting is normal; circular waiting is a deadlock", body: "Locks intentionally make some transactions wait. A deadlock is different: transaction A holds a lock B needs while B holds a lock A needs, so neither can progress. PostgreSQL detects the cycle and aborts one transaction. Applications performing multi-row coordinated updates should acquire resources in a consistent order where practical and be prepared for transaction-level retry when the database reports a retryable concurrency failure." },
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
