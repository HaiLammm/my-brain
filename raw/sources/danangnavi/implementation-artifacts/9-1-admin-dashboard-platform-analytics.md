# Story 9.1: Admin Dashboard & Platform Analytics

Status: review

## Story

As a platform admin,
I want to see a comprehensive dashboard with traffic, revenue, and engagement metrics,
So that I can monitor platform health and make data-driven decisions.

## Acceptance Criteria

1. **Given** I am logged in as Admin and navigate to `/admin/dashboard` (FR39)
   **When** the dashboard loads
   **Then** top-level KPI cards display: total daily visits, total registered users, total businesses, total active coupons, total revenue (current month)

2. **Given** the dashboard metrics section
   **When** I view engagement metrics
   **Then** charts and figures show: daily visits trend (30-day line chart), popular sections breakdown (pie chart), user engagement metrics (reviews/day, posts/day, event registrations/day), new user registration trend

3. **Given** the dashboard
   **When** I view the revenue section
   **Then** revenue metrics show: total revenue, ad revenue, commission revenue, month-over-month growth
   **And** a breakdown by business category is available

4. **Given** the admin layout
   **When** the page renders
   **Then** a sidebar navigation shows role-appropriate menu items based on my admin sub-role
   **And** the UI supports English/Vietnamese toggle

## Tasks / Subtasks

