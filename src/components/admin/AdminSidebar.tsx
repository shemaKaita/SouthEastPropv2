"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Mail,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logoutAction } from "@/actions/admin/auth";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Building2 },
  {
    label: "Contact",
    href: "/admin/submissions/contact",
    icon: Mail,
  },
  {
    label: "Landlords",
    href: "/admin/submissions/landlord",
    icon: Users,
  },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

type AdminSidebarProps = {
  email: string;
};

export default function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer when route changes (covers in-app navigation).
  // The setState-in-effect rule doesn't apply here — we intentionally want
  // to collapse the drawer after navigation completes. This is not a
  // sync cascade; it's a route-change-driven state reset.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile drawer when Escape is pressed (a11y)
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (href: string): boolean =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const handleLogout = (): void => {
    startTransition(async () => {
      await logoutAction();
      router.push("/admin/login");
      router.refresh();
    });
  };

  const navList = (
    <nav className="flex flex-col gap-1" aria-label="Admin navigation">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "text-navy-900 bg-[var(--accent-yellow)]"
                : "text-slate-600 hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] dark:text-slate-100 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle (below lg) — sticky header button */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-50 inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 shadow-sm sm:px-3 sm:py-2 lg:hidden"
        aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span className="hidden text-sm font-medium sm:inline">Menu</span>
      </button>

      {/* Backdrop — only when drawer is open (below lg) */}
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar — overlay drawer below lg, inline at lg+ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-base)] p-4 transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:translate-x-0 lg:bg-[var(--bg-surface)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Admin sidebar"
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-[var(--text-primary)] uppercase">
              SouthEast
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">Admin Panel</p>
          </div>
          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin menu"
            className="rounded-md p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] lg:hidden dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {navList}

        <div className="mt-auto border-t border-[var(--border-subtle)] pt-4 dark:border-white/10">
          <p
            className="mb-2 truncate px-3 text-xs text-[var(--text-secondary)]"
            title={email}
          >
            Signed in as
            <br />
            <span className="font-medium text-[var(--text-primary)]">
              {email}
            </span>
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-60 dark:text-red-300 dark:hover:bg-red-500/15 dark:hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            {isPending ? "Logging out…" : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
