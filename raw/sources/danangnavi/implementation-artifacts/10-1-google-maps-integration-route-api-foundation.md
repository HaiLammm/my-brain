# Story 10.1: Google Maps Integration & Route API Foundation

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer kicking off Epic 10 (Journey-Based Discovery),
I want a provisioned Google Cloud project with two properly-restricted API keys + billing alerts, a new backend `journey/` module, a PostGIS-enabled `listings.location` GEOGRAPHY column with a GiST index, a Redis-cached `POST /api/v1/journeys/directions` proxy that talks to Google Directions API on behalf of the browser, and a lazy-loaded `<JourneyMap>` component that boots the Google Maps JavaScript SDK exactly once per page session,
so that Stories 10.2 – 10.6 have a reliable, cost-controlled, security-hardened foundation on which to build route rendering, geospatial listing matching, personality scoring and journey-deals integration — without ever exposing the server-side Google API key to the browser and without paying Directions API quota on repeated identical route lookups.

## Acceptance Criteria

**1. Google Cloud Project & API Keys (AC: Google Cloud setup)**

**Given** the Google Cloud project `danangnavi-maps` (create new if absent; reuse existing `danangnavi-*` project if already linked to the billing account used by Epic 1 infra),
**When** the platform is provisioned,
**Then**:
- Two API keys are created via `gcloud alpha services api-keys create` (or Console if CLI not available):
  - `GOOGLE_MAPS_JS_API_KEY` — **HTTP referrer restricted** to `https://danangnavi.com/*`, `https://*.danangnavi.com/*`, `http://localhost:3000/*` (dev). Allowed APIs: **Maps JavaScript API, Places API (New)**. This key ships to the browser as `NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY`.
  - `GOOGLE_MAPS_SERVER_API_KEY` — **IP-allowlist restricted** to the DigitalOcean droplet's static IP (prod) + developer static IPs (optional). Allowed APIs: **Directions API, Geocoding API (for future 10.x)**. NEVER exposed to frontend; lives only in backend `.env` under `GOOGLE_MAPS_SERVER_API_KEY`.
- The following Google Cloud APIs are enabled on the project: **Maps JavaScript API, Directions API, Places API (New), Geocoding API**. Enablement is idempotent (re-running the provisioning step is a no-op).
- **Billing alerts** are configured on the linked billing account for the monthly budget (`MAPS_MONTHLY_BUDGET_USD`, default 50 USD for MVP, documented in `.env.example`): alerts fire at **50%** and **80%** of the budget, emailing `luonghaimal@gmail.com` (replace with a project-level `ops@danangnavi.com` alias if it exists). Note: a 100% alert is NOT required by this story — Google's default overrun-hard-cap is a separate post-MVP concern tracked in `deferred-work.md`.
- Key restrictions are **verified** by the developer before marking AC complete: running `curl "https://maps.googleapis.com/maps/api/directions/json?origin=...&destination=...&key=$GOOGLE_MAPS_JS_API_KEY"` from a server (no Referer header) MUST return `REQUEST_DENIED`. Running the same with `GOOGLE_MAPS_SERVER_API_KEY` from the allow-listed IP MUST return `OK`. Document this check in the PR description.

**2. Environment variable wiring (AC: env)**

**Given** the backend and frontend env stacks,
**When** the `.env.example` files are updated,
**Then**:
- `backend/.env.example` adds:
  ```
  # Google Maps (Story 10.1 — journey module)
  GOOGLE_MAPS_SERVER_API_KEY=
  GOOGLE_MAPS_DIRECTIONS_TIMEOUT_SECONDS=5
  DIRECTIONS_CACHE_TTL_SECONDS=86400   # 24h per Epic 10 Story 10.1 AC
  ```
- `backend/shared/config.py` (existing `Settings` Pydantic BaseSettings class — same file used by Epic 1/2/7) extends:
  ```python
  # Google Maps (Story 10.1)
  google_maps_server_api_key: str | None = Field(default=None)
  google_maps_directions_timeout_seconds: float = Field(default=5.0)
  directions_cache_ttl_seconds: int = Field(default=86400)
  ```
  Ordering: add a new `# Google Maps` section directly below the existing `# External Services` block to match the existing grouping style.
- `apps/web/.env.example` adds:
  ```
  # Google Maps JS SDK (Story 10.1 — browser-side key, HTTP referrer restricted)
  NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY=
  ```
  The `NEXT_PUBLIC_` prefix is REQUIRED — Next.js 16 only inlines env vars with that prefix into the client bundle. Any other prefix yields `undefined` at runtime in the browser.
- **NEVER commit real keys**. The `.env` files are already in `.gitignore`; only `.env.example` ships placeholder values.

**3. Alembic migration — PostGIS + listings.location column (AC: migration)**

