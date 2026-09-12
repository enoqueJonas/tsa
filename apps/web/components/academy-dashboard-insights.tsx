"use client";

import { useEffect, useMemo, useState } from "react";
import { technicalStewardshipJourney, type LearningPath, type School } from "@tsa/runtime-kernel";
import {
  getAllActivityEvidence,
  getAllAssessmentGates,
  getAllProjectTracking,
  type ActivityEvidenceRecord,
  type AssessmentGateRecord,
  type ProjectTrackingRecord,
} from "../lib/progress-storage";
import { deriveLearningState, learningStateLabels } from "../lib/learning-state";
import { useAcademyProgress } from "./academy-progress-provider";

interface AcademyDashboardInsightsProps {
  onOpenPath(path: LearningPath, school: School): void;
  onOpenProjects(): void;
  onOpenAssessments(): void;
  onOpenPortfolio(): void;
  onOpenHistory(): void;
}

export function AcademyDashboardInsights({
  onOpenPath,
  onOpenProjects,
  onOpenAssessments,
  onOpenPortfolio,
  onOpenHistory,
}: AcademyDashboardInsightsProps) {
  const { records } = useAcademyProgress();
  const [evidence, setEvidence] = useState<ActivityEvidenceRecord[]>([]);
  const [projects, setProjects] = useState<ProjectTrackingRecord[]>([]);
  const [assessments, setAssessments] = useState<AssessmentGateRecord[]>([]);
  const [ready, setReady] = useState(false);

  const entries = useMemo(() => technicalStewardshipJourney.schools.flatMap((school) =>
    school.paths.map((path) => ({ school, path }))
  ), []);

  useEffect(() => {
    Promise.all([
      getAllActivityEvidence(),
      getAllProjectTracking(),
      getAllAssessmentGates(),
    ]).then(([storedEvidence, storedProjects, storedAssessments]) => {
      setEvidence(storedEvidence);
      setProjects(storedProjects);
      setAssessments(storedAssessments);
    }).finally(() => setReady(true));
  }, [records]);

  const states = useMemo(() => entries.map((entry) => ({
    ...entry,
    state: deriveLearningState(
      entry.path,
      records[entry.path.id],
      evidence.filter((item) => item.pathId === entry.path.id),
      assessments.find((item) => item.pathId === entry.path.id)
    ),
  })), [assessments, entries, evidence, records]);

  const evidencePending = states.filter((entry) => entry.state === "evidence-pending").length;
  const readyForAssessment = states.filter((entry) => entry.state === "ready-for-assessment").length;
  const practising = states.filter((entry) => entry.state === "practising").length;
  const blockedProjects = projects.filter((record) => record.status === "blocked");

  const recommendation = useMemo(() => {
    const blocked = blockedProjects[0];
    if (blocked) {
      const entry = states.find((item) => item.path.id === blocked.pathId);
      if (entry) return { entry, reason: "Resolve the active project blocker before adding more work.", action: "Open project tracker" as const };
    }

    const evidenceItem = states.find((entry) => entry.state === "evidence-pending");
    if (evidenceItem) return { entry: evidenceItem, reason: "The learning work is complete, but the practical evidence is not yet preserved.", action: "Open path" as const };

    const assessmentItem = states.find((entry) => entry.state === "ready-for-assessment");
    if (assessmentItem) return { entry: assessmentItem, reason: "Evidence is present and the path is ready for its assessment gate.", action: "Open assessments" as const };

    const active = [...states]
      .filter((entry) => entry.state === "learning" || entry.state === "practising")
      .sort((a, b) => (records[b.path.id]?.updatedAt ?? "").localeCompare(records[a.path.id]?.updatedAt ?? ""))[0];
    if (active) return { entry: active, reason: "Continue the most recently active learning path.", action: "Open path" as const };

    const first = states.find((entry) => entry.state === "not-started");
    if (first) return { entry: first, reason: "Start the next untouched path in the Technical Stewardship journey.", action: "Open path" as const };

    return undefined;
  }, [blockedProjects, records, states]);

  if (!ready) return <div className="mt-8 text-sm text-zinc-500">Loading academy insights…</div>;

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
      <article className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">What needs attention</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <button type="button" onClick={onOpenProjects} className="rounded-2xl border border-zinc-200 p-5 text-left transition hover:bg-zinc-50"><p className="text-3xl font-semibold">{blockedProjects.length}</p><p className="mt-1 text-sm text-zinc-500">Blocked projects</p></button>
          <button type="button" onClick={onOpenPortfolio} className="rounded-2xl border border-zinc-200 p-5 text-left transition hover:bg-zinc-50"><p className="text-3xl font-semibold">{evidencePending}</p><p className="mt-1 text-sm text-zinc-500">Evidence pending</p></button>
          <button type="button" onClick={onOpenAssessments} className="rounded-2xl border border-zinc-200 p-5 text-left transition hover:bg-zinc-50"><p className="text-3xl font-semibold">{readyForAssessment}</p><p className="mt-1 text-sm text-zinc-500">Ready for assessment</p></button>
          <button type="button" onClick={onOpenHistory} className="rounded-2xl border border-zinc-200 p-5 text-left transition hover:bg-zinc-50"><p className="text-3xl font-semibold">{practising}</p><p className="mt-1 text-sm text-zinc-500">Currently practising</p></button>
        </div>
      </article>

      <article className="rounded-3xl bg-zinc-950 p-7 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Recommended next action</p>
        {recommendation ? (
          <>
            <p className="mt-5 text-sm font-medium text-blue-300">{recommendation.entry.school.title}</p>
            <h2 className="mt-2 text-2xl font-semibold">{recommendation.entry.path.title}</h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{learningStateLabels[recommendation.entry.state]}</p>
            <p className="mt-4 text-sm leading-6 text-zinc-400">{recommendation.reason}</p>
            <button
              type="button"
              onClick={() => {
                if (recommendation.action === "Open project tracker") onOpenProjects();
                else if (recommendation.action === "Open assessments") onOpenAssessments();
                else onOpenPath(recommendation.entry.path, recommendation.entry.school);
              }}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              {recommendation.action}
            </button>
          </>
        ) : (
          <><h2 className="mt-5 text-2xl font-semibold">Journey complete.</h2><p className="mt-3 text-sm leading-6 text-zinc-400">There is no unresolved local learning state. Review your evidence portfolio and history whenever you need to revisit the work.</p></>
        )}
      </article>
    </section>
  );
}
