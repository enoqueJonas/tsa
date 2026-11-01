import type { LearningResource, LessonBlock } from "../activities";
import type { Lesson } from "./lesson";

const sweGoogle: LearningResource = { title: "Software Engineering at Google — What Is Software Engineering?", url: "https://abseil.io/resources/swe-book/html/ch01.html" };
const sreTroubleshooting: LearningResource = { title: "Google SRE — Effective Troubleshooting", url: "https://sre.google/sre-book/effective-troubleshooting/" };
const missingSemesterDebugging: LearningResource = { title: "MIT Missing Semester — Debugging and Profiling", url: "https://missing.csail.mit.edu/2020/debugging-profiling/" };
const googleTechnicalWriting: LearningResource = { title: "Google for Developers — Technical Writing", url: "https://developers.google.com/tech-writing" };
const learningScience: LearningResource = { title: "Nature Reviews Psychology — Science of effective learning", url: "https://doi.org/10.1038/s44159-022-00089-1" };
const acmEthics: LearningResource = { title: "ACM Code of Ethics and Professional Conduct", url: "https://www.acm.org/code-of-ethics", kind: "reference" };
const systemsFeedbackVideo: LearningResource = {
    title: "MIT OpenCourseWare — Information Flow / Feedback Loops",
    url: "https://ocw.mit.edu/courses/res-tll-004-stem-concept-videos-fall-2013/video_galleries/videos/information-flow/",
    kind: "video",
    read: "Feedback Loops item",
    purpose: "Optional visual reinforcement for feedback and system behavior; the TSA mapping exercise remains primary.",
};
const adrBasicsVideo: LearningResource = {
    title: "Architecture Decision Records (ADR): The Basics",
    url: "https://www.youtube.com/watch?v=7Gqn2dbt_JY",
    kind: "video",
    read: "Whole short video",
    purpose: "Concrete example of how teams preserve technical decision reasoning.",
};
const spacedRepetitionVideo: LearningResource = {
    title: "Osmosis — Spaced repetition in learning theory",
    url: "https://www.youtube.com/watch?v=cVf38y07cfk",
    kind: "video",
    read: "Whole short video",
    purpose: "Optional animation that makes spacing intuitive; retrieval and capability evidence remain the lesson focus.",
};

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
                    body: blocks.filter((block) => block.type === "paragraph").map((block) => block.text).join("\n\n"),
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
                    scenario: "Use a real technical system you can safely inspect, or a bounded hypothetical with explicitly labeled invented evidence when no system is available. Do not present hypothetical measurements as performed experiments. The goal is an independently inspectable chain of reasoning, not merely vocabulary.",
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
    ["Choose a problem that is not already solved in your head; if you lack a project, use the hypothetical slow /services API from the reading and label its observations illustrative.", "Create a one-page problem frame with outcome, stakeholders and constraints.", "Separate observations, assumptions and unknowns.", "Generate three plausible next moves.", "Rank the next evidence-gathering step by information value and cost.", "Write what would make you change your current view."],
    "Explain the difference between programming and engineering. Why is 'what should we build?' often a later question than 'what problem are we solving?' Give an example where the technically strongest solution would still be the wrong engineering choice.",
    [sweGoogle, acmEthics],
);

