import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const githubEnvironments: LearningResource = { title: "GitHub Actions environments", url: "https://docs.github.com/en/actions/deployment/targeting-different-environments/managing-environments-for-deployment" };
const djangoMigrations: LearningResource = { title: "Django migrations", url: "https://docs.djangoproject.com/en/stable/topics/migrations/" };
const dockerCompose: LearningResource = { title: "Docker Compose documentation", url: "https://docs.docker.com/compose/" };
const twelveFactor: LearningResource = { title: "The Twelve-Factor App", url: "https://12factor.net/" };

function richLesson(
    id: string,
    title: string,
    intro: string,
    sections: Array<{ heading: string; body: string; items?: string[]; code?: { language: string; value: string } }>,
    resources: LearningResource[],
): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: intro }];
    for (const section of sections) {
        const anchor = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        blocks.push({ type: "heading", id: anchor, text: section.heading, level: 2 });
        blocks.push({ type: "paragraph", text: section.body });
        if (section.items) blocks.push({ type: "list", items: section.items });
        if (section.code) blocks.push({ type: "code", language: section.code.language, code: section.code.value });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward delivery checkpoint", body: "Apply the decision to Steward using the same immutable image produced by CI. Record the release identity, environment-specific inputs, verification evidence and the exact recovery path before calling the deployment successful." });
    blocks.push({ type: "resources", title: "Continue learning", resources });

    return {
        id: `continuous-delivery-deployment-${id}`,
        title,
        activities: [{
            id: `continuous-delivery-deployment-${id}-001`,
            title,
            estimatedMinutes: 40,
            content: { type: "reading", body: intro, blocks },
        }],
    };
}

function practicalLesson(): Lesson {
    return {
        id: "continuous-delivery-deployment-lab-automate-steward-api-deployment-and-rollback",
        title: "Lab: Automate Steward API Deployment and Rollback",
        activities: [
            {
                id: "continuous-delivery-deployment-lab-automate-steward-api-deployment-and-rollback-001",
                title: "Deployment Contract",
                estimatedMinutes: 35,
                content: {
                    type: "reading",
                    body: "Before automating deployment, define what may change, what must remain immutable and what evidence determines success.",
                    blocks: [
                        { type: "heading", id: "release-contract", text: "Define the release contract", level: 2 },
                        { type: "paragraph", text: "Choose one CI-produced Steward image as the release candidate. Record its application version, source commit and immutable image identity. Define the target environment, runtime configuration source, migration behavior, verification endpoint and rollback trigger." },
                        { type: "list", items: ["The artifact is not rebuilt during deployment.", "Secrets remain outside the image and repository.", "Database migration behavior is explicit.", "Success and rollback criteria are observable.", "The previous known-good release remains identifiable."] },
                        { type: "callout", tone: "warning", title: "Rollback is not magic", body: "If a migration destroys or transforms data incompatibly, starting the previous container image may not restore the old system behavior. The recovery design must include data compatibility, not only application binaries." },
                    ],
                },
            },
            {
                id: "continuous-delivery-deployment-lab-automate-steward-api-deployment-and-rollback-002",
                title: "Automate the Deployment",
                estimatedMinutes: 120,
                content: {
                    type: "practical",
                    objective: "Deploy a known Steward release to learner-managed infrastructure through a repeatable automated workflow and preserve enough evidence to prove what is running.",
                    scenario: "Use the existing Steward CI image and homelab target. The deployment should replace ad-hoc SSH/container commands with a versioned workflow while keeping secrets and target-specific configuration outside the image.",
                    instructions: [
                        "Select a CI-produced Steward image and record version, commit and digest or equivalent immutable identity.",
                        "Define the deployment target and environment-specific configuration inputs.",
                        "Automate image retrieval, service update and application startup without rebuilding the application artifact.",
                        "Run database migrations deliberately and capture their result.",
                        "Verify application health and one meaningful Steward API behavior after deployment.",
                        "Capture deployment evidence that another engineer can connect back to the original source revision.",
                    ],
                    deliverables: ["Versioned deployment workflow", "Release identity record", "Deployment execution evidence", "Post-deployment verification evidence"],
                    completionCriteria: ["The same workflow can deploy a second version without undocumented manual steps.", "The runtime can be traced back to one CI-produced immutable image.", "Failure in migration or verification stops the workflow visibly."],
                },
            },
            {
                id: "continuous-delivery-deployment-lab-automate-steward-api-deployment-and-rollback-003",
                title: "Prove Rollback and Recovery Boundaries",
                estimatedMinutes: 90,
                content: {
                    type: "practical",
                    objective: "Demonstrate a controlled failed release and recover Steward to a known-good state without guessing.",
                    scenario: "Introduce a safe, reversible deployment failure such as a bad runtime configuration, failed health verification or deliberately broken application candidate. Do not corrupt persistent data merely to create drama.",
                    instructions: [
                        "Deploy or simulate a candidate that fails the predefined verification criterion.",
                        "Use evidence to identify whether the failure is artifact, configuration, migration, runtime or infrastructure related.",
                        "Execute the documented rollback or forward-fix path.",
                        "Verify the known-good release identity and application behavior after recovery.",
                        "Document any class of change that your rollback mechanism cannot safely reverse.",
                    ],
                    deliverables: ["Failure evidence", "Rollback/recovery execution record", "Known-good verification", "Documented rollback limitations"],
                    completionCriteria: ["Recovery uses a predefined release identity rather than 'latest'.", "The learner can explain why application rollback may not imply data rollback.", "The failed release does not remain ambiguously active."],
                },
            },
            {
                id: "continuous-delivery-deployment-lab-automate-steward-api-deployment-and-rollback-004",
                title: "Delivery Handoff",
                estimatedMinutes: 25,
                content: {
                    type: "reflection",
                    prompt: "Which parts of Steward deployment are now automated, and which remaining host-level or environment-level assumptions should be moved into Configuration Management next? Name the highest-risk manual assumption and the evidence that makes it risky.",
                },
            },
        ],
    };
}

