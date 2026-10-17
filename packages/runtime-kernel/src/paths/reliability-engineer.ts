import type { LearningPath } from "./learning-path";
import { alertingAndOnCallDeepLessons } from "./reliability-alerting-on-call-deep";
import { alertmanagerImplementationDeepLessons } from "./reliability-alertmanager-implementation-deep";
import { centralLoggingDecisionLesson } from "./reliability-central-logging-decision";
import { databaseStewardshipDeepLessons } from "./reliability-database-stewardship-deep";
import { dataProtectionAndDisasterRecoveryDeepLessons } from "./reliability-data-protection-disaster-recovery-deep";
import { distributedTracingImplementationDeepLessons } from "./reliability-distributed-tracing-implementation-deep";
import { faultInjectionDeepLessons } from "./reliability-fault-injection-deep";
import { incidentManagementDeepLessons } from "./reliability-incident-management-deep";
import { metricsPrometheusGrafanaDeepLessons } from "./reliability-metrics-prometheus-grafana-deep";
import { observabilityDeepLessons } from "./reliability-observability-deep";
import { observabilityStackIntegrationDeepLessons } from "./reliability-observability-stack-integration-deep";
import { performanceAndCapacityDeepLessons } from "./reliability-performance-capacity-deep";
import { productionLoggingDeepLessons } from "./reliability-production-logging-deep";
import { reliabilityAndSreDeepLessons } from "./reliability-sre-foundations-deep";
import { resilienceAndDistributedFailureDeepLessons } from "./reliability-resilience-distributed-failure-deep";
import { serviceLevelEngineeringDeepLessons } from "./reliability-service-level-engineering-deep";
import { stewardReliabilityProgramDeepLessons } from "./reliability-steward-reliability-program-deep";
import { tracingBackendDecisionLesson } from "./reliability-tracing-backend-decision";

