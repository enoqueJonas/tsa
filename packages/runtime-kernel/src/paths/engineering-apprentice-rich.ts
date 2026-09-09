import type { LearningResource, LessonBlock } from "../activities";
import type { Lesson } from "./lesson";

const sweGoogle: LearningResource = { title: "Software Engineering at Google — What Is Software Engineering?", url: "https://abseil.io/resources/swe-book/html/ch01.html" };
const sreTroubleshooting: LearningResource = { title: "Google SRE — Effective Troubleshooting", url: "https://sre.google/sre-book/effective-troubleshooting/" };
const missingSemesterDebugging: LearningResource = { title: "MIT Missing Semester — Debugging and Profiling", url: "https://missing.csail.mit.edu/2020/debugging-profiling/" };
const googleTechnicalWriting: LearningResource = { title: "Google for Developers — Technical Writing", url: "https://developers.google.com/tech-writing" };
const learningScience: LearningResource = { title: "Nature Reviews Psychology — Science of effective learning", url: "https://doi.org/10.1038/s44159-022-00089-1" };
const acmEthics: LearningResource = { title: "ACM Code of Ethics and Professional Conduct", url: "https://www.acm.org/code-of-ethics" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function richLesson(
    title: string,
    blocks: LessonBlock[],
    objective: string,
    instructions: string[],
    knowledgeCheck: string,
    resources: LearningResource[] = [],
): Lesson {
    const id = `engineering-foundations-${slug(title)}`;
    return {
        id,
        title,
        activities: [
            {
                id: `${id}-lesson`,
                title,
                estimatedMinutes: 45,
                content: {
                    type: "reading",
                    body: `Deep TSA lesson for ${title}.`,
                    ...(resources.length ? { resources } : {}),
                    blocks,
                },
            },
            {
                id: `${id}-practice`,
                title: `${title}: Engineering Practice`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Use a real technical system, project or controlled local scenario. The goal is to produce evidence that another engineer could inspect, not merely to state the right vocabulary.",
                    instructions,
                    deliverables: ["Working investigation or analysis evidence", "Concise engineering note explaining the reasoning and one uncertainty"],
                    completionCriteria: ["Claims are tied to observations or explicit assumptions.", "At least one alternative explanation, option or failure path is considered.", "The learner can defend the conclusion without relying on the lesson text."],
                },
            },
            {
                id: `${id}-check`,
                title: `${title}: Knowledge Check`,
                estimatedMinutes: 12,
                content: { type: "reflection", prompt: knowledgeCheck },
            },
        ],
    };
}

export const thinkingLikeAnEngineerRich = richLesson(
    "Thinking Like an Engineer",
    [
        { type: "heading", id: "introduction", text: "Engineering is not the same as coding" },
        { type: "paragraph", text: "Programming is the act of expressing behavior in code. Engineering is broader: understanding a problem, working within constraints, reducing uncertainty, comparing options, building something that can survive change, and collecting enough feedback to know whether the result works in its real context." },
        { type: "callout", tone: "note", title: "A useful distinction", body: "A program can be technically correct and still be a poor engineering outcome if it is impossible to operate, too expensive, insecure, hard to change, or solves the wrong problem." },
        { type: "heading", id: "reasoning-loop", text: "A repeatable engineering reasoning loop" },
        { type: "list", ordered: true, items: ["Frame the problem and desired outcome.", "Identify constraints and stakeholders.", "Separate what is known from what is assumed.", "Generate plausible options or hypotheses.", "Collect the cheapest high-value evidence.", "Compare trade-offs rather than searching for a universally best answer.", "Make a decision proportional to the evidence.", "Observe the result and update the mental model."] },
        { type: "heading", id: "example", text: "Worked example: a slow internal API" },
        { type: "paragraph", text: "Suppose users report that an internal API is slow. A coding-first response might immediately optimize a query. An engineering response first asks what 'slow' means, which endpoint is affected, when the behavior began, whether latency is measured at the client or server, what changed, and which constraints matter." },
        { type: "code", language: "text", caption: "Problem framing before solutioning", code: "Observation: /services takes 4.8s at p95 in QA\nExpected: <= 1.0s for the current data volume\nUnknowns: database time, network time, serialization time\nConstraint: no schema change before Friday release\nQuestion: where is the time actually spent?" },
        { type: "callout", tone: "warning", title: "Solution-first thinking", body: "If the first sentence of an investigation is a preferred technology or fix, the problem may not yet be understood." },
        { type: "heading", id: "professional-responsibility", text: "Engineering decisions have consequences" },
        { type: "paragraph", text: "Engineers influence reliability, privacy, security, cost and the work of other people. Professional judgment therefore includes communicating uncertainty, resisting misleading claims, escalating meaningful risk and recognizing when a decision exceeds your evidence or authority." },
        { type: "heading", id: "assignment", text: "Assignment" },
        { type: "list", ordered: true, items: ["Choose one technical problem you currently understand only partially.", "Write the desired outcome without naming a solution.", "List constraints, stakeholders, observations, assumptions and unknowns separately.", "Generate at least three possible explanations or approaches.", "Choose the next piece of evidence that would reduce the most uncertainty for the least cost."] },
        { type: "resources", title: "Required and supporting reading", resources: [sweGoogle, acmEthics] },
    ],
    "Frame a real technical problem using explicit outcomes, constraints, unknowns, options and evidence before proposing a solution.",
    ["Choose a problem that is not already solved in your head.", "Create a one-page problem frame with outcome, stakeholders and constraints.", "Separate observations, assumptions and unknowns.", "Generate three plausible next moves.", "Rank the next evidence-gathering step by information value and cost.", "Write what would make you change your current view."],
    "Explain the difference between programming and engineering. Why is 'what should we build?' often a later question than 'what problem are we solving?' Give an example where the technically strongest solution would still be the wrong engineering choice.",
    [sweGoogle, acmEthics],
);

