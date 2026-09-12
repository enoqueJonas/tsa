import type { Lesson } from "./lesson";

export const tracingBackendDecisionLesson: Lesson = {
    id: "observability-tracing-backend-decision",
    title: "Decision Gate: Does Steward Need a Tracing Backend?",
    activities: [
        {
            id: "observability-tracing-backend-decision-001",
            title: "Evaluate Distributed Tracing Value",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Decide whether Steward needs a real tracing backend and, if so, select one based on diagnostic value rather than observability-stack completeness.",
                scenario: "Steward has accumulated multiple boundaries across application, gateway, data stores, messaging and platform components. Tracing is justified only if it answers cross-boundary latency or causality questions that logs and metrics cannot answer efficiently.",
                instructions: [
                    "List the most important unresolved diagnostic questions across Steward, Kong, PostgreSQL, Redis, RabbitMQ and background consumers.",
                    "Identify which questions are already answerable with structured logs, correlation IDs and Prometheus metrics.",
                    "Identify the remaining questions where request/span causality, fan-out, queue handoff or latency decomposition would materially reduce investigation time.",
                    "Compare Tempo, Jaeger and at least one reasonable alternative or no-backend option against OpenTelemetry support, operational cost, storage model, query experience, Grafana integration and homelab/VPS feasibility.",
                    "Choose one outcome: no tracing backend yet; introduce a minimal tracing backend; or expand tracing only for selected high-value paths.",
                    "Record the failure modes and operational cost introduced by the chosen tracing design.",
                ],
                deliverables: [
                    "Diagnostic-question inventory",
                    "Tracing value assessment",
                    "Backend comparison and decision record",
                    "Instrumentation scope and revisit criteria",
                ],
                completionCriteria: [
                    "Tracing is justified by concrete diagnostic questions rather than stack completeness.",
                    "Existing logs and metrics are not duplicated without reason.",
                    "The selected backend fits the learner-owned infrastructure and cost guardrail.",
                    "Instrumentation scope and operational trade-offs are explicit.",
                ],
            },
        },
        {
            id: "observability-tracing-backend-decision-002",
            title: "Defend the Tracing Decision",
            estimatedMinutes: 15,
            content: {
                type: "reflection",
                prompt: "Defend Steward's tracing decision. Which production questions require traces, which remain better answered with logs or metrics, why was the chosen backend—or no backend—the right trade-off, and what evidence would change the decision later?",
                minimumCharacters: 250,
            },
        },
    ],
};
