"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type SubmittedPayload = {
  name: string;
  email: string;
  phone: string;
  location: string;
  propertyType: string;
  units: string;
};

export default function LandlordEnquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [units, setUnits] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [payload, setPayload] = useState<SubmittedPayload | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Landlord enquiry submitted", {
      name,
      email,
      phone,
      location,
      propertyType,
      units,
    });
    setPayload({ name, email, phone, location, propertyType, units });
    setSubmitted(true);
  };

  const handleReset = (): void => {
    setName("");
    setEmail("");
    setPhone("");
    setLocation("");
    setPropertyType("");
    setUnits("");
    setPayload(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-secondary)]/30 bg-[var(--color-background)] p-10 text-center shadow-sm sm:p-12"
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_8px_20px_-10px_rgba(18,40,90,0.6)]"
          aria-hidden="true"
        >
          <CheckCircle2 className="h-8 w-8" strokeWidth={1.75} />
        </div>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
          Thank you{payload?.name ? `, ${payload.name.split(" ")[0]}` : ""}!
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-foreground)]/70 sm:text-base">
          We&apos;ll be in touch within 24 hours to discuss your management
          proposal and outline next steps for your property.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full border border-[var(--color-secondary)]/40 px-6 text-sm font-semibold text-[var(--color-foreground)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  const inputClassName =
    "w-full rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-300 dark:border-white/20 px-4 py-3 h-12 text-sm text-[var(--text-primary)] placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-[var(--accent-yellow)] focus:ring-1 focus:ring-[var(--accent-yellow)] outline-none transition-all";

  const selectClassName = `${inputClassName} appearance-none bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-10`;
  const chevronBg =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")";

  const labelClassName =
    "block text-xs font-semibold uppercase tracking-[0.15em] text-slate-700 dark:text-slate-300 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
      {/* Name + Email row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClassName}>
            Full Name
          </label>
          <input
            id="name"
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
          <label htmlFor="email" className={labelClassName}>
            Email Address
          </label>
          <input
            id="email"
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

      {/* Location + Property Type row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className={labelClassName}>
            Property Location
          </label>
          <input
            id="location"
            type="text"
            name="location"
            required
            autoComplete="address-level2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClassName}
            placeholder="Observatory, Cape Town"
          />
        </div>
        <div>
          <label htmlFor="propertyType" className={labelClassName}>
            Property Type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            required
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={selectClassName}
            style={{ backgroundImage: chevronBg }}
          >
            <option value="" disabled>
              Select a property type…
            </option>
            <option value="co-living">Co-living</option>
            <option value="single-unit">Single Unit</option>
            <option value="entire-block">Entire Block</option>
          </select>
        </div>
      </div>

      {/* Phone + Units row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClassName}>
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClassName}
            placeholder="+27 82 123 4567"
          />
        </div>
        <div>
          <label htmlFor="units" className={labelClassName}>
            Number of Units
          </label>
          <input
            id="units"
            type="number"
            name="units"
            min="1"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className={inputClassName}
            placeholder="1"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="space-y-2 pt-2">
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
          Submit Enquiry
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </form>
  );
}
