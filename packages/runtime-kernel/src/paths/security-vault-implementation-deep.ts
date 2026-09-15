import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const vaultDocs: LearningResource = { title: "HashiCorp Vault Documentation", url: "https://developer.hashicorp.com/vault/docs" };
const databaseEngine: LearningResource = { title: "Vault Database Secrets Engine", url: "https://developer.hashicorp.com/vault/docs/secrets/databases" };
const authDocs: LearningResource = { title: "Vault Auth Methods", url: "https://developer.hashicorp.com/vault/docs/auth" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "Steward has accumulated enough machine identities, database access and platform automation that manually rotating long-lived credentials is now a measurable security and operations burden. TSA therefore moves Vault from an optional design exercise to a mandatory learner-owned implementation." },
    { type: "heading", id: "vault-boundary", text: "Vault is a sensitive control plane", level: 2 },
    { type: "list", items: [
        "Applications never use the Vault root token for runtime access.",
        "Authentication proves the workload identity; Vault policy decides which secret paths/roles that identity may use.",
        "Dynamic credentials are leased and revocable; the application must tolerate credential renewal/replacement.",
        "Vault availability, audit, unseal/recovery and backup responsibilities become part of operating the platform."
    ] },
    { type: "callout", tone: "steward", title: "Scenario-forced implementation", body: "The learning objective is not to install Vault because enterprises use it. Steward now has a concrete database-credential lifecycle problem that dynamic credentials solve. Architect may later retain, simplify or replace the platform after evaluating its operational cost." },
    { type: "resources", title: "Continue learning", resources: [vaultDocs, databaseEngine, authDocs] },
];

export const vaultImplementationDeepLessons: Lesson[] = [
    {
        id: "security-vault-implementation",
        title: "Vault and Dynamic Secrets for Steward",
        activities: [
            { id: "security-vault-implementation-001", title: "From Static Secrets to Leased Credentials", estimatedMinutes: 45, content: { type: "reading", body: "Implement a dedicated secrets platform only after the lifecycle pressure is explicit.", blocks } },
            {
                id: "security-vault-implementation-002",
                title: "Deploy and Initialize Vault Safely",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Operate a learner-owned Vault control plane without normalizing root-token application access.", scenario: "Steward needs centralized policy and auditable secret issuance. Deploy Vault as a security-sensitive platform component with an explicit recovery boundary.", instructions: [
                    "Deploy Vault in the learner-owned homelab/platform using persistent storage and TLS appropriate to the environment; development mode does not satisfy the final exercise.",
                    "Initialize the instance and handle recovery/unseal material according to a documented learner-safe procedure. Never commit root, recovery or unseal material to Git or ordinary evidence.",
                    "Use the root token only for bounded bootstrap/administrative setup, then create non-root operator and workload paths.",
                    "Enable an audit device and prove administrative/runtime operations produce audit evidence without publishing secret values.",
                    "Create a least-privilege policy for the Steward workload and prove an unrelated secret/administrative action is denied.",
                    "Document persistence, backup/recovery, certificate and availability responsibilities introduced by Vault."
                ], deliverables: ["Vault topology", "Initialization/recovery procedure", "Non-root policy configuration", "Audit evidence", "Allowed/denied policy proof", "Operational responsibility note"], completionCriteria: ["Vault runs with persistent state outside development mode.", "Root/unseal/recovery material is absent from source and ordinary evidence.", "A non-root identity performs the required runtime operation.", "Least privilege is proven with a denied action.", "Vault audit evidence is enabled and understood."] },
            },
            {
                id: "security-vault-implementation-003",
                title: "Issue Dynamic PostgreSQL Credentials",
                estimatedMinutes: 240,
                content: { type: "practical", objective: "Replace one Steward static database credential path with leased Vault-issued PostgreSQL credentials.", scenario: "A long-lived Steward database password is copied through deployment configuration and requires coordinated manual rotation. The organization requires shorter-lived credentials, centralized policy and revocation evidence.", instructions: [
                    "Configure the Vault database secrets engine against the learner PostgreSQL environment using a bounded administrative credential appropriate for credential creation/revocation.",
                    "Define a database role that creates only the privileges Steward needs; do not issue database-superuser credentials to the application.",
                    "Configure a workload authentication method appropriate to the current Steward runtime. The application must not authenticate to Vault using the root token.",
                    "Obtain a dynamic database credential, inspect its lease metadata without exposing the password, and prove Steward can perform its required database operation.",
                    "Prove the generated database identity cannot perform at least one unrelated privileged action.",
                    "Renew or replace the lease through the intended lifecycle and verify the application continues operating.",
                    "Revoke the lease and prove the revoked database credential no longer authenticates while a newly issued credential restores the intended path.",
                    "Capture Vault audit and PostgreSQL-side evidence sufficient to correlate issuance/use/revocation without storing live secret values."
                ], deliverables: ["Database secrets-engine configuration", "Dynamic-role policy", "Workload authentication evidence", "Lease lifecycle evidence", "Database least-privilege proof", "Revocation/reissue evidence", "Audit correlation record"], completionCriteria: ["Steward uses a real Vault-issued PostgreSQL credential.", "The credential is leased/dynamic rather than a static value merely stored in Vault KV.", "Application database privilege is intentionally bounded.", "Lease renewal/replacement and revocation are demonstrated.", "The revoked credential is proven unusable.", "No live generated password appears in committed evidence." ] },
            },
            {
                id: "security-vault-implementation-004",
                title: "Break Vault and Rotate Trust",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Understand how a secrets control-plane failure affects an already-running and a newly-starting Steward workload.", scenario: "Vault becomes unavailable or a workload identity is revoked. Existing database sessions and leases may behave differently from new credential requests, so the failure boundary must be measured rather than assumed.", instructions: [
                    "Capture the healthy state: Vault authentication, credential issuance, lease duration and Steward database connectivity.",
                    "Stop or isolate Vault while Steward has a valid leased credential. Observe existing operation and separately test a path that requires a new/renewed secret.",
                    "Ensure failure to obtain a new credential is explicit and does not cause fallback to a hard-coded or overprivileged emergency password.",
                    "Restore Vault and prove credential issuance/renewal recovers.",
                    "Revoke or rotate the Steward Vault authentication identity/credential and prove the old identity can no longer obtain secrets.",
                    "Restore access with the replacement identity and record the operational steps/runbook needed for controlled rotation.",
                    "Define monitoring/alerting for Vault availability, authentication failures, lease problems and capacity/health appropriate to the deployment."
                ], deliverables: ["Vault outage experiment", "Existing-vs-new-secret behavior evidence", "No-fallback proof", "Workload identity rotation/revocation evidence", "Recovery runbook", "Vault monitoring requirements"], completionCriteria: ["Vault unavailability is reproduced safely.", "The learner distinguishes already-issued credential behavior from new secret acquisition.", "Steward does not silently fall back to an unmanaged permanent credential.", "The workload's Vault identity is rotated/revoked and the old identity is proven unusable.", "Recovery is demonstrated and operating signals are defined." ] },
            },
            { id: "security-vault-implementation-005", title: "Reassess the Secrets Platform", estimatedMinutes: 20, content: { type: "reflection", prompt: "Defend Vault's current place in Steward. Explain what dynamic PostgreSQL credentials solve, how workload authentication and policy avoid root-token use, what happens when Vault is unavailable, which recovery responsibilities Vault adds, and what evidence would justify retaining, simplifying, migrating or removing the platform during Architect/Technical Steward.", minimumCharacters: 350 } },
        ],
    },
];
