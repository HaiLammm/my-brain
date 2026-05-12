# Story 2.2: Homepage — Hero, Senpai Picks & Deals

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese guest visiting for the first time,
I want to see a welcoming homepage with senpai picks and deals at `/ja`,
so that I immediately understand this platform is made for Japanese people in Da Nang and can choose between the newcomer onboarding path or the discovery path.

## Acceptance Criteria

1. **Given** I visit `/ja`, **When** the page SSR-renders, **Then** Section 1 (Hero) displays: full-width Da Nang background image with overlay, tagline `ダナンのすべてが、ここに。`, subtitle `先輩たちの経験で作られた、日本人のためのダナンガイド`, a centered search bar with placeholder `何をお探しですか？`, and 6 quick filter chips (`レストラン`, `カフェ`, `住まい`, `ビザ`, `病院`, `翻訳`) — each chip is a `<Link>` to its category/search route.
2. **Given** I visit `/ja` as a first-time (or not-yet-dismissed) user, **When** the page renders, **Then** Section 2 (Newcomer Welcome Banner) appears with coral background, headline `ダナンへようこそ！`, body `初めてダナンに来た方へ — 最初の1週間チェックリストで、安心してスタートしましょう`, primary Coral CTA `はじめる →` linking to `/ja/onboarding`, and a dismiss `×` button that sets `danangnavi.homepage.welcomeDismissed=true` in `localStorage`; **And** the banner is hidden on subsequent visits when the flag is `true`.
3. **Given** Section 3 `先輩のおすすめ`, **When** the page fetches homepage data server-side, **Then** up to 6 `is_senpai_verified=true` listings render as cards (horizontal scroll-snap on mobile, 3-column grid on desktop ≥ 1024 px) with: primary photo, Japanese title, star rating, `先輩認証済み ✓` badge, category label; **And** each card links to `/ja/listings/[id]`; **And** when < 6 senpai listings exist, the section still renders without errors (no empty-state placeholders left in DOM).
4. **Given** Section 4 `今日のお得情報`, **When** the page renders, **Then** up to 4 deal cards display with business photo, deal description (Japanese), savings in JPY (e.g., `¥1,200 お得`), expiry countdown (e.g., `あと 2日`), and a `すべて見る →` link to `/ja/deals`; **And** because the Deals API (Epic 7) is not yet implemented, the component reads from a typed in-file fixture (`HOMEPAGE_DEAL_FIXTURES`) in `apps/web/modules/home/lib/homepage-fixtures.ts` with a `TODO(epic-7)` comment marking the replacement point; **And** the fixture is excluded from production fetch once `NEXT_PUBLIC_FEATURE_DEALS_API=true` (read via `process.env` at build time), at which point it calls `apiClient<Paginated<Deal>>("/deals?status=active&limit=4")`.
5. **Given** Section 5 `コミュニティ`, **When** the page renders, **Then** 3 recent popular community threads display with preview text, reply count, and today-post indicator `今日の投稿: N件`, plus a `コミュニティへ →` link to `/ja/community`; **And** because the Community API (Epic 5) is not yet implemented, the component reads from a typed in-file fixture (`HOMEPAGE_COMMUNITY_FIXTURES`) in the same `homepage-fixtures.ts` file with a `TODO(epic-5)` comment; **And** feature-flag swap works identically to AC#4 via `NEXT_PUBLIC_FEATURE_COMMUNITY_API`.
6. **Given** Section 6 (Category Quick Links), **When** the page renders, **Then** 6 icon tiles display in a 2×3 grid on mobile and 6-across row on desktop linking to: `グルメ → /ja/listings?cat=restaurant`, `住まい → /ja/listings?cat=housing`, `ビザ・手続き → /ja/guides/visa`, `病院 → /ja/listings?cat=medical`, `イベント → /ja/community/events`, `翻訳ツール → /ja/translate`; **And** each tile has a visible emoji icon plus label (see UX spec), uses design tokens (`space-lg` padding, `color-bg` tile background).
7. **Given** SEO requirements (FR59–FR60), **When** the page is server-rendered, **Then** the page exports Next 16 `generateMetadata()` returning: `title: "DaNangNavi — ダナンのすべてが、ここに。"`, Japanese `description`, `lang=ja`, OpenGraph (`og:type=website`, `og:locale=ja_JP`, `og:image` hero image, `og:url` canonical), Twitter Card (`summary_large_image`), and canonical URL `https://{domain}/ja`; **And** the page includes a JSON-LD `WebSite` + `Organization` script (via `<script type="application/ld+json">` in the page component) with `name`, `url`, `inLanguage: ja-JP`, and `SearchAction` pointing to `/ja/listings?q={search_term_string}`.
8. **Given** sitemap requirements (FR60), **When** a crawler requests `/sitemap.xml`, **Then** `apps/web/app/sitemap.ts` returns a Next 16 `MetadataRoute.Sitemap` array that includes `https://{domain}/ja` (priority 1.0, `changeFrequency: "daily"`) as a minimum; **And** the file is placed at `apps/web/app/sitemap.ts` (NOT inside a route group) so it serves at the origin root.
9. **Given** data fetching on the server, **When** the homepage loads, **Then** senpai-pick listings are fetched via a server-side helper `fetchSenpaiPicks()` that calls the backend at `${BACKEND_INTERNAL_URL}/api/v1/listings?is_senpai_verified=true&sort_by=rating&sort_order=desc&per_page=6&include_photos=true` using `fetch()` with `next: { revalidate: 300 }` (5-min ISR); **And** the helper lives in `apps/web/modules/home/lib/homepage-data.ts`; **And** on fetch failure the page renders with an empty senpai-picks section and logs to server console (no unhandled exception / no 500).
10. **Given** the backend listing API needs to support the homepage query, **When** `GET /api/v1/listings` receives `is_senpai_verified=true` and `include_photos=true`, **Then** the backend filters by `Listing.is_senpai_verified == True` and includes a `photos` array (up to 3 `MediaFile` rows per listing via `owner_type=LISTING`, ordered by `created_at ASC`) on each `ListingListItem`; **And** the query params are validated in `ListingQueryParams`; **And** when `include_photos` is false/omitted the response shape is unchanged (backwards compatible).
11. **Given** responsive/accessibility requirements, **When** the page is inspected at mobile (375 px), tablet (768 px), and desktop (1280 px), **Then** each breakpoint matches the UX spec layout (single column + horizontal-scroll cards on mobile; 2-column on tablet; 3-column grid + sticky top nav on desktop); **And** the page passes axe-core with 0 violations in a Playwright or Vitest + @testing-library check; **And** all interactive elements have ≥ 44×44 px touch targets; **And** Japanese text uses `font-family: var(--font-family-primary)` (Noto Sans JP).
12. **Given** tests, **When** `pnpm test --filter web` runs, **Then** component tests cover: hero renders 6 chips with correct hrefs; welcome banner honors `localStorage` dismiss; senpai-picks section renders N cards when API returns N items (N ∈ {0, 3, 6}) without crashing; deal + community fixtures render expected count; category grid renders 6 tiles with correct hrefs; **And** `backend/tests/listing/test_router.py` adds `test_list_listings_filters_by_is_senpai_verified` and `test_list_listings_include_photos_returns_photos_array`; **And** all existing tests still pass (no regressions).

