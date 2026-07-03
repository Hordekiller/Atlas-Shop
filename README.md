<div align="center">

# 🛍️ Atlas Shop

**A Modern, Full-Featured E-Commerce Platform | NestJS + Next.js + Turborepo**

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Hordekiller/shop-sor/ci.yml?style=for-the-badge&label=CI)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css)
![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4446?style=for-the-badge&logo=turborepo)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

🚀 **Atlas Shop** is a full-stack, Persian-first e-commerce platform — comparable to a localized WooCommerce — built with a modern web stack. From product and order management to Iranian payment gateways and a full vendor panel, everything lives in one professionally structured monorepo.

</div>

---

## ✨ Features

### 🏪 Storefront (Customer-Facing)

- **Homepage** — banner display, featured products, category showcase
- **Product listing** — search, filter by category and price, sorting, pagination
- **Product details** — image gallery, pricing, user reviews, add to cart
- **Shopping cart** — localStorage-based cart management, quantity updates, item removal
- **Checkout** — shipping method selection, discount code application, payment gateway selection
- **User profile** — edit personal info, view order history
- **Authentication** — login / register via JWT

### 👑 Admin Panel

- **Dashboard** — live stats for sales, orders, users, and products
- **Product management** — full CRUD with image upload, pricing, categorization
- **Category management** — hierarchical categories (parent/child)
- **Order management** — view orders, update status (confirmed/shipped/delivered/cancelled), advanced filtering
- **Discount management** — percentage and fixed-amount coupons with expiration dates
- **User management** — user listing, details, per-user order history
- **Vendors** — manage active vendor shops
- **Reports** — sales and performance analytics
- **Settings** — store-wide configuration

### 🧑‍💼 Vendor Panel

- **Vendor dashboard** — stats for the vendor's own shop (products, orders, revenue)
- **My products** — manage the vendor's own product listings
- **My orders** — view orders related to the vendor's products

### 💳 Payment Gateways

- **Zarinpal** — fully integrated via API v4
- **Bank Mellat** — simulated (ready for live integration)
- **Bank Saman** — simulated (ready for live integration)

### 📦 Shipping Methods

- Iran Post (Express / Custom)
- Tipax
- Mahex
- SnappBox

### 🌐 Full Localization

- **RTL** — complete right-to-left layout support
- **Jalali calendar** — powered by `date-fns-jalali`
- **Persian numerals** — numbers displayed in Persian format
- **Fully localized UI** — entire interface in Persian

### 🐳 Docker

- Dedicated **Dockerfile** for API, storefront, and admin panel
- **docker-compose.yml** with Nginx reverse proxy
- Production-deployment ready

### 🔄 CI/CD

- **GitHub Actions** — automated lint + build + smoke tests

---

## 🏗️ Architecture

```
atlas-shop/
├── apps/
│   ├── api/          # NestJS API — port 8000
│   ├── web/           # Storefront (Next.js) — port 3000
│   └── admin/         # Admin panel (Next.js) — port 3001
├── packages/
│   ├── shared-types/  # Shared TypeScript types
│   ├── api-client/    # Auto-generated API client
│   └── eslint-config/ # Shared ESLint configuration
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
└── turbo.json         # Turborepo configuration
```

### Architecture Diagram

```
🌐 User
   │
   ▼
┌──────────────────────────────────────────────────┐
│                  Nginx (port 80)                   │
│   / → web:3000  /admin/* → admin:3001  /api → api │
└──────────────────────────────────────────────────┘
   │           │            │
   ▼           ▼            ▼
┌──────┐  ┌────────┐  ┌──────────┐
│ Web  │  │ Admin  │  │ API      │
│:3000 │  │:3001   │  │:8000     │
└──────┘  └────────┘  └────┬─────┘
                           │
                           ▼
                     ┌──────────────┐
                     │   Prisma     │
                     │ (PostgreSQL) │
                     └──────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Backend** | NestJS 11, Prisma 5, Passport JWT, Swagger, Multer |
| **Frontend (storefront)** | Next.js 16, React 19, Tailwind CSS 4 |
| **Frontend (admin)** | Next.js 16, React 19, Tailwind CSS 4 |
| **Database** | PostgreSQL 16 |
| **Monorepo** | Turborepo 2, npm workspaces |
| **Language** | TypeScript 5 (across the entire stack) |
| **Authentication** | JWT (bcryptjs) |
| **API documentation** | Swagger (OpenAPI) |
| **CI/CD** | GitHub Actions |
| **Containers** | Docker + docker-compose |
| **Calendar** | date-fns-jalali |
| **Payment gateway** | Zarinpal API v4 |

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 22
- npm ≥ 10
- PostgreSQL ≥ 16 (with an empty database named `atlas_shop`)

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Hordekiller/shop-sor.git
cd "shop sor"

# 2. Configure environment variables
cp .env.example apps/api/.env
# Then edit apps/api/.env with your actual configuration values

# 3. Install dependencies
npm install

# 4. Run database migrations
npm run db:migrate -w @atlas-shop/api
npm run db:generate -w @atlas-shop/api

# 5. Seed the database with initial data
npm run db:seed -w @atlas-shop/api

# 6. Run all services concurrently
npm run dev
```

