import type { Lesson } from "./lesson";

export const centralLoggingDecisionLesson: Lesson = {
    id: "production-logging-centralized-stack-decision",
    title: "Decision Gate: Select the Steward Centralized Logging Stack",
    activities: [
        {
            id: "production-logging-centralized-stack-decision-001",
            title: "Compare Centralized Logging Implementations",
            estimatedMinutes: 60,
            content: {
                type: "practical",
                objective: "Compare credible centralized logging stacks and justify Graylog as TSA's primary Steward implementation without duplicating the logging capability.",
                scenario: "The enterprise progression now requires a real centralized logging capability. Steward spans application, gateway, database, messaging, CI/deployment and platform components, so operators need one searchable operational log path. TSA selects Graylog as the primary implementation to provide hands-on experience with ingestion, parsing/pipelines, streams/search, retention and access control. Loki and OpenSearch/ELK-style stacks remain important alternatives to compare, not second permanent log platforms.",
                instructions: [
                    "Define the log sources Steward must centralize first: application, workers/messaging, Kong, containers/platform and selected infrastructure/delivery sources.",
                    "Define the investigation workflows the stack must support, including correlation by request or trace identifier, time-bounded search, component filtering and incident evidence retention.",
                    "Compare Graylog, Loki and OpenSearch/ELK-style approaches against ingestion model, parsing/indexing model, query/search workflow, storage/resource cost, retention controls, access control, Grafana integration and learner-owned infrastructure feasibility.",
                    "Explain why Graylog is TSA's primary implementation for the current learning objective and identify the strongest trade-offs against Loki and OpenSearch/ELK.",
                    "Document why Graylog and Prometheus/Grafana are not duplicate systems: Graylog owns centralized logs; Prometheus owns metrics; Grafana is the primary metrics/observability dashboard layer.",
                    "Define retention, access and redaction expectations so centralization does not turn secrets or personal data into a larger risk.",
                    "Record measurable conditions that could justify migrating from Graylog later, including how a migration would avoid permanent dual logging stacks."
                ],
                deliverables: [
                    "Log-source and investigation requirements",
                    "Graylog/Loki/OpenSearch comparison",
                    "Graylog primary-implementation decision record",
                    "Graylog vs Prometheus/Grafana responsibility map",
                    "Retention/redaction/access guardrails",
                    "Migration/revisit criteria"
                ],
                completionCriteria: [
                    "Graylog is selected as the primary Steward centralized logging implementation for TSA.",
                    "Loki and OpenSearch/ELK are understood as alternatives rather than additional mandatory production stacks.",
                    "Graylog and Prometheus/Grafana responsibilities are explicitly distinct.",
                    "Security/privacy implications of centralized logs are explicit.",
                    "The design remains feasible within TSA's learner-owned infrastructure guardrail.",
                    "Future replacement criteria are evidence-based and would lead to migration rather than permanent duplication."
                ]
            }
        },
        {
            id: "production-logging-centralized-stack-decision-002",
            title: "Defend Graylog as the Logging Platform",
            estimatedMinutes: 20,
            content: {
                type: "reflection",
                prompt: "Defend Graylog as TSA's primary Steward centralized logging platform. What does it teach that is valuable for the Academy? What did Loki and OpenSearch/ELK do better or differently? Why does choosing Graylog not remove Prometheus or Grafana? What should Graylog own, what should Prometheus own, and what should Grafana own? Finally, what future evidence would justify replacing Graylog and how would you migrate without maintaining two permanent log platforms?",
                minimumCharacters: 400
            }
        }
    ]
};
