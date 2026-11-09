import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {readFileSync, mkdtempSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

const root = "packages/runtime-kernel/src/paths/";
const moduleSource = readFileSync(root+"cloud-object-storage-implementation-deep.ts","utf8");
const focused = readFileSync(root+"cloud-object-storage-focused.ts","utf8");
const liveSource = readFileSync(root+"cloud-object-storage-live-s3-proof.ts","utf8");
const match = liveSource.match(/export const cloudS3RealProtocolProofPython = ("(?:\\.|[^"\\])*");/);
assert.ok(match,"Missing actual learner-published boto3 program");
const python = JSON.parse(match[1]);
function extractObject(source,name,next){
  const start=source.indexOf("export const "+name);
  const end=next?source.indexOf("\nexport const "+next,start):source.length;
  assert.ok(start>=0 && end>start,"Missing source teaching "+name);
  return JSON.parse(source.slice(source.indexOf("=",start)+1,end).trim().replace(/;$/,""));
}
const readings = extractObject(focused,"objectStorageFocusedReadings","objectStorageExtraPractices");
const practices=extractObject(focused,"objectStorageExtraPractices");
const originalBase = "cloud-object-storage-implementation-";
for(const id of ["001","002","003","004","005"])
  assert.ok(moduleSource.includes('id: "'+originalBase+id+'"'),"Original activity lost: "+id);
assert.deepEqual(readings.map(x=>x.id),["006","007","008","009","010","011"].map(x=>originalBase+x),
  "Six original-source focused readings missing or reordered");
assert.ok(moduleSource.includes("...objectStorageFocusedReadings.map("),
  "Focused readings are not rendered");
assert.ok(moduleSource.includes("code: cloudS3RealProtocolProofPython"),
  "Real protocol learner source not actually rendered");
assert.ok(moduleSource.indexOf("...objectStorageFocusedReadings.map(") <
          moduleSource.indexOf('id: "'+originalBase+'002"'),
 "Concepts must precede original operational practicals");
for(const item of readings){
  assert.ok(item.sections.length>=3,"Overloaded/shallow "+item.id);
  for(const sec of item.sections){
    assert.ok(sec.heading.length>25 && sec.paragraphs.length>=2);
    assert.ok(sec.paragraphs.every(p=>p.length>=300),
      "Incomplete teaching mechanism "+item.id+"/"+sec.heading);
  }
}
for(const id of ["002","003","004"]){
  assert.ok(practices[originalBase+id]?.length>=2);
  assert.ok(moduleSource.includes('objectStorageExtraPractices["'+originalBase+id+'"]'),
    "Original practical lacks independent evidence "+id);
}
assert.ok(python.includes("http://127[.]0[.]0[.]1:") &&
          python.includes("tsa-lab-") &&
          python.includes("S3_NO_REAL_STEWARD_APP_POLICY_OR_PRODUCTION_DURABILITY_CLAIM"),
 "Learner proof must strictly refuse production endpoints and limit evidence claims");
console.log("PASS original five activity IDs, six new focused readings, 18 sections, and evidence-wired practicals");

const token=randomBytes(6).toString("hex");
const name="tsa-minio-"+token;
const dataDir=mkdtempSync(join(tmpdir(),"tsa-s3-data-"));
const image="quay.io/minio/minio:RELEASE.2025-09-07T16-13-09Z";
const accessKey="tsa_local_admin_"+token;
const secretKey="tsa_local_admin_training_secret_"+token+"_never_reuse";
let started=false;

function proc(command,args,extra={}){
  const result=spawnSync(command,args,{
    encoding:"utf8",timeout:extra.timeout??30000,
    maxBuffer:2*1024*1024,env:extra.env??process.env
  });
  assert.ok(!result.error,"Command timeout/spawn error "+command+": "+String(result.error));
  return result;
}
function docker(...args){
  const x=proc("docker",args,{timeout:190000});
  assert.equal(x.status,0,"Docker "+args.slice(0,3).join(" ")+" failed:\n"+x.stderr);
  return x.stdout.trim();
}
function health(endpoint){
  for(let count=0;count<80;count++){
    const x=proc("curl",["--silent","--fail","--max-time","2",endpoint+"/minio/health/live"]);
    if(x.status===0)return;
    proc("sleep",["0.3"]);
  }
  throw new Error("Disposable MinIO was not healthy; no S3 acceptance can be claimed");
}
function execute(code,phase,bucket,positive,label,endpoint){
  const env={
    ...process.env,
    TSA_S3_ENDPOINT:endpoint,
    TSA_S3_BUCKET:bucket,
    TSA_S3_KEY:accessKey,
    TSA_S3_SECRET:secretKey,
    AWS_EC2_METADATA_DISABLED:"true",
  };
  const x=proc("python3",["-c",code,phase],{timeout:75000,env});
  if(positive){
    assert.equal(x.status,0,label+"\nstdout:\n"+x.stdout+"\nstderr:\n"+x.stderr);
  } else {
    assert.notEqual(x.status,0,label+" unsafe S3 source unexpectedly passed");
    assert.match(x.stderr,/AssertionError/,label+" failed for unrelated reason:\n"+x.stderr);
  }
  console.log("PASS "+label+" status="+x.status);
  return x.stdout;
}
try {
  docker("run","--detach","--rm","--name",name,
    "--publish","127.0.0.1::9000",
    "--env","MINIO_ROOT_USER="+accessKey,
    "--env","MINIO_ROOT_PASSWORD="+secretKey,
    "--volume",dataDir+":/data",
    image,"server","/data","--console-address",":9001");
  started=true;
  const port = docker("port",name,"9000/tcp").split("\n")[0].match(/^127\.0\.0\.1:(\d+)$/)?.[1];
  assert.ok(port,"MinIO published an unexpected/non-loopback endpoint");
  const endpoint="http://127.0.0.1:"+port;
  health(endpoint);

  const bucket="tsa-lab-"+token;
  const output=execute(python,"exercise",bucket,true,"real MinIO SigV4 PUT/GET, SHA256, version/delete/recover, signed GET and denial",endpoint);
  for(const marker of [
    "S3_REAL_BUCKET_VERSIONING_ENABLED",
    "S3_APPLICATION_GUARD_REJECTS_OTHER_TEAM_AND_PREFIX_COLLISION",
    "S3_REAL_SIGNED_PUT_GET_AND_END_TO_END_SHA256",
    "S3_REAL_OVERWRITE_RETRIEVES_OLD_VERSION_BY_ID",
    "S3_REAL_DELETE_MARKER_AND_VERSION_RECOVERY",
    "S3_REAL_SIGV4_PRESIGNED_DOWNLOAD_AFTER_APP_APPROVAL",
    "S3_REAL_INVALID_SIGNATURE_DENIED_NOT_SCOPED_IAM_PROOF",
    "S3_REAL_NETWORK_OUTAGE_FAILS_CLOSED_NOT_SUCCESSFUL_EXPORT",
    "S3_NO_REAL_STEWARD_APP_POLICY_OR_PRODUCTION_DURABILITY_CLAIM",
  ])assert.ok(output.includes(marker),"Real S3 exercise missing "+marker);

  const mutants=[
    ["cross-team export authorization incorrectly allowed",
      'return key.startswith(f"reports/{subject_team}/")',
      'return key.startswith("reports/")'],
    ["versioning accidentally disabled",
      'VersioningConfiguration={"Status": "Enabled"}',
      'VersioningConfiguration={"Status": "Suspended"}'],
    ["no delete marker really written",
      'deleted = s3.delete_object(Bucket=bucket, Key=stable_key)',
      'deleted = {"DeleteMarker": True}  # unsafe no delete'],
    ["bad signature incorrectly treated as valid",
      'secret_key + "-invalid"', 'secret_key'],
    ["offline object upload falsely accepted",
      'committed = False', 'committed = True'],
  ];
  for(const [label,needle,bad] of mutants){
    assert.ok(python.includes(needle),"Mutation source anchor missing: "+label);
    const mutated=python.replace(needle,bad);
    const mutatedBucket="tsa-lab-"+randomBytes(6).toString("hex");
    execute(mutated,"exercise",mutatedBucket,false,
      "rejected unsafe S3 mutant: "+label,endpoint);
  }

  // Same Docker container and host volume; a real daemon process restart, not
  // in-memory replay or new empty server.
  docker("restart",name);
  health(endpoint);
  const after=execute(python,"verify",bucket,true,
    "real S3 object persisted across MinIO container restart",endpoint);
  assert.ok(after.includes("S3_REAL_RESTART_PERSISTED_BYTES_AND_SHA256_VERIFIED"));
  // Mutant expecting different bytes MUST fail the real post-restart retrieval.
  const changed=python.replace(
    'stable_bytes = b"Synthetic Steward Team A persistent export: approved v1"',
    'stable_bytes = b"CORRUPTED EXPECTED PERSISTED BYTES"');
  assert.notEqual(changed,python);
  execute(changed,"verify",bucket,false,
    "rejected unsafe S3 mutant: corrupted expected restart bytes",endpoint);
  console.log("PASS actual MinIO Docker with real boto3/SigV4, five unsafe API source mutants, restart bytes and corrupted restore denial");
  console.log("REAL scoped policy, real Steward integration, off-host backup and production durability NOT_TESTED");
} finally {
  if(started)proc("docker",["rm","-f",name],{timeout:30000});
  rmSync(dataDir,{recursive:true,force:true});
}
