import { AcademyBrowser } from "../components/academy-browser";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <p className="text-sm uppercase tracking-[0.25em] text-blue-600">
          Technical Stewardship Academy
        </p>

        <h1 className="mt-3 max-w-4xl text-5xl font-bold tracking-tight text-zinc-950 lg:text-6xl">
          Technical Stewardship Journey
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
          One continuous engineering apprenticeship from engineering foundations
          to professional practice. Explore every school, module and planned
          lesson in the journey.
        </p>

        <AcademyBrowser />
      </div>
    </main>
  );
}
