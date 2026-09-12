"use client";

import { useEffect } from "react";
import { ensureDailySnapshot } from "../lib/daily-snapshots";
import { useAcademyProgress } from "./academy-progress-provider";

export function AcademyDailySnapshotRunner() {
  const { ready } = useAcademyProgress();

  useEffect(() => {
    if (!ready) return;
    void ensureDailySnapshot().catch(() => {
      // Recovery snapshots are best-effort and must never block the academy UI.
    });
  }, [ready]);

  return null;
}
