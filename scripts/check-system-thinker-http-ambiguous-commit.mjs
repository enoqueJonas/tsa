import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

// Test EXACT Python shown in the System Thinker reading, not a parallel fixture.
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-http-ambiguous-commit-worked.ts","utf8");
const caption="Runnable HTTP POST: SQLite commits, TCP drops before response, safe same-key retry after restart";
const i=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(i>=0,"Missing learner code for ambiguous POST outcome");
const match=source.slice(i,i+25000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(match,"Cannot extract published Python experiment");
const result=spawnSync("python3",["-c",JSON.parse(match[1])],{encoding:"utf8",timeout:25000});
assert.ifError(result.error);
assert.equal(result.status,0,"Ambiguous HTTP lesson failed:\n"+result.stdout+"\n"+result.stderr);
for(const line of [
    "first POST: no HTTP response after commit",
    "server committed despite disconnected client: True",
    "retry after server restart: 200, version 8",
    "reused key with different request: 409",
    "other team denied before replay: 403",
    "new transition after retirement: 409",
    "durable domain effects: 1",
    "durable request identities: 1",
]) assert.ok(result.stdout.includes(line),"Missing '"+line+"': "+result.stdout);
console.log("System Thinker ambiguous HTTP learner example passed: committed-before-response TCP failure, durable same-key replay and negative controls.");
