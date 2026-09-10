import type { Lesson } from "./lesson";

function reading(id: string, title: string, body: string): Lesson {
    return {
        id,
        title,
        activities: [{
            id: `${id}-001`,
            title,
            estimatedMinutes: 55,
            content: { type: "reading", body },
        }],
    };
}

function practical(id: string, title: string, objective: string, instructions: string[], deliverables: string[], completionCriteria: string[]): Lesson {
    return {
        id,
        title,
        activities: [{
            id: `${id}-001`,
            title,
            estimatedMinutes: 180,
            content: {
                type: "practical",
                objective,
                scenario: "Steward is now treated as an organization-owned technology service with business stakeholders, service consumers, architecture and dependency decisions, delivery and operational costs, security and reliability obligations, and accumulated evidence from prior schools. The goal is to govern technology outcomes, not to create framework paperwork.",
                instructions,
                deliverables,
                completionCriteria,
            },
        }],
    };
}

export const technologyGovernanceDeepLessons: Lesson[] = [
    reading("technology-governance-business-technology-alignment", "Business and Technology Alignment", `Technology governance begins with a simple question: why does this technology exist for the organization? Alignment means connecting technology decisions to business outcomes, stakeholder needs, risk appetite and operational reality. It does not mean accepting every business request unchanged. A Technical Steward translates between business intent and engineering consequences.\n\nFor Steward, alignment should trace from stakeholder outcomes to service capabilities, architecture characteristics, controls and measures. A request for faster onboarding, for example, may imply availability, usability, security and delivery-speed requirements that compete with each other. The governance task is to make those tensions explicit and ensure decisions remain connected to organizational value rather than local technical preference.\n\nA useful alignment record identifies the business outcome, affected stakeholders, technology capability, decision owner, measurable success signal, material risks and assumptions. If an engineering initiative cannot explain what organizational outcome it supports, its priority should be challenged.`),
    reading("technology-governance-value-delivery", "Value Delivery", `Technology value is not the amount of software produced. Value is the useful outcome achieved relative to cost, risk and opportunity. A feature that is delivered but rarely used, a platform that costs more to operate than the problem warrants, or a control that slows delivery without meaningful risk reduction can all destroy value.\n\nValue delivery therefore requires explicit expected benefits, observable outcomes and review after implementation. Technical Stewards should distinguish outputs such as releases, dashboards and policies from outcomes such as reduced incident frequency, faster recovery, safer releases, lower lead time or more reliable dependency consumption.\n\nFor Steward, value evaluation should reuse evidence already produced across delivery, quality, security and reliability. Governance should ask whether a proposed investment changes an outcome that matters and whether the expected benefit remains plausible after deployment.`),
    reading("technology-governance-resource-stewardship", "Resource Stewardship", `Resource stewardship means using finite engineering capacity, infrastructure, licenses, cloud spend, support attention and specialist skills responsibly. It is broader than cost cutting. Under-investing in maintenance, observability or security can create future cost and risk just as surely as over-engineering can waste current capacity.\n\nA Technical Steward should expose trade-offs: what work is displaced, what recurring operational burden is created, which skills are required, and whether the organization can sustainably own the chosen technology. Build-versus-buy, cloud-service adoption, internal platforms such as Nexus, and shared packages such as steward-common all carry long-term ownership costs.\n\nGood stewardship considers total lifecycle cost: acquisition, implementation, migration, operations, support, security, upgrades, exit and retirement.`),
    reading("technology-governance-performance-oversight", "Performance Oversight", `Governance needs feedback. Performance oversight defines whether technology is producing the outcomes and control behavior expected of it. The purpose is not to accumulate dashboards but to create enough visibility for accountable decisions.\n\nMeasures should connect to objectives. Service availability, deployment failure rate, recovery time, vulnerability remediation age, dependency freshness, exception age and architecture-debt exposure may be useful when they answer a decision question. Measures without an owner, threshold or response path are weak governance.\n\nTechnical Stewards should also guard against metric gaming. A healthy measure has a defined purpose, data source, review cadence, interpretation limits and expected action when a threshold is crossed.`),
    reading("technology-governance-governance-structures", "Governance Structures", `Governance structures define where technology decisions are made, challenged and reviewed. They may include service owners, architecture forums, security/risk functions, change authorities, product leadership and executive oversight. The structure should match decision scope and risk.\n\nNot every decision belongs in a committee. Local reversible decisions should stay close to the engineers doing the work; cross-cutting, expensive, irreversible or high-risk decisions need broader participation. A useful structure defines decision domains, accountable roles, required consultation, escalation paths and evidence expectations.\n\nFor Steward, the goal is a lightweight model that makes ownership visible across application, PostgreSQL, cloud/VPS hosting, Nexus, internal packages, delivery pipelines, security and reliability rather than centralizing every choice in one approval body.`),
    reading("technology-governance-cobit-concepts", "COBIT Concepts", `COBIT provides a governance and management framework for enterprise information and technology. Its most useful TSA lesson is the separation between governance responsibilities—evaluating stakeholder needs, directing priorities and monitoring outcomes—and management responsibilities that plan, build, run and monitor work within that direction.\n\nUse COBIT as a vocabulary and design aid, not a requirement to implement every objective. For Steward, COBIT concepts can help clarify stakeholder value, risk optimization, resource optimization, decision rights, goals and monitoring. The Technical Steward should select only the concepts that solve a real accountability or oversight problem and record why they apply.`),
    reading("technology-governance-itil-service-management", "ITIL and Service-management Concepts", `ITIL contributes service-management thinking: technology should be understood as a service that co-creates value with consumers, not merely as deployed components. Useful concepts include service ownership, value streams, incident/problem/change relationships, continual improvement and balancing utility with warranty.\n\nFor Steward, service-management thinking links architecture and delivery to operational ownership. A production service needs consumers, support expectations, operational readiness, incident paths and improvement loops. The curriculum does not require reproducing ITIL practices mechanically; the learner should adopt only practices that improve Steward's actual service lifecycle.`),
    reading("technology-governance-iso-management-systems", "ISO Management-system Concepts", `ISO management-system standards share recurring ideas: defined scope, leadership commitment, risk-based planning, documented responsibilities, operational controls, performance evaluation, corrective action and continual improvement. The important pattern is the management system itself: objectives lead to controls and evidence, evidence leads to review, and review leads to improvement.\n\nA Technical Steward should understand that documentation is not proof of effectiveness. A written policy may describe intended behavior, while operating evidence shows whether the control actually works. For Steward, this distinction will later support security, quality, service and compliance assurance without pretending that the learning environment is formally certified.`),
    reading("technology-governance-nist-framework-landscape", "NIST Framework Landscape", `NIST publishes multiple frameworks and guidance families rather than one universal checklist. Relevant examples include the Cybersecurity Framework for organizing cybersecurity outcomes, the Risk Management Framework for structured risk decisions, and Secure Software Development Framework guidance for software-development security practices.\n\nThe Technical Steward does not need to memorize every control identifier. The capability is to identify which framework addresses the problem, translate framework outcomes into Steward responsibilities and controls, and preserve traceability between risk, control objective, implementation and evidence. Framework use should improve decision quality and comparability, not create false assurance through checkbox completion.`),
    reading("technology-governance-frameworks-without-checklists", "Using Frameworks Without Checklist Thinking", `Frameworks are maps, not substitutes for judgment. Checklist thinking appears when teams implement controls because a framework names them, without connecting them to context, risk, architecture or evidence. It can also create false confidence: passing a checklist does not prove a system is secure, reliable or well governed.\n\nUse a framework by starting with the governance problem, selecting relevant outcomes, mapping them to existing practices, identifying genuine gaps, assigning ownership and deciding what evidence demonstrates operation. Tailor explicitly and record exclusions or adaptations.\n\nFor Steward, COBIT, ITIL, ISO and NIST should overlap where useful but never be stacked into four parallel bureaucracies. One well-designed control or ownership mechanism can satisfy several framework concepts when the underlying objective is the same.`),
    practical(
        "technology-governance-lab-map-steward-governance-responsibilities",
        "Lab: Map Steward Governance Responsibilities",
        "Design an evidence-based technology-governance map for Steward that connects organizational outcomes, decision rights, service ownership, risk, resources, performance and selected framework concepts.",
        [
            "Identify Steward's primary stakeholders, consumers and organizational outcomes, then trace each outcome to technology capabilities and measurable success signals.",
            "Map the major technology domains: application, PostgreSQL/data, delivery pipeline, cloud/VPS hosting, Nexus, steward-common, tsa-test-core, observability, security and operational support.",
            "For each domain, assign an accountable owner, key decision rights, required consultations, escalation path and review cadence.",
            "Select only relevant concepts from COBIT, ITIL, ISO management-system thinking and the NIST landscape. For every selected concept, state the governance problem it helps solve.",
            "Define a compact performance-oversight set. Each measure must have a purpose, source, owner, threshold or interpretation rule, and expected action.",
            "Identify at least three resource or value trade-offs and explain how governance should resolve or escalate them.",
            "Produce a responsibility matrix and governance narrative that avoid duplicate forums and duplicate controls.",
            "Record at least one framework concept you intentionally did not adopt and justify why it would add ceremony without sufficient value in Steward's current context."
        ],
        [
            "Business-to-technology alignment map",
            "Technology governance responsibility and decision-rights matrix",
            "Selected-framework mapping with rationale",
            "Performance oversight scorecard definition",
            "Resource/value trade-off analysis",
            "Governance gaps, owners and improvement actions"
        ],
        [
            "Every governance mechanism is tied to an organizational outcome, risk or accountability need.",
            "Governance and management responsibilities are distinguishable.",
            "Framework concepts are tailored rather than copied wholesale.",
            "Performance measures have owners and decision consequences.",
            "Steward's internal packages and Nexus have explicit governance ownership.",
            "The model remains proportionate: local reversible decisions stay local while material cross-cutting decisions receive appropriate oversight."
        ]
    ),
];
