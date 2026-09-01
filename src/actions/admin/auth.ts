"use server";

/**
 * Admin authentication server actions.
 *
 * Login: validates credentials against the User table, creates an
 * iron-session with the user's ID, email, and role.
 * Logout: destroys the session.
 */

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { rateLimit, FORM_RATE_LIMIT } from "@/lib/rateLimit";
import { logError, logInfo } from "@/lib/logger";
import { sanitizeForLog } from "@/lib/sanitize";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginActionResult = {
  success: boolean;
  message: string;
};

export async function loginAction(
  formData: FormData,
): Promise<LoginActionResult> {
  try {
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    const { limited } = rateLimit(
      `login:${ip}`,
      FORM_RATE_LIMIT.maxRequests,
      FORM_RATE_LIMIT.windowMs,
    );
    if (limited) {
      return {
        success: false,
        message: "Too many login attempts. Please try again later.",
      };
    }

    const raw = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, message: "Invalid email or password." };
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logInfo("Login failed: user not found", {
        email: sanitizeForLog(email),
      });
      return { success: false, message: "Invalid email or password." };
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      logInfo("Login failed: wrong password", {
        email: sanitizeForLog(email),
      });
      return { success: false, message: "Invalid email or password." };
    }

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.role = user.role;
    await session.save();

    logInfo("Admin login successful", { email: sanitizeForLog(email) });
    return { success: true, message: "Login successful." };
  } catch (error) {
    logError(error as Error, { context: "loginAction" });
    return { success: false, message: "An error occurred. Please try again." };
  }
}

export async function logoutAction(): Promise<LoginActionResult> {
  try {
    const session = await getSession();
    session.destroy();
    logInfo("Admin logout");
    return { success: true, message: "Logged out successfully." };
  } catch (error) {
    logError(error as Error, { context: "logoutAction" });
    return { success: false, message: "Logout failed." };
  }
}
