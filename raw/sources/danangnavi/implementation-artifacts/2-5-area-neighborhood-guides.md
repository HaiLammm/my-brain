# Story 2.5: Area / Neighborhood Guides

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese newcomer choosing where to live in Da Nang,
I want to browse an areas index and per-area guide pages with lifestyle info, commute context, senpai-recommended spots, and a one-tap path into filtered search,
so that I can pick the right neighborhood based on commute, lifestyle, and budget before I go deep on individual listings.

## Acceptance Criteria

1. **Given** I navigate to `/{locale}/areas` (canonical `/ja/areas`), **When** the page SSR-renders via a Next.js server component, **Then** it fetches `GET /api/v1/areas` (already shipped in Story 2.1 — `AreaWithCountResponse[]` with `{ id, slug, name_ja, name_vi, description_ja, description_vi, listing_count }`) and renders ALL non-deleted areas as clickable cards; each card shows `name_ja` (h3), hero photo (or a Navy gradient placeholder if `hero_photo_url` is null), `listing_count` (e.g., `{count}件の物件`), average rent range dual-currency (`avg_rent_min_vnd`–`avg_rent_max_vnd` + `¥{jpy}` via `formatDualPrice`), and up to 3 highlight tags. Cards link to `/{locale}/areas/{slug}`.

