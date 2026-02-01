# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

REV KONEK is a motorcycle rider community platform built with Laravel 12 and React. Features include challenge/racing competitions, group rides, emergency SOS assistance, a marketplace for parts/services, rider matchmaking, and subscription-based premium features.

## Development Commands

```bash
# Full setup (install deps, generate app key, migrate, build)
composer setup

# Development mode (runs Laravel server, queue listener, logs, and Vite concurrently)
composer dev

# Run tests
composer test
php artisan test                    # Alternative
php artisan test --filter=TestName  # Run specific test

# Frontend only
npm run dev      # Vite dev server with HMR
npm run build    # Production build

# Database
php artisan migrate
php artisan migrate:fresh --seed    # Reset and seed

# Code formatting
./vendor/bin/pint                   # Laravel Pint (PHP linting)
```

## Architecture

### Backend Structure (Laravel)

- **app/Models/** - Eloquent models organized by domain subdirectories (Auth/, Profile/, Challenge/, Group/, Shop/, Sos/, Subscription/, Match/, Notification/)
- **app/Services/** - Business logic services matching model domains
- **app/Http/Controllers/Api/V1/** - RESTful API v1 controllers organized by feature
- **app/Http/Requests/** - Form request validation classes
- **app/Http/Resources/** - JSON API response transformers
- **app/Enums/** - Domain enums (BikeCategory, ChallengeStatus, GroupRole, SosStatus, etc.)
- **app/Policies/** - Authorization policies
- **routes/api/** - Modular API route files (auth.php, challenges.php, groups.php, shops.php, sos.php, etc.)

### Frontend Structure (React + TypeScript)

- **resources/js/Pages/** - Inertia page components organized by feature (Auth/, Challenges/, Groups/, Shop/, SOS/, Match/, Profile/, etc.)
- **resources/js/Components/** - Reusable components (Form/, UI/ subdirectories)
- **resources/js/Layouts/** - Layout components (AuthenticatedLayout, GuestLayout, MobileLayout)
- **resources/js/types/** - TypeScript type definitions
- Path alias: `@/*` maps to `resources/js/*`

### Key Patterns

- **API versioning**: All API routes prefixed with `/api/v1`
- **Authentication**: Laravel Sanctum for token-based API auth, Inertia handles web sessions
- **Authorization**: Spatie laravel-permission for RBAC, Policy classes for resource authorization
- **Routing**: Inertia.js bridges Laravel routing with React SPA - routes defined in `routes/web.php`, components in `resources/js/Pages/`
- **Forms**: Dedicated FormRequest classes in `app/Http/Requests/` handle validation
- **2FA**: Google2FA with QR codes and recovery codes

### Database

60+ migrations covering: users/auth, profiles/bikes, challenges/disputes, matchmaking, SOS/emergency, groups/events, marketplace/shops, subscriptions. Uses MySQL in production, SQLite for testing.
