import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-sftp-worked.ts","utf8");
const caption="Real local SFTP with pinned SSH host key, user-key rejection, partial upload, rename, integrity and connection outage";
const anchor=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(anchor>=0,"The SFTP example is not present in learner source");
const code=source.slice(anchor,anchor+23000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(code,"Could not extract complete learner-visible SFTP program");
const result=spawnSync("python3",["-c",JSON.parse(code[1])],{encoding:"utf8",timeout:30000});
assert.ifError(result.error);
assert.equal(result.status,0,"SFTP learner example failed:\n"+result.stdout+"\n"+result.stderr);
for(const line of [
 "wrong SSH host key refused: True",
 "wrong client public key refused: True",
 "partial upload not consumer-ready: True",
 "completed SFTP rename visible: True",
 "remote SFTP round-trip SHA256 matches: True",
 "stopped SSH transport connection refused: True",
]){
 assert.ok(result.stdout.includes(line),"Missing "+line+": "+result.stdout);
}
console.log("System Thinker real pinned-SSH/SFTP lesson passed: host verification, client auth, incomplete delivery, SHA256 and outage.");
