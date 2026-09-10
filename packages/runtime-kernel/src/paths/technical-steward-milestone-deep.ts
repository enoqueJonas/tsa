import type { Lesson } from "./lesson";
import { createDeepPracticalLesson } from "./deep-authoring";

export const technicalStewardMilestoneDeepLessons: Lesson[] = [
  createDeepPracticalLesson({
    pathId: "technical-stewardship-review",
    school: "Technical Steward",
    module: "Technical Steward Milestone",
    title: "Milestone: Technical Stewardship Review",
    estimatedMinutes: 600,
    objective: "Conduct and defend an evidence-based stewardship review of the complete Steward ecosystem, integrating technical leadership, governance, technology risk, controls, architecture/security/data/change governance, dependency lifecycle, engineering health and durable standards into a coherent improvement decision.",
    stewardConnection: "This is the synthesis point for the Technical Steward school and for the mature Steward service. The learner is no longer proving that individual governance artifacts can be produced; they must show that the whole stewardship system helps engineers make accountable decisions while preserving engineering judgment and delivery capability.",
    scenario: "Steward is an organization-owned service spanning application code, PostgreSQL, cloud/VPS infrastructure, CI/CD, Nexus, steward-common, tsa-test-core, security controls, observability/reliability practices and operational ownership. Leadership asks for a stewardship review before the next planning cycle. You must present what is demonstrably healthy, what remains uncertain, which risks require treatment or acceptance, which controls actually operate, where governance is helping or creating friction, and what should change next. Unsupported maturity claims are not acceptable.",
    instructions: [
      "Define the review scope, stakeholders, decision rights and evidence cutoff. State explicitly what is outside scope and which organizational assumptions—such as risk appetite—are supplied rather than invented.",
      "Build an evidence index that reuses authoritative artifacts from the full TSA journey: architecture decisions, delivery evidence, QA/test results, security assessments, reliability/SLO evidence, incidents, risk register, control tests, service/change records, dependency/Nexus lifecycle records, engineering-health data and handbook standards. Do not duplicate evidence merely to make the review look complete.",
      "Refresh the Steward technology-risk register using current evidence. Distinguish active issues from uncertain risks, inherent from residual exposure, and demonstrated controls from controls that merely exist on paper. Identify acceptance authority and review triggers for retained material risk.",
      "Select a representative control set across change/delivery, security/data, recoverability/reliability, access, dependencies/supply chain and operational ownership. Test design and operating effectiveness, record evidence and create findings where criteria are not met.",
      "Review architecture, security/data and change/service governance decisions. Identify where standards or guardrails clarify accountability and where approval steps, stale rules or repeated exceptions create unnecessary friction. Preserve 'retain current state' as a valid conclusion when evidence supports it.",
      "Review third-party and technology lifecycle exposure, including cloud/VPS dependencies, Nexus, steward-common and tsa-test-core. Confirm owners, approved sources, provenance expectations, support/version policy, retention, end-of-life/continuity concerns and exception paths.",
      "Produce an engineering-health view that connects technical debt, KPIs/KRIs, operational evidence and delivery constraints to decisions. Avoid vanity metrics and do not label disliked code as debt without evidence of future cost, risk or constraint.",
      "Audit the engineering handbook as a working governance product: verify that engineers can find applicable standards, runbooks/playbooks, decision records, review aids, owners and exception paths. Record stale, duplicated or missing guidance.",
      "Create a prioritized improvement roadmap. For each material action state the problem/risk, expected outcome, owner, evidence of completion, sequencing/dependency, cost or delivery trade-off and whether the action reduces risk, improves capability or removes governance friction.",
      "Facilitate a mock Technical Stewardship Review with at least two stakeholder perspectives—for example engineering delivery and risk/operations. Present evidence, invite challenge, distinguish facts from assumptions and record decisions, dissent, acceptance/escalation and follow-up ownership.",
      "Close the review loop by updating the relevant authoritative artifacts rather than creating a disconnected final report. Record which risks, controls, standards, exceptions, lifecycle decisions and roadmap items changed because of the review."
    ],
    deliverables: [
      "Technical Stewardship Review scope, stakeholder/decision-rights map and evidence index",
      "Refreshed technology-risk register with residual-risk and acceptance/escalation decisions",
      "Control assurance set with design/operating-effectiveness evidence and findings",
      "Architecture, security/data and change/service governance decision review",
      "Service ownership plus third-party/internal dependency lifecycle review for Nexus, steward-common, tsa-test-core and cloud/VPS dependencies",
      "Engineering-health and technical-debt decision view with meaningful KPI/KRI signals",
      "Engineering handbook/standards usability and lifecycle review",
      "Exception/waiver and risk-acceptance view with owners, authority and expiry/review triggers",
      "Prioritized improvement roadmap with evidence-based outcomes and trade-offs",
      "Technical Stewardship Review decision record capturing challenge, dissent, decisions and follow-up",
      "Updated authoritative Steward artifacts showing that the review changed the operating system of governance rather than producing a shelf report"
    ],
    completionCriteria: [
      "Claims about Steward's maturity, risk, control effectiveness and engineering health are traceable to current evidence; unknowns and assumptions are explicit.",
      "The review distinguishes risks, issues, vulnerabilities, controls, findings, debt and exceptions rather than collapsing them into one backlog.",
      "At least one material risk receives a defensible treatment, acceptance, escalation or monitoring decision with clear authority and follow-up.",
      "Control effectiveness is demonstrated through relevant operating evidence; the existence of policies, tools or configurations alone is not accepted as proof.",
      "Governance recommendations are proportionate: the learner removes or avoids unnecessary ceremony as readily as they add a justified guardrail or standard.",
      "Architecture and lifecycle recommendations respond to evidence and quality/risk needs rather than fashion; unnecessary service splits, tools or approval layers are rejected.",
      "Nexus, steward-common and tsa-test-core have explicit product/lifecycle ownership, provenance/source expectations, compatibility/support rules and exception paths.",
      "The engineering-health view leads to concrete prioritization decisions and does not rely on vanity metrics or unsupported technical-debt labels.",
      "The handbook and standards package is usable by another engineer and points to authoritative sources rather than duplicating them indiscriminately.",
      "The roadmap states outcomes, owners, evidence and trade-offs, and includes at least one justified decision to retain the current state where change would not improve Steward materially.",
      "The learner can defend the review under challenge, acknowledge uncertainty, escalate decisions outside delegated authority and update conclusions when better evidence appears.",
      "The final result demonstrates the Technical Steward principle: governance enables accountable engineering judgment and sustainable technology outcomes; it does not replace judgment with bureaucracy."
    ]
  })
];
