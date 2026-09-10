import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const owaspAsvs: LearningResource = { title: "OWASP Application Security Verification Standard", url: "https://owasp.org/www-project-application-security-verification-standard/" };
const owaspCheatSheets: LearningResource = { title: "OWASP Cheat Sheet Series", url: "https://cheatsheetseries.owasp.org/" };
const djangoSecurity: LearningResource = { title: "Django Security", url: "https://docs.djangoproject.com/en/stable/topics/security/" };
const drfAuth: LearningResource = { title: "Django REST Framework Authentication", url: "https://www.django-rest-framework.org/api-guide/authentication/" };

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
        { type: "heading", id: `${spec.id}-principles`, text: "Security engineering principles", level: 2 },
        { type: "list", items: spec.principles },
        { type: "heading", id: `${spec.id}-steward`, text: "Apply it to Steward", level: 2 },
        ...spec.steward.map((text): LessonBlock => ({ type: "paragraph", text })),
    ];
    if (spec.warning) blocks.push({ type: "callout", tone: "warning", title: "Security warning", body: spec.warning });
    blocks.push({ type: "callout", tone: "steward", title: "Stewardship checkpoint", body: "Application security is complete only when the control is explicit in design, enforced in code or configuration, and verified by positive and negative evidence. A recommendation without implementation and retest remains residual risk." });
    blocks.push({ type: "resources", title: "Continue learning", resources: [owaspAsvs, owaspCheatSheets, djangoSecurity, drfAuth] });
    return blocks;
}

