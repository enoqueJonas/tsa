import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { cloudAndHostingModelsDeepLessons } from "./cloud-hosting-models-deep";

const practices: Record<string, PracticalContent> = {
    "On-premises, Colocation, VPS and Cloud": {
        type: "practical",
        objective: "Choose Steward's next hosting boundary from concrete constraints rather than from the label that sounds most modern.",
        scenario: "Steward already has a working Rocky Linux homelab and disciplined delivery path. The next problem is controlled internet reachability and geographic separation, not replacing working infrastructure for fashion.",
        instructions: [
            "Write the exact new requirement the homelab does not satisfy, such as internet reachability, geographic separation or provider-managed physical infrastructure.",
            "Compare the current homelab, colocation, one budget VPS design and one broader public-cloud design against cost, provisioning time, control, recovery, reachability and expected growth.",
            "Reject at least one option explicitly and record the constraint that makes it a poor fit today.",
            "Choose the smallest credible next-stage model and define the future condition that would justify moving beyond it.",
            "Record which existing Delivery Engineer capabilities must survive the move unchanged: immutable artifacts, Jenkins evidence, Nexus identities, Ansible state and release traceability.",
        ],
        deliverables: ["Hosting constraint matrix", "Adopt/reject decision", "Delivery-capability continuity map"],
        completionCriteria: ["The decision starts from a real Steward requirement.", "At least one technically possible option is rejected for a concrete reason.", "Cloud adoption does not discard evidence or automation already earned in earlier schools."],
    },
    "IaaS, PaaS and SaaS": {
        type: "practical",
        objective: "Make provider-versus-Steward ownership explicit for one IaaS design and one more-managed alternative.",
        scenario: "A VPS can make Steward internet-reachable while leaving Linux, Docker and runtime operations in your hands. Managed services can remove toil, but only by moving a specific responsibility boundary.",
        instructions: [
            "Model Steward API, PostgreSQL, DNS, TLS, backups and operating-system patching in a VPS/IaaS design.",
            "Model one more-managed alternative, such as managed PostgreSQL or a PaaS runtime, without changing every component at once.",
            "For every component, assign provider responsibility and learner/operator responsibility.",
            "Identify one failure or maintenance task that disappears from your scope in the managed option and one responsibility that remains yours anyway.",
            "Decide whether the managed option solves enough real toil to justify its added cost or coupling now.",
        ],
        deliverables: ["Two responsibility maps", "Managed-service toil comparison", "Adopt/defer decision"],
        completionCriteria: ["Provider ownership is not confused with customer responsibility.", "The comparison changes one meaningful boundary at a time.", "The managed-service decision is justified by current Steward needs."],
    },
    "Regions, Zones and Availability Concepts": {
        type: "practical",
        objective: "Choose a realistic geographic and failure-domain placement for Steward without pretending a multi-zone diagram creates availability by itself.",
        scenario: "The learner can now place Steward outside the homelab, but budget and architecture still matter. Extra zones are useful only when application and data design can exploit them.",
        instructions: [
            "Choose two plausible provider regions and record latency-to-Mozambique assumptions, service availability, legal/data-location considerations and price differences.",
            "List every current Steward single point of failure that would remain even if a second VM existed in another zone.",
            "Sketch what true multi-zone operation would additionally require for application instances, PostgreSQL, traffic distribution and operations.",
            "Choose single-zone or multi-zone for the next deployment and justify the decision against budget and availability requirements.",
            "State the measurable requirement that would trigger revisiting the choice later.",
        ],
        deliverables: ["Region comparison", "Single-point-of-failure inventory", "Zone-placement decision"],
        completionCriteria: ["Region choice includes non-technical constraints as well as latency.", "The learner does not equate a second VM with high availability.", "Complexity is deferred unless a requirement earns it."],
    },
    "Shared Responsibility": {
        type: "practical",
        objective: "Turn shared responsibility from a provider slogan into an owned and testable Steward operations matrix.",
        scenario: "After moving Steward remotely, ambiguity about patching, firewalling, backups or credentials would create a dangerous assumption that the provider is handling work that still belongs to you.",
        instructions: [
            "Build a responsibility matrix covering facility, hypervisor, guest OS, SSH, firewalls, container runtime, PostgreSQL, application, DNS, TLS, backups and recovery.",
            "Mark the evidence currently available for each responsibility and flag entries with an owner but no proof.",
            "Pick one ambiguous responsibility and design a verification experiment for the later VPS Operations module.",
            "For backups, distinguish provider snapshot capability from your own retention, protection and restore obligations.",
            "Review the matrix and remove any responsibility that was assigned merely by assumption rather than provider documentation or your architecture decision.",
        ],
        deliverables: ["Shared-responsibility matrix", "Evidence-gap list", "Planned verification experiment"],
        completionCriteria: ["Every important responsibility has an explicit owner.", "Provider feature availability is not treated as evidence of recovery capability.", "At least one ambiguity is converted into a later testable task."],
    },
    "Elasticity and Consumption Models": {
        type: "practical",
        objective: "Decide how Steward should respond to a realistic demand increase and prove whether elasticity is currently an architectural need or just an available provider feature.",
        scenario: "Cloud APIs can create resources quickly, but Steward is not automatically horizontally scalable simply because another VM or container can be started.",
        instructions: [
            "Define one realistic workload increase for Steward with a concrete symptom such as CPU pressure, request latency or concurrent-user growth.",
            "Compare vertical scaling with horizontal scaling as the first response.",
            "For horizontal scaling, enumerate required changes around statelessness, sessions, shared data, migrations, load distribution and background work.",
            "Identify one controlled measurement you would collect before adding capacity and one after the change.",
            "List at least two allocated cloud resources that can continue producing cost after an experiment and define their cleanup owner.",
            "Choose scale-up, scale-out or no scaling yet and record why."
        ],
        deliverables: ["Demand scenario", "Scaling dependency map", "Capacity decision and cleanup plan"],
        completionCriteria: ["Scaling begins with an observed or plausible capacity problem.", "Horizontal scaling dependencies are explicit.", "Elasticity is not adopted merely because the provider supports it."],
    },
    "Cloud Cost Awareness": {
        type: "practical",
        objective: "Create a cost model that can constrain Steward architecture before resources are provisioned and later be checked against actual spend.",
        scenario: "A technically correct internet environment is still a poor engineering outcome if its monthly cost is unexplained, unbounded or dominated by forgotten resources.",
        instructions: [
            "List every billable resource in the smallest credible Steward remote environment, including compute, storage, snapshots/backups, public IP, DNS and expected transfer.",
            "Separate allocated/fixed costs from usage-dependent costs and record the assumption behind each estimate.",
            "Add one deliberately more-managed alternative and calculate its incremental monthly cost.",
            "Define a budget threshold and the exact review action that occurs when actual spend crosses it.",
            "Create an experiment cleanup checklist covering instances, disks, snapshots, reserved public addresses and any other resources that may survive after compute is stopped.",
            "After the first real deployment, compare actual provider billing against this model and explain the largest variance."
        ],
        deliverables: ["Monthly cost model", "Managed-option delta", "Budget action rule", "Resource cleanup checklist"],
        completionCriteria: ["Cost estimates expose their assumptions.", "The learner can name resources that cost money while idle.", "The design includes a feedback loop from estimate to actual bill rather than treating pricing as a one-time exercise."],
    },
};

function enrichLesson(lesson: Lesson): Lesson {
    const practice = practices[lesson.title];
    if (!practice) return lesson;
    return {
        ...lesson,
        activities: lesson.activities.map((activity) => {
            if (activity.content.type !== "practical") return activity;
            return {
                ...activity,
                title: `${lesson.title}: Steward Investigation`,
                estimatedMinutes: 60,
                content: practice,
            };
        }),
    };
}

export const cloudAndHostingModelsQualityLessons: Lesson[] = cloudAndHostingModelsDeepLessons.map(enrichLesson);
