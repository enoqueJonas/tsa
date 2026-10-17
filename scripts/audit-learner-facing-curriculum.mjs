import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

// Run against normalized learner-visible activities, not authored source strings.
const sourceRoot = path.join(process.cwd(), "packages/runtime-kernel/src");
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-learning-audit-"));
let journey;
try {
  const walk = (rel = "") => {
    for (const entry of fs.readdirSync(path.join(sourceRoot, rel), { withFileTypes: true })) {
      const child = path.join(rel, entry.name);
      if (entry.isDirectory()) walk(child);
      else if (entry.isFile() && child.endsWith(".ts")) {
        const out = path.join(temporaryRoot, child.replace(/\.ts$/, ".js"));
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, ts.transpileModule(fs.readFileSync(path.join(sourceRoot, child), "utf8"), {
          fileName: child,
          compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
        }).outputText);
      }
    }
  };
  walk();
  fs.writeFileSync(path.join(temporaryRoot, "package.json"), '{"type":"commonjs"}');
  journey = createRequire(path.join(temporaryRoot, "entry.cjs"))("./paths/academy-journey.js").technicalStewardshipJourney;
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

const errors = [];
const review = [];
const totals = { schools: 0, paths: 0, lessons: 0, activities: 0, readings: 0, practicals: 0, codeBlocks: 0 };
const seenSchools = new Set();
for (const school of journey.schools) {
  totals.schools++;
  if (seenSchools.has(school.id)) errors.push(`Repeated school id: ${school.id}`);
  seenSchools.add(school.id);
  const pathIds = new Set();
  const bySchool = { paths: 0, lessons: 0, practicals: 0, codeBlocks: 0, weakReadings: 0, repeatedHeadingAnchors: 0 };
  for (const lp of school.paths) {
    totals.paths++; bySchool.paths++;
    if (pathIds.has(lp.id)) errors.push(`Repeated path id: ${school.id}/${lp.id}`);
    pathIds.add(lp.id);
    const lessonIds = new Set();
    for (const lesson of lp.lessons) {
      totals.lessons++; bySchool.lessons++;
      const loc = `${school.id}/${lp.id}/${lesson.id}`;
      if (lessonIds.has(lesson.id)) errors.push(`Repeated lesson id: ${loc}`);
      lessonIds.add(lesson.id);
      const activityIds = new Set();
      for (const a of lesson.activities) {
        totals.activities++;
        if (activityIds.has(a.id)) errors.push(`Repeated activity id: ${loc}/${a.id}`);
        activityIds.add(a.id);
        if (a.content.type === "practical") { totals.practicals++; bySchool.practicals++; }
        if (a.content.type !== "reading") continue;
        totals.readings++;
        const c = a.content;
        if (!c.body?.trim() && !c.blocks?.length) errors.push(`Empty reading: ${loc}/${a.id}`);
        const blocks = c.blocks ?? [];
        if (!blocks.length && (c.body?.trim().length ?? 0) < 120) bySchool.weakReadings++;
        const anchors = new Set();
        for (const block of blocks) {
          if (block.type === "heading") {
            if (!block.id?.trim()) errors.push(`Heading without anchor: ${loc}/${a.id}`);
            if (anchors.has(block.id)) { bySchool.repeatedHeadingAnchors++; errors.push(`Repeated heading anchor: ${loc}/${a.id}/${block.id}`); }
            anchors.add(block.id);
          }
          if (block.type === "code") {
            totals.codeBlocks++; bySchool.codeBlocks++;
            if (!block.code?.trim()) errors.push(`Empty code block: ${loc}/${a.id}`);
            if (!block.language?.trim()) errors.push(`Code block lacks language: ${loc}/${a.id}`);
          }
          if (block.type === "list" && (!Array.isArray(block.items) || block.items.length === 0)) errors.push(`Empty list: ${loc}/${a.id}`);
        }
      }
    }
  }
  review.push({ school: school.id, ...bySchool });
}
console.log(`Learner-facing audit: ${totals.schools} schools, ${totals.paths} paths, ${totals.lessons} lessons, ${totals.activities} activities, ${totals.practicals} practicals, ${totals.codeBlocks} embedded code blocks.`);
for (const item of review) console.log(`${item.school}: paths=${item.paths}, lessons=${item.lessons}, practicals=${item.practicals}, code=${item.codeBlocks}, short-body-only readings=${item.weakReadings}, repeated heading anchors=${item.repeatedHeadingAnchors}`);
console.log(`Learner-facing structural findings: ${errors.length}`);
for (const msg of errors.slice(0, 60)) console.error("- " + msg);
if (errors.length > 60) console.error(`... plus ${errors.length - 60} additional findings`);
if (errors.length && process.argv.includes("--strict")) process.exitCode = 1;
