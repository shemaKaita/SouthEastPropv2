"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MapPinOff, RotateCcw } from "lucide-react";
import type { ReactElement } from "react";
import { logError } from "@/lib/logger";
import SectionLabel from "@/components/ui/SectionLabel";

export default function LocationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactElement {
  useEffect(() => {
    logError(error, { boundary: "locations", digest: error.digest });
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[var(--color-background)] py-24 sm:py-32">
      <div className="mx-auto w-full max-w-xl px-6 text-center sm:px-8 lg:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary)]/20 text-[var(--text-primary)]">
          <MapPinOff className="h-8 w-8" strokeWidth={1.75} />
        </div>

        <SectionLabel className="mt-8">Map Unavailable</SectionLabel>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance text-[var(--color-foreground)] sm:text-4xl">
          We couldn&apos;t load the map
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
          The interactive property map failed to load. This may be due to a
          network issue or a problem with the map service. You can try again, or
          browse our property listings directly.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-primary-surface)] px-8 text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl dark:shadow-lg dark:ring-1 dark:shadow-black/40 dark:ring-white/10"
          >
            <RotateCcw className="h-5 w-5" />
            Reload map
          </button>
          <Link
            href="/"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[var(--color-secondary)]/40 px-8 text-base font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
          >
            Browse properties
          </Link>
        </div>
      </div>
    </section>
  );
}