export const systemsThinkingRich = richLesson(
    "Systems Thinking",
    [
        { type: "heading", id: "introduction", text: "Behavior emerges from relationships" },
        { type: "paragraph", text: "A system is more than a list of components. Its behavior emerges from interactions, dependencies, feedback loops, delays, shared resources and human processes. Debugging only the component where a symptom appears can miss the mechanism that created it." },
        { type: "heading", id: "boundaries", text: "Choose boundaries deliberately" },
        { type: "paragraph", text: "Every system model excludes something. The useful question is not whether the model is complete, but whether its boundary is appropriate for the decision you need to make. A login failure might require looking at the browser, API, identity provider, database, clock synchronization and network—not the entire company." },
        { type: "heading", id: "relationships", text: "Map flows, dependencies and feedback" },
        { type: "code", language: "text", caption: "A simple service interaction map", code: "User\n  │\n  ▼\nWeb/API ─────► Identity Provider\n  │\n  ├──────────► PostgreSQL\n  │\n  └──────────► Notification Service\n\nDeployment pipeline ──changes──► Web/API\nMonitoring ◄──telemetry──────── Web/API" },
        { type: "paragraph", text: "The arrows matter. They represent requests, data, ownership, control, feedback or failure propagation. Labeling them turns a pretty diagram into a reasoning tool." },
        { type: "heading", id: "failure-propagation", text: "Local symptoms can have remote causes" },
        { type: "list", items: ["A database connection pool can make an API appear CPU-bound because requests queue.", "A retry policy can multiply load and turn a dependency slowdown into a cascading failure.", "A manual approval step can be the real bottleneck in an otherwise automated delivery pipeline.", "A monitoring dashboard can hide a problem if its aggregation window smooths short failures away."] },
        { type: "callout", tone: "steward", title: "Future Steward connection", body: "Steward will eventually catalogue services and dependencies. Systems thinking is what makes those relationships meaningful rather than turning the product into a static inventory." },
        { type: "heading", id: "assignment", text: "Assignment" },
        { type: "list", ordered: true, items: ["Choose one system you can observe safely.", "Draw its important actors, components and external dependencies.", "Label at least five flows or relationships.", "Mark one feedback loop and one delay.", "Trace how one dependency failure could become a user-visible symptom.", "Write one important element intentionally outside your model boundary and justify excluding it."] },
    ],
    "Build a system map that explains behavior and failure propagation rather than merely listing components.",
    ["Select a real application or work process.", "Define the question your system model should answer.", "Draw actors, components, dependencies and flows.", "Identify shared resources, delays and feedback loops.", "Trace two different failure paths to user-visible symptoms.", "Revise the boundary if the model cannot explain the observed behavior."],
    "Why is a system boundary a decision rather than an objective fact? Give an example of a symptom whose likely cause sits outside the component that reports the error. What information does an unlabeled architecture box-and-arrow diagram fail to communicate?",
);

