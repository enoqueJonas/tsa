# PostgreSQL first-principles rebuild — live learner defect (2026-11-03)

Issue: [#356](https://github.com/enoqueJonas/tsa/issues/356) · Parent: [#318](https://github.com/enoqueJonas/tsa/issues/318) · School: **Builder**, module **Relational Data and PostgreSQL**.

## What the learner actually reported

The deployed `PostgreSQL: Server, Client and Your First Session` reading mixed client/server vocabulary with installation, role provisioning, temporary tables, transactions and error classification. Headings such as “Two programs, one protocol boundary” and “Establish prerequisites without inventing credentials” sounded like an architecture review rather than a lesson. Crucial questions (what a database is, how to create it, what a schema contains, and what psql does) were never taught progressively. Earlier source/CI claims were **not** proof that this reading taught those concepts to a beginner.

The pedagogical correction is not a bigger paragraph or an extra resource link. It is **a change of boundaries**: each lesson should answer one novice-sized question before depending on the next. The conceptual readings teach PostgreSQL with an independent library catalogue; the later Steward exercises apply the concepts to an API.

## Revised learner order

| Order | Lesson and stable ID | Core question | Required observable evidence |
| --- | --- | --- | --- |
| 1 | From In-Memory State to Durable Data (existing) | Why do we need storage beyond one process? | Python processes and JSON corruption |
| 2 | **What Is PostgreSQL? Servers, Databases and Clients** (`postgresql-what-it-is`) | Where does the data live, who runs queries, and why use a DBMS? | Diagram and explanation, no database setup assumed |
| 3 | **Connect to PostgreSQL with psql** (`postgresql-first-connection`, **existing ID preserved**) | How do I reach the server and use psql? | Real connection, `\\conninfo`, `\\l`, `SELECT 2+2`, exit, wrong-database failure |
| 4 | **Create Databases and Schemas** (`postgresql-databases-and-schemas`) | How is the server's data divided and organized? | `CREATE DATABASE tsa_library`, `\\connect`, `CREATE SCHEMA library`, `SHOW search_path` |
| 5 | **Create Tables, Insert Rows and Read Data** (`postgresql-tables-and-rows`) | How do tables store rows and enforce rules? | `library.books`, two inserts, ordered SELECT, durable reconnect, NOT NULL failure, unqualified lookup failure |
| 6 | **Temporary Tables and Session Lifetime** (`postgresql-temporary-tables`) | Why is one table lost on disconnect and another persistent? | Complete source-derived SQL file, expected missing temporary table in new session |
| 7 | **How Tables Relate: Keys and Relationships** (`relational-model`, **existing ID preserved**) | Why use multiple tables and what do keys actually enforce? | Disposable Author/Book example with real foreign-key rejection, many-to-many model and duplication anomaly |
| 8 | A Reproducible Steward Schema and Seed Dataset (existing) | Apply learned mechanisms to an application domain | Real Steward SQL fixture, positive/negative tests |

Later SQL, transactions, normalization, plans, migration and API lessons retain their own separate audits. This change does **not** declare the whole module learner-validated.

## Research and teaching translation

Primary material was inspected for the precise model and syntax, not copied verbatim:

| Source | Topic supported | Translation into TSA |
| --- | --- | --- |
| [PostgreSQL 17 official tutorial](https://www.postgresql.org/docs/17/tutorial.html) | Proven novice-friendly sequence: architecture → create/access DB → create/populate/query table | Similar high-level progression; TSA adds schema as a separate explicit topic before tables |
| [Architectural Fundamentals](https://www.postgresql.org/docs/17/tutorial-arch.html) | Client vs server and their different processes | Query trace from psql to server and back; server stores and evaluates |
| [Creating a Database](https://www.postgresql.org/docs/17/tutorial-createdb.html) | Connection/CREATEDB prerequisite | SQL `CREATE DATABASE`, privilege diagnosis and `\\connect` |
| [Schemas](https://www.postgresql.org/docs/17/ddl-schemas.html) | Namespace hierarchy, `public`, `search_path` and permission semantics | Library-schema exercise, qualified `library.books`, unqualified lookup negative |
| [psql reference](https://www.postgresql.org/docs/17/app-psql.html) | Prompt, `\\conninfo`, `\\l`, script execution | Distinguish shell commands, client meta-commands and SQL, plus a session-lifetime proof |
| [CREATE TABLE](https://www.postgresql.org/docs/17/sql-createtable.html) / [constraints](https://www.postgresql.org/docs/17/ddl-constraints.html) | Persistent vs temporary tables, NOT NULL, CHECK, primary and foreign keys | Two real rows, invalid title and invalid author references |
| [CMU 15-445 schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) | Optional deeper relational model lectures | Reference for deeper study; no claim that a video was watched |

**Important limitation:** source references establish semantics and organization. They do **not** substitute for executing the sample SQL, checking the rendered page and having a new learner use it without prompting.

## Technical verification and remaining gates

- The previously released `postgresql-first-connection` lesson/activity IDs are retained to minimize progress migration risk; five additional lessons (four new and one retained connection rewrite) introduce new activity IDs in learner order.
- `scripts/check-builder-data-foundations-examples.mjs` verifies new boundaries, captions and source-extracted example contracts.
- `scripts/check-builder-postgresql-live-lab.mjs` is extended to execute the **exact published** DB, schema, persistent table and relational example code against a disposable PostgreSQL 17 CI service, including wrong-database, missing table, failed NOT NULL, foreign key and session-lifetime cases. Keep the CI status **PENDING** until the actual workflow on the final branch head succeeds.
- The original Steward SQL fixture and downstream tests remain in place; the live runner must pass both new library examples and old Steward exercises.

**Exit gates deliberately still open:** complete same-commit build/test, complete browser traversal of changed lesson pages at desktop/mobile widths, manual review of rendered headings/code scrolling, newcomer independently creating another example database/schema and explaining failed connections or foreign keys. No `VALIDATED` claim without that evidence.
