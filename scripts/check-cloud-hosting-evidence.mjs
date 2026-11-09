import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
// Exact learner-published source from original Cloud and Hosting Models topics.
const base="packages/runtime-kernel/src/paths/";
const originals=readFileSync(base+"cloud-hosting-models-deep.ts","utf8");
const authored=readFileSync(base+"cloud-hosting-learner-reconstruction.ts","utf8");
const snippets=readFileSync(base+"cloud-hosting-evidence-programs.ts","utf8");
function sourceString(name) {
  const match=snippets.match(new RegExp("export const "+name+" = (\"(?:\\\\.|[^\"\\\\])*\");"));
  assert.ok(match,"Missing executable source "+name);
  return JSON.parse(match[1]);
}
function record(source,name,next){
 const start=source.indexOf("export const "+name);
 assert(start>=0,"Missing authored "+name);
 const end=next?source.indexOf("\nexport const "+next,start):source.length;
 const decl=source.slice(start,end);
 const eq=decl.indexOf(" = ");
 assert(eq>=0);
 return JSON.parse(decl.slice(eq+3).trim().replace(/;$/,""));
}
const sections=record(authored,"cloudHostingDepth","cloudHostingPracticeDepth");
const practices=record(authored,"cloudHostingPracticeDepth");
const topics=["on-prem-colocation-vps-cloud","iaas-paas-saas","regions-zones-availability",
  "shared-responsibility","elasticity-consumption","cloud-cost-awareness"];
assert.deepEqual(Object.keys(sections),topics);
assert.deepEqual(Object.keys(practices),topics);
for(const topic of topics){
 assert(originals.includes('id: "'+topic+'"'),"Canonical topic lost "+topic);
 assert(sections[topic].length>=3,"Concept compressed "+topic);
 for(const section of sections[topic]){
   assert(section.heading.length>18&&section.paragraphs.length>=2);
   assert(section.paragraphs.every(x=>x.length>310),
     "Shallow explanation "+topic+" "+section.heading);
 }
 assert(practices[topic].length>=2);
}
assert(originals.includes("...spec.sections, ...extra"),"Original lesson blocks not wired");
assert(originals.includes("cloudHostingPracticeDepth[spec.id]"),"Original practical not wired");
assert(originals.includes("cloudHostingCostProof"));
assert(originals.includes("cloudHostingResponsibilityProof"));
assert((originals.match(/id: "cloud-and-hosting-models-compare-hosting-lab-/g)||[]).length>=3,
 "Original hosting capstone lab IDs lost");
const cost=sourceString("cloudHostingCostProof");
const responsibility=sourceString("cloudHostingResponsibilityProof");
assert(sections["cloud-cost-awareness"].some(s=>s.code?.codeKey==="cost"));
assert(sections["shared-responsibility"].some(s=>s.code?.codeKey==="responsibility"));
console.log("PASS six canonical Cloud Hosting lessons, full original practice and two exact-source runnable proofs");

function run(code,label,expected=[],good=true){
 const x=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:15000});
 assert.ok(!x.error,label+" execution error: "+x.error);
 if(good){
   assert.equal(x.status,0,label+"\nstdout:\n"+x.stdout+"\nstderr:\n"+x.stderr);
   for(const marker of expected)assert.ok(x.stdout.includes(marker),label+" missing "+marker);
 }else{
   assert.notEqual(x.status,0,label+" unsafe code was accepted");
   assert.match(x.stderr,/AssertionError/,label+" wrong failure reason "+x.stderr);
 }
 console.log("PASS "+label+" status="+x.status);
}
run(cost,"actual fictional hosting cost, safety, availability and sensitivity",[
 "CLOUD_FICTITIOUS_TCO_AND_CAPACITY_GATE_PASSED",
 "CLOUD_CHEAP_UNRECOVERABLE_OPTION_REJECTED",
 "CLOUD_99_9_PERCENT_MONTH_ALLOWANCE_43_2_MINUTES",
 "CLOUD_CHANGED_INPUT_INVALIDATES_OLD_DECISION"
]);
for(const [name,from,to] of [
 ["unsafe cheap option admitted",
  "return x.enough_memory and x.independent_restore and total(x) <= budget",
  "return total(x) <= budget"],
 ["forgot billed backup","x.compute, x.ipv4, x.backup, x.transfer_overage,",
  "x.compute, x.ipv4, x.transfer_overage,"],
 ["miscomputed availability target","Decimal(\"0.999\")","Decimal(\"0.99\")"],
 ["stale price recommendation","Decimal(\"18\"), Decimal(\"2\"), Decimal(\"3\")",
  "Decimal(\"8\"), Decimal(\"2\"), Decimal(\"3\")"]
]){
 assert(cost.includes(from),"Cost mutant not anchored "+name);
 run(cost.replace(from,to),"rejected cost mutant: "+name,[],false);
}
run(responsibility,"actual ownership matrix and customer recovery gate",[
 "CLOUD_SHARED_RESPONSIBILITY_CUSTOMER_STILL_OWNS_IDENTITY_AND_RECOVERY",
 "CLOUD_MANAGED_BACKUP_WITHOUT_CUSTOMER_RESTORE_TEST_REJECTED"
]);
for(const [name,from,to] of [
 ["customer ignores managed-DB restore validation",
  'Responsibility("backup-restore-validation", True, True)',
  'Responsibility("backup-restore-validation", True, False)'],
 ["all managed plans admitted regardless of customer duty",
  'return all(has_customer_owner(rows, name) for name in critical)',
  'return True'],
 ["provider owns customer application permissions",
  'Responsibility("application-access-policy", False, True)',
  'Responsibility("application-access-policy", True, False)']
]){
 assert(responsibility.includes(from),"Matrix mutant missing "+name);
 run(responsibility.replace(from,to),"rejected responsibility mutant: "+name,[],false);
}
console.log("PASS seven source-invalidating mutations; no actual provider account, SLA or pricing verified");
