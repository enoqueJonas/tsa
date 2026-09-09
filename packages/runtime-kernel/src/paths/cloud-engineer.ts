import type { Activity } from "../activities";
import { cloudAndHostingModelsDeepLessons } from "./cloud-hosting-models-deep";
import { cloudBuildingBlocksDeepLessons } from "./cloud-building-blocks-deep";
import { internetNetworkingDeepLessons } from "./cloud-internet-networking-deep";
import { vpsOperationsDeepLessons } from "./cloud-vps-operations-deep";
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

export const cloudAndHostingModels: LearningPath = { id: "cloud-and-hosting-models", title: "Cloud and Hosting Models", lessons: cloudAndHostingModelsDeepLessons };
export const vpsOperations: LearningPath = { id: "vps-operations", title: "VPS Operations", lessons: vpsOperationsDeepLessons };
export const internetNetworking: LearningPath = { id: "internet-networking", title: "Internet Networking", lessons: internetNetworkingDeepLessons };
export const cloudBuildingBlocks: LearningPath = { id: "cloud-building-blocks", title: "Cloud Building Blocks", lessons: cloudBuildingBlocksDeepLessons };

export const infrastructureAsCode: LearningPath = {
    id: "infrastructure-as-code",
    title: "Infrastructure as Code",
    lessons: ["Why Infrastructure as Code", "Declarative Infrastructure", "Terraform and OpenTofu Fundamentals", "Providers and Resources", "State", "Variables and Outputs", "Dependencies", "Modules Concepts", "Plan and Apply Lifecycle", "Drift", "Remote State Concepts", "Secrets and Sensitive Values", "Destroy and Resource Lifecycle"].map((title) => lesson("infrastructure-as-code", title)).concat([lesson("infrastructure-as-code", "Lab: Define Steward Infrastructure as Code", "Represent the remote Steward infrastructure with Terraform or OpenTofu, review the plan before applying it, verify the resulting environment and demonstrate controlled change rather than manual console-only provisioning.")]),
};

export const cloudArchitectureAndCost: LearningPath = {
    id: "cloud-architecture-and-cost",
    title: "Cloud Architecture and Cost",
    lessons: ["Availability in Cloud Environments", "Scalability and Capacity", "Security Boundaries", "Backup and Recovery", "Failure Domains", "Cost Estimation", "Cost Controls and Budgets", "Resource Right-sizing", "Managed vs Self-managed Trade-offs", "Homelab, VPS and Cloud Hybrid Trade-offs", "Lab: Review the Steward Internet Architecture"].map((title) => lesson("cloud-architecture-and-cost", title)),
};

export const stewardInternetEnvironment: LearningPath = {
    id: "steward-internet-environment",
    title: "Cloud Engineer Milestone",
    lessons: [lesson("steward-internet-environment", "Milestone: Steward Internet Environment", "Deliver an internet-accessible Steward environment from versioned artifacts using a budget-conscious VPS/cloud design, DNS and TLS, restricted administrative access, reproducible Infrastructure as Code, documented secrets and identity boundaries, backup/recovery thinking, deployment verification and an explicit monthly cost model. Compare the resulting remote environment with Steward Homelab v1 and justify what remains self-managed versus provider-managed.")],
};

export const cloudEngineerPaths: LearningPath[] = [cloudAndHostingModels, vpsOperations, internetNetworking, cloudBuildingBlocks, infrastructureAsCode, cloudArchitectureAndCost, stewardInternetEnvironment];
