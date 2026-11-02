import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-ftp-worked.ts","utf8");
const caption="Executable isolated FTP process, passive transfer, rename, bad credentials and refused connection";
const anchor=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(anchor>=0,"Missing published FTP code");
const match=source.slice(anchor,anchor+18000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(match,"Cannot extract FTP learner code");
const result=spawnSync("python3",["-c",JSON.parse(match[1])],{encoding:"utf8",timeout:35000});
assert.ifError(result.error);
assert.equal(result.status,0,"FTP lab failed: "+result.stderr);
for(const expected of [
"control welcome: True",
"upload transfer: 226",
"download transfer: 226",
"bytes match: True",
"wrong password: 530",
"after shutdown: connection refused",
])assert.ok(result.stdout.includes(expected),"Expected "+expected+" in "+result.stdout);
console.log("System Thinker FTP learner experiment passed: real isolated FTP server, passive transfer, auth rejection and cleanup.");