import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const lesson=readFileSync("packages/runtime-kernel/src/paths/reliability-sre-foundations-deep.ts","utf8");
const text=readFileSync("packages/runtime-kernel/src/paths/reliability-sre-source-depth.ts","utf8");
assert.ok(lesson.includes("...extraSreBlocks(spec.id)"),"SRE source depth must render in original lessons");
const start=text.indexOf(" = {");
const end=text.indexOf(";\nexport function",start);
assert.ok(start>=0&&end>start,"SRE source map malformed");
const map=JSON.parse(text.slice(start+3,end));
const ids=["reliability-quality-attribute","availability","failure-recovery","sre-principles","toil","risk-tradeoffs","reliability-ownership"];
assert.deepEqual(Object.keys(map).sort(),ids.sort());
for(const id of ids) {
 const sections=map[id];
 assert.ok(sections.length>=2 && sections.some(s=>/failure|transfer|diagnos/i.test(s.heading)),id+" lacks independent counterexample");
 assert.ok(sections.flatMap(s=>s.paragraphs).join(" ").length>=650,id+" shallow source");
}
const py=map["reliability-quality-attribute"].find(s=>s.code?.language==="python")?.code?.code;
assert.ok(py,"First original SRE lesson lacks executable contrast");
const r=spawnSync("python3",["-c",py],{encoding:"utf8",timeout:12000});
assert.ifError(r.error);assert.equal(r.status,0,r.stderr);
assert.match(r.stdout,/process_probe_success=1\.00/);
assert.match(r.stdout,/user_operation_success=0\.50/);
console.log("PASS seven SRE source topics plus source-published green-probe/failed-operation negative; live Steward unverified.");
