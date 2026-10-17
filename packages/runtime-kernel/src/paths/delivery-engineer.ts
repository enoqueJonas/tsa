import { automationAndShellDeepLessons } from "./delivery-automation-shell-deep";
import { containersAndDockerQualityLessons } from "./delivery-containers-docker-quality";
import { continuousDeliveryDeploymentQualityLessons } from "./delivery-continuous-delivery-quality";
import { continuousIntegrationQualityLessons } from "./delivery-continuous-integration-quality";
import { configurationManagementQualityLessons } from "./delivery-configuration-management-quality";
import { deliveryEngineerMilestoneDeepLessons } from "./delivery-engineer-milestone-deep";
import { deliveryMigrationExerciseDeepLessons } from "./delivery-migration-exercises-deep";
import { productionSchemaEvolutionDeepLessons } from "./delivery-production-schema-evolution-deep";
import { releaseEngineeringQualityLessons } from "./delivery-release-engineering-quality";
import { softwareDeliveryFoundationsQualityLessons } from "./delivery-software-foundations-quality";
import { artifactDependencySupplyChainManagement } from "./internal-dependency-management";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

const deliveryFieldwork: Record<string, { model: string; example: string; expected: string; failure: string }> = {
    "software-delivery-foundations": { model: "A change travels through version control, review, CI checks, artifact publication, promotion and runtime verification. Each stage produces evidence; a green build does not prove the deployed version is healthy.", example: "For one Steward change, write the commit SHA, CI run ID, published image digest, promotion approval and deployment timestamp. Follow the SAME digest from CI to the server instead of rebuilding at deployment time.", expected: "The commit and digest correspond to a real pipeline and running deployment.", failure: "If the deployed digest differs, determine whether a second build or mutable tag changed the artifact before calling the release verified." },
    "automation-and-shell": { model: "A repeatable shell task reads input, validates preconditions, performs a bounded change and returns meaningful exit status. Quoting and strict error handling matter because file paths, spaces and command failures are data, not decoration.", example: "In a disposable directory, create a file with spaces in its name and write a shell script that receives that path as a quoted argument, checks it exists, copies it to an output directory and reports a checksum. Run it twice and compare outputs.", expected: "Both runs produce the same checksum; a missing input exits nonzero without pretending success.", failure: "An unquoted expansion can split the filename. Record the failure first, then fix quoting and verify the negative path." },
    "containers-and-docker": { model: "An image is an immutable filesystem/application template. A container is a running instance with its own process and network settings; external volumes and services persist beyond the container's lifecycle.", example: "Build the Steward image once, record its digest, start a disposable container with an explicit port mapping and request its health endpoint. Stop and replace the container using the same digest; verify separately stored test data still exists.", expected: "The health request succeeds and the expected data survives replacement.", failure: "A running container is not a working application; use container logs, port mapping and health request to localize the failure." },
    "continuous-integration": { model: "CI validates a specific revision in an isolated runner. Jobs may depend on earlier steps, but successful tests do not establish delivery approval or production fitness.", example: "Trace a commit through lint, unit/integration checks, package creation and artifact digest. Inject one intentionally failing test in a disposable branch and verify the pipeline blocks publication.", expected: "The negative branch cannot publish a release artifact; the healthy branch records a traceable digest.", failure: "A pipeline reporting green despite a failing command may be swallowing exit status or treating the job as allowed to fail." },
    "continuous-delivery-deployment": { model: "Continuous delivery makes a tested release deployable; automatic deployment adds a production transition. Approval is a risk decision, whereas copying files and restarting services are mechanical actions.", example: "Choose one immutable Steward image digest, promote it to a disposable staging host and record pre/post health. Simulate an unhealthy response and use the previous verified digest as the recovery target.", expected: "The unchanged artifact is promoted; failure stops further rollout and the original client request succeeds after recovery.", failure: "Rebuilding during promotion invalidates the assertion that staging and production received identical code." },
    "configuration-management": { model: "Configuration management owns desired state in version-controlled declarations, while CI orchestrates validation and delivery. Ownership conflicts between scripts, images and Ansible can produce hidden drift.", example: "On a disposable managed VM, apply a declared service configuration, run the same play again and record that the second run makes no changes. Introduce one manual edit and observe reconvergence.", expected: "The second converged run reports zero unexpected changes and the service remains healthy.", failure: "A successful play with recurring changes is not yet proven idempotent; identify which task churns." },
    "artifact-and-supply-chain": { model: "A dependency is an input to a build; an artifact is its output. Registries, versions, lockfiles, credentials and provenance define a chain of custody for the exact bits shipped.", example: "Select an internal Steward library, pin its version in the consumer, build an image and record the dependency version and output digest. Verify that an unauthorized or unavailable package source fails the pipeline rather than silently falling back.", expected: "The consumer identifies its exact dependency and deployed image.", failure: "A mutable tag or unconstrained dependency version can silently change a rebuilt artifact." },
    "release-engineering": { model: "A release is a supported version with compatibility, evidence, communication and rollback obligations—not simply a Git tag. Version labels and artifact digests serve different purposes.", example: "Prepare a disposable Steward release with a changelog, image digest, test evidence, migration note, risk owner and explicit deployment/rollback conditions. Compare deployed digest with the approved release record.", expected: "A reviewer can reconstruct what changed, which binary shipped, when and how recovery would work.", failure: "A changelog without deployable artifact identity or rollback evidence is not a complete release record." },
    "production-schema-evolution": { model: "Application rollout and database schema evolution are two independently timed changes. Expand–migrate–contract keeps old and new application versions compatible while data moves.", example: "In a disposable database, add a nullable new column, deploy code that accepts old and new forms, backfill a small synthetic dataset and verify both app versions before removing the old path. Capture migration duration.", expected: "Old reads/writes remain valid during expansion, and backfilled data passes integrity checks.", failure: "Dropping or renaming a used column before all consumers migrate breaks rollback. Validate compatibility before contraction." },
    "delivery-platform-migration": { model: "Moving CI providers requires behavioral equivalence, not YAML syntax equivalence. Secrets, runner identity, caches, artifacts and deployment permissions can change independently.", example: "Run the same Steward revision through old and new test pipelines, compare test counts, artifact digests, published metadata and environment permissions. Use a disposable branch to demonstrate that a failing test blocks both.", expected: "Both pipelines enforce equivalent gates and produce traceable artifacts.", failure: "A green migration may still omit negative gates or expose privileged deployment credentials to untrusted changes." },
    "steward-delivery-platform": { model: "The final delivery milestone unifies source revision, build evidence, immutable artifact, approved promotion, deployed runtime and recovery. Every transition needs an owner and an observable result.", example: "Present one end-to-end Steward change with commit SHA, dependency resolution, test evidence, image digest, staging verification, approval, deployment record and controlled rollback drill.", expected: "The original user-level health request succeeds after both deployment and deliberate rollback.", failure: "If a step has no evidence or changes artifact identity, identify the broken contract rather than declaring the pipeline production-ready." },
};
/**
 * An activity-specific preparation precedes each delivery lab, even when the
 * original author provided a path-level overview only. This prepares the
 * exact scenario rather than repeating the same generic checklist.
 */
