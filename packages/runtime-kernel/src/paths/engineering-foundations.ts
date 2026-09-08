import { thinkingLikeAnEngineer } from "./thinking-like-an-engineer";
import { systemsThinking } from "./systems-thinking";
import type { LearningPath } from "./learning-path";

export const engineeringFoundations: LearningPath = {
    id: "engineering-foundations",
    title: "Engineering Foundations",
    lessons: [
        thinkingLikeAnEngineer,
        systemsThinking,
    ],
};
