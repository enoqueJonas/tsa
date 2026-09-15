import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const postgresAlter: LearningResource = { title: "PostgreSQL ALTER TABLE", url: "https://www.postgresql.org/docs/current/sql-altertable.html" };
const djangoMigrations: LearningResource = { title: "Django migrations", url: "https://docs.djangoproject.com/en/stable/topics/migrations/" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "A production database cannot be treated as if application code and schema switch atomically. During a rolling or staged release, old and new application versions can overlap while data already exists. Steward must learn to evolve persistent state without assuming an instant cutover." },
    { type: "heading", id: "expand-contract", text: "Expand, migrate, switch, contract", level: 2 },
    { type: "list", items: [
        "Expand: add backward-compatible schema/state without removing what the old application still needs.",
        "Migrate/backfill: move existing data separately, observably and restartably.",
        "Switch: make the new application behavior authoritative only after compatibility and data conditions are proven.",
        "Contract: remove obsolete schema only after old application versions and rollback paths no longer depend on it."
    ] },
    { type: "callout", tone: "steward", title: "Recovery rule", body: "Rolling back application bytes is not the same as rolling back persistent data. Before release, classify whether recovery is safe application rollback, migration rollback, restore, or forward-fix. Prefer compatible forward evolution over destructive reverse migrations." },
    { type: "resources", title: "Continue learning", resources: [postgresAlter, djangoMigrations] },
];

