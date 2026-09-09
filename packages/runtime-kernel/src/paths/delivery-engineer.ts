import type { Activity } from "../activities";
import { softwareDeliveryFoundationsDeepLessons } from "./delivery-software-foundations-deep";
import { artifactDependencySupplyChainManagement } from "./internal-dependency-management";
import type { LearningPath } from "./learning-path";
import type { Lesson } from "./lesson";

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(pathId: string, title: string, focus?: string): Lesson {
    const id = `${pathId}-${slug(title)}`;
    const practical = title.startsWith("Lab:") || title.startsWith("Milestone:");
    const activity: Activity = {
        id: `${id}-001`,
        title,
        estimatedMinutes: title.startsWith("Milestone:") ? 240 : practical ? 60 : 12,
        content: practical
            ? {
                  type: "practical",
                  objective: focus ?? `Apply ${title.replace(/^(Lab|Milestone): /, "")} to the Steward platform.`,
                  scenario: "Use the existing Steward API, homelab and internal package work. Preserve the result as infrastructure or delivery capability that later schools can operate, secure and observe.",
                  instructions: [
                      "Define the delivery problem and the evidence that will prove the solution works.",
                      "Automate the workflow rather than relying on undocumented manual steps.",
                      "Exercise a failure path, rollback path or recovery path where relevant.",
                      "Record versioned artifacts, configuration and evidence another engineer could review.",
                  ],
                  deliverables: ["Working delivery capability", "Versioned configuration or pipeline definition", "Execution evidence"],
                  completionCriteria: [
                      "The workflow is repeatable from source or configuration.",
                      "Important failure behavior is understood rather than ignored.",
                      "The learner can explain how artifacts move from source to a deployable release.",
                  ],
              }
            : {
                  type: "reading",
                  body: focus ?? `This breadth lesson establishes ${title} as a Delivery Engineer capability for the Steward platform. Deep authoring later adds researched explanations, examples, resources and checks.`,
              },
    };
    return { id, title, activities: [activity] };
}

function path(id: string, title: string, lessons: Lesson[]): LearningPath {
    return { id, title, lessons };
}

export const softwareDeliveryFoundations = path("software-delivery-foundations", "Software Delivery Foundations", softwareDeliveryFoundationsDeepLessons);

export const automationAndShell = path("automation-and-shell", "Automation and Shell", [
    lesson("automation-and-shell", "Shell Scripting for Engineers"),
    lesson("automation-and-shell", "Pipes, Exit Codes and Failure"),
    lesson("automation-and-shell", "Environment Variables"),
    lesson("automation-and-shell", "Repeatable Automation Scripts"),
    lesson("automation-and-shell", "Make and Task Automation"),
    lesson("automation-and-shell", "Idempotency Concepts"),
    lesson("automation-and-shell", "Lab: Automate Steward Developer and Operator Tasks", "Replace repeated Steward setup, build and operational commands with small reliable scripts or task targets that fail visibly and can be rerun safely."),
]);

export const containersAndDocker = path("containers-and-docker", "Containers and Docker", [
    lesson("containers-and-docker", "Containers versus Virtual Machines"),
    lesson("containers-and-docker", "Namespaces and cgroups Concepts"),
    lesson("containers-and-docker", "Docker Architecture"),
    lesson("containers-and-docker", "Images and Layers"),
    lesson("containers-and-docker", "Writing Dockerfiles"),
    lesson("containers-and-docker", "Build Context"),
    lesson("containers-and-docker", "Multi-stage Builds"),
    lesson("containers-and-docker", "Volumes"),
    lesson("containers-and-docker", "Container Networking"),
    lesson("containers-and-docker", "Docker Compose"),
    lesson("containers-and-docker", "Health Checks"),
    lesson("containers-and-docker", "Container Registries"),
    lesson("containers-and-docker", "Image Tags and Versioning"),
    lesson("containers-and-docker", "Image Optimization"),
    lesson("containers-and-docker", "Container Debugging"),
    lesson("containers-and-docker", "Lab: Containerize Steward API", "Build a production-oriented Steward API image, compose its dependencies, add health checks, version the image and prove the service can be rebuilt from a clean environment."),
]);

