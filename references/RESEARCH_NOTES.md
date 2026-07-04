# Research & Reference Notes

## 1. PostCSS XSS (GHSA-qx2v-qp2m-jg93) inside Next.js

| Item | Detail |
|------|--------|
| Advisory | GHSA-qx2v-qp2m-jg93 — XSS via unescaped `</style>` in PostCSS stringify |
| Fix | `postcss >= 8.5.10` |
| Our bundle | `next@16.2.9` bundles `postcss@8.4.31` internally |
| Risk | **None for production** — postcss only runs at build time. Only exploitable if building from untrusted source code |
| Fix status | Patched in Next.js canary (`16.3.0-canary.6+`). **No stable Next.js release yet** includes the fix |
| Workaround | `"overrides": { "postcss": "^8.5.10" }` in package.json (only works if postcss is a top-level or workspace dep, NOT for bundled copy inside next) |
| ⚠️ | **NEVER run `npm audit fix --force`** — it downgrades Next.js to 9.3.3 |
| Expected | Next.js 16.3.0 stable or a 16.2.x patch |
| Source | https://github.com/vercel/next.js/pull/93288 — PR that bumps postcss in next (merged to canary Apr 2026) |

## 2. Multer DoS inside @nestjs/platform-express

| Item | Detail |
|------|--------|
| CVEs | CVE-2026-5079 (GHSA-72gw-mp4g-v24j) — DoS via deeply nested field names |
| Fix | `multer >= 2.2.0` (+ configure `limits.fieldNestingDepth`) |
| Our bundle | `@nestjs/platform-express@11.1.27` pins `multer@2.1.1` exactly |
| Fix status | NestJS has NOT updated to multer@2.2.0 yet. No open PR/issue for this specific version |
| Previous updates | NestJS moved: 2.0.2 → 2.1.0 (Mar 1) → 2.1.1 (Mar 4) via Renovate PRs #16474 and #16507 |
| Workaround | None — NestJS pins exact version. Cannot override via npm overrides |
| Expected | A future @nestjs/platform-express release (11.2.x or 11.1.28+) when NestJS team merges Renovate PR |
| Source | https://github.com/nestjs/nest/pull/16507 (2.1.1), https://github.com/expressjs/multer/security/advisories/GHSA-72gw-mp4g-v24j (CVE-2026-5079) |

## 3. Server Components Migration

### Core Principles
- **App Router: Server Components are DEFAULT** — `'use client'` is opt-in, not opt-out
- **Push boundary DOWN**: add `'use client'` on the smallest leaf component that needs it, NOT on the page/layout
- **Composition pattern**: Server Components → render → pass as `children` to Client Components (server content never ships to browser JS)
- **Client Components CANNOT import Server Components** (only receive via `children` or props)

### When to add `'use client'`
- Uses `useState`, `useReducer`, `useEffect`, `useRef`
- Needs event handlers (`onClick`, `onChange`)
- Depends on browser APIs (`window`, `localStorage`, `document`)
- Wraps a third-party interactive library
- Needs immediate in-browser feedback before round trip

### Migration Strategy
1. Start every component as Server Component (no directive)
2. Add `'use client'` ONLY when the decision tree demands it
3. Use `children` prop to inject server-rendered content into client wrappers
4. Audit bundles: `npm run build` → check per-route JS payload
5. Typical result: 380KB → 95KB JS for homepages

### Common Pitfalls
- ❌ `'use client'` on page/layout → whole subtree becomes client-side
- ❌ Client Component importing Server Component → build error
- ❌ Third-party libs using hooks/window at module level → wrap in `'use client'` boundary file
- ❌ Context API (createContext) → only works in Client Components, Provider must be `'use client'`
- ❌ localStorage/document access → needs Client Component or `typeof window` guard

### Tools
- `@next/bundle-analyzer` — detect large libs pulled into client bundle
- `npm run build` output — per-route JS payload sizes

### Sources
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://samcheek.com/blog/nextjs-app-router-migration-from-pages-router-2026
- https://stacknotice.com/blog/nextjs-server-vs-client-components-guide

## 4. Kavenegar SMS — Production Integration

### Available SDKs

| Package | Type | NestJS Support | Notes |
|---------|------|----------------|-------|
| `@fraybabak/kavenegar_nest` | NestJS module | ✅ (v8 only) | Outdated, NestJS v8 |
| `@mirad-work/sms-core` | Framework-agnostic | ✅ any NestJS | **Recommended** — driver pattern, multi-provider, env config |
| `kavenegar` (official) | Raw API client | Manual | Official SDK, minimal abstraction |
| `mfrtn/kavenegar-node-api` | Zero-dependency TS | Manual | Lightweight alternative |

