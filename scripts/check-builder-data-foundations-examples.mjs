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
const crud = source.indexOf('id: "sql-crud"');
assert.ok(
  persistence > 0 && system > persistence && connection > system &&
  databases > connection && schemas > databases && tables > schemas && rows > tables && temporary > rows &&
  relational > temporary && firstJoins > relational &&
  firstGrouping > firstJoins && fixture > firstGrouping && crud > fixture,
  "The learner order must be persistence → DBMS and server → psql → database creation → schemas → table definition → rows → temporary tables → relational model → joins → grouping → applied fixture → CRUD"
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
  const sql = publishedCode("first_session.sql — run only in a disposable PostgreSQL lab database");
  for (const statement of ["CREATE TEMP TABLE", "INSERT INTO tsa_session_probe", "ORDER BY id", "BEGIN;", "ROLLBACK;", "SELECT count(*)"]) {
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
