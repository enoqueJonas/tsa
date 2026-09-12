"use client";

import { useEffect, useMemo, useState } from "react";
import { technicalStewardshipJourney } from "@tsa/runtime-kernel";
import {
  ASSESSMENT_SCHEMA_VERSION,
  getAllAssessmentGates,
  putAssessmentGate,
  type AssessmentGateRecord,
} from "../lib/progress-storage";

function assessablePaths() {
  return technicalStewardshipJourney.schools.flatMap((school) =>
    school.paths
      .map((path) => {
        const criteria = path.lessons.flatMap((lesson) =>
          lesson.activities.flatMap((activity) => activity.content.type === "practical" ? activity.content.completionCriteria : [])
        );
        return { school, path, criteria: [...new Set(criteria)] };
      })
      .filter((entry) => entry.criteria.length > 0)
  );
}

export function AssessmentCenter() {
  const entries = useMemo(() => assessablePaths(), []);
  const [records, setRecords] = useState<Record<string, AssessmentGateRecord>>({});
  const [selectedPathId, setSelectedPathId] = useState(entries[0]?.path.id ?? "");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getAllAssessmentGates()
      .then((stored) => setRecords(Object.fromEntries(stored.map((record) => [record.pathId, record]))))
      .finally(() => setReady(true));
  }, []);

  const selected = entries.find(({ path }) => path.id === selectedPathId);
  const current = selected ? records[selected.path.id] : undefined;
  const satisfied = new Set(current?.satisfiedCriteria ?? []);

  async function save(satisfiedCriteria: string[], reviewerNotes = current?.reviewerNotes ?? "") {
    if (!selected) return;
    const now = new Date().toISOString();
    const previous = records[selected.path.id];
    const record: AssessmentGateRecord = {
      schemaVersion: ASSESSMENT_SCHEMA_VERSION,
      pathId: selected.path.id,
      satisfiedCriteria,
      reviewerNotes,
      ready: selected.criteria.length > 0 && selected.criteria.every((criterion) => satisfiedCriteria.includes(criterion)),
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
    };
    setRecords((state) => ({ ...state, [selected.path.id]: record }));
    await putAssessmentGate(record);
  }

  if (!ready) return <p className="text-sm text-zinc-500">Loading assessment gates…</p>;

  const readyCount = Object.values(records).filter((record) => record.ready).length;

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">Assessment gates</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Prove readiness before moving on.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Use the curriculum’s authored completion criteria as explicit gates. Unchecked criteria remain visible work, not hidden assumptions.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5"><p className="text-3xl font-semibold">{entries.length}</p><p className="mt-1 text-sm text-zinc-500">Assessable paths</p></div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5"><p className="text-3xl font-semibold">{readyCount}</p><p className="mt-1 text-sm text-zinc-500">Ready gates</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="space-y-1">{entries.map(({ school, path, criteria }) => {
            const record = records[path.id];
            const complete = record?.ready ?? false;
            return <button key={path.id} type="button" onClick={() => setSelectedPathId(path.id)} className={selectedPathId === path.id ? "w-full rounded-xl bg-zinc-950 px-4 py-3 text-left text-white" : "w-full rounded-xl px-4 py-3 text-left hover:bg-zinc-50"}><p className="text-xs opacity-60">{school.title}</p><p className="mt-1 text-sm font-semibold">{path.title}</p><p className="mt-1 text-xs opacity-60">{complete ? "Ready" : `${record?.satisfiedCriteria.length ?? 0}/${criteria.length} criteria`}</p></button>;
          })}</div>
        </aside>

        {selected && <article className="rounded-2xl border border-zinc-200 bg-white p-7">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">{selected.school.title}</p><h2 className="mt-2 text-2xl font-semibold">{selected.path.title}</h2></div><span className={current?.ready ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800" : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"}>{current?.ready ? "Gate passed" : "Evidence incomplete"}</span></div>
          <div className="mt-7 space-y-3">{selected.criteria.map((criterion) => <label key={criterion} className="flex gap-3 rounded-xl border border-zinc-200 p-4 text-sm leading-6"><input type="checkbox" checked={satisfied.has(criterion)} onChange={(event) => { const next = new Set(satisfied); if (event.target.checked) next.add(criterion); else next.delete(criterion); void save([...next]); }} className="mt-1 h-4 w-4" /><span>{criterion}</span></label>)}</div>
          <label className="mt-6 grid gap-2 text-sm font-medium">Assessment notes<textarea value={current?.reviewerNotes ?? ""} onChange={(event) => void save(current?.satisfiedCriteria ?? [], event.target.value)} rows={5} placeholder="What evidence supports this assessment? What remains weak or uncertain?" className="rounded-xl border border-zinc-300 px-4 py-3 font-normal leading-6" /></label>
          <p className="mt-5 text-xs text-zinc-500">The gate becomes ready only when every authored criterion is satisfied.</p>
        </article>}
      </div>
    </section>
  );
}
