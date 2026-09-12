import type { Lesson } from "./lesson";
import { cloudArchitectureAndCostDeepLessons } from "./cloud-architecture-cost-deep";

const practiceTitles: Record<string, string> = {
    "Availability in Cloud Environments": "Availability Review: Remove the Highest-Impact Single Failure",
    "Scalability and Capacity": "Capacity Investigation: Scale the Bottleneck, Not the Diagram",
    "Security Boundaries": "Trust-Path Review: Separate Public, Operator, Runtime and Control Plane",
    "Backup and Recovery": "Recovery Design: Prove Steward Can Be Reconstructed",
    "Failure Domains": "Correlated-Failure Audit: Test Whether Redundancy Is Real",
    "Cost Estimation": "Cost Model: Make Steward Spend Explainable",
    "Cost Controls and Budgets": "Spend Guardrail Design: Assign Ownership and Teardown Rules",
    "Resource Right-sizing": "Right-Sizing Experiment: Change Capacity with Evidence",
    "Managed vs Self-managed Trade-offs": "Operating-Model Decision: Pay for Service or Own the Toil",
    "Homelab, VPS and Cloud Hybrid Trade-offs": "Hybrid Dependency Audit: Keep Production Independent of Accidental Home Coupling",
};

function enrichLesson(lesson: Lesson): Lesson {
    const practiceTitle = practiceTitles[lesson.title];
    if (!practiceTitle) return lesson;
    return {
        ...lesson,
        activities: lesson.activities.map((activity) => {
            if (activity.content.type !== "practical" || !activity.title.startsWith("Apply:")) return activity;
            return {
                ...activity,
                title: practiceTitle,
                estimatedMinutes: 60,
                content: {
                    ...activity.content,
                    objective: `${practiceTitle}. Make a proportionate Steward architecture decision supported by failure, capacity, recovery and cost evidence.`,
                    scenario: "Steward now has a reproducible OpenTofu-defined remote environment, Kong ingress, private backend services and an established delivery platform. Review that real system rather than designing an imaginary hyperscale replacement. Add complexity only when a measurable requirement or failure consequence earns it.",
                    deliverables: [
                        ...activity.content.deliverables,
                        "Accepted risk or rejected architecture alternative with explicit revisit trigger",
                    ],
                    completionCriteria: [
                        ...activity.content.completionCriteria,
                        "The learner can identify which failure domain, cost driver or operational responsibility the chosen change improves and which risks remain accepted.",
                    ],
                },
            };
        }),
    };
}

export const cloudArchitectureAndCostQualityLessons: Lesson[] = cloudArchitectureAndCostDeepLessons.map(enrichLesson);
