import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const original=readFileSync("packages/runtime-kernel/src/paths/reliability-sli-metrics-worked.ts","utf8");
for (const [path,call] of [["reliability-service-level-engineering-deep.ts","extraSliBlocks"],["reliability-metrics-prometheus-grafana-deep.ts","extraMetricsBlocks"]]) {
  const source=readFileSync("packages/runtime-kernel/src/paths/"+path,"utf8");
  assert.ok(source.includes("..."+call+"(spec.id)"),"Source reading must wire "+call);
}
function getMap(name){
  const match=original.match(new RegExp("export const "+name+":\\s*Record<string,WorkedSection\\[\\]> = (\\{[\\s\\S]*?\\});\\nexport "));
  assert.ok(match,"Could not recover "+name+" from original teaching source");
  return JSON.parse(match[1]);
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
console.log("PASS authored SLI/error-budget/histogram/PromQL exact Python experiments; real Prometheus scrape and SLO gates UNVERIFIED.");
