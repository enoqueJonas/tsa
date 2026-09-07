interface ReflectionContentProps {
    prompt: string;
}

export function ReflectionContent({
    prompt,
}: ReflectionContentProps) {
    return (
        <p className="mt-8 text-3xl leading-relaxed italic">
            {prompt}
        </p>
    );
}