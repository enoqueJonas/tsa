import { apiAndIntegrationTestingDeepLessons } from "./quality-api-integration-testing-deep";
import { automationFrameworkEngineeringDeepLessons } from "./quality-automation-framework-engineering-deep";
import { browserAndEnvironmentTestingDeepLessons } from "./quality-browser-environment-testing-deep";
import { browserSurfaceDecisionLesson } from "./quality-browser-surface-decision";
import { performanceToolDecisionLesson } from "./quality-performance-tool-decision";
import { qualityInContainersAndCiDeepLessons } from "./quality-containers-ci-deep";
import { javaForTestFrameworkEngineeringDeepLessons } from "./quality-java-test-engineering-deep";
import { continuousAndScheduledQualityExecutionDeepLessons } from "./quality-continuous-scheduled-execution-deep";
import { nonFunctionalQualityDeepLessons } from "./quality-non-functional-deep";
import { qualityEngineeringDeepLessons } from "./quality-engineering-deep";
import { qualityStewardMilestoneDeepLessons } from "./quality-steward-milestone-deep";
import { qualityReuseAndInternalLibraryDeepLessons } from "./quality-reuse-internal-library-deep";
import { testAnalysisAndDesignDeepLessons } from "./quality-test-analysis-design-deep";
import { unitAndComponentTestingDeepLessons } from "./quality-unit-component-testing-deep";
import type { LearningPath } from "./learning-path";

type QualityConcept = { model: string; worked: string; failure: string };
const qualityConcepts: Record<string, QualityConcept> = {
    "quality-engineering": { model: "Quality is evidence about risks and requirements, not a count of passed test cases.", worked: "Map a Steward user journey to a failure risk, an observable oracle and a release decision.", failure: "A pass on a trivial happy path cannot establish that authorization and recovery behave correctly." },
    "test-analysis-and-design": { model: "Requirements supply candidate behaviors; partitions, boundaries and state transitions turn them into defensible tests.", worked: "For a payment-like Steward workflow, derive valid, invalid, boundary and state-transition cases before writing automation.", failure: "A test without an expected oracle may execute but cannot objectively pass or fail." },
    "java-for-test-framework-engineering": { model: "Java classes, instances, methods and exceptions must be taught before introducing framework annotations or reflection.", worked: "Create two independent Java objects and compare state, then write an ordinary method-based assertion before JUnit fixtures.", failure: "If a framework concept appears before its Java prerequisite, review its input and lifecycle first." },
    "unit-and-component-testing": { model: "Units isolate a decision; component tests involve real component behavior behind controlled dependencies.", worked: "Test a pure validation function and a service with a fake repository; then show a negative branch.", failure: "A mocked collaborator proving it was called does not alone establish user-visible behavior." },
    "api-and-integration-testing": { model: "HTTP contracts include statuses, headers, error shapes, authorization and persisted side effects.", worked: "Exercise a Steward create-and-fetch API flow plus unauthorized and malformed input paths.", failure: "A 200 response without a validated response body or persisted effect is weak evidence." },
    "automation-framework-engineering": { model: "A test framework separates domain actions, assertions, fixtures, execution and reporting.", worked: "Build one deterministic test with a fixture and an assertion; rerun it with clean state to confirm isolation.", failure: "A test passing only in a fixed order signals shared-state contamination." },
    "browser-and-environment-testing": { model: "UI tests validate the browser-visible contract across session, accessibility and rendering boundaries.", worked: "Test one Steward critical journey through navigation, form validation and API-backed visible outcome.", failure: "A click succeeding does not establish that the right user-visible outcome occurred." },
    "reusable-test-infrastructure": { model: "Reusable test libraries need stable contracts and two genuine consumers, not speculative abstraction.", worked: "Extract a shared test helper only after two distinct suites require the same behavior and preserve versioned consumption.", failure: "A helper copied into two repositories is duplication, not managed reuse." },
    "non-functional-quality": { model: "Performance, resilience and accessibility require agreed baselines and observability.", worked: "Set a bounded latency/error budget for a disposable load test and record saturation and recovery evidence.", failure: "A single response time without concurrency context cannot support a capacity claim." },
    "quality-in-containers-and-ci": { model: "A CI test result depends on pinned images, isolated data, deterministic dependencies and fail-closed gates.", worked: "Run the same Steward test suite in a container, then inject a failing assertion to prove CI blocks publication.", failure: "Passing tests on a developer laptop do not establish container-runner reproducibility." },
    "continuous-and-scheduled-quality-execution": { model: "Scheduled suites require ownership, diagnostics, environment isolation and an escalation rule.", worked: "Design a nightly regression with artifact retention and a deliberate failed run that produces actionable evidence.", failure: "An unattended green dashboard can hide skipped tests and stale environments." },
    "steward-quality-platform": { model: "The quality milestone connects traceability, automated oracles, CI, evidence retention and release risk.", worked: "Demonstrate one positive and two negative Steward flows with reproducible reports and a release decision.", failure: "A large test count without risk coverage or a trustworthy failure signal is not a quality platform." },
};
function strengthenQualityPath(path: LearningPath): LearningPath {
    const guide = qualityConcepts[path.id];
    if (!guide) throw new Error(`Missing quality curriculum model for ${path.id}`);
    const prepared = path.lessons.map((lesson) => ({ ...lesson, activities: lesson.activities.flatMap((activity) => {
        if (activity.content.type !== "practical") return [activity];
        const task = activity.content;
        return [{ id: `${activity.id}-quality-preparation`, title: `Prepare and verify: ${activity.title}`, estimatedMinutes: 20,
            content: { type: "reading" as const, body: `${task.objective}\\n\\n${task.scenario}`, blocks: [
                { type: "heading" as const, id: "quality-scenario", text: "Scenario and test oracle", level: 2 as const },
                { type: "paragraph" as const, text: task.scenario },
                { type: "paragraph" as const, text: guide.model },
                { type: "heading" as const, id: "quality-plan", text: "Initial verification steps", level: 2 as const },
                { type: "list" as const, items: task.instructions.slice(0, 3), ordered: true },
                { type: "heading" as const, id: "quality-evidence", text: "Acceptance evidence", level: 2 as const },
                { type: "list" as const, items: task.completionCriteria },
                { type: "heading" as const, id: "quality-negative", text: "Negative path and recovery", level: 2 as const },
                { type: "paragraph" as const, text: guide.failure },
            ] } }, activity];
    }) }));
    return { ...path, lessons: [{ id: `${path.id}-worked-quality-model`, title: `Worked test model: ${path.title}`, activities: [{ id: `${path.id}-worked-quality-model-reading`, title: "Concept, test design and failure", estimatedMinutes: 30, content: { type: "reading", body: guide.model, blocks: [
        { type: "heading", id: "quality-concept", text: "Understand the verification boundary", level: 2 },
        { type: "paragraph", text: guide.model },
        { type: "heading", id: "quality-worked", text: "Worked Steward test scenario", level: 2 },
        { type: "paragraph", text: guide.worked },
        { type: "heading", id: "quality-failure", text: "Failure interpretation", level: 2 },
        { type: "paragraph", text: guide.failure },
    ] } }] }, ...prepared] };
}

