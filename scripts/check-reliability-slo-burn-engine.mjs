import assert from "node:assert/strict";
import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
const root="labs/reliability-slo-burn";
const rules=readFileSync(join(root,"steward-burn.rules.yml"),"utf8");
const tests=readFileSync(join(root,"steward-burn.test.yml"),"utf8");
const teaching=readFileSync("packages/runtime-kernel/src/paths/reliability-slo-burn-engine-depth.ts","utf8");
const service=readFileSync("packages/runtime-kernel/src/paths/reliability-service-level-engineering-deep.ts","utf8");
function published(name){
  const p="export const "+name+" = ";
  const line=teaching.split("\n").find(x=>x.startsWith(p));
  assert.ok(line && line.endsWith(";"),"Missing exact source: "+name);
  return JSON.parse(line.slice(p.length,-1));
}
assert.equal(published("burnRateRulesYaml"),rules,
  "Learner-visible burn-rate rules are not byte-identical to official promtool input");
assert.equal(published("burnRateTestYaml"),tests,
  "Learner-visible burn-rate tests are not byte-identical to official promtool input");
for(const value of [
  'record: steward:slo_registration_error_ratio:rate1h',
  'record: steward:slo_registration_error_ratio:rate5m',
  'alert: StewardRegistrationFastBudgetBurn',
  'and on(job)',
  'rate5m > 0.1',
  'status_class="5xx"',
  'for: 2m',
  'severity: ticket',
  'evidence: synthetic'
]) assert.ok(rules.includes(value),"Burn rate policy missing: "+value);
assert.ok(!rules.includes("or vector(0)") && !rules.includes("severity: page"),
 "Never claim missing telemetry is healthy or authorize a production page");
for(const name of [
 "sustained_two_percent_failure_fires_after_both_windows",
 "healthy_half_percent_does_not_exceed_fourteen_point_four_burn",
 "stale_long_window_after_healthy_recovery_does_not_fire",
 "new_short_spike_without_long_budget_impact_does_not_fire",
 "tiny_population_cannot_authorize_incident_page",
 "initialized_zero_traffic_is_unknown_not_green",
 "absent_metrics_are_unknown_not_a_pass"
]) assert.ok(tests.includes("name: "+name),"Missing concrete official promtool scenario: "+name);
assert.ok(service.includes('id: "service-level-engineering-windowing-promtool-burn-rate-reading"') &&
          service.includes('blocks: sloBurnRateEngineBlocks'),
          "New first-principles multiwindow reading not in the learner's actual path");
for(const original of ["-001","-002","-003"]){
 assert.ok(service.includes("service-level-engineering-${spec.id}"+original),
  "Original Service-Level progress ID missing: "+original);
}
for(const required of [
 "Falsify AND-to-OR","official promtool check rules",
 "zero traffic is a 'healthy'","stationary traffic"
])assert.ok(service.includes(required),"Original practical lacks falsifiable burn-rate transfer: "+required);
const mutations=[
 ["wrong-or-window", s=>s.replace(
   'and on(job) (steward:slo_registration_error_ratio:rate5m',
   'or on(job) (steward:slo_registration_error_ratio:rate5m')],
 ["wrong-error-numerator",s=>s.replaceAll('status_class="5xx"','status_class=~"2xx|5xx"')],
 ["removed-traffic-floor",s=>s.replace('steward:slo_registration_requests:rate5m > 0.1',
   'steward:slo_registration_requests:rate5m > 0.0')]
];
for(const [name,transform] of mutations){
 const m=transform(rules);
 assert.notEqual(m,rules,"Invalid mutant did not change a real Prometheus expression: "+name);
 assert.ok(m.includes("alert: StewardRegistrationFastBudgetBurn"),"Mutation removed the alert");
}
if(process.argv[2]==="--emit-mutants"){
 assert.ok(process.argv[3],"Provide an isolated temporary output root");
 for(const [name,transform] of mutations){
  const out=join(process.argv[3],name);
  mkdirSync(out,{recursive:true});
  writeFileSync(join(out,"steward-burn.rules.yml"),transform(rules));
  writeFileSync(join(out,"steward-burn.test.yml"),tests);
 }
 console.log("PASS generated 3 faulty burn-rate rule variants with unchanged official test expectations");
}else{
 console.log("PASS exact displayed SLO burn YAML, original progress IDs and 7 real Prometheus scenarios guarded");
}
