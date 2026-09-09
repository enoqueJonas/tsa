import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const awsSharedResponsibility: LearningResource = { title: "AWS Shared Responsibility Model", url: "https://aws.amazon.com/compliance/shared-responsibility-model/" };
const azureRegions: LearningResource = { title: "Microsoft Azure geographies and regions", url: "https://learn.microsoft.com/en-us/azure/reliability/regions-overview" };
const cloudflareLearning: LearningResource = { title: "Cloudflare Learning Center — What is cloud computing?", url: "https://www.cloudflare.com/learning/cloud/what-is-the-cloud/" };
const digitalOceanCloud: LearningResource = { title: "DigitalOcean — What is cloud computing?", url: "https://www.digitalocean.com/resources/articles/what-is-cloud-computing" };
const finops: LearningResource = { title: "FinOps Foundation — What is FinOps?", url: "https://www.finops.org/introduction/what-is-finops/" };

interface LessonSpec {
    id: string;
    title: string;
    intro: string;
    sections: Array<{ heading: string; paragraphs: string[]; list?: string[]; code?: { language: string; code: string; caption?: string } }>;
    practice: string[];
    questions: string[];
    resources: LearningResource[];
}

function richLesson(spec: LessonSpec): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: spec.intro }];
    for (const section of spec.sections) {
        blocks.push({ type: "heading", id: section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text: section.heading, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
        if (section.list) blocks.push({ type: "list", items: section.list });
        if (section.code) blocks.push({ type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward cloud checkpoint", body: "Compare every hosting option against Steward's existing homelab and delivery platform. Cloud adoption should solve a concrete reachability, availability, operational or scaling problem rather than replace working infrastructure merely because a provider offers it." });
    blocks.push({ type: "resources", title: "Continue learning", resources: spec.resources });

    return {
        id: `cloud-and-hosting-models-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `cloud-and-hosting-models-${spec.id}-001`, title: spec.title, estimatedMinutes: 40, content: { type: "reading", body: spec.intro, blocks } },
            {
                id: `cloud-and-hosting-models-${spec.id}-002`,
                title: `Apply: ${spec.title}`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective: `Apply ${spec.title} to the Steward platform.`,
                    scenario: "Steward already runs through a disciplined homelab delivery path. Evaluate remote hosting without discarding the engineering evidence, artifact identity, networking and recovery practices already established.",
                    instructions: spec.practice,
                    deliverables: ["Hosting-model comparison evidence", "Short engineering decision note", "Explicit cost and responsibility assumptions"],
                    completionCriteria: ["The comparison uses concrete Steward requirements.", "Responsibilities are assigned rather than assumed.", "Cost and operational trade-offs are visible."],
                },
            },
            { id: `cloud-and-hosting-models-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: spec.questions.join("\n\n"), minimumCharacters: 180 } },
        ],
    };
}

const specs: LessonSpec[] = [
    {
        id: "on-prem-colocation-vps-cloud",
        title: "On-premises, Colocation, VPS and Cloud",
        intro: "Hosting models differ mainly in who owns the physical infrastructure, how capacity is obtained and which operational responsibilities move to a provider. The right model depends on constraints, not on which label sounds most modern.",
        sections: [
            { heading: "Four different operating boundaries", paragraphs: ["On-premises means the organization owns or directly controls the facility and hardware. Colocation moves owned hardware into a third-party facility that provides space, power and connectivity. A VPS rents a virtual server on provider-owned infrastructure. Cloud platforms expose programmable pools of compute, storage, networking and managed services through APIs.", "These models can overlap in practice, but they imply different capital costs, provisioning speeds, recovery options and control boundaries."], list: ["On-premises: highest physical control, highest facility/hardware responsibility.", "Colocation: owned hardware with outsourced facility operations.", "VPS: rented virtual machine with relatively simple pricing and operations.", "Cloud: programmable infrastructure and managed-service ecosystem with broad service choice and variable consumption pricing."] },
            { heading: "Steward does not need a fashionable answer", paragraphs: ["The existing homelab is already useful because it teaches operating-system, networking and delivery ownership. Moving Steward remotely should therefore solve a new requirement such as external reachability, provider-managed infrastructure, geographic separation or reproducible internet hosting.", "A low-cost VPS may be more appropriate than a large cloud architecture for the next stage because it preserves Linux and delivery skills while adding real internet exposure." ] },
            { heading: "Compare by constraints", paragraphs: ["Use requirements such as budget, availability target, latency, data sensitivity, administrative control, recovery capability and expected growth. A model that is technically capable but financially or operationally excessive is still a poor design."] },
        ],
        practice: ["Create a four-column comparison for Steward across homelab/on-prem, colocation, VPS and public cloud.", "Score each option on cost, setup speed, operational control, internet exposure, recovery options and scalability.", "Choose the best next-stage hosting model for Steward and state which future condition would justify changing that choice."],
        questions: ["Why is a VPS not simply the same thing as a full public-cloud architecture?", "Which requirement would justify moving Steward away from the homelab, and which requirement would not?"],
        resources: [cloudflareLearning, digitalOceanCloud],
    },
    {
        id: "iaas-paas-saas",
        title: "IaaS, PaaS and SaaS",
        intro: "IaaS, PaaS and SaaS describe different levels at which a provider takes responsibility for the technology stack. The distinction matters because managed convenience always changes both control and operational ownership.",
        sections: [
            { heading: "What you still operate", paragraphs: ["With Infrastructure as a Service, the provider typically operates physical infrastructure and virtualization while you operate the guest OS, runtime, application and much of the network configuration. Platform as a Service moves more runtime and platform operations to the provider. Software as a Service delivers a finished application that you configure and consume."], list: ["IaaS: you still operate servers and application runtime.", "PaaS: provider operates more of the runtime/platform lifecycle.", "SaaS: provider operates the application; you configure and use it."] },
            { heading: "Managed does not mean responsibility disappears", paragraphs: ["PaaS can remove patching or database-host operations, but the application team still owns data design, access policy, configuration and application behavior. SaaS can remove application hosting entirely while leaving identity, data use and integration decisions with the customer."] },
            { heading: "Use Steward to make the boundary concrete", paragraphs: ["Running Steward on a VPS is primarily an IaaS-style experience: you still manage Linux, Docker, patching and the application process. Moving PostgreSQL to a managed database would selectively shift database host operations without changing the rest of the stack."] },
        ],
        practice: ["Map Steward API, PostgreSQL, DNS, TLS and backups across one IaaS design and one more-managed design.", "For each component, record what the provider operates and what you still own.", "Identify one managed service that would meaningfully reduce toil and one that would currently add unnecessary complexity."],
        questions: ["What responsibility remains yours when using PaaS?", "Why can a mixed architecture use both IaaS and managed services without being inconsistent?"],
        resources: [awsSharedResponsibility, digitalOceanCloud],
    },
    {
        id: "regions-zones-availability",
        title: "Regions, Zones and Availability Concepts",
        intro: "Cloud geography is part of system design. Regions and availability zones describe provider failure and latency boundaries, but deploying across them only helps when the application and data architecture can actually use that separation.",
        sections: [
            { heading: "Region versus zone", paragraphs: ["A region is a provider-defined geographic area containing one or more physically separated locations or zones. A zone is designed to reduce correlated failure with other zones in the same region, though exact provider implementation differs.", "The names are architectural signals, not guarantees of infinite independence. You still need to read provider documentation and design for the failure model you depend on."] },
            { heading: "Latency, residency and cost", paragraphs: ["Region choice affects user latency, legal or contractual data-location requirements, service availability and price. Inter-region or inter-zone traffic may also carry network costs that do not exist inside a single host."] },
            { heading: "Do not manufacture multi-zone complexity", paragraphs: ["A single budget Steward instance does not become reliable merely because a diagram shows two zones. True multi-zone availability requires redundant application instances, data strategy, load distribution and operational testing. Those decisions belong only when requirements justify them."] },
        ],
        practice: ["Choose two plausible provider regions for Steward and compare latency to Mozambique, service availability and cost assumptions.", "Identify which current Steward components are single points of failure even if the VM itself moved to a second zone.", "Document whether the next Steward deployment needs one zone or multiple zones and justify the choice."],
        questions: ["Why does moving a VM to another availability zone not automatically make the whole application highly available?", "Which non-technical factor can legitimately determine region choice?"],
        resources: [azureRegions],
    },
    {
        id: "shared-responsibility",
        title: "Shared Responsibility",
        intro: "Cloud providers operate part of the stack, but customers remain responsible for how services are configured, who can access them and what their applications do. Shared responsibility is the discipline of making that boundary explicit.",
        sections: [
            { heading: "Security and operations are divided", paragraphs: ["A provider may secure data-centre facilities, physical hosts and the virtualization layer while the customer secures guest operating systems, firewall rules, credentials, application dependencies and data access. The exact split changes by service model.", "The more managed the service, the more infrastructure work shifts provider-side, but customer responsibilities around identity, data, configuration and application logic remain substantial."] },
            { heading: "Responsibility must be written down", paragraphs: ["Ambiguity is dangerous because each side can assume the other is handling backups, patching, key rotation or incident recovery. For every important Steward component, name the provider responsibility and your responsibility explicitly."] },
            { heading: "Managed backup is not the same as your recovery plan", paragraphs: ["A provider may make snapshots available while you remain responsible for configuring them, retaining them, protecting them and proving that recovery meets your needs. Availability of a feature is not evidence that your system is protected."] },
        ],
        practice: ["Create a shared-responsibility matrix for Steward on a VPS covering physical host, hypervisor, guest OS, SSH, firewall, Docker, PostgreSQL, application, DNS and backups.", "Mark every responsibility that currently has no explicit owner or evidence.", "Choose one ambiguous responsibility and define how it will be verified in the later VPS Operations module."],
        questions: ["Why does using cloud infrastructure not transfer responsibility for guest OS patching by default?", "What is the difference between a provider offering backups and you having a tested recovery capability?"],
        resources: [awsSharedResponsibility],
    },
    {
        id: "elasticity-consumption",
        title: "Elasticity and Consumption Models",
        intro: "Cloud infrastructure can make capacity easier to add or remove, but elasticity is useful only when demand actually changes and the application architecture can scale safely.",
        sections: [
            { heading: "Scalability and elasticity are related but different", paragraphs: ["Scalability is the system's ability to handle additional load by increasing capacity. Elasticity adds dynamic adjustment: capacity grows and shrinks in response to demand. A service can be scalable without automatically elastic."] },
            { heading: "Vertical and horizontal capacity", paragraphs: ["Vertical scaling gives a machine more CPU, memory or storage. Horizontal scaling adds more application instances. Horizontal scaling introduces requirements around statelessness, load distribution, shared data and coordination that do not disappear because a cloud API can launch another VM."] },
            { heading: "Consumption pricing changes engineering behavior", paragraphs: ["Pay-as-you-go resources reduce upfront capital cost but make idle capacity, network traffic, managed services and retained storage visible on the monthly bill. The ability to provision quickly must be paired with the ability to identify and remove what is no longer needed."] },
        ],
        practice: ["Describe one realistic Steward demand increase and decide whether vertical or horizontal scaling is the better first response.", "List the architectural changes required before Steward API could safely run multiple instances.", "Identify two cloud resources that could continue generating cost after an experiment if forgotten."],
        questions: ["What is the difference between scalability and elasticity?", "Why is horizontal scaling not simply 'start another container'?"],
        resources: [digitalOceanCloud, finops],
    },
    {
        id: "cloud-cost-awareness",
        title: "Cloud Cost Awareness",
        intro: "Cloud cost is an architectural constraint. A technically correct design that produces uncontrolled or unexplained spend is not operationally complete.",
        sections: [
            { heading: "Know the units you are buying", paragraphs: ["Common cost drivers include compute time, allocated storage, snapshots, public IPv4 addresses, managed databases, load balancers, DNS, outbound traffic and retained logs. Some services charge while idle because the resource remains allocated.", "Pricing varies by provider and changes over time, so the engineering skill is not memorizing a price table. It is identifying which resources exist, how they are metered and what usage assumptions drive the estimate."] },
            { heading: "Estimate before provisioning", paragraphs: ["Before creating the Steward internet environment, write a monthly baseline estimate using the smallest credible resources. Include optional components separately so you can see exactly what a managed database or load balancer adds."] },
            { heading: "Cost controls are part of lifecycle", paragraphs: ["Tag or name resources clearly, define a budget, remove temporary environments and review the bill after experiments. Infrastructure as Code later makes the resource inventory more reproducible, but financial ownership starts before Terraform or OpenTofu appears."] },
            { heading: "A simple estimate", paragraphs: ["For a small VPS-style design, the model can remain intentionally simple."], code: { language: "text", caption: "Illustrative monthly cost model", code: "Compute VM             $6.00\nBlock storage          $2.00\nBackups/snapshots      $1.20\nDNS                    $0.50\nEstimated transfer     $1.00\n----------------------------\nBaseline              $10.70/month" } },
        ],
        practice: ["Create a monthly cost model for the smallest credible Steward remote environment.", "Separate fixed/allocated costs from usage-dependent costs.", "Add one deliberately more-managed alternative and quantify its incremental cost.", "Define a monthly budget threshold and what action you would take if actual spend exceeds it."],
        questions: ["Why can an idle cloud environment still cost money?", "Why should cost estimation happen before Infrastructure as Code is introduced?"],
        resources: [finops],
    },
];

const comparisonLab: Lesson = {
    id: "cloud-and-hosting-models-compare-hosting-lab",
    title: "Lab: Compare Homelab, VPS and Managed Cloud Hosting",
    activities: [
        {
            id: "cloud-and-hosting-models-compare-hosting-lab-001",
            title: "Hosting Decision Brief",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Choose the next hosting model for Steward using requirements, ownership and cost evidence rather than provider marketing.",
                scenario: "Steward already runs in the homelab through the Delivery Engineer platform. The next school must introduce a real internet-hosted environment while preserving the skills and evidence already built.",
                instructions: ["Define the remote-environment requirements: intended users, internet reachability, budget, availability expectations, administrative access and recovery expectations.", "Compare the existing homelab, one budget VPS option and one more-managed public-cloud option.", "For each option document responsibility boundaries, estimated monthly cost, failure domain, scaling path and operational work retained by you.", "Identify which existing Delivery Engineer capabilities can be reused unchanged and which must adapt for remote infrastructure."],
                deliverables: ["Requirements brief", "Three-option comparison matrix", "Responsibility matrix", "Monthly cost estimates"],
                completionCriteria: ["The options are compared against the same requirements.", "Costs include more than VM headline price.", "Provider-managed and learner-managed responsibilities are explicit."],
            },
        },
        {
            id: "cloud-and-hosting-models-compare-hosting-lab-002",
            title: "Select the Steward Remote Hosting Baseline",
            estimatedMinutes: 60,
            content: {
                type: "practical",
                objective: "Select a defensible hosting baseline that the rest of Cloud Engineer can implement.",
                scenario: "The next modules will provision a real remote server, publish Steward through DNS/TLS and later define infrastructure as code. Choose a baseline simple enough to operate and rich enough to teach the new cloud boundary.",
                instructions: ["Choose the preferred hosting model and justify the decision in writing.", "Define the initial region/location and smallest credible capacity.", "Record which managed services are intentionally deferred and why.", "State the condition that would trigger reevaluating VPS versus more-managed cloud architecture.", "Create a cost ceiling for the learning environment and a teardown/scale-down rule for temporary resources."],
                deliverables: ["Architecture decision", "Initial hosting baseline", "Explicit deferrals", "Cost ceiling and teardown rule"],
                completionCriteria: ["The choice is proportional to current Steward requirements.", "The design does not manufacture high availability or managed-service complexity.", "The learner can explain what new responsibility moves to the provider and what remains theirs."],
            },
        },
        {
            id: "cloud-and-hosting-models-compare-hosting-lab-003",
            title: "Cloud and Hosting Models Review",
            estimatedMinutes: 30,
            content: { type: "reflection", prompt: "Why is the selected remote hosting model a better next learning and engineering step for Steward than either leaving everything in the homelab or immediately building a multi-service managed-cloud architecture?\n\nWhich exact responsibility moves to the provider in your design, and which important responsibilities remain yours?", minimumCharacters: 250 },
        },
    ],
};

export const cloudAndHostingModelsDeepLessons: Lesson[] = [...specs.map(richLesson), comparisonLab];