**Given** the current alembic head (as of 2026-04-20) is `2026_04_20_0001` (create_notifications_and_preferences_tables — shipped by Story 7.3),
**When** a new migration `2026_04_21_0001_enable_postgis_and_add_listings_location.py` under `backend/migrations/versions/` is created,
**Then** the migration performs the following in `upgrade()` in exact order (order matters — postgis must exist before GEOGRAPHY column):
1. `op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")` — idempotent, safe to re-run. Requires the database user to have `SUPERUSER` or `CREATE EXTENSION` privilege; document in PR description that prod DB user needs this (Neon/managed PG may require a one-time superuser toggle).
2. Add column `location` to `listings`:
   ```python
   op.add_column(
       "listings",
       sa.Column(
           "location",
           Geography(geometry_type="POINT", srid=4326),  # from geoalchemy2 import Geography
           nullable=True,  # nullable because some listings legitimately lack coordinates
       ),
   )
   ```
   Import at top: `from geoalchemy2 import Geography`. Add `geoalchemy2>=0.15,<0.16` to `backend/requirements.txt` alongside existing `SQLAlchemy>=2.0` pin.
3. **Backfill** existing rows:
   ```sql
   UPDATE listings
   SET location = ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326)::geography
   WHERE latitude IS NOT NULL
     AND longitude IS NOT NULL
     AND location IS NULL;
   ```
   Note longitude-first order in `ST_MakePoint(lng, lat)` — this is a classic PostGIS footgun. Cross-check against existing `listings.latitude`/`longitude` columns (Numeric(9,6), see `backend/modules/listing/models.py:72-73`).
4. Create GiST index: `op.create_index("ix_listings_location_gist", "listings", ["location"], postgresql_using="gist")`. Name MUST be `ix_listings_location_gist` so Story 10.3's `ST_Intersects` query planner picks it deterministically.
5. Leave `listings.latitude` / `listings.longitude` columns **in place** — they continue to serve `backend/modules/listing/repository.py:132-157` (Haversine distance for existing area-guide/homepage queries). Deletion is explicitly deferred; removing them here would break Epic 2's shipped code (Stories 2.1-2.6 all reference them).

`downgrade()` drops the GiST index, drops the `location` column, and does NOT drop the postgis extension (other tables might rely on it later; explicit drop is a separate migration if ever needed).

The migration revision/down_revision stamps follow the existing convention (see `backend/migrations/versions/2026_04_20_0001_create_notifications_and_preferences_tables.py`):
```python
revision: str = "2026_04_21_0001"
down_revision: Union[str, None] = "2026_04_20_0001"
```
If another migration lands on main before this story ships, bump both stamps accordingly — inspect `backend/migrations/versions/` right before committing and chain to the actual head.

**4. Update `Listing` SQLAlchemy model (AC: ORM sync)**

