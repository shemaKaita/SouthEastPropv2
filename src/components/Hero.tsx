import Image from "next/image";
import Button from "@/components/Button";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--stripe-color)_1px,transparent_1px)] bg-[size:4rem_100%] opacity-100"
      />
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Left Column: Narrative & Bottom Widgets Stack */}
        <div className="flex flex-col gap-6 lg:col-span-7 lg:flex lg:flex-col lg:justify-between">
          {/* Main Narrative Box */}
          <div className="flex flex-col justify-center rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-sm lg:p-12">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Harmonious Co&#x2011;Living &amp;{" "}
              <br className="hidden sm:block" />
              <span className="text-[var(--accent-yellow)]">
                Expert Asset Management
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-balance text-lg text-[var(--text-secondary)]">
              Premium property solutions across South Africa — from curated
              co-living spaces to full-service asset management for discerning
              landlords.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="primary"
                href="/locations"
                className="rounded-full shadow-lg"
              >
                Explore Properties
              </Button>
              <Button
                variant="secondary"
                href="/contact"
                className="rounded-full text-[var(--text-primary)]"
              >
                Speak to Us
              </Button>
            </div>
          </div>

          {/* Bottom Row Stack: Dual-Audience Value Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
            {/* Resident Card */}
            <div className="flex flex-col justify-center rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm sm:col-span-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-yellow)]" />
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  For Residents
                </p>
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                Curated Co-Living
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Modern living spaces, community focus, and seamless tenant
                support.
              </p>
            </div>

            {/* Landlord Card */}
            <div className="flex flex-col justify-center rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm sm:col-span-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-yellow)]" />
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  For Landlords
                </p>
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                Asset Management
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                End-to-end property administration, tenant placement, and asset
                care.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Image (Balanced height) */}
        <div className="relative min-h-[480px] w-full overflow-hidden rounded-3xl lg:col-span-5 lg:h-full">
          <Image
            src="/hero-interior.jpg"
            alt="Premium co-living interior"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091229]/80 via-transparent to-transparent" />

          <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-yellow)]"></span>
            <span className="text-xs font-medium uppercase tracking-wide text-white">
              Observatory, Cape Town
            </span>
          </div>
          <div className="absolute right-6 top-6 rounded-full border border-white/25 bg-black/55 px-3 py-1.5 shadow-lg backdrop-blur-md">
            <span className="text-xs font-semibold uppercase tracking-wide text-white drop-shadow-sm">
              Available Mid-Year
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
