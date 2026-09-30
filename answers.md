# Assignment Deliverable: Answers & Architectural Analysis (`answers.md`)

## 1. Reference Analysis

We inspected the Sales CRM reference application (`https://sales-crm-kargulstudio.vercel.app/`) to extract reusable UI primitives (Button, Badge, Input, DataTable, KanbanCard) and systematic theme tokens for colors (`--ti-bg-app`, `--ti-color-primary`), spacing, borders, radii, and typography. The boundary between application business logic and design system was established by isolating purely presentation props (`variant`, `size`, `stage`, `amount`) from domain API calls. We verified the visual recreation by capturing DOM element measurements and compiling a pixel comparison report in `docs/visual-comparison/README.md` demonstrating a <= 3.0% visual mismatch threshold across all 5 reference components.

## 2. Architecture & Clean Code

We selected a Turborepo monorepo with pnpm, Next.js App Router, TypeScript strict mode, Zod, and Drizzle ORM to maintain clean boundary separation between registry validation (`@tech-inject/registry-schema`), data storage (`@tech-inject/db`), component tokens (`@tech-inject/theme`), and apps. A key SOLID/DRY decision was building a single central authorization function `canAccess(viewer, component)` in `@tech-inject/db` used across every protected API endpoint (`/source`, `/manifest`, `/prompt`). We applied KISS/YAGNI by avoiding unnecessary GraphQL wrappers, state machine libraries, or custom bundler plugins, choosing direct JSON bundle validation and standard Next.js route handlers.

## 3. Publishing Consistency

Preview iframe postMessage payloads, source code APIs, CLI installer manifests, and AI agent prompts all dynamically query the exact same immutable `currentVersionId` linked to the published component version in PostgreSQL. When an admin publishes an update, it executes atomically: validation -> version creation -> hash calculation -> current version update. If an update fails validation, the previous published version remains live without exposure; if a component is unpublished, status updates to `unpublished`, immediately causing direct API routes, source endpoints, and CLI installer requests to return 404.

## 4. Security

Uploaded component code poses code execution risks on backends, admin API spoofing, and installer path traversal attacks (`../../etc/passwd`). We mitigated uploaded code execution by storing bundles purely as static JSON strings validated with Zod, and rendering previews inside isolated `<iframe>` elements configured with `sandbox="allow-scripts"` (without `allow-same-origin`) and strict CSP headers. Admin write APIs verify server-side Iron Session cookies, and the CLI installer strictly enforces `verifyPathContainment` to block path traversal, absolute paths, null byte escapes, and shell script execution. Limitations include potential client-side CPU consumption if uploaded preview code contains infinite loops inside the iframe.

## 5. AI Ownership

During development, an AI suggestion recommended putting a hardcoded demo `CATALOGUE_TOKEN` string inside generated AI agent prompts. We challenged this suggestion because placing real tokens into prompt text risks secret leakage in Git repositories, chat transcripts, and logs. We corrected this by requiring environment variable references (`CATALOGUE_TOKEN=$CATALOGUE_TOKEN`) in AI prompts, and verified copied installation commands in `consumer-examples/vite-app-clean` to ensure clean TypeScript compilation and Vite build output.

## 6. Production Ownership

Deployment readiness was proved by verifying TypeScript strict typechecking (`pnpm typecheck`), Vitest unit tests, Playwright E2E browser tests, and clean Vite consumer compilation. To diagnose a broken production release, we inspect structured application logs for error stack traces and query `audit_log` records to trace recent administrative actions. Recovery is executed by unpublishing the problematic version or re-pointing `currentVersionId` in the database to the previous immutable `component_versions` record without requiring frontend code redeployment.

## 7. Premium Access

Account identity, publication status, and administrative permissions are strictly decoupled: admin identity comes from server-side admin sessions (`ADMIN_EMAIL`), whereas customer identity comes from customer records (`customers.isPremium`). Signed-out users and free customers attempting to access premium components are blocked at the central `canAccess(viewer, component)` layer, returning 403 Forbidden on `/source`, `/manifest`, and `/prompt` endpoints. When a customer's premium status is revoked by an admin, subsequent protected requests instantly fail `canAccess` checks, while existing free components remain accessible.
