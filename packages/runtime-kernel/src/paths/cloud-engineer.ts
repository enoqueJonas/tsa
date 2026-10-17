import { cloudArchitectureAndCostQualityLessons } from "./cloud-architecture-cost-quality";
import { cloudAndHostingModelsQualityLessons } from "./cloud-hosting-models-quality";
import { cloudBuildingBlocksQualityLessons } from "./cloud-building-blocks-quality";
import { certificateLifecycleOperationsDeepLessons } from "./cloud-certificate-lifecycle-operations-deep";
import { cloudEngineerMilestoneDeepLessons } from "./cloud-engineer-milestone-deep";
import { cloudOrchestrationGitOpsDeepLessons } from "./cloud-orchestration-gitops-deep";
import { progressiveDeliveryCanaryDeepLessons } from "./cloud-progressive-delivery-canary-deep";
import { objectStorageImplementationDeepLessons } from "./cloud-object-storage-implementation-deep";
import { infrastructureAsCodeQualityLessons } from "./cloud-infrastructure-as-code-quality";
import { internetNetworkingQualityLessons } from "./cloud-internet-networking-quality";
import { vpsOperationsQualityLessons } from "./cloud-vps-operations-quality";
import type { LearningPath } from "./learning-path";

export const cloudAndHostingModels: LearningPath = { id: "cloud-and-hosting-models", title: "Cloud and Hosting Models", lessons: cloudAndHostingModelsQualityLessons };
export const vpsOperations: LearningPath = { id: "vps-operations", title: "VPS Operations", lessons: vpsOperationsQualityLessons };
export const internetNetworking: LearningPath = { id: "internet-networking", title: "Internet Networking", lessons: internetNetworkingQualityLessons };
export const certificateLifecycleOperations: LearningPath = { id: "certificate-lifecycle-operations", title: "Certificate Lifecycle Operations", lessons: certificateLifecycleOperationsDeepLessons };
export const cloudBuildingBlocks: LearningPath = { id: "cloud-building-blocks", title: "Cloud Building Blocks", lessons: cloudBuildingBlocksQualityLessons };
export const objectStorageImplementation: LearningPath = { id: "object-storage-implementation", title: "S3-Compatible Object Storage", lessons: objectStorageImplementationDeepLessons };
export const infrastructureAsCode: LearningPath = { id: "infrastructure-as-code", title: "Infrastructure as Code", lessons: infrastructureAsCodeQualityLessons };
export const cloudOrchestrationGitOps: LearningPath = { id: "cloud-orchestration-gitops", title: "Kubernetes, OpenShift and GitOps", lessons: cloudOrchestrationGitOpsDeepLessons };
export const progressiveDeliveryCanary: LearningPath = { id: "progressive-delivery-canary", title: "Progressive Delivery with Canary Releases", lessons: progressiveDeliveryCanaryDeepLessons };
export const cloudArchitectureAndCost: LearningPath = { id: "cloud-architecture-and-cost", title: "Cloud Architecture and Cost", lessons: cloudArchitectureAndCostQualityLessons };
export const stewardInternetEnvironment: LearningPath = { id: "steward-internet-environment", title: "Cloud Engineer Milestone", lessons: cloudEngineerMilestoneDeepLessons };

