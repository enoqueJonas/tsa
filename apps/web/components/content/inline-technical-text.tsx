import type { ReactNode } from "react";

const RESERVED_TOKENS = new Set([
  "def", "elif", "lambda", "None", "True", "False",
  "async", "await", "const", "let", "var", "undefined", "null",
  "interface", "implements", "extends", "instanceof", "typeof",
  "import", "export", "package", "throws",
  "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP",
  "JOIN", "WHERE", "GROUP BY", "ORDER BY",
  "GET", "POST", "PUT", "PATCH",
]);

const TOKEN_PATTERN = /(\b(?:def|elif|lambda|None|True|False|async|await|const|let|var|undefined|null|interface|implements|extends|instanceof|typeof|import|export|package|throws|SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|JOIN|WHERE|GET|POST|PUT|PATCH)\b|\bGROUP BY\b|\bORDER BY\b|(?:\+=|-=|\*=|\/=|==|!=|<=|>=|=>|::))/g;

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="mx-0.5 inline rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.88em] font-medium not-italic text-zinc-900">
      {children}
    </code>
  );
}

function renderAutomaticTokens(text: string, keyPrefix: string) {
  return text.split(TOKEN_PATTERN).map((part, index) => {
    const isOperator = /^(?:\+=|-=|\*=|\/=|==|!=|<=|>=|=>|::)$/.test(part);
    if (RESERVED_TOKENS.has(part) || isOperator) {
      return <InlineCode key={`${keyPrefix}-${index}`}>{part}</InlineCode>;
    }
    return <span key={`${keyPrefix}-${index}`}>{part}</span>;
  });
}

export function InlineTechnicalText({ text }: { text: string }) {
  const explicitParts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {explicitParts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <InlineCode key={`explicit-${index}`}>{part.slice(1, -1)}</InlineCode>
        ) : (
          <span key={`text-${index}`}>{renderAutomaticTokens(part, `auto-${index}`)}</span>
        ),
      )}
    </>
  );
}
