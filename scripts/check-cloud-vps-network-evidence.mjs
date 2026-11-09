import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const root="packages/runtime-kernel/src/paths/";
function read(path){return readFileSync(root+path,"utf8")}
const vps=read("cloud-vps-operations-deep.ts"), net=read("cloud-internet-networking-deep.ts");
const depthVps=read("cloud-vps-learner-reconstruction.ts"),depthNet=read("cloud-network-learner-reconstruction.ts");
const srcVps=read("cloud-vps-local-proofs.ts"),srcNet=read("cloud-network-dns-proof.ts");
function literal(src,name){
  const match=src.match(new RegExp("export const "+name+" = (\"(?:\\\\.|[^\"\\\\])*\");"));
  assert.ok(match,"Could not retrieve exact learner proof "+name);
  return JSON.parse(match[1]);
}
function record(src,name,next){
 const start=src.indexOf("export const "+name),end=next?src.indexOf("\nexport const "+next,start):src.length;
 assert.ok(start>=0&&end>start,"Could not parse topic source "+name);
 const chunk=src.slice(start,end);
 return JSON.parse(chunk.slice(chunk.indexOf(" = ")+3).trim().replace(/;$/,""));
}
const vpsSections=record(depthVps,"cloudVpsDepth","cloudVpsPractices"),
      vpsPractices=record(depthVps,"cloudVpsPractices");
const netSections=record(depthNet,"cloudNetworkDepth","cloudNetworkPractices"),
      netPractices=record(depthNet,"cloudNetworkPractices");
const vpsTopics=["choosing-budget-vps","provisioning-server","public-ip-addressing",
  "securing-ssh-access","provider-firewalls","os-lifecycle-patching",
  "remote-recovery","backups-snapshots"];
const netTopics=["public-private-addressing","internet-routing","domains-dns-records",
  "dns-resolution-troubleshooting","tls-certificates","https-tls-termination",
  "reverse-proxies","ingress-concepts","internet-firewalls","exposure-attack-surface"];
assert.deepEqual(Object.keys(vpsSections),vpsTopics);
assert.deepEqual(Object.keys(netSections),netTopics);
for(const [topics,source,sections,practices,minimum] of [
 [vpsTopics,vps,vpsSections,vpsPractices,3],
 [netTopics,net,netSections,netPractices,2]
]){
 for(const topic of topics){
  assert(source.includes('id: "'+topic+'"'),"Original lesson lost: "+topic);
  assert(sections[topic].length>=minimum,"Over-compressed concept: "+topic);
  for(const section of sections[topic]){
   assert(section.paragraphs.length>=2&&section.heading.length>14);
   assert(section.paragraphs.every(p=>p.length>210),"Unexplained mechanism "+topic+" "+section.heading);
  }
  assert(practices[topic].length>=2,"Missing independent transfer practice "+topic);
 }
}
assert(vps.includes("...spec.sections, ...extra")&&vps.includes("cloudVpsPractices[spec.id]"));
assert(net.includes("...spec.sections, ...extra")&&net.includes("cloudNetworkPractices[spec.id]"));
assert(vps.includes("cloudVpsLoopbackProof"));
assert(net.includes("cloudNetworkDnsProof"));
assert(vpsSections["public-ip-addressing"].some(s=>s.codeKey==="loopback"));
assert(netSections["dns-resolution-troubleshooting"].some(s=>s.codeKey==="dns"));
for(const marker of ["vps-operations-steward-vps-lab-001","vps-operations-steward-vps-lab-005"])
 assert(vps.includes(marker),"Lost original VPS lab "+marker);
for(const marker of ["internet-networking-publish-steward-lab-001","internet-networking-publish-steward-lab-004"])
 assert(net.includes(marker),"Lost original networking lab "+marker);
console.log("PASS eight VPS and ten Internet Networking original topics, labs and source/practical evidence");

function run(code,label,marks=[],positive=true){
 const proc=spawnSync("python3",["-c",code],{
   encoding:"utf8",timeout:17000,maxBuffer:2*1024*1024
 });
 assert.ok(!proc.error,label+" spawn/timeout "+String(proc.error));
 if(positive){
  assert.equal(proc.status,0,label+"\nstdout:\n"+proc.stdout+"\nstderr:\n"+proc.stderr);
  for(const marker of marks)assert.ok(proc.stdout.includes(marker),label+" lacks "+marker);
 } else {
  assert.notEqual(proc.status,0,label+" accepted unsafe mutation");
  assert.match(proc.stderr,/AssertionError/,label+" unrelated error:\n"+proc.stderr);
 }
 console.log("PASS "+label+" status="+proc.status);
}
const socket=literal(srcVps,"cloudVpsLoopbackProof");
const dns=literal(srcNet,"cloudNetworkDnsProof");
run(socket,"real isolated loopback TCP bind/deny",[
 "VPS_LOOPBACK_POSITIVE_CONNECTION",
 "VPS_UNBOUND_LOOPBACK_ALIAS_REJECTED",
 "VPS_FIXTURE_NOT_A_REAL_INTERNET_FIREWALL_TEST"
]);
for(const [name,from,to] of [
 ["wildcard listener unexpectedly admitted","server.bind((\"127.0.0.1\", 0))",
   "server.bind((\"0.0.0.0\", 0))"],
 ["malformed backend reply accepted","assert client.recv(16) == b\"pong\"",
   "assert client.recv(16) == b\"wrong\""]
]){
 assert(socket.includes(from),"Socket mutant no anchor "+name);
 run(socket.replace(from,to),"rejected socket mutant: "+name,[],false);
}
run(dns,"real localhost DNS UDP A and NXDOMAIN",[
 "DNS_LOCAL_A_RECORD_AND_TRANSACTION_ID_VERIFIED",
 "DNS_LOCAL_NXDOMAIN_REJECTED_AS_MISSING",
 "DNS_FIXTURE_NOT_PUBLIC_AUTHORITATIVE_OR_RECURSIVE_RESOLUTION"
]);
for(const [name,from,to] of [
 ["DNS reply transaction ID mismatched","struct.pack(\"!HHHHHH\", txid, flags, 1",
   "struct.pack(\"!HHHHHH\", txid+1, flags, 1"],
 ["negative DNS response incorrectly coded as success",
  "flags = 0x8180 if found else 0x8183","flags = 0x8180"],
 ["false DNS A answer admitted",
  "assert raw.endswith(APPROVED.packed)","assert not raw.endswith(APPROVED.packed)"],
 ["DNS NXDOMAIN wrongly expected NOERROR",
  "assert (bad_flags & 15) == 3","assert (bad_flags & 15) == 0"]
]){
 assert(dns.includes(from),"DNS mutant anchor not found "+name);
 run(dns.replace(from,to),"rejected DNS mutant: "+name,[],false);
}
console.log("PASS exact learner-visible TCP and DNS programs plus six unsafe mutants; external VPS/DNS/firewall NOT TESTED");
