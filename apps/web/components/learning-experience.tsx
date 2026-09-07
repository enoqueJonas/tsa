"use client";

import {
    ReadingContent,
    ReflectionContent,
} from "./content";
import { useState } from "react";
import { createRuntime } from "@tsa/runtime-kernel";

const runtime = createRuntime();

export function LearningExperience() {
    const [session] = useState(() => runtime.start());

    const [activity, setActivity] = useState(
        session.currentActivity()
    );

    function handleNext() {
        session.next();
        setActivity(session.currentActivity());
    }

    return (
        <div className="mt-16 rounded-2xl border bg-white p-10 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                {activity.title}
            </p>

            <div className="mt-8 text-3xl leading-relaxed">
                {activity.content.type === "reading" && (
                    <ReadingContent
                        body={activity.content.body}
                    />
                )}

                {activity.content.type === "reflection" && (
                    <ReflectionContent
                        prompt={activity.content.prompt}
                    />
                )}
            </div>

            <div className="mt-10 flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                    {activity.estimatedMinutes} min
                </span>

                <button
                    onClick={handleNext}
                    className="rounded-xl bg-black px-6 py-3 text-white hover:bg-zinc-800"
                >
                    Next
                </button>
            </div>
        </div>
    );
}