function prepareLabSequence(lessons: Lesson[], model: { model: string; failure: string }): Lesson[] {
    return lessons.map((lesson) => {
        let encounteredReading = false;
        const activities = lesson.activities.flatMap((activity) => {
            if (activity.content.type === "reading") {
                encounteredReading = true;
                return [activity];
            }
            if (activity.content.type !== "practical") return [activity];
            const task = activity.content;
            const focus = task.instructions.slice(0, 3);
            const expected = task.completionCriteria.slice(0, 3);
            const guidance = {
                id: `${activity.id}-preparation`,
                title: `Prepare the experiment: ${activity.title}`,
                estimatedMinutes: 20,
                content: {
                    type: "reading" as const,
                    body: `Problem and operating boundary: ${task.scenario}\\n\\nObjective: ${task.objective}\\n\\nBefore changing anything: ${model.model}`,
                    blocks: [
                        { type: "heading" as const, id: "problem-boundary", text: "Problem, scope and prerequisites", level: 2 as const },
                        { type: "paragraph" as const, text: task.scenario },
                        { type: "paragraph" as const, text: model.model },
                        { type: "heading" as const, id: "experiment-plan", text: "Translate the first steps into observations", level: 2 as const },
                        { type: "list" as const, items: focus.length ? focus : [task.objective], ordered: true },
                        { type: "heading" as const, id: "expected-evidence", text: "What will count as success", level: 2 as const },
                        { type: "list" as const, items: expected.length ? expected : task.deliverables },
                        { type: "heading" as const, id: "negative-path", text: "Failure hypothesis and recovery", level: 2 as const },
                        { type: "paragraph" as const, text: model.failure },
                        { type: "paragraph" as const, text: "Use disposable infrastructure or a test branch. Preserve the last known-good artifact/configuration and a rollback path; repeat the identical consumer-level operation after recovery." },
                    ],
                },
            };
            encounteredReading = true;
            // Always insert the experiment-specific reading immediately before
            // the lab, including in lessons whose existing reading is broad.
            return [guidance, activity];
        });
        void encounteredReading;
        return { ...lesson, activities };
    });
}

