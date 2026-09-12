"use client";

import { useEffect, useMemo, useState } from "react";
import { technicalStewardshipJourney } from "@tsa/runtime-kernel";
import {
  PROJECT_SCHEMA_VERSION,
  getAllProjectTracking,
  putProjectTracking,
  type ProjectStatus,
  type ProjectTrackingRecord,
} from "../lib/progress-storage";

const statusLabels: Record<ProjectStatus, string> = {
  "not-started": "Not started",
  active: "Active",
  blocked: "Blocked",
  "ready-for-review": "Ready for review",
  completed: "Completed",
};

function projectPaths() {
  return technicalStewardshipJourney.schools.flatMap((school) =>
    school.paths
      .filter((path) => path.lessons.some((lesson) => lesson.activities.some((activity) => activity.content.type === "practical")))
      .map((path) => ({ school, path }))
  );
}

export function ProjectMilestoneTracker() {
  const entries = useMemo(() => projectPaths(), []);
  const [records, setRecords] = useState<Record<string, ProjectTrackingRecord>>({});
  const [selectedPathId, setSelectedPathId] = useState(entries[0]?.path.id ?? "");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getAllProjectTracking()
      .then((stored) => setRecords(Object.fromEntries(stored.map((record) => [record.pathId, record]))))
      .finally(() => setReady(true));
  }, []);

  const selected = entries.find(({ path }) => path.id === selectedPathId);
  const record = selected ? records[selected.path.id] : undefined;

  async function patch(values: Partial<Omit<ProjectTrackingRecord, "schemaVersion" | "pathId" | "createdAt" | "updatedAt">>) {
    if (!selected) return;
    const now = new Date().toISOString();
    const previous = records[selected.path.id];
    const next: ProjectTrackingRecord = {
      schemaVersion: PROJECT_SCHEMA_VERSION,
      pathId: selected.path.id,
      status: previous?.status ?? "not-started",
      objective: previous?.objective ?? "",
      decisions: previous?.decisions ?? "",
      blocker: previous?.blocker ?? "",
      completionNotes: previous?.completionNotes ?? "",
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
      ...values,
    };
    setRecords((current) => ({ ...current, [selected.path.id]: next }));
    await putProjectTracking(next);
  }

  if (!ready) return <p className="text-sm text-zinc-500">Loading project workspace…</p>;

  const activeCount = Object.values(records).filter((item) => item.status === "active" || item.status === "blocked" || item.status === "ready-for-review").length;
  const completedCount = Object.values(records).filter((item) => item.status === "completed").length;

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">Projects & milestones</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Turn practical work into managed engineering outcomes.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Track objective, status, decisions, blockers, and completion notes for curriculum paths that contain practical engineering work.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5"><p className="text-3xl font-semibold">{entries.length}</p><p className="mt-1 text-sm text-zinc-500">Practical paths</p></div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5"><p className="text-3xl font-semibold">{activeCount}</p><p className="mt-1 text-sm text-zinc-500">Active / blocked / review</p></div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5"><p className="text-3xl font-semibold">{completedCount}</p><p className="mt-1 text-sm text-zinc-500">Completed projects</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="space-y-1">
            {entries.map(({ school, path }) => {
              const status = records[path.id]?.status ?? "not-started";
              return (
                <button key={path.id} type="button" onClick={() => setSelectedPathId(path.id)} className={selectedPathId === path.id ? "w-full rounded-xl bg-zinc-950 px-4 py-3 text-left text-white" : "w-full rounded-xl px-4 py-3 text-left hover:bg-zinc-50"}>
                  <p className="text-xs opacity-60">{school.title}</p>
                  <p className="mt-1 text-sm font-semibold">{path.title}</p>
                  <p className="mt-1 text-xs opacity-60">{statusLabels[status]}</p>
                </button>
              );
            })}
          </div>
        </aside>

        {selected && (
          <article className="rounded-2xl border border-zinc-200 bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">{selected.school.title}</p>
            <h2 className="mt-2 text-2xl font-semibold">{selected.path.title}</h2>

            <div className="mt-7 grid gap-5">
              <label className="grid gap-2 text-sm font-medium">Status
                <select value={record?.status ?? "not-started"} onChange={(event) => void patch({ status: event.target.value as ProjectStatus })} className="rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal">
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">Objective
                <textarea value={record?.objective ?? ""} onChange={(event) => void patch({ objective: event.target.value })} rows={4} placeholder="What engineering outcome are you trying to produce?" className="rounded-xl border border-zinc-300 px-4 py-3 font-normal leading-6" />
              </label>
              <label className="grid gap-2 text-sm font-medium">Decisions and trade-offs
                <textarea value={record?.decisions ?? ""} onChange={(event) => void patch({ decisions: event.target.value })} rows={5} placeholder="Record important design, implementation, tooling, and operational decisions." className="rounded-xl border border-zinc-300 px-4 py-3 font-normal leading-6" />
              </label>
              <label className="grid gap-2 text-sm font-medium">Current blocker
                <textarea value={record?.blocker ?? ""} onChange={(event) => void patch({ blocker: event.target.value })} rows={3} placeholder="What is preventing the next meaningful step?" className="rounded-xl border border-zinc-300 px-4 py-3 font-normal leading-6" />
              </label>
              <label className="grid gap-2 text-sm font-medium">Completion notes
                <textarea value={record?.completionNotes ?? ""} onChange={(event) => void patch({ completionNotes: event.target.value })} rows={4} placeholder="What was delivered, what remains, and what did you learn?" className="rounded-xl border border-zinc-300 px-4 py-3 font-normal leading-6" />
              </label>
            </div>
            <p className="mt-5 text-xs text-zinc-500">Changes are saved locally as you type.</p>
          </article>
        )}
      </div>
    </section>
  );
}
