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
    onSelectActivity(activityId: string): void;
}

export function CurriculumSidebar({
    path,
    currentLesson,
    currentActivity,
    completedActivityIds,
    onSelectActivity,
}: CurriculumSidebarProps) {
    return (
        <aside className="border-r border-zinc-200 pr-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                Curriculum
            </p>

            <div className="mt-6 space-y-8">
                {path.lessons.map((lesson) => {
                    const isCurrentLesson = lesson.id === currentLesson.id;

                    return (
                        <section key={lesson.id}>
                            <h2
                                className={
                                    isCurrentLesson
                                        ? "text-lg font-semibold text-zinc-900"
                                        : "text-lg font-semibold text-zinc-500"
                                }
                            >
                                {lesson.title}
                            </h2>

                            <div className="mt-3 space-y-2">
                                {lesson.activities.map((activity) => {
                                    const isCurrent =
                                        activity.id === currentActivity.id;
                                    const isCompleted =
                                        completedActivityIds.includes(activity.id);

                                    return (
                                        <button
                                            key={activity.id}
                                            type="button"
                                            onClick={() =>
                                                onSelectActivity(activity.id)
                                            }
                                            className={
                                                isCurrent
                                                    ? "block w-full rounded-lg bg-zinc-900 px-4 py-3 text-left text-sm text-white"
                                                    : "block w-full rounded-lg px-4 py-3 text-left text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                                            }
                                        >
                                            <span className="mr-2">
                                                {isCompleted
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
