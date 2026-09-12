import type { Lesson } from "./lesson";
import { infrastructureAsCodeDeepLessons } from "./cloud-infrastructure-as-code-deep";

const practiceTitles: Record<string, string> = {
    "Why Infrastructure as Code": "Console-to-Code Audit: Remove Hidden Infrastructure Knowledge",
    "Declarative Infrastructure": "Desired-State Rewrite: Model Steward Without Command History",
    "Terraform and OpenTofu Fundamentals": "OpenTofu Workflow Drill: Prove What Each Stage Guarantees",
    "Providers and Resources": "Provider Trust Review: Pin and Scope Steward Infrastructure Control",
    "State": "State Recovery Exercise: Protect the IaC Control Record",
    "Variables and Outputs": "Interface Design Review: Keep Only Meaningful IaC Inputs and Outputs",
    "Dependencies": "Dependency Graph Investigation: Let Data Flow Express Ordering",
    "Modules Concepts": "Abstraction Gate: Extract Only a Boundary That Earns Reuse",
    "Plan and Apply Lifecycle": "Change-Control Gate: Approve the Exact Steward Infrastructure Diff",
    "Drift": "Drift Investigation: Reconcile Console Reality with Declared Intent",
    "Remote State": "Shared-State Design: Protect Collaboration and Recovery",
    "Secrets and Sensitive Values": "Credential Path Review: Keep Provider Secrets Out of Source",
    "Destroy and Resource Lifecycle": "Lifecycle Classification: Prove What Steward May Safely Recreate",
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
                    objective: `${practiceTitle}. Use OpenTofu as the implementation tool while keeping Terraform concepts transferable.`,
                    scenario: "Steward already has a reasoned remote architecture, a Kong public edge, Rocky Linux hosts, private backend boundaries, Jenkins/Nexus delivery and Ansible-managed host state. Infrastructure as Code must encode that approved infrastructure without swallowing application deployment, host configuration or secret-management responsibilities that belong elsewhere.",
                    deliverables: [
                        ...activity.content.deliverables,
                        "Boundary note stating what OpenTofu owns and what remains owned by Ansible, Jenkins, Kong or the application",
                    ],
                    completionCriteria: [
                        ...activity.content.completionCriteria,
                        "The learner can explain the exact plan consequence before apply and can name at least one plausible destructive or drift failure path.",
                        "OpenTofu is the implemented workflow; Terraform is understood as a compatible conceptual alternative rather than a second mandatory stack.",
                    ],
                },
            };
        }),
    };
}

export const infrastructureAsCodeQualityLessons: Lesson[] = infrastructureAsCodeDeepLessons.map(enrichLesson);
