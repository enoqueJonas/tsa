import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const keycloakDocs: LearningResource = { title: "Keycloak Server Administration", url: "https://www.keycloak.org/docs/latest/server_admin/" };
const openLdapDocs: LearningResource = { title: "OpenLDAP Administrator's Guide", url: "https://www.openldap.org/doc/admin26/" };
const ldapRfc: LearningResource = { title: "RFC 4511 — LDAP", url: "https://www.rfc-editor.org/rfc/rfc4511" };

interface Spec {
    id: string;
    title: string;
    intro: string;
    practiceTitle: string;
    scenario: string;
    instructions: string[];
    deliverables: string[];
    criteria: string[];
    questions: string[];
}

function lesson(spec: Spec): Lesson {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: spec.intro },
        { type: "callout", tone: "steward", title: "Identity ownership boundary", body: "LDAP is the workforce identity source, Keycloak is the authentication/federation boundary, and Steward still owns domain authorization such as service ownership and governance permissions. Do not collapse these responsibilities." },
        { type: "resources", title: "Continue learning", resources: [keycloakDocs, openLdapDocs, ldapRfc] },
    ];

    return {
        id: `security-directory-federation-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `security-directory-federation-${spec.id}-001`, title: spec.title, estimatedMinutes: 45, content: { type: "reading", body: spec.intro, blocks } },
            { id: `security-directory-federation-${spec.id}-002`, title: spec.practiceTitle, estimatedMinutes: 150, content: { type: "practical", objective: spec.practiceTitle, scenario: spec.scenario, instructions: spec.instructions, deliverables: spec.deliverables, completionCriteria: spec.criteria } },
            { id: `security-directory-federation-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: spec.questions.join("\n\n"), minimumCharacters: 220 } },
        ],
    };
}

