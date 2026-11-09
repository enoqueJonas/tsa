import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const root="packages/runtime-kernel/src/paths/";
const base=readFileSync(root+"cloud-infrastructure-as-code-deep.ts","utf8");
const quality=readFileSync(root+"cloud-infrastructure-as-code-quality.ts","utf8");
const depth=readFileSync(root+"cloud-iac-mechanism-depth.ts","utf8");
const published=readFileSync(root+"cloud-iac-real-cli-proof.ts","utf8");
const m=published.match(/export const cloudIacRealCliPython = ("(?:\\.|[^"\\])*");/);
assert.ok(m,"Published exact OpenTofu Python program missing");
const code=JSON.parse(m[1]);

function readObject(source,name,next){
 const start=source.indexOf("export const "+name);
 const end=next?source.indexOf("\nexport const "+next,start):source.length;
 assert.ok(start>=0 && end>start,"Missing "+name);
 return JSON.parse(source.slice(source.indexOf("=",start)+1,end).trim().replace(/;$/,""));
}
const sections=readObject(depth,"cloudIacMechanismSections","cloudIacEvidencePractices");
const practices=readObject(depth,"cloudIacEvidencePractices");
const originalTopics=[
 "why-infrastructure-as-code","declarative-infrastructure",
 "terraform-opentofu-fundamentals","providers-resources","state",
 "state-locking-concurrency","import-adoption-refactoring",
 "replacement-partial-apply-recovery","variables-outputs","dependencies",
 "modules","plan-apply-lifecycle","drift","remote-state",
 "secrets-sensitive-values","destroy-resource-lifecycle"];
const specs=base.split("const specs: LessonSpec[] = [")[1]?.split("\n];")[0];
assert.ok(specs,"Canonical IaC specs lost");
const ids=[...specs.matchAll(/^\s*\{\s*id: "([^"]+)"/gm)].map(x=>x[1]);
assert.deepEqual(ids,originalTopics,"Original 16 IaC lesson IDs or order changed");
for(const i of ["001","002","003","004","005","006"])
 assert.ok(base.includes('id: "infrastructure-as-code-define-steward-infrastructure-'+i+'"'),
  "Original IaC milestone activity lost");
assert.deepEqual(Object.keys(sections),Object.keys(practices));
assert.equal(Object.keys(sections).length,7,"Seven original focused IaC topics missing");
for(const [topic,items] of Object.entries(sections)){
 assert.ok(originalTopics.includes(topic),"Added noncanonical topic "+topic);
 assert.ok(items.length>=2,"Concept too broad "+topic);
 for(const item of items){
   assert.ok(item.heading.length>=26);
   assert.ok(item.paragraphs.length===2&&item.paragraphs.every(p=>p.length>=270),
     "No concept mechanism and real failure boundary "+topic);
 }
 assert.ok(practices[topic].length>=2);
}
assert.ok(base.includes("cloudIacMechanismSections[spec.id]"));
assert.ok(base.includes("code: cloudIacRealCliPython"),"Actual OpenTofu source not displayed");
assert.ok(quality.includes("cloudIacEvidencePractices[lesson.id.slice("));
assert.ok(code.includes("terraform_data") && code.includes("TemporaryDirectory"));
assert.ok(code.includes("terraform.tfstate") && code.includes("plan", "-input=false"));
console.log("PASS 16 original IaC topics, original milestone 6 IDs, 7 real-evidence overlays, learner source and practice wiring");

function run(program,label,positive){
 const x=spawnSync("python3",["-c",program],{
    encoding:"utf8",timeout:220000,maxBuffer:3*1024*1024,
    env:{...process.env,TF_IN_AUTOMATION:"1"}
 });
 assert.ok(!x.error,label+": "+String(x.error));
 if(positive){
  assert.equal(x.status,0,label+"\nstdout:\n"+x.stdout+"\nstderr:\n"+x.stderr);
  for(const marker of [
   "IAC_REAL_PROVIDERLESS_SAVED_PLAN_APPLIED",
   "IAC_REAL_PLAN_CONVERGES_NO_CHANGES",
   "IAC_REAL_REPLACEMENT_PLAN_REJECTED_BEFORE_APPLY",
   "IAC_REAL_STALE_SAVED_PLAN_REJECTED",
   "IAC_REAL_MISSING_STATE_PROPOSES_DUPLICATE_CREATE",
   "IAC_REAL_STATE_RESTORED_BEFORE_ANY_APPLY",
   "IAC_REAL_DISPOSABLE_STATE_DESTROYED",
   "IAC_NOT_A_CLOUD_PROVIDER_REMOTE_STATE_LOCK_OR_REAL_DRIFT_TEST",
  ])assert.ok(x.stdout.includes(marker),"Missing actual CLI verification marker "+marker);
 }else{
  assert.notEqual(x.status,0,label+" unsafe implementation passed");
  assert.match(x.stderr,/AssertionError/,label+" unrelated test failure:\n"+x.stderr);
 }
 console.log("PASS "+label+" status="+x.status);
}
run(code,"actual providerless OpenTofu saved plan, unsafe replacement denial, stale plan and state-loss recovery",true);

const mutants=[
 ["delete+create replacement silently approved",
 'return actions in (["no-op"], ["update"])','return True'],
 ["applied destructive replacement instead of exact approved plan",
 'tofu(root, "apply", "-input=false", "approved.tfplan")',
 'tofu(root, "apply", "-input=false", "replace.tfplan")'],
 ["stale plan incorrectly treated as successful",
 'assert stale.returncode == 1','assert stale.returncode == 0'],
 ["state recovery skipped after deliberate loss",
 'shutil.move(hidden_file, state_file)',
 'pass # unsafe: never restored local state'],
];
for(const [label,find,replace] of mutants){
 assert.ok(code.includes(find),"Source changed and negative mutation no longer applies "+label);
 run(code.replace(find,replace),"rejected unsafe IaC mutant: "+label,false);
}
console.log("PASS four unsafe real OpenTofu plan/approval/stale/state mutations; NOT a real cloud/remote backend test");