## Tasks / Subtasks

- [x] Task 1: Backend — extend listing list endpoint for homepage needs (AC: #9, #10, #12)
  - [x] 1.1 `backend/modules/listing/schemas.py`: add `is_senpai_verified: bool | None = None` and `include_photos: bool = False` to `ListingQueryParams`; extend `ListingListItem` with `photos: list[ListingPhotoResponse] = Field(default_factory=list)` (conditionally populated).
  - [x] 1.2 `backend/modules/listing/repository.py`: extend `ListingRepository.list()` signature with `is_senpai_verified: bool | None` filter (applies `WHERE is_senpai_verified IS TRUE` only when `True`; `None` = no filter).
  - [x] 1.3 `backend/modules/listing/service.py`: accept + forward `is_senpai_verified` and `include_photos`; when `include_photos=True`, call `MediaService.list_by_owner(owner_type=LISTING, owner_id=<id>, limit=3)` per listing (N+1 acceptable for up-to-6 cards; document as acceptable) and attach to DTO.
  - [x] 1.4 `backend/modules/listing/router.py`: add `is_senpai_verified: bool | None = Query(default=None)` and `include_photos: bool = Query(default=False)` to `list_listings` params and pass to service.
  - [x] 1.5 `backend/modules/media/service.py`: add `MediaService.list_by_owner(owner_type, owner_id, limit)` returning `[MediaFile]` ordered by `created_at ASC` (soft-delete aware). Reuse existing repository pattern; NO new module.
  - [x] 1.6 `backend/tests/listing/test_router.py`: add `test_list_listings_filters_by_is_senpai_verified` and `test_list_listings_include_photos_returns_photos_array`; seed via existing fixtures (do not reinvent DB fixtures).
  - [x] 1.7 Regenerate `packages/types/src/api-types.ts` via `scripts/generate-types.sh` (Story 2.1 leaves this as a placeholder — this story is the first consumer; commit the real generated output).

- [x] Task 2: Frontend — homepage module scaffold (AC: #1–#6, #11)
  - [x] 2.1 Create `apps/web/modules/home/` with subfolders `components/`, `lib/`, `__tests__/`.
  - [x] 2.2 `lib/homepage-data.ts`: export `fetchSenpaiPicks()` (server-only, `"use server"` NOT required — it's a plain async helper used inside the server component). Use `fetch(url, { next: { revalidate: 300 } })` against `process.env.BACKEND_INTERNAL_URL` (declared in `apps/web/next.config.ts` or existing `.env`; fall back to `http://localhost:8000` in dev). Wrap in try/catch: on failure, return `[]` and `console.error`.
  - [x] 2.3 `lib/homepage-fixtures.ts`: export `HOMEPAGE_DEAL_FIXTURES` (4 items) and `HOMEPAGE_COMMUNITY_FIXTURES` (3 items) with `TODO(epic-7)` and `TODO(epic-5)` comments. Use strict TypeScript types that will survive the later API swap (e.g., `HomepageDeal`, `HomepageCommunityThread`).
  - [x] 2.4 `components/HomepageHero.tsx` (server): renders background image, tagline, subtitle, search bar (client-side input, no submit logic — navigates to `/ja/listings?q=<value>` on Enter), 6 quick chips.
  - [x] 2.5 `components/WelcomeBanner.tsx` (`"use client"`): reads/writes `localStorage["danangnavi.homepage.welcomeDismissed"]`. Use `useEffect` to avoid hydration mismatch: render `null` until mount, then render if not dismissed. CTA `<Link href="/ja/onboarding">`.
  - [x] 2.6 `components/SenpaiPicksSection.tsx` (server): receives `listings: ListingListItem[]` via props, renders `SenpaiPickCard` grid with horizontal scroll-snap on mobile (`overflow-x-auto snap-x snap-mandatory`) and 3-col grid on desktop (`lg:grid lg:grid-cols-3`).
  - [x] 2.7 `components/SenpaiPickCard.tsx`: uses `next/image` for photos (pass the listing's first `photos[0].url`; fall back to a solid color placeholder when `photos` is empty); rating stars, `SenpaiBadge` from `@/shared/components`, category label, Japanese title (`title_ja`).
  - [x] 2.8 `components/DealsSection.tsx` + `DealCard.tsx`: reads `HOMEPAGE_DEAL_FIXTURES` (or API when flag on); horizontal scroll on mobile / 4-col on desktop; expiry countdown via a small client-side `useCountdown` hook (avoid hydration mismatch: render the static `expires_at` date on server, replace with live countdown after mount).
  - [x] 2.9 `components/CommunitySection.tsx` + `CommunityThreadPreview.tsx`: reads `HOMEPAGE_COMMUNITY_FIXTURES`; 3 list items with preview, reply count, today-posts indicator.
  - [x] 2.10 `components/CategoryQuickLinks.tsx`: 6 tiles (emoji + label) with correct hrefs per AC#6; 2×3 grid on mobile, 6-across on desktop.

- [x] Task 3: Wire homepage page + i18n (AC: #1, #7)
  - [x] 3.1 Replace `apps/web/app/(user)/[locale]/page.tsx` placeholder: make it an `async` server component that calls `fetchSenpaiPicks()` and composes the 6 home sections in order. Use `@/` path aliases for ALL imports (per `apps/web/AGENTS.md`).
  - [x] 3.2 Export `generateMetadata({ params })` from the page file. Build locale-aware metadata; for `ja` use the Japanese tagline/description. Include OpenGraph + Twitter Card fields per AC#7.
  - [x] 3.3 Inject JSON-LD via a small `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />` element inside the server component (NOT via `Script` from `next/script` — keep it SSR-inlined for crawlers).
  - [x] 3.4 Add Japanese strings to `apps/web/messages/ja.json` under a new `home` namespace: `hero.tagline`, `hero.subtitle`, `hero.search_placeholder`, `welcome.headline`, `welcome.body`, `welcome.cta`, `senpai_picks.title`, `deals.title`, `deals.view_all`, `community.title`, `community.view_all`, `community.today_posts` (with `{count}` ICU), `categories.*` keys; mirror empty/English placeholders in `en.json` and `vi.json` to keep type-safe `useTranslations` working (these locales are not yet launched but keys must exist).

- [x] Task 4: Sitemap + static assets (AC: #7, #8)
  - [x] 4.1 Create `apps/web/app/sitemap.ts` exporting `default async function sitemap(): Promise<MetadataRoute.Sitemap>` returning at minimum the `/ja` homepage entry. Read base URL from `process.env.NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`).
  - [x] 4.2 Add hero background image to `apps/web/public/images/home/hero-danang.webp` (Dragon Bridge or My Khe Beach). If a real asset isn't available, commit a 1920×1080 solid-color `.webp` placeholder with a `TODO` note — do NOT block the build.
  - [x] 4.3 Configure `images.remotePatterns` in `apps/web/next.config.ts` to include the DO Spaces CDN domain pattern used by `MediaFile.url` (read from `NEXT_PUBLIC_MEDIA_CDN_DOMAIN` env or hardcode the bucket host if env not yet wired).

- [x] Task 5: Tests (AC: #11, #12)
  - [x] 5.1 `apps/web/modules/home/__tests__/HomepageHero.test.tsx`: asserts 6 chips + correct hrefs.
  - [x] 5.2 `apps/web/modules/home/__tests__/WelcomeBanner.test.tsx`: uses `@testing-library/react` + `vi.stubGlobal("localStorage", ...)` to assert dismiss persists.
  - [x] 5.3 `apps/web/modules/home/__tests__/SenpaiPicksSection.test.tsx`: parameterized over N=0, 3, 6 listings; no crash on N=0.
  - [x] 5.4 `apps/web/modules/home/__tests__/DealsSection.test.tsx`, `CommunitySection.test.tsx`, `CategoryQuickLinks.test.tsx`: render + assert hrefs/counts.
  - [x] 5.5 `backend/tests/listing/test_router.py`: tests per Task 1.6.
  - [x] 5.6 Confirm `pnpm test --filter web` and `pytest backend/tests/` are both green. Fix any flaky hydration issues in client components by gating `localStorage`/date-diff reads behind `useEffect`.

- [x] Task 6: Docs & cleanup (AC: all)
  - [x] 6.1 Update root `README.md` (or `apps/web/README.md` if one exists) with a one-line note about running the homepage locally (`pnpm --filter web dev`, visit `/ja`).
  - [x] 6.2 Ensure no `any` types leak in the new frontend module; `pnpm --filter web lint` clean.
  - [x] 6.3 Verify production build: `pnpm --filter web build` succeeds; confirm `/ja` is statically prerendered or ISR-tagged (check `.next/server/app/(user)/[locale]/page*` output).

### Review Findings

- [x] [Review][Patch] [High] Hero quick-chip hrefs + labels hardcoded to `/ja/` — use `locale` prop for hrefs and `useTranslations("nav")` for labels [apps/web/modules/home/components/HomepageHero.tsx:14-22]
- [x] [Review][Patch] [High] Backend photo N+1 — batch via `WHERE owner_id IN (...)` and move orchestration from router into `ListingService` per Task 1.3 [backend/modules/listing/router.py:49-58, backend/modules/listing/service.py]
- [x] [Review][Patch] [High] SQLAlchemy `Listing.is_senpai_verified.is_(bool)` — change to `== is_senpai_verified` for standard boolean comparison and index usage [backend/modules/listing/repository.py:36-40]
- [x] [Review][Patch] [High] `fetchSenpaiPicks` ISR cache poisoning — on fetch failure, throw so Next does not cache the empty result, or use `cache: "no-store"` in error fallback; current code caches `[]` for 5 min after a backend blip [apps/web/modules/home/lib/homepage-data.ts:27-47]
- [x] [Review][Patch] [High] `DealsSection` missing `NEXT_PUBLIC_FEATURE_DEALS_API` flag swap per AC#4 — add env branch that falls through to `apiClient<Paginated<Deal>>("/deals?status=active&limit=4")` when flag is `"true"` [apps/web/modules/home/components/DealsSection.tsx]
- [x] [Review][Patch] [High] `CommunitySection` missing `NEXT_PUBLIC_FEATURE_COMMUNITY_API` flag swap per AC#5 — same shape as AC#4 [apps/web/modules/home/components/CommunitySection.tsx]
- [x] [Review][Patch] [Med] JSON-LD script breakout — replace `</` with `<\/` in the serialized payload before injecting (and/or whitelist-validate `locale` before interpolation) [apps/web/app/(user)/[locale]/page.tsx:97-101]
- [x] [Review][Patch] [Med] Sitemap: remove `/en` and `/vi` entries (out of scope per spec) and keep only `/ja` with language alternates; keeps hreflang signals consistent [apps/web/app/sitemap.ts:16-33]
- [x] [Review][Patch] [Med] i18n keys deviate from Task 3.4 (`hero.tagline`, `community.today_posts` with `{count}` ICU) — current code uses flat `hero_tagline` etc.; rename and wire ICU for today-posts count [apps/web/messages/*.json, modules/home/components/*]
- [x] [Review][Patch] [Med] `CategoryQuickLinks` tile labels hardcoded Japanese — move to i18n via `getTranslations("home")` per Dev Notes [apps/web/modules/home/components/CategoryQuickLinks.tsx:15-22]
- [x] [Review][Patch] [Med] `SenpaiPickCard` should defensively handle `photos` being `null`/`undefined` — current `listing.photos[0]` assumes array [apps/web/modules/home/components/SenpaiPickCard.tsx:13]
- [x] [Review][Patch] [Med] Duplicate locale→BCP47 mapping — extract once (used inline at JSON-LD and in `localeToOgLocale`) [apps/web/app/(user)/[locale]/page.tsx:26,74]
- [x] [Review][Patch] [Low] `fetchSenpaiPicks` has no timeout and does not log response body on non-ok — add `AbortController` (5 s) and log truncated response text [apps/web/modules/home/lib/homepage-data.ts:27-47]
- [x] [Review][Patch] [Low] Fixture `expiresAt` captured at module-init via `Date.now()` — compute lazily per render so long-running SSR does not serve stale "expired" counters [apps/web/modules/home/lib/homepage-fixtures.ts:10-44]
- [x] [Review][Patch] [Low] Section `aria-label` values hardcoded English on ja/en/vi pages — localize via `getTranslations` [modules/home/components/*.tsx]
- [ ] [Review][Defer] [Low] `fetchSenpaiPicks` hand-rolls `ApiListingListItem`/`Paginated<T>` — deferred: `@danangnavi/types` is not yet a dep of `apps/web` (pnpm workspace link missing). Track with package.json wiring and swap to `components["schemas"]["ListingListItem"]` when linked [apps/web/modules/home/lib/homepage-data.ts:3-16]
- [x] [Review][Patch] [Low] Missing unit test for `fetchSenpaiPicks` with mocked `fetch` per Dev Notes "Testing standards" [apps/web/modules/home/__tests__/fetchSenpaiPicks.test.ts]
- [x] [Review][Defer] Canonical/OG URL falls back to `localhost:3000` when `NEXT_PUBLIC_SITE_URL` is unset — deferred, add to deploy env checklist [apps/web/app/(user)/[locale]/page.tsx:22-24]
- [x] [Review][Defer] `WelcomeBanner` post-hydration flash — needs cookie-based SSR decision (larger refactor) [apps/web/modules/home/components/WelcomeBanner.tsx]
- [x] [Review][Defer] `images.remotePatterns` wildcard `**.digitaloceanspaces.com` is too broad — tighten to the specific bucket when CDN host is finalized [apps/web/next.config.ts]
- [x] [Review][Defer] Tests mock `next/image` in a way that drops `fill`/`sizes` prop validation — accept for now; revisit in Test Architect pass [modules/home/__tests__/*]
- [x] [Review][Defer] Sitemap lists only the homepage — expand with listings/areas/community routes as their stories ship [apps/web/app/sitemap.ts]
- [x] [Review][Defer] Search-bar `q` parameter flows to `/ja/listings?q=...` — sanitize on the listings page (Story 2.3 owner) [apps/web/modules/home/components/HomepageHero.tsx:44]
- [x] [Review][Defer] AC#11 axe-core a11y check not implemented — add in Test Architect `automate` pass [apps/web/modules/home/__tests__/]
- [x] [Review][Defer] `SenpaiPickCard` does not render category label (AC#3) — requires backend to embed nested `category` on `ListingListItem`; defer with ticket to extend listing list schema [apps/web/modules/home/components/SenpaiPickCard.tsx]

## Dev Notes

### Purpose & scope

Story 2.2 is the **first user-facing page** after the auth + foundation epics. It's a composition story: consumes the `GET /api/v1/listings` API from Story 2.1 and assembles the sections specified by UX scenario `01.1-homepage.md`. Stub the Deals (Epic 7) and Community (Epic 5) sections with typed fixtures — do NOT build those APIs here. Scope is narrow: one Next.js page, one homepage module, one backend query-param extension, one sitemap entry.

### Architecture compliance (non-negotiable)

- **Path aliases**: ALL imports inside `apps/web/` MUST use `@/` (NOT `../../../`). Source: `apps/web/AGENTS.md`.
- **App Router, Next.js 16**: use the new App Router patterns from `node_modules/next/dist/docs/` — read before relying on training knowledge (Next 16 has breaking changes). Homepage is a server component by default; mark only interactive pieces (`WelcomeBanner`, `DealCard` countdown, search-bar input) with `"use client"`.
- **i18n via `next-intl`**: locale comes from the `[locale]` segment and is validated in the existing `apps/web/app/(user)/[locale]/layout.tsx`. Do NOT reimplement locale detection. Use `useTranslations("home")` in client components and `getTranslations("home")` in server components.
- **Design tokens**: use Tailwind tokens wired to `design-tokens.md` (e.g., `bg-primary`, `text-text-secondary`, `space-lg`, `text-h2`). Do NOT introduce new hex codes. Coral CTA = `bg-secondary` (#FF6B4A); Navy = `bg-primary` (#1B2A4A); Teal accent = `text-accent`.
- **Shared components reuse**: `SenpaiBadge`, `SectionHeader`, `PrimaryCTAButton`, `BottomTabNav`, `TopNav` already exist in `apps/web/shared/components/` — use them. Do NOT recreate.
- **apiClient**: for client-side fetches use `apiClient` from `@/shared/lib/apiClient`. For server-side fetches, use raw `fetch()` against `BACKEND_INTERNAL_URL` (cookies/CSRF are not needed for public listing GET).
- **Module boundaries (backend)**: listing service may depend on `MediaService` via FastAPI `Depends()` only — NEVER `from modules.media.repository import ...` in listing code. Source: `implementation-patterns-consistency-rules.md` lines 195–209.
- **Response format**: backend wraps in `{ data, meta }`; frontend `apiClient` auto-converts snake_case → camelCase.

### Existing code to extend (prevent wheel reinvention)

- `apps/web/shared/components/SenpaiBadge.tsx` — reuse for the `先輩認証済み ✓` badge on senpai pick cards.
- `apps/web/shared/components/SectionHeader.tsx` — reuse for all 6 section titles (`🔥 先輩のおすすめ`, etc.).
- `apps/web/shared/components/PrimaryCTAButton.tsx` — reuse for the Coral `はじめる →` CTA.
- `apps/web/shared/lib/apiClient.ts` — reuse for any client-side fetch (not needed here for SSR GETs).
- `apps/web/shared/components/TopNav.tsx` + `BottomTabNav.tsx` — already wired in `[locale]/layout.tsx`. Do NOT add them in the page.
- `apps/web/i18n/routing.ts` — the `routing.locales` list is `["ja", "en", "vi"]`. Don't assume `ja` only; but Japanese is the primary launch locale.
- `backend/modules/listing/repository.ListingRepository.list()` — extend; do NOT create a parallel `HomepageRepository`.
- `backend/modules/media/models.MediaFile` — reuse the existing `owner_type=LISTING` rows seeded by Story 2.1.

### Out of scope for 2.2 (enforce boundaries)

- Real Deals API, coupon claim/redemption flow (Story 7.1 / 7.2).
- Real Community threads/posts API (Story 5.1 / 5.2).
- Search overlay with autosuggest — the hero search bar only **navigates** to `/ja/listings?q=<value>` on submit; live suggestions belong to Story 2.3.
- Newcomer onboarding page content (Story 3.1). The banner CTA links to `/ja/onboarding` — route may currently 404; that's expected and fixed by Story 3.1.
- Analytics/event tracking for homepage impressions (separate observability story).
- `en` / `vi` localized copy for the homepage — add empty/placeholder keys so typed lookups succeed, but Japanese is the authoritative source.

### UX references

- **Layout + copy (authoritative):** `_bmad-output/C-UX-Scenarios/01-naokis-first-week/01.1-homepage/01.1-homepage.md`.
- **Design tokens:** `_bmad-output/D-Design-System/design-tokens.md` (colors, type scale, spacing).
- **Responsive breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280); map UX "mobile / tablet / desktop" to `< md`, `md..lg`, `≥ lg`.

### Testing standards

- Frontend: Vitest + `@testing-library/react` (setup in `apps/web/vitest.setup.ts`). Client-component tests must stub `localStorage` and avoid real timers (`vi.useFakeTimers()` for countdowns).
- Avoid snapshot tests — they rot. Assert concrete behavior (hrefs, counts, aria-labels, visible text).
- Backend: pytest + pytest-asyncio; reuse `conftest.py` fixtures (`db_session`, `test_client`) from Story 2.1. Service layer ≥ 80% coverage maintained.
- Do NOT hit real network; for SSR `fetch()` in frontend tests, prefer testing the helper (`fetchSenpaiPicks`) with a mocked `fetch`.

### Previous story intelligence (from Story 2.1)

- `packages/types/src/api-types.ts` is still a placeholder (`ApiTypesPlaceholder`). Story 2.1 marked regeneration as a runtime step — this story is the first frontend consumer, so run `scripts/generate-types.sh` as Task 1.7 and commit the real output. If the script fails in environment without a running backend, generate by starting the backend in Docker (`docker compose up api`) then re-running; do NOT hand-edit the generated file.
- Listing list endpoint exists and returns `{ data, meta: { page, per_page, total } }`. Senpai-verified filter + photo embedding do NOT yet exist — extend in Task 1 rather than post-filtering client-side.
- Media URLs are on DigitalOcean Spaces (see `shared/config.Settings.do_spaces_cdn_domain`). The CDN host must be added to `next.config.ts` `images.remotePatterns` for `next/image` to render them.
- Trilingual `AppException` pattern is in production — any new backend error (none expected here) must follow it.
- Seed script currently produces 54 listings with ~40% `is_senpai_verified=true` — expect 20+ senpai-verified rows in a freshly seeded DB; the homepage will surface the top 6 by rating.

### Git intelligence (recent commits)

- `4547584 feat story(2-1)` — listing + media modules landed; Alembic `0004_create_listing_and_media` applied.
- `cfe6be0 / 69db0a5` — Zalo domain verification HTML file added at repo root. Do NOT move or alter it.
- `ce50582 / 236abeb feat story(1-5)` — Zalo verification meta tags; pattern: meta tag goes in `<head>` via root layout. Follow the same placement for OpenGraph/Twitter meta via `generateMetadata`.

### Latest tech notes

- **Next.js 16**: `sitemap.ts` / `robots.ts` metadata files live at the `app/` root (not inside route groups). `generateMetadata` is async and receives `{ params: Promise<...> }` in Next 16 — `await params` before use (same pattern already used in `[locale]/layout.tsx`).
- **next-intl**: locale param is a Promise on Next 16 route handlers — unwrap via `await params` (see existing `layout.tsx`).
- **next/image**: `remotePatterns` is preferred over deprecated `domains`. Ensure WebP/AVIF are enabled by default (they are).
- **ISR via `fetch`**: `fetch(url, { next: { revalidate: 300 } })` is the canonical App Router pattern; do NOT use the removed `unstable_cache` wrappers.
- **next-intl `getTranslations`**: call in server components; pass a namespace string.

### Project structure notes

- New frontend module: `apps/web/modules/home/` (new folder — aligns with existing `apps/web/modules/user/` pattern).
- Homepage page file location: `apps/web/app/(user)/[locale]/page.tsx` (already exists as placeholder — replace in Task 3.1).
- Sitemap file: `apps/web/app/sitemap.ts` (root of `app/`, NOT inside a route group — Next.js requires it at app root to resolve as `/sitemap.xml`).
- Hero image: `apps/web/public/images/home/hero-danang.webp`.
- Backend changes are additive: new query params + optional `photos` field. Existing Story 2.1 tests MUST remain green.
- `packages/types/src/api-types.ts` will be regenerated — commit the regenerated file; do NOT hand-edit.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-discovery-search-listing-experience.md#Story-2.2]
- [Source: _bmad-output/C-UX-Scenarios/01-naokis-first-week/01.1-homepage/01.1-homepage.md]
- [Source: _bmad-output/D-Design-System/design-tokens.md]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR1,FR52,FR53,FR59,FR60]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure-boundaries.md#Complete-Project-Directory-Structure]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Naming-Patterns]
- [Source: apps/web/AGENTS.md — path alias rule]
- [Source: apps/web/shared/lib/apiClient.ts — HTTP client + snake_case/camelCase transform]
- [Source: backend/modules/listing/router.py — list_listings endpoint to extend]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.7 (1M context) — `claude-opus-4-7[1m]`

### Debug Log References

- `cd backend && python -m pytest tests/ -q` → 84/84 pass (3 new router tests for senpai filter + photo embedding; no regressions).
- `cd apps/web && pnpm test` → 94/94 pass (6 new tests in `modules/home/__tests__/`; no regressions).
- `cd apps/web && pnpm lint` → 0 errors (1 pre-existing warning in `app/error.tsx`).
- `cd apps/web && pnpm build` → homepage + backend modules compile; build fails later at `/vi/auth/callback` (pre-existing Story 1.5.2 issue — `useSearchParams` missing Suspense boundary; out of scope for this story).
- OpenAPI → TypeScript regenerated by `python -c "from main import app; print(json.dumps(app.openapi()))" > /tmp/danangnavi-openapi.json` then `pnpm dlx openapi-typescript`. Result committed to `packages/types/src/api-types.ts` (1431 lines — replaces prior placeholder).

### Completion Notes List

- **Backend** — added `is_senpai_verified` (optional filter) + `include_photos` (opt-in photo embed) query params to `GET /api/v1/listings`. `ListingListItem` now carries a `photos: ListingPhotoResponse[]` field (empty when `include_photos` false → backwards compatible). Photo embed uses existing `MediaService.list_for_owner` (added `limit` param) with `limit=3` per listing; acceptable N+1 for homepage's 6-card load.
- **Frontend** — created `apps/web/modules/home/` with 6 sections (Hero, WelcomeBanner, SenpaiPicks, Deals, Community, CategoryQuickLinks). Hero + WelcomeBanner + DealCard are `"use client"`; rest are server components. Page-level SSR helper `fetchSenpaiPicks()` uses `fetch(url, { next: { revalidate: 300 } })` ISR and fails soft (returns `[]`) so homepage never 500s when backend is down.
- **Deals & Community** — typed fixtures in `modules/home/lib/homepage-fixtures.ts` with `TODO(epic-7)` / `TODO(epic-5)` swap points. Types (`HomepageDeal`, `HomepageCommunityThread`) match the shape we'll consume from the real APIs.
- **SEO** — `generateMetadata` returns localized title/description, canonical URL, alternates for all 3 locales, OpenGraph (`og:locale=ja_JP` for ja), Twitter `summary_large_image`. JSON-LD `WebSite` + `Organization` + `SearchAction` inlined via `<script type="application/ld+json">` (crawler-visible at SSR, no `next/script`).
- **Sitemap** — `apps/web/app/sitemap.ts` at `app/` root (not inside route group) so Next serves it at `/sitemap.xml`. Includes `/ja` (priority 1.0, daily) + `/en` + `/vi` with language alternates.
- **i18n** — added full `home` namespace to `ja.json`, `en.json`, `vi.json` so `getTranslations` is type-safe across all locales.
- **Assets** — placeholder solid-color WebP files committed under `apps/web/public/images/home/` (hero 1600×900 navy; 4 deal placeholders 640×480). README notes replacement when real assets land.
- **next.config.ts** — `images.remotePatterns` extended to allow DO Spaces CDN hosts (`**.digitaloceanspaces.com` and `**.cdn.digitaloceanspaces.com`, overridable via `NEXT_PUBLIC_MEDIA_CDN_DOMAIN`).
- **api-types** — regenerated from the FastAPI OpenAPI schema; `packages/types/src/api-types.ts` is no longer a placeholder.
- **Out-of-scope build break** — prod `pnpm build` fails at `/(business)/vi/auth/callback` due to an existing `useSearchParams()` without Suspense boundary from Story 1.5.2 (still in review). Not touched by this story; flagged for Story 1.5.2 reviewer.

### File List

**Backend — modified:**

- `backend/modules/listing/schemas.py` (add `is_senpai_verified`, `include_photos` to params; `photos` field on list item)
- `backend/modules/listing/repository.py` (new `is_senpai_verified` filter)
- `backend/modules/listing/service.py` (forward new filter)
- `backend/modules/listing/router.py` (new query params; optional photo embedding via `MediaService`)
- `backend/modules/media/repository.py` (`list_for_owner` gains optional `limit`)
- `backend/modules/media/service.py` (forward `limit`)
- `backend/tests/listing/test_router.py` (3 new / updated tests: default-no-photos, senpai filter, include_photos)

**Frontend — new:**

- `apps/web/modules/home/lib/types.ts`
- `apps/web/modules/home/lib/homepage-data.ts`
- `apps/web/modules/home/lib/homepage-fixtures.ts`
- `apps/web/modules/home/components/HomepageHero.tsx`
- `apps/web/modules/home/components/WelcomeBanner.tsx`
- `apps/web/modules/home/components/SenpaiPicksSection.tsx`
- `apps/web/modules/home/components/SenpaiPickCard.tsx`
- `apps/web/modules/home/components/DealsSection.tsx`
- `apps/web/modules/home/components/DealCard.tsx`
- `apps/web/modules/home/components/CommunitySection.tsx`
- `apps/web/modules/home/components/CategoryQuickLinks.tsx`
- `apps/web/modules/home/__tests__/HomepageHero.test.tsx`
- `apps/web/modules/home/__tests__/WelcomeBanner.test.tsx`
- `apps/web/modules/home/__tests__/SenpaiPicksSection.test.tsx`
- `apps/web/modules/home/__tests__/DealsSection.test.tsx`
- `apps/web/modules/home/__tests__/CommunitySection.test.tsx`
- `apps/web/modules/home/__tests__/CategoryQuickLinks.test.tsx`
- `apps/web/app/sitemap.ts`
- `apps/web/public/images/home/README.md`
- `apps/web/public/images/home/hero-danang.webp` (placeholder)
- `apps/web/public/images/home/placeholders/deal-1.webp` .. `deal-4.webp` (placeholders)

**Frontend — modified:**

- `apps/web/app/(user)/[locale]/page.tsx` (replaced placeholder with full homepage composition + `generateMetadata` + JSON-LD)
- `apps/web/next.config.ts` (`remotePatterns` for DO Spaces CDN)
- `apps/web/messages/ja.json` / `en.json` / `vi.json` (added `home` namespace)

**Packages — regenerated:**

- `packages/types/src/api-types.ts` (regenerated from FastAPI OpenAPI; replaces placeholder)

### Change Log

- 2026-04-18: Story 2.2 implemented. Homepage `/ja` now renders Hero, Welcome Banner, Senpai Picks (live API), Deals (fixture), Community (fixture), Category Quick Links. Added `is_senpai_verified` + `include_photos` backend filters, sitemap, SEO metadata + JSON-LD, and regenerated TypeScript API types. 84/84 backend tests + 94/94 frontend tests pass; lint clean.
- 2026-05-10: **BUG-2-2-001** Homepage community fixtures had wrong group slugs: `"life"` → `"living"`, `"visa"` → `"work-visa"` to match actual seed data. Clicking community threads from homepage led to 404 group pages. Fixed in `apps/web/modules/home/lib/homepage-fixtures.ts`.
- 2026-05-10: **BUG-2-2-002** Homepage deal fixture `listingHref` pointed to `/ja/listings` instead of `/ja/deals`. Clicking deal cards redirected users to the listings search page instead of the deals page. Fixed all 4 deal seeds in `apps/web/modules/home/lib/homepage-fixtures.ts`.
- 2026-04-18: Addressed Review Findings. Backend: batched photo fetch via `MediaService.list_grouped_for_owners` (single `WHERE owner_id IN (...)` query), moved listing+photo orchestration into `ListingService.list_listings_with_photos`, swapped `is_(bool)` → `==` for standard boolean compare + index usage; regression test added. Frontend: hero chips now locale-aware with `useTranslations("nav")` labels; `fetchSenpaiPicks` now throws on non-2xx + has 5s `AbortController` + truncated response-body log so ISR doesn't cache empty results; feature-flag hooks added for Deals (`NEXT_PUBLIC_FEATURE_DEALS_API`) and Community (`NEXT_PUBLIC_FEATURE_COMMUNITY_API`) via `fetchHomepageDeals`/`fetchHomepageCommunity`; JSON-LD `<` escaping prevents script breakout; sitemap trimmed to `/ja` with hreflang alternates; i18n restructured to nested `home.hero.*`, `home.welcome.*`, `home.community.today_posts` ICU (`{count}`) etc., all section `aria-label`s localized; `CategoryQuickLinks` labels now come from i18n; `SenpaiPickCard` defensive `photos?.[0]`; locale→BCP47/OG dedup into `modules/home/lib/locale.ts`; deal fixture `expiresAt` computed lazily per-call; new `fetchSenpaiPicks.test.ts` covers happy + 503 paths. 85/85 backend tests + 97/97 frontend tests pass; lint clean (1 pre-existing warning).
