"use client";

import { useState } from "react";
import {
  technicalStewardshipJourney,
  type LearningPath,
  type School,
} from "@tsa/runtime-kernel";

import { LearningExperience } from "./learning-experience";

function authoredLessonCount(path: LearningPath) {
  return path.lessons.filter((lesson) => lesson.activities.length > 0).length;
}

function ModuleCard({
  path,
  onStart,
}: {
  path: LearningPath;
  onStart: (path: LearningPath) => void;
}) {
  const authored = authoredLessonCount(path);
  const available = authored > 0;

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Module
          </p>
          <h3 className="mt-2 text-xl font-semibold text-zinc-950">{path.title}</h3>
        </div>
        <span
          className={
            available
              ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
              : "rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500"
          }
        >
          {available ? "In progress" : "Planned"}
        </span>
      </div>

      <div className="mt-5 space-y-2">
        {path.lessons.map((lesson, index) => {
          const authoredLesson = lesson.activities.length > 0;

          return (
            <div
              key={lesson.id}
              className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2.5"
            >
              <span className="w-6 text-xs tabular-nums text-zinc-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={
                  authoredLesson
                    ? "text-sm font-medium text-zinc-900"
                    : "text-sm text-zinc-600"
                }
              >
                {lesson.title}
              </span>
              {authoredLesson && (
                <span className="ml-auto text-xs font-medium text-emerald-700">
                  Available
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-zinc-100 pt-5">
        <p className="text-sm text-zinc-500">
          {path.lessons.length} lessons · {authored} authored
        </p>
        {available ? (
          <button
            type="button"
            onClick={() => onStart(path)}
            className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Continue module
          </button>
        ) : (
          <span className="text-sm text-zinc-400">Not yet available</span>
        )}
      </div>
    </article>
  );
}

function SchoolNavigation({
  school,
  selected,
  onSelect,
}: {
  school: School;
  selected: boolean;
  onSelect: () => void;
}) {
  const lessonCount = school.paths.reduce(
    (total, path) => total + path.lessons.length,
    0
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        selected
          ? "w-full rounded-xl bg-zinc-950 px-4 py-3 text-left text-white"
          : "w-full rounded-xl px-4 py-3 text-left text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
      }
    >
      <span className="block text-sm font-semibold">{school.title}</span>
      <span className="mt-1 block text-xs text-zinc-400">
        {school.paths.length} modules · {lessonCount} lessons
      </span>
    </button>
  );
}

export function AcademyBrowser() {
  const journey = technicalStewardshipJourney;
  const [selectedSchoolId, setSelectedSchoolId] = useState(
    journey.schools[0]?.id ?? ""
  );
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const selectedSchool =
    journey.schools.find((school) => school.id === selectedSchoolId) ??
    journey.schools[0];

  if (activePath) {
    return (
      <LearningExperience
        key={activePath.id}
        path={activePath}
        onExit={() => setActivePath(null)}
      />
    );
  }

  if (!selectedSchool) {
    return null;
  }

  const selectedIndex = journey.schools.findIndex(
    (school) => school.id === selectedSchool.id
  );
  const totalLessons = selectedSchool.paths.reduce(
    (total, path) => total + path.lessons.length,
    0
  );

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside>
        <div className="sticky top-8 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
          <p className="px-4 pb-3 pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Journey
          </p>
          <nav className="space-y-1">
            {journey.schools.map((school) => (
              <SchoolNavigation
                key={school.id}
                school={school}
                selected={school.id === selectedSchool.id}
                onSelect={() => setSelectedSchoolId(school.id)}
              />
            ))}
          </nav>
        </div>
      </aside>

      <section>
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-sm font-medium text-blue-600">
            Stage {selectedIndex + 1} of {journey.schools.length}
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950">
            {selectedSchool.title}
          </h2>
          <p className="mt-3 text-zinc-500">
            {selectedSchool.paths.length} modules · {totalLessons} planned lessons
          </p>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {selectedSchool.paths.map((path) => (
            <ModuleCard key={path.id} path={path} onStart={setActivePath} />
          ))}
        </div>
      </section>
    </div>
  );
}
