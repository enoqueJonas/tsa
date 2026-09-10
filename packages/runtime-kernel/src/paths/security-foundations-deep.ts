import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const owaspRisk: LearningResource = { title: "OWASP Risk Rating Methodology", url: "https://owasp.org/www-community/OWASP_Risk_Rating_Methodology" };
const nistControls: LearningResource = { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" };
const cisaZeroTrust: LearningResource = { title: "CISA Zero Trust Maturity Model", url: "https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model" };
const owaspThreatModel: LearningResource = { title: "OWASP Threat Modeling", url: "https://owasp.org/www-community/Threat_Modeling" };

type Spec = {
    id: string;
    title: string;
    intro: string;
    principles: string[];
    steward: string[];
    practice: string[];
    questions: string[];
    warning?: string;
};

function lessonFrom(spec: Spec): Lesson {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.intro },
        { type: "heading", id: `${spec.id}-principles`, text: "Core principles", level: 2 },
        { type: "list", items: spec.principles },
        { type: "heading", id: `${spec.id}-steward`, text: "Apply it to Steward", level: 2 },
        ...spec.steward.map((text): LessonBlock => ({ type: "paragraph", text })),
    ];

    if (spec.warning) {
        blocks.push({ type: "callout", tone: "warning", title: "Security risk", body: spec.warning });
    }

    blocks.push({
        type: "callout",
        tone: "steward",
        title: "Security Steward checkpoint",
        body: "Security reasoning starts from assets, actors, trust and consequences. Tools are secondary. Every control should have a threat or risk it addresses, evidence that it works, and a residual-risk statement for what remains.",
    });
    blocks.push({ type: "resources", title: "Continue learning", resources: [owaspRisk, nistControls, cisaZeroTrust, owaspThreatModel] });

    return {
        id: `security-foundations-${spec.id}`,
        title: spec.title,
        activities: [
            {
                id: `security-foundations-${spec.id}-001`,
                title: spec.title,
                estimatedMinutes: 45,
                content: { type: "reading", body: spec.intro, blocks },
            },
            {
                id: `security-foundations-${spec.id}-002`,
                title: `Apply: ${spec.title}`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective: `Apply ${spec.title} to the real Steward ecosystem.`,
                    scenario: "Use Steward's real architecture, users, data, deployed environment, CI/CD path and internal dependencies. The goal is to produce defensible security reasoning before deeper vulnerability work begins.",
                    instructions: spec.practice,
                    deliverables: ["Security reasoning artifact", "Steward-specific example", "Residual-risk or uncertainty note"],
                    completionCriteria: ["The analysis names the protected asset or boundary.", "Claims are tied to plausible threats rather than generic security language.", "The learner can explain what remains unproven."],
                },
            },
            {
                id: `security-foundations-${spec.id}-003`,
                title: `Knowledge Check: ${spec.title}`,
                estimatedMinutes: 10,
                content: { type: "reflection", prompt: spec.questions.join(" "), minimumCharacters: 200 },
            },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "cia",
        title: "Confidentiality, Integrity and Availability",
        intro: "Confidentiality, integrity and availability are three different security properties, not a single score. A system can protect one and fail another: encrypted data may still be corrupt, highly available data may be exposed, and confidential data may be inaccessible when needed.",
        principles: [
            "Confidentiality asks who may observe information.",
            "Integrity asks whether data and behavior remain correct and protected from unauthorized change.",
            "Availability asks whether legitimate users can access required capability when needed.",
            "Business impact determines which property matters most for a given asset.",
            "Controls often trade off one property against another, so design decisions must be explicit.",
        ],
        steward: [
            "For Steward, user identities and ownership metadata have confidentiality concerns, but integrity is especially important: an unauthorized ownership change could redirect operational responsibility for a critical service.",
            "Availability matters because service ownership and dependency data may be needed during incident response. The same asset can therefore have different consequences across all three properties."],
        practice: ["Choose five Steward assets.", "For each asset, describe one confidentiality, integrity and availability failure.", "Rank which property has the greatest consequence for each asset and justify the ranking."],
        questions: ["Why is confidentiality not synonymous with security?", "Which CIA property is most critical for Steward ownership data, and why?"],
    },
    {
        id: "risk-language",
        title: "Assets, Threats, Vulnerabilities and Risk",
        intro: "Security analysis becomes useful only when its terms are precise. An asset has value; a threat is a potential cause of harm; a vulnerability is a weakness that can be exploited or triggered; risk combines likelihood and impact in context.",
        principles: [
            "Do not call every defect a vulnerability.",
            "A vulnerability without a meaningful asset or consequence may be low risk.",
            "A serious threat can exist even when the exact vulnerability has not yet been discovered.",
            "Likelihood depends on exposure, attacker capability, prerequisites and existing controls.",
            "Impact should be described in business and operational terms, not only technical severity labels.",
        ],
        steward: [
            "A permissive endpoint that allows any authenticated user to change a service owner is a vulnerability. A malicious or compromised user abusing it is a threat scenario. The affected ownership registry is the asset, and the resulting misrouting of responsibility creates operational risk.",
            "This vocabulary will be reused later when writing findings and prioritizing mitigations."],
        practice: ["Write three Steward examples separating asset, threat, vulnerability and risk.", "For each, estimate likelihood and impact qualitatively.", "Identify what evidence would increase or reduce confidence in the rating."],
        questions: ["What is the difference between a vulnerability and a risk?", "Why can the same vulnerability have different risk in two systems?"],
    },
    {
        id: "attack-surface",
        title: "Attack Surface",
        intro: "Attack surface is the set of reachable ways an actor can interact with a system and potentially influence protected assets. It includes more than public endpoints: administrative interfaces, CI/CD identities, package repositories, secrets, network services and trusted integrations also create paths.",
        principles: [
            "Inventory entry points, identities, exposed services and dependency paths.",
            "Distinguish internet-facing, internal, administrative and build-time surfaces.",
            "Reducing unnecessary exposure is usually stronger than adding controls around unused capability.",
            "Attack surface changes as infrastructure and delivery systems evolve.",
            "A component can be private yet still reachable by a compromised trusted system.",
        ],
        steward: [
            "Steward's attack surface includes the web/API, authentication boundary, reverse proxy, SSH administration, PostgreSQL connectivity, CI/CD credentials, container registry and the internal repositories used for steward-common and tsa-test-core.",
            "The goal is not to label everything dangerous. It is to make reachable paths visible enough that later threat modeling can reason about them."],
        practice: ["Draw Steward's internet, internal, administrative and supply-chain entry points.", "Mark which actors can reach each point.", "Identify at least two exposed capabilities that could be removed or narrowed."],
        questions: ["Why is a private service still part of the attack surface?", "How can CI/CD expand Steward's attack surface even if users never access it directly?"],
    },
    {
        id: "least-privilege",
        title: "Least Privilege",
        intro: "Least privilege means granting only the capabilities required for a specific actor or component to perform its intended work, for the necessary scope and duration. It is a design principle for users, services, pipelines, databases and infrastructure identities.",
        principles: [
            "Privilege should be tied to responsibility, not convenience.",
            "Read, write, administer and publish capabilities should be separated when practical.",
            "Long-lived broad credentials increase the blast radius of compromise.",
            "Service identities need least privilege just as human users do.",
            "Authorization must be tested at the resource and action level, not inferred from role names.",
        ],
        steward: [
            "A team member may need to edit services owned by their team without gaining rights to change other teams' services. A CI job that publishes tsa-test-core should not also have deployment administration privileges unless explicitly required.",
            "Later modules will turn these boundaries into authorization tests and CI/CD hardening controls."],
        practice: ["Choose five Steward actors or service identities.", "List the minimum operations each requires.", "Identify one current or plausible over-privilege scenario and design a narrower permission model."],
        questions: ["Why is least privilege relevant to CI jobs?", "What is the difference between a role label and a verified least-privilege boundary?"],
    },
    {
        id: "defense-depth",
        title: "Defense in Depth",
        intro: "Defense in depth uses multiple independent controls so one control failure does not automatically expose the protected asset. Independence matters: five controls that all rely on the same compromised credential are not five meaningful layers.",
        principles: [
            "Place controls at different layers: identity, application, network, host, data and delivery.",
            "Avoid assuming the perimeter will always hold.",
            "Preventive controls should be complemented by detection and recovery where consequence warrants it.",
            "Layers should fail independently where possible.",
            "More controls are not automatically better; complexity can itself create weaknesses.",
        ],
        steward: [
            "A sensitive Steward mutation may be protected by authenticated identity, application authorization, private database access, database constraints and audit logging. If one layer fails, another may still limit or reveal harm.",
            "The learner should distinguish true layered protection from duplicated checks that depend on one shared assumption."],
        practice: ["Pick one high-impact Steward operation.", "Map current or intended controls across identity, application, network, data and monitoring layers.", "Identify which controls share a common failure dependency."],
        questions: ["What makes two controls meaningfully independent?", "How can defense in depth become harmful if added without design discipline?"],
    },
    {
        id: "trust-boundaries",
        title: "Trust Boundaries",
        intro: "A trust boundary exists where data, identity or control crosses between parties or components with different assumptions or levels of authority. Security design becomes clearer when those crossings are explicit rather than hidden behind the word 'internal'.",
        principles: [
            "Crossing a boundary should trigger validation, authentication, authorization or verification appropriate to the risk.",
            "Internal traffic is not inherently trustworthy.",
            "Third-party and package-repository boundaries include supply-chain trust, not only network trust.",
            "Administrative paths deserve explicit boundaries separate from user traffic.",
            "Trust should be minimized and justified rather than inherited automatically.",
        ],
        steward: [
            "Steward contains boundaries between browser and API, API and identity provider, API and PostgreSQL, CI and artifact repositories, deployment automation and hosts, and external package sources versus the approved internal repository path.",
            "These boundaries will become the backbone of the next Threat Modeling module."],
        practice: ["Draw Steward's principal trust boundaries.", "For each crossing, write what is trusted, what must be verified and what could go wrong.", "Identify one boundary that is currently hidden by an 'internal = trusted' assumption."],
        questions: ["Why is network location insufficient as a trust decision?", "What verification should occur when CI consumes an internal package?"],
    },
    {
        id: "control-types",
        title: "Security Controls: Preventive, Detective and Corrective",
        intro: "Security controls serve different purposes. Preventive controls reduce the chance of an unwanted event, detective controls reveal that it occurred or is occurring, and corrective controls limit damage or restore a safe state afterward.",
        principles: [
            "A mature control set often combines prevention, detection and correction.",
            "Detection without a response path may create awareness without risk reduction.",
            "Prevention cannot be assumed perfect, especially for complex systems.",
            "Corrective controls should be tested where feasible, not documented only on paper.",
            "Every control should map to a threat or risk scenario.",
        ],
        steward: [
            "Authorization checks may prevent unauthorized service-owner changes; audit logs may detect suspicious attempts; restore or administrative correction procedures may recover valid ownership state after an incident.",
            "The exact control mix depends on consequence and cost, not on filling three categories mechanically."],
        practice: ["Choose three Steward threat scenarios.", "For each, identify preventive, detective and corrective controls that would meaningfully reduce risk.", "Mark which controls can be verified now and which remain recommendations."],
        questions: ["Why is logging not automatically an effective detective control?", "What evidence would prove a corrective control actually works?"],
    },
    {
        id: "risk-treatment",
        title: "Risk Treatment and Residual Risk",
        intro: "Security work does not eliminate all risk. Teams can mitigate, avoid, transfer or accept risk, but the decision must be explicit and informed by evidence. Residual risk is what remains after controls are applied.",
        principles: [
            "Mitigation reduces likelihood, impact or both.",
            "Avoidance removes the risky activity or exposure.",
            "Transfer shifts some consequence, but rarely eliminates technical responsibility.",
            "Acceptance should name the rationale, owner and review condition.",
            "Residual risk must reflect verified control effectiveness rather than planned controls.",
        ],
        steward: [
            "If Steward exposes an administrative endpoint only to a narrow internal network and strong identity boundary, the initial risk may be reduced but not eliminated. Compromised administrator credentials or network access may remain residual risks.",
            "The final Security Steward milestone will require a residual-risk register that distinguishes verified controls from recommendations."],
        practice: ["Select four Steward risks and assign a treatment strategy.", "For mitigated risks, state how the chosen control changes likelihood or impact.", "Write the residual risk and the trigger for future review."],
        questions: ["Why is accepted risk still an engineering responsibility?", "What makes a residual-risk statement credible?"],
    },
];