### Recommended: `@mirad-work/sms-core`

**Features:**
- Multiple providers: Kavenegar, SMS.ir, Melipayamak, IPPanel
- Mock driver for development/testing
- TypeScript first
- Environment variable configuration
- OTP/verification support

**Setup:**
```env
SMS_DEFAULT_DRIVER=kavenegar
SMS_KAVENEGAR_API_KEY=your-api-key
SMS_KAVENEGAR_LINE_NUMBER=your-line-number
SMS_KAVENEGAR_URL=https://api.kavenegar.com/v1/
SMS_TIMEOUT=10000
```

**NestJS integration:**
```typescript
import { SmsService, SmsConfigManager } from "@mirad-work/sms-core";

@Injectable()
export class NotificationService {
  private smsService: SmsService;

  constructor() {
    this.smsService = new SmsService(SmsConfigManager.fromEnvironment());
  }

  async sendVerificationCode(phone: string, code: string) {
    return await this.smsService.verify({
      to: phone,
      template: "registerverify",
      tokens: { code },
    });
  }
}
```

### Current Project State
- `apps/api/src/modules/sms/sms.service.ts` already has Kavenegar stub
- env vars `SMS_PROVIDER`, `SMS_API_KEY`, `SMS_SENDER` already defined in ConfigModule
- Falls back to `console.log` when API key is missing

### Sources
- https://github.com/kavenegar/kavenegar-node — official SDK
- https://github.com/mirad-work/sms-core — framework-agnostic (recommended)
- https://github.com/fraybabak/kavenegar_nest — NestJS module (outdated)
- https://kavenegar.com/rest.html — REST API docs

## 5. PWA / Blog / SEO

### PWA with Serwist

**Recommended library:** `@serwist/next` (webpack) or `@serwist/turbopack` (Turbopack)

**Setup steps:**
1. Install: `npm install @serwist/next serwist`
2. Wrap next.config with `withSerwistInit()`
3. Create `app/sw.ts` — service worker with precaching + offline fallback
4. Create `app/manifest.json` or `app/manifest.ts` — web app manifest
5. Add `SerwistProvider` in root layout
6. Create offline fallback page (`app/~offline/page.tsx`)

**Key config:**
```typescript
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});
```

**Manifest keys:** name, short_name, icons (192x192 + 512x512 maskable), theme_color, background_color, start_url, display: "standalone"

**Sources:**
- https://serwist.pages.dev/docs/next/getting-started
- https://nextjs.org/docs/app/guides/progressive-web-apps
- https://blog.logrocket.com/nextjs-16-pwa-offline-support/

---

### Blog Module

**Architecture:**
- MDX content files in `apps/web/src/content/` or `apps/web/src/blog/`
- Dynamic route: `app/blog/[slug]/page.tsx` with `generateStaticParams()`
- Frontmatter: title, date, tags, description, readingTime
- SSG with `generateStaticParams` for zero TTFB

**Structure:**
```
apps/web/src/
  content/
    blog/
      getting-started.md
      architecture-overview.md
  app/
    blog/
      page.tsx          # listing page
      [slug]/
        page.tsx         # single post page
```

**Dependencies:** `next-mdx-remote` or `@next/mdx` for MDX rendering, `gray-matter` for frontmatter parsing

---

### SEO Checklist

| Layer | Component | Implementation |
|-------|-----------|----------------|
| 1. Metadata | Title, description, canonical | `export const metadata = { ... }` or `generateMetadata()` per route |
| 2. Social | OG images, Twitter cards | `metadata.openGraph`, `metadata.twitter` |
| 3. Structured Data | JSON-LD | `<script type="application/ld+json">` in Server Component |
| 4. Crawl | Sitemap, robots.txt | `app/sitemap.ts`, `app/robots.ts` |
| 5. Performance | Images, fonts, Core Web Vitals | `next/image`, `next/font`, SSG via `generateStaticParams` |

**JSON-LD schemas needed:**
- `Organization` + `WebSite` — homepage
- `Article` — each blog post (`datePublished`, `dateModified`, `author`, `headline`)
- `BreadcrumbList` — all inner pages
- `FAQPage` — only where visible Q&A exists

**Critical rules:**
- Indexable content (headings, body copy, JSON-LD) MUST be in Server Components
- NEVER in `useEffect`/`useState` — crawlers don't wait for hydration
- `'use client'` is for interactivity only (forms, motion, maps)
- Static generation (SSG) for all public blog posts — near-zero TTFB
- Submit sitemap to Google Search Console

**Sources:**
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://varnox.io/blog/nextjs-seo-app-router-checklist
- https://pagepro.co/blog/nextjs-seo/
- https://www.matthewswong.com/en/blog/seo-first-nextjs-checklist/
