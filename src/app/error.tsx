"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import type { ReactElement } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactElement {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[var(--color-background)] py-24 sm:py-32">
      <div className="mx-auto w-full max-w-2xl px-6 text-center sm:px-8 lg:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_8px_20px_-10px_rgba(18,40,90,0.6)]">
          <AlertTriangle className="h-8 w-8" strokeWidth={1.75} />
        </div>

        <span className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-primary)]">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8 bg-[var(--color-primary)]"
          />
          Something went wrong
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl text-balance">
          An unexpected error occurred
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
          We apologise for the inconvenience. Our team has been notified and is
          working to resolve the issue. Please try again or return to the
          homepage.
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-xs text-[var(--color-secondary)]/70">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-primary-surface)] px-8 text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl dark:ring-1 dark:ring-white/10 dark:shadow-lg dark:shadow-black/40"
          >
            <RotateCcw className="h-5 w-5" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[var(--color-secondary)]/40 px-8 text-base font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
