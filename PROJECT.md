# SouthEast Properties — Project Reference

> **Living document.** Update this file whenever architecture, dependencies, conventions, or infrastructure change. Any agent or developer should be able to read this and understand the entire project.

**Last updated:** 2026-08-28
**Current branch:** `develop` → merges to `main`
**Repository:** https://github.com/shemaKaita/SouthEastPropv2.git

---

## 1. What This Is

A marketing website for **SouthEast Properties**, a Cape Town-based real estate company offering co-living spaces and landlord services. Features property listings, contact forms, an interactive map, and a full CMS admin dashboard for managing content.

The site now includes a **PostgreSQL database** (via Prisma ORM) powering property management, form submission persistence, and editable site content. An **admin dashboard** at `/admin` provides CRUD operations for all entities.

**Integration points still not implemented:** Email service, CRM API, Sentry error tracking.

---

## 2. Tech Stack

| Layer           | Technology                                            | Version                      |
| --------------- | ----------------------------------------------------- | ---------------------------- |
| Framework       | Next.js (App Router)                                  | 16.3.0                       |
| UI library      | React                                                 | 19.2.8                       |
| Language        | TypeScript                                            | ^5                           |
| Styling         | Tailwind CSS                                          | v4 (`@tailwindcss/postcss`)  |
| Icons           | lucide-react                                          | ^1.34.0                      |
| Maps            | Leaflet + react-leaflet                               | 1.9.4 / ^5.0.0               |
| Fonts           | Geist + Geist Mono (Google Fonts via `next/font`)     | —                            |
| Linting         | ESLint (flat config) + eslint-config-next             | ^9 / 16.3.0                  |
| Formatting      | Prettier + prettier-plugin-tailwindcss                | ^3.9.6 / ^0.8.1              |
| Build analysis  | @next/bundle-analyzer                                 | ^16.3.2                      |
| E2E testing     | Playwright (installed, not yet configured with tests) | ^1.62.1                      |
| Runtime         | Node.js                                               | 22 (Docker `node:22-alpine`) |
| Deployment      | Railway (Docker multi-stage, standalone output)       | —                            |
| Package manager | npm (lockfile: `package-lock.json`)                   | —                            |

### Key Next.js Configuration (`next.config.ts`)

- `output: "standalone"` — produces minimal server for Docker.
- `images.formats: ["image/avif", "image/webp"]` — modern image formats.
- `images.remotePatterns` — allows `images.unsplash.com` (all property images).
- **Security headers** applied to `/(.*)` route:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - **CSP** (Content-Security-Policy):
    - `default-src 'self'`
    - `script-src 'self' 'unsafe-inline'` + `'unsafe-eval'` **only in development** (`isDev` conditional)
    - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
    - `font-src 'self' https://fonts.gstatic.com`
    - `img-src 'self' data: blob: https://images.unsplash.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com`
    - `connect-src 'self' https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com`
    - `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`
- Bundle analyzer enabled when `ANALYZE=true`.

> ⚠️ **CSP 'unsafe-eval' caveat:** React dev mode requires `eval()` for stack reconstruction. The `isDev` flag conditionally adds `'unsafe-eval'` to `script-src`. Production CSP stays strict. If you change this, test in dev mode — React will throw "Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source" otherwise.

### TypeScript Configuration (`tsconfig.json`)

- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- `moduleResolution: "bundler"`
- Path alias: `@/*` → `./src/*`
- Target: ES2022

### ESLint Configuration (`eslint.config.mjs`)

- Flat config (ESLint 9).
- Extends `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.
- **`no-console: error`** globally — enforced.
- Override: `no-console: off` for `src/lib/logger.ts` and `scripts/**/*.ts` (these are the only files allowed to use `console.*`).
- Global ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`.

---

