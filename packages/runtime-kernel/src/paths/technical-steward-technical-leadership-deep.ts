import type { Activity } from "../activities";
import type { Lesson } from "./lesson";

function lesson(id: string, title: string, body: string, practice: string[]): Lesson {
    const reading: Activity = {
        id: `${id}-reading`,
        title,
        estimatedMinutes: 55,
        content: { type: "reading", body },
    };
    const practical: Activity = {
        id: `${id}-practice`,
        title: `Practice: ${title}`,
        estimatedMinutes: 60,
        content: {
            type: "practical",
            objective: `Apply ${title} to a real Steward technical-leadership situation.`,
            scenario: "Steward is now a mature internal technology service with code, PostgreSQL, internal packages, Nexus, delivery automation, cloud/VPS hosting, security controls, reliability practices and architecture decisions. You are responsible for improving technical outcomes even when you do not have formal authority over every contributor or stakeholder.",
            instructions: practice,
            deliverables: ["Decision or review artifact", "Evidence and rationale", "Follow-up or ownership record"],
            completionCriteria: ["The recommendation is grounded in evidence and explicit trade-offs.", "Ownership and next actions are clear without relying on positional authority.", "Technical leadership improves decision quality rather than becoming ceremony or control for its own sake."],
        },
    };
    return { id, title, activities: [reading, practical] };
}

