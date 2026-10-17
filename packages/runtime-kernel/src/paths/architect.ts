import type { LearningPath } from "./learning-path";
import { architectureEvaluationAndGovernanceDeepLessons } from "./architect-evaluation-governance-deep";
import { architectureFundamentalsDeepLessons } from "./architect-architecture-fundamentals-deep";
import { architectMilestoneDeepLessons } from "./architect-milestone-deep";
import { architecturalStylesDeepLessons } from "./architect-architectural-styles-deep";
import { dataArchitectureDeepLessons } from "./architect-data-architecture-deep";
import { domainModelingDeepLessons } from "./architect-domain-modeling-deep";
import { integrationAndMessagingDeepLessons } from "./architect-integration-and-messaging-deep";
import { modularityDeepLessons } from "./architect-modularity-deep";
import { resilienceArchitectureDeepLessons } from "./architect-resilience-architecture-deep";
import { scalabilityAndDistributedSystemsDeepLessons } from "./architect-scalability-distributed-systems-deep";

type ArchitectureGuide = { model: string; caseStudy: string; warning: string };
const architectureGuides: Record<string, ArchitectureGuide> = {
    "architecture-fundamentals": { model: "Architecture records consequential decisions under constraints, not just diagrams.", caseStudy: "Compare two Steward deployment options against availability, skills and budget constraints.", warning: "A pretty diagram without explicit assumptions cannot justify a decision." },
    "domain-modeling": { model: "Domain language and invariants precede databases, services and frameworks.", caseStudy: "Model Steward request, job and assignment lifecycles including invalid transitions.", warning: "A database table list is not a domain model." },
    "modularity": { model: "A module should encapsulate a cohesive responsibility behind a stable interface.", caseStudy: "Separate authorization logic from job scheduling and test both through public contracts.", warning: "A circular dependency indicates unclear ownership." },
    "architectural-styles": { model: "A monolith, modular monolith and services trade deployability for coordination costs.", caseStudy: "Select a style for Steward using real team capacity and deployment constraints.", warning: "Microservices cannot compensate for absent domain boundaries." },
    "data-architecture": { model: "Data ownership, consistency, retention and migrations determine state integrity.", caseStudy: "Trace a Steward transaction across application and persistence boundaries.", warning: "A distributed write without an explicit consistency model may lose or duplicate work." },
    "integration-and-messaging": { model: "Synchronous APIs and asynchronous messages differ in delivery, failure and idempotence.", caseStudy: "Model an event-driven Steward notification with duplicate delivery and delayed consumers.", warning: "Exactly-once business effects require explicit design even when a broker promises delivery guarantees." },
    "scalability-and-distributed-systems": { model: "Capacity depends on workload, contention and latency, not component count.", caseStudy: "Measure one bottleneck and compare scale-up with bounded scale-out.", warning: "Adding replicas cannot fix a single serialized database bottleneck." },
    "resilience-architecture": { model: "Resilience is engineered through isolation, timeouts, fallback and recovery contracts.", caseStudy: "Design a dependency failure scenario and show which operations degrade safely.", warning: "Retries without budgets can multiply the original overload." },
    "architecture-evaluation-and-governance": { model: "Architecture reviews compare options against evidence and record reversible versus irreversible decisions.", caseStudy: "Write an ADR with drivers, alternatives, chosen option and falsifiable assumptions.", warning: "An ADR without rejected alternatives hides trade-offs." },
    "steward-architecture-evolution": { model: "Evolution proposals must preserve existing user outcomes during migration.", caseStudy: "Stage a Steward boundary refactor with baseline tests, compatibility period and rollback.", warning: "A diagram-only migration is not evidence of operational safety." },
};
function deepenArchitecture(path: LearningPath): LearningPath {
 const guide = architectureGuides[path.id];
 if (!guide) throw new Error(`Architecture instructional model missing: ${path.id}`);
 const expanded = path.lessons.map((lesson) => ({ ...lesson, activities: lesson.activities.flatMap((activity) => {
   if (activity.content.type !== "practical") return [activity];
   const task = activity.content;
   return [{ id: `${activity.id}-architecture-preparation`, title: `Prepare the decision: ${activity.title}`, estimatedMinutes: 20,
     content: { type: "reading" as const, body: `${task.scenario}\\n\\n${task.objective}`, blocks: [
       { type: "heading" as const, id: "decision-drivers", text: "Decision drivers and context", level: 2 as const },
       { type: "paragraph" as const, text: task.scenario },
       { type: "paragraph" as const, text: guide.model },
       { type: "heading" as const, id: "decision-execution", text: "First analytical steps", level: 2 as const },
       { type: "list" as const, items: task.instructions.slice(0,3), ordered: true },
       { type: "heading" as const, id: "decision-evidence", text: "Evidence and acceptance", level: 2 as const },
       { type: "list" as const, items: task.completionCriteria },
       { type: "heading" as const, id: "rejected-case", text: "Counterexample and migration risk", level: 2 as const },
       { type: "paragraph" as const, text: guide.warning },
       { type: "paragraph" as const, text: "Document at least one credible alternative, its rejected trade-off, a decision-reversal trigger, and the test or observation that could falsify the preferred option." },
     ] } }, activity];
 }) }));
 return { ...path, lessons: [{ id: `${path.id}-architecture-model`, title: `Worked architecture decision: ${path.title}`, activities: [{ id: `${path.id}-architecture-model-reading`, title: "Concept, concrete choice and counterexample", estimatedMinutes: 30, content: { type: "reading", body: guide.model, blocks: [
   { type: "heading", id: "architecture-concept", text: "Understand the decision boundary", level: 2 },
   { type: "paragraph", text: guide.model },
   { type: "heading", id: "worked-choice", text: "Worked Steward architecture decision", level: 2 },
   { type: "paragraph", text: guide.caseStudy },
   { type: "heading", id: "counterexample", text: "Failure or counterexample", level: 2 },
   { type: "paragraph", text: guide.warning },
 ] } }] }, ...expanded] };
}

