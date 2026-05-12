# Story 10.5: Route Personality Scoring

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese user with a specific vibe in mind,
I want to switch the route personality between Food, Scenic, and Fastest,
so that the route and listings-along-route adapt to my mood — with the best route alternative auto-selected and listings re-ranked by personality-specific scoring.

## Acceptance Criteria

**1. Personality segmented control UI (AC: personality-ui)**

**Given** the journey page with a route displayed (`status === "ready"`),
**When** the page renders,
**Then**:
- A `SegmentedControl` (from `@/shared/components/SegmentedControl`) displays above the map with 3 segments: `"🍜 食"`, `"🌅 景"`, `"⚡ 早"`.
- Default selection: index 0 (Food).
- The control maps to `personality` values: index 0 = `"food"`, index 1 = `"scenic"`, index 2 = `"fastest"`.
- The control is ONLY visible when `status === "ready"` (routes exist).

**2. Fastest personality — route + listing behavior (AC: fastest)**

**Given** I tap `⚡ 早` (Fastest),
**When** personality switches to `"fastest"`,
**Then**:
- **Route selection:** The primary polyline updates to the route with **shortest `durationSeconds`** from the available directions alternatives.
- **Route selection is computed client-side** since the frontend already has all `routes[]` with `durationSeconds`.
- **Listing re-ranking:** Backend returns listings sorted by pure `distance_from_origin_m` ascending (no category weighting) — this is the existing default behavior.
- The `selectedIndex` state updates to match the fastest route's index.

**3. Food personality — route + listing behavior (AC: food)**

**Given** I tap `🍜 食` (Food),
**When** personality is Food,
**Then**:
- **Route selection:** Backend evaluates all route alternatives and returns `recommended_route_index` — the route that passes nearest to the most high-rated restaurant/cafe listings.
- **Listing re-ranking:** Backend applies scoring formula:
  ```
  score = rating_avg_normalized * 0.4 + category_weight * 0.3 + proximity_score * 0.3
  ```
  Where:
  - `rating_avg_normalized` = `rating_avg / 5.0` (normalize to 0-1 range)
  - `category_weight` = `1.0` for restaurant, cafe; `0.3` for all other categories
  - `proximity_score` = `max(0, 1 - distance_from_route_m / buffer_meters)` (0-1, closer = higher)
- Listings are returned sorted by `score DESC` (not by `distance_from_origin_m`).
- Frontend updates `selectedIndex` to `recommended_route_index` from the response.

**4. Scenic personality — route + listing behavior (AC: scenic)**

**Given** I tap `🌅 景` (Scenic),
**When** personality is Scenic,
**Then**:
- **Route selection:** Backend evaluates all route alternatives and returns `recommended_route_index` — the route with the highest scenic score (counts listings with scenic categories within buffer).
- **Listing re-ranking:** Backend applies scoring formula (same structure as Food):
  ```
  score = rating_avg_normalized * 0.4 + category_weight * 0.3 + proximity_score * 0.3
  ```
  Where:
  - `category_weight` = `1.0` for cafe, tour, hotel; `0.3` for all other categories
  - (Note: tour, hotel, beach, park, viewpoint categories do NOT exist in seed data yet — the config is forward-compatible; currently only "cafe" gets the 1.0 boost for scenic)
- Frontend updates `selectedIndex` to `recommended_route_index`.

**5. Backend scoring function (AC: backend-scoring)**

**Given** the personality scoring is rule-based for MVP,
**When** the logic runs,
**Then**:
- It is implemented in `journey/service.py` as a method `_score_route_personality()` on `JourneyService`.
- Scoring config (weights, category slug mappings) lives in `journey/constants.py` as dictionaries for easy tuning.
- Unit tests cover:
  - Food personality prefers food-heavy routes (higher score for restaurant/cafe dense routes)
  - Scenic personality prefers scenic-heavy routes (higher score for cafe/tour/hotel dense routes)
  - Fastest personality ignores category and picks shortest duration
  - Edge case: no listings along any route → `recommended_route_index = 0` (first route)
  - Edge case: all routes score equal → use first route
