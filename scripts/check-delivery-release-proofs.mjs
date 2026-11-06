import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

/** Tests the EXACT seven examples published in six ORIGINAL Release
 * Engineering readings. No substitute implementation and no production
 * registry, approval, deployment, database or learner claim.
 */
const source=readFileSync("packages/runtime-kernel/src/paths/delivery-release-proofs.ts","utf8");
const match=source.match(/export const releaseProofs:Record<string,ReleaseProof> = (\{[\s\S]*\});\s*$/);
assert.ok(match,"Missing authored original Release Engineering proof source table");
const proofs=JSON.parse(match[1]);
const originalIds=[
 "release-candidates","promotion-and-gates","deployment-evidence",
 "release-observability","release-failure-handling","release-runbooks"
];
assert.deepEqual(Object.keys(proofs),[...originalIds,"release-candidates-docker"]);
const lessons=readFileSync("packages/runtime-kernel/src/paths/delivery-release-engineering-deep.ts","utf8");
assert.ok(lessons.includes("const executable=releaseProofs[id]"),"Original reading missing exact source example injection");
assert.ok(lessons.includes('releaseProofs["release-candidates-docker"]'),"Original candidates reading lacks real tag proof");
const observed=[...lessons.matchAll(/^\s*reading\("([^"]+)",\s*"([^"]+)"/gm)].map(m=>m[1]);
assert.deepEqual(observed,originalIds,"Original six Release Engineering lesson IDs/order changed");
const mechanisms=readFileSync("packages/runtime-kernel/src/paths/delivery-release-learner-mechanisms.ts","utf8");
const json=mechanisms.match(/export const releaseLearnerMechanisms:Record<[^=]+ = (\{[\s\S]*\});\s*$/);
assert.ok(json,"Missing original-topic authored teaching source");
const lenses=JSON.parse(json[1]);
assert.deepEqual(Object.keys(lenses),originalIds);
for (const id of originalIds) {
 const sections=lenses[id].sections;
 assert.ok(sections.length>=3,"Insufficient real mechanism, alternative and failing case: "+id);
 const prose=sections.flatMap(s=>s.paragraphs);
 assert.ok(prose.join("\n").length>=1700,"Original reading source remains too shallow "+id);
 assert.ok(sections.every(s=>s.heading && s.paragraphs.length>=2 &&
   s.paragraphs.every(p=>p.length>=180)),"Missing independently explained failure and transfer: "+id);
 assert.match(lenses[id].resource.url,/^https:\/\//,"No topic-specific primary reference: "+id);
}
console.log("PASS all six original Release Engineering readings, 18 separate mechanism/failed-state sections, source continuity");

const finalLabSource=readFileSync("packages/runtime-kernel/src/paths/delivery-release-engineering-lab-deep.ts","utf8");
const finalReviewSource=readFileSync("packages/runtime-kernel/src/paths/delivery-release-engineering-review-deep.ts","utf8");
for(let i=1;i<=4;i++){
 assert.ok(finalLabSource.includes('id: "release-engineering-steward-release-lab-00'+i+'"'),
   "Lost original final release lab "+i);
}
assert.ok(finalLabSource.includes("minimumCharacters: 250"),
  "Original lab reflection must require a substantive genuine learner answer");
assert.ok(finalReviewSource.includes('id: "release-engineering-module-review-001"'),
  "Original Release Engineering final review source is missing");
assert.ok(finalReviewSource.includes("minimumCharacters: 300"),
  "Original final review is too trivial for an evidence-based reflection");
console.log("PASS original final four-part release lab, 250-character learner gate, and source-authored final review");


const wrong={
 "release-candidates":[
  'return (bool(label) and actual_digest==approved_digest)',
  'return bool(label)'
 ],
 "promotion-and-gates":[
  'if p.candidate_digest!=p.tested_digest or p.candidate_digest!=p.approved_digest:',
  'if False:'
 ],
 "deployment-evidence":[
  'if any(d!=item.approved_digest for d in',
  'if False and any(d!=item.approved_digest for d in'
 ],
 "release-observability":[
  'if after.integrity_violations:',
  'if False:'
 ],
 "release-failure-handling":[
  'if item.old_schema_compatible is False or item.external_effects_reconciled is False:',
  'if False:'
 ],
 "release-runbooks":[
  'if (p.requested_target!=p.approved_target',
  'if (False and p.requested_target!=p.approved_target'
 ]
};
const outputMarkers={
 "release-candidates":["RELEASE_CANDIDATE_BYTES_CHANGED_UNDER_SAME_LABEL","RELEASE_MUTABLE_LABEL_FALSE_CONFIDENCE_EXPOSED"],
 "promotion-and-gates":["RELEASE_REQUIRED_CHECKS_AND_IDENTITY_BLOCK_PROMOTION","RELEASE_APPROVAL_WITHOUT_DIGEST_OR_CHECKS_EXPOSED"],
 "deployment-evidence":["RELEASE_ALL_ROLES_AND_NEGATIVE_EFFECTS_VERIFIED","RELEASE_GREEN_JOB_WITH_MIXED_WORKERS_EXPOSED"],
 "release-observability":["RELEASE_SIGNAL_DENOMINATOR_AND_INTEGRITY_DISTINGUISHED","RELEASE_IMPROVED_AVERAGE_MASKS_INTEGRITY_FAILURE"],
 "release-failure-handling":["RELEASE_RECOVERY_BOUNDARY_AND_UNKNOWN_PRESERVED","RELEASE_OLD_IMAGE_CANNOT_UNDO_SCHEMA_CHANGE"],
 "release-runbooks":["RELEASE_RUNBOOK_PREFLIGHT_STOPS_BEFORE_SIDE_EFFECT","RELEASE_UNAUTHORIZED_GREEN_RUNBOOK_EXPOSED"]
};
function python(code) {
 return spawnSync("python3",["-c",code],{encoding:"utf8",timeout:15000});
}
for(const id of originalIds){
 const entry=proofs[id];
 assert.ok(entry.caption && entry.code && entry.expected,id+" incomplete published proof");
 assert.equal(entry.language,"python",id+" expected stdlib executable source");
 const good=python(entry.code);
 assert.ifError(good.error);
 assert.equal(good.status,0,"Original learner source failed "+id+":\n"+good.stderr+"\n"+good.stdout);
 for(const marker of outputMarkers[id])assert.ok(good.stdout.includes(marker),"Missing learner observation "+id+" "+marker);
 const [before,after]=wrong[id];
 assert.ok(entry.code.includes(before),"Source mutation point missing "+id);
 const bad=python(entry.code.replace(before,after));
 assert.notEqual(bad.status,0,"Unsafe original source passed its assertions "+id);
 assert.match(bad.stderr,/AssertionError/,"Original source mutant failed for unrelated reason "+id+": "+bad.stderr);
 console.log("PASS exact release example "+id+" and unsafe wrong implementation detected");
}
const dock=proofs["release-candidates-docker"];
assert.equal(dock.language,"bash");
assert.ok(dock.code.includes("trap cleanup EXIT"),"Disposable Docker must clean temporary named images");
assert.ok(dock.code.includes('docker tag "$LAB:2" "$LAB:candidate"'),"Tag reassignment mechanism missing");
const daemon=spawnSync("docker",["info","--format","{{.ServerVersion}}"],{encoding:"utf8",timeout:15000});
assert.ifError(daemon.error);
assert.equal(daemon.status,0,"Docker Engine unavailable; do not claim a registry result: "+daemon.stderr);
function bash(code){
 return spawnSync("bash",["-e","-u","-o","pipefail","-c",code],{
  encoding:"utf8",timeout:120000,env:{...process.env,DOCKER_CLI_HINTS:"false"}
 });
}
const good=bash(dock.code);
assert.ifError(good.error);
assert.equal(good.status,0,"Exact learner Docker tag fixture failed:\n"+good.stdout+"\n"+good.stderr);
for(const marker of [
 "RELEASE_LOCAL_FIRST_IMAGE_ID_APPROVED",
 "RELEASE_MUTABLE_TAG_CHANGED_IMAGE_ID",
 "RELEASE_LOCAL_TAG_SWAP_BLOCKS_PROMOTION"
])assert.ok(good.stdout.includes(marker),"Missing real local Docker observation "+marker);
console.log("PASS exact published Docker: real local image IDs differ, candidate tag moves, digest-like local ID comparison blocks promotion");
const before='if [[ "$observed" == "$approved" ]]; then';
const after='if [[ "$observed" != "$approved" ]]; then';
assert.ok(dock.code.includes(before),"Cannot mutate original promotion decision");
const wrongRoute=bash(dock.code.replace(before,after));
assert.notEqual(wrongRoute.status,0,"Unsafe tag identity gate accepted swapped candidate");
assert.ok(wrongRoute.stdout.includes("RELEASE_MUTABLE_TAG_CHANGED_IMAGE_ID"),"Wrong gate did not reach actual identity mismatch");
assert.ok(!wrongRoute.stdout.includes("RELEASE_LOCAL_TAG_SWAP_BLOCKS_PROMOTION"));
console.log("PASS source-derived wrong local Docker promotion decision rejected");
const noSwap=bash(dock.code.replace('docker tag "$LAB:2" "$LAB:candidate"','# No tag reassignment'));
assert.notEqual(noSwap.status,0,"Removing intended tag swap must fail the observable mismatch");
assert.ok(!noSwap.stdout.includes("RELEASE_MUTABLE_TAG_CHANGED_IMAGE_ID"));
console.log("PASS missing tag-reassignment observation cannot be presented as tested");
console.log("LIMIT: the real Docker object is a LOCAL IMAGE ID, never a registry OCI manifest digest or a provenance attestation");
