# Story 4.2: Helpful Votes & Review Display

Status: done

## Story

As a user reading reviews on a listing,
I want to mark reviews as helpful and see the most useful reviews first,
So that the best reviews are easy to find and reviewers are encouraged to write quality content.

## Acceptance Criteria

1. **Given** I am viewing reviews on a listing detail page (FR18)
   **When** I see a review card
   **Then** a "参考になった" (Helpful) button displays with current helpful vote count
   **And** tapping it increments the count and the button fills (toggle)
   **And** tapping again removes my vote

2. **Given** I am not logged in and tap "参考になった"
   **When** the auth check triggers
   **Then** the signup modal appears, and after login, the vote is applied

3. **Given** the reviews section on listing detail
   **When** reviews are loaded
   **Then** reviews are sorted by helpfulness (most helpful first) by default
   **And** the top review is highlighted with a "最も参考になった" (Most Helpful) badge
   **And** a star breakdown summary shows: count per star level (already exists from Story 4.1)

4. **Given** a helpful vote is cast
   **When** the vote is processed
   **Then** the API endpoint `POST /api/v1/reviews/{review_id}/vote` records the vote
   **And** a `review.review.voted_helpful` event fires (triggers gamification points for the reviewer)

5. **Given** I have already voted on a review
   **When** I view that review again
   **Then** the helpful button shows as filled/active, indicating I already voted

6. **Given** the listing detail page
   **When** reviews are displayed
   **Then** all reviews for the listing are shown (paginated, 10 per page)
   **And** each review card shows: user avatar, display name, senpai badge, star rating, body text, photos, helpful count, and relative time

## Tasks / Subtasks

### Backend — Vote Repository & Service

