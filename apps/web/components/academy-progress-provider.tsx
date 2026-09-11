"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  technicalStewardshipJourney,
  type LearningPath,
  type LearningProgress,
} from "@tsa/runtime-kernel";
import {
  getAllPathProgress,
  isPathComplete,
  migrateLegacyLocalStorage,
  pathActivityIds,
  PROGRESS_SCHEMA_VERSION,
  putPathProgress,
  requestPersistentStorage,
  type PathProgressRecord,
} from "../lib/progress-storage";

export type PathStatus = "not-started" | "in-progress" | "completed";

interface AcademyProgressContextValue {
  ready: boolean;
  records: Record<string, PathProgressRecord>;
  progressForPath(pathId: string): PathProgressRecord | undefined;
  pathStatus(path: LearningPath): PathStatus;
  pathPercent(path: LearningPath): number;
  savePathProgress(path: LearningPath, progress: LearningProgress): Promise<void>;
  lastVisited(): PathProgressRecord | undefined;
}

const AcademyProgressContext = createContext<AcademyProgressContextValue | null>(null);

function allPaths() {
  return technicalStewardshipJourney.schools.flatMap((school) => school.paths);
}

export function AcademyProgressProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [records, setRecords] = useState<Record<string, PathProgressRecord>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const paths = allPaths();
      await migrateLegacyLocalStorage(paths);
      await requestPersistentStorage();
      const stored = await getAllPathProgress();
      if (cancelled) return;

      setRecords(Object.fromEntries(stored.map((record) => [record.pathId, record])));
      setReady(true);
    }

    load().catch(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const savePathProgress = useCallback(
    async (path: LearningPath, progress: LearningProgress) => {
      const now = new Date().toISOString();
      const previous = records[path.id];
      const complete = isPathComplete(path, progress);
      const record: PathProgressRecord = {
        ...progress,
        reflectionResponses: progress.reflectionResponses ?? {},
        schemaVersion: PROGRESS_SCHEMA_VERSION,
        pathId: path.id,
        startedAt: previous?.startedAt ?? now,
        updatedAt: now,
        completedAt: complete ? previous?.completedAt ?? now : undefined,
      };

      setRecords((current) => ({ ...current, [path.id]: record }));
      await putPathProgress(record);
    },
    [records]
  );

  const value = useMemo<AcademyProgressContextValue>(() => ({
    ready,
    records,
    progressForPath(pathId) {
      return records[pathId];
    },
    pathStatus(path) {
      const record = records[path.id];
      if (!record) return "not-started";
      return isPathComplete(path, record) ? "completed" : "in-progress";
    },
    pathPercent(path) {
      const total = pathActivityIds(path).length;
      if (!total) return 0;
      const completed = records[path.id]?.completedActivityIds.length ?? 0;
      return Math.min(100, Math.round((completed / total) * 100));
    },
    savePathProgress,
    lastVisited() {
      return Object.values(records).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    },
  }), [ready, records, savePathProgress]);

  return <AcademyProgressContext.Provider value={value}>{children}</AcademyProgressContext.Provider>;
}

export function useAcademyProgress() {
  const context = useContext(AcademyProgressContext);
  if (!context) {
    throw new Error("useAcademyProgress must be used inside AcademyProgressProvider.");
  }
  return context;
}
