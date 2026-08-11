"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// The two states used by this frontend prototype.
type TriageStatus = "analyzing" | "complete";

export default function TriagePage() {
  const router = useRouter();

  // The page starts by showing the AI analysis state.
  const [status, setStatus] = useState<TriageStatus>("analyzing");

  // Simulates a response from the future AI backend.
  useEffect(() => {
    const analysisTimer = window.setTimeout(() => {
      setStatus("complete");
    }, 1800);

    // Clear the timer if the clinician leaves the page early.
    return () => window.clearTimeout(analysisTimer);
  }, []);

  // Loading state shown while the mock AI is processing the case.
  if (status === "analyzing") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
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
              Preparing preliminary assessment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
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
      <section className="rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Recommended priority
            </p>

            <h3 className="mt-1 text-2xl font-semibold text-red-700">
              High priority
            </h3>
          </div>

          <div className="rounded-2xl bg-red-50 px-6 py-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-red-600">
              Severity score
            </p>

            <p className="mt-1 text-4xl font-bold text-red-700">78</p>

            <p className="text-xs text-red-600">out of 100</p>
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
                  Inflammatory skin condition
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Preliminary possibility · Moderate confidence
                </p>
              </li>

              <li className="rounded-xl bg-sky-50 p-4">
                <p className="text-sm font-medium text-slate-950">
                  Possible secondary infection
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Preliminary possibility · Low confidence
                </p>
              </li>
            </ul>
          </div>

          {/* Suggested action */}
          <div>
            <h4 className="font-semibold text-slate-950">
              Suggested next action
            </h4>

            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="font-medium text-red-800">
                Refer to a dermatologist
              </p>

              <p className="mt-2 text-sm leading-6 text-red-700">
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
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              Symptoms may require closer monitoring
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              Confirm duration, progression, and any changes since onset.
            </p>
          </div>

          <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
            <p className="text-sm font-medium text-sky-800">
              Image quality appears usable
            </p>

            <p className="mt-1 text-xs leading-5 text-sky-700">
              A dermatologist may still request an additional close-up image.
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
          Send to dermatologist
        </button>
      </section>
    </div>
  );
}