export const systemsThinkingRich = richLesson(
    "Systems Thinking",
    [
    {
        "type": "heading",
        "id": "why-system",
        "text": "Why a system cannot be understood from its parts alone"
    },
    {
        "type": "paragraph",
        "text": "A system is a set of parts that interact through relationships to produce behavior. A part might be a person, a machine, a rule or a piece of software. A relationship tells you what passes between parts—information, work, material or control. A system model is a deliberately simplified picture of those parts and relationships for one question. The picture is useful only if it explains something, such as where work waits or why a service fails."
    },
    {
        "type": "paragraph",
        "text": "Imagine a small café. A customer places an order, a staff member prepares it, and the customer collects the result. Naming 'customer, counter, barista' is an inventory, not yet an explanation. We need to state what moves, in what order, who waits for whom and what happens when arrivals exceed preparation capacity. Those relationships create the user-visible waiting time."
    },
    {
        "type": "code",
        "language": "text",
        "caption": "First model: explicitly label what the arrows mean",
        "code": "Customer --order details--> Order queue --next order--> Barista\n   ^                        (waiting tickets)          |\n   |                                                    |\n   +-------------------- prepared drink -----------------+\n\nBoundary: ordering, waiting, preparation and pickup\nOutside for this question: the coffee farm and supplier invoices"
    },
    {
        "type": "heading",
        "id": "boundaries",
        "text": "A model boundary answers one question"
    },
    {
        "type": "paragraph",
        "text": "The boundary specifies what is inside the system being studied. You cannot model everything, and including irrelevant parts can hide the explanation. For 'why do customers wait?' we include the queue and preparation. For 'why is the café out of beans?' we must extend the boundary to inventory and suppliers. Neither model is universally correct. You choose a boundary based on the outcome, then revise it when evidence shows an omitted dependency matters."
    },
    {
        "type": "paragraph",
        "text": "An actor is a person or external system participating at the boundary. A component is something inside it that performs work. A dependency is something the component needs to succeed. A flow is what actually crosses a relationship. A queue is where unfinished work waits. If your diagram has unlabeled arrows, nobody can tell whether they mean 'sends data', 'waits for', 'owns' or merely 'is related to'."
    },
    {
        "type": "heading",
        "id": "trace",
        "text": "Trace one interaction rather than drawing decorative boxes"
    },
    {
        "type": "list",
        "ordered": true,
        "items": [
            "1. A customer submits one order and receives a ticket. The ticket is work to be done, not a finished drink.",
            "2. The ticket enters a queue. If the barista is busy, it waits; its place can be observed.",
            "3. The barista takes the next ticket, prepares the order and hands off the drink.",
            "4. The customer receives the result. The order's completion time includes waiting and preparation, not just the seconds spent making the drink."
        ]
    },
    {
        "type": "paragraph",
        "text": "To check a model, ask whether it can explain every observed transition. If the café accepts tickets but never marks completion, a diagram that ignores completion state cannot distinguish 'waiting' from 'already served'. If it excludes people collecting the drinks, it cannot explain handoff errors. The model must be specific enough to answer your stated question, not as detailed as possible."
    },
    {
        "type": "heading",
        "id": "quantities",
        "text": "A tiny calculation can expose system behavior"
    },
    {
        "type": "paragraph",
        "text": "Assume six new orders arrive each minute and one barista completes four orders each minute. Start with an empty queue. During each minute, two more orders arrive than finish, so the queue grows. These numbers are illustrative assumptions, not measurements at a real café."
    },
    {
        "type": "code",
        "language": "text",
        "caption": "Worked backlog trace — orders, not seconds",
        "code": "Minute                  0    1    2    3    4    5\nNew orders (per minute)  —    6    6    6    6    6\nCompleted (per minute)   —    4    4    4    4    4\nWaiting after minute     0    2    4    6    8   10"
    },
    {
        "type": "paragraph",
        "text": "At minute five, ten orders are waiting: 5 × (6 − 4) = 10. The important conclusion is not 'the barista is slow' but 'the modeled arrival rate exceeds the modeled completion rate'. Hiring an extra person, changing preparation steps or accepting fewer orders would change that relationship in different ways. We will investigate the consequences of such changes in the next dedicated lesson."
    },
    {
        "type": "heading",
        "id": "alternatives",
        "text": "Compare a component inventory with a behavioral model"
    },
    {
        "type": "paragraph",
        "text": "An inventory diagram is appropriate for asset ownership or counting devices; it is not enough to explain time, dependency or failure. A behavioral system diagram labels flows, state and bottlenecks. A step-by-step process diagram can also describe ordering and handoff; a system model adds relationships and constraints that explain why the process changes under load. Pick the representation that answers the question rather than drawing a more elaborate graphic by habit."
    },
    {
        "type": "heading",
        "id": "first-technical-transfer",
        "text": "Transfer only the mechanism to a future technical system"
    },
    {
        "type": "paragraph",
        "text": "Later, you will inspect a local HTTP file server with a command-line client. That is another system: a client asks for a file, a server receives a request, a filesystem supplies content and a response returns. You do not need to understand a database, identity provider or deployment pipeline to practice system boundaries now. Those will be introduced in later schools with their own prerequisites."
    },
    {
        "type": "callout",
        "tone": "note",
        "title": "Observation versus hypothetical",
        "body": "The café numbers and the future file-server analogy are teaching models. Do not claim that you measured customer wait times or ran the technical server unless you actually did."
    },
    {
        "type": "heading",
        "id": "independent-practice",
        "text": "Independently model a different queue"
    },
    {
        "type": "paragraph",
        "text": "Model a school registration desk, a print station or a support-ticket queue. Set a precise question, draw a boundary, label at least three flows, and trace one item from entry through completion. Invent two clearly labeled hypothetical arrival/completion rates, calculate the backlog after three time steps and propose one observation that could disprove your model. Check your own work against this rubric: an explicit question, justified boundary, labeled relationships, numerically coherent trace and an identified unknown."
    }
],
    "Explain a system through a purpose, a deliberately chosen boundary, named flows, state and a traceable cause rather than a generic component list.",
    [
    "Choose a safe everyday system (café, print desk, registration line or school workflow) and state one precise question before drawing.",
    "Identify actors, the boundary, components and at least three labeled flows; distinguish queue/waiting state from completed work.",
    "Use hypothetical arrival and completion rates to build a three-step backlog trace; separate invented numbers from observed data.",
    "Contrast a component inventory with your behavioral model and justify what each can answer.",
    "Describe one important missing observation and revise the model if it cannot explain a plausible failure."
],
    "Why is a system more than its components? In a queue receiving six jobs/minute and completing four, why does the backlog grow? What evidence would tell you that your chosen boundary excludes an important cause?",
    
);

