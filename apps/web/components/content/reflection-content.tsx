interface ReflectionContentProps {
    prompt: string;
    value: string;
    onChange(value: string): void;
}

export function ReflectionContent({
    prompt,
    value,
    onChange,
}: ReflectionContentProps) {
    return (
        <div className="mt-8">
            <p className="text-3xl leading-relaxed italic">
                {prompt}
            </p>

            <label className="mt-8 block text-sm font-medium text-zinc-700">
                Your reflection
            </label>

            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={6}
                placeholder="Write your response here..."
                className="mt-3 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base leading-7 text-zinc-900 outline-none transition focus:border-zinc-900"
            />
        </div>
    );
}