export const tradeOffsRich = richLesson(
    "Trade-offs",
    [
        { type: "heading", id: "introduction", text: "There is rarely a universally best design" },
        { type: "paragraph", text: "Engineering choices optimize for different qualities: speed, simplicity, cost, reliability, security, maintainability, delivery time and reversibility. Improving one can worsen another. The goal is to choose the balance that best fits the current context." },
        { type: "heading", id: "drivers", text: "Start with decision drivers" },
        { type: "paragraph", text: "A comparison without drivers is usually a preference contest. Before comparing technologies or designs, state what matters and how much it matters." },
        { type: "code", language: "text", caption: "Example decision drivers", code: "Decision: where should an internal prototype run?\n\nDrivers\n- monthly cost must stay low\n- one engineer operates it\n- recovery can take hours, not seconds\n- public internet exposure is unnecessary\n- learning Linux operations is valuable" },
        { type: "heading", id: "reversibility", text: "Reversible and irreversible decisions" },
        { type: "paragraph", text: "Spend more analysis on decisions that are expensive to reverse. A naming choice can often be changed cheaply. A data model embedded across integrations, a vendor contract or a service boundary may create years of coordination cost." },
        { type: "heading", id: "matrix", text: "Use comparison tools without pretending they are objective" },
        { type: "code", language: "text", caption: "A lightweight trade-off matrix", code: "Option            Cost   Ops burden   Learning   Recovery\nLocal VM          low    medium       high       manual\nManaged PaaS      med    low          medium     easier\nKubernetes        high   high         high       complex\n\nResult: Local VM wins for this context; Kubernetes is not 'worse' universally." },
        { type: "callout", tone: "warning", title: "False precision", body: "A weighted score can organize reasoning, but a 4.2 versus 4.0 score is not scientific truth. Record the assumptions behind the numbers." },
        { type: "heading", id: "assignment", text: "Assignment" },
        { type: "list", ordered: true, items: ["Choose a real decision with at least three credible options.", "Define five decision drivers and one hard constraint.", "Compare the options using evidence or explicit assumptions.", "Identify what each option optimizes and sacrifices.", "State the cheapest reversible experiment you could run before committing.", "Choose an option and write what evidence would make you revisit it."] },
    ],
    "Compare realistic engineering options using explicit drivers, sacrifices, uncertainty and reversibility.",
    ["Choose a non-trivial decision.", "List drivers before naming a preferred solution.", "Identify three credible options, including doing nothing yet when appropriate.", "Create a comparison table with evidence and assumptions.", "Classify the decision by reversibility.", "Write the accepted downsides of the chosen option."],
    "Why is 'best practice' not enough to choose between two designs? How should reversibility affect the amount of analysis you spend? Give an example of a decision where simplicity should beat theoretical scalability.",
);

