import type { Lesson } from "./lesson";

function gate(id: string, title: string, objective: string, instructions: string[], deliverables: string[], completionCriteria: string[], estimatedMinutes = 120): Lesson {
  return {
    id: `technical-stewardship-review-${id}`,
    title,
    activities: [{
      id: `technical-stewardship-review-${id}-001`,
      title,
      estimatedMinutes,
      content: {
        type: "practical",
        objective,
        scenario: "Reuse the authoritative evidence and governance artifacts built throughout Technical Steward. Refresh evidence only where it is stale, material to a decision or needed to test operating effectiveness. The milestone is synthesis and challenge, not a second implementation of the school.",
        instructions,
        deliverables,
        completionCriteria,
      },
    }],
  };
}

export const technicalStewardMilestoneDeepLessons: Lesson[] = [
  {
    id: "technical-stewardship-review-brief",
    title: "Milestone Brief: Technical Stewardship Review",
    activities: [{
      id: "technical-stewardship-review-brief-001",
      title: "Prepare the Stewardship Review",
      estimatedMinutes: 45,
      content: {
        type: "practical",
        objective: "Define the review boundary and assemble the evidence needed to govern the actual accumulated Steward ecosystem.",
        scenario: "Steward has evolved from a Django/PostgreSQL service into an organization-owned engineering platform. Technologies introduced for learning are not automatically permanent. The review must distinguish what is active, temporary, retired or merely comparative before making governance decisions.",
        instructions: [
          "Define scope, stakeholders, decision rights, evidence cutoff and explicit exclusions.",
          "Build an evidence index from product, architecture, migration, delivery, platform, QA, security, reliability, incident, risk, control, dependency, engineering-health and handbook artifacts.",
          "Mark stale or missing evidence rather than recreating every historical artifact.",
          "State which decisions are delegated to the review and which require escalation or acceptance authority."
        ],
        deliverables: ["Review scope", "Stakeholder/decision-rights map", "Evidence index", "Evidence-gap list"],
        completionCriteria: ["The review boundary is explicit.", "Existing evidence is reused deliberately.", "Unknowns and decision-authority limits are visible before conclusions are made."],
      },
    }],
  },
  gate(
    "gate-1-stack-risk",
    "Gate 1: Actual Stack and Technology Risk",
    "Establish what Steward actually runs today and which material technology risks require stewardship decisions.",
    [
      "Create an actual-stack inventory and classify each technology as active primary implementation, temporary migration component, comparison-only technology, retired component or proposed future option.",
      "For every active primary platform component, record the capability it owns, accountable owner, approved source/provenance, lifecycle/version policy, access boundary, support expectation, recovery concern and exception path.",
      "Refresh the technology-risk register from current evidence, distinguishing issues from risks, inherent from residual exposure and demonstrated controls from paper controls.",
      "Identify acceptance authority and review triggers for material residual risks.",
      "Challenge platform permanence: record evidence supporting retain, simplify, migrate, replace or remove for expensive/high-complexity layers."
    ],
    ["Actual-stack inventory", "Active platform ownership/lifecycle view", "Refreshed technology-risk register", "Initial retain/simplify/migrate/replace/remove decisions"],
    ["Historical curriculum exposure is not treated as active implementation.", "Active components have bounded ownership and lifecycle expectations.", "At least one material risk has an explicit treatment/acceptance/escalation path.", "Technology decisions respond to evidence rather than fashion or permanence."]
  ),
  gate(
    "gate-2-controls-governance",
    "Gate 2: Controls and Governance Effectiveness",
    "Test whether Steward governance and controls operate in practice without creating unnecessary ceremony.",
    [
      "Select representative controls across delivery/change, security/data, recoverability/reliability, access/identity, dependencies/supply chain, cloud/platform control planes and operational ownership.",
      "Test both control design and operating effectiveness using current evidence.",
      "Review architecture, security/data and change/service governance decisions for useful guardrails, stale rules, repeated exceptions and unnecessary approval friction.",
      "Distinguish risks, issues, vulnerabilities, controls, findings, technical debt and exceptions in the review record.",
      "Update or remove governance rules whose cost is no longer justified by the risk they address."
    ],
    ["Control assurance set", "Governance effectiveness review", "Exception/waiver and risk-acceptance view", "Guardrail simplification/update decisions"],
    ["Control effectiveness is demonstrated rather than inferred from tool presence.", "Governance can remove ceremony as readily as add controls.", "Exceptions have explicit authority and expiry/review conditions.", "Different governance/risk concepts are not collapsed into one generic findings list."]
  ),
  gate(
    "gate-3-capability-lifecycle",
    "Gate 3: Capability Ownership and Migration Closure",
    "Prove that the accumulated enterprise platform has one defensible owner for each capability and that learning migrations did not leave permanent duplication.",
    [
      "Check responsibility boundaries: GitLab CI builds/evidences, Nexus stores approved artifacts, Argo CD reconciles declared workload state, OpenTofu manages infrastructure, orchestration manages workload state, identity authenticates, edge infrastructure handles edge policy and Steward retains domain authorization/business invariants.",
      "Detect redundant capability ownership. If two active technologies substantially solve the same capability, prove the separate requirement for both or create a consolidation/migration recommendation.",
      "Review completed migration exercises and verify the superseded technology was decommissioned or has an explicit remaining responsibility.",
      "Confirm temporary coexistence has an owner, end condition and rollback/cutover evidence rather than silently becoming permanent duplication.",
      "Update authoritative lifecycle records with the resulting retain, simplify, migrate, replace or remove decisions."
    ],
    ["Capability-authority matrix", "Redundant-capability review", "Migration/decommission review", "Updated lifecycle decisions"],
    ["No redundant pair is justified merely by curriculum exposure.", "Migration end states are explicit.", "Active responsibilities do not create competing authorities.", "Lifecycle decisions are reflected in authoritative records."]
  ),
  gate(
    "gate-4-health-handbook-roadmap",
    "Gate 4: Engineering Health, Standards and Roadmap",
    "Turn technical debt, engineering-health evidence and standards into a prioritized improvement plan another engineer can execute.",
    [
      "Produce an engineering-health view linking technical debt, KPIs/KRIs, operational evidence and delivery constraints to actual decisions; reject vanity metrics.",
      "Audit the engineering handbook as a working governance product and verify engineers can find applicable standards, runbooks/playbooks, decisions, owners and exception paths.",
      "Create a prioritized roadmap where each material action states problem/risk, expected outcome, owner, evidence of completion, sequencing/dependencies and trade-offs.",
      "Include at least one justified retain-current-state, simplify-current-state or remove-current-state decision.",
      "Update handbook or authoritative standards where the review discovered stale guidance instead of creating a disconnected shelf report."
    ],
    ["Engineering-health and technical-debt decision view", "Handbook/standards usability review", "Prioritized improvement roadmap", "Updated authoritative Steward artifacts"],
    ["Engineering-health evidence changes prioritization rather than becoming reporting theatre.", "The handbook points to authoritative sources instead of duplicating them indiscriminately.", "Roadmap items have outcomes, owners, closure evidence and trade-offs.", "Review findings close back into authoritative artifacts."]
  ),
  gate(
    "gate-5-review-defence",
    "Gate 5: Stewardship Review and Defence",
    "Facilitate and defend the stewardship decisions with stakeholder challenge, uncertainty and escalation handled explicitly.",
    [
      "Facilitate a mock stewardship review with at least two stakeholder perspectives.",
      "Present the stack/risk, control, capability/lifecycle and engineering-health conclusions using their evidence.",
      "Invite challenge and separate facts, assumptions, recommendations, dissent and decisions.",
      "Record acceptance/escalation authority and follow-up ownership for decisions outside delegated authority.",
      "When a challenge exposes a real gap, update the roadmap or authoritative artifact rather than arguing beyond the evidence."
    ],
    ["Technical Stewardship Review decision record", "Stakeholder challenge/dissent log", "Acceptance/escalation record", "Final roadmap and authoritative-artifact updates"],
    ["The learner can defend decisions while acknowledging uncertainty.", "Valid dissent and challenges remain visible.", "Decisions outside delegated authority are escalated rather than assumed.", "The final result demonstrates governance that enables accountable engineering judgment rather than preserving technology for its own sake."],
    90
  ),
  {
    id: "technical-stewardship-review-exit",
    title: "Technical Steward Exit Reflection",
    activities: [{
      id: "technical-stewardship-review-exit-001",
      title: "Defend What Steward Should Keep",
      estimatedMinutes: 30,
      content: {
        type: "reflection",
        prompt: "If leadership gave you budget for only the capabilities Steward can defend with evidence, what would you retain, simplify, migrate, replace or remove? Explain the authority boundary for each retained platform layer, one material risk and its decision authority, one control whose operating effectiveness you proved, one governance rule you simplified or rejected, and the highest-priority roadmap item you would fund next.",
        minimumCharacters: 500,
      },
    }],
  },
];
