import type { Lesson } from "./lesson";

export const stewardReliabilityProgramDeepLessons: Lesson[] = [
  {
    id: "steward-reliability-program-milestone",
    title: "Milestone: Steward Reliability Program",
    activities: [
      {
        id: "steward-reliability-program-milestone-001",
        title: "Assemble the Reliability Evidence Baseline",
        estimatedMinutes: 150,
        content: {
          type: "practical",
          objective: "Assemble the evidence produced across the Reliability Engineer school into one coherent operational baseline for the full Steward enterprise platform.",
          scenario: "You are preparing Steward for a formal reliability review. The reviewers do not want screenshots of tools; they want evidence that application, data, messaging, identity, gateway, orchestration, GitOps and delivery dependencies form one defensible operating system. The required observability baseline includes Graylog for centralized logs, Prometheus for metrics and Grafana for operational metrics dashboards.",
          instructions: [
            "Collect the latest Steward Reliability Risk Map and identify which risks have evidence-backed controls versus unresolved exposure.",
            "Link the service questions from Observability to concrete Graylog searches/streams, Prometheus metrics and Grafana dashboards.",
            "Prove Graylog is receiving structured searchable logs from the Steward API and at least two additional runtime/platform sources, with correlation/context fields useful for investigation.",
            "Prove Prometheus is scraping Steward application metrics plus supporting targets and that core PromQL queries for traffic, error ratio and latency have been validated against known behavior.",
            "Prove Grafana is connected to Prometheus and exposes a Steward operational dashboard led by user-visible service symptoms rather than infrastructure vanity panels.",
            "Summarize the current SLIs, SLOs and error-budget policy, including where measurement remains imperfect.",
            "Map page-worthy alerts to their runbooks, owners and tested firing/resolution evidence.",
            "Include the latest performance/capacity baseline and identified bottleneck/saturation boundaries.",
            "Build an explicit dependency map covering PostgreSQL, Redis, RabbitMQ, Keycloak, Kong, OpenShift/Kubernetes, Argo CD, Nexus, Graylog, Prometheus and Grafana. For each dependency record user-visible consequence, health evidence, degradation expectations and recovery ownership.",
            "Separate synchronous authorization/integrity dependencies from asynchronous RabbitMQ work and cacheable Redis paths so failure policy matches business semantics.",
            "Include demonstrated backup/restore evidence and measured RPO/RTO outcomes for critical persistent state; do not treat pod recreation, snapshots or GitOps resync as database recovery.",
            "Include the incident exercise and reliability experiment evidence packs.",
            "Mark every reliability claim as demonstrated, partially demonstrated, assumed or unresolved."
          ],
          deliverables: [
            "Steward Reliability Evidence Index",
            "Graylog/Prometheus/Grafana implementation evidence",
            "Enterprise dependency and failure map",
            "Reliability claim-to-evidence matrix",
            "Updated reliability risk register",
            "Explicit list of assumptions and unresolved gaps"
          ],
          completionCriteria: [
            "Graylog, Prometheus and Grafana are all actually implemented and operational; design-only evidence is insufficient.",
            "Every major reliability claim points to concrete evidence or is explicitly marked as an assumption/gap.",
            "The learner can explain the distinct responsibilities of Graylog, Prometheus and Grafana.",
            "The evidence spans application, PostgreSQL, Redis, RabbitMQ, identity/gateway, orchestration/GitOps, Nexus and cloud infrastructure concerns.",
            "Tool screenshots alone are not accepted as proof without an explained reliability question and conclusion.",
            "A healthy pod, successful GitOps sync or green pipeline is never treated as sufficient proof of user-visible service health."
          ]
        }
      },
      {
        id: "steward-reliability-program-milestone-002",
        title: "Operate Steward Through a Reliability Review Scenario",
        estimatedMinutes: 210,
        content: {
          type: "practical",
          objective: "Demonstrate that Steward can be detected, diagnosed, protected and recovered across application and enterprise-platform boundaries using the required observability stack.",
          scenario: "Run one bounded end-to-end reliability scenario in learner-owned infrastructure. Choose a real dependency or platform risk—for example Redis degradation, RabbitMQ backlog/retry failure, Keycloak unavailability, Kong routing failure, pod/node loss, PostgreSQL saturation or Nexus unavailability—rather than random chaos.",
          instructions: [
            "Define the steady-state SLI/SLO expectation and experiment/incident boundary before starting.",
            "Capture the healthy baseline in Prometheus/Grafana and confirm Graylog is receiving the relevant correlated application/platform events.",
            "Introduce the controlled condition with explicit blast-radius, abort and recovery controls.",
            "Detect the user-visible symptom through Prometheus/Grafana rather than by relying on prior knowledge of the injected failure.",
            "Use Graylog to investigate the same time window and reconstruct event-level behavior using service/component, event and correlation/request context.",
            "Record which facts came from metrics and which required logs; do not claim the two signal types are interchangeable.",
            "Use the incident-management model: detect, triage, communicate, mitigate and maintain a timestamped decision record.",
            "Apply the intended resilience behavior instead of bypassing integrity, authentication, authorization or data-safety constraints for availability.",
            "Recover through the authoritative mechanism for the affected layer.",
            "Verify recovery from an external client and confirm Prometheus/Grafana signals and Graylog error/event patterns return to expected boundaries.",
            "Record any observability gap that slowed diagnosis and correct at least one missing field, metric, query or dashboard element."
          ],
          deliverables: [
            "End-to-end reliability scenario charter",
            "Prometheus/Grafana detection evidence",
            "Graylog investigation evidence and correlated event timeline",
            "Cross-layer diagnosis record",
            "SLO/error-budget impact analysis",
            "Mitigation and recovery evidence",
            "Observability gap and applied correction"
          ],
          completionCriteria: [
            "The scenario demonstrates a real reliability claim rather than merely causing a failure.",
            "Prometheus/Grafana detect and bound the service symptom.",
            "Graylog supplies event-level evidence that materially advances diagnosis.",
            "The learner can explain why the metrics and logging systems both remain necessary.",
            "Recovery is verified from the client perspective and in both metric and log evidence."
          ]
        }
      },
      {
        id: "steward-reliability-program-milestone-003",
        title: "Publish the Steward Reliability Review",
        estimatedMinutes: 165,
        content: {
          type: "practical",
          objective: "Produce a concise engineering review that states what reliability Steward can currently defend, where it cannot, and what should improve next.",
          scenario: "Write for a skeptical engineering audience deciding whether Steward is ready to be treated as an operated service. Avoid maturity theatre: a control is only as strong as the evidence showing it works under the conditions claimed.",
          instructions: [
            "Summarize Steward's reliability model and most important user/dependent-system expectations.",
            "Present SLO performance and error-budget implications using measured evidence.",
            "Describe observability coverage across Graylog logs, Prometheus metrics, Grafana dashboards and the selected tracing backend, including important blind spots.",
            "Explain the capability boundary: Graylog centralizes/searches logs; Prometheus stores/evaluates metrics; Grafana visualizes/explores metrics and guides first-pass diagnosis.",
            "Present capacity limits/headroom and likely next bottlenecks.",
            "Summarize resilience controls and the dependency failures they do and do not handle.",
            "State demonstrated RPO/RTO capability for critical state and distinguish data recovery from workload reconciliation.",
            "Summarize incident and reliability-experiment findings, including failed or surprising hypotheses.",
            "Explain operational ownership for the major active platform dependencies, including Graylog, Prometheus and Grafana.",
            "Rank unresolved reliability risks by impact, likelihood/evidence and intervention urgency.",
            "Recommend a small prioritized improvement plan with explicit closure evidence for each item.",
            "Include a short section named 'What We Cannot Claim Yet' to prevent unsupported reliability promises."
          ],
          deliverables: [
            "Steward Reliability Review",
            "Observability architecture and ownership section",
            "Prioritized reliability improvement backlog",
            "Platform/dependency ownership map",
            "What We Cannot Claim Yet section",
            "Milestone evidence package"
          ],
          completionCriteria: [
            "The review distinguishes targets, observations and assumptions.",
            "Graylog/Prometheus/Grafana are evaluated by the reliability questions they answer rather than by installation status.",
            "Unresolved risk is not hidden to make the system appear production-ready.",
            "Recommendations follow from evidence and have verifiable completion conditions.",
            "The review does not assume enterprise products are reliable simply because they are industry-standard products."
          ]
        }
      },
      {
        id: "steward-reliability-program-milestone-004",
        title: "Defend the Reliability Posture",
        estimatedMinutes: 100,
        content: {
          type: "practical",
          objective: "Defend Steward's reliability posture through evidence-based technical questioning.",
          scenario: "Present the reliability review to a skeptical panel acting as SRE, platform, QA, security and architecture stakeholders. The panel may challenge SLO choices, alert noise, capacity assumptions, retry behavior, backup claims, observability architecture and enterprise dependency ownership.",
          instructions: [
            "Prepare a 10–15 minute reliability narrative: user expectations, evidence, major risks and key trade-offs.",
            "For each challenged claim, point to the underlying evidence or explicitly acknowledge that it remains unproven.",
            "Defend why Graylog, Prometheus and Grafana are three required components rather than redundant tools.",
            "Explain why adding Loki or a parallel ELK/OpenSearch logging stack would be redundant unless a bounded migration scenario justified temporary coexistence.",
            "Explain at least one trade-off where increasing reliability would add cost, complexity or delivery friction.",
            "Explain one failure mode that remains intentionally accepted and why.",
            "Defend the reliability boundaries of the active Steward dependencies without pretending every dependency deserves high availability in the learner environment.",
            "Explain one case where the simpler VPS architecture would have fewer failure modes and why the current enterprise-platform learning objective still justified the richer topology.",
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
            "The learner can explain why each major control and platform dependency exists and what evidence supports it.",
            "The learner can defend Graylog, Prometheus and Grafana as distinct observability responsibilities.",
            "The learner distinguishes confidence from certainty and acknowledges unsupported claims.",
            "The final backlog reflects valid review findings rather than treating the milestone as a pass/fail ceremony."
          ]
        }
      }
    ]
  }
];
