import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
import { engineeringGovernanceDeepLessons } from "./technical-steward-engineering-governance-deep";
import { technicalLeadershipDeepLessons } from "./technical-steward-technical-leadership-deep";
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
function path(id: string, title: string, titles: string[]): LearningPath { return { id, title, lessons: titles.map((title) => lesson(id, title)) }; }

export const technicalLeadership: LearningPath = { id: "technical-leadership", title: "Technical Leadership", lessons: technicalLeadershipDeepLessons };
export const engineeringGovernance: LearningPath = { id: "engineering-governance", title: "Engineering Governance", lessons: engineeringGovernanceDeepLessons };
export const technologyGovernance: LearningPath = { id: "technology-governance", title: "IT and Technology Governance", lessons: technologyGovernanceDeepLessons };
export const technologyRisk: LearningPath = { id: "technology-risk", title: "Technology Risk", lessons: technologyRiskDeepLessons };

export const controlsComplianceAssurance = path("controls-compliance-assurance", "Controls, Compliance and Assurance", ["Preventive, Detective and Corrective Controls", "Control Objectives", "Control Design", "Control Effectiveness", "Evidence", "Control Testing", "Compliance vs Security", "Audit Fundamentals", "Findings and Remediation", "Designing Proportionate Controls", "Lab: Test Steward Engineering Controls"]);
export const architectureGovernance = path("architecture-governance", "Architecture Governance", ["Architecture Principles", "Technology Standards", "Technology Selection", "Architecture Reviews", "Architecture Exceptions", "Technology Lifecycle", "Architecture Decision Ownership", "Standards vs Context-specific Decisions", "Lab: Govern a Steward Architecture Exception"]);
export const securityDataGovernance = path("security-data-governance", "Security and Data Governance", ["Security Governance", "Roles and Accountability", "Policy Hierarchy", "Data Ownership", "Data Classification", "Retention and Privacy Concepts", "Access Governance", "Security Exceptions and Risk Acceptance", "Lab: Define Steward Security and Data Accountability"]);
export const changeServiceGovernance = path("change-service-governance", "Change and Service Governance", ["Change Risk", "Change Controls", "Release Governance", "Service Ownership", "Incident, Problem and Change", "Operational Readiness", "Emergency Change", "Evidence-based Release Approval", "Lab: Govern a Steward Production Change"]);
export const thirdPartyLifecycleRisk: LearningPath = { id: "third-party-lifecycle-risk", title: "Third-party and Technology Lifecycle Risk", lessons: ["Vendor Assessment", "Dependency Risk", "SaaS and Cloud Risk", "End-of-life Technology", "Exit and Continuity Planning", "Internal Software Product Ownership", "Approved Dependency Sources", "Internal Package Version and Support Policy", "Repository Retention and Lifecycle", "Dependency Exceptions", "Supply-chain Ownership and Provenance Requirements", "Lab: Govern steward-common and tsa-test-core"].map((title) => lesson("third-party-lifecycle-risk", title)) };
export const technicalDebtHealth = path("technical-debt-health", "Technical Debt and Engineering Health", ["Identifying Technical Debt", "Measuring and Communicating Debt", "Prioritization", "Engineering Health Metrics", "KPI vs KRI", "Sustainable Remediation", "Debt Ownership and Review Cadence", "Balancing Feature Delivery and Engineering Health", "Lab: Build the Steward Engineering Health Review"]);
export const handbookAndStandards = path("handbook-and-standards", "Engineering Handbook and Standards", ["Writing Usable Standards", "Runbooks and Playbooks", "Decision Records", "Review Checklists", "Knowledge Stewardship", "Standards Ownership and Versioning", "Exception and Waiver Records", "Keeping the Handbook Alive", "Lab: Build the Steward Engineering Handbook"]);
export const technicalStewardshipReview: LearningPath = { id: "technical-stewardship-review", title: "Technical Steward Milestone", lessons: [lesson("technical-stewardship-review", "Milestone: Technical Stewardship Review", "Conduct and defend a full stewardship review of the mature Steward service. Produce a technology risk register, control set and evidence, architecture/security/change governance decisions, service ownership model, third-party and internal dependency policy, lifecycle decisions for steward-common/tsa-test-core/Nexus/cloud dependencies, engineering health view, handbook/standards package, exception handling model and prioritized improvement roadmap. Demonstrate that governance supports accountable engineering decisions rather than replacing engineering judgment with bureaucracy.")] };

export const technicalStewardPaths: LearningPath[] = [technicalLeadership, engineeringGovernance, technologyGovernance, technologyRisk, controlsComplianceAssurance, architectureGovernance, securityDataGovernance, changeServiceGovernance, thirdPartyLifecycleRisk, technicalDebtHealth, handbookAndStandards, technicalStewardshipReview];
