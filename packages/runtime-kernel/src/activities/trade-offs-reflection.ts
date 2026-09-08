import type { Activity } from "./activity";

export const tradeOffsReflection: Activity = {
    id: "engineering-foundations-006",
    title: "Trade-offs Reflection",
    estimatedMinutes: 10,
    content: {
        type: "reflection",
        prompt: "Think about a technical decision you have made or observed. What did the team optimize for, what did it give up, and would you make the same trade-off again?",
    },
};
