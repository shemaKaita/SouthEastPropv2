import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteContent: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn().mockResolvedValue({ userId: "test" }),
}));

vi.mock("@/lib/site-content", () => ({
  clearContentCache: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logInfo: vi.fn(),
  logError: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  getSiteContent,
  updateSiteContentAction,
} from "@/actions/admin/settings";
import { prisma } from "@/lib/prisma";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getSiteContent", () => {
  it("returns a map of content keys to values", async () => {
    vi.mocked(prisma.siteContent.findMany).mockResolvedValue([
      { id: 1, key: "nav_items", value: [{ label: "Home" }] },
      { id: 2, key: "social_links", value: [{ label: "Facebook" }] },
    ] as never);

    const result = await getSiteContent();
    expect(result.nav_items).toEqual([{ label: "Home" }]);
    expect(result.social_links).toEqual([{ label: "Facebook" }]);
  });

  it("returns empty map when no content", async () => {
    vi.mocked(prisma.siteContent.findMany).mockResolvedValue([] as never);
    const result = await getSiteContent();
    expect(Object.keys(result)).toHaveLength(0);
  });
});

describe("updateSiteContentAction", () => {
  it("updates content successfully", async () => {
    vi.mocked(prisma.siteContent.upsert).mockResolvedValue({} as never);
    const fd = new FormData();
    fd.set("key", "nav_items");
    fd.set("value", JSON.stringify([{ label: "Updated" }]));

    const result = await updateSiteContentAction(fd);
    expect(result.success).toBe(true);
    expect(prisma.siteContent.upsert).toHaveBeenCalledOnce();
  });

  it("fails for invalid JSON value", async () => {
    const fd = new FormData();
    fd.set("key", "nav_items");
    fd.set("value", "not-json{");

    const result = await updateSiteContentAction(fd);
    expect(result.success).toBe(false);
  });

  it("fails for empty key", async () => {
    const fd = new FormData();
    fd.set("key", "");
    fd.set("value", "[]");

    const result = await updateSiteContentAction(fd);
    expect(result.success).toBe(false);
  });

  it("returns failure on Prisma error", async () => {
    vi.mocked(prisma.siteContent.upsert).mockRejectedValue(
      new Error("DB error") as never,
    );
    const fd = new FormData();
    fd.set("key", "nav_items");
    fd.set("value", "[]");

    const result = await updateSiteContentAction(fd);
    expect(result.success).toBe(false);
  });
});
