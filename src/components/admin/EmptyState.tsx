import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

/**
 * EmptyState — used wherever admin pages have no records.
 *
 * Replaces the previous "No submissions yet." bare-text fallback that
 * produced ~700px of dead whitespace.
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-16 text-center dark:border-white/15">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)]">
        <Icon className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
