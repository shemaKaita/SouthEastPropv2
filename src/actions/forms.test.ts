import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactSubmission: { create: vi.fn() },
    enquirySubmission: { create: vi.fn() },
    landlordSubmission: { create: vi.fn() },
  },
}));

vi.mock("@/lib/logger", () => ({
  logInfo: vi.fn(),
  logError: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() =>
    Promise.resolve({
      get: vi.fn(() => "127.0.0.1"),
    }),
  ),
}));

import { submitContactForm } from "@/actions/contact";
import { submitEnquiryForm } from "@/actions/enquiry";
import { submitLandlordForm } from "@/actions/landlord";
import { prisma } from "@/lib/prisma";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("submitContactForm", () => {
  it("succeeds with valid data and persists to DB", async () => {
    vi.mocked(prisma.contactSubmission.create).mockResolvedValue({} as never);
    const result = await submitContactForm({
      name: "John",
      email: "john@test.com",
      subject: "Inquiry",
      message: "Hello there",
    });
    expect(result.success).toBe(true);
    expect(prisma.contactSubmission.create).toHaveBeenCalledOnce();
  });

  it("fails for missing required fields", async () => {
    const result = await submitContactForm({
      name: "",
      email: "john@test.com",
      subject: "Hi",
      message: "Hello",
    });
    expect(result.success).toBe(false);
    expect(prisma.contactSubmission.create).not.toHaveBeenCalled();
  });

  it("fails for invalid email", async () => {
    const result = await submitContactForm({
      name: "John",
      email: "not-an-email",
      subject: "Hi",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("fails for missing message", async () => {
    const result = await submitContactForm({
      name: "John",
      email: "john@test.com",
      subject: "Hi",
      message: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("submitEnquiryForm", () => {
  it("succeeds with valid data and persists to DB", async () => {
    vi.mocked(prisma.enquirySubmission.create).mockResolvedValue({} as never);
    const result = await submitEnquiryForm({
      name: "Jane",
      email: "jane@test.com",
      moveInDate: "2024-09-01",
      message: "Interested",
      propertySlug: "sea-point-apartment",
    });
    expect(result.success).toBe(true);
    expect(prisma.enquirySubmission.create).toHaveBeenCalledOnce();
  });

  it("fails for missing propertySlug", async () => {
    const result = await submitEnquiryForm({
      name: "Jane",
      email: "jane@test.com",
      moveInDate: "2024-09-01",
      message: "Interested",
      propertySlug: "",
    });
    expect(result.success).toBe(false);
  });

  it("fails for invalid email", async () => {
    const result = await submitEnquiryForm({
      name: "Jane",
      email: "bad",
      moveInDate: "2024-09-01",
      message: "Interested",
      propertySlug: "test-prop",
    });
    expect(result.success).toBe(false);
  });
});

describe("submitLandlordForm", () => {
  it("succeeds with valid data and persists to DB", async () => {
    vi.mocked(prisma.landlordSubmission.create).mockResolvedValue({} as never);
    const result = await submitLandlordForm({
      name: "Bob",
      email: "bob@test.com",
      phone: "+27 21 000 0000",
      location: "Cape Town",
      propertyType: "House",
      units: "5",
    });
    expect(result.success).toBe(true);
    expect(prisma.landlordSubmission.create).toHaveBeenCalledOnce();
  });

  it("fails for missing name", async () => {
    const result = await submitLandlordForm({
      name: "",
      email: "bob@test.com",
      phone: "+27 21 000 0000",
      location: "Cape Town",
      propertyType: "House",
      units: "5",
    });
    expect(result.success).toBe(false);
  });

  it("fails for invalid email", async () => {
    const result = await submitLandlordForm({
      name: "Bob",
      email: "invalid",
      phone: "+27 21 000 0000",
      location: "Cape Town",
      propertyType: "House",
      units: "5",
    });
    expect(result.success).toBe(false);
  });
});
