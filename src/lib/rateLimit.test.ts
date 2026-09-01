import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimit, FORM_RATE_LIMIT } from "@/lib/rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    // We can't directly clear the internal store, but using unique
    // identifiers per test avoids cross-test contamination
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows first request", () => {
    const result = rateLimit(`test-first-${Date.now()}`, 5, 60000);
    expect(result.limited).toBe(false);
    expect(result.remaining).toBe(4);
  });

  it("limits after max requests reached", () => {
    const id = `test-limit-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      rateLimit(id, 5, 60000);
    }
    const result = rateLimit(id, 5, 60000);
    expect(result.limited).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("allows up to max requests", () => {
    const id = `test-max-${Date.now()}`;
    for (let i = 0; i < 4; i++) {
      const result = rateLimit(id, 5, 60000);
      expect(result.limited).toBe(false);
    }
    const fifth = rateLimit(id, 5, 60000);
    expect(fifth.limited).toBe(false);
    expect(fifth.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    vi.useFakeTimers();
    const id = `test-reset-${Date.now()}`;
    rateLimit(id, 1, 1000);
    // Advance past the window
    vi.advanceTimersByTime(1001);
    const result = rateLimit(id, 1, 1000);
    expect(result.limited).toBe(false);
  });

  it("tracks different identifiers independently", () => {
    const id1 = `test-independent-1-${Date.now()}`;
    const id2 = `test-independent-2-${Date.now()}`;
    rateLimit(id1, 1, 60000);
    const r1 = rateLimit(id1, 1, 60000);
    const r2 = rateLimit(id2, 1, 60000);
    expect(r1.limited).toBe(true);
    expect(r2.limited).toBe(false);
  });

  it("FORM_RATE_LIMIT has expected defaults", () => {
    expect(FORM_RATE_LIMIT.maxRequests).toBe(5);
    expect(FORM_RATE_LIMIT.windowMs).toBe(10 * 60 * 1000);
  });
});
