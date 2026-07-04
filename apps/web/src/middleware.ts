import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/panel", "/checkout", "/orders"];
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("atlas_auth")?.value;
  const { pathname } = request.nextUrl;

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
