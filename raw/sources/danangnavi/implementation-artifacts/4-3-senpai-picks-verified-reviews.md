# Story 4.3: Senpai Picks & Verified Reviews

Status: review

## Story

As a Japanese guest browsing listings,
I want to see senpai-verified reviews and Senpai Picks prominently,
So that I can quickly find trustworthy recommendations from experienced community members.

## Acceptance Criteria

1. **Given** a listing has reviews from senpai-badged users (FR19)
   **When** the listing detail page loads
   **Then** senpai reviews are visually distinguished: green "先輩認証済み ✓" badge on the review card
   **And** senpai reviews appear above non-senpai reviews in the default sort

2. **Given** the homepage "先輩のおすすめ" section
   **When** senpai picks are loaded
   **Then** only listings with senpai-verified reviews (rating ≥ 4.0 from senpai users) appear in the section
   **And** each card shows the senpai reviewer's avatar, name, and a short quote from their review

3. **Given** the search results page
   **When** I toggle the "先輩おすすめ" filter chip
   **Then** results filter to show only senpai-verified listings
   **And** the chip highlights in teal

4. **Given** the backend API
   **When** `GET /api/v1/listings?is_senpai_verified=true` is called
   **Then** only listings with at least one review from a Senpai or Expert Senpai badge user (rating ≥ 4.0) are returned
   **And** the listing response includes `is_senpai_verified: true` flag and the top senpai review snippet

## Tasks / Subtasks

### Backend — Senpai Verification Engine

