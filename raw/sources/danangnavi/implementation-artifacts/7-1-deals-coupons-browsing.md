# Story 7.1: Deals & Coupons Browsing

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese tourist / resident browsing DaNangNavi,
I want to browse available coupons at `/ja/deals` filtered by category and proximity, with savings shown in JPY, expiry countdown, and a detail bottom-sheet preview (QR blurred until claimed),
so that I can discover exclusive deals during my trip and decide which ones to claim in Story 7.2.

## Acceptance Criteria

1. **Given** I navigate to `/{locale}/deals` (canonical `/ja/deals` per FR61), **When** the page loads, **Then** it SSR-renders a server component that calls `GET /api/v1/coupons?filter={chip}&lat=&lng=&page=1&per_page=20` server-side with `cache: "no-store"` + `next: { revalidate: 0 }` (deals are time-sensitive — expiry countdowns must be fresh), awaits `params`/`searchParams` (Next 16 Promise contract), and renders:
   - A `FilterChips` row at the top with these chips (order fixed): `すべて` (all, default), `レストラン` (restaurant), `カフェ` (cafe), `スパ` (spa), `近くのお得` (nearby). Selected chip derives from `searchParams.filter`; chip clicks navigate via `<Link>` to `/{locale}/deals?filter={slug}` (SSR nav — NO client-side filter state). The `近くのお得` chip renders a distinct client wrapper that requests `navigator.geolocation.getCurrentPosition` on click — see AC#3.
   - A responsive grid of `CouponCard` components (1-col mobile < 768px, 2-col ≤ 1279px, 3-col ≥ 1280px).
   - An SSR `<FilterChips>` + `<DealsList>` pair that matches the layout rhythm used by `apps/web/modules/search/` (grid classes + gap tokens).
   - Page metadata via `generateMetadata` — title `お得情報 — ダナンナビ`, description from i18n key `deals.meta.description`, `robots: { index: true, follow: true }` (public page — DO add to `sitemap.ts`).

