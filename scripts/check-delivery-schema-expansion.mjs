import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const content = readFileSync("packages/runtime-kernel/src/paths/delivery-production-schema-evolution-deep.ts", "utf8");
const anchor = 'caption: "Disposable PostgreSQL table:';
const pos = content.indexOf(anchor);
assert.ok(pos >= 0, "Published disposable PostgreSQL teaching example not found");
const match = content.slice(pos).match(/code: ("(?:\\.|[^"\\])*")/);
assert.ok(match, "Could not extract exact learner SQL from TypeScript");
const sql = JSON.parse(match[1]);
assert.ok(sql.includes("CREATE TEMP TABLE tsa_customers"));
assert.ok(sql.includes("ROLLBACK;"));
const result = spawnSync("psql", ["-X", "-qAt", "-v", "ON_ERROR_STOP=1"], {
  input: sql, encoding: "utf8", timeout: 12000,
});
assert.ifError(result.error);
assert.equal(result.status, 0, result.stderr + "\n" + result.stdout);
const counts = result.stdout.split(/\r?\n/).map(x => x.trim()).filter(x => /^\d+$/.test(x));
assert.deepEqual(counts, ["2", "0"], "Before/after missing-name counts must be exactly 2 then 0");
console.log("Delivery SQL learner fixture passed against live disposable PostgreSQL: 2 before, 0 after, rolled back.");