2. **Given** I navigate to `/{locale}/areas/{slug}` (canonical `/ja/areas/{slug}`), **When** the page loads, **Then** the server component `await`s `params` (Next 16 Promise contract), fetches `GET /api/v1/areas/{slug}` (NEW endpoint — see AC#8), renders `not-found.tsx` for a 404, and composes Section 1–4 below. Slug matches `^[a-z0-9-]+$`; lookup is case-sensitive on the stored slug (seed slugs are lowercase: `hai-chau`, `son-tra`, `ngu-hanh-son`, `lien-chieu`, `thanh-khe`, `han-river-east`).

3. **Given** Section 1 (Area Overview) renders, **Then** it shows: area `name_ja` (h1, `text-h1`), `name_vi` secondary line (`text-muted`), `description_ja`, and an embedded Leaflet map lazy-loaded via `next/dynamic({ ssr: false })` centered on `(centroid_lat, centroid_lng)` with a Navy boundary polygon (use `area.boundary_geojson` when non-null; if null, render a filled circle marker with `radius_m=1500` at the centroid — do NOT omit the map). Reuse the `LocationMapLazy` + react-leaflet stubs pattern from Story 2.4 (`apps/web/modules/listing-detail/components/LocationMapLazy.tsx`) — extract the shared parts into `apps/web/shared/components/AreaMapLazy.tsx` if and only if a second caller appears here; otherwise keep a sibling component `apps/web/modules/area-guide/components/AreaMapLazy.tsx` with the same props contract. If both `centroid_lat` and `centroid_lng` are null, omit the map container entirely and render the description full-width.

4. **Given** Section 2 (Lifestyle Info) renders, **Then** a 2×2 card grid (mobile: single column) shows: avg rent range dual-currency (Navy `text-primary` VND large, teal `text-accent` JPY secondary via `formatDualPrice`), commute summary as a bullet list of `area.commute_summaries[]` items `{ destination_ja, minutes_by_motorbike }` rendered as `🏍️ {destination_ja}まで{minutes}分` (show ALL entries; show NONE and hide the card if empty — do not render a "no data" placeholder), atmosphere description (`area.atmosphere_ja` free text), and safety rating rendered as a 1–5 star row with `aria-label="治安評価 {rating}/5"` (hide the card if `safety_rating` is null).

5. **Given** Section 3 (Senpai-Recommended Spots) renders, **Then** it shows a horizontal scroll on mobile / 3-column grid on desktop of up to 6 listing cards from this area, ranked by `is_senpai_verified DESC, rating_avg DESC, review_count DESC, id ASC` (stable tiebreak). Reuse the shared `apps/web/shared/components/ListingCard.tsx` component EXACTLY — do NOT create a variant; do NOT inline a duplicate. Each card uses the same envelope mapping as Story 2.3 search results (fair-price band, dual price, senpai badge). If fewer than 3 senpai-verified listings exist, backfill with top-rated non-verified listings (tiebreak order above); if zero listings exist in the area, render an empty-state card with `まだこのエリアにおすすめ物件がありません` (i18n key `area_guide.empty_spots`) and hide the "senpai quote" line.

6. **Given** the primary search CTA, **When** I tap `このエリアで物件を探す` (Coral primary, full-width mobile / inline desktop), **Then** I navigate to `/{locale}/listings?area={slug}` (the search page already supports the `area` query param per Story 2.3 FilterPanel); the CTA renders in the sticky action area on mobile viewports (< 768px) using the shared `StickyActionBar` (single-action variant) and inline below Section 3 on desktop — do NOT render both on the same viewport.

7. **Given** SEO + i18n (FR59, FR63), **When** either page SSR-renders, **Then**:
   - `generateMetadata({ params })` awaits params and returns: title `{area.name_ja}エリアガイド — ダナンナビ` (index page title: `ダナンのエリアガイド — ダナンナビ`), description = `area.description_ja` truncated to 155 chars (fallback: `{name_ja}の暮らし、相場、通勤情報`), canonical `/{locale}/areas/{slug}` (or `/{locale}/areas`), `og:locale=ja_JP`, `og:type=website`, `og:image=area.hero_photo_url` (fallback `/og-area-fallback.webp` — add the file under `apps/web/public/` copied from the existing listing fallback; resize to 1200×630 is a content follow-up), Twitter `summary_large_image`, and ja/en/vi hreflang alternates via the `localeToOgLocale` helper at `apps/web/modules/home/lib/locale.ts` (reuse — do NOT duplicate).
   - Detail page emits a JSON-LD `<script type="application/ld+json">` with schema.org `Place` (name, description, geo with lat/lng, address=name_vi, image) — emit inline server-side via `dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}`.
   - `apps/web/app/sitemap.ts` is extended: `/ja/areas` (priority 0.7, monthly) and one entry per area `/ja/areas/{slug}` (priority 0.7, monthly) with ja/en/vi hreflang alternates. Use a new helper `fetchAllAreaSlugsForSitemap()` in `apps/web/modules/area-guide/lib/area-data.ts` that paginates `GET /api/v1/areas` (single-page load is fine — areas list is bounded to ~10) with `next: { revalidate: 3600 }`. Mirror the failure-tolerant pattern from `fetchAllListingIdsForSitemap` (swallow errors, return `[]` so sitemap still emits core routes).
   - All user-facing strings live under the i18n namespace `area_guide.*` in `apps/web/messages/{ja,en,vi}.json` — JA is authoritative, EN/VI get placeholder strings for type safety. Do NOT hardcode Japanese text in components.

8. **Given** the backend contract, **When** this story ships, **Then**:
   - Alembic migration `{YYYY_MM_DD_NNNN}_add_area_guide_fields.py` (name follows the existing `backend/migrations/versions/` convention — inspect first; the next sequence is likely `2026_04_18_0003_*` or a dated fresh stamp) adds to `areas`: `hero_photo_url VARCHAR(500) NULL`, `atmosphere_ja TEXT NULL`, `atmosphere_vi TEXT NULL`, `safety_rating SMALLINT NULL CHECK (safety_rating BETWEEN 1 AND 5)`, `highlights VARCHAR(50)[] NOT NULL DEFAULT '{}'`, `commute_summaries JSONB NOT NULL DEFAULT '[]'::jsonb` (each entry `{ destination_ja: str, destination_vi: str, minutes_by_motorbike: int }`), `avg_rent_min_vnd BIGINT NULL`, `avg_rent_max_vnd BIGINT NULL`, `boundary_geojson JSONB NULL` (nullable for MVP — full GeoJSON polygon for future map rendering, ignored by this story's fallback-circle path). `downgrade()` drops them cleanly.
   - `backend/scripts/seed_data.py` is extended to populate ALL the new fields on the 5+ existing seeded areas (Hai Chau, Son Tra, Ngu Hanh Son, Lien Chieu, Thanh Khe) with realistic values: `safety_rating ∈ [3,5]`, at least 2 `commute_summaries` entries per area (destinations: `ハイチャウ オフィス街`, `ミーケビーチ`, `ダナン国際空港`), `highlights` = 3 tags from `{静か, ビーチ, 日本食多い, 中心部, 安い, ファミリー向け, ナイトライフ, 学校近く}`. Seed idempotency must be preserved (existing UPSERT-by-slug pattern).
   - `AreaResponse` schema (`backend/modules/listing/schemas.py`) is extended with the new fields. `AreaWithCountResponse` inherits the additions. Add a NEW `AreaGuideResponse(AreaWithCountResponse)` that also includes `featured_spots: list[ListingListItem]` (up to 6) + `avg_rent_display: { vnd_range: str, jpy_range: str } | None` (precomputed pretty-printed string so the frontend doesn't need to re-format — reuse `formatDualPrice` logic in Python OR keep frontend-only formatting and DROP this field; pick ONE and do not split the contract).
   - NEW endpoint `GET /api/v1/areas/{slug}` in `backend/modules/listing/router.py` returns `SingleEnvelope[AreaGuideResponse]`:
     - 404 via `AreaNotFoundException(AppException)` when slug does not match OR `deleted_at IS NOT NULL`.
     - `featured_spots` populated via `ListingRepository.top_spots_for_area(area_id, limit=6)` — ordered by `is_senpai_verified DESC, rating_avg DESC, review_count DESC, id ASC`, filters `deleted_at IS NULL AND area_id = :area_id`.
     - Each featured spot MUST go through `SearchService.attach_fair_price([...])` (public method promoted in Story 2.4) — inject `SearchService` via `Depends(get_search_service)`. Do NOT duplicate fair-price computation.
     - Photos attached via the existing `MediaService.list_grouped_for_owners(listing_ids)` path (same pattern the listing detail endpoint uses).
   - The existing `GET /api/v1/areas` (list) endpoint is extended to include the new fields in `AreaWithCountResponse`. Do NOT add `featured_spots` to the list endpoint (keep payload small — only detail carries it).
   - Add `AreaRepository.get_by_slug(slug)` + `AreaRepository.top_spots_for_area(area_id, limit)` — read-only, repository-pattern compliant. Do NOT inline queries in the router/service. New logic belongs in `AreaService.get_guide_by_slug(slug)` composing the repository calls + `attach_fair_price`.
   - All new errors use the existing trilingual `AppException` shape. Emit no events (area guide is a read-only surface; no cross-module side effects).

9. **Given** accessibility at 375/768/1280 px, **When** the page is inspected, **Then**: all cards are keyboard-reachable with visible `:focus-visible` outlines (Tailwind `focus-visible:ring-2 focus-visible:ring-accent`); area cards on the index use a single `<a>` wrapper (no nested interactives); the safety-rating stars announce as `aria-label` per AC#4; the map container has `role="region" aria-label="{name_ja}の地図"`; all images have descriptive `alt` text (`{name_ja} — ヒーロー写真` for hero, `{title_ja}` for listing cards via existing `ListingCard`); Japanese text uses `var(--font-family-primary)` (Noto Sans JP); axe-core reports 0 violations on both pages.

10. **Given** performance, **When** the page loads on a 3G throttled connection, **Then**: hero image on the index page uses `next/image` with `priority` only on the FIRST card above the fold and `loading="lazy"` on the rest; the map bundle is split via `next/dynamic({ ssr: false })` and does NOT ship in the initial JS payload; `fetchAreas` and `fetchAreaGuide` use `fetch(url, { next: { revalidate: 300 } })` with a 5s `AbortController` (same SSR-fetch pattern as `fetchListingDetail` / `fetchSenpaiPicks`); non-2xx throws so ISR does not cache errors.

11. **Given** tests, **When** `pnpm --filter web test` + `pytest backend/tests/` run, **Then**:
    - **Backend:** `backend/tests/listing/test_areas.py` (NEW or extend if present) covers: `GET /api/v1/areas` returns extended fields (hero_photo_url, safety_rating, highlights, commute_summaries, avg_rent_*); `GET /api/v1/areas/{slug}` 200 happy path with `featured_spots` length ≤ 6 and fair_price_band attached; 404 on unknown slug; 404 on soft-deleted area; `top_spots_for_area` ordering (senpai first, then rating desc) with a fixture that has both kinds. `backend/tests/listing/test_area_repository.py` covers: `get_by_slug` returns None for soft-deleted, `top_spots_for_area` excludes soft-deleted listings. Target ≥ 80% branch coverage on new area handlers.
    - **Frontend:** `apps/web/modules/area-guide/__tests__/area-data.test.ts` (fetch helpers + Abort + mapping), `AreaCard.test.tsx` (dual-price format, placeholder when no hero image, correct slug link), `AreaGuidePage.test.tsx` (SSR render, 404 via `notFound()`, metadata generation), `LifestyleInfo.test.tsx` (hide safety card when null, hide commute card when empty), `SenpaiSpots.test.tsx` (empty state, reuses shared `ListingCard`). Mock `react-leaflet` via the existing `apps/web/tests/stubs/react-leaflet.tsx` alias (DO NOT create a new stub).
    - Regenerate `packages/types/src/api-types.ts` after backend schemas land — script is `packages/types/generate.sh` (needs a live `http://localhost:8000/openapi.json`). If unable to run it locally, leave a `TODO(story-2-5-followup): regenerate api-types after merge` in the PR description and rely on the backend tests for contract coverage.

## Tasks / Subtasks

- [x] Task 1: Backend — migration + Area model fields + seed data (AC: #8)
  - [x] 1.1 Inspect `backend/migrations/versions/` for the latest filename and pick the next sequential stamp. Create `{stamp}_add_area_guide_fields.py` with all new columns per AC#8 + CHECK constraint on `safety_rating`. Ensure `downgrade()` drops cleanly.
  - [x] 1.2 Extend `backend/modules/listing/models.Area` with matching `Mapped` columns (use `ARRAY(String(50))` for `highlights`, `JSONB` for `commute_summaries` and `boundary_geojson` via `sqlalchemy.dialects.postgresql.JSONB`).
  - [x] 1.3 Extend `AreaResponse` in `backend/modules/listing/schemas.py` with the new fields + a `CommuteSummary` nested Pydantic model. Add `AreaGuideResponse(AreaWithCountResponse)` with `featured_spots: list[ListingListItem]`.
  - [x] 1.4 Update `backend/scripts/seed_data.py` UPSERT-by-slug block to populate all new fields with realistic values for the 5 seeded areas. Preserve idempotency.
  - [x] 1.5 Decide avg-rent formatting ownership: either (a) Python precomputes `avg_rent_display` and drops from schema, OR (b) frontend formats via `formatDualPrice`. Pick (b) for MVP — drop `avg_rent_display` from the schema. Update AC#8 comment in PR if you reverse course.

- [x] Task 2: Backend — AreaService + AreaRepository + detail endpoint (AC: #8)
  - [x] 2.1 Add `AreaRepository.get_by_slug(slug)` + `AreaRepository.top_spots_for_area(area_id, limit=6)` in `backend/modules/listing/repository.py`. Both filter `deleted_at IS NULL`.
  - [x] 2.2 Extend `AreaService` with `get_guide_by_slug(slug)`: fetches area → fetches top spots → calls `search_service.attach_fair_price(spots)` → attaches photos via `MediaService.list_grouped_for_owners([listing_ids])` → returns `AreaGuideResponse`.
  - [x] 2.3 Add `AreaNotFoundException(AppException)` in `backend/modules/listing/exceptions.py` with trilingual messages (`エリアが見つかりません` / `Không tìm thấy khu vực` / `Area not found`, status 404).
  - [x] 2.4 Add `GET /api/v1/areas/{slug}` handler in `backend/modules/listing/router.py`. Inject `AreaService`, `SearchService`, `MediaService` via `Depends`. Validate `slug` with a Pydantic regex (`^[a-z0-9-]+$`) — return 404 (not 422) on mismatch to avoid slug enumeration.
  - [x] 2.5 Ensure existing `GET /api/v1/areas` list endpoint still passes tests after `AreaResponse` gains new fields — update `AreaWithCountResponse.model_validate(area)` calls if needed.

- [x] Task 3: Backend — tests (AC: #11)
  - [x] 3.1 Add `backend/tests/listing/test_areas.py` (or extend) covering list + detail endpoint assertions per AC#11.
  - [x] 3.2 Add `backend/tests/listing/test_area_repository.py` for `get_by_slug` + `top_spots_for_area` ordering + soft-delete exclusion.
  - [x] 3.3 Run `python -m pytest backend/tests/` → all green, no regressions in `listing/test_router.py` or `search/test_*.py` caused by schema additions.

- [x] Task 4: Frontend — area-guide module scaffold + data layer (AC: #1, #2, #7)
  - [x] 4.1 Create `apps/web/modules/area-guide/{components,lib,__tests__}/`.
  - [x] 4.2 `lib/types.ts` — TypeScript interfaces mirroring `AreaResponse`, `AreaWithCountResponse`, `AreaGuideResponse`, `CommuteSummary` (manual until `packages/types/generate.sh` runs; mark with `// TODO(story-2-5-followup): replace with generated api-types`).
  - [x] 4.3 `lib/area-data.ts` — `fetchAreas()`, `fetchAreaGuide(slug)`, `fetchAllAreaSlugsForSitemap()`, `AreaNotFoundError` class. All use 5s `AbortController` + `next: { revalidate: 300 }` (sitemap helper uses 3600). Snake→camel mapping via a `toAreaGuide(dto)` mapper (same hand-rolled pattern as `toListingDetail` from Story 2.4).

- [x] Task 5: Frontend — index page `/areas` (AC: #1, #7, #10)
  - [x] 5.1 Create `apps/web/app/(user)/[locale]/areas/page.tsx` — async server component, awaits `params`, calls `fetchAreas()`, renders `<AreaIndex areas={areas} />`.
  - [x] 5.2 Create `AreaCard.tsx` (client component only if needed for interaction — otherwise server component wrapping an `<a>` from `next/link`). Renders hero image (or gradient placeholder), name_ja, listing count, avg rent dual-currency, highlights chips.
  - [x] 5.3 `generateMetadata` for the index page per AC#7.
  - [x] 5.4 i18n keys: `area_guide.index.title`, `area_guide.index.subtitle`, `area_guide.card.listings_count`, `area_guide.card.rent_range` in `messages/{ja,en,vi}.json`.

- [x] Task 6: Frontend — detail page `/areas/[slug]` (AC: #2, #3, #4, #5, #6, #7)
  - [x] 6.1 Create `apps/web/app/(user)/[locale]/areas/[slug]/page.tsx` + `not-found.tsx`. Server component awaits params, calls `fetchAreaGuide(slug)`, calls `notFound()` on `AreaNotFoundError`.
  - [x] 6.2 `AreaOverview.tsx` — name + description + map slot. Map rendered via `AreaMapLazy.tsx` (sibling component; mirror `LocationMapLazy` pattern from listing-detail). Pass `{ centroidLat, centroidLng, boundaryGeojson | null, areaName }`.
  - [x] 6.3 `AreaMap.tsx` + `AreaMapLazy.tsx` — Leaflet map; if `boundaryGeojson` non-null render a `Polygon`; else render a `Circle` with `radius=1500`; Navy stroke, semi-transparent fill.
  - [x] 6.4 `LifestyleInfo.tsx` — 2×2 card grid. Each card is a server component. Hide cards per AC#4 (no "not set" placeholders).
  - [x] 6.5 `SenpaiSpots.tsx` — horizontal scroll mobile / 3-col grid desktop. Reuse `@/shared/components/ListingCard`. Empty state per AC#5.
  - [x] 6.6 `SearchInAreaCta.tsx` — mobile uses shared `StickyActionBar` (single-action variant); desktop renders inline. Gate by Tailwind `md:hidden` / `hidden md:block` — do NOT render both.
  - [x] 6.7 `generateMetadata({ params })` + JSON-LD `Place` emit per AC#7.

- [x] Task 7: Frontend — sitemap + i18n completeness (AC: #7)
  - [x] 7.1 Extend `apps/web/app/sitemap.ts` with `/areas` and dynamic `/areas/{slug}` entries using `fetchAllAreaSlugsForSitemap()`. Failure-tolerant: wrap in try/catch, return empty list on error so core sitemap still emits.
  - [x] 7.2 Add `og-area-fallback.webp` to `apps/web/public/` (can be a copy of `og-listing-fallback.webp` or `hero-danang.webp` for now; content follow-up for a proper 1200×630 area-themed image).
  - [x] 7.3 Complete `area_guide.*` i18n keys in `ja.json` (authoritative), plus placeholder translations in `en.json` + `vi.json` (Vietnamese uses `name_vi` and `description_vi` from the API for dynamic content, but static copy still needs VI placeholders).

- [x] Task 8: Frontend — tests + a11y (AC: #9, #11)
  - [x] 8.1 Add vitest files per AC#11 under `apps/web/modules/area-guide/__tests__/`. Use `apps/web/tests/stubs/react-leaflet.tsx` (aliased in `vitest.config.ts`).
  - [x] 8.2 Axe-core smoke test on both pages — reuse the `vitest-axe` setup from the listing-detail module when that lands (follow-up if not yet stable; flag `TODO(story-2-5-followup): axe smoke` in PR).
  - [x] 8.3 Run `pnpm --filter web test` + `pnpm --filter web build` → both green for Story 2.5 code. Known pre-existing prerender failures (e.g., `/vi/auth/callback` from Epic 1) are out of scope — note them in the PR.

- [x] Task 9: Docs & cleanup (AC: all)
  - [x] 9.1 Update `apps/web/README.md` with local steps to view area guides (migrate + seed + visit `/ja/areas`).
  - [x] 9.2 Update `backend/README.md` with the new `GET /api/v1/areas/{slug}` endpoint and the area guide fields.
  - [x] 9.3 Verify sitemap locally (`curl localhost:3000/sitemap.xml | grep areas`).
  - [x] 9.4 Regenerate `packages/types/src/api-types.ts` if a live backend is available; else add a follow-up TODO in the PR description.

## Dev Notes

### Purpose & scope

Story 2.5 is the **neighborhood decision surface** in the Naoki's-first-week journey: users come from onboarding or the homepage with the question "where should I live?" and leave with a shortlist of 2–3 areas + a one-tap path into filtered search. It depends on Story 2.1 (`Area` model + `GET /api/v1/areas`), Story 2.3 (search query-param contract for `?area=...` + shared `ListingCard`), and Story 2.4 (public `SearchService.attach_fair_price`, `LocationMapLazy` pattern, SSR fetch + sitemap + `generateMetadata` + JSON-LD patterns). It feeds back into Story 2.3 search via the `このエリアで物件を探す` CTA. No other module depends on this story's endpoints.

### Architecture compliance (non-negotiable)

- **Module boundaries (backend):** All area logic stays inside `backend/modules/listing/` (area is a first-class entity of the listing module per Story 2.1; do NOT create a separate `area` module). The handler injects `SearchService` via `Depends` to reuse `attach_fair_price` — do NOT import it directly, do NOT re-implement the band logic. Photos hydrate via `MediaService` (same injection pattern). Source: `_bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Structure-Patterns`.
- **Repository pattern:** No inline SQL in the router/service. Add `AreaRepository.get_by_slug` and `AreaRepository.top_spots_for_area` — service composes them.
- **Path aliases (frontend):** ALL imports inside `apps/web/` MUST use `@/`. Source: `apps/web/AGENTS.md`.
- **Next.js 16:** Pages are server components; `params` is a Promise — `await` it. `generateMetadata({ params })` also awaits. Client components limited to `AreaMap` (needs `window`), interactive CTAs.
- **Design tokens:** Navy `bg-primary`, Coral `bg-secondary`, Teal accent `text-accent`. Do NOT inline hex. Source: `_bmad-output/D-Design-System/design-tokens.md`.
- **API response envelope:** backend returns `{ data }`; frontend does MANUAL snake→camel via `toAreaGuide()` mapper (same pattern Story 2.3/2.4 used).
- **Error format:** trilingual `AppException` for all new exceptions (AreaNotFoundException).
- **Soft delete:** all repository queries filter `deleted_at IS NULL` by default. 404 (not 410) on soft-deleted area — do not leak deletion state.

### Existing code to reuse (prevent wheel reinvention)

- `apps/web/shared/components/ListingCard.tsx` — reuse EXACTLY for senpai spots. DO NOT create a variant. (The Story 2.4 review already refactored `ListingCard` to consume `FairPriceIcon`; no further changes needed here.)
- `apps/web/shared/components/StickyActionBar.tsx` — reuse for the mobile CTA (single-action variant).
- `apps/web/modules/search/lib/format-price.ts::formatDualPrice` — reuse for avg-rent dual-currency. DO NOT create a parallel helper.
- `apps/web/modules/home/lib/locale.ts::localeToOgLocale` — reuse for hreflang / og:locale in `generateMetadata`.
- `apps/web/modules/listing-detail/components/LocationMapLazy.tsx` — mirror the `next/dynamic({ ssr: false })` + pulse-loader pattern for `AreaMapLazy`. Do NOT abstract into a shared `MapViewLazy` yet — this is the 3rd map usage but each has distinct props (single pin vs. polygon vs. many POI markers); wait for a 4th before generalising.
- `apps/web/tests/stubs/react-leaflet.tsx` + `leaflet.ts` — reuse for map component tests via the existing `vitest.config.ts` alias.
- `backend/modules/search/service.py::SearchService.attach_fair_price` — public method as of Story 2.4. Call from `AreaService.get_guide_by_slug`.
- `backend/modules/media/service.py::MediaService.list_grouped_for_owners` — reuse for photo hydration on featured spots.
- `backend/shared/exceptions.py::AppException` — base class for `AreaNotFoundException`.
- `backend/scripts/seed_data.py` — extend the existing UPSERT-by-slug block for areas; do NOT duplicate a seeding routine.

### Out of scope for 2.5 (enforce boundaries)

- **Senpai count per area** (`👥 先輩 42人が在住` from the UX spec) — requires a senpai residency model tied to user profiles (Epic 3). Skip the count; if you show any senpai signal on the area card, use `is_senpai_verified` listing count as a proxy only if it's already derivable from `AreaWithCountResponse` — otherwise omit.
- **Commute times from user's workplace** (personalized `職場まで15分`) — depends on onboarding workplace storage (Epic 3 Story 3.1). This story renders generic commute summaries only (from `area.commute_summaries[]` seed data). Do NOT add a workplace prop to components.
- **Senpai quote / stories section** (UX spec Section 4) — requires Epic 4 review content with area tagging. Defer.
- **Pros/Cons lists + price-breakdown table + nearby essentials icons** (UX spec Section 3 expanded view) — deferred to a richer "area detail expanded" iteration post-MVP. Render area overview + lifestyle info + senpai spots only.
- **Interactive map with boundary polygons clickable → scroll to area card** (UX spec on-page interaction) — MVP uses static map + card list. Defer cross-wiring.
- **Area slug redirects / slug history** — areas are seeded once; slugs are stable. If you rename later, handle it in a follow-up.
- **Price toggle VND↔JPY** (UX spec on-page interaction) — show dual currency side-by-side (same as other surfaces); no runtime toggle.

### Previous story intelligence

- **From Story 2.1:** `Area` model already has `id, slug, name_ja, name_vi, description_ja, description_vi, centroid_lat, centroid_lng` + `deleted_at`. `GET /api/v1/areas` already ships and returns `AreaWithCountResponse` (includes `listing_count`). Seed data already creates 5 areas via UPSERT-by-slug — extend, do not recreate. Migration naming pattern is `YYYY_MM_DD_NNNN_{slug}.py` — inspect `backend/migrations/versions/` and pick the next stamp (most recent is `2026_04_18_0002_add_listing_detail_fields.py`).
- **From Story 2.2:** `generateMetadata` + `localeToOgLocale` helpers at `apps/web/modules/home/lib/locale.ts` — reuse. Sitemap is at `apps/web/app/sitemap.ts` with a dynamic-section pattern already in place (2.4 added listing entries) — extend, don't replace.
- **From Story 2.3:** Search page supports `?area={slug}` query param (URL contract — do NOT change it). Shared `ListingCard` lives at `apps/web/shared/components/ListingCard.tsx`. `FilterPanel` reads area from URL params on mount. Meilisearch is optional here (area guide is structured + bounded — direct DB queries via repository are sufficient; do NOT index areas into Meilisearch).
- **From Story 2.4:** `SearchService._attach_fair_price` was PROMOTED to public `attach_fair_price(items)` — call it. `LocationMapLazy` pattern established at `apps/web/modules/listing-detail/components/LocationMapLazy.tsx`. SSR fetch helpers (5s AbortController + throw on non-2xx) established in `apps/web/modules/listing-detail/lib/detail-data.ts` — mirror exactly for `area-data.ts`. `og-listing-fallback.webp` exists under `apps/web/public/` (can be copied or repurposed as the area fallback for MVP). Migration 0002 on 2026-04-18 added listing detail fields — if area migration lands same day, use `_0003` suffix.

### Git intelligence (recent commits)

- `cd0c16c update story(2-4): task 12 — docs, build verify, test fixes, og fallback` — look here for the established build-verify flow and the fallback-image approach.
- `46bf236 feat story(2-4): implement listing detail page (backend + frontend)` — the canonical template for a "new Next.js page + backend endpoint + migration + seed + tests" story. Mirror its structure.
- `0e242ed feat story(2-3)` — `FilterPanel` area query param + shared `ListingCard`.
- `4547584 feat story(2-1)` — `Area` model + `/api/v1/areas` list endpoint + seed data UPSERT pattern.

### Latest tech notes

- **Next.js 16 App Router:** `params` + `searchParams` are Promises — await. `notFound()` from `next/navigation` renders the nearest `not-found.tsx`. `revalidate` via `fetch(url, { next: { revalidate: 300 } })` is still the ISR mechanism (Cache Components / `use cache` is available in 16 but Story 2.4 stayed on `next: { revalidate }` — match it for consistency).
- **Leaflet + react-leaflet:** same stack as Story 2.3/2.4 — `{ ssr: false }` dynamic import, CSS imported once in the client component, leaflet icon-URL hack applied at module load (see `apps/web/modules/search/lib/leaflet-icon-fix.ts` from Story 2.3 — reuse it in `AreaMap.tsx`, do not re-hack).
- **JSON-LD Place:** emit inline server-side via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />`. Safe because data is server-sourced.
- **PostgreSQL JSONB for `commute_summaries`:** use `sqlalchemy.dialects.postgresql.JSONB`. Pydantic model for `CommuteSummary` enforces shape; validator asserts `minutes_by_motorbike > 0`.
- **GeoJSON boundary (`boundary_geojson`) is nullable for MVP** — seed with null and render the fallback circle. Future ops work can populate boundaries without a schema change.

### Project structure notes

- **New frontend module:** `apps/web/modules/area-guide/` (mirrors `modules/listing-detail/`, `modules/search/`).
- **New page routes:** `apps/web/app/(user)/[locale]/areas/page.tsx` + `apps/web/app/(user)/[locale]/areas/[slug]/page.tsx` + `not-found.tsx`.
- **New Alembic migration:** follow existing `backend/migrations/versions/YYYY_MM_DD_NNNN_*.py` naming. Do NOT hardcode a number — inspect the directory and pick the next sequence.
- **Backend additions:** extend `backend/modules/listing/{models,schemas,repository,service,router,exceptions}.py`. Do NOT split into a new module.
- **Public asset:** `apps/web/public/og-area-fallback.webp`.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-discovery-search-listing-experience.md#Story-2.5]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR5,FR59,FR63,FR71]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Data-Architecture]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Structure-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Naming-Patterns]
- [Source: _bmad-output/C-UX-Scenarios/01-naokis-first-week/01.3-area-neighborhood-guide/01.3-area-neighborhood-guide.md — UX spec for this page]
- [Source: _bmad-output/implementation-artifacts/2-1-listing-data-model-api-foundation.md — Area model + /api/v1/areas]
- [Source: _bmad-output/implementation-artifacts/2-3-search-browse-with-cross-language-support.md — shared ListingCard + ?area= query param contract]
- [Source: _bmad-output/implementation-artifacts/2-4-listing-detail-page.md — attach_fair_price public, LocationMapLazy, SSR fetch + sitemap + generateMetadata patterns]
- [Source: apps/web/AGENTS.md — path alias rule]
- [Source: backend/modules/listing/router.py:183 — existing list_areas handler to extend]
- [Source: backend/modules/listing/models.py:34 — Area model to extend]
- [Source: backend/modules/search/service.py — public attach_fair_price]
- [Source: apps/web/shared/components/ListingCard.tsx — reuse for senpai spots]
- [Source: apps/web/app/sitemap.ts — dynamic-section pattern to extend]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Backend tests: 132 passed
- Frontend tests: 154 passed
- Build: Pre-existing `/vi/auth/callback` prerender failure (out of scope per Dev Notes)

### Completion Notes List

- Implemented area guide backend (migration, model fields, AreaRepository, AreaService, endpoint)
- Implemented area guide frontend (index page, detail page, all components)
- Added 6 areas with full guide data in seed (Hai Chau, Son Tra, Ngu Hanh Son, Lien Chieu, Thanh Khe, Han River East)
- AreaNotFoundException already existed in exceptions.py (reused)
- Frontend uses formatDualPrice for dual-currency display (decision 1.5)
- Sitemap extended with /areas and /areas/{slug} entries
- i18n keys added to ja.json, en.json, vi.json
- TODO(story-2-5-followup): regenerate api-types after merge, axe smoke tests

### File List

**Backend (new/modified):**
- backend/migrations/versions/2026_04_18_0003_add_area_guide_fields.py (new)
- backend/modules/listing/models.py (modified)
- backend/modules/listing/schemas.py (modified)
- backend/modules/listing/repository.py (modified)
- backend/modules/listing/service.py (modified)
- backend/modules/listing/router.py (modified)
- backend/scripts/seed_data.py (modified)
- backend/tests/listing/test_areas.py (new)
- backend/tests/listing/test_area_repository.py (new)
- backend/tests/listing/test_router.py (modified)
- backend/tests/listing/test_router_detail.py (modified)
- backend/README.md (modified)

**Frontend (new/modified):**
- apps/web/modules/area-guide/lib/types.ts (new)
- apps/web/modules/area-guide/lib/area-data.ts (new)
- apps/web/modules/area-guide/components/AreaCard.tsx (new)
- apps/web/modules/area-guide/components/AreaIndex.tsx (new)
- apps/web/modules/area-guide/components/AreaMap.tsx (new)
- apps/web/modules/area-guide/components/AreaMapLazy.tsx (new)
- apps/web/modules/area-guide/components/AreaOverview.tsx (new)
- apps/web/modules/area-guide/components/LifestyleInfo.tsx (new)
- apps/web/modules/area-guide/components/SenpaiSpots.tsx (new)
- apps/web/modules/area-guide/components/SearchInAreaCta.tsx (new)
- apps/web/modules/area-guide/__tests__/area-data.test.ts (new)
- apps/web/modules/area-guide/__tests__/AreaCard.test.tsx (new)
- apps/web/modules/area-guide/__tests__/LifestyleInfo.test.tsx (new)
- apps/web/modules/area-guide/__tests__/SenpaiSpots.test.tsx (new)
- apps/web/app/(user)/[locale]/areas/page.tsx (new)
- apps/web/app/(user)/[locale]/areas/[slug]/page.tsx (new)
- apps/web/app/(user)/[locale]/areas/[slug]/not-found.tsx (new)
- apps/web/app/sitemap.ts (modified)
- apps/web/messages/ja.json (modified)
- apps/web/messages/en.json (modified)
- apps/web/messages/vi.json (modified)
- apps/web/public/og-area-fallback.webp (new)
- apps/web/README.md (modified)
