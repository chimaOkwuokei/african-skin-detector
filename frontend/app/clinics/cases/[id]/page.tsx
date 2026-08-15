"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// --- API TYPES ---
interface Patient {
  id: number;
  name: string;
  age: number;
  sex: string;
  location: string;
}

interface Case {
  id: number;
  patient_id: number;
  patient_name: string;
  patient_ref: string;
  complaint: string;
  duration_value: number;
  duration_unit: string;
  onset: string;
  symptoms: string;
  body_area: string;
  clinician_notes: string;
  status: string;
  urgency_tier: string;
  urgency_score: number;
  diagnosis_text: string;
  created_at: string;
}

interface CaseImage {
  id: number;
  file_path: string;
  body_site: string | null;
}

interface CaseNote {
  id: number;
  case_id: number;
  body: string;
  created_at: string;
}

// Helpers for dynamic styling
function getSeverityStyle(severity: string | null | undefined) {
  const s = (severity || "").toLowerCase();
  if (s.includes("high") || s.includes("urgent")) return "bg-red-50 text-red-700";
  if (s.includes("moderate") || s.includes("medium")) return "bg-amber-50 text-amber-700";
  if (s.includes("low") || s.includes("routine")) return "bg-emerald-50 text-emerald-700";
  return "bg-slate-100 text-slate-700";
}

function getStatusStyle(status: string | null | undefined) {
  const s = (status || "").toLowerCase();
  if (s.includes("submitted") || s.includes("awaiting")) return "bg-sky-50 text-sky-700";
  if (s.includes("feedback") || s.includes("resolved") || s.includes("closed")) return "bg-emerald-50 text-emerald-700";
  if (s.includes("ai review") || s.includes("analyzed")) return "bg-violet-50 text-violet-700";
  return "bg-slate-100 text-slate-600";
}

