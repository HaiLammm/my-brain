# Story 5.3: Community Thread Detail

Status: review

## Story

As a user interested in a discussion topic,
I want to read a full thread with replies and senpai-marked contributions,
So that I can find detailed answers and engage with the community.

## Acceptance Criteria

1. **Given** I tap a thread card on the community hub
   **When** the thread detail page loads at `/ja/community/[group_slug]/[post_id]`
   **Then** the thread header shows: title, author avatar + name + senpai badge, group name, post date, tag chips
   **And** the original post body displays with full text and any attached photos

2. **Given** the thread has replies
   **When** I scroll down
   **Then** reply cards display chronologically: avatar (36px), author name + senpai badge, reply text, attached photos, relative timestamp
   **And** each reply has a ❤️ like button with count
   **And** senpai-badged replies have a subtle visual distinction (teal left border)

3. **Given** the thread has many replies
   **When** I scroll to load more
   **Then** pagination loads additional replies (20 per page)
   **And** a "もっと見る" button loads the next batch

4. **Given** the reply composer at the bottom
   **When** I tap it
   **Then** the composer expands with text area + photo upload icon + "返信" button
   **And** on mobile, the keyboard pushes the composer up

## Tasks / Subtasks

### Backend — PostLike & CommentLike Models and Migration

