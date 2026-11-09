import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const root="packages/runtime-kernel/src/paths/";
const original=readFileSync(root+"cloud-certificate-lifecycle-operations-deep.ts","utf8");
const focus=readFileSync(root+"cloud-certificate-lifecycle-focused.ts","utf8");
const source=readFileSync(root+"cloud-certificate-renewal-live-proof.ts","utf8");
const found=source.match(/export const cloudCertificateRenewalPython = ("(?:\\.|[^"\\])*");/);
assert.ok(found,"Missing exact learner-published renewal source");
const python=JSON.parse(found[1]);
function readObject(str,name,nextName) {
 const start=str.indexOf("export const "+name);
 const end=nextName?str.indexOf("\nexport const "+nextName,start):str.length;
 assert.ok(start>=0 && end>start);
 return JSON.parse(str.slice(str.indexOf("=",start)+1,end).trim().replace(/;$/,""));
}
const readings=readObject(focus,"certificateLifecycleFocusedReadings","certificateLifecycleExtraPractices");
const practices=readObject(focus,"certificateLifecycleExtraPractices");
const base="cloud-certificate-lifecycle-operations-";
for (const i of ["001","002","003","004","005","006"])
 assert.ok(original.includes('id: "'+base+i+'"'),"Original certificate lifecycle ID lost: "+i);
assert.deepEqual(readings.map(x=>x.id),["007","008","009"].map(x=>base+x));
for(const reading of readings) {
 assert.ok(reading.sections.length>=3,"Overloaded/short focus reading");
 for(const section of reading.sections) {
  assert.ok(section.heading.length>=25);
  assert.ok(section.paragraphs.length>=2);
  assert.ok(section.paragraphs.every(x=>x.length>=300));
 }
}
for(const i of ["002","003","004","005"]){
 assert.ok(practices[base+i]?.length>=2,"Missing operational acceptance "+i);
 assert.ok(original.includes('certificateLifecycleExtraPractices["'+base+i+'"]'),
   "Original practical not wired "+i);
}
assert.ok(original.includes("...certificateLifecycleFocusedReadings.map("));
assert.ok(original.includes("code: cloudCertificateRenewalPython"));
assert.ok(original.indexOf("...certificateLifecycleFocusedReadings.map(") <
          original.indexOf('id: "'+base+'002"'),
 "Concept proof must precede operational practicals");
console.log("PASS original six certificate activity IDs + three focused readings, operational practices and exact-source code wiring");

const markers=[
 "CERT_OLD_ENDPOINT_FINGERPRINT_AND_EXPIRY_OBSERVED",
 "CERT_ISSUED_FILE_DID_NOT_CHANGE_SERVED_CERTIFICATE",
 "CERT_FAILED_RENEWAL_ALERTS_BEFORE_PUBLIC_TLS_FAILURE",
 "CERT_RELOAD_VERIFIED_FROM_INDEPENDENT_TLS_CLIENT",
 "CERT_LOOPBACK_ONLY_NOT_LIVE_ACME_KONG_OR_PUBLIC_MONITORING",
];
function run(program,label,passes){
 const result=spawnSync("python3",["-c",program],{encoding:"utf8",timeout:55000,maxBuffer:2*1024*1024});
 assert.ok(!result.error,label+": "+String(result.error));
 if(passes){
  assert.equal(result.status,0,label+"\nstdout:\n"+result.stdout+"\nstderr:\n"+result.stderr);
  for(const m of markers)assert.ok(result.stdout.includes(m),label+" missing "+m);
 }else{
  assert.notEqual(result.status,0,label+" unsafe renewal returned green");
  assert.match(result.stderr,/AssertionError/,label+" unrelated error: "+result.stderr);
 }
 console.log("PASS "+label+" status="+result.status);
}
run(python,"actual loopback TLS two-certificate live reload and expiry probe",true);
const wrong=[
 ["issued file falsely accepted as served", "assert second_sha == old_sha and second_days < 7", "assert second_sha == new_sha and second_days < 7"],
 ["gateway skipped certificate reload", "server.load_cert_chain(certfile=str(new_cert), keyfile=str(new_key))", "pass  # unsafe no reload"],
 ["gateway reloads the old identity", "server.load_cert_chain(certfile=str(new_cert), keyfile=str(new_key))", "server.load_cert_chain(certfile=str(old_cert), keyfile=str(old_key))"],
 ["expiry and failed scheduler both ignored", "return remaining_days <= 7 or not scheduler_healthy", "return False"]
];
for(const [label,needle,replace] of wrong){
 assert.ok(python.includes(needle),"Missing source mutation anchor "+label);
 run(python.replace(needle,replace),"rejected unsafe certificate mutant: "+label,false);
}
console.log("PASS real local TLS live cert reload and four source mutations; actual ACME/Kong/public endpoint NOT_TESTED");
