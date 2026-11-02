import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

// Extract and execute the exact examples inside the published learning-path source.
const cases=[
  {
    "path": "packages/runtime-kernel/src/paths/system-thinker-requirements-worked.ts",
    "caption": "Executable quality-scenario percentile, success and failure threshold trace",
    "expected": [
      "sample count: 20",
      "p95_ms: 420",
      "max_ms: 720",
      "under_500_ms: True",
      "under_400_ms: False"
    ]
  },
  {
    "path": "packages/runtime-kernel/src/paths/system-thinker-failures-decisions-worked.ts",
    "caption": "Executable local HTTP 503, bounded retry, success and persistent-outage trace",
    "expected": [
      "attempt 1: HTTP 503",
      "attempt 2: HTTP 503",
      "attempt 3: HTTP 200",
      "calls after recovery: 3",
      "unavailable attempt 1: HTTP 503",
      "unavailable attempt 2: HTTP 503",
      "bounded calls during outage: 2"
    ]
  }
];
for (const example of cases) {
  const source=readFileSync(example.path,"utf8");
  const anchor=source.indexOf('"caption": '+JSON.stringify(example.caption));
  assert.ok(anchor>=0,"Published caption missing: "+example.caption);
  const codeMatch=source.slice(anchor,anchor+16000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(codeMatch,"Executable code missing: "+example.caption);
  const code=JSON.parse(codeMatch[1]);
  const result=spawnSync("python3",["-c",code],{encoding:"utf8",timeout:20000});
  assert.ifError(result.error);
  assert.equal(result.status,0,example.caption+" failed: "+result.stderr);
  for(const expected of example.expected)
    assert.ok(result.stdout.includes(expected),example.caption+": expected "+expected+" in "+result.stdout);
}
console.log("System Thinker requirements and failure-mode learner examples passed: quality threshold and real loopback HTTP retry/outage.");