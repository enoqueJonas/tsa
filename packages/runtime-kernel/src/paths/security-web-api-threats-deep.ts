import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const owaspTop10: LearningResource = { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" };
const owaspApiTop10: LearningResource = { title: "OWASP API Security Top 10", url: "https://owasp.org/API-Security/" };
const portSwiggerAcademy: LearningResource = { title: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" };

const resources = [owaspTop10, owaspApiTop10, portSwiggerAcademy];

type Spec = {
    id: string;
    title: string;
    intro: string;
    mentalModel: string[];
    steward: string[];
    practice: string[];
    reflection: string;
    warning?: string;
};

function blocksFor(spec: Spec): LessonBlock[] {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.intro },
        { type: "heading", id: `${spec.id}-mental-model`, text: "Security mental model", level: 2 },
        { type: "list", items: spec.mentalModel },
        { type: "heading", id: `${spec.id}-steward`, text: "Apply it to Steward", level: 2 },
        ...spec.steward.map((text): LessonBlock => ({ type: "paragraph", text })),
    ];

    if (spec.warning) {
        blocks.push({ type: "callout", tone: "warning", title: "Safety boundary", body: spec.warning });
    }

    blocks.push({
        type: "callout",
        tone: "steward",
        title: "Threat-model continuity",
        body: "Do not test this weakness because it appears on a famous checklist. Trace it back to a Steward asset, flow, trust boundary or abuse case from the threat model, then determine whether the path is actually reachable and what evidence would verify the control.",
    });
    blocks.push({ type: "resources", title: "Continue learning", resources });
    return blocks;
}

