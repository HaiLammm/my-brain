# Story 8.1: Listing Editor — Create & Edit with Auto-Translation

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Vietnamese business owner,
I want to create a listing in Vietnamese using a 3-step wizard and have it auto-translated to Japanese with a live preview,
So that Japanese customers can find my business without me needing to know Japanese.

## Acceptance Criteria

1. **Given** I am logged in as `BusinessOwner` and navigate to `/business/vi/listings/new`
   **When** the listing editor loads
   **Then** a 3-step progress header displays: "① Thông tin · ② Ảnh & Menu · ③ Xem trước"
   **And** estimated time displays: "⏱️ Khoảng 10-15 phút"
   **And** the entire UI is in Vietnamese (FR64)
   **And** if I am NOT logged in or role is not `BUSINESS_OWNER`, redirect to `/business/vi/auth/register`

2. **Given** Step 1 — Basic Information loads
   **When** I fill in the form
   **Then** form fields include (all with 48px height for touch-friendliness):
   - Tên doanh nghiệp (Business Name) — **required**, max 100 chars
   - Danh mục (Category) — **required**, dropdown populated from `GET /api/v1/categories` (existing endpoint)
   - Địa chỉ (Address) — **required**, text input (Google Places auto-suggest is nice-to-have, not blocking)
   - Số điện thoại (Phone) — **required**, Vietnamese 10-digit format validation
   - Giờ mở cửa (Business Hours) — with quick presets (e.g., "9:00–22:00", "10:00–23:00", "24/7")
   - Mô tả ngắn (Short Description) — optional, max 200 chars with live character counter
   - Zalo liên hệ (Zalo Contact) — optional
   **And** required fields show red asterisk (*)
   **And** errors display inline in Vietnamese below each invalid field
   **And** "Tiếp theo" (Next) button validates before advancing to Step 2

3. **Given** Step 2 — Photos & Menu loads
   **When** I interact with the photo upload area
   **Then** a dashed-border upload area with "＋" icon opens the device file picker on tap
   **And** uploaded photos display in a grid; first photo marked "Ảnh bìa" (Cover) with badge
   **And** I can reorder photos via drag-and-drop and remove via × button (with confirmation)
   **And** minimum 3 photos required, maximum 10; upload button disables at max with message "Đã đạt tối đa 10 ảnh"
   **And** photos are uploaded via `POST /api/v1/media/upload` (existing endpoint, `owner_type=listing`)

4. **Given** Step 2 — Menu section
   **When** I add menu items
   **Then** an editable table displays with columns: Món ăn (VI) | Dịch sang tiếng Nhật (JP) | Giá (VND)
   **And** "＋ Thêm món" button adds empty rows for manual entry
   **And** menu items are optional (a listing can have zero menu items)
   **And** OCR from menu photo (📷 button) is out-of-scope for this story — manual entry only. `TODO(story-8.1-ocr): add menu OCR via Google Vision` comment MUST be present so future work is traceable

5. **Given** Step 3 — Preview & Publish loads
   **When** the preview step renders
   **Then** a split view shows:
   - **Top/Left:** Vietnamese summary of entered data (read-only)
   - **Bottom/Right:** Japanese customer preview card showing:
     - Cover photo
     - Business name auto-translated to Japanese (katakana transliteration)
     - Category tag in Japanese
     - Menu items with Japanese names and ¥ prices (via `formatDualPrice`)
   **And** a 🔄 refresh button re-triggers translation if content was edited
   **And** a disclaimer displays: "機械翻訳です。正確性を保証しません。" (Auto-translated, not guaranteed)
   **And** the Japanese preview fetches from `POST /api/v1/business/listings/preview-translation` (new endpoint)

6. **Given** I tap "Đăng tin ngay" (Publish Now)
   **When** form validation passes
   **Then** the listing is created via `POST /api/v1/business/listings` with `status=published`
   **And** `listing.created` event fires → triggers background Celery task `translate_listing_fields` for full translation + Meilisearch indexing
   **And** a full-screen success overlay displays:
   - Animated green checkmark (reuse `SuccessBanner` component)
   - Message: "Tin đăng đã được đăng thành công!"
   - "Xem tin đăng" link to the published listing
   - Next-step prompt: "💡 Tạo coupon để thu hút khách hàng đầu tiên!"
   - "Tạo Coupon ngay →" CTA (disabled with tooltip "Sắp ra mắt" — Epic 8 Story 8.3)
   - "Về trang chủ" link → `/business/vi`

7. **Given** I navigate to `/business/vi/listings/[listing_id]/edit`
   **When** the edit form loads
   **Then** the same 3-step wizard loads pre-filled with existing listing data
   **And** I can review and edit the auto-translated Japanese text directly in the preview step
   **And** saving fires `PUT /api/v1/business/listings/{listing_id}` → `listing.updated` event
   **And** success toast: "Tin đăng đã được cập nhật"
   **And** only the listing owner can edit (backend verifies `business_owner_id == current_user.id`)

8. **Given** business owner navigates to `/business/vi` (business home)
   **When** the page loads
   **Then** a "My Listings" section displays all listings owned by the current user
   **And** each listing card shows: title, status badge (Published/Draft), category, created date
   **And** tapping a card navigates to the edit form
   **And** a prominent "＋ Tạo tin đăng mới" (Create New Listing) CTA button at top