export const architectureFundamentals: LearningPath = deepenArchitecture({ id: "architecture-fundamentals", title: "Architecture Fundamentals", lessons: architectureFundamentalsDeepLessons });
export const modularity: LearningPath = deepenArchitecture({ id: "modularity", title: "Modularity", lessons: modularityDeepLessons });
export const architecturalStyles: LearningPath = deepenArchitecture({ id: "architectural-styles", title: "Architectural Styles", lessons: architecturalStylesDeepLessons });
export const domainModeling: LearningPath = deepenArchitecture({ id: "domain-modeling", title: "Domain Modeling", lessons: domainModelingDeepLessons });
export const dataArchitecture: LearningPath = deepenArchitecture({ id: "data-architecture", title: "Data Architecture", lessons: dataArchitectureDeepLessons });
export const integrationAndMessaging: LearningPath = deepenArchitecture({ id: "integration-and-messaging", title: "Integration and Messaging", lessons: integrationAndMessagingDeepLessons });
export const scalabilityAndDistributedSystems: LearningPath = deepenArchitecture({ id: "scalability-and-distributed-systems", title: "Scalability and Distributed Systems", lessons: scalabilityAndDistributedSystemsDeepLessons });
export const resilienceArchitecture: LearningPath = deepenArchitecture({ id: "resilience-architecture", title: "Resilience Architecture", lessons: resilienceArchitectureDeepLessons });
export const architectureEvaluationAndGovernance: LearningPath = deepenArchitecture({ id: "architecture-evaluation-and-governance", title: "Architecture Evaluation and Governance", lessons: architectureEvaluationAndGovernanceDeepLessons });
export const stewardArchitectureEvolution: LearningPath = deepenArchitecture({ id: "steward-architecture-evolution", title: "Architect Milestone", lessons: architectMilestoneDeepLessons });

// Understand the domain and its boundaries before selecting structural styles.
export const architectPaths: LearningPath[] = [
    architectureFundamentals,
    domainModeling,
    modularity,
    architecturalStyles,
    dataArchitecture,
    integrationAndMessaging,
    scalabilityAndDistributedSystems,
    resilienceArchitecture,
    architectureEvaluationAndGovernance,
    stewardArchitectureEvolution,
];
