import {
  clearAllAcademyData,
  getAllActivityEvidence,
  getAllAssessmentGates,
  getAllPathProgress,
  getAllProjectTracking,
  putActivityEvidence,
  putAssessmentGate,
  putPathProgress,
  putProjectTracking,
  type ActivityEvidenceRecord,
  type AssessmentGateRecord,
  type PathProgressRecord,
  type ProjectTrackingRecord,
} from "./progress-storage";

export const ACADEMY_BACKUP_VERSION = 1;

export interface AcademyBackup {
  backupVersion: typeof ACADEMY_BACKUP_VERSION;
  exportedAt: string;
  progress: PathProgressRecord[];
  evidence: ActivityEvidenceRecord[];
  projects: ProjectTrackingRecord[];
  assessments: AssessmentGateRecord[];
}

export async function createAcademyBackup(): Promise<AcademyBackup> {
  const [progress, evidence, projects, assessments] = await Promise.all([
    getAllPathProgress(),
    getAllActivityEvidence(),
    getAllProjectTracking(),
    getAllAssessmentGates(),
  ]);

  return {
    backupVersion: ACADEMY_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
    evidence,
    projects,
    assessments,
  };
}

function isBackup(value: unknown): value is AcademyBackup {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AcademyBackup>;
  return candidate.backupVersion === ACADEMY_BACKUP_VERSION
    && Array.isArray(candidate.progress)
    && Array.isArray(candidate.evidence)
    && Array.isArray(candidate.projects)
    && Array.isArray(candidate.assessments);
}

export function parseAcademyBackup(text: string): AcademyBackup {
  const value = JSON.parse(text) as unknown;
  if (!isBackup(value)) {
    throw new Error("This file is not a supported TSA academy backup.");
  }
  return value;
}

export async function restoreAcademyBackup(backup: AcademyBackup) {
  await clearAllAcademyData();
  await Promise.all([
    ...backup.progress.map((record) => putPathProgress(record)),
    ...backup.evidence.map((record) => putActivityEvidence(record)),
    ...backup.projects.map((record) => putProjectTracking(record)),
    ...backup.assessments.map((record) => putAssessmentGate(record)),
  ]);
}
