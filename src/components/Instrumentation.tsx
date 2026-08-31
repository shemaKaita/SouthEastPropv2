"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/web-vitals";

/**
 * Client bootstrap for site-wide instrumentation.
 * Mounted once in the root layout (server component) so the tiny
 * web-vitals chunk loads after hydration with zero render output.
 */
export default function Instrumentation(): null {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null;
}