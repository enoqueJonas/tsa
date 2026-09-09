import type { Lesson } from "./lesson";

export const tradeOffs: Lesson = {
    id: "trade-offs",
    title: "Trade-offs",
    activities: [
        {
            id: "trade-offs-001",
            title: "Learning Outcomes",
            estimatedMinutes: 5,
            content: { type: "reading", body: `By the end of this lesson you should be able to explain why engineering choices are usually context-dependent, identify the dimensions being traded, compare alternatives without pretending every dimension has equal importance, and state what evidence or changed conditions would justify revisiting a decision.` },
        },
        {
            id: "trade-offs-002",
            title: "There Is Usually No Free Improvement",
            estimatedMinutes: 18,
            content: {
                type: "reading",
                body: `Many weak technical discussions are disguised preference contests: “X is faster,” “Y is cleaner,” “Z is more scalable.” Engineering requires the next questions: **faster at what workload, cleaner for which team, scalable to what demand, and at what cost elsewhere?**

A trade-off exists when improving one characteristic consumes resources, introduces complexity or weakens another characteristic. Common dimensions include delivery speed, correctness, latency, throughput, availability, security, cost, maintainability, operability, portability, developer experience and organizational cognitive load.

Trade-offs are not always symmetric. A financial system may accept slower delivery to protect correctness and auditability. A prototype may accept duplication to learn quickly. A small internal service may prefer a single database and simple deployment even if a more distributed design could theoretically scale further.

A useful process is:

1. identify the decision and the important constraints;
2. identify the characteristics that actually matter in this context;
3. define viable alternatives, including doing less;
4. compare likely benefits, costs, risks and uncertainty;
5. choose the option with the strongest overall fit;
6. state what future condition would change the balance.

A decision can be correct now and wrong later. That is not necessarily failure. Good engineering records enough context to understand when the original trade-off no longer holds.`,
                resources: [
                    { title: "Software Engineering at Google — What Is Software Engineering?", url: "https://abseil.io/resources/swe-book/html/ch01.html" },
                    { title: "Google SRE — Embracing Risk", url: "https://sre.google/sre-book/embracing-risk/" },
                ],
            },
        },
        {
            id: "trade-offs-003",
            title: "Worked Example: Build or Buy",
            estimatedMinutes: 12,
            content: { type: "reading", body: `Suppose TSA needs an identity provider for an internal application.

**Build it ourselves** may provide complete control and deep learning, but creates security responsibility, maintenance work and long-term operational ownership.

**Use a managed provider** may reduce implementation and security burden, but adds recurring cost, vendor dependency, integration constraints and exit risk.

**Use a mature self-hosted product** may reduce custom code while preserving more control, but still requires patching, backups and operations.

The useful question is not “Which option is best?” It is “Which option best serves the current goals and constraints?” For a learning environment, building selected authentication pieces may be valuable because learning is itself an objective. For a production company with limited security expertise, rebuilding commodity identity may be irresponsible.

Notice that **the same technology choice can be sensible in one context and weak in another**. That is the essence of trade-off reasoning.` },
        },
        {
            id: "trade-offs-004",
            title: "Practice: Build a Decision Matrix Without Hiding Judgment",
            estimatedMinutes: 35,
            content: {
                type: "practical",
                objective: "Compare technical alternatives using explicit decision criteria and qualitative evidence.",
                scenario: "Choose a real decision or compare: deploy Steward on a budget VPS, a managed PaaS, or a larger cloud platform.",
                instructions: [
                    "State the decision and the current context.",
                    "Choose five to eight criteria that actually matter; do not add criteria just to make the table look complete.",
                    "Explain why each criterion matters and which are non-negotiable constraints.",
                    "Compare at least three alternatives using evidence, estimates or clearly labeled assumptions.",
                    "Identify one risk or hidden cost for each option.",
                    "Make a recommendation without relying only on a numeric total; explain the judgment behind it.",
                    "Define at least two future conditions that would trigger reconsideration.",
                ],
                deliverables: ["Decision context", "Trade-off matrix", "Recommendation", "Revisit conditions"],
                completionCriteria: ["Criteria are tied to the real context.", "Assumptions are not presented as measurements.", "The recommendation explains why some criteria matter more than others.", "Future revisit conditions are concrete enough to observe."],
            },
        },
        {
            id: "trade-offs-005",
            title: "Knowledge Check and Reflection",
            estimatedMinutes: 12,
            content: { type: "reflection", prompt: `1. Why can “best practice” be misleading without context?
2. Give an example of a decision that improves one quality attribute while weakening another.
3. Why is the highest-scoring option in a decision matrix not automatically the correct choice?
4. What is the value of recording a condition that should trigger reconsideration?
5. Describe one technical preference you hold strongly. What evidence or constraints could make the opposite choice reasonable?` },
        },
    ],
};
