"use client";

import { CheckCircle2 } from "lucide-react";

export type FormSuccessProps = {
  title: string;
  message: string;
  buttonText: string;
  onReset: () => void;
};

export default function FormSuccess({
  title,
  message,
  buttonText,
  onReset,
}: FormSuccessProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-secondary)]/30 bg-[var(--color-background)] p-8 text-center shadow-sm sm:p-10"
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_8px_20px_-10px_rgba(18,40,90,0.6)]"
        aria-hidden="true"
      >
        <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h3 className="mt-6 text-xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-2xl">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-foreground)]/70 sm:text-base">
        {message}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-[var(--color-secondary)]/40 px-6 text-sm font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      >
        {buttonText}
      </button>
    </div>
  );
}
