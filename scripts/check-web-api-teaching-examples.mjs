import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const source = fs.readFileSync(path.join(process.cwd(), "packages/runtime-kernel/src/paths/builder-web-api-deep.ts"), "utf8");
assert.ok(source.includes('lesson("JSON and Content Types", 70'), "The authored JSON teaching lesson is missing");
const samples = [...source.matchAll(/"caption":\s*"([^"]+)"\s*,\s*"code":\s*("(?:\\.|[^"\\])*")/g)]
  .map((hit) => ({ caption: hit[1], code: JSON.parse(hit[2]) }));
function execute(captionPrefix, expected) {
  const found = samples.find((sample) => sample.caption.startsWith(captionPrefix));
  assert.ok(found, `Learner-visible Python example missing: ${captionPrefix}`);
  const result = spawnSync("python3", ["-c", found.code], {
    cwd: process.cwd(), encoding: "utf8", timeout: 10_000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, `Python example failed: ${captionPrefix}\n${result.stderr}`);
  assert.equal(result.stdout.trim(), expected, `Published expected output mismatch: ${captionPrefix}`);
}
execute("json_boundary.py", "ACCEPTED\nDOMAIN ERROR\nSYNTAX ERROR\nSHAPE ERROR");
execute("Run this separate Python snippet", "omitted\nexplicit null\nvalue: 0");
console.log("Web/API learner JSON examples passed: syntax, shape, domain and omitted/null/zero classifications.");

execute("pagination_model.py", "first: [10, 20]\noffset after insert: [20, 30]\ncursor after insert: [30, 40]\noffset after delete: [40]\ncursor after delete: [30, 40]");
execute("contract_boundary.py", "{\"active\": true, \"ageDays\": 184, \"endpoint\": \"https://payments.internal/api\", \"id\": 7, \"name\": \"Payments API\"}\nREJECTED: ageDays must be a non-negative integer\nREJECTED: ageDays must be a non-negative integer\nREJECTED: required fields: name, endpoint, ageDays; no extras\nadded field: Payments API / 184\nBROKEN CLIENT: name");