- Weights can be adjusted without schema changes (deferred: ML-based ranking).

**6. Backend response schema update (AC: response-schema)**

**Given** the `RouteListingsResponse` schema,
**When** `personality` is provided in the request,
**Then**:
- Response includes a new field: `recommended_route_index: int | None` — the index (0-based) of the best route alternative for the given personality.
- When `personality` is `None` → `recommended_route_index` is `None` (user manually selects).
- When `personality` is `"fastest"` → `recommended_route_index` is `None` (frontend handles route selection client-side since it's a simple min-duration lookup).
- When `personality` is `"food"` or `"scenic"` → `recommended_route_index` is the backend-computed best route index.
- The `route` field in the response reflects the recommended route (not necessarily `route_index` from request).

**7. Cache key includes personality (AC: cache)**

**Given** the Redis cache for route listings,
**When** a request includes `personality`,
**Then**:
- Cache key format: `route_listings:{origin_hash}:{dest_hash}:{personality_or_none}:{cats_hash}:{limit}:{offset}`.
- Note: When personality is `"food"` or `"scenic"`, the backend auto-selects the best route, so `route_index` from the request is **ignored** and excluded from the cache key. When personality is `None` or `"fastest"`, `route_index` IS included.
- Cache TTL remains 1 hour (unchanged).

**8. Frontend re-fetch on personality change (AC: refetch)**

**Given** the journey page with listings displayed,
**When** I switch personality via the segmented control,
**Then**:
- `fetchRouteListings()` is called with the new `personality` value.
- The `useEffect` dependency array includes `selectedPersonality`.
- For `"fastest"`: frontend first computes the fastest route index client-side, updates `selectedIndex`, then fetches listings with `personality: "fastest"` and that `routeIndex`.
- For `"food"` / `"scenic"`: frontend fetches listings with `personality` value (no `routeIndex` override — backend decides). On response, frontend updates `selectedIndex` to `recommended_route_index`.
- The map polyline colors update to reflect the new primary route.
- The listings panel re-renders with the re-ranked listings.

**9. i18n labels (AC: i18n)**

**Given** the journey page supports ja/vi/en locales,
**When** the personality control renders,
**Then** all user-facing strings are sourced from the `journey` namespace.

New keys to add:
```json
{
  "personality_food": "🍜 食",
  "personality_scenic": "🌅 景",
  "personality_fastest": "⚡ 早"
}
```
Add equivalent vi and en translations:
- vi: `"🍜 Ẩm thực"`, `"🌅 Cảnh đẹp"`, `"⚡ Nhanh nhất"`
- en: `"🍜 Food"`, `"🌅 Scenic"`, `"⚡ Fastest"`

**10. URL persistence (AC: url)**

**Given** the personality is selected,
**When** I share the URL or reload the page,
**Then**:
- The `personality` value is NOT persisted in the URL (unlike origin/destination). The default is always `"food"` on page load.
- Session storage is NOT used. Personality resets on each visit.

## Tasks / Subtasks

- [x] **Task 1 — Backend: Add personality scoring constants (AC: 5)**
  - [x] Add to `backend/modules/journey/constants.py`:
    - `PERSONALITY_FOOD_CATEGORY_SLUGS`: `{"restaurant", "cafe"}` (weight 1.0)
    - `PERSONALITY_SCENIC_CATEGORY_SLUGS`: `{"cafe", "tour", "hotel", "beach", "park", "viewpoint"}` (weight 1.0)
    - `PERSONALITY_DEFAULT_CATEGORY_WEIGHT`: `0.3`
    - `PERSONALITY_BOOSTED_CATEGORY_WEIGHT`: `1.0`
    - `PERSONALITY_SCORE_WEIGHTS`: `{"rating": 0.4, "category": 0.3, "proximity": 0.3}`

- [x] **Task 2 — Backend: Update schema with `recommended_route_index` (AC: 6)**
  - [x] Add `recommended_route_index: int | None = None` to `RouteListingsResponse` in `backend/modules/journey/schemas.py`

- [x] **Task 3 — Backend: Implement `_score_route_personality()` in service (AC: 5, 3, 4)**
  - [x] Add private method `_score_route_personality(self, personality, routes, request)` to `JourneyService` in `service.py`
  - [x] For `personality="food"`: iterate all route alternatives, for each route run `_repository.find_listings_along_route()`, compute aggregate food score (sum of per-listing scores using food category weights), pick route with highest aggregate score
  - [x] For `personality="scenic"`: same approach but with scenic category weights
  - [x] For `personality="fastest"` or `None`: return `None` (no recommendation; fastest handled client-side, None = manual selection)
  - [x] Return tuple: `(best_route_index: int | None, scored_listings: list[Row])`
  - [x] Scoring per listing: `rating_avg_normalized * 0.4 + category_weight * 0.3 + proximity_score * 0.3`
  - [x] Proximity: `max(0, 1 - distance_from_route_m / buffer_meters)`

- [x] **Task 4 — Backend: Integrate personality into `get_route_listings()` (AC: 3, 4, 7)**
  - [x] Modify `get_route_listings()` in `service.py`:
    - When `personality` is `"food"` or `"scenic"`: call `_score_route_personality()` → use its `best_route_index` to select route, use its scored listings (already sorted by score DESC)
    - When `personality` is `"fastest"` or `None`: keep current behavior (use `route_index` from request, sort by `distance_from_origin_m`)
  - [x] Update `_build_route_listings_cache_key()` to include personality:
    - When personality is `"food"` or `"scenic"`: key = `...:{personality}:{cats}:{limit}:{offset}` (no route_index since backend auto-selects)
    - When personality is `None` or `"fastest"`: key = `...:{route_index}:{personality_or_none}:{cats}:{limit}:{offset}`
  - [x] Set `recommended_route_index` on `RouteListingsResponse`

- [x] **Task 5 — Backend: Unit tests for personality scoring (AC: 5)**
  - [x] Create `backend/tests/journey/test_service_personality.py`
  - [x] Test: food personality scores restaurant/cafe listings higher than housing
  - [x] Test: scenic personality scores cafe listings higher than restaurant
  - [x] Test: fastest personality returns `None` for recommended_route_index and listings sorted by distance
  - [x] Test: no listings → recommended_route_index = 0
  - [x] Test: equal scores → picks first route (index 0)
  - [x] Test: scoring formula produces correct values for known inputs

- [x] **Task 6 — Frontend: Add `personality` param to routeListingsApi (AC: 8)**
  - [x] Update `fetchRouteListings()` input type to include `personality?: "food" | "scenic" | "fastest"`
  - [x] Pass `personality` in the request body (conditionally, like `categoryIds`)
  - [x] Update `RouteListingsResponse` type to include `recommendedRouteIndex: number | null`
  - [x] Add test in `routeListingsApi.test.ts` verifying personality is sent in body

- [x] **Task 7 — Frontend: i18n updates (AC: 9)**
  - [x] Add 3 personality keys to `apps/web/messages/ja.json` under `journey` namespace
  - [x] Add equivalent keys to `apps/web/messages/vi.json`
  - [x] Add equivalent keys to `apps/web/messages/en.json`

- [x] **Task 8 — Frontend: Add personality state + SegmentedControl to JourneyPageShell (AC: 1, 2, 8)**
  - [x] Add state: `const [selectedPersonality, setSelectedPersonality] = useState<"food" | "scenic" | "fastest">("food")`
  - [x] Render `SegmentedControl` above the map (inside the flex container, only when `status === "ready"`):
    ```tsx
    <SegmentedControl
      segments={[labels.personalityFood, labels.personalityScenic, labels.personalityFastest]}
      activeIndex={personalityIndex}
      onChange={handlePersonalityChange}
    />
    ```
  - [x] Map index ↔ personality: `const PERSONALITIES = ["food", "scenic", "fastest"] as const`
  - [x] Handle personality change:
    - For `"fastest"`: compute fastest route index client-side (`routes.reduce` finding min `durationSeconds`), update `selectedIndex` immediately
    - For `"food"` / `"scenic"`: let `fetchRouteListings` handle it, then update `selectedIndex` from `recommendedRouteIndex`
  - [x] Update the `useEffect` for fetching route listings:
    - Add `selectedPersonality` to dependency array
    - Pass `personality: selectedPersonality` to `fetchRouteListings()`
    - On response: if `res.recommendedRouteIndex != null`, update `selectedIndex` to it
  - [x] Update labels interface to include `personalityFood`, `personalityScenic`, `personalityFastest`
  - [x] Reset personality to `"food"` when a new route search is performed (user changes origin/destination)

- [x] **Task 9 — Frontend: Update server page to pass personality labels (AC: 9)**
  - [x] Update `apps/web/app/(user)/[locale]/journey/page.tsx` to resolve and pass the 3 new label props

- [x] **Task 10 — Tests: Backend integration + frontend regression (AC: all)**
  - [x] Run all existing backend journey tests — must pass unchanged
  - [x] Add router test in `test_router_route.py`: POST `/journeys/route` with `personality=food` returns `recommended_route_index`
  - [x] Run all existing frontend journey tests — must pass unchanged
  - [x] Update `JourneyPageShell.test.tsx` to verify:
    - SegmentedControl renders when status is "ready"
    - Personality change triggers re-fetch
    - Default personality "food" sent in fetchRouteListings
  - [x] Run full backend test suite — no regressions (264/264 passed)
  - [x] Run full frontend test suite — no regressions (338/338 passed)
  - [ ] Manual test: search route, switch to Fastest, verify shortest duration route highlighted
  - [ ] Manual test: switch to Food, verify re-ranked listings and route change
  - [ ] Manual test: switch to Scenic, verify re-ranked listings and route change
  - [ ] Manual test: switch personality multiple times rapidly, verify no stale state

## Dev Notes

### Scope boundaries — things NOT to do

- Do NOT add deal/coupon badges or "お得のみ" filter — that's Story 10.6.
- Do NOT implement ML-based ranking — the epic explicitly says "rule-based for MVP".
- Do NOT persist personality in URL or session storage (AC: 10).
- Do NOT modify `JourneyInputs.tsx` — the search input UI is unchanged.
- Do NOT modify `JourneyRouteMap.tsx` internals — route display already works when `selectedIndex` changes.
- Do NOT modify `RouteListingsPanel.tsx` — it renders whatever listings array it receives (already sorted by backend).
- Do NOT modify `RouteListingMarkers.tsx` — pins render based on listings array (unchanged).
- Do NOT add new categories to the database — use existing slugs only. The constants are forward-compatible.
- Do NOT add a category filter UI — that's deferred.

### Architecture: How personality affects route selection

The personality flow splits into two paths:

**Fastest (client-side):**
```
User taps "⚡ 早"
  → Frontend computes: fastestIdx = routes.findIndex(r => r.durationSeconds === Math.min(...durations))
  → selectedIndex = fastestIdx
  → Map polyline updates (existing behavior — JourneyRouteMap reacts to selectedIndex change)
  → fetchRouteListings({ personality: "fastest", routeIndex: fastestIdx })
  → Backend returns listings sorted by distance_from_origin_m (default behavior)
  → recommendedRouteIndex = null (not needed)
```

**Food/Scenic (backend-driven):**
```
User taps "🍜 食" or "🌅 景"
  → fetchRouteListings({ personality: "food" })  // no routeIndex override
  → Backend: _score_route_personality() evaluates all 3 routes
  → Backend picks best route → fetches listings → applies scoring → sorts by score DESC
  → Returns { route: bestRouteInfo, listings: [...scored], recommendedRouteIndex: 1, totalCount }
  → Frontend: selectedIndex = response.recommendedRouteIndex
  → Map polyline updates to new primary route
  → Panel displays re-ranked listings
```

### Backend `_score_route_personality()` implementation detail

For Food/Scenic, the method must evaluate all route alternatives:

```python
async def _score_route_personality(
    self,
    personality: str,
    directions: DirectionsResponse,
    request: RouteListingsRequest,
) -> tuple[int, list[Row], int]:
    """Evaluate all routes and pick the best for the given personality.
    Returns (best_route_index, scored_listing_rows, total_count).
    """
    if personality == "fastest" or personality is None:
        return (None, [], 0)  # handled differently

    category_slugs = PERSONALITY_FOOD_CATEGORY_SLUGS if personality == "food" else PERSONALITY_SCENIC_CATEGORY_SLUGS
    weights = PERSONALITY_SCORE_WEIGHTS

    best_index = 0
    best_aggregate = -1.0
    best_rows = []
    best_total = 0

    for idx, route in enumerate(directions.routes):
        linestring_wkt = _build_linestring_wkt(route.polyline)
        rows, total = await self._repository.find_listings_along_route(
            linestring_wkt=linestring_wkt,
            buffer_meters=request.buffer_meters,
            category_ids=request.category_ids,
            limit=request.limit,
            offset=request.offset,
        )

        aggregate = sum(
            _compute_listing_score(row, category_slugs, request.buffer_meters, weights)
            for row in rows
        )

        if aggregate > best_aggregate:
            best_aggregate = aggregate
            best_index = idx
            best_rows = rows
            best_total = total

    # Re-sort best_rows by individual score DESC
    best_rows_scored = sorted(
        best_rows,
        key=lambda r: _compute_listing_score(r, category_slugs, request.buffer_meters, weights),
        reverse=True,
    )

    return (best_index, best_rows_scored, best_total)
```

The `_compute_listing_score` helper is a module-level function:
```python
def _compute_listing_score(row, boosted_slugs, buffer_meters, weights):
    rating_norm = float(row.rating_avg) / 5.0
    cat_weight = PERSONALITY_BOOSTED_CATEGORY_WEIGHT if row.category_slug in boosted_slugs else PERSONALITY_DEFAULT_CATEGORY_WEIGHT
    proximity = max(0.0, 1.0 - row.distance_from_route_m / buffer_meters)
    return rating_norm * weights["rating"] + cat_weight * weights["category"] + proximity * weights["proximity"]
```

### Performance consideration: 3x PostGIS queries

Food/Scenic personality evaluates all 3 route alternatives, meaning 3 calls to `find_listings_along_route()`. At ~200ms p95 per query (per Story 10.3 AC), worst case is ~600ms. This is acceptable because:
1. Results are cached for 1 hour — only the first request is slow.
2. 3 async DB queries could be parallelized with `asyncio.gather()` if needed (optimization for post-MVP).
3. The current MVP priority is correctness over speed.

### Cache key change

Current:
```
route_listings:{origin}:{dest}:{route_index}:{cats}:{limit}:{offset}
```

Updated:
```
# personality = food/scenic → route_index is auto-selected, don't include it
route_listings:{origin}:{dest}:p_{personality}:{cats}:{limit}:{offset}

# personality = fastest/None → route_index matters
route_listings:{origin}:{dest}:{route_index}:p_none:{cats}:{limit}:{offset}
route_listings:{origin}:{dest}:{route_index}:p_fastest:{cats}:{limit}:{offset}
```

Update `_build_route_listings_cache_key()` to accept `personality: str | None` parameter.

### Frontend: SegmentedControl placement

The `SegmentedControl` sits between the `JourneyInputs` and the map/panel flex container:

```tsx
{showListings && (
  <SegmentedControl
    segments={[labels.personalityFood, labels.personalityScenic, labels.personalityFastest]}
    activeIndex={PERSONALITIES.indexOf(selectedPersonality)}
    onChange={(idx) => handlePersonalityChange(PERSONALITIES[idx])}
    className="w-full max-w-md mx-auto"
  />
)}

<div className={showListings ? "flex flex-col md:flex-row gap-4" : ""}>
  ...
</div>
```

### Frontend: Preventing stale state on rapid personality switching

The existing cancellation pattern in the `useEffect` (Story 10.4) handles this:
```typescript
let cancelled = false;
// ... fetch ...
return () => { cancelled = true; };
```
When `selectedPersonality` changes, the previous effect is cleaned up, and `cancelled = true` prevents stale responses from updating state. No debounce needed.

### Frontend: Reset personality on new search

When the user changes origin/destination and submits a new search, reset personality to `"food"` (default). This happens in `handleSubmit()`:
```typescript
setSelectedPersonality("food");
```

### Category slugs in seed data

Current seed categories: `"housing"`, `"restaurant"`, `"cafe"`.

The personality constants reference slugs that **may not exist yet**: `"tour"`, `"hotel"`, `"beach"`, `"park"`, `"viewpoint"`. This is intentional — the set-based lookup (`slug in PERSONALITY_SCENIC_CATEGORY_SLUGS`) gracefully ignores categories that don't exist. When those categories are added later, scenic personality scoring automatically picks them up.

For MVP testing, Food personality works well (restaurant + cafe exist). Scenic personality only boosts "cafe" for now — this is acceptable.

### Existing code that already supports personality

- `backend/modules/journey/schemas.py:63` — `personality: Literal["food", "scenic", "fastest"] | None = None` already exists in `RouteListingsRequest`.
- `backend/modules/journey/constants.py:28` — comment says "Story 10.5 will parameterize this per personality".
- `apps/web/shared/components/SegmentedControl.tsx` — reusable component with animation, a11y, keyboard support. Ready to use.
- Story 10.4 `JourneyPageShell.tsx` already has `selectedIndex` state and re-fetches listings when it changes.

### Previous story learnings (from 10.4)

- `google is not defined` fix: store the google namespace in a ref. Already applied — no impact on this story.
- JourneyPageShell test requires mocks for `useSaveFavorite`, `useTranslations("favorites")`, auth/favorites/signup stores, and favorites-api. Same mocks needed for new tests.
- `apiClient` auto-converts snake_case ↔ camelCase: backend returns `recommended_route_index` → frontend receives `recommendedRouteIndex`.

### Commit message convention

```
feat story(10-5): implement route personality scoring with food/scenic/fastest modes
```

### Project Structure Notes

- Backend and frontend changes in this story — mixed.
- New file: `backend/tests/journey/test_service_personality.py`
- Modified: `backend/modules/journey/constants.py` (add scoring config)
- Modified: `backend/modules/journey/schemas.py` (add `recommended_route_index`)
- Modified: `backend/modules/journey/service.py` (add `_score_route_personality()`, modify `get_route_listings()`)
- Modified: `apps/web/modules/journey/lib/routeListingsApi.ts` (add personality param)
- Modified: `apps/web/modules/journey/components/JourneyPageShell.tsx` (add personality state + UI)
- Modified: `apps/web/app/(user)/[locale]/journey/page.tsx` (pass new labels)
- Modified: `apps/web/messages/ja.json`, `vi.json`, `en.json` (add personality keys)
- Modified: `apps/web/modules/journey/__tests__/JourneyPageShell.test.tsx` (update tests)
- Modified: `backend/tests/journey/test_router_route.py` (add personality router test)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-10-journey-based-discovery.md#Story-10.5]
- [Source: _bmad-output/implementation-artifacts/10-4-listings-along-route-ui.md — JourneyPageShell state, routeListingsApi, useListingInteraction, card/panel/marker patterns]
- [Source: backend/modules/journey/service.py — get_route_listings() flow, cache key builder, directions fetch, photo enrichment]
- [Source: backend/modules/journey/schemas.py:63 — personality field already in RouteListingsRequest]
- [Source: backend/modules/journey/constants.py:28 — DIRECTIONS_TRAVEL_MODE comment about 10.5]
- [Source: backend/modules/journey/repository.py — find_listings_along_route() returns category_slug, rating_avg, distance fields needed for scoring]
- [Source: apps/web/shared/components/SegmentedControl.tsx — segments[], activeIndex, onChange props, sliding indicator, a11y]
- [Source: apps/web/modules/journey/components/JourneyPageShell.tsx — status, selectedIndex, routes[], fetchRouteListings useEffect, handleSubmit]
- [Source: apps/web/modules/journey/lib/routeListingsApi.ts — fetchRouteListings input shape, RouteListingsResponse type]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md — no spinners, skeleton loading, @/ aliases, snake_case backend, camelCase frontend]
- [Source: backend/scripts/seed_data.py:29-33 — current categories: housing, restaurant, cafe only]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Fixed pre-existing issue: `NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY` in `backend/.env` was blocking all backend tests (pydantic-settings `extra="forbid"`). Removed the line since it's a frontend-only variable.

