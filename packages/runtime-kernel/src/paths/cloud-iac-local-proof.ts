// PED-005: distinct local and failure-path evidence in original OpenTofu readings.
export type IacSection = { heading:string; paragraphs:string[]; code?:{language:string;caption?:string;code:string} };
export const iacDepthById: Record<string,IacSection[]> = {
  "terraform-opentofu-fundamentals": [
    {
      "heading": "Run a local lifecycle before touching a provider account",
      "paragraphs": [
        "The minimal OpenTofu workflow is configuration → format/validate → initialize providers/backend → plan proposed operations → review exact saved plan → apply that plan → inspect outputs/state → plan again to check convergence → destroy disposable resources. A successful `tofu validate` proves syntax and internal schema checks, not that a real target API is reachable, credentials are authorized or Steward is healthy. Even a reviewed plan can become stale before execution if another writer changes state or reality.",
        "This exercise uses OpenTofu's built-in `terraform_data` resource, which stores input in local state without creating a cloud VM or asking for external cloud credentials. Precondition: OpenTofu CLI is installed; a temp directory is writable. The script intentionally creates and destroys only a providerless training resource, and leaves the generated local directory for inspection and manual cleanup. No provider account, cloud spend, production environment or live host modification is involved. The example source URL is official OpenTofu resource documentation, not an unknown registry module."
      ],
      "code": {
        "language": "bash",
        "caption": "One exact providerless OpenTofu CLI lab, review before apply",
        "code": "set -euo pipefail\ncommand -v tofu >/dev/null || { echo \"OpenTofu CLI (tofu) is required\"; exit 2; }\nLAB=\"$(mktemp -d)\"\necho \"Disposable local lab: $LAB\"\ncat > \"$LAB/main.tf\" <<'HCL'\nterraform {\n  required_version = \">= 1.6.0\"\n}\nresource \"terraform_data\" \"release\" {\n  input = \"approved-training-artifact\"\n}\noutput \"release\" {\n  value = terraform_data.release.output\n}\nHCL\n(\n  cd \"$LAB\"\n  tofu init -backend=false -input=false\n  tofu fmt -check\n  tofu validate\n  tofu plan -input=false -out=reviewed.tfplan\n  tofu show -no-color reviewed.tfplan\n  tofu apply -input=false reviewed.tfplan\n  tofu output -raw release\n  tofu plan -input=false -detailed-exitcode\n  tofu destroy -auto-approve\n)\necho \"Inspect and remove only the disposable lab directory shown above after evidence.\"\n"
      }
    },
    {
      "heading": "Read outputs and limitations",
      "paragraphs": [
        "Expected: initial plan proposes one terraform_data resource; the approved apply produces an output of `approved-training-artifact`; the next detailed-exitcode plan returns 0 for no changes; destroy removes the managed local resource. Verify those results rather than reading an illustrative screenshot. If a command fails, keep the disposable directory and capture the plan/state error; do not retry by deleting actual shared state. A `terraform_data` state value is teaching bookkeeping, not an approval record for a real Steward image digest."
      ]
    }
  ],
  "state": [
    {
      "heading": "State relates declared identity to an observed resource identity",
      "paragraphs": [
        "OpenTofu state is not the source code and it is not simply a cache of every provider object. It records resource addresses, IDs and attributes needed to compare desired configuration with managed reality. For instance, `terraform_data.release` holds the local training object; a real cloud VM resource would map an address to a provider-generated instance ID. Renaming a resource in code without a `moved` block or explicit state operation may make the tool propose destruction/creation even if the intended target is unchanged. Secrets may be present in state even when outputs are marked sensitive.",
        "In the providerless lab, inspect `tofu state list` and `tofu state show terraform_data.release` while the resource exists, and see that `terraform_data.release` is an address. That does not give a secret-safe format to share: real state files must remain outside Git, access controlled and backed up appropriately. A plan showing a resource update is only a proposed change; validate the target resource identity and downstream application effects before approval."
      ]
    },
    {
      "heading": "Negative case: prove state is a safety boundary",
      "paragraphs": [
        "Do not delete `terraform.tfstate` to 'fix drift' in a real project: the tool could treat existing infrastructure as unmanaged and propose duplicates. In a *copy of the disposable local lab only*, compare state list before and after destroying its one training object. Explain why local state is not suitable for multi-operator concurrent cloud management, why remote locking matters and why unlocking a stale lease must follow evidence of the previous writer's termination."
      ]
    }
  ],
  "plan-apply-lifecycle": [
    {
      "heading": "The approved bytes are the plan, not an intention",
      "paragraphs": [
        "A `tofu plan -out=reviewed.tfplan` persists a binary plan containing the configuration-derived action proposal. Inspect it with `tofu show reviewed.tfplan` and apply that exact file rather than re-planning silently after approval. A plan may contain sensitive configuration/attribute values; treat it like a secret-bearing artifact. Planning is not transactional deployment to an entire distributed system; partial API failures can leave some resources created and others absent. The state and provider reality must be reconciled before proceeding.",
        "The local terraform_data lab provides observable create → no-change → destroy outcomes without provider credentials. To learn a negative case, change only the fixture's input value in the disposable copy and re-plan: a changed value should produce a proposed in-place update, not require guesswork about a cloud provider. Restore the approved input and observe a no-diff plan. Never perform a real cloud `destroy` simply to satisfy an exercise that did not provision the resource."
      ]
    },
    {
      "heading": "Failure and independent transfer",
      "paragraphs": [
        "A saved plan proposes replacing a public IP while the app still serves traffic. After a second engineer changed infrastructure or the saved plan became incompatible with the current state, the apply may fail safely rather than execute an outdated plan. Verify state-lock ownership, resource addresses and current plan instead of force-applying. Explain which approval must be renewed after a meaningful change to the plan and which end-to-end test proves Steward still serves HTTPS after a permitted infrastructure change."
      ]
    }
  ],
  "drift": [
    {
      "heading": "Detect, explain, then reconcile drift; do not automatically override a rescue change",
      "paragraphs": [
        "Drift means observed remote resource attributes differ from the current configuration/state expectation. It can arise from a manual provider-console fix, another automation's write, provider-side replacement or out-of-band platform control. A regular refresh+plan may reveal some such differences depending on provider visibility; absence of a diff does not prove the application is healthy or that no unmanaged resource exists. For a deliberate real cloud experiment, preserve the pre-change plan, change a **disposable noncritical** setting through the provider API, run a fresh plan, compare remote and declared values and decide whether to adopt the change into code or revert it."
      ]
    },
    {
      "heading": "Failure and transfer: emergency repairs change ownership decisions",
      "paragraphs": [
        "If an operator deliberately opens a temporary emergency route to restore a service but CI then reapplies the old approved infrastructure declaration, blind reconciliation can undo recovery. Freeze conflicting writers, record the emergency change and its expiry, review a durable desired-state correction, then resume one authority. A local `terraform_data` input edit exercises a change to declared intent, NOT real remote drift; never claim that it demonstrates drift on a cloud provider."
      ]
    }
  ],
  "import-adoption-refactoring": [
    {
      "heading": "Import binds a resource address, it does not generate a safe design",
      "paragraphs": [
        "A real VPS originally created manually may later be managed by OpenTofu. To import it safely, first identify the exact provider resource ID and the resource address that will own it; write matching configuration, choose an approved backend with locking, take state backup and inspect read-only resource attributes. Import creates a state binding but does not certify that the configuration matches all attributes or that the provider will never propose replacement. Run a post-import plan and treat replacement/deletion proposals as review blockers until explained."
      ]
    },
    {
      "heading": "Failure and transfer: a rename can appear as destruction",
      "paragraphs": [
        "Renaming `cloud_instance.api` to `cloud_instance.steward_api` in configuration can be interpreted as deleting one resource address and creating another. A `moved` block or approved state migration expresses continuity when the provider supports it. Differentiate a pure state-address move from real underlying replacement, including potential public IP, DNS, TLS and attached volume consequences. Practice the distinction conceptually on the `terraform_data.release` fixture before touching any internet VPS; never import a real project merely to obtain a green training badge."
      ]
    }
  ]
};
