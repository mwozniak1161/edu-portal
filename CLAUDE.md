# Educational ERP — Claude Instructions

## What We're Building
Portfolio-grade Educational ERP (Librus/Moodle-style).
Stack showcases: modular NestJS, Prisma, Claude, Next.js App Router.

## Tech Stack
- **Backend**: NestJS, TypeScript, Prisma + PostgreSQL
- **Frontend**: Next.js 16 (App Router), Tailwind, Shadcn/ui
- **State**: TanStack Query (server state) + Zustand (UI/client state)
- **Auth**: JWT Access/Refresh Tokens + Passport.js
- **Validation**: Zod (shared) + class-validator (NestJS DTOs)
- **Testing**: Jest + `@nestjs/testing` (API only — no frontend tests yet)
- **Docs**: Auto-Swagger at /api via @nestjs/swagger

## Architecture
- `apps/api` — NestJS backend (port 3000)
- `apps/web` — Next.js frontend (port 3001)
- `packages/shared` — Zod schemas, shared types, DTOs

## Infrastructure
- All services run in Docker (`docker-compose.yml`): Postgres, pgAdmin, API, Web
- Do NOT suggest local Postgres installation
- Migrations run automatically via `entrypoint.sh` on API container start
- `DATABASE_URL` in `.env` — see `.env.example`
- CI: GitHub Actions (`.github/workflows/ci.yml`) — lint + tests + Docker build on every PR to master

## Key Docs (read when relevant)
- Schema & relations: `docs/Database-Schema-Design.md`
- API conventions: `docs/API-Design-Standards.md`
- Auth flow: `docs/Authentication-System.md`
- Business logic (weighted avg, attendance guard): `docs/core-business-logic.md`
- Current tasks: `docs/PROGRESS.md`
- Reusable UI components registry: `docs/ReusableComponents.md`
- Design system & style guide: `docs/StyleGuide.md`

## Rules
See `.claude/rules/` for detailed topic rules.

## Database Conventions
- snake_case column names
- UUID primary keys named `id`
- camelCase in Prisma schema (maps to snake_case in DB)
- Timestamps: `createdAt`, `updatedAt` on every model
- FK pattern: `teacherClassId`, `studentId`
- Default `onDelete: Cascade` unless noted otherwise
- Prisma schema is source of truth — ignore any `schema.sql`
- Prisma config in `apps/api/prisma.config.ts` (Prisma 7 style — no `url` in schema.prisma)
- Run Prisma CLI via `pnpm exec prisma <cmd>` from `apps/api/`

## API Response Shape
All responses wrapped by TransformInterceptor:
```
{ data: T }          // success
{ error, message }   // exceptions via GlobalExceptionFilter
```

## State Management
- TanStack Query — all server data (API calls, caching, mutations)
- Zustand — UI state only (modals, sidebar open/close, ephemeral state)
- Never use Zustand to cache API responses

## Core Principles
1. TypeScript strict mode — no `any`, no exceptions
2. Only touch files relevant to current task
3. Run lint + type-check before marking task done
4. Tests required for business logic and service layer
5. Ask before adding a new dependency
6. Small, single-purpose functions
7. No commented-out code
8. Env vars in `.env.example` with explanation comment
9. No `console.log` in committed code

## What Claude Must NOT Do
- Do not use TypeORM — we use Prisma
- Do not install Postgres locally — use docker-compose
- Do not upgrade dependency versions unprompted
- Do not add placeholder/lorem ipsum to production code
- Do not silently skip failing tests
- Do not reformat files outside current task scope
- Do not use `npx prisma` — use `pnpm exec prisma`