type ReliabilityGuide = { model: string; trial: string; failure: string };
const reliabilityGuides: Record<string, ReliabilityGuide> = {
    "reliability-and-sre": { model: "Reliability is measured from user-observable outcomes, not simply uptime of machines.", trial: "Trace a Steward request and identify when a working host still yields a failed user action.", failure: "A healthy VM cannot establish healthy service." },
    "service-level-engineering": { model: "An SLI measures a behavior, an SLO is an explicit target, and error budget quantifies allowed misses.", trial: "Define a synthetic request success SLI with numerator, denominator, window and missing-data policy.", failure: "An SLO with no valid denominator gives false certainty." },
    "observability": { model: "Metrics summarize patterns, logs describe events, traces follow requests; each answers a different question.", trial: "Investigate one slow Steward transaction with a metric spike, correlated log and trace.", failure: "Raw telemetry without correlation and ownership is not diagnosis." },
    "logging": { model: "Structured logs require context, retention, cardinality discipline and deliberate secret redaction.", trial: "Record synthetic request IDs through application and proxy, then confirm tokens are absent.", failure: "An error log exposing credentials is a security incident, not good debugging." },
    "metrics-prometheus-grafana": { model: "Prometheus collects labeled time series and recording/alert rules use defined query semantics.", trial: "Add a synthetic counter and observe rate over a known window under controlled request traffic.", failure: "Unbounded user IDs in labels can exhaust metrics storage." },
    "distributed-tracing": { model: "Trace context connects service spans, but missing propagation creates gaps in causal inspection.", trial: "Follow one Steward request across proxy and API, checking propagated trace identifiers.", failure: "A trace with only a root span cannot prove a downstream dependency worked." },
    "observability-stack-integration": { model: "Correlated telemetry must agree on timestamps, service identities and request context.", trial: "Use one synthetic incident to pivot from alarm to metric, trace and sanitized log.", failure: "A dashboard link without a reproducible query cannot support on-call diagnosis." },
    "alerting-and-on-call": { model: "Alerts should represent actionable user impact and have owned response procedures.", trial: "Create a synthetic outage trigger and follow the runbook to restore service.", failure: "An alert that nobody can act on is noise." },
    "alertmanager-implementation": { model: "Alertmanager groups, routes and silences notifications; silencing is not fixing an incident.", trial: "Deliver one test alert to a disposable receiver, deduplicate repeats and check resolve notification.", failure: "A silence masking continuing user impact needs expiration and accountability." },
    "database-stewardship": { model: "Database performance and safety depend on indexing, transaction boundaries, backups and access controls.", trial: "Explain a slow query with a disposable dataset and compare measured execution plans.", failure: "Changing indexes without measuring write costs can move the bottleneck." },
    "performance-and-capacity": { model: "Latency percentiles, throughput, concurrency and saturation must be measured together.", trial: "Run a bounded synthetic load step and record p95 latency, error rate and saturation.", failure: "A faster median may hide severe tail latency." },
    "resilience-and-distributed-failure": { model: "Timeouts, retries, backoff and idempotence control how partial failures propagate.", trial: "Interrupt a disposable dependency and inspect bounded retries and duplicate-side-effect protection.", failure: "Unbounded retries can amplify an outage." },
    "data-protection-and-disaster-recovery": { model: "Backups only protect the service if restore procedures work within defined RPO and RTO.", trial: "Restore synthetic records to a separate environment, verify checksums and measure elapsed recovery.", failure: "A backup success log without a tested restore proves little." },
    "incident-management": { model: "Incident response prioritizes stabilization, communication, evidence and learning over blame.", trial: "Run a tabletop with timeline, impact estimate, incident roles and recovery decision.", failure: "A postmortem with no verified corrective action does not reduce risk." },
    "fault-injection": { model: "A fault injection experiment needs hypothesis, blast-radius limit, abort threshold and rollback.", trial: "Terminate one disposable replica and measure customer-visible response plus recovery.", failure: "Injecting failures into live shared systems without authorization is unsafe." },
    "steward-reliability-program": { model: "A mature reliability program links SLIs, alerts, logs, traces, incidents, resilience and recovery evidence.", trial: "Simulate one Steward failure from detection to rollback and after-action review.", failure: "Multiple green dashboards do not replace end-to-end evidence." },
};
function prepareReliability(path: LearningPath): LearningPath {
    const guide = reliabilityGuides[path.id];
    if (!guide) throw new Error(`Missing reliability model: ${path.id}`);
    const lessons = path.lessons.map((lesson) => ({ ...lesson, activities: lesson.activities.flatMap((activity) => {
        if (activity.content.type !== "practical") return [activity];
        const task = activity.content;
        return [{ id: `${activity.id}-reliability-preparation`, title: `Plan evidence and recovery: ${activity.title}`, estimatedMinutes: 20,
            content: { type: "reading" as const, body: `${task.scenario}\\n\\n${task.objective}`, blocks: [
                { type: "heading" as const, id: "experiment-boundary", text: "Scenario and reliability hypothesis", level: 2 as const },
                { type: "paragraph" as const, text: task.scenario },
                { type: "paragraph" as const, text: guide.model },
                { type: "heading" as const, id: "observations", text: "First observations", level: 2 as const },
                { type: "list" as const, items: task.instructions.slice(0, 3), ordered: true },
                { type: "heading" as const, id: "evidence", text: "Acceptance and measurement evidence", level: 2 as const },
                { type: "list" as const, items: task.completionCriteria },
                { type: "heading" as const, id: "abort-recovery", text: "Negative path, stop condition and recovery", level: 2 as const },
                { type: "paragraph" as const, text: guide.failure },
                { type: "paragraph" as const, text: "Use only disposable resources or approved bounded testing. Define a measurable abort threshold, capture a known-good baseline, and verify the same user-level request after restoration." },
            ] } }, activity];
    }) }));
    return { ...path, lessons: [{ id: `${path.id}-reliability-model`, title: `Worked reliability model: ${path.title}`, activities: [{ id: `${path.id}-reliability-model-reading`, title: "Concept, experiment and failure interpretation", estimatedMinutes: 30, content: { type: "reading", body: guide.model, blocks: [
        { type: "heading", id: "reliability-concept", text: "Understand the service boundary", level: 2 },
        { type: "paragraph", text: guide.model },
        { type: "heading", id: "worked-experiment", text: "Worked Steward reliability scenario", level: 2 },
        { type: "paragraph", text: guide.trial },
        { type: "heading", id: "failure-interpretation", text: "Interpret a failed observation", level: 2 },
        { type: "paragraph", text: guide.failure },
    ] } }] }, ...lessons] };
}

