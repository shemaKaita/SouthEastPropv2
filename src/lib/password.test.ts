import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password", () => {
  describe("hashPassword", () => {
    it("produces a hash different from the input", async () => {
      const hash = await hashPassword("mySecret123");
      expect(hash).not.toBe("mySecret123");
      expect(hash.length).toBeGreaterThan(20);
    });

    it("produces unique hashes for the same input (salt)", async () => {
      const hash1 = await hashPassword("samePassword");
      const hash2 = await hashPassword("samePassword");
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("returns true for correct password", async () => {
      const hash = await hashPassword("correctPass");
      const result = await verifyPassword("correctPass", hash);
      expect(result).toBe(true);
    });

    it("returns false for wrong password", async () => {
      const hash = await hashPassword("correctPass");
      const result = await verifyPassword("wrongPass", hash);
      expect(result).toBe(false);
    });

    it("returns false for empty password", async () => {
      const hash = await hashPassword("something");
      const result = await verifyPassword("", hash);
      expect(result).toBe(false);
    });
  });
});
