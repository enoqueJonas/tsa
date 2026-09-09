import type { LessonBlock, LearningResource } from "@tsa/runtime-kernel";

interface ReadingContentProps { body: string; resources?: LearningResource[]; blocks?: LessonBlock[]; }

function Resources({ resources, title = "Resources" }: { resources: LearningResource[]; title?: string }) {
  return <section className="my-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6"><h3 className="text-lg font-bold text-zinc-950">{title}</h3><ul className="mt-4 space-y-3">{resources.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer" className="font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900">{r.title} ↗</a></li>)}</ul></section>;
}

export function ReadingContent({ body, resources, blocks }: ReadingContentProps) {
  if (!blocks?.length) return <div className="mt-8 space-y-8"><p className="text-xl leading-9 text-zinc-800">{body}</p>{resources?.length ? <Resources resources={resources} title="Additional resources" /> : null}</div>;
  return <article className="lesson-prose mt-8 text-[17px] leading-8 text-zinc-800">
    {blocks.map((block, index) => {
      if (block.type === "heading") { const Tag = block.level === 3 ? "h3" : "h2"; return <Tag id={block.id} key={`${block.id}-${index}`} className={block.level === 3 ? "mb-3 mt-8 text-xl font-bold tracking-tight text-zinc-950" : "mb-4 mt-12 scroll-mt-8 text-3xl font-bold tracking-tight text-zinc-950"}>{block.text}</Tag>; }
      if (block.type === "paragraph") return <p key={index} className="my-5">{block.text}</p>;
      if (block.type === "list") { const Tag = block.ordered ? "ol" : "ul"; return <Tag key={index} className={`my-5 space-y-2 pl-7 ${block.ordered ? "list-decimal" : "list-disc"}`}>{block.items.map((item) => <li key={item}>{item}</li>)}</Tag>; }
      if (block.type === "code") return <figure key={index} className="my-8 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-sm"><div className="flex items-center justify-between border-b border-slate-800 px-5 py-3 text-xs text-slate-400"><span>{block.caption ?? "Example"}</span><span>{block.language}</span></div><pre className="overflow-x-auto p-6 text-[15px] leading-7 text-slate-100"><code>{block.code}</code></pre></figure>;
      if (block.type === "callout") { const styles = block.tone === "warning" ? "border-amber-400 bg-amber-50" : block.tone === "steward" ? "border-blue-500 bg-blue-50" : "border-zinc-400 bg-zinc-50"; return <aside key={index} className={`my-8 border-l-4 p-5 ${styles}`}><p className="font-bold text-zinc-950">{block.title}</p><p className="mt-2">{block.body}</p></aside>; }
      if (block.type === "resources") return <Resources key={index} resources={block.resources} title={block.title} />;
      return null;
    })}
    {resources?.length ? <Resources resources={resources} title="Additional resources" /> : null}
  </article>;
}
