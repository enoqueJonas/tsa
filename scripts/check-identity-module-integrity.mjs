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
  "config/settings.py — register drf-spectacular for the existing signed API",
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
// A denied signed request must prove persisted state, not a stale Python instance;
// log redaction evidence must also reject an empty log capture.

const schemaCaption = "config/settings.py — register drf-spectacular for the existing signed API";
const schemaAt = source.indexOf('"caption":' + JSON.stringify(schemaCaption));
assert.ok(schemaAt >= 0, "Signed schema must configure the SAME Django project");
const schemaCodeMatch = source.slice(schemaAt, schemaAt + 9000).match(
  /"code":("(?:\\.|[^"\\])*")/);
assert.ok(schemaCodeMatch, "Missing schema settings published as executable Python");
const schemaCode = JSON.parse(schemaCodeMatch[1]);
assert.ok(schemaCode.includes('REST_FRAMEWORK["DEFAULT_SCHEMA_CLASS"]'),
  "The secure contract cannot rely on schema settings from an unrelated Django project");

const contractCaption = "registry/secure_contract_lab.py — generated JWT contract versus actual HTTP SQL and logs";
const contractAt = source.indexOf('"caption":' + JSON.stringify(contractCaption));
assert.ok(contractAt >= 0, "Missing real signed contract exercise");
const contractCodeMatch = source.slice(contractAt, contractAt + 28000).match(
  /"code":("(?:\\.|[^"\\])*")/);
assert.ok(contractCodeMatch, "Missing published contract Python program");
const contractCode = JSON.parse(contractCodeMatch[1]);
for (const check of [
  "Service.objects.filter(pk=target.pk, owning_team_id=team_a.pk).exists()",
  "OwnershipTransfer.objects.count() == audit_count_before",
  'assert "secure/services/" in log_text',
]) assert.ok(contractCode.includes(check),
  "Real signed contract lab is missing a non-vacuous denial/log assertion: " + check);

const labId = "identity-authentication-authorization-lab-secure-steward-api";
const capstoneAt = source.indexOf('    {\n        "id": "' + labId + '"');
assert.ok(capstoneAt >= 0, "The final capstone must be present as a standalone lesson");
const capstone = JSON.parse(source.slice(capstoneAt, source.lastIndexOf("\n];")).trim());
const reading = capstone.activities.find(
  activity => activity.id === labId + "-reading");
assert.ok(reading?.content?.blocks, "Capstone reading needs rendered content blocks");
const blocks = reading.content.blocks;
for (const block of blocks) {
  if (block.type !== "heading") continue;
  const keys = Object.keys(block).sort();
  assert.deepEqual(keys, ["id", "level", "text", "type"],
    "Malformed capstone heading block: use separate list/code blocks, not heading extras");
}
const stagedCommands = blocks.filter(block => block.type === "code");
assert.equal(stagedCommands.length, 1,
  "Publish a single staged command sequence, not contradictory duplicate shell blocks");
const commandText = stagedCommands[0].code;
for (const stage of ["STAGE 1", "STAGE 2", "STAGE 3"])
  assert.ok(commandText.includes(stage), "Missing ordered capstone " + stage);
assert.ok(commandText.indexOf("jwt_first_http_lab.py") <
  commandText.indexOf("migrate token_blacklist"),
  "The no-rotation JWT baseline must be captured BEFORE blacklist/rotation");
assert.ok(commandText.indexOf("migrate token_blacklist") <
  commandText.indexOf("session_lifecycle_lab.py"),
  "Apply blacklist migrations BEFORE the real refresh lifecycle experiment");
assert.match(source, /"id": "identity-authentication-authorization-lab-secure-steward-api-practice"/);
assert.match(source, /"id": "identity-authentication-authorization-lab-secure-steward-api-check"/);
assert.ok(source.includes("Seven evidence rows tie HTTP, database effects"),
  "Capstone must require traceable evidence instead of checklist completion");
assert.ok(source.includes("Require at least 14/16"),
  "Capstone teach-back must have an explicit scoring threshold");
assert.doesNotMatch(source.slice(source.indexOf('"id": "' + labId + '"')), /"estimatedMinutes": 180/,
  "Do not restore the original 180-minute security omnibus");
console.log("Identity module integrity passed: ordered checkpoints, 8 syntax-valid published Python files, preserved capstone IDs and independent transfer rubric.");
