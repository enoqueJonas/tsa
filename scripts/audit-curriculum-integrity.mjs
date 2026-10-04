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

// Compare reconciled school path IDs and order against executable registries.
const planned = sources.get("technical-stewardship-journey.ts") ?? "";

// The first two schools are wired directly rather than replaced in academy-journey.ts.
if (!planned.includes('{ id: "engineering-apprentice", title: "Engineering Apprentice", paths: [engineeringFoundations] }')) {
  failures.push("Engineering Apprentice must remain wired to engineeringFoundations in the canonical journey");
}
if (!planned.includes('{ id: "builder", title: "Builder", paths: builderPaths }')) {
  failures.push("Builder must remain wired to builderPaths in the canonical journey");
}
const schoolRegistries = {
  builder: ["builder.ts", "builderPaths"],
  "platform-builder": ["platform-builder.ts", "platformBuilderPaths"],
  "system-thinker": ["system-thinker.ts", "systemThinkerPaths"],
  "delivery-engineer": ["delivery-engineer.ts", "deliveryEngineerPaths"],
  "cloud-engineer": ["cloud-engineer.ts", "cloudEngineerPaths"],
  "quality-steward": ["quality-steward.ts", "qualityStewardPaths"],
  "security-steward": ["security-steward.ts", "securityStewardPaths"],
  "reliability-engineer": ["reliability-engineer.ts", "reliabilityEngineerPaths"],
  architect: ["architect.ts", "architectPaths"],
  "technical-steward": ["technical-steward.ts", "technicalStewardPaths"],
  "professional-engineer": ["professional-engineer.ts", "professionalEngineerPaths"],
};
for (const [schoolId, [file, arrayName]] of Object.entries(schoolRegistries)) {
  const section = planned.split(`{ id: "${schoolId}", title:`)[1]?.split("]},")[0] ?? "";
  const expected = [...section.matchAll(/module\("([^"]+)"/g)].map((m) => m[1]);
  const registry = sources.get(file) ?? "";
  const tail = registry.split(`export const ${arrayName}:`)[1] ?? "";
  const symbols = tail.match(/=\s*\[([^\]]+)\]/)?.[1]?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const actual = symbols.map((symbol) => {
    const definition = registry.split(`export const ${symbol}`)[1] ?? "";
    const direct = definition.match(/\bid:\s*"([^"]+)"/)?.[1];
    const viaPath = definition.match(/=\s*path\("([^"]+)"/)?.[1];
    if (direct || viaPath) return direct ?? viaPath;
    // Some milestones are imported as already-authored paths.
    const importSource = registry.match(new RegExp(`import\\s*\\{[^}]*\\b${symbol}\\b[^}]*\\}\\s*from\\s*"([^"]+)"`))?.[1];
    const imported = importSource ? sources.get(importSource.replace("./", "") + ".ts") ?? "" : "";
    return imported.match(new RegExp(`(?:export const )?${symbol}[^=]*=\\s*\\{\\s*id:\\s*"([^"]+)"`))?.[1] ?? null;
  });
  if (!expected.length || !actual.length || actual.includes(null) || JSON.stringify(expected) !== JSON.stringify(actual)) {
    failures.push(`planned/runtime path drift in ${schoolId}: planned=${expected.join(",")} runtime=${actual.join(",")}`);
  }
}

if (failures.length) {
  console.error("Curriculum integrity audit failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Curriculum integrity audit passed: ${files.length} runtime path files checked; school wiring, lesson-array reachability, milestone composition and canonical CI architecture are clean.`);