function lessonFrom(spec: Spec): Lesson {
    return {
        id: `application-security-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `application-security-${spec.id}-001`, title: spec.title, estimatedMinutes: 50, content: { type: "reading", body: spec.intro, blocks: blocksFor(spec) } },
            {
                id: `application-security-${spec.id}-002`,
                title: `Engineer and verify: ${spec.title}`,
                estimatedMinutes: 65,
                content: {
                    type: "practical",
                    objective: `Assess and improve ${spec.title} in the learner-controlled Steward API.`,
                    scenario: "Start from the existing Steward threat model, web/API findings and vulnerability-lab evidence. Inspect the implementation before changing it, define the intended security property, implement the smallest justified control and verify both expected and adversarial behavior.",
                    instructions: spec.practice,
                    deliverables: ["Security requirement or finding", "Implementation/configuration evidence", "Positive and negative retest evidence"],
                    completionCriteria: ["The intended security property is stated explicitly.", "The control is implemented or the residual risk is recorded honestly.", "Retesting demonstrates both permitted behavior and a relevant denied/failed case."],
                },
            },
            { id: `application-security-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: spec.reflection, minimumCharacters: 200 } },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "secure-authentication",
        title: "Secure Authentication",
        intro: "Authentication establishes which identity is making a request. Secure authentication is not merely a login endpoint: it includes credential handling, token issuance, expiry, revocation, failure behavior and resistance to account-discovery and automated abuse.",
        principles: ["Store passwords using framework-approved adaptive hashing.", "Make token lifetime and revocation behavior explicit.", "Avoid authentication responses that unnecessarily reveal account existence.", "Treat recovery and credential-reset flows as authentication surfaces."],
        steward: ["Steward's Django/DRF identity boundary should define how users authenticate, how JWTs or sessions expire and what logout actually invalidates.", "Earlier token/session threat findings should now become concrete requirements rather than remaining observations."],
        practice: ["Trace Steward login from submitted credential to authenticated request.", "Document token/session lifetime, refresh and logout semantics.", "Test valid, invalid, expired/revoked and repeated-failure cases.", "Implement or tighten one authentication control and add a regression check."],
        reflection: "Why can a login endpoint appear correct functionally while the authentication lifecycle remains insecure?",
    },
    {
        id: "authorization-design-testing",
        title: "Authorization Design and Testing",
        intro: "Authorization answers whether an authenticated identity may perform a specific action on a specific resource. The strongest designs centralize policy, deny by default and verify object-level access rather than trusting UI visibility or route naming.",
        principles: ["Authenticate first, authorize every protected action.", "Check object-level ownership or role relationships where required.", "Deny by default when policy is ambiguous.", "Test horizontal and vertical privilege boundaries explicitly."],
        steward: ["A Steward user who can read one service record must not automatically read or modify every service, owner or administrative record.", "DRF permission classes, queryset filtering and domain-policy code should express the same authorization model instead of relying on one layer accidentally hiding data."],
        practice: ["Create an actor-resource-action authorization matrix for one Steward feature.", "Test same-role cross-object access and lower-role privileged actions.", "Trace the code path that enforces each decision.", "Fix one weak boundary or codify a verified boundary as regression coverage."],
        reflection: "Why is hiding an Edit button not evidence that an API operation is authorized correctly?",
    },
    {
        id: "input-validation",
        title: "Input Validation",
        intro: "Input validation constrains untrusted data to the forms the domain actually accepts. It reduces ambiguous states and attack opportunities, but it must complement safe APIs and output handling rather than being treated as a universal injection filter.",
        principles: ["Validate type, shape, length, range and domain invariants at a trusted boundary.", "Prefer allow-listed domain values where the set is known.", "Use parameterized APIs instead of attempting to sanitize SQL or shell syntax manually.", "Keep validation consistent across equivalent entry points."],
        steward: ["Steward service names, URLs, ownership identifiers, metadata and package references should be constrained by business meaning, not merely accepted because JSON parsing succeeded.", "DRF serializers are useful boundaries, but model/domain invariants still matter when data can enter through jobs, scripts or other code paths."],
        practice: ["Select one Steward write endpoint and enumerate accepted fields and invariants.", "Exercise malformed, boundary and unexpected-type inputs.", "Inspect serializer/model/domain enforcement.", "Implement one missing invariant and prove legitimate boundary values still work."],
        reflection: "Why should input validation express domain rules instead of becoming a blacklist of suspicious characters?",
    },
    {
        id: "secure-error-handling",
        title: "Secure Error Handling",
        intro: "Errors must help legitimate clients recover without exposing stack traces, secrets, internal queries or implementation details that improve an attacker's understanding of the system.",
        principles: ["Return stable client-facing error contracts.", "Log diagnostic detail server-side with appropriate access control.", "Do not leak stack traces, SQL fragments, credentials or secret values.", "Differentiate expected validation failures from unexpected server faults."],
        steward: ["Steward API clients should receive actionable status and field information while internal exception details remain in protected logs.", "A generic 500 that exposes database structure is insecure, but a generic 500 with no correlation evidence is also operationally weak."],
        practice: ["Trigger validation, authorization and unexpected-error paths in Steward.", "Compare client response with server-side evidence.", "Identify one information leak or unusable error contract.", "Improve it and verify the API still supports diagnosis without exposing internals."],
        reflection: "How can an error response be both too revealing for an attacker and too vague for legitimate operations?",
    },
    {
        id: "secrets-management",
        title: "Secrets Management",
        intro: "Application secrets are credentials with lifecycle requirements: creation, distribution, storage, use, rotation and revocation. Moving a secret from source code into an environment variable is only one part of that lifecycle.",
        principles: ["Never commit active secrets to source control.", "Give each workload only the secrets it needs.", "Separate environments and identities.", "Plan rotation and revocation before compromise forces an emergency response."],
        steward: ["Database credentials, Django signing material, JWT keys, Nexus credentials and external integration tokens should have explicit owners and consumers.", "Container/Delivery Security established delivery controls; this lesson verifies how the running Steward application receives and uses those secrets."],
        practice: ["Create a Steward secret inventory without recording values.", "Trace one secret from provisioning to application consumption.", "Check repository, logs, images and runtime configuration for accidental copies.", "Improve one lifecycle weakness and document rotation/revocation procedure."],
        reflection: "Why does storing a secret outside Git not by itself constitute a secrets-management strategy?",
        warning: "Do not print or commit real secret values as exercise evidence. Record names, locations, permissions, owners and rotation evidence instead.",
    },
    {
        id: "security-headers-configuration",
        title: "Security Headers and Configuration",
        intro: "Framework and HTTP configuration define browser and deployment security assumptions. Secure defaults reduce classes of mistakes, but each header or setting should correspond to an understood threat and actual application behavior.",
        principles: ["Disable debug behavior outside development.", "Use HTTPS-aware secure-cookie and transport settings where applicable.", "Apply browser security headers appropriate to the application.", "Treat configuration drift as security drift."],
        steward: ["Steward's API and any web UI may need different browser-facing controls, but DEBUG, allowed hosts/origins, cookie flags and proxy/TLS assumptions should be deliberate per environment.", "Headers are not substitutes for authorization, validation or output encoding."],
        practice: ["Inspect Steward production-like Django/DRF and reverse-proxy security settings.", "Capture relevant response headers and cookie properties.", "Map each control to the threat it addresses.", "Correct one unsafe setting and retest deployment behavior."],
        reflection: "Why is copying a long list of security headers from the internet weaker than selecting and verifying controls against Steward's actual architecture?",
    },
    {
        id: "security-logging",
        title: "Security Logging",
        intro: "Application security logging records events needed to detect abuse and reconstruct decisions without turning logs into a second sensitive-data store. Useful events identify what happened, to which resource, under which identity and with which outcome.",
        principles: ["Log security-relevant decisions and state changes.", "Include identity, target, outcome and correlation context where safe.", "Avoid passwords, tokens and unnecessary personal/sensitive data.", "Design events for investigation rather than raw verbosity."],
        steward: ["Steward should make authentication failures, authorization denials, privileged changes and security-relevant configuration changes attributable.", "Host auditing from the previous module and application events should eventually support one coherent investigation timeline."],
        practice: ["Choose three security-relevant Steward actions.", "Perform them and inspect emitted application evidence.", "Identify missing attribution or sensitive over-logging.", "Improve one event and verify it is useful for reconstruction."],
        reflection: "What minimum evidence would let you investigate who changed a sensitive Steward record and whether the action was authorized?",
    },
    {
        id: "rate-limiting-abuse",
        title: "Rate Limiting and Abuse Resistance",
        intro: "Valid requests can still be abusive when repeated at harmful scale. Abuse resistance combines quotas, throttling, cost awareness, identity and operational observation rather than assuming every authenticated request is benign.",
        principles: ["Protect expensive and high-risk operations first.", "Choose keys and limits that match the abuse model.", "Return predictable throttling behavior.", "Observe legitimate-client impact and bypass paths."],
        steward: ["Authentication, search, report generation, bulk operations and administrative endpoints may have different abuse costs and therefore different controls.", "DRF throttling can be one layer, but infrastructure limits and domain-specific controls may also be needed."],
        practice: ["Select a Steward endpoint with meaningful abuse potential.", "Define actor, cost and acceptable request behavior.", "Exercise controlled repeated requests in the learner environment.", "Implement or tune one limit and verify both throttled and legitimate traffic."],
        reflection: "Why is one global requests-per-minute limit usually a poor model for API abuse resistance?",
    },
    {
        id: "data-protection",
        title: "Data Protection",
        intro: "Data protection begins with knowing which data exists, why it is retained and which identities require it. Encryption helps with particular exposure paths, but minimization, authorization, retention and backup handling remain essential.",
        principles: ["Classify sensitive data before selecting controls.", "Collect and retain only justified data.", "Protect data in transit and at rest according to threat and environment.", "Include backups, exports and logs in the data lifecycle."],
        steward: ["Steward may hold user identity, ownership, operational metadata and security evidence. Each category can have different confidentiality and retention needs.", "Database encryption does not compensate for an API that returns excessive fields to unauthorized users."],
        practice: ["Build a small Steward data inventory and classification table.", "Trace one sensitive field through API, database, logs and backups/exports where applicable.", "Identify one excessive exposure or retention weakness.", "Implement or document a justified protection improvement and retest access."],
        reflection: "Why should a data-protection review trace data beyond the primary database?",
    },
    {
        id: "security-code-review",
        title: "Security-focused Code Review",
        intro: "Security code review follows untrusted data and privileged decisions through code. It asks where trust changes, where authorization occurs, which dangerous APIs are reachable and whether failure behavior preserves the intended security property.",
        principles: ["Review trust boundaries and sensitive operations, not every line equally.", "Trace source-to-sink data flow.", "Inspect authorization close to protected actions.", "Use automated findings as leads that require context."],
        steward: ["A Steward review should prioritize authentication, permissions, serializers, queryset scoping, file/URL handling, secrets/configuration and privileged workflows.", "SAST from the delivery module can accelerate discovery, but a clean scanner result does not prove domain authorization is correct."],
        practice: ["Select one security-sensitive Steward flow.", "Trace request input through validation, authorization, persistence and response.", "Record one verified control and one concern or improvement opportunity.", "Where a weakness is confirmed, fix it and attach a regression test."],
        reflection: "What can a human reviewer discover about Steward authorization that a generic static analyzer is unlikely to understand?",
    },
    {
        id: "abuse-cases-negative-requirements",
        title: "Abuse Cases and Negative Security Requirements",
        intro: "Functional requirements describe what legitimate users should accomplish; negative security requirements describe what actors must not be able to accomplish. Abuse cases turn threat-model paths into testable system behavior.",
        principles: ["Write negative requirements in observable terms.", "Tie them to assets, actors and trust boundaries.", "Include both malicious and accidental misuse.", "Give important negative requirements durable tests or controls."],
        steward: ["Instead of saying 'Steward must be secure', state properties such as 'a service owner cannot modify a service outside their authorized scope' or 'a logged-out token cannot continue a privileged operation if logout promises revocation'.", "The threat model created earlier is the source for these cases."],
        practice: ["Choose three high-priority Steward threat paths.", "Rewrite each as an observable negative requirement.", "Define the expected denial/failure evidence.", "Implement at least one as an automated security regression check."],
        reflection: "Why is 'prevent IDOR' a weaker requirement than describing the actor, target resource and denied action explicitly?",
    },
    {
        id: "security-regression-testing",
        title: "Security Regression Testing",
        intro: "A fixed vulnerability can return through refactoring, new endpoints or configuration drift. Security regression testing preserves important security properties as executable evidence alongside functional quality checks.",
        principles: ["Automate stable, high-value security properties.", "Test both allowed and denied behavior.", "Keep tests deterministic and safe for CI.", "Do not confuse scanner execution with application-specific regression coverage."],
        steward: ["Steward can place domain security checks in its API test suite and reusable testing capabilities in `tsa-test-core` when genuinely cross-service.", "Tests should consume approved internal packages through the supply-chain controls established in the previous module."],
        practice: ["Select two previously fixed or verified Steward security properties.", "Implement deterministic automated regression tests.", "Run them in the intended test pipeline.", "Demonstrate that one controlled mutation or temporary vulnerable condition would cause the relevant test to fail, then restore the secure state."],
        reflection: "Which Steward security controls belong in deterministic regression tests, and which are better verified through scanning, configuration assessment or periodic review?",
        warning: "Do not introduce exploitable behavior into shared or production environments merely to prove a test fails. Use a learner-controlled fixture, mock, branch or isolated lab condition.",
    },
];

