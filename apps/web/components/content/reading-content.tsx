interface ReadingResource {
  title: string;
  url: string;
}

interface ReadingContentProps {
  body: string;
  resources?: ReadingResource[];
}

export function ReadingContent({
  body,
  resources,
}: ReadingContentProps) {
  return (
    <div className="mt-8 space-y-8">
      <p className="text-3xl leading-relaxed">
        {body}
      </p>

      {resources && resources.length > 0 && (
        <section className="rounded-xl bg-zinc-50 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Additional resources
          </h3>

          <ul className="mt-4 space-y-3 text-base">
            {resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
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