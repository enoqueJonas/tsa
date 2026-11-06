import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

// Original learner-source executable evidence, no simulated Nexus execution.
const original=readFileSync("packages/runtime-kernel/src/paths/delivery-artifact-supply-chain-deep.ts","utf8");
const authored=readFileSync("packages/runtime-kernel/src/paths/delivery-supply-chain-governance-teaching.ts","utf8");
const examplesTs=readFileSync("packages/runtime-kernel/src/paths/delivery-supply-chain-trust-proofs.ts","utf8");
function record(source, name) {
  const beginning=source.indexOf("export const "+name);
  assert.ok(beginning>=0,"Missing "+name);
  const position=source.indexOf("=",beginning);
  assert.ok(position>beginning);
  const value=source.slice(position+1).trim().replace(/;$/,"");
  return JSON.parse(value);
}
function recordBefore(source,name,nextName) {
  const beginning=source.indexOf("export const "+name);
  const end=source.indexOf("\nexport const "+nextName,beginning);
  assert.ok(beginning>=0 && end>beginning,"Missing "+name+" section declaration");
  return JSON.parse(source.slice(source.indexOf(" = ",beginning)+3,end).trim().replace(/;$/,""));
}
const sections=recordBefore(authored,"supplyChainGovernanceTeaching","supplyChainGovernancePractices");
const practices=record(authored,"supplyChainGovernancePractices");
const examples=record(examplesTs,"supplyChainTrustExamples");
const originalIds=[...original.split("const specs: LessonSpec[] = [")[1].matchAll(/^\s*id: "([^"]+)",/gm)].map(m=>m[1]);
const topics=["proxy-cache-public","internal-versioning","prerelease-release",
  "retention-cleanup","provenance","sbom","signing-provenance","scanning",
  "lab-nexus-platform","lab-steward-common-ci"];
assert.equal(originalIds.length,25);
assert.equal(new Set(originalIds).size,25);
assert.deepEqual(Object.keys(sections),topics);
assert.deepEqual(Object.keys(practices),topics);
for (const topic of topics) {
  assert.ok(originalIds.includes(topic),"Lost original lesson "+topic);
  assert.ok(sections[topic].length>=(topic.startsWith("lab-")?4:3),
    "Concept compression "+topic);
  for(const section of sections[topic]) {
    assert.ok(section.paragraphs.length>=2&&section.heading.length>14);
    assert.ok(section.paragraphs.every(x=>x.length>=260),
      "Thin explanation "+topic+" / "+section.heading);
  }
  assert.ok(practices[topic].length>=2,"Missing applied practical "+topic);
}
assert.ok(original.includes("...governanceSections"));
assert.ok(original.includes("...(supplyChainGovernancePractices[spec.id] ?? [])"));
assert.ok(original.includes("code: example.code"));
assert.deepEqual(Object.keys(examples),["proxy-cache-public","retention-cleanup"]);
assert.equal(examples["proxy-cache-public"].language,"python");
assert.equal(examples["retention-cleanup"].language,"javascript");
assert.ok(sections["lab-nexus-platform"].some(x=>x.paragraphs.join(" ").includes("NOT_TESTED")));
assert.ok(sections["lab-steward-common-ci"].some(x=>x.paragraphs.join(" ").includes("DEFERRED")));
console.log("PASS all 25 original Supply Chain IDs, final 8 topics + 2 labs, practicals, and executable source wiring");

function run(command,args,source,label,marks=[],passes=true){
 const result=spawnSync(command,[...args,source],{
   encoding:"utf8",timeout:45000,maxBuffer:2*1024*1024
 });
 assert.ok(!result.error,label+" failed to spawn: "+result.error);
 if (passes) {
   assert.equal(result.status,0,label+"\nstdout:\n"+result.stdout+"\nstderr:\n"+result.stderr);
   for(const marker of marks)
     assert.ok(result.stdout.includes(marker),label+" expected "+marker+"\n"+result.stdout);
 } else {
   assert.notEqual(result.status,0,label+" erroneously accepted unsafe source");
   assert.match(result.stderr,/AssertionError|ERR_ASSERTION/,
     label+" failed for an unrelated runtime error:\n"+result.stderr);
 }
 console.log("PASS "+label+" status="+result.status);
}
const proxy=examples["proxy-cache-public"].code;
const trust=examples["retention-cleanup"].code;
run("python3",["-c"],proxy,"exact two-local-HTTP-server cache/policy source",[
  "PROXY_FIRST_REQUEST_FETCHED_UPSTREAM",
  "PROXY_WARM_CACHE_SURVIVED_UPSTREAM_OUTAGE",
  "PROXY_COLD_CACHE_OFFLINE_FAILED_CLOSED",
  "PROXY_PRIVATE_NAMESPACE_NOT_PROXIED",
  "PROXY_CHANGED_CACHED_BYTES_REJECTED"
]);
for (const [name,needle,replacement] of [
 ["private package publicly proxied","if path in private_names:","if False:"],
 ["warm cache bypassed during outage","if path in cache:","if False:"],
 ["corrupt warm cache accepted","if sha256(payload).hexdigest() != approved_hash:","if False:"],
 ["upstream outage ignored","if not online['value']:","if False:"],
]){
 assert.ok(proxy.includes(needle),name+" mutation anchor missing");
 run("python3",["-c"],proxy.replace(needle,replacement),
  "rejected unsafe proxy mutant: "+name,[],false);
}
run("node",["--input-type=module","-e"],trust,
  "actual Ed25519 crypto and fictional inventory/retention release gate",[
    "RETENTION_PROTECTS_DEPLOYED_AND_ROLLBACK_DIGESTS",
    "PROVENANCE_CLAIM_BINDS_SUBJECT_AND_BUILD_RUN",
    "SBOM_INVENTORY_FOUND_FICTIONAL_ADVISORY_AND_BLOCKED_RELEASE",
    "ED25519_TAMPER_AND_UNTRUSTED_SIGNER_REJECTED",
    "MODEL_NOT_A_REAL_SBOM_SCAN_SIGNING_SERVICE_OR_NEXUS"
  ]);
for (const [name,needle,replacement] of [
 ["age-only retention deletes deployed","!protectedDigests.has(x.digest)","true"],
 ["claim points to wrong image","subject: {digest}","subject: {digest: sha('wrong-subject')}"],
 ["scanner suppresses affected component","notices.filter(notice => notice.purl === component.purl)","notices.filter(() => false)"],
 ["unreviewed high finding allowed","x.severity !== 'high' || x.approvedException","true"],
 ["tampered provenance considered valid","verify(null, altered, trusted.publicKey, signature)","verify(null, signedBytes, trusted.publicKey, signature)"],
 ["untrusted key substitution accepted","verify(null, signedBytes, trusted.publicKey, rogueSignature)","verify(null, signedBytes, rogue.publicKey, rogueSignature)"],
]){
 assert.ok(trust.includes(needle),name+" mutation anchor missing");
 run("node",["--input-type=module","-e"],trust.replace(needle,replacement),
  "rejected unsafe trust mutant: "+name,[],false);
}
console.log("PASS actual local HTTP proxy and Ed25519, protected retention, fictional SBOM/advisory with 10 unsafe mutations; NOT actual Nexus/signing/scanner");
