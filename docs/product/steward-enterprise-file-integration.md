# Steward — Enterprise File and Batch Integration

## Purpose

This document defines Steward's file-based enterprise integration capability. It exists because some enterprise systems cannot consume Steward's REST API and instead exchange scheduled files through shared storage or managed file-transfer boundaries.

The file channel is a compatibility/integration surface, not a second source of truth. Steward remains authoritative for its domain state and all imported changes must pass Steward's application/domain validation.

## Product scenario

A legacy governance/reporting platform needs a nightly service inventory and may return a controlled ownership-review file. The legacy platform cannot initially call Steward's API.

Steward therefore supports a bounded batch integration path:

```text
Legacy governance/reporting platform
        │
        │ FTP initially; later SFTP
        ▼
Managed file-transfer boundary
        │
        ▼
Steward incoming area
        │
        ▼
File import worker
        │
        ├── validate contract/version
        ├── validate rows/domain rules
        ├── enforce idempotency
        └── record result/rejection evidence
        │
        ▼
PostgreSQL authoritative state
```

An internal NFS share may be used for justified trusted component exchange/archive behavior, but external legacy systems must not be given internal mounts merely for convenience.

## File lifecycle

Steward's file integration must have explicit lifecycle states. A representative model is:

```text
incoming/
processing/
processed/
rejected/
archive/
```

Equivalent designs are acceptable when the ownership transitions are explicit and crash recovery remains deterministic.

The design must account for:

- temporary filename / atomic rename handoff so incomplete uploads are not processed;
- file-level format/version validation before row processing;
- stable source/file identity and durable idempotency;
- duplicate and replay behavior;
- deterministic rejected/result artifacts;
- retention and archive policy;
- permissions and service-account ownership;
- disk/capacity/inode pressure;
- worker restart and server/transfer outage behavior.

## File contract

A file is an API contract. The contract must define at minimum:

- purpose, producer and consumer;
- delivery schedule/window;
- filename convention and contract version;
- encoding and format;
- header/field definitions;
- stable identifiers;
- null/date/number rules;
- required versus optional fields;
- integrity/checksum behavior where justified;
- acknowledgement/rejection semantics;
- duplicate/replay semantics;
- retention expectations.

Steward names are not sufficient identity where stable service IDs exist.

## Authority boundary

Inbound files may request or propose changes, but they do not bypass Steward authorization/business rules. The integration worker must invoke the same application/domain behavior used by trusted application entry points rather than perform uncontrolled direct writes to PostgreSQL.

The exact ownership of a proposed field must be explicit. For example, an external governance platform may submit a review outcome without becoming authoritative for Team membership or Service ownership rules.

## Protocol learning decision

### FTP — legacy implementation

TSA intentionally requires the learner to operate FTP once because it remains common in long-lived enterprise batch environments.

The exercise must include:

- separate client/server endpoints;
- control versus data connections;
- active/passive behavior and firewall implications;
- dedicated non-admin transfer account;
- interrupted transfers and permissions failures;
- incomplete-file protection;
- documented confidentiality/security limitations.

FTP is not Steward's desired end state.

### SFTP — primary secure transfer target

Security Steward later migrates the legacy FTP integration to SFTP unless a scenario constraint justifies FTPS instead.

SFTP is not 'FTP with encryption'; it is a file-transfer subsystem over SSH with different connection/firewall behavior.

The migration must preserve the higher-level file contract and processing semantics while replacing the transport boundary.

### FTPS — comparison technology

FTPS is studied as TLS-protected FTP. It is not a second mandatory permanent transfer stack unless a compatibility requirement demands it.

## Migration requirement

The later FTP → SFTP migration must include:

- compatibility test against the existing file contract;
- temporary coexistence window where required;
- credentials/host-key/trust setup;
- transfer automation changes;
- successful/failed-path verification;
- cutover criteria;
- rollback path;
- explicit FTP decommission evidence.

## Storage boundaries

This capability must reinforce, not blur, the following distinctions:

- **NFS/SMB** — mounted shared filesystem semantics;
- **FTP/SFTP/FTPS** — discrete managed file transfer;
- **S3-compatible object storage** — bucket/key/API semantics;
- **Nexus** — artifact/package/image distribution;
- **PostgreSQL** — authoritative relational state.

Using more than one of these is not redundant when each owns a distinct requirement.

## Curriculum ownership

- **Platform Builder** builds the NFS and bounded SMB/Samba infrastructure and operates basic LDAP infrastructure.
- **System Thinker** adds the Steward file contract, legacy FTP path, batch worker, idempotency/crash behavior and NFS-versus-transfer boundary.
- **Security Steward** performs FTP → SFTP migration and hardens the file-transfer identity/trust boundary.
- **Reliability Engineer** later monitors capacity, delivery freshness, backlog/failure indicators and recovery behavior where the scenario warrants it.
- **Architect / Technical Steward** may later retain, replace or remove the file channel when the legacy dependency changes.
