import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";

// These programs are the exact learner-facing code inside the two staged labs.
// CI runs against real disposable Redis and RabbitMQ service containers.
const source=readFileSync("packages/runtime-kernel/src/paths/system-thinker-distributed-live-primer.ts","utf8");
const cases=[
  {
    caption:"Run Redis client: MISS → HIT → STALE → INVALIDATE, denied team and refused-cache fallback",
    expected:[
      "first: ('database', 'payments-api')",
      "second: ('cache', 'payments-api')",
      "stale before invalidation: ('cache', 'payments-api')",
      "after invalidation: ('database', 'payments-service')",
      "cross-team request: denied",
      "unavailable cache: ('database fallback', 'payments-service')",
    ],
  },
  {
    caption:"Run RabbitMQ: real publish/confirm, unacked channel closure, redelivery, deduplication and DLQ",
    expected:[
      "published with confirm enabled",
      "first redelivery flag: False",
      "first effect inserted: True",
      "second redelivery flag: True",
      "duplicate effect inserted: False",
      "local effect rows: 1",
      "DLQ event: evt-poison",
      "main queue empty: True",
    ],
  },
];
for(const entry of cases){
  const anchor=source.indexOf('"caption": '+JSON.stringify(entry.caption));
  assert.ok(anchor>=0,"Missing real-service published example: "+entry.caption);
  const match=source.slice(anchor,anchor+20000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(match,"Unable to extract Python code: "+entry.caption);
  const program=JSON.parse(match[1]);
  const result=spawnSync("python3",["-c",program],{encoding:"utf8",timeout:25000});
  assert.ifError(result.error);
  assert.equal(result.status,0,entry.caption+" failed: "+result.stderr);
  for(const item of entry.expected){
    assert.ok(result.stdout.includes(item),entry.caption+" missing "+item+" from "+result.stdout);
  }
}
console.log("System Thinker live Redis/RabbitMQ primer passed: actual loopback services, misses, invalidation, replay and DLQ.");