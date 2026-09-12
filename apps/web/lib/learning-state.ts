import type { LearningPath } from "@tsa/runtime-kernel";
import type { ActivityEvidenceRecord, AssessmentGateRecord, PathProgressRecord } from "./progress-storage";

export type LearningState =
  | "not-started"
  | "learning"
  | "practising"
  | "evidence-pending"
  | "ready-for-assessment"
  | "completed";

export const learningStateLabels: Record<LearningState, string> = {
  "not-started": "Not started",
  learning: "Learning",
  practising: "Practising",
  "evidence-pending": "Evidence pending",
  "ready-for-assessment": "Ready for assessment",
  completed: "Completed",
};

export function practicalActivityIds(path: LearningPath) {
  return path.lessons.flatMap((lesson) =>
    lesson.activities.filter((activity) => activity.content.type === "practical").map((activity) => activity.id)
  );
}

export function deriveLearningState(
  path: LearningPath,
  progress: PathProgressRecord | undefined,
  evidence: ActivityEvidenceRecord[],
  assessment: AssessmentGateRecord | undefined
): LearningState {
  if (!progress) return "not-started";
  if (assessment?.ready) return "completed";

  const allActivityIds = path.lessons.flatMap((lesson) => lesson.activities.map((activity) => activity.id));
  const completedIds = new Set(progress.completedActivityIds);
  const pathComplete = allActivityIds.length > 0 && allActivityIds.every((id) => completedIds.has(id));
  const practicalIds = practicalActivityIds(path);

  if (practicalIds.length === 0) return pathComplete ? "completed" : "learning";

  const practicalStarted = practicalIds.some((id) => completedIds.has(id) || evidence.some((item) => item.activityId === id));
  if (!practicalStarted) return "learning";

  const evidenceIds = new Set(evidence.filter((item) => item.notes || item.outcome || item.links.length).map((item) => item.activityId));
  const allPracticalEvidence = practicalIds.every((id) => evidenceIds.has(id));

  if (!pathComplete) return "practising";
  if (!allPracticalEvidence) return "evidence-pending";
  return "ready-for-assessment";
}
