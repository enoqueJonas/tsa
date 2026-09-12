"use client";

import { useEffect, useState } from "react";
import {
  EVIDENCE_SCHEMA_VERSION,
  getActivityEvidence,
  putActivityEvidence,
} from "../lib/progress-storage";

interface ActivityEvidencePanelProps {
  activityId: string;
  pathId: string;
  deliverables: string[];
}

export function ActivityEvidencePanel({ activityId, pathId, deliverables }: ActivityEvidencePanelProps) {
  const [notes, setNotes] = useState("");
  const [linksText, setLinksText] = useState("");
  const [outcome, setOutcome] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setSaved(false);

    getActivityEvidence(activityId)
      .then((record) => {
        if (cancelled) return;
        setNotes(record?.notes ?? "");
        setLinksText(record?.links.join("\n") ?? "");
        setOutcome(record?.outcome ?? "");
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [activityId]);

  async function save() {
    const previous = await getActivityEvidence(activityId);
    const now = new Date().toISOString();
    const links = linksText
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    await putActivityEvidence({
      schemaVersion: EVIDENCE_SCHEMA_VERSION,
      activityId,
      pathId,
      notes: notes.trim(),
      links,
      outcome: outcome.trim(),
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
    });
    setSaved(true);
  }

  if (!loaded) {
    return <div className="mt-8 text-sm text-zinc-500">Loading evidence workspace…</div>;
  }

  return (
    <section className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Evidence workspace</p>
          <h3 className="mt-2 text-xl font-semibold text-zinc-950">Preserve what proves the work.</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Capture the artifacts, observations, and outcome that demonstrate you completed this practical activity.
          </p>
        </div>
        {saved && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Saved locally</span>}
      </div>

      {deliverables.length > 0 && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm font-semibold text-zinc-900">Expected deliverables</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {deliverables.map((deliverable) => <li key={deliverable}>• {deliverable}</li>)}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Evidence notes
          <textarea
            value={notes}
            onChange={(event) => { setNotes(event.target.value); setSaved(false); }}
            rows={6}
            placeholder="What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions."
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal leading-6 outline-none focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Artifact links
          <textarea
            value={linksText}
            onChange={(event) => { setLinksText(event.target.value); setSaved(false); }}
            rows={3}
            placeholder="One URL per line: repository, commit, PR, diagram, document, log, screenshot reference…"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal leading-6 outline-none focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Outcome / explanation
          <textarea
            value={outcome}
            onChange={(event) => { setOutcome(event.target.value); setSaved(false); }}
            rows={4}
            placeholder="What was the result? What did the evidence prove, and what would you do differently next time?"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal leading-6 outline-none focus:border-zinc-500"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">Stored only in this browser for Platform v1.</p>
        <button
          type="button"
          onClick={() => void save()}
          className="rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Save evidence
        </button>
      </div>
    </section>
  );
}
