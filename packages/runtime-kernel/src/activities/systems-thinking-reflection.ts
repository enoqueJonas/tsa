import type { Activity } from "./activity";

export const systemsThinkingReflection: Activity = {
    id: "engineering-foundations-004",
    title: "Systems Thinking Reflection",
    estimatedMinutes: 10,
    content: {
        type: "reflection",
        prompt: "Think about a system you have worked on. Which dependency, constraint, or feedback loop had the biggest effect on the outcome?",
    },
};
