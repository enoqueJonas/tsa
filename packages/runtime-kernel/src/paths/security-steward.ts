import type { Activity } from "../activities";
import { containerAndDeliverySecurityDeepLessons } from "./security-container-delivery-deep";
import { securityFoundationsDeepLessons } from "./security-foundations-deep";
import { linuxAndNetworkSecurityDeepLessons } from "./security-linux-network-deep";
import { threatModelingDeepLessons } from "./security-threat-modeling-deep";
import { vulnerabilityLaboratoryDeepLessons } from "./security-vulnerability-laboratory-deep";
import { webAndApiThreatsDeepLessons } from "./security-web-api-threats-deep";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = {
        id: `${lessonId}-001`,
        title,
        estimatedMinutes: title.startsWith("Milestone:") ? 360 : practical ? 75 : 12,
        content: practical
            ? {
                  type: "practical",
                  objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward platform.`,
                  scenario: "Use the real Steward API, its Linux/cloud environments, delivery pipeline, internal artifact repository, steward-common and tsa-test-core as the security target. Offensive exercises must remain isolated and controlled; the purpose is to understand evidence, exploitability and defenses rather than attack third-party systems.",
                  instructions: [
                      "Define the asset, trust boundary, threat or control being investigated before selecting a technique or tool.",
                      "Use only systems and environments you are authorized to test; reproduce vulnerable behavior in isolated learner-controlled environments when exploitation is required.",
                      "Capture evidence that distinguishes a theoretical weakness from demonstrated impact.",
                      "Implement a mitigation or hardening change and retest where the exercise allows it.",
                      "Record residual risk, assumptions and operational consequences of the mitigation.",
                      "Integrate durable preventive or detective controls into the delivery or quality pipeline when justified.",
                  ],
                  deliverables: ["Security finding or threat evidence", "Mitigation/hardening artifact", "Retest and residual-risk note"],
                  completionCriteria: [
                      "Testing is controlled, authorized and reproducible.",
                      "The learner can explain the threat path, affected asset and security boundary.",
                      "Mitigations are verified rather than assumed effective.",
                  ],
              }
            : {
                  type: "reading",
                  body: focus ?? `This breadth lesson establishes ${title} as a security-engineering capability for the Steward ecosystem. Deep authoring will add researched TSA teaching, safe labs, worked examples, resources and knowledge checks.`,
              },
    };
    return { id: lessonId, title, activities: [activity] };
}

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
    lessons: [
        "Secure Authentication",
        "Authorization Design and Testing",
        "Input Validation",
        "Secure Error Handling",
        "Secrets Management",
        "Security Headers and Configuration",
        "Security Logging",
        "Rate Limiting and Abuse Resistance",
        "Data Protection",
        "Security-focused Code Review",
        "Abuse Cases and Negative Security Requirements",
        "Security Regression Testing",
        "Lab: Harden Steward API",
    ].map((title) => lesson("application-security", title)),
};

export const stewardSecurityAssessment: LearningPath = {
    id: "steward-security-assessment-and-hardening",
    title: "Security Steward Milestone",
    lessons: [
        lesson(
            "steward-security-assessment-and-hardening",
            "Milestone: Steward Security Assessment and Hardening",
            "Deliver an evidence-based security assessment and hardening program for the complete Steward ecosystem. Include an updated threat model, prioritized web/API findings, controlled vulnerability reproduction, Linux/network hardening, application mitigations, CI/CD and container security, internal artifact-repository controls, scanning and provenance evidence for steward-common and tsa-test-core, security regression checks, retest evidence and a residual-risk register. The milestone must distinguish verified controls from recommendations that remain unimplemented."
        ),
    ],
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
