import type { LearningPath } from "./learning-path";
import { alertingAndOnCallDeepLessons } from "./reliability-alerting-on-call-deep";
import { centralLoggingDecisionLesson } from "./reliability-central-logging-decision";
import { databaseStewardshipDeepLessons } from "./reliability-database-stewardship-deep";
import { dataProtectionAndDisasterRecoveryDeepLessons } from "./reliability-data-protection-disaster-recovery-deep";
import { faultInjectionDeepLessons } from "./reliability-fault-injection-deep";
import { incidentManagementDeepLessons } from "./reliability-incident-management-deep";
import { metricsPrometheusGrafanaDeepLessons } from "./reliability-metrics-prometheus-grafana-deep";
import { observabilityDeepLessons } from "./reliability-observability-deep";
import { performanceAndCapacityDeepLessons } from "./reliability-performance-capacity-deep";
import { productionLoggingDeepLessons } from "./reliability-production-logging-deep";
import { reliabilityAndSreDeepLessons } from "./reliability-sre-foundations-deep";
import { resilienceAndDistributedFailureDeepLessons } from "./reliability-resilience-distributed-failure-deep";
import { serviceLevelEngineeringDeepLessons } from "./reliability-service-level-engineering-deep";
import { stewardReliabilityProgramDeepLessons } from "./reliability-steward-reliability-program-deep";
import { tracingBackendDecisionLesson } from "./reliability-tracing-backend-decision";

export const reliabilityAndSre: LearningPath = {
    id: "reliability-and-sre",
    title: "Reliability and SRE Foundations",
    lessons: reliabilityAndSreDeepLessons,
};

export const observability: LearningPath = {
    id: "observability",
    title: "Observability",
    lessons: [...observabilityDeepLessons, tracingBackendDecisionLesson],
};

export const productionLogging: LearningPath = {
    id: "logging",
    title: "Production Logging",
    lessons: [...productionLoggingDeepLessons, centralLoggingDecisionLesson],
};

export const metricsPrometheusGrafana: LearningPath = {
    id: "metrics-prometheus-grafana",
    title: "Metrics, Prometheus and Grafana",
    lessons: metricsPrometheusGrafanaDeepLessons,
};

export const serviceLevelEngineering: LearningPath = {
    id: "service-level-engineering",
    title: "Service Level Engineering",
    lessons: serviceLevelEngineeringDeepLessons,
};

export const alertingAndOnCall: LearningPath = {
    id: "alerting-and-on-call",
    title: "Alerting and On-call",
    lessons: alertingAndOnCallDeepLessons,
};

export const databaseStewardship: LearningPath = {
    id: "database-stewardship",
    title: "Database Stewardship",
    lessons: databaseStewardshipDeepLessons,
};

export const performanceAndCapacity: LearningPath = {
    id: "performance-and-capacity",
    title: "Performance and Capacity",
    lessons: performanceAndCapacityDeepLessons,
};

export const resilienceAndDistributedFailure: LearningPath = {
    id: "resilience-and-distributed-failure",
    title: "Resilience and Distributed Failure",
    lessons: resilienceAndDistributedFailureDeepLessons,
};

export const dataProtectionAndDisasterRecovery: LearningPath = {
    id: "data-protection-and-disaster-recovery",
    title: "Data Protection and Disaster Recovery",
    lessons: dataProtectionAndDisasterRecoveryDeepLessons,
};

export const incidentManagement: LearningPath = {
    id: "incident-management",
    title: "Incident Management",
    lessons: incidentManagementDeepLessons,
};

export const faultInjection: LearningPath = {
    id: "fault-injection",
    title: "Fault Injection and Reliability Experiments",
    lessons: faultInjectionDeepLessons,
};

export const stewardReliabilityProgram: LearningPath = {
    id: "steward-reliability-program",
    title: "Reliability Engineer Milestone",
    lessons: stewardReliabilityProgramDeepLessons,
};

export const reliabilityEngineerPaths: LearningPath[] = [
    reliabilityAndSre,
    observability,
    productionLogging,
    metricsPrometheusGrafana,
    serviceLevelEngineering,
    alertingAndOnCall,
    databaseStewardship,
    performanceAndCapacity,
    resilienceAndDistributedFailure,
    dataProtectionAndDisasterRecovery,
    incidentManagement,
    faultInjection,
    stewardReliabilityProgram,
];
