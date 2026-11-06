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


// Complete original Capstone Engineering Proposal module: every original
// reading must teach a distinct mechanism, failure and independent transfer.
// Source-extracted programs are executed unchanged, then made deliberately wrong.
const proposal=fs.readFileSync(root+"professional-engineer-capstone-engineering-proposal-deep.ts","utf8");
const lensSource=fs.readFileSync(root+"professional-engineer-proposal-teaching.ts","utf8");
const programSource=fs.readFileSync(root+"professional-engineer-proposal-proofs.ts","utf8");
function authoredJson(source,variable){
 const at=source.indexOf("export const "+variable+":");
 assert.ok(at>0,"Missing published source "+variable);
 const text=source.slice(at).match(/=\s*(\{[\s\S]*\});\s*$/);
 assert.ok(text,"Could not extract literal authoring object "+variable);
 return JSON.parse(text[1]);
}
const lenses=authoredJson(lensSource,"proposalLenses");
const programs=authoredJson(programSource,"proposalPrograms");
const originals=[...proposal.matchAll(/^\s*reading\("([^"]+)",\s*"([^"]+)",/gm)];
const keys=originals.map((m)=>m[1]);
assert.equal(keys.length,14,"Proposal must retain exactly 14 original topics");
assert.equal(new Set(keys).size,14,"Proposal contains duplicated original lesson IDs");
assert.deepEqual(Object.keys(lenses).sort(),keys.slice().sort(),"Every original reading needs its own authored explanation");
for(const id of keys){
 const lens=lenses[id];
 assert.ok(lens.sections.length>=3,"Insufficient mechanism/failure/decision work: "+id);
 const body=lens.sections.flatMap((section)=>section.paragraphs).join("\n");
 assert.ok(body.length>=1300,"Still a thin original proposal reading: "+id+" chars "+body.length);
 assert.ok(lens.sections.every((section)=>section.title && section.paragraphs.length>=2));
 assert.ok(lens.practice.length>=2&&lens.acceptance.length>=2,"Missing independent countercase and scoring boundary: "+id);
 assert.match(lens.resource.url,/^https:\/\//,"Learning resource must be a targeted HTTPS reference");
}
assert.ok(proposal.includes("return [lesson, boundaryGate]"));
assert.ok(proposal.includes("return [lesson, deliveryGate]"));
assert.ok(proposal.includes("return [lesson, decisionGate]"));
assert.ok(proposal.includes('id: stableId + "-practice"'));
assert.ok(proposal.includes('id: stableId + "-check"'));
assert.ok(proposal.includes("estimatedMinutes: 85"),"Seven-hour final must be decomposed into three stages and synthesis");
assert.ok(proposal.includes("lab-defend-the-capstone-engineering-proposal-001"),"Original final ID must remain stable");
assert.ok(proposal.includes('type: "code", language: "python", code: program.code, caption: program.caption'));
console.log("PASS fourteen distinct proposal readings, original IDs, three review stages and 85-minute synthesis");
for(const [id,expected] of [
 ["domain-and-data-model-proposal",["PROPOSAL_LOCAL_LOAN_INVARIANT_PASS","PROPOSAL_UNSAFE_LOAN_ISSUE_EXPOSED"]],
 ["delivery-plan",["PROPOSAL_RELEASE_PASS_MISSING_FAIL_DISTINCT","PROPOSAL_FALSE_GREEN_PROMOTION_EXPOSED"]],
 ["cost-model",["PROPOSAL_DECIMAL_BUDGET_AND_CROSSING_PASS","PROPOSAL_NEGATIVE_VOLUME_REJECTED","PROPOSAL_IGNORED_VARIABLE_COST_EXPOSED"]]
]){
 const item=programs[id];
 assert.ok(item && item.caption && item.expected,"Missing source published proof "+id);
 const good=python(item.code);
 assert.equal(good.status,0,id+" source failed: "+good.stdout+"\n"+good.stderr);
 for(const marker of expected) assert.ok(good.stdout.includes(marker),id+" expected "+marker);
 const mutants={
  "domain-and-data-model-proposal": ["return active_loan_count(item, loans) == 0","return active_loan_count(item, loans) >= 0"],
  "delivery-plan": ['if any(result == "FAIL" for result in outcomes):',"if False:"],
  "cost-model": ["return BASE + PER_LOAN * Decimal(loans)","return BASE"],
 };
 const [from,to]=mutants[id];
 assert.ok(item.code.includes(from),"Cannot form unsafe source mutant "+id);
 const wrong=python(item.code.replace(from,to));
 assert.notEqual(wrong.status,0,"Unsafe proposal mutant unexpectedly passed "+id);
 assert.match(wrong.stderr,/AssertionError/,"Wrong failure reason for "+id+": "+wrong.stderr);
 console.log("PASS exact published proposal "+id+" and rejected wrong-implementation mutant");
}
