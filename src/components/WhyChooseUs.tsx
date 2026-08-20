import {
  Building2,
  Users,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import type { ReactElement } from "react";

type Pillar = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const PILLARS: ReadonlyArray<Pillar> = [
  {
    icon: Building2,
    title: "Property Management",
    description:
      "Comprehensive property management services covering everything from tenant placement and rent collection to proactive maintenance, inspections, and financial reporting — protecting your investment at every stage.",
  },
  {
    icon: Users,
    title: "Tenant Relations",
    description:
      "Dedicated, responsive tenant support that turns residents into long-term advocates. We handle queries, renewals, and conflict resolution with professionalism and care, ensuring a seamless living experience.",
  },
  {
    icon: HeartHandshake,
    title: "Community Integration",
    description:
      "Beyond buildings, we cultivate thriving communities. Through curated resident events, neighbourhood partnerships, and shared spaces, we help people feel connected to the places they call home.",
  },
];

export default function WhyChooseUs(): ReactElement {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="bg-[var(--color-background)] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-secondary)]">
            Our Difference
          </p>
          <h2
            id="why-choose-us-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl lg:text-4xl text-balance"
          >
            <span className="text-[var(--color-primary)]">Why Choose</span> Us
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-foreground)]/70 sm:text-lg">
            Three pillars of our premium real estate service &mdash; designed to
            deliver lasting value for landlords, tenants, and communities alike.
          </p>
        </header>

        {/* Pillar Grid */}
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
  );
}
