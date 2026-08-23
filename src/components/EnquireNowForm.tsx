"use client";

import { ArrowRight } from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
import { submitEnquiryForm } from "@/actions/enquiry";
import type { EnquiryFormData, FormErrors } from "@/types/forms";
import FormField from "@/components/ui/FormField";
import FormSuccess from "@/components/ui/FormSuccess";
import { inputClassName, labelClassName } from "@/components/ui/formStyles";

const dateInputClassName = `${inputClassName} [&::-webkit-calendar-picker-indicator]:invert-[0.85] [&::-webkit-calendar-picker-indicator]:opacity-70 scheme:dark`;

function validate(
  values: EnquiryFormData,
): FormErrors<EnquiryFormData> | undefined {
  const errors: FormErrors<EnquiryFormData> = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Invalid email format";
  if (!values.message.trim()) errors.message = "Message is required";
  return Object.keys(errors).length > 0 ? errors : undefined;
}

export default function EnquireNowForm({
  propertySlug = "",
  propertyTitle = "",
}: {
  propertySlug?: string;
  propertyTitle?: string;
}) {
  const INITIAL_VALUES: EnquiryFormData = {
    name: "",
    email: "",
    moveInDate: "",
    message: "",
    propertySlug,
  };

  const {
    values,
    errors,
    status,
    serverError,
    setField,
    handleSubmit,
    reset,
    isSubmitting,
  } = useFormState<EnquiryFormData>({
    initialValues: INITIAL_VALUES,
    validate,
    onSubmit: async (data) => {
      const result = await submitEnquiryForm(data);
      if (!result.success) {
        throw new Error(result.message);
      }
    },
  });

  if (status === "success") {
    return (
      <FormSuccess
        title="Thank you! We'll be in touch within 24 hours."
        message={
          propertyTitle
            ? `Your enquiry for "${propertyTitle}" has been received.`
            : "Your enquiry has been received."
        }
        buttonText="Send another enquiry"
        onReset={reset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        id="enquire-name"
        label="Full Name"
        name="name"
        value={values.name}
        onChange={(v) => setField("name", v)}
        placeholder="Jane Doe"
        required
        autoComplete="name"
        error={errors.name}
      />

      <FormField
        id="enquire-email"
        label="Email Address"
        type="email"
        name="email"
        value={values.email}
        onChange={(v) => setField("email", v)}
        placeholder="jane@example.com"
        required
        autoComplete="email"
        error={errors.email}
      />

      <div>
        <label htmlFor="enquire-move-in" className={labelClassName}>
          Move-in Date
        </label>
        <input
          id="enquire-move-in"
          type="date"
          name="moveInDate"
          required
          value={values.moveInDate}
          onChange={(e) => setField("moveInDate", e.target.value)}
          className={dateInputClassName}
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
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
          className={`${inputClassName} min-h-32 resize-none`}
          placeholder="Tell us a bit about what you're looking for…"
          aria-invalid={errors.message ? true : undefined}
        />
        {errors.message && (
          <p
            className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400"
            role="alert"
          >
            {errors.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          className="text-sm font-medium text-red-500 dark:text-red-400"
          role="alert"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-yellow)] px-6 text-sm font-bold text-navy-900 transition-all hover:bg-[var(--accent-yellow-hover)] hover:scale-[1.02] hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed sm:h-14 sm:px-8 sm:text-base sm:w-auto"
      >
        {isSubmitting ? "Submitting…" : "Enquire Now"}
        {!isSubmitting && <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
      </button>
    </form>
  );
}
