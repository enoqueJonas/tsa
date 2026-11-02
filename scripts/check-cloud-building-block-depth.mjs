import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const src=readFileSync("packages/runtime-kernel/src/paths/cloud-building-blocks-source-depth.ts","utf8");
const wired=readFileSync("packages/runtime-kernel/src/paths/cloud-building-blocks-deep.ts","utf8");
const vps=readFileSync("packages/runtime-kernel/src/paths/cloud-vps-operations-quality.ts","utf8");
const vpsSource=readFileSync("packages/runtime-kernel/src/paths/cloud-vps-operations-deep.ts","utf8");
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
assert.ok(vpsSource.includes("case") && vpsSource.includes("check_status") && vpsSource.includes("rocky|rhel|almalinux"),"Actual learner patch commands must dispatch safely by identified OS");
assert.ok(!vpsSource.includes("sudo dnf upgrade --refresh"),"Actual learner patch inspection must not include an upgrade command");
assert.ok(!vps.includes("alignRockyLinux"),"VPS overlay must preserve original concept-first OS patch reading");
assert.ok(!entry.includes("teachCloudPath")&&!entry.includes("-cloud-preparation")&&!entry.includes("-operational-model"),"Cloud path must not insert generated filler");
const iacSrc=readFileSync("packages/runtime-kernel/src/paths/cloud-iac-local-proof.ts","utf8");
const iacWired=readFileSync("packages/runtime-kernel/src/paths/cloud-infrastructure-as-code-deep.ts","utf8");
assert.ok(iacWired.includes("...(iacDepthById[spec.id] ?? [])"),"Actual IaC readings must expose providerless worked examples");
const iacMatch=iacSrc.match(/export const iacDepthById:[^\n]+ = (\{[\s\S]*\});\s*$/);
assert.ok(iacMatch,"IaC authored source map is malformed");
const iac=JSON.parse(iacMatch[1]);
const expectedIaC=["terraform-opentofu-fundamentals","state","plan-apply-lifecycle","drift","import-adoption-refactoring"];
assert.deepEqual(Object.keys(iac).sort(),expectedIaC.sort());
const tofuLab=iac["terraform-opentofu-fundamentals"].find(x=>x.code?.language==="bash")?.code?.code;
assert.ok(tofuLab && tofuLab.includes('command -v tofu') && tofuLab.includes('resource "terraform_data" "release"'));
assert.ok(tofuLab.includes("tofu plan -input=false -out=reviewed.tfplan"));
assert.ok(tofuLab.includes("tofu apply -input=false reviewed.tfplan"));
assert.ok(tofuLab.includes("tofu plan -input=false -detailed-exitcode"));
assert.ok(tofuLab.includes("tofu destroy -auto-approve"));
assert.ok(tofuLab.includes("mktemp -d"),"Providerless IaC lab must not run in actual project directory");
assert.ok(!tofuLab.includes("aws_")&&!tofuLab.includes("azurerm_"),"Providerless example cannot create paid cloud resources");
const costSrc=readFileSync("packages/runtime-kernel/src/paths/cloud-architecture-worked-proof.ts","utf8");
const costWired=readFileSync("packages/runtime-kernel/src/paths/cloud-architecture-cost-deep.ts","utf8");
assert.ok(costWired.includes("...(architectureDepthById[spec.id] ?? [])"),"Actual Cloud Architecture readings not wired");
const costMatch=costSrc.match(/export const architectureDepthById:[^\n]+ = (\{[\s\S]*\});\s*$/);
assert.ok(costMatch,"Architecture source map malformed");
const cost=JSON.parse(costMatch[1]);
const costIds=["availability","backup-recovery","failure-domains","cost-estimation","cost-controls-budgets","right-sizing"];
assert.deepEqual(Object.keys(cost).sort(),costIds.sort());
for (const [id,rows] of Object.entries(cost)) {
  assert.ok(rows.length>=2&&rows.some(x=>/transfer|failure/i.test(x.heading)),"Missing independent cost/failure exercise for "+id);
}
for (const [id,expectation] of [
  ["availability",/99\.90% allows 43\.80 minutes\/month/],
  ["cost-estimation",/total=30\.85/],
]) {
 const model=cost[id].find(x=>x.code?.language==="python")?.code?.code;
 assert.ok(model,"Missing source-published Python proof for "+id);
 const output=spawnSync("python3",["-c",model],{encoding:"utf8",timeout:12000});
 assert.ifError(output.error);assert.equal(output.status,0,id+": "+output.stderr);
 assert.match(output.stdout,expectation);
}
console.log("PASS Cloud Building Blocks (12), IaC (5), architecture (6), executable local CIDR/cost/SLO proofs; cloud/Tofu runtime remains UNVERIFIED.");
