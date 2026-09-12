import type { Lesson } from "./lesson";

export const centralLoggingDecisionLesson: Lesson = {
    id: "production-logging-centralized-stack-decision",
    title: "Decision Gate: Select the Steward Centralized Logging Stack",
    activities: [
        {
            id: "production-logging-centralized-stack-decision-001",
            title: "Compare Centralized Logging Implementations",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Choose one primary centralized logging implementation for Steward while understanding the trade-offs of credible alternatives.",
                scenario: "The enterprise progression requires a real centralized logging capability, not a catalogue of products. Steward now spans application, gateway, database, messaging, CI/deployment and platform components, so the learner needs one operationally credible log path that remains feasible on learner-owned infrastructure.",
                instructions: [
                    "Define the log sources Steward must centralize first: application, Kong, containers/platform, selected infrastructure and background workers.",
                    "Define the investigation workflows the logging stack must support, including correlation by request or trace identifier, time-bounded search, component filtering and incident evidence retention.",
                    "Compare Loki, OpenSearch/ELK-style stacks and at least one lighter alternative against ingestion model, indexing/storage cost, query model, Grafana integration, resource requirements, retention controls and homelab/VPS feasibility.",
                    "Choose one primary TSA implementation and document why the strongest alternative is not also mandatory.",
                    "Define retention, access and redaction expectations so centralization does not turn secrets or personal data into a larger risk.",
                    "Record the conditions that would justify changing the selected stack later.",
                ],
                deliverables: [
                    "Log-source and investigation requirements",
                    "Logging-stack comparison",
                    "Primary implementation decision record",
                    "Retention/redaction guardrails",
                    "Revisit criteria",
                ],
                completionCriteria: [
                    "The choice is driven by investigation needs and operating cost.",
                    "One primary implementation is selected rather than requiring multiple equivalent stacks.",
                    "Security/privacy implications of centralized logs are explicit.",
                    "The design remains feasible within TSA's learner-owned infrastructure guardrail.",
                ],
            },
        },
        {
            id: "production-logging-centralized-stack-decision-002",
            title: "Defend the Logging Stack",
            estimatedMinutes: 15,
            content: {
                type: "reflection",
                prompt: "Defend the selected Steward centralized logging stack. Which investigation requirements mattered most, what trade-offs ruled out the strongest alternative, how will retention/redaction be controlled, and what future evidence would justify changing the stack?",
                minimumCharacters: 250,
            },
        },
    ],
};
