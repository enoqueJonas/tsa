import type { LearningPath, LearningProgress } from "@tsa/runtime-kernel";

const DATABASE_NAME = "tsa-academy";
const DATABASE_VERSION = 5;
const PATH_PROGRESS_STORE = "path-progress";
const ACTIVITY_EVIDENCE_STORE = "activity-evidence";
const PROJECT_TRACKING_STORE = "project-tracking";
const ASSESSMENT_STORE = "assessment-gates";
const DAILY_SNAPSHOT_STORE = "daily-snapshots";
export const PROGRESS_SCHEMA_VERSION = 1;
export const EVIDENCE_SCHEMA_VERSION = 1;
export const PROJECT_SCHEMA_VERSION = 1;
export const ASSESSMENT_SCHEMA_VERSION = 1;
export const SNAPSHOT_SCHEMA_VERSION = 1;

export interface PathProgressRecord extends LearningProgress {
  schemaVersion: typeof PROGRESS_SCHEMA_VERSION;
  pathId: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface ActivityEvidenceRecord {
  schemaVersion: typeof EVIDENCE_SCHEMA_VERSION;
  activityId: string;
  pathId: string;
  notes: string;
  links: string[];
  outcome: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = "not-started" | "active" | "blocked" | "ready-for-review" | "completed";

export interface ProjectTrackingRecord {
  schemaVersion: typeof PROJECT_SCHEMA_VERSION;
  pathId: string;
  status: ProjectStatus;
  objective: string;
  decisions: string;
  blocker: string;
  completionNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentGateRecord {
  schemaVersion: typeof ASSESSMENT_SCHEMA_VERSION;
  pathId: string;
  satisfiedCriteria: string[];
  reviewerNotes: string;
  ready: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailySnapshotRecord {
  schemaVersion: typeof SNAPSHOT_SCHEMA_VERSION;
  dateKey: string;
  createdAt: string;
  backup: unknown;
}

function isBrowser() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDatabase(): Promise<IDBDatabase> {
  if (!isBrowser()) {
    return Promise.reject(new Error("IndexedDB is only available in the browser."));
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(PATH_PROGRESS_STORE)) {
        database.createObjectStore(PATH_PROGRESS_STORE, { keyPath: "pathId" });
      }
      if (!database.objectStoreNames.contains(ACTIVITY_EVIDENCE_STORE)) {
        const store = database.createObjectStore(ACTIVITY_EVIDENCE_STORE, { keyPath: "activityId" });
        store.createIndex("pathId", "pathId", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
      if (!database.objectStoreNames.contains(PROJECT_TRACKING_STORE)) {
        const store = database.createObjectStore(PROJECT_TRACKING_STORE, { keyPath: "pathId" });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
      if (!database.objectStoreNames.contains(ASSESSMENT_STORE)) {
        const store = database.createObjectStore(ASSESSMENT_STORE, { keyPath: "pathId" });
        store.createIndex("ready", "ready", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
      if (!database.objectStoreNames.contains(DAILY_SNAPSHOT_STORE)) {
        const store = database.createObjectStore(DAILY_SNAPSHOT_STORE, { keyPath: "dateKey" });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Unable to open TSA progress database."));
  });
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);
    const request = operation(transaction.objectStore(storeName));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("TSA storage operation failed."));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("TSA storage transaction failed."));
    };
  });
}

export function getPathProgress(pathId: string) {
  return withStore<PathProgressRecord | undefined>(PATH_PROGRESS_STORE, "readonly", (store) => store.get(pathId));
}

export function getAllPathProgress() {
  return withStore<PathProgressRecord[]>(PATH_PROGRESS_STORE, "readonly", (store) => store.getAll());
}

export function putPathProgress(record: PathProgressRecord) {
  return withStore<IDBValidKey>(PATH_PROGRESS_STORE, "readwrite", (store) => store.put(record));
}

export function clearAllPathProgress() {
  return withStore<undefined>(PATH_PROGRESS_STORE, "readwrite", (store) => store.clear());
}

export function getActivityEvidence(activityId: string) {
  return withStore<ActivityEvidenceRecord | undefined>(ACTIVITY_EVIDENCE_STORE, "readonly", (store) => store.get(activityId));
}

export function getAllActivityEvidence() {
  return withStore<ActivityEvidenceRecord[]>(ACTIVITY_EVIDENCE_STORE, "readonly", (store) => store.getAll());
}

export function putActivityEvidence(record: ActivityEvidenceRecord) {
  return withStore<IDBValidKey>(ACTIVITY_EVIDENCE_STORE, "readwrite", (store) => store.put(record));
}

export function clearAllActivityEvidence() {
  return withStore<undefined>(ACTIVITY_EVIDENCE_STORE, "readwrite", (store) => store.clear());
}

export function getProjectTracking(pathId: string) {
  return withStore<ProjectTrackingRecord | undefined>(PROJECT_TRACKING_STORE, "readonly", (store) => store.get(pathId));
}

export function getAllProjectTracking() {
  return withStore<ProjectTrackingRecord[]>(PROJECT_TRACKING_STORE, "readonly", (store) => store.getAll());
}

export function putProjectTracking(record: ProjectTrackingRecord) {
  return withStore<IDBValidKey>(PROJECT_TRACKING_STORE, "readwrite", (store) => store.put(record));
}

export function clearAllProjectTracking() {
  return withStore<undefined>(PROJECT_TRACKING_STORE, "readwrite", (store) => store.clear());
}

export function getAssessmentGate(pathId: string) {
  return withStore<AssessmentGateRecord | undefined>(ASSESSMENT_STORE, "readonly", (store) => store.get(pathId));
}

export function getAllAssessmentGates() {
  return withStore<AssessmentGateRecord[]>(ASSESSMENT_STORE, "readonly", (store) => store.getAll());
}

export function putAssessmentGate(record: AssessmentGateRecord) {
  return withStore<IDBValidKey>(ASSESSMENT_STORE, "readwrite", (store) => store.put(record));
}

export function clearAllAssessmentGates() {
  return withStore<undefined>(ASSESSMENT_STORE, "readwrite", (store) => store.clear());
}

export function getDailySnapshot(dateKey: string) {
  return withStore<DailySnapshotRecord | undefined>(DAILY_SNAPSHOT_STORE, "readonly", (store) => store.get(dateKey));
}

export function getAllDailySnapshots() {
  return withStore<DailySnapshotRecord[]>(DAILY_SNAPSHOT_STORE, "readonly", (store) => store.getAll());
}

export function putDailySnapshot(record: DailySnapshotRecord) {
  return withStore<IDBValidKey>(DAILY_SNAPSHOT_STORE, "readwrite", (store) => store.put(record));
}

export function deleteDailySnapshot(dateKey: string) {
  return withStore<undefined>(DAILY_SNAPSHOT_STORE, "readwrite", (store) => store.delete(dateKey));
}

export function clearAllDailySnapshots() {
  return withStore<undefined>(DAILY_SNAPSHOT_STORE, "readwrite", (store) => store.clear());
}

export async function clearAllAcademyData() {
  await Promise.all([
    clearAllPathProgress(),
    clearAllActivityEvidence(),
    clearAllProjectTracking(),
    clearAllAssessmentGates(),
  ]);
}

export async function clearAllAcademyStorage() {
  await Promise.all([
    clearAllAcademyData(),
    clearAllDailySnapshots(),
  ]);
}

export function pathActivityIds(path: LearningPath) {
  return path.lessons.flatMap((lesson) => lesson.activities.map((activity) => activity.id));
}

export function isPathComplete(path: LearningPath, progress: LearningProgress) {
  const activityIds = pathActivityIds(path);
  return activityIds.length > 0 && activityIds.every((id) => progress.completedActivityIds.includes(id));
}

export async function migrateLegacyLocalStorage(paths: LearningPath[]) {
  if (!isBrowser()) return 0;

  let migrated = 0;

  for (const path of paths) {
    const legacyKey = `tsa:${path.id}:progress`;
    const raw = window.localStorage.getItem(legacyKey);
    if (!raw) continue;

    try {
      const progress = JSON.parse(raw) as LearningProgress;
      if (!progress.currentActivityId || !Array.isArray(progress.completedActivityIds)) {
        continue;
      }

      const existing = await getPathProgress(path.id);
      if (!existing) {
        const now = new Date().toISOString();
        await putPathProgress({
          ...progress,
          reflectionResponses: progress.reflectionResponses ?? {},
          schemaVersion: PROGRESS_SCHEMA_VERSION,
          pathId: path.id,
          startedAt: now,
          updatedAt: now,
          completedAt: isPathComplete(path, progress) ? now : undefined,
        });
        migrated += 1;
      }

      window.localStorage.removeItem(legacyKey);
    } catch {
      // Keep unreadable legacy data untouched so a future recovery path can inspect it.
    }
  }

  return migrated;
}

export async function requestPersistentStorage() {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) return false;

  try {
    if (await navigator.storage.persisted?.()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
