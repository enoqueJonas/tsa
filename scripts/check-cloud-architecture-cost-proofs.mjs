import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const root="packages/runtime-kernel/src/paths/";
const original=readFileSync(root+"cloud-architecture-cost-deep.ts","utf8");
const quality=readFileSync(root+"cloud-architecture-cost-quality.ts","utf8");
const overlay=readFileSync(root+"cloud-architecture-cost-mechanisms.ts","utf8");
const published=readFileSync(root+"cloud-architecture-capacity-real-proof.ts","utf8");
const m=published.match(/export const cloudArchitectureCostCapacityPython = ("(?:\\.|[^"\\])*");/);
assert.ok(m,"Missing exact copyable architecture model");
const python=JSON.parse(m[1]);
function parse(name,next){
 const from=overlay.indexOf("export const "+name);
 const to=next?overlay.indexOf("\nexport const "+next,from):overlay.length;
 assert.ok(from>=0 && to>from,"Missing architecture overlay "+name);
 return JSON.parse(overlay.slice(overlay.indexOf("=",from)+1,to).trim().replace(/;$/,""));
}
const sections=parse("cloudArchitectureMechanisms","cloudArchitecturePracticeEvidence");
const practices=parse("cloudArchitecturePracticeEvidence");
const expected=[
 "availability","scalability-capacity","resilience-dependency-failure",
 "security-boundaries","backup-recovery","failure-domains",
 "cost-estimation","cost-allocation-unit-economics",
 "cost-controls-budgets","right-sizing","managed-self-managed","hybrid-tradeoffs"
];
const specs=original.split("const specs: LessonSpec[] = [")[1]?.split("\n];")[0];
assert.ok(specs,"Original 12 architecture specs lost");
assert.deepEqual([...specs.matchAll(/^\s*\{\s*id:\s*"([^"]+)",\s*title:/gm)].map(x=>x[1]),
 expected,"Original twelve architecture/cost IDs or order changed");
for(const id of ["001","002","003","004"])
 assert.ok(original.includes('id: "cloud-architecture-and-cost-review-steward-'+id+'"'),
  "Original final Architecture Review milestone ID missing "+id);
assert.deepEqual(Object.keys(sections),expected,"Missing architecture topic mechanism");
assert.deepEqual(Object.keys(practices),expected,"Missing original applied evidence");
let count=0;
for(const topic of expected){
 assert.ok(sections[topic].length>=2,"Shallow or overloaded: "+topic);
 for(const part of sections[topic]){
  assert.ok(part.heading.length>=30);
  assert.ok(part.paragraphs.length===2 && part.paragraphs.every(p=>p.length>=350),
   "Mechanism / failure / limit incomplete "+topic);
  count++;
 }
 assert.ok(practices[topic].length>=2);
}
assert.ok(count>=24);
assert.ok(original.includes("cloudArchitectureMechanisms[spec.id]"));
assert.ok(original.includes("code: cloudArchitectureCostCapacityPython"));
assert.ok(quality.includes('cloudArchitecturePracticeEvidence[lesson.id.slice("cloud-architecture-and-cost-".length)]'));
for(const marker of [
 "ARCH_SYNTHETIC_CAPACITY_REPLICAS_2_TO_5_NODES_2_TO_4",
 "ARCH_SYNTHETIC_CLOUD_BASE_131_40_BURST_48H_168_76_FULL_213_60",
 "ARCH_SYNTHETIC_VPS_35_40_WITH_UNPROVEN_BURST_CAPACITY",
 "ARCH_SYNTHETIC_BUDGET_160_EXCEEDED_BY_8_76_AFTER_BURST",
 "ARCH_SYNTHETIC_UNIT_COST_REQUIRES_SUCCESSFUL_OPERATION_DENOMINATOR",
 "ARCH_SYNTHETIC_RATE_SENSITIVITY_REQUIRES_HEADROOM",
 "ARCH_SYNTHETIC_MANAGED_VS_SELF_LABOR_THRESHOLD",
 "ARCH_SYNTHETIC_SERVICE_SLO_99_9_BUDGET_43_80_MINUTES",
 "ARCH_NOT_LIVE_PROVIDER_QUOTES_BENCHMARK_OR_RECOVERY_PROOF"])
 assert.ok(python.includes(marker),"Missing evidence boundary "+marker);
assert.ok(python.includes("Decimal") && python.includes("ROUND_CEILING") &&
 python.includes('D("730")') && python.includes("REQUIRED"),
 "Missing precise arithmetic, timeframe or billed dimension control");
console.log("PASS original twelve topics and four milestone IDs, "+
 count+" mechanism/failure sections, original applied evidence and exact Python source");

function run(source,label,positive){
 const x=spawnSync("python3",["-c",source],{
  encoding:"utf8",timeout:18000,maxBuffer:2*1024*1024,
  env:{...process.env,PYTHONDONTWRITEBYTECODE:"1"}
 });
 assert.ok(!x.error,label+" failed to spawn or timed out: "+String(x.error));
 if(positive){
  assert.equal(x.status,0,label+"\nstdout:\n"+x.stdout+"\nstderr:\n"+x.stderr);
  for(const marker of [
   "ARCH_SYNTHETIC_CAPACITY_REPLICAS_2_TO_5_NODES_2_TO_4",
   "ARCH_SYNTHETIC_CLOUD_BASE_131_40_BURST_48H_168_76_FULL_213_60",
   "ARCH_SYNTHETIC_VPS_35_40_WITH_UNPROVEN_BURST_CAPACITY",
   "ARCH_SYNTHETIC_BUDGET_160_EXCEEDED_BY_8_76_AFTER_BURST",
   "ARCH_SYNTHETIC_UNIT_COST_REQUIRES_SUCCESSFUL_OPERATION_DENOMINATOR",
   "ARCH_SYNTHETIC_RATE_SENSITIVITY_REQUIRES_HEADROOM",
   "ARCH_SYNTHETIC_MANAGED_VS_SELF_LABOR_THRESHOLD",
   "ARCH_SYNTHETIC_SERVICE_SLO_99_9_BUDGET_43_80_MINUTES",
   "ARCH_NOT_LIVE_PROVIDER_QUOTES_BENCHMARK_OR_RECOVERY_PROOF"])
   assert.ok(x.stdout.includes(marker),label+" omitted "+marker);
 }else{
  assert.notEqual(x.status,0,"Unsafe architecture scenario unexpectedly passed: "+label);
  assert.match(x.stderr,/AssertionError/,label+
   " did not fail the intended decision assertion:\n"+x.stderr);
 }
 console.log("PASS "+label+" status="+x.status);
}
run(python,"exact synthetic architecture capacity, node-hours, cost/budget, sensitivity, unit economics and SLO",true);
const mutants=[
 ["48h burst incorrectly charged as full month",
  "node_hours = D(normal) * HOURS + D(peak - normal) * D(demand.burst_hours)",
  "node_hours = D(peak) * HOURS"],
 ["gateway cost silently omitted",
  '"gateway": money(rates.gateway_month if cluster else D("0"))',
  '"gateway": money(D("0"))'],
 ["managed database incorrectly billed free",
  '"managed_database": money(rates.db_month if cluster else D("0"))',
  '"managed_database": money(D("0"))'],
 ["outbound traffic silently included for free",
  'excess_egress_per_gib: Decimal = D("0.10")',
  'excess_egress_per_gib: Decimal = D("0.00")'],
 ["wrong single-VM peak throughput accepted by capacity solver",
  'return ceil_decimal(D(qps) / (D("32") * D("0.60")))',
  'return ceil_decimal(D(qps) / (D("320") * D("0.60")))'],
 ["budget raised to hide the surge breach",
  'budget = D("160.00")','budget = D("250.00")'],
 ["successful monthly operations overcounted",
  'successful_operations=897300','successful_operations=1500000'],
 ["operations labor assumed free",
  'hourly_engineering = D("18")','hourly_engineering = D("0")'],
 ["99.9 percent error-budget month miscomputed",
  'month_minutes = D("730") * D("60")','month_minutes = D("730") * D("6")']
];
for(const [label,needle,bad] of mutants){
 assert.ok(python.includes(needle),"Unsafe mutation source location moved: "+label);
 run(python.replace(needle,bad),"rejected architecture/cost mutant: "+label,false);
}
console.log("PASS nine deliberate arithmetic/approval mutants; neither live provider prices nor measured Steward workload were used");
