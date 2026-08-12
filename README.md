<div align="center">

# 🛍️ Shop Platform

**A modern full-stack e-commerce platform | NestJS + Next.js + Turborepo**

![CI](https://img.shields.io/badge/CI-Passing-success?style=for-the-badge)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css)
![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4446?style=for-the-badge&logo=turborepo)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=pwa)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

A full-stack e-commerce platform with product management, order processing, Iranian payment gateways, vendor panel, admin dashboard, PWA support, blog, and SEO — all in a professional monorepo structure. Fully customizable via environment variables.

---

## ✨ Features

### 🏪 Storefront (Customer)
- **Homepage** — Banner slider, featured products, category showcase, page builder
- **Product Listing** — Search, category/price filters, sorting, pagination
- **Product Detail** — Image gallery, reviews, ratings, JSON-LD structured data
- **Shopping Cart** — localStorage-based, quantity management, saved items
- **Checkout** — Shipping method selection, coupon codes, payment gateway choice
- **User Profile** — Personal info, order history, wallet, wishlist, addresses
- **Authentication** — Register/Login with JWT, OTP via SMS/console
- **Compare Products** — Side-by-side product comparison
- **PWA** — Installable, offline fallback page, service worker with runtime caching

### 📝 Blog & SEO
- **Blog** — Posts with categories, tags, comments, pagination
- **SEO Metadata** — Per-page OG, Twitter cards, canonical URLs
- **JSON-LD** — Organization, WebSite (SearchAction), Article, BreadcrumbList, Product schemas
- **Sitemap** — Auto-generated XML with products, categories, pages, blog posts
- **robots.txt** — Configurable via env var

### 👑 Admin Panel
- **Dashboard** — Real-time sales, orders, users, products stats
- **Product Management** — Full CRUD with image upload, pricing, categorization
- **Category Management** — Hierarchical parent/child categories
- **Order Management** — View, status updates (confirm/ship/deliver/cancel), advanced filters
- **Discount Management** — Percentage & fixed coupons with expiration
- **User Management** — User list, details, order history per user
- **Vendor Management** — Active vendor shops management
- **Reports** — Sales & performance analytics
- **Settings** — Store configuration, SEO, contact info
- **Rich Text Editor** — Tiptap-based content editing

### 🧑‍💼 Vendor Panel
- **Vendor Dashboard** — Personal store stats (products, orders, revenue)
- **My Products** — Manage your own products
- **My Orders** — View orders for your products

### 💳 Payment Gateways
- **Zarinpal** — Live integration with API v4
- **Mellat Bank** — Simulated (ready for real integration)
- **Saman Bank** — Simulated (ready for real integration)

### 📦 Shipping Methods
- Express / Standard Post
- TIPAX, MAHEX, Snapp Box

### 🌐 Persian Language Support
- **RTL** — Full right-to-left support
- **Jalali Date** — Using `date-fns-jalali`
- **Persian Numerals** — Native numeral display
- **Full Persian UI** — All interfaces in Persian

### 🔒 Security
- **Helmet** — Security headers (CSP, HSTS, XSS, etc.)
- **Rate Limiting** — 4 layers (Nginx → NestJS → Edge middleware → Client backoff)
- **CORS** — Configured with credentials support
- **Trust Proxy** — Correct IP detection behind Nginx
- **Input Validation** — class-validator + sanitize-html + DOMPurify

### 🐳 Docker
- **Dockerfile** per service (API, Store, Admin)
- **docker-compose.yml** with Nginx reverse proxy
- Production-ready deployment

### 🔄 CI/CD
- **GitHub Actions** — Lint, build, test, E2E, CodeQL, publish
- **Dependabot** — Automated dependency updates

---

## 🏗️ Architecture

```
shop-platform/
├── apps/
│   ├── api/          # NestJS API — port 8000
│   ├── web/          # Storefront (Next.js) — port 3000
│   └── admin/        # Admin Panel (Next.js) — port 3001
├── packages/
│   ├── shared-types/ # Shared TypeScript types
│   ├── api-client/   # Auto-generated API client
│   └── eslint-config/# Shared ESLint configuration
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── .github/
│   └── workflows/    # CI/CD pipelines
└── turbo.json        # Turborepo configuration
```

### Architecture Diagram

```
🌐 User
   │
   ▼
┌──────────────────────────────────────────────────┐
│                  Nginx (port 80)                   │
│   / → web:3000  /admin/* → admin:3001  /api → api │
│   PWA headers  |  Rate limiting  |  SSL           │
└──────────────────────────────────────────────────┘
   │           │            │
   ▼           ▼            ▼
┌──────┐  ┌────────┐  ┌──────────────┐
│ Web  │  │ Admin  │  │ API           │
│:3000 │  │:3001   │  │:8000          │
│ PWA  │  │        │  │ Helmet        │
│ SW   │  │        │  │ Rate Limit    │
└──────┘  └────────┘  └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │   Prisma     │
                      │ (PostgreSQL) │
                      └──────────────┘
```

