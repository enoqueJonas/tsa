import { thinkingLikeAnEngineer } from "./thinking-like-an-engineer";
import { systemsThinking } from "./systems-thinking";
import { tradeOffs } from "./trade-offs";
import { debuggingMindset } from "./debugging-mindset";
import type { LearningPath } from "./learning-path";

export const engineeringFoundations: LearningPath = {
    id: "engineering-foundations",
    title: "Engineering Foundations",
    lessons: [
        thinkingLikeAnEngineer,
        systemsThinking,
        tradeOffs,
        debuggingMindset,
    ],
};
