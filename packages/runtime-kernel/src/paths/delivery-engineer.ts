import { automationAndShellDeepLessons } from "./delivery-automation-shell-deep";
import { configurationManagementQualityLessons } from "./delivery-configuration-management-quality";
import { containersAndDockerQualityLessons } from "./delivery-containers-docker-quality";
import { continuousDeliveryDeploymentQualityLessons } from "./delivery-continuous-delivery-quality";
import { continuousIntegrationQualityLessons } from "./delivery-continuous-integration-quality";
import { deliveryEngineerMilestoneDeepLessons } from "./delivery-engineer-milestone-deep";
import { releaseEngineeringQualityLessons } from "./delivery-release-engineering-quality";
import { softwareDeliveryFoundationsQualityLessons } from "./delivery-software-foundations-quality";
import { artifactDependencySupplyChainManagement } from "./internal-dependency-management";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

function path(id: string, title: string, lessons: Lesson[]): LearningPath {
    return { id, title, lessons };
}

export const softwareDeliveryFoundations = path(
    "software-delivery-foundations",
    "Software Delivery Foundations",
    softwareDeliveryFoundationsQualityLessons,
);
export const automationAndShell = path("automation-and-shell", "Automation and Shell", automationAndShellDeepLessons);
export const containersAndDocker = path("containers-and-docker", "Containers and Docker", containersAndDockerQualityLessons);
export const continuousIntegration = path("continuous-integration", "Continuous Integration", continuousIntegrationQualityLessons);
export const continuousDeliveryDeployment = path(
    "continuous-delivery-deployment",
    "Continuous Delivery and Deployment",
    continuousDeliveryDeploymentQualityLessons,
);
export const configurationManagement = path(
    "configuration-management",
    "Configuration Management",
    configurationManagementQualityLessons,
);
export const releaseEngineering = path("release-engineering", "Release Engineering", releaseEngineeringQualityLessons);
export const stewardDeliveryPlatform = path(
    "steward-delivery-platform",
    "Delivery Engineer Milestone",
    deliveryEngineerMilestoneDeepLessons,
);

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