export const debuggingMindsetRich = richLesson(
    "Debugging Mindset",
    [
        { type: "heading", id: "introduction", text: "Debugging is an investigation, not a sequence of guesses" },
        { type: "paragraph", text: "A disciplined debugger moves from symptom to evidence to hypotheses to experiments. Editing code before understanding the failure can destroy useful evidence and produce fixes that only hide the symptom." },
        { type: "heading", id: "workflow", text: "A hypothesis-driven workflow" },
        { type: "list", ordered: true, items: ["Reproduce the failure reliably enough to study it.", "Capture the exact symptom before changing anything.", "Reduce the search space using logs, traces, stack frames, recent changes or binary isolation.", "Write multiple plausible hypotheses.", "Choose an experiment that distinguishes between them.", "Change one relevant variable at a time when possible.", "Confirm the fix by reproducing the original path again.", "Record why the evidence supports the root cause rather than merely the patch."] },
        { type: "heading", id: "example", text: "Example: configuration or code?" },
        { type: "code", language: "text", caption: "Evidence log", code: "12:04  QA login returns 500\n12:07  Same commit works locally\n12:12  QA log: KeyError 'JWT_SECRET'\n12:16  Hypothesis A: missing environment variable\n12:16  Hypothesis B: wrong settings module\n12:20  env | grep JWT_SECRET -> no result\n12:24  set variable, restart -> login returns 200\n12:27  remove variable -> failure reproduced\nConclusion: current evidence supports missing QA configuration" },
        { type: "callout", tone: "note", title: "Strong debugging evidence", body: "A successful fix is stronger when you can make the failure return by restoring the causal condition." },
        { type: "heading", id: "biases", text: "Watch your cognitive biases" },
        { type: "list", items: ["Recency bias: assuming the latest change caused the issue because it is recent.", "Confirmation bias: collecting only evidence that fits the preferred explanation.", "Availability bias: blaming the subsystem you understand best.", "Premature closure: stopping when the symptom disappears rather than proving the mechanism."] },
        { type: "heading", id: "assignment", text: "Assignment" },
        { type: "list", ordered: true, items: ["Choose a safe defect or deliberately introduce one locally.", "Capture the exact failure and reproduction steps.", "Write at least three hypotheses before editing the code/configuration.", "Design an experiment that can falsify your favorite hypothesis.", "Record the evidence chronologically.", "After fixing it, recreate the causal condition and confirm that the failure returns."] },
        { type: "resources", title: "Required and supporting reading", resources: [sreTroubleshooting, missingSemesterDebugging] },
    ],
    "Diagnose a technical failure using competing hypotheses, discriminating experiments and a preserved evidence trail.",
    ["Reproduce and capture the failure.", "Write three hypotheses before changing the system.", "Choose one high-information experiment.", "Record evidence and eliminate at least one hypothesis.", "Implement the smallest justified fix.", "Recreate the causal condition to verify the explanation."],
    "What is the difference between fixing a symptom and establishing a root cause? Why is a hypothesis that can be falsified more useful than a vague suspicion? Describe a case where a recent deployment could correlate with a failure without causing it.",
    [sreTroubleshooting, missingSemesterDebugging],
);

export const engineeringDecisionsRich = richLesson(
    "Engineering Decisions",
    [
        { type: "heading", id: "introduction", text: "Decisions are commitments under uncertainty" },
        { type: "paragraph", text: "A good engineering decision is not one that future evidence never overturns. It is one whose context, drivers, alternatives, uncertainty and consequences were understood well enough for the decision to be reasonable at the time." },
        { type: "heading", id: "record", text: "What a durable decision record should answer" },
        { type: "list", items: ["What decision are we making?", "Why is a decision needed now?", "Which constraints and quality attributes matter?", "Which credible alternatives were considered?", "What evidence and assumptions support the choice?", "What consequences—good and bad—are accepted?", "What remains uncertain?", "What observable condition should trigger reconsideration?"] },
        { type: "heading", id: "example", text: "Example decision record" },
        { type: "code", language: "text", caption: "ADR-style record", code: "Decision: Start Steward as a modular monolith\nStatus: Accepted\nContext: one learner, one codebase, limited operations capacity\nAlternatives: microservices; separate services by domain; modular monolith\nDecision: modular monolith\nConsequences: simpler deployment and transactions; boundaries must still be explicit\nRevisit when: independent team ownership or scaling evidence makes deployment coupling costly" },
        { type: "callout", tone: "steward", title: "Do not manufacture architecture", body: "A future TSA lesson may teach microservices. That does not mean Steward must become microservices. Decisions exist to preserve reasoning, not to award technology badges." },
        { type: "heading", id: "proportion", text: "Match ceremony to consequence" },
        { type: "paragraph", text: "Not every choice deserves a formal ADR. Durable records are valuable when a decision affects architecture, ownership, security, data, operations, compatibility, cost or future teams. Lightweight local choices can remain in code review or comments." },
        { type: "heading", id: "assignment", text: "Assignment" },
        { type: "list", ordered: true, items: ["Choose a real decision with meaningful future consequences.", "State context and drivers before the decision itself.", "Include at least two credible alternatives.", "Separate evidence from assumptions.", "Record drawbacks of the selected option.", "Define an observable revisit trigger rather than 'if needed'."] },
    ],
    "Write an engineering decision record whose context, alternatives, trade-offs and revisit conditions are understandable without chat history.",
    ["Pick a decision with at least two credible alternatives.", "Write context and drivers.", "Separate evidence and assumptions.", "Explain why the selected option wins now.", "List positive and negative consequences.", "Define one measurable or observable revisit condition."],
    "Why can reversing a decision later be evidence of good engineering rather than failure? What distinguishes an ADR-worthy choice from a routine implementation detail? Why should the disadvantages of the chosen option be documented?",
);

