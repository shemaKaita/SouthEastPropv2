/**
 * Middleware for admin route protection.
 *
 * Checks for the iron-session cookie on /admin routes (except /admin/login).
 * Redirects unauthenticated users to /admin/login.
 *
 * Also forwards the current pathname as `x-pathname` header on admin
 * routes so the admin layout can use it (and so the root layout's
 * SiteChrome can detect admin paths).
 *
 * Note: iron-session cookies are encrypted, so we can only check
 * for presence here — actual decryption happens server-side.
 * The real auth check is in server components/actions via requireAuth().
 */

import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "sep_admin_session";
const LOGIN_PATH = "/admin/login";
const PATHNAME_HEADER = "x-pathname";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Forward pathname for server-side route detection in the root layout
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PATHNAME_HEADER, pathname);

  // Allow access to the login page without a session
  if (pathname === LOGIN_PATH) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  if (!sessionCookie) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*"],
};
