import type { Activity } from "../activities";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";
import { capstoneProblemDiscoveryDeepLessons } from "./professional-engineer-capstone-problem-discovery-deep";
import { capstoneEngineeringProposalDeepLessons } from "./professional-engineer-capstone-engineering-proposal-deep";
import { capstoneIndependentBuildDeepLessons } from "./professional-engineer-independent-build-deep";

function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function lesson(pathId: string, title: string, focus?: string): Lesson {
    const lessonId = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = { id: `${lessonId}-001`, title, estimatedMinutes: title.startsWith("Milestone:") ? 600 : practical ? 120 : 15, content: practical ? { type: "practical", objective: focus ?? `Independently apply ${title.replace(/^(Lab|Milestone): /, "")} to the capstone system.`, scenario: "Start from a blank repository and a new problem domain. The capstone is not Steward v2 and must not be a clone. Reuse internal engineering products only where their contracts are genuinely applicable, while making independent choices for domain model, architecture, infrastructure, quality, security, reliability and governance.", instructions: ["Define the problem, stakeholders, constraints and success evidence before choosing implementation details.", "Make and record engineering decisions across software, data, infrastructure, delivery, quality, security, reliability and governance.", "Use existing TSA internal platform capabilities only when justified; do not copy Steward domain code or architecture by default.", "Produce executable evidence for important claims such as quality, security, reliability, recovery and operational readiness.", "Identify trade-offs, rejected alternatives, limitations and residual risks explicitly.", "Keep the system reviewable and reproducible by another engineer."], deliverables: ["Independent capstone artifact", "Decision and evidence portfolio", "Risk, limitations and future-evolution record"], completionCriteria: ["The system demonstrates independent synthesis rather than reproduction of the Steward solution.", "Important engineering claims are backed by working evidence.", "The learner can explain why each major design, tool and control is appropriate to this specific system."] } : { type: "reading", body: focus ?? `This breadth lesson establishes ${title} as part of the Professional Engineer capstone. Deep authoring will add TSA guidance, review rubrics, examples, resources and defence prompts.` } };
    return { id: lessonId, title, activities: [activity] };
}
function path(id: string, title: string, titles: string[]): LearningPath { return { id, title, lessons: titles.map((title) => lesson(id, title)) }; }

export const capstoneProblemDiscovery: LearningPath = { id: "capstone-problem-discovery", title: "Capstone Problem Discovery", lessons: capstoneProblemDiscoveryDeepLessons };
export const capstoneEngineeringProposal: LearningPath = { id: "capstone-engineering-proposal", title: "Capstone Engineering Proposal", lessons: capstoneEngineeringProposalDeepLessons };
export const capstoneIndependentBuild: LearningPath = { id: "capstone-independent-build", title: "Independent Build", lessons: capstoneIndependentBuildDeepLessons };

export const capstoneProductionReadiness = path("capstone-production-readiness", "Production Readiness", ["Deployment Readiness", "Observability", "Security Assessment", "Performance Evidence", "Reliability and Failure Testing", "Backup and Recovery", "Runbooks", "Operational Ownership", "Risk and Control Evidence", "Dependency and Supply-chain Readiness", "Cost and Capacity Review", "Release Decision", "Lab: Run the Capstone Production Readiness Review"]);

export const capstoneDefence: LearningPath = {
    id: "capstone-defence", title: "Engineering Defence",
    lessons: ["Present the Problem and Outcomes", "Present the Architecture", "Explain Trade-offs", "Present Engineering Evidence", "Defend Quality Decisions", "Defend Security Decisions", "Defend Reliability Decisions", "Defend Governance Decisions", "Respond to Challenges", "State Limitations", "Propose Future Evolution", "Reflect on the TSA Journey"].map((title) => lesson("capstone-defence", title)).concat([lesson("capstone-defence", "Milestone: Professional Engineering Capstone and Defence", "Deliver and defend a second substantial production-style system created from a blank repository. Demonstrate independent problem framing, domain and architecture decisions, software and data engineering, infrastructure, automated delivery, quality engineering, security, observability and reliability, operations, cost awareness, governance, risk management and a credible evolution roadmap. The defence must use concrete artifacts and executable evidence, distinguish verified behavior from assumptions, and explain where TSA internal products such as tsa-test-core, Nexus or other shared capabilities were reused, rejected or evolved. The final result must prove transferable engineering judgment rather than memorization of the Steward implementation.")]),
};

export const professionalEngineerPaths: LearningPath[] = [capstoneProblemDiscovery, capstoneEngineeringProposal, capstoneIndependentBuild, capstoneProductionReadiness, capstoneDefence];
