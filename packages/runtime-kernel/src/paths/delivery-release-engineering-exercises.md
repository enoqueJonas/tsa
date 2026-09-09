# Optional Release Engineering reasoning exercises

These exercises deepen reasoning without requiring extra infrastructure.

1. A candidate passed UAT as digest A, but the production job rebuilds the same Git tag and produces digest B. Decide whether B is the approved release and justify the decision.
2. Deployment reports success, `/health` returns 200, but authenticated service registration fails. Classify the release state and identify the missing gate/evidence.
3. Steward migration adds a nullable column. Compare rollback implications with a migration that drops and rewrites an existing column.
4. Nexus cleanup removes the previous production image because it is 31 days old. Explain why retention policy has become a release-engineering risk.
5. A human approval checks only that CI is green. Decide whether the approval adds useful judgment or should become an automated gate.
