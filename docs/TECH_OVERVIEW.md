## 📸 Camera Platform — Technical Overview

This document codifies architecture, conventions, and operational practices for the camera platform. It is the source of truth for structure, auth, data, and feature development patterns.

---

## 1. 🧭 Route Groups (Next.js App Router)

- `(website-layout)` — Public marketing and landing pages
- `(auth)` — Authentication flows (sign-in, sign-up, callback)
- `(in-app)` — Protected main app for authenticated users

Routing is file-system based and uses Next.js App Router conventions. Public pages must remain isolated from app-only features.

---

## 2. 🗂️ App Structure (`src/app/(in-app)/`)

```
src/app/(in-app)/
├── app/                  # ⚙️ Dashboard & settings
│   ├── page.tsx          # Dashboard home
│   ├── billing/          # Billing management
│   ├── plan/             # Plan details
│   └── subscribe/        # Subscription flow
├── create/               # 📤 Create post
├── profile/              # 👤 User profiles
├── camera/               # 📷 Camera functionality
├── gear/                 # 🎥 Gear management
├── search/               # 🔍 Search & discovery
├── map/                  # 🗺️ Location-based features
├── messages/             # 💬 Messaging system
├── app/page.tsx          # 🏠 Social feed (Instagram-style)
└── layout.tsx            # App layout wrapper (bottom nav, header)
```

Notes
- Main feed is currently at `/app` (not `/`). Marketing home remains at `/`.
- Bottom navigation highlights primary app routes (Home, Search, Map, Messages, Profile).

---

## 3. 🔑 Key Routes

| Route        | Description                                 |
|--------------|---------------------------------------------|
| `/`          | Public landing page (marketing)              |
| `/app`       | Social feed (main in-app entry point)        |
| `/create`    | Photo upload & gear linking                  |
| `/profile`   | User profiles & gear listings                |
| `/camera`    | Camera interface                             |
| `/gear`      | Gear management & rental                     |
| `/search`    | Discover gear & users                        |
| `/map`       | Location-based gear discovery                |
| `/messages`  | In-app messaging                             |

---

## 4. 🔐 Authentication

- Provider: Supabase Auth (OAuth + Email OTP)
- Browser client: `src/lib/supabase/browser.ts`
- Server client: `src/lib/supabase/server.ts` (via `next/headers` cookies)
- Callback route: `/auth/callback` (refreshes session then redirects)
- Sign-in/Sign-up pages: `(auth)/sign-in`, `(auth)/sign-up`

Guidelines
- Use server helper `requireUser()` in server routes/components requiring auth.
- Client components should call `supabaseBrowser()` only; avoid leaking secrets.
- Protect API routes explicitly. Public endpoints must never assume a user.

---

## 5. 📦 Data & Database

- ORM: Drizzle ORM (PostgreSQL)
- Connection: `src/db/index.ts` via `DATABASE_URL`
- Schemas live in `src/db/schema/*`
- Migrations: `drizzle/*` (use `pnpm drizzle-kit push` to apply)

Key Schemas
- `users` — App users (see `src/db/schema/user.ts`)
- `plans` — Subscription plans (quotas, codename)
- `posts`, `post_likes`, `post_comments`, `post_bookmarks` — Social feed
- `gear`, `post_gear` — Gear inventory, linking to posts
- `waitlist` — Public waitlist submissions
- `name_suggestions` — Public naming contest submissions

RLS (Row Level Security)
- Enable RLS per protected table and authorize with Supabase Auth `user.id`.
- Public tables (e.g., `waitlist`, `name_suggestions`) can remain open with validation.

---

## 6. 🧩 API Conventions

- Location: `src/app/api/*`
- Public endpoints: waitlist, name-suggestions, public pages
- Protected endpoints: app/me, feed interactions, user content

Patterns
- Validate payloads with `zod` on every write.
- For protected routes, use a server-side auth guard (e.g., `requireUser()`).
- JSON response shape:
  - Success: `{ data: ..., meta?: ... }` or resource directly when clear
  - Error (4xx/5xx): `{ error: string | zodIssue[] }`

Example (public, simplified)
```ts
// Validates with zod, inserts via db, returns 201
```

---

## 7. 🧱 Layout & UI

- Tailwind CSS + shadcn/ui components
- Respect route groups for layout separation
- Mobile-first with bottom navigation in `(in-app)`

Spacing Utilities (house style)
- Avoid `space-x-*` / `space-y-*`
- Prefer Flex/Grid with `gap-*` (e.g., `flex flex-col gap-4`)

Forms
- Use `react-hook-form` + `zod` schemas (`*.schema.ts`) for validation
- Keep form components reusable and minimal

---

## 8. 🔄 Data Fetching

- SWR for client data fetching (`src/lib/users/useUser.ts` etc.)
- Server components should perform server-side fetching where appropriate
- Cache keys must be stable; invalidate via SWR `mutate`

Guidelines
- Keep fetchers small and colocated by feature (e.g., `src/lib/[feature]`)
- Avoid waterfall requests; batch when feasible

---

## 9. 🧪 Testing & Quality

- Linting: project ESLint config (`pnpm lint`)
- Type-safety: prefer explicit types on exports and public APIs
- Component tests: add as needed (React Testing Library)
- API tests: add integration tests for critical endpoints

---

## 10. 🚀 Environments & Config

Environment Variables
- `DATABASE_URL` — Postgres connection (Drizzle)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (public)

Local Dev
- `.env.local` for local overrides
- Start: `pnpm dev`
- Apply migrations: `pnpm drizzle-kit push`

Deployment
- Frontend: Vercel (includes Next.js functions)
- Backend DB, Auth, Storage: Supabase

---

## 11. 🔐 Access Control

- Server routes must validate auth when required (server-side only)
- Do not trust client-provided `userId`
- Use Supabase access token on server via `@supabase/ssr` cookies context

---

## 12. 🌉 Feature Development Workflow

1) Define schema/migration (Drizzle)
2) Create API routes (zod validate, db access)
3) Build UI (feature components under `src/components/[feature]`)
4) Wire data fetching (SWR or server components)
5) Add navigation + route
6) Test locally, then push migrations and deploy

---

## 13. 🧭 Code Organization

- `src/components/[feature]` — Feature-specific UI
- `src/components/ui` — Reusable UI primitives (shadcn/ui)
- `src/lib/supabase` — Supabase clients (browser/server)
- `src/lib/auth` — Auth utilities (e.g., `requireUser`)
- `src/lib/users` — User data hooks (SWR)
- `src/app/api` — API routes (public/protected)
- `src/db/schema` — Drizzle schema definitions

Naming
- Functions: verbs; variables: meaningful nouns
- Avoid abbreviations; prefer clarity over brevity

---

## 14. 📷 Media & Storage (Planned)

- Use Supabase Storage for uploads (public/private buckets)
- Generate transformed image URLs client-side when needed
- Enforce size/type validation on upload endpoints

---

## 15. 🛡️ Error Handling & Observability

- Log server errors with context (avoid leaking secrets to clients)
- Return zod errors as arrays when validation fails
- Add request IDs in logs for correlation (when applicable)

---

## 16. 📅 Roadmap Alignment

- Keep feature work aligned with `plans.ts` and quotas
- Expose plan details via `/api/app/me` as needed

---

## ✅ Summary Principles

- Clear separation: Website vs Auth vs App
- Supabase Auth for identity; Drizzle for data access
- SWR for client fetching; server components when beneficial
- Strict input validation via zod
- Consistent spacing/layout using `gap-*` utilities

This document evolves with the codebase. Propose improvements via PRs when adding new capabilities.