### Completion Notes List

- Backend: Added personality scoring constants (`PERSONALITY_FOOD_CATEGORY_SLUGS`, `PERSONALITY_SCENIC_CATEGORY_SLUGS`, score weights) to `constants.py`
- Backend: Added `recommended_route_index: int | None` to `RouteListingsResponse` schema
- Backend: Implemented `_compute_listing_score()` module-level helper and `_score_route_personality()` on `JourneyService` — evaluates all route alternatives and picks the best route for food/scenic personalities
- Backend: Integrated personality into `get_route_listings()` — food/scenic use backend-driven route selection; fastest/None use client-side route_index
- Backend: Updated `_build_route_listings_cache_key()` to include personality tag; food/scenic exclude route_index from cache key
- Backend: 13 new unit tests covering scoring formula, route preference, edge cases, and integration
- Backend: 1 new router test for personality=food returning `recommended_route_index`
- Frontend: Added `personality` param and `recommendedRouteIndex` to `routeListingsApi.ts`
- Frontend: Added `SegmentedControl` for food/scenic/fastest personality switching in `JourneyPageShell.tsx`
- Frontend: Client-side fastest route selection via `routes.reduce` (min durationSeconds)
- Frontend: Backend-driven route selection for food/scenic via `recommendedRouteIndex` response
- Frontend: Personality resets to "food" on new route search
- Frontend: Added i18n keys for 3 locales (ja, vi, en)
- Frontend: 2 new API tests (personality sent in body, personality omitted when not provided)
- Frontend: 3 new JourneyPageShell tests (SegmentedControl renders, personality change triggers re-fetch, default personality "food" sent)
- Test results: 264/264 backend tests passed, 338/338 frontend tests passed, 0 regressions

