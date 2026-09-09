import type { Lesson } from "./lesson";

export const engineeringDecisions: Lesson = {
    id: "engineering-foundations-engineering-decisions",
    title: "Engineering Decisions",
    activities: [
        {
            id: "engineering-decisions-001",
            title: "Decision-Making Brief",
            estimatedMinutes: 8,
            content: {
                type: "reading",
                body: "Engineering decisions are choices made under constraints. A strong decision makes the problem, assumptions, alternatives, trade-offs and consequences visible so that another engineer can understand why the choice was reasonable at the time. This lesson introduces decision records as evidence of engineering judgment rather than paperwork.",
            },
        },
        {
            id: "engineering-decisions-002",
            title: "Decision Record Exercise",
            estimatedMinutes: 25,
            content: {
                type: "practical",
                objective: "Make and document a small technical decision using explicit alternatives and trade-offs.",
                scenario: "Choose a real technical decision from TSA or another project where at least two reasonable approaches exist.",
                instructions: [
                    "State the decision that needs to be made and the constraints that matter.",
                    "Describe at least two viable alternatives.",
                    "Compare the alternatives using concrete trade-offs rather than preference alone.",
                    "Choose one option and record why it is currently the strongest choice.",
                    "Record one condition that could justify revisiting the decision later.",
                ],
                deliverables: ["A concise engineering decision record"],
                completionCriteria: [
                    "The problem and constraints are explicit.",
                    "At least two alternatives are genuinely considered.",
                    "The final choice is justified with evidence or reasoned trade-offs.",
                ],
            },
        },
    ],
};

export const evidenceAndTechnicalReasoning: Lesson = {
    id: "engineering-foundations-evidence-and-technical-reasoning",
    title: "Evidence and Technical Reasoning",
    activities: [
        {
            id: "technical-reasoning-001",
            title: "Evidence Before Opinion",
            estimatedMinutes: 8,
            content: {
                type: "reading",
                body: "Technical confidence should come from evidence. Engineers distinguish observations from interpretations, hypotheses from facts, and measurements from assumptions. Good reasoning creates a traceable path from what was observed to what is concluded, while remaining willing to revise the conclusion when stronger evidence appears.",
            },
        },
        {
            id: "technical-reasoning-002",
            title: "Claim and Evidence Exercise",
            estimatedMinutes: 20,
            content: {
                type: "practical",
                objective: "Evaluate a technical claim by separating facts, assumptions and evidence.",
                scenario: "Take a claim such as 'the database is making the API slow' or another claim from a real engineering situation.",
                instructions: [
                    "Write the claim without strengthening it beyond what is actually known.",
                    "List observations that are directly verified.",
                    "List assumptions that have not yet been verified.",
                    "Identify evidence that would strengthen or falsify the claim.",
                    "Write the strongest conclusion the current evidence actually supports.",
                ],
                deliverables: ["A claim-evidence-assumption analysis"],
                completionCriteria: [
                    "Facts and assumptions are clearly separated.",
                    "The proposed evidence could genuinely challenge the hypothesis.",
                    "The conclusion does not exceed the evidence available.",
                ],
            },
        },
    ],
};

export const learningAsEngineeringSkill: Lesson = {
    id: "engineering-foundations-learning-as-an-engineering-skill",
    title: "Learning as an Engineering Skill",
    activities: [
        {
            id: "engineering-learning-001",
            title: "Deliberate Technical Learning",
            estimatedMinutes: 8,
            content: {
                type: "reading",
                body: "Engineering requires continuous learning, but consuming information is not the same as developing capability. Effective technical learning combines a concrete objective, active experimentation, retrieval, feedback and reflection. TSA treats learning itself as an engineering process: define what capability is needed, practice it, gather evidence, identify gaps and iterate.",
            },
        },
        {
            id: "engineering-learning-002",
            title: "Learning Loop Reflection",
            estimatedMinutes: 12,
            content: {
                type: "reflection",
                prompt: "Think about a technical skill you previously tried to learn. What evidence showed that you could actually use it, what remained weak, and how would you redesign the learning process now?",
            },
        },
    ],
};

export const communicatingTechnicalWork: Lesson = {
    id: "engineering-foundations-communicating-technical-work",
    title: "Communicating Technical Work",
    activities: [
        {
            id: "technical-communication-001",
            title: "Technical Communication Brief",
            estimatedMinutes: 8,
            content: {
                type: "reading",
                body: "Engineering work creates value only when other people can understand, review, operate or act on it. Strong technical communication is audience-aware, precise about uncertainty, concise without hiding important context, and supported by evidence. The goal is not impressive terminology; it is shared understanding that enables a sound next decision.",
            },
        },
        {
            id: "technical-communication-002",
            title: "Explain the Same Finding Twice",
            estimatedMinutes: 20,
            content: {
                type: "practical",
                objective: "Adapt the same technical finding for two audiences without changing the underlying truth.",
                scenario: "Choose a technical issue, decision or investigation you understand well.",
                instructions: [
                    "Write a concise explanation for another engineer who needs enough detail to investigate or implement.",
                    "Write a second explanation for a non-technical stakeholder who needs to understand impact, risk and next action.",
                    "Compare what changed between the two explanations and what deliberately stayed the same.",
                ],
                deliverables: ["Technical explanation", "Stakeholder explanation", "Short comparison note"],
                completionCriteria: [
                    "Both explanations remain factually consistent.",
                    "Each audience receives information relevant to its decisions.",
                    "Uncertainty and impact are communicated clearly.",
                ],
            },
        },
    ],
};

export const engineeringInvestigation: Lesson = {
    id: "engineering-foundations-engineering-investigation",
    title: "Milestone: Engineering Investigation",
    activities: [
        {
            id: "engineering-investigation-001",
            title: "Engineering Investigation",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Demonstrate the Engineering Apprentice habits by investigating a real software system or technical problem and defending an evidence-based conclusion.",
                scenario: "Select an unfamiliar system, defect, reliability problem, architectural question or technical choice that is substantial enough to require investigation rather than an immediate answer.",
                instructions: [
                    "Define the problem, scope and important constraints.",
                    "Map the relevant parts of the system and their relationships.",
                    "Collect observations and distinguish them from assumptions.",
                    "Form competing hypotheses or alternatives and investigate them systematically.",
                    "Identify meaningful trade-offs and make a reasoned decision or conclusion.",
                    "Document the investigation so another engineer can follow the evidence.",
                    "Write a short reflection on what changed in your understanding during the investigation.",
                ],
                deliverables: [
                    "Investigation report",
                    "System or problem map",
                    "Evidence log",
                    "Decision or conclusion with trade-offs",
                    "Learning reflection",
                ],
                completionCriteria: [
                    "The investigation demonstrates systems thinking rather than isolated symptom fixing.",
                    "Claims are connected to observable evidence.",
                    "Alternative explanations or choices are considered.",
                    "The conclusion communicates uncertainty and trade-offs honestly.",
                    "The artifact is clear enough to be reviewed as portfolio evidence.",
                ],
            },
        },
    ],
};
