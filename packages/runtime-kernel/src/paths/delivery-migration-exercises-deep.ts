import type { Lesson } from "./lesson";

export const deliveryMigrationExerciseDeepLessons: Lesson[] = [
  {
    id: "delivery-platform-migration-exercise",
    title: "Delivery Platform Migration Exercise",
    activities: [
      {
        id: "delivery-platform-migration-exercise-brief",
        title: "Migration Brief: Move a Steward CI Workflow Safely",
        estimatedMinutes: 30,
        content: {
          type: "reading",
          body: "Migration is a different engineering skill from greenfield implementation. Jenkins remains TSA's primary Steward CI implementation, but an organization may later change platforms because of hosting, maintenance, integration, cost or strategic constraints. This exercise teaches how to move a delivery capability without silently changing its guarantees.",
          blocks: [
            { type: "heading", id: "scenario", text: "Scenario", level: 2 },
            { type: "paragraph", text: "The organization is evaluating a move of one representative Steward CI workflow from Jenkins to an alternative CI platform such as GitHub Actions. Leadership does not authorize a permanent duplicate CI architecture. You must prove semantic equivalence, define a bounded coexistence/cutover window, preserve rollback and finish with one primary implementation." },
            { type: "callout", tone: "warning", title: "Migration, not duplication", body: "Do not maintain both full pipelines indefinitely. Temporary duplication exists only to validate migration and must end in an explicit primary-platform decision." },
          ],
        },
      },
      {
        id: "delivery-platform-migration-exercise-practical",
        title: "Execute a Bounded CI Migration",
        estimatedMinutes: 240,
        content: {
          type: "practical",
          objective: "Migrate one representative Steward CI workflow while preserving its engineering guarantees and proving rollback/decommission behavior.",
          scenario: "The current Jenkins pipeline protects source checks, tests, artifact identity and fail-closed image creation. An alternative platform is being evaluated. A successful migration must preserve those semantics rather than merely produce a green job in another UI.",
          instructions: [
            "Inventory the selected Jenkins workflow: triggers, stages, dependencies, agents, credentials, caches, artifacts, gates, evidence and failure behavior.",
            "Choose an alternative CI platform for the migration exercise and map semantic equivalents before writing its configuration.",
            "Identify features that do not map directly and decide whether to redesign, emulate or explicitly accept a changed behavior.",
            "Implement the representative workflow on the target platform without removing Jenkins yet.",
            "Run equivalent success and controlled-failure cases on both paths and compare evidence, artifact identity and fail-closed behavior.",
            "Define the coexistence window and a cutover criterion. During coexistence, identify which pipeline is authoritative for release decisions so two successful jobs cannot independently publish conflicting releases.",
            "Execute or simulate cutover to the target platform and prove the rollback path back to Jenkins.",
            "Finish with a decision: retain Jenkins as primary after the learning exercise, complete the migration to the target, or defer migration. In every case, remove/disable the non-primary release path and document what was decommissioned."
          ],
          deliverables: [
            "Source-platform capability inventory",
            "Jenkins-to-target semantic mapping",
            "Target CI configuration for the representative workflow",
            "Equivalent success/failure evidence",
            "Coexistence and authoritative-release rule",
            "Cutover and rollback plan/evidence",
            "Final primary-platform and decommission decision"
          ],
          completionCriteria: [
            "The migration preserves or deliberately renegotiates every important pipeline guarantee.",
            "Temporary coexistence has one authoritative release path.",
            "A controlled failure remains fail-closed on the target.",
            "Rollback is executable or demonstrated credibly.",
            "The exercise ends with one primary CI implementation rather than permanent duplication.",
            "The learner can explain operational ownership differences between the two platforms."
          ],
        },
      },
      {
        id: "delivery-platform-migration-exercise-review",
        title: "Migration Review",
        estimatedMinutes: 20,
        content: {
          type: "reflection",
          prompt: "1. Which Jenkins guarantee was hardest to reproduce on the target platform, and why?\n2. What would have gone wrong if both pipelines were allowed to publish releases during coexistence?\n3. Which credential or artifact responsibility changed during migration?\n4. What evidence was required before cutover?\n5. What exact condition would trigger rollback?\n6. Which platform is primary after the exercise, and what happened to the other release path?",
        },
      },
    ],
  },
];
