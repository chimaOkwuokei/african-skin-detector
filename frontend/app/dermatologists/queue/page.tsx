"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// The possible filters for the dermatologist's case queue.
type QueueFilter = "All cases" | "Urgent" | "Awaiting my review" | "Reviewed";

// Temporary case data.
// This will later come from the backend.
const cases = [
  {
    id: "CASE-1024",
    patient: "Amina Ibrahim",
    patientId: "PT-0248",
    concern: "Persistent facial lesion",
    severity: "High",
    status: "Awaiting dermatologist",
    date: "10 Aug 2026",
  },
  {
    id: "CASE-1023",
    patient: "Michael Okafor",
    patientId: "PT-0247",
    concern: "Itchy skin rash",
    severity: "Moderate",
    status: "AI review complete",
    date: "10 Aug 2026",
  },
  {
    id: "CASE-1022",
    patient: "Grace Nwosu",
    patientId: "PT-0246",
    concern: "Recurring skin irritation",
    severity: "High",
    status: "Feedback submitted",
    date: "09 Aug 2026",
  },
  {
    id: "CASE-1021",
    patient: "Chidinma Eze",
    patientId: "PT-0245",
    concern: "Lower-leg swelling",
    severity: "Low",
    status: "Feedback submitted",
    date: "08 Aug 2026",
  },
];

function getSeverityStyle(severity: string) {
  if (severity === "High") {
    return "bg-red-50 text-red-700";
  }

  if (severity === "Moderate") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-emerald-50 text-emerald-700";
}

function getStatusStyle(status: string) {
  if (status === "Awaiting dermatologist") {
    return "bg-sky-50 text-sky-700";
  }

  if (status === "Feedback submitted") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "AI review complete") {
    return "bg-violet-50 text-violet-700";
  }

  return "bg-slate-100 text-slate-600";
}

export default function DermatologistQueuePage() {
  const router = useRouter();

  // Stores the text entered into the search field.
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the selected status filter.
  const [selectedFilter, setSelectedFilter] = useState<QueueFilter>("All cases");

  // Filters the temporary case list based on search and status.
  const filteredCases = useMemo(() => {
    return cases.filter((caseItem) => {
      const searchValue = searchTerm.toLowerCase();

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
  }, [searchTerm, selectedFilter]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <section>
        <p className="text-sm font-medium text-sky-600">Dermatologist workspace</p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          Case queue
        </h2>

        <p className="mt-2 text-slate-500">
          Cases referred by clinics for your review and feedback.
        </p>
      </section>

      {/* Queue summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total cases</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {cases.length}
          </p>
          <p className="mt-2 text-xs text-slate-400">This month</p>
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
            {cases.filter((c) => c.status !== "Feedback submitted").length}
          </p>
          <p className="mt-2 text-xs text-amber-600">Pending feedback</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Reviewed</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-700">
            {cases.filter((c) => c.status === "Feedback submitted").length}
          </p>
          <p className="mt-2 text-xs text-emerald-600">Feedback sent</p>
        </div>
      </section>

      {/* Search and filter controls */}
      <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search input */}
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

          {/* Status filters */}
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

      {/* Case table */}
      <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h3 className="font-semibold text-slate-950">Cases</h3>

          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredCases.length} of {cases.length} cases.
          </p>
        </div>

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
                <tr key={caseItem.id} className="transition hover:bg-sky-50/50">
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
                        router.push(`/dermatologists/cases/${caseItem.id}`)
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

        {/* Empty state for unsuccessful searches */}
        {filteredCases.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="font-medium text-slate-700">No cases found</p>

            <p className="mt-1 text-sm text-slate-500">
              Try another search term or change the selected filter.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
