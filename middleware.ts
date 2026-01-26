import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for the login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const adminSession = request.cookies.get("admin_session");

  if (!adminSession || adminSession.value !== "authenticated") {
    // Redirect to login page
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