## 3. Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (async — reads theme cookie)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles + design tokens + Leaflet CSS
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   ├── robots.ts                 # robots.txt generation
│   ├── sitemap.ts                # sitemap.xml generation
│   ├── manifest.ts               # PWA manifest
│   ├── contact/page.tsx          # Contact page
│   ├── landlords/page.tsx        # Landlord services page
│   ├── locations/                # Locations page (with map)
│   │   ├── page.tsx
│   │   └── error.tsx             # Route-level error boundary
│   ├── our-story/page.tsx        # About page
│   └── properties/[slug]/        # Dynamic property detail pages
│       ├── page.tsx
│       └── loading.tsx           # Loading skeleton
├── actions/                      # Server actions ("use server")
│   ├── contact.ts                # submitContactForm()
│   ├── enquiry.ts                # submitEnquiryForm()
│   └── landlord.ts               # submitLandlordForm()
├── components/
│   ├── Navbar.tsx                # Top nav with mobile menu + theme toggle
│   ├── Footer.tsx                # Site footer
│   ├── Hero.tsx                  # Home hero section
│   ├── PropertyCarousel.tsx      # Property carousel on home
│   ├── PropertyMap.tsx           # Server wrapper for map (dynamic import)
│   ├── PropertyMapView.tsx       # Client-side Leaflet map (locations page)
│   ├── WhyChooseUs.tsx            # Home features section
│   ├── ThemeProvider.tsx         # Theme context (light/dark)
│   ├── Button.tsx                # Reusable button component
│   ├── Logo.tsx                  # Brand logo
│   ├── ContactForm.tsx           # Contact form (uses useFormState)
│   ├── EnquireNowForm.tsx        # Property enquiry form
│   ├── LandlordEnquiryForm.tsx   # Landlord signup form
│   └── ui/
│       ├── formStyles.ts         # Shared Tailwind class strings for forms
│       ├── FormField.tsx          # Reusable input field
│       ├── FormSelect.tsx         # Reusable select field
│       ├── FormSuccess.tsx       # Success message component
│       └── SectionLabel.tsx      # Eyebrow/section label component
├── data/
│   └── properties.ts             # Static property data (5 listings)
├── hooks/
│   ├── useFormState.ts           # Generic form state hook
│   ├── useBodyScrollLock.ts      # Lock body scroll (mobile menu)
│   ├── useMounted.ts             # Mounted state (hydration safety)
│   └── useScrollPosition.ts      # Scroll position tracking
├── lib/
│   ├── constants.ts              # NAV_ITEMS, SOCIAL_LINKS, CONTACT_DETAILS
│   ├── site.ts                   # SITE_URL, SITE_NAME, SITE_DESCRIPTION
│   ├── properties.ts             # Data access layer (async + sync)
│   ├── logger.ts                 # logError(), logInfo() — Sentry integration point
│   ├── rateLimit.ts              # In-memory sliding-window rate limiter
│   ├── sanitize.ts               # sanitizeForLog(), sanitizeObjectForLog()
│   ├── validation.ts             # EMAIL_REGEX, isValidEmail(), validateRequired()
│   └── social.ts                 # SOCIAL_ICONS, CONTACT_ICONS mappings
├── types/
│   ├── property.ts               # Property, Amenity, AmenityIcon types
│   └── forms.ts                  # Form data types + ActionResult
└── scripts/
    ├── capture-screenshots.ts    # Screenshot automation
    └── verify-popup.ts           # Popup verification
```

### Also in root:

- `Dockerfile` — 3-stage build (deps → builder → runner)
- `railway.toml` — Railway deployment config with healthcheck
- `postcss.config.mjs` — Tailwind PostCSS plugin
- `eslint.config.mjs` — ESLint flat config
- `reports/` — Audit reports (UI, codebase, performance)
- `screenshots/` — Captured screenshots (dark/light, desktop/tablet/mobile)
- `public/team/` — Team member photos

---

## 4. Architecture & Patterns

### Rendering Strategy

- **Pages are dynamically rendered** (`ƒ` not `○`) because `layout.tsx` calls `await headers()` to read the theme cookie server-side. This was a deliberate tradeoff — see Theme System below.
- Property pages use `generateStaticParams` (SSG at build time, but wrapped in dynamic layout).

### Data Flow

```
src/data/properties.ts  (static array)
        ↓
src/lib/properties.ts  (repository — async + sync accessors)
        ↓
Server components / server actions
        ↓
