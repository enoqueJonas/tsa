import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

function slug(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = {
        id: `${lessonId}-001`,
        title,
        estimatedMinutes: title.startsWith("Milestone:") ? 180 : practical ? 45 : 12,
        content: practical
            ? {
                  type: "practical",
                  objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward API system.`,
                  scenario: "Use Steward API v1 as the system under study. Treat the implementation as evidence, but reason about the larger system, its actors, boundaries, dependencies, data and failure behavior.",
                  instructions: [
                      "Define the question or modeling goal before drawing or documenting anything.",
                      "Use the current Steward API implementation and its real constraints as evidence.",
                      "Make boundaries, assumptions and important dependencies explicit.",
                      "Identify at least one uncertainty, trade-off or failure scenario rather than producing only a happy-path diagram.",
                      "Produce an artifact another engineer could review and challenge.",
                  ],
                  deliverables: ["Reviewable system-design artifact", "Short reasoning note"],
                  completionCriteria: [
                      "The artifact represents the system rather than merely restating code structure.",
                      "Important assumptions and boundaries are visible.",
                      "The learner can defend why the model is useful and what it intentionally leaves out.",
                  ],
              }
            : {
                  type: "reading",
                  body:
                      focus ??
                      `This breadth lesson establishes ${title} as a systems-thinking capability for Steward API. The deep-authoring phase will add detailed TSA teaching, examples, researched resources, exercises and knowledge checks.`,
              },
    };

    return { id: lessonId, title, activities: [activity] };
}

function path(id: string, title: string, lessons: Lesson[]): LearningPath {
    return { id, title, lessons };
}

export const requirementsAndProblemFraming = path(
    "requirements-and-problem-framing",
    "Requirements and Problem Framing",
    [
        lesson("requirements-and-problem-framing", "From Requests to Problems"),
        lesson("requirements-and-problem-framing", "Stakeholders and Actors"),
        lesson("requirements-and-problem-framing", "Functional Requirements"),
        lesson("requirements-and-problem-framing", "Quality Requirements"),
        lesson("requirements-and-problem-framing", "Constraints and Assumptions"),
        lesson("requirements-and-problem-framing", "Acceptance and Evidence"),
        lesson(
            "requirements-and-problem-framing",
            "Lab: Reframe Steward API Requirements",
            "Turn the current Steward API feature set into a concise problem statement, stakeholder map, functional requirements, quality requirements, constraints and evidence-based acceptance criteria."
        ),
    ]
);

export const systemBoundariesAndContext = path(
    "system-boundaries-and-context",
    "System Boundaries and Context",
    [
        lesson("system-boundaries-and-context", "System Context"),
        lesson("system-boundaries-and-context", "Actors and External Systems"),
        lesson("system-boundaries-and-context", "Defining System Boundaries"),
        lesson("system-boundaries-and-context", "Trust and Ownership Boundaries"),
        lesson(
            "system-boundaries-and-context",
            "Lab: Draw the Steward API Context",
            "Create a context view that shows Steward API, its human actors, external systems, ownership boundaries and important trust boundaries without leaking into implementation-level detail."
        ),
    ]
);

export const modelingSoftwareSystems = path(
    "modeling-software-systems",
    "Modeling Software Systems",
    [
        lesson("modeling-software-systems", "Why We Model Systems"),
        lesson("modeling-software-systems", "C4-Style Thinking"),
        lesson("modeling-software-systems", "Containers and Components as Models"),
        lesson("modeling-software-systems", "State and Lifecycle Modeling"),
        lesson("modeling-software-systems", "Communicating Architecture Visually"),
        lesson(
            "modeling-software-systems",
            "Lab: Model Steward API at Multiple Levels",
            "Produce a small set of complementary Steward API views at different levels of abstraction and explain why each view answers a different engineering question."
        ),
    ]
);

export const componentsAndDependencies = path(
    "components-and-dependencies",
    "Components and Dependencies",
    [
        lesson("components-and-dependencies", "Components and Responsibilities"),
        lesson("components-and-dependencies", "Coupling and Cohesion Foundations"),
        lesson("components-and-dependencies", "Dependency Direction"),
        lesson("components-and-dependencies", "Internal and External Dependencies"),
        lesson(
            "components-and-dependencies",
            "Lab: Map Steward API Dependencies",
            "Map Steward API responsibilities and dependencies, then identify one place where coupling, responsibility or dependency direction deserves discussion."
        ),
    ]
);

export const dataFlowAndIntegration = path(
    "data-flow-and-integration",
    "Data Flow and Integration",
    [
        lesson("data-flow-and-integration", "Following Data Through a System"),
        lesson("data-flow-and-integration", "Synchronous and Asynchronous Boundaries"),
        lesson("data-flow-and-integration", "Integration Contracts"),
        lesson("data-flow-and-integration", "Failure Across Integrations"),
        lesson(
            "data-flow-and-integration",
            "Lab: Model Steward API Data Flows",
            "Trace important Steward API data from entry to persistence and external boundaries, including validation, authorization, state changes and at least one integration-failure path."
        ),
    ]
);

export const failureModes = path("failure-modes", "Failure Modes", [
    lesson("failure-modes", "Thinking in Failure Modes"),
    lesson("failure-modes", "Dependency Failure"),
    lesson("failure-modes", "Invalid and Partial State"),
    lesson("failure-modes", "Resource Exhaustion"),
    lesson("failure-modes", "Human and Operational Failure"),
    lesson(
        "failure-modes",
        "Lab: Analyze Steward API Failure Scenarios",
        "Identify and analyze realistic Steward API failure modes across application, database, authentication, dependencies and operations, including impact, detection and current mitigation."
    ),
]);

export const architectureDecisionsAndTradeOffs = path(
    "architecture-decisions",
    "Architecture Decisions and Trade-offs",
    [
        lesson("architecture-decisions", "Architecture Characteristics Introduction"),
        lesson("architecture-decisions", "Decision Drivers"),
        lesson("architecture-decisions", "Architecture Decision Records"),
        lesson("architecture-decisions", "Evaluating Trade-offs"),
        lesson(
            "architecture-decisions",
            "Lab: Write Steward API ADRs",
            "Write at least two ADRs for real Steward API decisions, including context, alternatives, consequences and conditions that could justify revisiting the choice."
        ),
    ]
);

export const stewardApiSystemDesignPortfolio = path(
    "steward-api-system-design-portfolio",
    "System Thinker Milestone",
    [
        lesson(
            "steward-api-system-design-portfolio",
            "Milestone: Steward API System Design Portfolio",
            "Produce a reviewable system-design portfolio for Steward API v1 containing problem framing, stakeholders, functional and quality requirements, context and boundary views, component/dependency models, data-flow views, lifecycle/state thinking, failure-mode analysis, architecture characteristics and ADRs. The portfolio must show reasoning and trade-offs, not decorative diagrams."
        ),
    ]
);

export const systemThinkerPaths: LearningPath[] = [
    requirementsAndProblemFraming,
    systemBoundariesAndContext,
    modelingSoftwareSystems,
    componentsAndDependencies,
    dataFlowAndIntegration,
    failureModes,
    architectureDecisionsAndTradeOffs,
    stewardApiSystemDesignPortfolio,
];
