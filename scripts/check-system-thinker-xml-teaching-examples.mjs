// Execute the exact Python blocks published inside the System Thinker XML/XSD readings.
// This test requires Python 3 and lxml (CI installs it explicitly).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const source = readFileSync(
  "packages/runtime-kernel/src/paths/system-thinker-xml-worked-examples.ts",
  "utf8",
);
const cases = [
  {
    caption: "Executable namespace identity, contract mismatch and malformed-XML failure",
    expected: [
      "original: payments-api",
      "alias: payments-api",
      "wrong URI: ValueError",
      "malformed: ParseError",
    ],
  },
  {
    caption: "Runnable XSD validation: valid document, wrong type, missing field and namespace mismatch",
    expected: [
      "valid: True",
      "wrong type: False",
      "missing Port: False",
      "wrong URI: False",
    ],
  },
];
for (const example of cases) {
  const anchor = source.indexOf('"caption": ' + JSON.stringify(example.caption));
  assert.ok(anchor >= 0, "Missing published code caption: " + example.caption);
  const match = source.slice(anchor, anchor + 16000).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(match, "Unable to extract learner-visible code: " + example.caption);
  const code = JSON.parse(match[1]);
  const result = spawnSync("python3", ["-c", code], {encoding: "utf8",timeout: 15_000});
  assert.ifError(result.error);
  assert.equal(result.status, 0, `${example.caption} failed: ${result.stderr}`);
  for (const line of example.expected) {
    assert.ok(result.stdout.includes(line), `${example.caption}: missing ${line} from ${result.stdout}`);
  }
}
console.log("System Thinker XML/XSD learner examples passed: 2 source-extracted programs and 6 negative outcomes.");
