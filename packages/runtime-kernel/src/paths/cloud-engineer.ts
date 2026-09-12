import type { Activity } from "../activities";
import { cloudArchitectureAndCostQualityLessons } from "./cloud-architecture-cost-quality";
import { cloudAndHostingModelsQualityLessons } from "./cloud-hosting-models-quality";
import { cloudBuildingBlocksQualityLessons } from "./cloud-building-blocks-quality";
import { cloudEngineerMilestoneDeepLessons } from "./cloud-engineer-milestone-deep";
import { infrastructureAsCodeQualityLessons } from "./cloud-infrastructure-as-code-quality";
import { internetNetworkingQualityLessons } from "./cloud-internet-networking-quality";
import { vpsOperationsQualityLessons } from "./cloud-vps-operations-quality";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = {
        id: `${lessonId}-001`,
        title,
        estimatedMinutes: title.startsWith("Milestone:") ? 300 : practical ? 60 : 12,
        content: practical
            ? {
                  type: "practical",
                  objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward platform.`,
                  scenario: "Extend the existing Steward Delivery Platform beyond the homelab into a deliberately designed internet-hosted environment. Preserve evidence, cost awareness and a clear boundary between homelab and remote infrastructure.",
                  instructions: [
                      "Define the infrastructure goal, constraints and expected cost before provisioning resources.",
                      "Use the existing versioned Steward API artifact and delivery practices rather than rebuilding the application manually on the server.",
                      "Document networking, identity, secrets, exposure and recovery decisions.",
                      "Automate repeatable infrastructure where the lesson has introduced the required Infrastructure as Code capability.",
                      "Verify the deployed environment from an external client and capture reviewable evidence.",
                      "Destroy or scale down unnecessary paid resources after experiments when appropriate.",
                  ],
                  deliverables: ["Working cloud/VPS change", "Infrastructure and cost notes", "Verification evidence"],
                  completionCriteria: [
                      "The result is reproducible enough for another engineer to understand and review.",
                      "Internet exposure is deliberate rather than opening broad ports for convenience.",
                      "The learner can explain the operational and cost trade-offs of the chosen design.",
                  ],
              }
            : {
                  type: "reading",
                  body: focus ?? `This breadth lesson establishes ${title} as a cloud-engineering capability for the Steward platform. Deep authoring will add researched TSA teaching, provider examples, exercises, resources and knowledge checks.`,
              },
    };
    return { id: lessonId, title, activities: [activity] };
}

export const cloudAndHostingModels: LearningPath = { id: "cloud-and-hosting-models", title: "Cloud and Hosting Models", lessons: cloudAndHostingModelsQualityLessons };
export const vpsOperations: LearningPath = { id: "vps-operations", title: "VPS Operations", lessons: vpsOperationsQualityLessons };
export const internetNetworking: LearningPath = { id: "internet-networking", title: "Internet Networking", lessons: internetNetworkingQualityLessons };
export const cloudBuildingBlocks: LearningPath = { id: "cloud-building-blocks", title: "Cloud Building Blocks", lessons: cloudBuildingBlocksQualityLessons };
export const infrastructureAsCode: LearningPath = { id: "infrastructure-as-code", title: "Infrastructure as Code", lessons: infrastructureAsCodeQualityLessons };
export const cloudArchitectureAndCost: LearningPath = { id: "cloud-architecture-and-cost", title: "Cloud Architecture and Cost", lessons: cloudArchitectureAndCostQualityLessons };
export const stewardInternetEnvironment: LearningPath = { id: "steward-internet-environment", title: "Cloud Engineer Milestone", lessons: cloudEngineerMilestoneDeepLessons };

export const cloudEngineerPaths: LearningPath[] = [cloudAndHostingModels, vpsOperations, internetNetworking, cloudBuildingBlocks, infrastructureAsCode, cloudArchitectureAndCost, stewardInternetEnvironment];
