# Educational ERP — Claude Instructions

## What We're Building
Portfolio-grade Educational ERP (Librus/Moodle-style).
Stack showcases: modular NestJS, Prisma, Claude, Next.js App.

## Tech Stack
- **Backend**: NestJS, TypeScript, Prisma + PostgreSQL
- **Frontend**: Next.js 15, App Router, Tailwind, Shadcn/ui
- **State**: TanStack Query (server state) + Zustand (UI/client state)
- **Auth**: JWT Access/Refresh Tokens + Passport.js
- **Validation**: Zod (shared) + class-validator (NestJS DTOs)
- **Testing**: Jest (NestJS) + Vitest (Next.js)
- **Docs**: Auto-Swagger at /api via @nestjs/swagger

## Architecture
- `apps/api` — NestJS backend
- `apps/web` — Next.js frontend  
- `packages/shared` — Zod schemas, shared types, DTOs

## Infrastructure
- PostgreSQL runs in Docker (`docker-compose.yml`)
- Do NOT suggest local Postgres installation
- `DATABASE_URL` in `.env` — see `.env.example`

## Key Docs (read when relevant)
- Schema & relations: `@docs/Database-Schema-Design.md`
- API conventions: `@docs/API-Design-Standards.md`
- Auth flow: `@docs/Authentication-System.md`
- Business logic (weighted avg, attendance guard): `@docs/core-business-logic.md`
- Current tasks: `@docs/PROGRESS.md`

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

## API Response Shape
All responses wrapped by TransformInterceptor:
\```
{ data: T }          // success
{ error, message }   // exceptions via GlobalExceptionFilter
\```

## State Management
- TanStack Query — all server data (API calls, caching, mutations)
- Zustand — UI state only (modals, sidebar open/close, ephemeral state)
- Never use Zustand to cache API responses

## Core Principles
1. TypeScript strict mode — no `any`, no exceptions
2. Only touch files relevant to current task
3. Run lint + type-check before marking task done
4. Tests required for business logic and all endpoints
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