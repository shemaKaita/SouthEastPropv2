import { describe, it, expect } from "vitest";
import { sanitizeForLog, sanitizeObjectForLog } from "@/lib/sanitize";

describe("sanitize", () => {
  describe("sanitizeForLog", () => {
    it("strips angle brackets", () => {
      expect(sanitizeForLog("<script>alert(1)</script>")).toBe(
        "scriptalert(1)/script",
      );
    });

    it("strips control characters", () => {
      expect(sanitizeForLog("hello\x00\x01world")).toBe("helloworld");
    });

    it("trims whitespace", () => {
      expect(sanitizeForLog("  hello  ")).toBe("hello");
    });

    it("caps length to 1000 characters", () => {
      const long = "a".repeat(2000);
      expect(sanitizeForLog(long).length).toBe(1000);
    });

    it("passes through clean input unchanged", () => {
      expect(sanitizeForLog("clean input")).toBe("clean input");
    });
  });

  describe("sanitizeObjectForLog", () => {
    it("sanitizes string values in object", () => {
      const result = sanitizeObjectForLog({
        name: "<b>John</b>",
        email: "john@test.com",
      });
      expect(result.name).toBe("bJohn/b");
      expect(result.email).toBe("john@test.com");
    });

    it("converts non-string values to string", () => {
      const result = sanitizeObjectForLog({
        count: 42,
        active: true,
      });
      expect(result.count).toBe("42");
      expect(result.active).toBe("true");
    });
  });
});
