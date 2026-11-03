import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Execute exactly the code learners see in the original Quality Steward
// Boundary Value Analysis reading; reject a detached test-only fixture.
const src = readFileSync("packages/runtime-kernel/src/paths/quality-test-analysis-design-deep.ts", "utf8");
assert.ok(src.includes("code: boundaryValuePython, language: \"python\""), "Original source lesson must publish its executable oracle");
const match = src.match(/const boundaryValuePython = ("(?:\\.|[^"\\])*");/);
assert.ok(match, "Missing source-published boundary value Python");
const learnerCode = JSON.parse(match[1]);
const result = spawnSync("python3", ["-c", learnerCode], { encoding: "utf8", timeout: 10000 });
assert.ifError(result.error);
assert.equal(result.status, 0, result.stderr);
assert.ok(result.stdout.includes("boundary: 6/6 independent contract cases passed"), "Positive boundary proof missing");
assert.ok(result.stdout.includes("negative: exclusive-bound mutant detected at lengths 3 and 80"), "Mutation must be detected at exact edges");
console.log("PASS Quality Steward original Boundary Value Analysis: 6 independent cases and off-by-one negative control.");
