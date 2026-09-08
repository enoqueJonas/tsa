interface PracticalContentProps {
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
    objective,
    scenario,
    instructions,
    deliverables,
    completionCriteria,
    resources = [],
}: PracticalContentProps) {
    return (
        <div className="mt-8 space-y-8 text-base leading-7 text-zinc-700">
            <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Objective
                </h3>
                <p className="mt-3 text-lg text-zinc-900">{objective}</p>
            </section>

            <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Scenario
                </h3>
                <p className="mt-3 rounded-xl bg-zinc-50 p-5 text-zinc-900">
                    {scenario}
                </p>
            </section>

            <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Investigation
                </h3>
                <ol className="mt-3 list-decimal space-y-2 pl-6">
                    {instructions.map((instruction) => (
                        <li key={instruction}>{instruction}</li>
                    ))}
                </ol>
            </section>

            <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Deliverables
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                    {deliverables.map((deliverable) => (
                        <li key={deliverable}>{deliverable}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Completion criteria
                </h3>
                <ul className="mt-3 space-y-2">
                    {completionCriteria.map((criterion) => (
                        <li key={criterion} className="flex gap-3">
                            <span aria-hidden="true">□</span>
                            <span>{criterion}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {resources.length > 0 && (
                <section>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Additional resources
                    </h3>
                    <ul className="mt-3 space-y-2">
                        {resources.map((resource) => (
                            <li key={resource.url}>
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-blue-600 underline underline-offset-4"
                                >
                                    {resource.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
