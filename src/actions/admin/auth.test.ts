import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/password", () => ({
  verifyPassword: vi.fn(),
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

import { loginAction, logoutAction } from "@/actions/admin/auth";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockGetSession = vi.mocked(getSession);
const mockVerifyPassword = vi.mocked(verifyPassword);

const mockSession = {
  userId: undefined as string | undefined,
  email: undefined as string | undefined,
  role: undefined as string | undefined,
  save: vi.fn().mockResolvedValue(undefined),
  destroy: vi.fn().mockResolvedValue(undefined),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockSession.userId = undefined;
  mockSession.email = undefined;
  mockSession.role = undefined;
  mockGetSession.mockResolvedValue(mockSession as never);
});

function createFormData(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    fd.set(key, value);
  }
  return fd;
}

describe("loginAction", () => {
  it("returns success for valid credentials", async () => {
    mockFindUnique.mockResolvedValue({
      id: "user-1",
      email: "admin@test.com",
      passwordHash: "hashed",
      role: "ADMIN",
    } as never);
    mockVerifyPassword.mockResolvedValue(true as never);

    const result = await loginAction(
      createFormData({ email: "admin@test.com", password: "password123" }),
    );

    expect(result.success).toBe(true);
    expect(mockSession.userId).toBe("user-1");
    expect(mockSession.email).toBe("admin@test.com");
    expect(mockSession.save).toHaveBeenCalled();
  });

  it("returns failure for non-existent user", async () => {
    mockFindUnique.mockResolvedValue(null as never);

    const result = await loginAction(
      createFormData({ email: "nobody@test.com", password: "pass" }),
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid email or password.");
  });

  it("returns failure for wrong password", async () => {
    mockFindUnique.mockResolvedValue({
      id: "user-1",
      email: "admin@test.com",
      passwordHash: "hashed",
      role: "ADMIN",
    } as never);
    mockVerifyPassword.mockResolvedValue(false as never);

    const result = await loginAction(
      createFormData({ email: "admin@test.com", password: "wrong" }),
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid email or password.");
  });

  it("returns failure for invalid email format", async () => {
    const result = await loginAction(
      createFormData({ email: "not-an-email", password: "pass" }),
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid email or password.");
  });

  it("returns failure for empty password", async () => {
    const result = await loginAction(
      createFormData({ email: "admin@test.com", password: "" }),
    );

    expect(result.success).toBe(false);
  });
});

describe("logoutAction", () => {
  it("destroys session and returns success", async () => {
    const result = await logoutAction();

    expect(result.success).toBe(true);
    expect(mockSession.destroy).toHaveBeenCalled();
  });
});
