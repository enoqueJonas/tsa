import type { LearningPath, LearningProgress } from "@tsa/runtime-kernel";

const DATABASE_NAME = "tsa-academy";
const DATABASE_VERSION = 2;
const PATH_PROGRESS_STORE = "path-progress";
const ACTIVITY_EVIDENCE_STORE = "activity-evidence";
export const PROGRESS_SCHEMA_VERSION = 1;
export const EVIDENCE_SCHEMA_VERSION = 1;

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

export async function clearAllAcademyData() {
  await Promise.all([clearAllPathProgress(), clearAllActivityEvidence()]);
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
