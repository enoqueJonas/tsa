"use client";

import { useEffect, useMemo, useState } from "react";
import { technicalStewardshipJourney } from "@tsa/runtime-kernel";
import { getAllActivityEvidence, type ActivityEvidenceRecord } from "../lib/progress-storage";

type SubmissionStatus = "draft" | "ready" | "accepted";
type EvidenceWithStatus = ActivityEvidenceRecord & { submissionStatus?: SubmissionStatus };

function activityLookup() {
  return Object.fromEntries(
    technicalStewardshipJourney.schools.flatMap((school) =>
      school.paths.flatMap((path) =>
        path.lessons.flatMap((lesson) =>
          lesson.activities.map((activity) => [activity.id, { school, path, lesson, activity }])
        )
      )
    )
  );
}

export function EvidencePortfolio() {
  const lookup = useMemo(() => activityLookup(), []);
  const [records, setRecords] = useState<EvidenceWithStatus[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | SubmissionStatus>("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getAllActivityEvidence()
      .then((stored) => setRecords(stored as EvidenceWithStatus[]))
      .finally(() => setReady(true));
  }, []);

  const filtered = useMemo(() => records
    .filter((record) => status === "all" || (record.submissionStatus ?? "draft") === status)
    .filter((record) => {
      const entry = lookup[record.activityId];
      const haystack = [
        entry?.school.title,
        entry?.path.title,
        entry?.lesson.title,
        entry?.activity.title,
        record.notes,
        record.outcome,
        ...record.links,
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [lookup, query, records, status]);

  if (!ready) return <p className="text-sm text-zinc-500">Loading evidence portfolio…</p>;

  const accepted = records.filter((record) => (record.submissionStatus ?? "draft") === "accepted").length;
  const readyForReview = records.filter((record) => record.submissionStatus === "ready").length;

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">Evidence portfolio</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">The work behind the progress.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Search the artifacts, explanations, investigations, and engineering outcomes you preserved while working through TSA.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5"><p className="text-3xl font-semibold">{records.length}</p><p className="mt-1 text-sm text-zinc-500">Evidence records</p></div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5"><p className="text-3xl font-semibold">{readyForReview}</p><p className="mt-1 text-sm text-zinc-500">Ready for review</p></div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5"><p className="text-3xl font-semibold">{accepted}</p><p className="mt-1 text-sm text-zinc-500">Accepted</p></div>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search activity, project, notes, outcome, or artifact URL…" className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-500" />
        <select value={status} onChange={(event) => setStatus(event.target.value as "all" | SubmissionStatus)} className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm">
          <option value="all">All submission states</option>
          <option value="draft">Draft</option>
          <option value="ready">Ready</option>
          <option value="accepted">Accepted</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">No evidence matches this view yet.</div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {filtered.map((record) => {
            const entry = lookup[record.activityId];
            const state = record.submissionStatus ?? "draft";
            return <article key={record.activityId} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">{entry?.school.title ?? "TSA"}</p><h2 className="mt-2 text-xl font-semibold">{entry?.activity.title ?? record.activityId}</h2><p className="mt-1 text-sm text-zinc-500">{entry?.path.title}</p></div><span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold capitalize text-zinc-700">{state}</span></div>
              {record.notes && <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Evidence notes</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{record.notes}</p></div>}
              {record.outcome && <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Outcome</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{record.outcome}</p></div>}
              {record.links.length > 0 && <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Artifacts</p><div className="mt-2 space-y-2">{record.links.map((link) => <a key={link} href={link} target="_blank" rel="noreferrer" className="block break-all text-sm font-medium text-blue-700 hover:text-blue-900">{link}</a>)}</div></div>}
              <p className="mt-6 border-t border-zinc-100 pt-4 text-xs text-zinc-400">Updated {new Date(record.updatedAt).toLocaleString()}</p>
            </article>;
          })}
        </div>
      )}
    </section>
  );
}