export const productionSchemaEvolutionDeepLessons: Lesson[] = [
    {
        id: "delivery-production-schema-evolution",
        title: "Production Database Schema Evolution",
        activities: [
            { id: "delivery-production-schema-evolution-001", title: "Schema Changes Are Distributed Releases", estimatedMinutes: 45, content: { type: "reading", body: "Treat application versions, schema versions and existing data as independently moving parts during release.", blocks } },
            {
                id: "delivery-production-schema-evolution-002",
                title: "Design a Backward-Compatible Steward Change",
                estimatedMinutes: 120,
                content: { type: "practical", objective: "Turn one intentionally breaking Steward schema requirement into a staged compatibility plan.", scenario: "Steward must replace or reshape an existing production field that already contains data and is read/written by the current application. A direct rename/drop or immediate NOT NULL assumption would make old and new versions incompatible during deployment.", instructions: [
                    "Choose one realistic Steward schema change that would be unsafe as a one-step production migration, such as replacing/renaming a populated field, splitting one value into structured columns, or introducing a new mandatory representation.",
                    "Capture the current table shape, representative existing rows, application read/write behavior and rollback assumptions.",
                    "Design an expand migration that preserves old-version behavior while adding the new representation. Avoid destructive drop/rename operations in the first stage.",
                    "Define how writes remain compatible during coexistence: dual write, compatibility translation, staged read fallback or another justified technique.",
                    "Define the backfill algorithm, batching/restartability, verification query, failure handling and expected locking/load risk.",
                    "Define the exact evidence required before switching reads/writes to the new representation and before the later contract migration may run."
                ], deliverables: ["Breaking-change baseline", "Expand/compatibility design", "Backfill plan", "Switch criteria", "Contract/decommission criteria", "Rollback/forward-fix matrix"], completionCriteria: ["The first migration is compatible with the currently running application.", "Existing data has an explicit migration/backfill path.", "The plan distinguishes schema deployment from data migration and application cutover.", "Destructive cleanup is delayed until old-version compatibility is no longer required.", "Recovery decisions account for persistent-state mutation." ] },
            },
            {
                id: "delivery-production-schema-evolution-003",
                title: "Run the Expand and Backfill",
                estimatedMinutes: 240,
                content: { type: "practical", objective: "Execute the compatible schema expansion and a restartable data migration against populated PostgreSQL.", scenario: "The release begins while the old Steward version remains live. The database must expand without interrupting that version, then existing rows must migrate without hiding partial progress.", instructions: [
                    "Seed a non-production PostgreSQL database with enough representative Steward rows to make partial backfill observable.",
                    "Run the expand migration while the old application version is still serving representative read/write traffic and prove it remains functional.",
                    "Deploy or run the compatibility-capable new application version while the old version remains available, and exercise both versions against the expanded schema.",
                    "Execute the backfill in bounded batches or another restartable mechanism rather than one opaque application-startup mutation.",
                    "Interrupt the backfill deliberately after partial progress, inspect state, restart it and prove already-migrated rows are not corrupted or duplicated.",
                    "Measure/observe database locks, query latency or resource pressure sufficiently to identify whether the migration threatens normal service.",
                    "Run deterministic verification that identifies missing, inconsistent or invalid migrated rows before cutover."
                ], deliverables: ["Populated migration fixture", "Old-version compatibility evidence", "Old/new coexistence evidence", "Interrupted/restarted backfill evidence", "Migration load observation", "Data verification results"], completionCriteria: ["The old application continues working after expand.", "Old and new application versions can overlap against the expanded schema.", "Backfill can resume safely after interruption.", "Migration correctness is verified from data, not inferred from command exit status.", "The learner observes operational impact on PostgreSQL." ] },
            },
            {
                id: "delivery-production-schema-evolution-004",
                title: "Switch, Fail and Recover",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Exercise the release decision boundary after persistent state has changed.", scenario: "Backfill is complete and the new representation becomes authoritative, but the new application then fails verification. Recovery must account for the fact that schema and data have already evolved.", instructions: [
                    "Switch the new Steward version to the new representation only after the defined verification criteria pass.",
                    "Introduce one controlled post-switch application failure that would tempt a simple container rollback.",
                    "Attempt the recovery analysis before acting: determine whether the previous application remains compatible with the current schema/data, whether rollback is safe, or whether a forward fix is required.",
                    "Execute the justified recovery path and prove representative reads/writes remain correct.",
                    "Record which migration stages are reversible, which are intentionally forward-only and what backup/restore would and would not solve.",
                    "Prove the release pipeline/runbook has a stop gate that prevents automatic destructive contract migration immediately after deployment."
                ], deliverables: ["Cutover evidence", "Controlled post-switch failure", "Recovery decision record", "Recovered client/data evidence", "Reversibility matrix", "Contract safety gate"], completionCriteria: ["Recovery is chosen from actual schema/data compatibility rather than reflexive application rollback.", "A post-mutation failure is reproduced and recovered.", "Application rollback and database rollback are explicitly distinguished.", "Destructive cleanup cannot run before its compatibility gate." ] },
            },
            {
                id: "delivery-production-schema-evolution-005",
                title: "Contract and Prove the End State",
                estimatedMinutes: 120,
                content: { type: "practical", objective: "Remove obsolete schema only after the coexistence and rollback window is intentionally closed.", scenario: "The new Steward version has been stable for the defined observation window and old-version rollback is no longer an approved recovery path.", instructions: [
                    "Verify no supported application version reads or writes the obsolete representation and no required rollback path depends on it.",
                    "Capture a final data-integrity check and appropriate backup/recovery point before destructive cleanup.",
                    "Run the contract migration to remove obsolete columns/constraints/compatibility code as appropriate.",
                    "Run application, migration and representative client tests against the contracted schema.",
                    "Update the release record/runbook with the final schema state and explicitly close the migration coexistence window."
                ], deliverables: ["Pre-contract gate evidence", "Contract migration", "Post-contract verification", "Final schema record", "Closed coexistence/rollback window"], completionCriteria: ["Contract occurs only after old-version dependency is proven absent.", "The final schema and data pass deterministic verification.", "Obsolete compatibility behavior is actually removed rather than left indefinitely.", "The release record explains when rollback ceased to be safe and what recovery path replaced it." ] },
            },
            { id: "delivery-production-schema-evolution-006", title: "Defend the Migration Strategy", estimatedMinutes: 20, content: { type: "reflection", prompt: "Explain why the Steward schema change could not safely be deployed as one migration. Defend the expand/backfill/switch/contract sequence, the old/new coexistence strategy, the backfill restart behavior, and the point at which application rollback stopped being a valid recovery strategy.", minimumCharacters: 350 } },
        ],
    },
];
