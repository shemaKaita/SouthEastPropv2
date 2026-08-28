import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma before importing the module under test
vi.mock("@/lib/prisma", () => ({
  prisma: {
    property: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// Mock next/headers for potential transitive imports
vi.mock("next/headers", () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}));

import {
  getAllProperties,
  getAllPropertiesSync,
  getPropertyBySlug,
  getAllPropertySlugs,
} from "@/lib/properties";
import { prisma } from "@/lib/prisma";
import { PROPERTIES } from "@/data/properties";

const mockPrisma = vi.mocked(prisma);

const mockRow = {
  id: "test-id",
  slug: "test-property",
  title: "Test Property",
  location: "Test Location",
  price: "R 1,000",
  priceLabel: "/month",
  beds: 2,
  baths: 1,
  area: 50,
  lat: -33.9,
  lng: 18.4,
  availability: "Available Now",
  badge: "New",
  featuredImage: "https://example.com/img.jpg",
  galleryImages: ["https://example.com/1.jpg"],
  description: "A test property",
  amenities: [{ icon: "Wifi", label: "WiFi" }],
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("properties repository", () => {
  describe("getAllProperties", () => {
    it("returns DB rows when available", async () => {
      vi.mocked(mockPrisma.property.findMany).mockResolvedValue([mockRow]);
      const result = await getAllProperties();
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("test-property");
      expect(result[0].amenities).toEqual([{ icon: "Wifi", label: "WiFi" }]);
    });

    it("falls back to static data when DB returns empty", async () => {
      vi.mocked(mockPrisma.property.findMany).mockResolvedValue([]);
      const result = await getAllProperties();
      expect(result.length).toBe(PROPERTIES.length);
    });

    it("falls back to static data on DB error", async () => {
      vi.mocked(mockPrisma.property.findMany).mockRejectedValue(
        new Error("DB down"),
      );
      const result = await getAllProperties();
      expect(result.length).toBe(PROPERTIES.length);
    });
  });

  describe("getAllPropertiesSync", () => {
    it("returns static data", () => {
      const result = getAllPropertiesSync();
      expect(result.length).toBe(PROPERTIES.length);
    });

    it("returns a defensive copy", () => {
      const r1 = getAllPropertiesSync();
      const r2 = getAllPropertiesSync();
      expect(r1).not.toBe(r2);
      expect(r1).toEqual(r2);
    });
  });

  describe("getPropertyBySlug", () => {
    it("returns property from DB when found", async () => {
      vi.mocked(mockPrisma.property.findUnique).mockResolvedValue(mockRow);
      const result = await getPropertyBySlug("test-property");
      expect(result).not.toBeNull();
      expect(result?.title).toBe("Test Property");
    });

    it("returns null when not found in DB or static", async () => {
      vi.mocked(mockPrisma.property.findUnique).mockResolvedValue(null);
      const result = await getPropertyBySlug("nonexistent");
      expect(result).toBeNull();
    });

    it("falls back to static data on DB error", async () => {
      vi.mocked(mockPrisma.property.findUnique).mockRejectedValue(
        new Error("DB down"),
      );
      const result = await getPropertyBySlug(PROPERTIES[0].slug);
      expect(result).not.toBeNull();
      expect(result?.slug).toBe(PROPERTIES[0].slug);
    });

    it("returns null when DB returns null and static doesn't have it", async () => {
      vi.mocked(mockPrisma.property.findUnique).mockResolvedValue(null);
      const result = await getPropertyBySlug("nonexistent-slug");
      expect(result).toBeNull();
    });

    it("falls back to static data on DB error when static has it", async () => {
      vi.mocked(mockPrisma.property.findUnique).mockRejectedValue(
        new Error("DB down"),
      );
      const result = await getPropertyBySlug(PROPERTIES[0].slug);
      expect(result).not.toBeNull();
      expect(result?.slug).toBe(PROPERTIES[0].slug);
    });
  });

  describe("getAllPropertySlugs", () => {
    it("returns slugs from DB when available", async () => {
      vi.mocked(mockPrisma.property.findMany).mockResolvedValue([
        { slug: "db-slug-1" },
        { slug: "db-slug-2" },
      ] as never);
      const result = await getAllPropertySlugs();
      expect(result).toEqual([{ slug: "db-slug-1" }, { slug: "db-slug-2" }]);
    });

    it("falls back to static slugs when DB returns empty", async () => {
      vi.mocked(mockPrisma.property.findMany).mockResolvedValue([]);
      const result = await getAllPropertySlugs();
      expect(result.length).toBe(PROPERTIES.length);
    });

    it("falls back to static slugs on DB error", async () => {
      vi.mocked(mockPrisma.property.findMany).mockRejectedValue(
        new Error("DB down"),
      );
      const result = await getAllPropertySlugs();
      expect(result.length).toBe(PROPERTIES.length);
    });
  });
});