type CloudBoundary = { mentalModel: string; experiment: string; fault: string };
const cloudBoundaries: Record<string, CloudBoundary> = {
    "cloud-and-hosting-models": { mentalModel: "Compare rented infrastructure, managed platform services and self-hosting by responsibility, not marketing labels.", experiment: "For Steward, draw who patches the operating system, application, database and TLS termination for a VPS versus a managed application service.", fault: "A working endpoint is not evidence that backups, updates or access control have an owner." },
    "vps-operations": { mentalModel: "A VPS is an operating-system instance with a public exposure boundary and provider-owned physical infrastructure.", experiment: "Provision a disposable guest, document SSH access, least-privilege administration, updates, firewall, health request and independent recovery.", fault: "Locking down SSH before proving alternate access can strand the administrator; take a recovery checkpoint." },
    "internet-networking": { mentalModel: "DNS, routing, TLS and reverse proxies are distinct steps along an external request.", experiment: "Trace a synthetic https request from resolver lookup through address, TCP connection, certificate hostname check, proxy and application response.", fault: "A TLS certificate being issued does not prove the backend routes requests or that the DNS record is correct." },
    "certificate-lifecycle-operations": { mentalModel: "Certificates bind a public key to verified names for a period of time; they do not authenticate an application user.", experiment: "For a disposable domain, inspect subject alternative names, issuer, notAfter date, full chain and renewed certificate deployment before testing HTTPS.", fault: "Renewal success without deployment to the actual proxy can leave clients seeing the expired certificate." },
    "cloud-building-blocks": { mentalModel: "Compute, network, storage, identity and managed data services have separate durability, availability and access boundaries.", experiment: "Map one Steward request to its instance, subnet, security policy, database and object-store dependency; name the owner of each.", fault: "A service being reachable publicly is not equivalent to its data being safely backed up." },
    "object-storage-implementation": { mentalModel: "Object storage addresses whole objects by keys and APIs, unlike block devices and POSIX filesystem mounts.", experiment: "Upload a synthetic Steward report with a distinct key, capture ETag/checksum semantics, retrieve it using a scoped credential and test access denial from another identity.", fault: "ETag is not always a plain MD5 checksum; verify bytes using a documented digest independent of implementation." },
    "infrastructure-as-code": { mentalModel: "IaC plans desired infrastructure state; its state file and credentials can themselves expose sensitive infrastructure details.", experiment: "In a disposable project, create a plan, inspect intended changes, apply with approval, repeat to check for drift and record state storage.", fault: "A clean plan does not guarantee service readiness; run application-level verification after apply." },
    "cloud-orchestration-gitops": { mentalModel: "Kubernetes reconciles declarative workload state; GitOps adds a repository-to-cluster reconciliation authority.", experiment: "Trace a Git change through reconciliation to a disposable deployment, then inspect pods, services, ingress and application endpoint.", fault: "A pod Running state is not proof of readiness; a working cluster dashboard is not proof of end-user service." },
    "progressive-delivery-canary": { mentalModel: "Canary delivery measures a small controlled exposure before general promotion.", experiment: "Send bounded synthetic traffic to the new version, compare error rates and latency with baseline, and define rollback thresholds before routing change.", fault: "A small sample may be inconclusive; do not promote solely because no error was observed in a handful of calls." },
    "cloud-architecture-and-cost": { mentalModel: "Cloud spend is driven by resource hours, storage, transfer, observability and operational labor; availability design changes total cost.", experiment: "Estimate a modest monthly Steward deployment under two architectures, including backups, outbound traffic and one restore test.", fault: "Lowest headline VM price can omit egress, snapshots and recovery costs; document assumptions." },
    "steward-internet-environment": { mentalModel: "The milestone must connect DNS, ingress, TLS, app deployment, data persistence, monitoring and recovery.", experiment: "Walk one external synthetic request through each dependency; fail one disposable component and prove restoration of the same request.", fault: "Do not call a live environment complete from individual green resource dashboards without end-to-end evidence." },
};
function teachCloudPath(path: LearningPath): LearningPath {
    const guide = cloudBoundaries[path.id];
    if (!guide) throw new Error(`Missing Cloud Engineer instructional model for ${path.id}`);
    return { ...path, lessons: [{
        id: `${path.id}-operational-model`,
        title: `Worked cloud boundary: ${path.title}`,
        activities: [{ id: `${path.id}-operational-model-reading`, title: "Concept, exercise and failure analysis", estimatedMinutes: 35,
            content: { type: "reading", body: guide.mentalModel, blocks: [
                { type: "heading", id: "mental-model", text: "Explain the system boundary", level: 2 },
                { type: "paragraph", text: guide.mentalModel },
                { type: "heading", id: "worked-experiment", text: "Worked Steward experiment", level: 2 },
                { type: "paragraph", text: guide.experiment },
                { type: "heading", id: "failure-analysis", text: "Failure diagnosis", level: 2 },
                { type: "paragraph", text: guide.fault },
                { type: "paragraph", text: "Execute only with disposable resources or explicitly approved cloud accounts. Preserve resource identity, budget constraints, known-good configuration and recovery evidence." },
            ] } }],
    }, ...path.lessons] };
}

const cloudEngineerSourcePaths: LearningPath[] = [
    cloudAndHostingModels,
    vpsOperations,
    internetNetworking,
    certificateLifecycleOperations,
    cloudBuildingBlocks,
    objectStorageImplementation,
    infrastructureAsCode,
    cloudOrchestrationGitOps,
    progressiveDeliveryCanary,
    cloudArchitectureAndCost,
    stewardInternetEnvironment,
];

export const cloudEngineerPaths: LearningPath[] = cloudEngineerSourcePaths.map(teachCloudPath);
