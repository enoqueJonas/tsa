"use client";

import { useEffect, useState } from "react";
import { technicalStewardshipJourney, type LearningPath, type School } from "@tsa/runtime-kernel";
import { useAcademyProgress } from "./academy-progress-provider";
import { LearningExperience } from "./learning-experience";

function activityCount(path: LearningPath) {
  return path.lessons.reduce((total, lesson) => total + lesson.activities.length, 0);
}

function moduleMinutes(path: LearningPath) {
  return path.lessons.reduce((total, lesson) => total + lesson.activities.reduce((sum, activity) => sum + activity.estimatedMinutes, 0), 0);
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function ModuleOutline({ path, index, onStart }: { path: LearningPath; index: number; onStart: (path: LearningPath) => void }) {
  const { ready, pathStatus, pathPercent, progressForPath } = useAcademyProgress();
  const available = activityCount(path) > 0;
  const status = ready ? pathStatus(path) : "not-started";
  const percent = ready ? pathPercent(path) : 0;
  const completed = new Set(progressForPath(path.id)?.completedActivityIds ?? []);
  const label = status === "completed" ? "Review module" : status === "in-progress" ? "Continue module" : "Start module";
  const statusLabel = status === "completed" ? "Completed" : status === "in-progress" ? "In progress" : "Not started";

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="grid gap-5 border-b border-zinc-100 px-6 py-6 md:grid-cols-[56px_minmax(0,1fr)_auto] md:items-center lg:px-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-sm font-semibold tabular-nums text-zinc-500">{String(index + 1).padStart(2, "0")}</div>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-zinc-950">{path.title}</h3>
            <span className={status === "completed" ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700" : status === "in-progress" ? "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700" : "rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"}>{statusLabel}</span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">{path.lessons.length} lessons · {activityCount(path)} activities · {formatMinutes(moduleMinutes(path))}</p>
          {status !== "not-started" && <div className="mt-3 flex max-w-xl items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-zinc-950" style={{ width: `${percent}%` }} /></div><span className="text-xs tabular-nums text-zinc-500">{percent}%</span></div>}
        </div>
        {available ? <button type="button" onClick={() => onStart(path)} className="rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">{label}</button> : <span className="text-sm text-zinc-400">Not yet available</span>}
      </div>

      <ol className="divide-y divide-zinc-100">
        {path.lessons.map((lesson, lessonIndex) => {
          const lessonActivities = lesson.activities;
          const lessonCompleted = lessonActivities.length > 0 && lessonActivities.every((activity) => completed.has(activity.id));
          const lessonMinutes = lessonActivities.reduce((sum, activity) => sum + activity.estimatedMinutes, 0);
          return (
            <li key={lesson.id} className="grid gap-3 px-6 py-4 md:grid-cols-[56px_minmax(0,1fr)_auto] md:items-center lg:px-8">
              <span className="pl-1 text-xs tabular-nums text-zinc-400">{index + 1}.{lessonIndex + 1}</span>
              <div className="flex min-w-0 items-center gap-3">
                <span className={lessonCompleted ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700" : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-[10px] text-zinc-400"}>{lessonCompleted ? "✓" : ""}</span>
                <span className="font-medium text-zinc-900">{lesson.title}</span>
              </div>
              <span className="text-xs text-zinc-400">{lessonActivities.length} activities{lessonMinutes ? ` · ${formatMinutes(lessonMinutes)}` : ""}</span>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

function SchoolNavigation({ school, index, selected, onSelect }: { school: School; index: number; selected: boolean; onSelect: () => void }) {
  const { pathStatus } = useAcademyProgress();
  const complete = school.paths.length > 0 && school.paths.every((path) => pathStatus(path) === "completed");
  const active = school.paths.some((path) => pathStatus(path) === "in-progress");
  return (
    <button type="button" onClick={onSelect} className={selected ? "grid w-full grid-cols-[30px_1fr_auto] items-center gap-2 rounded-xl bg-zinc-950 px-3 py-3 text-left text-white" : "grid w-full grid-cols-[30px_1fr_auto] items-center gap-2 rounded-xl px-3 py-3 text-left text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"}>
      <span className="text-xs tabular-nums opacity-50">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm font-semibold">{school.title}</span>
      <span className={selected ? "text-xs text-zinc-400" : complete ? "text-xs text-emerald-600" : active ? "text-xs text-blue-600" : "text-xs text-zinc-300"}>{complete ? "✓" : active ? "●" : ""}</span>
    </button>
  );
}

export function AcademyBrowser() {
  const journey = technicalStewardshipJourney;
  const { ready, progressForPath, pathStatus, pathPercent } = useAcademyProgress();
  const [selectedSchoolId, setSelectedSchoolId] = useState(journey.schools[0]?.id ?? "");
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [initialActivityId, setInitialActivityId] = useState<string | undefined>();

  function findPath(pathId: string) { for (const school of journey.schools) { const path = school.paths.find((candidate) => candidate.id === pathId); if (path) return { school, path }; } return null; }
  function applyLocation() {
    const params = new URLSearchParams(window.location.search);
    const pathId = params.get("path"); const schoolId = params.get("school"); const activityId = params.get("activity") ?? undefined;
    if (pathId) { const found = findPath(pathId); if (found) { setSelectedSchoolId(found.school.id); setActivePath(found.path); setInitialActivityId(activityId); return; } }
    if (schoolId && journey.schools.some((school) => school.id === schoolId)) setSelectedSchoolId(schoolId);
    setActivePath(null); setInitialActivityId(undefined);
  }
  useEffect(() => { applyLocation(); const onPopState = () => applyLocation(); window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, []);
  function pushRoute(params: { school?: string; path?: string; activity?: string }) { const url = new URL(window.location.href); url.search = ""; url.searchParams.set("view", "curriculum"); if (params.school) url.searchParams.set("school", params.school); if (params.path) url.searchParams.set("path", params.path); if (params.activity) url.searchParams.set("activity", params.activity); window.history.pushState({}, "", url); }
  function selectSchool(schoolId: string) { setSelectedSchoolId(schoolId); setActivePath(null); setInitialActivityId(undefined); pushRoute({ school: schoolId }); }
  function startPath(path: LearningPath) { const school = journey.schools.find((candidate) => candidate.paths.some((item) => item.id === path.id)); const activityId = progressForPath(path.id)?.currentActivityId; setActivePath(path); setInitialActivityId(activityId); pushRoute({ school: school?.id, path: path.id, activity: activityId }); }
  function activityChanged(activityId: string) { if (!activePath) return; const current = new URLSearchParams(window.location.search).get("activity"); if (current !== activityId) pushRoute({ school: selectedSchoolId, path: activePath.id, activity: activityId }); }

  const selectedSchool = journey.schools.find((school) => school.id === selectedSchoolId) ?? journey.schools[0];
  if (activePath) return <LearningExperience key={activePath.id} path={activePath} initialActivityId={initialActivityId} onActivityChange={activityChanged} onExit={() => { setActivePath(null); setInitialActivityId(undefined); pushRoute({ school: selectedSchoolId }); }} />;
  if (!selectedSchool) return null;

  const selectedIndex = journey.schools.findIndex((school) => school.id === selectedSchool.id);
  const totalLessons = selectedSchool.paths.reduce((total, path) => total + path.lessons.length, 0);
  const totalActivities = selectedSchool.paths.reduce((total, path) => total + activityCount(path), 0);
  const completedModules = selectedSchool.paths.filter((path) => pathStatus(path) === "completed").length;
  const schoolPercent = selectedSchool.paths.length ? Math.round(selectedSchool.paths.reduce((sum, path) => sum + pathPercent(path), 0) / selectedSchool.paths.length) : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside>
        <div className="sticky top-8 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
          <div className="px-3 pb-4 pt-2"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Curriculum</p><p className="mt-2 text-sm leading-6 text-zinc-500">Move through the academy as one continuous engineering apprenticeship.</p></div>
          <nav className="space-y-1">{journey.schools.map((school, index) => <SchoolNavigation key={school.id} school={school} index={index} selected={school.id === selectedSchool.id} onSelect={() => selectSchool(school.id)} />)}</nav>
        </div>
      </aside>

      <section className={ready ? "min-w-0 opacity-100" : "min-w-0 opacity-70"}>
        <header className="rounded-3xl border border-zinc-200 bg-white px-7 py-8 shadow-sm lg:px-10">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div><p className="text-sm font-semibold text-blue-600">School {selectedIndex + 1} of {journey.schools.length}</p><h2 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 lg:text-5xl">{selectedSchool.title}</h2><p className="mt-4 text-zinc-500">{selectedSchool.paths.length} modules · {totalLessons} lessons · {totalActivities} activities</p></div>
            <div className="min-w-48 rounded-2xl bg-zinc-50 p-5"><div className="flex items-end justify-between gap-5"><span className="text-3xl font-semibold text-zinc-950">{schoolPercent}%</span><span className="text-xs text-zinc-500">{completedModules}/{selectedSchool.paths.length} modules</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200"><div className="h-full rounded-full bg-zinc-950" style={{ width: `${schoolPercent}%` }} /></div></div>
          </div>
        </header>

        <div className="mt-6 space-y-5">{selectedSchool.paths.map((path, index) => <ModuleOutline key={path.id} path={path} index={index} onStart={startPath} />)}</div>
      </section>
    </div>
  );
}