- [x] Task 1: Backend — Admin analytics API endpoints (AC: #1, #2, #3)
  - [x] 1.1 Create `backend/modules/admin/` module with standard 9-file structure
  - [x] 1.2 `GET /api/v1/admin/dashboard/kpis` — returns KPI card data (total daily visits, registered users, businesses, active coupons, revenue)
  - [x] 1.3 `GET /api/v1/admin/dashboard/engagement` — returns engagement charts data (daily visits 30d, popular sections, reviews/posts/events per day, registration trend)
  - [x] 1.4 `GET /api/v1/admin/dashboard/revenue` — returns revenue breakdown (total, ad, commission, MoM growth, by category)
  - [x] 1.5 Repository layer: aggregate queries across `users`, `listings`, `coupons`, `listing_view_stats`, `reviews`, `community_posts`, `events` tables
  - [x] 1.6 Protect all endpoints with `require_role(UserRole.ADMIN)`
- [x] Task 2: Frontend — Admin dashboard page (AC: #1, #2, #3, #4)
  - [x] 2.1 Create `apps/web/app/(admin)/admin/dashboard/page.tsx` (replace placeholder)
  - [x] 2.2 KPI cards component with number formatting and icons
  - [x] 2.3 Line chart for daily visits trend (30-day) — use Recharts
  - [x] 2.4 Pie chart for popular sections breakdown — use Recharts
  - [x] 2.5 Engagement metrics display (reviews/day, posts/day, events/day)
  - [x] 2.6 Revenue section with MoM growth and category breakdown
  - [x] 2.7 All text bilingual via `useAdminLang()` (EN/VI)
- [x] Task 3: BFF proxy route for admin API calls (AC: #1)
  - [x] 3.1 Create `apps/web/app/api/(admin)/[...path]/route.ts` to proxy `/api/v1/admin/*` to FastAPI backend
- [x] Task 4: Backend tests (AC: #1, #2, #3)
  - [x] 4.1 Repository unit tests for aggregate queries
  - [x] 4.2 Service unit tests
  - [x] 4.3 Router integration tests with admin auth
- [x] Task 5: Frontend tests (AC: #1, #2, #3, #4)
  - [x] 5.1 Component tests for KPI cards, charts, revenue section
  - [x] 5.2 Dashboard page test with mocked API data

## Dev Notes

### Architecture Constraints

- **Module pattern:** Create `backend/modules/admin/` with 9 standard files: `__init__.py`, `models.py`, `repository.py`, `service.py`, `router.py`, `schemas.py`, `dependencies.py`, `exceptions.py`, `constants.py`. This module does NOT own data tables — it reads from other modules' tables via cross-module queries.
- **Auth enforcement:** All admin endpoints use `require_role(UserRole.ADMIN)` from `backend/modules/auth/dependencies.py`. Sub-role filtering is NOT needed for the dashboard (all admins see it). `UserRole.ADMIN` and `AdminSubRole` enums already exist in `backend/modules/auth/constants.py`.
- **Admin token expiry:** 8 hours (vs 24h for regular users) — `ADMIN_TOKEN_EXPIRE_MINUTES = 480` in auth constants.
- **Revenue is placeholder:** Real payment (VNPay/Momo) is Phase 2. Show "Coming soon" or mock data for revenue section. Previous story 8-4 also used revenue placeholder approach.
- **UUID v4** for all primary keys. Timestamps always UTC in DB/API, locale-formatted in frontend.
- **Soft delete:** All queries MUST filter `WHERE deleted_at IS NULL` (or equivalent) when counting users, listings, etc.

### Existing Code to Reuse

- **`backend/modules/analytics/`** — Already built for business-owner analytics (story 8-4). Contains `ListingViewStat` model, view tracking, CSV export. The admin module should query `listing_view_stats` for platform-wide visit data. Do NOT duplicate this module — create a separate `admin` module that reads from the same tables.
- **`backend/modules/analytics/router.py`** — Scoped to `/api/v1/business/analytics/` with `BUSINESS_OWNER` role. Admin endpoints go under `/api/v1/admin/dashboard/` in the new admin module.
- **`apps/web/modules/admin/`** — Admin shell already exists: `AdminSidebar.tsx` with bilingual toggle (`useAdminLang()`), `AdminLangProvider`, sidebar nav links. Layout at `apps/web/app/(admin)/layout.tsx` wraps with sidebar (`lg:ml-64`).
- **`apps/web/app/(admin)/admin/page.tsx`** — Currently a placeholder `<main>Admin dashboard placeholder</main>`. Replace with actual dashboard.
- **`SingleEnvelope` / `Paginated`** response wrappers from `backend/modules/listing/schemas.py` — reuse for admin API responses.
- **`backend/shared/base_models.py`** — `BaseModel` with `id` (UUID), `created_at`, `updated_at`, `deleted_at`.
- **BFF proxy pattern:** See existing proxies in `apps/web/app/api/` for the pattern. Use `getSetCookie()` + `append()` for Set-Cookie headers (known bug fix from prior work).

### Frontend Specifics

- **No next-intl for admin:** Use `useAdminLang()` hook from `AdminSidebar.tsx` for EN/VI toggle. All labels need both `labelEn`/`labelVi` variants.
- **Charts library:** Use **Recharts** (`recharts`) — already in the project dependencies. Use `LineChart` for trends, `PieChart` for section breakdown.
- **Rendering:** Client-side rendering for dashboard (no SSR/SSG needed). Architecture decision: "SSR for public pages, client-side for dashboards."
- **Data fetching:** TanStack Query (`@tanstack/react-query`) for API calls with polling/cache. Use `useQuery` with appropriate `staleTime`.
- **Path aliases:** ALWAYS use `@/` imports, never relative `../` paths.
- **Design tokens:** Use existing Tailwind design tokens (`text-primary`, `bg-surface`, `text-text-secondary`, etc.) matching the admin sidebar style.

### Database Tables to Query (Read-Only)

The admin module reads across these existing tables — no new tables needed for story 9.1:

| Table | Data | Module Owner |
|-------|------|-------------|
| `users` | Total count, role breakdown, registration trend | auth |
| `listings` | Total businesses, category breakdown | listing |
| `coupons` | Active coupon count | coupon |
| `listing_view_stats` | Daily visits, view trends | analytics |
| `reviews` | Reviews per day | review |
| `community_posts` | Posts per day | community |
| `events` | Event registrations per day | community |

### API Response Schemas

```
KPI Response:
  total_daily_visits: int
  total_registered_users: int
  total_businesses: int
  total_active_coupons: int
  total_revenue_current_month: float  # placeholder — return 0.0

Engagement Response:
  daily_visits: list[{date: str, count: int}]  # 30 days
  popular_sections: list[{section: str, percentage: float}]
  reviews_per_day: float
  posts_per_day: float
  event_registrations_per_day: float
  registration_trend: list[{date: str, count: int}]  # 30 days

Revenue Response:
  total_revenue: float  # placeholder
  ad_revenue: float  # placeholder
  commission_revenue: float  # placeholder
  mom_growth: float  # placeholder
  by_category: list[{category: str, revenue: float}]  # placeholder
```

### Error Format

Follow established multilingual error pattern:
```json
{
  "error": {
    "code": "ADMIN_UNAUTHORIZED",
    "message_ja": "管理者権限が必要です",
    "message_vi": "Cần quyền quản trị viên",
    "message_en": "Admin access required"
  }
}
```

### Testing Standards

- Backend auth/security: 100% line coverage
- Backend service layer: 80% line coverage
- Use existing test fixtures from `backend/tests/conftest.py` — check for admin user fixture or create one
- Frontend: Vitest + React Testing Library, mock API responses

### Project Structure Notes

```
# New backend module
backend/modules/admin/
├── __init__.py
├── constants.py
├── dependencies.py
├── events.py
├── exceptions.py
├── models.py          # Empty — this module owns no tables
├── repository.py      # Cross-module read queries
├── router.py          # /api/v1/admin/dashboard/*
├── schemas.py         # KPI, Engagement, Revenue response models
└── service.py

# New/modified frontend files
apps/web/app/(admin)/admin/dashboard/page.tsx          # NEW — main dashboard
apps/web/modules/admin/components/KpiCards.tsx          # NEW
apps/web/modules/admin/components/EngagementCharts.tsx  # NEW
apps/web/modules/admin/components/RevenueSection.tsx    # NEW
apps/web/modules/admin/hooks/useDashboard.ts           # NEW — TanStack Query hooks
apps/web/modules/admin/lib/adminApi.ts                 # NEW or extend existing

# BFF proxy
apps/web/app/api/(admin)/[...path]/route.ts            # NEW
```

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-9-admin-panel-platform-governance.md#Story 9.1]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR39]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure-boundaries.md#Admin Route Group]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#RBAC]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md]
- [Source: backend/modules/auth/constants.py — UserRole, AdminSubRole enums]
- [Source: backend/modules/auth/dependencies.py — require_role, require_admin_sub_role]
- [Source: backend/modules/analytics/ — existing analytics module pattern]
- [Source: apps/web/modules/admin/components/AdminSidebar.tsx — useAdminLang pattern]

### Previous Story Intelligence (from 8-4)

- `ListingViewStat` model in `backend/modules/analytics/models.py` tracks daily views per listing via UPSERT. Aggregate across all listings for platform-wide daily visits.
- Activity feed in 8-4 combines reviews + coupon redemptions. `activity_log` table integration was deferred — admin dashboard can query source tables directly.
- CSV export with 365-day cap pattern established in analytics service.
- Review patches: UTC-safe date handling, nullable review body guard — follow same patterns.
- `review_disputes` table exists with `status`, `resolved_at`, `resolver_id` fields ready for admin use (Story 9-4).
- Deferred warnings from 8-4: synchronous S3+Pillow blocking async loop (W1), media IDOR (W2/W3) — not relevant to this story but be aware.

## Dev Agent Record

### Agent Model Used

- openai/gpt-5.4

### Debug Log References

- `python -m pytest backend/tests/admin`
- `python -m pytest backend/tests/admin backend/tests/auth/test_profile.py backend/tests/auth/test_router.py`
- `pnpm --filter web exec vitest run modules/admin/components/__tests__/KpiCards.test.tsx modules/admin/components/__tests__/EngagementCharts.test.tsx modules/admin/components/__tests__/RevenueSection.test.tsx modules/admin/components/__tests__/AdminDashboardPage.test.tsx modules/admin/components/__tests__/AdminSidebar.test.tsx`
- `pnpm test:web`
- `pnpm test:backend`
- `pnpm --filter web build`
- `pnpm lint:backend`
- `pnpm --filter web exec eslint "app/(admin)/admin/page.tsx" "app/(admin)/admin/dashboard/page.tsx" "app/(admin)/layout.tsx" "app/api/admin/[...path]/route.ts" "modules/admin/components/AdminSidebar.tsx" "modules/admin/components/KpiCards.tsx" "modules/admin/components/EngagementCharts.tsx" "modules/admin/components/RevenueSection.tsx" "modules/admin/components/__tests__/AdminSidebar.test.tsx" "modules/admin/components/__tests__/KpiCards.test.tsx" "modules/admin/components/__tests__/EngagementCharts.test.tsx" "modules/admin/components/__tests__/RevenueSection.test.tsx" "modules/admin/components/__tests__/AdminDashboardPage.test.tsx" "modules/admin/hooks/useDashboard.ts" "modules/admin/lib/adminApi.ts" "shared/stores/useAuthStore.ts"`
- `pnpm lint:web` (fails on unrelated pre-existing translation/community lint issues outside this story's change set)

### Completion Notes List

- Implemented a new `backend/modules/admin/` read-only analytics module with KPI, engagement, and placeholder revenue endpoints under `/api/v1/admin/dashboard/*`, all protected by `require_role(UserRole.ADMIN)`.
- Added soft-delete-aware aggregate queries for platform-wide visits, registered users, businesses, active coupons, new-user trends, engagement averages, and placeholder category revenue breakdowns.
- Built a client-rendered admin dashboard at `/admin/dashboard` with KPI cards, Recharts line/pie visualizations, a placeholder revenue section, and bilingual EN/VI copy driven by `useAdminLang()`.
- Updated the admin sidebar to filter navigation by `adminSubRole`, and extended auth payload/store typing so the existing client auth bootstrap can expose that sub-role to the admin shell.
- Corrected the existing dedicated admin BFF proxy route so `/api/admin/*` now forwards to `/api/v1/admin/*` without introducing a conflicting root catch-all route.
- Added backend repository/service/router tests and frontend component/page tests; `pnpm test:web`, `pnpm test:backend`, `pnpm --filter web build`, and `pnpm lint:backend` passed. Scoped frontend eslint for changed admin files passed, while repo-wide `pnpm lint:web` still reports pre-existing errors in `apps/web/modules/translation/components/VoiceTranslationView.tsx` and `apps/web/modules/translation/hooks/useSpeechRecognition.ts` plus unrelated warnings in community/listing components.

### File List

- `_bmad-output/implementation-artifacts/9-1-admin-dashboard-platform-analytics.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `apps/web/app/(admin)/admin/page.tsx`
- `apps/web/app/(admin)/admin/dashboard/page.tsx`
- `apps/web/app/(admin)/layout.tsx`
- `apps/web/app/api/admin/[...path]/route.ts`
- `apps/web/modules/admin/components/AdminSidebar.tsx`
- `apps/web/modules/admin/components/EngagementCharts.tsx`
- `apps/web/modules/admin/components/KpiCards.tsx`
- `apps/web/modules/admin/components/RevenueSection.tsx`
- `apps/web/modules/admin/components/__tests__/AdminDashboardPage.test.tsx`
- `apps/web/modules/admin/components/__tests__/AdminSidebar.test.tsx`
- `apps/web/modules/admin/components/__tests__/EngagementCharts.test.tsx`
- `apps/web/modules/admin/components/__tests__/KpiCards.test.tsx`
- `apps/web/modules/admin/components/__tests__/RevenueSection.test.tsx`
- `apps/web/modules/admin/hooks/useDashboard.ts`
- `apps/web/modules/admin/lib/adminApi.ts`
- `apps/web/shared/stores/useAuthStore.ts`
- `backend/main.py`
- `backend/modules/admin/__init__.py`
- `backend/modules/admin/constants.py`
- `backend/modules/admin/dependencies.py`
- `backend/modules/admin/events.py`
- `backend/modules/admin/exceptions.py`
- `backend/modules/admin/models.py`
- `backend/modules/admin/repository.py`
- `backend/modules/admin/router.py`
- `backend/modules/admin/schemas.py`
- `backend/modules/admin/service.py`
- `backend/modules/auth/schemas.py`
- `backend/tests/admin/__init__.py`
- `backend/tests/admin/test_repository.py`
- `backend/tests/admin/test_router.py`
- `backend/tests/admin/test_service.py`

### Change Log

- 2026-05-04: Implemented story 9.1 admin dashboard analytics across backend APIs, frontend dashboard UI, proxy/auth plumbing, and automated tests.