export const evidenceAndTechnicalReasoningRich = richLesson(
    "Evidence and Technical Reasoning",
    [
        { type: "heading", id: "introduction", text: "Observation is not explanation" },
        { type: "paragraph", text: "Technical work is full of statements that sound factual but mix observation with interpretation: 'the database is slow', 'the release caused the outage', 'the framework is unreliable'. Strong reasoning makes those layers visible." },
        { type: "heading", id: "four-labels", text: "Four labels that improve investigations" },
        { type: "list", items: ["Observation — directly measured, reproduced or recorded.", "Inference — a conclusion drawn from observations.", "Assumption — treated as true for now without direct verification.", "Hypothesis — a testable proposed explanation that could be weakened by evidence."] },
        { type: "code", language: "text", caption: "Separate the layers", code: "Observation: requests above 10,000 rows return 500\nObservation: memory rises by ~600 MB during the request\nInference: response size may be related to the failure\nAssumption: QA and production query plans are similar\nHypothesis: the endpoint materializes the full dataset in memory before serialization" },
        { type: "heading", id: "disconfirming", text: "Search for disconfirming evidence" },
        { type: "paragraph", text: "Evidence becomes much more useful when it can prove your preferred explanation wrong. If you suspect the database, measure time before and after the query. If you suspect a deployment, compare the same artifact under different configuration. If you suspect scale, reproduce with controlled dataset sizes." },
        { type: "callout", tone: "warning", title: "Confidence inflation", body: "Use language that matches evidence: 'reproduced', 'supports', 'consistent with', 'not yet ruled out', 'assumed'. Reserve 'proved' and 'root cause confirmed' for cases where competing explanations have actually been eliminated." },
        { type: "heading", id: "assignment", text: "Assignment" },
        { type: "list", ordered: true, items: ["Choose one technical claim such as 'the database is making the API slow'.", "Write only the verified observations first.", "List assumptions separately.", "Create three competing hypotheses.", "For each, identify evidence that would strengthen and weaken it.", "Choose the cheapest experiment with the highest ability to discriminate between hypotheses.", "Update the conclusion and confidence after the experiment."] },
        { type: "resources", title: "Required and supporting reading", resources: [sreTroubleshooting] },
    ],
    "Evaluate a technical claim by separating observations, assumptions, inferences and competing hypotheses.",
    ["Write the claim conservatively.", "Create an observation/evidence log.", "List assumptions separately.", "Generate three competing hypotheses.", "Design one experiment that could falsify the preferred explanation.", "Write before/after conclusions with explicit confidence."],
    "Give an observation and an inference about the same event. How is an assumption different from a hypothesis? Why is evidence that can falsify your preferred explanation especially valuable? Rewrite 'the deployment definitely caused the outage' for incomplete evidence.",
    [sreTroubleshooting],
);

export const learningAsEngineeringSkillRich = richLesson(
    "Learning as an Engineering Skill",
    [
        { type: "heading", id: "introduction", text: "Consumption is not competence" },
        { type: "paragraph", text: "Courses, videos, books and certifications can support learning, but they are inputs. TSA measures learning by what you can now do, explain, diagnose or defend without the material carrying you step by step." },
        { type: "heading", id: "loop", text: "Build a capability loop" },
        { type: "code", language: "text", caption: "From vague goal to evidence", code: "Capability target\n      ↓\nFirst attempt\n      ↓\nRetrieval from memory\n      ↓\nFeedback\n      ↓\nSpecific gap\n      ↓\nFocused study\n      ↓\nHarder attempt\n      ↓\nEvidence" },
        { type: "paragraph", text: "'Learn Linux' is too broad to guide practice. 'Configure a Linux service, inspect its logs, diagnose why it failed to start, and explain the permission model involved' can be demonstrated and reviewed." },
        { type: "heading", id: "retrieval", text: "Retrieval exposes what rereading can hide" },
        { type: "paragraph", text: "Close the material and reconstruct commands, concepts, diagrams or reasoning from memory. The discomfort of retrieval is useful: it exposes the exact gaps that passive familiarity can conceal." },
        { type: "heading", id: "spacing", text: "Space important capabilities across time" },
        { type: "paragraph", text: "One intense session can create short-term fluency. Revisiting a skill after delay, with slightly different conditions, produces stronger evidence that the capability is durable and transferable." },
        { type: "callout", tone: "note", title: "Portfolio evidence is learning evidence", body: "A working lab, investigation log, benchmark, design review or explanation is useful before it ever appears in a job application. It tells you what you can genuinely reproduce." },
        { type: "heading", id: "assignment", text: "Assignment" },
        { type: "list", ordered: true, items: ["Choose one broad TSA learning goal.", "Rewrite it as an observable capability.", "Design a first attempt before you feel fully prepared.", "Define what evidence will count as success.", "Add one retrieval exercise with the material closed.", "Plan two spaced follow-up attempts with increasing difficulty.", "Write how feedback will determine what you study next."] },
        { type: "resources", title: "Required and supporting reading", resources: [learningScience] },
    ],
    "Turn a broad learning goal into a demonstrable capability with retrieval, feedback, spacing and reviewable evidence.",
    ["Select a skill you genuinely want to improve.", "Write one observable capability statement.", "Design a first attempt and evidence criteria.", "Add a retrieval task with no notes open.", "Schedule two increasingly difficult follow-up attempts.", "Define how failure changes the next study step."],
    "What is the difference between content familiarity and demonstrated capability? Why can retrieval feel worse while producing better evidence of learning? Give an example of a portfolio artifact that is also a learning instrument.",
    [learningScience],
);