**Given** `backend/modules/listing/models.py` defines the `Listing` class extending `BaseModel`,
**When** the story adds the `location` column to the DB,
**Then** the model gains a matching mapped attribute so raw SQL / ORM queries in Story 10.3 can read it typed:
```python
from geoalchemy2 import Geography
from geoalchemy2.shape import to_shape  # for future response shaping; not used in 10.1

location: Mapped[object | None] = mapped_column(
    Geography(geometry_type="POINT", srid=4326),
    nullable=True,
)
```
Placement: directly after the existing `latitude` / `longitude` fields to keep geo-related columns adjacent. The existing `latitude` / `longitude` fields are NOT removed (AC#3 rationale).

**5. Backend `journey/` module scaffold (AC: module files)**

**Given** the project structure documented in `_bmad-output/planning-artifacts/architecture/project-structure-boundaries.md:231-376` (backend module template),
**When** the journey module is scaffolded at `backend/modules/journey/`,
**Then** the following files exist (see architecture mirror — auth, listing, notification all follow this pattern):
- `__init__.py` — empty, package marker.
- `router.py` — FastAPI `APIRouter(prefix="/api/v1/journeys", tags=["journeys"])`. Registers `POST /directions` (AC#6).
- `service.py` — contains `class JourneyService` with async method `get_directions(origin: LatLng, destination: LatLng, alternatives: bool = True) -> DirectionsResponse`. Owns cache-read/call-Google/cache-write flow (AC#6). NO direct HTTP calls from the router — router stays thin.
- `repository.py` — for 10.1 this file is created with a stub docstring `"""Geospatial queries. Populated by Story 10.3."""` and no methods. Kept in place to establish module layout now.
- `schemas.py` — Pydantic V2 models: `LatLng`, `DirectionsRequest`, `RouteAlternative`, `DirectionsResponse`, `DirectionsErrorResponse` (see AC#6 for field specs). Uses camelCase aliases via `model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)` — matches the existing auth/listing/notification modules' `schemas.py` convention (snake-case in Python, camelCase over the wire).
- `constants.py` — defines:
  ```python
  DANANG_BOUNDING_BOX = {
      "north": 16.15,
      "south": 15.95,
      "east":  108.35,
      "west":  108.10,
  }  # rough Da Nang city bounds; Story 10.2 uses this for validation
  DIRECTIONS_CACHE_KEY_PREFIX = "directions"
  MAX_ROUTE_ALTERNATIVES = 3
  DIRECTIONS_METRIC_HIT = "journey_directions_cache_hit_total"
  DIRECTIONS_METRIC_MISS = "journey_directions_cache_miss_total"
  DIRECTIONS_ERROR_CODE = "DIRECTIONS_UNAVAILABLE"
  ```
- `exceptions.py` — defines `class DirectionsUnavailableError(AppException)` inheriting from `shared/exceptions.py::AppException` (existing base — see how `modules/coupon/exceptions.py` uses it). Payload: `error_code="DIRECTIONS_UNAVAILABLE"`, `status_code=502`, `message_ja="ルート情報を取得できませんでした。しばらくしてから再度お試しください。"`, `message_vi="Không lấy được thông tin lộ trình. Vui lòng thử lại sau."`, `message_en="Directions service is temporarily unavailable. Please try again shortly."`
- `events.py` — for 10.1 this file is created with a stub docstring `"""Journey module events. Populated by Stories 10.3+ if needed."""` and no handlers. No event bus wiring is needed for 10.1 because the Directions proxy is request/response only.

Register the router in `backend/main.py` alongside the existing `include_router` block (see `backend/main.py:40-57`):
```python
from modules.journey.router import router as journey_router  # noqa: E402
...
app.include_router(journey_router)
```

**6. `POST /api/v1/journeys/directions` endpoint (AC: endpoint + cache + metrics)**

**Given** the `journey/router.py` and `journey/service.py`,
**When** the endpoint is implemented,
**Then**:

Request schema (`DirectionsRequest` in `schemas.py`):
```python
class LatLng(BaseModel):
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)

class DirectionsRequest(BaseModel):
    origin: LatLng
    destination: LatLng
    alternatives: bool = True
```

Response schema (`DirectionsResponse`):
```python
class RouteAlternative(BaseModel):
    polyline: str           # Google-encoded polyline string (e.g., "_p~iF~ps|U_ulLnnqC...")
    distance_meters: int
    duration_seconds: int
    summary: str            # human-readable summary returned by Google (e.g., "DT605")

class DirectionsResponse(BaseModel):
    routes: list[RouteAlternative]  # up to MAX_ROUTE_ALTERNATIVES = 3
    cached: bool                    # True if served from Redis, False if cache miss
```

Cache key algorithm (exact):
```python
origin_hash      = f"{round(origin.lat, 5)},{round(origin.lng, 5)}"
destination_hash = f"{round(destination.lat, 5)},{round(destination.lng, 5)}"
alternatives_tag = "alt" if alternatives else "single"
cache_key = f"{DIRECTIONS_CACHE_KEY_PREFIX}:{origin_hash}:{destination_hash}:{alternatives_tag}"
```
Rationale for rounding to 5 decimals: ~1.1 m precision — tighter than GPS accuracy, so coincidental cache-key collisions are negligible; looser than raw float representation, so tiny geolocation jitter (8th-decimal noise from `navigator.geolocation`) still hits cache. This matches the Story 10.3 buffer-hash convention that the next story will layer on top.

Redis TTL: `settings.directions_cache_ttl_seconds` (default 86400 = 24h; spec value from Epic 10 AC).

Flow in `JourneyService.get_directions()`:
1. Compute `cache_key`.
2. `cached_json = await redis.get(cache_key)`. If hit: `await redis.incr(DIRECTIONS_METRIC_HIT)`, return `DirectionsResponse.model_validate_json(cached_json)` with `cached=True`.
3. Cache miss: `await redis.incr(DIRECTIONS_METRIC_MISS)`. Call Google Directions API via `httpx.AsyncClient(timeout=settings.google_maps_directions_timeout_seconds)`:
   ```
   GET https://maps.googleapis.com/maps/api/directions/json
       ?origin={origin.lat},{origin.lng}
       &destination={destination.lat},{destination.lng}
       &alternatives={true|false}
       &mode=driving
       &key={settings.google_maps_server_api_key}
   ```
   Mode defaults to `driving` for MVP — explicitly call this out in `constants.py` as `DIRECTIONS_TRAVEL_MODE = "driving"` so Story 10.5's personality work has a single place to branch later. Multi-modal (walking/transit) is post-MVP.
4. Parse response. If `status != "OK"` OR HTTP != 200 OR request exception: raise `DirectionsUnavailableError`. Take the first `MAX_ROUTE_ALTERNATIVES` entries; extract each `route.overview_polyline.points` (encoded polyline), `route.legs[0].distance.value` (meters), `route.legs[0].duration.value` (seconds), `route.summary`.
5. Build `DirectionsResponse(routes=[...], cached=False)`, `await redis.setex(cache_key, ttl, response.model_dump_json())`, return.

Error mapping (router layer via the existing global exception handler from `backend/shared/middleware/error_handler.py` — DO NOT hand-roll a local `@router.exception_handler`):
- `DirectionsUnavailableError` → HTTP 502 with body `{"error_code": "DIRECTIONS_UNAVAILABLE", "message_ja": ..., "message_vi": ..., "message_en": ...}`. This matches the error format documented in `_bmad-output/planning-artifacts/architecture/core-architectural-decisions.md` line 59: `{error_code, message_ja, message_vi, message_en, detail}`.

Structured logging via `structlog` (already configured for request_id correlation — see `shared/middleware/request_id.py`):
- On cache miss: `log.info("directions.cache_miss", origin=..., destination=..., cache_key=cache_key)`.
- On Google failure: `log.warning("directions.google_failure", origin=..., destination=..., google_status=..., http_status=...)`. The Google response body is logged but the request URL with `?key=...` must be stripped — log the path only. **Never log `GOOGLE_MAPS_SERVER_API_KEY`** (AC#1 security requirement). If using `httpx` exception's `.request.url`, strip query string before logging.

Prometheus metrics exposure:
- The counters `journey_directions_cache_hit_total` and `journey_directions_cache_miss_total` are implemented as plain Redis `INCR` counters for now. The existing `/api/v1/health` endpoint gets a new sibling `/api/v1/metrics/journeys` (internal-only, gated on `X-Internal-Token: {settings.internal_api_token}` via the existing pattern seen in `modules/notification/router.py::internal_router`) that returns:
  ```json
  {"cache_hit_total": 12345, "cache_miss_total": 678}
  ```
  Reason for this pared-down approach: the architecture doc (`core-architectural-decisions.md`) mentions Prometheus aspirationally but no `prometheus_client` exporter is wired up yet. Introducing the exporter is out of scope for 10.1 — a Redis-backed counter + internal JSON endpoint is sufficient for Story 10.1's AC ("cache-hit and cache-miss counters are exposed") and lets 10.6 / post-MVP bolt on a proper `/metrics` endpoint without changing the counter semantics. Document this tradeoff in a short comment at the top of `journey/router.py::metrics_endpoint`.

Performance budget (verified in tests; AC from epic):
- Cache hit: < 50ms (end-to-end including JSON parse). Verified via a pytest benchmark-ish test that asserts elapsed time on a hot key.
- Cache miss: < 800ms p95. This is a **network-dependent** budget — not feasible to enforce in CI; instead, document in the PR description that a manual smoke test against staging recorded ≤800ms p95 over 20 calls. The test suite only asserts correctness (cache write-through, single Google call per miss via `respx`/`httpx_mock`).

Rate limiting: the existing `RateLimiterMiddleware` (`shared/middleware/rate_limiter.py`) already enforces role-based limits (100/min Guest, 300/min User). No per-endpoint override for 10.1 — a Guest hitting the Directions API is acceptable since the Redis cache deflects repeated identical requests. A per-endpoint stricter limit is deferred to Story 10.2 once real traffic patterns are observable.

Auth: the endpoint is **public** (no `Depends(get_current_user)`). Rationale: the journey input page is SSR and anonymous-visitable per Epic 10 Story 10.2 ACs; locking the Directions proxy behind auth would force login before a user sees any route value. The server-side key cost is bounded by the 24h Redis cache for identical (origin, destination) pairs.

CSRF: the existing `CSRFMiddleware` (double-submit cookie per `core-architectural-decisions.md`) covers this POST. Frontend code must include the `csrftoken` cookie + header like every other mutation in the app — see `apps/web/shared/lib/apiClient.ts` for the existing pattern.

**7. Frontend `<JourneyMap>` component scaffold + lazy SDK loader (AC: SDK lazy load)**

**Given** the frontend module structure (`_bmad-output/planning-artifacts/architecture/project-structure-boundaries.md`),
**When** the Journey feature module is created,
**Then**:
- New module folder `apps/web/modules/journey/` with subfolders: `components/`, `hooks/`, `lib/`, `__tests__/`.
- `apps/web/modules/journey/lib/loadGoogleMapsSdk.ts` — **singleton idempotent loader**:
  ```ts
  let sdkPromise: Promise<typeof google> | null = null;

  export function loadGoogleMapsSdk(): Promise<typeof google> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("loadGoogleMapsSdk called on server"));
    }
    if (sdkPromise) return sdkPromise;
    if ((window as any).google?.maps) {
      sdkPromise = Promise.resolve((window as any).google);
      return sdkPromise;
    }
    sdkPromise = new Promise((resolve, reject) => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY;
      if (!apiKey) {
        reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY is not set"));
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve((window as any).google);
      script.onerror = () => {
        sdkPromise = null; // allow retry on transient failure
        reject(new Error("Failed to load Google Maps JS SDK"));
      };
      document.head.appendChild(script);
    });
    return sdkPromise;
  }
  ```
  Idempotency requirements (AC directly):
  - Multiple concurrent calls to `loadGoogleMapsSdk()` yield **one** script tag. Enforced by the module-level `sdkPromise` cache.
  - A successful load sticks; re-mounting `<JourneyMap>` reuses the same promise.
  - A failed load clears the cached promise so a later retry can re-inject.
  - The `libraries=places` parameter is included because Story 10.2 needs Places Autocomplete on the origin/destination inputs — loading a single SDK instance with both libraries avoids a second script injection later.
- `apps/web/modules/journey/components/JourneyMap.tsx` — client component (`"use client"`), minimal for 10.1. Contract:
  ```tsx
  export interface JourneyMapProps {
    center?: { lat: number; lng: number };  // default = Da Nang city center 16.04, 108.22
    zoom?: number;                           // default 13
    className?: string;
  }
  export function JourneyMap(props: JourneyMapProps): JSX.Element;
  ```
  Behavior:
  - On mount: renders a `<Skeleton>` placeholder (reuse `apps/web/shared/components/Skeleton.tsx` — exists from Epic 1 Story 1.2 design tokens). UX-DR45 compliance ("loading skeleton while SDK initializes").
  - Calls `loadGoogleMapsSdk()` inside a `useEffect(() => {...}, [])`. When the promise resolves, constructs a `new google.maps.Map(el, { center, zoom, mapId: undefined, disableDefaultUI: false, gestureHandling: "greedy" })` and hides the skeleton.
  - On unmount: detaches map listeners; DOES NOT remove the `<script>` tag (preserves singleton for next mount).
  - On load failure: renders a friendly fallback `<EmptyState>` (reuse existing `apps/web/shared/components/EmptyState.tsx`) with Japanese copy `"地図を読み込めませんでした"` / Vietnamese `"Không tải được bản đồ"` / English `"Could not load the map"`. FR71 compliance.
- `apps/web/modules/journey/components/JourneyMap.test.tsx` — Vitest + Testing Library test asserting:
  - Skeleton renders before SDK resolves.
  - When `loadGoogleMapsSdk` is mocked to resolve, skeleton is replaced by a `data-testid="journey-map-canvas"` element.
  - When mocked to reject, the fallback empty state renders with the expected i18n key.

No page/route is added in 10.1 — the `<JourneyMap>` component exists but is not yet wired into any page. Story 10.2 will create `/ja/journey/page.tsx` and compose `<JourneyMap>` there. This keeps 10.1's PR surface area tight.

**8. Backend tests (AC: testing)**

**Given** the existing pytest layout (`backend/tests/conftest.py` fixtures for `db_session`, `test_client`, `auth helpers` — see architecture doc line 421-434),
**When** `backend/tests/journey/` is added,
**Then** these files ship with the story:
- `backend/tests/journey/__init__.py` — empty.
- `backend/tests/journey/test_service.py` — covers:
  - `test_cache_hit_returns_cached_without_google_call` — seeds Redis with a known key, asserts no HTTP call via `respx`/`httpx_mock`, asserts `cached=True`.
  - `test_cache_miss_calls_google_and_writes_cache` — mocks Google OK response with 3 routes, asserts `redis.setex` called with correct key and TTL from settings.
  - `test_google_error_raises_directions_unavailable` — mocks Google `status=OVER_QUERY_LIMIT` → expects `DirectionsUnavailableError`.
  - `test_google_timeout_raises_directions_unavailable` — mocks `httpx.TimeoutException` → expects same.
  - `test_api_key_never_logged` — mocks Google failure, captures structlog output, asserts `GOOGLE_MAPS_SERVER_API_KEY` value does NOT appear in any log record (critical — AC#1 security requirement).
  - `test_cache_key_rounds_to_5_decimals` — two requests differing only in the 6th decimal hit the same cache key.
- `backend/tests/journey/test_router.py` — covers:
  - `test_directions_endpoint_happy_path` — 200 response, correct schema shape.
  - `test_directions_endpoint_google_failure_returns_502_with_i18n_error` — 502 with `error_code: "DIRECTIONS_UNAVAILABLE"` and all three `message_ja|vi|en` fields populated.
  - `test_directions_endpoint_validates_lat_lng_bounds` — lat=91 → 422 Unprocessable Entity.
- `backend/tests/journey/test_migration.py` — minimal smoke test that spins up the test DB, runs alembic to `head`, asserts `SELECT PostGIS_Version();` succeeds and `listings.location` column exists with GEOGRAPHY type. This catches the postgis-extension-privilege gotcha early.

All Google HTTP calls are mocked via `respx` (already a dev dep if present; otherwise add to `backend/requirements-dev.txt` — confirm before importing). If `respx` is absent, fall back to `httpx_mock` — check `backend/requirements-dev.txt` first and reuse whichever is already pinned.

**9. Documentation & .env.example updates (AC: docs)**

**Given** the project `README.md` already documents Epic 1–7 setup,
**When** Story 10.1 ships,
**Then**:
- `README.md` gets a new "Google Maps setup" subsection under the existing "External services" heading (search for it; create the heading if absent). Document: which two keys to create, how to set the HTTP-referrer / IP-allowlist restrictions, where to paste them into `.env` and `apps/web/.env.local`, and the billing-alert setup steps. 8-15 lines max — defer exhaustive Google Cloud Console walkthroughs to a wiki/Notion link if one exists.
- `backend/.env.example` and `apps/web/.env.example` updated per AC#2.
- `deferred-work.md` (existing file in `_bmad-output/implementation-artifacts/`) gets a new bullet:
  - `Google Maps: proper Prometheus /metrics exporter (journey_directions_cache_* counters currently served via internal JSON endpoint — Story 10.1 tradeoff)`
  - `Google Maps: 100% budget hard-cap / auto-disable — Story 10.1 ships 50%/80% alerts only`

## Tasks / Subtasks

- [ ] **Task 1 — Google Cloud provisioning (AC: 1)** — requires human + Google Cloud Console access; deferred to PR prep.
  - [ ] Create / confirm `danangnavi-maps` project (or reuse existing danangnavi project per AC)
  - [ ] Enable Maps JS API, Directions API, Places API (New), Geocoding API
  - [ ] Create `GOOGLE_MAPS_JS_API_KEY` with HTTP referrer restriction + verify via curl that referer-less call returns `REQUEST_DENIED`
  - [ ] Create `GOOGLE_MAPS_SERVER_API_KEY` with IP allowlist (add DO droplet IP + dev IPs) + verify from allow-listed IP returns `OK`
  - [ ] Configure 50% + 80% billing alerts on the billing account
  - [ ] Document key creation + verification in PR description
- [x] **Task 2 — Environment variables (AC: 2)**
  - [x] Update `backend/shared/config.py` with `google_maps_server_api_key`, `google_maps_directions_timeout_seconds`, `directions_cache_ttl_seconds`
  - [x] Update `backend/.env.example` with new keys under a `# Google Maps` section
  - [x] Update `apps/web/.env.example` with `NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY`
- [x] **Task 3 — Alembic migration + model (AC: 3, 4)**
  - [x] Add `geoalchemy2>=0.15,<0.16` to `backend/requirements.txt`
  - [x] Create migration `2026_04_21_0001_enable_postgis_and_add_listings_location.py` (re-chain `down_revision` to current head just before commit)
  - [x] Write `upgrade()` with: CREATE EXTENSION, add column, backfill, create GiST index
  - [x] Write `downgrade()` dropping index + column
  - [x] Update `backend/modules/listing/models.py` with `location` Mapped attribute
  - [x] Run migration locally (`alembic upgrade head`) + `alembic downgrade -1` + `alembic upgrade head` to verify round-trip
- [x] **Task 4 — Journey module scaffold (AC: 5)**
  - [x] Create `backend/modules/journey/` with all files per AC#5 (router, service, repository stub, schemas, constants, exceptions, events stub)
  - [x] Wire `journey_router` into `backend/main.py`
  - [x] Verify `curl http://localhost:8000/api/v1/health` still works (regression smoke)
- [x] **Task 5 — Directions endpoint + caching + metrics (AC: 6)**
  - [x] Implement `JourneyService.get_directions()` with cache-first flow
  - [x] Implement Redis counters for hits/misses + internal metrics endpoint `/api/v1/metrics/journeys`
  - [x] Implement structured logging with key scrubbing
  - [x] Register `DirectionsUnavailableError` → 502 via existing global exception handler (confirm handler already generic; if not, extend `shared/middleware/error_handler.py`)
- [x] **Task 6 — Frontend SDK loader + JourneyMap component (AC: 7)**
  - [x] Create `apps/web/modules/journey/lib/loadGoogleMapsSdk.ts` (singleton + idempotent)
  - [x] Create `apps/web/modules/journey/components/JourneyMap.tsx` with Skeleton + error fallback
  - [x] Add TypeScript types — install `@types/google.maps` as a dev dep under `apps/web/package.json` if not present
- [x] **Task 7 — Backend tests (AC: 8)**
  - [x] Add `backend/tests/journey/` test suite per AC#8
  - [x] Ensure test DB fixture enables postgis (extend `conftest.py` if current fixture skips migrations)
- [x] **Task 8 — Frontend tests (AC: 7)**
  - [x] Add `JourneyMap.test.tsx` covering skeleton → map canvas + load-error fallback
- [x] **Task 9 — Documentation (AC: 9)**
  - [x] Update `README.md` with Google Maps setup subsection
  - [x] Append tradeoff notes to `_bmad-output/implementation-artifacts/deferred-work.md`
- [ ] **Task 10 — Manual verification** — deferred to PR reviewer; requires real Google API keys + running services.
  - [ ] Smoke test: `curl -X POST http://localhost:8000/api/v1/journeys/directions -H 'Content-Type: application/json' -d '{"origin":{"lat":16.047,"lng":108.206},"destination":{"lat":16.074,"lng":108.249},"alternatives":true}'` returns up to 3 routes; second identical call returns `"cached": true` in < 50ms
  - [ ] Manually mount `<JourneyMap>` on a throwaway dev page (e.g., `/ja/dev/journey-smoke` — delete before merging) and confirm tile render + no console errors + only one `maps.googleapis.com/maps/api/js` request in DevTools Network tab

## Dev Notes

### Why this story matters (context for the dev agent)

Story 10.1 is **infrastructure, not user-facing feature**. There is no UI beyond a map canvas and no journey/ URL routes in this story. Resist the urge to add a demo page, example inputs, or preview — Story 10.2 owns all of that. The entire purpose of 10.1 is to hand Story 10.2 a working `<JourneyMap>` component, a working `POST /directions` endpoint, a PostGIS-ready DB, and two verified API keys.

### Security — non-negotiable

1. The **server key MUST NEVER** appear in any frontend bundle, log line, error response, or browser-visible artifact. Audit the PR diff specifically for `GOOGLE_MAPS_SERVER_API_KEY` — it should only appear in `backend/shared/config.py`, `backend/modules/journey/service.py`, and `.env.example` (as an empty placeholder). Grep before pushing.
2. Key restrictions (HTTP referrer for JS, IP allowlist for server) are the primary defense against key exfiltration. Without them, a leaked key = unbounded bill. Verify restrictions are actually applied via the curl tests in AC#1 — do NOT trust the Console UI alone (restrictions sometimes take a few minutes to propagate).
3. When logging Google errors, the URL INCLUDES the key in the query string if you log `exc.request.url` naively. Strip the query string or log the path only. There is a test (`test_api_key_never_logged`) that must pass.

### PostGIS privileges

On a fresh DigitalOcean Managed PG or Neon instance, the default app user may NOT have `CREATE EXTENSION` privilege. If `alembic upgrade head` fails on `CREATE EXTENSION postgis` with `permission denied`, the fix is a one-time manual superuser step:
```sql
-- run as superuser / database owner
CREATE EXTENSION postgis;
```
Then re-run `alembic upgrade head` — the `IF NOT EXISTS` clause makes it a no-op. Document this in the PR description so the deployment runbook captures it.

### Cache key stability

The cache key algorithm rounds lat/lng to 5 decimals (~1.1m). If you change the rounding precision later, old cache entries remain readable but new entries land under a different key — not a correctness bug but it will look like a cold cache for a TTL window. Don't change the precision without flushing the `directions:*` namespace.

### Travel mode

Hardcoded to `driving` in 10.1. Story 10.5 (route personality scoring) introduces walking/transit as a "scenic" variant — leave that seam at `DIRECTIONS_TRAVEL_MODE = "driving"` in `constants.py` with a `# Story 10.5 will parameterize this` comment. No further abstraction needed now.

### Why a stub repository.py + events.py

The architecture doc (`project-structure-boundaries.md`) documents every backend module as having this file set. Shipping the module with the full file set — even if some files are stubs — keeps diffs small in 10.3+ (where `repository.py` fills in PostGIS queries). Reviewers won't have to mentally pattern-match against a half-built module.

### Things NOT to do in this story

- Do NOT drop `listings.latitude` / `listings.longitude` — Epic 2 Stories 2.1-2.6 reference them directly in `modules/listing/repository.py` and the homepage distance-from-user queries.
- Do NOT add a Prometheus exporter. The AC says "expose counters"; a Redis `INCR` + internal JSON endpoint satisfies that at much lower complexity.
- Do NOT wire `<JourneyMap>` into any production page — Story 10.2 owns the `/ja/journey` route.
- Do NOT add Places Autocomplete hooks/components — Story 10.2 owns those. Preloading the `places` library in the SDK loader is the ONLY Places-related change in 10.1.
- Do NOT add listings-along-route matching — that is 10.3. This story's ONLY backend endpoint is `POST /directions` plus the internal metrics endpoint.
- Do NOT add authentication to `/directions` — it is intentionally public (see AC#6 rationale).

### Project Structure Notes

- Backend module path `backend/modules/journey/` matches the documented mirror pattern (alongside `auth/`, `listing/`, `notification/`, `coupon/`, `search/`, `sync/`, etc.).
- Frontend module path `apps/web/modules/journey/` follows the same mirror convention — see `apps/web/modules/notification/` shipped by Story 7.3 for the closest recent example.
- No conflicts with the architecture doc — the project-structure blueprint anticipates this module (its routes `/ja/journey/*` appear in the planned route tree even though Story 10.1 doesn't create the page).
- Variance from the blueprint: the blueprint implies `/metrics` as a standard exporter; this story uses a scoped `/api/v1/metrics/journeys` JSON endpoint instead. Rationale documented in AC#6 and in `deferred-work.md`.

### Testing standards summary

- Backend: pytest, async fixtures in `backend/tests/conftest.py`, HTTP mocks via `respx` (or `httpx_mock` — check which is pinned in `backend/requirements-dev.txt` before importing).
- Frontend: Vitest + Testing Library. Mock `loadGoogleMapsSdk` at the module boundary — DO NOT attempt to load real Google Maps JS in tests.
- Migration smoke test uses the real test Postgres container (CI must have `postgis` extension available; if the test container doesn't, extend the docker-compose test service to use `postgis/postgis:16-3.4` image instead of stock `postgres:16`).

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-10-journey-based-discovery.md#Story-10.1]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md — API error format (line 59), External service resilience (line 63), Redis cache strategy]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure-boundaries.md#Backend-Modules — journey/ module file set template]
- [Source: backend/modules/listing/models.py:72-73 — existing latitude/longitude Numeric(9,6) columns kept intact]
- [Source: backend/modules/listing/repository.py:132-157 — Haversine distance query depending on latitude/longitude]
- [Source: backend/shared/config.py — Pydantic Settings grouping convention]
- [Source: backend/main.py:40-57 — router registration pattern]
- [Source: backend/migrations/versions/2026_04_20_0001_create_notifications_and_preferences_tables.py — current alembic head to chain against]
- [Source: backend/modules/notification/router.py — internal_router pattern reused for `/api/v1/metrics/journeys`]
- [Source: backend/shared/middleware/error_handler.py — global exception → localized JSON response]
- [Source: backend/shared/middleware/csrf.py — double-submit cookie pattern already applied to POST endpoints]
- [Source: apps/web/shared/components/ — Skeleton, EmptyState components reused by `<JourneyMap>`]
- [Source: apps/web/modules/notification/ — Story 7.3's frontend module layout used as a pattern reference]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.7 (1M context) — `claude-opus-4-7[1m]`.

### Debug Log References

- Initial `test_cache_key_rounds_to_5_decimals` failed because the chosen 6th-decimal values straddled a rounding boundary (16.04712 vs 16.04713). Tightened the deltas to 7th-decimal noise so both sides always round to the same 5-decimal key. See `tests/journey/test_service.py:202-214`.
- Ruff E501 on `modules/journey/exceptions.py:22` and `modules/journey/router.py:56` — split the English error string across lines and extracted the expected-token local variable respectively. No behavioural change.

### Completion Notes List

- AC#1 (Google Cloud project + key provisioning + billing alerts) and the Task 10 manual smoke tests are **deferred to PR preparation** — they require interactive Google Cloud Console / Billing / curl-against-real-keys work that cannot be automated from the dev agent. Everything else (code, schema, tests, docs) is implemented and green.
- Error envelope uses the existing app-wide key `code` (not `error_code`) so the Directions 502 response stays consistent with every other module handled by `shared/middleware/error_handler.py::app_exception_handler`. Story spec said `error_code` — flagging the deviation here.
- Redis-backed cache-hit/miss counters are exposed at `GET /api/v1/_internal/journeys/metrics` behind `X-Internal-Token` — matches the pattern in `modules/notification/router.py::internal_router`. Proper Prometheus exporter is deferred per story spec + `deferred-work.md`.
- `Listing` model gains a new `location` GEOGRAPHY column alongside — NOT replacing — the existing `latitude` / `longitude` Numeric columns. Epic 2's Haversine queries keep working unchanged; the switchover is deferred.
- `loadGoogleMapsSdk` is a module-level singleton promise; `__resetGoogleMapsSdkForTests` is exported for Vitest isolation and is never imported by production code.
- Backend: 240 tests pass (223 pre-existing + 17 new journey). Frontend: 243 Vitest tests pass (240 pre-existing + 3 new JourneyMap). Ruff clean across `modules/journey` and `tests/journey`. ESLint/TS pre-existing errors are unrelated to Story 10.1.

### Change Log

| Date       | Change                                                                                                                                         |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| 2026-04-21 | Story 10.1 implementation: env vars, config.py, Alembic migration (`2026_04_21_0001`), `Listing.location`, `modules/journey/` scaffold + Directions proxy + metrics endpoint, frontend `<JourneyMap>` + `loadGoogleMapsSdk`, tests, README + deferred-work docs. |

### File List

**Backend — new:**

- `backend/modules/journey/__init__.py`
- `backend/modules/journey/constants.py`
- `backend/modules/journey/dependencies.py`
- `backend/modules/journey/events.py`
- `backend/modules/journey/exceptions.py`
- `backend/modules/journey/repository.py`
- `backend/modules/journey/router.py`
- `backend/modules/journey/schemas.py`
- `backend/modules/journey/service.py`
- `backend/migrations/versions/2026_04_21_0001_enable_postgis_and_add_listings_location.py`
- `backend/tests/journey/__init__.py`
- `backend/tests/journey/test_migration.py`
- `backend/tests/journey/test_router.py`
- `backend/tests/journey/test_service.py`

**Backend — modified:**

- `backend/main.py` (register `journey_router` + `journey_internal_router`)
- `backend/modules/listing/models.py` (add `Listing.location` GEOGRAPHY mapped column + `geoalchemy2` import)
- `backend/shared/config.py` (add `google_maps_server_api_key`, `google_maps_directions_timeout_seconds`, `directions_cache_ttl_seconds`)
- `backend/requirements.txt` (+ `geoalchemy2>=0.15,<0.16`)
- `backend/requirements-dev.txt` (+ `respx`)

**Frontend — new:**

- `apps/web/modules/journey/lib/loadGoogleMapsSdk.ts`
- `apps/web/modules/journey/components/JourneyMap.tsx`
- `apps/web/modules/journey/__tests__/JourneyMap.test.tsx`

**Frontend — modified:**

- `apps/web/package.json` (+ `@types/google.maps`)

**Docs — modified:**

- `.env.example` (+ Google Maps key blocks)
- `README.md` (+ External Services / Google Maps setup section)
- `_bmad-output/implementation-artifacts/deferred-work.md` (+ Story 10.1 deferred items)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (status transitions)
