import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

// Test the EXACT source shown to the learner; not an unrelated replacement
// script. No provider prices are represented as current or observed.
const original=readFileSync("packages/runtime-kernel/src/paths/cloud-hosting-models-deep.ts","utf8");
const quality=readFileSync("packages/runtime-kernel/src/paths/cloud-hosting-models-quality.ts","utf8");
const source=readFileSync("packages/runtime-kernel/src/paths/cloud-hosting-live-cost.ts","utf8");
const pedagogy=readFileSync("packages/runtime-kernel/src/paths/cloud-hosting-mechanism-depth.ts","utf8");
const match=source.match(/export const cloudHostingCostDecisionPython = ("(?:\\.|[^"\\])*");/);
assert.ok(match,"Learner-published Python missing");
const python=JSON.parse(match[1]);
function objectBetween(text,name,next){
 const start=text.indexOf("export const "+name);
 const end=text.indexOf("\nexport const "+next,start);
 assert.ok(start>=0 && end>start,"Missing original subject data "+name);
 return JSON.parse(text.slice(text.indexOf("=",start)+1,end).trim().replace(/;$/,""));
}
const sections=objectBetween(pedagogy,"cloudHostingMechanismSections","cloudHostingAppliedPractices");
const practices=JSON.parse(pedagogy.slice(pedagogy.indexOf("=",pedagogy.indexOf("export const cloudHostingAppliedPractices"))+1).trim().replace(/;$/,""));
const ids=[...original.split("const specs: LessonSpec[] = [")[1].split("\n];")[0].matchAll(/^\s*id: "([^"]+)",/gm)].map(x=>x[1]);
const expected=[
 "on-prem-colocation-vps-cloud","iaas-paas-saas","regions-zones-availability",
 "shared-responsibility","elasticity-consumption","cloud-cost-awareness"];
assert.deepEqual(ids,expected,"Original six lesson IDs/order changed");
assert.deepEqual(Object.keys(sections),expected,"Missing/deviant concept source topic");
assert.deepEqual(Object.keys(practices),expected,"Missing/deviant practical source topic");
for(const id of expected){
 assert.ok(sections[id].length>=3,"Compressed concept into one section "+id);
 for(const s of sections[id]){
   assert.ok(s.heading.length>24,"Missing explicit mechanism "+id);
   assert.ok(s.paragraphs.length>=2&&s.paragraphs.every(p=>p.length>=260),
     "Lesson assumes unexplained steps "+id+"/"+s.heading);
 }
 assert.ok(practices[id].length>=2&&practices[id].every(x=>x.length>=125),
   "Missing executable/evaluable independent practical "+id);
}
assert.ok(original.includes("cloudHostingMechanismSections[spec.id]"));
assert.ok(original.includes("code: cloudHostingCostDecisionPython"));
assert.ok(quality.includes("cloudHostingAppliedPractices[lesson.id.slice("));
assert.ok(original.includes("cloud-and-hosting-models-compare-hosting-lab-001"));
assert.ok(original.includes("cloud-and-hosting-models-compare-hosting-lab-002"));
assert.ok(original.includes("cloud-and-hosting-models-compare-hosting-lab-003"));
for(const key of [
 "synthetic","not real provider rates","not real provider","not real prices"
]){
 // At least one explicit fictional-input label must appear in learner source,
 // not merely in this test.
 if(python.toLowerCase().includes(key))break;
 if(key==="not real prices")assert.fail("Model falsely presented as provider quote");
}
console.log("PASS original six hosting lessons + three lab IDs; 18 deep sections and original-practice additions");

const markers=[
 "HOSTING_BASELINE_SYNTHETIC_USD_16_05",
 "HOSTING_IDLE_RESOURCES_STILL_BILLED_14_25",
 "HOSTING_BURST_EXCEEDS_30_USD_BUDGET",
 "HOSTING_MANAGED_ALTERNATIVE_ADDON_28_00",
 "HOSTING_NOT_A_LIVE_PROVIDER_QUOTE_OR_CAPACITY_TEST"
];
function run(src,label,positive){
 const got=spawnSync("python3",["-c",src],{encoding:"utf8",timeout:20000,maxBuffer:2*1024*1024});
 assert.ok(!got.error,"Unable to run "+label+": "+got.error);
 if(positive){
   assert.equal(got.status,0,label+"\nstdout:\n"+got.stdout+"\nstderr:\n"+got.stderr);
   for(const marker of markers)assert.ok(got.stdout.includes(marker),"Missing marker "+marker);
 } else {
   assert.notEqual(got.status,0,label+" unsafe cost arithmetic passed");
   assert.match(got.stderr,/AssertionError/,label+" failed for wrong reason: "+got.stderr);
 }
 console.log("PASS "+label+" status="+got.status);
}
run(python,"real standard-library decimal cost billing and budget proof",true);
const mutants=[
 ["allocated IPv4 incorrectly free", 'ipv4_monthly=D("1.50")','ipv4_monthly=D("0.00")'],
 ["backups silently excluded", 'backup_fraction_of_vm=D("0.25")','backup_fraction_of_vm=D("0.00")'],
 ["all egress incorrectly included", 'included_egress_gib=100','included_egress_gib=350'],
 ["managed upgrade incorrectly free", '"managed_services_monthly": D("28.00")','"managed_services_monthly": D("0.00")'],
 ["too-high budget hides burst", 'monthly_budget = D("30.00")','monthly_budget = D("40.00")']
];
for(const [label,needle,wrong] of mutants){
 assert.ok(python.includes(needle),"Source mutation no longer matches: "+label);
 run(python.replace(needle,wrong),"rejected unsafe pricing mutant: "+label,false);
}
console.log("PASS five deliberately invalid billing/admission variants; NOT provider pricing verification");
