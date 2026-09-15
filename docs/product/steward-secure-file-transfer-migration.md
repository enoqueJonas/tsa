# Steward Secure File Transfer Migration

## Decision

Security Steward must execute the FTP-to-SFTP migration prepared by the System Thinker file-integration path. SFTP becomes the supported secure managed-file-transfer transport for the Steward legacy integration.

This is a transport migration, not a redesign of the file-based domain interface. The versioned file contract, stable identifiers, validation, idempotency, acknowledgement/rejection and batch processing lifecycle remain authoritative across the change.

## Security boundary

- SSH host-key verification authenticates the SFTP server to the client.
- A dedicated non-human client key/service identity authenticates the integration workload to the server.
- The service identity receives only the filesystem/path permissions required by the exchange.
- Host-key checking may not be disabled as a convenience workaround.
- Private client keys are secrets and must not be committed to source or ordinary evidence.
- A retired client credential must be proven unusable after rotation/revocation.

## Migration lifecycle

1. Build the restricted SFTP endpoint and trust/identity boundary.
2. Prove the existing file contract and batch worker behave identically over SFTP.
3. Prove incomplete uploads cannot enter processing and duplicate delivery across FTP/SFTP cannot duplicate domain effects.
4. Open a short, explicitly bounded FTP/SFTP coexistence window with one authoritative processing rule.
5. Cut over to SFTP and verify transfer, processing and acknowledgement health.
6. Break SFTP once during the approved window and rehearse the pre-defined FTP rollback.
7. Restore SFTP, repeat cutover and satisfy the observation/decommission gates.
8. Revoke FTP credentials, stop/disable the FTP listener/service, remove FTP/passive firewall exposure and prove FTP no longer works while SFTP still does.

## Anti-duplication rule

FTP and SFTP are not permanent parallel integration choices. Dual availability exists only to make migration and rollback safe. Keeping FTP active after the decommission gate preserves the original confidentiality/exposure risk and fails the exercise.

## Final evidence

The final state must contain positive SFTP transfer evidence, negative FTP connection/authentication/transfer evidence, reduced listener/firewall exposure, cleaned configuration/runbook references and one supported authoritative transfer path.
