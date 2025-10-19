import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSecurityHeaders } from "./lib/security";

export function middleware(request: NextRequest) {
  // Admin auth check
  const adminAuth = request.cookies.get("admin_auth")?.value;
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";
  if (isAdminRoute && !isAdminLogin && !adminAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Generate nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Set response headers
  const response = NextResponse.next();
  const securityHeaders = getSecurityHeaders(request, nonce);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set('x-nonce', nonce);

  return response;
}