Client components (via props)
```

**Rule:** Components and actions import from `@/lib/properties`, **never** from `@/data/properties` directly. This is the repository pattern — swapping to a database/CMS requires changes only in `lib/properties.ts`.

### Server Actions

All three forms follow the same pattern:

1. Read IP from `x-forwarded-for` header
2. Rate limit via `rateLimit()` (5 requests / 10 minutes per IP per form type)
3. Validate required fields + email format
4. Log submission (sanitized via `sanitizeObjectForLog`)
5. Return `ActionResult` (`{ success, message, errors? }`)

**Integration points** (not yet implemented):

- Email service (Resend, SendGrid)
- CRM API
- Database persistence

### Theme System (Critical — Read Carefully)

The theme system has three layers. **All three must work together** or the theme reverts on refresh (especially on iOS Safari).

1. **Server-side cookie read** (`layout.tsx`):
   - `RootLayout` is `async`, calls `await headers()`, reads `cookie` header.
   - If `theme=dark` found, adds `dark` class to `<html>` in server-rendered HTML.
   - This ensures the `dark` class survives React hydration (inline-script-only approach fails because React reconciles className back to server version).

2. **Inline FOUC-prevention script** (`layout.tsx` `<head>`):

   ```js
   try {
     const t =
       localStorage.getItem("theme") ||
       (document.cookie.match(/(?:^|;\s*)theme=(dark|light)/) || [])[1];
     if (
       t === "dark" ||
       (!t && matchMedia("(prefers-color-scheme: dark)").matches)
     )
       document.documentElement.classList.add("dark");
   } catch {}
   ```
   - Runs before hydration. Reads localStorage **or** cookie (fallback for iOS Safari ITP).
   - Falls back to `prefers-color-scheme` if no stored preference.

3. **ThemeProvider** (`components/ThemeProvider.tsx`):
   - Client component. Uses `useSyncExternalStore` to track the `dark` class on `<html>` via `MutationObserver`.
   - `applyTheme()` sets: DOM class → **cookie first** (always, before try) → localStorage (in try/catch, may throw on iOS Safari).
   - Cookie is set **before** the try block so it always succeeds even if `localStorage.setItem` throws.

> ⚠️ **iOS Safari ITP:** `localStorage.setItem` throws in private mode / ITP contexts. The cookie must be set **before** the try/catch, not inside it. If you move the cookie inside try, theme reverts on navigation.

> ⚠️ **className space bug:** The `<html>` className must have a space before `dark` (e.g., `antialiased dark`, not `antialiaseddark`). The current implementation uses `array.join(" ")` to be Prettier-safe. Do not revert to template literal concatenation without ensuring the space.

### Design System

**Dark mode:** Class-based via `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css`. NOT `prefers-color-scheme` media query.

**Design tokens** (CSS custom properties in `globals.css`):

| Token                   | Light     | Dark                     | Purpose                    |
| ----------------------- | --------- | ------------------------ | -------------------------- |
| `--bg-base`             | `#ffffff` | `#091229`                | Page background            |
| `--bg-surface`          | `#f8fafc` | `#0e1a38`                | Card background            |
| `--text-primary`        | `#12285a` | `#f8fafc`                | Headings                   |
| `--text-secondary`      | `#475569` | `#cbd5e1`                | Body copy                  |
| `--brand-navy`          | `#12285a` | `#12285a`                | Structural blue (constant) |
| `--accent-yellow`       | `#fbbf24` | `#fcd34d`                | CTA / highlights           |
| `--accent-yellow-hover` | `#fcd34d` | `#fbbf24`                | Hover state                |
| `--border-subtle`       | `#e2e8f0` | `rgba(255,255,255,0.15)` | Dividers                   |

**Backward-compatible aliases:** `--background`, `--foreground`, `--color-primary`, `--color-primary-surface`, `--color-secondary` map to the above.

**`@theme inline` block** exposes these as Tailwind utilities: `bg-bg-base`, `text-text-primary`, `border-border-subtle`, `bg-accent-yellow`, etc.

**Form styling** (`components/ui/formStyles.ts`): Shared class strings — `inputClassName`, `selectClassName`, `labelClassName`, `errorClassName`, `serverErrorClassName`, `submitButtonClassName`. All forms use these; do not inline form classes.

### Leaflet Map

