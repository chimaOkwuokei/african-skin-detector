"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const SPECIALIST_ID = 1;

const recommendedActions = [
  "Refer for biopsy",
  "Prescribe treatment",
  "Monitor at clinic",
  "No referral needed",
];

type CaseData = {
  id: number;
  patient_id: number;
  complaint: string | null;
  duration_value: number | null;
  duration_unit: string | null;
  onset: string | null;
  symptoms: string | null;
  body_area: string | null;
  affected_area_extent: string | null;
  medical_history: string | null;
  medication: string | null;
  allergies: string | null;
  clinician_notes: string | null;
  status: string;
  created_at: string;
  assignment_status: string | null;
  specialist_name: string | null;
  patient_name: string | null;
  patient_ref: string | null;
  urgency_tier: string | null;
  urgency_score: number | null;
  diagnosis_text: string | null;
};

type Patient = {
  id: number;
  name: string;
  date_of_birth: string | null;
  age: number | null;
  sex: string | null;
  phone: string | null;
  location: string | null;
  history_notes: string | null;
};

type Assignment = {
  id: number;
  case_id: number;
  specialist_id: number;
  specialist_name: string | null;
  status: string;
};

type Feedback = {
  id: number;
  case_id: number | null;
  final_diagnosis: string;
  agreed_with_ai: boolean;
  notes: string | null;
  recommended_action: string | null;
  specialist_name: string | null;
  patient_name: string | null;
  created_at: string;
};

type LesionImage = {
  id: number;
  file_path: string;
  body_site: string | null;
};

