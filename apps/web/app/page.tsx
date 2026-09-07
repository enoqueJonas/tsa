import { createRuntime } from "@tsa/runtime-kernel";
import { LearningExperience } from "../components/learning-experience";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-8 py-20">

        <p className="text-sm uppercase tracking-[0.25em] text-blue-600">
          Technical Stewardship Academy
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight">
          Engineering Foundations
        </h1>

        <p className="mt-3 text-xl text-zinc-600">
          Thinking Like an Engineer
        </p>

        <LearningExperience />

      </div>
    </main>
  );
}