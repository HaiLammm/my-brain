# Deferred Work

## Deferred from: code review of 1-1-monorepo-setup-development-infrastructure (2026-04-11)

- Route group layout files missing for (admin), (user)/[locale], (business)/vi — address in story 1.2/1.3
- backend/shared/event_bus.py and utils/ directory missing — create when first cross-module event is needed
- Celery tasks in infrastructure/worker.py instead of tasks/ per architecture spec — restructure when first Celery task is implemented
- Health endpoint (/api/v1/health) doesn't probe DB/Redis — add dependency checks when services stabilize
- vitest.config.ts missing setupFiles for @testing-library/jest-dom — configure when first component test needs DOM matchers
- Hardcoded Postgres password in docker-compose — use .env substitution before any non-local deployment
- Redis has no password configuration — add requirepass before any non-local deployment
- Settings .env file path uses relative CWD resolution — use absolute path if Docker WORKDIR changes

## Deferred from: code review of 1-4-user-authentication-social-login-line-google (2026-04-12)

- W1: Logout does not invalidate access token — stateless JWT, needs Redis blacklist infrastructure to support token revocation
- W2: Access token 24h lifetime too long for cookie-based flow — matches current spec requirement (ACCESS_TOKEN_EXPIRE_MINUTES=1440), reconsider when reducing to short-lived tokens
- W3: Refresh token hash uses SHA-256 instead of Argon2id — marginal for cryptographically random tokens, consider upgrading if threat model changes
- W4: `jwt_secret` default "change-this-secret" not validated on startup — add model_validator for production environment before deployment
- W5: Migration `downgrade()` missing `IF EXISTS` guards — add for idempotent rollbacks
- W6: `AuthProvider` double fetch in React StrictMode — dev-only, not user-facing
- W7: Zustand store not persisted across page loads — causes loading flash, add `zustand/middleware` persist for better UX

## Deferred from: code review of 2-2-homepage-hero-senpai-picks-deals (2026-04-18)

- Canonical/OG URL falls back to `localhost:3000` when `NEXT_PUBLIC_SITE_URL` is unset — add to deploy env checklist and consider a build-time guard that refuses to build prod without it
- WelcomeBanner post-hydration flash — needs cookie-based SSR decision; current mount→read-localStorage pattern causes a brief flash for first-time viewers; revisit with cookie or `useSyncExternalStore` after launch
- `images.remotePatterns` uses wildcard `**.digitaloceanspaces.com` / `**.cdn.digitaloceanspaces.com` — tighten to the specific project bucket hostname once the production CDN is finalized
- Home-module test suite mocks `next/image` in a way that drops `fill`/`sizes` prop validation — revisit in Test Architect `automate` pass
- Sitemap currently lists only the homepage — expand with listings, areas, community, deals routes as their stories ship
- Search-bar `q` parameter flows to `/ja/listings?q=...` — sanitize on the listings page; ownership belongs to Story 2.3
- AC#11 axe-core a11y check not implemented — add automated a11y test in Test Architect `automate` pass
- `SenpaiPickCard` does not render the category label required by AC#3 — requires backend change to embed nested `category` on `ListingListItem` (currently only `category_id`); track as a follow-up to extend the listing list schema

## Deferred from: code review of 1-5-1-zalo-social-login-users (2026-04-15)

- Open redirect via `origin` query param in OAuth authorize endpoints (LINE, Google, Zalo) — validate origin against CORS allowlist before using it to build redirect_uri
- `redirect_uri` not persisted in Redis during authorize, trusting client-supplied value in callback — store redirect_uri server-side and enforce it during token exchange
- OAuth callback fallback hardcodes locale `"ja"` ignoring actual user locale from state string — extract locale from state and pass to `_build_redirect_uri`

## Deferred from: code review of 2-4-listing-detail-page (2026-04-18)

- Fair-price band boundary (p75 inclusive, p25/p50 unused, equal-variance case) — pre-existing from Story 2.3
- `_search_db` DB fallback maps `sort_by="recommended"` → `"rating"`, losing senpai+review_count tiebreak — pre-existing Story 2.3 behavior
- Meilisearch amenity filter only strips `"`, not backslash/meta chars — pre-existing Story 2.3 scope
- `close_meilisearch_client` calls `get_meilisearch_client.__wrapped__()` which returns a fresh client; cached client never closed — infra cleanup
- `reindex_listings` loads all listings into memory before batching — ops concern at scale
- `ListingDetailResponse.fair_price_band: Literal[...]` vs `ListingSearchItem.fair_price_band: str | None` — schema inconsistency, low risk
- `shared/events.py::subscribe` appends handlers without dedupe — duplicate handlers on dev hot-reload only

