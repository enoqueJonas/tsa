import type { Activity } from "../activities";
import type { Lesson } from "./lesson";
import type { LessonBlock } from "../activities/content";
import { proposalLenses } from "./professional-engineer-proposal-teaching";
import { proposalPrograms } from "./professional-engineer-proposal-proofs";

const pathId = "capstone-engineering-proposal";
const scenario = "Use the approved Capstone Discovery Brief as the source of truth. The proposal must turn understood outcomes, constraints, quality attributes, risks and evidence needs into a coherent engineering approach for a new system. Do not copy Steward architecture or select technologies because TSA previously used them.";
const completion = ["The proposal traces important engineering choices to discovered needs, constraints, risks or evidence requirements.", "Alternatives, trade-offs, assumptions and unresolved risks are explicit rather than hidden behind diagrams or tool names.", "The proposal is sufficiently concrete to guide an independent build while remaining revisable when implementation evidence disproves assumptions."];

function reading(id: string, title: string, body: string, practice: string[]): Lesson {
    // Remediate the REAL authored reading. Do not inject generic preparation
    // activities before the practical or replace its stable activity IDs.
    const lens = proposalLenses[id];
    if (!lens) throw new Error("Missing original proposal instructional evidence: " + id);
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: body },
        { type: "heading", id: "full-mechanism", text: "Mechanism, a worked decision, failure and counterargument", level: 2 },
    ];
    for (const [index, section] of lens.sections.entries()) {
        blocks.push({ type: "heading", id: "worked-section-" + (index + 1), text: section.title, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
    }
    const program = proposalPrograms[id];
    if (program) {
        blocks.push({ type: "heading", id: "executable-proof", text: "Run and challenge an executable example", level: 2 });
        blocks.push({ type: "code", language: "python", code: program.code, caption: program.caption });
        blocks.push({ type: "paragraph", text: program.expected });
    }
    blocks.push({ type: "heading", id: "transfer-to-your-capstone", text: "Transfer beyond this fictional scenario", level: 2 });
    blocks.push({ type: "paragraph", text: "The community tool-lending example is an explicitly fictional teaching fixture. Do not present its users, volumes, decisions, prices or constraints as observed research. Replace it with your NEW independent capstone domain, cite discovery evidence, and preserve uncertainty. A correct worked example is not a capstone deliverable." });
    blocks.push({ type: "resources", title: "Targeted further reading", resources: [lens.resource] });
    const readingActivity: Activity = {
        id: `${pathId}-${id}-001`, title, estimatedMinutes: 55,
        content: {
            type: "reading",
            body: blocks.filter((block) => block.type === "paragraph").map((block) => block.text).join("\n\n"),
            blocks,
        },
    };
    const applicationActivity: Activity = {
        id: `${pathId}-${id}-application`, title: `Proposal work: ${title}`, estimatedMinutes: 70,
        content: {
            type: "practical",
            objective: `Produce the ${title} portion of the evolving capstone proposal from discovery evidence.`,
            scenario,
            instructions: [
                ...practice,
                ...lens.practice,
                "Link this section to a discoverable requirement and one actual source of evidence. If the evidence is missing, mark it NOT TESTED / ASSUMPTION; never fill the gap with the fictional worked fixture.",
                "Revise the SINGLE evolving proposal artifact, not a disconnected exercise file. Preserve a rejected alternative and explicit revisit trigger.",
            ],
            deliverables: [`${title} proposal artifact`, "Discovery evidence and claim-to-decision trace", "Negative case with expected failure", "Rejected alternative and revisit condition"],
            completionCriteria: [...completion, ...lens.acceptance],
        },
    };
    return { id: `${pathId}-${id}`, title, activities: [readingActivity, applicationActivity] };
}

const originalProposalLessons: Lesson[] = [
    reading("system-context-and-boundaries", "System Context and Boundaries", "Define what the system is responsible for, what remains outside it, who or what interacts with it, and which external dependencies cross the boundary. Boundaries are responsibility decisions, not merely boxes on a diagram. A useful context view exposes actors, external systems, trust/dependency relationships and ownership boundaries without prematurely decomposing the internals.", ["Create a solution-neutral context diagram from the Discovery Brief.", "State system responsibilities and explicit exclusions.", "Mark external dependencies, owners and assumptions that could invalidate the boundary."]),
    reading("domain-and-data-model-proposal", "Domain and Data Model Proposal", "Translate the problem language into a proposed domain model and information model. Identify concepts, identities, relationships, invariants, lifecycle states, ownership and data sensitivity. Do not start with database tables. The proposal should explain where consistency matters, what data is authoritative, what can be derived and which unknowns require validation during implementation.", ["Build a domain glossary and conceptual model.", "Identify key invariants and lifecycle transitions.", "Classify important data, ownership, retention assumptions and consistency needs."]),
    reading("architecture-proposal", "Architecture Proposal", "Architecture is the set of consequential structural decisions needed to satisfy the capstone's quality attributes and constraints. Prefer the simplest structure that credibly meets current evidence. Compare realistic alternatives, including a deliberately simple option, and resist introducing services, queues, caches or distributed boundaries merely to demonstrate them.", ["Propose the smallest credible architecture and at least one alternative.", "Trace major structural choices to quality attributes and risks.", "Record rejected complexity and the evidence that would justify adding it later."]),
    reading("infrastructure-and-hosting-proposal", "Infrastructure and Hosting Proposal", "Choose compute, network, storage, data services and environment topology from operational requirements rather than familiarity. Evaluate availability needs, security boundaries, data requirements, recovery, maintainability, portability and cost. Managed services, containers, VMs and cloud platforms are means, not goals.", ["Describe target environments and infrastructure responsibilities.", "Compare credible hosting choices using capstone constraints.", "Identify failure, recovery, access and cost assumptions requiring proof."]),
    reading("delivery-plan", "Delivery Plan", "Design how changes move safely from source to usable releases. The plan should cover version control, review, build, tests, artifact creation, environments, deployment, configuration, secrets, promotion, rollback and evidence. Automation should reduce repeatable risk while preserving explicit decisions where risk genuinely requires judgment.", ["Draw the proposed change-to-production path.", "Define automated gates and evidence produced at each stage.", "Identify rollback/recovery paths and any justified manual decisions."]),
    reading("quality-strategy", "Quality Strategy", "Quality strategy begins with product risks and desired behavior, not a list of test types. Decide what must be prevented, detected or explored at each layer; where automation provides durable evidence; and where human investigation remains valuable. Include functional and relevant non-functional evidence without pursuing arbitrary coverage numbers.", ["Map product risks to test/evidence techniques.", "Define the intended test layers and ownership.", "State what will not be automated and why."]),
    reading("security-strategy", "Security Strategy", "Turn the capstone's assets, trust boundaries, threat exposure and data sensitivity into proportionate security objectives and controls. Reuse Security Steward reasoning, but perform a new threat assessment for this domain. Security claims must ultimately be testable or evidenced; framework labels alone do not establish protection.", ["Identify critical assets, trust boundaries and likely threat scenarios.", "Propose preventive, detective and recovery controls tied to those threats.", "Define security evidence expected before release."]),
    reading("reliability-strategy", "Reliability Strategy", "Define what reliable service means for this system and how it will be observed, protected and recovered. Availability targets, failure handling, observability, capacity, backup and recovery should reflect stakeholder impact and cost. Do not import Steward SLOs or resilience patterns without a capstone-specific reason.", ["Propose service indicators/objectives where justified.", "Identify important failure modes and resilience responses.", "Define evidence for recovery, capacity and failure behavior."]),
    reading("operational-model", "Operational Model", "A production-style system needs an explicit model for ownership after deployment: monitoring, support, incidents, changes, maintenance, access, dependency updates, backups and escalation. Design operations alongside software so that the system is not handed to an imaginary operator after implementation.", ["Define service ownership and operational responsibilities.", "Describe normal operations and credible incident/escalation paths.", "Identify required runbooks, access and maintenance routines."]),
    reading("cost-model", "Cost Model", "Engineering proposals consume money, time and human attention. Estimate material build and operating costs, identify dominant cost drivers and connect spending to required outcomes. Precision is less important than transparent assumptions, ranges and sensitivity. A cheaper design can be superior when additional complexity buys no meaningful value.", ["Estimate infrastructure/service and meaningful engineering/operational costs.", "List assumptions and cost drivers.", "Identify scaling thresholds or decisions that materially change cost."]),
    reading("governance-approach", "Governance Approach", "Define only the decision rights, evidence, controls, standards, exceptions and review cadence needed to keep consequential engineering decisions accountable. The capstone should demonstrate stewardship without recreating a large organization's bureaucracy. Routine low-risk work should remain fast; material risk acceptance must have an explicit owner.", ["Define major decision owners and review points.", "Identify minimum controls/evidence for consequential changes.", "Define how exceptions and residual-risk acceptance will be recorded."]),
    reading("dependency-and-internal-platform-decisions", "Dependency and Internal Platform Decisions", "Evaluate external dependencies and TSA internal capabilities as engineering choices. Existing TSA capabilities may be considered only where they actually exist and their contracts genuinely fit: Nexus has required implementation history, while steward-common is available only if its earlier real-consumer extraction gate was earned. tsa-test-core is different: it does not exist yet. Quality Steward handed forward only candidate reusable testing capabilities. The capstone must first build its own test infrastructure from its own risks; only later may two-consumer evidence earn extraction and publication of tsa-test-core. Reuse can reduce duplicated capability, but it also creates coupling, lifecycle, availability and legal/licensing obligations. Package provenance does not establish permission to use, modify or redistribute it; license terms and notices must be compatible with how the capstone is built and delivered.", ["Inventory important proposed dependencies and their owners/sources.", "Evaluate each existing relevant TSA internal capability as reuse, evolve or reject.", "Record tsa-test-core only as a deferred extraction hypothesis whose decision is blocked until the capstone has an independent test baseline.", "Define provenance, version/support and exit expectations for dependencies that actually exist.", "Identify material dependency licenses/notice obligations and flag incompatible, unknown or organization-policy-restricted terms before implementation commits to them."]),
    reading("implementation-milestones", "Implementation Milestones", "Convert the proposal into thin, evidence-producing increments rather than a component checklist. Early milestones should retire important uncertainty and prove end-to-end behavior. Sequence work around dependencies and risk, preserve demonstrable states, and avoid a long infrastructure phase followed by a late integration surprise.", ["Define milestone outcomes and evidence, not only tasks.", "Prioritize early retirement of high-impact uncertainty.", "Show dependencies, decision points and scope that can be deferred."]),
    reading("architecture-and-risk-review", "Architecture and Risk Review", "Before implementation, challenge the proposal as a coherent system. Test whether architectural choices actually address quality attributes, whether risks have owners/treatments, whether controls are proportionate, whether costs and operations are credible, and whether complexity is justified. The review may approve, conditionally approve, simplify or reject the proposal.", ["Run a structured challenge against discovery evidence and the risk register.", "Identify contradictions, unsupported claims and unnecessary complexity.", "Record decisions, conditions, residual risks and proposal changes."]),
    {
        id: `${pathId}-lab-defend-the-capstone-engineering-proposal`,
        title: "Lab: Defend the Capstone Engineering Proposal",
        activities: [{ id: `${pathId}-lab-defend-the-capstone-engineering-proposal-001`, title: "Lab: Defend the Capstone Engineering Proposal", estimatedMinutes: 85, content: { type: "practical", objective: "Produce and defend a coherent engineering proposal that turns the approved discovery evidence into an implementable, risk-aware plan without copying Steward.", scenario, instructions: ["Phase 1 — Build the proposal: context/boundaries, domain/data model, architecture, infrastructure, delivery, quality, security, reliability and operations.", "Phase 2 — Make economics and stewardship explicit: cost model, governance, dependency/internal-platform decisions, implementation milestones and risk ownership.", "Phase 3 — Conduct an adversarial architecture-and-risk review. Challenge assumptions, complexity, evidence gaps, failure/recovery claims, cost and operational feasibility.", "Revise the proposal from review evidence. Record at least one meaningful rejected alternative and at least one deliberate simplicity/retain-current-choice decision.", "Produce a final go, conditional-go or redesign decision for entering Independent Build, with unresolved assumptions and validation experiments visible."], deliverables: ["Capstone engineering proposal", "System context and domain/data model", "Architecture and infrastructure decision set", "Delivery, quality, security and reliability strategies", "Operational and cost model", "Governance and dependency decisions", "Implementation milestone plan", "Architecture/risk review record and final decision"], completionCriteria: completion } }],
    },
];

function proposalGate(id: string, title: string, objective: string, instructions: string[], acceptance: string[], questions: string[]): Lesson {
    const stableId = pathId + "-" + id;
    return {
        id: stableId,
        title,
        activities: [
            {
                id: stableId + "-practice",
                title: "Integrated evidence: " + title,
                estimatedMinutes: 105,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Integrate the chapters already taught in the ONE independent, non-Steward capstone proposal. The community tool-lending narrative is an example only. Prefer source evidence from your own newly discovered domain.",
                    instructions,
                    deliverables: ["One updated capstone proposal, not duplicate files", "Traceable positive and rejected counterexample", "Evidence/unknown/owner matrix", "Decisions and explicit revisit triggers"],
                    completionCriteria: [
                        ...acceptance,
                        "No claim is promoted from proposed or simulated to VERIFIED without a real matching execution or primary evidence.",
                        "The reviewer can reconstruct both an accepted and rejected decision without oral explanation.",
                    ],
                },
            },
            {
                id: stableId + "-check",
                title: "Counterfactual check: " + title,
                estimatedMinutes: 15,
                content: { type: "reflection", prompt: questions.map((q, i) => (i + 1) + ". " + q).join("\n") },
            },
        ],
    };
}
const boundaryGate = proposalGate(
    "stage-domain-boundary-decision",
    "Stage A: Domain, Architecture and Hosting Proof",
    "Produce a single trace from stakeholder evidence to domain invariant, system boundary, hosting responsibility and a defensible architecture choice.",
    [
        "Choose one high-consequence action in your new domain; identify the authoritative data owner, actor permissions, state transition and consistency requirement.",
        "Draw a system-context view and a separate deployment view; explain which details each one deliberately excludes.",
        "Compare a simple modular deployment to an alternative and document what measured need could reverse your choice.",
        "Model an external dependency timeout and a concurrent update. Show where invalid state could appear and which data/application boundary must stop it.",
        "Attach an evidence table with one demonstrated fact, one stated assumption and one excluded capability.",
    ],
    ["Domain terms and deployment components are not conflated.", "One invalid-state scenario has an observable rejection condition, not merely a diagram."],
    ["Which actual discovery evidence motivates this boundary?", "How would two concurrent clients expose an invalid shortcut?", "What result would cause you to abandon the simpler architecture?"]
);
const deliveryGate = proposalGate(
    "stage-quality-security-operations",
    "Stage B: Delivery, Quality, Security and Operations Proof",
    "Integrate the implementation's delivery and operating safety claims into one falsifiable path.",
    [
        "Select a consequential change that affects persistence or permissions; trace source revision, artifact identity, migrations, deployment and post-deploy verification.",
        "Name a normal authorized request and a signed unauthorized request, including expected database side effects and logs.",
        "Identify one ambiguous network/commit failure and define how retries avoid duplicate domain effects.",
        "Show a recovery objective and a restore drill whose current result is PASS, FAIL or NOT TESTED with an actual evidence source.",
        "Show who owns diagnosis, who can authorize a stop/promotion decision and what is never permitted to be mislabeled as passing.",
    ],
    ["Every proposed gate has a producing verification action and a failure response.", "A failed or missing critical recovery result prevents a false technical go decision."],
    ["Why does a green unit suite fail to establish safe deployment?", "Which signed request proves cross-ownership denial?", "What evidence distinguishes rollback from a recoverable forward migration?"]
);
const decisionGate = proposalGate(
    "stage-cost-governance-review",
    "Stage C: Cost, Dependencies, Governance and Counterfactual Review",
    "Challenge the combined capstone proposal's economics, dependencies, accountability and milestone sequencing.",
    [
        "Present a bounded monthly cost model with units, labor omissions and two volume/cost sensitivities. Recalculate one adverse scenario.",
        "Trace one external or internal package dependency to its actual consumer and interface. Reject an unearned tsa-test-core or steward-common dependency unless its real release/consumer evidence exists.",
        "Replace a layers-only implementation plan with three demonstrable vertical increments, each with a negative oracle.",
        "Have a reviewer challenge one authority/permission assumption, one outage/recovery promise and one hidden operational cost. Mark SELF-REVIEW if no independent reviewer participated.",
        "Record GO for scoped build investigation, CONDITIONAL GO with an evidence owner, or REDESIGN. Never confuse permission to begin implementation with production approval.",
    ],
    ["A changed price, user load or dependency failure could realistically reverse at least one choice.", "The decision record retains an unsupported claim as FAIL or NOT TESTED, not PASS."],
    ["What price or workload change would overturn the baseline?", "Which dependency exists only as a hypothetical future package?", "How would an unseen reviewer find and disprove a hidden premise?"]
);

export const capstoneEngineeringProposalDeepLessons: Lesson[] = originalProposalLessons.flatMap((lesson, index) => {
    if (index === 3) return [lesson, boundaryGate];
    if (index === 8) return [lesson, deliveryGate];
    if (index === 13) return [lesson, decisionGate];
    return [lesson];
});
