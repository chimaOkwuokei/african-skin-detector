"use client";

import { FormEvent, useState } from "react";

export default function NewPatientPage() {
  // This message is only for frontend demonstration.
  // It will later be replaced with navigation to the next workflow step.
  const [formMessage, setFormMessage] = useState("");

  // Handles the first version of the patient form.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // We are not sending data to a backend yet.
    // For now, we show a confirmation message in the interface.
    setFormMessage(
      "Patient information captured. The next step will collect clinical details.",
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page heading and explanation */}
      <section>
        <p className="text-sm font-medium text-sky-600">Patient intake</p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          Add a new patient
        </h2>

        <p className="mt-2 max-w-2xl text-slate-500">
          Start by recording the patient&apos;s basic information. You will add
          clinical details and lesion images in the next steps.
        </p>
      </section>

      {/* Workflow progress indicator */}
      <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Active step */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
            1
          </div>

          <div className="h-px flex-1 bg-sky-200" />

          {/* Upcoming step */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-600 ring-1 ring-sky-200">
            2
          </div>

          <div className="h-px flex-1 bg-sky-200" />

          {/* Upcoming step */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-600 ring-1 ring-sky-200">
            3
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 text-xs">
          <p className="font-medium text-sky-600">Patient information</p>
          <p className="text-center text-slate-400">Clinical details</p>
          <p className="text-right text-slate-400">Images and triage</p>
        </div>
      </section>

      {/* Patient biodata form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-950">
              Patient biodata
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter the information required to identify and follow up with the
              patient.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Medical record number */}
            <div>
              <label
                htmlFor="patientId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Patient or medical record number
              </label>

              <input
                id="patientId"
                name="patientId"
                type="text"
                placeholder="e.g. PT-0249"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter patient's full name"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Date of birth */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Date of birth
              </label>

              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Sex */}
            <div>
              <label
                htmlFor="sex"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Sex
              </label>

              <select
                id="sex"
                name="sex"
                required
                defaultValue=""
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="" disabled>
                  Select sex
                </option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="intersex">Intersex</option>
                <option value="prefer-not-to-say">
                  Prefer not to say
                </option>
              </select>
            </div>

            {/* Phone number */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. 0800 000 0000"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Community or location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Community or location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Ibadan, Oyo State"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>

        {/* Consent section */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-950">
              Teledermatology consent
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Confirm that the patient understands how their information will
              be used for clinical review.
            </p>
          </div>

          <div className="space-y-4">
            {/* Consent for care */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="teledermatologyConsent"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />

              <span className="text-sm leading-6 text-slate-600">
                The patient has consented to teledermatology assessment and
                sharing relevant information with a remote dermatologist.
              </span>
            </label>

            {/* Optional research consent */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="researchConsent"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />

              <span className="text-sm leading-6 text-slate-600">
                The patient agrees that de-identified information may be used
                for research or future model improvement.
                <span className="ml-1 text-slate-400">
                  Optional
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* Frontend-only feedback message */}
        {formMessage && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {formMessage}
          </div>
        )}

        {/* Form actions */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <a
            href="/clinics/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </a>

          <button
            type="submit"
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
          >
            Continue to clinical details
          </button>
        </div>
      </form>
    </div>
  );
}