import type {
    Activity,
    LearningPath,
    Lesson,
} from "@tsa/runtime-kernel";

interface CurriculumSidebarProps {
    path: LearningPath;
    currentLesson: Lesson;
    currentActivity: Activity;
    completedActivityIds: string[];
    unlockedLessonIds: string[];
    unlockedActivityIds: string[];
    onSelectActivity(activityId: string): void;
}

export function CurriculumSidebar({
    path,
    currentLesson,
    currentActivity,
    completedActivityIds,
    unlockedLessonIds,
    unlockedActivityIds,
    onSelectActivity,
}: CurriculumSidebarProps) {
    return (
        <aside className="self-start border-r border-zinc-200 pr-5 xl:sticky xl:top-8 xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                Curriculum
            </p>

            <div className="mt-5 space-y-6 pb-8">
                {path.lessons.map((lesson) => {
                    const isCurrentLesson = lesson.id === currentLesson.id;
                    const isUnlocked = unlockedLessonIds.includes(lesson.id);

                    return (
                        <section key={lesson.id}>
                            <div className="flex items-center justify-between gap-3">
                                <h2
                                    className={
                                        isCurrentLesson
                                            ? "text-[15px] font-semibold leading-5 text-zinc-900"
                                            : isUnlocked
                                              ? "text-[15px] font-semibold leading-5 text-zinc-500"
                                              : "text-[15px] font-semibold leading-5 text-zinc-400"
                                    }
                                >
                                    {lesson.title}
                                </h2>

                                {!isUnlocked && (
                                    <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                        Locked
                                    </span>
                                )}
                            </div>

                            <div className="mt-2 space-y-1">
                                {lesson.activities.map((activity) => {
                                    const isCurrent =
                                        activity.id === currentActivity.id;
                                    const isCompleted =
                                        completedActivityIds.includes(activity.id);
                                    const isActivityUnlocked =
                                        unlockedActivityIds.includes(activity.id);

                                    return (
                                        <button
                                            key={activity.id}
                                            type="button"
                                            disabled={!isActivityUnlocked}
                                            onClick={() =>
                                                onSelectActivity(activity.id)
                                            }
                                            className={
                                                !isActivityUnlocked
                                                    ? "block w-full cursor-not-allowed rounded-md px-3 py-2 text-left text-[13px] leading-5 text-zinc-300"
                                                    : isCurrent
                                                      ? "block w-full rounded-md bg-zinc-900 px-3 py-2 text-left text-[13px] leading-5 text-white"
                                                      : "block w-full rounded-md px-3 py-2 text-left text-[13px] leading-5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                                            }
                                        >
                                            <span className="mr-2">
                                                {!isActivityUnlocked
                                                    ? "—"
                                                    : isCompleted
                                                      ? "✓"
                                                      : isCurrent
                                                        ? "●"
                                                        : "○"}
                                            </span>
                                            {activity.title}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>
        </aside>
    );
}