export const technicalLeadershipDeepLessons: Lesson[] = [
    lesson("technical-leadership-technical-ownership", "Technical Ownership", "Technical ownership means accepting responsibility for the health and evolution of a technology outcome, not personally doing every task. A technical steward keeps the service's architecture, quality, security, reliability, operability, dependency lifecycle and engineering health visible; identifies unclear ownership; follows decisions through to evidence; and makes sure risks do not disappear between team boundaries. Ownership is strongest when authority, responsibility and escalation paths are explicit. Steward gives you a concrete system in which ownership spans application code, PostgreSQL, delivery pipelines, Nexus, steward-common, tsa-test-core, production operations and governance artifacts. The goal is not heroics. The goal is a system where important decisions have owners, evidence and follow-through.", ["Map Steward's major technical responsibilities and current owners.", "Identify one responsibility that is fragmented, implicit or unowned.", "Define the decision rights, expected evidence, escalation path and review cadence for it.", "Explain what you own directly, what you influence, and what must remain owned elsewhere."]),
    lesson("technical-leadership-influence-without-authority", "Influence Without Authority", "Senior technical work often depends on people you do not manage. Influence therefore comes from credibility, context, evidence, clarity, relationships and the ability to frame a decision around shared goals. Effective influence starts by understanding the stakeholder's incentives and constraints, then making the problem legible: what is happening, why it matters, what options exist, what each option costs and what decision is needed. Technical stewards should avoid both command-and-control behavior and passive 'I only advise' behavior. For Steward, a proposal to change a package policy, production control, architecture boundary or delivery practice may require agreement from developers, QA, security, operations and business owners. The steward's job is to build alignment while preserving responsible challenge.", ["Choose one Steward improvement that requires cooperation from at least two roles you do not control.", "Write the shared objective, each stakeholder's likely concern, and the evidence that matters to them.", "Prepare a concise recommendation with options rather than a unilateral instruction.", "Record where compromise is acceptable and where a technical or risk boundary should not be traded away."]),
    lesson("technical-leadership-decision-making", "Decision-making", "Good technical decision-making separates facts, assumptions, constraints, preferences and unknowns. Reversible decisions should usually be lightweight; expensive, hard-to-reverse or high-risk decisions deserve deeper analysis and explicit records. A steward defines the decision, identifies the decision owner, gathers sufficient evidence, compares credible options including 'do nothing', makes trade-offs visible, sets a decision deadline, and records reconsideration triggers. Consensus is useful but is not always required. Endless consensus-seeking can be as harmful as unilateral decision-making. Steward's prior ADRs, incidents, SLOs, capacity results, security findings and architecture reviews provide the evidence base for disciplined technical decisions.", ["Select one unresolved or hypothetical Steward technical decision.", "Separate observed facts, assumptions, constraints and unknowns.", "Compare at least two credible options plus retaining the current state where appropriate.", "Name the decision owner, decision deadline, chosen option and explicit reconsideration trigger."]),
    lesson("technical-leadership-technical-communication", "Technical Communication", "Technical communication is the ability to make the right level of detail available to the right audience so that decisions and actions can happen. The same issue may need an engineer-level explanation, an operational summary and an executive risk statement. Strong communication leads with the decision or consequence, then supplies evidence, trade-offs and details at progressively deeper levels. It avoids both jargon dumping and oversimplification that hides material risk. Written records are especially important because Steward's decisions outlive meetings and individual contributors. A good technical steward can explain why a change matters, what evidence supports it, what remains uncertain, who must act and what happens if no action is taken.", ["Take one Steward architecture, reliability, security or dependency issue.", "Write a one-paragraph engineer explanation, a one-paragraph service-owner explanation and a three-sentence executive summary.", "Ensure the facts and risk remain consistent across all three audiences.", "Identify what detail was intentionally omitted from each version and why."]),
    lesson("technical-leadership-mentoring", "Mentoring", "Mentoring is not giving answers faster. It is helping another engineer improve judgment, capability and independence. A steward diagnoses the learner's current mental model, asks questions that expose reasoning, provides targeted context, demonstrates when useful, and then returns ownership to the learner. Mentoring should distinguish skill gaps from missing context, unclear expectations or unsafe system boundaries. Review feedback should explain why something matters and what principle can transfer to the next problem. In Steward, prior curriculum artifacts create realistic mentoring material: ADRs, test design, incident analysis, package boundaries, security findings and operational runbooks can all be used to teach reasoning rather than rote procedure.", ["Choose a Steward artifact containing a decision another engineer could reasonably misunderstand.", "Define the principle you want the engineer to learn rather than the answer you want them to copy.", "Prepare three diagnostic questions, one hint and one worked example.", "Define evidence that would show the engineer can now apply the principle independently."]),
    lesson("technical-leadership-engineering-reviews", "Engineering Reviews", "An engineering review is a structured challenge of an important technical proposal or system state. It is not a performance ritual and should not become an approval gate for every small change. Reviews are most valuable when risk, irreversibility, cross-team impact, architecture significance or operational consequences justify collective scrutiny. The steward sets the review question, ensures the right evidence and stakeholders are present, distinguishes blocking concerns from suggestions, captures decisions and owners, and avoids reopening settled questions without new evidence. Steward already has architecture, security, quality and reliability review material; this lesson combines those disciplines into one decision-focused review practice.", ["Select a Steward change significant enough to justify an engineering review.", "Define the review question, required pre-read evidence and required participants.", "Classify findings as blocker, material risk, improvement or informational observation.", "Produce the final decision, dissent if any, owners and follow-up evidence expected."]),
    lesson("technical-leadership-escalation-responsible-challenge", "Escalation and Responsible Challenge", "Responsible challenge means raising material technical, security, reliability, compliance or delivery concerns even when doing so is inconvenient. Escalation is appropriate when normal collaboration cannot resolve a risk, when the decision owner lacks required information, when accountability is unclear, or when accepting the risk exceeds someone's authority. Good escalation is specific and proportionate: state the issue, evidence, consequence, attempted resolution, decision needed, urgency and accountable owner. It should never be used to win ordinary disagreements or bypass colleagues. Conversely, fear of escalation should not allow known high-impact risk to remain invisible. Steward's risk registers, incidents, security findings, exceptions and architecture decisions give the learner evidence-based scenarios for practicing this boundary.", ["Choose a Steward scenario where a material concern remains unresolved after normal collaboration.", "Document the evidence, likely consequence, actions already attempted and why escalation is now justified.", "Identify the correct escalation level and the exact decision or support requested.", "Define what outcome would close the escalation and what evidence must be retained."]),
    {
        id: "technical-leadership-lab-lead-steward-technical-review",
        title: "Lab: Lead a Steward Technical Review",
        activities: [
            {
                id: "technical-leadership-lab-lead-steward-technical-review-001",
                title: "Activity 1: Prepare the Review",
                estimatedMinutes: 90,
                content: {
                    type: "practical",
                    objective: "Prepare an evidence-based cross-functional technical review of a meaningful Steward concern.",
                    scenario: "Select a real or credible Steward concern that crosses at least three technical perspectives such as architecture, delivery, quality, security, reliability, data, dependencies or service ownership.",
                    instructions: ["State the review question and why a formal review is proportionate.", "Build a concise pre-read using existing Steward evidence.", "Identify decision owner, contributors, affected stakeholders and any missing expertise.", "Separate facts, assumptions, risks, options and unresolved questions.", "Define which concerns could block the decision and which are advisory."],
                    deliverables: ["Technical review brief", "Stakeholder/decision-rights map", "Evidence pack", "Review agenda and decision criteria"],
                    completionCriteria: ["The review has a concrete decision or risk question.", "Evidence is sufficient for participants to challenge the proposal.", "Participants are selected for relevant expertise and accountability rather than hierarchy alone."],
                },
            },
            {
                id: "technical-leadership-lab-lead-steward-technical-review-002",
                title: "Activity 2: Facilitate Decision and Challenge",
                estimatedMinutes: 105,
                content: {
                    type: "practical",
                    objective: "Demonstrate leadership through facilitation, evidence, trade-offs and responsible challenge rather than positional authority.",
                    scenario: "Run the review as if participants disagree about risk, cost, delivery speed and technical direction.",
                    instructions: ["Present the problem and decision criteria before advocating an option.", "Surface dissent and ask what evidence would change each position.", "Keep discussion anchored to drivers, risks and consequences.", "Distinguish reversible decisions from expensive or high-risk commitments.", "Escalate only if the remaining risk exceeds the decision group's authority or cannot be responsibly resolved."],
                    deliverables: ["Decision log", "Material dissent and challenge record", "Risk/exception decisions", "Action owners and deadlines"],
                    completionCriteria: ["The decision follows from evidence rather than seniority.", "Material dissent is captured rather than suppressed.", "Every unresolved material issue has an owner, risk treatment or justified escalation."],
                },
            },
            {
                id: "technical-leadership-lab-lead-steward-technical-review-003",
                title: "Activity 3: Close the Leadership Loop",
                estimatedMinutes: 75,
                content: {
                    type: "practical",
                    objective: "Turn the review into durable ownership, communication and learning.",
                    scenario: "The value of a review is proven after the meeting through follow-through and improved future decisions.",
                    instructions: ["Publish the decision in the appropriate durable artifact such as ADR, risk record, standard, backlog item or exception.", "Communicate the outcome at the right level to engineers, service owners and other affected stakeholders.", "Define validation evidence and a reconsideration trigger.", "Identify one mentoring or knowledge-sharing opportunity created by the review.", "Retrospect on whether the review added value or unnecessary ceremony."],
                    deliverables: ["Durable decision artifact", "Audience-specific communication", "Validation/reconsideration plan", "Leadership retrospective"],
                    completionCriteria: ["The review outcome survives beyond the meeting.", "Ownership and evidence expectations are explicit.", "The learner can explain both the technical decision and how their leadership behavior improved the process."],
                },
            },
        ],
    },
];
