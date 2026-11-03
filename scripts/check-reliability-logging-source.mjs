import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const src=readFileSync("packages/runtime-kernel/src/paths/reliability-logging-parser-extended.ts","utf8");
const logging=readFileSync("packages/runtime-kernel/src/paths/reliability-production-logging-deep.ts","utf8");
assert.ok(logging.includes("blocks.push(...(loggingDeepSections[spec.id] ?? []));"),"Evidence must appear in the original lesson, not a separate wrapper");
const m=src.match(/const diagnosticFixture = `([\s\S]*?)`;/);
assert.ok(m,"Exact learner diagnostic fixture not found");
const run=spawnSync("python3",["-c",m[1]],{encoding:"utf8",timeout:10000});
assert.ifError(run.error); assert.equal(run.status,0,run.stderr);
assert.match(run.stdout,/correlated=2 malformed=1 uncorrelated=1/);
assert.ok(src.includes('"centralized-logging"') && src.includes("Graylog input") && src.includes("search backend"),"Actual reading must trace message to query");
assert.ok(src.includes("retention") && src.includes("permissions") && src.includes("shipper"),"Must teach loss and invisible-event diagnosis");
const entry=readFileSync("packages/runtime-kernel/src/paths/reliability-engineer.ts","utf8");
assert.ok(entry.includes("reliabilityEngineerPaths") && entry.includes("productionLoggingDeepLessons"),"Keep original full school wired");
console.log("PASS original Reliability logging readings: exact Python parse/correlation negative proof; real Graylog UNVERIFIED.");

const sloSource=readFileSync("packages/runtime-kernel/src/paths/reliability-slo-source-depth.ts","utf8");
const sloLesson=readFileSync("packages/runtime-kernel/src/paths/reliability-service-level-engineering-deep.ts","utf8");
assert.ok(sloLesson.includes("...(sloDeepSections[spec.id] ?? [])"),"SLO examples must appear in original lessons");
const sloMatch=sloSource.match(/const sloExperiment = `([\s\S]*?)`;/);
assert.ok(sloMatch,"Source SLI experiment missing");
const sloRun=spawnSync("python3",["-c",sloMatch[1]],{encoding:"utf8",timeout:10000});
assert.ifError(sloRun.error); assert.equal(sloRun.status,0,sloRun.stderr);
assert.match(sloRun.stdout,/valid=3 good=2 sli=0\.6667/);
assert.match(sloRun.stdout,/allowed_bad=0\.30 actual_bad=1/);
assert.match(sloRun.stdout,/empty_window=UNKNOWN/);
assert.ok(sloSource.includes("missing-data") && sloSource.includes("no traffic"),"SLI must not conflate missing observations and success");
console.log("PASS source-authored SLI ratio, error-budget and missing-data negative example.");

const metricSrc=readFileSync("packages/runtime-kernel/src/paths/reliability-metrics-source-depth.ts","utf8");
const metricLesson=readFileSync("packages/runtime-kernel/src/paths/reliability-metrics-prometheus-grafana-deep.ts","utf8");
assert.ok(metricLesson.includes("...(metricsDeepSections[spec.id] ?? [])"),"Metrics examples must appear in original readings");
const counter=metricSrc.match(/const counterExperiment = `([\s\S]*?)`;/);
assert.ok(counter,"Missing source reset-counter example");
const counterRun=spawnSync("python3",["-c",counter[1]],{encoding:"utf8",timeout:10000});
assert.ifError(counterRun.error);assert.equal(counterRun.status,0,counterRun.stderr);
assert.match(counterRun.stdout,/naive_delta=-95 reset_aware_increase=14/);
for (const required of ["histogram_quantile(0.95", "sum by (le, route)", "status_class", "zero denominator"]) {
  assert.ok(metricSrc.includes(required),"Missing PromQL population/negative-case teaching: "+required);
}
console.log("PASS source-authored PromQL and exact local reset-aware counter experiment; real Prometheus UNVERIFIED.");

const integrated = readFileSync("packages/runtime-kernel/src/paths/reliability-observability-stack-integration-deep.ts", "utf8");
for (const marker of [
  "reliability-observability-stack-integration-graylog-lab-guide",
  "Three components, three failure boundaries",
  "MongoDB stores Graylog metadata",
  "Graylog Data Node",
  "vm.max_map_count",
  "GRAYLOG_PASSWORD_SECRET",
  "GRAYLOG_ROOT_PASSWORD_SHA2",
  "GELF HTTP input",
  "http://127.0.0.1:12201/gelf",
  "https://go2docs.graylog.org/current/downloading_and_installing_graylog/docker_installation.htm",
  "docker compose down",
]) {
  assert.ok(integrated.includes(marker), "Missing original-reading Graylog first-run boundary: " + marker);
}
console.log("PASS authored Graylog 7.2 first-run reference, GELF HTTP fixture and safe-scoped cleanup; actual Graylog runtime UNVERIFIED.");
