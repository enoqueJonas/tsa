import type { LearningPath } from "./learning-path";
import { architectureGovernanceDeepLessons } from "./technical-steward-architecture-governance-deep";
import { changeServiceGovernanceDeepLessons } from "./technical-steward-change-service-governance-deep";
import { controlsComplianceAssuranceDeepLessons } from "./technical-steward-controls-compliance-assurance-deep";
import { engineeringGovernanceDeepLessons } from "./technical-steward-engineering-governance-deep";
import { handbookAndStandardsDeepLessons } from "./technical-steward-handbook-standards-deep";
import { technicalStewardMilestoneDeepLessons } from "./technical-steward-milestone-deep";
import { securityDataGovernanceDeepLessons } from "./technical-steward-security-data-governance-deep";
import { technicalDebtHealthDeepLessons } from "./technical-steward-technical-debt-health-deep";
import { technicalLeadershipDeepLessons } from "./technical-steward-technical-leadership-deep";
import { thirdPartyLifecycleRiskDeepLessons } from "./technical-steward-third-party-lifecycle-risk-deep";
import { technologyGovernanceDeepLessons } from "./technical-steward-technology-governance-deep";
import { technologyRiskDeepLessons } from "./technical-steward-technology-risk-deep";
import { technicalStrategyCapabilityDeepLessons } from "./technical-steward-strategy-capability-deep";

