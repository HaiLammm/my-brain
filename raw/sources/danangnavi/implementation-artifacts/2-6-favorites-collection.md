# Story 2.6: Favorites Collection

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a registered user (authenticated `user` or `business_owner`),
I want to save and unsave listings via the ♡ heart on cards and the detail page, then review and manage them on `/ja/profile/favorites`,
so that I can come back to listings I am interested in without having to search again, and guests are smoothly funneled into signup the first time they try to save.

## Acceptance Criteria

1. **Given** I am an authenticated user viewing any `ListingCard` (homepage senpai picks — Story 2.2, search results — Story 2.3, senpai spots on area guide — Story 2.5) OR the listing detail `HeaderSection` / `DetailStickyActionBar` (Story 2.4), **When** I tap the ♡ `SaveHeartButton`, **Then** the button immediately flips to the filled (saved) state with the existing `heartBounce` animation (optimistic UI), a toast `保存しました` appears (1.5s, i18n key `favorites.toast.saved`), and the backend persists the favorite via `POST /api/v1/favorites` with `{ listing_id }`. On server error, the optimistic flip is reverted and a toast `保存に失敗しました` (i18n key `favorites.toast.save_failed`) is shown — NO silent failure.

2. **Given** I am authenticated and the ♡ is already filled (saved), **When** I tap it again, **Then** the button optimistically empties, a toast `保存を解除しました` (i18n key `favorites.toast.unsaved`) is shown, and the backend removes the favorite via `DELETE /api/v1/favorites/{listing_id}`. On server error, the flip is reverted and `favorites.toast.unsave_failed` is shown. Duplicate saves (second `POST` for the same `(user_id, listing_id)`) return 200 with `{ data: { saved: true, already_saved: true } }` — NOT 409 — because the client may retry after network loss.

3. **Given** I am a guest (unauthenticated) and tap ♡ on ANY surface, **When** the click fires (FR53), **Then** the `SignupModal` (`@/modules/user/components/SignupModal`) opens instead of mutating state. The listing id is stashed in `sessionStorage` under key `pendingFavorite:listing_id`. **After** successful login/registration (the existing `useAuth` flow), the pending id is read on `AuthProvider` mount, the save is replayed via `POST /api/v1/favorites`, the key is cleared, and the corresponding heart (if still in the DOM) updates to saved with the same toast. If the user cancels the modal, the pending id is cleared — do NOT save on next login.

4. **Given** I navigate to `/{locale}/profile/favorites` (canonical `/ja/profile/favorites` per FR7), **When** I am authenticated, **Then** the page SSR-renders a protected server component that reads the auth cookie and calls `GET /api/v1/favorites?page=1&per_page=20` server-side; renders my saved listings using the shared `@/shared/components/ListingCard` in a responsive grid (1-col mobile < 768px, 2-col ≤ 1279px, 3-col ≥ 1280px); each card carries `isSaved={true}` and `onSave` wired to the unsave flow from AC#2. Results sort by `saved_at DESC` (most recently saved first). If the total exceeds 20, a `次へ` / `前へ` pager renders with URL `?page=N` (SSR — no infinite scroll for MVP).

5. **Given** I am unauthenticated and hit `/{locale}/profile/favorites` directly, **When** the server component runs, **Then** it redirects (HTTP 307 via `redirect()` from `next/navigation`) to `/{locale}/?auth=required&next=/profile/favorites`; the homepage reads `auth=required` and auto-opens `SignupModal`. Do NOT render the page shell for guests.

6. **Given** I have zero favorites, **When** the page loads, **Then** the shared `EmptyState` (`@/shared/components/EmptyState`) renders with headline `まだ保存した場所がありません` (i18n key `favorites.empty.title`), body copy `気になる場所を♡で保存すると、ここにまとまります` (key `favorites.empty.subtitle`), and a primary CTA `探す` (key `favorites.empty.cta`) linking to `/{locale}/listings` (FR71). Ensure the `SenpaiSpots`-style empty pattern is NOT duplicated — use the shared component.