## Deferred from: story 10-1-google-maps-integration-route-api-foundation (2026-04-21)

- Proper Prometheus `/metrics` exporter for `journey_directions_cache_hit_total` / `_miss_total` — Story 10.1 ships these as Redis INCR counters behind an internal JSON endpoint `/api/v1/_internal/journeys/metrics`; wire a real `prometheus_client` exporter when any other module needs one.
- Google Cloud billing 100% hard-cap / auto-disable — Story 10.1 ships 50% and 80% alerts only; evaluate Cloud Billing budgets with programmatic auto-disable when traffic grows.
- Journey Directions endpoint currently public (no auth) — tighten with per-endpoint rate limit or auth gate once real traffic shape is observed in Story 10.2+.
- `listings.latitude` / `listings.longitude` are still the source of truth for Epic 2 Haversine queries; consolidate onto `listings.location` and drop the legacy columns after Epic 10 ships and Epic 2 queries are migrated.
- Travel mode hardcoded to `driving` — Story 10.5 (route personality scoring) should parameterize per personality (walking/transit for "scenic").

## Deferred from: story 10-2-journey-input-route-display (2026-04-21)

- Journey 10.2: reverse-geocode deep-link lat/lng into display labels on inputs (currently raw coords; acceptable MVP UX).

## Deferred from: code review of 3-3-contribution-points-gamification-engine (2026-04-24)

- Event subscriber transaction boundary — gamification points commit in separate session, independent of source transaction. If source rolls back, orphaned points remain. Address when Epic 4/5 event emitters are implemented.
- No cache invalidation for gamification queries after point awards — review/post creation modules (Epic 4/5) don't exist yet, so cache invalidation can't be wired. Add when those modules ship.
- Offset-based pagination in contribution history may skip/duplicate items when new points are added between page fetches — consider cursor-based pagination if user feedback indicates issues.
- Event bus `emit()` runs handlers sequentially — gamification handler blocks notification handler and vice versa. Consider `asyncio.gather` for concurrent execution when handler count grows.

## Deferred from: code review of 3-4-senpai-badge-system (2026-04-24)

- Double-wrapped `data.data` in batch badge response — `SingleEnvelope[BatchBadgeLookupResponse]` creates nested `data.data`; consider flattening when batch endpoint is consumed by frontend
- No dedup of user_ids in batch badge endpoint — duplicate UUIDs processed redundantly; add uniqueness validation if endpoint sees heavy use
- No SenpaiEncouragement unit test — component is simple wrapper; add test if logic grows

## Deferred from: code review of 4-2-helpful-votes-review-display (2026-04-24)

- helpful_count can drift from actual vote count — denormalized counter within transaction is adequate; reconcile if drift observed in production
- _BADGE_LEVELS raw table() construct without type info — works with PostgreSQL but fragile; consider passing column types or importing model
- Pagination renders all page buttons without truncation — add ellipsis pattern when listings accumulate many reviews
- Duplicate query construction in list_for_listing (anonymous vs authenticated branches) — refactor to shared base query when next change touches this method
- file.content_type can be None in upload_review_photo — fails safely but error message unclear; add explicit None check
- updated_at not set on vote soft-delete — verify BaseModel onupdate behavior; explicitly set if needed
- attach_photos_to_review changes owner_id from user_id to review_id — architectural concern with dual semantics; consider dedicated review_id FK on MediaFile

## Deferred from: code review of 5-2-join-groups-create-posts-comments (2026-04-25)

