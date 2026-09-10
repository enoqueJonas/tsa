import type { Activity } from "../activities";
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
import type { Lesson } from "./lesson";

function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = { id: `${lessonId}-001`, title, estimatedMinutes: title.startsWith("Milestone:") ? 360 : practical ? 60 : 12, content: practical ? {
        type: "practical", objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward platform.`,
        scenario: "Use the real Steward API, its deployed environments, delivery pipeline and internal dependencies as the test target. Build evidence that can influence release decisions rather than producing disposable test scripts.",
        instructions: ["Define the quality risk or behavior being investigated before choosing a tool or automation approach.", "Design positive, negative and boundary coverage appropriate to the risk.", "Automate only where repeatability, feedback speed or regression value justifies it.", "Capture useful diagnostics such as logs, traces, reports, screenshots or API evidence.", "Integrate durable checks into the existing delivery pipeline when appropriate.", "Record defects, limitations, flaky behavior and residual risk explicitly."],
        deliverables: ["Executable quality evidence", "Test design or automation artifact", "Short risk and findings note"],
        completionCriteria: ["The work demonstrates risk-based reasoning rather than test-count maximization.", "Failures provide enough evidence to support triage.", "The learner can explain what is and is not proven by the tests."],
    } : { type: "reading", body: focus ?? `This breadth lesson establishes ${title} as a quality-engineering capability for Steward. Deep authoring will add detailed TSA teaching, examples, researched resources, exercises and knowledge checks.` } };
    return { id: lessonId, title, activities: [activity] };
}

export const qualityEngineering: LearningPath = { id: "quality-engineering", title: "Quality Engineering", lessons: qualityEngineeringDeepLessons };
export const testAnalysisAndDesign: LearningPath = { id: "test-analysis-and-design", title: "Test Analysis and Design", lessons: testAnalysisAndDesignDeepLessons };
export const unitAndComponentTesting: LearningPath = { id: "unit-and-component-testing", title: "Unit and Component Testing", lessons: unitAndComponentTestingDeepLessons };
export const apiAndIntegrationTesting: LearningPath = { id: "api-and-integration-testing", title: "API and Integration Testing", lessons: apiAndIntegrationTestingDeepLessons };
export const automationFrameworkEngineering: LearningPath = { id: "automation-framework-engineering", title: "Automation Framework Engineering", lessons: automationFrameworkEngineeringDeepLessons };
export const browserAndEnvironmentTesting: LearningPath = { id: "browser-and-environment-testing", title: "Browser and Environment Testing", lessons: browserAndEnvironmentTestingDeepLessons };
export const nonFunctionalQuality: LearningPath = { id: "non-functional-quality", title: "Non-functional Quality", lessons: nonFunctionalQualityDeepLessons };
export const qualityInContainersAndCi: LearningPath = { id: "quality-in-containers-and-ci", title: "Quality in Containers and CI", lessons: qualityInContainersAndCiDeepLessons };
export const stewardQualityPlatform: LearningPath = { id: "steward-quality-platform", title: "Quality Steward Milestone", lessons: qualityStewardMilestoneDeepLessons };

export const qualityStewardPaths: LearningPath[] = [qualityEngineering, testAnalysisAndDesign, unitAndComponentTesting, apiAndIntegrationTesting, automationFrameworkEngineering, browserAndEnvironmentTesting, nonFunctionalQuality, qualityInContainersAndCi, stewardQualityPlatform];
