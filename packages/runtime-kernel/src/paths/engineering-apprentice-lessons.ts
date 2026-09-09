import type { Lesson } from "./lesson";

export const engineeringDecisions: Lesson = {
    id: "engineering-foundations-engineering-decisions",
    title: "Engineering Decisions",
    activities: [
        {
            id: "engineering-decisions-001",
            title: "Learning Outcomes",
            estimatedMinutes: 5,
            content: { type: "reading", body: `By the end of this lesson you should be able to define a decision before debating solutions, identify drivers and constraints, compare viable alternatives, record consequences and uncertainty, and explain when a decision should be revisited.` },
        },
        {
            id: "engineering-decisions-002",
            title: "Decisions Need Context, Not Ceremony",
            estimatedMinutes: 16,
            content: {
                type: "reading",
                body: `An engineering decision is a commitment made under incomplete information and real constraints. The quality of the decision is not measured only by whether the future proves it perfect. It is measured by whether the reasoning was proportionate, evidence-aware and understandable at the time.

Strong decision records answer a small set of durable questions:

- What decision are we making?
- What problem or outcome drives it?
- Which constraints and quality attributes matter?
- What viable alternatives did we consider?
- Why did we choose this option now?
- What consequences and risks are we accepting?
- What remains uncertain?
- What event or evidence should make us reconsider?

The record should be short enough to read and specific enough to challenge. Avoid retrospective fiction: do not rewrite the reasons after the outcome is known. A decision log is valuable because future engineers can distinguish deliberate trade-offs from accidental structure.

Not every choice deserves an ADR. Naming a local variable does not. Choosing a database, service boundary, package ownership model, authentication approach or deployment strategy often does because the consequences extend across time and teams.`,
            },
        },
        {
            id: "engineering-decisions-003",
            title: "Practice: Write a Decision Record",
            estimatedMinutes: 35,
            content: {
                type: "practical",
                objective: "Make and document a technical decision using explicit alternatives, evidence and revisit conditions.",
                scenario: "Choose a real TSA/project decision with at least two credible alternatives—for example SQLite vs PostgreSQL for a serious backend, local-path dependency vs published internal package, or self-hosted vs managed infrastructure.",
                instructions: [
                    "Give the decision a concise title and state its current status.",
                    "Describe the context and why a decision is needed now.",
                    "List the decision drivers and non-negotiable constraints.",
                    "Describe at least two viable alternatives, including 'do nothing yet' when credible.",
                    "Record evidence and assumptions separately.",
                    "Choose an option and explain the trade-offs that make it strongest in the current context.",
                    "List positive and negative consequences.",
                    "Define at least one observable condition that should trigger reconsideration.",
                ],
                deliverables: ["Concise engineering decision record"],
                completionCriteria: ["The context makes the decision understandable without chat history.", "Alternatives are credible rather than strawmen.", "Consequences include drawbacks of the chosen option.", "The revisit condition is observable."],
            },
        },
        {
            id: "engineering-decisions-004",
            title: "Knowledge Check and Reflection",
            estimatedMinutes: 10,
            content: { type: "reflection", prompt: `1. Why can a decision be reasonable even if later evidence causes it to be reversed?
2. What kinds of choices deserve durable decision records?
3. Why should the disadvantages of the chosen option be documented?
4. Describe a past decision where the missing context now makes the choice hard to understand.` },
        },
    ],
};

