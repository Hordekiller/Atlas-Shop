<div align="center">

# 🛍️ Atlas Shop

**A modern full-stack e-commerce platform | NestJS + Next.js + Turborepo**

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Hordekiller/shop-sor/ci.yml?style=for-the-badge&label=CI)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css)
![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4446?style=for-the-badge&logo=turborepo)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

**Atlas Shop** is a full-stack e-commerce platform built with modern web technologies. It supports product management, order processing, Iranian payment gateways, a vendor panel, and a full admin dashboard — all in a professional monorepo structure.

---

## ✨ Features

### 🏪 Storefront (Customer)

- **Homepage** — Banner slider, featured products, category showcase
- **Product Listing** — Search, category/price filters, sorting, pagination
- **Product Detail** — Image gallery, reviews, add to cart
- **Shopping Cart** — localStorage-based, quantity management, saved items
- **Checkout** — Shipping method selection, coupon codes, payment gateway choice
- **User Profile** — Personal info, order history
- **Authentication** — Register/Login with JWT

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
- TIPAX
- MAHEX
- Snapp Box

### 🌐 Persian Language Support

- **RTL** — Full right-to-left support
- **Jalali Date** — Using `date-fns-jalali`
- **Persian Numerals** — Native numeral display
- **Full Persian UI** — All interfaces in Persian

### 🐳 Docker

- **Dockerfile** per service (API, Store, Admin)
- **docker-compose.yml** with Nginx reverse proxy
- Production-ready deployment

### 🔄 CI/CD

- **GitHub Actions** — lint + build + smoke test automated

---

## 🏗️ Architecture

```
atlas-shop/
├── apps/
│   ├── api/          # NestJS API — port 8000
│   ├── web/          # Storefront (Next.js) — port 3000
│   └── admin/        # Admin Panel (Next.js) — port 3001
├── packages/
│   ├── shared-types/ # Shared TypeScript types
│   ├── api-client/   # Auto-generated API client
│   └── eslint-config/ # Shared ESLint configuration
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
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

| Layer                | Technology                                      |
| -------------------- | ----------------------------------------------- |
| **Backend**          | NestJS 11, Prisma 5, Passport JWT, Swagger, Multer |
| **Frontend (Store)** | Next.js 16, React 19, Tailwind CSS 4            |
| **Frontend (Admin)** | Next.js 16, React 19, Tailwind CSS 4            |
| **Database**         | PostgreSQL 16                                   |
| **Monorepo**         | Turborepo 2, npm workspaces                     |
| **Language**         | TypeScript 5 (entire codebase)                  |
| **Authentication**   | JWT (bcryptjs)                                  |
| **API Docs**         | Swagger (OpenAPI)                               |
| **CI/CD**            | GitHub Actions                                  |
| **Container**        | Docker + docker-compose                         |
| **Jalali Date**      | date-fns-jalali                                 |
| **Payment Gateway**  | Zarinpal API v4                                 |

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 22
- npm ≥ 10
- PostgreSQL ≥ 16 (create an empty database named `atlas_shop`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Hordekiller/shop-sor.git
cd shop-sor

# 2. Set up environment variables
cp .env.example apps/api/.env
# Edit apps/api/.env and fill in the values (database URL, JWT secret, etc.)

# 3. Install dependencies
npm install

# 4. Set up the database
npm run db:migrate -w @atlas-shop/api
npm run db:generate -w @atlas-shop/api

# 5. Seed the database with initial data
npm run db:seed -w @atlas-shop/api

# 6. Run all services
npm run dev
```

### Default Credentials

| Role             | Email                 | Password   |
| ---------------- | --------------------- | ---------- |
| **Super Admin**  | `admin@atlas-shop.com`| `admin123` |
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

### Docker Environment Variables

| Variable                  | Description            | Default                                        |
| ------------------------- | ---------------------- | ---------------------------------------------- |
| `JWT_SECRET`              | JWT signing secret     | `change-this-secret-in-production`             |
| `ZARINPAL_MERCHANT_ID`    | Zarinpal merchant ID   | —                                              |
| `ZARINPAL_CALLBACK_URL`   | Payment callback URL   | `http://localhost:8000/api/v1/payments/verify` |
| `MAIL_HOST`               | SMTP host              | —                                              |
| `MAIL_PORT`               | SMTP port              | `587`                                          |
| `MAIL_USER`               | SMTP username          | —                                              |
| `MAIL_PASS`               | SMTP password          | —                                              |
| `MAIL_FROM`               | Sender email           | `noreply@atlas-shop.com`                       |
| `ENCRYPTION_KEY`          | Encryption secret key  | —                                              |

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

## 📁 API Routes

```
/api/v1
├── POST   /auth/register       Register new user
├── POST   /auth/login          Login
├── GET    /auth/me             Current user info
├── PUT    /auth/profile        Update profile
├── GET    /products            List products
├── GET    /products/:id        Product details
├── POST   /products            Create product (admin/vendor)
├── PUT    /products/:id        Update product (admin/vendor)
├── DELETE /products/:id        Delete product (admin)
├── GET    /categories          List categories
├── POST   /orders              Create order
├── GET    /orders              My orders
├── GET    /orders/:id          Order details
├── PUT    /orders/:id/status   Update status (admin)
├── POST   /payments/request    Request payment
├── GET    /payments/verify     Verify payment
├── GET    /admin/stats         Dashboard stats (admin)
├── GET    /users               User list (admin)
├── GET    /users/:id           User details (admin)
├── GET    /shops/my            My shop (vendor)
├── POST   /shops               Create shop (vendor)
├── POST   /upload              Upload image
├── ... and many more endpoints
```

Full Swagger documentation is available at `/api/docs`.

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
- [x] CI/CD with GitHub Actions
- [x] SQLite to PostgreSQL migration
- [x] Email delivery with nodemailer
- [x] Security hardening (Nginx headers, rate limiting, nonce)
- [x] Code quality (ConfigModule, exception filter, logging)

### 🔜 In Progress

- [ ] Real-time notifications (email, push)
- [ ] Advanced discount system (smart coupons)
- [ ] Inventory & warehouse management
- [ ] Returns & refunds system
- [ ] User wallet
- [ ] Affiliate system
- [ ] PWA application
- [ ] Multi-vendor marketplace
- [ ] Blog & advanced SEO

---

## 🧪 CI/CD

The project has **GitHub Actions CI** that runs on every Push and Pull Request:

1. ✅ Installs dependencies
2. 🔍 Runs ESLint
3. 🏗️ Builds all three apps (API, Web, Admin)
4. 🧪 Runs smoke tests:
   - User registration & login
   - Product & category creation
   - Order placement
   - Coupon application
   - Payment request
   - Admin stats retrieval

---

## 🤝 Contributing

1. Fork it 🍴
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open a Pull Request 🎉

---

## 📜 License

This project is licensed under the **MIT** License. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ in Iran

</div>
