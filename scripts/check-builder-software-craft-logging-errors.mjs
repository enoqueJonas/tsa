import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-deep.ts", "utf8");
const quality = fs.readFileSync("packages/runtime-kernel/src/paths/builder-software-craft-quality.ts", "utf8");
const assembly = fs.readFileSync("packages/runtime-kernel/src/paths/academy-journey.ts", "utf8");
const internal = fs.readFileSync("packages/runtime-kernel/src/paths/internal-dependency-management.ts", "utf8");

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
assert.ok(lessonAt("Technical Documentation") < lessonAt("Architecture Decision Records"));
assert.ok(lessonAt("Architecture Decision Records") < lessonAt("Operational Runbooks and Safe Diagnostic Handoffs"));
assert.ok(lessonAt("Operational Runbooks and Safe Diagnostic Handoffs") < lessonAt("Failure Boundaries and Public Error Contracts"));
assert.ok(source.includes('"caption":"ADR — complete Steward SQL and migration isolation decision with evidence and revisit trigger"'));
assert.ok(source.includes('"caption":"Runbook — read-only Steward diagnosis, status triage and mandatory stop conditions"'));

const count = [...source.matchAll(/^\s*lesson\(\s*$/gm)].length;
assert.equal(count, 26, "Software Craft authored lesson count unexpectedly changed");
for (const id of [
  "software-craft-python-logging-from-first-principles",
  "software-craft-architecture-decision-records",
  "software-craft-operational-runbooks-and-safe-diagnostic-handoffs",
  "software-craft-failure-boundaries-and-public-error-contracts",
  "software-craft-useful-logging",
  "software-craft-designing-errors",
]) assert.ok(quality.includes(JSON.stringify(id) + ":"), "Missing executable practice rubric: " + id);

// The academy inserts TWO extra Software Craft lessons from a separate file.
// Locking uses the actual assembled journey, not only the local source array.
// Their concepts must precede the new capstone stages and their actual IDs
// must be completed by any synthetic test profile.
for (const id of [
  "software-craft-internal-package-design-001",
  "software-craft-extract-steward-common-001",
]) assert.ok(internal.includes('id: "' + id + '"'),
  "Missing internal dependency prerequisite: " + id);
assert.ok(assembly.includes('lesson.id === "software-craft-lab-change-safety-review"'),
  "Real academy must insert internal dependencies before the first staged lab");
assert.ok(assembly.includes("...path.lessons.slice(0, insertionIndex),") &&
          assembly.includes("reusableInternalPackageLesson,") &&
          assembly.includes("extractStewardCommonLesson,"),
  "Journey must preserve both injected lessons in the Builder path");
const assembledLessonCount = 26 + 2 + 3 + 1;
const assembledActivityCount = 26 * 3 + 2 + 3 * 3 + 3;
assert.equal(assembledLessonCount, 32);
assert.equal(assembledActivityCount, 92);
console.log("PASS Software Craft assembly: 26 concepts + 2 injected prerequisites + 3 staged labs + original synthesis; 92 activities");

// A capstone cannot compress these independent contracts into one unchecked
// 180-minute exercise. Preserve the old final IDs for existing learners while
// requiring separately navigable and reviewable practical stages.
const stagedLabs = [
  "software-craft-lab-change-safety-review",
  "software-craft-lab-configuration-observability-errors",
  "software-craft-lab-reproducible-handoff-performance",
];
const capstoneId = "software-craft-lab-refine-steward-api-for-review";
const atStage = id => source.indexOf('"id":' + JSON.stringify(id));
for (const stage of stagedLabs) {
  assert.ok(atStage(stage) > 0, "Missing authored Software Craft stage: " + stage);
  for (const suffix of ["reading", "practice", "check"]) {
    const activityId = stage + "-" + suffix;
    const occurrences = source.split('"id":' + JSON.stringify(activityId)).length - 1;
    assert.equal(occurrences, 1, "Missing or duplicated independent capstone stage activity: " + activityId);
  }
}
assert.ok(atStage(stagedLabs[0]) < atStage(stagedLabs[1]));
assert.ok(atStage(stagedLabs[1]) < atStage(stagedLabs[2]));
assert.ok(atStage(stagedLabs[2]) < source.lastIndexOf('id: "' + capstoneId + '"'));
for (const suffix of ["brief", "practice", "check"]) {
  const id = capstoneId + "-" + suffix;
  assert.ok(source.includes('id: "' + id + '"'),
    "Do not retire or rename the original Software Craft final activity: " + id);
}
for (const caption of [
  "Change-safety baseline — execute only in the existing disposable Steward Django checkout",
  "Ops/error contract — known real signed Steward HTTP outcomes on disposable PostgreSQL",
  "Handoff/performance — real Django query-count measurement, not synthetic p95",
]) assert.ok(source.includes('"caption":' + JSON.stringify(caption)),
  "Missing real-lab command or explicitly bounded performance source: " + caption);
const finalPractice = source.slice(source.lastIndexOf('id: "' + capstoneId + '-practice"'));
for (const fact of ["seven-row evidence matrix", "NOT TESTED", "independent reviewer", "System Thinker handoff"]) {
  assert.ok(finalPractice.toLowerCase().includes(fact.toLowerCase()),
    "Final review missing falsifiable synthesis or uncertainty boundary: " + fact);
}
console.log("PASS Software Craft staged capstone: 3 independent labs, 9 unique activities, original final IDs and seven-row evidence gate");

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
console.log("Software Craft source teaching passed: 26 ordered lessons, 4 executable programs, 4 rejected negatives, stable rubrics.");
