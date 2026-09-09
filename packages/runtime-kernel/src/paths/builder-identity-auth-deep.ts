import type { Lesson } from "./lesson";

const OWASP_AUTH = "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html";
const OWASP_PASSWORD = "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html";
const OWASP_JWT = "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html";
const DRF_AUTH = "https://www.django-rest-framework.org/api-guide/authentication/";
const DRF_PERMISSIONS = "https://www.django-rest-framework.org/api-guide/permissions/";

function richLesson(
    id: string,
    title: string,
    introduction: string,
    outcomes: string[],
    sections: { id: string; title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[],
    practice: { objective: string; scenario: string; instructions: string[]; deliverables: string[]; completionCriteria: string[] },
    questions: string[],
    resources: { title: string; url: string }[],
): Lesson {
    return {
        id,
        title,
        activities: [
            {
                id: `${id}-reading`,
                title,
                estimatedMinutes: 28,
                content: {
                    type: "reading",
                    body: introduction,
                    blocks: [
                        { type: "paragraph", text: introduction },
                        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
                        { type: "list", items: outcomes },
                        ...sections.flatMap((section) => [
                            { type: "heading" as const, id: section.id, text: section.title, level: 2 as const },
                            ...section.paragraphs.map((text) => ({ type: "paragraph" as const, text })),
                            ...(section.code ? [{ type: "code" as const, language: section.code.language, code: section.code.code, caption: section.code.caption }] : []),
                        ]),
                        {
                            type: "callout",
                            tone: "steward",
                            title: "Steward connection",
                            body: "Security rules in Steward are domain rules as well as technical controls. Team membership, service ownership and role boundaries must be visible in code, tests and API behavior rather than implied by UI screens.",
                        },
                        { type: "resources", title: "Required and supporting reading", resources },
                    ],
                },
            },
            {
                id: `${id}-practice`,
                title: "Engineering Practice",
                estimatedMinutes: 35,
                content: { type: "practical", ...practice },
            },
            {
                id: `${id}-check`,
                title: "Knowledge Check",
                estimatedMinutes: 10,
                content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") },
            },
        ],
    };
}

export const identityAuthenticationAuthorizationDeepLessons: Lesson[] = [
    richLesson(
        "identity-authentication-authorization-identity-in-software-systems",
        "Identity in Software Systems",
        "Before a system can decide what a caller may do, it needs a trustworthy representation of who or what that caller is. Identity is therefore not a username field; it is the set of claims the system is prepared to bind to an actor and use in later decisions.",
        ["Distinguish identity, account, credential and session.", "Model human and service identities separately.", "Explain why stable identifiers matter more than display names.", "Connect identity records to Steward team membership and ownership."],
        [
            { id: "identity-model", title: "Identity is a security subject", paragraphs: ["A user account is a local record. An identity is the subject the system believes it is interacting with. Credentials are evidence used to establish that belief. A session or token carries the authenticated result forward for some period of time.", "Use stable internal identifiers for authorization decisions. Email addresses, names and team labels can change. Authorization tied directly to mutable display data becomes fragile and difficult to audit."] },
            { id: "steward-subjects", title: "Identity inside Steward", paragraphs: ["Steward needs at least human users and later may need machine/service identities. A User can belong to one or more Teams through Membership records. Permissions should derive from that relationship rather than from a free-form team name copied into a token."], code: { language: "text", code: "User 42\n  └── Membership(team=platform, role=maintainer)\n        └── may modify Service owned by platform\n\nUser 42\n  └── no Membership(team=payments)\n        └── may read, but may not modify payments-owned Service", caption: "Identity becomes useful when connected to explicit domain relationships." } },
        ],
        { objective: "Create an identity model for Steward that separates users, memberships and credentials.", scenario: "The current Steward API needs a durable identity foundation before JWT and authorization are added.", instructions: ["Sketch User, Membership and Team relationships.", "Choose stable identifiers and explain why they are stable.", "List which attributes are identity data, credential data and profile data.", "Identify one future machine-identity use case without implementing it."], deliverables: ["Identity model", "Identifier rationale"], completionCriteria: ["Authorization does not depend on display names.", "Credentials are not stored as ordinary profile fields.", "Membership is explicit and queryable."] },
        ["Why is an email address usually a poor primary authorization identifier?", "What is the difference between an identity and a credential?", "Why should membership be modeled explicitly in Steward?"],
        [{ title: "OWASP Authentication Cheat Sheet", url: OWASP_AUTH }],
    ),
    richLesson(
        "identity-authentication-authorization-authentication-versus-authorization",
        "Authentication versus Authorization",
        "Authentication answers who the caller is. Authorization answers whether that authenticated subject may perform a specific action on a specific resource. Treating them as the same concern produces APIs that are logged-in but still over-permissive.",
        ["Separate authentication from authorization in request processing.", "Explain authentication failure versus permission denial.", "Design allow/deny decisions around resource and action.", "Recognize why authenticated does not mean trusted for every operation."],
        [
            { id: "two-decisions", title: "Two different decisions", paragraphs: ["Authentication verifies evidence and establishes a principal. Authorization evaluates policy using that principal, the requested action, resource state and sometimes context. A valid token can still receive 403 because identity proof does not grant ownership or role.", "In Steward, a user may be authenticated and allowed to read the service registry while still being forbidden to edit a Service owned by another Team."] },
            { id: "request-flow", title: "Make the boundary visible", paragraphs: ["A useful mental flow is: parse request → authenticate → load resource → authorize action → execute domain operation. Avoid hiding all authorization inside serializer validation or relying only on front-end buttons."], code: { language: "text", code: "request\n  ↓\nauthenticate token → principal\n  ↓\nload Service\n  ↓\ncheck team membership + required role\n  ↓\nperform update OR return 403", caption: "Authentication establishes a principal; authorization evaluates the operation." } },
        ],
        { objective: "Write an authorization decision table for Steward service operations.", scenario: "Steward supports anonymous denial, authenticated reads and team-scoped modifications.", instructions: ["List actions: list, retrieve, create, update, delete.", "Define the authenticated principal required for each.", "Define ownership or team-role requirements.", "Add expected 401 versus 403 outcomes."], deliverables: ["Decision table"], completionCriteria: ["401 and 403 are not conflated.", "Each write action includes a resource-aware authorization rule.", "Authentication alone never grants all writes."] },
        ["Can a valid token still produce a 403? Why?", "What information does authorization need beyond identity?", "Where should resource-aware authorization happen in the request flow?"],
        [{ title: "DRF Authentication", url: DRF_AUTH }, { title: "DRF Permissions", url: DRF_PERMISSIONS }],
    ),
    richLesson(
        "identity-authentication-authorization-password-storage-and-hashing",
        "Password Storage and Hashing",
        "Passwords are verifier secrets, not data the application should be able to recover. The objective is to store enough information to verify a future attempt while making stolen credential databases expensive to crack.",
        ["Explain why passwords must be hashed rather than encrypted.", "Describe salts, work factors and adaptive password hashing.", "Use framework password APIs instead of implementing cryptography.", "Recognize dangerous logging and reset patterns."],
        [
            { id: "one-way", title: "Verification, not recovery", paragraphs: ["Encryption is reversible by design; password verification should not require recovery of the original password. Modern password hash functions include a salt and configurable computational cost so identical passwords do not produce reusable lookup values and attacks remain expensive as hardware improves.", "Django already provides mature password hashing and upgrade behavior. Calling set_password and check_password is safer than inventing a storage format or directly assigning raw password text to a model field."] },
            { id: "django-passwords", title: "Use Django's password boundary", paragraphs: ["Never write user.password = raw_password. That stores unusable or dangerous data depending on the code path. Password creation and change should pass through Django's dedicated hashing API."], code: { language: "python", code: "user = User(email=\"engineer@example.com\")\nuser.set_password(raw_password)\nuser.save()\n\nif not user.check_password(candidate):\n    raise AuthenticationFailed(\"Invalid credentials\")", caption: "Delegate password hashing to Django." } },
        ],
        { objective: "Audit Steward password handling for unsafe storage and logging.", scenario: "A teammate implemented registration and login quickly and asks for a security review.", instructions: ["Trace registration and password-change paths.", "Verify set_password or equivalent framework APIs are used.", "Inspect logs and error responses for password leakage.", "Document reset behavior and whether current passwords can ever be retrieved."], deliverables: ["Password-handling audit"], completionCriteria: ["No plaintext or reversible password storage exists.", "Raw passwords do not enter logs.", "Framework hashing APIs are used."] },
        ["Why is encryption the wrong default for stored passwords?", "What purpose does a salt serve?", "Why should application developers prefer framework password APIs?"],
        [{ title: "OWASP Password Storage Cheat Sheet", url: OWASP_PASSWORD }, { title: "Django password management", url: "https://docs.djangoproject.com/en/stable/topics/auth/passwords/" }],
    ),
    richLesson(
        "identity-authentication-authorization-jwt-structure-and-lifecycle",
        "JWT Structure and Lifecycle",
        "A JSON Web Token is a signed container for claims. Its signature can protect integrity, but a JWT is not automatically confidential, revocable, correctly scoped or safe merely because a library can decode it.",
        ["Describe JWT header, payload and signature.", "Distinguish signed from encrypted data.", "Identify standard lifecycle claims such as exp, iat and sub.", "Explain why token verification must constrain algorithm, issuer and audience as appropriate."],
        [
            { id: "structure", title: "Three encoded parts", paragraphs: ["A compact JWS-style JWT contains base64url-encoded header and payload plus a signature. Anyone who holds the token can usually decode the payload. Never put passwords, secrets or sensitive personal data there simply because the string looks opaque.", "The verifier must validate the signature and relevant claims. Decoding without verification is not authentication."] },
            { id: "claims", title: "Claims should be minimal and purposeful", paragraphs: ["Use stable subject identifiers in sub. exp bounds lifetime. iat helps reason about issuance. iss and aud can reduce token confusion between issuers or services. Avoid copying dynamic authorization state into long-lived tokens unless you understand the staleness trade-off."], code: { language: "json", code: "{\n  \"sub\": \"42\",\n  \"iss\": \"steward-api\",\n  \"aud\": \"steward-web\",\n  \"iat\": 1788958800,\n  \"exp\": 1788959700\n}", caption: "A small illustrative claim set; authorization still consults current Steward state." } },
        ],
        { objective: "Define the claims Steward actually needs in an access token.", scenario: "The team wants to place user ID, email, every role and every team membership into JWTs.", instructions: ["Separate identity claims from authorization state.", "Keep only claims required on most requests.", "Define expiry expectations.", "Explain which authorization facts should remain database-backed."], deliverables: ["JWT claim contract", "Staleness analysis"], completionCriteria: ["No secrets are placed in payloads.", "The subject is stable.", "Dynamic membership is not copied blindly into long-lived tokens."] },
        ["Does signing a JWT make its payload secret?", "What is the difference between decoding and verifying?", "Why can embedding team membership in long-lived tokens become dangerous?"],
        [{ title: "OWASP JWT Cheat Sheet", url: OWASP_JWT }, { title: "RFC 7519", url: "https://www.rfc-editor.org/rfc/rfc7519" }],
    ),
    richLesson(
        "identity-authentication-authorization-access-and-refresh-tokens",
        "Access and Refresh Tokens",
        "Access and refresh tokens serve different risk and usability goals. Short-lived access tokens limit exposure; refresh tokens allow a session to continue without repeatedly asking for the user's password.",
        ["Explain the roles of access and refresh tokens.", "Choose different lifetimes based on risk.", "Keep refresh endpoints narrowly scoped.", "Understand why refresh tokens deserve stronger protection than access tokens."],
        [
            { id: "two-token-model", title: "Separate frequent use from session continuation", paragraphs: ["Access tokens travel to ordinary protected endpoints and should usually be short-lived. Refresh tokens are used less frequently to obtain new access tokens and often live longer. Because a stolen refresh token can extend an attacker's access, it deserves careful storage and rotation policy.", "A refresh token should not behave like a general access token. Its audience and endpoint usage should be narrow."] },
            { id: "flow", title: "A basic lifecycle", paragraphs: ["Login verifies credentials once, returns an access/refresh pair, ordinary calls use access, and the refresh endpoint exchanges refresh state for a new access token. Logout semantics depend on whether refresh state is server-tracked or blacklistable."], code: { language: "text", code: "credentials → /token → access + refresh\naccess → /services → protected response\nrefresh → /token/refresh → new access\nexpired access → rejected even if refresh is still valid", caption: "Keep the two token purposes explicit." } },
        ],
        { objective: "Define Steward's access/refresh lifecycle and failure cases.", scenario: "Steward needs browser/API sessions without making access tokens long-lived.", instructions: ["Choose access and refresh lifetimes and justify them.", "Define what happens when access expires.", "Define what happens when refresh expires or is revoked.", "Document how clients should handle 401 from expired access."], deliverables: ["Token lifecycle diagram", "Failure table"], completionCriteria: ["Access lifetime is shorter than refresh lifetime.", "Refresh tokens are not accepted on ordinary API endpoints.", "Expiry behavior is explicit."] },
        ["Why use a refresh token instead of a very long-lived access token?", "Which token should be sent to ordinary Steward endpoints?", "Why does refresh-token theft have high impact?"],
        [{ title: "Simple JWT documentation", url: "https://django-rest-framework-simplejwt.readthedocs.io/en/latest/" }],
    ),
    richLesson(
        "identity-authentication-authorization-expiration-and-token-rotation",
        "Expiration and Token Rotation",
        "Token expiry limits how long a credential remains useful. Rotation goes further by replacing refresh credentials as they are used, creating an opportunity to detect reuse and reduce the value of copied tokens.",
        ["Separate expiry, revocation and rotation.", "Explain replay risk for refresh tokens.", "Design logout and compromise responses deliberately.", "Identify trade-offs between stateless simplicity and server-side control."],
        [
            { id: "three-controls", title: "Expiry, revocation and rotation solve different problems", paragraphs: ["Expiration is time-based. Revocation invalidates a token before its natural expiry. Rotation replaces refresh credentials after successful use. A purely stateless design makes revocation difficult; server-side blacklists or token-family state add control but also persistence and operational complexity.", "Steward does not need to pretend these trade-offs disappear. The Builder goal is to choose and document a defensible lifecycle."] },
            { id: "reuse", title: "Refresh-token reuse is a useful signal", paragraphs: ["When rotation is enabled, presenting an already-used refresh token can indicate that a token was copied. Mature designs can revoke the token family or force reauthentication rather than silently issuing another credential."] },
        ],
        { objective: "Design a refresh rotation and logout policy for Steward.", scenario: "A user logs out on one device after suspecting credential theft.", instructions: ["Define whether refresh tokens are rotated.", "Define whether logout blacklists one token or all sessions.", "Describe behavior when an old rotated token is reused.", "Document operational state required to enforce the policy."], deliverables: ["Rotation policy", "Logout/compromise response"], completionCriteria: ["Expiry and revocation are not treated as synonyms.", "Replay/reuse is considered.", "The statefulness trade-off is acknowledged."] },
        ["How is rotation different from expiration?", "Why might a server keep refresh-token state?", "What should reuse of a rotated refresh token suggest?"],
        [{ title: "Simple JWT blacklist app", url: "https://django-rest-framework-simplejwt.readthedocs.io/en/latest/blacklist_app.html" }],
    ),
    richLesson(
        "identity-authentication-authorization-authentication-flows",
        "Authentication Flows",
        "Authentication is a protocol flow, not a single login endpoint. Registration, login, refresh, logout, password change and credential failure each modify security state and need consistent contracts.",
        ["Map end-to-end authentication flows.", "Avoid account-enumeration leaks where appropriate.", "Define state transitions for password change and logout.", "Separate credential verification from token issuance."],
        [
            { id: "flow-design", title: "Design flows as state transitions", paragraphs: ["Login begins with credentials and ends with authenticated session material or a deliberately limited failure response. Refresh begins with an existing refresh credential. Password change should normally require an authenticated session and current-password or equivalent assurance depending on risk. Each flow has different preconditions.", "Do not let response wording, timing or status design accidentally reveal more identity information than necessary on public authentication endpoints."] },
            { id: "steward-flow", title: "Steward's minimum Builder flow", paragraphs: ["For this stage, Steward should support account creation through an intentional path, credential login, access/refresh issuance, refresh, logout/revocation behavior and protected API access. Recovery/MFA can remain later security work unless explicitly required."], code: { language: "text", code: "register → stored identity + password hash\nlogin → verify password → tokens\nrequest → verify access → principal\nrefresh → verify refresh → rotate/issue\nlogout → revoke refresh according to policy", caption: "Each arrow represents a security state transition worth testing." } },
        ],
        { objective: "Create a sequence map for Steward authentication flows.", scenario: "The API has endpoints but no documented authentication lifecycle.", instructions: ["Map register, login, protected request, refresh and logout.", "For each step list input, state read/write and failure outcome.", "Identify which endpoints require existing authentication.", "Add at least one negative path per flow."], deliverables: ["Authentication sequence map"], completionCriteria: ["State transitions are explicit.", "Negative paths are included.", "Credential verification and token issuance are separate concepts."] },
        ["Why is logout a security-state operation rather than only a UI action?", "What are the preconditions for refresh compared with login?", "Why should authentication error messages be designed deliberately?"],
        [{ title: "OWASP Authentication Cheat Sheet", url: OWASP_AUTH }],
    ),
    richLesson(
        "identity-authentication-authorization-roles-and-permissions",
        "Roles and Permissions",
        "Roles are useful when they compress a set of permissions, but role names alone are not a complete authorization model. The important question is which action a principal may perform within which scope.",
        ["Distinguish roles from permissions.", "Scope permissions to teams and resources.", "Avoid a single global role field when domain membership is contextual.", "Design least-privilege Steward roles."],
        [
            { id: "role-compression", title: "Roles are permission bundles", paragraphs: ["A role such as maintainer is shorthand for allowed actions. In Steward that role belongs on a Membership because the same user can be a maintainer of one Team and only a viewer or non-member of another. A global user.role field cannot represent that safely.", "Start with the smallest role set that expresses real work. Avoid creating many decorative roles before concrete permission differences exist."] },
            { id: "permission-matrix", title: "Model scope explicitly", paragraphs: ["Permission decisions should combine action with scope. For example, team maintainers may create or modify services owned by that team, while ordinary authenticated users may read the registry."], code: { language: "text", code: "viewer:     read services\nmaintainer: read + create/update services for own team\nadmin:      exceptional platform-wide administration\n\nrole is attached to Team Membership, not globally copied onto User", caption: "A small scoped role model is stronger than a large vague one." } },
        ],
        { objective: "Build Steward's role-permission matrix.", scenario: "The team currently has a boolean is_admin and wants to add service ownership rules.", instructions: ["Define viewer, maintainer and any truly necessary admin capability.", "Map each role to concrete actions.", "Attach team-scoped roles to Membership.", "Identify actions that should remain platform-wide and exceptional."], deliverables: ["Role-permission matrix"], completionCriteria: ["Most permissions are team-scoped.", "Roles map to concrete actions.", "The design follows least privilege."] },
        ["Why is a role not the same as a permission?", "Why should maintainer usually live on Membership rather than User?", "What does least privilege mean in Steward?"],
        [{ title: "DRF Permissions", url: DRF_PERMISSIONS }],
    ),
    richLesson(
        "identity-authentication-authorization-object-level-authorization",
        "Object-Level Authorization",
        "Endpoint-level permission checks are insufficient when access depends on the specific object being manipulated. Object-level authorization asks whether this principal may perform this action on this particular resource.",
        ["Recognize object-level authorization requirements.", "Implement checks against loaded resource ownership.", "Cover list/queryset leakage as well as detail operations.", "Test negative cross-team cases."],
        [
            { id: "object-check", title: "The resource changes the answer", paragraphs: ["A maintainer may be allowed to update /services/{id}, but not every Service. Once the resource is loaded, Steward must compare its owning_team with current Membership state. The same endpoint and same HTTP method can therefore produce allow or deny depending on the object.", "Be careful with collection endpoints too. Object permission hooks on retrieve/update do not automatically prevent list endpoints from returning records the caller should never see in systems with private data."], code: { language: "python", code: "def can_modify_service(user, service) -> bool:\n    return Membership.objects.filter(\n        user=user,\n        team=service.owning_team,\n        role=Membership.Role.MAINTAINER,\n    ).exists()", caption: "Authorization derives from current domain state." } },
        ],
        { objective: "Implement and test object-level authorization for Steward services.", scenario: "A maintainer from Team A attempts to modify a service owned by Team B.", instructions: ["Add a reusable service-modification policy.", "Apply it to update and delete operations.", "Write positive same-team tests.", "Write negative cross-team tests.", "Verify list behavior does not leak anything the product intends to restrict."], deliverables: ["Authorization policy", "Positive/negative tests"], completionCriteria: ["Cross-team writes are denied.", "Same-team role behavior is proven.", "Authorization uses current database relationships."] },
        ["Why can endpoint-level authorization be insufficient?", "What makes authorization object-level?", "Why must collection/list behavior also be reviewed?"],
        [{ title: "DRF Object level permissions", url: "https://www.django-rest-framework.org/api-guide/permissions/#object-level-permissions" }],
    ),
    richLesson(
        "identity-authentication-authorization-ownership-and-access-rules",
        "Ownership and Access Rules",
        "Ownership is a domain relationship with security consequences. In Steward, services are owned by Teams, not by whichever user happened to create the record. That distinction keeps governance and authorization aligned with organizational responsibility.",
        ["Model team ownership as durable domain data.", "Separate creator/audit metadata from owner authority.", "Define transfer-of-ownership rules.", "Ensure nested resources inherit or validate ownership consistently."],
        [
            { id: "team-ownership", title: "Creator is not owner", paragraphs: ["created_by is useful audit information, but it should not become Steward's authority model. A Service belongs to an owning Team. Team membership determines who can act on behalf of that owner.", "Ownership transfer is therefore a meaningful security operation. Moving a service from Team A to Team B changes who may administer it and should require appropriate authority rather than ordinary field-edit permission."] },
            { id: "nested-resources", title: "Dependencies and environments must respect ownership", paragraphs: ["When creating an Environment or dependency relationship through a Service, ensure the caller can manage the source Service and that referenced objects obey domain rules. Nested endpoints can otherwise bypass the main Service permission model."] },
        ],
        { objective: "Write explicit ownership invariants for Steward.", scenario: "Several endpoints can mutate Service, Environment and ServiceDependency records.", instructions: ["Define who owns each aggregate or record.", "Define who may create/update/delete each.", "Define ownership transfer separately.", "Review nested endpoints for bypass paths."], deliverables: ["Ownership policy", "Bypass review"], completionCriteria: ["Creator metadata is not confused with owner authority.", "Ownership transfer has a stronger rule.", "Nested writes cannot bypass service ownership checks."] },
        ["Why should created_by not determine Steward service ownership?", "Why is ownership transfer security-sensitive?", "How can nested endpoints accidentally bypass authorization?"],
        [{ title: "OWASP Authorization Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" }],
    ),
    richLesson(
        "identity-authentication-authorization-common-authentication-and-authorization-mistakes",
        "Common Authentication and Authorization Mistakes",
        "Security defects often come from missing boundaries rather than sophisticated cryptography: trusting client-supplied ownership, checking permissions only in the UI, exposing overly long-lived tokens, leaking credentials into logs, or forgetting negative authorization tests.",
        ["Recognize common authn/authz implementation failures.", "Identify client-controlled security attributes.", "Use deny-by-default and server-derived ownership.", "Design negative tests as first-class evidence."],
        [
            { id: "mistakes", title: "Failure patterns worth hunting", paragraphs: ["Do not trust owning_team_id from a request merely because the JSON is valid. Confirm the authenticated user may act for that team. Do not expose write buttons as the primary authorization control; the API must deny unauthorized calls directly. Do not assume a valid JWT means the subject may manipulate arbitrary resource IDs.", "Avoid detailed login errors that unnecessarily distinguish unknown user from wrong password. Avoid logging Authorization headers, refresh tokens or raw credentials. Keep token lifetimes and CORS/transport concerns explicit rather than relying on defaults you have not inspected."] },
            { id: "negative-testing", title: "Test what must not happen", paragraphs: ["Positive tests prove functionality. Security confidence requires negative cases: expired token, malformed token, wrong team, insufficient role, changed membership, self-dependency attempt, forged ownership, revoked refresh and direct object-ID manipulation."] },
        ],
        { objective: "Run a targeted authorization abuse review against Steward.", scenario: "Assume the client can send arbitrary IDs and payloads and try to cross every trust boundary.", instructions: ["Attempt cross-team service update/delete.", "Attempt to assign ownership to a team without membership.", "Replay expired/revoked token cases.", "Inspect logs for sensitive headers/tokens.", "Record each attempted abuse and observed control."], deliverables: ["Abuse-case checklist", "Evidence of denials", "Any defects found"], completionCriteria: ["At least five negative cases are exercised.", "The API, not the UI, enforces denial.", "Sensitive credentials are absent from logs."] },
        ["Why is hiding a button not authorization?", "Why is client-supplied owning_team_id security-sensitive?", "What kind of evidence do negative tests provide that happy-path tests do not?"],
        [{ title: "OWASP Authorization Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" }, { title: "OWASP API Security Top 10", url: "https://owasp.org/API-Security/" }],
    ),
    {
        id: "identity-authentication-authorization-lab-secure-steward-api",
        title: "Lab: Secure Steward API",
        activities: [
            {
                id: "identity-authentication-authorization-lab-secure-steward-api-reading",
                title: "Secure Steward as a Domain-Aware API",
                estimatedMinutes: 20,
                content: {
                    type: "reading",
                    body: "This lab integrates the identity, credential, token and authorization model into the existing PostgreSQL-backed Steward API. The goal is not merely to make endpoints require a token; it is to prove that real team ownership boundaries survive hostile requests.",
                    blocks: [
                        { type: "paragraph", text: "This lab integrates the identity, credential, token and authorization model into the existing PostgreSQL-backed Steward API. The goal is not merely to make endpoints require a token; it is to prove that real team ownership boundaries survive hostile requests." },
                        { type: "heading", id: "target", text: "Target security model", level: 2 },
                        { type: "list", items: ["Django-managed password hashing", "JWT access and refresh tokens", "short-lived access credentials", "documented refresh/rotation/logout behavior", "Team Membership roles", "object-level Service authorization", "ownership-transfer protection", "negative cross-team tests", "no credential leakage in logs"] },
                        { type: "callout", tone: "warning", title: "Do not fake authorization", body: "A test that only verifies unauthenticated requests return 401 is not enough. The important Builder evidence is authenticated-but-unauthorized behavior: valid user, valid token, wrong team or insufficient role, denied by the API." },
                        { type: "resources", title: "Implementation references", resources: [{ title: "Simple JWT", url: "https://django-rest-framework-simplejwt.readthedocs.io/en/latest/" }, { title: "DRF permissions", url: DRF_PERMISSIONS }, { title: "OWASP Authorization Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" }] },
                    ],
                },
            },
            {
                id: "identity-authentication-authorization-lab-secure-steward-api-practice",
                title: "Secure Steward API",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Implement and prove authentication plus team-scoped object authorization in Steward.",
                    scenario: "Steward already has Django/DRF endpoints and PostgreSQL persistence. Add a real identity/security boundary without redesigning the product into a generic authentication demo.",
                    instructions: ["Use Django's password hashing and verify raw passwords are never persisted or logged.", "Implement JWT access and refresh endpoints with explicit lifetimes.", "Choose and document refresh rotation/revocation/logout behavior.", "Use Membership roles to represent team-scoped authority.", "Require authentication for protected write operations.", "Implement object-level rules so maintainers can modify services owned by their team but not another team.", "Protect ownership transfer as a distinct higher-risk operation.", "Apply equivalent rules to Environment and ServiceDependency mutations so nested routes cannot bypass Service authorization.", "Write tests for no-token, expired-token, insufficient-role, cross-team, revoked/invalid refresh and positive same-team cases.", "Inspect application logs and ensure credentials, Authorization headers and refresh tokens are not emitted.", "Update OpenAPI/authentication documentation so another engineer can exercise the flows."],
                    deliverables: ["JWT authentication implementation", "Membership/role authorization policy", "Object-level permission code", "Authentication and authorization test suite", "Token lifecycle note", "Updated API documentation"],
                    completionCriteria: ["Passwords use framework hashing.", "Expired or invalid access tokens are rejected.", "Authenticated users cannot modify another team's services without explicit authority.", "Same-team maintainers can perform allowed changes.", "Nested resource writes cannot bypass ownership checks.", "Refresh/logout behavior matches documentation.", "Negative tests prove the security boundary.", "Sensitive credentials are absent from logs."],
                },
            },
            {
                id: "identity-authentication-authorization-lab-secure-steward-api-check",
                title: "Security Defence",
                estimatedMinutes: 15,
                content: { type: "reflection", prompt: "1. Which authorization decision in your implementation depends on current database state rather than token claims?\n2. What happens if a user's Team Membership is removed while an access token is still valid?\n3. Which negative test gives you the strongest evidence that object-level authorization works?\n4. What security trade-off did you make in refresh-token handling, and what would make you revisit it?" },
            },
        ],
    },
];
