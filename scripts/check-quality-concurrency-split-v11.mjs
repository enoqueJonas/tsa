import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {spawnSync} from "node:child_process";
const p="packages/runtime-kernel/src/paths/quality-concurrency-split-v11.ts";
const source=readFileSync(p,"utf8");
const extract=(name)=>{
 const start="export const "+name+" = ";
 assert.ok(source.includes(start),"Published topic source absent: "+name);
 return JSON.parse(source.split(start)[1].split(" as const;")[0]);
};
const proofs=extract("qualityConcurrencyProofs");
const cases=extract("qualityConcurrencyDeepCases");
assert.deepEqual(Object.keys(cases).sort(),["concurrency-atomicity","concurrency-threadlocal"]);
assert.equal(proofs.atomicity,cases["concurrency-atomicity"].code);
assert.equal(proofs.threadLocal,cases["concurrency-threadlocal"].code);
const original=readFileSync("packages/runtime-kernel/src/paths/quality-java-test-engineering-deep.ts","utf8");
for(const id of Object.keys(cases)){
 assert.ok(original.includes('id:"'+id+'"'),"New original reading spec missing "+id);
 assert.ok(original.includes('"'+id+'",'),"New learner order missing "+id);
 assert.ok(original.includes('"'+id+'":'),"New practical evidence requirement missing "+id);
}
assert.match(original,/qualityConcurrencyDeepCases\[spec\.id/);
assert.ok(original.includes('id:"concurrency",'),"Original parent activity disappeared; learner progress must remain");
const run=(command,args,cwd)=>{
 const r=spawnSync(command,args,{cwd,encoding:"utf8",timeout:30000});
 assert.ifError(r.error);return r;
};
const dir=mkdtempSync(join(tmpdir(),"tsa-quality-concurrency-"));
try{
 const javaCases=[
  ["AtomicityProof",proofs.atomicity,"PASS AtomicInteger: exactly 2 updates retained","count.incrementAndGet();","count.set(stale + 1);","atomic increments did not preserve both updates"],
  ["ThreadLocalOwnershipProof",proofs.threadLocal,"PASS ThreadLocal.remove(): next task has no stale fixture","currentFixture.remove();","// intentionally omit cleanup","ThreadLocal leaked after required cleanup"]
 ];
 for(const [klass,java,expected,needle,mutation,why] of javaCases){
  assert.ok(java.includes(needle),"Missing mutation target "+klass);
  const file=join(dir,klass+".java");
  writeFileSync(file,java);
  let r=run("javac",[klass+".java"],dir);
  assert.equal(r.status,0,"Compilation failed "+klass+": "+r.stderr);
  r=run("java",[klass],dir);
  assert.equal(r.status,0,"Positive source failed "+klass+": "+r.stderr);
  assert.ok(r.stdout.includes(expected),"Expected proof not observed "+klass+": "+r.stdout);
  writeFileSync(file,java.replace(needle,mutation));
  r=run("javac",[klass+".java"],dir);
  assert.equal(r.status,0,"Negative must still compile "+klass+": "+r.stderr);
  r=run("java",[klass],dir);
  assert.notEqual(r.status,0,"Wrong implementation must cause assertion failure: "+klass);
  assert.ok(r.stderr.includes("AssertionError") && r.stderr.includes(why),
   "Wrong reason for negative "+klass+": "+r.stderr);
  console.log("PASS original "+klass+" compiled, executed, and rejected its deterministic mutation");
 }
}finally{rmSync(dir,{recursive:true,force:true});}
console.log("PASS 2 split concurrency lesson programs, zero timing-dependent negative checks.");
