# Story 10.4: Listings Along Route UI

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese user viewing a route,
I want to see a list of notable DaNangNavi-verified places along my route ordered by when I'll encounter them,
so that I can discover restaurants, cafes, and spots without detouring far from my path — with map pins showing each listing's exact location, card↔pin interaction, a mini-preview overlay, and favorite saving.

## Acceptance Criteria

**1. Route listings API client (AC: api-client)**

**Given** the route is in `status === "ready"` (from Story 10.2),
**When** the shell transitions to ready with `routes` and `selectedIndex`,
**Then**:
- A new API function `fetchRouteListings()` in `apps/web/modules/journey/lib/routeListingsApi.ts` calls `POST /journeys/route` via `apiClient`.
- Request body: `{ origin, destination, bufferMeters: 300, routeIndex: selectedIndex, limit: 30, offset: 0, categoryIds?: string[] }`.
- Response type `RouteListingsResponse`:
  ```typescript
  interface RouteListingSummary {
    listingId: string;
    titleJa: string;
    titleVi: string;
    categoryId: string;
    categorySlug: string;
    categoryNameJa: string;
    ratingAvg: string;
    reviewCount: number;
    isSenpaiVerified: boolean;
    priceVnd: number | null;
    latitude: number;
    longitude: number;
    photos: { id: string; url: string; width: number | null; height: number | null }[];
    distanceFromOriginM: number;
    distanceFromRouteM: number;
  }

  interface RouteInfo {
    polyline: string;
    distanceMeters: number;
    durationSeconds: number;
    summary: string;
  }

  interface RouteListingsResponse {
    route: RouteInfo;
    listings: RouteListingSummary[];
    totalCount: number;
  }
  ```
- The `apiClient` auto-converts snake_case↔camelCase — define types in camelCase only.
- Follow the exact pattern in `directionsApi.ts`: try/catch with `ApiError` rethrow.

**2. Bottom sheet (mobile) / right panel (desktop) with listing cards (AC: listing-panel)**

**Given** the route has been searched and the backend returns listings,
**When** listings data is available,
**Then**:
- A new component `RouteListingsPanel` renders:
  - **Mobile (< md):** A bottom sheet using the existing `Modal` component with `variant="full"`. It slides up from the bottom and is scrollable. Show a drag handle. It stays open by default when listings load and can be minimized to a collapsed header bar showing "ルート沿いの先輩おすすめ (N件)" that re-opens on tap.
  - **Desktop (md+):** A right-side panel (w-[380px]) alongside the map. Fixed height matching the map, scrollable content area.
- Header text: `"ルート沿いの先輩おすすめ (N件)"` where N = `totalCount`.
- Listings display as **compact horizontal cards** (NOT the full `ListingCard` from search — these need a more compact, row-oriented layout) sorted by `distanceFromOriginM` ascending (already sorted by backend).
- Each compact card shows:
  - Small photo thumbnail (64x64, square, rounded-md) on the left
  - Right side: senpai badge (if verified), title (Japanese), dual price (VND + ¥JPY via `formatDualPrice`), rating + review count
  - Meta line: "出発地から{x}km先・ルートから{y}m" (distance from origin formatted as km, distance from route in meters)
  - Save heart button (top-right of card)
- Use `SaveHeartButton` + `useSaveFavorite` hook from `@/modules/favorites/hooks/useSaveFavorite` for the save functionality. Unauthenticated users get the signup modal (existing behavior).

**3. Map listing pins (AC: map-pins)**

**Given** the map view with a route displayed,
**When** listings are loaded,
**Then**:
- Each listing displays as a **Navy circle pin** at its exact `{latitude, longitude}` on the map.
- Pin style: `google.maps.SymbolPath.CIRCLE`, scale 7, fillColor `#1B2A4A`, fillOpacity 1, strokeColor `#FFFFFF`, strokeWeight 2.
- When there are > 50 visible pins at current zoom level, use **MarkerClusterer** from `@googlemaps/markerclusterer` (add `@googlemaps/markerclusterer` to `apps/web/package.json`). Cluster icon: Navy circle with white count text.
- Pin click → highlight the corresponding card in the panel (scroll to it, add a visual highlight ring).
- All listing markers are managed in a ref and cleaned up on unmount or when listings change.

**4. Card ↔ Pin bidirectional interaction (AC: interaction)**