function formatDate(dateString: string) {
  if (!dateString) return "Unknown Date";
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function CaseDetailsPage() {
  const router = useRouter();
  const params = useParams();

  // Extract ID from the URL (e.g., /clinics/cases/123 -> id = 123)
  // Accommodates folder names like [id] or [case_id]
  const caseId = params?.id || params?.case_id;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [images, setImages] = useState<CaseImage[]>([]);
  const [notes, setNotes] = useState<CaseNote[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [clinicianNote, setClinicianNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Fetch Case Data
  useEffect(() => {
    if (!caseId) return;

    async function fetchData() {
      try {
        // 1. Fetch the case details, images, and notes concurrently
        const [caseRes, imagesRes, notesRes] = await Promise.all([
          fetch(`${baseUrl}/cases/${caseId}`),
          fetch(`${baseUrl}/cases/${caseId}/images`),
          fetch(`${baseUrl}/cases/${caseId}/notes`)
        ]);

        if (!caseRes.ok) throw new Error("Failed to load case details.");

        const fetchedCase: Case = await caseRes.json();
        const fetchedImages: CaseImage[] = imagesRes.ok ? await imagesRes.json() : [];
        const fetchedNotes: CaseNote[] = notesRes.ok ? await notesRes.json() : [];

        setCaseData(fetchedCase);
        setImages(fetchedImages);
        setNotes(fetchedNotes);

        // 2. Fetch all patients to find the demographic details for this case
        if (fetchedCase.patient_id) {
          const patientsRes = await fetch(`${baseUrl}/patients`);
          if (patientsRes.ok) {
            const patientsList: Patient[] = await patientsRes.json();
            const matchedPatient = patientsList.find(p => p.id === fetchedCase.patient_id);
            if (matchedPatient) setPatientData(matchedPatient);
          }
        }
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Unable to load case details.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [caseId, baseUrl]);

  // Handle adding a new note
  async function handleNoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clinicianNote.trim()) return;

    setIsSubmittingNote(true);
    setFeedbackMessage("");

    try {
      const response = await fetch(`${baseUrl}/cases/${caseId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: clinicianNote,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save note");
      }

      const newNote = await response.json();

      // Append the newly created note to the UI instantly
      setNotes((prev) => [...prev, newNote]);
      setFeedbackMessage("Clinical note saved successfully.");
      setClinicianNote(""); // Clear the input field

    } catch (err) {
      console.error("Note submission failed:", err);
      setFeedbackMessage("Error saving note. Please try again.");
    } finally {
      setIsSubmittingNote(false);
    }
  }

  // Handles the dermatologist referral action
  async function handleSendReferral() {
    if (!caseId) return;

    try {
      // If you want to disable the button while loading, you can add an `isAssigning` state here.

      const response = await fetch(`${baseUrl}/cases/${caseId}/assign`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        }
        // No body required for auto-match
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.detail || errorData.message || "Failed to assign case";
        throw new Error(errMsg);
      }

      const data = await response.json();
      console.log("Case assigned successfully:", data);

      // Navigate back to the referral queue after successful assignment
      router.push("/clinics/referrals");

    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Assignment failed:", msg);
      alert(`Failed to send referral: ${msg}`);
    }
  }

  // --- LOADING / ERROR STATES ---
  if (isLoading) {
    return <div className="p-12 text-center text-slate-500 font-poppins animate-pulse">Loading case details...</div>;
  }

  if (error || !caseData) {
    return (
      <div className="mx-auto max-w-3xl p-6 font-poppins text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h2 className="text-lg font-bold">Error</h2>
          <p className="mt-2 text-sm">{error || "Case not found."}</p>
          <button onClick={() => router.back()} className="mt-4 text-red-800 underline font-medium">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 font-poppins">
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

          <p className="text-sm font-medium text-sky-600 uppercase tracking-wide">
            Case CASE-{caseData.id}
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 capitalize">
            {caseData.patient_name || "Unknown Patient"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {caseData.patient_ref || `PT-${caseData.patient_id}`} · Submitted {formatDate(caseData.created_at)}
          </p>
        </div>

        {/* Current case status */}
        <span className={`w-fit rounded-full px-4 py-2 text-sm font-medium capitalize ${getStatusStyle(caseData.status)}`}>
          {caseData.status || "Submitted"}
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
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Age</p>
                <p className="mt-1 text-sm text-slate-700">{patientData?.age ? `${patientData.age} years` : "Unknown"}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Sex</p>
                <p className="mt-1 text-sm text-slate-700 capitalize">{patientData?.sex || "Unknown"}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Location</p>
                <p className="mt-1 text-sm text-slate-700 capitalize">{patientData?.location || "Unknown"}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Affected area</p>
                <p className="mt-1 text-sm text-slate-700 capitalize">{caseData.body_area || "Not specified"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">
              Clinical information
            </h3>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Main complaint</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{caseData.complaint || "No complaint recorded."}</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Duration</p>
                  <p className="mt-1 text-sm text-slate-700">{caseData.duration_value} {caseData.duration_unit}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Onset</p>
                  <p className="mt-1 text-sm text-slate-700 capitalize">{caseData.onset || "Unknown"}</p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Symptoms</p>
                  <p className="mt-1 text-sm text-slate-700 capitalize">{caseData.symptoms || "None reported"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Intake Clinician notes</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {caseData.clinician_notes || "No initial notes provided."}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* AI triage summary */}
        <section className="rounded-2xl border border-red-200 bg-white shadow-sm h-fit">
          <div className="border-b border-slate-100 p-6">
            <p className="text-sm font-medium text-slate-500">Preliminary AI triage</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <h3 className={`text-2xl font-semibold capitalize ${caseData.urgency_tier?.includes('high') ? 'text-red-700' : 'text-slate-900'}`}>
                {caseData.urgency_tier || "Pending"}
              </h3>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">Severity</p>
                <p className="text-3xl font-bold text-red-700">{caseData.urgency_score || 0}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <p className="text-sm font-semibold text-slate-950">Preliminary findings</p>
              <div className="mt-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {caseData.diagnosis_text || "Awaiting AI analysis"}
              </div>
            </div>

            <p className="border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
              AI results are preliminary decision support and do not replace clinical judgment or specialist diagnosis.
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
          <h3 className="text-lg font-semibold text-slate-950">Lesion images</h3>
          <p className="mt-1 text-sm text-slate-500">Images submitted during the patient consultation.</p>
        </div>

        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No images uploaded for this case.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {images.map((img, index) => (
              <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {/* Fallback to appending baseUrl if the path isn't absolute */}
                <img
                  src={img.file_path.startsWith("http") ? img.file_path : `${baseUrl}/${img.file_path}`}
                  alt={`Lesion view ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {img.body_site && (
                  <span className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-white capitalize">
                    {img.body_site}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Clinician notes and specialist feedback */}
      <section className="grid gap-6 xl:grid-cols-2">

        {/* Add a note for the dermatologist */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Add clinical note</h3>
          <p className="mt-1 text-sm text-slate-500">Add information that may help the dermatologist review this case.</p>

          <form onSubmit={handleNoteSubmit} className="mt-5 space-y-4">
            <textarea
              value={clinicianNote}
              onChange={(event) => setClinicianNote(event.target.value)}
              rows={4}
              disabled={isSubmittingNote}
              placeholder="Write an additional note..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:opacity-50"
            />

            {feedbackMessage && (
              <p className={`rounded-lg px-3 py-2 text-sm ${feedbackMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {feedbackMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmittingNote}
              className="rounded-xl border border-sky-200 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 disabled:opacity-50"
            >
              {isSubmittingNote ? "Saving..." : "Save note"}
            </button>
          </form>
        </section>

        {/* Notes Log / Feedback panel */}
        <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-950">Case Notes Log</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {notes.length} entries
            </span>
          </div>

          <div className="mt-5 flex-1 flex flex-col gap-3 overflow-y-auto max-h-[300px]">
            {notes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center my-auto">
                <p className="text-sm font-medium text-slate-700">No notes yet</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Any updates added to this case will appear here.
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-sm leading-relaxed text-slate-700">{note.body}</p>
                  <p className="mt-2 text-xs text-slate-400 font-medium">
                    Added {formatDate(note.created_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

      </section>
    </div>
  );
}