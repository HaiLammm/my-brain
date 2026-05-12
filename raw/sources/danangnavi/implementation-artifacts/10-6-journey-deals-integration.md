# Story 10.6: Journey Deals Integration

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese user on a journey,
I want to see which listings along my route have active deals or coupons and optionally filter to "deals only",
so that I can save money by choosing stops with offers.

## Acceptance Criteria

**1. Backend: Active deal joined on route listings (AC: backend-join)**

**Given** Epic 7 (Deals & Coupons) is live and `POST /api/v1/journeys/route` returns listings,
**When** the service builds each listing summary,
**Then**:
- Each `RouteListingSummary` gets a new field `active_deal: ActiveDealSummary | None`.
- `ActiveDealSummary` fields: `deal_id: UUID`, `title_ja: str`, `discount_type: "percentage" | "fixed_vnd"`, `discount_value: Decimal`, `price_vnd: int | None`, `expires_at: datetime`.
- Only coupons satisfying ALL the following are joined: `is_active = true`, `deleted_at IS NULL`, `valid_from <= now()`, `valid_until > now()`.
- If a listing has multiple active coupons, return the one with the **earliest** `valid_until` (about to expire first — matches Epic 7 ordering).
- If no active coupon exists, `active_deal` is `null`.
- Response shape is otherwise unchanged (`route`, `listings`, `total_count`, `recommended_route_index` remain intact).

**2. Backend: N+1 avoidance via batch fetch (AC: n-plus-one)**

**Given** the service has produced the list of `rows` (listings) along the route,
**When** it enriches each with `active_deal`,
**Then**:
- Exactly **one** SQL query fetches active coupons for all listing IDs in the result page (no per-listing query).
- New repository method `JourneyRepository.list_active_deals_for_listings(listing_ids: list[UUID], now: datetime) -> dict[UUID, ActiveDealRow]`.
- Implementation: `SELECT DISTINCT ON (listing_id) id, listing_id, title_ja, discount_type, discount_value, valid_until FROM coupons WHERE listing_id = ANY(:ids) AND is_active AND deleted_at IS NULL AND valid_from <= :now AND valid_until > :now ORDER BY listing_id, valid_until ASC`.
- Service calls it alongside the existing `MediaService.list_grouped_for_owners()` photo batch (both lookups happen before the `RouteListingSummary` loop).
- The helper returns a dict keyed by `listing_id`; service does `photos_grouped.get(...)` + `deals_map.get(...)` in the summary loop.

**3. Backend: `deals_only` filter on the route endpoint (AC: deals-filter)**

