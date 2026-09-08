"use client";

import { useEffect, useState } from "react";
import { createRuntime } from "@tsa/runtime-kernel";

import { CurriculumSidebar } from "./curriculum-sidebar";
import {
    ReadingContent,
    ReflectionContent,
} from "./content";

const runtime = createRuntime();
const PROGRESS_STORAGE_KEY = "tsa:engineering-foundations:progress";

export function LearningExperience() {
    const [session] = useState(() => runtime.start());
    const path = session.currentPath();

    const [lesson, setLesson] = useState(
        session.currentLesson()
    );

    const [activity, setActivity] = useState(
        session.currentActivity()
    );

    const [hasNext, setHasNext] = useState(
        session.hasNext()
    );

    const [completedActivityIds, setCompletedActivityIds] = useState(
        session.completedActivityIds()
    );

    const [unlockedLessonIds, setUnlockedLessonIds] = useState(
        session.unlockedLessonIds()
    );

    const [unlockedActivityIds, setUnlockedActivityIds] = useState(
        session.unlockedActivityIds()
    );

    function syncFromSession() {
        setLesson(session.currentLesson());
        setActivity(session.currentActivity());
        setHasNext(session.hasNext());
        setCompletedActivityIds(session.completedActivityIds());
        setUnlockedLessonIds(session.unlockedLessonIds());
        setUnlockedActivityIds(session.unlockedActivityIds());
    }

    function persistProgress() {
        window.localStorage.setItem(
            PROGRESS_STORAGE_KEY,
            JSON.stringify(session.progress())
        );
    }

    useEffect(() => {
        const savedProgress = window.localStorage.getItem(
            PROGRESS_STORAGE_KEY
        );

        if (!savedProgress) {
            return;
        }

        try {
            session.restoreProgress(JSON.parse(savedProgress));
            syncFromSession();
        } catch {
            window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
        }
    }, [session]);

    function handlePrimaryAction() {
        const currentActivityId = session.currentActivity().id;
        const isCurrentCompleted = session
            .completedActivityIds()
            .includes(currentActivityId);

        if (!isCurrentCompleted) {
            session.completeCurrentActivity();
        }

        if (session.hasNext()) {
            session.next();
        }

        syncFromSession();
        persistProgress();
    }

    function handleSelectActivity(activityId: string) {
        const didNavigate = session.goToActivity(activityId);

        if (!didNavigate) {
            return;
        }

        syncFromSession();
        persistProgress();
    }

    const isCurrentCompleted = completedActivityIds.includes(activity.id);
    const isFinished = !hasNext && isCurrentCompleted;
    const isLastActivityInLesson =
        lesson.activities[lesson.activities.length - 1]?.id === activity.id;

    let primaryActionLabel = "Next";

    if (isFinished) {
        primaryActionLabel = "Path complete";
    } else if (!hasNext) {
        primaryActionLabel = "Complete path";
    } else if (isLastActivityInLesson) {
        primaryActionLabel = "Next lesson";
    }

    return (
        <div className="mt-16 grid gap-10 lg:grid-cols-[280px_1fr]">
            <CurriculumSidebar
                path={path}
                currentLesson={lesson}
                currentActivity={activity}
                completedActivityIds={completedActivityIds}
                unlockedLessonIds={unlockedLessonIds}
                unlockedActivityIds={unlockedActivityIds}
                onSelectActivity={handleSelectActivity}
            />

            <div>
                <p className="mb-4 text-sm font-medium text-zinc-500">
                    {lesson.title}
                </p>

                <div className="rounded-2xl border bg-white p-10 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                        {activity.title}
                    </p>

                    <div className="mt-8 text-3xl leading-relaxed">
                        {activity.content.type === "reading" && (
                            <ReadingContent body={activity.content.body} />
                        )}

                        {activity.content.type === "reflection" && (
                            <ReflectionContent prompt={activity.content.prompt} />
                        )}
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                        <span className="text-sm text-zinc-500">
                            {activity.estimatedMinutes} min
                        </span>

                        <button
                            onClick={handlePrimaryAction}
                            disabled={isFinished}
                            className={
                                isFinished
                                    ? "cursor-not-allowed rounded-xl bg-zinc-200 px-6 py-3 text-zinc-500"
                                    : "rounded-xl bg-black px-6 py-3 text-white transition hover:bg-zinc-800"
                            }
                        >
                            {primaryActionLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
