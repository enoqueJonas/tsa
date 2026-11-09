import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const root="packages/runtime-kernel/src/paths/";
const original=readFileSync(root+"cloud-building-blocks-deep.ts","utf8");
const quality=readFileSync(root+"cloud-building-blocks-quality.ts","utf8");
const source=readFileSync(root+"cloud-building-trust-proof.ts","utf8");
const depth=readFileSync(root+"cloud-building-access-depth.ts","utf8");
function extract(name) {
 const m=source.match(new RegExp("export const "+name+" = (\"(?:\\\\.|[^\"\\\\])*\");"));
 assert.ok(m,"Learner-published source missing "+name);
 return JSON.parse(m[1]);
}
function object(str,name,next) {
 const a=str.indexOf("export const "+name);
 const z=next?str.indexOf("\nexport const "+next,a):str.length;
 assert.ok(a>=0&&z>a,"Missing concept sections "+name);
 return JSON.parse(str.slice(str.indexOf("=",a)+1,z).trim().replace(/;$/,""));
}
const sections=object(depth,"cloudBuildingAccessSections","cloudBuildingAccessPractices");
const practices=object(depth,"cloudBuildingAccessPractices");
assert.deepEqual(Object.keys(sections),["iam","secrets-management"]);
assert.deepEqual(Object.keys(practices),["iam","secrets-management"]);
const originalIds=[...original.split("const specs: LessonSpec[] = [")[1].split("\n];")[0].matchAll(/^\s*\{\s*id: "([^"]+)"/gm)].map(x=>x[1]);
assert.equal(originalIds.length,12,"Cloud Building Blocks original 12 topics must remain");
assert.equal(new Set(originalIds).size,12);
assert.ok(originalIds.includes("iam")&&originalIds.includes("secrets-management"));
assert.ok(original.includes("cloud-building-blocks-map-steward-001"));
assert.ok(original.includes("cloud-building-blocks-map-steward-004"));
for(const [k,v] of Object.entries(sections)) {
 assert.ok(v.length>=3,"Keep distinct identity and recovery mechanisms "+k);
 assert.ok(v.every(x=>x.paragraphs.length>=2&&x.paragraphs.every(t=>t.length>=280)));
 assert.ok(practices[k].length>=2);
}
assert.ok(original.includes("...(cloudBuildingAccessSections[spec.id] ?? [])"));
assert.ok(original.includes("code: cloudIamPolicyPython"));
assert.ok(original.includes("code: cloudSecretRotationPython"));
assert.ok(quality.includes("cloudBuildingAccessPractices[lesson.id.slice("));
console.log("PASS original 12 Building Blocks lesson IDs and lab, 6 access sections with original applied practice wiring");

function run(py,label,positive,markers=[]){
 const x=spawnSync("python3",["-c",py],{encoding:"utf8",timeout:18000,maxBuffer:2*1024*1024});
 assert.ok(!x.error,label+" execution failed "+String(x.error));
 if(positive){
  assert.equal(x.status,0,label+"\n"+x.stdout+"\n"+x.stderr);
  for(const m of markers)assert.ok(x.stdout.includes(m),label+" missing "+m);
 }else{
  assert.notEqual(x.status,0,label+" unsafe source passed");
  assert.match(x.stderr,/AssertionError/,label+" unrelated error: "+x.stderr);
 }
 console.log("PASS "+label+" status="+x.status);
}
const iam=extract("cloudIamPolicyPython");
run(iam,"actual local scoped/explicit-deny/default-deny policy evaluator",true,[
 "IAM_PREFIX_BOUNDARY_STOPS_SIMILAR_NAME_ESCAPE",
 "IAM_EXPLICIT_DENY_OVERRIDES_BROAD_ALLOW",
 "IAM_SCOPED_ALLOW_AND_DEFAULT_DENY",
 "IAM_POLICY_IS_SYNTHETIC_NOT_REAL_CLOUD_IDENTITY"
]);
const wrongIam=[
 ["delete override ignored", 'if any(rule.effect == "deny" for rule in matching):', 'if False:'],
 ["backup prefix improperly widened", 'Rule("allow", "backup-writer", "object:put", "backups/steward/")','Rule("allow", "backup-writer", "object:put", "backups/")'],
 ["unknown principal default-allowed", 'return any(rule.effect == "allow" for rule in matching)', 'return True']
];
for(const [label,needle,change] of wrongIam){
 assert.ok(iam.includes(needle),label+" mutation anchor absent");
 run(iam.replace(needle,change),"rejected IAM mutant: "+label,false);
}
const rot=extract("cloudSecretRotationPython");
run(rot,"actual Python generation overlap, premature revoke and final revocation",true,[
 "ROTATION_OLD_CLIENTS_START_HEALTHY",
 "ROTATION_OVERLAP_PRESERVES_OLD_AND_NEW_CLIENTS",
 "ROTATION_PREMATURE_REVOKE_PROVES_CLIENT_OUTAGE",
 "ROTATION_OLD_REVOKED_AFTER_ALL_CLIENTS_MIGRATE",
 "ROTATION_NO_REAL_PASSWORD_OR_SECRET_STORE_TEST"
]);
const wrongRot=[
 ["old credential never revoked",'valid_generations.remove("generation-1")','pass  # unsafe retained old'],
 ["premature revoke before clients migrate",'valid_generations.add("generation-2")','valid_generations = {"generation-2"}'],
 ["outbox publisher never migrates",'clients["outbox-publisher"] = "generation-2"','pass  # old worker still active']
];
for(const [label,needle,change] of wrongRot){
 assert.ok(rot.includes(needle),label+" mutation anchor absent");
 run(rot.replace(needle,change),"rejected secret rotation mutant: "+label,false);
}
console.log("PASS 6 unsafe IAM/secret-rotation mutations; real provider IAM, real database credentials and Vault NOT_TESTED");
