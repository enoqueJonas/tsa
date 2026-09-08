import type { Activity, Lesson } from "@tsa/runtime-kernel";

interface CurriculumSidebarProps {
    lesson: Lesson;
    currentActivity: Activity;
}

export function CurriculumSidebar({
    lesson,
    currentActivity,
}: CurriculumSidebarProps) {
    return (
        <aside className="border-r border-zinc-200 pr-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                Current lesson
            </p>

            <h2 className="mt-3 text-lg font-semibold">
                {lesson.title}
            </h2>

            <div className="mt-6 space-y-2">
                {lesson.activities.map((activity) => {
                    const isCurrent = activity.id === currentActivity.id;

                    return (
                        <div
                            key={activity.id}
                            className={
                                isCurrent
                                    ? "rounded-lg bg-zinc-900 px-4 py-3 text-sm text-white"
                                    : "px-4 py-3 text-sm text-zinc-500"
                            }
                        >
                            <span className="mr-2">
                                {isCurrent ? "●" : "○"}
                            </span>
                            {activity.title}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
