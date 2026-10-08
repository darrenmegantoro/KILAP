"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/layout/brand-mark";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/faq", label: "Kelola FAQ", icon: BookOpen },
  { href: "/admin/riwayat", label: "Riwayat Perubahan", icon: History },
];

export function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Menu admin">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-white/15 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon size={16} />
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
      >
        <LogOut size={16} />
        Keluar
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F4F6FA] md:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-[#293F70] text-white md:flex">
        <div className="border-b border-white/10 p-4">
          <BrandMark href="/admin" light compact />
        </div>
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Tutup sidebar"
            onClick={() => setOpen(false)}
          />
          <aside className="relative z-10 flex h-full w-72 flex-col bg-[#293F70] text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <BrandMark href="/admin" light compact />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#293F70] md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-base font-semibold text-[#293F70] md:text-lg">
                Dashboard KILAP KEPRI
              </h1>
              <p className="text-xs text-slate-500">KPw BI Kepulauan Riau</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">
              {userName}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-[#293F70] hover:bg-slate-50"
            >
              Keluar
            </button>
          </div>
        </header>
        <div className="flex-1 px-4 py-6 md:px-6">{children}</div>
      </div>
    </div>
  );
}
