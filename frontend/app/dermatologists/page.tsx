import { redirect } from "next/navigation";

// The dermatologists root route redirects to the dashboard.
export default function DermatologistsPage() {
  redirect("/dermatologists/dashboard");
}
