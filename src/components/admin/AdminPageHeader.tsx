import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Optional CTA shown on the right (e.g. "New Property"). */
  action?: React.ReactNode;
  /** Optional breadcrumb link back to the dashboard. */
  backHref?: string;
  backLabel?: string;
};

/**
 * AdminPageHeader — sticky top bar for admin pages.
 *
 * - On mobile (<lg), reserves 96px of left padding so the floating
 *   "Menu" hamburger button (rendered by AdminSidebar) doesn't overlap
 *   the back link or page title. Fixes the audit's #1 mobile critical bug.
 * - On tablet+ the sidebar takes the gutter and the page header spans
 *   the full content width.
 * - Optional breadcrumb back-link above the title (a11y).
 */
export default function AdminPageHeader({
  title,
  subtitle,
  action,
  backHref,
  backLabel,
}: AdminPageHeaderProps) {
  return (
    <div className="sticky top-0 z-30 -mx-6 mb-6 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/85 px-6 py-4 backdrop-blur-md md:-mx-8 md:px-8 lg:-mx-10 lg:px-10 dark:bg-[var(--bg-base)]/85 dark:backdrop-blur-md">
      {backHref && (
        <Link
          href={backHref}
          className="mb-2 inline-flex items-center gap-1 pl-24 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-yellow)] sm:pl-28 lg:pl-0"
        >
          <ChevronLeft className="h-3 w-3" />
          {backLabel ?? "Back"}
        </Link>
      )}
      <div className="flex flex-col gap-3 pl-24 sm:flex-row sm:items-center sm:justify-between sm:pl-28 lg:pl-0">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex shrink-0 items-center gap-2">{action}</div>
        )}
      </div>
    </div>
  );
}
