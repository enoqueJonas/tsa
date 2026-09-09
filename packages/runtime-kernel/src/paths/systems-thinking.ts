import type { Lesson } from "./lesson";

export const systemsThinking: Lesson = {
    id: "systems-thinking",
    title: "Systems Thinking",
    activities: [
        {
            id: "systems-thinking-001",
            title: "Learning Outcomes",
            estimatedMinutes: 5,
            content: { type: "reading", body: `By the end of this lesson you should be able to identify system boundaries, components, relationships, feedback and external influences; distinguish a local symptom from a system-level cause; trace how a change can create second-order effects; and draw a simple system map that supports investigation rather than decoration.` },
        },
        {
            id: "systems-thinking-002",
            title: "From Parts to Relationships",
            estimatedMinutes: 18,
            content: {
                type: "reading",
                body: `A system is not merely a list of components. Its behavior emerges from **components plus relationships plus environment plus change over time**.

Consider an API that appears slow. Looking only at the application process may miss database locks, DNS delays, exhausted connection pools, a downstream service, a client retry storm, resource contention on the host, or a deployment that changed traffic shape. Each individual component can look reasonable while their interaction produces failure.

Systems thinking asks several recurring questions:

- What is inside the boundary of the system we are reasoning about?
- What sits outside it but influences it?
- Which components exchange data, control, resources or assumptions?
- Where are queues, bottlenecks and shared resources?
- What feedback loops exist? For example, failures can trigger retries, retries increase load, and increased load creates more failures.
- What changes over time: traffic, state, configuration, versions, people, dependencies?
- What local optimization could damage the whole system?

A map is useful only when it helps answer a question. TSA therefore treats diagrams as reasoning tools, not documentation trophies. Start simple, show only relationships relevant to the problem, and revise the map as your understanding changes.`,
                resources: [
                    { title: "NASA Systems Engineering Handbook — Fundamentals", url: "https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/" },
                ],
            },
        },
        {
            id: "systems-thinking-003",
            title: "Worked Example: A Retry Loop Becomes an Outage",
            estimatedMinutes: 12,
            content: { type: "reading", body: `Imagine Steward API depends on a database. A transient database slowdown causes some requests to time out. The application retries immediately. More retries increase database load. Increased load raises latency further, producing more timeouts and still more retries.

If you inspect only the original database slowdown, you may conclude that the database is the whole problem. A systems view reveals a **reinforcing feedback loop**:

Database latency ↑ → request timeouts ↑ → retries ↑ → database work ↑ → database latency ↑

Possible interventions exist at different points: fix the database bottleneck, add bounded retries with backoff, reduce concurrency, fail fast, protect expensive operations, or degrade functionality. The right intervention depends on evidence and context.

The lesson is not “retries are bad.” It is that behavior that is sensible locally can become harmful through interaction. Later Reliability Engineer lessons will formalize this with backoff, jitter, circuit breakers, saturation and cascading failure. Here you are learning to look for the relationships first.` },
        },
        {
            id: "systems-thinking-004",
            title: "Practice: Map a Failure as a System",
            estimatedMinutes: 40,
            content: {
                type: "practical",
                objective: "Build and use a small system map to reason about a technical failure or performance problem.",
                scenario: "Choose a real issue from your work or use this scenario: users report intermittent failures when an API endpoint writes data and then sends a notification through an external provider.",
                instructions: [
                    "Define the question your map is meant to help answer.",
                    "Draw the relevant system boundary and the actors/external systems outside it.",
                    "Add the minimum components needed to explain the request path.",
                    "Label important relationships with what moves across them: request, data, credential, event, resource or control signal.",
                    "Mark stateful components, queues/shared resources and places where work can wait.",
                    "Identify at least three plausible failure propagation paths.",
                    "Identify one reinforcing or balancing feedback loop if one exists; if none is credible, say so.",
                    "Choose the next observation or experiment that would reduce uncertainty most efficiently.",
                ],
                deliverables: ["System map", "Failure-propagation notes", "Next-evidence recommendation"],
                completionCriteria: ["The map has an explicit investigative purpose.", "Relationships are as important as components.", "At least one failure path crosses more than one component.", "The proposed next evidence is connected to a hypothesis revealed by the map."],
            },
        },
        {
            id: "systems-thinking-005",
            title: "Knowledge Check and Reflection",
            estimatedMinutes: 12,
            content: { type: "reflection", prompt: `Answer in your own words:

1. Why is a component inventory not yet a system model?
2. Give an example of a locally sensible action that could damage the wider system.
3. What does a system boundary help you reason about?
4. Why should a diagram be revised during an investigation?
5. Think of a recent defect you investigated. What relationship or external influence did you initially overlook?` },
        },
    ],
};
