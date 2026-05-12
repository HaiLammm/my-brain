# Story 1.3: Application Layout Shell & Navigation

Status: done

## Story

As a guest user,
I want to see a properly structured navigation with Japanese UI on consumer pages,
So that I can navigate the platform intuitively on any device.

## Acceptance Criteria

1. **Given** I visit the platform on a mobile device (< 768px)
   **When** the consumer page loads
   **Then** a Bottom Tab Navigation bar appears with 5 tabs: Home, Search, Community, Deals, Profile
   **And** active tab shows Navy fill, inactive tabs show gray outline
   **And** tab labels are in Japanese (ホーム, 検索, コミュニティ, お得, マイページ)

2. **Given** I visit the platform on desktop (> 1024px)
   **When** the consumer page loads
   **Then** a sticky top navigation bar appears with categories
   **And** the bottom tab nav is hidden

3. **Given** the route group structure
   **When** I navigate to `(user)/[locale]/*` routes
   **Then** next-intl provides Japanese (ja) as default locale with en and vi alternatives
   **And** `lang="ja"` attribute is set on Japanese content

4. **Given** the business portal at `(business)/vi/*`
   **When** a business owner visits
   **Then** a sidebar navigation renders entirely in Vietnamese
   **And** no next-intl middleware processes these routes (zero i18n overhead)
   **And** `lang="vi"` attribute is set

5. **Given** the admin panel at `(admin)/*`
   **When** an admin visits
   **Then** a sidebar navigation renders with role-based menu items
   **And** a simple language toggle (EN/VI) is available

6. **Given** any route
   **When** a 404 or error occurs
   **Then** a styled not-found page or error boundary renders in the appropriate language

## Tasks / Subtasks

