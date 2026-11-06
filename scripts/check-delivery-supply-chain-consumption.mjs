import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

// Exact learner-visible Python and npm source from 5 ORIGINAL Supply Chain
// readings. Local localhost package-index fixtures, not real Nexus publication.
const file=readFileSync(
 "packages/runtime-kernel/src/paths/delivery-supply-chain-consumption-teaching.ts","utf8");
const original=readFileSync(
 "packages/runtime-kernel/src/paths/delivery-artifact-supply-chain-deep.ts","utf8");
function exportedString(name){
 const match=file.match(new RegExp("export const "+name+" = (\"(?:\\\\.|[^\"\\\\])*\");"));
 assert.ok(match,"Missing literal learner-source program "+name);
 return JSON.parse(match[1]);
}
function exportedObject(name,next){
 const start=file.indexOf("export const "+name);
 const end=file.indexOf("\nexport const "+next,start);
 assert.ok(start>=0 && end>start,"Could not parse original-topic "+name);
 const source=file.slice(start,end);
 const position=source.indexOf(" = ");
 assert.ok(position>0);
 return JSON.parse(source.slice(position+3).trim().replace(/;$/,""));
}
const python=exportedString("supplyChainCleanPythonProof");
const npm=exportedString("supplyChainCleanNpmProof");
const lessons=exportedObject("supplyChainConsumptionTeaching","supplyChainConsumptionPractices");
const topicIds=["publish-python","consume-pip","publish-npm","consume-npm-pnpm","publish-steward-images"];
assert.deepEqual(Object.keys(lessons),topicIds,"Original topic learning order changed");
const ids=[...original.split("const specs: LessonSpec[] = [")[1].matchAll(/^\s*id: "([^"]+)",/gm)].map(m=>m[1]);
assert.equal(ids.length,25,"Lost original twenty-three topics plus two labs");
assert.equal(new Set(ids).size,25);
assert.ok(original.includes("...(supplyChainConsumptionTeaching[spec.id] ?? [])"));
assert.ok(original.includes("...(supplyChainConsumptionPractices[spec.id] ?? [])"));
for (const id of topicIds){
 assert.ok(ids.includes(id),"Missing original reading "+id);
 assert.ok(lessons[id].length>=3,"Insufficient mechanism, failure and transfer "+id);
 assert.ok(lessons[id].every(s=>s.heading&&s.paragraphs.length>=2&&
   s.paragraphs.every(p=>p.length>=210)),"Superficial original source "+id);
}
assert.ok(lessons["publish-python"].some(s=>s.code?.code===python),
 "Exact executed Python not visible in original publish reading");
assert.ok(lessons["publish-npm"].some(s=>s.code?.code===npm),
 "Exact executed npm program not visible in original publish reading");
console.log("PASS original 25 topic/lab IDs, five original publication lessons, executable code and practical wiring");

function execute(command,args,program,label,markers,positive){
 const result=spawnSync(command,[...args,program],{
   encoding:"utf8",timeout:125000,maxBuffer:3*1024*1024
 });
 assert.ok(!result.error,label+": "+result.error);
 if(positive){
   assert.equal(result.status,0,label+"\nstdout:\n"+result.stdout+"\nstderr:\n"+result.stderr);
   for(const marker of markers)assert.ok(result.stdout.includes(marker),
     label+" missing "+marker+"\nstdout:\n"+result.stdout);
 }else{
   assert.notEqual(result.status,0,label+" falsely accepted unsafe implementation");
   assert.match(result.stderr,/AssertionError|ERR_ASSERTION/,
     label+" failed for wrong reason\n"+result.stderr);
 }
 console.log("PASS "+label+" status="+result.status);
}
const pyMarks=["PYTHON_SAME_VERSION_MUTATION_REJECTED",
"PYTHON_ISOLATED_PIP_IMPORT_PASSED","PYTHON_MISSING_VERSION_FAILED_CLOSED"];
const npmMarks=["NPM_CLEAN_REGISTRY_CONSUMER_PASSED",
"NPM_MISSING_VERSION_FAILED_CLOSED","NPM_INTEGRITY_MISMATCH_REJECTED"];
execute("python3",["-c"],python,"actual pip isolated local package import and denial",pyMarks,true);
for(const [label,old,wrong] of [
 ["same-version changed bytes incorrectly permitted",
  "if destination.exists() and destination.read_bytes() != source.read_bytes():","if False:"],
 ["producer dependency not absent",
  "assert not producer.exists(), 'Producer checkout must be absent'",
  "assert producer.exists(), 'Unsafe producer still present'"],
 ["missing-version fail-open",
  "assert missing.returncode != 0","assert missing.returncode == 0"]
]){
 assert.ok(python.includes(old),"Python source changed "+label);
 execute("python3",["-c"],python.replace(old,wrong),
   "rejected Python mutant: "+label,[],false);
}
execute("node",["--input-type=module","-e"],npm,
 "actual npm pack plus isolated local registry and integrity denial",npmMarks,true);
for(const [label,old,wrong] of [
 ["producer checkout retained","assert(!existsSync(producer)","assert(existsSync(producer)"],
 ["missing npm version incorrectly accepted",
  "assert.notEqual(absent.result.status, 0","assert.equal(absent.result.status, 0"],
 ["npm integrity mismatch incorrectly accepted",
  "assert.notEqual(mismatch.result.status, 0","assert.equal(mismatch.result.status, 0"],
 ["lockfile registry origin ignored",
  "assert(entry.resolved.startsWith(endpoint)","assert(!entry.resolved.startsWith(endpoint)"]
]){
 assert.ok(npm.includes(old),"npm source changed "+label);
 execute("node",["--input-type=module","-e"],npm.replace(old,wrong),
  "rejected npm mutant: "+label,[],false);
}
console.log("PASS real pip/venv and npm/HTTP clean-consumer programs with seven unsafe mutations");
