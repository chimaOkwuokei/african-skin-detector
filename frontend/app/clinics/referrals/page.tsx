"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- API TYPES ---
interface Case {
  id: number;
  patient_id: number;
  patient_name: string;
  patient_ref: string;
  complaint: string;
  status: string;
  urgency_tier: string;
  created_at: string;
}

interface Feedback {
  id: number;
  case_id: number;
  patient_name: string;
  specialist_name: string;
  notes: string;
  recommended_action: string;
  created_at: string;
}

// The possible filters for the referral queue.
type ReferralFilter =
  | "All cases"
  | "Urgent"
  | "Awaiting review"
  | "Feedback received";

// Dynamic styling for urgency tiers
function getSeverityStyle(severity: string | null | undefined) {
  const s = (severity || "").toLowerCase();
  
  if (s.includes("high") || s.includes("urgent")) {
    return "bg-red-50 text-red-700";
  }
  if (s.includes("moderate") || s.includes("medium")) {
    return "bg-amber-50 text-amber-700";
  }
  if (s.includes("low") || s.includes("routine")) {
    return "bg-emerald-50 text-emerald-700";
  }
  
  return "bg-slate-100 text-slate-700";
}

// Dynamic styling for case statuses
function getStatusStyle(status: string | null | undefined) {
  const s = (status || "").toLowerCase();
  
  if (s.includes("submitted") || s.includes("awaiting")) {
    return "bg-sky-50 text-sky-700";
  }
  if (s.includes("feedback") || s.includes("resolved") || s.includes("closed")) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (s.includes("ai review") || s.includes("analyzed")) {
    return "bg-violet-50 text-violet-700";
  }
  
  return "bg-slate-100 text-slate-600";
}

// Helper to format date nicely (e.g., "10 Aug 2026")
function formatDate(dateString: string) {
  if (!dateString) return "Unknown Date";
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}

export default function ReferralsPage() {
  const router = useRouter();

  const [cases, setCases] = useState<Case[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ReferralFilter>("All cases");

  // Fetch all cases on mount
  useEffect(() => {
    async function fetchCases() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        
         const [casesRes, feedbacksRes] = await Promise.all([
          fetch(`${baseUrl}/cases`),
          fetch(`${baseUrl}/feedback?limit=10`),
        ]);

        if ( !casesRes.ok || !feedbacksRes.ok) {
          throw new Error("Failed to fetch one or more dashboard metrics");
        }

        const [casesData, feedbacksData] = await Promise.all([
          casesRes.json(),
          feedbacksRes.json(),
        ]);

         const sortedData = casesData.sort((a: Case, b: Case) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setCases(sortedData);
        setFeedbacks(feedbacksData);
        
       
      } catch (err) {
        console.error("Error fetching cases:", err);
        setError("Unable to load the referral queue.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCases();
  }, []);

  // --- DYNAMIC SUMMARY STATS ---
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const casesThisMonth = cases.filter(c => {
    const d = new Date(c.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const urgentCasesCount = cases.filter(c => (c.urgency_tier || "").toLowerCase().includes("high")).length;
  // Assuming "submitted" or similar means it's waiting for a doctor
  const awaitingReviewCount = cases.filter(c => (c.status || "").toLowerCase().includes("submitted")).length;
  // Assuming "resolved" or "feedback" means the doctor replied
  const feedbackReceivedCount = feedbacks.length;


  // --- FILTER & SEARCH LOGIC ---
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const searchValue = searchTerm.toLowerCase();
      
      const patientName = (c.patient_name || "").toLowerCase();
      const patientRef = (c.patient_ref || `PT-${c.patient_id}`).toLowerCase();
      const caseIdStr = `case-${c.id}`.toLowerCase();
      const concern = (c.complaint || "").toLowerCase();

      const matchesSearch =
        patientName.includes(searchValue) ||
        patientRef.includes(searchValue) ||
        caseIdStr.includes(searchValue) ||
        concern.includes(searchValue);

      const tier = (c.urgency_tier || "").toLowerCase();
      const stat = (c.status || "").toLowerCase();

      const matchesFilter =
        selectedFilter === "All cases" ||
        (selectedFilter === "Urgent" && tier.includes("high")) ||
        (selectedFilter === "Awaiting review" && stat.includes("submitted")) || 
        (selectedFilter === "Feedback received" && (stat.includes("resolved") || stat.includes("feedback") || stat.includes("closed")));

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter, cases]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 font-poppins">
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

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Queue summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total cases</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {isLoading ? "..." : casesThisMonth.toString().padStart(2, '0')}
          </p>
          <p className="mt-2 text-xs text-slate-400">This month</p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Urgent cases</p>
          <p className="mt-3 text-3xl font-semibold text-red-700">
            {isLoading ? "..." : urgentCasesCount.toString().padStart(2, '0')}
          </p>
          <p className="mt-2 text-xs text-red-600">Priority attention</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Awaiting review</p>
          <p className="mt-3 text-3xl font-semibold text-amber-700">
            {isLoading ? "..." : awaitingReviewCount.toString().padStart(2, '0')}
          </p>
          <p className="mt-2 text-xs text-amber-600">With dermatologist</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Feedback received</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-700">
            {isLoading ? "..." : feedbackReceivedCount.toString().padStart(2, '0')}
          </p>
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
            {isLoading ? "Loading cases..." : `Showing ${filteredCases.length} of ${cases.length} cases.`}
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500 animate-pulse">
                    Loading queue...
                  </td>
                </tr>
              ) : filteredCases.length > 0 ? (
                filteredCases.map((c) => (
                  <tr key={c.id} className="transition hover:bg-sky-50/50">
                    <td className="px-5 py-5">
                      <p className="font-medium text-slate-950 capitalize">
                        {c.patient_name || "Unknown Patient"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400 uppercase">
                        {c.patient_ref || `PT-${c.patient_id}`} · CASE-{c.id}
                      </p>
                    </td>

                    <td className="px-5 py-5 text-sm text-slate-600">
                      {c.complaint || "No complaint recorded"}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize whitespace-nowrap ${getSeverityStyle(
                          c.urgency_tier
                        )}`}
                      >
                        {c.urgency_tier || "Pending AI"}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize whitespace-nowrap ${getStatusStyle(
                          c.status
                        )}`}
                      >
                        {c.status || "Submitted"}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-sm text-slate-500 whitespace-nowrap">
                      {formatDate(c.created_at)}
                    </td>

                    <td className="px-5 py-5">
                      <button
                        type="button"
                        onClick={() => router.push(`/clinics/cases/${c.id}`)}
                        className="text-sm font-semibold text-sky-600 hover:text-sky-700 whitespace-nowrap"
                      >
                        View case
                      </button>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Empty state for unsuccessful searches */}
        {!isLoading && filteredCases.length === 0 && (
          <div className="px-5 py-12 text-center border-t border-slate-100">
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