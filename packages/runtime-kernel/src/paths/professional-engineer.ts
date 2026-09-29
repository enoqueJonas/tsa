import type { LearningPath } from "./learning-path";
import { capstoneProblemDiscoveryDeepLessons } from "./professional-engineer-capstone-problem-discovery-deep";
import { capstoneEngineeringProposalDeepLessons } from "./professional-engineer-capstone-engineering-proposal-deep";
import { capstoneIndependentBuildDeepLessons } from "./professional-engineer-independent-build-deep";
import { capstoneProductionReadinessDeepLessons } from "./professional-engineer-production-readiness-deep";
import { capstoneDefenceDeepLessons } from "./professional-engineer-defence-deep";
import { professionalPracticeDeepLessons } from "./professional-engineer-professional-practice-deep";
import { professionalPortfolioReflectionDeepLessons } from "./professional-engineer-portfolio-reflection-deep";

export const professionalPractice: LearningPath = { id: "professional-practice", title: "Professional Practice and Ethics", lessons: professionalPracticeDeepLessons };
export const capstoneProblemDiscovery: LearningPath = { id: "capstone-problem-discovery", title: "Capstone Problem Discovery", lessons: capstoneProblemDiscoveryDeepLessons };
export const capstoneEngineeringProposal: LearningPath = { id: "capstone-engineering-proposal", title: "Capstone Engineering Proposal", lessons: capstoneEngineeringProposalDeepLessons };
export const capstoneIndependentBuild: LearningPath = { id: "capstone-independent-build", title: "Independent Build", lessons: capstoneIndependentBuildDeepLessons };
export const capstoneProductionReadiness: LearningPath = { id: "capstone-production-readiness", title: "Production Readiness", lessons: capstoneProductionReadinessDeepLessons };
export const professionalPortfolioReflection: LearningPath = { id: "professional-portfolio-reflection", title: "Engineering Portfolio and Reflective Practice", lessons: professionalPortfolioReflectionDeepLessons };
export const capstoneDefence: LearningPath = { id: "capstone-defence", title: "Engineering Defence", lessons: capstoneDefenceDeepLessons };

export const professionalEngineerPaths: LearningPath[] = [professionalPractice, capstoneProblemDiscovery, capstoneEngineeringProposal, capstoneIndependentBuild, capstoneProductionReadiness, professionalPortfolioReflection, capstoneDefence];
