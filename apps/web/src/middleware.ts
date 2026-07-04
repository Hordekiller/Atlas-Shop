import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/panel", "/checkout", "/orders"];
const authRoutes = ["/auth/login", "/auth/register"];

// Simple in-memory rate limiter for edge middleware
const rateMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit auth routes: 10 requests per minute per IP
  if (pathname.startsWith("/auth/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";
    const allowed = rateLimit(`auth:${ip}`, 10, 60_000);
    if (!allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
  }

  const token = request.cookies.get("atlas_auth")?.value;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/checkout/:path*", "/orders/:path*", "/auth/:path*"],
};
