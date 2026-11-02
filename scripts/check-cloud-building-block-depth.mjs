import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const src=readFileSync("packages/runtime-kernel/src/paths/cloud-building-blocks-source-depth.ts","utf8");
const wired=readFileSync("packages/runtime-kernel/src/paths/cloud-building-blocks-deep.ts","utf8");
const vps=readFileSync("packages/runtime-kernel/src/paths/cloud-vps-operations-quality.ts","utf8");
const entry=readFileSync("packages/runtime-kernel/src/paths/cloud-engineer.ts","utf8");
assert.ok(wired.includes("...(buildingBlockDepthById[spec.id] ?? [])"),"Actual Building Blocks readings must contain the authored deeper sections");
const match=src.match(/export const buildingBlockDepthById:[^\n]+ = (\{[\s\S]*\});\s*$/);
assert.ok(match,"Cannot read source-authored Building Blocks sections");
const blocks=JSON.parse(match[1]);
const expected=["compute","object-storage","block-storage","managed-databases","virtual-networks-subnets","routing-gateways","load-balancers","iam","secrets-management","cloud-monitoring","cloud-backup-services","managed-vs-self-managed"];
assert.deepEqual(Object.keys(blocks).sort(),expected.sort());
for(const [topic,sections] of Object.entries(blocks)){
  assert.ok(sections.length>=2,topic+" missing explanatory worked/failure context");
  assert.ok(sections.every(x=>x.heading&&x.paragraphs?.length && x.paragraphs.join(" ").length>=120),topic+" too shallow");
  assert.ok(sections.some(x=>/transfer|failure/i.test(x.heading+" "+x.paragraphs.join(" "))),topic+" missing independent failure reasoning");
}
const model=blocks["virtual-networks-subnets"].find(x=>x.code?.language==="python")?.code?.code;
assert.ok(model,"No source-published CIDR experiment");
const run=spawnSync("python3",["-c",model],{encoding:"utf8",timeout:12000});
assert.ifError(run.error);assert.equal(run.status,0,run.stderr);assert.match(run.stdout,/CIDR topology disjoint: True/);
assert.ok(!vps.includes("sudo dnf upgrade --refresh"),"VPS lesson must not silently upgrade the OS while inspecting patches");
assert.ok(!vps.includes("alignRockyLinux"),"VPS overlay must preserve original concept-first OS patch reading");
assert.ok(!entry.includes("teachCloudPath")&&!entry.includes("-cloud-preparation")&&!entry.includes("-operational-model"),"Cloud path must not insert generated filler");
console.log("PASS all 12 real Building Blocks depth sections, executable CIDR proof, and no destructive VPS inspection/wrapper regressions.");
