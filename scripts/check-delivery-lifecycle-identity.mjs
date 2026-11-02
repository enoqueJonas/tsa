import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const file = readFileSync("packages/runtime-kernel/src/paths/delivery-lifecycle-identity-worked.ts", "utf8");
const lesson = readFileSync("packages/runtime-kernel/src/paths/delivery-software-foundations-deep.ts", "utf8");
assert.ok(lesson.includes('id === "lifecycle" ? [...sections, ...lifecycleIdentityExtraSections]'), "The authored example must be attached to the actual first Delivery lesson.");

const match = file.match(/export const lifecycleIdentityPython = ("(?:\\.|[^"\\])*");/);
assert.ok(match, "Could not extract the exact Python source published to learners.");
const code = JSON.parse(match[1]);
function run(args) {
  const result = spawnSync("python3", ["-c", code, ...args], { encoding: "utf8", timeout: 12000 });
  assert.ifError(result.error);
  return result;
}
const approved = run([]);
assert.equal(approved.status, 0, approved.stderr);
assert.match(approved.stdout, /approved == deployed: True/);
assert.match(approved.stdout, /decision: ALLOW/);
const changed = run(["--tamper"]);
assert.equal(changed.status, 23, changed.stderr);
assert.match(changed.stdout, /approved == deployed: False/);
assert.match(changed.stdout, /decision: BLOCK/);
console.log("Delivery lifecycle learner example: unchanged artifact allowed; changed bytes fail closed (exit 23).");
