import { BedDouble, Bath, Maximize, MapPin } from "lucide-react";
import type { ReactElement } from "react";

/**
 * Loading skeleton for the property detail page.
 * Mirrors the two-column layout (bento gallery + content/sidebar)
 * using Tailwind's animate-pulse to simulate loading state.
 */
export default function PropertyDetailLoading(): ReactElement {
  return (
    <div className="bg-[var(--color-background)] py-8 pb-24 sm:py-12 sm:pb-24 lg:py-16 lg:pb-16">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10 space-y-10">
        {/* Back link skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-[var(--color-secondary)]/30" />
          <div className="h-3 w-32 animate-pulse rounded bg-[var(--color-secondary)]/30" />
        </div>

        {/* Bento Box gallery skeleton */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          {/* Featured image skeleton */}
          <div className="relative aspect-[4/3] animate-pulse overflow-hidden rounded-2xl bg-[var(--color-secondary)]/20 lg:aspect-auto lg:min-h-[500px]" />
          {/* Gallery grid skeleton */}
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative aspect-square animate-pulse overflow-hidden rounded-2xl bg-[var(--color-secondary)]/20"
              />
            ))}
          </div>
        </div>

        {/* Two-column layout skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          {/* Left: Main content skeleton */}
          <div className="space-y-8">
            {/* Header skeleton */}
            <div>
              <div className="h-6 w-24 animate-pulse rounded-full bg-[var(--color-secondary)]/20" />
              <div className="mt-4 h-9 w-3/4 animate-pulse rounded bg-[var(--color-secondary)]/30" />
              <div className="mt-3 flex items-center gap-2">
                <MapPin
                  className="h-4 w-4 text-[var(--color-secondary)]/50"
                  aria-hidden="true"
                />
                <div className="h-3 w-40 animate-pulse rounded bg-[var(--color-secondary)]/20" />
              </div>
            </div>

            {/* Stats row skeleton */}
            <div className="flex flex-wrap items-center gap-6 border-y border-[var(--color-secondary)]/20 py-5">
              <div className="flex items-center gap-2">
                <BedDouble
                  className="h-5 w-5 text-[var(--color-secondary)]/50"
                  aria-hidden="true"
                />
                <div className="h-4 w-16 animate-pulse rounded bg-[var(--color-secondary)]/20" />
              </div>
              <div className="flex items-center gap-2">
                <Bath
                  className="h-5 w-5 text-[var(--color-secondary)]/50"
                  aria-hidden="true"
                />
                <div className="h-4 w-16 animate-pulse rounded bg-[var(--color-secondary)]/20" />
              </div>
              <div className="flex items-center gap-2">
                <Maximize
                  className="h-5 w-5 text-[var(--color-secondary)]/50"
                  aria-hidden="true"
                />
                <div className="h-4 w-16 animate-pulse rounded bg-[var(--color-secondary)]/20" />
              </div>
            </div>

            {/* Description skeleton */}
            <div>
              <div className="h-6 w-48 animate-pulse rounded bg-[var(--color-secondary)]/30" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-[var(--color-secondary)]/20" />
                <div className="h-4 w-full animate-pulse rounded bg-[var(--color-secondary)]/20" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-[var(--color-secondary)]/20" />
              </div>
            </div>

            {/* Amenities skeleton */}
            <div>
              <div className="h-6 w-32 animate-pulse rounded bg-[var(--color-secondary)]/30" />
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-xl border border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/10 p-3"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar skeleton */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[var(--color-secondary)]/30 bg-[var(--color-background)] p-6 shadow-lg sm:p-8">
              {/* Price skeleton */}
              <div className="flex items-baseline gap-2">
                <div className="h-8 w-32 animate-pulse rounded bg-[var(--color-secondary)]/30" />
                <div className="h-4 w-12 animate-pulse rounded bg-[var(--color-secondary)]/20" />
              </div>
              {/* Availability skeleton */}
              <div className="mt-3 h-6 w-40 animate-pulse rounded-full bg-[var(--color-secondary)]/20" />
              {/* Divider */}
              <div className="my-6 h-px w-full bg-[var(--color-secondary)]/20" />
              {/* Form heading skeleton */}
              <div className="h-6 w-32 animate-pulse rounded bg-[var(--color-secondary)]/30" />
              <div className="mt-2 h-3 w-48 animate-pulse rounded bg-[var(--color-secondary)]/20" />
              {/* Form fields skeleton */}
              <div className="mt-5 space-y-5">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="h-12 animate-pulse rounded-xl bg-[var(--color-secondary)]/20" />
                  <div className="h-12 animate-pulse rounded-xl bg-[var(--color-secondary)]/20" />
                </div>
                <div className="h-12 animate-pulse rounded-xl bg-[var(--color-secondary)]/20" />
                <div className="h-24 animate-pulse rounded-xl bg-[var(--color-secondary)]/20" />
                <div className="h-14 w-full animate-pulse rounded-full bg-[var(--color-secondary)]/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
