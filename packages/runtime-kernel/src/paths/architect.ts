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

export const architectureFundamentals: LearningPath = {
    id: "architecture-fundamentals",
    title: "Architecture Fundamentals",
    lessons: architectureFundamentalsDeepLessons,
};

export const modularity: LearningPath = {
    id: "modularity",
    title: "Modularity",
    lessons: modularityDeepLessons,
};

export const architecturalStyles: LearningPath = {
    id: "architectural-styles",
    title: "Architectural Styles",
    lessons: architecturalStylesDeepLessons,
};

export const domainModeling: LearningPath = {
    id: "domain-modeling",
    title: "Domain Modeling",
    lessons: domainModelingDeepLessons,
};

export const dataArchitecture: LearningPath = {
    id: "data-architecture",
    title: "Data Architecture",
    lessons: dataArchitectureDeepLessons,
};

export const integrationAndMessaging: LearningPath = {
    id: "integration-and-messaging",
    title: "Integration and Messaging",
    lessons: integrationAndMessagingDeepLessons,
};

export const scalabilityAndDistributedSystems: LearningPath = {
    id: "scalability-and-distributed-systems",
    title: "Scalability and Distributed Systems",
    lessons: scalabilityAndDistributedSystemsDeepLessons,
};

export const resilienceArchitecture: LearningPath = {
    id: "resilience-architecture",
    title: "Resilience Architecture",
    lessons: resilienceArchitectureDeepLessons,
};

export const architectureEvaluationAndGovernance: LearningPath = {
    id: "architecture-evaluation-and-governance",
    title: "Architecture Evaluation and Governance",
    lessons: architectureEvaluationAndGovernanceDeepLessons,
};

export const stewardArchitectureEvolution: LearningPath = {
    id: "steward-architecture-evolution",
    title: "Architect Milestone",
    lessons: architectMilestoneDeepLessons,
};

export const architectPaths: LearningPath[] = [
    architectureFundamentals,
    modularity,
    architecturalStyles,
    domainModeling,
    dataArchitecture,
    integrationAndMessaging,
    scalabilityAndDistributedSystems,
    resilienceArchitecture,
    architectureEvaluationAndGovernance,
    stewardArchitectureEvolution,
];
