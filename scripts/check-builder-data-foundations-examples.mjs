import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-postgresql-deep.ts", "utf8");
const marker = (id) => source.indexOf(`"id": "${id}"`);
const persistence = marker("from-memory-to-durable-data");
const system = marker("postgresql-what-it-is");
const connection = marker("postgresql-first-connection");
const databases = marker("postgresql-create-database");
const schemas = marker("postgresql-create-schema");
const tables = marker("postgresql-create-table");
const rows = marker("postgresql-work-with-rows");
const temporary = marker("postgresql-temporary-tables");
const relational = marker("relational-model");
const firstJoins = marker("postgresql-first-joins");
const firstGrouping = marker("postgresql-first-grouping");
const fixture = marker("steward-schema-and-seed");
const crud = marker("sql-crud");
const deletion = marker("postgresql-delete-rows");
const combineConditions = marker("postgresql-combine-conditions");
const nullLogic = marker("postgresql-null-logic");
const sortResults = marker("postgresql-sort-results");
const filtering = marker("filtering-ordering");
const subqueryBasics = marker("postgresql-subquery-basics");
const existsSubqueries = marker("postgresql-exists-subqueries");
const appliedSubqueries = marker("subqueries");
const withBasics = marker("postgresql-with-basics");
const recursiveWith = marker("postgresql-recursive-with");
const cteLesson = marker("ctes");
const transactionBasics = marker("postgresql-transaction-basics");
const savepoints = marker("postgresql-savepoints");
const transactionCase = marker("transactions-acid");
const isolation = marker("concurrent-transactions-and-isolation-levels");
const readiness = marker("production-readiness-invariant");
const constraintsBasics = marker("postgresql-constraints-basics");
const foreignKeyDeletes = marker("postgresql-foreign-key-deletes");
const constraints = marker("constraints-keys");
const queryPlans = marker("query-plans");
const indexes = marker("indexes");
const compositeIndexes = marker("postgresql-composite-indexes");
const queryPerformance = marker("query-performance");
assert.ok(
  persistence > 0 && system > persistence && connection > system &&
  databases > connection && schemas > databases && tables > schemas && rows > tables && temporary > rows &&
  relational > temporary && firstJoins > relational &&
  firstGrouping > firstJoins && fixture > firstGrouping && crud > fixture && deletion > crud && combineConditions > deletion && nullLogic > combineConditions && sortResults > nullLogic && filtering > sortResults && subqueryBasics > filtering && existsSubqueries > subqueryBasics && appliedSubqueries > existsSubqueries && withBasics > appliedSubqueries && recursiveWith > withBasics && cteLesson > recursiveWith && transactionBasics > cteLesson && savepoints > transactionBasics && transactionCase > savepoints && isolation > transactionCase && readiness > isolation && constraintsBasics > readiness && foreignKeyDeletes > constraintsBasics && constraints > foreignKeyDeletes && queryPlans > constraints && indexes > queryPlans && compositeIndexes > indexes && queryPerformance > compositeIndexes,
  "The learner order must be persistence → DBMS and server → psql → database creation → schemas → table definition → rows → temporary tables → relational model → joins → grouping → applied fixture → UPDATE → DELETE → Boolean filters → NULL → ordering → Steward filtering case"
);
assert.doesNotMatch(source, /Two programs, one protocol boundary|Establish prerequisites without inventing credentials/);
assert.ok(!source.includes('"id": "postgresql-tables-and-rows"'), "Do not reintroduce a duplicate combined CREATE TABLE/row chapter");
assert.ok(source.includes("schema_name.table_name") || source.includes("library.books"), "Qualified tables must be explained");

function publishedCode(caption) {
  const anchor = source.indexOf(`"caption": "${caption}"`);
  assert.ok(anchor > 0, `Missing published teaching snippet: ${caption}`);
  const match = source.slice(anchor).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(match, `Unparseable teaching snippet: ${caption}`);
  return JSON.parse(match[1]);
}

