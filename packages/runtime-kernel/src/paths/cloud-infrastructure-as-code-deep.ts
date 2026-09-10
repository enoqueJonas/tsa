import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const terraformDocs: LearningResource = { title: "HashiCorp Terraform Documentation", url: "https://developer.hashicorp.com/terraform/docs" };
const openTofuDocs: LearningResource = { title: "OpenTofu Documentation", url: "https://opentofu.org/docs/" };
const terraformStateDocs: LearningResource = { title: "Terraform — State", url: "https://developer.hashicorp.com/terraform/language/state" };
const terraformModules: LearningResource = { title: "Terraform — Modules", url: "https://developer.hashicorp.com/terraform/language/modules" };

interface LessonSpec {
    id: string;
    title: string;
    intro: string;
    sections: Array<{ heading: string; paragraphs: string[]; list?: string[]; code?: { language: string; code: string; caption?: string } }>;
    practice: string[];
    questions: string[];
    resources?: LearningResource[];
}

function richLesson(spec: LessonSpec): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: spec.intro }];
    for (const section of spec.sections) {
        blocks.push({ type: "heading", id: section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text: section.heading, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
        if (section.list) blocks.push({ type: "list", items: section.list });
        if (section.code) blocks.push({ type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward IaC checkpoint", body: "Infrastructure as Code should make the already-reasoned Steward cloud target reproducible. Do not use Terraform or OpenTofu to hide unclear architecture behind configuration files. Every declared resource should trace back to an explicit requirement, boundary or operational responsibility." });
    blocks.push({ type: "resources", title: "Continue learning", resources: spec.resources ?? [terraformDocs, openTofuDocs] });

    return {
        id: `infrastructure-as-code-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `infrastructure-as-code-${spec.id}-001`, title: spec.title, estimatedMinutes: 40, content: { type: "reading", body: spec.intro, blocks } },
            { id: `infrastructure-as-code-${spec.id}-002`, title: `Apply: ${spec.title}`, estimatedMinutes: 45, content: { type: "practical", objective: `Apply ${spec.title} to the Steward target environment.`, scenario: "The target cloud architecture is already defined. Your job is to encode it safely, review changes before execution and preserve a trustworthy boundary between configuration, state, secrets and runtime deployment.", instructions: spec.practice, deliverables: ["IaC configuration or design evidence", "Plan/review evidence", "Short decision note"], completionCriteria: ["The configuration expresses intended infrastructure state.", "The learner can explain what the tool will create or change before applying it.", "Secrets and state are handled deliberately rather than committed casually."] } },
            { id: `infrastructure-as-code-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: spec.questions.join("\n\n"), minimumCharacters: 180 } },
        ],
    };
}

const specs: LessonSpec[] = [
    {
        id: "why-infrastructure-as-code",
        title: "Why Infrastructure as Code",
        intro: "Infrastructure as Code turns infrastructure changes into versioned, reviewable engineering changes. Its value is not that resources can be created faster; its value is that intended state, change history and repeatability become visible.",
        sections: [
            { heading: "Manual infrastructure accumulates hidden knowledge", paragraphs: ["Console-created resources often depend on the operator remembering which region, network, firewall rule, identity or storage option was chosen. That memory is not a reproducible system.", "IaC moves these choices into configuration that can be reviewed, tested and recreated."] },
            { heading: "Automation follows architecture", paragraphs: ["A bad design becomes repeatably bad when encoded as code. The Cloud Building Blocks module therefore came first: Steward already has a reasoned target architecture, and IaC now captures that design rather than inventing it."], list: ["Versioned intent", "Reviewable change", "Repeatable provisioning", "Detectable drift", "Documented dependencies", "Safer teardown and recreation"] },
        ],
        practice: ["List five current cloud decisions for Steward that would be unsafe to leave only in a provider console.", "For each, identify the desired state that IaC should record.", "Write one example of something that should remain outside IaC, such as application deployment or runtime business configuration, and explain why."],
        questions: ["Why is Infrastructure as Code more than faster provisioning?", "How can IaC make a poor architecture worse rather than better?"]
    },
    {
        id: "declarative-infrastructure",
        title: "Declarative Infrastructure",
        intro: "Declarative infrastructure describes the state you want and lets the tool determine the operations needed to reach it. This differs from scripting a sequence of imperative API calls.",
        sections: [
            { heading: "Desired state instead of command history", paragraphs: ["An imperative script might say create network, then create subnet, then create server. A declarative configuration says the network, subnet and server should exist with these properties. The engine compares configuration, state and provider reality to determine the change set."] },
            { heading: "Declarative does not mean consequence-free", paragraphs: ["Changing one property may force replacement instead of in-place mutation. A declarative tool can destroy and recreate resources correctly according to its model while still violating your operational expectations. Plans must therefore be read, not merely generated." ] },
        ],
        practice: ["Take one current manual Steward provisioning procedure and rewrite it as desired-state statements.", "Identify one property where a change could require resource replacement.", "Explain what evidence you would require before allowing that replacement."],
        questions: ["What is the difference between desired state and command history?", "Why can a declarative change still be operationally dangerous?"]
    },
    {
        id: "terraform-opentofu-fundamentals",
        title: "Terraform and OpenTofu Fundamentals",
        intro: "Terraform and OpenTofu use declarative configuration to manage infrastructure through provider plugins. The core concepts are more important than memorizing one tool's command syntax.",
        sections: [
            { heading: "The basic workflow", paragraphs: ["Configuration defines resources and data relationships. Initialization installs providers and prepares the working directory. Planning calculates proposed changes. Applying executes an approved plan. State records the resource identities the tool manages."], code: { language: "bash", caption: "Typical workflow", code: "tofu init\ntofu fmt -check\ntofu validate\ntofu plan -out=steward.tfplan\ntofu apply steward.tfplan" } },
            { heading: "Tool choice should not dominate the lesson", paragraphs: ["Terraform and OpenTofu share the same fundamental model for this curriculum. The engineering skill is understanding providers, state, dependencies, planning and lifecycle—not attaching professional identity to one executable."] },
        ],
        practice: ["Install or inspect Terraform/OpenTofu in a clean workspace.", "Create a minimal configuration block and run formatting and validation.", "Record what init, validate, plan and apply each prove—and what they do not prove."],
        questions: ["What information does plan provide that validate does not?", "Why should the curriculum focus on the IaC model rather than one vendor command?"]
    },
    {
        id: "providers-resources",
        title: "Providers and Resources",
        intro: "Providers translate declarative configuration into API operations for external systems. Resources are managed objects whose lifecycle the IaC engine tracks.",
        sections: [
            { heading: "Providers are trust and compatibility boundaries", paragraphs: ["A provider runs with credentials capable of changing infrastructure. Its version and configuration therefore matter. Pin versions intentionally and understand which APIs the provider will call."] },
            { heading: "Resources should mirror architectural intent", paragraphs: ["A virtual network, firewall rule, VM or object bucket may each become a resource block. Avoid one giant file that hides ownership and relationships, but also avoid premature module abstraction before the topology is understood."], code: { language: "hcl", caption: "Provider-neutral shape", code: "resource \"example_network\" \"steward\" {\n  name = \"steward-prod\"\n}\n\nresource \"example_server\" \"api\" {\n  network_id = example_network.steward.id\n}" } },
        ],
        practice: ["List the concrete Steward target components that should become IaC resources.", "Separate provider configuration from managed resources.", "Choose and document provider version constraints instead of accepting any future version automatically."],
        questions: ["Why is a provider plugin a security boundary?", "How should resource structure reflect architecture rather than arbitrary file organization?"]
    },
    {
        id: "state",
        title: "State",
        intro: "IaC state links configuration addresses to real infrastructure identities. Losing, corrupting or exposing state can break management and leak sensitive metadata.",
        sections: [
            { heading: "State is not just cache", paragraphs: ["The tool uses state to know which real resource corresponds to each declared resource and to store attributes needed for dependency calculations. Editing or discarding it casually can lead to duplicate resources, orphaned infrastructure or destructive plans."] },
            { heading: "State may contain sensitive values", paragraphs: ["Even when configuration references a secret indirectly, provider responses may place sensitive attributes in state. State access therefore needs stronger protection than ordinary source code."], code: { language: "text", caption: "Three different things", code: "configuration -> what should exist\nstate         -> what IaC believes it manages\nprovider API  -> what actually exists" } },
        ],
        practice: ["Inspect an example state file in a disposable environment without committing it.", "Identify resource IDs and attributes that would matter for recovery.", "Write the access and backup requirements for Steward production state."],
        questions: ["Why can deleting state be dangerous even if the cloud resources still exist?", "Why must state be protected even when secrets are not written directly in HCL?"],
        resources: [terraformStateDocs, openTofuDocs]
    },
    {
        id: "variables-outputs",
        title: "Variables and Outputs",
        intro: "Variables make intended differences explicit; outputs expose useful results from managed infrastructure. They should clarify configuration rather than turn every literal into abstraction.",
        sections: [
            { heading: "Use variables for real inputs", paragraphs: ["Region, environment name, CIDR range or instance size may legitimately differ between environments. A variable should represent a meaningful decision, not simply relocate every value to another file."] },
            { heading: "Outputs are contracts for consumers", paragraphs: ["Public hostname, network ID or service endpoint can be exported for humans, CI or later tooling. Mark sensitive outputs appropriately, but remember that sensitivity flags usually affect display—not whether a value exists in state."], code: { language: "hcl", caption: "Simple input/output", code: "variable \"environment\" {\n  type = string\n}\n\noutput \"steward_endpoint\" {\n  value = example_server.api.public_endpoint\n}" } },
        ],
        practice: ["Choose five meaningful Steward IaC inputs and explain why each should vary.", "Define two outputs that the deployment pipeline or operator genuinely needs.", "Reject at least one unnecessary variable and explain why keeping the value local improves clarity."],
        questions: ["When does a variable improve design, and when does it create indirection without value?", "What is the difference between hiding a sensitive output and removing the sensitive value from state?"]
    },
    {
        id: "dependencies",
        title: "Dependencies",
        intro: "Infrastructure resources depend on one another. IaC engines build a dependency graph so independent resources can be processed in parallel while dependent resources wait for their prerequisites.",
        sections: [
            { heading: "Prefer data-flow dependencies", paragraphs: ["Referencing a network ID from a subnet or a subnet ID from a VM creates an implicit dependency. This is clearer than adding manual dependency declarations everywhere because the relationship carries actual data."] },
            { heading: "Explicit dependencies are for hidden relationships", paragraphs: ["Use explicit dependency controls only when the real ordering relationship is not represented by a normal attribute reference. Overusing them serializes work and hides the true architecture." ] },
        ],
        practice: ["Draw the Steward infrastructure dependency graph from network through compute and storage.", "Identify which dependencies arise naturally through references.", "Find one plausible hidden dependency and explain whether an explicit dependency would be justified."],
        questions: ["Why are reference-based dependencies preferable to manual ordering?", "What problem can excessive explicit dependencies create?"]
    },
    {
        id: "modules",
        title: "Modules Concepts",
        intro: "Modules package related infrastructure configuration behind an input/output boundary. They are useful for real reuse or strong encapsulation, but premature modules can hide a design that is not yet stable.",
        sections: [
            { heading: "A module is an infrastructure interface", paragraphs: ["A good module accepts meaningful inputs, owns a coherent set of resources and exposes only useful outputs. It should reduce repeated reasoning, not merely move code into another directory."] },
            { heading: "Do not abstract the first example", paragraphs: ["The first Steward remote environment should stay understandable. Extract a network or service module only after the boundary is stable enough that a second environment or consumer would benefit from the same contract." ] },
        ],
        practice: ["Review the planned Steward IaC and identify one possible future module boundary.", "Define the inputs and outputs that boundary would require.", "Decide whether to extract it now or defer it, and justify the choice based on actual reuse."],
        questions: ["What makes an infrastructure module more than a folder?", "Why can premature module extraction reduce clarity?"] ,
        resources: [terraformModules, openTofuDocs]
    },
    {
        id: "plan-apply-lifecycle",
        title: "Plan and Apply Lifecycle",
        intro: "The plan/apply split is the core change-control boundary in declarative IaC. A plan is useful only when someone understands what it proposes and applies the same reviewed change set.",
        sections: [
            { heading: "A plan is a proposed infrastructure diff", paragraphs: ["Read additions, in-place changes, replacements and deletions explicitly. Replacement of a database or network boundary deserves far more scrutiny than addition of a harmless tag."] },
            { heading: "Apply the reviewed plan", paragraphs: ["If the configuration or provider reality changes after review, regenerate the plan. In automated delivery, store or tightly couple the approved plan to the apply stage so that approval cannot silently drift away from execution."], code: { language: "bash", caption: "Review then execute the exact plan", code: "tofu plan -out=steward.tfplan\ntofu show steward.tfplan\ntofu apply steward.tfplan" } },
        ],
        practice: ["Generate a plan for a disposable Steward infrastructure change.", "Classify every proposed action as create, mutate, replace or destroy.", "Write the approval evidence required for any destructive or replacement action."],
        questions: ["Why is 'plan succeeded' not equivalent to 'change is safe'?", "Why should apply use the exact reviewed plan when possible?"]
    },
    {
        id: "drift",
        title: "Drift",
        intro: "Drift occurs when real infrastructure no longer matches the declared and tracked state, often because of manual console changes, external automation or provider-side mutation.",
        sections: [
            { heading: "Manual fixes create hidden divergence", paragraphs: ["A console change may solve an incident quickly but leaves the source of truth ambiguous until the IaC configuration is reconciled. The next plan may undo the manual fix or expose a conflict."] },
            { heading: "Detect, understand, then reconcile", paragraphs: ["Not every observed change is malicious or wrong. Some provider-controlled attributes evolve legitimately. The engineering task is to determine whether the divergence should be codified, reverted or explicitly ignored." ] },
        ],
        practice: ["In a disposable environment, change one managed property outside IaC.", "Run plan and observe how drift appears.", "Choose whether configuration should adopt the change or restore the declared value and explain why."],
        questions: ["Why can a manual emergency change become dangerous later?", "Why should drift be interpreted rather than blindly reverted?"]
    },
    {
        id: "remote-state",
        title: "Remote State Concepts",
        intro: "Remote state stores shared IaC state outside one engineer's laptop so teams and automation can coordinate safely. The backend becomes part of the infrastructure control plane and needs its own security and recovery design.",
        sections: [
            { heading: "Shared infrastructure needs shared state", paragraphs: ["If CI and multiple engineers manage Steward infrastructure, a local state file on one laptop is not authoritative enough. Remote backends can centralize state and often provide locking or consistency controls."] },
            { heading: "Bootstrap and recovery matter", paragraphs: ["The backend storing state may itself require infrastructure. Decide how it is created, protected and recovered. Avoid circular designs where recovering the state backend requires the state that was lost."], list: ["Restricted access", "Encryption", "Versioning/backups", "Locking or concurrency protection", "Clear ownership", "Recovery procedure"] },
        ],
        practice: ["Design a remote-state backend for Steward without deploying it yet.", "Identify who needs read, write and administrative access.", "Write a recovery path for accidental state deletion or corruption."],
        questions: ["Why does team-managed infrastructure make local state insufficient?", "What bootstrap problem can remote state introduce?"]
    },
    {
        id: "secrets-sensitive-values",
        title: "Secrets and Sensitive Values",
        intro: "IaC often needs credentials to call provider APIs and may configure systems that reference secrets. Keep secret material out of source while recognizing that state and plans can still contain sensitive data.",
        sections: [
            { heading: "Credentials belong outside configuration", paragraphs: ["Provider authentication should come from environment, workload identity or a secure credential mechanism rather than hard-coded access keys. CI should use the narrowest identity capable of the intended infrastructure change."] },
            { heading: "Sensitive is a handling instruction, not encryption", paragraphs: ["Marking an input sensitive can reduce accidental CLI display. It does not guarantee that the value is absent from state, plan files or provider logs. Protect every artifact in the path accordingly." ] },
        ],
        practice: ["Identify every credential needed to plan and apply Steward infrastructure.", "Define how local development and CI receive those credentials without committing them.", "Review planned state/plan storage and identify where sensitive values could still appear."],
        questions: ["Why is a sensitive variable not the same as an encrypted secret store?", "How should CI authenticate to the cloud provider without a shared permanent administrator key?"]
    },
    {
        id: "destroy-resource-lifecycle",
        title: "Destroy and Resource Lifecycle",
        intro: "IaC can remove infrastructure as reproducibly as it creates it. Destruction is powerful for cost control and ephemeral environments, but persistent data and shared dependencies require deliberate lifecycle protection.",
        sections: [
            { heading: "Not every resource has the same lifecycle", paragraphs: ["A disposable test VM may be safe to recreate freely. A production database, DNS zone or state backend may require protection, backup and migration before destruction. Treat replaceability as an architectural property, not a tool default."] },
            { heading: "Teardown is part of cloud cost discipline", paragraphs: ["The ability to destroy a lab environment cleanly is valuable because forgotten resources continue to cost money. A good lab proves both creation and teardown while preserving any evidence or state that must outlive the experiment." ] },
        ],
        practice: ["Classify Steward resources as ephemeral, replaceable-with-recovery or protected/persistent.", "Identify which resources need lifecycle protection or manual approval before destroy.", "Plan a safe teardown of a non-production Steward environment and state what must survive."],
        questions: ["Why should resource lifecycle differ between a test VM and a production database?", "How does destroy capability contribute to cost governance?"]
    },
];

const lab: Lesson = {
    id: "infrastructure-as-code-define-steward-infrastructure",
    title: "Lab: Define Steward Infrastructure as Code",
    activities: [
        {
            id: "infrastructure-as-code-define-steward-infrastructure-001",
            title: "Create the IaC Repository Structure",
            estimatedMinutes: 60,
            content: { type: "practical", objective: "Create a clear Terraform/OpenTofu structure for the already-approved Steward target architecture.", scenario: "The architecture from Cloud Building Blocks is the input. Do not redesign the system while writing HCL unless a contradiction is discovered and recorded.", instructions: ["Create the minimum IaC directory structure needed for Steward.", "Declare provider/version requirements.", "Model network, compute, storage and other approved resources.", "Use meaningful variables only where real variation exists.", "Define outputs needed by deployment or operators.", "Run formatting and validation."], deliverables: ["Versioned IaC configuration", "Provider/version declaration", "Variable/output contract"], completionCriteria: ["All declared resources trace to the approved target architecture.", "The configuration is readable without unnecessary module abstraction.", "Formatting and validation pass."] }
        },
        {
            id: "infrastructure-as-code-define-steward-infrastructure-002",
            title: "Plan Before Provisioning",
            estimatedMinutes: 90,
            content: { type: "practical", objective: "Produce and review a trustworthy infrastructure plan before creating resources.", scenario: "The first real plan is an architecture review expressed as an executable diff.", instructions: ["Initialize the IaC workspace.", "Generate a saved plan.", "Review every creation, replacement and deletion.", "Compare the plan to the target diagram and cost assumptions.", "Stop and correct configuration if the plan introduces resources not justified by the design."], deliverables: ["Saved/reviewed plan evidence", "Plan-to-architecture comparison", "Resolved discrepancy notes"], completionCriteria: ["No unexplained resource appears in the plan.", "Destructive actions are understood before apply.", "Estimated resource count and topology match the intended design."] }
        },
        {
            id: "infrastructure-as-code-define-steward-infrastructure-003",
            title: "Apply and Verify the Environment",
            estimatedMinutes: 120,
            content: { type: "practical", objective: "Apply the reviewed infrastructure and prove that actual provider state matches the intended Steward topology.", scenario: "Infrastructure creation is not complete until the resulting resources, boundaries and outputs are verified independently.", instructions: ["Apply the exact reviewed plan.", "Capture resource identities and outputs.", "Verify network boundaries, public/private exposure and provider-side configuration.", "Run a second plan and confirm there are no unintended pending changes.", "Do not manually patch discrepancies through the console; reconcile them through configuration."], deliverables: ["Apply evidence", "Infrastructure verification evidence", "Clean second-plan evidence"], completionCriteria: ["The resulting infrastructure matches the intended architecture.", "The second plan is clean or every remaining difference is understood.", "No undocumented console-only fix is required."] }
        },
        {
            id: "infrastructure-as-code-define-steward-infrastructure-004",
            title: "Introduce and Reconcile Drift",
            estimatedMinutes: 75,
            content: { type: "practical", objective: "Demonstrate that infrastructure drift can be detected and repaired deliberately.", scenario: "A controlled manual change simulates the kind of hidden divergence that accumulates in real cloud environments.", instructions: ["Choose a safe non-destructive property and modify it outside IaC.", "Generate a new plan and identify the drift.", "Decide whether the desired state should restore the original value or adopt the new one.", "Reconcile through code and apply.", "Confirm the next plan is clean."], deliverables: ["Drift evidence", "Reconciliation decision", "Clean final plan"], completionCriteria: ["The drift is detected by the IaC workflow.", "The reconciliation decision is explicit.", "The environment returns to a documented desired state."] }
        },
        {
            id: "infrastructure-as-code-define-steward-infrastructure-005",
            title: "Protect State and Prove Teardown",
            estimatedMinutes: 90,
            content: { type: "practical", objective: "Define state protection and prove safe lifecycle control for non-production Steward infrastructure.", scenario: "The environment must be reproducible enough to survive operator turnover and disposable enough to avoid forgotten cloud spend.", instructions: ["Document or configure the intended remote-state design.", "Verify that state and plan artifacts are excluded from normal source control where appropriate.", "Classify persistent versus disposable resources.", "Back up or preserve any required evidence.", "For a non-production environment, plan and execute controlled teardown if safe, then confirm billable resources are actually removed."], deliverables: ["State security/recovery note", "Lifecycle classification", "Teardown evidence or protected-resource justification"], completionCriteria: ["State ownership and recovery are documented.", "Persistent resources cannot be casually destroyed without understanding impact.", "Disposable infrastructure can be removed without hidden leftovers."] }
        },
        {
            id: "infrastructure-as-code-define-steward-infrastructure-006",
            title: "Infrastructure as Code Review",
            estimatedMinutes: 30,
            content: { type: "reflection", prompt: "Explain how your Steward IaC now separates architecture intent, configuration, state and provider reality. Identify the most dangerous infrastructure change your current plan could propose, the evidence you would require before approving it, and one part of the cloud environment you intentionally chose not to manage through IaC. Finally, explain what this module makes possible for the upcoming Cloud Architecture and Cost review.", minimumCharacters: 320 }
        }
    ]
};

export const infrastructureAsCodeDeepLessons: Lesson[] = [...specs.map(richLesson), lab];
