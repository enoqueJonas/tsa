"use client";

import { useEffect, useMemo, useState } from "react";
import { technicalStewardshipJourney } from "@tsa/runtime-kernel";
import {
  getAllActivityEvidence,
  getAllAssessmentGates,
  getAllPathProgress,
  getAllProjectTracking,
  type ActivityEvidenceRecord,
  type AssessmentGateRecord,
  type PathProgressRecord,
  type ProjectTrackingRecord,
} from "../lib/progress-storage";
import { deriveLearningState, learningStateLabels } from "../lib/learning-state";

type TimelineItem = {
  id: string;
  at: string;
  title: string;
  detail: string;
  kind: "progress" | "evidence" | "project" | "assessment";
};

function pathLookup() {
  return Object.fromEntries(
    technicalStewardshipJourney.schools.flatMap((school) =>
      school.paths.map((path) => [path.id, { school, path }])
    )
  );
}

export function LearningHistory() {
  const lookup = useMemo(() => pathLookup(), []);
  const [progress, setProgress] = useState<PathProgressRecord[]>([]);
  const [evidence, setEvidence] = useState<ActivityEvidenceRecord[]>([]);
  const [projects, setProjects] = useState<ProjectTrackingRecord[]>([]);
  const [assessments, setAssessments] = useState<AssessmentGateRecord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      getAllPathProgress(),
      getAllActivityEvidence(),
      getAllProjectTracking(),
      getAllAssessmentGates(),
    ]).then(([storedProgress, storedEvidence, storedProjects, storedAssessments]) => {
      setProgress(storedProgress);
      setEvidence(storedEvidence);
      setProjects(storedProjects);
      setAssessments(storedAssessments);
    }).finally(() => setReady(true));
  }, []);

  const items = useMemo<TimelineItem[]>(() => {
    const timeline: TimelineItem[] = [];

    for (const record of progress) {
      const entry = lookup[record.pathId];
      if (!entry) continue;
      const state = deriveLearningState(
        entry.path,
        record,
        evidence.filter((item) => item.pathId === record.pathId),
        assessments.find((item) => item.pathId === record.pathId)
      );
      timeline.push({
        id: `progress:${record.pathId}`,
        at: record.updatedAt,
        title: entry.path.title,
        detail: `${entry.school.title} · ${learningStateLabels[state]} · ${record.completedActivityIds.length} activities completed`,
        kind: "progress",
      });
    }

    for (const record of evidence) {
      const entry = lookup[record.pathId];
      if (!entry) continue;
      timeline.push({
        id: `evidence:${record.activityId}`,
        at: record.updatedAt,
        title: "Evidence updated",
        detail: `${entry.path.title} · ${record.links.length} linked artifact${record.links.length === 1 ? "" : "s"}`,
        kind: "evidence",
      });
    }

    for (const record of projects) {
      const entry = lookup[record.pathId];
      if (!entry) continue;
      timeline.push({
        id: `project:${record.pathId}`,
        at: record.updatedAt,
        title: "Project tracking updated",
        detail: `${entry.path.title} · ${record.status.replaceAll("-", " ")}`,
        kind: "project",
      });
    }

    for (const record of assessments) {
      const entry = lookup[record.pathId];
      if (!entry) continue;
      timeline.push({
        id: `assessment:${record.pathId}`,
        at: record.updatedAt,
        title: record.ready ? "Assessment gate passed" : "Assessment reviewed",
        detail: `${entry.path.title} · ${record.satisfiedCriteria.length} criteria satisfied`,
        kind: "assessment",
      });
    }

    return timeline.sort((a, b) => b.at.localeCompare(a.at));
  }, [assessments, evidence, lookup, progress, projects]);

  if (!ready) return <p className="text-sm text-zinc-500">Loading learning history…</p>;

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">Learning history</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">A timeline of engineering work.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Progress, evidence, project decisions, and assessment updates are brought together so your learning has continuity instead of isolated checkmarks.</p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">No local academy activity yet.</p>
        ) : (
          <ol className="space-y-1">
            {items.map((item) => (
              <li key={item.id} className="grid gap-3 border-b border-zinc-100 py-5 last:border-b-0 md:grid-cols-[160px_150px_minmax(0,1fr)]">
                <time className="text-xs text-zinc-500">{new Date(item.at).toLocaleString()}</time>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">{item.kind}</span>
                <div><p className="font-medium text-zinc-950">{item.title}</p><p className="mt-1 text-sm leading-6 text-zinc-600">{item.detail}</p></div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
