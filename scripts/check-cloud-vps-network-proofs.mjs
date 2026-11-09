import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const path="packages/runtime-kernel/src/paths/";
const vps=readFileSync(path+"cloud-vps-operations-deep.ts","utf8");
const vpsQuality=readFileSync(path+"cloud-vps-operations-quality.ts","utf8");
const network=readFileSync(path+"cloud-internet-networking-deep.ts","utf8");
const netQuality=readFileSync(path+"cloud-internet-networking-quality.ts","utf8");
const vpsDepth=readFileSync(path+"cloud-vps-mechanism-depth.ts","utf8");
const netDepth=readFileSync(path+"cloud-network-mechanism-depth.ts","utf8");

function originalIds(source){
 const specs=source.split("const specs: LessonSpec[] = [")[1]?.split("\n];")[0];
 assert.ok(specs,"Original spec factory lost");
 return [...specs.matchAll(/^\s*id: "([^"]+)",/gm)].map(x=>x[1]);
}
function objBetween(source, name, next){
 const start=source.indexOf("export const "+name);
 const end=source.indexOf("\nexport const "+next,start);
 assert.ok(start>=0 && end>start,"Missing "+name+" original-source sections");
 return JSON.parse(source.slice(source.indexOf("=",start)+1,end).trim().replace(/;$/,""));
}
function lastObject(source,name){
 const start=source.indexOf("export const "+name);
 assert.ok(start>=0,"Missing "+name);
 return JSON.parse(source.slice(source.indexOf("=",start)+1).trim().replace(/;$/,""));
}
function exactPython(file, symbol){
 const source=readFileSync(path+file,"utf8");
 const found=source.match(new RegExp("export const "+symbol+" = (\"(?:\\\\.|[^\"\\\\])*\");"));
 assert.ok(found,"Missing published learner Python "+symbol);
 return JSON.parse(found[1]);
}
const vpsTopics=["choosing-budget-vps","provisioning-server","public-ip-addressing","securing-ssh-access","provider-firewalls","os-lifecycle-patching","remote-recovery","backups-snapshots"];
const netTopics=["public-private-addressing","internet-routing","domains-dns-records","dns-resolution-troubleshooting","tls-certificates","https-tls-termination","reverse-proxies","ingress-concepts","internet-firewalls","exposure-attack-surface"];
const cases=[
 {source:vps,quality:vpsQuality,depth:vpsDepth,ids:vpsTopics,
   section:"cloudVpsMechanismSections",practice:"cloudVpsEvidencePractices",
   originalPrefix:"vps-operations",lab:"vps-operations-steward-vps-lab"},
 {source:network,quality:netQuality,depth:netDepth,ids:netTopics,
   section:"cloudNetworkMechanismSections",practice:"cloudNetworkAppliedPractices",
   originalPrefix:"internet-networking",lab:"internet-networking-publish-steward-lab"}
];
for(const part of cases){
 assert.deepEqual(originalIds(part.source),part.ids,"Canonical topic order altered "+part.originalPrefix);
 const sections=objBetween(part.depth,part.section,part.practice);
 const practices=lastObject(part.depth,part.practice);
 assert.deepEqual(Object.keys(sections),part.ids);
 assert.deepEqual(Object.keys(practices),part.ids);
 assert.ok(part.source.includes(part.section+"[spec.id]"),"Original reading not using source overlay");
 assert.ok(part.quality.includes(part.practice+"["),
   "Original applied practical not incorporating evidence");
 for(const id of part.ids){
   assert.ok(sections[id].length>=2,"Overloaded/too thin subject "+id);
   for(const section of sections[id]){
     assert.ok(section.heading.length>=25);
     assert.ok(section.paragraphs.length>=2);
     assert.ok(section.paragraphs.every(text=>text.length>=220),
       "Concept/explanation missing for "+id+" "+section.heading);
   }
   assert.ok(practices[id].length>=2,"No independent evidence for "+id);
 }
 assert.ok(part.source.includes(part.lab+"-001"),"Original lab ID lost");
}
assert.ok(vps.includes("code: cloudVpsSshLocalProof"),"Local SSH source not rendered");
assert.ok(network.includes("code: cloudNetworkTlsLocalProof"),"Local TLS source not rendered");
console.log("PASS original 8 VPS and 10 Internet Networking topics, original labs, source-depth and applied practice wiring");

