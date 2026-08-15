"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const symptoms = [
  "Itching",
  "Pain",
  "Burning",
  "Scaling",
  "Bleeding",
  "Swelling",
  "Discharge",
  "Change in colour",
];

export default function ClinicalDetailsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Retrieve the patient ID we just created in the previous step
    const patientId = localStorage.getItem("current_patient_id");
    
    if (!patientId) {
      alert("Missing patient record. Please go back and create the patient first.");
      return;
    }

    setIsLoading(true);
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    // Extract all checked symptoms into a single comma-separated string
    const selectedSymptoms = formData.getAll("symptoms").join(", ");

    // Structure the payload exactly as the /cases endpoint expects
    const payload = {
      patient_id: Number(patientId),
      // submitted_by: 1, 
      complaint: (formData.get("mainComplaint") as string) || "",
      duration_value: Number(formData.get("duration")) || 0,
      duration_unit: (formData.get("durationUnit") as string) || "",
      onset: (formData.get("onset") as string) || "",
      symptoms: selectedSymptoms,
      body_area: (formData.get("bodyArea") as string) || "",
      affected_area_extent: (formData.get("affectedAreas") as string) || "",
      medical_history: (formData.get("medicalHistory") as string) || "",
      medication: (formData.get("medication") as string) || "",
      allergies: (formData.get("allergies") as string) || "",
      clinician_notes: (formData.get("clinicianNotes") as string) || "",
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${baseUrl}/cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Case created:", data);
      
      // Optionally store the case ID if the next step (Images) needs it!
      if (data.id) {
        localStorage.setItem("current_case_id", data.id);
      }

      // Clear the form
      formElement.reset();

      // Continue to the lesion image upload step.
      router.push("/clinics/patients/new/images");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Failed to create case:", errorMessage);
      alert(`Failed to save clinical details: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page introduction */}
      <section>
        <p className="text-sm font-medium text-sky-600">Patient intake · Step 2</p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          Clinical details
        </h2>

        <p className="mt-2 max-w-2xl text-slate-500">
          Record the symptoms and history that will help the clinician and AI
          system understand the patient&apos;s condition.
        </p>
      </section>

      {/* Workflow progress indicator */}
      <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Completed first step */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            ✓
          </div>

          <div className="h-px flex-1 bg-sky-300" />

          {/* Current step */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
            2
          </div>

          <div className="h-px flex-1 bg-sky-200" />

          {/* Upcoming step */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-600 ring-1 ring-sky-200">
            3
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 text-xs">
          <p className="font-medium text-emerald-600">Patient information</p>
          <p className="text-center font-medium text-sky-600">
            Clinical details
          </p>
          <p className="text-right text-slate-400">Images and triage</p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main complaint */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-950">
              Current condition
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Describe the patient&apos;s main concern.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="mainComplaint"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Main complaint
              </label>

              <textarea
                id="mainComplaint"
                name="mainComplaint"
                rows={4}
                required
                placeholder="Describe what brought the patient to the clinic..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* Duration number */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Duration
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 5"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              {/* Duration unit */}
              <div>
                <label
                  htmlFor="durationUnit"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Duration unit
                </label>

                <select
                  id="durationUnit"
                  name="durationUnit"
                  defaultValue="days"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>

              {/* Onset */}
              <div>
                <label
                  htmlFor="onset"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Onset
                </label>

                <select
                  id="onset"
                  name="onset"
                  defaultValue=""
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="" disabled>
                    Select onset
                  </option>
                  <option value="sudden">Sudden</option>
                  <option value="gradual">Gradual</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms section */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-950">
              Symptoms
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select all symptoms that apply to the patient.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {symptoms.map((symptom) => (
              <label
                key={symptom}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-600 transition hover:border-sky-300 hover:bg-sky-50"
              >
                <input
                  type="checkbox"
                  name="symptoms"
                  value={symptom}
                  className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />

                {symptom}
              </label>
            ))}
          </div>
        </section>

        {/* Location and medical history */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-950">
              Additional clinical information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              This information may help with triage and specialist review.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Affected body area */}
            <div>
              <label
                htmlFor="bodyArea"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Affected body area
              </label>

              <select
                id="bodyArea"
                name="bodyArea"
                required
                defaultValue=""
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="" disabled>
                  Select body area
                </option>
                <option value="face">Face</option>
                <option value="scalp">Scalp</option>
                <option value="neck">Neck</option>
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="arms">Arms</option>
                <option value="hands">Hands</option>
                <option value="legs">Legs</option>
                <option value="feet">Feet</option>
                <option value="multiple">Multiple areas</option>
              </select>
            </div>

            {/* Number of affected areas */}
            <div>
              <label
                htmlFor="affectedAreas"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Number of affected areas
              </label>

              <select
                id="affectedAreas"
                name="affectedAreas"
                defaultValue=""
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="" disabled>
                  Select number
                </option>
                <option value="one">One area</option>
                <option value="few">Two to five areas</option>
                <option value="many">More than five areas</option>
                <option value="widespread">Widespread</option>
              </select>
            </div>

            {/* Medical history */}
            <div className="md:col-span-2">
              <label
                htmlFor="medicalHistory"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Relevant medical history
              </label>

              <textarea
                id="medicalHistory"
                name="medicalHistory"
                rows={4}
                placeholder="Include conditions such as diabetes, HIV, allergies, or previous skin conditions..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Current medication */}
            <div>
              <label
                htmlFor="medication"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Current medication
              </label>

              <textarea
                id="medication"
                name="medication"
                rows={3}
                placeholder="List current medication or write None..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Allergies */}
            <div>
              <label
                htmlFor="allergies"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Known allergies
              </label>

              <textarea
                id="allergies"
                name="allergies"
                rows={3}
                placeholder="List known allergies or write None..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Clinician notes */}
            <div className="md:col-span-2">
              <label
                htmlFor="clinicianNotes"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Clinician notes
              </label>

              <textarea
                id="clinicianNotes"
                name="clinicianNotes"
                rows={4}
                placeholder="Add any other observations that may help with specialist review..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>
        </section>

        {/* Form navigation */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Continue to images"}
          </button>
        </div>
      </form>
    </div>
  );
}