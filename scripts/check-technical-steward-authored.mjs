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
  // Structural guard for source-authored prerequisite and mechanism sections
  // in the first two paths. Inspect meaning as a separate human gate.
  for (const [id, expected] of [["technical-leadership", 8], ["engineering-governance", 7]]) {
    const originalReadings = technicalStewardPaths.find((entry) => entry.id === id)
      .lessons.flatMap((lesson) => lesson.activities)
      .filter((activity) => activity.id.endsWith("-reading") && activity.content.type === "reading");
    assert.equal(originalReadings.length, expected);
    for (const activity of originalReadings) {
      const blocks = activity.content.blocks ?? [];
      for (const suffix of ["definition", "prerequisites", "mechanism", "alternatives"]) {
        assert.ok(blocks.some((block) => block.type === "heading" && block.id === `${activity.id.slice(0, -8)}-${suffix}`),
          `Missing explicit ${suffix} in original reading ${activity.id}`);
      }
    }
  }
  // A case added to source code but omitted from rendered blocks is not instruction.
  // These minima only verify wiring, NOT depth, accessibility or learner comprehension.
  const caseMinimums = [
    ["technical-leadership", 8],
    ["engineering-governance", 7],
    ["technology-governance", 10],
    ["technology-strategy-capability", 6],
    ["controls-compliance-assurance", 10],
    ["architecture-governance", 8],
    ["security-data-governance", 8],
    ["change-service-governance", 8],
    ["third-party-lifecycle-risk", 11],
    ["technical-debt-health", 8],
    ["handbook-and-standards", 8],
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

  // Original topic practices must actually carry an unseen case and falsifying
  // assessor condition. This is stricter than checking list length or activity count.
  const practiceMinimums = [
    ["technical-leadership", 8],
    ["engineering-governance", 7],
    ["technology-strategy-capability", 6],
    ["technology-risk", 9],
    ["controls-compliance-assurance", 10],
    ["architecture-governance", 8],
    ["security-data-governance", 8],
    ["change-service-governance", 8],
    ["third-party-lifecycle-risk", 11],
    ["technical-debt-health", 8],
  ];
  for (const [id, count] of practiceMinimums) {
    const learnerPath = technicalStewardPaths.find((entry) => entry.id === id);
    const originalTopicPracticals = learnerPath.lessons.flatMap((lesson) => lesson.activities)
      .filter((activity) => activity.id.endsWith("-practice") && activity.content.type === "practical");
    assert.equal(originalTopicPracticals.length, count,
      `Every original ${id} topic must retain its own assessment, not be replaced with a generated lab`);
    for (const activity of originalTopicPracticals) {
      const c = activity.content;
      assert.match(c.scenario, /INDEPENDENT|UNSEEN|NOVEL/i,
        `Original assessment must contain a new case: ${activity.id}`);
      assert.ok(c.completionCriteria.some((rule) => /reject|disqualif|false/i.test(rule)),
        `Original assessment lacks a disqualifying failure oracle: ${activity.id}`);
      assert.ok(c.instructions.length >= 3 && c.deliverables.length >= 3,
        `Original assessment has insufficient concrete work products: ${activity.id}`);
    }
  }
  for (const [id, expectedId, expectedMinutes] of [
    ["technology-governance", "technology-governance-lab-map-steward-governance-responsibilities-001", 180],
    ["handbook-and-standards", "handbook-and-standards-lab-build-the-steward-engineering-handbook-001", 390],
  ]) {
    const pathModel = technicalStewardPaths.find((entry) => entry.id === id);
    const lab = pathModel.lessons.find((lesson) => lesson.activities.some((a) => a.id === expectedId));
    assert.ok(lab, `Missing original multi-phase lab ${id}`);
    assert.equal(lab.activities.length, 3, `Overbroad ${id} lab must have three independently assessed phases`);
    assert.equal(lab.activities[0].id, expectedId, `Preserve existing ${id} lab progress ID`);
    assert.equal(lab.activities.reduce((sum, a) => sum + a.estimatedMinutes, 0), expectedMinutes);
    assert.ok(lab.activities.every((a) => a.content.type === "practical" &&
      a.content.completionCriteria.length >= 3 && a.content.deliverables.length >= 3));
  }
  const capstone = technicalStewardPaths.find((entry) => entry.id === "technical-stewardship-review");
  const phases = capstone.lessons.flatMap((lesson) => lesson.activities);
  assert.equal(phases.length, 4, "The 600-minute capstone must have four independently assessable evidence gates");
  assert.equal(phases[0].id, "technical-stewardship-review-milestone-technical-stewardship-review-001",
    "Keep the original capstone activity ID for legacy progress");
  assert.equal(phases.reduce((sum, activity) => sum + activity.estimatedMinutes, 0), 600,
    "Splitting the capstone must not create inflated total learner time");
  for (const phase of phases) {
    assert.equal(phase.content.type, "practical");
    assert.ok(phase.content.instructions.length >= 2);
    assert.ok(phase.content.deliverables.length >= 3);
    assert.ok(phase.content.completionCriteria.length >= 3);
  }
  console.log(`Technical Steward authored-path guard passed: ${modules.length} paths, ${total} original activities, no generated governance/preparation wrappers.`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
