import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = readFileSync("packages/runtime-kernel/src/paths/reliability-logging-source-depth.ts","utf8");
const authored = readFileSync("packages/runtime-kernel/src/paths/reliability-production-logging-deep.ts","utf8");
const assembly = readFileSync("packages/runtime-kernel/src/paths/reliability-engineer.ts","utf8");
assert.ok(authored.includes('blocks.push(...extraLoggingBlocks(spec.id))'),"Depth must render in original authored logging reading");
assert.ok(!assembly.includes('prepareReliability(') && !assembly.includes('-reliability-preparation'),"No duplicate generic Reliability prep wrappers");
const match = source.match(/export const loggingDepthById:[^\n]+ = (\{[\s\S]*\});\s*export function/);
assert.ok(match,"Cannot recover original logging-depth topic map");
const map=JSON.parse(match[1]);
const ids=["structured-logs","log-levels","correlation-ids","request-trace-context","centralized-logging","useful-noisy","privacy-security","retention"];
assert.deepEqual(Object.keys(map).sort(),ids.sort());
for (const id of ids) {
  const row=map[id];
  assert.ok(row.length >= 2,id+": needs worked explanation and separate failure/transfer");
  const paragraphs=row.flatMap(s=>s.paragraphs ?? []);
  assert.ok(paragraphs.length >= 3 && paragraphs.join(" ").length > 800,id+": no sufficient original instructional mechanism");
  assert.ok(row.some(s=>/failure|transfer|diagnos/i.test(s.heading)),id+": no failure and transfer phase");
}
assert.match(map["centralized-logging"].flatMap(x=>x.paragraphs).join(" "),/journal/);
assert.match(map["centralized-logging"].flatMap(x=>x.paragraphs).join(" "),/index/);
assert.match(map["privacy-security"].flatMap(x=>x.paragraphs).join(" "),/Redaction|redaction/);
assert.match(map["retention"].flatMap(x=>x.paragraphs).join(" "),/index set/i);
console.log("PASS all eight original logging readings source-wired with mechanism, failure and transfer; Graylog service execution UNVERIFIED.");
