import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    property: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn().mockResolvedValue({ userId: "test-user" }),
}));

vi.mock("@/lib/logger", () => ({
  logInfo: vi.fn(),
  logError: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

import {
  createPropertyAction,
  updatePropertyAction,
  deletePropertyAction,
} from "@/actions/admin/properties";
import { prisma } from "@/lib/prisma";

const mockCreate = vi.mocked(prisma.property.create);
const mockUpdate = vi.mocked(prisma.property.update);
const mockDelete = vi.mocked(prisma.property.delete);

beforeEach(() => {
  vi.clearAllMocks();
});

function createValidFormData(): FormData {
  const fd = new FormData();
  fd.set("slug", "test-property");
  fd.set("title", "Test Property");
  fd.set("location", "Cape Town");
  fd.set("price", "R 1,000");
  fd.set("priceLabel", "/month");
  fd.set("beds", "2");
  fd.set("baths", "1");
  fd.set("area", "50");
  fd.set("lat", "-33.9");
  fd.set("lng", "18.4");
  fd.set("availability", "Available Now");
  fd.set("badge", "New");
  fd.set("featuredImage", "https://example.com/image.jpg");
  fd.set("description", "A test property description");
  fd.set("amenities", JSON.stringify([{ icon: "Wifi", label: "WiFi" }]));
  return fd;
}

describe("createPropertyAction", () => {
  it("creates a valid property", async () => {
    mockCreate.mockResolvedValue({} as never);
    const result = await createPropertyAction(createValidFormData());
    expect(result.success).toBe(true);
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("fails validation for missing title", async () => {
    const fd = createValidFormData();
    fd.set("title", "");
    const result = await createPropertyAction(fd);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Validation failed");
  });

  it("fails validation for invalid slug format", async () => {
    const fd = createValidFormData();
    fd.set("slug", "UPPER CASE");
    const result = await createPropertyAction(fd);
    expect(result.success).toBe(false);
  });

  it("fails validation for invalid featuredImage URL", async () => {
    const fd = createValidFormData();
    fd.set("featuredImage", "not-a-url");
    const result = await createPropertyAction(fd);
    expect(result.success).toBe(false);
  });

  it("returns failure on Prisma error", async () => {
    mockCreate.mockRejectedValue(new Error("DB error") as never);
    const result = await createPropertyAction(createValidFormData());
    expect(result.success).toBe(false);
    expect(result.message).toBe("Failed to create property.");
  });
});

describe("updatePropertyAction", () => {
  it("updates a valid property", async () => {
    mockUpdate.mockResolvedValue({} as never);
    const result = await updatePropertyAction("prop-id", createValidFormData());
    expect(result.success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "prop-id" },
      data: expect.objectContaining({ slug: "test-property" }),
    });
  });

  it("fails validation for missing required fields", async () => {
    const fd = createValidFormData();
    fd.delete("title");
    const result = await updatePropertyAction("prop-id", fd);
    expect(result.success).toBe(false);
  });
});

describe("deletePropertyAction", () => {
  it("deletes a property by id", async () => {
    mockDelete.mockResolvedValue({ slug: "deleted-prop" } as never);
    const result = await deletePropertyAction("prop-id");
    expect(result.success).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "prop-id" } });
  });

  it("returns failure on Prisma error", async () => {
    mockDelete.mockRejectedValue(new Error("DB error") as never);
    const result = await deletePropertyAction("prop-id");
    expect(result.success).toBe(false);
  });
});