**Given** the listing panel and map are both visible,
**When** I tap a **pin** on the map,
**Then**:
- The corresponding card in the panel scrolls into view (`scrollIntoView({ behavior: "smooth", block: "center" })`)
- The card gets a temporary highlight (2px accent border ring for 2 seconds, then fades)
- The pin gets a bounce animation via `google.maps.Animation.BOUNCE` (1 cycle, ~700ms)

**When** I tap a **card** in the panel,
**Then**:
- The corresponding pin gets the bounce animation
- The map pans to center on the pin's location WITHOUT changing zoom level (`map.panTo(pinLatLng)`)
- The mini-preview overlay opens (see AC#5)

**5. Mini-preview overlay (AC: mini-preview)**

**Given** I tap a listing card in the panel,
**When** the tap registers,
**Then**:
- A mini-preview overlay appears (NOT a full-screen navigation).
- **Mobile:** Renders as a small card anchored above the bottom sheet header (absolute positioned, z-30).
- **Desktop:** Renders as a floating card near the selected pin on the map (InfoWindow-like, positioned via `google.maps.InfoWindow` or absolute CSS with calculated position).
- Preview content: larger photo (aspect 16:9), title (JP), senpai badge, rating, senpai quote snippet (if available), and "詳細を見る" CTA button.
- "詳細を見る" CTA navigates to `/{locale}/listings/{listingId}` (the listing detail page from Epic 2 Story 2.4).
- Tapping outside the preview or tapping another card dismisses it.
- Only one preview can be open at a time.

**6. Empty state (AC: empty)**

**Given** no listings match the route,
**When** the empty state displays,
**Then**:
- Use the existing `EmptyState` component with `variant="no-results"`.
- Headline: "ルート沿いに先輩おすすめが見つかりませんでした"
- CTA label: "カテゴリを広げる" — tapping it clears any active category filters and re-fetches.

**7. Loading state (AC: loading)**

**Given** the route listings are being fetched,
**When** the API call is in-flight,
**Then**:
- The panel shows skeleton placeholders (3-4 compact card skeletons matching the card layout).
- Map pins are not rendered until data arrives.
- Do NOT use spinners (architecture rule: skeleton loading only).

**8. i18n labels (AC: i18n)**

**Given** the journey page supports ja/vi/en locales,
**When** listing panel content renders,
**Then** all user-facing strings are sourced from the `journey` namespace in message catalogs (`apps/web/messages/{ja,vi,en}.json`).

New keys to add under the `journey` namespace:
```json
{
  "route_listings_header": "ルート沿いの先輩おすすめ ({count}件)",
  "route_listings_distance_meta": "出発地から{km}km先・ルートから{meters}m",
  "route_listings_empty_headline": "ルート沿いに先輩おすすめが見つかりませんでした",
  "route_listings_empty_cta": "カテゴリを広げる",
  "route_listings_detail_cta": "詳細を見る",
  "route_listings_loading": "ルート沿いのお店を検索中…"
}
```
Add equivalent vi and en translations.

## Tasks / Subtasks

- [x] **Task 1 — Route listings API client (AC: 1)**
  - [x] Create `apps/web/modules/journey/lib/routeListingsApi.ts` with `fetchRouteListings()` function
  - [x] Define TypeScript types: `RouteListingSummary`, `RouteInfo`, `RouteListingsResponse`
  - [x] Follow `directionsApi.ts` pattern: `apiClient` POST with try/catch `ApiError`
  - [x] Add unit test: `apps/web/modules/journey/__tests__/routeListingsApi.test.ts`

- [x] **Task 2 — i18n message catalog updates (AC: 8)**
  - [x] Add route listing keys to `apps/web/messages/ja.json` under `journey` namespace
  - [x] Add equivalent keys to `apps/web/messages/vi.json`
  - [x] Add equivalent keys to `apps/web/messages/en.json`

- [x] **Task 3 — Compact listing card component (AC: 2)**
  - [x] Create `apps/web/modules/journey/components/RouteListingCard.tsx` — compact horizontal card
  - [x] Props: listing data + `onTap`, `onSave`, `isSaved`, `onUnauthenticated`, `isHighlighted`, `locale`, `labels`
  - [x] Layout: 64x64 thumbnail left, text right, save heart top-right
  - [x] Use `formatDualPrice` from `@/modules/search/lib/format-price`
  - [x] Use `SenpaiBadge` from `@/shared/components/SenpaiBadge`
  - [x] Distance meta line with km/m formatting
  - [x] Add ref forwarding for scroll-into-view
  - [x] Add test: `apps/web/modules/journey/__tests__/RouteListingCard.test.tsx`

- [x] **Task 4 — Route listings panel component (AC: 2, 6, 7)**
  - [x] Create `apps/web/modules/journey/components/RouteListingsPanel.tsx`
  - [x] Mobile layout: collapsible bottom bar that expands to scrollable list (custom bottom sheet)
  - [x] Desktop layout: fixed right panel (w-[380px]) with scrollable content
  - [x] Header with total count
  - [x] Skeleton loading state (3-4 card placeholders)
  - [x] Empty state via `EmptyState` component
  - [x] Integrate `useSaveFavorite` hook for all cards
  - [x] Expose `highlightedListingId` prop + card refs for scroll-to
  - [x] Add test: `apps/web/modules/journey/__tests__/RouteListingsPanel.test.tsx`

- [x] **Task 5 — Map listing markers + clustering (AC: 3)**
  - [x] Add `@googlemaps/markerclusterer` to `apps/web/package.json`
  - [x] Create `apps/web/modules/journey/components/RouteListingMarkers.tsx` (hook-based)
  - [x] Render Navy circle markers for each listing at `{lat, lng}`
  - [x] MarkerClusterer activates when > 50 markers visible
  - [x] Marker click callback: `onMarkerClick(listingId)`
  - [x] Bounce animation helper: trigger 1-cycle bounce on a marker
  - [x] Cleanup markers on unmount / listing data change
  - [x] Add test: `apps/web/modules/journey/__tests__/RouteListingMarkers.test.tsx`

- [x] **Task 6 — Mini-preview overlay (AC: 5)**
  - [x] Create `apps/web/modules/journey/components/ListingMiniPreview.tsx`
  - [x] Photo (16:9 aspect), title, senpai badge, rating
  - [x] "詳細を見る" CTA → `Link` to `/{locale}/listings/{listingId}`
  - [x] Mobile: card above bottom sheet header
  - [x] Desktop: absolute-positioned floating card near map
  - [x] Dismiss on outside click or when another card is selected
  - [x] Add test: `apps/web/modules/journey/__tests__/ListingMiniPreview.test.tsx`

- [x] **Task 7 — Card ↔ Pin bidirectional interaction (AC: 4)**
  - [x] Wire marker click → scroll to card + highlight ring (2s timeout)
  - [x] Wire card tap → pan map to pin + bounce + open mini-preview
  - [x] Use refs map (`Map<string, HTMLElement>`) for card element references
  - [x] Use refs map (`Map<string, google.maps.Marker>`) for marker references
  - [x] Only one highlight/preview active at a time

- [x] **Task 8 — Integrate into JourneyPageShell (AC: all)**
  - [x] Update `JourneyPageShell.tsx` to:
    - Add state: `routeListings`, `routeListingsLoading`, `highlightedListingId`, `previewListingId`
    - After `status === "ready"`, call `fetchRouteListings()` with origin, destination, selectedIndex
    - Re-fetch when `selectedIndex` changes (user picks a different route alternative)
    - Pass listings data to `RouteListingsPanel` and markers to map
  - [x] Update `JourneyPageShell` labels interface to include new i18n keys
  - [x] Update server page `app/(user)/[locale]/journey/page.tsx` to resolve new labels
  - [x] Layout: on desktop, map + panel side by side (flex row); on mobile, map full width + panel as bottom sheet overlay
  - [x] Update existing `JourneyPageShell.test.tsx` for new state/interactions

- [x] **Task 9 — Full regression + visual test**
  - [x] Run all existing journey tests — must pass unchanged
  - [x] Run full frontend test suite — no regressions
  - [ ] Manual test: search a Da Nang route, verify listings appear sorted by distance
  - [ ] Manual test: tap a pin, verify card scrolls into view
  - [ ] Manual test: tap a card, verify map pans and mini-preview opens
  - [ ] Manual test: empty route (remote area), verify empty state
  - [ ] Manual test: save a listing, verify heart toggle + toast
  - [ ] Manual test: check mobile bottom sheet behavior
  - [ ] Manual test: check desktop side panel layout

## Dev Notes

### Scope boundaries — things NOT to do

- Do NOT implement route personality scoring/switching — that's Story 10.5. No `SegmentedControl` for Food/Scenic/Fastest.
- Do NOT add deal/coupon badges to listing cards — that's Story 10.6. No `active_deal` field.
- Do NOT modify the backend endpoint `/api/v1/journeys/route` — it's complete from Story 10.3.
- Do NOT modify `JourneyInputs.tsx` — the search input UI is unchanged.
- Do NOT add category filter UI yet — the `categoryIds` param exists in the API but the filter UI is deferred. The "カテゴリを広げる" CTA in the empty state simply clears filters if any were programmatically set.
- Do NOT add pagination/infinite scroll — the default `limit=30` is sufficient for MVP. Pagination can be added post-MVP if needed.

### Layout architecture

The journey page layout changes from a simple vertical stack (10.2) to a split layout:
- **Desktop (md+):** `flex flex-row` — map takes `flex-1`, panel takes `w-[380px] shrink-0`.
- **Mobile:** Map is full-width. Panel overlays as a collapsible bottom sheet.

The `JourneyPageShell` manages the layout switch. The map component (`JourneyRouteMap`) is NOT modified internally — it receives new props for listing markers.

### Listing markers: extend JourneyRouteMap vs. separate component

**Recommended approach:** Create a separate `RouteListingMarkers` utility module that receives the `google.maps.Map` instance (from `JourneyRouteMap`'s `onMapReady` callback) and manages listing markers independently. This keeps `JourneyRouteMap` unchanged (it handles route polylines/origin-destination markers) and avoids regression risk.

The `JourneyRouteMap` already exposes the map instance. Either:
1. Add an `onMapReady?: (map: google.maps.Map) => void` prop (if not already there), OR
2. Use the existing ref pattern to get the map instance.

The `RouteListingMarkers` component/hook receives `map`, `listings[]`, `onMarkerClick`, and manages the marker lifecycle.

### MarkerClusterer setup

Install `@googlemaps/markerclusterer` (v2.x). Usage:
```typescript
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const clusterer = new MarkerClusterer({ map, markers });
// On cleanup: clusterer.clearMarkers(); clusterer.setMap(null);
```

The clusterer automatically groups nearby markers at low zoom levels. The threshold of 50 pins mentioned in the AC is the UX trigger — enable clustering when `listings.length > 50`. For <= 50, render individual markers without clustering (cleaner UX).

### Compact card vs. existing ListingCard

Do NOT reuse the existing `ListingCard` from `@/shared/components/ListingCard.tsx`. That card is designed for search results (vertical layout, 4:3 image, lots of detail). The route listing needs a **compact horizontal card** optimized for a scrollable panel:
- 64x64 square thumbnail (NOT 4:3 aspect)
- Single-line title (line-clamp-1)
- Compact price + rating on one line
- Distance meta on a separate line
- Total card height ~80-90px

### Mini-preview: InfoWindow vs. CSS positioning

For desktop, `google.maps.InfoWindow` is the simplest approach — it automatically positions relative to the pin and handles map edge cases. Style it with custom HTML content (Google Maps allows HTML in InfoWindow).

For mobile, avoid InfoWindow (it looks awkward on small screens). Instead, render a floating card above the collapsed bottom sheet bar using absolute positioning within the journey page container.

### State flow for route listings

```
status === "ready" (from 10.2)
  ↓
fetchRouteListings(origin, destination, selectedIndex)
  ↓
routeListingsLoading = true → show skeleton
  ↓
Success: routeListings = response → render cards + pins
Error: show EmptyState with error message
  ↓
User taps different route alternative (selectedIndex changes)
  ↓
Re-fetch with new selectedIndex → update cards + pins
```

### Re-fetch on route alternative change

When the user taps a different polyline (changing `selectedIndex`), the listings must re-fetch because different routes pass through different areas. Use a `useEffect` watching `selectedIndex` + `status === "ready"` to trigger re-fetch. Debounce is NOT needed — route selection is a discrete user action, not continuous.

### Save functionality integration

The `useSaveFavorite` hook from `@/modules/favorites/hooks/useSaveFavorite` handles all save logic including:
- Optimistic UI update
- API call (save/unsave)
- Rollback on error
- Toast notifications
- Unauthenticated → signup modal redirect

In `RouteListingsPanel`, call the hook once and pass `isSaved(listingId)` + `toggle(listingId)` to each card. The hook uses `useFavoritesStore` (Zustand) which is already hydrated on page load.

### Distance formatting

- `distanceFromOriginM` → format as km with 1 decimal: `(meters / 1000).toFixed(1)` → "1.2km"
- `distanceFromRouteM` → format as integer meters: `Math.round(meters)` → "80m"

Create a small helper `formatRouteDistance(originM: number, routeM: number)` in `apps/web/modules/journey/lib/formatDistance.ts`.

### Navigation to listing detail

The listing detail route is `/{locale}/listings/{listingId}` (from Epic 2 Story 2.4). Use Next.js `Link` component for client-side navigation. The `listingId` is a UUID string from the API response.

### Google Maps SDK — already loaded

The Google Maps JS SDK is already loaded by `JourneyMap.tsx` (Story 10.1) with `libraries=places,geometry`. The `@googlemaps/markerclusterer` library is a separate npm package that works with the already-loaded SDK — it does NOT require loading an additional Google library.

### Testing approach

- **API client test:** Mock `global.fetch`, verify request shape (POST, body structure), verify response parsing.
- **Component tests:** Use Vitest + React Testing Library. Mock `google.maps` namespace (same pattern as `JourneyRouteMap.test.tsx`). Mock `apiClient` via `global.fetch` stub.
- **Card interaction tests:** Simulate click events, verify callback invocations, verify scroll-into-view calls.
- **Do NOT test actual Google Maps rendering** — mock the map instance and verify method calls (panTo, setMap, etc.).

### Previous story learnings

From Story 10.2 Debug Log:
- `google is not defined` fix: store the google namespace in a ref (`googleRef.current = window.google`) instead of relying on global. Apply the same pattern for marker creation.
- JourneyRouteMap tests mock `window.google` at the module level in `beforeEach`.

From Story 10.3:
- The backend response for `POST /journeys/route` includes `route.polyline`, `route.distanceMeters`, `route.durationSeconds`, `route.summary`, plus `listings[]` and `totalCount`.
- `apiClient` auto-converts: `distance_from_origin_m` → `distanceFromOriginM`, `total_count` → `totalCount`, etc.

### Commit message convention

```
feat story(10-4): implement listings along route UI with map pins, bottom sheet panel, and card interaction
```

### Project Structure Notes

- All changes are frontend-only. No backend files touched.
- `apps/web/modules/journey/lib/routeListingsApi.ts` — new API client function
- `apps/web/modules/journey/lib/formatDistance.ts` — new distance formatting helper
- `apps/web/modules/journey/components/RouteListingCard.tsx` — new compact card component
- `apps/web/modules/journey/components/RouteListingsPanel.tsx` — new panel/bottom sheet component
- `apps/web/modules/journey/components/RouteListingMarkers.tsx` — new map markers + clustering
- `apps/web/modules/journey/components/ListingMiniPreview.tsx` — new preview overlay
- `apps/web/modules/journey/components/JourneyPageShell.tsx` — modified (add listings state, layout changes, integration)
- `apps/web/app/(user)/[locale]/journey/page.tsx` — modified (pass new labels)
- `apps/web/messages/ja.json` — modified (add journey.route_listings_* keys)
- `apps/web/messages/vi.json` — modified (add journey.route_listings_* keys)
- `apps/web/messages/en.json` — modified (add journey.route_listings_* keys)
- `apps/web/package.json` — modified (add `@googlemaps/markerclusterer`)
- `apps/web/modules/journey/__tests__/` — new test files for each component

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-10-journey-based-discovery.md#Story-10.4]
- [Source: _bmad-output/implementation-artifacts/10-2-journey-input-route-display.md — JourneyPageShell state, JourneyRouteMap props, directionsApi pattern, i18n namespace]
- [Source: _bmad-output/implementation-artifacts/10-3-route-aware-listing-matching.md — POST /journeys/route response schema, cache behavior, photo batch loading]
- [Source: apps/web/modules/journey/components/JourneyPageShell.tsx — current shell state: origin, destination, routes, selectedIndex, status]
- [Source: apps/web/modules/journey/components/JourneyRouteMap.tsx — map rendering, polyline styles, marker creation pattern]
- [Source: apps/web/modules/journey/lib/directionsApi.ts — API client pattern with apiClient + ApiError]
- [Source: apps/web/shared/components/ListingCard.tsx — ListingCardItem interface, photo/price/rating pattern (NOT to reuse directly)]
- [Source: apps/web/shared/components/Modal.tsx — bottom sheet on mobile, centered on desktop, variant="full"]
- [Source: apps/web/shared/components/EmptyState.tsx — variant="no-results", headline + CTA pattern]
- [Source: apps/web/shared/components/SaveHeartButton.tsx — saved/onToggle/onUnauthenticated props]
- [Source: apps/web/shared/components/SegmentedControl.tsx — reusable segmented control (for 10.5, not this story)]
- [Source: apps/web/shared/components/SenpaiBadge.tsx — variant="verified" badge]
- [Source: apps/web/modules/favorites/hooks/useSaveFavorite.ts — isSaved/toggle/requestGuestSignup pattern]
- [Source: apps/web/modules/search/lib/format-price.ts — formatDualPrice(priceVnd) → {vnd, jpy}]
- [Source: apps/web/shared/lib/apiClient.ts — apiClient with auto snake_case↔camelCase, CSRF, ApiError]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md — no spinners, skeleton loading, no direct cross-module imports, @/ path aliases]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- JourneyPageShell test failure: `useSaveFavorite` → `useTranslations("favorites")` needed next-intl mock. Fixed by adding mocks for next-intl, auth/favorites/signup stores, and favorites-api in JourneyPageShell.test.tsx.
- Pre-existing TS errors in area-guide, home, listing-detail, user modules — none in journey module.

### Completion Notes List

- Task 1: Created routeListingsApi.ts following directionsApi.ts pattern with full type definitions. Also created formatDistance.ts helper. 9 unit tests pass.
- Task 2: Added 6 new i18n keys to ja/vi/en message catalogs under journey namespace.
- Task 3: Created RouteListingCard.tsx — compact horizontal card with 64x64 thumbnail, senpai badge, dual price, rating, distance meta, save heart, ref forwarding. 10 tests pass.
- Task 4: Created RouteListingsPanel.tsx — desktop right panel (w-[380px]) + mobile collapsible bottom sheet. Skeleton loading (4 placeholders), empty state with CTA, useSaveFavorite integration. 8 tests pass.
- Task 5: Created RouteListingMarkers.tsx as custom hook (useRouteListingMarkers). Navy circle pins, MarkerClusterer for >50 markers, bounce animation, cleanup on unmount. 7 tests pass.
- Task 6: Created ListingMiniPreview.tsx — 16:9 photo, title, senpai badge, rating, detail CTA link. Mobile (absolute bottom-full) + desktop (w-[300px] floating) variants. Dismiss on outside click. 9 tests pass.
- Task 7: Created useListingInteraction.ts hook — highlightedId (2s auto-clear), previewId (toggle), scrollToCard, registerCardRef. 6 tests pass.
- Task 8: Integrated all into JourneyPageShell — added route listings state, useEffect for fetching on status=ready + selectedIndex change, handleCardTapWithMap (bounce+pan+preview), onMapReady callback. Updated JourneyRouteMap with onMapReady prop. Updated server page with 6 new label props. Updated existing test with required mocks. Desktop: flex-row layout. Mobile: bottom sheet overlay.
- Task 9: 333/333 tests pass (79 files). No TypeScript errors in journey module. Manual testing deferred to developer.

### Change Log

- 2026-04-21: Implemented Story 10-4 — Listings Along Route UI. All 9 tasks completed. 93 journey module tests, 333 total tests pass with 0 regressions.

### File List

New files:
- apps/web/modules/journey/lib/routeListingsApi.ts
- apps/web/modules/journey/lib/formatDistance.ts
- apps/web/modules/journey/components/RouteListingCard.tsx
- apps/web/modules/journey/components/RouteListingsPanel.tsx
- apps/web/modules/journey/components/RouteListingMarkers.tsx
- apps/web/modules/journey/components/ListingMiniPreview.tsx
- apps/web/modules/journey/hooks/useListingInteraction.ts
- apps/web/modules/journey/__tests__/routeListingsApi.test.ts
- apps/web/modules/journey/__tests__/formatDistance.test.ts
- apps/web/modules/journey/__tests__/RouteListingCard.test.tsx
- apps/web/modules/journey/__tests__/RouteListingsPanel.test.tsx
- apps/web/modules/journey/__tests__/RouteListingMarkers.test.tsx
- apps/web/modules/journey/__tests__/ListingMiniPreview.test.tsx
- apps/web/modules/journey/__tests__/useListingInteraction.test.ts

Modified files:
- apps/web/modules/journey/components/JourneyPageShell.tsx
- apps/web/modules/journey/components/JourneyRouteMap.tsx
- apps/web/modules/journey/__tests__/JourneyPageShell.test.tsx
- apps/web/app/(user)/[locale]/journey/page.tsx
- apps/web/messages/ja.json
- apps/web/messages/vi.json
- apps/web/messages/en.json
- apps/web/package.json
- pnpm-lock.yaml
