# ARCHITECTURE.md — Tech Inject Monorepo Architecture

## Monorepo Overview

The Tech Inject Design Library is structured as a pnpm workspace monorepo managed by Turborepo with strict package boundaries:

```
apps/
  catalogue/       # Next.js App Router Public Catalogue & APIs (Port 3000)
  admin/           # Next.js App Router Admin Dashboard (Port 3001)
  preview-sandbox/ # Restricted Preview Sandbox Host (Port 3002)

packages/
  theme/           # Sales CRM Visual Theme tokens & CSS variables
  ui/              # Reusable React components (Button, Badge, Input, DataTable, KanbanCard)
  registry-schema/ # Zod validation schemas for ComponentBundle
  db/              # Drizzle ORM, Neon PostgreSQL, central canAccess auth & disk store fallback
  cli/             # @tech-inject/cli component installer executable

consumer-examples/
  vite-app-clean/  # Clean Vite + React + TS consumer example testing installer & compilation

docs/              # Architectural, security, and local operation specifications
answers.md         # Answers to mandatory assignment questions
README.md          # Monorepo setup guide and overview
```

---

## Central Authorization & Data Flow

1. **Central Access Control**: `canAccess(viewer, component)` in `@tech-inject/db` acts as the single source of truth for authorization across all apps.
2. **Persistent Storage**: Uses PostgreSQL / Drizzle ORM in production and a synced disk file store (`.data/store.json`) in local development so Catalogue and Admin apps remain in real-time sync without database setup.
3. **Iframe Isolation**: Sandbox app runs on a separate origin/port (`http://localhost:3002`) with `sandbox="allow-scripts"` (without `allow-same-origin`) and strict CSP headers.
