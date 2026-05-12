# Story 8.2: Photo Upload & Media Management (Business)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Vietnamese business owner,
I want to upload photos of my business with camera capture, see them in a draggable grid with thumbnails, and have EXIF validation confirm authenticity,
So that Japanese customers see authentic, verified photos of my establishment.

## Acceptance Criteria

1. **Given** I am on Step 2 of the listing editor (FR32)
   **When** I tap the upload area (dashed border + "＋" icon)
   **Then** the device file picker opens (allowing camera capture via `capture="environment"` on mobile)
   **And** selected photos are uploaded to the server via `POST /api/v1/media`
   **And** each photo shows an individual upload progress skeleton in the grid while uploading
   **And** multiple files can be selected at once and upload in parallel (max 3 concurrent)

2. **Given** a photo is uploaded
   **When** the backend processes it
   **Then** EXIF metadata is validated to confirm camera origin (Make, Model, DateTime tags required)
   **And** if EXIF validation fails, a soft warning is returned (photo is still accepted with `exif_verified: false` flag — not blocking, per business-friendliness decision)
   **And** the photo is compressed and optimized for web (WebP, max 1200px) — reuses existing `_process_image()`
   **And** a thumbnail is generated (WebP, max 300px, quality=75) and uploaded to DO Spaces alongside the full image
   **And** the `MediaUploadResponse` includes both `url` (full) and `thumbnail_url` (thumb) fields
   **And** the optimized photo is uploaded to DigitalOcean Spaces with CDN URL

3. **Given** I have uploaded multiple photos
   **When** I view the photo grid
   **Then** the first photo is marked "Ảnh bìa" (Cover) with a badge
   **And** I can drag photos to reorder them (HTML5 Drag and Drop API, no external library)
   **And** tapping × on a photo shows a custom confirmation dialog (not `window.confirm`) before soft-deleting
   **And** the cover photo automatically changes to the new first photo if the original cover is removed
   **And** display order is persisted via `display_order` integer field on `MediaFile`

4. **Given** upload limits
   **When** I have uploaded 10 photos
   **Then** the upload button is disabled with message "Đã đạt tối đa 10 ảnh"
   **And** minimum 3 photos are required before the wizard can advance to Step 3 (existing validation from Story 8-1)

5. **Given** a photo is being removed
   **When** I tap the × button on a photo
   **Then** a custom dialog appears: "Xóa ảnh này?" with "Xóa" (destructive) and "Hủy" (cancel) buttons
   **And** confirming soft-deletes the photo (sets `deleted_at`)
   **And** the photo grid re-renders without the removed photo
   **And** remaining photos' `display_order` values are compacted

6. **Given** I reorder photos via drag-and-drop
   **When** I drop a photo in a new position
   **Then** the grid updates immediately (optimistic UI)
   **And** the new order is persisted via `PUT /api/v1/business/listings/{listing_id}/photos/reorder`
   **And** the endpoint updates `display_order` on each `MediaFile` atomically

7. **Given** the listing is being edited (not creating a new one)
   **When** the edit form loads with existing photos
   **Then** existing photos load from the API using `thumbnail_url` in the grid for performance
   **And** the full-size `url` is used only in the Step 3 preview
   **And** I can add new photos (up to max 10 total) and remove existing ones

## Tasks / Subtasks

### Backend — Database Migration