- Rejoin path does not reset `created_at` on un-soft-deleted GroupMembership; analytics may treat rejoin as long-time member — semantics decision deferred (`backend/modules/community/repository.py:75-79`)
- `func.left(Post.body, 140)` preview truncation is Postgres-specific and naive (no markdown/CJK awareness) — cosmetic, address when post preview is reworked (`repository.py:203`)
- No idempotency keys on `POST /community/posts` and `POST /community/posts/{id}/comments` — duplicate creation under retry is possible; add idempotency middleware when retry semantics matter
- Post/comment body has no server-side HTML/markdown sanitization (`schemas.py PostCreateRequest.body`, `CommentCreateRequest.body`) — deferred to moderation/story 5.x; rely on FE escaping for now
- `list_group_posts` does not re-check `Group.deleted_at` after service-level pre-check; TOCTOU window allows soft-deleted-group posts to leak (`repository.py:196-227`)
- Pagination uses unbounded `count(*)` per request on `get_group_posts` and `get_post_comments` — perf optimization (cursor / approximate count) deferred
- No edit/soft-delete endpoints for post/comment; denormalized counters (`comment_count`, `like_count`) cannot be reconciled until those endpoints exist — out of scope for 5.2
- Rate limit scoping for `group_join` / `post_create` / `comment_create` depends on `shared/rate_limit.py`; verify keys include user/IP so the cap is per-actor, not global

## Deferred from: code review of 5-2-join-groups-create-posts-comments — chunk 2 tests (2026-04-25)

- Datetime fixtures in community/gamification tests use `datetime.now(UTC)` without `freeze_time`; relative-time logic added later may flake
- Several tests assert exact Japanese strings as response identity (e.g. titles, bodies); fragile to copy edits — anchor on IDs when possible
- Event-payload tests use string IDs ("comment-1"/"post-1") instead of UUID strings; real producers send UUID strings
- No rate-limit assertion tests for `POST /join`, `POST /posts`, `POST /comments` — needs a shared rate-limit testing harness
- No idempotency / duplicate-event handling test for gamification subscribers — depends on idempotency-key implementation that does not yet exist
- `register_gamification_subscribers` test asserts only event-name list, not handler identity — defer until the registration map grows
- No test for malformed UUID in URL path — FastAPI handles implicitly
- `leave_group` repo test does not assert tz-aware `deleted_at` — pre-existing pattern
- `_FakeService.award_points` does not capture `**kwargs`; future signature additions silently uncovered

## Deferred from: code review of 5-2-join-groups-create-posts-comments — chunk 3 frontend (2026-04-25)

- Native `<img>` instead of `next/image` in CommentItem/PostCard/ThreadHeader — image CDN strategy not yet set
- Aria-labels missing on emoji icons (💬, ❤️) — accessibility polish
- N+1 `getTranslations()` calls inside `PostCard` Server Components — pass `t` from parent later
- `relativeTime` computed at SSR freezes value per request — acceptable under `force-dynamic`; revisit when adding ISR
- Long-CJK / no-space content overflow in titles/bodies — add `break-words` when real content surfaces issues
- No `generateStaticParams` / caching strategy on community group + post detail pages — defer to ISR rollout
- `description: post.body.slice(0, 160)` in metadata may split multi-byte glyphs and includes raw user content — needs proper excerpt helper
- Photo upload UI shells (post composer button, reply composer icon) — explicitly deferred by Story 5.2 spec
- Bare `catch {}` blocks in `[group_slug]/page.tsx` and `[group_slug]/[post_id]/page.tsx` swallow errors — needs Sentry/log when observability is in place

## Deferred from: code review of 6-2-phrase-packs-phrasebook (2026-04-27)

- Service method `get_phrases` returns `PhrasePackResponse | PhraseCategoryResponse` union type — works at runtime but fragile for static analysis (mypy/pyright); split into two methods when next modification touches service.py
- `phrase.ja` used as React key in PhraseCategorySection and QuickPhraseChips — unique within each category today but will collide if duplicate Japanese text is added within a category; add unique ID field when phrase data structure is revisited
- ConversationHistory in VoiceTranslationView may need explicit `min-h-0 flex-1` wrapper after QuickPhraseChips was added above it — pre-existing flex layout pattern; verify on real device testing

## Deferred from: code review of 6-3-visual-menu-ocr-helper-floating-fab (2026-04-28)

- W1: Pillow decompression bomb protection — `Image.open()` on untrusted input without explicit pixel count check. Pillow's default `MAX_IMAGE_PIXELS` provides baseline protection but could be tightened. [backend/modules/translation/service.py:213-215]
- W2: `_fallback_transliterate` and phrase pack construction at module import time — synchronous computation during import adds startup latency. Pre-existing from story 6-2. [backend/modules/translation/constants.py]

## Deferred from: code review of 8-1-listing-editor-create-edit-with-auto-translation (2026-04-28)

