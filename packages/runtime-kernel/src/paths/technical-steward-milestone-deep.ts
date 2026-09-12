import type { Lesson } from "./lesson";

export const technicalStewardMilestoneDeepLessons: Lesson[] = [
  {
    id: "technical-stewardship-review-milestone-technical-stewardship-review",
    title: "Milestone: Technical Stewardship Review",
    activities: [{
      id: "technical-stewardship-review-milestone-technical-stewardship-review-001",
      title: "Milestone: Technical Stewardship Review",
      estimatedMinutes: 600,
      content: {
        type: "practical",
        objective: "Conduct and defend an evidence-based stewardship review of the complete Steward ecosystem, integrating technical leadership, governance, technology risk, controls, architecture/security/data/change governance, dependency lifecycle, engineering health and durable standards into a coherent improvement decision.",
        scenario: "Steward is an organization-owned service spanning application code, PostgreSQL, Redis, RabbitMQ, OpenTofu-managed infrastructure, OpenShift/Kubernetes, Argo CD, Kong, Keycloak, Jenkins, Nexus, steward-common, tsa-test-core, secret-management boundaries, security controls, observability/reliability practices and operational ownership. Leadership asks for a stewardship review before the next planning cycle. Present what is demonstrably healthy, what remains uncertain, which risks require treatment or acceptance, which controls actually operate, where governance helps or creates friction, and what should change next. Unsupported maturity claims are not acceptable.",
        instructions: [
          "Define scope, stakeholders, decision rights and evidence cutoff; state what is outside scope and which organizational assumptions are supplied rather than invented.",
          "Build an evidence index reusing authoritative artifacts from the full TSA journey: architecture decisions, delivery evidence, OpenTofu and platform state, QA/test results, security assessments, SLO/reliability evidence, incidents, risk register, control tests, service/change records, dependency/Nexus lifecycle records, engineering-health data and handbook standards.",
          "Refresh the technology-risk register from current evidence, distinguishing issues from risks, inherent from residual exposure, and demonstrated controls from paper controls; identify acceptance authority and review triggers.",
          "Select representative controls across delivery/change, security/data, recoverability/reliability, access/identity, dependencies/supply chain, cloud/platform control planes and operational ownership; test design and operating effectiveness and record findings.",
          "Review architecture, security/data and change/service governance decisions; identify useful guardrails as well as stale rules, repeated exceptions and unnecessary approval friction. Preserve retain-current-state and simplify-current-state as valid outcomes when evidence supports them.",
          "Review OpenTofu, OpenShift/Kubernetes, Argo CD, Kong, Keycloak, Jenkins, Nexus, Redis, RabbitMQ, steward-common and tsa-test-core for accountable ownership, approved sources, lifecycle/version policy, access boundaries, provenance, support expectations, continuity/recovery concerns and exception paths.",
          "Check that authoritative responsibilities remain coherent: Jenkins builds and publishes, Nexus stores approved artifacts, Argo CD reconciles GitOps-managed environments, OpenTofu manages cloud infrastructure, OpenShift/Kubernetes manages workload state, Keycloak authenticates, Kong controls the public edge, and Steward retains domain authorization and business invariants.",
          "Challenge platform permanence. For every expensive or high-complexity enterprise layer, record the capability it currently enables, its operating cost/risk and the evidence or trigger that would justify simplifying, replacing or retaining it.",
          "Produce an engineering-health view linking technical debt, KPIs/KRIs, operational evidence and delivery constraints to actual decisions; reject vanity metrics and unsupported debt labels.",
          "Audit the engineering handbook as a working governance product and verify engineers can find applicable standards, runbooks/playbooks, decisions, review aids, owners and exception paths.",
          "Create a prioritized roadmap where each material action states problem/risk, expected outcome, owner, evidence of completion, sequencing/dependencies, trade-offs and whether it reduces risk, improves capability or removes governance friction.",
          "Facilitate a mock stewardship review with at least two stakeholder perspectives, present evidence, invite challenge, separate facts from assumptions and record decisions, dissent, acceptance/escalation and follow-up ownership.",
          "Close the loop by updating authoritative artifacts rather than creating a disconnected shelf report; record what changed because of the review."
        ],
        deliverables: [
          "Review scope, stakeholder/decision-rights map and evidence index",
          "Refreshed technology-risk register with residual-risk decisions",
          "Control assurance set with design/operating-effectiveness evidence and findings",
          "Architecture, security/data and change/service governance decision review",
          "Enterprise platform ownership/lifecycle review covering OpenTofu, OpenShift/Kubernetes, Argo CD, Kong, Keycloak, Jenkins, Nexus, Redis and RabbitMQ",
          "Shared dependency lifecycle review for steward-common and tsa-test-core",
          "Engineering-health and technical-debt decision view",
          "Engineering handbook/standards usability and lifecycle review",
          "Exception/waiver and risk-acceptance view",
          "Platform retain/simplify/replace decision set",
          "Prioritized improvement roadmap",
          "Technical Stewardship Review decision record capturing challenge, dissent, decisions and follow-up",
          "Updated authoritative Steward artifacts"
        ],
        completionCriteria: [
          "Maturity, risk, control-effectiveness and engineering-health claims are traceable to current evidence; unknowns and assumptions are explicit.",
          "Risks, issues, vulnerabilities, controls, findings, debt and exceptions remain distinct concepts.",
          "At least one material risk receives a defensible treatment, acceptance, escalation or monitoring decision with clear authority and follow-up.",
          "Control effectiveness is demonstrated through operating evidence rather than the existence of policies, tools or configurations.",
          "Governance recommendations are proportionate and remove unnecessary ceremony as readily as they add justified guardrails.",
          "Architecture and lifecycle recommendations respond to evidence rather than fashion.",
          "Enterprise platform responsibilities have named owners, lifecycle/support expectations, recovery assumptions and exception paths.",
          "The learner can justify keeping or simplifying Kubernetes/OpenShift, Argo CD, Kong, Keycloak and other platform layers instead of treating adoption as irreversible maturity.",
          "Nexus, steward-common and tsa-test-core have explicit ownership, provenance/source expectations, compatibility/support rules and exception paths.",
          "Engineering-health evidence leads to concrete prioritization decisions without vanity metrics.",
          "The handbook is usable by another engineer and points to authoritative sources rather than duplicating them indiscriminately.",
          "The roadmap states outcomes, owners, evidence and trade-offs and includes at least one justified retain-current-state or simplify-current-state decision.",
          "The learner can defend the review under challenge, acknowledge uncertainty and escalate decisions outside delegated authority.",
          "The final result demonstrates that governance enables accountable engineering judgment rather than replacing it with bureaucracy."
        ],
      },
    }],
  },
];
