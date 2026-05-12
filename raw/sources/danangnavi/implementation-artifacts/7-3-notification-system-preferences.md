# Story 7.3: Notification System & Preferences

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a registered Japanese / Vietnamese user of DaNangNavi,
I want to receive relevant in-app notifications (new review on a saved listing, event update, contribution milestone, coupon near expiry) with a clear unread count badge on the Profile tab, browse them from `/{locale}/profile/notifications`, tap to jump to the linked content, and control what I receive via per-category preferences (reviews / events / community / deals / milestones) and a frequency selector (real-time / daily digest / off),
so that I stay informed about the things I care about without being overwhelmed — closing Epic 7 by wiring the **notification spine** that Stories 3.3 (milestones), 4.x (review events), 5.4 (events), 7.2 (`COUPON_REDEEMED`/claim lifecycle) and future Epic 8 business-owner alerts will all publish into, plus the **unified polling endpoint `GET /api/v1/sync`** that FR adaptive-polling + 304-Not-Modified architecture is built around.

## Acceptance Criteria

1. **Given** the backend notification module, **When** database migrations run, **Then**:
   - Alembic migration `{next_stamp}_create_notifications_and_preferences_tables.py` under `backend/migrations/versions/` (7.2 shipped `2026_04_19_0004_create_activity_logs_table.py`; this story's stamp is `2026_04_20_0001_create_notifications_and_preferences_tables.py` — inspect the directory and bump if another migration lands first) creates two tables in ONE migration (same logical unit; downgrade drops both cleanly):
     - **Table `notifications`:**
       - `id UUID PK DEFAULT uuid_generate_v4()`.
       - `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`.
       - `type VARCHAR(50) NOT NULL` — constrained via app-level enum `NotificationType` (see AC#2); not a PG ENUM type (avoid ALTER TYPE migrations later when new types are added in 3.3/4.x/5.4/8.x).
       - `title_ja TEXT NOT NULL`, `body_ja TEXT NOT NULL`, `title_vi TEXT NOT NULL`, `body_vi TEXT NOT NULL`, `title_en TEXT NOT NULL`, `body_en TEXT NOT NULL` — **pre-rendered at create-time** from localized templates keyed by `type` + `metadata` (see AC#3). Reason: notifications are append-once, read-many; pre-rendering avoids template-engine coupling at read time and makes SSR trivial. Storage cost is acceptable (< 600 bytes/row avg for the 4 MVP types).
       - `link VARCHAR(500)` (nullable) — in-app path prefix WITHOUT locale (e.g., `/listings/{listing_id}`, `/community/events/{event_id}`, `/profile/badges`, `/deals?tab=mine`). Frontend prepends `/{locale}` when rendering href.
       - `metadata JSONB NOT NULL DEFAULT '{}'::jsonb` — the raw event payload fragment used to render templates + diagnostics.
       - `is_read BOOLEAN NOT NULL DEFAULT FALSE`.
       - `read_at TIMESTAMPTZ` (nullable — set atomically when `is_read` flips TRUE).
       - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
       - `deleted_at TIMESTAMPTZ` (nullable — soft delete for admin/user purge flows, not used in 7.3 but required for BaseModel contract).
       - Extend `BaseModel` (inherits `id`, `created_at`, `updated_at`, `deleted_at`). `updated_at` exists for BaseModel uniformity even though most rows are immutable post-create (mutates on `is_read` flip).
       - Index `ix_notifications_user_created` ON `(user_id, created_at DESC) WHERE deleted_at IS NULL` — powers list endpoint.
       - **Partial index `ix_notifications_user_unread` ON `(user_id) WHERE is_read = FALSE AND deleted_at IS NULL`** — powers unread-count on `/sync` (COUNT(*) with partial index = index-only scan, O(k) where k = unread rows, typically < 20).
       - **Unique partial index `uq_notifications_dedupe_coupon_expiring` ON `(user_id, (metadata->>'redemption_id'))` WHERE `type = 'coupon_near_expiry'` AND `deleted_at IS NULL`** — prevents the hourly expiry-sweep job (AC#6) from creating duplicate rows for the same redemption. NOTE: future non-coupon dedupe cases should get their own partial unique indexes, NOT a generic dedupe column; YAGNI for 7.3.
     - **Table `notification_preferences`:**
       - `id UUID PK`, `user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`.
       - `category VARCHAR(30) NOT NULL` — app-level enum `NotificationCategory` (`reviews`, `events`, `community`, `deals`, `milestones`).
       - `frequency VARCHAR(20) NOT NULL DEFAULT 'realtime'` — CHECK `frequency IN ('realtime', 'daily', 'off')`. Reason for storing `realtime` as a default row (not absence-means-realtime): UI needs to render the selected value without first needing to know the default, and it makes digest jobs (post-MVP) a simple `WHERE frequency = 'daily'` query.
       - `created_at`, `updated_at` TIMESTAMPTZ.
       - **Unique constraint** `uq_notification_preferences_user_category` ON `(user_id, category)` — one row per (user, category).
       - Index `ix_notification_preferences_user` ON `(user_id)`.
       - NO `deleted_at` — preferences are config, not content; hard-delete on user deletion via FK cascade.
     - `downgrade()` drops `notification_preferences`, then `notifications`, plus all indexes cleanly.
   - No data backfill required — existing users get default prefs lazily on first `GET /preferences` call (see AC#5), so the migration has zero runtime side-effects.

2. **Given** the backend domain enums, **When** the module is loaded, **Then** `backend/modules/notification/constants.py` defines:
   - `class NotificationType(str, enum.Enum)` with MVP values: `REVIEW_ON_SAVED_LISTING = "review_on_saved_listing"`, `EVENT_UPDATED = "event_updated"`, `CONTRIBUTION_MILESTONE = "contribution_milestone"`, `COUPON_NEAR_EXPIRY = "coupon_near_expiry"`. Each value is the raw DB string. DO NOT use `auto()` — future rows must remain stable across deploys. Placeholder values for Story 4.x / 5.4 / 3.3 listeners are NOT added yet; when those stories land they extend this enum and add subscribers.
   - `class NotificationCategory(str, enum.Enum)` with values: `REVIEWS`, `EVENTS`, `COMMUNITY`, `DEALS`, `MILESTONES`. Same rationale — raw strings.
   - `class NotificationFrequency(str, enum.Enum)` with values: `REALTIME = "realtime"`, `DAILY = "daily"`, `OFF = "off"`.
   - `TYPE_TO_CATEGORY: dict[NotificationType, NotificationCategory]` — maps each type → its gating category (e.g., `REVIEW_ON_SAVED_LISTING → REVIEWS`, `EVENT_UPDATED → EVENTS`, `CONTRIBUTION_MILESTONE → MILESTONES`, `COUPON_NEAR_EXPIRY → DEALS`). This is the ONLY place the mapping is defined; service layer reads it to enforce prefs.
   - `DAILY_DIGEST_WINDOW_HOURS = 24` constant (post-MVP hint — referenced in code comments but no digest job ships in 7.3).

3. **Given** the template rendering layer, **When** a subscriber needs to create a notification, **Then**:
   - NEW module `backend/modules/notification/templates.py` exports a single function `render(type: NotificationType, metadata: dict) -> dict[str, str]` returning `{"title_ja", "body_ja", "title_vi", "body_vi", "title_en", "body_en", "link"}`.
   - Templates are pure Python f-strings embedded as module-level dicts keyed by `NotificationType`. Example:
     ```python
     TEMPLATES = {
       NotificationType.REVIEW_ON_SAVED_LISTING: {
         "title_ja": "保存した「{listing_title_ja}」に新しいレビュー",
         "body_ja":  "{reviewer_display_name} さんがレビューを投稿しました。",
         "title_vi": "Có review mới cho \"{listing_title_vi}\" bạn đã lưu",
         "body_vi":  "{reviewer_display_name} vừa đăng một review.",
         "title_en": "New review on your saved listing \"{listing_title_en}\"",
         "body_en":  "{reviewer_display_name} just posted a review.",
         "link":     "/listings/{listing_id}",
       },
       NotificationType.EVENT_UPDATED: {
         "title_ja": "参加予定の「{event_title_ja}」が更新されました",
         "body_ja":  "開催日時や場所が変更された可能性があります。詳細をご確認ください。",
         "title_vi": "Sự kiện \"{event_title_vi}\" bạn tham gia đã được cập nhật",
         "body_vi":  "Thời gian hoặc địa điểm có thể đã thay đổi. Vui lòng xem chi tiết.",
         "title_en": "Event \"{event_title_en}\" you joined was updated",
         "body_en":  "Date or venue may have changed. Tap to view details.",
         "link":     "/community/events/{event_id}",
       },
       NotificationType.CONTRIBUTION_MILESTONE: {
         "title_ja": "おめでとう！{badge_label_ja} を獲得しました 🎉",
         "body_ja":  "{total_points} ポイント達成！あなたは今、ダナン通の先輩です。",
         "title_vi": "Chúc mừng! Bạn đã đạt {badge_label_vi} 🎉",
         "body_vi":  "{total_points} điểm — giờ bạn là Senpai của Đà Nẵng!",
         "title_en": "Congrats! You've unlocked {badge_label_en} 🎉",
         "body_en":  "{total_points} points — you're now a Da Nang Senpai!",
         "link":     "/profile/badges",
       },
       NotificationType.COUPON_NEAR_EXPIRY: {
         "title_ja": "クーポン「{coupon_title_ja}」があと24時間で期限切れ",
         "body_ja":  "{business_name_ja} で使えるクーポンの有効期限が迫っています。",
         "title_vi": "Coupon \"{coupon_title_vi}\" sắp hết hạn trong 24 giờ",
         "body_vi":  "Coupon dùng tại {business_name_vi} sắp hết hạn.",
         "title_en": "Coupon \"{coupon_title_en}\" expires in 24 hours",
         "body_en":  "Your coupon for {business_name_en} is about to expire.",
         "link":     "/deals?tab=mine",
       },
     }
     ```
   - `render()` uses `str.format_map(metadata)` with a `defaultdict(lambda: "")` fallback so a missing key renders empty rather than raising `KeyError` — but the service logs a WARN if any required placeholder is empty after render.
   - Unit tests assert every `NotificationType` has a full set of 7 template keys (6 localized strings + `link`) and that all placeholders referenced in the strings are present in the test metadata fixtures (prevents template/metadata drift).

4. **Given** the backend event subscribers, **When** domain events fire, **Then** `backend/modules/notification/subscribers.py` registers handlers via `shared.events.subscribe` (the existing in-process bus; see `backend/shared/events.py`) at module import time. The module is imported from `backend/main.py` in a `register_event_handlers()` helper called during FastAPI startup (add a new helper or extend the existing one — inspect first; DO NOT import subscribers inline at router mount time because the subscription must happen once per process, not per request).
   - Subscriber `on_coupon_redeemed(payload)` listens to `COUPON_REDEEMED` (from 7.2): NO user-facing notification is created (redemption is a self-initiated action — confirming it via notification would be noise; the confetti + checkmark in 7.2 already confirms). This subscriber is WIRED but a no-op for 7.3, with a docstring explaining why. It exists so Epic 8 can repurpose the hook to notify the business owner without adding a new subscription point. Add a `TODO(story-8.4)` comment inside the handler.
   - Subscriber `on_review_created(payload)` listens to `review.review.created` — future event published by Story 4.x. **Story 4.x has not shipped yet**; the event name is not yet fired in prod. Register the subscriber anyway (defensive: when 4.x ships, notifications start flowing with zero edits here) and add an integration test that emits the event synthetically via `event_bus.emit(...)` and asserts a notification row is created. Handler logic: look up all users who saved the listing (`FavoriteRepository.list_user_ids_for_owner(owner_type="listing", owner_id=listing_id)` — VERIFY this method exists in `backend/modules/favorite/repository.py` from Story 2.6; if not, ADD IT with an `ix_favorites_owner_type_id` compatible query). For each saver: if `preferences.reviews != 'off'` AND the saver is NOT the reviewer, enqueue a notification with `type=REVIEW_ON_SAVED_LISTING`, `metadata={listing_id, listing_title_ja/vi/en, reviewer_display_name, review_id}`. Batch insert (single `INSERT ... VALUES (...)` with multi-row VALUES) to avoid N×INSERT for popular listings.
   - Subscriber `on_event_updated(payload)` listens to `community.event.updated` — future event from Story 5.4. Same pattern as `on_review_created`: register now, test via synthetic emit. Looks up event attendees via `EventAttendeeRepository.list_user_ids(event_id)` (ADD as a TODO reference — Story 5.4 will provide; for 7.3, the subscriber wraps the lookup in `try/except ImportError` and logs WARN "community.event module not installed, skipping" so the test-time synthetic emit still works when the module exists in tests as a stub).
   - Subscriber `on_contribution_milestone(payload)` listens to `gamification.user.badge_upgraded` — future event from Story 3.3. Metadata: `{user_id, badge_label_ja/vi/en, total_points}`. No lookup needed — target user is in the payload.
   - ALL subscribers respect `notification_preferences.frequency`:
     - `realtime` → insert immediately.
     - `daily` → insert immediately but mark `metadata.digest_queued = true` (UI collapses these in 7.3 just by listing; the actual daily-digest email job is post-MVP — document in Dev Notes).
     - `off` → skip insert entirely, log DEBUG.
   - Subscriber failures (DB down, template render errors) MUST NOT propagate — catch broadly, log at ERROR with `structlog.bind(event=..., user_id=...)`, and return. Event-bus contract (`shared/events.py:37-41`) already swallows handler exceptions, but we layer our own logging so WARNs show the notification-specific context (event name + user id) rather than the generic stack.

5. **Given** the backend REST endpoints, **When** the frontend calls them, **Then** all endpoints live in `backend/modules/notification/router.py` mounted at prefix `/api/v1/notifications` by `backend/main.py`:
   - `GET /api/v1/notifications?page=1&per_page=20&unread_only=false` — Auth required (`get_current_user`). Lists the authed user's notifications, sorted `created_at DESC`. `unread_only=true` adds `WHERE is_read = FALSE`. Returns `Paginated[NotificationItem]` where `NotificationItem` = all DB columns minus `deleted_at`, with `created_at` ISO-8601 and a computed `href_locale_neutral = link` field that the client re-prefixes with its locale. `per_page` clamp: 1–50 (400 `InvalidFilterException` otherwise — reuse from 7.1). `rate_limit(120, 60, "notification_read")`.
   - `POST /api/v1/notifications/{notification_id}/read` — Auth required, owner-only (403 `NotificationNotOwnedException` otherwise). Flips `is_read = TRUE`, `read_at = NOW()` atomically (single UPDATE). Idempotent — already-read returns 204 without re-writing. 404 `NotificationNotFoundException` if row missing or soft-deleted. Returns `204 No Content`. `rate_limit(300, 60, "notification_write")`.
   - `POST /api/v1/notifications/mark-all-read` — Auth required. Single UPDATE `SET is_read = TRUE, read_at = NOW() WHERE user_id = :uid AND is_read = FALSE AND deleted_at IS NULL`. Returns `204 No Content` + `{"updated_count": N}` envelope (use `SingleEnvelope[dict]` — this is an exception to the pure-204 rule because the client wants to know how many rows flipped for analytics; the envelope is small). `rate_limit(10, 60, "notification_write")` — stricter to deter abuse.
   - `GET /api/v1/notifications/preferences` — Auth required. Returns `SingleEnvelope[NotificationPreferencesDetail]` where the detail is a dict `{category: frequency}` for all 5 categories. **Lazy-seed:** on first call for a user, if fewer than 5 rows exist in `notification_preferences`, INSERT missing rows with `frequency = 'realtime'` in one `INSERT ... ON CONFLICT DO NOTHING` statement, then re-read. This avoids a migration backfill and keeps new users zero-cost at signup.
   - `PUT /api/v1/notifications/preferences/{category}` — Auth required. Body: `{"frequency": "realtime" | "daily" | "off"}`. Validates category ∈ enum (400 otherwise), frequency ∈ enum (400 otherwise). UPSERT: `INSERT ... ON CONFLICT (user_id, category) DO UPDATE SET frequency = EXCLUDED.frequency, updated_at = NOW()`. Returns `204 No Content`. `rate_limit(60, 60, "notification_prefs_write")`.
   - All error responses use trilingual `AppException` (extend `backend/modules/notification/exceptions.py` with `NotificationNotFoundException` (404), `NotificationNotOwnedException` (403), `InvalidNotificationCategoryException` (400), `InvalidNotificationFrequencyException` (400)).
   - Pydantic schemas in `backend/modules/notification/schemas.py`: `NotificationItem`, `NotificationPreferencesDetail`, `NotificationPreferenceUpdateRequest`, `MarkAllReadResponse`.
   - Dependencies in `backend/modules/notification/dependencies.py`: `get_notification_repository`, `get_notification_preference_repository`, `get_notification_service`.
   - Router registered in `backend/main.py` alongside `coupon.router` (add one line — inspect the existing `app.include_router(...)` block and insert in alphabetical order).

6. **Given** the unified polling spine, **When** an authed user's browser polls `GET /api/v1/sync`, **Then**:
   - NEW endpoint in a NEW module `backend/modules/sync/` (module structure: `__init__.py`, `router.py`, `service.py`, `dependencies.py` — NO models/repository/schemas because it composes other modules' repos via DI). Reason for a dedicated module: `/sync` is the ARCHITECTURAL unified-polling surface (see `_bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#API--Communication-Patterns` row "Polling"), and will grow in 3.3 (unread activity badge) and Epic 5 (community new-posts badge). A module boundary prevents it from accreting into `notification/` and from spaghetti-style cross-module imports.
   - `GET /api/v1/sync` requires auth (`get_current_user`). Returns `SingleEnvelope[SyncState]`:
     ```json
     {
       "data": {
         "server_time": "2026-04-20T12:00:00Z",
         "notifications": { "unread_count": 7, "latest_created_at": "2026-04-20T11:45:00Z" }
       },
       "meta": { "etag": "\"...\"", "poll_interval_seconds": 30 }
     }
     ```
   - **ETag handling (304 Not Modified):** compute `etag = strong_hash(f"{user_id}:{latest_notification_id}:{unread_count}")` using `hashlib.sha256(...).hexdigest()[:16]`. If the incoming `If-None-Match` header equals the current etag, respond `304 Not Modified` with no body and the same ETag header — `fastapi.Response(status_code=304)`. The unread-count query uses the partial index `ix_notifications_user_unread` from AC#1 (index-only scan). The "latest created_at" query is `SELECT id, created_at FROM notifications WHERE user_id=:uid ORDER BY created_at DESC LIMIT 1` (uses `ix_notifications_user_created`). BOTH run in a single repo method with one round-trip using a `UNION ALL` or a single parameterised SQL; target ≤ 2 SQL queries per `/sync` call (count + latest), ≤ 1 if we use an aggregate window. Assert via a repo test with a query counter.
   - `meta.poll_interval_seconds` is driven by a server-side hint: default 30 when user has unread notifications < 3 minutes old (active conversation), else 120 (idle). Frontend uses this verbatim (no client-side heuristics). This keeps the adaptive-polling policy server-owned and tunable.
   - `rate_limit(120, 60, "sync_poll")` user-keyed. 429 returns a polite trilingual body plus a `Retry-After` header.
   - NO writes. NO event emission. `/sync` is strictly read-only and idempotent.

7. **Given** the coupon-near-expiry periodic job, **When** the scheduler fires, **Then**:
   - NEW Celery task `sweep_expiring_coupon_notifications` registered in `backend/modules/notification/tasks.py`. Uses the existing Celery app in `backend/infrastructure/worker.py`. Add a beat schedule config in `backend/infrastructure/worker.py`:
     ```python
     celery_app.conf.beat_schedule = {
       "sweep-expiring-coupons-hourly": {
         "task": "notification.sweep_expiring_coupon_notifications",
         "schedule": 3600.0,  # every hour
       }
     }
     ```
   - Task body (hourly, idempotent):
     1. Single SQL: select redemptions (`cr.id, cr.user_id, c.title_ja, c.title_vi, c.title_en, c.valid_until, l.id AS listing_id, l.name_ja, l.name_vi, l.name_en`) WHERE `cr.status = 'claimed'` AND `cr.deleted_at IS NULL` AND `c.valid_until BETWEEN NOW() AND NOW() + INTERVAL '24 hours'` AND `c.deleted_at IS NULL`.
     2. For each candidate: check `notification_preferences.frequency` for category `DEALS` — skip if `off`. If `daily`, still insert (digest handling is future work; see Dev Notes).
     3. Batch INSERT new rows (`INSERT ... VALUES (...)` with multi-row VALUES) using the unique partial index `uq_notifications_dedupe_coupon_expiring` — ON CONFLICT DO NOTHING guarantees idempotence. Templates rendered via `templates.render(NotificationType.COUPON_NEAR_EXPIRY, metadata={"coupon_title_ja": ..., "business_name_ja": l.name_ja, "redemption_id": cr.id, ...})`.
     4. Return `{"checked": N, "inserted": M}` for logs.
   - If Celery beat is NOT running (dev, CI), provide a manual trigger `POST /api/v1/_internal/notifications/sweep-expiring-coupons` protected by `X-Internal-Token` header matching `settings.internal_api_token` (NEW — add to `shared/config.py` + `.env.example`). Returns the same JSON payload. Document in `backend/README.md` as "ops endpoint — wire to an external cron if not running Celery beat".
   - Unit test the task with a time-frozen DB fixture covering: (a) eligible redemption → notification inserted; (b) re-run → zero duplicates; (c) user with `deals: off` pref → skipped; (d) coupon already expired (past window) → skipped.

8. **Given** the frontend data layer, **When** the `notification` module is added under `apps/web/modules/notification/`, **Then**:
   - Module structure: `components/`, `hooks/`, `lib/`, `__tests__/` (mirrors other modules; see `apps/web/modules/deals/`).
   - `lib/types.ts` exports: `NotificationType`, `NotificationCategory`, `NotificationFrequency` (string-literal unions matching backend enums), `NotificationItem`, `NotificationPreferences` (`Record<NotificationCategory, NotificationFrequency>`), `SyncState`.
   - `lib/notification-api.ts` (client, uses `apiClient`):
     - `listNotifications({ page, perPage, unreadOnly })` → `Paginated<NotificationItem>`.
     - `markNotificationRead(id)` → `void` (204).
     - `markAllNotificationsRead()` → `{ updatedCount: number }`.
     - `getNotificationPreferences()` → `NotificationPreferences`.
     - `updateNotificationPreference(category, frequency)` → `void`.
   - `lib/notification-ssr.ts`:
     - `fetchNotificationsSSR(page, perPage, unreadOnly)` — server-side fetch with cookie forwarding, 5 s `AbortController`, `cache: "no-store"`. Used by `/profile/notifications/page.tsx`.
     - `fetchNotificationPreferencesSSR()` — same pattern.
   - `lib/sync-client.ts`:
     - `fetchSync(etag?: string)` → `{ state: SyncState | null, etag: string | null, pollIntervalSeconds: number }`. Passes `If-None-Match: etag` when provided; on 304 returns `{ state: null, etag: incomingEtag, pollIntervalSeconds }` (server sends headers on 304 too). On 2xx parses envelope.
   - Snake→camel transformation is handled by `apiClient` automatically for client calls. SSR helpers must call `transformKeys` from `apiClient.ts` manually (same pattern as existing `*-ssr.ts` modules; inspect and mirror).
   - `lib/notification-href.ts` — helper `buildNotificationHref(locale, link)` that prepends `/{locale}` to the backend's locale-neutral `link`. Tests cover: `(ja, "/listings/abc") → "/ja/listings/abc"`; `(vi, "/deals?tab=mine") → "/vi/deals?tab=mine"`; `(en, null) → "/en/profile/notifications"` (fallback when link is null, keep user on the notification center).

9. **Given** the frontend polling layer, **When** the app is running in an authed session, **Then**:
   - NEW Zustand store `apps/web/shared/stores/useNotificationStore.ts`:
     - State: `unreadCount: number`, `latestCreatedAt: string | null`, `etag: string | null`, `pollIntervalSeconds: number`, `lastPolledAt: number | null`.
     - Actions: `setFromSync(syncState, etag, pollIntervalSeconds)`, `decrementUnread(by?: number)` (used for optimistic updates on mark-read), `reset()`.
     - Default poll interval: 30 s.
   - NEW hook `apps/web/modules/notification/hooks/useNotificationPolling.ts`:
     - Starts a polling loop on mount when `useAuthStore().user !== null`; stops when user logs out.
     - **Tab visibility:** pauses the loop when `document.visibilityState === 'hidden'`; resumes on `visibilitychange`, fires one immediate poll on resume.
     - **Backoff on failure:** on 5xx/network error, double the interval up to 5 min; reset to server-provided interval on success. On 429 respect `Retry-After` header (if present) or wait 60 s.
     - **Jitter:** add ±10% random jitter to avoid thundering herd.
     - **Never hard-fail:** polling errors MUST NOT crash the app or bubble to the toast layer — log to `console.warn` only. The notification center page is the source of truth; the badge is a nice-to-have.
     - `AbortController` per request; abort in-flight request on unmount.
     - Unit tests: simulate `visibilitychange`, 304 response (state unchanged, etag updated), 200 response (state updated), 429 backoff, logout mid-poll (cleanup).
   - Hook is MOUNTED once from `apps/web/app/(user)/[locale]/layout.tsx` via a NEW client-component wrapper `<NotificationPollingBoundary />` placed near the top of the tree but INSIDE the auth boundary (inspect the layout — auth check is probably on the server via middleware or SSR user hydration). If the layout is a server component, add a small client shim `<NotificationBootstrap />` that conditionally renders the polling hook when the user is present.

10. **Given** the frontend notification center page, **When** the user navigates to `/{locale}/profile/notifications`, **Then**:
    - NEW route `apps/web/app/(user)/[locale]/profile/notifications/page.tsx` (server component) — inspect existing `profile/favorites/page.tsx` for the established SSR-auth redirect + locale resolution pattern and match it exactly.
    - SSR flow:
      1. Resolve locale + authed user from cookies. Unauth → redirect to `/{locale}/login?next=/{locale}/profile/notifications`.
      2. Parallel SSR fetches: `fetchNotificationsSSR(1, 20, false)` + `fetchNotificationPreferencesSSR()`.
      3. Render `<NotificationCenter initialItems preferences />` (NEW client component under `apps/web/modules/notification/components/`).
    - `NotificationCenter.tsx` (client):
      - Two sections: a **list** section (top, 2/3 of the layout on ≥ 1024px) and a **preferences** panel (right, 1/3). On mobile, preferences appear below the list, collapsible under a `通知設定` accordion (reuse `Accordion.tsx` from shared components).
      - List item UI: icon (emoji map keyed by `type` — e.g., REVIEW → 📝, EVENT → 🎪, MILESTONE → 🎖, COUPON_EXPIRY → ⏰), title (locale-appropriate field from the row), body (collapsed to 2 lines), relative timestamp (use `Intl.RelativeTimeFormat` keyed to active locale — no extra dep).
      - **Unread highlight:** unread rows have `bg-surface-highlight-subtle` background + a 4 px coral left border + the timestamp renders in bold. Read rows are plain.
      - **Tap behavior:** on tap, optimistically decrement `useNotificationStore().unreadCount`, fire `markNotificationRead(id)`, and `router.push(buildNotificationHref(locale, link))`. If the API fails, rollback the optimistic update and show a toast `通知を開けませんでした` (key `notification.errors.mark_read_failed`).
      - **Mark all read button:** top-right of the list, visible only when there are unread items. On click → `markAllNotificationsRead()` → update store + success toast `{updatedCount}件を既読にしました`. Confirm via a small Radix `Dialog` only if `unreadCount > 20` (protect against accidental taps on long histories); otherwise execute directly.
      - **Pagination:** 20 items/page, button `さらに読み込む` (load-more pattern — same as 7.1's deals grid). Fetch page 2+ client-side via `listNotifications`.
      - **Empty state:** `<EmptyState />` (shared component) with illustration (reuse existing asset from 7.1 if applicable, else use `<BellOff />` icon from lucide-react), title `通知はありません`, body `新しいお知らせが届くとここに表示されます。`, optional CTA to `/deals`.
    - `NotificationPreferencesPanel.tsx` (client):
      - Five category toggles (one per `NotificationCategory`) rendered as `<SegmentedControl />` (reuse the shared primitive) with three options each: `リアルタイム`, `毎日まとめ`, `オフ`.
      - On change → `updateNotificationPreference(category, frequency)` → optimistic UI + toast `通知設定を保存しました`. On error → rollback + error toast.
      - Debounce 300 ms per category to coalesce rapid toggling.
    - **SEO:** `generateMetadata` returns `robots: { index: false, follow: false }` (private content).

11. **Given** the Profile tab badge, **When** `useNotificationStore().unreadCount > 0`, **Then**:
    - `apps/web/shared/components/BottomTabNav.tsx` renders a red circular badge at the top-right of the Profile icon showing the unread count. Display rule: `count ≤ 99 ? count : "99+"`.
    - Badge uses tokens `bg-status-danger`, `text-text-inverse`, min-w 18 px, h 18 px, padding 0 4 px, `rounded-full`, `ring-2 ring-surface-white` (separation from icon).
    - Badge is HIDDEN when `!isAuthenticated` (guest nav shows login button, no badge).
    - Accessibility: badge contributes to the Profile link's accessible name via a SR-only span — `<span className="sr-only">（未読通知 {count} 件）</span>` appended to the existing `t('profile')` label, OR wrap the link in `aria-label={t('profile_with_unread', { count })}` — inspect the existing i18n structure in `messages/{ja,en,vi}.json` under `nav.*` and add `nav.profile_with_unread` keys accordingly. Ensure `aria-live="polite"` is NOT applied to the badge itself (it would announce every poll) — rely on the user's natural focus cycle.
    - On desktop (`lg:`), the TopNav mirrors the same badge next to the profile menu trigger — inspect `apps/web/shared/components/TopNav.tsx` and add an equivalent badge component (extract `<UnreadBadge />` into `apps/web/modules/notification/components/UnreadBadge.tsx` to avoid duplication).

12. **Given** internationalization, **When** the new notification UI ships, **Then**:
    - NEW keys in `apps/web/messages/{ja,en,vi}.json` under a top-level `notification.*` namespace. Required keys:
      - `notification.center.title`, `notification.center.mark_all_read`, `notification.center.mark_all_confirm_title`, `notification.center.mark_all_confirm_body`, `notification.center.empty_title`, `notification.center.empty_body`, `notification.center.load_more`, `notification.center.load_more_end`.
      - `notification.preferences.title`, `notification.preferences.help`, `notification.preferences.category.reviews`, `notification.preferences.category.events`, `notification.preferences.category.community`, `notification.preferences.category.deals`, `notification.preferences.category.milestones`, `notification.preferences.frequency.realtime`, `notification.preferences.frequency.daily`, `notification.preferences.frequency.off`, `notification.preferences.saved_toast`.
      - `notification.errors.mark_read_failed`, `notification.errors.load_failed`, `notification.errors.preferences_save_failed`.
      - `nav.profile_with_unread` — `{count, plural, one {プロフィール（未読 # 件）} other {プロフィール（未読 # 件）}}` in JA; EN + VI equivalents.
    - JA is authoritative; EN + VI are REAL translations (match quality bar from 7.1/7.2 — no lorem/placeholders).
    - Template strings for notification bodies (AC#3) are NOT in the i18n JSON — they live in the backend `templates.py` because notifications are pre-rendered per-row at create-time and sent to the client already-localized. Document this split in `apps/web/README.md` "Notifications" section.

13. **Given** accessibility at 375 / 768 / 1280 px, **When** the notification surfaces are audited, **Then**:
    - List items use `<button>` (not `<a>`) for the tap-to-read action because the visit dispatches an API call + router navigation; the semantic `<button>` plus a nested `<Link>` for keyboard-only users is acceptable — OR model as a `<Link>` with an `onClick` that fires the mark-read API (preferred: SEO-irrelevant private page, accessible keyboard focus matches `<Link>`). The chosen pattern is a `<Link>` with an `onClick` handler.
    - Unread items expose `aria-label={`${title} — 未読`}` so SR users know the state without seeing the visual highlight.
    - `mark-all-read` button has `aria-describedby` pointing at the current unread count.
    - `SegmentedControl` preferences toggles are keyboard-arrow navigable with `aria-selected` (existing primitive handles this — verify in tests).
    - Profile tab badge has a SR-only span announcing the unread count (AC#11).
    - Color contrast on the unread highlight + the red badge meet WCAG AA (verify with existing token values — DO NOT introduce new colors; reuse `bg-surface-highlight-subtle` or the nearest existing token).
    - All CTAs ≥ 48 × 48 px tap target.
    - Axe-core reports 0 violations on `/ja/profile/notifications` (mobile + desktop viewports).

14. **Given** security, performance, and reliability, **When** the feature ships, **Then**:
    - **Auth boundary:** every write endpoint enforces `get_current_user`. The `/sync` endpoint is auth-gated — guests MUST NOT hit it (guard returns 401; the frontend hook never fires for guests; defensive double-check).
    - **Owner enforcement:** every notification-write endpoint queries `WHERE id = :id AND user_id = :uid` — never trusts the row's `user_id` after a get-then-check; uses a WHERE-clause guard in the UPDATE itself.
    - **CSRF:** writes go through `apiClient` which injects `X-CSRF-Token`. Tests snapshot a failing request without the header.
    - **Polling CPU ceiling (per NFR "Polling Overhead < 5% CPU per 1k connected clients"):** `/sync` must be index-only scans + 304-cacheable. Repo test: assert ≤ 2 SQL round-trips per `/sync` call, and that EXPLAIN on the unread count uses the partial index.
    - **Bandwidth:** `/sync` 304 response body is empty; successful response body ≤ 512 bytes. Assert in a test.
    - **Dedupe:** the expiry-sweep job is idempotent via the unique partial index. Test re-runs the task twice and asserts the second call inserts zero rows.
    - **Cascade on user delete:** deleting a user cascades to notifications + preferences via FK. Test covers this.
    - **No leaking cross-user data:** integration test creates two users with notifications, logs in as user A, confirms `/notifications` never returns user B's rows (even with crafted `id` path in mark-read — 404 path).
    - **Rate limits enforced:** tests assert 121st `/sync` call in a minute returns 429.
    - **Silent observability:** structlog bindings `notification_id`, `notification_type`, `user_id` on every service-layer log line. Sentry breadcrumbs on polling failures are enabled but sampled (don't flood on prolonged backend outages — rate-limit to 1 breadcrumb per 60 s per user).
    - **Frontend bundle:** the `notification/` module adds ≤ 8 kb gzipped to the user route chunk. Verify with `pnpm --filter web build` bundle analysis. The polling hook + store are tree-shaken from public / unauth pages.
    - **Private SEO:** `/profile/notifications` → `noindex, nofollow`.
    - **Template placeholder safety:** `templates.render` uses `format_map` with a `defaultdict` fallback (AC#3) — unit test confirms a missing key renders empty + WARN log, never raises.

15. **Given** the full test matrix, **When** `pnpm --filter web test && pnpm --filter web build && (cd backend && python -m pytest)` run, **Then**:
    - **Backend — `backend/tests/notification/` (NEW):**
      - `test_repository.py` — CRUD, unread count query plan, list filters, cascade on user delete, unique-partial-index dedupe.
      - `test_service.py` — lazy-seed preferences, mark-read idempotence, mark-all updated_count.
      - `test_router.py` — all 5 endpoints × happy/401/403/404/400/429, envelope shape, trilingual errors.
      - `test_subscribers.py` — synthetic `event_bus.emit('review.review.created', ...)` → notification row inserted for each listing-saver, respects prefs `off`, skips reviewer-self, batch insert on 100 savers uses 1 SQL query.
      - `test_subscribers.py::test_milestone_event` — `gamification.user.badge_upgraded` → notification row with rendered badge template.
      - `test_subscribers.py::test_event_updated_graceful_missing_module` — when `community.event` lookup raises, handler logs WARN and doesn't insert.
      - `test_subscribers.py::test_coupon_redeemed_is_noop` — asserts no row inserted (documented 7.3 behavior; re-verifies the Epic 8 hook point stays a no-op here).
      - `test_templates.py` — every `NotificationType` has all 7 keys, `render()` never raises on missing metadata, renders correctly on valid metadata.
      - `test_tasks.py` — `sweep_expiring_coupon_notifications` happy path, idempotence on re-run, respects `deals: off` pref, skips past-expiry coupons, internal HTTP trigger auth gate.
    - **Backend — `backend/tests/sync/` (NEW):**
      - `test_router.py` — happy path (200), 304 with matching `If-None-Match`, etag stability across polls with no new notifications, etag changes when an unread arrives, poll_interval_seconds = 30 when fresh unread, 120 when idle, 429 at limit.
      - Query-counter assertion: `/sync` uses ≤ 2 SQL round-trips.
    - **Backend — extend existing `backend/tests/coupon/test_claim_redeem.py`:** add a test that claiming → redeeming does NOT create a user-facing notification (regression-guard for the intentional no-op subscriber).
    - **Backend — extend `backend/tests/conftest.py`:** add `notification_factory(user, type=..., is_read=False)`, `notification_preference_factory(user, category=..., frequency='realtime')`.
    - **Frontend — `apps/web/modules/notification/__tests__/`:**
      - `notification-api.test.ts` — all 5 client methods × happy path + error mapping (401, 403, 404, 400, 429).
      - `sync-client.test.ts` — 200 updates state, 304 preserves state, passes `If-None-Match`, surfaces new etag.
      - `useNotificationPolling.test.tsx` — starts on mount for authed user, stops on logout, pauses on tab hidden, resumes + immediate poll on visible, backs off on 5xx, respects Retry-After on 429, cleans up `AbortController` on unmount.
      - `NotificationCenter.test.tsx` — renders items, unread highlight, tap fires optimistic decrement + API + navigation, rollback on API fail, empty state, load-more pagination, mark-all-read flow + confirm-dialog threshold at 20.
      - `NotificationPreferencesPanel.test.tsx` — renders 5 categories, change fires optimistic + API, error rollback + toast, debounces rapid toggles.
      - `UnreadBadge.test.tsx` — hidden when count = 0, shows number ≤ 99, shows "99+" when > 99, SR-only label present.
      - `BottomTabNav.notification.test.tsx` — badge renders over profile icon when authed + unread > 0, hidden when guest.
      - `notification-href.test.ts` — locale prepending, null fallback.
    - **Frontend — extend shared store tests** under `apps/web/shared/stores/__tests__/useNotificationStore.test.ts`.
    - Coverage target ≥ 80% branch on all new `notification` + `sync` backend code and all new frontend files.
    - Run the full command chain — all green. Known pre-existing `/vi/auth/callback` prerender failure remains out of scope; if it regresses further, flag to the user.

## Tasks / Subtasks

- [x] Task 1: Backend — migrations + enums + base models (AC: #1, #2)
  - [x] 1.1 Inspect `backend/migrations/versions/` for the latest stamp; create `2026_04_20_0001_create_notifications_and_preferences_tables.py`. Include all indexes + partial unique dedupe index. `downgrade()` drops both tables + indexes cleanly.
  - [x] 1.2 Create `backend/modules/notification/__init__.py`, `constants.py` with the three enums + `TYPE_TO_CATEGORY` map + `DAILY_DIGEST_WINDOW_HOURS`.
  - [x] 1.3 Create `backend/modules/notification/models.py` with `Notification` (extends `BaseModel`) and `NotificationPreference` (no soft-delete — raw Base like activity).

- [x] Task 2: Backend — repository + template engine (AC: #1, #3, #4)
  - [x] 2.1 Create `backend/modules/notification/repository.py` with `NotificationRepository` (`insert`, `insert_batch`, `list_for_user`, `count_unread`, `get_latest_for_user`, `mark_read`, `mark_all_read`, `get_owned_for_user`) and `NotificationPreferenceRepository` (`get_all_for_user`, `upsert`, `seed_defaults_if_missing` — single `INSERT ... ON CONFLICT DO NOTHING` statement with all 5 categories).
  - [x] 2.2 Create `backend/modules/notification/templates.py` with the 4 MVP templates + `render()` using `format_map` + `defaultdict` fallback + WARN log on missing keys.
  - [x] 2.3 Unit-test `render()` (template key completeness + placeholder smoke tests).

- [x] Task 3: Backend — exceptions + schemas + dependencies (AC: #5)
  - [x] 3.1 `exceptions.py`: `NotificationNotFoundException` (404), `NotificationNotOwnedException` (403), `InvalidNotificationCategoryException` (400), `InvalidNotificationFrequencyException` (400) — all trilingual via `AppException`.
  - [x] 3.2 `schemas.py`: `NotificationItem`, `NotificationPreferencesDetail`, `NotificationPreferenceUpdateRequest`, `MarkAllReadResponse`.
  - [x] 3.3 `dependencies.py`: `get_notification_repository`, `get_notification_preference_repository`, `get_notification_service`.

- [x] Task 4: Backend — service + subscribers (AC: #4, #5)
  - [x] 4.1 `service.py`: `NotificationService` with methods `list_for_user`, `mark_read`, `mark_all_read`, `get_preferences`, `upsert_preference`, plus an internal `create_from_template(user_id, type, metadata)` that enforces the category prefs gate and returns the inserted id (or None when skipped by `off`). Batch variant `create_from_template_batch(rows)` for review fan-out.
  - [x] 4.2 `subscribers.py`: register handlers for `COUPON_REDEEMED` (no-op with TODO(story-8.4)), `review.review.created`, `community.event.updated`, `gamification.user.badge_upgraded`. Each handler wraps lookups in try/except, logs WARN on failure.
  - [x] 4.3 Wire subscribers from `backend/main.py` startup (new `register_notification_subscribers()` function, imported once).
  - [x] 4.4 Extend `FavoriteRepository` (from 2.6) with `list_user_ids_for_owner(owner_type, owner_id)` if missing. Add its own test.

- [x] Task 5: Backend — router + main.py mount (AC: #5)
  - [x] 5.1 `router.py`: 5 endpoints from AC#5, correct rate limits, trilingual errors, 204 status codes where appropriate.
  - [x] 5.2 Mount router in `backend/main.py` alphabetically alongside `coupon.router`.

- [x] Task 6: Backend — /sync module (AC: #6)
  - [x] 6.1 Create `backend/modules/sync/` module (`__init__.py`, `router.py`, `service.py`, `dependencies.py`).
  - [x] 6.2 Implement `SyncService.get_state(user)` composing `NotificationRepository.count_unread` + `get_latest_for_user`. Single repo method targeting ≤ 2 SQL calls.
  - [x] 6.3 Implement `GET /api/v1/sync` with ETag / 304 handling, adaptive `poll_interval_seconds`, rate limit.
  - [x] 6.4 Mount in `backend/main.py`.

- [x] Task 7: Backend — Celery task + ops endpoint (AC: #7)
  - [x] 7.1 Create `backend/modules/notification/tasks.py` with `sweep_expiring_coupon_notifications` Celery task.
  - [x] 7.2 Add beat schedule to `backend/infrastructure/worker.py`.
  - [x] 7.3 Add `settings.internal_api_token` to `shared/config.py` + `.env.example`. Create `POST /api/v1/_internal/notifications/sweep-expiring-coupons` protected by `X-Internal-Token`.
  - [x] 7.4 Document both invocation paths (Celery beat + internal HTTP trigger) in `backend/README.md`.

- [x] Task 8: Backend — tests (AC: #15)
  - [x] 8.1 Create `backend/tests/notification/` suite per AC#15.
  - [x] 8.2 Create `backend/tests/sync/` suite per AC#15.
  - [x] 8.3 Add factories to `backend/tests/conftest.py`.
  - [x] 8.4 Extend coupon claim/redeem tests with the no-notification regression guard.
  - [x] 8.5 Run `python -m pytest backend/tests/` → all green, ≥ 80% branch on new code.

- [x] Task 9: Frontend — module scaffolding + data layer (AC: #8)
  - [x] 9.1 Create `apps/web/modules/notification/{components,hooks,lib,__tests__}/`.
  - [x] 9.2 `lib/types.ts` with all types/enums mirrored from backend.
  - [x] 9.3 `lib/notification-api.ts` (client) with all 5 API methods.
  - [x] 9.4 `lib/notification-ssr.ts` with cookie-forwarding SSR fetchers.
  - [x] 9.5 `lib/sync-client.ts` with ETag / 304 handling.
  - [x] 9.6 `lib/notification-href.ts` locale-prepending helper.

- [x] Task 10: Frontend — Zustand store + polling hook (AC: #9)
  - [x] 10.1 Create `apps/web/shared/stores/useNotificationStore.ts`.
  - [x] 10.2 Create `apps/web/modules/notification/hooks/useNotificationPolling.ts` with visibility-aware loop, backoff, jitter, AbortController cleanup.
  - [x] 10.3 Mount `<NotificationBootstrap />` from `apps/web/app/(user)/[locale]/layout.tsx` (client shim inside the authed boundary).

- [x] Task 11: Frontend — notification center page + components (AC: #10, #12)
  - [x] 11.1 Create `apps/web/app/(user)/[locale]/profile/notifications/page.tsx` (SSR + auth redirect + parallel prefetches + `noindex` metadata).
  - [x] 11.2 `components/NotificationCenter.tsx` with list, unread highlight, mark-read optimistic, mark-all flow (confirm dialog > 20), load-more pagination, empty state.
  - [x] 11.3 `components/NotificationItem.tsx` with icon map, relative timestamp, tap handler.
  - [x] 11.4 `components/NotificationPreferencesPanel.tsx` with 5 SegmentedControls, optimistic + debounce + rollback.
  - [x] 11.5 Add i18n keys to `messages/{ja,en,vi}.json` (JA authoritative, real EN + VI translations).

- [x] Task 12: Frontend — Profile tab badge (AC: #11)
  - [x] 12.1 Create `apps/web/modules/notification/components/UnreadBadge.tsx` (count ≤ 99 | "99+", SR-only label).
  - [x] 12.2 Extend `BottomTabNav.tsx` to render `<UnreadBadge />` on the Profile icon when authed + unread > 0.
  - [x] 12.3 Extend `TopNav.tsx` (desktop) with the same badge next to the profile menu trigger.
  - [x] 12.4 Add `nav.profile_with_unread` i18n keys.

- [x] Task 13: Frontend — tests (AC: #15)
  - [x] 13.1 Add all test files listed in AC#15 under `apps/web/modules/notification/__tests__/`.
  - [x] 13.2 Add `apps/web/shared/stores/__tests__/useNotificationStore.test.ts`.
  - [x] 13.3 Extend `apps/web/shared/components/__tests__/BottomTabNav.test.tsx` with badge scenarios.
  - [x] 13.4 Mock `window.matchMedia` and `document.visibilityState` for polling tests.
  - [x] 13.5 Run `pnpm --filter web test && pnpm --filter web build` → green.

- [x] Task 14: Docs, README updates, cleanup (AC: all)
  - [x] 14.1 Update `apps/web/README.md` "Notifications" section — module structure, polling cadence, badge contract, backend/frontend i18n split note.
  - [x] 14.2 Update `backend/README.md` with the 5 notification endpoints + `/sync` + Celery task/ops endpoint + `activity_logs` / notification relationship diagram.
  - [x] 14.3 Regenerate `packages/types/src/api-types.ts` from the live OpenAPI schema if the backend is running locally; otherwise refresh the `TODO(story-7-3-followup)` note in `apps/web/modules/notification/lib/types.ts`.
  - [x] 14.4 Verify no regressions in Story 7.1 / 7.2 flows (`/deals`, `/deals?tab=mine`) by running their test files in isolation.

## Dev Notes

### Purpose & scope

Story 7.3 ships the **notification spine** — the canonical in-app surface that every future "something happened to you" event flows through — plus the **unified adaptive polling endpoint `GET /api/v1/sync`** that the architecture's "Polling — single unified `GET /api/v1/sync` endpoint, adaptive interval, 1 request instead of 4, 304 Not Modified, bandwidth-efficient" decision (see `_bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#API--Communication-Patterns`) has been waiting for.

This story is unusual because two of its four MVP notification sources (`review.review.created` from Story 4.x, `community.event.updated` from Story 5.4, `gamification.user.badge_upgraded` from Story 3.3) have NOT shipped yet. We register the subscribers anyway — the event bus (`backend/shared/events.py`) is sparse and idempotent, so "no publisher" = "no notification" today and "publisher arrives later" = "notifications start flowing" without edits here. Only `coupon.near_expiry` (our own hourly sweep job) fires in prod immediately.

### Why pre-rendered trilingual columns, not templates-at-read-time

Alternatives considered:
- **Store `type` + `metadata` only, render at read time from i18n templates.** Smaller rows (~200 bytes), one place to edit copy. BUT: every `/sync` and `/notifications` list call hits the template engine, the message catalog must load in the backend process (or be duplicated from the frontend catalog), and SSR for `/profile/notifications` has to resolve templates per row. This is the pattern that eventually collapses into "a tiny NIH template engine in the DB".
- **Store pre-rendered localized columns at create-time (chosen).** Rows are ~500–800 bytes; storage cost is < 1 MB per 10k notifications — negligible. Read path is a simple SELECT with no template dependency. SSR is trivial. Trade-off: changing copy for old notifications is a migration, not a config flip — accepted because notifications are ephemeral (users skim + dismiss).

### Why a dedicated `sync/` module, not an endpoint on `notification/`

`/sync` is the entry point for the unified polling contract. In 3.3 it will also carry "unread activity score" (for the gamification widget) and in Epic 5 it may carry "new-posts-in-your-groups count". Putting it under `notification/` would be accurate today and wrong in a month; putting it at the module top level keeps cross-cutting polling concerns out of notification's domain. Module has no models — it composes via DI.

### Celery beat — how to run in dev/CI

Celery beat is NOT currently wired into Docker Compose profiles. Options:
1. **Dev:** developer runs `celery -A infrastructure.worker beat --loglevel=info` manually when testing expiry notifications. Document in `backend/README.md`.
2. **CI / tests:** call the task function DIRECTLY — `sweep_expiring_coupon_notifications.run()` — no beat or broker needed.
3. **Production:** add a `beat` service to `docker-compose.prod.yml` as a small separate container. This is a NFR-8 concern (see non-functional-requirements.md polling overhead) — it's one small process, no broker traffic except the scheduler.
4. **Ops escape hatch:** the `POST /api/v1/_internal/notifications/sweep-expiring-coupons` endpoint lets an external cron (DigitalOcean's built-in cron, cron-job.org, etc.) drive the task without Celery beat. Useful for MVP deployments where we don't want to operate Celery beat yet.

### Adaptive polling — server-owned, not client-owned

Polling cadence is returned by the server in `meta.poll_interval_seconds` on every `/sync` response. The server picks 30 or 120 based on whether the user has unread activity within the last 3 minutes. Why server-owned: we can tune the heuristic without a frontend deploy, we can ship A/B tests from the backend, and we can throttle all clients simultaneously if we see a load spike. The client obeys the server's hint verbatim — with one exception: it adds ±10% jitter (client-side) to avoid thundering herd.

Tab-visibility pause is pure frontend — it's a privacy + battery good citizen behavior, not a load-control behavior; the user's tab being hidden doesn't change the server's polling preference but does change whether the user will see the result.

### Event bus semantics (critical — re-read `backend/shared/events.py`)

The in-process bus at `backend/shared/events.py`:
- Handlers are registered synchronously at import-time.
- `emit()` is async; handlers are awaited one-by-one (sync handlers are called directly).
- Handler exceptions are caught and logged by the bus — they MUST NOT crash the emitter. This means a broken notification subscriber CANNOT prevent a coupon claim from succeeding. Take advantage: subscribers can do DB writes without defensive wrapping at the emit site, but should still log their own errors with domain context.

Subscribers MUST be registered ONCE per process, at FastAPI startup. Re-importing a subscribers module inside a request path will duplicate-subscribe, leading to duplicate notifications per event. Use a startup hook (FastAPI lifespan) + an idempotent guard if you're paranoid (`if handler not in _subscribers.get(event, []): ...`) — but the startup-hook pattern is enough.

### Frontend polling pitfalls

1. **SSR leak:** the polling hook is client-only. Do not import it into a server component. The `<NotificationBootstrap />` wrapper is a `"use client"` shim.
2. **AbortController cleanup:** on unmount OR on logout, abort the in-flight request BEFORE clearing the timer. Otherwise a late response can race-update a stale store.
3. **Jitter first, then sleep:** adding jitter to the setTimeout delay (not to the start of the next iteration) yields correct distribution across clients.
4. **`visibilitychange` is tab-level, not window-level.** Hidden tabs browsers throttle `setTimeout` down to 1 Hz anyway, but the pause saves requests and respects user intent.

### Lessons from Story 7.2 directly applicable to 7.3

- **Trilingual AppException bodies are easy to forget** — Story 7.2 had to audit every new exception class for JA/VI/EN strings. Do the four new exceptions up-front in Task 3, not in Task 5.
- **Transaction boundaries:** notification INSERT in the expiry-sweep task MUST NOT be inside the same transaction as any other module's writes. The task is stand-alone; each row gets its own short transaction (or a batch INSERT wrapped once). Do not open a `CouponService` session from the task — it's a red flag for hidden coupling.
- **Batch media-style hydration pattern (≤ 3 SQL round-trips):** the notification list endpoint does NOT need photo hydration (the link target will load its own). Don't over-engineer.
- **Rate-limit route keys are per-feature, not per-endpoint.** `"notification_read"` covers both `GET /notifications` and `GET /sync` polling if you want; I've split them (`"sync_poll"` vs `"notification_read"`) because `/sync` is a cadence-driven call and `/notifications` is a user-initiated page load — different abuse profiles.

### Proxy / SSR gotcha (carry-over from Story 1.x)

**Any SSR fetcher or cookie-forwarding route MUST NOT use `Headers.set()` or `.entries()` on a response with multiple `Set-Cookie` headers** — it silently collapses them. Always use `response.headers.getSetCookie()` + `append`. The fix lives in `apps/web/shared/lib/proxy.ts`; this story's SSR helpers inherit the correct behavior because they go through `apiClient`'s refresh path which uses the proxy. If you add a new direct-fetch helper (avoid doing so), handle `set-cookie` specially. See the project memory `proxy_set_cookie_bug.md` for the canonical incident write-up.

### Module-boundary enforcement

- `notification/subscribers.py` looks up data via OTHER modules' repos through DI (`FavoriteRepository`, eventually `EventAttendeeRepository`). NEVER import a service layer from another module — only repos. If a lookup is cross-module and needs business logic (e.g., filtering out blocked users), that's a red flag: the upstream module should enrich its event payload instead of the subscriber reaching in.
- `sync/service.py` depends on `NotificationRepository` via DI. It does NOT depend on `NotificationService` — read-only data doesn't need the service layer.
- NO raw `os.getenv()` — add `internal_api_token` to `shared/config.py` via Pydantic Settings.

### Post-MVP explicitly out of scope

- **Daily digest email/push:** the `frequency = 'daily'` value is stored and preferences UI shows it, but no digest job is implemented. Document in `backend/README.md` as a `TODO(post-mvp)`.
- **Push notifications (mobile browser):** already deferred per `prd/project-scoping-phased-development.md:52`.
- **WebSockets:** explicitly deferred per architecture Core Decisions. Polling is MVP.
- **Cross-device read sync:** notifications are per-user; a mark-read on device A is visible on device B within one `/sync` cycle (≤ 30 s). Good enough for MVP; real-time cross-device sync is a WebSocket concern.

### Project Structure Notes

- Backend module layout under `backend/modules/notification/` and `backend/modules/sync/` follows the canonical template in `_bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Backend-Module-Structure`. The `sync/` module intentionally omits `models.py` / `repository.py` / `schemas.py` (trivial composition via DI; minimal `SyncState` schema lives in `sync/schemas.py` — OK to add if preferred, but keep it thin).
- Frontend module under `apps/web/modules/notification/` matches the canonical frontend module structure. Shared state lives under `apps/web/shared/stores/` — the existing precedent (`useAuthStore`, `useFavoritesStore`, `useSignupModalStore`).
- No deviation from naming conventions: backend snake_case, frontend camelCase, auto-transform via `apiClient`.
- DB naming: `notifications`, `notification_preferences` — snake_case plural. Indexes `ix_{table}_{columns}` / `uq_{table}_{description}` per conventions.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-7-deals-coupons-notifications.md#Story-7.3] — canonical story requirements.
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR67-FR68] — notification delivery + preference management.
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR25] — contribution milestone notifications.
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR56] — activity logging (ships in 7.2; consumed by Epic 9 analytics; no direct dependency for 7.3 but the `activity_logs` table is adjacent).
- [Source: _bmad-output/planning-artifacts/prd/non-functional-requirements.md#Performance — Polling Overhead] — "< 5% CPU increase per 1,000 connected clients" target drives the partial-index + 304 design.
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#API--Communication-Patterns] — unified `/sync` decision, adaptive polling, 304 Not Modified.
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Frontend-Architecture] — Zustand + TanStack Query pattern (we use Zustand for the polling store; no TanStack Query needed here).
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md] — naming, module structure, rate limiting, event naming (`{module}.{entity}.{action}`), response envelope, error format, soft-delete, AppException hierarchy.
- [Source: backend/shared/events.py] — in-process event bus contract; subscribers registered once at startup.
- [Source: backend/infrastructure/worker.py] — existing Celery app; beat schedule extended in Task 7.
- [Source: apps/web/shared/components/BottomTabNav.tsx] — Profile-tab icon location where the unread badge lands.
- [Source: _bmad-output/implementation-artifacts/7-2-coupon-claim-redemption.md] — `COUPON_REDEEMED`/`COUPON_CLAIMED` publisher, `activity_logs`, `FavoriteRepository` precedent.
- [Source: _bmad-output/implementation-artifacts/2-6-favorites-collection.md] — `FavoriteRepository` shape; extend with `list_user_ids_for_owner(owner_type, owner_id)` if not present.
- [Source: memory/proxy_set_cookie_bug.md] — multi-cookie proxy gotcha relevant to any SSR helper.

## Dev Agent Record

### Agent Model Used

github-copilot/gpt-5.3-codex

### Debug Log References

- Full backend suite: `python -m pytest` -> 223 passed.
- Full frontend suite: `pnpm --filter web test` -> 240 passed.
- Frontend production build: `pnpm --filter web build` -> fails on known pre-existing `/vi/auth/callback` suspense/prerender issue (out of scope per AC#15 note).
- Story 7.1/7.2 regressions:
  - `python -m pytest tests/coupon/test_coupons.py tests/coupon/test_claim_redeem.py` -> 31 passed.
  - `pnpm --filter web test -- modules/deals/__tests__/DealsIndex.test.tsx modules/deals/__tests__/CouponDetailSheet.test.tsx` -> passed.

### Completion Notes List

- Implemented backend notification domain end-to-end: migration (notifications + notification_preferences), enums/constants, models, repositories, templates, service, subscribers, router, Celery task, and internal ops trigger.
- Implemented unified polling endpoint `GET /api/v1/sync` in dedicated `backend/modules/sync/` module with ETag/304 handling, adaptive polling hint, and rate limiting.
- Registered notification subscribers at startup and fixed router include ordering so `/api/v1/listings/search` is no longer shadowed by `/api/v1/listings/{listing_id}`.
- Implemented frontend notification module: API clients, SSR helpers, sync client, href helper, polling hook, global Zustand store, notification center page/components, unread badge integration in BottomTabNav and TopNav, and i18n keys.
- Updated tests across backend/frontend for notification and sync surfaces; adjusted BottomTabNav tests for new accessible naming behavior when unread notifications are present.
- Updated documentation (`backend/README.md`, `apps/web/README.md`) and regenerated `packages/types/src/api-types.ts` from local OpenAPI.

### File List

- `.env.example`
- `backend/migrations/versions/2026_04_20_0001_create_notifications_and_preferences_tables.py`
- `backend/modules/notification/__init__.py`
- `backend/modules/notification/constants.py`
- `backend/modules/notification/dependencies.py`
- `backend/modules/notification/exceptions.py`
- `backend/modules/notification/models.py`
- `backend/modules/notification/repository.py`
- `backend/modules/notification/router.py`
- `backend/modules/notification/schemas.py`
- `backend/modules/notification/service.py`
- `backend/modules/notification/subscribers.py`
- `backend/modules/notification/tasks.py`
- `backend/modules/notification/templates.py`
- `backend/modules/sync/__init__.py`
- `backend/modules/sync/dependencies.py`
- `backend/modules/sync/router.py`
- `backend/modules/sync/service.py`
- `backend/modules/listing/repository.py`
- `backend/main.py`
- `backend/infrastructure/worker.py`
- `backend/shared/config.py`
- `backend/shared/middleware/error_handler.py`
- `backend/shared/rate_limit.py`
- `backend/tests/conftest.py`
- `backend/tests/coupon/test_claim_redeem.py`
- `backend/tests/listing/test_favorite_repository.py`
- `backend/tests/notification/__init__.py`
- `backend/tests/notification/test_repository.py`
- `backend/tests/notification/test_router.py`
- `backend/tests/notification/test_service.py`
- `backend/tests/notification/test_subscribers.py`
- `backend/tests/notification/test_tasks.py`
- `backend/tests/notification/test_templates.py`
- `backend/tests/sync/__init__.py`
- `backend/tests/sync/test_router.py`
- `backend/README.md`
- `apps/web/modules/notification/components/NotificationBootstrap.tsx`
- `apps/web/modules/notification/components/NotificationCenter.tsx`
- `apps/web/modules/notification/components/NotificationItem.tsx`
- `apps/web/modules/notification/components/NotificationPreferencesPanel.tsx`
- `apps/web/modules/notification/components/UnreadBadge.tsx`
- `apps/web/modules/notification/hooks/useNotificationPolling.ts`
- `apps/web/modules/notification/lib/notification-api.ts`
- `apps/web/modules/notification/lib/notification-href.ts`
- `apps/web/modules/notification/lib/notification-ssr.ts`
- `apps/web/modules/notification/lib/sync-client.ts`
- `apps/web/modules/notification/lib/types.ts`
- `apps/web/modules/notification/__tests__/BottomTabNav.notification.test.tsx`
- `apps/web/modules/notification/__tests__/NotificationCenter.test.tsx`
- `apps/web/modules/notification/__tests__/NotificationPreferencesPanel.test.tsx`
- `apps/web/modules/notification/__tests__/UnreadBadge.test.tsx`
- `apps/web/modules/notification/__tests__/notification-api.test.ts`
- `apps/web/modules/notification/__tests__/notification-href.test.ts`
- `apps/web/modules/notification/__tests__/sync-client.test.ts`
- `apps/web/modules/notification/__tests__/useNotificationPolling.test.tsx`
- `apps/web/shared/stores/useNotificationStore.ts`
- `apps/web/shared/stores/__tests__/useNotificationStore.test.ts`
- `apps/web/app/(user)/[locale]/layout.tsx`
- `apps/web/app/(user)/[locale]/profile/notifications/page.tsx`
- `apps/web/shared/components/BottomTabNav.tsx`
- `apps/web/shared/components/TopNav.tsx`
- `apps/web/shared/components/SegmentedControl.tsx`
- `apps/web/shared/components/__tests__/BottomTabNav.test.tsx`
- `apps/web/shared/lib/apiClient.ts`
- `apps/web/shared/lib/proxy.ts`
- `apps/web/messages/ja.json`
- `apps/web/messages/en.json`
- `apps/web/messages/vi.json`
- `apps/web/README.md`
- `packages/types/src/api-types.ts`

## Change Log

- 2026-04-20: Completed Story 7.3 implementation (backend notification + sync modules, frontend notification center/polling/badges, tests, docs, and API type regeneration).