- No rate limiting on preview-translation endpoint — business owner can spam translation API [`business_router.py:112`]
- Sequential photo upload instead of parallel — UX slowness on multi-photo upload [`PhotoMenuStep.tsx`]
- PhotoMenuStep uses `window.confirm` instead of custom dialog — inconsistent with design system [`PhotoMenuStep.tsx`]
- No menu item count limit (backend or frontend) — unbounded list possible
- `address_ja` not included in TranslationPreviewRequest/Response — address translation not previewed
- No listing status transition rules (can toggle draft↔published freely) — business logic gap
- BusinessHours validation does not check open_time < close_time — allows invalid time ranges
- Meilisearch re-indexing not verified for new listing events — search may not index new listings
- Public API queries (area top spots, nearby POIs) need `status='published'` filter — broader fix beyond P1
- No optimistic UI updates on create/edit — UX enhancement for perceived performance

## Deferred from: code review of 8-2-photo-upload-media-management-business (2026-04-29)

- W1: `VoiceTranslationView` `readTranslationHistory()` in `useState` initializer may crash during SSR — outside story 8-2 scope, regression fix touched this file
- W2: `useSpeechRecognition` `getSpeechRecognitionConstructor()` in `useState` initializer accesses browser-only API during SSR — outside story 8-2 scope, regression fix touched this file
- W3: `_generate_thumbnail` blocks async event loop with sync CPU-bound Pillow resize inside `upload_photo` — spec explicitly mandates synchronous approach; pre-existing pattern from `_process_image`

## Deferred from: code review round 2 of 8-2-photo-upload-media-management-business (2026-04-29)

- W1: Synchronous S3 `put_object` calls in `upload_photo` block async event loop for two network roundtrips per upload — pre-existing pattern from `_process_image`; extends previous W3 [service.py:107-125]
- W2: Generic `/api/v1/media` upload endpoint accepts arbitrary `owner_id` without ownership verification — any authenticated user can attach photos to any entity; pre-existing IDOR not introduced by story 8-2 [router.py:21-42]
- W3: Generic media upload allows `owner_type` bypass — uploading via `owner_type=review` through generic endpoint skips EXIF enforcement; pre-existing architecture gap [router.py:21-42]

## Deferred from: code review of 8-3-coupon-management-business — chunk 1 backend (2026-05-02)

- `Paginated`/`SingleEnvelope`/`PaginationMeta` imported from `modules.listing.schemas` — generic response wrappers should live in `shared/schemas.py` [schemas.py:8]
- No rate limiting on `/api/v1/business/coupons/preview-translation` — business owner can spam translation API; infrastructure concern [business_router.py:45]
- Direct module imports from `modules.listing.*` and `modules.translation.*` in `business_service.py` — pre-existing DI boundary pattern [business_service.py:11-15]
- Error response format missing `"error"` wrapper key per architecture spec — pre-existing global handler deviation [error_handler.py:17-25]

## Deferred from: code review of 8-3-coupon-management-business — chunk 2 frontend (2026-05-02)

- No pagination in coupon list — only first 20 coupons per category visible; business owners with 20+ coupons cannot manage them all [CouponList.tsx:149-157]
- free_item discount suffix shows ₫ instead of "(ước tính)" estimate label — confusing UX [CouponForm.tsx:149-151]
- No unsaved changes navigation guard (beforeunload) — user can lose form data on accidental navigation [CouponForm.tsx]
- No publish-from-edit workflow for draft coupons — draft coupons created with "Lưu nháp" cannot be published from edit page [CouponForm.tsx:320-323]
- Translation preview missing AbortController — stale translation response can arrive after newer one or after submit [CouponForm.tsx:225-237]
- Listing dropdown capped at 50 items — business owners with 50+ published listings cannot select all of them [CouponForm.tsx:188]
- termsVi/descriptionVi missing max length in Zod schema — could allow arbitrarily long input that backend rejects [CouponForm.tsx:40]
- Missing error boundary + aria-invalid accessibility — form errors not announced to screen readers [CouponForm.tsx]

## Deferred from: code review of story 8-4 (2026-05-04)

- `listing_ids_for_owner` returns draft listings in analytics — analytics summary includes views/saves for draft listings that aren't publicly visible. Design choice, revisit if business owners find it confusing.
- `review_options` coupled into summary endpoint — dispute form's review selector data is bundled into the analytics summary response. Separate endpoint when dispute feature grows.
- `activity_log` table not queried in activity feed — activity feed uses direct review/coupon/view_stats queries instead of the activity_log table. Integrate activity_log when audit trail is needed.