- [x] Task 1: Create `(user)/[locale]/layout.tsx` — User layout with bottom tab nav and top nav (AC: #1, #2, #3)
  - [x] Create `BottomTabNav` component at `apps/web/shared/components/BottomTabNav.tsx` with 5 tabs (Home/検索/コミュニティ/お得/マイページ)
  - [x] Create `TopNav` component at `apps/web/shared/components/TopNav.tsx` — sticky desktop nav with logo, category links, search
  - [x] Wire `next-intl` `NextIntlClientProvider` in layout, set `lang` attribute on wrapping element
  - [x] Bottom tab visible on mobile (<768px), hidden on desktop; Top nav visible on desktop (>=1024px)
  - [x] Active tab: Navy bg + white text/icon; Inactive: gray outline icon + gray text

- [x] Task 2: Create `(business)/vi/layout.tsx` — Business sidebar layout (AC: #4)
  - [x] Create `BusinessSidebar` component at `apps/web/modules/business/components/BusinessSidebar.tsx`
  - [x] Sidebar items in Vietnamese: Dashboard, Danh sách, Coupon, Đánh giá, Cài đặt
  - [x] Set `lang="vi"` on wrapping element
  - [x] Desktop-first: sidebar always visible >=1024px, hamburger toggle on mobile
  - [x] NO next-intl imports — pure Vietnamese strings

- [x] Task 3: Create `(admin)/layout.tsx` — Admin sidebar layout (AC: #5)
  - [x] Create `AdminSidebar` component at `apps/web/modules/admin/components/AdminSidebar.tsx`
  - [x] Sidebar items: Dashboard, Moderation, Users, Businesses, Staff, Reports
  - [x] Language toggle (EN/VI) using simple React context — NO next-intl
  - [x] Desktop-only layout (min-width 1024px)

- [x] Task 4: Update root layout to NOT set static `lang` attribute (AC: #3, #4, #5)
  - [x] Root `layout.tsx` should set `lang="ja"` as default (consumer-first)
  - [x] Route group layouts override with correct lang via `<html>` or wrapping element

- [x] Task 5: Style not-found and error pages (AC: #6)
  - [x] Update `app/not-found.tsx` with design tokens, EmptyState component, nav back link
  - [x] Update `app/error.tsx` with design tokens, error illustration, retry button
  - [x] Create route-group-specific not-found pages if needed for locale-aware 404

- [x] Task 6: Add next-intl translation keys for navigation (AC: #1, #2, #3)
  - [x] Add navigation keys to `messages/ja.json`, `messages/en.json`, `messages/vi.json`
  - [x] Keys: `nav.home`, `nav.search`, `nav.community`, `nav.deals`, `nav.profile`
  - [x] Integrate `useTranslations('nav')` in BottomTabNav and TopNav

- [x] Task 7: Update next-intl middleware matcher for proper route group scoping (AC: #3, #4)
  - [x] Verify middleware only processes `(user)` routes — business/admin bypass completely
  - [x] Ensure `(user)/[locale]` resolves correctly with default redirect from `/` to `/ja`

- [x] Task 8: Write tests for navigation components (AC: #1-#5)
  - [x] Test BottomTabNav: renders 5 tabs, active state, responsive visibility
  - [x] Test TopNav: renders logo + categories, sticky behavior
  - [x] Test BusinessSidebar: renders Vietnamese labels, no i18n imports
  - [x] Test AdminSidebar: renders menu items, language toggle
  - [x] Test not-found page: renders EmptyState with navigation

### Review Findings

- [x] [Review][Decision] Error/404 pages hardcoded Japanese — FIXED: created route-group-specific error/not-found pages for business(vi) and admin(en)
- [x] [Review][Patch] AdminSidebar/BusinessSidebar use `<a>` instead of `<Link>` — FIXED: replaced with next/link Link
- [x] [Review][Patch] Admin layout `ml-64` hardcoded — FIXED: changed to lg:ml-64 for responsive
- [x] [Review][Patch] Nav gap 768-1024px — FIXED: BottomTabNav changed to lg:hidden, user layout padding to lg:pb-0
- [x] [Review][Patch] BottomTabNav `endsWith`/TopNav `includes` false-positive active state — FIXED: exact match + startsWith
- [x] [Review][Patch] Error page renders raw `error.message` — FIXED: removed error.message, show generic message only
- [x] [Review][Patch] BusinessSidebar "Dashboard"/"Coupon" in English — FIXED: changed to "Bảng điều khiển"/"Phiếu giảm giá"
- [x] [Review][Patch] Admin layout missing `lang` attribute — FIXED: added lang="en"
- [x] [Review][Patch] not-found.tsx inline style — FIXED: now uses PrimaryCTAButton consistent with error.tsx
- [x] [Review][Defer] AdminSidebar `roles?` field defined but never filtered — deferred, RBAC is Story 1.4 scope
- [x] [Review][Defer] Root `<html lang="ja">` conflicts with locale-specific `<div lang>` for SEO — deferred, requires architectural decision on nested lang override

## Dev Notes

### Architecture Compliance

- **Route groups**: `(user)`, `(business)`, `(admin)` — each gets its own `layout.tsx`
- **i18n strategy**: next-intl ONLY for `(user)` routes. Business = hardcoded Vietnamese. Admin = simple context toggle EN/VI. [Source: architecture/starter-template-evaluation.md#i18n-strategy-per-route-group]
- **Component locations**: Shared nav components in `apps/web/shared/components/`. Module-specific components in `apps/web/modules/{module}/components/`. [Source: architecture/project-structure-boundaries.md]
- **No `any` type** — use proper TypeScript types
- **No spinners** — use Skeleton for loading states
- **Design tokens only** — no hardcoded hex values. Use `bg-primary` (Navy #1B2A4A), `text-secondary`, etc. from globals.css `@theme`

### i18n Implementation Details

- `next-intl` is already installed (v4.9.1) and configured:
  - `i18n/routing.ts` — locales: `["ja", "en", "vi"]`, defaultLocale: `"ja"`
  - `i18n/request.ts` — message loading from `messages/{locale}.json`
  - `middleware.ts` — matcher: `["/(ja|en|vi)/:path*", "/"]`
- `next.config.ts` currently has NO `createNextIntlPlugin` wrapper — this MUST be added for next-intl to work with server components. Check next-intl v4.x docs for correct setup.
- **CRITICAL**: Read `node_modules/next/dist/docs/` for any Next.js 16.x breaking changes before implementing layouts. The AGENTS.md warns about API differences.

### Navigation Component Specs

**BottomTabNav (mobile <768px):**
- Fixed bottom, height 64px + safe-area-inset-bottom
- 5 tabs with icon + label
- Icons: use `lucide-react` (Home, Search, Users, Tag, User)
- Active: Navy bg pill on icon, Navy text. Inactive: gray-400 icon + text
- z-index above content, below Modal
- Tab labels from next-intl translations (Japanese default)

**TopNav (desktop >=1024px):**
- Sticky top, height 64px
- Logo left, category links center, search + profile right
- Surface-white bg with shadow-card
- Category links: ホーム, レストラン, カフェ, 美容, ナイトライフ, ショッピング

**BusinessSidebar:**
- Width 256px fixed, Surface-primary bg (#FAFAF8)
- Logo top, nav items below, profile/logout bottom
- Items: icon + Vietnamese label, active state with Navy left border + Navy text
- Mobile: hamburger button, overlay sidebar with backdrop

**AdminSidebar:**
- Similar to BusinessSidebar but with EN/VI toggle at bottom
- Items: Dashboard, Moderation, Users, Businesses, Staff, Reports
- Role-based visibility (prepare data structure, actual RBAC in Story 1.4)

### Font & Language Attributes

- Root layout currently sets `lang="en"` — must change to `lang="ja"` (consumer-first, Japanese default)
- `(user)/[locale]/layout.tsx` should dynamically set lang based on locale param
- `(business)/vi/layout.tsx` should set `lang="vi"`
- `(admin)/layout.tsx` should set lang based on admin language preference context

### Previous Story Intelligence (Story 1.2)

**Completed work this story builds on:**
- 14 shared UI components exist in `apps/web/shared/components/` with barrel export `index.ts`
- Design tokens configured in `globals.css` via `@theme` — all brand colors, typography, spacing, shadows, animations available
- `cn()` utility at `shared/lib/cn.ts` (clsx + tailwind-merge)
- ToastProvider integrated in root layout
- Vitest configured with jest-dom setup, 46 tests passing
- Fonts: Noto Sans JP + Inter loaded via `next/font/google` in root layout

**Relevant components from Story 1.2 to USE (not recreate):**
- `Skeleton` — for loading states in nav
- `EmptyState` — for 404 page
- `PrimaryCTAButton` — for error page retry button
- `Toast` / `useToast` — for navigation errors
- `cn()` — for conditional classnames

**Story 1.2 deferred items relevant here:**
- Route group layout files — THIS story creates them
- Pre-existing build error: Route group conflict between `(admin)`, `(business)`, `(user)` — investigate and fix if still present

### Git Intelligence

- Recent commit `0db2502` completed Tailwind CSS 4.x design tokens
- Route group directories `(user)/`, `(business)/`, `(admin)/` exist with placeholder `page.tsx` files
- `(user)/[locale]/page.tsx` exists as placeholder
- `(business)/vi/page.tsx` exists as placeholder
- next-intl middleware, routing, and request config exist from Story 1.1
- Messages files exist but are empty `{}`

### Dependencies

Already installed (no new deps needed):
- `next-intl` v4.9.1
- `lucide-react`
- `clsx`, `tailwind-merge`

May need to install:
- Check if `next-intl` requires `createNextIntlPlugin` in `next.config.ts` for v4.x — if so, config change only, no new package

### File Structure

Files to CREATE:
```
apps/web/app/(user)/[locale]/layout.tsx          — User layout with nav + next-intl provider
apps/web/shared/components/BottomTabNav.tsx       — Mobile bottom tab navigation
apps/web/shared/components/TopNav.tsx             — Desktop top navigation bar
apps/web/modules/business/components/BusinessSidebar.tsx — Business sidebar nav
apps/web/modules/admin/components/AdminSidebar.tsx       — Admin sidebar nav
apps/web/app/(business)/vi/layout.tsx             — Business layout with sidebar
apps/web/app/(admin)/layout.tsx                   — Admin layout with sidebar
apps/web/shared/components/__tests__/BottomTabNav.test.tsx
apps/web/shared/components/__tests__/TopNav.test.tsx
apps/web/modules/business/components/__tests__/BusinessSidebar.test.tsx
apps/web/modules/admin/components/__tests__/AdminSidebar.test.tsx
```

Files to MODIFY:
```
apps/web/app/layout.tsx                           — Change lang="en" to lang="ja", adjust structure
apps/web/app/not-found.tsx                        — Style with design tokens + EmptyState
apps/web/app/error.tsx                            — Style with design tokens + retry button
apps/web/messages/ja.json                         — Add navigation translation keys
apps/web/messages/en.json                         — Add navigation translation keys
apps/web/messages/vi.json                         — Add navigation translation keys
apps/web/next.config.ts                           — Add createNextIntlPlugin if needed for v4.x
apps/web/shared/components/index.ts               — Export BottomTabNav, TopNav
```

### Anti-Patterns to Avoid

- DO NOT use next-intl in `(business)` or `(admin)` route groups — zero i18n overhead for non-user routes
- DO NOT hardcode Japanese strings in components — use next-intl translation keys for user routes
- DO NOT create a `tailwind.config.ts` — Tailwind 4.x uses CSS-based `@theme`
- DO NOT use hardcoded hex colors — reference design tokens (bg-primary, text-secondary, etc.)
- DO NOT use `any` type
- DO NOT add auth logic — authentication is Story 1.4's scope
- DO NOT use spinners — use Skeleton component
- DO NOT duplicate shared components that already exist from Story 1.2
- DO NOT import components across module boundaries — use shared/ for cross-module components

### References

- [Source: epics/epic-1-platform-foundation-authentication-design-system.md#story-1.3] — Story requirements and AC
- [Source: architecture/starter-template-evaluation.md#i18n-strategy-per-route-group] — i18n per route group strategy
- [Source: architecture/project-structure-boundaries.md#complete-project-directory-structure] — File locations and module structure
- [Source: architecture/core-architectural-decisions.md#frontend-architecture] — State management, component patterns
- [Source: architecture/implementation-patterns-consistency-rules.md#naming-patterns] — Frontend naming conventions
- [Source: prd/web-application-architecture.md] — Responsive design strategy, browser support
- [Source: prd/functional-requirements.md#FR52-FR53] — Guest access, registration prompt behavior
- [Source: implementation-artifacts/1-2-design-token-system-core-ui-components.md] — Previous story context, component patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Route group conflict: `(user)`, `(business)`, `(admin)` all had root `page.tsx` causing parallel page conflict. Fixed by removing root-level pages and keeping only sub-path pages.
- next-intl v4.x requires `createNextIntlPlugin` wrapper in `next.config.ts` for server component support.
- Next.js 16.2.3 deprecation warning: middleware → proxy convention. Kept middleware as-is (not in story scope).

### Completion Notes List

- Created BottomTabNav with 5 tabs, active state styling (Navy bg pill), responsive visibility (md:hidden)
- Created TopNav with logo, 6 category links, search/profile buttons, sticky desktop header (lg:block)
- Created BusinessSidebar with Vietnamese labels, hamburger mobile toggle, no next-intl dependency
- Created AdminSidebar with EN/VI language toggle via React context, role-based data structure prepared
- Created user locale layout with NextIntlClientProvider, dynamic lang attribute
- Created business layout with lang="vi" and sidebar
- Created admin layout with AdminLangProvider and sidebar
- Updated root layout lang="en" → lang="ja" (consumer-first)
- Styled not-found page with Japanese text and home link
- Styled error page with Japanese text and PrimaryCTAButton retry
- Added navigation translation keys to ja/en/vi message files (nav namespace + categories)
- Added createNextIntlPlugin to next.config.ts
- Resolved route group conflict by removing conflicting root-level page.tsx files
- Updated vitest config to include modules/ test pattern
- All 62 tests pass (16 new tests added), build succeeds

### Change Log

- 2026-04-12: Implemented Story 1.3 — Application Layout Shell & Navigation. Created 3 navigation components (BottomTabNav, TopNav, BusinessSidebar, AdminSidebar), 3 route group layouts, styled error/not-found pages, added i18n translation keys, configured next-intl plugin. 62 tests passing.

### File List

New files:
- apps/web/shared/components/BottomTabNav.tsx
- apps/web/shared/components/TopNav.tsx
- apps/web/modules/business/components/BusinessSidebar.tsx
- apps/web/modules/admin/components/AdminSidebar.tsx
- apps/web/app/(user)/[locale]/layout.tsx
- apps/web/app/(business)/vi/layout.tsx
- apps/web/app/(admin)/layout.tsx
- apps/web/app/(admin)/admin/page.tsx
- apps/web/shared/components/__tests__/BottomTabNav.test.tsx
- apps/web/shared/components/__tests__/TopNav.test.tsx
- apps/web/shared/components/__tests__/NotFound.test.tsx
- apps/web/modules/business/components/__tests__/BusinessSidebar.test.tsx
- apps/web/modules/admin/components/__tests__/AdminSidebar.test.tsx

Modified files:
- apps/web/app/layout.tsx (lang="en" → lang="ja")
- apps/web/app/not-found.tsx (styled with design tokens, Japanese text)
- apps/web/app/error.tsx (styled with design tokens, PrimaryCTAButton)
- apps/web/messages/ja.json (added nav translation keys)
- apps/web/messages/en.json (added nav translation keys)
- apps/web/messages/vi.json (added nav translation keys)
- apps/web/next.config.ts (added createNextIntlPlugin)
- apps/web/shared/components/index.ts (exported BottomTabNav, TopNav)
- apps/web/vitest.config.ts (added modules/ test include pattern)

Deleted files:
- apps/web/app/(user)/page.tsx (route group conflict)
- apps/web/app/(business)/page.tsx (route group conflict)
- apps/web/app/(admin)/page.tsx (route group conflict)
