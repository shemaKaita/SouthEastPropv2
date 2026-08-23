import Link from "next/link";
import { Home, Search } from "lucide-react";
import type { ReactElement } from "react";

export default function NotFound(): ReactElement {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[var(--color-background)] py-24 sm:py-32">
      <div className="mx-auto w-full max-w-2xl px-6 text-center sm:px-8 lg:px-10">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-primary)]">
          <span
            aria-hidden="true"
            className="inline-block h-px w-8 bg-[var(--color-primary)]"
          />
          404
        </span>

        <h1 className="mt-6 text-6xl font-bold tracking-tight text-[var(--color-primary)] sm:text-7xl lg:text-8xl text-balance">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl text-balance">
          Page not found
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-[var(--color-secondary)] sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back on track.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-primary-surface)] px-8 text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl dark:ring-1 dark:ring-white/10 dark:shadow-lg dark:shadow-black/40"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          <Link
            href="/locations"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[var(--color-secondary)]/40 px-8 text-base font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <Search className="h-5 w-5" />
            Browse Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
