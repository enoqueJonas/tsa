import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

// The ACTUAL learner-visible Python is pulled from the source, not copied into
// a separate synthetic CI-only test. Every invocation uses a new disposable
// PostgreSQL 16 container; no real DB credentials/hosts are read.
const original=readFileSync("packages/runtime-kernel/src/paths/delivery-production-schema-evolution-deep.ts","utf8");
const source=readFileSync("packages/runtime-kernel/src/paths/delivery-schema-evolution-live-postgres.ts","utf8");
const readings=readFileSync("packages/runtime-kernel/src/paths/delivery-schema-evolution-focused-teaching.ts","utf8");
const matched=source.match(/export const schemaEvolutionPostgresProof = ("(?:\\.|[^"\\])*");/);
assert.ok(matched,"Original learner-posted Python proof missing");
const program=JSON.parse(matched[1]);
assert.ok(original.includes("code: schemaEvolutionPostgresProof"),
  "Proof is not published in the original module's learner reading");
assert.ok(original.includes("...schemaFocusedReadings.map("),
  "New focused readings not wired into original lesson");
assert.ok(original.includes("schemaFocusedExtraPractices"),
  "Original practicals not receiving live exercise");
assert.ok(original.includes("delivery-production-schema-evolution-001") &&
  original.includes("delivery-production-schema-evolution-002") &&
  original.includes("delivery-production-schema-evolution-003") &&
  original.includes("delivery-production-schema-evolution-004") &&
  original.includes("delivery-production-schema-evolution-005") &&
  original.includes("delivery-production-schema-evolution-006"),
  "One of six original activity IDs lost");
for (const suffix of ["007","008","009"]) {
  assert.ok(readings.includes("delivery-production-schema-evolution-"+suffix),
    "Missing focused subject reading "+suffix);
}
assert.ok(readings.includes("schemaFocusedExtraPractices"));
assert.ok(readings.includes("READ COMMITTED")&&readings.includes("lock_timeout"),
  "Concurrency / DDL lock mechanism must be taught, not just tested");
assert.ok(program.includes("BEGIN ISOLATION LEVEL READ COMMITTED"));
assert.ok(program.includes("postgres:16-alpine"));
assert.ok(program.includes("PostgreSQL init process complete") &&
          program.includes('probe.stdout.strip() == "1"'),
  "PostgreSQL initdb's temporary server must not satisfy final-server readiness");

assert.ok(!program.includes("POSTGRES_HOST")&&!program.includes("DATABASE_URL"),
  "Proof must not read external database connection parameters");
console.log("PASS original six IDs, three new focused readings and real PostgreSQL practice/code wiring");

const marks=[
 "PG_EXPAND_OLD_READER_WRITER_STILL_VALID",
 "PG_CONCURRENT_STALE_BACKFILL_REJECTED",
 "PG_PARTIAL_BATCH_RESUMED_IDEMPOTENTLY_WITH_RECONCILIATION",
 "PG_CONTRACT_GATE_BLOCKED_UNSAFE_TRANSITIONS",
 "PG_DISPOSABLE_CONTRACT_AFTER_EXPLICIT_GATE",
];
function run(content,name,passing) {
 const outcome=spawnSync("python3",["-c",content],{
   encoding:"utf8",timeout:145000,maxBuffer:2*1024*1024
 });
 assert.ok(!outcome.error,name+" spawn/timeout: "+String(outcome.error));
 if(passing){
   assert.equal(outcome.status,0,name+"\nstdout:\n"+outcome.stdout+
     "\nstderr:\n"+outcome.stderr);
   for(const mark of marks)assert.ok(outcome.stdout.includes(mark),name+": missing "+mark);
 } else {
   assert.notEqual(outcome.status,0,name+" erroneously accepted unsafe migration");
   assert.match(outcome.stderr,/AssertionError/,
     name+" failed for unrelated error:\n"+outcome.stderr);
 }
 console.log("PASS "+name+" status="+outcome.status);
}
run(program,"actual isolated PostgreSQL two-session expand/backfill/recover/contract",true);

const mutants=[
 ["unguarded stale UPDATE overwrites newer owner",
  "WHERE id=1 AND owner_team_id IS NULL AND owner_name='Team A'",
  "WHERE id=1"],
 ["replay backfill overwrites already migrated values",
  "WHERE id IN (2,3,4) AND owner_team_id IS NULL RETURNING id",
  "WHERE id IN (2,3,4) RETURNING id"],
 ["wrong historical mapping passes without reconciliation",
  "WHEN 'Team D' THEN 40\n       WHEN 'Team E'",
  "WHEN 'Team D' THEN 99\n       WHEN 'Team E'"],
 ["old reader wrongly admitted to contract",
  "return not old_readers and not rollback_window and inconsistent_rows == 0",
  "return not rollback_window and inconsistent_rows == 0"],
];
for(const [name,needle,wrong] of mutants){
 assert.ok(program.includes(needle),"Mutation anchor not present: "+name);
 run(program.replace(needle,wrong),"rejected unsafe schema mutant: "+name,false);
}
console.log("PASS exact-source actual PostgreSQL proof and four source-invalidating negative mutants; real application/production migration NOT_TESTED");
