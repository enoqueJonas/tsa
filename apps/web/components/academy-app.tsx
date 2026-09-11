"use client";

import { useEffect, useState } from "react";
import { technicalStewardshipJourney, type LearningPath, type School } from "@tsa/runtime-kernel";
import { AcademyBrowser } from "./academy-browser";
import { AcademyDashboard } from "./academy-dashboard";
import { AcademyProgressProvider } from "./academy-progress-provider";

type View = "dashboard" | "curriculum";

function currentView(): View {
  if (typeof window === "undefined") return "dashboard";
  return new URLSearchParams(window.location.search).get("view") === "curriculum" ? "curriculum" : "dashboard";
}

function AcademyAppContent() {
  const [view, setView] = useState<View>("dashboard");

  useEffect(() => {
    const sync = () => setView(currentView());
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  function navigate(viewName: View, values: { school?: string; path?: string; activity?: string } = {}) {
    const url = new URL(window.location.href);
    url.search = "";
    if (viewName === "curriculum") url.searchParams.set("view", "curriculum");
    if (values.school) url.searchParams.set("school", values.school);
    if (values.path) url.searchParams.set("path", values.path);
    if (values.activity) url.searchParams.set("activity", values.activity);
    window.history.pushState({}, "", url);
    setView(viewName);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function openPath(path: LearningPath, school: School) {
    navigate("curriculum", { school: school.id, path: path.id });
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
          <button type="button" onClick={() => navigate("dashboard")} className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">TSA</p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-950">Technical Stewardship Academy</p>
          </button>
          <nav className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1">
            <button type="button" onClick={() => navigate("dashboard")} className={view === "dashboard" ? "rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm" : "rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950"}>Dashboard</button>
            <button type="button" onClick={() => navigate("curriculum")} className={view === "curriculum" ? "rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm" : "rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950"}>Curriculum</button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1760px] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        {view === "dashboard" ? (
          <>
            <div className="mb-10">
              <p className="text-sm font-semibold text-blue-700">Your academy</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 lg:text-5xl">Engineering progress, in one place.</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Continue where you stopped, understand how far you have travelled, and keep the full Technical Stewardship journey visible.</p>
            </div>
            <AcademyDashboard onOpenCurriculum={() => navigate("curriculum")} onOpenPath={openPath} />
          </>
        ) : (
          <AcademyBrowser />
        )}
      </div>
    </main>
  );
}

export function AcademyApp() {
  return (
    <AcademyProgressProvider>
      <AcademyAppContent />
    </AcademyProgressProvider>
  );
}
