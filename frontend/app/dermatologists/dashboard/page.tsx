import Link from "next/link";

// Summary figures shown at the top of the dermatologist dashboard.
const dashboardStats = [
  {
    label: "Awaiting review",
    value: "06",
    note: "Needs attention",
    noteColor: "text-amber-600",
  },
  {
    label: "Reviewed today",
    value: "04",
    note: "+2 vs yesterday",
    noteColor: "text-emerald-600",
  },
  {
    label: "Urgent cases",
    value: "02",
    note: "Priority review",
    noteColor: "text-red-600",
  },
  {
    label: "Avg. response time",
    value: "3.2h",
    note: "Last 7 days",
    noteColor: "text-sky-600",
  },
];

// Temporary case queue data.
// This will later come from the backend.
const pendingCases = [
  {
    caseId: "CASE-1024",
    patient: "Amina Ibrahim",
    patientId: "PT-0248",
    concern: "Persistent facial lesion",
    severity: "High",
    status: "Awaiting dermatologist",
  },
  {
    caseId: "CASE-1023",
    patient: "Michael Okafor",
    patientId: "PT-0247",
    concern: "Itchy skin rash",
    severity: "Moderate",
    status: "AI review complete",
  },
  {
    caseId: "CASE-1022",
    patient: "Grace Nwosu",
    patientId: "PT-0246",
    concern: "Recurring skin irritation",
    severity: "High",
    status: "Awaiting dermatologist",
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

export default function DermatologistDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Dashboard welcome section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-sky-600">
            Thursday, 13 August 2026
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            Good evening, Dr. Williams
          </h2>

          <p className="mt-2 text-slate-500">
            Here are the cases waiting on your review.
          </p>
        </div>

        {/* Main action for reviewing the case queue */}
        <Link
          href="/dermatologists/queue"
          className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
        >
          View case queue
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

      {/* Pending case queue */}
      <section className="rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="font-semibold text-slate-950">
              Cases awaiting review
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Referred by clinics and pending your feedback.
            </p>
          </div>

          <Link
            href="/dermatologists/queue"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingCases.map((pendingCase) => (
            <Link
              key={pendingCase.caseId}
              href={`/dermatologists/cases/${pendingCase.caseId}`}
              className="flex flex-col gap-3 p-5 transition hover:bg-sky-50/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-950">
                  {pendingCase.patient}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {pendingCase.patientId} · {pendingCase.concern}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getSeverityStyle(
                    pendingCase.severity
                  )}`}
                >
                  {pendingCase.severity}
                </span>

                <span className="hidden text-xs text-slate-500 md:block">
                  {pendingCase.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