function path(id: string, title: string, lessons: Lesson[]): LearningPath {
    const material = deliveryFieldwork[id];
    if (!material) throw new Error(`Missing Delivery Engineer fieldwork: ${id}`);
    const intro: Lesson = {
        id: `${id}-fieldwork-orientation`,
        title: `Worked delivery model: ${title}`,
        activities: [{
            id: `${id}-fieldwork-reading`,
            title: "Model, worked example and failure diagnosis",
            estimatedMinutes: 30,
            content: { type: "reading", body: material.model, blocks: [
                { type: "heading", id: "model", text: "Understand the boundary before using tools", level: 2 },
                { type: "paragraph", text: material.model },
                { type: "heading", id: "worked-case", text: "Worked Steward case", level: 2 },
                { type: "paragraph", text: material.example },
                { type: "heading", id: "verification", text: "Expected verification", level: 2 },
                { type: "paragraph", text: material.expected },
                { type: "heading", id: "failure-analysis", text: "Failure analysis", level: 2 },
                { type: "paragraph", text: material.failure },
            ] },
        }],
    };
    return { id, title, lessons: [intro, ...prepareLabSequence(lessons, material)] };
}

export const softwareDeliveryFoundations = path("software-delivery-foundations", "Software Delivery Foundations", softwareDeliveryFoundationsQualityLessons);
export const automationAndShell = path("automation-and-shell", "Automation and Shell", automationAndShellDeepLessons);
export const containersAndDocker = path("containers-and-docker", "Containers and Docker", containersAndDockerQualityLessons);
export const continuousIntegration = path("continuous-integration", "Continuous Integration", continuousIntegrationQualityLessons);
export const continuousDeliveryDeployment = path("continuous-delivery-deployment", "Continuous Delivery and Deployment", continuousDeliveryDeploymentQualityLessons);
export const configurationManagement = path("configuration-management", "Configuration Management", configurationManagementQualityLessons);
export const releaseEngineering = path("release-engineering", "Release Engineering", releaseEngineeringQualityLessons);
export const productionSchemaEvolution = path("production-schema-evolution", "Production Database Schema Evolution", productionSchemaEvolutionDeepLessons);
export const deliveryPlatformMigration = path("delivery-platform-migration", "CI Platform Migration Exercise", deliveryMigrationExerciseDeepLessons);
export const stewardDeliveryPlatform = path("steward-delivery-platform", "Delivery Engineer Milestone", deliveryEngineerMilestoneDeepLessons);

export const deliveryEngineerPaths: LearningPath[] = [
    softwareDeliveryFoundations,
    automationAndShell,
    containersAndDocker,
    continuousIntegration,
    continuousDeliveryDeployment,
    configurationManagement,
    artifactDependencySupplyChainManagement,
    releaseEngineering,
    productionSchemaEvolution,
    deliveryPlatformMigration,
    stewardDeliveryPlatform,
];
