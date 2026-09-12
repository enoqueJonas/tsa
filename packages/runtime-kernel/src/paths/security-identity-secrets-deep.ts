import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const keycloakDocs: LearningResource = { title: "Keycloak Documentation", url: "https://www.keycloak.org/documentation" };
const oidcCore: LearningResource = { title: "OpenID Connect Core", url: "https://openid.net/specs/openid-connect-core-1_0.html" };
const vaultDocs: LearningResource = { title: "HashiCorp Vault Documentation", url: "https://developer.hashicorp.com/vault/docs" };
const k8sSecrets: LearningResource = { title: "Kubernetes Secrets", url: "https://kubernetes.io/docs/concepts/configuration/secret/" };

interface Spec {
    id: string;
    title: string;
    intro: string;
    sections: Array<{ heading: string; paragraphs: string[]; list?: string[] }>;
    practiceTitle: string;
    instructions: string[];
    deliverables: string[];
    criteria: string[];
    questions: string[];
    resources?: LearningResource[];
}

function lesson(spec: Spec): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: spec.intro }];
    for (const section of spec.sections) {
        blocks.push({ type: "heading", id: section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text: section.heading, level: 2 });
        section.paragraphs.forEach((text) => blocks.push({ type: "paragraph", text }));
        if (section.list) blocks.push({ type: "list", items: section.list });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Security boundary", body: "Keycloak authenticates identities and issues tokens; Kong enforces edge policy; Kubernetes/OpenShift controls platform access; Steward still owns domain authorization such as who may change service ownership. Do not collapse these responsibilities into one product." });
    blocks.push({ type: "resources", title: "Continue learning", resources: spec.resources ?? [keycloakDocs, oidcCore, vaultDocs, k8sSecrets] });
    return {
        id: `security-identity-secrets-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `security-identity-secrets-${spec.id}-001`, title: spec.title, estimatedMinutes: 45, content: { type: "reading", body: spec.intro, blocks } },
            { id: `security-identity-secrets-${spec.id}-002`, title: spec.practiceTitle, estimatedMinutes: 75, content: { type: "practical", objective: spec.practiceTitle, scenario: "Steward is now internet-accessible through Kong and runs on the enterprise application platform. Introduce identity and secret controls without weakening the domain model or creating shared administrator credentials.", instructions: spec.instructions, deliverables: spec.deliverables, completionCriteria: spec.criteria } },
            { id: `security-identity-secrets-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: spec.questions.join("\n\n"), minimumCharacters: 220 } },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "identity-boundaries", title: "Identity Planes and Trust Boundaries", intro: "An enterprise system has several identity planes: end users, operators, CI/CD automation, platform controllers and workloads. Reusing one credential across those planes destroys attribution and expands blast radius.",
        sections: [
            { heading: "Different actors need different identities", paragraphs: ["A Steward user proves who they are to an identity provider. Jenkins, Argo CD and OpenTofu need machine identities for their own control-plane actions. Pods may need workload identity to obtain secrets or call services. These are different trust problems."], list: ["Human user identity", "Platform/operator identity", "CI/CD automation identity", "GitOps controller identity", "Workload/service identity"] },
            { heading: "Authentication does not decide every business action", paragraphs: ["A valid token can establish identity and coarse claims. Whether a user may reassign a Steward service owned by another team remains a domain rule and should be evaluated by Steward with authoritative domain state."] },
        ],
        practiceTitle: "Identity Inventory: Separate Steward Humans, Automation and Workloads",
        instructions: ["Inventory every current identity used by Steward, Kong, Jenkins, Nexus, OpenTofu, Argo CD and cluster workloads.", "Record credential type, privilege, owner, storage location and rotation path.", "Identify shared or overprivileged identities and prioritize remediation.", "Mark which authorization decisions belong to infrastructure, platform, edge or Steward domain logic."],
        deliverables: ["Identity inventory", "Trust-boundary diagram", "Privilege remediation backlog"],
        criteria: ["Human and automation identities are separated.", "Domain authorization remains explicitly owned by Steward.", "Every credential has an accountable owner and lifecycle."],
        questions: ["Why is one administrator credential across CI, cluster and application unsafe?", "Why can authentication be centralized while domain authorization remains inside Steward?"]
    },
    {
        id: "oidc-oauth", title: "OAuth 2.0 and OpenID Connect Mental Model", intro: "OAuth 2.0 delegates authorization to protected resources; OpenID Connect adds an identity layer. Security depends on understanding issuer, client, redirect URI, scopes, audiences, token types and validation rather than treating JWT as synonymous with login.",
        sections: [
            { heading: "Tokens have different purposes", paragraphs: ["An ID token tells the client about authentication. An access token is presented to an API. Refresh tokens extend a session and deserve stronger handling. Sending the wrong token to the wrong recipient weakens the boundary even when signatures validate."] },
            { heading: "Validate context, not only signature", paragraphs: ["An API should validate issuer, audience, expiry and relevant claims. A cryptographically valid token issued for another client or audience should not automatically authorize Steward."] },
        ],
        practiceTitle: "Token Validation Drill: Prove Steward Rejects the Wrong Context",
        instructions: ["Document the intended Steward issuer, audience, client and scopes/claims.", "Capture one valid token flow without exposing secret values in evidence.", "Verify a valid access token succeeds for an allowed request.", "Test safe negative cases such as expired token, wrong audience or missing required claim.", "Record which layer rejects each failure."],
        deliverables: ["OIDC flow diagram", "Token validation matrix", "Negative-path evidence"],
        criteria: ["ID and access tokens are not conflated.", "Validation includes issuer/audience/expiry context.", "Evidence redacts credentials and tokens."],
        questions: ["Why can a correctly signed JWT still be invalid for Steward?", "What is the difference between an ID token and an access token?"]
    },
    {
        id: "keycloak", title: "Keycloak Realms, Clients, Users and Roles", intro: "Keycloak is TSA's implemented identity provider. It centralizes login, token issuance and identity administration while Steward consumes identity claims through standard protocols.",
        sections: [
            { heading: "Model identity deliberately", paragraphs: ["A realm is an isolation boundary for identity configuration. Clients represent applications or services. Roles and groups can express coarse identity attributes, but they should not duplicate rapidly changing Steward ownership data."] },
            { heading: "Keep admin separate from application traffic", paragraphs: ["Keycloak's administrative console and management endpoints belong on the private operator path. Public authentication endpoints may be reachable as required by the login flow without making admin surfaces public."] },
        ],
        practiceTitle: "Keycloak Integration: Make It Steward's Identity Provider",
        instructions: ["Deploy or connect a learner-managed Keycloak environment on the private platform boundary.", "Create a Steward realm/client configuration appropriate to the application flow.", "Create representative users/groups/roles without encoding Steward's full domain authorization model in Keycloak.", "Configure Steward to validate Keycloak-issued access tokens.", "Verify login/token acquisition and one authorized API request through Kong.", "Prove a Keycloak administrative endpoint is not part of the public user path."],
        deliverables: ["Keycloak realm/client configuration evidence", "Steward OIDC configuration", "End-to-end authentication evidence", "Admin exposure proof"],
        criteria: ["Keycloak is the authoritative authentication provider.", "The public login/API path and private admin path are distinct.", "Steward domain permissions are not outsourced wholesale to realm roles."],
        questions: ["What should Keycloak own for Steward, and what should it not own?", "Why should Keycloak administration remain on a private management path?"]
    },
    {
        id: "service-identity", title: "Machine and Workload Identity", intro: "Automation and workloads need identities that can be rotated, scoped and attributed independently of human accounts. Service accounts and client credentials are safer than copying a developer token into pipelines or pods.",
        sections: [
            { heading: "Scope by job", paragraphs: ["Jenkins may publish to Nexus but should not be cluster administrator. Argo CD may reconcile selected namespaces but should not own cloud billing. Steward workloads may read a secret but should not administer the secret platform."] },
            { heading: "Shorter-lived credentials reduce exposure", paragraphs: ["Where supported, workload identity or dynamically issued credentials reduce dependence on long-lived static secrets. The capability is valuable because it changes revocation and rotation from file replacement into identity policy."] },
        ],
        practiceTitle: "Least-Privilege Drill: Replace One Shared Machine Credential",
        instructions: ["Choose one current automation or workload credential with excessive scope or lifetime.", "Define the minimal API/resource actions required by that actor.", "Create or design a dedicated machine/workload identity.", "Prove one required action succeeds and one unrelated action is denied.", "Document rotation/revocation behavior."],
        deliverables: ["Machine-identity policy", "Allowed/denied evidence", "Rotation/revocation note"],
        criteria: ["The identity is not a human account reused by automation.", "Least privilege is proven with a denied action.", "Revocation does not require rotating unrelated actors."],
        questions: ["What operational problem does a dedicated service identity solve beyond password strength?", "Why is permission denial evidence useful during least-privilege design?"]
    },
    {
        id: "secret-lifecycle", title: "Secret Lifecycle: Create, Distribute, Rotate, Revoke", intro: "A secret is secure only when its entire lifecycle is controlled. Storage encryption does not solve accidental logging, broad distribution, indefinite lifetime, missing ownership or inability to rotate without outage.",
        sections: [
            { heading: "Lifecycle beats location", paragraphs: ["Ask who creates the credential, who can read it, how workloads receive it, where copies persist, how use is audited, how rotation is coordinated and how revocation is verified."] },
            { heading: "Kubernetes Secret is one transport/storage mechanism", paragraphs: ["Kubernetes Secret separates secret values from images and ConfigMaps, but RBAC, etcd protection and delivery paths still matter. Mature designs may integrate an external secret manager or dynamic credential source."] },
        ],
        practiceTitle: "Secret Trace: Follow One Steward Credential End to End",
        instructions: ["Choose one non-production learner credential such as database password or OIDC client secret.", "Trace generation, storage, CI access, cluster delivery, process consumption, logging risk and revocation.", "Rotate it through the intended process without committing it to Git or rebuilding the image.", "Verify the old value no longer works and the application remains healthy."],
        deliverables: ["Secret lifecycle diagram", "Rotation evidence", "Old-secret revocation evidence"],
        criteria: ["No live secret appears in source, image or ordinary logs.", "Rotation is demonstrated rather than merely documented.", "The old credential is proven unusable after revocation."],
        questions: ["Why is encrypted storage not a complete secret-management solution?", "What proves a secret rotation is complete?"]
    },
    {
        id: "vault", title: "Vault Concepts and Dynamic Secrets", intro: "Vault represents a dedicated secrets-management pattern: authenticated clients request narrowly scoped secret material, policy controls access, leases bound lifetime, and supported engines can create dynamic credentials. TSA treats these as concepts unless the environment has a real need to justify operating Vault itself.",
        sections: [
            { heading: "Static versus dynamic credentials", paragraphs: ["A static database password exists until someone changes it. A dynamic credential can be generated for a specific requester with a lease and revoked automatically. The security benefit is paired with a new highly sensitive control plane that must itself be operated reliably."] },
            { heading: "Do not install a security product without a problem", paragraphs: ["If the learner environment has only a few low-risk credentials, disciplined provider/Kubernetes secret handling may be proportionate. Vault becomes justified when centralized policy, dynamic credentials, auditability or multi-system secret lifecycle solves a real requirement."] },
        ],
        practiceTitle: "Vault Adoption Decision: Prototype the Capability, Defend the Cost",
        instructions: ["Model how Steward would authenticate to Vault without embedding a reusable root token.", "Choose one candidate dynamic-secret use case such as database credentials.", "Prototype it in an isolated learner-owned environment when practical, or document the exact lease/revocation workflow.", "Compare Vault with the current secret mechanism on rotation, audit, availability and operational burden.", "Make an adopt/defer decision with a revisit trigger."],
        deliverables: ["Vault trust-flow diagram", "Dynamic-secret experiment or executable design", "Adopt/defer ADR"],
        criteria: ["Vault root/admin credentials are not proposed for application use.", "The benefit is tied to a concrete lifecycle problem.", "Operational cost and availability dependency are explicitly considered."],
        questions: ["What security property do dynamic secrets add over a static password?", "Why can operating Vault increase risk if the organization does not need or understand it?"]
    },
    {
        id: "gateway-identity", title: "Kong, Identity and API Policy", intro: "Kong sits at the public API edge and can enforce transport, rate, authentication-adjacent and routing policies. Edge policy can reduce unwanted traffic, but it must not become a second inconsistent implementation of Steward's business authorization rules.",
        sections: [
            { heading: "Defense in depth needs clear ownership", paragraphs: ["Kong can reject malformed or unauthenticated traffic early. Steward should still validate the identity context it trusts and enforce domain rules. The two layers should fail closed without duplicating ownership logic."] },
            { heading: "Rate limits are security and reliability controls", paragraphs: ["Rate limiting can reduce brute-force or abuse pressure but can also block legitimate clients if configured without traffic evidence. Policies require ownership and observability."] },
        ],
        practiceTitle: "Edge Policy Drill: Reject Bad Requests Without Moving Domain Rules to Kong",
        instructions: ["Inventory current Kong routes/plugins relevant to Steward.", "Implement or design one proportionate edge control such as authentication validation or rate limiting.", "Prove unauthenticated/malformed traffic is rejected before reaching Steward where appropriate.", "Prove an authenticated but domain-forbidden action is still rejected by Steward itself.", "Record bypass/failure assumptions between Kong and the backend."],
        deliverables: ["Gateway policy configuration", "Edge rejection evidence", "Domain-authorization rejection evidence", "Boundary note"],
        criteria: ["Kong and Steward responsibilities are distinct.", "The backend is not directly exposed as an easy bypass path.", "The learner can explain the consequence of trusting spoofable forwarded identity headers."],
        questions: ["Which controls belong naturally at Kong and which belong in Steward?", "Why must direct backend reachability be considered when the gateway enforces security policy?"]
    },
    {
        id: "identity-secrets-review", title: "Identity and Secrets Security Review", intro: "Security controls are credible when another engineer can trace identities, privileges, token validation, secret lifecycles and bypass boundaries from evidence rather than from architecture claims.",
        sections: [
            { heading: "Review the system, not the product list", paragraphs: ["A secure-looking diagram with Keycloak, Kong, Kubernetes and Vault can still rely on shared admin accounts, permanent credentials or unvalidated token audiences. Review the actual trust paths and failure modes."] },
            { heading: "Hand forward measurable risks", paragraphs: ["Reliability will later operate identity and secret dependencies as production services. Record expiry, availability, rotation and audit requirements now so those risks remain visible."] },
        ],
        practiceTitle: "Security Review: Prove the Steward Identity and Secret Chain",
        instructions: ["Trace one end-user request from Keycloak authentication through Kong to Steward domain authorization.", "Trace one machine identity used by delivery or GitOps and show its least-privilege boundary.", "Trace one runtime secret through storage, delivery, consumption and rotation.", "Test one safe token failure, one permission denial and one secret rotation/revocation path.", "Record residual risks and assign future Reliability/Technical Steward ownership where appropriate."],
        deliverables: ["Identity and secret evidence pack", "Negative-path results", "Residual-risk register"],
        criteria: ["End-user, automation and workload trust paths are independently explainable.", "At least three failure/denial paths have evidence.", "Residual risks are explicit rather than hidden behind product defaults."],
        questions: ["What evidence would convince a reviewer that Steward's identity architecture fails closed?", "Which identity or secret risks become reliability concerns once the platform is in production?"]
    },
];