- `PropertyMap.tsx` — Server component wrapper using `next.dynamic` with `ssr: false`.
- `PropertyMapView.tsx` — Client component with react-leaflet.
- Leaflet CSS extracted from the component into `globals.css` (Phase 3 optimization).
- **z-index containment:** All Leaflet elements forced to `z-index: 5 !important` in `globals.css` to stay below navbar (`z-50`) and mobile menu (`z-[100]`).
- Map tiles from OpenStreetMap and CartoDB (allowed in CSP `img-src` and `connect-src`).

---

## 5. Forms

Three forms, all using the `useFormState` hook:

| Form             | Component                 | Server Action        | Data Type          |
| ---------------- | ------------------------- | -------------------- | ------------------ |
| Contact          | `ContactForm.tsx`         | `submitContactForm`  | `ContactFormData`  |
| Property Enquiry | `EnquireNowForm.tsx`      | `submitEnquiryForm`  | `EnquiryFormData`  |
| Landlord Signup  | `LandlordEnquiryForm.tsx` | `submitLandlordForm` | `LandlordFormData` |

### `useFormState` Hook (`hooks/useFormState.ts`)

Generic form state management:

- Single state object for all fields
- Sync/async validation support
- Status tracking: `idle` | `submitting` | `success` | `error`
- Field-level + form-level errors
- Auto-clears field error on edit
- `reset()` returns to initial values

### Form Types (`types/forms.ts`)

```typescript
ContactFormData    { name, email, subject, message }
EnquiryFormData    { name, email, moveInDate, message, propertySlug }
LandlordFormData   { name, email, phone, location, propertyType, units }
ActionResult<T>    { success, message, data?, errors? }
```

---

## 5.5. CMS / Admin Dashboard

The site includes a full CMS admin dashboard at `/admin` for managing property listings, viewing form submissions, and editing site content.

### Database (PostgreSQL + Prisma 7)

- **ORM:** Prisma 7.10 with `@prisma/adapter-pg` driver adapter
- **Config:** `prisma.config.ts` (Prisma 7 moves datasource URL here from schema)
- **Schema:** `prisma/schema.prisma` — 7 models:
  - `Property` — listings with amenities (JSON), gallery images (String[]), geo coords
  - `User` — admin users with bcrypt-hashed passwords, roles (ADMIN/EDITOR)
  - `ContactSubmission`, `EnquirySubmission`, `LandlordSubmission` — form data with IP and timestamp
  - `SiteContent` — key/value JSON store for editable nav, social, contact details
- **Client singleton:** `src/lib/prisma.ts` — global instance in dev to prevent hot-reload connection exhaustion
- **Seed script:** `prisma/seed.ts` — seeds properties from existing static data, creates admin user, populates site content

### Authentication

- **Session:** iron-session v8 — encrypted, stateless, httpOnly cookies
- **Password hashing:** bcryptjs with cost factor 12
- **Middleware:** `src/middleware.ts` protects `/admin/*` (cookie presence check)
- **Server-side guard:** `requireAuth()` in all admin server actions
- **Login:** `/admin/login` — rate-limited (5 attempts / 10 min), generic error messages to prevent enumeration
- **Session cookie:** `sep_admin_session`, 7-day maxAge, `sameSite=strict`, `secure` in production

### Admin Routes

```
src/app/admin/
├── layout.tsx              # Admin shell (sidebar, auth guard)
├── page.tsx                # Dashboard overview (real counts from DB)
├── login/page.tsx          # Login form
├── properties/
│   ├── page.tsx            # Property list (table view)
│   ├── new/page.tsx        # Create property
│   └── [id]/edit/page.tsx  # Edit property
├── submissions/
│   └── [type]/page.tsx     # Contact/enquiry/landlord submissions
└── settings/page.tsx       # Edit nav, social, contact (JSON editor)
```

### Admin Server Actions

| Action                                                                 | File                           | Purpose                           |
| ---------------------------------------------------------------------- | ------------------------------ | --------------------------------- |
| `loginAction`, `logoutAction`                                          | `actions/admin/auth.ts`        | Authentication                    |
| `createPropertyAction`, `updatePropertyAction`, `deletePropertyAction` | `actions/admin/properties.ts`  | Property CRUD with zod validation |
| `getSubmissions`, `deleteSubmissionAction`                             | `actions/admin/submissions.ts` | Submission management             |
| `getSiteContent`, `updateSiteContentAction`                            | `actions/admin/settings.ts`    | Content management                |

