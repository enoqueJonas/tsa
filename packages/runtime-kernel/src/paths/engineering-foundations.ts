import { thinkingLikeAnEngineer } from "./thinking-like-an-engineer";
import { systemsThinking } from "./systems-thinking";
import { tradeOffs } from "./trade-offs";
import { debuggingMindset } from "./debugging-mindset";
import { plannedLesson } from "./planned-path";
import type { LearningPath } from "./learning-path";

export const engineeringFoundations: LearningPath = {
    id: "engineering-foundations",
    title: "Engineering Foundations",
    lessons: [
        thinkingLikeAnEngineer,
        systemsThinking,
        tradeOffs,
        debuggingMindset,
        plannedLesson("engineering-foundations", "Engineering Decisions"),
        plannedLesson("engineering-foundations", "Evidence and Technical Reasoning"),
        plannedLesson("engineering-foundations", "Learning as an Engineering Skill"),
        plannedLesson("engineering-foundations", "Communicating Technical Work"),
        plannedLesson("engineering-foundations", "Milestone: Engineering Investigation"),
    ],
};
