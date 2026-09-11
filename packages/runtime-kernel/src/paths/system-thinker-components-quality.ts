import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { componentsAndDependenciesDeepLessons } from "./system-thinker-components-dependencies-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
    "Components and Responsibilities": {
        objective: "Turn Steward's current code structure into an evidence-backed responsibility model without treating folders as architecture.",
        scenario: "A new engineer opens Steward and assumes each Django app or directory is an architectural component. During review, however, several use cases cross those boundaries and important rules appear in multiple places. You need to identify the responsibility model before anyone proposes a refactor.",
        instructions: [
            "Choose three representative Steward use cases that exercise different domain responsibilities.",
            "Trace where their rules, orchestration and persistence behavior currently live.",
            "Group the observed behavior by reason for change rather than by file or package location.",
            "Name candidate components using domain responsibility language and write one sentence defining what each owns and does not own.",
            "Identify one current code boundary that aligns well with the responsibility model and one that does not.",
            "For the mismatch, document the consequence and uncertainty before recommending any structural change.",
        ],
        deliverables: ["Responsibility map for three Steward use cases", "Candidate component ownership statements", "Code-to-responsibility mismatch note"],
        completionCriteria: ["Component names describe responsibility rather than framework structure.", "The model is supported by behavior observed in real use cases.", "A mismatch is treated as an architecture finding, not automatic permission to refactor."],
    },
    "Coupling and Cohesion Foundations": {
        objective: "Measure change pressure around one Steward responsibility and distinguish useful collaboration from costly coupling.",
        scenario: "A seemingly small Steward change repeatedly touches permission logic, review workflow, shared data shapes and persistence code. The team calls the area 'too coupled', but no one has identified what kind of coupling exists or whether every dependency is actually harmful.",
        instructions: [
            "Select one responsibility from the previous model that has meaningful collaborators.",
            "Map direct call dependencies, shared-data assumptions, database coupling, timing assumptions and deployment or ownership coordination.",
            "For each dependency, describe what would have to change if the collaborator's contract changed.",
            "Assess whether the responsibility itself is cohesive by listing its independent reasons to change.",
            "Classify at least three relationships as acceptable, concerning or unresolved and justify each classification.",
            "Choose one relationship that looks coupled but should remain as-is for now, and one whose change cost deserves future investigation.",
        ],
        deliverables: ["Coupling inventory by type", "Cohesion assessment", "Accept/concern/unresolved classification with rationale"],
        completionCriteria: ["Coupling is described concretely rather than as a vague score.", "At least one dependency is deliberately defended instead of removed by default.", "The proposed concern is tied to change cost or risk, not style preference."],
    },
    "Dependency Direction": {
        objective: "Decide whether Steward's dependency direction protects important domain policy without adding ceremonial abstraction.",
        scenario: "While tracing a Service lifecycle change, you find domain decisions intertwined with HTTP concepts, serializer data and ORM behavior. A teammate proposes interfaces around every layer. Your task is to determine which direction problems are real and where abstraction would actually buy protection.",
        instructions: [
            "Choose one use case such as activating, deprecating or retiring a Service and trace it from transport entry to persistence.",
            "Mark where transport, application orchestration, domain policy and persistence knowledge enter the flow.",
            "Identify one dependency where stable policy knows about a more volatile concern.",
            "Describe the concrete cost of leaving that direction unchanged: testing friction, replacement cost, policy leakage or another evidence-backed consequence.",
            "Compare two options: keep the current dependency versus introduce a boundary or inversion.",
            "Make a decision and state a revisit trigger; do not introduce an interface unless the evidence justifies it.",
        ],
        deliverables: ["Use-case dependency trace", "Volatility and policy-boundary analysis", "Keep-or-invert decision with revisit trigger"],
        completionCriteria: ["Dependency direction is evaluated as knowledge and change impact.", "The analysis distinguishes domain policy from transport and persistence concerns.", "Any proposed abstraction solves a named problem rather than satisfying a pattern."],
    },
    "Internal and External Dependencies": {
        objective: "Create an operationally meaningful dependency inventory for Steward that exposes ownership, contracts and failure consequences.",
        scenario: "The team has package manifests and deployment configuration, yet an architecture reviewer still cannot answer who owns each dependency, what Steward assumes about it, or what happens when it changes or becomes unavailable. You need an inventory that is useful beyond dependency installation.",
        instructions: [
            "List Steward's significant runtime/data dependencies and its important build/code dependencies separately.",
            "For each dependency, record purpose, dependency type, owner, relied-upon contract, failure effect and change-coordination mechanism.",
            "Classify whether the dependency belongs in architecture documentation, a package manifest only, or both.",
            "Identify at least one dependency that is organizationally external to the Steward team even if it is technically internal to the company or repository ecosystem.",
            "Identify one dependency whose ownership or contract is unclear and write the question that must be resolved.",
            "Choose the dependency most likely to constrain future Steward evolution and justify why.",
        ],
        deliverables: ["Architecture dependency inventory", "Ownership/contract ambiguity record", "Future constraint assessment"],
        completionCriteria: ["The inventory goes beyond package names and versions.", "Runtime, code and organizational dependency dimensions are distinguishable.", "Failure and change effects are explicit for important dependencies."],
    },
};

function applyQualityPractice(lesson: Lesson): Lesson {
    const practice = practices[lesson.title];
    if (!practice) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) =>
            activity.content.type === "practical"
                ? {
                      ...activity,
                      title: `${lesson.title}: Engineering Investigation`,
                      content: { type: "practical", ...practice },
                  }
                : activity,
        ),
    };
}

export const componentsAndDependenciesQualityLessons: Lesson[] = componentsAndDependenciesDeepLessons.map(applyQualityPractice);
