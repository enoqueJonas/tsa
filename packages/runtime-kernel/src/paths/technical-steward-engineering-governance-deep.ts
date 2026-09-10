import type { Lesson } from "./lesson";

function readingLesson(id: string, title: string, body: string, practice: string[]): Lesson {
  return {
    id,
    title,
    activities: [
      {
        id: `${id}-reading`,
        title,
        estimatedMinutes: 55,
        content: { type: "reading", body },
      },
      {
        id: `${id}-practice`,
        title: `Practice: ${title}`,
        estimatedMinutes: 60,
        content: {
          type: "practical",
          objective: `Apply ${title} to the Steward ecosystem.`,
          scenario: "Use Steward's existing architecture, delivery, QA, security, reliability, dependency and operational evidence. Governance exists to make decision rights, accountability, evidence and exceptions explicit without turning ordinary engineering work into ceremony.",
          instructions: practice,
          deliverables: ["Governance decision or artifact", "Evidence and rationale", "Owner and review/follow-up record"],
          completionCriteria: ["Decision rights and accountability are explicit.", "The mechanism is proportionate to the risk and decision being governed.", "The artifact can be used by another engineer without relying on oral context."],
        },
      },
    ],
  };
}

export const engineeringGovernanceDeepLessons: Lesson[] = [
  readingLesson("engineering-governance-governance-vs-management", "Governance vs Management", "Governance sets direction, decision rights, boundaries, accountability and oversight; management organizes people and work to execute within those boundaries. Confusing them creates either unmanaged risk or approval-heavy bureaucracy. In Steward, governance should answer what must be true, who may decide, what evidence is required and when oversight is needed, while implementation teams retain room to choose how to deliver within those constraints.", ["Pick three existing Steward decisions and classify each as governance, management or engineering execution.", "Identify one place where approval would add little value and one where independent oversight is justified.", "Rewrite an overly procedural rule as a governance outcome plus delegated implementation freedom."]),
  readingLesson("engineering-governance-decision-rights", "Decision Rights", "Good governance makes decision authority explicit before conflict occurs. Decision rights distinguish who proposes, who decides, who must be consulted, who can block for defined risk reasons and who owns escalation. They should follow risk, expertise and accountability rather than title alone. A low-risk library patch should not require the same authority path as a production data-retention exception or a change to a critical service boundary.", ["Map decision rights for a Steward production release, architecture exception, security exception and internal-package breaking change.", "Separate decision owner, contributors, required reviewers and escalation path.", "Identify one decision currently vulnerable to ambiguous ownership."]),
  readingLesson("engineering-governance-accountability", "Accountability", "Accountability means a named owner remains answerable for an outcome, including follow-through after a decision. It is not the same as doing every task personally. Shared responsibility can exist, but diffuse accountability creates decisions that nobody closes. Steward governance should make ownership visible for services, risks, standards, controls, exceptions, packages and lifecycle decisions, with explicit handoff when ownership changes.", ["Create an accountability map for Steward service ownership, Nexus, steward-common and tsa-test-core.", "For one current risk, distinguish accountable owner from contributors and operators.", "Define what evidence shows that ownership has actually been exercised."]),
  readingLesson("engineering-governance-policy-standard-procedure-guideline", "Policies, Standards, Procedures and Guidelines", "These artifacts serve different purposes. A policy states mandatory intent and organizational expectation. A standard defines mandatory measurable rules that support policy. A procedure describes required execution steps where consistency matters. A guideline recommends practices while allowing justified variation. Treating every recommendation as policy creates unnecessary exceptions; treating mandatory controls as suggestions creates governance gaps. Steward artifacts should use the lightest form that still expresses the needed obligation.", ["Classify existing Steward rules as policy, standard, procedure or guideline.", "Convert one vague requirement into the correct artifact type with testable language.", "Identify implementation details that should be removed from policy-level text."]),
  readingLesson("engineering-governance-exceptions", "Exceptions", "A mature governance model expects legitimate exceptions. An exception is a time-bounded, owned departure from a requirement based on documented context and risk; it is not an undocumented bypass. A useful record states the rule, rationale, affected scope, risk, compensating controls, approver, expiry or review date and exit plan. Permanent exceptions should trigger reconsideration of whether the governing rule is still valid.", ["Draft a Steward exception for a plausible temporary deviation from a technical standard.", "Define compensating controls and an expiry trigger.", "Describe when repeated exceptions should cause the standard itself to be reviewed."]),
  readingLesson("engineering-governance-evidence-review-cadence", "Evidence and Review Cadence", "Governance is credible only when operating evidence shows that important expectations are being followed and remain useful. Evidence can come from CI results, deployment records, test reports, security scans, incident data, SLOs, ADRs, package metadata or review records. Cadence should follow volatility and risk: some controls need per-change evidence, some periodic review, and some event-driven review after incidents, major architecture changes or end-of-life notices.", ["Choose five Steward governance expectations and identify the strongest existing operating evidence for each.", "Assign per-change, periodic or event-driven review cadence with rationale.", "Remove one proposed review meeting by replacing it with durable automated or repository evidence where appropriate."]),
  readingLesson("engineering-governance-without-bureaucracy", "Governance Without Bureaucracy", "Effective governance minimizes the cost of making the right decision. Prefer paved roads, automation, defaults, templates, repository-visible evidence and risk-tiered review over central approval for everything. Escalate only when risk, uncertainty, policy conflict or impact crosses a meaningful threshold. Governance should make safe work faster: for example, an approved dependency source, reusable CI control or architecture fitness function can enforce expectations without adding a meeting.", ["Identify three Steward governance needs that can be enforced through automation or defaults rather than manual approval.", "Define a risk-tiered review model for low, medium and high-impact technical changes.", "Document one governance mechanism that should be removed if its evidence value is lower than its operational burden."]),
  {
    id: "engineering-governance-lab-design-steward-model",
    title: "Lab: Design the Steward Engineering Governance Model",
    activities: [
      {
        id: "engineering-governance-lab-design-steward-model-001",
        title: "Map Steward Decisions and Accountability",
        estimatedMinutes: 105,
        content: { type: "practical", objective: "Create a decision-rights and accountability model for the mature Steward ecosystem.", scenario: "Steward now spans application code, PostgreSQL, CI/CD, cloud/VPS infrastructure, Nexus, steward-common, tsa-test-core, test automation, security controls and reliability practices. The organization needs clear ownership without routing every engineering decision through a central board.", instructions: ["Inventory recurring and high-impact decisions across architecture, delivery, security, reliability, data, dependencies and service operation.", "For each, identify accountable owner, decision authority, required consultation/review and escalation conditions.", "Classify decisions by risk/impact and specify which can be delegated by default.", "Identify ambiguous or overlapping ownership and resolve it."], deliverables: ["Decision-rights matrix", "Accountability map", "Risk-tier model", "Escalation rules"], completionCriteria: ["Authority follows risk and expertise rather than title alone.", "Low-risk engineering work remains delegated.", "Critical decisions have explicit accountable owners and escalation paths."] },
      },
      {
        id: "engineering-governance-lab-design-steward-model-002",
        title: "Design the Governance Artifact and Exception System",
        estimatedMinutes: 120,
        content: { type: "practical", objective: "Define a usable hierarchy of governance artifacts and a proportionate exception mechanism.", scenario: "The goal is a governance system engineers can apply consistently without turning guidance into accidental policy or creating undocumented bypasses.", instructions: ["Define when Steward uses policy, standard, procedure, guideline, ADR, checklist and runbook artifacts.", "Select several real Steward requirements and express each using the correct artifact type.", "Design the exception record: rule, scope, rationale, risk, compensating controls, approver, expiry/review date and exit plan.", "Define when repeated exceptions trigger review of the underlying rule."], deliverables: ["Governance artifact hierarchy", "Representative Steward governance artifacts", "Exception/waiver template", "Rule-review triggers"], completionCriteria: ["Mandatory and advisory language is distinguishable.", "Exceptions are owned and time-bounded.", "The model avoids creating policy for issues that only need guidance or local decisions."] },
      },
      {
        id: "engineering-governance-lab-design-steward-model-003",
        title: "Define Evidence, Cadence and Lightweight Oversight",
        estimatedMinutes: 105,
        content: { type: "practical", objective: "Make Steward governance evidence-based and cheap enough to operate continuously.", scenario: "Existing CI, QA, security, reliability and repository evidence should be reused before inventing manual governance ceremonies.", instructions: ["Map each important governance expectation to existing or required operating evidence.", "Set per-change, periodic or event-driven review cadence based on risk and volatility.", "Identify controls that can be implemented as automation, defaults, templates or fitness functions.", "Define a minimal governance review that surfaces exceptions, overdue risks, failed controls and decisions needing escalation.", "Record indicators that would show governance itself has become a bottleneck."], deliverables: ["Evidence-to-expectation matrix", "Review cadence", "Automated governance opportunities", "Lightweight oversight model", "Governance health indicators"], completionCriteria: ["Evidence is reusable and durable rather than meeting-only.", "Review cadence is justified by risk.", "Manual approval is reserved for decisions where independent oversight adds material value.", "The governance model includes a way to detect and reduce its own bureaucracy."] },
      },
    ],
  },
];
