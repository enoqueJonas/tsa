import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const src=readFileSync("packages/runtime-kernel/src/paths/reliability-logging-source-depth.ts","utf8");
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
