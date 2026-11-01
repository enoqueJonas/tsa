import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

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
      ["Identity|1|1", "Payments|2|2", "Platform|2|2", "Unassigned|1|0"]],
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

  console.log(`Builder PostgreSQL live lab passed: first session/TEMP negative, 4 persisted tables, 20 published SQL examples, 5/6/4 join cardinalities and 2 rejected writes; database=${process.env.PGDATABASE}.`);
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
