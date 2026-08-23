"use client";

import { useEffect } from "react";

/**
 * Locks body scroll when `locked` is true.
 * Restores previous overflow value on cleanup.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