- [x] Task 1: Add senpai reviewer denormalized fields to Listing model (AC: #2, #4)
  - [x] 1.1 Add columns to `listing/models.py`: `senpai_reviewer_name: str | None`, `senpai_reviewer_avatar_url: str | None` (the `senpai_review_snippet` column already exists)
  - [x] 1.2 Create Alembic migration: `2026_04_25_0001_add_senpai_reviewer_fields.py` — add `senpai_reviewer_name` (Text, nullable) and `senpai_reviewer_avatar_url` (Text, nullable) to `listings` table

- [x] Task 2: Senpai verification service method (AC: #4)
  - [x] 2.1 Add `update_senpai_status(listing_id: UUID, session: AsyncSession) -> None` to `listing/service.py`:
    - Query all reviews for listing WHERE deleted_at IS NULL
    - JOIN BadgeLevel to get reviewer badge levels
    - Find reviews where badge_level IN ('senpai', 'expert_senpai') AND rating >= 4.0
    - If any qualifying review exists: pick the one with highest helpful_count (tie-break: newest)
    - Set `is_senpai_verified=True`, `senpai_review_snippet=review.body[:120]`, `senpai_reviewer_name=user.display_name`, `senpai_reviewer_avatar_url=user.avatar_url`
    - If NO qualifying review: set `is_senpai_verified=False`, clear snippet and reviewer fields

- [x] Task 3: Event subscriber — review.review.created (AC: #4)
  - [x] 3.1 Add subscriber in `listing/events.py` for `review.review.created` event
  - [x] 3.2 On event: call `update_senpai_status(listing_id)` to recalculate
  - [x] 3.3 Also subscribe to `review.review.deleted` (if exists) to recalculate when senpai review is removed

- [x] Task 4: Event subscriber — gamification.user.badge_upgraded (AC: #4)
  - [x] 4.1 Add subscriber in `listing/events.py` for `gamification.user.badge_upgraded` event
  - [x] 4.2 On event: if new level is 'senpai' or 'expert_senpai', query all reviews by this user with rating >= 4.0, call `update_senpai_status()` for each affected listing
  - [x] 4.3 If downgrade (edge case): recalculate affected listings

### Backend — Review List Sort Enhancement

- [x] Task 5: Sort senpai reviews above non-senpai (AC: #1)
  - [x] 5.1 Modify `ReviewRepository.list_for_listing()` in `review/repository.py`: when `sort_by="helpful"` (default), add ORDER BY clause: `CASE WHEN badge_level IN ('senpai', 'expert_senpai') THEN 0 ELSE 1 END ASC, helpful_count DESC, created_at DESC`
  - [x] 5.2 Ensure badge_level join (already exists from Story 4-2) is used for this sort

### Backend — Listing Schema Enhancement

- [x] Task 6: Add senpai reviewer fields to listing response schemas (AC: #2, #4)
  - [x] 6.1 Add to `ListingListItem` in `listing/schemas.py`: `senpai_review_snippet: str | None = None`, `senpai_reviewer_name: str | None = None`, `senpai_reviewer_avatar_url: str | None = None`
  - [x] 6.2 Verify `ListingDetailResponse` already includes `senpai_review_snippet` — add `senpai_reviewer_name` and `senpai_reviewer_avatar_url` if missing

### Backend — Seed Data

- [x] Task 7: Update seed data for senpai verification (AC: #2)
  - [x] 7.1 In `scripts/seed_data.py`: after seeding reviews and badge levels, run `update_senpai_status()` for listings that have qualifying senpai reviews
  - [x] 7.2 Ensure at least 3-6 seed listings have `is_senpai_verified=True` with populated snippet and reviewer fields

### Backend — Tests

- [x] Task 8: Backend tests (AC: #1-4)
  - [x] 8.1 `tests/listing/test_service.py` — test `update_senpai_status` sets `is_senpai_verified=True` when listing has a senpai review with rating >= 4.0
  - [x] 8.2 Test `update_senpai_status` sets `is_senpai_verified=False` when no qualifying senpai reviews exist
  - [x] 8.3 Test `update_senpai_status` picks the most helpful senpai review for snippet
  - [x] 8.4 Test `update_senpai_status` correctly populates reviewer name and avatar
  - [x] 8.5 Test review list sorted by helpful returns senpai reviews first
  - [x] 8.6 Test GET /listings?is_senpai_verified=true returns senpai reviewer fields in response
  - [x] 8.7 Test event handler for `review.review.created` triggers senpai status update
  - [x] 8.8 Test event handler for `gamification.user.badge_upgraded` recalculates affected listings

### Frontend — Senpai Review Badge Enhancement

- [x] Task 9: Show green verified badge on senpai reviews (AC: #1)
  - [x] 9.1 Modify `ReviewCard.tsx`: for reviews where `userBadgeLevel` is `"senpai"` or `"expert_senpai"`, render an additional `<SenpaiBadge variant="verified" />` alongside the rank badge — this shows the green "先輩認証済み ✓" badge
  - [x] 9.2 Alternative approach: modify `getBadgeVariant()` in `badgeUtils.ts` to map `"senpai"` → `"verified"` (but this loses the distinction between senpai and expert_senpai rank). **Preferred**: keep rank badge AND add verified badge on senpai+ reviews

### Frontend — SenpaiPickCard Enhancement

- [x] Task 10: Show senpai reviewer info on homepage cards (AC: #2)
  - [x] 10.1 Update `SenpaiPickListing` type in `modules/home/lib/types.ts`: add `senpaiReviewSnippet: string | null`, `senpaiReviewerName: string | null`, `senpaiReviewerAvatarUrl: string | null`
  - [x] 10.2 Update `fetchSenpaiPicks()` in `modules/home/lib/homepage-data.ts`: map new fields from API response
  - [x] 10.3 Update `SenpaiPickCard.tsx`: add reviewer section below listing title showing: small avatar (24×24), reviewer name, and truncated quote in italics (max 2 lines)

### Frontend — Search Filter Verification

- [x] Task 11: Verify senpai filter end-to-end (AC: #3)
  - [x] 11.1 Verify `FilterChips` "senpai" chip toggles `isSenpaiVerified` on SearchQuery
  - [x] 11.2 Verify `FilterPanel` senpai checkbox applies correctly
  - [x] 11.3 Verify search API call includes `is_senpai_verified=true` query parameter
  - [x] 11.4 Verify chip highlights in teal when active (check existing teal highlight logic)

### Frontend — i18n

- [x] Task 12: i18n keys (AC: #1, #2)
  - [x] 12.1 Add to `ja.json` review namespace: `senpai_verified_badge` ("先輩認証済み"), `senpai_review_quote_prefix` ("「"), `senpai_review_quote_suffix` ("」")
  - [x] 12.2 Add to `ja.json` home namespace: `senpai_reviewer_says` ("{name}さんのおすすめ")
  - [x] 12.3 Add equivalent keys in `en.json` and `vi.json`

### Frontend — Tests

- [x] Task 13: Frontend tests (AC: #1-3)
  - [x] 13.1 `modules/listing-detail/__tests__/ReviewCard.test.tsx` — add test: senpai review renders green verified badge
  - [x] 13.2 `modules/home/__tests__/SenpaiPickCard.test.tsx` — add test: card shows reviewer avatar, name, and quote when data present
  - [x] 13.3 `modules/home/__tests__/SenpaiPickCard.test.tsx` — add test: card renders without reviewer info gracefully (null fields)
  - [x] 13.4 `modules/search/__tests__/FilterChips.test.tsx` — verify senpai chip toggles correctly (may already exist)

## Dev Notes

### Architecture Compliance

- **Extend existing modules**: Add to `listing/service.py`, `listing/events.py`, `listing/schemas.py`, `listing/models.py`. Do NOT create new modules.
- **Module isolation**: Listing module subscribes to review and gamification events via event bus. Do NOT import review or gamification modules directly. For badge_level data in the verification query, use SQL JOIN through `badge_levels` table (same pattern as Story 4-2's review list query).
- **Denormalization strategy**: `senpai_reviewer_name`, `senpai_reviewer_avatar_url`, `senpai_review_snippet` are denormalized on the Listing model for query-time performance (homepage renders these without joins). Recalculated on every qualifying event.
- **Event-driven**: Senpai status updates are triggered asynchronously via event bus. The review creation flow does NOT synchronously update listing — it fires an event, and the listing module's subscriber handles it.

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| `is_senpai_verified` column | `listing/models.py:85` | Boolean, default=False. Already in DB. |
| `senpai_review_snippet` column | `listing/models.py:109` | Text, nullable. Already in DB. |
| `SenpaiBadge` component | `shared/components/SenpaiBadge.tsx` | 5 variants including "verified" (green "先輩認証済み ✓"). |
| `getBadgeVariant()` | `shared/lib/badgeUtils.ts` | Maps badge level strings to SenpaiBadge variants. |
| `ReviewCard` with badge | `listing-detail/components/ReviewCard.tsx:83-88` | Already renders SenpaiBadge based on `userBadgeLevel`. |
| `SenpaiPicksSection` | `home/components/SenpaiPicksSection.tsx` | Horizontal scroll grid with SenpaiPickCard. |
| `SenpaiPickCard` | `home/components/SenpaiPickCard.tsx` | Shows listing photo, verified badge, title, rating. |
| `fetchSenpaiPicks()` | `home/lib/homepage-data.ts:46-67` | Fetches from `GET /listings?is_senpai_verified=true`. 5-min cache. |
| Homepage SSR | `app/(user)/[locale]/page.tsx:80-85` | Calls `fetchSenpaiPicks(6)` with graceful degradation. |
| Listing filter: `is_senpai_verified` | `listing/repository.py:42-46` | Already filters in WHERE clause. |
| Search filter chip "senpai" | `search/components/FilterChips.tsx` | Already in chip bar. |
| Search filter panel checkbox | `search/components/FilterPanel.tsx:168-177` | Already toggles `isSenpaiVerified`. |
| `ListingListItem.is_senpai_verified` | `listing/schemas.py:101` | Boolean field in list response. |
| `ListingSearchItem.senpai_review_snippet` | `listing/schemas.py:118` | String field in search response. |
| `ListingDetailResponse.senpai_review_snippet` | `listing/schemas.py:189` | String field in detail response. |
| BadgeLevel model | `gamification/models.py:32-61` | `user_id`, `level`, `total_points`. |
| Badge thresholds | `gamification/constants.py:34-39` | SENPAI at 500pts, EXPERT_SENPAI at 2000pts. |
| Review list join with BadgeLevel | `review/repository.py:172-178` | Already outer-joins for `user_badge_level`. |
| Event bus | `shared/events.py` | Emit and subscribe pattern established. |
| `review.review.created` event | `review/events.py` | Already emitted on review creation. |
| `gamification.user.badge_upgraded` event | `gamification/events.py` | Already emitted on badge upgrade. |

### Senpai Verification Logic (Backend)

```python
# listing/service.py — update_senpai_status()
async def update_senpai_status(self, listing_id: UUID) -> None:
    # Query: find best senpai review for this listing
    stmt = (
        select(
            Review.body,
            Review.helpful_count,
            Review.created_at,
            User.display_name,
            User.avatar_url,
        )
        .join(User, Review.user_id == User.id)
        .join(BadgeLevel, BadgeLevel.user_id == Review.user_id)
        .where(
            Review.listing_id == listing_id,
            Review.deleted_at.is_(None),
            Review.rating >= 4,
            BadgeLevel.level.in_(["senpai", "expert_senpai"]),
            BadgeLevel.deleted_at.is_(None),
        )
        .order_by(Review.helpful_count.desc(), Review.created_at.desc())
        .limit(1)
    )
    row = (await session.execute(stmt)).first()

    if row:
        listing.is_senpai_verified = True
        listing.senpai_review_snippet = row.body[:120]
        listing.senpai_reviewer_name = row.display_name
        listing.senpai_reviewer_avatar_url = row.avatar_url
    else:
        listing.is_senpai_verified = False
        listing.senpai_review_snippet = None
        listing.senpai_reviewer_name = None
        listing.senpai_reviewer_avatar_url = None
```

### Review Sort Priority (Backend)

```python
# review/repository.py — modify ORDER BY in list_for_listing()
# When sort_by="helpful" (default):
from sqlalchemy import case as sa_case

senpai_priority = sa_case(
    (BadgeLevel.level.in_(["senpai", "expert_senpai"]), 0),
    else_=1,
)
stmt = stmt.order_by(senpai_priority.asc(), Review.helpful_count.desc(), Review.created_at.desc())
```

### SenpaiPickCard Enhancement (Frontend)

```tsx
// SenpaiPickCard.tsx — add reviewer section
{listing.senpaiReviewerName && listing.senpaiReviewSnippet && (
  <div className="flex items-center gap-1.5 mt-1">
    {listing.senpaiReviewerAvatarUrl && (
      <img
        src={listing.senpaiReviewerAvatarUrl}
        alt=""
        className="w-6 h-6 rounded-full object-cover"
      />
    )}
    <p className="text-xs text-text-secondary line-clamp-2 italic">
      「{listing.senpaiReviewSnippet}」— {listing.senpaiReviewerName}
    </p>
  </div>
)}
```

### Senpai Review Badge on ReviewCard (Frontend)

```tsx
// ReviewCard.tsx — add verified badge for senpai+ reviews
// Current: shows rank badge via getBadgeVariant(review.userBadgeLevel)
// Enhancement: additionally show green "先輩認証済み ✓" for senpai+ reviews
const isSenpaiReviewer = review.userBadgeLevel === "senpai" || review.userBadgeLevel === "expert_senpai";

{review.userBadgeLevel && (
  <SenpaiBadge variant={getBadgeVariant(review.userBadgeLevel)} className="px-2 py-0.5 text-[11px]" />
)}
{isSenpaiReviewer && (
  <SenpaiBadge variant="verified" className="px-2 py-0.5 text-[11px]" />
)}
```

### Cross-Module Event Flow

```
review.review.created
  → listing/events.py subscriber
  → listing/service.py update_senpai_status(listing_id)
  → Updates: is_senpai_verified, senpai_review_snippet, senpai_reviewer_name, senpai_reviewer_avatar_url

gamification.user.badge_upgraded
  → listing/events.py subscriber
  → Query user's reviews with rating >= 4.0
  → For each affected listing: update_senpai_status(listing_id)
```

### Anti-Patterns to Avoid

- Do NOT import `review` module or `gamification` module directly in `listing` — use event bus only
- Do NOT query senpai reviewer info at homepage render time via JOINs — use denormalized fields on Listing
- Do NOT create a separate `/senpai-picks` endpoint — reuse existing `GET /listings?is_senpai_verified=true`
- Do NOT hard-code "senpai" or "expert_senpai" strings in frontend — the badge level comes from API
- Do NOT rebuild SenpaiBadge component — it already has the "verified" variant
- Do NOT rebuild FilterChips/FilterPanel senpai filter — already works
- Do NOT use `any` type in TypeScript — use `unknown` + type guards
- Do NOT use relative imports — always `@/`
- Do NOT use spinners — use Skeleton for loading states
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`

### Previous Story Intelligence (Story 4-2)

- **Agent model**: openai/gpt-5.4
- **Key learnings**: ReviewVote toggle + paginated review list with badge JOIN works well. Optimistic updates with rollback pattern for votes. Auth-resume pattern for unauthenticated actions. Event bus for gamification cross-module communication. Atomic SQL operations for counters.
- **Review fixes applied**: Self-voting prevention, IntegrityError handling, route ordering fix, skeleton flash fix, cross-module import fix.
- **Deferred issues**: helpful_count drift (acceptable), badge table join without type info (works), pagination without truncation (low volume).
- **Validation gates**: 352 backend tests, 392 frontend tests. Maintain this baseline.
- **Build commands**: `python -m pytest backend/tests/`, `pnpm --filter web test`, `pnpm --filter web build`, `python -m ruff check backend/`

### Git Intelligence

Recent commits:
- `3bff84e fix: use clearAllMocks instead of restoreAllMocks in JourneyPageShell test`
- `a5d8976 fix: skip celery-dependent test when celery is not installed in CI`
- `18f5a1d fix: replace (str, Enum) with StrEnum to pass ruff UP042 check`
- `b83645c update: add seed listing photos, real placeholder images, and fix media enum`
- `3518229 create: add review system with helpful votes, star ratings, and camera-only photos (stories 4-1, 4-2)`

Commit convention: `create: ...` for new features, `update: ...` for enhancements, `fix: ...` for bugs.

### Project Structure Notes

**New files to create:**
```
backend/migrations/versions/2026_04_25_0001_add_senpai_reviewer_fields.py
```

**Files to modify:**
```
backend/modules/listing/models.py        — add senpai_reviewer_name, senpai_reviewer_avatar_url columns
backend/modules/listing/service.py       — add update_senpai_status() method
backend/modules/listing/events.py        — add subscribers for review.created + badge.upgraded
backend/modules/listing/schemas.py       — add senpai reviewer fields to ListingListItem + ListingDetailResponse
backend/modules/review/repository.py     — modify list_for_listing() sort to prioritize senpai reviews
backend/tests/listing/test_service.py    — add senpai verification tests
backend/tests/review/test_router.py      — add senpai sort order test
backend/scripts/seed_data.py             — update seed to populate senpai verified listings

apps/web/modules/listing-detail/components/ReviewCard.tsx   — add green verified badge for senpai reviews
apps/web/modules/home/lib/types.ts                          — add senpai reviewer fields to SenpaiPickListing
apps/web/modules/home/lib/homepage-data.ts                  — map new senpai reviewer fields
apps/web/modules/home/components/SenpaiPickCard.tsx          — add reviewer avatar, name, quote
apps/web/messages/ja.json                                    — add i18n keys
apps/web/messages/en.json                                    — add i18n keys
apps/web/messages/vi.json                                    — add i18n keys
apps/web/modules/listing-detail/__tests__/ReviewCard.test.tsx        — add senpai badge test
apps/web/modules/home/__tests__/SenpaiPickCard.test.tsx              — add reviewer info test
```

### Validation Gates

Before marking complete, verify ALL pass:
```bash
python -m ruff check backend/                         # Backend lint
python -m pytest backend/tests/                       # All backend tests
pnpm --filter web test                                # All frontend tests
pnpm --filter web lint                                # Frontend lint
pnpm --filter web build                               # Next.js build
```

### References

- [Source: epics/epic-4-reviews-content-creation.md#Story 4.3]
- [Source: prd/functional-requirements.md#FR19] — senpai-badged reviews appear prominently in Senpai Picks
- [Source: architecture/implementation-patterns-consistency-rules.md#Communication Patterns] — event bus pattern
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns] — module structure
- [Source: architecture/project-structure-boundaries.md#Module Boundaries] — module isolation rules
- [Source: listing/models.py] — is_senpai_verified, senpai_review_snippet columns
- [Source: listing/repository.py:42-46] — existing is_senpai_verified filter
- [Source: listing/schemas.py] — ListingListItem, ListingSearchItem, ListingDetailResponse
- [Source: review/repository.py:172-178] — BadgeLevel join in review list query
- [Source: gamification/constants.py:27-39] — badge level types and thresholds
- [Source: gamification/models.py:32-61] — BadgeLevel model
- [Source: shared/components/SenpaiBadge.tsx] — badge variants including "verified"
- [Source: shared/lib/badgeUtils.ts] — getBadgeVariant() mapping
- [Source: home/components/SenpaiPickCard.tsx] — current card without reviewer info
- [Source: home/lib/homepage-data.ts:46-67] — fetchSenpaiPicks() data flow
- [Source: search/components/FilterChips.tsx] — senpai filter chip
- [Source: search/components/FilterPanel.tsx:168-177] — senpai checkbox
- [Source: _bmad-output/implementation-artifacts/4-2-helpful-votes-review-display.md] — previous story intelligence

## Dev Agent Record

### Agent Model Used

claude-opus-4-6

### Debug Log References

- Fixed gamification test `test_badge_upgrade_emits_event` after adding `level` field to badge_upgraded event payload
- Fixed 11 test files with MagicMock(spec=Listing) that needed new senpai_reviewer fields set to None
- FavoriteListItem redundant `senpai_review_snippet` field removed (now inherited from ListingListItem)

### Completion Notes List

- ✅ Backend: `update_senpai_status()` service method with SQL JOIN across Review, User, BadgeLevel tables
- ✅ Backend: Event subscribers for `review.review.created`, `review.review.deleted`, `gamification.user.badge_upgraded`
- ✅ Backend: Review sort priority — senpai reviews appear first in default "helpful" sort
- ✅ Backend: Schema enhancement — senpai reviewer fields on ListingListItem and ListingDetailResponse
- ✅ Backend: Seed data — 3 senpai users with badges + 6 senpai reviews + automatic status calculation
- ✅ Backend: 362 tests pass, ruff clean
- ✅ Frontend: ReviewCard shows green "先輩認証済み ✓" verified badge for senpai+ reviewers
- ✅ Frontend: SenpaiPickCard shows reviewer avatar, name, and quote snippet
- ✅ Frontend: Search filter verified end-to-end (already working from previous stories)
- ✅ Frontend: i18n keys added to ja.json, en.json, vi.json
- ✅ Frontend: 397 tests pass, lint clean, build succeeds

### Change Log

- 2026-04-24: Story 4-3 implemented — all 13 tasks complete

### File List

**New files:**
- backend/migrations/versions/2026_04_25_0001_add_senpai_reviewer_fields.py
- backend/tests/listing/test_events.py
- apps/web/modules/home/__tests__/SenpaiPickCard.test.tsx

**Modified files:**
- backend/modules/listing/models.py — added senpai_reviewer_name, senpai_reviewer_avatar_url columns
- backend/modules/listing/service.py — added update_senpai_status() method
- backend/modules/listing/events.py — added event subscribers for review.created, review.deleted, badge.upgraded + register function
- backend/modules/listing/schemas.py — added senpai reviewer fields to ListingListItem + ListingDetailResponse, removed redundant field from FavoriteListItem
- backend/modules/review/repository.py — added senpai priority sort in list_for_listing()
- backend/modules/gamification/service.py — added level field to badge_upgraded event payload
- backend/main.py — registered listing event subscribers in lifespan
- backend/scripts/seed_data.py — added senpai users, badge levels, senpai reviews, and status update
- backend/tests/listing/test_service.py — added 4 tests for update_senpai_status + added new mock fields
- backend/tests/listing/test_router.py — added new mock fields
- backend/tests/listing/test_router_detail.py — added new mock fields
- backend/tests/listing/test_areas.py — added new mock fields
- backend/tests/listing/test_area_repository.py — added new mock fields
- backend/tests/search/test_router.py — added new mock fields
- backend/tests/search/test_service.py — added new mock fields
- backend/tests/search/test_indexer.py — added new mock fields
- backend/tests/gamification/test_service.py — updated badge_upgraded event payload assertion
- backend/tests/journey/test_service_personality.py — added new mock fields
- backend/tests/journey/test_service_route.py — added new mock fields
- backend/tests/journey/test_service_deals.py — added new mock fields
- backend/tests/coupon/test_coupon_repository.py — added new mock fields
- apps/web/modules/listing-detail/components/ReviewCard.tsx — added green verified badge for senpai+ reviews
- apps/web/modules/home/components/SenpaiPickCard.tsx — added reviewer avatar, name, and quote section
- apps/web/modules/home/lib/types.ts — added senpai reviewer fields to SenpaiPickListing
- apps/web/modules/home/lib/homepage-data.ts — mapped new senpai reviewer fields + updated ApiListingListItem
- apps/web/modules/home/__tests__/SenpaiPicksSection.test.tsx — added new type fields to mock
- apps/web/modules/listing-detail/__tests__/ReviewCard.test.tsx — added 2 tests for verified badge
- apps/web/messages/ja.json — added review.senpai_verified_badge, quote prefix/suffix, home.senpai_picks.senpai_reviewer_says
- apps/web/messages/en.json — added equivalent i18n keys
- apps/web/messages/vi.json — added equivalent i18n keys
