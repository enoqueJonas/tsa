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

// Preserve the evidence-gated steward-common lifecycle across Builder and Delivery.
const builderSoftwareCraft = sources.get("builder-software-craft-quality.ts") ?? "";
const deliveryArtifacts = sources.get("delivery-artifact-supply-chain-deep.ts") ?? "";
for (const required of ["more than one real consumer", "Internal-package boundary assessment"]) {
  if (!builderSoftwareCraft.includes(required)) failures.push(`Builder steward-common gate is missing required evidence: ${required}`);
}
for (const required of ["If steward-common has independently earned extraction", "otherwise use an explicitly labeled minimal training package", "If extraction was deferred, use an explicit fixture"]) {
  if (!deliveryArtifacts.includes(required)) failures.push(`Delivery steward-common lifecycle must preserve conditional distribution semantics: ${required}`);
}

// Preserve the deferred shared-test-library architecture across executable schools.
const qualityRuntimeFiles = [...sources.entries()].filter(([file]) => file.startsWith("quality-"));
const qualityRuntime = qualityRuntimeFiles.map(([, source]) => source).join("\n");
const professionalBuild = sources.get("professional-engineer-independent-build-deep.ts") ?? "";
const prematureTestCorePatterns = [
  /(?:extract|create|publish|deploy)\\s+(?:the\\s+)?`?tsa-test-core`?/i,
  /com\\.tsa:tsa-test-core/i,
  /(?:consume|resolve|import)\\s+(?:the\\s+)?`?tsa-test-core`?/i,
];
for (const [file, source] of qualityRuntimeFiles) {
  if (prematureTestCorePatterns.some((pattern) => pattern.test(source)) && !/do not (?:extract|create|publish)|must not exist yet|does not exist yet|before tsa-test-core can exist|candidate|future/i.test(source)) {
    failures.push(`Quality Steward must not materialize tsa-test-core before a genuine second consumer exists: ${file}`);
  }
}
for (const required of ["Earn and Publish tsa-test-core from Two Real Products", "pre-extraction capstone test baseline", "Versioned Nexus artifact"]) {
  if (!professionalBuild.includes(required)) {
    failures.push(`Professional Engineer tsa-test-core two-consumer gate is missing required evidence: ${required}`);
  }
}

// Security Steward may secure internal packages only when earlier evidence says they exist.
const securitySupplyChain = sources.get("security-container-delivery-deep.ts") ?? "";
for (const forbidden of [
  "downloads tsa-test-core",
  "Steward's chain includes source control, CI, Nexus, steward-common, tsa-test-core",
  "Credentials that publish steward-common or tsa-test-core",
  "resolve steward-common and tsa-test-core from approved internal sources",
  "Verify steward-common and tsa-test-core resolve from intended repositories and versions",
]) {
  if (securitySupplyChain.includes(forbidden)) failures.push(`Security Steward must not assume deferred shared packages exist: ${forbidden}`);
}
for (const required of ["only the internal packages whose earlier extraction gates were actually earned", "only internal packages that actually exist", "only when they exist in the release/dependency evidence"]) {
  if (!securitySupplyChain.includes(required)) failures.push(`Security Steward package lifecycle guard is missing conditional evidence: ${required}`);
}

// Preserve the System Thinker -> Platform Builder file-integration ownership boundary.
// System Thinker may model shared-filesystem semantics, but must not require the later NFS implementation.
const systemFileIntegration = sources.get("system-thinker-enterprise-file-integration-deep.ts") ?? "";
const platformFileServices = sources.get("platform-builder-enterprise-file-directory-services-deep.ts") ?? "";
for (const required of ["do not deploy NFS yet", "Platform Builder implementation handoff note"]) {
  if (!systemFileIntegration.includes(required)) failures.push(`System Thinker file integration must preserve pre-NFS handoff evidence: ${required}`);
}
for (const required of ["NFS is actually served and consumed across the network.", "Enterprise File Services: NFS and SMB"]) {
  if (!platformFileServices.includes(required)) failures.push(`Platform Builder must own implemented network file services: ${required}`);
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
console.log(`Curriculum integrity audit passed: ${files.length} runtime path files checked; school wiring, planned/runtime path parity, lesson-array reachability, milestone composition, canonical CI architecture, evidence-gated shared-library lifecycles across Builder, Delivery, Quality and Security, plus cross-school file-integration ownership, are clean.`);
