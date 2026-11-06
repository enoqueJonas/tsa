import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

/** These are the EXACT original-lesson programs: no stand-in versions.
 * Docker is a disposable localhost two-image simulation, NOT a production
 * reverse-proxy, PostgreSQL, GitLab, registry, authorization or learner review.
 */
const proofPath="packages/runtime-kernel/src/paths/delivery-cd-proofs.ts";
const author=readFileSync(proofPath,"utf8");
const match=author.match(/export const cdProofs:Record<string,CDProof> = (\{[\s\S]*\});\s*$/);
assert.ok(match,"Cannot extract original CD lesson scripts");
const proofs=JSON.parse(match[1]);
const expectedIds=["database-migrations","rollback","canary","feature-flags","release-approvals","blue-green"];
assert.deepEqual(Object.keys(proofs),expectedIds);
const wired=readFileSync("packages/runtime-kernel/src/paths/delivery-continuous-delivery-deep.ts","utf8");
assert.ok(wired.includes("const proof=cdProofs[id]"),"Published CD source examples are not wired into original readings");
const lens=readFileSync("packages/runtime-kernel/src/paths/delivery-cd-learner-mechanisms.ts","utf8");
const lenses=JSON.parse(lens.slice(lens.indexOf("= {")+2,lens.lastIndexOf(";\n")));
for(const id of expectedIds.filter(k=>k!=="release-approvals")){
 const section=lenses[id];
 assert.ok(section && section.sections.length>=3,"Missing author-source mechanism for "+id);
 assert.ok(section.sections.flatMap(x=>x.paragraphs).join("\n").length>1750,"Underexplained original CD concept: "+id);
 assert.ok(section.sections.every(x=>x.heading && x.paragraphs.length>=2),"Missing alternative and failure: "+id);
}
function runPython(source){
 return spawnSync("python3",["-c",source],{encoding:"utf8",timeout:15000});
}
const pythonMutations={
 "database-migrations":['db.execute("ALTER TABLE loans DROP COLUMN status")','db.execute("SELECT status FROM loans")'],
 "rollback":['if r.old_schema_compatible is False or r.emitted_external_effects_reconciled is False:',"if False:"],
 "canary":['if w.requests<100 or w.critical_writes<20:',"if False:"],
 "feature-flags":['if not app.enabled:',"if False:"],
 "release-approvals":['if a.reviewed_digest!=a.selected_digest or a.reviewed_environment!=a.target_environment:',"if False:"]
};
const expectedMarkers={
 "database-migrations":["CD_SQLITE_EXPAND_SUPPORTS_OLD_AND_NEW_READERS","CD_SQLITE_NEW_READER_SURVIVES_CONTRACTION","CD_SQLITE_OLD_READER_BREAKS_AFTER_CONTRACTION"],
 "rollback":["CD_ROLLBACK_APPLICATION_VS_SCHEMA_AND_EFFECTS_DISTINCT","CD_KNOWN_TAG_DOES_NOT_PROVE_SAFE_ROLLBACK"],
 "canary":["CD_CANARY_REJECTS_TINY_SAMPLE_AND_CRITICAL_VIOLATION","CD_ZERO_ERRORS_FROM_TEN_NOT_PROOF"],
 "feature-flags":["CD_FLAG_OFF_STOPS_NEW_EFFECTS_BUT_PRESERVES_OLD","CD_KILL_SWITCH_NOT_DATA_RECOVERY"],
 "release-approvals":["CD_APPROVAL_BOUND_TO_DIGEST_AND_ENVIRONMENT","CD_APPROVED_ACTOR_NOT_APPROVED_BYTES"]
};
for(const [id,[find,mutate]] of Object.entries(pythonMutations)){
 const published=proofs[id];
 assert.equal(published.language,"python",id);
 const result=runPython(published.code);
 assert.ifError(result.error);
 assert.equal(result.status,0,"Published original CD "+id+" failed: "+result.stderr+"\n"+result.stdout);
 for(const marker of expectedMarkers[id])assert.ok(result.stdout.includes(marker),"Original learner output missing "+marker);
 assert.ok(published.code.includes(find),"Unsafe mutation target missing in actual lesson: "+id);
 const bad=runPython(published.code.replace(find,mutate));
 assert.notEqual(bad.status,0,"Unsafe CD mutation still accepted: "+id);
 assert.match(bad.stderr,/AssertionError/,"Unsafe CD mutation rejected for unrelated reason "+id+": "+bad.stderr);
 console.log("PASS published original CD "+id+" and meaningful wrong implementation rejected");
}
// The disposable Bash example must expose only host loopback ports. Never
// execute a malicious networking mutant that exposes the host externally.
const shell=proofs["blue-green"];
assert.equal(shell.language,"bash");
assert.ok(shell.code.includes("-p 127.0.0.1::8080"));
assert.equal(shell.code.match(/-p 127\.0\.0\.1::8080/g)?.length,2);
assert.ok(shell.code.includes("trap cleanup EXIT"),"Local Docker fixture must clean its own containers");
const daemon=spawnSync("docker",["info","--format","{{.ServerVersion}}"],{encoding:"utf8",timeout:12000});
assert.ifError(daemon.error);
assert.equal(daemon.status,0,"Docker Engine unavailable: "+daemon.stderr);
function runBash(script) {
 return spawnSync("bash",["-e","-u","-o","pipefail","-c",script],{
  encoding:"utf8",timeout:100000,env:{...process.env,DOCKER_CLI_HINTS:"false"}
 });
}
const good=runBash(shell.code);
assert.ifError(good.error);
assert.equal(good.status,0,"Actual source Docker blue/green lesson failed: "+good.stdout+"\n"+good.stderr);
for(const marker of [
 "CD_TWO_LOCAL_IMAGE_IDS_DIFFER",
 "CD_HTTP_200_BUT_BAD_BUSINESS_MARKER_DETECTED",
 "CD_BROKEN_CANDIDATE_LEFT_ACTIVE_A_UNCHANGED"
])assert.ok(good.stdout.includes(marker),"Missing live local Docker observation "+marker);
console.log("PASS published local Docker two-image HTTP rehearsal, distinct image IDs, healthy A/HTTP-200 broken B, active A unchanged");
const wrongRouteSource='if [[ "$b_body" == "release=B;state=healthy" ]]; then';
const wrongRouteCode='if [[ "$b_body" == "release=B;state=broken" ]]; then';
assert.ok(shell.code.includes(wrongRouteSource),"Could not locate the original route decision");
const unsafe=runBash(shell.code.replace(wrongRouteSource,wrongRouteCode));
assert.notEqual(unsafe.status,0,"Unsafe route switch to unhealthy candidate was not caught");
assert.ok(unsafe.stdout.includes("CD_HTTP_200_BUT_BAD_BUSINESS_MARKER_DETECTED"),"Unsafe route mutant did not reach user verification");
assert.ok(!unsafe.stdout.includes("CD_BROKEN_CANDIDATE_LEFT_ACTIVE_A_UNCHANGED"),"Unsafe candidate incorrectly passed final route contract");
console.log("PASS mutated route-to-broken-B rejected by actual source client selection assertion");
const impossibleMarker="printf 'release=B;state=broken\\n' >";
assert.ok(shell.code.includes(impossibleMarker),"Could not target candidate readiness mutation");
const falseGreen=runBash(shell.code.replace(impossibleMarker,"printf 'release=B;state=healthy\\n' >"));
assert.notEqual(falseGreen.status,0,"Unexpected candidate health fixture change did not break the expected negative case");
assert.ok(!falseGreen.stdout.includes("CD_HTTP_200_BUT_BAD_BUSINESS_MARKER_DETECTED"));
console.log("PASS missing negative candidate observation cannot be reported as tested");
console.log("LIMIT: real local Docker image/process/HTTP only; no actual proxy switch, database, registry, GitLab, or independent learner");
