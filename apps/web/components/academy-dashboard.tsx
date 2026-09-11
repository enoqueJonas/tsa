"use client";

import { technicalStewardshipJourney, type LearningPath, type School } from "@tsa/runtime-kernel";
import { useAcademyProgress } from "./academy-progress-provider";

interface AcademyDashboardProps {
  onOpenCurriculum(): void;
  onOpenPath(path: LearningPath, school: School): void;
}

function allActivities(path: LearningPath) {
  return path.lessons.flatMap((lesson) => lesson.activities);
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function AcademyDashboard({ onOpenCurriculum, onOpenPath }: AcademyDashboardProps) {
  const journey = technicalStewardshipJourney;
  const { ready, records, pathStatus, pathPercent, lastVisited } = useAcademyProgress();
  const paths = journey.schools.flatMap((school) => school.paths.map((path) => ({ school, path })));
  const last = lastVisited();
  const lastEntry = last ? paths.find(({ path }) => path.id === last.pathId) : undefined;

  const totalActivities = paths.reduce((total, { path }) => total + allActivities(path).length, 0);
  const completedActivityIds = new Set(Object.values(records).flatMap((record) => record.completedActivityIds));
  const completedActivities = paths.reduce(
    (total, { path }) => total + allActivities(path).filter((activity) => completedActivityIds.has(activity.id)).length,
    0
  );
  const overallPercent = totalActivities ? Math.round((completedActivities / totalActivities) * 100) : 0;
  const completedModules = paths.filter(({ path }) => pathStatus(path) === "completed").length;
  const inProgressModules = paths.filter(({ path }) => pathStatus(path) === "in-progress").length;
  const completedSchools = journey.schools.filter((school) => school.paths.every((path) => pathStatus(path) === "completed")).length;

  const totalMinutes = paths.reduce((total, { path }) => total + allActivities(path).reduce((sum, activity) => sum + activity.estimatedMinutes, 0), 0);
  const completedMinutes = paths.reduce(
    (total, { path }) => total + allActivities(path).filter((activity) => completedActivityIds.has(activity.id)).reduce((sum, activity) => sum + activity.estimatedMinutes, 0),
    0
  );

  const recent = Object.values(records)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4)
    .map((record) => ({ record, entry: paths.find(({ path }) => path.id === record.pathId) }))
    .filter((item): item is typeof item & { entry: { school: School; path: LearningPath } } => Boolean(item.entry));

  return (
    <section className={ready ? "opacity-100" : "opacity-70"}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        <article className="rounded-3xl bg-zinc-950 p-8 text-white shadow-sm lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Continue learning</p>
          {lastEntry ? (
            <>
              <p className="mt-6 text-sm font-medium text-blue-300">{lastEntry.school.title}</p>
              <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight lg:text-4xl">{lastEntry.path.title}</h2>
              <p className="mt-4 max-w-2xl text-zinc-400">Resume exactly where you left off. Your progress and reflections are stored locally in the academy database.</p>
              <div className="mt-7 h-2 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-white" style={{ width: `${pathPercent(lastEntry.path)}%` }} /></div>
              <div className="mt-3 flex items-center justify-between text-sm text-zinc-400"><span>{pathPercent(lastEntry.path)}% complete</span><span>{last.completedActivityIds.length} activities completed</span></div>
              <button type="button" onClick={() => onOpenPath(lastEntry.path, lastEntry.school)} className="mt-8 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200">Continue learning</button>
            </>
          ) : (
            <>
              <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight lg:text-4xl">Start your Technical Stewardship journey.</h2>
              <p className="mt-4 max-w-2xl text-zinc-400">Your dashboard will become your learning cockpit as soon as you begin the first module.</p>
              <button type="button" onClick={onOpenCurriculum} className="mt-8 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200">Explore curriculum</button>
            </>
          )}
        </article>

        <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-end justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Academy progress</p><p className="mt-3 text-5xl font-semibold tracking-tight text-zinc-950">{overallPercent}%</p></div><p className="text-sm text-zinc-500">{completedActivities} / {totalActivities}<br />activities</p></div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-zinc-950" style={{ width: `${overallPercent}%` }} /></div>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-6">
            <div><p className="text-2xl font-semibold text-zinc-950">{completedModules}</p><p className="mt-1 text-sm text-zinc-500">Modules completed</p></div>
            <div><p className="text-2xl font-semibold text-zinc-950">{completedSchools}</p><p className="mt-1 text-sm text-zinc-500">Schools completed</p></div>
            <div><p className="text-2xl font-semibold text-zinc-950">{inProgressModules}</p><p className="mt-1 text-sm text-zinc-500">In progress</p></div>
            <div><p className="text-2xl font-semibold text-zinc-950">{formatMinutes(completedMinutes)}</p><p className="mt-1 text-sm text-zinc-500">Learning completed</p></div>
          </div>
        </article>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <article className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">The journey</p><h2 className="mt-2 text-2xl font-semibold text-zinc-950">12 schools. One apprenticeship.</h2></div><button type="button" onClick={onOpenCurriculum} className="text-sm font-semibold text-blue-700 hover:text-blue-900">View curriculum →</button></div>
          <div className="mt-6 space-y-3">
            {journey.schools.map((school, index) => {
              const schoolActivities = school.paths.flatMap((path) => allActivities(path));
              const completed = schoolActivities.filter((activity) => completedActivityIds.has(activity.id)).length;
              const percent = schoolActivities.length ? Math.round((completed / schoolActivities.length) * 100) : 0;
              const status = percent === 100 ? "Completed" : percent > 0 ? "In progress" : "Not started";
              return <button key={school.id} type="button" onClick={() => onOpenPath(school.paths[0], school)} className="grid w-full grid-cols-[38px_minmax(0,1fr)_110px] items-center gap-4 rounded-2xl px-3 py-3 text-left transition hover:bg-zinc-50"><span className="text-sm tabular-nums text-zinc-400">{String(index + 1).padStart(2, "0")}</span><div><div className="flex items-center justify-between gap-4"><span className="font-medium text-zinc-900">{school.title}</span><span className="text-xs text-zinc-500">{status}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-zinc-900" style={{ width: `${percent}%` }} /></div></div><span className="text-right text-sm tabular-nums text-zinc-500">{percent}%</span></button>;
            })}
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Learning time</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{formatMinutes(completedMinutes)}</p>
            <p className="mt-2 text-sm text-zinc-500">of approximately {formatMinutes(totalMinutes)} authored learning time completed.</p>
          </article>

          <article className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Recent activity</p>
            <div className="mt-5 space-y-4">
              {recent.length ? recent.map(({ record, entry }) => (
                <button key={record.pathId} type="button" onClick={() => onOpenPath(entry.path, entry.school)} className="block w-full text-left">
                  <p className="text-sm font-medium text-zinc-900">{entry.path.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{entry.school.title} · {pathPercent(entry.path)}%</p>
                </button>
              )) : <p className="text-sm text-zinc-500">No learning activity yet.</p>}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
