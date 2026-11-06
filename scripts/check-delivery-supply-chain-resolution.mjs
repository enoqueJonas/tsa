import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

/** Exact learner-visible pip resolver proof from original module-7
 * reading; localhost PEP-503-like wheels, never real PyPI/Nexus.
 */
const published = readFileSync(
  "packages/runtime-kernel/src/paths/delivery-supply-chain-resolution-teaching.ts","utf8"
);
const match=published.match(/export const supplyChainIndexResolutionPython = ("(?:\\.|[^"\\])*");/);
assert.ok(match,"Expected the exact learner-published Python program as a JSON string literal");
const program=JSON.parse(match[1]);
const original=readFileSync("packages/runtime-kernel/src/paths/delivery-artifact-supply-chain-deep.ts","utf8");
assert.ok(original.includes("...(supplyChainResolutionTeaching[spec.id] ?? [])"),"Original source no longer uses resolution explanations");
assert.ok(original.includes("...(supplyChainResolutionPractices[spec.id] ?? [])"),"Original applied practicals lost proof instructions");
const specSource=original.split("const specs: LessonSpec[] = [")[1];
assert.ok(specSource,"Original learner-source lesson factory missing");
const ids=[...specSource.matchAll(/^\s*id: "([^"]+)",/gm)].map(m=>m[1]);
assert.equal(ids.length,25,"Changed original 23 core readings + two lab readings");
assert.equal(new Set(ids).size,25,"Duplicate original reading IDs");
const target=[
 "why-internal-repositories","registries-vs-repositories",
 "public-private-dependencies","hosted-proxy-group","python-pypi-distribution"
];
for(const key of target)assert.ok(published.includes('"'+key+'": ['),"Missing topic-specific teaching: "+key);
for(const term of [
 "A registry is a protocol contract","Why the first index is not necessarily trusted first",
 "Run real pip candidate selection","Follow write authority separately from read resolution",
 "Walk from Python project to wheel"
])assert.ok(published.includes(term),"No original-topic mechanism: "+term);
console.log("PASS original 25 supply-chain reading IDs, first five subject-specific teaching and applied practical wiring");

function execute(text, label, mustPass) {
 const run=spawnSync("python3",["-c",text],{encoding:"utf8",timeout:110000,maxBuffer:2*1024*1024});
 assert.equal(run.error,undefined,label+": spawn error "+run.error);
 if(mustPass) {
   assert.equal(run.status,0,label+"\nstdout:"+run.stdout+"\nstderr:"+run.stderr);
   for(const marker of [
     "MIXED_INDEX_SELECTED_EXTERNAL_9_9_9",
     "PRIVATE_ONLY_SELECTED_APPROVED_1_0_0",
     "APPROVED_HASH_ALLOW_EXTERNAL_HASH_BLOCK"
   ])assert.ok(run.stdout.includes(marker),label+": missing "+marker);
 }else{
   assert.notEqual(run.status,0,label+" unexpectedly accepted an unsafe program");
   assert.match(run.stderr,/AssertionError/,label+" did not fail an explicit safety oracle");
 }
 console.log("PASS "+label+" status="+run.status);
}
execute(program,"exact pip localhost positive; no outside network",true);
const mutators=[
 ["missing extra-index candidate", "if include_external:", "if False:"],
 ["allow untrusted bytes", "if candidate.name != approved_filename or sha256(candidate.read_bytes()).hexdigest() != approved_hash:", "if False:"],
 ["wrong trusted hash", "approved_hash = sha256(approved.read_bytes()).hexdigest()", "approved_hash = sha256(wheels['external'].read_bytes()).hexdigest()"]
];
for(const [label,needle,wrong] of mutators){
 assert.ok(program.includes(needle),label+": published program changed");
 execute(program.replace(needle,wrong),"unsafe mutant rejected: "+label,false);
}
console.log("PASS exact original lesson pip resolution + three dangerous mutations");
