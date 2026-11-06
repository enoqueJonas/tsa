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
 assert.ok(lens.sections.every((section)=>section.title && section.paragraphs.length>=1 && section.paragraphs.every(text=>text.length>=140)), "Every proposal section needs a substantial explanation, even when one paragraph is sufficient: "+id);
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


// Entire original Independent Build path (module 4), not generic wrappers.
// Read every real original activity and execute the EXACT published runnable code.
const independent = fs.readFileSync(root+"professional-engineer-independent-build-deep.ts","utf8");
const buildLenses = authoredJson(fs.readFileSync(root+"professional-engineer-build-teaching.ts","utf8"),"buildLenses");
const buildPrograms = authoredJson(fs.readFileSync(root+"professional-engineer-build-proofs.ts","utf8"),"buildPrograms");
const originalBuildTopics = [...independent.matchAll(/^\s*reading\("([^"]+)",\s*"([^"]+)",/gm)].map(m=>m[1]);
assert.equal(originalBuildTopics.length,15,"15 real Independent Build topics must remain");
assert.equal(new Set(originalBuildTopics).size,15,"Duplicate original Independent Build topic");
assert.deepEqual(Object.keys(buildLenses).sort(),originalBuildTopics.slice().sort(),
 "Every original Independent Build reading needs subject-specific instructions");
for(const id of originalBuildTopics){
 const lesson=buildLenses[id];
 const explanation=lesson.sections.flatMap(s=>s.paragraphs).join("\n");
 assert.ok(lesson.sections.length>=3,"Thin mechanism/failure/transfer in "+id);
 assert.ok(explanation.length>=1200,"Insufficient actual concept teaching in "+id+" ("+explanation.length+")");
 assert.ok(lesson.sections.every(s=>s.heading && s.paragraphs.length>=1 && s.paragraphs.every(p=>p.length>=140)),
 "Each worked segment needs a meaningful explanation for "+id);
 assert.ok(lesson.practice.length>=2 && lesson.acceptance.length>=2,"Missing independent negative and acceptance: "+id);
 assert.match(lesson.resource.url,/^https:\/\//,"Use targeted primary reference "+id);
}
for(const id of [
 "stage-first-vertical-slice","stage-deployment-and-security-boundaries",
 "stage-operability-recovery-and-reuse"
]){
 assert.ok(independent.includes('"'+id+'"'),"Missing independent evidence gate "+id);
}
for(const block of ["return [lesson, verticalGate]","return [lesson, deploymentGate]","return [lesson, recoveryGate]"])
 assert.ok(independent.includes(block),"Missing prerequisite-positioned lab: "+block);
assert.ok(independent.includes("lab-evaluate-shared-test-capability") &&
          independent.includes("lab-deliver-the-first-end-to-end-capstone-release"),
          "Both original large labs must retain their authored activity IDs");
assert.ok(independent.includes('], 105),') && independent.includes('], 120),'),
 "Original large lab integrators must follow stage gates rather than stay 5–8-hour single exercises");
assert.ok(independent.includes('type: "code", language: "python", caption: program.caption, code: program.code'),
 "Original learner reading must expose copyable runnable source");
console.log("PASS 15 original Independent Build topics, 3 staged labs, and 2 preserved original lab IDs");

const negativeBuildMutants={
 "model-the-domain":["if loan.status == \"issued\" and command == \"return\":","if command == \"return\":"],
 "design-and-evolve-the-data":["CREATE UNIQUE INDEX one_active_loan_per_item","CREATE INDEX one_active_loan_per_item"],
 "automate-delivery":["return digest(candidate) == tested_digest","return True"],
 "secure-the-system":["if actor.team != item.owning_team:","if False:"],
 "instrument-the-system":["selected = {key: event[key] for key in SAFE_KEYS if key in event}","selected = dict(event)"],
 "build-reliability-evidence":["backup.backup(restored)","original.backup(restored)"],
};
const expectedBuildOutput={
 "model-the-domain":["BUILD_LIFECYCLE_VALID_AND_FORBIDDEN_PASS","BUILD_REISSUE_MUTANT_EXPOSED"],
 "design-and-evolve-the-data":["BUILD_DUPLICATE_ACTIVE_LOAN_REJECTED","BUILD_ACTIVE_VS_HISTORICAL_LOAN_PASS"],
 "automate-delivery":["BUILD_TAG_REUSED_BYTES_DIFFER","BUILD_SAME_DIGEST_REQUIRED_FOR_PROMOTION","BUILD_UNSAFE_TAG_ONLY_PROMOTION_EXPOSED"],
 "secure-the-system":["BUILD_SCOPED_DENIAL_ZERO_SIDE_EFFECTS","BUILD_DENIED_RESPONSE_WITH_FORBIDDEN_WRITE_EXPOSED"],
 "instrument-the-system":["BUILD_SAFE_DIAGNOSTIC_EVENT_PASS","BUILD_UNSAFE_LOGGING_LEAK_EXPOSED"],
 "build-reliability-evidence":["BUILD_ORIGINAL_STATE_CHANGED","BUILD_DISPOSABLE_RESTORE_VERIFIED","BUILD_LATE_BACKUP_REJECTED"],
};
assert.deepEqual(Object.keys(buildPrograms).sort(),Object.keys(negativeBuildMutants).sort(),"Every published Independent Build runnable oracle needs its own negative mutation");
for(const id of Object.keys(buildPrograms)){
 const program=buildPrograms[id];
 assert.ok(program.caption && program.expected && program.code,"Missing exact published original-source proof "+id);
 const result=python(program.code);
 assert.equal(result.status,0,id+" published source failed:\n"+result.stdout+"\n"+result.stderr);
 for(const marker of expectedBuildOutput[id])assert.ok(result.stdout.includes(marker),"Missing published result "+id+" "+marker);
 const [before,after]=negativeBuildMutants[id];
 assert.ok(program.code.includes(before),"Unsafe source mutation no longer matches exact published code "+id);
 const mutated=python(program.code.replace(before,after));
 assert.notEqual(mutated.status,0,"Unsafe Independent Build variant unexpectedly passed "+id);
 assert.match(mutated.stderr,/AssertionError/,"Unexpected unsafe-mutation failure "+id+": "+mutated.stderr);
 console.log("PASS exact Independent Build "+id+" with unsafe variant rejected");
}
