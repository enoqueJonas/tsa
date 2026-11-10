import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const lesson=readFileSync("packages/runtime-kernel/src/paths/reliability-sre-foundations-deep.ts","utf8");
const text=readFileSync("packages/runtime-kernel/src/paths/reliability-sre-source-depth.ts","utf8");
assert.ok(lesson.includes("...extraSreBlocks(spec.id)"),"SRE source depth must render in original lessons");
for (const required of ["Copy the complete local Python program", "false_ack=200", "skip persist_record()", "Status-versus-committed-record evidence table"]) {
  assert.ok(lesson.includes(required), "Original first SRE practical missing executable acceptance: " + required);
}
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
assert.match(r.stdout,/authorized_operation_denied_success=0\.00/);
const live = map["reliability-quality-attribute"].find((s) => /real local service/i.test(s.heading))?.code?.code;
assert.ok(live, "The original first reading must publish copyable real loopback HTTP source");
assert.match(live, /127\.0\.0\.1/);
assert.match(live, /server\.shutdown\(\)/);
assert.match(live, /db\.commit\(\)/);
assert.match(live, /sqlite3\.connect\(db_file\)/);
function execute(source) {
  const result = spawnSync("python3", ["-c", source], {encoding:"utf8", timeout:12000});
  assert.ifError(result.error);
  return result;
}
const good = execute(live);
assert.equal(good.status, 0, good.stderr);
assert.match(good.stdout, /health=200 outage_write=503 false_ack=200 false_ack_durable=False/);
assert.match(good.stdout, /unauthorized_write=403 recovered_write=201 recovered_durable=True/);
const mutations = [
  ["status-only oracle", 'return 200 <= status < 300 and exists', 'return 200 <= status < 300'],
  ["false durable acknowledgment", '            persist_record()', '            pass  # skipped committed SQLite write'],
  ["authorization bypass", 'self.headers.get("Authorization") != "Bearer demo-allowed"', "False"],
];
for (const [name, before, after] of mutations) {
  assert.ok(live.includes(before), name + " original guard missing");
  const wrong = execute(live.replace(before, after));
  assert.notEqual(wrong.status, 0, name + " was incorrectly accepted");
  assert.match(wrong.stderr, /AssertionError/, name + " must fail the intended safety assertion");
  assert.doesNotMatch(wrong.stderr, /SyntaxError/, name + " invalid mutation setup");
}
console.log("PASS seven original SRE lessons, local HTTP outage/false-200/403/durable restore, and three rejected unsafe published-source mutants. No real Steward or learner validation.");
