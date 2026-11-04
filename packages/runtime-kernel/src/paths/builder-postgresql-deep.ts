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
    readingTitle?: string;
    practiceTitle?: string;
    checkTitle?: string;
    practiceScenario?: string;
    practiceDeliverables?: string[];
    practiceCompletionCriteria?: string[];
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
            ...section.body.split(/\n\s*\n/).filter(Boolean).map((text): LessonBlock => ({ type: "paragraph", text })),
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
                title: spec.readingTitle ?? `${spec.title}: Concepts and Mental Model`,
                estimatedMinutes: 25,
                content: { type: "reading", body: spec.introduction, blocks },
            },
            {
                id: `relational-data-and-postgresql-${spec.id}-practice`,
                title: spec.practiceTitle ?? `${spec.title}: Engineering Practice`,
                estimatedMinutes: 35,
                content: {
                    type: "practical",
                    objective: spec.practiceObjective,
                    scenario: spec.practiceScenario ?? "Use the evolving Steward service-registry data model. Preserve useful SQL, schema notes and evidence so later Builder modules can build on the same system.",
                    instructions: spec.practiceInstructions,
                    deliverables: spec.practiceDeliverables ?? ["Working SQL or schema change", "Reproducible evidence containing setup/query and observed output", "Short engineering note explaining the result and trade-offs"],
                    completionCriteria: spec.practiceCompletionCriteria ?? ["Another learner could reproduce the result against the recorded Steward data/setup.", "At least one failure, edge case or alternative is executed and its observed result is recorded.", "The learner can explain what PostgreSQL is doing rather than only copy syntax."],
                },
            },
            {
                id: `relational-data-and-postgresql-${spec.id}-check`,
                title: spec.checkTitle ?? `${spec.title}: Knowledge Check`,
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
        "id": "postgresql-what-it-is",
        "title": "What Is PostgreSQL? Servers, Databases and Clients",
        "introduction": "A small library catalogue makes a good starting point. Several librarians want to find, add and correct books without overwriting each other's work. We begin with what PostgreSQL actually is, not installation commands or a fictional Steward database. You should be able to draw the moving parts before opening a terminal.",
        "outcomes": [
            "Explain the problem a database management system addresses.",
            "Distinguish PostgreSQL server, psql client, database, schema, table and role.",
            "Trace an SQL request through a client and the server.",
            "Describe a situation where a file or SQLite might be simpler than a PostgreSQL server."
        ],
        "sections": [
            {
                "id": "why-a-database",
                "title": "Why use a database instead of a file?",
                "body": "A text or JSON file can store book records. For one person and a few entries, that may be enough. But when two librarians edit the same file, one person's copy can overwrite the other's. Finding books by author or date requires application code. Rejecting duplicate catalogue identifiers and recovering interrupted writes also become the programmer's responsibility. A database management system (DBMS) provides ways to query organized data, enforce declared integrity rules and coordinate transactions from multiple clients. PostgreSQL is an open-source relational DBMS. It does not make every bad design safe, and it does not eliminate the need for backups. SQLite is another relational DBMS that runs inside an application rather than as a separate PostgreSQL-style server; it can be a better fit for simpler local applications."
            },
            {
                "id": "database-choices",
                "title": "When is PostgreSQL the right choice?",
                "body": "A relational database management system organizes data into tables and lets clients query and update it under declared rules. PostgreSQL is one choice, but not every problem needs a separate database server.\n\nFor a personal configuration document edited by one process, a JSON file may be enough. For a desktop or mobile application requiring SQL without operating a separate service, SQLite can be a strong option: it is a full relational engine with transactions and a database file. For a shared booking or catalogue system with many independently connected clients, complex SQL, access control and coordinated updates, PostgreSQL offers useful server capabilities. SQLite also supports multiple readers, so it is inaccurate to say it is only for one user; its concurrency and deployment choices are different, particularly with many simultaneous writers.\n\nThe decision is based on data size, access patterns, concurrency, constraints, backups, hosting and maintenance. Choose based on which guarantees are needed, not because a product seems more sophisticated."
            },
            {
                "id": "server-program",
                "title": "What is the PostgreSQL server?",
                "body": "The PostgreSQL server is a running program, usually named postgres, responsible for managing stored database data, accepting authorized connections and executing SQL. It can run on your laptop, on another computer or as a managed service. A client does not need to be installed on the same computer. The server listens for a connection and handles requests. Turning off the client does not normally remove the saved records. Stopping the server prevents new queries until it starts again, but does not automatically erase persisted database files. A server manages a PostgreSQL database cluster, meaning databases and certain shared objects such as roles. Here 'cluster' is not a claim that you have several redundant servers."
            },
            {
                "id": "the-hierarchy",
                "title": "Databases, schemas, tables and rows",
                "body": "A server can host named databases, for example tsa_library and tsa_steward_lab. Each database contains one or more schemas. A schema is a named namespace for objects such as tables, not a second database. A table defines columns such as book_id and title, and rows contain individual records. A role is the database identity that controls which connections and operations are permitted; it is not a database. One ordinary PostgreSQL client connection works in one selected database at a time. Remember this order: server → database → schema → table → row.",
                "language": "text",
                "caption": "Concept map — object hierarchy (not commands)",
                "code": "PostgreSQL server\n  ├─ postgres  (maintenance database)\n  ├─ tsa_library  (database)\n  │    ├─ public  (default schema)\n  │    └─ library  (our schema)\n  │         └─ books  (table)\n  │              ├─ book_id, title, author (columns)\n  │              └─ one record per book (rows)\n  └─ tsa_steward_lab  (another database)\n\nRoles govern permissions across the cluster."
            },
            {
                "id": "client-program",
                "title": "What is a client, and what is psql?",
                "body": "A client is a separate program that sends requests to PostgreSQL. psql is PostgreSQL's terminal client. Graphical tools such as pgAdmin or DBeaver and application drivers such as psycopg are also clients. A client selects a server, authenticates as a database role, connects to a database and sends SQL. The server evaluates the SQL, reads or updates its data and returns results. Installing psql does not install or start a PostgreSQL server; psql does not hold the database's persistent records."
            },
            {
                "id": "one-query",
                "title": "Follow one query from the user to the result",
                "body": "A librarian types a request in psql to find books published before 1960. psql sends the SQL over its connection to PostgreSQL. The server checks whether the role can read the table, runs the query and returns the matching records. psql prints the rows. If a request instead violates a table rule, the server returns an error that psql displays. This division matters when debugging: a 'command not found' error happens before any connection, a connection refusal happens before SQL, and a SQL syntax error happens after a successful database connection."
            },
            {
                "id": "query-journey",
                "title": "What happens between typing a query and seeing rows?",
                "body": "Follow one request through the parts already named. A librarian asks for books published before 1960. The client (psql or an application) knows which server host, database and role it wants. It opens a connection, which the server authenticates. The client sends a query written in SQL. The server's session process checks that the role may read the table, finds the relevant records, evaluates the requested condition and sends a result back. The client then displays the returned rows.\n\nThe query's result is not a second permanent table. Closing psql usually leaves the data the server already stored. If the network is unavailable, the client cannot reach the SQL engine. If the role is rejected, the failure occurs at authentication. If the table name is wrong, the query reaches the server but fails during object lookup. This is why diagnosing the layer matters more than memorizing one generic message.\n\nThe next lesson makes this flow observable without requiring a library table yet. The first query will simply calculate 2 + 2 and show which database and role were selected."
            },
            {
                "id": "what-persists",
                "title": "Which part keeps running after you close the terminal?",
                "body": "Distinguish three lifetimes. The shell is an operating-system command interpreter. psql is one client process started from that shell. PostgreSQL's server is a different running program that manages persistent data files. Closing psql closes one database session; it does not normally stop the server. Stopping PostgreSQL makes the server unavailable but does not automatically delete its database files. Deleting an actual data directory or container volume is a different destructive operation.\n\nA PostgreSQL server may manage multiple databases and accept multiple client connections. In PostgreSQL terminology a database cluster is the managed collection of databases and shared objects under one server installation; this word does not automatically imply several replicated servers or automatic failover. Roles are shared within that cluster, but database access is still checked separately.\n\nA correctly drawn diagram helps: two client programs on the left connect to one server on the right; the server manages separate databases, each with its own schemas and tables. Draw and explain the diagram before using installation commands."
            },
            {
                "id": "vocabulary",
                "title": "Learn the names without mixing them up",
                "body": "PostgreSQL is the database server software; SQL is the language used to ask relational databases questions; psql is one client that sends SQL. A database is not the same as a schema inside it. The word 'schema' is also sometimes used loosely for a database's overall table design, so ask which meaning is intended. The server's database cluster does not necessarily have replicas or high availability. You can now explain these concepts without a command or a Steward project."
            }
        ],
        "warning": "Use an isolated learning server and invented data. Do not modify production or shared databases, publish real credentials, or drop existing objects merely to repeat an exercise.",
        "assignment": [
            "Draw and label one PostgreSQL server, two databases, a schema and a table with three columns.",
            "Describe what happens when a client sends an SQL query and which component actually reads the data.",
            "Give one example where SQLite or a file would be a better starting choice.",
            "Explain what persists when psql is closed versus when the server is stopped."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Getting Started",
                "url": "https://www.postgresql.org/docs/17/tutorial.html",
                "kind": "reference",
                "purpose": "Follow the official sequence from architecture to databases, SQL tables and records."
            },
            {
                "title": "PostgreSQL 17 — Architectural Fundamentals",
                "url": "https://www.postgresql.org/docs/17/tutorial-arch.html",
                "kind": "reference",
                "purpose": "Verify the separate roles of the running server and client applications."
            }
        ],
        "practiceObjective": "Build an accurate server/client/data hierarchy without needing the Steward API.",
        "practiceInstructions": [
            "Draw a PostgreSQL client → server → database → schema → table diagram for a library.",
            "Explain the difference between the SQL language and the psql application using the diagram.",
            "Predict the effect of closing psql, stopping PostgreSQL and deleting an application process; distinguish predictions from actions you performed."
        ],
        "knowledgeCheck": "Your colleague says: 'I installed psql and my database is ready.' Explain why that claim does not follow. What actually stores book rows? Why might SQLite be preferable for a single-user desktop catalogue?",
        "readingTitle": "Understand the PostgreSQL system",
        "practiceTitle": "Draw and explain the database system",
        "checkTitle": "Test your mental model",
        "practiceScenario": "A library app needs shared records. Build a system diagram and compare simple files, SQLite and PostgreSQL before writing SQL.",
        "practiceDeliverables": [
            "Labeled server/client/database/schema/table diagram",
            "Comparison of JSON file, SQLite and PostgreSQL choices",
            "One explanation of client-server query execution"
        ],
        "practiceCompletionCriteria": [
            "Another learner can reproduce the described sequence or explain the diagram from the submitted evidence.",
            "Every concept in the exercise was introduced in a preceding reading section.",
            "The explanation distinguishes the database server, selected database and client session where applicable."
        ]
    },
    {
        "id": "postgresql-local-setup",
        "title": "Set Up PostgreSQL for Practice",
        "introduction": "Before you can learn psql, you need a running PostgreSQL server and a client. They are different programs. Choose ONE path: an existing authorized training server, or a native installation for your own computer. There is no application framework or container required.",
        "outcomes": [
            "Identify the running server and the psql client.",
            "Choose an authorized existing server or install PostgreSQL on your operating system.",
            "Distinguish client installed, server listening and successful authenticated SQL.",
            "Save a working connection method without storing passwords."
        ],
        "sections": [
            {
                "id": "server-client",
                "title": "What needs to be installed?",
                "body": "PostgreSQL is the database server. It manages database files, executes SQL and can serve multiple client connections. psql is a command-line client: you start it from a shell and use it to send SQL to the server. SQL is a language, not an installed program. Having psql available does not mean the server is running. A server may run on your own computer or another approved computer.\n\nOur first task is not to create tables or configure user permissions. It is to connect to a disposable learning environment where later lessons can create a database and schema. Never use a production database for these exercises."
            },
            {
                "id": "existing-server",
                "title": "Option 1: use a provided PostgreSQL server",
                "body": "If your organization or instructor already provides PostgreSQL, you may not need to install a server. Request the approved host, port (often 5432), database (often postgres or an existing lab database), role name, authentication method and any VPN/TLS requirements. Install only a compatible psql client if needed. Ask whether the role can CREATE DATABASE and CREATE SCHEMA; if not, request an isolated pre-created lab database. Do not guess or copy someone else's credentials.\n\nA connection is not just a password. The hostname selects the computer, the port selects a service, the role identifies you and the database selects one named data space. Record those non-secret values and the approved way to connect."
            },
            {
                "id": "macos",
                "title": "Option 2A: install PostgreSQL on macOS",
                "body": "If you already use Homebrew and do not have a PostgreSQL installation, run the commands below in macOS Terminal. `brew install` installs the versioned PostgreSQL 17 package. `brew services start` starts its server in the background. The formula is keg-only, so its psql binary may not be on PATH; the complete executable path below works without changing PATH. A fresh Homebrew cluster normally has a role matching the macOS account that initialized it.\n\nIf a server is already installed, inspect it instead of reinstalling, reinitializing or overwriting an existing database directory. `-d postgres` selects the standard maintenance database. Do not type these shell commands into psql.",
                "language": "bash",
                "caption": "macOS Terminal — install a local server and open psql",
                "code": "brew install postgresql@17\nbrew services start postgresql@17\n\"$(brew --prefix postgresql@17)/bin/psql\" --version\n\"$(brew --prefix postgresql@17)/bin/psql\" -d postgres"
            },
            {
                "id": "ubuntu",
                "title": "Option 2B: install PostgreSQL on Ubuntu",
                "body": "On Ubuntu, package installation includes the database service and command-line client. The installed major version depends on the distribution. On systemd-based Ubuntu, `systemctl` starts the service. Ubuntu usually uses local peer authentication: `sudo -u postgres` starts psql as the operating-system account postgres, matching the PostgreSQL role postgres. That is why a bare `psql -U postgres` from your personal account may fail even when the server is fine.\n\nThis route assumes sudo permission on a machine you administer. Later shell commands must keep the `sudo -u postgres` prefix, unless you deliberately configure an approved different login. Do not disable authentication or expose the service to the internet.",
                "language": "bash",
                "caption": "Ubuntu Terminal — install and open psql locally",
                "code": "sudo apt update\nsudo apt install postgresql postgresql-client\nsudo systemctl start postgresql\npsql --version\nsudo -u postgres psql -d postgres"
            },
            {
                "id": "windows",
                "title": "Option 2C: install PostgreSQL on Windows",
                "body": "Use the installer linked by the official PostgreSQL Windows download page. Select the server and command-line tools, note the configured port (typically 5432), and keep the password you choose for the postgres administrator role private. Open the installed SQL Shell (psql); it asks for server, database, port, user and password. On a fresh local install, use localhost, postgres, 5432 and postgres respectively.\n\nIf psql is on PATH, the Command Prompt or PowerShell example below is equivalent; `-W` prompts for a password rather than placing it in the command line. If Windows reports that psql is not recognized, open SQL Shell from the installed shortcuts. Do not install additional tools just to repair PATH.",
                "language": "bash",
                "caption": "Windows shell — only if psql is on PATH",
                "code": "psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -W"
            },
            {
                "id": "first-connection",
                "title": "Verify a real connection",
                "body": "`psql --version` only proves that the client executable is present. `pg_isready` can check whether a server listener responds, but not whether your account can log in or run queries. The real proof is a PostgreSQL prompt and a successful SQL statement. Inside psql, type the following SQL with its semicolon. The maintenance database should be called postgres if you followed the local route. A provided server may assign a different starting database.\n\nA prompt such as `postgres=#` or `postgres=>` means psql is connected. Do not type the prompt itself. Run the SQL, inspect the result and use `\\q` to leave. The next lesson explains the prompt and the backslash command.",
                "language": "sql",
                "caption": "SQL inside psql — first connection proof",
                "code": "SELECT current_database();",
                "output": " current_database\n------------------\n postgres\n(1 row)"
            },
            {
                "id": "diagnose-setup",
                "title": "If it does not work, find the right layer",
                "body": "`command not found` or `not recognized` for psql is a client installation or PATH problem. `connection refused` means the client cannot reach a listener at the chosen host and port; check the server service. `password authentication failed` or a missing role means the server responded, but the identity or authentication did not match. `database does not exist` means the server could not find the named database. Do not delete data, reinitialize the cluster or edit server-wide security settings to make a tutorial command run.\n\nIf software installation is restricted, use a supplied training server and document the missing prerequisite. The lesson is complete when you can prove one SQL query succeeded, or accurately identify a blocker outside your permissions."
            }
        ],
        "warning": "Choose only one setup route. Never reinitialize an existing cluster, expose a training server publicly, or publish authentication secrets.",
        "assignment": [
            "Explain why installing psql is not the same as starting PostgreSQL.",
            "Follow ONE platform or approved-server route, not every installation option.",
            "Connect and execute SELECT current_database();, recording the result without secrets.",
            "If blocked, distinguish client executable, network/service and authentication failure."
        ],
        "resources": [
            {
                "title": "Homebrew PostgreSQL 17 formula",
                "url": "https://formulae.brew.sh/formula/postgresql@17",
                "kind": "reference"
            },
            {
                "title": "Ubuntu Server — Install PostgreSQL",
                "url": "https://ubuntu.com/server/docs/how-to/databases/install-postgresql/",
                "kind": "reference"
            },
            {
                "title": "PostgreSQL Windows download",
                "url": "https://www.postgresql.org/download/windows/",
                "kind": "reference"
            },
            {
                "title": "PostgreSQL 17 — Getting Started",
                "url": "https://www.postgresql.org/docs/17/tutorial-start.html",
                "kind": "reference"
            }
        ],
        "practiceObjective": "Connect to one authorized native PostgreSQL environment without unrelated technology prerequisites.",
        "practiceInstructions": [
            "Pick an already-provisioned server or native setup for your operating system.",
            "Record client version and non-secret connection command.",
            "Run SELECT current_database(); and quit with \\q.",
            "Explain how a missing psql executable differs from a refused connection or rejected login."
        ],
        "knowledgeCheck": "What does psql --version prove? Can a server be listening and still reject your login? Which component persists when you quit psql?",
        "readingTitle": "Install or access PostgreSQL",
        "practiceTitle": "Prepare your PostgreSQL learning environment",
        "checkTitle": "Check your setup",
        "practiceScenario": "Prepare a safe beginner PostgreSQL environment.",
        "practiceDeliverables": [
            "One chosen setup route",
            "One successful SQL query or precise environment blocker",
            "Server-versus-client explanation"
        ],
        "practiceCompletionCriteria": [
            "The learner uses no untaught container workflow.",
            "The observed evidence comes from a real PostgreSQL session.",
            "Credentials and shared data remain protected."
        ]
    },
    {
        "id": "postgresql-first-connection",
        "title": "Connect to PostgreSQL with psql",
        "introduction": "You have a running PostgreSQL server or access to an approved one. Now learn psql as an interactive client. You will connect, understand what the prompt means, ask PostgreSQL a question, discover built-in commands and leave safely. No table or Steward application is needed.",
        "outcomes": [
            "Distinguish your shell, psql meta-commands and server-executed SQL.",
            "Explain host (-h), port (-p), role (-U) and database (-d) and reuse the setup method that worked.",
            "Use \\conninfo, \\l, \\c, \\du, \\?, \\h and \\q in a connected session.",
            "Run a simple SELECT and diagnose wrong-database, connection and SQL errors."
        ],
        "sections": [
            {
                "id": "psql-client",
                "title": "What is psql?",
                "body": "PostgreSQL is a database server; SQL is a language the server executes; psql is a separate terminal program that connects to the server. psql sends SQL and prints results, but it also has special backslash shortcuts for listing databases, finding help and controlling your session. A graphical client such as DBeaver works on the same basic principle.\n\nWhen you close psql, you end one client session. PostgreSQL continues running and its stored records do not normally disappear. The terminal window does not contain the database."
            },
            {
                "id": "start-client",
                "title": "Open a session with the connection you already tested",
                "body": "Run the same connection method that worked in the previous lesson. On macOS Homebrew use its versioned psql binary with `-d postgres`. On Ubuntu's default local installation, run `sudo -u postgres psql -d postgres`. On Windows use SQL Shell or the local TCP command. For a supplied server, use the given host, port, role, database and authentication method.\n\n`-h` selects the host computer, `-p` the server listener port, `-U` the database role and `-d` the database. `-W` prompts for a password on connections configured to need one; it is not required for Ubuntu's peer-authenticated local socket. On Unix, omitting `-h` usually selects a local socket, which can authenticate differently from TCP `127.0.0.1`. Do not invent credentials or assume a fictional example role exists.",
                "language": "text",
                "caption": "Choose only your own previously verified shell command",
                "code": "macOS Homebrew:\n  \"$(brew --prefix postgresql@17)/bin/psql\" -d postgres\nUbuntu local:\n  sudo -u postgres psql -d postgres\nWindows local TCP (if psql is on PATH):\n  psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -W"
            },
            {
                "id": "prompt",
                "title": "Read the psql prompt and finish a statement",
                "body": "A connected session may display `postgres=#` for a superuser or `postgres=>` for an ordinary role. The word postgres is the selected database; the prompt is NOT text you should type. SQL needs a terminating semicolon. If you forget it, a continuation prompt like `postgres-#` means psql is still collecting your statement, not that it has executed it or crashed.\n\nBackslash commands are different: they are instructions to psql itself and usually run immediately when Enter is pressed, without a semicolon. If a long listing opens in a terminal pager, press `q` to close the pager and return to psql."
            },
            {
                "id": "first-query",
                "title": "Ask PostgreSQL a question",
                "body": "Type the SQL below inside psql. `SELECT` is sent to the SERVER, not interpreted as a client shortcut. `current_database()` returns the selected database, `current_user` names the current role and `2 + 2` calculates a value without any table. The database should be postgres for the native starting routes; the role differs across systems, particularly on macOS. Seeing answer 4 proves authentication and SQL execution.",
                "language": "sql",
                "caption": "SQL in psql — query the server",
                "code": "SELECT current_database() AS db,\n       current_user AS role_name,\n       2 + 2 AS answer;",
                "output": " db       | role_name | answer\n----------+-----------+-------\n postgres | postgres  |     4\n(1 row)\n(example role_name; your local role may differ)"
            },
            {
                "id": "help",
                "title": "Discover commands instead of guessing",
                "body": "Inside psql, type `\\?` for the list of psql's own backslash commands. Type `\\h` to list SQL statements that psql can explain, then `\\h SELECT` for the syntax of the SELECT statement you just ran. **\\? answers 'What can the CLIENT do?' while \\h answers 'What SQL can I send to the SERVER?'** Neither is the SQL statement HELP.\n\n`\\conninfo` reports the currently connected host/database/role. `\\l` (lowercase letter L) lists databases managed by the server. `\\du` lists roles, without changing them. `\\c postgres` reopens the connection to the existing postgres database (the next lesson creates another). `\\q` exits the psql client. Type these at the psql prompt, not in the shell, and do not add SQL semicolons.",
                "language": "text",
                "caption": "psql meta-commands — run in order inside psql",
                "code": "\\conninfo\n\\l\n\\du\n\\?\n\\h\n\\h SELECT\n\\c postgres\n\\q"
            },
            {
                "id": "table-preview",
                "title": "Where are \\d and \\dt?",
                "body": "psql also provides `\\dn` to list schemas, `\\dt` to list tables visible in your search path, and `\\d` to describe database objects. In a brand-new database, `\\dt` may say it found no relations. That is expected: we have not yet created a table. After you create a database, schema and table in the next lessons, a separate practical lesson will teach `\\dn`, `\\dt library.*`, `\\d library.books` and `\\d+ library.books` using real objects. For now, remember they inspect metadata; they do not create rows."
            },
            {
                "id": "failure",
                "title": "Diagnose a failed connection",
                "body": "If your operating-system shell says `psql: command not found`, check installation and PATH before troubleshooting PostgreSQL SQL. `connection refused` points to host, port or stopped server. An authentication error means the server responded but rejected the login. `database does not exist` means the named database is missing. A SQL syntax error means you connected successfully and submitted invalid SQL.\n\nFor a safe negative test, quit psql and use the same shell command with `-d tsa_database_that_does_not_exist`, then restore `-d postgres`. Expect the database-not-found error. Do not create or drop databases just to force a result. `psql --version` proves only that the client exists; `pg_isready` is a listener probe, not proof your role can execute queries."
            },
            {
                "id": "session-end",
                "title": "Quit without deleting anything",
                "body": "Use `\\q` to leave psql, then reconnect with the same working shell command. The database server continues running and `SELECT 2 + 2;` still returns 4. A second psql window can connect to the same server independently. Practice explaining which commands run in the operating-system shell, which begin with backslash and are processed by psql, and which are SQL sent to PostgreSQL."
            }
        ],
        "warning": "Use an isolated learning server and invented data. Do not modify production or shared databases, publish real credentials, or drop existing objects merely to repeat an exercise.",
        "assignment": [
            "Open psql with your own platform's verified connection method.",
            "Run the SQL calculation and compare current_database()/current_user with \\conninfo.",
            "Use \\l, \\du, \\?, \\h SELECT and \\c postgres; explain what each displays.",
            "Quit with \\q and reconnect without losing server data.",
            "Demonstrate one safe wrong-database error and explain why it is different from an SQL syntax error."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Getting Started",
                "url": "https://www.postgresql.org/docs/17/tutorial.html",
                "kind": "reference",
                "purpose": "Follow the official sequence from architecture to databases, SQL tables and records."
            },
            {
                "title": "PostgreSQL 17 — Architectural Fundamentals",
                "url": "https://www.postgresql.org/docs/17/tutorial-arch.html",
                "kind": "reference",
                "purpose": "Verify the separate roles of the running server and client applications."
            },
            {
                "title": "PostgreSQL 17 — psql",
                "url": "https://www.postgresql.org/docs/17/app-psql.html",
                "kind": "reference",
                "purpose": "Understand connection flags, prompts, backslash commands and scripts."
            }
        ],
        "practiceObjective": "Use an actual psql session and find commands without a container prerequisite.",
        "practiceInstructions": [
            "Use the previously verified native client or supplied authorized server; do not introduce another tool.",
            "Run \\conninfo, \\l, \\?, \\h SELECT and a SELECT query in one session.",
            "Quit with \\q, reconnect and try a deliberately nonexistent database once.",
            "Separate shell commands, psql shortcuts and server-executed SQL in your evidence."
        ],
        "knowledgeCheck": "What is PostgreSQL versus psql versus SQL? Why is \\? different from \\h SELECT? When can \\dt correctly say no relations were found? What do -h, -p, -U and -d mean?",
        "readingTitle": "Use psql to connect and get help",
        "practiceTitle": "Explore your first psql session",
        "checkTitle": "Check client and server understanding",
        "practiceScenario": "Connect to an isolated PostgreSQL lab, discover which client/server/database/role you are actually using, and classify failures.",
        "practiceDeliverables": [
            "Published commands or SQL with observed results",
            "One documented failure or alternative with cause",
            "Short explanation of which PostgreSQL layer acted"
        ],
        "practiceCompletionCriteria": [
            "Another learner can reproduce the described sequence or explain the diagram from the submitted evidence.",
            "Every concept in the exercise was introduced in a preceding reading section.",
            "The explanation distinguishes the database server, selected database and client session where applicable."
        ]
    },
    {
        "id": "postgresql-create-database",
        "title": "Create Your First PostgreSQL Database",
        "introduction": "You are connected to a PostgreSQL server with psql. Now create a separate place for our library records. We will learn exactly what the CREATE DATABASE command creates, which connection runs it, how to enter the new database, and what to do if permissions or the database name prevent success. We are not creating any tables yet.",
        "outcomes": [
            "Distinguish a PostgreSQL server from one of the databases it hosts.",
            "Create a new database from an existing maintenance connection.",
            "Reconnect and prove which database the SQL engine is using.",
            "Diagnose a missing database, duplicate database name and insufficient privilege without deleting someone else's data."
        ],
        "sections": [
            {
                "id": "database-location",
                "title": "Where does a database live?",
                "body": "A PostgreSQL server manages a database cluster: a set of named databases controlled by the same server installation. The server is the running program. A database is one named collection of schemas, tables, functions and other objects managed by that program. The common maintenance database called postgres is just one database; it is not the server program itself.\n\nImagine a library and a school using the same learning server. We can give them separate databases, tsa_library and tsa_school. Their tables do not automatically become visible to each other. The two database names share a server, but each normal psql connection chooses one database at a time. A database does not contain another database. We will inspect schemas in the following lesson.\n\nA PostgreSQL role (the identity that connects or owns objects) is not created inside an individual database: roles are cluster-wide, while privileges are checked for particular databases and objects. Do not confuse a role named tsa_learner, a database named tsa_library and a schema named library."
            },
            {
                "id": "before-you-create",
                "title": "Check which database you are using",
                "body": "Start psql using the existing lab from the previous lesson. The Docker example opens postgres with `docker exec -it tsa-pg-lesson psql -U tsa_learner -d postgres`; a host-installed psql connects using -h, -p, -U and -d, as already explained.\n\nInside psql, `\\conninfo` shows connection information and `\\l` lists databases on this server. Use the SQL below to establish exactly where you are before changing anything. If current_database() says tsa_library, you are already there, and you should check whether your earlier work exists before attempting to create the same database again. For this first run, the expected database is postgres.\n\nThe prompt also displays the database name. That is useful feedback, but the SQL result is our unambiguous proof of the active database context. The user name in the query is the role used for authorization, not an operating-system account.",
                "language": "sql",
                "caption": "SQL — identify the database before creating another",
                "code": "SELECT current_database() AS connected_database,\n       current_user AS connected_role;",
                "output": " connected_database | connected_role\n--------------------+----------------\n postgres           | tsa_learner\n(1 row)"
            },
            {
                "id": "create-it",
                "title": "Create a database called tsa_library",
                "body": "While connected to postgres, type the command below and end it with a semicolon. CREATE DATABASE is a SQL statement sent by psql to the server. PostgreSQL creates a new database based on the configured template, normally template1; the command does not create a new server process or automatically switch your current connection.\n\nA successful command returns CREATE DATABASE. PostgreSQL requires a role with CREATEDB privilege or suitable administrative rights. The disposable Docker role we created is a lab-only bootstrap role with enough rights. On a course or company server, a restricted student role may lack CREATEDB. In that case request an approved empty database rather than trying passwords or changing account privileges. Do not wrap CREATE DATABASE in BEGIN/COMMIT: PostgreSQL does not allow that command inside a transaction block.\n\nA second run will fail with 'database \"tsa_library\" already exists'. That failure is protective information, not an invitation to DROP DATABASE. You can reuse the existing database if it is your own, or choose a different disposable name.",
                "language": "sql",
                "caption": "SQL in the postgres database — create tsa_library",
                "code": "CREATE DATABASE tsa_library;",
                "output": "CREATE DATABASE"
            },
            {
                "id": "list-and-connect",
                "title": "Switch from postgres to tsa_library",
                "body": "Your existing psql session is still connected to postgres. First use `\\l` to verify that tsa_library now appears. Then `\\connect tsa_library` (or its short form `\\c tsa_library`) tells the psql client to establish a new connection to that database using the current host and role. `\\connect` is a backslash command understood by psql, not SQL. With a separately installed client, you can instead exit with `\\q` and start `psql -h 127.0.0.1 -p 55432 -U tsa_learner -d tsa_library -W`.\n\nAfter reconnecting, run SELECT current_database(); The result changes to tsa_library. The server is the same one; the selected database has changed. Notice that switching databases has nothing to do with switching schemas (which we have not studied yet).",
                "language": "text",
                "caption": "Interactive psql — list databases, reconnect, inspect",
                "code": "\\l\n\\connect tsa_library\nSELECT current_database();",
                "output": " current_database\n------------------\n tsa_library\n(1 row)"
            },
            {
                "id": "compare-databases",
                "title": "What happens to tables in other databases?",
                "body": "Suppose a coworker creates a school.students table inside tsa_school while you are connected to tsa_library. You cannot type SELECT * FROM tsa_school.school.students; to cross into that other PostgreSQL database. Ordinary SQL names in a connection refer to objects within its current database; PostgreSQL does not treat a dotted database prefix as an automatic cross-database link. You would normally open a separate connection to tsa_school. Advanced options for cross-database access exist, but they are not needed here.\n\nThis also explains why using a database name incorrectly can be confusing. A missing table is not automatically a missing database. First ask: Did my client reach the server? Did it connect to the intended database? Only then ask whether the table exists inside that database.\n\nDo not create a database for every table or every application user. Databases are coarse organizational and administrative boundaries. The next lesson introduces schemas for naming and organizing multiple tables within a single database."
            },
            {
                "id": "when-it-fails",
                "title": "Troubleshoot database creation",
                "body": "If `CREATE DATABASE` reports permission denied to create database, the server understood the SQL but the role lacks permission. Your connection works; authorization for this particular change does not. If the server refuses a connection, you have not reached SQL at all. If `\\connect tsa_library` reports a nonexistent database, return to a known maintenance database and check `\\l` and your spelling. If it reports insufficient CONNECT privilege, the database may exist but the selected role is not allowed to enter it.\n\nA successful CREATE DATABASE response proves that this server created the database; it does not prove tables or library records exist within it. Capture the relevant output with the server host, port, database and non-secret role name. Avoid publishing connection passwords or using a production server to repeat these experiments."
            },
            {
                "id": "separate-practice-data",
                "title": "Keep the library and application laboratories separate",
                "body": "The next lessons will create library tables inside tsa_library. Later applied Steward exercises use a different disposable database, tsa_steward_lab. If your own lab role allows it, you may create that second database from postgres as shown below, but it is optional at this stage. Do not run this command if the lab already has an authorized database named tsa_steward_lab. We will never have to pretend the library.books table belongs to a Steward schema.",
                "language": "text",
                "caption": "Optional maintenance command — prepare separate Steward practice database",
                "code": "\\connect postgres\n-- Only if this is YOUR disposable PostgreSQL lab:\nCREATE DATABASE tsa_steward_lab;\n\\connect tsa_library"
            }
        ],
        "warning": "CREATE DATABASE is a real server-side change. Execute only against an approved disposable server. Never drop an existing database to rerun a lesson. Your lab may be restricted to using a database provided by an administrator.",
        "assignment": [
            "Verify that you are initially connected to postgres using SELECT current_database() and \\conninfo.",
            "Create tsa_library if authorized, list it with \\l, reconnect and verify the new current_database() result.",
            "State why CREATE DATABASE did not automatically move your existing connection.",
            "Explain the difference between permission denied for CREATE DATABASE and connection refused.",
            "Draw a server with two peer databases. Do not place one database inside the other."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Creating a Database",
                "url": "https://www.postgresql.org/docs/17/tutorial-createdb.html",
                "kind": "reference",
                "purpose": "Understand database creation and database-specific connections."
            },
            {
                "title": "PostgreSQL 17 — Managing Databases",
                "url": "https://www.postgresql.org/docs/17/manage-ag-overview.html",
                "kind": "reference",
                "purpose": "Compare database isolation, roles and system catalog views."
            }
        ],
        "practiceObjective": "Create and connect to a separate PostgreSQL learning database, identifying which process and role performed the action.",
        "practiceInstructions": [
            "From a known maintenance connection, verify current_database() and current_user.",
            "Create tsa_library once, capturing the successful statement or an honest CREATEDB permission blocker.",
            "List databases, reconnect to tsa_library and verify current_database() changed.",
            "Describe why a table in a different database is not accessible just by prefixing an extra database name."
        ],
        "knowledgeCheck": "You run CREATE DATABASE tsa_library while connected to postgres. Does your session switch automatically? What is the minimum privilege required? What changes if the database exists already? Why is tsa_library not a schema under postgres?",
        "readingTitle": "Understand and create a PostgreSQL database",
        "practiceTitle": "Create and reconnect to a library database",
        "checkTitle": "Check database boundaries",
        "practiceScenario": "Set up the independent library lab while keeping it separate from the later Steward data project.",
        "practiceDeliverables": [
            "Safe CREATE DATABASE and \\connect transcript (or explicit permission blocker)",
            "Two-database diagram and current_database() proof",
            "Error classification for nonexistent and unauthorized databases"
        ],
        "practiceCompletionCriteria": [
            "The learner proves which database each connection selected.",
            "No pre-existing database was dropped or overwritten.",
            "The learner can distinguish cluster-wide roles from database-specific content."
        ]
    },
    {
        "id": "postgresql-create-schema",
        "title": "Understand and Create PostgreSQL Schemas",
        "introduction": "A database can hold many tables, and a large application soon needs a way to organize their names. PostgreSQL schemas solve that problem. We will create library inside tsa_library, compare it with the existing public schema, and learn why the search_path matters. This is about namespaces, not the SQL table definitions we will write in the next lesson.",
        "outcomes": [
            "Explain a schema as a namespace inside one database.",
            "Create, list and inspect a schema using SQL and psql.",
            "Explain qualified names such as library.books and public.books.",
            "Predict how search_path resolves an unqualified table name, without pretending it changes databases."
        ],
        "sections": [
            {
                "id": "schema-meaning",
                "title": "What is a database schema?",
                "body": "You already created tsa_library. Picture a university database that stores students, courses, invoices and library books. Those tables can share one database and still be organized by area: academic.students, academic.courses, finance.invoices, library.books. The word before each dot is a schema; the word after the dot is a table. PostgreSQL allows two schemas to have tables with the same short name, for example finance.transactions and audit.transactions. Their complete names are distinct.\n\nA schema is a namespace inside the current database. It is not another server and not another database. A schema cannot contain a nested schema; it contains objects such as tables, views, sequences and functions. The word 'database schema' also sometimes refers to the overall logical design of tables and relationships, but here CREATE SCHEMA means creating a named PostgreSQL namespace.\n\nDefault PostgreSQL databases commonly include a schema called public. Seeing public in the database does not mean the server shares those tables publicly over the internet. Access is still governed by roles and privileges. We will create our own schema called library so the namespace boundary is visible."
            },
            {
                "id": "before-creating",
                "title": "Check your database before making a schema",
                "body": "A schema belongs to the database your connection selected. You do not create a schema in postgres and then automatically find it in tsa_library. Start psql with -d tsa_library (or use \\connect tsa_library) and run SELECT current_database(); You should see tsa_library.\n\nUse `\\dn` in psql to list schemas. On a fresh database it normally shows public. Compare this with `\\l`, which lists databases instead. These are two different inventories: \\l is a list at the server/database level; \\dn is a list inside the currently selected database. Keeping that distinction prevents many 'the table disappeared' mistakes.\n\nIf the current database is not tsa_library, fix the connection first. PostgreSQL will obey a valid CREATE SCHEMA in whichever database you are actually using; it will not infer your intended target from the schema name.",
                "language": "sql",
                "caption": "SQL — prove your database before creating a schema",
                "code": "SELECT current_database();",
                "output": " current_database\n------------------\n tsa_library\n(1 row)"
            },
            {
                "id": "create-library-schema",
                "title": "Create the library schema",
                "body": "Run the following code while connected to tsa_library. The first statement asks PostgreSQL to create the namespace named library. PostgreSQL responds CREATE SCHEMA. The second query examines information_schema.schemata, a standardized metadata view, to verify that the new namespace can be seen by your role.\n\nIn psql also type \\dn to list the visible schemas. You should find public and library, although your authorized setup may have others. Creating a schema does not create a books table or change which database is selected. Later, CREATE TABLE library.books will put a table into this new namespace.\n\nThe role needs CREATE privilege on the database to create the schema. On an administrator-managed environment, you may have permission to use a supplied schema but not create one. Ask for a dedicated lab schema or suitable privilege; do not attempt to change production grants.",
                "language": "sql",
                "caption": "SQL in tsa_library — create and inspect the library schema",
                "code": "CREATE SCHEMA library;\nSELECT schema_name\nFROM information_schema.schemata\nWHERE schema_name = 'library';",
                "output": "CREATE SCHEMA\n schema_name\n-------------\n library\n(1 row)"
            },
            {
                "id": "qualified-names",
                "title": "How schema-qualified names work",
                "body": "A qualified name is a complete schema plus object name, separated by a dot. library.books means a table named books in schema library, inside the currently connected database. public.books would be a different table with the same short name if it existed. There is no collision because the schema prefix distinguishes them.\n\nUse the full form while learning: CREATE TABLE library.books (...); INSERT INTO library.books ...; SELECT * FROM library.books; This makes it obvious where PostgreSQL should find the object. A schema prefix does not grant you permissions. A role might be allowed to read one schema's table and denied access to another.\n\nThe next lesson will create library.books for real. For now, draw both public and library under tsa_library with no books table yet. Distinguish an existing namespace from an existing object inside it."
            },
            {
                "id": "search-path",
                "title": "What does search_path do?",
                "body": "When you type SELECT * FROM books without naming a schema, PostgreSQL must choose where to look. The search_path setting defines the order of schemas searched for unqualified object names. On many fresh installations the default is \"$user\", public: a schema named after the current role is checked if it exists, then public. The schema you created, library, is not automatically added just because it exists.\n\nRun SHOW search_path; to see the current session's rule. `SELECT current_schemas(false);` shows existing schemas from the effective search path. You can choose an explicit path for just your current session using SET search_path TO library, public; The default path may be overridden by configuration or the role. Changing it does not change databases and does not create tables.\n\nA common failure: library.books exists but SELECT * FROM books reports 'relation does not exist' because library is not on the path. Prefer library.books at first; later learn when a controlled search_path is useful. Name resolution also has security implications: do not add untrusted writable schemas to a privileged application's search_path.",
                "language": "sql",
                "caption": "SQL — inspect and change schema search path in your session",
                "code": "SHOW search_path;\nSET search_path TO library, public;\nSHOW search_path;",
                "output": "   search_path\n-----------------\n \"$user\", public\n(1 row)\nSET\n   search_path\n-----------------\n library, public\n(1 row)\n(typical default; your configuration may differ)"
            },
            {
                "id": "compare-three-levels",
                "title": "Check the server, database and schema hierarchy",
                "body": "Think through the hierarchy using a specific connection: PostgreSQL server → tsa_library database → library schema → books table (to be created next). The server may also have tsa_steward_lab; it is a *peer database*, not a schema beneath tsa_library. The public schema is a peer of library inside tsa_library; it is not a globally shared folder across databases.\n\nTo test your understanding, predict what you would see if you connected to tsa_steward_lab and listed schemas. You might see its own public schema, but not the library schema you made in tsa_library. This is because schemas belong to databases. Do not actually switch to an unknown server just to run a demonstration."
            },
            {
                "id": "schema-errors",
                "title": "If the schema isn't found",
                "body": "'schema \"library\" does not exist' often means you are in the wrong database or CREATE SCHEMA never succeeded. Check SELECT current_database(); and \\dn before rerunning anything. 'permission denied for schema library' means the namespace may exist but this role cannot use it. 'relation \"books\" does not exist' after SELECT * FROM library.books means the schema may exist but its table has not been created yet. These are different errors.\n\nIf CREATE SCHEMA reports that the schema already exists, inspect it with \\dn and identify the owner before changing or reusing it. Do not DROP SCHEMA ... CASCADE to repeat a tutorial; CASCADE can delete other objects. Good debugging identifies which object or privilege is absent before attempting a change."
            }
        ],
        "warning": "Never use DROP SCHEMA ... CASCADE simply to rerun a learning exercise. Schema names do not confer access rights by themselves. Use a disposable lab with an authorized role.",
        "assignment": [
            "Connect to tsa_library and prove the database name with SELECT current_database().",
            "Use \\dn to inspect the existing public schema; create library and verify it with \\dn and information_schema.",
            "Show the current search_path, change it for your current session only, and explain what did NOT change.",
            "Draw two peer schemas under one database and a separate second database under the same server.",
            "Explain why SELECT * FROM books may fail when the table actually exists as library.books."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Schemas",
                "url": "https://www.postgresql.org/docs/17/ddl-schemas.html",
                "kind": "reference",
                "purpose": "Verify schema namespaces, qualified names, search_path and schema permissions."
            },
            {
                "title": "PostgreSQL 17 — System Information Functions",
                "url": "https://www.postgresql.org/docs/17/functions-info.html",
                "kind": "reference",
                "purpose": "Reference current_schema() and current_schemas()."
            }
        ],
        "practiceObjective": "Create and inspect a PostgreSQL schema without confusing namespaces with databases.",
        "practiceInstructions": [
            "Inspect \\l and \\dn and describe which lists databases versus schemas.",
            "Create library in tsa_library, verify using the published query and record the role/permissions.",
            "Inspect and set search_path, explain how unqualified names are resolved.",
            "Predict how public and library behave when you reconnect or change databases."
        ],
        "knowledgeCheck": "You created library inside tsa_library. Does it appear in tsa_steward_lab? What does library.books refer to? Does SHOW search_path change which database you are using? What is different between 'schema does not exist' and 'permission denied for schema'?",
        "readingTitle": "Learn what schemas are and how to create them",
        "practiceTitle": "Create and inspect a library schema",
        "checkTitle": "Check schema names and search paths",
        "practiceScenario": "Organize a database's objects into readable namespaces without touching Steward.",
        "practiceDeliverables": [
            "Schema creation and inspection transcript",
            "Database/schema hierarchy diagram",
            "search_path observation and explanation"
        ],
        "practiceCompletionCriteria": [
            "A schema exists within the intended database.",
            "The learner can explain public and schema-qualified names.",
            "The learner distinguishes session name resolution from object permissions."
        ]
    },
    {
        "id": "postgresql-create-table",
        "title": "Create Your First PostgreSQL Table",
        "introduction": "You have a running PostgreSQL server, a connection to tsa_library, and a library schema. Now we need a table. This lesson teaches what tables, columns, types and constraints mean before using CREATE TABLE. Inserting books is a separate lesson; the first step is to understand what we are defining.",
        "outcomes": [
            "Explain table, row and column separately from database and schema.",
            "Choose suitable PostgreSQL types for a simple book record.",
            "Identify which rules PRIMARY KEY, GENERATED ALWAYS AS IDENTITY, NOT NULL and CHECK enforce.",
            "Create and inspect a durable table in an explicit schema."
        ],
        "sections": [
            {
                "id": "table-vocabulary",
                "title": "What is a table, and where does it live?",
                "body": "A table holds facts about one kind of thing. In a library application, each row in books describes one book record. Columns describe what values can be stored for that record: an identifier, title, author and publication year. A table definition exists even before any rows have been inserted. A row is a single record, not another table; a column is a field in every row, not a file on disk.\n\nTrace the hierarchy you have built: PostgreSQL server → tsa_library database → library schema → books table → individual book rows. The schema groups the names of tables. PostgreSQL manages the actual storage; you do not create files yourself. The client psql sends a CREATE TABLE request, and the server carries it out in the connected database.\n\nAt this stage we store author as text in each book record for simplicity. That is not how we would necessarily design a mature multi-author library. A later lesson on relationships will demonstrate a separate authors table with foreign keys. Do not try to learn all table relationships before learning one table."
            },
            {
                "id": "select-column-types",
                "title": "Choose columns and their data types",
                "body": "Start with a sentence: one row represents a book entry. We need book_id to identify it, title to name it, author to record its writer, and published_year to record a year when known. Types restrict what values a column can hold: bigint stores large whole numbers; text stores variable-length character strings; integer stores ordinary whole numbers. A year is deliberately stored as an integer in this small lab; a calendar date or timestamp is a different fact and would use a different PostgreSQL type.\n\nThe type alone cannot express every business rule. An integer column accepts negative numbers unless a rule rejects them. A text column accepts the empty string even if it has NOT NULL, because empty text and missing/NULL are different values. We will add explicit constraints. Choosing types before writing a table avoids treating SQL as a collection of magic keywords."
            },
            {
                "id": "primary-key-and-rules",
                "title": "What does a primary key protect?",
                "body": "The primary key identifies each row uniquely and cannot be NULL. Using GENERATED ALWAYS AS IDENTITY asks PostgreSQL to generate the integer book_id when a book is inserted. We do not have to type 1, 2 or 3 ourselves, and we should not assume generated IDs are a perfect chronological counter; gaps can occur. In real systems, the identifier is not necessarily the same as a title or a business reference.\n\nNOT NULL means title and author must be supplied. published_year is optional in our model: unknown publication dates can be represented as NULL. CHECK (published_year BETWEEN 1450 AND 2100) limits non-null values using an artificial teaching assumption; it is not a universal historical rule. PostgreSQL enforces these constraints no matter whether the write comes from psql, an ORM or a graphical database client. Application validation still adds user-facing messages and rules that cannot conveniently fit a column constraint."
            },
            {
                "id": "create-books",
                "title": "Create your first table",
                "body": "Check SELECT current_database(); first. It must say tsa_library. Then run this SQL at the psql prompt. CREATE TABLE names the operation; library.books specifies the schema and new table. Parentheses contain comma-separated column definitions; the semicolon ends the statement. Each column line states a name, type and applicable rules.\n\nAfter execution PostgreSQL returns CREATE TABLE. It has created the *structure*, not any book rows. Do not confuse this with CREATE DATABASE or CREATE SCHEMA: those created enclosing containers earlier. If the message instead says schema \"library\" does not exist, correct your connection or create the missing schema through the preceding lesson—not by silently creating an unrelated public.books table.",
                "caption": "SQL in tsa_library — create a persistent table",
                "language": "sql",
                "code": "CREATE TABLE library.books (\n  book_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title text NOT NULL,\n  author text NOT NULL,\n  published_year integer CHECK (published_year BETWEEN 1450 AND 2100)\n);",
                "output": "CREATE TABLE"
            },
            {
                "id": "inspect-books",
                "title": "Inspect the table definition",
                "body": "The psql command \\dt library.* lists tables in the library schema; \\d library.books displays the table's column definitions, identity and constraints. These are psql meta-commands: you do not put a semicolon after them. psql asks the server for catalog information and formats it for you. The SQL query below provides another way to inspect columns without relying on psql's display.\n\nBefore running the query, predict four rows in the metadata result: book_id, title, author and published_year. The values describe column types and nullability, not books. The table still has zero book records. This distinction matters when debugging an empty SELECT: the absence of data does not mean the table itself is missing.",
                "caption": "SQL — inspect your book table columns",
                "language": "sql",
                "code": "SELECT column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_schema='library' AND table_name='books'\nORDER BY ordinal_position;",
                "output": "book_id|bigint|NO\ntitle|text|NO\nauthor|text|NO\npublished_year|integer|YES"
            },
            {
                "id": "reconnect-books",
                "title": "Does the table survive a new connection?",
                "body": "Type \\q to leave psql, then reconnect to tsa_library and issue \\dt library.* again. The books table remains because CREATE TABLE creates a persistent table by default. Your terminal window did not own the table; the server manages it. If you connect to postgres instead of tsa_library, you will not see the library schema because you selected the wrong database. Check the connection target before concluding that PostgreSQL deleted anything.\n\nA duplicate-table error on a second CREATE TABLE is also not an invitation to drop existing records. Inspect the table. CREATE TABLE IF NOT EXISTS may suppress a duplicate-name error, but it does not prove that the existing columns or constraints match your intended definition. An actual migration process is taught later, after you understand how persistent structures change."
            },
            {
                "id": "table-errors",
                "title": "Common CREATE TABLE errors",
                "body": "\"Schema library does not exist\" means your current database lacks that namespace. \"Permission denied for schema library\" means the role lacks a needed privilege even if the schema exists. \"Relation books already exists\" means there is already a conflicting object name. A syntax error means PostgreSQL could not parse the SQL, often because of a missing comma or parenthesis. These failures occur after the server/client connection is working.\n\nDiagnose in order: SELECT current_database();, \\dn, \\dt library.* and \\d library.books. Do not delete objects or invent credentials as a debugging shortcut. The following lesson inserts rows into the empty table you have just verified."
            }
        ],
        "warning": "Use a disposable, authorized learning database. Do not DROP an existing table to make a tutorial repeat; it may contain data.",
        "assignment": [
            "Draw a server, database, schema and table hierarchy with the four columns.",
            "Explain which statements create metadata and which would insert records.",
            "Run the CREATE TABLE example and inspect it with \\dt and \\d.",
            "Verify the column types and NULL rules using the metadata query.",
            "Close and reopen psql and prove that the table definition remains."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Creating a New Table",
                "url": "https://www.postgresql.org/docs/17/tutorial-table.html",
                "kind": "reference",
                "purpose": "Explain CREATE TABLE and basic types."
            },
            {
                "title": "PostgreSQL 17 — Constraints",
                "url": "https://www.postgresql.org/docs/17/ddl-constraints.html",
                "kind": "reference",
                "purpose": "Learn what primary key, NOT NULL and CHECK enforce."
            }
        ],
        "practiceObjective": "Create and inspect a durable books table.",
        "practiceInstructions": [
            "Verify the selected database and library schema.",
            "Run CREATE TABLE once and inspect the four columns.",
            "Leave and reopen psql to prove the table remains.",
            "Explain each column and constraint in your own words."
        ],
        "knowledgeCheck": "What did CREATE TABLE change? Why does a table exist before rows? Is an empty string NULL? Where does library.books live, and what persists after \\q?",
        "readingTitle": "Understand and create a table",
        "practiceTitle": "Create a books table",
        "checkTitle": "Check table definitions",
        "practiceScenario": "Create a generic library catalogue, not a Steward object.",
        "practiceDeliverables": [
            "Table DDL and catalog inspection",
            "Annotated table hierarchy",
            "Reconnection evidence"
        ],
        "practiceCompletionCriteria": [
            "The table exists in tsa_library.library.",
            "The learner can explain every column's type and constraints.",
            "The table remains after reconnecting."
        ]
    },
    {
        "id": "postgresql-work-with-rows",
        "title": "Insert and Read Table Rows",
        "introduction": "Your library.books table exists, but it is empty. We will add two records and then read them back. This lesson separates defining a table from changing its contents, explains SELECT and WHERE with concrete results, and shows how a database constraint prevents an invalid row. UPDATE and DELETE receive their full treatment in the later SQL CRUD lesson.",
        "outcomes": [
            "Insert records using a column list and VALUES.",
            "Understand SELECT projection, FROM and WHERE.",
            "Use ORDER BY rather than assuming a natural row order.",
            "Demonstrate a rejected row and verify the previously stored rows remain."
        ],
        "sections": [
            {
                "id": "empty-table",
                "title": "A table definition is not a record",
                "body": "In the previous lesson CREATE TABLE specified column names and rules. Think of that as defining a form with four fields. There may be no completed forms yet. You need INSERT to add rows. SQL commands can affect different kinds of state: CREATE TABLE changes the structure, INSERT adds records, SELECT returns a result without inserting new data.\n\nCheck your connection with SELECT current_database(); and confirm it says tsa_library. Then \\d library.books should show the table's definition. If the table is not found, check the schema or selected database before trying to insert. We will use the exact same books table throughout this lesson so that every result can be explained rather than guessed."
            },
            {
                "id": "insert-two",
                "title": "Insert two books",
                "body": "INSERT INTO library.books names the target table. The column list names title, author and published_year in the same order as the values for each record. String values use single quotes. The years are integer values. We omit book_id because the identity rule asks PostgreSQL to generate it. The comma between value groups separates two rows; the semicolon ends the statement.\n\nFor a fresh empty table, PostgreSQL reports INSERT 0 2. That means two rows were added. The same INSERT run again would insert two more books because we did not declare title+author UNIQUE. Constraints only enforce the rules you wrote, not the rules you intended. Do this once, then inspect before continuing.",
                "caption": "SQL — insert two example books",
                "language": "sql",
                "code": "INSERT INTO library.books (title, author, published_year)\nVALUES\n  ('The Hobbit', 'J. R. R. Tolkien', 1937),\n  ('Things Fall Apart', 'Chinua Achebe', 1958);",
                "output": "INSERT 0 2"
            },
            {
                "id": "read-two",
                "title": "Read the records using SELECT",
                "body": "SELECT tells PostgreSQL which columns you want; FROM names the table where the server should look. ORDER BY tells it what sequence to return rows in. Without ORDER BY, SQL does not guarantee a particular order, even when you inserted one book before another. The example asks for all four columns in ascending book_id order.\n\nOn a fresh table the IDs will usually be 1 and 2. Identity sequences can contain gaps, so do not use the exact ID values as proof that the book content is correct. Instead compare titles, authors, years and the count of rows. SELECT reads the stored rows; it does not take ownership of them or erase them when psql exits.",
                "caption": "SQL — read persistent rows",
                "language": "sql",
                "code": "SELECT book_id, title, author, published_year\nFROM library.books\nORDER BY book_id;",
                "output": "1|The Hobbit|J. R. R. Tolkien|1937\n2|Things Fall Apart|Chinua Achebe|1958"
            },
            {
                "id": "filter-year",
                "title": "Find books published after 1950",
                "body": "A database becomes useful when it can answer a question rather than print everything. WHERE limits the rows considered part of the answer. Our predicate published_year >= 1950 includes a book with year 1950 and any later year. The Hobbit (1937) does not meet it; Things Fall Apart (1958) does.\n\nThe SELECT list returns only title and year. ORDER BY makes the result ordering deliberate. Change the cutoff to 2000 and predict zero rows before running it. Zero result rows do not mean the table is missing: the query ran successfully and found no matches. Later lessons cover combining conditions, NULL and joining separate tables.",
                "caption": "SQL — filter books by publication year",
                "language": "sql",
                "code": "SELECT title, published_year\nFROM library.books\nWHERE published_year >= 1950\nORDER BY published_year, title;",
                "output": "Things Fall Apart|1958"
            },
            {
                "id": "not-null-failure",
                "title": "Watch a constraint reject invalid data",
                "body": "The table's title column is NOT NULL. NULL means no value, and PostgreSQL must reject a row without a title even if the author's name and year are otherwise valid. Run the invalid INSERT shown below deliberately. You should see an error explaining the not-null constraint. Then run a separate SELECT count(*) FROM library.books; to verify that the two valid books remain and no invalid third book was inserted.\n\nIf you run scripts with ON_ERROR_STOP=1, the psql process stops at the SQL error; use another command for the verification count. If you are typing interactively, issue SELECT separately after seeing the error. The fact that a row was rejected is not the same as a server outage. The SQL engine was reached and enforced a table rule.",
                "caption": "Expected failure — invalid title should not add a row",
                "language": "sql",
                "code": "INSERT INTO library.books (title, author, published_year)\nVALUES (NULL, 'Nobody', 2000);\n-- Expected error: NOT NULL constraint rejected title\nSELECT count(*) FROM library.books;",
                "output": "ERROR: null value in column \"title\" of relation \"books\" violates not-null constraint\n2"
            },
            {
                "id": "names-and-results",
                "title": "Differentiate missing tables from empty results",
                "body": "If SELECT * FROM books; reports relation \"books\" does not exist, check whether library is in the search_path. Your table is qualified as library.books. Using that full name is the easiest beginner approach. If SELECT * FROM library.books; returns zero rows, the table exists but currently holds no matching records. If you see permission denied, the object may exist but your role cannot access it.\n\nDifferent outcomes require different fixes. Missing database: check -d and the server. Missing schema: inspect \\dn. Missing table: inspect \\dt library.*. Empty result: inspect your WHERE condition. Invalid value: read the constraint error. This diagnostic order avoids rerunning CREATE TABLE or losing data simply because a SELECT did not show the expected books."
            },
            {
                "id": "persisted-rows",
                "title": "Reopen psql and read the same books",
                "body": "Exit using \\q, reconnect to tsa_library and run SELECT title FROM library.books ORDER BY title. The two rows should still be present. They belong to a persistent table managed by PostgreSQL, not a temporary list inside the psql process. By now you should be able to trace the complete operation: psql sends INSERT over a connection, the server validates it and stores rows, and a later independent client retrieves them.\n\nFor independent practice, invent a course catalogue with one row per course. State its columns and types, choose a required column, and write a SELECT that answers a useful question without copying book names. The next lesson will show what *temporary* tables do differently; later, relational modeling and SQL CRUD deepen table relationships and safe updates."
            }
        ],
        "warning": "Outputs assume a fresh two-book table; do not delete an existing table to reproduce exact sequence numbers.",
        "assignment": [
            "Insert two sample books once and confirm INSERT 0 2.",
            "Run the ordered SELECT, explain every result column and why ORDER BY appears.",
            "Run a WHERE-filtered query after predicting which book should match.",
            "Provoke the NOT NULL failure and separately check the row count.",
            "Reconnect and prove the two rows remain."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Populating a Table",
                "url": "https://www.postgresql.org/docs/17/tutorial-populate.html",
                "kind": "reference",
                "purpose": "Review INSERT with a column list."
            },
            {
                "title": "PostgreSQL 17 — Querying a Table",
                "url": "https://www.postgresql.org/docs/17/tutorial-sql.html",
                "kind": "reference",
                "purpose": "Review SELECT, WHERE and ORDER BY."
            }
        ],
        "practiceObjective": "Populate and query a real PostgreSQL table, including an error and reconnect.",
        "practiceInstructions": [
            "Run the published two-row INSERT and ordered SELECT in tsa_library.",
            "Predict and run the WHERE predicate with 1950 and 2000 cutoffs.",
            "Attempt a NULL title, record the server's error, and verify count separately.",
            "Close psql and show records remain on a new connection."
        ],
        "knowledgeCheck": "What does INSERT 0 2 mean? Does SELECT change storage? Why is ORDER BY necessary? How is an empty result different from a missing table? What happened to an invalid NULL-title row?",
        "readingTitle": "Insert records and query them",
        "practiceTitle": "Add and inspect book rows",
        "checkTitle": "Check SQL query results",
        "practiceScenario": "Learn CRUD basics using a generic library table.",
        "practiceDeliverables": [
            "Two-row insert and query outputs",
            "WHERE-filter experiment",
            "Failed INSERT and unchanged count"
        ],
        "practiceCompletionCriteria": [
            "The learner explains SQL behavior without treating psql as the server.",
            "The invalid row is rejected and existing rows remain.",
            "A fresh session sees the committed books."
        ]
    },
    {
        "id": "postgresql-temporary-tables",
        "title": "Temporary Tables and Session Lifetime",
        "introduction": "You have already seen that library.books survives after psql exits. A temporary table follows a different rule: it exists only for one client session. We will isolate that behavior without introducing BEGIN, COMMIT or ROLLBACK, which belong in the later transactions lessons.",
        "outcomes": [
            "Distinguish a permanent table from a PostgreSQL temporary table.",
            "Run a SQL file in one psql process and verify its expected output.",
            "Demonstrate that a temporary table is absent in a different session.",
            "Recognize a missing-relation error after disconnect as expected behavior, not lost persistent data."
        ],
        "sections": [
            {
                "id": "temporary-meaning",
                "title": "Why do temporary tables exist?",
                "body": "A session begins when a client connects to PostgreSQL and ends when the connection closes. A normal table belongs to the database and persists across sessions. A temporary table belongs to its creating session. Other sessions cannot read it and PostgreSQL removes it when its session ends.\n\nA temporary table is still a real PostgreSQL table: the server executes SQL, checks its column rules and stores intermediate rows. TEMP changes scope and lifetime, not the meaning of a row. Temporary data may be useful for one report or calculation; it cannot replace the permanent library catalogue."
            },
            {
                "id": "sql-file",
                "title": "Run more than one SQL statement from a file",
                "body": "Save the SQL below as first_session.sql. Run all four statements in ONE process, so the temporary table still exists when you select its rows. For a Docker lab use `docker exec -i tsa-pg-lesson psql -X -U tsa_learner -d tsa_library -v ON_ERROR_STOP=1 < first_session.sql`. From a configured host psql client use `psql -X -v ON_ERROR_STOP=1 -d tsa_library -f first_session.sql`. Both examples connect to tsa_library, where library.books already exists.\n\nThe first query returns the two book titles and the second reports a count of two. The psql process then exits and closes that session. We deliberately do not include transactions or a rollback here: the question is whether the table survives reconnecting, not how to undo changes.",
                "language": "sql",
                "caption": "first_session.sql — run only in a disposable PostgreSQL lab database",
                "code": "CREATE TEMP TABLE tsa_session_probe (\n  id integer PRIMARY KEY,\n  book_title text NOT NULL\n);\nINSERT INTO tsa_session_probe (id, book_title)\nVALUES (1, 'The Hobbit'), (2, 'Beloved');\nSELECT id, book_title FROM tsa_session_probe ORDER BY id;\nSELECT count(*) AS remaining FROM tsa_session_probe;",
                "output": "CREATE TABLE\nINSERT 0 2\n id | book_title\n----+------------\n  1 | The Hobbit\n  2 | Beloved\n(2 rows)\n remaining\n-----------\n         2\n(1 row)"
            },
            {
                "id": "new-session",
                "title": "Open a new session and check what remains",
                "body": "Use a NEW psql process connected to the SAME tsa_library database and run `SELECT * FROM tsa_session_probe;`. PostgreSQL should say relation \"tsa_session_probe\" does not exist. The first process did create the temporary table; the table disappeared because its session ended. A second client cannot see another live session's TEMP table either.\n\nNow run `SELECT count(*) FROM library.books;` in that same second session. It should still report 2 if you inserted the earlier example books. This is the controlled comparison: the database is the same, but one table was temporary and the other persistent. If you kept the first psql session open, its temporary table would still be there; closing a browser tab is not the definition of session end."
            },
            {
                "id": "failure-to-learn",
                "title": "Investigate unexpected temporary-table behavior",
                "body": "If the script fails before returning its two rows, the test has not established a working temporary table. Inspect the connection, role, database and SQL error first. If the new client finds a table named tsa_session_probe, check whether you accidentally reused the original session or created a persistent table with the same name. Do not drop an unknown relation as a debugging shortcut.\n\nKeep the exact command, session boundaries and observed outputs in your evidence. Later transaction lessons will explain BEGIN, COMMIT, ROLLBACK and isolation on their own terms."
            }
        ],
        "warning": "Use an isolated learning server and invented data. Do not modify production or shared databases, publish real credentials, or drop existing objects merely to repeat an exercise.",
        "assignment": [
            "Create and run first_session.sql in one connection to tsa_library.",
            "Open a new psql connection to tsa_library and capture the missing TEMP table error.",
            "Show library.books remains readable in the same new session.",
            "Explain the difference between client process, session and persistent table."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Getting Started",
                "url": "https://www.postgresql.org/docs/17/tutorial.html",
                "kind": "reference",
                "purpose": "Follow the official sequence from architecture to databases, SQL tables and records."
            },
            {
                "title": "PostgreSQL 17 — psql",
                "url": "https://www.postgresql.org/docs/17/app-psql.html",
                "kind": "reference",
                "purpose": "Understand connection flags, prompts, backslash commands and scripts."
            },
            {
                "title": "PostgreSQL 17 — CREATE TABLE (TEMP)",
                "url": "https://www.postgresql.org/docs/17/sql-createtable.html",
                "kind": "reference",
                "purpose": "Precise lifetime and visibility of temporary tables."
            }
        ],
        "practiceObjective": "Compare temporary-table and permanent-table lifetimes using two independent PostgreSQL connections.",
        "practiceInstructions": [
            "Use the same tsa_library database in both sessions.",
            "Run the four-statement SQL file and capture both reads.",
            "Reconnect and attempt to select tsa_session_probe; record the expected error.",
            "Confirm that library.books still exists; describe why this is not contradictory."
        ],
        "knowledgeCheck": "Why does a temporary table disappear when a session ends but a permanent table does not? Can a different simultaneously connected client see your TEMP table? What evidence distinguishes expected session cleanup from a failed CREATE TABLE?",
        "readingTitle": "Understand temporary tables",
        "practiceTitle": "Run and inspect a session-only table",
        "checkTitle": "Check temporary table lifetime",
        "practiceScenario": "Use a fresh database connection to show how a temporary SQL table differs from the persistent library catalogue.",
        "practiceDeliverables": [
            "Published commands or SQL with observed results",
            "One documented failure or alternative with cause",
            "Short explanation of which PostgreSQL layer acted"
        ],
        "practiceCompletionCriteria": [
            "Another learner can reproduce the described sequence or explain the diagram from the submitted evidence.",
            "Every concept in the exercise was introduced in a preceding reading section.",
            "The explanation distinguishes the database server, selected database and client session where applicable."
        ]
    },
    {
        "id": "relational-model",
        "title": "How Tables Relate: Keys and Relationships",
        "introduction": "You can already create a table of books. Why do databases often need several tables? A library also tracks authors, borrowers and loans. Storing all those facts in one giant table repeats information and creates contradictions when something changes. The relational model gives us a disciplined way to represent independent facts and connect them by values. Learn the ideas using ordinary library records before applying them to a Steward schema in the next practical.",
        "outcomes": [
            "Explain the relation/row/column model separately from a rendered spreadsheet.",
            "Distinguish stable identifiers, primary keys, foreign keys and displayed attributes.",
            "Draw one-to-many and many-to-many relationships from requirements.",
            "Demonstrate a rejected reference and a data-duplication anomaly."
        ],
        "sections": [
            {
                "id": "what-a-relation-means",
                "title": "Tables hold facts about one kind of thing",
                "body": "A table is a practical SQL representation of a relation: a collection of rows with the same attributes. In a library, one table describes Authors, another describes Books, and a third could record Loans. Every book row answers a question about one book; it should not also be the authoritative home for a borrower's address. Table columns have types and constraints, but the important design question comes first: what fact does each row represent? If you cannot answer that in one sentence, your table may be combining unrelated things. Relational theory treats relations as unordered sets of tuples; SQL tables may contain duplicate rows unless constrained, so the idealized mathematical model and physical SQL behavior are related but not identical."
            },
            {
                "id": "why-identifiers",
                "title": "Why do rows need identifiers?",
                "body": "Imagine two authors both named Maria Silva. Their names look alike but they are not necessarily the same person. A stable author_id can identify each independently of the name displayed to users. A primary key uniquely and non-nullably identifies a row; if you later rename an author, the author_id stays unchanged. An ISBN might be a useful book identifier in a different design, but editions and copies have their own identities, so do not choose a key without defining what a row means. Choosing an integer identity column is a convenient lab decision, not a universal rule."
            },
            {
                "id": "link-by-key",
                "title": "How does one book point to its author?",
                "body": "Suppose Author 10 wrote three books. Rather than repeat the author's phone and address in every Book row, each Book can store author_id = 10. That column references the identifier of one author row. A foreign key tells PostgreSQL that referenced authors must exist. This is a one-to-many relationship: one author may be referenced by many books; each book in this simplified model refers to one author. The relationship exists because the referenced values match, not because two tables are placed next to each other in a diagram. A real book can have multiple authors; we will model that as a separate relationship below."
            },
            {
                "id": "try-two-tables",
                "title": "Create two related tables without changing your catalogue",
                "body": "Open psql connected to tsa_library. These are deliberately temporary example tables named author_example and book_example, so they cannot overwrite your existing permanent library.books table. Enter the full block in one psql session: both tables must remain visible while the inserts and SELECT run. GENERATED ALWAYS AS IDENTITY creates author identifiers; book_example.author_id must match an existing author_example.id. The final SELECT shows which author each book points to. Close psql to remove these example tables only.",
                "language": "sql",
                "caption": "relational_author_books.sql — two related temporary tables",
                "code": "CREATE TEMP TABLE author_example (\n  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL\n);\nCREATE TEMP TABLE book_example (\n  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title text NOT NULL,\n  author_id integer NOT NULL REFERENCES author_example(id)\n);\nINSERT INTO author_example (name) VALUES ('Chinua Achebe'), ('Toni Morrison');\nINSERT INTO book_example (title, author_id)\nVALUES ('Things Fall Apart', 1), ('Beloved', 2), ('Home', 2);\nSELECT id, title, author_id FROM book_example ORDER BY id;",
                "output": "CREATE TABLE\nCREATE TABLE\nINSERT 0 2\nINSERT 0 3\n id |       title       | author_id\n----+-------------------+----------\n  1 | Things Fall Apart |        1\n  2 | Beloved           |        2\n  3 | Home              |        2\n(3 rows)"
            },
            {
                "id": "negative-reference",
                "title": "What happens when a book points to an unknown author?",
                "body": "Before exiting the same psql session, try INSERT INTO book_example (title, author_id) VALUES ('Lost Book', 999); PostgreSQL should reject it because there is no author with id 999. This is referential integrity: the database enforces that a Book refers to a real Author, regardless of whether the write came from a terminal, a webpage or a backend service. Immediately SELECT count(*) FROM book_example; and verify that the earlier three rows remain. If you run the negative case in a fresh session and get 'relation does not exist', you have tested TEMP lifetime instead of foreign-key validation. This difference is part of the exercise."
            },
            {
                "id": "many-to-many",
                "title": "How do you represent many-to-many relationships?",
                "body": "The one-author-per-book example simplified reality: a book may have several authors and an author may write several books. Writing comma-separated IDs such as '10,12' inside Book.author_id would destroy the ability to enforce one foreign-key reference per author. Instead, create a BookAuthor linking table with book_id and author_id, one row per association. The pair can be a composite primary key so the same authorship is not recorded twice. The same idea applies to borrowers and borrowed books, students and courses, and services and dependencies. Start by writing the two one-to-many relationships that make up the many-to-many link."
            },
            {
                "id": "duplication-problem",
                "title": "Why not copy the author's name into every book row?",
                "body": "Suppose the table stores author_name alongside each book and the author's name is corrected. A librarian updates one book but misses two others. The same author now has contradictory names. This is an update anomaly caused by duplicated authoritative data. Separate Author from Book to keep one authoritative record and reference its identifier. That does not mean every duplicated value is always wrong: caching and reporting tables can duplicate data deliberately, but they need defined ownership and synchronization rules. The later normalization lesson will revisit those trade-offs in more detail."
            },
            {
                "id": "what-is-next",
                "title": "From an example to a real schema",
                "body": "A diagram of Authors, Books and BookAuthor is a model; a working SQL database adds concrete constraints, privileges, types and rows. The next lesson is an explicit Steward application lab that builds one repeatable dataset for subsequent SQL exercises. That is where we apply the concepts to Team, Service and Environment, without turning the introductory explanation of relationships into proprietary application jargon."
            }
        ],
        "warning": "The author/book fixture is a simplified teaching model and uses TEMP tables; it is not a persistent production library schema. Do not claim a foreign-key test succeeded if you opened a new session and the table was gone.",
        "assignment": [
            "In one session create the two temporary tables and insert the sample rows; explain each foreign key value.",
            "Cause the invalid author_id 999 insert and capture the server's foreign-key error; verify three valid books remain.",
            "Draw Author → Book as one-to-many and Book ↔ Author as many-to-many through BookAuthor.",
            "Explain how changing one author's name would go wrong in a table that duplicated the name in every book row.",
            "For another domain, invent two tables that should be connected by a foreign key; identify the source of truth."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Foreign Keys",
                "url": "https://www.postgresql.org/docs/17/tutorial-fk.html",
                "kind": "reference",
                "purpose": "Confirm how referenced keys enforce valid relationships."
            },
            {
                "title": "PostgreSQL 17 — Constraints",
                "url": "https://www.postgresql.org/docs/17/ddl-constraints.html",
                "kind": "reference",
                "purpose": "Compare primary key, foreign key and uniqueness rules."
            },
            {
                "title": "CMU 15-445 — Relational Model",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "course",
                "purpose": "Optional deeper treatment of relations, keys and algebra."
            }
        ],
        "practiceObjective": "Apply relational keys, cardinalities and reference integrity to the Steward domain after learning them with books.",
        "practiceInstructions": [
            "Draw Team/Service/Environment relationships separately from the library example.",
            "Identify stable identities, authoritative facts and foreign-key references.",
            "Demonstrate a foreign-key violation against the disposable temporary library example first.",
            "Propose a directed ServiceDependency linking table and explain how a composite uniqueness rule prevents duplicate edges."
        ],
        "knowledgeCheck": "A library copies the author name into every book row. What goes wrong when the name changes? How would a foreign key help? Sketch a many-to-many authorship table and explain what its two references mean."
    },
    {
        "id": "postgresql-first-joins",
        "title": "Combine Tables with JOIN",
        "introduction": "Your Author and Book tables are linked by author_id. How do you answer a question that needs data from both tables? JOIN is the SQL operation for combining matching rows. We first teach the mechanism using three writers and three books, including a writer with no books, rather than showing an unexplained query from the Steward application.",
        "outcomes": [
            "Explain why two tables may be needed to answer one question.",
            "Use INNER JOIN and ON to match author identifiers correctly.",
            "Use LEFT JOIN to retain a writer with no matching books.",
            "Predict the row-count consequences of CROSS JOIN and missing match conditions."
        ],
        "sections": [
            {
                "id": "why-join",
                "title": "Why are two tables involved?",
                "body": "The Writer table owns each person's name. The Book table records titles and the identifier of their writer. A foreign key ensures references exist, but it does not automatically print the writer name beside the book. A JOIN lets a query match rows from two table sources using a stated condition. The query returns a result made from selected columns; it does not merge the physical tables or copy all writer details into Book."
            },
            {
                "id": "start-small",
                "title": "Create three writers and three books",
                "body": "Connect to tsa_library and enter the entire SQL block below in one psql session. It creates TEMP tables so the exercise cannot alter your persistent library.books catalogue. Writer 3 (Fátima) has no books, making unmatched rows visible. The sample data is deliberately tiny: you should be able to predict every result by hand before executing a query.",
                "language": "sql",
                "caption": "join_first_setup.sql — temporary writers and books",
                "code": "CREATE TEMP TABLE join_writer (\n  id integer PRIMARY KEY,\n  name text NOT NULL\n);\nCREATE TEMP TABLE join_book (\n  id integer PRIMARY KEY,\n  title text NOT NULL,\n  writer_id integer NOT NULL REFERENCES join_writer(id)\n);\nINSERT INTO join_writer VALUES\n  (1, 'Ana'), (2, 'Rui'), (3, 'Fatima');\nINSERT INTO join_book VALUES\n  (10, 'Ocean', 1), (11, 'Hill', 1), (12, 'Sky', 2);\nSELECT id, name FROM join_writer ORDER BY id;\nSELECT id, title, writer_id FROM join_book ORDER BY id;",
                "output": "CREATE TABLE\nCREATE TABLE\nINSERT 0 3\nINSERT 0 3\n1|Ana\n2|Rui\n3|Fatima\n10|Ocean|1\n11|Hill|1\n12|Sky|2"
            },
            {
                "id": "inner",
                "title": "How INNER JOIN matches records",
                "body": "FROM join_book b gives the Book table the short name b. INNER JOIN join_writer w asks to match each book to a writer; ON b.writer_id = w.id states the matching rule. For book Ocean, writer_id 1 matches Ana's id 1. Hill also matches Ana, and Sky matches Rui. Fátima has no matching book, so she does not appear when starting from books. Read the ON clause as 'pair rows when this condition is true'. The SELECT lists columns for the result, and ORDER BY makes its display reproducible.",
                "language": "sql",
                "caption": "join_first_inner.sql — three matched books",
                "code": "SELECT b.title, w.name\nFROM join_book AS b\nINNER JOIN join_writer AS w ON b.writer_id = w.id\nORDER BY b.id;",
                "output": "Ocean|Ana\nHill|Ana\nSky|Rui"
            },
            {
                "id": "left",
                "title": "How LEFT JOIN keeps unmatched rows",
                "body": "Now begin with join_writer on the left. A LEFT JOIN includes every writer even if no book matches. The missing book columns for Fátima appear as NULL: that is how SQL represents an absent match, not an empty book title. Every matching book still produces its own row, so Ana appears twice. A LEFT JOIN is not automatically 'safer' than an INNER JOIN; choose based on whether unmatched left-side records belong in the answer.",
                "language": "sql",
                "caption": "join_first_left.sql — retain the writer with no book",
                "code": "SELECT w.name, b.title\nFROM join_writer AS w\nLEFT JOIN join_book AS b ON b.writer_id = w.id\nORDER BY w.id, b.id;",
                "output": "Ana|Ocean\nAna|Hill\nRui|Sky\nFatima|"
            },
            {
                "id": "cross",
                "title": "What happens when you forget how to match?",
                "body": "CROSS JOIN deliberately pairs every row on the left with every row on the right. With three writers and three books, it produces 3 × 3 = 9 combinations, including nonsense such as Sky paired with Ana. It is useful when all combinations are genuinely required, but it is a logical mistake when you meant to match writer_id. Count the rows before executing the query, then compare the outcome. The following query shows why the later seed script's CROSS JOIN must apply a WHERE condition to select the intended specific pair.",
                "language": "sql",
                "caption": "join_first_cross.sql — count the unwanted combinations",
                "code": "SELECT count(*) AS combinations\nFROM join_writer CROSS JOIN join_book;",
                "output": "9"
            },
            {
                "id": "bad-on",
                "title": "A correct syntax can still answer the wrong question",
                "body": "If someone removes ON from a matching query and substitutes CROSS JOIN, PostgreSQL may successfully return nine rows. The absence of an SQL error does not prove the result is correct. For a debugging routine, first ask what each result row represents, then count each input, specify the exact matching keys, and inspect rows that have no match. In later lessons you will learn ON versus WHERE placement for outer joins; do not use a filter that silently removes the very unmatched records you intended to preserve."
            }
        ],
        "warning": "Run the setup and example queries in the same psql session. TEMP tables disappear when that session closes. Never treat a successful but incorrect Cartesian product as a verified relationship query.",
        "assignment": [
            "Predict the 3-row INNER JOIN result and 4-row LEFT JOIN result before executing the queries.",
            "Run the setup and both JOIN queries in the same session; explain why Ana occurs twice and Fatima occurs only in one result.",
            "Run the CROSS JOIN count. Explain exactly where its nine combinations came from.",
            "Invent a new question requiring unmatched rows and choose INNER or LEFT with a reason."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Joins Between Tables",
                "url": "https://www.postgresql.org/docs/17/tutorial-join.html",
                "kind": "reference",
                "purpose": "Understand matched rows and unmatched preservation."
            },
            {
                "title": "PostgreSQL 17 — Table Expressions",
                "url": "https://www.postgresql.org/docs/17/queries-table-expressions.html",
                "kind": "reference",
                "purpose": "Precise FROM/JOIN/ON semantics and Cartesian products."
            }
        ],
        "practiceObjective": "Prove how two independent relational tables produce a matched query result.",
        "practiceInstructions": [
            "Run the generic writer/book setup first, in one connected psql session.",
            "Predict and run INNER JOIN, LEFT JOIN and CROSS JOIN; capture results and reconcile cardinality.",
            "Rewrite the matching condition with aliases of your choice and explain why every output row is present.",
            "Only after the generic mechanism works, sketch a Steward Team/Service join for the later applied dataset."
        ],
        "knowledgeCheck": "Three writers have 2, 1 and 0 books. How many rows appear in an INNER JOIN from Books to Writer, a LEFT JOIN from Writer to Books and a CROSS JOIN? Why does the result contain NULL in the LEFT JOIN?",
        "readingTitle": "Learn how JOIN matches rows",
        "practiceTitle": "Match books to writers",
        "checkTitle": "Check matched and unmatched rows",
        "practiceScenario": "A library query needs both writer names and book titles. Use a three-writer fixture before applying joins to Steward.",
        "practiceDeliverables": [
            "Three query results from one connected psql session",
            "Manual row-count prediction and explanation",
            "One intentional wrong-match example"
        ],
        "practiceCompletionCriteria": [
            "All three query results match predicted row sets.",
            "The learner can explain ON and why CROSS JOIN produces nine rows.",
            "No Steward schema is needed for the main lab."
        ]
    },
    {
        "id": "postgresql-first-grouping",
        "title": "Count Rows and Summarize Groups",
        "introduction": "Once a query can match books with writers, the next question is 'how many books does each writer have?' SQL aggregate functions turn multiple rows into summaries. We will compare COUNT(*) with COUNT(column) and see why a writer with zero books can accidentally be reported as having one.",
        "outcomes": [
            "Use COUNT(*) to count rows and GROUP BY to summarize categories.",
            "Explain why SELECT includes grouped columns and aggregates.",
            "Distinguish COUNT(*) from COUNT(non_null_column) after a LEFT JOIN.",
            "Predict an incorrect count before seeing its output."
        ],
        "sections": [
            {
                "id": "count",
                "title": "What does COUNT actually count?",
                "body": "COUNT(*) counts input rows in the current query result. If there are three book rows, COUNT(*) returns 3. COUNT(column_name) counts only rows whose value in that expression is not NULL. This difference matters later: after a LEFT JOIN, an unmatched writer still generates a result row whose book columns are NULL. Counting that row with COUNT(*) can incorrectly turn zero books into one book. Aggregates answer questions about a collection of rows, not just one row at a time."
            },
            {
                "id": "groups",
                "title": "Why do we need GROUP BY?",
                "body": "A plain SELECT returns one result row for each matching input row. GROUP BY divides the input rows into groups based on one or more expressions; an aggregate such as COUNT then produces one summary per group. For example, grouping books by writer_id makes one group for Ana's two books and one for Rui's one book. Writers with no books do not appear if you begin with the Book table alone. We need LEFT JOIN to include them."
            },
            {
                "id": "setup",
                "title": "Set up three authors again",
                "body": "This lab is self-contained. The temporary tables from the previous JOIN lesson no longer exist after you disconnected, so recreate the fixture below in your current session. The same three writers and three books make the observed differences visible. All following queries must run before this session ends.",
                "language": "sql",
                "caption": "group_first_setup.sql — three writers, three books",
                "code": "CREATE TEMP TABLE count_writer (\n  id integer PRIMARY KEY,\n  name text NOT NULL\n);\nCREATE TEMP TABLE count_book (\n  id integer PRIMARY KEY,\n  title text NOT NULL,\n  writer_id integer NOT NULL REFERENCES count_writer(id)\n);\nINSERT INTO count_writer VALUES (1, 'Ana'), (2, 'Rui'), (3, 'Fatima');\nINSERT INTO count_book VALUES\n  (10, 'Ocean', 1), (11, 'Hill', 1), (12, 'Sky', 2);",
                "output": "CREATE TABLE\nCREATE TABLE\nINSERT 0 3\nINSERT 0 3"
            },
            {
                "id": "one-group",
                "title": "Count books by writer",
                "body": "This query begins with count_book and groups rows by writer_id. Each group contains only books with the same ID. The order is made explicit by ORDER BY. Predict two rows: writer 1 has two books, writer 2 has one. Writer 3 is absent because count_book contains no reference to that writer. GROUP BY did not create a record for missing input rows.",
                "language": "sql",
                "caption": "group_first_books.sql — count books in each populated group",
                "code": "SELECT writer_id, COUNT(*) AS book_count\nFROM count_book\nGROUP BY writer_id\nORDER BY writer_id;",
                "output": "1|2\n2|1"
            },
            {
                "id": "empty-groups",
                "title": "Include writers who have no books",
                "body": "Start from count_writer and LEFT JOIN count_book to preserve every writer. COUNT(b.id) counts only matched book identifiers. It correctly returns 0 for Fatima because her joined book.id is NULL. COUNT(*) counts every joined result row and returns 1 for her, which is misleading if interpreted as 'books'. Seeing both counts side by side is an evidence check, not a rule to always prefer one COUNT form. Choose the expression that counts the population you mean.",
                "language": "sql",
                "caption": "group_first_left_count.sql — compare correct and wrong counts",
                "code": "SELECT w.name,\n       COUNT(b.id) AS books,\n       COUNT(*) AS joined_rows\nFROM count_writer AS w\nLEFT JOIN count_book AS b ON b.writer_id = w.id\nGROUP BY w.id, w.name\nORDER BY w.id;",
                "output": "Ana|2|2\nRui|1|1\nFatima|0|1"
            },
            {
                "id": "grouping-rule",
                "title": "Why can't you select any column beside COUNT?",
                "body": "When a query groups many book rows into one result, which individual title would belong beside the group's COUNT? There may be more than one, so SELECT expressions generally need to be grouped columns or aggregates of the group's rows. PostgreSQL may accept columns functionally dependent on a grouped primary key, but do not rely on that exception when introducing the model. Later Aggregation and HAVING lessons teach multi-condition group filtering and how joins inflate counts."
            },
            {
                "id": "check-assumptions",
                "title": "Make your prediction before running SQL",
                "body": "Given two authors with four books and a third with none, predict COUNT(*) after a LEFT JOIN and COUNT(book.id) for the author with no books. If they differ, identify the unmatched joined row that caused it. A syntax error can be fixed mechanically; a plausible but wrong count demands a clearer definition of what the query is meant to count."
            }
        ],
        "warning": "Use one session for the temporary fixture and its queries. A correct COUNT function can still count the wrong population; always define the unit being counted.",
        "assignment": [
            "Run the setup and count-by-writer query; explain why only two writer IDs appear.",
            "Run the LEFT JOIN grouping query; explain Fatima's 0 versus 1 counts.",
            "Write a query that reports the total number of books, then count the writers; explain why the totals differ.",
            "Explain why GROUP BY and COUNT are needed before the Steward fixture's verification query."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Aggregate Functions",
                "url": "https://www.postgresql.org/docs/17/tutorial-agg.html",
                "kind": "reference",
                "purpose": "Introduce COUNT, GROUP BY and summary queries."
            },
            {
                "title": "PostgreSQL 17 — Aggregate Expressions",
                "url": "https://www.postgresql.org/docs/17/sql-expressions.html#SYNTAX-AGGREGATES",
                "kind": "reference",
                "purpose": "Explain COUNT(*) vs COUNT(expression)."
            }
        ],
        "practiceObjective": "Explain grouping and prove zero-count behavior with real SQL and predictable rows.",
        "practiceInstructions": [
            "Run the temporary writer/book fixture from the reading in one session.",
            "Predict before executing which writer disappears when grouping from Book alone.",
            "Execute the LEFT JOIN count and show why COUNT(*) miscounts the unmatched writer.",
            "Describe how the later Steward team counts will work without relying on copying the query."
        ],
        "knowledgeCheck": "A LEFT JOIN produces one NULL-filled book row for a writer with no books. Why is COUNT(*) equal to 1 but COUNT(book.id) equal to 0? When do you need GROUP BY?",
        "readingTitle": "Learn COUNT and GROUP BY",
        "practiceTitle": "Count books by writer",
        "checkTitle": "Check correct and misleading counts",
        "practiceScenario": "A library wants each writer's number of books, including writers with zero books.",
        "practiceDeliverables": [
            "Source-derived grouped count outputs",
            "Prediction of zero-book behavior",
            "Explanation of COUNT(*) versus COUNT(column)"
        ],
        "practiceCompletionCriteria": [
            "The learner produces 2, 1 and 0 counts.",
            "The learner explains why a LEFT JOIN still produces a row without a matching book.",
            "The trainee does not equate successful SQL execution with a correct count."
        ]
    },
    {
        "id": "steward-schema-and-seed",
        "title": "Steward Practice: Build a Reusable SQL Dataset",
        "introduction": "You now know the PostgreSQL server and psql, have created databases, schemas and persistent tables, connected tables with JOIN, and counted grouped rows. We can finally apply those ideas to the Steward service registry. This is a guided project setup rather than the place to learn what a server, schema or join is. The SQL file builds one disposable baseline that the following applied exercises will share.",
        "outcomes": [
            "Create Team, Service, Environment and ServiceDependency using declared SQL fields, types and constraints.",
            "Explain the relationship between PostgreSQL's persistent table definitions and the earlier disposable TEMP examples.",
            "Seed related rows by stable business meaning rather than guessing generated numeric IDs.",
            "Prove a missing relationship remains observable and foreign keys reject orphan writes."
        ],
        "sections": [
            {
                "id": "checkpoint",
                "title": "Start with a fresh practice database",
                "body": "Precondition: you have a working connection to a dedicated, empty tsa_steward_lab learning database using the earlier server/client/role instructions. The temporary Author/Book, JOIN and grouping examples were separate sessions and are already gone. This script creates permanent tables; unlike TEMP tables, they survive client disconnect. Do not add IF NOT EXISTS as a way to hide that you are connected to an old or incompatible schema. If CREATE TABLE says the relation already exists, stop, inspect \\dt and your target database, and create a new disposable lab database or explicitly reset under supervision; do not drop arbitrary tables."
            },
            {
                "id": "facts",
                "title": "What information will our tables represent?",
                "body": "Team has its own identity and unique name; Service holds an immutable generated database identity and a Team foreign key. Service's name is unique here as an explicit *teaching assumption*, not a universal fact about all registries. Environment describes one deployed placement of one Service and has a kind limited to development, staging or production. A directed ServiceDependency relates source → target and forbids a self-edge and duplicates. The `active` operational flag is not the same concept as `lifecycle`: a temporarily unavailable production-lifecycle service need not be retired. `criticality` is a declared priority and `retired_at` records a timestamp where one exists. The domain/API interface does not have to expose every SQL column. Generated IDs are not stable seed assumptions; the foreign key lookup follows Team identity."
            },
            {
                "id": "schema",
                "title": "Create the tables and sample records",
                "body": "Save the following exactly as steward_schema_seed.sql in a scratch directory. Connect to the verified empty learning database and run psql -X -v ON_ERROR_STOP=1 -1 -f steward_schema_seed.sql. The -1 flag wraps a file in one transaction: an SQL error stops the script and rolls back the changes, rather than leaving a half-created baseline. The .invalid URLs are deliberate non-routable placeholders for local teaching data; no real endpoints or customer records are involved. Inspect all table names and foreign-key directions before running. Never run this file against production or any database that contains valuable data. The canonical Steward product specification defines lifecycle values development/uat/production/retired. These describe a service lifecycle stage, while Environment.kind describes an actual deployed placement; a production-stage Service should have a production Environment. Payroll API deliberately violates that requirement in the fixture so later JOIN and validation labs can find it. This fixture therefore contains a known business-policy defect for investigation, not a fully compliant production registry. In the dependency inserts, CROSS JOIN forms possible Service pairs and WHERE chooses the particular named source and destination. That operation was introduced with writers/books; explain why an unrestricted Cartesian product would be wrong here.",
                "language": "sql",
                "caption": "steward_schema_seed.sql — complete one-time PostgreSQL teaching fixture",
                "code": "CREATE TABLE team (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE\n);\n\nCREATE TABLE service (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL UNIQUE,\n  owning_team_id bigint NOT NULL REFERENCES team(id),\n  endpoint text NOT NULL,\n  active boolean NOT NULL DEFAULT true,\n  age_days integer NOT NULL DEFAULT 0 CHECK (age_days >= 0),\n  lifecycle text NOT NULL DEFAULT 'development' CHECK (lifecycle IN ('development', 'uat', 'production', 'retired')),\n  criticality text NOT NULL DEFAULT 'medium' CHECK (criticality IN ('low', 'medium', 'high', 'critical')),\n  retired_at timestamptz\n);\n\nCREATE TABLE environment (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  service_id bigint NOT NULL REFERENCES service(id),\n  name text NOT NULL,\n  kind text NOT NULL CHECK (kind IN ('development', 'uat', 'staging', 'production')),\n  UNIQUE (service_id, name)\n);\n\nCREATE TABLE service_dependency (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  source_service_id bigint NOT NULL REFERENCES service(id),\n  target_service_id bigint NOT NULL REFERENCES service(id),\n  UNIQUE (source_service_id, target_service_id),\n  CHECK (source_service_id <> target_service_id)\n);\n\nINSERT INTO team (name) VALUES ('Payments'), ('Platform'), ('Identity');\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Payments API', id, 'https://payments.example.invalid/api', true, 184, 'production', 'high'\nFROM team WHERE name = 'Payments';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Payroll API', id, 'https://payroll.example.invalid/api', true, 55, 'production', 'critical'\nFROM team WHERE name = 'Payments';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Identity API', id, 'https://identity.example.invalid/api', true, 350, 'production', 'critical'\nFROM team WHERE name = 'Identity';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality)\nSELECT 'Catalogue API', id, 'https://catalogue.example.invalid/api', true, 10, 'production', 'medium'\nFROM team WHERE name = 'Platform';\n\nINSERT INTO service (name, owning_team_id, endpoint, active, age_days, lifecycle, criticality, retired_at)\nSELECT 'Legacy Gateway', id, 'https://legacy.example.invalid/api', false, 1600, 'retired', 'low', now()\nFROM team WHERE name = 'Platform';\n\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Primary', 'production' FROM service\nWHERE name IN ('Payments API', 'Identity API', 'Catalogue API');\n\nINSERT INTO environment (service_id, name, kind)\nSELECT id, 'Preprod', 'staging' FROM service WHERE name = 'Payments API';\n\nINSERT INTO service_dependency (source_service_id, target_service_id)\nSELECT src.id, dst.id FROM service src CROSS JOIN service dst\nWHERE src.name = 'Payments API' AND dst.name = 'Identity API';\n\nINSERT INTO service_dependency (source_service_id, target_service_id)\nSELECT src.id, dst.id FROM service src CROSS JOIN service dst\nWHERE src.name = 'Payroll API' AND dst.name = 'Payments API';"
            },
            {
                "id": "verify",
                "title": "Check the results using JOIN and COUNT",
                "body": "Run the verification queries in a new psql session connected to the same practice database. You already know LEFT JOIN and COUNT/GROUP BY from the library examples: predict the number of Services by Team (Identity 1, Payments 2, Platform 2). The LEFT JOIN in the environment query keeps Payroll API despite no Environment, so its kind is NULL; Payments API has two Environments. The final JOIN pairs each dependency edge with the actual names of its source and target. If the result differs, inspect the seed and the join conditions instead of hiding a mismatch with DISTINCT.",
                "language": "sql",
                "caption": "verify_steward_seed.sql — three result shapes the learner can predict",
                "code": "SELECT t.name AS team, COUNT(s.id) AS services\nFROM team t LEFT JOIN service s ON s.owning_team_id = t.id\nGROUP BY t.id, t.name ORDER BY t.name;\n\nSELECT s.name, e.kind\nFROM service s LEFT JOIN environment e ON e.service_id = s.id\nWHERE s.name IN ('Payroll API', 'Payments API')\nORDER BY s.name, e.kind;\n\nSELECT src.name AS service, dst.name AS depends_on\nFROM service_dependency d\nJOIN service src ON src.id = d.source_service_id\nJOIN service dst ON dst.id = d.target_service_id\nORDER BY src.name;",
                "output": "Team counts: Identity | 1; Payments | 2; Platform | 2.\nEnvironment results: Payments API | production; Payments API | staging; Payroll API | NULL.\nDependencies: Payments API → Identity API; Payroll API → Payments API."
            },
            {
                "id": "negative",
                "title": "Watch the database reject invalid records",
                "body": "Attempt a separate INSERT that references owning_team_id = -1 and supplies just name and endpoint; it must fail with a foreign-key violation and leave the Service count unchanged. Then attempt to insert another Service named Payments API and observe the UNIQUE violation. Run these as separate psql -c statements with ON_ERROR_STOP enabled, not as part of your successful baseline file. The exact error wording and generated internal key names depend on PostgreSQL. This proves *these two* constraints respond to these invalid rows; it does not prove that the whole domain model has been fully validated or that transactions solve all races.",
                "language": "sql",
                "caption": "Expected failures — run one at a time only after creating the lab fixture",
                "code": "INSERT INTO service (name, owning_team_id, endpoint)\nVALUES ('Orphan', -1, 'https://orphan.example.invalid');\n\nINSERT INTO service (name, owning_team_id, endpoint)\nSELECT 'Payments API', id, 'https://duplicate.example.invalid'\nFROM team WHERE name = 'Payments';"
            },
            {
                "id": "why-next",
                "title": "Keep a reliable dataset for the remaining exercises",
                "body": "SELECT/UPDATE/DELETE, WHERE/ORDER BY, grouping, JOIN, EXISTS, CTE, indexing and EXPLAIN all need a reproducible data shape. This fixture supplies fields they later query: lifecycle, criticality, retired_at, endpoint, environment.kind and directed dependency keys. Those later lessons must declare any further changes they require. Before a mutation exercise, checkpoint the learning database and select the exact rows to be affected. A clean fixture supports repeatability, but a five-row table cannot establish real-world index-performance improvements; performance experiments must generate suitably sized representative data and measure cautiously."
            }
        ],
        "warning": "The schema and rows created here are permanent within the selected database. Run this script only against a freshly provisioned disposable practice database; never run, reset or drop tables in a production or shared database. The fixture intentionally contains a known policy violation for later diagnosis.",
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
        "knowledgeCheck": "Predict the output after two inserts of the same Service name, and after joining a Service that has no Environment. Explain why a foreign key is a rule, not simply an integer column; why SQL row order needs ORDER BY; and why a five-row EXPLAIN plan cannot establish a performance win.",
        "readingTitle": "Prepare the Steward SQL practice database",
        "practiceTitle": "Seed and inspect the Steward lab",
        "checkTitle": "Check the dataset and integrity rules"
    },
    {
        "id": "sql-crud",
        "title": "Update Existing Rows Safely",
        "introduction": "You already know how to create a table, insert books and read them. UPDATE is a different operation: it changes records that already exist. A command that looks simple can affect zero, one or every row. We will predict the target set, make one small correction and inspect the result before applying the same discipline to a more complex Steward practical.",
        "outcomes": [
            "Explain the roles of UPDATE, SET and WHERE.",
            "Predict which records a predicate matches before changing any data.",
            "Use RETURNING to inspect what PostgreSQL actually changed.",
            "Recognize why a missing WHERE condition can silently modify an entire table."
        ],
        "sections": [
            {
                "id": "update-meaning",
                "title": "What does UPDATE change?",
                "body": "UPDATE modifies values in existing rows. It does not create a new database, table or schema. The name after UPDATE specifies the table to change, the SET clause lists new column values, and WHERE determines which existing rows qualify. PostgreSQL evaluates the predicate against stored rows and updates every row that satisfies it.\n\nUnlike editing a single form on a screen, SQL operations are set-based: one UPDATE statement may match zero, one, ten or thousands of records. PostgreSQL will not infer that you intended exactly one row. In a school database, UPDATE students SET grade = 'A'; with no WHERE could change every student's grade. The SQL would be syntactically valid; the human decision could be disastrous.\n\nOur library example uses a clearly fictional book entry. We will insert it once, then correct the author's placeholder. It is an intentionally disposable learning record, not a correction to a real book's bibliographic information."
            },
            {
                "id": "add-draft",
                "title": "Create one record to correct",
                "body": "In tsa_library, confirm the existing table is library.books. The two earlier real-book examples can remain untouched. Add this third fictional sample book. Its author is a placeholder called Unverified; the next statement will replace that placeholder.\n\nWhy add a separate practice record? It makes the before and after state visible without altering a known real-world fact. If this example has already been run, inspect the rows instead of repeating the INSERT. The identity column generates an ID, and the server reports one inserted row.",
                "caption": "SQL — insert one disposable book for updating",
                "code": "INSERT INTO library.books (title, author, published_year)\nVALUES ('The Blue Compass', 'Unverified', 2001);",
                "language": "sql",
                "output": "INSERT 0 1"
            },
            {
                "id": "preview-before-update",
                "title": "Use SELECT to see which row you will change",
                "body": "The safest beginner habit is to inspect the target rows before modifying them. Run SELECT with the **same WHERE predicate** you intend to use for UPDATE. Here we require both a title and the existing placeholder author. That specificity reduces the risk of modifying unrelated records. It does not guarantee uniqueness unless the table has a constraint; always inspect the number of matches.\n\nIf the preview returns zero rows, your target may not exist, your spelling may differ, or the placeholder may already have been corrected. Do not broaden WHERE to match more records simply to make the command produce output. If it returns multiple rows, investigate why, because a set-based UPDATE will change all matches.",
                "caption": "SQL — preview the exact record before UPDATE",
                "code": "SELECT title, author\nFROM library.books\nWHERE title = 'The Blue Compass'\n  AND author = 'Unverified';",
                "language": "sql",
                "output": "The Blue Compass|Unverified"
            },
            {
                "id": "update-one",
                "title": "Update one matching row and inspect it",
                "body": "Now issue UPDATE with the same WHERE clause. SET author = 'M. Costa' specifies the new value. RETURNING tells PostgreSQL to return selected columns from the rows actually affected. For a fresh lab with exactly one matching record, you should see one returned row, followed by UPDATE 1. If you see UPDATE 0, no row met the predicate. If you see UPDATE 2, two rows were affected, which is a reason to examine the data, not assume the operation was precise.\n\nNotice that UPDATE is not the same as INSERT. PostgreSQL keeps the same book identity and changes one value of the existing row. With the present table design no historical list of old authors is maintained automatically. Audit history, permissions and migration safety are later subjects.",
                "caption": "SQL — update the sample book and return its new value",
                "code": "UPDATE library.books\nSET author = 'M. Costa'\nWHERE title = 'The Blue Compass'\n  AND author = 'Unverified'\nRETURNING title, author;",
                "language": "sql",
                "output": "The Blue Compass|M. Costa"
            },
            {
                "id": "no-where",
                "title": "Why omitting WHERE is dangerous",
                "body": "Consider UPDATE library.books SET author = 'Unknown'; Without a WHERE clause, every row of that table is eligible for modification. We will not execute this destructive statement, because doing so would damage all of the lab's book records. Predict the effect and write a SELECT that would reveal the same target population before running a real change.\n\nWHERE is not magic protection by itself. A predicate that is too broad—such as WHERE published_year >= 1900—can still update many books. Even an exact title may match duplicate entries. Always ask two questions: what rows does this predicate identify, and what row count do I expect? SELECT first, then UPDATE, then inspect RETURNING and a follow-up SELECT.\n\nThis does not imply all updates should be handwritten in production. Applications, ORMs and migrations also generate UPDATE statements, so the same set-based reasoning is important when reviewing code that hides SQL behind an API."
            },
            {
                "id": "verify-update",
                "title": "Confirm the stored result in a new query",
                "body": "A success message is useful but not sufficient evidence that the new state is correct. Query the fictional book once more and compare the stored author with your intention. It should now be M. Costa; the placeholder Unverified no longer matches our earlier predicate. The other two books should still exist. Close psql, reconnect and repeat the SELECT to verify the change was stored in the persistent table.\n\nAn UPDATE may also be rejected for a type violation, NOT NULL rule or other constraint. The server protects declared rules regardless of client. A rollback demonstration belongs in the later dedicated transaction lesson, not in this beginner example.",
                "caption": "SQL — verify the updated book",
                "code": "SELECT title, author\nFROM library.books\nWHERE title = 'The Blue Compass';",
                "language": "sql",
                "output": "The Blue Compass|M. Costa"
            }
        ],
        "warning": "Never run an unbounded UPDATE on real or shared data merely to test syntax. The example assumes one fictional practice row in a disposable lab.",
        "assignment": [
            "Explain the difference between INSERT and UPDATE in terms of rows created or changed.",
            "Insert the fictional book exactly once, then preview it with SELECT.",
            "Run UPDATE with RETURNING and verify UPDATE 1 or investigate a different count.",
            "Predict what would happen if WHERE were omitted, without executing that unsafe statement.",
            "Reconnect and verify the corrected value remains stored."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Updating Rows",
                "url": "https://www.postgresql.org/docs/17/dml-update.html",
                "kind": "reference",
                "purpose": "Study the SET, WHERE and RETURNING clauses."
            }
        ],
        "practiceObjective": "Apply an intentional SQL UPDATE to Steward data with a prior SELECT target preview.",
        "practiceInstructions": [
            "Use the same predicate to preview exactly which Steward record will change.",
            "Explain expected row cardinality and choose a harmless disposable record.",
            "Apply UPDATE ... RETURNING and record before/after evidence.",
            "Explain one way an overly broad WHERE predicate could silently affect multiple records."
        ],
        "knowledgeCheck": "What does UPDATE do that INSERT does not? Can a valid UPDATE change every row? Why should SELECT use the same predicate first? How do UPDATE 0 and UPDATE 3 differ?",
        "readingTitle": "Learn how UPDATE changes records",
        "practiceTitle": "Update one record and prove the target set",
        "checkTitle": "Check UPDATE safety",
        "practiceScenario": "Use a disposable Steward record for the applied mutation exercise; the reading uses independent library examples.",
        "practiceDeliverables": [
            "Target preview SQL and expected number of rows",
            "UPDATE/RETURNING result",
            "Follow-up verification and mistake analysis"
        ],
        "practiceCompletionCriteria": [
            "The selected records are identified before mutation.",
            "The reported affected-row set matches the intended change.",
            "The learner can explain the risk of missing or broad WHERE predicates."
        ]
    },
    {
        "id": "postgresql-delete-rows",
        "title": "Delete Records Without Deleting the Wrong Data",
        "introduction": "UPDATE changes existing rows. DELETE removes them. Deletion deserves a separate lesson because an omitted predicate or an unexpected relationship can destroy much more data than intended. We will remove the fictional practice book created in the previous lesson while preserving the two original books.",
        "outcomes": [
            "Explain what DELETE removes and what it leaves unchanged.",
            "Preview the exact records matching a deletion predicate.",
            "Use DELETE ... RETURNING to verify what was removed.",
            "Predict what DELETE without WHERE would do and avoid using it on real data."
        ],
        "sections": [
            {
                "id": "delete-vs-drop",
                "title": "What is the difference between DELETE and DROP TABLE?",
                "body": "DELETE removes matching rows from a table. The table's definition—columns, types, constraints and schema location—remains. DROP TABLE removes the table object itself and can affect dependent objects; it is a very different administrative operation. The fact that both can make rows disappear does not make them interchangeable.\n\nOur library.books table contains two original sample books and, if you completed the preceding lesson, one fictional book named The Blue Compass. We will delete only the fictional practice record. That keeps the example non-destructive with respect to the historical book rows.\n\nLike UPDATE, DELETE is set-based. It can delete zero, one or many rows. PostgreSQL does not know that you intended to remove exactly one entry unless your predicate and data make that true. That is why the first step is a read-only preview."
            },
            {
                "id": "preview-delete",
                "title": "Preview the rows before DELETE",
                "body": "Use SELECT with the intended deletion predicate: the fictional title and its corrected author M. Costa. On a fresh sequential lab it returns one row. If it returns nothing, check whether you ran the previous lesson or whether the record was already removed. If it returns several rows, do not proceed until you know why multiple records match.\n\nThe SELECT is only a preview; it does not lock or reserve those rows against other writers. We are using a private training database to avoid concurrent modifications. More advanced production deletion safety, transactions and locking will be taught separately. Here the goal is to understand the exact row set that DELETE would remove.",
                "caption": "SQL — preview the record before DELETE",
                "code": "SELECT title, author\nFROM library.books\nWHERE title = 'The Blue Compass'\n  AND author = 'M. Costa';",
                "language": "sql",
                "output": "The Blue Compass|M. Costa"
            },
            {
                "id": "delete-one",
                "title": "Delete the fictional row using RETURNING",
                "body": "The DELETE FROM clause selects the table. The WHERE clause restricts the qualifying rows. RETURNING asks PostgreSQL to show values from the rows removed, so you can verify what actually happened. For exactly one matching row, the returned values identify The Blue Compass and M. Costa, and PostgreSQL reports DELETE 1.\n\nThe two earlier books remain stored in library.books. Their identities and values have not been changed by this targeted statement. If DELETE reports zero affected rows, the record was not found, perhaps because you already ran the exercise. Do not compensate by removing the WHERE condition.",
                "caption": "SQL — delete only the disposable book",
                "code": "DELETE FROM library.books\nWHERE title = 'The Blue Compass'\n  AND author = 'M. Costa'\nRETURNING title, author;",
                "language": "sql",
                "output": "The Blue Compass|M. Costa"
            },
            {
                "id": "confirm-delete",
                "title": "Verify what remains",
                "body": "Run a fresh SELECT on library.books rather than relying only on the DELETE message. You should see The Hobbit and Things Fall Apart, and no fictional book. On the original clean lab the total number of rows is back to two. This is the observable acceptance criterion.\n\nA database may retain deleted data in internal storage until maintenance reclaims space; SQL DELETE means the rows are no longer part of normal query results, not necessarily that every underlying byte has been physically erased immediately. Physical deletion, retention policies and backups have separate operational considerations. Do not treat DELETE as a secure-erasure method.",
                "caption": "SQL — confirm the two original books remain",
                "code": "SELECT title\nFROM library.books\nORDER BY title;",
                "language": "sql",
                "output": "The Hobbit\nThings Fall Apart"
            },
            {
                "id": "never-delete-all",
                "title": "What happens if DELETE has no WHERE?",
                "body": "DELETE FROM library.books; targets every row in the table. We will not run it here. In a private laboratory, clearing all sample data can be intentional; in a shared application it can be catastrophic. A WHERE clause is not enough by itself if it matches the wrong rows, so preview with SELECT, compare against an expected count and inspect RETURNING afterward.\n\nIn a relational schema, foreign-key constraints may prevent deleting a referenced parent row, or an explicit ON DELETE action may propagate the deletion to related tables. We have not defined such relationships on library.books yet. The relationship lesson introduces foreign keys, and a later constraints lesson explains their deletion consequences. Avoid assuming that a deletion always affects only the table named in one visible line.\n\nA production deletion may also require approvals, backups, a transaction and an audit trail. Those controls are meaningful after their mechanisms are taught; they should not be reduced to magic commands in this introductory lesson."
            },
            {
                "id": "deletion-check",
                "title": "Transfer the idea to another dataset",
                "body": "Suppose a school table has records for students in several classes, and you want to remove one duplicated test enrollment. A safe plan starts by identifying what represents one enrollment, previewing the relevant row, understanding which constraints refer to it and recording the expected affected count. It does not start with DELETE WHERE student_name = 'Ana', because several people may share that name.\n\nWrite a SELECT that proves the target is unique, even if you cannot yet execute it. Explain which stable identifier you would prefer and why a displayed name alone might be ambiguous. Then identify the expected outcome of a properly constrained DELETE and the danger of removing WHERE. These ideas apply equally to an ORM delete call and to handwritten SQL."
            }
        ],
        "warning": "DELETE may be irreversible outside a deliberate transaction or backup. Do not execute broad DELETE or DROP TABLE against shared data.",
        "assignment": [
            "Preview the fictional practice book and predict the row count.",
            "Run the targeted DELETE ... RETURNING and capture the affected row.",
            "Verify the two original books remain and reconnect to confirm persistence.",
            "Explain why DELETE FROM library.books without WHERE is dangerous; do not execute it.",
            "Contrast DELETE and DROP TABLE using the database/schema/table hierarchy."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Deleting Rows",
                "url": "https://www.postgresql.org/docs/17/dml-delete.html",
                "kind": "reference",
                "purpose": "Review DELETE, WHERE and RETURNING."
            },
            {
                "title": "PostgreSQL 17 — Foreign Keys",
                "url": "https://www.postgresql.org/docs/17/ddl-constraints.html#DDL-CONSTRAINTS-FK",
                "kind": "reference",
                "purpose": "Preview how dependent rows may affect later deletion rules."
            }
        ],
        "practiceObjective": "Remove one disposable Steward record with a preview and observable deletion proof.",
        "practiceInstructions": [
            "Select the exact disposable record using a sufficiently selective predicate.",
            "Show expected affected count and verify it with DELETE ... RETURNING.",
            "Run a fresh SELECT to show that the target is gone and unrelated rows remain.",
            "Explain one scenario where an unexpected foreign-key relationship would change the safety analysis."
        ],
        "knowledgeCheck": "How is DELETE different from DROP TABLE? What would DELETE FROM library.books with no WHERE do? How can RETURNING help? Why is a name-only predicate often insufficient?",
        "readingTitle": "Understand DELETE and its risks",
        "practiceTitle": "Safely remove one disposable record",
        "checkTitle": "Check DELETE behavior",
        "practiceScenario": "Learn with a fictional library entry, then remove a scoped disposable Steward record in applied practice.",
        "practiceDeliverables": [
            "Read-only preview",
            "Targeted deletion and RETURNING evidence",
            "Verification of surviving records"
        ],
        "practiceCompletionCriteria": [
            "The learner previews and limits the target set.",
            "Only the chosen disposable record is removed.",
            "The difference between deleting rows and dropping a table is correctly explained."
        ]
    },
    {
        "id": "postgresql-combine-conditions",
        "title": "Combine Conditions with WHERE",
        "introduction": "You already know how to select library books using one WHERE condition. Real questions often require several conditions: books after a date AND by a certain author; books by one author OR another; titles beginning with a phrase. Before writing advanced Steward reports, learn what AND, OR, NOT, parentheses, IN and LIKE actually mean using two ordinary library rows whose answers you can predict.",
        "outcomes": [
            "Predict a WHERE result for AND, OR and NOT against known rows.",
            "Explain AND-before-OR precedence and make intent explicit with parentheses.",
            "Use IN to compare one value with a small set.",
            "Understand LIKE and ILIKE patterns, including the meaning of % and _."
        ],
        "sections": [
            {
                "id": "where-tests-each-row",
                "title": "How does WHERE choose which rows to return?",
                "body": "A SELECT query describes the data you want. FROM library.books identifies our existing table; WHERE tests a condition against each candidate row; SELECT names the columns in the result. When a condition is TRUE, that row qualifies. When it is FALSE, the row does not qualify. SQL also has UNKNOWN for conditions involving NULL; we will give that a full lesson next.\n\nAssume our earlier exercises left the two original books in library.books: The Hobbit (1937, J. R. R. Tolkien) and Things Fall Apart (1958, Chinua Achebe). If you have more rows, your outputs may differ; inspect your current table first rather than deleting data to match an example. We will select only those titles to keep our comparison reproducible.\n\nWith WHERE published_year >= 1950, Things Fall Apart qualifies and The Hobbit does not. The comparison is applied per row; the text printed by psql is the result, not an instruction to change the table. Try describing the two TRUE/FALSE decisions before executing any of the examples below."
            },
            {
                "id": "and-or-not",
                "title": "AND, OR and NOT ask different questions",
                "body": "AND requires both conditions to be TRUE. For example, published_year >= 1950 AND author = 'Chinua Achebe' identifies Things Fall Apart. OR requires at least one condition to be TRUE; author = 'Chinua Achebe' OR author = 'J. R. R. Tolkien' matches both records. NOT reverses TRUE and FALSE, so NOT (published_year >= 1950) matches The Hobbit in this dataset.\n\nWrite the conditions in natural language first. \"Published in or after 1950 AND written by Achebe\" is different from \"Published after 1950 OR written by Achebe.\" Only one book happens to match both questions here, but that coincidence does not make the predicates equivalent.\n\nThink of WHERE as a test that gives one decision for each book, not as a loop that runs in your client. PostgreSQL's optimizer may evaluate the query using different physical operations; the SQL expresses the logical result. NULL can change the outcome of NOT, so do not infer that NOT always includes every row rejected by an ordinary comparison.",
                "language": "sql",
                "caption": "where_and_not.sql — two simple predicates",
                "code": "SELECT title FROM library.books\nWHERE published_year >= 1950 AND author = 'Chinua Achebe'\nORDER BY title;\n\nSELECT title FROM library.books\nWHERE NOT (published_year >= 1950)\nORDER BY title;",
                "output": "First query: Things Fall Apart\nSecond query: The Hobbit"
            },
            {
                "id": "parentheses-matter",
                "title": "Why parentheses can change the answer",
                "body": "SQL evaluates AND before OR when you do not supply parentheses. Thus A AND B OR C is understood as (A AND B) OR C. This is a defined operator-precedence rule, not a random implementation detail. A condition at the end of an OR expression may let a row through even when it fails the earlier AND group.\n\nThe first query below asks for books published after 1950 by Achebe, OR books called The Hobbit. That includes both titles. The second query requires publication after 1950 AND either Achebe or the title The Hobbit. Now The Hobbit is excluded because 1937 fails the year test. The SQL is valid in both cases; only one expresses an intended minimum publication-year rule.\n\nUse parentheses whenever you combine AND and OR in a business rule, even where precedence would already give the expected answer. They make the rule easier to review. Before querying, write a two-row prediction table with each book and whether it passes the year condition, author condition and title condition.",
                "language": "sql",
                "caption": "where_parentheses.sql — two different sets of books",
                "code": "SELECT title FROM library.books\nWHERE published_year >= 1950 AND author = 'Chinua Achebe'\n   OR title = 'The Hobbit'\nORDER BY title;\n\nSELECT title FROM library.books\nWHERE published_year >= 1950\n  AND (author = 'Chinua Achebe' OR title = 'The Hobbit')\nORDER BY title;",
                "output": "Without outer parentheses: The Hobbit; Things Fall Apart\nWith intended parentheses: Things Fall Apart"
            },
            {
                "id": "in-membership",
                "title": "Use IN when one value may match several choices",
                "body": "Sometimes you want books by one of several writers. You could repeat author = ... OR author = ... for each author, but IN is clearer. The expression author IN ('Chinua Achebe', 'Nobody') tests whether an author's value equals any value in that set. With our table, it matches Things Fall Apart.\n\nIN does not mean PostgreSQL creates a new table automatically. Here the parentheses are a short literal list; later a subquery can produce such a list from a separate table. NOT IN is more subtle when NULL is present in the candidate set, so its hazards will be covered in the subqueries lesson.\n\nIN is not SQL's general substring search. It tests equality with whole values. The expression title IN ('The') does not match The Hobbit, because the stored title is not exactly The. To search for title patterns, use LIKE or ILIKE instead.",
                "language": "sql",
                "caption": "where_in.sql — match a list of authors",
                "code": "SELECT title FROM library.books\nWHERE author IN ('Chinua Achebe', 'Nobody')\nORDER BY title;",
                "output": "Things Fall Apart"
            },
            {
                "id": "text-patterns",
                "title": "Find matching text with LIKE and ILIKE",
                "body": "LIKE compares a text value with a pattern. The percent sign % matches zero or more characters; underscore _ matches exactly one character. Thus title LIKE 'The%' matches titles beginning with The. PostgreSQL's ILIKE is a case-insensitive variant useful when users may type different capitalization, though exact Unicode and locale behavior requires care for production search.\n\nOur two books both begin with the letters The or Things? Things does not begin with The: the third letter is i, not e. So LIKE 'The%' returns The Hobbit only. If you try ILIKE 'the%', the case difference is ignored and you still get only The Hobbit. By contrast, LIKE '%the%' searches for that sequence anywhere, and you should reason separately about case and punctuation.\n\nA leading wildcard often makes simple B-tree indexes less useful for search; do not turn that observation into a performance guarantee. Full-text search, trigram indexes and collations have distinct lessons later. For now, predict the actual rows with the two sample titles and state exactly what each wildcard means.",
                "language": "sql",
                "caption": "where_like.sql — compare LIKE and ILIKE",
                "code": "SELECT title FROM library.books\nWHERE title LIKE 'The%'\nORDER BY title;\n\nSELECT title FROM library.books\nWHERE title ILIKE 'the%'\nORDER BY title;",
                "output": "LIKE: The Hobbit\nILIKE: The Hobbit"
            },
            {
                "id": "new-question",
                "title": "Try an unfamiliar question before leaving",
                "body": "Suppose a catalogue manager asks: \"Return titles by Tolkien or Achebe that were published before 1950, alphabetically.\" Write it first in ordinary language: choose one of those two authors AND require the year before 1950. Translate the choices with IN and the time condition with AND. You should predict The Hobbit as the only match. Run the query with ORDER BY title and explain why Things Fall Apart is excluded.\n\nNow change the rule to \"written before 1950 OR by Achebe.\" Predict two titles and verify them. If your results disagree, do not randomly add parentheses until something looks right. Evaluate the year and author tests for each row and compare with the rule as spoken.\n\nDo not yet use NULL as though it were just another year. The next lesson will show why neither = NULL nor NOT (...) behaves like ordinary TRUE/FALSE comparisons."
            }
        ],
        "warning": "Do not judge correctness from syntactically valid SQL. Parentheses change selected row sets; NULL requires three-valued logic and receives a separate lesson.",
        "assignment": [
            "Run the AND and NOT examples and explain the selected titles.",
            "Predict both parentheses queries before executing them, and show a two-row truth table for each condition.",
            "Use IN to find a book by one of two authors.",
            "Test LIKE 'The%' and ILIKE 'the%' without confusing prefix matches with substrings.",
            "Write an independent query for books before 1950 by Tolkien or Achebe."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Comparison Functions and Operators",
                "url": "https://www.postgresql.org/docs/17/functions-comparison.html",
                "kind": "reference",
                "purpose": "Reference SQL comparisons, IN and Boolean conditions."
            },
            {
                "title": "PostgreSQL 17 — Pattern Matching",
                "url": "https://www.postgresql.org/docs/17/functions-matching.html",
                "kind": "reference",
                "purpose": "Reference LIKE, ILIKE, % and _ patterns."
            }
        ],
        "practiceObjective": "Combine multiple WHERE conditions correctly on a known two-row library example.",
        "practiceInstructions": [
            "Verify library.books contains the two original books from the earlier reading.",
            "Run the published AND, precedence, IN and pattern examples, recording outputs.",
            "Explain each condition for each book before writing a new query.",
            "Write a new compound predicate and compare it with a deliberately misplaced OR branch."
        ],
        "knowledgeCheck": "If A is FALSE and B is TRUE, what does A OR B mean? What is the default grouping of A AND B OR C? Which books match LIKE 'The%'? How is IN different from LIKE?",
        "readingTitle": "Learn WHERE, AND, OR and text patterns",
        "practiceTitle": "Filter library books with combined conditions",
        "checkTitle": "Check Boolean filtering",
        "practiceScenario": "Filter a generic library catalogue before applying SQL to Steward reports.",
        "practiceDeliverables": [
            "Predicted and actual rows for each query",
            "One two-row Boolean decision table",
            "Independent query with its explanation"
        ],
        "practiceCompletionCriteria": [
            "The learner correctly predicts which books each predicate includes.",
            "The parentheses experiment changes the row set as expected.",
            "The learner distinguishes list membership from prefix matching."
        ]
    },
    {
        "id": "postgresql-null-logic",
        "title": "Understand NULL in SQL",
        "introduction": "What if a database does not know a book's publication year? SQL has a marker for absent or unknown values: NULL. It is neither the number zero nor an empty string. It also changes the way comparisons and WHERE work. Before writing reports about missing values, learn three-valued logic with a small read-only dataset.",
        "outcomes": [
            "Explain NULL as the absence of a SQL value rather than a literal string.",
            "Distinguish TRUE, FALSE and UNKNOWN in WHERE conditions.",
            "Predict the outcomes of = NULL, IS NULL, IS NOT NULL and NOT with UNKNOWN.",
            "Use a small VALUES table to test missing values without modifying stored books."
        ],
        "sections": [
            {
                "id": "missing-value",
                "title": "What is NULL?",
                "body": "Imagine that a book record has a known title and author but no confirmed publication year. Storing 0 would falsely claim the book was published in year zero. Storing the text 'unknown' in an integer field would violate the type. SQL uses NULL to mean that a value is absent. Depending on the domain, absence may mean unknown, not yet collected or not applicable; you must decide which interpretation your application intends.\n\nNULL is not an ordinary value in comparisons. A text column may contain an empty string '', which is still a present string of length zero. A column may contain the literal word 'NULL', which is ordinary text. These are different from SQL NULL.\n\nEarlier we defined published_year integer without NOT NULL, so the library table permits unknown publication years. We will not insert a third book here. Instead, use a tiny read-only VALUES dataset so the experiment works even after your previous practice cleaned up its fictional records."
            },
            {
                "id": "values-source",
                "title": "Create a tiny result source without a table",
                "body": "The SQL VALUES expression can produce rows from literal values. When we place it in FROM and give it an alias such as sample(title, year), we can refer to it much like a small table during a query. It is not permanently saved in tsa_library and it is not a CREATE TEMP TABLE. It is a query-local row source.\n\nThe code below creates two candidate rows for this one SELECT: a book with year 1937 and one without a year. NULL::integer explicitly declares the missing value's type as integer, matching the other row's year. The cast syntax ::integer is PostgreSQL shorthand for selecting a type. The query displays both records; your psql output may render the NULL field as a blank by default, which does not mean it is an empty string.\n\nUnderstand why we use VALUES: we can test comparison behavior without altering the persistent books table or risking conflicts with later Steward exercises.",
                "language": "sql",
                "caption": "null_values.sql — inspect a read-only sample with a missing year",
                "code": "SELECT sample.title,\n       COALESCE(sample.year::text, '[missing]') AS displayed_year\nFROM (VALUES ('Known', 1937), ('Unknown', NULL::integer))\n  AS sample(title, year)\nORDER BY sample.title;",
                "output": "Known|1937\nUnknown|[missing]"
            },
            {
                "id": "not-equal-null",
                "title": "Why does = NULL not find the missing row?",
                "body": "A comparison such as year = 1937 can be TRUE or FALSE when the year is known. But year = NULL is not the correct way to ask \"is there no year?\" Because NULL does not represent an ordinary comparable value, comparisons with it produce UNKNOWN in SQL's three-valued logic. Even NULL = NULL produces UNKNOWN rather than TRUE.\n\nWHERE retains rows only when the condition is TRUE. It rejects both FALSE and UNKNOWN. Therefore WHERE year = NULL matches neither our known row nor the missing-year row. The server does not report a syntax error: the statement is valid SQL with a condition that never becomes TRUE in this example.\n\nUse IS NULL when testing absence. The second query shows that IS NULL returns the Unknown row. If you want rows where a year is present, use IS NOT NULL. Predict the result before executing.",
                "language": "sql",
                "caption": "null_equality.sql — compare = NULL with IS NULL",
                "code": "SELECT sample.title\nFROM (VALUES ('Known', 1937), ('Unknown', NULL::integer)) AS sample(title, year)\nWHERE sample.year = NULL\nORDER BY sample.title;\n\nSELECT sample.title\nFROM (VALUES ('Known', 1937), ('Unknown', NULL::integer)) AS sample(title, year)\nWHERE sample.year IS NULL\nORDER BY sample.title;",
                "output": "First query: no rows\nSecond query: Unknown"
            },
            {
                "id": "three-valued-logic",
                "title": "TRUE, FALSE and UNKNOWN are three different outcomes",
                "body": "SQL predicate logic has three possible results. Comparing 1958 >= 1950 produces TRUE. Comparing 1937 >= 1950 produces FALSE. Comparing NULL >= 1950 produces UNKNOWN. If you negate a normal TRUE predicate with NOT, it becomes FALSE; if you negate a normal FALSE, it becomes TRUE. But NOT UNKNOWN remains UNKNOWN. That means NOT (year >= 1950) does not automatically include books whose year is missing.\n\nAND and OR have corresponding UNKNOWN behavior: TRUE AND UNKNOWN is UNKNOWN; FALSE AND UNKNOWN is FALSE; TRUE OR UNKNOWN is TRUE; FALSE OR UNKNOWN is UNKNOWN. Think of a missing fact as an unanswered question: some combinations remain determinable, while others cannot be decided.\n\nThe query below uses COALESCE to display an explicit word UNKNOWN rather than psql's usual blank representation of NULL. COALESCE picks the first non-null argument, and ::text turns a Boolean into its textual name for display. Neither operation changes SQL's actual truth value.",
                "language": "sql",
                "caption": "null_truth_table.sql — inspect TRUE FALSE and UNKNOWN",
                "code": "SELECT label,\n       COALESCE((year >= 1950)::text, 'UNKNOWN') AS after_1950,\n       COALESCE((NOT (year >= 1950))::text, 'UNKNOWN') AS not_after\nFROM (VALUES ('Known old', 1937), ('Known new', 1958), ('Unknown', NULL::integer))\n  AS examples(label, year)\nORDER BY label;",
                "output": "Known new|true|false\nKnown old|false|true\nUnknown|UNKNOWN|UNKNOWN"
            },
            {
                "id": "null-in-practice",
                "title": "Use IS NULL and IS NOT NULL deliberately",
                "body": "For an optional publication year, `published_year IS NULL` selects books whose year has not been recorded. `published_year IS NOT NULL` selects books with a present value. Unlike = NULL and <> NULL, these are explicit absence tests that return TRUE or FALSE.\n\nThere are other tools for missing-value behavior. COALESCE(year, 0) can provide a fallback number for display, but 0 might be mistaken for a real year, so choose fallback values carefully. IS DISTINCT FROM gives a comparison that treats two NULLs as not distinct and a NULL compared with a non-NULL value as distinct. Those constructs are useful later; they should not replace first understanding WHERE and UNKNOWN.\n\nA missing publication year is not always an error. Whether it is allowed is a schema decision. Our book table allowed it deliberately. By contrast, title was NOT NULL because every valid book entry needs a title. SQL NULL behavior and table constraints are two sides of that same domain decision."
            },
            {
                "id": "independent-check",
                "title": "Diagnose a missing-data query that returns zero rows",
                "body": "A colleague tries SELECT title FROM library.books WHERE published_year = NULL; and finds no books, even though they believe some years are absent. There are at least two possible reasons for an empty result: the table has no rows with missing years, or the predicate is logically wrong. The first query is wrong regardless of the stored data.\n\nRewrite it using IS NULL, then verify how many records in your own library.books actually have a missing year. If the result is still empty, that may be correct: the two original sample books both have known publication years. Use the read-only VALUES exercise above to prove that the corrected predicate works on known missing data, without inventing or deleting permanent books.\n\nNext you will learn ordering and pagination. Keep in mind that sorting rows with NULL values also requires an explicit placement decision when a report's order matters."
            }
        ],
        "warning": "SQL NULL is not the quoted string 'NULL', the number 0, or an empty string. Ordinary comparisons with NULL yield UNKNOWN; WHERE keeps only TRUE rows.",
        "assignment": [
            "Explain why NULL and an empty string are different.",
            "Run the VALUES example, identify which row has no year and explain the cast.",
            "Run = NULL and IS NULL against the same sample; explain the different result.",
            "Predict the truth table for a known old year, known recent year and NULL.",
            "Write an independent query using IS NOT NULL and explain why NOT (year >= 1950) excludes missing years."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Comparison Functions and Operators",
                "url": "https://www.postgresql.org/docs/17/functions-comparison.html",
                "kind": "reference",
                "purpose": "Authoritative explanation of NULL comparisons and IS DISTINCT FROM."
            },
            {
                "title": "PostgreSQL 17 — Conditional Expressions",
                "url": "https://www.postgresql.org/docs/17/functions-conditional.html",
                "kind": "reference",
                "purpose": "Explain COALESCE for display-only fallbacks."
            }
        ],
        "practiceObjective": "Explain and reproduce three-valued SQL logic using nonpersistent sample rows.",
        "practiceInstructions": [
            "Run the three published VALUES-based queries without modifying stored records.",
            "Compare = NULL, IS NULL and NOT comparisons with expected row sets.",
            "Construct an independent IS NOT NULL query for the two original books.",
            "Explain why a query may be valid yet select zero rows."
        ],
        "knowledgeCheck": "What does WHERE do with UNKNOWN? Why is NOT UNKNOWN still UNKNOWN? If a book's year is absent, does published_year <> 1950 select it? What is the correct missing-value predicate?",
        "readingTitle": "Learn SQL NULL and missing values",
        "practiceTitle": "Test missing-value predicates",
        "checkTitle": "Check three-valued logic",
        "practiceScenario": "Use read-only tiny book examples to learn NULL without changing the canonical Steward dataset.",
        "practiceDeliverables": [
            "VALUES query output",
            "Incorrect versus correct NULL test",
            "Truth table and independent explanation"
        ],
        "practiceCompletionCriteria": [
            "No persistent database contents change.",
            "The learner explains UNKNOWN rather than treating it as FALSE.",
            "The learner can rewrite a faulty = NULL query into an IS NULL query."
        ]
    },
    {
        "id": "postgresql-sort-results",
        "title": "Sort and Limit Query Results",
        "introduction": "A database does not promise that rows will come out alphabetically or in insertion order. ORDER BY lets you request an order, and LIMIT can return only part of that sorted result. We will go beyond the two-row book example to inspect ties, missing values, and pagination using a read-only miniature list.",
        "outcomes": [
            "Explain why SELECT without ORDER BY has no guaranteed row order.",
            "Sort by several columns, using ASC, DESC and NULLS FIRST/LAST.",
            "Explain why tie-breakers matter when LIMIT or OFFSET is used.",
            "Distinguish stable sorting from consistent pagination while data changes."
        ],
        "sections": [
            {
                "id": "no-natural-order",
                "title": "Why query results have no natural order",
                "body": "A relational table describes a collection of records; it does not promise that SELECT will return them in the order they were inserted. PostgreSQL may read table pages in physical order, traverse an index, or use parallel query plans. A two-row test that repeats in the same order is not evidence of a guaranteed contract.\n\nORDER BY is the SQL clause that requests result ordering. ORDER BY title ASC sorts text titles in ascending order according to the applicable collation. DESC reverses the sort direction. The columns in ORDER BY do not have to be printed in the SELECT list in every query form, although SELECT DISTINCT introduces extra restrictions.\n\nYour earlier library.books example used ORDER BY book_id, because a predictable displayed order was part of its expected output. Here we examine what happens when the primary sort column has equal values and the user wants just the first page."
            },
            {
                "id": "sort-multiple",
                "title": "Use two sort keys to settle ties",
                "body": "Imagine a report listing books by publication year from newest to oldest. If two books have the same year, ORDER BY published_year DESC leaves their relative order unspecified. Adding title ASC as a second key decides the order among those tied years. For robust pagination, a unique identifier can serve as the final tie-breaker when two titles can also be equal.\n\nThe code uses a read-only VALUES expression as a temporary result source, not a stored table. Alpha and Beta both have year 2000; title alphabetically puts Alpha first. Old has 1990. Undated has a NULL year. The NULLS LAST instruction places missing years after known ones even though the year sort is DESC.\n\nPredict all four rows before running. The display order is Alpha, Beta, Old, Undated. No INSERT occurs, and no stored book has been modified.",
                "language": "sql",
                "caption": "sort_all.sql — tie-breakers and missing years",
                "code": "SELECT title, published_year\nFROM (VALUES ('Beta', 2000), ('Alpha', 2000),\n             ('Undated', NULL::integer), ('Old', 1990))\n  AS sample(title, published_year)\nORDER BY published_year DESC NULLS LAST, title ASC;",
                "output": "Alpha|2000\nBeta|2000\nOld|1990\nUndated|"
            },
            {
                "id": "limit-results",
                "title": "What does LIMIT do after sorting?",
                "body": "LIMIT bounds how many result rows PostgreSQL returns. It does not guarantee which rows are first unless you specify an ORDER BY contract. In our example ORDER BY year DESC NULLS LAST, title ASC creates a predictable four-row sequence; LIMIT 3 returns Alpha, Beta and Old.\n\nThis does not mean the underlying table contains only three rows. LIMIT changes the returned result set. If the same query is executed against a table that later gains more records, the first three results can change because the data changed, even though the query syntax did not.\n\nUse LIMIT for a preview or a page of results, but do not mistake the limited output for a complete count. A separate COUNT query may be needed when the application asks how many records exist, and JOINs can change which rows you are counting.",
                "language": "sql",
                "caption": "sort_limit.sql — return the top three ordered rows",
                "code": "SELECT title\nFROM (VALUES ('Beta', 2000), ('Alpha', 2000),\n             ('Undated', NULL::integer), ('Old', 1990))\n  AS sample(title, published_year)\nORDER BY published_year DESC NULLS LAST, title ASC\nLIMIT 3;",
                "output": "Alpha\nBeta\nOld"
            },
            {
                "id": "offset-results",
                "title": "Why OFFSET is not a complete pagination solution",
                "body": "OFFSET skips a number of rows from the ordered result before LIMIT selects a page. With a stable four-row read-only dataset, LIMIT 2 OFFSET 1 returns Beta and Old. OFFSET 0 would begin with Alpha. A unique tie-breaker is necessary to make repeated pages deterministic for the same unchanged data.\n\nHowever, ORDER BY alone does not freeze the database while a user requests several pages. If someone inserts a new first row between page requests, the original row positions shift; OFFSET 2 may repeat a previously seen row or skip a row. The result can be perfectly ordered and still represent different snapshots over time. For many live-feed APIs, keyset/cursor pagination anchored to stable sort keys is preferable to large offsets, but it also needs a clear consistency contract.\n\nWe are not introducing transaction isolation in this lesson. For now, name the two distinct problems: ambiguous order caused by tied keys, and changing pages caused by data changing between requests.",
                "language": "sql",
                "caption": "sort_offset.sql — skip one row then take two",
                "code": "SELECT title\nFROM (VALUES ('Beta', 2000), ('Alpha', 2000),\n             ('Undated', NULL::integer), ('Old', 1990))\n  AS sample(title, published_year)\nORDER BY published_year DESC NULLS LAST, title ASC\nLIMIT 2 OFFSET 1;",
                "output": "Beta\nOld"
            },
            {
                "id": "wrong-sort",
                "title": "Sorting a category is not the same as ranking its severity",
                "body": "Suppose a report contains labels low, medium, high and critical. ORDER BY criticality DESC sorts the *text* values lexicographically according to a collation; it does not know that critical is more urgent than high. A query can be deterministic and still be semantically wrong for a business priority.\n\nIf a categorical field has a specific order, represent that order explicitly—for example with a CASE expression that assigns a numeric rank—or use a constrained domain model that preserves business meaning. The first task is to define that rank with the domain owner. Do not hide an arbitrary alphabetical order behind a confident chart.\n\nFor our book data, year is naturally numeric, so descending published_year has a meaningful numeric order. Missing years still need explicit placement. The takeaway is to ask what order the user actually requested before choosing ORDER BY columns."
            },
            {
                "id": "transfer-sorting",
                "title": "Try sorting a different kind of record",
                "body": "A library wants a list of due loans ordered by due date ascending, then borrower ID ascending. Draw four sample rows, including two with the same due date. Show how the borrower ID breaks ties. Then decide what should happen when a due date is NULL. Should missing dates come first, last or be excluded by WHERE? There is no universal correct answer without defining the report's purpose.\n\nNow consider a second page. If a new loan is added with an earlier due date between requests, what might OFFSET do? Explain the difference between ordering a fixed dataset and retrieving a consistent multi-page history as writes continue. Those questions are the foundation for later pagination and isolation lessons.\n\nThe next reading returns to the Steward teaching dataset for a deliberate filtering/sorting audit. There you should apply these principles, not learn them for the first time."
            }
        ],
        "warning": "Ordering by a nonunique field alone cannot guarantee order among ties. A stable ORDER BY does not prevent changes between page requests, and text order is not a severity ranking.",
        "assignment": [
            "Run the full four-row sort and explain its two keys and NULL placement.",
            "Run LIMIT 3 and LIMIT 2 OFFSET 1 and predict their outputs.",
            "Explain why equal years need a tie-breaker.",
            "Describe how an insert between page requests can shift an OFFSET result.",
            "Design a two-key sort for a different data set, including what to do with unknown values."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Sorting Rows",
                "url": "https://www.postgresql.org/docs/17/queries-order.html",
                "kind": "reference",
                "purpose": "Reference ASC/DESC, multiple keys and NULLS FIRST/LAST."
            },
            {
                "title": "PostgreSQL 17 — LIMIT and OFFSET",
                "url": "https://www.postgresql.org/docs/17/queries-limit.html",
                "kind": "reference",
                "purpose": "Reference LIMIT and OFFSET behavior."
            }
        ],
        "practiceObjective": "Sort a read-only sample by several columns and explain LIMIT/OFFSET reliability.",
        "practiceInstructions": [
            "Run all four-row sorting examples; predict tied and missing-year placement.",
            "Explain why sorting by year alone does not determine the order of same-year books.",
            "Show LIMIT/OFFSET outputs using the exact code.",
            "Describe a hypothetical insert that would cause an offset page to shift, without claiming a concurrent experiment occurred."
        ],
        "knowledgeCheck": "Does a SELECT without ORDER BY promise row order? Why add a tie-breaker? What does NULLS LAST do? Does LIMIT 3 mean the table has three rows? Can OFFSET pages shift after a new insert?",
        "readingTitle": "Learn ORDER BY, LIMIT and OFFSET",
        "practiceTitle": "Sort and paginate a book list",
        "checkTitle": "Check ordering and pagination",
        "practiceScenario": "Understand SQL ordering through a fixed read-only library list rather than an evolving Steward query.",
        "practiceDeliverables": [
            "Expected and actual order for four rows",
            "LIMIT/OFFSET results",
            "Tie-breaker and changing-data explanation"
        ],
        "practiceCompletionCriteria": [
            "The learner can predict sort and limit outputs before running SQL.",
            "The learner separates stable ordering from data-snapshot consistency.",
            "No stored tables are modified."
        ]
    },
    {
        "id": "filtering-ordering",
        "title": "Steward Practice: Filter and Sort SQL Reports",
        "introduction": "You have already learned how WHERE combines predicates, how NULL makes a condition UNKNOWN, and how ORDER BY, LIMIT and tie-breakers work. This is a Steward application lab: use that knowledge to inspect a five-Service dataset, catch a filter that accidentally returns a retired Service, and prove the corrected SQL against real PostgreSQL. This section applies previous lessons; it is not where those SQL fundamentals are first defined.",
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
        "id": "postgresql-subquery-basics",
        "title": "Use One Query Inside Another",
        "introduction": "Sometimes a query depends on the answer to another query. Instead of copying a value into your SQL manually, you can place a SELECT inside a larger SELECT. That inner SELECT is a subquery. We will learn the simplest two forms with a library catalogue: a subquery returning one value, and a subquery returning several candidates for IN.",
        "outcomes": [
            "Explain what makes a SELECT a subquery.",
            "Distinguish a scalar result from a set of candidate values.",
            "Use a computed average as a filter without hard-coding it.",
            "Recognize the PostgreSQL error when a scalar subquery returns too many rows."
        ],
        "sections": [
            {
                "id": "query-inside-query",
                "title": "Why use a subquery at all?",
                "body": "Suppose you want books published before the catalogue's average publication year. You could run SELECT AVG(published_year), copy the result and type it into a second query. But the average might change after another book is inserted, and a hard-coded year would quickly become wrong. A subquery lets SQL calculate the value as part of the question.\n\nA subquery is a SELECT statement placed inside another SQL statement. The inner query produces a result; the outer query uses it as a comparison value, a membership set or a source of rows. Parentheses separate its SQL from the outer expression. This is about the logical meaning of the query, not a claim that PostgreSQL literally executes the inner query first in every physical plan.\n\nOur persistent library.books table already has The Hobbit (1937) and Things Fall Apart (1958). If you have added more books, inspect the table and understand why outputs differ. We will not create, modify or delete records for these examples. Start by predicting the average of 1937 and 1958."
            },
            {
                "id": "scalar-subquery",
                "title": "Return a single value to compare against",
                "body": "A scalar subquery supplies one column and at most one row in a place where SQL expects one value. AVG(published_year) returns one aggregate value for the books table. On the two-book lab, that average is 1947.5. When the outer WHERE asks published_year < (SELECT AVG(...)), it compares each book's year to the computed average and returns The Hobbit.\n\nWalk through the logic: the inner SELECT describes a single average across all known publication years; the outer SELECT describes the titles whose years are below that value. A later insertion would change the calculated average automatically, without editing the query text. PostgreSQL can choose an efficient physical plan; the important point is the result contract.\n\nAVG ignores NULL input years. If every row's year is NULL, the result is NULL, and comparing a known year with NULL produces UNKNOWN. That is not a syntax failure; it follows the NULL rules you learned earlier.",
                "language": "sql",
                "caption": "subquery_library_average.sql — a computed scalar threshold",
                "code": "SELECT ROUND(AVG(published_year), 1) AS average_year\nFROM library.books;\n\nSELECT title\nFROM library.books\nWHERE published_year < (SELECT AVG(published_year) FROM library.books)\nORDER BY title;",
                "output": "1947.5\nThe Hobbit"
            },
            {
                "id": "shape-matters",
                "title": "What if the inner query returns two rows?",
                "body": "A scalar expression cannot substitute two publication years where one number is expected. The deliberately invalid example below asks PostgreSQL to place SELECT published_year FROM library.books into a single output column. Our two-book table produces two rows, so PostgreSQL rejects it with \"more than one row returned by a subquery used as an expression.\"\n\nThat is a useful failure, not a reason to add LIMIT 1 without thought. LIMIT 1 would hide the ambiguity by selecting some candidate year, potentially without a stable order or meaningful business rule. Instead, ask what the outer operation wants: one aggregated value, a list of valid values, or merely the existence of a match.\n\nDo not run a destructive cleanup to force the inner query to one row. The next example uses IN when several candidate values are legitimate.",
                "language": "sql",
                "caption": "subquery_library_scalar_fail.sql — expected multirow scalar error",
                "code": "SELECT (SELECT published_year FROM library.books) AS one_year;",
                "output": "ERROR: more than one row returned by a subquery used as an expression"
            },
            {
                "id": "in-results",
                "title": "IN checks membership in an inner result set",
                "body": "Another question: which catalogue books were written by authors on a small selected-author list? A subquery can produce that list. Here we use an inline VALUES source with two author strings to keep the example read-only and independent of a more complex schema. The inner SELECT chosen.author returns two candidate values. The outer author IN (...) test is TRUE when a book's author equals any of them.\n\nWith the current two-book catalogue, Tolkien matches; Nobody does not. The result is The Hobbit. Do not mistake IN for a substring match: 'Tolkien' is not equal to 'J. R. R. Tolkien'. Use complete values for equality membership, and LIKE/ILIKE for patterns.\n\nA scalar comparison such as author = (subquery) is inappropriate when the subquery can return two rows. IN handles multiple candidate values. A query can also return no candidates; in that case IN is not TRUE for any non-null author. NULLs inside membership sets require additional care, especially with NOT IN, which we will study in the next lesson.",
                "language": "sql",
                "caption": "subquery_library_in.sql — membership in computed authors",
                "code": "SELECT title\nFROM library.books\nWHERE author IN (\n  SELECT chosen.author\n  FROM (VALUES ('J. R. R. Tolkien'), ('Nobody')) AS chosen(author)\n)\nORDER BY title;",
                "output": "The Hobbit"
            },
            {
                "id": "no-extra-storage",
                "title": "Does a subquery create a new database object?",
                "body": "These examples have not created a separate table or schema. The subquery is part of one SQL statement and its result exists as part of evaluating that statement. A derived table in FROM is another valid form: a subquery can produce a temporary result with columns that the outer query then refers to. That is not the same thing as CREATE TEMP TABLE, which creates a named table for one whole session.\n\nA subquery may be logically repeated for different outer rows if it refers to the outer query's columns. We have deliberately avoided that extra complexity here; the average and author-list subqueries do not reference an individual outer book. The next lesson introduces correlated subqueries, where that relationship is essential.\n\nThe terms \"inner\" and \"outer\" describe how SQL is written. They are not instructions to PostgreSQL's optimizer to execute every piece in that literal order. Use EXPLAIN later to investigate physical access paths after you understand the SQL's expected result."
            },
            {
                "id": "new-problem",
                "title": "Solve a different library question",
                "body": "Without copying the examples, write a query for titles published after the average year of all catalogued books. Predict Things Fall Apart, then execute it. Use the same scalar shape—one average year—rather than an IN set. Now change the question to books whose author appears in a list containing only Chinua Achebe. Use IN with a one-row inner source and predict one book.\n\nFor the negative case, explain why using equality with a two-row subquery is a type-of-result mistake: it tries to substitute a set where the outer comparison needs one value. Avoid \"fixing\" the error by deleting one of the books.\n\nYou should now be able to identify the needed result shape before writing SQL. The next lesson answers another kind of question: does a matching row exist at all?"
            }
        ],
        "warning": "A scalar subquery may return zero or one row; more than one row in scalar context causes an error. Never add LIMIT 1 just to hide an unclear business rule.",
        "assignment": [
            "Calculate the average publication year and predict the below-average book.",
            "Execute the scalar average and IN examples and inspect the returned rows.",
            "Deliberately run the multirow scalar example; record and explain the server error.",
            "Write an independent above-average query.",
            "State whether each example requires one value, several values or an existence check."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Subquery Expressions",
                "url": "https://www.postgresql.org/docs/17/functions-subquery.html",
                "kind": "reference",
                "purpose": "Confirm SQL scalar and membership subquery semantics."
            },
            {
                "title": "PostgreSQL 17 — Aggregate Functions",
                "url": "https://www.postgresql.org/docs/17/functions-aggregate.html",
                "kind": "reference",
                "purpose": "Reference AVG and its NULL behavior."
            }
        ],
        "practiceObjective": "Use read-only library subqueries to distinguish scalar from set-shaped results.",
        "practiceInstructions": [
            "Work against the two-book library dataset, without altering records.",
            "Run the average scalar query and IN membership query, comparing outputs with predictions.",
            "Execute the expected multirow scalar error and explain the correct result shape.",
            "Design one new subquery that calculates a threshold instead of hard-coding it."
        ],
        "knowledgeCheck": "When can a subquery be used as a scalar expression? What happens if it returns two rows? Why is IN appropriate for several matching authors? Does a subquery create a permanent database table?",
        "readingTitle": "Learn scalar and IN subqueries",
        "practiceTitle": "Query books using inner SELECT results",
        "checkTitle": "Check subquery result shapes",
        "practiceScenario": "Learn nested SELECT semantics with generic library data; apply to Steward only after the concept is established.",
        "practiceDeliverables": [
            "Computed average and title query",
            "IN result and shape explanation",
            "Expected multirow scalar error"
        ],
        "practiceCompletionCriteria": [
            "The learner identifies whether the inner SELECT returns one value or several.",
            "A deliberate scalar-result error is observed, not merely described.",
            "The learner does not change persistent records."
        ]
    },
    {
        "id": "postgresql-exists-subqueries",
        "title": "Check Whether Matching Rows Exist",
        "introduction": "A subquery can return one value or a list, but sometimes you only need a yes-or-no answer: is there at least one matching row? SQL provides EXISTS for that. When the inner query refers to the book being considered by the outer query, it is called correlated. We will demonstrate EXISTS, NOT EXISTS and a surprising NULL failure of NOT IN using small read-only book examples.",
        "outcomes": [
            "Explain how EXISTS answers a yes/no question without returning the inner columns.",
            "Identify an inner reference to the current outer row (correlation).",
            "Compare EXISTS with JOIN when several matches could duplicate output rows.",
            "Demonstrate why NOT IN with a NULL candidate can wrongly eliminate expected results."
        ],
        "sections": [
            {
                "id": "exists-meaning",
                "title": "Why ask whether a row exists?",
                "body": "Suppose a librarian has a list of preferred authors and wants every catalogue book whose author appears on that list. The result needs book titles, not every preferred-author entry. We could join the two lists, but if a preference list contains duplicate author entries, a normal JOIN may produce duplicate book titles. EXISTS avoids that problem because it tests only whether at least one corresponding row is present.\n\nAn EXISTS expression returns TRUE when its inner query has one or more rows and FALSE when it has none. It does not care which columns the inner SELECT returns; SELECT 1 is a common way to make that intent visible. The outer WHERE then retains books for which EXISTS is TRUE. You should ask what the business question needs: a pair of matching rows, or simply proof of at least one match.\n\nOur example creates a tiny preferred-author list using VALUES within the query. It does not save another table. For each outer book row, the inner WHERE compares chosen.author against that book's author."
            },
            {
                "id": "correlation",
                "title": "Correlate the inner query to the current book",
                "body": "In the SQL below, the outer table alias b stands for library.books. Inside EXISTS, chosen.author = b.author refers to the author of the *current outer row*. That reference is called correlation. The first book is by Tolkien and does not match the chosen list; Things Fall Apart is by Chinua Achebe and does. EXISTS is TRUE for the second book, so the outer result contains Things Fall Apart.\n\nRead the aliases carefully. b and chosen are names scoped to different parts of one SQL statement. Removing the condition that relates chosen.author to b.author would make the existence test independent of the current book. If the chosen list had any row, such an uncorrelated EXISTS would become TRUE for every book. A syntactically valid query could therefore return an incorrect report.\n\nPostgreSQL may optimize an EXISTS as a semi-join or another strategy. The essential logical meaning is that each outer book either qualifies once or does not qualify.",
                "language": "sql",
                "caption": "exists_library_match.sql — one correlated existence check",
                "code": "SELECT b.title\nFROM library.books AS b\nWHERE EXISTS (\n  SELECT 1\n  FROM (VALUES ('Chinua Achebe'), ('Nobody')) AS chosen(author)\n  WHERE chosen.author = b.author\n)\nORDER BY b.title;",
                "output": "Things Fall Apart"
            },
            {
                "id": "not-exists",
                "title": "Find books without a chosen author match",
                "body": "NOT EXISTS reverses the yes/no question. A book qualifies if the correlated inner query returns no matching row. With Chinua Achebe on the chosen list, The Hobbit is not represented and is returned.\n\nThere are two separate logical steps: for The Hobbit, the inner equality chosen.author = b.author has no match, so EXISTS is FALSE, then NOT EXISTS becomes TRUE. For Things Fall Apart, the inner SELECT has a match, so EXISTS is TRUE and NOT EXISTS is FALSE. This is a reliable way to express many \"has no related record\" questions.\n\nAlways check that the inner WHERE actually relates the tables by the intended key. If you write NOT EXISTS (SELECT 1 FROM chosen_list) with no correlation and the list has any row, all outer books are excluded, regardless of author. That is a common logic defect that SQL syntax alone will not catch.",
                "language": "sql",
                "caption": "exists_library_missing.sql — find books outside a chosen author list",
                "code": "SELECT b.title\nFROM library.books AS b\nWHERE NOT EXISTS (\n  SELECT 1 FROM (VALUES ('Chinua Achebe')) AS chosen(author)\n  WHERE chosen.author = b.author\n)\nORDER BY b.title;",
                "output": "The Hobbit"
            },
            {
                "id": "duplicates",
                "title": "Why EXISTS can differ from a JOIN",
                "body": "Now deliberately duplicate Chinua Achebe in the read-only preferred-author list. If you JOIN books to those two list rows, one matching book forms two matching pairs. SELECT b.title therefore prints Things Fall Apart twice. EXISTS, in contrast, would return the outer book at most once, because it tests whether *any* matching row exists.\n\nNeither operation is inherently wrong: JOIN returns related pairs, while EXISTS answers a membership question. If the report wants one line per book, EXISTS may express that intention more directly. Using DISTINCT to remove duplicate JOIN rows can sometimes be valid, but it should not hide that the query modeled the wrong question.\n\nPredict the number of output rows before executing. Do not infer that the two identical titles represent two saved book records: the duplication comes from the matching rows in the right-hand source.",
                "language": "sql",
                "caption": "exists_library_join_duplicates.sql — ordinary JOIN produces two matching pairs",
                "code": "SELECT b.title\nFROM library.books AS b\nJOIN (VALUES ('Chinua Achebe'), ('Chinua Achebe')) AS chosen(author)\n  ON chosen.author = b.author\nORDER BY b.title;",
                "output": "Things Fall Apart\nThings Fall Apart"
            },
            {
                "id": "not-in-null",
                "title": "Why NOT IN with NULL is a trap",
                "body": "NOT IN asks whether a value differs from all candidate values, but NULL is unknown rather than an ordinary value. For 2 NOT IN (1, NULL), the comparison against 1 is TRUE (2 differs), but comparison with NULL is UNKNOWN. The full result is UNKNOWN, not TRUE. WHERE excludes it. The same is true for 3, so an innocent-looking anti-membership query can return *zero* rows.\n\nUse a tiny read-only VALUES source with integers 1, 2 and 3. The blocked list contains 1 and NULL. The first query using NOT IN returns nothing. The second uses a correlated NOT EXISTS: it asks whether any known blocked number actually equals the candidate. For 2 and 3 there is no such match, so it returns those numbers.\n\nThis does not mean NOT IN is always wrong: if the candidate set is known to be non-null, it can express the intended logic. The correct choice depends on the schema, NULL policy and question being asked. Understand the truth conditions rather than memorizing a blanket replacement rule.",
                "language": "sql",
                "caption": "exists_library_not_in_null.sql — NOT IN returns none; NOT EXISTS returns two",
                "code": "SELECT c.x FROM (VALUES (1), (2), (3)) AS c(x)\nWHERE c.x NOT IN (\n  SELECT b.y FROM (VALUES (1), (NULL::integer)) AS b(y)\n)\nORDER BY c.x;\n\nSELECT c.x FROM (VALUES (1), (2), (3)) AS c(x)\nWHERE NOT EXISTS (\n  SELECT 1 FROM (VALUES (1), (NULL::integer)) AS b(y)\n  WHERE b.y = c.x\n)\nORDER BY c.x;",
                "output": "NOT IN: no rows\nNOT EXISTS: 2, 3"
            },
            {
                "id": "independent-scenario",
                "title": "Transfer the idea to a student-course database",
                "body": "A university asks for students enrolled in at least one course, and for students with no enrollments. A student may have many enrollment rows, so an ordinary JOIN could return a student several times. Write two query outlines: one using EXISTS and one using NOT EXISTS, relating enrollment.student_id to the current student.id.\n\nExplain what would happen if that correlation predicate were removed. If the Enrollments table is not empty, uncorrelated EXISTS would include every student, and uncorrelated NOT EXISTS would exclude every student. The query might execute perfectly while answering the wrong question.\n\nDo not treat this as a PostgreSQL-only feature. Correlated subqueries are part of SQL and apply across many relational systems, though performance and dialect details vary. The following Steward practice lesson will apply the same mechanisms to services and their production environments."
            }
        ],
        "warning": "A missing correlation condition and a nullable NOT IN candidate set can silently change every result. Check row meaning and NULL policy before interpreting success.",
        "assignment": [
            "Run the correlated EXISTS and NOT EXISTS examples and explain which book qualifies.",
            "Predict why an ordinary JOIN with a repeated author returns a duplicate title.",
            "Run the nullable NOT IN counterexample and explain the UNKNOWN outcome.",
            "Demonstrate the correctly correlated NOT EXISTS alternative.",
            "Design a student/enrollment query with an explicit correlation key."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Subquery Expressions",
                "url": "https://www.postgresql.org/docs/17/functions-subquery.html",
                "kind": "reference",
                "purpose": "Reference EXISTS, NOT EXISTS, NOT IN and correlated subqueries."
            },
            {
                "title": "PostgreSQL 17 — Joined Tables",
                "url": "https://www.postgresql.org/docs/17/queries-table-expressions.html",
                "kind": "reference",
                "purpose": "Understand why ordinary JOIN multiplies matching row pairs."
            }
        ],
        "practiceObjective": "Demonstrate correlated existence checks and the nullable NOT IN failure with read-only data.",
        "practiceInstructions": [
            "Run the published EXISTS and NOT EXISTS examples on the two-book library.",
            "Run the duplicate-JOIN and nullable NOT IN negative controls.",
            "Explain every output using per-row correlation or UNKNOWN truth values.",
            "Write an independent anti-existence query for a student/enrollment model."
        ],
        "knowledgeCheck": "Why can EXISTS use SELECT 1? What makes a subquery correlated? Can JOIN duplicate a book that EXISTS reports once? What does a NULL in the NOT IN list do to 2 NOT IN (1,NULL)?",
        "readingTitle": "Learn correlated EXISTS and NOT EXISTS",
        "practiceTitle": "Prove matching and missing relationships",
        "checkTitle": "Check EXISTS and NOT IN",
        "practiceScenario": "Use independent book and author lists to learn correlation before the Steward reporting exercise.",
        "practiceDeliverables": [
            "EXISTS/NOT EXISTS output and matching-row reasoning",
            "Duplicate JOIN comparison",
            "NULL poisoning demonstration and independent anti-existence query"
        ],
        "practiceCompletionCriteria": [
            "The learner identifies the outer-column reference inside the subquery.",
            "The incorrect NOT IN result and correct NOT EXISTS result are both observed.",
            "Examples do not modify the persistent catalogue."
        ]
    },
    {
        "id": "subqueries",
        "title": "Steward Practice: Subqueries and Missing Relationships",
        "introduction": "You have learned scalar and IN subqueries, correlated EXISTS and NOT EXISTS, and how a NULL inside NOT IN can produce an unexpected empty result. Apply those mechanisms now to a five-Service Steward dataset. These are application-specific reporting cases that build on the separate SQL fundamentals; no ORM is needed.",
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
        "id": "postgresql-with-basics",
        "title": "Make a Long Query Easier to Read with WITH",
        "introduction": "A subquery nests one SELECT inside another. When a report needs several intermediate steps, nested parentheses can become difficult to explain. WITH lets you give those intermediate results meaningful names. We will learn ordinary, non-recursive WITH queries on the library catalogue before using them for Steward reports.",
        "outcomes": [
            "Explain what a Common Table Expression (CTE) means without jargon.",
            "Name and reuse a SELECT result inside one SQL statement.",
            "Combine two named steps into one readable query.",
            "Distinguish a CTE from a saved table, a view and a session temporary table."
        ],
        "sections": [
            {
                "id": "why-names",
                "title": "Why name an intermediate result?",
                "body": "A query may need to answer several smaller questions before producing a final report. For example, select books with known publication years, then count them and find the earliest year. You could nest one SELECT inside another, but naming an intermediate result makes the question easier to audit and explain.\n\nA Common Table Expression, or CTE, is a named query expression defined by a WITH clause. The name exists for the SQL statement that follows it. It is not automatically a permanent table, a separate database or a session temporary table. PostgreSQL can decide how to execute and optimize the expression; the SQL name primarily helps the reader understand the logical stages.\n\nThe library table already exists in tsa_library. We use its two original books as known data and do not create or delete any persistent records."
            },
            {
                "id": "one-step",
                "title": "Name a list of books published since 1950",
                "body": "The syntax starts with WITH and a chosen name, followed by AS and a parenthesized SELECT. The final SELECT can read that name. Here recent_books contains the rows from library.books with a year of at least 1950. On our two-book fixture, it contains Things Fall Apart. The final SELECT returns only its title.\n\nNotice that the CTE name recent_books has no library schema prefix: it is a temporary name inside this one statement, not a database object under the library namespace. The semicolon belongs after the final SELECT, so the WITH definition and final SELECT remain part of a single SQL statement.\n\nBefore running, describe the first SELECT's columns and rows and then the second SELECT's output. That habit makes multi-stage SQL easier to debug.",
                "caption": "cte_library_one.sql — named recent books",
                "language": "sql",
                "code": "WITH recent_books AS (\n  SELECT title, published_year\n  FROM library.books\n  WHERE published_year >= 1950\n)\nSELECT title FROM recent_books ORDER BY title;",
                "output": "Things Fall Apart"
            },
            {
                "id": "two-steps",
                "title": "Use one named step in another",
                "body": "Several CTEs can appear in the same WITH clause, separated by commas. A later CTE can use the results of a preceding one. The first step below, dated_books, removes records whose publication year is missing; the second, year_summary, counts the remaining records and calculates the earliest year. The final SELECT returns those summary values.\n\nA reader can inspect each named result independently: dated_books should have two rows in the original library, year_summary should have one row containing 2 and 1937, and the final query should return 2|1937. An aggregate reduces many input rows to one result row here. The names tell you which question each step answers.\n\nA WITH query can also be written using nested subqueries. Neither form is always faster. Use the form that makes the logical rules and expected row counts clearest.",
                "caption": "cte_library_two.sql — staged count and earliest year",
                "language": "sql",
                "code": "WITH dated_books AS (\n  SELECT title, published_year FROM library.books\n  WHERE published_year IS NOT NULL\n), year_summary AS (\n  SELECT COUNT(*) AS total_books,\n         MIN(published_year) AS earliest_year\n  FROM dated_books\n)\nSELECT total_books, earliest_year FROM year_summary;",
                "output": "2|1937"
            },
            {
                "id": "scope",
                "title": "What happens after the statement ends?",
                "body": "The previous query ended after its final SELECT. The name recent_books was available only while that query was being evaluated. If you now type SELECT * FROM recent_books; as a separate statement, PostgreSQL reports that the relation does not exist. This is an expected error: the first SELECT succeeded, but the CTE name was never saved as a table.\n\nCompare lifetimes carefully. library.books is persistent across psql connections. A table declared CREATE TEMP TABLE lasts for its creating session. A WITH name lasts for one statement. CREATE VIEW saves a reusable query definition; it is neither the same as a WITH name nor a guarantee that result rows are stored permanently.\n\nDo not repair this expected error by running CREATE TABLE recent_books. The purpose is to prove statement scope, not to create more state.",
                "caption": "cte_library_scope_fail.sql — name unavailable after the statement",
                "language": "sql",
                "code": "SELECT * FROM recent_books;",
                "output": "ERROR: relation \"recent_books\" does not exist"
            },
            {
                "id": "when-with-helps",
                "title": "Do not turn WITH into a default for every SELECT",
                "body": "For a short query such as SELECT title FROM library.books;, a CTE may add complexity without improving clarity. It becomes useful when multiple stages have independent meanings, repeated logic, or conditions that are otherwise difficult to read. Name the intermediate result after its purpose, such as active_books or overdue_loans, not temp1.\n\nThe optimizer may inline a suitable CTE rather than materialize it, so the CTE name does not promise an intermediate physical table or a performance improvement. The query-plan lesson later shows how to inspect the chosen physical operations. Some data-modifying WITH forms exist, but they are not part of this beginner exercise.\n\nThe next lesson introduces WITH RECURSIVE, which adds a repeatedly evaluated relationship. Do not jump to recursion before you understand how an ordinary WITH name is scoped and used."
            },
            {
                "id": "transfer",
                "title": "Build a second report without copying the first",
                "body": "Write a query with an older_books CTE containing books published before 1950, then count those rows in the final SELECT. With our two books the answer is 1. Before running it, state which condition belongs in the CTE and what the final COUNT is counting.\n\nThen write the same logical request with a derived subquery in FROM instead of WITH. The two should select the same source rows and return the same count. If they differ, inspect the WHERE predicate and the scope of the selected rows, rather than blaming the CTE syntax.\n\nYou now have one new technique: naming a result to make a larger query understandable. The following reading adds a new mechanism—repeating a query until a stopping rule is reached."
            }
        ],
        "warning": "WITH does not create a permanent table and does not guarantee a faster query. Keep one clear reason for each named step.",
        "assignment": [
            "Run the single- and two-step library queries, predicting outputs.",
            "Run the missing-relation negative example in a separate statement.",
            "Explain CTE vs permanent table, session TEMP table and view.",
            "Write an independent older_books CTE and equivalent nested SELECT."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — WITH Queries",
                "url": "https://www.postgresql.org/docs/17/queries-with.html",
                "kind": "reference",
                "purpose": "Official non-recursive WITH syntax, scope and materialization semantics."
            },
            {
                "title": "PostgreSQL Wiki — CTEReadme",
                "url": "https://wiki.postgresql.org/wiki/CTEReadme",
                "kind": "reference",
                "purpose": "Secondary practical CTE examples; prefer current official docs for exact behavior."
            }
        ],
        "practiceObjective": "Create readable single- and two-stage read-only queries without new schema objects.",
        "practiceInstructions": [
            "Run both authored CTE blocks against library.books.",
            "Prove the name disappears in a later SQL statement.",
            "Explain each stage's input/output rows and write another two-step query."
        ],
        "knowledgeCheck": "Does WITH create a table? Can a later CTE read an earlier CTE? What does a missing-relation error after the statement mean? Does WITH necessarily make SQL faster?",
        "readingTitle": "Understand named SQL steps with WITH",
        "practiceTitle": "Build a library report in two stages",
        "checkTitle": "Check CTE scope",
        "practiceScenario": "Learn SQL query structure using books before application-specific Steward reports.",
        "practiceDeliverables": [
            "One- and two-step query results",
            "Missing relation negative",
            "Independent two-stage report"
        ],
        "practiceCompletionCriteria": [
            "The learner can identify the output of each named step.",
            "The named result's statement lifetime is understood.",
            "No persistent data is modified."
        ]
    },
    {
        "id": "postgresql-recursive-with",
        "title": "Follow Relationships with Recursive Queries",
        "introduction": "A basic WITH names intermediate rows, but some questions require following a chain whose length is not known in advance. WITH RECURSIVE supplies a starting set, a rule for finding next rows and a way to stop. We will learn that mechanism with numbers and a small people hierarchy, then handle a deliberate cycle without running an unbounded query.",
        "outcomes": [
            "Explain anchor rows, recursive step and stopping condition.",
            "Predict the iterations of a bounded number generator.",
            "Follow a small chain of named people using repeated JOINs.",
            "Detect a loop using a visited-path guard and explain its limitations."
        ],
        "sections": [
            {
                "id": "recursive-purpose",
                "title": "Why use recursion for a hierarchy?",
                "body": "Suppose Ana manages Bia, Bia manages Ciro, and Ciro manages Dina. One JOIN can retrieve direct reports. Several JOINs can retrieve a fixed number of levels, but an organization chart might be many levels deep, and its maximum depth may change. A recursive query follows one relationship repeatedly until it can go no further.\n\nPostgreSQL's WITH RECURSIVE allows a named result to refer to itself. It has a non-recursive starting part (the anchor) and a recursive part that uses rows from the previous step to find further rows. UNION ALL combines those results. PostgreSQL evaluates the operation iteratively internally, even though the SQL is written recursively.\n\nEvery such query needs a trustworthy stopping policy. Without one, cyclic relationships or an unbounded rule can consume resources indefinitely. We start with counting because its stop condition is easy to inspect."
            },
            {
                "id": "count",
                "title": "Count from one to four",
                "body": "The anchor SELECT 1 produces the first row. The recursive SELECT produces n+1 from the current counter rows while n<4. That yields 2, then 3, then 4; when n reaches 4 the predicate is FALSE and no next row is generated. The final SELECT shows 1, 2, 3, 4 in explicit ascending order.\n\nRead the code as three separate decisions: what is the first row, how do I get another row, and when should I stop? Change the stopping rule mentally to n<3 and predict the resulting sequence. Do not remove the bound merely to see what happens: an unbounded recursive expression is not a safe lab experiment.\n\nThe words anchor and recursive term name the two SELECTs around UNION ALL. They will appear again in the hierarchy example.",
                "caption": "cte_recursion_numbers.sql — bounded counter",
                "language": "sql",
                "code": "WITH RECURSIVE counter(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1 FROM counter WHERE n < 4\n)\nSELECT n FROM counter ORDER BY n;",
                "output": "1\n2\n3\n4"
            },
            {
                "id": "people",
                "title": "Walk from Ana to Dina",
                "body": "Represent each direct relationship as two values: from_person and to_person. We use a read-only VALUES list instead of creating a permanent employee table. The anchor selects Ana at depth 0. The recursive step finds an edge whose from_person matches the current person's name and returns its to_person at the next depth.\n\nThe result is Ana at 0, Bia at 1, Ciro at 2 and Dina at 3. A WHERE depth<3 condition bounds the demonstration at three transitions. This works for the sample; a real organization may require deeper traversal. Explain each join matching the previous person to the next row rather than memorizing the query text.\n\nThe direction matters. Reversing the relation would walk toward managers instead of toward reports. We have not executed any Steward SQL in this example.",
                "caption": "cte_recursion_people.sql — a three-link chain",
                "language": "sql",
                "code": "WITH RECURSIVE chain(person, depth) AS (\n  SELECT 'Ana'::text, 0\n  UNION ALL\n  SELECT link.to_person, chain.depth + 1\n  FROM chain\n  JOIN (VALUES ('Ana','Bia'), ('Bia','Ciro'), ('Ciro','Dina'))\n    AS link(from_person, to_person)\n    ON link.from_person = chain.person\n  WHERE chain.depth < 3\n)\nSELECT person, depth FROM chain ORDER BY depth;",
                "output": "Ana|0\nBia|1\nCiro|2\nDina|3"
            },
            {
                "id": "cycles",
                "title": "Stop before following the same node again",
                "body": "Now consider edges A→B and B→A. With no check, following each edge leads back to the earlier node, and the repeated operation may never finish. A depth limit terminates after a fixed number of steps but can hide legitimate longer paths. Another approach is to remember nodes visited along each path.\n\nThe query below carries an array named seen. ARRAY['A'] starts the path. The operator || appends the next node, and = ANY(seen) tests whether it was already visited. NOT excludes edges that revisit a seen node. After returning A and B, it refuses B→A because A is already in the array. The final array_length counts the nodes in each path.\n\nThis is a small executed cycle test, not a claim that arbitrary graph traversal is cheap. Different branches can still reach the same node via different paths and produce several rows.",
                "caption": "cte_recursion_cycle.sql — safe walk across A and B",
                "language": "sql",
                "code": "WITH RECURSIVE walk(node, seen) AS (\n  SELECT 'A'::text, ARRAY['A'::text]\n  UNION ALL\n  SELECT e.to_node, walk.seen || e.to_node\n  FROM walk\n  JOIN (VALUES ('A'::text,'B'::text), ('B','A'))\n    AS e(from_node, to_node)\n    ON e.from_node = walk.node\n  WHERE NOT (e.to_node = ANY(walk.seen))\n)\nSELECT node, array_length(seen, 1) AS path_length\nFROM walk ORDER BY path_length;",
                "output": "A|1\nB|2"
            },
            {
                "id": "limits",
                "title": "A safe stop is part of the business question",
                "body": "A recursion guard can have different meanings. The counter's n<4 condition gives the desired mathematical endpoint. A hierarchy with depth<3 intentionally truncates paths deeper than three links. A seen-array condition prevents cycles on one path. These are not interchangeable. The correct choice depends on whether you want all reachable nodes, paths to a target, a bounded preview or an error on unexpected cycles.\n\nUsing UNION instead of UNION ALL can remove exact duplicate rows, but it does not necessarily stop a loop when a changing depth or path column makes each repeated visit a distinct output row. PostgreSQL also has SEARCH and CYCLE syntax for graph traversal; we leave it as optional further study once the manual guard is clear.\n\nDo not claim a query is safe merely because it returned a few rows on a small example. Check the termination rule, possible cycles and expected result cardinality."
            },
            {
                "id": "new-hierarchy",
                "title": "Explain an unfamiliar chain independently",
                "body": "Draw an organization of four people or a product category hierarchy. Name its anchor node, edge direction, recursive join key and stopping policy. Write a two-step trace showing the current working rows and the next rows added. Then draw a cycle and explain which exact predicate rejects the repeated node.\n\nDo not execute an intentionally unbounded query; predicting the failure is sufficient. The following Steward applied case follows service dependencies. At that stage you should recognize the anchor, repeated edge match, cycle policy and resulting row meaning without having the instructor reinterpret every command for you."
            }
        ],
        "warning": "Unbounded recursion can consume server resources. Do not test infinite cycles without a guard; a depth cutoff can also truncate a valid long chain.",
        "assignment": [
            "Execute the bounded number query, tracing each iteration.",
            "Execute the Ana→Dina hierarchy and explain edge direction.",
            "Run the guarded A↔B cycle and explain its two output rows.",
            "Describe why UNION does not always solve recursion with changing depth.",
            "Design a different hierarchy and its stopping policy."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Recursive WITH",
                "url": "https://www.postgresql.org/docs/17/queries-with.html",
                "kind": "reference",
                "purpose": "Official anchor/step evaluation, cycle detection and recursive search mechanics."
            },
            {
                "title": "LearnSQL — PostgreSQL Recursive Queries",
                "url": "https://learnsql.com/course/postgresql-recursive-queries/",
                "kind": "reference",
                "purpose": "Optional practice course with progression from CTEs to hierarchies."
            }
        ],
        "practiceObjective": "Execute a bounded recursive query and safely traverse a cyclic graph.",
        "practiceInstructions": [
            "Run the published number, chain and cycle examples.",
            "Trace the generated rows at each step, not just the final output.",
            "Explain what would go wrong without the cycle guard without executing it.",
            "Model an independent hierarchy with a deliberate termination policy."
        ],
        "knowledgeCheck": "What are anchor and recursive terms? When does the number example stop? Why is a visited-node guard different from a depth limit? Can UNION alone always prevent cycling?",
        "readingTitle": "Learn recursion, hierarchy and cycle guards",
        "practiceTitle": "Traverse a safe recursive hierarchy",
        "checkTitle": "Check recursive SQL termination",
        "practiceScenario": "Work on tiny read-only hierarchies before applying recursion to Steward dependencies.",
        "practiceDeliverables": [
            "Number sequence and trace",
            "Person hierarchy result",
            "Cycle-safe result and explanation"
        ],
        "practiceCompletionCriteria": [
            "The learner identifies anchor, step and stop.",
            "The cyclic query terminates through an explicit guard.",
            "The learner can reason about a different hierarchy."
        ]
    },
    {
        "id": "ctes",
        "title": "Steward Practice: CTE Reports and Dependency Traversal",
        "introduction": "You already know how WITH names intermediate query steps, and how a recursive CTE repeats an anchor/transition until it stops. Apply those ideas to service-dependency reports using the existing Steward SQL dataset. This is application practice, not the first introduction to CTE syntax or graph cycles.",
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
        "id": "postgresql-transaction-basics",
        "title": "What Is a Database Transaction?",
        "introduction": "One change to a database may require several SQL statements that must succeed together. A transaction groups related operations so they can be committed or rolled back as a unit. We will learn that idea using fictional account balances in a disposable temporary table, then apply it to Steward records in a later exercise.",
        "outcomes": [
            "Explain why separate SQL statements can leave partial results.",
            "Use BEGIN, COMMIT and ROLLBACK intentionally.",
            "Observe changes inside a transaction that disappear after ROLLBACK.",
            "Distinguish atomicity, consistency, isolation and durability without claiming the lab proves all four."
        ],
        "sections": [
            {
                "id": "why-transaction",
                "title": "Why isn't one UPDATE always enough?",
                "body": "Imagine two account balances: Ana has 100 units and Bia has 40. You want to transfer 30 from Ana to Bia. This is one logical operation but two SQL updates. If the first succeeds and the second fails outside a deliberate transaction, you could leave Ana debited without Bia receiving the money.\n\nA database transaction is a boundary around related statements. Inside it, you can make several changes and choose whether to make them permanent as a group. PostgreSQL does not guess which statements belong to one business operation. Your SQL must mark that boundary with BEGIN and end it with either COMMIT or ROLLBACK.\n\nWe will use CREATE TEMP TABLE for the exercise, which you already learned. It keeps imaginary balances isolated from the permanent library.books table. The simple amounts are for demonstrating SQL mechanics, not a real banking or accounting system."
            },
            {
                "id": "transaction-commands",
                "title": "What do BEGIN, COMMIT and ROLLBACK mean?",
                "body": "BEGIN starts an explicit transaction. Statements issued afterward operate inside that transaction until you end it. COMMIT makes the transaction's successful changes permanent for a persistent table and visible under the appropriate isolation rules. ROLLBACK abandons changes made within the transaction. Neither command creates a database or starts the PostgreSQL server.\n\nWithout an explicit BEGIN, PostgreSQL's usual autocommit behavior treats each successful statement as its own transaction. That is convenient for single independent statements but dangerous when two writes must be one logical operation. Notice that the first and second UPDATE are not automatically grouped just because you typed them one after another.\n\nIn psql, transaction state can also affect the prompt. A failed statement may leave the transaction aborted until you roll back. The following examples run all statements within a single psql process; running each line in a separate connection would not be the same experiment."
            },
            {
                "id": "rollback",
                "title": "Make a transfer, inspect it, then undo it",
                "body": "Save this example as wallet_rollback.sql and run it from your shell with psql -X -d tsa_library -v ON_ERROR_STOP=1 -f wallet_rollback.sql, or pipe it to the disposable Docker psql client. All statements must execute in one session, because our example table is TEMP.\n\nCREATE TEMP TABLE declares two columns and constraints: owner identifies a balance, and amount must be nonnegative. Two INSERT values establish the initial state. BEGIN opens the transaction. One UPDATE subtracts 30 from Ana, and another adds 30 to Bia. The SELECT inside the transaction shows 70 and 70. ROLLBACK undoes both updates, and the final SELECT shows the original 100 and 40.\n\nThis demonstrates the meaning of rollback with actual SQL. It does not simulate a power failure or prove durability, because the table itself is deliberately temporary.\n\nAn important psql detail: do not pass this entire file as one quoted string to `psql -c`. A single `-c` argument containing several SQL statements is one request to PostgreSQL; the server can group statements before BEGIN into an implicit transaction. In this particular example, a later ROLLBACK can then undo the CREATE TEMP TABLE statement itself, so the final SELECT reports that wallet_example does not exist. Using the published `psql -f wallet_rollback.sql` form (or typing each statement interactively) sends statements separately and gives the intended transaction boundary. This difference is documented in PostgreSQL's psql reference and is a concrete example of why knowing your client matters.",
                "language": "sql",
                "caption": "wallet_rollback.sql — transfer and undo two writes",
                "code": "CREATE TEMP TABLE wallet_example (\n  owner text PRIMARY KEY,\n  amount integer NOT NULL CHECK (amount >= 0)\n);\nINSERT INTO wallet_example VALUES ('Ana', 100), ('Bia', 40);\nBEGIN;\nUPDATE wallet_example SET amount = amount - 30 WHERE owner = 'Ana';\nUPDATE wallet_example SET amount = amount + 30 WHERE owner = 'Bia';\nSELECT owner, amount FROM wallet_example ORDER BY owner;\nROLLBACK;\nSELECT owner, amount FROM wallet_example ORDER BY owner;",
                "output": "During transaction: Ana 70, Bia 70\nAfter ROLLBACK: Ana 100, Bia 40"
            },
            {
                "id": "commit",
                "title": "Commit the same transfer in a separate session",
                "body": "Run the next file as a new psql invocation. It creates a fresh TEMP table with the same starting balances, then performs the same two updates and COMMIT instead of ROLLBACK. The final SELECT in that session shows 70 for Ana and 70 for Bia: both operations were kept.\n\nThe TEMP table will still disappear when this session closes. That is not a failure of COMMIT; the lifetime of a TEMP table is a different rule. To prove durability across connections, you must use a persistent table and controlled recovery test. The later Steward transaction lab creates a durable Service record and checks it from another session.\n\nOne successful transfer is not proof that every possible transaction is correct. You still need to ensure the right accounts, amounts and domain rules were selected. SQL can atomically commit the wrong business operation.",
                "language": "sql",
                "caption": "wallet_commit.sql — commit both transfer updates",
                "code": "CREATE TEMP TABLE wallet_example (\n  owner text PRIMARY KEY,\n  amount integer NOT NULL CHECK (amount >= 0)\n);\nINSERT INTO wallet_example VALUES ('Ana', 100), ('Bia', 40);\nBEGIN;\nUPDATE wallet_example SET amount = amount - 30 WHERE owner = 'Ana';\nUPDATE wallet_example SET amount = amount + 30 WHERE owner = 'Bia';\nCOMMIT;\nSELECT owner, amount FROM wallet_example ORDER BY owner;",
                "output": "After COMMIT: Ana 70, Bia 70"
            },
            {
                "id": "acid",
                "title": "What do the four ACID letters actually guarantee?",
                "body": "Atomicity means the transaction's changes commit as a unit or are rolled back, rather than leaving a partial set of its writes. Consistency means declared database rules—such as NOT NULL, CHECK and FOREIGN KEY—are enforced during transaction processing; it does not prove that every business requirement was correctly modeled.\n\nIsolation concerns what concurrent sessions can observe and whether their overlapping operations can interfere. Different isolation levels have different guarantees; the later two-session lesson shows them rather than reducing isolation to a slogan. Durability means changes to persistent data that are acknowledged as committed are protected according to PostgreSQL's storage and crash-recovery guarantees, assuming a correctly configured and functioning environment.\n\nOur two TEMP-table examples demonstrate transactional COMMIT/ROLLBACK behavior but do not establish persistent durability or independent concurrent visibility. Those require other tests. Treat each ACID claim as a specific mechanism with evidence, not as a word to memorize."
            },
            {
                "id": "practice-question",
                "title": "What could still go wrong even with a transaction?",
                "body": "Suppose Ana has only 10 units but the transfer asks for 30. Our CHECK (amount >= 0) would reject a negative balance. That is a database-enforced integrity rule, but it is only as good as the declared model. Without the CHECK, a perfectly atomic transfer could still produce an invalid negative balance.\n\nNow suppose the programmer debits the wrong person. Both updates could commit successfully, preserving the total balance while violating the real request. Transactions cannot infer human intent. You must still choose correct predicates and verify affected rows.\n\nIn your notes, identify the beginning and end of each transaction and state what is visible after the rollback and after the commit. The next lesson explains what happens if one statement fails inside an open transaction and how SAVEPOINT can recover one part of the work."
            }
        ],
        "warning": "Use invented values in a disposable learning database. This TEMP-table experiment cannot prove crash durability or real banking transfer correctness.",
        "assignment": [
            "Predict each SELECT result in the rollback script before execution.",
            "Run both published files in separate sessions and compare the final balances.",
            "Explain what autocommit would do if two updates were executed as separate statements without BEGIN.",
            "Define the four ACID properties with one concrete example and one limitation.",
            "Explain why atomic changes can still violate an unstated business rule."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Transactions",
                "url": "https://www.postgresql.org/docs/17/tutorial-transactions.html",
                "kind": "reference",
                "purpose": "Official introduction to transaction atomicity and isolation of intermediate state."
            },
            {
                "title": "PostgreSQL 17 — BEGIN",
                "url": "https://www.postgresql.org/docs/17/sql-begin.html",
                "kind": "reference",
                "purpose": "Reference transaction boundary and default autocommit behavior."
            },
            {
                "title": "PostgreSQL 17 — psql command option",
                "url": "https://www.postgresql.org/docs/17/app-psql.html",
                "kind": "reference",
                "purpose": "Explain why one -c string and -f input are not interchangeable for a multi-statement rollback example."
            }
        ],
        "practiceObjective": "Execute rollback and commit with two related updates in one isolated PostgreSQL session.",
        "practiceInstructions": [
            "Use separate one-session files for ROLLBACK and COMMIT, each on a disposable TEMP table.",
            "Capture both before/after states and explain which changes persisted within each session.",
            "Identify the limits of TEMP-table evidence for ACID durability.",
            "Predict one domain failure that atomicity alone cannot prevent."
        ],
        "knowledgeCheck": "How do BEGIN, COMMIT and ROLLBACK differ? Without BEGIN, what happens to individual statements by default? Why is a TEMP table not proof of persistent durability? Can a transaction commit the wrong business choice?",
        "readingTitle": "Understand transactions and ACID",
        "practiceTitle": "Commit and roll back two changes",
        "checkTitle": "Check transaction boundaries",
        "practiceScenario": "Learn transaction mechanics with fictional, disposable balances; Steward practicals come after this foundation.",
        "practiceDeliverables": [
            "Rollback transcript and expected balance",
            "Commit transcript",
            "ACID evidence and limitations"
        ],
        "practiceCompletionCriteria": [
            "Each multi-statement experiment runs in one session.",
            "The rollback discards both updates and commit retains both within the session.",
            "The learner distinguishes atomicity from business correctness and durability."
        ]
    },
    {
        "id": "postgresql-savepoints",
        "title": "Recover from a Failed Statement with SAVEPOINT",
        "introduction": "What if the first part of a transaction is correct but a later statement fails? PostgreSQL puts an open transaction into a failed state after an SQL error. SAVEPOINT gives you a named point to return to so you can recover a portion of the work instead of abandoning the whole transaction. We will practice this deliberately before encountering it in the applied Steward transaction lab.",
        "outcomes": [
            "Explain why an error aborts the current PostgreSQL transaction until recovery.",
            "Create a SAVEPOINT and roll back to it.",
            "Distinguish ROLLBACK TO SAVEPOINT from a full ROLLBACK.",
            "Execute a controlled failed CHECK constraint and then complete the remaining valid update."
        ],
        "sections": [
            {
                "id": "error-state",
                "title": "What happens after an error inside BEGIN?",
                "body": "PostgreSQL does not simply ignore a constraint violation inside an explicit transaction. If a statement fails, subsequent ordinary statements in that transaction cannot proceed until the transaction is rolled back or the failed part is recovered through a suitable savepoint. psql may display \"current transaction is aborted, commands ignored until end of transaction block.\"\n\nThis is different from a failure to connect to PostgreSQL or a SQL error in a separate autocommitted statement. Here the connection still exists, but the transaction has entered an error state. Trying to issue another UPDATE without repairing the state will not quietly continue.\n\nWe need to distinguish an unexpected production failure, which should usually stop a script, from a deliberately controlled teaching error. The next exercise intentionally violates a CHECK rule in a disposable TEMP table; it must not be copied into a real financial or shared database."
            },
            {
                "id": "savepoint-meaning",
                "title": "What does a SAVEPOINT keep?",
                "body": "A SAVEPOINT creates a named location inside an existing transaction. ROLLBACK TO SAVEPOINT returns database changes to that point but leaves the surrounding transaction open. Full ROLLBACK abandons the entire transaction. You can then continue with valid statements and COMMIT the remaining work.\n\nThe mechanism is not a second independent transaction and does not commit anything by itself. It is useful when a batch has a sub-operation that may fail and the application knows exactly how to recover. If an error violates a fundamental business assumption, automatically continuing from a savepoint may conceal a defect. Choose recovery policy deliberately.\n\nOur example tracks one fictional stock quantity. The CHECK rule refuses negative stock. We will attempt -1 on purpose, roll back to a savepoint and then set the quantity to a valid 4 before committing."
            },
            {
                "id": "exercise",
                "title": "Prove the failure and a scoped recovery",
                "body": "Save the SQL below as stock_savepoint.sql and execute it in one psql session. This is a special negative exercise: use ON_ERROR_STOP=0 so psql continues reading the file after the deliberate CHECK error. For example, from your host shell with configured psql: psql -X -d tsa_library -v ON_ERROR_STOP=0 -f stock_savepoint.sql. If using Docker, pipe the file to docker exec -i tsa-pg-lesson psql -X -U tsa_learner -d tsa_library -v ON_ERROR_STOP=0. Do not use this continuation setting for ordinary migrations.\n\nThe first UPDATE tries to set qty=-1 and PostgreSQL reports a CHECK violation. ROLLBACK TO SAVEPOINT undoes the failed sub-operation and clears the transaction's failed state. The subsequent valid UPDATE sets qty=4, COMMIT completes the transaction and the final SELECT shows Apples|4.\n\nNotice the difference between the *expected stderr error* and the *successful recovered final state*. Both are required evidence.",
                "language": "sql",
                "caption": "stock_savepoint.sql — recover after an expected CHECK error",
                "code": "CREATE TEMP TABLE stock_demo (\n  item text PRIMARY KEY,\n  qty integer NOT NULL CHECK (qty >= 0)\n);\nINSERT INTO stock_demo VALUES ('Apples', 5);\nBEGIN;\nSAVEPOINT before_bad_update;\nUPDATE stock_demo SET qty = -1 WHERE item = 'Apples';\nROLLBACK TO SAVEPOINT before_bad_update;\nUPDATE stock_demo SET qty = 4 WHERE item = 'Apples';\nCOMMIT;\nSELECT item, qty FROM stock_demo;",
                "output": "Expected stderr: violates check constraint\nExpected final query: Apples|4"
            },
            {
                "id": "failure-contrast",
                "title": "What if you do not roll back to the savepoint?",
                "body": "Imagine the same sequence without ROLLBACK TO SAVEPOINT. Once the invalid UPDATE fails, the following UPDATE would be rejected because the transaction is aborted. A COMMIT attempt on an aborted transaction effectively rolls it back; you do not get the intended qty=4. You can predict this without running an unguarded script against shared tables.\n\nContrast that with a full ROLLBACK after the error: the transaction would end and the original 5 would be restored in its temporary table. The savepoint solution is useful only because the programmer explicitly chose to keep the earlier valid part of the surrounding transaction.\n\nThe lesson here is not \"always recover and commit.\" It is \"know whether the current state permits continuing, and choose deliberately what portion of work is safe to retain.\" In production, an unexpected CHECK error may signal a broken assumption that requires stopping rather than recovery."
            },
            {
                "id": "new-task",
                "title": "Explain a nested operation with a clear policy",
                "body": "Suppose you are importing several independent, optional catalogue tags inside a larger book import. Some tag might violate a uniqueness rule. A savepoint could allow you to skip exactly that optional tag and continue, provided the overall operation's acceptance criteria permit it. If the book itself fails to insert, however, the whole transaction may need to be abandoned.\n\nWrite down which data changes occurred before the savepoint, which failed, which are retained after recovery and which become visible after COMMIT. Do not assume a savepoint creates a durable checkpoint on disk or makes other sessions see partially committed changes.\n\nThe applied Steward transaction lesson now builds on this mechanism. There, the business invariant determines whether recovery is appropriate at all."
            }
        ],
        "warning": "Use ON_ERROR_STOP=0 only for this deliberate disposable failure test; normal automated migration and release scripts should stop on unexpected SQL errors.",
        "assignment": [
            "Run the published savepoint file, capturing both the CHECK error and the final Apples|4 output.",
            "Explain transaction state immediately after the failed UPDATE.",
            "Contrast ROLLBACK TO SAVEPOINT with full ROLLBACK.",
            "Predict the outcome if the savepoint rollback line were removed.",
            "Describe one optional sub-operation where continuing after an error would be legitimate and one where it would be unsafe."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — SAVEPOINT",
                "url": "https://www.postgresql.org/docs/17/sql-savepoint.html",
                "kind": "reference",
                "purpose": "Explain savepoint lifetime and rollback semantics."
            },
            {
                "title": "PostgreSQL 17 — ROLLBACK TO SAVEPOINT",
                "url": "https://www.postgresql.org/docs/17/sql-rollback-to.html",
                "kind": "reference",
                "purpose": "Explain recovery of failed subtransactions."
            }
        ],
        "practiceObjective": "Demonstrate and explain a recoverable SQL error in one explicit transaction.",
        "practiceInstructions": [
            "Run the isolated stock script with deliberate ON_ERROR_STOP=0.",
            "Capture the server CHECK error, ROLLBACK TO SAVEPOINT, COMMIT and resulting quantity.",
            "Explain the failure that would occur if recovery were omitted.",
            "State why a real unexpected SQL error should normally stop the release."
        ],
        "knowledgeCheck": "After a constraint violation inside BEGIN, can you simply issue another UPDATE? How does ROLLBACK TO SAVEPOINT differ from full ROLLBACK? When should you refuse to continue?",
        "readingTitle": "Understand savepoints and transaction errors",
        "practiceTitle": "Recover an intentionally failed transaction step",
        "checkTitle": "Check failure recovery",
        "practiceScenario": "Use a disposable stock table to learn savepoints; reserve Steward business decisions for the applied practical.",
        "practiceDeliverables": [
            "CHECK error and recovery transcript",
            "Final valid stock value",
            "Explicit explanation of recover-versus-abort policy"
        ],
        "practiceCompletionCriteria": [
            "The failure and successful recovery were both observed.",
            "The learner understands which state the savepoint restores.",
            "No production or shared data was touched."
        ]
    },
    {
        "id": "transactions-acid",
        "title": "Steward Practice: Transactions and ACID",
        "introduction": "You have already learned how a transaction groups SQL changes, the meanings of BEGIN, COMMIT and ROLLBACK, and how SAVEPOINT recovers a controlled error. Now apply those mechanisms to a Steward Service and its production Environment. The task is to prove a real multi-table business invariant with positive and negative outcomes; this is not the first lesson that defines transaction commands.",
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
        "id": "production-readiness-invariant",
        "title": "Steward Practice: Verify Production Readiness",
        "introduction": "This applied case comes after the transaction and concurrency lessons. The domain's production lifecycle stage and its production Environment are separate facts; a foreign key alone cannot guarantee their required relationship. Use the earlier SQL and rollback mechanisms to detect the missing relationship, demonstrate a reversible repair and explain what the application must protect.",
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
        "id": "postgresql-constraints-basics",
        "title": "How PostgreSQL Prevents Invalid Data",
        "introduction": "A data type tells PostgreSQL whether a value is text, a number or something else. It cannot express every rule that makes a record valid. Constraints are rules enforced by the database server on every INSERT or UPDATE, regardless of which client sends the SQL. We will examine the five foundational types using a small course catalogue.",
        "outcomes": [
            "Explain PRIMARY KEY, UNIQUE, NOT NULL, CHECK and FOREIGN KEY in distinct terms.",
            "Predict a rule violation before executing the SQL.",
            "Distinguish column types from constraints and from business rules outside one row.",
            "Verify that four rejected inserts do not modify valid data."
        ],
        "sections": [
            {
                "id": "types-vs-rules",
                "title": "A type is not a complete validity rule",
                "body": "An integer is a valid type for a class size, but a negative class size makes no sense. Text is a valid type for a course title, but a missing title may be unacceptable. A column's data type limits representation; a constraint enforces a declared rule about acceptable values or relationships.\n\nThe database server checks constraints independently of your UI or application code. If a Python API validates a field but another program writes directly through psql, PostgreSQL still enforces the table rules. Conversely, a rule not declared in the database cannot be assumed to exist simply because your application normally checks it.\n\nOur example has advisors and courses. Each course has a code, title, advisor reference and available seats. The advisor and course tables are temporary and contain only fictional data. This lets us test failures without changing library.books or the later Steward practice fixture."
            },
            {
                "id": "five-constraints",
                "title": "What each constraint means",
                "body": "PRIMARY KEY uniquely identifies one row and rejects NULLs. We use a course code as the primary key in the small example; other designs could use generated numeric IDs. UNIQUE prevents two rows from using the same declared value or combination of values. By default PostgreSQL UNIQUE allows multiple NULL values, which is why it is not a substitute for NOT NULL.\n\nNOT NULL requires a value to be present. It does not reject an empty text string by itself. CHECK evaluates a Boolean condition, for example seats >= 0. SQL CHECK rejects FALSE, but UNKNOWN from NULL passes; combine with NOT NULL when absence is invalid. FOREIGN KEY requires a referencing value to correspond to an eligible row in another table: a course with advisor_id 999 is rejected if no such advisor exists.\n\nA constraint is a precise technical promise. It cannot by itself guarantee that the chosen advisor was the *right* advisor or that the seat count reflects real-world occupancy."
            },
            {
                "id": "create-example",
                "title": "Create two tables with meaningful rules",
                "body": "Run the complete SQL block in one psql session connected to tsa_library. The first TEMP table defines advisors, with id as its primary key. The second defines courses, with a primary course code, required unique title, nonnegative seat count and required advisor_id. REFERENCES advisor_example(id) is the foreign-key rule.\n\nAn INSERT adds fictional advisor Ana with id 1, then one valid course DB101 with 30 seats. The final SELECT returns DB101|1|30. Every part matters: the key names identify records, CHECK prevents negative seats, and the foreign key ensures advisor_id points to a real advisor. The example uses a tiny lab; in a mature university schema a title may not truly be unique, and that domain rule would need reconsideration.\n\nThe TEMP tables are visible only in the creating session. The next negative test creates its own fresh tables to avoid assuming that the original client is still open.",
                "caption": "constraints_lab_valid.sql — create two constrained course tables",
                "language": "sql",
                "code": "CREATE TEMP TABLE advisor_example (\n  id integer PRIMARY KEY,\n  name text NOT NULL\n);\nINSERT INTO advisor_example VALUES (1, 'Ana');\nCREATE TEMP TABLE course_example (\n  code text PRIMARY KEY,\n  title text NOT NULL UNIQUE,\n  advisor_id integer NOT NULL REFERENCES advisor_example(id),\n  seats integer NOT NULL CHECK (seats >= 0)\n);\nINSERT INTO course_example VALUES ('DB101', 'Databases', 1, 30);\nSELECT code, advisor_id, seats FROM course_example ORDER BY code;",
                "output": "DB101|1|30"
            },
            {
                "id": "four-failures",
                "title": "Watch four different invalid writes fail",
                "body": "The next complete file repeats the safe table setup, then deliberately attempts four invalid inserts: (1) duplicate DB101 violates the primary key; (2) advisor_id 999 has no matching parent row and violates the foreign key; (3) seats -1 violates CHECK; and (4) a NULL title violates NOT NULL. Each has a different cause, even though all are rejected by the same database server.\n\nSave the published code as constraints_lab_failures.sql and run it only in your disposable lab with ON_ERROR_STOP=0 to observe all four expected failures in one process. Ordinary release scripts should use ON_ERROR_STOP=1 to stop at the first unexpected error. The final SELECT count(*) must still report exactly one valid course. That unchanged count is evidence that the rejected statements did not insert partial rows.\n\nDo not try each invalid INSERT in a separate psql process unless you also recreate the TEMP tables. They belong to one session.",
                "caption": "constraints_lab_failures.sql — four independent constraint errors",
                "language": "sql",
                "code": "CREATE TEMP TABLE advisor_example (id integer PRIMARY KEY, name text NOT NULL);\nINSERT INTO advisor_example VALUES (1, 'Ana');\nCREATE TEMP TABLE course_example (\n  code text PRIMARY KEY,\n  title text NOT NULL UNIQUE,\n  advisor_id integer NOT NULL REFERENCES advisor_example(id),\n  seats integer NOT NULL CHECK (seats >= 0)\n);\nINSERT INTO course_example VALUES ('DB101', 'Databases', 1, 30);\nINSERT INTO course_example VALUES ('DB101', 'Duplicate', 1, 5);\nINSERT INTO course_example VALUES ('ORPHAN', 'Missing Advisor', 999, 5);\nINSERT INTO course_example VALUES ('NEGATIVE', 'Negative Seats', 1, -1);\nINSERT INTO course_example VALUES ('NO-TITLE', NULL, 1, 5);\nSELECT count(*) FROM course_example;",
                "output": "Expected stderr: duplicate key, foreign key, CHECK, NOT NULL\nFinal valid row count: 1"
            },
            {
                "id": "rules-limits",
                "title": "What constraints do not automatically guarantee",
                "body": "A CHECK condition ordinarily applies to the row being inserted or updated. It is not a general-purpose way to assert arbitrary facts about other tables. For example, \"every production Service must have a production Environment\" is a cross-table business rule; a normal foreign key can require that a referenced Environment exists in one direction, but cannot necessarily enforce that a required child row exists in every relevant state.\n\nConstraints also depend on correct modeling. Declaring a course title UNIQUE may be too restrictive if different courses legitimately share a title. Declaring an advisor foreign key does not prove the assignment matches university policy. Business stakeholders still need to state which facts and relationships must hold.\n\nThe later Steward constraint lab applies these distinctions to real Service requirements and inspects what the database actually enforces. It should not be the learner's first encounter with the meanings of these five constraints."
            },
            {
                "id": "transfer",
                "title": "Design constraints for another domain",
                "body": "Imagine a library loan table with loan_id, book_id, borrower_id and due_date. Which column should identify a loan? Which references need foreign keys? Is due_date allowed to be NULL? Can one borrower have several loans? Avoid automatically declaring borrower_id UNIQUE, because doing so would prevent multiple loans even when that is legitimate.\n\nFor each proposed constraint, write the invalid row it must reject and the legitimate row it must allow. This is stronger than merely adding keywords to CREATE TABLE. The next lesson asks a separate question: what happens if you try to delete a parent row that still has dependent rows?"
            }
        ],
        "warning": "Run deliberate failing inserts only on disposable TEMP tables. ON_ERROR_STOP=0 is for observing the controlled errors, not for ordinary deployment scripts.",
        "assignment": [
            "Explain each foundational constraint using a different example.",
            "Run the valid lab and inspect the one course.",
            "Run the four-failure script and classify each PostgreSQL error.",
            "Verify the course count remains one despite the rejected rows.",
            "Choose constraints for an independent loan table and identify one rule needing application-level enforcement."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Constraints",
                "url": "https://www.postgresql.org/docs/17/ddl-constraints.html",
                "kind": "reference",
                "purpose": "Define all five constraints, NULL semantics and cross-table CHECK limitations."
            }
        ],
        "practiceObjective": "Observe how PostgreSQL rejects invalid records independently of the client.",
        "practiceInstructions": [
            "Run the valid disposable advisor/course example.",
            "Run the full controlled failure script with ON_ERROR_STOP=0 and capture distinct errors.",
            "Verify the count of valid rows and explain why a partial invalid row was not added.",
            "Design a different table with intentional constraints and one clear negative case."
        ],
        "knowledgeCheck": "How does PRIMARY KEY differ from UNIQUE? Does CHECK(seats >= 0) forbid NULL? Why does a FOREIGN KEY reject advisor_id=999? What rule cannot be captured simply by copying a column's type?",
        "readingTitle": "Learn primary, unique, check and foreign key rules",
        "practiceTitle": "Test four constraint violations",
        "checkTitle": "Check database integrity",
        "practiceScenario": "Use fictional course records to learn data integrity before verifying Steward business rules.",
        "practiceDeliverables": [
            "Constrained temporary table definitions",
            "Four distinct errors and unchanged count",
            "Independent domain rules"
        ],
        "practiceCompletionCriteria": [
            "Each error is correctly attributed to the enforced rule.",
            "Valid data remains after rejected writes.",
            "The learner distinguishes technical constraints from unstated domain assumptions."
        ]
    },
    {
        "id": "postgresql-foreign-key-deletes",
        "title": "What Happens When You Delete a Referenced Row?",
        "introduction": "Foreign keys protect relationships, but what should happen when a parent record is deleted? PostgreSQL supports different ON DELETE actions. We will contrast the default protection of a referenced advisor with an explicit cascading deletion, using fresh temporary tables instead of real university or Steward data.",
        "outcomes": [
            "Explain parent and referencing child rows.",
            "Observe a foreign-key rejection when a referenced parent is deleted.",
            "Demonstrate deliberate ON DELETE CASCADE and its consequences.",
            "Choose a delete policy from domain requirements instead of convenience."
        ],
        "sections": [
            {
                "id": "parent-child",
                "title": "What is a referenced parent row?",
                "body": "An advisor record may be referenced by several course rows. The advisor is the parent of those references; each course containing advisor_id is a referencing child. The foreign key protects the relationship by preventing a child from pointing to a nonexistent parent.\n\nWhen you delete a parent, PostgreSQL must decide what to do with any remaining children. Under the default NO ACTION behavior, deleting a still-referenced parent is rejected when the constraint is checked, unless the required relationship has been repaired first. A DEFERRABLE constraint can change when that check happens; we use the ordinary immediate default here.\n\nThis protection is not a nuisance to bypass blindly. If a course must always have an advisor, refusing deletion preserves the declared rule. In a real university you might first reassign the courses, mark the advisor inactive, or ask for an approved data-retention process."
            },
            {
                "id": "default-rejection",
                "title": "Observe the default foreign-key protection",
                "body": "The SQL file below creates two TEMP tables and one parent and child. It then tries to DELETE advisor id 1 while course DB101 still references it. PostgreSQL rejects the parent deletion. The following SELECT proves that the advisor is still present.\n\nUse ON_ERROR_STOP=0 only to collect this expected negative result. The error is not a connection failure and not a syntax error; the server is enforcing a relationship that was declared in CREATE TABLE. We deliberately do not drop anything to resolve the failure. The tables disappear when the psql session ends.\n\nMake sure the test is executed as one SQL file in one session, otherwise the TEMP parent might not exist when you create the child.",
                "caption": "fk_delete_restrict.sql — referenced parent cannot be deleted",
                "language": "sql",
                "code": "CREATE TEMP TABLE advisor_restrict (id integer PRIMARY KEY, name text NOT NULL);\nCREATE TEMP TABLE course_restrict (\n  code text PRIMARY KEY,\n  advisor_id integer NOT NULL REFERENCES advisor_restrict(id)\n);\nINSERT INTO advisor_restrict VALUES (1, 'Ana');\nINSERT INTO course_restrict VALUES ('DB101', 1);\nDELETE FROM advisor_restrict WHERE id = 1;\nSELECT count(*) FROM advisor_restrict;",
                "output": "Expected stderr: violates foreign key constraint\nAdvisor count after failed delete: 1"
            },
            {
                "id": "cascade",
                "title": "What does ON DELETE CASCADE actually do?",
                "body": "Cascading deletion is a different deliberate rule. ON DELETE CASCADE tells PostgreSQL to remove referencing child rows automatically when their parent is deleted. The next disposable example uses advisor_cascade and course_cascade so it cannot collide with the restrictive tables.\n\nAfter inserting one parent and one child, DELETE FROM advisor_cascade WHERE id=1; removes the advisor. PostgreSQL also removes the related course as instructed by the foreign-key action. The final child count is zero. It would be dangerous to choose CASCADE merely because the default foreign-key restriction blocked a task: deleting one parent may silently remove many related child records.\n\nUse cascade only when children truly have no independent existence without the parent, such as certain join-table memberships. In other domains, reassigning, soft-deleting or preserving history may be more appropriate.",
                "caption": "fk_delete_cascade.sql — child removed with deleted parent",
                "language": "sql",
                "code": "CREATE TEMP TABLE advisor_cascade (id integer PRIMARY KEY, name text NOT NULL);\nCREATE TEMP TABLE course_cascade (\n  code text PRIMARY KEY,\n  advisor_id integer NOT NULL REFERENCES advisor_cascade(id) ON DELETE CASCADE\n);\nINSERT INTO advisor_cascade VALUES (1, 'Ana');\nINSERT INTO course_cascade VALUES ('DB101', 1);\nDELETE FROM advisor_cascade WHERE id = 1;\nSELECT count(*) FROM course_cascade;",
                "output": "DELETE 1\nRemaining courses: 0"
            },
            {
                "id": "set-null",
                "title": "What about SET NULL and SET DEFAULT?",
                "body": "Another foreign-key action is ON DELETE SET NULL: when the parent is deleted, the referencing column becomes NULL. That can make sense when a child may legitimately exist without an assigned parent. But if that column is also NOT NULL, the action conflicts with the rule and the deletion can fail. The schema must express the actual domain rather than combine incompatible constraints.\n\nON DELETE SET DEFAULT replaces the reference with its declared default, but that default must also satisfy the foreign-key relation unless it is NULL and allowed. NO ACTION and RESTRICT are often similar but differ around deferrable constraint timing; do not flatten those details into a claim that all delete policies are identical.\n\nThe action is attached to a particular FOREIGN KEY definition, not a setting for every table in the database. Different relationships can have different policies based on data ownership and history requirements."
            },
            {
                "id": "decision",
                "title": "Choose a deletion rule based on the meaning of the data",
                "body": "Ask what the child row represents before choosing an action. A join table recording a temporary membership may be safe to cascade when the parent membership is removed. A payment or audit record often must survive even after a customer account is closed; cascading it could violate retention and accountability requirements. An active course may need reassignment rather than deletion when an advisor leaves.\n\nWrite the expected post-delete state for each relationship: parent present or absent, child present or absent, foreign-key value changed or unchanged, and any history retained. Only then choose a PostgreSQL action. A command that executes successfully but deletes required evidence is an engineering failure.\n\nThe next Steward lab uses explicit domain constraints and tests to decide which operations are actually acceptable. Having witnessed both default rejection and cascade, you can evaluate that policy without guessing."
            }
        ],
        "warning": "Cascading foreign keys can delete many dependent rows. Never use ON DELETE CASCADE merely to bypass a rejected parent deletion.",
        "assignment": [
            "Execute the restrictive relationship test, capture the error and verify the advisor remains.",
            "Execute the cascading relationship test and verify its course disappears.",
            "Explain why ON DELETE SET NULL requires a nullable foreign-key column.",
            "Design deletion policies for a membership table versus a financial audit table.",
            "State how the expected child-row lifecycle informs the schema."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Foreign Keys",
                "url": "https://www.postgresql.org/docs/17/ddl-constraints.html#DDL-CONSTRAINTS-FK",
                "kind": "reference",
                "purpose": "Authoritative parent/child and ON DELETE action semantics."
            }
        ],
        "practiceObjective": "Observe restrictive and cascading foreign-key deletion in separate disposable sessions.",
        "practiceInstructions": [
            "Run the NO ACTION example and record the rejected parent DELETE.",
            "Run the ON DELETE CASCADE example and verify child rows disappear.",
            "Contrast the outcomes with one hypothetical SET NULL policy.",
            "Explain which behavior would be appropriate for a second domain."
        ],
        "knowledgeCheck": "What happens when a referenced parent is deleted with the default action? Does CASCADE delete the child automatically? Why can SET NULL conflict with NOT NULL? Who should decide which policy is correct?",
        "readingTitle": "Learn foreign key deletion behavior",
        "practiceTitle": "Compare protected and cascading deletes",
        "checkTitle": "Check delete actions",
        "practiceScenario": "Test generic advisor/course relationships before choosing Steward ownership rules.",
        "practiceDeliverables": [
            "Expected parent delete failure",
            "Cascading delete and missing child evidence",
            "Deletion policy for a different domain"
        ],
        "practiceCompletionCriteria": [
            "Both outcomes are observed in disposable tables.",
            "No real application records are deleted.",
            "The learner chooses delete semantics from domain requirements."
        ]
    },
    {
        "id": "constraints-keys",
        "title": "Steward Practice: Enforce Data Constraints",
        "introduction": "You have already learned PRIMARY KEY, UNIQUE, NOT NULL, CHECK, FOREIGN KEY and the consequences of parent deletion. Apply those rules to the Steward five-Service database by inspecting declared constraints, observing rejected operations and considering a reversible schema change. The business-rule mapping is the task here; this is not where basic constraint definitions are first introduced.",
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
        "id": "postgresql-schema-design-basics",
        "title": "Design Tables from Requirements",
        "introduction": "Before building tables, you have to decide what each row means. We will design a small university-course enrollment database from ordinary questions: Which students are enrolled? Which courses exist? Which student takes which course? This is a design lesson, not a PostgreSQL syntax contest or an application-specific Steward requirement.",
        "outcomes": [
            "Derive separate tables from independent real-world facts rather than from a screen or JSON payload.",
            "Identify the primary key, foreign key and cardinality of each relationship.",
            "Choose whether missing values and repeated events are legitimate before defining constraints.",
            "Build and test a three-table design that rejects nonexistent references."
        ],
        "sections": [
            {
                "id": "facts-before-columns",
                "title": "Begin with questions the database must answer",
                "body": "Imagine a university asking three questions: Which students exist? Which courses can students take? Which students are enrolled in each course? A student's name is a fact about a student. A course title is a fact about a course. Enrollment is a separate fact connecting a particular student to a particular course. Each fact can change independently: a student may change their name, a course may be renamed, and enrollment may be added or removed.\n\nIf you put student_name, course_title and every enrollment into one repeating spreadsheet, changing a course title means changing multiple rows. If you store one comma-separated list of course IDs inside the student row, you make individual enrollments hard to validate or query. The fact that a webpage displays all this information together does not mean it belongs in one table.\n\nWrite a sentence for every proposed table: Student represents one enrolled or prospective learner; Course represents one course; Enrollment represents one relationship between a student and a course. These row meanings are more durable than the shape of a form."
            },
            {
                "id": "choose-identities",
                "title": "Give each kind of fact a stable identity",
                "body": "A primary key identifies one row regardless of changes to descriptive attributes. A student_id distinguishes learners even when two students share a name. A course_id continues identifying the same course after its title changes. For Enrollment, the pair (student_id, course_id) can be the primary key in this simple model because we allow at most one enrollment per student/course pair.\n\nThat last rule is a deliberate assumption. If the university allows the same learner to repeat a course next year, the pair is no longer sufficient. We might include an academic_term identifier in the key or give each enrollment event its own identity. Database design is the act of making these policy choices explicit, not merely running CREATE TABLE."
            },
            {
                "id": "cardinality-in-plain-english",
                "title": "One-to-many and many-to-many relationships",
                "body": "One student can have several enrollments; each enrollment belongs to exactly one student. That is one-to-many from Student to Enrollment. One course can have several enrollments; each enrollment refers to one Course. That is one-to-many from Course to Enrollment. Combined, those two relationships implement a many-to-many connection between Student and Course.\n\nA foreign key column must refer to a valid row in its parent table (unless NULL is deliberately allowed). Enrollment.student_id therefore references Student.id, and Enrollment.course_id references Course.id. The database can reject a request to enroll student 999 when no such student exists. This is referential integrity; it is enforced by PostgreSQL no matter which client sends the INSERT."
            },
            {
                "id": "write-constraints",
                "title": "Choose missing values and lifecycle rules",
                "body": "Suppose the date of enrollment is mandatory, but the student's eventual grade is not yet known. Then enrolled_on is NOT NULL, while grade may be NULL until assessment is complete. NULL is not the string 'unknown' and should not be used to hide a genuine data rule. A CHECK could restrict grades to allowed values, but you must decide whether incomplete, withdrawn or failed courses need additional states before declaring that rule.\n\nForeign-key actions on deletion also require thought. Should deleting a Course automatically remove historical enrollments? Usually that would erase important records. A restrictive relationship may be safer. A different design might mark a course inactive rather than deleting it. No universal ON DELETE default captures all domains. Our first lab uses the default reference protection and keeps historical questions explicit."
            },
            {
                "id": "make-tables",
                "title": "Create a small enrollment schema you can explain",
                "body": "The following script creates three TEMP tables in one psql session; they disappear after the connection ends. It does not modify your persistent library.books table. CREATE TABLE declares Student and Course first so they exist when Enrollment references them. The primary key of Enrollment is the two-column pair, and both foreign keys are NOT NULL. After inserting two learners, two courses and three enrollments, the final SELECT uses the already-taught JOIN operation to reconstruct who takes which course.\n\nRun this as one file or one complete block inside psql connected to tsa_library. If you split it into separate terminal invocations, the temporary parent tables will be lost before later commands execute. Predict the three result rows before you run it.",
                "caption": "enrollment_schema_demo.sql — three linked tables from university requirements",
                "code": "CREATE TEMP TABLE tsa_student (id integer PRIMARY KEY, name text NOT NULL);\nCREATE TEMP TABLE tsa_course (id integer PRIMARY KEY, title text NOT NULL);\nCREATE TEMP TABLE tsa_enrollment (\n  student_id integer NOT NULL REFERENCES tsa_student(id),\n  course_id integer NOT NULL REFERENCES tsa_course(id),\n  enrolled_on date NOT NULL,\n  PRIMARY KEY (student_id, course_id)\n);\nINSERT INTO tsa_student VALUES (1,'Ana'),(2,'Beto');\nINSERT INTO tsa_course VALUES (10,'SQL'),(20,'Linux');\nINSERT INTO tsa_enrollment VALUES\n(1,10,'2026-02-01'), (1,20,'2026-02-01'), (2,10,'2026-02-02');\nSELECT st.name, c.title\nFROM tsa_enrollment e\nJOIN tsa_student st ON st.id=e.student_id\nJOIN tsa_course c ON c.id=e.course_id\nORDER BY st.name,c.title;",
                "language": "sql",
                "output": "Ana|Linux\nAna|SQL\nBeto|SQL"
            },
            {
                "id": "reject-an-orphan",
                "title": "Make PostgreSQL reject an impossible enrollment",
                "body": "In the same psql session, attempt INSERT INTO tsa_enrollment VALUES (999,10,'2026-02-03'); PostgreSQL should reject the row because student 999 does not exist. Then run SELECT count(*) FROM tsa_enrollment; and confirm it is still 3. If instead you see 'relation tsa_enrollment does not exist', you started a new session and tested temporary-table lifetime, not reference integrity.\n\nThe failure illustrates why foreign keys matter. They do not verify whether Ana attended class or whether a date is truthful; they only enforce relationships declared by the schema. A data model must distinguish what the database can guarantee from what the business process and application still need to validate."
            },
            {
                "id": "change-scenario",
                "title": "Check whether the design survives a policy change",
                "body": "Now suppose a student can take the same course again in a later academic term. Our primary key (student_id, course_id) would reject that second event even though it is legitimate under the new rule. We must modify the model: add an academic term to the key or introduce a distinct enrollment identity with a constraint appropriate to the new meaning.\n\nThis is why asking about future changes matters before implementing columns. How long must enrollment history be kept? Can a course title change? Is deleting a student allowed when grades exist? Who is the authoritative source of student identity? These questions shape keys, nullability, referential actions, history and access. In the next applied schema-design lesson you will answer equivalent questions for Steward."
            }
        ],
        "assignment": [
            "Identify three independent facts and corresponding table row meanings from the university story.",
            "Draw the two one-to-many links that implement the student/course many-to-many relationship.",
            "Execute the temporary-schema script and explain its three output rows.",
            "Try the invalid student 999 enrollment in the same session and show the count remains 3.",
            "Propose a key change for repeated enrollments across years and defend its implications."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Data Definition",
                "url": "https://www.postgresql.org/docs/17/ddl.html",
                "kind": "reference",
                "purpose": "Link table definitions, constraints and object ownership to relational facts."
            },
            {
                "title": "PostgreSQL 17 — Foreign Keys",
                "url": "https://www.postgresql.org/docs/17/ddl-constraints.html#DDL-CONSTRAINTS-FK",
                "kind": "reference",
                "purpose": "Validate references, composite keys and parent-deletion behavior."
            }
        ],
        "practiceObjective": "Derive a defensible relational structure from a new domain before applying the pattern to Steward.",
        "practiceInstructions": [
            "Draw the university Student, Course and Enrollment relationship diagram and label cardinality.",
            "Run the published temporary schema and the rejected missing-student insert in the same psql session.",
            "Explain how a repeated-course policy would change the Enrollment key.",
            "Use the same question-to-table procedure to prepare the Steward design lab."
        ],
        "knowledgeCheck": "Why is Enrollment a table rather than a comma-separated list in Student? Why must student_id reference Student? Why would a composite key fail if retaking a course is allowed?",
        "readingTitle": "Understand how to design related tables",
        "practiceTitle": "Build a university enrollment model",
        "checkTitle": "Check schema-design decisions",
        "practiceScenario": "Create and test a generic enrollment database; reserve Steward domain design for the next applied practical.",
        "practiceDeliverables": [
            "Row-meaning and cardinality diagram",
            "Three-table session transcript",
            "Foreign-key negative evidence",
            "Repeated-enrollment design revision"
        ],
        "practiceCompletionCriteria": [
            "Each table has an independently defensible fact meaning.",
            "The student 999 insert is rejected by a real FK, not a missing TEMP table.",
            "The learner can justify its key assumption and a policy-driven revision."
        ]
    },
    {
        "id": "schema-design",
        "title": "Steward Practice: Design a Service-Registry Schema",
        "introduction": "Apply the table-design method from the university example to Steward. The four-table seed covers Teams, Services, Environments and dependencies, but real ownership and service reviews have distinct relationships and lifetimes. This applied lesson models those missing facts, chooses constraints and records what historical evidence must survive updates.",
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
        "id": "postgresql-normal-forms",
        "title": "Understand First, Second and Third Normal Form",
        "introduction": "You have seen what can go wrong when a fact is copied into several rows. Database normalization gives us a precise way to identify which table should own each fact. Rather than memorize '1NF, 2NF, 3NF' as slogans, we will derive them using student and course records, identify a real update anomaly, and then reconstruct the correct answer from separate related tables.",
        "outcomes": [
            "Describe what the first three normal forms protect, with their assumptions and limitations.",
            "Explain a functional dependency and a partial dependency on a composite key.",
            "Identify a transitive dependency and give the fact its correct authoritative table.",
            "Reconstruct correct enrolment information from normalized tables without duplicating student, course or department names."
        ],
        "sections": [
            {
                "id": "what-normalization-solves",
                "title": "What problem does normalization solve?",
                "body": "Suppose one flat Enrollment spreadsheet stores student_id, student_name, course_id, course_title, department_name and grade on every row. Ana takes SQL and Linux, so her name and department appear twice. A course rename must be copied into every enrollment row. One missed update creates contradictory 'truths'. Deleting the final enrollment row for a course could accidentally delete the only recorded course title. These are update and deletion anomalies.\n\nNormalization is the process of deciding which facts belong together according to relationships among attributes. It is not a contest to maximize the number of tables. Good schema design makes facts easy to change consistently and relationships explicit. Sometimes reporting systems deliberately duplicate facts for speed or historical snapshots, but then the copies need a clear synchronization policy."
            },
            {
                "id": "first-normal-form",
                "title": "First normal form: decide what each attribute represents",
                "body": "First Normal Form (1NF) is the foundation for representing rows in a relation with named attributes drawn from domains of values, not repeating columns such as course_1, course_2, course_3. Instead of a student's courses stored as one comma-separated string, give each enrollment its own row with one student reference and one course reference. That supports arbitrary numbers of enrollments and lets PostgreSQL enforce separate foreign keys.\n\nDo not turn this lesson into the false slogan 'PostgreSQL arrays and JSON are forbidden'. PostgreSQL supports complex values and they can be appropriate when the value genuinely represents a single document or collection. The issue is whether you are hiding several independently updateable business facts inside one field and thereby losing relational keys, constraints and useful queries."
            },
            {
                "id": "functional-dependency",
                "title": "What does 'one attribute determines another' mean?",
                "body": "A functional dependency X → Y means that for every permitted state of the relation, two rows with the same X must also have the same Y. Under our university rules, student_id → student_name, because one ID identifies one student and their current name; course_id → course_title, because a course ID identifies a course. If a student is allowed only one grade for each student/course pair, (student_id, course_id) → grade.\n\nThe arrow is a statement about the domain's rules, not a coincidence in today’s small dataset. Two students might currently share the name Ana; that does not mean student_name determines student_id. A reliable dependency comes from the definition of an entity and its identifier. Define the keys before evaluating which non-key values belong in each table."
            },
            {
                "id": "second-normal-form",
                "title": "Second normal form: avoid facts dependent on only part of a key",
                "body": "Second Normal Form (2NF) builds on 1NF: a non-prime attribute must not depend on only a proper subset of a candidate key. In a flat enrollment table whose composite key is (student_id, course_id), the student_name depends on student_id alone, and course_title depends on course_id alone. These are partial dependencies; copying those names on every enrollment is unnecessary and vulnerable to anomalies.\n\nThe grade of a student in a particular course, on the other hand, depends on the combination of the student and course, in our simplified policy. It belongs in Enrollment. Move student_name into Student, course_title into Course and leave their IDs plus grade in Enrollment. The need for 2NF is easiest to see when a key contains multiple attributes. A table with a single-column candidate key cannot have this specific kind of partial-key dependency."
            },
            {
                "id": "third-normal-form",
                "title": "Third normal form: avoid indirect non-key dependencies",
                "body": "Suppose Student stores id, name, department_id and department_name. If department_id determines department_name, then student_id → department_id → department_name. The current department name is an authoritative fact about Department, not Student. Storing it on every student row creates another update anomaly: renaming a department requires updating every student.\n\nThird Normal Form (3NF) addresses these non-key-to-non-key dependencies, under the formal rule that for each nontrivial functional dependency X → A, X is a superkey or A is a prime attribute. In simple everyday cases the practical lesson is to place department_name in Department and store only department_id in Student. That is a teaching simplification of the formal definition, not a claim that every transitive-looking dependency violates 3NF.\n\nNormalize the current authoritative fact. A historical enrollment document may deliberately preserve the department label as it was at the time; that is a different kind of fact, not a contradictory second source of current truth."
            },
            {
                "id": "build-normalized",
                "title": "Run the corrected schema and prove one rename changes every answer",
                "body": "Create four temporary tables in one psql session: Department, Student, Course and Enrollment. A student references a department; each enrollment references a student and a course. The data provides two course enrollments for Ana, both in the Computing department. Now rename the Department once and JOIN the tables to display both course rows. The same updated name appears in both results without updating any Student or Enrollment row.\n\nThe sample is intentionally tiny. It proves the *logical ownership* of the department name, not the performance of a four-table JOIN. The later Steward normalization case uses the same idea for current Team names.",
                "caption": "normal_forms_demo.sql — normalized university tables and one department rename",
                "code": "CREATE TEMP TABLE tsa_nf_department (id integer PRIMARY KEY, name text NOT NULL);\nCREATE TEMP TABLE tsa_nf_student (id integer PRIMARY KEY, name text NOT NULL,\n  department_id integer NOT NULL REFERENCES tsa_nf_department(id));\nCREATE TEMP TABLE tsa_nf_course (id integer PRIMARY KEY, title text NOT NULL);\nCREATE TEMP TABLE tsa_nf_enrollment (\n  student_id integer NOT NULL REFERENCES tsa_nf_student(id),\n  course_id integer NOT NULL REFERENCES tsa_nf_course(id),\n  grade text,\n  PRIMARY KEY(student_id,course_id)\n);\nINSERT INTO tsa_nf_department VALUES (1,'Computing');\nINSERT INTO tsa_nf_student VALUES (1,'Ana',1);\nINSERT INTO tsa_nf_course VALUES (10,'SQL'),(20,'Linux');\nINSERT INTO tsa_nf_enrollment VALUES (1,10,'A'),(1,20,'B');\nUPDATE tsa_nf_department SET name='Computer Science' WHERE id=1;\nSELECT st.name, c.title, d.name AS department\nFROM tsa_nf_enrollment e\nJOIN tsa_nf_student st ON st.id=e.student_id\nJOIN tsa_nf_course c ON c.id=e.course_id\nJOIN tsa_nf_department d ON d.id=st.department_id\nORDER BY c.title;",
                "language": "sql",
                "output": "Ana|Linux|Computer Science\nAna|SQL|Computer Science"
            },
            {
                "id": "when-to-denormalize",
                "title": "Do normal forms mean never duplicating anything?",
                "body": "No. A derived count may be cached for a reporting workload, a materialized view may precompute an expensive query, and an audit event may preserve a historical snapshot that must not change when the current record changes. These are not all the same decision. The key questions are whether the copy represents current authoritative state or historical evidence, what synchronizes it, how stale it may become and how errors are repaired.\n\nNormalize first when you are still discovering the meaning of data. If later measurements show a genuine bottleneck, consider a measured and controlled denormalization. Do not add a dependency_count column 'for speed' without knowing which process maintains it on inserts, deletes and rollbacks. The next applied lesson tests duplicated Steward Team names and asks you to defend the authoritative source."
            }
        ],
        "assignment": [
            "Identify one 1NF concern, one 2NF partial dependency and one 3NF transitive dependency in a deliberately flat university enrollment design.",
            "Explain why grade belongs with the student/course pair rather than the Student or Course table.",
            "Run normal_forms_demo.sql and prove that one Department rename produces a consistent name across two enrollment results.",
            "Contrast current authoritative department names with historical snapshots in a course certificate.",
            "Explain one situation in which storing a derived value might be justified and what could make that copy stale."
        ],
        "resources": [
            {
                "title": "CMU 15-445/645 Database Systems — Relational Model and Normalization",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "reference",
                "purpose": "Optional formal treatment of functional dependencies and relational design."
            },
            {
                "title": "PostgreSQL 17 — Table Basics and Constraints",
                "url": "https://www.postgresql.org/docs/17/ddl.html",
                "kind": "reference",
                "purpose": "Apply normalization choices through real tables, keys and references."
            }
        ],
        "practiceObjective": "Detect partial and transitive dependencies in a flat enrollment table and test an explicit normalized reconstruction.",
        "practiceInstructions": [
            "Mark the candidate key and each functional dependency in a flattened Student–Course–Department example.",
            "Separate Student, Course, Enrollment and Department into authoritative tables.",
            "Run the published temporary SQL and show the department rename appears consistently in both results.",
            "Explain why the corresponding Steward Team-name duplication is an anomaly rather than a separate independent fact."
        ],
        "knowledgeCheck": "What fact belongs to Enrollment rather than Student? Why does student_name violate 2NF when duplicated in a table keyed by student_id and course_id? Why is department_name a 3NF concern? Can a historical snapshot legitimately repeat a label?",
        "readingTitle": "Learn what 1NF, 2NF and 3NF protect",
        "practiceTitle": "Repair a university enrollment design",
        "checkTitle": "Check functional dependencies and normal forms",
        "practiceScenario": "Learn normal forms using university data before applying them to Steward.",
        "practiceDeliverables": [
            "Dependency analysis with composite keys",
            "Normalized schema and two-row join output",
            "One justified denormalization or historical-snapshot distinction"
        ],
        "practiceCompletionCriteria": [
            "The three normal forms are explained through concrete dependencies.",
            "The learner can trace one value to its single authoritative table.",
            "The executed rename proves two consistent join results."
        ]
    },
    {
        "id": "normalization",
        "title": "Steward Practice: Repair Duplicated Team Names",
        "introduction": "You have now studied 1NF, 2NF and 3NF through independent university examples. Apply the same reasoning to an intentionally flawed Steward ownership representation: two service rows repeat a Team's name, so a partial rename creates contradictory results. The goal is to diagnose the dependency, use one authoritative Team row and justify any later denormalized copy.",
        "outcomes": [
            "Demonstrate the Steward Team-name update anomaly without altering permanent data.",
            "Trace Team.id → Team.name and Service.id → owning_team_id and explain why copying current names is risky.",
            "Join Service to its authoritative Team name and identify the trade-off.",
            "Defend a denormalization only when measured workload, synchronization and staleness policy justify it."
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
        "id": "query-plans",
        "title": "How PostgreSQL Executes a Query: Reading EXPLAIN",
        "introduction": "You already know what a SELECT query means. There is another question: how does PostgreSQL actually find and combine the rows needed to answer it? A query plan describes the physical work PostgreSQL chooses. We will learn to read a simple plan using library books before studying indexes or trying to make anything faster.",
        "outcomes": [
            "Explain the difference between the SQL result and the work chosen to produce it.",
            "Read a simple plan tree and distinguish scans, filters, joins, sorts and aggregates.",
            "Explain estimated rows, cost, actual rows, loops and buffer measurements without treating costs as milliseconds.",
            "Use EXPLAIN safely and identify when EXPLAIN ANALYZE actually executes a statement."
        ],
        "sections": [
            {
                "id": "sql-and-plan",
                "title": "SQL describes the answer; a plan describes the work",
                "body": "Consider SELECT title FROM library.books WHERE published_year >= 1950. SQL tells PostgreSQL which columns and rows you want. It does not say whether PostgreSQL must visit every row or how it should find matching records. The PostgreSQL planner considers available tables, indexes, statistics and possible algorithms and chooses an execution plan; the executor performs that plan.\n\nTwo databases can have exactly the same table definition but different row counts. In the tiny library, reading every row may be cheapest. In a very large library with a suitable index, consulting that index might save work. Both plans can return the same correct row. Query correctness and query cost are different questions.\n\nWe need to know how to observe the plan before learning which index to build. An index is not an instruction that forces the server to use it. A plan is a decision the server made for a specific query and set of conditions."
            },
            {
                "id": "first-plan",
                "title": "View a plan without running the SELECT",
                "body": "`EXPLAIN` asks PostgreSQL to show its intended plan. Without ANALYZE it does not execute the main SELECT, so it reports estimates but no measured run time for the actual query. Type the query below in tsa_library, where library.books already contains The Hobbit and Things Fall Apart. A fresh small table will often show a Seq Scan, meaning the server expects to inspect table rows directly. The exact cost numbers and chosen node can differ by database state, PostgreSQL version and configuration.\n\nThe plan may include a Filter expression: that is the condition checked for each row scanned. If a filter excludes a row, that row simply does not appear in the query result. Scan is about *how* to access candidates; WHERE is about *which* candidates qualify. Do not treat the words Seq Scan as an error message.",
                "caption": "library_explain_only.sql — estimate a book lookup without executing it",
                "code": "EXPLAIN\nSELECT title FROM library.books WHERE published_year >= 1950;",
                "language": "sql"
            },
            {
                "id": "tree-nodes",
                "title": "Read query plans as trees, not as paragraphs",
                "body": "A plan is a tree of nodes. At the bottom, scan nodes obtain rows from stored tables or other row sources. Above them, a Filter rejects rows, a Join may combine two inputs, a Sort arranges rows and an Aggregate summarizes them. The topmost node produces the final requested result. Read a tree from its leaf inputs toward its output; indentation and arrows show which node consumes the results of another.\n\nA plan can contain Seq Scan (inspect table pages), Index Scan (use an index to find candidate row locations), Bitmap Heap Scan (collect matching locations then visit the relevant heap pages), Hash Join, Merge Join, Nested Loop, Sort, Aggregate and other nodes. You do not need to memorize every node yet. When a plan contains a join, say first which rows it combines and then which algorithm the executor selected.\n\nTwo different plans can answer the same SELECT. Adding an index, changing statistics, or increasing the number of books can change the plan without changing the query's meaning."
            },
            {
                "id": "actual-versus-estimated",
                "title": "What do cost, rows, loops and time mean?",
                "body": "`EXPLAIN` typically reports estimated startup and total cost, estimated rows and average row width. The planner's cost numbers are relative units for comparing alternative plans; they are not milliseconds. The estimate of rows describes how many records the planner expects a node to emit, not necessarily how many table rows exist.\n\n`EXPLAIN (ANALYZE, BUFFERS)` actually executes the statement and reports measured timing and row counts as well as buffer-access counters. When a node runs multiple times, PostgreSQL displays actual rows averaged per loop. For a useful measure of the rows the node produced in total, multiply actual rows by loops. A node that outputs 3 rows per loop across 20 loops contributed about 60 result rows across those invocations; do not mistake the displayed 3 for the whole workload.\n\nBuffers labeled shared hit and read describe PostgreSQL's buffer activity, not a direct count of physical disk seeks. A cached page can still incur CPU work. Even a very fast lab plan is not a prediction of production latency."
            },
            {
                "id": "observe-books",
                "title": "Measure the same read-only query",
                "body": "This block first obtains a non-executing estimate, then executes the same SELECT with instrumentation, then runs a normal count query whose answer you can verify. In our two-book lab only Things Fall Apart is published in or after 1950, so the final count is one. Compare the two plans: the measured one includes actual times, rows and loops, while the first does not. The plan may use different nodes if your environment has changed; that is not a failed lesson.\n\n`ANALYZE` in EXPLAIN (ANALYZE) means 'execute this query and measure it'. That is distinct from the standalone SQL command ANALYZE table_name, which collects statistics for the planner. The difference matters because both use a similar word for different operations. Record both the actual result and the observed access path.",
                "caption": "library_explain_analyze.sql — estimate, measure and verify a book query",
                "code": "EXPLAIN SELECT title FROM library.books WHERE published_year >= 1950;\nEXPLAIN (ANALYZE, BUFFERS) SELECT title FROM library.books WHERE published_year >= 1950;\nSELECT count(*) AS matching_books FROM library.books WHERE published_year >= 1950;",
                "output": "(EXPLAIN node names and costs vary)\nExecution Time: ... ms\nmatching_books = 1",
                "language": "sql"
            },
            {
                "id": "safe-analyze",
                "title": "Why EXPLAIN ANALYZE can be dangerous",
                "body": "Never assume EXPLAIN ANALYZE is only an inspection command. Unlike plain EXPLAIN, it executes the SQL. If you use it on an UPDATE, DELETE or INSERT, the data-changing operation takes effect unless you deliberately control it with a transaction and rollback. Some external or sequence-related effects might not be undone by rolling back. In this module we use EXPLAIN ANALYZE only on harmless SELECTs in disposable data.\n\nAnother common trap is treating a single run on two books as performance evidence. Its plan teaches you where to find node names, but not whether an index is beneficial at a realistic scale. For performance decisions, use representative row counts, data distributions, parameters, repeated measurements and a specific objective. A query that is fastest on a warmed local cache may not be fastest elsewhere."
            },
            {
                "id": "applied-plan",
                "title": "Apply the same reading technique to Steward",
                "body": "The read-only query below joins Team to Service and counts related Services. It should answer the business question with the same result whether PostgreSQL chooses a Nested Loop, a Hash Join or another valid plan. Its five-row fixture is useful for learning join and aggregate nodes, not for proving scalability. Before tuning, identify what each node produces, which join condition relates the rows, and where grouping occurs. You should be able to explain the difference between the query's logical answer and the particular plan used to compute it.",
                "caption": "explain_join.sql — inspect query plan and correct grouped result",
                "code": "EXPLAIN (ANALYZE, BUFFERS)\nSELECT t.name, COUNT(s.id) AS n\nFROM team t LEFT JOIN service s ON s.owning_team_id=t.id\nGROUP BY t.id,t.name\nORDER BY t.name;",
                "language": "sql"
            }
        ],
        "assignment": [
            "Open tsa_library and predict which book matches published_year >= 1950 before executing either EXPLAIN example.",
            "Run both published EXPLAIN blocks, identify the scan node and explain the difference between estimates and measurements.",
            "Draw the plan as a small tree from its scan node to result, then identify one condition under which a different plan might be chosen.",
            "Run the Steward join plan and explain what the JOIN and grouping do independently of the chosen algorithm.",
            "Explain why EXPLAIN ANALYZE on DELETE is not a harmless way to inspect an operation."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Using EXPLAIN",
                "url": "https://www.postgresql.org/docs/17/using-explain.html",
                "kind": "reference",
                "purpose": "Precise meanings of plan nodes, estimated costs, actual rows/loops and buffers."
            },
            {
                "title": "PostgreSQL 17 — Planner Statistics",
                "url": "https://www.postgresql.org/docs/17/planner-stats.html",
                "kind": "reference",
                "purpose": "Understand how table statistics influence estimates."
            },
            {
                "title": "CMU 15-445 Fall 2025 — Query Execution and Planning",
                "url": "https://15445.courses.cs.cmu.edu/fall2025/schedule.html",
                "kind": "reference",
                "purpose": "Optional deeper course-level treatment of physical query algorithms."
            }
        ],
        "practiceObjective": "Read and explain the physical plan selected for a real SQL query before trying to optimize it.",
        "practiceInstructions": [
            "Compare ordinary EXPLAIN against EXPLAIN (ANALYZE, BUFFERS) on the harmless book query.",
            "Annotate estimated and actual row counts and explain why cost numbers are not milliseconds.",
            "Trace the Steward join/aggregation plan from scan nodes to final output.",
            "Form one falsifiable reason the plan might change on a large or skewed dataset."
        ],
        "knowledgeCheck": "Why can two physical plans return the same SQL result? What does EXPLAIN measure without ANALYZE? What does rows=3 loops=20 imply? Why must EXPLAIN ANALYZE on DELETE be treated as a real deletion?",
        "warning": "EXPLAIN ANALYZE executes its statement. Use only read-only SELECTs in this lesson; do not explain-analyze destructive SQL on real data.",
        "readingTitle": "Understand what a PostgreSQL query plan shows",
        "practiceTitle": "Read an EXPLAIN plan from bottom to top",
        "checkTitle": "Check your understanding of query plans",
        "practiceScenario": "First interpret a simple library query; then apply plan-reading to a read-only Steward report."
    },
    {
        "id": "indexes",
        "title": "What Is a Database Index, and When Does It Help?",
        "introduction": "You now know how to read a PostgreSQL query plan. We can ask a more specific question: when can an index save work compared with reading all the rows? An index adds a separate structure that helps locate or order records; it does not change what a correct SELECT returns. We will observe it on temporary book records, not make performance claims from a five-row Steward dataset.",
        "outcomes": [
            "Explain a B-tree index, a sequential scan and an index scan in plain language.",
            "Compare real pre-index and post-index query plans on disposable data.",
            "Explain why an index may not be used and why indexed results still need table-visibility checks.",
            "Distinguish an ordinary lookup index from one supporting a PRIMARY KEY or UNIQUE constraint."
        ],
        "sections": [
            {
                "id": "analogy",
                "title": "Why searching a book index differs from reading every page",
                "body": "Imagine a catalogue with 15,000 cards. To find a book with a rare catalogue number, you could examine every card until you find it. That is conceptually like a sequential scan. Alternatively, a sorted index can guide you quickly to the relevant number and point you to its card. That is conceptually like a B-tree index lookup. PostgreSQL B-trees store ordered keys and references to table rows in their own database structures. They are not Python dictionaries and they do not automatically store every column.\n\nThe book analogy has limits: the database's planner may still prefer reading the table when there are few pages or when a query requests most rows. An index lookup can involve additional pages and random access. The existence of an index does not promise PostgreSQL will use it."
            },
            {
                "id": "how-btree-works",
                "title": "What is stored in a B-tree index?",
                "body": "A B-tree index stores keys in sorted order across pages and maintains a tree of navigation pages leading to leaf entries. A search for a particular key can descend to a relevant leaf rather than inspecting all table rows. Each matching entry identifies where the corresponding table tuple can be found. For an ordinary index scan, PostgreSQL may still need to visit the table heap to retrieve non-indexed columns and check which version of a row is visible to the current transaction.\n\nThere is also an Index Only Scan optimization, but 'only' does not mean visibility is ignored. The index must cover the requested columns and PostgreSQL may consult its visibility map or the heap to establish whether rows are visible. A beginner should avoid claiming every index lookup is an entirely separate, memory-only shortcut.\n\nThe index itself occupies space and must be maintained when relevant row values change. We will measure access paths first and then discuss maintenance costs in a dedicated follow-up lesson."
            },
            {
                "id": "five-rows",
                "title": "A tiny table can be faster without an index",
                "body": "The canonical Steward seed has only five Services. Some columns are indexed through PRIMARY KEY or UNIQUE constraints. Running EXPLAIN on that data may show either Seq Scan or Index Scan, depending on PostgreSQL's estimates and configuration. A sequential scan of a tiny table is often reasonable; there is very little data to read, and opening an index could cost extra work. Neither outcome is a universal rule.\n\nUse the source query below only to practice interpreting its plan. Do not interpret one microsecond-scale run as proof that an index should be added or removed in production. The next scratch experiment creates many more records without changing Steward's persistent schema.",
                "caption": "index_small.sql — inspect an already indexed unique Service name",
                "code": "EXPLAIN SELECT id,name FROM service WHERE name='Payments API';",
                "language": "sql"
            },
            {
                "id": "scratch-table",
                "title": "Build a larger scratch table and predict the result",
                "body": "PostgreSQL's generate_series(1,15000) produces each integer from 1 through 15000. The expression 'book-' || lpad(n::text,5,'0') constructs a catalogue code such as book-00001 or book-14999. The TEMP table created below is disposable and vanishes when the psql connection closes. The final predicate identifies exactly one generated row: book-14999.\n\nFirst create the table with no slug index, run standalone ANALYZE to collect table statistics, then observe EXPLAIN (ANALYZE, BUFFERS) for the selective lookup. Next CREATE INDEX on slug, collect statistics again and run the same query. The record returned is unchanged, but the planner may choose a different physical route. Do not confuse standalone ANALYZE (collect statistics) with EXPLAIN ANALYZE (run and measure a query).",
                "caption": "index_lab.sql — compare actual physical plans on 15000 temporary rows",
                "code": "CREATE TEMP TABLE tsa_index_probe AS\nSELECT n AS id, 'book-' || lpad(n::text,5,'0') AS slug, (n % 4) AS priority\nFROM generate_series(1,15000) AS g(n);\nANALYZE tsa_index_probe;\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM tsa_index_probe WHERE slug='book-14999';\nCREATE INDEX tsa_probe_slug_idx ON tsa_index_probe(slug);\nANALYZE tsa_index_probe;\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM tsa_index_probe WHERE slug='book-14999';",
                "language": "sql"
            },
            {
                "id": "what-to-compare",
                "title": "Compare evidence, not just execution times",
                "body": "For each measured plan, record which scan node PostgreSQL used, how many rows it expected, how many rows it actually returned, how many rows were filtered out and which buffer counters appeared. It may use Seq Scan before the index and Index Scan after, but this is a prediction to test, not a guaranteed output. If it chooses a sequential scan even after the index exists, the correct conclusion is that the planner estimated that access path to be cheaper under those conditions. Do not force an index and declare victory from a single measurement.\n\nThe number of selected rows matters: a query matching one in 15,000 rows is very different from a query returning all 15,000. Reading every row may be cheaper than chasing thousands of pointers. Also inspect query shape: selecting a column missing from an index can require heap visits, and accessing table data at random locations can dominate. Think in terms of work saved versus additional work introduced."
            },
            {
                "id": "unique-versus-lookup",
                "title": "Does an index enforce a business rule?",
                "body": "PostgreSQL creates an index to support a PRIMARY KEY or UNIQUE constraint. That index helps enforce the rule that a key is unique, even if no query ever uses it for a lookup. By contrast, a normal CREATE INDEX on a book's published_year does not forbid duplicate publication years. It is primarily an access path, not an integrity policy.\n\nDo not add a redundant ordinary index on a primary key just because a colleague asks for 'more indexes'. Inspect existing constraints and indexes first. Keep key and integrity decisions separate from performance tuning: uniqueness reflects domain meaning, whereas a non-unique index should respond to a query workload. The next lesson covers multicolumn indexes and why index column order and write overhead matter."
            }
        ],
        "assignment": [
            "Explain in your own words why an index differs from the table rows it helps find.",
            "Run the five-row Steward EXPLAIN without treating the result as a performance benchmark.",
            "Run index_lab.sql inside one psql connection and record pre/post scan nodes, row counts and buffer activity.",
            "Explain why the same query result can be produced by two different plans.",
            "Predict whether a lookup returning 14,000 of 15,000 rows is likely to justify the same index path."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Introduction to Indexes",
                "url": "https://www.postgresql.org/docs/17/indexes-intro.html",
                "kind": "reference",
                "purpose": "Explain what an index stores and why it improves some queries."
            },
            {
                "title": "PostgreSQL 17 — Index-Only Scans",
                "url": "https://www.postgresql.org/docs/17/indexes-index-only-scans.html",
                "kind": "reference",
                "purpose": "Learn why covered columns do not eliminate all visibility checks."
            },
            {
                "title": "PostgreSQL 17 — Using EXPLAIN",
                "url": "https://www.postgresql.org/docs/17/using-explain.html",
                "kind": "reference",
                "purpose": "Interpret physical scan choices and avoid misleading timing claims."
            }
        ],
        "practiceObjective": "Measure whether a simple lookup index changes the work of one selective query.",
        "practiceInstructions": [
            "Execute the 15,000-row temporary catalogue script and compare measured plans before and after an index.",
            "Record actual result, scan node, observed row counts and memory/buffer counters.",
            "Use the tiny Steward fixture to demonstrate why data scale affects plan choice.",
            "Justify whether a real Steward slug lookup needs another index given any existing UNIQUE rule."
        ],
        "knowledgeCheck": "Why does PostgreSQL sometimes prefer Seq Scan even when an index exists? Does a normal index make values unique? Why can Index Scan still need table rows, and what does Index Only Scan require?",
        "warning": "An index changes data structures, not SQL meaning. Do not promise a speed improvement based on one synthetic run, and never alter production indexes to satisfy a teaching exercise.",
        "readingTitle": "Understand simple PostgreSQL indexes",
        "practiceTitle": "Compare a selective lookup with and without an index",
        "checkTitle": "Check index mechanisms",
        "practiceScenario": "Learn using a disposable 15,000-book catalogue, then evaluate the existing Steward key indexes."
    },
    {
        "id": "postgresql-composite-indexes",
        "title": "Multicolumn Indexes and Their Trade-offs",
        "introduction": "A single-column index helps some lookups, but real queries often filter or sort by several columns. A multicolumn B-tree indexes combinations of values in a chosen order. The most important skill is to predict which search patterns benefit from the index and which still require scanning many entries. We will use an independent 4,000-book scratch table before proposing any index for Steward.",
        "outcomes": [
            "Explain how a B-tree on (shelf_id, priority) is ordered and why column order matters.",
            "Compare a two-column equality lookup with one using only the second index column.",
            "Read query plans without assuming every eligible predicate produces Index Scan.",
            "Explain additional storage/write cost and distinguish a partial or covering index from a multicolumn key."
        ],
        "sections": [
            {
                "id": "ordered-pairs",
                "title": "How does a two-column B-tree sort its entries?",
                "body": "An index on (shelf_id, priority) is ordered first by shelf_id. Within each shelf group, entries are ordered by priority. Think of a printed catalogue organized by shelf number, then by urgency. Looking for 'shelf 3, priority 7' identifies a narrow range of the sorted entries. Looking for 'priority 7 across every shelf' does not share that left-to-right narrowing in the same simple way.\n\nThis is the leading-column principle for PostgreSQL 17 B-trees: equality constraints on leftmost columns usually let the engine bound a smaller part of the index. Constraints on later columns can still be checked, and the planner can choose alternative strategies, but they need not eliminate scanning entries for other leading-key values. The rule is about how data is sorted, not a ban on every non-leading predicate.\n\nA B-tree on (priority, shelf_id) would produce a different ordering and could serve a different workload better. Neither order is universally best."
            },
            {
                "id": "build-pairs",
                "title": "Create a scratch dataset with predictable pairs",
                "body": "The SQL block below makes 4,000 temporary rows. Each row gets a shelf_id from 0 to 9 and priority from 0 to 9. Because priority derives from a different part of the generated integer, each shelf has a mixture of priority values; the exercise is not secretly making priority a function of shelf alone. We create one multicolumn B-tree, then use two SELECT queries with EXPLAIN (ANALYZE, BUFFERS).\n\nOne predicate specifies BOTH shelf_id=3 and priority=7. The other specifies only priority=7. Before running, predict the counts: there are 40 matches for the combined condition and 400 for priority alone. The final SELECT also verifies that the index consumes storage. Execution times, node choice and buffer counts may vary.",
                "caption": "index_composite_lab.sql — compare leading and non-leading predicates on 4000 books",
                "code": "CREATE TEMP TABLE tsa_index_order_probe AS\nSELECT n AS id, (n % 10) AS shelf_id, ((n / 10) % 10) AS priority,\n       'book-' || n::text AS title\nFROM generate_series(1,4000) AS g(n);\nANALYZE tsa_index_order_probe;\nCREATE INDEX tsa_probe_shelf_priority_idx ON tsa_index_order_probe(shelf_id, priority);\nANALYZE tsa_index_order_probe;\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id FROM tsa_index_order_probe WHERE shelf_id = 3 AND priority = 7;\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id FROM tsa_index_order_probe WHERE priority = 7;\nSELECT (SELECT count(*) FROM tsa_index_order_probe WHERE shelf_id=3 AND priority=7) AS both_columns,\n       (SELECT count(*) FROM tsa_index_order_probe WHERE priority=7) AS second_column,\n       pg_relation_size('tsa_probe_shelf_priority_idx'::regclass) > 0 AS index_has_storage;",
                "output": "both_columns = 40; second_column = 400; index_has_storage = true. Plan algorithms vary.",
                "language": "sql"
            },
            {
                "id": "comparing-plans",
                "title": "Read the plans and explain what they do",
                "body": "Do not simply circle 'Index Scan' as a success. Find the plan line that describes row access for each query, any Index Cond and Filter lines, the estimated rows and actual rows, and the work reported by BUFFERS. If an Index Scan is used, determine which predicates can bound the index search and which are checked afterward. If PostgreSQL uses Seq Scan, ask whether the table is small and how many rows qualify; the optimizer is free to choose the estimated cheapest path.\n\nNotice that both queries can still return correct answers even if one plan scans more data. The index cannot make a logically wrong WHERE predicate correct. A composite index designed for one access pattern may be less effective for another query, which is why workload analysis must precede index design."
            },
            {
                "id": "partial-and-covering",
                "title": "How are partial and covering indexes different?",
                "body": "A partial index includes only rows meeting a condition specified when the index is created. For example, an index over active loans could omit already-closed loans if the application's frequent queries consistently include that same predicate. The planner must be able to reason that the query matches the index predicate; a partial index is not automatically applicable to every query.\n\nA covering index can use INCLUDE columns that are stored for return but are not part of the index's key search ordering. That can help index-only scans for some queries, subject to PostgreSQL's visibility rules and current row versions. Included columns enlarge index entries and can raise write costs. A multicolumn key and INCLUDE are different design decisions.\n\nWe do not implement either extension in this introductory lab: first understand the two-key ordering and measure a real need before adding complexity."
            },
            {
                "id": "maintenance-cost",
                "title": "Why not index every column?",
                "body": "Each additional index occupies storage. INSERT must update relevant indexes, changes to indexed values require index maintenance, and cleanup of dead index entries adds background work. More indexes can also increase the effort required to choose and maintain a good plan. A separate B-tree on every column is not an automatic substitute for a carefully chosen composite index.\n\nBefore approving one on a production system, identify a real query, representative parameter values and the data distribution. Then document which rows the query needs, the observed plan, whether existing unique or foreign-key-related indexes already help, and what write/storage overhead the new index introduces. Measure before and after under comparable conditions. For an application with high write throughput, a small read win may not justify expensive extra indexes."
            },
            {
                "id": "transfer",
                "title": "Choose an index for a new query",
                "body": "Consider two frequent library queries. Query A lists recent loans for one borrower ordered by checkout time. Query B lists every late loan regardless of borrower. An index beginning with borrower_id could help A narrow the search; it does not necessarily help B in the same way. An index on overdue status or due date might better serve B, depending on data distribution and query shape.\n\nDo not answer with the longest possible index. Write both SQL shapes, choose one candidate index for one workload and explain which other workload it is not optimized for. State a measurement that could falsify your choice. A single query does not justify an index until you know its frequency, latency requirements and surrounding write workload."
            }
        ],
        "assignment": [
            "Draw how (shelf_id, priority) orders keys and explain why shelf_id=3 differs from priority=7.",
            "Run the published 4,000-row scratch lab; confirm the final counts 40 and 400 and nonzero index storage.",
            "Compare actual plans without requiring an Index Scan to appear.",
            "Explain when you would choose a partial index or INCLUDE instead of another key column.",
            "Propose one Steward index only after stating the exact query and how you would measure its benefit and write cost."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Multicolumn Indexes",
                "url": "https://www.postgresql.org/docs/17/indexes-multicolumn.html",
                "kind": "reference",
                "purpose": "Authoritative PostgreSQL 17 leading-column B-tree rules and trade-offs."
            },
            {
                "title": "PostgreSQL 17 — Partial Indexes",
                "url": "https://www.postgresql.org/docs/17/indexes-partial.html",
                "kind": "reference",
                "purpose": "When predicates define the subset of rows worth indexing."
            },
            {
                "title": "PostgreSQL 17 — Index-Only Scans",
                "url": "https://www.postgresql.org/docs/17/indexes-index-only-scans.html",
                "kind": "reference",
                "purpose": "Distinguish covering indexes and included payload columns from visibility guarantees."
            },
            {
                "title": "PostgreSQL 17 — Indexes and ORDER BY",
                "url": "https://www.postgresql.org/docs/17/indexes-ordering.html",
                "kind": "reference",
                "purpose": "Learn how ordered B-trees may support sorting queries."
            }
        ],
        "practiceObjective": "Evaluate a two-column B-tree against two different predicate shapes, with explicit write/storage costs.",
        "practiceInstructions": [
            "Run the published 4,000-row lab and confirm both stable counts.",
            "Explain which WHERE condition can exploit the leading column and why.",
            "Annotate the selected plans and note any sequential scans without calling them failures.",
            "Write a measured decision for one realistic Steward query with a composite predicate."
        ],
        "knowledgeCheck": "Why can (shelf_id, priority) be different from (priority, shelf_id)? Why is an index on both columns not necessarily efficient for priority alone? What does INCLUDE mean and why does an index have maintenance costs?",
        "warning": "Use only a disposable session for CREATE INDEX experiments. A before/after synthetic demonstration is not production performance proof.",
        "readingTitle": "Learn how multicolumn indexes are ordered",
        "practiceTitle": "Compare composite-index query patterns",
        "checkTitle": "Check index design trade-offs",
        "practiceScenario": "Use scratch book data to understand index ordering, then evaluate one applied Steward query."
    },
    {
        "id": "postgresql-measurement-basics",
        "title": "Understand Query Latency, Throughput and Percentiles",
        "introduction": "Before optimizing a query, decide what 'slow' means and where the delay actually occurs. A database query, a Python endpoint and a page in a browser have different boundaries. This lesson makes latency, throughput, percentiles and a useful performance objective concrete before we touch indexes or benchmarks.",
        "outcomes": [
            "Explain latency and throughput using one request's timeline.",
            "Interpret p50 and p95 with real ordered observations, not just acronyms.",
            "Separate PostgreSQL execution time from client transfer and application response time.",
            "Write a falsifiable performance objective with dataset, traffic and correctness conditions."
        ],
        "sections": [
            {
                "id": "user-experience",
                "title": "What does a user experience as slow?",
                "body": "Imagine a librarian searches for one book in an application. They click Search at 10:00:00.000 and see the answer at 10:00:00.280. That 280 ms is an *end-to-end response time*: it includes the request travelling to the application, any queueing, authentication, application logic, the SQL request to PostgreSQL, the result transfer and the formatting of the response. Even a perfectly indexed SELECT would not remove all of those stages.\n\nLatency means the elapsed time for one operation. Throughput means how much work completes in a period, such as 40 completed HTTP requests per second. One system can have good average latency when idle and much worse latency when requests arrive concurrently. High throughput without acceptable response times is not automatically a good user experience.\n\nStart every performance investigation by naming the operation and its boundary: database query, API endpoint or fully rendered interaction. A measured value from one boundary is not a valid substitute for another."
            },
            {
                "id": "db-versus-http",
                "title": "What does PostgreSQL actually time?",
                "body": "PostgreSQL EXPLAIN (ANALYZE, BUFFERS) executes the statement and reports plan execution measurements. The reported Execution Time is *not* the whole browser-to-server experience. It excludes delivering the query's result rows over the network to the client, and its measurement instrumentation can add overhead. PostgreSQL 17's EXPLAIN options can separately measure serialization work, but do not assume that a basic EXPLAIN report has timed your API serializer or network.\n\nFor a Django API endpoint you may need database timing, query count, application time, network measurements and user-visible latency. If SELECT takes 8 ms but the API takes 900 ms, immediately adding another SQL index is unlikely to fix the remaining 892 ms. Investigate serialization, excessive round trips, queueing or external work first.\n\nAn EXPLAIN cost value is a planner estimate in relative units—not a duration in milliseconds. You already learned that in the query-plan lesson; here we add the larger performance boundary."
            },
            {
                "id": "median-and-tail",
                "title": "What are p50 and p95?",
                "body": "Suppose ten identical book searches take 10, 12, 12, 13, 14, 15, 16, 17, 20 and 100 milliseconds, sorted from fastest to slowest. The median (p50 for this sample) is halfway between the fifth and sixth values: 14.5 ms. Most searches appear fast, but one slow request takes 100 ms. A high percentile such as p95 expresses how slow requests near the tail behave; it is not '95% faster' or an average of the slowest requests.\n\nPercentiles are estimated from a distribution, and common quantile calculation methods use different interpolation rules on small samples. Ten observations are **not enough** for a trustworthy p95 service-level claim. Real traffic needs many representative requests, time windows, parameter mixes and load conditions. Record the method and sample size.\n\nFor an API, a test might require p95 below 300 ms during a representative 40-request/s workload. That target concerns end-to-end requests; an EXPLAIN Execution Time below 300 ms cannot prove it."
            },
            {
                "id": "correctness-first",
                "title": "Fast but wrong is not a successful optimization",
                "body": "A query that drops needed rows or omits a permission filter can appear faster because it does less correct work. An index change might leave results unchanged, while rewriting a join could accidentally count duplicate entities. Before comparing timings, define the expected result set and a basic correctness check, such as the number of matching books and their identity.\n\nAlso describe the workload: how many rows exist, how often the query runs, which parameter values occur, and how many requests arrive simultaneously. A lookup that finds 1 of 15,000 books is different from a report that needs 14,000. An index can help one and hurt the other through added maintenance cost.\n\nCorrectness and measurement boundaries belong in the acceptance criteria, not as afterthoughts attached to a graph."
            },
            {
                "id": "write-acceptance",
                "title": "Write a performance objective that can be tested",
                "body": "A useful statement might be: 'For searches by unique catalogue code over an approximately 100,000-book dataset, with representative code distributions and 40 requests/s, at least 95% of completed API requests should respond within 300 ms while returning the correct authorized book.' This states the interface, data, workload, percentile, threshold and correctness expectation. The numbers are illustrative targets, not an SLA TSA has actually measured.\n\nContrast this with 'make PostgreSQL fast'. That second instruction gives no comparison standard. Could a fix that saves one millisecond but increases CPU load be accepted? Could deleting a database index that no production query uses be acceptable? With a clear target and measured baseline you can answer those questions.\n\nThe next lesson will measure a local SQL experiment only. It does not claim to simulate an HTTP endpoint, real concurrency or production-scale data."
            },
            {
                "id": "transfer-metric",
                "title": "Decide which metric would answer each question",
                "body": "Question A: 'Which PostgreSQL scan did the server use?' Inspect the query plan with EXPLAIN. Question B: 'How many database queries did the Python endpoint issue?' Instrument query count on the application path. Question C: 'What did 95% of real users experience?' Collect distributed end-to-end response durations over a defined window and compute the appropriate percentile.\n\nThose three measures have different jobs. A correct engineering report should label each. Measuring PostgreSQL alone cannot identify a slow upstream authentication service, and measuring HTTP alone cannot tell you which table scan the optimizer chose. Choose the tool according to the question rather than the metric that is easiest to obtain."
            }
        ],
        "warning": "Never invent benchmark timings or infer production service-level performance from a small local SQL exercise.",
        "assignment": [
            "Explain one end-to-end book-search request as a timeline, marking where SQL execution occurs.",
            "Interpret the ten sample durations and explain why one mean or a tiny-sample p95 could mislead.",
            "Write one query-level objective and one separate API-level objective with correctly labeled measurement boundaries.",
            "Explain what evidence would tell you to investigate an application N+1 problem rather than add an index."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Using EXPLAIN",
                "url": "https://www.postgresql.org/docs/17/using-explain.html",
                "kind": "reference",
                "purpose": "Distinguish plan estimation, instrumented server execution and client/network costs."
            },
            {
                "title": "PostgreSQL 17 — Performance Tips",
                "url": "https://www.postgresql.org/docs/17/performance-tips.html",
                "kind": "reference",
                "purpose": "Review statistics, indexing and plan-related performance evidence."
            },
            {
                "title": "PostgreSQL 17 — Monitoring Database Activity",
                "url": "https://www.postgresql.org/docs/17/monitoring-stats.html",
                "kind": "reference",
                "purpose": "Understand server-side statistics and their interpretation limits."
            }
        ],
        "practiceObjective": "Define the boundaries and acceptance criteria for a measurable book lookup without fabricating production results.",
        "practiceInstructions": [
            "Draw an end-to-end request timeline with client, application and PostgreSQL stages.",
            "Distinguish database plan execution from HTTP response latency.",
            "Choose a data volume, parameter mix, request rate and percentile-based success criterion.",
            "State what a benchmark would not prove without representative conditions."
        ],
        "knowledgeCheck": "If EXPLAIN shows 5 ms but the endpoint takes 900 ms, what have you actually learned? What does p95 mean? Why does a 10-request sample not establish a production p95?",
        "readingTitle": "Learn to measure the right performance problem",
        "practiceTitle": "Define a measurable performance objective",
        "checkTitle": "Check latency and throughput",
        "practiceScenario": "Use a generic book-search endpoint to separate user-visible delay from database execution."
    },
    {
        "id": "query-performance",
        "title": "Run a Controlled PostgreSQL Performance Experiment",
        "introduction": "You can read an execution plan and understand what latency means. Now investigate one concrete performance hypothesis: will a B-tree help an exact lookup in a 15,000-row book catalogue? We will keep the query and dataset constant while changing one factor—the existence of an index—and compare a selective lookup with a much broader filter.",
        "outcomes": [
            "Construct repeatable disposable data and prove the expected row counts.",
            "Record an EXPLAIN (ANALYZE, BUFFERS) baseline before changing indexes.",
            "Create exactly one candidate index and rerun the same SELECT under comparable conditions.",
            "Explain what the experiment proves and does not prove about planner choice, timing and production traffic."
        ],
        "sections": [
            {
                "id": "what-question",
                "title": "Choose one hypothesis before using EXPLAIN",
                "body": "Our question is: can an index on id reduce the work required to retrieve book number 14777 from 15,000 rows? That lookup returns exactly one record. We will also query priority = 1, which returns 3,750 of the 15,000 rows. Because these predicates differ in selectivity, PostgreSQL may choose different scan strategies. The broader query provides a counterexample to 'indexes always help'.\n\nWe must compare the *same* selective SELECT before and after CREATE INDEX. Changing the query and adding an index simultaneously would prevent us from knowing which factor caused the observed plan change. The meaning and expected result must remain stable. The index is added only to an isolated TEMP table, never to the canonical Steward fixture."
            },
            {
                "id": "generate-data",
                "title": "Understand every value in the scratch dataset",
                "body": "The SQL below uses generate_series(1,15000), a PostgreSQL function that returns consecutive integers. Each integer becomes a book id. `n % 4` is the remainder after division by four, producing priority values 0, 1, 2 and 3 in equal-sized groups. The name expression builds a readable label such as book-14777. These are fictional rows generated only for measurement.\n\n`CREATE TEMP TABLE ... AS SELECT` creates the table and populates it from the generated rows in one operation. The following standalone ANALYZE asks PostgreSQL to collect statistics used for planning. That is different from EXPLAIN ANALYZE, which executes a query and records observations.\n\nOur fixed correctness checks are: 15,000 total rows, one match for id = 14777 and 3,750 matches for priority = 1. If these numbers differ, stop: the experiment is not running on the dataset you think it is."
            },
            {
                "id": "baseline",
                "title": "Measure the baseline without a candidate index",
                "body": "First run EXPLAIN (ANALYZE, BUFFERS) for the exact id lookup while no user-created index exists on the scratch table. Record the chosen scan node, estimated rows, actual rows and buffer activity. Then run the broad priority query. On an ordinary 15,000-row table, the id lookup may use a sequential scan before the index is created, but the exact plan is selected by PostgreSQL and may vary with environment.\n\nDo not compare two different queries' millisecond numbers and conclude that an index changed anything: no index has been created yet. These are separate baseline cases. Also do not treat the execution time as an HTTP response time; no API or browser is involved."
            },
            {
                "id": "index-change",
                "title": "Make exactly one planned change",
                "body": "Now CREATE INDEX on the id column of the same TEMP table and ANALYZE it again. Run the exact same id query and the same priority query. The server is now free to use the index for the rare id value. It may continue to use a sequential scan for priority because we did not index that column and because the filter matches many rows.\n\nIndex creation itself takes work and storage. A sensible decision considers query frequency, read improvement and update/insert overhead, not only whether the selected EXPLAIN plan mentions Index Scan. You are looking for evidence of a changed access path and repeatable benefit; one plan trace cannot establish a production improvement."
            },
            {
                "id": "run-script",
                "title": "Run the complete baseline and intervention as one SQL file",
                "body": "Save the entire snippet below as performance_probe.sql and run it in one psql session against your disposable database, for example `psql -X -v ON_ERROR_STOP=1 -d tsa_library -f performance_probe.sql`. The TEMP table must exist throughout the baseline and post-index observations. The SQL reports a count after each measured query so you can distinguish correctness from plan choice. In order, the four counts must be 1, 3750, 1, 3750.\n\nYou will see two EXPLAIN plans before the index, a CREATE INDEX response, and two plans after it. Record the node names and reported timings rather than copying any exact costs from this prose; PostgreSQL chooses them under your environment. If the planner does not switch scans, investigate the row-count estimates and workload instead of forcing an index merely to match a screenshot.",
                "caption": "performance_probe.sql — baseline and after-index plans with stable row counts",
                "code": "CREATE TEMP TABLE tsa_perf_probe AS\nSELECT n AS id, (n % 4) AS priority, 'book-' || n::text AS name\nFROM generate_series(1,15000) AS g(n);\nANALYZE tsa_perf_probe;\nEXPLAIN (ANALYZE, BUFFERS) SELECT id FROM tsa_perf_probe WHERE id = 14777;\nSELECT count(*) AS exact_before FROM tsa_perf_probe WHERE id = 14777;\nEXPLAIN (ANALYZE, BUFFERS) SELECT id FROM tsa_perf_probe WHERE priority = 1;\nSELECT count(*) AS broad_before FROM tsa_perf_probe WHERE priority = 1;\nCREATE INDEX tsa_perf_id_idx ON tsa_perf_probe(id);\nANALYZE tsa_perf_probe;\nEXPLAIN (ANALYZE, BUFFERS) SELECT id FROM tsa_perf_probe WHERE id = 14777;\nSELECT count(*) AS exact_after FROM tsa_perf_probe WHERE id = 14777;\nEXPLAIN (ANALYZE, BUFFERS) SELECT id FROM tsa_perf_probe WHERE priority = 1;\nSELECT count(*) AS broad_after FROM tsa_perf_probe WHERE priority = 1;",
                "language": "sql",
                "output": "Correctness counts in sequence: 1, 3750, 1, 3750; scan plans and times depend on the server."
            },
            {
                "id": "repeat-and-judge",
                "title": "What does a credible before/after comparison require?",
                "body": "This script provides a deterministic *correctness* test and examples of measured plans. It is not yet a rigorous performance benchmark: the second run benefits from warmed caches and different timing overhead, and only one synthetic distribution is represented. To estimate a real effect, repeat measurements, alternate baseline/index conditions where feasible, keep parameters and hardware stable, and collect a distribution rather than one execution time.\n\nKeep a short evidence sheet: dataset size; expected and actual result rows; before/after plan nodes; buffer hits/reads; measured timings over multiple runs; what changed; and any limitations. A query may get a faster lookup while inserts become more expensive due to index maintenance. If the application hardly ever looks up by id, the trade-off might not be worthwhile.\n\nThe conclusion can legitimately be 'inconclusive'. That is better than pretending a microsecond difference on a laptop is production evidence."
            },
            {
                "id": "transfer-case",
                "title": "Apply the experiment method to a new domain",
                "body": "Imagine a warehouse table with 100,000 package records and frequent searches by tracking_code, but also bulk reports by status. Build a candidate index for the exact tracking-code lookup and explain why it is not automatically the best access path for a report that retrieves 60% of the table.\n\nWrite the expected query shape, how you would preserve a representative data distribution, how you would check result correctness, and what you would measure before and after. Only after that should you consider the analogous Steward Service lookup. The broader pagination and result-size issues are treated separately next, rather than being squeezed into an index checklist."
            }
        ],
        "warning": "Use a disposable PostgreSQL session. Avoid drawing production latency or throughput conclusions from one synthetic plan, and never benchmark destructive writes on shared data.",
        "assignment": [
            "Predict the 1 and 3,750 matching-row counts before executing the lab.",
            "Run the full source-published performance_probe.sql in one session and confirm the four stable counts.",
            "Record the selective and broad scans before/after the candidate index, including observed rows and buffers.",
            "Write a keep/remove/inconclusive decision based on evidence, explicitly noting caching, write overhead and synthetic-data limitations.",
            "Define an equivalent new problem that does not use Steward book or Service fields."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Using EXPLAIN",
                "url": "https://www.postgresql.org/docs/17/using-explain.html",
                "kind": "reference",
                "purpose": "Distinguish plan estimation, instrumented server execution and client/network costs."
            },
            {
                "title": "PostgreSQL 17 — Performance Tips",
                "url": "https://www.postgresql.org/docs/17/performance-tips.html",
                "kind": "reference",
                "purpose": "Review statistics, indexing and plan-related performance evidence."
            }
        ],
        "practiceObjective": "Measure one controlled SQL access-path change with a fixed dataset and validated results.",
        "practiceInstructions": [
            "Use a fresh disposable PostgreSQL session and run the exact published SQL script.",
            "Show all four correctness counts and the presence of pre/post EXPLAIN plans.",
            "Compare the id-query access path before/after the single CREATE INDEX statement.",
            "Explain whether this evidence supports a production change or merely a lab observation."
        ],
        "knowledgeCheck": "What was the one independent variable in the experiment? Why are the counts 1 and 3750? Why can one post-index timing be misleading? What if PostgreSQL keeps using Seq Scan?",
        "readingTitle": "Learn to test one performance hypothesis",
        "practiceTitle": "Run a measured before-and-after SQL experiment",
        "checkTitle": "Check controlled benchmarking",
        "practiceScenario": "Use disposable book-like rows for the SQL experiment; reserve a production-like Steward scenario for later applied analysis."
    },
    {
        "id": "postgresql-pagination",
        "title": "Return Results Safely: LIMIT, OFFSET and Keyset Pagination",
        "introduction": "A query that returns every matching row may consume more time, memory and network bandwidth than a caller needs. Pagination returns a defined slice, but its correctness depends on a stable ordering and how records change between requests. We will demonstrate OFFSET and keyset pagination on a twelve-row book catalogue, including a new row inserted between page requests.",
        "outcomes": [
            "Explain why SQL results must have a deterministic order before paginating.",
            "Use LIMIT/OFFSET and predict what work large OFFSET may require.",
            "Understand keyset pagination using a compound ordering key.",
            "Observe a duplicated OFFSET row after an earlier record is inserted and compare it with keyset results."
        ],
        "sections": [
            {
                "id": "why-pages",
                "title": "Why not return every book in a single response?",
                "body": "If a library has 500,000 books, sending all of them to a phone when the user wants the first ten wastes server work, response bytes, application memory and client rendering time. A useful endpoint returns a bounded page of fields with a documented sort order. Reducing the response shape can help independently of adding an index.\n\nSQL SELECT chooses which records match the query; ORDER BY defines the order in which they are returned; LIMIT restricts how many rows appear; OFFSET skips a specified number before returning a page. Filtering for authorized records must happen as part of the query—not as an afterthought after pagination—otherwise the pages can have incorrect content or counts.\n\nA database index may support sorting, but LIMIT does not guarantee a cheap query in every plan. Pagination is primarily a response-contract and query-shape design decision."
            },
            {
                "id": "stable-order",
                "title": "A page is meaningless without a unique order",
                "body": "Suppose several books have the same published_year. ORDER BY published_year alone does not determine which book is first among tied years. With LIMIT 5, different valid plans could return different subsets of tied rows. Add a unique tie-breaker such as id: ORDER BY published_year, id. Now the order is completely defined for our data.\n\nA stable order is also required for a reliable cursor. If the client only knows 'last year = 2001' but several books share 2001, it cannot know which 2001 book should appear next. The compound cursor (published_year, id) solves that ambiguity.\n\nThis lesson assumes the ordering keys do not change while traversing the sample. In real applications, changing sort keys or concurrent deletes still require a documented consistency model."
            },
            {
                "id": "offset",
                "title": "How LIMIT and OFFSET work",
                "body": "A query with LIMIT 5 OFFSET 0 returns the first five ordered books. LIMIT 5 OFFSET 5 returns the next five **for the dataset at the time of that second query**. It does not remember which records were returned in the first request. PostgreSQL still has to determine and skip the preceding five rows to reach the offset.\n\nFor deep pages, an OFFSET of 100,000 may require PostgreSQL to process many skipped rows even if only ten are returned. An index can sometimes reduce the work but does not make a large OFFSET inherently free. Use OFFSET when pages are shallow and simple navigation matters; be aware of its cost and consistency behavior.\n\nA second query can return overlapping records if an earlier-positioned row was inserted after the first page was loaded. This is not a database corruption error; the offset was applied to a changed ordered set."
            },
            {
                "id": "cursor",
                "title": "What does a keyset cursor remember?",
                "body": "Keyset pagination does not say 'skip the first five records from today's table'. Instead, it says 'return the next five rows strictly after the last ordering key from the previous page'. For ascending (published_year, id), the second page uses WHERE (published_year, id) > (2001, 5) and the same ORDER BY published_year, id LIMIT 5.\n\nThat predicate compares the two values lexicographically: later years come after earlier years; for equal years, a larger id comes later. PostgreSQL can use a suitable B-tree index for this ordering pattern when the workload justifies it. The cursor must contain all values needed for the order; in real APIs it may be encoded and validated rather than exposed as raw SQL.\n\nKeyset pagination is not automatically a snapshot of the database. An inserted row *after* your cursor may still appear on a later page, and updates to ordering keys can move rows. The goal here is to prove why it avoids this specific earlier-row overlap."
            },
            {
                "id": "run-pages",
                "title": "Create two pages, insert an earlier book, and compare",
                "body": "Run the entire SQL file below in **one** psql session to keep its TEMP table alive. The first query returns ids 1–5, ordered by publication year then id. At that moment id 5, year 2001, is the final book of page one. We then insert a fictional book with year 1999, which sorts **before** all existing rows. On the changed dataset, LIMIT 5 OFFSET 5 returns ids 5–9, repeating book 5. The keyset query uses the saved last key (2001, 5) and instead returns ids 6–10.\n\nThis example is deterministic even though plan nodes may differ, because the ordering key includes a unique id. The final two string results summarize the page IDs so you can verify the duplicate clearly. They are evidence of this one scenario, not a guarantee that cursors solve all concurrent-modification problems.",
                "caption": "paging_stability.sql — observe OFFSET overlap and keyset cursor",
                "code": "CREATE TEMP TABLE tsa_paging_books AS\nSELECT n AS id, 2000 + ((n-1)/3) AS published_year, 'book-' || n::text AS title\nFROM generate_series(1,12) AS g(n);\nSELECT string_agg(id::text, ',' ORDER BY published_year,id) AS page_one\nFROM (\n  SELECT id,published_year FROM tsa_paging_books\n  ORDER BY published_year,id LIMIT 5\n) first_page;\nINSERT INTO tsa_paging_books VALUES (99,1999,'Earlier book');\nSELECT string_agg(id::text, ',' ORDER BY published_year,id) AS offset_page_two\nFROM (\n  SELECT id,published_year FROM tsa_paging_books\n  ORDER BY published_year,id LIMIT 5 OFFSET 5\n) offset_result;\nSELECT string_agg(id::text, ',' ORDER BY published_year,id) AS keyset_page_two\nFROM (\n  SELECT id,published_year FROM tsa_paging_books\n  WHERE (published_year,id) > (2001,5)\n  ORDER BY published_year,id LIMIT 5\n) keyset_result;",
                "language": "sql",
                "output": "page_one = 1,2,3,4,5; offset_page_two = 5,6,7,8,9; keyset_page_two = 6,7,8,9,10"
            },
            {
                "id": "choose-paging",
                "title": "Which pagination approach should you choose?",
                "body": "OFFSET is straightforward for stable datasets, shallow navigation and use cases where exact numbered pages are important. A keyset cursor is often better for continuing through large ordered results with high offsets or frequent inserts, provided the caller accepts the cursor navigation contract. The choice depends on the query and product semantics, not a rule that OFFSET is always wrong.\n\nFor keyset navigation choose a deterministic ordering key, decide whether NULL values can appear, and specify whether the cursor is invalidated when filters or sort order change. If a user's permissions can change between requests, recalculate authorization every time; a cursor must not bypass filtering.\n\nFor independent transfer, design pagination over course enrollments sorted by (enrolled_on, enrollment_id). Explain why two enrollments on one day need the second key and how an earlier insertion would affect page numbers."
            }
        ],
        "warning": "This lesson demonstrates one concurrent insert, not full snapshot consistency. Do not claim keyset pagination guarantees no duplicates under all edits, or that OFFSET has no valid use.",
        "assignment": [
            "Predict which book IDs belong to the first page before running SQL.",
            "Execute paging_stability.sql and verify the three exact ID sequences.",
            "Explain why OFFSET repeated id 5 after an earlier insertion.",
            "Describe the lexicographic comparison for the keyset predicate and why id breaks ties.",
            "Design a pagination cursor for a different table, including one changing-sort-key caveat."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — LIMIT and OFFSET",
                "url": "https://www.postgresql.org/docs/17/queries-limit.html",
                "kind": "reference",
                "purpose": "Verify stable ordering and skipped-row costs."
            },
            {
                "title": "PostgreSQL 17 — Sorting Rows",
                "url": "https://www.postgresql.org/docs/17/queries-order.html",
                "kind": "reference",
                "purpose": "Review deterministic ORDER BY, ties and NULL placement."
            }
        ],
        "practiceObjective": "Demonstrate both correct ordering and a real OFFSET overlap caused by an intervening insert.",
        "practiceInstructions": [
            "Run the published paging file in one PostgreSQL session.",
            "Record the three page ID lists exactly and identify which row repeated.",
            "Explain why the keyset cursor (published_year,id) advances past the previous page.",
            "Design and defend a cursor for a different table with non-unique timestamps."
        ],
        "knowledgeCheck": "Why is ORDER BY published_year insufficient for pagination? Why did OFFSET repeat id 5? What does WHERE (published_year,id) > (2001,5) mean, and what change could still disturb keyset results?",
        "readingTitle": "Learn to paginate ordered SQL results",
        "practiceTitle": "Compare OFFSET and keyset page continuity",
        "checkTitle": "Check pagination correctness",
        "practiceScenario": "Use a fictional twelve-book catalogue so page stability can be understood without any Steward API."
    },
    {
        "id": "postgresql-practice",
        "title": "Inspect PostgreSQL Connections and Database Objects",
        "introduction": "A PostgreSQL connection may succeed even when a query fails, because client installation, server reachability, selected database, schema visibility and object permissions are separate issues. This lesson teaches how to gather evidence with psql and database metadata. Roles, grants and backups are deliberately taught in their own lessons rather than compressed into an operations checklist.",
        "outcomes": [
            "Identify the connected database, effective role, current schema and backend session.",
            "Use psql meta-commands to inspect databases, schemas, tables and roles.",
            "Distinguish a missing client, refused connection, missing object and permission error.",
            "Read safe server session information without assuming ordinary users can inspect every other user's queries."
        ],
        "sections": [
            {
                "id": "what-to-inspect",
                "title": "Begin with the server connection you actually have",
                "body": "The database you intended to use is not necessarily the one your client selected. PostgreSQL client programs can get defaults from arguments, environment variables and connection configuration. A login establishes a session tied to one database. SQL current_database() and current_user reveal the active database and authorization role; current_schema() reveals the first existing schema in the effective search path, not the name of every schema.\n\nBefore debugging a missing table, record host, port, database, role and current_schema without showing credentials. If an application crashes, do not assume a bad table definition when the DSN points to another database. If a psql prompt shows the wrong database, reconnect explicitly. The same server can host many databases; a schema named library in tsa_library is not visible in the postgres maintenance database."
            },
            {
                "id": "psql-inventory",
                "title": "Use psql to explore objects",
                "body": "At the psql prompt, \\conninfo displays connection details; \\l lists databases; \\dn lists schemas within the current database; \\dt library.* lists tables in the library schema; \\d library.books describes the table and its constraints; \\du lists roles. A backslash command belongs to the psql client, not to SQL itself; do not paste it into Django's query API or into a raw SQL file handled by a different driver.\n\nEach command answers a particular question. Does tsa_library exist? Use \\l. Does the library schema exist in the selected database? Use \\dn. Does the books table have the four expected columns? Use \\d library.books. Who is my connection using as a role? Compare \\conninfo with SELECT current_user;. The habit is evidence-first diagnosis rather than blindly rerunning migration commands."
            },
            {
                "id": "sql-catalogs",
                "title": "Use SQL when psql meta-commands are unavailable",
                "body": "Not every database client understands psql backslash commands. PostgreSQL exposes information_schema views and system catalogs that SQL can query. The existing Steward exercise below proves which database, user and current schema are active, then lists visible tables in public. It is read-only and deliberately does not modify the fixture. The four names are expected in the disposable Steward learning database, not in tsa_library.\n\nThe SQL query does not test every possible privilege or prove that all migrations were applied. It provides a basic inventory that you can compare with the application's expected schema and connection target.",
                "caption": "postgresql_inspect.sql — verify connection and visible Service relation",
                "code": "SELECT current_database(), current_user, current_schema();\nSELECT table_name FROM information_schema.tables\nWHERE table_schema='public' AND table_name IN ('team','service','environment','service_dependency')\nORDER BY table_name;",
                "output": "Database/user/schema depend on connection; four Steward tables appear in the disposable fixture.",
                "language": "sql"
            },
            {
                "id": "inspect-sessions",
                "title": "What is a PostgreSQL backend session?",
                "body": "The server serves multiple clients using backend processes. pg_backend_pid() reports the server process for your current connection. The pg_stat_activity view exposes information about connected backends such as database, role, application name and state. Run the read-only query below while connected to your learning database; it returns at least your current session. A managed system may show additional sessions, and this output is not meant to have a fixed row count.\n\nAn ordinary role cannot necessarily see detailed queries and other sensitive fields for everyone else's sessions. That restriction is expected, not proof that the monitoring view is broken. Avoid copying other users' query text into public evidence. Understanding a connection pool, lock wait or idle-in-transaction backlog takes more study in later platform and reliability courses.",
                "caption": "postgresql_session.sql — inspect only your own backend",
                "code": "SELECT current_database(), current_user, pg_backend_pid() > 0 AS has_backend;\nSELECT count(*) >= 1 AS sees_self\nFROM pg_stat_activity\nWHERE pid = pg_backend_pid();",
                "output": "has_backend = true; sees_self = true.",
                "language": "sql"
            },
            {
                "id": "diagnostic-order",
                "title": "Find which stage failed",
                "body": "A client saying 'psql: command not found' has not tried to connect to PostgreSQL. A connection-refused error means the client did not establish the expected transport connection; check server/listener and host/port. Authentication failure means a server responded but rejected the account or credentials. 'Database does not exist' means the target name was wrong or not provisioned. 'Schema does not exist' and 'relation does not exist' occur after a connection and indicate object lookup issues. 'Permission denied' means the current role is not authorized for the requested operation.\n\nDo not use the same remedy for every failure. Reinstalling the client cannot grant SELECT on a table; issuing GRANT cannot fix an unreachable host. A reliable investigation records the precise error, current connection context, expected object and next discriminating test."
            },
            {
                "id": "what-you-are-not-doing",
                "title": "Inspection does not mean administration",
                "body": "Builder-level fluency includes knowing what information to collect when a database operation fails. It does not mean granting yourself superuser access, changing production configuration, terminating others' sessions or altering retention policies. The next lesson explains which privileges control connection, schema usage and table operations. A later lesson demonstrates a logical backup and a real restore in a second disposable database, without claiming full production recovery readiness."
            }
        ],
        "warning": "Inspect only authorized databases and avoid exposing credentials, session query text or customer records. Do not terminate backends or change roles just to complete this reading.",
        "assignment": [
            "Inspect your database and schema with \\l and \\dn and explain their different scope.",
            "Identify one table definition with \\d and verify the current role with SQL.",
            "Run the published safe session query; explain why its result is not proof of administrative rights.",
            "Classify five representative errors by the stage that failed.",
            "Write a short investigation report that includes observations, unknowns and next checks."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — psql Client",
                "url": "https://www.postgresql.org/docs/17/app-psql.html",
                "kind": "reference",
                "purpose": "Use meta-commands correctly and distinguish client commands from SQL."
            },
            {
                "title": "PostgreSQL 17 — Database Monitoring",
                "url": "https://www.postgresql.org/docs/17/monitoring-stats.html",
                "kind": "reference",
                "purpose": "Understand pg_stat_activity and visibility limits."
            }
        ],
        "practiceObjective": "Collect reproducible PostgreSQL connection and object evidence without making any structural changes.",
        "practiceInstructions": [
            "Use psql to inspect the connected database, schema, tables and role.",
            "Execute read-only metadata SQL and identify the expected Steward tables.",
            "Inspect only your own backend session using pg_backend_pid and pg_stat_activity.",
            "Classify an observed or safely simulated missing-object failure."
        ],
        "knowledgeCheck": "What can \\dn show that \\l cannot? Why can a table exist but be invisible to an unqualified query? Why might pg_stat_activity not show another user's full SQL?",
        "readingTitle": "Learn how to inspect PostgreSQL safely",
        "practiceTitle": "Investigate a connection and object inventory",
        "checkTitle": "Check inspection and diagnosis",
        "practiceScenario": "Practice the general psql/database inventory, then inspect the disposable Steward fixture without changing it.",
        "practiceDeliverables": [
            "Connection and database inventory",
            "psql object descriptions",
            "Session metadata and failure-classification note"
        ],
        "practiceCompletionCriteria": [
            "Commands and outputs identify the actual target rather than assuming it.",
            "The learner distinguishes missing objects from permission problems.",
            "No administrative changes or secrets are required."
        ]
    },
    {
        "id": "postgresql-roles-and-privileges",
        "title": "Roles, Ownership, and Permissions in PostgreSQL",
        "introduction": "A role can connect to PostgreSQL but still be unable to read or edit a table. Roles, database CONNECT, schema USAGE, table SELECT and object ownership are separate checks. We will learn the model, inspect effective privileges and deliberately create a NOLOGIN teaching role only when using our own disposable administrator-controlled lab.",
        "outcomes": [
            "Explain roles, LOGIN versus NOLOGIN, object owners and granted privileges.",
            "Distinguish CONNECT on a database, USAGE/CREATE on a schema and SELECT/INSERT/UPDATE/DELETE on tables.",
            "Inspect effective privileges without guessing whether a password or role was accepted.",
            "Explain why an application account should not be a superuser or table-migration owner by default."
        ],
        "sections": [
            {
                "id": "what-is-role",
                "title": "What is a PostgreSQL role?",
                "body": "A PostgreSQL role is an identity that can own database objects, receive privileges, and be a member of other roles. A role with LOGIN can authenticate as a database connection principal; a role created NOLOGIN cannot directly log in but can be useful to group privileges. Roles are cluster-wide: a role is not another schema or database. Access to one database or one table still depends on permissions.\n\nAn object's owner usually has rights to alter or drop it, and has grant options. That is much more authority than an application normally needs simply to run SELECT, INSERT or UPDATE. Separate a migration/owner identity from the runtime application's identity so a compromised API cannot casually redefine schema structures.\n\nA database user name is not the same as an operating-system user; PostgreSQL's authentication configuration decides how a login is verified."
            },
            {
                "id": "three-permission-levels",
                "title": "Understand the three permission boundaries",
                "body": "First, a connecting role normally needs CONNECT on the target database. Second, to reference objects in a schema it generally needs USAGE on that schema. Third, to read book rows it needs SELECT on library.books; to insert it needs INSERT and possibly the relevant sequence privileges for generated IDs; to update or delete it needs the corresponding table privileges and sometimes SELECT for predicates or RETURNING.\n\nCREATE on a database allows creating schemas; CREATE on a schema allows creating objects inside it. These are different grants. A role might have SELECT on a table but fail before reading it because it lacks USAGE on the containing schema. Likewise, successful login and \\dt output are not proof that DELETE is allowed.\n\nOwnership and role inheritance can affect the effective rights. Use permission-inspection functions rather than assuming privileges from a role name."
            },
            {
                "id": "verify-your-rights",
                "title": "Read the privileges of your current connection",
                "body": "The following read-only query runs in tsa_library after you have created library.books. PostgreSQL functions has_database_privilege, has_schema_privilege and has_table_privilege report whether the specified role currently has the named right. In the disposable Docker bootstrap role, the three results should be true because it owns the lab. A restricted training role may legitimately have different results.\n\nThe query demonstrates the three levels, not a denial. You will only observe a real denial by using an authorized deliberately restricted role. Do not test whether a production account can DELETE by actually deleting records.",
                "caption": "postgresql_privileges.sql — inspect database, schema and table rights",
                "code": "SELECT current_user,\n       has_database_privilege(current_user, current_database(), 'CONNECT') AS can_connect,\n       has_schema_privilege(current_user, 'library', 'USAGE') AS can_use_schema,\n       has_table_privilege(current_user, 'library.books', 'SELECT') AS can_read_books;",
                "language": "sql"
            },
            {
                "id": "create-a-lab-role",
                "title": "Create a read-only group role in an authorized disposable lab",
                "body": "If and only if you control a disposable PostgreSQL server with permission to CREATE ROLE and GRANT, the SQL below creates a NOLOGIN role and gives it the minimum permissions for reading the library books. It has CONNECT on tsa_library, USAGE on library and SELECT on library.books. It deliberately does not grant INSERT, UPDATE, DELETE or CREATE. These permissions may be inherited by a separate LOGIN role when a DBA assigns membership; no password is shown here.\n\nBecause the role is NOLOGIN, this script itself is not a complete client-authentication test. The last SELECT checks the role's granted table rights directly: SELECT is true and INSERT is false. Running this a second time fails because the named role exists; do not drop a real role to repeat the exercise. A course-managed environment without CREATEROLE should treat this as an instructor-provisioned optional lab and focus on the read-only query above.",
                "caption": "postgresql_readonly_role.sql — optional local-only NOLOGIN role and privilege proof",
                "code": "CREATE ROLE tsa_books_readonly NOLOGIN;\nGRANT CONNECT ON DATABASE tsa_library TO tsa_books_readonly;\nGRANT USAGE ON SCHEMA library TO tsa_books_readonly;\nGRANT SELECT ON library.books TO tsa_books_readonly;\nSELECT has_table_privilege('tsa_books_readonly','library.books','SELECT') AS can_read,\n       has_table_privilege('tsa_books_readonly','library.books','INSERT') AS can_insert;",
                "output": "can_read = true; can_insert = false.",
                "language": "sql"
            },
            {
                "id": "permissions-in-workflows",
                "title": "Why separate runtime and migration roles?",
                "body": "A database migration often creates or alters tables. A typical API process only reads and updates domain records. If the API runs as a superuser or the owner of all tables, a bug or SQL injection vulnerability has a much larger destructive surface. A dedicated runtime role with narrowly granted rights can limit the damage.\n\nThat does not mean 'read-only' is automatically safe: SELECT can still expose confidential records. PostgreSQL grants control table and column access at different levels, while row-level security requires additional explicit policies and careful testing. The principle is to state which operations the component truly needs, test what it can do and verify what it cannot do.\n\nWhen authentication fails, granting table rights will not repair it. When authorization fails, changing the host or password is the wrong first remedy."
            },
            {
                "id": "run-actual-denial",
                "title": "Prove that SELECT succeeds but INSERT is denied",
                "body": "A permission inspection such as has_table_privilege(...) is useful, but the strongest beginner evidence is an actual authorized operation followed by an actual rejected one. In our private disposable PostgreSQL container, the bootstrap role can assume the NOLOGIN group role created above using SET ROLE. PostgreSQL checks subsequent SQL using that role's privileges. This requires the session's login role to have SET permission for the target role (a lab superuser can assume it); an ordinary training role may be forbidden to do so, which should be reported rather than bypassed.\n\nSave the script below as readonly_denial.sql and run it in ONE psql process against tsa_library, using `psql -X -v ON_ERROR_STOP=0 -d tsa_library -f readonly_denial.sql`. We use ON_ERROR_STOP=0 here deliberately: we expect the INSERT to fail, and still want the script to RESET ROLE and verify the unchanged book count. Do not use ON_ERROR_STOP=0 for normal migrations or batch loads, where ignored errors would be dangerous.\n\nExpected: the role reads two existing books; PostgreSQL rejects INSERT with 'permission denied for table books'; RESET ROLE restores the prior role; the final count remains two. This is a real negative authorization test, not a guessed error. If the lab contains additional books, verify the actual starting count instead of forcing it to two. The script does not grant the group role LOGIN and it does not change production permissions.",
                "caption": "readonly_denial.sql — demonstrate allowed SELECT and rejected INSERT",
                "code": "SET ROLE tsa_books_readonly;\nSELECT current_user, count(*) AS readable_books FROM library.books;\nINSERT INTO library.books (title, author, published_year)\nVALUES ('Blocked Book', 'No Author', 2001);\nRESET ROLE;\nSELECT count(*) AS books_after_rejection FROM library.books;",
                "language": "sql",
                "output": "tsa_books_readonly | 2\nERROR: permission denied for table books\n2 (unchanged after RESET ROLE)"
            },
            {
                "id": "negative-case",
                "title": "Distinguish denied privileges from a missing table",
                "body": "A nonexistent relation produces a name-lookup error; an existing table that a role cannot read produces a permission error. With a genuine restricted training role, test SELECT and an INSERT against disposable data and capture the expected outcomes. Do not perform this experiment on shared business tables and do not assume that a simulated privilege-function result proves a failed SQL command was executed.\n\nA DBA can inspect permissions with \\dp library.books and roles with \\du. Effective rights may also come from inherited membership or ownership. Record the relevant role, database, schema, table and requested action in every permission-failure report. The next lesson moves from authorization to data recoverability: preserving and restoring a disposable database, not just copying SQL scripts."
            }
        ],
        "warning": "CREATE ROLE/GRANT are cluster-wide administrative changes and may require CREATEROLE or ownership. Execute the role-creation example only once on your own disposable server. No real passwords or production roles are used.",
        "assignment": [
            "Explain CONNECT, USAGE and SELECT in the order PostgreSQL checks the access path.",
            "Run the read-only permission-inspection query and interpret the result for your assigned role.",
            "On an authorized isolated lab, create NOLOGIN read-only group role and verify SELECT true, INSERT false; otherwise document a permission blocker.",
            "Draft the minimum rights a read-only book-listing application requires and name two rights it should not have.",
            "Describe how a runtime role differs from the role that applies schema migrations.",
            "In a private authorized lab, execute readonly_denial.sql and show an actual permission error plus unchanged row count; otherwise document why SET ROLE is unavailable."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — Privileges",
                "url": "https://www.postgresql.org/docs/17/ddl-priv.html",
                "kind": "reference",
                "purpose": "Understand GRANT/REVOKE, ownership, database, schema and table privileges."
            },
            {
                "title": "PostgreSQL 17 — Schemas and Privileges",
                "url": "https://www.postgresql.org/docs/17/ddl-schemas.html",
                "kind": "reference",
                "purpose": "Distinguish schema USAGE and CREATE from table rights."
            },
            {
                "title": "PostgreSQL 17 — Database Roles",
                "url": "https://www.postgresql.org/docs/17/user-manag.html",
                "kind": "reference",
                "purpose": "Learn LOGIN, NOLOGIN and role membership."
            },
            {
                "title": "PostgreSQL 17 — SET ROLE",
                "url": "https://www.postgresql.org/docs/17/sql-set-role.html",
                "kind": "reference",
                "purpose": "Show the role-switching authorization rules and how to restore the session role."
            }
        ],
        "practiceObjective": "Inspect and, where authorized, demonstrate a read-only role's permitted and denied operations.",
        "practiceInstructions": [
            "Explain the minimum permissions for the library and Steward read-only queries.",
            "Run the safe privilege SQL using the current connection.",
            "Only in an isolated administrator-controlled lab, create a NOLOGIN read-only role and verify effective SELECT/INSERT flags.",
            "Document how an application would authenticate with its own LOGIN role without sharing a superuser account.",
            "When authorized to SET ROLE in a disposable server, execute the real denial script and verify both the SELECT and the failed INSERT."
        ],
        "knowledgeCheck": "Does database CONNECT grant table SELECT? Does schema USAGE let you CREATE tables? Can a NOLOGIN role directly connect? Why should a web API not own the schema it uses? Why is testing a failed INSERT stronger evidence than merely querying a grant flag? Why is ON_ERROR_STOP=0 used here but unsafe for routine migrations?",
        "readingTitle": "Understand PostgreSQL roles and privileges",
        "practiceTitle": "Prove the rights of a read-only role",
        "checkTitle": "Check permission boundaries",
        "practiceScenario": "Learn access control using a disposable library database before designing an application role for Steward.",
        "practiceDeliverables": [
            "Privilege map by database, schema and table",
            "Effective-rights query output",
            "Optional NOLOGIN role proof or explicitly blocked lab",
            "Runtime-versus-migration responsibility note"
        ],
        "practiceCompletionCriteria": [
            "The learner distinguishes successful authentication from authorized table access.",
            "A role-name label is not used as proof of effective permissions.",
            "Administrative writes are limited to authorized disposable environments."
        ]
    },
    {
        "id": "postgresql-backup-and-restore",
        "title": "Back Up and Restore a PostgreSQL Learning Database",
        "introduction": "A backup file is not the same as proof that your database can be recovered. We will produce a logical PostgreSQL backup and restore it into a separately named learning database, then query the restored rows. This lesson teaches one concrete recovery check, not a production disaster-recovery architecture.",
        "outcomes": [
            "Distinguish a logical database dump from the database server's live storage files.",
            "Create a custom-format pg_dump archive of a single learning database.",
            "Restore that archive to a separate empty target and validate the recovered table and rows.",
            "Explain what this exercise does not prove about roles, recovery time, point-in-time recovery and disaster readiness."
        ],
        "sections": [
            {
                "id": "what-is-backup",
                "title": "What does a PostgreSQL logical backup contain?",
                "body": "PostgreSQL stores live data in server-managed files, but copying arbitrary files while a server is running is not a safe substitute for a supported backup method. The pg_dump utility connects as a client and exports the logical contents of one database, including definitions and records you have rights to read. It can generate plain SQL or an archive format. A custom-format archive (-Fc) is suitable for pg_restore, which can select and rebuild objects from the archive.\n\nA dump of tsa_library does not automatically include every database in the server cluster. Cluster-wide objects such as roles are not included in a single-database pg_dump; they need separate handling if required. A logical dump also is not automatically a continuous WAL archive, a replication setup or point-in-time recovery. The purpose here is to prove that our small library's schema and rows can be recreated in an independent database."
            },
            {
                "id": "backup-preconditions",
                "title": "Prepare a safe recovery experiment",
                "body": "Complete the library table and two-book exercises first. Start from a private PostgreSQL server, not a production or shared environment, and ensure the host PostgreSQL 17 client utilities pg_dump, pg_restore, createdb and psql are installed and reachable. Your existing connection configuration must point to the disposable server and an authorized role. Record the source database tsa_library and choose an unused restore target named tsa_library_restore.\n\nBefore taking a dump, query SELECT count(*) FROM library.books; in tsa_library and record the source count. In the canonical lab it is two, but your earlier exploratory inserts may legitimately change it. The restore must be compared to the actual source rather than forcing a screenshot to match two rows. An existing database named tsa_library_restore is a blocker, not permission to overwrite it."
            },
            {
                "id": "take-and-restore",
                "title": "Run the complete dump-and-restore sequence",
                "body": "These are operating-system shell commands, not SQL to type into psql. They assume pg_dump, createdb and pg_restore are available on the machine where you execute them and PGHOST, PGPORT, PGUSER and secure authentication are already configured for the disposable server. We do not put passwords into command arguments.\n\nFirst pg_dump -Fc writes a custom archive file. Second createdb creates the new empty destination (with the authenticated role authorized to create databases). Third pg_restore reads the archive and reconstructs library and its books table in the new destination. Finally psql executes a SELECT against the restored table. In the clean two-book lab the last output is 2. In a pre-existing or managed database, the role may lack CREATEDB and you must ask for a separate authorized destination instead of assuming administrator rights.\n\nThe source database is never dropped. The archive filename belongs to your disposable working directory; keep it private if it contains personal data. A Docker-only learner can run pg_dump inside the teaching container and stream to a host file, but must explicitly arrange that path and use a fresh destination before restoring.",
                "caption": "library_backup_restore.sh — restore a custom-format archive into a separate learning database",
                "code": "pg_dump -Fc -f tsa_library_backup.dump -d tsa_library\ncreatedb tsa_library_restore\npg_restore --exit-on-error -d tsa_library_restore tsa_library_backup.dump\npsql -X -v ON_ERROR_STOP=1 -At -d tsa_library_restore -c 'SELECT count(*) FROM library.books;'",
                "output": "2 (with the original clean two-book lab)",
                "language": "bash"
            },
            {
                "id": "verify-beyond-success",
                "title": "How do you know the restore worked?",
                "body": "Do not stop when pg_dump exits with status zero. The archive might be stored in the wrong directory, have incorrect permissions or be unreadable by the recovery operator. Check that the file exists and has nonzero size. Use pg_restore -l on the archive to inspect its table of contents. Then validate the restored database independently: is the library schema present, does library.books have the expected columns and constraints, and does SELECT return the expected count and values?\n\nA count alone is necessary but not sufficient for large or critical data: two different datasets can have the same count. For this introductory proof compare titles and years as well as the count. The original tsa_library should still be readable and unchanged. The restore destination is isolated by design so that the experiment cannot overwrite your source database."
            },
            {
                "id": "what-backup-misses",
                "title": "What this lab does NOT guarantee",
                "body": "The lab does not prove backup scheduling, retention, offsite storage, encryption, key management, restore-time objective, recovery-point objective, data consistency across several databases or point-in-time recovery. pg_dump does not include cluster-wide role definitions automatically, and restoring into a different server may require roles or extensions that the destination lacks. We are restoring within the same temporary teaching cluster, where the relevant role already exists.\n\nProduction recovery also needs a tested procedure for handling untrusted archives; restoring a dump can execute definitions from its source and should only be done from trusted backups in an approved environment. A single successful local restore is evidence of this particular snapshot and setup. It is not evidence that a production service can be recovered within its operational commitments. Those requirements belong to Platform Builder and Reliability Engineering."
            },
            {
                "id": "what-to-do-on-failure",
                "title": "Understand common backup/restore failures",
                "body": "If pg_dump cannot connect, diagnose the client connection first. If it reports insufficient privileges, the account may not be able to read all required objects. If createdb fails because the destination already exists, stop; do not DROP a populated database to make the tutorial repeat. If pg_restore reports missing roles, extensions or object conflicts, inspect the archive contents, destination state and permissions instead of suppressing errors.\n\nA restore is a separate engineering operation with its own failure modes. Record the exact command, source and target database names, exit statuses, relevant error text and verification results. Never present a dump file alone as proof that recovery is possible."
            }
        ],
        "warning": "Only dump/restore disposable data you own. Never overwrite or drop an existing database to repeat this lab, and never restore an untrusted archive on a privileged server.",
        "assignment": [
            "Explain why pg_dump and pg_restore are different tools and why -Fc uses an archive format.",
            "Run the published shell sequence in a fresh lab or record an honest environment/permission blocker.",
            "Verify the backup artifact and compare restored schema, row count and book values against the source.",
            "Explain why a single-database dump does not include every role in a PostgreSQL cluster.",
            "Write three operational questions that the local restore does not answer."
        ],
        "resources": [
            {
                "title": "PostgreSQL 17 — pg_dump",
                "url": "https://www.postgresql.org/docs/17/app-pgdump.html",
                "kind": "reference",
                "purpose": "Authoritative custom-format dump and single-database scope."
            },
            {
                "title": "PostgreSQL 17 — pg_restore",
                "url": "https://www.postgresql.org/docs/17/app-pgrestore.html",
                "kind": "reference",
                "purpose": "Restore custom-format archives and inspect archive contents."
            },
            {
                "title": "PostgreSQL 17 — Backup and Restore",
                "url": "https://www.postgresql.org/docs/17/backup.html",
                "kind": "reference",
                "purpose": "Understand logical versus physical backups and recovery limits."
            }
        ],
        "practiceObjective": "Prove a logical PostgreSQL backup restores into a separate empty database without modifying the source.",
        "practiceInstructions": [
            "Record the source library count and objects.",
            "Create a custom-format dump using an authorized client.",
            "Restore into a new separately named database, never the original source.",
            "Verify a real table and its data in the restore target.",
            "Document what remains untested about full recovery and operational readiness."
        ],
        "knowledgeCheck": "Why does a successful pg_dump not prove recoverability? What does pg_dump -Fc produce? Why is a new destination safer? Which cluster-wide objects are not included, and what does point-in-time recovery require beyond this lab?",
        "readingTitle": "Learn the backup and restore process",
        "practiceTitle": "Recover an independent database copy",
        "checkTitle": "Check recovery evidence",
        "practiceScenario": "Use a disposable library copy to understand recovery before Steward production operations.",
        "practiceDeliverables": [
            "Source snapshot inventory",
            "Custom dump archive (kept private)",
            "Restored database queries and comparison",
            "Operational limitations list"
        ],
        "practiceCompletionCriteria": [
            "The source database is never overwritten.",
            "A fresh target is actually restored and queried.",
            "The learner distinguishes local restore proof from disaster-recovery readiness."
        ]
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
