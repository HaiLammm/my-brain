# Story 10.2: Journey Input & Route Display

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese user planning a trip in Da Nang,
I want to type (or tap) my origin and destination on a new `/[locale]/journey` page, optionally use my current location, and see up to 3 alternative routes drawn on an interactive Google Map with duration/distance labels — with deep-link support via `?from=LAT,LNG&to=LAT,LNG`, bounding-box validation, an empty state when no route is found, and the ability to tap an alternative polyline to promote it as primary,
so that before deciding where to go I can visually compare the routes between two Da Nang points, share the same view with a friend via URL, and feel confident DaNangNavi is a navigation-capable local guide — all powered by the Redis-cached Directions proxy and singleton Maps SDK loader that Story 10.1 already shipped, with no changes to the backend `journey/` module.

## Acceptance Criteria

**1. Route, SSR shell, SEO & i18n (AC: page scaffolding)**

**Given** the Next.js App Router under `apps/web/app/(user)/[locale]/`,
**When** a new folder `journey/` with `page.tsx` is added,
**Then**:
- Path resolves to `/ja/journey`, `/vi/journey`, `/en/journey`. Story epic text refers to `/ja/journey`; the three-locale form is the correct generalisation (matches every other route under `app/(user)/[locale]/`). Hitting a locale not in `routing.locales` falls through to the existing `notFound()` handler inherited from `app/(user)/[locale]/layout.tsx`.
- The page is a **Server Component** (`page.tsx` — no `"use client"`). It uses `export const dynamic = "force-dynamic"` because the initial render depends on `searchParams` (`?from=...&to=...`). Matches the pattern in `app/(user)/[locale]/deals/page.tsx:15`.
- The page exports `generateMetadata({ params, searchParams })` that resolves `locale`, loads `next-intl` translations via `getTranslations({ locale, namespace: "journey" })`, and returns:
  - `title: t("meta.title")` — Japanese default: `"ルート検索 | DaNangNavi"`.
  - `description: t("meta.description")` — Japanese: `"ダナン市内の目的地まで、先輩おすすめのスポットを通るルートを検索できます。"`.
  - `robots: { index: true, follow: true }` — public route.
  - `alternates: { canonical: "/{locale}/journey" }`. FR59 compliance (SSR Japanese meta tags).
