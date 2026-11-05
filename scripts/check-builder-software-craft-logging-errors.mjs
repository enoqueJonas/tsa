import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-deep.ts", "utf8");
const quality = fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-quality.ts", "utf8");

const checkpoints = [
  {
    title: "Python Logging from First Principles",
    caption: "Logging pipeline — executable logger, handler, formatter and rejected INFO control",
    expected: ["LOGGER_PIPELINE_INFO_WARNING_NO_DEBUG", "LOGGER_PIPELINE_HANDLER_THRESHOLD_NEGATIVE"],
    mutation: [
      "handler.setLevel(logging.ERROR)",
      "handler.setLevel(logging.INFO)",
      "Handler at ERROR must discard INFO",
    ],
  },
  {
    title: "Useful Logging",
    caption: "Logging — executable structured-context and secret absence test",
    expected: ["LOG_ALLOWLIST_PRESERVED_EVENT_AND_DROPPED_SECRET", "LOG_MUTANT_LEAK_DETECTED"],
    mutation: [
      "logger.info(event, extra={name: context[name] for name in allowed})",
      "logger.info(event + repr(context), extra={name: context[name] for name in allowed})",
      "AssertionError",
    ],
  },
  {
    title: "Managing Dependencies",
    caption: "Dependencies — offline AST imports versus PEP 621 direct declarations and removal mutant",
    expected: ["DECLARATION_GAP_DETECTED: rich", "DECLARATION_GAP_REPAIRED_IN_MANIFEST", "DECLARATION_REMOVAL_MUTANT_CAUGHT"],
    mutation: [
      `fixed = manifest.replace('"PyYAML>=6"', '"PyYAML>=6", "rich>=13"')`,
      "fixed = manifest",
      "AssertionError",
    ],
  },
  {
    title: "Failure Boundaries and Public Error Contracts",
    caption: "Public error contracts — six outcomes, concealed 404 and an exception-leak mutant",
    expected: ["PUBLIC_FAILURE_SIX_OUTCOMES_AND_STABLE_SHAPE", "PUBLIC_FAILURE_MUTANT_REJECTED_NO_DB_SECRET", "PUBLIC_FAILURE_CONCEALED_RESOURCE_UNIFORM"],
    mutation: [
      '"message": "Request could not be completed.",',
      '"message": "demo-db-secret",',
      "AssertionError",
    ],
  },
];

function extractPublishedCode(caption) {
  const anchor = '"caption":' + JSON.stringify(caption);
  const at = source.indexOf(anchor);
  assert.ok(at >= 0, "Published code caption absent: " + caption);
  const codeMatch = source.slice(at, at + 16000).match(/"code":("(?:\\.|[^"\\])*")/);
  assert.ok(codeMatch, "Missing complete executable source for " + caption);
  const code = JSON.parse(codeMatch[1]);
  assert.ok(code.length > 900 && code.includes("assert "), "Source must be executable instructional proof: " + caption);
  return code;
}
function runPython(root, filename, program) {
  const location = path.join(root, filename);
  fs.writeFileSync(location, program + "\n");
  const proc = spawnSync("python3", [location], {
    encoding: "utf8", timeout: 20000, cwd: root,
    env: { ...process.env, PYTHONNOUSERSITE: "1" },
  });
  assert.ifError(proc.error);
  return proc;
}
const previousOrder = [
  "Useful Logging",
  "Designing Errors",
];
const lessonAt = title => source.indexOf("        " + JSON.stringify(title) + ",", source.indexOf("export const softwareCraftDeepLessons"));
for (const t of previousOrder) assert.ok(lessonAt(t) > 0, "Existing lesson lost: " + t);
assert.ok(lessonAt("Python Logging from First Principles") < lessonAt("Useful Logging"));
assert.ok(lessonAt("Failure Boundaries and Public Error Contracts") < lessonAt("Designing Errors"));
const count = [...source.matchAll(/^\s*lesson\(\s*$/gm)].length;
assert.equal(count, 24, "Software Craft authored lesson count unexpectedly changed");
for (const id of [
  "software-craft-python-logging-from-first-principles",
  "software-craft-failure-boundaries-and-public-error-contracts",
  "software-craft-useful-logging",
  "software-craft-designing-errors",
]) assert.ok(quality.includes(JSON.stringify(id) + ":"), "Missing executable practice rubric: " + id);

const root = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-software-craft-"));
try {
  for (const [i, item] of checkpoints.entries()) {
    const program = extractPublishedCode(item.caption);
    const actual = runPython(root, "original-" + i + ".py", program);
    assert.equal(actual.status, 0,
      item.title + " learner program did not run:\n" + actual.stdout + "\n" + actual.stderr);
    for (const marker of item.expected) assert.ok(actual.stdout.includes(marker),
      item.title + " did not produce " + marker + "\n" + actual.stdout);
    const [oldText, wrongText, diagnostic] = item.mutation;
    assert.ok(program.includes(oldText), "Cannot construct the learner source's bad mutant: " + item.title);
    const wrong = program.replace(oldText, wrongText);
    const rejected = runPython(root, "mutant-" + i + ".py", wrong);
    assert.notEqual(rejected.status, 0, "Unsafe source mutant unexpectedly passed: " + item.title);
    assert.ok(rejected.stderr.includes(diagnostic), "Mutant failed for wrong reason:\n" + rejected.stderr);
    console.log("PASS Software Craft source-original and deliberate mutant: " + item.title);
  }
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
console.log("Software Craft source teaching passed: 24 ordered lessons, 4 executable programs, 4 rejected negatives, stable rubrics.");