## Tasks / Subtasks

### Backend — Database Migration

- [x] Task 1 (AC: #1, #6, #7): Alembic migration `2026_04_28_0001_add_business_owner_listing_fields.py`
  - [x] 1.1: Add `business_owner_id UUID REFERENCES users(id) ON DELETE SET NULL` to `listings` table (nullable — existing seed listings have no owner)
  - [x] 1.2: Add `phone VARCHAR(20)` to `listings` (nullable)
  - [x] 1.3: Add `zalo_contact VARCHAR(100)` to `listings` (nullable)
  - [x] 1.4: Add `short_description_vi VARCHAR(200)` and `short_description_ja VARCHAR(200)` to `listings` (nullable)
  - [x] 1.5: Add `status VARCHAR(20) NOT NULL DEFAULT 'published'` to `listings` with CHECK IN ('draft', 'published', 'inactive')
  - [x] 1.6: Add `translation_status VARCHAR(20) NOT NULL DEFAULT 'complete'` to `listings` with CHECK IN ('pending', 'complete', 'failed')
  - [x] 1.7: Add index `ix_listings_business_owner_id` ON `(business_owner_id) WHERE deleted_at IS NULL`
  - [x] 1.8: Add index `ix_listings_status_active` ON `(status) WHERE deleted_at IS NULL`
  - [x] 1.9: Create table `listing_menu_items` with: `id UUID PK`, `listing_id UUID NOT NULL FK → listings(id) ON DELETE CASCADE`, `name_vi VARCHAR(200) NOT NULL`, `name_ja VARCHAR(200)`, `price_vnd BIGINT`, `display_order INTEGER NOT NULL DEFAULT 0`, `created_at`, `updated_at`, `deleted_at` (inherit BaseModel)
  - [x] 1.10: `downgrade()` drops the `listing_menu_items` table, removes added columns and indexes cleanly

### Backend — Update Listing Models

- [x] Task 2 (AC: #1–#8): Extend existing `Listing` model in `backend/modules/listing/models.py`
  - [x] 2.1: Add `business_owner_id`, `phone`, `zalo_contact`, `short_description_vi`, `short_description_ja`, `status`, `translation_status` columns matching migration
  - [x] 2.2: Add `ListingStatus` StrEnum (`draft`, `published`, `inactive`) in `backend/modules/listing/constants.py`
  - [x] 2.3: Add `TranslationStatus` StrEnum (`pending`, `complete`, `failed`) in `backend/modules/listing/constants.py`
  - [x] 2.4: Create `ListingMenuItem` model in `backend/modules/listing/models.py` with `listing` relationship
  - [x] 2.5: Add `menu_items` relationship on `Listing` model: `relationship("ListingMenuItem", back_populates="listing", cascade="all, delete-orphan")`

### Backend — Business Listing Router & Service

- [x] Task 3 (AC: #6, #7, #8): Create `backend/modules/listing/business_router.py` (separate router for business endpoints, registered under `/api/v1/business/listings`)
  - [x] 3.1: `POST /api/v1/business/listings` — Create listing. Auth: `require_role(UserRole.BUSINESS_OWNER)`. Sets `business_owner_id = current_user.id`. Accepts: `BusinessListingCreateRequest` (title_vi, category_id, area_id, address_vi, phone, zalo_contact, short_description_vi, business_hours, menu_items, photo_ids, status). Returns `SingleEnvelope[BusinessListingResponse]`. On success → fires `listing.created` event → enqueues `translate_listing_fields` Celery task
  - [x] 3.2: `GET /api/v1/business/listings` — List my listings. Auth: `require_role(UserRole.BUSINESS_OWNER)`. Filters by `business_owner_id = current_user.id`, sorted by `created_at DESC`. Returns `Paginated[BusinessListingListItem]`
  - [x] 3.3: `GET /api/v1/business/listings/{listing_id}` — Get my listing detail. Auth: `require_role(UserRole.BUSINESS_OWNER)`. Returns 404 if not owned by current user. Returns `SingleEnvelope[BusinessListingResponse]`
  - [x] 3.4: `PUT /api/v1/business/listings/{listing_id}` — Update listing. Auth: `require_role(UserRole.BUSINESS_OWNER)`. Ownership check. Updates fields + replaces menu_items + re-triggers translation. Returns `SingleEnvelope[BusinessListingResponse]`
  - [x] 3.5: `DELETE /api/v1/business/listings/{listing_id}` — Soft-delete listing. Auth: owner check. Sets `deleted_at`
  - [x] 3.6: `POST /api/v1/business/listings/preview-translation` — Preview translation WITHOUT saving. Auth: `require_role(UserRole.BUSINESS_OWNER)`. Accepts: `{ title_vi, short_description_vi, menu_items: [{name_vi, price_vnd}] }`. Returns `{ title_ja, short_description_ja, menu_items: [{name_ja}] }`. Calls `infrastructure/translation_api.py:translate()` directly (not Celery — synchronous for preview)
  - [x] 3.7: Register `business_listing_router` in `backend/main.py` alongside existing routers

### Backend — Business Listing Schemas

- [x] Task 4 (AC: #2–#7): Add schemas in `backend/modules/listing/schemas.py`
  - [x] 4.1: `MenuItemCreate { name_vi: str (max 200), price_vnd: int | None }`
  - [x] 4.2: `MenuItemResponse { id, name_vi, name_ja, price_vnd, display_order }`
  - [x] 4.3: `BusinessListingCreateRequest { title_vi (required, 2-100 chars), category_id (UUID, required), area_id (UUID, required), address_vi (required), phone (required, regex ^0[0-9]{9}$), zalo_contact (optional), short_description_vi (optional, max 200), business_hours: list[BusinessHoursCreate], menu_items: list[MenuItemCreate], photo_ids: list[UUID], status: Literal["draft", "published"] = "published" }`
  - [x] 4.4: `BusinessListingUpdateRequest` — same fields as create but all optional (partial update)
  - [x] 4.5: `BusinessListingListItem { id, title_vi, title_ja, status, translation_status, category: ListingCategoryResponse, created_at, updated_at, photo_count: int, hero_photo_url: str | None }`
  - [x] 4.6: `BusinessListingResponse` — full detail including all fields, menu_items, photos, business_hours, translation fields
  - [x] 4.7: `TranslationPreviewRequest { title_vi, short_description_vi, menu_items: list[MenuItemCreate] }`
  - [x] 4.8: `TranslationPreviewResponse { title_ja, short_description_ja, menu_items: list[{ name_vi, name_ja }] }`

### Backend — Business Listing Service

- [x] Task 5 (AC: #6, #7): Create `backend/modules/listing/business_service.py`
  - [x] 5.1: `create_listing()` — validates category/area exist, creates Listing row with business_owner_id, creates BusinessHours rows, creates ListingMenuItem rows, associates photos (update MediaFile.owner_id), enqueues `translate_listing_fields` Celery task, returns listing
  - [x] 5.2: `list_my_listings(user_id, page, per_page)` — query listings WHERE business_owner_id = user_id, join category, batch-load hero photos via MediaService pattern from listing service
  - [x] 5.3: `get_my_listing(user_id, listing_id)` — fetch with ownership check, eager-load menu_items + business_hours + photos
  - [x] 5.4: `update_listing()` — ownership check, update fields, replace menu_items (delete old + insert new), re-trigger translation if Vietnamese text changed
  - [x] 5.5: `delete_listing()` — ownership check, soft-delete
  - [x] 5.6: `preview_translation()` — call `infrastructure.translation_api.translate()` for each text field (vi→ja), return translations. Use `asyncio.gather()` for parallel translation of multiple fields. Catch `TranslationServiceUnavailableException` → return partial results with error flag

### Backend — Translation Celery Task

- [x] Task 6 (AC: #6): Create `backend/modules/listing/tasks.py` for background translation
  - [x] 6.1: `translate_listing_fields(listing_id: str)` Celery task — loads listing from DB, translates `title_vi → title_ja`, `short_description_vi → short_description_ja`, `description_vi → description_ja`, `address_vi → address_ja`, all `menu_item.name_vi → menu_item.name_ja`. Uses `infrastructure.translation_api.translate()`. Sets `translation_status = "complete"` on success, `"failed"` on error. Follows async-in-sync Celery pattern from `backend/modules/notification/tasks.py`
  - [x] 6.2: Register task module import in `backend/infrastructure/worker.py`: `import modules.listing.tasks`
  - [x] 6.3: Translation failure MUST NOT block listing creation — listing remains published with `translation_status = "failed"`, background retry queues via Celery retry mechanism (max 3 retries, exponential backoff)

### Backend — Events

- [x] Task 7 (AC: #6, #7): Add event constants in `backend/modules/listing/events.py`
  - [x] 7.1: `LISTING_CREATED = "listing.created"` with payload `{ listing_id, business_owner_id, title_vi, category_slug }`
  - [x] 7.2: `LISTING_UPDATED = "listing.updated"` with payload `{ listing_id, business_owner_id, changes: list[str] }`
  - [x] 7.3: Fire events via `shared.event_bus` (check existing pattern in listing events.py — there's already `LISTING_VIEWED`)

### Backend — Tests

- [x] Task 8: Tests for business listing endpoints
  - [x] 8.1: `backend/tests/listing/test_business_router.py` — test create listing (201), create without auth (401), create as non-BUSINESS_OWNER (403), create with invalid data (422), list my listings (200), get my listing (200), get other owner's listing (404), update listing (200), delete listing (204), preview translation (200)
  - [x] 8.2: `backend/tests/listing/test_business_service.py` — test ownership validation, translation enqueue, menu item CRUD
  - [x] 8.3: Mock `infrastructure.translation_api.translate` in tests — do NOT call real Google API

### Frontend — Routes & Pages

- [x] Task 9 (AC: #1, #8): Create business listing pages
  - [x] 9.1: `apps/web/app/(business)/vi/listings/page.tsx` — My Listings page (server component). Fetches `GET /api/v1/business/listings` via apiClient. Renders listing cards grid + "＋ Tạo tin đăng mới" CTA button
  - [x] 9.2: `apps/web/app/(business)/vi/listings/new/page.tsx` — Create Listing page. Renders `<ListingWizard mode="create" />`
  - [x] 9.3: `apps/web/app/(business)/vi/listings/[listingId]/edit/page.tsx` — Edit Listing page. Fetches listing data, renders `<ListingWizard mode="edit" listing={data} />`
  - [x] 9.4: Update `apps/web/modules/business/components/BusinessSidebar.tsx` — add "Tin đăng" (Listings) nav link to `/business/vi/listings`

### Frontend — ListingWizard Component

- [x] Task 10 (AC: #1–#7): Create `apps/web/modules/business/components/ListingWizard.tsx` ("use client")
  - [x] 10.1: Step state management via `useState<1 | 2 | 3>(1)`. Progress header component showing current step highlighted
  - [x] 10.2: Step 1 `<BasicInfoStep />` — React Hook Form + Zod schema. Fields: title_vi, category_id (dropdown from categories), area_id (dropdown from areas), address_vi, phone, zalo_contact, short_description_vi. Vietnamese validation messages. 48px input height. Character counter for short_description_vi
  - [x] 10.3: Business Hours sub-component — 7 rows (Mon–Sun), each with open_time/close_time selects + is_closed toggle. Quick presets dropdown: "9:00–22:00 hàng ngày", "10:00–23:00 hàng ngày", "24/7"
  - [x] 10.4: Step 2 `<PhotoMenuStep />` — Photo grid with upload, reorder (CSS grid with drag), remove. Count indicator "3/10 ảnh". Reuse existing `POST /api/v1/media/upload` endpoint. Track `photo_ids` in form state. Menu items table with add/remove rows
  - [x] 10.5: Step 3 `<PreviewPublishStep />` — Split view. Left: Vietnamese summary (form data). Right: Japanese preview fetched from `POST /api/v1/business/listings/preview-translation`. Loading skeleton while translating. Disclaimer text. Publish button
  - [x] 10.6: Form submission — POST (create) or PUT (edit) to business listings API via `apiClient`. On success → render `<ListingSuccessOverlay />`
  - [x] 10.7: `<ListingSuccessOverlay />` — Full-screen overlay with SuccessBanner animation, message, view link, coupon CTA (disabled), dashboard link

### Frontend — API Client Functions

- [x] Task 11 (AC: #6, #7, #8): Create `apps/web/modules/business/lib/businessListingApi.ts`
  - [x] 11.1: `createListing(data: BusinessListingCreateRequest): Promise<BusinessListingResponse>` — POST `/api/v1/business/listings`
  - [x] 11.2: `updateListing(listingId: string, data: BusinessListingUpdateRequest): Promise<BusinessListingResponse>` — PUT `/api/v1/business/listings/{listingId}`
  - [x] 11.3: `getMyListings(page?: number): Promise<Paginated<BusinessListingListItem>>` — GET `/api/v1/business/listings`
  - [x] 11.4: `getMyListing(listingId: string): Promise<BusinessListingResponse>` — GET `/api/v1/business/listings/{listingId}`
  - [x] 11.5: `deleteListing(listingId: string): Promise<void>` — DELETE `/api/v1/business/listings/{listingId}`
  - [x] 11.6: `previewTranslation(data: TranslationPreviewRequest): Promise<TranslationPreviewResponse>` — POST `/api/v1/business/listings/preview-translation`
  - [x] 11.7: All calls go through `@/shared/lib/apiClient` which handles snake↔camelCase transform, CSRF header, and cookie credentials

### Frontend — Types

- [x] Task 12: Create `apps/web/modules/business/lib/types.ts`
  - [x] 12.1: `BusinessListingCreateRequest`, `BusinessListingUpdateRequest`, `BusinessListingResponse`, `BusinessListingListItem`, `MenuItemCreate`, `MenuItemResponse`, `TranslationPreviewRequest`, `TranslationPreviewResponse`, `ListingStatus`, `TranslationStatus`

### Frontend — Tests

- [x] Task 13: Component tests
  - [x] 13.1: `apps/web/modules/business/components/__tests__/ListingWizard.test.tsx` — renders step 1 by default, validates required fields, advances steps, handles form submission
  - [x] 13.2: `apps/web/modules/business/components/__tests__/BasicInfoStep.test.tsx` — renders all fields, validates phone format, shows character counter
  - [x] 13.3: `apps/web/modules/business/components/__tests__/PhotoMenuStep.test.tsx` — renders photo grid, add/remove menu items
  - [x] 13.4: `apps/web/modules/business/components/__tests__/PreviewPublishStep.test.tsx` — renders split view, shows skeleton while loading translation
  - [x] 13.5: Mock `apiClient` and `useAuth` in all tests. Use `vitest` + React Testing Library

### Integration — Wire Up & Update Navigation

- [x] Task 14: Integration
  - [x] 14.1: Update `apps/web/app/(business)/vi/page.tsx` (business home) to show "My Listings" section with listing cards + create CTA
  - [x] 14.2: Ensure BusinessSidebar nav includes "Tin đăng" link
  - [x] 14.3: Ensure the business layout at `apps/web/app/(business)/vi/layout.tsx` wraps new pages correctly (already has `lang="vi"` + BusinessSidebar)

### Review Findings

#### Decision Needed

- [ ] [Review][Decision] **D1: _ja fields accepted in create/update schemas** — Spec (Task 4.1, 4.3) says `MenuItemCreate` only has `name_vi, price_vnd` and create request only has Vietnamese fields. Implementation adds `title_ja`, `short_description_ja`, `name_ja` allowing manual Japanese override. Is this intentional? If yes, background translation will overwrite manual edits (see P5). If no, remove _ja fields from input schemas.
- [ ] [Review][Decision] **D2: Cannot clear optional fields to NULL via update** — `update_listing` skips fields with `value is None` (`business_service.py:200`). Since `BusinessListingUpdateRequest` uses `None` as "not provided", there is no way to clear a field (e.g., remove zalo_contact). Needs sentinel pattern or Pydantic `model_fields_set` check.

#### Patch

- [ ] [Review][Patch] **P1 CRITICAL: Draft/inactive listings visible on public API** — `ListingRepository.list()` and `get_by_id()` filter only by `deleted_at`, not `status`. Draft and inactive listings are exposed to all users via public endpoints. [`backend/modules/listing/repository.py:33,188`]
- [ ] [Review][Patch] **P2 CRITICAL: Circular import in worker.py** — Lines 4-5 import `modules.listing.tasks` and `modules.notification.tasks` BEFORE `celery_app = Celery(...)` on line 8. `tasks.py:10` imports `celery_app` from worker → circular ImportError on Celery worker startup. Move task imports after `celery_app` definition or use `celery_app.autodiscover_tasks()`. [`backend/infrastructure/worker.py:4-8`]
- [ ] [Review][Patch] **P3 HIGH: IDOR in _replace_listing_photos** — `_replace_listing_photos` selects MediaFiles by `id` and `owner_type=LISTING` but does not verify photos belong to the current user. A business owner can reference photo IDs from another owner's listing. Add `MediaFile.owner_id == listing_id OR MediaFile.owner_id == NULL` check. [`backend/modules/listing/business_service.py:359-363`]
- [ ] [Review][Patch] **P4 HIGH: autoretry_for=(Exception,) too broad** — Retries ALL exceptions including `ValueError`, `KeyError`, programming bugs. Should be limited to `TranslationServiceUnavailableException` and network errors. [`backend/modules/listing/tasks.py:21`]
- [ ] [Review][Patch] **P5 HIGH: Background translation overwrites manual Japanese edits** — User edits Japanese text in Step 3 → saved via create/update → `listing.created` event → Celery task unconditionally overwrites `title_ja`, `short_description_ja`, `menu_item.name_ja`. Manual edits lost. Task should skip fields that already have non-auto-translated values or check if Vietnamese text changed. [`backend/modules/listing/tasks.py:59-70`]
- [ ] [Review][Patch] **P6 MEDIUM: Event payload includes live ORM object** — `_build_event_payload` includes `"listing": listing` (live SQLAlchemy object). If any subscriber accesses lazy-loaded attributes outside the session, raises `DetachedInstanceError`. Serialize to dict or Pydantic model before emitting. [`backend/modules/listing/business_service.py:449`]
- [ ] [Review][Patch] **P7 MEDIUM: _replace_listing_photos overwrites created_at** — Overwrites `media.created_at` with computed timestamp for display ordering. Destroys original upload timestamp. Should use a separate `display_order` column or `updated_at` for ordering. [`backend/modules/listing/business_service.py:385-390`]
- [ ] [Review][Patch] **P8 MEDIUM: asyncio.run() may fail in Celery worker** — `asyncio.run()` creates a new event loop. If Celery uses gevent/eventlet pool (which has its own loop), this fails. Consider `asgiref.sync.async_to_sync` or ensure worker uses prefork pool. [`backend/modules/listing/tasks.py:96`]
- [ ] [Review][Patch] **P9 MEDIUM: Test isolation — no dependency_overrides.clear()** — All other test files use `app.dependency_overrides.clear()` in teardown. This file does not, causing leaked overrides across test classes. [`backend/tests/listing/test_business_router.py`]
- [ ] [Review][Patch] **P10 MEDIUM: Missing test for on_listing_write handler** — New event handler `on_listing_write` (translation enqueue trigger) has no test coverage. Other handlers (on_review_created, on_badge_upgraded) are tested. [`backend/tests/listing/test_events.py`]
- [ ] [Review][Patch] **P11 MEDIUM: No debounce on preview translation** — `useEffect` on Step 3 calls `refreshPreview()` on every change to `titleVi`, `shortDescriptionVi`, `previewMenuKey`. Each keystroke fires an API call. Add 500ms debounce. [`apps/web/modules/business/components/ListingWizard.tsx:264-276`]
- [ ] [Review][Patch] **P12 MEDIUM: Menu item translation index mismatch** — Submit uses `translation.menuItems[index]?.nameJa` to pair translations with form items. If user adds/removes menu items after last preview refresh, indices are misaligned → wrong translations sent to wrong items. Match by `nameVi` key instead. [`apps/web/modules/business/components/ListingWizard.tsx:316-317`]
- [ ] [Review][Patch] **P13 LOW: 24/7 preset uses closeTime="23:30"** — 30-minute gap before midnight. TIME_OPTIONS max is "23:30". Add "24:00" option or use `isClosed=false` with `null` times to represent 24h. [`apps/web/modules/business/components/BusinessHoursInput.tsx:69`]
- [ ] [Review][Patch] **P14 LOW: Sidebar Dashboard always active** — `pathname.startsWith(item.href)` with Dashboard `href="/vi"` matches ALL business routes. Use exact match for Dashboard or check `pathname === item.href`. [`apps/web/modules/business/components/BusinessSidebar.tsx:47`]

#### Deferred

- [x] [Review][Defer] No rate limiting on preview-translation endpoint [`business_router.py:112`] — deferred, enhancement
- [x] [Review][Defer] Sequential photo upload instead of parallel [`PhotoMenuStep.tsx`] — deferred, performance enhancement
- [x] [Review][Defer] PhotoMenuStep uses `window.confirm` instead of custom dialog [`PhotoMenuStep.tsx`] — deferred, UX polish
- [x] [Review][Defer] No menu item count limit (backend or frontend) — deferred, validation enhancement
- [x] [Review][Defer] `address_ja` not included in TranslationPreviewRequest/Response — deferred, feature gap
- [x] [Review][Defer] No listing status transition rules (can toggle draft↔published freely) — deferred, business logic
- [x] [Review][Defer] BusinessHours validation does not check open_time < close_time — deferred, validation enhancement
- [x] [Review][Defer] Meilisearch re-indexing not verified for new listing events — deferred, search integration
- [x] [Review][Defer] Public API queries (area top spots, nearby POIs) also need `status='published'` filter — deferred, broader fix needed
- [x] [Review][Defer] No optimistic UI updates on create/edit — deferred, UX enhancement

## Dev Notes

### Critical Architecture Decisions

1. **NO separate business module in backend** — extend the EXISTING `backend/modules/listing/` module with a `business_router.py` and `business_service.py`. The `Listing` model is already there. Adding a separate module would violate the "one model, one module" principle and create cross-module coupling. The business endpoints are a different interface to the SAME listing data.

2. **Listing model extension, NOT new table** — add columns to the existing `listings` table. A separate `business_listings` table would duplicate data and create sync nightmares. The listing IS the listing regardless of who created it.

3. **Translation is async (Celery) for save, sync for preview** — When publishing, translation runs in background via Celery (non-blocking). For the Step 3 preview, call the translation API synchronously so the user sees results immediately. This matches the existing pattern in `backend/modules/notification/tasks.py`.

4. **Menu OCR is OUT OF SCOPE** — The epic mentions OCR from menu photos, but this story focuses on the manual menu entry path. OCR requires Google Cloud Vision integration which is a separate concern. Add TODO comment for future story.

5. **Photo upload REUSES existing media module** — `POST /api/v1/media/upload` already handles EXIF validation, WebP conversion, DO Spaces upload. The business wizard just uses the existing endpoint and tracks returned `photo_ids`. Story 8.2 will add business-specific enhancements like batch upload.

### Existing Code to REUSE (DO NOT recreate)

| What | Location | How to Use |
|------|----------|-----------|
| Auth dependency | `backend/modules/auth/dependencies.py` | `require_role(UserRole.BUSINESS_OWNER)` |
| Listing model | `backend/modules/listing/models.py` | Extend with new columns |
| BusinessHours model | `backend/modules/listing/models.py` | Already exists, reuse for CRUD |
| Media upload endpoint | `backend/modules/media/router.py` | `POST /api/v1/media/upload` |
| MediaFile model | `backend/modules/media/models.py` | `owner_type=LISTING, owner_id=listing_id` |
| Translation API | `backend/infrastructure/translation_api.py` | `translate(text, "vi", "ja")` |
| Celery worker | `backend/infrastructure/worker.py` | Register new task import |
| Celery task pattern | `backend/modules/notification/tasks.py` | Sync wrapper around async: `asyncio.run()` |
| apiClient | `apps/web/shared/lib/apiClient.ts` | snake↔camelCase, CSRF, cookies |
| SuccessBanner | `apps/web/shared/components/SuccessBanner.tsx` | Green checkmark animation |
| Skeleton | `apps/web/shared/components/Skeleton.tsx` | Loading state (NEVER spinners) |
| Toast | `apps/web/shared/components/Toast.tsx` | Success/error notifications |
| StickyActionBar | `apps/web/shared/components/StickyActionBar.tsx` | Bottom action bar for wizard steps |
| StatusBadge | `apps/web/shared/components/StatusBadge.tsx` | Published/Draft/Inactive badges |
| EmptyState | `apps/web/shared/components/EmptyState.tsx` | No listings yet state |
| BusinessSidebar | `apps/web/modules/business/components/BusinessSidebar.tsx` | Already exists, add nav link |
| Business layout | `apps/web/app/(business)/vi/layout.tsx` | Already has `lang="vi"` + sidebar |
| formatDualPrice | `apps/web/shared/lib/format-price.ts` | VND → ¥ price display |
| exchange-rate | `apps/web/shared/lib/exchange-rate.ts` | JPY↔VND conversion |
| ListingCategory data | `GET /api/v1/categories` | Existing endpoint |
| Area data | `GET /api/v1/areas` | Existing endpoint |

### Anti-Patterns to AVOID

- **DO NOT** create a new `business` module in backend — extend `listing` module
- **DO NOT** import from `backend/modules/translation/` directly — use `infrastructure/translation_api.py`
- **DO NOT** use spinners — use `Skeleton` components for all loading states
- **DO NOT** hardcode exchange rates — use `exchange-rate.ts`
- **DO NOT** use relative imports (`../../../`) in frontend — use `@/` path aliases
- **DO NOT** use `any` type in TypeScript — use proper types from `types.ts`
- **DO NOT** expose auto-increment IDs — use UUID v4 everywhere
- **DO NOT** store timestamps in local timezone — use UTC
- **DO NOT** use `os.getenv()` — use `shared.config.settings`
- **DO NOT** create spinner/loading indicators — use Skeleton matching layout
- **DO NOT** add `next-intl` to business routes — business portal is Vietnamese-only, hardcoded strings

### Source Tree Components to Touch

**Backend (modify):**
- `backend/modules/listing/models.py` — add columns + ListingMenuItem model
- `backend/modules/listing/schemas.py` — add business schemas
- `backend/modules/listing/constants.py` — add ListingStatus, TranslationStatus enums
- `backend/modules/listing/events.py` — add LISTING_CREATED, LISTING_UPDATED
- `backend/main.py` — register business_listing_router
- `backend/infrastructure/worker.py` — register listing.tasks import

**Backend (create):**
- `backend/migrations/versions/2026_04_28_0001_add_business_owner_listing_fields.py`
- `backend/modules/listing/business_router.py`
- `backend/modules/listing/business_service.py`
- `backend/modules/listing/tasks.py`
- `backend/tests/listing/test_business_router.py`
- `backend/tests/listing/test_business_service.py`

**Frontend (modify):**
- `apps/web/modules/business/components/BusinessSidebar.tsx` — add listings nav link
- `apps/web/app/(business)/vi/page.tsx` — add my listings section

**Frontend (create):**
- `apps/web/app/(business)/vi/listings/page.tsx`
- `apps/web/app/(business)/vi/listings/new/page.tsx`
- `apps/web/app/(business)/vi/listings/[listingId]/edit/page.tsx`
- `apps/web/modules/business/components/ListingWizard.tsx`
- `apps/web/modules/business/components/BasicInfoStep.tsx`
- `apps/web/modules/business/components/PhotoMenuStep.tsx`
- `apps/web/modules/business/components/PreviewPublishStep.tsx`
- `apps/web/modules/business/components/ListingSuccessOverlay.tsx`
- `apps/web/modules/business/components/BusinessHoursInput.tsx`
- `apps/web/modules/business/components/MenuItemsTable.tsx`
- `apps/web/modules/business/components/MyListingCard.tsx`
- `apps/web/modules/business/lib/businessListingApi.ts`
- `apps/web/modules/business/lib/types.ts`
- `apps/web/modules/business/components/__tests__/ListingWizard.test.tsx`
- `apps/web/modules/business/components/__tests__/BasicInfoStep.test.tsx`
- `apps/web/modules/business/components/__tests__/PhotoMenuStep.test.tsx`
- `apps/web/modules/business/components/__tests__/PreviewPublishStep.test.tsx`

### Testing Standards

- **Backend**: pytest + pytest-asyncio, mock `infrastructure.translation_api.translate`, mock `infrastructure.do_spaces`, transaction rollback per test via `db_session` fixture. Target 80% service layer coverage
- **Frontend**: Vitest + React Testing Library, mock `apiClient`, mock `useAuth` (return BusinessOwner user), co-located `__tests__/` directories. Every component MUST render without error

### Project Structure Notes

- Business portal routes live under `(business)/vi/` route group — Vietnamese-only, desktop-first
- Business layout already exists with `BusinessSidebar` — add new nav items, don't restructure
- Backend business endpoints use `/api/v1/business/listings` prefix to distinguish from user-facing `/api/v1/listings`
- The Listing model is shared between user-facing and business endpoints — same DB table, different API surfaces

### Scope Boundaries

**IN SCOPE:**
- 3-step wizard (info → photos/menu → preview/publish)
- Create + Edit listing CRUD
- Manual menu item entry
- Synchronous translation preview (Step 3)
- Async Celery translation on publish
- Photo upload integration (reuse existing media endpoint)
- Business owner auth gate
- My Listings page

**OUT OF SCOPE (deferred to future stories):**
- Menu OCR via camera (TODO comment required) → future enhancement
- Google Places address auto-suggest → nice-to-have, not blocking
- Drag-to-reorder photos → can use simple up/down arrows initially
- Coupon creation CTA (disabled, Story 8.3)
- Business analytics dashboard (Story 8.4)
- Meilisearch re-indexing on listing create/update → handled by existing search module event listeners if wired, otherwise TODO
- EXIF camera-only enforcement for business photos → Story 8.2 enhancement

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-8-business-owner-portal.md#Story-8.1]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Module-Structure]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Translation-Pipeline]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure-boundaries.md#Business-Routes]
- [Source: _bmad-output/planning-artifacts/epics/requirements-inventory.md#FR31-FR34-FR64-FR72]
- [Source: backend/modules/auth/dependencies.py — require_role pattern]
- [Source: backend/modules/notification/tasks.py — Celery async-in-sync pattern]
- [Source: backend/infrastructure/translation_api.py — translate(text, source, target)]

## Dev Agent Record

### Agent Model Used

- openai/gpt-5.4

### Debug Log References

- `pytest tests/listing/test_business_router.py tests/listing/test_business_service.py`
- `ruff check --fix modules/listing/business_router.py modules/listing/business_service.py modules/listing/tasks.py modules/listing/events.py modules/listing/repository.py tests/listing/test_business_router.py tests/listing/test_business_service.py`
- `pytest tests/listing`
- `ruff check modules/listing tests/listing migrations/versions/2026_04_28_0001_add_business_owner_listing_fields.py`
- `npm test -- modules/business/components/__tests__/BusinessSidebar.test.tsx modules/business/components/__tests__/BasicInfoStep.test.tsx modules/business/components/__tests__/PhotoMenuStep.test.tsx modules/business/components/__tests__/PreviewPublishStep.test.tsx modules/business/components/__tests__/ListingWizard.test.tsx`
- `npx eslint modules/business/components modules/business/lib app/\(business\)/vi app/business/vi shared/components/StatusBadge.tsx --ext .ts,.tsx`
- `npm run build`
- `npm run lint` (blocked by pre-existing errors in unrelated translation/community modules)

### Completion Notes List

- Added business-owner listing CRUD, preview translation, ownership checks, and background Celery translation/index refresh wiring inside the existing `listing` backend module.
- Added the Vietnamese 3-step business listing wizard, My Listings screens, business home listing section, and success overlay in the web app.
- Added route aliases under `/business/vi/...` that redirect to the actual `(business)/vi` runtime paths (`/vi/...`) so story URLs and real Next.js routes both work.
- Verified backend listing suite, targeted frontend component tests, targeted lint checks, and production web build.

### File List

- `_bmad-output/implementation-artifacts/8-1-listing-editor-create-edit-with-auto-translation.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `backend/infrastructure/worker.py`
- `backend/main.py`
- `backend/migrations/versions/2026_04_28_0001_add_business_owner_listing_fields.py`
- `backend/modules/listing/business_router.py`
- `backend/modules/listing/business_service.py`
- `backend/modules/listing/constants.py`
- `backend/modules/listing/dependencies.py`
- `backend/modules/listing/events.py`
- `backend/modules/listing/exceptions.py`
- `backend/modules/listing/models.py`
- `backend/modules/listing/repository.py`
- `backend/modules/listing/schemas.py`
- `backend/modules/listing/tasks.py`
- `backend/tests/listing/test_business_router.py`
- `backend/tests/listing/test_business_service.py`
- `backend/tests/listing/test_events.py`
- `apps/web/app/(business)/vi/auth/callback/page.tsx`
- `apps/web/app/(business)/vi/layout.tsx`
- `apps/web/app/(business)/vi/listings/[listingId]/edit/page.tsx`
- `apps/web/app/(business)/vi/listings/new/page.tsx`
- `apps/web/app/(business)/vi/listings/page.tsx`
- `apps/web/app/(business)/vi/page.tsx`
- `apps/web/app/business/vi/auth/callback/page.tsx`
- `apps/web/app/business/vi/auth/register/page.tsx`
- `apps/web/app/business/vi/listings/[listingId]/edit/page.tsx`
- `apps/web/app/business/vi/listings/new/page.tsx`
- `apps/web/app/business/vi/listings/page.tsx`
- `apps/web/app/business/vi/page.tsx`
- `apps/web/modules/business/components/BasicInfoStep.tsx`
- `apps/web/modules/business/components/BusinessHoursInput.tsx`
- `apps/web/modules/business/components/BusinessRegisterForm.tsx`
- `apps/web/modules/business/components/BusinessSidebar.tsx`
- `apps/web/modules/business/components/ListingSuccessOverlay.tsx`
- `apps/web/modules/business/components/ListingWizard.tsx`
- `apps/web/modules/business/components/MenuItemsTable.tsx`
- `apps/web/modules/business/components/MyListingCard.tsx`
- `apps/web/modules/business/components/PhotoMenuStep.tsx`
- `apps/web/modules/business/components/PreviewPublishStep.tsx`
- `apps/web/modules/business/components/__tests__/BasicInfoStep.test.tsx`
- `apps/web/modules/business/components/__tests__/BusinessSidebar.test.tsx`
- `apps/web/modules/business/components/__tests__/ListingWizard.test.tsx`
- `apps/web/modules/business/components/__tests__/PhotoMenuStep.test.tsx`
- `apps/web/modules/business/components/__tests__/PreviewPublishStep.test.tsx`
- `apps/web/modules/business/lib/businessListingApi.ts`
- `apps/web/modules/business/lib/businessListingServer.ts`
- `apps/web/modules/business/lib/types.ts`
- `apps/web/shared/components/StatusBadge.tsx`

### Change Log

- 2026-04-28: Implemented Story 8.1 end-to-end across backend business listing APIs, async translation workflow, Vietnamese business portal wizard UI, tests, and `/business/vi` route aliases.