### Default Credentials

| Role | Email | Password |
| --- | --- | --- |
| **System Admin** | `admin@atlas-shop.com` | `admin123` |
| **Customer** | Register via the storefront | — |

> The first user to register is automatically assigned the **SUPER_ADMIN** role.

### Local URLs

| Service | URL |
| --- | --- |
| Storefront | http://localhost:3000 |
| Admin Panel | http://localhost:3001 |
| API | http://localhost:8000/api/v1 |
| API Docs | http://localhost:8000/api/docs |

---

## 🐳 Running with Docker

```bash
# Full deployment via Docker
docker compose up -d

# Services:
#   - Nginx: port 80
#   - API: port 8000
#   - Storefront: port 3000
#   - Admin Panel: port 3001
```

### Docker Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `JWT_SECRET` | JWT signing secret | `change-this-secret-in-production` |
| `ZARINPAL_MERCHANT_ID` | Zarinpal merchant identifier | — |
| `ZARINPAL_CALLBACK_URL` | Payment callback URL | `http://localhost:8000/api/v1/payments/verify` |

---

## 📸 Screenshots

### 🏪 Storefront
![Storefront](./Screenshots/Atlas%20ScreenShots1.png)
![Storefront](./Screenshots/Atlas%20ScreenShots3.png)
![Storefront](./Screenshots/Atlas%20ScreenShots5.png)
![Storefront](./Screenshots/Atlas%20ScreenShots7.png)
![Storefront](./Screenshots/Atlas%20ScreenShots9.png)
![Storefront](./Screenshots/Atlas%20ScreenShots8.png)
![Storefront](./Screenshots/Atlas%20ScreenShots6.png)
![Storefront](./Screenshots/Atlas%20ScreenShots14.png)
![Storefront](./Screenshots/Atlas%20ScreenShots15.png)
![Storefront](./Screenshots/Atlas%20ScreenShots17.png)
![Storefront](./Screenshots/Atlas%20ScreenShots30.png)
![Storefront](./Screenshots/Atlas%20ScreenShots31.png)

### 👑 Admin Panel
![Admin Panel](./Screenshots/Atlas%20ScreenShots2.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots4.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots10.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots11.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots12.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots13.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots16.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots18.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots19.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots20.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots21.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots22.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots23.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots24.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots25.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots26.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots27.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots28.png)
![Admin Panel](./Screenshots/Atlas%20ScreenShots29.png)

---

## 📁 API Structure (Core Routes)

```
/api/v1
├── POST   /auth/register     Register
├── POST   /auth/login        Login
├── GET    /auth/me           Current user info
├── PUT    /auth/profile      Update profile
├── GET    /products          List products
├── GET    /products/:id      Product details
├── POST   /products          Create product (admin/vendor)
├── PUT    /products/:id      Update product (admin/vendor)
├── DELETE /products/:id      Delete product (admin)
├── GET    /categories        List categories
├── POST   /orders            Create order
├── GET    /orders            My orders
├── GET    /orders/:id        Order details
├── PUT    /orders/:id/status Update order status (admin)
├── POST   /payments/request  Request payment
├── GET    /payments/verify   Verify payment
├── GET    /admin/stats       Dashboard stats (admin)
├── GET    /users             List users (admin)
├── GET    /users/:id         User details (admin)
├── GET    /shops/my          My shop (vendor)
├── POST   /shops             Create shop (vendor)
├── POST   /upload            Upload image
└── ... and many more routes
```

Full Swagger documentation is available at `/api/docs`.

---

## 🗺️ Roadmap

### ✅ Completed

- [x] JWT authentication with registration and login
- [x] Product management (CRUD + image upload)
- [x] Hierarchical categories
- [x] Cart and checkout
- [x] Full admin panel (dashboard, orders, users, discounts)
- [x] Vendor panel
- [x] Zarinpal payment gateway
- [x] Shipping methods (Post, Tipax, Mahex, SnappBox)
- [x] Jalali calendar and full RTL support
- [x] Docker + docker-compose
- [x] CI/CD with GitHub Actions
- [x] Migration from SQLite to PostgreSQL

### 🔜 In Progress

- [ ] Notification system (email, push notifications)
- [ ] Advanced discount system (smart discount codes)
- [ ] Inventory and stock management
- [ ] Returns and refund handling
- [ ] User wallet
- [ ] Affiliate/referral system
- [ ] PWA support
- [ ] Full multi-vendor marketplace
- [ ] Blog and advanced SEO

---

## 🧪 CI/CD

The project includes **GitHub Actions CI**, which runs on every push and pull request:

1. ✅ Installs dependencies
2. 🔍 Runs ESLint
3. 🏗️ Builds all three apps (API, Web, Admin)
4. 🧪 Runs smoke tests:
   - User registration and login
   - Product and category creation
   - Order placement
   - Discount application
   - Payment request
   - Fetching admin stats

---

## 🤝 Contributing

1. Fork the repository 🍴
2. Create a new branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request 🎉

---

## 📜 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

<div align="center">

Built with ❤️ in Iran

</div>
