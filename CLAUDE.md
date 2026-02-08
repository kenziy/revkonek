# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

REV KONEK is a motorcycle rider community platform built with Laravel 12, React 18, Inertia.js, and TypeScript. Features include clubs (formerly groups), emergency SOS, a marketplace, vehicle management, and subscription-based premium tiers.

## Development Commands

```bash
# Full setup (install deps, generate app key, migrate, build)
composer setup

# Development mode (runs Laravel server, queue listener, logs, and Vite concurrently)
composer dev

# Run tests
composer test
php artisan test --filter=TestName  # Run specific test

# Frontend only
npm run dev      # Vite dev server with HMR
npm run build    # TypeScript check + production build

# Database
php artisan migrate
php artisan migrate:fresh --seed    # Reset and seed

# Code formatting
./vendor/bin/pint                   # Laravel Pint (PHP)
```

### Test Credentials (from seeders)

- Admin: `admin@admin.com` / `admin` (has `admin` role)
- User: `test@test.com` / `test` (has `user` role, default password from factory)

### Scheduled Commands

- `php artisan clubs:expire-subscriptions` — runs daily, expires overdue club subscriptions

## Architecture

### Dual Routing: Web (Inertia) + API (Sanctum)

- **Web routes** (`routes/web.php`) use Inertia controllers that return `Inertia::render('Page/Name', $props)` — these drive the React SPA
- **API routes** (`routes/api.php`) load modular files from `routes/api/<feature>.php`, all prefixed `/api/v1`, protected by Sanctum
- **Admin routes** (`routes/admin.php`) registered separately in `bootstrap/app.php` with `['web', 'auth', 'admin']` middleware stack, prefixed `/admin`

### Middleware

Two custom middleware aliases defined in `bootstrap/app.php`:
- `admin` → `EnsureUserIsAdmin` — gates admin panel access
- `feature` → `EnsureFeatureEnabled` — gates features (challenges, match, SOS) via `SystemSetting` model

### Shared Inertia Props

`HandleInertiaRequests` shares to all pages:
- `auth.user`, `auth.is_admin`, `auth.is_premium`, `auth.subscription_tier`, `auth.roles`, `auth.permissions`
- `features.match`, `features.challenges`, `features.sos` (booleans from SystemSetting)
- `flash.success`, `flash.error`

### Backend Structure

- **Models** organized by domain: `app/Models/Club/`, `app/Models/Sos/`, `app/Models/Subscription/`, `app/Models/Profile/`, `app/Models/Shop/`. Core models (`User`, `Vehicle`, `SystemSetting`) live at top level
- **Enums** in `app/Enums/` as PHP string-backed enums. Key ones: `ClubTier` (Free/Pro with feature-gating methods), `ClubRole` (ranked hierarchy with permission methods), `SubscriptionTier` (free/premium)
- **Services** in `app/Services/` — business logic layer (`ClubService`, `ClubSubscriptionService`, `AdminService`, `UserService`). Controllers delegate complex logic to services
- **Controllers**: Web controllers at `app/Http/Controllers/`, admin at `Admin/`, API at `Api/V1/<Feature>/`
- **Policies** in `app/Policies/` — authorization (uses Spatie laravel-permission for RBAC)
- **FormRequests** in `app/Http/Requests/` — validation classes

### Frontend Structure

- **Pages** in `resources/js/Pages/` organized by feature: `Admin/`, `Auth/`, `Challenges/`, `Clubs/`, `Vehicles/`, `Match/`, `SOS/`, `Shop/`, `Profile/`, `Subscription/`, `Notifications/`
- **Layouts**: `AuthenticatedLayout`, `GuestLayout`, `AdminLayout`, `MobileLayout`
- **Components**: `Components/UI/` (Card, Badge, Avatar, SearchBar, EmptyState, FloatingActionButton, ProgressBar, ProBadge), `Components/Form/`, `Components/Admin/`, `Components/Vehicles/`
- **Types**: `types/index.d.ts` (core), `types/club.ts`, `types/vehicle.ts`, `types/admin.ts`
- **Path aliases**: `@/*` → `resources/js/*`, `ziggy-js` → Ziggy route helper
- Uses `clsx` for conditional classNames, `@heroicons/react` for icons, `@headlessui/react` for accessible UI primitives

### Key Domain Concepts

- **Clubs** (renamed from Groups): Have tiers (Free/Pro) via `ClubTier` enum. Pro tier gates features like chat, cover images, custom themes, analytics. Club subscriptions are separate from user subscriptions
- **Vehicles** (replaced Garage/Bikes): Multi-vehicle support with photos, mods, social links, layout templates, pro customization. Legacy `/garage` routes redirect to `/vehicles`
- **Feature flags**: Match, Challenges, SOS can be toggled via `SystemSetting` and gated by `feature` middleware
- **Dual subscription system**: User-level (`SubscriptionTier`: free/premium) and Club-level (`ClubTier`: Free/Pro) with coupons

### Tailwind Theme

- Dark mode via `class` strategy, toggled by `ThemeToggle` component
- Custom semantic colors: `primary`, `secondary`, `accent`, `danger`, `success` (each with 50-950 shades)
- Custom fonts: `font-racing` (Orbitron) for headings, `font-sans` (Figtree) for body
- Mobile-first with safe area insets and 44px min touch targets

### Legacy Route Redirects

- `/garage` → `/vehicles`, `/groups` → `/clubs` (redirects defined in `routes/web.php`)

### Database

MySQL in production, SQLite in-memory for testing. FK rename pattern when renaming tables: drop FK → rename table → rename column → re-add FK (requires separate `Schema::table()` calls in MySQL).
