import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const source = readFileSync("packages/runtime-kernel/src/paths/cloud-observable-local-proofs.ts","utf8");
const wired = [
  ["cloud-certificate-lifecycle-operations-deep.ts","certificateLocalProofBlocks"],
  ["cloud-object-storage-implementation-deep.ts","objectStoreLocalProofBlocks"],
  ["cloud-progressive-delivery-canary-deep.ts","canaryLocalProofBlocks"]
];
for (const [path,marker] of wired) {
  const actual = readFileSync("packages/runtime-kernel/src/paths/"+path,"utf8");
  assert.ok(actual.includes("..."+marker),marker+" not exposed in the actual lesson");
}
function extract(name) {
  const marker="export const "+name+" = ";
  const index=source.indexOf(marker);
  assert.ok(index>=0,"Missing exact source code: "+name);
  const match=source.slice(index+marker.length).match(/^("(?:\\.|[^"\\])*");/);
  assert.ok(match,"Malformed source for "+name);
  return JSON.parse(match[1]);
}
const cert=spawnSync("bash",["-c",extract("certificateNameProofBash")],{encoding:"utf8",timeout:20000});
assert.ifError(cert.error);
assert.equal(cert.status,0,cert.stderr+"\n"+cert.stdout);
assert.match(cert.stdout,/expected: wrong hostname rejected/);
assert.match(cert.stdout,/local certificate name-matching proof complete/);
for (const [name,expected] of [
  ["objectKeyIdentityPython",["old content still present: False","old checksum matches: False","distinct keys preserve both: True"]],
  ["canaryEvidencePython",["low sample: INCONCLUSIVE","regression: ABORT","within rule: ELIGIBLE_FOR_OTHER_GATES"]],
]) {
  const result=spawnSync("python3",["-c",extract(name)],{encoding:"utf8",timeout:12000});
  assert.ifError(result.error); assert.equal(result.status,0,name+": "+result.stderr);
  for (const phrase of expected) assert.ok(result.stdout.includes(phrase),"Missing observed output "+phrase);
}
assert.ok(extract("objectStorageBoto3Optional").includes("TSA_S3_TEST_BUCKET"));
console.log("Cloud authored local TLS hostname, S3 key collision and canary minimum-evidence examples passed. Real cloud services and clusters UNVERIFIED.");
