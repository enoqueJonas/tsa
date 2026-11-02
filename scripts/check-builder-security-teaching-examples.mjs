import assert from "node:assert/strict";
import fs from "node:fs";
import {spawnSync} from "node:child_process";
const source=fs.readFileSync("packages/runtime-kernel/src/paths/builder-identity-auth-deep.ts","utf8");
const cases=[
["Refresh rotation — executable replay and family revocation state machine",["OK: rotated","REPLAY: family revoked","DENIED: family revoked"]],
["Authorization — executable subject/action/object decision matrix",["authorization matrix passed: 6 cases"]]
];
for(const [caption,expected] of cases){
 const anchor=source.indexOf('"caption":"'+caption+'"');
 assert.ok(anchor>=0,"Missing learner code "+caption);
 const m=source.slice(anchor,anchor+12000).match(/"code":("(?:\\.|[^"\\])*")/);
 assert.ok(m,"Cannot extract executable code "+caption);
 const code=JSON.parse(m[1]);
 const result=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:10000});
 assert.ifError(result.error);
 assert.equal(result.status,0,`Source code failed ${caption}: ${result.stderr}`);
 for(const expectedLine of expected)assert.ok(result.stdout.includes(expectedLine),`Missing ${expectedLine} for ${caption}: ${result.stdout}`);
}
console.log("Builder security teaching examples passed: refresh replay revocation and six authorization decisions.");
