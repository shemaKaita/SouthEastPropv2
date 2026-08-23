"use client";

import { useCallback, useState, type FormEvent } from "react";
import type { FormStatus, FormErrors } from "@/types/forms";

/**
 * Generic form state management hook.
 *
 * Replaces the duplicated useState-per-field + console.log pattern
 * across ContactForm, EnquireNowForm, and LandlordEnquiryForm.
 *
 * Features:
 * - Single state object for all fields
 * - Validation support (sync or async validator)
 * - Submission status tracking (idle/submitting/success/error)
 * - Field-level and form-level error messages
 * - Reset to initial values
 */

type UseFormStateOptions<T extends Record<string, string>> = {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => FormErrors<T> | undefined;
};

type UseFormStateReturn<T extends Record<string, string>> = {
  values: T;
  errors: FormErrors<T>;
  status: FormStatus;
  serverError: string | null;
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  reset: () => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  hasError: boolean;
};

export function useFormState<T extends Record<string, string>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormStateOptions<T>): UseFormStateReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const setField = useCallback(
    <K extends keyof T>(field: K, value: T[K]): void => {
      setValuesState((prev) => ({ ...prev, [field]: value }));
      // Clear field error on edit
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const setValues = useCallback((newValues: Partial<T>): void => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const reset = useCallback((): void => {
    setValuesState(initialValues);
    setErrors({});
    setStatus("idle");
    setServerError(null);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      // Client-side validation
      if (validate) {
        const validationErrors = validate(values);
        if (validationErrors && Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      setStatus("submitting");
      setServerError(null);

      try {
        await onSubmit(values);
        setStatus("success");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setServerError(message);
        setStatus("error");
      }
    },
    [values, validate, onSubmit],
  );

  return {
    values,
    errors,
    status,
    serverError,
    setField,
    setValues,
    handleSubmit,
    reset,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
    hasError: status === "error",
  };
}
