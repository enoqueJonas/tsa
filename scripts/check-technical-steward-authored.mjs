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
  // Guard topic-specific conceptual explanation in the original Risk,
  // Assurance and Architecture readings; copied generic wrappers do not count.
  for (const [pathId, count, prefix, headings] of [
    ["technology-risk", 9, "technology-risk-", ["prerequisites", "mechanism", "alternatives"]],
    ["controls-compliance-assurance", 10, "controls-assurance-", ["prerequisites", "trace", "alternatives"]],
    ["architecture-governance", 8, "architecture-governance-", ["prerequisites", "mechanism", "alternatives"]],
  ]) {
    const pathModel = technicalStewardPaths.find((p) => p.id === pathId);
    const readings = pathModel.lessons.flatMap((lesson) => lesson.activities)
      .filter((a) => a.id.startsWith(prefix) && a.id.endsWith("-reading") && a.content.type === "reading");
    assert.equal(readings.length, count, `Concept depth coverage lost in ${pathId}`);
    for (const a of readings) {
      const topic = a.id.slice(prefix.length, -"-reading".length);
      const headingsFound = a.content.blocks?.filter((block) => block.type === "heading").map((block) => block.id) ?? [];
      const namespace = pathId === "technology-risk" ? topic : pathId === "architecture-governance" ? `arch-${topic}` : `control-${topic}`;
      for (const suffix of headings) {
        assert.ok(headingsFound.includes(`${namespace}-${suffix}`),
          `Concept depth missing ${suffix} for ${a.id}`);
      }
      assert.ok(a.content.blocks.some((block) => block.type === "callout" && block.tone === "warning"),
        `Need false-decision diagnosis in ${a.id}`);
    }
  }
  // The other 59 authored conceptual readings must not regress into a
  // framework label + one vague paragraph. Preserve the sections in the
  // ACTUALLY EXPORTED learner journey, not just in unreferenced source text.
  const remainingConceptSpecs = [
    ["technology-governance", 10, (id) => id, ["prerequisites", "mechanism", "alternatives"]],
    ["technology-strategy-capability", 6, (id) => id.replace(/^technical-strategy-/, ""), ["prerequisites", "mechanism", "alternatives"]],
    ["security-data-governance", 8, (id) => `security-${id.replace(/^security-data-governance-/, "")}`, ["prerequisites", "mechanism", "alternatives"]],
    ["change-service-governance", 8, (id) => `change-${id.replace(/^change-service-governance-/, "")}`, ["prerequisites", "mechanism", "alternatives"]],
    ["third-party-lifecycle-risk", 11, (id) => `lifecycle-${id.replace(/^third-party-lifecycle-risk-/, "")}`, ["prerequisites", "mechanism", "alternatives"]],
    ["technical-debt-health", 8, (id) => id, ["prerequisites", "mechanism", "alternatives"]],
    ["handbook-and-standards", 8, (id) => id, ["prerequisites", "causal-trace", "alternatives", "artifact"]],
  ];
  let checkedConcepts = 8 + 7 + 9 + 10 + 8;
  for (const [pathId, expected, headingStem, sections] of remainingConceptSpecs) {
    const p = technicalStewardPaths.find((entry) => entry.id === pathId);
    const readings = p.lessons.filter((lesson) => lesson.activities.some((a) => a.content.type === "reading"));
    assert.equal(readings.length, expected, `Wrong original conceptual lesson count for ${pathId}`);
    for (const lesson of readings) {
      const a = lesson.activities.find((entry) => entry.content.type === "reading");
      const blocks = a.content.blocks ?? [];
      const headingsFound = blocks.filter((block) => block.type === "heading").map((block) => block.id);
      for (const suffix of sections) {
        assert.ok(headingsFound.includes(`${headingStem(lesson.id)}-${suffix}`),
          `Missing ${suffix} in authored lesson ${lesson.id}`);
      }
      assert.ok(blocks.some((block) => block.type === "callout" && block.tone === "warning"),
        `Missing falsifying wrong-decision explanation: ${lesson.id}`);
      const explained = blocks.filter((block) => block.type === "paragraph" && block.text.length >= 220);
      assert.ok(explained.length >= 3,
        `No substantial prerequisite, mechanism and trade-off explanations: ${lesson.id}`);
      if (pathId === "handbook-and-standards") {
        assert.ok(blocks.some((block) => block.type === "code" &&
          block.language === "markdown" && block.code.length >= 270),
          `No copyable worked governance artifact for ${lesson.id}`);
      }
      checkedConcepts++;
    }
  }
  assert.equal(checkedConcepts, 101, "All 101 original Technical Steward conceptual readings must be depth-guarded");
  // PED-005: do not give instructions that merely say 'assess the evidence'.
  // At least these six high-consequence lessons must expose an executable
  // *fictional* case, expected output, and the paired practice's mutation task.
  for (const [pathId, stem] of [
    ["controls-compliance-assurance", "controls-assurance-effectiveness"],
    ["controls-compliance-assurance", "controls-assurance-testing"],
    ["change-service-governance", "change-service-governance-release-governance"],
    ["change-service-governance", "change-service-governance-evidence-release"],
    ["technology-risk", "technology-risk-inherent-residual"],
    ["technology-risk", "technology-risk-appetite-tolerance"],
  ]) {
    const learnerPath = technicalStewardPaths.find((path) => path.id === pathId);
    const activities = learnerPath.lessons.flatMap((lesson) => lesson.activities);
    const reading = activities.find((a) => a.id === `${stem}-reading`);
    const practical = activities.find((a) => a.id === `${stem}-practice`);
    assert.equal(reading?.content.type, "reading", `Missing executable reading ${stem}`);
    assert.equal(practical?.content.type, "practical", `Missing executable practice ${stem}`);
    const code = reading.content.blocks?.find((block) =>
      block.type === "code" &&
      block.code.includes("node labs/technical-steward/decision-evidence.mjs"));
    assert.ok(code?.output?.length >= 100, `Lab commands or expected outcome missing in ${stem}`);
    assert.ok(practical.content.instructions.some((step) => step.includes("labs/technical-steward/README.md")),
      `Executable practice instructions missing in ${stem}`);
    assert.ok(practical.content.completionCriteria.some((rule) => /scratch|output|offline/i.test(rule)),
      `Falsifiable command/output criterion missing in ${stem}`);
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
  console.log(`Technical Steward authored-path guard passed: ${modules.length} paths, ${total} activities, ${checkedConcepts} original concept readings and 83 new-case practicals.`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
