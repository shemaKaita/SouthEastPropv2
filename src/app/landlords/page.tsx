import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactElement } from "react";

import LandlordEnquiryForm from "@/components/LandlordEnquiryForm";

export const metadata: Metadata = {
  title: "Landlord Services",
  description:
    "Expert asset management for landlords across Cape Town's City Bowl and Southern Suburbs. Minimal vacancy, proactive maintenance, curated tenant matching.",
  alternates: {
    canonical: "/landlords",
  },
};

type Pillar = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const PILLARS: ReadonlyArray<Pillar> = [
  {
    icon: TrendingUp,
    title: "Minimal Vacancy Rates",
    description:
      "Aggressive marketing across high-intent channels, an extensive tenant network, and fast turnaround between tenancies keep your void periods as short as possible — protecting cash flow and asset momentum.",
  },
  {
    icon: ShieldCheck,
    title: "Proactive Maintenance",
    description:
      "Scheduled preventative inspections and a trusted contractor network mean small issues are resolved before they become costly problems. Your asset is preserved for the long term, not patched for the short term.",
  },
  {
    icon: Users,
    title: "Curated Tenant Matching",
    description:
      "Thorough vetting, background checks, and a thoughtful match between tenant and property reduce churn and foster stable, long-term tenancies — the foundation of a well-run rental portfolio.",
  },
];

export default function LandlordsPage(): ReactElement {
  return (
    <div className="flex flex-col bg-[var(--color-background)]">
      {/* HERO */}
      <section
        aria-labelledby="landlords-hero-heading"
        className="relative w-full bg-[var(--color-background)] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-primary)]">
              <span
                aria-hidden="true"
                className="inline-block h-px w-8 bg-[var(--color-primary)]"
              />
              Landlord Services
            </span>
            <h1
              id="landlords-hero-heading"
              className="mt-6 text-4xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-5xl lg:text-6xl text-balance"
            >
              Expert Asset Management in the{" "}
              <span className="text-[var(--color-primary)]">
                City Bowl &amp; Southern Suburbs
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-foreground)]/75 sm:text-lg lg:text-xl">
              Professional property management tailored to Cape Town&apos;s most
              sought-after neighbourhoods. We maximise rental yield, minimise
              vacancy, and safeguard the long-term value of your asset with a
              hands-on, owner-first approach.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#enquiry"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--accent-yellow)] px-8 text-base font-bold text-navy-900 shadow-lg transition-all hover:scale-105 hover:bg-[var(--accent-yellow-hover)] hover:shadow-2xl"
              >
                Get a Management Proposal
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[var(--color-secondary)]/40 px-8 text-base font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                Speak to Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PILLARS */}
      <section
        aria-labelledby="why-partner-heading"
        className="bg-[var(--color-background)] py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
          {/* Section header */}
          <header className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-primary)]">
              <span
                aria-hidden="true"
                className="inline-block h-px w-8 bg-[var(--color-primary)]"
              />
              Why Partner With Us
            </span>
            <h2
              id="why-partner-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl lg:text-4xl text-balance"
            >
              Three Reasons{" "}
              <span className="text-[var(--color-primary)]">
                Landlords Trust Us
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-foreground)]/70 sm:text-lg">
              A premium management experience grounded in proactive care,
              transparent reporting, and genuine owner advocacy.
            </p>
          </header>

          {/* Pillar grid */}
          <ul
            role="list"
            className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3 md:gap-8"
          >
            {PILLARS.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="group flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-base)] dark:bg-[var(--bg-surface)] dark:border-white/10 p-8 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--brand-navy)]/40 dark:hover:border-amber-400/30 hover:shadow-[0_20px_40px_-24px_rgba(18,40,90,0.35)]"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/10 text-[var(--brand-navy)] dark:text-amber-400 transition-transform duration-300 ease-out group-hover:scale-105"
                  aria-hidden="true"
                >
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground)]/70 sm:text-base">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section
        aria-labelledby="landlord-enquiry-heading"
        id="enquiry"
        className="bg-[var(--color-secondary)]/10 pb-24 pt-12 lg:pb-32 lg:pt-16 scroll-mt-24"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            {/* Section header */}
            <header className="text-center">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-primary)]">
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-8 bg-[var(--color-primary)]"
                />
                Landlord Enquiry
              </span>
              <h2
                id="landlord-enquiry-heading"
                className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl lg:text-4xl text-balance"
              >
                Request Your{" "}
                <span className="text-[var(--color-primary)]">
                  Management Proposal
                </span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-foreground)]/70 sm:text-lg">
                Share a few details about your property and we&apos;ll respond
                within 24 hours with a tailored proposal and next steps.
              </p>
            </header>

            {/* Form card */}
            <div className="mt-10 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-base)] dark:bg-[var(--bg-surface)] dark:border-white/10 p-6 shadow-sm sm:p-8 lg:p-10">
              <LandlordEnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
