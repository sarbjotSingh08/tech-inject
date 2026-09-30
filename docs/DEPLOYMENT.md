# DEPLOYMENT.md — Production Deployment Architecture & Manual Guide

## Overview

The Tech Inject Design Library is designed for deployment using **Neon PostgreSQL** and **Vercel** (or any Node.js container hosting provider).

---

## 1. Target Infrastructure

| Service              | Host Provider          | Build Framework     | Target URL / Subdomain                    |
| :------------------- | :--------------------- | :------------------ | :---------------------------------------- |
| **Database**         | Neon PostgreSQL        | Postgres Serverless | `DATABASE_URL`                            |
| **Public Catalogue** | Vercel                 | Next.js App Router  | `https://catalogue-techinject.vercel.app` |
| **Admin Dashboard**  | Vercel                 | Next.js App Router  | `https://admin-techinject.vercel.app`     |
| **Preview Sandbox**  | Vercel / Isolated Host | Next.js / HTML App  | `https://sandbox-techinject.vercel.app`   |

---

## 2. Required Production Environment Variables

Configure the following environment variables in Vercel project settings:

```ini
# Database Connection (Neon)
DATABASE_URL="postgres://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Admin Authentication
ADMIN_EMAIL="admin@techinject.design"
ADMIN_PASSWORD_HASH="$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"
SESSION_SECRET="super-secret-32-character-min-session-key-for-iron-session"

# Application Cross-Origin URLs
NEXT_PUBLIC_CATALOGUE_URL="https://catalogue-techinject.vercel.app"
NEXT_PUBLIC_ADMIN_URL="https://admin-techinject.vercel.app"
NEXT_PUBLIC_SANDBOX_URL="https://sandbox-techinject.vercel.app"
```

---

## 3. Monorepo Vercel Settings

For each of the 3 Next.js applications in Vercel:

### Catalogue Application (`apps/catalogue`)

- **Root Directory**: `apps/catalogue`
- **Build Command**: `cd ../.. && pnpm build --filter=@tech-inject/catalogue...`
- **Output Directory**: `.next`

### Admin Dashboard Application (`apps/admin`)

- **Root Directory**: `apps/admin`
- **Build Command**: `cd ../.. && pnpm build --filter=@tech-inject/admin...`
- **Output Directory**: `.next`

### Preview Sandbox Application (`apps/preview-sandbox`)

- **Root Directory**: `apps/preview-sandbox`
- **Build Command**: `cd ../.. && pnpm build --filter=@tech-inject/preview-sandbox...`
- **Output Directory**: `.next`

---

## 4. Deployment Order & Verification

1. Provision Neon PostgreSQL database and copy `DATABASE_URL`.
2. Push repository to GitHub.
3. Link Vercel project for `apps/catalogue`, `apps/admin`, and `apps/preview-sandbox`.
4. Deploy database schema & seed test accounts:
   ```bash
   pnpm --filter @tech-inject/db db:push
   pnpm --filter @tech-inject/db seed
   ```
5. Confirm cross-origin headers, strict CSP on Sandbox, and session cookie `SameSite=lax; Secure; HttpOnly` settings.
