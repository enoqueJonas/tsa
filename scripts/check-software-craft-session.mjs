// Prove exact source-derived activity identities and unlockable final capstone.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadModule(path, imports = {}) {
  const source = fs.readFileSync(path, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const exports = {};
  const require = id => {
    assert.ok(id in imports, "Unexpected runtime dependency in source-derived lesson: " + id);
    return imports[id];
  };
  vm.runInNewContext(compiled, { exports, require, console }, { filename: path });
  return { exports, source };
}
const deep = loadModule("packages/runtime-kernel/src/paths/builder-software-craft-deep.ts");
const lessons = deep.exports.softwareCraftDeepLessons;
assert.equal(lessons.length, 26, "Expect 25 regular Software Craft lessons plus original capstone");
const path = { id:"software-craft",title:"Software Craft",lessons };
const runtime = loadModule("packages/runtime-kernel/src/runtime/session.ts",
  {"../paths": { engineeringFoundations:path }});
const session = runtime.exports.createLearningSession(path);
const capstone = lessons.at(-1);
assert.equal(capstone.id, "software-craft-lab-refine-steward-api-for-review");
const before = lessons.slice(0, -1).flatMap(lesson => lesson.activities.map(activity => activity.id));
const reflectionResponses = Object.fromEntries(before.filter(id => id.endsWith("-check"))
  .map(id => [id, "SYNTHETIC source-derived session fixture, not real learner evidence."]));
session.restoreProgress({
  currentActivityId: before[0], completedActivityIds: before,
  reflectionResponses
});
const firstCapstone = capstone.activities[0].id;
assert.ok(session.unlockedActivityIds().includes(firstCapstone),
  "Software Craft capstone remains locked after all prerequisite lessons");
assert.ok(session.goToActivity(firstCapstone),
  "Cannot navigate to the preserved capstone first activity after all prerequisites");
assert.equal(session.currentActivity().id, firstCapstone);

// Diagnose title-derived browser fixtures that overlook noncanonical stable IDs.
const titleMatches = [...deep.source.matchAll(/\n    lesson\(\n        "([^"]+)"/g)].map(m => m[1]);
const slug = title => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const stable = {"Review a Code Change": "software-craft-code-review-and-technical-debt"};
const predicted = titleMatches.flatMap(title =>
  ["reading","practice","check"].map(kind =>
    (stable[title] ?? ("software-craft-" + slug(title))) + "-" + kind));
const missing = before.filter(id => !predicted.includes(id));
const unexpected = predicted.filter(id => !before.includes(id));
assert.equal(missing.length, 0, "Browser progress fixture omits actual activity IDs: " + missing.join(", "));
assert.equal(unexpected.length, 0, "Browser fixture invented noncanonical IDs: " + unexpected.join(", "));
console.log("PASS Software Craft actual compiled source session: 75 prerequisite activities, final capstone unlock and stable IDs.");