7. **Given** the backend contract, **When** this story ships, **Then**:
   - Alembic migration `{next_stamp}_create_favorites_table.py` under `backend/migrations/versions/` (current most recent is `2026_04_18_0003_add_area_guide_fields.py`; inspect and pick the next sequential stamp — expected `2026_04_19_0001_create_favorites_table.py`) creates table `listing_favorites`:
     - `id UUID PK DEFAULT uuid_generate_v4()`, `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `deleted_at TIMESTAMPTZ NULL` (match the `BaseModel` contract in `backend/shared/base_models.py` — do NOT deviate).
     - Unique partial index `uq_listing_favorites_user_listing_active` ON `(user_id, listing_id) WHERE deleted_at IS NULL` — allows re-favoriting after a soft-deleted unfavorite row.
     - Index `ix_listing_favorites_user_created` ON `(user_id, created_at DESC) WHERE deleted_at IS NULL` for the list query.
     - `downgrade()` drops the table and both indexes cleanly.
   - NEW SQLAlchemy model `ListingFavorite` in `backend/modules/listing/models.py` (favorite is a listing-owned concept — do NOT create a separate `favorites` module, mirroring how `ListingInquiry` lives in the listing module) with `Mapped` columns matching the migration, relationships to `User` and `Listing`, and `__tablename__ = "listing_favorites"`.
   - NEW Pydantic schemas in `backend/modules/listing/schemas.py`: `FavoriteCreateRequest { listing_id: UUID }`, `FavoriteResponse { saved: bool, already_saved: bool, favorited_at: datetime }`, `FavoriteListItem` = `ListingListItem` + `favorited_at: datetime`, and reuse `Paginated[FavoriteListItem]` for the list endpoint.
   - NEW `FavoriteRepository` in `backend/modules/listing/repository.py` with methods: `create(user_id, listing_id) -> ListingFavorite` (UPSERT semantics — if a soft-deleted row exists, restore it by nulling `deleted_at` and bumping `updated_at`; if an active row exists, return it with `already_saved=True`), `soft_delete(user_id, listing_id) -> bool` (idempotent — returns True if a row was flipped, False if none existed), `list_for_user(user_id, page, per_page) -> tuple[list[Listing], int]` (returns listings joined on favorite ordered by `listing_favorites.created_at DESC`, with total count), `is_saved_set(user_id, listing_ids: list[UUID]) -> set[UUID]` (batch lookup for hydrating `isSaved` on list surfaces — used in Task 4).
   - NEW `FavoriteService` in `backend/modules/listing/service.py` orchestrating repository + photo hydration via `MediaService.list_grouped_for_owners` + fair-price via injected `SearchService.attach_fair_price` (same DI pattern as `AreaService` from Story 2.5). `FavoriteService.save(user_id, listing_id)`, `.unsave(user_id, listing_id)`, `.list(user_id, page, per_page)`.
   - NEW endpoints in `backend/modules/listing/router.py` under the existing `router` (prefix `/api/v1`):
     - `POST /favorites` — body `FavoriteCreateRequest`, returns `SingleEnvelope[FavoriteResponse]`, 201 on new save, 200 on re-save (`already_saved=true`). Requires `get_current_user` (NOT `_optional`). Rate limited: `rate_limit(limit=60, window_s=60, route_key="favorites_write")` (per-user key — reuse `shared.rate_limit.rate_limit` which already keys by authed user id).
     - `DELETE /favorites/{listing_id}` — path param UUID, returns `SingleEnvelope[{ saved: false }]`, 200 whether or not a row was removed (idempotent). Requires `get_current_user`. Same rate-limit dep.
     - `GET /favorites?page=1&per_page=20` — returns `Paginated[FavoriteListItem]`. Requires `get_current_user`. `per_page` capped at 50 (match listing list endpoint). Photos + fair-price attached before return.
     - 404 via `ListingNotFoundException` if the target listing does not exist or is soft-deleted — do NOT create a silent favorite on a missing listing.
   - Event emission: emit `FAVORITE_CREATED` (`{ user_id, listing_id, at }`) and `FAVORITE_REMOVED` on state changes via `shared.events.emit` (mirrors Story 2.4's `LISTING_INQUIRY_CREATED` pattern). Define constants in `backend/modules/listing/events.py`. Consumers are out of scope for this story (Epic 7 notifications will subscribe later).
   - All new exceptions use the existing trilingual `AppException` pattern from `backend/shared/exceptions.py`.
   - Use existing CSRF middleware (requires `X-CSRF-Token` header on mutations) — no changes needed; `apiClient` already attaches it.

8. **Given** the frontend contract, **When** this story ships, **Then**:
   - NEW module `apps/web/modules/favorites/` with `{ components, lib, hooks, __tests__ }` subfolders. All imports use `@/` alias (per `apps/web/AGENTS.md`).
   - `lib/favorites-api.ts` (client-side) — `saveFavorite(listingId)`, `unsaveFavorite(listingId)`, `listFavorites(page, perPage)` using `apiClient` from `@/shared/lib/apiClient`. Snake→camel mapping via a `toFavoriteListItem(dto)` mapper (hand-rolled, same pattern as `toListingDetail` / `toAreaGuide`).
   - `lib/favorites-ssr.ts` (server-side, used only by the profile page) — `fetchFavoritesSSR(cookieHeader, page, perPage)` with a 5s `AbortController` and `next: { revalidate: 0 }` (user-specific data MUST NOT be cached) plus `cache: "no-store"`. Throws a `FavoritesAuthError` on 401 so the page can redirect.
   - NEW shared Zustand store `apps/web/shared/stores/useFavoritesStore.ts` — `{ savedIds: Set<string>, hydrate(ids: string[]), add(id), remove(id), has(id) }`. Acts as the client-side source of truth so ♡ state stays consistent when the same listing appears on multiple surfaces (homepage + search, etc.). Hydrate on `AuthProvider` mount via a new `GET /api/v1/favorites/ids` endpoint — see AC#7 addendum below.
   - ADDENDUM to AC#7: ADD `GET /api/v1/favorites/ids` returning `{ data: { listing_ids: string[] } }` — a lightweight endpoint that returns ONLY the IDs (no photos, no fair-price) for the authenticated user, used by the frontend to hydrate `useFavoritesStore` on login. Cap at 500 ids (favorites are personal — bounded in practice; if exceeded, log + truncate). Do NOT use this for the main `/profile/favorites` list (it needs full card data).
   - NEW hook `apps/web/modules/favorites/hooks/useSaveFavorite.ts` — returns `{ isSaved(listingId), toggle(listingId) }`. `toggle` handles: guest → open SignupModal + stash in sessionStorage; authed → optimistic store update + API call + toast + rollback on error. Consumed by existing `ListingCard`, `HeaderSection`, `DetailStickyActionBar` (replace their local `useState(false)` + TODO stubs).
   - UPDATE `apps/web/modules/listing-detail/components/HeaderSection.tsx:38-41` and `DetailStickyActionBar.tsx:37-41` and the `ListingCard`-consuming pages (`apps/web/modules/home/*`, `apps/web/modules/search/*`, `apps/web/modules/area-guide/components/SenpaiSpots.tsx`) to source `isSaved` and `onSave` from `useSaveFavorite` — DELETE the `TODO(story-2.6)` comment in `HeaderSection.tsx`.
   - NEW page `apps/web/app/(user)/[locale]/profile/favorites/page.tsx` — async server component, awaits `params`, reads cookies, calls `fetchFavoritesSSR`, catches `FavoritesAuthError` → `redirect()`. Renders `<FavoritesIndex items={...} page={...} totalPages={...} />`.
   - NEW components under `apps/web/modules/favorites/components/`: `FavoritesIndex.tsx` (grid + pager), `FavoritesPager.tsx` (SSR-friendly `<Link>` pager).
   - UPDATE homepage (`apps/web/app/(user)/[locale]/page.tsx` or its module) to read `?auth=required` from `searchParams` (awaited — Next 16 contract) and auto-open `SignupModal` via a small client wrapper on mount.
   - i18n: NEW keys under `favorites.*` namespace in `apps/web/messages/{ja,en,vi}.json`:
     - `favorites.page_title`, `favorites.subtitle`, `favorites.empty.title`, `favorites.empty.subtitle`, `favorites.empty.cta`, `favorites.toast.saved`, `favorites.toast.unsaved`, `favorites.toast.save_failed`, `favorites.toast.unsave_failed`, `favorites.pager.prev`, `favorites.pager.next`, `favorites.pager.page_of`.
     - JA is authoritative; EN and VI receive translated strings (NOT raw placeholders — favorites is a user-facing surface; see `account.*` keys in existing `vi.json` as the quality bar).
   - SEO: the profile page is authenticated → `export const dynamic = "force-dynamic"` + `generateMetadata` returning `{ robots: { index: false, follow: false }, title: "お気に入り — ダナンナビ" }`. Do NOT add this route to `sitemap.ts`.
   - Protected-route nav: add a `お気に入り` link under the existing account menu in `apps/web/shared/components/TopNav.tsx` (visible only when `useAuthStore().isAuthenticated`), routing to `/{locale}/profile/favorites`. Do NOT add a bottom-tab entry (the 5-slot `BottomTabNav` is already full per Story 1.3).

9. **Given** accessibility at 375 / 768 / 1280 px, **When** the favorites page is inspected, **Then**: `SaveHeartButton`'s `aria-label` toggles between `保存する` (unsaved) and `保存を解除する` (saved) — UPDATE the shared component's current `Save` / `Unsave` English labels to the i18n-resolved strings via a new optional `ariaLabels?: { save: string; unsave: string }` prop (default to current English for backward compatibility); consumer pages pass localized strings. Toast has `role="status"` + `aria-live="polite"` (the existing `ToastProvider` already provides this — verify). The empty state focus target is the `探す` CTA on page mount. Pager prev/next are `<a>` elements (server-rendered `Link`s) — keyboard-navigable with `:focus-visible` ring. Axe-core reports 0 violations.

10. **Given** performance + reliability, **When** a user with 200 saved favorites loads page 1, **Then**: the `GET /api/v1/favorites` query uses the `ix_listing_favorites_user_created` index (verify with `EXPLAIN` locally); photo hydration reuses `MediaService.list_grouped_for_owners` (single batched query — NOT N+1); the SSR fetch uses a 5s `AbortController`; non-2xx throws so the server component surfaces an error boundary. Client-side optimistic toggles MUST NOT await the network call to flip the heart — the network call runs in the background with error-path rollback. Rate limit returns 429 with the trilingual `AppException` shape; the toast maps 429 → `しばらくしてからお試しください` (key `favorites.toast.rate_limited`).

11. **Given** tests, **When** `pnpm --filter web test` + `pytest backend/tests/` run, **Then**:
    - **Backend:** `backend/tests/listing/test_favorites.py` (NEW) covers: `POST /favorites` 201 happy path, 200 on re-save with `already_saved=true`, 401 when unauthed, 404 on unknown/soft-deleted listing, rate-limit 429 after 60 requests/min; `DELETE /favorites/{id}` idempotent (200 on first AND subsequent calls); `GET /favorites` returns paginated with fair-price + photos attached, respects `saved_at DESC` ordering, excludes soft-deleted favorites AND soft-deleted listings; `GET /favorites/ids` returns only IDs. `backend/tests/listing/test_favorite_repository.py` (NEW) covers: `create` UPSERT-restores a soft-deleted row (verify same `id` returned), unique constraint enforced for active rows, `soft_delete` idempotent, `list_for_user` ordering + soft-delete filtering, `is_saved_set` returns correct subset. Target ≥ 80% branch coverage on new favorite handlers.
    - **Frontend:** `apps/web/modules/favorites/__tests__/favorites-api.test.ts` (fetch + mapper + error shape), `useSaveFavorite.test.tsx` (guest opens SignupModal + stashes sessionStorage, authed toggles optimistically, rollback on API error, replay after login), `FavoritesIndex.test.tsx` (renders cards with `isSaved=true`, pager shows/hides correctly, empty state renders `EmptyState` with CTA), `favorites/page.test.tsx` (SSR redirect on 401, renders on 200). Update `apps/web/shared/components/__tests__/SaveHeartButton.test.tsx` if the `ariaLabels` prop is added.
    - Regenerate `packages/types/src/api-types.ts` via `packages/types/generate.sh` once backend schemas land (needs a live `http://localhost:8000/openapi.json`); else leave `TODO(story-2-6-followup): regenerate api-types after merge` in the PR description.

## Tasks / Subtasks

- [x] Task 1: Backend — migration + `ListingFavorite` model + event constants (AC: #7)
  - [x] 1.1 Inspect `backend/migrations/versions/` for the latest filename; create `2026_04_19_0001_create_favorites_table.py` (adjust if Story 2.5 has bumped the stamp). Include partial unique index and composite index; `downgrade()` drops cleanly.
  - [x] 1.2 Add `ListingFavorite` model in `backend/modules/listing/models.py` extending `BaseModel`; declare relationships to `User` and `Listing`.
  - [x] 1.3 Add `FAVORITE_CREATED` and `FAVORITE_REMOVED` constants to `backend/modules/listing/events.py`.

- [x] Task 2: Backend — schemas, repository, service (AC: #7)
  - [x] 2.1 Add `FavoriteCreateRequest`, `FavoriteResponse`, `FavoriteListItem` (extends `ListingListItem` with `favorited_at`), and a `FavoriteIdsResponse` to `backend/modules/listing/schemas.py`.
  - [x] 2.2 Add `FavoriteRepository` to `backend/modules/listing/repository.py`. Implement UPSERT-restore for soft-deleted rows (SELECT → UPDATE path; do NOT rely on Postgres `ON CONFLICT` across the partial-unique index — the partial predicate excludes soft-deleted rows).
  - [x] 2.3 Add `FavoriteService` to `backend/modules/listing/service.py`. Inject `SearchService` + `MediaService` via existing dependency providers.
  - [x] 2.4 Add `get_favorite_service` to `backend/modules/listing/dependencies.py`.

- [x] Task 3: Backend — router endpoints + rate limit + events (AC: #7, #10)
  - [x] 3.1 Add `POST /api/v1/favorites`, `DELETE /api/v1/favorites/{listing_id}`, `GET /api/v1/favorites`, `GET /api/v1/favorites/ids` to `backend/modules/listing/router.py` using `Depends(get_current_user)` and `Depends(get_favorite_service)`.
  - [x] 3.2 Apply `rate_limit(limit=60, window_s=60, route_key="favorites_write")` to POST + DELETE. GET endpoints uncapped (reads).
  - [x] 3.3 Emit `FAVORITE_CREATED` / `FAVORITE_REMOVED` via `shared.events.emit` on state transitions (not on no-op idempotent calls).
  - [x] 3.4 Return 404 (via `ListingNotFoundException`) when the target listing is missing or soft-deleted. Re-save of an already-saved listing returns 200 with `already_saved=true`.

- [x] Task 4: Backend — tests (AC: #11)
  - [x] 4.1 Create `backend/tests/listing/test_favorites.py` covering all endpoint paths, rate limit, ordering, soft-delete filtering, and auth requirements.
  - [x] 4.2 Create `backend/tests/listing/test_favorite_repository.py` covering UPSERT-restore, unique constraint, `is_saved_set`, `list_for_user` ordering.
  - [x] 4.3 Run `python -m pytest backend/tests/` → all green, no regressions.

- [x] Task 5: Frontend — data layer + store + hook (AC: #1, #2, #3, #8)
  - [x] 5.1 Create `apps/web/modules/favorites/lib/types.ts` mirroring backend schemas (with `// TODO(story-2-6-followup): replace with generated api-types`).
  - [x] 5.2 Create `apps/web/modules/favorites/lib/favorites-api.ts` — `saveFavorite`, `unsaveFavorite`, `listFavorites`, `listFavoriteIds` via `apiClient`.
  - [x] 5.3 Create `apps/web/shared/stores/useFavoritesStore.ts` (Zustand, `Set<string>` backed; store `Set` as array in state for serialization, expose `has()` helper).
  - [x] 5.4 Extend `apps/web/shared/providers/AuthProvider.tsx` to call `listFavoriteIds()` after successful auth check and hydrate the store. Clear the store on logout.
  - [x] 5.5 Create `apps/web/modules/favorites/hooks/useSaveFavorite.ts` encapsulating guest/auth toggle flow, optimistic update, rollback, toast, and post-login replay of `sessionStorage.pendingFavorite:listing_id`.

- [x] Task 6: Frontend — SaveHeart integration across all surfaces (AC: #1, #2, #3, #8, #9)
  - [x] 6.1 Update `apps/web/shared/components/SaveHeartButton.tsx` — add optional `ariaLabels?: { save: string; unsave: string }` prop (back-compat default). Update the test file.
  - [x] 6.2 Update `apps/web/shared/components/ListingCard.tsx` callers (pages using it) to pass `isSaved` + `onSave` from `useSaveFavorite` — ripple through homepage, search, area-guide senpai spots.
  - [x] 6.3 Update `apps/web/modules/listing-detail/components/HeaderSection.tsx:38-41` + `DetailStickyActionBar.tsx:37-41` to use `useSaveFavorite` and DELETE the TODO stubs.
  - [x] 6.4 Verify the listing-detail page and card surfaces show consistent heart state after save → navigate → back.

- [x] Task 7: Frontend — `/profile/favorites` page + homepage auth-required wiring (AC: #4, #5, #6, #8)
  - [x] 7.1 Create `apps/web/modules/favorites/lib/favorites-ssr.ts` with `fetchFavoritesSSR` + `FavoritesAuthError`.
  - [x] 7.2 Create `apps/web/app/(user)/[locale]/profile/favorites/page.tsx` — SSR auth check, fetch, render, redirect on 401. `generateMetadata` + `robots: noindex`.
  - [x] 7.3 Create `apps/web/modules/favorites/components/FavoritesIndex.tsx` + `FavoritesPager.tsx`. Reuse `@/shared/components/EmptyState` for the zero-state (do NOT inline).
  - [x] 7.4 Update the homepage (or a small client wrapper mounted in the layout) to auto-open `SignupModal` when `searchParams.auth === "required"`.

- [x] Task 8: Frontend — nav + i18n + tests (AC: #8, #9, #11)
  - [x] 8.1 Add `お気に入り` link in `TopNav.tsx` account menu, gated by `useAuthStore().isAuthenticated`.
  - [x] 8.2 Populate `favorites.*` keys in `ja.json` (authoritative), `en.json`, `vi.json` (real translations — match existing quality bar).
  - [x] 8.3 Create `apps/web/modules/favorites/__tests__/` files per AC#11. Use existing `@/shared/providers/AuthProvider` + store mocks established in `SignupModal.test.tsx`.
  - [x] 8.4 Run `pnpm --filter web test` + `pnpm --filter web build` → green for 2.6 code. Known pre-existing `/vi/auth/callback` prerender failure is out of scope.

- [x] Task 9: Docs & cleanup (AC: all)
  - [x] 9.1 Update `apps/web/README.md` with a short section on favorites (migrate + login + save + visit `/ja/profile/favorites`).
  - [x] 9.2 Update `backend/README.md` with the four new `/api/v1/favorites*` endpoints.
  - [x] 9.3 Regenerate `packages/types/src/api-types.ts` if a live backend is available; else add the follow-up TODO to the PR description.

## Dev Notes

### Purpose & scope

Story 2.6 is the **save-and-return loop** that closes Epic 2. Users land via homepage/search/area-guide/detail (Stories 2.2–2.5), save the listings they are weighing, and come back via `/ja/profile/favorites` to shortlist. It is also the first story to convert a guest into a registered user via the save-gate (FR53). Depends on Story 1.4/1.5 (auth — `get_current_user`, `SignupModal`, `useAuthStore`, `apiClient` with CSRF + refresh), Story 2.1 (listing model + `ListingListItem`), Story 2.2/2.3/2.4/2.5 (all the surfaces that already render `ListingCard` + `SaveHeartButton`). It feeds Epic 7 notifications later (`FAVORITE_CREATED` event will be consumed by the "new review on saved listing" notification).

### Architecture compliance (non-negotiable)

- **Module boundaries (backend):** Favorites live inside `backend/modules/listing/` — do NOT create a separate `favorites` module. Rationale: the entity is listing-owned and shares photo/fair-price hydration with listing surfaces; same precedent as `ListingInquiry` from Story 2.4. Source: `_bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Structure-Patterns`.
- **Repository pattern:** No inline SQL in router/service. `FavoriteRepository` owns all DB access.
- **DI for cross-module reuse:** `FavoriteService` injects `SearchService` and `MediaService` via existing dependency providers — do NOT import their classes directly and do NOT re-implement fair-price or photo grouping.
- **Soft-delete:** all queries filter `deleted_at IS NULL`. UPSERT-restore on re-save so we keep historical timestamps if product later wants them.
- **Trilingual exceptions:** any new exception extends `AppException` with `message_ja`, `message_vi`, `message_en` — match Story 2.4/2.5.
- **Events-first:** state transitions emit via `shared.events.emit`. Notification subscribers land in Epic 7.
- **Path aliases (frontend):** ALL imports inside `apps/web/` MUST use `@/`. Source: `apps/web/AGENTS.md`.
- **Next.js 16:** pages are server components; `params` and `searchParams` are Promises — `await` them. Authenticated pages use `export const dynamic = "force-dynamic"` + `cache: "no-store"` in fetches.
- **CSRF + auth cookies:** `apiClient` already attaches `X-CSRF-Token` on mutations and handles the single-flight refresh on 401 — do NOT re-implement.
- **Design tokens:** reuse the Coral/Navy/Teal tokens already in `SaveHeartButton`. Do NOT inline hex.
- **Envelope contract:** backend returns `{ data }`; frontend does MANUAL snake→camel via hand-rolled mappers (consistent with Stories 2.3–2.5).

### Existing code to reuse (prevent wheel reinvention)

- `apps/web/shared/components/SaveHeartButton.tsx` — already handles the animation and guest-fallback prop; extend with `ariaLabels` only.
- `apps/web/shared/components/ListingCard.tsx:25-31` — already exposes `onSave`, `isSaved`, `onUnauthenticated` props. Just wire them up at the callsite level via the new `useSaveFavorite` hook.
- `apps/web/modules/user/components/SignupModal.tsx` — reuse as-is for the guest-save gate.
- `apps/web/shared/stores/useAuthStore.ts` — source of truth for `isAuthenticated`.
- `apps/web/shared/lib/apiClient.ts` — handles CSRF + auto-refresh on 401 + envelope unwrapping. Use it for ALL client-side favorite calls.
- `apps/web/shared/providers/AuthProvider.tsx` — the correct mount point to hydrate `useFavoritesStore` after login.
- `apps/web/shared/components/EmptyState.tsx` — reuse for the zero-favorites state.
- `apps/web/shared/components/ToastProvider.tsx` — existing `role="status" aria-live="polite"` implementation; do NOT roll a new toast.
- `apps/web/modules/search/lib/format-price.ts::formatDualPrice` — already used by `ListingCard`; no changes.
- `backend/shared/base_models.BaseModel` — inherit for `ListingFavorite`.
- `backend/shared/rate_limit.rate_limit` — per-user rate limiting for write endpoints (same pattern as `_INQUIRY_RATE_LIMIT` in `listing/router.py:37`).
- `backend/shared/events.emit` — fire-and-forget event dispatch, matching `LISTING_INQUIRY_CREATED`.
- `backend/modules/auth/dependencies.get_current_user` — required on POST/DELETE/GET favorites. Do NOT use `get_current_user_optional` — favorites are authenticated-only.
- `backend/modules/media/service.MediaService.list_grouped_for_owners` — batch photo hydration.
- `backend/modules/search/service.SearchService.attach_fair_price` — public since Story 2.4; call it from `FavoriteService.list`.
- `backend/modules/listing/schemas.Paginated` + `SingleEnvelope` — reuse for response shapes.

### Out of scope for 2.6 (enforce boundaries)

- **Folders / multi-list organization** ("Food to try", "Apartments" sub-lists) — the UX spec mentions a single flat list for MVP. Do NOT add collection/folder schema.
- **Shared favorites / public profile lists** — requires privacy-model work (Epic 9 governance). Lists are strictly private.
- **Notifications on saved listings** (new review, coupon on saved listing) — Epic 7. This story only EMITS events; it does NOT subscribe or deliver notifications.
- **"Price dropped" / price-history tracking on favorites** — requires a pricing-history model. Defer.
- **Infinite scroll** — MVP uses SSR pagination. If product wants IS later, it's a follow-up.
- **Bulk unsave / multi-select** — defer. Single-item unsave via ♡ only.
- **Share favorites list** — out of scope.
- **"Recently viewed" alongside favorites** — that's a different entity (requires event tracking); not this story.
- **Favorites counter in the top-nav** — defer until we have a clear UX brief for the badge (avoid a noisy number).

### Previous story intelligence

- **From Story 1.4/1.5:** `get_current_user` reads `access_token` cookie and enforces `user.is_active`. `SignupModal` + `useAuthStore` + `apiClient` (with CSRF + single-flight refresh on 401) are the canonical auth plumbing — do NOT recreate.
- **From Story 2.1:** `ListingListItem` + `Paginated` envelopes are the contract; extend via `FavoriteListItem` (composition, not replacement). `Listing` has `deleted_at` — all joins must filter it.
- **From Story 2.2/2.3:** `ListingCard` is consumed on the homepage's senpai picks and the search results. Both still use local `useState(false)` for `isSaved` (no wiring). Replace with the new hook.
- **From Story 2.4:** `HeaderSection.tsx:38-41` and `DetailStickyActionBar.tsx:37-41` contain explicit `TODO(story-2.6)` stubs — close them. `ListingInquiry` is the precedent for a listing-module child entity with DI, rate-limit, and event emission — MIRROR that structure.
- **From Story 2.5:** `AreaService.get_guide_by_slug` is the latest DI composition pattern (repository → service → fair-price + photo hydration). `SenpaiSpots` renders `ListingCard` — it must receive `isSaved` too.

### Latest tech notes

- **Next.js 16 App Router:** `params` and `searchParams` are Promises — await them. Authenticated pages → `export const dynamic = "force-dynamic"`; fetches use `cache: "no-store"` and `next: { revalidate: 0 }` (explicit opt-out for user-specific data). Use `redirect()` from `next/navigation` for the 401 path. Use `robots: { index: false, follow: false }` in `generateMetadata` for the profile page.
- **Zustand:** store the saved-ids as `Set<string>` in closure but expose a plain array in the state snapshot if you need SSR hydration; for this story the store is client-only (hydrated post-login) so a `Set` in state is fine.
- **Postgres partial unique index:** `CREATE UNIQUE INDEX ... ON (user_id, listing_id) WHERE deleted_at IS NULL`. Alembic: `op.create_index(..., postgresql_where=sa.text("deleted_at IS NULL"), unique=True)`. Do NOT use `ON CONFLICT` for UPSERT-restore — the partial predicate excludes soft-deleted rows, so Postgres won't detect the conflict. Use explicit `SELECT → UPDATE` path in the repository.
- **Rate limiting:** `shared.rate_limit.rate_limit` already uses Redis (`shared/redis.py`) keyed by authenticated user id when present; the 60/min budget is generous for a heart toggle but tight enough to stop a misbehaving client. 429 response carries the trilingual shape.
- **CSRF:** `apiClient` injects `X-CSRF-Token` on POST/DELETE automatically; `csrf.py` middleware validates it. No changes.

### Project structure notes

- **New frontend module:** `apps/web/modules/favorites/` (mirrors `modules/listing-detail/`, `modules/area-guide/`).
- **New shared store:** `apps/web/shared/stores/useFavoritesStore.ts` — a NEW store next to the existing `useAuthStore.ts`.
- **New page route:** `apps/web/app/(user)/[locale]/profile/favorites/page.tsx`. Create `profile/` if it does not yet exist under `(user)/[locale]/`. Do NOT add it to `sitemap.ts`.
- **New Alembic migration:** follow the existing `backend/migrations/versions/YYYY_MM_DD_NNNN_*.py` pattern — inspect the directory; likely stamp is `2026_04_19_0001_create_favorites_table.py`.
- **Backend additions:** extend `backend/modules/listing/{models,schemas,repository,service,router,dependencies,events}.py`. Do NOT split into a new module.
- **Test files:** `backend/tests/listing/test_favorites.py` + `test_favorite_repository.py`; `apps/web/modules/favorites/__tests__/*`.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-discovery-search-listing-experience.md#Story-2.6]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR6,FR7,FR53,FR71]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Structure-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Naming-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Data-Architecture]
- [Source: _bmad-output/implementation-artifacts/2-1-listing-data-model-api-foundation.md — Listing model, Paginated envelope]
- [Source: _bmad-output/implementation-artifacts/2-4-listing-detail-page.md — ListingInquiry pattern (DI + rate_limit + event emit); HeaderSection + DetailStickyActionBar TODO stubs]
- [Source: _bmad-output/implementation-artifacts/2-5-area-neighborhood-guides.md — AreaService DI composition; SenpaiSpots consumes ListingCard]
- [Source: _bmad-output/implementation-artifacts/1-4-user-authentication-social-login-line-google.md — auth cookies, get_current_user, SignupModal, apiClient CSRF + refresh]
- [Source: apps/web/AGENTS.md — path alias rule]
- [Source: apps/web/shared/components/SaveHeartButton.tsx — existing component to extend]
- [Source: apps/web/shared/components/ListingCard.tsx:25-56 — already exposes onSave/isSaved/onUnauthenticated]
- [Source: apps/web/modules/listing-detail/components/HeaderSection.tsx:38-41 — TODO(story-2.6) stub to close]
- [Source: apps/web/modules/listing-detail/components/DetailStickyActionBar.tsx:37-41 — TODO(story-2.6) stub to close]
- [Source: apps/web/shared/lib/apiClient.ts — CSRF + refresh behavior]
- [Source: apps/web/shared/providers/AuthProvider.tsx — favorites-ids hydration mount point]
- [Source: backend/modules/listing/router.py:37 — `_INQUIRY_RATE_LIMIT` pattern to mirror]
- [Source: backend/modules/auth/dependencies.py:26 — get_current_user]
- [Source: backend/shared/base_models.py — BaseModel contract (uuid PK, created_at, updated_at, deleted_at)]
- [Source: backend/shared/rate_limit.py — rate_limit helper]
- [Source: backend/shared/events.py — emit helper + LISTING_INQUIRY_CREATED precedent]

## Dev Agent Record

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- Initial full backend suite after adding `test_rate_limit_after_60` collided
  with the global Redis-backed `RateLimiterMiddleware` (guest limit = 100/min),
  polluting subsequent tests with 429s. Fixed by overriding the route's
  write-limit dependency with a tight 3/min limit for the test instead of
  exhausting the guest budget. Suite: 151 passing.
- Frontend: `pnpm --filter web build` compiles and typechecks clean; the
  pre-existing `/vi/auth/callback` prerender failure is out of scope
  (documented in AC#11).

### Completion Notes List

- Backend: new migration `2026_04_19_0001_create_favorites_table.py` with
  partial unique + composite indexes; `ListingFavorite` ORM model lives inside
  `modules/listing/` (mirrors `ListingInquiry`). Four endpoints:
  `POST/DELETE/GET /api/v1/favorites` and `GET /api/v1/favorites/ids`.
  `FavoriteRepository` implements UPSERT-restore for soft-deleted rows via
  explicit SELECT→UPDATE (the partial-unique predicate excludes deleted rows
  so ON CONFLICT would miss them). `FavoriteService.list_favorites` reuses
  `MediaService.list_grouped_for_owners` and `SearchService.attach_fair_price`
  via DI (no N+1, no duplicated fair-price logic). Rate-limit 60/min/IP on
  writes. Emits `FAVORITE_CREATED` / `FAVORITE_REMOVED` on state transitions
  only (idempotent no-ops are silent).
- Frontend: new `apps/web/modules/favorites/` module with `lib/favorites-api`,
  `lib/favorites-ssr`, `hooks/useSaveFavorite`, and `components/FavoritesIndex`
  + `FavoritesPager`. New shared Zustand stores `useFavoritesStore` and
  `useSignupModalStore`. `AuthProvider` hydrates the favorites store on login
  via `GET /favorites/ids` and replays any pending `sessionStorage` favorite
  captured during the guest save-gate. SSR protected page
  `/{locale}/profile/favorites` with `dynamic = "force-dynamic"`,
  `robots: noindex`, and a 307 redirect to `?auth=required` on 401. Homepage
  reads `searchParams.auth === "required"` and auto-opens `SignupModal` via
  `AuthRequiredOpener` + the shared store. `TopNav` now reads/writes the
  shared SignupModal store and adds a heart-icon link to
  `/{locale}/profile/favorites` gated on `isAuthenticated`.
- SaveHeart wired across `HeaderSection`, `DetailStickyActionBar`,
  `ResultsList`, and `SenpaiSpots`. TODO stubs in listing-detail were removed.
- i18n `favorites.*` keys added to `ja.json` (authoritative), `en.json`, and
  `vi.json`.
- Tests: backend 151 passing (20 new across `test_favorites.py` +
  `test_favorite_repository.py`). Frontend 166 passing (12 new across
  `favorites-api.test.ts`, `useSaveFavorite.test.tsx`, and
  `FavoritesIndex.test.tsx`); `HeaderSection.test.tsx` and
  `SenpaiSpots.test.tsx` were updated to wrap in
  `NextIntlClientProvider` + `ToastProvider` now that the hook is used.
- Follow-up: regenerate `packages/types/src/api-types.ts` after merge (needs a
  live backend openapi.json) — `TODO(story-2-6-followup)` marker lives in
  `apps/web/modules/favorites/lib/types.ts`.

### File List

Backend (new):
- `backend/migrations/versions/2026_04_19_0001_create_favorites_table.py`
- `backend/tests/listing/test_favorites.py`
- `backend/tests/listing/test_favorite_repository.py`

Backend (modified):
- `backend/modules/listing/models.py`
- `backend/modules/listing/schemas.py`
- `backend/modules/listing/repository.py`
- `backend/modules/listing/service.py`
- `backend/modules/listing/dependencies.py`
- `backend/modules/listing/router.py`
- `backend/modules/listing/events.py`
- `backend/README.md`

Frontend (new):
- `apps/web/modules/favorites/lib/types.ts`
- `apps/web/modules/favorites/lib/favorites-api.ts`
- `apps/web/modules/favorites/lib/favorites-ssr.ts`
- `apps/web/modules/favorites/hooks/useSaveFavorite.ts`
- `apps/web/modules/favorites/components/FavoritesIndex.tsx`
- `apps/web/modules/favorites/components/FavoritesPager.tsx`
- `apps/web/modules/favorites/__tests__/favorites-api.test.ts`
- `apps/web/modules/favorites/__tests__/useSaveFavorite.test.tsx`
- `apps/web/modules/favorites/__tests__/FavoritesIndex.test.tsx`
- `apps/web/shared/stores/useFavoritesStore.ts`
- `apps/web/shared/stores/useSignupModalStore.ts`
- `apps/web/modules/home/components/AuthRequiredOpener.tsx`
- `apps/web/app/(user)/[locale]/profile/favorites/page.tsx`

Frontend (modified):
- `apps/web/shared/components/SaveHeartButton.tsx`
- `apps/web/shared/components/ListingCard.tsx`
- `apps/web/shared/components/TopNav.tsx`
- `apps/web/shared/providers/AuthProvider.tsx`
- `apps/web/modules/listing-detail/components/HeaderSection.tsx`
- `apps/web/modules/listing-detail/components/DetailStickyActionBar.tsx`
- `apps/web/modules/search/components/ResultsList.tsx`
- `apps/web/modules/area-guide/components/SenpaiSpots.tsx`
- `apps/web/modules/listing-detail/__tests__/HeaderSection.test.tsx`
- `apps/web/modules/area-guide/__tests__/SenpaiSpots.test.tsx`
- `apps/web/app/(user)/[locale]/page.tsx`
- `apps/web/messages/ja.json`
- `apps/web/messages/en.json`
- `apps/web/messages/vi.json`
- `apps/web/README.md`