### Site Content (DB-backed with cache)

- `src/lib/site-content.ts` — reads nav, social, contact from `SiteContent` table
- 1-minute TTL module-level cache
- Falls back to hardcoded `constants.ts` defaults when DB unavailable
- `Footer` component uses DB-backed content (async server component)
- `clearContentCache()` called after admin settings update

### Form Submission Persistence

All three public forms now persist to PostgreSQL:

- `submitContactForm` → `ContactSubmission` table
- `submitEnquiryForm` → `EnquirySubmission` table
- `submitLandlordForm` → `LandlordSubmission` table
- All submissions store client IP for audit trail
- Visible in admin panel at `/admin/submissions/{type}`

### Testing

- **Unit tests:** Vitest with jsdom — 106 tests covering lib, hooks, and all server actions
- **Coverage:** 82% statements, 72% branches, 75% functions (threshold: 70%)
- **E2E tests:** Playwright — auth flow, public page loads, contact form
- **Run:** `npm run test` (unit), `npm run test:coverage` (with coverage), `npm run test:e2e` (E2E)

### Cyclomatic Complexity Linting

ESLint enforces complexity rules (error-level for new code):

- `complexity`: max 10 decision points per function
- `max-depth`: max 4 nesting levels
- `max-params`: max 3 parameters
- Pre-existing code with violations is exempted in `eslint.config.mjs`

---

## 6. Environment Variables

| Variable               | Required             | Default                 | Used In                                            |
| ---------------------- | -------------------- | ----------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** (production) | `http://localhost:3000` | `lib/site.ts` → metadata, sitemap, robots, OG tags |
| `DATABASE_URL`         | **Yes**              | —                       | Prisma ORM (Postgres connection string)            |
| `SESSION_SECRET`       | **Yes**              | —                       | iron-session encryption (min 32 chars)             |
| `ADMIN_EMAIL`          | Seed only            | `admin@southeast...`    | `prisma/seed.ts` — default admin user              |
| `ADMIN_PASSWORD`       | Seed only            | —                       | `prisma/seed.ts` — default admin password          |
| `NODE_ENV`             | Auto                 | —                       | CSP `unsafe-eval` conditional, logger              |
| `ANALYZE`              | Optional             | —                       | `next.config.ts` bundle analyzer                   |

Set `NEXT_PUBLIC_SITE_URL` to the production URL (e.g., `https://southeastproperties.co.za`) in Railway env vars. This affects SEO (canonical URLs, sitemap, OG metadata).

Generate `SESSION_SECRET` with: `openssl rand -hex 32`

---

## 7. Build & Deploy

### Local Development

```bash
npm run dev            # Next.js dev server (Turbopack)
npm run build          # Production build
npm run start          # Start production server (needs build first)
npm run lint           # ESLint
npm run format         # Prettier write
npm run format:check   # Prettier check (CI)
npm run analyze        # Bundle analyzer (ANALYZE=true)
npm run test           # Run unit tests (Vitest)
npm run test:coverage  # Run tests with coverage report
npm run test:e2e       # Run E2E tests (Playwright)
npm run db:generate    # Generate Prisma client
npm run db:migrate:dev # Create and apply migration (dev)
npm run db:migrate:deploy # Apply pending migrations (prod)
npm run db:seed        # Seed database from existing data
npm run db:studio      # Open Prisma Studio GUI
```

### Docker Build (3 stages)

1. **deps** — `npm ci` (full node_modules including devDeps)
2. **builder** — `prisma generate` + `npm run build` (produces `.next/standalone`)
3. **runner** — Minimal image: standalone server + static assets + Prisma client, non-root user (`nextjs:nodejs`), `PORT=3000`, `HOSTNAME=0.0.0.0`, includes `openssl` for Prisma engine, `HEALTHCHECK` directive, entrypoint runs `prisma migrate deploy` before `node server.js`

### Railway Deployment

