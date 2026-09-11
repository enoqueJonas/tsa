import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { softwareCraftDeepLessons } from "./builder-software-craft-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
    "software-craft-git-as-an-engineering-tool": {
        objective: "Turn a messy Steward working tree into one reviewable change whose history explains exactly what happened.",
        scenario: "You are about to submit a Steward change, but the working tree contains intended code, generated output and unrelated local edits. A reviewer should be able to inspect one commit and understand the engineering outcome without reconstructing your workstation state.",
        instructions: [
            "Inspect git status, the unstaged diff and the staged diff separately; classify every changed file as intended, generated/local, or unrelated.",
            "Choose one coherent Steward change and stage only the files that belong to it.",
            "Write a commit message that names the engineering outcome rather than the editing activity.",
            "Use git show on the final commit and review it as if it came from another engineer.",
            "Create a tiny controlled regression on a disposable branch or sequence of commits, then demonstrate how git log, show or bisect would narrow the introduction point.",
            "Record what you deliberately refused to include in the commit and why."
        ],
        deliverables: ["Change classification from the original working tree", "One coherent Steward commit", "git show review evidence", "Short regression-investigation note"],
        completionCriteria: ["The commit contains one defensible engineering reason for change.", "Generated or unrelated files are not mixed into the change.", "The history can answer what changed and why.", "You can explain when history tools are evidence rather than ceremony."]
    },
    "software-craft-branching-and-collaboration": {
        objective: "Prepare a small Steward change for collaboration with the minimum branch and pull-request ceremony needed for safe review.",
        scenario: "A teammate will review your change without access to your chat history or local context. Your branch and pull request must explain the problem, scope, validation and deferred work while staying easy to integrate.",
        instructions: [
            "Define the branch goal in one sentence and remove any work that does not serve it.",
            "Compare the branch against master and identify any accidental scope growth.",
            "Write a PR description with problem, approach, validation, risks and intentionally deferred work.",
            "Choose whether the branch should preserve multiple commits or be squash-merged, based on whether the commits carry useful review structure.",
            "Describe how you would update the branch if master moved ahead without creating another unnecessary branch.",
            "After a hypothetical merge, write the exact local and remote branch-cleanup steps."
        ],
        deliverables: ["Branch-scope statement", "Review-ready PR description", "Merge-strategy decision", "Post-merge cleanup procedure"],
        completionCriteria: ["The branch has one coherent goal.", "The PR can be reviewed without undocumented context.", "The merge strategy is justified rather than habitual.", "Branch deletion is treated as part of finishing the work."]
    },
    "software-craft-readable-code": {
        objective: "Reduce the mental reconstruction cost of one difficult Steward code path without changing behavior.",
        scenario: "A teammate can make the code pass tests but cannot quickly explain what one authorization or lifecycle path means. Your job is to improve domain readability while resisting cosmetic churn.",
        instructions: [
            "Choose one difficult function or request path and write what makes it hard to understand before editing it.",
            "Capture current success and failure behavior with focused tests or reproducible requests.",
            "Rename ambiguous variables/functions using Steward domain language.",
            "Extract at most one concept that has a real domain or responsibility name; do not create abstraction only to shorten the function.",
            "Compare the before/after code and ask a reviewer to identify the policy without tracing every line.",
            "List one cleanup you intentionally rejected because it would add churn without improving comprehension."
        ],
        deliverables: ["Before/after code excerpt", "Behavior-preservation evidence", "Readability rationale", "Rejected-cleanup note"],
        completionCriteria: ["Domain policy is easier to identify.", "Behavior is unchanged and demonstrated.", "The refactor adds no unnecessary abstraction.", "You can explain why the final names/boundaries are better for review."]
    },
    "software-craft-separation-of-concerns": {
        objective: "Untangle one Steward request path by moving exactly one responsibility to the boundary that should own it.",
        scenario: "A single API path currently mixes HTTP representation, access policy, domain rules and persistence. Changes are risky because nobody can tell which concern owns which decision.",
        instructions: [
            "Trace one write request from DRF entry point to database and label representation, authentication/authorization, domain-rule and persistence responsibilities.",
            "Identify the single most harmful responsibility leak and explain why it makes change harder.",
            "Move only that responsibility to a more appropriate boundary.",
            "Keep database constraints as integrity backstops where applicable rather than duplicating or removing them casually.",
            "Run focused behavior checks and inspect the resulting call path.",
            "Explain why at least one other mixed concern is acceptable to leave in place for now."
        ],
        deliverables: ["Responsibility map", "Focused boundary refactor", "Behavior evidence", "Boundary decision note"],
        completionCriteria: ["One reason-to-change is clearer after the refactor.", "The new boundary owns a real responsibility.", "The request still behaves correctly.", "You demonstrate restraint instead of layering for its own sake."]
    },
    "software-craft-refactoring": {
        objective: "Refactor one concrete Steward hotspot using a safety net and small reversible steps.",
        scenario: "A maintainability problem is slowing a real change, but the team does not want a broad cleanup project. You must remove the specific friction while proving that externally visible behavior stays stable.",
        instructions: [
            "Name the maintainability problem in operational terms: duplicated policy, confusing coupling, repeated branching, hidden side effects or similar.",
            "Capture the current behavior with tests or reproducible API evidence before structural changes.",
            "Perform the smallest first transformation and rerun the safety net.",
            "Continue only while each step clearly reduces the named problem.",
            "If you discover a behavior change that is actually needed, stop and record it as separate feature work rather than hiding it inside the refactor.",
            "Write the stopping condition that tells you the refactor is complete enough."
        ],
        deliverables: ["Named hotspot/problem", "Pre-refactor behavior evidence", "Small-step refactor evidence", "Stopping-condition note"],
        completionCriteria: ["The original behavior remains stable.", "The named maintainability problem is measurably reduced.", "Feature changes are not smuggled into cleanup.", "You can explain why further refactoring is not justified yet."]
    },
    "software-craft-managing-dependencies": {
        objective: "Audit Steward's dependency ownership and make one evidence-based keep, remove or reuse decision.",
        scenario: "Steward has accumulated packages across Builder. Before later CI, artifact-repository and supply-chain work, the team needs to know which dependencies are intentional and whether any code truly deserves an internal-package boundary.",
        instructions: [
            "List direct runtime/development dependencies and record the concrete capability each provides.",
            "Choose one transitive dependency and prove whether Steward code imports or relies on it directly.",
            "Find one dependency that can plausibly be removed, replaced by the standard library/framework, or retained; test the decision rather than arguing from preference.",
            "Inspect current reusable-code candidates and identify whether there is more than one real consumer with a stable boundary.",
            "For one important dependency, define version/upgrade validation expectations.",
            "Write a short decision separating external dependency ownership, local application code and a genuinely justified future internal package."
        ],
        deliverables: ["Dependency ownership table", "Transitive-dependency evidence", "One keep/remove decision with validation", "Internal-package boundary assessment"],
        completionCriteria: ["Every examined direct dependency has a known reason to exist.", "No transitive package is treated as an accidental public API.", "The internal-package decision is based on real consumers rather than curriculum pressure.", "Upgrade ownership is explicit."]
    },
    "software-craft-configuration": {
        objective: "Define Steward's configuration contract and prove that configuration mistakes fail visibly and safely.",
        scenario: "Steward works on one developer machine because settings, secrets and domain choices have been mixed together. Before delivery automation begins, another engineer must be able to tell which values vary by deployment and which rules belong in code.",
        instructions: [
            "Inventory current settings and classify each as secret, deployment-specific configuration, safe default or domain behavior.",
            "Move one inappropriate hard-coded deployment value out of code if such a case exists.",
            "Choose one required variable and make startup fail clearly when it is missing.",
            "Demonstrate the failure and confirm the diagnostic does not print the secret value.",
            "Document local-development defaults separately from production requirements.",
            "Identify one tempting environment variable that should remain domain policy in code and explain why."
        ],
        deliverables: ["Configuration classification", "Validated configuration change", "Safe startup-failure evidence", "Configuration contract documentation"],
        completionCriteria: ["Deployment config and domain behavior are not conflated.", "Required configuration fails fast.", "Secret values do not leak through diagnostics.", "Another engineer can understand what must be supplied in each environment."]
    },
    "software-craft-useful-logging": {
        objective: "Design logs that let an engineer reconstruct one important Steward operation without exposing sensitive data.",
        scenario: "A service ownership or lifecycle change is disputed after the fact. Existing logs either say too little to investigate or dump noisy request data. Create a small logging contract that provides evidence another engineer could actually use.",
        instructions: [
            "Choose one important domain operation and one denied/failure path.",
            "Define the questions an investigator should be able to answer from logs before writing log statements.",
            "Add stable event names and the minimum useful identifiers/context at appropriate levels.",
            "Exercise both paths and search the output using the identifiers you chose.",
            "Explicitly inspect output for passwords, JWTs, cookies, secrets, sensitive headers or unnecessary request bodies.",
            "Remove one noisy or duplicate log if it adds no investigative value."
        ],
        deliverables: ["Logging questions/contract", "Success and failure log evidence", "Secret-leakage check", "Noise-removal note"],
        completionCriteria: ["The operation can be reconstructed from stable context.", "Log levels match operational meaning.", "Sensitive values are absent.", "The logging change improves signal rather than just increasing volume."]
    },
    "software-craft-technical-documentation": {
        objective: "Make Steward runnable and understandable by an engineer who did not participate in its development.",
        scenario: "You hand the repository to a teammate who knows Django but has none of your TSA history. They have 30 minutes to understand the product, configure it, migrate the database and make one useful request without asking you for missing steps.",
        instructions: [
            "Start from the current documentation and list every piece of private knowledge you would currently need to supply verbally.",
            "Rewrite the setup path from clone to environment configuration, database migration and first useful request using concrete commands.",
            "Describe Steward's domain at the level needed to understand Team, Service, Environment, dependency and review relationships.",
            "Link to the generated OpenAPI/schema instead of manually duplicating the entire API contract.",
            "Add one decision/rationale note and one known limitation or next-stage concern.",
            "Walk the instructions from a clean checkout or have another engineer simulate them; record every step that proved ambiguous or false and correct it."
        ],
        deliverables: ["Updated runnable setup documentation", "Domain orientation section", "Decision/limitation note", "Documentation verification evidence"],
        completionCriteria: ["The setup is executable rather than aspirational.", "The reader can understand the core Steward domain without chat history.", "Documentation does not duplicate generated contracts unnecessarily.", "At least one documentation claim has been tested against reality."]
    },
    "software-craft-designing-errors": {
        objective: "Turn inconsistent Steward failures into an API error contract that tells clients what action is possible without leaking internals.",
        scenario: "Different endpoints return unrelated shapes for invalid data, conflicts, forbidden actions and unexpected exceptions. A client team cannot reliably decide whether to correct input, request access, retry or escalate.",
        instructions: [
            "Create a failure matrix for validation, unauthenticated, forbidden, not found, conflict and unexpected server failure.",
            "Trigger each case and record current status, body shape and whether the response exposes implementation details.",
            "Choose one inconsistent case and map it to a stable error code/message/details structure compatible with the rest of Steward.",
            "Keep detailed exception evidence in controlled logs while removing SQL/stack/token internals from the public response.",
            "Write the client action expected for each failure category: fix input, authenticate, request permission, stop retrying, retry later or escalate.",
            "Re-run the negative cases and preserve before/after evidence."
        ],
        deliverables: ["Failure matrix", "One improved public error mapping", "Leakage check", "Client-action contract"],
        completionCriteria: ["Failure categories carry distinct actionable meaning.", "Public errors are stable enough for clients to reason about.", "Internal exception detail is not exposed.", "The changed case is demonstrated with negative evidence."]
    },
    "software-craft-performance-awareness": {
        objective: "Perform one restrained Steward performance review and decide whether optimization is justified at all.",
        scenario: "A teammate says the service list 'feels slow' and proposes adding caching and indexes everywhere. Before later System Thinker work introduces Redis, you must determine whether there is a measured application/database problem and choose the smallest useful response.",
        instructions: [
            "Choose one realistic endpoint and define a representative dataset plus one measurable baseline such as query count, latency or transferred rows.",
            "Capture the baseline and identify where work occurs: database queries, serialization, Python logic or external boundary.",
            "Form one hypothesis using evidence from query logs, EXPLAIN or request timing.",
            "Apply at most one change if the evidence justifies it; otherwise document why no optimization should be made.",
            "Re-measure under the same conditions and record both improvement and complexity cost.",
            "State explicitly whether this problem justifies a future cache. If not, preserve that decision so Redis is not introduced speculatively."
        ],
        deliverables: ["Performance baseline", "Evidence-backed hypothesis", "Before/after comparison or no-change decision", "Future-cache justification decision"],
        completionCriteria: ["The investigation starts from a measurable symptom.", "Optimization is not performed by intuition.", "The final decision includes maintenance/complexity cost.", "Redis or other infrastructure is not proposed without a demonstrated need."]
    }
};

export const softwareCraftQualityLessons: Lesson[] = softwareCraftDeepLessons.map((lesson) => {
    const practice = practices[lesson.id];
    if (!practice) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) => {
            if (activity.content.type !== "practical") return activity;
            return {
                ...activity,
                content: { type: "practical", ...practice },
            };
        }),
    };
});
