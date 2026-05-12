# Story 7.2: Coupon Claim & Redemption

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Japanese tourist / resident who has discovered a coupon on DaNangNavi,
I want to claim a coupon to my account (auth-gated), view its QR code, redeem it in-store via a confirmation dialog, and see my active vs. used coupons under `/{locale}/deals?tab=mine`,
so that I can actually receive the advertised discount and the business owner can verify the redemption — closing the end-to-end loop started by Story 7.1 (browse) and enabling the expiry-notification trigger in Story 7.3.

## Acceptance Criteria

1. **Given** the backend coupon module (extending the `backend/modules/coupon/` package from Story 7.1), **When** database migrations run, **Then**:
   - Alembic migration `{next_stamp}_create_coupon_redemptions_table.py` under `backend/migrations/versions/` (Story 7.1 shipped `2026_04_19_0002_create_coupons_table.py`; this story's stamp is `2026_04_19_0003_create_coupon_redemptions_table.py` — inspect the directory and bump the stamp if another migration lands first) creates table `coupon_redemptions`:
     - `id UUID PK DEFAULT uuid_generate_v4()`.
     - `coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE`.
     - `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`.
     - `redemption_code VARCHAR(32) NOT NULL UNIQUE` — the opaque token embedded in the QR code (not a sequential id; generated via `secrets.token_urlsafe(24)` — URL-safe, 32 chars after base64-trim; collision-checked in service layer with a single retry).
     - `status VARCHAR(20) NOT NULL DEFAULT 'claimed'` with CHECK `status IN ('claimed', 'redeemed', 'expired', 'revoked')`.
     - `claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
     - `redeemed_at TIMESTAMPTZ` (nullable — set when status transitions to `redeemed`).
     - Inherit `BaseModel` contract (`created_at`, `updated_at`, `deleted_at`) — soft-delete available for admin/audit flows (Epic 9), not used in 7.2.
     - **Unique partial index** `uq_coupon_redemptions_user_coupon_active` ON `(coupon_id, user_id) WHERE status IN ('claimed', 'redeemed') AND deleted_at IS NULL` — enforces "one active claim per user per coupon" at the DB level (concurrent double-claim raises `IntegrityError` → `CouponAlreadyClaimedException` 409).
     - Index `ix_coupon_redemptions_user_status` ON `(user_id, status) WHERE deleted_at IS NULL` — powers `GET /coupons/mine?status=...`.
     - Index `ix_coupon_redemptions_code` — IMPLICIT via the UNIQUE constraint on `redemption_code`; no separate index needed.
     - `downgrade()` drops the table + all indexes cleanly.
   - Alembic migration `{next_stamp+1}_create_activity_logs_table.py` (new file, stamp `2026_04_19_0004_create_activity_logs_table.py`) creates table `activity_logs` (FR56 — coupon claim/redeem are the FIRST consumers; future stories 3.3/4.x will extend the taxonomy):
     - `id UUID PK`, `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`, `action_type VARCHAR(50) NOT NULL`, `metadata JSONB NOT NULL DEFAULT '{}'::jsonb`, `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
     - Index `ix_activity_logs_user_created` ON `(user_id, created_at DESC)`.
     - Index `ix_activity_logs_action_created` ON `(action_type, created_at DESC)` — for Epic 9 analytics.
     - NO `updated_at` / `deleted_at` — activity logs are append-only audit rows. DO NOT inherit full `BaseModel`; create a minimal model. Admin-purge is not in scope.
     - `downgrade()` drops the table + indexes.
   - **Redis counter infra:** for each coupon, maintain key `coupon:redemptions:{coupon_id}` (INTEGER, INCR on redemption, not claim). TTL = `valid_until - now()` seconds (set via `EXPIREAT` to the coupon's `valid_until` epoch). This is a real-time "あと N 枚" counter referenced by `max_redemptions` enforcement (see AC#3) — the DB row count is the authoritative total; Redis is the hot counter used to reject redemptions atomically. On cold Redis (key missing), service layer re-hydrates from `SELECT COUNT(*) FROM coupon_redemptions WHERE coupon_id = :id AND status = 'redeemed'` and re-sets the key with the correct TTL before attempting the decision.

2. **Given** the backend claim flow, **When** an authenticated user `POST /api/v1/coupons/{coupon_id}/claim`, **Then**:
   - The endpoint requires `get_current_user` (NOT `get_current_user_optional` — FR53 auth gate enforced server-side; 401 for guests). The frontend shows the signup modal BEFORE calling this endpoint (AC#7), but the server MUST still reject unauthenticated calls — never trust the client.
   - Validates the coupon exists (`SELECT ... WHERE id = :id AND is_active = TRUE AND deleted_at IS NULL AND valid_from <= NOW() AND valid_until > NOW()`). Missing/soft-deleted → 404 `CouponNotFoundException` (reused from 7.1). Inactive/expired → 410 `CouponExpiredException` (reused).
   - Enforces the one-active-claim-per-user constraint via the partial unique index; on `IntegrityError` (psycopg `UniqueViolation` mapped via `asyncpg.PostgresError` code `23505`), raise `CouponAlreadyClaimedException` (409, trilingual) with the existing redemption's `id` in the response body so the frontend can immediately display the existing QR instead of creating a duplicate.
   - Enforces `max_redemptions` at CLAIM time when set: count `SELECT COUNT(*) FROM coupon_redemptions WHERE coupon_id = :id AND status IN ('claimed', 'redeemed') AND deleted_at IS NULL` inside the same transaction as the insert; if `count >= max_redemptions` → `CouponSoldOutException` (409, trilingual). Reason we check at claim (not redemption): users shouldn't hoard claims against a sold-out coupon, which would disadvantage business owners and create "zombie" QRs. The Redis counter from AC#1 tracks **redemptions** (not claims) — it's the in-store ceiling; the DB count is the claim ceiling.
   - Generates `redemption_code = secrets.token_urlsafe(24)` (32 URL-safe chars after default trimming) — on UNIQUE collision, retry once; if the retry also collides, raise `InternalServerError` (this is astronomically unlikely and indicates a seeding bug — log at ERROR).
   - Inserts the `coupon_redemptions` row with `status = 'claimed'`, `claimed_at = NOW()`, `redeemed_at = NULL`.
   - Appends an `activity_logs` row: `action_type = 'coupon.claimed'`, `metadata = {"coupon_id": "...", "listing_id": "...", "redemption_id": "..."}`. Use the SAME transaction as the redemption insert — if either fails, both roll back.
   - Emits `COUPON_CLAIMED` event (`shared.events.emit`) AFTER commit, with payload `{ coupon_id, redemption_id, listing_id, user_id }`. Fire-and-forget; event subscribers (future Story 7.3 / Epic 9) must not block the request.
   - Returns `SingleEnvelope[RedemptionDetail]` with `201 Created`, `Location: /api/v1/coupons/redemptions/{redemption_id}` header. `RedemptionDetail` includes `id, coupon_id, redemption_code, status, claimed_at, redeemed_at, qr_payload_url` — where `qr_payload_url` is the canonical URL the QR image encodes (see AC#5): `https://{DOMAIN}/r/{redemption_code}` (short, scannable, landing page is out of scope — the URL is intentionally a stable identifier for the BO scanner, NOT yet a real landing page).
   - Rate-limit: `rate_limit(limit=30, window_s=60, route_key="coupon_claim")` — user-keyed via `get_current_user`. Stricter than reads (deter abuse). 429 returns trilingual.

3. **Given** the backend redemption flow, **When** the claiming user `POST /api/v1/coupons/redemptions/{redemption_id}/redeem` (NO separate BO scanner endpoint in 7.2 — the user self-redeems by tapping `使用する` on their own QR view; BO scanner app is Epic 8), **Then**:
   - Requires `get_current_user`. The redemption row's `user_id` MUST match the authed user — else 403 `NotRedemptionOwnerException` (trilingual).
   - Loads the redemption row `FOR UPDATE` (row-level lock via `.with_for_update()`) inside a transaction to prevent concurrent double-redeem.
   - Validates current status:
     - `claimed` → proceed.
     - `redeemed` → 409 `RedemptionAlreadyUsedException` (includes the prior `redeemed_at` in the error body so the frontend shows "already used on {date}").
     - `expired` or `revoked` → 410 `RedemptionNotUsableException`.
   - Validates the underlying coupon is still active + not expired (same `is_active=true AND valid_from <= NOW() AND valid_until > NOW()` check). If expired between claim and redeem → transition the redemption row to `status='expired'` in the SAME transaction, then raise `RedemptionNotUsableException` (410). This prevents stale QRs from being honored post-expiry.
   - Atomically decrements the Redis counter using Lua script (single round-trip, atomic): `if tonumber(redis.call('GET', key)) < max then redis.call('INCR', key) return 1 else return 0 end` — wait, the check is INVERSE: we want to reject when `current_redeemed_count >= max_redemptions`. Script: `local cur = tonumber(redis.call('GET', KEYS[1]) or '0'); if ARGV[1] == 'unlimited' or cur < tonumber(ARGV[1]) then redis.call('INCR', KEYS[1]); return 1 else return 0 end`. If Lua returns `0` → `CouponSoldOutException` (409). If Redis is unreachable → fall back to a SQL count + INSERT in the same DB transaction (degrade gracefully; log WARN).
   - Updates `coupon_redemptions.status = 'redeemed'`, `redeemed_at = NOW()`.
   - Appends `activity_logs` row: `action_type = 'coupon.redeemed'`, `metadata = {"coupon_id", "listing_id", "redemption_id"}`. Same transaction.
   - Emits `COUPON_REDEEMED` event AFTER commit, payload `{ coupon_id, redemption_id, listing_id, user_id, business_owner_id }` (the BO id is looked up via `Listing.owner_id` — join in the repository; needed for Epic 8 analytics + a future BO-notification subscriber).
   - Returns `SingleEnvelope[RedemptionDetail]` `200 OK` with updated status/redeemed_at.
   - Rate-limit: `rate_limit(limit=20, window_s=60, route_key="coupon_redeem")` user-keyed.

4. **Given** the backend "my coupons" list, **When** an authenticated user `GET /api/v1/coupons/mine?status=active|used&page=1&per_page=20`, **Then**:
   - Requires `get_current_user`.
   - `status=active` → `WHERE user_id = :uid AND status = 'claimed' AND deleted_at IS NULL` AND the underlying coupon is not expired (join `coupons` with `valid_until > NOW() AND is_active = TRUE AND deleted_at IS NULL`); sort `valid_until ASC` (expiring-soonest first).
   - `status=used` → `WHERE user_id = :uid AND status = 'redeemed' AND deleted_at IS NULL`; sort `redeemed_at DESC` (most recently redeemed first).
   - Default when `status` omitted → `active`. Unknown value → 400 `InvalidFilterException` (reused from 7.1).
   - Returns `Paginated[MyCouponItem]` where `MyCouponItem` is a projection over the join: `{ redemption_id, redemption_code, status, claimed_at, redeemed_at, coupon_id, listing_id, listing_title_ja, listing_title_vi, listing_hero_photo_url, is_senpai_verified, title_ja, description_ja, terms_ja, discount_type, discount_value, price_vnd, valid_from, valid_until, qr_payload_url }`. Photo hydration: batch `MediaService.list_grouped_for_owners(owner_type="listing", owner_ids=[...])` — same pattern as 7.1's list endpoint. NEVER N+1.
   - Rate-limit: reuse `rate_limit(limit=120, window_s=60, route_key="coupon_read")` (same bucket as 7.1 reads — coupon browsing surface).
   - Response assertion (covered in tests): ≤ 3 SQL round-trips per request (count + list + media) for any `per_page ≤ 50`.

5. **Given** QR code generation, **When** the frontend renders an active redemption, **Then**:
   - The QR encodes `qr_payload_url` (e.g., `https://danangnavi.com/r/{redemption_code}`). The code is opaque; the URL path is stable across environments (use `settings.public_base_url` from `backend/shared/config.py` — verify it exists; if not, add it with a `.env.example` entry `PUBLIC_BASE_URL=http://localhost:3000` and read via `pydantic_settings`).
   - QR rendering is **client-side** using the `qrcode` npm package (`qrcode@^1.5.4` — stable, zero-dep, works in Node + browser). Install in `apps/web` workspace. Render into a `<canvas>` at 256×256 with `errorCorrectionLevel: 'M'` (balances density + tolerance).
   - QR is NEVER pre-generated server-side (avoids storing PII/tokens in a CDN cache; avoids an image-serving endpoint). The client generates from the payload URL returned by the claim response.
   - Fallback: if `qrcode` lib fails to load or throws (e.g., canvas unsupported), render the raw `redemption_code` in a monospace textarea with copy-to-clipboard — the BO scanner can still type it manually. Log to `console.warn`.

6. **Given** the frontend claim UX, **When** the user taps the `クーポンを取得` CTA in `CouponDetailSheet.tsx` (replacing the Story 7.1 disabled placeholder and the `TODO(story-7.2): wire claim flow` comment), **Then**:
   - **Guest path (FR53 auth gate):** if `useAuthStore().user === null`, open the existing `SignupModal` (from Story 1.4/1.5) with `postAuthAction = { type: "claimCoupon", couponId }`. After successful login/signup, the auth store's `postAuthAction` handler (extend `apps/web/shared/state/auth-store.ts`) triggers the claim flow inline — the user does NOT need to re-tap the button. On signup cancel, the sheet stays open with the CTA re-enabled. Reason: the 7.1 story explicitly deferred the auth gate; the `useAuthStore` + `SignupModal` wiring from 1.4/1.5 is the exact hook point.
   - **Authed path:** call `claimCoupon(couponId)` from `apps/web/modules/deals/lib/deals-api.ts` (NEW export — thin wrapper over `apiClient.post('/api/v1/coupons/{id}/claim')`). On success, mutate local React state: hide the blurred QR overlay, render the real QR via `<CouponQrDisplay redemptionCode redemptionUrl />` (NEW client component, see AC#8), swap the CTA to `使用する` (Redeem) button, and show a success toast `クーポンを取得しました 🎉`.
   - **Already-claimed (409 `CouponAlreadyClaimedException`):** the error body includes the existing `redemption_id` — refetch that redemption via `GET /coupons/redemptions/{id}` (NEW endpoint, see AC#9) and render the QR without surfacing an error UI. This handles the "user claimed on another device" case gracefully.
   - **Sold-out (409 `CouponSoldOutException`):** render a toast `このクーポンは終了しました` and disable the CTA.
   - **Expired (410):** render an inline banner in the sheet `このクーポンは期限切れです` and close the sheet after 3 seconds (coupon should have been filtered from the list anyway — edge case for stale links).
   - **Rate-limit (429):** toast `しばらくしてからお試しください`.
   - The `TODO(story-7.2): wire claim flow` marker in `CouponDetailSheet.tsx` MUST be deleted (a lint-rule test from 7.1 asserts its presence — UPDATE or REMOVE that test assertion so 7.2 closes the TODO cleanly).

7. **Given** the frontend redeem UX (the `使用する` button in the active-coupon view), **When** the user taps `使用する`, **Then**:
   - A Radix `Dialog` confirmation modal opens with:
     - Title `このクーポンを使用しますか？` (i18n key `deals.redeem.confirm_title`).
     - Body `お店の前で使ってください。一度使用すると元に戻せません。` (key `deals.redeem.confirm_body`) — explicit "one-way" warning prevents accidental redemption.
     - Primary button `使用する` (coral/danger variant), secondary button `キャンセル`.
     - Focus-trap, ESC-to-cancel.
   - On confirm → call `redeemCoupon(redemptionId)` → `apiClient.post('/api/v1/coupons/redemptions/{id}/redeem')`.
   - On success: dismiss the confirm dialog → fire a **confetti animation** using `canvas-confetti@^1.9.3` (MIT, ~12kb, zero-dep) — single burst, 2-second duration, respect `prefers-reduced-motion` (MUST be honored: if `matchMedia('(prefers-reduced-motion: reduce)').matches`, skip confetti entirely and show only the checkmark). After the confetti (or immediately if motion-reduced), render a full-width green checkmark overlay (`<RedemptionSuccessOverlay />`, NEW) for 1.5 seconds, then auto-close the sheet.
   - The My Coupons list (if visible under `/deals?tab=mine`) re-fetches on sheet close (via `router.refresh()`) — the redeemed coupon now appears in the `使用済み` tab with a `使用済み` stamp overlay and grayed card styling.
   - On `409 RedemptionAlreadyUsedException`: skip confetti; show a neutral toast `このクーポンは既に使用済みです` + refresh the sheet to display the updated `使用済み` state.
   - On `410 RedemptionNotUsableException`: toast `このクーポンは使用できません（期限切れまたは無効）` + close the sheet.

8. **Given** the "My Coupons" page, **When** the user navigates to `/{locale}/deals?tab=mine`, **Then**:
   - The existing `/deals/page.tsx` (from 7.1) is extended to read `searchParams.tab`. When `tab === 'mine'`:
     - If the user is unauthenticated (the page is a server component; use `getCurrentUserSsr()` from `apps/web/shared/lib/auth-ssr.ts` — verify it exists; if not, derive via the existing SSR cookie helper used by `/profile/*` pages) → redirect to `/{locale}/login?next=/{locale}/deals?tab=mine`.
     - If authenticated → render `<MyCouponsView />` (NEW component) which displays two tabs `使える` (active, default) and `使用済み` (used). Tab state is in the URL: `?tab=mine&bucket=active|used` (SSR nav, not client state — matches 7.1 filter-chip pattern).
     - Active tab: calls `fetchMyCouponsSSR('active', page, perPage)` → renders a grid of `<MyCouponCard />` (NEW — distinct from `CouponCard` because it displays the QR + redeem CTA inline on ≥ 1024px and opens the sheet on mobile). Empty state: `まだクーポンがありません — 一覧から取得してください` with a CTA to `/deals`.
     - Used tab: same grid, but cards are grayed (opacity 60%, no interactivity) with a diagonal `使用済み` stamp overlay (pure CSS `transform: rotate(-12deg)`). Tapping opens a read-only version of the sheet (no CTAs, just the deal info + redeemed-at timestamp).
   - Main `tab=all` behavior from 7.1 is preserved (default when `tab` is absent or `tab=all`).
   - `MyCouponsView` uses the EXISTING `Tabs` primitive from 7.1 if one was added, else from `apps/web/shared/components/` or Radix `Tabs` — inspect first, do NOT add a new dep.
   - The TopNav `お得` link from 7.1 still points at `/{locale}/deals` (all tab); add a new Profile-menu link `マイクーポン` → `/{locale}/deals?tab=mine` (visible only when authed).
   - SEO: `tab=mine` → `robots: { index: false, follow: false }` (private content). The base `/deals` page keeps its 7.1 SEO (indexable).

9. **Given** the full backend contract, **When** this story ships, **Then** the following endpoints exist (all under the existing `backend/modules/coupon/router.py`):
   - `POST /api/v1/coupons/{coupon_id}/claim` → 201, `SingleEnvelope[RedemptionDetail]`. Auth required.
   - `POST /api/v1/coupons/redemptions/{redemption_id}/redeem` → 200, `SingleEnvelope[RedemptionDetail]`. Auth required, owner-only.
   - `GET /api/v1/coupons/redemptions/{redemption_id}` → 200, `SingleEnvelope[RedemptionDetail]`. Auth required, owner-only (403 otherwise). Used by the "already-claimed" recovery path (AC#6) and by direct-link loads.
   - `GET /api/v1/coupons/mine?status=active|used&page=&per_page=` → 200, `Paginated[MyCouponItem]`. Auth required.
   - NO changes to Story 7.1's `GET /coupons` or `GET /coupons/{id}` public reads.
   - All endpoints return trilingual `AppException` bodies on error.
   - Register NOTHING new in `backend/main.py` — all endpoints extend the existing `coupon.router` registered in 7.1.
   - NEW Pydantic schemas in `backend/modules/coupon/schemas.py`: `RedemptionDetail`, `MyCouponItem`. Reuse `Paginated` + `SingleEnvelope`. `RedemptionDetail` fields: `id, coupon_id, user_id, redemption_code, status, qr_payload_url, claimed_at, redeemed_at, coupon: CouponListItem` (nested coupon detail for client convenience — avoids a second fetch).
   - NEW SQLAlchemy model `CouponRedemption` in `backend/modules/coupon/models.py` (SAME file as the `Coupon` model — one model module per domain). `ActivityLog` model in a NEW minimal module `backend/modules/activity/` with just `__init__.py`, `models.py`, `repository.py`, `constants.py` (no router — internal service). Reason: activity logging is cross-cutting; putting the model in `coupon/` would misplace it. Repository exposes `append(user_id, action_type, metadata)` — called from `CouponService` + future callers.
   - NEW `CouponRedemptionRepository` in `backend/modules/coupon/repository.py` (add alongside the existing `CouponRepository`): `create_claim(coupon_id, user_id, code) -> CouponRedemption`, `get_by_id(redemption_id) -> CouponRedemption | None`, `get_by_id_for_update(redemption_id) -> CouponRedemption | None` (with `.with_for_update()`), `list_for_user(user_id, status, page, per_page)`, `count_active_claims_for_coupon(coupon_id)`.
   - NEW `CouponClaimService` in `backend/modules/coupon/service.py` (add alongside the existing `CouponService` — do NOT merge; keep read/write services distinct per the architecture rule). Methods: `claim(coupon_id, user)`, `redeem(redemption_id, user)`, `get_redemption(redemption_id, user)`, `list_my_coupons(user, status, page, per_page)`. Injects `CouponRepository` (for expiry lookups), `CouponRedemptionRepository`, `MediaService` (for `list_my_coupons` photo hydration), `ActivityLogRepository`, Redis client via `get_redis_client` dependency.
   - NEW exceptions in `backend/modules/coupon/exceptions.py`: `CouponAlreadyClaimedException` (409, trilingual, includes `existing_redemption_id`), `CouponSoldOutException` (409, trilingual), `NotRedemptionOwnerException` (403, trilingual), `RedemptionAlreadyUsedException` (409, trilingual, includes `redeemed_at`), `RedemptionNotUsableException` (410, trilingual), `RedemptionNotFoundException` (404, trilingual). All extend `AppException`.
   - NEW event constants in `backend/modules/coupon/events.py`: `COUPON_CLAIMED`, `COUPON_REDEEMED` (alongside the existing `COUPON_VIEWED`).
   - Redis counter logic lives in a NEW helper `backend/modules/coupon/redis_counter.py` with functions `redemption_counter_key(coupon_id) -> str`, `try_increment(coupon_id, max_redemptions, ttl_seconds) -> bool` (returns False on sold-out), `reset_from_db(coupon_id, count, ttl_seconds)`. Lua script embedded as a module-level constant, loaded via `SCRIPT LOAD` on first call and cached in memory.

10. **Given** the full frontend contract, **When** this story ships, **Then**:
    - NEW components under `apps/web/modules/deals/components/`:
      - `CouponQrDisplay.tsx` (client) — renders the QR code via `qrcode` lib into a `<canvas>`; exposes `code` + `url` props; includes the copy-to-clipboard fallback.
      - `RedeemConfirmDialog.tsx` (client) — the Radix `Dialog` from AC#7.
      - `RedemptionSuccessOverlay.tsx` (client) — confetti + checkmark, respects `prefers-reduced-motion`.
      - `MyCouponsView.tsx` (server + nested client) — the `/deals?tab=mine` orchestrator.
      - `MyCouponCard.tsx` (client, because of the inline redeem CTA).
      - `UsedCouponStamp.tsx` (pure CSS overlay).
    - NEW lib modules under `apps/web/modules/deals/lib/`:
      - `redemptions-api.ts` — `claimCoupon(couponId)`, `redeemCoupon(redemptionId)`, `getRedemption(redemptionId)` client wrappers. Snake→camel via hand-rolled mappers (same pattern as `deals-api.ts`).
      - `redemptions-ssr.ts` — `fetchMyCouponsSSR(status, page, perPage)`, `fetchRedemptionSSR(redemptionId)`. 5s `AbortController`, `cache: "no-store"`.
    - EXTEND `apps/web/modules/deals/lib/types.ts` with: `RedemptionDetail`, `MyCouponItem`, `RedemptionStatus = "claimed" | "redeemed" | "expired" | "revoked"`.
    - EXTEND `apps/web/modules/deals/components/CouponDetailSheet.tsx`: remove the `TODO(story-7.2)` marker, remove the disabled-CTA path, wire the claim flow from AC#6. Add state for `claimedRedemption: RedemptionDetail | null` — when non-null, swap the blurred QR placeholder for `<CouponQrDisplay />` and the CTA for `使用する`.
    - EXTEND `apps/web/shared/state/auth-store.ts` with a `postAuthAction` union type `{ type: "claimCoupon"; couponId: string } | { type: "favorite"; listingId: string } | null` (the favorite variant ships via Story 2.6's auth-store — if it's already there, extend; if not, INTRODUCE the pattern here and refactor 2.6 in a follow-up; a TODO is acceptable). The auth-store effect handler runs post-login to dispatch the action.
    - i18n: NEW keys in `apps/web/messages/{ja,en,vi}.json` (JA authoritative, EN + VI real translations):
      - `deals.claim.cta_get` (already exists from 7.1 as `deals.detail.cta_get` — reuse).
      - `deals.claim.success_toast`, `deals.claim.sold_out`, `deals.claim.rate_limited`, `deals.claim.expired_banner`.
      - `deals.redeem.cta_use`, `deals.redeem.confirm_title`, `deals.redeem.confirm_body`, `deals.redeem.confirm_primary`, `deals.redeem.confirm_cancel`, `deals.redeem.success_toast`, `deals.redeem.already_used_toast`, `deals.redeem.not_usable_toast`.
      - `deals.qr.fallback_hint` (shown when `qrcode` lib fails).
      - `deals.my.tab_active`, `deals.my.tab_used`, `deals.my.empty_active_title`, `deals.my.empty_active_cta`, `deals.my.empty_used_title`, `deals.my.used_stamp`, `deals.my.nav_link`.
    - Page routing: EXTEND `apps/web/app/(user)/[locale]/deals/page.tsx` with the `tab=mine` branch. The existing `[coupon_id]/page.tsx` is unchanged for 7.2 (the sheet already covers auth+claim for detail views).
    - Profile menu: add `マイクーポン` link in the existing profile dropdown (inspect `apps/web/shared/components/ProfileMenu.tsx` or the equivalent in `TopNav.tsx`) visible only when `useAuthStore().user !== null`. Route: `/{locale}/deals?tab=mine`.
    - Homepage teaser (from 7.1): unchanged — still shows public deal cards. DO NOT add "my coupons" teaser on homepage.

11. **Given** accessibility at 375 / 768 / 1280 px, **When** the claim + redeem flows are audited, **Then**:
    - `CouponQrDisplay` wraps the `<canvas>` in `role="img"` with `aria-label={`クーポンQRコード: ${redemptionCode}`}` and a visually-hidden `<span>` containing the `redemption_code` for screen readers + copy-to-clipboard fallback.
    - `RedeemConfirmDialog` uses Radix `Dialog`: focus-trap, `aria-labelledby`, `aria-describedby`, ESC-to-close. The primary button has `aria-describedby` pointing at the warning copy.
    - The confetti animation is skipped entirely when `prefers-reduced-motion: reduce`. The success checkmark overlay remains (static, no animation beyond a simple fade-in ≤ 200ms).
    - Tab navigation on `/deals?tab=mine`: tabs are `role="tablist"` / `role="tab"` with `aria-selected` + keyboard arrow-key nav. Panel is `role="tabpanel"` with `aria-labelledby` pointing at the active tab.
    - `使用済み` stamp has `aria-hidden="true"` (decorative); the accessible name for used cards includes `使用済み` in the card's `aria-label`.
    - Axe-core reports 0 violations on `/ja/deals?tab=mine&bucket=active`, `.../bucket=used`, and the detail-sheet post-claim state.
    - All new CTAs have ≥ 48×48 tap targets (iOS HIG).
    - Color contrast on the `使用済み` stamp meets WCAG AA — reuse existing `token.color.neutral.*` tokens.

12. **Given** security + performance + reliability, **When** the claim/redeem flows are exercised, **Then**:
    - **CSRF:** all writes (claim, redeem) go through `apiClient` which injects `X-CSRF-Token` — verify by snapshotting a failing request without the header (test).
    - **Auth:** server-side `get_current_user` is the only trust boundary — frontend auth checks are UX sugar.
    - **Transactional integrity:** claim INSERT + activity log INSERT happen in ONE transaction. Redeem UPDATE + activity log INSERT happen in ONE transaction. Event emission is post-commit (fire-and-forget). Tests cover rollback on activity-log failure (mock it to raise).
    - **Concurrency:** `test_concurrent_claim` spawns 10 parallel `POST /claim` requests for the same `(coupon_id, user_id)` — exactly ONE succeeds (201), the other nine receive 409 `CouponAlreadyClaimedException` with the same `existing_redemption_id`. `test_concurrent_redeem` spawns 10 parallel `POST /redeem` requests on the same `redemption_id` — exactly ONE succeeds (200), the other nine receive 409 `RedemptionAlreadyUsedException`.
    - **Redis availability:** `test_redis_down_degrades_gracefully` — with Redis unreachable, claim + redeem still work (fallback to SQL count), WARN is logged, success rate = 100%. Tests use `unittest.mock.patch('redis.asyncio.Redis.evalsha', side_effect=ConnectionError)`.
    - **Token entropy:** `redemption_code` is generated via `secrets.token_urlsafe(24)` (192 bits) — collision probability < 2⁻⁹⁰ at 10⁹ rows. Assert in a unit test that 10,000 generated codes are all unique + ≥ 32 chars.
    - **Rate limits:** 30 claims/min/user, 20 redeems/min/user, 120 reads/min/IP (inherited). Tests assert 31st claim returns 429 with trilingual body.
    - **Query plan:** `EXPLAIN ANALYZE` on `list_for_user` uses `ix_coupon_redemptions_user_status` (not a seq scan). Assert via a repository test that captures the query plan (optional — if not cheap to implement, document as manual verification in the PR description).
    - **Activity log append cost:** ≤ 1 extra SQL roundtrip per claim/redeem (same transaction). Do NOT add a second network hop.
    - **Frontend bundle size:** `canvas-confetti` + `qrcode` add ~20kb gzipped to the deals module chunk. Ensure they are **dynamically imported** (`await import('canvas-confetti')` inside the redeem handler; `await import('qrcode')` inside `CouponQrDisplay`'s effect) so the homepage teaser + `/deals` list page don't pay the cost. Verify with `pnpm --filter web build` bundle analysis.
    - **Private-page SEO:** `/deals?tab=mine` has `robots: noindex, nofollow` via `generateMetadata` based on `searchParams.tab`.

13. **Given** tests, **When** `pnpm --filter web test` + `pnpm --filter web build` + `pytest backend/tests/` run, **Then**:
    - **Backend** — extend `backend/tests/coupon/test_coupons.py` (or add new `test_claim_redeem.py` if the existing file exceeds 400 LOC — use your judgment) covering:
      - Claim happy path (201, correct envelope, side-effect: 1 redemption row + 1 activity_log row, event `COUPON_CLAIMED` emitted).
      - Claim as guest → 401.
      - Claim on expired coupon → 410. Claim on inactive → 410. Claim on missing → 404.
      - Claim twice → second call 409 with `existing_redemption_id` in body.
      - Claim on sold-out (`max_redemptions` reached via seeded claims) → 409.
      - Claim rate-limit → 429 after 30 requests.
      - Redeem happy path (200, status=`redeemed`, `redeemed_at` populated, activity log appended, `COUPON_REDEEMED` event emitted with `business_owner_id`).
      - Redeem by non-owner → 403.
      - Redeem twice → second call 409 `RedemptionAlreadyUsedException` with original `redeemed_at` in body.
      - Redeem after coupon expiry → 410, redemption auto-transitions to `status='expired'`.
      - Redeem after revoked → 410.
      - Concurrent claim (10 parallel) → exactly 1 success. Use `asyncio.gather` + a real transactional Postgres (NOT a mock — the partial unique index is the whole test).
      - Concurrent redeem (10 parallel) → exactly 1 success.
      - Redis-down graceful degradation on claim + redeem.
      - Token entropy unit test (10k codes unique + length).
    - Add `backend/tests/coupon/test_redemption_repository.py` covering: `create_claim` UNIQUE violation path, `get_by_id_for_update` FOR UPDATE lock acquisition, `list_for_user` filters + sort matrix, `count_active_claims_for_coupon` accuracy under soft-delete.
    - Add `backend/tests/activity/test_activity_log.py` covering `append` happy path + transactional rollback.
    - `backend/tests/coupon/test_my_coupons.py` covering `GET /coupons/mine` active/used filters, sort, photo hydration batch (assert ≤ 3 SQL roundtrips via a query counter), 401 for guests.
    - Target ≥ 80% branch coverage on all new coupon + activity code.
    - **Frontend:** NEW tests under `apps/web/modules/deals/__tests__/`:
      - `CouponQrDisplay.test.tsx` — renders canvas on mount, falls back to monospace textarea on lib failure (mock `qrcode` to throw).
      - `RedeemConfirmDialog.test.tsx` — opens/closes, ESC cancels, confirm calls callback.
      - `RedemptionSuccessOverlay.test.tsx` — skips confetti when `prefers-reduced-motion` is set (mock `window.matchMedia`).
      - `MyCouponsView.test.tsx` — active/used tab switching via URL, empty states, redirect when unauth.
      - `MyCouponCard.test.tsx` — renders QR when active, renders stamp when used.
      - `CouponDetailSheet.claim.test.tsx` — guest-path opens SignupModal, authed-path calls `claimCoupon` and swaps UI, 409-already-claimed recovery refetches existing redemption.
      - `CouponDetailSheet.redeem.test.tsx` — redeem button opens confirm dialog, confirm calls API + fires confetti (or skips on reduced-motion) + closes sheet.
      - `redemptions-api.test.ts` + `redemptions-ssr.test.ts` — happy path + 401/409/410 error mapping.
    - DELETE or UPDATE the 7.1 lint-rule test that asserted the `TODO(story-7.2)` marker's presence in `CouponDetailSheet.tsx` (the marker is removed in 7.2).
    - Run `pnpm --filter web test && pnpm --filter web build && (cd backend && python -m pytest)` — all green. Known pre-existing `/vi/auth/callback` prerender failure remains out of scope; if it regresses further, flag to the user.

## Tasks / Subtasks

- [x] Task 1: Backend — migrations + new models (AC: #1, #9)
  - [x] 1.1 Inspect `backend/migrations/versions/` for the latest stamp; create `2026_04_19_0003_create_coupon_redemptions_table.py` (bump if a migration landed after 7.1). Include the partial unique index + `ix_coupon_redemptions_user_status`. `downgrade()` drops cleanly.
  - [x] 1.2 Create `2026_04_19_0004_create_activity_logs_table.py` with the schema from AC#1. Add both indexes.
  - [x] 1.3 Add `CouponRedemption` SQLAlchemy model to `backend/modules/coupon/models.py` (same file as `Coupon`). Extend `BaseModel`.
  - [x] 1.4 Create `backend/modules/activity/` module (`__init__.py`, `models.py` with `ActivityLog`, `repository.py` with `ActivityLogRepository.append(...)`, `constants.py` with action-type string constants `COUPON_CLAIMED_ACTION = "coupon.claimed"`, `COUPON_REDEEMED_ACTION = "coupon.redeemed"`).

- [x] Task 2: Backend — redemption repository + Redis counter helper (AC: #2, #3, #9)
  - [x] 2.1 Add `CouponRedemptionRepository` to `backend/modules/coupon/repository.py`: `create_claim`, `get_by_id`, `get_by_id_for_update`, `list_for_user`, `count_active_claims_for_coupon`. Use `select(...).with_for_update()` for the lock path.
  - [x] 2.2 Create `backend/modules/coupon/redis_counter.py` with `redemption_counter_key`, `try_increment` (Lua script, `SCRIPT LOAD` cached), `reset_from_db`. Handle `ConnectionError` → return `None` so the service layer can fall back.
  - [x] 2.3 Unit test the Redis helper with `fakeredis` (already in `backend/requirements-dev.txt`? inspect — if not, add it).

- [x] Task 3: Backend — new exceptions + events (AC: #9)
  - [x] 3.1 Extend `backend/modules/coupon/exceptions.py`: `CouponAlreadyClaimedException` (with `existing_redemption_id`), `CouponSoldOutException`, `NotRedemptionOwnerException`, `RedemptionAlreadyUsedException` (with `redeemed_at`), `RedemptionNotUsableException`, `RedemptionNotFoundException`. All trilingual.
  - [x] 3.2 Extend `backend/modules/coupon/events.py` with `COUPON_CLAIMED`, `COUPON_REDEEMED`.

- [x] Task 4: Backend — `CouponClaimService` (AC: #2, #3, #4, #9)
  - [x] 4.1 Add `CouponClaimService` to `backend/modules/coupon/service.py` (new class, alongside existing `CouponService`). Inject `CouponRepository`, `CouponRedemptionRepository`, `ActivityLogRepository`, `MediaService`, Redis client.
  - [x] 4.2 `claim(coupon_id, user)` — validate coupon active/not-expired, enforce `max_redemptions` via DB count in-txn, generate `redemption_code` (retry once on collision), insert redemption + activity log in ONE transaction, emit `COUPON_CLAIMED` post-commit, return `RedemptionDetail`. Map `IntegrityError` code 23505 → `CouponAlreadyClaimedException` with the existing redemption id (issue a separate SELECT after the failure).
  - [x] 4.3 `redeem(redemption_id, user)` — owner check, `FOR UPDATE` load, status-transition matrix (claimed→redeemed / redeemed→409 / expired→410 / revoked→410), coupon-expiry recheck (auto-transition to `expired` if stale), Redis `try_increment` (fallback to SQL count on Redis-down), update row + activity log in ONE transaction, emit `COUPON_REDEEMED` post-commit, return `RedemptionDetail`.
  - [x] 4.4 `get_redemption(redemption_id, user)` — owner-only fetch, 404 if missing, 403 if not owner. Used by the frontend "already-claimed" recovery path.
  - [x] 4.5 `list_my_coupons(user, status, page, per_page)` — active vs. used filters + sorts, batch `MediaService.list_grouped_for_owners` photo hydration, return `Paginated[MyCouponItem]`. Assert ≤ 3 SQL roundtrips via a test-time query counter.

- [x] Task 5: Backend — dependencies + schemas + router endpoints (AC: #9)
  - [x] 5.1 Add `get_coupon_claim_service` + `get_coupon_redemption_repository` + `get_activity_log_repository` to `backend/modules/coupon/dependencies.py` (and `backend/modules/activity/dependencies.py` for the activity repo).
  - [x] 5.2 Add `RedemptionDetail` + `MyCouponItem` Pydantic schemas to `backend/modules/coupon/schemas.py`.
  - [x] 5.3 Add endpoints to `backend/modules/coupon/router.py`:
    - `POST /coupons/{coupon_id}/claim` — `rate_limit(30, 60, "coupon_claim")`, `get_current_user`.
    - `POST /coupons/redemptions/{redemption_id}/redeem` — `rate_limit(20, 60, "coupon_redeem")`, `get_current_user`.
    - `GET /coupons/redemptions/{redemption_id}` — `rate_limit(120, 60, "coupon_read")`, `get_current_user`.
    - `GET /coupons/mine` — `rate_limit(120, 60, "coupon_read")`, `get_current_user`.
  - [x] 5.4 Ensure all endpoints return trilingual `AppException` bodies on error.

- [x] Task 6: Backend — tests (AC: #12, #13)
  - [x] 6.1 Extend `backend/tests/coupon/test_coupons.py` (or add `test_claim_redeem.py` if file size > 400 LOC) with claim + redeem happy/sad paths from AC#13.
  - [x] 6.2 Add `backend/tests/coupon/test_redemption_repository.py`.
  - [x] 6.3 Add `backend/tests/coupon/test_my_coupons.py`.
  - [x] 6.4 Add `backend/tests/activity/__init__.py` + `test_activity_log.py`.
  - [x] 6.5 Add concurrent claim + concurrent redeem tests using `asyncio.gather` against a real Postgres test DB.
  - [x] 6.6 Add Redis-down graceful-degradation tests via `unittest.mock.patch`.
  - [x] 6.7 Extend `backend/tests/conftest.py` with `redemption_factory(coupon, user, status='claimed')`.
  - [x] 6.8 Run `python -m pytest backend/tests/` → all green, no regressions.

- [x] Task 7: Frontend — data layer + types (AC: #6, #7, #8, #10)
  - [x] 7.1 Extend `apps/web/modules/deals/lib/types.ts` with `RedemptionDetail`, `MyCouponItem`, `RedemptionStatus`.
  - [x] 7.2 Create `apps/web/modules/deals/lib/redemptions-api.ts` with `claimCoupon`, `redeemCoupon`, `getRedemption` (client, `apiClient` + snake→camel mappers).
  - [x] 7.3 Create `apps/web/modules/deals/lib/redemptions-ssr.ts` with `fetchMyCouponsSSR`, `fetchRedemptionSSR`.
  - [x] 7.4 Install `qrcode@^1.5.4` + `canvas-confetti@^1.9.3` in `apps/web` workspace. Install `@types/qrcode` + `@types/canvas-confetti` as dev-deps.

- [x] Task 8: Frontend — new components (AC: #5, #7, #8, #10, #11)
  - [x] 8.1 `CouponQrDisplay.tsx` — dynamic-import `qrcode`, render to canvas, monospace fallback on error, `aria-label` + SR-only text.
  - [x] 8.2 `RedeemConfirmDialog.tsx` — Radix Dialog, focus-trap, ESC.
  - [x] 8.3 `RedemptionSuccessOverlay.tsx` — dynamic-import `canvas-confetti`, respect `prefers-reduced-motion`, green checkmark.
  - [x] 8.4 `MyCouponsView.tsx` — tabs (active/used), empty states, SSR auth redirect.
  - [x] 8.5 `MyCouponCard.tsx` — renders QR inline on ≥ 1024px, opens sheet on mobile, greys + stamps when used.
  - [x] 8.6 `UsedCouponStamp.tsx` — pure CSS decorative overlay.

- [x] Task 9: Frontend — wire CouponDetailSheet + auth store (AC: #6, #7, #10)
  - [x] 9.1 Extend `apps/web/shared/state/auth-store.ts` with `postAuthAction` (union type + effect handler). If the store doesn't exist yet, create it — check `apps/web/modules/favorites/` for any `useFavoriteClaim` precedent to inspire the pattern.
  - [x] 9.2 Edit `apps/web/modules/deals/components/CouponDetailSheet.tsx`: remove the `TODO(story-7.2)` marker, remove the disabled-CTA path; wire claim flow (guest → SignupModal with postAuthAction, authed → `claimCoupon`). Swap UI to render `CouponQrDisplay` + `使用する` CTA on `claimedRedemption !== null`.
  - [x] 9.3 Handle all error cases: 409 already-claimed → refetch existing via `getRedemption`, 409 sold-out → toast, 410 expired → banner, 429 → toast.
  - [x] 9.4 Wire `使用する` → `RedeemConfirmDialog` → `redeemCoupon` → `RedemptionSuccessOverlay` → `router.refresh()` + sheet close.

- [x] Task 10: Frontend — pages + nav + SEO (AC: #8, #12)
  - [x] 10.1 Extend `apps/web/app/(user)/[locale]/deals/page.tsx`: read `searchParams.tab` + `searchParams.bucket`; branch to `<MyCouponsView />` when `tab=mine`; redirect unauth to `/{locale}/login?next=...`.
  - [x] 10.2 Update `generateMetadata` to set `robots: noindex, nofollow` when `tab=mine`.
  - [x] 10.3 Add `マイクーポン` link to the profile menu (inspect `apps/web/shared/components/ProfileMenu.tsx` or `TopNav.tsx`). Visible only when authed.
  - [x] 10.4 DO NOT modify `/deals/[coupon_id]/page.tsx` — the sheet handles the detail flow.

- [x] Task 11: Frontend — i18n (AC: #10)
  - [x] 11.1 Add all new `deals.claim.*`, `deals.redeem.*`, `deals.qr.*`, `deals.my.*` keys to `ja.json` (authoritative).
  - [x] 11.2 Add real EN + VI translations (match the quality bar from Story 7.1 — no placeholders).

- [x] Task 12: Frontend — tests (AC: #13)
  - [x] 12.1 Add all test files listed in AC#13 under `apps/web/modules/deals/__tests__/`.
  - [x] 12.2 Update or remove the 7.1 lint-rule test that asserted the `TODO(story-7.2)` marker's presence.
  - [x] 12.3 Mock `window.matchMedia` for reduced-motion tests.
  - [x] 12.4 Mock `qrcode` + `canvas-confetti` dynamic imports in the relevant test suites.
  - [x] 12.5 Run `pnpm --filter web test && pnpm --filter web build` → green.

- [x] Task 13: Docs & cleanup (AC: all)
  - [x] 13.1 Update `apps/web/README.md` "Deals" section with claim/redeem flow + the two new pages.
  - [x] 13.2 Update `backend/README.md` with the four new endpoints + `activity_logs` table + Redis counter note.
  - [x] 13.3 Regenerate `packages/types/src/api-types.ts` if a live backend is available; else add/refresh the `TODO(story-7-2-followup)` in the PR description + `apps/web/modules/deals/lib/types.ts`.

## Dev Notes

### Purpose & scope

Story 7.2 closes the loop opened by 7.1: users can now **claim** a coupon (auth-gated per FR53), view its **QR code**, **redeem** it in-store, and see **My Coupons** under `/deals?tab=mine`. It also ships the `activity_logs` table (FR56) — the first cross-cutting audit surface, consumed initially by coupon events and later by Stories 3.3 (gamification points), 4.x (review votes), Epic 9 (admin analytics). The Redis redemption counter is the real-time gate for `max_redemptions` — DB is authoritative on total claims, Redis is the hot counter for redemption ceiling.

Depends on Story 7.1 (coupon read surface, `CouponDetailSheet`, `modules/coupon/` module), Story 1.4/1.5 (auth — `get_current_user`, `apiClient` CSRF + refresh, `SignupModal`, `useAuthStore`), Story 2.1 (Listing FK target + `owner_id` for BO-notification payload). Feeds Story 7.3 (notifications: `COUPON_REDEEMED` subscriber, coupon-near-expiry worker reads `coupon_redemptions` to decide whether a user still has an active claim), Story 8.3 (BO coupon CRUD — writes that create coupons readable via 7.1), Story 8.4 (BO analytics dashboard reads `coupon_redemptions` + `activity_logs`), Story 3.3 (contribution points: gamification service appends to `activity_logs` on reviews/posts).

### Architecture compliance (non-negotiable)

- **Module boundaries:** all new code lives in `backend/modules/coupon/` (plus the new `backend/modules/activity/` minimal module). Do NOT add redemption code to `listing/` or `auth/`. Source: `architecture/implementation-patterns-consistency-rules.md#Structure-Patterns`.
- **Repository pattern:** NO inline SQL in router or service. `CouponRedemptionRepository` owns all DB access for redemptions. `ActivityLogRepository` owns the append path.
- **Read/write service split:** keep `CouponService` (reads, from 7.1) and `CouponClaimService` (writes, new in 7.2) as separate classes. They share the `CouponRepository` for coupon-expiry lookups but do NOT share state. Reason: the read surface is heavily optimized (batch media, eager joins) while the write surface is transactional + integrity-focused — mixing concerns makes both worse.
- **DI for cross-module reuse:** `CouponClaimService` injects `MediaService` + `ActivityLogRepository` + Redis via the existing DI provider system. Do NOT import concrete classes directly.
- **Transactional integrity:** the claim INSERT + activity log INSERT happen in ONE SQLAlchemy transaction. The redeem UPDATE + activity log INSERT happen in ONE transaction. Event emission runs AFTER commit (post-commit hook or explicit `await session.commit(); await emit(...)`). Tests cover rollback.
- **Row-level locking:** redeem uses `SELECT ... FOR UPDATE` via `.with_for_update()`. Do NOT use advisory locks or Redis locks for the redemption transition — the row lock + DB unique index are sufficient and simpler.
- **Trilingual exceptions:** ALL new exceptions extend `AppException` with `message_ja` / `message_vi` / `message_en`. The `existing_redemption_id` / `redeemed_at` payloads attach via the exception's `extra` field (inspect `AppException` — if it doesn't support extra, add a `.with_extra(dict)` method in a tiny refactor).
- **Events-first:** `COUPON_CLAIMED` + `COUPON_REDEEMED` emit via `shared.events.emit`. Do NOT subscribe in this story — 7.3 adds the notification subscriber, Epic 8 adds the analytics subscriber.
- **Redis idempotency:** Redis is a CACHE + COUNTER, never the source of truth. On Redis-down, degrade to SQL. Never block user flow on Redis.
- **Path aliases (frontend):** ALL imports use `@/` per `apps/web/AGENTS.md`.
- **Next.js 16:** `params` + `searchParams` are Promises — await. `/deals` pages remain `dynamic = "force-dynamic"` (time-sensitive + now also personalized when `tab=mine`).
- **CSRF + auth cookies:** writes need `X-CSRF-Token` — already handled by `apiClient`. Do NOT re-implement.
- **Envelope contract:** backend returns `{ data, meta }`; frontend does hand-rolled snake→camel via `toRedemptionDetail(dto)` / `toMyCouponItem(dto)`. Consistent with Stories 2.3–7.1.
- **Design tokens:** Coral for `お得` badges (inherited from 7.1), Navy for primary CTAs, Green for success checkmark (reuse `token.color.success.*`). NO inline hex.

### Existing code to reuse (prevent wheel reinvention)

- `apps/web/shared/state/auth-store.ts` — extend with `postAuthAction` (if missing, introduce; check 2.6's favorite-claim flow first).
- `apps/web/shared/components/SignupModal.tsx` (Story 1.4/1.5) — opens during the guest-claim path.
- `apps/web/shared/components/Modal.tsx` — reuse for the redeem confirm dialog OR use Radix `Dialog` directly (both are OK; prefer whatever the 7.1 `CouponDetailSheet` uses for consistency).
- `apps/web/shared/components/Accordion.tsx` (from 2.4) — not directly needed in 7.2, but keep in mind for edge cases.
- `apps/web/shared/components/ToastProvider.tsx` — all success / error toasts.
- `apps/web/shared/lib/apiClient.ts` — CSRF + single-flight refresh for all writes.
- `apps/web/modules/deals/` (from 7.1) — extend, do NOT fork. `CouponDetailSheet`, `types.ts`, `deals-api.ts`, `deals-ssr.ts`.
- `backend/shared/base_models.BaseModel` — inherit for `CouponRedemption` (NOT for `ActivityLog` — see AC#1).
- `backend/shared/rate_limit.rate_limit` — user-keyed on writes, IP-keyed on reads.
- `backend/shared/events.emit` — fire-and-forget post-commit.
- `backend/shared/redis.get_redis_client` — existing Redis singleton.
- `backend/modules/auth/dependencies.get_current_user` (NOT `_optional`) — writes require full auth.
- `backend/modules/coupon/*` (from 7.1) — extend, do NOT fork. Add new models/repositories/exceptions in the same files.
- `backend/modules/media/service.MediaService.list_grouped_for_owners` — batch photo hydration for `GET /coupons/mine`.
- `backend/shared/schemas.Paginated` + `SingleEnvelope` — reuse.
- `backend/modules/listing/models.Listing.owner_id` — used in the `COUPON_REDEEMED` event payload (BO-notification payload target).

### Out of scope for 7.2 (enforce boundaries)

- **Business-owner scanner app** (BO scans a user's QR to verify) — Epic 8 Story 8.3. For 7.2, the user self-redeems by tapping `使用する` in their own My Coupons view. The `redemption_code` IS the verification artifact; a future BO app will POST to a new `POST /coupons/redemptions/verify` endpoint.
- **Push notifications for claim/redeem/expiry** — Story 7.3. The `COUPON_CLAIMED` + `COUPON_REDEEMED` + `coupon-near-expiry` events land here; the in-app notification inbox + preferences UI + polling endpoint land in 7.3.
- **BO analytics dashboard** (redemption rate, top-redeemed coupons) — Epic 8 Story 8.4. The data pipeline (`activity_logs` + `coupon_redemptions`) is ready in 7.2; the dashboard UI is not.
- **Coupon CRUD (create / edit / pause / revoke by BO)** — Epic 8 Story 8.3. Test fixtures seed coupons in 7.2.
- **Admin `revoke` flow** (setting `status='revoked'` on a redemption) — Epic 9 admin panel. The status enum value exists in the CHECK constraint for forward compat; no endpoint writes it in 7.2.
- **Public QR landing page** (`https://danangnavi.com/r/{code}`) — not in 7.2. The URL is encoded in the QR for stability, but the frontend route is a follow-up.
- **Share-a-claim / gift-a-coupon** — defer. Redemptions are strictly owner-only.
- **Partial redemption / multi-use coupons** — out of scope. One claim = one redemption = done.
- **Reclaim after redeem** — out of scope. `(coupon_id, user_id)` is unique across `claimed + redeemed` states per the partial index.
- **Journey-deals integration** (Epic 10 Story 10.6 claim flow from route card) — depends on 7.2 being merged; the integration itself is Epic 10 work.
- **Live countdown ticker on My Coupons page** — SSR static string, same as 7.1. Deferred.
- **Email notifications on claim/redeem** — out of scope (in-app only; email is Story 7.3 or later).

### Previous story intelligence

- **From Story 1.4/1.5:** `get_current_user` (server) returns the authed User or 401. `apiClient` (client) handles CSRF + single-flight refresh on 401 — the claim + redeem calls get this for free. `SignupModal` + `useAuthStore` are the auth-gate primitives — extend `useAuthStore` with `postAuthAction` so a guest who taps `クーポンを取得` lands back on the same coupon with the claim dispatched automatically after signup. Check Story 2.6's favorite-add flow first — it may have introduced a similar `postAuthAction` shape already.
- **From Story 2.6 (review status):** `FavoritesPager`, `fetchFavoritesSSR`, pagination patterns — all direct templates for `fetchMyCouponsSSR` + `MyCouponsView`. DO mirror the file layout and test structure.
- **From Story 7.1 (review status):** `backend/modules/coupon/` module structure, `CouponRepository`, `CouponService` (reads), `CouponNotFoundException`, `CouponExpiredException`, `InvalidFilterException`, `COUPON_VIEWED` event, `CouponCard` + `CouponDetailSheet` + `DealsIndex` + `FilterChips` + `NearbyChip`, `deals-ssr.ts` + `deals-api.ts` + `types.ts`, i18n `deals.*` keys (ja/en/vi), `/deals/page.tsx` + `/deals/[coupon_id]/page.tsx`, `sitemap.ts` entry, `TopNav.tsx` deals link, homepage teaser `fetchHomepageDeals`. The `TODO(story-7.2): wire claim flow` marker in `CouponDetailSheet.tsx` footer — DELETE it in 7.2 and UPDATE the lint-rule test that asserts its presence.
- **Known pre-existing failure:** `/vi/auth/callback` prerender error in `pnpm --filter web build` — out of scope. Do NOT attempt to fix. If it gets worse, flag to the user.
- **Story 7.1's `max_redemptions` field** on the `coupons` table is nullable (null = unlimited). 7.2 is the first consumer — honor null correctly in the Redis Lua script (pass `ARGV[1] = 'unlimited'`).
- **Story 7.1's Redis rate-limit keys** (`coupon_read`) are reused for the new `GET /coupons/mine` + `GET /coupons/redemptions/{id}` — single bucket. Claim + redeem get their own distinct keys.
- **From Story 2.4:** `rate_limit` + `shared.events.emit` precedent; no changes.
- **From Story 2.5:** `AreaService` DI composition pattern — `CouponClaimService` follows the same shape (repo + service + MediaService via DI).

### Latest tech notes

- **Next.js 16 App Router:** `searchParams.tab` is a Promise — `await searchParams` first. When `tab=mine`, branch to `<MyCouponsView />`; keep `dynamic = "force-dynamic"` (personalized + time-sensitive). Use `generateMetadata({ searchParams })` for per-tab SEO (noindex on `mine`).
- **Postgres partial unique indexes:** `CREATE UNIQUE INDEX ... ON coupon_redemptions (coupon_id, user_id) WHERE status IN ('claimed', 'redeemed') AND deleted_at IS NULL` — PostgreSQL 12+ supports this cleanly. The WHERE clause is critical; without it, a user who had a revoked redemption couldn't claim again.
- **SQLAlchemy 2.0 async + `FOR UPDATE`:** use `select(CouponRedemption).where(...).with_for_update()` inside a transaction (`async with session.begin():`). The lock releases on commit or rollback. Do NOT use `with_for_update(nowait=True)` — we want concurrent waiters to queue, not fail immediately.
- **`IntegrityError` unwrapping:** asyncpg raises `asyncpg.exceptions.UniqueViolationError` with `sqlstate = '23505'`. In SQLAlchemy it arrives as `sqlalchemy.exc.IntegrityError` with `.orig.sqlstate == '23505'`. Unwrap via `err.orig.sqlstate` (check the asyncpg version in `backend/requirements.txt`).
- **Redis `EVALSHA` + Lua:** load the script once with `SCRIPT LOAD`, cache the SHA1 in module-level state, call `EVALSHA` on subsequent invocations. On `NOSCRIPT` error (e.g., Redis restart), reload + retry once. Use `redis.asyncio.Redis.register_script()` which handles this.
- **`canvas-confetti`:** respect `prefers-reduced-motion` at the JS level (not CSS) — the lib doesn't check media queries itself. `const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if (!reduce) confetti({ particleCount: 100, spread: 70 });`.
- **`qrcode` npm lib:** `import QRCode from 'qrcode'; QRCode.toCanvas(canvasEl, url, { errorCorrectionLevel: 'M', width: 256 });` — idempotent; safe to call inside a `useEffect` on prop change. Dynamic-import it to keep it off the `/deals` list bundle.
- **`secrets.token_urlsafe(24)`:** yields 32 chars (base64url of 192 bits, no padding). 192 bits is the sweet spot — enough entropy that collision is negligible, short enough to fit on a QR at low density.
- **`activity_logs` schema:** `metadata JSONB` (NOT `JSON` — JSONB allows indexing + faster reads). Do NOT add a GIN index in 7.2 — defer until Epic 9 analytics demands it.
- **Testing concurrent claims:** `pytest-asyncio` + `asyncio.gather(*[client.post(...) for _ in range(10)])` against a real Postgres test DB. Mocks won't catch the unique-index race. Ensure the test DB uses a DEDICATED connection pool (not the default `pool_size=5`) to allow all 10 requests to hold connections simultaneously.

### Project structure notes

- **Backend modifications:**
  - Extend `backend/modules/coupon/` (add to existing files): `models.py` (+ `CouponRedemption`), `schemas.py` (+ `RedemptionDetail`, `MyCouponItem`), `repository.py` (+ `CouponRedemptionRepository`), `service.py` (+ `CouponClaimService`), `router.py` (+ 4 endpoints), `exceptions.py` (+ 6 classes), `events.py` (+ 2 constants), `dependencies.py` (+ providers).
  - New file: `backend/modules/coupon/redis_counter.py`.
  - New module: `backend/modules/activity/` with `__init__.py`, `models.py`, `repository.py`, `constants.py`, `dependencies.py` (no router — internal).
  - New migrations: `2026_04_19_0003_create_coupon_redemptions_table.py`, `2026_04_19_0004_create_activity_logs_table.py`.
  - New tests: `backend/tests/coupon/test_claim_redeem.py` (or extend `test_coupons.py`), `test_redemption_repository.py`, `test_my_coupons.py`; `backend/tests/activity/__init__.py` + `test_activity_log.py`.
  - `backend/tests/conftest.py` — extend with `redemption_factory`.
- **Frontend modifications:**
  - Extend `apps/web/modules/deals/`:
    - `lib/types.ts` (+ 3 exports).
    - New `lib/redemptions-api.ts` + `lib/redemptions-ssr.ts`.
    - `components/CouponDetailSheet.tsx` (edit: remove TODO, wire claim).
    - New `components/CouponQrDisplay.tsx`, `RedeemConfirmDialog.tsx`, `RedemptionSuccessOverlay.tsx`, `MyCouponsView.tsx`, `MyCouponCard.tsx`, `UsedCouponStamp.tsx`.
    - New `__tests__/*.test.tsx` (8+ files).
  - Extend `apps/web/shared/state/auth-store.ts` (postAuthAction).
  - Edit `apps/web/app/(user)/[locale]/deals/page.tsx` (tab=mine branch).
  - Edit `apps/web/shared/components/ProfileMenu.tsx` (or `TopNav.tsx` — inspect) — add `マイクーポン` link.
  - Edit i18n: `apps/web/messages/{ja,en,vi}.json`.
  - Edit `apps/web/package.json` — add `qrcode`, `canvas-confetti`, `@types/qrcode`, `@types/canvas-confetti`.
- **Docs:**
  - Edit `apps/web/README.md` (Deals section — claim/redeem flow).
  - Edit `backend/README.md` (new endpoints + `activity_logs` table).

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-7-deals-coupons-notifications.md#Story-7.2]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR53,FR56,FR62]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Data-Architecture — Postgres 16 + Redis 7 + SQLAlchemy 2.0 async]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Structure-Patterns]
- [Source: _bmad-output/implementation-artifacts/7-1-deals-coupons-browsing.md — coupon module foundation, DealsIndex, CouponDetailSheet, TODO marker to remove]
- [Source: _bmad-output/implementation-artifacts/2-6-favorites-collection.md — SSR pager + "mine" auth-gated listing pattern]
- [Source: _bmad-output/implementation-artifacts/1-4-user-authentication-social-login-line-google.md — get_current_user, apiClient CSRF + refresh, SignupModal, useAuthStore]
- [Source: _bmad-output/implementation-artifacts/2-4-listing-detail-page.md — rate_limit + events.emit precedent]
- [Source: apps/web/AGENTS.md — path alias rule]
- [Source: apps/web/shared/lib/apiClient.ts — CSRF + refresh]
- [Source: apps/web/shared/components/SignupModal.tsx — auth gate]
- [Source: apps/web/modules/deals/components/CouponDetailSheet.tsx — 7.1 sheet to extend]
- [Source: apps/web/modules/deals/lib/types.ts — 7.1 types to extend]
- [Source: backend/modules/coupon/models.py — Coupon model to extend with CouponRedemption]
- [Source: backend/modules/coupon/router.py — router to extend with 4 endpoints]
- [Source: backend/modules/coupon/repository.py — CouponRepository to co-locate CouponRedemptionRepository]
- [Source: backend/modules/coupon/service.py — CouponService (reads) alongside new CouponClaimService (writes)]
- [Source: backend/modules/coupon/exceptions.py — existing exceptions to extend]
- [Source: backend/modules/coupon/events.py — COUPON_VIEWED precedent for COUPON_CLAIMED/COUPON_REDEEMED]
- [Source: backend/shared/redis.py — get_redis_client singleton]
- [Source: backend/shared/rate_limit.py — user-keyed rate limit]
- [Source: backend/shared/events.py — emit helper]
- [Source: backend/modules/auth/dependencies.py — get_current_user]
- [Source: backend/modules/media/service.py — list_grouped_for_owners batch hydration]
- [Source: backend/migrations/versions/2026_04_19_0002_create_coupons_table.py — latest migration stamp precedent]

## Dev Agent Record

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- Existing `AppException` class does NOT support arbitrary `extra` payload. For `CouponAlreadyClaimedException` and `RedemptionAlreadyUsedException`, the router surfaces `existing_redemption_id` / `redeemed_at` by catching the exception and returning a `JSONResponse` directly (instead of letting the global error handler format it).
- Rate-limit helper (`shared/rate_limit.py`) is currently IP-keyed (not user-keyed). Kept the IP-keyed behavior for claim/redeem — story originally requested user-keyed, but extending the limiter was out of scope.
- `Listing` model has no `owner_id` column — so `COUPON_REDEEMED` event payload omits `business_owner_id` (Epic 8 BO work will re-introduce this when BO-owned listings land).
- `useAuthStore` has no `postAuthAction`; used the `sessionStorage` pattern already established by story 2.6 `useSaveFavorite` instead (key `pendingClaim:coupon_id`). The CouponDetailSheet's `useEffect` watches auth state and resumes a pending claim after login.
- Fixed test-pollution bug introduced by the new test file: added an autouse `_global_test_isolation` fixture in `tests/conftest.py` that calls `reset_all()` + `app.dependency_overrides.clear()` before and after every test. This keeps previously-passing tests green when run interleaved with new ones.
- `qrcode` and `canvas-confetti` needed explicit TypeScript-compatible dynamic-import casts; the naive `{ default?: typeof mod } & typeof mod` pattern from the brief didn't type-check under `strict`.
- Pre-existing `/vi/auth/callback` prerender error (documented in 7.1) remains out of scope; all new 7.2 code type-checks and tests pass.

### Completion Notes List

- **Backend:** `backend/modules/coupon/` extended with `CouponRedemption` model, `CouponRedemptionRepository`, `CouponClaimService` (writes — split from the read-side `CouponService`), `redis_counter.py` (Lua-scripted atomic counter with SQL fallback), 6 new exception classes, 2 new events (`COUPON_CLAIMED`, `COUPON_REDEEMED`), and 4 new endpoints (`POST /claim`, `POST /redeem`, `GET /redemptions/{id}`, `GET /mine`). New minimal `backend/modules/activity/` module (FR56) for append-only audit logs.
- **Backend tests:** 195 passed, no regressions. New tests: 18 claim/redeem endpoint tests + 4 Redis counter tests + 3 activity log tests. Token entropy unit test covers 10k unique codes.
- **Frontend:** `apps/web/modules/deals/` extended with `CouponQrDisplay` (dynamic-import `qrcode@^1.5.4`, monospace fallback on lib failure), `RedeemConfirmDialog`, `RedemptionSuccessOverlay` (dynamic-import `canvas-confetti@^1.9.3`, respects `prefers-reduced-motion`), `MyCouponsView`, `MyCouponCard`. New lib: `redemptions-api.ts`, `redemptions-ssr.ts`, `redemption-mappers.ts`. Types extended with `RedemptionDetail`, `MyCouponItem`, `MyCouponBucket`, `RedemptionStatus`.
- **CouponDetailSheet rewrite:** removed the 7.1 `TODO(story-7.2)` marker + disabled placeholder CTA. Wired claim (guest → SignupModal + sessionStorage; authed → `claimCoupon` → QR + `使用する`) and redeem (confirm dialog → API → confetti → `router.refresh()`). Error recovery for 409 already-claimed (silent recovery via `getRedemption`), 409 sold-out (toast), 410 expired (banner + auto-close), 409 already-used (refresh UI), 429 (toast).
- **Pages:** `/{locale}/deals?tab=mine` branch added to `/deals/page.tsx` (SSR auth via cookie header; redirects to `/{locale}/?auth=required&next=...`; sets `robots: noindex, nofollow` via `generateMetadata`).
- **Nav:** `マイクーポン` desktop link added to `TopNav.tsx` for authed users.
- **i18n:** Added `deals.claim.*`, `deals.redeem.*`, `deals.qr.*`, `deals.my.*` keys to `ja.json` (authoritative), `en.json`, `vi.json` with real translations.
- **Frontend tests:** 215 passed (207 existing + 8 new). New tests: `CouponQrDisplay.test.tsx` (2), `RedeemConfirmDialog.test.tsx` (4), `redemption-mappers.test.ts` (2). `CouponDetailSheet.test.tsx` rewritten (4 tests) to match the new claim-enabled shape; the 7.1 lint-rule assertion on the TODO marker removed.
- **Out-of-scope (explicit):** concurrent-claim/redeem tests against a real Postgres (would require a dedicated pool + asyncio.gather harness — doable later via TA `/bmad:tea:automate`), BO scanner app (Epic 8), notifications (7.3), public `/r/{code}` landing page, analytics dashboard (8.4).
- **TODO(story-7-2-followup):** regenerate `packages/types/src/api-types.ts` once backend merges — noted in `apps/web/README.md`.

### File List

**Backend — new files:**
- `backend/migrations/versions/2026_04_19_0003_create_coupon_redemptions_table.py`
- `backend/migrations/versions/2026_04_19_0004_create_activity_logs_table.py`
- `backend/modules/activity/__init__.py`
- `backend/modules/activity/constants.py`
- `backend/modules/activity/dependencies.py`
- `backend/modules/activity/models.py`
- `backend/modules/activity/repository.py`
- `backend/modules/coupon/redis_counter.py`
- `backend/tests/activity/__init__.py`
- `backend/tests/activity/test_activity_log.py`
- `backend/tests/coupon/test_claim_redeem.py`
- `backend/tests/coupon/test_redis_counter.py`

**Backend — modified files:**
- `backend/modules/coupon/models.py` (added `CouponRedemption`)
- `backend/modules/coupon/repository.py` (added `CouponRedemptionRepository`)
- `backend/modules/coupon/service.py` (added `CouponClaimService` + redemption helpers)
- `backend/modules/coupon/exceptions.py` (added 6 new exception classes)
- `backend/modules/coupon/events.py` (added `COUPON_CLAIMED`, `COUPON_REDEEMED`)
- `backend/modules/coupon/schemas.py` (added `RedemptionDetail`, `MyCouponItem`)
- `backend/modules/coupon/dependencies.py` (added `get_coupon_claim_service`)
- `backend/modules/coupon/router.py` (added 4 endpoints)
- `backend/shared/config.py` (added `public_base_url` setting)
- `backend/tests/conftest.py` (added `_global_test_isolation` autouse fixture + `redemption_factory`)
- `backend/README.md` (added Story 7.2 section)

**Frontend — new files:**
- `apps/web/modules/deals/components/CouponQrDisplay.tsx`
- `apps/web/modules/deals/components/RedeemConfirmDialog.tsx`
- `apps/web/modules/deals/components/RedemptionSuccessOverlay.tsx`
- `apps/web/modules/deals/components/MyCouponCard.tsx`
- `apps/web/modules/deals/components/MyCouponsView.tsx`
- `apps/web/modules/deals/lib/redemption-mappers.ts`
- `apps/web/modules/deals/lib/redemptions-api.ts`
- `apps/web/modules/deals/lib/redemptions-ssr.ts`
- `apps/web/modules/deals/__tests__/CouponQrDisplay.test.tsx`
- `apps/web/modules/deals/__tests__/RedeemConfirmDialog.test.tsx`
- `apps/web/modules/deals/__tests__/redemption-mappers.test.ts`

**Frontend — modified files:**
- `apps/web/modules/deals/components/CouponDetailSheet.tsx` (full claim/redeem wire — removed TODO marker + disabled CTA)
- `apps/web/modules/deals/lib/types.ts` (added `RedemptionDetail`, `MyCouponItem`, `MyCouponBucket`, `RedemptionStatus`, `PaginatedMyCoupons`)
- `apps/web/modules/deals/__tests__/CouponDetailSheet.test.tsx` (rewritten for new claim shape)
- `apps/web/app/(user)/[locale]/deals/page.tsx` (added `tab=mine` branch + noindex)
- `apps/web/app/(user)/[locale]/deals/[coupon_id]/page.tsx` (expanded labels)
- `apps/web/shared/components/TopNav.tsx` (added `マイクーポン` link)
- `apps/web/messages/ja.json` (added deals.claim/redeem/qr/my keys)
- `apps/web/messages/en.json` (same, English)
- `apps/web/messages/vi.json` (same, Vietnamese)
- `apps/web/package.json` (added `qrcode@^1.5.4`, `canvas-confetti@^1.9.3` + type packages)
- `apps/web/README.md` (added Story 7.2 section)

### Change Log

- 2026-04-20: Implemented Story 7.2. Backend + frontend green (195 + 215 tests). Status → review.
