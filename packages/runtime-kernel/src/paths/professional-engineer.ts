import type { LearningPath } from "./learning-path";
import { capstoneProblemDiscoveryDeepLessons } from "./professional-engineer-capstone-problem-discovery-deep";
import { capstoneEngineeringProposalDeepLessons } from "./professional-engineer-capstone-engineering-proposal-deep";
import { capstoneIndependentBuildDeepLessons } from "./professional-engineer-independent-build-deep";
import { capstoneProductionReadinessDeepLessons } from "./professional-engineer-production-readiness-deep";
import { capstoneDefenceDeepLessons } from "./professional-engineer-defence-deep";
import { professionalPracticeDeepLessons } from "./professional-engineer-professional-practice-deep";
import { professionalPortfolioReflectionDeepLessons } from "./professional-engineer-portfolio-reflection-deep";

type ProfessionalGuide = { model: string; caseStudy: string; weakness: string };
const professionalGuides: Record<string, ProfessionalGuide> = {
 "professional-practice": { model: "Ethics and professional responsibility require explicit stakeholders, conflicts and justified decisions.", caseStudy: "Describe a Steward delivery shortcut, affected users and a reasoned decision that rejects unsafe pressure.", weakness: "Meeting a deadline never substitutes for informed risk acceptance." },
 "capstone-problem-discovery": { model: "A capstone begins with observed stakeholder pain, measurable outcomes and hard constraints.", caseStudy: "Interview representative synthetic Steward stakeholders and record conflicting requirements without inventing evidence.", weakness: "A preferred technology is not a problem statement." },
 "capstone-engineering-proposal": { model: "Proposals compare viable options, scope, risks and evidence before implementation.", caseStudy: "Contrast a modular application with a multi-service approach using cost, operations and testability.", weakness: "A diagram without acceptance criteria cannot guide a reproducible build." },
 "capstone-independent-build": { model: "An independent build must demonstrate authorship, traceability, executable behavior and negative-case testing.", caseStudy: "Implement one vertical Steward feature from a new repository with tests, reviewable commits and a failing-case check.", weakness: "A copied tutorial or unrun code sample does not prove independent competence." },
 "capstone-production-readiness": { model: "Readiness requires realistic deployment evidence, recovery, security and owned operations.", caseStudy: "Release a disposable capstone with logs, backups, TLS and a measured restore exercise.", weakness: "Green unit tests cannot demonstrate recoverability." },
 "professional-portfolio-reflection": { model: "A portfolio should connect decisions, evidence, mistakes, improvements and clear individual contribution.", caseStudy: "Select one accepted increment and document the original hypothesis, rejected alternative and observed result.", weakness: "Screenshots without underlying artifacts are weak evidence." },
 "capstone-defence": { model: "Engineering defence tests claims against observed artifacts, alternatives, limitations and counterarguments.", caseStudy: "Defend one choice using a live or reproducible demonstration and explain what would invalidate it.", weakness: "Confidence or slide polish is not evidence that an implementation works." },
};
function prepareProfessional(path: LearningPath): LearningPath {
 const guide = professionalGuides[path.id];
 if (!guide) throw new Error(`Missing professional model: ${path.id}`);
 const lessons = path.lessons.map((lesson) => ({ ...lesson, activities: lesson.activities.flatMap((activity) => {
   if (activity.content.type !== "practical") return [activity];
   const task = activity.content;
   return [{ id: `${activity.id}-professional-preparation`, title: `Plan independent evidence: ${activity.title}`, estimatedMinutes: 20, content: { type: "reading" as const, body: `${task.objective}\\n\\n${task.scenario}`, blocks: [
     { type: "heading" as const, id: "claim-and-context", text: "Claim, stakeholder and scope", level: 2 as const },
     { type: "paragraph" as const, text: task.scenario },
     { type: "paragraph" as const, text: guide.model },
     { type: "heading" as const, id: "first-evidence", text: "First evidence-gathering steps", level: 2 as const },
     { type: "list" as const, items: task.instructions.slice(0,3), ordered: true },
     { type: "heading" as const, id: "independent-acceptance", text: "Acceptance and reproducibility", level: 2 as const },
     { type: "list" as const, items: task.completionCriteria },
     { type: "heading" as const, id: "challenge-and-limit", text: "Counterclaim, limitation and recovery", level: 2 as const },
     { type: "paragraph" as const, text: guide.weakness },
     { type: "paragraph" as const, text: "Identify one counterargument, a specific boundary where the result may fail, and reproducible evidence sufficient for independent review. Never fabricate execution, interview or production evidence." },
   ] } }, activity];
 }) }));
 return { ...path, lessons: [{ id: `${path.id}-professional-model`, title: `Worked evidence case: ${path.title}`, activities: [{ id: `${path.id}-professional-model-reading`, title: "Concept, worked claim and counterexample", estimatedMinutes: 30, content: { type: "reading", body: guide.model, blocks: [
   { type: "heading", id: "professional-concept", text: "Understand the evidence boundary", level: 2 },
   { type: "paragraph", text: guide.model },
   { type: "heading", id: "worked-claim", text: "Worked Steward case", level: 2 },
   { type: "paragraph", text: guide.caseStudy },
   { type: "heading", id: "counterclaim", text: "Counterargument and failure", level: 2 },
   { type: "paragraph", text: guide.weakness },
 ] } }] }, ...lessons] };
}

export const professionalPractice: LearningPath = prepareProfessional({ id: "professional-practice", title: "Professional Practice and Ethics", lessons: professionalPracticeDeepLessons });
export const capstoneProblemDiscovery: LearningPath = prepareProfessional({ id: "capstone-problem-discovery", title: "Capstone Problem Discovery", lessons: capstoneProblemDiscoveryDeepLessons });
export const capstoneEngineeringProposal: LearningPath = prepareProfessional({ id: "capstone-engineering-proposal", title: "Capstone Engineering Proposal", lessons: capstoneEngineeringProposalDeepLessons });
export const capstoneIndependentBuild: LearningPath = prepareProfessional({ id: "capstone-independent-build", title: "Independent Build", lessons: capstoneIndependentBuildDeepLessons });
export const capstoneProductionReadiness: LearningPath = prepareProfessional({ id: "capstone-production-readiness", title: "Production Readiness", lessons: capstoneProductionReadinessDeepLessons });
export const professionalPortfolioReflection: LearningPath = prepareProfessional({ id: "professional-portfolio-reflection", title: "Engineering Portfolio and Reflective Practice", lessons: professionalPortfolioReflectionDeepLessons });
export const capstoneDefence: LearningPath = prepareProfessional({ id: "capstone-defence", title: "Engineering Defence", lessons: capstoneDefenceDeepLessons });

export const professionalEngineerPaths: LearningPath[] = [professionalPractice, capstoneProblemDiscovery, capstoneEngineeringProposal, capstoneIndependentBuild, capstoneProductionReadiness, professionalPortfolioReflection, capstoneDefence];
