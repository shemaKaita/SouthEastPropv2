"use client";

import { ArrowRight } from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
import { submitContactForm } from "@/actions/contact";
import type { ContactFormData, FormErrors } from "@/types/forms";
import FormField from "@/components/ui/FormField";
import FormSuccess from "@/components/ui/FormSuccess";
import {
  errorClassName,
  inputClassName,
  labelClassName,
  serverErrorClassName,
  submitButtonClassName,
} from "@/components/ui/formStyles";
import { isValidEmail } from "@/lib/validation";

const INITIAL_VALUES: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function validate(
  values: ContactFormData,
): FormErrors<ContactFormData> | undefined {
  const errors: FormErrors<ContactFormData> = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(values.email)) errors.email = "Invalid email format";
  if (!values.message.trim()) errors.message = "Message is required";
  return Object.keys(errors).length > 0 ? errors : undefined;
}

export default function ContactForm() {
  const {
    values,
    errors,
    status,
    serverError,
    setField,
    handleSubmit,
    reset,
    isSubmitting,
  } = useFormState<ContactFormData>({
    initialValues: INITIAL_VALUES,
    validate,
    onSubmit: async (data) => {
      const result = await submitContactForm(data);
      if (!result.success) {
        throw new Error(result.message);
      }
    },
  });

  if (status === "success") {
    return (
      <FormSuccess
        title="Thank you! Your message has been sent."
        message="We'll get back to you within 24 hours."
        buttonText="Send another message"
        onReset={reset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          id="contact-name"
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
          id="contact-email"
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
      </div>

      <FormField
        id="contact-subject"
        label="Subject"
        name="subject"
        value={values.subject}
        onChange={(v) => setField("subject", v)}
        placeholder="How can we help?"
        required
        error={errors.subject}
      />

      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
          className={`${inputClassName} min-h-32 resize-none`}
          placeholder="Tell us a bit more about your enquiry…"
          aria-invalid={errors.message ? true : undefined}
        />
        {errors.message && (
          <p className={errorClassName} role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className={serverErrorClassName} role="alert">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${submitButtonClassName} mt-2 sm:self-start`}
      >
        {isSubmitting ? "Sending…" : "Send Message"}
        {!isSubmitting && <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
      </button>
    </form>
  );
}