const lab: Lesson = {
    id: "application-security-harden-steward-api",
    title: "Lab: Harden Steward API",
    activities: [
        {
            id: "application-security-harden-steward-api-001",
            title: "Translate Security Evidence into Requirements",
            estimatedMinutes: 75,
            content: {
                type: "practical",
                objective: "Turn the accumulated Steward security evidence into a prioritized application-hardening plan.",
                scenario: "Consume the threat model, Web/API assessment, vulnerability reproductions, host/network controls and delivery/supply-chain evidence. Do not restart from a generic checklist.",
                instructions: ["Collect open application-layer findings and residual risks.", "Group them by authentication, authorization, validation, data, configuration, abuse resistance and observability.", "Write observable positive and negative security requirements.", "Prioritize by demonstrated impact, likelihood and architectural reach."],
                deliverables: ["Application security requirements", "Prioritized hardening backlog", "Traceability to prior findings/threats"],
                completionCriteria: ["Requirements are observable and testable.", "Priorities are justified by Steward evidence.", "Prior security work is reused rather than duplicated."],
            },
        },
        {
            id: "application-security-harden-steward-api-002",
            title: "Implement and Retest Application Controls",
            estimatedMinutes: 150,
            content: {
                type: "practical",
                objective: "Implement a representative set of high-value Steward application controls and prove their behavior.",
                scenario: "Choose controls that cross multiple concerns rather than maximizing the number of tiny configuration changes.",
                instructions: ["Implement at least one identity/authorization control.", "Implement at least one input, error, configuration or data-protection control.", "Implement or tune one abuse/logging control where justified.", "Retest the original attack or misuse path and legitimate behavior after each change."],
                deliverables: ["Application hardening changes", "Before/after evidence", "Functional and adversarial retest results"],
                completionCriteria: ["Changes close or reduce named threats.", "Legitimate Steward behavior remains functional.", "Retest evidence supports every claimed mitigation."],
            },
        },
        {
            id: "application-security-harden-steward-api-003",
            title: "Build the Security Regression Layer",
            estimatedMinutes: 105,
            content: {
                type: "practical",
                objective: "Preserve important Steward application-security properties as durable engineering evidence.",
                scenario: "Prepare the application layer for the final Security Steward milestone by converting stable mitigations into regression checks and documenting what still requires periodic or manual verification.",
                instructions: ["Automate high-value authentication, authorization and negative requirements where deterministic.", "Add appropriate tests to Steward or reusable `tsa-test-core` capabilities without creating false generic abstractions.", "Run the security regression layer through the intended pipeline.", "Update findings with mitigated, partial, accepted or deferred status and residual risk."],
                deliverables: ["Security regression suite", "Pipeline execution evidence", "Updated residual-risk register", "Manual/periodic verification list"],
                completionCriteria: ["Automated checks protect specific security properties.", "Manual controls remain explicit rather than being falsely marked automated.", "The output is ready to feed the Security Steward milestone."],
            },
        },
    ],
};

export const applicationSecurityDeepLessons: Lesson[] = [...specs.map(lessonFrom), lab];
