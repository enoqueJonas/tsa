import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const source = fs.readFileSync(
  "packages/runtime-kernel/src/paths/builder-identity-auth-deep.ts", "utf8"
);
const names = [
  "identity-authentication-authorization-atomic-ownership-transfer",
  "identity-authentication-authorization-refresh-logout-http",
  "identity-authentication-authorization-secured-openapi-evidence",
  "identity-authentication-authorization-common-authentication-and-authorization-mistakes",
  "identity-authentication-authorization-lab-secure-steward-api",
];
const positions = names.map(id => {
  const first = source.indexOf('"' + id + '"');
  assert.ok(first >= 0, "Missing module lesson " + id);
  assert.equal(source.indexOf('"' + id + '"', first + id.length + 2), -1,
    "Duplicate module lesson ID " + id);
  return first;
});
for (let i = 1; i < positions.length; i++) {
  assert.ok(positions[i] > positions[i-1],
    "Security checkpoint is not in learner dependency order: " + names[i]);
}
const captions = [
  "config/settings.py — enable actual rotating and blacklisted refresh credentials",
  "registry/session_lifecycle_urls.py — isolated real refresh logout routes",
  "registry/session_lifecycle_lab.py — signed refresh replay logout and database state",
  "registry/secure_contract_views.py — document actual signed detail and transfer",
  "registry/secure_contract_api_urls.py — signed route objects for runtime and schema",
  "registry/secure_contract_urls.py — private generated OpenAPI endpoint",
  "registry/secure_contract_lab.py — generated JWT contract versus actual HTTP SQL and logs",
];
for (const caption of captions) {
  const key = '"caption":' + JSON.stringify(caption);
  const at = source.indexOf(key);
  assert.ok(at >= 0, "Missing exact learner-published file: " + caption);
  const body = source.slice(at, at + 34000);
  const match = body.match(/"code":("(?:\\.|[^"\\])*")/);
  assert.ok(match, "Missing code for " + caption);
  const code = JSON.parse(match[1]);
  assert.ok(code.length > 100, "Not a complete file for " + caption);
  const parse = spawnSync("python3", ["-c",
    "import ast,sys; ast.parse(sys.stdin.read())"
  ], {input: code, encoding: "utf8", timeout: 10000});
  assert.ifError(parse.error);
  assert.equal(parse.status, 0,
    "Published Python has a syntax error: " + caption + "\n" + parse.stderr);
}
const labId = "identity-authentication-authorization-lab-secure-steward-api";
assert.match(source, /"id": "identity-authentication-authorization-lab-secure-steward-api-practice"/);
assert.match(source, /"id": "identity-authentication-authorization-lab-secure-steward-api-check"/);
assert.ok(source.includes("Seven evidence rows tie HTTP, database effects"),
  "Capstone must require traceable evidence instead of checklist completion");
assert.ok(source.includes("Require at least 14/16"),
  "Capstone teach-back must have an explicit scoring threshold");
assert.doesNotMatch(source.slice(source.indexOf('"id": "' + labId + '"')), /"estimatedMinutes": 180/,
  "Do not restore the original 180-minute security omnibus");
console.log("Identity module integrity passed: ordered checkpoints, 7 syntax-valid published Python files, preserved capstone IDs and independent transfer rubric.");