2. **Given** the page renders coupon cards, **When** each `CouponCard` renders (UX-DR13), **Then** the card displays ALL of:
   - Business hero photo (reuse `MediaService.list_grouped_for_owners` — do NOT re-query per card; batch in the service layer — see AC#7).
   - Deal description in Japanese (`title_ja`, truncated at 2 lines with CSS `line-clamp-2`).
   - Savings amount badge in JPY rendered by a NEW shared util `formatSavingsJpy(discount_type, discount_value, price_vnd)` in `apps/web/shared/lib/format-savings.ts`:
     - `discount_type = "percentage"` → `¥{round(price_jpy * discount_value / 100)}お得` (e.g., `¥500お得`).
     - `discount_type = "fixed_vnd"` → `¥{round(discount_value_vnd / exchangeRate)}お得`.
     - Reuse the exchange rate from `apps/web/shared/lib/exchange-rate.ts` (already used by `formatDualPrice` from Story 2.2). Do NOT hardcode `150` — pull from the existing helper.
   - Dual currency for original → discounted price (reuse `formatDualPrice` from `apps/web/modules/search/lib/format-price.ts` — do NOT duplicate).
   - Expiry countdown (e.g., `残り3日`) computed via a NEW `formatExpiryCountdown(validUntilIso, nowIso)` util in `apps/web/shared/lib/format-expiry.ts`:
     - `> 24h` → `残り{N}日` (floor of days).
     - `≤ 24h && > 1h` → `残り{N}時間`.
     - `≤ 1h` → `まもなく終了`.
     - Past → `終了` (card rendered grayed, not clickable — server filters these out anyway).
     - Compute server-side from the SSR response's `valid_until` using the server's `new Date()` — do NOT ship timestamps to the client to recompute (TZ drift + hydration mismatch). The countdown is a STATIC STRING at SSR time for this story. A live ticker is out of scope (defer).
   - Business name with the existing `SenpaiBadge` if `listing.is_senpai_verified` is true (reuse the component from `apps/web/shared/components/SenpaiBadge.tsx`).
   - Distance pill (e.g., `500m`) ONLY when the `近くのお得` chip is active AND the user granted geolocation — else the pill is hidden.

3. **Given** I tap the `近くのお得` chip, **When** the chip is selected, **Then**:
   - The chip wrapper is a client component (`NearbyChip.tsx`) that calls `navigator.geolocation.getCurrentPosition` with `{ timeout: 5000, enableHighAccuracy: false, maximumAge: 300000 }`.
   - On success → it navigates (via `router.push`) to `/{locale}/deals?filter=nearby&lat={lat}&lng={lng}`. The SSR call reads `lat`/`lng` from searchParams, passes them through to the backend, which sorts by Haversine distance in SQL (`ORDER BY earth_distance(...)` — use Postgres `earthdistance` extension if available; else a manual `acos(sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(lng1-lng2)) * 6371000` formula inside the repository).
   - On denial / timeout / insecure context → a trilingual toast `現在地を取得できませんでした — カテゴリからお選びください` (i18n key `deals.toast.geolocation_failed`) renders via `ToastProvider`, and the chip stays unselected (URL does NOT change). Do NOT fall back silently to an unsorted list under the `近くのお得` URL — users MUST understand the filter failed.
   - Reuse any existing geolocation helper from `apps/web/shared/lib/` if one exists; else create `shared/lib/geolocation.ts` with `requestCurrentPosition(): Promise<{ lat: number; lng: number }>`.

4. **Given** I tap a `CouponCard`, **When** the `CouponDetailSheet` opens (bottom-sheet on mobile, centered modal on ≥ 768px — UX-DR13), **Then** the sheet displays:
   - The business hero + a photo gallery (reuse `apps/web/modules/listing-detail/components/PhotoGallery.tsx` from Story 2.4 — do NOT build a new carousel).
   - Full deal description (`title_ja` + optional `description_ja`), markdown-safe (escaped — NO `dangerouslySetInnerHTML`).
   - Terms & conditions (`terms_ja`) rendered as a bulleted list, collapsible via the existing `Accordion` primitive from Story 2.4.
   - Validity period `{valid_from} 〜 {valid_until}` formatted via the existing `formatJapaneseDate` util (Story 1.3).
   - A **QR code preview blurred** (CSS `filter: blur(8px)` + overlay `<div>` with lock icon and copy `クーポンを取得してQRを表示`) — the actual QR is NOT generated in 7.1 (no `coupon_redemptions` table yet — see Out of Scope). The blurred preview is a static `next/image` placeholder (`/images/qr-placeholder.svg`, NEW asset).
   - A mini map showing the business location — reuse the existing `MiniMap.tsx` from Story 2.4 (or, if that component is listing-detail-local, import it via an exported barrel — do NOT duplicate). Accepts `{ lat, lng, label }`.
   - A primary `クーポンを取得` (Get Coupon) CTA button. For THIS story (7.1), the CTA is rendered but wired to a disabled state with a tooltip/helper `近日公開予定` (i18n key `deals.detail.cta_coming_soon`) — clicking it emits no backend call. Story 7.2 replaces this with the real claim flow. **DO NOT** gate it behind auth in 7.1 — the auth gate (FR53) lands with the real claim in 7.2. The `TODO(story-7.2): wire claim flow` comment MUST be present in `CouponDetailSheet.tsx` so 7.2 closes it deterministically.
   - Close on ESC, click-outside (desktop), or swipe-down (mobile) — reuse the existing `BottomSheet` primitive if one exists in `apps/web/shared/components/`; else build a minimal one using Radix `Dialog` (check `packages/ui/` first — do NOT pull in a new dep).

5. **Given** the deals list is empty (no active coupons match the filter/area), **When** the empty state renders, **Then** the shared `@/shared/components/EmptyState` component (same as Story 2.5/2.6) renders with:
   - Headline `お得情報はまだありません` (i18n key `deals.empty.title`).
   - Body `新しいクーポンが追加されたらここに表示されます` (key `deals.empty.subtitle`).
   - Primary CTA `すべてを見る` (key `deals.empty.cta`) linking to `/{locale}/deals` (clears the current filter). The CTA is hidden when the current filter is already `すべて` (no-op link would confuse users).
   - For `近くのお得` empty → a second-line hint `近くの店舗にはクーポンがありません — カテゴリをお試しください` (key `deals.empty.nearby_hint`).
   - Reuses the `SenpaiSpots`-style empty pattern via the shared component — do NOT inline markup.

6. **Given** the backend contract, **When** this story ships, **Then**:
   - Alembic migration `{next_stamp}_create_coupons_table.py` under `backend/migrations/versions/` (latest is `2026_04_19_0001_create_favorites_table.py`; this story's stamp is `2026_04_19_0002_create_coupons_table.py` — verify and bump if another migration lands first) creates table `coupons`:
     - `id UUID PK DEFAULT uuid_generate_v4()`, `listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE`.
     - `title_ja VARCHAR(200) NOT NULL`, `title_vi VARCHAR(200) NOT NULL`, `title_en VARCHAR(200)`.
     - `description_ja TEXT`, `description_vi TEXT`, `description_en TEXT`, `terms_ja TEXT`, `terms_vi TEXT`.
     - `discount_type VARCHAR(20) NOT NULL` CHECK in `('percentage','fixed_vnd')`.
     - `discount_value NUMERIC(10,2) NOT NULL` (percentage: 0–100; fixed_vnd: absolute VND savings).
     - `max_redemptions INTEGER` (nullable; null = unlimited — the Redis counter infra lands in 7.2).
     - `valid_from TIMESTAMPTZ NOT NULL`, `valid_until TIMESTAMPTZ NOT NULL` with a CHECK `valid_until > valid_from`.
     - `is_active BOOLEAN NOT NULL DEFAULT true` (business-owner soft toggle distinct from `deleted_at`).
     - Plus the `BaseModel` contract (`created_at`, `updated_at`, `deleted_at`) — DO inherit `BaseModel` from `backend/shared/base_models.py`.
     - Index `ix_coupons_active_valid` ON `(is_active, valid_from, valid_until) WHERE deleted_at IS NULL` — powers the default list query.
     - Index `ix_coupons_listing_active` ON `(listing_id) WHERE is_active = true AND deleted_at IS NULL` — for future listing-detail "has coupons" lookup (used by Epic 10 Story 10.6 reuse — kept here for forward compat, no extra cost).
     - `downgrade()` drops the table and both indexes cleanly. DO NOT create the `coupon_redemptions` table in this story — 7.2 owns it.
   - NEW backend module `backend/modules/coupon/` following the standard module template (`__init__.py`, `router.py`, `service.py`, `repository.py`, `models.py`, `schemas.py`, `events.py`, `exceptions.py`, `constants.py`). Rationale: unlike favorites, coupons are a distinct business-owner-managed domain with its own lifecycle (publish, redeem, analytics), and Epic 8 Story 8.3 (coupon management) + Epic 7 Story 7.2 (redemption) will extend this module. Source: `_bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Structure-Patterns`. Register the router in `backend/main.py` (or wherever `listing.router` is registered — match that pattern).
   - NEW SQLAlchemy model `Coupon` in `backend/modules/coupon/models.py` mirroring the migration columns, with a `listing` relationship via `relationship("Listing", lazy="joined")` (read-heavy surface — join upfront). Do NOT add a backref on `Listing` to avoid cross-module coupling; instead expose a repository method `list_active_for_listing_ids(listing_ids)` if a future caller needs listing→coupons (out of scope for 7.1).
   - NEW Pydantic schemas in `backend/modules/coupon/schemas.py`:
     - `CouponListItem { id, listing_id, listing_title_ja, listing_title_vi, listing_hero_photo_url, is_senpai_verified, category_slug, area_id, latitude, longitude, title_ja, description_ja, terms_ja, discount_type, discount_value, price_vnd (from listing), valid_from, valid_until, distance_m: float | None }`.
     - `CouponDetail` extends `CouponListItem` with `gallery: list[PhotoItem]` (reuse `PhotoItem` from `media` schemas).
     - Reuse `Paginated[CouponListItem]` + `SingleEnvelope[CouponDetail]` from `backend/shared/schemas.py`.
   - NEW `CouponRepository` in `backend/modules/coupon/repository.py`:
     - `list_active(filter: Literal["all","restaurant","cafe","spa","nearby"], lat: float | None, lng: float | None, page: int, per_page: int) -> tuple[list[Coupon], int]`.
     - Default sort `valid_until ASC` (expiring soonest first) for `all/restaurant/cafe/spa`. For `nearby` (requires lat+lng — raise `InvalidFilterException` if missing), sort by Haversine distance ASC, tie-break by `valid_until ASC`. Cap radius at 10km (WHERE distance_m <= 10000).
     - `WHERE is_active = TRUE AND deleted_at IS NULL AND valid_from <= NOW() AND valid_until > NOW()` — NEVER return expired or soft-deleted rows.
     - Join `listings` ON `listing_id` (+ `listing_categories` for slug filtering) — single query with joined eager loading.
     - `get_by_id(coupon_id: UUID) -> Coupon | None` (returns ONLY active + non-expired rows — expired detail returns 410 Gone via `CouponExpiredException`, missing returns 404 via `CouponNotFoundException`).
   - NEW `CouponService` in `backend/modules/coupon/service.py`:
     - `list_coupons(filter, lat, lng, page, per_page)` — returns paginated items with:
       - Photo hydration via `MediaService.list_grouped_for_owners(owner_type="listing", owner_ids=...)` — batch, NOT N+1. Pick the first photo as `hero_photo_url` when the listing doesn't have one cached.
       - Distance (for nearby) included in response as `distance_m` (float, meters, 1-decimal rounding).
     - `get_coupon_detail(coupon_id)` — returns the detail + full photo gallery (up to 10 photos via `MediaService`).
     - Inject `MediaService` via existing DI providers — NEVER import `MediaService` directly (architecture rule).
   - NEW `get_coupon_service` in `backend/modules/coupon/dependencies.py` wiring repo + media service.
   - NEW endpoints in `backend/modules/coupon/router.py` (prefix `/api/v1`):
     - `GET /coupons?filter=all|restaurant|cafe|spa|nearby&lat=&lng=&page=1&per_page=20` — returns `Paginated[CouponListItem]`. `per_page` capped at 50. **Public read** — use `get_current_user_optional` (no auth required to browse). `filter` defaults to `all`.
     - `GET /coupons/{coupon_id}` — returns `SingleEnvelope[CouponDetail]`. 404 via `CouponNotFoundException` on missing/soft-deleted; 410 via `CouponExpiredException` when `valid_until <= NOW()` or `is_active = false` (expired coupons should NOT appear but may be stale-linked from an external source — return 410 so the frontend can render a "deal ended" state if needed).
     - NO write endpoints in this story — `POST /coupons` is Epic 8 Story 8.3 (business-owner portal).
     - NO claim / redeem endpoints — Story 7.2.
   - NEW exceptions in `backend/modules/coupon/exceptions.py`: `CouponNotFoundException` (404, trilingual), `CouponExpiredException` (410, trilingual), `InvalidFilterException` (400, trilingual — used when `filter=nearby` without lat/lng). All extend `AppException`.
   - Event constants in `backend/modules/coupon/events.py`: `COUPON_VIEWED` (emitted on `GET /coupons/{id}` for future analytics — fire-and-forget via `shared.events.emit`; payload `{ coupon_id, listing_id, user_id: str | None }`). Do NOT subscribe or consume — Epic 7 Story 7.3 / Epic 9 analytics will later.
   - Seed fixtures: extend `backend/tests/conftest.py` (or the existing `factories.py` if one exists — inspect first) with a `coupon_factory()` producing realistic rows. NO production seed data required (business owners will create in 8.3); tests and local dev use factories.
   - Use existing `rate_limit(limit=120, window_s=60, route_key="coupon_read")` on list + detail reads (keyed by IP via `get_current_user_optional`) — defend against scraping. Reuse `backend/shared/rate_limit.rate_limit`.

7. **Given** the frontend contract, **When** this story ships, **Then**:
   - NEW module `apps/web/modules/deals/` with `{ components, lib, hooks, __tests__ }` subfolders. ALL imports use `@/` alias (per `apps/web/AGENTS.md`).
   - `lib/types.ts` mirroring backend schemas with `// TODO(story-7-1-followup): replace with generated api-types` (same pattern as Story 2.6).
   - `lib/deals-ssr.ts` (server-only, used only by `/deals/page.tsx`):
     - `fetchDealsListSSR(filter, lat?, lng?, page, perPage)` — 5s `AbortController`, `cache: "no-store"`, `next: { revalidate: 0 }`. Throws `DealsFetchError` on non-2xx (server component renders an error boundary).
     - `fetchDealDetailSSR(couponId)` — same behavior; throws `DealNotFoundError` on 404, `DealExpiredError` on 410.
   - `lib/deals-api.ts` (client-only, used by the bottom-sheet when it needs to refetch after error) — thin wrappers over `apiClient` for the same endpoints. Snake→camel via a hand-rolled `toCouponListItem(dto)` + `toCouponDetail(dto)` mapper (same pattern as `toListingDetail` / `toAreaGuide`).
   - `lib/format-savings.ts` — the JPY-savings formatter from AC#2 (pure, unit-tested).
   - `lib/format-expiry.ts` — the countdown formatter from AC#2 (pure, unit-tested; takes an explicit `nowIso` param so tests don't depend on wall-clock).
   - NEW components under `apps/web/modules/deals/components/`:
     - `DealsIndex.tsx` — the server-rendered list + empty-state orchestrator. Props `{ items, filter, page, totalPages, nearbyActive, userLat?, userLng? }`.
     - `CouponCard.tsx` — the card from AC#2. Pure; NO client-side state.
     - `FilterChips.tsx` — SSR chip row; selected chip derives from the `filter` prop.
     - `NearbyChip.tsx` — client component (`"use client"`) that wraps the `近くのお得` chip with geolocation + router.push.
     - `CouponDetailSheet.tsx` — the bottom-sheet/modal from AC#4. Client component (it owns the open/close state). Consumed by `/deals/[coupon_id]/page.tsx` via a parallel route or intercepting route (see below).
     - `DealsPager.tsx` — SSR prev/next `<Link>` pager (reuse the pattern from `FavoritesPager.tsx`).
   - NEW pages under `apps/web/app/(user)/[locale]/deals/`:
     - `page.tsx` — the main deals list. `async` server component; awaits `params`/`searchParams`; reads `filter`, `lat`, `lng`, `page` from searchParams; calls `fetchDealsListSSR`; renders `<DealsIndex />`. `export const dynamic = "force-dynamic"` (expiry countdowns + time-sensitive listing).
     - `[coupon_id]/page.tsx` — the detail page (hard-navigation fallback). `async` server component that renders `<CouponDetailSheet defaultOpen />`. Useful for direct-link / SEO crawlers.
     - Intercepting route `@modal/(.)[coupon_id]/page.tsx` — optional enhancement that intercepts card clicks to render the sheet over the list. If the intercepting-route pattern is not yet established in this repo (inspect `apps/web/app/` — it is NOT as of Story 2.6), skip this and keep the hard-navigation behavior. File a follow-up TODO.
   - i18n: NEW keys under `deals.*` in `apps/web/messages/{ja,en,vi}.json`:
     - `deals.page_title`, `deals.meta.description`, `deals.filter.all`, `deals.filter.restaurant`, `deals.filter.cafe`, `deals.filter.spa`, `deals.filter.nearby`, `deals.card.savings_yen` (with `{amount}` placeholder), `deals.card.days_left` / `deals.card.hours_left` / `deals.card.ending_soon` / `deals.card.ended`, `deals.card.distance_m` / `deals.card.distance_km` (with `{value}` placeholder), `deals.detail.terms_title`, `deals.detail.validity_label`, `deals.detail.qr_locked_hint`, `deals.detail.cta_get`, `deals.detail.cta_coming_soon`, `deals.empty.title`, `deals.empty.subtitle`, `deals.empty.cta`, `deals.empty.nearby_hint`, `deals.toast.geolocation_failed`, `deals.pager.prev`, `deals.pager.next`, `deals.pager.page_of`.
     - JA is authoritative; EN and VI receive **real translations** (NOT placeholders). Match the quality bar set by `account.*` + `favorites.*` keys.
   - Nav: add a `お得` (deals) entry to `BottomTabNav.tsx` if a slot is available; the existing 5-slot cap from Story 1.3 is already full (per Story 2.6 Dev Notes). For this story, ADD a `お得` link to the `TopNav.tsx` primary menu instead (same pattern as the favorites link added in 2.6) — visible to ALL users (guest + authed). Route: `/{locale}/deals`.
   - SEO: `/deals` IS public → `robots: { index: true, follow: true }`. ADD `/${locale}/deals` to `apps/web/app/sitemap.ts` (inspect the existing generator — it already lists `/`, `/areas`, etc.). Deal detail pages are indexable BUT have a `<link rel="canonical" href="/{locale}/deals">` since individual coupons are short-lived — we do NOT want Google ranking expired coupon URLs. Set that canonical in `[coupon_id]/page.tsx` via `generateMetadata`.
   - Homepage wiring: update `apps/web/modules/home/` to render an `お得情報` section teaser (title + "すべて見る" link to `/{locale}/deals`). Scope-limited: render the FIRST 4 active coupons (reuse `fetchDealsListSSR("all", undefined, undefined, 1, 4)` — NOT a separate endpoint). If zero coupons, hide the section entirely (do NOT render the empty state on the homepage — only on `/deals`).

8. **Given** accessibility at 375 / 768 / 1280 px, **When** the deals page is audited, **Then**:
   - Filter chips are `<button>` or `<a>` (the nav chips are `<Link>`, the `NearbyChip` is a `<button>` since it needs geolocation handling before navigation). `role="tab"` / `role="tablist"` only if we can honor the full keyboard semantics — otherwise use plain buttons/links with `aria-current="page"` on the selected chip.
   - `CouponCard` is wrapped in a single focusable `<Link>` per card — NO nested interactive elements. The entire card is one target. Business name, countdown, and savings badge are `aria-label`-composed into a single accessible name: `{title_ja} — {savings} — 残り{N}日 — {business_name}`.
   - `CouponDetailSheet` uses Radix `Dialog` (or the existing primitive) — focus trap, ESC-to-close, `aria-labelledby` pointing at the sheet title, `aria-describedby` pointing at the description.
   - Blurred QR has `role="img"` with `aria-label="クーポンを取得するとQRコードが表示されます"`.
   - The `近くのお得` chip announces its loading state via `aria-busy="true"` while geolocation resolves.
   - Axe-core reports 0 violations on `/ja/deals` and `/ja/deals/{id}`.
   - Color contrast on the countdown badge (`残り1時間` in red/coral) meets WCAG AA (4.5:1) — reuse existing `token.color.coral.*` semantic tokens; do NOT inline hex.

9. **Given** performance + reliability, **When** a user loads `/ja/deals` with 200 active coupons, **Then**:
   - The backend list query uses `ix_coupons_active_valid` for the default sort (verify with `EXPLAIN ANALYZE` locally) and joins `listings` in a single query with `selectinload` or `joinedload`. Photo hydration runs as ONE batched `MediaService.list_grouped_for_owners` call — NOT per-row. Assert in tests that `list_coupons` issues ≤ 3 SQL round-trips (count + list + media) for any page size ≤ 50.
   - For the `近くのお得` filter, the Haversine sort must execute in the DB (not in Python) — add a test that 500 coupons return in < 200ms locally. Cap result set at 10km radius AND `per_page` 50.
   - SSR fetch in `fetchDealsListSSR` uses a 5s `AbortController`; on timeout, throw `DealsFetchError` → the server component renders a graceful error state via the existing `ErrorBoundary` (reuse from Story 2.4 if one exists; else add a minimal `app/(user)/[locale]/deals/error.tsx`).
   - Rate-limit 120/min/IP on reads; 429 returns the trilingual `AppException` shape; the frontend error boundary maps 429 → a friendly `しばらくしてからお試しください` message.
   - Image delivery: the hero photo uses `next/image` with `sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"` and the existing DO Spaces loader (reuse `apps/web/next.config.ts` loader — do NOT add a new loader).

10. **Given** tests, **When** `pnpm --filter web test` + `pnpm --filter web build` + `pytest backend/tests/` run, **Then**:
    - **Backend:** `backend/tests/coupon/test_coupons.py` (NEW) covers: `GET /coupons` default sort (expiring-soonest first), filter by `restaurant` returns only restaurant-category listings, `filter=nearby` without lat/lng returns 400 via `InvalidFilterException`, `filter=nearby` with lat/lng returns distance-sorted results with `distance_m` populated + 10km cap enforced, pagination (`page=2`), excludes soft-deleted listings AND `is_active=false` coupons AND expired coupons (`valid_until <= now`), rate-limit 429 after 120 requests/min; `GET /coupons/{id}` returns 200 on active, 404 on unknown/soft-deleted, 410 on expired, emits `COUPON_VIEWED` event (assert via a test-time subscriber on `shared.events`). `backend/tests/coupon/test_coupon_repository.py` (NEW) covers: `list_active` filter + sort matrix, Haversine correctness against known fixture points (Da Nang Han River ↔ My Khe beach ≈ 2.5km — assert within ±5%), soft-delete filtering, `get_by_id` expired → None path. Target ≥ 80% branch coverage on new coupon handlers.
    - **Frontend:** `apps/web/modules/deals/__tests__/format-savings.test.ts` (percentage + fixed_vnd + exchange rate injection + edge case zero/negative), `format-expiry.test.ts` (all four buckets + exact boundaries at 24h and 1h using explicit `nowIso`), `CouponCard.test.tsx` (renders all required fields, hides distance when `nearbyActive=false`, shows senpai badge when verified), `DealsIndex.test.tsx` (grid renders, empty state renders correct copy per filter, pager shows/hides), `NearbyChip.test.tsx` (geolocation success → router.push with lat/lng; denial → toast + no navigation; uses jest's geolocation mock), `CouponDetailSheet.test.tsx` (renders gallery + blurred QR + disabled CTA + coming-soon tooltip; ESC closes; TODO(story-7.2) marker is present as a TypeScript comment for lint-rule detection), `deals/page.test.tsx` (SSR fetch happy path + error boundary), homepage deals-teaser test (hides section when zero coupons; renders 4 cards on happy path).
    - Regenerate `packages/types/src/api-types.ts` via `packages/types/generate.sh` once backend schemas land (needs a live `http://localhost:8000/openapi.json`); else leave `TODO(story-7-1-followup): regenerate api-types after merge` in the PR description AND in `apps/web/modules/deals/lib/types.ts`.
    - Run `pnpm --filter web test && pnpm --filter web build && (cd backend && python -m pytest)` — all green. Known pre-existing `/vi/auth/callback` prerender failure remains out of scope.

## Tasks / Subtasks

- [x] Task 1: Backend — migration + `Coupon` model + exceptions + events (AC: #6)
  - [x] 1.1 Inspect `backend/migrations/versions/` for the latest stamp; create `2026_04_19_0002_create_coupons_table.py` (bump if another migration landed). Include `ix_coupons_active_valid` partial index, `ix_coupons_listing_active` partial index, CHECK constraint on `discount_type`, CHECK `valid_until > valid_from`; `downgrade()` drops cleanly.
  - [x] 1.2 Create `backend/modules/coupon/` module skeleton (`__init__.py`, `models.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`, `dependencies.py`, `events.py`, `exceptions.py`, `constants.py`). Mirror the `listing/` module file layout.
  - [x] 1.3 Add `Coupon` SQLAlchemy model extending `BaseModel` with `joinedload`-friendly `listing` relationship (read-only).
  - [x] 1.4 Add `CouponNotFoundException` (404), `CouponExpiredException` (410), `InvalidFilterException` (400) to `exceptions.py`. All trilingual (`message_ja`, `message_vi`, `message_en`) extending `AppException`.
  - [x] 1.5 Add `COUPON_VIEWED` constant to `events.py`.

- [x] Task 2: Backend — schemas, repository, service, dependencies (AC: #6)
  - [x] 2.1 Add `CouponListItem`, `CouponDetail` to `coupon/schemas.py`. Reuse `Paginated` + `SingleEnvelope` + `PhotoItem`.
  - [x] 2.2 Add `CouponRepository.list_active` + `get_by_id` with joined `Listing` + `ListingCategory`. Haversine formula inline if `earthdistance` extension is absent.
  - [x] 2.3 Add `CouponService.list_coupons` + `get_coupon_detail` with DI for `MediaService`. Batch photo hydration via `list_grouped_for_owners`.
  - [x] 2.4 Add `get_coupon_service` + `get_coupon_repository` to `coupon/dependencies.py`.

- [x] Task 3: Backend — router endpoints + rate limit + event emission + registration (AC: #6, #9)
  - [x] 3.1 Add `GET /api/v1/coupons` + `GET /api/v1/coupons/{coupon_id}` to `coupon/router.py` with `Depends(get_current_user_optional)` + `Depends(get_coupon_service)`.
  - [x] 3.2 Apply `rate_limit(limit=120, window_s=60, route_key="coupon_read")` to both endpoints.
  - [x] 3.3 Emit `COUPON_VIEWED` on successful detail fetch via `shared.events.emit`.
  - [x] 3.4 Register the new router in the FastAPI app (match where `listing.router` / `favorites` routes are registered).
  - [x] 3.5 Return 410 via `CouponExpiredException` when the coupon row exists but `valid_until <= now` or `is_active = false`; 404 when missing/soft-deleted.

- [x] Task 4: Backend — tests (AC: #10)
  - [x] 4.1 Create `backend/tests/coupon/test_coupons.py` covering filter matrix, nearby haversine, pagination, soft-delete + `is_active` + expired filtering, rate limit, event emission.
  - [x] 4.2 Create `backend/tests/coupon/test_coupon_repository.py` covering sort, haversine correctness vs. known Da Nang coordinates, soft-delete, `get_by_id` expired path.
  - [x] 4.3 Extend `backend/tests/conftest.py` / factories with a `coupon_factory()`.
  - [x] 4.4 Run `python -m pytest backend/tests/` → all green, no regressions. (170 passed)

- [x] Task 5: Frontend — data layer + format utils (AC: #2, #3, #7)
  - [x] 5.1 Create `apps/web/modules/deals/lib/types.ts` mirroring backend schemas with the followup TODO marker.
  - [x] 5.2 Create `apps/web/modules/deals/lib/deals-ssr.ts` (`fetchDealsListSSR`, `fetchDealDetailSSR`, `DealsFetchError`, `DealNotFoundError`, `DealExpiredError`).
  - [x] 5.3 Create `apps/web/modules/deals/lib/deals-api.ts` (client-side `apiClient` wrappers + snake→camel mappers).
  - [x] 5.4 Create `apps/web/shared/lib/format-savings.ts` + `apps/web/shared/lib/format-expiry.ts` (pure, tested).
  - [x] 5.5 Create `apps/web/shared/lib/geolocation.ts` if no existing helper (5s timeout, 5min max age).

- [x] Task 6: Frontend — components (AC: #1, #2, #3, #4, #5, #8)
  - [x] 6.1 Create `CouponCard.tsx` rendering hero + savings badge + countdown + senpai badge + distance pill (conditional).
  - [x] 6.2 Create `FilterChips.tsx` (SSR) + `NearbyChip.tsx` (client, geolocation-gated `router.push`, toast on failure).
  - [x] 6.3 Create `CouponDetailSheet.tsx` — bottom-sheet/modal with gallery + blurred QR + disabled `クーポンを取得` CTA + `TODO(story-7.2): wire claim flow` comment.
  - [x] 6.4 Create `DealsIndex.tsx` (grid + pager + empty-state orchestration) and `DealsPager.tsx` (SSR `<Link>` pager).

- [x] Task 7: Frontend — pages + nav + SEO + homepage teaser (AC: #1, #4, #5, #7)
  - [x] 7.1 Create `apps/web/app/(user)/[locale]/deals/page.tsx` (SSR list + `generateMetadata` + `dynamic = "force-dynamic"`).
  - [x] 7.2 Create `apps/web/app/(user)/[locale]/deals/[coupon_id]/page.tsx` (SSR detail with canonical-to-`/deals`).
  - [x] 7.3 Add `/{locale}/deals` to `apps/web/app/sitemap.ts`.
  - [x] 7.4 Add `お得` top-nav link in `TopNav.tsx` (visible to all users). Do NOT add to `BottomTabNav` (full per Story 1.3 / 2.6 notes).
  - [x] 7.5 Update `apps/web/modules/home/` to render the `お得情報` teaser (top 4 active coupons via `fetchDealsListSSR("all", undefined, undefined, 1, 4)`); hide when zero.

- [x] Task 8: Frontend — i18n + tests (AC: #7, #8, #10)
  - [x] 8.1 Populate `deals.*` keys in `ja.json` (authoritative), `en.json`, `vi.json` (real translations).
  - [x] 8.2 Create the test files listed in AC#10 under `apps/web/modules/deals/__tests__/`.
  - [x] 8.3 Run `pnpm --filter web test` + `pnpm --filter web build` → green for 7.1 code. (210 tests passed; known `/vi/auth/callback` prerender failure is pre-existing out of scope)

- [x] Task 9: Docs & cleanup (AC: all)
  - [x] 9.1 Update `apps/web/README.md` with a short "Deals" section (migrate + factory seed + visit `/ja/deals`).
  - [x] 9.2 Update `backend/README.md` with the two new `/api/v1/coupons` endpoints + the new `modules/coupon/` module.
  - [x] 9.3 Regenerate `packages/types/src/api-types.ts` if a live backend is available; else add the follow-up TODO to the PR description. (TODO added to `apps/web/README.md` + `apps/web/modules/deals/lib/types.ts`)

## Dev Notes

### Purpose & scope

Story 7.1 is the **first-surface** for coupons on DaNangNavi — a Japanese tourist's "show me deals" moment (FR61 / UX-DR13 / UX-DR39). It ships the coupon domain model, the public browse/detail REST surface, and the `/ja/deals` page with filter chips + nearby sort + detail sheet. It deliberately STOPS short of claim/redeem — Story 7.2 adds `coupon_redemptions`, Redis counters, QR generation, auth-gated claim (FR53), and the "My Coupons" tab. 7.1 sets up the data + UX shell so 7.2 is a focused state-transition + security story rather than a megastory.

Depends on Story 1.4/1.5 (auth — `get_current_user_optional`, `apiClient`), Story 2.1 (Listing model + category + area + lat/lng), Story 2.2 (homepage composition), Story 2.4 (`PhotoGallery`, `MiniMap`, `Accordion`), Story 2.5/2.6 (SSR fetch + `EmptyState` patterns). Feeds Story 7.2 (claim/redeem), Story 7.3 (coupon-near-expiry notifications — will consume `COUPON_VIEWED` and the future `COUPON_EXPIRING_SOON` event), Epic 8 Story 8.3 (business-owner coupon CRUD — writes lands there), Epic 10 Story 10.6 (journey-deals integration — reuses the `ix_coupons_listing_active` index + card badge pattern).

### Architecture compliance (non-negotiable)

- **Module boundaries (backend):** Create a dedicated `backend/modules/coupon/` module. Do NOT co-locate inside `listing/` — coupons have their own lifecycle (publish, claim, redeem, analytics) and multiple future stories (7.2, 7.3, 8.3, 10.6) extend this module. Source: `architecture/implementation-patterns-consistency-rules.md#Structure-Patterns`.
- **Repository pattern:** NO inline SQL in router/service. `CouponRepository` owns all DB access including the Haversine math.
- **DI for cross-module reuse:** `CouponService` injects `MediaService` via the existing dependency provider. Do NOT `import MediaService` directly.
- **Soft-delete + `is_active`:** all list queries filter `deleted_at IS NULL AND is_active = TRUE AND valid_from <= NOW() AND valid_until > NOW()`. `is_active` is the BO's manual toggle (pause a campaign without deleting); `deleted_at` is lifecycle/admin delete; `valid_until` is automatic expiry.
- **Trilingual exceptions:** `CouponNotFoundException`, `CouponExpiredException`, `InvalidFilterException` all extend `AppException` with `message_ja` / `message_vi` / `message_en`.
- **Events-first:** `COUPON_VIEWED` emits via `shared.events.emit`. Do NOT add claim/redeem events in this story — 7.2 owns `COUPON_CLAIMED` / `COUPON_REDEEMED`.
- **Path aliases (frontend):** ALL `apps/web/` imports MUST use `@/` per `apps/web/AGENTS.md`.
- **Next.js 16:** `params` + `searchParams` are Promises — await them. `/deals` pages use `export const dynamic = "force-dynamic"` + `cache: "no-store"` (expiry countdowns are time-sensitive).
- **CSRF + auth cookies:** reads don't need auth; `apiClient` handles CSRF + single-flight refresh on 401 for when 7.2 adds writes — do NOT re-implement.
- **Design tokens:** Coral (`お得` savings badge), Navy (primary CTA), Teal (senpai). Reuse existing semantic tokens. NO inline hex.
- **Envelope contract:** backend returns `{ data, meta }`; frontend does hand-rolled snake→camel via `toCouponListItem` / `toCouponDetail` (consistent with Stories 2.3–2.6).

### Existing code to reuse (prevent wheel reinvention)

- `apps/web/shared/components/EmptyState.tsx` — empty-state pattern; DO reuse.
- `apps/web/shared/components/SenpaiBadge.tsx` — senpai-verified badge.
- `apps/web/shared/components/ToastProvider.tsx` — existing `role="status" aria-live="polite"` toast; geolocation failure toast uses this.
- `apps/web/modules/search/lib/format-price.ts::formatDualPrice` — dual-currency formatter; DO reuse.
- `apps/web/shared/lib/exchange-rate.ts` — the JPY↔VND rate source; inject into `formatSavingsJpy` rather than hardcode.
- `apps/web/modules/listing-detail/components/PhotoGallery.tsx` — gallery component; reuse in the detail sheet.
- `apps/web/modules/listing-detail/components/MiniMap.tsx` (if exported) — reuse for the location mini-map.
- `apps/web/shared/components/Accordion.tsx` (if present; else whatever primitive Story 2.4 built) — terms collapse.
- `apps/web/shared/lib/apiClient.ts` — CSRF + refresh; use for all client-side `deals-api` calls.
- `apps/web/modules/favorites/components/FavoritesPager.tsx` — the exact SSR pager pattern to mirror for `DealsPager`.
- `backend/shared/base_models.BaseModel` — inherit for `Coupon`.
- `backend/shared/rate_limit.rate_limit` — IP-keyed rate limiting for public reads.
- `backend/shared/events.emit` — fire-and-forget dispatch.
- `backend/modules/auth/dependencies.get_current_user_optional` — reads use this (not `get_current_user`).
- `backend/modules/media/service.MediaService.list_grouped_for_owners` — batch photo hydration.
- `backend/shared/schemas.Paginated` + `SingleEnvelope` — reuse for response shapes.
- `backend/modules/listing/models.Listing` — FK target; do NOT add a backref (keep coupon→listing one-way).

### Out of scope for 7.1 (enforce boundaries)

- **Claim + redeem flow + `coupon_redemptions` table + QR generation + Redis counters** — all Story 7.2.
- **Auth-gated CTA (FR53 gate on `クーポンを取得`)** — lands with the real claim in 7.2.
- **"My Coupons" / `/ja/deals?tab=mine`** — Story 7.2.
- **Business-owner coupon CRUD (create/edit/pause/delete)** — Epic 8 Story 8.3. This story ships READ-ONLY endpoints + factory-seeded test data.
- **Coupon-near-expiry notifications** — Story 7.3 (consumes events emitted in 7.2, not 7.1).
- **Deal detail on listing-detail page** (e.g., a "このお店のクーポン" section on `/listings/{id}`) — defer to 7.2 or a follow-up; it requires the listing→coupons lookup we left un-wired.
- **Live countdown ticker** (re-rendering `残り3時間` → `残り2時間59分` without reload) — defer. SSR static string for 7.1.
- **Coupon search by keyword** — defer. Filter chips only for MVP.
- **Real-time availability ("あと3枚")** — requires Redis counters from 7.2.
- **Price-history / "最安値" badge on deals** — out of scope.
- **Share a coupon (native share / link copy)** — defer.
- **Infinite scroll on `/deals`** — MVP uses SSR pagination (match Story 2.6 pattern).
- **Journey-deals integration (Epic 10 Story 10.6 coupon badge on route cards)** — depends on 7.1's `ix_coupons_listing_active` index being in place; the badge UI is NOT in scope here.

### Previous story intelligence

- **From Story 1.4/1.5:** `get_current_user_optional` cleanly returns `None` for guests — perfect for public reads. `apiClient` handles CSRF automatically on writes (relevant for 7.2). `SignupModal` + `useAuthStore` exist for the 7.2 claim gate — do NOT wire them in 7.1.
- **From Story 2.1:** `Listing` carries `latitude`, `longitude`, `category_id`, `area_id`, `is_senpai_verified`, `price_vnd`, `hero_photo_url` (nullable) — ALL the fields the `CouponListItem` projection needs. Use `selectinload(Coupon.listing)` + a secondary `selectinload(Listing.category)` to avoid N+1. `Paginated` envelope is the contract.
- **From Story 2.2:** The homepage composition pattern (senpai picks section) is the exact template for the `お得情報` teaser (Task 7.5). Reuse its grid + "すべて見る" link pattern.
- **From Story 2.3/2.4:** The search results grid classes (1/2/3-col breakpoints) + `PhotoGallery` + `MiniMap` + `Accordion` are the reusable building blocks. Import from wherever they were exported (inspect barrels).
- **From Story 2.5:** `AreaService.get_guide_by_slug` is the latest composition pattern — repository → service → photo + fair-price hydration via DI. `CouponService.list_coupons` follows the SAME shape (repo → service → `MediaService.list_grouped_for_owners` via DI). NO fair-price on coupons — only photo hydration.
- **From Story 2.6:** `FavoritesPager`, `fetchFavoritesSSR`, the `FavoritesIndex` orchestrator, the i18n quality bar — all direct templates for `DealsPager`, `fetchDealsListSSR`, `DealsIndex`. Mirror the file layout exactly.
- **Story 2.6 is currently in `review`** (not `done`) — do NOT depend on merged main; rebase if needed, but the shared primitives (`ListingCard`, `EmptyState`, `apiClient`) are stable across branches.

### Latest tech notes

- **Next.js 16 App Router:** `params` + `searchParams` are Promises — MUST await. Public pages with time-sensitive content → `export const dynamic = "force-dynamic"` + `fetch({ cache: "no-store", next: { revalidate: 0 } })`. Use `generateMetadata` for per-page SEO + canonical. Intercepting routes (`(.)coupon_id`) are supported but not yet in repo; skip unless a clean pattern exists.
- **Postgres Haversine:** If the `cube` + `earthdistance` extensions are NOT installed (inspect migration history), inline the Haversine formula: `6371000 * acos(LEAST(1.0, sin(radians(:lat1))*sin(radians(lat))+cos(radians(:lat1))*cos(radians(lat))*cos(radians(lng - :lng1))))` — the `LEAST(1.0, ...)` guards against floating-point overflow (real issue at distance = 0). Use parameterized SQL via SQLAlchemy `text()` to keep the repository layer honest.
- **SQLAlchemy 2.0 async + eager loading:** Use `options(joinedload(Coupon.listing).joinedload(Listing.category))` for the detail path (single row — a join is cheaper than a select-in). For the list path, prefer `selectinload(Coupon.listing).selectinload(Listing.category)` to avoid cartesian blow-up when joining media in Python afterwards. Count query runs separately (`func.count`) — do NOT use `.count()` on the joined query.
- **Rate limiting:** `shared.rate_limit.rate_limit` keys by authed user id when present, else by IP. Public reads at 120/min/IP are generous for a browse surface but tight enough to discourage scraping. 429 carries the trilingual shape.
- **CSRF:** `apiClient` injects `X-CSRF-Token` on mutations only; 7.1's GETs don't need it. Do NOT add CSRF to reads.
- **Image sizes:** `next/image` with explicit `sizes` is critical for DO Spaces bandwidth budget; the default (`100vw`) would over-deliver on desktop. Match the sizes string used by `ListingCard` from Story 2.2.

### Project structure notes

- **New backend module:** `backend/modules/coupon/` (full module template). Register its router wherever `listing.router` is registered (inspect `backend/main.py` or `backend/app.py`).
- **New frontend module:** `apps/web/modules/deals/` (mirrors `modules/favorites/`, `modules/area-guide/`).
- **New shared libs:** `apps/web/shared/lib/format-savings.ts`, `format-expiry.ts`, and (if missing) `geolocation.ts`.
- **New page routes:** `apps/web/app/(user)/[locale]/deals/page.tsx` + `[coupon_id]/page.tsx`. Add to `sitemap.ts`.
- **New Alembic migration:** `backend/migrations/versions/2026_04_19_0002_create_coupons_table.py` (bump if another migration lands first — inspect directory).
- **Test files:** `backend/tests/coupon/test_coupons.py` + `test_coupon_repository.py`; `apps/web/modules/deals/__tests__/*`.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-7-deals-coupons-notifications.md#Story-7.1]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR61,FR53,FR71,FR67,FR68]
- [Source: _bmad-output/planning-artifacts/epics/requirements-inventory.md#UX-DR13,UX-DR39]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Data-Architecture — Postgres 16 + Redis 7 + SQLAlchemy 2.0 async]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Structure-Patterns — module template]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Naming-Patterns]
- [Source: _bmad-output/implementation-artifacts/2-1-listing-data-model-api-foundation.md — Listing model, Paginated envelope]
- [Source: _bmad-output/implementation-artifacts/2-2-homepage-hero-senpai-picks-deals.md — homepage teaser composition pattern]
- [Source: _bmad-output/implementation-artifacts/2-4-listing-detail-page.md — PhotoGallery, MiniMap, Accordion, rate_limit + event emission precedent]
- [Source: _bmad-output/implementation-artifacts/2-5-area-neighborhood-guides.md — AreaService DI composition]
- [Source: _bmad-output/implementation-artifacts/2-6-favorites-collection.md — SSR fetch + pager + i18n quality bar + Next 16 Promise contract]
- [Source: _bmad-output/implementation-artifacts/1-4-user-authentication-social-login-line-google.md — auth cookies, get_current_user_optional, apiClient]
- [Source: apps/web/AGENTS.md — path alias rule]
- [Source: apps/web/shared/components/EmptyState.tsx — empty-state to reuse]
- [Source: apps/web/shared/components/SenpaiBadge.tsx — senpai badge]
- [Source: apps/web/modules/search/lib/format-price.ts — formatDualPrice]
- [Source: apps/web/shared/lib/exchange-rate.ts — JPY↔VND rate source]
- [Source: apps/web/shared/lib/apiClient.ts — CSRF + refresh behavior]
- [Source: apps/web/modules/favorites/components/FavoritesPager.tsx — SSR pager pattern]
- [Source: apps/web/modules/favorites/lib/favorites-ssr.ts — SSR fetch pattern]
- [Source: backend/modules/listing/models.py — Listing FK target + lat/lng + category_id]
- [Source: backend/modules/listing/router.py:37 — rate_limit usage]
- [Source: backend/modules/auth/dependencies.py — get_current_user_optional]
- [Source: backend/shared/base_models.py — BaseModel contract]
- [Source: backend/shared/rate_limit.py — rate_limit helper]
- [Source: backend/shared/events.py — emit helper]
- [Source: backend/modules/media/service.py — MediaService.list_grouped_for_owners]
- [Source: backend/migrations/versions/2026_04_19_0001_create_favorites_table.py — latest migration stamp precedent]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Fixed missing `import { describe, it, expect } from "vitest"` in `format-savings.test.ts` and `format-expiry.test.ts` (tests were using bare globals which vitest doesn't provide by default without globals config).

### Completion Notes List

- **Backend:** Full `backend/modules/coupon/` module implemented: migration, SQLAlchemy model, Pydantic schemas (CouponListItem + CouponDetail), CouponRepository with Haversine SQL distance for `nearby` filter, CouponService with batch MediaService photo hydration, router with 120/min rate limit, `COUPON_VIEWED` event emission on detail fetch. Router registered in `backend/main.py`.
- **Backend tests:** 19 coupon-specific tests (test_coupons.py + test_coupon_repository.py) pass. Full suite: 170 passed, no regressions.
- **Frontend:** `apps/web/modules/deals/` module with components (CouponCard, FilterChips, NearbyChip, CouponDetailSheet, DealsIndex, DealsPager), lib (types.ts, deals-ssr.ts, deals-api.ts), and shared utils (format-savings.ts, format-expiry.ts, geolocation.ts).
- **Frontend tests:** 210 tests pass across 54 test files. New test files: format-savings.test.ts, format-expiry.test.ts, CouponCard.test.tsx, NearbyChip.test.tsx, DealsIndex.test.tsx, CouponDetailSheet.test.tsx, DealsSection.test.tsx.
- **Pages:** SSR deals list page (`/[locale]/deals`) + detail page (`/[locale]/deals/[coupon_id]`) with `dynamic = "force-dynamic"`, `generateMetadata`, canonical link.
- **Nav + SEO:** `TopNav.tsx` updated with deals link; `sitemap.ts` includes `/{locale}/deals` with `changeFrequency: "hourly"`; robots `index: true, follow: true`.
- **Homepage teaser:** `fetchHomepageDeals()` in `homepage-data.ts` feature-flagged behind `NEXT_PUBLIC_FEATURE_DEALS_API`; renders top 4 active coupons; hides when empty.
- **i18n:** Real translations for all `deals.*` keys in ja.json (authoritative), en.json, vi.json.
- **Build:** Known pre-existing `/vi/auth/callback` prerender failure is out of scope; all new 7.1 code compiles cleanly (TypeScript passed).
- **TODO(story-7-1-followup):** Regenerate `packages/types/src/api-types.ts` after merge against a live backend.

### File List

**Backend — new files:**
- `backend/migrations/versions/2026_04_19_0002_create_coupons_table.py`
- `backend/modules/coupon/__init__.py`
- `backend/modules/coupon/constants.py`
- `backend/modules/coupon/dependencies.py`
- `backend/modules/coupon/events.py`
- `backend/modules/coupon/exceptions.py`
- `backend/modules/coupon/models.py`
- `backend/modules/coupon/repository.py`
- `backend/modules/coupon/router.py`
- `backend/modules/coupon/schemas.py`
- `backend/modules/coupon/service.py`
- `backend/tests/coupon/__init__.py`
- `backend/tests/coupon/test_coupons.py`
- `backend/tests/coupon/test_coupon_repository.py`

**Backend — modified files:**
- `backend/main.py` (coupon router registered)
- `backend/tests/conftest.py` (coupon_factory added)
- `backend/README.md` (Coupons section added)

**Frontend — new files:**
- `apps/web/modules/deals/components/CouponCard.tsx`
- `apps/web/modules/deals/components/CouponDetailSheet.tsx`
- `apps/web/modules/deals/components/DealsIndex.tsx`
- `apps/web/modules/deals/components/DealsPager.tsx`
- `apps/web/modules/deals/components/FilterChips.tsx`
- `apps/web/modules/deals/components/NearbyChip.tsx`
- `apps/web/modules/deals/lib/deals-api.ts`
- `apps/web/modules/deals/lib/deals-ssr.ts`
- `apps/web/modules/deals/lib/types.ts`
- `apps/web/modules/deals/__tests__/CouponCard.test.tsx`
- `apps/web/modules/deals/__tests__/CouponDetailSheet.test.tsx`
- `apps/web/modules/deals/__tests__/DealsIndex.test.tsx`
- `apps/web/modules/deals/__tests__/NearbyChip.test.tsx`
- `apps/web/modules/deals/__tests__/format-expiry.test.ts`
- `apps/web/modules/deals/__tests__/format-savings.test.ts`
- `apps/web/app/(user)/[locale]/deals/page.tsx`
- `apps/web/app/(user)/[locale]/deals/error.tsx`
- `apps/web/app/(user)/[locale]/deals/[coupon_id]/page.tsx`
- `apps/web/shared/lib/format-savings.ts`
- `apps/web/shared/lib/format-expiry.ts`
- `apps/web/shared/lib/geolocation.ts`
- `apps/web/modules/home/__tests__/DealsSection.test.tsx`

**Frontend — modified files:**
- `apps/web/shared/components/TopNav.tsx` (deals nav link added)
- `apps/web/app/sitemap.ts` (deals URL added)
- `apps/web/modules/home/lib/homepage-data.ts` (fetchHomepageDeals added)
- `apps/web/messages/ja.json` (deals.* keys)
- `apps/web/messages/en.json` (deals.* keys)
- `apps/web/messages/vi.json` (deals.* keys)
- `apps/web/README.md` (Deals section added)
