import type { LearningPath } from "./learning-path";

export const stewardApiSystemDesignPortfolioDeep: LearningPath = {
    id: "steward-api-system-design-portfolio",
    title: "System Thinker Milestone",
    lessons: [
        {
            id: "steward-api-system-design-portfolio-milestone",
            title: "Milestone: Steward API System Design Portfolio",
            activities: [
                {
                    id: "steward-api-system-design-portfolio-brief",
                    title: "Milestone Brief: Steward System Design Portfolio",
                    estimatedMinutes: 30,
                    content: {
                        type: "reading",
                        body: "This milestone turns the System Thinker modules into one coherent, reviewable engineering portfolio for Steward API v1. The goal is not to create more documentation. The goal is to prove that you can connect requirements, boundaries, models, dependencies, data flow, failure reasoning and architecture decisions into one defensible view of the system.",
                        blocks: [
                            { type: "heading", id: "mission", text: "Mission", level: 2 },
                            { type: "paragraph", text: "Produce a system-design portfolio that another engineer can review without needing you to narrate every artifact. Each artifact must answer a clear engineering question, cite its evidence, state its assumptions and expose unresolved uncertainty." },
                            { type: "heading", id: "required-evidence", text: "Required evidence set", level: 2 },
                            { type: "list", items: [
                                "Problem statement, stakeholder/actor map and prioritized functional + quality requirements",
                                "System context with explicit system, trust and ownership boundaries",
                                "Container/component views and one lifecycle/state model",
                                "Responsibility and dependency map with coupling findings",
                                "At least three important data-flow views, including one failure-oriented flow",
                                "Failure portfolio covering dependency, state, saturation and operational failure",
                                "At least two evidence-backed ADRs with alternatives, consequences and revisit conditions",
                                "A final open-questions and next-school handoff section"
                            ] },
                            { type: "callout", tone: "warning", title: "Do not manufacture architecture", body: "The milestone does not reward novelty. If Steward's current modular-monolith structure remains the strongest fit, say so and defend it. Do not introduce microservices, queues or infrastructure merely to make the portfolio look advanced." },
                            { type: "heading", id: "definition-of-done", text: "Definition of done", level: 2 },
                            { type: "list", items: [
                                "Artifacts are internally consistent and use the same Steward vocabulary.",
                                "Every important claim can be traced to implementation evidence, requirements, an experiment or an explicit assumption.",
                                "Known gaps and uncertainties are visible rather than silently normalized.",
                                "Current-state description is separated from proposed future changes.",
                                "The portfolio ends with a concrete handoff into Platform Builder rather than implementing that school's concerns now."
                            ] }
                        ]
                    }
                },
                {
                    id: "steward-api-system-design-portfolio-gate-1",
                    title: "Gate 1: Reconcile Requirements, Context and Vocabulary",
                    estimatedMinutes: 90,
                    content: {
                        type: "practical",
                        objective: "Create one consistent system baseline before assembling deeper architecture artifacts.",
                        scenario: "Your earlier System Thinker artifacts were produced incrementally. Before portfolio assembly, you need to reconcile terminology, actors, requirements and boundaries so later diagrams do not contradict the problem definition.",
                        instructions: [
                            "Review the problem statement and remove implementation language that accidentally defines the problem in terms of Django models, endpoints or current folders.",
                            "Reconcile stakeholders and actors. Every actor in the context view must have a clear system interaction; stakeholders who do not interact directly should remain stakeholders, not be forced into actor notation.",
                            "Reconcile functional requirements with actual Steward responsibilities: ownership, lifecycle, criticality, environments, dependencies, membership/access and reviews.",
                            "Rank the most important quality requirements and ensure each is scenario-based rather than an adjective such as secure or scalable.",
                            "Review system, trust and ownership boundaries and document at least one uncertainty that remains genuinely unresolved.",
                            "Create a canonical vocabulary section for terms such as Service, Team, Membership, Environment, Dependency, Review, owner and lifecycle."
                        ],
                        deliverables: [
                            "Reconciled problem + requirements baseline",
                            "Canonical Steward vocabulary",
                            "Reviewed system context and boundary notes",
                            "List of contradictions corrected and uncertainties retained"
                        ],
                        completionCriteria: [
                            "Requirements describe needed behavior and qualities rather than mirroring implementation structure.",
                            "Actors, stakeholders and external systems are distinguished correctly.",
                            "Boundary claims are explicit and consistent with the context diagram.",
                            "The rest of the portfolio can use one vocabulary without semantic drift."
                        ]
                    }
                },
                {
                    id: "steward-api-system-design-portfolio-gate-2",
                    title: "Gate 2: Reconcile Structure, Responsibilities and Dependencies",
                    estimatedMinutes: 120,
                    content: {
                        type: "practical",
                        objective: "Produce a coherent structural model of Steward without confusing repository structure with architecture.",
                        scenario: "A reviewer needs to understand Steward's major runtime/data units, internal responsibilities and dependency direction, but should not have to reverse-engineer the source tree.",
                        instructions: [
                            "Refine the Steward container view and justify each container by runtime or data responsibility.",
                            "Choose the API as the normal component zoom target and ensure component names describe cohesive responsibilities rather than folders.",
                            "Overlay or pair the component view with a labeled dependency view showing direction and purpose.",
                            "Create a dependency inventory that records purpose, owner, contract, failure effect and change-coordination requirement for important dependencies.",
                            "Record at least two coupling/cohesion findings backed by real evidence from code, schema, configuration or use cases.",
                            "Keep implementation mismatches visible as findings. Do not refactor the system just to make the diagram cleaner."
                        ],
                        deliverables: [
                            "Reviewed container view",
                            "Reviewed component/responsibility view",
                            "Labeled dependency graph",
                            "Dependency inventory",
                            "Coupling/cohesion findings"
                        ],
                        completionCriteria: [
                            "The model describes responsibility rather than file placement.",
                            "Important dependencies have direction and purpose.",
                            "Coupling findings identify plausible change cost or coordination risk rather than cosmetic style concerns.",
                            "Model-to-code mismatches are recorded explicitly."
                        ]
                    }
                },
                {
                    id: "steward-api-system-design-portfolio-gate-3",
                    title: "Gate 3: Reconcile Behavior, Data Flow and Failure",
                    estimatedMinutes: 150,
                    content: {
                        type: "practical",
                        objective: "Show how important Steward behavior crosses validation, authorization, persistence and failure boundaries.",
                        scenario: "Static diagrams alone cannot explain whether the system behaves safely. You must connect structure to real flows and then reason about how those flows fail.",
                        instructions: [
                            "Choose at least three important flows: service registration, dependency creation, lifecycle transition and/or review workflow.",
                            "For each flow, show actor intent, authentication, authorization, validation, state change, transaction boundary and externally visible result.",
                            "Include at least one integration/failure-oriented flow with timeout, retry, duplicate-attempt or ambiguous-result reasoning.",
                            "Cross-reference flow steps with the failure portfolio. A failure scenario should point back to the flow or dependency it affects.",
                            "Ensure the failure portfolio includes dependency failure, invalid/partial state, resource exhaustion, operational/human failure and at least one silent correctness failure.",
                            "Separate current controls from proposed controls and record detection gaps where current evidence is weak."
                        ],
                        deliverables: [
                            "At least three reviewed behavior/data-flow views",
                            "One failure-oriented flow",
                            "Cross-referenced failure portfolio",
                            "Current-control versus proposed-control notes"
                        ],
                        completionCriteria: [
                            "Flows expose authorization and transaction boundaries rather than showing only happy-path calls.",
                            "Failure scenarios distinguish cause, failure mode and consequence.",
                            "At least one scenario can fail silently without full outage.",
                            "Retries, idempotency and ambiguous outcomes are addressed where relevant rather than assumed safe."
                        ]
                    }
                },
                {
                    id: "steward-api-system-design-portfolio-gate-4",
                    title: "Gate 4: Defend Architecture Decisions",
                    estimatedMinutes: 120,
                    content: {
                        type: "practical",
                        objective: "Turn the strongest System Thinker findings into explicit architecture decisions with evidence and trade-offs.",
                        scenario: "The portfolio should culminate in decisions, not just analysis. Use the earlier evidence to show what Steward should keep, change, defer or validate next.",
                        instructions: [
                            "Select at least two decisions that materially affect Steward architecture or evolution.",
                            "For each decision, state the drivers, constraints and relevant quality-attribute scenarios.",
                            "Compare credible alternatives fairly, including retaining the current approach when appropriate.",
                            "Record positive and negative consequences, assumptions, unresolved unknowns and concrete revisit triggers.",
                            "Where a factual uncertainty can be tested cheaply, include the experiment or evidence instead of arguing from preference.",
                            "Ensure proposed future decisions do not prematurely implement Platform Builder, Delivery Engineer, Security Steward or Reliability Engineer concerns."
                        ],
                        deliverables: [
                            "At least two finalized Steward ADRs",
                            "Decision-driver matrix",
                            "Evidence/experiment notes",
                            "Explicit deferred decisions"
                        ],
                        completionCriteria: [
                            "ADRs are tied to real Steward evidence.",
                            "Alternatives are credible rather than straw men.",
                            "Consequences include real costs and risks.",
                            "Revisit conditions are observable triggers, not vague statements such as when needed."
                        ]
                    }
                },
                {
                    id: "steward-api-system-design-portfolio-gate-5",
                    title: "Gate 5: Assemble the Reviewable Portfolio",
                    estimatedMinutes: 120,
                    content: {
                        type: "practical",
                        objective: "Assemble the System Thinker artifacts into a concise, navigable engineering portfolio that can survive independent review.",
                        scenario: "A senior engineer who did not attend the earlier exercises should be able to understand Steward's problem, architecture, risks and current decisions from the portfolio alone.",
                        instructions: [
                            "Create a portfolio entry page or README with purpose, scope and navigation.",
                            "Order artifacts from problem and context toward structure, behavior, failure and decisions.",
                            "For every diagram or model, state the question, audience, evidence source, assumptions and deliberate omissions.",
                            "Remove redundant diagrams or notes that answer the same question without adding useful perspective.",
                            "Add a consistency review: vocabulary, actor names, component names, lifecycle terms, dependency names and ADR references must match across artifacts.",
                            "Add a current-state versus future-state distinction wherever proposed changes appear.",
                            "Finish with an open-questions section and one explicit handoff to Platform Builder focused on hosting/operating the existing Steward system, not redesigning its domain."
                        ],
                        deliverables: [
                            "Portfolio index/README",
                            "Curated System Thinker artifact set",
                            "Consistency checklist",
                            "Open questions and Platform Builder handoff"
                        ],
                        completionCriteria: [
                            "A reviewer can navigate the portfolio without oral guidance.",
                            "Artifacts are internally consistent and non-redundant.",
                            "Assumptions and omissions are visible.",
                            "Current state and proposals are clearly separated.",
                            "The handoff identifies infrastructure/hosting questions without prematurely solving them."
                        ]
                    }
                },
                {
                    id: "steward-api-system-design-portfolio-exit",
                    title: "Milestone Review and Exit Criteria",
                    estimatedMinutes: 35,
                    content: {
                        type: "reflection",
                        prompt: [
                            "1. What is the strongest requirement or quality attribute currently driving Steward architecture, and what evidence supports that priority?",
                            "2. Which boundary in Steward is easiest to misunderstand, and what would go wrong if a reviewer interpreted it incorrectly?",
                            "3. Name one architectural component that is a real responsibility and one source-code grouping that should not be treated as a component. Why?",
                            "4. Which Steward flow best exposes the difference between authentication, authorization, validation and transactionality?",
                            "5. Describe one silent correctness failure from your portfolio and explain how it differs from a visible outage.",
                            "6. Defend one ADR, including the strongest alternative you rejected and the concrete trigger that would make you revisit the decision.",
                            "7. What architecture or implementation issue did you deliberately NOT fix during System Thinker, and why was deferring it the correct engineering choice?",
                            "8. What is the first Platform Builder question you will investigate about running Steward, and what current System Thinker evidence makes that question important?"
                        ].join("\n")
                    }
                }
            ]
        }
    ]
};
