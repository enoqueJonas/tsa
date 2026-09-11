import type { Lesson } from "./lesson";
import { cloudBuildingBlocksDeepLessons } from "./cloud-building-blocks-deep";

const practiceTitles: Record<string, string> = {
    "Compute": "Capacity Decision: Keep, Resize, or Change Compute",
    "Object Storage": "Storage Fit Investigation: Move the Right Steward Objects",
    "Block Storage": "State Lifetime Investigation: Survive Compute Replacement",
    "Managed Databases": "PostgreSQL Ownership Review: Self-Managed vs Managed",
    "Virtual Networks and Subnets": "Trust-Boundary Design: Place Steward by Reachability",
    "Routing and Gateways": "Packet-Path Investigation: Trace Steward Ingress and Egress",
    "Load Balancers": "Availability Gate: Prove Whether Steward Needs Distribution",
    "IAM": "Least-Privilege Design: Separate Human, CI, and Runtime Identity",
    "Secrets Management": "Secret-Lifecycle Design: Identity to Runtime Without Leakage",
    "Cloud Monitoring": "Infrastructure Signal Review: Observe What the Provider Owns",
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
                    objective: `${practiceTitle}. Produce evidence that the chosen boundary is justified for Steward rather than adopting a cloud service because it exists.`,
                    scenario: "Steward already has a working Rocky Linux VPS, Kong public edge, private backend responsibilities and an established delivery chain. Treat that baseline as something to improve only when this cloud building block solves a concrete capacity, recovery, security, operability or cost problem.",
                    deliverables: [
                        ...activity.content.deliverables,
                        "Rejected alternative with the reason it is weaker for the current Steward constraint",
                    ],
                    completionCriteria: [
                        ...activity.content.completionCriteria,
                        "The decision preserves the established Kong edge, private backend boundary and build-once/promote-many delivery model unless evidence explicitly justifies changing one of them.",
                    ],
                },
            };
        }),
    };
}

export const cloudBuildingBlocksQualityLessons: Lesson[] = cloudBuildingBlocksDeepLessons.map(enrichLesson);
