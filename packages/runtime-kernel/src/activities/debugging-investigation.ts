import type { Activity } from "./activity";

export const debuggingInvestigation: Activity = {
    id: "debugging-mindset-002",
    title: "Investigation Exercise",
    estimatedMinutes: 20,
    content: {
        type: "practical",
        objective: "Practice systematic debugging by moving from symptoms to testable hypotheses and evidence.",
        scenario: "A web application login works for most users, but some users receive a generic 500 error immediately after submitting valid credentials. The issue is intermittent, no recent code change obviously explains it, and restarting the application does not remove it.",
        instructions: [
            "Write down the expected behavior and the observable failure without proposing a fix yet.",
            "List at least three plausible causes across different layers of the system.",
            "For each hypothesis, identify one piece of evidence that would make it more likely or less likely.",
            "Choose the first logs, metrics, traces, debugger state, or reproduction step you would inspect and explain why.",
            "Order your hypotheses from most to least likely after considering the evidence you would collect.",
            "State the next experiment you would run before making a production change.",
        ],
        deliverables: [
            "A concise problem statement separating symptoms from assumptions.",
            "At least three hypotheses.",
            "An evidence or test plan for each hypothesis.",
            "A prioritized next investigation step.",
        ],
        completionCriteria: [
            "The problem statement describes observed behavior rather than an assumed cause.",
            "The hypotheses cover more than one possible component or layer.",
            "Each hypothesis has a concrete way to gather evidence.",
            "The proposed next step tests a hypothesis before changing the system.",
        ],
        resources: [
            {
                title: "Google SRE — Effective Troubleshooting",
                url: "https://sre.google/sre-book/effective-troubleshooting/",
            },
            {
                title: "MIT Missing Semester — Debugging and Profiling",
                url: "https://missing.csail.mit.edu/2026/debugging-profiling/",
            },
        ],
    },
};
