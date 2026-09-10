import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const owaspThreatModeling: LearningResource = { title: "OWASP Threat Modeling", url: "https://owasp.org/www-community/Threat_Modeling" };
const microsoftStride: LearningResource = { title: "Microsoft STRIDE Threat Model", url: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats" };
const nistRisk: LearningResource = { title: "NIST Risk Management Framework", url: "https://csrc.nist.gov/projects/risk-management/about-rmf" };

type Spec = {
    id: string;
    title: string;
    intro: string;
    principles: string[];
    steward: string[];
    practice: string[];
    reflection: string;
    warning?: string;
};

function blocksFor(spec: Spec): LessonBlock[] {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.intro },
        { type: "heading", id: `${spec.id}-principles`, text: "Core principles", level: 2 },
        { type: "list", items: spec.principles },
        { type: "heading", id: `${spec.id}-steward`, text: "Apply it to Steward", level: 2 },
        ...spec.steward.map((text): LessonBlock => ({ type: "paragraph", text })),
    ];

    if (spec.warning) {
        blocks.push({ type: "callout", tone: "warning", title: "Threat-modeling risk", body: spec.warning });
    }

    blocks.push({
        type: "callout",
        tone: "steward",
        title: "Stewardship checkpoint",
        body: "A useful threat model records what is known, what is assumed, who owns each mitigation and what residual risk remains. The model exists to improve engineering decisions, not to produce a diagram that is never revisited.",
    });
    blocks.push({ type: "resources", title: "Continue learning", resources: [owaspThreatModeling, microsoftStride, nistRisk] });
    return blocks;
}

