# Story 4.1: Write Review with Star Rating & Camera-Only Photos

Status: review

## Story

As a registered user who visited a listing,
I want to write a review with a star rating and camera-only photos,
So that I can share my genuine experience and help other Japanese users make informed decisions.

## Acceptance Criteria

1. **Given** the backend review module
   **When** database migrations run
   **Then** the `review_votes` table is created (review_id, user_id, vote_type, created_at, deleted_at)
   **And** the review model gains multi-criteria rating columns (rating_value, rating_cleanliness, rating_location, rating_service — all nullable SmallInteger 1-5) while keeping the existing `rating` column as the overall/required rating

2. **Given** I am on a listing detail page and logged in (FR15)
   **When** I tap "レビューを書く" (Write a review)
   **Then** a review form opens with: star rating selector (1-5 stars, tap to rate), text area (placeholder: "あなたの経験を教えてください"), and photo upload button
   **And** star rating is required, text is required (min 20 chars)

3. **Given** I tap the photo upload button (FR16)
   **When** the device camera opens
   **Then** only camera capture is available (no gallery access) via `<input accept="image/*" capture="environment">`
   **And** I can take up to 5 photos per review

4. **Given** I submit a photo (FR17)
   **When** the backend processes the upload
   **Then** the system validates EXIF metadata to confirm the photo was taken by a camera (has EXIF DateTime/Make/Model — not screenshot or downloaded image)
   **And** if EXIF validation fails, a polite error message displays: "カメラで撮影した写真のみアップロードできます"
   **And** valid photos are compressed and optimized for web delivery via the existing MediaService

5. **Given** I submit my review
   **When** the review is published
   **Then** the review appears on the listing detail page with my avatar, name, senpai badge, rating, text, and photos
   **And** the listing's `rating_avg` and `review_count` are recalculated atomically
   **And** a `review.review.created` event fires on the event bus (triggers gamification + moderation)
   **And** a toast confirms "レビューを投稿しました"

6. **Given** I am not logged in and tap "レビューを書く"
   **When** the auth check triggers (FR53)
   **Then** the signup modal appears, and after login, the review form opens

7. **Given** I have already reviewed this listing
   **When** I try to write another review
   **Then** the system shows "すでにこのお店にレビューを投稿済みです" and blocks duplicate submission

## Tasks / Subtasks

### Backend — Migration & Model Updates

