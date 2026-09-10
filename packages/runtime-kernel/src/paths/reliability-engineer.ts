import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
import { observabilityDeepLessons } from "./reliability-observability-deep";
import { productionLoggingDeepLessons } from "./reliability-production-logging-deep";
import { reliabilityAndSreDeepLessons } from "./reliability-sre-foundations-deep";

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = {
        id: `${lessonId}-001`, title,
        estimatedMinutes: title.startsWith("Milestone:") ? 420 : practical ? 75 : 12,
        content: practical ? {
            type: "practical",
            objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward platform.`,
            scenario: "Treat the deployed Steward ecosystem as an operated service rather than a project. Use application, infrastructure, delivery, test, Nexus and dependency telemetry to detect, explain, recover from and learn from real failure modes.",
            instructions: ["State the reliability question, user impact or failure hypothesis before adding telemetry or changing infrastructure.", "Prefer signals that support diagnosis and decisions over dashboards built for appearance.", "Define the expected steady state and the evidence that would prove degradation or recovery.", "Where failure is introduced deliberately, constrain blast radius and define a stop/recovery condition first.", "Capture timelines, commands, metrics, logs and recovery evidence.", "Convert meaningful findings into runbook, alert, capacity, resilience or engineering changes."],
            deliverables: ["Operational evidence from the Steward environment", "Reliability analysis or runbook artifact", "Recovery or improvement evidence"],
            completionCriteria: ["The learner connects telemetry to user-visible or system reliability rather than collecting signals without purpose.", "Recovery behavior is demonstrated where the lab involves failure.", "The learner can explain remaining reliability risk and operational trade-offs."],
        } : { type: "reading", body: focus ?? `This breadth lesson establishes ${title} as a reliability-engineering capability for the Steward ecosystem. Deep authoring will add researched TSA teaching, worked incidents, official resources, exercises and knowledge checks.` },
    };
    return { id: lessonId, title, activities: [activity] };
}

function path(id: string, title: string, titles: string[]): LearningPath {
    return { id, title, lessons: titles.map((title) => lesson(id, title)) };
}

export const reliabilityAndSre: LearningPath = { id: "reliability-and-sre", title: "Reliability and SRE Foundations", lessons: reliabilityAndSreDeepLessons };
export const observability: LearningPath = { id: "observability", title: "Observability", lessons: observabilityDeepLessons };
export const productionLogging: LearningPath = { id: "logging", title: "Production Logging", lessons: productionLoggingDeepLessons };

export const metricsPrometheusGrafana: LearningPath = {
    id: "metrics-prometheus-grafana", title: "Metrics, Prometheus and Grafana",
    lessons: ["Metrics Mental Models", "Counters, Gauges and Histograms", "Application and Infrastructure Metrics", "Prometheus Architecture", "Exporters", "Service Discovery Concepts", "PromQL", "Recording Rules Concepts", "Grafana", "Dashboard Design", "Dashboard Anti-patterns", "Nexus and Internal Platform Metrics", "CI and Delivery Metrics"].map((title) => lesson("metrics-prometheus-grafana", title)).concat([
        lesson("metrics-prometheus-grafana", "Lab: Instrument Steward API", "Instrument Steward API and supporting infrastructure with meaningful metrics, scrape them with Prometheus and build Grafana views that answer concrete operational questions about traffic, errors, latency, saturation and dependency health."),
        lesson("metrics-prometheus-grafana", "Lab: Observe the Internal Artifact Platform", "Add operational visibility for the internal Nexus/artifact service, including availability, storage growth and publish/download failure evidence because delivery and quality pipelines now depend on it."),
    ]),
};

export const serviceLevelEngineering: LearningPath = {
    id: "service-level-engineering", title: "Service Level Engineering",
    lessons: ["SLIs", "SLOs", "SLAs", "Error Budgets", "User-visible Reliability", "Choosing Good Indicators", "Windowing and Measurement Concepts", "Reliability Targets and Trade-offs", "Error Budgets and Release Decisions"].map((title) => lesson("service-level-engineering", title)).concat([lesson("service-level-engineering", "Lab: Define Steward SLOs", "Define a small set of defensible Steward SLIs and SLOs based on user-visible behavior, implement measurements for them, and explain how error-budget consumption would influence release or reliability work.")]),
};

export const alertingAndOnCall = path("alerting-and-on-call", "Alerting and On-call", ["Symptoms vs Causes", "Actionable Alerts", "Alert Fatigue", "Severity", "Escalation", "Alert Routing Concepts", "Runbooks", "On-call Handover and Context", "Lab: Build Steward Alerts and Runbooks"]);
export const performanceAndCapacity = path("performance-and-capacity", "Performance and Capacity", ["Latency and Throughput", "Saturation", "Bottlenecks", "Load and Stress Testing", "Capacity Planning", "Resource Utilization", "Database and Application Bottlenecks", "Performance Baselines", "Queueing and Contention Concepts", "Storage Growth and Artifact Capacity", "Lab: Establish Steward Capacity Baselines"]);
export const resilienceAndDistributedFailure = path("resilience-and-distributed-failure", "Resilience and Distributed Failure", ["Timeouts", "Retries", "Exponential Backoff and Jitter", "Circuit Breakers", "Idempotency", "Partial Failure", "Dependency Failure", "Cascading Failure", "Queues and Backpressure", "Graceful Degradation", "Retry Storms and Amplification", "Dependency Availability Budgets", "Lab: Harden Steward Against Dependency Failure"]);

export const dataProtectionAndDisasterRecovery: LearningPath = {
    id: "data-protection-and-disaster-recovery", title: "Data Protection and Disaster Recovery",
    lessons: ["Backups", "Backup Integrity", "Restore Testing", "RPO and RTO", "Disaster Scenarios", "Recovery Procedures", "Database Recovery", "Artifact Repository Backup and Restore", "Configuration and Infrastructure Recovery", "Recovery Evidence"].map((title) => lesson("data-protection-and-disaster-recovery", title)).concat([lesson("data-protection-and-disaster-recovery", "Lab: Run a Steward Restore Drill", "Perform a controlled restore exercise for critical Steward data and at least one supporting platform dependency. Measure recovery against stated RPO/RTO expectations and document gaps rather than treating backup creation as proof of recoverability.")]),
};

export const incidentManagement = path("incident-management", "Incident Management", ["Detection", "Triage", "Incident Roles", "Communication", "Mitigation", "Timeline Construction", "Root Cause", "Contributing Factors", "Blameless Postmortems", "Corrective Actions", "Learning from Near Misses", "Lab: Run a Steward Incident Exercise"]);

export const faultInjection: LearningPath = {
    id: "fault-injection", title: "Fault Injection and Reliability Experiments",
    lessons: ["Hypothesis-driven Reliability Experiments", "Controlled Failure Injection", "Blast Radius and Safety", "Process and Container Failure", "Resource Exhaustion Concepts", "Network and Dependency Failure Simulation", "Database Failure Scenarios", "Artifact Repository Failure Scenarios", "Recovery Verification", "Chaos Engineering Principles and Safety"].map((title) => lesson("fault-injection", title)).concat([lesson("fault-injection", "Lab: Run a Steward Reliability Experiment", "Define a falsifiable hypothesis about Steward behavior under failure, constrain blast radius, inject a controlled failure into learner-owned infrastructure, observe detection and recovery, and turn the evidence into a concrete reliability improvement.")]),
};

export const stewardReliabilityProgram: LearningPath = {
    id: "steward-reliability-program", title: "Reliability Engineer Milestone",
    lessons: [lesson("steward-reliability-program", "Milestone: Steward Reliability Program", "Operate Steward as a measurable service: instrument application and infrastructure signals; centralize useful logs; expose Prometheus metrics and Grafana dashboards; define SLIs/SLOs and an error-budget model; implement actionable alerts and runbooks; establish performance/capacity baselines; harden representative dependency-failure paths; prove backup/restore capability; run an incident exercise and at least one controlled reliability experiment; and include the internal Nexus/artifact platform as a dependency whose availability, storage and recovery are measured. Produce a reliability review with evidence, unresolved risks and prioritized improvements.")],
};

export const reliabilityEngineerPaths: LearningPath[] = [reliabilityAndSre, observability, productionLogging, metricsPrometheusGrafana, serviceLevelEngineering, alertingAndOnCall, performanceAndCapacity, resilienceAndDistributedFailure, dataProtectionAndDisasterRecovery, incidentManagement, faultInjection, stewardReliabilityProgram];
