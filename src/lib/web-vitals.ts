/**
 * Client-side web-vitals beacons.
 *
 * Reports LCP, INP, CLS, and TTFB (via the `web-vitals` library, the same
 * attribution-ready implementation Chrome uses for CrUX) to a lightweight
 * server endpoint. The server forwards to the structured logger —
 * which is the documented integration point for Sentry/observability
 * sinks (see src/lib/logger.ts).
 *
 * Zero UI impact: observers are passive, the beacon uses
 * sendBeacon (fire-and-forget, survives page unload), and the script is
 * a tiny client chunk that loads after hydration.
 */

"use client";

import { onCLS, onINP, onLCP, onTTFB } from "web-vitals";

type VitalsPayload = {
  name: "CLS" | "INP" | "LCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  path: string;
};

function report({ name, value, rating }: VitalsPayload): void {
  const payload = JSON.stringify({
    name,
    value: Math.round(value),
    rating,
    path: window.location.pathname,
    ts: Date.now(),
  });

  // sendBeacon: async, survives navigation, no response handling needed.
  // Fallback to fetch(keepalive) if the browser lacks sendBeacon.
  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon("/api/vitals", payload);
  } else {
    void fetch("/api/vitals", {
      method: "POST",
      body: payload,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    });
  }
}

let started = false;

/**
 * Register vitals observers once. Safe to call from any client component;
 * subsequent calls are no-ops.
 */
export function initWebVitals(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  onCLS((m) => report({ ...m, path: location.pathname }));
  onINP((m) => report({ ...m, path: location.pathname }));
  onLCP((m) => report({ ...m, path: location.pathname }));
  onTTFB((m) => report({ ...m, path: location.pathname }));
}