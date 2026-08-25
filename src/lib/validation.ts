/**
 * Shared validation utilities — used by both client-side form hooks
 * and server-side actions to avoid duplication.
 */

/** RFC 5322 simplified email regex — sufficient for form validation */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate an email address format */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/** Check if a string is non-empty after trimming */
export function isNonEmpty(value: string | undefined | null): boolean {
  return !!value?.trim();
}

/**
 * Validate required fields — returns a partial errors object.
 * Shared by client-side form validators and server actions.
 *
 * @example
 * const errors = validateRequired(values, {
 *   name: "Name is required",
 *   email: "Email is required",
 * });
 * if (errors.email && !isValidEmail(values.email)) {
 *   errors.email = "Invalid email format";
 * }
 */
export function validateRequired<T extends Record<string, string>>(
  values: T,
  messages: Partial<Record<keyof T, string>>,
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const key in messages) {
    if (!isNonEmpty(values[key])) {
      errors[key] = messages[key];
    }
  }
  return errors;
}

/** Check if an errors object has any entries */
export function hasErrors<T extends Record<string, string | undefined>>(
  errors: T,
): boolean {
  return Object.keys(errors).length > 0;
}
