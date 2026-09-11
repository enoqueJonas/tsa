import type { Activity } from "../activities";
import { automationAndShellDeepLessons } from "./delivery-automation-shell-deep";
import { configurationManagementDeepLessons } from "./delivery-configuration-management-deep";
import { containersAndDockerQualityLessons } from "./delivery-containers-docker-quality";
import { continuousDeliveryDeploymentDeepLessons } from "./delivery-continuous-delivery-deep";
import { deliveryEngineerMilestoneDeepLessons } from "./delivery-engineer-milestone-deep";
import { continuousIntegrationQualityLessons } from "./delivery-continuous-integration-quality";
import { releaseEngineeringDeepLessons } from "./delivery-release-engineering-deep";
import { softwareDeliveryFoundationsQualityLessons } from "./delivery-software-foundations-quality";
import { artifactDependencySupplyChainManagement } from "./internal-dependency-management";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(pathId: string, title: string, focus?: string): Lesson {
    const id = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = {
        id: `${id}-001`,
        title,
        estimatedMinutes: title.startsWith("Milestone:") ? 240 : practical ? 60 : 12,
        content: practical
            ? {
                  type: "practical",
                  objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward platform.`,
                  scenario: "Use the existing Steward API, homelab and internal package work. Preserve the result as infrastructure or delivery capability that later schools can operate, secure and observe.",
                  instructions: [
                      "Define the delivery problem and the evidence that will prove the solution works.",
                      "Automate the workflow rather than relying on undocumented manual steps.",
                      "Exercise a failure path, rollback path or recovery path where relevant.",
                      "Record versioned artifacts, configuration and evidence another engineer could review.",
                  ],
                  deliverables: ["Working delivery capability", "Versioned configuration or pipeline definition", "Execution evidence"],
                  completionCriteria: [
                      "The workflow is repeatable from source or configuration.",
                      "Important failure behavior is understood rather than ignored.",
                      "The learner can explain how artifacts move from source to a deployable release.",
                  ],
              }
            : {
                  type: "reading",
                  body: focus ?? `This breadth lesson establishes ${title} as a Delivery Engineer capability for the Steward platform. Deep authoring later adds researched explanations, examples, resources and checks.`,
              },
    };
    return { id, title, activities: [activity] };
}

function path(id: string, title: string, lessons: Lesson[]): LearningPath {
    return { id, title, lessons };
}

export const softwareDeliveryFoundations = path("software-delivery-foundations", "Software Delivery Foundations", softwareDeliveryFoundationsQualityLessons);
export const automationAndShell = path("automation-and-shell", "Automation and Shell", automationAndShellDeepLessons);
export const containersAndDocker = path("containers-and-docker", "Containers and Docker", containersAndDockerQualityLessons);
export const continuousIntegration = path("continuous-integration", "Continuous Integration", continuousIntegrationQualityLessons);
export const continuousDeliveryDeployment = path("continuous-delivery-deployment", "Continuous Delivery and Deployment", continuousDeliveryDeploymentDeepLessons);
export const configurationManagement = path("configuration-management", "Configuration Management", configurationManagementDeepLessons);
export const releaseEngineering = path("release-engineering", "Release Engineering", releaseEngineeringDeepLessons);
export const stewardDeliveryPlatform = path("steward-delivery-platform", "Delivery Engineer Milestone", deliveryEngineerMilestoneDeepLessons);

export const deliveryEngineerPaths: LearningPath[] = [
    softwareDeliveryFoundations,
    automationAndShell,
    containersAndDocker,
    continuousIntegration,
    continuousDeliveryDeployment,
    configurationManagement,
    artifactDependencySupplyChainManagement,
    releaseEngineering,
    stewardDeliveryPlatform,
];
