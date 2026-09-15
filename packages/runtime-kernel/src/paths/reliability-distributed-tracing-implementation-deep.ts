import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const otel: LearningResource = { title: "OpenTelemetry documentation", url: "https://opentelemetry.io/docs/" };
const tempo: LearningResource = { title: "Grafana Tempo documentation", url: "https://grafana.com/docs/tempo/latest/" };
const jaeger: LearningResource = { title: "Jaeger documentation", url: "https://www.jaegertracing.io/docs/" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "Steward now crosses enough boundaries that correlation IDs alone are no longer sufficient for every latency and causality question. TSA therefore requires one real distributed-tracing implementation rather than allowing the learner to graduate after a backend comparison only." },
    { type: "heading", id: "tracing-contract", text: "Tracing contract", level: 2 },
    { type: "list", items: [
        "OpenTelemetry is the instrumentation and telemetry propagation standard used by Steward.",
        "Grafana Tempo is TSA's primary tracing backend for the implementation exercise.",
        "Jaeger is a comparison or future migration candidate, not a second permanent tracing stack.",
        "Prometheus/Grafana remain the primary metrics and dashboard path; Graylog remains the primary centralized log-management path.",
        "Trace context must cross meaningful synchronous and asynchronous boundaries rather than decorating one HTTP handler with a single span."
    ] },
    { type: "resources", title: "Continue learning", resources: [otel, tempo, jaeger] },
];

export const distributedTracingImplementationDeepLessons: Lesson[] = [
    {
        id: "reliability-distributed-tracing-implementation",
        title: "Distributed Tracing with OpenTelemetry and Tempo",
        activities: [
            { id: "reliability-distributed-tracing-implementation-001", title: "Trace the Steward Request Path", estimatedMinutes: 45, content: { type: "reading", body: "Use tracing where it reveals cross-boundary causality and latency that metrics and logs cannot express efficiently.", blocks } },
            {
                id: "reliability-distributed-tracing-implementation-002",
                title: "Deploy Tempo and Instrument Steward",
                estimatedMinutes: 240,
                content: { type: "practical", objective: "Implement a real OpenTelemetry trace path from Steward into Grafana Tempo.", scenario: "A user-visible Steward operation crosses Kong, the API, PostgreSQL and at least one additional dependency or worker. Operators can see that the operation is slow, but metrics and logs require manual reconstruction to determine where time was spent.", instructions: [
                    "Deploy Grafana Tempo in the learner-owned environment with explicit persistence/resource assumptions and an OTLP ingestion path.",
                    "Instrument Steward with the appropriate OpenTelemetry SDK/instrumentation and export traces through OTLP. Prefer a Collector when it improves separation, buffering, routing or future backend migration; document the chosen topology.",
                    "Set stable service/resource attributes such as service name and environment without putting secrets or high-cardinality user data into attributes.",
                    "Create server spans for inbound Steward requests and capture PostgreSQL plus at least one additional meaningful dependency boundary.",
                    "Propagate W3C trace context across Kong/API boundaries where supported and across one asynchronous RabbitMQ producer/consumer handoff. If a component cannot preserve context automatically, implement and document the explicit propagation boundary.",
                    "Add a small number of domain-relevant custom spans/events only where they clarify the operation; do not trace every function.",
                    "Open the resulting trace in the tracing UI/Grafana integration and prove one operation is represented by multiple causally related spans."
                ], deliverables: ["Tracing topology", "OpenTelemetry instrumentation", "Tempo deployment", "Cross-boundary trace evidence", "Attribute/cardinality policy", "Propagation evidence"], completionCriteria: ["Tempo is actually running and receiving Steward traces.", "A trace crosses multiple real Steward boundaries rather than containing one isolated span.", "At least one asynchronous producer/consumer handoff preserves or explicitly links trace context.", "Trace attributes avoid secrets and uncontrolled high-cardinality values.", "The learner can identify where time was spent from span timing rather than guessing from log timestamps."] },
            },
            {
                id: "reliability-distributed-tracing-implementation-003",
                title: "Investigate Cross-Boundary Latency",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Use metrics, traces and logs together during a controlled incident.", scenario: "A Steward operation exceeds its normal latency. The investigation must start from the symptom and use each observability signal for the question it answers best.", instructions: [
                    "Capture a healthy baseline for the selected operation in Prometheus/Grafana, Tempo and Graylog.",
                    "Introduce controlled latency or failure in one downstream boundary such as PostgreSQL, Redis, RabbitMQ consumer processing or another traced dependency.",
                    "Use Prometheus/Grafana first to establish the time window and user-visible symptom without relying on prior knowledge of the injected component.",
                    "Find a representative slow/error trace in Tempo and identify the span or handoff responsible for most of the delay/failure path.",
                    "Use trace/correlation context to locate the relevant centralized events in Graylog and explain the detailed event-level behavior.",
                    "Recover the dependency and verify metric recovery, healthy trace shape and expected log behavior.",
                    "Correct at least one instrumentation or observability gap discovered during the investigation."
                ], deliverables: ["Healthy baseline", "Injected-failure record", "Prometheus/Grafana symptom evidence", "Tempo trace investigation", "Graylog correlated evidence", "Recovery proof", "Instrumentation improvement"], completionCriteria: ["The affected dependency is identified from telemetry rather than from knowledge of where the fault was injected.", "The trace provides latency/causality evidence that metrics alone did not provide.", "Graylog provides event detail that traces alone did not provide.", "Recovery is visible across the appropriate signals.", "At least one real observability gap is improved after the exercise."] },
            },
            {
                id: "reliability-distributed-tracing-implementation-004",
                title: "Break the Tracing Pipeline",
                estimatedMinutes: 120,
                content: { type: "practical", objective: "Prove that telemetry failure does not become application failure and understand the cost of lost traces.", scenario: "Tempo or the telemetry export path becomes unavailable while Steward continues serving traffic.", instructions: [
                    "Stop or isolate Tempo or the selected OTLP receiving path while generating representative Steward traffic.",
                    "Observe exporter/Collector retry, queue, drop and resource behavior. Bound the experiment so telemetry backpressure cannot exhaust the application.",
                    "Prove the core Steward workflow remains available or degrades only according to an explicitly documented telemetry dependency policy.",
                    "Restore the tracing pipeline and determine which telemetry was recovered, buffered or permanently lost.",
                    "Document monitoring needed for the tracing pipeline itself and one guardrail that prevents observability from becoming an availability dependency."
                ], deliverables: ["Tracing-pipeline failure experiment", "Application behavior evidence", "Buffer/drop analysis", "Recovery evidence", "Tracing self-monitoring requirement"], completionCriteria: ["Tracing backend/export failure is reproduced deliberately.", "The application does not silently become dependent on successful trace export.", "Lost versus buffered telemetry behavior is understood.", "The learner identifies how the tracing pipeline itself should be monitored."] },
            },
            { id: "reliability-distributed-tracing-implementation-005", title: "Defend the Tracing Architecture", estimatedMinutes: 20, content: { type: "reflection", prompt: "Defend Steward's OpenTelemetry + Tempo implementation. Explain which diagnostic question justified tracing, how context crosses synchronous and asynchronous boundaries, what Prometheus/Grafana still owns, what Graylog still owns, what happens when Tempo is unavailable, and what evidence would justify a future bounded migration from Tempo to Jaeger or another backend.", minimumCharacters: 350 } },
        ],
    },
];
