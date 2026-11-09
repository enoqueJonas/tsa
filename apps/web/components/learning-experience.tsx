"use client";

import { useCallback, useEffect, useState } from "react";
import { createRuntime, type LearningPath } from "@tsa/runtime-kernel";
import { ActivityEvidencePanel } from "./activity-evidence-panel";
import { CurriculumSidebar } from "./curriculum-sidebar";
import { PracticalContent, ReadingContent, ReflectionContent } from "./content";
import { useAcademyProgress } from "./academy-progress-provider";

const runtime = createRuntime();

interface LearningExperienceProps {
  path: LearningPath;
  initialActivityId?: string;
  onExit: () => void;
  onActivityChange?: (activityId: string) => void;
}

export function LearningExperience({
  path,
  initialActivityId,
  onExit,
  onActivityChange,
}: LearningExperienceProps) {
  const { ready, progressForPath, savePathProgress } = useAcademyProgress();
  const [session] = useState(() => runtime.start(path));
  const activePath = session.currentPath();
  const [restored, setRestored] = useState(false);

  const [lesson, setLesson] = useState(session.currentLesson());
  const [activity, setActivity] = useState(session.currentActivity());
  const [hasNext, setHasNext] = useState(session.hasNext());
  const [completedActivityIds, setCompletedActivityIds] = useState(session.completedActivityIds());
  const [unlockedLessonIds, setUnlockedLessonIds] = useState(session.unlockedLessonIds());
  const [unlockedActivityIds, setUnlockedActivityIds] = useState(session.unlockedActivityIds());
  const [reflectionResponse, setReflectionResponse] = useState(session.reflectionResponse(session.currentActivity().id));
  const [canCompleteCurrentActivity, setCanCompleteCurrentActivity] = useState(session.canCompleteCurrentActivity());
  // The final Cloud milestone's practicals require saved, substantial
  // self-attested evidence before this UI can call the runtime completion API.
  // A local accepted record still does NOT verify any remote system.
  const [acceptedMilestoneEvidence, setAcceptedMilestoneEvidence] =
    useState<{ activityId: string; accepted: boolean } | null>(null);
  const onMilestoneAcceptanceChange = useCallback((activityId: string, accepted: boolean) => {
    setAcceptedMilestoneEvidence({ activityId, accepted });
  }, []);

  function sync() {
    const currentActivity = session.currentActivity();
    setLesson(session.currentLesson());
    setActivity(currentActivity);
    setHasNext(session.hasNext());
    setCompletedActivityIds(session.completedActivityIds());
    setUnlockedLessonIds(session.unlockedLessonIds());
    setUnlockedActivityIds(session.unlockedActivityIds());
    setReflectionResponse(session.reflectionResponse(currentActivity.id));
    setCanCompleteCurrentActivity(session.canCompleteCurrentActivity());
    return currentActivity;
  }

  function persist() {
    void savePathProgress(activePath, session.progress());
  }

  useEffect(() => {
    if (!ready || restored) return;

    const saved = progressForPath(activePath.id);
    if (saved) {
      session.restoreProgress(saved);
    }

    if (initialActivityId) {
      session.goToActivity(initialActivityId);
    }

    const current = sync();
    setRestored(true);
    onActivityChange?.(current.id);
  }, [activePath.id, initialActivityId, onActivityChange, progressForPath, ready, restored, session]);

  // Every activity replaces the learner's reading surface. A navigation should
  // begin at the lesson header, never inherit the previous long activity's scroll.
  // This also applies to sidebar navigation and restored deep links.
  useEffect(() => {
    if (!restored) return;
    window.scrollTo(0, 0);
  }, [activity.id, restored]);

  function primary() {
    const id = session.currentActivity().id;
    if (activePath.id === "steward-internet-environment" &&
        session.currentActivity().content.type === "practical" &&
        !(acceptedMilestoneEvidence?.activityId === id && acceptedMilestoneEvidence.accepted)) {
      return; // Keep runtime progress unchanged until evidence is persisted.
    }
    const done = session.completedActivityIds().includes(id);
    if (!done && !session.completeCurrentActivity()) return;
    if (session.hasNext()) session.next();
    const current = sync();
    persist();
    onActivityChange?.(current.id);
  }

  function select(id: string) {
    if (!session.goToActivity(id)) return;
    const current = sync();
    persist();
    onActivityChange?.(current.id);
  }

  function reflection(value: string) {
    if (!session.setReflectionResponse(activity.id, value)) return;
    setReflectionResponse(value);
    setCanCompleteCurrentActivity(session.canCompleteCurrentActivity());
    persist();
  }

  if (!ready || !restored) {
    return <div className="mt-12 text-sm text-zinc-500">Loading your progress…</div>;
  }

  const done = completedActivityIds.includes(activity.id);
  const finished = !hasNext && done;
  const last = lesson.activities[lesson.activities.length - 1]?.id === activity.id;
  const needsCloudMilestoneEvidence =
    activePath.id === "steward-internet-environment" &&
    activity.content.type === "practical";
  const milestoneEvidenceAccepted =
    acceptedMilestoneEvidence?.activityId === activity.id &&
    acceptedMilestoneEvidence.accepted;
  const disabled = finished || (!done && !canCompleteCurrentActivity) ||
    (needsCloudMilestoneEvidence && !milestoneEvidenceAccepted);

  let label = "Next";
  if (finished) label = "Path complete";
  else if (!hasNext) label = "Complete path";
  else if (last) label = "Next lesson";

  const readingContent = activity.content.type === "reading" ? activity.content : null;
  const headings = readingContent?.blocks?.filter(
    (block) => block.type === "heading" && block.level !== 3
  ) ?? [];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-zinc-200 pb-6">
        <div>
          <button onClick={onExit} className="text-sm font-medium text-blue-700 hover:text-blue-900">
            ← Back to journey
          </button>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">{activePath.title}</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">{lesson.title}</h2>
        </div>
        <p className="text-sm text-zinc-500">{activity.estimatedMinutes} min</p>
      </div>

      <div className={`mt-8 grid gap-10 ${readingContent && headings.length ? "xl:grid-cols-[230px_minmax(0,920px)_190px]" : "lg:grid-cols-[240px_minmax(0,1fr)]"}`}>
        <CurriculumSidebar
          path={activePath}
          currentLesson={lesson}
          currentActivity={activity}
          completedActivityIds={completedActivityIds}
          unlockedLessonIds={unlockedLessonIds}
          unlockedActivityIds={unlockedActivityIds}
          onSelectActivity={select}
        />

        <main className="min-w-0 max-w-[920px] pb-20">
          {readingContent ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Lesson</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
                {activity.title.replace(/: Concepts and Mental Model$/, "")}
              </h1>
              <ReadingContent
                body={readingContent.body}
                resources={readingContent.resources}
                blocks={readingContent.blocks}
              />
            </>
          ) : activity.content.type === "practical" ? (
            <>
              <PracticalContent
                title={activity.title}
                objective={activity.content.objective}
                scenario={activity.content.scenario}
                instructions={activity.content.instructions}
                deliverables={activity.content.deliverables}
                completionCriteria={activity.content.completionCriteria}
                resources={activity.content.resources}
              />
              <ActivityEvidencePanel
                activityId={activity.id}
                pathId={activePath.id}
                deliverables={activity.content.deliverables}
                requireAcceptedEvidence={needsCloudMilestoneEvidence}
                onMilestoneAcceptanceChange={onMilestoneAcceptanceChange}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
              {activity.content.type === "reflection" && (
                <ReflectionContent
                  prompt={activity.content.prompt}
                  value={reflectionResponse}
                  onChange={reflection}
                />
              )}
            </div>
          )}

          {needsCloudMilestoneEvidence && !milestoneEvidenceAccepted && (
            <p className="mt-6 text-sm font-medium text-amber-900">
              Save a substantial accepted evidence record before proceeding. This is
              a self-attested navigation gate, not independent validation of the
              actual remote Steward environment.
            </p>
          )}
          <div className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-6">
            <span className="text-sm text-zinc-500">{done ? "Completed" : `${activity.estimatedMinutes} min`}</span>
            <button
              onClick={primary}
              disabled={disabled}
              className={disabled ? "cursor-not-allowed rounded-lg bg-zinc-200 px-6 py-3 text-zinc-500" : "rounded-lg bg-zinc-950 px-6 py-3 text-white hover:bg-zinc-800"}
            >
              {label}
            </button>
          </div>
        </main>

        {readingContent && headings.length > 0 && (
          <aside className="hidden xl:block">
            <div className="sticky top-8 border-l border-zinc-200 pl-4">
              <p className="mb-3 text-sm font-semibold text-zinc-950">Lesson contents</p>
              <nav className="space-y-2.5 text-[13px] leading-5 text-zinc-500">
                {headings.map((heading) => (
                  <a
                    key={heading.type === "heading" ? heading.id : ""}
                    href={heading.type === "heading" ? `#${heading.id}` : "#"}
                    className="block hover:text-zinc-950"
                  >
                    {heading.type === "heading" ? heading.text : ""}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