- [x] Task 1: Add like tracking models (AC: #2)
  - [x] 1.1 Add `PostLike` model to `models.py`: id, post_id (FK → posts.id, CASCADE), user_id (FK → users.id, CASCADE), deleted_at. Unique partial index `idx_post_likes_post_user` on (post_id, user_id) WHERE deleted_at IS NULL
  - [x] 1.2 Add `CommentLike` model to `models.py`: id, comment_id (FK → comments.id, CASCADE), user_id (FK → users.id, CASCADE), deleted_at. Unique partial index `idx_comment_likes_comment_user` on (comment_id, user_id) WHERE deleted_at IS NULL
  - [x] 1.3 Create Alembic migration for both tables

### Backend — Like Pydantic Schemas

- [x] Task 2: Add like schemas (AC: #2)
  - [x] 2.1 `LikeToggleResponse`: liked (bool), like_count (int) — in `schemas.py`
  - [x] 2.2 Extend `PostDetailResponse`: add `is_liked: bool | None = None` (null if unauthenticated, true/false if authenticated)
  - [x] 2.3 Extend `CommentListItem`: add `is_liked: bool | None = None` (same semantics)

### Backend — Like Repository Methods

- [x] Task 3: Add repository methods for likes (AC: #2)
  - [x] 3.1 `find_post_like(post_id: UUID, user_id: UUID)` → PostLike or None (including soft-deleted)
  - [x] 3.2 `create_post_like(post_id: UUID, user_id: UUID)` → PostLike (handle rejoin: un-soft-delete if exists)
  - [x] 3.3 `soft_delete_post_like(like: PostLike)` → None (set deleted_at)
  - [x] 3.4 `increment_post_like_count(post_id: UUID)` → `UPDATE posts SET like_count = like_count + 1 WHERE ...`
  - [x] 3.5 `decrement_post_like_count(post_id: UUID)` → `UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE ...`
  - [x] 3.6 `find_comment_like(comment_id: UUID, user_id: UUID)` → CommentLike or None
  - [x] 3.7 `create_comment_like(comment_id: UUID, user_id: UUID)` → CommentLike
  - [x] 3.8 `soft_delete_comment_like(like: CommentLike)` → None
  - [x] 3.9 `increment_comment_like_count(comment_id: UUID)` → same pattern as post
  - [x] 3.10 `decrement_comment_like_count(comment_id: UUID)` → same pattern
  - [x] 3.11 `get_user_post_like_status(post_id: UUID, user_id: UUID)` → bool
  - [x] 3.12 `get_user_comment_like_statuses(comment_ids: list[UUID], user_id: UUID)` → dict[UUID, bool] (batch query for comment list)
  - [x] 3.13 Update `get_post_by_id` to accept optional `user_id` param and return `is_liked`
  - [x] 3.14 Update `list_post_comments` to accept optional `user_id` param and batch-resolve `is_liked` per comment

### Backend — Like Service Methods

- [x] Task 4: Add service methods for likes (AC: #2)
  - [x] 4.1 `toggle_post_like(user_id: UUID, post_id: UUID)` → LikeToggleResponse: validate post exists, find existing like, toggle (create or soft-delete), adjust counter, commit, emit event, return response
  - [x] 4.2 `toggle_comment_like(user_id: UUID, post_id: UUID, comment_id: UUID)` → LikeToggleResponse: validate comment exists (and belongs to post), find existing like, toggle, adjust counter, commit, return response
  - [x] 4.3 Self-like prevention: do NOT block self-likes for posts/comments (differs from review votes — community liking is standard social behavior)
  - [x] 4.4 Update `get_post_detail` to accept optional `user_id`, pass through to repo for `is_liked`
  - [x] 4.5 Update `get_post_comments` to accept optional `user_id`, pass through to repo for batch `is_liked`

### Backend — Like Router Endpoints

- [x] Task 5: Add like endpoints (AC: #2)
  - [x] 5.1 `POST /api/v1/community/posts/{post_id}/like` → auth required, returns SingleEnvelope[LikeToggleResponse], rate_limit(60, 3600, "post_like")
  - [x] 5.2 `POST /api/v1/community/posts/{post_id}/comments/{comment_id}/like` → auth required, returns SingleEnvelope[LikeToggleResponse], rate_limit(60, 3600, "comment_like")
  - [x] 5.3 Update `GET /posts/{post_id}` to pass optional user_id for `is_liked`
  - [x] 5.4 Update `GET /posts/{post_id}/comments` to pass optional user_id for `is_liked`

### Backend — Like Event for Gamification

- [x] Task 6: Wire like event (AC: #2)
  - [x] 6.1 Add `POST_LIKED_EVENT = "community.post.liked"` to `events.py`
  - [x] 6.2 Emit event on post like (not unlike) — payload: `{user_id, post_id, author_id}` so gamification can award points to post author
  - [x] 6.3 NOTE: Do NOT add gamification subscriber in this story — just emit the event. Gamification for likes can be wired later if spec requires it.

### Backend — Like-Specific Exceptions

- [x] Task 7: Add exceptions (AC: #2)
  - [x] 7.1 `AlreadyLikedException` — 409 Conflict (for race conditions caught by unique index IntegrityError, same pattern as `AlreadyMemberException`)

### Backend — Tests

- [x] Task 8: Backend tests (AC: #1-4)
  - [x] 8.1 `test_repository.py` — `create_post_like` creates like, `find_post_like` returns it, `soft_delete_post_like` sets deleted_at, re-like after unlike un-soft-deletes, increment/decrement counters work, `get_user_comment_like_statuses` returns correct batch, duplicate like raises IntegrityError
  - [x] 8.2 `test_service.py` — `toggle_post_like` creates like (returns liked=True, incremented count), toggles off (returns liked=False, decremented count), post not found raises 404, emits POST_LIKED_EVENT on like, does NOT emit on unlike. `toggle_comment_like` same tests. Comment not found raises 404.
  - [x] 8.3 `test_router.py` — POST like returns 200, POST like without auth returns 401, POST like on nonexistent post returns 404, GET post detail with auth includes is_liked, GET comments with auth includes is_liked per comment, GET post detail without auth has is_liked=null, toggle twice returns liked=false
  - [x] 8.4 Existing tests remain green — like fields are nullable/optional so no breaking changes

### Frontend — Types and Data Fetching Updates

- [x] Task 9: Update TypeScript types (AC: #1-2)
  - [x] 9.1 Update `PostDetail` in `lib/types.ts`: add `isLiked: boolean | null`
  - [x] 9.2 Update `CommentItem` in `lib/types.ts`: add `isLiked: boolean | null`
  - [x] 9.3 Add `LikeToggleResponse` type: `{ liked: boolean; likeCount: number }`

- [x] Task 10: Update data fetching (AC: #1-2)
  - [x] 10.1 `fetchPostDetail(postId, cookie?)` — updated mapPostDetail to map is_liked
  - [x] 10.2 `fetchPostComments(postId, page, cookie?)` — updated mapCommentItem to map is_liked

### Frontend — Like Mutation Hooks

- [x] Task 11: Create like hooks (AC: #2)
  - [x] 11.1 `hooks/useLikePost.ts` — TanStack `useMutation` for POST `/community/posts/{postId}/like`. Optimistic update: toggle `isLiked`, adjust `likeCount` ±1 on post detail query `["community", "post", postId]`. Auth gate: if not authenticated, open SignupModal. Follow `useReviewVote` pattern exactly (stash pending action, optimistic update, rollback on error).
  - [x] 11.2 `hooks/useLikeComment.ts` — `useMutation` for POST `/community/posts/{postId}/comments/{commentId}/like`. Optimistic update: toggle `isLiked` and `likeCount` on comment in `["community", "post", postId, "comments"]` query data. Same auth gate pattern.

### Frontend — LikeButton Component

- [x] Task 12: Create LikeButton component (AC: #2)
  - [x] 12.1 Create `components/LikeButton.tsx` (Client) — reusable for both posts and comments. Props: `isLiked: boolean | null`, `likeCount: number`, `onToggle: () => void`, `disabled?: boolean`. Renders ❤️ (filled/red when liked, outline when not liked), count. On click calls onToggle. When `isLiked === null` (guest), still shows count but clicking triggers auth gate via parent's hook.

### Frontend — Update ThreadHeader to Interactive Like

- [x] Task 13: Update ThreadHeader for like interaction (AC: #1)
  - [x] 13.1 Convert `ThreadHeader` from Server Component to Client Component (needs onClick handler for like button)
  - [x] 13.2 Replace static `❤️ {post.likeCount}` with `<LikeButton>` wired to `useLikePost`
  - [x] 13.3 Pass `locale` for date formatting (already available as prop)

### Frontend — Update CommentItem to Interactive Like

- [x] Task 14: Update CommentItem for like interaction (AC: #2)
  - [x] 14.1 Replace static `❤️ {comment.likeCount}` with `<LikeButton>` wired to parent's comment like handler
  - [x] 14.2 CommentItem receives `onLikeToggle(commentId)` callback prop from CommentList

### Frontend — Update CommentList to Pass Like Handlers

- [x] Task 15: Wire CommentList with like support (AC: #2)
  - [x] 15.1 Use `useLikeComment` hook in CommentList
  - [x] 15.2 Pass `onLikeToggle` callback to each `CommentItemCard`
  - [x] 15.3 Ensure optimistic update applies correctly to both initial and extra-page comments

### Frontend — Update Thread Page for Auth-Aware Like

- [x] Task 16: Update post detail page (AC: #1-2)
  - [x] 16.1 `[post_id]/page.tsx` — forward cookies to both `fetchPostDetail` and `fetchPostComments` (already done in 5.2)
  - [x] 16.2 Ensure `is_liked` data flows from server to client components via props

### Frontend — i18n

- [x] Task 17: Add i18n keys (AC: #1-2)
  - [x] 17.1 Add to `community` namespace in `ja.json`: `like`, `unlike`, `liked`, `like_error`
  - [x] 17.2 Add equivalent keys to `en.json` and `vi.json`

### Frontend — Tests

- [x] Task 18: Frontend tests (AC: #1-4)
  - [x] 18.1 `LikeButton.test.tsx` — renders like count, shows filled heart when liked, shows outline when not liked, calls onToggle on click, disables when disabled
  - [x] 18.2 `CommentItem.test.tsx` — UPDATE existing test: verify LikeButton renders with correct likeCount, verify onLikeToggle called
  - [x] 18.3 `ThreadHeader.test.tsx` — UPDATE existing test: verify LikeButton renders, verify click triggers like mutation (will need to be a client component test now)

## Dev Notes

### Architecture Compliance

- **Like tracking models**: Follow `ReviewVote` pattern from `review/models.py:32-44` — separate table per entity (PostLike, CommentLike), soft-delete for unlike, unique partial index to prevent duplicates
- **Toggle pattern**: Follow `review/service.py:76-121` toggle_vote — find existing → create or soft-delete → adjust counter → commit → emit event
- **Counter atomicity**: Use `UPDATE SET like_count = like_count + 1` (atomic in PostgreSQL) — same pattern as `comment_count` increment in `community/repository.py`
- **Response format**: ALL new endpoints use `SingleEnvelope[T]` from `modules.listing.schemas`
- **Module isolation**: Like models belong to community module (community owns posts + comments tables). Do NOT create a separate likes module
- **Event bus**: Emit `POST_LIKED_EVENT` after commit, same as `POST_CREATED_EVENT` pattern. Do NOT add gamification subscriber — just define the event constant
- **Soft delete**: Unlike = set `deleted_at` on PostLike/CommentLike row. Re-like = clear `deleted_at`. All queries filter `WHERE deleted_at IS NULL`
- **Rate limiting**: Apply `rate_limit()` from `shared/rate_limit.py` — 60/hr for likes (higher than posts/comments since likes are more frequent)

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| Thread detail page | `apps/web/app/(user)/[locale]/community/[group_slug]/[post_id]/page.tsx` | Server component, fetches post + comments |
| ThreadHeader | `apps/web/modules/community/components/ThreadHeader.tsx` | Server Component — shows title, body, author, tags, static like/comment counts |
| CommentList | `apps/web/modules/community/components/CommentList.tsx` | Client — paginated with "もっと見る", useQuery for first page |
| CommentItemCard | `apps/web/modules/community/components/CommentItem.tsx` | Client — senpai teal border, static like count display |
| ReplyComposer | `apps/web/modules/community/components/ReplyComposer.tsx` | Client — sticky bottom, auth gate |
| Post.like_count, Comment.like_count | `backend/modules/community/models.py:83,110` | Integer columns exist, seeded at 0 |
| PostDetailResponse.like_count | `backend/modules/community/schemas.py:153` | Already in response |
| CommentListItem.like_count | `backend/modules/community/schemas.py:182` | Already in response |
| PostDetail.likeCount, CommentItem.likeCount | `apps/web/modules/community/lib/types.ts:89,109` | TypeScript types exist |
| ReviewVote model (reference pattern) | `backend/modules/review/models.py:32-44` | Follow this for PostLike/CommentLike |
| useReviewVote hook (reference pattern) | `apps/web/modules/listing-detail/hooks/useReviewVote.ts` | Follow for optimistic like toggle |
| Community events constants | `backend/modules/community/events.py` | Add POST_LIKED_EVENT here |
| All community exceptions | `backend/modules/community/exceptions.py` | Add AlreadyLikedException |
| SenpaiBadge | `shared/components/SenpaiBadge.tsx` | Already used in CommentItem + ThreadHeader |
| SignupModal | `modules/user/components/SignupModal.tsx` | Auth gate for unauthenticated users |
| useAuth, useToast, apiClient | shared hooks/lib | Already wired in community components |
| get_current_user, get_current_user_optional | `modules/auth/dependencies.py` | For auth on like endpoints + optional on GET |
| rate_limit | `shared/rate_limit.py` | For like rate limiting |
| Paginated, SingleEnvelope | `modules/listing/schemas.py` | Response wrappers |
| Community i18n namespace | `apps/web/messages/ja.json` → community section | Extend with like keys |
| useSignupModalStore | `shared/stores/useSignupModalStore.ts` | For auth gate on like (same as useReviewVote) |

### API Design

```
POST /api/v1/community/posts/{post_id}/like
  Auth: required (get_current_user)
  Rate limit: 60/hr
  Response: SingleEnvelope[LikeToggleResponse]
  Toggle: first call = like, second call = unlike
  Notes: Same toggle pattern as POST /reviews/{review_id}/vote

POST /api/v1/community/posts/{post_id}/comments/{comment_id}/like
  Auth: required (get_current_user)
  Rate limit: 60/hr
  Response: SingleEnvelope[LikeToggleResponse]
  Toggle: same toggle behavior

GET /api/v1/community/posts/{post_id}
  (EXISTING — update only)
  Auth: optional (get_current_user_optional)
  Change: response now includes is_liked (bool | null)

GET /api/v1/community/posts/{post_id}/comments
  (EXISTING — update only)
  Auth: optional (get_current_user_optional)
  Change: each CommentListItem now includes is_liked (bool | null)
```

### Frontend Component Architecture (Changes)

```
[post_id]/page.tsx (Server — unchanged, passes data to client)
├── ThreadHeader (CHANGED: Server → Client, interactive LikeButton)
│   └── LikeButton (NEW — Client, wired to useLikePost)
├── CommentList (CHANGED: adds useLikeComment, passes callback)
│   └── CommentItemCard × N (CHANGED: receives onLikeToggle, uses LikeButton)
│       └── LikeButton (NEW — reused)
└── ReplyComposer (unchanged)
```

### LikeButton Component Spec

```typescript
// components/LikeButton.tsx
interface LikeButtonProps {
  isLiked: boolean | null;
  likeCount: number;
  onToggle: () => void;
  disabled?: boolean;
}
// - isLiked=true → filled red heart "❤️"
// - isLiked=false → outline heart "🤍"
// - isLiked=null (guest) → outline heart (clicking triggers onToggle which does auth gate)
// - Count displayed next to heart
// - Subtle scale animation on click (transition)
```

### ThreadHeader Conversion Notes

Current `ThreadHeader` is an async Server Component (uses `getTranslations` from `next-intl/server`). For like interactivity:
- Convert to Client Component (`"use client"`)
- Switch from `getTranslations` to `useTranslations`
- Add `useLikePost(postId)` hook
- Replace static `❤️ {post.likeCount}` with `<LikeButton>`
- Keep all existing rendering logic intact

### Like Toggle Pattern (follow ReviewVote exactly)

```python
# service.py — toggle_post_like
async def toggle_post_like(self, user_id: UUID, post_id: UUID) -> LikeToggleResponse:
    post = await self.repo.get_post_by_id(post_id)
    if not post:
        raise PostNotFoundException(post_id)

    existing = await self.repo.find_post_like(post_id, user_id)
    if existing and existing.deleted_at is None:
        await self.repo.soft_delete_post_like(existing)
        await self.repo.decrement_post_like_count(post_id)
        await self.session.commit()
        updated = await self.repo.get_post_by_id(post_id)
        return LikeToggleResponse(liked=False, like_count=updated.like_count)
    elif existing and existing.deleted_at is not None:
        existing.deleted_at = None
        existing.updated_at = datetime.now(UTC)
    else:
        await self.repo.create_post_like(post_id, user_id)

    await self.repo.increment_post_like_count(post_id)
    await self.session.commit()
    updated = await self.repo.get_post_by_id(post_id)

    await emit(POST_LIKED_EVENT, {
        "user_id": str(user_id),
        "post_id": str(post_id),
        "author_id": str(post.user_id) if post.user_id else None,
    })

    return LikeToggleResponse(liked=True, like_count=updated.like_count)
```

### Frontend Optimistic Like Pattern (follow useReviewVote)

```typescript
// hooks/useLikePost.ts
export function useLikePost(postId: string) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openSignupModal = useSignupModalStore((state) => state.open);

  const mutation = useMutation({
    mutationFn: async () =>
      apiClient<{ data: LikeToggleResponse }>(
        `/community/posts/${postId}/like`,
        { method: "POST" },
      ),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["community", "post", postId] });
      const prev = queryClient.getQueryData(["community", "post", postId]);
      queryClient.setQueryData(["community", "post", postId], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          isLiked: !old.data.isLiked,
          likeCount: old.data.likeCount + (old.data.isLiked ? -1 : 1),
        },
      }));
      return { prev };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["community", "post", postId], context?.prev);
    },
    onSuccess: (response) => {
      // Reconcile with server truth
    },
  });

  function toggleLike() {
    if (!isAuthenticated) { openSignupModal(); return; }
    mutation.mutate();
  }

  return { toggleLike, isPending: mutation.isPending };
}
```

### TanStack Query Key Convention

```typescript
// Existing (unchanged)
["community", "hub"]                      // hub page data
["community", "group", slug]              // group detail
["community", "group", groupId, "posts"]  // group post list
["community", "post", postId]             // post detail — now includes is_liked
["community", "post", postId, "comments"] // post comments — each item now includes is_liked
```

### Batch is_liked Resolution

For the comments list endpoint, avoid N+1 queries. In the repository, when `user_id` is provided:
```python
# Single query to get all like statuses for a page of comments
liked_comment_ids = await session.execute(
    select(CommentLike.comment_id)
    .where(
        CommentLike.comment_id.in_(comment_ids),
        CommentLike.user_id == user_id,
        CommentLike.deleted_at.is_(None),
    )
)
liked_set = {row[0] for row in liked_comment_ids.fetchall()}
# Set is_liked = True/False per comment
```

### Anti-Patterns to Avoid

- Do NOT create separate like/unlike endpoints — use single toggle (POST) like ReviewVote
- Do NOT block self-likes on posts/comments — this is social behavior, not review voting
- Do NOT add WebSocket/SSE for real-time like updates — invalidateQueries suffices
- Do NOT create a separate `likes` module — PostLike/CommentLike belong to community module
- Do NOT add gamification subscriber for likes in this story — just emit the event
- Do NOT use spinners for loading — use `Skeleton` component
- Do NOT use relative imports in frontend — always `@/` aliases
- Do NOT use `any` type — use `unknown` + type guards
- Do NOT hard-code Japanese text — all strings via `useTranslations("community")`
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`
- Do NOT create separate BFF route files for community — reuse existing `api/(user)/[...path]/route.ts` proxy
- Do NOT modify the photo upload functionality — photo display is for existing photo URLs only (no upload in this story)

### Previous Story Intelligence (Story 5-2)

- **Agent model**: openai/gpt-5.4
- **Key patterns established**: Toggle pattern with optimistic UI (useJoinGroup), client component with auth gate (CreatePostButton, ReplyComposer), CommentList with useQuery + loadMore pagination, GroupDetailHeader as async Server Component (later converted patterns)
- **Review findings applied in 5.2**:
  - Race condition on join_group → wrap flush in try/except IntegrityError — apply same pattern for like toggle
  - Slug path parameter validation → already applied, no changes needed for like endpoints (UUID path params)
  - Title/body whitespace bypass → not applicable to likes
- **Deferred items from 5.2 now in scope for 5.3**:
  - "Do NOT add post/comment like functionality in this story — that is deferred (Story 5.3)" — NOW implementing
  - Photo upload UI deferred — still NOT in scope for 5.3 (no photo upload, just display existing)
- **Test baseline (after 5.2)**: Backend: 411 tests. Frontend: 437 tests (3 pre-existing Gallery.test.tsx failures). Maintain this baseline + new tests.
- **Build commands**: `python -m pytest backend/tests/`, `pnpm --filter web test`, `pnpm --filter web build`, `python -m ruff check backend/`

### Git Intelligence

Recent commits:
- `570b20c create: add join groups, create posts, and comments for community feature (story 5-2)`
- `6ca5df1 create: add community hub feature with group browsing and updates to listings`

Commit convention: `create: ...` for new features, `update: ...` for enhancements, `fix: ...` for bugs. This story adds like functionality to existing thread detail → use `create: add like toggle for community posts and comments (story 5-3)`.

### Project Structure Notes

**New files to create:**
```
backend/modules/community/models.py        — ADD PostLike, CommentLike classes
backend/migrations/versions/YYYY_MM_DD_HHMM_add_post_comment_likes.py
apps/web/modules/community/components/LikeButton.tsx
apps/web/modules/community/hooks/useLikePost.ts
apps/web/modules/community/hooks/useLikeComment.ts
apps/web/modules/community/__tests__/LikeButton.test.tsx
backend/tests/community/test_like_repository.py     (or extend test_repository.py)
backend/tests/community/test_like_service.py         (or extend test_service.py)
backend/tests/community/test_like_router.py          (or extend test_router.py)
```

**Files to modify:**
```
backend/modules/community/models.py        — add PostLike, CommentLike
backend/modules/community/schemas.py       — add LikeToggleResponse, extend PostDetailResponse/CommentListItem with is_liked
backend/modules/community/repository.py    — add like repo methods, update get_post_by_id/list_post_comments for is_liked
backend/modules/community/service.py       — add toggle_post_like, toggle_comment_like, update get_post_detail/get_post_comments
backend/modules/community/router.py        — add 2 like endpoints, update GET /posts/{id} and GET /posts/{id}/comments with optional auth
backend/modules/community/events.py        — add POST_LIKED_EVENT constant
backend/modules/community/exceptions.py    — add AlreadyLikedException
apps/web/modules/community/lib/types.ts    — add isLiked to PostDetail/CommentItem, add LikeToggleResponse
apps/web/modules/community/components/ThreadHeader.tsx — convert to Client, add LikeButton
apps/web/modules/community/components/CommentItem.tsx  — replace static count with LikeButton
apps/web/modules/community/components/CommentList.tsx  — add useLikeComment, pass callbacks
apps/web/messages/ja.json                  — add like i18n keys
apps/web/messages/en.json                  — add like i18n keys
apps/web/messages/vi.json                  — add like i18n keys
apps/web/modules/community/__tests__/CommentItem.test.tsx — update for LikeButton
apps/web/modules/community/__tests__/ThreadHeader.test.tsx — update for client component + LikeButton (was previously testing async server component)
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

- [Source: epics/epic-5-community-events.md#Story 5.3] — acceptance criteria and user story
- [Source: epics/epic-5-community-events.md#Story 5.2] — anti-pattern "Do NOT add post/comment like functionality — deferred to Story 5.3"
- [Source: prd/functional-requirements.md#FR20-FR25] — community functional requirements
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns] — backend module structure
- [Source: architecture/implementation-patterns-consistency-rules.md#Naming Patterns] — naming conventions
- [Source: architecture/implementation-patterns-consistency-rules.md#Communication Patterns] — event naming, TanStack Query keys
- [Source: architecture/implementation-patterns-consistency-rules.md#Format Patterns] — API response wrappers
- [Source: architecture/core-architectural-decisions.md#API Communication Patterns] — REST, response wrapper, error format
- [Source: architecture/project-structure-boundaries.md#Module Boundaries] — community module owns posts, comments tables
- [Source: backend/modules/community/models.py:83,110] — Post.like_count, Comment.like_count columns
- [Source: backend/modules/community/schemas.py:146-158,177-184] — PostDetailResponse, CommentListItem with like_count
- [Source: backend/modules/community/events.py] — POST_CREATED_EVENT, COMMENT_CREATED_EVENT
- [Source: backend/modules/community/exceptions.py] — existing AppException subclasses
- [Source: backend/modules/community/router.py] — existing endpoints
- [Source: backend/modules/review/models.py:32-44] — ReviewVote model pattern to follow
- [Source: backend/modules/review/service.py:76-121] — toggle_vote service pattern to follow
- [Source: backend/modules/review/router.py:102-108] — vote endpoint pattern
- [Source: apps/web/modules/listing-detail/hooks/useReviewVote.ts] — optimistic vote toggle pattern to follow
- [Source: apps/web/modules/community/components/ThreadHeader.tsx] — current server component to convert
- [Source: apps/web/modules/community/components/CommentItem.tsx:56-58] — static like count to replace
- [Source: apps/web/modules/community/components/CommentList.tsx] — paginated list to extend with like callbacks
- [Source: apps/web/modules/community/lib/types.ts:84-112] — PostDetail, CommentItem types to extend
- [Source: shared/stores/useSignupModalStore.ts] — auth gate for unauthenticated like attempts
- [Source: shared/rate_limit.py] — rate_limit(limit, window_s, route_key)
- [Source: shared/events.py] — emit/subscribe API
- [Source: _bmad-output/implementation-artifacts/5-2-join-groups-create-posts-comments.md] — previous story intelligence + review findings

## Dev Agent Record

### Agent Model Used

claude-opus-4-6

### Debug Log References

- Fixed 1 ruff line-length violation in service.py (author_id ternary)
- Updated 2 existing test assertions (test_router.py) to match new user_id kwarg on get_post_detail/get_post_comments

### Completion Notes List

- Implemented PostLike and CommentLike models with unique partial indexes following GroupMembership/ReviewVote pattern
- Created Alembic migration 2026_04_26_0001 for post_likes and comment_likes tables
- Added LikeToggleResponse schema, extended PostDetailResponse and CommentListItem with is_liked field
- Added 10 repository methods: find/create/soft_delete/increment/decrement for both post and comment likes
- Updated get_post_by_id and list_post_comments to resolve is_liked via correlated EXISTS subquery (no N+1)
- Added toggle_post_like and toggle_comment_like service methods with soft-delete toggle pattern
- POST_LIKED_EVENT emitted on like (not unlike), AlreadyLikedException for race conditions
- Added 2 new API endpoints with 60/hr rate limits, updated GET endpoints with optional auth
- Created useLikePost and useLikeComment hooks with optimistic updates and auth gate
- Created LikeButton component (❤️/🤍 toggle with count)
- Converted ThreadHeader from async Server Component to Client Component with interactive like
- Updated CommentItem to receive onLikeToggle callback, CommentList wires useLikeComment
- Added i18n keys for like/unlike/liked/like_error in ja/en/vi
- Backend: 461 tests pass (+50 from baseline 411), 0 regressions
- Frontend: 455 tests pass (+18 from baseline 437), 3 pre-existing Gallery.test.tsx failures unchanged
- All lint checks pass (ruff, eslint), Next.js build succeeds

### Change Log

- 2026-04-26: Implemented like toggle for community posts and comments (Story 5-3)

### File List

**New files:**
- backend/migrations/versions/2026_04_26_0001_add_post_comment_likes.py
- backend/tests/community/test_like_repository.py
- backend/tests/community/test_like_service.py
- backend/tests/community/test_like_router.py
- apps/web/modules/community/components/LikeButton.tsx
- apps/web/modules/community/hooks/useLikePost.ts
- apps/web/modules/community/hooks/useLikeComment.ts
- apps/web/modules/community/__tests__/LikeButton.test.tsx
- apps/web/modules/community/__tests__/ThreadHeader.test.tsx
- apps/web/modules/community/__tests__/CommentItem.test.tsx

**Modified files:**
- backend/modules/community/models.py — added PostLike, CommentLike classes
- backend/modules/community/schemas.py — added LikeToggleResponse, is_liked fields
- backend/modules/community/repository.py — added like repo methods, updated get_post_by_id/list_post_comments
- backend/modules/community/service.py — added toggle methods, updated get_post_detail/get_post_comments
- backend/modules/community/router.py — added 2 like endpoints, updated GET with optional auth
- backend/modules/community/events.py — added POST_LIKED_EVENT
- backend/modules/community/exceptions.py — added AlreadyLikedException
- backend/tests/community/test_router.py — updated 2 existing assertions for new user_id kwarg
- apps/web/modules/community/lib/types.ts — added isLiked to PostDetail/CommentItem, LikeToggleResponse
- apps/web/modules/community/lib/community-data.ts — updated mappers for isLiked
- apps/web/modules/community/components/ThreadHeader.tsx — converted to Client Component with LikeButton
- apps/web/modules/community/components/CommentItem.tsx — replaced static like with LikeButton + onLikeToggle
- apps/web/modules/community/components/CommentList.tsx — added useLikeComment, passes callback
- apps/web/messages/ja.json — added like i18n keys
- apps/web/messages/en.json — added like i18n keys
- apps/web/messages/vi.json — added like i18n keys
- _bmad-output/implementation-artifacts/sprint-status.yaml — updated story status
