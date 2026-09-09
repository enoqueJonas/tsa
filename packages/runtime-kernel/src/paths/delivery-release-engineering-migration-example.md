# Migration rollback example

Consider two Steward changes.

**Change A:** add nullable `review_due_at` to Service.

An older application version may remain compatible if it ignores the new column. Application rollback may therefore be feasible after the migration, subject to actual testing.

**Change B:** replace `lifecycle` values and destructively rewrite/drop the old representation.

An older application may no longer understand persisted state. Restarting the previous image could fail or corrupt behavior. The release needs a compatible expand/migrate/contract strategy, data recovery plan or forward fix.

The lesson is not that one SQL operation is always safe. Compatibility must be demonstrated for the actual application/data transition.
