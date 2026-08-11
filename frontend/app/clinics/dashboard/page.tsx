import Link from "next/link";

// Summary figures shown at the top of the clinician dashboard.
const dashboardStats = [
  {
    label: "Patients registered",
    value: "248",
    note: "+12 this month",
    noteColor: "text-emerald-600",
  },
  {
    label: "Awaiting triage",
    value: "08",
    note: "Needs attention",
    noteColor: "text-amber-600",
  },
  {
    label: "Urgent cases",
    value: "03",
    note: "Priority review",
    noteColor: "text-red-600",
  },
  {
    label: "Feedback received",
    value: "17",
    note: "5 new today",
    noteColor: "text-sky-600",
  },
];

// Temporary referral data.
// This will later be replaced with data from the backend.
const recentReferrals = [
  {
    patient: "Amina Ibrahim",
    patientId: "PT-0248",
    concern: "Persistent facial lesion",
    severity: "High",
    status: "Awaiting dermatologist",
  },
  {
    patient: "Michael Okafor",
    patientId: "PT-0247",
    concern: "Itchy skin rash",
    severity: "Moderate",
    status: "AI review complete",
  },
  {
    patient: "Chidinma Eze",
    patientId: "PT-0246",
    concern: "Lower-leg swelling",
    severity: "Low",
    status: "Managed locally",
  },
];

// Temporary dermatologist feedback.
// This will later come from the referral API.
const dermatologistFeedback = [
  {
    patient: "Grace Nwosu",
    dermatologist: "Dr. Sarah Williams",
    message: "Treatment recommendation is ready for review.",
    time: "Today, 10:32 AM",
  },
  {
    patient: "Amina Ibrahim",
    dermatologist: "Dr. David Mensah",
    message: "Additional close-up image requested.",
    time: "Yesterday",
  },
];

// Returns different colors for each severity level.
function getSeverityStyle(severity: string) {
  if (severity === "High") {
    return "bg-red-50 text-red-700";
  }

  if (severity === "Moderate") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-emerald-50 text-emerald-700";
}

export default function ClinicDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Dashboard welcome section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-sky-600">
            Monday, 10 August 2026
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

      {/* Summary statistic cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-500">{stat.label}</p>

              {/* Small visual indicator for the card */}
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            </div>

            <p className="mt-5 text-3xl font-semibold text-slate-950">
              {stat.value}
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
        <div className="rounded-2xl border border-sky-100 bg-white shadow-sm">
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

          <div className="divide-y divide-slate-100">
            {recentReferrals.map((referral) => (
              <div
                key={referral.patientId}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-950">
                    {referral.patient}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {referral.patientId} · {referral.concern}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getSeverityStyle(
                      referral.severity
                    )}`}
                  >
                    {referral.severity}
                  </span>

                  <span className="hidden text-xs text-slate-500 md:block">
                    {referral.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent dermatologist feedback */}
        <div className="rounded-2xl border border-sky-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h3 className="font-semibold text-slate-950">
              Dermatologist feedback
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Recent specialist responses.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {dermatologistFeedback.map((feedback) => (
              <div key={feedback.patient} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-950">
                    {feedback.patient}
                  </p>

                  <span className="text-xs text-slate-400">
                    {feedback.time}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-5 text-slate-600">
                  {feedback.message}
                </p>

                <p className="mt-3 text-xs font-medium text-sky-600">
                  {feedback.dermatologist}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
