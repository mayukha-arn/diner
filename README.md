# Diner Restaurant Operations Dashboard

## Workspace Structure

- `apps/dashboard` — main web dashboard app
- `services/backend` — backend API server
- `packages/db` — PostgreSQL / Drizzle schema and db layer
- `packages/types` — generated Zod/OpenAPI schema package
- `packages/api-client` — Orval-generated React client hooks package
- `packages/shared` — shared design token package
- `packages/api-spec` — API contract generation package

## Run locally

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the dashboard front-end:
   ```bash
   pnpm dev:dashboard
   ```

3. Start the backend API server:
   ```bash
   pnpm dev:backend
   ```

4. Regenerate API contracts:
   ```bash
   pnpm gen:contract
   ```

## Scripts

- `pnpm dev:dashboard` — run the dashboard app
- `pnpm dev:backend` — run the backend server
- `pnpm gen:contract` — regenerate OpenAPI/Orval client types
- `pnpm typecheck` — run TypeScript checks across the workspace
- `pnpm lint` — run lint scripts present in packages
- `pnpm test` — run tests present in packages

## Architecture note

The repository has been restructured to match the assignment requirements:
- workspace packages under `apps/*`, `services/*`, and `packages/*`
- shared UI tokens are now surfaced through `packages/shared`
- backend schema and contract packages are organized under `packages/db`, `packages/types`, and `packages/api-spec`

## Tradeoffs

- The current dashboard remains a Vite-powered web dashboard, not an Expo React Native app.
- The backend is still implemented with the existing server package rather than a Cloudflare Workers Hono runtime.
- The repo structure and contract generation flow have been aligned to the requested stack shape.
