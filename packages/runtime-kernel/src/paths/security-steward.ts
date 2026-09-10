import { applicationSecurityDeepLessons } from "./security-application-deep";
import { containerAndDeliverySecurityDeepLessons } from "./security-container-delivery-deep";
import { securityFoundationsDeepLessons } from "./security-foundations-deep";
import { linuxAndNetworkSecurityDeepLessons } from "./security-linux-network-deep";
import { stewardSecurityAssessmentDeepLessons } from "./security-steward-milestone-deep";
import { threatModelingDeepLessons } from "./security-threat-modeling-deep";
import { vulnerabilityLaboratoryDeepLessons } from "./security-vulnerability-laboratory-deep";
import { webAndApiThreatsDeepLessons } from "./security-web-api-threats-deep";
import type { LearningPath } from "./learning-path";

export const securityFoundations: LearningPath = {
    id: "security-foundations",
    title: "Security Foundations",
    lessons: securityFoundationsDeepLessons,
};

export const threatModeling: LearningPath = {
    id: "threat-modeling",
    title: "Threat Modeling",
    lessons: threatModelingDeepLessons,
};

export const webAndApiThreats: LearningPath = {
    id: "web-and-api-threats",
    title: "Web and API Threats",
    lessons: webAndApiThreatsDeepLessons,
};

export const vulnerabilityLaboratory: LearningPath = {
    id: "vulnerability-laboratory",
    title: "Practical Vulnerability Laboratory",
    lessons: vulnerabilityLaboratoryDeepLessons,
};

export const linuxAndNetworkSecurity: LearningPath = {
    id: "linux-and-network-security",
    title: "Linux and Network Security",
    lessons: linuxAndNetworkSecurityDeepLessons,
};

export const containerAndDeliverySecurity: LearningPath = {
    id: "container-and-delivery-security",
    title: "Container and Delivery Security",
    lessons: containerAndDeliverySecurityDeepLessons,
};

export const applicationSecurity: LearningPath = {
    id: "application-security",
    title: "Application Security",
    lessons: applicationSecurityDeepLessons,
};

export const stewardSecurityAssessment: LearningPath = {
    id: "steward-security-assessment-and-hardening",
    title: "Security Steward Milestone",
    lessons: stewardSecurityAssessmentDeepLessons,
};

export const securityStewardPaths: LearningPath[] = [
    securityFoundations,
    threatModeling,
    webAndApiThreats,
    vulnerabilityLaboratory,
    linuxAndNetworkSecurity,
    containerAndDeliverySecurity,
    applicationSecurity,
    stewardSecurityAssessment,
];
