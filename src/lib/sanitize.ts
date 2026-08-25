/**
 * Input sanitization utilities for server-side processing.
 *
 * Strips potential XSS vectors from user input before storage or logging.
 */

/**
 * Sanitize a string for safe logging/storage.
 * Strips angle brackets and control characters that could be
 * interpreted as HTML if the logged value is ever rendered.
 */
export function sanitizeForLog(value: string): string {
  return value
    .replace(/[<>]/g, "")
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .slice(0, 1000); // Cap length to prevent log flooding
}

/**
 * Sanitize an object's string values for logging.
 * Recursively processes nested objects.
 */
export function sanitizeObjectForLog<T extends Record<string, unknown>>(
  obj: T,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    result[key] =
      typeof value === "string" ? sanitizeForLog(value) : String(value);
  }
  return result;
}
