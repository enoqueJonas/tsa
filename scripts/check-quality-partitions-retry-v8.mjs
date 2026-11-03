import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {spawnSync} from "node:child_process";

const file="packages/runtime-kernel/src/paths/quality-partitions-retry-v8.ts";
const source=readFileSync(file,"utf8");
const extract=(name)=>{
 const anchor="export const "+name+" = ";
 assert.ok(source.includes(anchor),"Published learner program not found: "+name);
 return JSON.parse(source.split(anchor)[1].split(";\n")[0]);
};
const programs=[
 ["qualityPartitionPython","criticality-partitions.py","PASS 8 illustrative partition representatives",
  'if approve_high and value == "HIGH":','if approve_high and value == "LOW":'],
 ["qualityIdempotencyPython","idempotency-unknown-commit.py","one durable effect, same result",
  'return 200, existing[1]  # replay the previous business result',
  'conn.execute("INSERT INTO effects(key,target) VALUES (?,?)",(key,target))\n            return 200, existing[1]'],
 ["qualityCleanupPython","owned-cleanup.py","scoped cleanup preserves run-B",
  'db.execute("DELETE FROM fixtures WHERE run_id=?", (run_id,))',
  'db.execute("DELETE FROM fixtures")'],
];
const api=readFileSync("packages/runtime-kernel/src/paths/quality-api-integration-testing-deep.ts","utf8");
const design=readFileSync("packages/runtime-kernel/src/paths/quality-test-analysis-design-deep.ts","utf8");
assert.ok(api.includes("qualityPartitionsAndRetryCases[spec.id"),"API original readings do not render these examples");
assert.ok(design.includes("qualityPartitionsAndRetryCases[spec.id"),"Design original reading does not render partitions");
const term=source.match(/export const qualityPartitionsAndRetryCases = (\{[\s\S]*\}) as const;\s*$/);
assert.ok(term,"Topic-specific original source metadata not extractable");
const cases=JSON.parse(term[1]);
assert.deepEqual(Object.keys(cases).sort(),["equivalence-partitioning","negative-resilience","data-setup-cleanup"].sort());
for(const [name,_,__,oldString,newString] of programs){
 const program=extract(name);
 assert.ok(program.includes(oldString),"Changed mutation target in "+name);
 assert.ok(program.includes("assert "),name+" must actually verify state");
}
assert.equal(cases["equivalence-partitioning"].code,extract("qualityPartitionPython"));
assert.equal(cases["negative-resilience"].code,extract("qualityIdempotencyPython"));
assert.equal(cases["data-setup-cleanup"].code,extract("qualityCleanupPython"));

const root=mkdtempSync(join(tmpdir(),"tsa-quality-contracts-"));
const run=(filename,sourceText)=>{
 writeFileSync(join(root,filename),sourceText);
 const r=spawnSync("python3",[filename],{cwd:root,encoding:"utf8",timeout:15000});
 assert.ifError(r.error);
 return r;
};
try{
 for(const [name,filename,expected,needle,mutation] of programs){
   const program=extract(name);
   let r=run(filename,program);
   assert.equal(r.status,0,name+" actual learner source failed:\n"+r.stderr);
   assert.ok(r.stdout.includes(expected),name+" missing expected stdout: "+r.stdout);
   r=run(filename,program.replace(needle,mutation));
   assert.notEqual(r.status,0,name+" must reject wrong behavior");
   assert.match(r.stderr,/AssertionError/,"Unexpected negative failure reason: "+name+"\n"+r.stderr);
   console.log("PASS exact published "+filename+" and deliberate wrong-implementation negative");
 }
} finally { rmSync(root,{recursive:true,force:true}); }
console.log("PASS three original Quality source examples with three deterministic mutations.");