export const qualityEngineering: LearningPath = strengthenQualityPath({
    id: "quality-engineering",
    title: "Quality Engineering",
    lessons: qualityEngineeringDeepLessons,
});

export const testAnalysisAndDesign: LearningPath = strengthenQualityPath({
    id: "test-analysis-and-design",
    title: "Test Analysis and Design",
    lessons: testAnalysisAndDesignDeepLessons,
});

export const javaForTestFrameworkEngineering: LearningPath = strengthenQualityPath({
    id: "java-for-test-framework-engineering",
    title: "Java for Test Framework Engineering",
    lessons: javaForTestFrameworkEngineeringDeepLessons,
});

export const unitAndComponentTesting: LearningPath = strengthenQualityPath({
    id: "unit-and-component-testing",
    title: "Unit and Component Testing",
    lessons: unitAndComponentTestingDeepLessons,
});

export const apiAndIntegrationTesting: LearningPath = strengthenQualityPath({
    id: "api-and-integration-testing",
    title: "API and Integration Testing",
    lessons: apiAndIntegrationTestingDeepLessons,
});

export const automationFrameworkEngineering: LearningPath = strengthenQualityPath({
    id: "automation-framework-engineering",
    title: "Automation Framework Engineering",
    lessons: automationFrameworkEngineeringDeepLessons,
});

export const browserAndEnvironmentTesting: LearningPath = strengthenQualityPath({
    id: "browser-and-environment-testing",
    title: "Browser and Environment Testing",
    lessons: [browserSurfaceDecisionLesson, ...browserAndEnvironmentTestingDeepLessons],
});

export const reusableTestInfrastructure: LearningPath = strengthenQualityPath({
    id: "reusable-test-infrastructure",
    title: "Reusable Test Infrastructure and Internal Distribution",
    lessons: qualityReuseAndInternalLibraryDeepLessons,
});

export const nonFunctionalQuality: LearningPath = strengthenQualityPath({
    id: "non-functional-quality",
    title: "Non-functional Quality",
    lessons: [performanceToolDecisionLesson, ...nonFunctionalQualityDeepLessons],
});

export const qualityInContainersAndCi: LearningPath = strengthenQualityPath({
    id: "quality-in-containers-and-ci",
    title: "Quality in Containers and CI",
    lessons: qualityInContainersAndCiDeepLessons,
});

export const continuousAndScheduledQualityExecution: LearningPath = strengthenQualityPath({
    id: "continuous-and-scheduled-quality-execution",
    title: "Continuous and Scheduled Quality Execution",
    lessons: continuousAndScheduledQualityExecutionDeepLessons,
});

export const stewardQualityPlatform: LearningPath = strengthenQualityPath({
    id: "steward-quality-platform",
    title: "Quality Steward Milestone",
    lessons: qualityStewardMilestoneDeepLessons,
});

export const qualityStewardPaths: LearningPath[] = [
    qualityEngineering,
    testAnalysisAndDesign,
    javaForTestFrameworkEngineering,
    unitAndComponentTesting,
    apiAndIntegrationTesting,
    automationFrameworkEngineering,
    browserAndEnvironmentTesting,
    reusableTestInfrastructure,
    nonFunctionalQuality,
    qualityInContainersAndCi,
    continuousAndScheduledQualityExecution,
    stewardQualityPlatform,
];
