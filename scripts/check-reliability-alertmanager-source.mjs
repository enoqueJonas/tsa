import assert from "node:assert/strict";
import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";

const configPath="labs/reliability-alertmanager/alertmanager.yml.template";
const scriptPath="scripts/check-reliability-alertmanager-runtime.py";
const tsPath="packages/runtime-kernel/src/paths/reliability-alertmanager-real-runtime.ts";
const lessonPath="packages/runtime-kernel/src/paths/reliability-alertmanager-implementation-deep.ts";
const config=readFileSync(configPath,"utf8");
const python=readFileSync(scriptPath,"utf8");
const ts=readFileSync(tsPath,"utf8");
const lesson=readFileSync(lessonPath,"utf8");
const forwardingPath="scripts/check-reliability-prometheus-to-alertmanager.py";
const forwardingText=readFileSync(forwardingPath,"utf8");
const forwardingSource=readFileSync("packages/runtime-kernel/src/paths/reliability-prometheus-to-alertmanager-proof.ts","utf8");


function published(name){
 const p="export const "+name+" = ";
 const line=ts.split("\n").find(l=>l.startsWith(p));
 assert.ok(line && line.endsWith(";"),"Missing exactly authored source "+name);
 return JSON.parse(line.slice(p.length,-1));
}
assert.equal(published("alertmanagerLocalConfigTemplate"),config,
 "Learner-displayed routing configuration differs from actual Alertmanager input");
assert.equal(published("alertmanagerLocalRuntimePython"),python,
 "Learner-displayed Python runner differs from executed actual Alertmanager program");
const prefix="export const prometheusToAlertmanagerPython = ";
const publishedLine=forwardingSource.split("\\n").find(line=>line.startsWith(prefix));
assert.ok(publishedLine && publishedLine.endsWith(";"),"Real Prometheus forwarded source missing from learner reading");
assert.equal(JSON.parse(publishedLine.slice(prefix.length,-1)),forwardingText,
  "Actual Prometheus-to-Alertmanager runtime differs from copyable learner source");
for(const required of ["PROMETHEUS_TO_ALERTMANAGER_TO_WEBHOOK_FIRING_PASS",
 "PROMETHEUS_TO_ALERTMANAGER_TO_WEBHOOK_RESOLVED_PASS",
 "PROMETHEUS_FORWARDING_BASELINE_PASS",
 'TSA_FORWARD_RULE_VARIANT', "REAL_PROMETHEUS_SCRAPE_PASS"]){
 assert.ok(forwardingText.includes(required),"Real forwarding coverage missing: "+required);
}
assert.ok(lesson.includes("blocks: prometheusToAlertmanagerBlocks"),
 "New source is not wired to original Alertmanager learning path");

for(const required of [
 'group_by: [\'service\', \'environment\', \'team\']',
 'group_wait: 2s','group_interval: 5s','repeat_interval: 30s',
 'team="reliability"','team="security"','alertname="DatabaseDown"',
 'alertname="ApiDependencyFailed"','__RECEIVER_PORT__',
 '127.0.0.1','send_resolved: true'
])assert.ok(config.includes(required),"Missing source Alertmanager safety contract: "+required);
assert.ok(!config.includes("pagerduty_configs") &&
          !config.includes("smtp_smarthost") &&
          !config.includes("http://0.0.0.0") &&
          !config.includes("https://"),"Disposable lab accidentally routes externally");
for(const phrase of [
 "REAL_ALERTMANAGER_GROUP_PASS",
 "REAL_ALERTMANAGER_DEDUP_PASS",
 "REAL_ALERTMANAGER_ROUTE_PASS",
 "REAL_ALERTMANAGER_FALLBACK_PASS",
 "REAL_ALERTMANAGER_INHIBIT_PASS",
 "REAL_ALERTMANAGER_503_PASS",
 "REAL_ALERTMANAGER_RECOVERY_PASS",
 "REAL_ALERTMANAGER_RESOLVED_PASS",
 "REAL_ALERTMANAGER_API_BOUNDARY_ONLY"
]) assert.ok(python.includes(phrase),"Actual runtime case absent: "+phrase);
const ids=[
 "reliability-alertmanager-implementation-001",
 "reliability-alertmanager-implementation-route-mechanics-reading",
 "reliability-alertmanager-implementation-live-delivery-reading",
 "reliability-alertmanager-implementation-prometheus-forwarding-reading",
 "reliability-alertmanager-implementation-002",
 "reliability-alertmanager-implementation-003",
 "reliability-alertmanager-implementation-004"
];
let previous=-1;
for(const id of ids){
 const i=lesson.indexOf('id: "'+id+'"');
 assert.ok(i>previous,"Original Alertmanager activity IDs changed or focused readings out of order: "+id);
 previous=i;
}
assert.ok(lesson.includes("blocks: alertmanagerRouteFocusedBlocks") &&
          lesson.includes("blocks: alertmanagerRuntimeFocusedBlocks"),
 "Real Alertmanager source is not attached to the learner's original path");
assert.ok(lesson.includes("actual HTTP 503 attempts") &&
          lesson.includes("real Prometheus-to-Alertmanager transport"),
 "Original practices fail to distinguish real notification from missing transport");
const mutants=[
 ["broken-grouping", "group_by: ['service', 'environment', 'team']",
   "group_by: ['service', 'environment', 'team', 'alertname']"],
 ["wrong-security-route", 'team="security"', 'team="nobody"'],
 ["missing-parent-inhibition", 'alertname="DatabaseDown"', 'alertname="NotDatabaseDown"'],
 ["wrong-reliability-route", 'team="reliability"', 'team="elsewhere"']
];
for(const [label,before,after] of mutants){
 assert.ok(config.includes(before),"Missing real config mutation anchor "+label);
 assert.notEqual(config.replace(before,after),config,"Mutation does not change source: "+label);
}
if(process.argv[2]==="--emit-mutants"){
 assert.ok(process.argv[3],"An isolated temporary output root is required");
 for(const [label,before,after] of mutants){
  const dest=join(process.argv[3],label);
  mkdirSync(dest,{recursive:true});
  writeFileSync(join(dest,"alertmanager.yml.template"),config.replace(before,after));
 }
 console.log("PASS emitted four wrong-source Alertmanager YAML fixtures for real container rejection");
}else{
 console.log("PASS Alertmanager learner YAML + Python exactly match executed files, all original progress IDs preserved, four wrong-source mutants available");
}