- Uses the Dockerfile directly.
- Healthcheck: `GET /`, 30s timeout, 10s interval.
- Restart policy: `ON_FAILURE`, max 3 retries.
- Set `NEXT_PUBLIC_SITE_URL` in Railway env vars.

### Pre-Commit Checklist

1. `npm run lint` — must pass (0 errors, complexity rules enforced)
2. `npm run test` — must pass all unit tests
3. `npm run format` — Prettier formatting (run before committing to avoid formatting-only diffs)
4. `npm run build` — must compile without errors
5. Test theme toggle on iOS Safari (both navigation and refresh) — this has been a recurring bug source.

---

## 8. Git Workflow

- **`main`** — Production branch. Merged from `develop`.
- **`develop`** — Active development branch.
- **Feature branches** — Named by phase: `fix/phase1-*`, `chore/phase2-*`, `perf/phase3-*`, etc.
- PRs merged into `develop`, then `develop` → `main`.

### Recent History (Audit Phases)

The project underwent a 10-phase comprehensive audit (2026-08-16 to 2026-08-25):

| Phase | PR  | Focus                                         | Status           |
| ----- | --- | --------------------------------------------- | ---------------- |
| 1     | #6  | Dead code removal, repository pattern         | ✅ Merged        |
| 2     | #8  | Dependencies, tooling, tsconfig               | ✅ Merged        |
| 3     | #9  | Performance, CWV, image optimization          | ✅ Merged        |
| 4     | #10 | SEO, metadata, structured data                | ✅ Merged        |
| 5     | #11 | Accessibility (WCAG 2.2 AA)                   | ✅ Merged        |
| 6     | #12 | Code quality, DRY                             | ⏳ Pending merge |
| 7     | #13 | Security headers, rate limiting, sanitization | ✅ Merged        |
| 8     | #14 | Build/deploy config                           | ⏳ Pending merge |
| 9     | #15 | Design system tokens                          | ✅ Merged        |
| 10    | —   | Image optimization (done in Phase 3)          | ✅               |

Post-audit fixes:

- `2115297` — CSP `unsafe-eval` in dev mode
- `bd7510e` — Theme persistence cookie fix (iOS Safari)
- `fcf0c0c` — Server-side theme cookie read (hydration)
- `510daea` — Space before `dark` class (className bug)

### CMS Build Phases (2026-08-28)

| Phase | PR  | Branch                        | Focus                                          | Status           |
| ----- | --- | ----------------------------- | ---------------------------------------------- | ---------------- |
| 1     | #21 | `feat/cms-phase1-database`    | PostgreSQL + Prisma 7 + complexity linting     | ⏳ Pending merge |
| 2     | #22 | `feat/cms-phase2-auth`        | iron-session auth + login + middleware         | ⏳ Pending merge |
| 3     | #23 | `feat/cms-phase3-dashboard`   | Property CRUD + submissions + settings UI      | ⏳ Pending merge |
| 4     | #24 | `feat/cms-phase4-submissions` | Form submission persistence to DB              | ⏳ Pending merge |
| 5     | #25 | `feat/cms-phase5-content`     | DB-backed site content with cache              | ⏳ Pending merge |
| 6     | #26 | `feat/cms-phase6-testing`     | Vitest unit tests + Playwright E2E (106 tests) | ⏳ Pending merge |
| 7     | #27 | `feat/cms-phase7-deploy`      | Docker hardening + Railway config              | ⏳ Pending merge |

**Merge order:** #21 → #22 → #23 → #24 → #25 → #26 → #27 → `develop` → `main`

---

## 9. Conventions

### Code Style

- **Prettier** with `prettier-plugin-tailwindcss` — run `npm run format` before committing.
- No `console.*` except in `lib/logger.ts` and `scripts/`.
- Use `logError()` / `logInfo()` from `@/lib/logger` everywhere else.
- TypeScript strict mode — no `any` without justification.
- Path alias `@/*` for all `src/` imports.

### Component Conventions

