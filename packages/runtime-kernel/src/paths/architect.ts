import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
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

function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = { id: `${lessonId}-001`, title, estimatedMinutes: title.startsWith("Milestone:") ? 420 : practical ? 75 : 12, content: practical ? {
        type: "practical", objective: focus ?? `Evaluate and evolve ${title.replace(/^(Lab|Milestone): /, "")} in the Steward ecosystem.`,
        scenario: "Treat the complete Steward ecosystem as a system with history: application code, PostgreSQL, internal packages, automation, Nexus, delivery infrastructure, cloud/VPS hosting, security controls and reliability practices. Architecture work must respond to evidence and quality attributes rather than fashion.",
        instructions: ["State the business/engineering problem and architecture drivers before proposing a structural change.", "Model the relevant current-state boundaries, dependencies, data flows and operational constraints.", "Identify at least two credible options, including retaining the current design when appropriate.", "Evaluate trade-offs against explicit architecture characteristics and evidence gathered in earlier schools.", "Record significant decisions and consequences in ADR-style form.", "Implement a change only when the evidence justifies it; otherwise document why the current architecture should remain."],
        deliverables: ["Current-state architecture evidence", "Options and trade-off analysis", "Architecture decision and validation evidence"],
        completionCriteria: ["The recommendation follows from explicit drivers rather than a preferred technology.", "Costs, coupling, failure modes and operational consequences are considered.", "Keeping a modular monolith or shared package is accepted when it remains the best-supported choice."],
    } : { type: "reading", body: focus ?? `This breadth lesson establishes ${title} as an architecture capability for the mature Steward ecosystem. Deep authoring will add researched TSA teaching, architecture cases, resources, exercises and review questions.` } };
    return { id: lessonId, title, activities: [activity] };
}

export const architectureFundamentals: LearningPath = { id: "architecture-fundamentals", title: "Architecture Fundamentals", lessons: architectureFundamentalsDeepLessons };
export const modularity: LearningPath = { id: "modularity", title: "Modularity", lessons: modularityDeepLessons };
export const architecturalStyles: LearningPath = { id: "architectural-styles", title: "Architectural Styles", lessons: architecturalStylesDeepLessons };
export const domainModeling: LearningPath = { id: "domain-modeling", title: "Domain Modeling", lessons: domainModelingDeepLessons };
export const dataArchitecture: LearningPath = { id: "data-architecture", title: "Data Architecture", lessons: dataArchitectureDeepLessons };
export const integrationAndMessaging: LearningPath = { id: "integration-and-messaging", title: "Integration and Messaging", lessons: integrationAndMessagingDeepLessons };
export const scalabilityAndDistributedSystems: LearningPath = { id: "scalability-and-distributed-systems", title: "Scalability and Distributed Systems", lessons: scalabilityAndDistributedSystemsDeepLessons };
export const resilienceArchitecture: LearningPath = { id: "resilience-architecture", title: "Resilience Architecture", lessons: resilienceArchitectureDeepLessons };
export const architectureEvaluationAndGovernance: LearningPath = { id: "architecture-evaluation-and-governance", title: "Architecture Evaluation and Governance", lessons: architectureEvaluationAndGovernanceDeepLessons };
export const stewardArchitectureEvolution: LearningPath = { id: "steward-architecture-evolution", title: "Architect Milestone", lessons: architectMilestoneDeepLessons };

export const architectPaths: LearningPath[] = [architectureFundamentals, modularity, architecturalStyles, domainModeling, dataArchitecture, integrationAndMessaging, scalabilityAndDistributedSystems, resilienceArchitecture, architectureEvaluationAndGovernance, stewardArchitectureEvolution];