function execute(program, label, markers, ok=true){
 const x=spawnSync("python3",["-c",program],
   {encoding:"utf8",timeout:50000,maxBuffer:2*1024*1024});
 assert.ok(!x.error,"Execution/timeout "+label+" "+String(x.error));
 if(ok){
   assert.equal(x.status,0,label+"\nstdout:\n"+x.stdout+"\nstderr:\n"+x.stderr);
   for(const m of markers)assert.ok(x.stdout.includes(m),
     "Missing marker "+m+": "+x.stdout);
 }else{
   assert.notEqual(x.status,0,label+" incorrectly accepted unsafe change");
   assert.match(x.stderr,/AssertionError/,label+" failed for unrelated error: "+x.stderr);
 }
 console.log("PASS "+label+" status="+x.status);
}
const ssh=exactPython("cloud-vps-ssh-client-proof.ts","cloudVpsSshLocalProof");
const sshMarkers=[
 "SSH_REAL_ED25519_KEYPAIR_AND_PRIVATE_PERMISSIONS",
 "SSH_REAL_CLIENT_CONFIGURATION_REJECTS_UNVERIFIED_HOST",
 "SSH_NO_LIVE_SERVER_AND_NO_TOFU_BYPASS"];
execute(ssh,"actual disposable ssh-keygen and ssh -G trust/identity checks",sshMarkers);
const sshMutants=[
 ["root used instead of named admin","User steward-admin","User root"],
 ["host key validation disabled","StrictHostKeyChecking yes","StrictHostKeyChecking no"],
 ["any agent identity accepted","IdentitiesOnly yes","IdentitiesOnly no"],
 ["wrong host address silently accepted","HostName 192.0.2.10","HostName 192.0.2.11"]
];
for(const [name,before,after] of sshMutants){
 assert.ok(ssh.includes(before),"SSH mutation anchor absent "+name);
 execute(ssh.replace(before,after),"rejected SSH mutant: "+name,[],false);
}
const tls=exactPython("cloud-network-tls-proof.ts","cloudNetworkTlsLocalProof");
const tlsMarkers=[
 "TLS_TRUSTED_LOCAL_CERT_AND_CORRECT_NAME_OK",
 "TLS_WRONG_HOSTNAME_REJECTED",
 "TLS_UNTRUSTED_LOCAL_CERT_REJECTED",
 "TLS_LOOPBACK_ONLY_AND_REJECTION_COUNT_VERIFIED",
 "TLS_NOT_REAL_DNS_ACME_PUBLIC_CA_OR_VPS_CONFIG"];
execute(tls,"real local OpenSSL/Python ssl handshake and denied name/CA",tlsMarkers);
const tlsMutants=[
 ["wrong hostname accepted","server_hostname=\"wrong.steward.test\"","server_hostname=HOSTNAME"],
 ["untrusted issuer installed as authority","untrusted = ssl.create_default_context()","untrusted = ssl.create_default_context(cafile=str(cert))"],
 ["wildcard public TLS listener","listener.bind((\"127.0.0.1\", 0))","listener.bind((\"0.0.0.0\", 0))"]
];
for(const [name,before,after] of tlsMutants){
 assert.ok(tls.includes(before),"TLS mutation anchor absent "+name);
 execute(tls.replace(before,after),"rejected TLS mutant: "+name,[],false);
}
console.log("PASS real SSH and loopback TLS examples, seven source-mutated unsafe variants; NO live VPS/DNS/ACME claims");
