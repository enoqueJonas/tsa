import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const source = fs.readFileSync('packages/runtime-kernel/src/paths/builder-identity-auth-deep.ts','utf8');
const anchor = '"caption":"transfer_policy_lab.py — explicit owner-transfer decisions"';
const at = source.indexOf(anchor);
assert.ok(at >= 0);
const match = source.slice(at).match(/"code":("(?:\\.|[^"\\])*")/);
assert.ok(match);
const code = JSON.parse(match[1]);
const run = text => spawnSync('python3',['-c',text],{encoding:'utf8',timeout:10000});
const correct = run(code);
assert.equal(correct.status,0,correct.stderr);
assert.match(correct.stdout,/TRANSFER_POLICY_11_INDEPENDENT_CASES_OK/);
for (const [old,replacement] of [
  ['source_role != "owner"','source_role not in ("owner", "maintainer")'],
  ['destination_role != "owner"','False'],
  ['current_owner != expected_owner','False'],
  ['if incident_edges:','if False:'],
]) {
  assert.ok(code.includes(old));
  const broken = run(code.replace(old,replacement));
  assert.notEqual(broken.status,0);
  assert.match(broken.stderr,/AssertionError/);
}
console.log('Transfer policy lesson passed: 11 cases and four broken-policy mutations rejected.');
