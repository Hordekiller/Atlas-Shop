# Security & httpOnly Cookie — Reference

## Why httpOnly Cookies?
- **XSS protection**: JavaScript can't read httpOnly cookies via `document.cookie`
- **CSRF protection**: use `SameSite: Strict` or `SameSite: Lax`
- **No token in localStorage**: immune to XSS-based token theft

## API-Side (NestJS)
```typescript
// Setting the cookie on login
@Post("login")
async login(@Res({ passthrough: true }) response: Response) {
  const { token, user } = await this.authService.login(credentials);

  response.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  return { user }; // Do NOT return token in body
}

// Middleware to convert cookie → Bearer header (for Passport JWT strategy)
// In main.ts or a middleware:
app.use((req: any, res, next) => {
  if (req.cookies?.auth_token && !req.headers.authorization) {
    req.headers.authorization = `Bearer ${req.cookies.auth_token}`;
  }
  next();
});
```

## Frontend (Next.js)
```typescript
// api.ts — just send credentials, no manual token management
const api = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      credentials: "include", // Sends httpOnly cookie automatically
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  },

  async post<T>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    // Don't store token from response — it's in the cookie
    return res.json();
  },
};
```

## Next.js Middleware
```typescript
// apps/web/src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedPaths = ["/panel", "/checkout", "/orders"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Auth pages (redirect if already logged in)
  if (["/auth/login", "/auth/register"].includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
```

## Phase Plan for Atlas Shop
| Phase | Status | What |
|-------|--------|------|
| 1 | ✅ | API sets `atlas_auth` httpOnly cookie + middleware converts to Bearer |
| 2 | ✅ | `credentials: 'include'` added to all fetch calls |
| 3 | ✅ | localStorage `Authorization: Bearer` removed from api.ts |
| 4 | ⏳ | Auth context with `/me` endpoint, remove localStorage from login pages |
| 5 | ❌ | Stop returning `token` in login/register response body |

## CSRF / Nonce for Payment
```typescript
// On payment request:
const nonce = crypto.randomUUID();
await prisma.payment.update({ where: { id }, data: { nonce } });
callbackUrl += `?nonce=${nonce}`;

// On verify:
const payment = await prisma.payment.findFirst({
  where: { authority, nonce, verifiedAt: null },
});
if (!payment) throw new ForbiddenException("Invalid or replayed payment callback");
await prisma.payment.update({ where: { id: payment.id }, data: { verifiedAt: new Date() } });
```
