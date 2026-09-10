import type { LearningPath } from "./learning-path";
import { architectureGovernanceDeepLessons } from "./technical-steward-architecture-governance-deep";
import { changeServiceGovernanceDeepLessons } from "./technical-steward-change-service-governance-deep";
import { controlsComplianceAssuranceDeepLessons } from "./technical-steward-controls-compliance-assurance-deep";
import { engineeringGovernanceDeepLessons } from "./technical-steward-engineering-governance-deep";
import { handbookAndStandardsDeepLessons } from "./technical-steward-handbook-standards-deep";
import { technicalStewardMilestoneDeepLessons } from "./technical-steward-milestone-deep";
import { securityDataGovernanceDeepLessons } from "./technical-steward-security-data-governance-deep";
import { technicalDebtHealthDeepLessons } from "./technical-steward-technical-debt-health-deep";
import { technicalLeadershipDeepLessons } from "./technical-steward-technical-leadership-deep";
import { thirdPartyLifecycleRiskDeepLessons } from "./technical-steward-third-party-lifecycle-risk-deep";
import { technologyGovernanceDeepLessons } from "./technical-steward-technology-governance-deep";
import { technologyRiskDeepLessons } from "./technical-steward-technology-risk-deep";

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
export const technicalStewardshipReview: LearningPath = { id: "technical-stewardship-review", title: "Technical Steward Milestone", lessons: technicalStewardMilestoneDeepLessons };

export const technicalStewardPaths: LearningPath[] = [technicalLeadership, engineeringGovernance, technologyGovernance, technologyRisk, controlsComplianceAssurance, architectureGovernance, securityDataGovernance, changeServiceGovernance, thirdPartyLifecycleRisk, technicalDebtHealth, handbookAndStandards, technicalStewardshipReview];
