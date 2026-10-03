import type { ReactNode } from "react";

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="mx-0.5 inline rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.88em] font-medium not-italic text-zinc-900">
      {children}
    </code>
  );
}

export function InlineTechnicalText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <InlineCode key={`code-${index}`}>{part.slice(1, -1)}</InlineCode>
        ) : (
          <span key={`text-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}
