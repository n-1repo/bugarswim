# Bugar Swim

Web app for managing a swimming & hydrotherapy club: membership, class
scheduling, attendance, billing, cash ledger, coach payroll, and promo
announcements — plus a public landing page for prospective members.

**Live:** https://bugarswim.vercel.app

Stack: Next.js (App Router) + TypeScript, Supabase (Postgres + Row Level
Security), Tailwind CSS, deployed on Vercel.

## Portals

- **Public landing page** (`/`) — programs, pricing, and benefits pulled
  live from the database, with a CTA into the login page.
- **Admin** — members, coaches, schedule/roster, packages, subscriptions,
  invoices, cash ledger, coach payroll, promo, locations/class types, and a
  reports dashboard (revenue, cash flow, outstanding invoices).
- **Coach** — own class schedule and attendance marking.
- **Parent** — children's schedule/attendance, invoices, and active promos.

Every account is created by an admin (no public sign-up); each role only
sees what it's allowed to via Postgres RLS.

## Requirements

- Node.js 20+
- A Supabase project (Postgres + Row Level Security)

## Local setup

1. Create a Supabase project and enable the `pgcrypto`, `btree_gist`,
   `pg_trgm` extensions (the first migration does this automatically if the
   project allows it).
2. Apply the SQL migrations in `supabase/migrations/` in order (Supabase
   CLI, `supabase db push`, or paste them into the SQL editor in order).
3. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project
     Settings → API.
   - `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API (server-only).
   - `SUPABASE_JWT_SECRET` — Project Settings → API → JWT Keys (legacy
     HS256 shared secret; required since auth is custom, see below).
   - `NEXT_PUBLIC_CLUB_NAME` — optional display name (defaults to
     "Bugarswim").
4. Seed the first admin account:
   ```bash
   SEED_ADMIN_EMAIL=admin@example.com SEED_ADMIN_PASSWORD=ChangeMe123 npm run seed:admin
   ```
5. `npm run dev` and log in at `/login`.

## Auth

Authentication is custom (bcrypt + a self-signed JWT), not Supabase Auth —
the JWT carries the user's role and is verified by Postgres RLS on every
request, so access control lives in the database, not just the app.

## Current status & scope

Single-tenant: one deployment and one Supabase project per club. Reusing
this codebase for a different club means a separate deployment (its own
Supabase project, env vars, and brand colors in `app/globals.css`), not
adding them to this one.

Not yet built: self-service password reset, automated email/SMS/WhatsApp
notifications, online payment gateway integration (payments are recorded
manually), parent self-service booking, and data export (CSV/PDF).

## Major changelog

- **Public landing page** — programs, pricing, and benefits sourced from
  the live database, with brand-accurate styling.
- **Pricelist alignment** — class types and packages reconciled with the
  club's actual pricelist (naming, pricing, session counts, validity).
- **Design system overhaul** — the whole app (admin/coach/parent portals,
  login) reskinned to match the landing page's navy & gold Bugar Swim
  identity, on shared design tokens.
- **Modal-based management** — creating promos/subscriptions and managing
  members, coaches, and class rosters now happens in modals instead of
  dedicated pages.
- **Interaction polish** — hover/active/focus states, smooth-scrolling CTA
  navigation, and subtle motion across buttons and navigation.
- **Landing ↔ login flow** — clear navigation between the public site and
  the login page in both directions.
- **Light/dark mode** — app-wide theme toggle, persisted per user, with a
  system-preference default.
