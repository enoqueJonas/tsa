import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

import os from "node:os";

const sourceRoot = path.join(process.cwd(), "packages/runtime-kernel/src");
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-resolved-curriculum-"));
function compileDirectory(relative = "") {
  const dir = path.join(sourceRoot, relative);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      compileDirectory(child);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      const outputPath = path.join(temporaryRoot, child.replace(/\.ts$/, ".js"));
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      const js = ts.transpileModule(fs.readFileSync(path.join(sourceRoot, child), "utf8"), {
        fileName: child,
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
      }).outputText;
      fs.writeFileSync(outputPath, js);
    }
  }
}
let journey;
try {
  compileDirectory();
  // Node 25 may classify generated .js as ESM via syntax detection unless the
  // temporary module tree explicitly declares its CommonJS package boundary.
  fs.writeFileSync(path.join(temporaryRoot, "package.json"), JSON.stringify({ type: "commonjs" }));
  const requireTemp = createRequire(path.join(temporaryRoot, "entry.cjs"));
  journey = requireTemp("./paths/academy-journey.js").technicalStewardshipJourney;
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
if (!journey || !Array.isArray(journey.schools)) throw new Error("No resolved curriculum journey");
const problems = [];
const reusedCriteria = new Map();
const stats = { schools: 0, paths: 0, lessons: 0, practicals: 0 };
const builder = journey.schools.find((school) => school.id === "platform-builder");
if (!builder || builder.paths.length !== 15) {
  problems.push("Platform Builder must expose its 15 planned paths");
} else {
  for (const path of builder.paths) {
    const first = path.lessons?.[0];
    const read = first?.activities?.[0]?.content;
    if (first?.id !== `${path.id}-operational-readiness` ||
        read?.type !== "reading" ||
        typeof read.body !== "string" || read.body.length < 250) {
      problems.push(`Platform Builder readiness guidance missing or too short: ${path.id}`);
    }
  }
}
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
        for (const item of c.completionCriteria ?? []) {
          if (typeof item !== "string") continue;
          const criterion = item.trim().toLowerCase().replace(/\s+/g, " ");
          const result = reusedCriteria.get(criterion) ?? { count: 0, examples: [] };
          result.count++;
          if (result.examples.length < 2) result.examples.push(`${school.id}/${learningPath.id}/${lesson.id}`);
          reusedCriteria.set(criterion, result);
        }
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

console.log("Frequently reused practical completion criteria (review candidates, not automatic defects):");
for (const [criterion, usage] of [...reusedCriteria].filter(([, value]) => value.count >= 10).sort((a, b) => b[1].count - a[1].count).slice(0, 20)) {
  console.log(`  ${usage.count}x ${criterion.slice(0, 160)} — ${usage.examples.join('; ')}`);
}
