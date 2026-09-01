import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactSubmission: {
      findMany: vi.fn(),
      count: vi.fn(),
      delete: vi.fn(),
    },
    enquirySubmission: {
      findMany: vi.fn(),
      count: vi.fn(),
      delete: vi.fn(),
    },
    landlordSubmission: {
      findMany: vi.fn(),
      count: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn().mockResolvedValue({ userId: "test" }),
}));

vi.mock("@/lib/logger", () => ({
  logInfo: vi.fn(),
  logError: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  getSubmissions,
  deleteSubmissionAction,
} from "@/actions/admin/submissions";
import { prisma } from "@/lib/prisma";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getSubmissions", () => {
  it("returns contact submissions with pagination", async () => {
    vi.mocked(prisma.contactSubmission.findMany).mockResolvedValue([
      {
        id: 1,
        name: "John",
        email: "john@test.com",
        subject: "Hi",
        message: "Hello",
        ip: "127.0.0.1",
        createdAt: new Date(),
      },
    ] as never);
    vi.mocked(prisma.contactSubmission.count).mockResolvedValue(1 as never);

    const result = await getSubmissions("contact", 1, 20);
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it("returns enquiry submissions", async () => {
    vi.mocked(prisma.enquirySubmission.findMany).mockResolvedValue([
      {
        id: 1,
        name: "Jane",
        email: "jane@test.com",
        moveInDate: "2024-01-01",
        message: "Interested",
        propertySlug: "test-prop",
        ip: "127.0.0.1",
        createdAt: new Date(),
      },
    ] as never);
    vi.mocked(prisma.enquirySubmission.count).mockResolvedValue(5 as never);

    const result = await getSubmissions("enquiry", 1, 20);
    expect(result.total).toBe(5);
    expect(result.totalPages).toBe(1);
  });

  it("returns landlord submissions with correct pagination", async () => {
    vi.mocked(prisma.landlordSubmission.findMany).mockResolvedValue(
      [] as never,
    );
    vi.mocked(prisma.landlordSubmission.count).mockResolvedValue(0 as never);

    const result = await getSubmissions("landlord", 1, 20);
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it("calculates total pages correctly for multiple pages", async () => {
    vi.mocked(prisma.contactSubmission.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.contactSubmission.count).mockResolvedValue(50 as never);

    const result = await getSubmissions("contact", 1, 20);
    expect(result.totalPages).toBe(3);
  });
});

describe("deleteSubmissionAction", () => {
  it("deletes a contact submission", async () => {
    vi.mocked(prisma.contactSubmission.delete).mockResolvedValue({} as never);
    const result = await deleteSubmissionAction("contact", 1);
    expect(result.success).toBe(true);
    expect(prisma.contactSubmission.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("deletes an enquiry submission", async () => {
    vi.mocked(prisma.enquirySubmission.delete).mockResolvedValue({} as never);
    const result = await deleteSubmissionAction("enquiry", 5);
    expect(result.success).toBe(true);
  });

  it("deletes a landlord submission", async () => {
    vi.mocked(prisma.landlordSubmission.delete).mockResolvedValue({} as never);
    const result = await deleteSubmissionAction("landlord", 10);
    expect(result.success).toBe(true);
  });

  it("returns failure on DB error", async () => {
    vi.mocked(prisma.contactSubmission.delete).mockRejectedValue(
      new Error("DB error") as never,
    );
    const result = await deleteSubmissionAction("contact", 1);
    expect(result.success).toBe(false);
  });
});
