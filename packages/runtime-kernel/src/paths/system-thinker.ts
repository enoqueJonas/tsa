import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
import { requirementsAndProblemFramingQualityLessons } from "./system-thinker-requirements-quality";
import { systemBoundariesAndContextQualityLessons } from "./system-thinker-boundaries-quality";
import { modelingSoftwareSystemsQualityLessons } from "./system-thinker-modeling-quality";
import { componentsAndDependenciesQualityLessons } from "./system-thinker-components-quality";
import { dataFlowAndIntegrationQualityLessons } from "./system-thinker-data-flow-quality";
import { distributedStateAndMessagingDeepLessons } from "./system-thinker-distributed-state-messaging-deep";
import { failureModesQualityLessons } from "./system-thinker-failure-quality";
import { architectureDecisionsAndTradeOffsQualityLessons } from "./system-thinker-architecture-decisions-quality";
import { stewardApiSystemDesignPortfolioDeep } from "./system-thinker-milestone-deep";

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = {
        id: `${lessonId}-001`, title,
        estimatedMinutes: title.startsWith("Milestone:") ? 180 : practical ? 45 : 12,
        content: practical
            ? {
                  type: "practical",
                  objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward API system.`,
                  scenario: "Use Steward API v1 as the system under study. Treat the implementation as evidence, but reason about the larger system, its actors, boundaries, dependencies, data and failure behavior.",
                  instructions: ["Define the question or modeling goal before drawing or documenting anything.", "Use the current Steward API implementation and its real constraints as evidence.", "Make boundaries, assumptions and important dependencies explicit.", "Identify at least one uncertainty, trade-off or failure scenario rather than producing only a happy-path diagram.", "Produce an artifact another engineer could review and challenge."],
                  deliverables: ["Reviewable system-design artifact", "Short reasoning note"],
                  completionCriteria: ["The artifact represents the system rather than merely restating code structure.", "Important assumptions and boundaries are visible.", "The learner can defend why the model is useful and what it intentionally leaves out."],
              }
            : { type: "reading", body: focus ?? `This breadth lesson establishes ${title} as a systems-thinking capability for Steward API. The deep-authoring phase will add detailed TSA teaching, examples, researched resources, exercises and knowledge checks.` },
    };
    return { id: lessonId, title, activities: [activity] };
}

function path(id: string, title: string, lessons: Lesson[]): LearningPath { return { id, title, lessons }; }

export const requirementsAndProblemFraming = path("requirements-and-problem-framing", "Requirements and Problem Framing", requirementsAndProblemFramingQualityLessons);
export const systemBoundariesAndContext = path("system-boundaries-and-context", "System Boundaries and Context", systemBoundariesAndContextQualityLessons);
export const modelingSoftwareSystems = path("modeling-software-systems", "Modeling Software Systems", modelingSoftwareSystemsQualityLessons);
export const componentsAndDependencies = path("components-and-dependencies", "Components and Dependencies", componentsAndDependenciesQualityLessons);
export const dataFlowAndIntegration = path("data-flow-and-integration", "Data Flow and Integration", dataFlowAndIntegrationQualityLessons);
export const distributedStateAndMessaging = path("distributed-state-and-messaging", "Distributed State and Messaging", distributedStateAndMessagingDeepLessons);
export const failureModes = path("failure-modes", "Failure Modes", failureModesQualityLessons);
export const architectureDecisionsAndTradeOffs = path("architecture-decisions", "Architecture Decisions and Trade-offs", architectureDecisionsAndTradeOffsQualityLessons);
export const stewardApiSystemDesignPortfolio = stewardApiSystemDesignPortfolioDeep;

export const systemThinkerPaths: LearningPath[] = [requirementsAndProblemFraming, systemBoundariesAndContext, modelingSoftwareSystems, componentsAndDependencies, dataFlowAndIntegration, distributedStateAndMessaging, failureModes, architectureDecisionsAndTradeOffs, stewardApiSystemDesignPortfolio];
