import type { Lesson } from "./lesson";

export const architectMilestoneDeepLessons: Lesson[] = [
  {
    id: "steward-architecture-evolution-milestone",
    title: "Milestone: Steward Architecture Evolution",
    activities: [
      {
        id: "steward-architecture-evolution-milestone-001",
        title: "Gate 1: Reconstruct Current Architecture and Drivers",
        estimatedMinutes: 90,
        content: {
          type: "practical",
          objective: "Establish an evidence-backed current-state architecture baseline before proposing change.",
          scenario: "Steward has accumulated application, delivery, platform, quality, security and reliability history. Reconstruct what actually exists rather than designing from memory.",
          instructions: [
            "Reconstruct the current Steward architecture using application code, PostgreSQL, Redis, RabbitMQ, shared packages, GitLab CI, Nexus, OpenTofu, OpenShift/Kubernetes, Argo CD, Kong, Keycloak, secret-management boundaries, observability and operational evidence.",
            "Separate observed facts, assumptions, temporary learning components and unresolved risks.",
            "State current business and engineering drivers, constraints and quality-attribute scenarios, including reliability, security, modifiability, performance, deployability, operability and cost where relevant.",
            "Build the initial architecture problem/risk register from prior school evidence rather than hypothetical concerns."
          ],
          deliverables: ["Current-state architecture views", "Drivers and constraints", "Quality-attribute scenarios", "Evidence-backed architecture problem/risk register"],
          completionCriteria: ["Facts and assumptions are distinguishable.", "Prior evidence is traceable.", "The baseline is sufficient to evaluate change without inventing a new system."]
        }
      },
      {
        id: "steward-architecture-evolution-milestone-002",
        title: "Gate 2: Evaluate Options and Platform Permanence",
        estimatedMinutes: 120,
        content: {
          type: "practical",
          objective: "Compare credible architecture choices and decide which existing complexity still earns its place.",
          scenario: "The curriculum introduced enterprise technologies for learning. Architecture review must not convert historical exposure into permanent production architecture.",
          instructions: [
            "For each significant tension, compare credible options; at least one option must preserve the current structure and, where credible, one should simplify it.",
            "Evaluate coupling, consistency, failure modes, migration risk, delivery cost, operational burden and reversibility.",
            "Compare simpler VPS/container deployment against Kubernetes/OpenShift where appropriate; GitLab CI push deployment with Argo CD GitOps authority; RabbitMQ with Kafka only when requirements justify comparison; and managed versus self-managed services from evidence.",
            "Evaluate steward-common and tsa-test-core ownership, versioning, compatibility, deprecation and Nexus provenance/availability risk.",
            "Evaluate identity and edge boundaries: Keycloak authenticates, Kong governs the public edge, platform RBAC protects platform actions and Steward owns domain authorization.",
            "Evaluate PostgreSQL authority, Redis cache semantics and RabbitMQ idempotency/consistency boundaries.",
            "Reject any new service, broker, cache, database, mesh, gateway or coordination mechanism whose benefit does not exceed its operational and cognitive cost."
          ],
          deliverables: ["Option/trade-off analysis", "Shared-package/Nexus governance assessment", "Platform responsibility and simplification assessment", "Retain/simplify/change decisions"],
          completionCriteria: ["Alternatives are credible rather than straw men.", "Enterprise tools are not maturity goals.", "Each retained complexity has an evidence-backed driver."]
        }
      },
      {
        id: "steward-architecture-evolution-milestone-003",
        title: "Gate 3: Record Target Decisions and ADRs",
        estimatedMinutes: 90,
        content: {
          type: "practical",
          objective: "Turn the option analysis into explicit, reviewable architecture decisions.",
          scenario: "Only evidence-supported changes should enter the target architecture; retaining or simplifying the current design is valid.",
          instructions: [
            "Create target architecture views only where the evidence supports change.",
            "Produce ADRs for significant decisions with context, decision, alternatives, consequences, validation evidence and reconsideration triggers.",
            "Preserve one authority per responsibility and identify any temporary coexistence that needs an end condition.",
            "Select the smallest architecture improvement that materially addresses one identified architecture characteristic."
          ],
          deliverables: ["Target architecture views where justified", "ADR set", "Selected improvement hypothesis"],
          completionCriteria: ["Targets trace to drivers and evidence.", "ADRs include consequences and revisit triggers.", "The selected improvement is bounded and testable."]
        }
      },
      {
        id: "steward-architecture-evolution-milestone-004",
        title: "Gate 4: Implement and Validate One Architecture Improvement",
        estimatedMinutes: 120,
        content: {
          type: "practical",
          objective: "Prove that an architecture recommendation can survive implementation and evidence-based validation.",
          scenario: "Architecture is not complete when a diagram changes. Implement the smallest approved improvement and test whether it improves the intended characteristic.",
          instructions: [
            "Implement the selected architecture improvement without opportunistically expanding scope.",
            "Validate it using appropriate evidence such as tests, build results, dependency checks, performance measurements, failure experiments, security checks or architecture fitness functions.",
            "Compare the result with the baseline and record unexpected consequences.",
            "Update the ADR or target view if implementation evidence contradicts the original assumption."
          ],
          deliverables: ["Implemented architecture improvement", "Validation evidence", "Updated decision artifacts"],
          completionCriteria: ["A meaningful improvement is implemented.", "Validation addresses the intended architecture characteristic.", "Contradicting evidence changes the decision rather than being hidden."]
        }
      },
      {
        id: "steward-architecture-evolution-milestone-005",
        title: "Gate 5: Roadmap and Architecture Defence",
        estimatedMinutes: 60,
        content: {
          type: "practical",
          objective: "Defend the resulting architecture and define how it should evolve without speculative complexity.",
          scenario: "A skeptical review panel wants to know what should change now, what should wait and what should deliberately not be built.",
          instructions: [
            "Create a sequenced evolution roadmap separating immediate changes, conditional future changes and deliberately rejected changes.",
            "For conditional items, define observable triggers that justify reopening the decision.",
            "Prepare and run an architecture defense covering chosen changes, retained complexity, simplification opportunities and rejected complexity.",
            "Record valid challenges as roadmap or ADR updates instead of arguing beyond the evidence."
          ],
          deliverables: ["Sequenced architecture evolution roadmap", "Architecture defense summary", "Challenge-driven updates"],
          completionCriteria: ["Required work is separated from speculative work.", "Conditional work has measurable triggers.", "The learner can defend both retained and removed complexity from evidence."]
        }
      }
    ]
  }
];
