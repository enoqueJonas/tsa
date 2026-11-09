import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

const root="packages/runtime-kernel/src/paths/";
const milestone=readFileSync(root+"cloud-engineer-milestone-deep.ts","utf8");
const depth=readFileSync(root+"cloud-milestone-evidence-depth.ts","utf8");
const audit=readFileSync(root+"cloud-milestone-evidence-audit.ts","utf8");
const ui=readFileSync("apps/web/components/learning-experience.tsx","utf8");
const panel=readFileSync("apps/web/components/activity-evidence-panel.tsx","utf8");
const gateUi=readFileSync("apps/web/lib/cloud-milestone-evidence-gate.ts","utf8");
const mat=depth.match(/export const cloudMilestoneGateAugmentations:Record<string,CloudMilestoneGateAugmentation> = (\{[\s\S]*\});/);
assert.ok(mat,"Missing exact published gate rubric JSON");
const matrix=JSON.parse(mat[1]);
const source=audit.match(/export const cloudMilestoneEvidenceAuditPython = ("(?:\\.|[^"\\])*");/);
assert.ok(source,"Missing exact learner-copyable offline audit script");
const python=JSON.parse(source[1]);

const expected=[
 "gate-1-hosting-architecture","gate-2-iac-provisioning",
 "gate-3-network-identity","gate-4-release-verification",
 "gate-5-recovery-failure","gate-6-cost-operability",
 "gate-progressive-delivery","gate-7-handoff",
];
const found=[...milestone.matchAll(/const (?:gate\d+|gateCanary) = practicalLesson\(\s*"([^"]+)"/g)]
 .map(m=>m[1]);
assert.deepEqual(found,expected,"Original Cloud final milestone gate IDs/order changed");
assert.deepEqual(Object.keys(matrix),expected);
assert.ok(milestone.includes('id: "steward-internet-environment-brief-001"'));
assert.ok(milestone.includes('id: "steward-internet-environment-review-001"'));
assert.ok(milestone.includes('cloudMilestoneGateAugmentations[id]'));
assert.ok(milestone.includes("code: cloudMilestoneEvidenceAuditPython"));
for(const id of expected){
 const data=matrix[id];
 assert.ok(data.instructions.length>=3 && data.deliverables.length>=2 &&
  data.criteria.length>=2,"Incomplete milestone gate rubric "+id);
 assert.ok(data.instructions.every(x=>x.length>=100) &&
  data.criteria.every(x=>x.length>=90),"Missing required observation/limit "+id);
}
assert.ok(ui.includes('activePath.id === "steward-internet-environment"') &&
 ui.includes('needsCloudMilestoneEvidence && !milestoneEvidenceAccepted') &&
 ui.includes('requireAcceptedEvidence={needsCloudMilestoneEvidence}') &&
 ui.includes('if (activePath.id === "steward-internet-environment"'));
assert.ok(panel.includes("hasSavedCloudMilestoneEvidence(record)") &&
 panel.includes("onMilestoneAcceptanceChange?.(activityId, false)") &&
 panel.includes("await putActivityEvidence(record)"));
assert.ok(gateUi.includes('record.submissionStatus !== "accepted"') &&
 gateUi.includes('record.notes.trim().length < 120') &&
 gateUi.includes('record.outcome.trim().length < 100') &&
 gateUi.includes('link.protocol === "https:"'));
const gateFn=await import("../apps/web/lib/cloud-milestone-evidence-gate.ts");
const good={notes:"Observed workload, controller, client and stage results. ".repeat(4),
 outcome:"Reviewer must check the actual URL and environment. ".repeat(4),
 links:["https://github.com/enoqueJonas/tsa/issues/407"],submissionStatus:"accepted"};
assert.equal(gateFn.hasSavedCloudMilestoneEvidence(good),true);
for(const bad of [
 {...good,notes:"too short"},
 {...good,outcome:"too short"},
 {...good,links:["http://localhost:4173/"]},
 {...good,links:["https://example.invalid/mock"]},
 {...good,submissionStatus:"ready"},
 undefined,
]) assert.equal(gateFn.hasSavedCloudMilestoneEvidence(bad),false);
console.log("PASS 8 original Cloud milestone gate IDs, 24 detailed operational checks, unchanged brief/review IDs and targeted nonempty client evidence guard");

function execute(arguments_,label){
 const x=spawnSync("python3",["-c",python,...arguments_],{
  encoding:"utf8",timeout:16000,maxBuffer:3*1024*1024});
 assert.ok(!x.error,label+" execution error: "+x.error);
 return x;
}
const folder=mkdtempSync(join(tmpdir(),"tsa-cloud-exit-audit-"));
try{
 const templ=execute(["--template"],"unverified template");
 assert.equal(templ.status,0,templ.stderr);
 const template=JSON.parse(templ.stdout);
 assert.equal(template.environment,"UNVERIFIED");
 assert.deepEqual(Object.keys(template.gates),expected);
 assert.ok(Object.values(template.gates).flatMap(x=>Object.values(x)).every(
  value=>value.status==="not-tested"),"Template is misleadingly preaccepted");
 const filename=join(folder,"evidence.json");
 function verify(document,label,expectedStatus,expectedPattern){
  writeFileSync(filename,JSON.stringify(document));
  const x=execute(["--check",filename],label);
  assert.equal(x.status,expectedStatus,label+"\n"+x.stdout+"\n"+x.stderr);
  if(expectedPattern)assert.match(x.stdout+x.stderr,expectedPattern,label);
  console.log("PASS "+label+" metadata-only status="+x.status);
 }
 verify(template,"blank unverified template never passes",1,/CLOUD_EXIT_METADATA_INCOMPLETE_NOT_ACCEPTED/);
 const env="steward-training-remote-contract";
 const sourceSha="1".repeat(40);
 const digest="sha256:"+"a".repeat(64);
 const valid={
  schema:"tsa-cloud-exit-evidence-v1",environment:env,operator:"Operator Training",
  reviewer:"Independent Training Reviewer",source_revision:sourceSha,
  environment_git_revision:"2".repeat(40),approved_release_digest:digest,
  gates:{}
 };
 for(const [gate,records] of Object.entries(template.gates)){
  valid.gates[gate]={};
  for(const check of Object.keys(records)){
   const mode=gate==="gate-1-hosting-architecture"||
       gate==="gate-7-handoff"?"design-review":
       gate==="gate-6-cost-operability"?"dated-provider-quote":"live-platform";
   valid.gates[gate][check]={
    status:"observed",mode,environment:env,
    observed_at:"2026-11-09T12:00:00+02:00",
    evidence_url:"https://github.com/enoqueJonas/tsa/issues/407#synthetic-CI-metadata-only-fixture",
    explanation:"SYNTHETIC VALIDATION FIXTURE: no real provider, service or platform was contacted. This only exercises shape and forbidden status checks.",
    ...(gate==="gate-4-release-verification"&&
      ["gitlab-nexus-image-digest","three-role-running-digests"].includes(check)?
      {observed_digest:digest}:{})
   };
  }
 }
 verify(valid,"synthetic fixture checks schema ONLY, prints PENDING EXTERNAL REVIEW",0,
  /CLOUD_EXIT_METADATA_COMPLETE_PENDING_INDEPENDENT_EXTERNAL_REVIEW/);
 function mutate(label,fn,expected){
  const cloned=structuredClone(valid);
  fn(cloned);
  verify(cloned,"reject "+label,1,expected);
 }
 mutate("missing operational gate",x=>delete x.gates["gate-5-recovery-failure"],
  /Canonical gate IDs changed/);
 mutate("missing exact required observation",
  x=>delete x.gates["gate-4-release-verification"]["outbox-rabbitmq-consumer"],
  /missing or unexpected required checks/);
 mutate("untested outcome counted as complete",
  x=>x.gates["gate-2-iac-provisioning"]["provider-apply"].status="not-tested",
  /NOT_OBSERVED/);
 mutate("mock container offered as live Kubernetes/GitOps",
  x=>x.gates["gate-4-release-verification"]["argocd-environment-sync"].mode="local-synthetic",
  /requires REAL external\/provider\/platform source/);
 mutate("placeholder URL",
  x=>x.gates["gate-3-network-identity"]["public-https-and-tls"].evidence_url="https://example.invalid/ci",
  /non-placeholder HTTPS host/);
 mutate("self-review labeled independent",
  x=>x.reviewer=x.operator,/Independent named reviewer/);
 mutate("data from a different environment",
  x=>x.gates["gate-5-recovery-failure"]["injected-fault-and-detection"].environment="steward-something-else",
  /different\/unverified environment/);
 mutate("running artifact does not match approved digest",
  x=>x.gates["gate-4-release-verification"]["three-role-running-digests"].observed_digest=
    "sha256:"+"f".repeat(64),/digest differs from approved artifact/);
 mutate("missing immutable release digest",
  x=>x.approved_release_digest="latest",/Approved immutable image sha256 digest/);
 mutate("unexplained evidence result",
  x=>x.gates["gate-progressive-delivery"]["bad-candidate-auto-abort"].explanation="passed",
  /meaningful observed-result\/limits explanation/);
}finally{
 rmSync(folder,{recursive:true,force:true});
}
console.log("PASS final milestone metadata evidence audit: unverified default, ten negative cases; no claims of live Cloud platform or independent learner competence");
