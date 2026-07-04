# Next.js Middleware — Reference

## Basic Structure
```typescript
// apps/web/src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith("/panel") && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect authenticated users away from login
  if (pathname === "/auth/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

## Matcher Patterns
```typescript
export const config = {
  matcher: [
    // Skip internal Next.js paths and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## Route Groups
For Atlas Shop admin route structure:
```
apps/admin/src/app/
  (auth)/
    login/
    register/
  (dashboard)/
    products/
    orders/
    users/
```

Middleware handles both patterns:
```typescript
// Both /login and /(auth)/login are matched
if (pathname === "/login" || pathname.startsWith("/login")) {
  // handle auth
}
```

## With API Routes
```typescript
// Bypass middleware for API calls — they have their own auth
export const config = {
  matcher: [
    "/((?!api/|_next|static|favicon.ico).*)",
  ],
};
```

## Cookie-Based Auth Check
```typescript
// Check cookie directly (no fetch to /me needed)
export function middleware(request: NextRequest) {
  const token = request.cookies.get("atlas_auth")?.value;

  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}
```

## Atlas Shop Implementation
- ✅ `apps/web/src/middleware.ts` — protects /panel, /checkout, /orders; redirects /auth/*
- ✅ `apps/admin/src/middleware.ts` — protects everything except /login
- Both check `atlas_auth` cookie (httpOnly)
- `config.matcher` excludes `/api`, `/_next`, static assets

## Best Practices
1. **Keep middleware lean** — no heavy computations, no DB calls
2. **Use `matcher` config** — don't run middleware on every request
3. **Don't fetch `/me`** in middleware — just check cookie presence
4. **Redirect with return URL** — `loginUrl.searchParams.set("redirect", currentPath)`
5. **Handle both cookie + Bearer** — during migration period, support both
