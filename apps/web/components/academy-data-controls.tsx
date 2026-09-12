"use client";

import { useState } from "react";
import { useAcademyProgress } from "./academy-progress-provider";

export function AcademyDataControls() {
  const { records, resetAcademyProgress } = useAcademyProgress();
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string>();
  const hasProgress = Object.keys(records).length > 0;

  async function resetProgress() {
    const confirmed = window.confirm(
      "Reset all TSA learning progress stored in this browser? This will remove started modules, completed activities, and saved reflections."
    );

    if (!confirmed) return;

    setResetting(true);
    setMessage(undefined);

    try {
      await resetAcademyProgress();
      setMessage("Local academy progress has been reset.");
    } catch {
      setMessage("TSA could not reset the local progress database.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Local academy data</p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-950">Browser storage controls</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            TSA currently stores learning progress and reflection responses locally in this browser using IndexedDB. Resetting removes those records without changing the curriculum.
          </p>
        </div>
        <button
          type="button"
          onClick={resetProgress}
          disabled={!hasProgress || resetting}
          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400 disabled:hover:bg-transparent"
        >
          {resetting ? "Resetting…" : "Reset local progress"}
        </button>
      </div>
      {message ? <p className="mt-4 text-sm text-zinc-600" role="status">{message}</p> : null}
    </section>
  );
}
