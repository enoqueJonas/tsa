interface PracticalContentProps {
    title?: string;
    objective: string;
    scenario: string;
    instructions: string[];
    deliverables: string[];
    completionCriteria: string[];
    resources?: Array<{
        title: string;
        url: string;
    }>;
}

export function PracticalContent({
    title,
    objective,
    scenario,
    instructions,
    deliverables,
    completionCriteria,
    resources = [],
}: PracticalContentProps) {
    const practiceTitle = title?.replace(/: Engineering Practice$/, "") ?? "Engineering Practice";

    return (
        <article className="text-base leading-7 text-zinc-700">
            <header className="border-b border-zinc-200 pb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Engineering Practice
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                    {practiceTitle}
                </h1>
                <p className="mt-5 max-w-3xl text-xl leading-8 text-zinc-800">{objective}</p>
            </header>

            <section className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    The situation
                </p>
                <div className="mt-3 border-l-4 border-zinc-950 bg-zinc-50 px-6 py-5">
                    <p className="text-lg leading-8 text-zinc-900">{scenario}</p>
                </div>
            </section>

            <section className="mt-12">
                <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Your assignment
                        </p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
                            Work through the problem
                        </h2>
                    </div>
                    <span className="text-sm text-zinc-500">{instructions.length} steps</span>
                </div>

                <ol className="mt-2 divide-y divide-zinc-200">
                    {instructions.map((instruction, index) => (
                        <li key={instruction} className="grid gap-3 py-6 sm:grid-cols-[44px_1fr]">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
                                {index + 1}
                            </span>
                            <div>
                                <p className="text-lg leading-8 text-zinc-900">{instruction}</p>
                                <p className="mt-2 text-sm text-zinc-500">
                                    Preserve useful observations as you work. Evidence matters more than a polished final answer.
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="mt-12 rounded-2xl bg-zinc-950 p-7 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    Evidence to keep
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Show your engineering work</h2>
                <p className="mt-3 max-w-2xl text-zinc-300">
                    Do not submit only the final result. Keep enough evidence that another engineer can understand what you tried, what happened and why you reached your conclusion.
                </p>
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                    {deliverables.map((deliverable) => (
                        <li key={deliverable} className="flex gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-4">
                            <span aria-hidden="true" className="mt-0.5 text-zinc-400">□</span>
                            <span>{deliverable}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mt-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Before you mark it complete
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
                    Review your work like an engineer
                </h2>
                <p className="mt-3 max-w-3xl text-zinc-600">
                    A working result is necessary, but it is not the whole exercise. You should be able to defend the observations and decisions behind it.
                </p>
                <ul className="mt-6 space-y-3">
                    {completionCriteria.map((criterion) => (
                        <li key={criterion} className="flex gap-4 rounded-xl border border-zinc-200 p-4">
                            <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-zinc-300 text-xs">✓</span>
                            <span className="text-zinc-900">{criterion}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {resources.length > 0 && (
                <section className="mt-12 border-t border-zinc-200 pt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Useful references
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">
                        Use these to investigate and verify; they are not a substitute for doing the assignment.
                    </p>
                    <ul className="mt-4 space-y-2">
                        {resources.map((resource) => (
                            <li key={resource.url}>
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900"
                                >
                                    {resource.title} ↗
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </article>
    );
}
