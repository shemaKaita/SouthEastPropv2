"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the page has been scrolled past a threshold.
 * Used for navbar background transitions.
 */
export function useScrollPosition(threshold: number = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return scrolled;
}
