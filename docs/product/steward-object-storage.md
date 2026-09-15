# Steward Object Storage

## Decision

Steward must implement one real S3-compatible object-storage boundary during Cloud Engineer.

The learning implementation should be learner-owned and runnable in the TSA homelab. MinIO is the reference implementation because it exposes S3-compatible semantics without requiring a paid cloud account. The capability, not the product brand, is the durable curriculum contract.

## Steward requirement

Steward produces durable generated blobs such as service-inventory exports or evidence bundles. These objects must survive application-process/container replacement and must not be treated as relational rows, software packages or arbitrary local application files.

Steward therefore stores the blob in object storage while retaining appropriate business metadata, ownership and authorization state in the application domain/PostgreSQL.

## Capability ownership

- PostgreSQL: authoritative transactional/domain state.
- NFS/SMB: mounted shared-filesystem semantics where a file share is the contract.
- FTP/SFTP: managed transfer boundary with external/legacy systems.
- Nexus: versioned software packages, dependencies and container/build artifacts.
- S3-compatible object storage: durable application-generated blobs accessed through bucket/key/API semantics.
- backup storage: recoverable copies governed by RPO/RTO and restore requirements; it may use object storage, but backup is a responsibility rather than a synonym for S3.

These are not duplicate technologies merely because all can contain bytes.

## Mandatory implementation evidence

Cloud Engineer must require the learner to:

1. deploy and persist a real S3-compatible service;
2. design bucket/key and naming boundaries;
3. separate administrative and Steward runtime identities;
4. implement least-privilege access and prove allowed plus denied operations;
5. integrate a real Steward export/evidence workflow through the S3 API;
6. preserve application/domain authorization rather than relying on secrecy of object keys;
7. implement lifecycle/retention behavior;
8. reproduce service-unavailable and invalid/revoked-credential failures;
9. recover and verify previously committed objects;
10. compare object semantics and failure behavior with NFS/file semantics and Nexus artifact semantics.

## Anti-zoo rule

A managed provider object store may later replace the homelab implementation when a cloud scenario justifies it. Do not permanently operate several S3-compatible products simply for exposure. A replacement becomes a bounded migration with compatibility, cutover, rollback and decommission evidence.
