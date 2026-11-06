import assert from "node:assert/strict";
import fs from "node:fs";
import {spawnSync} from "node:child_process";
const root="packages/runtime-kernel/src/paths/";
const published=fs.readFileSync(root+"professional-engineer-foundations.ts","utf8");
const wiring=fs.readFileSync(root+"professional-engineer.ts","utf8");
assert.ok(!wiring.includes("prepareProfessional("),"The auto-generated prep wrapper must not reappear");
assert.ok(!wiring.includes("-professional-preparation"),"Do not create synthetic lesson preparation activity IDs");
for(const p of ["professional-practice","capstone-problem-discovery","capstone-engineering-proposal",
"capstone-independent-build","capstone-production-readiness","professional-portfolio-reflection","capstone-defence"])
 assert.ok(wiring.includes('id: "'+p+'"'),"Missing Professional Engineer path "+p);
for(const id of ["professional-practice-accountable-engineering-decisions",
"capstone-problem-discovery-evidence-provenance"]){
 for(const suffix of ["reading","practice","check"])
  assert.ok(published.includes('"id": "'+id+"-"+suffix+'"'),"Missing independent "+id+"-"+suffix);
}
function code(caption){
 const anchor='"caption": '+JSON.stringify(caption);
 const at=published.indexOf(anchor);
 assert.ok(at>=0,"Learner code not found: "+caption);
 const match=published.slice(at,at+15000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
 assert.ok(match,"Could not extract exact learner code "+caption);
 return JSON.parse(match[1]);
}
function python(source){
 const p=spawnSync("python3",["-c",source],{encoding:"utf8",timeout:15000,env:{...process.env,PYTHONNOUSERSITE:"1"}});
 assert.ifError(p.error);return p;
}
const choices=code("Professional decisions — exact Python claim/evidence states and unsafe approval contrast");
const prove=python(choices);
assert.equal(prove.status,0,prove.stdout+"\n"+prove.stderr);
assert.match(prove.stdout,/PROFESSIONAL_CLAIM_GATE_FAIL_UNKNOWN_PASS_DISTINCT/);
assert.match(prove.stdout,/PROFESSIONAL_UNSAFE_APPROVAL_EXPOSED/);
for(const [before,after] of [
 ['if any(result == "FAIL" for result in observed):','if False:'],
 ['if all(result == "PASS" for result in observed):','if any(result == "PASS" for result in observed):']
]){
 assert.ok(choices.includes(before),"Mutation target changed: "+before);
 const wrong=python(choices.replace(before,after));
 assert.notEqual(wrong.status,0,"Unsafe release decision oracle passed");
 assert.match(wrong.stderr,/AssertionError/,"Mutation failed for unrelated reason: "+wrong.stderr);
}
console.log("PASS published professional evidence-state program and two rejected false-green mutants");
const discovery=code("Capstone discovery — evidence provenance and source-presence false-confidence case");
const observed=python(discovery);
assert.equal(observed.status,0,observed.stdout+"\n"+observed.stderr);
assert.match(observed.stdout,/DISCOVERY_OBSERVED_ASSUMED_REPORTED_SEPARATED/);
assert.match(observed.stdout,/DISCOVERY_SOURCE_PRESENCE_FALSE_CONFIDENCE_EXPOSED/);
for(const [before,after] of [
 ['claim.kind == "observation" and\n            claim.independently_checked and','bool(claim.source) and\n            True and'],
 ['claim.independently_checked and','True and']
]){
 assert.ok(discovery.includes(before),"Mutation target changed: "+before);
 const wrong=python(discovery.replace(before,after));
 assert.notEqual(wrong.status,0,"Unchecked discovery source mutant passed");
 assert.match(wrong.stderr,/AssertionError/,"Mutation failed for unrelated reason: "+wrong.stderr);
}
console.log("PASS published discovery provenance program and two rejected false-confidence mutants");
