import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-kafka-comparison-worked.ts","utf8");
const caption="Runnable conceptual Kafka offset and replay trace for two consumer groups (no Kafka broker)";
const anchor=source.indexOf('"caption": '+JSON.stringify(caption));
assert.ok(anchor>=0,"Missing published Kafka-offset teaching trace");
const match=source.slice(anchor,anchor+12000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
assert.ok(match,"Could not extract Kafka-offset Python teaching code");
const result=spawnSync("python3",["-c",JSON.parse(match[1])],{encoding:"utf8",timeout:12000});
assert.ifError(result.error);
assert.equal(result.status,0,"Source-derived offset model failed: "+result.stderr);
for(const line of [
  "audit reads: ['created', 'owner-changed']",
  "report reads: ['created']",
  "audit next offset: 2",
  "report next offset: 1",
  "audit replay from offset 1: ['owner-changed', 'retired']",
  "retained record count: 3",
]){
  assert.ok(result.stdout.includes(line),"Missing "+line+": "+result.stdout);
}
console.log("System Thinker Kafka offset model passed: independent group positions and retained replay; not a broker integration claim.");