export const communicatingTechnicalWorkRich = richLesson(
    "Communicating Technical Work",
    [
        { type: "heading", id: "introduction", text: "Communication is part of the engineering interface" },
        { type: "paragraph", text: "A correct investigation that nobody can follow is operationally weak. A sound design that reviewers misunderstand creates risk. Engineering communication exists to help another person understand, verify, decide or act." },
        { type: "heading", id: "audience", text: "Start with audience and action" },
        { type: "paragraph", text: "An engineer diagnosing a failure may need reproduction steps, logs, affected components and hypotheses. A stakeholder may need impact, risk, status, options and ownership. The level of detail changes; the factual meaning does not." },
        { type: "code", language: "text", caption: "Same incident, two interfaces", code: "Engineer:\nPOST /services returns 500 when owner_team_id references a retired team. Reproduced in QA on build 8f31... Stack trace points to ownership validation.\n\nStakeholder:\nCreating a service can fail when its selected owner team is retired. Existing services are unaffected. We reproduced the issue in QA and are validating a fix before release." },
        { type: "heading", id: "structure", text: "Make important information easy to find" },
        { type: "list", items: ["Lead with purpose, impact or decision when the reader needs to act quickly.", "Separate confirmed facts from assumptions and open questions.", "Use concrete nouns and verbs rather than vague phrases such as 'there is an issue'.", "Make ownership and next action explicit.", "Link evidence instead of forcing every raw detail into the main message."] },
        { type: "callout", tone: "warning", title: "Audience adaptation must not change truth", body: "Do not turn 'likely' into 'confirmed' because an executive summary is shorter. Uncertainty is information." },
        { type: "heading", id: "assignment", text: "Assignment" },
        { type: "list", ordered: true, items: ["Choose one technical finding you know well.", "Write a version for another engineer with evidence and next diagnostic action.", "Write a version for a non-technical stakeholder with impact, risk and next action.", "Highlight every factual claim in both versions and verify consistency.", "Remove jargon that adds no decision value.", "Write one sentence that communicates remaining uncertainty precisely."] },
        { type: "resources", title: "Required and supporting reading", resources: [googleTechnicalWriting, acmEthics] },
    ],
    "Explain the same technical finding to two audiences while preserving factual meaning, evidence and uncertainty.",
    ["Choose a defect, decision or investigation.", "Define what an engineer needs to do after reading.", "Write the engineering version.", "Define what a stakeholder needs to decide or understand.", "Write the stakeholder version.", "Compare factual claims and uncertainty across both."],
    "Why can changing the audience justify changing technical detail but not confidence? What information belongs near the beginning of an incident update? Rewrite a vague sentence such as 'the system has a problem' into a concrete, action-oriented statement.",
    [googleTechnicalWriting, acmEthics],
);

