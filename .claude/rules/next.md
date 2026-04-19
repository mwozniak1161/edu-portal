# Next.js Rules (apps/web)

- Use App Router only — no Pages Router patterns
- Server Components by default; add `"use client"` only when needed
- Data fetching in Server Components or via React Query on client
- All routes in `app/` follow the `(group)/page.tsx` convention
- Shared UI components live in `components/`, page-specific in `_components/` co-located
- Use `next/image` for all images, `next/font` for fonts
- Tailwind only — no inline styles, no CSS modules unless exceptional case
- Form handling with react-hook-form + zod validation
- Server Actions for mutations
- Skeletons for loading states