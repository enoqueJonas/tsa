import type { Lesson } from "./lesson";

export const debuggingMindset: Lesson = {
    id: "debugging-mindset",
    title: "Debugging Mindset",
    activities: [
        {
            id: "debugging-mindset-001",
            title: "Learning Outcomes",
            estimatedMinutes: 5,
            content: { type: "reading", body: `By the end of this lesson you should be able to turn a vague problem report into observable expected-versus-actual behavior, form competing hypotheses, design tests that can falsify them, reduce a problem systematically, preserve useful evidence, and distinguish mitigation from root-cause correction.` },
        },
        {
            id: "debugging-mindset-002",
            title: "Debugging Is an Investigation",
            estimatedMinutes: 20,
            content: {
                type: "reading",
                body: `Weak debugging often looks like random action: restart a service, change a timeout, add a log, reinstall a dependency, try a different browser, then keep whatever appeared to work. The system may recover, but understanding did not improve.

A stronger debugging loop is closer to an experiment:

**Problem report → observations → hypotheses → discriminating test → new evidence → narrower hypothesis → correction → verification**

Start with expected behavior, actual behavior, scope and reproducibility. Ask what changed, but do not assume the most recent change is automatically causal. Preserve logs and other evidence before destructive actions erase them.

Generate plausible hypotheses from your system model. Prefer tests that distinguish between alternatives. If both “the database is unavailable” and “the credentials are wrong” could explain a connection failure, a useful test should help eliminate one of them.

Reduce the search space. Reproduce the smallest failing input, isolate components, compare a working path with a failing path, bisect changes, inspect boundaries, and follow data through the system. Negative results are progress when they remove plausible causes.

During a serious incident, mitigation and diagnosis can have different priorities. Restoring service or preventing data loss may come first; root-cause work can continue once impact is controlled. Do not confuse “the restart fixed it” with “we understand why it failed.”

The goal of debugging is not merely to make the symptom disappear. It is to produce a defensible explanation and evidence that the correction addresses the relevant cause.`,
                resources: [
                    { title: "Google SRE — Effective Troubleshooting", url: "https://sre.google/sre-book/effective-troubleshooting/" },
                    { title: "MIT Missing Semester — Debugging and Profiling", url: "https://missing.csail.mit.edu/2020/debugging-profiling/" },
                ],
            },
        },
        {
            id: "debugging-mindset-003",
            title: "Worked Example: The 500 Error",
            estimatedMinutes: 12,
            content: { type: "reading", body: `A POST request starts returning HTTP 500 after a deployment.

A random approach might immediately roll back, restart containers or change application code. An investigation first sharpens the report: which endpoint, which inputs, all users or some, every request or intermittent, and what changed?

Suppose the application log shows a database constraint failure only when one optional field is omitted. A request with the field succeeds. Now competing hypotheses might include: the new code stopped populating a required database value; the database migration changed nullability; or older data/configuration causes a branch to omit the field.

A discriminating next step is to inspect the deployed schema and the code path that builds the insert. If the schema confirms the column is NOT NULL and the code produces null for that path, you now have a causal chain supported by evidence.

Rolling back may still be the fastest mitigation. But the investigation also produces the durable fix, regression test and explanation. This distinction between **restoring service** and **learning the cause** becomes important later in Reliability Engineer.` },
        },
        {
            id: "debugging-mindset-004",
            title: "Investigation Lab",
            estimatedMinutes: 55,
            content: {
                type: "practical",
                objective: "Investigate a reproducible technical failure using explicit hypotheses and evidence rather than trial-and-error fixes.",
                scenario: "Use a real safe-to-investigate defect or deliberately create a small failure in a local project: wrong environment variable, broken database connection, incorrect path, failing dependency version, invalid input edge case or similar.",
                instructions: [
                    "Write expected behavior, actual behavior, impact and a reproducible test case before changing the system.",
                    "Capture the initial evidence available: error output, logs, inputs, configuration or recent changes.",
                    "Draw or describe the shortest relevant execution path through the system.",
                    "List at least three plausible hypotheses and rank them by likelihood or ease of testing.",
                    "For each hypothesis, define what observation would support it and what observation would weaken it.",
                    "Run one test at a time and maintain an evidence log including negative results.",
                    "When you identify the cause, explain the causal chain rather than naming only the broken component.",
                    "Implement or describe the correction, then rerun the original reproduction and at least one nearby regression case.",
                    "Record one improvement that would make this failure easier to detect or diagnose next time.",
                ],
                deliverables: ["Problem report", "Hypothesis table", "Evidence log", "Root-cause explanation", "Fix/verification evidence", "Diagnostic improvement recommendation"],
                completionCriteria: ["The investigation begins before the fix is attempted.", "At least one hypothesis is explicitly falsified or weakened.", "The final explanation connects evidence to cause.", "Verification includes the original failing case.", "The report distinguishes mitigation, cause and prevention."],
            },
        },
        {
            id: "debugging-mindset-005",
            title: "Knowledge Check and Reflection",
            estimatedMinutes: 15,
            content: { type: "reflection", prompt: `1. Why is “I restarted it and it worked” not yet a root-cause explanation?
2. What makes a debugging test discriminating?
3. Why are negative experimental results useful?
4. When might mitigation appropriately happen before root-cause analysis?
5. Describe a debugging session where you changed several things at once. How did that reduce what you could learn from the outcome?` },
        },
    ],
};
