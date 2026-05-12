# Story 8.3: Coupon Management (Business)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Vietnamese business owner,
I want to create, edit, and manage coupons with auto-translation to Japanese and a live Japanese customer preview,
So that I can attract Japanese customers with deals they can understand and redeem.

## Acceptance Criteria

1. **Given** I navigate to `/business/vi/coupons/new` (FR35)
   **When** the coupon creation form loads
   **Then** a Vietnamese form displays with fields:
   - Listing selector (dropdown of my published listings — required, since coupons belong to a listing)
   - Tiêu đề coupon (coupon title, Vietnamese, required, max 200 chars)
   - Mô tả (description, Vietnamese, optional)
   - Điều kiện áp dụng (terms/conditions, Vietnamese, optional)
   - Loại giảm giá (discount type dropdown: Giảm % / Giảm tiền / Tặng món, required)
   - Giá trị giảm (discount value, required — percentage for %, VND amount for fixed, estimated item value for free_item)
   - Ngày bắt đầu / Ngày kết thúc (validity period, required, end > start)
   - Số lượt sử dụng tối đa (max redemptions, optional — blank = unlimited)
   **And** a live Japanese customer preview card updates as I type (UX-DR41)
   **And** the entire UI is in Vietnamese (FR64)

2. **Given** I fill in coupon details and tap "Tạo Coupon"
   **When** form validation passes
   **Then** Vietnamese text fields (title, description, terms) are auto-translated to Japanese
   **And** the coupon is created with `is_active=true`
   **And** a `coupon.created` event fires
   **And** a success toast shows "Coupon đã được tạo thành công"
   **And** I am redirected to the coupon list at `/business/vi/coupons`

3. **Given** I want to save a coupon as draft without publishing
   **When** I tap "Lưu nháp" (Save Draft) instead of "Tạo Coupon"
   **Then** the coupon is created with `is_active=false`
   **And** the coupon appears in my list with status badge "Nháp" (Draft)

4. **Given** I navigate to the coupon manager at `/business/vi/coupons`
   **When** the page loads
   **Then** coupons display in two sections: "Đang hoạt động" (Active) and "Đã hết hạn / Đã tắt" (Expired/Inactive)
   **And** each coupon card shows: title, discount summary, validity dates, redemption count / max, status badge (Đang hoạt động / Hết hạn / Nháp)
   **And** cards link to the edit page for that coupon

5. **Given** I want to deactivate a coupon
   **When** I tap the deactivate button on an active coupon
   **Then** a confirmation dialog appears: "Tắt coupon này? Khách hàng sẽ không thể nhìn thấy hoặc sử dụng coupon này nữa."
   **And** upon confirmation, the coupon `is_active` is set to `false`
   **And** the coupon is no longer visible to Japanese users on the deals page
   **And** existing claimed (but unredeemed) coupons remain valid for redemption

6. **Given** I want to edit a coupon
   **When** I navigate to `/business/vi/coupons/[couponId]/edit`
   **Then** the form opens pre-filled with existing data
   **And** the Japanese preview updates live as I make changes
   **And** I can manually edit the Japanese translation fields
   **And** a "Làm mới bản dịch" (Refresh Translation) button re-triggers auto-translation
   **And** saving updates the coupon and fires a `coupon.updated` event

7. **Given** a coupon with existing redemptions
   **When** I attempt to edit it
   **Then** the listing selector is disabled (cannot move coupon to a different listing)
   **And** `max_redemptions` cannot be reduced below the current redemption count
   **And** `valid_from` cannot be changed if the coupon has already started

8. **Given** the coupon list is empty (no coupons created yet)
   **When** the empty state displays
   **Then** a friendly message shows: "Chưa có coupon nào" with illustration
   **And** a CTA button "Tạo Coupon đầu tiên" links to `/business/vi/coupons/new`

9. **Given** I have no published listings
   **When** I navigate to `/business/vi/coupons/new`
   **Then** an empty state shows: "Bạn cần có ít nhất một tin đăng để tạo coupon"
   **And** a CTA "Tạo tin đăng" links to `/business/vi/listings/new`

## Tasks / Subtasks

### Backend — Database Migration

