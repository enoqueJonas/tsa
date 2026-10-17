import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const original = Module._extensions[".ts"];
Module._extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const js = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    reportDiagnostics: false,
  }).outputText;
  module._compile(js, filename);
};

const entry = path.join(process.cwd(), "packages/runtime-kernel/src/paths/academy-journey.ts");
let journey;
try {
  journey = require(entry).technicalStewardshipJourney;
} finally {
  if (original) Module._extensions[".ts"] = original;
  else delete Module._extensions[".ts"];
}
if (!journey || !Array.isArray(journey.schools)) throw new Error("No resolved curriculum journey");
const problems = [];
const stats = { schools: 0, paths: 0, lessons: 0, practicals: 0 };
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;
const detailedList = (value) => Array.isArray(value) && value.length > 0 &&
  value.every((entry) => nonEmpty(entry));
const keys = ["objective", "scenario", "instructions", "deliverables", "completionCriteria"];
for (const school of journey.schools) {
  stats.schools++;
  for (const learningPath of school.paths ?? []) {
    stats.paths++;
    for (const lesson of learningPath.lessons ?? []) {
      stats.lessons++;
      for (const activity of lesson.activities ?? []) {
        if (activity.content?.type !== "practical") continue;
        stats.practicals++;
        const c = activity.content;
        const missing = keys.filter((key) =>
          key === "objective" || key === "scenario" ? !nonEmpty(c[key]) : !detailedList(c[key]));
        if (missing.length) problems.push(
          `${school.id}/${learningPath.id}/${lesson.id}/${activity.id}: ${missing.join(", ")}`);
      }
    }
  }
}
console.log(`Resolved practical contracts: ${stats.schools} schools, ${stats.paths} paths, ${stats.lessons} lessons, ${stats.practicals} practical activities; ${problems.length} missing/empty contract findings.`);
if (problems.length) {
  console.error("Missing resolved practical content:\n- " + problems.join("\n- "));
  process.exitCode = 1;
}
