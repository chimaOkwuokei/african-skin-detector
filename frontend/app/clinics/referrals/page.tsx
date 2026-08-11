"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// The possible filters for the referral queue.
type ReferralFilter =
  | "All cases"
  | "Urgent"
  | "Awaiting review"
  | "Feedback received";

// Temporary referral data.
// This will later come from the backend.
const referrals = [
  {
    id: "CASE-1024",
    patient: "Amina Ibrahim",
    patientId: "PT-0248",
    concern: "Persistent facial lesion",
    severity: "High",
    status: "Awaiting dermatologist",
    date: "10 Aug 2026",
    dermatologist: "Not assigned",
  },
  {
    id: "CASE-1023",
    patient: "Michael Okafor",
    patientId: "PT-0247",
    concern: "Itchy skin rash",
    severity: "Moderate",
    status: "AI review complete",
    date: "10 Aug 2026",
    dermatologist: "Not assigned",
  },
  {
    id: "CASE-1022",
    patient: "Grace Nwosu",
    patientId: "PT-0246",
    concern: "Recurring skin irritation",
    severity: "High",
    status: "Feedback received",
    date: "09 Aug 2026",
    dermatologist: "Dr. Sarah Williams",
  },
  {
    id: "CASE-1021",
    patient: "Chidinma Eze",
    patientId: "PT-0245",
    concern: "Lower-leg swelling",
    severity: "Low",
    status: "Managed locally",
    date: "08 Aug 2026",
    dermatologist: "Not required",
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

  if (status === "Feedback received") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "AI review complete") {
    return "bg-violet-50 text-violet-700";
  }

  return "bg-slate-100 text-slate-600";
}

export default function ReferralsPage() {
  const router = useRouter();

  // Stores the text entered into the search field.
  const [searchTerm, setSearchTerm] = useState("");

  // Stores the selected status filter.
  const [selectedFilter, setSelectedFilter] =
    useState<ReferralFilter>("All cases");

  // Filters the temporary referral list based on search and status.
  const filteredReferrals = useMemo(() => {
    return referrals.filter((referral) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        referral.patient.toLowerCase().includes(searchValue) ||
        referral.patientId.toLowerCase().includes(searchValue) ||
        referral.id.toLowerCase().includes(searchValue) ||
        referral.concern.toLowerCase().includes(searchValue);

      const matchesFilter =
        selectedFilter === "All cases" ||
        (selectedFilter === "Urgent" && referral.severity === "High") ||
        (selectedFilter === "Awaiting review" &&
          referral.status === "Awaiting dermatologist") ||
        (selectedFilter === "Feedback received" &&
          referral.status === "Feedback received");

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">Clinical workflow</p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            Referral queue
          </h2>

          <p className="mt-2 text-slate-500">
            Monitor cases sent for specialist review and follow up on feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/clinics/patients/new")}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          + Add new patient
        </button>
      </section>

      {/* Queue summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total cases</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">24</p>
          <p className="mt-2 text-xs text-slate-400">This month</p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Urgent cases</p>
          <p className="mt-3 text-3xl font-semibold text-red-700">03</p>
          <p className="mt-2 text-xs text-red-600">Priority attention</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Awaiting review</p>
          <p className="mt-3 text-3xl font-semibold text-amber-700">08</p>
          <p className="mt-2 text-xs text-amber-600">With dermatologist</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Feedback received</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-700">17</p>
          <p className="mt-2 text-xs text-emerald-600">Ready for follow-up</p>
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
                "Awaiting review",
                "Feedback received",
              ] as ReferralFilter[]
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

      {/* Referral table */}
      <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h3 className="font-semibold text-slate-950">Cases</h3>

          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredReferrals.length} of {referrals.length} cases.
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
              {filteredReferrals.map((referral) => (
                <tr key={referral.id} className="transition hover:bg-sky-50/50">
                  <td className="px-5 py-5">
                    <p className="font-medium text-slate-950">
                      {referral.patient}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {referral.patientId} · {referral.id}
                    </p>
                  </td>

                  <td className="px-5 py-5 text-sm text-slate-600">
                    {referral.concern}
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getSeverityStyle(
                        referral.severity
                      )}`}
                    >
                      {referral.severity}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        referral.status
                      )}`}
                    >
                      {referral.status}
                    </span>
                  </td>

                  <td className="px-5 py-5 text-sm text-slate-500">
                    {referral.date}
                  </td>

                  <td className="px-5 py-5">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/clinics/cases/${referral.id}`)
                      }
                      className="text-sm font-semibold text-sky-600 hover:text-sky-700"
                    >
                      View case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state for unsuccessful searches */}
        {filteredReferrals.length === 0 && (
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
