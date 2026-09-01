import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteContent: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}));

import {
  getNavItems,
  getSocialLinks,
  getContactDetails,
  getPropertyTypes,
  clearContentCache,
} from "@/lib/site-content";
import { prisma } from "@/lib/prisma";
import {
  NAV_ITEMS,
  SOCIAL_LINKS,
  CONTACT_DETAILS,
  PROPERTY_TYPES,
} from "@/lib/constants";

const mockFindMany = vi.mocked(prisma.siteContent.findMany);

beforeEach(() => {
  vi.clearAllMocks();
  clearContentCache();
});

describe("site-content", () => {
  describe("getNavItems", () => {
    it("returns DB value when available", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: 1,
          key: "nav_items",
          value: [{ number: "99", label: "Custom", href: "/custom" }],
        },
      ] as never);
      const result = await getNavItems();
      expect(result).toEqual([
        { number: "99", label: "Custom", href: "/custom" },
      ]);
    });

    it("falls back to constants when DB is empty", async () => {
      mockFindMany.mockResolvedValue([] as never);
      const result = await getNavItems();
      expect(result).toEqual(NAV_ITEMS);
    });

    it("falls back to constants on DB error", async () => {
      mockFindMany.mockRejectedValue(new Error("DB down") as never);
      const result = await getNavItems();
      expect(result).toEqual(NAV_ITEMS);
    });
  });

  describe("getSocialLinks", () => {
    it("returns DB value when available", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: 1,
          key: "social_links",
          value: [{ label: "Discord", href: "https://discord.com" }],
        },
      ] as never);
      const result = await getSocialLinks();
      expect(result).toEqual([
        { label: "Discord", href: "https://discord.com" },
      ]);
    });

    it("falls back to constants", async () => {
      mockFindMany.mockResolvedValue([] as never);
      const result = await getSocialLinks();
      expect(result).toEqual(SOCIAL_LINKS);
    });
  });

  describe("getContactDetails", () => {
    it("falls back to constants on DB error", async () => {
      mockFindMany.mockRejectedValue(new Error("DB down") as never);
      const result = await getContactDetails();
      expect(result).toEqual(CONTACT_DETAILS);
    });
  });

  describe("getPropertyTypes", () => {
    it("falls back to constants", async () => {
      mockFindMany.mockResolvedValue([] as never);
      const result = await getPropertyTypes();
      expect(result).toEqual(PROPERTY_TYPES);
    });
  });

  describe("caching", () => {
    it("caches content within TTL", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: 1,
          key: "nav_items",
          value: [{ number: "01", label: "Cached", href: "/" }],
        },
      ] as never);
      await getNavItems();
      await getNavItems();
      expect(mockFindMany).toHaveBeenCalledTimes(1);
    });

    it("clearContentCache forces reload", async () => {
      mockFindMany.mockResolvedValue([
        {
          id: 1,
          key: "nav_items",
          value: [{ number: "01", label: "First", href: "/" }],
        },
      ] as never);
      await getNavItems();
      clearContentCache();
      mockFindMany.mockResolvedValue([
        {
          id: 1,
          key: "nav_items",
          value: [{ number: "01", label: "Second", href: "/" }],
        },
      ] as never);
      const result = await getNavItems();
      expect(result[0].label).toBe("Second");
      expect(mockFindMany).toHaveBeenCalledTimes(2);
    });
  });
});
