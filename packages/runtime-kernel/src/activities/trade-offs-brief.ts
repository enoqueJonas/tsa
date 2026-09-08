import type { Activity } from "./activity";

export const tradeOffsBrief: Activity = {
    id: "engineering-foundations-005",
    title: "Trade-offs Brief",
    estimatedMinutes: 7,
    content: {
        type: "reading",
        body: "Engineering decisions rarely maximize every desirable quality at once. Good engineers make trade-offs explicit: they identify what improves, what gets worse, which constraints matter most, and why the chosen compromise is appropriate for the current context.",
    },
};
