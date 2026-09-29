import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pathsDir = path.join(root, "packages/runtime-kernel/src/paths");
const docsDir = path.join(root, "docs/curriculum");
const files = fs.readdirSync(pathsDir).filter((name) => name.endsWith(".ts"));
const sources = new Map(files.map((name) => [name, fs.readFileSync(path.join(pathsDir, name), "utf8")]));
const allRuntime = [...sources.values()].join("\n");
const failures = [];

for (const [file, source] of sources) {
  for (const match of source.matchAll(/export const\s+(\w+(?:DeepLessons|QualityLessons|RichLessons))\b/g)) {
    const symbol = match[1];
    const uses = (allRuntime.match(new RegExp("\\b" + symbol + "\\b", "g")) || []).length;
    if (uses < 2) failures.push(`orphan exported lesson array: ${file} -> ${symbol}`);
  }

  for (const match of source.matchAll(/(?:const|export const)\s+(\w*[Mm]ilestone\w*)\s*(?::\s*(?:AuthoredLesson|Lesson))?\s*=/g)) {
    const symbol = match[1];
    const uses = (allRuntime.match(new RegExp("\\b" + symbol + "\\b", "g")) || []).length;
    if (uses < 2 && !/DeepLessons$/.test(symbol)) failures.push(`declared milestone not composed/exported: ${file} -> ${symbol}`);
  }
}

const academy = sources.get("academy-journey.ts") ?? "";
const schoolAggregators = [
  "systemThinkerPaths","platformBuilderPaths","deliveryEngineerPaths","cloudEngineerPaths",
  "qualityStewardPaths","securityStewardPaths","reliabilityEngineerPaths","architectPaths",
  "technicalStewardPaths","professionalEngineerPaths"
];
for (const symbol of schoolAggregators) {
  if (!academy.includes(symbol)) failures.push(`school runtime path array not wired in academy-journey.ts: ${symbol}`);
}

// Jenkins is intentionally retained only in the bounded legacy-to-GitLab migration exercise.
// Historical curriculum audit documents may also describe the migration and are not active runtime architecture.
const jenkinsRuntimeAllowlist = new Set(["delivery-migration-exercises-deep.ts"]);
for (const [file, source] of sources) {
  if (/\bJenkins(?:file)?\b/i.test(source) && !jenkinsRuntimeAllowlist.has(file)) {
    failures.push(`non-canonical Jenkins runtime reference: ${file}`);
  }
}

const migrationExercise = sources.get("delivery-migration-exercises-deep.ts") ?? "";
if (!/GitLab CI\/CD/.test(migrationExercise) || !/Jenkins/.test(migrationExercise)) {
  failures.push("legacy CI migration exercise must explicitly preserve Jenkins-to-GitLab migration semantics");
}

if (failures.length) {
  console.error("Curriculum integrity audit failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Curriculum integrity audit passed: ${files.length} runtime path files checked; school wiring, lesson-array reachability, milestone composition and canonical CI architecture are clean.`);
