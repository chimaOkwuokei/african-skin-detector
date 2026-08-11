"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CaseDetailsPage() {
  const router = useRouter();

  // Stores the clinician's note before sending it to the dermatologist.
  const [clinicianNote, setClinicianNote] = useState("");

  // Displays confirmation after the clinician submits a note.
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Handles the frontend-only dermatologist referral action.
  function handleSendReferral() {
    router.push("/clinics/referrals");
  }

  // Handles the clinician note form.
  function handleNoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // This will later save the note through the backend API.
    setFeedbackMessage("Clinical note saved successfully.");
    setClinicianNote("");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to referrals
          </button>

          <p className="text-sm font-medium text-sky-600">Case CASE-1024</p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            Amina Ibrahim
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            PT-0248 · Submitted 10 August 2026
          </p>
        </div>

        {/* Current case status */}
        <span className="w-fit rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
          Awaiting dermatologist
        </span>
      </section>

      {/* Main two-column case overview */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Patient and clinical information */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">
              Patient information
            </h3>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Age
                </p>
                <p className="mt-1 text-sm text-slate-700">34 years</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Sex
                </p>
                <p className="mt-1 text-sm text-slate-700">Female</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>
                <p className="mt-1 text-sm text-slate-700">Ibadan, Oyo State</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Affected area
                </p>
                <p className="mt-1 text-sm text-slate-700">Face</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">
              Clinical information
            </h3>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Main complaint
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Persistent itchy lesion on the face that has gradually
                  increased in size.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Duration
                  </p>
                  <p className="mt-1 text-sm text-slate-700">3 weeks</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Onset
                  </p>
                  <p className="mt-1 text-sm text-slate-700">Gradual</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Symptoms
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    Itching, scaling
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Clinician notes
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Patient reports no previous episode. No known medication
                  allergies were reported.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* AI triage summary */}
        <section className="rounded-2xl border border-red-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <p className="text-sm font-medium text-slate-500">
              Preliminary AI triage
            </p>

            <div className="mt-2 flex items-end justify-between gap-4">
              <h3 className="text-2xl font-semibold text-red-700">
                High priority
              </h3>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Severity
                </p>
                <p className="text-3xl font-bold text-red-700">78</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Suggested action
              </p>

              <div className="mt-2 rounded-xl bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">
                  Refer to a dermatologist
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  Specialist review is recommended based on the current
                  information and images.
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                Preliminary findings
              </p>

              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="rounded-lg bg-slate-50 px-3 py-2">
                  Inflammatory skin condition
                </li>

                <li className="rounded-lg bg-slate-50 px-3 py-2">
                  Possible secondary infection
                </li>
              </ul>
            </div>

            <p className="border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
              AI results are preliminary decision support and do not replace
              clinical judgment or specialist diagnosis.
            </p>

            <button
              type="button"
              onClick={handleSendReferral}
              className="w-full rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              Send to dermatologist
            </button>
          </div>
        </section>
      </section>

      {/* Lesion image preview area */}
      <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-950">
            Lesion images
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Images submitted during the patient consultation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder image cards until uploaded images are connected */}
          <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 via-orange-200 to-amber-300">
            <span className="rounded-lg bg-white/70 px-3 py-2 text-xs font-medium text-amber-800">
              Front view
            </span>
          </div>

          <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 via-rose-200 to-orange-300">
            <span className="rounded-lg bg-white/70 px-3 py-2 text-xs font-medium text-orange-800">
              Close-up view
            </span>
          </div>

          <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 via-slate-200 to-sky-300">
            <span className="rounded-lg bg-white/70 px-3 py-2 text-xs font-medium text-slate-700">
              Side view
            </span>
          </div>
        </div>
      </section>

      {/* Clinician notes and specialist feedback */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Add a note for the dermatologist */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">
            Add clinical note
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add information that may help the dermatologist review this case.
          </p>

          <form onSubmit={handleNoteSubmit} className="mt-5 space-y-4">
            <textarea
              value={clinicianNote}
              onChange={(event) => setClinicianNote(event.target.value)}
              rows={5}
              placeholder="Write an additional note..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />

            {feedbackMessage && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {feedbackMessage}
              </p>
            )}

            <button
              type="submit"
              className="rounded-xl border border-sky-200 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              Save note
            </button>
          </form>
        </section>

        {/* Dermatologist feedback panel */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-950">
              Dermatologist feedback
            </h3>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              Awaiting response
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-sm font-medium text-slate-700">
              No specialist feedback yet
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Once a dermatologist reviews this case, their recommendation will
              appear here.
            </p>
          </div>
        </section>
      </section>
    </div>
  );
}