function display(value: string | number | null | undefined) {
  return value === null || value === undefined || value === ""
    ? "Not provided"
    : String(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getImageUrl(filePath: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const normalizedPath = filePath.replace(/^\.?\//, "").replace(/\\/g, "/");

  if (normalizedPath.startsWith("uploads/")) {
    return `${apiUrl}/${normalizedPath}`;
  }

  return `${apiUrl}/uploads/${normalizedPath}`;
}

export default function DermatologistCaseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const caseId = params.id;

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [images, setImages] = useState<LesionImage[]>([]);
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(
    null
  );

  const [finalDiagnosis, setFinalDiagnosis] = useState("");
  const [agreedWithAi, setAgreedWithAi] = useState(true);
  const [notes, setNotes] = useState("");
  const [recommendedAction, setRecommendedAction] = useState(
    recommendedActions[0]
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCase() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

        const caseResponse = await fetch(`${apiUrl}/cases/${caseId}`);

        if (!caseResponse.ok) {
          throw new Error(`Failed to load case (${caseResponse.status})`);
        }

        const loadedCase: CaseData = await caseResponse.json();
        setCaseData(loadedCase);

        const patientResponse = await fetch(
          `${apiUrl}/patients/${loadedCase.patient_id}`
        );

        if (patientResponse.ok) {
          const loadedPatient: Patient = await patientResponse.json();
          setPatient(loadedPatient);
        }

        const imagesResponse = await fetch(
          `${apiUrl}/cases/${loadedCase.id}/images`
        );

        if (imagesResponse.ok) {
          const loadedImages: LesionImage[] = await imagesResponse.json();
          setImages(loadedImages);
        }

        const assignmentsResponse = await fetch(
          `${apiUrl}/specialists/${SPECIALIST_ID}/assignments`
        );

        if (!assignmentsResponse.ok) {
          throw new Error("Failed to load specialist assignments");
        }

        const assignments: Assignment[] = await assignmentsResponse.json();

        const matchingAssignment =
          assignments.find((item) => item.case_id === loadedCase.id) || null;

        setAssignment(matchingAssignment);

        if (matchingAssignment) {
          const feedbackResponse = await fetch(
            `${apiUrl}/assignments/${matchingAssignment.id}/feedback`
          );

          if (feedbackResponse.ok) {
            const feedback: Feedback = await feedbackResponse.json();

            setExistingFeedback(feedback);
            setFinalDiagnosis(feedback.final_diagnosis);
            setAgreedWithAi(feedback.agreed_with_ai);
            setNotes(feedback.notes || "");
            setRecommendedAction(
              feedback.recommended_action || recommendedActions[0]
            );
            setFeedbackSubmitted(true);
          }
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load case"
        );
      } finally {
        setLoading(false);
      }
    }

    if (caseId) {
      loadCase();
    }
  }, [caseId]);

  async function handleFeedbackSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!assignment) {
      setError("This case has no specialist assignment.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(
        `${apiUrl}/assignments/${assignment.id}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            final_diagnosis: finalDiagnosis,
            agreed_with_ai: agreedWithAi,
            notes: notes || null,
            recommended_action: recommendedAction,
          }),
        }
      );

      if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
          responseText || `Feedback submission failed (${response.status})`
        );
      }

      const feedback: Feedback = await response.json();

      setExistingFeedback(feedback);
      setFeedbackSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit feedback"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl rounded-2xl border border-sky-100 bg-white p-8 text-slate-500 shadow-sm">
        Loading case...
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-sky-600"
        >
          ← Back to case queue
        </button>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  const patientName =
    patient?.name || caseData.patient_name || "Unknown patient";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to case queue
          </button>

          <p className="text-sm font-medium text-sky-600">
            Case CASE-{caseData.id}
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            {patientName}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {display(caseData.patient_ref)} · Referred{" "}
            {formatDate(caseData.created_at)}
          </p>
        </div>

        <span className="w-fit rounded-full bg-sky-50 px-4 py-2 text-sm font-medium capitalize text-sky-700">
          {caseData.assignment_status || caseData.status}
        </span>
      </section>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
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

                <p className="mt-1 text-sm text-slate-700">
                  {display(patient?.age)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Sex
                </p>

                <p className="mt-1 text-sm capitalize text-slate-700">
                  {display(patient?.sex)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {display(patient?.location)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Affected area
                </p>

                <p className="mt-1 text-sm capitalize text-slate-700">
                  {display(caseData.body_area)}
                </p>
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
                  {display(caseData.complaint)}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Duration
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {caseData.duration_value
                      ? `${caseData.duration_value} ${display(
                          caseData.duration_unit
                        )}`
                      : "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Onset
                  </p>

                  <p className="mt-1 text-sm capitalize text-slate-700">
                    {display(caseData.onset)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Symptoms
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {display(caseData.symptoms)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Clinician notes
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {display(caseData.clinician_notes)}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Medical history
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {display(
                      caseData.medical_history || patient?.history_notes
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Medication
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {display(caseData.medication)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Allergies
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {display(caseData.allergies)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-sky-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <p className="text-sm font-medium text-slate-500">
              Preliminary AI triage
            </p>

            <div className="mt-2 flex items-end justify-between gap-4">
              <h3 className="text-2xl font-semibold text-sky-700">
                {display(caseData.urgency_tier)}
              </h3>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Severity score
                </p>

                <p className="text-3xl font-bold text-sky-700">
                  {display(caseData.urgency_score)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="rounded-xl bg-sky-50 p-4">
              <p className="text-sm leading-6 text-sky-800">
                AI results are preliminary decision support and do not replace
                clinical judgment or specialist diagnosis.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                Diagnosis text
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {display(caseData.diagnosis_text)}
              </p>
            </div>
          </div>
        </section>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-950">
            Lesion images
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Images submitted during the patient consultation.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-8 text-center">
            <p className="font-medium text-slate-700">
              No lesion images uploaded
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Uploaded images will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <figure
                key={image.id}
                className="overflow-hidden rounded-xl border border-slate-100"
              >
                <Image
                  src={getImageUrl(image.file_path)}
                  alt={`Lesion image${
                    image.body_site ? ` of ${image.body_site}` : ""
                  }`}
                  width={800}
                  height={800}
                  unoptimized
                  className="aspect-square w-full object-cover"
                />

                <figcaption className="bg-slate-50 px-3 py-2 text-sm capitalize text-slate-600">
                  {image.body_site || "Unspecified site"}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-950">Your feedback</h3>

        <p className="mt-1 text-sm text-slate-500">
          Your assessment and recommendation will be sent back to the referring
          clinic.
        </p>

        {!assignment && (
          <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            This case does not have an assignment for the current specialist.
          </div>
        )}

        {feedbackSubmitted && existingFeedback ? (
          <div className="mt-5 rounded-xl bg-emerald-50 p-5">
            <p className="text-sm font-medium text-emerald-800">
              Feedback submitted successfully.
            </p>

            <p className="mt-2 text-sm font-semibold text-emerald-800">
              Final diagnosis
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-emerald-700">
              {existingFeedback.final_diagnosis}
            </p>

            <p className="mt-3 text-sm text-emerald-700">
              Agreed with AI assessment:{" "}
              {existingFeedback.agreed_with_ai ? "Yes" : "No"}
            </p>

            {existingFeedback.notes && (
              <>
                <p className="mt-3 text-sm font-semibold text-emerald-800">
                  Clinical notes
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-emerald-700">
                  {existingFeedback.notes}
                </p>
              </>
            )}

            {existingFeedback.recommended_action && (
              <p className="mt-3 text-sm text-emerald-700">
                Recommended action: {existingFeedback.recommended_action}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="finalDiagnosis"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Final diagnosis
              </label>

              <input
                id="finalDiagnosis"
                value={finalDiagnosis}
                onChange={(event) => setFinalDiagnosis(event.target.value)}
                required
                disabled={!assignment || submitting}
                placeholder="Enter your final diagnosis..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Clinical notes
              </label>

              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                disabled={!assignment || submitting}
                placeholder="Describe your assessment and supporting observations..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={agreedWithAi}
                onChange={(event) => setAgreedWithAi(event.target.checked)}
                disabled={!assignment || submitting}
                className="h-4 w-4 rounded border-slate-300 text-sky-500"
              />
              I agree with the preliminary AI assessment
            </label>

            <div>
              <label
                htmlFor="recommendedAction"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Recommended action
              </label>

              <select
                id="recommendedAction"
                value={recommendedAction}
                onChange={(event) => setRecommendedAction(event.target.value)}
                disabled={!assignment || submitting}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50"
              >
                {recommendedActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!assignment || submitting}
              className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? "Submitting..." : "Submit feedback"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
