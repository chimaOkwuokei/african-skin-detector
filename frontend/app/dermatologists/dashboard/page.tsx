"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const SPECIALIST_ID = 1;

type Assignment = {
  id: number;
  case_id: number;
  specialist_id: number;
  specialist_name: string | null;
  status: string;
};

type CaseData = {
  id: number;
  patient_id: number;
  complaint: string | null;
  created_at: string;
  patient_name: string | null;
  patient_ref: string | null;
  urgency_tier: string | null;
  urgency_score: number | null;
  assignment_status: string | null;
};

type Feedback = {
  id: number;
  case_id: number | null;
  final_diagnosis: string;
  agreed_with_ai: boolean;
  notes: string | null;
  recommended_action: string | null;
  specialist_name: string | null;
  patient_name: string | null;
  created_at: string;
};

type DashboardCase = {
  assignment: Assignment;
  caseData: CaseData | null;
};

function getSeverity(score: number | null) {
  if (score !== null && score >= 70) return "High";
  if (score !== null && score >= 40) return "Moderate";
  return "Low";
}

function getSeverityStyle(severity: string) {
  if (severity === "High") return "bg-red-50 text-red-700";
  if (severity === "Moderate") return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

function formatStatus(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized === "pending" ||
    normalized === "assigned" ||
    normalized === "awaiting_review"
  ) {
    return "Awaiting dermatologist";
  }

  if (
    normalized === "reviewed" ||
    normalized === "completed" ||
    normalized === "feedback_submitted"
  ) {
    return "Feedback submitted";
  }

  return status;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DermatologistDashboardPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [cases, setCases] = useState<DashboardCase[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://127.0.0.1:8000";

        const assignmentsResponse = await fetch(
          `${apiUrl}/specialists/${SPECIALIST_ID}/assignments`
        );

        if (!assignmentsResponse.ok) {
          throw new Error("Failed to load assignments");
        }

        const loadedAssignments: Assignment[] =
          await assignmentsResponse.json();

        setAssignments(loadedAssignments);

        const loadedCases = await Promise.all(
          loadedAssignments.map(async (assignment) => {
            const caseResponse = await fetch(
              `${apiUrl}/cases/${assignment.case_id}`
            );

            if (!caseResponse.ok) {
              return {
                assignment,
                caseData: null,
              };
            }

            const caseData: CaseData = await caseResponse.json();

            return {
              assignment,
              caseData,
            };
          })
        );

        setCases(loadedCases);

        const feedbackResponse = await fetch(
          `${apiUrl}/feedback?limit=10`
        );

        if (feedbackResponse.ok) {
          const loadedFeedback: Feedback[] =
            await feedbackResponse.json();

          setFeedback(
            loadedFeedback.filter(
              (item) =>
                item.specialist_name ===
                loadedAssignments[0]?.specialist_name
            )
          );
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const pendingCases = useMemo(
    () =>
      cases.filter(
        ({ assignment }) =>
          formatStatus(assignment.status) !== "Feedback submitted"
      ),
    [cases]
  );

  const reviewedCount = assignments.filter(
    (assignment) =>
      formatStatus(assignment.status) === "Feedback submitted"
  ).length;

  const urgentCount = cases.filter(
    ({ caseData }) =>
      getSeverity(caseData?.urgency_score ?? null) === "High"
  ).length;

  const specialistName =
    assignments[0]?.specialist_name || "Dermatologist";

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl rounded-2xl border border-sky-100 bg-white p-8 text-slate-500 shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-sky-600">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            Good day, {specialistName}
          </h2>

          <p className="mt-2 text-slate-500">
            Here are the cases waiting on your review.
          </p>
        </div>

        <Link
          href="/dermatologists/queue"
          className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          View case queue
        </Link>
      </section>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Awaiting review</p>
          <p className="mt-5 text-3xl font-semibold text-slate-950">
            {pendingCases.length}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-600">
            Needs attention
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Reviewed</p>
          <p className="mt-5 text-3xl font-semibold text-slate-950">
            {reviewedCount}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-600">
            Feedback submitted
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Urgent cases</p>
          <p className="mt-5 text-3xl font-semibold text-slate-950">
            {urgentCount}
          </p>
          <p className="mt-2 text-xs font-medium text-red-600">
            Priority review
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total assignments</p>
          <p className="mt-5 text-3xl font-semibold text-slate-950">
            {assignments.length}
          </p>
          <p className="mt-2 text-xs font-medium text-sky-600">
            Current workload
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="font-semibold text-slate-950">
              Cases awaiting review
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Referred by clinics and pending your feedback.
            </p>
          </div>

          <Link
            href="/dermatologists/queue"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            View all
          </Link>
        </div>

        {pendingCases.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium text-slate-700">
              No cases are awaiting review
            </p>

            <p className="mt-1 text-sm text-slate-500">
              New clinic referrals will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingCases.map(({ assignment, caseData }) => {
              const severity = getSeverity(
                caseData?.urgency_score ?? null
              );

              return (
                <Link
                  key={assignment.id}
                  href={`/dermatologists/cases/${assignment.case_id}`}
                  className="flex flex-col gap-3 p-5 transition hover:bg-sky-50/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-950">
                      {caseData?.patient_name ||
                        `Case ${assignment.case_id}`}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {caseData?.patient_ref || "No patient reference"} ·{" "}
                      {caseData?.complaint || "Clinical case"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {caseData
                        ? formatDate(caseData.created_at)
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getSeverityStyle(
                        severity
                      )}`}
                    >
                      {severity}
                    </span>

                    <span className="hidden text-xs text-slate-500 md:block">
                      {formatStatus(assignment.status)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {feedback.length > 0 && (
        <section className="rounded-2xl border border-sky-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h3 className="font-semibold text-slate-950">
              Recent feedback
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your latest submitted assessments.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {feedback.slice(0, 5).map((item) => (
              <div key={item.id} className="p-5">
                <p className="font-medium text-slate-950">
                  {item.patient_name || "Patient"}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {item.final_diagnosis}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {formatDate(item.created_at)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
