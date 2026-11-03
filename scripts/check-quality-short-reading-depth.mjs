import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const groups = [
  {
    source: "packages/runtime-kernel/src/paths/quality-test-design-depth-cases.ts",
    symbol: "qualityTestDesignDepth",
    original: "packages/runtime-kernel/src/paths/quality-test-analysis-design-deep.ts",
    expected: ["exploratory-testing", "negative-testing", "traceability"],
  },
  {
    source: "packages/runtime-kernel/src/paths/quality-browser-depth-cases.ts",
    symbol: "qualityBrowserDepth",
    original: "packages/runtime-kernel/src/paths/quality-browser-environment-testing-deep.ts",
    expected: [
      "navigation-network", "ui-test-selection", "advanced-browser-interactions",
      "browser-diagnostics", "browser-parallelism", "page-components",
    ],
  },
  {
    source: "packages/runtime-kernel/src/paths/quality-api-depth-cases.ts",
    symbol: "qualityApiDepth",
    original: "packages/runtime-kernel/src/paths/quality-api-integration-testing-deep.ts",
    expected: ["api-auth", "filters-observability", "specifications", "auth-testing"],
  },
];
let checked = 0;
for (const group of groups) {
  const raw = readFileSync(group.source, "utf8");
  const assignment = raw.indexOf(" = {");
  assert.ok(assignment >= 0, "Authored source case-map assignment missing: " + group.source);
  const cases = JSON.parse(raw.slice(assignment + 3).trim().replace(/;\s*$/, ""));
  assert.deepEqual(Object.keys(cases).sort(), group.expected.slice().sort(), "Source depth cases changed: " + group.source);
  const original = readFileSync(group.original, "utf8");
  assert.ok(original.includes(group.symbol) && original.includes("blocks.push(...worked)"),
    "The original reading must actually render authored worked cases: " + group.original);
  for (const [topic, blocks] of Object.entries(cases)) {
    const headings = blocks.filter((b) => b.type === "heading").map((b) => b.text);
    const paragraphs = blocks.filter((b) => b.type === "paragraph").map((b) => b.text);
    assert.ok(headings.length >= 4 && paragraphs.length >= 3, topic + ": worked explanation is too thin");
    assert.ok(paragraphs.every((p) => p.length >= 120), topic + ": fragmentary paragraph instead of mechanism");
    const explanationSize = paragraphs.join("\n").length;
    assert.ok(explanationSize >= 1400, topic + ": source-specific mechanism/negative/transfer regressed");
    assert.ok(headings.some((h) => /failure|failed|negative|counterexample|misleading|reverse|hazard/i.test(h)),
      topic + ": no disconfirming/failure reasoning");
    assert.ok(headings.some((h) => /transfer|independent/i.test(h)),
      topic + ": no independent learner transfer");
    checked++;
  }
}
// A broad "advanced browser interactions" reading was split rather than
// pretending popup, file, frame and dialog mechanics were one exercise.
const browser = readFileSync(groups[1].original, "utf8");
for (const id of [
  "file-transfer-interactions", "popup-browser-ownership",
  "iframe-contexts", "blocking-dialogs",
]) {
  assert.ok(browser.includes('id: "' + id + '"') || browser.includes('"id": "' + id + '"'),
    "Missing individually taught browser concept: " + id);
}
console.log(`PASS Quality original-reading depth guard: ${checked} distinctive case sets and four focused browser lessons.`);
