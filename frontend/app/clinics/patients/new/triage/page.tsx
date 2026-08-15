"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the shape of the data returned from the API
interface AnalysisResult {
  id: number;
  diagnosis_text: string;
  urgency_tier: string;
  urgency_score: number;
  red_flags: string;
  model_version: string;
}

type TriageStatus = "analyzing" | "complete" | "error";

export default function TriagePage() {
  const router = useRouter();

  const [status, setStatus] = useState<TriageStatus>("analyzing");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchAnalysis() {
      const caseId = localStorage.getItem("current_case_id");

      if (!caseId) {
        setErrorMessage("Missing case record. Please restart the process.");
        setStatus("error");
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        
        const response = await fetch(`${baseUrl}/cases/${caseId}/analyses`, {
          headers: {
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch analysis (${response.status})`);
        }

        const data: AnalysisResult[] = await response.json();

        if (!data || data.length === 0) {
          throw new Error("No analysis results found for this case.");
        }

        // Assuming the latest analysis is what we want (using the first item)
        setAnalysis(data[0]);
        setStatus("complete");
      } catch (error) {
        console.error("Failed to load triage data:", error);
        setErrorMessage(error instanceof Error ? error.message : "An error occurred");
        setStatus("error");
      }
    }

    fetchAnalysis();
  }, []);

  // Helper to determine color scheme based on the urgency tier
  const getTierColors = (tier: string = "") => {
    const t = tier.toLowerCase();
    if (t.includes("high") || t.includes("urgent")) {
      return { border: "border-red-200", bgText: "bg-red-50 text-red-700", text: "text-red-700", subText: "text-red-600" };
    }
    if (t.includes("medium") || t.includes("moderate")) {
      return { border: "border-amber-200", bgText: "bg-amber-50 text-amber-700", text: "text-amber-700", subText: "text-amber-600" };
    }
    return { border: "border-sky-200", bgText: "bg-sky-50 text-sky-700", text: "text-sky-700", subText: "text-sky-600" };
  };

  if (status === "analyzing") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center font-poppins">
        <div className="w-full rounded-2xl border border-sky-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-slate-950">
            Analyzing case
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            The system is reviewing the clinical information and lesion images
            to prepare a preliminary triage result.
          </p>

          <div className="mx-auto mt-6 max-w-sm space-y-3 text-left text-sm">
            <p className="flex items-center gap-3 text-slate-600">
              <span className="text-emerald-500">✓</span>
              Clinical information received
            </p>

            <p className="flex items-center gap-3 text-slate-600">
              <span className="text-emerald-500">✓</span>
              Lesion images received
            </p>

            <p className="flex items-center gap-3 text-sky-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
              Retrieving preliminary assessment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center font-poppins">
        <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-red-700">Analysis Error</h2>
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-100 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Derive dynamic styling
  const colors = getTierColors(analysis?.urgency_tier);

  return (
    <div className="mx-auto max-w-5xl space-y-8 font-poppins">
      {/* Page introduction */}
      <section>
        <p className="text-sm font-medium text-sky-600">
          Patient intake · AI triage
        </p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          Preliminary assessment
        </h2>

        <p className="mt-2 max-w-2xl text-slate-500">
          Review the preliminary result before deciding whether the case should
          be referred to a dermatologist.
        </p>
      </section>

      {/* Main triage result */}
      <section className={`rounded-2xl border ${colors.border} bg-white shadow-sm`}>
        <div className="flex flex-col gap-5 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Recommended priority
            </p>

            <h3 className={`mt-1 text-2xl font-semibold capitalize ${colors.text}`}>
              {analysis?.urgency_tier || "Unknown"}
            </h3>
          </div>

          <div className={`rounded-2xl px-6 py-4 text-center ${colors.bgText}`}>
            <p className={`text-xs font-medium uppercase tracking-wide ${colors.subText}`}>
              Severity score
            </p>

            <p className="mt-1 text-4xl font-bold">{analysis?.urgency_score || 0}</p>

            <p className={`text-xs ${colors.subText}`}>out of 100</p>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Preliminary findings */}
          <div>
            <h4 className="font-semibold text-slate-950">
              Preliminary findings
            </h4>

            <ul className="mt-4 space-y-3">
              <li className="rounded-xl bg-sky-50 p-4">
                <p className="text-sm font-medium text-slate-950">
                  {analysis?.diagnosis_text || "No diagnosis provided."}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  AI Model: {analysis?.model_version || "Unknown"}
                </p>
              </li>
            </ul>
          </div>

          {/* Suggested action */}
          <div>
            <h4 className="font-semibold text-slate-950">
              Suggested next action
            </h4>

            <div className={`mt-4 rounded-xl border p-4 ${colors.border} ${colors.bgText}`}>
              <p className="font-medium">
                {analysis?.urgency_tier?.toLowerCase().includes("high") 
                  ? "Refer to a dermatologist immediately" 
                  : "Routine dermatological review"}
              </p>

              <p className={`mt-2 text-sm leading-6 ${colors.subText}`}>
                Specialist review is recommended based on the reported
                symptoms, images, and preliminary severity score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Concerning features */}
      <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-950">
          Features requiring clinician attention
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {analysis?.red_flags ? (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">
                Red Flags Detected
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-700">
                {analysis.red_flags}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">
                No acute red flags detected
              </p>
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                The model did not identify immediate signs of systemic emergency.
              </p>
            </div>
          )}

          <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
            <p className="text-sm font-medium text-sky-800">
              Image review note
            </p>
            <p className="mt-1 text-xs leading-5 text-sky-700">
              A dermatologist may still request additional or closer images during the tele-consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Safety disclaimer */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">
          Clinical decision-support notice
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          This is a preliminary AI-assisted assessment. It is not a definitive
          diagnosis and does not replace clinical judgment or specialist
          review.
        </p>
      </section>

      {/* Actions available to the clinician */}
      <section className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Review information
        </button>

        <button
          type="button"
          onClick={() => router.push("/clinics/referrals")}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          View Referrals
        </button>
      </section>
    </div>
  );
}