function lessonFrom(spec: Spec): Lesson {
    return {
        id: `threat-modeling-${spec.id}`,
        title: spec.title,
        activities: [
            {
                id: `threat-modeling-${spec.id}-001`,
                title: spec.title,
                estimatedMinutes: 45,
                content: { type: "reading", body: spec.intro, blocks: blocksFor(spec) },
            },
            {
                id: `threat-modeling-${spec.id}-002`,
                title: `Apply: ${spec.title}`,
                estimatedMinutes: 50,
                content: {
                    type: "practical",
                    objective: `Apply ${spec.title} to the real Steward ecosystem.`,
                    scenario: "Use the asset inventory and attack-surface map created in Security Foundations. Keep the model scoped to Steward and its real dependencies rather than inventing unrelated threats.",
                    instructions: spec.practice,
                    deliverables: ["Updated threat-model artifact", "Named threat or mitigation decisions", "Assumptions and residual-risk note"],
                    completionCriteria: ["The reasoning traces back to a real Steward asset, flow or trust boundary.", "Threats are concrete enough to test or mitigate.", "Assumptions are explicit instead of being treated as verified controls."],
                },
            },
            {
                id: `threat-modeling-${spec.id}-003`,
                title: `Knowledge Check: ${spec.title}`,
                estimatedMinutes: 10,
                content: { type: "reflection", prompt: spec.reflection, minimumCharacters: 200 },
            },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "assets-actors",
        title: "Assets and Actors",
        intro: "Threat modeling begins by identifying what needs protection and who or what can interact with it. Assets include more than data: identities, deployment credentials, package provenance, administrative capability and the integrity of service ownership records can all be security-sensitive.",
        principles: [
            "List assets in terms of value or consequence, not only infrastructure components.",
            "Separate human actors, service identities, administrators, CI identities and external systems.",
            "Distinguish trusted role from trusted behavior: an authenticated actor can still misuse authorized capability.",
            "Record what each actor can reach and what authority they possess.",
        ],
        steward: [
            "For Steward, core assets include service ownership and dependency records, authentication tokens, PostgreSQL data, deployment credentials, internal repository credentials and approved steward-common/tsa-test-core package versions.",
            "Important actors include normal users, team owners, administrators, CI/CD identities, database identities, repository publishers and external identity providers."],
        practice: ["Refine the Security Foundations asset inventory into security-relevant assets.", "Create an actor table with capabilities and trust assumptions.", "Mark which actors can modify ownership, lifecycle or dependency data."],
        reflection: "Explain the difference between an asset and a component, then identify one Steward actor whose legitimate permissions could still create meaningful security risk.",
    },
    {
        id: "flows",
        title: "Data and Control Flows",
        intro: "Threats usually emerge in movement and transitions: credentials cross boundaries, data is transformed, privileged actions are triggered, artifacts are published and services call one another. Modeling flows reveals where assumptions change.",
        principles: ["Model both data flow and control flow.", "Include authentication, authorization, deployment and package-publishing paths, not just application requests.", "Annotate protocols, identities and sensitive data crossing each flow.", "Show where validation, transformation or persistence occurs."],
        steward: ["A Steward registration request may travel from browser to reverse proxy to Django to PostgreSQL while authorization depends on identity claims and team relationships.", "A release flow travels from source through CI to artifact repositories and deployment; this is a security flow because identity and integrity decisions occur at every step."],
        practice: ["Draw the request flow for creating or changing a Steward service.", "Draw the delivery flow for publishing and consuming steward-common or tsa-test-core.", "Annotate identity, protocol, sensitive data and validation points."],
        reflection: "Why is a release pipeline part of the threat model even when it is not exposed as a public HTTP endpoint? Give one Steward example.",
    },
    {
        id: "boundaries",
        title: "Trust Boundaries",
        intro: "A trust boundary is where the system must stop relying on an implicit assumption and verify something again. Crossing a network boundary, changing identity, entering a privileged process or consuming an external artifact can all create a boundary.",
        principles: ["Do not equate network location with trust.", "Treat privilege changes and identity transitions as boundaries.", "Mark where untrusted or differently trusted data enters.", "Identify which control is expected to justify crossing each boundary."],
        steward: ["Public ingress, reverse proxy to application, application to PostgreSQL, CI to Nexus, developer to administration channel and test automation to deployed environments are distinct Steward trust boundaries.", "The question at each boundary is: what claim is being trusted here, and what verifies it?"],
        practice: ["Overlay trust boundaries on the Steward flow diagrams.", "For each boundary, name the claim being trusted.", "Record the preventive or detective control expected to validate that claim."],
        reflection: "Choose one Steward trust boundary and explain what could go wrong if a network location or authenticated identity were treated as sufficient proof of trust.",
    },
    {
        id: "identification",
        title: "Threat Identification",
        intro: "Threat identification converts architecture understanding into plausible failure or abuse paths. Good threats are specific enough to connect an actor, entry point, weakness, action and consequence.",
        principles: ["Write threat statements that name actor, action, target and impact.", "Derive threats from real flows and boundaries rather than generic vulnerability lists.", "Include misuse by legitimate actors and compromised service identities.", "Separate cause, threat event and impact."],
        steward: ["Instead of writing 'broken authorization', write: 'a member of Team A modifies Team B's production service ownership because the API checks authentication but not resource relationship'.", "Instead of 'supply-chain attack', describe how an unauthorized package version could be published or selected and what Steward execution would trust afterward."],
        practice: ["Create at least eight concrete threat statements from Steward's flows.", "Ensure each references an asset or boundary.", "Rewrite any generic vulnerability label into actor-action-impact language."],
        reflection: "Rewrite one vague security concern into a concrete Steward threat statement and explain why the concrete form is easier to prioritize and test.",
    },
    {
        id: "stride",
        title: "STRIDE-style Thinking",
        intro: "STRIDE is a prompt set for finding overlooked threat classes: spoofing, tampering, repudiation, information disclosure, denial of service and elevation of privilege. It is most useful as structured questioning, not as a requirement to invent one threat per category for every component.",
        principles: ["Use categories to challenge blind spots, not to replace system understanding.", "Apply prompts to flows and trust boundaries where they make sense.", "Reject contrived threats that have no plausible path.", "Record why a category is not relevant when that decision matters."],
        steward: ["Spoofing may target CI or administrator identities; tampering may target service metadata or package artifacts; repudiation may expose weak audit trails; disclosure may expose tokens; denial may affect public/API paths; elevation may target administrative roles."],
        practice: ["Apply STRIDE-style prompts to three high-value Steward boundaries.", "Add only plausible new threats.", "Record one category you deliberately reject and why."],
        reflection: "Why can a mechanically completed STRIDE table produce a worse threat model than a smaller set of plausible threats? Use a Steward example.",
        warning: "Do not turn STRIDE into a vulnerability bingo card. A category is a question generator, not proof that a threat exists.",
    },
    {
        id: "abuse-cases",
        title: "Abuse Cases",
        intro: "Abuse cases describe how a capability could be intentionally misused. They complement normal use cases by making hostile or policy-breaking goals explicit, especially where the attacker is already authenticated.",
        principles: ["Start from attacker objective, not exploit technique.", "Include malicious use of legitimate features.", "Describe preconditions and observable consequence.", "Use abuse cases to derive negative security requirements and tests."],
        steward: ["Examples include enumerating confidential service metadata, transferring ownership to an unauthorized team, registering deceptive duplicate service identities or abusing administrative endpoints to bypass governance."],
        practice: ["Write three Steward abuse cases for authenticated users.", "Write one abuse case involving CI or repository credentials.", "Derive at least one security requirement from each case."],
        reflection: "How does an abuse case differ from a normal negative test? Give one example where the attacker uses a legitimate Steward feature in a harmful way.",
    },
    {
        id: "prioritization",
        title: "Threat Prioritization",
        intro: "A threat model must support decisions, so threats need prioritization. Exact numeric risk scores can create false precision; the useful outcome is a defensible ordering based on impact, plausibility, exposure and existing controls.",
        principles: ["Consider business/security impact and plausible likelihood separately.", "Account for exposure, attacker capability and control strength.", "Distinguish verified controls from planned or assumed controls.", "Record uncertainty instead of hiding it inside a number."],
        steward: ["Unauthorized modification of service ownership may rank above cosmetic information exposure because it can redirect governance and operational responsibility. Compromise of CI publishing credentials may be high impact because one identity can affect many releases or packages."],
        practice: ["Prioritize the Steward threat list into at least three tiers.", "Document the reason for the top five threats.", "Identify which rankings depend heavily on an unverified control."],
        reflection: "Why can two threats with the same numeric score deserve different treatment? Explain using impact, exposure or control uncertainty in Steward.",
    },
    {
        id: "mitigations",
        title: "Mitigations and Security Requirements",
        intro: "A mitigation becomes actionable when it is translated into a security requirement that can be implemented and verified. 'Use least privilege' is a principle; 'only owning-team members and designated administrators may change ownership, and denied attempts must not mutate state' is testable.",
        principles: ["Map each mitigation to a named threat.", "Express requirements in observable or reviewable terms.", "Prefer controls that reduce likelihood or impact at the right boundary.", "Add verification method and owner when possible."],
        steward: ["Authorization mitigations can become resource-relationship requirements. Supply-chain mitigations can become repository-source, version, signing or provenance requirements. Administrative mitigations can become access-boundary and audit requirements."],
        practice: ["Select the top five Steward threats.", "Define at least one mitigation per threat.", "Rewrite each mitigation as a verifiable security requirement.", "Add intended verification: automated test, configuration review, artifact evidence or manual control review."],
        reflection: "Take one generic mitigation phrase and turn it into a verifiable Steward security requirement. What evidence would prove it is actually implemented?",
    },
    {
        id: "living-model",
        title: "Threat Models as Living Engineering Artifacts",
        intro: "Threat models decay when architecture, dependencies and privileges change. Keeping them useful requires ownership, review triggers and links to engineering work rather than periodic recreation from scratch.",
        principles: ["Update the model when trust boundaries, major dependencies, identity flows or deployment architecture change.", "Link threats to requirements, findings, tests or accepted-risk decisions.", "Retire threats only with evidence that the path no longer exists or risk is formally accepted.", "Preserve assumptions and review dates."],
        steward: ["Adding a new identity provider, exposing a new API, changing Nexus policy, adding a managed database or extracting another shared internal package should trigger targeted Steward threat-model review.", "The model should feed the next security modules and later the Security Steward milestone rather than becoming static documentation."],
        practice: ["Add owner and review-trigger metadata to the Steward threat model.", "Link each high-priority threat to a security requirement or follow-up module.", "Define architecture changes that must trigger re-review."],
        reflection: "What concrete changes in Steward should trigger threat-model review, and why is an annual-only review cadence insufficient for those changes?",
    },
];

const lab: Lesson = {
    id: "threat-modeling-steward-api-lab",
    title: "Lab: Threat-model Steward API",
    activities: [
        {
            id: "threat-modeling-steward-api-lab-001",
            title: "Build the Model Boundary and Flows",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Produce a reviewable architecture-centered Steward threat model.",
                scenario: "Model the real Steward ecosystem: internet-facing API, authentication flows, PostgreSQL, CI/CD, Nexus/internal repositories, steward-common, tsa-test-core, test automation, administrator access and external trust boundaries.",
                instructions: ["Import/refine the asset and actor inventory from Security Foundations.", "Draw data/control flows and trust boundaries.", "Annotate identities, sensitive data, validation points and privilege changes.", "Record assumptions separately from verified controls."],
                deliverables: ["Threat-model scope", "Annotated flow diagram", "Trust-boundary map", "Assumption register"],
                completionCriteria: ["The model reflects the actual Steward ecosystem.", "Security-relevant delivery/package flows are included.", "Trust boundaries show what must be verified at each crossing."],
            },
        },
        {
            id: "threat-modeling-steward-api-lab-002",
            title: "Identify and Prioritize Threats",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Turn the Steward architecture into a prioritized set of plausible threat paths.",
                scenario: "Use direct reasoning plus STRIDE-style prompts and abuse cases. Avoid generic vulnerability inventories disconnected from the system.",
                instructions: ["Write concrete actor-action-impact threat statements.", "Use STRIDE to challenge blind spots at high-value boundaries.", "Add authenticated-user and CI/repository abuse cases.", "Prioritize threats using impact, plausibility, exposure and verified control strength."],
                deliverables: ["Prioritized threat register", "STRIDE review notes", "Abuse cases", "Top-threat rationale"],
                completionCriteria: ["Threats are specific and traceable to the model.", "Contrived categories are excluded.", "The top threats have defensible rationale."],
            },
        },
        {
            id: "threat-modeling-steward-api-lab-003",
            title: "Define Mitigations and Security Requirements",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Convert the threat model into engineering work that can be verified.",
                scenario: "The next Web and API Threats module will use this model to guide focused assessment. Create requirements specific enough to test there or in later hardening modules.",
                instructions: ["Map mitigations to the highest-priority threats.", "Rewrite each mitigation as a verifiable requirement.", "Assign intended evidence type and owner where known.", "Record residual risk and unresolved assumptions.", "Define review triggers so the model remains living."],
                deliverables: ["Threat-to-control mapping", "Security requirements", "Residual-risk register", "Review-trigger checklist"],
                completionCriteria: ["Each high-priority threat has an explicit treatment decision.", "Requirements are testable or reviewable.", "Residual risk is visible rather than implied away."],
            },
        },
        {
            id: "threat-modeling-steward-api-lab-004",
            title: "Threat Model Review",
            estimatedMinutes: 15,
            content: { type: "reflection", prompt: "Summarize the three most important Steward threats, why they rank highest, what controls or requirements address them, and which assumptions still need evidence before the model can be considered reliable.", minimumCharacters: 350 },
        },
    ],
};

export const threatModelingDeepLessons: Lesson[] = [...specs.map(lessonFrom), lab];