- `page.tsx` reads `searchParams` (type `Promise<{ from?: string; to?: string }>` per the App Router convention; `await` before use), parses `from`/`to` via a shared helper `parseLatLngParam(raw): { lat, lng } | null` (new helper in `apps/web/modules/journey/lib/latLngQuery.ts` — see AC#5), and passes the parsed values to the client shell as props (`initialOrigin`, `initialDestination`). Unparseable or out-of-bounds values are dropped to `undefined` server-side (never throw; the client simply boots empty).
- `page.tsx` then renders `<JourneyPageShell locale={locale} initialOrigin={...} initialDestination={...} labels={{...}} />` — a single client component (see AC#3). All user-facing strings are pre-resolved via `getTranslations` and passed down as a `labels` prop so the tree below the shell stays translation-aware without re-calling `next-intl` from client code (matches the labels-prop pattern used by `DealsIndex` in `app/(user)/[locale]/deals/page.tsx:142-165`).

**2. Next-intl message catalog — `journey` namespace (AC: i18n keys)**

**Given** the existing message files `apps/web/messages/{ja,vi,en}.json`,
**When** a new top-level `journey` key is added to each,
**Then** the following keys MUST exist across all three locales (identical keys, locale-specific copy):
```json
"journey": {
  "meta": { "title": "…", "description": "…" },
  "page_title": "ルート検索 / Tìm lộ trình / Find a route",
  "origin_label": "出発地 / Điểm đi / From",
  "origin_placeholder": "住所やスポット名 / Nhập địa điểm / Address or place",
  "destination_label": "目的地 / Điểm đến / To",
  "destination_placeholder": "住所やスポット名 / Nhập địa điểm / Address or place",
  "use_current_location": "現在地を使う / Dùng vị trí hiện tại / Use current location",
  "search_cta": "ルート検索 / Tìm lộ trình / Search route",
  "searching": "ルート検索中… / Đang tìm lộ trình… / Searching…",
  "route_summary_duration": "{minutes}分 / {minutes} phút / {minutes} min",
  "route_summary_distance_km": "{km}km / {km} km / {km} km",
  "error_out_of_bounds": "ダナン市内の場所を指定してください / Vui lòng chọn địa điểm trong Đà Nẵng / Please choose a location within Da Nang",
  "error_no_route": "ルートが見つかりませんでした / Không tìm thấy lộ trình / No route found",
  "error_no_route_hint": "入力をご確認ください / Hãy kiểm tra lại địa chỉ / Please check the addresses",
  "error_directions_unavailable": "ルート情報を取得できませんでした。しばらくしてから再度お試しください。 / Không lấy được lộ trình. Vui lòng thử lại. / Could not load directions. Please try again shortly.",
  "error_geolocation_denied": "現在地を取得できませんでした / Không lấy được vị trí hiện tại / Could not read your current location",
  "map_error_headline": "地図を読み込めませんでした / Không tải được bản đồ / Could not load the map",
  "map_error_body": "もう一度お試しください / Vui lòng thử lại / Please try again",
  "route_alt_badge": "候補ルート / Lộ trình khác / Alternative route",
  "route_primary_badge": "選択中 / Đang chọn / Selected"
}
```
Copy rules:
- Keep Japanese canonical — copy above is the JP default; `vi.json` and `en.json` use the localized strings indicated.
- Placeholder strings use ICU-style `{minutes}` / `{km}` so `t("route_summary_duration", { minutes: 12 })` works with next-intl without custom formatters.
- Route labels are **both** duration AND distance (epic AC: `"12分"` and `"3.2km"`) — the component composes them via two separate `t()` calls to keep copy atomic per language.

**3. Client shell component — `<JourneyPageShell>` (AC: state orchestration)**

**Given** the server page from AC#1,
**When** `apps/web/modules/journey/components/JourneyPageShell.tsx` is created,
**Then** it is a `"use client"` component that:
- Accepts props:
  ```ts
  export interface JourneyPageShellProps {
    locale: "ja" | "vi" | "en";
    initialOrigin?: { lat: number; lng: number };
    initialDestination?: { lat: number; lng: number };
    labels: {
      pageTitle: string;
      originLabel: string;
      originPlaceholder: string;
      destinationLabel: string;
      destinationPlaceholder: string;
      useCurrentLocation: string;
      searchCta: string;
      searching: string;
      errorOutOfBounds: string;
      errorNoRoute: string;
      errorNoRouteHint: string;
      errorDirectionsUnavailable: string;
      errorGeolocationDenied: string;
      mapErrorHeadline: string;
      mapErrorBody: string;
      routeAltBadge: string;
      routePrimaryBadge: string;
      durationTemplate: string;          // "{minutes}分" or ICU raw; helper formats below
      distanceTemplate: string;          // "{km}km"
    };
  }
  ```
  The two `*Template` strings are the raw ICU templates from `ja.json`; the component runs them through a tiny helper `formatTemplate(tpl, vars): string` (create alongside shell — NOT a runtime `next-intl` call; server-side `t()` already resolved everything else).
- Owns the following React state via `useState`:
  - `origin: { lat, lng; label?: string } | null` (initialised from `initialOrigin`)
  - `destination: { lat, lng; label?: string } | null`
  - `routes: RouteAlternative[]` (from directions response)
  - `selectedIndex: number` (defaults to 0)
  - `status: "idle" | "searching" | "ready" | "no-route" | "out-of-bounds" | "directions-error"`
  - `error: string | null` (localized copy when `status` is an error variant)
- On mount, if both `initialOrigin` AND `initialDestination` are present, it kicks off the search immediately (deep-link support — AC#7). Otherwise `status` starts `"idle"`.
- When the user submits via the CTA or programmatically, it:
  1. Validates both endpoints against `DANANG_BOUNDING_BOX` (AC#6). If either is out-of-bounds → `status="out-of-bounds"`, render error below the inputs.
  2. Calls `fetchDirections({origin, destination, alternatives: true})` (AC#8). Sets `status="searching"` during the call.
  3. On success with ≥1 route → sets `routes`, `selectedIndex=0`, `status="ready"`.
  4. On success with 0 routes → `status="no-route"`.
  5. On `DIRECTIONS_UNAVAILABLE` (HTTP 502 with that error code) → `status="directions-error"`, show `labels.errorDirectionsUnavailable`.
  6. On any other unexpected error (network, 5xx, 4xx) → same `"directions-error"` treatment, plus `console.error` for dev visibility. **Do not leak raw error messages** — always render the localized `errorDirectionsUnavailable` copy.
- When the user taps an alternative polyline (see AC#4 map behavior), shell receives an `onSelectRoute(index: number)` callback and sets `selectedIndex` — purely client-side, no refetch.
- URL sync (deep-link round-trip): whenever `status === "ready"` AND both origin+destination are set, the shell uses `router.replace(\`/${locale}/journey?from=${lat.toFixed(5)},${lng.toFixed(5)}&to=${...}\`, { scroll: false })` (via `useRouter` from `next/navigation`) to keep the URL sharable. Rounding to 5 decimals matches Story 10.1's cache-key precision (see `_bmad-output/implementation-artifacts/10-1-google-maps-integration-route-api-foundation.md` AC#6, line 176-182) — same lat/lng on reload → same cache key → instant response. Skip the `router.replace` if current URL already matches (prevents ping-pong on mount).
- Composes layout:
  ```
  <main>
    <h1>{labels.pageTitle}</h1>            (SR-only per ListingDetail/Deals pattern)
    <JourneyInputs ... />                  (AC#5)
    <JourneyRouteMap ... />                (AC#4)
    {statusIsError && <p role="alert">{error}</p>}
  </main>
  ```

**4. `<JourneyRouteMap>` — extended map with route polylines & markers (AC: map behavior)**

**Given** the `<JourneyMap>` shipped by Story 10.1 (`apps/web/modules/journey/components/JourneyMap.tsx`) is a minimal map canvas that does not yet render routes,
**When** this story lands,
**Then** create a **new** component `apps/web/modules/journey/components/JourneyRouteMap.tsx` rather than mutating `JourneyMap.tsx`. Rationale: `JourneyMap` stays as the pure "map canvas + loading/error states" primitive; `JourneyRouteMap` composes on top of it by reaching into the map instance via a ref callback. Keeping them separate means Story 10.3+ can reuse `JourneyMap` standalone (e.g., a map-only preview embed) and we avoid breaking the existing Story 10.1 tests.

Extend `JourneyMap.tsx` with a minimal escape hatch only:
- Add optional prop `onMapReady?: (map: google.maps.Map) => void`. Fire it inside the existing `useEffect` immediately after `new google.maps.Map(...)` succeeds (right before `setStatus("ready")`). Keep all other behavior untouched — the three existing JourneyMap tests (`modules/journey/__tests__/JourneyMap.test.tsx`) must still pass unchanged.

`JourneyRouteMap.tsx` contract:
```tsx
"use client";
export interface JourneyRouteMapProps {
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  routes: RouteAlternative[];          // from @/modules/journey/lib/types
  selectedIndex: number;
  onSelectRoute: (index: number) => void;
  mapErrorHeadline: string;
  mapErrorBody: string;
  className?: string;
}
```
Behavior:
- Internal `mapRef = useRef<google.maps.Map | null>(null)`. Receives it via `<JourneyMap onMapReady={(m) => { mapRef.current = m; forceRerender(); }} .../>`. Use a dummy state bump (`setTick(x => x+1)`) to trigger the post-mount effects below.
- Markers: when both `origin` and `destination` are set, render two `google.maps.Marker` instances (origin labelled 'A', destination 'B'). Old markers removed/`setMap(null)` before creating replacements on prop change. Use `google.maps.SymbolPath.CIRCLE` with the Navy primary color (`#1B2A4A`, matches `--color-primary` in `apps/web/app/globals.css:5`).
- Polylines: for each `route` in `routes`, instantiate a `new google.maps.Polyline({ path: google.maps.geometry.encoding.decodePath(route.polyline), strokeColor, strokeWeight, strokeOpacity, zIndex })` where:
  - Selected route (`index === selectedIndex`) → `strokeColor="#1B2A4A"` (Navy primary), `strokeWeight=6`, `strokeOpacity=1.0`, `zIndex=10`.
  - Alternative routes → `strokeColor="#9CA3AF"` (light gray, Tailwind `neutral-400` equivalent), `strokeWeight=4`, `strokeOpacity=0.7`, `zIndex=5`.
  - `map: mapRef.current`.
- Interactivity: attach `polyline.addListener("click", () => onSelectRoute(i))`. Tapping an alternative swaps colors (because `selectedIndex` changes → React re-computes the next render and re-instantiates polylines with inverted styles). Swap must be **instant** — do NOT animate; visible flash on re-instantiation is acceptable. A future enhancement can swap `setOptions({ strokeColor })` in place instead of destroy/recreate, but for MVP the simpler approach is correct.
- Auto-fit bounds: whenever `origin`, `destination`, or `routes[selectedIndex]` changes, compute `const bounds = new google.maps.LatLngBounds(); bounds.extend(origin); bounds.extend(destination); selected.decodedPath.forEach(p => bounds.extend(p)); mapRef.current.fitBounds(bounds, { top: 80, right: 40, bottom: 200, left: 40 })`. Bottom padding 200 reserves space for the eventual Story 10.4 bottom sheet; this is fine now because the sheet doesn't exist yet but the padding keeps polylines visually clear of the screen bottom.
- Cleanup on unmount: `polylinesRef.current.forEach(p => p.setMap(null))`, same for markers, to prevent ghost overlays if shell remounts.
- Error fallback: if `<JourneyMap>` enters its own `status="error"` (SDK failed to load — AC of 10.1), `JourneyRouteMap` simply renders `<JourneyMap>` with its error props; it does NOT attempt to show polylines outside the map.
- Route summary labels: for each `route`, render an absolutely-positioned `<RouteLabel>` chip anchored to the polyline's midpoint. Computed via `const midpoint = decodedPath[Math.floor(decodedPath.length / 2)]`, then projected into screen coordinates via `map.getProjection()` + `OverlayView` OR — simpler MVP approach — render the summary labels in a **stacked list in a small top-right card** on top of the map showing `[A] 12分 / 3.2km` (primary) and grayed alternatives, each tappable to swap selection. Choose the **top-right card** approach for 10.2. Rationale: `OverlayView` projection math is error-prone and its behavior on mobile at low zoom is poor; a card list covers the AC ("each route shows a label: duration and distance") without the cost and is consistent with DaNangNavi's existing info-card aesthetic. A polyline-anchored tooltip is deferred to post-MVP.

**5. `<JourneyInputs>` — Places-Autocomplete inputs + geolocation (AC: input UX)**

**Given** the Google Maps JS SDK loaded with `libraries=places` by Story 10.1's `loadGoogleMapsSdk`,
**When** `apps/web/modules/journey/components/JourneyInputs.tsx` is created,
**Then**:
- Two `<input>` fields for origin and destination, both wired to **`new google.maps.places.Autocomplete(el, options)`** (the classic Autocomplete widget — NOT `PlaceAutocompleteElement`, for two reasons: (a) the `places` library loaded in 10.1 already supports the classic widget, (b) the new element is still shipping behind a separate library import `&libraries=places&v=weekly` with breaking API changes as of 2026-Q1 — stick with the stable widget for MVP). `AutocompleteOptions`:
  ```ts
  {
    bounds: new google.maps.LatLngBounds(
      { lat: 15.95, lng: 108.10 },  // south-west
      { lat: 16.15, lng: 108.35 }   // north-east
    ),
    strictBounds: true,             // UX-DR: never suggest places outside Da Nang
    componentRestrictions: { country: "vn" },
    fields: ["geometry.location", "name", "formatted_address", "place_id"],
    types: ["establishment", "geocode"], // both POIs and addresses
  }
  ```
  The bbox literal values above MUST match `backend/modules/journey/constants.py::DANANG_BOUNDING_BOX` — do NOT re-type them; import from a shared constants module `apps/web/modules/journey/lib/constants.ts` that exports:
  ```ts
  export const DANANG_BOUNDING_BOX = {
    north: 16.15,
    south: 15.95,
    east: 108.35,
    west: 108.10,
  } as const;
  ```
  This is a direct duplicate of the backend constant — acceptable drift risk for MVP. Add a code comment linking to `backend/modules/journey/constants.py:11-16` for drift vigilance.
- `useEffect` waits for `loadGoogleMapsSdk()` to resolve before instantiating the Autocomplete on the mounted input refs. If SDK load fails, inputs remain plain text fields (graceful degradation) — submitting them falls through to a geocoding step — BUT since 10.2 does NOT own a geocoding fallback (Directions API requires lat/lng, not addresses), render a small `<p role="alert">` below each input saying `labels.mapErrorBody` when SDK is unavailable. This state is rare; don't overbuild.
- On `autocomplete.addListener("place_changed", ...)`: read `place.geometry.location.lat()` / `.lng()`, and call the prop callback `onOriginChange({ lat, lng, label: place.formatted_address ?? place.name ?? "" })` (and `onDestinationChange` for the other input).
- "現在地を使う" button (origin only — the AC specifies current location for origin): next to the origin input, a secondary button triggers `requestCurrentPosition()` from the existing `apps/web/shared/lib/geolocation.ts:16` (DO NOT re-implement the wrapper — it already handles timeout, denial, and insecure-context). On success, `onOriginChange({ lat, lng, label: "現在地 / Vị trí hiện tại / Current location" })` (label from `labels.useCurrentLocation` — reuse the same string). On `GeolocationDeniedError`, render `labels.errorGeolocationDenied` inline below the button for ~4 seconds; use the existing `apps/web/shared/components/Toast.tsx` + `ToastProvider` pattern (see `apps/web/shared/components/ToastProvider.tsx`) instead of ad-hoc inline text — matches how `NearbyChip` in `modules/deals` uses it.
- Consent (FR55 — existing DaNangNavi rule): the first time the geolocation button is tapped, check `localStorage.getItem("geolocation_consent")` — if absent, show the existing `<Modal>` (`apps/web/shared/components/Modal.tsx`) with the consent prompt (reuse existing copy from `auth.consent_location` in `ja.json:26` — do NOT duplicate). On accept → set the flag + invoke `requestCurrentPosition`. On decline → toast `errorGeolocationDenied` and leave origin empty. If the flag is already set, skip the modal and go straight to `requestCurrentPosition`. Rationale: the other Story 7.1 "Nearby" chip established this pattern — reuse it for UX consistency (see `modules/deals/components/NearbyChip.tsx`).
- "ルート検索" CTA button below the inputs. Disabled unless both `origin` and `destination` are set. Shows `labels.searching` + a spinner (reuse `apps/web/shared/components/PrimaryCTAButton.tsx` — its `loading` prop — see how `DealsIndex` wires it). On click, invokes `onSubmit()` prop.
- A11y: each input has an associated `<label>` (rendered via `labels.originLabel` / `labels.destinationLabel`), linked via `htmlFor` + `id`. The geolocation button has `aria-label={labels.useCurrentLocation}`. The CTA is a real `<button type="submit">` inside a `<form onSubmit={...}>`, so Enter-key submit works without extra keyboard handling (AC#6 implicitly: form semantics).

**6. Bounding-box validation (AC: out-of-bounds error)**

**Given** an `origin` or `destination` whose `lat`/`lng` is outside the Da Nang bbox,
**When** the user submits the form OR the page auto-searches from deep-link params,
**Then**:
- A helper `isInsideDanang({ lat, lng })` in `apps/web/modules/journey/lib/bbox.ts` returns boolean using the imported `DANANG_BOUNDING_BOX`.
- Shell sets `status="out-of-bounds"` and renders `labels.errorOutOfBounds` as a `<p role="alert" className="text-error">` between the inputs and the map. The CTA is re-enabled so the user can fix inputs and retry.
- Deep-link submission: if either param is out-of-bounds on initial load, the server already dropped the values (AC#1 — unparseable/out-of-bounds treated the same server-side), so the client starts empty and the user sees the idle state — NOT the out-of-bounds error. This avoids a jarring error on page load from a stale shared link.

**7. Deep-link support (AC: URL query params)**

**Given** a URL like `/ja/journey?from=16.047,108.206&to=16.074,108.249`,
**When** the page loads,
**Then**:
- Server parses via `parseLatLngParam` (AC#1) — accepts exactly `"{lat},{lng}"` with optional whitespace, lat∈[-90,90], lng∈[-180,180], both finite. Any malformed input (extra commas, non-numeric, NaN, Infinity) → returns `null`.
- Server also runs `isInsideDanang` before passing the value down, so the client never receives an out-of-bounds initial point (matches AC#6 rationale).
- Client shell, seeing both `initialOrigin` and `initialDestination` populated, auto-submits on mount (single `useEffect(() => { if (initialOrigin && initialDestination) handleSubmit(); }, [])`).
- The auto-submit does NOT re-populate the input text fields with a label — those stay showing the lat/lng the user provided (or empty). The Places Autocomplete widget has no way to reverse-geocode our raw lat/lng back into a display string without another API call, and a reverse-geocode on page load would burn quota unnecessarily. Acceptable MVP UX — the map plus the "選択中 12分 / 3.2km" card give sufficient feedback.

**8. Directions API client wrapper (AC: client-side data fetching)**

**Given** the existing `apps/web/shared/lib/apiClient.ts`,
**When** `apps/web/modules/journey/lib/directionsApi.ts` is created,
**Then**:
```ts
import { apiClient, ApiError } from "@/shared/lib/apiClient";

export interface RouteAlternative {
  polyline: string;
  distanceMeters: number;     // apiClient transforms snake → camel
  durationSeconds: number;
  summary: string;
}
export interface DirectionsResponse {
  routes: RouteAlternative[];
  cached: boolean;
}

export async function fetchDirections(input: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  alternatives?: boolean;
}): Promise<DirectionsResponse> {
  try {
    return await apiClient<DirectionsResponse>("/journeys/directions", {
      method: "POST",
      body: {
        origin: input.origin,
        destination: input.destination,
        alternatives: input.alternatives ?? true,
      },
    });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(0, "network", null);
  }
}

export function isDirectionsUnavailable(err: unknown): boolean {
  return (
    err instanceof ApiError &&
    typeof err.data === "object" && err.data !== null &&
    (err.data as { code?: string }).code === "DIRECTIONS_UNAVAILABLE"
  );
}
```
- `apiClient` already does key transformation (snake ⇄ camel), CSRF cookie/header handling, credential inclusion, and 401 auto-refresh — all reused. `/journeys/directions` does NOT require auth, but the shared client includes CSRF by default, which is **required** (AC#6 of Story 10.1: the CSRF middleware applies to all POSTs; see 10-1.md:224).
- The backend error envelope uses `code` (NOT `error_code`) per Story 10.1's Dev Agent Record (see 10-1.md:453) — `isDirectionsUnavailable` checks `code`.
- `RouteAlternative.polyline` arrives as an encoded Google polyline string (see `backend/modules/journey/service.py` response mapping). `JourneyRouteMap` decodes it via `google.maps.geometry.encoding.decodePath` — NOT via a third-party polyline lib. This avoids a new dependency and relies on SDK functions loaded via `libraries=...,geometry` (see AC#9 — loader update required).

**9. Extend the SDK loader — add `geometry` library (AC: SDK config)**

**Given** `apps/web/modules/journey/lib/loadGoogleMapsSdk.ts:37-39` currently requests `libraries=places`,
**When** this story lands,
**Then** update the URL to `libraries=places,geometry`. Rationale: Story 10.2 uses `google.maps.geometry.encoding.decodePath` to convert the encoded polyline strings from the Directions API into arrays of `LatLng` vertices. Without the `geometry` library that symbol is undefined.
- The script is a **single-load singleton** (Story 10.1 AC). Because the loader prevents multiple script tags, changing the `libraries` list is a one-time URL change — the first page to call `loadGoogleMapsSdk()` wins. There is no race condition because every consumer of the singleton will get a google namespace that includes both `places` AND `geometry`.
- Do NOT add a parameter-selectable libraries option (`libraries: string[]`) to the loader function signature. That premature abstraction was considered and rejected — a hardcoded `places,geometry` string is clearer and covers every downstream story (10.2-10.6) without API churn.
- Update the accompanying test (`apps/web/modules/journey/__tests__/JourneyMap.test.tsx`) only if it asserts on the loader URL (it does not — it mocks the loader). The existing 3 tests should continue to pass.
- Add `@types/google.maps` coverage: the project already installed `@types/google.maps` in Story 10.1 (see `apps/web/package.json` `devDependencies`). `google.maps.geometry.encoding.decodePath` is in the same package; no additional install needed. If TS ever complains about `google.maps.geometry` being undefined, double-check the `@types/google.maps` version pins >=3.54 (pin tighter if needed; current minimum is documented inline).

**10. Shared query-param + bbox helpers (AC: helpers)**

**Given** `apps/web/modules/journey/lib/`,
**When** helpers are added,
**Then**:
- `latLngQuery.ts` exports `parseLatLngParam(raw: string | undefined): { lat: number; lng: number } | null`:
  ```ts
  export function parseLatLngParam(raw: string | undefined): { lat: number; lng: number } | null {
    if (!raw) return null;
    const parts = raw.trim().split(",");
    if (parts.length !== 2) return null;
    const lat = Number.parseFloat(parts[0]);
    const lng = Number.parseFloat(parts[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return { lat, lng };
  }

  export function toLatLngParam(p: { lat: number; lng: number }): string {
    return `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
  }
  ```
  The 5-decimal rounding on serialization matches the Story 10.1 cache-key precision (see 10-1.md AC#6). 5 decimals ≈ 1.1 m — tight enough that coincidental collisions are negligible, loose enough that two reloads with minor geolocation jitter still hit the same Redis key → instant response.
- `bbox.ts` exports `isInsideDanang({ lat, lng }): boolean` using the shared `DANANG_BOUNDING_BOX` constant.
- `constants.ts` exports `DANANG_BOUNDING_BOX` — intentionally duplicated from backend (see AC#5 justification).

**11. Frontend tests (AC: testing)**

**Given** the existing Vitest + Testing Library setup (see `apps/web/modules/journey/__tests__/JourneyMap.test.tsx` as reference),
**When** this story lands,
**Then** add:

- `apps/web/modules/journey/__tests__/latLngQuery.test.ts`:
  - happy path: `"16.047,108.206"` → `{lat:16.047, lng:108.206}`.
  - malformed: empty, one-part, 3-part, NaN, Infinity, out-of-range lat/lng → all `null`.
  - `toLatLngParam` rounds to 5 decimals.

- `apps/web/modules/journey/__tests__/bbox.test.ts`:
  - inside Da Nang (16.047, 108.206) → true.
  - Hanoi (21.028, 105.854) → false.
  - exact boundary points (16.15, 108.10 etc.) → true (inclusive).

- `apps/web/modules/journey/__tests__/directionsApi.test.ts`:
  - Mocks `global.fetch` (matches how `apiClient.test.ts` covers it — check for existing fetch mocks via `vi.stubGlobal("fetch", ...)`).
  - `fetchDirections` sends `POST /api/v1/journeys/directions` with snake_case body (`alternatives`, `origin`, `destination`) — asserts via the captured `fetch` Request.
  - Response with `{routes: [...], cached: false}` is parsed and typed.
  - `isDirectionsUnavailable(new ApiError(502, "x", {code: "DIRECTIONS_UNAVAILABLE"}))` → true; other shapes → false.

- `apps/web/modules/journey/__tests__/JourneyInputs.test.tsx`:
  - Mocks `loadGoogleMapsSdk` with a fake google namespace exposing `places.Autocomplete` as a constructor that records `addListener` calls — simulate `place_changed` firing with a fake `place.geometry.location` returning lat 16.05 / lng 108.22. Assert `onOriginChange` / `onDestinationChange` invoked with the expected `{lat, lng, label}`.
  - "現在地を使う" button: mock `requestCurrentPosition` via `vi.mock("@/shared/lib/geolocation", ...)`, simulate success → assert `onOriginChange` called with Current-Location label. Simulate `GeolocationDeniedError` → assert Toast with denial message is rendered.
  - CTA disabled until both inputs have values, enabled when both set, `onSubmit` invoked on click.

- `apps/web/modules/journey/__tests__/JourneyPageShell.test.tsx`:
  - Renders with `initialOrigin`+`initialDestination` props → auto-submit fires; `fetchDirections` mocked to resolve with 3 routes → assert `status === "ready"` by presence of route-summary card and `[data-testid="journey-map-canvas"]`.
  - Simulate 502 with `code: "DIRECTIONS_UNAVAILABLE"` → assert localized error `labels.errorDirectionsUnavailable` is rendered; CTA is re-enabled.
  - Simulate empty-routes response → asserts `errorNoRoute` + `errorNoRouteHint` copy renders (AC#12).
  - Out-of-bounds submission path: user-provided origin at lat 21 → `errorOutOfBounds` rendered; `fetchDirections` NEVER called.
  - Selecting alternative: invoke `onSelectRoute(1)` → assert `selectedIndex` update propagates (cover via a spy on polyline style — cheapest: assert the route-summary card marked as "selected" with `labels.routePrimaryBadge` moved to index 1).
  - URL sync: mock `useRouter` from `next/navigation` via `vi.mock("next/navigation", ...)`; on successful search, assert `router.replace` called with `/ja/journey?from=...&to=...`.

- `apps/web/modules/journey/__tests__/JourneyRouteMap.test.tsx`:
  - Mocks `loadGoogleMapsSdk` with a fake google namespace exposing `maps.Map` (captures `fitBounds` calls), `maps.Polyline` (captures `strokeColor`, `addListener`), `maps.Marker`, `maps.LatLngBounds` (stub `extend` + stores points), `maps.geometry.encoding.decodePath` (returns a pre-defined `[{lat, lng}, ...]` array).
  - With 2 routes, selected=0 → primary polyline has `#1B2A4A` color + weight 6; alt has `#9CA3AF` + weight 4.
  - Changing `selectedIndex` prop to 1 → old polylines' `setMap(null)` invoked; new polylines instantiated with swapped colors.
  - `fitBounds` invoked whenever origin/destination/selectedIndex changes.

All tests mock Google Maps SDK at the loader boundary (DO NOT load real Google Maps). Follow the existing pattern in `__tests__/JourneyMap.test.tsx`: `vi.mock("../lib/loadGoogleMapsSdk", () => ({ loadGoogleMapsSdk: vi.fn(), __resetGoogleMapsSdkForTests: vi.fn() }))`.

**12. Empty-route & error states (AC: empty/error UX)**

**Given** the Directions endpoint returns `{routes: [], cached: false}` (Google's `ZERO_RESULTS` case — rare, e.g., two islands separated by water with no driving route),
**When** the shell receives this response,
**Then**:
- `status` transitions to `"no-route"`.
- Shell renders `<EmptyState variant="no-data" headline={labels.errorNoRoute} body={labels.errorNoRouteHint} />` — reuse the existing shared primitive (`apps/web/shared/components/EmptyState.tsx`). Matches FR71.
- The map still renders showing the two markers (origin + destination) with no polyline overlay, centered on the midpoint at zoom 12.
- The CTA re-enables so the user can amend inputs and retry.

**Given** the Directions endpoint returns HTTP 502 with `{code: "DIRECTIONS_UNAVAILABLE", message_ja, message_vi, message_en, detail}` (Google outage, quota exhaustion, or `OVER_QUERY_LIMIT`),
**When** the shell receives this response,
**Then**:
- `status` transitions to `"directions-error"`.
- Shell renders `<EmptyState variant="error" headline={labels.errorDirectionsUnavailable} />` above the map.
- Map renders empty (no markers, no polylines) centered on Da Nang city center at zoom 13 — matches Story 10.1 `<JourneyMap>` default.
- CTA re-enabled.

**13. Documentation (AC: docs)**

**Given** Story 10.2 adds a new user-facing page,
**When** the story ships,
**Then**:
- `README.md` — append a short line under the existing "Routes / URL map" section (if present; create if missing) noting: `/{locale}/journey — Route search page (Story 10.2, requires Google Maps setup from 10.1)`.
- `_bmad-output/implementation-artifacts/deferred-work.md` — append a bullet: `Journey 10.2: reverse-geocode deep-link lat/lng into display labels on inputs (currently raw coords; acceptable MVP UX)`.
- No architecture doc update — `/[locale]/journey/` was already anticipated by the planning-phase route tree (see `_bmad-output/planning-artifacts/architecture/project-structure-boundaries.md`).

## Tasks / Subtasks

- [x] **Task 1 — Shared helpers + constants (AC: 10, 6, 7)**
  - [x] Create `apps/web/modules/journey/lib/constants.ts` exporting `DANANG_BOUNDING_BOX`
  - [x] Create `apps/web/modules/journey/lib/bbox.ts` exporting `isInsideDanang`
  - [x] Create `apps/web/modules/journey/lib/latLngQuery.ts` exporting `parseLatLngParam`, `toLatLngParam`
  - [x] Add unit tests `__tests__/bbox.test.ts`, `__tests__/latLngQuery.test.ts`
- [x] **Task 2 — Directions API client (AC: 8)**
  - [x] Create `apps/web/modules/journey/lib/directionsApi.ts` with `fetchDirections` + `isDirectionsUnavailable`
  - [x] Add unit test `__tests__/directionsApi.test.ts` mocking `fetch`
- [x] **Task 3 — i18n catalog (AC: 2)**
  - [x] Add `journey` namespace to `apps/web/messages/ja.json`, `vi.json`, `en.json` (identical key set)
- [x] **Task 4 — SDK loader: add `geometry` library (AC: 9)**
  - [x] Update `apps/web/modules/journey/lib/loadGoogleMapsSdk.ts` URL to `libraries=places,geometry`
  - [x] Re-run existing `JourneyMap.test.tsx` — MUST stay green
- [x] **Task 5 — JourneyMap `onMapReady` hook (AC: 4)**
  - [x] Add optional `onMapReady?: (map: google.maps.Map) => void` prop to `apps/web/modules/journey/components/JourneyMap.tsx`
  - [x] Fire inside the existing `useEffect` right after `new google.maps.Map(...)` resolves
  - [x] Do not change any other behavior; existing tests must pass
- [x] **Task 6 — `<JourneyRouteMap>` (AC: 4)**
  - [x] Create `apps/web/modules/journey/components/JourneyRouteMap.tsx` composing `<JourneyMap>` with markers + polylines + auto-fit
  - [x] Implement polyline click → `onSelectRoute(i)`
  - [x] Handle cleanup on unmount (`setMap(null)` on stale overlays)
  - [x] Add `__tests__/JourneyRouteMap.test.tsx`
- [x] **Task 7 — `<JourneyInputs>` (AC: 5)**
  - [x] Create component with two Places-Autocomplete-wired inputs + "現在地を使う" button + CTA
  - [x] Wire `requestCurrentPosition` from `@/shared/lib/geolocation`; add consent gate reusing `Modal` + existing consent key
  - [x] Add `__tests__/JourneyInputs.test.tsx`
- [x] **Task 8 — `<JourneyPageShell>` (AC: 3, 6, 7, 12)**
  - [x] Create client shell orchestrating state, validation, fetch, URL sync, error/empty states
  - [x] Integrate `<JourneyInputs>` + `<JourneyRouteMap>`
  - [x] Add `__tests__/JourneyPageShell.test.tsx`
- [x] **Task 9 — Server route (AC: 1)**
  - [x] Create `apps/web/app/(user)/[locale]/journey/page.tsx` with `generateMetadata`, searchParams parsing, labels resolution, and `<JourneyPageShell>` rendering
  - [x] Verify path at `/ja/journey`, `/vi/journey`, `/en/journey`
- [x] **Task 10 — Docs (AC: 13)**
  - [x] Update `README.md` with the new route
  - [x] Append `deferred-work.md` with the reverse-geocoding deferral
- [ ] **Task 11 — Manual smoke** — deferred to PR reviewer; needs real Google API keys.
  - [ ] Open `/ja/journey`, type two Da Nang addresses, see 3 routes rendered, tap alternative to swap primary, verify `?from=...&to=...` appended to URL, reload → identical state restored
  - [ ] Try an out-of-Da-Nang query → assert bounded error copy
  - [ ] Kill network DevTools → simulate 502 → assert error copy; reload succeeds once network restored

## Dev Notes

### Scope boundaries — things NOT to do

- Do NOT add the listings-along-route bottom sheet — that's Story 10.4.
- Do NOT add route personality selector (Food / Scenic / Fastest) — that's Story 10.5.
- Do NOT introduce a new backend endpoint. 10.1's `POST /api/v1/journeys/directions` is the only backend touchpoint; if you find yourself writing a new FastAPI route, stop.
- Do NOT reverse-geocode deep-link lat/lng into input-field labels. Deferred to future story; noted in `deferred-work.md`.
- Do NOT add saved-route history or "recent searches" — also out of scope.
- Do NOT write a walking/transit mode toggle — Story 10.5 introduces that; 10.2 relies on the `driving` default hardcoded in `backend/modules/journey/constants.py::DIRECTIONS_TRAVEL_MODE`.

### Cache-key precision alignment

The 5-decimal rounding in `toLatLngParam` is not cosmetic — it aligns URL-shared lat/lng with the Redis cache key Story 10.1 writes. A deep-link reload of `?from=16.04712,108.20612&to=...` sees the same cache key as the original submission and returns from cache in <50ms (Story 10.1 AC#6 perf budget). If you change rounding precision, both sides must change together OR downstream deep-links miss cache for their first 24h TTL window.

### Why a separate `<JourneyRouteMap>` instead of mutating `<JourneyMap>`

Story 10.1's `<JourneyMap>` has 3 tests asserting skeleton/canvas/error states. Adding route-rendering behavior to the same component would:
1. Make those tests coupled to polyline state; breakage probability rises.
2. Prevent 10.3+ from embedding a "dumb" map elsewhere (preview cards, listing detail location map, etc.).

A thin `<JourneyMap>` + composed `<JourneyRouteMap>` keeps separation of concerns clean. The only change to `<JourneyMap>` is the single new optional prop `onMapReady` — a minimal escape hatch.

### Places Autocomplete vs. PlaceAutocompleteElement

The new `PlaceAutocompleteElement` (as of 2026-Q1) is still settling — API is marked "beta" by Google, and loading it requires `?v=alpha` on the SDK URL, which invalidates the singleton loader's `v=weekly` channel. **Use the classic `google.maps.places.Autocomplete` widget** — stable, ships with `libraries=places` already enabled, and covers 100% of 10.2's needs. When `PlaceAutocompleteElement` GAs (Google ETA 2026-Q3 per their roadmap), migration is a post-MVP refactor.

### Polyline decoding

`google.maps.geometry.encoding.decodePath(encoded: string): google.maps.LatLng[]` — built into the SDK, no extra dep. This is why AC#9 requires `libraries=places,geometry`. DO NOT install `@googlemaps/polyline-codec` or similar; the in-SDK implementation is identical and already tree-shaken into the loader's single script tag.

### Handling the `useRouter` import

`next/navigation`'s `useRouter` — NOT `next/router`. The App Router uses the former; `next/router` is Pages-Router only and will throw at runtime. See `apps/web/modules/deals/components/DealsIndex.tsx` for the reference usage (it does URL-query-param sync the exact same way Story 10.2 will).

### SSR hydration gotcha

Do NOT render any Google-Maps-dependent JSX during the server pass. All Google objects (Map, Marker, Polyline) live behind the client-only `<JourneyRouteMap>` (and `<JourneyMap>`, which already has `"use client"`). The shell itself is a client component; the server `page.tsx` only computes initial props and metadata. If you accidentally reference `google.*` outside a `useEffect`/mount path, SSR will fail with `ReferenceError: google is not defined`.

### Consent flow for geolocation

Do NOT re-invent the consent modal. The existing Epic 1 Story 1.6 + Story 2.2 established `auth.consent_location` (`ja.json:26`) as the source of copy AND `localStorage.getItem("geolocation_consent")` as the persistence key. Follow the existing code path used by `modules/deals/components/NearbyChip.tsx` — same flag, same modal, same UX language.

### Project Structure Notes

- New directory: `apps/web/app/(user)/[locale]/journey/` — matches the established (user) route group layout (see `deals/`, `listings/`, `areas/` siblings).
- Frontend module additions: `apps/web/modules/journey/components/{JourneyPageShell.tsx, JourneyInputs.tsx, JourneyRouteMap.tsx}`, `apps/web/modules/journey/lib/{constants.ts, bbox.ts, latLngQuery.ts, directionsApi.ts}`, `apps/web/modules/journey/__tests__/{new tests}`.
- No backend changes. No migrations. No new environment variables.
- Path aliases: use `@/` prefix everywhere (see `apps/web/AGENTS.md` — **NEVER** use `../` relative imports).
- Variance from blueprint: the `modules/journey/` folder was scaffolded with `components/`, `lib/`, `hooks/`, `__tests__/` in Story 10.1. Story 10.2 does NOT need a new `hooks/` entry — autocomplete wiring lives inside `JourneyInputs.tsx` directly (simplest possible structure for a one-use hook; extract only if Stories 10.3+ grow a second consumer).

### Testing standards summary

- Frontend: Vitest + React Testing Library. Mock `loadGoogleMapsSdk` at the module boundary; NEVER load real Google Maps in tests. Follow the pattern in `apps/web/modules/journey/__tests__/JourneyMap.test.tsx`.
- Mock `next/navigation` via `vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn(), push: vi.fn() }), useSearchParams: () => new URLSearchParams() }))` — same helper used elsewhere in the codebase.
- Mock `apiClient` by stubbing `global.fetch` (matches existing `apiClient.test.ts` pattern) rather than mocking `apiClient` itself, so CSRF + key-transform logic is exercised end-to-end.
- Type-check contract: `@types/google.maps` >=3.54 (installed by 10.1). Any `as unknown as typeof google` cast in tests is acceptable to satisfy strict TS when fabricating a partial google namespace.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-10-journey-based-discovery.md#Story-10.2]
- [Source: _bmad-output/implementation-artifacts/10-1-google-maps-integration-route-api-foundation.md — directions endpoint contract, error envelope (`code: DIRECTIONS_UNAVAILABLE`), cache-key precision, `<JourneyMap>` props, singleton SDK loader]
- [Source: apps/web/modules/journey/components/JourneyMap.tsx — map primitive to extend with `onMapReady`]
- [Source: apps/web/modules/journey/lib/loadGoogleMapsSdk.ts — URL to update with `libraries=places,geometry`]
- [Source: apps/web/shared/lib/apiClient.ts — snake↔camel transform, CSRF cookie/header handling, 401 refresh; directly reused]
- [Source: apps/web/shared/lib/geolocation.ts:16 — `requestCurrentPosition` wrapper reused verbatim]
- [Source: apps/web/shared/components/{EmptyState.tsx, Modal.tsx, PrimaryCTAButton.tsx, ToastProvider.tsx} — reused UI primitives]
- [Source: apps/web/app/(user)/[locale]/deals/page.tsx — reference pattern for `generateMetadata`, `searchParams` parsing, labels-prop passthrough]
- [Source: apps/web/messages/ja.json:26 — `auth.consent_location` existing copy reused for geolocation consent]
- [Source: apps/web/app/globals.css:5 — `--color-primary` #1B2A4A Navy for selected polyline]
- [Source: backend/modules/journey/constants.py:11-16 — `DANANG_BOUNDING_BOX` (replicated on the frontend; keep in sync)]
- [Source: backend/modules/journey/schemas.py:24-33 — `LatLng`, `DirectionsRequest` schema validated by the backend; client wrapper shapes match]
- [Source: apps/web/AGENTS.md — path-alias rule (`@/` only; never `../`)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- JourneyRouteMap tests initially failed with `google is not defined` because bare `google` global isn't accessible in Vitest jsdom VM context. Fixed by storing the google namespace from `loadGoogleMapsSdk()` in a ref (`googleRef`) instead of relying on the global.
- JourneyInputs Autocomplete mock needed per-instance listener tracking since two Autocomplete instances are created (origin + destination).
- JourneyPageShell out-of-bounds test redesigned: server drops out-of-bounds params, so client never receives them; test verifies that no auto-submit fires without initial values.

### Completion Notes List

- Task 1: Created `constants.ts` (DANANG_BOUNDING_BOX mirroring backend), `bbox.ts` (isInsideDanang), `latLngQuery.ts` (parseLatLngParam/toLatLngParam with 5-decimal precision). 18 unit tests pass.
- Task 2: Created `directionsApi.ts` with `fetchDirections` (POST to /journeys/directions via apiClient) and `isDirectionsUnavailable` helper. 6 unit tests pass, mocking fetch end-to-end through apiClient's snake/camel transform.
- Task 3: Added `journey` namespace to ja.json, vi.json, en.json with all 15+ required keys including ICU-style `{minutes}`/`{km}` templates.
- Task 4: Updated SDK loader URL from `libraries=places` to `libraries=places,geometry`. Existing 3 JourneyMap tests pass unchanged.
- Task 5: Added `onMapReady?: (map: google.maps.Map) => void` prop to JourneyMap. Fires after `new google.maps.Map(...)` succeeds, before `setStatus("ready")`. Existing tests still green.
- Task 6: Created JourneyRouteMap composing JourneyMap with markers (A/B), polylines (primary #1B2A4A / alt #9CA3AF), auto-fit bounds, and route summary card. Polyline click swaps selection. 5 tests pass.
- Task 7: Created JourneyInputs with Places Autocomplete, geolocation consent modal (localStorage key + auth.consent_location copy), PrimaryCTAButton CTA. 7 tests pass.
- Task 8: Created JourneyPageShell orchestrating state (idle/searching/ready/no-route/out-of-bounds/directions-error), validation, fetchDirections, URL sync via router.replace, error/empty states using EmptyState. 5 tests pass.
- Task 9: Created server page at `app/(user)/[locale]/journey/page.tsx` with generateMetadata (SEO), searchParams parsing (from/to deep-link), bbox validation, labels passthrough. force-dynamic export.
- Task 10: Updated README.md with route entry. Appended deferred-work.md with reverse-geocode deferral.
- Full regression: 72 test files, 284 tests all pass. No TS errors in journey module.

### Change Log

- 2026-04-21: Story 10-2 implementation complete. All tasks 1-10 done. Task 11 (manual smoke) deferred to PR reviewer.

### File List

New files:
- apps/web/modules/journey/lib/constants.ts
- apps/web/modules/journey/lib/bbox.ts
- apps/web/modules/journey/lib/latLngQuery.ts
- apps/web/modules/journey/lib/directionsApi.ts
- apps/web/modules/journey/components/JourneyPageShell.tsx
- apps/web/modules/journey/components/JourneyRouteMap.tsx
- apps/web/modules/journey/components/JourneyInputs.tsx
- apps/web/modules/journey/__tests__/bbox.test.ts
- apps/web/modules/journey/__tests__/latLngQuery.test.ts
- apps/web/modules/journey/__tests__/directionsApi.test.ts
- apps/web/modules/journey/__tests__/JourneyRouteMap.test.tsx
- apps/web/modules/journey/__tests__/JourneyInputs.test.tsx
- apps/web/modules/journey/__tests__/JourneyPageShell.test.tsx
- apps/web/app/(user)/[locale]/journey/page.tsx

Modified files:
- apps/web/modules/journey/lib/loadGoogleMapsSdk.ts (libraries=places → places,geometry)
- apps/web/modules/journey/components/JourneyMap.tsx (added onMapReady prop)
- apps/web/messages/ja.json (added journey namespace)
- apps/web/messages/vi.json (added journey namespace)
- apps/web/messages/en.json (added journey namespace)
- README.md (added route entry)
- _bmad-output/implementation-artifacts/deferred-work.md (added reverse-geocode deferral)
- _bmad-output/implementation-artifacts/sprint-status.yaml (status updates)
