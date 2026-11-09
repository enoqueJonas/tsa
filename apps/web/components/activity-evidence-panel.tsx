"use client";

import { useEffect, useState } from "react";
import {
  EVIDENCE_SCHEMA_VERSION,
  getActivityEvidence,
  putActivityEvidence,
  type ActivityEvidenceRecord,
} from "../lib/progress-storage";
import { hasSavedCloudMilestoneEvidence } from "../lib/cloud-milestone-evidence-gate";

type SubmissionStatus = "draft" | "ready" | "accepted";
type EvidenceWithStatus = ActivityEvidenceRecord & { submissionStatus?: SubmissionStatus };

interface ActivityEvidencePanelProps {
  activityId: string;
  pathId: string;
  deliverables: string[];
  /** Only the final Cloud milestone needs a persisted, nonempty self-attested record. */
  requireAcceptedEvidence?: boolean;
  onMilestoneAcceptanceChange?: (activityId: string, accepted: boolean) => void;
}

export function ActivityEvidencePanel({ activityId, pathId, deliverables, requireAcceptedEvidence = false, onMilestoneAcceptanceChange }: ActivityEvidencePanelProps) {
  const [notes, setNotes] = useState("");
  const [linksText, setLinksText] = useState("");
  const [outcome, setOutcome] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("draft");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  function invalidateUnsavedEdits() {
    setSaved(false);
    setError("");
    if (requireAcceptedEvidence) onMilestoneAcceptanceChange?.(activityId, false);
  }

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setSaved(false);
    setError("");
    if (requireAcceptedEvidence) onMilestoneAcceptanceChange?.(activityId, false);

    getActivityEvidence(activityId)
      .then((record) => {
        if (cancelled) return;
        const stored = record as EvidenceWithStatus | undefined;
        setNotes(stored?.notes ?? "");
        setLinksText(stored?.links.join("\n") ?? "");
        setOutcome(stored?.outcome ?? "");
        setSubmissionStatus(stored?.submissionStatus ?? "draft");
        if (requireAcceptedEvidence) {
          onMilestoneAcceptanceChange?.(activityId, hasSavedCloudMilestoneEvidence(stored));
        }
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Evidence could not be loaded. Milestone completion remains blocked.");
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activityId, requireAcceptedEvidence, onMilestoneAcceptanceChange]);

  async function save() {
    const proposedLinks = linksText.split("\n").map((value) => value.trim()).filter(Boolean);
    const proposed: EvidenceWithStatus = {
      schemaVersion: EVIDENCE_SCHEMA_VERSION,
      activityId, pathId, notes: notes.trim(), outcome: outcome.trim(),
      links: proposedLinks, submissionStatus, createdAt: "", updatedAt: "",
    };
    if (requireAcceptedEvidence && submissionStatus === "accepted" &&
        !hasSavedCloudMilestoneEvidence(proposed)) {
      setError("To self-attest a Cloud milestone gate, save at least 120 characters of observed evidence notes, 100 characters of outcome/limitations, and one non-placeholder HTTPS artifact link. Independent external review is still required.");
      onMilestoneAcceptanceChange?.(activityId, false);
      return;
    }
    try {
    const previous = await getActivityEvidence(activityId) as EvidenceWithStatus | undefined;
    const now = new Date().toISOString();
    const links = linksText
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);

    const record: EvidenceWithStatus = {
      schemaVersion: EVIDENCE_SCHEMA_VERSION,
      activityId,
      pathId,
      notes: notes.trim(),
      links,
      outcome: outcome.trim(),
      submissionStatus,
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
    };

    await putActivityEvidence(record);
    setError("");
    setSaved(true);
    if (requireAcceptedEvidence) {
      onMilestoneAcceptanceChange?.(activityId, hasSavedCloudMilestoneEvidence(record));
    }
    } catch {
      setError("Evidence could not be saved to this browser. Milestone completion remains blocked.");
      if (requireAcceptedEvidence) onMilestoneAcceptanceChange?.(activityId, false);
    }
  }

  if (!loaded) {
    return <div className="mt-8 text-sm text-zinc-500">Loading evidence workspace…</div>;
  }

  return (
    <section className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Evidence workspace</p>
          <h3 className="mt-2 text-xl font-semibold text-zinc-950">Preserve what proves the work.</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Capture the artifacts, observations, and outcome that demonstrate you completed this practical activity.
          </p>
          {requireAcceptedEvidence && (
            <p className="mt-3 max-w-2xl text-sm leading-6 font-medium text-amber-900">
              This final Cloud milestone blocks Next until a nonempty accepted record is saved.
              Accepted here is the learner's SELF-ASSESSMENT only. A separate engineer must
              inspect the real deployment, evidence and commands before this gate can be called operationally validated.
            </p>
          )}
        </div>
        {saved && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Saved locally</span>}
      </div>

      {deliverables.length > 0 && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm font-semibold text-zinc-900">Expected deliverables</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {deliverables.map((deliverable) => <li key={deliverable}>• {deliverable}</li>)}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Submission state
          <select
            value={submissionStatus}
            onChange={(event) => { setSubmissionStatus(event.target.value as SubmissionStatus); invalidateUnsavedEdits(); }}
            className="w-full min-w-0 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal"
          >
            <option value="draft">Draft — evidence still being assembled</option>
            <option value="ready">Ready — prepared for self-assessment/review</option>
            <option value="accepted">{requireAcceptedEvidence
              ? "Accepted — self-attested; independent external review required"
              : "Accepted — evidence satisfies the activity"}</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Evidence notes
          <textarea
            value={notes}
            onChange={(event) => { setNotes(event.target.value); invalidateUnsavedEdits(); }}
            rows={6}
            placeholder="What did you build, inspect, break, diagnose, or change? Include commands, observations, and important decisions."
            className="w-full min-w-0 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal leading-6 outline-none focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Artifact links
          <textarea
            value={linksText}
            onChange={(event) => { setLinksText(event.target.value); invalidateUnsavedEdits(); }}
            rows={3}
            placeholder="One URL per line: repository, commit, PR, diagram, document, log, screenshot reference…"
            className="w-full min-w-0 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal leading-6 outline-none focus:border-zinc-500"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Outcome / explanation
          <textarea
            value={outcome}
            onChange={(event) => { setOutcome(event.target.value); invalidateUnsavedEdits(); }}
            rows={4}
            placeholder="What was the result? What did the evidence prove, and what would you do differently next time?"
            className="w-full min-w-0 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-normal leading-6 outline-none focus:border-zinc-500"
          />
        </label>
      </div>

      {error && <p role="alert" className="mt-5 text-sm font-medium text-red-700">{error}</p>}
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">Stored only in this browser for Platform v1.</p>
        <button
          type="button"
          onClick={() => void save()}
          className="rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Save evidence
        </button>
      </div>
    </section>
  );
}