- Server components by default. Add `"use client"` only when needed (state, effects, browser APIs).
- Reusable form styling: import from `@/components/ui/formStyles.ts`.
- Shared constants: `NAV_ITEMS`, `SOCIAL_LINKS`, `CONTACT_DETAILS` from `@/lib/constants.ts`.
- Icon mappings: `SOCIAL_ICONS`, `CONTACT_ICONS` from `@/lib/social.ts`.
- Section labels: use `<SectionLabel>` from `@/components/ui/SectionLabel.tsx` (replaces 13 inline instances).

### CSS Conventions

- Use design tokens via `var(--token-name)` in arbitrary values: `bg-[var(--bg-surface)]`, `text-[var(--text-primary)]`.
- Dark mode variants: `dark:` prefix (class-based, not media query).
- Leaflet overrides live in `globals.css`, not component files.

### Server Action Conventions

- Always `"use server"` at top.
- Rate limit via `rateLimit(identifier, FORM_RATE_LIMIT.maxRequests, FORM_RATE_LIMIT.windowMs)`.
- Sanitize before logging: `sanitizeObjectForLog()`.
- Return `ActionResult` type.
- Validate server-side even if client validates (defense in depth).

---

## 10. Known Issues & Integration Points

### Not Yet Implemented

- **Email sending** — Forms persist to DB and log. Integration point in each server action for Resend/SendGrid.
- **Sentry/error tracking** — `lib/logger.ts` has integration point in `logError()`.
- **Rate limiter** — In-memory, single-instance only. For multi-instance, swap to Redis.
- **PWA icons** — Only `favicon.ico` in manifest. Need proper icon set.
- **Image upload** — Admin uses URL fields for images. Future: S3/Cloudinary integration.
- **Navbar DB-backed content** — Navbar is a client component and can't use async DB functions. Uses static constants. Footer is DB-backed.

### Recurring Bug: Theme Reversion on iOS Safari

Has broken multiple times. The three-layer system (server cookie + inline script + ThemeProvider) must all be intact. Common failure modes:

1. Cookie set inside try/catch after localStorage (throws → no cookie).
2. Inline script only reads localStorage (no cookie fallback).
3. `dark` class not in server-rendered HTML (React hydration strips it).
4. Missing space in className (`antialiaseddark` not recognized).

If theme bugs recur, check all four of these.

### Pending PRs

- **PR #12** (Phase 6 — Code Quality) — not yet merged.
- **PR #14** (Phase 8 — Build/Deploy) — not yet merged.

---

## 11. Scripts

| Script              | File                             | Purpose                  |
| ------------------- | -------------------------------- | ------------------------ |
| Capture screenshots | `scripts/capture-screenshots.ts` | Automated UI screenshots |
| Verify popup        | `scripts/verify-popup.ts`        | Popup/modal verification |

These are excluded from the `no-console` ESLint rule.

---

## 12. Audit Reports

Located in `reports/`:

- `2026-08-16-codebase-audit.md` — Initial codebase audit
- `2026-08-16-ui-audit*.md` — UI audit passes (7, reaudit, pass 7-13)
- `2026-08-19-hover-state-audit*.md` — Hover state audits
- `2026-08-21-state-management-audit.md` — State management review
- `2026-08-23-navigation-delay-investigation.md` — Nav perf investigation
- `2026-08-23-production-navigation-perf.md` — Production nav perf
- `2026-08-25-comprehensive-audit-plan.md` — The 10-phase audit plan

---

## 13. Quick Start for a New Agent

```bash
# 1. Clone and install
git clone https://github.com/shemaKaita/SouthEastPropv2.git
cd SouthEastPropv2
npm ci

# 2. Set env (local dev works without this, but set for accurate SEO)
echo 'NEXT_PUBLIC_SITE_URL=http://localhost:3000' > .env.local

# 3. Run
npm run dev

# 4. Before committing
npm run lint && npm run format && npm run build
```

**Key files to read first:**

1. This file (`PROJECT.md`)
2. `src/app/layout.tsx` — Root layout, theme system, metadata
3. `src/components/ThemeProvider.tsx` — Theme persistence (critical, fragile)
4. `next.config.ts` — Security headers, CSP, image config
5. `src/lib/properties.ts` — Data access pattern
6. `src/app/globals.css` — Design tokens, dark mode, Leaflet CSS

**Before changing theme code:** Read section 4 (Theme System) carefully. Test on iOS Safari after.
