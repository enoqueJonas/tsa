import assert from "node:assert/strict";
import fs from "node:fs";
import {spawnSync} from "node:child_process";
const root="packages/runtime-kernel/src/paths/";
const worked=fs.readFileSync(root+"platform-builder-budget-homelab-worked.ts","utf8");
const deep=fs.readFileSync(root+"platform-builder-budget-homelab-deep.ts","utf8");
const quality=fs.readFileSync(root+"platform-builder-budget-homelab-quality.ts","utf8");
const marker="export const budgetHomelabWorkedSections:";
const start=worked.indexOf(" = ",worked.indexOf(marker));
const end=worked.lastIndexOf(";\n");
assert.ok(start>=0&&end>start,"Missing authored homelab sections");
const cases=JSON.parse(worked.slice(start+3,end));
const readings=[...deep.matchAll(/\breading\("([^"]+)",\s*"([^"]+)"/g)].map(x=>x[2]);
assert.equal(readings.length,16,"Wrong budget module lesson count");
assert.deepEqual(Object.keys(cases),readings,"Any authored reading without relevant mechanism");
assert.ok(deep.includes("budgetHomelabWorkedSections[title]"),"Worked sections not included in rendered readings");
for(const [title,sections] of Object.entries(cases)){
 assert.equal(sections.length,2,"Expected two focused mechanisms: "+title);
 for(const section of sections){
  assert.ok(section.heading.length>15&&section.body.length>280,"Insufficient mechanism and failure comparison: "+title);
 }
}
assert.ok(!quality.includes("normalizeEnterpriseBaseline"),"Recursive vendor/distro string rewrite returned");
const code=cases["CPU, RAM, Storage and NIC Trade-offs"][0].code;
assert.equal(code.language,"python");
const result=spawnSync("python3",["-c",code.code],{encoding:"utf8",timeout:10000});
assert.ifError(result.error);
assert.equal(result.status,0,"Published safe capacity lab failed:\n"+result.stdout+"\n"+result.stderr);
for(const expected of ["host total: 16 GiB","unallocated headroom: 2 GiB","proposed extra 4 GiB VM: exceeds 16 GiB host budget","single physical host independent failure domains: 1"])
 assert.ok(result.stdout.includes(expected),"Missing capacity observation: "+expected);
console.log("Platform Builder budget homelab authored examples passed: 16 targeted lessons, real capacity-refusal sample, no runtime vendor/distro rewrites.");