export const continuousDeliveryDeploymentDeepLessons: Lesson[] = [
    richLesson("ci-cd-cd", "CI versus Continuous Delivery versus Continuous Deployment", "The terms are often collapsed into 'CI/CD', but they describe different control boundaries. Continuous integration validates and integrates change; continuous delivery keeps a releasable artifact ready to deploy; continuous deployment automatically moves eligible releases into the target environment.", [
        { heading: "Separate readiness from release", body: "A green CI run proves only the checks you designed. Continuous delivery adds packaging, release identity and deployment readiness. Continuous deployment removes a human release decision only when automated evidence is strong enough to justify doing so." },
        { heading: "Choose automation by risk", body: "Steward in a learning homelab does not need artificial enterprise ceremony, but it does need deliberate gates. Automate repetitive mechanics first; preserve human approval where a decision still requires judgment." },
    ], [githubEnvironments]),
    richLesson("environment-management", "Environment Management", "An environment is more than a hostname. It is a set of infrastructure, data, configuration, credentials, integrations and operational expectations in which a release runs.", [
        { heading: "Keep release identity stable", body: "Promote the same Steward image between environments. Differences should come from explicit environment inputs rather than rebuilding code with different values baked into the artifact." },
        { heading: "Inventory environment-specific state", body: "Record DNS names, ports, database endpoint, secret source, persistent volumes, external integrations and access policy. Hidden environment assumptions are a common cause of 'works in test, fails in production'." },
    ], [twelveFactor]),
    richLesson("deployment-automation", "Deployment Automation", "Deployment automation turns a release procedure into executable, versioned intent. Good automation is repeatable, observable and stops when preconditions or verification fail.", [
        { heading: "Automate the sequence, not just the commands", body: "A robust flow selects a known artifact, validates target readiness, applies required state changes, starts the release and verifies the resulting service. Merely wrapping SSH commands in YAML does not make the process safe." },
        { heading: "Make failure visible", body: "Deployment scripts should preserve exit codes and evidence. If a health check fails, the workflow must fail clearly instead of printing a warning and continuing." },
    ], [dockerCompose]),
    richLesson("release-approvals", "Release Approvals", "An approval gate should represent a decision that cannot yet be trusted entirely to automation. The approver needs a defined question and evidence, not a generic 'approve' button.", [
        { heading: "Design the decision", body: "Examples include confirming a risky migration window, accepting a known limitation or approving promotion after UAT evidence. If nobody can explain what risk the approval controls, the gate is ceremony." },
        { heading: "Keep approval separate from artifact creation", body: "Build and validate before approval so the decision refers to one immutable candidate. Rebuilding after approval invalidates part of the evidence the approver reviewed." },
    ], [githubEnvironments]),
    richLesson("database-migrations", "Database Migrations During Deployment", "Schema changes make deployment stateful. Application versions and database versions can become temporarily incompatible, which means migration design is part of release engineering, not a post-deployment afterthought.", [
        { heading: "Reason about compatibility windows", body: "Prefer migrations that allow old and new application versions to coexist during the transition when possible: add before remove, backfill deliberately, then clean up after consumers move." },
        { heading: "Treat migration failure as a release failure", body: "Run migrations as an explicit deployment step, capture their result and stop if they fail. A container reporting healthy while required schema changes did not apply is not a successful release." },
        { heading: "Separate application rollback from data rollback", body: "Reverse migrations can lose data or be impossible. Document whether a release is backward-compatible with the post-migration schema and what recovery actually means." },
    ], [djangoMigrations]),
    richLesson("rollback", "Rollback", "Rollback is the controlled restoration of a previously known-good release state. It depends on immutable release identity, compatible persistent state and a verification procedure.", [
        { heading: "Know what you can reverse", body: "Application image, runtime configuration and routing may be reversible quickly. Database writes, external side effects and irreversible migrations may not be. Define rollback boundaries before deployment." },
        { heading: "Verify after rollback", body: "A successful command is not proof of recovery. Confirm the previous image identity, health and at least one meaningful Steward behavior." },
    ], [dockerCompose, djangoMigrations]),
    richLesson("rolling-deployments", "Rolling Deployments", "A rolling deployment replaces instances gradually so some capacity remains available while new instances start. It is useful only when multiple interchangeable instances exist and versions can coexist safely.", [
        { heading: "Understand the prerequisites", body: "Rolling deployment assumes traffic can be distributed across replicas and that old/new application versions tolerate the same dependencies and schema during the rollout." },
        { heading: "Do not simulate scale for its own sake", body: "A single-node Steward homelab may not benefit from rolling deployment yet. Learn the mechanism and its requirements without inventing fake high availability." },
    ], [dockerCompose]),
    richLesson("blue-green", "Blue-Green Deployments", "Blue-green deployment maintains two complete application environments so a release can be verified on the inactive side before traffic switches.", [
        { heading: "Shift traffic deliberately", body: "The technique reduces application switch-over risk because the previous environment can remain intact, but shared databases and external side effects still complicate rollback." },
        { heading: "Count the cost", body: "Blue-green requires duplicate runtime capacity and disciplined routing. In a budget homelab, the learner should understand the trade-off rather than force the pattern into every service." },
    ], [dockerCompose]),
    richLesson("canary", "Canary Deployment Concepts", "Canary deployment exposes a new release to a limited slice of traffic or users before broader rollout. Its value comes from comparing real runtime evidence while limiting blast radius.", [
        { heading: "Define the observation", body: "A canary without measurable success criteria is just partial exposure. Decide which errors, latency, business behavior or operator signals would stop promotion." },
        { heading: "Know when it is premature", body: "Steward does not yet have the traffic scale or observability maturity to justify implementing a real canary. The concept becomes actionable later when Reliability Engineering adds stronger runtime signals." },
    ], []),
    richLesson("feature-flags", "Feature Flag Concepts", "Feature flags decouple code deployment from feature exposure. They can reduce release coupling, but they introduce runtime configuration state that must be owned, tested and eventually removed.", [
        { heading: "Separate deployment from activation", body: "A compatible code path can be deployed dark, then enabled for selected users or conditions. This can reduce rollback pressure when feature activation is reversible independently of the binary." },
        { heading: "Control flag debt", body: "Temporary flags need owners and removal criteria. Stale flags multiply execution paths and make testing, debugging and reasoning harder." },
    ], [twelveFactor]),
    practicalLesson(),
];
