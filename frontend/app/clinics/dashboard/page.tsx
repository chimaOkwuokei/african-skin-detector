"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// --- TYPES BASED ON YOUR API SCHEMAS ---
interface Patient {
  id: number;
  name: string;
  date_of_birth: string;
  // ... other fields omitted for brevity
}

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

// Returns different colors for each severity level.
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
  
  // Fallback for unassigned or unknown tiers
  return "bg-slate-100 text-slate-700";
}

// Helper to format dates nicely (e.g., "Today, 10:32 AM" or "Aug 14, 2026")
function formatFeedbackTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  
  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ClinicDashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all dashboard data concurrently
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

        const [patientsRes, casesRes, feedbacksRes] = await Promise.all([
          fetch(`${baseUrl}/patients`),
          fetch(`${baseUrl}/cases`),
          fetch(`${baseUrl}/feedback?limit=10`),
        ]);

        if (!patientsRes.ok || !casesRes.ok || !feedbacksRes.ok) {
          throw new Error("Failed to fetch one or more dashboard metrics");
        }

        const [patientsData, casesData, feedbacksData] = await Promise.all([
          patientsRes.json(),
          casesRes.json(),
          feedbacksRes.json(),
        ]);

        setPatients(patientsData);
        setCases(casesData);
        setFeedbacks(feedbacksData);
      } catch (err) {
        console.error("Dashboard data error:", err);
        setError("Unable to load latest dashboard data. Showing local defaults if available.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // --- DYNAMIC DASHBOARD STATS ---
  const totalPatients = patients.length;
  // Count cases that don't have feedback/aren't resolved (assuming 'submitted' or similar)
  const awaitingTriage = cases.filter(c => c.status?.toLowerCase() !== "resolved" && c.status?.toLowerCase() !== "closed").length;
  // Count cases with High/Urgent tier
  const urgentCases = cases.filter(c => c.urgency_tier?.toLowerCase().includes("high")).length;
  const totalFeedback = feedbacks.length;

  const dashboardStats = [
    {
      label: "Patients registered",
      value: totalPatients.toString().padStart(2, '0'),
      note: "Total records",
      noteColor: "text-emerald-600",
    },
    {
      label: "Active cases",
      value: awaitingTriage.toString().padStart(2, '0'),
      note: "Needs attention",
      noteColor: "text-amber-600",
    },
    {
      label: "Urgent cases",
      value: urgentCases.toString().padStart(2, '0'),
      note: "Priority review",
      noteColor: "text-red-600",
    },
    {
      label: "Feedback received",
      value: totalFeedback.toString().padStart(2, '0'),
      note: "Recent specialist notes",
      noteColor: "text-sky-600",
    },
  ];

  // Dynamically sort cases by creation date (newest first) and grab top 5
  const recentReferrals = [...cases]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Grab the current date dynamically
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 font-poppins">
      {/* Dashboard welcome section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-sky-600">
            {todayFormatted}
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            Good evening, Dr. N
          </h2>

          <p className="mt-2 text-slate-500">
            Here is the latest activity from your clinic.
          </p>
        </div>

        {/* Main action for beginning a new clinical workflow */}
        <Link
          href="/clinics/patients/new"
          className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          + Add new patient
        </Link>
      </section>

      {/* Error State Notice */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary statistic cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            </div>

            <p className="mt-5 text-3xl font-semibold text-slate-950">
              {isLoading ? "..." : stat.value}
            </p>

            <p className={`mt-2 text-xs font-medium ${stat.noteColor}`}>
              {stat.note}
            </p>
          </div>
        ))}
      </section>

      {/* Referral list and dermatologist feedback */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        
        {/* Recent referral cases */}
        <div className="rounded-2xl border border-sky-100 bg-white shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h3 className="font-semibold text-slate-950">Recent referrals</h3>
              <p className="mt-1 text-sm text-slate-500">
                Cases requiring monitoring or action.
              </p>
            </div>
            <a
              href="/clinics/referrals"
              className="text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              View all
            </a>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-slate-500 animate-pulse">Loading recent cases...</div>
            ) : recentReferrals.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No recent referrals found.</div>
            ) : (
              recentReferrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-950 capitalize">
                      {referral.patient_name || "Unknown Patient"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 truncate max-w-[250px]">
                      {referral.patient_ref || `PT-${referral.patient_id}`} · {referral.complaint || "No complaint recorded"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize whitespace-nowrap ${getSeverityStyle(
                        referral.urgency_tier
                      )}`}
                    >
                      {referral.urgency_tier || "Pending AI"}
                    </span>

                    <span className="hidden text-xs text-slate-500 md:block capitalize whitespace-nowrap w-32 text-right">
                      {referral.status || "Submitted"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent dermatologist feedback */}
        <div className="rounded-2xl border border-sky-100 bg-white shadow-sm flex flex-col h-full">
          <div className="border-b border-slate-100 p-5">
            <h3 className="font-semibold text-slate-950">
              Dermatologist feedback
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Recent specialist responses.
            </p>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-slate-500 animate-pulse">Loading feedback...</div>
            ) : feedbacks.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">No feedback received yet.</div>
            ) : (
              feedbacks.map((feedback) => (
                <div key={feedback.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950 capitalize">
                      {feedback.patient_name || `Case #${feedback.case_id}`}
                    </p>

                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatFeedbackTime(feedback.created_at)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-5 text-slate-600 line-clamp-2">
                    {feedback.recommended_action || feedback.notes || "Treatment recommendation is ready for review."}
                  </p>

                  <p className="mt-3 text-xs font-medium text-sky-600 capitalize">
                    {feedback.specialist_name || "Specialist"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}