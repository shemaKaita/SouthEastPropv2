"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Contact form submitted", {
      name,
      email,
      subject,
      message,
    });
    setSubmitted(true);
  };

  const handleReset = (): void => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setSubmitted(false);
  };

  if (submitted) {
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
          Thank you! Your message has been sent.
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-foreground)]/70 sm:text-base">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-[var(--color-secondary)]/40 px-6 text-sm font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClassName =
    "w-full rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-300 dark:border-white/20 px-4 py-3 h-12 text-sm text-[var(--text-primary)] placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-[var(--accent-yellow)] focus:ring-1 focus:ring-[var(--accent-yellow)] outline-none transition-all";

  const labelClassName =
    "block text-xs font-semibold uppercase tracking-[0.15em] text-slate-700 dark:text-slate-300 mb-2";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      noValidate={false}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClassName}>
            Full Name
          </label>
          <input
            id="contact-name"
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
          <label htmlFor="contact-email" className={labelClassName}>
            Email Address
          </label>
          <input
            id="contact-email"
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
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClassName}>
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          name="subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClassName}
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClassName} min-h-32 resize-none`}
          placeholder="Tell us a bit more about your enquiry…"
        />
      </div>

      <p
        aria-live="polite"
        className="min-h-[1.25rem] text-sm text-[var(--color-secondary)]"
      >
        {submitted ? "Message sent — we&apos;ll be in touch soon." : ""}
      </p>

      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-yellow)] px-6 text-sm font-bold text-navy-900 transition-all hover:bg-[var(--accent-yellow-hover)] hover:scale-[1.02] hover:shadow-2xl sm:h-14 sm:px-8 sm:text-base sm:w-auto sm:self-start"
      >
        Send Message
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </form>
  );
}