export const feedbackLoopsAndFailurePropagationRich = richLesson(
    "Feedback Loops and Failure Propagation",
    [
    {
        "type": "heading",
        "id": "mechanism",
        "text": "What feedback means and what it does not mean"
    },
    {
        "type": "paragraph",
        "text": "Feedback occurs when the outcome of a process influences a later input or decision in that same system. A loop is closed when the effect returns to something that can change the process. Mere reporting is not necessarily feedback: displaying yesterday's order count changes nothing unless someone or something acts on the information."
    },
    {
        "type": "paragraph",
        "text": "A reinforcing loop amplifies a change: more delay causes frustration, customers ask for updates, staff spend additional time answering, and delay grows further. A balancing loop counteracts a deviation: a long queue triggers extra staff, preparation capacity rises, and the queue begins to shrink. These labels describe the direction of the effect, not whether an outcome is ethically 'good' or 'bad'."
    },
    {
        "type": "code",
        "language": "text",
        "caption": "Reinforcing versus balancing — arrows carry a described effect",
        "code": "REINFORCING:\nWaiting grows → more status questions → less staff time for orders → waiting grows\n\nBALANCING:\nWaiting exceeds threshold → add a prepared staff member → more completions → waiting falls\n\nThe arrows do not promise an immediate effect. Staffing takes time."
    },
    {
        "type": "heading",
        "id": "delays",
        "text": "Why a response can be correct but too late"
    },
    {
        "type": "paragraph",
        "text": "A delay is the time between a change and when its consequence becomes visible or actionable. An extra worker may need five minutes to start. A dashboard may summarize every ten minutes. During those delays, the queue can keep growing. A loop that ignores delay can predict a successful intervention while people experience an outage or worsening wait."
    },
    {
        "type": "heading",
        "id": "step-trace",
        "text": "Compute how a deliberate intervention changes the result"
    },
    {
        "type": "paragraph",
        "text": "Continue the earlier illustrative café. The queue starts at ten waiting orders after minute five. For minutes six and seven, six arrive and four complete; the queue becomes twelve and then fourteen. The extra prepared worker begins at minute eight and raises completion capacity to eight orders per minute. From that point onward, eight can complete while only six arrive, so the queue shrinks by two per minute as long as it remains nonempty."
    },
    {
        "type": "code",
        "language": "text",
        "caption": "Worked sequence — no hidden rate change",
        "code": "Minute                 5   6   7   8   9  10\nArrival rate/min       —   6   6   6   6   6\nCompletion rate/min    —   4   4   8   8   8\nQueue after minute    10  12  14  12  10   8"
    },
    {
        "type": "paragraph",
        "text": "Do not declare success at minute eight because capacity increased. Customers are still waiting, and the model predicts eight outstanding orders even by minute ten. There is a distinction between improving a trend (queue is shrinking), meeting a service objective (acceptable wait) and resolving an incident (no undesirable impact remaining). The figures assume constant rates, available work and no cancellations; real measurements can invalidate the model."
    },
    {
        "type": "heading",
        "id": "failure-propagation",
        "text": "Trace a failure across dependencies"
    },
    {
        "type": "paragraph",
        "text": "Consider a card-payment terminal that stops responding. A customer cannot confirm payment, so an order is held rather than prepared. More customers arrive, and the queue at the payment stage grows. Customers complain that drinks are late even though the barista has spare capacity. The symptom is at pickup; the initiating failure is in payment. If cash is permitted as a fallback, that changes the dependency and has other costs, such as reconciliation and cash-handling risks."
    },
    {
        "type": "code",
        "language": "text",
        "caption": "Failure chain with the first causal defect labeled",
        "code": "Payment terminal unavailable\n       ↓ cannot confirm payment\nOrders held at checkout\n       ↓ waiting queue grows\nCustomer waits longer\n       ↓ reports 'service is slow'\n\nRoot-cause candidate: checkout dependency\nVisible symptom: customer delay\nProposed mitigation: authorized cash fallback, if policy allows"
    },
    {
        "type": "paragraph",
        "text": "A correlation is not automatically a cause. Seeing a long queue and slow service together does not prove the terminal failed. Verify terminal error output and affected orders. Competing hypotheses include too few staff, a printing failure or a misplaced order. An experiment should distinguish them: for example, compare the count of held-payment orders with the count awaiting preparation."
    },
    {
        "type": "heading",
        "id": "trade-offs",
        "text": "Different fixes change different constraints"
    },
    {
        "type": "list",
        "ordered": false,
        "items": [
            "Adding a prepared staff member addresses preparation capacity but not a broken payment terminal; extra staff also cost money.",
            "Allowing cash may restore some orders but introduces control and reconciliation obligations; it is not always authorized.",
            "Turning off all new orders limits backlog growth but loses sales and may be preferable during a severe outage.",
            "Increasing alert frequency can detect trouble earlier but raises noise; no monitoring system prevents failure by itself."
        ]
    },
    {
        "type": "heading",
        "id": "real-world-transfer",
        "text": "From queues to technical systems, without skipping later prerequisites"
    },
    {
        "type": "paragraph",
        "text": "When you later work with HTTP clients and servers, requests may queue, connections may fail and retries may increase load. The café loop provides a first mental model for that behavior. Do not assume databases, Kubernetes clusters or message brokers exist in today's learner project. The concept to transfer is cause → dependency → measurable symptom → evidence → intervention → delayed effect."
    },
    {
        "type": "callout",
        "tone": "note",
        "title": "Do not conflate a possible explanation with the diagnosis",
        "body": "Draw a failure chain as a hypothesis until evidence supports the causal links. A clear diagram is not a substitute for an observation."
    },
    {
        "type": "heading",
        "id": "independent-check",
        "text": "Explain, calculate and challenge a new scenario"
    },
    {
        "type": "paragraph",
        "text": "A print desk receives seven jobs per minute and completes five, starting empty. Predict the queue after four minutes, then suppose a second printer raises capacity to nine from minute five. Predict the queues after minutes five and six. Describe one reinforcing loop, one balancing intervention, one delay, a competing diagnosis and a measurement that could falsify your preferred explanation. Assessment: correct arithmetic, causal arrows labeled, intervention timing respected, a genuine alternative and an explicit evidence plan."
    }
],
    "Distinguish reinforcing and balancing feedback, compute delayed outcomes and trace cross-component failures using falsifiable evidence.",
    [
    "Draw the actual reinforcing and balancing loops from the café example, labeling what moves between steps.",
    "Recompute the two-stage queue example and explain why improved throughput is not immediate recovery.",
    "Model a payment-terminal failure from initiating defect to user-visible symptom, and state which links remain hypotheses.",
    "Compare at least two interventions using capacity, delay and operational constraints.",
    "Apply the mechanism to a new print-desk queue and propose a measurement that could invalidate your explanation."
],
    "Why can a balancing intervention make the queue shrink without eliminating customer delay? What is the difference between a failure chain, a correlation and proof of root cause?",
    
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
        { type: "list", ordered: true, items: ["Choose a real decision with at least three credible options; if you do not control a project, compare local file storage, SQLite and PostgreSQL for a hypothetical single-user note-taking prototype, labeling all cost/performance claims as assumptions.", "Define five decision drivers and one hard constraint.", "Compare the options using evidence or explicit assumptions.", "Identify what each option optimizes and sacrifices.", "State the cheapest reversible experiment you could run before committing.", "Choose an option and write what evidence would make you revisit it."] },
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
        { type: "list", ordered: true, items: ["Choose a safe defect or deliberately introduce one locally.", "Capture the exact failure and reproduction steps.", "Write at least three hypotheses before editing the code/configuration.", "Design an experiment that can falsify your favorite hypothesis.", "Record the evidence chronologically.", "In a disposable local setup only, reintroduce the suspected causal condition and observe whether the failure returns; do not deliberately reintroduce incidents in shared or production systems."] },
        { type: "resources", title: "Required and supporting reading", resources: [sreTroubleshooting, missingSemesterDebugging] },
    ],
    "Diagnose a technical failure using competing hypotheses, discriminating experiments and a preserved evidence trail.",
    ["Reproduce and capture the failure.", "Write three hypotheses before changing the system.", "Choose one high-information experiment.", "Record evidence and eliminate at least one hypothesis.", "Implement the smallest justified fix.", "If using a disposable local environment, deliberately reintroduce the causal condition to check the explanation; otherwise use non-disruptive evidence rather than recreating a real outage."],
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
        { type: "code", language: "text", caption: "ADR-style record", code: "Decision: Start the project as a modular monolith\nStatus: Accepted\nContext: one learner, one codebase, limited operations capacity\nAlternatives: microservices; separate services by domain; modular monolith\nDecision: modular monolith\nConsequences: simpler deployment and transactions; boundaries must still be explicit\nRevisit when: independent team ownership or scaling evidence makes deployment coupling costly" },
        { type: "callout", tone: "steward", title: "Do not manufacture architecture", body: "A future TSA lesson may teach microservices. That does not mean the project must become microservices. Decisions exist to preserve reasoning, not to award technology badges." },
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
                    { type: "paragraph", text: "Use a real local project, safe lab, open-source system or technical workflow. If you do not have one, use the disposable HTTP server and Git repository from the preceding Workbench lessons: investigate why a client request fails after the local server is stopped, or why a Git change is not in the next commit. Build an evidence trail with actual local commands, not imaginary measurements. The question must be safe, authorized and answerable with tools already taught." },
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
                objective: "Investigate an observable problem in your own safe local environment and defend a reproducible, evidence-based conclusion that another engineer can review.",
                scenario: "Treat the investigation as your first TSA portfolio artifact. A learner without a pre-existing project can reuse the Workbench local Python HTTP server, stop it deliberately and compare an HTTP 404 with connection refusal using curl, process inspection and server logs. A second viable path is Git working-tree versus index state. Preserve actual outputs and raw evidence separately from your final narrative; do not claim to have observed results you did not run.",
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
    feedbackLoopsAndFailurePropagationRich,
    tradeOffsRich,
    debuggingMindsetRich,
    engineeringDecisionsRich,
    evidenceAndTechnicalReasoningRich,
    learningAsEngineeringSkillRich,
    communicatingTechnicalWorkRich,
    engineeringInvestigationRich,
];