- [x] Task 1: Alembic migration for review_votes + multi-criteria columns (AC: #1)
  - [x] 1.1 Create migration `2026_04_24_0001_add_review_votes_and_multi_criteria.py`
  - [x] 1.2 Add `review_votes` table: id (UUID PK), review_id (UUID FK→reviews.id CASCADE), user_id (UUID FK→users.id SET NULL), vote_type (VARCHAR — "helpful"), created_at, deleted_at
  - [x] 1.3 Add unique partial index `uq_review_votes_review_user` on (review_id, user_id) WHERE deleted_at IS NULL
  - [x] 1.4 Add columns to `reviews`: rating_value (SmallInteger nullable), rating_cleanliness (SmallInteger nullable), rating_location (SmallInteger nullable), rating_service (SmallInteger nullable)
  - [x] 1.5 Add CHECK constraint on new rating columns: value BETWEEN 1 AND 5 OR NULL

- [x] Task 2: Update Review model and add ReviewVote model (AC: #1)
  - [x] 2.1 Add multi-criteria columns to `Review` model in `review/models.py`
  - [x] 2.2 Create `ReviewVote` model in `review/models.py`

### Backend — Review Write API

- [x] Task 3: Review create schemas (AC: #2, #5)
  - [x] 3.1 Add `ReviewCreateRequest` to `review/schemas.py`: listing_id (UUID, required), rating (int 1-5, required), body (str min 20 chars, required), rating_value (int 1-5, optional), rating_cleanliness (int 1-5, optional), rating_location (int 1-5, optional), rating_service (int 1-5, optional), photo_ids (list[UUID], max 5, optional)
  - [x] 3.2 Add `ReviewCreateResponse` to `review/schemas.py`: id, listing_id, user_id, rating, body, rating_value, rating_cleanliness, rating_location, rating_service, photos (list of MediaItem), created_at
  - [x] 3.3 Add `ReviewItem` response schema (for listing detail enrichment): id, user_id, rating, body, helpful_count, created_at, user_display_name, user_avatar_url, user_badge_level, photos

- [x] Task 4: Review repository write methods (AC: #5, #7)
  - [x] 4.1 Add `create(review: Review) -> Review` to `review/repository.py`
  - [x] 4.2 Add `exists_for_user_and_listing(user_id, listing_id) -> bool` to prevent duplicates
  - [x] 4.3 Add `get_by_id(review_id) -> Review | None`

- [x] Task 5: Review service (AC: #4, #5, #7)
  - [x] 5.1 Create `review/service.py` with `ReviewService` class
  - [x] 5.2 Implement `create_review(user_id, request) -> Review`:
    - Check duplicate via `exists_for_user_and_listing`; raise `ReviewAlreadyExistsException` if found
    - Create review row
    - If photo_ids provided, verify media files exist with owner_type=REVIEW via MediaService dependency
    - Update listing `rating_avg` and `review_count` atomically (single UPDATE with subquery)
    - Emit `review.review.created` event with payload: `{user_id, review_id, listing_id, rating}`
    - Return created review

- [x] Task 6: EXIF validation in MediaService (AC: #4)
  - [x] 6.1 Add `validate_camera_exif(file_bytes: bytes) -> bool` static method to `media/service.py`
    - Extract EXIF data using Pillow before processing
    - Check for presence of EXIF DateTime OR Make OR Model tags
    - Return True if any camera indicator found, False otherwise
  - [x] 6.2 Add `upload_review_photo(file_bytes, mime_type, owner_id) -> MediaFile` to `MediaService`
    - Calls `validate_camera_exif` first; raises `MediaExifValidationException` if fails
    - Delegates to existing `upload_photo` with `owner_type=MediaOwnerType.REVIEW`
  - [x] 6.3 Add `MediaExifValidationException` to `media/exceptions.py` with message_ja: "カメラで撮影した写真のみアップロードできます"

- [x] Task 7: Review router endpoint (AC: #2, #5, #6, #7)
  - [x] 7.1 Create `review/router.py` with `APIRouter(prefix="/api/v1/reviews", tags=["reviews"])`
  - [x] 7.2 Add `POST /api/v1/reviews` — requires auth, rate-limited (5 reviews/hour), returns `SingleEnvelope[ReviewCreateResponse]` with status 201
  - [x] 7.3 Register review router in `backend/main.py`

- [x] Task 8: Review photo upload endpoint (AC: #3, #4)
  - [x] 8.1 Add `POST /api/v1/reviews/photos` to `review/router.py` — requires auth, accepts file upload (multipart), calls `MediaService.upload_review_photo`, returns `MediaUploadResponse`
  - [x] 8.2 Rate limit: 20 uploads/hour per user

- [x] Task 9: Event wiring (AC: #5)
  - [x] 9.1 Create `review/events.py` with `REVIEW_CREATED_EVENT = "review.review.created"`
  - [x] 9.2 Verify gamification module already subscribes to `review.review.created` (it does — in `gamification/events.py`)
  - [x] 9.3 Register review event subscribers in `main.py` lifespan if any module-local handlers needed

- [x] Task 10: Review exceptions (AC: #7)
  - [x] 10.1 Create `review/exceptions.py` with `ReviewAlreadyExistsException` (409 Conflict, message_ja: "すでにこのお店にレビューを投稿済みです")
  - [x] 10.2 Add `ReviewNotFoundException` for future use
  - [x] 10.3 Add `ListingNotFoundException` import pattern if listing_id validation needed

### Backend — Tests

- [x] Task 11: Backend tests (AC: #1-7)
  - [x] 11.1 `tests/review/test_router.py` — test POST /reviews with valid data returns 201
  - [x] 11.2 Test POST /reviews without auth returns 401
  - [x] 11.3 Test POST /reviews with duplicate listing returns 409
  - [x] 11.4 Test POST /reviews with rating out of range returns 422
  - [x] 11.5 Test POST /reviews with body < 20 chars returns 422
  - [x] 11.6 Test POST /reviews updates listing rating_avg and review_count
  - [x] 11.7 Test POST /reviews fires review.review.created event
  - [x] 11.8 `tests/media/test_exif_validation.py` — test validate_camera_exif with real camera photo returns True
  - [x] 11.9 Test validate_camera_exif with screenshot (no EXIF) returns False
  - [x] 11.10 Test POST /reviews/photos with valid camera photo returns 200
  - [x] 11.11 Test POST /reviews/photos with screenshot returns 400 with Japanese error message

### Frontend — Review Form

- [x] Task 12: ReviewForm component (AC: #2, #3, #6)
  - [x] 12.1 Create `apps/web/modules/listing-detail/components/ReviewForm.tsx`
  - [x] 12.2 Star rating selector: 5 tappable stars, required, visual fill on selection
  - [x] 12.3 Text area with placeholder "あなたの経験を教えてください", min 20 chars validation
  - [x] 12.4 Photo upload button with `<input type="file" accept="image/*" capture="environment">`, max 5 photos
  - [x] 12.5 Photo preview thumbnails with remove button
  - [x] 12.6 Submit button disabled until rating + text validation passes
  - [x] 12.7 Loading state on submit (button shows spinner-free loading indicator)
  - [x] 12.8 Auth gate: if not logged in, show signup modal on "レビューを書く" tap, then open form after login

- [x] Task 13: StarRating input component (AC: #2)
  - [x] 13.1 Create `apps/web/shared/components/StarRatingInput.tsx`
  - [x] 13.2 Props: `{ value: number; onChange: (rating: number) => void; size?: "sm" | "md" | "lg" }`
  - [x] 13.3 Render 5 stars, tappable, filled up to selected value
  - [x] 13.4 Accessible: aria-label, keyboard navigable

- [x] Task 14: Photo upload with EXIF validation feedback (AC: #3, #4)
  - [x] 14.1 Create `apps/web/modules/listing-detail/components/ReviewPhotoUpload.tsx`
  - [x] 14.2 Upload each photo to `POST /api/v1/reviews/photos` immediately on capture
  - [x] 14.3 Show thumbnail preview after successful upload
  - [x] 14.4 Show error toast "カメラで撮影した写真のみアップロードできます" if EXIF validation fails
  - [x] 14.5 Track uploaded photo IDs in state (pass to review submit)
  - [x] 14.6 Limit to 5 photos; hide upload button when limit reached

- [x] Task 15: Review submission flow (AC: #5)
  - [x] 15.1 Create `apps/web/modules/listing-detail/hooks/useCreateReview.ts` — TanStack mutation calling `POST /api/v1/reviews`
  - [x] 15.2 On success: invalidate listing detail query (triggers review list refresh), show toast "レビューを投稿しました", close form
  - [x] 15.3 On error 409: show toast "すでにこのお店にレビューを投稿済みです"
  - [x] 15.4 On generic error: show polite error toast

- [x] Task 16: Wire ReviewForm into listing detail page (AC: #2, #6)
  - [x] 16.1 Add "レビューを書く" button to `ReviewsSection.tsx`
  - [x] 16.2 Button opens ReviewForm as modal/sheet
  - [x] 16.3 If not authenticated, trigger auth modal first (use existing auth gate pattern)

### Frontend — i18n

- [x] Task 17: i18n keys (AC: #2, #4, #5, #7)
  - [x] 17.1 Add keys under `review` namespace in `ja.json`: form title, placeholder, submit button, success toast, error messages, photo upload label
  - [x] 17.2 Add equivalent keys in `en.json` and `vi.json`

### Frontend — Tests

- [x] Task 18: Frontend tests (AC: #2, #3)
  - [x] 18.1 `modules/listing-detail/components/__tests__/ReviewForm.test.tsx` — render test with star selector and text area
  - [x] 18.2 Test submit button disabled when rating not selected
  - [x] 18.3 Test submit button disabled when text < 20 chars
  - [x] 18.4 `shared/components/__tests__/StarRatingInput.test.tsx` — render test, click to select rating
  - [x] 18.5 `modules/listing-detail/components/__tests__/ReviewPhotoUpload.test.tsx` — render test with max 5 limit

## Dev Notes

### Architecture Compliance

- **Extend existing module**: The `backend/modules/review/` module already exists as a partial/read-only module (created in Story 2.4 for listing detail page). This story completes the write path. Do NOT create a new module.
- **Module isolation**: Review service must NOT import listing module directly. Use event bus for cross-module side effects. For updating listing `rating_avg`/`review_count`, use a direct SQL UPDATE with subquery in the review repository (both tables are in the same DB — this is acceptable for atomic consistency).
- **Media integration**: Use `MediaService` via FastAPI `Depends()` injection for photo upload. The media module already supports `owner_type=REVIEW`.
- **Event bus**: `review.review.created` is already subscribed to by gamification module (`backend/modules/gamification/events.py`). No additional wiring needed for gamification points.

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| Review model (partial) | `backend/modules/review/models.py` | Has: listing_id, user_id, rating (overall), body, helpful_count. Extend with multi-criteria columns. |
| Review read-only repository | `backend/modules/review/repository.py` | Has: breakdown_for_listing, featured_for_listing, count_for_listing. Add write methods. |
| ReviewsSection (frontend) | `apps/web/modules/listing-detail/components/ReviewsSection.tsx` | Displays review breakdown histogram, featured review, total count. Add "Write Review" button here. |
| MediaService.upload_photo | `backend/modules/media/service.py` | Handles upload → EXIF rotate → strip metadata → resize → WebP → DO Spaces. Add EXIF validation wrapper. |
| MediaOwnerType.REVIEW | `backend/modules/media/models.py` | Already includes REVIEW enum value. |
| Media upload endpoint | `POST /api/v1/media` | Generic upload. Create review-specific endpoint that adds EXIF validation. |
| Gamification subscriber | `backend/modules/gamification/events.py` | Already subscribes to `review.review.created` → awards points. |
| Auth gate pattern | `apps/web/shared/components/` or auth module | Signup modal trigger pattern already established in listing detail. |
| Listing.rating_avg, review_count | `backend/modules/listing/models.py` | Decimal(2,1) and Integer columns. Update atomically on review create. |
| apiClient with FormData | `apps/web/shared/lib/apiClient.ts` | Supports multipart uploads. Use for photo upload. |
| Toast notifications | Existing toast system | Use for success/error feedback. |

### EXIF Validation Strategy

The current `MediaService._process_image()` strips all EXIF after auto-rotating. For camera-only enforcement:

1. **Before** calling `_process_image`, extract EXIF data from raw bytes using Pillow
2. Check for presence of EXIF tags indicating camera origin: `DateTime`, `Make`, `Model`, `DateTimeOriginal`, `ExifImageWidth`
3. Screenshots and downloaded images typically have NO EXIF or only basic fields (no Make/Model)
4. This is a **best-effort** check — determined users can forge EXIF. The goal is to discourage casual gallery uploads, not provide cryptographic proof.

```python
from PIL import Image
from PIL.ExifTags import Base as ExifBase

@staticmethod
def validate_camera_exif(file_bytes: bytes) -> bool:
    try:
        with Image.open(io.BytesIO(file_bytes)) as img:
            exif = img.getexif()
            if not exif:
                return False
            camera_tags = {ExifBase.Make, ExifBase.Model, ExifBase.DateTime, ExifBase.DateTimeOriginal}
            return bool(camera_tags & set(exif.keys()))
    except Exception:
        return False
```

### Listing Rating Recalculation

Atomic update in review repository (not service) to prevent race conditions:

```python
async def recalculate_listing_rating(self, listing_id: uuid.UUID) -> None:
    stmt = (
        update(Listing)
        .where(Listing.id == listing_id)
        .values(
            rating_avg=select(func.avg(Review.rating))
                .where(Review.listing_id == listing_id, Review.deleted_at.is_(None))
                .correlate(None)
                .scalar_subquery(),
            review_count=select(func.count(Review.id))
                .where(Review.listing_id == listing_id, Review.deleted_at.is_(None))
                .correlate(None)
                .scalar_subquery(),
        )
    )
    await self.session.execute(stmt)
```

Note: This requires importing `Listing` model. Since this is a SQL-level operation (not a Python import of listing service), it's acceptable. Alternatively, use raw SQL text to avoid the import entirely.

### Camera-Only Frontend Enforcement

```tsx
<input
  type="file"
  accept="image/*"
  capture="environment"  // Opens rear camera directly
  onChange={handlePhotoCapture}
/>
```

- `capture="environment"` forces camera on mobile devices
- Desktop browsers will show file picker (camera-only can't be enforced on desktop — EXIF backend validation is the real guard)
- Show at most 5 photo slots; hide input when all 5 filled

### Photo Upload Flow

1. User taps camera button → device camera opens
2. After capture, photo uploaded immediately to `POST /api/v1/reviews/photos`
3. Backend validates EXIF → processes → stores → returns MediaUploadResponse
4. Frontend shows thumbnail preview with photo ID stored in state
5. On review submit, pass `photo_ids: [uuid, ...]` in ReviewCreateRequest
6. Backend verifies all photo_ids exist with owner_type=REVIEW

### Frontend Component Placement

```tsx
// ReviewsSection.tsx — add "Write Review" button
<ReviewsSection>
  <ReviewBreakdown />
  <FeaturedReview />
  <Button onClick={openReviewForm}>レビューを書く</Button>  {/* NEW */}
</ReviewsSection>

// ReviewForm as modal/bottom-sheet
<ReviewFormModal isOpen={isOpen} onClose={close} listingId={listingId}>
  <StarRatingInput value={rating} onChange={setRating} />
  <TextArea ... />
  <ReviewPhotoUpload photos={photos} onUpload={addPhoto} onRemove={removePhoto} />
  <SubmitButton />
</ReviewFormModal>
```

### TanStack Query Keys

- Mutation: `['review', 'create']`
- Invalidation on success: `['listing', 'detail', listingId]` (triggers ReviewsSection refresh)
- Photo upload mutation: `['review', 'photo', 'upload']`

### Anti-Patterns to Avoid

- Do NOT create a new `review` backend module — extend the existing partial one
- Do NOT import `ListingService` in review module — use SQL subquery for rating recalc
- Do NOT skip EXIF validation on backend — frontend `capture` is easily bypassed
- Do NOT store photo files locally — use existing DO Spaces via MediaService
- Do NOT use `any` type in TypeScript — use proper types
- Do NOT use `os.getenv()` — use `shared.config.settings`
- Do NOT use spinners — use Skeleton for loading states
- Do NOT hardcode Japanese strings — all via `useTranslations()`
- Do NOT forget `@/` path aliases for all imports
- Do NOT create review without auth — endpoint must require `get_current_user`
- Do NOT allow duplicate reviews per user per listing — enforce at repository level with unique check
- Do NOT use relative imports in frontend — always `@/`
- Do NOT rebuild the star breakdown histogram — it already works in ReviewsSection

### Previous Story Intelligence (Story 3.4)

- **Agent models used**: openai/gpt-5.4 (backend), claude-opus-4-6 (frontend)
- **Key learnings**: Race condition patterns — use atomic SQL operations. i18n — use `t.has()` for fallback safety. Test isolation — ensure Redis rate-limit keys are cleared between tests (fixed in `backend/tests/conftest.py`).
- **Validation gates**: 327 backend tests, 91 frontend files / 377 tests. Maintain this baseline.
- **Build commands**: `python -m pytest backend/tests/`, `pnpm --filter web test`, `pnpm --filter web build`
- **i18n pattern**: Use separate namespace per module (`review` namespace, NOT under `listing`)

### Git Intelligence

Recent commits:
- `3e2b7b5 create story(3-4): expose senpai badge progress for profiles and public consumers`
- `1ad9e22 create: add contribution points gamification engine`
- Commit convention: `create: ...` for new features

### Project Structure Notes

**New files to create:**
```
backend/modules/review/service.py
backend/modules/review/events.py
backend/modules/review/exceptions.py
backend/modules/review/constants.py
backend/modules/review/dependencies.py
backend/migrations/versions/2026_04_24_0001_add_review_votes_and_multi_criteria.py
backend/tests/review/test_router.py
backend/tests/media/test_exif_validation.py
apps/web/modules/listing-detail/components/ReviewForm.tsx
apps/web/modules/listing-detail/components/ReviewPhotoUpload.tsx
apps/web/modules/listing-detail/hooks/useCreateReview.ts
apps/web/shared/components/StarRatingInput.tsx
apps/web/shared/components/__tests__/StarRatingInput.test.tsx
apps/web/modules/listing-detail/components/__tests__/ReviewForm.test.tsx
apps/web/modules/listing-detail/components/__tests__/ReviewPhotoUpload.test.tsx
```

**Files to modify:**
```
backend/modules/review/models.py          — add multi-criteria columns + ReviewVote model
backend/modules/review/schemas.py         — add create request/response schemas
backend/modules/review/repository.py      — add write methods + rating recalc
backend/modules/media/service.py          — add validate_camera_exif + upload_review_photo
backend/modules/media/exceptions.py       — add MediaExifValidationException
backend/main.py                           — register review router + event subscribers
apps/web/modules/listing-detail/components/ReviewsSection.tsx — add "Write Review" button
apps/web/messages/ja.json                 — add review namespace keys
apps/web/messages/en.json                 — add review namespace keys
apps/web/messages/vi.json                 — add review namespace keys
```

### Validation Gates

Before marking complete, verify ALL pass:
```bash
python -m pytest backend/tests/                      # All backend tests
python -m ruff check backend/                         # Backend lint
pnpm --filter web test                                # All frontend tests
pnpm --filter web lint                                # Frontend lint
pnpm --filter web build                               # Next.js build
```

### References

- [Source: epics/epic-4-reviews-content-creation.md#Story 4.1]
- [Source: epics/epic-4-reviews-content-creation.md#Story 4.2] — next story context (review_votes)
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns]
- [Source: architecture/implementation-patterns-consistency-rules.md#Communication Patterns]
- [Source: architecture/implementation-patterns-consistency-rules.md#Format Patterns]
- [Source: prd/web-application-architecture.md#Implementation Stack]
- [Source: backend/modules/review/models.py] — existing Review model (partial)
- [Source: backend/modules/review/repository.py] — existing read-only repository
- [Source: backend/modules/review/schemas.py] — placeholder for write schemas
- [Source: backend/modules/media/service.py] — MediaService with upload_photo + _process_image
- [Source: backend/modules/media/router.py] — existing media upload endpoint pattern
- [Source: backend/modules/media/models.py] — MediaOwnerType.REVIEW already exists
- [Source: backend/modules/gamification/events.py] — review.review.created subscriber
- [Source: backend/modules/listing/models.py] — Listing.rating_avg, review_count columns
- [Source: apps/web/modules/listing-detail/components/ReviewsSection.tsx] — existing review display
- [Source: apps/web/shared/lib/apiClient.ts] — API client with FormData support
- [Source: _bmad-output/implementation-artifacts/3-4-senpai-badge-system.md] — previous story intelligence

## Dev Agent Record

### Agent Model Used

claude-opus-4-6

### Debug Log References

None

### Completion Notes List

- All 18 tasks and subtasks completed
- Backend: Alembic migration for review_votes table + multi-criteria columns, Review/ReviewVote models, ReviewService with duplicate check + atomic rating recalc + event emission, EXIF camera validation in MediaService, POST /api/v1/reviews (201, auth, rate-limited 5/hr), POST /api/v1/reviews/photos (EXIF validated, rate-limited 20/hr)
- Frontend: StarRatingInput component (accessible, keyboard navigable), ReviewForm modal with star rating + textarea + photo upload, ReviewPhotoUpload with camera-only capture + EXIF error handling, useCreateReview hook, WriteReviewButton with auth gate, i18n keys (ja/en/vi)
- Tests: 12 new backend tests (339 total), 10 new frontend tests (387 total)
- All validation gates pass: backend tests, ruff lint, frontend tests, eslint, Next.js build

### Change Log

- 2026-04-24: Story 4-1 implemented — review write path with star rating, camera-only photos, EXIF validation, auth gate, duplicate prevention

### File List

**New files:**
- backend/migrations/versions/2026_04_24_0002_add_review_votes_and_multi_criteria.py
- backend/modules/review/service.py
- backend/modules/review/events.py
- backend/modules/review/exceptions.py
- backend/modules/review/dependencies.py
- backend/modules/review/router.py
- backend/tests/review/test_router.py
- backend/tests/media/test_exif_validation.py
- apps/web/shared/components/StarRatingInput.tsx
- apps/web/modules/listing-detail/components/ReviewForm.tsx
- apps/web/modules/listing-detail/components/ReviewPhotoUpload.tsx
- apps/web/modules/listing-detail/hooks/useCreateReview.ts
- apps/web/shared/components/__tests__/StarRatingInput.test.tsx
- apps/web/modules/listing-detail/__tests__/ReviewForm.test.tsx
- apps/web/modules/listing-detail/__tests__/ReviewPhotoUpload.test.tsx

**Modified files:**
- backend/modules/review/models.py — added multi-criteria columns + ReviewVote model
- backend/modules/review/schemas.py — added create request/response schemas
- backend/modules/review/repository.py — added write methods + rating recalc
- backend/modules/media/service.py — added validate_camera_exif + upload_review_photo
- backend/modules/media/exceptions.py — added MediaExifValidationException
- backend/main.py — registered review router
- apps/web/modules/listing-detail/components/ReviewsSection.tsx — added WriteReviewButton
- apps/web/messages/ja.json — added review namespace keys
- apps/web/messages/en.json — added review namespace keys
- apps/web/messages/vi.json — added review namespace keys
