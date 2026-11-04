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
| 4 | **Create Your First PostgreSQL Database** (`postgresql-create-database`) | What is a named database, how is it created and how do connections change? | `CREATE DATABASE tsa_library`, `\\connect`, and independent database/role verification |
| 5 | **Understand and Create PostgreSQL Schemas** (`postgresql-create-schema`) | What is the difference between a database and a schema? | `CREATE SCHEMA library`, `\\dn`, `public` and `SHOW search_path` |
| 6 | **Create Your First PostgreSQL Table** (`postgresql-create-table`) | What is a table, and how do columns, types and constraints work? | `CREATE TABLE library.books`, schema-qualified definition and table metadata |
| 7 | **Insert and Read Table Rows** (`postgresql-work-with-rows`) | How do SQL INSERT, SELECT, WHERE and ORDER BY work? | Two book rows, filtering, reconnect, NOT NULL violation and zero unintended writes |
| 8 | **Temporary Tables and Session Lifetime** (`postgresql-temporary-tables`) | Why is one table lost on disconnect and another persistent? | Complete source-derived SQL file, expected missing temporary table in new session |
| 9 | **How Tables Relate: Keys and Relationships** (`relational-model`, **existing ID preserved**) | Why use multiple tables and what do keys actually enforce? | Disposable Author/Book example with real foreign-key rejection, many-to-many model and duplication anomaly |
| 10 | **Combine Tables with JOIN** (`postgresql-first-joins`) | How are related rows matched and how does LEFT JOIN preserve missing books? | Reproducible INNER, LEFT, CROSS JOIN on library data; wrong Cartesian product |
| 11 | **Count Rows and Summarize Groups** (`postgresql-first-grouping`) | How do COUNT and GROUP BY work, including a zero-book writer? | Real `COUNT(*)` vs `COUNT(b.id)` negative on LEFT JOIN |
| 12 | Steward Practice: Build a Reusable SQL Dataset (existing) | Apply learned mechanisms to an application domain | Real Steward SQL fixture, positive/negative tests |
| 13 | **Update Existing Rows Safely** (`sql-crud`, **existing ID preserved**) | How do UPDATE, SET, WHERE and RETURNING work without rewriting the wrong rows? | Separate fictional-book UPDATE, SELECT preview, UPDATE 1, reconnection |
| 14 | **Delete Records Without Deleting the Wrong Data** (`postgresql-delete-rows`) | How does DELETE differ from DROP TABLE and how do we verify targets? | DELETE ... RETURNING for practice row, original books preserved |

Filtering, complex joins/aggregation, subqueries, CTEs, transactions, normalization, plans, migrations and API lessons retain their own separate instructional audits. The original Steward seed used JOIN and GROUP BY before either had been taught; two stand-alone book/writer lessons now establish those mechanisms first. The seed is clearly labeled as a practice lab rather than a general PostgreSQL introduction. This change does **not** declare the whole module learner-validated.

## Follow-up — SQL filtering, NULL and ordering split (2026-11-04)

The original `Filtering and Ordering Queries` text had five short sections that mixed the logical query pipeline, operator precedence, SQL's UNKNOWN truth value, sort ties and Steward-specific business results. These are different beginner mechanisms. As with the connection lesson, app-specific SQL tests must not become the first explanation of the general topic.

Three independent library lessons now precede the existing Steward filtering case:

1. **Combine Conditions with WHERE** (`postgresql-combine-conditions`): true/false selection, AND, OR, NOT, precedence, parentheses, literal `IN`, `LIKE` and PostgreSQL `ILIKE`. Worked incorrect and corrected predicates select deliberately different books.
2. **Understand NULL in SQL** (`postgresql-null-logic`): optional data, SQL NULL vs `0`/empty text, `VALUES` read-only fixture, `= NULL` failure, `IS NULL`, `NOT UNKNOWN` and a complete executed truth-table sample. No permanent data changes.
3. **Sort and Limit Query Results** (`postgresql-sort-results`): tied years, explicit secondary key, `NULLS LAST`, `LIMIT` and `OFFSET`, plus the distinction between ambiguous tie ordering and page shifts caused by concurrent writes.

