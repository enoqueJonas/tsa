import type { Lesson } from "./lesson";

export const architectMilestoneDeepLessons: Lesson[] = [
  {
    id: "steward-architecture-evolution-milestone",
    title: "Milestone: Steward Architecture Evolution",
    activities: [
      {
        id: "steward-architecture-evolution-milestone-001",
        title: "Milestone: Steward Architecture Evolution",
        estimatedMinutes: 480,
        content: {
          type: "practical",
          objective: "Produce, defend and validate an evidence-based architecture evolution proposal for the complete Steward ecosystem.",
          scenario: "You are acting as Steward's architect after the system has accumulated real implementation, delivery, cloud/platform, quality, security and reliability history. Your task is not to make Steward look more sophisticated. Your task is to decide what should remain, what should change, why, and how the organization can verify that the resulting architecture is better suited to its drivers and risks.",
          instructions: [
            "Reconstruct the current Steward architecture from the inherited Reliability baseline using application code, PostgreSQL, delivery/cloud infrastructure, observability and operational evidence. The canonical path should already contain Redis, RabbitMQ, steward-common, Nexus, OpenTofu, OpenShift/Kubernetes, Argo CD, Kong, Keycloak, Vault, Graylog and OpenTelemetry/Tempo after their required hands-on checkpoints. tsa-test-core is intentionally absent until Professional Engineer creates a genuine second product/test consumer. Reconcile each against evidence; if one was intentionally retired after implementation, require its retirement ADR and migration evidence rather than silently treating it as never present. Separate observed facts from assumptions.",
            "State the current business and engineering drivers, constraints and quality-attribute scenarios. Include at least reliability, security, modifiability, performance, deployability, operability and cost concerns where relevant.",
            "Identify the most important architecture tensions or risks. Use prior findings from Modularity, Domain Modeling, Data Architecture, Integration and Messaging, Scalability, Cloud, Quality, Security and Reliability rather than inventing hypothetical problems.",
            "For each significant tension, compare credible options. At least one option must preserve the current structure. Evaluate coupling, consistency, failure modes, migration risk, delivery cost, operational burden and reversibility.",
            "For every required technology already implemented—Redis, RabbitMQ, Nexus, OpenTofu, Kong, OpenShift/Kubernetes, Argo CD, Vault, Keycloak, Graylog and OpenTelemetry/Tempo—revisit the concrete pressure or evidence that originally earned it. Compare that evidence with current SLO, incident, recovery, security, performance, cost and operator-toil evidence. Record retain, simplify, replace or remove as an architecture decision; no option is automatically preferred because TSA required the hands-on implementation.", "Compare simpler VPS/container deployment against orchestration because orchestration now exists. Preserve one explicit deployment authority if GitOps remains; any simplification must avoid split-brain deployment. Compare RabbitMQ with Kafka only when an actual messaging requirement justifies the comparison; compare managed versus self-managed services from evidence."
            "Create a target architecture only where the evidence supports change. A valid target may simplify the existing enterprise-learning topology when operational cost exceeds the requirement, or retain it when standardization, reconciliation, isolation or organizational needs justify it.",
            "Produce ADRs for significant decisions. Each ADR must state context, decision, alternatives, consequences, validation evidence and explicit reconsideration triggers.",
            "Evaluate each shared engineering dependency that actually exists. For steward-common and Nexus, verify the required implementation/publication history and current state. For tsa-test-core, verify that it remains absent and evidence-gated until Professional Engineer establishes a genuine second compatible consumer. If a shared package or repository capability was later retired or replaced, evaluate the explicit migration/retirement evidence; otherwise define ownership, versioning, compatibility, deprecation, release and provenance/availability expectations."
            "Evaluate the identity and edge boundaries that actually exist. Where Keycloak, Kong or platform RBAC are present, make their authority distinct from Steward domain authorization and reject duplicated policy that creates inconsistent authorities.",
            "Evaluate data and distributed-state boundaries: PostgreSQL remains authoritative unless evidence justifies change. For the canonical Redis cache and RabbitMQ asynchronous path, use measured cache value, lifecycle-completion SLOs, outbox/backlog evidence, incident history and operational toil to decide whether each mechanism still earns its complexity. Prove that caches do not silently become sources of truth and message handling preserves idempotency and business invariants. If either is simplified/replaced/removed, require migration, rollback and post-change validation evidence.",
            "Evaluate whether any new service, broker, cache, database, replication mechanism, service mesh, additional gateway or distributed coordination pattern is actually justified. Reject technologies whose benefits do not exceed operational and cognitive costs.",
            "Implement at least one architecture improvement justified by the analysis. Prefer the smallest change that materially improves an identified architecture characteristic.",
            "Validate the implemented change using appropriate evidence: tests, build results, dependency checks, performance measurements, failure experiments, security checks, architecture fitness functions or another relevant mechanism.",
            "Create a sequenced evolution roadmap. Separate immediate changes, conditional future changes and deliberately rejected changes. For conditional items, define observable triggers that would justify reopening the decision.",
            "Prepare an architecture defense. Be able to explain not only what you changed, but also why you intentionally did not introduce other forms of complexity."
          ],
          deliverables: [
            "Current-state architecture views covering the application, data, identity, infrastructure and every messaging/platform/GitOps boundary that actually exists",
            "Architecture drivers, constraints and quality-attribute scenarios",
            "Evidence-backed architecture problem/risk register",
            "Option and trade-off analysis including retain-current and simplify-current options",
            "Target architecture views where change is justified",
            "ADR set with consequences and reconsideration triggers",
            "Shared-package and artifact-repository governance assessment where applicable",
            "Enterprise platform responsibility and simplification assessment",
            "At least one implemented architecture improvement",
            "Validation evidence for the implemented improvement",
            "Sequenced architecture evolution roadmap",
            "Architecture defense summary"
          ],
          completionCriteria: [
            "Architecture recommendations trace directly to explicit drivers, observed evidence or demonstrated risk.",
            "The learner distinguishes architecture facts, assumptions, targets and unresolved risks.",
            "Trade-offs include operational, reliability, security, data-consistency, delivery, platform, cost and migration consequences rather than technology benefits alone.",
            "The proposal does not treat microservices, Kafka, Kubernetes/OpenShift, service meshes, additional databases, caches or other distributed mechanisms as maturity goals.",
            "The learner can defend the existence, absence, retention or possible removal of enterprise platform layers based on evidence rather than curriculum expectation.",
            "Keeping a modular monolith, PostgreSQL authority, existing integrations/packages or the current deployment topology is accepted when those choices remain best supported by evidence.",
            "At least one meaningful improvement is implemented and validated against the architecture characteristic it was intended to improve.",
            "ADRs contain explicit conditions that would cause the decision to be reconsidered.",
            "The evolution roadmap separates required work from speculative future work and defines measurable triggers for the latter.",
            "The final defense demonstrates that the learner can explain chosen changes, retained complexity, simplification opportunities and deliberately rejected complexity."
          ]
        }
      }
    ]
  }
];
