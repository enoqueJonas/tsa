import assert from "node:assert/strict";
import fs from "node:fs";
import {spawnSync} from "node:child_process";

const source=fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-deep.ts","utf8");
const cases=[
  ["Refactoring — executable behavior-preservation check", "refactor contracts preserved: 3"],
  ["Testing — executable unittest authorization boundary", "Ran 2 tests"],
  ["Configuration — executable fail-closed environment parser", "valid False"],
  ["Logging — executable structured-context and secret absence test", "service=42 request=req-demo-7"],
  ["Errors — executable stable public error mapping", "public error mappings: 6"],
  ["Static analysis — parse error versus valid but wrong authorization", "syntax valid; authorization policy still wrong"],
  ["Documentation — executable setup instructions completeness gate", "documentation checklist passed; vague instructions rejected"]
];
for(const [caption,expected] of cases){
  const anchor=source.indexOf('"caption":"'+caption+'"');
  assert.ok(anchor>=0,"Missing published lesson: "+caption);
  const m=source.slice(anchor,anchor+10000).match(/"code":("(?:\\.|[^"\\])*")/);
  assert.ok(m,"Cannot parse published code: "+caption);
  const code=JSON.parse(m[1]);
  const r=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:10000});
  assert.ifError(r.error);
  assert.equal(r.status,0,`Source example failed: ${caption}\n${r.stderr}\n${r.stdout}`);
  assert.ok((r.stdout+r.stderr).includes(expected),`Expected output missing in ${caption}: ${r.stdout+r.stderr}`);
  if(caption.includes("Configuration")){
    assert.match(r.stdout,/missing DATABASE_URL is required/);
    assert.match(r.stdout,/invalid DJANGO_DEBUG must be true or false/);
  }
}
console.log("Builder craft examples passed: 7 source-extracted Python labs and their negative boundaries.");
