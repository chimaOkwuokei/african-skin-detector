"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// These links appear in the clinician's clinic navigation.
const navigationItems = [
  {
    label: "Dashboard",
    href: "/clinics/dashboard",
    icon: "⌂",
  },
  {
    label: "Add patient",
    href: "/clinics/patients/new",
    icon: "＋",
  },
  {
    label: "Referrals",
    href: "/clinics/referrals",
    icon: "↗",
  },
];

type ClinicLayoutProps = {
  // `children` is the page rendered inside the clinic layout.
  children: ReactNode;
};

export default function ClinicLayout({ children }: ClinicLayoutProps) {
  // Reads the current browser URL.
  // For example: /clinics/dashboard or /clinics/referrals.
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-sky-50 text-slate-950">
      {/* 
        Desktop sidebar.
        The sidebar is hidden on small screens for now.
        A mobile navigation menu can be added later.
      */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-slate-950 text-white lg:flex">
        {/* Application branding */}
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-xl font-bold">
            S
          </div>

          <div className="ml-3">
            <p className="text-base font-semibold">IleraDerma</p>
            <p className="text-xs text-slate-400">Clinical workspace</p>
          </div>
        </div>

        {/* Main navigation links */}
        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Clinic menu
          </p>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              /*
                All patient intake pages should activate "Add patient":

                /clinics/patients/new
                /clinics/patients/new/clinical
                /clinics/patients/new/images
                /clinics/patients/new/triage
              */
              const isPatientsRoute = pathname.startsWith("/clinics/patients");

              /*
                A navigation option is active when:
                - The URL exactly matches its path, or
                - The current page is nested under its path.
              */
              const isActive =
                item.label === "Add patient"
                  ? isPatientsRoute
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    isActive
                      ? "bg-sky-500 text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {/* Navigation icon */}
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-base ${
                      isActive ? "bg-white/20" : "bg-white/10"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* Navigation label */}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Current clinician profile */}
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="mt-1 text-sm font-medium">Dr. N</p>
            <p className="text-xs text-sky-400">Primary clinician</p>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="lg:pl-64">
        {/* Top navigation header */}
        <header className="flex h-20 items-center justify-between border-b border-sky-100 bg-white px-5 sm:px-8">
          <div>
            <p className="text-sm text-slate-500">Clinic workspace</p>

            <h1 className="text-lg font-semibold text-slate-950">
              IleraDerma
            </h1>
          </div>

          {/* Clinician avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
            DN
          </div>
        </header>

        {/* The current clinic page is rendered here */}
        <div className="p-5 sm:p-8">{children}</div>
      </main>
    </div>
  );
}