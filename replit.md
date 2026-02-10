# Overview

"The Six" is an AI C-Suite product for day-one founders — it provides a virtual executive team (CEO, CFO, CTO, CMO, COO, CPO). The current application is a landing page / waitlist site where users can submit their email to join a waitlist or purchase founding access via Stripe. It's a full-stack TypeScript application with a React frontend and Express backend, backed by PostgreSQL.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support). Font is Manrope via Google Fonts
- **Animations**: Framer Motion
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`
- **Entry point**: `client/src/main.tsx` → `client/src/App.tsx`

## Backend
- **Framework**: Express.js running on Node with TypeScript (via tsx)
- **Architecture**: Single `server/routes.ts` file registers API routes on the Express app. Storage layer abstracted behind `IStorage` interface in `server/storage.ts`
- **API**: REST endpoints under `/api/` prefix. Currently just `POST /api/waitlist`
- **Dev server**: Vite dev server runs as middleware in development (see `server/vite.ts`). In production, static files are served from `dist/public`

## Database
- **Database**: PostgreSQL (required — `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation
- **Schema location**: `shared/schema.ts` — shared between client and server
- **Tables**:
  - `users` — id (UUID, auto-generated), username (unique), password
  - `waitlist_entries` — id (serial), email (unique), source (default "WAITLIST"), created_at
- **Migrations**: Use `drizzle-kit push` (`npm run db:push`) to sync schema to database

## Build System
- **Dev**: `npm run dev` — runs tsx with Vite middleware for HMR
- **Build**: `npm run build` — runs custom `script/build.ts` which builds client with Vite and server with esbuild into `dist/`
- **Production**: `npm start` — runs `node dist/index.cjs`
- **Type checking**: `npm run check` — runs tsc with noEmit

## Key Design Decisions
- Shared schema in `shared/schema.ts` ensures type safety across client and server
- Storage layer uses interface pattern (`IStorage`) for potential swapping implementations, currently only `DatabaseStorage`
- Waitlist entries are deduplicated by email (returns existing entry if already registered)
- Raw body is preserved on requests for webhook signature verification capability

# External Dependencies

## Database
- **PostgreSQL** — Required. Connection via `DATABASE_URL` environment variable. Uses `pg` (node-postgres) pool with Drizzle ORM

## Third-Party Services
- **Stripe** — Payment link for founding access (`https://buy.stripe.com/...`). Currently just a redirect link, no server-side Stripe integration yet (though `stripe` is in the build allowlist)
- **Google Apps Script** — Waitlist submissions are forwarded to a Google Apps Script endpoint for external tracking/spreadsheet logging. Failures are caught and logged but don't block the user response
- **GitHub (Replit Connector)** — `server/github.ts` has integration for GitHub via `@octokit/rest` using Replit's connector system for OAuth token management. Not currently used in routes but available

## Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` — Error overlay in development
- `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-dev-banner` — Dev-only Replit plugins
- `connect-pg-simple` — PostgreSQL session store (available but sessions not currently configured in routes)