- [x] Task 1 (AC: #3, #6): Alembic migration `2026_04_29_0001_add_media_display_order_and_thumbnail.py`
  - [x] 1.1: Add `display_order INTEGER NOT NULL DEFAULT 0` to `media_files` table
  - [x] 1.2: Add `thumbnail_url VARCHAR(500)` to `media_files` table (nullable — existing photos have no thumbnail)
  - [x] 1.3: Add `exif_verified BOOLEAN NOT NULL DEFAULT false` to `media_files` table
  - [x] 1.4: Add index `ix_media_files_owner_order` ON `(owner_type, owner_id, display_order) WHERE deleted_at IS NULL`
  - [x] 1.5: `downgrade()` drops the added columns and index cleanly

### Backend — Update Media Models & Schemas

- [x] Task 2 (AC: #2, #3): Extend existing models in `backend/modules/media/`
  - [x] 2.1: Add `display_order`, `thumbnail_url`, `exif_verified` columns to `MediaFile` model in `models.py`
  - [x] 2.2: Update `MediaUploadResponse` schema in `schemas.py` to include `thumbnail_url: str | None` and `exif_verified: bool`
  - [x] 2.3: Update `MediaFileResponse` schema to include `display_order`, `thumbnail_url`, `exif_verified`
  - [x] 2.4: Add `THUMBNAIL_MAX_DIMENSION_PX = 300` and `THUMBNAIL_WEBP_QUALITY = 75` to `constants.py`

### Backend — Enhance Media Service for Thumbnails & EXIF

- [x] Task 3 (AC: #2): Extend `backend/modules/media/service.py`
  - [x] 3.1: Add `_generate_thumbnail(image_bytes: bytes) -> tuple[bytes, int, int]` — resize to 300px max, WebP quality=75, returns `(thumb_bytes, thumb_width, thumb_height)`
  - [x] 3.2: Update `upload_photo()` to:
    - Call `_generate_thumbnail()` after `_process_image()`
    - Upload thumbnail to DO Spaces at key `media/{owner_type}/{owner_id}/{uuid}_thumb.webp`
    - Call `validate_camera_exif()` on original bytes BEFORE stripping EXIF, store result in `exif_verified`
    - Return `MediaFile` with `thumbnail_url` and `exif_verified` populated
  - [x] 3.3: EXIF validation is a soft check — never raise exception for listing photos. Only set `exif_verified=false`. The existing `upload_review_photo()` still raises `MediaExifValidationException` for reviews (unchanged behavior)

### Backend — Photo Reorder Endpoint & Fix IDOR

- [x] Task 4 (AC: #3, #5, #6): Add photo management to `backend/modules/listing/business_router.py`
  - [x] 4.1: `PUT /api/v1/business/listings/{listing_id}/photos/reorder` — Auth: `require_role(UserRole.BUSINESS_OWNER)` + ownership check. Accepts `PhotoReorderRequest { photo_ids: list[UUID] }` (ordered list). Updates `display_order` for each photo. Returns `SingleEnvelope[list[MediaFileResponse]]`
  - [x] 4.2: `DELETE /api/v1/business/listings/{listing_id}/photos/{photo_id}` — Auth: ownership check. Soft-deletes single photo. Compacts `display_order` for remaining photos. Returns 204
  - [x] 4.3: Add schemas `PhotoReorderRequest` and `PhotoDeleteResponse` in `backend/modules/listing/schemas.py`

- [x] Task 5 (AC: #3): Fix IDOR vulnerability in `backend/modules/listing/business_service.py`
  - [x] 5.1: In `_replace_listing_photos()`, add ownership check: verify each photo_id has `owner_id == listing_id OR owner_id IS NULL` (unassigned). Raise `ListingForbiddenException` if any photo belongs to a different listing
  - [x] 5.2: Replace `created_at` hack for ordering — use `display_order` field instead. Set `display_order = index` based on position in `photo_ids` list
  - [x] 5.3: Add `reorder_listing_photos(user_id, listing_id, photo_ids)` method — validates ownership of listing, validates all photo_ids belong to this listing, updates `display_order` atomically
  - [x] 5.4: Add `delete_listing_photo(user_id, listing_id, photo_id)` method — validates ownership, soft-deletes photo, compacts remaining photos' `display_order`

### Backend — Update Media Repository

- [x] Task 6 (AC: #3, #6): Update `backend/modules/media/repository.py`
  - [x] 6.1: Update `list_for_owner()` to order by `display_order ASC` instead of `created_at ASC`
  - [x] 6.2: Add `update_display_orders(photo_id_order: list[tuple[UUID, int]])` — bulk update display_order for multiple photos in one query
  - [x] 6.3: Add `get_next_display_order(owner_type, owner_id) -> int` — returns `MAX(display_order) + 1` for new uploads

### Backend — Tests

- [x] Task 7: Tests for photo management
  - [x] 7.1: `backend/tests/media/test_service.py` — test thumbnail generation output (WebP format, ≤300px), test EXIF validation returns boolean (not raises for listings), test upload_photo returns thumbnail_url and exif_verified
  - [x] 7.2: `backend/tests/listing/test_business_photo_router.py` — test reorder photos (200), test reorder with invalid photo_id (404), test reorder other owner's listing (403), test delete photo (204), test delete other owner's photo (403)
  - [x] 7.3: `backend/tests/listing/test_business_service.py` — extend existing tests for IDOR fix in `_replace_listing_photos` (test with photo from different listing → 403), test display_order assignment
  - [x] 7.4: Mock `infrastructure.do_spaces` in all tests — do NOT upload to real DO Spaces

### Frontend — Enhance PhotoMenuStep with Drag-and-Drop

- [x] Task 8 (AC: #1, #3, #4, #5): Refactor `apps/web/modules/business/components/PhotoMenuStep.tsx`
  - [x] 8.1: Replace sequential upload with parallel upload — use `Promise.allSettled()` with max 3 concurrent via a simple semaphore. Show individual Skeleton per uploading photo
  - [x] 8.2: Implement HTML5 Drag and Drop for photo reorder:
    - `draggable` attribute on photo cards
    - `onDragStart`, `onDragOver`, `onDrop` handlers
    - Visual drag feedback: dragged photo gets opacity 0.5, drop target gets border highlight
    - On drop → call `reorderListingPhotos(listingId, newPhotoIds)` API
    - For new listings (no `listing_id` yet), reorder is local-only (persisted on wizard submit)
  - [x] 8.3: Replace `window.confirm()` with custom `<ConfirmDialog />` component:
    - Import from `@/shared/components/Modal` pattern
    - Title: "Xóa ảnh này?"
    - Destructive button: "Xóa" (red)
    - Cancel button: "Hủy"
  - [x] 8.4: Update photo grid to use `thumbnail_url` when available, fallback to `url`
  - [x] 8.5: Show EXIF verification badge on each photo: ✅ (verified) or ⚠️ (unverified) — small icon overlay on bottom-right of photo card

### Frontend — API Client Updates

- [x] Task 9 (AC: #6): Update `apps/web/modules/business/lib/businessListingApi.ts`
  - [x] 9.1: `reorderListingPhotos(listingId: string, photoIds: string[]): Promise<ListingPhoto[]>` — PUT `/api/v1/business/listings/{listingId}/photos/reorder`
  - [x] 9.2: `deleteListingPhoto(listingId: string, photoId: string): Promise<void>` — DELETE `/api/v1/business/listings/{listingId}/photos/{photoId}`
  - [x] 9.3: Update `uploadListingPhoto` return type to include `thumbnailUrl` and `exifVerified` fields

### Frontend — Type Updates

- [x] Task 10: Update `apps/web/modules/business/lib/types.ts`
  - [x] 10.1: Update `ListingPhoto` to add `thumbnailUrl?: string | null`, `exifVerified?: boolean`, `displayOrder?: number`

### Frontend — Shared ConfirmDialog Component

- [x] Task 11 (AC: #5): Create `apps/web/shared/components/ConfirmDialog.tsx`
  - [x] 11.1: Props: `open: boolean`, `title: string`, `message?: string`, `confirmLabel: string`, `cancelLabel: string`, `onConfirm: () => void`, `onCancel: () => void`, `variant?: 'default' | 'destructive'`
  - [x] 11.2: Reuse existing `Modal` component as base. Destructive variant shows confirm button in red
  - [x] 11.3: Focus trap and escape key to close

### Frontend — Tests

- [x] Task 12: Component tests
  - [x] 12.1: `apps/web/modules/business/components/__tests__/PhotoMenuStep.test.tsx` — extend existing tests: test drag reorder updates photo order, test parallel upload shows multiple skeletons, test custom confirm dialog appears on delete, test EXIF badge displays correctly
  - [x] 12.2: `apps/web/shared/components/__tests__/ConfirmDialog.test.tsx` — test render with destructive variant, test confirm callback fires, test cancel callback fires, test escape closes
  - [x] 12.3: Mock `apiClient` in all tests. Use `vitest` + React Testing Library

## Dev Notes

### Critical Architecture Decisions

1. **EXIF validation is a SOFT CHECK for business photos** — Unlike review photos (which reject uploads without camera EXIF), business listing photos accept all images but flag them with `exif_verified=false`. Rationale: business owners may have professional photos taken by third parties, and we don't want to block them from creating listings. The UI shows a badge so admins can later identify non-camera photos.

2. **Thumbnail generation runs synchronously during upload** — Not via Celery. Thumbnails are small (300px, ~10-20KB), generated instantly alongside the full image. Both are uploaded to DO Spaces in the same request. Storing separately allows CDN to cache them independently.

3. **display_order replaces created_at hack** — Story 8-1 used `created_at` timestamp manipulation for photo ordering (P7 review finding). This story properly adds a `display_order INT` column. All ordering queries switch from `ORDER BY created_at` to `ORDER BY display_order`. Existing photos get `display_order = 0` (default) — acceptable since single-value ordering is stable.

4. **HTML5 Drag and Drop, NO external library** — Use native browser Drag and Drop API. The photo grid is simple enough that react-dnd or dnd-kit are overkill. Keep it lightweight.

5. **Parallel upload with concurrency limit** — Upload up to 3 photos simultaneously using a semaphore pattern. `Promise.allSettled()` ensures one failure doesn't cancel others. Individual Skeleton placeholders show progress per photo.

### Existing Code to REUSE (DO NOT recreate)

| What | Location | How to Use |
|------|----------|-----------|
| MediaFile model | `backend/modules/media/models.py` | Extend with new columns |
| upload_photo() | `backend/modules/media/service.py` | Modify to add thumbnail + EXIF check |
| _process_image() | `backend/modules/media/service.py` | Reuse for full-size processing |
| validate_camera_exif() | `backend/modules/media/service.py` | Call before EXIF strip, store result |
| DO Spaces client | `backend/infrastructure/do_spaces.py` | Upload thumbnail alongside full image |
| build_public_url() | `backend/infrastructure/do_spaces.py` | Generate CDN URL for thumbnail |
| _replace_listing_photos() | `backend/modules/listing/business_service.py` | Fix IDOR + switch to display_order |
| list_for_owner() | `backend/modules/media/repository.py` | Change ordering to display_order |
| PhotoMenuStep | `apps/web/modules/business/components/PhotoMenuStep.tsx` | Refactor — add drag, parallel upload |
| businessListingApi | `apps/web/modules/business/lib/businessListingApi.ts` | Add reorder/delete functions |
| Modal | `apps/web/shared/components/Modal.tsx` | Base for ConfirmDialog |
| Skeleton | `apps/web/shared/components/Skeleton.tsx` | Per-photo upload placeholder |
| apiClient | `apps/web/shared/lib/apiClient.ts` | snake↔camelCase transform, CSRF, cookies |
| Auth dependency | `backend/modules/auth/dependencies.py` | `require_role(UserRole.BUSINESS_OWNER)` |
| BusinessListingResponse | `backend/modules/listing/schemas.py` | Already includes photos field |

### Anti-Patterns to AVOID

- **DO NOT** reject business photo uploads due to missing EXIF — soft check only, set `exif_verified=false`
- **DO NOT** use `created_at` for photo ordering — use `display_order` column
- **DO NOT** reassign photos from other listings/users — validate ownership (IDOR fix)
- **DO NOT** install react-dnd or dnd-kit — use native HTML5 Drag and Drop API
- **DO NOT** use `window.confirm()` — use custom `ConfirmDialog` component
- **DO NOT** use spinners — use Skeleton components for upload states
- **DO NOT** upload thumbnails via separate API call — generate and upload in same `upload_photo()` flow
- **DO NOT** add `next-intl` to business routes — Vietnamese-only, hardcoded strings
- **DO NOT** use `any` type in TypeScript — proper types from `types.ts`
- **DO NOT** use `os.getenv()` — use `shared.config.settings`

### Source Tree Components to Touch

**Backend (modify):**
- `backend/modules/media/models.py` — add display_order, thumbnail_url, exif_verified columns
- `backend/modules/media/service.py` — add thumbnail generation, EXIF soft check in upload_photo
- `backend/modules/media/schemas.py` — update response schemas with new fields
- `backend/modules/media/constants.py` — add thumbnail constants
- `backend/modules/media/repository.py` — update ordering, add bulk display_order update
- `backend/modules/listing/business_router.py` — add reorder + delete photo endpoints
- `backend/modules/listing/business_service.py` — fix IDOR, add reorder/delete methods, switch to display_order
- `backend/modules/listing/schemas.py` — add PhotoReorderRequest

**Backend (create):**
- `backend/migrations/versions/2026_04_29_0001_add_media_display_order_and_thumbnail.py`
- `backend/tests/media/test_service.py` (extend or create if not present)
- `backend/tests/listing/test_business_photo_router.py`

**Frontend (modify):**
- `apps/web/modules/business/components/PhotoMenuStep.tsx` — drag-drop, parallel upload, custom confirm, thumbnails
- `apps/web/modules/business/lib/businessListingApi.ts` — add reorder/delete functions, update upload return type
- `apps/web/modules/business/lib/types.ts` — add thumbnailUrl, exifVerified, displayOrder fields

**Frontend (create):**
- `apps/web/shared/components/ConfirmDialog.tsx`
- `apps/web/shared/components/__tests__/ConfirmDialog.test.tsx`

### Previous Story Intelligence (Story 8-1)

**Review findings that MUST be addressed in this story:**
- **P3 CRITICAL: IDOR in `_replace_listing_photos`** — `business_service.py:359-363` selects MediaFiles by `id + owner_type=LISTING` but does NOT verify ownership. Fix: add `owner_id == listing_id OR owner_id IS NULL` check
- **P7 MEDIUM: `created_at` overwrite for ordering** — `business_service.py:385-390` overwrites `created_at` with computed timestamps for display ordering. Fix: use new `display_order` column instead

**Deferred items from 8-1 that are NOW in scope:**
- Sequential photo upload → now parallel (this story)
- `window.confirm` → now custom ConfirmDialog (this story)
- EXIF camera-only enforcement for business photos (this story)

**Patterns established in 8-1 to follow:**
- Business router registered at `/api/v1/business/listings` prefix
- Ownership validation pattern: `if listing.business_owner_id != current_user.id: raise ListingForbiddenException`
- Photo IDs tracked in wizard form state as `photo_ids: list[UUID]`
- Tests mock `infrastructure.do_spaces` and `infrastructure.translation_api`
- Frontend uses `apiClient` for all calls with automatic snake↔camelCase

### Git Intelligence

Latest commit `b54eed3` implemented Story 8-1 end-to-end. Key files from that commit:
- `backend/modules/listing/business_service.py` — contains `_replace_listing_photos()` that needs fixing
- `apps/web/modules/business/components/PhotoMenuStep.tsx` — the component to refactor
- `backend/modules/media/service.py` — the service to extend with thumbnail + EXIF
- All business listing schemas, models, and router are already in place

### Testing Standards

- **Backend**: pytest + pytest-asyncio, mock `infrastructure.do_spaces` (S3 client), transaction rollback per test via `db_session` fixture. Target 80% service layer coverage
- **Frontend**: Vitest + React Testing Library, mock `apiClient`, mock `useAuth` (return BusinessOwner user), co-located `__tests__/` directories. Every component MUST render without error
- **Test naming**: `test_{action}_{scenario}_{expected_result}` (backend), `it("should {action} when {condition}")` (frontend)

### Project Structure Notes

- Business portal routes: `(business)/vi/` route group — Vietnamese-only, desktop-first
- Media module is shared infrastructure — changes to `MediaFile` model affect all consumers (review photos, user avatars, listing photos). Ensure `display_order` default of 0 and nullable `thumbnail_url` do not break existing queries
- Thumbnail upload key pattern: `media/{owner_type}/{owner_id}/{uuid}_thumb.webp` (suffix `_thumb` distinguishes from full image)

### Scope Boundaries

**IN SCOPE:**
- Camera EXIF validation (soft check, not blocking) for business listing photos
- Thumbnail generation (300px WebP) during upload
- `display_order` column on MediaFile + migration
- Fix IDOR vulnerability in `_replace_listing_photos`
- Replace `created_at` ordering hack with `display_order`
- Drag-to-reorder photos (HTML5 native)
- Custom ConfirmDialog for photo removal
- Parallel photo upload (max 3 concurrent)
- Photo reorder API endpoint
- Photo delete API endpoint (individual photo)
- EXIF verification badge on photo cards

**OUT OF SCOPE (deferred):**
- Rate limiting on upload endpoint → enhancement
- Image content moderation (AI-based) → Story 9.3
- Gallery vs camera-only enforcement on frontend (`capture` attribute is hint, not enforced) → browser limitation
- Batch delete multiple photos at once → enhancement
- Photo crop/rotate before upload → enhancement
- Backfill thumbnails for existing photos → separate task/migration script

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-8-business-owner-portal.md#Story-8.2]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#File-Storage]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Module-Structure]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure-boundaries.md#Media-Module]
- [Source: _bmad-output/planning-artifacts/prd/domain-specific-requirements.md#Camera-Only-Photo-Policy]
- [Source: _bmad-output/planning-artifacts/epics/requirements-inventory.md#FR32-FR66-FR17]
- [Source: _bmad-output/implementation-artifacts/8-1-listing-editor-create-edit-with-auto-translation.md#Review-Findings-P3-P7]
- [Source: backend/modules/media/service.py — validate_camera_exif(), _process_image(), upload_photo()]
- [Source: backend/modules/listing/business_service.py — _replace_listing_photos()]
- [Source: backend/infrastructure/do_spaces.py — build_public_url()]

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- `python -m pytest backend/tests/media/test_exif_validation.py backend/tests/media/test_service.py backend/tests/listing/test_business_service.py backend/tests/listing/test_business_photo_router.py`
- `pnpm --filter web exec vitest run modules/business/components/__tests__/PhotoMenuStep.test.tsx shared/components/__tests__/ConfirmDialog.test.tsx modules/business/components/__tests__/ListingWizard.test.tsx`
- `python -m pytest backend/tests`
- `pnpm --filter web test`
- `python -m ruff check backend`
- `pnpm --filter web lint`

### Completion Notes List

- Implemented media schema/storage changes for `display_order`, `thumbnail_url`, and soft EXIF verification, including synchronous thumbnail generation and updated upload responses.
- Added business photo reorder/delete APIs with ownership checks, compacted ordering, and replaced the `created_at` ordering hack with `display_order` updates.
- Refactored business Step 2 UI for max-3 parallel uploads, in-grid skeleton placeholders, native drag-and-drop reorder, thumbnail-first rendering, EXIF badges, and a reusable custom confirm dialog.
- Preserved existing edit-mode uploads while restoring temporary owner grouping for create-mode uploads, and kept `_replace_listing_photos()` compatible with both temporary-owner and unassigned draft media.
- Added/updated backend and frontend tests, plus small validation-support fixes in worker initialization, translation client linting, translation client-side state initialization, and search/media test fixtures so full regression suites pass.
- Addressed post-review follow-ups by splitting gallery vs camera upload inputs, locking in-flight photo interactions to avoid UI races, adding advisory locking for `display_order`, and cleaning up uploaded DO Spaces objects on failure paths.
- Revalidated the review patch set with targeted frontend/backend tests plus full `backend/tests`, `pnpm --filter web test`, `python -m ruff check backend`, and `pnpm --filter web lint`.

### File List

- `_bmad-output/implementation-artifacts/8-2-photo-upload-media-management-business.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `apps/web/modules/business/components/ListingWizard.tsx`
- `apps/web/modules/business/components/PhotoMenuStep.tsx`
- `apps/web/modules/business/components/__tests__/ListingWizard.test.tsx`
- `apps/web/modules/business/components/__tests__/PhotoMenuStep.test.tsx`
- `apps/web/modules/business/lib/businessListingApi.ts`
- `apps/web/modules/business/lib/types.ts`
- `apps/web/modules/translation/components/VoiceTranslationView.tsx`
- `apps/web/modules/translation/hooks/useSpeechRecognition.ts`
- `apps/web/shared/components/ConfirmDialog.tsx`
- `apps/web/shared/components/__tests__/ConfirmDialog.test.tsx`
- `backend/infrastructure/translation_api.py`
- `backend/infrastructure/worker.py`
- `backend/migrations/versions/2026_04_29_0001_add_media_display_order_and_thumbnail.py`
- `backend/modules/listing/business_router.py`
- `backend/modules/listing/business_service.py`
- `backend/modules/listing/exceptions.py`
- `backend/modules/listing/schemas.py`
- `backend/modules/media/constants.py`
- `backend/modules/media/models.py`
- `backend/modules/media/repository.py`
- `backend/modules/media/router.py`
- `backend/modules/media/schemas.py`
- `backend/modules/media/service.py`
- `backend/modules/review/repository.py`
- `backend/modules/review/router.py`
- `backend/tests/listing/test_business_photo_router.py`
- `backend/tests/listing/test_business_service.py`
- `backend/tests/media/test_exif_validation.py`
- `backend/tests/media/test_service.py`
- `backend/tests/search/test_service.py`

### Review Findings

- [x] [Review][Patch] D1: Restore `crypto.randomUUID()` fallback for create-mode `uploadOwnerId` — photos need temporary owner grouping before listing exists [ListingWizard.tsx]
- [x] [Review][Patch] D2: Remove `capture="environment"` attribute — conflicts with `multiple` on mobile, blocking gallery multi-select [PhotoMenuStep.tsx:293-295]
- [x] [Review][Patch] P1: Race condition in `get_next_display_order` — concurrent uploads compute identical `display_order` values; no SELECT FOR UPDATE or unique constraint [repository.py:119-125]
- [x] [Review][Patch] P2: Stale closure `photos` in `handleFileChange` — concurrent upload batches overwrite each other because `onPhotosChange` reads closure snapshot instead of latest state [PhotoMenuStep.tsx:234-235]
- [x] [Review][Patch] P3: Stale closure `previousPhotos` in `applyPhotoOrder` — overlapping reorder calls capture wrong rollback target [PhotoMenuStep.tsx:117,131]
- [x] [Review][Patch] P4: In-flight `uploadingSlotIds` not counted toward 10-photo cap — `remainingSlots` only checks `photos.length`, allowing concurrent batches to exceed MAX_PHOTO_COUNT [PhotoMenuStep.tsx:204,265]
- [x] [Review][Patch] P5: Thumbnail object leaked on DO Spaces when `repo.insert` throws after successful `put_object` — no cleanup/compensating delete [service.py:101-135]
- [x] [Review][Patch] P6: `_list_active_listing_photos_by_ids` missing `owner_id` filter — defense-in-depth gap; queries across all listings by ID without scoping to target listing [business_service.py]
- [x] [Review][Patch] P7: Migration downgrade sets `owner_id = id` (media file's own PK) — creates garbage FK values that corrupt owner reference data [migration:58-63]
- [x] [Review][Patch] P8: `dragOverPhotoId` set to source photo in `handleDragStart` — causes false highlight flash before first `dragOver` fires [PhotoMenuStep.tsx]
- [x] [Review][Patch] P9: `confirmRemovePhoto` double-tap race — `setPendingDeletePhotoId(null)` before async `deleteListingPhoto` completes allows second invocation; rollback restores already-deleted photo [PhotoMenuStep.tsx:148-170]
- [x] [Review][Patch] P10: `applyPhotoOrder` replaces UI state with server response, silently dropping photos added by concurrent uploads that resolved between optimistic update and API return [PhotoMenuStep.tsx:115-133]
- [x] [Review][Patch] P11: Skeleton upload cards missing `onDragOver`/`onDrop` handlers — dropping a file on a skeleton triggers browser default file-open behavior [PhotoMenuStep.tsx:381-392]
- [x] [Review][Patch] P12: Header button "Tải ảnh lên" shows disabled state but missing "Đã đạt tối đa 10 ảnh" text per AC#4 [PhotoMenuStep.tsx:265]
- [x] [Review][Patch] P13: "adds and removes menu rows" test deleted without replacement — reduces MenuItemsTable test coverage [PhotoMenuStep.test.tsx]
- [x] [Review][Patch] P14: `PhotoDeleteResponse` schema defined but unused — dead code; delete endpoint returns bare 204 [schemas.py:114]
- [x] [Review][Defer] W1: `VoiceTranslationView` `readTranslationHistory()` in `useState` initializer may crash during SSR [VoiceTranslationView.tsx] — deferred, outside story 8-2 scope
- [x] [Review][Defer] W2: `useSpeechRecognition` `getSpeechRecognitionConstructor()` in `useState` initializer accesses browser-only API during SSR [useSpeechRecognition.ts] — deferred, outside story 8-2 scope
- [x] [Review][Defer] W3: `_generate_thumbnail` blocks async event loop with sync CPU-bound Pillow resize [service.py] — deferred, spec mandates synchronous approach; pre-existing pattern from `_process_image`

### Review Findings (Round 2)

- [x] [Review][Decision] D1: Translation module SSR regressions — reverted to useEffect + hydratedRef guard pattern [VoiceTranslationView.tsx, useSpeechRecognition.ts]
- [x] [Review][Decision] D2: Soft-deleted photos leave orphaned objects in DO Spaces — added `delete_photo_objects` to MediaService, called after commit in `delete_listing_photo` [business_service.py, service.py]
- [x] [Review][Patch] P1 (High): Missing advisory lock on `reorder_listing_photos` and `delete_listing_photo` — added `lock_display_order_sequence` call [business_service.py]
- [x] [Review][Dismiss] P2 (Medium): Stale closures in photo operations — false positive; `isPhotoInteractionLocked` already blocks all concurrent operations during reorder/upload/delete [PhotoMenuStep.tsx]
- [x] [Review][Patch] P3 (Medium): SQLAlchemy `case()` deprecated API — switched to explicit whens list [repository.py:151]
- [x] [Review][Patch] P4 (Medium): Migration downgrade irreversibly deletes rows — changed DELETE to UPDATE with sentinel UUID [migration:58]
- [x] [Review][Patch] P5 (Medium): `delete_listing_photo` missing min photo count — added `len(current_photos) <= 3` guard [business_service.py]
- [x] [Review][Patch] P6 (Low): Test dependency_overrides leak — added `app.dependency_overrides.clear()` in fixture teardown [test_business_photo_router.py]
- [x] [Review][Patch] P7 (Low): `_delete_uploaded_object` silent swallow — added `logger.warning` with exc_info [service.py]
- [x] [Review][Defer] W1: Synchronous S3 `put_object` + Pillow resize block async event loop in `upload_photo` — pre-existing pattern, extends previous W3 [service.py:107-125]
- [x] [Review][Defer] W2: Generic `/api/v1/media` upload endpoint lacks `owner_id` ownership verification — any authenticated user can attach photos to any entity. Pre-existing IDOR, not introduced by this change [router.py:21-42]
- [x] [Review][Defer] W3: Generic media upload allows `owner_type` bypass — user can upload via `owner_type=review` through generic endpoint to skip EXIF enforcement. Pre-existing architecture [router.py:21-42]

### Change Log

- 2026-04-29: Implemented Story 8.2 end-to-end across backend media/listing flows, frontend business photo management UI, and supporting regression fixes required to keep full backend/frontend validation green.
- 2026-04-29: Code review completed — 2 decision-needed, 14 patch, 3 deferred, 12 dismissed.
- 2026-04-29: Addressed code review follow-ups D1/D2 and P1-P14, then reran full backend/frontend validation suites.
- 2026-04-29: Code review round 2 completed — 2 decision-needed, 7 patch, 3 deferred, 7 dismissed.
- 2026-04-29: Addressed round 2 review — D1 reverted, D2+P1+P3-P7 fixed, P2 dismissed (false positive). All backend+frontend tests green.