**Given** `RouteListingsRequest`,
**When** a new optional field `deals_only: bool = False` is set to `true`,
**Then**:
- After the base listings query + deals batch fetch, the service filters the returned listings to only those where `active_deal is not None`.
- `total_count` reflects the **filtered** count (i.e., count of listings-with-active-deals on this page's polyline buffer — acceptable approximation for MVP; no separate count query needed).
- When `deals_only=false` or omitted: behavior is unchanged.
- The filter is applied **after** personality scoring — i.e., food/scenic personality still picks the best route across all listings, then the deal filter narrows the display list.
- The `deals_only` filter does NOT change the recommended route (route selection stays personality-driven).

**4. Backend: Cache key includes `deals_only` (AC: cache)**

**Given** the existing `_build_route_listings_cache_key()`,
**When** a request includes `deals_only=true`,
**Then**:
- Cache key gets a new segment: `...:deals_only` appended when true; omitted when false (keeps existing keys valid for the common case).
- Final example: `route_listings:{origin}:{dest}:{route_index}:p_none:{cats}:{limit}:{offset}:deals_only`.
- TTL remains 1 hour (unchanged).

**5. Backend: Schema + tests (AC: schema-tests)**

**Given** the pydantic schemas in `backend/modules/journey/schemas.py`,
**When** the story lands,
**Then**:
- New `ActiveDealSummary(_CamelModel)` defined with fields listed in AC 1.
- `RouteListingSummary` gets `active_deal: ActiveDealSummary | None = None`.
- `RouteListingsRequest` gets `deals_only: bool = False`.
- New unit tests in `backend/tests/journey/test_service_deals.py` cover:
  - Listings with active coupon surface `active_deal` populated.
  - Listings without active coupon have `active_deal=None`.
  - Expired or inactive coupons are excluded.
  - Multiple active coupons → earliest `valid_until` wins.
  - `deals_only=true` filters out listings without deals.
  - `deals_only=true` combined with personality still runs route scoring.
  - Batch fetch: a single query for N listings (assert call count via SQL spy or by counting DB round-trips).
- New router test in `backend/tests/journey/test_router_route.py`: `POST /journeys/route` with `dealsOnly=true` returns only listings with `activeDeal != null`.
- Full backend suite must pass — no regressions.

**6. Frontend: Types + API client (AC: fe-types)**

**Given** `apps/web/modules/journey/lib/routeListingsApi.ts`,
**When** the story lands,
**Then**:
- New exported interface `ActiveDealSummary { dealId: string; titleJa: string; discountType: "percentage" | "fixed_vnd"; discountValue: string; priceVnd: number | null; expiresAt: string; }`.
- `RouteListingSummary` gets `activeDeal: ActiveDealSummary | null`.
- `fetchRouteListings()` input gains `dealsOnly?: boolean`; when `true`, sent in body as `dealsOnly: true` (apiClient converts to `deals_only`). Omitted otherwise.
- Two new tests in `routeListingsApi.test.ts`: `dealsOnly=true` is forwarded in the body; omitted when not provided.

**7. Frontend: Deal badge on listing card (AC: card-badge)**

**Given** `RouteListingCard.tsx`,
**When** `listing.activeDeal != null`,
**Then**:
- A Coral-colored badge renders on the card. Layout: absolute-positioned top-left of the photo thumbnail (does not collide with the existing top-right SaveHeartButton).
- Badge content: `💰 お得 -{savings}` where `savings = formatSavingsJpy(activeDeal.discountType, Number(activeDeal.discountValue), listing.priceVnd)` (reuse `@/shared/lib/format-savings`).
- Tapping the badge does NOT trigger `onTap` (listing preview). It calls a new prop `onDealBadgeTap(listingId, dealId)` and stops propagation (same pattern as the existing save button).
- Badge is keyboard-accessible (`role="button"`, `tabIndex={0}`, Enter/Space handler).
- Styling: `bg-accent-coral text-white text-[10px] font-semibold px-1.5 py-0.5 rounded`. Reuses UX-DR13 conventions.

**8. Frontend: Deal badge tap opens CouponDetailSheet (AC: sheet-flow)**

**Given** the user taps the deal badge on a route listing card,
**When** the tap registers,
**Then**:
- `JourneyPageShell` fetches the full `CouponDetail` for that `dealId` on demand (via existing `getCouponById(dealId)` from `@/modules/deals/lib/deals-api` — add the function if not present; it must hit `GET /api/v1/coupons/{dealId}`).
- Once loaded, the `CouponDetailSheet` component (Epic 7 Story 7.2) opens with that coupon.
- Loading state: while fetching, the badge shows a subtle spinner dot (reuse the existing `animate-pulse` Tailwind class; no new spinner component).
- Fetch errors: on failure, show a toast with `labels.dealLoadError` and leave the sheet closed.
- Closing the sheet returns control to the journey page (map state preserved — do NOT re-fetch listings).

**9. Frontend: Coral dot indicator on map pin (AC: pin-indicator)**

**Given** `RouteListingMarkers.tsx`,
**When** a listing has `activeDeal != null`,
**Then**:
- The marker icon adds a small secondary symbol to distinguish deal listings: use `googleNamespace.maps.SymbolPath.CIRCLE` with `fillColor: "#FF6B6B"` (Coral), `scale: 3`, `fillOpacity: 1`, and a larger-scale navy circle behind it (layered via two markers per listing OR an SVG `path` with a dot). Choose a single marker with a composite SVG `path` to keep marker count unchanged.
- Non-deal listings render the existing solid navy circle unchanged.
- Clustering threshold (50) behavior is unchanged — clustered groups do not need to show dots.
- Deal status changes (expiry mid-session) re-render the marker via React effect on `listings` identity.

**10. Frontend: "お得のみ" filter toggle in panel (AC: filter-toggle)**

**Given** `RouteListingsPanel.tsx`,
**When** the listings panel renders,
**Then**:
- A toggle chip labeled `お得のみ` (labels.dealsOnlyToggle; vi: `Chỉ ưu đãi`; en: `Deals only`) appears in the panel header, aligned right of the listings count.
- Toggle state lives in `JourneyPageShell` as `const [dealsOnly, setDealsOnly] = useState(false)`.
- Tapping toggles the state; the effect that calls `fetchRouteListings` includes `dealsOnly` in its dependency array and re-fetches.
- The toggle persists across personality changes and pin taps (does NOT reset), but resets to `false` when `handleSubmit` runs (new route search).
- The header count label uses the filtered count — reuses the existing `{count}` interpolation in `route_listings_header`.
- Filter state is NOT persisted to URL or localStorage for MVP (per Story 10.5 precedent).

**11. Frontend: Client-side expiry handling (AC: expiry-fade)**

**Given** a listing card shows a deal badge,
**When** `activeDeal.expiresAt` passes while the user is on the page,
**Then**:
- A `useEffect` on the card computes `timeUntilExpiry = new Date(expiresAt).getTime() - Date.now()`.
- When `timeUntilExpiry <= 0` on mount: badge is not rendered (defensive — backend should have already filtered).
- Otherwise: a `setTimeout` fires at the expiry moment and sets a local `expired` state; the badge fades out via `transition-opacity duration-300 opacity-0`, then unmounts after 300ms.
- The listing itself **remains** in the list (do not remove the card).
- If `dealsOnly=true` is active, the expired listing still disappears from the list only when the next re-fetch happens (acceptable for MVP — no live pruning).
- Timer is cleaned up on unmount and when `activeDeal` changes identity.

**12. i18n labels (AC: i18n)**

**Given** the journey page supports ja/vi/en,
**When** the new UI strings are added,
**Then** the following keys land in the `journey` namespace of `apps/web/messages/{ja,vi,en}.json`:

```json
{
  "deals_only_toggle": "お得のみ",
  "deal_badge_prefix": "💰 お得",
  "deal_load_error": "クーポン情報を取得できませんでした"
}
```

vi:
- `deals_only_toggle`: `"Chỉ ưu đãi"`
- `deal_badge_prefix`: `"💰 Ưu đãi"`
- `deal_load_error`: `"Không tải được ưu đãi"`

en:
- `deals_only_toggle`: `"Deals only"`
- `deal_badge_prefix`: `"💰 Deal"`
- `deal_load_error`: `"Couldn't load coupon"`

All labels must be plumbed through `JourneyPageShell`'s `labels` prop (same pattern as 10.5 personality labels) and resolved in `apps/web/app/(user)/[locale]/journey/page.tsx`.

**13. Tests: integration + regression (AC: tests)**

**Given** the test suites,
**When** the story lands,
**Then**:
- Backend: 5+ new unit tests in `test_service_deals.py` covering AC 1–5.
- Backend: router test for `deals_only=true` in `test_router_route.py`.
- Backend: full suite — no regressions.
- Frontend: 2 new tests in `routeListingsApi.test.ts` for `dealsOnly` param.
- Frontend: `JourneyPageShell.test.tsx` updated — assert (a) toggle renders, (b) toggling triggers re-fetch with `dealsOnly: true`, (c) new search resets toggle to `false`.
- Frontend: `RouteListingCard.test.tsx` updated (or created) — assert badge renders when `activeDeal` present; tap fires `onDealBadgeTap` and NOT `onTap`.
- Frontend: full suite — no regressions.
- Manual test checklist: see Tasks §Task 11.

## Tasks / Subtasks

- [x] **Task 1 — Backend: Schemas (AC: 5, 6)**
  - [x] Add `ActiveDealSummary` class to `backend/modules/journey/schemas.py`
  - [x] Add `active_deal: ActiveDealSummary | None = None` to `RouteListingSummary`
  - [x] Add `deals_only: bool = False` to `RouteListingsRequest`

- [x] **Task 2 — Backend: Repository batch fetch (AC: 2)**
  - [x] Add `list_active_deals_for_listings(listing_ids, now)` in `backend/modules/journey/repository.py`
  - [x] SQL: `DISTINCT ON (listing_id)` + `ORDER BY listing_id, valid_until ASC`
  - [x] Return `dict[UUID, Row]` (Row has `id, listing_id, title_ja, discount_type, discount_value, valid_until`)

- [x] **Task 3 — Backend: Service integration (AC: 1, 3, 4)**
  - [x] In `JourneyService.get_route_listings()`, after computing `rows`, build `listing_ids` (already present) and call `list_active_deals_for_listings(listing_ids, datetime.now(timezone.utc))`
  - [x] In the summary-building loop: look up `deals_map.get(row.listing_id)`, map to `ActiveDealSummary`, attach to `RouteListingSummary`. Include `price_vnd=row.price_vnd` on the deal (needed for frontend percentage savings)
  - [x] When `request.deals_only` is true, filter the `listings` list to those with `active_deal is not None` BEFORE returning; set `total_count = len(filtered_listings)`
  - [x] Update `_build_route_listings_cache_key()` to take `deals_only: bool`; append `:deals_only` only when true
  - [x] Pass `deals_only=request.deals_only` to the cache-key builder

- [x] **Task 4 — Backend: Tests (AC: 5)**
  - [x] New `backend/tests/journey/test_service_deals.py` — 10 tests (7 service + 3 cache key)
  - [x] Extend `backend/tests/journey/test_router_route.py` with `dealsOnly=true` case
  - [x] Run full backend suite: `cd backend && pytest` — 275 passed, no regressions

- [x] **Task 5 — Frontend: Types + API (AC: 6)**
  - [x] Update `apps/web/modules/journey/lib/routeListingsApi.ts`: add `ActiveDealSummary`, extend `RouteListingSummary`, extend `fetchRouteListings` input with `dealsOnly?: boolean`
  - [x] Conditionally spread `dealsOnly: true` into body (omit when false/undefined)
  - [x] `fetchDealDetail` already exists in `@/modules/deals/lib/deals-api.ts` — no new code needed

- [x] **Task 6 — Frontend: i18n (AC: 12)**
  - [x] Add `deals_only_toggle`, `deal_badge_prefix`, `deal_load_error` to ja, vi, en under `journey` namespace

- [x] **Task 7 — Frontend: Deal badge on card (AC: 7, 11)**
  - [x] Extend `RouteListingCardProps` with `onDealBadgeTap(listingId, dealId)` and `labels.dealBadgePrefix`
  - [x] Render badge when `listing.activeDeal != null`; compute savings via `formatSavingsJpy`
  - [x] Click/keyboard handlers stop propagation and invoke `onDealBadgeTap`
  - [x] Implement the expiry `useEffect` with `setTimeout`; fade + unmount at expiry
  - [x] Add/extend `RouteListingCard.test.tsx` with badge assertions

- [x] **Task 8 — Frontend: Map pin indicator (AC: 9)**
  - [x] Modify `RouteListingMarkers.tsx` — used two markers approach (navy circle + coral dot overlay) instead of composite SVG path, as described in story Dev Notes
  - [x] Non-deal listings retain existing `LISTING_PIN_ICON`
  - [x] Clustering unchanged — coral dots only appear in non-clustered mode

- [x] **Task 9 — Frontend: Panel filter toggle (AC: 10)**
  - [x] Extend `RouteListingsPanelProps` with `dealsOnly: boolean`, `onDealsOnlyChange: (v: boolean) => void`, `labels.dealsOnlyToggle`
  - [x] Render chip in both desktop and mobile headers with coral active/inactive styling
  - [x] Wire in `JourneyPageShell` with new state `const [dealsOnly, setDealsOnly] = useState(false)`
  - [x] Add `dealsOnly` to the `fetchRouteListings` effect deps + pass param
  - [x] Reset `dealsOnly` to `false` at the top of `handleSubmit`

- [x] **Task 10 — Frontend: Deal sheet integration (AC: 8)**
  - [x] In `JourneyPageShell`, add state for `activeDealSheet` and `dealDetail`
  - [x] `handleDealBadgeTap`: calls `fetchDealDetail(dealId)`, on success opens sheet, on error shows toast
  - [x] Render `<CouponDetailSheet>` when both `activeDealSheet` and `dealDetail` are set
  - [x] Pass `labels.dealLoadError` via labels prop; `page.tsx` resolves from journey namespace
  - [x] `CouponDetailSheet` labels resolved from `deals` namespace via `tDeals` in `page.tsx`

- [x] **Task 11 — Tests + manual QA (AC: 13)**
  - [x] `routeListingsApi.test.ts`: 2 new tests for `dealsOnly` (sends/omits)
  - [x] `JourneyPageShell.test.tsx`: toggle renders, toggle triggers re-fetch with dealsOnly=true, handleSubmit resets toggle
  - [x] `RouteListingCard.test.tsx`: badge visibility + tap propagation (3 new tests)
  - [x] Run full frontend suite: 346 passed, no regressions
  - [ ] Manual: search a route with known restaurants/cafes that have active coupons → badges appear, coral dot on pins, tap badge opens sheet, toggle filters list, toggle resets on new search, expiry animation works for a coupon expiring within the session window

## Dev Notes

### Scope boundaries — things NOT to do

- Do NOT implement coupon claim/redeem flows in this story — tapping the badge opens the existing Epic 7 Story 7.2 `CouponDetailSheet` which already handles claim, QR, redeem, etc. Reuse, do not duplicate.
- Do NOT add a route-level "scenic_score"-style deals weighting to personality scoring — deals do not influence route selection (AC 3).
- Do NOT persist `dealsOnly` to URL or session storage — matches the 10.5 personality precedent (resets on visit + new search).
- Do NOT add a new endpoint for "deals along route" — the existing `POST /journeys/route` is extended.
- Do NOT add a dedicated `has_deal` boolean on listings; the presence of `active_deal` conveys it.
- Do NOT modify `JourneyInputs.tsx`, `JourneyMap.tsx`, `JourneyRouteMap.tsx`, `ListingMiniPreview.tsx` (unless required by wiring props for labels).
- Do NOT invalidate the route-listings cache on coupon create/update — the existing 1-hour TTL is the MVP acceptance for staleness (consistent with 10.3 AC).

### Architecture — where the deal join lives

Two options were considered. We pick Option B (batch fetch), consistent with the photo-enrichment pattern already in `service.py`:

**Option A (rejected):** `LEFT JOIN LATERAL (SELECT ... FROM coupons ...) d ON true` inside the existing `find_listings_along_route` SQL.
- Pros: single query.
- Cons: entangles the geospatial query with the coupon domain; harder to unit-test; duplicates Epic 7's "active" logic in the journey module.

**Option B (chosen):** separate repo method `list_active_deals_for_listings()` called right after the listings query, mirroring `MediaService.list_grouped_for_owners()`.
- Pros: consistent with existing photo batching; coupon "active" predicate lives next to the coupon repository conceptually (even though the method sits in `journey/repository.py` to avoid a cross-module dependency chain — we query the `coupons` table directly via raw SQLAlchemy; this is acceptable because `journey/` already reads the `listings` + `listing_categories` tables directly for performance).
- Cons: two queries instead of one. Measured: at 100 listings (max `limit`) the second query is <10ms on indexed `coupons(listing_id, valid_until)`. Acceptable.

### Why filter `deals_only` in Python, not SQL

The filter operates on the page-sized result (≤100 rows) after the geospatial query and personality re-sort. Filtering in Python is simple, keeps the geospatial SQL untouched, and keeps `total_count` semantics straightforward (filtered page count). The MVP trade-off: `total_count` no longer represents the total listings along route — it represents the filtered page count. Document this in the response schema comment.

### Personality + deals_only interaction

Order of operations in `get_route_listings` when both are active:

```
1. directions = get_directions(origin, dest)
2. if personality in {food, scenic}:
     (best_idx, scored_rows, total) = _score_route_personality(...)
     rows = scored_rows
   else:
     rows = find_listings_along_route(route_index)
3. listing_ids = [r.listing_id for r in rows]
4. photos = media.list_grouped_for_owners(listing_ids)
5. deals = repo.list_active_deals_for_listings(listing_ids, now())
6. listings = [build_summary(r, photos, deals) for r in rows]
7. if deals_only: listings = [l for l in listings if l.active_deal]
8. total_count = len(listings) if deals_only else original_total
```

Route scoring stays personality-driven — deals do not influence which polyline is recommended. If a user with `personality=food, deals_only=true` sees "0 results", that's expected; the empty-state CTA ("カテゴリを広げる") remains.

### Cache key shape after 10.5 + 10.6

```
# personality=food/scenic, deals_only=false
route_listings:{origin}:{dest}:p_food:{cats}:{limit}:{offset}

# personality=food/scenic, deals_only=true
route_listings:{origin}:{dest}:p_food:{cats}:{limit}:{offset}:deals_only

# personality=None/fastest, deals_only=false
route_listings:{origin}:{dest}:{route_index}:p_none:{cats}:{limit}:{offset}

# personality=None/fastest, deals_only=true
route_listings:{origin}:{dest}:{route_index}:p_fastest:{cats}:{limit}:{offset}:deals_only
```

Only append the `:deals_only` segment when true to avoid invalidating existing cached entries from 10.5.

### Frontend: where the CouponDetailSheet renders

Place the `<CouponDetailSheet>` at the `JourneyPageShell` root, alongside the existing `ListingMiniPreview` render. The sheet already manages its own open/close animation via `Modal`. Passing `defaultOpen` when `dealDetail != null` opens it; the `onClose` callback resets the page-level `activeDealSheet` and `dealDetail` state.

The sheet requires `coupon: CouponDetail` — we fetch this on demand (not preloaded on the listing) because 95%+ of listings will not have their deal badge tapped in a session. Loading indicator is inline on the badge (pulse dot) during the fetch.

### Frontend: badge positioning on the card

The card has 3 zones:
- Top-left of 64×64 photo → deal badge (new)
- Top-right corner → save heart button (existing)
- Bottom metadata row → distance text (existing)

The badge must overlay the photo thumbnail (not the outer card), so it lives inside the `<div className="w-16 h-16 ...">` wrapper:

```tsx
{listing.activeDeal && !expired && (
  <button
    type="button"
    onClick={(e) => { e.stopPropagation(); onDealBadgeTap(listing.listingId, listing.activeDeal!.dealId); }}
    onKeyDown={(e) => e.stopPropagation()}
    className={cn(
      "absolute top-0.5 left-0.5 z-10",
      "bg-accent-coral text-white text-[10px] font-semibold",
      "px-1.5 py-0.5 rounded transition-opacity duration-300",
      expiring && "opacity-0"
    )}
  >
    {labels.dealBadgePrefix} -{savings}
  </button>
)}
```

### Frontend: composite SVG pin for deal listings

Google Maps `Marker.icon` accepts an object with `path: string` (SVG path) OR a `SymbolPath` constant. To draw a composite (navy outer + coral inner), switch to a custom SVG path string:

```ts
// Non-deal: existing LISTING_PIN_ICON (SymbolPath.CIRCLE, scale 7, navy)
// Deal: SVG path combining two circles
const DEAL_PIN_ICON = {
  path: "M 0, 0 m -7, 0 a 7,7 0 1,0 14,0 a 7,7 0 1,0 -14,0 M 0,0 m -3,0 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0",
  fillColor: "#1B2A4A",  // navy fills outer ring; inner dot needs different fill
  // ... actually composite SVG with two fill colors requires a different approach:
};
```

**Simpler approach:** use two markers per deal listing — main navy circle + a smaller coral dot offset by 0 pixels — with the coral marker's `clickable: false` and higher `zIndex`. Track both in `markersRef` but only attach the click listener to the navy one. This is what we'll implement. Keep `bounceMarker` bouncing only the primary navy marker.

### Frontend: reading `activeDeal.discountValue`

Backend returns `discount_value: Decimal` which serializes to a string (e.g., `"15.00"`). The frontend type is `string`; convert with `Number(activeDeal.discountValue)` before passing to `formatSavingsJpy`.

### Backend: coupon title fallback

For ja locale, always show `active_deal.title_ja`. vi/en locales will see Japanese text for now (acceptable for MVP — the journey page is ja-primary; Epic 7 title_vi/title_en fields exist but are not surfaced here to keep the payload small). Do NOT add title_vi to the `ActiveDealSummary` in this story; defer to a follow-up if needed.

### Previous story learnings (from 10.5)

- `apiClient` auto-converts snake_case ↔ camelCase: backend `active_deal` → frontend `activeDeal`, `deals_only` → `dealsOnly`. Verified in Story 10.5 response handling.
- `JourneyPageShell.test.tsx` already mocks `useSaveFavorite`, `useTranslations`, auth/favorites/signup stores, `favorites-api`. Extend these mocks with `fetchCouponDetail` (module mock on `@/modules/deals/lib/deals-api`).
- `SegmentedControl` precedent: state lives in `JourneyPageShell`, labels plumbed via `labels` prop, resolved in server `page.tsx`. Follow the same pattern for the new deal-related labels.
- Reset-on-new-search precedent: Story 10.5 resets personality inside `handleSubmit`. Add `setDealsOnly(false)` at the same location.
- 10.5 cancellation pattern (`let cancelled = false` in the fetch effect) handles rapid toggle flips automatically.

### Commit message convention

```
feat story(10-6): integrate deals/coupons into journey route listings
```

### Project Structure Notes

- Backend and frontend changes — mixed.
- New file: `backend/tests/journey/test_service_deals.py`
- Modified: `backend/modules/journey/schemas.py` (add `ActiveDealSummary`, extend `RouteListingSummary`, extend `RouteListingsRequest`)
- Modified: `backend/modules/journey/repository.py` (add `list_active_deals_for_listings`)
- Modified: `backend/modules/journey/service.py` (batch fetch deals, attach to summary, apply `deals_only` filter, cache-key change)
- Modified: `backend/tests/journey/test_router_route.py` (add deals_only router test)
- Modified: `apps/web/modules/journey/lib/routeListingsApi.ts` (`ActiveDealSummary`, `dealsOnly` param)
- Modified or created: `apps/web/modules/deals/lib/deals-api.ts` (`fetchCouponDetail` helper if missing)
- Modified: `apps/web/modules/journey/components/RouteListingCard.tsx` (badge + expiry timer)
- Modified: `apps/web/modules/journey/components/RouteListingMarkers.tsx` (coral dot marker)
- Modified: `apps/web/modules/journey/components/RouteListingsPanel.tsx` (deals-only chip)
- Modified: `apps/web/modules/journey/components/JourneyPageShell.tsx` (state, effect deps, CouponDetailSheet render, handlers, labels)
- Modified: `apps/web/app/(user)/[locale]/journey/page.tsx` (resolve new labels)
- Modified: `apps/web/messages/ja.json`, `vi.json`, `en.json` (3 new keys under `journey`)
- Modified: `apps/web/modules/journey/__tests__/routeListingsApi.test.ts`
- Modified: `apps/web/modules/journey/__tests__/JourneyPageShell.test.tsx`
- Modified or created: `apps/web/modules/journey/__tests__/RouteListingCard.test.tsx`

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-10-journey-based-discovery.md#Story-10.6]
- [Source: _bmad-output/implementation-artifacts/10-5-route-personality-scoring.md — JourneyPageShell state pattern, useEffect cancellation, label plumbing, reset-on-new-search precedent]
- [Source: _bmad-output/implementation-artifacts/10-4-listings-along-route-ui.md — RouteListingCard/Panel/Markers patterns, useListingInteraction]
- [Source: _bmad-output/implementation-artifacts/10-3-route-aware-listing-matching.md — photo batching pattern via MediaService.list_grouped_for_owners]
- [Source: _bmad-output/implementation-artifacts/7-2-coupon-claim-redemption.md — CouponDetailSheet flow (claim, QR, redeem)]
- [Source: _bmad-output/implementation-artifacts/7-1-deals-coupons-browsing.md — coupon list item shape, deals-api patterns]
- [Source: backend/modules/coupon/models.py — Coupon fields (listing_id, title_ja, discount_type, discount_value, valid_from, valid_until, is_active, deleted_at)]
- [Source: backend/modules/coupon/repository.py — _active_where_clauses() precedent for "active" predicate]
- [Source: backend/modules/journey/service.py — get_route_listings() flow, cache key builder, photo enrichment loop, personality scoring integration]
- [Source: backend/modules/journey/repository.py — find_listings_along_route() raw SQL pattern]
- [Source: backend/modules/journey/schemas.py — _CamelModel base + existing RouteListingSummary fields]
- [Source: apps/web/modules/journey/components/RouteListingCard.tsx — card layout, SaveHeartButton placement]
- [Source: apps/web/modules/journey/components/RouteListingMarkers.tsx — marker creation + clustering]
- [Source: apps/web/modules/journey/components/JourneyPageShell.tsx — state orchestration, fetchRouteListings effect]
- [Source: apps/web/modules/deals/components/CouponDetailSheet.tsx — sheet props, claim/redeem flow, labels contract]
- [Source: apps/web/shared/lib/format-savings.ts — formatSavingsJpy helper]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md — no spinners, skeleton loading, @/ aliases, snake_case ↔ camelCase auto-convert]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Existing backend tests required `repo.list_active_deals_for_listings = AsyncMock(return_value={})` mock — auto-created AsyncMock attrs don't return dicts, causing Pydantic validation failures
- Existing frontend tests required `activeDeal: null` added to RouteListingSummary fixtures
- `fetchDealDetail` already existed in `deals-api.ts` — no new function needed