The earlier `filtering-ordering` ID and source-extracted `filter_boolean.sql`, `filter_null.sql` and `filter_order.sql` captions remain in place, but the section is titled **Steward Practice: Filter and Sort SQL Reports**. Its activity remains a real application, not a replacement for teaching generic SQL. New reading/practical/check IDs are additive; no existing learner progress IDs for this applied lesson are changed.

**Mechanism references, inspected 2026-11-04:** [PostgreSQL 17 comparison semantics](https://www.postgresql.org/docs/17/functions-comparison.html) establish ordinary comparisons and NULL-aware predicates; [PostgreSQL 17 pattern matching](https://www.postgresql.org/docs/17/functions-matching.html) describes `LIKE`/`ILIKE` and wildcard matching; [sorting reference](https://www.postgresql.org/docs/17/queries-order.html) establishes unspecified ordering without ORDER BY, tie-breaking and NULLS modifiers; [LIMIT/OFFSET reference](https://www.postgresql.org/docs/17/queries-limit.html) establishes how skipping and limiting interact. A [PostgreSQL 17 beginner course](https://courses.interlab.app/en/lessons/sql-select) was sampled for sequencing, but its example corpus and wording were not copied. Its database resets are not appropriate for TSA's progression, which preserves sample tables and makes destructive operations explicit.

**Executable evidence:** the source guard now checks the three new lessons occur after the safe UPDATE/DELETE readings and before the Steward filter audit. The PostgreSQL 17 integration script runs ten new exact published SQL blocks against the separate `tsa_library` database and asserts book set, NULL, sorting, pagination and no-persistent-change evidence. **Do not mark this pass verified until workflow success at the matching new head**, and do not mark rendered UX or learner teach-back verified from CI.

## Follow-up — subqueries and CTEs split (2026-11-04)

The original `Subqueries` and `Common Table Expressions` readings combined several independent SQL mechanics within short, Steward-dependent source sections. Their original source-derived SQL blocks and activity IDs remain in place as **application exercises**, while two beginner subquery lessons and two beginner WITH lessons now precede them.

| New lesson | What must be understood before the applied lab | Executable positive and negative example |
| --- | --- | --- |
| `postgresql-subquery-basics` — **Use One Query Inside Another** | Inner SELECT result shapes: one scalar versus an IN candidate set | Actual below-average book; an invalid multirow scalar expression rejected by PostgreSQL |
| `postgresql-exists-subqueries` — **Check Whether Matching Rows Exist** | Correlated predicate, EXISTS/NOT EXISTS vs paired JOIN rows, NULL behavior of NOT IN | Book-author membership, duplicate JOIN, empty NOT IN result and safe anti-existence comparison |
| `postgresql-with-basics` — **Make a Long Query Easier to Read with WITH** | Single query's named steps and statement scope versus persistent/TEMP objects | One- and two-stage library reports; missing relation in a subsequent statement |
| `postgresql-recursive-with` — **Follow Relationships with Recursive Queries** | Anchor, repeated transition, bounded termination, cycles and per-path visited state | Bounded 1–4 counter, Ana→Dina traversal and A↔B cycle safely stopped with an array |

**Authority and research (inspected 2026-11-04):** [PostgreSQL 17 Subquery Expressions](https://www.postgresql.org/docs/17/functions-subquery.html) defines EXISTS, IN, NOT IN and NULL-aware outcomes, including the fact that EXISTS concerns row existence rather than inner SELECT values. [PostgreSQL 17 WITH Queries](https://www.postgresql.org/docs/17/queries-with.html) defines statement-scoped expressions, recursive anchor/working-table evaluation, query optimization and explicit cycle detection. [PostgreSQL wiki CTEReadme](https://wiki.postgresql.org/wiki/CTEReadme) and [LearnSQL recursive course curriculum](https://learnsql.com/course/postgresql-recursive-queries/) are secondary structural references, not outsourced core lessons; no claim of attending the course or watching videos.

**Source and execution evidence:** the existing script `check-builder-data-foundations-examples.mjs` now checks subquery → WITH → recursion → Steward applied ordering and inspects the exact source code blocks. `check-builder-postgresql-live-lab.mjs` executes all published simple queries, verifies expected SQL failures (multirow scalar and expired WITH name), checks two NULL/duplicate traps, and verifies the guarded cycle terminates without altering the library table. **Source changes are REMEDIATED; CI and learner gates remain separate until current-head evidence is checked.**

## Follow-up — transactions, integrity and prerequisite repair (2026-11-04)

Two pre-existing pedagogical defects were identified in learner order.

First, the **production-readiness invariant** exercise executed `BEGIN` / `ROLLBACK` before the transaction module explained these commands. The entire original `production-readiness-invariant` lesson is now placed **after** the original transaction/isolation lessons, retaining its identifiers and exact SQL example captions. The original `transactions-acid` lesson has become an explicitly applied **Steward Practice: Transactions and ACID**, following two new independent lessons.

Second, the **constraints** reading assumed the learner could already distinguish UNIQUE, PRIMARY KEY, CHECK, NOT NULL and FOREIGN KEY and reason about delete actions. We now teach those mechanisms with generic advisor/course records before the original Steward constraint verification.

| Added lesson | Main concept | Live source-derived evidence |
| --- | --- | --- |
| `postgresql-transaction-basics` — **What Is a Database Transaction?** | Autocommit, BEGIN, COMMIT, ROLLBACK, atomicity versus durability/other ACID properties | Separate executable wallet_rollback.sql and wallet_commit.sql files with different final balances |
| `postgresql-savepoints` — **Recover from a Failed Statement with SAVEPOINT** | Transaction error state, savepoint rollback versus full rollback | Intentional negative CHECK, recovery, COMMIT and final valid quantity |
| `postgresql-constraints-basics` — **How PostgreSQL Prevents Invalid Data** | PRIMARY KEY, UNIQUE, NOT NULL, CHECK, FOREIGN KEY with precise meanings | Temporary advisor/course tables and four distinct rejected inserts with one valid record surviving |
| `postgresql-foreign-key-deletes` — **What Happens When You Delete a Referenced Row?** | Default parent-deletion rejection versus explicitly selected ON DELETE CASCADE, SET NULL caveats | One rejected parent deletion retaining a parent; one deliberate cascade removing a child |

**Live regression discovered a real psql boundary error.** The initial source-derived test invoked the *entire* wallet rollback script as one `psql -c` string; PostgreSQL processes a multi-command `-c` request as one server request, whose implicit transaction grouping can mean an explicit later ROLLBACK also undoes the preceding TEMP-table creation. The final SELECT then failed because the table was gone. The published lesson, however, instructed `psql -f wallet_rollback.sql`. The integration test has been corrected to execute the **exact published file** with `-f`, and the lesson now explicitly teaches this behavior instead of weakening the expected assertion. Official [psql command-option documentation](https://www.postgresql.org/docs/17/app-psql.html) confirms the multi-statement `-c` semantics.

**Primary references inspected:** [PostgreSQL transactions tutorial](https://www.postgresql.org/docs/17/tutorial-transactions.html), [BEGIN and autocommit](https://www.postgresql.org/docs/17/sql-begin.html), [isolation guarantees](https://www.postgresql.org/docs/17/transaction-iso.html), [constraints and foreign-key actions](https://www.postgresql.org/docs/17/ddl-constraints.html), and [ALTER TABLE](https://www.postgresql.org/docs/17/ddl-alter.html). All published examples were rewritten in independent language; the actual error and subsequent patch are verifiable in CI history.

**Verification boundary:** matching-head full CI, rendered UX inspection and independent learner teach-back remain separate. The first wallet regression failed as described; the corrected test is not a pass until a new matching-head workflow succeeds. The original Steward business-rule tests remain required and must not be waived.

## 2026-11-04 continuation — design, normal forms, plan literacy, indexes and operations

**Same-school scope:** Builder → Relational Data and PostgreSQL. Do not resume Technical Steward source work before this learner-sequence defect is closed.

### Pedagogical deficits corrected in this pass

| Topic | Defect observed in the old reading | New / revised learner sequence | Executable evidence on branch |
| --- | --- | --- | --- |
| Schema design | Abstract Steward-only relation/cardinality checklist without an independent design example | New `postgresql-schema-design-basics`: university Student, Course and Enrollment; keys, independent facts, optionality and repeated-course policy; then the existing `schema-design` becomes an explicitly applied Steward design activity | `enrollment_schema_demo.sql`, missing-student FK failure and count 3 in one session |
| Normalization | 1NF/2NF/3NF named in one paragraph; only a Steward Team name anomaly shown | New `postgresql-normal-forms`: first normal form and repeating groups; functional dependencies; partial dependencies on composite keys; transitive department dependency; then existing `normalization` is an applied Steward anomaly | `normal_forms_demo.sql`: one Department rename is reflected by both joined course rows |
| Query plans | Indexes were taught **before** the physical-plan reading despite using EXPLAIN; cost and loops were jargon | Move retained-ID `query-plans` before `indexes`, teach logical answer vs physical algorithm, EXPLAIN vs EXPLAIN ANALYZE, costs vs times, loops and safe measurement on library.books | `library_explain_only.sql`, `library_explain_analyze.sql`, expected matching count 1 |
| Simple indexes | Compact mixed mechanics, multicolumn design and write-cost list; five-row Steward data used for introduction | Rebuild retained-ID `indexes` on book B-tree navigation, heap access, Seq/Index scans, index-only visibility and 15,000 disposable book records | Existing `index_lab.sql` caption/source regression preserved; new content uses `book-14999` |
| Multicolumn indexes | Leading-key and index maintenance mentioned once without a worked example | New `postgresql-composite-indexes`: explain lexicographic B-tree key order, leading and non-leading filters, partial and INCLUDE distinction, and write/storage consequences | `index_composite_lab.sql` constructs 4,000 rows and asserts **40** two-key matches, **400** non-leading matches and nonzero index storage |
| PostgreSQL inspection | psql, sessions, privileges and backups compressed into one reading | Rewrite retained-ID `postgresql-practice` solely for client/server/catalog/session diagnosis | Existing `postgresql_inspect.sql` kept, plus `postgresql_session.sql` for own backend |
| Roles and privileges | No independent privilege lab; privileges named without demonstrating effective rights | New `postgresql-roles-and-privileges`: LOGIN/NOLOGIN, database CONNECT, schema USAGE/CREATE and table rights, owner/migration vs runtime roles | `postgresql_privileges.sql` plus local-only NOLOGIN `tsa_books_readonly` with SELECT true / INSERT false; requires role-create rights |
| Backup and restore | Describes pg_dump but never performs a recovery drill | New `postgresql-backup-and-restore`: custom-format dump, isolated destination, pg_restore, table count and value verification, explicit RPO/RTO/cluster-global limits | Exact shell source `library_backup_restore.sh` executed by live CI on isolated PostgreSQL, expected two titles after restore |

### Research mapping

- [PostgreSQL 17 — Using EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html): plan tree, Seq/Index Scan, cost versus actual time, row and loop semantics. Translation: learner-facing explanation of plans and read-only `EXPLAIN ANALYZE` before index experiments.
- [PostgreSQL 17 — Multicolumn Indexes](https://www.postgresql.org/docs/17/indexes-multicolumn.html): B-tree leftmost key constraints and behavior of non-leading predicates. Translation: two queries on the *same* 4,000-row scratch dataset, comparing 40 and 400 matching rows without promising one particular plan.
- [PostgreSQL 17 — Index Only Scans](https://www.postgresql.org/docs/17/indexes-index-only-scans.html) and [Visibility Map](https://www.postgresql.org/docs/17/storage-vm.html): heap visibility condition. Translation: no claim that every index-only scan avoids heap visibility checks.
- [PostgreSQL 17 — Table Privileges](https://www.postgresql.org/docs/17/ddl-priv.html) and [Schemas](https://www.postgresql.org/docs/17/ddl-schemas.html): privilege scope. Translation: read-only effective-privilege proof and separation from authentication.
- [PostgreSQL 17 — pg_dump](https://www.postgresql.org/docs/17/app-pgdump.html), [pg_restore](https://www.postgresql.org/docs/17/app-pgrestore.html): custom-format single-database dump and controlled restore. Translation: source-published shell lab, archive existence, restored rows and untouched source database.
- [PostgreSQL 17 — Monitoring Statistics](https://www.postgresql.org/docs/17/monitoring-stats.html): pg_stat_activity and ordinary role visibility restrictions. Translation: inspect only the learner's own backend.

Primary references were consulted for mechanisms and exact commands. CMU's database course schedule is available as an optional academic route, not claimed as a fully watched lecture.

### Status of verification for this continuation

- **Source rewritten:** yes, on draft [PR #357](https://github.com/enoqueJonas/tsa/pull/357). Prior IDs retained wherever an established lesson was being revised.
- **Source-extracted regression:** expanded to require ordering from schema-design basics through normalization, EXPLAIN before indexes and then operations lessons; exact runnable SQL extracted from authored source.
- **Actual PostgreSQL 17 integration:** expanded to cover real university FK failure, normal forms, EXPLAIN, multicolumn access, role permission proof and pg_dump/pg_restore. **Treat as UNVERIFIED until matching-head CI succeeds.** Binary client version and backup prerequisites must be confirmed on the CI runner; do not assume psql availability proves pg_dump compatibility.
- **Structural build and browser traversal:** requires a matching-head job after the final edits; prior 19/19 CI run does not verify this new content.
- **Manual learner-facing rendered inspection and uncoached novice transfer:** **OPEN**. A green workflow does not evaluate whether a learner can independently set up PostgreSQL, draw keys/normal forms, read a plan or perform a restore.
- **Other Builder PostgreSQL depth work:** controlled query-performance experiments, full operation/permission negative cases and any remaining incomplete module readings must be reviewed before marking the module learner-validated.

---

## 2026-11-04 continuation — performance measurement, controlled tuning and real permission-denial proof

### Learner defect repaired

The old `query-performance` reading was an approximately five-section checklist. It defined p95 and throughput in a sentence, then instructed learners to compare index performance, but its only executable SQL **never created a candidate index or reran the same query after a change**. The earlier integration test merely asserted that `EXPLAIN` printed Execution Time. Thus even a passing test did not establish a useful before/after experiment.

The previous roles chapter contained a NOLOGIN group role and a `has_table_privilege` query proving its expected grants, but it did not show the actual error when that role attempts an unauthorized SQL command. That is weaker evidence than a positive read followed by a failed write.

### New learner sequence and checks

| Lesson | Why it is separate | Published evidence |
| --- | --- | --- |
| `postgresql-measurement-basics` — **Understand Query Latency, Throughput and Percentiles** | Explain the user-request timeline, SQL server execution versus HTTP latency, percentile interpretation, representative samples and correctness criteria without prematurely asking for an index | Learner writes two separate, measurable objectives; small ordered latency example is explicitly *not* treated as production p95 evidence |
| `query-performance` (existing ID) — **Run a Controlled PostgreSQL Performance Experiment** | Change precisely one factor: create an index on the same 15,000-row TEMP dataset; compare the same selective and broad queries before and after, with deterministic correctness checks | `performance_probe.sql`: four instrumented query plans, an actual `CREATE INDEX`, expected counts `1, 3750, 1, 3750`; no fixed scan-plan or millisecond assertion |
| `postgresql-pagination` — **Return Results Safely: LIMIT, OFFSET and Keyset Pagination** | Teach large result sets, unique ordering keys, pagination work and one concrete failure caused by data inserted between page requests | `paging_stability.sql`: first page `1,2,3,4,5`; insert a book that sorts earlier; OFFSET returns `5,6,7,8,9` (duplicate 5), keyset returns `6,7,8,9,10` |
| `postgresql-roles-and-privileges` (existing new lesson ID) — additional **Prove that SELECT succeeds but INSERT is denied** section | A Boolean privilege flag does not replace a real authorization experiment | `readonly_denial.sql`: `SET ROLE tsa_books_readonly`, permitted SELECT, rejected INSERT, RESET ROLE, unchanged book count 2; **the test is run with psql -f, ON_ERROR_STOP=0 only because the error is expected** |

These are deliberately independent library/SQL exercises; only the later practice applies the results to Steward. Existing activity IDs are retained for revised existing lessons. Every new topic includes novice-oriented explanations, command context, negative interpretation and an independent transfer question.

### Verification contract

The real PostgreSQL 17 CI job extracts SQL from the actual lesson source and checks **both effects and correct results**. In addition to earlier cases, it must execute all four measured plans and stable counts, demonstrate the OFFSET overlap, and prove a denied INSERT left no row behind. The forbidden INSERT must run in the same session as `SET ROLE` and `RESET ROLE`; the test intentionally uses `psql -f` rather than the misleading multi-statement `psql -c` transaction context described earlier in this ledger.

- **Source/CI gates:** pending matching-head GitHub Actions after this change. Old green runs are explicitly not evidence for the new content.
- **Rendered learner experience:** manual desktop/mobile reading, code-block legibility, navigation and persisted progress remain open.
- **Independent learner transfer:** completion without coaching, including an unfamiliar pagination or privilege scenario, remains open.
- **Broader module coverage:** Django query behavior/N+1, migrations and remaining operational trade-offs still need final learner-depth inspection.

**Primary references checked:** [PostgreSQL 17 EXPLAIN semantics](https://www.postgresql.org/docs/17/using-explain.html) (instrumentation and network-output caveats), [PostgreSQL 17 LIMIT/OFFSET](https://www.postgresql.org/docs/17/queries-limit.html) (deterministic ordering and skipped-row cost), and [PostgreSQL 17 SET ROLE](https://www.postgresql.org/docs/17/sql-set-role.html) (effective privileges after role switching).

---

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
| [Joins Between Tables](https://www.postgresql.org/docs/17/tutorial-join.html) | INNER/LEFT matching and unmatched rows | Three writers/three books; Fátima retained with NULL and 3 × 3 CROSS JOIN |
| [Aggregate Functions](https://www.postgresql.org/docs/17/tutorial-agg.html) | COUNT and GROUP BY over query rows | Wrong 1 versus correct 0 for writer with no books, before Steward summary queries |
| [CMU 15-445 schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) | Optional deeper relational model lectures | Reference for deeper study; no claim that a video was watched |

**Important limitation:** source references establish semantics and organization. They do **not** substitute for executing the sample SQL, checking the rendered page and having a new learner use it without prompting.

## Technical verification and remaining gates

- The previously released `postgresql-first-connection` lesson/activity IDs are retained to minimize progress migration risk; new lesson IDs and substantial rewrites of the existing connection and relational-model lessons introduce new activity IDs in learner order.
- `scripts/check-builder-data-foundations-examples.mjs` verifies new boundaries, captions and source-extracted example contracts.
- `scripts/check-builder-postgresql-live-lab.mjs` is extended to execute the **exact published** DB, schema, persistent table, relational example, first JOIN/GROUP BY, UPDATE and DELETE source code against a disposable PostgreSQL 17 CI service, including wrong-database, missing table, failed NOT NULL, foreign key and session-lifetime cases. Keep the CI status **PENDING** until the actual workflow on the final branch head succeeds.
- The original Steward SQL fixture and downstream tests remain in place; the live runner must pass both new library examples and old Steward exercises.

**Exit gates deliberately still open:** complete same-commit build/test, complete browser traversal of changed lesson pages at desktop/mobile widths, manual review of rendered headings/code scrolling, newcomer independently creating another example database/schema and explaining failed connections or foreign keys. No `VALIDATED` claim without that evidence.


## Learner-reported follow-up — remove premature container prerequisites (2026-11-04)

Issue [#358](https://github.com/enoqueJonas/tsa/issues/358) followed real learner inspection of the merged first-connection page. The previous first-principles rewrite still taught its opening psql connection using an untaught container runtime. This was an actual *learner-order violation*, despite earlier source/CI passes. The learner also needed built-in psql discovery and object introspection taught explicitly, not as scattered mentions.

### Correction on `curriculum/psql-native-first-principles`

- Insert `postgresql-local-setup` between server/client concepts and the existing-ID `postgresql-first-connection`. One setup route only: a supplied authorized server; macOS Homebrew native PostgreSQL 17; Ubuntu native package/peer-authenticated local role; or Windows installer/SQL Shell. No prerequisite container tooling.
- Rewrite the **existing-ID** `postgresql-first-connection` around psql as a terminal client, the meaning of `-h`, `-p`, `-U`, `-d`, shell vs psql vs SQL, prompt/semicolons, `\\conninfo`, `\\l`, `\\du`, `\\c`, built-in `\\?`, SQL help `\\h`, `\\q`, real SQL and a safe failed connection.
- Insert `postgresql-psql-object-inspection` **after** CREATE TABLE and **before** inserting rows, so `\\dn`, `\\dt`, `\\dt library.*`, `\\d library.books`, `\\d+` and the search-path visibility trap are explained against real objects. A new table exists even before it contains rows.
- Correct downstream references that assumed `docker exec` as the original learning connection; restore consistency across later source-published SQL scripts and database operations. Keep existing activity IDs stable; new topics get new IDs.
- Add a strict source-order and content guard, plus a source-derived real-PostgreSQL script exercising psql's metadata/help commands against the actual new table.

**Research checked:** [PostgreSQL psql reference](https://www.postgresql.org/docs/17/app-psql.html) (meta-commands, syntax help, command-line options), [Homebrew versioned PostgreSQL 17 formula](https://formulae.brew.sh/formula/postgresql@17) (installation, keg-only binary, services), [Ubuntu native PostgreSQL documentation](https://ubuntu.com/server/docs/how-to/databases/install-postgresql/) (package and peer authentication), [PostgreSQL official Windows download](https://www.postgresql.org/download/windows/) (installer). All examples are framed by environment-specific authentication assumptions; neither psql --version nor pg_isready is presented as an authenticated query proof.

**Verification boundary:** Source rewritten does NOT mean build, execution, browser review or independent novice transfer have passed. Record those gates separately against the exact new commit. The current work corrects a prerequisite defect in the same Builder PostgreSQL module; it does not close the school or certify the curriculum.

---
## 2026-11-04 — published practical override remained stale after source merge

**Live learner requirement:** PostgreSQL must be teachable before Docker, and the student must learn to use psql built-in help and metadata commands.

**Failure in prior validation:** The authored reading in `builder-postgresql-deep.ts` was corrected and its source-only guard rejected Docker references. However, `builder-postgresql-quality.ts` overrides the practice activity **after** lesson construction. It still instructed students to choose the Docker lab. The published practical could therefore contradict the reading despite green source/CI checks.

**Corrections in this branch:**
- The first connection practical now uses one verified native or authorized server route. It rehearses shell, psql and SQL distinctions; `\conninfo`, `\l`, `\du`, `\?`, `\h`, `\c`, `\q`; and safe error diagnosis.
- The relational-model practical now matches its reading's `author_example` and `book_example` temporary tables, including a rejected author reference. Steward is a transfer exercise, not a hidden example prerequisite.
- The database-inspection practical is limited to read-only connection, catalog, own-session and error diagnosis. The later privileges and backup/restore lessons retain their own practical work.
- The curriculum guard inspects **both** source lesson and post-composition practical overrides. It rejects Docker from the latter and checks expected commands/examples and lesson separation.

**Verification boundary:** This is a source-level correction, not learner validation. Full source checks, PostgreSQL integration, build, and browser traversal require matching-head CI. Manual hosted-page inspection, progress persistence, and independent novice transfer remain OPEN.