export const engineeringInvestigationRich: Lesson = {
    id: "engineering-foundations-engineering-investigation",
    title: "Milestone: Engineering Investigation",
    activities: [
        {
            id: "engineering-foundations-engineering-investigation-brief",
            title: "Milestone: Engineering Investigation",
            estimatedMinutes: 35,
            content: {
                type: "reading",
                body: "Synthesize the entire Engineering Apprentice school in one evidence-based investigation.",
                blocks: [
                    { type: "heading", id: "purpose", text: "Purpose" },
                    { type: "paragraph", text: "This milestone is not a technology quiz. It tests whether you can frame an unfamiliar problem, model the relevant system, reason about trade-offs, debug with hypotheses, separate evidence from assumptions, make a defensible decision and communicate the result." },
                    { type: "heading", id: "choose-problem", text: "Choose a problem worth investigating" },
                    { type: "paragraph", text: "Use a real local project, safe lab, open-source system or technical workflow. The answer should not be obvious before you begin, and the investigation must be safe and authorized." },
                    { type: "callout", tone: "note", title: "Good milestone questions", body: "Why does this service fail only in one environment? Which of two deployment approaches better fits these constraints? Where is latency introduced in this request path? Why does a build become unreliable under a specific condition?" },
                    { type: "heading", id: "required-evidence", text: "Required evidence" },
                    { type: "list", items: ["Problem frame: outcome, scope, constraints, stakeholders and unknowns.", "System map with labelled dependencies or flows.", "Observation, assumption and hypothesis log.", "At least two competing explanations or options.", "A deliberate experiment or evidence-gathering step.", "Trade-off analysis and a conclusion whose confidence matches the evidence.", "A concise decision or recommendation with revisit conditions.", "One engineer-facing communication and one stakeholder-facing summary.", "Reflection on how your mental model changed."] },
                    { type: "heading", id: "quality-bar", text: "Quality bar" },
                    { type: "paragraph", text: "A polished conclusion with weak evidence is not enough. A correct technical answer reached by undocumented guessing is also not enough. The milestone is about the reasoning trail: another engineer should be able to challenge the assumptions, reproduce key observations and understand why the conclusion was reasonable." },
                    { type: "resources", title: "Supporting references", resources: [sreTroubleshooting, sweGoogle, googleTechnicalWriting] },
                ],
            },
        },
        {
            id: "engineering-foundations-engineering-investigation-build",
            title: "Conduct the Engineering Investigation",
            estimatedMinutes: 300,
            content: {
                type: "practical",
                objective: "Investigate a real technical problem and defend an evidence-based conclusion that another engineer can review.",
                scenario: "Treat the investigation as your first TSA portfolio artifact. Preserve raw evidence separately from your final narrative so the reasoning remains auditable.",
                instructions: ["Frame the problem and define what a useful answer would change.", "Map the relevant system boundary, actors, dependencies and flows.", "Create an evidence log that distinguishes observations, assumptions, inferences and hypotheses.", "Generate at least two competing explanations or options.", "Run one or more high-information experiments or observations.", "Record failed hypotheses and surprising evidence rather than deleting them from the story.", "Analyze trade-offs and write a conclusion with explicit confidence and residual uncertainty.", "Write a decision/recommendation plus observable revisit conditions.", "Produce an engineer-facing report with reproducible evidence.", "Produce a short stakeholder summary focused on impact, conclusion, risk and next action."],
                deliverables: ["Problem frame", "System map", "Evidence and hypothesis log", "Experiment records", "Trade-off analysis", "Decision/recommendation", "Engineering report", "Stakeholder summary", "Reflection"],
                completionCriteria: ["The system boundary is justified.", "Observations are distinguishable from assumptions and explanations.", "At least one credible competing hypothesis or option is genuinely evaluated.", "The investigation contains evidence capable of falsifying a preferred explanation.", "The conclusion does not claim more certainty than the evidence supports.", "The recommendation includes consequences and revisit conditions.", "Both communications preserve the same technical truth."],
            },
        },
        {
            id: "engineering-foundations-engineering-investigation-defence",
            title: "Milestone Defence",
            estimatedMinutes: 25,
            content: {
                type: "reflection",
                prompt: "Defend your investigation. What did you initially believe? Which evidence changed your model? Which assumption remains most dangerous? Which alternative did you reject and why? What evidence would overturn your conclusion? If another engineer challenged one part of your work, which part would you most want them to test?",
            },
        },
    ],
};

export const engineeringApprenticeRichLessons: Lesson[] = [
    thinkingLikeAnEngineerRich,
    systemsThinkingRich,
    tradeOffsRich,
    debuggingMindsetRich,
    engineeringDecisionsRich,
    evidenceAndTechnicalReasoningRich,
    learningAsEngineeringSkillRich,
    communicatingTechnicalWorkRich,
    engineeringInvestigationRich,
];
