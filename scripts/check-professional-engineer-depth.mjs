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


// Full module 5: every original Production Readiness reading remains authored,
// while a missing accessibility prerequisite and independently reviewed gates
// are added in sequence. Run EXACT published Python, not a rewritten stand-in.
const readinessSource=fs.readFileSync(root+"professional-engineer-production-readiness-deep.ts","utf8");
const readinessLenses=authoredJson(fs.readFileSync(root+"professional-engineer-readiness-teaching.ts","utf8"),"readinessLenses");
const readinessPrograms=authoredJson(fs.readFileSync(root+"professional-engineer-readiness-proofs.ts","utf8"),"readinessPrograms");
const readinessOriginalTopics=[...readinessSource.matchAll(/^\s*reading\("([^"]+)",\s*"([^"]+)",/gm)].map(m=>m[1]);
const readinessExpectedOriginal=[
 "deployment-readiness","observability","security-assessment","performance-evidence",
 "reliability-and-failure-testing","backup-and-recovery","runbooks","operational-ownership",
 "risk-and-control-evidence","dependency-and-supply-chain-readiness",
 "cost-and-capacity-review","release-decision"
];
assert.equal(readinessOriginalTopics.length,13,"Twelve original plus separate accessibility prerequisite expected");
assert.deepEqual(
 readinessOriginalTopics.filter(id=>id!=="accessibility-and-human-workflow-readiness"),
 readinessExpectedOriginal,"Original authored topics must retain order and exact IDs"
);
assert.equal(readinessOriginalTopics[3],"accessibility-and-human-workflow-readiness",
 "A missing accessibility prerequisite must appear before final user-workflow acceptance");
assert.deepEqual(Object.keys(readinessLenses).sort(),readinessOriginalTopics.slice().sort(),
 "Every original readiness reading must teach actual mechanisms and failure diagnosis");
for(const id of readinessOriginalTopics){
 const lens=readinessLenses[id];
 const explanation=lens.sections.flatMap(section=>section.paragraphs).join("\n");
 assert.ok(lens.sections.length>=3,"Shallow readiness mechanisms: "+id);
 assert.ok(explanation.length>=1350,"Insufficient learner material "+id+": "+explanation.length);
 assert.ok(lens.sections.every(section=>section.heading && section.paragraphs.length>=2
    && section.paragraphs.every(p=>p.length>=135)),
    "At least one readiness mechanism still assumes the learner knows the missing prerequisite: "+id);
 assert.ok(lens.practice.length>=2 && lens.acceptance.length>=2,
  "Missing actual system proof/counterexample and oracle: "+id);
 assert.match(lens.resource.url,/^https:\/\//,"Missing targeted primary reference "+id);
}
for(const gate of [
 "stage-release-observation-and-human-use",
 "stage-fault-restore-and-operational-ownership",
 "stage-risk-dependency-cost-and-release-authority"
])assert.ok(readinessSource.includes('"'+gate+'"'),"Missing staged operational review "+gate);
for(const stage of [
 "return [lesson,releaseGate]","return [lesson,recoveryGate]",
 "return [lesson,decisionGate]"
])assert.ok(readinessSource.includes(stage),"Incorrect prerequisite sequencing: "+stage);
assert.ok(readinessSource.includes('practical("lab-run-the-capstone-production-readiness-review"') && readinessSource.includes('id: `${pathId}-${id}-001`'),
 "The original practical factory must still create its stable final lab activity ID");
assert.ok(readinessSource.includes("], 95),"),
 "Original 480-minute lab remains overloaded; it should be stage synthesis");
assert.ok(readinessSource.includes('type: "code", language: "python", code:program.code'),
 "The actual reading must render copyable executable example");
console.log("PASS original 12 Production Readiness topics, accessibility prerequisite, 3 gate checkpoints and preserved final ID");

const readinessMutations={
 "deployment-readiness":['if sha256(payload).hexdigest() != tested_digest:',"if False:"],
 "observability":['return user_failure_rate(items) > 0.5',"return False"],
 "performance-evidence":['return sorted_values[ceil(len(sorted_values) * 0.95) - 1]',"return int(sum(samples) / len(samples))"],
 "backup-and-recovery":['before_fault.backup(restored)',"original.backup(restored)"],
 "risk-and-control-evidence":['if any(value == "FAIL" for value in outcomes):',"if False:"],
 "dependency-and-supply-chain-readiness":['record["license"] != "VERIFIED"','False'],
 "cost-and-capacity-review":['return FIXED + PER_LOAN * Decimal(loans)',"return FIXED"],
};
const readinessExpectedMarkers={
 "deployment-readiness":["READINESS_DEPLOY_ARTIFACT_AND_MIGRATION_PASS","READINESS_UNSAFE_TAG_GATE_REJECTED"],
 "observability":["READINESS_HEALTH_GREEN_USER_FAILURE_DETECTED","READINESS_UNSAFE_HEALTH_ONLY_ALERT_EXPOSED"],
 "performance-evidence":["READINESS_TAIL_AND_EMPTY_SAMPLE_VALIDATED","READINESS_AVERAGE_MASKED_TAIL_EXPOSED"],
 "backup-and-recovery":["READINESS_PREFAULT_RESTORE_INTEGRITY_PASS","READINESS_LATE_SNAPSHOT_NOT_RECOVERY"],
 "risk-and-control-evidence":["READINESS_CONTROL_PASS_FAIL_MISSING_DISTINCT","READINESS_ONE_GREEN_UNSAFE_AGGREGATION_EXPOSED"],
 "dependency-and-supply-chain-readiness":["READINESS_LICENSE_PROVENANCE_VULN_DISTINCT","READINESS_HASH_NOT_LICENSE_EXPOSED"],
 "cost-and-capacity-review":["READINESS_DECIMAL_COST_THRESHOLD_PASS","READINESS_NEGATIVE_VOLUME_REJECTED","READINESS_IGNORED_USAGE_COST_EXPOSED"],
};
assert.deepEqual(Object.keys(readinessPrograms).sort(),Object.keys(readinessMutations).sort(),
 "Every runnable readiness program must have a targeted unsafe mutation");
for(const id of Object.keys(readinessPrograms)){
 const program=readinessPrograms[id];
 assert.ok(program.caption && program.code && program.expected,"Missing learner-visible program "+id);
 const verified=python(program.code);
 assert.equal(verified.status,0,"Original published readiness Python failed "+id+":\n"+verified.stdout+"\n"+verified.stderr);
 for(const marker of readinessExpectedMarkers[id])
    assert.ok(verified.stdout.includes(marker),"Learner outcome marker missing "+id+" "+marker);
 const [source,mutant]=readinessMutations[id];
 assert.ok(program.code.includes(source),"Mutant source changed "+id);
 const wrong=python(program.code.replace(source,mutant));
 assert.notEqual(wrong.status,0,"Unsafe readiness source was not caught by oracle "+id);
 assert.match(wrong.stderr,/AssertionError/,"Wrong failure reason for readiness "+id+": "+wrong.stderr);
 console.log("PASS exact Production Readiness "+id+" with unsafe mutation rejected");
}


// Module 6: actual Professional Portfolio & Reflection author source. The three
// original stable lesson/activity IDs remain, while four necessary foundations
// and two integration stages expose claims that previously lacked provenance.
const portfolioSource=fs.readFileSync(root+"professional-engineer-portfolio-reflection-deep.ts","utf8");
const portfolioLenses=authoredJson(fs.readFileSync(root+"professional-engineer-portfolio-teaching.ts","utf8"),"portfolioLenses");
const portfolioPrograms=authoredJson(fs.readFileSync(root+"professional-engineer-portfolio-proofs.ts","utf8"),"portfolioPrograms");
const expectedPortfolioOrder=[
 "evidence-portfolio","portfolio-claim-calibration",
 "reflective-practice","engineering-decision-postmortems",
 "responsible-evidence-disclosure","independent-peer-review",
 "professional-development"
];
const actualPortfolioOrder=[...portfolioSource.matchAll(/^lesson\("([^"]+)",/gm)].map(m=>m[1]);
assert.deepEqual(actualPortfolioOrder,expectedPortfolioOrder,
 "All 3 original portfolio lessons must retain their order and stable IDs; extra prerequisites must sit between them.");
assert.deepEqual(Object.keys(portfolioLenses).sort(),expectedPortfolioOrder.slice().sort(),
 "Every original and new portfolio lesson requires its own taught mechanism, not a generic wrapper.");
for(const id of expectedPortfolioOrder){
 const lens=portfolioLenses[id];
 const prose=lens.sections.flatMap(section=>section.paragraphs).join("\n");
 assert.ok(lens.sections.length>=3 && prose.length>=1700,
  "Portfolio lesson is too thin to support a new independent engineer: "+id+" "+prose.length);
 assert.ok(lens.sections.every(section=>section.heading && section.paragraphs.length>=2
   && section.paragraphs.every(paragraph=>paragraph.length>=140)),
   "Each actual portfolio teaching mechanism must explain the failure/alternative: "+id);
 assert.ok(lens.practice.length>=2 && lens.criteria.length>=2,
   "The portfolio must have a concrete independent counterexample and evaluation: "+id);
 assert.match(lens.resource.url,/^https:\/\//,"Missing targeted reference: "+id);
}
for(const id of ["evidence-portfolio","reflective-practice","professional-development"]){
 assert.ok(portfolioSource.includes('lesson("'+id+'"'),"Lost original reading/practical "+id);
}
assert.ok(portfolioSource.includes("professional-portfolio-"+'$'+"{id}-reading"));
assert.ok(portfolioSource.includes("professional-portfolio-"+'$'+"{id}-practice"));
for(const gate of ["stage-claim-evidence-authentication","stage-causal-review-and-responsible-publication"])
 assert.ok(portfolioSource.includes('"'+gate+'"'),"Missing staged portfolio evidence gate "+gate);
assert.ok(portfolioSource.includes("if(index===1)return [lesson,claimGate]"));
assert.ok(portfolioSource.includes("if(index===5)return [lesson,reviewGate]"));
assert.ok(portfolioSource.includes('"professional-portfolio-lab-independent-evidence-handoff-001"'),
 "Missing independently navigable evidence/learning handoff");
assert.ok(portfolioSource.includes('type:"code",language:"python",code:program.code,caption:program.caption'),
 "Actual published source program must appear in original/new portfolio reading");
console.log("PASS 3 original Portfolio IDs, four new first-principles lessons, two staged challenge labs and final evidence handoff");

const portfolioMutants={
 "evidence-portfolio":['if claim.evidence_mode != "INDEPENDENT":',"if False:"],
 "portfolio-claim-calibration":['if item.observed_environment != item.claimed_environment:',"if False:"],
 "engineering-decision-postmortems":['e.observed_at_minute <= decision_minute',"True"],
 "responsible-evidence-disclosure":['if a.owner != "SELF" and not a.explicit_public_permission:',"if False:"],
 "professional-development":['if not all((obj.source, obj.novel_task,','if False and not all((obj.source, obj.novel_task,']
};
const portfolioExpected={
 "evidence-portfolio":["PORTFOLIO_SCOPED_CLAIM_MODES_DISTINGUISHED","PORTFOLIO_LINK_ONLY_FALSE_CONFIDENCE_EXPOSED"],
 "portfolio-claim-calibration":["PORTFOLIO_ENVIRONMENT_SCOPE_AND_NEGATIVE_PASS","PORTFOLIO_SQLITE_TO_PRODUCTION_OVERCLAIM_EXPOSED"],
 "engineering-decision-postmortems":["PORTFOLIO_DECISION_TIME_KNOWLEDGE_FILTER_PASS","PORTFOLIO_HINDSIGHT_RECONSTRUCTION_EXPOSED"],
 "responsible-evidence-disclosure":["PORTFOLIO_DISCLOSURE_OWNERSHIP_PERMISSION_REDACTION_DISTINCT","PORTFOLIO_REDACTED_BUT_NOT_AUTHORIZED_EXPOSED"],
 "professional-development":["PORTFOLIO_PLAN_FEASIBLE_AND_EVIDENCED_PASS","PORTFOLIO_COURSE_ATTENDANCE_NOT_COMPETENCE"]
};
assert.deepEqual(Object.keys(portfolioPrograms).sort(),Object.keys(portfolioMutants).sort(),
 "Each published Portfolio executable example needs a targeted bad implementation.");
for(const id of Object.keys(portfolioPrograms)){
 const program=portfolioPrograms[id];
 assert.ok(program.caption && program.code && program.expected,"No published learner source "+id);
 const good=python(program.code);
 assert.equal(good.status,0,id+" published source failed:\n"+good.stdout+"\n"+good.stderr);
 for(const marker of portfolioExpected[id]){
   assert.ok(good.stdout.includes(marker),"Missing original Portfolio example observation "+id+" "+marker);
 }
 const [before,after]=portfolioMutants[id];
 assert.ok(program.code.includes(before),"Original Portfolio source mutation target missing: "+id);
 const bad=python(program.code.replace(before,after));
 assert.notEqual(bad.status,0,"Misleading Portfolio implementation passed its claims: "+id);
 assert.match(bad.stderr,/AssertionError/,"Mutation failed for unrelated reason in "+id+": "+bad.stderr);
 console.log("PASS exact Portfolio example "+id+" and rejected false-confidence mutation");
}


// Final module: the twelve ORIGINAL Defence readings are the curriculum, not
// a synthetic prep wrapper. Execute exact authored learner examples and mutate
// deliberately unsafe decisions so green output alone cannot pass.
const defenceSource=fs.readFileSync(root+"professional-engineer-defence-deep.ts","utf8");
const defenceLenses=authoredJson(fs.readFileSync(root+"professional-engineer-defence-teaching.ts","utf8"),"defenceLenses");
const defencePrograms=authoredJson(fs.readFileSync(root+"professional-engineer-defence-proofs.ts","utf8"),"defencePrograms");
const defenceOriginal=[
 "present-the-problem-and-outcomes","present-the-architecture","explain-trade-offs",
 "present-engineering-evidence","defend-quality-decisions","defend-security-decisions",
 "defend-reliability-decisions","defend-governance-decisions","respond-to-challenges",
 "state-limitations","propose-future-evolution","reflect-on-the-tsa-journey"
];
const observedOrder=[...defenceSource.matchAll(/^\s*reading\("([^"]+)",/gm)].map(m=>m[1]);
assert.deepEqual(observedOrder,defenceOriginal,"Preserve all 12 actual original Defence IDs and learner order");
assert.deepEqual(Object.keys(defenceLenses).sort(),defenceOriginal.slice().sort(),"Every Defence original concept needs distinct author-written reasoning");
for(const id of defenceOriginal){
 const lens=defenceLenses[id],parts=lens.sections.flatMap(s=>s.paragraphs);
 assert.ok(lens.sections.length>=3 && parts.join("\n").length>=1400,"Thin original Defence explanation: "+id);
 assert.ok(lens.sections.every(s=>s.heading && s.paragraphs.length>=2 && s.paragraphs.every(p=>p.length>=140)),"Missing concrete mechanism/failure/alternative: "+id);
 assert.ok(lens.practice.length>=2 && lens.criteria.length>=2,"Missing independently falsifiable practice: "+id);
 assert.match(lens.resource.url,/^https:\/\//,"No targeted reference: "+id);
}
assert.ok(defenceSource.includes('milestone("professional-engineering-capstone-and-defence"'),"Original full milestone identifier changed");
assert.ok(defenceSource.includes('], 115),'),"Original 720-minute milestone not split after stages");
for(const id of ["stage-problem-architecture-and-evidence",
 "stage-quality-security-reliability-and-governance",
 "stage-limitations-surprise-and-independent-transfer"])
 assert.ok(defenceSource.includes('"'+id+'"'),"Missing staged Defence evidence challenge "+id);
for(const x of ["return [lesson,contextGate]","return [lesson,assuranceGate]","return [lesson,evolutionGate]"])
 assert.ok(defenceSource.includes(x),"Defence gate misplaced: "+x);
assert.ok(defenceSource.includes('type:"code",language:"python",caption:program.caption,code:program.code'),"Actual reading does not expose runnable source");
console.log("PASS 12 original Defence concepts, three staged gates and preserved final milestone");
const defenceMutants={
 "present-the-problem-and-outcomes":['if not item.stakeholder_validation:',"if False:"],
 "present-the-architecture":['if actor.cooperative != item.cooperative:',"if False:"],
 "present-engineering-evidence":['if c.observed_env != c.claimed_env:',"if False:"],
 "defend-quality-decisions":['and result.unauthorized_row_delta == 0',"and True"],
 "defend-governance-decisions":['if g.restore == "FAIL" or g.security == "FAIL" or g.license == "INCOMPATIBLE":',"if False:"],
 "respond-to-challenges":['if any(value == "FAIL" for value in states):',"if False:"]
};
const defenceMarkers={
 "present-the-problem-and-outcomes":["DEFENCE_IMPLEMENTATION_NOT_USER_BENEFIT_PROVEN","DEFENCE_FALSE_STAKEHOLDER_OUTCOME_EXPOSED"],
 "present-the-architecture":["DEFENCE_AUTHORIZED_AND_FORBIDDEN_SIDE_EFFECT_BOUNDARY","DEFENCE_HTTP_DENIAL_WITH_BAD_WRITE_EXPOSED"],
 "present-engineering-evidence":["DEFENCE_CLAIM_SOURCE_SCOPE_AND_NEGATIVE_VALIDATED","DEFENCE_SOURCE_LINK_AS_PRODUCTION_EVIDENCE_REJECTED"],
 "defend-quality-decisions":["DEFENCE_NEGATIVE_ORACLE_CHECKS_STATE_AND_SEMANTICS","DEFENCE_STATUS_ONLY_FALSE_NEGATIVE_EXPOSED"],
 "defend-governance-decisions":["DEFENCE_GOVERNANCE_FAIL_MISSING_PASS_DISTINCT","DEFENCE_FALSE_RISK_APPROVAL_EXPOSED"],
 "respond-to-challenges":["DEFENCE_CHANGED_EVIDENCE_CHANGES_RECOMMENDATION","DEFENCE_UNSAFE_GREEN_WHEN_BLOCKED_EXPOSED"]
};
assert.deepEqual(Object.keys(defencePrograms).sort(),Object.keys(defenceMutants).sort(),"Every published Defence example must have a targeted wrong implementation");
for(const id of Object.keys(defencePrograms)){
 const program=defencePrograms[id];
 assert.ok(program.caption && program.code && program.expected,"Missing exact published Defence code "+id);
 const result=python(program.code);
 assert.equal(result.status,0,"Actual learner Defence example fails "+id+":\n"+result.stdout+"\n"+result.stderr);
 for(const marker of defenceMarkers[id])assert.ok(result.stdout.includes(marker),"Missing published learning result "+id+" "+marker);
 const [before,after]=defenceMutants[id];
 assert.ok(program.code.includes(before),"Cannot mutate exact Defence source "+id);
 const bad=python(program.code.replace(before,after));
 assert.notEqual(bad.status,0,"Unsafe Defence code passed its own oracle "+id);
 assert.match(bad.stderr,/AssertionError/,"Wrong failure for source-derived Defence mutant "+id+": "+bad.stderr);
 console.log("PASS exact Defence "+id+" and targeted unsafe mutant rejected");
}


// Original Capstone Problem Discovery module 2: teach source-verified
// problem choice before proposing an architecture; keep historic IDs.
const choiceFile = fs.readFileSync(root+"professional-engineer-discovery-problem-choice.ts","utf8");
const choiceSourceLine = choiceFile.split("\n").find(x=>x.startsWith("export const problemSelectionProofPython = "));
assert.ok(choiceSourceLine?.endsWith(";"),"Missing exact published discovery selection gate");
const choiceCode = JSON.parse(choiceSourceLine.slice("export const problemSelectionProofPython = ".length,-1));
const choiceBlocksAnchor="export const problemChoiceBlocks: LessonBlock[] = ";
assert.ok(choiceFile.includes(choiceBlocksAnchor),"Missing instructional choice blocks");
const choiceBlocks = JSON.parse(choiceFile.slice(choiceFile.indexOf(choiceBlocksAnchor)+choiceBlocksAnchor.length).trim().replace(/;\s*$/,""));
assert.ok(choiceBlocks.filter(x=>x.type==="heading").length>=5,"Original reading needs distinct source reasoning, not generic boilerplate");
assert.ok(choiceBlocks.filter(x=>x.type==="paragraph").length>=9,"Insufficient worked problem selection depth");
assert.equal(choiceBlocks.filter(x=>x.type==="code").length,1,"A single source-published executable gate is required");
assert.equal(choiceBlocks.find(x=>x.type==="code").code,choiceCode,"Displayed selection proof must be the exact executed source");
const originalChoice = fs.readFileSync(root+"professional-engineer-capstone-problem-discovery-deep.ts","utf8");
assert.ok(originalChoice.includes('id === "capstone-problem-discovery-choosing-a-substantial-problem"'),"Only the first original lesson must be expanded");
assert.ok(originalChoice.includes("...problemChoiceBlocks"),"Original discovery reading not connected to focused source");
assert.ok(originalChoice.includes("Run the exact published Python discovery-selection gate"),"Original paired practical has no executable task");
assert.ok(originalChoice.includes('reading("capstone-problem-discovery-choosing-a-substantial-problem"'),"Original lesson/progress identity missing");
const choiceGood=python(choiceCode);
assert.equal(choiceGood.status,0,choiceGood.stdout+"\n"+choiceGood.stderr);
assert.match(choiceGood.stdout,/DISCOVERY_SELECTION_GATES_PASS/);
for(const [before,after,why] of [
 ["if not candidate.stakeholder_access_verified:","if not candidate.stakeholder_access_claimed:","unverified stakeholder access"],
 ["if not candidate.evidence_collection_authorized:","if False:","missing data-use permission"],
 ["if not candidate.scope_bounded:","if False:","unbounded capstone scope"]
]){
 assert.ok(choiceCode.includes(before),"Changed selection gate for "+why);
 const wrong=python(choiceCode.replace(before,after));
 assert.notEqual(wrong.status,0,"Unsafe selection mutant was accepted: "+why);
 assert.match(wrong.stderr,/AssertionError/,"Selection mutant failed for unrelated reason: "+why+" "+wrong.stderr);
}
console.log("PASS original module-2 problem-choice reading/practical, exact Python source and three rejected evidence-gate mutants");


// Original Capstone Problem Discovery Stakeholder Discovery is deliberately
// split into map -> neutral interview -> contradictory evidence, before the
// preserved practical. The published classroom coverage gate must run exactly,
// and wrong ethics/sampling/confirmation variants must fail the real oracle.
const stakeholderFile=fs.readFileSync(root+"professional-engineer-discovery-stakeholders.ts","utf8");
const stakeholderPrefix="export const stakeholderCoveragePython = ";
const stakeholderLine=stakeholderFile.split("\n").find(line=>line.startsWith(stakeholderPrefix));
assert.ok(stakeholderLine?.endsWith(";"),"Missing exact source-published stakeholder Python");
const stakeholderCode=JSON.parse(stakeholderLine.slice(stakeholderPrefix.length,-1));
function stakeholderSection(name,nextName){
 const prefix="export const "+name+": LessonBlock[] = ";
 const begin=stakeholderFile.indexOf(prefix);
 assert.ok(begin>=0,"Missing authored stakeholder reading "+name);
 const offset=begin+prefix.length;
 const next=nextName ? stakeholderFile.indexOf(";\nexport const "+nextName+":",offset)
   : stakeholderFile.lastIndexOf(";\n");
 assert.ok(next>offset,"Cannot read exact authored stakeholder section "+name);
 return JSON.parse(stakeholderFile.slice(offset,next));
}
const mapping=stakeholderSection("stakeholderMappingBlocks","stakeholderInterviewBlocks");
const interviews=stakeholderSection("stakeholderInterviewBlocks","stakeholderTriangulationBlocks");
const triangulation=stakeholderSection("stakeholderTriangulationBlocks",null);
for(const [label,blocks,limit] of [["mapping",mapping,4500],["interview",interviews,3500],["triangulation",triangulation,2900]]){
 assert.ok(blocks.filter(x=>x.type==="heading").length>=3,"Overloaded or unstructured stakeholder "+label);
 assert.ok(blocks.filter(x=>x.type==="paragraph").length>=6,"Thin stakeholder "+label);
 assert.ok(blocks.filter(x=>x.type==="resources").length===1,"Missing targeted source for stakeholder "+label);
 const prose=blocks.filter(x=>x.type==="paragraph").map(x=>x.text).join("\n");
 assert.ok(prose.length>=limit,"Stakeholder "+label+" lacks subject-specific mechanism and counterexamples");
}
assert.equal(mapping.filter(x=>x.type==="code").length,1,"Mapping should expose one exact coverage program");
assert.equal(mapping.find(x=>x.type==="code").code,stakeholderCode,"Learner mapping Python differs from source executed in CI");
assert.equal(interviews.filter(x=>x.type==="code").length,0);
assert.equal(triangulation.filter(x=>x.type==="code").length,0);
const stakeholderOriginal=fs.readFileSync(root+"professional-engineer-capstone-problem-discovery-deep.ts","utf8");
assert.ok(stakeholderOriginal.includes('id === "capstone-problem-discovery-stakeholder-discovery"'));
assert.ok(stakeholderOriginal.includes("...stakeholderMappingBlocks"),"Original Stakeholder reading not connected");
assert.ok(stakeholderOriginal.includes('id: `${id}-interview-method-reading`'),"Interview step not independently navigable");
assert.ok(stakeholderOriginal.includes('id: `${id}-triangulation-reading`'),"Triangulation step not independently navigable");
assert.ok(stakeholderOriginal.indexOf("...stakeholderReadings")<stakeholderOriginal.indexOf('id: `${id}-practice`'),"Stakeholder learning must precede original practical");
assert.ok(stakeholderOriginal.includes("Run the original reading's exact Python stakeholder-coverage fixture"),"Original practical missing source execution");
assert.ok(stakeholderOriginal.includes('reading("capstone-problem-discovery-stakeholder-discovery"'),"Lost original stakeholder lesson ID");
const stakeholderGood=python(stakeholderCode);
assert.equal(stakeholderGood.status,0,stakeholderGood.stdout+"\n"+stakeholderGood.stderr);
for(const marker of ["manager_only: MISSING_STAKEHOLDER_VOICE","unconsented: UNAUTHORIZED_RECORD","leading_prompt: LEADING_QUESTION_BIAS","only_testimony: TESTIMONY_ONLY_CAUSE_UNVERIFIED","broader_sample: READY_TO_CHALLENGE_CAUSAL_HYPOTHESIS","STAKEHOLDER_COVERAGE_BIAS_GATE_PASS"]){
 assert.ok(stakeholderGood.stdout.includes(marker),"Missing exact stakeholder evidence trace: "+marker);
}
for(const [before,why] of [
 ['if any(r.collected and not r.consent for r in records):',"authorization bypass"],
 ['if any(r.collected and r.prompt == "leading" for r in records):',"leading-question acceptance"],
 ['if not REQUIRED.issubset(represented):',"missing affected voice"],
 ['if not any(r.collected and r.kind == "observation" for r in records):',"unsupported causal inference"]
]){
 assert.ok(stakeholderCode.includes(before),"Changed learner mutation target: "+why);
 const bad=python(stakeholderCode.replace(before,"if False:"));
 assert.notEqual(bad.status,0,"Wrong stakeholder implementation was accepted: "+why);
 assert.match(bad.stderr,/AssertionError/,"Wrong failure reason for stakeholder "+why+": "+bad.stderr);
}
console.log("PASS original stakeholder source, three navigable readings, exact Python and four unsafe mutants rejected");


// Original Problem Framing: workflow and measurement before causal/scope claims.
const framingSource=fs.readFileSync(root+"professional-engineer-discovery-framing.ts","utf8");
const framingPrefix="export const problemFramingTimelinePython = ";
const framingLine=framingSource.split("\n").find(line=>line.startsWith(framingPrefix));
assert.ok(framingLine?.endsWith(";"),"Missing original Problem Framing executable source");
const framingPython=JSON.parse(framingLine.slice(framingPrefix.length,-1));
function framingBlocks(name,nextName){
 const prefix="export const "+name+": LessonBlock[] = ";
 const at=framingSource.indexOf(prefix);
 assert.ok(at>=0,"Missing source-authored framing "+name);
 const start=at+prefix.length;
 const end=nextName?framingSource.indexOf("export const "+nextName+":",start):framingSource.length;
 assert.ok(end>start,"Malformed framing source section "+name);
 // Ignore authoring whitespace between consecutive exact JSON literals, not teaching content.
 return JSON.parse(framingSource.slice(start,end).trim().replace(/;\s*$/,""));
}
const frameWorkflow=framingBlocks("problemFramingWorkflowBlocks","problemFramingMeasurementBlocks");
const frameMeasured=framingBlocks("problemFramingMeasurementBlocks","problemFramingBoundaryBlocks");
const frameBoundary=framingBlocks("problemFramingBoundaryBlocks",null);
for(const [name,blocks,minimum] of [["workflow",frameWorkflow,3500],["measurement",frameMeasured,3000],["boundary",frameBoundary,3800]]){
 assert.ok(blocks.filter(b=>b.type==="heading").length>=3,"Thin framing mechanisms "+name);
 assert.ok(blocks.filter(b=>b.type==="paragraph").length>=6,"Thin framing prose "+name);
 assert.ok(blocks.filter(b=>b.type==="resources").length===1,"Missing targeted reading resource "+name);
 assert.ok(blocks.filter(b=>b.type==="paragraph").map(b=>b.text).join("\n").length>=minimum,
  "Insufficient explicit subject explanation "+name);
}
assert.equal(frameWorkflow.filter(b=>b.type==="code").length,0);
assert.equal(frameMeasured.filter(b=>b.type==="code").length,1);
assert.equal(frameBoundary.filter(b=>b.type==="code").length,0);
assert.equal(frameMeasured.find(b=>b.type==="code").code,framingPython,"Published Python differs from test program");
const frameOriginal=fs.readFileSync(root+"professional-engineer-capstone-problem-discovery-deep.ts","utf8");
assert.ok(frameOriginal.includes('id === "capstone-problem-discovery-problem-framing"'),"Original framing ID not recognized");
for(const exact of ["...problemFramingWorkflowBlocks","...framingReadings","-measurement-reading","-causality-boundary-reading",
 "Run the exact learner-published Python nine-case timeline experiment",
 'reading("capstone-problem-discovery-problem-framing"']){
 assert.ok(frameOriginal.includes(exact),"Missing original framing lesson/practice wiring "+exact);
}
assert.ok(frameOriginal.indexOf("...framingReadings")<frameOriginal.indexOf("-practice"),"Frame source teaching must precede original practical");
const goodFrame=python(framingPython);
assert.equal(goodFrame.status,0,goodFrame.stdout+"\n"+goodFrame.stderr);
for(const marker of ["COHORT complete=6/9 unverified=3/9","STAGES supplier_gt50=3/6 document_gt30=2/6",
"W03 document=40 supplier=10 total=60","W09 status_claim=RESOLVED evidence=INCOMPLETE",
"X01 INVALID_CHRONOLOGY","CAUSE_NOT_IDENTIFIED","PROBLEM_FRAMING_TIMELINE_PROOF_PASS"]){
 assert.ok(goodFrame.stdout.includes(marker),"Missing actual framing trace "+marker);
}
for(const [before,after,why] of [
 ["supplier_wait = case.supplier_answered - case.documents_ready","supplier_wait = case.supplier_answered - case.opened","wrong supplier stage"],
 ['return ("INCOMPLETE", None)','return ("COMPLETE", (0, 0, 0))',"missing cases treated as zero-success"],
 ["if observed != sorted(observed):","if False:","invalid chronology accepted"],
 ["long_document = sum(m[0] > 30 for m in complete)","long_document = sum(m[2] > 30 for m in complete)","total time passed as document stage"]
]){
 assert.ok(framingPython.includes(before),"Lost meaningful mutation "+why);
 const wrong=python(framingPython.replace(before,after));
 assert.notEqual(wrong.status,0,"False framing inference was accepted: "+why);
 assert.match(wrong.stderr,/AssertionError/,"Framing failed for unrelated reason: "+why+" "+wrong.stderr);
}
console.log("PASS original Problem Framing workflow, source-exact timeline, two added readings and four rejected wrong inferences");


// Original Module 2 Requirements: source-exact teaching evidence, not approval
// or a real security assessment. Five wrong implementations must be caught.
const requirementsSource=fs.readFileSync(root+"professional-engineer-discovery-requirements.ts","utf8");
const requirementsPrefix="export const requirementsReviewGatePython = ";
const requirementsLine=requirementsSource.split("\n").find(line=>line.startsWith(requirementsPrefix));
assert.ok(requirementsLine?.endsWith(";"),"Missing source-published exact requirements gate");
const requirementsPython=JSON.parse(requirementsLine.slice(requirementsPrefix.length,-1));
function requirementsBlocks(name,nextName){
 const anchor="export const "+name+": LessonBlock[] = ";
 const idx=requirementsSource.indexOf(anchor);
 assert.ok(idx>=0,"Missing authentic Requirements source "+name);
 const start=idx+anchor.length;
 const end=nextName?requirementsSource.indexOf("export const "+nextName+":",start):requirementsSource.length;
 assert.ok(end>start,"Invalid Requirements source block boundaries "+name);
 return JSON.parse(requirementsSource.slice(start,end).trim().replace(/;\s*$/,""));
}
const requirementDerivation=requirementsBlocks("requirementsDerivationBlocks","requirementsAcceptanceBlocks");
const requirementAcceptance=requirementsBlocks("requirementsAcceptanceBlocks","requirementsTraceabilityBlocks");
const requirementTrace=requirementsBlocks("requirementsTraceabilityBlocks",null);
for(const [name,blocks] of [["derivation",requirementDerivation],["acceptance",requirementAcceptance],["traceability",requirementTrace]]){
 assert.ok(blocks.filter(x=>x.type==="heading").length>=4,"Requirements "+name+" has too few distinct mechanisms");
 assert.ok(blocks.filter(x=>x.type==="paragraph").length>=8,"Requirements "+name+" remains abstract");
 assert.ok(blocks.filter(x=>x.type==="paragraph").map(x=>x.text).join("\n").length>=4100,
  "Requirements "+name+" lacks worked examples and counterexamples");
 assert.equal(blocks.filter(x=>x.type==="resources").length,1,"No primary reference for Requirements "+name);
}
assert.equal(requirementDerivation.filter(x=>x.type==="code").length,0);
assert.equal(requirementAcceptance.filter(x=>x.type==="code").length,1);
assert.equal(requirementTrace.filter(x=>x.type==="code").length,0);
assert.equal(requirementAcceptance.find(x=>x.type==="code").code,requirementsPython,
 "Actual learner-visible code must match the exact executed Requirements source");
const originalRequirements=fs.readFileSync(root+"professional-engineer-capstone-problem-discovery-deep.ts","utf8");
for(const token of [
 'id === "capstone-problem-discovery-requirements"',
 "...requirementsDerivationBlocks",
 "...requirementReadings",
 "-acceptance-reading",
 "-traceability-reading",
 "Run the exact learner-visible Python requirements-review gate",
 'reading("capstone-problem-discovery-requirements"'
])assert.ok(originalRequirements.includes(token),"Original Requirements reading or practice not integrated: "+token);
const originalPracticeAnchor="id: "+String.fromCharCode(96)+String.fromCharCode(36)+"{id}-practice";
assert.ok(originalRequirements.indexOf("...requirementReadings")<originalRequirements.indexOf(originalPracticeAnchor),
 "Must read Requirements acceptance and traceability before original practice");
const requirementsGood=python(requirementsPython);
assert.equal(requirementsGood.status,0,requirementsGood.stdout+"\n"+requirementsGood.stderr);
for(const marker of ["claim_only: EVIDENCE_UNVERIFIED","no_owner: OWNER_UNCONFIRMED",
 "vague_quality: UNTESTABLE","no_denial_test: UNSAFE_NEGATIVE_PATH",
 "documented: REVIEWABLE_NOT_APPROVED","AUTHORIZATION_ALLOWED_AND_DENIED",
 "REQUIREMENT_REVIEW_NOT_APPROVAL","REQUIREMENTS_EVIDENCE_ORACLE_PASS"]){
 assert.ok(requirementsGood.stdout.includes(marker),"Missing exact Requirements learning trace: "+marker);
}
for(const [before,after,why] of [
 ['if req.origin != "DOCUMENTED" or not req.source_reference:','if False:',"claimed evidence promoted"],
 ["if not req.authority_verified:","if False:","unconfirmed owner ignored"],
 ["if not req.measurable_oracle or not req.test_reference:","if False:","missing measurable oracle ignored"],
 ["if not req.denial_oracle:","if False:","unauthorized negative path ignored"],
 ["return requester == record_owner","return True","cross-owner disclosure permitted"]
]){
 assert.ok(requirementsPython.includes(before),"Mutation target missing "+why);
 const wrong=python(requirementsPython.replace(before,after));
 assert.notEqual(wrong.status,0,"Wrong requirement behavior passed: "+why);
 assert.match(wrong.stderr,/AssertionError/,"Wrong failure reason for "+why+": "+wrong.stderr);
}
console.log("PASS original Requirements derivation, acceptance and traceability, exact Python and five rejected unsafe mutations");


// Original Capstone Problem Discovery Constraints: source evidence, authority,
// feasibility, conflict and reversal remain different questions. Run exact
// learner Python and reject eight unsafe shortcuts. Fictional data only.
const constraintsSource=fs.readFileSync(root+"professional-engineer-discovery-constraints.ts","utf8");
const constraintsPrefix="export const constraintsFeasibilityPython = ";
const constraintsLine=constraintsSource.split("\n").find(x=>x.startsWith(constraintsPrefix));
assert.ok(constraintsLine?.endsWith(";"),"Original Constraints source-published Python missing");
const constraintsPython=JSON.parse(constraintsLine.slice(constraintsPrefix.length,-1));
function constraintsBlocks(name,nextName){
 const anchor="export const "+name+": LessonBlock[] = ";
 const at=constraintsSource.indexOf(anchor);
 assert.ok(at>=0,"Missing teaching blocks "+name);
 const start=at+anchor.length;
 const end=nextName?constraintsSource.indexOf("export const "+nextName+":",start):constraintsSource.length;
 assert.ok(end>start,"Malformed Constraints teaching section "+name);
 return JSON.parse(constraintsSource.slice(start,end).trim().replace(/;\s*$/,""));
}
const constraintInventory=constraintsBlocks("constraintsInventoryBlocks","constraintsFeasibilityBlocks");
const constraintFeasible=constraintsBlocks("constraintsFeasibilityBlocks","constraintsNegotiationBlocks");
const constraintNegotiation=constraintsBlocks("constraintsNegotiationBlocks",null);
for(const [label,blocks,min] of [
 ["source-inventory",constraintInventory,4500],
 ["feasibility",constraintFeasible,3500],
 ["negotiation",constraintNegotiation,4900],
]){
 assert.ok(blocks.filter(x=>x.type==="heading").length>=4,"Too few distinct constraint mechanisms "+label);
 assert.ok(blocks.filter(x=>x.type==="paragraph").length>=8,"Constraint source is thin "+label);
 assert.ok(blocks.filter(x=>x.type==="paragraph").map(x=>x.text).join("\n").length>=min,
 "Missing substantial constraint examples/counterexamples "+label);
 assert.equal(blocks.filter(x=>x.type==="resources").length,1,"Missing targeted reference "+label);
}
assert.equal(constraintInventory.filter(x=>x.type==="code").length,0);
assert.equal(constraintFeasible.filter(x=>x.type==="code").length,1);
assert.equal(constraintNegotiation.filter(x=>x.type==="code").length,0);
assert.equal(constraintFeasible.find(x=>x.type==="code").code,constraintsPython,
 "Learner-published Constraints code differs from source-executed Python");
const originalConstraints=fs.readFileSync(root+"professional-engineer-capstone-problem-discovery-deep.ts","utf8");
for(const phrase of [
 'id === "capstone-problem-discovery-constraints"',
 "...constraintsInventoryBlocks",
 "...constraintReadings",
 "-feasibility-reading",
 "-conflict-revision-reading",
 "Run the exact published Python 3 constraints-classification and feasibility fixture",
 "in separate copies break eight distinct evidence or feasibility gates",
 'reading("capstone-problem-discovery-constraints"'
]){
 assert.ok(originalConstraints.includes(phrase),"Original Constraints reading/practical not linked: "+phrase);
}
const originalPracticeMarker="id: "+String.fromCharCode(96)+String.fromCharCode(36)+"{id}-practice";
assert.ok(originalConstraints.indexOf("...constraintReadings")<originalConstraints.indexOf(originalPracticeMarker),
 "Constraints source mechanism readings must precede original practical");
const constraintsGood=python(constraintsPython);
assert.equal(constraintsGood.status,0,constraintsGood.stdout+"\n"+constraintsGood.stderr);
for(const marker of [
 "rumored_regulation: UNVERIFIED_SOURCE",
 "unknown_owner: AUTHORITY_UNCONFIRMED",
 "other_service: NOT_APPLICABLE",
 "preferred_database: NEGOTIABLE_PREFERENCE",
 "verified_contract: BINDING_FOR_THIS_SCENARIO",
 "cloud_copy: BLOCKED_DATA_EXPORT",
 "over_budget: BLOCKED_BUDGET",
 "operator_heavy: BLOCKED_OPERATOR_CAPACITY",
 "wrong_protocol: BLOCKED_CONTRACT_PROTOCOL",
 "bounded_local: FEASIBLE_NOT_APPROVED",
 "FEASIBLE_IS_NOT_DEPLOYMENT_APPROVAL",
 "CONSTRAINT_SOURCE_AND_FEASIBILITY_PASS"
]){
 assert.ok(constraintsGood.stdout.includes(marker),"Missing actual learner constraint result "+marker);
}
for(const [before,after,why] of [
 ["if not item.source_verified:","if False:","rumored regulation falsely mandatory"],
 ["if not item.authority_confirmed:","if False:","unknown decision owner trusted"],
 ["if not item.applies_to_scope:","if False:","other service's rule applied here"],
 ["if not item.binding:","if False:","negotiable preference promoted"],
 ["if option.exports_private_data:","if False:","data export boundary bypassed"],
 ["if option.monthly_cost > 250:","if False:","budget exceeded"],
 ["if option.operator_hours > 6:","if False:","staffing assumption exceeded"],
 ["if not option.supports_contract_protocol:","if False:","protocol incompatibility ignored"]
]){
 assert.ok(constraintsPython.includes(before),"Missing wrong implementation target: "+why);
 const wrong=python(constraintsPython.replace(before,after));
 assert.notEqual(wrong.status,0,"False feasibility green was accepted: "+why);
 assert.match(wrong.stderr,/AssertionError/,"Wrong mutant failure "+why+": "+wrong.stderr);
}
console.log("PASS original Constraints inventory, source-exact Python, two additional readings and eight rejected false-green mutants");


// Original Module 2 Working with Ambiguity: distinguish evidence types,
// sensitivity and consent-aware experiment design before the historic practice.
// Hypothetical probabilities/payoffs are a model demonstration, not field data.
const ambiguityFile=fs.readFileSync(root+"professional-engineer-discovery-ambiguity.ts","utf8");
const ambiguityPrefix="export const ambiguityDecisionPython = ";
const ambiguityLine=ambiguityFile.split("\n").find(x=>x.startsWith(ambiguityPrefix));
assert.ok(ambiguityLine?.endsWith(";"),"Missing learner-visible ambiguity decision Python");
const ambiguityPython=JSON.parse(ambiguityLine.slice(ambiguityPrefix.length,-1));
function ambiguityBlocks(name,nextName){
 const anchor="export const "+name+": LessonBlock[] = ";
 const at=ambiguityFile.indexOf(anchor);
 assert.ok(at>=0,"No subject-specific ambiguity blocks "+name);
 const start=at+anchor.length;
 const end=nextName?ambiguityFile.indexOf("export const "+nextName+":",start):ambiguityFile.length;
 assert.ok(end>start,"Malformed ambiguity blocks "+name);
 return JSON.parse(ambiguityFile.slice(start,end).trim().replace(/;\s*$/,""));
}
const ambiguityInventory=ambiguityBlocks("ambiguityInventoryBlocks","ambiguitySensitivityBlocks");
const ambiguitySensitivity=ambiguityBlocks("ambiguitySensitivityBlocks","ambiguityExperimentBlocks");
const ambiguityExperiment=ambiguityBlocks("ambiguityExperimentBlocks",null);
for(const [name,blocks,minimum] of [
 ["evidence-classification",ambiguityInventory,4600],
 ["information-value",ambiguitySensitivity,4300],
 ["experiment-and-reversal",ambiguityExperiment,5200]
]){
 assert.ok(blocks.filter(x=>x.type==="heading").length>=4,"Ambiguity "+name+" lacks separate mechanisms");
 assert.ok(blocks.filter(x=>x.type==="paragraph").length>=8,"Ambiguity "+name+" thin original reading");
 assert.ok(blocks.filter(x=>x.type==="paragraph").map(x=>x.text).join("\n").length>=minimum,
  "Insufficient ambiguity worked examples and counterexamples: "+name);
 assert.equal(blocks.filter(x=>x.type==="resources").length,1,"No source resource in ambiguity "+name);
}
assert.equal(ambiguityInventory.filter(x=>x.type==="code").length,0);
assert.equal(ambiguitySensitivity.filter(x=>x.type==="code").length,1);
assert.equal(ambiguityExperiment.filter(x=>x.type==="code").length,0);
assert.equal(ambiguitySensitivity.find(x=>x.type==="code").code,ambiguityPython,
 "Executed ambiguity proof must be exactly the learner-visible Python");
const ambiguityOriginal=fs.readFileSync(root+"professional-engineer-capstone-problem-discovery-deep.ts","utf8");
for(const token of [
 'id === "capstone-problem-discovery-working-with-ambiguity"',
 "...ambiguityInventoryBlocks","...ambiguityReadings","-sensitivity-reading","-experiment-design-reading",
 "Run the exact learner-visible Python sensitivity and perfect-information-ceiling example",
 "reject eight incorrect implementations",
 'reading("capstone-problem-discovery-working-with-ambiguity"'
]) assert.ok(ambiguityOriginal.includes(token),"Missing original ambiguity reading/practice integration: "+token);
const practicalSourceAnchor="id: "+String.fromCharCode(96)+String.fromCharCode(36)+"{id}-practice";
assert.ok(ambiguityOriginal.indexOf("...ambiguityReadings")<ambiguityOriginal.indexOf(practicalSourceAnchor),
 "Independent mechanisms must appear before original ambiguity practice");
const ambiguityGood=python(ambiguityPython);
assert.equal(ambiguityGood.status,0,ambiguityGood.stdout+"\n"+ambiguityGood.stderr);
for(const marker of [
 "BASE synthetic_p=0.60 fix_intake=38 supplier_automation=36",
 "SENSITIVITY p=0.70 leader=automate_supplier; DECISION_UNSTABLE",
 "PERFECT_INFORMATION_CEILING=48, not expected study benefit",
 "UNKNOWN_PROBABILITY_NOT_CALIBRATED",
 "UNAUTHORIZED_OR_UNSAFE_STUDY_BLOCKED",
 "AMBIGUITY_REVERSIBLE_DECISION_PROOF_PASS"
]) assert.ok(ambiguityGood.stdout.includes(marker),"Missing learner ambiguity proof "+marker);
for(const [before,after,why] of [
 ["return p * supplier + (1 - p) * documents",
  "return (1 - p) * supplier + p * documents","wrong state probability"],
 ['"automate_supplier": (100, -60)','"automate_supplier": (100, 60)',"automation downside hidden"],
 ['return max(PAYOFFS, key=lambda name: expected(name, p))',
  'return "automate_supplier"',"false fixed best action"],
 ["return len({best(p) for p in probabilities}) == 1","return True","false stable recommendation"],
 ["supplier_best = max(pair[0] for pair in PAYOFFS.values())",
  "supplier_best = min(pair[0] for pair in PAYOFFS.values())","invalid perfect information ceiling"],
 ["if not authorized:","if False:","unauthorized research accepted"],
 ["if not safe:","if False:","unsafe experiment accepted"],
 ["if study_cost >= upper_bound:","if False:","research above information ceiling accepted"]
]){
 assert.ok(ambiguityPython.includes(before),"Missing source-derived mutation "+why);
 const wrong=python(ambiguityPython.replace(before,after));
 assert.notEqual(wrong.status,0,"Incorrect ambiguity behavior passed: "+why);
 assert.match(wrong.stderr,/AssertionError/,"Ambiguity mutant failed for unrelated reason "+why+": "+wrong.stderr);
}
console.log("PASS original Working with Ambiguity, exact Python sensitivity/EVPI, two focused readings, eight rejected false-certainty mutants");


// Original Problem Discovery Quality Attributes: authored scenario mechanics,
// exact evidence source, and trade-off analysis precede the retained practice.
// All numeric examples are explicitly fictional, not production SLO claims.
const qualityFile=fs.readFileSync(root+"professional-engineer-discovery-quality-attributes.ts","utf8");
const qualityPrefix="export const qualityEvidencePython = ";
const qualityLine=qualityFile.split("\n").find(x=>x.startsWith(qualityPrefix));
assert.ok(qualityLine?.endsWith(";"),"Missing source-published quality attribute Python");
const qualityPython=JSON.parse(qualityLine.slice(qualityPrefix.length,-1));
function qualitySection(name,nextName){
 const anchor="export const "+name+": LessonBlock[] = ";
 const at=qualityFile.indexOf(anchor);
 assert.ok(at>=0,"Missing authored original quality section "+name);
 const start=at+anchor.length;
 const end=nextName?qualityFile.indexOf("export const "+nextName+":",start):qualityFile.length;
 assert.ok(end>start,"Invalid authored quality source boundaries "+name);
 return JSON.parse(qualityFile.slice(start,end).trim().replace(/;\s*$/,""));
}
const qaScenario=qualitySection("qualityScenarioBlocks","qualityMeasurementBlocks");
const qaMeasured=qualitySection("qualityMeasurementBlocks","qualityTradeoffBlocks");
const qaTradeoff=qualitySection("qualityTradeoffBlocks",null);
for(const [label,blocks,min] of [
 ["scenario",qaScenario,4700],
 ["measurement",qaMeasured,4300],
 ["tradeoffs",qaTradeoff,5400]
]){
 assert.ok(blocks.filter(x=>x.type==="heading").length>=4,"Missing independently explained quality mechanisms "+label);
 assert.ok(blocks.filter(x=>x.type==="paragraph").length>=8,"Original quality "+label+" remains thin");
 assert.ok(blocks.filter(x=>x.type==="paragraph").map(x=>x.text).join("\n").length>=min,
  "Original quality content needs explicit examples, failures and alternatives: "+label);
 assert.ok(blocks.filter(x=>x.type==="resources").length===1,"Missing authoritative quality references "+label);
}
assert.equal(qaScenario.filter(x=>x.type==="code").length,0);
assert.equal(qaMeasured.filter(x=>x.type==="code").length,1);
assert.equal(qaTradeoff.filter(x=>x.type==="code").length,0);
assert.equal(qaMeasured.find(x=>x.type==="code").code,qualityPython,
 "The actually rendered quality attribute code differs from what CI executes");
const originalQuality=fs.readFileSync(root+"professional-engineer-capstone-problem-discovery-deep.ts","utf8");
for(const token of [
 'id === "capstone-problem-discovery-quality-attributes"',
 "...qualityScenarioBlocks","...qualityReadings","-measurement-reading","-tradeoffs-reading",
 "Run the exact learner-visible Python quality evidence fixture",
 "reject EIGHT misleading shortcuts",
 'reading("capstone-problem-discovery-quality-attributes"'
]) assert.ok(originalQuality.includes(token),"Missing quality original reading/practice wiring: "+token);
const originalPracticeStart="id: "+String.fromCharCode(96)+String.fromCharCode(36)+"{id}-practice";
assert.ok(originalQuality.indexOf("...qualityReadings")<originalQuality.indexOf(originalPracticeStart),
 "Quality teaching steps must precede the original practice");
const goodQuality=python(qualityPython);
assert.equal(goodQuality.status,0,goodQuality.stdout+"\n"+goodQuality.stderr);
for(const phrase of [
 "LATENCY eligible=20 p95_ms=250 maximum_ms=780 threshold_ms=300",
 "REJECTED incomplete, unauthorized, unverified_restore, rto, rpo, small_cohort, tail_breach",
 "RECOVERY fictional_RTO_minutes=30 fictional_RPO_minutes=8",
 "REVIEWABLE_NOT_APPROVED; NO_EMPIRICAL_SLO_OR_SECURITY_ASSURANCE",
 "QUALITY_ATTRIBUTE_EVIDENCE_GATE_PASS"
]) assert.ok(goodQuality.stdout.includes(phrase),"Missing exact published quality result "+phrase);
for(const [before,after,why] of [
 ["ceil(len(samples) * 95 / 100) - 1","ceil(len(samples) * 50 / 100) - 1","median falsely presented as p95"],
 ["if len(samples) < 20:","if False:","unrepresentative sample accepted"],
 ["if any(not r.complete for r in records):","if False:","incomplete outcome hidden"],
 ["if any(not a.authorized and (a.exposed_record or a.changed_record) for a in access):","if False:","unauthorized disclosure or mutation ignored"],
 ["if not restore.data_verified or restore.restored_minute is None:","if False:","restore integrity not verified"],
 ["if rto > 45:","if False:","recovery time miss ignored"],
 ["if rpo > 15:","if False:","data-loss window miss ignored"],
 ["if latency > 300:","if False:","tail latency violation ignored"]
]){
 assert.ok(qualityPython.includes(before),"No genuine source mutation target "+why);
 const wrong=python(qualityPython.replace(before,after));
 assert.notEqual(wrong.status,0,"Incorrect quality inference passed: "+why);
 assert.match(wrong.stderr,/AssertionError/,"Quality mutant failed for unrelated reason "+why+": "+wrong.stderr);
}
console.log("PASS original Quality Attributes scenario teaching, exact p95/privacy/recovery Python, two focused readings and eight rejected unsafe mutants");
