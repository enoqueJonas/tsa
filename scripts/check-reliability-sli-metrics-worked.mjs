import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const original=readFileSync("packages/runtime-kernel/src/paths/reliability-sli-metrics-worked.ts","utf8");
for (const [path,call] of [["reliability-service-level-engineering-deep.ts","extraSliBlocks"],["reliability-metrics-prometheus-grafana-deep.ts","extraMetricsBlocks"]]) {
  const source=readFileSync("packages/runtime-kernel/src/paths/"+path,"utf8");
  assert.ok(source.includes("..."+call+"(spec.id)"),"Source reading must wire "+call);
}
function getMap(name){
  const begin="export const "+name+": Record<string,WorkedSection[]> = ";
  const pos=original.indexOf(begin);
  assert.ok(pos>=0,"Missing source map "+name);
  const next=name==="sliDepthById" ? ";\nexport const metricDepthById:" : ";\nfunction addSections";
  const stop=original.indexOf(next,pos+begin.length);
  assert.ok(stop>pos,"Cannot delimit authored map "+name);
  return JSON.parse(original.slice(pos+begin.length,stop));
}
const sli=getMap("sliDepthById"), metrics=getMap("metricDepthById");
assert.deepEqual(Object.keys(sli).sort(),["slis","error-budgets","windowing","burn-rate-alerting"].sort());
assert.deepEqual(Object.keys(metrics).sort(),["promql","metric-types","dashboard-antipatterns"].sort());
const expectations=[
[sli.slis,"valid=5 good=3 bad=2 SLI=60.00%"],
[sli["error-budgets"],"allowed_bad=10 actual_bad=12 burn=1.20x"],
[metrics["metric-types"],"per-bucket counts: [1, 2, 1, 1]"],
[metrics.promql,"server-side evaluation: UNVERIFIED"]
];
for (const [sections,expected] of expectations){
  const code=sections.find(s=>s.code?.language==="python")?.code.code;
  assert.ok(code,"Missing source-executable worked example");
  const out=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:12000});
  assert.ifError(out.error);assert.equal(out.status,0,out.stderr);
  assert.ok(out.stdout.includes(expected),"Unexpected source example result "+out.stdout);
}
assert.ok(metrics.promql.some(s=>s.paragraphs.join(" ").includes("missing")),"Missing-data semantics need explicit teaching");
// Independently exercise the exact new code block published inside three ORIGINAL Service Level lessons.
const originalService = readFileSync("packages/runtime-kernel/src/paths/reliability-service-level-engineering-deep.ts","utf8");
assert.ok(originalService.includes("...serviceLevelLifecycleBlocks(spec.id)"), "Lifecycle source must render in original Service Level reading ID");
for (const phrase of ["Change b's consumer completion", "Change as_of from 120 to 75", "0.4 permitted failure count"]) {
  assert.ok(originalService.includes(phrase), "Paired original practical missing proof task: "+phrase);
}
const lifecycleText=readFileSync("packages/runtime-kernel/src/paths/reliability-service-level-lifecycle-evidence.ts","utf8");
const prefix="export const serviceLevelLifecycleEvidenceById: Record<string,EvidenceSection[]> = ";
const pos=lifecycleText.indexOf(prefix);
const stop=lifecycleText.indexOf(";\nexport function serviceLevelLifecycleBlocks",pos);
assert.ok(pos>=0 && stop>pos,"Cannot extract original lifecycle teaching source map");
const lifecycle=JSON.parse(lifecycleText.slice(pos+prefix.length,stop));
assert.deepEqual(Object.keys(lifecycle).sort(),["slis","error-budgets","windowing"].sort());
for (const topic of Object.keys(lifecycle)) {
  assert.ok(lifecycle[topic].length>=1 && lifecycle[topic].flatMap(s=>s.paragraphs).join(" ").length>=850,"Topic-specific teaching missing: "+topic);
}
const originalProgram=lifecycle.slis.find(s=>s.code?.language==="python")?.code?.code;
assert.ok(originalProgram,"Original SLIs reading must contain Python 3 durable cohort source");
for (const guard of ["sqlite3.connect(location)", "LEFT JOIN effects AS e", "db.commit()", "TemporaryDirectory"]) {
  assert.ok(originalProgram.includes(guard),"Runnable lifecycle source is missing: "+guard);
}
function runPython(source) {
  const out=spawnSync("python3",["-c",source],{encoding:"utf8",timeout:12000});
  assert.ifError(out.error);
  return out;
}
const accepted=runPython(originalProgram);
assert.equal(accepted.status,0,accepted.stderr);
for (const expected of [
  "api_acks=5 committed=4 timely=2 bad=2 lifecycle_sli=50.00%",
  "allowed_bad=0.4 budget_consumption=5.00x",
  "telemetry_coverage=3/4 telemetry_status=INCOMPLETE",
  "short_window=1/3 sample=TOO_SMALL_FOR_AUTOMATIC_PAGE",
  "deployment_gate=MANUAL_REVIEW_OBSERVABILITY_GAP"
]) assert.ok(accepted.stdout.includes(expected),"Wrong learner-visible SQLite proof output: "+expected+"\n"+accepted.stdout);
const unsafe=[
  ["dropped missing consumer", "LEFT JOIN effects AS e", "JOIN effects AS e"],
  ["assume every commit succeeded", "good = sum(timely(r) for r in rows)", "good = len(rows)"],
  ["accept late consumer effects", "completed_at <= committed_at + deadline_seconds", "completed_at >= committed_at"],
  ["hide missing telemetry", "telemetry_complete = observed == {r[0] for r in rows}", "telemetry_complete = True"],
  ["silently evaluate immature cohort", "as_of = 120", "as_of = 75"]
];
for(const [name,before,after] of unsafe) {
  assert.ok(originalProgram.includes(before),name+" source variant not found");
  const mutant=runPython(originalProgram.replace(before,after));
  assert.notEqual(mutant.status,0,name+" was incorrectly accepted");
  assert.match(mutant.stderr,/AssertionError/,name+" failed for unrelated reason");
  assert.doesNotMatch(mutant.stderr,/(SyntaxError|OperationalError|ProgrammingError)/,name+" malformed source rather than real safety rejection");
}
console.log("PASS original Service Level lifecycle SQLite proof, five wrong implementations rejected; SLOs, live telemetry, actual Steward and learner validation remain UNVERIFIED.");
console.log("PASS authored SLI/error-budget/histogram/PromQL exact Python experiments; real Prometheus scrape and SLO gates UNVERIFIED.");
