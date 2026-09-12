import type { Lesson } from "./lesson";

export const performanceToolDecisionLesson: Lesson = {
    id: "non-functional-quality-performance-tool-decision",
    title: "Decision Gate: Select the Steward Performance Tool",
    activities: [
        {
            id: "non-functional-quality-performance-tool-decision-001",
            title: "Compare Performance Test Tooling",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Select a primary performance-testing implementation for Steward based on the system, CI model and learning goals rather than tool popularity.",
                scenario: "The curriculum has intentionally taught load, stress, spike and endurance concepts before locking Steward into a performance tool. Compare representative options such as Locust and k6 and choose one primary implementation while preserving transferable performance-engineering concepts.",
                instructions: [
                    "Define the Steward workloads that need performance evidence: HTTP/API behavior, concurrency shape, authentication, data setup, thresholds and the metrics required for diagnosis.",
                    "Compare Locust, k6 and at least one reasonable alternative or native approach against Python ecosystem fit, scripting model, local execution, container execution, CI integration, distributed execution, output formats, observability integration and learner complexity.",
                    "Run or design the same small baseline scenario in the two strongest candidates where practical so the decision uses execution evidence rather than feature lists alone.",
                    "Choose the primary TSA performance tool for Steward and record why the rejected option remains a useful comparison rather than a second mandatory implementation.",
                    "Define what evidence would justify changing the selected tool later.",
                ],
                deliverables: [
                    "Performance-tool decision matrix",
                    "Baseline comparison evidence",
                    "Primary-tool ADR or decision record",
                    "Revisit criteria",
                ],
                completionCriteria: [
                    "The decision starts from Steward workloads and evidence needs.",
                    "CI/container and observability integration are considered explicitly.",
                    "The learner chooses one primary implementation rather than accumulating tools.",
                    "Tool-specific syntax is separated from transferable performance concepts.",
                ],
            },
        },
        {
            id: "non-functional-quality-performance-tool-decision-002",
            title: "Defend the Tool Choice",
            estimatedMinutes: 15,
            content: {
                type: "reflection",
                prompt: "Defend the selected Steward performance-testing tool. Which workload and operational requirements drove the choice, what did the strongest alternative do better, and what future evidence would justify revisiting the decision?",
                minimumCharacters: 250,
            },
        },
    ],
};
