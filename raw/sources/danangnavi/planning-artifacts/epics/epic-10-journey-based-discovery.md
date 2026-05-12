# Epic 10: Journey-Based Discovery (Google Maps Integration)

Japanese users can input origin and destination, view the route drawn on Google Maps with up to 3 alternatives, discover internal DaNangNavi listings matched along the route polyline (within a 300m buffer), filter by route personality (food / scenic / fastest), and see active deals for listings along the way. This epic realizes the **Top Breakthrough #1** from the brainstorming session (Ideas #1 Journey-Based Discovery, #2 Route Personality, #78 Google Maps = Navigation Only, #79 Journey Deals, #81 Route-Aware Discovery Engine) — a concept unique to DaNangNavi, not present on Hot Pepper, Danang Holic, Vietnam Sketch, or any competitor.

**Dependencies:** Epic 2 (Listing data model + detail page), Epic 7 (Deals/Coupons for Story 10.6)
**Sequencing:** After Epic 2 completes (2.2, 2.5, 2.6 done)
**Principle:** Closed-data — Google Maps is navigation layer ONLY; 100% of listing content is internal DaNangNavi data (Decision #3 + #78 from brainstorming)

## Story 10.1: Google Maps Integration & Route API Foundation

As a developer,
I want a secure Google Maps integration, a backend `journey/` module, and a cached Directions API proxy,
So that subsequent journey stories have a reliable, cost-controlled foundation for route rendering and geospatial matching.

**Acceptance Criteria:**

**Given** the Google Cloud project setup
**When** the platform is provisioned
**Then** two API keys are created: `GOOGLE_MAPS_JS_API_KEY` (browser-side, restricted by HTTP referrer) and `GOOGLE_MAPS_SERVER_API_KEY` (server-side, restricted by IP allowlist)
**And** billing alerts are configured at 50% and 80% of monthly budget threshold
**And** the Maps JavaScript API, Directions API, and Places API are enabled

**Given** the backend `journey/` module
**When** the migration and scaffolding run
**Then** module files exist: `router.py`, `service.py`, `repository.py`, `schemas.py`, `constants.py`, `exceptions.py`
**And** PostgreSQL has `postgis` extension enabled via Alembic migration
**And** the `listings` table has a GiST index on `location` (GEOGRAPHY(POINT, 4326)) column — column added if missing, backfilled from existing `latitude`/`longitude`

**Given** the Directions API proxy endpoint
**When** I call `POST /api/v1/journeys/directions` with `{origin: {lat, lng}, destination: {lat, lng}, alternatives: true}`
**Then** the server calls Google Directions API using the server-side key
**And** the response (polyline, distance, duration, up to 3 routes) is cached in Redis with key `directions:{origin_hash}:{destination_hash}` and TTL 24 hours
**And** a cache hit returns in < 50ms; a cache miss returns in < 800ms (p95)
**And** cache-hit and cache-miss counters are exposed as Prometheus metrics

**Given** error handling for Google API failures
**When** the Directions API returns non-200 or quota exceeded
**Then** the endpoint returns a structured error `{code: "DIRECTIONS_UNAVAILABLE", message_ja, message_vi}`
**And** the error is logged with request context (origin, destination, error code) but NOT the API key
**And** the frontend shows a friendly fallback state (FR71 pattern)

**Given** the Maps JavaScript SDK integration in the Next.js app
**When** the `<JourneyMap>` component loads
**Then** the Google Maps JS SDK loads lazily (next/script `lazyOnload`) using `GOOGLE_MAPS_JS_API_KEY` from a public env var
**And** the SDK is loaded once per page session (idempotent)
**And** a loading skeleton displays while the SDK initializes (UX-DR45)

## Story 10.2: Journey Input & Route Display

As a Japanese user planning to visit a place,
I want to input where I am and where I'm going, then see the route drawn on a map,
So that I can understand my journey visually before deciding.

**Acceptance Criteria:**

**Given** I navigate to `/ja/journey`
**When** the page loads
**Then** two input fields appear: "出発地" (origin) and "目的地" (destination) with Google Places autocomplete scoped to Da Nang bounding box
**And** a "現在地を使う" (Use current location) button sets origin from `navigator.geolocation` after consent (FR55 compliance)
**And** the page is SSR with Japanese meta tags (FR59)

**Given** I have selected both origin and destination
**When** I tap "ルート検索" (Search route) CTA
**Then** the map renders with up to 3 route alternatives as polylines (primary in Navy, alternatives in light gray)
**And** each route shows a label: duration (e.g., "12分") and distance (e.g., "3.2km")
**And** tapping an alternative polyline makes it the primary (swaps colors)
**And** map auto-fits bounds to include origin + destination + selected polyline

**Given** the origin or destination is outside Da Nang bounding box
**When** I submit
**Then** a validation error displays: "ダナン市内の場所を指定してください" (Please specify locations within Da Nang)

**Given** the Directions API returns no route (e.g., unreachable)
**When** the response is empty
**Then** an empty state displays: "ルートが見つかりませんでした" with suggestion to check addresses (FR71)

**Given** I reload the page with query params `?from=LAT,LNG&to=LAT,LNG`
**When** the page loads
**Then** inputs pre-fill and route auto-searches (deep-link support for sharing)

## Story 10.3: Route-Aware Listing Matching

As a developer (and indirectly the user),
I want a geospatial endpoint that returns internal listings within a buffer around a route polyline,
So that the UI can display "quán dọc đường" discoveries matched against DaNangNavi's own data.

**Acceptance Criteria:**

**Given** the matching endpoint
**When** I call `POST /api/v1/journeys/route` with `{origin, destination, buffer_meters: 300, category_ids?: [...], personality?: "food"|"scenic"|"fastest"}`
**Then** the server fetches (or reuses cached) directions for origin→destination
**And** for the selected polyline, PostGIS constructs a buffer polygon: `ST_Buffer(ST_GeogFromText('LINESTRING(...)'), 300)`
**And** listings are matched via `SELECT ... WHERE ST_Intersects(location, :buffer_polygon)`
**And** results are ordered by distance-from-origin along the polyline (using `ST_LineLocatePoint` with the route linestring)
**And** the response returns `{route: {polyline, duration, distance}, listings: [{listing_id, distance_from_origin_m, distance_from_route_m, ...listing_summary}], total_count}`

**Given** a polyline with 500 listings in the buffer
**When** the matching query runs with index `listings(location) USING GIST`
**Then** the query completes in < 200ms (p95) at 10K total listings in DB
**And** pagination supports `limit` (default 30, max 100) and `offset`

**Given** optional filters
**When** `category_ids=[cafe, restaurant]` is provided
**Then** only listings in those categories are returned
**And** deleted, unverified, or hidden listings are excluded

**Given** the response cache layer
**When** the same route + filters are requested within 1 hour
**Then** the response is served from Redis cache (key includes route hash + filter hash)
**And** cache invalidation triggers when a listing is created/updated in the buffer area (deferred to batch cache warm — acceptable staleness 1h for MVP)

## Story 10.4: Listings Along Route UI

As a Japanese user viewing a route,
I want to see a list of notable DaNangNavi-verified places along my route ordered by when I'll encounter them,
So that I can discover restaurants, cafes, and spots without detouring far from my path.

**Acceptance Criteria:**

**Given** the route has been searched (from Story 10.2)
**When** the backend returns listings from Story 10.3
**Then** a bottom sheet appears (mobile) / right panel (desktop) with header "ルート沿いの先輩おすすめ (N件)"
**And** listings display as compact cards sorted by `distance_from_origin` ascending
**And** each card shows: photo, senpai badge, title (JP), dual price (VND + ¥JPY), rating, and meta "出発地から1.2km先・ルートから80m"

**Given** the map view
**When** listings are loaded
**Then** each listing displays as a Navy price pin on the map at its exact location
**And** pins are clustered when zoom is too low (e.g., > 50 pins visible)
**And** tapping a pin highlights the corresponding card in the bottom sheet (auto-scroll)
**And** tapping a card highlights its pin and centers the map without changing zoom

**Given** I tap a listing card
**When** the tap registers
**Then** a mini-preview overlay opens (not full navigation) with photo, title, senpai quote, rating, and "詳細を見る" CTA
**And** the "詳細を見る" CTA navigates to `/ja/listings/[slug]` (Epic 2 Story 2.4)

**Given** no listings match the route
**When** the empty state displays
**Then** a friendly message shows: "ルート沿いに先輩おすすめが見つかりませんでした" with a "カテゴリを広げる" CTA that removes category filters

**Given** I save a listing from the card (♡ button)
**When** the save action triggers
**Then** behavior follows Epic 2 Story 2.6 (toast "保存しました", signup modal if unauthenticated)

## Story 10.5: Route Personality Scoring

As a Japanese user with a specific vibe in mind,
I want to switch the route personality between Food, Scenic, and Fastest,
So that the route and listings-along-route adapt to my mood.

**Acceptance Criteria:**

**Given** the journey page
**When** it loads
**Then** a segmented control displays 3 options above the map: 🍜 食 (Food) | 🌅 景 (Scenic) | ⚡ 早 (Fastest)
**And** the default selection is 食 (Food)

**Given** I tap 早 (Fastest)
**When** the personality switches
**Then** the primary polyline updates to the route with shortest duration from Directions alternatives
**And** the listings list re-ranks by pure `distance_from_origin` (no category weighting)

**Given** I tap 食 (Food)
**When** personality is Food
**Then** the primary polyline is the route that passes nearest to the most high-rated restaurant/cafe listings
**And** listings re-rank with scoring formula: `score = rating_avg * 0.4 + category_weight * 0.3 + inverse_distance_from_route * 0.3`
**And** `category_weight = 1.0` for Restaurant/Cafe, `0.3` for others

**Given** I tap 景 (Scenic)
**When** personality is Scenic
**Then** the primary polyline is the alternative with highest "scenic_score" (pre-computed on route: counts beach/park/viewpoint POIs within 500m buffer)
**And** listings re-rank with `category_weight = 1.0` for Cafe/Tour/Hotel, `0.3` for others

**Given** the personality scoring is rule-based for MVP
**When** the logic runs
**Then** it is implemented in `journey/service.py::score_route_personality()` with unit tests covering:
- Food personality prefers food-heavy routes
- Scenic personality prefers beach/river routes
- Fastest personality ignores category and picks shortest duration
**And** the scoring config (weights, category mappings) lives in `journey/constants.py` for easy tuning

**Given** a tuning need post-MVP
**When** analytics show personality usage patterns
**Then** weights can be adjusted without schema changes (deferred: ML-based ranking)

## Story 10.6: Journey Deals Integration

As a Japanese user on a journey,
I want to see which listings along my route have active deals or coupons,
So that I can save money by choosing stops with offers.

**Acceptance Criteria:**

**Given** Epic 7 (Deals & Coupons) is live and the journey endpoint
**When** `POST /api/v1/journeys/route` returns listings
**Then** each listing item includes `active_deal: {deal_id, title_ja, savings_jpy, expires_at} | null` joined from Epic 7 deal module
**And** only deals with `status = 'active'` and `expires_at > now()` are joined
**And** N+1 queries are avoided (batch fetch by listing_ids)

**Given** a listing card with an active deal
**When** it renders in the bottom sheet
**Then** a Coral badge "💰 お得 -¥1,200" appears on the card (UX-DR13 coupon indicator reuse)
**And** tapping the badge opens the coupon bottom sheet (Epic 7 Story 7.2 flow)

**Given** the map pins
**When** a listing has an active deal
**Then** its price pin gets a small Coral dot indicator to distinguish from non-deal pins

**Given** I add a filter toggle "お得のみ"
**When** I tap it
**Then** the listings list filters to only listings with `active_deal != null`
**And** the results count updates; the toggle persists in session storage

**Given** deal expiry happens mid-session
**When** a deal expires while I'm viewing (client-side timer)
**Then** the badge gracefully disappears with a fade animation; the listing remains in the list

---
