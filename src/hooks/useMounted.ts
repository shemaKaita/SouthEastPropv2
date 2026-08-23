"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe mounted detection.
 * Returns false during SSR, true on the client after hydration.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}
