import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Inspect the exact Python code shown to learners, rather than a copied fixture.
const source = readFileSync(
  "packages/runtime-kernel/src/paths/system-thinker-file-handoff-examples.ts",
  "utf8",
);
const caption = "Executable same-filesystem handoff and durable identity ledger with 4 negative/replay outcomes";
const anchor = source.indexOf('"caption": ' + JSON.stringify(caption));
assert.ok(anchor >= 0, "Missing published file-handoff code caption");
const match = source.slice(anchor, anchor + 12000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(match, "Cannot extract the published executable file-handoff code");
const code = JSON.parse(match[1]);
const result = spawnSync("python3", ["-c", code], {encoding:"utf8",timeout:15_000});
assert.ifError(result.error);
assert.equal(result.status,0,`File handoff learner code failed: ${result.stderr}`);
const expected = [
  "during upload: not ready",
  "after rename: accepted 1",
  "restart/replay: duplicate",
  "conflicting replay: conflict",
  "invalid new delivery: rejected",
];
for (const line of expected) {
  assert.ok(result.stdout.includes(line),`Expected ${line}, got ${result.stdout}`);
}
console.log("System Thinker file handoff learner example passed: complete, pending, duplicate, conflicting and invalid deliveries.");
