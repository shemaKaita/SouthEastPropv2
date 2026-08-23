"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Phone, Mail, MapPin, Sun, Moon } from "lucide-react";
import Logo from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { useMounted } from "@/hooks/useMounted";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { NAV_ITEMS, CONTACT_DETAILS } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const mounted = useMounted();
  const { theme, toggleTheme } = useTheme();
  const scrolled = useScrollPosition(8);
  const isActive = (href: string): boolean =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  useBodyScrollLock(mobileOpen);

  const closeMobile = (): void => {
    setMobileOpen(false);
  };

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        scrolled
          ? "backdrop-blur-md bg-[var(--color-background)]/70 border-b border-[var(--color-foreground)]/10 shadow-[0_1px_20px_-12px_rgba(0,0,0,0.25)]"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 md:px-10"
        aria-label="Primary"
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-[var(--color-foreground)]"
          onClick={closeMobile}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-sm text-[var(--color-primary)] dark:text-[var(--accent-yellow)] transition-colors">
            <Logo className="h-9 w-9" />
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.number} className="relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "group relative flex items-baseline gap-2 whitespace-nowrap transition-colors duration-200",
                    active
                      ? "text-[var(--accent-yellow)] dark:text-[var(--accent-yellow)]"
                      : "text-[var(--color-foreground)]/80 hover:text-[var(--color-primary)] dark:text-white/70 dark:hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "font-mono text-[10px] uppercase tracking-[0.2em] transition-colors",
                      active
                        ? "text-[var(--accent-yellow)]"
                        : "text-[var(--color-primary)]/70 group-hover:text-[var(--color-primary)]",
                    ].join(" ")}
                  >
                    {item.number}
                  </span>
                  <span
                    className={[
                      "text-[11px] font-medium uppercase tracking-[0.22em]",
                      active ? "font-bold" : "",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute -bottom-1 left-0 h-0.5 rounded-full bg-[var(--accent-yellow)] transition-all duration-200 ease-out",
                      active
                        ? "w-full"
                        : "w-0 group-hover:w-full group-hover:bg-[var(--color-primary)]",
                    ].join(" ")}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-foreground)]/15 text-[var(--color-foreground)]/70 transition-all duration-200 hover:border-[var(--accent-yellow)] hover:text-[var(--accent-yellow)] hover:bg-[var(--accent-yellow)]/10 active:scale-95 lg:flex dark:border-white/20 dark:text-white/70 dark:hover:bg-[var(--accent-yellow)]/15"
        >
          {mounted &&
            (theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            ))}
        </button>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--color-foreground)]/15 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)]/60 hover:text-[var(--color-primary)] lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay — portalled to document.body so it's never clipped by <header> */}
      {mounted && mobileOpen
        ? createPortal(
            <div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
              className="fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col overflow-hidden bg-[var(--bg-base)] backdrop-blur-md"
              style={{
                paddingTop: "env(safe-area-inset-top)",
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              {/* Close button row — fixed height */}
              <div className="flex h-16 shrink-0 items-center justify-between px-6">
                <span className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)]">
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMobile}
                  className="flex h-10 w-10 items-center justify-center rounded-sm bg-slate-100 text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Menu list — scrollable middle */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="mx-auto flex w-full max-w-7xl flex-col gap-1">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.number}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={closeMobile}
                          className={[
                            "flex items-baseline gap-3 border-b border-[var(--color-foreground)]/10 py-4 transition-colors",
                            active
                              ? "border-l-2 border-[var(--accent-yellow)] pl-3 text-[var(--text-primary)]"
                              : "text-[var(--color-foreground)] hover:text-[var(--text-primary)]",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "font-mono text-sm uppercase tracking-[0.25em]",
                              active
                                ? "text-[var(--accent-yellow)]"
                                : "text-slate-500",
                            ].join(" ")}
                          >
                            {item.number}
                          </span>
                          <span className="text-lg font-semibold uppercase tracking-[0.18em]">
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Footer block — fills remaining space */}
              <div className="shrink-0 border-t border-[var(--color-foreground)]/10 px-6 py-6 space-y-4">
                {/* Address + theme toggle — secondary mid-block */}
                <div className="flex items-start justify-between gap-4 pb-2">
                  <a
                    href={CONTACT_DETAILS[0].href}
                    className="flex items-start gap-2 text-xs leading-snug text-[var(--color-foreground)]/70 transition-colors hover:text-[var(--accent-yellow)]"
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      42 Lower Main Road
                      <br />
                      Observatory, Cape Town
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-foreground)]/15 text-[var(--color-foreground)]/70 transition-colors hover:border-[var(--accent-yellow)] hover:text-[var(--accent-yellow)]"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--accent-yellow)] px-8 text-sm font-bold text-navy-900 transition-all hover:bg-[var(--accent-yellow-hover)]"
                >
                  Enquire Now
                </Link>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <a
                    href={CONTACT_DETAILS[1].href}
                    aria-label="Call us"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-foreground)]/15 text-[var(--color-foreground)]/70 transition-colors hover:border-[var(--accent-yellow)] hover:text-[var(--accent-yellow)]"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <a
                    href={CONTACT_DETAILS[2].href}
                    aria-label="Email us"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-foreground)]/15 text-[var(--color-foreground)]/70 transition-colors hover:border-[var(--accent-yellow)] hover:text-[var(--accent-yellow)]"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <p className="ml-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground)]/60">
                    PPRA Registered
                  </p>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
