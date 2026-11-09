import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

/** Execute EXACT source published in original Supply Chain readings.
 * This does not simulate or execute Nexus, a live OCI registry,
 * authenticated production publication, or independent learner mastery.
 */
const original=readFileSync("packages/runtime-kernel/src/paths/delivery-artifact-supply-chain-deep.ts","utf8");
const authored=readFileSync("packages/runtime-kernel/src/paths/delivery-supply-chain-operational-teaching.ts","utf8");
function exportedJson(name,following) {
 const start="export const "+name;
 const startPos=authored.indexOf(start);
 const nextPos=authored.indexOf("\nexport const "+following,startPos);
 assert.ok(startPos>=0 && nextPos>startPos,"Missing authored "+name+" or next record");
 const declaration=authored.slice(startPos,nextPos);
 const eq=declaration.indexOf(" = ");
 assert.ok(eq>=0,"Unparseable TS authored source "+name);
 const raw=declaration.slice(eq+3).trim().replace(/;$/,"");
 return JSON.parse(raw);
}
const examples=exportedJson("supplyChainOperationalExamples","supplyChainOperationalSections");
const sections=exportedJson("supplyChainOperationalSections","supplyChainOperationalPractices");
const topics=["repository-manager-architecture","npm-distribution",
 "container-registries","deploy-nexus-homelab","auth-permissions"];
const exampleTopics=["repository-manager-architecture","npm-distribution","container-registries"];
assert.deepEqual(Object.keys(sections),topics);
assert.deepEqual(Object.keys(examples).sort(),[...exampleTopics].sort());
assert.ok(original.includes("...(supplyChainOperationalSections[spec.id] ?? [])"),"Original reading factory not wired");
assert.ok(original.includes("...(supplyChainOperationalPractices[spec.id] ?? [])"),"Original practices not wired");
const ids=[...original.split("const specs: LessonSpec[] = [")[1].matchAll(/^\s*id: "([^"]+)",/gm)].map(m=>m[1]);
assert.equal(ids.length,25,"All 23 original topics + 2 original labs must be preserved");
assert.equal(new Set(ids).size,25);
for(const topic of topics) {
 assert.ok(ids.includes(topic),"Original Supply Chain lesson lost "+topic);
 assert.ok(sections[topic].length>=3,"Concept still compressed "+topic);
 for(const part of sections[topic]) {
   assert.ok(part.heading.length>15 && part.paragraphs.length>=2,
     "Missing mechanisms and failures in "+topic);
   assert.ok(part.paragraphs.every(p=>p.length>210),
     "Superficial subsection, not source depth: "+topic+" / "+part.heading);
 }
}
for(const topic of exampleTopics) {
 const e=examples[topic];
 assert.ok(sections[topic].some(s=>s.code?.code===e.code),
   "Learner-visible reading does not actually include tested source: "+topic);
 assert.ok(e.expected.length>80);
}
console.log("PASS original 25 supply chain IDs, five source-rich topic sections and practical continuity");

function run(command,args,code,label,passing,markers=[]) {
 const result=spawnSync(command,[...args,code],{
  encoding:"utf8",timeout:120000,maxBuffer:2*1024*1024
 });
 if(result.error)throw Error(label+": "+String(result.error));
 if(passing){
   assert.equal(result.status,0,label+"\nstdout:\n"+result.stdout+"\nstderr:\n"+result.stderr);
   for(const marker of markers)assert.ok(result.stdout.includes(marker),label+": missing marker "+marker);
 } else {
   assert.notEqual(result.status,0,label+" incorrectly accepted unsafe source");
   assert.match(result.stderr,/AssertionError|assert|LOCAL_UNSAFE_APPROVAL|FileNotFoundError/,
     label+": wrong failure type; stdout:\n"+result.stdout+"\nstderr:\n"+result.stderr);
 }
 console.log("PASS "+label+" status="+result.status);
}
const npm=examples["npm-distribution"].code;
const python=examples["repository-manager-architecture"].code;
const docker=examples["container-registries"].code;
const npmMarks=["NPM_DRY_RUN_SELECTED_DIST_NOT_SECRET","NPM_PACKAGE_IDENTITY_@tsa/registry-fixture@0.1.0"];
const pyMarks=["NEXUS_MODEL_PAIRED_SNAPSHOT_VALID",
"NEXUS_MODEL_METADATA_WITHOUT_BLOB_BLOCKED","NEXUS_MODEL_BLOB_CORRUPTION_BLOCKED",
"NEXUS_MODEL_CONSUMER_ADD_AND_PUBLISHER_DELETE_DENIED"];
const dockerMarks=["LOCAL_MUTABLE_TAG_RETARGETED_TO_DIFFERENT_IMAGE_ID",
"LOCAL_APPROVED_IMAGE_ID_MISMATCH_BLOCKS","REGISTRY_MANIFEST_DIGEST_STILL_NOT_PROVED"];
run("node",["--input-type=module","-e"],npm,"exact npm pack --dry-run local fixture",true,npmMarks);
assert.ok(npm.includes("files:['dist']"));
run("node",["--input-type=module","-e"],npm.replace("files:['dist']","files:['*']"),
    "unsafe npm tarball leak detected",false);
run("python3",["-c"],python,"exact Nexus-state *model* and denial matrix",true,pyMarks);
assert.ok(python.includes("if not payload.is_file():"));
run("python3",["-c"],python.replace("if not payload.is_file():","if False:"),
    "unsafe missing-blob detection removed",false);
assert.ok(python.includes("if sha256(payload.read_bytes()).hexdigest() != item['digest']:"));
run("python3",["-c"],python.replace(
    "if sha256(payload.read_bytes()).hexdigest() != item['digest']:","if False:"),
    "unsafe corrupted-blob detection removed",false);
assert.ok(python.includes("'consumer': {'read'}"));
run("python3",["-c"],python.replace("'consumer': {'read'}","'consumer': {'read', 'add'}"),
    "unsafe read-only consumer upload capability rejected",false);
run("bash",["-c"],docker,"exact Docker local tag retarget with identity gate",true,dockerMarks);
assert.ok(docker.includes('if [[ "$observed" == "$expected" ]]; then'));
run("bash",["-c"],docker.replace(
 'if [[ "$observed" == "$expected" ]]; then',
 'if [[ "$observed" != "$expected" ]]; then'),
 "unsafe local image identity gate inversion rejected",false);
console.log("PASS npm actual pack, Docker actual build/retag, Nexus paired-state model and five negative mutants");
