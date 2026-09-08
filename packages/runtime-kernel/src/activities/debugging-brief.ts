import type { Activity } from "./activity";

export const debuggingBrief: Activity = {
    id: "debugging-mindset-001",
    title: "Debugging as Investigation",
    estimatedMinutes: 10,
    content: {
        type: "reading",
        body: "Effective debugging is an investigation process: observe the failure, understand expected behavior, form hypotheses about possible causes, gather evidence, and test those hypotheses before changing the system. The goal is not to guess a fix quickly, but to reduce uncertainty until the cause is understood.",
    },
};
