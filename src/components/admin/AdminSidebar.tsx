"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "text-navy-900 bg-[var(--accent-yellow)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
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
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 md:hidden"
        aria-label="Toggle admin menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-base)] p-4 transition-transform md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 px-2">
          <h2 className="text-sm font-bold tracking-wider text-[var(--text-primary)] uppercase">
            SouthEast
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">Admin Panel</p>
        </div>

        {navList}

        <div className="mt-auto pt-6">
          <p className="mb-2 truncate px-3 text-xs text-[var(--text-secondary)]">
            {email}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            {isPending ? "Logging out…" : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
