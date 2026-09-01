/**
 * Structured logging utility.
 *
 * In development, logs to console.
 * In production, this is the integration point for Sentry, Bugsnag, etc.
 */

const isProduction = process.env.NODE_ENV === "production";

export function logError(
  error: Error | string,
  context?: Record<string, unknown>,
): void {
  const payload = {
    level: "error" as const,
    message: typeof error === "string" ? error : error.message,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (isProduction) {
    // Integration point: Sentry.captureException(error, { extra: context })
    console.error("[ERROR]", JSON.stringify(payload));
  } else {
    console.error("[ERROR]", payload);
  }
}

export function logInfo(
  message: string,
  context?: Record<string, unknown>,
): void {
  if (isProduction) {
    // Integration point: Sentry.captureMessage / observability sink
    console.info("[INFO]", JSON.stringify({ message, ...context }));
  } else {
    console.info("[INFO]", message, context);
  }
}

/**
 * Namespace-style logger. `logger.info(...)` is the preferred call site —
 * it keeps a stable import shape regardless of which sink is wired in
 * later (Sentry, Datadog, etc.).
 */
export const logger = {
  error: logError,
  info: logInfo,
};
