import type { Activity } from "../activities";
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
        estimatedMinutes: title.startsWith("Milestone:") ? 360 : practical ? 60 : 12,
        content: practical
            ? {
                  type: "practical",
                  objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward platform.`,
                  scenario: "Use the real Steward API, its deployed environments, delivery pipeline and internal dependencies as the test target. Build evidence that can influence release decisions rather than producing disposable test scripts.",
                  instructions: [
                      "Define the quality risk or behavior being investigated before choosing a tool or automation approach.",
                      "Design positive, negative and boundary coverage appropriate to the risk.",
                      "Automate only where repeatability, feedback speed or regression value justifies it.",
                      "Capture useful diagnostics such as logs, traces, reports, screenshots or API evidence.",
                      "Integrate durable checks into the existing delivery pipeline when appropriate.",
                      "Record defects, limitations, flaky behavior and residual risk explicitly.",
                  ],
                  deliverables: ["Executable quality evidence", "Test design or automation artifact", "Short risk and findings note"],
                  completionCriteria: [
                      "The work demonstrates risk-based reasoning rather than test-count maximization.",
                      "Failures provide enough evidence to support triage.",
                      "The learner can explain what is and is not proven by the tests.",
                  ],
              }
            : {
                  type: "reading",
                  body: focus ?? `This breadth lesson establishes ${title} as a quality-engineering capability for Steward. Deep authoring will add detailed TSA teaching, examples, researched resources, exercises and knowledge checks.`,
              },
    };
    return { id: lessonId, title, activities: [activity] };
}

function path(id: string, title: string, titles: string[]): LearningPath {
    return { id, title, lessons: titles.map((title) => lesson(id, title)) };
}

export const qualityEngineering = path("quality-engineering", "Quality Engineering", [
    "Quality vs Testing",
    "Quality Risks",
    "Test Strategy",
    "Test Levels and Test Types",
    "Risk-based Testing",
    "Shift-left and Shift-right",
    "Testability",
    "Defect Evidence and Communication",
    "Lab: Write the Steward Quality Strategy",
]);

export const testAnalysisAndDesign = path("test-analysis-and-design", "Test Analysis and Design", [
    "Requirements Analysis for Testing",
    "Equivalence Partitioning",
    "Boundary Value Analysis",
    "Decision Tables",
    "State Transition Testing",
    "Pairwise and Combinatorial Concepts",
    "Exploratory Testing",
    "Negative Testing",
    "Traceability",
    "Lab: Design Risk-based Steward Test Coverage",
]);

export const unitAndComponentTesting = path("unit-and-component-testing", "Unit and Component Testing", [
    "Designing Unit Tests",
    "Isolation",
    "Test Doubles",
    "Mocks, Stubs and Fakes",
    "Coverage and Its Limitations",
    "Component Boundaries",
    "Fast Feedback and Maintainability",
    "Lab: Strengthen Steward Component Tests",
]);

export const apiAndIntegrationTesting = path("api-and-integration-testing", "API and Integration Testing", [
    "API Test Design",
    "Authentication and Authorization Testing",
    "Schema and Contract Validation",
    "Database Assertions",
    "Integration Boundaries",
    "Contract Testing Concepts",
    "Mocking and Service Virtualization",
    "Internal Package Compatibility",
    "Data Setup and Cleanup",
    "Lab: Test Steward API End-to-End at the Service Layer",
]);

export const automationFrameworkEngineering = path("automation-framework-engineering", "Automation Framework Engineering", [
    "What Makes an Automation Framework",
    "Framework Architecture",
    "Playwright with Python",
    "pytest Fundamentals",
    "Configuration",
    "Fixtures",
    "Test Data",
    "API Clients",
    "Page Objects and UI Abstractions",
    "Helpers and Utilities",
    "Assertions",
    "Markers and Tags",
    "Parameterization",
    "Automation Logging",
    "Reports",
    "Screenshots, Traces and Video",
    "Parallel Execution",
    "Retries and Flaky-test Risk",
    "Framework Maintainability",
    "Lab: Build the Steward Automation Framework",
]);

export const browserAndEnvironmentTesting = path("browser-and-environment-testing", "Browser and Environment Testing", [
    "Browser Differences",
    "Responsive Testing",
    "Cross-browser Testing",
    "BrowserStack or Equivalent",
    "Local vs Remote Execution",
    "Environment Parity and Configuration Risk",
    "Lab: Run Steward Tests Across Environments",
]);

export const nonFunctionalQuality = path("non-functional-quality", "Non-functional Quality", [
    "Performance Testing",
    "Load, Stress, Spike and Endurance",
    "Accessibility Fundamentals",
    "Compatibility Testing",
    "Reliability-oriented Testing",
    "Data Integrity and Concurrency Testing",
    "Lab: Establish Steward Non-functional Baselines",
]);

export const qualityInContainersAndCi = path("quality-in-containers-and-ci", "Quality in Containers and CI", [
    "Test Containers and Environments",
    "Dockerized Test Dependencies",
    "Ephemeral Environment Concepts",
    "Test Pipeline Stages",
    "Parallelization",
    "Reports and Artifacts",
    "Quality Gates",
    "Test Selection",
    "Failure Triage",
    "Flaky-test Containment",
    "Lab: Build the Steward Quality Pipeline",
]);

export const stewardQualityPlatform: LearningPath = {
    id: "steward-quality-platform",
    title: "Quality Steward Milestone",
    lessons: [
        lesson(
            "steward-quality-platform",
            "Milestone: Steward Quality Platform",
            "Deliver a maintainable quality-engineering system around Steward: documented quality strategy, risk-based coverage, unit/component checks, service-layer API and integration tests, a structured Playwright/pytest automation framework, environment-aware execution, selected non-functional baselines, internal-package compatibility checks, diagnostic reporting and CI quality gates that influence release decisions."
        ),
    ],
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
