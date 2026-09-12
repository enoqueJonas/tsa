import { createAcademyBackup, restoreAcademyBackup, type AcademyBackup } from "./academy-backup";
import {
  deleteDailySnapshot,
  getAllDailySnapshots,
  getDailySnapshot,
  putDailySnapshot,
  SNAPSHOT_SCHEMA_VERSION,
  type DailySnapshotRecord,
} from "./progress-storage";

export const DAILY_SNAPSHOT_RETENTION = 14;

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function ensureDailySnapshot() {
  const dateKey = localDateKey();
  const existing = await getDailySnapshot(dateKey);
  if (existing) return existing;

  const backup = await createAcademyBackup();
  const hasLearnerData = backup.progress.length > 0
    || backup.evidence.length > 0
    || backup.projects.length > 0
    || backup.assessments.length > 0;

  if (!hasLearnerData) return undefined;

  const record: DailySnapshotRecord = {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    dateKey,
    createdAt: new Date().toISOString(),
    backup,
  };

  await putDailySnapshot(record);
  await pruneDailySnapshots();
  return record;
}

export async function listDailySnapshots() {
  const snapshots = await getAllDailySnapshots();
  return snapshots.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function latestDailySnapshot() {
  return (await listDailySnapshots())[0];
}

export async function restoreDailySnapshot(record: DailySnapshotRecord) {
  await restoreAcademyBackup(record.backup as AcademyBackup);
}

async function pruneDailySnapshots() {
  const snapshots = await listDailySnapshots();
  const expired = snapshots.slice(DAILY_SNAPSHOT_RETENTION);
  await Promise.all(expired.map((snapshot) => deleteDailySnapshot(snapshot.dateKey)));
}