type StewardModel = { principle: string; example: string; counterexample: string };
const stewardshipModels: Record<string, StewardModel> = {
 "technical-leadership": { principle: "Lead decisions through shared context, delegated ownership and feedback, not positional authority.", example: "For Steward, write an inspectable technical leadership decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A technical leadership document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "engineering-governance": { principle: "Engineering governance defines decision rights, exceptions, assurance and improvement loops.", example: "For Steward, write an inspectable engineering governance decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A engineering governance document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "technology-governance": { principle: "Distinguish organizational accountability, technology management and audit evidence.", example: "For Steward, write an inspectable it and technology governance decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A it and technology governance document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "technology-strategy-capability": { principle: "Connect investment choices to capabilities, measurable outcomes and cost constraints.", example: "For Steward, write an inspectable technology strategy and capability planning decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A technology strategy and capability planning document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "technology-risk": { principle: "Describe risk as scenario, likelihood, impact, owner, controls and residual exposure.", example: "For Steward, write an inspectable technology risk decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A technology risk document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "controls-compliance-assurance": { principle: "Separate control design, operating effectiveness and independently reproducible evidence.", example: "For Steward, write an inspectable controls, compliance and assurance decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A controls, compliance and assurance document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "architecture-governance": { principle: "Apply decision records and review triggers proportionately to technical consequences.", example: "For Steward, write an inspectable architecture governance decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A architecture governance document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "security-data-governance": { principle: "Specify classification, retention, access, lawful use and accountable custodians.", example: "For Steward, write an inspectable security and data governance decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A security and data governance document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "change-service-governance": { principle: "Connect controlled change, service ownership, incident impact and recovery decisions.", example: "For Steward, write an inspectable change and service governance decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A change and service governance document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "third-party-lifecycle-risk": { principle: "Track vendor dependency, concentration, contractual control and exit feasibility.", example: "For Steward, write an inspectable third-party and technology lifecycle risk decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A third-party and technology lifecycle risk document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "technical-debt-health": { principle: "Record debt as a concrete consequence with remediation cost and measured trade-off.", example: "For Steward, write an inspectable technical debt and engineering health decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A technical debt and engineering health document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "handbook-and-standards": { principle: "Standards need enforceable rationale, examples, deviations and review ownership.", example: "For Steward, write an inspectable engineering handbook and standards decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A engineering handbook and standards document is not an implemented control if no accountable owner can show its real operation or its failure." },
 "technical-stewardship-review": { principle: "Demonstrate coherent stewardship through decisions, verified controls and retrospective correction.", example: "For Steward, write an inspectable technical steward milestone decision with owner, alternatives, evidence, exception handling and next review date.", counterexample: "A technical steward milestone document is not an implemented control if no accountable owner can show its real operation or its failure." },
};
function prepareStewardship(path: LearningPath): LearningPath {
 const model = stewardshipModels[path.id];
 if (!model) throw new Error(`Missing stewardship model: ${path.id}`);
 const lessons = path.lessons.map((lesson) => ({ ...lesson, activities: lesson.activities.flatMap((activity) => {
  if (activity.content.type !== "practical") return [activity];
  const task = activity.content;
  return [{ id: `${activity.id}-stewardship-preparation`, title: `Prepare accountable evidence: ${activity.title}`, estimatedMinutes: 20, content: { type: "reading" as const, body: `${task.scenario}\\n\\n${task.objective}`, blocks: [
    { type: "heading" as const, id: "decision-scope", text: "Decision, responsibility and context", level: 2 as const },
    { type: "paragraph" as const, text: task.scenario },
    { type: "paragraph" as const, text: model.principle },
    { type: "heading" as const, id: "first-actions", text: "Initial analytical steps", level: 2 as const },
    { type: "list" as const, items: task.instructions.slice(0,3), ordered: true },
    { type: "heading" as const, id: "accountability-evidence", text: "Operating effectiveness and acceptance evidence", level: 2 as const },
    { type: "list" as const, items: task.completionCriteria },
    { type: "heading" as const, id: "challenge-control", text: "Challenge the decision and document the exception", level: 2 as const },
    { type: "paragraph" as const, text: model.counterexample },
    { type: "paragraph" as const, text: "Name an accountable decision owner, a credible rejected option, residual exposure, the evidence that would trigger reconsideration and the next review point." },
  ] } }, activity];
 }) }));
 return { ...path, lessons: [{ id: `${path.id}-stewardship-model`, title: `Worked governance decision: ${path.title}`, activities: [{ id: `${path.id}-stewardship-model-reading`, title: "Decision rights, worked example and exception", estimatedMinutes: 30, content: { type: "reading", body: model.principle, blocks: [
   { type: "heading", id: "decision-rights", text: "Understand accountability before artifacts", level: 2 },
   { type: "paragraph", text: model.principle },
   { type: "heading", id: "worked-decision", text: "Worked Steward decision", level: 2 },
   { type: "paragraph", text: model.example },
   { type: "heading", id: "failed-control", text: "Counterexample and control weakness", level: 2 },
   { type: "paragraph", text: model.counterexample },
 ] } }] }, ...lessons] };
}

export const technicalLeadership: LearningPath = prepareStewardship({ id: "technical-leadership", title: "Technical Leadership", lessons: technicalLeadershipDeepLessons });
export const engineeringGovernance: LearningPath = prepareStewardship({ id: "engineering-governance", title: "Engineering Governance", lessons: engineeringGovernanceDeepLessons });
export const technologyGovernance: LearningPath = prepareStewardship({ id: "technology-governance", title: "IT and Technology Governance", lessons: technologyGovernanceDeepLessons });
export const technologyStrategyCapability: LearningPath = prepareStewardship({ id: "technology-strategy-capability", title: "Technology Strategy and Capability Planning", lessons: technicalStrategyCapabilityDeepLessons });
export const technologyRisk: LearningPath = prepareStewardship({ id: "technology-risk", title: "Technology Risk", lessons: technologyRiskDeepLessons });
export const controlsComplianceAssurance: LearningPath = prepareStewardship({ id: "controls-compliance-assurance", title: "Controls, Compliance and Assurance", lessons: controlsComplianceAssuranceDeepLessons });
export const architectureGovernance: LearningPath = prepareStewardship({ id: "architecture-governance", title: "Architecture Governance", lessons: architectureGovernanceDeepLessons });
export const securityDataGovernance: LearningPath = prepareStewardship({ id: "security-data-governance", title: "Security and Data Governance", lessons: securityDataGovernanceDeepLessons });
export const changeServiceGovernance: LearningPath = prepareStewardship({ id: "change-service-governance", title: "Change and Service Governance", lessons: changeServiceGovernanceDeepLessons });
export const thirdPartyLifecycleRisk: LearningPath = prepareStewardship({ id: "third-party-lifecycle-risk", title: "Third-party and Technology Lifecycle Risk", lessons: thirdPartyLifecycleRiskDeepLessons });
export const technicalDebtHealth: LearningPath = prepareStewardship({ id: "technical-debt-health", title: "Technical Debt and Engineering Health", lessons: technicalDebtHealthDeepLessons });
export const handbookAndStandards: LearningPath = prepareStewardship({ id: "handbook-and-standards", title: "Engineering Handbook and Standards", lessons: handbookAndStandardsDeepLessons });
export const technicalStewardshipReview: LearningPath = prepareStewardship({ id: "technical-stewardship-review", title: "Technical Steward Milestone", lessons: technicalStewardMilestoneDeepLessons });

export const technicalStewardPaths: LearningPath[] = [technicalLeadership, engineeringGovernance, technologyGovernance, technologyStrategyCapability, technologyRisk, controlsComplianceAssurance, architectureGovernance, securityDataGovernance, changeServiceGovernance, thirdPartyLifecycleRisk, technicalDebtHealth, handbookAndStandards, technicalStewardshipReview];
