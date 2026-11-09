// Module 7 original-topic overlays. Preserve all 16 canonical IDs and existing practices.
export type CloudIacMechanismSection={heading:string;paragraphs:string[]};
export const cloudIacMechanismSections:Record<string,CloudIacMechanismSection[]> = {
  "plan-apply-lifecycle": [
    {
      "heading": "A saved plan is an executable proposal for a particular state serial",
      "paragraphs": [
        "OpenTofu evaluates configuration, variables, state and the provider's reported reality during planning, then records proposed actions in a saved plan file. The resulting file is not merely a human-readable text diff; it can contain sensitive values and is tied to a state snapshot. A later writer can make that plan stale. A current plan that proposes replacing a stateful database or public IP should be considered a blocked change until its side effects, recovery and user traffic impact have been explicitly reviewed.",
        "Start with a providerless terraform_data resource whose only effect is changing local state. Run real init, validate, plan -out, tofu show -json, apply the approved file and verify the computed output. Then create two saved updates from the same state serial, apply one and attempt the other: the second must fail as stale rather than silently overwriting the newer value. This does not establish that a real cloud provider runs the same conflict protocol or that CI automatically approved the correct version."
      ]
    },
    {
      "heading": "Classify the actual plan actions before approval",
      "paragraphs": [
        "An unchanged plan should report no-op; an input change to terraform_data can be updated in place; changing its triggers_replace value forces destroy-and-create. OpenTofu exposes these operations in machine-readable plan JSON under resource_changes[].change.actions. The same structure is useful for rejecting a cloud database replacement, but a real approval policy must also inspect resource address, sensitivity, dependencies, protection settings, migration risk and which identity requested the change.",
        "The executable learner program below permits only a reversible update to one named training resource and rejects the planned replacement. Test the unsafe variant that returns true for all action sets: it should fail the assertion requiring replacement denial. Neither plan review nor no-diff state means the deployed Steward API is healthy; after authorized apply, independently test public HTTPS, authorization, queues and persistence on the real deployment."
      ]
    },
    {
      "heading": "Run exact local CLI operations without touching provider resources",
      "paragraphs": [
        "Use the Python program below with a trusted OpenTofu binary named tofu in PATH. It creates a temporary directory containing only terraform_data and local backend state, formats and validates the HCL, applies a saved creation plan, asserts convergence, approves an update, rejects a replacement, refuses a stale saved plan, simulates missing state and safely restores it, then destroys only the disposable local fixture. It never configures a cloud provider or imports a real VPS.",
        "Expected markers begin IAC_REAL_PROVIDERLESS_SAVED_PLAN_APPLIED and end IAC_REAL_DISPOSABLE_STATE_DESTROYED, with separate replacement, stale-plan and missing-state markers. A negative test is valuable only if it fails for the intended safety condition rather than because OpenTofu is missing or a provider network call failed. Run the exact published source and its mutated variants through a dedicated CI job so a prose-only illustration cannot accidentally be accepted as verified CLI behavior."
      ]
    }
  ],
  "state": [
    {
      "heading": "State is an address-to-reality binding, not a backup or source of truth for the application",
      "paragraphs": [
        "Configuration describes intended managed objects, while state records the last known provider object identity and attributes associated with an address such as terraform_data.release. Losing that binding does not delete the actual remote resource: it makes OpenTofu unable to associate it with the declaration. Against a real provider this can prompt unintended duplicate creation, replacement or import work, so state must be access-controlled, backed up, encrypted appropriately and protected against concurrent writers.",
        "The disposable CLI lab hides its local terraform.tfstate after creating a resource, runs a plan and observes a create operation, then restores the original state before any apply. This proves a missing local state file changes what OpenTofu proposes for terraform_data. It does not create a second VPS or prove a real provider reacts identically, since the built-in resource has no external object."
      ]
    },
    {
      "heading": "Differentiate state snapshot, plan artifact and remote backup",
      "paragraphs": [
        "A state file may contain sensitive provider attributes even when output is marked sensitive; a saved plan can also contain secret values. Storing either in an ordinary public repository, build artifact or pastebin can disclose credentials. The remote backend may implement locking, versioning and encryption, but its actual properties are backend-specific. An S3 bucket used for remote state does not automatically guarantee state locking or immutable version recovery without the relevant configuration and tests.",
        "For a real Steward environment identify the backend, state key/workspace, encryption/key ownership, version history, locking method, backup/restore procedure and the identity allowed to mutate state. Show a recovery from a copy of a disposable state, not by deleting the production state to demonstrate a lesson. Label remote locking, object retention and provider drift NOT_TESTED when only the local terraform_data fixture has run."
      ]
    }
  ],
  "state-locking-concurrency": [
    {
      "heading": "Explain the distinction between optimistic plan freshness and exclusive backend writes",
      "paragraphs": [
        "A saved plan can be rejected because state changed after it was created, which is an optimistic consistency check. A backend lock instead coordinates concurrent state writers so they cannot both apply changes to the same state at once. These mechanisms protect different windows: two valid plans can each be generated while no lock is held, while only one apply may be allowed to write; after one succeeds, the other saved plan must be reviewed again.",
        "The providerless lab demonstrates stale-plan rejection, NOT a real multi-client remote lock. To validate shared state, configure an actual backend with documented locking support and run two authorized clients against one disposable state while deliberately keeping the first operation active. Capture which request is blocked or times out, verify lock release, and show the second writer cannot silently apply its stale proposal."
      ]
    },
    {
      "heading": "Treat force-unlock as emergency recovery, not a concurrency fix",
      "paragraphs": [
        "When an apply process is interrupted, a lease or lock record can remain until the backend or operator resolves it. Force-unlock can allow another writer to proceed even if the original process is still modifying external infrastructure, risking state corruption. First establish the holder, time, backend version and provider operations actually in progress; only an authorized owner may decide that a lock is abandoned.",
        "A safe training plan names an explicit second operator and a reversible disposable environment, not a live shared Steward state. Do not run force-unlock on production just to obtain a screenshot. Source-review a failure timeline, including what would trigger a stop and the audit trail for an emergency unlock."
      ]
    }
  ],
  "replacement-partial-apply-recovery": [
    {
      "heading": "A plan can contain irreversible real-world consequences outside state",
      "paragraphs": [
        "Replacement is a logical action that may delete an old resource then create a new one, or create first then delete, depending on lifecycle and provider capabilities. Neither ordering guarantees zero downtime or data retention. A virtual machine replacement can change public IP, DNS, TLS certificate installation, attached volume availability and running queues. A database replacement can require separately controlled migration and recovery. The plan's action array may show delete/create, but that is not a complete business-impact analysis.",
        "In the actual local program, changing terraform_data.triggers_replace produces a real plan with a delete action, and the lesson's guard refuses to apply it. The resource is a harmless state value, but it teaches how to inspect the proposed operation before a real cloud VM or storage object is affected. The exercise must not apply a destructive plan to real infrastructure simply because the classroom fixture safely deletes a local object."
      ]
    },
    {
      "heading": "Recover partial apply through observed facts, not assumed rollback",
      "paragraphs": [
        "An IaC apply is not a distributed transaction. A provider may create one network rule and fail on a later resource, leaving remote reality partly changed. Re-running the same plan without refreshing and understanding the observed state can duplicate effects or overwrite an emergency repair. OpenTofu state may record some completed operations, so the correct response is to inspect operation logs, current state, provider inventory and service behavior before planning a forward fix.",
        "Define a disposable failure rehearsal that records which resources were created before the failed step, whether the state reflects them, and which repairs preserve user traffic. Distinguish reverting configuration, state restore, resource import and actual data recovery. The local terraform_data example is deliberately narrower and does NOT prove partial-apply recovery on an external provider."
      ]
    }
  ],
  "import-adoption-refactoring": [
    {
      "heading": "Distinguish declaring ownership from discovering remote resources",
      "paragraphs": [
        "Import teaches OpenTofu to associate an existing provider resource ID with a configuration address. It does not write a correct configuration automatically, reproduce a manual server, create a backup, or prove that deleting the resource would be safe. The imported state may expose attributes unknown to the configuration. The critical follow-up is plan review: a proposed destroy/recreate after import is a safety failure until the provider contract and intended identity have been reconciled.",
        "For the current Steward VPS, identify the actual provider object ID, owner, attached volume and live dependencies before allowing import. Use a protected backend, a reviewed module/address and a plan showing no surprise replacement. Do not import someone else's host or assume that a successful import command proved an approved change."
      ]
    },
    {
      "heading": "A moved block expresses continuity between two addresses",
      "paragraphs": [
        "A pure configuration rename can make OpenTofu see an old address disappear and a new one appear, even when the external object should remain unchanged. A moved block or controlled state move preserves the binding when the type/instance relationship permits it. A rename without continuity is not harmless on a real provider: the engine may propose destroying the original object and creating a replacement with unexpected network and storage effects.",
        "In a disposable terraform_data copy, compare a rename with and without an explicit moved block, inspect the resource_changes actions and state address after apply, and record the distinction. Treat this as a local-address demonstration; actual provider import and refactoring need their own nonproduction approval."
      ]
    }
  ],
  "destroy-resource-lifecycle": [
    {
      "heading": "Classify disposability before permitting destroy",
      "paragraphs": [
        "A destroy operation removes managed resources according to their lifecycle and dependencies. A small development VM may be disposable while its persistent PostgreSQL volume or external backup repository is not. Even when a resource is reconstructed from code, the resulting DNS, address, encryption key, data and integration dependencies can differ. The correct policy names resources permitted to be recreated and resources requiring a protected change review or explicit prevent_destroy safeguard.",
        "OpenTofu plan JSON provides proposed delete operations that can be blocked before apply. The local teaching script demonstrates an explicit rejected delete/create replacement, then deliberately destroys only its providerless terraform_data object as an end-of-lab cleanup. That cleanup is not precedent for tearing down a real application database or user data."
      ]
    },
    {
      "heading": "Verify actual teardown without declaring full recovery",
      "paragraphs": [
        "On a real provider, planned deletion must consider remaining billable storage, public addresses, snapshots, IAM bindings and service traffic. A completed tofu destroy does not guarantee that all provider-side resources or archived data are removed; nor does it prove the deleted state can be restored within its RTO. For sensitive persistent resources, require off-host recovery evidence before destructive action.",
        "For a disposable lab, capture resource addresses before and after destruction, the exact plan and a clean state list. For real Steward, require owner approval, a protected data recovery path, a stop condition and a separate external inventory showing which resources still exist. Never conflate a source-controlled diagram with executed teardown evidence."
      ]
    }
  ],
  "secrets-sensitive-values": [
    {
      "heading": "A sensitive output flag changes display, not underlying storage",
      "paragraphs": [
        "Declaring an output sensitive may reduce accidental exposure in interactive CLI output, but the value can still exist in state, saved plans and privileged JSON output. Provider credentials also may be retrieved from environment variables, local credentials helpers or CI runners with different retention and logging risks. Source control, CI logs, state backend and plan artifacts are distinct disclosure surfaces that need separate controls.",
        "In a disposable training fixture containing a fake token only, inspect `tofu output -json` and the state document to see which data may still be recoverable. Never paste real cloud keys or database passwords into the teaching plan. For live Steward, use short-lived workload identity where supported and document revocation and the identity controlling state access."
      ]
    },
    {
      "heading": "Keep a failed apply or debug run from becoming a credential incident",
      "paragraphs": [
        "Debug logging and unsuccessful operations can disclose environment values, API URLs or a provider error containing sensitive inputs. Test how logs are collected and redacted, who can download plan files, and how long artifacts are retained. Do not debug a failed plan by uploading its entire state to a public issue or chat message.",
        "The real providerless CLI lab prints only deliberately nonsecret synthetic release strings; its temporary directory is removed at the end. It therefore cannot establish that a real provider or cloud secret manager is secure. Add a separate scoped-identity and secret-rotation integration test before raising this topic to operational acceptance."
      ]
    }
  ]
};
export const cloudIacEvidencePractices:Record<string,string[]> = {
  "plan-apply-lifecycle": [
    "Run the exact copyable providerless OpenTofu Python proof in this topic, capture all IAC_REAL_* markers, and explain the distinct create/update/replace/no-op actions produced by the CLI.",
    "Using only the disposable exercise, show a saved plan becomes stale after another plan is applied. State why a plan approval is bound to the concrete state serial and why applying a freshly re-planned different proposal silently is not equivalent."
  ],
  "state": [
    "In the dedicated local fixture, hide only the disposable state file, observe that a create is proposed despite previously managed local data, then restore the state before any apply.",
    "Document real remote-state backend, protection, backup, lock support, access and sensitivity as NOT_TESTED unless an actual authorized backend is used."
  ],
  "state-locking-concurrency": [
    "Explain why the stale-plan failure is an optimistic concurrency safeguard, not proof of a provider-backed distributed lock. Identify the backend and actors needed to test real locking.",
    "Provide an emergency unlock decision with evidence of dead process, state revision, lock owner and independent operator, without running force-unlock on production."
  ],
  "replacement-partial-apply-recovery": [
    "Show the real terraform_data triggers_replace plan contains a delete action, and prove the approval guard refuses to apply that saved plan.",
    "For a real cloud provider, list the external resource IDs and data/traffic dependencies whose observed state must be checked after a partial apply; do not infer full rollback from this providerless lab."
  ],
  "import-adoption-refactoring": [
    "Explain what remote identity import binds, how a moved block differs from creating a replacement, and which plan actions must block adoption.",
    "Propose a safe disposable moved-address experiment, separating it from an actual imported Steward VPS, for which provider-side availability and approvals remain NOT_TESTED."
  ],
  "destroy-resource-lifecycle": [
    "Perform only the providerless fixture's managed resource destroy and verify the local state is empty; explain why this is not proof of safe deletion of persistent cloud data.",
    "Classify the actual Steward database, block volume, DNS and backup state as protected or disposable, with explicit owner, verified restore and expected teardown consequences."
  ],
  "secrets-sensitive-values": [
    "Compare an interactive masked output to what may still appear in a saved plan and state. Do not log, share or commit real state/plan files.",
    "Define temporary credential, CI log, plan artifact and backend-state access/rotation boundaries for the real Steward environment; mark provider trust as NOT_TESTED until exercised."
  ]
};