export const evidenceAndTechnicalReasoning: Lesson = {
    id: "engineering-foundations-evidence-and-technical-reasoning",
    title: "Evidence and Technical Reasoning",
    activities: [
        {
            id: "technical-reasoning-001",
            title: "Learning Outcomes",
            estimatedMinutes: 5,
            content: { type: "reading", body: `By the end of this lesson you should be able to separate observation, inference, assumption and hypothesis; design evidence that could falsify a claim; avoid common causal overreach; and write a conclusion whose confidence matches the available evidence.` },
        },
        {
            id: "technical-reasoning-002",
            title: "Observation Is Not Explanation",
            estimatedMinutes: 18,
            content: {
                type: "reading",
                body: `Engineers routinely make claims such as “the deployment caused the outage,” “the database is slow,” or “the library upgrade broke authentication.” These may be correct, but proximity and correlation are not enough.

Use four labels while reasoning:

**Observation:** directly measured or reproduced. “Requests to /reports return 500 when the date range exceeds one year.”

**Inference:** a conclusion drawn from observations. “The failure may be linked to processing volume.”

**Assumption:** something currently treated as true without verification. “The production schema matches QA.”

**Hypothesis:** a testable proposed explanation. “The endpoint exhausts memory while materializing the large result set.”

Good evidence is discriminating: it can strengthen one explanation while weakening another. Strong investigations actively look for disconfirming evidence. If you believe a recent release caused a failure, test a case that should still fail even if the release were innocent, or compare behavior across versions/configurations.

Match language to confidence. “The evidence proves” should be rare. Prefer “the current evidence supports,” “we reproduced,” “we have not yet ruled out,” or “this remains an assumption” when that is more accurate.

This habit protects technical work from confidence inflation.`,
                resources: [
                    { title: "Google SRE — Effective Troubleshooting", url: "https://sre.google/sre-book/effective-troubleshooting/" },
                ],
            },
        },
        {
            id: "technical-reasoning-003",
            title: "Claim-Evidence Lab",
            estimatedMinutes: 35,
            content: {
                type: "practical",
                objective: "Evaluate a technical claim by separating facts, assumptions and competing explanations.",
                scenario: "Analyze a real claim or use: 'the database is making the API slow.'",
                instructions: [
                    "Write the claim without making it stronger than the original evidence allows.",
                    "List verified observations with their source or reproduction method.",
                    "List assumptions separately.",
                    "Create at least three competing hypotheses that could explain the observations.",
                    "For each hypothesis, identify evidence that would support it and evidence that would weaken it.",
                    "Choose the cheapest high-information observation or experiment to perform next.",
                    "Write the strongest conclusion the current evidence supports before running that experiment.",
                    "After the experiment, update the conclusion and confidence level.",
                ],
                deliverables: ["Claim/evidence/assumption table", "Competing hypotheses", "Experiment result", "Before/after conclusion"],
                completionCriteria: ["At least one possible explanation competes with the initial favorite.", "Evidence can falsify as well as confirm.", "The conclusion does not exceed the evidence.", "Confidence changes when evidence changes."],
            },
        },
        {
            id: "technical-reasoning-004",
            title: "Knowledge Check",
            estimatedMinutes: 10,
            content: { type: "reflection", prompt: `1. Give one observation and one inference about the same technical event.
2. What is the difference between an assumption and a hypothesis?
3. Why is evidence that could falsify your preferred explanation especially valuable?
4. Rewrite “the deployment definitely caused the outage” in language appropriate for incomplete evidence.` },
        },
    ],
};

export const learningAsEngineeringSkill: Lesson = {
    id: "engineering-foundations-learning-as-an-engineering-skill",
    title: "Learning as an Engineering Skill",
    activities: [
        {
            id: "engineering-learning-001",
            title: "Learning Outcomes",
            estimatedMinutes: 5,
            content: { type: "reading", body: `By the end of this lesson you should be able to define learning as demonstrable capability rather than content consumption, design a learning loop with retrieval and practice, identify evidence of competence, and use feedback to choose what to study next.` },
        },
        {
            id: "engineering-learning-002",
            title: "From Consuming Content to Building Capability",
            estimatedMinutes: 18,
            content: {
                type: "reading",
                body: `Technical learning easily becomes accumulation: courses completed, videos watched, notes collected, certifications planned. None of those is useless, but TSA measures learning by **what you can now do, explain, diagnose or defend without being carried by the material**.

A practical learning loop is:

**Capability target → attempt → retrieval → feedback → gap → focused study → new attempt → evidence**

Start with an observable capability. “Learn Linux” is vague. “Configure an Ubuntu service, inspect its logs, diagnose why it failed to start, and explain the permission model involved” can be demonstrated.

Use retrieval. Close the material and reconstruct the concept, commands or reasoning from memory. Retrieval reveals gaps that rereading can hide. Space important ideas across time rather than relying on one intense session.

Practice in the context where the skill will be used. Reading about SQL joins matters, but designing and debugging queries against Steward data produces stronger transfer. Deliberate practice should be difficult enough to expose weakness but narrow enough to generate useful feedback.

Keep evidence: a working artifact, explanation, investigation log, code review, lab result, benchmark or decision record. Portfolio evidence is not just for employers; it tells you what you actually know.

When stuck, study the smallest missing concept that unlocks the next attempt. This prevents “preparation forever” and keeps learning connected to engineering work.`,
                resources: [
                    { title: "Nature Reviews Psychology — The science of effective learning with spacing and retrieval practice", url: "https://doi.org/10.1038/s44159-022-00089-1" },
                ],
            },
        },
        {
            id: "engineering-learning-003",
            title: "Practice: Design a Capability Loop",
            estimatedMinutes: 30,
            content: {
                type: "practical",
                objective: "Turn a broad technical learning goal into a demonstrable capability and feedback loop.",
                scenario: "Choose a skill you genuinely want to develop during TSA, such as Linux administration, SQL, API testing, Docker, networking or technical writing.",
                instructions: [
                    "Rewrite the goal as one observable capability you could demonstrate to another engineer.",
                    "Define a first attempt that can be completed before you feel fully prepared.",
                    "Define what evidence will show success and what feedback you can collect.",
                    "Design one retrieval activity that requires reconstruction from memory.",
                    "Plan two spaced follow-up attempts with increasing difficulty.",
                    "List the likely gaps you expect and how you will avoid turning them into an endless prerequisite list.",
                ],
                deliverables: ["Capability statement", "Practice loop", "Evidence criteria", "Spaced follow-up plan"],
                completionCriteria: ["The capability is observable.", "The plan contains active retrieval, not only rereading.", "Feedback changes what happens next.", "Success requires producing or explaining something without step-by-step copying."],
            },
        },
        {
            id: "engineering-learning-004",
            title: "Reflection",
            estimatedMinutes: 12,
            content: { type: "reflection", prompt: `Think about a technical skill you previously tried to learn. What did you consume? What could you actually demonstrate afterward? Where did feedback arrive too late? What would your new capability/evidence loop look like?` },
        },
    ],
};

