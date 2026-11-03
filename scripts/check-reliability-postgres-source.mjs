import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const root = "packages/runtime-kernel/src/paths/";
const lesson = readFileSync(root + "reliability-database-stewardship-deep.ts", "utf8");
const proof = readFileSync(root + "reliability-postgres-query-proof.ts", "utf8");
assert.ok(lesson.includes("...(databaseQueryProofById[spec.id] ?? [])"), "SQL lab must appear in the original DB reading");
const prefix = "export const postgresExplainSql = ";
const assignment = proof.split("\n").find(line => line.startsWith(prefix));
assert.ok(assignment?.endsWith(";"), "Cannot extract exact published PostgreSQL SQL");
const sql = JSON.parse(assignment.slice(prefix.length, -1));
for (const expected of ["CREATE TEMP TABLE", "BEGIN;", "ROLLBACK;", "EXPLAIN (ANALYZE, BUFFERS", "statement_timeout"]) {
  assert.ok(sql.includes(expected), "Unsafe or incomplete PostgreSQL teaching experiment: " + expected);
}
assert.ok(!sql.includes("DROP DATABASE") && !sql.includes("TRUNCATE ") && !sql.includes("DROP TABLE"),
  "The learner lab cannot modify persistent schema");
const db = spawnSync("psql", ["-X", "-v", "ON_ERROR_STOP=1", "-q"], {
  input: sql, encoding: "utf8", timeout: 45000, maxBuffer: 4 * 1024 * 1024,
});
assert.ifError(db.error);
assert.equal(db.status, 0, "PostgreSQL failed exact learner SQL: " + db.stderr);
assert.match(db.stdout, /BEFORE_INDEX/);
assert.match(db.stdout, /AFTER_INDEX/);
assert.match(db.stdout, /expected_100[\s\S]*100/);
console.log("PASS actual PostgreSQL 17 plans before and after index on 50k disposable rows; temporary transaction rolled back; production performance UNVERIFIED.");
