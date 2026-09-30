# Tech Inject Design Library

Production-ready, reusable React/Next.js + TypeScript component library, dynamic registry, admin publishing dashboard, isolated preview sandbox, real component installer CLI, and AI-agent integration prompts.

---

## 🚀 Key Highlights & Architecture

- **Sales CRM Visual Theme**: High-contrast dark theme tokens based on the [Sales CRM Reference](https://sales-crm-kargulstudio.vercel.app/).
- **Dynamic Component Registry**: Database-driven component catalogue. Newly published components appear instantly without editing frontend code or redeploying apps.
- **Central Authorization System**: Unified `canAccess(viewer, component)` function enforcing access rules across public APIs (`/source`, `/manifest`, `/prompt`).
- **Real Installer CLI**: Node/TS executable (`npx @tech-inject/cli add <slug>`) with strict path containment, path traversal defense, and automatic package manager detection (`pnpm`, `npm`, `yarn`, `bun`).
- **Isolated Preview Sandbox**: Next.js preview app rendered inside restricted `<iframe sandbox="allow-scripts">` without `allow-same-origin` and enforced CSP.
- **AI Agent Integration Prompts**: Standardized AI integration prompts for every component, referencing `CATALOGUE_TOKEN` environment variables for premium access without secret leakage.

---

## 📁 Repository Structure

```text
tech-inject-design-library/
├── apps/
│   ├── catalogue/          # Next.js App Router Public Catalogue & APIs (Port 3000)
│   ├── admin/              # Next.js App Router Admin Publishing Dashboard (Port 3001)
│   └── preview-sandbox/    # Restricted Preview Sandbox Host (Port 3002)
├── packages/
│   ├── theme/              # Sales CRM visual design tokens & CSS variables
│   ├── ui/                 # Reusable React UI component library (Button, Badge, Input, DataTable, KanbanCard)
│   ├── registry-schema/    # Zod ComponentBundle schemas & bundle validation rules
│   ├── db/                 # Drizzle ORM schema, Neon Postgres, central canAccess auth, seed scripts
│   └── cli/                # @tech-inject/cli component installer executable
├── consumer-examples/
│   └── vite-app-clean/     # Clean Vite + React + TS consumer testing CLI install & rendering
├── docs/
│   ├── bundle-format.md    # Component bundle specification & Zod validation rules
│   ├── preview-isolation.md# Iframe sandbox isolation & security specification
│   ├── RUN-LOCALLY.md      # Detailed local setup & test commands
│   ├── DEPLOYMENT.md       # Production Neon & Vercel deployment guide
│   ├── HANDOFF.md          # Continuous development handoff log
│   └── visual-comparison/  # M0 visual comparison analysis report (<= 3.0% mismatch)
├── tests/                  # Automated Vitest security matrix & Playwright E2E tests
├── answers.md              # Complete answers to assignment questions 1-7
└── README.md
```

---

## 🛠️ Local Quick Start

### 1. Install Workspace Dependencies

```bash
pnpm install
```

### 2. Configure Environment & Seed Database

```bash
cp .env.example .env
pnpm --filter @tech-inject/db seed
```

### 3. Start Development Servers

```bash
pnpm dev
```

Access local applications:

- **Public Catalogue**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3001](http://localhost:3001)
- **Preview Sandbox**: [http://localhost:3002](http://localhost:3002)

---

## 🧪 Quality Assurance & Test Verification

Run all test suites across the monorepo:

```bash
# 1. Check code formatting
pnpm format:check

# 2. Run TypeScript strict typecheck
pnpm typecheck

# 3. Run unit tests & central security matrix (Vitest)
pnpm test

# 4. Run E2E browser tests (Playwright)
pnpm test:e2e

# 5. Full workspace production build
pnpm build
```

---

## 💻 CLI Installer Usage

Install any published component directly into your React project:

```bash
# Install Free Component
npx @tech-inject/cli add button

# Install Premium Component (requires customer CATALOGUE_TOKEN)
CATALOGUE_TOKEN=ti_live_xxx npx @tech-inject/cli add data-table
```

---

## 🔒 Security Model Summary

1. **Path Safety**: CLI verifies path containment (`verifyPathContainment`), rejecting absolute paths, `..` traversal, null bytes, backslashes, and leading dots.
2. **Sandbox Isolation**: Sandbox runs on a separate origin with `sandbox="allow-scripts"` (without `allow-same-origin`) to prevent access to parent application session cookies.
3. **No Code Execution on Backend**: Uploaded bundle files are treated purely as static text JSON and validated via Zod.
