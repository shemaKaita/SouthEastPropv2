import type { Metadata } from "next";
import type { ReactElement } from "react";
import ContactForm from "@/components/ContactForm";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  CONTACT_DETAILS_WITH_ICONS,
  SOCIAL_LINKS_WITH_ICONS,
} from "@/lib/social";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with SouthEast Properties. Visit our Observatory office, call, email, or send us a message online.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage(): ReactElement {
  return (
    <div className="bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Page header */}
        <div className="max-w-2xl">
          <SectionLabel>Get in Touch</SectionLabel>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-[var(--color-foreground)] sm:text-4xl lg:text-5xl">
            Contact{" "}
            <span className="text-[var(--text-primary)]">SouthEast</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
            Whether you&apos;re looking for a new home, exploring management
            services, or simply have a question — we&apos;d love to hear from
            you.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left: Contact details + socials */}
          <div className="space-y-8">
            {/* Contact items */}
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-balance text-[var(--color-foreground)]">
                Contact Details
              </h2>
              <ul className="mt-6 space-y-5">
                {CONTACT_DETAILS_WITH_ICONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="group flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-5 transition-all hover:border-[var(--brand-navy)]/40 hover:shadow-md dark:border-white/10 dark:bg-[var(--bg-surface)] dark:hover:border-amber-400/30"
                      >
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-[var(--brand-navy)] dark:text-amber-400"
                          aria-hidden="true"
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium tracking-[0.15em] text-[var(--color-secondary)] uppercase">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm leading-snug font-medium text-[var(--color-foreground)] group-hover:text-[var(--text-primary)]">
                            {item.text}
                          </p>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Social links */}
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-balance text-[var(--color-foreground)]">
                Follow Us
              </h2>
              <p className="mt-2 text-sm text-[var(--color-secondary)]">
                Stay connected for new listings, market insights, and exclusive
                property opportunities.
              </p>
              <ul className="mt-5 flex items-center gap-3">
                {SOCIAL_LINKS_WITH_ICONS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        aria-label={social.label}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] transition-all hover:border-[var(--brand-navy)] hover:bg-[var(--brand-navy)] hover:text-white dark:border-white/10 dark:hover:border-amber-400 dark:hover:bg-amber-400/10 dark:hover:text-amber-400"
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Operating Hours & Response SLA */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-6 shadow-sm dark:border-white/10 dark:bg-[var(--bg-surface)]">
              <h2 className="text-xl font-semibold tracking-tight text-balance text-[var(--color-foreground)]">
                Operating Hours &amp; Response SLA
              </h2>
              <p className="mt-2 text-sm text-[var(--color-secondary)]">
                We typically reply to all enquiries within 24 hours during
                business hours.
              </p>
              <dl className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3">
                  <dt className="text-xs font-semibold tracking-[0.15em] text-[var(--color-secondary)] uppercase">
                    Mon — Fri
                  </dt>
                  <dd className="text-sm font-medium text-[var(--color-foreground)]">
                    08:00 — 17:00
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3">
                  <dt className="text-xs font-semibold tracking-[0.15em] text-[var(--color-secondary)] uppercase">
                    Saturday
                  </dt>
                  <dd className="text-sm font-medium text-[var(--color-foreground)]">
                    09:00 — 13:00
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-xs font-semibold tracking-[0.15em] text-[var(--color-secondary)] uppercase">
                    Emergency
                  </dt>
                  <dd className="text-sm font-medium text-[var(--color-foreground)]">
                    24/7 for tenants
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: General inquiry form */}
          <div className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-6 shadow-sm sm:p-8 lg:p-10 dark:border-white/10 dark:bg-[var(--bg-surface)]">
            <h2 className="text-xl font-semibold tracking-tight text-balance text-[var(--color-foreground)]">
              Send Us a Message
            </h2>
            <p className="mt-2 text-sm text-[var(--color-secondary)]">
              Fill in the form below and we&apos;ll respond within 24 hours.
            </p>
            <div className="mt-6 flex flex-1 flex-col">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
