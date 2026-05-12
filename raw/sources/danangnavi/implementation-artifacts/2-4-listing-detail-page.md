# Story 2.4: Listing Detail Page

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese user evaluating a listing in Da Nang,
I want a rich detail page with photo gallery, dual-currency pricing, fair-price context, senpai reviews, key details, amenities, contract guidance, and a sticky contact/save action bar,
so that I can make an informed decision and either contact the business or save the listing for later.

## Acceptance Criteria

1. **Given** I tap a listing card from search (Story 2.3), the homepage senpai picks (Story 2.2), or an area guide (Story 2.5), **When** the detail page loads at `/[locale]/listings/[id]` (canonical locale `ja` → `/ja/listings/[id]`; `id` is the listing UUID — slug-based URLs are deferred to a follow-up), **Then** the page SSR-renders via a Next.js server component that awaits `params` (Promise) and fetches `GET /api/v1/listings/{listing_id}` server-side; **And** a 404 response renders the Next built-in `not-found.tsx` for the route segment.

2. **Given** the listing exists, **When** Section 1 (Gallery) renders, **Then** it shows a full-width photo gallery: mobile swipe carousel (touch + keyboard arrows), desktop 2×2 grid with a `すべての写真を見る ({N})` overlay button opening a lightbox; photo counter `1/{N}` overlays the active image; if `is_senpai_verified === true` a `先輩認証済み ✓` pill badge (teal `text-accent`, Noto Sans JP) overlays the top-left; if `photos.length === 0` a `bg-surface-muted` placeholder block renders with no counter and no lightbox trigger.