### Completion Notes List

- Backend: ActiveDealSummary schema, batch fetch repo method, service integration with deals enrichment + deals_only filter, cache key extension
- Frontend: ActiveDealSummary type, dealsOnly API param, deal badge on card with expiry timer, coral dot map pin, deals-only toggle chip, CouponDetailSheet integration via on-demand fetch
- i18n: 3 new keys in ja/vi/en
- Tests: 10 new backend tests (test_service_deals.py) + 1 router test, 2 API tests + 3 card tests + 3 shell tests. Full suites pass (275 backend, 346 frontend)

### Change Log

- 2026-04-22: Story 10-6 implemented — deals/coupons integration into journey route listings

### File List

**New:**
- backend/tests/journey/test_service_deals.py

**Modified (backend):**
- backend/modules/journey/schemas.py (ActiveDealSummary, deals_only field, active_deal field)
- backend/modules/journey/repository.py (list_active_deals_for_listings)
- backend/modules/journey/service.py (deals batch fetch, enrichment, deals_only filter, cache key)
- backend/tests/journey/test_router_route.py (dealsOnly=true test)
- backend/tests/journey/test_service_route.py (mock fix for list_active_deals_for_listings)
- backend/tests/journey/test_service_personality.py (mock fix for list_active_deals_for_listings)