- [x] Task 1: Vote repository methods (AC: #1, #4, #5)
  - [x] 1.1 Add `find_vote(review_id: UUID, user_id: UUID) -> ReviewVote | None` to `review/repository.py` — query `review_votes` WHERE review_id, user_id, vote_type="helpful", deleted_at IS NULL
  - [x] 1.2 Add `create_vote(vote: ReviewVote) -> ReviewVote` to `review/repository.py`
  - [x] 1.3 Add `soft_delete_vote(vote: ReviewVote) -> None` — set `deleted_at = utcnow()`
  - [x] 1.4 Add `increment_helpful_count(review_id: UUID) -> None` — atomic `UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = :review_id`
  - [x] 1.5 Add `decrement_helpful_count(review_id: UUID) -> None` — atomic `UPDATE reviews SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = :review_id`

- [x] Task 2: Vote service method (AC: #1, #4)
  - [x] 2.1 Add `toggle_vote(user_id: UUID, review_id: UUID) -> dict` to `review/service.py`:
    - Verify review exists via `get_by_id`; raise `ReviewNotFoundException` if not found
    - Check existing vote via `find_vote`
    - If vote exists → soft delete vote + decrement count → return `{"voted": False, "helpful_count": updated_count}`
    - If no vote → create vote + increment count + emit `review.review.voted_helpful` event → return `{"voted": True, "helpful_count": updated_count}`

### Backend — Review List Endpoint

- [x] Task 3: Review list schemas (AC: #3, #5, #6)
  - [x] 3.1 Add `ReviewListRequest` query params to `review/schemas.py`: `listing_id` (UUID, required), `page` (int, default 1), `per_page` (int, default 10, max 50), `sort_by` (str, default "helpful" — options: "helpful", "newest", "oldest")
  - [x] 3.2 Add `ReviewListItemResponse` to `review/schemas.py`: `id`, `user_id`, `rating`, `body`, `helpful_count`, `created_at`, `user_display_name`, `user_avatar_url`, `user_badge_level`, `photos` (list[MediaItem]), `user_has_voted` (bool — whether current user voted helpful on this review)
  - [x] 3.3 Add `VoteToggleResponse` to `review/schemas.py`: `voted` (bool), `helpful_count` (int)

- [x] Task 4: Review list repository method (AC: #3, #6)
  - [x] 4.1 Add `list_for_listing(listing_id: UUID, page: int, per_page: int, sort_by: str, current_user_id: UUID | None) -> tuple[list[Row], int]` to `review/repository.py`
    - JOIN reviews → users (for display_name, avatar_url)
    - JOIN reviews → user badge (for badge_level — use `gamification` module's user_points table via SQL join, NOT module import)
    - LEFT JOIN review_votes (for current user's vote status — `user_has_voted`)
    - WHERE listing_id = :listing_id AND reviews.deleted_at IS NULL
    - ORDER BY: "helpful" → helpful_count DESC, created_at DESC; "newest" → created_at DESC; "oldest" → created_at ASC
    - Paginate: OFFSET + LIMIT
    - Return tuple of (rows, total_count) for pagination meta
  - [x] 4.2 Add `get_review_photos(review_ids: list[UUID]) -> dict[UUID, list[MediaItem]]` — batch fetch photos for all reviews in one query via MediaFile table (owner_type=REVIEW)

- [x] Task 5: Review list service method (AC: #3, #6)
  - [x] 5.1 Add `list_reviews(listing_id: UUID, page: int, per_page: int, sort_by: str, current_user_id: UUID | None) -> tuple[list[ReviewListItemResponse], PaginationMeta]` to `review/service.py`
    - Fetch paginated reviews from repository
    - Batch-load photos via `get_review_photos`
    - Assemble ReviewListItemResponse objects
    - Return with pagination meta

### Backend — Router Endpoints

- [x] Task 6: Vote endpoint (AC: #1, #2, #4)
  - [x] 6.1 Add `POST /api/v1/reviews/{review_id}/vote` to `review/router.py` — requires auth, returns `SingleEnvelope[VoteToggleResponse]`
  - [x] 6.2 Rate limit: 30 votes/hour per user

- [x] Task 7: Review list endpoint (AC: #3, #6)
  - [x] 7.1 Add `GET /api/v1/reviews` to `review/router.py` — public endpoint (auth optional for `user_has_voted`)
  - [x] 7.2 Query params: listing_id (required), page, per_page, sort_by
  - [x] 7.3 Returns `ListEnvelope[ReviewListItemResponse]` with pagination meta
  - [x] 7.4 Inject optional current user via `get_optional_current_user` dependency

### Backend — Events

- [x] Task 8: Voted helpful event (AC: #4)
  - [x] 8.1 Add `REVIEW_VOTED_HELPFUL_EVENT = "review.review.voted_helpful"` to `review/events.py`
  - [x] 8.2 Event payload: `{user_id: reviewer's user_id (who receives the point), voter_id: who voted, review_id, listing_id}`
  - [x] 8.3 Add gamification subscriber for `review.review.voted_helpful` in `gamification/events.py` — award points to the review author (NOT the voter). Use existing `ActionType` enum — add `REVIEW_VOTE_RECEIVED` if not exists.

### Backend — Tests

- [x] Task 9: Backend tests (AC: #1-6)
  - [x] 9.1 `tests/review/test_router.py` — test POST /reviews/{id}/vote with auth returns toggled vote
  - [x] 9.2 Test POST /reviews/{id}/vote twice toggles off (removes vote)
  - [x] 9.3 Test POST /reviews/{id}/vote without auth returns 401
  - [x] 9.4 Test POST /reviews/{id}/vote on non-existent review returns 404
  - [x] 9.5 Test GET /reviews?listing_id=X returns paginated reviews sorted by helpful
  - [x] 9.6 Test GET /reviews?listing_id=X&sort_by=newest returns reviews sorted by date
  - [x] 9.7 Test GET /reviews with auth includes user_has_voted=true for voted reviews
  - [x] 9.8 Test GET /reviews without auth has user_has_voted=false for all reviews
  - [x] 9.9 Test POST /reviews/{id}/vote fires review.review.voted_helpful event
  - [x] 9.10 Test helpful_count increments and decrements correctly on toggle

### Frontend — Helpful Vote UI

- [x] Task 10: useReviewVote hook (AC: #1, #2, #5)
  - [x] 10.1 Create `apps/web/modules/listing-detail/hooks/useReviewVote.ts` — TanStack mutation calling `POST /api/v1/reviews/{reviewId}/vote`
  - [x] 10.2 Optimistic update: immediately toggle button fill + count ±1, rollback on error
  - [x] 10.3 On 401: trigger auth modal (use existing auth gate pattern)
  - [x] 10.4 On success: update review list query cache with new helpful_count and user_has_voted

- [x] Task 11: useReviewList hook (AC: #3, #6)
  - [x] 11.1 Create `apps/web/modules/listing-detail/hooks/useReviewList.ts` — TanStack query calling `GET /api/v1/reviews?listing_id=X&page=Y&sort_by=Z`
  - [x] 11.2 Query key: `['review', 'list', listingId, page, sortBy]`
  - [x] 11.3 Paginated: expose `page`, `setPage`, `totalPages`

### Frontend — Review Display Components

- [x] Task 12: HelpfulVoteButton component (AC: #1, #2, #5)
  - [x] 12.1 Create `apps/web/modules/listing-detail/components/HelpfulVoteButton.tsx`
  - [x] 12.2 Props: `{ reviewId: string; helpfulCount: number; userHasVoted: boolean; listingId: string }`
  - [x] 12.3 Display: "参考になった (N)" — icon + count
  - [x] 12.4 Filled/active state when userHasVoted=true
  - [x] 12.5 Calls useReviewVote on click; if not logged in, auth modal first

- [x] Task 13: ReviewCard component (AC: #6)
  - [x] 13.1 Create `apps/web/modules/listing-detail/components/ReviewCard.tsx`
  - [x] 13.2 Props: ReviewListItemResponse type (id, rating, body, helpfulCount, userHasVoted, userDisplayName, userAvatarUrl, userBadgeLevel, photos, createdAt)
  - [x] 13.3 Layout: avatar + name + badge | star rating | body text | photo thumbnails | helpful vote button | relative time
  - [x] 13.4 If review is the top review (index 0 + sort_by=helpful), show "最も参考になった" badge

- [x] Task 14: ReviewList component with sorting & pagination (AC: #3, #6)
  - [x] 14.1 Create `apps/web/modules/listing-detail/components/ReviewList.tsx`
  - [x] 14.2 Sort tabs: "参考になった順" (helpful, default), "新しい順" (newest), "古い順" (oldest)
  - [x] 14.3 Render ReviewCard for each review
  - [x] 14.4 Pagination: "もっと見る" (Load More) button or page numbers
  - [x] 14.5 Skeleton loading state while fetching
  - [x] 14.6 Empty state: "まだレビューはありません" when no reviews

- [x] Task 15: Wire ReviewList into ReviewsSection (AC: #3, #6)
  - [x] 15.1 Update `ReviewsSection.tsx`: keep star breakdown histogram at top
  - [x] 15.2 Replace featured review with full ReviewList component
  - [x] 15.3 Remove "See all reviews" disabled link (ReviewList now shows all reviews inline)

### Frontend — i18n

- [x] Task 16: i18n keys (AC: #1, #3, #6)
  - [x] 16.1 Add to `ja.json` review namespace: `helpful_button`, `helpful_count`, `most_helpful_badge`, `sort_helpful`, `sort_newest`, `sort_oldest`, `load_more`, `no_reviews`, `reviews_title`, `vote_error`
  - [x] 16.2 Add equivalent keys in `en.json` and `vi.json`

### Frontend — Tests

- [x] Task 17: Frontend tests (AC: #1, #3, #6)
  - [x] 17.1 `modules/listing-detail/__tests__/HelpfulVoteButton.test.tsx` — render with count, click toggles filled state
  - [x] 17.2 `modules/listing-detail/__tests__/ReviewCard.test.tsx` — render with all fields, senpai badge shows
  - [x] 17.3 `modules/listing-detail/__tests__/ReviewList.test.tsx` — render with sort tabs, skeleton loading state

## Dev Notes

### Architecture Compliance

- **Extend existing module**: `backend/modules/review/` already has models, repository, schemas, router, service, events, exceptions from Story 4-1. Add to these files — do NOT create new module files.
- **Module isolation**: Do NOT import gamification module directly. Use event bus (`review.review.voted_helpful`) for cross-module side effects. For badge_level in review list, use SQL JOIN through `user_points` table — acceptable since it's a read-only SQL join, not a Python module import.
- **Atomic operations**: helpful_count increment/decrement MUST be atomic SQL (`SET helpful_count = helpful_count + 1`) — NOT read-modify-write pattern.
- **Soft delete for votes**: Use `deleted_at` timestamp pattern. Toggle = soft-delete existing vote or create new one. Never hard-delete.

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| ReviewVote model | `backend/modules/review/models.py` | Has: review_id, user_id, vote_type, created_at, deleted_at. Created in Story 4-1 migration. |
| Review model with helpful_count | `backend/modules/review/models.py` | Has: helpful_count (Integer, default=0). Already updated atomically on review creation. |
| ReviewVote DB table | `backend/migrations/versions/2026_04_24_0002_...` | Table exists with unique partial index on (review_id, user_id) WHERE deleted_at IS NULL. |
| Review create endpoint | `POST /api/v1/reviews` | Working. Story 4-1. |
| Review photo upload | `POST /api/v1/reviews/photos` | Working. Story 4-1. |
| ReviewsSection (frontend) | `apps/web/modules/listing-detail/components/ReviewsSection.tsx` | Shows star breakdown histogram, featured review, total count, WriteReviewButton. Modify to include full review list. |
| Star breakdown histogram | ReviewsSection.tsx | Already renders ⭐5→⭐1 bar chart. Keep as-is. |
| Featured review display | ReviewsSection.tsx | Currently shows top review by helpful_count. Replace with full ReviewList. |
| ReviewItemResponse schema | `backend/modules/review/schemas.py` | Has: id, user_id, rating, body, helpful_count, created_at, user_display_name, user_avatar_url, user_badge_level, photos. Extend with user_has_voted field. |
| Auth gate pattern | Existing pattern in listing detail | Signup modal trigger. Reuse for vote auth gating. |
| Event bus | `backend/shared/events.py` or equivalent | Pattern established. Emit events, gamification subscribes. |
| Gamification events subscriber | `backend/modules/gamification/events.py` | Already subscribes to `review.review.created`. Add subscription for `review.review.voted_helpful`. |
| Toast notifications | Existing toast system | Reuse for vote error feedback. |
| Listing detail query | `['listing', 'detail', listingId]` | Already cached by TanStack. ReviewList uses separate query key. |
| apiClient | `apps/web/shared/lib/apiClient.ts` | Supports all HTTP methods. Handles snake_case↔camelCase auto-transform. |
| `get_optional_current_user` | `backend/modules/auth/dependencies.py` | Returns user if valid JWT cookie present, None otherwise. Use for optional auth on GET /reviews. |

### Vote Toggle Logic (Backend)

```python
async def toggle_vote(self, user_id: UUID, review_id: UUID) -> dict:
    review = await self.repo.get_by_id(review_id)
    if not review:
        raise ReviewNotFoundException(str(review_id))

    existing_vote = await self.repo.find_vote(review_id, user_id)
    if existing_vote:
        await self.repo.soft_delete_vote(existing_vote)
        await self.repo.decrement_helpful_count(review_id)
        return {"voted": False, "helpful_count": review.helpful_count - 1}
    else:
        vote = ReviewVote(review_id=review_id, user_id=user_id, vote_type="helpful")
        await self.repo.create_vote(vote)
        await self.repo.increment_helpful_count(review_id)
        emit_event("review.review.voted_helpful", {
            "user_id": str(review.user_id),  # reviewer gets the point
            "voter_id": str(user_id),
            "review_id": str(review_id),
            "listing_id": str(review.listing_id),
        })
        return {"voted": True, "helpful_count": review.helpful_count + 1}
```

### Review List Query (SQL Pattern)

```python
# Join reviews → users → user_points (for badge) + LEFT JOIN review_votes (for user vote status)
stmt = (
    select(
        Review.id, Review.rating, Review.body, Review.helpful_count, Review.created_at,
        User.display_name.label("user_display_name"),
        User.avatar_url.label("user_avatar_url"),
        UserPoints.badge_level.label("user_badge_level"),
        case(
            (ReviewVote.id.isnot(None), True),
            else_=False
        ).label("user_has_voted"),
    )
    .join(User, Review.user_id == User.id, isouter=True)
    .outerjoin(UserPoints, UserPoints.user_id == Review.user_id)
    .outerjoin(
        ReviewVote,
        and_(
            ReviewVote.review_id == Review.id,
            ReviewVote.user_id == bindparam("current_user_id"),
            ReviewVote.vote_type == "helpful",
            ReviewVote.deleted_at.is_(None),
        )
    )
    .where(Review.listing_id == listing_id, Review.deleted_at.is_(None))
)
```

### Optimistic Vote Update (Frontend)

```typescript
// useReviewVote.ts — optimistic update pattern
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (reviewId: string) => apiClient.post(`/api/v1/reviews/${reviewId}/vote`),
  onMutate: async (reviewId) => {
    await queryClient.cancelQueries({ queryKey: ['review', 'list', listingId] });
    const previous = queryClient.getQueryData(['review', 'list', listingId, page, sortBy]);
    // Optimistically toggle the vote
    queryClient.setQueryData(['review', 'list', listingId, page, sortBy], (old) => ({
      ...old,
      data: old.data.map(r =>
        r.id === reviewId
          ? { ...r, userHasVoted: !r.userHasVoted, helpfulCount: r.helpfulCount + (r.userHasVoted ? -1 : 1) }
          : r
      ),
    }));
    return { previous };
  },
  onError: (err, reviewId, context) => {
    queryClient.setQueryData(['review', 'list', listingId, page, sortBy], context.previous);
    // Show error toast
  },
});
```

### Frontend Component Hierarchy

```
ReviewsSection.tsx (existing — modified)
├── StarBreakdownHistogram (existing — keep as-is)
├── WriteReviewButton (existing — keep as-is)
└── ReviewList.tsx (NEW)
    ├── SortTabs: "参考になった順" | "新しい順" | "古い順"
    ├── ReviewCard.tsx (NEW) × N
    │   ├── User avatar + name + senpai badge
    │   ├── Star rating display (read-only)
    │   ├── Body text
    │   ├── Photo thumbnails
    │   ├── HelpfulVoteButton.tsx (NEW)
    │   └── Relative time ("3日前")
    ├── "最も参考になった" badge (on first card when sort=helpful)
    └── Pagination / Load More
```

### TanStack Query Keys

- Review list: `['review', 'list', listingId, page, sortBy]`
- Vote mutation: `['review', 'vote']`
- Invalidation on vote success: optimistic update (no full refetch needed)
- Invalidation on review create: `['review', 'list', listingId]` (prefixed invalidation)

### Anti-Patterns to Avoid

- Do NOT read-modify-write `helpful_count` — use atomic SQL increment/decrement
- Do NOT hard-delete votes — use soft delete (deleted_at) for audit trail
- Do NOT import gamification module in review service — use event bus
- Do NOT create a separate page for reviews — render inline in listing detail
- Do NOT fetch user vote status with separate API call per review — include in list query via LEFT JOIN
- Do NOT use `any` type in TypeScript
- Do NOT hardcode Japanese strings — all via `useTranslations()`
- Do NOT use relative imports in frontend — always `@/`
- Do NOT use spinners — use Skeleton for loading states
- Do NOT use `os.getenv()` — use `shared.config.settings`
- Do NOT rebuild star breakdown histogram — it already works
- Do NOT rebuild WriteReviewButton — it already works from Story 4-1
- Do NOT create new module files — extend existing review module files

### Previous Story Intelligence (Story 4-1)

- **Agent model used**: claude-opus-4-6
- **Key learnings**: ReviewVote model + migration already done. Atomic SQL for rating_avg/review_count works well — use same pattern for helpful_count. i18n keys in separate `review` namespace. Auth gate pattern established in ReviewsSection. Event bus for gamification integration working.
- **Validation gates**: 339 backend tests, 387 frontend tests. Maintain this baseline.
- **Build commands**: `python -m pytest backend/tests/`, `pnpm --filter web test`, `pnpm --filter web build`
- **File patterns**: ReviewForm, ReviewPhotoUpload, StarRatingInput — follow same naming and placement conventions.

### Git Intelligence

Recent commits:
- `3e2b7b5 create story(3-4): expose senpai badge progress for profiles and public consumers`
- `1ad9e22 create: add contribution points gamification engine`
- Commit convention: `create: ...` for new features

### Project Structure Notes

**New files to create:**
```
apps/web/modules/listing-detail/components/HelpfulVoteButton.tsx
apps/web/modules/listing-detail/components/ReviewCard.tsx
apps/web/modules/listing-detail/components/ReviewList.tsx
apps/web/modules/listing-detail/hooks/useReviewVote.ts
apps/web/modules/listing-detail/hooks/useReviewList.ts
apps/web/modules/listing-detail/__tests__/HelpfulVoteButton.test.tsx
apps/web/modules/listing-detail/__tests__/ReviewCard.test.tsx
apps/web/modules/listing-detail/__tests__/ReviewList.test.tsx
```

**Files to modify:**
```
backend/modules/review/repository.py      — add vote CRUD + review list methods
backend/modules/review/service.py         — add toggle_vote + list_reviews methods
backend/modules/review/schemas.py         — add ReviewListItemResponse, VoteToggleResponse, ReviewListRequest
backend/modules/review/router.py          — add POST /reviews/{id}/vote + GET /reviews endpoints
backend/modules/review/events.py          — add REVIEW_VOTED_HELPFUL_EVENT constant
backend/modules/gamification/events.py    — add subscriber for review.review.voted_helpful
apps/web/modules/listing-detail/components/ReviewsSection.tsx — integrate ReviewList, remove featured-only display
apps/web/messages/ja.json                 — add helpful vote + review list i18n keys
apps/web/messages/en.json                 — add helpful vote + review list i18n keys
apps/web/messages/vi.json                 — add helpful vote + review list i18n keys
backend/tests/review/test_router.py       — add vote + list tests
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

- [Source: epics/epic-4-reviews-content-creation.md#Story 4.2]
- [Source: epics/epic-4-reviews-content-creation.md#Story 4.3] — next story context (senpai picks)
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns]
- [Source: architecture/implementation-patterns-consistency-rules.md#Communication Patterns]
- [Source: architecture/implementation-patterns-consistency-rules.md#Format Patterns]
- [Source: prd/functional-requirements.md#FR18] — user can mark review as helpful
- [Source: backend/modules/review/models.py] — Review + ReviewVote models
- [Source: backend/modules/review/repository.py] — existing read methods + write methods from 4-1
- [Source: backend/modules/review/schemas.py] — existing schemas including ReviewItemResponse
- [Source: backend/modules/review/router.py] — existing POST /reviews + POST /reviews/photos
- [Source: backend/modules/review/service.py] — existing ReviewService.create_review
- [Source: backend/modules/review/events.py] — REVIEW_CREATED_EVENT
- [Source: backend/modules/gamification/events.py] — existing review.review.created subscriber
- [Source: apps/web/modules/listing-detail/components/ReviewsSection.tsx] — current review display
- [Source: _bmad-output/implementation-artifacts/4-1-write-review-with-star-rating-camera-only-photos.md] — previous story intelligence

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- `python -m pytest backend/tests/` — 352 passed
- `python -m ruff check backend/` — passed
- `pnpm --filter web test` — 392 passed
- `pnpm --filter web lint` — passed with 1 pre-existing warning in `apps/web/modules/listing-detail/components/ReviewPhotoUpload.tsx`
- `pnpm --filter web build` — passed

### Completion Notes List

- Implemented helpful vote toggle API, public paginated review list API, and gamification event subscription for `review.review.voted_helpful`.
- Added client-side review list/query hooks, optimistic helpful vote updates, auth-resume vote replay after login, and new review card/list/button UI in listing detail.
- Kept the existing star breakdown histogram, replaced featured-only review rendering with inline paginated reviews, and invalidated review-list cache after creating a review.
- Fixed supporting review write-path persistence needed by this story: created reviews now commit and uploaded review photos are rebound to the created review record.
- Added backend router/service coverage and frontend component coverage for helpful votes and review display.

### Review Findings

#### Decision Needed (Resolved)
- [x] [Review][Decision] Gamification points not revoked on un-vote — FIXED: added `REVIEW_VOTE_REMOVED_EVENT` and `revoke_points()` method
- [x] [Review][Decision] badge_levels vs user_points table join — FIXED: replaced raw `table()` with `BadgeLevel` ORM model import (badge_levels is the correct table)

#### Patch (Applied)
- [x] [Review][Patch] Self-voting not prevented — FIXED: added `SelfVoteNotAllowedException` guard in `toggle_vote`
- [x] [Review][Patch] Race condition: IntegrityError not caught in toggle_vote — FIXED: added try/except for `IntegrityError` with graceful recovery
- [x] [Review][Patch] Route ordering: POST /photos matches /{review_id}/vote first — FIXED: moved `/photos` route above `/{review_id}/vote`
- [x] [Review][Patch] AuthProvider pending vote replay: sessionStorage.removeItem before API success — FIXED: moved removeItem to after successful API call
- [x] [Review][Patch] Skeleton flash on refetch — FIXED: use `isLoading` only for skeleton; `isFetching` shows opacity overlay on stale data
- [x] [Review][Patch] Cross-module import breaks isolation pattern — FIXED: replaced import with local constant strings in gamification/events.py
- [x] [Review][Patch] ReviewCreateResponse photos always empty — FIXED: fetch photos after attaching and include in response

#### Deferred
- [x] [Review][Defer] helpful_count can drift from actual vote count — deferred, denormalized counter within transaction is adequate for now
- [x] [Review][Defer] _BADGE_LEVELS raw table() construct without type info — deferred, works with PostgreSQL
- [x] [Review][Defer] Pagination renders all page buttons without truncation — deferred, unlikely to have 100+ reviews per listing at this stage
- [x] [Review][Defer] Duplicate query construction in list_for_listing (anonymous vs authenticated) — deferred, maintenance concern
- [x] [Review][Defer] file.content_type can be None — deferred, fails safely with unclear error message
- [x] [Review][Defer] updated_at not set on vote soft-delete — deferred, depends on BaseModel onupdate behavior
- [x] [Review][Defer] attach_photos_to_review changes owner_id semantics — deferred, architectural concern

### Change Log

- 2026-04-24: Implemented Story 4.2 helpful vote toggle, inline review list display, auth replay, and supporting review persistence fixes.

### File List

- New files:
  - `apps/web/modules/listing-detail/components/HelpfulVoteButton.tsx`
  - `apps/web/modules/listing-detail/components/ReviewCard.tsx`
  - `apps/web/modules/listing-detail/components/ReviewList.tsx`
  - `apps/web/modules/listing-detail/hooks/useReviewList.ts`
  - `apps/web/modules/listing-detail/hooks/useReviewVote.ts`
  - `apps/web/modules/listing-detail/__tests__/HelpfulVoteButton.test.tsx`
  - `apps/web/modules/listing-detail/__tests__/ReviewCard.test.tsx`
  - `apps/web/modules/listing-detail/__tests__/ReviewList.test.tsx`
  - `backend/tests/review/test_service.py`
- Modified files:
  - `apps/web/messages/ja.json`
  - `apps/web/messages/en.json`
  - `apps/web/messages/vi.json`
  - `apps/web/modules/listing-detail/components/ReviewsSection.tsx`
  - `apps/web/modules/listing-detail/hooks/useCreateReview.ts`
  - `apps/web/modules/listing-detail/lib/types.ts`
  - `apps/web/modules/listing-detail/__tests__/ReviewForm.test.tsx`
  - `apps/web/shared/providers/AuthProvider.tsx`
  - `backend/modules/gamification/constants.py`
  - `backend/modules/gamification/events.py`
  - `backend/modules/review/events.py`
  - `backend/modules/review/repository.py`
  - `backend/modules/review/router.py`
  - `backend/modules/review/schemas.py`
  - `backend/modules/review/service.py`
  - `backend/tests/gamification/test_service.py`
  - `backend/tests/review/test_router.py`
