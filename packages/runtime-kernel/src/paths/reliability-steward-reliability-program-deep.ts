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
          scenario: "You are preparing Steward for a formal reliability review. The reviewers do not want screenshots of tools; they want evidence that application, data, messaging, identity, gateway, orchestration, GitOps and delivery dependencies form one defensible operating system.",
          instructions: [
            "Collect the latest Steward Reliability Risk Map and identify which risks have evidence-backed controls versus unresolved exposure.",
            "Link the service questions from Observability to concrete logging, Prometheus metrics and Grafana dashboards.",
            "Summarize the current SLIs, SLOs and error-budget policy, including where measurement remains imperfect.",
            "Map page-worthy alerts to their runbooks, owners and tested firing/resolution evidence.",
            "Include the latest performance/capacity baseline and identified bottleneck/saturation boundaries.",
            "Build an explicit dependency map covering PostgreSQL, Redis, RabbitMQ, Keycloak, Kong, OpenShift/Kubernetes, Argo CD and Nexus. For each dependency record user-visible consequence, health evidence, timeout/retry/degradation expectations and recovery ownership.",
            "Separate synchronous authorization/integrity dependencies from asynchronous RabbitMQ work and cacheable Redis paths so failure policy matches business semantics.",
            "Include demonstrated backup/restore evidence and measured RPO/RTO outcomes for critical persistent state; do not treat pod recreation, snapshots or GitOps resync as database recovery.",
            "Include the incident exercise and reliability experiment evidence packs.",
            "Treat Nexus/internal artifact services and Argo CD/environment Git as recovery and delivery dependencies: availability, storage/history retention, package/image resolution, reconciliation and operational ownership must be represented.",
            "Mark every reliability claim as demonstrated, partially demonstrated, assumed or unresolved."
          ],
          deliverables: [
            "Steward Reliability Evidence Index",
            "Enterprise dependency and failure map",
            "Reliability claim-to-evidence matrix",
            "Updated reliability risk register",
            "Explicit list of assumptions and unresolved gaps"
          ],
          completionCriteria: [
            "Every major reliability claim points to concrete evidence or is explicitly marked as an assumption/gap.",
            "The evidence spans application, PostgreSQL, Redis, RabbitMQ, Keycloak, Kong, OpenShift/Kubernetes, Argo CD, Nexus and cloud infrastructure concerns.",
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
          objective: "Demonstrate that Steward can be observed, diagnosed, protected and recovered across application and enterprise-platform boundaries.",
          scenario: "Run one bounded end-to-end reliability scenario in learner-owned infrastructure. Choose a real dependency or platform risk—for example Redis degradation, RabbitMQ backlog/retry failure, Keycloak unavailability, Kong routing failure, pod/node loss, Argo CD drift, PostgreSQL saturation or Nexus unavailability—rather than random chaos.",
          instructions: [
            "Define the steady-state SLI/SLO expectation and experiment/incident boundary before starting.",
            "Select a scenario grounded in the Reliability Risk Map and state why the selected dependency matters to a user or operator.",
            "Capture healthy baseline telemetry across the relevant application, dependency and platform layers and confirm the alert/runbook path is ready.",
            "Introduce the controlled condition with explicit blast-radius, abort and recovery controls.",
            "Observe user-visible symptoms, logs, Prometheus/Grafana signals, dependency attempts, queue/cache/identity/gateway/cluster state, saturation and error-budget impact as relevant.",
            "Use the incident-management model: detect, triage, communicate, mitigate and maintain a timestamped decision record.",
            "Apply the intended resilience behavior instead of bypassing integrity, authentication, authorization or data-safety constraints for availability.",
            "Recover through the authoritative mechanism: application configuration for application behavior, OpenShift/Kubernetes reconciliation for workload state, Argo CD for GitOps drift, dependency-specific recovery for Redis/RabbitMQ/Keycloak/Kong, and backup/restore for persistent data when required.",
            "Verify recovery from an external client through the normal Kong/Keycloak path and confirm backlogs, alerts and dependency state return to expected boundaries.",
            "Record any failure that crossed more boundaries than predicted and update the dependency map."
          ],
          deliverables: [
            "End-to-end reliability scenario charter",
            "Timeline and incident/experiment evidence",
            "Cross-layer telemetry and diagnosis record",
            "SLO/error-budget impact analysis",
            "Mitigation and recovery evidence",
            "Observed gaps in alerts, runbooks, telemetry or resilience controls"
          ],
          completionCriteria: [
            "The scenario demonstrates a real reliability claim rather than merely causing a failure.",
            "Detection, diagnosis, response and recovery are evidenced across the relevant application and platform layers.",
            "The learner can explain what bounded the failure and what could still cascade or fail next.",
            "Recovery is verified from the client perspective, not only from the component that was restarted or resynchronized."
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
            "Describe observability coverage and important diagnostic blind spots across application, data, messaging, identity, gateway, cluster and GitOps layers.",
            "Present capacity limits/headroom and likely next bottlenecks, including cluster/node capacity and any Redis/RabbitMQ/PostgreSQL saturation boundaries measured.",
            "Summarize resilience controls and the dependency failures they do and do not handle.",
            "State demonstrated RPO/RTO capability for critical state and distinguish data recovery from workload reconciliation.",
            "Summarize incident and reliability-experiment findings, including failed or surprising hypotheses.",
            "Explain operational ownership for Keycloak, Kong, OpenShift/Kubernetes, Argo CD and Nexus; a dependency without an owner is an unresolved reliability risk.",
            "Rank unresolved reliability risks by impact, likelihood/evidence and intervention urgency.",
            "Recommend a small prioritized improvement plan with explicit closure evidence for each item.",
            "Include a short section named 'What We Cannot Claim Yet' to prevent unsupported reliability promises."
          ],
          deliverables: [
            "Steward Reliability Review",
            "Prioritized reliability improvement backlog",
            "Platform/dependency ownership map",
            "What We Cannot Claim Yet section",
            "Milestone evidence package"
          ],
          completionCriteria: [
            "The review distinguishes targets, observations and assumptions.",
            "Unresolved risk is not hidden to make the system appear production-ready.",
            "Recommendations follow from evidence and have verifiable completion conditions.",
            "The review does not assume enterprise platform products are reliable simply because they are industry-standard products."
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
          scenario: "Present the reliability review to a skeptical panel acting as SRE, platform, QA, security and architecture stakeholders. The panel may challenge SLO choices, alert noise, capacity assumptions, retry behavior, backup claims, identity/gateway dependencies, cluster/GitOps recovery, Nexus dependence, incident decisions and experiment safety.",
          instructions: [
            "Prepare a 10–15 minute reliability narrative: user expectations, evidence, major risks and key trade-offs.",
            "For each challenged claim, point to the underlying evidence or explicitly acknowledge that it remains unproven.",
            "Explain at least one trade-off where increasing reliability would add cost, complexity or delivery friction.",
            "Explain one failure mode that remains intentionally accepted and why.",
            "Defend the reliability boundaries of PostgreSQL, Redis, RabbitMQ, Keycloak, Kong, OpenShift/Kubernetes, Argo CD and Nexus without pretending every dependency deserves high availability in the learner environment.",
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
            "The learner distinguishes confidence from certainty and acknowledges unsupported claims.",
            "The final backlog reflects valid review findings rather than treating the milestone as a pass/fail ceremony."
          ]
        }
      }
    ]
  }
];
