import assert from "node:assert/strict";
import fs from "node:fs";
import {spawnSync} from "node:child_process";
const root="packages/runtime-kernel/src/paths/";
const source=fs.readFileSync(root+"platform-builder-packet-tracer-worked.ts","utf8");
const entry=fs.readFileSync(root+"platform-builder-packet-tracer-network-engineering-deep.ts","utf8");
const homelab=fs.readFileSync(root+"platform-builder-budget-homelab-deep.ts","utf8");
const homelabQuality=fs.readFileSync(root+"platform-builder-budget-homelab-quality.ts","utf8");
const from=source.indexOf(" = ",source.indexOf("export const packetTracerWorkedTeaching"));
const to=source.indexOf(";\nexport const packetTracerWorkedResources",from);
assert.ok(from>0&&to>from,"Missing Packet Tracer specific authored source");
const cases=JSON.parse(source.slice(from+3,to));
const expected=["IPv4 Subnetting and VLSM","Inter-VLAN Routing and Default Gateways","DHCP, Relay and NAT/PAT","IPv6 Addressing and Routing Fundamentals","Capstone: Enterprise Branch Network"];
assert.deepEqual(Object.keys(cases),expected);
for(const [name,sections] of Object.entries(cases)){
  assert.equal(sections.length,2,"Expected scoped two-stage teaching, not generic appendix: "+name);
  assert.ok(entry.includes('"'+name+'"'),"No existing Packet Tracer lesson "+name);
  assert.ok(entry.includes("packetTracerWorkedTeaching[title]"),"Actual lesson renderer missing authored teaching");
  assert.ok(sections.every(x=>x.paragraphs.length===2&&x.paragraphs.every(y=>y.length>220)),"Missing worked sequence or counterexample "+name);
}
const lab=cases["IPv4 Subnetting and VLSM"][0].code;
assert.equal(lab.language,"python");
const run=spawnSync("python3",["-c",lab.code],{encoding:"utf8",timeout:12000});
assert.ifError(run.error);
assert.equal(run.status,0,"Published VLSM program failed:\n"+run.stdout+"\n"+run.stderr);
for(const expected of [
  "users: 192.168.80.0/26 usable=62",
  "servers: 192.168.80.64/27 usable=30",
  "management: 192.168.80.96/28 usable=14",
  "transit: 192.168.80.112/30 usable=2",
  "wrong /27 for 60 users: rejected",
  "server gateway .65 is on-link: True"
])assert.ok(run.stdout.includes(expected),"Missing VLSM observation "+expected);
assert.ok(!/normalizeEnterpriseBaseline|replaceAll\("Tailscale"/.test(homelabQuality),"Blanket homelab text mutation returned");
assert.ok(!/\bconst ubuntu\b|\bconst tailscale\b|Tailscale documentation/.test(homelab),"Homelab source diverged from intended Rocky Linux and WireGuard");
assert.ok(homelab.includes("WireGuard documentation")&&homelab.includes("Rocky Linux documentation"));
console.log("Platform Builder Packet Tracer and homelab authored-source proof passed: 5 taught lab traces, actual 4-subnet VLSM negative, direct Rocky/WireGuard references.");