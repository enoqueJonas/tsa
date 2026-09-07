interface ReadingContentProps {
  body: string;
}

export function ReadingContent({
  body,
}: ReadingContentProps) {
  return (
    <p className="mt-8 text-3xl leading-relaxed">
      {body}
    </p>
  );
}