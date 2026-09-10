import type { Lesson } from "./lesson";

export const stewardReliabilityProgramDeepLessons: Lesson[] = [
  {
    id: "steward-reliability-program-milestone",
    title: "Milestone: Steward Reliability Program",
    activities: [
      {
        id: "steward-reliability-program-milestone-001",
        title: "Assemble the Reliability Evidence Baseline",
        estimatedMinutes: 120,
        content: {
          type: "practical",
          objective: "Assemble the evidence produced across the Reliability Engineer school into one coherent operational baseline for Steward.",
          scenario: "You are preparing Steward for a formal reliability review. The reviewers do not want screenshots of tools; they want evidence that the service's reliability claims, operating controls and recovery procedures form one defensible system.",
          instructions: [
            "Collect the latest Steward Reliability Risk Map and identify which risks have evidence-backed controls versus unresolved exposure.",
            "Link the service questions from Observability to concrete logging, metrics and dashboards.",
            "Summarize the current SLIs, SLOs and error-budget policy, including where measurement remains imperfect.",
            "Map page-worthy alerts to their runbooks, owners and tested firing/resolution evidence.",
            "Include the latest performance/capacity baseline and identified bottleneck/saturation boundaries.",
            "Include resilience decisions for representative dependency paths, including timeout/retry/idempotency/degradation semantics.",
            "Include demonstrated backup/restore evidence and measured RPO/RTO outcomes.",
            "Include the incident exercise and reliability experiment evidence packs.",
            "Treat Nexus/internal artifact services as part of the reliability boundary: availability, storage growth, package resolution/publication, recovery and operational ownership must all be represented.",
            "Mark every reliability claim as demonstrated, partially demonstrated, assumed or unresolved."
          ],
          deliverables: [
            "Steward Reliability Evidence Index",
            "Reliability claim-to-evidence matrix",
            "Updated reliability risk register",
            "Explicit list of assumptions and unresolved gaps"
          ],
          completionCriteria: [
            "Every major reliability claim points to concrete evidence or is explicitly marked as an assumption/gap.",
            "The evidence spans application, database, infrastructure, delivery and Nexus/internal dependency concerns.",
            "Tool screenshots alone are not accepted as proof without an explained reliability question and conclusion."
          ]
        }
      },
      {
        id: "steward-reliability-program-milestone-002",
        title: "Operate Steward Through a Reliability Review Scenario",
        estimatedMinutes: 180,
        content: {
          type: "practical",
          objective: "Demonstrate that Steward can be observed, diagnosed, protected and recovered using the operating model built across the school.",
          scenario: "Run one bounded end-to-end reliability scenario in learner-owned infrastructure. The scenario should exercise multiple capabilities without becoming random chaos—for example dependency degradation that affects SLOs, triggers an actionable alert, requires diagnosis/mitigation and ends with verified recovery.",
          instructions: [
            "Define the steady-state SLI/SLO expectation and experiment/incident boundary before starting.",
            "Select a scenario grounded in the Reliability Risk Map rather than inventing an arbitrary failure.",
            "Capture healthy baseline telemetry and confirm the relevant alert/runbook path is ready.",
            "Introduce the controlled condition with explicit blast-radius, abort and recovery controls.",
            "Observe user-visible symptoms, logs, Prometheus/Grafana signals, dependency attempts, saturation and error-budget impact as relevant.",
            "Use the incident-management model: detect, triage, communicate, mitigate and maintain a timestamped decision record.",
            "Apply the intended resilience behavior instead of bypassing integrity/security constraints for availability.",
            "Recover the system and verify user-visible service, dependency state, data integrity, cleared alerts/backlogs and return to the expected baseline.",
            "If Nexus is not the injected dependency, still verify its operational state as a required delivery/recovery dependency and note any coupling discovered."
          ],
          deliverables: [
            "End-to-end reliability scenario charter",
            "Timeline and incident/experiment evidence",
            "SLO/error-budget impact analysis",
            "Mitigation and recovery evidence",
            "Observed gaps in alerts, runbooks, telemetry or resilience controls"
          ],
          completionCriteria: [
            "The scenario demonstrates a real reliability claim rather than merely causing a failure.",
            "Detection, response and recovery are evidenced end-to-end.",
            "The learner can explain what bounded the failure and what could still cascade or fail next."
          ]
        }
      },
      {
        id: "steward-reliability-program-milestone-003",
        title: "Publish the Steward Reliability Review",
        estimatedMinutes: 150,
        content: {
          type: "practical",
          objective: "Produce a concise engineering review that states what reliability Steward can currently defend, where it cannot, and what should improve next.",
          scenario: "Write for a skeptical engineering audience deciding whether Steward is ready to be treated as an operated service. Avoid maturity theatre: a control is only as strong as the evidence showing it works under the conditions claimed.",
          instructions: [
            "Summarize Steward's reliability model and most important user/dependent-system expectations.",
            "Present SLO performance and error-budget implications using measured evidence.",
            "Describe observability coverage and important diagnostic blind spots.",
            "Present capacity limits/headroom and likely next bottlenecks.",
            "Summarize resilience controls and the dependency failures they do and do not handle.",
            "State demonstrated RPO/RTO capability for critical state and Nexus/internal artifact recovery.",
            "Summarize incident and reliability-experiment findings, including failed or surprising hypotheses.",
            "Rank unresolved reliability risks by impact, likelihood/evidence and intervention urgency.",
            "Recommend a small prioritized improvement plan with explicit closure evidence for each item.",
            "Include a short section named 'What We Cannot Claim Yet' to prevent unsupported reliability promises."
          ],
          deliverables: [
            "Steward Reliability Review",
            "Prioritized reliability improvement backlog",
            "What We Cannot Claim Yet section",
            "Milestone evidence package"
          ],
          completionCriteria: [
            "The review distinguishes targets, observations and assumptions.",
            "Unresolved risk is not hidden to make the system appear production-ready.",
            "Recommendations follow from evidence and have verifiable completion conditions."
          ]
        }
      },
      {
        id: "steward-reliability-program-milestone-004",
        title: "Defend the Reliability Posture",
        estimatedMinutes: 90,
        content: {
          type: "practical",
          objective: "Defend Steward's reliability posture through evidence-based technical questioning.",
          scenario: "Present the reliability review to a skeptical panel acting as SRE, platform, QA, security and architecture stakeholders. The panel may challenge SLO choices, alert noise, capacity assumptions, retry behavior, backup claims, Nexus dependence, incident decisions and experiment safety.",
          instructions: [
            "Prepare a 10–15 minute reliability narrative: user expectations, evidence, major risks and key trade-offs.",
            "For each challenged claim, point to the underlying evidence or explicitly acknowledge that it remains unproven.",
            "Explain at least one trade-off where increasing reliability would add cost, complexity or delivery friction.",
            "Explain one failure mode that remains intentionally accepted and why.",
            "Defend Nexus/internal artifact availability and recovery as an engineering dependency, not merely a tooling concern.",
            "When the panel exposes a valid gap, record it instead of arguing beyond the evidence.",
            "After the review, revise the reliability review and backlog based on justified feedback."
          ],
          deliverables: [
            "Reliability defense presentation or review notes",
            "Panel question-and-evidence log",
            "Revised Steward Reliability Review",
            "Updated prioritized reliability backlog"
          ],
          completionCriteria: [
            "The learner can explain why each major control exists and what evidence supports it.",
            "The learner distinguishes confidence from certainty and acknowledges unsupported claims.",
            "The final backlog reflects valid review findings rather than treating the milestone as a pass/fail ceremony."
          ]
        }
      }
    ]
  }
];