export const continuousIntegration = path("continuous-integration", "Continuous Integration", [
    lesson("continuous-integration", "CI Pipeline Architecture"),
    lesson("continuous-integration", "Jobs, Stages and Dependencies"),
    lesson("continuous-integration", "Runners and Agents"),
    lesson("continuous-integration", "GitHub Actions and Jenkins"),
    lesson("continuous-integration", "Self-hosted Runners"),
    lesson("continuous-integration", "Caching"),
    lesson("continuous-integration", "Pipeline Artifacts"),
    lesson("continuous-integration", "Secrets and Variables"),
    lesson("continuous-integration", "Parallelism"),
    lesson("continuous-integration", "Automated Checks"),
    lesson("continuous-integration", "Test Stages"),
    lesson("continuous-integration", "Quality Gates"),
    lesson("continuous-integration", "Building Containers in CI"),
    lesson("continuous-integration", "Lab: Run Steward CI from the Homelab", "Install a self-hosted runner or agent in the homelab and build a multi-stage pipeline that checks source, runs tests, builds the Steward API image and preserves evidence/artifacts."),
]);

export const continuousDeliveryDeployment = path("continuous-delivery-deployment", "Continuous Delivery and Deployment", [
    lesson("continuous-delivery-deployment", "CI versus Continuous Delivery versus Continuous Deployment"),
    lesson("continuous-delivery-deployment", "Environment Management"),
    lesson("continuous-delivery-deployment", "Deployment Automation"),
    lesson("continuous-delivery-deployment", "Release Approvals"),
    lesson("continuous-delivery-deployment", "Database Migrations During Deployment"),
    lesson("continuous-delivery-deployment", "Rollback"),
    lesson("continuous-delivery-deployment", "Rolling Deployments"),
    lesson("continuous-delivery-deployment", "Blue-Green Deployments"),
    lesson("continuous-delivery-deployment", "Canary Deployment Concepts"),
    lesson("continuous-delivery-deployment", "Feature Flag Concepts"),
    lesson("continuous-delivery-deployment", "Lab: Automate Steward API Deployment and Rollback", "Automate deployment of a versioned Steward API artifact to learner-managed infrastructure and prove a safe rollback path, including migration considerations."),
]);

export const configurationManagement = path("configuration-management", "Configuration Management", [
    lesson("configuration-management", "Configuration Drift"),
    lesson("configuration-management", "Desired State and Idempotency"),
    lesson("configuration-management", "Ansible Fundamentals"),
    lesson("configuration-management", "Inventories"),
    lesson("configuration-management", "Playbooks"),
    lesson("configuration-management", "Roles Concepts"),
    lesson("configuration-management", "Lab: Automate Steward Servers with Ansible", "Use Ansible to reproduce important Steward server configuration from declared state and demonstrate that rerunning automation is safe and convergent."),
]);

export const releaseEngineering = path("release-engineering", "Release Engineering", [
    lesson("release-engineering", "Release Candidates"),
    lesson("release-engineering", "Promotion and Gates"),
    lesson("release-engineering", "Deployment Evidence"),
    lesson("release-engineering", "Release Observability"),
    lesson("release-engineering", "Release Failure Handling"),
    lesson("release-engineering", "Release Runbooks"),
]);

export const stewardDeliveryPlatform = path("steward-delivery-platform", "Delivery Engineer Milestone", [
    lesson("steward-delivery-platform", "Milestone: Steward Delivery Platform", "Build a commit-to-deployment delivery platform for Steward API that produces versioned application and internal dependency artifacts, publishes them to the internal repository, runs automated checks, promotes releases through deliberate gates, configures infrastructure reproducibly and demonstrates deployment plus rollback with reviewable evidence."),
]);

export const deliveryEngineerPaths: LearningPath[] = [
    softwareDeliveryFoundations,
    automationAndShell,
    containersAndDocker,
    continuousIntegration,
    continuousDeliveryDeployment,
    configurationManagement,
    artifactDependencySupplyChainManagement,
    releaseEngineering,
    stewardDeliveryPlatform,
];