---

## 🛠️ Tech Stack

| Layer                | Technology                                      |
| -------------------- | ----------------------------------------------- |
| **Backend**          | NestJS 11, Prisma 5, Passport JWT, Swagger, Multer |
| **Frontend (Store)** | Next.js 16, React 19, Tailwind CSS 4, Serwist   |
| **Frontend (Admin)** | Next.js 16, React 19, Tailwind CSS 4, Tiptap    |
| **Database**         | PostgreSQL 16                                   |
| **Monorepo**         | Turborepo 2, npm workspaces                     |
| **Language**         | TypeScript 5 (entire codebase)                  |
| **State (Client)**   | TanStack Query + Zustand                        |
| **Authentication**   | JWT (bcryptjs), httpOnly cookies                |
| **API Docs**         | Swagger (OpenAPI)                               |
| **CI/CD**            | GitHub Actions + Dependabot                     |
| **Container**        | Docker + docker-compose                         |
| **Jalali Date**      | date-fns-jalali                                 |
| **Payment Gateway**  | Zarinpal API v4                                 |
| **SMS**              | Kavenegar (production) / Console (development)  |
| **Email**            | Nodemailer                                      |

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 22
- npm ≥ 10
- PostgreSQL ≥ 16 (create an empty database)

### Installation

```bash
# 1. Clone the repository
git clone <https://github.com/Hordekiller/Atlas-Shop>
cd shop-platform

# 2. Set up environment variables
cp .env.example .env
# Edit .env and fill in the values (database URL, JWT secret, etc.)

# 3. Install dependencies
npm install

# 4. Generate Prisma client & run migrations
npx prisma generate -w @atlas-shop/api
npx prisma migrate dev -w @atlas-shop/api

# 5. Seed the database with initial data
npm run db:seed -w @atlas-shop/api

# 6. Run all services
npm run dev
```

### Default Credentials

| Role             | Email                 | Password   |
| ---------------- | --------------------- | ---------- |
| **Super Admin**  | `admin@example.com`   | `admin123` |
| **Customer**     | Register via website  | —          |

> The first user to register automatically gets the **SUPER_ADMIN** role.

### Service URLs

| Service      | URL                           |
| ------------ | ----------------------------- |
| Storefront   | http://localhost:3000         |
| Admin Panel  | http://localhost:3001         |
| API          | http://localhost:8000/api/v1  |
| API Docs     | http://localhost:8000/api/docs|

---

## 🐳 Docker Deployment

```bash
# Full deployment
docker compose up -d

# Services:
#   - Nginx: port 80
#   - API: port 8000
#   - Storefront: port 3000
#   - Admin Panel: port 3001
```

---

## 🔧 Environment Variables

| Variable                       | Required | Default                    | Description                                  |
| ------------------------------ | -------- | -------------------------- | -------------------------------------------- |
| `DATABASE_URL`                 | ✅       | —                          | PostgreSQL connection string                 |
| `JWT_SECRET`                   | ✅       | —                          | Secret for signing JWT tokens                |
| `ENCRYPTION_KEY`               | ✅       | —                          | 32-char key for encrypting sensitive data    |
| `NEXT_PUBLIC_SITE_URL`         | —        | `http://localhost:3000`    | Public site URL for SEO, sitemap, PWA        |
| `NEXT_PUBLIC_SITE_NAME`        | —        | `فروشگاه من`               | Brand name (titles, metadata, JSON-LD)       |
| `NEXT_PUBLIC_SITE_SHORT_NAME`  | —        | `فروشگاه`                  | Short brand name (PWA manifest, footer)      |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | —        | Generic description        | Site description (OG, metadata)              |
| `NEXT_PUBLIC_API_URL`          | —        | `http://localhost:8000/...`| Client-side API URL                          |
| `SITE_NAME`                    | —        | `فروشگاه من`               | Brand name for API (email, SMS, invoices)    |
| `SUPPORT_EMAIL`                | —        | `info@example.com`         | Support email for notifications              |
| `MAIL_*`                       | —        | —                          | SMTP configuration                           |
| `ZARINPAL_MERCHANT_ID`         | —        | —                          | Zarinpal merchant ID                         |
| `SMS_PROVIDER`                 | —        | `console`                  | `console` or `kavenegar`                     |
| `SMS_API_KEY`                  | —        | —                          | Kavenegar API key                            |

Full list in [.env.example](./.env.example).

---

## 📸 Screenshots

### 🏪 Storefront
![Store](./Screenshots/Atlas%20ScreenShots1.png)
![Store](./Screenshots/Atlas%20ScreenShots3.png)
![Store](./Screenshots/Atlas%20ScreenShots5.png)
![Store](./Screenshots/Atlas%20ScreenShots7.png)
![Store](./Screenshots/Atlas%20ScreenShots9.png)
![Store](./Screenshots/Atlas%20ScreenShots8.png)
![Store](./Screenshots/Atlas%20ScreenShots6.png)
![Store](./Screenshots/Atlas%20ScreenShots14.png)
![Store](./Screenshots/Atlas%20ScreenShots15.png)
![Store](./Screenshots/Atlas%20ScreenShots17.png)
![Store](./Screenshots/Atlas%20ScreenShots30.png)
![Store](./Screenshots/Atlas%20ScreenShots31.png)

