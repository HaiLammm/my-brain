# Story 3.2: User Profile Page

Status: review

## Story

As a registered user,
I want to view and edit my profile with my activity and contribution history,
So that I can manage my identity and track my progress on the platform.

## Acceptance Criteria

1. **Given** I navigate to my profile at `/ja/profile`
   **When** the page loads
   **Then** my profile header shows: avatar, display name, bio, registration date, and "在住X年" (years in Da Nang) if set
   **And** an "編集" (Edit) button opens a profile edit form

2. **Given** I tap the edit button (FR10)
   **When** the edit form opens (Modal, partial variant)
   **Then** I can update: display name, bio (max 200 chars), interests (multi-select chips), and avatar
   **And** saving shows a toast "プロフィールを更新しました"

3. **Given** my profile page
   **When** I scroll to the activity section
   **Then** an activity timeline shows my recent actions: reviews written, listings saved (posts/events deferred to future stories when community module exists)
   **And** each entry has a relative timestamp and link to the content

4. **Given** my profile page
   **When** I view the stats section
   **Then** contribution stats display: total points (0 until gamification module), reviews count, favorites count
   **And** a link to my favorites collection is visible

## Tasks / Subtasks

### Backend

- [x] Task 1: Extend User model with profile fields (AC: #1, #2)
  - [x] 1.1 Add columns to `users` table: `bio` (Text, nullable, max 200), `interests` (ARRAY(String) or JSON, nullable), `years_in_danang` (Integer, nullable)
  - [x] 1.2 Create Alembic migration `{date}_add_user_profile_fields.py`
  - [x] 1.3 Update `UserOut` schema to include `bio`, `interests`, `years_in_danang`

- [x] Task 2: Create profile update endpoint (AC: #2)
  - [x] 2.1 Add `UserProfileUpdateRequest` schema: `display_name` (str, 1-100, optional), `bio` (str, max 200, optional), `interests` (list[str], max_length=8, optional), `avatar_url` (HttpUrl | str, optional), `years_in_danang` (int, ge=0, le=50, optional)
  - [x] 2.2 Add `PATCH /api/v1/auth/profile` endpoint in auth router — requires authenticated user
  - [x] 2.3 Implement `update_profile()` in auth service — validate and update fields
  - [x] 2.4 Add `update_user()` method in auth repository — partial update only provided fields

- [x] Task 3: Create profile stats endpoint (AC: #3, #4)
  - [x] 3.1 Add `UserProfileStatsResponse` schema: `reviews_count` (int), `favorites_count` (int), `total_points` (int, default 0), `badge_level` (str, default "newcomer"), `member_since` (datetime)
  - [x] 3.2 Add `GET /api/v1/auth/profile/stats` endpoint — requires authenticated user
  - [x] 3.3 Implement stats aggregation in auth service via raw SQL (no module imports): `SELECT COUNT(*) FROM reviews WHERE user_id = :id AND deleted_at IS NULL` and `SELECT COUNT(*) FROM listing_favorites WHERE user_id = :id AND deleted_at IS NULL`
  - [x] 3.4 Points and badge_level return 0/"newcomer" — placeholder until gamification module (Story 3.3). Frontend shows "0ポイント" — this is expected.

- [x] Task 4: Create activity timeline endpoint (AC: #3)
  - [x] 4.1 Add `UserActivityResponse` schema: list of `ActivityEntry` with `type` (enum: review, favorite), `title` (str), `timestamp` (datetime), `link` (str)
  - [x] 4.2 Add `GET /api/v1/auth/profile/activity` endpoint with pagination — requires authenticated user
  - [x] 4.3 Implement activity aggregation via UNION query: reviews from `reviews` table + save actions from `listing_favorites` table, ordered by created_at desc, page_size=10 (offset-based)

- [x] Task 5: Backend tests
  - [x] 5.1 Test profile update with valid data
  - [x] 5.2 Test profile update bio max 200 chars validation
  - [x] 5.3 Test profile update without auth returns 401
  - [x] 5.4 Test profile stats returns correct counts
  - [x] 5.5 Test activity timeline pagination
  - [x] 5.6 Test GET /api/v1/auth/me returns new profile fields

### Frontend

- [x] Task 6: Create profile page route (AC: #1)
  - [x] 6.1 Create `apps/web/app/(user)/[locale]/profile/page.tsx` — server component with SEO metadata, force-dynamic
  - [x] 6.2 Create `ProfilePage` client component as main container

- [x] Task 7: Profile header section (AC: #1)
  - [x] 7.1 Create `ProfileHeader.tsx` — displays avatar (120px circle), display name, bio, "登録日: YYYY年MM月", "在住X年" if years_in_danang > 0
  - [x] 7.2 "編集" (Edit) button opens ProfileEditModal
  - [x] 7.3 Avatar fallback: first character of display name in circle if no avatar_url

- [x] Task 8: Profile edit modal (AC: #2)
  - [x] 8.1 Create `ProfileEditModal.tsx` using existing Modal component (partial variant)
  - [x] 8.2 Fields: display name (text input), bio (textarea, char counter 0/200), interests (multi-select FilterChips), avatar (tap to upload via media module)
  - [x] 8.3 Avatar upload: use existing `POST /api/v1/media` with owner_type=USER, then update profile with returned URL
  - [x] 8.4 Interest chips options: food (グルメ), cafe (カフェ), nightlife (ナイトライフ), outdoor (アウトドア), shopping (ショッピング), family (家族), remote_work (リモートワーク), fitness (フィットネス)
  - [x] 8.5 Form validation with React Hook Form + Zod
  - [x] 8.6 On save: PATCH /api/v1/auth/profile → update auth store → toast success → close modal
  - [x] 8.7 Skeleton loading while submitting

- [x] Task 9: Stats section (AC: #4)
  - [x] 9.1 Create `ProfileStats.tsx` — grid of stat cards: reviews, favorites, points
  - [x] 9.2 Each stat card: icon + count + label
  - [x] 9.3 Favorites card links to `/[locale]/profile/favorites`
  - [x] 9.4 Use TanStack Query key: `['auth', 'profile', 'stats']`

- [x] Task 10: Activity timeline section (AC: #3)
  - [x] 10.1 Create `ActivityTimeline.tsx` — vertical timeline of recent actions
  - [x] 10.2 Each entry: icon (by type), title, relative time (e.g., "3日前"), link to content
  - [x] 10.3 Load more button for pagination
  - [x] 10.4 EmptyState when no activity
  - [x] 10.5 Use TanStack Query key: `['auth', 'profile', 'activity']`

- [x] Task 11: i18n translations
  - [x] 11.1 Add `profile` namespace to `ja.json`, `en.json`, `vi.json`
  - [x] 11.2 Keys: page title, edit button, save button, cancel button, bio placeholder, interests label, stats labels, activity labels, empty state, toast messages, years_in_danang label, member_since label
  - [x] 11.3 Interest chip labels for all 8 options in each locale

- [x] Task 12: Custom hook
  - [x] 12.1 Create `modules/user/hooks/useUserProfile.ts` — wraps profile fetch, update, stats, activity queries
  - [x] 12.2 Profile update mutation invalidates `['auth', 'profile', 'stats']` and updates auth store

- [x] Task 13: Frontend tests
  - [x] 13.1 Render test for ProfileHeader
  - [x] 13.2 Render test for ProfileEditModal
  - [x] 13.3 Test bio char limit enforcement
  - [x] 13.4 Test ProfileStats rendering
  - [x] 13.5 Test ActivityTimeline with empty state

## Dev Notes

### Architecture Compliance

- **Backend endpoints live in auth module**: Profile is part of user identity — auth module owns the `users` table. Do NOT create a separate `profile` backend module.
- **Cross-module data access**: Stats endpoint needs review count from `reviews` table. Use a direct DB query in auth service (reviews table is read-only for this purpose, no import of review module). Alternatively, use event-driven pattern where review creation fires event that updates a denormalized counter on the user — but for MVP, a simple COUNT query is acceptable.
- **API response format**: Wrap all responses in `{ "data": ... }` / `{ "data": [...], "meta": {...} }` format.
- **Pydantic schemas**: `UserProfileUpdateRequest`, `UserProfileStatsResponse`, `UserActivityResponse`.
- **UUID primary keys**: All IDs are UUID v4.
- **Soft delete**: Existing `deleted_at` column — activity queries must filter `WHERE deleted_at IS NULL`.
- **Timestamps**: UTC in DB, format per locale in frontend only.

### Frontend Patterns

- **Client components**: All interactive profile components must have `"use client"` directive.
- **Page component**: Server component with `export const dynamic = "force-dynamic"` for auth-required content.
- **Translations**: Use `useTranslations("profile")` — never hardcode Japanese strings.
- **API client**: Use existing `apiClient()` from `@/shared/lib/apiClient` — handles CSRF, snake↔camel transform automatically.
- **Auth state**: Use `useAuthStore()` to get current user. After PATCH profile succeeds, call `useAuthStore.getState().setUser(updatedUser)` to sync UI immediately. **CRITICAL**: The `AuthUser` interface in `useAuthStore.ts` must be extended with `bio`, `interests`, `yearsInDanang` fields — otherwise these values are lost on setUser().
- **Loading states**: Use Skeleton components, never spinners.
- **Error handling**: Try/catch with `showToast()` from `useToast()` for user feedback.
- **Path aliases**: Always use `@/` imports, never relative paths.
- **Forms**: React Hook Form + Zod for validation.
- **Data fetching**: TanStack Query with keys `['auth', 'profile', 'stats']` and `['auth', 'profile', 'activity']`.
- **Dynamic params**: Next.js 16 pages receive `params: Promise<{ locale: string }>` — await it.

### Avatar Upload Flow

1. User taps avatar in ProfileEditModal
2. File input opens (accept: image/jpeg, image/png, image/webp)
3. POST file to `/api/v1/media` with `owner_type=USER`, `owner_id={user.id}` (multipart form)
4. Receive `{ id, url, width, height }` response
5. Set `avatarUrl` in the form state to the returned URL
6. On form save, PATCH `/api/v1/auth/profile` with `avatar_url: url`
7. Avatar preview updates immediately in the modal

The media module already handles: MIME validation (jpeg/png/webp only), 10MB max, auto-resize to 1200x1200, WebP conversion, EXIF stripping, DO Spaces upload.

### Interest Chips

Predefined interest options (store as string array in DB):
- `food` — グルメ / Ẩm thực / Food
- `cafe` — カフェ / Quán cà phê / Cafe
- `nightlife` — ナイトライフ / Giải trí đêm / Nightlife
- `outdoor` — アウトドア / Hoạt động ngoài trời / Outdoor
- `shopping` — ショッピング / Mua sắm / Shopping
- `family` — 家族 / Gia đình / Family
- `remote_work` — リモートワーク / Làm việc từ xa / Remote Work
- `fitness` — フィットネス / Thể dục / Fitness

### Existing Components to Reuse

| Component | Location | Usage |
|-----------|----------|-------|
| Modal | `shared/components/Modal.tsx` | Profile edit modal (partial variant) |
| Toast / useToast | `shared/components/Toast.tsx` | Success/error feedback |
| Skeleton | `shared/components/Skeleton.tsx` | Loading states |
| EmptyState | `shared/components/EmptyState.tsx` | No activity state |
| FilterChips | `shared/components/FilterChips.tsx` | Interest multi-select |
| PrimaryCTAButton | `shared/components/PrimaryCTAButton.tsx` | Save/edit buttons |
| SenpaiBadge | `modules/user/components/SenpaiBadge.tsx` | Badge display on profile (placeholder until Story 3.4) |
| ListingImage | `shared/components/ListingImage.tsx` | Avatar display with fallback |
| useAuthStore | `shared/stores/useAuthStore.ts` | Get/update current user state |
| apiClient | `shared/lib/apiClient.ts` | API calls with auto snake↔camel transform |

### Existing User Model Fields (auth module)

Current `User` model columns:
- `id` (UUID), `email`, `display_name`, `avatar_url`, `role`, `provider`, `provider_id`, `hashed_password`, `admin_sub_role`, `business_name`, `phone_number`, `zalo_contact`, `is_active`, `deletion_requested_at`, `created_at`, `updated_at`, `deleted_at`

**New columns needed**: `bio` (Text, nullable), `interests` (JSON array, nullable), `years_in_danang` (Integer, nullable)

### Existing Auth Endpoints

- `GET /api/v1/auth/me` → UserOut (already returns user profile)
- `PATCH /api/v1/auth/profile` → **NEW** (profile update)
- `GET /api/v1/auth/profile/stats` → **NEW** (profile stats)
- `GET /api/v1/auth/profile/activity` → **NEW** (activity timeline)

### Cross-Module Data Access for Stats

The `reviews` table exists (owned by review module). For the profile stats endpoint, the auth service can run a COUNT query on the reviews table directly (read-only, no module import). SQL: `SELECT COUNT(*) FROM reviews WHERE user_id = :user_id AND deleted_at IS NULL`.

Favorites are stored in the `listing_favorites` table (owned by listing module). SQL: `SELECT COUNT(*) FROM listing_favorites WHERE user_id = :user_id AND deleted_at IS NULL`. The `useFavoritesStore` (Zustand) is a frontend cache that hydrates from this backend table.

### Project Structure Notes

- Frontend route: `apps/web/app/(user)/[locale]/profile/page.tsx` (already exists as a directory with favorites/ and notifications/ subpages — the main page.tsx is missing)
- Frontend components: `apps/web/modules/user/components/ProfileHeader.tsx`, `ProfileEditModal.tsx`, `ProfileStats.tsx`, `ActivityTimeline.tsx`
- Frontend hook: `apps/web/modules/user/hooks/useUserProfile.ts`
- Backend: All changes in `backend/modules/auth/` — no new module
- Backend tests: `backend/tests/auth/test_profile.py`
- Migration: `backend/migrations/versions/{date}_add_user_profile_fields.py`

### Anti-Patterns to Avoid

- Do NOT create a separate `modules/profile/` backend module — profile lives in auth module
- Do NOT create a separate `modules/profile/` frontend module — profile components belong in `modules/user/components/`
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`
- Do NOT hardcode any Japanese text in components — all strings via `useTranslations("profile")`
- Do NOT use spinners for loading — use Skeleton
- Do NOT expose auto-increment IDs — use UUID v4
- Do NOT import review module directly in auth service — use raw DB query or event bus
- Do NOT use `any` type in TypeScript — use proper interfaces
- Do NOT duplicate Pydantic schemas as TypeScript types — auto-generate from OpenAPI
- Do NOT create a full-page form for edit — use Modal (partial variant) per UX pattern

### Previous Story Intelligence (Story 3.1)

- Story 3.1 was implemented with openai/gpt-5.4
- Frontend components placed in `modules/user/components/Onboarding*.tsx`
- Used `modules/user/lib/onboarding.ts` for API utilities and type definitions
- i18n namespace added as `onboarding` in all 3 locale files
- Tests co-located in `modules/user/components/__tests__/`
- Backend module followed standard structure: router, service, repository, models, schemas, constants, exceptions
- Auth callback pages needed Suspense boundary fix for Next.js build to pass
- `StepIndicator.tsx` created as reusable component

### Git Intelligence

Recent commits show:
- Pattern of feature commits with descriptive messages
- Story 3.1 commit: `create: launch onboarding flow and restore clean quality gates`
- Build verification is part of the workflow (Next.js build must pass)
- Lint checks (ruff for backend, ESLint for frontend) are standard

### References

- [Source: epics/epic-3-user-onboarding-senpai-profile-system.md#Story 3.2]
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns]
- [Source: architecture/project-structure-boundaries.md#Complete Project Directory Structure]
- [Source: architecture/implementation-patterns-consistency-rules.md#Naming Patterns]
- [Source: prd/functional-requirements.md#FR10, FR11]
- [Source: architecture/core-architectural-decisions.md#Authentication & Security]
- [Source: prd/web-application-architecture.md#Responsive Design]

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4 (backend), claude-opus-4-6 (frontend re-implementation)

### Debug Log References

- `python -m pytest backend/tests/auth/test_profile.py`
- `python -m pytest backend/tests`
- `python -m ruff check backend`
- `pnpm --filter web test`
- `pnpm --filter web lint`
- `pnpm --filter web build`

### Completion Notes List

- Added auth-owned backend profile fields, partial profile updates, stats aggregation, and activity timeline endpoints with regression coverage.
- Built the localized `/[locale]/profile` experience with profile header, edit modal, stats cards, activity timeline, and auth store synchronization.
- Added shared client infrastructure for TanStack Query, multipart-aware API uploads, reusable filter chips, and route-safe profile navigation links.
- Re-implemented frontend Tasks 6-13 with claude-opus-4-6: profile page route, ProfilePage container, ProfileHeader, ProfileEditModal (react-hook-form + Zod), ProfileStats, ActivityTimeline with pagination, useUserProfile hook (React Query), and 5 test files. All gates pass: 88 test files (366 tests), lint clean, build OK.

### File List

- `_bmad-output/implementation-artifacts/3-2-user-profile-page.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `apps/web/app/(user)/[locale]/profile/page.tsx`
- `apps/web/app/layout.tsx`
- `apps/web/messages/en.json`
- `apps/web/messages/ja.json`
- `apps/web/messages/vi.json`
- `apps/web/modules/user/components/ActivityTimeline.tsx`
- `apps/web/modules/user/components/ProfileEditModal.tsx`
- `apps/web/modules/user/components/ProfileHeader.tsx`
- `apps/web/modules/user/components/ProfilePage.tsx`
- `apps/web/modules/user/components/ProfileStats.tsx`
- `apps/web/modules/user/components/__tests__/ActivityTimeline.test.tsx`
- `apps/web/modules/user/components/__tests__/ProfileEditModal.test.tsx`
- `apps/web/modules/user/components/__tests__/ProfileHeader.test.tsx`
- `apps/web/modules/user/components/__tests__/ProfileStats.test.tsx`
- `apps/web/modules/user/components/__tests__/profileTestMessages.ts`
- `apps/web/modules/user/hooks/useUserProfile.ts`
- `apps/web/package.json`
- `apps/web/shared/components/BottomTabNav.tsx`
- `apps/web/shared/components/FilterChips.tsx`
- `apps/web/shared/components/TopNav.tsx`
- `apps/web/shared/components/index.ts`
- `apps/web/shared/lib/apiClient.ts`
- `apps/web/shared/providers/QueryProvider.tsx`
- `apps/web/shared/stores/useAuthStore.ts`
- `backend/migrations/versions/2026_04_23_0002_add_user_profile_fields.py`
- `backend/modules/auth/constants.py`
- `backend/modules/auth/models.py`
- `backend/modules/auth/repository.py`
- `backend/modules/auth/router.py`
- `backend/modules/auth/schemas.py`
- `backend/modules/auth/service.py`
- `backend/tests/auth/test_profile.py`
- `backend/tests/auth/test_router.py`
- `pnpm-lock.yaml`

## Change Log

- 2026-04-23: Implemented Story 3.2 profile backend/frontend flows, added tests, and cleared lint/build/test validation gates.
- 2026-04-24: Re-implemented frontend Tasks 6-13 (profile page route, header, edit modal, stats, activity timeline, hook, tests) with claude-opus-4-6. All 88 test files (366 tests) pass, lint clean, build succeeds.