const code = publishedCode("persistence_lab.py — published executable file-backed experiment");
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-builder-persistence-"));
try {
  fs.writeFileSync(path.join(directory, "persistence_lab.py"), code);
  const run = (action, status, output) => {
    const result = spawnSync("python3", ["persistence_lab.py", action], { cwd: directory, encoding: "utf8", timeout: 10000 });
    assert.ifError(result.error);
    assert.equal(result.status, status, `Unexpected exit from ${action}: ${result.stderr}`);
    assert.equal(result.stdout.trim(), output, `Unexpected learner-visible output from ${action}`);
  };
  run("reset", 0, "RESET: []");
  run("add-payments", 0, "ADDED: Payments API");
  run("read", 0, "READ: Payments API");
  run("add-identity", 0, "ADDED: Identity API");
  run("read", 0, "READ: Payments API, Identity API");
  const saved = JSON.parse(fs.readFileSync(path.join(directory, "steward-snapshot.json"), "utf8"));
  assert.deepEqual(saved.services.map(item => item.name), ["Payments API", "Identity API"]);
  run("corrupt", 0, "CORRUPTED");
  run("read", 2, "ERROR: missing or invalid snapshot");
  assert.equal(fs.readFileSync(path.join(directory, "steward-snapshot.json"), "utf8"), '{"services": [', "Bad data must not be silently replaced");
  run("reset", 0, "RESET: []");
  run("read", 0, "READ:");
  const databaseSQL = publishedCode("SQL in the postgres database — create tsa_library");
  assert.match(databaseSQL, /CREATE DATABASE tsa_library;/, "Learner must see real database creation SQL");
  const schemaSQL = publishedCode("SQL in tsa_library — create and inspect the library schema");
  assert.match(schemaSQL, /CREATE SCHEMA library;/, "Learner must see real schema creation SQL");
  const tableSQL = publishedCode("SQL in tsa_library — create a persistent table");
  for (const fragment of ["CREATE TABLE library.books", "PRIMARY KEY", "NOT NULL", "CHECK"]) {
    assert.ok(tableSQL.includes(fragment), `Missing table tutorial concept: ${fragment}`);
  }
  const insertSQL = publishedCode("SQL — insert two example books");
  assert.match(insertSQL, /INSERT INTO library.books/);
  const columnCheck = publishedCode("SQL — inspect your book table columns");
  assert.match(columnCheck, /information_schema.columns/, "First-table lesson needs catalog inspection");
  const filterSQL = publishedCode("SQL — filter books by publication year");
  assert.match(filterSQL, /WHERE published_year >= 1950/, "Row-query lesson must teach WHERE");
  const querySQL = publishedCode("SQL — read persistent rows");
  assert.match(querySQL, /ORDER BY book_id;/);
  const booleanExample = publishedCode("where_parentheses.sql — two different sets of books");
  assert.match(booleanExample, /author = 'Chinua Achebe'/);
  assert.match(booleanExample, /AND \(author = 'Chinua Achebe' OR title = 'The Hobbit'\)/);
  const inExample = publishedCode("where_in.sql — match a list of authors");
  assert.match(inExample, /author IN \(/);
  const patternExample = publishedCode("where_like.sql — compare LIKE and ILIKE");
  assert.match(patternExample, /ILIKE 'the%'/);
  const nullExample = publishedCode("null_equality.sql — compare = NULL with IS NULL");
  assert.match(nullExample, /year = NULL/);
  assert.match(nullExample, /year IS NULL/);
  const truthExample = publishedCode("null_truth_table.sql — inspect TRUE FALSE and UNKNOWN");
  assert.match(truthExample, /COALESCE/);
  assert.match(truthExample, /NOT \(year >= 1950\)/);
  const sortExample = publishedCode("sort_all.sql — tie-breakers and missing years");
  assert.match(sortExample, /ORDER BY published_year DESC NULLS LAST, title ASC/);
  const pageExample = publishedCode("sort_offset.sql — skip one row then take two");
  assert.match(pageExample, /LIMIT 2 OFFSET 1/);
  assert.ok(source.includes('"title": "Steward Practice: Filter and Sort SQL Reports"'),
    "Applied Steward example must be labeled as a practice, not the novice's first SQL lesson");
  const scalarExample = publishedCode("subquery_library_average.sql — a computed scalar threshold");
  assert.match(scalarExample, /published_year < \(SELECT AVG\(published_year\)/);
  const wrongScalar = publishedCode("subquery_library_scalar_fail.sql — expected multirow scalar error");
  assert.match(wrongScalar, /SELECT published_year FROM library.books/);
  const inSubquery = publishedCode("subquery_library_in.sql — membership in computed authors");
  assert.match(inSubquery, /WHERE author IN \(/);
  const existsExample = publishedCode("exists_library_match.sql — one correlated existence check");
  assert.match(existsExample, /WHERE chosen.author = b.author/);
  const notExistsExample = publishedCode("exists_library_missing.sql — find books outside a chosen author list");
  assert.match(notExistsExample, /WHERE NOT EXISTS/);
  const notInExample = publishedCode("exists_library_not_in_null.sql — NOT IN returns none; NOT EXISTS returns two");
  assert.match(notInExample, /NULL::integer/);
  assert.match(notInExample, /WHERE NOT EXISTS/);
  assert.ok(source.includes('"title": "Steward Practice: Subqueries and Missing Relationships"'),
    "Steward subquery case must follow, not replace, generic SQL instruction");
  const withOne = publishedCode("cte_library_one.sql — named recent books");
  assert.match(withOne, /WITH recent_books AS/);
  const withTwo = publishedCode("cte_library_two.sql — staged count and earliest year");
  assert.match(withTwo, /year_summary AS/);
  const missingCTE = publishedCode("cte_library_scope_fail.sql — name unavailable after the statement");
  assert.match(missingCTE, /SELECT \* FROM recent_books/);
  const counter = publishedCode("cte_recursion_numbers.sql — bounded counter");
  assert.match(counter, /WITH RECURSIVE counter/);
  assert.match(counter, /WHERE n < 4/);
  const cycle = publishedCode("cte_recursion_cycle.sql — safe walk across A and B");
  assert.match(cycle, /ANY\(walk.seen\)/);
  assert.ok(source.includes('"title": "Steward Practice: CTE Reports and Dependency Traversal"'),
    "Steward CTE case must be an application of previously taught SQL");
  const txnRollback = publishedCode("wallet_rollback.sql — transfer and undo two writes");
  assert.match(txnRollback, /BEGIN;/);
  assert.match(txnRollback, /ROLLBACK;/);
  const txnCommit = publishedCode("wallet_commit.sql — commit both transfer updates");
  assert.match(txnCommit, /COMMIT;/);
  const stockSavepoint = publishedCode("stock_savepoint.sql — recover after an expected CHECK error");
  assert.match(stockSavepoint, /SAVEPOINT before_bad_update;/);
  assert.match(stockSavepoint, /ROLLBACK TO SAVEPOINT before_bad_update;/);
  assert.ok(source.includes('"title": "Steward Practice: Transactions and ACID"'));
  assert.ok(source.includes('"title": "Steward Practice: Verify Production Readiness"'));
  const validConstraints = publishedCode("constraints_lab_valid.sql — create two constrained course tables");
  for (const name of ["PRIMARY KEY", "NOT NULL", "UNIQUE", "REFERENCES advisor_example", "CHECK (seats >= 0)"]) {
    assert.ok(validConstraints.includes(name), "Missing introductory constraint: " + name);
  }
  const invalidConstraints = publishedCode("constraints_lab_failures.sql — four independent constraint errors");
  for (const invalid of ["'DB101', 'Duplicate'", "'ORPHAN'", "'NEGATIVE'", "'NO-TITLE', NULL"]) {
    assert.ok(invalidConstraints.includes(invalid), "Missing deliberate invalid insert: " + invalid);
  }
  const restrictiveDelete = publishedCode("fk_delete_restrict.sql — referenced parent cannot be deleted");
  assert.match(restrictiveDelete, /REFERENCES advisor_restrict\(id\)/);
  const cascadingDelete = publishedCode("fk_delete_cascade.sql — child removed with deleted parent");
  assert.match(cascadingDelete, /ON DELETE CASCADE/);
  assert.ok(source.includes('"title": "Steward Practice: Enforce Data Constraints"'));
  const explainSql = publishedCode("library_explain_analyze.sql — estimate, measure and verify a book query");
  assert.match(explainSql, /EXPLAIN \(ANALYZE, BUFFERS\)/, "Query-plan lesson must execute a measured SELECT");
  const indexSql = publishedCode("index_lab.sql — compare actual physical plans on 15000 temporary rows");
  assert.match(indexSql, /CREATE INDEX tsa_probe_slug_idx/, "Index lesson must compare before and after a real index");
  const compositeSql = publishedCode("index_composite_lab.sql — compare leading and non-leading predicates on 4000 books");
  assert.match(compositeSql, /ON tsa_index_order_probe\(shelf_id, priority\)/);
  assert.match(compositeSql, /WHERE priority = 7/, "Must contrast non-leading predicate");
  const sql = publishedCode("first_session.sql — run only in a disposable PostgreSQL lab database");
  for (const statement of ["CREATE TEMP TABLE", "INSERT INTO tsa_session_probe", "ORDER BY id", "SELECT count(*)"]) {
    assert.ok(sql.includes(statement), `Missing SQL teaching concept: ${statement}`);
  }
  const relationalExample = publishedCode("relational_author_books.sql — two related temporary tables");
  for (const fragment of ["CREATE TEMP TABLE author_example", "CREATE TEMP TABLE book_example", "REFERENCES author_example(id)", "INSERT INTO author_example"]) {
    assert.ok(relationalExample.includes(fragment), `Missing first-principles relational teaching: ${fragment}`);
  }
  assert.doesNotMatch(relationalExample, /CREATE TABLE team/, "New conceptual lessons must not create Steward schema tables");
  const firstJoinSetup = publishedCode("join_first_setup.sql — temporary writers and books");
  const joinExample = publishedCode("join_first_left.sql — retain the writer with no book");
  const crossExample = publishedCode("join_first_cross.sql — count the unwanted combinations");
  const countSetup = publishedCode("group_first_setup.sql — three writers, three books");
  const countExample = publishedCode("group_first_left_count.sql — compare correct and wrong counts");
  assert.match(firstJoinSetup, /CREATE TEMP TABLE join_writer/);
  assert.match(joinExample, /LEFT JOIN join_book/);
  assert.match(crossExample, /CROSS JOIN join_book/);
  assert.match(countSetup, /CREATE TEMP TABLE count_writer/);
  assert.ok(countExample.includes("COUNT(b.id)"));
  assert.match(countExample, /GROUP BY/);
  const seed = publishedCode("steward_schema_seed.sql — complete one-time PostgreSQL teaching fixture");
  const verification = publishedCode("verify_steward_seed.sql — three result shapes the learner can predict");
  const tableNames = ["team", "service", "environment", "service_dependency"];
  for (const name of tableNames) {
    assert.ok(seed.includes(`CREATE TABLE ${name} (`), `Missing permanent table in teaching fixture: ${name}`);
    assert.ok(!seed.includes(`CREATE TEMP TABLE ${name}`), `Fixture must be durable rather than session-local: ${name}`);
  }
  for (const field of ["owning_team_id", "endpoint", "active boolean", "age_days", "criticality", "lifecycle", "retired_at", "kind", "source_service_id", "target_service_id"]) {
    assert.ok(seed.includes(field), `Later SQL lesson prerequisite column missing: ${field}`);
  }
  for (const name of ["Payments API", "Payroll API", "Identity API", "Catalogue API", "Legacy Gateway"]) {
    assert.ok(seed.includes(name), `Seed omits named service ${name}`);
  }
  assert.ok(seed.includes("CHECK (source_service_id <> target_service_id)"));
  assert.ok(seed.includes("UNIQUE (source_service_id, target_service_id)"));
  assert.ok(verification.includes("LEFT JOIN environment"), "NULL-preserving observation must be taught");
  assert.ok(verification.includes("JOIN service src") && verification.includes("JOIN service dst"), "Directed dependency example missing");
  assert.ok(source.includes("psql -X -v ON_ERROR_STOP=1 -1 -f steward_schema_seed.sql"), "Atomic failure-stopping execution command missing from reading");
  console.log("Builder data foundations examples passed: persistence recovery, progressive PostgreSQL server/psql/database/schema/table/TEMP/JOIN/GROUP teaching order, SQL source contracts, and canonical Steward fixture. Real PostgreSQL execution is separately tested.");

} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
