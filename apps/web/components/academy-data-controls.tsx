"use client";

import { useRef, useState } from "react";
import { createAcademyBackup, parseAcademyBackup, restoreAcademyBackup } from "../lib/academy-backup";
import { useAcademyProgress } from "./academy-progress-provider";

export function AcademyDataControls() {
  const { records, resetAcademyProgress } = useAcademyProgress();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasProgress = Object.keys(records).length > 0;

  async function resetProgress() {
    const confirmed = window.confirm(
      "Reset all TSA learner data stored in this browser? This removes progress, reflections, evidence, projects, and assessments."
    );

    if (!confirmed) return;

    setBusy(true);
    setMessage(undefined);

    try {
      await resetAcademyProgress();
      setMessage("Local academy data has been reset.");
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
        "Restore this TSA backup? Existing local academy data will be replaced by the contents of the backup."
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

  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Local academy data</p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-950">Browser storage controls</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            TSA currently stores learner state locally in IndexedDB. Export a JSON backup before clearing browser data or moving to another browser, and restore it later without a server account.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void exportBackup()} disabled={busy} className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400">Export backup</button>
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={busy} className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400">Restore backup</button>
          <button type="button" onClick={() => void resetProgress()} disabled={!hasProgress || busy} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 disabled:hover:bg-transparent">Reset local data</button>
          <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importBackup(file); }} />
        </div>
      </div>
      {message ? <p className="mt-4 text-sm text-zinc-600" role="status">{message}</p> : null}
    </section>
  );
}