export const communicatingTechnicalWork: Lesson = {
    id: "engineering-foundations-communicating-technical-work",
    title: "Communicating Technical Work",
    activities: [
        {
            id: "technical-communication-001",
            title: "Learning Outcomes",
            estimatedMinutes: 5,
            content: { type: "reading", body: `By the end of this lesson you should be able to identify the decision your audience needs to make, lead with relevant context and outcome, preserve technical truth while changing level of detail, communicate uncertainty, and produce concise engineering evidence that another person can act on.` },
        },
        {
            id: "technical-communication-002",
            title: "Communication Is an Engineering Interface",
            estimatedMinutes: 17,
            content: {
                type: "reading",
                body: `A good investigation that nobody can follow is operationally weak. A correct design that reviewers misunderstand creates risk. Technical communication is therefore part of the engineering system.

Start with the audience and the action. An engineer diagnosing a defect may need reproduction steps, logs and affected components. A product owner may need impact, risk, options and expected next action. A governance reviewer may need control evidence and residual risk.

Changing detail does **not** permit changing truth. If the root cause is uncertain, both audiences should receive uncertainty appropriate to their decisions. Do not upgrade “likely” to “confirmed” because an executive summary is shorter.

Useful technical writing tends to:

- put the purpose and important conclusion early;
- distinguish facts, assumptions and decisions;
- use concrete nouns and verbs instead of vague abstractions;
- include only detail that helps the reader understand, verify or act;
- make ownership and next steps explicit;
- link or attach evidence instead of forcing every detail into the main narrative.

Treat documents like interfaces: clarity reduces coordination cost.`,
                resources: [
                    { title: "Google for Developers — Technical Writing", url: "https://developers.google.com/tech-writing" },
                    { title: "ACM Code of Ethics and Professional Conduct", url: "https://www.acm.org/code-of-ethics" },
                ],
            },
        },
        {
            id: "technical-communication-003",
            title: "Practice: Explain the Same Finding Twice",
            estimatedMinutes: 35,
            content: {
                type: "practical",
                objective: "Adapt one technical finding for two audiences while preserving evidence, uncertainty and meaning.",
                scenario: "Choose a defect, architecture decision, security finding or performance investigation you understand well.",
                instructions: [
                    "Define what another engineer needs to decide or do after reading your message.",
                    "Write an engineering version with reproduction/evidence, affected components, uncertainty and next technical action.",
                    "Define what a non-technical stakeholder needs to decide or understand.",
                    "Write a stakeholder version focused on impact, risk, options, status and next action.",
                    "Highlight every factual claim in both versions and verify that they are compatible.",
                    "Write a short note explaining what detail changed and why.",
                ],
                deliverables: ["Engineering communication", "Stakeholder communication", "Audience adaptation note"],
                completionCriteria: ["Both versions are factually consistent.", "Each version supports a real audience decision.", "Uncertainty remains visible.", "Technical detail is reduced or expanded deliberately rather than randomly."],
            },
        },
        {
            id: "technical-communication-004",
            title: "Knowledge Check",
            estimatedMinutes: 10,
            content: { type: "reflection", prompt: `1. Why should audience adaptation not change confidence or factual meaning?
2. What information belongs near the beginning of an incident/status update?
3. Give an example of detail useful to an engineer but distracting to a business stakeholder.
4. Rewrite one vague sentence you have used at work into a concrete, action-oriented technical statement.` },
        },
    ],
};

