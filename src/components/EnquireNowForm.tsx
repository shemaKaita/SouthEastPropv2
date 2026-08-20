"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type SubmittedPayload = {
  name: string;
  email: string;
  moveInDate: string;
  message: string;
};

export default function EnquireNowForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [payload, setPayload] = useState<SubmittedPayload | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log("Enquiry submitted", {
      name,
      email,
      moveInDate,
      message,
    });
    setPayload({ name, email, moveInDate, message });
    setSubmitted(true);
  };

  const handleReset = (): void => {
    setName("");
    setEmail("");
    setMoveInDate("");
    setMessage("");
    setPayload(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-secondary)]/30 bg-[var(--color-background)] p-8 text-center shadow-sm"
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_8px_20px_-10px_rgba(18,40,90,0.6)]"
          aria-hidden="true"
        >
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-[var(--color-foreground)]/80 sm:text-base">
          Thank you! We&apos;ll be in touch within 24 hours.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full border border-[var(--color-secondary)]/40 px-5 text-sm font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const inputClassName =
    "w-full rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-300 dark:border-white/20 px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-[var(--accent-yellow)] focus:ring-1 focus:ring-[var(--accent-yellow)] outline-none transition-all min-h-12 [&::-webkit-calendar-picker-indicator]:invert-[0.85] [&::-webkit-calendar-picker-indicator]:opacity-70 scheme:dark";

  const labelClassName =
    "block text-xs font-semibold uppercase tracking-[0.15em] text-slate-700 dark:text-slate-300 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      <div>
        <label htmlFor="enquire-name" className={labelClassName}>
          Full Name
        </label>
        <input
          id="enquire-name"
          type="text"
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClassName}
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label htmlFor="enquire-email" className={labelClassName}>
          Email Address
        </label>
        <input
          id="enquire-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label htmlFor="enquire-move-in" className={labelClassName}>
          Move-in Date
        </label>
        <input
          id="enquire-move-in"
          type="date"
          name="moveInDate"
          required
          value={moveInDate}
          onChange={(e) => setMoveInDate(e.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="enquire-message" className={labelClassName}>
          Message
        </label>
        <textarea
          id="enquire-message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClassName} min-h-32 resize-none`}
          placeholder="Tell us a bit about what you're looking for…"
        />
      </div>

      <p
        aria-live="polite"
        className="min-h-[1.25rem] text-sm text-[var(--color-secondary)]"
      >
        {submitted ? "Enquiry sent — we&apos;ll be in touch soon." : ""}
      </p>

      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-yellow)] px-6 text-sm font-bold text-navy-900 transition-all hover:bg-[var(--accent-yellow-hover)] hover:scale-[1.02] hover:shadow-2xl sm:h-14 sm:px-8 sm:text-base sm:w-auto"
      >
        Enquire Now
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </form>
  );
}
