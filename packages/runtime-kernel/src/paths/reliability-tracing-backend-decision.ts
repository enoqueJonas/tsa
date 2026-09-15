import type { Lesson } from "./lesson";

export const tracingBackendDecisionLesson: Lesson = {
    id: "observability-tracing-backend-decision",
    title: "Decision Gate: Select Steward's Tracing Backend",
    activities: [
        {
            id: "observability-tracing-backend-decision-001",
            title: "Evaluate Distributed Tracing Value and Select the Backend",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Establish the concrete tracing pressure and compare backend alternatives before implementing TSA's primary OpenTelemetry + Tempo tracing path.",
                scenario: "Steward has accumulated multiple boundaries across application, gateway, data stores, messaging and platform components. A cross-boundary operation now has enough latency and causality ambiguity that logs and metrics alone make diagnosis unnecessarily slow.",
                instructions: [
                    "List the most important diagnostic questions across Steward, Kong, PostgreSQL, Redis, RabbitMQ and background consumers.",
                    "Identify which questions are already answerable with structured logs, correlation IDs and Prometheus metrics.",
                    "Identify the remaining questions where request/span causality, asynchronous handoff or latency decomposition materially reduces investigation time.",
                    "Compare Tempo, Jaeger and at least one reasonable alternative against OpenTelemetry support, operational cost, storage model, query experience, Grafana integration and homelab/VPS feasibility.",
                    "Record Tempo as TSA's primary implementation for the following hands-on tracing exercise and explain why it fits the existing Grafana-centered observability environment.",
                    "Keep Jaeger and other tracing backends as comparison or future bounded-migration candidates rather than installing several permanent tracing stacks.",
                    "Record the failure modes and operational cost introduced by adding distributed tracing.",
                ],
                deliverables: ["Diagnostic-question inventory", "Tracing value assessment", "Backend comparison and Tempo decision record", "Instrumentation scope", "Future migration/revisit criteria"],
                completionCriteria: [
                    "Tracing is justified by concrete cross-boundary diagnostic questions rather than stack completeness.",
                    "Existing logs and metrics are not duplicated without reason.",
                    "Tempo is selected as the primary implementation and alternatives remain comparison/migration candidates.",
                    "Instrumentation scope and operational trade-offs are explicit.",
                ],
            },
        },
        {
            id: "observability-tracing-backend-decision-002",
            title: "Defend the Tracing Decision",
            estimatedMinutes: 15,
            content: { type: "reflection", prompt: "Defend Steward's decision to implement OpenTelemetry with Tempo. Which production questions require traces, which remain better answered with logs or metrics, why does Tempo fit the current environment, and what future evidence could justify a bounded migration to Jaeger or another backend?", minimumCharacters: 250 },
        },
    ],
};
