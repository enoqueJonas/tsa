"use client";

import type { LessonBlock, LearningResource } from "@tsa/runtime-kernel";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ReadingContentProps {
  body: string;
  resources?: LearningResource[];
  blocks?: LessonBlock[];
}

function Resources({ resources, title = "Resources" }: { resources: LearningResource[]; title?: string }) {
  return (
    <section className="my-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
      <ul className="mt-4 space-y-3">
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
  );
}

function CodeBlock({ language, code, caption }: { language: string; code: string; caption?: string }) {
  async function copyCode() {
    await navigator.clipboard.writeText(code);
  }

  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3 text-xs text-slate-400">
        <span>{caption ?? "Example"}</span>
        <div className="flex items-center gap-4">
          <span>{language}</span>
          <button type="button" onClick={copyCode} className="rounded px-2 py-1 text-slate-300 hover:bg-slate-800 hover:text-white">
            Copy
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{ margin: 0, padding: "1.5rem", background: "#020617", fontSize: "0.94rem", lineHeight: "1.75" }}
        codeTagProps={{ style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" } }}
      >
        {code}
      </SyntaxHighlighter>
    </figure>
  );
}

export function ReadingContent({ body, resources, blocks }: ReadingContentProps) {
  if (!blocks?.length) {
    return (
      <div className="mt-8 space-y-8">
        <p className="text-xl leading-9 text-zinc-800">{body}</p>
        {resources?.length ? <Resources resources={resources} title="Additional resources" /> : null}
      </div>
    );
  }

  return (
    <article className="lesson-prose mt-8 text-[17px] leading-8 text-zinc-800">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 3 ? "h3" : "h2";
          return (
            <Tag
              id={block.id}
              key={`${block.id}-${index}`}
              className={
                block.level === 3
                  ? "mb-3 mt-8 text-xl font-bold tracking-tight text-zinc-950"
                  : "mb-4 mt-12 scroll-mt-8 text-3xl font-bold tracking-tight text-zinc-950"
              }
            >
              {block.text}
            </Tag>
          );
        }

        if (block.type === "paragraph") return <p key={index} className="my-5">{block.text}</p>;

        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={index} className={`my-5 space-y-2 pl-7 ${block.ordered ? "list-decimal" : "list-disc"}`}>
              {block.items.map((item) => <li key={item}>{item}</li>)}
            </Tag>
          );
        }

        if (block.type === "code") return <CodeBlock key={index} language={block.language} code={block.code} caption={block.caption} />;

        if (block.type === "callout") {
          const styles = block.tone === "warning"
            ? "border-amber-400 bg-amber-50"
            : block.tone === "steward"
              ? "border-blue-500 bg-blue-50"
              : "border-zinc-400 bg-zinc-50";
          return (
            <aside key={index} className={`my-8 border-l-4 p-5 ${styles}`}>
              <p className="font-bold text-zinc-950">{block.title}</p>
              <p className="mt-2">{block.body}</p>
            </aside>
          );
        }

        if (block.type === "resources") return <Resources key={index} resources={block.resources} title={block.title} />;
        return null;
      })}
      {resources?.length ? <Resources resources={resources} title="Additional resources" /> : null}
    </article>
  );
}