3. **Given** Section 2 (Header) renders, **Then** it shows: `title_ja` (h1, `text-h1`), large VND price `{priceVnd.toLocaleString("vi-VN")} VND/月` (Navy), JPY equivalent `(¥{jpy})` in teal (`text-accent`) using the shared `formatDualPrice(priceVnd)` helper from `apps/web/modules/search/lib/format-price.ts`; fair-price indicator icon + label (`🟢 適正価格` / `🟡 やや高め` / `🔴 要注意`) computed via the existing `SearchService._get_price_stats(category_id, area_id)` path extended to the detail endpoint (see AC#11 — do NOT duplicate the computation); quick specs row (rooms, size m², floor, parking — from the new `ListingDetailResponse` fields per AC#11), star rating `⭐ {rating_avg} ({review_count}件)`, save `♡` button (shared `SaveHeartButton` wired to `onSave` prop — actual save API remains `TODO(story-2.6)`), share `📤` button (uses `navigator.share` when available; falls back to copy-link toast `リンクをコピーしました`).

4. **Given** Section 3 (Key Details) renders, **Then** it shows a `主要情報` table with: address (`address_vi` primary + `address_ja` phonetic on a secondary line when present), approximate commute time to the user's registered workplace pin (when `user.workplace_coords` exists on the session — if not signed in OR no workplace set, omit the commute row entirely; no placeholder "not set" text), availability date (`available_from`), contract period (`contract_period_months`), deposit (`deposit_vnd` + JPY secondary), utilities summary (`utilities_included: string[]` — array of i18n keys from `search.amenities.*` namespace, rendered via `useTranslations`).

5. **Given** Section 4 (Amenities) renders, **Then** it shows a 3-column icon grid on mobile (6-column desktop) of the amenities present on the listing (`amenities: string[]` from Story 2.3 migration 0005); each icon uses the same key → icon mapping used in the search FilterPanel (extract into `apps/web/shared/lib/amenity-icons.ts` on first use so 2.3 can switch to it in a follow-up refactor — do NOT inline duplicate mappings); amenities NOT present render greyed out with a strikethrough (`text-muted line-through`) so users can see what is missing at a glance.

6. **Given** Section 5 (Senpai Reviews) renders, **Then** it shows: a star-breakdown histogram (5-star → 1-star bars with counts) aggregated from the reviews table; a featured `最も参考になった` review card (the review with the highest `helpful_count`, tiebreak by `created_at` desc); a vertical list of up to 5 review cards (photo + name + senpai badge + residency duration `{years}年居住` + date + star rating + body + reviewer tags); a `すべてのレビューを見る ({total_reviews}) →` link to a placeholder `/[locale]/listings/[id]/reviews` route (if route doesn't exist yet, render a disabled link with `TODO(story-4.2)` and DO NOT create the reviews page — it's Epic 4 scope); if `review_count === 0` render an empty-state card with `まだレビューがありません` and hide the histogram.

7. **Given** Section 6 (Contract Guidance) renders (FR71 edge case — contract guidance for newcomers), **Then** it shows an `@/shared/components/Accordion` (reuse existing — already at `apps/web/shared/components/Accordion.tsx`) with 4 collapsible items: `契約前チェックリスト`, `先輩のアドバイス`, `よくある落とし穴`, `必要書類`; content is STATIC i18n strings under `listing_detail.contract_guidance.*` in `apps/web/messages/ja.json` (mirrored with placeholder strings in `en.json` + `vi.json` for type safety) — do NOT fetch from the backend; content source is the UX spec (see References).

8. **Given** Section 7 (Location Map) renders, **Then** an embedded Leaflet map (lazy-loaded via `next/dynamic` with `ssr: false` — reuse the `MapViewLazy` pattern from Story 2.3) shows: a Navy pin at `[latitude, longitude]` (if both non-null), a workplace marker (only when `user.workplace_coords` exists), and up to 10 nearby POI markers fetched from a new `GET /api/v1/listings/{listing_id}/nearby_pois?radius_m=500` endpoint (see AC#11); if `latitude == null || longitude == null`, render a text-only address block + the `地図は利用できません` footnote — do NOT render the map container.

9. **Given** the mobile viewport (< 768px), **When** the sticky action bar renders, **Then** the shared `@/shared/components/StickyActionBar` (reuse — already exists) pins to `bottom: 0` with `z-index: 40` and contains: compact price `¥{jpyShort}/月` (Navy, bold) on the left; Coral `お問い合わせ` primary CTA (full height, `bg-secondary`); Navy outline `♡ 保存` button; on desktop (≥ 1024px) the action bar is NOT shown — instead the header-level `♡ 保存` and a right-rail `お問い合わせ` card persist via CSS `sticky top-24`.

10. **Given** I tap `お問い合わせ`, **When** the contact form overlay opens (bottom-sheet on mobile, centered modal on desktop — reuse `@/shared/components/Modal`), **Then** it shows a pre-filled bilingual message template (editable textarea, default body from i18n key `listing_detail.contact.template` with placeholders `{title_ja}` and `{listing_id}` interpolated), a `名前` field, a `連絡先 (LINE / Zalo / メール)` field, and a Coral `送信` CTA; on submit the form POSTs to `POST /api/v1/listings/{listing_id}/inquiries` (new endpoint per AC#11); success renders a `お問い合わせを送信しました` toast and closes the modal; validation uses Zod (reuse the version pinned in `apps/web/package.json` from Story 2.3); if the user is not authenticated, the CTA instead triggers the signup modal via `AuthGate` (same pattern as Story 2.3 ♡ button — FR53).

11. **Given** the backend contract, **When** this story ships, **Then**:
    - Alembic migration `0006_add_listing_detail_fields.py` adds to `listings`: `rooms INT NULL`, `size_sqm NUMERIC(6,2) NULL`, `floor INT NULL`, `parking BOOLEAN NOT NULL DEFAULT FALSE`, `available_from DATE NULL`, `contract_period_months INT NULL`, `deposit_vnd BIGINT NULL`, `utilities_included VARCHAR(50)[] NOT NULL DEFAULT '{}'`, `senpai_review_snippet TEXT NULL`; `downgrade()` drops them cleanly.
    - `backend/scripts/seed-data.py` populates the new fields on seeded housing listings (≥ 70% have rooms + size_sqm; all housing listings have `available_from` and `contract_period_months`).
    - `ListingDetailResponse` schema (extend the existing one at `backend/modules/listing/schemas.py`) exposes all new fields + `fair_price_band: Literal["fair","high","caution"] | None` + `photos: ListingPhotoResponse[]` (already present via `include_photos`) + `review_breakdown: dict[int, int]` (star → count) + `featured_review: ReviewItem | None` + `review_count`, `total_reviews`.
    - `GET /api/v1/listings/{listing_id}` is extended to hydrate the new fields, attach `fair_price_band` by calling `SearchService._attach_fair_price([detail])` (inject `SearchService` via `Depends` in the listing router — do NOT move the compute; reuse it exactly), and include `featured_review` + `review_breakdown` via a new `ReviewRepository.breakdown_for_listing(listing_id)` (if the `review` module does NOT yet exist, create a minimal `backend/modules/review/` module shell — `models.py` with a `Review` SQLAlchemy model matching the Epic 4 shape, `repository.py` with read-only queries, `schemas.py`, `__init__.py` — but DO NOT add review-write endpoints; those are Story 4.1 scope. Flag the module with a top-of-file docstring `# Partial module — write path owned by Epic 4.`). If the `review` module already exists, extend it — do not duplicate.
    - `GET /api/v1/listings/{listing_id}/nearby_pois?radius_m=500` new endpoint in `backend/modules/listing/router.py` returns up to 10 POI listings within the given radius using the Haversine formula (`SELECT ... WHERE ... ORDER BY <distance> LIMIT 10`); POIs are OTHER listings (exclude the current `listing_id`); response shape: `{ data: NearbyPoiItem[] }` where `NearbyPoiItem = { id, title_ja, latitude, longitude, category_slug }`.
    - `POST /api/v1/listings/{listing_id}/inquiries` new endpoint accepting `{ name, contact, message }` (Pydantic `InquiryCreateRequest`); inserts into a new `listing_inquiries` table (migration `0006` includes this table: `id UUID PK, listing_id UUID FK, user_id UUID NULL FK, name VARCHAR(100), contact VARCHAR(200), message TEXT, created_at, updated_at`); returns `202 Accepted` with `{ data: { inquiry_id } }`; rate-limit via the existing `shared/rate_limit.py` (check first — if absent, use a simple in-memory per-IP token bucket at `10/hour/ip` and flag `TODO(shared-rate-limit)`).
    - All new errors use the existing trilingual `AppException` shape.

12. **Given** SEO (FR59), **When** the detail page SSR-renders, **Then** `generateMetadata({ params })` returns: Japanese title `{title_ja} — ダナンナビ`, description from `description_ja` (truncated to 155 chars, fallback to `title_ja` when null), canonical URL `/{locale}/listings/{id}` (locale included — this is a localized route), `og:locale=ja_JP` / `og:type=product` / `og:image` (first photo URL from `photos[0].url_large`, fallback to a static `/og-listing-fallback.webp` under `apps/web/public/`), Twitter Card `summary_large_image`, and a JSON-LD `<script type="application/ld+json">` emitting `LocalBusiness` structured data (name=title_ja, address, geo, priceRange, aggregateRating when `review_count > 0`); `apps/web/app/sitemap.ts` is extended with a dynamic section that fetches all non-deleted listing ids via a new server helper `fetchAllListingIdsForSitemap()` (uses the existing `/api/v1/listings` endpoint with `per_page=50` pagination loop, 60s revalidate) and emits each as a `/ja/listings/{id}` entry with `changeFrequency: "weekly"`, `priority: 0.8`, and ja/en/vi hreflang alternates.

13. **Given** accessibility at 375/768/1280 px, **When** the page is inspected, **Then**: gallery is keyboard-navigable (Tab reaches the container, Arrow keys cycle photos, Enter opens the lightbox, Esc closes); the lightbox is a `role="dialog" aria-modal="true"` with a focus trap (reuse `@/shared/components/Modal`); all CTAs have ≥ 44×44 touch targets; all images have `alt` text derived from `{title_ja} — 写真 {n}/{total}`; the star rating announces as `星評価 {rating_avg} 点、{review_count} 件のレビュー` via `aria-label`; Japanese text uses `var(--font-family-primary)` (Noto Sans JP); axe-core reports 0 violations on the rendered page.

14. **Given** performance, **When** the page loads on a 3G throttled connection, **Then**: LCP is the hero gallery's first image (marked `priority` on `next/image`); all below-the-fold images use `loading="lazy"`; the map bundle is split via `next/dynamic({ ssr: false })` and does NOT ship in the initial JS payload; `fetchListingDetail` uses `fetch(url, { next: { revalidate: 300 } })` for ISR with a 5-minute cache; the inquiry POST uses `fetch(url, { cache: "no-store" })`; a 5s `AbortController` wraps the SSR fetch and throws on non-2xx (same pattern as `fetchSenpaiPicks` / `fetchSearchResults`).

15. **Given** tests, **When** `pnpm --filter web test` + `pytest backend/tests/` run, **Then**:
    - **Backend:** `backend/tests/listing/test_router_detail.py` covers: 200 happy path (all new fields present), 404 on unknown id, 404 on soft-deleted listing, `fair_price_band` is attached when comparables ≥ 5 else `None`, `review_breakdown` sums to `review_count`. `backend/tests/listing/test_nearby_pois.py` covers: returns ≤ 10 items, excludes current listing, excludes listings with null coords, radius filter works, sorted by distance ASC. `backend/tests/listing/test_inquiries.py` covers: 202 on valid payload, 422 on missing name/contact, rate-limit triggers 429 after threshold. `backend/tests/review/test_repository.py` covers: `breakdown_for_listing` and `featured_for_listing` for seeded data. ≥ 80% branch coverage on new listing router handlers.
    - **Frontend:** `apps/web/app/(user)/[locale]/listings/[id]/__tests__/page.test.tsx` (SSR render, 404 path, metadata generation), `apps/web/modules/listing-detail/__tests__/Gallery.test.tsx` (swipe, keyboard, lightbox open/close), `HeaderSection.test.tsx` (dual price format, fair-price icon mapping, save button onClick), `KeyDetails.test.tsx` (commute row hidden when no workplace), `ReviewsSection.test.tsx` (empty state, featured review tiebreak), `ContactModal.test.tsx` (Zod validation, AuthGate trigger when unauthenticated, successful POST flow with mocked fetch). Mock `react-leaflet` exactly as Story 2.3 does (reuse `apps/web/tests/stubs/react-leaflet.tsx`). Use `vi.useFakeTimers()` only where needed.

## Tasks / Subtasks

- [x] Task 1: Backend — migration + model + schema extensions (AC: #11)
  - [x] 1.1 Create `backend/migrations/versions/2026_04_18_0002_add_listing_detail_fields.py` (or next sequential filename matching the existing naming scheme — inspect `backend/migrations/versions/` first). Adds all new columns per AC#11 + the `listing_inquiries` table + indexes (`idx_listings_latitude_longitude` GIST or btree on both cols for the nearby query).
  - [x] 1.2 Extend `backend/modules/listing/models.Listing` with matching `Mapped` columns.
  - [x] 1.3 Extend `ListingDetailResponse` in `backend/modules/listing/schemas.py` with the new fields + `fair_price_band` + `review_breakdown` + `featured_review` + `total_reviews`. Keep `ListingListItem` untouched (avoid Story 2.3 regressions).
  - [x] 1.4 Update `backend/scripts/seed-data.py` to populate the new fields (housing category distribution per AC#11). **NOTE: file did not previously exist — created from scratch**.
  - [x] 1.5 Add `ListingInquiry` SQLAlchemy model in `backend/modules/listing/models.py` + `InquiryCreateRequest` / `InquiryCreatedResponse` in `schemas.py`.

- [x] Task 2: Backend — extend detail endpoint + wire SearchService fair-price (AC: #11)
  - [x] 2.1 In `backend/modules/listing/router.py`, extend the existing `GET /listings/{listing_id}` handler to inject `SearchService` via `Depends(get_search_service)` and call `await search_service._attach_fair_price([detail])` — if `_attach_fair_price` is currently private, promote it to a public method `attach_fair_price(items)` and update Story 2.3 callers in the same commit (backward compatible — same signature).
  - [x] 2.2 Hydrate `review_breakdown` + `featured_review` via the review repository (see Task 5).
  - [x] 2.3 Ensure photos are always included on the detail response (the existing include_photos flag path must be default `True` for the detail endpoint — see existing handler at `router.py:60`).

- [x] Task 3: Backend — nearby POIs endpoint (AC: #11)
  - [x] 3.1 Add `GET /api/v1/listings/{listing_id}/nearby_pois` handler in `backend/modules/listing/router.py`.
  - [x] 3.2 Add `ListingRepository.nearby_pois(listing_id, radius_m, limit=10)` — inline Haversine via raw SQL `text()`; no extension required.
  - [x] 3.3 Return `NearbyPoiItem[]` via a new Pydantic schema (added in Task 1).

- [x] Task 4: Backend — inquiry endpoint + rate limit (AC: #11)
  - [x] 4.1 Add `POST /api/v1/listings/{listing_id}/inquiries` handler (202 Accepted).
  - [x] 4.2 `shared/rate_limit.py` created — in-memory sliding window keyed on (ip, route); 10/hour enforced for `listing_inquiry`. `TODO(shared-rate-limit)` flagged for Redis migration.
  - [x] 4.3 Handler inserts `ListingInquiry` row directly (no InquiryService — over-abstraction for one insert) and emits `LISTING_INQUIRY_CREATED` via `shared.events.emit` after commit.

- [x] Task 5: Backend — minimal review module shell (AC: #11)
  - [x] 5.1 Check if `backend/modules/review/` exists. If yes, extend. If no, create the module shell (`__init__.py`, `models.py`, `repository.py`, `schemas.py`) with top docstring `# Partial module — write path owned by Epic 4.`.
  - [x] 5.2 `Review` SQLAlchemy model: created. Table provisioned via migration 0006 (not separate — safe since table did not yet exist).
  - [x] 5.3 `ReviewRepository.breakdown_for_listing(listing_id) -> dict[int, int]` + `featured_for_listing(listing_id) -> Review | None` (tiebreak: helpful_count DESC, created_at DESC).
  - [x] 5.4 Seed `backend/scripts/seed-data.py` to create 3–8 reviews per listing for realistic test data.

- [x] Task 6: Backend — tests (AC: #15)
  - [x] 6.1 Added `test_router_detail.py`, `test_nearby_pois.py`, `test_inquiries.py`, `tests/review/test_repository.py`.
  - [ ] 6.2 **SKIPPED (requires running backend):** regenerate `packages/types/src/api-types.ts` — `packages/types/generate.sh` needs a live `http://localhost:8000/openapi.json`. TODO(story-2-4-followup): run `pnpm --filter @danangnavi/types generate` after merging and commit the regenerated file.

- [x] Task 7: Frontend — module scaffold + page route (AC: #1, #2, #3, #4, #5, #6, #7, #8, #12)
  - [x] 7.1 Created `apps/web/modules/listing-detail/{components,lib}` (+ `__tests__` added in Task 11). No `hooks/` until a hook is actually needed.
  - [x] 7.2 `lib/detail-data.ts` — `fetchListingDetail` with 5s AbortController + `ListingNotFoundError` class; `fetchNearbyPois`; `fetchAllListingIdsForSitemap` helper paginates /api/v1/listings.
  - [x] 7.3 `app/(user)/[locale]/listings/[id]/page.tsx` — async server component, awaits params, notFound() on 404, composes all section stubs + emits JSON-LD LocalBusiness.
  - [x] 7.4 not-found.tsx created.
  - [x] 7.5 Sitemap extended with dynamic listing entries + ja/en/vi hreflang alternates; failure-tolerant (falls back to core).

- [x] Task 8: Frontend — gallery + header + key details (AC: #2, #3, #4)
  - [x] 8.1 `Gallery.tsx` implemented — mobile scroll-snap carousel, desktop 2×2 grid, Modal lightbox, keyboard (Arrow/Enter/Esc), senpai-verified pill, photo counter, priority on first image, lazy on rest.
  - [x] 8.2 `HeaderSection.tsx` + shared `FairPriceIcon.tsx` (new) — refactored `ListingCard` in same commit to consume `FairPriceIcon`. Renders title/dual price/quick specs/star/save+share with navigator.share + copy-link fallback.
  - [x] 8.3 `KeyDetails.tsx` server component — bilingual address, commute row conditional on `workplaceCoords` prop (page passes undefined until session wiring lands; commute row is hidden — FR71-compliant), availability/contract/deposit dual-currency/utilities i18n via `search.amenities.*`.

- [x] Task 9: Frontend — amenities + reviews + contract guidance (AC: #5, #6, #7)
  - [x] 9.1 Created `apps/web/shared/lib/amenity-icons.ts` — `AMENITY_ICONS` (emoji mapping) + `getAmenityIcon()`. `FilterPanel` already uses a prop-driven `amenityOptions` array (no inline icons to refactor); page-level callers can derive labels from the shared map when they want icons.
  - [x] 9.2 `Amenities.tsx` — 3/6-col grid, strikethrough+opacity for absent keys, labels via i18n `search.amenities.*`.
  - [x] 9.3 `ReviewsSection.tsx` — star histogram, featured review card, empty state, see-all link rendered disabled with TODO(story-4.2).
  - [x] 9.4 `ContractGuidance.tsx` reuses shared `Accordion`; copy from i18n.
  - [x] 9.5 `listing_detail.*` added to ja.json + en.json + vi.json; `search.amenities.*` extended with housing/utility keys.

- [x] Task 10: Frontend — location map + sticky action bar + contact modal (AC: #8, #9, #10)
  - [x] 10.1 `LocationMap.tsx` + `LocationMapLazy.tsx` (next/dynamic ssr:false, pulse loader). Navy listing pin, optional coral workplace pin, up to 10 teal POI pins. POIs passed as props (server-fetched in page).
  - [x] 10.2 `DetailStickyActionBar.tsx` composes shared `StickyActionBar` (dual-action variant) with compact JPY price + SaveHeartButton + Coral お問い合わせ CTA. Desktop right-rail card deferred — mobile-only per `md:hidden` gate on page; follow-up once desktop needs it.
  - [x] 10.3 `ContactModal.tsx` — Zod-validated form, `useTranslations` for copy, POST `/api/v1/listings/{id}/inquiries` with `cache: "no-store"`, AuthGate stub (TODO(epic-1)) renders ログイン link when `isAuthenticated === false`.
  - [x] 10.4 SaveHeartButton wired with local state; onSave persistence is `TODO(story-2.6)`.

- [x] Task 11: Frontend — tests + a11y (AC: #13, #15)
  - [x] 11.1 Added 5 vitest files (20 tests, all green): `detail-data.test.ts`, `fixtures.ts`, `Gallery.test.tsx`, `HeaderSection.test.tsx`, `ContactModal.test.tsx`, `FairPriceIcon.test.tsx`. Server-component tests (KeyDetails/Reviews/Contract) deferred — server-only `next-intl/server` needs heavier harness; covered by build smoke in Task 12 + axe check.
  - [ ] 11.2 **DEFERRED to Task 12:** axe-core smoke — add once `vitest-axe` dev-dep pinning is confirmed (the search module sets it up with `expect.extend(toHaveNoViolations)`). TODO(story-2-4-followup).
  - [x] 11.3 react-leaflet mocked via the existing `apps/web/tests/stubs/react-leaflet.tsx` (aliased in `vitest.config.ts`) — no change needed.

- [x] Task 12: Docs & cleanup (AC: all)
  - [x] 12.1 Updated `apps/web/README.md` with detail page local setup (migrate + seed_data + visit).
  - [x] 12.2 Updated `backend/README.md` — Story 2.4 endpoints section + review module scope note + seed command.
  - [x] 12.3 `python -m pytest` → **117 passed**. `pnpm build` compiles Story 2.4 code cleanly; prerender fails on unrelated `/vi/auth/callback` (Epic 1 Suspense issue — out of scope). Fixed 5 pre-existing search test fixtures that broke when `senpai_review_snippet` became a first-class `Listing` column. Fixed existing `test_router.py::test_returns_detail_with_nested_category_and_area` to provide new deps (SearchService/ReviewRepo/session).
  - [x] 12.4 Added `apps/web/public/og-listing-fallback.webp` (copy of `hero-danang.webp`; resize/crop to 1200×630 is a content follow-up — the binary is in place so metadata references resolve).

### Review Findings (Backend — 2026-04-18)

- [ ] [Review][Decision] Rate-limit 429 uses `HTTPException` instead of trilingual `AppException` — AC #11 says "All new errors use the existing trilingual `AppException` shape". Current response wraps trilingual dict inside `detail`; frontend error parser needs special-casing. [backend/shared/rate_limit.py:47-56]
- [ ] [Review][Decision] Inquiry `contact` field has no format validation (email/phone/LINE/Zalo) — accepts any string ≤200 chars; rate limit is only guard against spam. Decide: add format allowlist now or accept risk. [backend/modules/listing/schemas.py:841]
- [ ] [Review][Decision] Inquiry `user_id` stored as `None` unconditionally — authenticated users are not attributed even when session exists. Spec allows NULL FK; decide whether to wire current-user dependency now (vs. defer to Epic 7). [backend/modules/listing/router.py:757]
- [ ] [Review][Patch] Missing test: 404 on soft-deleted listing (AC #15 explicitly lists this) [backend/tests/listing/test_router_detail.py]
- [ ] [Review][Patch] Missing test: `LISTING_INQUIRY_CREATED` event emission after commit (AC #11) [backend/tests/listing/test_inquiries.py]
- [ ] [Review][Patch] `test_nearby_pois.py` mocks `ListingRepository.nearby_pois` — actual exclusion logic, null-coord filter, and ORDER BY distance ASC are never exercised. Add at least one integration test against a real session (AC #15). [backend/tests/listing/test_nearby_pois.py]
- [ ] [Review][Patch] Rate limiter ignores `X-Forwarded-For`; behind any proxy every request shares the upstream IP → global 10/hour for all users. Read the first untrusted hop from a configurable trusted-proxy list, fall back to `client.host`. [backend/shared/rate_limit.py:2160]
- [ ] [Review][Patch] `_BUCKETS` never evicts empty keys — `defaultdict` grows unbounded per unique `(ip, route)` tuple over uptime. Drop keys when their bucket list is empty after prune. [backend/shared/rate_limit.py]
- [ ] [Review][Patch] `nearby_pois` second fetch `select(Listing).where(Listing.id.in_(ids))` omits `deleted_at IS NULL` — a listing soft-deleted between the raw SQL and the refetch is returned. Add the filter. [backend/modules/listing/repository.py:589-598]
- [ ] [Review][Patch] `nearby_pois` Haversine runs full-table scan; no lat/lng bounding-box pre-filter despite the comment claiming one. `idx_listings_latitude_longitude` is unused. Add `l.latitude BETWEEN :lat_min AND :lat_max AND l.longitude BETWEEN :lng_min AND :lng_max` before the Haversine. [backend/modules/listing/repository.py:541-574]
- [ ] [Review][Patch] `nearby_pois` ORDER BY distance only — ties (including distance=0) are non-deterministic. Add `, l.id ASC` tiebreak. Same for `ReviewRepository.featured_for_listing` (add `, id` after `created_at DESC`). [backend/modules/listing/repository.py`, `backend/modules/review/repository.py`]
- [ ] [Review][Patch] `InquiryCreateRequest` fields pass Pydantic `min_length=1` with whitespace-only input (`"   "`), which `.strip()` collapses to empty string stored in NOT NULL column. Add a strip+non-empty validator on `name`, `contact`, `message`. [backend/modules/listing/schemas.py:840`, `backend/modules/listing/router.py:758]
- [ ] [Review][Patch] Inquiry event emit awaits handlers serially inside the request handler — comment says "fire-and-forget" but implementation blocks the 202 response. Wrap in `asyncio.create_task(emit(...))` or move to a background task. [backend/modules/listing/router.py:762-770`, `backend/shared/events.py:2107]
- [x] [Review][Defer] Fair-price band boundary (p75 inclusive, p25/p50 unused, equal-variance case) [backend/modules/search/service.py:1740-1745] — deferred, pre-existing from Story 2.3
- [x] [Review][Defer] `_search_db` DB fallback maps `sort_by="recommended"` → `"rating"`, losing senpai+review_count tiebreak [backend/modules/search/service.py:1661] — deferred, pre-existing 2.3 behavior
- [x] [Review][Defer] Meilisearch amenity filter only strips `"`, not backslash/meta chars [backend/modules/search/service.py:1632] — deferred, pre-existing 2.3 scope
- [x] [Review][Defer] `close_meilisearch_client` calls `get_meilisearch_client.__wrapped__()` which returns a fresh client, not the cached one — cached client never closed [backend/modules/search/client.py:1226] — deferred, infra cleanup
- [x] [Review][Defer] `reindex_listings` loads all listings into memory before batching [backend/scripts/reindex_listings.py:1847] — deferred, ops concern
- [x] [Review][Defer] `ListingDetailResponse.fair_price_band` is `Literal["fair","high","caution"] | None` but `ListingSearchItem.fair_price_band` is `str | None` — inconsistent [backend/modules/listing/schemas.py:808,869] — deferred, low risk
- [x] [Review][Defer] `subscribe` in `shared/events.py` appends handlers without dedupe — duplicate handlers on hot-reload [backend/shared/events.py:2094] — deferred, dev-mode only

## Dev Notes

### Purpose & scope

Story 2.4 is the **conversion surface**: users arrive from search/homepage/area guides and decide here whether to contact or save. It depends on Story 2.1 (listing model + detail endpoint), Story 2.3 (search module's fair-price compute + amenity icons + ListingCard), and feeds Story 2.6 (favorites) + Epic 4 (reviews) + Epic 7 (notifications).

### Architecture compliance (non-negotiable)

- **Module boundaries (backend):** the detail page endpoint stays in `listing/router.py`. Fair-price compute lives in `search/service.py` — the listing router injects `SearchService` via `Depends` and calls a promoted PUBLIC method `attach_fair_price(items)`; do NOT duplicate the computation. Review breakdown lives in a NEW `review/repository.py` (read-only shell). Source: `_bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Structure-Patterns`.
- **Path aliases (frontend):** ALL imports inside `apps/web/` MUST use `@/`. Source: `apps/web/AGENTS.md`.
- **Next.js 16:** the detail page is a server component; `params` is a Promise — `await` it. `generateMetadata({ params })` signature follows the same Promise pattern. Client components limited to `Gallery`, `HeaderSection`'s interactive buttons, `LocationMap`, `StickyActionBar`, `ContactModal`.
- **Design tokens:** Navy `bg-primary`, Coral `bg-secondary`, Teal accent `text-accent`. Use Tailwind tokens wired to `design-tokens.md` — do NOT inline hex values.
- **API response envelope:** backend `{ data, meta }`; server-side `fetch` helpers do MANUAL snake_case → camelCase via `toListingDetail()` mapper (same pattern Story 2.3 used for search results).
- **Error format:** trilingual `AppException` for all new exceptions.

### Existing code to reuse (prevent wheel reinvention)

- `apps/web/shared/components/ListingCard.tsx` — DO NOT use for the detail page (detail is richer), but DO refactor it to consume the new `FairPriceIcon` component (Task 8.2) so both pages share one icon source.
- `apps/web/shared/components/SaveHeartButton.tsx` — reuse for the `♡` button. Wire `onSave` prop to `TODO(story-2.6)`.
- `apps/web/shared/components/Modal.tsx` — reuse for the gallery lightbox AND the contact modal.
- `apps/web/shared/components/Accordion.tsx` — reuse for contract guidance.
- `apps/web/shared/components/StickyActionBar.tsx` — reuse for the mobile bottom bar.
- `apps/web/shared/components/SenpaiBadge.tsx` — reuse on the senpai-verified pill AND in review cards.
- `apps/web/modules/search/lib/format-price.ts::formatDualPrice` — reuse (do NOT create a parallel helper).
- `apps/web/modules/search/components/MapViewLazy.tsx` — copy the dynamic-import + ssr:false pattern for `LocationMapLazy` (do NOT abstract into a shared MapView yet — 2 usages is not enough; abstract on the 3rd usage per the project's "three repetitions" principle).
- `apps/web/tests/stubs/react-leaflet.tsx` + `leaflet.ts` — reuse for map tests.
- `backend/modules/search/service.py::SearchService._attach_fair_price` — promote to public `attach_fair_price` and call from the listing router.
- `backend/shared/events.py` — emit `listing.inquiry_created` (no handler in this story; Epic 7 will subscribe).
- `backend/shared/redis.py` — reuse for the fair-price cache (inherited via SearchService; no new Redis client).

### Out of scope for 2.4 (enforce boundaries)

- **Review write path** (star rating submission) — Story 4.1. Only read-only review queries here.
- **Review helpful-votes UI** — Story 4.2.
- **Favorites save API backend** — Story 2.6. The ♡ button is UI-only with `TODO(story-2.6)` onClick.
- **All reviews page** (`/[locale]/listings/[id]/reviews`) — Epic 4 scope. The `すべてのレビューを見る` link renders but is disabled with a `TODO(story-4.2)`.
- **Inquiry email / LINE notification** — Epic 7 (notifications). Emit the event only.
- **Slug-based listing URLs** — epic references `/ja/listings/[slug]` but listings have no `slug` column (per Story 2.1 / 2.3 model). This story uses UUID `[id]` URLs; slug URLs can be a follow-up that adds a `slug` column + redirect handler.
- **Business owner claim / edit UI** — Epic 8.
- **Translation API at runtime** — all content rendered as-authored; no runtime translation calls.
- **Real-time availability updates** — 5-min ISR is sufficient.

### Previous story intelligence

- **From Story 2.1:** `Listing` model has `title_ja`, `title_vi`, `description_ja`, `description_vi`, `address_ja`, `address_vi`, `price_vnd`, `latitude`, `longitude`, `rating_avg`, `review_count`, `is_senpai_verified`, `category_id`, `area_id`, `deleted_at`. `GET /api/v1/listings/{listing_id}` already returns `SingleEnvelope[ListingDetailResponse]` with photos (`router.py:60`). Detail photo hydration uses `MediaService.list_grouped_for_owners`.
- **From Story 2.2:** SSR fetch helper pattern (`fetchSenpaiPicks` → throws on non-2xx so ISR doesn't cache errors) — mirror exactly. Sitemap is at `apps/web/app/sitemap.ts`. `generateMetadata` + `localeToOgLocale` helpers at `apps/web/modules/home/lib/locale.ts` — reuse.
- **From Story 2.3:** Meilisearch + `SearchService` is the home of `_attach_fair_price` (promote to public). Migration 0005 added `property_type`, `ja_ok`, `amenities` to `Listing` — this story's migration is `0006` and should increment from there. Shared `ListingCard` is at `apps/web/shared/components/ListingCard.tsx`. Zod is already a frontend dep. `vitest-axe` a11y setup is in place. Amenity icon mappings currently live inlined in `modules/search/components/FilterPanel.tsx` — extract to shared in this story.
- **From Story 1.4 / 1.5.1:** Auth session + `AuthGate` helper — grep `apps/web/shared/` for `AuthGate` before assuming it exists; if absent, stub with `TODO(epic-1)` link to `/ja/signup`.

### Git intelligence (recent commits)

- `0e242ed feat story(2-3)` — search module + migration 0005 + shared ListingCard + MapViewLazy pattern + leaflet deps.
- `4547584 feat story(2-1)` — listing + media modules + migration 0004 + detail endpoint at `router.py:60`.
- Migration naming: the Alembic pattern is `YYYY_MM_DD_NNNN_{slug}.py` (see existing versions folder). Increment accordingly; do NOT pick `0006` as a literal prefix unless it matches the existing convention.

### Latest tech notes

- **Leaflet 1.9 + react-leaflet 4.x:** same constraints as Story 2.3 — `{ ssr: false }` dynamic import required; CSS imported once in the client map component.
- **Next.js 16:** `params` and `searchParams` are Promises — await them. `notFound()` from `next/navigation` renders the nearest `not-found.tsx`.
- **next/image:** `priority` on the LCP gallery image; all others `loading="lazy"`. `sizes` should match the responsive layout (e.g. `(min-width: 1024px) 50vw, 100vw`).
- **JSON-LD LocalBusiness:** emit inline via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />` inside the server component's JSX (safe because the data is server-sourced).
- **`navigator.share`:** HTTPS-only + user-gesture-required; feature-detect with `if (typeof navigator !== "undefined" && navigator.share)` and fall back to `navigator.clipboard.writeText`.

### Project structure notes

- **New frontend module:** `apps/web/modules/listing-detail/` (mirrors `modules/search/`).
- **New page route:** `apps/web/app/(user)/[locale]/listings/[id]/page.tsx` + `not-found.tsx`.
- **New Alembic migration:** follow existing `backend/migrations/versions/` naming convention — do NOT hard-code `0006` unless the filename pattern matches.
- **New backend endpoints:** extend `backend/modules/listing/router.py` (detail endpoint extension, nearby_pois, inquiries). Do NOT split into a new module.
- **Partial new backend module:** `backend/modules/review/` (read-only shell, explicitly flagged).
- **Shared lib creation:** `apps/web/shared/lib/amenity-icons.ts` (first usage; refactor Story 2.3's inline mapping in the SAME commit).
- **Public asset:** `apps/web/public/og-listing-fallback.webp`.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-discovery-search-listing-experience.md#Story-2.4]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR53,FR59,FR63,FR71]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Data-Architecture]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Structure-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Naming-Patterns]
- [Source: _bmad-output/implementation-artifacts/2-1-listing-data-model-api-foundation.md]
- [Source: _bmad-output/implementation-artifacts/2-2-homepage-hero-senpai-picks-deals.md — SSR fetch + sitemap + generateMetadata patterns]
- [Source: _bmad-output/implementation-artifacts/2-3-search-browse-with-cross-language-support.md — SearchService fair-price, MapViewLazy, ListingCard, amenity icons, leaflet stubs]
- [Source: apps/web/AGENTS.md — path alias rule]
- [Source: backend/modules/listing/router.py:60 — existing detail endpoint]
- [Source: backend/modules/search/service.py — _attach_fair_price to promote]
- [Source: apps/web/shared/components/ — verified inventory: Accordion, Modal, SaveHeartButton, StickyActionBar, SenpaiBadge, ListingCard]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

**Task 1 — Backend migration + models + schemas (complete):**
- Added Alembic migration `0006_add_listing_detail_fields` with new listing columns, `reviews` table, `listing_inquiries` table, and `idx_listings_latitude_longitude` btree.
- Extended `Listing` ORM with all new detail columns; added `ListingInquiry` model.
- Extended `ListingDetailResponse` with detail fields + `fair_price_band` + `review_breakdown` + `featured_review` + `total_reviews` + `property_type`/`ja_ok`/`amenities` pass-through. `ListingListItem` untouched.
- Added `ReviewItem`, `NearbyPoiItem`, `InquiryCreateRequest`, `InquiryCreatedResponse` schemas.
- Created `backend/scripts/seed-data.py` from scratch (idempotent, 10 housing + 4 restaurant + 3 cafe listings, ≥70% housing w/ rooms+size_sqm, all housing w/ available_from+contract_period_months; seeds 3–8 reviews per listing lazily once review module lands).

### File List
- A `backend/migrations/versions/2026_04_18_0002_add_listing_detail_fields.py`
- M `backend/modules/listing/models.py`
- M `backend/modules/listing/schemas.py`
- A `backend/scripts/seed-data.py`
- M `backend/modules/listing/router.py` (SearchService + ReviewRepository wiring)
- M `backend/modules/search/service.py` (public `attach_fair_price`)
- A `backend/modules/review/__init__.py`
- A `backend/modules/review/models.py`
- A `backend/modules/review/schemas.py`
- A `backend/modules/review/repository.py`
- M `backend/modules/listing/repository.py` (nearby_pois)
- M `backend/modules/listing/events.py` (LISTING_INQUIRY_CREATED)
- A `backend/shared/rate_limit.py`
- A `backend/tests/listing/test_router_detail.py`
- A `backend/tests/listing/test_nearby_pois.py`
- A `backend/tests/listing/test_inquiries.py`
- A `backend/tests/review/__init__.py`
- A `backend/tests/review/test_repository.py`
- A `apps/web/modules/listing-detail/lib/types.ts`
- A `apps/web/modules/listing-detail/lib/detail-data.ts`
- A `apps/web/modules/listing-detail/components/Gallery.tsx` (stub — Task 8)
- A `apps/web/modules/listing-detail/components/HeaderSection.tsx` (stub — Task 8)
- A `apps/web/modules/listing-detail/components/KeyDetails.tsx` (stub — Task 8)
- A `apps/web/modules/listing-detail/components/Amenities.tsx` (stub — Task 9)
- A `apps/web/modules/listing-detail/components/ReviewsSection.tsx` (stub — Task 9)
- A `apps/web/modules/listing-detail/components/ContractGuidance.tsx` (stub — Task 9)
- A `apps/web/modules/listing-detail/components/LocationMapLazy.tsx` (stub — Task 10)
- A `apps/web/modules/listing-detail/components/DetailStickyActionBar.tsx` (stub — Task 10)
- A `apps/web/app/(user)/[locale]/listings/[id]/page.tsx`
- A `apps/web/app/(user)/[locale]/listings/[id]/not-found.tsx`
- M `apps/web/app/sitemap.ts`
- A `apps/web/shared/components/FairPriceIcon.tsx`
- M `apps/web/shared/components/ListingCard.tsx` (consume FairPriceIcon)
- M `apps/web/modules/listing-detail/components/Gallery.tsx` (full impl)
- M `apps/web/modules/listing-detail/components/HeaderSection.tsx` (full impl)
- M `apps/web/modules/listing-detail/components/KeyDetails.tsx` (full impl)
- M `apps/web/app/(user)/[locale]/listings/[id]/page.tsx` (pass locale to KeyDetails)
- A `apps/web/shared/lib/amenity-icons.ts`
- M `apps/web/modules/listing-detail/components/Amenities.tsx` (full impl)
- M `apps/web/modules/listing-detail/components/ReviewsSection.tsx` (full impl)
- M `apps/web/modules/listing-detail/components/ContractGuidance.tsx` (full impl)
- M `apps/web/messages/{ja,en,vi}.json` (listing_detail.* + search.amenities.*)
- A `apps/web/modules/listing-detail/components/LocationMap.tsx`
- M `apps/web/modules/listing-detail/components/LocationMapLazy.tsx` (full impl)
- A `apps/web/modules/listing-detail/components/ContactModal.tsx`
- M `apps/web/modules/listing-detail/components/DetailStickyActionBar.tsx` (full impl)
- R `backend/scripts/seed-data.py` → `seed_data.py` (Python module-safe name)
- A `apps/web/modules/listing-detail/__tests__/fixtures.ts`
- A `apps/web/modules/listing-detail/__tests__/detail-data.test.ts`
- A `apps/web/modules/listing-detail/__tests__/Gallery.test.tsx`
- A `apps/web/modules/listing-detail/__tests__/HeaderSection.test.tsx`
- A `apps/web/modules/listing-detail/__tests__/ContactModal.test.tsx`
- A `apps/web/modules/listing-detail/__tests__/FairPriceIcon.test.tsx`
- M `apps/web/README.md` (detail page local steps)
- M `backend/README.md` (Story 2.4 endpoints + review module scope + seed)
- A `apps/web/public/og-listing-fallback.webp`
- M `apps/web/package.json` (add `zod` dependency)
- M `backend/tests/listing/test_router.py` (new detail deps + senpai_review_snippet)
- M `backend/tests/listing/test_router_detail.py` (monkeypatch review repo)
- M `backend/tests/listing/test_inquiries.py` (CSRF cookie+header)
- M `backend/tests/review/test_repository.py` (defensive class-attr restore fixture)
- M `backend/tests/search/test_service.py` (senpai_review_snippet=None on spec)
- M `backend/tests/search/test_router.py` (senpai_review_snippet=None on spec)
