import { apiAndIntegrationTestingDeepLessons } from "./quality-api-integration-testing-deep";
import { automationFrameworkEngineeringDeepLessons } from "./quality-automation-framework-engineering-deep";
import { browserAndEnvironmentTestingDeepLessons } from "./quality-browser-environment-testing-deep";
import { qualityInContainersAndCiDeepLessons } from "./quality-containers-ci-deep";
import { nonFunctionalQualityDeepLessons } from "./quality-non-functional-deep";
import { qualityEngineeringDeepLessons } from "./quality-engineering-deep";
import { qualityStewardMilestoneDeepLessons } from "./quality-steward-milestone-deep";
import { testAnalysisAndDesignDeepLessons } from "./quality-test-analysis-design-deep";
import { unitAndComponentTestingDeepLessons } from "./quality-unit-component-testing-deep";
import type { LearningPath } from "./learning-path";

export const qualityEngineering: LearningPath = {
    id: "quality-engineering",
    title: "Quality Engineering",
    lessons: qualityEngineeringDeepLessons,
};

export const testAnalysisAndDesign: LearningPath = {
    id: "test-analysis-and-design",
    title: "Test Analysis and Design",
    lessons: testAnalysisAndDesignDeepLessons,
};

export const unitAndComponentTesting: LearningPath = {
    id: "unit-and-component-testing",
    title: "Unit and Component Testing",
    lessons: unitAndComponentTestingDeepLessons,
};

export const apiAndIntegrationTesting: LearningPath = {
    id: "api-and-integration-testing",
    title: "API and Integration Testing",
    lessons: apiAndIntegrationTestingDeepLessons,
};

export const automationFrameworkEngineering: LearningPath = {
    id: "automation-framework-engineering",
    title: "Automation Framework Engineering",
    lessons: automationFrameworkEngineeringDeepLessons,
};

export const browserAndEnvironmentTesting: LearningPath = {
    id: "browser-and-environment-testing",
    title: "Browser and Environment Testing",
    lessons: browserAndEnvironmentTestingDeepLessons,
};

export const nonFunctionalQuality: LearningPath = {
    id: "non-functional-quality",
    title: "Non-functional Quality",
    lessons: nonFunctionalQualityDeepLessons,
};

export const qualityInContainersAndCi: LearningPath = {
    id: "quality-in-containers-and-ci",
    title: "Quality in Containers and CI",
    lessons: qualityInContainersAndCiDeepLessons,
};

export const stewardQualityPlatform: LearningPath = {
    id: "steward-quality-platform",
    title: "Quality Steward Milestone",
    lessons: qualityStewardMilestoneDeepLessons,
};

export const qualityStewardPaths: LearningPath[] = [
    qualityEngineering,
    testAnalysisAndDesign,
    unitAndComponentTesting,
    apiAndIntegrationTesting,
    automationFrameworkEngineering,
    browserAndEnvironmentTesting,
    nonFunctionalQuality,
    qualityInContainersAndCi,
    stewardQualityPlatform,
];
