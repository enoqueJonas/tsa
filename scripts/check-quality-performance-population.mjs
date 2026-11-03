import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const source = readFileSync("packages/runtime-kernel/src/paths/quality-non-functional-deep.ts", "utf8");
const match = source.match(/const measurementEvidencePython = ("(?:\\.|[^"\\])*");/);
assert.ok(match && source.includes('code:measurementEvidencePython'), "Original performance-measurement reading must display the exact executable model");
const program = JSON.parse(match[1]);
const run = spawnSync("python3", ["-c", program], {encoding:"utf8",timeout:10000});
assert.ifError(run.error);
assert.equal(run.status,0,run.stderr);
for(const expected of [
  "attempted=100 successful=10 errors=90",
  "mean_all_ms=11.8 completed_rps=10.0 successful_rps=1.0",
  "error_rate=90.0%",
  "negative: naive latency-only gate would incorrectly PASS",
  "success_p95_ms=100",
  "zero-success population: latency=UNKNOWN, not zero",
]) assert.ok(run.stdout.includes(expected), "Original Quality performance evidence missing: "+expected);
console.log("PASS exact nonfunctional Quality performance classroom model: fast-error false green, throughput, and UNKNOWN zero-success population.");
