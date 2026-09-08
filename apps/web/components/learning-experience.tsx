"use client";

import { useEffect, useState } from "react";
import { createRuntime } from "@tsa/runtime-kernel";

import { CurriculumSidebar } from "./curriculum-sidebar";
import {
    PracticalContent,
    ReadingContent,
    ReflectionContent,
} from "./content";

const runtime = createRuntime();
const PROGRESS_STORAGE_KEY = "tsa:engineering-foundations:progress";

export function LearningExperience() {
    const [session] = useState(() => runtime.start());
    const path = session.currentPath();

    const [lesson, setLesson] = useState(session.currentLesson());
    const [activity, setActivity] = useState(session.currentActivity());
    const [hasNext, setHasNext] = useState(session.hasNext());
    const [completedActivityIds, setCompletedActivityIds] = useState(
        session.completedActivityIds()
    );
    const [unlockedLessonIds, setUnlockedLessonIds] = useState(
        session.unlockedLessonIds()
    );
    const [unlockedActivityIds, setUnlockedActivityIds] = useState(
        session.unlockedActivityIds()
    );
    const [reflectionResponse, setReflectionResponse] = useState(
        session.reflectionResponse(session.currentActivity().id)
    );
    const [canCompleteCurrentActivity, setCanCompleteCurrentActivity] = useState(
        session.canCompleteCurrentActivity()
    );

    function syncFromSession() {
        const currentActivity = session.currentActivity();

        setLesson(session.currentLesson());
        setActivity(currentActivity);
        setHasNext(session.hasNext());
        setCompletedActivityIds(session.completedActivityIds());
        setUnlockedLessonIds(session.unlockedLessonIds());
        setUnlockedActivityIds(session.unlockedActivityIds());
        setReflectionResponse(session.reflectionResponse(currentActivity.id));
        setCanCompleteCurrentActivity(session.canCompleteCurrentActivity());
    }

    function persistProgress() {
        window.localStorage.setItem(
            PROGRESS_STORAGE_KEY,
            JSON.stringify(session.progress())
        );
    }

    useEffect(() => {
        const savedProgress = window.localStorage.getItem(PROGRESS_STORAGE_KEY);

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
            const didComplete = session.completeCurrentActivity();

            if (!didComplete) {
                return;
            }
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

    function handleReflectionChange(value: string) {
        const didUpdate = session.setReflectionResponse(activity.id, value);

        if (!didUpdate) {
            return;
        }

        setReflectionResponse(value);
        setCanCompleteCurrentActivity(session.canCompleteCurrentActivity());
        persistProgress();
    }

    const isCurrentCompleted = completedActivityIds.includes(activity.id);
    const isFinished = !hasNext && isCurrentCompleted;
    const isLastActivityInLesson =
        lesson.activities[lesson.activities.length - 1]?.id === activity.id;
    const isPrimaryActionDisabled =
        isFinished || (!isCurrentCompleted && !canCompleteCurrentActivity);

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

                    {activity.content.type === "reading" && (
                        <ReadingContent
                            body={activity.content.body}
                            resources={activity.content.resources}
                        />
                    )}

                    {activity.content.type === "reflection" && (
                        <ReflectionContent
                            prompt={activity.content.prompt}
                            value={reflectionResponse}
                            onChange={handleReflectionChange}
                        />
                    )}

                    {activity.content.type === "practical" && (
                        <PracticalContent
                            objective={activity.content.objective}
                            scenario={activity.content.scenario}
                            instructions={activity.content.instructions}
                            deliverables={activity.content.deliverables}
                            completionCriteria={activity.content.completionCriteria}
                            resources={activity.content.resources}
                        />
                    )}

                    <div className="mt-10 flex items-center justify-between gap-6">
                        <div>
                            <span className="text-sm text-zinc-500">
                                {activity.estimatedMinutes} min
                            </span>

                            {activity.content.type === "reflection" &&
                                !isCurrentCompleted &&
                                !canCompleteCurrentActivity && (
                                    <p className="mt-1 text-sm text-zinc-500">
                                        Write a reflection to continue.
                                    </p>
                                )}
                        </div>

                        <button
                            onClick={handlePrimaryAction}
                            disabled={isPrimaryActionDisabled}
                            className={
                                isPrimaryActionDisabled
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
