import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-messaging-semantics-worked.ts","utf8");
const caption="Executable SQL version guard: v8 retired, late v7 production and duplicate v8";
const anchor=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(anchor>=0,"Missing published monotonic projection source");
const match=source.slice(anchor,anchor+14000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(match,"Unable to extract published Python version guard");
const program=JSON.parse(match[1]);
const proc=spawnSync("python3",["-c",program],{encoding:"utf8",timeout:12000});
assert.ifError(proc.error);
assert.equal(proc.status,0,"Published projection failed: "+proc.stderr);
assert.deepEqual(proc.stdout.trim().split(/\r?\n/),[
  "event v8: applied; projection=(8, 'retired')",
  "event v7: ignored; projection=(8, 'retired')",
  "event v8: ignored; projection=(8, 'retired')",
]);
assert.ok(!program.includes("deprecated"),"Invalid Steward lifecycle example reintroduced");
console.log("System Thinker messaging order example passed: v8 applies and late/duplicate events cannot regress projection.");