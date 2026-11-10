import assert from "node:assert/strict";
import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
const lab="labs/reliability-prometheus-rules";
const rules=readFileSync(join(lab,"steward.rules.yml"),"utf8");
const tests=readFileSync(join(lab,"steward.test.yml"),"utf8");
const teaching=readFileSync("packages/runtime-kernel/src/paths/reliability-prometheus-rule-engine-depth.ts","utf8");
const metrics=readFileSync("packages/runtime-kernel/src/paths/reliability-metrics-prometheus-grafana-deep.ts","utf8");
const alerts=readFileSync("packages/runtime-kernel/src/paths/reliability-alerting-on-call-deep.ts","utf8");
const alertSource=readFileSync("packages/runtime-kernel/src/paths/reliability-actionable-alerts-depth.ts","utf8");
function published(name){
 const prefix="export const "+name+" = ";
 const line=teaching.split("\n").find(x=>x.startsWith(prefix));
 assert.ok(line && line.endsWith(";"),"Cannot extract authored YAML: "+name);
 return JSON.parse(line.slice(prefix.length,-1));
}
assert.equal(published("recordedStewardRulesYaml"),rules,"Published rule source diverged from executed fixture");
assert.equal(published("testedStewardRulesYaml"),tests,"Published promtool tests diverged from executed fixture");
for(const r of ["steward:registration_requests:rate5m","steward:registration_errors:rate5m","steward:registration_error_ratio:rate5m"]) assert.ok(rules.includes("record: "+r),r);
for(const a of ["StewardRegistrationElevatedErrors","StewardMetricsScrapeFailed","StewardMetricsTargetMissing"]){assert.ok(rules.includes("alert: "+a),a);assert.ok(tests.includes("alertname: "+a),a);}
for(const x of ["status_class=\"5xx\"","sum by (route) (rate(","for: 2m","absent_over_time(up{job=\"steward-api\"}[5m])","up{job=\"steward-api\"} == 0","and on(route)","severity: ticket"]) assert.ok(rules.includes(x),x);
assert.ok(!rules.includes("or vector(0)"),"Missing observations must not become green zero");
assert.ok(metrics.includes("metrics-prometheus-grafana-recording-rules-promtool-reading") && metrics.includes("blocks: recordingRulesEngineBlocks"),"Focused recording lesson is not rendered");
assert.ok(metrics.includes("metrics-prometheus-grafana-"+String.fromCharCode(36)+"{spec.id}-001") && metrics.includes("metrics-prometheus-grafana-"+String.fromCharCode(36)+"{spec.id}-002") && metrics.includes("metrics-prometheus-grafana-"+String.fromCharCode(36)+"{spec.id}-003"),"Original progress IDs lost");
assert.ok(alerts.includes('spec.id === "actionable-alerts" ? actionableAlertEngineBlocks : []') && alerts.includes("LIVE_ALERT_DELIVERY_UNVERIFIED"),"Original actionable-alert source not wired or misclaims notification");
for(const t of ["pending","firing","up=0","absent_over_time"])assert.ok(alertSource.toLowerCase().includes(t.toLowerCase()),"Missing mechanism: "+t);
for(const n of ["healthy_then_sustained_user_errors","initialized_zero_counters_no_traffic","configured_target_scrape_fails","brief_scrape_failure_does_not_fire","entirely_absent_expected_target"]) assert.ok(tests.includes("name: "+n),"Absent promtool case: "+n);
const mutants=[
 ["wrong-scrape-outcome",'up{job="steward-api"} == 0','up{job="steward-api"} == 1'],
 ["wrong-user-error-numerator",'status_class="5xx"','status_class=~"2xx|5xx"'],
 ["missing-target-conflation",'absent_over_time(up{job="steward-api"}[5m])','up{job="steward-api"} == 0']
];
for(const [name,before,after] of mutants){assert.ok(rules.includes(before),"No mutant anchor: "+name);assert.notEqual(rules.replace(before,after),rules,"Unchanged mutant: "+name);}
if(process.argv[2]==="--emit-mutants"){
 assert.ok(process.argv[3],"Need isolated output directory");
 for(const [name,before,after] of mutants){const dest=join(process.argv[3],name);mkdirSync(dest,{recursive:true});writeFileSync(join(dest,"steward.rules.yml"),rules.replace(before,after));writeFileSync(join(dest,"steward.test.yml"),tests);}
 console.log("PASS generated three wrong-rule fixtures for real promtool rejection");
}else console.log("PASS lesson rule/test YAML matches source fixture; engine verified in separate job");
