import { cloudArchitectureAndCostQualityLessons } from "./cloud-architecture-cost-quality";
import { cloudAndHostingModelsQualityLessons } from "./cloud-hosting-models-quality";
import { cloudBuildingBlocksQualityLessons } from "./cloud-building-blocks-quality";
import { cloudEngineerMilestoneDeepLessons } from "./cloud-engineer-milestone-deep";
import { cloudOrchestrationGitOpsDeepLessons } from "./cloud-orchestration-gitops-deep";
import { infrastructureAsCodeQualityLessons } from "./cloud-infrastructure-as-code-quality";
import { internetNetworkingQualityLessons } from "./cloud-internet-networking-quality";
import { vpsOperationsQualityLessons } from "./cloud-vps-operations-quality";
import type { LearningPath } from "./learning-path";

export const cloudAndHostingModels: LearningPath = {
    id: "cloud-and-hosting-models",
    title: "Cloud and Hosting Models",
    lessons: cloudAndHostingModelsQualityLessons,
};

export const vpsOperations: LearningPath = {
    id: "vps-operations",
    title: "VPS Operations",
    lessons: vpsOperationsQualityLessons,
};

export const internetNetworking: LearningPath = {
    id: "internet-networking",
    title: "Internet Networking",
    lessons: internetNetworkingQualityLessons,
};

export const cloudBuildingBlocks: LearningPath = {
    id: "cloud-building-blocks",
    title: "Cloud Building Blocks",
    lessons: cloudBuildingBlocksQualityLessons,
};

export const infrastructureAsCode: LearningPath = {
    id: "infrastructure-as-code",
    title: "Infrastructure as Code",
    lessons: infrastructureAsCodeQualityLessons,
};

export const cloudOrchestrationGitOps: LearningPath = {
    id: "cloud-orchestration-gitops",
    title: "Kubernetes, OpenShift and GitOps",
    lessons: cloudOrchestrationGitOpsDeepLessons,
};

export const cloudArchitectureAndCost: LearningPath = {
    id: "cloud-architecture-and-cost",
    title: "Cloud Architecture and Cost",
    lessons: cloudArchitectureAndCostQualityLessons,
};

export const stewardInternetEnvironment: LearningPath = {
    id: "steward-internet-environment",
    title: "Cloud Engineer Milestone",
    lessons: cloudEngineerMilestoneDeepLessons,
};

export const cloudEngineerPaths: LearningPath[] = [
    cloudAndHostingModels,
    vpsOperations,
    internetNetworking,
    cloudBuildingBlocks,
    infrastructureAsCode,
    cloudOrchestrationGitOps,
    cloudArchitectureAndCost,
    stewardInternetEnvironment,
];