const specs: Spec[] = [
    {
        id: "federation-model",
        title: "Directory Federation Architecture",
        intro: "Enterprise SSO often sits between an authoritative workforce directory and applications. Federation avoids creating separate credentials in every application while preserving a protocol boundary between directory administration and application authentication.",
        practiceTitle: "Model LDAP -> Keycloak -> Steward",
        scenario: "Steward has local application identities today, but the organization already maintains employees and engineering groups in the homelab LDAP directory. Replace duplicate workforce credential ownership without coupling Steward directly to LDAP.",
        instructions: [
            "Inventory which identity attributes are authoritative in LDAP, which authentication/session concerns belong to Keycloak, and which authorization facts remain authoritative in Steward.",
            "Draw the authentication path from a user entry in LDAP through Keycloak to an OIDC access token consumed by Steward.",
            "Define the expected behavior for users that exist in LDAP but have no valid Steward membership or domain permission.",
            "Define which LDAP groups, if any, are useful as coarse identity claims and explicitly reject mappings that would duplicate Steward's service/team ownership model.",
            "Document the sync/federation mode and the expected freshness trade-off for user disablement and group changes.",
        ],
        deliverables: ["Identity authority matrix", "LDAP-Keycloak-Steward sequence diagram", "Group/claim mapping decision", "Freshness and disablement assumptions"],
        criteria: ["Steward is not designed to authenticate directly against LDAP.", "Keycloak does not become authoritative for Steward domain ownership.", "The source of truth for each identity/authorization fact is explicit.", "Lifecycle/freshness behavior is documented."],
        questions: ["Why can centralized authentication coexist with application-owned authorization?", "What risk appears if LDAP groups are used to mirror every Steward business permission?"],
    },
    {
        id: "keycloak-ldap",
        title: "Keycloak LDAP Federation",
        intro: "Keycloak can federate users from LDAP through a configured user-storage provider. Correct federation depends on base DN, bind identity, search scope, username/UUID attributes, group mappings, edit mode and transport trust.",
        practiceTitle: "Federate the Homelab LDAP Directory into Keycloak",
        scenario: "Use the real LDAP service created in Platform Builder as Keycloak's workforce identity source. The goal is a functioning enterprise identity chain, not a mock directory or hard-coded user import.",
        instructions: [
            "Configure a Keycloak LDAP user-federation provider against the homelab directory using the least-privilege bind account created earlier.",
            "Set the users/base DN, username attribute, unique identifier attribute, object classes/search behavior and edit mode deliberately; record why each value matches the directory schema.",
            "Configure TLS trust so Keycloak does not fall back to insecure directory access.",
            "Federate at least three synthetic users and two groups and prove their identities are visible through Keycloak without creating duplicate local passwords for those users.",
            "Map one justified LDAP group or attribute into a Keycloak claim/role used for coarse application context, while keeping a domain-level forbidden action inside Steward.",
            "Capture evidence of a successful federated login and token issuance without exposing passwords or tokens.",
        ],
        deliverables: ["Keycloak LDAP provider configuration evidence", "TLS/trust configuration evidence", "Federated users/groups proof", "Claim mapping", "Successful OIDC login/token evidence"],
        criteria: ["Keycloak queries the real homelab LDAP service.", "The federation bind identity is not the LDAP administrator.", "Directory traffic is protected and trusted.", "At least one LDAP-originated identity can authenticate through Keycloak.", "Steward domain authorization remains independent of LDAP group membership."],
        questions: ["Why should federation use a read-scoped bind account instead of the LDAP administrator?", "What does Keycloak add between LDAP and Steward beyond simply copying users?"],
    },
    {
        id: "lifecycle-failures",
        title: "Federated Identity Lifecycle and Failure Modes",
        intro: "A working login proves little about directory lifecycle behavior. Real enterprise integrations must handle disabled users, group changes, directory outages, bad bind credentials and certificate/trust failures without creating silent authorization gaps.",
        practiceTitle: "Break and Recover the Federated Identity Chain",
        scenario: "The LDAP-Keycloak-Steward chain is now in use. Introduce controlled identity and dependency failures and determine what existing sessions, new logins and Steward authorization should do.",
        instructions: [
            "Disable one synthetic LDAP user and measure what happens to new authentication attempts and any already-issued Keycloak/Steward session or access token according to the configured lifecycle.",
            "Remove or change one LDAP group membership and observe when the corresponding Keycloak claim/context changes.",
            "Rotate the LDAP federation bind-account credential and update Keycloak through the intended secret-management path; prove the old credential no longer works.",
            "Stop or isolate LDAP, then test a new login and an already-authenticated Steward request. Record which capability degrades and which can continue temporarily.",
            "Break the LDAP TLS trust chain safely and diagnose the resulting Keycloak federation failure from logs/evidence.",
            "Restore every failure and verify authentication plus one Steward-authorized and one Steward-forbidden action.",
        ],
        deliverables: ["User-disablement/session behavior record", "Group-change freshness evidence", "Bind credential rotation/revocation evidence", "LDAP outage investigation", "TLS trust failure investigation", "Recovery verification"],
        criteria: ["User disablement behavior is demonstrated rather than assumed.", "Group/claim freshness is measured.", "The old bind credential is proven unusable after rotation.", "LDAP unavailability and certificate/trust failure are distinguishable.", "Steward still enforces a domain-forbidden action after successful federation."],
        questions: ["Why might disabling an LDAP account not instantly invalidate an already-issued access token?", "What should continue working during a short LDAP outage, and what should fail closed?"],
    },
    {
        id: "active-directory-context",
        title: "Active Directory, LDAP and Kerberos Context",
        intro: "Active Directory is more than an LDAP server. It combines directory, Kerberos authentication, DNS-dependent domain services, users/groups, organizational units and policy/administrative capabilities. TSA studies the integration architecture without expanding into a full Windows Server administration track.",
        practiceTitle: "Map the Homelab LDAP Design to an Active Directory Enterprise",
        scenario: "A future organization may replace the simple OpenLDAP-style workforce directory with Microsoft Active Directory. Explain what changes in the identity infrastructure and what should remain stable for Keycloak and Steward.",
        instructions: [
            "Map homelab LDAP concepts to Active Directory equivalents: directory entries/users, groups, organizational units, domain controller and directory naming context.",
            "Explain Kerberos at a high level and why an AD environment is not accurately described as 'just LDAP'.",
            "Explain why AD depends strongly on DNS and what kinds of integration failures incorrect DNS/time/trust can create.",
            "Identify which Keycloak federation configuration areas would need reassessment against AD schema/group behavior while keeping Steward's OIDC contract stable.",
            "Write a short boundary note stating what TSA intentionally does not cover: full domain administration, Group Policy operations, Windows fleet administration and advanced AD topology.",
        ],
        deliverables: ["LDAP-to-AD concept map", "Kerberos/DNS dependency note", "Keycloak federation portability analysis", "Explicit out-of-scope boundary"],
        criteria: ["Active Directory is not reduced to a generic LDAP database.", "The learner can explain domain controller, LDAP, Kerberos and DNS relationships at an integration level.", "Steward remains insulated from the directory implementation by Keycloak/OIDC.", "The exercise stays within enterprise identity integration scope rather than becoming a Windows Server course."],
        questions: ["Why is Active Directory not simply an LDAP product?", "What architectural benefit does Keycloak provide if the underlying directory later changes from OpenLDAP to Active Directory?"],
    },
];

export const enterpriseDirectoryFederationDeepLessons: Lesson[] = specs.map(lesson);
