"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// These links appear in the dermatologist's workspace navigation.
const navigationItems = [
  {
    label: "Dashboard",
    href: "/dermatologists/dashboard",
    icon: "⌂",
  },
  {
    label: "Case queue",
    href: "/dermatologists/queue",
    icon: "▤",
  },
];

type DermatologistLayoutProps = {
  // `children` is the page rendered inside the dermatologist layout.
  children: ReactNode;
};

export default function DermatologistLayout({
  children,
}: DermatologistLayoutProps) {
  // Reads the current browser URL.
  // For example: /dermatologists/dashboard or /dermatologists/queue.
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
            <p className="text-xs text-slate-400">Dermatologist workspace</p>
          </div>
        </div>

        {/* Main navigation links */}
        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dermatologist menu
          </p>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              /*
                A navigation option is active when:
                - The URL exactly matches its path, or
                - The current page is nested under its path.
              */
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

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

        {/* Current dermatologist profile */}
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="mt-1 text-sm font-medium">Dr. Sarah Williams</p>
            <p className="text-xs text-sky-400">Dermatologist</p>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="lg:pl-64">
        {/* Top navigation header */}
        <header className="flex h-20 items-center justify-between border-b border-sky-100 bg-white px-5 sm:px-8">
          <div>
            <p className="text-sm text-slate-500">Dermatologist workspace</p>

            <h1 className="text-lg font-semibold text-slate-950">
              IleraDerma
            </h1>
          </div>

          {/* Dermatologist avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
            SW
          </div>
        </header>

        {/* The current dermatologist page is rendered here */}
        <div className="p-5 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
