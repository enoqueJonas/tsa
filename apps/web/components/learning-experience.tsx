"use client";

import { useState } from "react";
import { createRuntime } from "@tsa/runtime-kernel";

import { CurriculumSidebar } from "./curriculum-sidebar";
import {
    ReadingContent,
    ReflectionContent,
} from "./content";

const runtime = createRuntime();

export function LearningExperience() {
    const [session] = useState(() => runtime.start());

    const [lesson, setLesson] = useState(
        session.currentLesson()
    );

    const [activity, setActivity] = useState(
        session.currentActivity()
    );

    const [hasNext, setHasNext] = useState(
        session.hasNext()
    );

    function syncFromSession() {
        setLesson(session.currentLesson());
        setActivity(session.currentActivity());
        setHasNext(session.hasNext());
    }

    function handleNext() {
        if (!session.hasNext()) {
            return;
        }

        session.next();
        syncFromSession();
    }

    function handleSelectActivity(activityId: string) {
        const didNavigate = session.goToActivity(activityId);

        if (!didNavigate) {
            return;
        }

        syncFromSession();
    }

    return (
        <div className="mt-16 grid gap-10 lg:grid-cols-[240px_1fr]">
            <CurriculumSidebar
                lesson={lesson}
                currentActivity={activity}
                onSelectActivity={handleSelectActivity}
            />

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
                        onClick={handleNext}
                        disabled={!hasNext}
                        className={
                            hasNext
                                ? "rounded-xl bg-black px-6 py-3 text-white transition hover:bg-zinc-800"
                                : "cursor-not-allowed rounded-xl bg-zinc-200 px-6 py-3 text-zinc-500"
                        }
                    >
                        {hasNext ? "Next" : "Lesson complete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