const lab: Lesson = {
    id: "security-identity-secrets-lab",
    title: "Lab: Integrate Keycloak and Harden Steward Identity",
    activities: [
        { id: "security-identity-secrets-lab-001", title: "Integrate End-user Identity", estimatedMinutes: 120, content: { type: "practical", objective: "Make Keycloak the Steward authentication provider without moving domain authorization out of Steward.", scenario: "Use the existing Kong/OpenShift public path and learner-owned environment.", instructions: ["Configure the Keycloak realm/client and public authentication flow.", "Configure Steward token validation for issuer/audience/expiry and required claims.", "Verify one allowed request and safe negative cases for missing/invalid identity context.", "Verify an authenticated user still cannot perform a forbidden cross-team domain action."], deliverables: ["Keycloak configuration evidence", "Token-validation evidence", "Domain-authorization evidence"], completionCriteria: ["Authentication and domain authorization are distinct.", "Negative token paths fail closed.", "Administrative Keycloak access is not exposed as a public user service."] } },
        { id: "security-identity-secrets-lab-002", title: "Harden Machine and Secret Lifecycles", estimatedMinutes: 120, content: { type: "practical", objective: "Reduce shared credentials and prove one runtime secret can rotate safely.", scenario: "Use non-production learner credentials only; do not expose real organization secrets in screenshots, Git or logs.", instructions: ["Replace or redesign one shared automation credential with a dedicated identity.", "Apply least privilege and prove an unrelated action is denied.", "Rotate one runtime secret through the intended platform mechanism.", "Verify old-secret revocation and application recovery.", "Complete the Vault adopt/defer decision based on actual lifecycle needs."], deliverables: ["Least-privilege identity evidence", "Secret rotation/revocation evidence", "Vault decision"], completionCriteria: ["No shared human credential remains in the selected automation path.", "Rotation and revocation are proven.", "Vault is neither mandatory nor dismissed without architectural reasoning."] } },
        { id: "security-identity-secrets-lab-003", title: "Identity Security Review", estimatedMinutes: 45, content: { type: "reflection", prompt: "Defend the final Steward identity design. Explain exactly what Keycloak, Kong, OpenShift/Kubernetes, Argo CD/Jenkins machine identities and Steward domain authorization each own. Then trace one user token and one runtime secret through their complete lifecycle, including expiration/rotation/revocation. Identify the most dangerous bypass or shared-trust assumption still present and the evidence that would detect it.", minimumCharacters: 350 } },
    ],
};

export const securityIdentitySecretsDeepLessons: Lesson[] = [...specs.map(lesson), lab];