const lab: Lesson = {
    id: "security-foundations-steward-attack-surface-lab",
    title: "Lab: Map Steward Security Assets and Attack Surface",
    activities: [
        {
            id: "security-foundations-steward-attack-surface-lab-001",
            title: "Build the Steward Security Inventory",
            estimatedMinutes: 75,
            content: {
                type: "practical",
                objective: "Create the first complete security inventory for Steward.",
                scenario: "This artifact becomes the input to Threat Modeling. It must reflect the real system built in prior schools rather than a generic web-app diagram.",
                instructions: [
                    "Inventory critical data, identities, services, hosts, repositories, credentials and deployment components.",
                    "For each asset, record confidentiality, integrity and availability concerns.",
                    "Identify human, service and external actors.",
                    "Mark which assets have especially high integrity or administrative consequence."],
                deliverables: ["Steward asset inventory", "CIA impact notes", "Actor inventory"],
                completionCriteria: ["The inventory includes application, infrastructure and software-supply-chain assets.", "Important assets have explicit security consequences.", "Actors are specific enough to support later threat scenarios."],
            },
        },
        {
            id: "security-foundations-steward-attack-surface-lab-002",
            title: "Map Entry Points and Trust Boundaries",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Turn the inventory into a security boundary map.",
                scenario: "Show how data and control reach Steward assets through user, administrative, delivery and dependency paths.",
                instructions: [
                    "Draw internet-facing, internal, administrative and build-time entry points.",
                    "Mark trust boundaries and the identities that cross them.",
                    "Record validation/authentication/authorization assumptions at each boundary.",
                    "Identify unnecessary exposure, broad privileges and single-control dependencies."],
                deliverables: ["Attack-surface diagram", "Trust-boundary annotations", "Exposure and privilege findings"],
                completionCriteria: ["The diagram includes CI/CD and internal artifact repositories, not only HTTP traffic.", "Each major boundary has an explicit trust assumption.", "At least three plausible attack paths can be derived from the map."],
            },
        },
        {
            id: "security-foundations-steward-attack-surface-lab-003",
            title: "Create the Initial Security Risk Register",
            estimatedMinutes: 60,
            content: {
                type: "practical",
                objective: "Convert the boundary map into prioritized security work.",
                scenario: "Do not exploit vulnerabilities yet. Establish the risks, current controls and evidence gaps that the rest of Security Steward must investigate.",
                instructions: [
                    "Write at least eight risk scenarios using asset, threat, weakness/exposure and consequence language.",
                    "Estimate likelihood and impact qualitatively and explain the reasoning.",
                    "Map preventive, detective and corrective controls already present.",
                    "Mark controls as verified, assumed or missing.",
                    "Record residual risk and the next module or activity that should investigate each item."],
                deliverables: ["Initial Steward security risk register", "Control-evidence status", "Threat-modeling handoff"],
                completionCriteria: ["Risks are prioritized rather than presented as an unranked checklist.", "Verified controls are distinguishable from assumptions.", "The register creates a clear handoff into Threat Modeling."],
            },
        },
        {
            id: "security-foundations-steward-attack-surface-lab-004",
            title: "Security Foundations Review",
            estimatedMinutes: 25,
            content: {
                type: "reflection",
                prompt: "Defend your Steward security model. Which assets matter most, where are the most important trust boundaries, which attack-surface paths deserve priority, which controls are actually verified, and what residual risks should guide the next Threat Modeling module?",
                minimumCharacters: 350,
            },
        },
    ],
};

export const securityFoundationsDeepLessons: Lesson[] = [
    ...specs.map(lessonFrom),
    lab,
];
