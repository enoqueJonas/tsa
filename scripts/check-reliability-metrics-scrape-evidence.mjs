import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const path="packages/runtime-kernel/src/paths/reliability-metrics-scrape-evidence.ts";
const source=readFileSync(path,"utf8");
const original=readFileSync("packages/runtime-kernel/src/paths/reliability-metrics-prometheus-grafana-deep.ts","utf8");
const anchor="export const metricsScrapeEvidenceById: Record<string, Section[]> = ";
const start=source.indexOf(anchor);
const stop=source.indexOf(";\nexport function metricsScrapeEvidenceBlocks",start);
assert.ok(start>=0 && stop>start,"Cannot locate source-published metrics lesson map");
const map=JSON.parse(source.slice(start+anchor.length,stop));
assert.deepEqual(Object.keys(map).sort(),["prometheus-architecture","promql","grafana"].sort());
const py=map["prometheus-architecture"].find(x=>x.code?.language==="python")?.code.code;
assert.ok(py,"Source-published real HTTP /metrics program unavailable");
for(const required of ["ThreadingHTTPServer","text/plain; version=0.0.4",
  "http_requests_total","State.scrape_mode = \"down\"",
  "State.scrape_mode = \"stale\"","ratio_or_unknown","observed_client_http",
  "last_good_exposition"]) {
  assert.ok(py.includes(required),"Actual published metrics source missing: "+required);
}
for(const id of ["prometheus-architecture","promql","grafana"]) {
  assert.ok(map[id]?.length>=1,"Original metrics follow-on lesson absent: "+id);
}
assert.ok(original.includes('...(spec.id === "prometheus-architecture" ? [] : metricsScrapeEvidenceBlocks(spec.id))'),
  "PromQL/Grafana source must render in their original readings");
const focused='id: "metrics-prometheus-grafana-prometheus-architecture-scrape-failures-reading"';
assert.ok(original.includes(focused),"Scrape source must live in dedicated reading after original Prometheus Architecture");
const first=original.indexOf('id: `metrics-prometheus-grafana-${spec.id}-001`');
const middle=original.indexOf(focused);
const practical=original.indexOf('id: `metrics-prometheus-grafana-${spec.id}-002`');
assert.ok(first>=0 && first<middle && middle<practical,
  "Do not replace existing learner progress IDs or put scrape evidence after original practical");
assert.ok(original.includes('blocks: metricsScrapeEvidenceBlocks(spec.id)'),
  "Original curriculum does not render published Python in focused scrape reading");
for(const expected of [
  "Execute the exact preceding scrape_lab.py",
  "Reproduce metrics HTTP 503 while user API",
  "In an approved real Prometheus instance",
  "If the backend is absent, explicitly record NOT_TESTED"
]) assert.ok(original.includes(expected),"Paired practical missing: "+expected);

function execute(program) {
  const run=spawnSync("python3",["-c",program],{encoding:"utf8",timeout:20000});
  assert.ifError(run.error);
  return run;
}
const passed=execute(py);
assert.equal(passed.status,0,"Published scrape lab failed:\n"+passed.stderr+"\n"+passed.stdout);
for(const marker of [
 "baseline: up=1 initialized_classes=2 no_traffic=UNKNOWN",
 "known_requests: up=1 2xx=2 5xx=1 observed_error_share=33.33%",
 "scrape_outage: up=0 api_health=200 last_interval=UNKNOWN",
 "stale_exporter: up=1 observed_requests=4 scraped_requests=3 stale_detected=True",
 "recovery: up=1 2xx=3 5xx=1 counters_match_observed=True",
 "LOCAL_SCRAPE_ONLY: real Prometheus TSDB/rate/staleness/Grafana UNVERIFIED"
]) assert.ok(passed.stdout.includes(marker),"Wrong learner HTTP/scrape result: "+marker);
const negative=[
  ["turn no-traffic UNKNOWN into false zero",
   'return "UNKNOWN" if total == 0 else',
   'return "0.00%" if total == 0 else'],
  ["call a failed scrape successful",
   "if status != 200:\n        return 0, None",
   'if status != 200:\n        return 1, {"2xx": 0, "5xx": 0}'],
  ["accept a stale HTTP 200 as fresh",
   "stale_detected = stale_up == 1 and expected_total != stale_total",
   "stale_detected = False"],
  ["omit failed request from exported totals",
   "State.counts[cls] += 1",
   'if cls == "2xx":\n            State.counts[cls] += 1'],
  ["stop initializing zero-error time series",
   'for cls in ("2xx", "5xx")',
   'for cls in ("2xx",)'],
  ["conceal caller-observed request in independent check",
   "        observed_client_http.append(status)\n",
   "        pass  # deleted client confirmation\n"]
];
for(const [name,before,after] of negative) {
  assert.ok(py.includes(before),"Missing mutant anchor: "+name);
  const bad=execute(py.replace(before,after));
  assert.notEqual(bad.status,0,"Unsafe source was accepted: "+name);
  assert.match(bad.stderr,/AssertionError/,"Changed case did not trip an explicit assertion: "+name+"\n"+bad.stderr);
  assert.doesNotMatch(bad.stderr,/SyntaxError|IndentationError/,"Invalid negative test setup: "+name);
}
const authoredProse=Object.values(map).flat().flatMap(section=>section.paragraphs).join("\n");
for(const phrase of [
  "absent_over_time(up{job=\"steward-api\"}[10m])",
  "a missing series is not equivalent to",
  "NOT the Prometheus binary",
  "No data, Error or alerting NoData"
]) {
  assert.ok(authoredProse.toLowerCase().includes(phrase.toLowerCase()),
    "Learner must distinguish target disappearance, scrape outage and dashboard NoData: "+phrase);
}
console.log("PASS actual published localhost metrics exposition, 201/503 request counters, missed scrape, false-green stale exporter, six changed-source negatives; real Prometheus/Grafana UNVERIFIED.");