### 👑 Admin Panel
![Admin](./Screenshots/Atlas%20ScreenShots2.png)
![Admin](./Screenshots/Atlas%20ScreenShots4.png)
![Admin](./Screenshots/Atlas%20ScreenShots10.png)
![Admin](./Screenshots/Atlas%20ScreenShots11.png)
![Admin](./Screenshots/Atlas%20ScreenShots12.png)
![Admin](./Screenshots/Atlas%20ScreenShots13.png)
![Admin](./Screenshots/Atlas%20ScreenShots16.png)
![Admin](./Screenshots/Atlas%20ScreenShots18.png)
![Admin](./Screenshots/Atlas%20ScreenShots19.png)
![Admin](./Screenshots/Atlas%20ScreenShots20.png)
![Admin](./Screenshots/Atlas%20ScreenShots21.png)
![Admin](./Screenshots/Atlas%20ScreenShots22.png)
![Admin](./Screenshots/Atlas%20ScreenShots23.png)
![Admin](./Screenshots/Atlas%20ScreenShots24.png)
![Admin](./Screenshots/Atlas%20ScreenShots25.png)
![Admin](./Screenshots/Atlas%20ScreenShots26.png)
![Admin](./Screenshots/Atlas%20ScreenShots27.png)
![Admin](./Screenshots/Atlas%20ScreenShots28.png)
![Admin](./Screenshots/Atlas%20ScreenShots29.png)

---

## 🧪 CI/CD

The project has **4 GitHub Actions workflows**:

### 1. CI (`ci.yml`)
Runs on every push/PR to `main`:
- 🔍 **Lint & TypeCheck** — ESLint for API, `tsc --noEmit` for all apps
- 🏗️ **Build All Apps** — Prisma generate + Turborepo build
- 🧪 **Unit Tests** — Jest (AuthService tests)
- 🧪 **E2E Tests** — API smoke test with PostgreSQL service

### 2. CodeQL (`codeql.yml`)
Weekly security analysis + on push/PR to `main`.

### 3. Publish (`publish.yml`)
Publishes packages to GitHub Packages on release.

### 4. Dependabot
Automated dependency updates.

---

## 🧪 Running Tests

```bash
# Unit tests (API)
npm test -w @atlas-shop/api

# E2E tests (requires PostgreSQL)
npm run test:e2e -w @atlas-shop/api

# Coverage
npm run test:cov -w @atlas-shop/api
```

---

## 📁 Key Scripts

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Run all apps in development mode         |
| `npm run build`  | Build all apps for production            |
| `npm run lint`   | Lint and type-check all apps             |
| `npm run dev:api`| Run API only                             |
| `npm run dev:web`| Run storefront only                      |
| `npm run dev:admin`| Run admin panel only                   |
| `npm run db:migrate`| Run Prisma migrations                 |
| `npm run db:seed`| Seed database with sample data           |

---

## 🗺️ Roadmap

### ✅ Done
- [x] JWT authentication with register/login
- [x] Product management (CRUD + image upload)
- [x] Hierarchical categories
- [x] Shopping cart & checkout
- [x] Full admin panel (dashboard, orders, users, discounts)
- [x] Vendor panel
- [x] Zarinpal payment gateway
- [x] Shipping methods (post, TIPAX, MAHEX, SnappBox)
- [x] Jalali date & full RTL support
- [x] Docker + docker-compose
- [x] CI/CD with GitHub Actions + Dependabot + CodeQL
- [x] SQLite → PostgreSQL migration
- [x] Email delivery with Nodemailer
- [x] Security hardening (Helmet, rate limiting, trust proxy, CORS)
- [x] Code quality (ConfigModule, exception filter, logging)
- [x] Rate limiting (4 layers: Nginx → NestJS → Edge → Client)
- [x] PWA (installable with service worker + offline fallback)
- [x] Blog with hybrid Server/Client pattern
- [x] SEO (JSON-LD, OG, Twitter cards, sitemap, robots.txt)
- [x] SMS (Kavenegar + console fallback)
- [x] Invoice PDF generation

### 🔜 Planned
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced discount system (smart coupons)
- [ ] Inventory & warehouse management
- [ ] Returns & refunds system
- [ ] Multi-vendor marketplace
- [ ] Affiliate system
- [ ] Wishlist sharing
- [ ] PWA push notifications
- [ ] i18n / multi-language support

---

## 🤝 Contributing

1. Fork it 🍴
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open a Pull Request 🎉

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

---

## 📜 License

This project is licensed under the **MIT** License. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️

</div>
