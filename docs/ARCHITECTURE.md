# EV Charging Station E-Commerce Platform — Technical Specification

> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL) · Stripe  
> **Status:** Architecture & specification only — no implementation code yet.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Domain Model](#2-domain-model)
3. [Folder Structure](#3-folder-structure)
4. [Database Schema](#4-database-schema)
5. [Database Models](#5-database-models)
6. [Environment Variables](#6-environment-variables)
7. [API Architecture](#7-api-architecture)
8. [Authentication Architecture](#8-authentication-architecture)
9. [Admin Architecture](#9-admin-architecture)
10. [Payment Architecture (Stripe)](#10-payment-architecture-stripe)
11. [Security & Compliance](#11-security--compliance)
12. [Deployment & Infrastructure](#12-deployment--infrastructure)
13. [Implementation Phases](#13-implementation-phases)

---

## 1. System Overview

### 1.1 Purpose

A B2C/B2B e-commerce platform for selling EV charging stations, accessories, and optional installation services. Customers browse a catalog, configure products, checkout via Stripe, and track orders. Admins manage catalog, inventory, orders, customers, and content.

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                              │
│  Next.js 15 App Router — RSC + Client Components + Server Actions       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │  Route       │ │  API Routes  │ │  Server      │
            │  Handlers    │ │  /api/*      │ │  Actions     │
            │  (pages)     │ │              │ │  (mutations) │
            └──────────────┘ └──────────────┘ └──────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
            ┌───────────────────────────────────────────────────┐
            │              Service Layer (lib/services)          │
            │  catalog · cart · orders · payments · inventory  │
            └───────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  PostgreSQL  │      │   NextAuth   │      │    Stripe    │
      │  (Prisma)    │      │   (sessions) │      │  (payments)  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

### 1.3 User Roles

| Role | Description | Access |
|------|-------------|--------|
| `GUEST` | Unauthenticated visitor | Browse, cart (session), checkout as guest |
| `CUSTOMER` | Registered buyer | Orders, profile, saved addresses, wishlist |
| `ADMIN` | Store operator | Full admin panel |
| `SUPER_ADMIN` | Platform owner | Admin + user management, system settings |

### 1.4 Core User Flows

1. **Browse & Search** — Category navigation, filters (power kW, connector type, phase, brand), product detail with specs.
2. **Cart & Checkout** — Guest or authenticated checkout; shipping + optional installation; Stripe Payment Intent.
3. **Order Lifecycle** — `PENDING` → `PAID` → `PROCESSING` → `SHIPPED` → `DELIVERED` → `COMPLETED` (or `CANCELLED` / `REFUNDED`).
4. **Admin Operations** — CRUD products, manage stock, fulfill orders, issue refunds, manage CMS content.

---

## 2. Domain Model

### 2.1 Bounded Contexts

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Catalog   │   │  Commerce   │   │  Identity   │   │   Content   │
│             │   │             │   │             │   │             │
│ Product     │   │ Cart        │   │ User        │   │ Page        │
│ Category    │   │ Order       │   │ Address     │   │ Banner      │
│ Brand       │   │ Payment     │   │ Session     │   │ BlogPost    │
│ Spec        │   │ Shipment    │   │ Role        │   │ FAQ         │
│ Review      │   │ Refund      │   │             │   │             │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

### 2.2 Key Entities & Relationships

- **Product** belongs to **Category** and **Brand**; has many **ProductImage**, **ProductSpec**, **ProductVariant**, **Review**.
- **ProductVariant** represents SKU-level sellable unit (e.g., "22kW Three-Phase Black").
- **Cart** is session- or user-scoped; contains **CartItem** referencing **ProductVariant**.
- **Order** snapshots line items at purchase time (**OrderItem**); links to **Payment**, **Shipment**, optional **InstallationBooking**.
- **User** has many **Address**, **Order**, **Review**; role stored on User.

### 2.3 EV-Specific Product Attributes

| Attribute | Type | Example |
|-----------|------|---------|
| `powerKw` | Decimal | 7.4, 11, 22 |
| `phases` | Enum | `SINGLE`, `THREE` |
| `connectorTypes` | Enum[] | `TYPE2`, `CCS2`, `CHADEMO` |
| `cableLength` | Int (meters) | 5, 7.5 |
| `smartFeatures` | JSON | OCPP, WiFi, RFID, load balancing |
| `ipRating` | String | IP54, IP65 |
| `mountingType` | Enum | `WALL`, `PEDESTAL`, `FLOOR` |
| `warrantyYears` | Int | 2, 3, 5 |
| `installationRequired` | Boolean | true |

---

## 3. Folder Structure

```
ev-charging-store/
├── .env.example
├── .env.local                    # gitignored
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json               # shadcn/ui config
│
├── supabase/
│   └── migrations/               # SQL migrations (applied via Supabase SQL Editor / CLI)
│
├── scripts/
│   ├── seed.ts                   # Initial data seed
│   └── seed-market.ts            # Market comparison seed
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── docs/
│   ├── ARCHITECTURE.md           # this document
│   └── API.md                    # endpoint reference (future)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # root layout (fonts, providers)
│   │   ├── page.tsx                      # homepage
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   │
│   │   ├── (shop)/                       # public storefront route group
│   │   │   ├── layout.tsx                # header, footer, cart drawer
│   │   │   ├── produse/
│   │   │   │   ├── page.tsx              # product listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # product detail
│   │   │   ├── categorii/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── cos/
│   │   │   │   └── page.tsx              # cart
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── success/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── cancel/
│   │   │   │       └── page.tsx
│   │   │   ├── cont/
│   │   │   │   ├── page.tsx              # account dashboard
│   │   │   │   ├── comenzi/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── adrese/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── setari/
│   │   │   │       └── page.tsx
│   │   │   ├── autentificare/
│   │   │   │   ├── page.tsx              # login
│   │   │   │   └── inregistrare/
│   │   │   │       └── page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/                      # admin route group
│   │   │   ├── layout.tsx                # admin shell + auth guard
│   │   │   └── admin/
│   │   │       ├── page.tsx              # dashboard KPIs
│   │   │       ├── produse/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── nou/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx
│   │   │       ├── categorii/
│   │   │       │   └── page.tsx
│   │   │       ├── comenzi/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx
│   │   │       ├── clienti/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx
│   │   │       ├── inventar/
│   │   │       │   └── page.tsx
│   │   │       ├── recenzii/
│   │   │       │   └── page.tsx
│   │   │       ├── continut/
│   │   │       │   ├── pagini/
│   │   │       │   ├── bannere/
│   │   │       │   └── blog/
│   │   │       ├── reduceri/
│   │   │       │   └── page.tsx          # coupons / promotions
│   │   │       ├── rapoarte/
│   │   │       │   └── page.tsx
│   │   │       └── setari/
│   │   │           └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── webhooks/
│   │       │   └── stripe/
│   │       │       └── route.ts
│   │       ├── products/
│   │       │   ├── route.ts              # GET list (public)
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── cart/
│   │       │   └── route.ts
│   │       ├── checkout/
│   │       │   ├── route.ts                # create payment intent
│   │       │   └── session/
│   │       │       └── route.ts            # Stripe Checkout (optional)
│   │       ├── orders/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── upload/
│   │       │   └── route.ts                # admin image upload
│   │       └── admin/
│   │           ├── products/
│   │           │   ├── route.ts
│   │           │   └── [id]/
│   │           │       └── route.ts
│   │           ├── orders/
│   │           │   ├── route.ts
│   │           │   └── [id]/
│   │           │       ├── route.ts
│   │           │       └── refund/
│   │           │           └── route.ts
│   │           ├── categories/
│   │           │   └── route.ts
│   │           ├── customers/
│   │           │   └── route.ts
│   │           ├── inventory/
│   │           │   └── route.ts
│   │           ├── reviews/
│   │           │   └── route.ts
│   │           ├── coupons/
│   │           │   └── route.ts
│   │           ├── analytics/
│   │           │   └── route.ts
│   │           └── settings/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                             # shadcn primitives
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSpecs.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── StripePaymentForm.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── admin/
│   │   │   ├── DataTable.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   └── ImageUploader.tsx
│   │   └── shared/
│   │       ├── Breadcrumbs.tsx
│   │       ├── Pagination.tsx
│   │       ├── SearchBar.tsx
│   │       └── PriceDisplay.tsx
│   │
│   ├── lib/
│   │   ├── supabase/server.ts              # Supabase client singleton
│   │   ├── auth.ts                         # NextAuth config export
│   │   ├── stripe.ts                       # Stripe client singleton
│   │   ├── utils.ts                        # cn(), formatters
│   │   ├── constants.ts
│   │   ├── validators/
│   │   │   ├── product.ts                  # Zod schemas
│   │   │   ├── order.ts
│   │   │   ├── cart.ts
│   │   │   ├── user.ts
│   │   │   └── checkout.ts
│   │   ├── services/
│   │   │   ├── catalog.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── inventory.service.ts
│   │   │   ├── review.service.ts
│   │   │   ├── coupon.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── upload.service.ts
│   │   ├── actions/
│   │   │   ├── cart.actions.ts             # Server Actions (mutations)
│   │   │   ├── checkout.actions.ts
│   │   │   ├── auth.actions.ts
│   │   │   └── admin/
│   │   │       ├── product.actions.ts
│   │   │       ├── order.actions.ts
│   │   │       └── category.actions.ts
│   │   └── hooks/
│   │       ├── useCart.ts
│   │       └── useDebounce.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── cart.ts
│   │   └── api.ts                          # request/response types
│   │
│   ├── config/
│   │   ├── site.ts                         # site metadata, nav links
│   │   ├── filters.ts                      # product filter definitions
│   │   └── permissions.ts                  # role → permission map
│   │
│   └── middleware.ts                       # auth guards, rate limiting
│
└── tests/
    ├── unit/
    │   └── services/
    └── e2e/
        └── checkout.spec.ts
```

### 3.1 Conventions

| Concern | Convention |
|---------|------------|
| **Routing** | Romanian URL slugs for storefront (`/produse`, `/cos`); English for admin (`/admin/products`) |
| **Data fetching** | RSC for reads; Server Actions for form mutations; API routes for webhooks & external clients |
| **Components** | `ui/` = dumb primitives; `shop/` & `admin/` = domain components; colocate tests when added |
| **Services** | All DB/business logic in `lib/services/` — never in route handlers directly |
| **Validation** | Zod schemas in `lib/validators/`; shared between API routes and Server Actions |

---

## 4. Database Schema

### 4.1 Entity-Relationship Diagram

```
┌──────────┐       ┌──────────────┐       ┌─────────────┐
│  Brand   │───┐   │   Category   │───┐   │    User     │
└──────────┘   │   └──────────────┘   │   └─────────────┘
               │          │           │         │
               ▼          ▼           │    ┌────┴────┐
          ┌─────────┐  (tree)         │    │ Address │
          │ Product │◄────────────────┘    └─────────┘
          └────┬────┘                              │
               │                                   │
     ┌─────────┼─────────┐                        │
     ▼         ▼         ▼                        │
┌─────────┐ ┌──────┐ ┌────────┐                   │
│Product  │ │Product│ │Review  │                   │
│Image    │ │Variant│ │        │                   │
└─────────┘ └───┬──┘ └────────┘                   │
                │                                  │
           ┌────┴────┐                             │
           │CartItem │                             │
           └────┬────┘                             │
                │                                  │
           ┌────┴────┐         ┌─────────┐        │
           │  Cart   │         │  Order  │◄───────┘
           └─────────┘         └────┬────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              ┌──────────┐   ┌──────────┐   ┌───────────┐
              │OrderItem │   │ Payment  │   │ Shipment  │
              └──────────┘   └──────────┘   └───────────┘
```

### 4.2 Table Summary

| Table | Purpose |
|-------|---------|
| `users` | Accounts (NextAuth + custom fields) |
| `accounts` | OAuth provider accounts (NextAuth) |
| `sessions` | DB sessions (NextAuth) |
| `verification_tokens` | Email verification (NextAuth) |
| `addresses` | Shipping/billing addresses |
| `brands` | Manufacturer brands |
| `categories` | Nested product categories |
| `products` | Product master record |
| `product_images` | Product gallery |
| `product_specs` | Key-value technical specs |
| `product_variants` | Sellable SKUs with price/stock |
| `carts` | Shopping carts |
| `cart_items` | Line items in cart |
| `orders` | Completed/pending orders |
| `order_items` | Snapshot of purchased items |
| `payments` | Stripe payment records |
| `shipments` | Fulfillment tracking |
| `refunds` | Refund audit trail |
| `reviews` | Product reviews (moderated) |
| `coupons` | Discount codes |
| `coupon_usages` | Redemption tracking |
| `inventory_logs` | Stock change audit |
| `pages` | CMS static pages |
| `banners` | Homepage/promo banners |
| `blog_posts` | Content marketing |
| `settings` | Key-value store config |

### 4.3 Indexing Strategy

| Table | Index | Reason |
|-------|-------|--------|
| `products` | `(slug)` UNIQUE | URL lookup |
| `products` | `(categoryId, isPublished)` | Category listing |
| `products` | `(brandId)` | Brand filter |
| `product_variants` | `(sku)` UNIQUE | Inventory lookup |
| `product_variants` | `(productId)` | Variant fetch |
| `orders` | `(userId, createdAt DESC)` | Account order history |
| `orders` | `(orderNumber)` UNIQUE | Customer lookup |
| `orders` | `(status)` | Admin filtering |
| `carts` | `(sessionId)` / `(userId)` | Cart resolution |
| `reviews` | `(productId, isApproved)` | Product page |
| `categories` | `(slug)` UNIQUE | URL lookup |
| `categories` | `(parentId)` | Tree traversal |

---

## 5. Database Models

### 5.1 Enums

```sql
enum Role {
  CUSTOMER
  ADMIN
  SUPER_ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  COMPLETED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum ShipmentStatus {
  PENDING
  LABEL_CREATED
  IN_TRANSIT
  DELIVERED
  RETURNED
}

enum PhaseType {
  SINGLE
  THREE
}

enum ConnectorType {
  TYPE1
  TYPE2
  CCS2
  CHADEMO
  TESLA
}

enum MountingType {
  WALL
  PEDESTAL
  FLOOR
}

enum AddressType {
  SHIPPING
  BILLING
  BOTH
}

enum InventoryChangeType {
  SALE
  RESTOCK
  ADJUSTMENT
  RETURN
  DAMAGED
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### 5.2 Core Models (Schema Outline)

```sql
// ─── NextAuth required models ───────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?   // for Credentials provider
  role          Role      @default(CUSTOMER)
  phone         String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  addresses     Address[]
  orders        Order[]
  reviews       Review[]
  cart          Cart?
  couponUsages  CouponUsage[]

  @@map("users")
}

model Account { /* NextAuth standard */ }
model Session { /* NextAuth standard */ }
model VerificationToken { /* NextAuth standard */ }

// ─── Addresses ──────────────────────────────────────────────────────────────

model Address {
  id         String      @id @default(cuid())
  userId     String
  type       AddressType @default(SHIPPING)
  firstName  String
  lastName   String
  company    String?
  street     String
  city       String
  county     String      // județ (Romania)
  postalCode String
  country    String      @default("RO")
  phone      String
  isDefault  Boolean     @default(false)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("addresses")
}

// ─── Catalog ────────────────────────────────────────────────────────────────

model Brand {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  logo        String?
  description String?
  website     String?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  products    Product[]

  @@map("brands")
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  image       String?
  parentId    String?
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  products    Product[]

  @@index([parentId])
  @@map("categories")
}

model Product {
  id                   String        @id @default(cuid())
  name                 String
  slug                 String        @unique
  description          String        @db.Text
  shortDescription     String?
  categoryId           String
  brandId              String
  powerKw              Decimal       @db.Decimal(5, 2)
  phases               PhaseType
  connectorTypes       ConnectorType[]
  cableLength          Int?          // meters
  mountingType         MountingType?
  ipRating             String?
  warrantyYears        Int           @default(2)
  installationRequired Boolean       @default(false)
  smartFeatures        Json?         // { ocpp, wifi, rfid, loadBalancing }
  metaTitle            String?
  metaDescription      String?
  isPublished          Boolean       @default(false)
  isFeatured           Boolean       @default(false)
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  category             Category      @relation(fields: [categoryId], references: [id])
  brand                Brand         @relation(fields: [brandId], references: [id])
  images               ProductImage[]
  specs                ProductSpec[]
  variants             ProductVariant[]
  reviews              Review[]

  @@index([categoryId, isPublished])
  @@index([brandId])
  @@map("products")
}

model ProductImage {
  id        String   @id @default(cuid())
  productId String
  url       String
  alt       String?
  sortOrder Int      @default(0)
  isPrimary Boolean  @default(false)

  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@map("product_images")
}

model ProductSpec {
  id        String @id @default(cuid())
  productId String
  label     String // e.g. "Max current"
  value     String // e.g. "32A"
  sortOrder Int    @default(0)

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@map("product_specs")
}

model ProductVariant {
  id            String   @id @default(cuid())
  productId     String
  sku           String   @unique
  name          String   // e.g. "22kW · Cablu 7.5m · Negru"
  price         Decimal  @db.Decimal(10, 2)  // RON, stored as decimal
  compareAtPrice Decimal? @db.Decimal(10, 2)  // original/strikethrough price
  stock         Int      @default(0)
  lowStockThreshold Int  @default(5)
  weight        Decimal? @db.Decimal(8, 2)   // kg, for shipping
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  product       Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  cartItems     CartItem[]
  orderItems    OrderItem[]
  inventoryLogs InventoryLog[]

  @@index([productId])
  @@map("product_variants")
}

// ─── Cart ───────────────────────────────────────────────────────────────────

model Cart {
  id        String     @id @default(cuid())
  userId    String?    @unique
  sessionId String?    @unique  // for guest carts
  couponId  String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  coupon    Coupon?    @relation(fields: [couponId], references: [id])
  items     CartItem[]

  @@map("carts")
}

model CartItem {
  id        String @id @default(cuid())
  cartId    String
  variantId String
  quantity  Int    @default(1)

  cart      Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variant   ProductVariant @relation(fields: [variantId], references: [id])

  @@unique([cartId, variantId])
  @@map("cart_items")
}

// ─── Orders & Payments ──────────────────────────────────────────────────────

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique  // human-readable: EV-2026-00001
  userId          String?
  status          OrderStatus @default(PENDING)
  email           String      // guest or user email
  phone           String?

  // Snapshot addresses (immutable after order)
  shippingFirstName String
  shippingLastName  String
  shippingStreet    String
  shippingCity      String
  shippingCounty    String
  shippingPostalCode String
  shippingCountry   String    @default("RO")

  billingFirstName  String?
  billingLastName   String?
  billingStreet     String?
  billingCity       String?
  billingCounty     String?
  billingPostalCode String?
  billingCountry    String?

  subtotal        Decimal     @db.Decimal(10, 2)
  shippingCost    Decimal     @db.Decimal(10, 2) @default(0)
  discountAmount  Decimal     @db.Decimal(10, 2) @default(0)
  taxAmount       Decimal     @db.Decimal(10, 2) @default(0)
  total           Decimal     @db.Decimal(10, 2)
  currency        String      @default("RON")
  couponCode      String?
  notes           String?

  stripePaymentIntentId String? @unique
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  user            User?       @relation(fields: [userId], references: [id])
  items           OrderItem[]
  payment         Payment?
  shipment        Shipment?
  refunds         Refund[]

  @@index([userId, createdAt(sort: Desc)])
  @@index([status])
  @@map("orders")
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  variantId   String? // nullable if variant deleted later
  sku         String  // snapshot
  name        String  // snapshot
  price       Decimal @db.Decimal(10, 2)  // unit price at purchase
  quantity    Int
  total       Decimal @db.Decimal(10, 2)

  order       Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variant     ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)

  @@index([orderId])
  @@map("order_items")
}

model Payment {
  id                    String        @id @default(cuid())
  orderId               String        @unique
  stripePaymentIntentId String        @unique
  stripeChargeId        String?
  amount                Decimal       @db.Decimal(10, 2)
  currency              String        @default("RON")
  status                PaymentStatus @default(PENDING)
  paymentMethod         String?       // card, etc.
  paidAt                DateTime?
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  order                 Order         @relation(fields: [orderId], references: [id])
  refunds               Refund[]

  @@map("payments")
}

model Shipment {
  id             String         @id @default(cuid())
  orderId        String         @unique
  status         ShipmentStatus @default(PENDING)
  carrier        String?        // e.g. Fan Courier, Cargus
  trackingNumber String?
  trackingUrl    String?
  shippedAt      DateTime?
  deliveredAt    DateTime?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  order          Order          @relation(fields: [orderId], references: [id])

  @@map("shipments")
}

model Refund {
  id              String   @id @default(cuid())
  orderId         String
  paymentId       String
  stripeRefundId  String   @unique
  amount          Decimal  @db.Decimal(10, 2)
  reason          String?
  createdAt       DateTime @default(now())

  order           Order    @relation(fields: [orderId], references: [id])
  payment         Payment  @relation(fields: [paymentId], references: [id])

  @@index([orderId])
  @@map("refunds")
}

// ─── Reviews ────────────────────────────────────────────────────────────────

model Review {
  id        String       @id @default(cuid())
  productId String
  userId    String
  rating    Int          // 1-5
  title     String?
  content   String       @db.Text
  status    ReviewStatus @default(PENDING)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user      User    @relation(fields: [userId], references: [id])

  @@unique([productId, userId])
  @@index([productId, status])
  @@map("reviews")
}

// ─── Coupons ────────────────────────────────────────────────────────────────

model Coupon {
  id              String     @id @default(cuid())
  code            String     @unique
  type            CouponType
  value           Decimal    @db.Decimal(10, 2)
  minOrderAmount  Decimal?   @db.Decimal(10, 2)
  maxUses         Int?
  usedCount       Int        @default(0)
  startsAt        DateTime?
  expiresAt       DateTime?
  isActive        Boolean    @default(true)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  carts           Cart[]
  usages          CouponUsage[]

  @@map("coupons")
}

model CouponUsage {
  id        String   @id @default(cuid())
  couponId  String
  userId    String
  orderId   String   @unique
  createdAt DateTime @default(now())

  coupon    Coupon   @relation(fields: [couponId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@map("coupon_usages")
}

// ─── Inventory ──────────────────────────────────────────────────────────────

model InventoryLog {
  id          String              @id @default(cuid())
  variantId   String
  changeType  InventoryChangeType
  quantity    Int                 // positive = add, negative = remove
  stockBefore Int
  stockAfter  Int
  reason      String?
  referenceId String?             // orderId, etc.
  createdBy   String?             // admin userId
  createdAt   DateTime            @default(now())

  variant     ProductVariant @relation(fields: [variantId], references: [id])

  @@index([variantId, createdAt(sort: Desc)])
  @@map("inventory_logs")
}

// ─── CMS ────────────────────────────────────────────────────────────────────

model Page {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  content         String   @db.Text
  metaTitle       String?
  metaDescription String?
  isPublished     Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("pages")
}

model Banner {
  id        String    @id @default(cuid())
  title     String
  subtitle  String?
  imageUrl  String
  linkUrl   String?
  sortOrder Int       @default(0)
  isActive  Boolean   @default(true)
  startsAt  DateTime?
  endsAt    DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("banners")
}

model BlogPost {
  id              String    @id @default(cuid())
  title           String
  slug            String    @unique
  excerpt         String?
  content         String    @db.Text
  coverImage      String?
  author          String?
  metaTitle       String?
  metaDescription String?
  isPublished     Boolean   @default(false)
  publishedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("blog_posts")
}

// ─── Settings ───────────────────────────────────────────────────────────────

model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String   @db.Text
  updatedAt DateTime @updatedAt

  @@map("settings")
}
```

### 5.3 Seed Data Plan

| Entity | Seed content |
|--------|--------------|
| `User` | 1 SUPER_ADMIN, 1 ADMIN, 2 CUSTOMER test accounts |
| `Brand` | ABB, Wallbox, Easee, Schneider, etc. |
| `Category` | Stații AC, Stații DC, Accesorii, Cabluri |
| `Product` | 10–15 representative charging stations |
| `Setting` | `store_name`, `shipping_flat_rate`, `tax_rate`, `contact_email` |

---

## 6. Environment Variables

### 6.1 `.env.example`

```bash
# ─── App ───────────────────────────────────────────────────────────────────
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="EV Charging Store"

# ─── Database ──────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/ev_charging_store?schema=public"

# ─── NextAuth ──────────────────────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                        # openssl rand -base64 32

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ─── Stripe ────────────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ─── Email (Resend / Nodemailer) ───────────────────────────────────────────
EMAIL_FROM="noreply@example.com"
RESEND_API_KEY=

# ─── File Upload (optional — Vercel Blob / S3) ─────────────────────────────
BLOB_READ_WRITE_TOKEN=
# AWS_S3_BUCKET=
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_REGION=

# ─── Analytics (optional) ─────────────────────────────────────────────────
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# ─── Admin ─────────────────────────────────────────────────────────────────
ADMIN_EMAIL=admin@example.com           # initial seed admin
```

### 6.2 Environment by Stage

| Variable | Development | Production |
|----------|-------------|------------|
| `DATABASE_URL` | Local PostgreSQL / Docker | Managed PG (Neon, Supabase, RDS) |
| `STRIPE_*` | Test keys | Live keys |
| `NEXTAUTH_URL` | `localhost:3000` | Production domain |
| `NEXTAUTH_SECRET` | Dev secret | Strong random, rotated periodically |

### 6.3 Validation

Use `@t3-oss/env-nextjs` or a Zod-based `src/env.ts` to validate all env vars at build time. Fail fast on missing required secrets.

---

## 7. API Architecture

### 7.1 Design Principles

1. **Server Actions first** for form-based mutations from the storefront and admin UI.
2. **Route Handlers** (`/api/*`) for webhooks, public REST reads, and third-party integrations.
3. **Service layer** encapsulates all Prisma queries and business rules.
4. **Consistent response shape** for API routes:

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: { code: string, message: string } }
```

### 7.2 Endpoint Catalog

#### Public — Storefront

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/products` | None | List products (filters, pagination) |
| `GET` | `/api/products/[id]` | None | Product detail with variants |
| `GET` | `/api/categories` | None | Category tree |
| `GET/POST/PATCH/DELETE` | `/api/cart` | Session/User | Cart CRUD |
| `POST` | `/api/checkout` | Session/User | Create order + Stripe PaymentIntent |
| `GET` | `/api/orders/[id]` | User | Order detail (owner only) |

#### Webhooks

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/webhooks/stripe` | Stripe signature | `payment_intent.succeeded`, `charge.refunded` |

#### Admin — Protected (`ADMIN` / `SUPER_ADMIN`)

| Method | Path | Description |
|--------|------|-------------|
| `GET/POST` | `/api/admin/products` | List / create products |
| `GET/PATCH/DELETE` | `/api/admin/products/[id]` | Product CRUD |
| `GET/PATCH` | `/api/admin/orders` | List / update status |
| `GET/PATCH` | `/api/admin/orders/[id]` | Order detail / fulfill |
| `POST` | `/api/admin/orders/[id]/refund` | Issue Stripe refund |
| `GET/POST/PATCH/DELETE` | `/api/admin/categories` | Category management |
| `GET` | `/api/admin/customers` | Customer list |
| `GET/PATCH` | `/api/admin/inventory` | Stock adjustments |
| `GET/PATCH` | `/api/admin/reviews` | Moderate reviews |
| `GET/POST/PATCH/DELETE` | `/api/admin/coupons` | Coupon management |
| `GET` | `/api/admin/analytics` | Dashboard metrics |
| `GET/PATCH` | `/api/admin/settings` | Store settings |
| `POST` | `/api/upload` | Image upload |

### 7.3 Server Actions Map

| Action file | Actions |
|-------------|---------|
| `cart.actions.ts` | `addToCart`, `updateCartItem`, `removeFromCart`, `applyCoupon` |
| `checkout.actions.ts` | `createOrder`, `validateCheckout` |
| `auth.actions.ts` | `registerUser`, `requestPasswordReset` |
| `admin/product.actions.ts` | `createProduct`, `updateProduct`, `deleteProduct`, `publishProduct` |
| `admin/order.actions.ts` | `updateOrderStatus`, `createShipment`, `processRefund` |
| `admin/category.actions.ts` | `createCategory`, `updateCategory`, `reorderCategories` |

### 7.4 Request Flow — Checkout

```
Client (CheckoutForm)
    │
    ▼
checkout.actions.ts :: createOrder()
    │
    ├── Validate cart (stock, prices)
    ├── Create Order (status: PENDING)
    ├── Decrement stock (optimistic / transactional)
    ├── payment.service.ts :: createPaymentIntent()
    │       └── Stripe API
    └── Return { clientSecret, orderId }
    │
    ▼
StripePaymentForm (client) — confirm payment
    │
    ▼
Stripe webhook → /api/webhooks/stripe
    │
    ├── Verify signature
    ├── payment.service.ts :: handlePaymentSucceeded()
    │       ├── Update Payment status
    │       ├── Update Order → PAID
    │       └── Send confirmation email
    └── Return 200
```

### 7.5 Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Not logged in |
| `FORBIDDEN` | 403 | Insufficient role |
| `NOT_FOUND` | 404 | Resource missing |
| `VALIDATION_ERROR` | 422 | Zod validation failed |
| `OUT_OF_STOCK` | 409 | Insufficient inventory |
| `PAYMENT_FAILED` | 402 | Stripe error |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unhandled |

---

## 8. Authentication Architecture

### 8.1 NextAuth Configuration

| Setting | Value |
|---------|-------|
| **Adapter** | Custom session (cookie-based) + Supabase `users` table |
| **Session strategy** | Database sessions (secure, revocable) |
| **Providers** | Credentials (email/password) + Google OAuth (optional) |
| **Pages** | Custom: `/autentificare`, `/autentificare/inregistrare` |
| **Callbacks** | Inject `role` into session JWT / session object |

### 8.2 Auth Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Login     │────►│  NextAuth    │────►│  PostgreSQL │
│   Form      │     │  Credentials │     │  sessions   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  JWT/Session │
                    │  { id, email,│
                    │    role }    │
                    └──────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         middleware    getServerSession  API guards
```

### 8.3 Session Shape

```typescript
interface Session {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  };
}
```

### 8.4 Middleware (`src/middleware.ts`)

| Route pattern | Rule |
|---------------|------|
| `/admin/*` | Require `ADMIN` or `SUPER_ADMIN` |
| `/cont/*` | Require authenticated user |
| `/api/admin/*` | Require `ADMIN` or `SUPER_ADMIN` |
| `/api/orders/*` | Require authenticated (owner check in handler) |
| All other routes | Public |

### 8.5 Registration Flow

1. User submits email + password on `/autentificare/inregistrare`.
2. Server Action validates with Zod, hashes password (`bcrypt`, cost 12).
3. Create `User` with `role: CUSTOMER`.
4. Optional: send verification email via `verification_tokens`.
5. Auto sign-in or redirect to login.

### 8.6 Guest Checkout

- Guest carts keyed by `sessionId` cookie (`cart_session`, httpOnly, 30-day TTL).
- On checkout, order created with `userId: null` but `email` captured.
- Post-purchase: optional "create account" link using order email.

### 8.7 Cart Merge on Login

When a guest with `cart_session` logs in:
1. Load guest cart by `sessionId`.
2. Load user cart by `userId`.
3. Merge items (sum quantities, cap at stock).
4. Delete guest cart; clear session cookie.

### 8.8 Password Reset (Phase 2)

- `requestPasswordReset` → generate token → email link.
- `/autentificare/resetare/[token]` → validate → update `passwordHash`.

---

## 9. Admin Architecture

### 9.1 Access Control

```typescript
// src/config/permissions.ts
const PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'products:read', 'products:write',
    'orders:read', 'orders:write',
    'customers:read',
    'inventory:write',
    'reviews:moderate',
    'coupons:write',
    'content:write',
    'analytics:read',
    'settings:read',
  ],
  CUSTOMER: [],
} as const;
```

Helper: `hasPermission(role, permission)` used in Server Actions and API routes.

### 9.2 Admin Layout Structure

```
/admin (dashboard)
├── KPI cards: revenue today, orders pending, low stock alerts
├── Recent orders table
└── Sales chart (30 days)

Sidebar navigation:
├── Dashboard
├── Produse (Products)
├── Categorii (Categories)
├── Comenzi (Orders)
├── Clienți (Customers)
├── Inventar (Inventory)
├── Recenzii (Reviews)
├── Reduceri (Coupons)
├── Conținut (CMS)
├── Rapoarte (Reports)
└── Setări (Settings)          ← SUPER_ADMIN only
```

### 9.3 Admin Module Specifications

#### 9.3.1 Dashboard (`/admin`)

| Metric | Source |
|--------|--------|
| Revenue (today/week/month) | `orders` where `status IN (PAID, ...)` |
| Orders by status | `GROUP BY status` |
| Low stock items | `product_variants` where `stock <= lowStockThreshold` |
| Pending reviews | `reviews` where `status = PENDING` |
| Top products | `order_items` aggregated |

#### 9.3.2 Product Management (`/admin/produse`)

- **List:** DataTable with search, category filter, publish status.
- **Create/Edit form:** Multi-step or tabbed — General, Variants, Images, Specs, SEO.
- **Variant manager:** Inline SKU, price, stock per variant.
- **Image uploader:** Drag-and-drop, reorder, set primary.
- **Bulk actions:** Publish/unpublish, delete.

#### 9.3.3 Order Management (`/admin/comenzi`)

- **List:** Filter by status, date range, search by order number/email.
- **Detail view:**
  - Customer info + addresses
  - Line items (snapshot, not live prices)
  - Payment status (Stripe link)
  - Shipment form (carrier, tracking)
  - Status timeline
  - Refund button (partial/full)
- **Status transitions:**

```
PENDING → PAID → PROCESSING → SHIPPED → DELIVERED → COMPLETED
    ↓         ↓                                    ↓
CANCELLED  REFUNDED                            REFUNDED
```

#### 9.3.4 Inventory (`/admin/inventar`)

- Stock levels per variant
- Manual adjustment with reason + audit log (`inventory_logs`)
- Low stock alerts on dashboard

#### 9.3.5 Review Moderation (`/admin/recenzii`)

- Queue of `PENDING` reviews
- Approve / reject with optional admin note
- Only `APPROVED` reviews shown on product pages

#### 9.3.6 CMS (`/admin/continut`)

- Static pages (Terms, Privacy, About)
- Homepage banners (scheduling with `startsAt`/`endsAt`)
- Blog posts with rich text editor

#### 9.3.7 Settings (`/admin/setari`) — SUPER_ADMIN

- Store name, contact info
- Shipping rates
- Tax configuration
- Email templates toggles

### 9.4 Admin UI Stack

| Layer | Choice |
|-------|--------|
| Component library | shadcn/ui (Radix + Tailwind) |
| Tables | TanStack Table |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Rich text | Tiptap (blog/CMS) |
| Toasts | Sonner |
| Date pickers | react-day-picker |

### 9.5 Admin API Guard Pattern

```typescript
// Pseudocode — not implementation
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new ApiError('UNAUTHORIZED', 401);
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    throw new ApiError('FORBIDDEN', 403);
  }
  return session;
}
```

---

## 10. Payment Architecture (Stripe)

### 10.1 Integration Mode

**Primary:** Stripe Payment Intents with Stripe Elements (embedded checkout form).  
**Optional later:** Stripe Checkout Sessions (redirect-based).

### 10.2 Currency & Amounts

- Store currency: **RON** (Romanian Leu).
- Stripe amounts in **bani** (smallest unit): `amount = total * 100`.
- Prices stored as `Decimal` in DB; converted at Stripe boundary.

### 10.3 Webhook Events

| Event | Handler action |
|-------|----------------|
| `payment_intent.succeeded` | Mark order PAID, create Payment record, send email |
| `payment_intent.payment_failed` | Mark payment FAILED, restore stock |
| `charge.refunded` | Update Payment/Order status, log Refund |
| `charge.dispute.created` | Alert admin (email/notification) |

### 10.4 Idempotency

- Store `stripePaymentIntentId` on Order (unique constraint).
- Webhook handler checks if order already `PAID` before processing.
- Use Stripe idempotency keys on PaymentIntent creation.

### 10.5 Refund Flow

1. Admin clicks refund on order detail.
2. `POST /api/admin/orders/[id]/refund` with amount + reason.
3. `payment.service.ts` calls `stripe.refunds.create()`.
4. Webhook confirms → update DB.
5. Restore inventory if full refund.

---

## 11. Security & Compliance

| Area | Measure |
|------|---------|
| **Passwords** | bcrypt, cost factor 12 |
| **Sessions** | HttpOnly cookies, secure in production |
| **CSRF** | Built into NextAuth + Server Actions |
| **Rate limiting** | Middleware on `/api/auth/*`, `/api/checkout` |
| **Input validation** | Zod on all inputs |
| **SQL injection** | Prisma parameterized queries |
| **XSS** | React escaping; sanitize CMS HTML |
| **Stripe** | Webhook signature verification |
| **File upload** | Type/size validation; store in blob storage |
| **RBAC** | Role checks on every admin route/action |
| **Audit** | `inventory_logs`, order status history (future) |
| **GDPR** | Privacy policy page; user data export/delete (Phase 2) |

---

## 12. Deployment & Infrastructure

### 12.1 Recommended Stack

| Component | Service |
|-----------|---------|
| Hosting | Vercel |
| Database | Neon PostgreSQL or Supabase |
| File storage | Vercel Blob or AWS S3 |
| Email | Resend |
| Payments | Stripe |
| Monitoring | Vercel Analytics + Sentry (optional) |

### 12.2 CI/CD Pipeline

```
push → GitHub Actions
  ├── lint (ESLint)
  ├── typecheck (tsc --noEmit)
  ├── typecheck (tsc --noEmit)
  ├── unit tests (Vitest)
  └── deploy preview (Vercel)
```

### 12.3 Database Migrations

- Supabase SQL migrations in `supabase/migrations/`.
- Apply via Supabase SQL Editor or Supabase CLI (`supabase db push`).
- Never edit applied migrations.

---

## 13. Implementation Phases

### Phase 1 — Foundation (Week 1–2)
- [ ] Next.js 15 project scaffold (TypeScript, Tailwind, shadcn/ui)
- [ ] Supabase schema + initial migration + seed
- [ ] NextAuth (credentials + session)
- [ ] Base layouts (shop + admin shell)
- [ ] Middleware auth guards

### Phase 2 — Catalog (Week 2–3)
- [ ] Product listing with filters
- [ ] Product detail page
- [ ] Category navigation
- [ ] Admin product CRUD
- [ ] Image upload

### Phase 3 — Commerce (Week 3–4)
- [ ] Cart (guest + authenticated)
- [ ] Checkout flow
- [ ] Stripe Payment Intents + webhook
- [ ] Order confirmation email
- [ ] Customer order history

### Phase 4 — Admin Operations (Week 4–5)
- [ ] Order management + status workflow
- [ ] Shipment tracking
- [ ] Inventory management
- [ ] Refunds
- [ ] Dashboard analytics

### Phase 5 — Polish (Week 5–6)
- [ ] Reviews system
- [ ] Coupons
- [ ] CMS (pages, banners, blog)
- [ ] SEO (metadata, sitemap, structured data)
- [ ] E2E tests for checkout
- [ ] Production deployment

---

## Appendix A — Key Dependencies

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "typescript": "^5",
    "@supabase/supabase-js": "latest",
    "stripe": "latest",
    "@stripe/stripe-js": "latest",
    "@stripe/react-stripe-js": "latest",
    "zod": "latest",
    "bcryptjs": "latest",
    "tailwindcss": "^4",
    "@hookform/resolvers": "latest",
    "react-hook-form": "latest",
    "@tanstack/react-table": "latest",
    "recharts": "latest",
    "sonner": "latest",
    "date-fns": "latest"
  },
  "devDependencies": {
    "@types/bcryptjs": "latest",
    "eslint": "latest",
    "prettier": "latest",
    "vitest": "latest"
  }
}
```

## Appendix B — Naming & i18n Notes

- **Primary locale:** Romanian (`ro-RO`)
- **Currency display:** `formatPrice(1500)` → `"1.500,00 RON"`
- **URL slugs:** Romanian (`/produse/statie-wallbox-pulsar-plus`)
- **Admin UI:** Romanian labels; code/comments in English
- **Date format:** `DD.MM.YYYY` (Romanian convention)

---

*Document version: 1.0 — Architecture specification only. Implementation to follow in subsequent phases.*