- [x] Task 1 (AC: #1): Alembic migration to add `free_item` discount type
  - [x] 1.1: Drop and recreate the `chk_coupon_discount_type` CHECK constraint to allow `('percentage', 'fixed_vnd', 'free_item')` — use `op.drop_constraint()` + `op.create_check_constraint()`
  - [x] 1.2: `downgrade()` restores original constraint `('percentage', 'fixed_vnd')` — only safe if no rows with `free_item` exist, add guard query
  - [x] 1.3: Migration name: `2026_05_01_0001_add_free_item_discount_type.py`

### Backend — Business Coupon Schemas

- [x] Task 2 (AC: #1, #2, #3, #6): Add business coupon schemas to `backend/modules/coupon/schemas.py`
  - [x] 2.1: `BusinessCouponCreateRequest` — `listing_id: UUID`, `title_vi: str` (max 200), `description_vi: str | None`, `terms_vi: str | None`, `discount_type: Literal["percentage", "fixed_vnd", "free_item"]`, `discount_value: Decimal` (positive), `valid_from: datetime`, `valid_until: datetime` (> valid_from), `max_redemptions: int | None` (positive if set), `is_active: bool = True`
  - [x] 2.2: `BusinessCouponUpdateRequest` — same fields as create but all optional except `title_vi`. Add Pydantic validator: if `discount_type` changes, `discount_value` is required
  - [x] 2.3: `BusinessCouponListItem` — `id`, `listing_id`, `listing_title_vi`, `title_vi`, `title_ja`, `discount_type`, `discount_value`, `valid_from`, `valid_until`, `is_active`, `redemption_count`, `max_redemptions`, `created_at`
  - [x] 2.4: `BusinessCouponDetail` — extends `BusinessCouponListItem` with `description_vi`, `description_ja`, `terms_vi`, `terms_ja`, `title_en`, `description_en`, `updated_at`
  - [x] 2.5: `CouponTranslationPreviewRequest` — `title_vi: str`, `description_vi: str | None`, `terms_vi: str | None`
  - [x] 2.6: `CouponTranslationPreviewResponse` — `title_ja: str`, `description_ja: str | None`, `terms_ja: str | None`, `has_error: bool`

### Backend — Business Coupon Repository Methods

- [x] Task 3 (AC: #4, #7): Add business-side query methods to `backend/modules/coupon/repository.py`
  - [x] 3.1: `CouponRepository.list_for_business_owner(user_id, status_filter, page, per_page)` — JOIN `coupons → listings` WHERE `listings.business_owner_id == user_id AND coupons.deleted_at IS NULL`. Filter: `active` = is_active=true AND valid_until > now(), `expired_inactive` = is_active=false OR valid_until <= now(). Order by `created_at DESC`. Return paginated
  - [x] 3.2: `CouponRepository.get_for_business_owner(coupon_id, user_id)` — single coupon with ownership check via listing join. Return `None` if not found or not owned
  - [x] 3.3: `CouponRepository.count_redemptions(coupon_id)` — count active (non-deleted) redemptions for a coupon. Reuse existing `CouponRedemptionRepository.count_active_claims_for_coupon()` if possible
  - [x] 3.4: `CouponRepository.create(coupon_data)` — insert + flush, return created coupon
  - [x] 3.5: `CouponRepository.update(coupon, update_data)` — apply partial update dict to coupon, flush

### Backend — Business Coupon Service

- [x] Task 4 (AC: #1-#9): Create `backend/modules/coupon/business_service.py`
  - [x] 4.1: `BusinessCouponService.__init__(repo, listing_repo, translation_api, session)`
  - [x] 4.2: `create_coupon(user_id, payload: BusinessCouponCreateRequest)`:
    - Validate listing ownership: `listing.business_owner_id == user_id` (raise `ListingForbiddenException` if not)
    - Validate listing is published (raise `ListingNotPublishedException` if draft/inactive)
    - Auto-translate title_vi, description_vi, terms_vi → Japanese using `translate()` with graceful fallback (copy original if translation fails)
    - Create `Coupon` with all fields
    - Emit `coupon.created` event
    - Return created coupon
  - [x] 4.3: `list_my_coupons(user_id, status_filter, page, per_page)`:
    - Delegate to `repo.list_for_business_owner()`
    - Attach `redemption_count` to each coupon via batch query (single query for all coupon IDs in page)
    - Return paginated `BusinessCouponListItem[]`
  - [x] 4.4: `get_coupon(user_id, coupon_id)`:
    - Fetch via `repo.get_for_business_owner()`
    - Raise `CouponNotFoundException` if not found
    - Attach `redemption_count`
    - Return `BusinessCouponDetail`
  - [x] 4.5: `update_coupon(user_id, coupon_id, payload: BusinessCouponUpdateRequest)`:
    - Fetch + ownership check
    - Enforce constraints (AC #7):
      - If `redemption_count > 0`: listing_id cannot change
      - If `redemption_count > 0` and `max_redemptions` is set: new value >= current redemption_count
      - If `valid_from <= now()` (already started): `valid_from` cannot change
    - Re-translate changed Vietnamese text fields to Japanese
    - Update coupon
    - Emit `coupon.updated` event
    - Return updated coupon
  - [x] 4.6: `deactivate_coupon(user_id, coupon_id)`:
    - Fetch + ownership check
    - Set `is_active = false`
    - Emit `coupon.deactivated` event
    - Return updated coupon
  - [x] 4.7: `delete_coupon(user_id, coupon_id)`:
    - Fetch + ownership check
    - Soft delete (set `deleted_at`)
    - Return 204
  - [x] 4.8: `preview_translation(payload: CouponTranslationPreviewRequest)`:
    - Parallel translate title_vi, description_vi, terms_vi → Japanese
    - Aggregate `has_error` flag (same pattern as listing preview-translation)
    - Return `CouponTranslationPreviewResponse`

### Backend — Business Coupon Router

- [x] Task 5 (AC: #1-#9): Create `backend/modules/coupon/business_router.py`
  - [x] 5.1: `POST /api/v1/business/coupons` — Auth: `require_role(UserRole.BUSINESS_OWNER)`. Body: `BusinessCouponCreateRequest`. Returns `SingleEnvelope[BusinessCouponDetail]` (201)
  - [x] 5.2: `GET /api/v1/business/coupons` — Auth: BUSINESS_OWNER. Query: `status: "active" | "expired_inactive" | "all" = "all"`, `page`, `per_page`. Returns `Paginated[BusinessCouponListItem]`
  - [x] 5.3: `GET /api/v1/business/coupons/{coupon_id}` — Auth: BUSINESS_OWNER. Returns `SingleEnvelope[BusinessCouponDetail]`
  - [x] 5.4: `PUT /api/v1/business/coupons/{coupon_id}` — Auth: BUSINESS_OWNER. Body: `BusinessCouponUpdateRequest`. Returns `SingleEnvelope[BusinessCouponDetail]`
  - [x] 5.5: `POST /api/v1/business/coupons/{coupon_id}/deactivate` — Auth: BUSINESS_OWNER. Returns `SingleEnvelope[BusinessCouponDetail]`
  - [x] 5.6: `DELETE /api/v1/business/coupons/{coupon_id}` — Auth: BUSINESS_OWNER. Returns 204
  - [x] 5.7: `POST /api/v1/business/coupons/preview-translation` — Auth: BUSINESS_OWNER. Body: `CouponTranslationPreviewRequest`. Returns `CouponTranslationPreviewResponse`
  - [x] 5.8: Register `business_coupon_router` in `backend/main.py` with prefix `/api/v1/business/coupons` and tag `business-coupons`

### Backend — Dependencies & Events

- [x] Task 6: Wire up dependency injection and events
  - [x] 6.1: Add `get_business_coupon_service()` to `backend/modules/coupon/dependencies.py` — inject `CouponRepository`, `ListingRepository`, `TranslationAPI`, `AsyncSession`
  - [x] 6.2: Add events to `backend/modules/coupon/events.py`: `COUPON_CREATED = "coupon.created"`, `COUPON_UPDATED = "coupon.updated"`, `COUPON_DEACTIVATED = "coupon.deactivated"`
  - [x] 6.3: Add business-specific exceptions to `backend/modules/coupon/exceptions.py`:
    - `CouponListingNotPublishedException` (400) — "Listing must be published to create coupons"
    - `CouponMaxRedemptionsTooLowException` (400) — "Cannot reduce max redemptions below current count"
    - `CouponAlreadyStartedException` (400) — "Cannot change start date of a coupon that has already started"
    - `CouponListingChangeException` (400) — "Cannot change listing for a coupon with existing redemptions"

### Backend — Tests

- [x] Task 7: Tests for business coupon management
  - [x] 7.1: `backend/tests/coupon/test_business_service.py` — test create coupon (happy path), test create with non-owned listing (403), test create with draft listing (400), test list coupons with filters, test get coupon with ownership check, test update coupon (happy path), test update constraints (max_redemptions, valid_from, listing_id), test deactivate coupon, test delete coupon (soft), test preview translation (happy path + translation failure fallback)
  - [x] 7.2: `backend/tests/coupon/test_business_router.py` — test all 7 endpoints for 200/201/204 happy paths, test 403 for non-owner, test 404 for invalid coupon_id, test 400 for invalid payloads (missing required fields, end < start, negative discount_value)
  - [x] 7.3: Mock `infrastructure.translation_api` in all tests — do NOT call real Google Translate
  - [x] 7.4: Mock `infrastructure.do_spaces` if media service is injected
  - [x] 7.5: Use `db_session` fixture with transaction rollback

### Frontend — Type Definitions

- [x] Task 8 (AC: #1-#6): Update `apps/web/modules/business/lib/types.ts`
  - [x] 8.1: Add `DiscountType = "percentage" | "fixed_vnd" | "free_item"`
  - [x] 8.2: Add `CouponStatus = "active" | "expired" | "draft"` (derived client-side from is_active + dates)
  - [x] 8.3: Add `BusinessCouponCreateRequest`: `listingId`, `titleVi`, `descriptionVi?`, `termsVi?`, `discountType`, `discountValue`, `validFrom`, `validUntil`, `maxRedemptions?`, `isActive`
  - [x] 8.4: Add `BusinessCouponUpdateRequest`: partial version of create (all optional except titleVi)
  - [x] 8.5: Add `BusinessCouponListItem`: `id`, `listingId`, `listingTitleVi`, `titleVi`, `titleJa`, `discountType`, `discountValue`, `validFrom`, `validUntil`, `isActive`, `redemptionCount`, `maxRedemptions?`, `createdAt`
  - [x] 8.6: Add `BusinessCouponDetail`: extends list item with `descriptionVi?`, `descriptionJa?`, `termsVi?`, `termsJa?`, `titleEn?`, `descriptionEn?`, `updatedAt`
  - [x] 8.7: Add `CouponTranslationPreviewRequest` / `CouponTranslationPreviewResponse`

### Frontend — API Client

- [x] Task 9 (AC: #1-#6): Create `apps/web/modules/business/lib/businessCouponApi.ts`
  - [x] 9.1: `createCoupon(data: BusinessCouponCreateRequest): Promise<BusinessCouponDetail>` — POST `/api/v1/business/coupons`
  - [x] 9.2: `getMyCoupons(params: { status?, page?, perPage? }): Promise<Paginated<BusinessCouponListItem>>` — GET `/api/v1/business/coupons`
  - [x] 9.3: `getCoupon(couponId: string): Promise<BusinessCouponDetail>` — GET `/api/v1/business/coupons/{couponId}`
  - [x] 9.4: `updateCoupon(couponId: string, data: BusinessCouponUpdateRequest): Promise<BusinessCouponDetail>` — PUT `/api/v1/business/coupons/{couponId}`
  - [x] 9.5: `deactivateCoupon(couponId: string): Promise<BusinessCouponDetail>` — POST `/api/v1/business/coupons/{couponId}/deactivate`
  - [x] 9.6: `deleteCoupon(couponId: string): Promise<void>` — DELETE `/api/v1/business/coupons/{couponId}`
  - [x] 9.7: `previewCouponTranslation(data: CouponTranslationPreviewRequest): Promise<CouponTranslationPreviewResponse>` — POST `/api/v1/business/coupons/preview-translation`
  - [x] 9.8: Use `apiClient` from `shared/lib/apiClient.ts` — automatic snake↔camelCase transform, CSRF, cookies

### Frontend — CouponForm Component

- [x] Task 10 (AC: #1, #2, #3, #6, #7, #9): Create `apps/web/modules/business/components/CouponForm.tsx`
  - [x] 10.1: Props: `mode: "create" | "edit"`, `initialData?: BusinessCouponDetail`, `onSuccess: () => void`
  - [x] 10.2: Use React Hook Form + Zod for form validation:
    - `listingId`: required UUID (dropdown of published listings from `getMyListings()`)
    - `titleVi`: required, 1-200 chars
    - `descriptionVi`: optional text
    - `termsVi`: optional text
    - `discountType`: required enum
    - `discountValue`: required, positive number. If percentage: max 100. If free_item: represents estimated item value in VND
    - `validFrom`: required date, >= today for new coupons
    - `validUntil`: required date, > validFrom
    - `maxRedemptions`: optional, positive integer
  - [x] 10.3: Discount type UX — when type changes:
    - Percentage: show "%" suffix on value input, hint "VD: 10 = giảm 10%"
    - Fixed VND: show "₫" suffix, hint "VD: 50000 = giảm 50,000₫"
    - Free item: show "₫" suffix, hint "Giá trị ước tính của món tặng (hiển thị cho khách hàng)"
  - [x] 10.4: Live Japanese preview panel (right side on desktop, below on mobile):
    - Debounce 500ms on title/description changes before calling `previewCouponTranslation()`
    - Show Skeleton during translation loading
    - Show translated title_ja, description_ja, terms_ja
    - Editable Japanese fields — business owner can manually refine
    - "Làm mới bản dịch" button to re-trigger translation
    - Disclaimer: "Bản dịch tự động. Bạn có thể chỉnh sửa trực tiếp."
    - Translation error: warning badge "Dịch thuật tạm thời không khả dụng" (same pattern as listing preview)
  - [x] 10.5: Preview card mimics the customer-facing coupon card: discount badge, title in Japanese, expiry countdown, business name
  - [x] 10.6: Two submit buttons: "Tạo Coupon" (is_active=true) and "Lưu nháp" (is_active=false). In edit mode: "Lưu thay đổi"
  - [x] 10.7: Edit mode constraints (AC #7):
    - Disable listing selector if `redemptionCount > 0`
    - Show warning if `validFrom` is in the past: "Coupon đã bắt đầu, không thể thay đổi ngày bắt đầu"
    - Validate `maxRedemptions >= redemptionCount` with error message
  - [x] 10.8: All inputs 48px height for touch-friendliness (matching listing editor pattern)
  - [x] 10.9: On submit success, show toast and redirect/callback

### Frontend — CouponList Component

- [x] Task 11 (AC: #4, #5, #8): Create `apps/web/modules/business/components/CouponList.tsx`
  - [x] 11.1: Two sections via tabs or visual separation: "Đang hoạt động" and "Đã hết hạn / Đã tắt"
  - [x] 11.2: Use TanStack Query: `queryKey: ['business', 'coupons', statusFilter]`, `queryFn: getMyCoupons`
  - [x] 11.3: Each coupon card (`BusinessCouponCard` sub-component) shows:
    - Title (Vietnamese)
    - Discount summary: "Giảm 10%" / "Giảm 50,000₫" / "Tặng món (trị giá 50,000₫)"
    - Validity: "01/05/2026 - 31/05/2026"
    - Redemptions: "5/100 lượt sử dụng" or "5 lượt sử dụng" (if unlimited)
    - Status badge: colored chip (green=Đang hoạt động, gray=Hết hạn, yellow=Nháp)
    - Action buttons: "Sửa" (edit link), "Tắt" (deactivate, with ConfirmDialog)
  - [x] 11.4: Empty state (AC #8): illustration + "Chưa có coupon nào" + "Tạo Coupon đầu tiên" CTA
  - [x] 11.5: Loading state: Skeleton cards (not spinners)
  - [x] 11.6: Page header with "Tạo Coupon mới" button linking to `/business/vi/coupons/new`
  - [x] 11.7: Deactivate flow: reuse `ConfirmDialog` from shared components (created in Story 8-2)

### Frontend — Route Pages

- [x] Task 12 (AC: #1-#9): Create route pages
  - [x] 12.1: `apps/web/app/(business)/vi/coupons/page.tsx` — renders `CouponList` component. Page title: "Phiếu giảm giá"
  - [x] 12.2: `apps/web/app/(business)/vi/coupons/new/page.tsx` — renders `CouponForm mode="create"`. Page title: "Tạo Coupon mới". Check for published listings first (AC #9)
  - [x] 12.3: `apps/web/app/(business)/vi/coupons/[couponId]/edit/page.tsx` — fetch coupon detail, render `CouponForm mode="edit" initialData={coupon}`. Page title: "Sửa Coupon"
  - [x] 12.4: All pages are client-side rendered (no SSR needed for business dashboard, matching existing pattern)
  - [x] 12.5: All pages use business layout with `BusinessSidebar` (inherited from `(business)/vi/layout.tsx`)

### Frontend — Tests

- [x] Task 13: Component tests
  - [x] 13.1: `apps/web/modules/business/components/__tests__/CouponForm.test.tsx`:
    - Test renders create mode with empty form
    - Test renders edit mode with pre-filled data
    - Test form validation (required fields, end > start, positive values)
    - Test discount type change updates hints
    - Test listing selector disabled when redemptionCount > 0
    - Test translation preview fires on debounced input
    - Test submit calls createCoupon API
  - [x] 13.2: `apps/web/modules/business/components/__tests__/CouponList.test.tsx`:
    - Test renders active and expired sections
    - Test empty state displays with CTA
    - Test deactivate button shows ConfirmDialog
    - Test loading state shows skeletons
  - [x] 13.3: Mock `apiClient` in all tests. Use `vitest` + React Testing Library
  - [x] 13.4: Mock `useAuth` to return BusinessOwner user

### Review Findings — Backend (Chunk 1)

**decision_needed:**
- [x] [Review][Decision→Fixed] Redeem path drops `is_active` guard — restored `is_active` check in redeem guard [service.py:271]

**patch:**
- [x] [Review][Patch→Fixed] `discount_value` not validated against `discount_type` — added percentage <=100 validator [schemas.py]
- [x] [Review][Patch→Fixed] Partial update date-range cross-validation — added effective date cross-check in service [business_service.py]
- [x] [Review][Patch→Fixed] `_get_redemption_counts` moved to `CouponRepository.count_redemptions_batch()` [repository.py]
- [x] [Review][Patch→Fixed] Deactivate idempotency — early return when already inactive [business_service.py]
- [x] [Review][Patch→Fixed] `title_vi` whitespace bypass — added `field_validator` strip before min_length [schemas.py]
- [x] [Review][Patch→Fixed] `delete_coupon` now uses `repo.update()` [business_service.py]

**defer (pre-existing):**
- [x] [Review][Defer] `Paginated`/`SingleEnvelope` imported from `listing.schemas` — should be in `shared/` [schemas.py:8] — deferred, pre-existing cross-module pattern
- [x] [Review][Defer] No rate limiting on `/preview-translation` endpoint [business_router.py:45] — deferred, infrastructure concern
- [x] [Review][Defer] Direct module imports from `listing`/`translation` in `business_service.py` [business_service.py:11-15] — deferred, pre-existing pattern
- [x] [Review][Defer] Error response format missing `"error"` wrapper key [error_handler.py:17-25] — deferred, pre-existing

### Review Findings — Frontend (Chunk 2)

**patch (all fixed):**
- [x] [Review][Patch→Fixed] submitIntent useState race — draft coupons published instead of drafted; switched to useRef [CouponForm.tsx:174,309,593,602]
- [x] [Review][Patch→Fixed] `window.location.href` in EmptyState → `router.push` for SPA navigation [CouponList.tsx:238]
- [x] [Review][Patch→Fixed] Deactivate double-click + dialog stays open on error — added isPending guard and setPendingDeactivate(null) in onError [CouponList.tsx:159-174,290-295]
- [x] [Review][Patch→Fixed] Hardcoded VND-to-JPY rate 0.006 → use shared resolveJpyRate() from env var [CouponForm.tsx:160]
- [x] [Review][Patch→Fixed] deriveCouponStatus ignores maxRedemptions — fully-redeemed coupons now shown as expired [CouponList.tsx:22-30]

**defer:**
- [x] [Review][Defer] No pagination in coupon list (max 20 per category visible) [CouponList.tsx:149-157]
- [x] [Review][Defer] free_item suffix shows ₫ instead of estimate label [CouponForm.tsx:149-151]
- [x] [Review][Defer] No unsaved changes navigation guard (beforeunload) [CouponForm.tsx]
- [x] [Review][Defer] No publish-from-edit workflow for draft coupons [CouponForm.tsx:320-323]
- [x] [Review][Defer] Translation preview missing AbortController (race condition) [CouponForm.tsx:225-237]
- [x] [Review][Defer] Listing dropdown capped at 50 items [CouponForm.tsx:188]
- [x] [Review][Defer] termsVi/descriptionVi missing max length in Zod schema [CouponForm.tsx:40]
- [x] [Review][Defer] Missing error boundary + aria-invalid accessibility [CouponForm.tsx]

### Review Findings — Tests (Chunk 3)

**patch (all fixed):**
- [x] [Review][Patch→Fixed] `test_list_my_coupons` called deleted `_get_redemption_counts` → updated to use `repo.count_redemptions_batch` [test_business_service.py:204]
- [x] [Review][Patch→Fixed] `test_delete_coupon_soft_deletes` asserted on direct attribute mutation → updated for `repo.update` pattern [test_business_service.py:359-370]
- [x] [Review][Patch→Added] Test for deactivate idempotency — already inactive returns without commit/event [test_business_service.py]
- [x] [Review][Patch→Added] Test for `CouponInvalidDateRangeException` on update with crossed dates [test_business_service.py]
- [x] [Review][Patch→Added] Test for delete with wrong owner raises `CouponNotFoundException` [test_business_service.py]

**note:**
- [x] 2/3 review agents hit rate limit (Blind Hunter, Acceptance Auditor). Edge Case Hunter completed with comprehensive results — sufficient for triage.
- [x] Edge Case Hunter reported backend tests as "MISSING" — false positive, agent searched wrong path (`backend/modules/coupon/tests/` vs `backend/tests/coupon/`). All 4 test files exist with 1323 lines.

## Dev Notes

### Critical Architecture Decisions

1. **Coupons belong to listings** — every coupon requires a `listing_id`. The coupon model has a FK with CASCADE delete. Business owners must select which listing the coupon is for from a dropdown of their published listings. This is NOT optional — the model enforces it.

2. **Auto-translation pattern** — reuse the exact pattern from `BusinessListingService.preview_translation()`. Parallel `asyncio.gather` with `translate_or_fallback()` wrapper. Translation failure = copy original Vietnamese text + set `has_error=true`. Translation service is Google Cloud Translation API with `deep_translator` fallback.

3. **"free_item" discount type is NEW** — the current model CHECK constraint only allows `('percentage', 'fixed_vnd')`. A migration is required to add `'free_item'`. For `free_item` coupons, `discount_value` represents the estimated value of the free item in VND (displayed as savings to the customer).

4. **Draft status via `is_active=false`** — no new `status` column needed. The display status is derived client-side:
   - Active: `is_active=true AND validUntil > now()`
   - Draft: `is_active=false AND validUntil > now()`
   - Expired: `validUntil <= now()` (regardless of is_active)

5. **Ownership validation via listing join** — to check business owner owns a coupon, JOIN through `coupons.listing_id → listings.id` and check `listings.business_owner_id == user_id`. This is consistent and cannot be bypassed since `listing_id` is immutable on coupons with redemptions.

6. **Edit constraints protect data integrity** — once a coupon has redemptions: cannot change listing, cannot reduce max_redemptions below current count, cannot change start date if already past. These are service-layer validations.

### Existing Code to REUSE (DO NOT recreate)

| What | Location | How to Use |
|------|----------|-----------|
| Coupon model | `backend/modules/coupon/models.py` | Already has all fields — no model changes needed (only migration for CHECK constraint) |
| CouponRedemption model | `backend/modules/coupon/models.py` | Query for redemption counts |
| CouponRepository | `backend/modules/coupon/repository.py` | Extend with business-owner methods |
| CouponRedemptionRepository | `backend/modules/coupon/repository.py` | Reuse `count_active_claims_for_coupon()` |
| translate() | `backend/infrastructure/translation_api.py` | `translate(text, "vi", "ja")` |
| TranslationServiceUnavailableException | `backend/infrastructure/translation_api.py` | Catch for graceful fallback |
| preview_translation() pattern | `backend/modules/listing/business_service.py:355-395` | Copy the `translate_or_fallback` + `asyncio.gather` pattern |
| require_role(UserRole.BUSINESS_OWNER) | `backend/modules/auth/dependencies.py` | Auth on all business endpoints |
| ListingRepository | `backend/modules/listing/repository.py` | Query listing ownership for validation |
| ListingForbiddenException | `backend/modules/listing/exceptions.py` | Raise when user doesn't own listing |
| SingleEnvelope / Paginated | `backend/modules/listing/schemas.py` | Response wrappers |
| AppException | `backend/shared/exceptions.py` | Base for new exceptions |
| ConfirmDialog | `apps/web/shared/components/ConfirmDialog.tsx` | Reuse for deactivate confirmation |
| Skeleton | `apps/web/shared/components/Skeleton.tsx` | Loading states |
| Toast | `apps/web/shared/components/Toast.tsx` | Success/error notifications |
| EmptyState | `apps/web/shared/components/EmptyState.tsx` | No coupons state |
| apiClient | `apps/web/shared/lib/apiClient.ts` | snake↔camelCase transform, CSRF, cookies |
| getMyListings() | `apps/web/modules/business/lib/businessListingApi.ts` | Populate listing dropdown |
| BusinessSidebar | `apps/web/modules/business/components/BusinessSidebar.tsx` | Already has `/vi/coupons` nav item |
| BusinessListingListItem | `apps/web/modules/business/lib/types.ts` | Type for listing dropdown options |
| React Hook Form + Zod | project dependencies | Form validation (same as listing editor) |
| TanStack Query | project dependencies | Data fetching + caching |

### Anti-Patterns to AVOID

- **DO NOT** create a new coupon model or table — the existing `coupons` table already has all required fields
- **DO NOT** add `next-intl` to business routes — Vietnamese-only, hardcoded strings
- **DO NOT** use spinners — use Skeleton components for loading states
- **DO NOT** use `window.confirm()` — use the existing `ConfirmDialog` component
- **DO NOT** use `os.getenv()` — use `shared.config.settings`
- **DO NOT** use `any` type in TypeScript — proper types from `types.ts`
- **DO NOT** import coupon module directly from listing module — use Dependency Injection
- **DO NOT** create a separate business coupon model — extend the existing CouponRepository with business-owner queries
- **DO NOT** hard-delete coupons — always soft delete via `deleted_at`
- **DO NOT** allow listing_id change on coupons with existing redemptions
- **DO NOT** block the event loop with sync translation calls — use `async/await` + `asyncio.gather`
- **DO NOT** create standalone coupon (without listing) — model requires `listing_id` FK
- **DO NOT** duplicate the `translate_or_fallback` pattern — extract or copy from listing service

### Source Tree Components to Touch

**Backend (modify):**
- `backend/modules/coupon/schemas.py` — add business coupon request/response schemas
- `backend/modules/coupon/repository.py` — add business-owner query methods
- `backend/modules/coupon/dependencies.py` — add `get_business_coupon_service()`
- `backend/modules/coupon/events.py` — add COUPON_CREATED, COUPON_UPDATED, COUPON_DEACTIVATED
- `backend/modules/coupon/exceptions.py` — add business-specific exceptions
- `backend/main.py` — register `business_coupon_router`

**Backend (create):**
- `backend/modules/coupon/business_service.py` — BusinessCouponService
- `backend/modules/coupon/business_router.py` — business coupon API endpoints
- `backend/migrations/versions/2026_05_01_0001_add_free_item_discount_type.py`
- `backend/tests/coupon/test_business_service.py`
- `backend/tests/coupon/test_business_router.py`

**Frontend (modify):**
- `apps/web/modules/business/lib/types.ts` — add coupon-related types

**Frontend (create):**
- `apps/web/modules/business/lib/businessCouponApi.ts` — API client functions
- `apps/web/modules/business/components/CouponForm.tsx` — create/edit form with preview
- `apps/web/modules/business/components/CouponList.tsx` — coupon list with sections
- `apps/web/app/(business)/vi/coupons/page.tsx` — list page
- `apps/web/app/(business)/vi/coupons/new/page.tsx` — create page
- `apps/web/app/(business)/vi/coupons/[couponId]/edit/page.tsx` — edit page
- `apps/web/modules/business/components/__tests__/CouponForm.test.tsx`
- `apps/web/modules/business/components/__tests__/CouponList.test.tsx`

### Previous Story Intelligence (Story 8-2)

**Patterns established in 8-1 and 8-2 to follow:**
- Business router registered at `/api/v1/business/` prefix — new coupon router at `/api/v1/business/coupons`
- Ownership validation: `listing.business_owner_id != current_user.id → raise ListingForbiddenException`
- Translation preview: parallel `asyncio.gather` with `translate_or_fallback` wrapper
- Frontend uses `apiClient` for all calls with automatic snake↔camelCase
- Tests mock `infrastructure.translation_api` and `infrastructure.do_spaces`
- ConfirmDialog component already exists in `apps/web/shared/components/ConfirmDialog.tsx`
- Business sidebar already includes coupon nav link to `/vi/coupons`

**Deferred issues from 8-2 still open (DO NOT fix in this story):**
- W1: Synchronous S3 + Pillow blocking async event loop (pre-existing pattern)
- W2: Generic `/api/v1/media` IDOR on `owner_id` (pre-existing)
- W3: Generic media upload `owner_type` bypass (pre-existing)

### Git Intelligence

Latest commits (8-1 through 8-2) established:
- `backend/modules/listing/business_service.py` — service pattern with `preview_translation()` method
- `backend/modules/listing/business_router.py` — all endpoints use `require_role(UserRole.BUSINESS_OWNER)` + ownership check
- `apps/web/modules/business/components/PreviewPublishStep.tsx` — Japanese preview pattern (two-column layout, editable JA fields, refresh button, error badge)
- `apps/web/modules/business/lib/businessListingApi.ts` — API client pattern with `apiClient`
- `apps/web/shared/components/ConfirmDialog.tsx` — reusable confirm dialog

### Testing Standards

- **Backend**: pytest + pytest-asyncio, mock `infrastructure.translation_api`, transaction rollback per test via `db_session` fixture. Target 80% service layer coverage
- **Frontend**: Vitest + React Testing Library, mock `apiClient`, mock `useAuth` (return BusinessOwner user), co-located `__tests__/` directories
- **Test naming**: `test_{action}_{scenario}_{expected_result}` (backend), `it("should {action} when {condition}")` (frontend)

### Project Structure Notes

- Business portal routes: `(business)/vi/` route group — Vietnamese-only, desktop-first
- Coupon module is shared between user-facing reads (Epic 7) and business-facing writes (this story). New code goes into the same `backend/modules/coupon/` module but in separate `business_service.py` and `business_router.py` files
- The `Coupon` model already supports multilingual fields — no schema changes needed beyond the CHECK constraint migration

### Scope Boundaries

**IN SCOPE:**
- Business coupon CRUD (create, list, get, update, delete)
- Coupon deactivation with confirmation
- Auto-translation Vietnamese → Japanese for coupon text
- Live Japanese customer preview card
- Manual Japanese translation editing
- Translation preview API endpoint
- Draft/publish flow (is_active toggle)
- Edit constraints (listing lock, max_redemptions guard, start date lock)
- "free_item" discount type migration
- Listing selector dropdown on create form
- Empty states (no coupons, no listings)
- Coupon list with active/expired sections
- Redemption count display per coupon

**OUT OF SCOPE (deferred):**
- Coupon analytics/performance metrics → Story 8.4 (Business Analytics Dashboard)
- Coupon duplicate/clone feature → enhancement
- Bulk coupon operations (bulk deactivate/delete) → enhancement
- Coupon scheduling (auto-activate at future date) → enhancement
- Push notifications to users when new coupon created → Story 7.3 already handles near-expiry notifications
- QR code generation for coupons → already handled by user-facing claim flow (Story 7.2)
- Customer-facing coupon display → already built in Story 7.1
- Coupon redemption verification by business owner → future enhancement
- Image/photo attachment to coupons → future enhancement
- Coupon categories/tags → future enhancement
- A/B testing for coupon effectiveness → post-MVP

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-8-business-owner-portal.md#Story-8.3]
- [Source: _bmad-output/planning-artifacts/epics/epic-7-deals-coupons-notifications.md#Story-7.1-7.2] (existing coupon infrastructure)
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Coupon-Module]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Module-Structure]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure-boundaries.md#Business-Routes]
- [Source: _bmad-output/planning-artifacts/prd/domain-specific-requirements.md#Payment-Commerce]
- [Source: _bmad-output/planning-artifacts/prd/user-journeys.md#Journey-3-Chi-Huong]
- [Source: _bmad-output/planning-artifacts/epics/requirements-inventory.md#FR35-FR64]
- [Source: backend/modules/coupon/models.py — Coupon, CouponRedemption models]
- [Source: backend/modules/coupon/service.py — CouponService, CouponClaimService patterns]
- [Source: backend/modules/coupon/repository.py — CouponRepository, CouponRedemptionRepository]
- [Source: backend/modules/coupon/router.py — existing user-facing coupon endpoints]
- [Source: backend/modules/coupon/schemas.py — existing response schemas]
- [Source: backend/modules/listing/business_service.py — preview_translation() pattern at line 355-395]
- [Source: backend/modules/listing/business_router.py — business endpoint auth pattern]
- [Source: apps/web/modules/business/components/PreviewPublishStep.tsx — Japanese preview UI pattern]
- [Source: apps/web/modules/business/components/BusinessSidebar.tsx — nav already includes /vi/coupons]
- [Source: apps/web/shared/components/ConfirmDialog.tsx — reusable confirm dialog]
- [Source: _bmad-output/implementation-artifacts/8-2-photo-upload-media-management-business.md — previous story intelligence]

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- `python -m pytest backend/tests/coupon/test_business_service.py backend/tests/coupon/test_business_router.py backend/tests/coupon/test_claim_redeem.py backend/tests/coupon/test_coupon_repository.py`
- `python -m ruff check backend`
- `pnpm --filter web exec vitest run modules/business/components/__tests__/CouponForm.test.tsx modules/business/components/__tests__/CouponList.test.tsx modules/deals/__tests__/format-savings.test.ts`
- `pnpm --filter web test`
- `pnpm --filter web lint`

### Completion Notes List

- Implemented business-owner coupon CRUD, translation preview, owner-scoped repository methods, DI wiring, lifecycle events, and the `free_item` discount migration across the shared coupon module.
- Added the Vietnamese business dashboard coupon form/list routes with live Japanese preview, draft/publish flow, deactivate confirmation, published-listing gating, and edit constraints for redemptions/start date.
- Extended shared coupon behavior so deactivated coupons stay redeemable for already-claimed users, and widened customer-facing coupon helpers/types so `free_item` coupons render safely in existing deals surfaces.
- Added backend/router/frontend regression tests for the new business coupon flows and patched validation error serialization so Decimal-based request validation returns 422 instead of 500.
- Full `backend/tests` and full `pnpm --filter web test` passed. Full `pnpm --filter web lint` still reports pre-existing unrelated errors in `apps/web/modules/translation/components/VoiceTranslationView.tsx` and `apps/web/modules/translation/hooks/useSpeechRecognition.ts`.

### File List

- `_bmad-output/implementation-artifacts/8-3-coupon-management-business.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `apps/web/app/(business)/vi/coupons/page.tsx`
- `apps/web/app/(business)/vi/coupons/new/page.tsx`
- `apps/web/app/(business)/vi/coupons/[couponId]/edit/page.tsx`
- `apps/web/modules/business/components/CouponForm.tsx`
- `apps/web/modules/business/components/CouponList.tsx`
- `apps/web/modules/business/components/__tests__/CouponForm.test.tsx`
- `apps/web/modules/business/components/__tests__/CouponList.test.tsx`
- `apps/web/modules/business/lib/businessCouponApi.ts`
- `apps/web/modules/business/lib/businessListingApi.ts`
- `apps/web/modules/business/lib/types.ts`
- `apps/web/modules/deals/__tests__/format-savings.test.ts`
- `apps/web/modules/deals/components/CouponCard.tsx`
- `apps/web/modules/deals/lib/mappers.ts`
- `apps/web/modules/deals/lib/redemption-mappers.ts`
- `apps/web/modules/deals/lib/types.ts`
- `apps/web/shared/lib/format-savings.ts`
- `backend/main.py`
- `backend/migrations/versions/2026_05_01_0001_add_free_item_discount_type.py`
- `backend/modules/coupon/business_router.py`
- `backend/modules/coupon/business_service.py`
- `backend/modules/coupon/dependencies.py`
- `backend/modules/coupon/events.py`
- `backend/modules/coupon/exceptions.py`
- `backend/modules/coupon/models.py`
- `backend/modules/coupon/repository.py`
- `backend/modules/coupon/schemas.py`
- `backend/modules/coupon/service.py`
- `backend/shared/middleware/error_handler.py`
- `backend/tests/coupon/test_business_router.py`
- `backend/tests/coupon/test_business_service.py`
- `backend/tests/coupon/test_claim_redeem.py`
- `backend/tests/coupon/test_coupon_repository.py`

### Change Log

- 2026-05-01: Implemented Story 8.3 end-to-end across backend business coupon APIs/services/migration, frontend business coupon management UI, shared coupon redemption compatibility, and supporting regression tests.