export const engineeringInvestigation: Lesson = {
    id: "engineering-foundations-engineering-investigation",
    title: "Milestone: Engineering Investigation",
    activities: [
        {
            id: "engineering-investigation-001",
            title: "Milestone Brief",
            estimatedMinutes: 10,
            content: { type: "reading", body: `This milestone is the first synthesis checkpoint in TSA. You are not being graded on knowing a particular technology. You are demonstrating the habits established across Engineering Apprentice: problem framing, systems thinking, trade-off reasoning, debugging discipline, evidence, learning, decisions and communication.

Choose a problem substantial enough that the answer is not obvious before investigation. The best topic is a real system or defect you can safely observe. A small unfamiliar open-source/local system is acceptable. Do not choose a question that can be answered by copying a tutorial.` },
        },
        {
            id: "engineering-investigation-002",
            title: "Engineering Investigation",
            estimatedMinutes: 240,
            content: {
                type: "practical",
                objective: "Investigate a real software system or technical problem and defend an evidence-based conclusion that another engineer can review.",
                scenario: "Select an unfamiliar system, defect, reliability problem, architectural question or technical choice that requires investigation rather than an immediate answer.",
                instructions: [
                    "Define the original request/problem, scope, stakeholders and constraints. Separate any proposed solution from the underlying outcome.",
                    "Create a system/problem map showing the relevant boundary, components and relationships.",
                    "Write expected versus actual behavior or the exact decision question.",
                    "Create an evidence log that labels observations, assumptions, inferences and sources.",
                    "Form at least three competing hypotheses or alternatives where the problem permits it.",
                    "Design and run observations/experiments that can eliminate or weaken alternatives. Record negative results.",
                    "Identify meaningful trade-offs and make a reasoned decision, root-cause conclusion or recommendation.",
                    "Write a concise decision record if the investigation ends in a durable technical choice.",
                    "Communicate the result twice: a technical review version and a short stakeholder summary.",
                    "Document uncertainty, residual risk and the condition or evidence that would cause you to revisit the conclusion.",
                    "Write a learning reflection describing at least two ways your mental model changed during the investigation.",
                ],
                deliverables: [
                    "Problem framing and constraints",
                    "System/problem map",
                    "Evidence and hypothesis log",
                    "Experiment or investigation evidence",
                    "Trade-off analysis and conclusion",
                    "Decision record when applicable",
                    "Technical report",
                    "Stakeholder summary",
                    "Learning reflection",
                ],
                completionCriteria: [
                    "The final answer was not assumed at the beginning.",
                    "Claims can be traced to observations, experiments or clearly marked assumptions.",
                    "The work shows system relationships rather than isolated symptom fixing.",
                    "Competing explanations or alternatives received genuine consideration.",
                    "The conclusion communicates uncertainty and trade-offs honestly.",
                    "Another engineer could reproduce the key reasoning from the artifact.",
                    "The final work is strong enough to retain as portfolio evidence.",
                ],
            },
        },
        {
            id: "engineering-investigation-003",
            title: "Milestone Self-Review",
            estimatedMinutes: 20,
            content: { type: "reflection", prompt: `Before declaring the milestone complete, answer:

- Which conclusion in your report has the weakest evidence?
- Which assumption would be most dangerous if wrong?
- Which alternative did you initially underestimate?
- What did the system map reveal that a component-by-component view would have missed?
- If another engineer challenged your conclusion, what evidence would you show first?
- What would you investigate next if you had twice as much time?
- Which Engineering Apprentice habit changed your approach the most?` },
        },
    ],
};
