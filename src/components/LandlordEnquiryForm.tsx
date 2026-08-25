"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
import { submitLandlordForm } from "@/actions/landlord";
import type { LandlordFormData, FormErrors } from "@/types/forms";
import FormField from "@/components/ui/FormField";
import FormSelect from "@/components/ui/FormSelect";
import FormSuccess from "@/components/ui/FormSuccess";
import {
  inputClassName,
  labelClassName,
  serverErrorClassName,
  submitButtonClassName,
} from "@/components/ui/formStyles";
import { isValidEmail } from "@/lib/validation";

const PROPERTY_TYPE_OPTIONS = [
  { value: "co-living", label: "Co-living" },
  { value: "single-unit", label: "Single Unit" },
  { value: "entire-block", label: "Entire Block" },
];

const INITIAL_VALUES: LandlordFormData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  propertyType: "",
  units: "",
};

function validate(
  values: LandlordFormData,
): FormErrors<LandlordFormData> | undefined {
  const errors: FormErrors<LandlordFormData> = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(values.email)) errors.email = "Invalid email format";
  if (!values.phone.trim()) errors.phone = "Phone number is required";
  if (!values.location.trim()) errors.location = "Location is required";
  if (!values.propertyType) errors.propertyType = "Property type is required";
  return Object.keys(errors).length > 0 ? errors : undefined;
}

export default function LandlordEnquiryForm() {
  const [submitPayload, setSubmitPayload] = useState<LandlordFormData | null>(
    null,
  );

  const {
    values,
    errors,
    status,
    serverError,
    setField,
    handleSubmit,
    reset,
    isSubmitting,
  } = useFormState<LandlordFormData>({
    initialValues: INITIAL_VALUES,
    validate,
    onSubmit: async (data) => {
      const result = await submitLandlordForm(data);
      if (!result.success) {
        throw new Error(result.message);
      }
      setSubmitPayload(result.data ?? data);
    },
  });

  if (status === "success") {
    const firstName = submitPayload?.name?.split(" ")[0];
    return (
      <FormSuccess
        title={`Thank you${firstName ? `, ${firstName}` : ""}!`}
        message="We'll be in touch within 24 hours to discuss your management proposal and outline next steps for your property."
        buttonText="Submit another enquiry"
        onReset={() => {
          setSubmitPayload(null);
          reset();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name + Email row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          id="name"
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
          id="email"
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

      {/* Location + Property Type row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          id="location"
          label="Property Location"
          name="location"
          value={values.location}
          onChange={(v) => setField("location", v)}
          placeholder="Observatory, Cape Town"
          required
          autoComplete="address-level2"
          error={errors.location}
        />
        <FormSelect
          id="propertyType"
          label="Property Type"
          name="propertyType"
          value={values.propertyType}
          onChange={(v) => setField("propertyType", v)}
          options={PROPERTY_TYPE_OPTIONS}
          required
          placeholder="Select a property type…"
          error={errors.propertyType}
        />
      </div>

      {/* Phone + Units row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          id="phone"
          label="Phone Number"
          type="tel"
          name="phone"
          value={values.phone}
          onChange={(v) => setField("phone", v)}
          placeholder="+27 82 123 4567"
          required
          autoComplete="tel"
          error={errors.phone}
        />
        <div>
          <label htmlFor="units" className={labelClassName}>
            Number of Units
          </label>
          <input
            id="units"
            type="number"
            name="units"
            min="1"
            value={values.units}
            onChange={(e) => setField("units", e.target.value)}
            className={inputClassName}
            placeholder="1"
          />
        </div>
      </div>

      {serverError && (
        <p className={serverErrorClassName} role="alert">
          {serverError}
        </p>
      )}

      {/* Submit button */}
      <div className="space-y-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={submitButtonClassName}
        >
          {isSubmitting ? "Submitting…" : "Submit Enquiry"}
          {!isSubmitting && <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button>
      </div>
    </form>
  );
}
