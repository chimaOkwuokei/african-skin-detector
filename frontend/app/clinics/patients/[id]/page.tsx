import Link from "next/link";

// Temporary patient history data.
// This will later be loaded from the backend using the patient ID.
const patientCases = [
  {
    caseId: "CASE-1024",
    concern: "Persistent facial lesion",
    severity: "High",
    status: "Awaiting dermatologist",
    date: "10 August 2026",
  },
  {
    caseId: "CASE-0891",
    concern: "Recurring skin irritation",
    severity: "Moderate",
    status: "Closed",
    date: "14 June 2026",
  },
];

function getSeverityStyle(severity: string) {
  if (severity === "High") {
    return "bg-red-50 text-red-700";
  }

  if (severity === "Moderate") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-emerald-50 text-emerald-700";
}

export default function PatientProfilePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page navigation and patient heading */}
      <section>
        <Link
          href="/clinics/referrals"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Back to referrals
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium text-sky-600">Patient profile</p>

            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Amina Ibrahim
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Patient ID: PT-0248 · Registered 10 August 2026
            </p>
          </div>

          <Link
            href="/clinics/patients/new"
            className="rounded-xl bg-sky-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
          >
            Create new case
          </Link>
        </div>
      </section>

      {/* Patient summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Age
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">34 years</p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Sex
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">Female</p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Location
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            Ibadan, Oyo
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total cases
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">2</p>
        </div>
      </section>

      {/* Patient details and consent information */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">
            Personal information
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Phone number
              </p>
              <p className="mt-1 text-sm text-slate-700">0800 000 0000</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Date of birth
              </p>
              <p className="mt-1 text-sm text-slate-700">12 May 1992</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Community
              </p>
              <p className="mt-1 text-sm text-slate-700">Bodija</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Record number
              </p>
              <p className="mt-1 text-sm text-slate-700">PT-0248</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">
            Consent and notes
          </h3>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
              <span className="text-sm text-emerald-800">
                Teledermatology consent
              </span>

              <span className="text-xs font-semibold text-emerald-700">
                Confirmed
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">
                Model improvement consent
              </span>

              <span className="text-xs font-semibold text-slate-500">
                Not provided
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-500">
              Patient information should only be used according to the
              permissions recorded during registration.
            </p>
          </div>
        </div>
      </section>

      {/* Patient case history */}
      <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-950">Case history</h3>

          <p className="mt-1 text-sm text-slate-500">
            Previous and active dermatology cases for this patient.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Case</th>
                <th className="px-6 py-4 font-semibold">Concern</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {patientCases.map((patientCase) => (
                <tr key={patientCase.caseId} className="hover:bg-sky-50/50">
                  <td className="px-6 py-5 text-sm font-medium text-slate-950">
                    {patientCase.caseId}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {patientCase.concern}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getSeverityStyle(
                        patientCase.severity
                      )}`}
                    >
                      {patientCase.severity}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {patientCase.status}
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-500">
                    {patientCase.date}
                  </td>

                  <td className="px-6 py-5">
                    <Link
                      href={`/clinics/cases/${patientCase.caseId}`}
                      className="text-sm font-semibold text-sky-600 hover:text-sky-700"
                    >
                      View case
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Latest dermatologist feedback */}
      <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">
              Latest dermatologist feedback
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Feedback associated with this patient&apos;s cases.
            </p>
          </div>

          <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Awaiting response
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-700">
            No new dermatologist feedback
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            New specialist recommendations will appear here when available.
          </p>
        </div>
      </section>
    </div>
  );
}
