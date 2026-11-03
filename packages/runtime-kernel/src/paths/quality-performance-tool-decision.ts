import type { Lesson } from "./lesson";

export const performanceToolDecisionLesson: Lesson = {
    id: "non-functional-quality-performance-tool-decision",
    title: "Decision Gate: Select the Steward Performance Tool",
    activities: [
        {
            id: "non-functional-quality-performance-tool-decision-primer",
            title: "Model the workload before choosing a load-testing tool",
            estimatedMinutes: 45,
            content: {
                type: "reading",
                body: "Performance testing asks how a service behaves under a stated arrival or concurrency model. A tool is useful only if its execution reproduces that model with measurable evidence.",
                blocks: [
                    { type: "heading", id: "workload-basics", text: "What is actually being measured?", level: 2 },
                    { type: "paragraph", text: "Latency is the elapsed time for an operation; throughput is completed operations per unit time; error rate needs both a numerator and a denominator; saturation describes resource pressure such as exhausted connections or CPU. A test must name the population, clock window, success rule and environment. Reporting 'p95 300 ms' without request count, error count and load shape is not enough to justify capacity." },
                    { type: "heading", id: "open-versus-closed-workloads", text: "Arrival rate is not the same as concurrent users", level: 2 },
                    { type: "paragraph", text: "In a closed-user model, each virtual user generally waits for its current iteration to finish before starting the next. When response time rises, that user produces fewer requests: achieved arrival rate can fall and conceal overload. In an open-arrival model, new requests are scheduled at a chosen arrival rate independent of the preceding response time, provided the generator has capacity. Neither model is universally correct; choose the one matching the real usage pattern." },
                    { type: "heading", id: "worked-workload", text: "Worked Steward example", level: 2 },
                    { type: "paragraph", text: "Suppose the risk is that service-ownership lookups slow during a planned batch import. A disposable test can model 5 new GET /services/{id} arrivals per second for 60 seconds, seeded with authorized data, then compare completed count, 4xx/5xx status population, p95 latency, connection-pool pressure and the post-batch recovery window. Expected scheduled arrivals are 300, not automatically 300 successful responses; generator shortfall must be reported as an invalid test, not as product success." },
                    { type: "heading", id: "performance-tools-comparison", text: "Choose a tool against the execution contract", level: 2 },
                    { type: "list", items: [
                        "k6: JavaScript scenarios, explicit arrival-rate executors, checks and thresholds, CI-friendly machine output; evaluate whether existing team skill and extension needs justify it.",
                        "Locust: Python-defined task flows and user lifecycle, convenient when a Python team needs expressive stateful behavior; verify whether its selected user model matches the intended arrival pattern.",
                        "JMeter or a small native harness: useful for particular protocols or initial experiments; compare repeatability, headless CI execution, metrics and maintenance rather than counting features."
                    ] },
                    { type: "heading", id: "performance-failure", text: "Failure: a load generator that cannot deliver the load", level: 2 },
                    { type: "paragraph", text: "If the chosen generator schedules 300 arrivals but achieves only 190 because its own CPU or connection pool is exhausted, the run has not demonstrated that Steward handles 5 arrivals per second. Record both planned and achieved arrivals, generator health, test data and failures. A green threshold over the 190 requests is not an acceptance result for the intended workload." },
                    { type: "heading", id: "performance-independent-decision", text: "Practice: justify one implementation", level: 2 },
                    { type: "paragraph", text: "Write a decision record for a local disposable target: workload model, scenario length, setup and cleanup, required metrics, tool selection, why the runner can sustain the load and one controlled negative threshold. Do not run load against shared production or third-party systems without explicit authorization." },
                ],
            },
        },
        {
            id: "non-functional-quality-performance-tool-decision-001",
            title: "Compare Performance Test Tooling",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Select a primary performance-testing implementation for Steward based on the system, CI model and learning goals rather than tool popularity.",
                scenario: "The curriculum has intentionally taught load, stress, spike and endurance concepts before locking Steward into a performance tool. Compare representative options such as Locust and k6 and choose one primary implementation while preserving transferable performance-engineering concepts.",
                instructions: [
                    "Define the Steward workloads that need performance evidence: HTTP/API behavior, concurrency shape, authentication, data setup, thresholds and the metrics required for diagnosis.",
                    "Compare Locust, k6 and at least one reasonable alternative or native approach against Python ecosystem fit, scripting model, local execution, container execution, CI integration, distributed execution, output formats, observability integration and learner complexity.",
                    "Run or design the same small baseline scenario in the two strongest candidates where practical so the decision uses execution evidence rather than feature lists alone.",
                    "Choose the primary TSA performance tool for Steward and record why the rejected option remains a useful comparison rather than a second mandatory implementation.",
                    "Define what evidence would justify changing the selected tool later.",
                ],
                deliverables: [
                    "Performance-tool decision matrix",
                    "Baseline comparison evidence",
                    "Primary-tool ADR or decision record",
                    "Revisit criteria",
                ],
                completionCriteria: [
                    "The decision starts from Steward workloads and evidence needs.",
                    "CI/container and observability integration are considered explicitly.",
                    "The learner chooses one primary implementation rather than accumulating tools.",
                    "Tool-specific syntax is separated from transferable performance concepts.",
                ],
            },
        },
        {
            id: "non-functional-quality-performance-tool-decision-002",
            title: "Defend the Tool Choice",
            estimatedMinutes: 15,
            content: {
                type: "reflection",
                prompt: "Defend the selected Steward performance-testing tool. Which workload and operational requirements drove the choice, what did the strongest alternative do better, and what future evidence would justify revisiting the decision?",
                minimumCharacters: 250,
            },
        },
    ],
};
