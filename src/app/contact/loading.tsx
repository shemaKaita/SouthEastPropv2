import type { ReactElement } from "react";

/**
 * Generic loading skeleton for static pages.
 * Uses a minimal pulse animation to signal navigation is in progress.
 */
export default function Loading(): ReactElement {
  return (
    <div className="min-h-[60vh] animate-pulse">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24 space-y-8">
        <div className="space-y-4">
          <div className="h-3 w-32 rounded-full bg-[var(--color-secondary)]/20" />
          <div className="h-10 w-2/3 rounded-xl bg-[var(--color-secondary)]/20" />
          <div className="h-4 w-full rounded bg-[var(--color-secondary)]/15" />
          <div className="h-4 w-4/5 rounded bg-[var(--color-secondary)]/15" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="h-96 rounded-2xl bg-[var(--color-secondary)]/15" />
          <div className="h-96 rounded-2xl bg-[var(--color-secondary)]/15" />
        </div>
      </div>
    </div>
  );
}