### Change Log

- 2026-04-22: Implemented Story 10.5 — Route Personality Scoring (food/scenic/fastest modes)

### File List

- `backend/modules/journey/constants.py` — Added personality scoring constants
- `backend/modules/journey/schemas.py` — Added `recommended_route_index` to `RouteListingsResponse`
- `backend/modules/journey/service.py` — Added `_compute_listing_score()`, `_score_route_personality()`, updated `get_route_listings()` and cache key builder
- `backend/tests/journey/test_service_personality.py` — NEW: 13 unit tests for personality scoring
- `backend/tests/journey/test_router_route.py` — Added personality router test
- `apps/web/modules/journey/lib/routeListingsApi.ts` — Added `personality` param and `recommendedRouteIndex` type
- `apps/web/modules/journey/components/JourneyPageShell.tsx` — Added SegmentedControl, personality state, handlePersonalityChange, updated useEffect
- `apps/web/app/(user)/[locale]/journey/page.tsx` — Passed personality label props
- `apps/web/messages/ja.json` — Added personality_food/scenic/fastest keys
- `apps/web/messages/vi.json` — Added personality_food/scenic/fastest keys
- `apps/web/messages/en.json` — Added personality_food/scenic/fastest keys
- `apps/web/modules/journey/__tests__/routeListingsApi.test.ts` — Added 2 personality tests
- `apps/web/modules/journey/__tests__/JourneyPageShell.test.tsx` — Added 3 personality tests, updated labels