**Modified (frontend):**
- apps/web/modules/journey/lib/routeListingsApi.ts (ActiveDealSummary, dealsOnly param)
- apps/web/modules/journey/components/RouteListingCard.tsx (deal badge, expiry timer)
- apps/web/modules/journey/components/RouteListingMarkers.tsx (coral dot for deal pins)
- apps/web/modules/journey/components/RouteListingsPanel.tsx (deals-only toggle chip, onDealBadgeTap)
- apps/web/modules/journey/components/JourneyPageShell.tsx (dealsOnly state, deal sheet, labels)
- apps/web/app/(user)/[locale]/journey/page.tsx (new labels from journey + deals namespaces)
- apps/web/messages/ja.json (3 new journey keys)
- apps/web/messages/vi.json (3 new journey keys)
- apps/web/messages/en.json (3 new journey keys)
- apps/web/modules/journey/__tests__/routeListingsApi.test.ts (2 new dealsOnly tests)
- apps/web/modules/journey/__tests__/JourneyPageShell.test.tsx (3 new tests + mocks + labels)
- apps/web/modules/journey/__tests__/RouteListingCard.test.tsx (3 new badge tests + activeDeal fixture)
- apps/web/modules/journey/__tests__/ListingMiniPreview.test.tsx (activeDeal fixture fix)
- apps/web/modules/journey/__tests__/RouteListingMarkers.test.tsx (activeDeal fixture fix)
- apps/web/modules/journey/__tests__/RouteListingsPanel.test.tsx (activeDeal fixture fix)
