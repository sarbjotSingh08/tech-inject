# RUN-LOCALLY.md — Local Development & Setup Guide

## Prerequisites

- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **pnpm**: v10.x / v12.x
- **Git**

---

## 1. Installation

Clone repository and install dependencies across monorepo workspace:

```bash
pnpm install
```

---

## 2. Environment Variables Setup

Copy `.env.example` to root `.env` (or configure application environment variables):

```bash
cp .env.example .env
```

Default local environment configuration:

- `DATABASE_URL`: Postgres / Neon database connection string. (If omitted, system automatically operates with in-memory repository store fallback).
- `ADMIN_EMAIL`: `admin@techinject.design`
- `ADMIN_PASSWORD_HASH`: `$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW`
- `SEED_FREE_PASSWORD`: `FreeCustomerPassword123!`
- `SEED_PREMIUM_PASSWORD`: `PremiumCustomerPassword123!`

---

## 3. Database Migration & Seed

Run database seed script to seed initial component fixtures (Button, Badge, Input, DataTable, KanbanCard) and test customer accounts (`free@techinject.design` and `premium@techinject.design`):

```bash
pnpm --filter @tech-inject/db seed
```

---

## 4. Local Development Server Execution

Recommended Local Ports:

- **Public Catalogue**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3001`
- **Preview Sandbox**: `http://localhost:3002`

To start all workspace apps concurrently:

```bash
pnpm dev
```

Or run individual apps:

```bash
# Public Catalogue (Port 3000)
pnpm --filter @tech-inject/catalogue dev

# Admin Dashboard (Port 3001)
pnpm --filter @tech-inject/admin dev

# Preview Sandbox (Port 3002)
pnpm --filter @tech-inject/preview-sandbox dev
```

---

## 5. Automated Verification & Testing Commands

```bash
# Run unit tests across all packages & apps (Vitest)
pnpm test

# Run End-to-End E2E browser tests (Playwright)
pnpm test:e2e

# Run TypeScript type check across monorepo
pnpm typecheck

# Check Prettier code formatting
pnpm format:check

# Run ESLint check
pnpm lint

# Production monorepo build test
pnpm build
```
