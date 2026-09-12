"use client";

import { useEffect, useRef, useState } from "react";
import { createAcademyBackup, parseAcademyBackup, restoreAcademyBackup } from "../lib/academy-backup";
import { DAILY_SNAPSHOT_RETENTION, latestDailySnapshot, restoreDailySnapshot } from "../lib/daily-snapshots";
import type { DailySnapshotRecord } from "../lib/progress-storage";
import { useAcademyProgress } from "./academy-progress-provider";

export function AcademyDataControls() {
  const { records, resetAcademyProgress } = useAcademyProgress();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();
  const [latestSnapshot, setLatestSnapshot] = useState<DailySnapshotRecord>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasProgress = Object.keys(records).length > 0;

  useEffect(() => {
    latestDailySnapshot().then(setLatestSnapshot).catch(() => undefined);
  }, [records]);

  async function resetProgress() {
    const confirmed = window.confirm(
      "Reset current TSA learner data stored in this browser? Progress, reflections, evidence, projects, and assessments will be removed. Daily recovery snapshots are kept."
    );

    if (!confirmed) return;

    setBusy(true);
    setMessage(undefined);

    try {
      await resetAcademyProgress();
      setMessage("Current academy data has been reset. Daily recovery snapshots were preserved.");
    } catch {
      setMessage("TSA could not reset the local academy database.");
    } finally {
      setBusy(false);
    }
  }

  async function exportBackup() {
    setBusy(true);
    setMessage(undefined);
    try {
      const backup = await createAcademyBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `tsa-academy-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage("Academy backup exported.");
    } catch {
      setMessage("TSA could not export the local academy data.");
    } finally {
      setBusy(false);
    }
  }

  async function importBackup(file: File) {
    setBusy(true);
    setMessage(undefined);
    try {
      const backup = parseAcademyBackup(await file.text());
      const confirmed = window.confirm(
        "Restore this TSA backup? Existing current academy data will be replaced by the contents of the backup."
      );
      if (!confirmed) return;
      await restoreAcademyBackup(backup);
      setMessage("Backup restored. Reloading TSA…");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "TSA could not restore this backup.");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function restoreLatestSnapshot() {
    if (!latestSnapshot) return;
    const confirmed = window.confirm(
      `Restore the automatic recovery snapshot from ${new Date(latestSnapshot.createdAt).toLocaleString()}? Current learner data will be replaced.`
    );
    if (!confirmed) return;

    setBusy(true);
    setMessage(undefined);
    try {
      await restoreDailySnapshot(latestSnapshot);
      setMessage("Daily recovery snapshot restored. Reloading TSA…");
      window.location.reload();
    } catch {
      setMessage("TSA could not restore the daily recovery snapshot.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Local academy data</p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-950">Browser storage controls</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            TSA stores learner state locally in IndexedDB. It also creates one silent recovery snapshot per day when the academy is opened and retains the latest {DAILY_SNAPSHOT_RETENTION} days. No file download or browser permission is required for these snapshots.
          </p>
          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            <span className="font-semibold text-zinc-900">Latest automatic snapshot: </span>
            {latestSnapshot ? new Date(latestSnapshot.createdAt).toLocaleString() : "None yet — TSA creates one after learner data exists."}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void restoreLatestSnapshot()} disabled={!latestSnapshot || busy} className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400">Restore latest snapshot</button>
          <button type="button" onClick={() => void exportBackup()} disabled={busy} className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400">Export JSON backup</button>
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={busy} className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400">Restore JSON backup</button>
          <button type="button" onClick={() => void resetProgress()} disabled={!hasProgress || busy} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 disabled:hover:bg-transparent">Reset current data</button>
          <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importBackup(file); }} />
        </div>
      </div>
      {message ? <p className="mt-4 text-sm text-zinc-600" role="status">{message}</p> : null}
    </section>
  );
}
