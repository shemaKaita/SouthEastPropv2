/**
 * Session management using iron-session.
 *
 * Encrypted, stateless, JWT-like sessions stored in an httpOnly cookie.
 * No server-side session store required — perfect for Railway deployment.
 */

import {
  getIronSession,
  type SessionOptions,
  type IronSession,
} from "iron-session";
import { cookies } from "next/headers";

export type AdminSessionData = {
  userId?: string;
  email?: string;
  role?: string;
};

export type AdminSession = IronSession<AdminSessionData>;

const sessionPassword =
  process.env.SESSION_SECRET ??
  "development-secret-change-in-production-32chars";

export const sessionOptions: SessionOptions = {
  password: sessionPassword,
  cookieName: "sep_admin_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Get the current admin session (server-side only).
 * Must be called from a server component or server action.
 */
export async function getSession(): Promise<AdminSession> {
  const cookieStore = await cookies();
  return getIronSession<AdminSessionData>(cookieStore, sessionOptions);
}

/**
 * Check if the current session is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session.userId;
}

/**
 * Require authentication — throws if not authenticated.
 * Use in server actions that need admin access.
 */
export async function requireAuth(): Promise<AdminSession> {
  const session = await getSession();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }
  return session;
}
