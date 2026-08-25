import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Reusable section eyebrow label — the small monospace label
 * with a horizontal line that appears above section headings.
 *
 * Used across: home, locations, our-story, landlords, contact,
 * property carousel, error pages, and not-found.
 */
export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[10px] font-medium tracking-[0.25em] text-[var(--text-primary)] uppercase ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-px w-8 bg-[var(--text-primary)]"
      />
      {children}
    </span>
  );
}