function lessonFrom(spec: Spec): Lesson {
    return {
        id: `web-and-api-threats-${spec.id}`,
        title: spec.title,
        activities: [
            {
                id: `web-and-api-threats-${spec.id}-001`,
                title: spec.title,
                estimatedMinutes: 50,
                content: { type: "reading", body: spec.intro, blocks: blocksFor(spec) },
            },
            {
                id: `web-and-api-threats-${spec.id}-002`,
                title: `Assess: ${spec.title}`,
                estimatedMinutes: 55,
                content: {
                    type: "practical",
                    objective: `Assess ${spec.title} against the learner-controlled Steward environment.`,
                    scenario: "Start from the current Steward threat model. Use only authorized TSA/Steward systems or intentionally vulnerable local fixtures. Prefer evidence-producing requests, tests and code/configuration review over speculative findings.",
                    instructions: spec.practice,
                    deliverables: ["Attack-path hypothesis", "Evidence or control-verification artifact", "Finding or justified no-finding note", "Mitigation/retest note when applicable"],
                    completionCriteria: ["The assessment is scoped to an identified Steward attack path.", "Evidence distinguishes reachable behavior from assumption.", "The learner can explain the security boundary and the control that should prevent abuse."],
                },
            },
            {
                id: `web-and-api-threats-${spec.id}-003`,
                title: `Knowledge Check: ${spec.title}`,
                estimatedMinutes: 10,
                content: { type: "reflection", prompt: spec.reflection, minimumCharacters: 200 },
            },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "injection-sqli",
        title: "Injection and SQL Injection",
        intro: "Injection occurs when untrusted input crosses into an interpreter as executable structure rather than remaining data. SQL injection is one instance; the engineering lesson is to understand parser boundaries, parameterization and the difference between validation and safe construction.",
        mentalModel: ["Identify every interpreter boundary before thinking about payloads.", "Prefer parameterized APIs and safe abstractions over string construction.", "Validation reduces bad input but does not replace safe query construction.", "ORM use lowers some risk but raw queries, dynamic filters and unsafe escape hatches can reintroduce it."],
        steward: ["Steward search, filtering and administrative reporting are realistic places to inspect because user-controlled values can influence database queries.", "Review Django ORM usage, any raw SQL and dynamically constructed ordering/filter fields before attempting active reproduction."],
        practice: ["Trace one user-controlled Steward input to persistence/query code.", "Inspect whether query structure and values are separated.", "Create a safe regression test demonstrating that hostile input remains data.", "Record whether the threat-model path is verified, mitigated or not reachable."],
        reflection: "Why is input validation alone not a complete SQL-injection defense, and what evidence in Steward would prove that query structure remains separate from user data?",
        warning: "Use only the local or explicitly authorized Steward environment. Do not probe third-party databases or internet systems.",
    },
    {
        id: "xss",
        title: "Cross-site Scripting",
        intro: "Cross-site scripting appears when attacker-controlled content is interpreted as executable browser content in another security context. The key concepts are output context, encoding, dangerous sinks and the distinction between stored, reflected and DOM-mediated paths.",
        mentalModel: ["Track untrusted data from source to browser sink.", "Encoding must match HTML, attribute, URL or script context.", "Framework escaping helps until developers bypass it or introduce dangerous HTML sinks.", "Stored XSS can turn a low-privilege write into a higher-privilege browser action."],
        steward: ["Service names, descriptions, links and other shared metadata are natural stored-content paths to inspect in a future Steward UI.", "A threat becomes important when content written by one actor is rendered inside an administrator or service-owner session."],
        practice: ["Identify renderable Steward fields and their output contexts.", "Inspect framework escaping and any explicit raw-HTML mechanisms.", "Use a harmless local marker to verify whether content is rendered as data or markup.", "Add a regression test or documented frontend requirement for the verified sink."],
        reflection: "Explain why stored XSS in shared Steward metadata could become a privilege-boundary issue even when the original writer has little authority.",
    },
    {
        id: "csrf",
        title: "Cross-site Request Forgery",
        intro: "CSRF abuses a browser's ambient authority by causing an authenticated browser to submit an unintended state-changing request. Risk depends on how credentials are transported, browser behavior and whether the server verifies request intent.",
        mentalModel: ["Start with credential transport: cookies create different CSRF conditions from explicit Authorization headers.", "Focus on state-changing operations.", "SameSite is useful defense-in-depth but not a universal replacement for CSRF controls.", "CORS and CSRF solve different problems."],
        steward: ["Ownership changes, role updates and administrative mutations would have high impact if Steward later uses cookie-backed browser authentication.", "If Steward remains token-based with explicit headers, document why a conventional CSRF path may not apply instead of forcing a finding."],
        practice: ["Document Steward credential transport and browser assumptions.", "Select a privileged mutation and determine whether ambient credentials can authorize it.", "Verify anti-CSRF controls when the architecture requires them.", "Record a reasoned no-finding when the prerequisite is absent."],
        reflection: "Why must you understand Steward's authentication transport before deciding whether CSRF is a meaningful threat?",
    },
    {
        id: "broken-authentication",
        title: "Broken Authentication",
        intro: "Authentication failures let an attacker impersonate or retain another identity. Assessment should cover credential handling, token issuance, lifecycle, reset/recovery, enumeration and the boundaries where identity becomes trusted.",
        mentalModel: ["Authentication establishes identity; it does not grant resource authority.", "Review the complete lifecycle: enrollment, login, refresh, logout, recovery and revocation.", "Rate controls and generic errors matter around credential guessing and enumeration.", "Short-lived credentials reduce exposure but do not fix insecure issuance or storage."],
        steward: ["Trace Steward JWT access and refresh behavior from issuance through expiry and logout assumptions.", "Treat administrative and CI identities separately because their compromise has different blast radius."],
        practice: ["Map the Steward authentication lifecycle to the threat model.", "Review token expiry, refresh and invalidation behavior.", "Test safe negative cases such as invalid, expired or malformed credentials.", "Create findings only where observed behavior violates a stated requirement."],
        reflection: "Which parts of the authentication lifecycle remain security-relevant after a user has successfully logged in, and why?",
    },
    {
        id: "authorization-idor",
        title: "Broken Authorization and IDOR",
        intro: "Authorization failures occur when the system knows who the caller is but permits an action or object that caller should not control. Object identifiers are not authorization controls; every sensitive operation needs a policy decision based on the authenticated actor and target resource.",
        mentalModel: ["Test horizontal, vertical and object-level authorization separately.", "Never infer permission from possession of an identifier.", "Enforce policy server-side at every sensitive path.", "A 404-style response can reduce disclosure but does not substitute for authorization."],
        steward: ["The central Steward case is whether a member of Team A can read or mutate Team B's restricted service, ownership or dependency records by changing an object identifier.", "Administrative endpoints and bulk operations deserve separate attention because they can bypass ordinary object-level rules."],
        practice: ["Create at least two users with different Steward ownership/role relationships.", "Exercise read and mutation operations across those boundaries.", "Verify that denied requests cause no state change.", "Add authorization regression tests for the discovered policy boundary."],
        reflection: "Why is changing a resource ID such a useful authorization test, and why does an unpredictable UUID not solve the underlying problem?",
    },
    {
        id: "ssrf",
        title: "Server-side Request Forgery",
        intro: "SSRF arises when attacker influence over a server-side outbound request lets the attacker use the server's network position, credentials or protocol capabilities. The dangerous asset is often not the fetched content but the server's trusted reachability.",
        mentalModel: ["Find features that make outbound requests from user-influenced locations.", "Model destination validation, redirects, DNS behavior and allowed protocols.", "Internal services and metadata endpoints can be more valuable than internet targets.", "Network segmentation and explicit allowlists reduce blast radius."],
        steward: ["Future webhook validation, repository metadata lookup, documentation URL previews or integration health checks could create outbound-request paths.", "If current Steward has no attacker-influenced outbound request feature, record the prerequisite and preserve it as a design requirement."],
        practice: ["Inventory Steward outbound HTTP/network features.", "Trace which destination components a caller can influence.", "Use only a learner-controlled local listener to test reachability.", "Document destination restrictions or a future security requirement."],
        reflection: "Why can a server making a request on behalf of a user be more dangerous than the same user making that request directly?",
    },
    {
        id: "path-traversal",
        title: "Path Traversal",
        intro: "Path traversal happens when attacker-controlled path components escape the intended storage boundary. The core issue is confusing a user-facing identifier with a trusted filesystem path.",
        mentalModel: ["Canonicalize paths before enforcing containment.", "Prefer generated server-side names or object identifiers over user-supplied paths.", "Reject traversal and alternate-encoding edge cases at a single boundary.", "Filesystem permissions provide defense-in-depth if application checks fail."],
        steward: ["Exports, uploaded evidence, generated reports or future attachment features could become traversal surfaces.", "The security requirement should define the intended storage root and prove that caller input cannot escape it."],
        practice: ["Locate any Steward code that maps request data to filesystem paths.", "Verify normalization and containment logic by code review and safe local tests.", "Check that denied paths never read/write outside the intended root.", "Add regression coverage if the feature exists."],
        reflection: "What is the difference between rejecting the literal string '../' and proving that a resolved Steward path remains inside an approved root?",
    },
    {
        id: "file-upload",
        title: "File Upload Risks",
        intro: "File uploads combine content, metadata, storage and later consumption. A secure design must consider size, type, naming, storage location, execution, parsing and who can retrieve the resulting object.",
        mentalModel: ["Do not trust filename extension or client MIME type as proof of content.", "Store uploads away from executable application paths.", "Generate server-controlled names and enforce size limits.", "Authorization still applies when files are later downloaded or rendered."],
        steward: ["If Steward accepts architecture evidence, runbooks or security artifacts later, uploads become part of the attack surface.", "Threat-model both the upload operation and every downstream consumer that previews, parses or serves the file."],
        practice: ["Document whether current Steward supports uploads; if not, write the future control requirements.", "Where supported, inspect size/type/name/storage controls.", "Use inert test fixtures rather than malware.", "Verify retrieval authorization separately from upload authorization."],
        reflection: "Why can a successfully stored file still be dangerous later even if the upload endpoint itself never executes it?",
    },
    {
        id: "command-injection",
        title: "Command Injection",
        intro: "Command injection occurs when untrusted input changes the structure of an operating-system command. The safest design avoids shell interpretation entirely and passes fixed executable arguments through structured process APIs.",
        mentalModel: ["Ask whether the application needs a shell at all.", "Separate executable, arguments and user data.", "Allowlist operations instead of sanitizing arbitrary shell syntax.", "Run application processes with the least operating-system privilege required."],
        steward: ["Future administrative diagnostics, repository tooling or report-generation helpers could introduce subprocess calls.", "A security review should flag shell interpolation early even before an exploitable endpoint exists."],
        practice: ["Search Steward for process-execution APIs and shell usage.", "Trace any request-controlled data reaching those calls.", "Refactor or specify structured argument passing where applicable.", "Use unit tests with inert metacharacter strings to prove data remains an argument."],
        reflection: "Why is escaping shell metacharacters generally a weaker design than avoiding a shell boundary entirely?",
        warning: "Do not execute destructive commands or use command-injection techniques outside the isolated learner-controlled environment.",
    },
    {
        id: "deserialization",
        title: "Insecure Deserialization Concepts",
        intro: "Deserialization turns bytes or structured data into application objects. Risk increases when formats can instantiate arbitrary types, invoke behavior or restore trusted state from attacker-controlled input.",
        mentalModel: ["Treat serialized input as untrusted unless integrity and origin are verified.", "Prefer simple data formats with explicit schemas.", "Separate data reconstruction from code/object execution.", "Signed data is only trustworthy if key management and verification are correct."],
        steward: ["JSON request bodies processed by DRF are not equivalent to dangerous native-object deserialization, which is an important distinction.", "Watch for future cache/session/job formats or imported artifacts that reconstruct richer objects."],
        practice: ["Inventory Steward serialization/deserialization formats.", "Classify which formats create plain data versus executable/rich object graphs.", "Verify schemas and trusted-type boundaries.", "Document why a conventional insecure-deserialization path is or is not reachable."],
        reflection: "Why is parsing JSON into validated DRF data structurally different from restoring arbitrary language-native objects supplied by a caller?",
    },
    {
        id: "misconfiguration",
        title: "Security Misconfiguration",
        intro: "Security misconfiguration is the gap between intended security posture and actual runtime configuration. Defaults, debug modes, permissive hosts/origins, verbose errors, exposed administration and environment drift can create exploitable paths without a code defect.",
        mentalModel: ["Assess effective runtime configuration, not just repository defaults.", "Secure configuration belongs in versioned, reviewable policy where possible.", "Development convenience must not silently become production behavior.", "Configuration drift is an operational security problem."],
        steward: ["Review Django DEBUG behavior, allowed hosts/origins, proxy/TLS assumptions, admin exposure and environment-specific settings.", "Later delivery and reliability schools should make these checks repeatable rather than relying on memory."],
        practice: ["Create a Steward security-configuration checklist tied to actual settings.", "Compare local/test/production-intended behavior.", "Verify that error responses and administrative surfaces do not expose unnecessary detail.", "Identify controls that should become CI or deployment gates."],
        reflection: "Give one example where perfectly safe application code could still be exposed by an unsafe Steward runtime configuration.",
    },
    {
        id: "secrets",
        title: "Sensitive Data and Secrets",
        intro: "Secrets are credentials or cryptographic material that confer authority. Sensitive data may not grant authority directly but still requires minimization, access control and safe handling across responses, logs, errors and developer workflows.",
        mentalModel: ["Separate secrets from ordinary configuration.", "Minimize collection and return only data required for the operation.", "Logs and exception traces are common secondary disclosure paths.", "Secret rotation and revocation are part of lifecycle security."],
        steward: ["Steward must protect JWT material, database credentials, CI/repository credentials and any external integration tokens.", "Service metadata itself may have confidentiality levels; the API should not assume all registry information is public."],
        practice: ["Inventory Steward secrets and sensitive fields.", "Inspect repository history/current code, logs and API responses for accidental exposure patterns.", "Verify environment-based secret injection rather than hard-coded values.", "Document rotation owner and blast radius for one high-value secret."],
        reflection: "Why should repository publishing credentials be treated differently from an ordinary configuration value such as a page-size default?",
    },
    {
        id: "api-abuse",
        title: "API Abuse and Rate Limiting",
        intro: "An API can be correctly authenticated and authorized yet still be abused through excessive volume, expensive queries, enumeration or automated business actions. Rate controls must protect resources and workflows rather than merely count requests globally.",
        mentalModel: ["Identify expensive or high-value operations before choosing limits.", "Use identity-, IP-, token- or resource-aware dimensions as appropriate.", "Return bounded pagination and constrain expensive search/filter combinations.", "Rate limiting is one control among quotas, caching, timeouts and business rules."],
        steward: ["Authentication attempts, broad registry search, bulk changes and integration endpoints have different abuse profiles.", "A Steward owner legitimately making many reads should not automatically share the same limit semantics as repeated failed authentication."],
        practice: ["Classify Steward endpoints by cost and abuse value.", "Define rate/usage-control requirements for at least three classes.", "Verify bounded pagination and one abuse-sensitive operation.", "Capture operational signals needed to tune limits without locking out normal users."],
        reflection: "Why is one global '100 requests per minute' rule usually a weak API-abuse design? Use two different Steward operations in your answer.",
    },
    {
        id: "token-session",
        title: "Token and Session Attacks",
        intro: "Tokens and sessions concentrate authenticated authority into reusable artifacts. Their security depends on generation, transport, storage, scope, expiry, refresh, revocation and resistance to replay.",
        mentalModel: ["Treat bearer tokens like temporary credentials.", "Validate issuer/audience/signature/expiry claims appropriate to the architecture.", "Refresh tokens deserve stronger lifecycle protection than short-lived access tokens.", "Logout semantics must match what the system can actually revoke or invalidate."],
        steward: ["Inspect Steward JWT claim validation, access/refresh lifetime and the behavior after logout or credential compromise.", "Do not describe stateless JWT logout as instant revocation unless a real revocation mechanism exists."],
        practice: ["Document Steward token lifecycle and trust decisions.", "Test malformed, expired and wrong-scope/wrong-type token cases safely.", "Verify refresh behavior and state-change expectations.", "Record residual replay risk and the chosen mitigation."],
        reflection: "What does logout mean in a token-based architecture, and what evidence would be required before claiming that a stolen token is immediately unusable?",
    },
    {
        id: "crypto",
        title: "Cryptographic Failures",
        intro: "Cryptographic failures often come from using cryptography in the wrong place, mode or lifecycle rather than from breaking the primitive itself. Engineers must identify what property is needed: confidentiality, integrity, authenticity, password resistance or secure transport.",
        mentalModel: ["Choose established libraries and protocols instead of custom cryptography.", "Password hashing is deliberately different from fast general-purpose hashing.", "TLS protects data in transit only where certificate validation and termination boundaries are correct.", "Key storage, rotation and scope are part of cryptographic design."],
        steward: ["Review password hashing through Django's supported mechanisms, JWT signing/key handling, TLS assumptions and any encrypted secrets or backups.", "The threat model should name the asset and property being protected rather than merely saying 'encrypt it'."],
        practice: ["Map Steward security-sensitive uses of hashing, signing and encryption.", "For each, state the required security property.", "Verify framework defaults/configuration against that property.", "Record one key-management lifecycle requirement."],
        reflection: "Why is 'use encryption' an incomplete mitigation? Give a Steward example where integrity or authenticity matters more than confidentiality.",
    },
    {
        id: "dependencies",
        title: "Vulnerable Dependencies",
        intro: "Applications inherit security risk from third-party and internal dependencies. The useful engineering question is not merely whether a CVE exists, but whether the vulnerable component/version is present, reachable in the deployment context and owned through a controlled remediation process.",
        mentalModel: ["Maintain an inventory of direct and transitive dependencies.", "Distinguish vulnerability presence from exploitability/reachability.", "Pin and update dependencies through reviewable workflows.", "Internal packages have provenance and compromise risks even without public CVEs."],
        steward: ["Steward depends on external packages plus steward-common and tsa-test-core, whose publication and consumption paths are already part of the security threat model.", "This lesson introduces vulnerability reasoning; Container and Delivery Security will later go deeper on provenance, dependency confusion, SBOMs and repository trust."],
        practice: ["Produce or inspect dependency inventories for Steward components.", "Select one reported vulnerability/example and determine version presence and plausible reachability.", "Document remediation or justified non-applicability.", "Record internal-package ownership and source expectations."],
        reflection: "Why should a vulnerability scanner result be treated as evidence to investigate rather than automatically as a confirmed exploitable Steward finding?",
    },
    {
        id: "logging-monitoring",
        title: "Security Logging and Monitoring Failures",
        intro: "Preventive controls sometimes fail. Security logging makes sensitive actions, denials and suspicious patterns observable enough to investigate without leaking credentials or personal data. Monitoring turns those records into detection and response signals.",
        mentalModel: ["Log security-relevant events with actor, action, target, outcome and correlation context.", "Never log passwords, full tokens or unnecessary sensitive payloads.", "Denied actions can be as valuable as successful privileged actions.", "A log that nobody can query, alert on or retain appropriately is not an effective detective control."],
        steward: ["Ownership transfers, administrative role changes, repeated authorization denials, authentication failures and internal-package publication events are security-relevant Steward signals.", "Reliability Engineering will later operationalize broader observability, but Security Steward must define what evidence incident responders need."],
        practice: ["Define a Steward security-event schema.", "Inspect existing application logs for sensitive leakage and missing actor/target context.", "Add or specify logs for one privileged mutation and one denied action.", "Define one detection hypothesis that could be built later."],
        reflection: "Why can logging every request body make Steward less secure even though it appears to improve observability?",
    },
    {
        id: "mass-assignment-exposure",
        title: "Mass Assignment and Excessive Data Exposure",
        intro: "APIs are vulnerable when generic serialization lets callers write fields they should not control or when responses expose fields they do not need. Strong API contracts explicitly define writable and readable fields per operation and role.",
        mentalModel: ["Treat serializer/model fields as separate from public API fields.", "Explicitly mark server-controlled properties read-only.", "Use response schemas tailored to consumer needs rather than dumping model objects.", "Authorization can be field-level as well as object-level."],
        steward: ["A caller creating a service must not be able to self-assign administrative approval, protected lifecycle state or ownership relationships merely because those fields exist on the model.", "Likewise, a list endpoint should not expose internal-only metadata simply because the backend has already loaded it."],
        practice: ["Compare Steward model fields with serializer readable/writable fields.", "Attempt safe negative tests for one server-controlled field.", "Review list/detail responses for unnecessary sensitive/internal fields.", "Add contract tests proving protected fields cannot be mass-assigned."],
        reflection: "How can an endpoint be correctly object-authorized yet still vulnerable to mass assignment or excessive data exposure?",
    },
];

const lab: Lesson = {
    id: "web-and-api-threats-steward-attack-paths-lab",
    title: "Lab: Assess Steward Web and API Attack Paths",
    activities: [
        {
            id: "web-and-api-threats-steward-attack-paths-lab-001",
            title: "Select Threat-model-driven Attack Paths",
            estimatedMinutes: 75,
            content: {
                type: "practical",
                objective: "Turn the Threat Modeling module output into a focused web/API security assessment plan.",
                scenario: "Use the prioritized Steward threat register and select attack paths that are reachable through the current API/web architecture. Do not manufacture one finding per OWASP category.",
                instructions: ["Select at least six threat-model entries with plausible web/API paths.", "Map each to endpoint, actor, asset, trust boundary and expected control.", "Choose evidence methods: request testing, code review, configuration review or automated regression.", "Record categories that are currently not applicable and the missing prerequisite."],
                deliverables: ["Assessment scope", "Threat-to-test matrix", "Expected-control map", "Explicit exclusions"],
                completionCriteria: ["Every planned test traces to the threat model.", "High-impact authorization/authentication paths receive appropriate priority.", "Non-applicable categories are not forced into findings."],
            },
        },
        {
            id: "web-and-api-threats-steward-attack-paths-lab-002",
            title: "Execute and Capture Evidence",
            estimatedMinutes: 150,
            content: {
                type: "practical",
                objective: "Assess representative Steward attack paths safely and reproducibly.",
                scenario: "Exercise only learner-controlled Steward environments. Use separate test identities and deterministic fixtures so authorization, token lifecycle, input handling and data-exposure behavior can be reproduced.",
                instructions: ["Execute the selected tests and capture request/response or code/configuration evidence.", "Distinguish confirmed finding, verified control, inconclusive result and not-applicable case.", "For confirmed findings, describe preconditions, affected asset, impact and reproduction steps without unnecessary weaponization.", "Add regression coverage where the control belongs in automated testing."],
                deliverables: ["Evidence bundle", "Findings register", "Verified-control register", "Security regression tests"],
                completionCriteria: ["Results are reproducible.", "Evidence supports each conclusion.", "Findings distinguish impact from mere payload behavior.", "Testing remained inside authorized systems."],
            },
        },
        {
            id: "web-and-api-threats-steward-attack-paths-lab-003",
            title: "Prioritize, Mitigate and Feed the Vulnerability Lab",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Convert assessment evidence into remediation and controlled vulnerability-laboratory work.",
                scenario: "Not every confirmed weakness should be deeply exploited in this module. Select representative findings for the next isolated Vulnerability Laboratory while fixing straightforward controls and preserving residual-risk decisions.",
                instructions: ["Prioritize confirmed findings using threat-model impact, plausibility and control strength.", "Define a verifiable mitigation/security requirement for each material finding.", "Implement and retest at least one safe correction where feasible.", "Select a small representative set of weaknesses for controlled reproduction in the next module.", "Update the threat model with new evidence and residual risk."],
                deliverables: ["Prioritized web/API assessment", "Mitigation requirements", "Retest evidence", "Vulnerability-lab handoff", "Updated threat-model entries"],
                completionCriteria: ["Assessment results feed engineering decisions rather than remaining a scan report.", "Mitigations are testable.", "The next lab receives a bounded, authorized target set.", "Residual risk is explicit."],
            },
        },
    ],
};

export const webAndApiThreatsDeepLessons: Lesson[] = specs.map(lessonFrom).concat([lab]);
