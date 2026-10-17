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
          body: "Migration is a different engineering skill from greenfield implementation. GitLab CI/CD is TSA's canonical delivery platform. This exercise starts from a deliberately legacy Jenkins workflow and teaches how to migrate an inherited CI capability into GitLab without silently changing its guarantees.",
          blocks: [
            { type: "heading", id: "worked-gate-equivalence", text: "Worked migration: compare behavior, not YAML", level: 2 },
            { type: "paragraph", text: "Suppose legacy Jenkins has checkout, unit tests, image build and publish stages. Before translating syntax, write a contract for each stage: trigger, permissions, runner image, input revision, negative test behavior, output artifact and retention policy. A GitLab pipeline that passes only the happy-path build but omits test failure propagation is not equivalent." },
            { type: "code", language: "yaml", caption: "Illustrative GitLab test job: fails the pipeline on a failing test; image publishing must depend on this gate.", code: "stages: [test, package]\\nunit_tests:\\n  stage: test\\n  image: python:3.12-slim\\n  script:\\n    - python -m unittest discover -s tests\\npackage:\\n  stage: package\\n  needs: [unit_tests]\\n  script:\\n    - echo \\"Replace with a real pinned image-build command\\"" },
            { type: "paragraph", text: "This is a teaching skeleton, not a deployable Steward pipeline. Prove failure behavior with a deliberately failing disposable test. Compare both pipelines against the same commit, and record where each stores the final artifact and who may access deployment secrets. If image publishing can run after a failed unit test, stop the migration." },
            { type: "heading", id: "scenario", text: "Scenario", level: 2 },
            { type: "paragraph", text: "The organization is evaluating a move of one representative Steward CI workflow from an inherited Jenkins implementation to GitLab CI/CD. Leadership does not authorize a permanent duplicate CI architecture. You must prove semantic equivalence, define a bounded coexistence/cutover window, preserve rollback and finish with one primary implementation." },
            { type: "heading", id: "worked-gate-mapping", text: "Worked migration: preserve a failed authorization gate", level: 2 },
            { type: "paragraph", text: "Suppose the inherited Jenkins workflow runs unit tests, then an integration test for cross-team service mutation, and publishes only if both pass. In GitLab, an equivalent check stage must fail when Team A can modify Team B\u0027s service, and its failure must prevent the publish job. A green Docker build after a failed integration check is not equivalent behavior. Compare job dependencies, allowed-failure settings, trigger context, credentials, and the recorded source/image identity, not merely job names." },
            { type: "paragraph", text: "If there is no real inherited Jenkins system, use an explicitly labeled legacy pipeline fixture or documented Jenkinsfile for this bounded comparison. Do not introduce Jenkins as a permanent Steward dependency just to complete the exercise; simulated cutover evidence must be labeled simulation rather than a production migration." },
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
          scenario: "The inherited Jenkins pipeline protects source checks, tests, artifact identity and fail-closed image creation. An alternative platform is being evaluated. A successful migration must preserve those semantics rather than merely produce a green job in another UI.",
          instructions: [
            "Inventory the inherited Jenkins workflow or an explicitly labeled legacy Jenkinsfile fixture when no inherited system exists: triggers, stages, dependencies, agents, credentials, caches, artifacts, gates, evidence and failure behavior. Label fixture-only observations instead of claiming a real production cutover.",
            "Treat GitLab CI/CD as the target platform and map semantic equivalents before writing .gitlab-ci.yml.",
            "Identify features that do not map directly and decide whether to redesign, emulate or explicitly accept a changed behavior.",
            "Implement the representative workflow in GitLab CI/CD without removing the legacy Jenkins path yet.",
            "Run equivalent success and controlled-failure cases on both paths and compare evidence, artifact identity and fail-closed behavior.",
            "Define the coexistence window and a cutover criterion. During coexistence, identify which pipeline is authoritative for release decisions so two successful jobs cannot independently publish conflicting releases.",
            "Execute or simulate cutover to the target platform and prove the bounded rollback path to the legacy Jenkins workflow during the migration window.",
            "Complete the migration to GitLab CI/CD when equivalence gates pass. Disable/decommission the Jenkins release path and document what was retired. If an equivalence gate cannot be met, record the blocker and keep the exercise non-releasable rather than redefining Jenkins as TSA's canonical target."
          ],
          deliverables: [
            "Source-platform capability inventory",
            "Jenkins-to-GitLab semantic mapping",
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
          prompt: "1. Which legacy Jenkins guarantee was hardest to reproduce in GitLab CI/CD, and why?\n2. What would have gone wrong if both pipelines were allowed to publish releases during coexistence?\n3. Which credential or artifact responsibility changed during migration?\n4. What evidence was required before cutover?\n5. What exact condition would trigger rollback?\n6. Which platform is primary after the exercise, and what happened to the other release path?",
        },
      },
    ],
  },
];
