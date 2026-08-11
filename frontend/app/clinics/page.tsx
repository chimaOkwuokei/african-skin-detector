import { redirect } from "next/navigation";

// The clinic root route redirects clinicians to their dashboard.
export default function ClinicsPage() {
  redirect("/clinics/dashboard");
}