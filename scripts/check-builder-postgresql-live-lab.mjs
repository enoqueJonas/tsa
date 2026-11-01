import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

// This is an *actual PostgreSQL execution test*, unlike the source-only smoke guard.
// It is intended only for a fresh, isolated database in GitHub Actions.
const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-postgresql-deep.ts", "utf8");
const requiredEnv = ["PGHOST", "PGPORT", "PGDATABASE", "PGUSER", "PGPASSWORD"];
for (const name of requiredEnv) assert.ok(process.env[name], `A disposable PostgreSQL lab needs ${name}`);
assert.equal(process.env.PGDATABASE, "tsa_steward_lab", "Never execute destructive learning setup against an arbitrary DB");

function codeFromLesson(caption) {
  const i = source.indexOf(`"caption": "${caption}"`);
  assert.ok(i > 0, `Missing published lesson block: ${caption}`);
  const m = source.slice(i).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(m, `Malformed published lesson block: ${caption}`);
  return JSON.parse(m[1]);
}
const root = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-pg-lesson-"));
const run = (args, expectedStatus = 0) => {
  const p = spawnSync("psql", ["-X", "-v", "ON_ERROR_STOP=1", "-At", "-F", "|", ...args], {
    encoding: "utf8", timeout: 20000, env: process.env
  });
  assert.ifError(p.error);
  assert.equal(p.status, expectedStatus, `psql status ${p.status} for ${args.join(" ")}\nSTDOUT:\n${p.stdout}\nSTDERR:\n${p.stderr}`);
  return { out: p.stdout.trim(), err: p.stderr.trim() };
};
const verify = (caption, expectedLines) => {
  const output = run(["-c", codeFromLesson(caption)]).out;
  assert.deepEqual(output ? output.split(/\r?\n/) : [], expectedLines, `Published SQL sample has incorrect result: ${caption}`);
};
try {
  const initial = run(["-c", "SELECT current_database(), current_user, 2+2"]).out;
  assert.equal(initial, "tsa_steward_lab|tsa_learner|4");

  const firstFile = path.join(root, "first_session.sql");
  fs.writeFileSync(firstFile, codeFromLesson("first_session.sql — run only in a disposable PostgreSQL lab database"));
  const firstOutput = run(["-f", firstFile]).out;
  assert.match(firstOutput, /Payments API/);
  assert.match(firstOutput, /Identity API/);
  assert.match(firstOutput, /\n2$/m);
  const missingTemp = run(["-c", "SELECT * FROM tsa_session_probe;"], 1);
  assert.match(missingTemp.err, /relation "tsa_session_probe" does not exist/);

  const file = path.join(root, "steward_schema_seed.sql");
  fs.writeFileSync(file, codeFromLesson("steward_schema_seed.sql — complete one-time PostgreSQL teaching fixture"));
  run(["-1", "-f", file]);
  const names = run(["-c", "SELECT count(*) FROM service"]).out;
  assert.equal(names, "5");
  const sizes = run(["-c", "SELECT (SELECT count(*) FROM team),(SELECT count(*) FROM environment),(SELECT count(*) FROM service_dependency)"]).out;
  assert.equal(sizes, "3|4|2");

  const cases = [
    ["filter_boolean.sql — retired-record leak and its corrected predicate",
      ["Identity API", "Legacy Gateway", "Payroll API", "Identity API", "Payroll API"]],
    ["filter_null.sql — wrong equality, correct IS NULL and UNKNOWN",
      ["Catalogue API", "Identity API", "Payments API", "Payroll API", "UNKNOWN|UNKNOWN"]],
    ["filter_order.sql — deterministic top results with a unique tie-breaker",
      ["Catalogue API|medium", "Identity API|critical", "Payments API|high"]],
    ["join_owner.sql — reconstruct the authoritative owner",
      ["Catalogue API|Platform", "Identity API|Identity", "Legacy Gateway|Platform", "Payments API|Payments", "Payroll API|Payments"]],
    ["join_optional.sql — keep Payroll and expose two Payments environments",
      ["Payments API|production", "Payments API|staging", "Payroll API|"]],
    ["join_on_where.sql — two different results from one predicate",
      ["Payments API|production", "Payroll API|", "Payments API|production"]],
    ["join_right.sql — RIGHT JOIN rewritten as the equivalent LEFT JOIN",
      ["Payroll API|", "Payroll API|"]],
    ["join_dependencies.sql — decode both ends of a directed edge",
      ["Payments API|Identity API", "Payroll API|Payments API"]],
    ["aggregate_team.sql — group at Team identity with a valid Service count",
      ["Identity|1", "Payments|2", "Platform|2"]],
    ["aggregate_zero.sql — count joined rows versus real Service identities",
      ["Unassigned|1|0"]],
    ["aggregate_having.sql — filter active matches then threshold groups",
      ["Payments|2"]],
    ["aggregate_inflation.sql — observe overcount and correctly count Service identities",
      ["Identity|1|1", "Payments|3|2", "Platform|2|2"]],
    ["aggregate_nulls.sql — define two populations in one report", ["5|1|2"]],
    ["subquery_in.sql — derive a set of owning Team identities", ["Payments API", "Payroll API"]],
    ["subquery_exists.sql — correlate an existence test to one Service", ["Catalogue API", "Identity API", "Payments API"]],
    ["subquery_scalar.sql — one count per Team", ["Identity|1", "Payments|2", "Platform|2"]],
    ["subquery_not_in.sql — the NULL trap and a safe anti-existence test", ["2", "3"]],
    ["cte_priority.sql — inspectable two-stage priority dependency count", ["Identity API|0", "Payments API|1", "Payroll API|1"]],
    ["cte_recursive.sql — bounded dependency walk with visited-node guard", ["Payroll API|0", "Payments API|1", "Identity API|2"]],
    ["cte_cycle.sql — read-only cyclic graph and explicit termination", ["A|0", "B|1"]]
  ];
  for (const [caption, expected] of cases) verify(caption, expected);
  const rowCounts = run(["-c", "SELECT (SELECT count(*) FROM service), (SELECT count(*) FROM service s LEFT JOIN environment e ON e.service_id=s.id), (SELECT count(*) FROM service s INNER JOIN environment e ON e.service_id=s.id)"]).out;
  assert.equal(rowCounts, "5|6|4");

  const noTeam = run(["-c", "INSERT INTO service(name, owning_team_id, endpoint) VALUES('Orphan',-1,'https://orphan.example.invalid');"], 1);
  assert.match(noTeam.err, /violates foreign key constraint/);
  const repeat = run(["-c", "INSERT INTO service(name, owning_team_id, endpoint) SELECT 'Payments API', id, 'https://duplicate.example.invalid' FROM team WHERE name='Payments';"], 1);
  assert.match(repeat.err, /duplicate key value violates unique constraint/);
  assert.equal(run(["-c", "SELECT count(*) FROM service"]).out, "5");

  // Run the exact published transaction scripts, then verify their effects from new connections.
  const transactionSql = (filename, caption) => {
    const filepath = path.join(root, filename);
    fs.writeFileSync(filepath, codeFromLesson(caption));
    return filepath;
  };
  const rolledBack = run(["-f", transactionSql("txn_rollback.sql", "txn_rollback.sql — demonstrate a deliberate rollback of a Service insert")]).out;
  assert.match(rolledBack, /inside\|1/);
  assert.match(rolledBack, /after\|0/);
  assert.equal(run(["-c", "SELECT count(*) FROM service WHERE name='Txn Rollback Demo'"]).out, "0");
  run(["-f", transactionSql("txn_commit.sql", "txn_commit.sql — commit Service plus initial Environment together")]);
  assert.equal(run(["-c", "SELECT s.name, e.kind FROM service s JOIN environment e ON e.service_id=s.id WHERE s.name='Txn Commit Demo'"]).out, "Txn Commit Demo|production");
  const recovered = run(["-f", transactionSql("txn_savepoint.sql", "txn_savepoint.sql — recover from one expected SQL error")]);
  assert.match(recovered.err, /violates check constraint/);
  assert.match(recovered.out, /Txn Savepoint Demo\|production/);
  assert.equal(run(["-c", "SELECT count(*) FROM environment e JOIN service s ON s.id=e.service_id WHERE s.name='Txn Savepoint Demo'"]).out, "1");
  assert.equal(run(["-c", "SELECT count(*) FROM service WHERE name='Txn Rollback Demo'"]).out, "0");

  // One client cannot prove isolation: use two live, independently connected psql processes.
  const isolationSql = codeFromLesson("isolation_setup.sql — one isolated probe row for the two-session exercise");
  assert.equal(run(["-c", isolationSql]).out.split(/\r?\n/).at(-1), "10");
  const makeSession = (name) => {
    const child = spawn("psql", ["-X", "-A", "-t", "-F", "|", "-q", "-v", "ON_ERROR_STOP=1"], {
      env: process.env, stdio: ["pipe", "pipe", "pipe"]
    });
    const session = { name, child, out: "", err: "", ended: false };
    child.stdout.on("data", buf => { session.out += buf.toString(); });
    child.stderr.on("data", buf => { session.err += buf.toString(); });
    child.on("exit", () => { session.ended = true; });
    return session;
  };
  const sessions = [makeSession("A"), makeSession("B")];
  const stage = async (session, label, statements, expected) => {
    const marker = `__TSA_${label}`;
    session.child.stdin.write(statements.trim() + "\n" + `SELECT '${marker}', value FROM tsa_isolation_probe WHERE id=1;\n`);
    const target = `${marker}|${expected}`;
    for (let i = 0; i < 200; i++) {
      if (session.out.split(/\r?\n/).includes(target)) return;
      if (session.ended) throw new Error(`Session ${session.name} closed: ${session.err}\n${session.out}`);
      if (session.err.includes("ERROR:")) throw new Error(`Session ${session.name}: ${session.err}`);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    throw new Error(`No observation ${target} in session ${session.name}: ${session.out}\n${session.err}`);
  };
  try {
    const A = sessions[0], B = sessions[1];
    await stage(A, "rc_first", "BEGIN ISOLATION LEVEL READ COMMITTED;", 10);
    await stage(B, "rc_uncommitted_b", "BEGIN; UPDATE tsa_isolation_probe SET value=20 WHERE id=1;", 20);
    await stage(A, "rc_pending", "SELECT 1;", 10);
    await stage(B, "rc_committed_b", "COMMIT;", 20);
    await stage(A, "rc_after", "SELECT 1;", 20);
    await stage(A, "rc_end", "COMMIT;", 20);
    await stage(B, "rr_reset", "UPDATE tsa_isolation_probe SET value=10 WHERE id=1;", 10);
    await stage(A, "rr_first", "BEGIN ISOLATION LEVEL REPEATABLE READ;", 10);
    await stage(B, "rr_changed", "BEGIN; UPDATE tsa_isolation_probe SET value=20 WHERE id=1; COMMIT;", 20);
    await stage(A, "rr_same_snapshot", "SELECT 1;", 10);
    await stage(A, "rr_after_end", "COMMIT;", 20);
  } finally {
    for (const session of sessions) {
      session.child.stdin.end("\\q\n");
      session.child.kill();
    }
  }
  assert.equal(run(["-c", "SELECT value FROM tsa_isolation_probe WHERE id=1"]).out, "20");
  run(["-c", "DROP TABLE tsa_isolation_probe;"]);
  run(["-c", "BEGIN; DELETE FROM environment WHERE service_id IN (SELECT id FROM service WHERE name IN ('Txn Commit Demo','Txn Savepoint Demo')); DELETE FROM service WHERE name IN ('Txn Commit Demo','Txn Savepoint Demo'); COMMIT;"]);
  assert.equal(run(["-c", "SELECT count(*) FROM service"]).out, "5");
  // Directly execute the cross-table product-invariant lesson, including its negative baseline and reversible repair.
  const missingBefore = run(["-c", codeFromLesson("readiness_missing.sql — detect production-stage Services without production deployment")]).out;
  assert.equal(missingBefore, "Payroll API");
  const readinessRepair = run(["-c", codeFromLesson("readiness_repair.sql — reversible cross-table invariant repair")]).out;
  assert.match(readinessRepair, /INSERT 0 1/);
  assert.match(readinessRepair, /(^|\\n)0(\\n|$)/);
  assert.equal(run(["-c", codeFromLesson("readiness_missing.sql — detect production-stage Services without production deployment")]).out, "Payroll API");
  assert.equal(run(["-c", "SELECT count(*) FROM environment WHERE service_id=(SELECT id FROM service WHERE name='Payroll API')"]).out, "0");
  // Complete the rest of the PostgreSQL path using the learner-visible examples.
  const constraints = run(["-c", codeFromLesson("constraints_inspect.sql — inspect actual deployed integrity rules")]).out;
  assert.match(constraints, /FOREIGN KEY/);
  assert.match(constraints, /UNIQUE/);
  const attempts = codeFromLesson("constraints_failures.sql — four isolated invalid inserts").split(";").map(x => x.trim()).filter(Boolean);
  assert.equal(attempts.length, 4);
  for (const sql of attempts) {
    const bad = run(["-c", sql+";"], 1);
    assert.match(bad.err, /violates (unique|foreign key|check) constraint|duplicate key value/);
  }
  assert.equal(run(["-c", "SELECT count(*) FROM service"]).out, "5");
  const slug = run(["-c", codeFromLesson("constraints_slug.sql — reversible uniqueness evolution")]).out;
  assert.match(slug, /payments-api/);
  assert.equal(run(["-c", "SELECT count(*) FROM information_schema.columns WHERE table_name='service' AND column_name='slug'"]).out, "0");
  const schema = run(["-c", codeFromLesson("schema_extension.sql — disposable memberships and historical reviews")]).out;
  assert.match(schema, /followup/);
  assert.match(schema, /pass/);
  const anomaly = run(["-c", codeFromLesson("normalization_anomaly.sql — two competing team names in one duplicated column")]).out;
  assert.match(anomaly, /Payments Division/);
  assert.match(anomaly, /Payroll API\|Payments/);
  const smallPlan = run(["-c", codeFromLesson("index_small.sql — inspect an already indexed unique Service name")]).out;
  assert.match(smallPlan, /(Scan|scan)/);
  const largePlan = run(["-c", codeFromLesson("index_lab.sql — compare actual physical plans on 15000 temporary rows")]).out;
  assert.match(largePlan, /Execution Time/);
  assert.match(largePlan, /CREATE INDEX/);
  const joinPlan = run(["-c", codeFromLesson("explain_join.sql — inspect query plan and correct grouped result")]).out;
  assert.match(joinPlan, /Execution Time/);
  const perfPlan = run(["-c", codeFromLesson("performance_probe.sql — compare selective and broad predicates")]).out;
  assert.match(perfPlan, /Execution Time/);
  const metadata = run(["-c", codeFromLesson("postgresql_inspect.sql — verify connection and visible Service relation")]).out;
  for (const table of ["team","service","environment","service_dependency"]) assert.ok(metadata.split(/\r?\n/).includes(table), `Cannot see ${table}`);
  console.log(`Builder PostgreSQL live lab passed: first session/TEMP negative, 4 persisted tables, 20 published SQL examples, 5/6/4 join cardinalities, 2 rejected writes, 3 transaction scripts with savepoint failure, 2-session Read Committed/Repeatable Read, cross-table release-readiness detection and rollback proof; database=${process.env.PGDATABASE}.`);

} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
