// Cloud Engineer module 5 access boundary additions in the ORIGINAL IAM/Secrets readings.
export type BuildingAccessSection={heading:string;paragraphs:string[]};
export const cloudBuildingAccessSections:Record<string,BuildingAccessSection[]> = {
  "iam": [
    {
      "heading": "Separate principal authentication from authorization and resource routing",
      "paragraphs": [
        "Identity and Access Management (IAM) answers which principal is entitled to perform a specified action on a specified resource in a specified context. Authentication establishes the principal; authorization evaluates policy. In a real cloud this decision may combine identity policy, resource-based policy, service-control constraints, explicit denies and session context. Merely creating a role named backup-admin does not prove that the backup process cannot delete other teams' objects or read credentials.",
        "For Steward, define distinct identities for the human operator, GitLab CI publisher, API runtime and backup writer. Each needs a narrow action/resource set, credential lifetime and change owner. A firewall decides whether packets reach a host; it does not decide which API user may delete a backup. Likewise a cryptographic TLS identity is not an authorization grant to every resource at that endpoint."
      ]
    },
    {
      "heading": "Execute a local explicit-deny and prefix-boundary decision model",
      "paragraphs": [
        "The runnable Python model below evaluates fictional Rule objects by principal, action and a resource prefix, then requires an explicit allow and gives a matching explicit deny precedence. It deliberately includes a legacy overly broad delete allow alongside a deny so the learner can observe why the deny wins; production remediation should remove the broad allow instead of relying on a compensating policy forever. The test also confirms that backups/steward-evil/ is not a member of backups/steward/ just because their strings begin with similar letters.",
        "Run the code using Python 3, no provider account or network. Observe IAM_PREFIX_BOUNDARY_STOPS_SIMILAR_NAME_ESCAPE, IAM_EXPLICIT_DENY_OVERRIDES_BROAD_ALLOW, IAM_SCOPED_ALLOW_AND_DEFAULT_DENY and IAM_POLICY_IS_SYNTHETIC_NOT_REAL_CLOUD_IDENTITY. In a disposable copy remove the deny, broaden the allowed prefix or change the default to allow; the independent source test must reject all three. This is a policy algebra fixture; it is not an AWS, Azure or Google IAM authorization check."
      ]
    },
    {
      "heading": "Test privilege from the consuming process, not just policy names",
      "paragraphs": [
        "A human may view the configured role policy in a provider console while the application is actually running under a different identity. An authorized integration test should examine the effective identity available to the real workload and prove both a necessary action and a deliberately forbidden action. It must also distinguish authorization denial from missing credentials, DNS failure, blocked network, expired session and a resource that does not exist.",
        "In real Steward, connect from scoped CI and runtime identities and attempt only permitted training resources. Record policy version, exact action, resource, identity, allowed response and denied response. Do not grant administrator permissions because a narrow role is misconfigured. If the provider identity or resource does not yet exist, mark live permission evaluation NOT_TESTED rather than claiming that the local Python model established cloud trust."
      ]
    }
  ],
  "secrets-management": [
    {
      "heading": "Name every secret's independent source, reader and lifetime",
      "paragraphs": [
        "A secret is a credential or private material whose disclosure enables an action: a database password, service token, signing key or DNS API token. Its lifecycle includes issuance, controlled storage, narrowly authorized retrieval, injection into a workload, refresh, revocation, audit and recovery. A container image or Git repository should not contain a secret, because image distribution and code review are different trust boundaries. Environment variables and mounted files also have exposure and refresh limitations, even when they are not committed.",
        "Separate workload identity from the secret the workload is requesting. A real secret manager may use short-lived identity tokens to grant retrieval rights, but the application must still refresh its connection pool after a credential change. A successful write of a new secret value does not prove the running process uses it. Evidence must include authorized retrieval, unauthorized denial, actual consuming process behavior, and an expiry or rotation outcome."
      ]
    },
    {
      "heading": "Execute a client-generation rotation state machine with a denied premature revoke",
      "paragraphs": [
        "The copyable Python fixture below models an old and new credential generation for two API replicas and one outbox publisher. It first confirms all three use the old generation, introduces the new credential while retaining the old one, switches only the first API replica, and checks that every process still connects. It then models prematurely revoking the old generation and requires that at least one old client fails. Only after all clients switch is the old generation revoked and its further use denied.",
        "The program uses made-up generation labels, no real passwords, database sessions or external IAM service. Expected markers are ROTATION_OLD_CLIENTS_START_HEALTHY, ROTATION_OVERLAP_PRESERVES_OLD_AND_NEW_CLIENTS, ROTATION_PREMATURE_REVOKE_PROVES_CLIENT_OUTAGE, ROTATION_OLD_REVOKED_AFTER_ALL_CLIENTS_MIGRATE and ROTATION_NO_REAL_PASSWORD_OR_SECRET_STORE_TEST. A test that leaves the old generation active after cutover or revokes it before clients migrate must fail visibly."
      ]
    },
    {
      "heading": "Know when overlap is impossible and recovery must be coordinated",
      "paragraphs": [
        "Not every credential system allows two generations to remain valid simultaneously. Some providers rotate a single key in place; some databases can introduce a second account; some token systems use independently expiring sessions. The migration plan must match real capabilities rather than assume seamless overlap. When overlap is impossible, schedule a coordinated restart, preannounce a possible connection interruption and retain a safe rollback or forward-repair procedure.",
        "On a learner-owned Steward installation, inspect actual API and worker connection refresh and one denied revoked-credential attempt without exposing plaintext. Record the rotation initiator, what changed, rollout completion, residual old sessions, cutover window and observed failures. If real Vault/Keycloak/secret-manager integration has not been earned, distinguish a local lifecycle model from a genuine managed-secret demonstration."
      ]
    }
  ]
};
export const cloudBuildingAccessPractices:Record<string,string[]> = {
  "iam": [
    "Run the exact local policy evaluation from this reading and preserve IAM_PREFIX_BOUNDARY_STOPS_SIMILAR_NAME_ESCAPE, IAM_EXPLICIT_DENY_OVERRIDES_BROAD_ALLOW and IAM_SCOPED_ALLOW_AND_DEFAULT_DENY. Remove a deny or broaden one prefix and show the test detects the unsafe access.",
    "Create a real access matrix for the Steward operator, CI publisher, API and backup writer; mark any live cloud-provider permission test NOT_TESTED until the actual scoped identity and disposable resource exist."
  ],
  "secrets-management": [
    "Execute the old/new credential-generation example, capture all ROTATION_* markers and explain why partial client rollout plus immediate revocation breaks the older API/worker identities.",
    "Specify what actual secret store, runtime reload, protected storage, expiry policy and revocation evidence would be required to graduate from this fictional state machine to a live Steward rotation. Avoid printing actual secret values."
  ]
};
