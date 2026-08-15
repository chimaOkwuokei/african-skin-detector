"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type QueueFilter =
  | "All cases"
  | "Urgent"
  | "Awaiting my review"
  | "Reviewed";

type Assignment = {
  id: number;
  case_id: number;
  specialist_id: number;
  specialist_name: string | null;
  status: string;
};

type QueueCase = {
  assignmentId: number;
  caseId: number;
  id: string;
  patient: string;
  patientId: string;
  concern: string;
  severity: string;
  status: string;
  date: string;
};

const SPECIALIST_ID = 1;

function getSeverityStyle(severity: string) {
  if (severity === "High") return "bg-red-50 text-red-700";
  if (severity === "Moderate") return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

function getStatusStyle(status: string) {
  if (status === "Awaiting dermatologist") {
    return "bg-sky-50 text-sky-700";
  }

  if (status === "Feedback submitted") {
    return "bg-emerald-50 text-emerald-700";
  }

  return "bg-slate-100 text-slate-600";
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

function assignmentToCase(assignment: Assignment): QueueCase {
  return {
    assignmentId: assignment.id,
    caseId: assignment.case_id,
    id: `CASE-${assignment.case_id}`,
    patient: `Case ${assignment.case_id}`,
    patientId: "Patient details unavailable",
    concern: "Dermatology case referred for review",
    severity: "Moderate",
    status: formatStatus(assignment.status),
    date: "Recently assigned",
  };
}

export default function DermatologistQueuePage() {
  const router = useRouter();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<QueueFilter>("All cases");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssignments() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://127.0.0.1:8000";

        const response = await fetch(
          `${apiUrl}/specialists/${SPECIALIST_ID}/assignments`
        );

        if (!response.ok) {
          throw new Error(`Failed to load assignments (${response.status})`);
        }

        const data: Assignment[] = await response.json();
        setAssignments(data);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load assignments"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAssignments();
  }, []);

  const cases = useMemo(
    () => assignments.map(assignmentToCase),
    [assignments]
  );

  const filteredCases = useMemo(() => {
    const searchValue = searchTerm.toLowerCase();

    return cases.filter((caseItem) => {
      const matchesSearch =
        caseItem.patient.toLowerCase().includes(searchValue) ||
        caseItem.patientId.toLowerCase().includes(searchValue) ||
        caseItem.id.toLowerCase().includes(searchValue) ||
        caseItem.concern.toLowerCase().includes(searchValue);

      const matchesFilter =
        selectedFilter === "All cases" ||
        (selectedFilter === "Urgent" && caseItem.severity === "High") ||
        (selectedFilter === "Awaiting my review" &&
          caseItem.status !== "Feedback submitted") ||
        (selectedFilter === "Reviewed" &&
          caseItem.status === "Feedback submitted");

      return matchesSearch && matchesFilter;
    });
  }, [cases, searchTerm, selectedFilter]);

  const awaitingReviewCount = cases.filter(
    (caseItem) => caseItem.status !== "Feedback submitted"
  ).length;

  const reviewedCount = cases.filter(
    (caseItem) => caseItem.status === "Feedback submitted"
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-medium text-sky-600">
          Dermatologist workspace
        </p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          Case queue
        </h2>

        <p className="mt-2 text-slate-500">
          Cases referred by clinics for your review and feedback.
        </p>
      </section>

      {loading && (
        <div className="rounded-2xl border border-sky-100 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading assignments...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total cases</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {cases.length}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Current assignments
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Urgent cases</p>
              <p className="mt-3 text-3xl font-semibold text-red-700">
                {cases.filter((c) => c.severity === "High").length}
              </p>
              <p className="mt-2 text-xs text-red-600">Priority attention</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Awaiting my review</p>
              <p className="mt-3 text-3xl font-semibold text-amber-700">
                {awaitingReviewCount}
              </p>
              <p className="mt-2 text-xs text-amber-600">Pending feedback</p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Reviewed</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-700">
                {reviewedCount}
              </p>
              <p className="mt-2 text-xs text-emerald-600">Feedback sent</p>
            </div>
          </section>

          <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search patient, case, or concern..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "All cases",
                    "Urgent",
                    "Awaiting my review",
                    "Reviewed",
                  ] as QueueFilter[]
                ).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                      selectedFilter === filter
                        ? "bg-sky-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <h3 className="font-semibold text-slate-950">Cases</h3>

              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredCases.length} of {cases.length} cases.
              </p>
            </div>

            {cases.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="font-medium text-slate-700">
                  No cases have been assigned
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Assigned clinic cases will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Patient</th>
                        <th className="px-5 py-4 font-semibold">Concern</th>
                        <th className="px-5 py-4 font-semibold">Severity</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 font-semibold">Date</th>
                        <th className="px-5 py-4 font-semibold">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredCases.map((caseItem) => (
                        <tr
                          key={caseItem.assignmentId}
                          className="transition hover:bg-sky-50/50"
                        >
                          <td className="px-5 py-5">
                            <p className="font-medium text-slate-950">
                              {caseItem.patient}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {caseItem.patientId} · {caseItem.id}
                            </p>
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-600">
                            {caseItem.concern}
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getSeverityStyle(
                                caseItem.severity
                              )}`}
                            >
                              {caseItem.severity}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                caseItem.status
                              )}`}
                            >
                              {caseItem.status}
                            </span>
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-500">
                            {caseItem.date}
                          </td>

                          <td className="px-5 py-5">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/dermatologists/cases/${caseItem.caseId}`
                                )
                              }
                              className="text-sm font-semibold text-sky-600 hover:text-sky-700"
                            >
                              Review case
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredCases.length === 0 && (
                  <div className="px-5 py-12 text-center">
                    <p className="font-medium text-slate-700">
                      No cases found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try another search term or change the selected filter.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
