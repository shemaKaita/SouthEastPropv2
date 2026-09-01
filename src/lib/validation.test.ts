import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isNonEmpty,
  validateRequired,
  hasErrors,
} from "@/lib/validation";

describe("validation", () => {
  describe("isValidEmail", () => {
    it.each(["user@example.com", "test.name@domain.co.za", "a@b.io"])(
      "returns true for valid email: %s",
      (email) => {
        expect(isValidEmail(email)).toBe(true);
      },
    );

    it.each([
      "",
      "noatsign",
      "no@domain",
      "@nodomain.com",
      "spaces @example.com",
      "double@@at.com",
    ])("returns false for invalid email: %s", (email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  describe("isNonEmpty", () => {
    it("returns true for non-empty string", () => {
      expect(isNonEmpty("hello")).toBe(true);
    });

    it("returns true for string with spaces only after trim", () => {
      expect(isNonEmpty("  hello  ")).toBe(true);
    });

    it("returns false for empty string", () => {
      expect(isNonEmpty("")).toBe(false);
    });

    it("returns false for whitespace-only string", () => {
      expect(isNonEmpty("   ")).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isNonEmpty(undefined)).toBe(false);
    });

    it("returns false for null", () => {
      expect(isNonEmpty(null)).toBe(false);
    });
  });

  describe("validateRequired", () => {
    it("returns errors for empty fields", () => {
      const errors = validateRequired(
        { name: "", email: "" },
        { name: "Name required", email: "Email required" },
      );
      expect(errors.name).toBe("Name required");
      expect(errors.email).toBe("Email required");
    });

    it("returns no errors for filled fields", () => {
      const errors = validateRequired(
        { name: "John", email: "john@test.com" },
        { name: "Name required", email: "Email required" },
      );
      expect(errors.name).toBeUndefined();
      expect(errors.email).toBeUndefined();
    });

    it("returns error only for missing fields", () => {
      const errors = validateRequired(
        { name: "John", email: "" },
        { name: "Name required", email: "Email required" },
      );
      expect(errors.name).toBeUndefined();
      expect(errors.email).toBe("Email required");
    });
  });

  describe("hasErrors", () => {
    it("returns false for empty object", () => {
      expect(hasErrors({})).toBe(false);
    });

    it("returns true for object with entries", () => {
      expect(hasErrors({ name: "required" })).toBe(true);
    });
  });
});
