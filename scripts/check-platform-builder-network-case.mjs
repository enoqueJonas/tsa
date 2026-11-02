import assert from "node:assert/strict";
import fs from "node:fs";
import {spawnSync} from "node:child_process";
const source=fs.readFileSync("packages/runtime-kernel/src/paths/platform-builder-networking-running-case.ts","utf8");
const assembled=fs.readFileSync("packages/runtime-kernel/src/paths/platform-builder-networking-deep.ts","utf8");
const quality=fs.readFileSync("packages/runtime-kernel/src/paths/platform-builder-networking-quality.ts","utf8");
const key="export const platformNetworkingTraceByTitle:";
const start=source.indexOf(key);
assert.ok(start>=0,"Missing authored network case");
const eq=source.indexOf(" = ",start);
const end=source.indexOf(";\nexport const platformNetworkingTraceResources",eq);
assert.ok(eq>start && end>eq,"Cannot parse stable source literal");
const mapping=JSON.parse(source.slice(eq+3,end));
const expected=["Networking Mental Models: OSI and TCP/IP","Ethernet and Switching","IP Addressing","Subnetting","ARP","Ports and Sockets","Routing","DHCP","DNS","NAT","Firewalls","HTTP and TLS from the Network Perspective","Network Troubleshooting Tools"];
assert.deepEqual(Object.keys(mapping),expected,"Connected Steward trace changed scope");
assert.ok(assembled.includes("platformNetworkingTraceByTitle[title]"),"Authored packet traces not rendered in lessons");
assert.ok(assembled.includes("platformNetworkingTraceResources.slice(0,2)"),"Subnet research references missing");
for(const [title,sections] of Object.entries(mapping)){
  assert.ok(assembled.includes('"'+title+'"'),"Source title not found: "+title);
  assert.ok(sections.length===1,"Do not overload lesson "+title);
  const [entry]=sections;
  assert.ok(entry.title.length>=30 && entry.paragraphs.length===2,"Teaching not definition/mechanism/failure: "+title);
  assert.ok(entry.paragraphs.every(p=>p.length>=200),"Missing worked trace or independent negative "+title);
}
const code=mapping.Subnetting[0].code;
assert.equal(code.language,"python","CIDR worked example must be executable");
const py=spawnSync("python3",["-c",code.code],{encoding:"utf8",timeout:10000});
assert.ifError(py.error);
assert.equal(py.status,0,"Actual published CIDR example failed:\n"+py.stdout+"\n"+py.stderr);
for(const phrase of [
  "server subnet: 192.168.50.0/26",
  "client subnet: 192.168.50.64/26",
  "client next hop for .20: 192.168.50.65",
  "server next hop for .70: 192.168.50.1",
  "incorrect /24 treats remote .70 as local: True"
])assert.ok(py.stdout.includes(phrase),"Published Python does not prove "+phrase);
assert.ok(quality.includes("Subnetting")&&quality.includes("ARP"),"Targeted practice no longer available");
assert.ok(assembled.includes("Flow control and congestion control protect different bottlenecks"),"Existing substantial TCP/UDP mechanisms lost");
assert.ok(quality.includes("new /27 or /28"),"Learner has no unseen subnet transfer");
console.log("Platform Builder connected network case passed: 13 rendered lesson traces and exact runnable /26 versus /24 negative CIDR example.");
