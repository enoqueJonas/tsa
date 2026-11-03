import type { LessonBlock } from "../activities/content";

// Isolated filesystem drill: not an RPO/RTO, offsite, database, or failover test.
export const restoreIntegrityPython = "from hashlib import sha256\nfrom pathlib import Path\nfrom shutil import copy2, rmtree\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory(prefix=\"tsa-restore-\") as workspace:\n    root = Path(workspace)\n    primary = root / \"primary\"\n    backup_dir = root / \"backup\"\n    restored = root / \"isolated-restore\"\n    for location in (primary, backup_dir, restored):\n        location.mkdir()\n    source = primary / \"ledger.txt\"\n    source.write_text(\"synthetic order=42 status=committed\\n\", encoding=\"utf-8\")\n    expected_hash = sha256(source.read_bytes()).hexdigest()\n    archive = backup_dir / \"ledger.snapshot\"\n    copy2(source, archive)\n    rmtree(primary)\n    copy2(archive, restored / \"ledger.txt\")\n    assert sha256((restored / \"ledger.txt\").read_bytes()).hexdigest() == expected_hash\n    assert \"status=committed\" in (restored / \"ledger.txt\").read_text()\n    archive.write_bytes(archive.read_bytes() + b\"CORRUPTED\")\n    assert sha256(archive.read_bytes()).hexdigest() != expected_hash\n    print(\"restore_hash_verified=true tampered_backup_rejected=true\")";

export const recoverySourceProofById: Record<string, LessonBlock[]> = {
 "backup-integrity":[
  {type:"heading",id:"backup-integrity-identity",text:"Integrity is measured against a known source",level:2},
  {type:"paragraph",text:"A backup job exiting successfully does not establish that its output can be restored or is internally consistent. Establish the source file identity before backup, store the expected digest in protected runbook metadata, restore independently and verify exact bytes and application-level acceptance. A checksum by itself cannot prove backup freshness, permission correctness, transaction consistency or RPO/RTO."},
  {type:"heading",id:"restore-negative-corruption",text:"Execute a disposable restore and deliberate corruption",level:2},
  {type:"paragraph",text:"This Python standard-library experiment creates its own temporary workspace, copies synthetic content to a simulated backup area, deletes the disposable primary, restores into a separate path and checks the original SHA-256. It then tampers with the backup and demonstrates a digest mismatch. TemporaryDirectory cleans up both copies. It never touches a real database, production file or externally mounted backup."},
  {type:"code",language:"python",caption:"Actual isolated filesystem restore, hash match and corruption rejection",code:restoreIntegrityPython},
  {type:"paragraph",text:"Transfer: after this model, a real PostgreSQL drill must also prove a consistent logical or physical restore, database readiness, credentials, privileges, schema versions, outbox replay and user-facing Steward acceptance. Storing both fixture paths in the same temporary filesystem does NOT demonstrate offsite storage or failure-domain isolation."}
 ],
 "restore-testing":[
  {type:"heading",id:"restore-test-scope",text:"A restore test must define the original failure",level:2},
  {type:"paragraph",text:"A successful copy into a new directory is only byte-level restoration. A genuine recovery drill must use a separate authorized target, record the pre-failure last valid commit, select a recovery point, rebuild the required dependencies, measure elapsed time against RTO and determine lost committed changes relative to RPO. Add explicit security, access and application behavior checks before declaring service usable."},
  {type:"heading",id:"restore-missing-dependency-negative",text:"Failure and transfer: data present, service still unusable",level:2},
  {type:"paragraph",text:"Imagine a PostgreSQL restore whose data files exist but the application has no credentials, schema mismatch or unattached object blobs. Report the restore as INCOMPLETE. Identify the missing dependency, apply a documented fix on the disposable recovery target, rerun end-to-end acceptance and record the measured time/loss; a screenshot of restored files does not close the gate."}
 ]
};