export const reliabilityAndSre: LearningPath = prepareReliability({ id: "reliability-and-sre", title: "Reliability and SRE Foundations", lessons: reliabilityAndSreDeepLessons });
export const observability: LearningPath = prepareReliability({ id: "observability", title: "Observability", lessons: [...observabilityDeepLessons, tracingBackendDecisionLesson] });
export const distributedTracing: LearningPath = prepareReliability({ id: "distributed-tracing", title: "Distributed Tracing with OpenTelemetry and Tempo", lessons: distributedTracingImplementationDeepLessons });
export const productionLogging: LearningPath = prepareReliability({ id: "logging", title: "Production Logging", lessons: [...productionLoggingDeepLessons, centralLoggingDecisionLesson] });
export const metricsPrometheusGrafana: LearningPath = prepareReliability({ id: "metrics-prometheus-grafana", title: "Metrics, Prometheus and Grafana", lessons: metricsPrometheusGrafanaDeepLessons });
export const observabilityStackIntegration: LearningPath = prepareReliability({ id: "observability-stack-integration", title: "Observability Stack Integration", lessons: observabilityStackIntegrationDeepLessons });
export const serviceLevelEngineering: LearningPath = prepareReliability({ id: "service-level-engineering", title: "Service Level Engineering", lessons: serviceLevelEngineeringDeepLessons });
export const alertingAndOnCall: LearningPath = prepareReliability({ id: "alerting-and-on-call", title: "Alerting and On-call", lessons: alertingAndOnCallDeepLessons });
export const alertmanagerImplementation: LearningPath = prepareReliability({ id: "alertmanager-implementation", title: "Prometheus Alertmanager Operations", lessons: alertmanagerImplementationDeepLessons });
export const databaseStewardship: LearningPath = prepareReliability({ id: "database-stewardship", title: "Database Stewardship", lessons: databaseStewardshipDeepLessons });
export const performanceAndCapacity: LearningPath = prepareReliability({ id: "performance-and-capacity", title: "Performance and Capacity", lessons: performanceAndCapacityDeepLessons });
export const resilienceAndDistributedFailure: LearningPath = prepareReliability({ id: "resilience-and-distributed-failure", title: "Resilience and Distributed Failure", lessons: resilienceAndDistributedFailureDeepLessons });
export const dataProtectionAndDisasterRecovery: LearningPath = prepareReliability({ id: "data-protection-and-disaster-recovery", title: "Data Protection and Disaster Recovery", lessons: dataProtectionAndDisasterRecoveryDeepLessons });
export const incidentManagement: LearningPath = prepareReliability({ id: "incident-management", title: "Incident Management", lessons: incidentManagementDeepLessons });
export const faultInjection: LearningPath = prepareReliability({ id: "fault-injection", title: "Fault Injection and Reliability Experiments", lessons: faultInjectionDeepLessons });
export const stewardReliabilityProgram: LearningPath = prepareReliability({ id: "steward-reliability-program", title: "Reliability Engineer Milestone", lessons: stewardReliabilityProgramDeepLessons });

// Reliability intent (SLIs/SLOs) is defined before instrumentation. Each telemetry signal is then implemented before the cross-signal integration path.
export const reliabilityEngineerPaths: LearningPath[] = [
    reliabilityAndSre,
    serviceLevelEngineering,
    observability,
    productionLogging,
    metricsPrometheusGrafana,
    distributedTracing,
    observabilityStackIntegration,
    alertingAndOnCall,
    alertmanagerImplementation,
    databaseStewardship,
    performanceAndCapacity,
    resilienceAndDistributedFailure,
    dataProtectionAndDisasterRecovery,
    incidentManagement,
    faultInjection,
    stewardReliabilityProgram,
];
