# 📸 Camera Platform Route Architecture & Layout Overview

## 1. 🧭 Route Groups (Next.js App Router)

- `(website-layout)` — Public marketing and landing pages
- `(auth)` — Authentication flows (sign-in, sign-up)
- `(in-app)` — Protected main camera platform for authenticated users

---

## 2. 🗂️ Main App Structure (`src/app/(in-app)/`)

src/app/(in-app)/
├── page.tsx              # 🏠 Main feed (Instagram-style)
├── create/               # 📤 Create post
├── profile/              # 👤 User profiles
├── camera/               # 📷 Camera functionality
├── gear/                 # 🎥 Gear management
├── search/               # 🔍 Search & discovery
├── map/                  # 🗺️ Location-based features
├── messages/             # 💬 Messaging system
├── app/                  # ⚙️ Dashboard & settings
│   ├── page.tsx         # Dashboard home
│   ├── billing/         # Billing management
│   ├── plan/            # Plan details
│   └── subscribe/       # Subscription flow
└── layout.tsx           # App layout wrapper

---

## 3. 🔑 Key Features by Route

| Route        | Description                                 |
|--------------|---------------------------------------------|
| `/`          | Social feed (main entry point)              |
| `/create`    | Photo upload & gear linking                 |
| `/profile`   | User profiles & gear listings               |
| `/camera`    | Camera interface                            |
| `/gear`      | Gear management & rental                    |
| `/search`    | Discover gear & users                       |
| `/map`       | Location-based gear discovery               |
| `/messages`  | In-app messaging                            |
| `/app`       | Dashboard & account settings                |

---

## 4. 🔐 Authentication Flow

- **Unauthenticated** → `(website-layout)` (landing page)
- **Sign in** → `(auth)` pages
- **Authenticated** → `(in-app)` (main app experience)

---

## 5. 🧱 Layout Hierarchy

Root Layout (Providers, Analytics)
├── Website Layout (Header, Footer)
├── Auth Layout (Minimal)
└── App Layout (Bottom Nav, App Header)
    ├── Main Feed
    ├── Create Post
    ├── Profile Pages
    └── Dashboard/Settings

---

## ✅ What This Achieves

- **Seamless UX** — Feed is the main entry point (`/`)
- **Clear Separation** — Marketing vs App vs Auth
- **Mobile-First** — Bottom navigation for core features
- **Scalable** — Easy to add new features and routes
- **Consistent** — All app features share unified layout and styling

## 🔧 Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Query + local state via Zustand or Jotai
- **Auth**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for media uploads)
- **Hosting**: Vercel (frontend) + Supabase (backend)
- **Payments**: Stripe
- **Search**: Supabase full-text search (Postgres) or Meilisearch

## 🗃️ Data Layer Assumptions

- All user, gear, and rental data is stored in Supabase tables.
- Supabase Row Level Security (RLS) is enabled for protected access.
- Media uploads (photos, gear images) use Supabase Storage with public/private buckets.
- Authenticated users are identified via Supabase `user.id`.
- Gear listings are linked to users via foreign key (`gear.owner_id → user.id`).
- Rentals are tracked via a `rentals` table with status enums (`pending`, `active`, `completed`).

## 🎨 Design Principles

- **Mobile-first**: Bottom navigation and responsive layouts prioritized.
- **Creator-centric**: UX optimized for photographers and gear owners.
- **Modular**: Components and routes are organized by feature domain.
- **Scalable**: New features can be added without breaking layout or auth flows.
- **Accessible**: All UI components follow WCAG guidelines and use semantic HTML.

## 🧱 Component Conventions

- All components live in `/src/components/[feature]/`
- Shared UI primitives live in `/src/components/ui/`
- Hooks follow `use[Feature]` naming and live in `/src/hooks/`
- Supabase client is initialized in `/src/lib/supabase.ts`
- API calls are abstracted in `/src/lib/api/[feature].ts`