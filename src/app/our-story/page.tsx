import type { Metadata } from "next";
import {
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The story of Mutoni Kaitakirwa, SouthEast Properties, and a heritage-rooted approach to property management in Cape Town.",
  alternates: {
    canonical: "/our-story",
  },
};

type Impact = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const IMPACTS: ReadonlyArray<Impact> = [
  {
    icon: Users,
    title: "Harmonious Co-Living",
    description:
      "We design every residence to feel like a community — not just a building. Through thoughtful layouts, shared spaces, and curated resident events, we cultivate environments where neighbours become friends and houses become homes.",
  },
  {
    icon: GraduationCap,
    title: "Student Empowerment",
    description:
      "Cape Town's students are the lifeblood of Observatory and Woodstock. We provide safe, supportive accommodation and mentorship pathways that help young people thrive academically, professionally, and personally during their most formative years.",
  },
  {
    icon: HeartHandshake,
    title: "Long-Term Stewardship",
    description:
      "Property is a long game, and so is community. We partner with local organisations, support neighbourhood initiatives, and reinvest in the areas we serve — building legacies that outlive any single lease.",
  },
];

export default function OurStoryPage(): ReactElement {
  return (
    <div className="flex flex-col bg-[var(--color-background)]">
      {/* HERO */}
      <section
        aria-labelledby="our-story-hero-heading"
        className="relative w-full bg-[var(--color-background)] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-primary)]">
              <span
                aria-hidden="true"
                className="inline-block h-px w-8 bg-[var(--color-primary)]"
              />
              <Sparkles className="h-3.5 w-3.5" />
              The SouthEast Story
            </span>
            <h1
              id="our-story-hero-heading"
              className="mt-6 text-5xl font-bold tracking-tight text-[var(--color-primary)] sm:text-6xl lg:text-7xl text-balance"
            >
              Built on Heritage.
              <br />
              Driven by Purpose.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--color-foreground)]/75 sm:text-lg lg:text-xl">
              SouthEast Properties is more than a property company. It is a
              living expression of two proud African heritages — and a quiet
              promise that every door we open should make someone&apos;s life a
              little more certain, a little more dignified, a little more free.
            </p>
          </div>
        </div>
      </section>

      {/* FOUNDER SPLIT-SCREEN */}
      <section
        aria-labelledby="founder-heading"
        className="bg-[var(--color-background)] pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 items-stretch gap-12 md:grid-cols-[minmax(0,380px)_1fr] md:gap-12 lg:gap-16">
            {/* Left: Founder portrait (anchors the left side for visual balance) */}
            <div className="order-first w-full">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[var(--border-subtle)] dark:border-white/10 bg-[var(--brand-navy)] shadow-2xl h-full flex flex-col justify-between">
                <Image
                  src="/team/mutoni.svg"
                  alt="Mutoni Kaitakirwa, founder of SouthEast Properties"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  loading="eager"
                  className="object-cover"
                />
                {/* Subtle corner accent */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-6 left-6 right-6 border-t border-white/20 pt-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)] sm:text-xs">
                    Founder &middot; SouthEast Properties
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Founder copy */}
            <div className="flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-primary)]">
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-8 bg-[var(--color-primary)]"
                />
                The Founder
              </span>
              <h2
                id="founder-heading"
                className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl lg:text-4xl text-balance"
              >
                Meet{" "}
                <span className="text-[var(--color-primary)]">
                  Mutoni Kaitakirwa
                </span>
              </h2>

              <div className="mt-6 space-y-5 text-sm leading-relaxed text-[var(--color-foreground)]/75 sm:text-base">
                <p>
                  Mutoni Kaitakirwa was raised between two worlds — the high
                  grasslands of Lesotho, where the Basotho spirit of
                  <em> botho </em>
                  (shared humanity) is lived daily, and the rolling hills of
                  Rwanda, where resilience and renewal are stitched into every
                  generation. Those twin roots taught her early that a home is
                  never just walls and a roof. It is the quiet architecture of
                  safety, dignity, and possibility.
                </p>
                <p>
                  When she arrived in Cape Town, she saw a city bursting with
                  opportunity — and a property landscape that too often treated
                  tenants as transactions rather than people. She founded
                  SouthEast Properties to change that. Every property under our
                  stewardship is managed with the same care she would offer her
                  own family: attentively, honestly, and with a deep respect for
                  the people who call our spaces home.
                </p>
                <p>
                  The gorilla — our emblem — is no accident. In the mountain
                  forests of the Virunga, the gorilla stands as the gentle
                  guardian of its family group: fiercely protective, deeply
                  loyal, and quietly powerful. It is the symbol Mutoni chose for
                  what property management should always be — strength in
                  service of the people we protect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY IMPACT */}
      <section
        aria-labelledby="community-impact-heading"
        className="bg-[var(--color-secondary)]/10 py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
          {/* Section header */}
          <header className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-primary)]">
              <span
                aria-hidden="true"
                className="inline-block h-px w-8 bg-[var(--color-primary)]"
              />
              Community Impact
            </span>
            <h2
              id="community-impact-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl lg:text-4xl text-balance"
            >
              <span className="text-[var(--color-primary)]">More Than</span>{" "}
              Property &mdash; A Commitment to Community
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-foreground)]/70 sm:text-lg">
              Every building we manage is a chance to strengthen the
              neighbourhood it stands in. Here is what that promise looks like
              in practice.
            </p>
          </header>

          {/* Impact grid */}
          <ul
            role="list"
            className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3 md:gap-8"
          >
            {IMPACTS.map(({ icon: Icon, title, description }) => (
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

          {/* Closing CTA */}
          <div className="mt-16 flex justify-center sm:mt-20">
            <Link
              href="/locations"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--accent-yellow)] px-8 text-base font-bold text-navy-900 shadow-lg transition-all hover:scale-105 hover:bg-[var(--accent-yellow-hover)] hover:shadow-2xl"
            >
              Explore Our Properties
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
