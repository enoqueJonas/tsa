import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Compare the real exported learner path to the original authored lessons.
// Structural equality alone is not a pedagogical-depth or learner-validation claim.
const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "packages/runtime-kernel/src/paths");
const modules = [
  ["technical-leadership", "technicalLeadershipDeepLessons", "technical-leadership"],
  ["engineering-governance", "engineeringGovernanceDeepLessons", "engineering-governance"],
  ["technology-governance", "technologyGovernanceDeepLessons", "technology-governance"],
  ["strategy-capability", "technicalStrategyCapabilityDeepLessons", "technology-strategy-capability"],
  ["technology-risk", "technologyRiskDeepLessons", "technology-risk"],
  ["controls-compliance-assurance", "controlsComplianceAssuranceDeepLessons", "controls-compliance-assurance"],
  ["architecture-governance", "architectureGovernanceDeepLessons", "architecture-governance"],
  ["security-data-governance", "securityDataGovernanceDeepLessons", "security-data-governance"],
  ["change-service-governance", "changeServiceGovernanceDeepLessons", "change-service-governance"],
  ["third-party-lifecycle-risk", "thirdPartyLifecycleRiskDeepLessons", "third-party-lifecycle-risk"],
  ["technical-debt-health", "technicalDebtHealthDeepLessons", "technical-debt-health"],
  ["handbook-standards", "handbookAndStandardsDeepLessons", "handbook-and-standards"],
  ["milestone", "technicalStewardMilestoneDeepLessons", "technical-stewardship-review"],
];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-steward-authored-"));
try {
  const files = ["technical-steward.ts", ...modules.map(([stem]) => `technical-steward-${stem}-deep.ts`)];
  for (const filename of files) {
    const tsSource = fs.readFileSync(path.join(source, filename), "utf8");
    const js = ts.transpileModule(tsSource, {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    fs.writeFileSync(path.join(tmp, filename.replace(/\.ts$/, ".js")), js);
  }
  fs.writeFileSync(path.join(tmp, "package.json"), '{"type":"commonjs"}');
  const requireModule = createRequire(path.join(tmp, "main.cjs"));
  const { technicalStewardPaths } = requireModule("./technical-steward.js");
  assert.equal(technicalStewardPaths.length, modules.length, "All 13 Technical Steward paths must be present");
  const pathIds = new Set();
  const activityIds = new Set();
  let total = 0;

  for (const [stem, exportName, pathId] of modules) {
    const pathModel = technicalStewardPaths.find((entry) => entry.id === pathId);
    assert.ok(pathModel, `Missing learner path ${pathId}`);
    assert.ok(!pathIds.has(pathId), `Duplicate learner path ${pathId}`);
    pathIds.add(pathId);
    const authored = requireModule(`./technical-steward-${stem}-deep.js`)[exportName];
    assert.ok(Array.isArray(authored) && authored.length > 0, `Missing authored lessons: ${pathId}`);
    assert.deepEqual(
      pathModel.lessons.map((lesson) => ({ id: lesson.id, activities: lesson.activities.map((activity) => activity.id) })),
      authored.map((lesson) => ({ id: lesson.id, activities: lesson.activities.map((activity) => activity.id) })),
      `Learner path ${pathId} must use only its original authored lessons in source order`,
    );
    for (const lesson of pathModel.lessons) {
      assert.ok(!lesson.id.endsWith("-stewardship-model"), `Generic model lesson: ${lesson.id}`);
      for (const activity of lesson.activities) {
        assert.ok(!activity.id.endsWith("-stewardship-preparation"), `Generic preparation: ${activity.id}`);
        assert.ok(!activityIds.has(activity.id), `Duplicate Technical Steward activity ID: ${activity.id}`);
        activityIds.add(activity.id);
        total++;
      }
    }
  }
  // A case added to source code but omitted from rendered blocks is not instruction.
  // These minima only verify wiring, NOT depth, accessibility or learner comprehension.
  const caseMinimums = [
    ["technical-leadership", 8],
    ["engineering-governance", 7],
    ["technology-governance", 5],
    ["controls-compliance-assurance", 7],
    ["architecture-governance", 5],
    ["security-data-governance", 5],
    ["change-service-governance", 6],
    ["third-party-lifecycle-risk", 7],
    ["technical-debt-health", 5],
  ];
  for (const [id, min] of caseMinimums) {
    const learnerPath = technicalStewardPaths.find((entry) => entry.id === id);
    const evidencedReadings = learnerPath.lessons.flatMap((lesson) => lesson.activities).filter((activity) => {
      if (activity.content.type !== "reading") return false;
      const blocks = activity.content.blocks ?? [];
      return blocks.some((block) => block.type === "callout" && block.tone === "warning") &&
        blocks.some((block) => block.type === "heading" && /transfer/i.test(block.id));
    });
    assert.ok(evidencedReadings.length >= min,
      `Expected >= ${min} source-rendered worked/failure/transfer readings in ${id}; got ${evidencedReadings.length}`);
  }
  const riskPath = technicalStewardPaths.find((entry) => entry.id === "technology-risk");
  const riskWorked = riskPath.lessons.flatMap((lesson) => lesson.activities).filter((activity) =>
    activity.content.type === "reading" &&
    (activity.content.blocks ?? []).some((block) => block.type === "callout" && block.title === "Worked scenario"));
  assert.ok(riskWorked.length >= 9, `All 9 Technology Risk topics need source-rendered worked cases; found ${riskWorked.length}`);

  console.log(`Technical Steward authored-path guard passed: ${modules.length} paths, ${total} original activities, no generated governance/preparation wrappers.`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
