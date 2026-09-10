import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
import { architectureGovernanceDeepLessons } from "./technical-steward-architecture-governance-deep";
import { changeServiceGovernanceDeepLessons } from "./technical-steward-change-service-governance-deep";
import { controlsComplianceAssuranceDeepLessons } from "./technical-steward-controls-compliance-assurance-deep";
import { engineeringGovernanceDeepLessons } from "./technical-steward-engineering-governance-deep";
import { handbookAndStandardsDeepLessons } from "./technical-steward-handbook-standards-deep";
import { securityDataGovernanceDeepLessons } from "./technical-steward-security-data-governance-deep";
import { technicalDebtHealthDeepLessons } from "./technical-steward-technical-debt-health-deep";
import { technicalLeadershipDeepLessons } from "./technical-steward-technical-leadership-deep";
import { thirdPartyLifecycleRiskDeepLessons } from "./technical-steward-third-party-lifecycle-risk-deep";
import { technologyGovernanceDeepLessons } from "./technical-steward-technology-governance-deep";
import { technologyRiskDeepLessons } from "./technical-steward-technology-risk-deep";

function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = {
        id: `${lessonId}-001`,
        title,
        estimatedMinutes: title.startsWith("Milestone:") ? 420 : practical ? 75 : 12,
        content: practical ? {
            type: "practical",
            objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward ecosystem.`,
            scenario: "Treat Steward as an organization-owned technology service with stakeholders, technical risk, controls, standards, lifecycle decisions, operational evidence and multiple internal dependencies. Governance artifacts must improve decisions and accountability rather than exist as paperwork.",
            instructions: ["Identify the decision, risk or accountability problem before creating a policy, control or review artifact.", "Use evidence accumulated across architecture, delivery, quality, security and reliability work.", "Define ownership, decision rights, control objectives, exceptions and review cadence where appropriate.", "Distinguish policy intent from implementation detail and distinguish control design from control operating evidence.", "Assess trade-offs between risk reduction, engineering speed, cost and operational burden.", "Produce an artifact that another engineer or reviewer could actually use."],
            deliverables: ["Stewardship/governance artifact", "Evidence and rationale", "Ownership, exception or follow-up record"],
            completionCriteria: ["The artifact addresses a real governance or stewardship need.", "Accountability and evidence requirements are explicit.", "The proposed governance mechanism is proportionate and avoids unnecessary bureaucracy."],
        } : { type: "reading", body: focus ?? `This breadth lesson establishes ${title} as a technical-stewardship capability for the mature Steward ecosystem. Deep authoring will add detailed TSA teaching, standards/framework references, worked governance cases, exercises and review questions.` },
    };
    return { id: lessonId, title, activities: [activity] };
}

export const technicalLeadership: LearningPath = { id: "technical-leadership", title: "Technical Leadership", lessons: technicalLeadershipDeepLessons };
export const engineeringGovernance: LearningPath = { id: "engineering-governance", title: "Engineering Governance", lessons: engineeringGovernanceDeepLessons };
export const technologyGovernance: LearningPath = { id: "technology-governance", title: "IT and Technology Governance", lessons: technologyGovernanceDeepLessons };
export const technologyRisk: LearningPath = { id: "technology-risk", title: "Technology Risk", lessons: technologyRiskDeepLessons };
export const controlsComplianceAssurance: LearningPath = { id: "controls-compliance-assurance", title: "Controls, Compliance and Assurance", lessons: controlsComplianceAssuranceDeepLessons };
export const architectureGovernance: LearningPath = { id: "architecture-governance", title: "Architecture Governance", lessons: architectureGovernanceDeepLessons };
export const securityDataGovernance: LearningPath = { id: "security-data-governance", title: "Security and Data Governance", lessons: securityDataGovernanceDeepLessons };
export const changeServiceGovernance: LearningPath = { id: "change-service-governance", title: "Change and Service Governance", lessons: changeServiceGovernanceDeepLessons };
export const thirdPartyLifecycleRisk: LearningPath = { id: "third-party-lifecycle-risk", title: "Third-party and Technology Lifecycle Risk", lessons: thirdPartyLifecycleRiskDeepLessons };
export const technicalDebtHealth: LearningPath = { id: "technical-debt-health", title: "Technical Debt and Engineering Health", lessons: technicalDebtHealthDeepLessons };
export const handbookAndStandards: LearningPath = { id: "handbook-and-standards", title: "Engineering Handbook and Standards", lessons: handbookAndStandardsDeepLessons };
export const technicalStewardshipReview: LearningPath = { id: "technical-stewardship-review", title: "Technical Steward Milestone", lessons: [lesson("technical-stewardship-review", "Milestone: Technical Stewardship Review", "Conduct and defend a full stewardship review of the mature Steward service. Produce a technology risk register, control set and evidence, architecture/security/change governance decisions, service ownership model, third-party and internal dependency policy, lifecycle decisions for steward-common/tsa-test-core/Nexus/cloud dependencies, engineering health view, handbook/standards package, exception handling model and prioritized improvement roadmap. Demonstrate that governance supports accountable engineering decisions rather than replacing engineering judgment with bureaucracy.")] };

export const technicalStewardPaths: LearningPath[] = [technicalLeadership, engineeringGovernance, technologyGovernance, technologyRisk, controlsComplianceAssurance, architectureGovernance, securityDataGovernance, changeServiceGovernance, thirdPartyLifecycleRisk, technicalDebtHealth, handbookAndStandards, technicalStewardshipReview];
