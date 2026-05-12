# Story 5.2: Join Groups & Create Posts/Comments

Status: review

## Story

As a registered user,
I want to join community groups and create posts and comments,
So that I can participate in discussions and connect with other Japanese expats.

## Acceptance Criteria

1. **Given** I am logged in and viewing a community group (FR21)
   **When** I see the group I want to join
   **Then** a "参加する" (Join) button is visible
   **And** tapping it joins me to the group and the button changes to "参加中" (Joined)
   **And** tapping "参加中" shows an option to leave the group

2. **Given** I am a member of a group (FR22)
   **When** I tap "＋ 投稿する" (New Post)
   **Then** a post composer opens with: title field (required), body text area (required), tag selector (optional, max 3), photo upload button (optional)
   **And** submitting creates the post and shows a toast "投稿しました"
   **And** a `community.post.created` event fires on the event bus (triggers gamification + moderation)

3. **Given** I am not a member of a group
   **When** I tap "＋ 投稿する"
   **Then** a prompt asks me to join the group first
   **And** after joining, the post composer opens

4. **Given** I am viewing a thread
   **When** I want to reply
   **Then** a reply composer at the bottom shows: text area, photo upload icon, "返信" (Reply) submit button
   **And** submitting adds my comment to the thread in real-time
   **And** a `community.comment.created` event fires (triggers gamification)

5. **Given** I am not logged in and try to post or comment
   **When** the auth check triggers (FR53)
   **Then** the signup modal appears

## Tasks / Subtasks

### Backend — Group Membership & Post/Comment Write APIs

- [x] Task 1: Add group membership Pydantic schemas (AC: #1)
  - [x] 1.1 `GroupDetailResponse`: id, slug, name_ja, name_vi, name_en, description_ja, description_vi, icon, category, member_count, post_count, is_member (bool, nullable — null if not authenticated)
  - [x] 1.2 `JoinGroupResponse`: group_id, joined_at
  - [x] 1.3 `PostCreateRequest`: group_id (UUID, required), title (str, min=1, max=200), body (str, min=1, max=5000), tag_slugs (list[str], max_length=3, default=[])
  - [x] 1.4 `PostDetailResponse`: id, title, body, tag_slugs, like_count, comment_count, created_at, author (AuthorInfo), group (GroupBriefInfo)
  - [x] 1.5 `PostListItem`: id, title, preview_text (str), tag_slugs, like_count, comment_count, created_at, author (AuthorInfo)
  - [x] 1.6 `CommentCreateRequest`: body (str, min=1, max=2000)
  - [x] 1.7 `CommentListItem`: id, body, like_count, created_at, author (AuthorInfo)
  - [x] 1.8 `AuthorInfo`: id, display_name, avatar_url, badge_level (reuse pattern from `TrendingPostItem`)
  - [x] 1.9 `GroupBriefInfo`: id, slug, name_ja, icon

- [x] Task 2: Add repository methods for write operations (AC: #1-4)
  - [x] 2.1 `get_group_by_slug(slug: str)` → Group or None
  - [x] 2.2 `get_group_by_id(group_id: UUID)` → Group or None
  - [x] 2.3 `is_member(user_id: UUID, group_id: UUID)` → bool
  - [x] 2.4 `join_group(user_id: UUID, group_id: UUID)` → GroupMembership
  - [x] 2.5 `leave_group(user_id: UUID, group_id: UUID)` → None (soft-delete)
  - [x] 2.6 `create_post(group_id: UUID, user_id: UUID, title: str, body: str, tag_slugs: list[str])` → Post
  - [x] 2.7 `create_comment(post_id: UUID, user_id: UUID, body: str)` → Comment (also increment Post.comment_count)
  - [x] 2.8 `get_post_by_id(post_id: UUID)` → Post with author+group info or None
  - [x] 2.9 `list_group_posts(group_id: UUID, page: int, per_page: int)` → list[Post] with author info, ordered by created_at DESC
  - [x] 2.10 `list_post_comments(post_id: UUID, page: int, per_page: int)` → list[Comment] with author info, ordered by created_at ASC
  - [x] 2.11 `count_group_posts(group_id: UUID)` → int
  - [x] 2.12 `count_post_comments(post_id: UUID)` → int
  - [x] 2.13 `get_group_detail(slug: str, user_id: UUID | None)` → GroupDetailResponse data (member_count, post_count, is_member)

- [x] Task 3: Add service methods (AC: #1-4)
  - [x] 3.1 `get_group_detail(slug: str, user_id: UUID | None)` → GroupDetailResponse
  - [x] 3.2 `join_group(user_id: UUID, group_id: UUID)` → raise if already member, create membership
  - [x] 3.3 `leave_group(user_id: UUID, group_id: UUID)` → raise if not member, soft-delete membership
  - [x] 3.4 `create_post(user_id: UUID, request: PostCreateRequest)` → validate membership, create post, emit `POST_CREATED_EVENT`, return PostDetailResponse
  - [x] 3.5 `create_comment(user_id: UUID, post_id: UUID, request: CommentCreateRequest)` → validate post exists, create comment, emit `COMMENT_CREATED_EVENT`, return CommentListItem
  - [x] 3.6 `get_group_posts(group_id: UUID, page: int, per_page: int)` → Paginated list
  - [x] 3.7 `get_post_detail(post_id: UUID)` → PostDetailResponse
  - [x] 3.8 `get_post_comments(post_id: UUID, page: int, per_page: int)` → Paginated list

- [x] Task 4: Add router endpoints (AC: #1-5)
  - [x] 4.1 `GET /api/v1/community/groups/{slug}` → public (optional auth for is_member), returns SingleEnvelope[GroupDetailResponse]
  - [x] 4.2 `POST /api/v1/community/groups/{group_id}/join` → auth required, returns SingleEnvelope[JoinGroupResponse], rate_limit(20, 3600, "group_join")
  - [x] 4.3 `DELETE /api/v1/community/groups/{group_id}/join` → auth required, returns 204 No Content
  - [x] 4.4 `GET /api/v1/community/groups/{group_id}/posts` → public, returns Paginated[PostListItem]
  - [x] 4.5 `POST /api/v1/community/posts` → auth required, returns SingleEnvelope[PostDetailResponse] (201), rate_limit(10, 3600, "post_create")
  - [x] 4.6 `GET /api/v1/community/posts/{post_id}` → public, returns SingleEnvelope[PostDetailResponse]
  - [x] 4.7 `GET /api/v1/community/posts/{post_id}/comments` → public, returns Paginated[CommentListItem]
  - [x] 4.8 `POST /api/v1/community/posts/{post_id}/comments` → auth required, returns SingleEnvelope[CommentListItem] (201), rate_limit(30, 3600, "comment_create")

- [x] Task 5: Add community-specific exceptions (AC: #1-4)
  - [x] 5.1 `AlreadyMemberException` — 409 Conflict
  - [x] 5.2 `NotMemberException` — 403 Forbidden
  - [x] 5.3 `CommentNotFoundException` — 404

- [x] Task 6: Wire gamification for comment.created (AC: #4)
  - [x] 6.1 Add `COMMUNITY_COMMENT_CREATED_EVENT = "community.comment.created"` to `gamification/events.py`
  - [x] 6.2 Add `on_community_comment_created()` handler — awards `ActionType.COMMENT` (10 pts) with metadata `{"comment_id": ..., "post_id": ...}`
  - [x] 6.3 Subscribe in `register_gamification_subscribers()`
  - [x] 6.4 Add to `__all__` exports

### Backend — Tests

- [x] Task 7: Backend tests (AC: #1-5)
  - [x] 7.1 `test_repository.py` — join_group creates membership, leave_group soft-deletes, create_post inserts, create_comment inserts and increments comment_count, is_member returns correct bool, rejoin after leave works
  - [x] 7.2 `test_service.py` — join_group raises AlreadyMemberException if already joined, leave_group raises NotMemberException, create_post emits POST_CREATED_EVENT, create_comment emits COMMENT_CREATED_EVENT, create_post requires membership
  - [x] 7.3 `test_router.py` — POST join returns 200, POST join without auth returns 401, DELETE join returns 204, POST post returns 201 with valid data, POST post without auth returns 401, POST post without membership returns 403, GET group/{slug} returns group detail with is_member, GET posts returns paginated list, POST comment returns 201, GET comments returns paginated list
  - [x] 7.4 `test_gamification_comment_event.py` — verify `community.comment.created` triggers 10 points via gamification event handler

### Frontend — Group Detail Page & Composers

- [x] Task 8: Add TypeScript types for write operations
  - [x] 8.1 Add to `lib/types.ts`: `GroupDetail`, `PostDetail`, `PostListItem`, `CommentItem`, `AuthorInfo`, `PostCreatePayload`, `CommentCreatePayload`

- [x] Task 9: Add data fetching + mutation functions
  - [x] 9.1 `lib/community-data.ts` — add `fetchGroupDetail(slug)`, `fetchGroupPosts(groupId, page)`, `fetchPostDetail(postId)`, `fetchPostComments(postId, page)`
  - [x] 9.2 `hooks/useJoinGroup.ts` — TanStack Query `useMutation` for POST/DELETE join, optimistic toggle of `isMember` state, invalidate group detail + community hub queries
  - [x] 9.3 `hooks/useCreatePost.ts` — `useMutation` for POST create, invalidate group posts, show success toast
  - [x] 9.4 `hooks/useCreateComment.ts` — `useMutation` for POST comment, optimistic add to comment list, invalidate post detail (for comment_count)

- [x] Task 10: Group Detail Page — Server + Client Components (AC: #1-3)
  - [x] 10.1 Create `apps/web/app/(user)/[locale]/community/[group_slug]/page.tsx` as server component
  - [x] 10.2 Fetch group detail via BFF proxy → `GET /api/v1/community/groups/{slug}`
  - [x] 10.3 Fetch group posts via BFF proxy → `GET /api/v1/community/groups/{group_id}/posts`
  - [x] 10.4 Generate metadata with group name for SEO
  - [x] 10.5 Create `GroupDetailHeader.tsx` (Client) — group icon, name, description, member count, Join/Leave button
  - [x] 10.6 Create `JoinButton.tsx` (Client) — "参加する" / "参加中" toggle, uses `useJoinGroup` hook, shows leave option on "参加中" tap
  - [x] 10.7 Create `PostListSection.tsx` (Server) — list of post cards with pagination
  - [x] 10.8 Create `PostCard.tsx` (Server) — author avatar + badge, title (2 lines), preview text (1 line), tag chips (max 2), engagement row (comments + likes + time), links to post detail
  - [x] 10.9 Create `CreatePostButton.tsx` (Client) — "＋ 投稿する" button, checks auth (SignupModal for guest), checks membership (join prompt for non-member), opens PostComposer
  - [x] 10.10 Create `PostComposer.tsx` (Client) — React Hook Form + Zod: title (required, max 200), body (required, max 5000), tag selector (max 3), submit triggers `useCreatePost`, show toast on success

- [x] Task 11: Post Detail / Thread Page (AC: #4-5)
  - [x] 11.1 Create `apps/web/app/(user)/[locale]/community/[group_slug]/[post_id]/page.tsx` as server component
  - [x] 11.2 Fetch post detail via `GET /api/v1/community/posts/{post_id}`
  - [x] 11.3 Fetch comments via `GET /api/v1/community/posts/{post_id}/comments` (paginated, 20 per page)
  - [x] 11.4 Create `ThreadHeader.tsx` (Server) — title, author info + SenpaiBadge, group name, post date, tag chips, full body text
  - [x] 11.5 Create `CommentList.tsx` (Client) — paginated comment list with "もっと見る" load more button, each comment: avatar (36px), name + badge, body, like count, relative time, teal left border for senpai-badged replies
  - [x] 11.6 Create `ReplyComposer.tsx` (Client) — sticky bottom bar: text area, "返信" submit button, uses `useCreateComment`, auth gate via SignupModal

- [x] Task 12: Update CommunityHubHeader "＋ 投稿する" behavior (AC: #2)
  - [x] 12.1 For authenticated users: navigate to group selection or show GroupSelector modal
  - [x] 12.2 Replace current no-op with navigation to `/[locale]/community/[first-joined-group-slug]` or show group picker

### Frontend — i18n

- [x] Task 13: Add i18n keys for Story 5.2 features
  - [x] 13.1 Add to `community` namespace in `ja.json`: join_group, leave_group, joined, join_prompt, post_composer_title, post_title_placeholder, post_body_placeholder, tag_selector_label, submit_post, post_created, reply_placeholder, submit_reply, reply_created, group_posts, load_more_comments, no_posts_yet, create_first_post, group_members_count, group_posts_count, leave_confirm, etc.
  - [x] 13.2 Add equivalent keys to `en.json` and `vi.json`

### Frontend — Tests

- [x] Task 14: Frontend tests (AC: #1-5)
  - [x] 14.1 `JoinButton.test.tsx` — renders "参加する" for non-member, "参加中" for member, calls join mutation on tap, shows leave option
  - [x] 14.2 `PostComposer.test.tsx` — validates title required, body required, tag limit 3, submits form data
  - [x] 14.3 `ReplyComposer.test.tsx` — shows text area, submit button, auth gate for guest
  - [x] 14.4 `GroupDetailHeader.test.tsx` — renders group info, member count
  - [x] 14.5 `PostCard.test.tsx` — renders post title, author info, engagement row

### Review Findings

_Code review (2026-04-25) — chunk 1: Backend community module + gamification events. Reviewers: Blind Hunter (adversarial), Edge Case Hunter, Acceptance Auditor._

**Patch** _(all applied 2026-04-25)_

- [x] [Review][Patch] `create_comment` must require group membership (resolved from D1) [backend/modules/community/service.py:307-332] — added `is_member(user_id, post.group_id)` check before creating the comment; new test `test_create_comment_requires_membership` covers the path.
- [x] [Review][Patch] Concurrent `join_group` race produces 500 instead of 409 [backend/modules/community/repository.py:63-84] — wrapped `session.flush()` in `try/except IntegrityError` to rollback and re-raise `AlreadyMemberException`.
- [x] [Review][Patch] Slug path parameter unbounded/unvalidated [backend/modules/community/router.py:69] — added `Path(min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")` constraint.
- [x] [Review][Patch] Title/body whitespace bypasses `min_length=1` [backend/modules/community/schemas.py — `PostCreateRequest`, `CommentCreateRequest`] — added `@field_validator` that strips and rejects blank/whitespace-only input.
- [x] [Review][Patch] `JoinGroupResponse.joined_at` may be `None` when timestamps not yet populated post-flush [backend/modules/community/service.py:260] — added `session.refresh(membership)` plus `datetime.now(UTC)` fallback.
- [x] [Review][Patch] `create_post` raises `PostNotFoundException` after successful commit + emit when refetch returns `None` [backend/modules/community/service.py:291-305] — reordered to emit only after refetch succeeds, preventing gamification fire when response would 404.
- [x] [Review][Patch] `tag_slugs` lacks per-item validation [backend/modules/community/schemas.py — `PostCreateRequest`] — added `@field_validator` that strips, lowercases, enforces non-empty + per-item `max_length=50`, and dedupes.
- [x] [Review][Patch] English exception messages echo raw user-supplied slug/UUID [backend/modules/community/exceptions.py:12,23,34,45,56] — dropped identifiers from `message_en` so all five exceptions match the locale-safe shape used by JA/VI.

**Deferred (pre-existing or out-of-scope for Story 5.2)**

- [x] [Review][Defer] Rejoin path does not reset `created_at` (analytics may treat rejoin as long-time member) [repository.py:75-79] — deferred, pre-existing semantics.
- [x] [Review][Defer] `func.left(Post.body, 140)` preview truncation is naive (markdown/CJK boundary) [repository.py:203] — deferred, cosmetic.
- [x] [Review][Defer] No idempotency keys on `POST /posts` / `POST /comments` — deferred, no spec requirement.
- [x] [Review][Defer] Post/comment body has no server-side HTML/markdown sanitization [schemas.py] — deferred to moderation story.
- [x] [Review][Defer] `list_group_posts` doesn't re-verify `Group.deleted_at` after service-level pre-check (rare TOCTOU) [repository.py:196-227] — deferred.
- [x] [Review][Defer] Pagination uses unbounded `count(*)` per request [service.py:341,360] — deferred, perf optimization.
- [x] [Review][Defer] No edit/soft-delete endpoints for post/comment, so denormalized counters cannot be reconciled — deferred, out of scope for 5.2.
- [x] [Review][Defer] Rate limit scoping (per-user vs global) for join/post/comment depends on `shared/rate_limit.py`; verify keys include user/IP — deferred, cross-cutting.

---

_Code review (2026-04-25) — chunk 2: Backend tests (community + gamification)._

**Patch (chunk 2)** _(all applied 2026-04-25)_

- [x] [Review][Patch] Test isolation autouse fixture clearing `app.dependency_overrides` added [backend/tests/community/test_router.py].
- [x] [Review][Patch] `test_create_comment_inserts_and_increments_comment_count` now compiles the `UPDATE` statement and asserts target table, `comment_count = comment_count + 1` increment, target `post_id`, and `deleted_at IS NULL` filter.
- [x] [Review][Patch] Added `test_is_member_returns_false_when_no_membership`.
- [x] [Review][Patch] Added 9 service-layer happy/error tests: `test_join_group_success`, `test_join_group_raises_when_group_missing`, `test_leave_group_success`, `test_leave_group_raises_when_group_missing`, `test_create_post_raises_when_group_missing`, `test_create_comment_raises_when_post_missing`, `test_get_group_detail_raises_when_missing`, `test_get_post_detail_raises_when_missing`, `test_get_group_posts_raises_when_group_missing`.
- [x] [Review][Patch] Added 5 router validation/mapping tests: `test_get_group_detail_invalid_slug_returns_422`, `test_post_post_blank_body_returns_422`, `test_post_post_tag_overflow_returns_422`, `test_post_comment_not_member_returns_403`, `test_post_comment_blank_body_returns_422`.
- [x] [Review][Patch] Gamification test asserts `POINT_VALUES[ActionType.COMMENT] == 10` (Task 7.4 explicit value).
- [x] [Review][Patch] Added `test_create_post_raises_when_post_lookup_returns_none` and `test_create_comment_raises_when_comment_lookup_returns_none`; both also assert `emit` was NOT awaited so the chunk-1 emit-after-refetch reorder is locked in.
- [x] [Review][Patch] Added `test_create_post_emits_after_commit_and_refetch` using `side_effect` ordering callbacks; asserts call order is `commit → refetch → emit`.
- [x] [Review][Patch] Added `test_join_group_raises_already_member_on_integrity_error` covering the chunk-1 `IntegrityError`/rollback patch.
- [x] [Review][Patch] `test_post_post_returns_201_with_valid_data` now asserts `svc.create_post.await_args` payload carries the exact `group_id`, `title`, `body`, and `tag_slugs` from the request body.

**Schema follow-up (incidental):** Switched `PostCreateRequest` / `CommentCreateRequest` validators from raw `field_validator` raising `ValueError` to a `BeforeValidator`-based strip + Pydantic-native `min_length=1` so 422 responses serialize cleanly through `shared/middleware/error_handler.py` (the `validation_exception_handler` currently surfaces `exc.errors()` directly; raw `ValueError` in `ctx` is not JSON-serializable). Per-tag `min_length=1, max_length=50` constraint moved to the `Annotated` element type. No behavior change for valid inputs.

---

_Code review (2026-04-25) — chunk 3: Frontend pages + components._

**Patch (chunk 3)** _(all applied 2026-04-25)_

- [x] [Review][Patch] (resolved from D1) `CommentList` refactored to a `useQuery` consumer seeded with `initialData`. `useCreateComment` now does an immediate `setQueryData` append (correct for ASC `created_at` ordering) so the new comment appears synchronously, then `invalidateQueries` reconciles in the background and `router.refresh()` re-renders `ThreadHeader.commentCount`. AC #4 real-time satisfied without WebSocket/SSE.
- [x] [Review][Patch] (resolved from D2) Added chip-style tag input to `PostComposer`: type → Enter/`,` to add, ✕ to remove, Backspace on empty input to pop the last chip. Client-side normalizes (`trim().toLowerCase()`), checks dedupe, length ≤50, regex `^[a-z0-9-]+$`. Backend validator from chunk 1 catches anything that slips. Added 4 new i18n keys per locale.
- [x] [Review][Patch] `PostComposer` redirect now uses `\`/${locale}/community/${groupSlug}/${result.id}\`` (locale is now a required prop).
- [x] [Review][Patch] `useJoinGroup` calls `router.refresh()` in both `onSuccess` callbacks so the server-rendered `is_member` re-flows into `JoinButton`.
- [x] [Review][Patch] Relative-time strings translated via new `time_just_now` / `time_minutes_ago` / `time_hours_ago` / `time_days_ago` keys. `formatRelativeTime` now takes a `Translator` parameter; clamps negative diffs (clock skew) to 0.
- [x] [Review][Patch] `toLocaleDateString` now uses a locale→BCP47 map (`ja→ja-JP`, `en→en-US`, `vi→vi-VN`) in `ThreadHeader`, `PostCard`, `CommentItem`. `CommentList` now passes `locale` down to each `CommentItemCard`.
- [x] [Review][Patch] `PostComposer` modal: added `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape-to-close (disabled while submitting), `aria-label` on the close button, `aria-invalid` on inputs.
- [x] [Review][Patch] `GroupDetailActions` join-prompt modal: added `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape-to-close.
- [x] [Review][Patch] `JoinButton` leave-popover dismisses on Escape and outside click via a `useEffect` + container `ref`; also added `aria-haspopup` / `aria-expanded` on the trigger.
- [x] [Review][Patch] `CommentList.loadMore` now `catch`es errors and surfaces `t("load_comments_error")` toast; still resets `isLoadingMore` in `finally`.
- [x] [Review][Patch] `<PostComposer>` mounting lifted to `GroupDetailActions`; `CreatePostButton` exposes `onComposerRequested`. After `handleJoinAndPost.onSuccess`, the composer auto-opens — AC #3 satisfied.
- [x] [Review][Patch] `PostComposer` Zod schema uses `min(1, "required")` and `max(N, "too_long")` and renders distinct i18n keys (`post_title_required` vs `post_title_too_long`, same for body). Added 2 new i18n keys per locale.
- [x] [Review][Patch] `GroupDetailHeader` is now an async Server Component using `getTranslations` from `next-intl/server`. Test file updated to await the component output before `render()`.
- [x] [Review][Patch] `[post_id]/page.tsx` parallelizes `fetchPostDetail` + `fetchPostComments` via `Promise.allSettled` — halves the request latency for the post detail page.
- [x] [Review][Patch] `fetchGroupPosts` / `fetchPostDetail` / `fetchPostComments` now accept an optional `cookie` argument; both pages forward it from `cookies()`. Aligns with `fetchGroupDetail`.
- [x] [Review][Patch] `CommunityHubHeader` uses `useLocale()` and disables the "+ 投稿する" button when authenticated user has no available groups; signed-out flow still opens `SignupModal`. Test mock updated to provide `useLocale`.

**Deferred (chunk 3)**

- [x] [Review][Defer] Native `<img>` instead of `next/image` across `CommentItem`, `PostCard`, `ThreadHeader` — perf optimization deferred until image CDN strategy is set.
- [x] [Review][Defer] Aria-labels on emoji icons (`💬`, `❤️`) for screen-reader friendliness — accessibility polish.
- [x] [Review][Defer] N+1 `getTranslations()` calls in `PostCard` rendered server-side per post — perf optimization.
- [x] [Review][Defer] `relativeTime` computed at SSR time freezes the value until next request — acceptable while page is `force-dynamic`; revisit when adding ISR.
- [x] [Review][Defer] Long-CJK / no-space title overflow — add `break-words` later when real content shows the issue.
- [x] [Review][Defer] No `generateStaticParams` / no caching strategy on group/post pages — covered later when ISR is introduced project-wide.
- [x] [Review][Defer] `description: post.body.slice(0, 160)` in metadata may split a multi-byte glyph and includes raw user content — add proper excerpt helper later.
- [x] [Review][Defer] Photo upload UI shells (post composer photo button, reply composer photo icon) — explicitly deferred by spec ("Do NOT add photo upload to post/comment in this story").
- [x] [Review][Defer] No Sentry/log on the bare `catch {}` blocks in the two new pages — observability backlog item.

**Dismissed (chunk 3)**

- `<img alt="">` on avatars where the author display name is rendered alongside — accepted decorative-image pattern.
- `SignupModal` rendered with `isOpen=false` instead of conditionally mounted — `SignupModal` itself handles `isOpen` and is shared lazily in the bundle; not duplicated.
- `apiClient` URL building with raw `postId` interpolation — `postId` is server-issued UUID, not user-supplied free-form.
- Inconsistent `pb-24` vs `pb-32` padding between the two pages — intentional: `[post_id]/page.tsx` has the sticky `ReplyComposer` and needs more space.
- Concern that `force-dynamic` plus `revalidate=60` in `community-data` conflict — `force-dynamic` wins; the `revalidate` is a no-op there, harmless.
- "Locale parse via `pathname.split('/')[1]`" being brittle — folded into the `CommunityHubHeader` patch above; not a separate finding.

**Deferred (chunk 2)**

- [x] [Review][Defer] Datetime fixtures use `datetime.now(UTC)` without `freeze_time`; flaky if relative-time logic is added later.
- [x] [Review][Defer] Tests assert exact Japanese strings (e.g. `"住まいについて"`, `"返信です"`); fragile to copy edits — anchor on IDs when possible.
- [x] [Review][Defer] Event-payload tests use string IDs (`"comment-1"`, `"post-1"`) instead of UUID strings; producers will send UUID strings.
- [x] [Review][Defer] No rate-limit tests for `POST /join`, `POST /posts`, `POST /comments` — cross-cutting infra concern, deferred to a rate-limit harness.
- [x] [Review][Defer] No idempotency / duplicate-event handling test for gamification subscribers — depends on idempotency-key implementation (not present).
- [x] [Review][Defer] `register_gamification_subscribers` test asserts only the event-name list, not handler identity — low value while module is small.
- [x] [Review][Defer] No test for malformed UUID in path; FastAPI 422 is implicit and stable.
- [x] [Review][Defer] `leave_group` repo test does not assert `tz`-aware `deleted_at` value — pre-existing pattern across other modules.
- [x] [Review][Defer] `_FakeService.award_points` does not capture `**kwargs`; future signature additions silently uncovered.

**Dismissed (chunk 2)**

- `assert existing.deleted_at is not None` after `leave_group` is meaningful because the repo explicitly sets it to `datetime.now(UTC)`; not a false-truthy MagicMock attribute.
- Service-layer `AlreadyMemberException` test "bypasses the SUT" — service's job here is propagation; the repository-layer test covers the decision logic.
- `_SessionCtx.__aenter__` returning `object()` is intentional for wiring tests; the FakeService doesn't need a real session.
- Hardcoded `"NOT_MEMBER"` error code assertion — that string is the API contract; tests should pin it.
- Brittle exact-Japanese assertions on response shape — duplicate of "Defer: i18n strings"; keeping under defer only.
- `mock_session.commit` AsyncMock typing concern — `AsyncMock()` auto-creates AsyncMock children for attribute access, so `commit.assert_awaited_once()` works correctly.

---

**Dismissed (false positive / spec-conformant / handled)**

- `get_post_by_id` inner-joining `Group` (cascade hiding posts/comments of soft-deleted groups) — confirmed intentional design (resolved from D2).
- Comment counter drift under concurrency — `UPDATE … SET col = col + 1` is atomic at row level in PostgreSQL.
- Subscriber re-registration on multiple `register_gamification_subscribers()` calls — `_registered` guard already prevents this (`gamification/events.py:39,170-182`).
- Event constant mismatch between community and gamification — both modules use identical literal strings `"community.post.created"` / `"community.comment.created"`.
- `description_en` missing from `GroupDetailResponse` — spec Task 1.1 only lists `description_ja` / `description_vi`.
- `is_member: bool | None` semantics (None for anon vs True/False for authed) — spec Task 1.1 explicitly specifies this.
- `GroupNotFoundException` param renamed `group_id` → `group_ref` — all 5 callers use positional args; safe.
- `GroupBriefInfo.icon` non-nullable — DB column `Group.icon` is `String(10), nullable=False` (`models.py:29`).
- `page=0` negative offset — router enforces `Query(ge=1)`.
- `NotMemberException` returns 403 — spec API design explicitly mandates 403.
- Missing `emit` for `community.group.joined` event — not specified by AC #1 or Task list.
- BadgeLevel multiple-rows-per-user concern — pre-existing JOIN pattern, not introduced by this diff.
- `get_current_user_optional` timing side-channel for `is_member` — out of scope micro-issue.

## Dev Notes

### Architecture Compliance

- **Module isolation**: Community module owns group_memberships, posts, comments tables. For author badge level, use SQL JOIN to `badge_levels` table (same pattern as `review/repository.py:172-178` and existing `community/repository.py:84-87` trending_posts query). Do NOT import gamification module directly.
- **Event bus integration**: Emit `POST_CREATED_EVENT` and `COMMENT_CREATED_EVENT` (already defined in `community/events.py:1-2`) after successful DB commit. Gamification already subscribes to `community.post.created` (30 pts, `gamification/events.py:138-164`). You MUST add `community.comment.created` subscriber for 10 pts in `gamification/events.py`.
- **Response format**: ALL new endpoints MUST use `Paginated[T]` or `SingleEnvelope[T]` wrappers from `modules.listing.schemas`.
- **Soft delete**: leave_group = set `deleted_at` on GroupMembership row. Rejoin = clear `deleted_at` or create new row. All queries filter `WHERE deleted_at IS NULL`.
- **Rate limiting**: Apply `rate_limit()` from `shared/rate_limit.py` on all write endpoints (join: 20/hr, post: 10/hr, comment: 30/hr).

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| Community models (Group, Post, Comment, GroupMembership, Event, EventRegistration) | `backend/modules/community/models.py` | All 6 models with indexes and FKs |
| Community events constants | `backend/modules/community/events.py` | `POST_CREATED_EVENT`, `COMMENT_CREATED_EVENT` |
| GroupNotFoundException, PostNotFoundException | `backend/modules/community/exceptions.py` | Existing 404 exceptions |
| Group seed data (6 groups) | `backend/scripts/seed_data.py` | Groups + seed posts/comments already seeded |
| Community hub endpoints | `backend/modules/community/router.py` | `GET /hub`, `GET /groups` |
| CommunityService, CommunityRepository | `backend/modules/community/service.py`, `repository.py` | Hub + group list methods |
| Community frontend module | `apps/web/modules/community/` | Components, types, data-fetching |
| GroupCard links to `/[locale]/community/[slug]` | `apps/web/modules/community/components/GroupCard.tsx` | Route already linked, page not yet created |
| Community i18n namespace | `apps/web/messages/ja.json` → `community` | Base keys exist, add new ones |
| Gamification post.created subscriber | `backend/modules/gamification/events.py:138-164` | Awards 30 pts for `ActionType.POST` |
| ActionType.COMMENT (10 pts) | `backend/modules/gamification/constants.py:19` | Points defined but no event subscriber |
| SenpaiBadge component | `shared/components/SenpaiBadge.tsx` | 5 variants, use for author badges |
| getBadgeVariant() | `shared/lib/badgeUtils.ts` | Maps badge level string to variant |
| SignupModal | `modules/user/components/SignupModal.tsx` | Auth gate for unauthenticated users |
| SectionHeader | `shared/components/SectionHeader.tsx` | Section header with emoji + link |
| EmptyState | `shared/components/EmptyState.tsx` | no-results, no-data, no-saved variants |
| Skeleton | `shared/components/Skeleton.tsx` | text, circle, rect, card variants |
| useAuth hook | `shared/hooks/useAuth.ts` | `isAuthenticated`, `user`, `checkAuth()` |
| useToast hook | `shared/hooks/useToast.ts` | `showToast(message, variant)` |
| apiClient | `shared/lib/apiClient.ts` | Auto snake↔camel transform, CSRF, 401 refresh |
| ToastProvider | `shared/components/ToastProvider.tsx` | Toast context with auto-dismiss |
| get_current_user | `modules/auth/dependencies.py` | Required auth for write endpoints |
| get_current_user_optional | `modules/auth/dependencies.py` | Optional auth for is_member on GET |
| rate_limit | `shared/rate_limit.py` | `rate_limit(limit, window_s, route_key)` |
| BaseModel | `shared/base_models.py` | id (UUID), created_at, updated_at, deleted_at |
| emit / subscribe | `shared/events.py` | Async event bus |
| Paginated / SingleEnvelope | `modules/listing/schemas.py` | Response wrappers |
| get_async_session | `shared/database.py` | Async session DI |
| ListingImage | `shared/components/ListingImage.tsx` | Reuse for post/comment photos if needed |
| React Hook Form + Zod | `package.json` deps | Already installed in web app |

### API Design

```
GET /api/v1/community/groups/{slug}
  Auth: optional (get_current_user_optional)
  Response: SingleEnvelope[GroupDetailResponse]
  Notes: is_member = null when no auth, true/false when authenticated

POST /api/v1/community/groups/{group_id}/join
  Auth: required (get_current_user)
  Rate limit: 20/hr
  Response: SingleEnvelope[JoinGroupResponse]
  Error: 409 AlreadyMemberException

DELETE /api/v1/community/groups/{group_id}/join
  Auth: required
  Response: 204 No Content
  Error: 403 NotMemberException

GET /api/v1/community/groups/{group_id}/posts
  Auth: none (public)
  Query: page (default=1), per_page (default=20, max=50)
  Response: Paginated[PostListItem]

POST /api/v1/community/posts
  Auth: required
  Rate limit: 10/hr
  Body: PostCreateRequest {group_id, title, body, tag_slugs}
  Response: SingleEnvelope[PostDetailResponse] (201)
  Error: 403 NotMemberException (must join group first)
  Event: community.post.created → gamification (30 pts)

GET /api/v1/community/posts/{post_id}
  Auth: none (public)
  Response: SingleEnvelope[PostDetailResponse]

GET /api/v1/community/posts/{post_id}/comments
  Auth: none (public)
  Query: page (default=1), per_page (default=20, max=50)
  Response: Paginated[CommentListItem]

POST /api/v1/community/posts/{post_id}/comments
  Auth: required
  Rate limit: 30/hr
  Body: CommentCreateRequest {body}
  Response: SingleEnvelope[CommentListItem] (201)
  Event: community.comment.created → gamification (10 pts)
```

### Frontend Component Architecture

```
app/(user)/[locale]/community/[group_slug]/page.tsx (Server — SSR)
├── GroupDetailHeader (Client — join/leave + info)
│   └── JoinButton (Client — toggle join/leave)
├── CreatePostButton (Client — auth + membership gates)
├── PostListSection (Server — paginated post cards)
│   └── PostCard × N (Server — link to thread)
│       └── SenpaiBadge (shared)
└── EmptyState (if no posts — "create first post" CTA)

app/(user)/[locale]/community/[group_slug]/[post_id]/page.tsx (Server — SSR)
├── ThreadHeader (Server — post title, body, author, tags)
│   └── SenpaiBadge (shared)
├── CommentList (Client — paginated, load more)
│   └── CommentItem × N (Client — senpai teal border)
│       └── SenpaiBadge (shared)
└── ReplyComposer (Client — sticky bottom, auth gate)
```

### Join/Leave Group Pattern

```python
# repository.py — join_group
async def join_group(self, user_id: UUID, group_id: UUID) -> GroupMembership:
    # Check for soft-deleted existing membership (rejoin case)
    existing = await self.session.execute(
        select(GroupMembership).where(
            GroupMembership.group_id == group_id,
            GroupMembership.user_id == user_id,
        )
    )
    row = existing.scalar_one_or_none()
    if row and row.deleted_at is None:
        raise AlreadyMemberException(group_id)
    if row and row.deleted_at is not None:
        row.deleted_at = None  # Rejoin = un-soft-delete
        row.updated_at = datetime.now(UTC)
        return row
    membership = GroupMembership(group_id=group_id, user_id=user_id)
    self.session.add(membership)
    return membership
```

### Post Creation with Event Emission

```python
# service.py — create_post
async def create_post(self, user_id: UUID, request: PostCreateRequest) -> PostDetailResponse:
    if not await self.repo.is_member(user_id, request.group_id):
        raise NotMemberException(request.group_id)
    post = await self.repo.create_post(
        group_id=request.group_id,
        user_id=user_id,
        title=request.title,
        body=request.body,
        tag_slugs=request.tag_slugs,
    )
    await self.session.commit()
    await emit(POST_CREATED_EVENT, {
        "user_id": str(user_id),
        "post_id": str(post.id),
        "group_id": str(request.group_id),
    })
    return await self._build_post_detail(post)
```

### Comment Creation with Counter Increment

```python
# repository.py — create_comment
async def create_comment(self, post_id: UUID, user_id: UUID, body: str) -> Comment:
    comment = Comment(post_id=post_id, user_id=user_id, body=body)
    self.session.add(comment)
    # Increment denormalized counter on Post
    await self.session.execute(
        update(Post)
        .where(Post.id == post_id, Post.deleted_at.is_(None))
        .values(comment_count=Post.comment_count + 1)
    )
    return comment
```

### Frontend Join Button Pattern

```typescript
// hooks/useJoinGroup.ts
export function useJoinGroup(groupId: string) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const t = useTranslations("community");

  const joinMutation = useMutation({
    mutationFn: () => apiClient(`/community/groups/${groupId}/join`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", "group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["community", "hub"] });
      showToast(t("join_success"), "success");
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => apiClient(`/community/groups/${groupId}/join`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", "group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["community", "hub"] });
    },
  });

  return { joinMutation, leaveMutation };
}
```

### TanStack Query Key Convention

```typescript
["community", "hub"]                      // hub page data
["community", "group", slug]              // group detail
["community", "group", groupId, "posts"]  // group post list
["community", "post", postId]             // post detail
["community", "post", postId, "comments"] // post comments
```

### Guest Access & Auth Gate Pattern

The group detail page and post list are fully browsable without auth. Write actions (join, post, comment) check auth:

```typescript
// Frontend auth gate — same pattern as BottomTabNav.tsx:55-69
const { isAuthenticated } = useAuth();
const [showSignupModal, setShowSignupModal] = useState(false);

const handlePost = () => {
  if (!isAuthenticated) {
    setShowSignupModal(true);
    return;
  }
  if (!isMember) {
    // Show join prompt
    return;
  }
  openComposer();
};
```

### Anti-Patterns to Avoid

- Do NOT create WebSocket/SSE for real-time comments — use `queryClient.invalidateQueries()` after mutation success
- Do NOT import `gamification` module in `community` module — gamification subscribes via event bus
- Do NOT add post/comment like functionality in this story — that is deferred (Story 5.3)
- Do NOT add photo upload to post/comment in this story — use text-only initially, photo upload can be added later
- Do NOT use spinners for loading — use `Skeleton` component
- Do NOT use relative imports in frontend — always `@/` aliases
- Do NOT use `any` type — use `unknown` + type guards
- Do NOT hard-code Japanese text — all strings via `useTranslations("community")`
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`
- Do NOT create separate BFF route files for community — reuse existing `api/(user)/[...path]/route.ts` proxy

### Previous Story Intelligence (Story 5-1)

- **Agent model**: claude-opus-4-6
- **Key patterns established**: Community module structure with constants.py (GROUP_CATEGORIES), repository with subqueries for member_count/post_count, CommunityHubResponse aggregation in service.get_community_hub(), frontend server components for hub sections
- **Review findings to address in this story**:
  - CommunityHubHeader "＋ 投稿する" for authenticated users is a no-op — Task 12 addresses this
  - ThreadPreviewCard shows group name instead of relative time in engagement row — cosmetic, don't modify in this story (already flagged for 5.1 review fixes)
- **Test baseline**: Backend: 389 tests. Frontend: 415 tests. 3 pre-existing Gallery.test.tsx failures (unrelated). Maintain this baseline + new tests.
- **Build commands**: `python -m pytest backend/tests/`, `pnpm --filter web test`, `pnpm --filter web build`, `python -m ruff check backend/`

### Git Intelligence

Recent commits:
- `6ca5df1 create: add community hub feature with group browsing and updates to listings`
- `665df3f create: add senpai picks verified reviews with reviewer info and map z-index fix (story 4-3)`

Commit convention: `create: ...` for new features, `update: ...` for enhancements, `fix: ...` for bugs.

### Project Structure Notes

**New files to create:**
```
apps/web/app/(user)/[locale]/community/[group_slug]/page.tsx
apps/web/app/(user)/[locale]/community/[group_slug]/[post_id]/page.tsx
apps/web/modules/community/components/GroupDetailHeader.tsx
apps/web/modules/community/components/JoinButton.tsx
apps/web/modules/community/components/PostListSection.tsx
apps/web/modules/community/components/PostCard.tsx
apps/web/modules/community/components/CreatePostButton.tsx
apps/web/modules/community/components/PostComposer.tsx
apps/web/modules/community/components/ThreadHeader.tsx
apps/web/modules/community/components/CommentList.tsx
apps/web/modules/community/components/CommentItem.tsx
apps/web/modules/community/components/ReplyComposer.tsx
apps/web/modules/community/hooks/useJoinGroup.ts
apps/web/modules/community/hooks/useCreatePost.ts
apps/web/modules/community/hooks/useCreateComment.ts
apps/web/modules/community/__tests__/JoinButton.test.tsx
apps/web/modules/community/__tests__/PostComposer.test.tsx
apps/web/modules/community/__tests__/ReplyComposer.test.tsx
apps/web/modules/community/__tests__/GroupDetailHeader.test.tsx
apps/web/modules/community/__tests__/PostCard.test.tsx
```

**Files to modify:**
```
backend/modules/community/router.py          — add 8 new endpoints
backend/modules/community/service.py         — add write + detail methods
backend/modules/community/repository.py      — add write + query methods
backend/modules/community/schemas.py         — add request/response schemas
backend/modules/community/exceptions.py      — add AlreadyMemberException, NotMemberException, CommentNotFoundException
backend/modules/gamification/events.py       — add COMMUNITY_COMMENT_CREATED_EVENT subscriber
apps/web/modules/community/lib/types.ts      — add write operation types
apps/web/modules/community/lib/community-data.ts — add group/post/comment fetch functions
apps/web/messages/ja.json                    — add community group/post/comment i18n keys
apps/web/messages/en.json                    — add community group/post/comment i18n keys
apps/web/messages/vi.json                    — add community group/post/comment i18n keys
apps/web/modules/community/components/CommunityHubHeader.tsx — update authenticated "＋ 投稿する" behavior
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

- [Source: epics/epic-5-community-events.md#Story 5.2] — acceptance criteria and user story
- [Source: epics/epic-5-community-events.md#Story 5.3] — thread detail context (next story, overlap on comment display)
- [Source: prd/functional-requirements.md#FR20-FR25] — community & events functional requirements
- [Source: architecture/project-structure-boundaries.md#Complete Project Directory Structure] — community route structure: `[group_slug]/page.tsx`
- [Source: architecture/project-structure-boundaries.md#Module Boundaries] — module isolation, table ownership
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns] — backend/frontend module structure
- [Source: architecture/implementation-patterns-consistency-rules.md#Naming Patterns] — database, API, code naming conventions
- [Source: architecture/implementation-patterns-consistency-rules.md#Communication Patterns] — event naming `{module}.{entity}.{action}`, TanStack Query keys
- [Source: architecture/implementation-patterns-consistency-rules.md#Format Patterns] — API response wrappers, error format
- [Source: architecture/core-architectural-decisions.md#API Communication Patterns] — REST, response wrapper, error format
- [Source: backend/modules/community/models.py] — all 6 community models with fields
- [Source: backend/modules/community/events.py:1-2] — POST_CREATED_EVENT, COMMENT_CREATED_EVENT constants
- [Source: backend/modules/community/exceptions.py] — GroupNotFoundException, PostNotFoundException
- [Source: backend/modules/community/repository.py] — existing query patterns (trending_posts badge JOIN)
- [Source: backend/modules/gamification/events.py:138-164] — post.created subscriber, _award_from_event pattern
- [Source: backend/modules/gamification/constants.py:16-24] — POINT_VALUES: POST=30, COMMENT=10
- [Source: backend/modules/review/router.py] — POST endpoint pattern with auth + rate limit
- [Source: backend/modules/review/service.py] — write + commit + emit pattern
- [Source: backend/modules/auth/dependencies.py] — get_current_user, get_current_user_optional
- [Source: shared/rate_limit.py] — rate_limit(limit, window_s, route_key)
- [Source: shared/events.py] — emit/subscribe API
- [Source: shared/base_models.py] — BaseModel (id, created_at, updated_at, deleted_at)
- [Source: modules/listing/schemas.py] — Paginated, SingleEnvelope wrappers
- [Source: apps/web/modules/listing-detail/hooks/useCreateReview.ts] — mutation + toast pattern
- [Source: apps/web/modules/listing-detail/hooks/useReviewVote.ts] — optimistic update pattern
- [Source: apps/web/modules/user/components/ProfileEditModal.tsx] — React Hook Form + Zod pattern
- [Source: apps/web/shared/hooks/useAuth.ts] — isAuthenticated, user
- [Source: apps/web/shared/hooks/useToast.ts] — showToast(message, variant)
- [Source: apps/web/shared/lib/apiClient.ts] — camelCase transform, CSRF, FormData support
- [Source: _bmad-output/implementation-artifacts/5-1-community-hub-group-browsing.md] — previous story intelligence + review findings

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- `python -m ruff check backend/modules/community backend/modules/gamification backend/tests/community backend/tests/gamification`
- `python -m pytest backend/tests/community backend/tests/gamification`
- `python -m ruff check backend/`
- `python -m pytest backend/tests/`

### Completion Notes List

- Implemented backend schemas, repository methods, service flows, and router endpoints for group detail, join/leave membership, post creation/detail/listing, and comment creation/listing.
- Added community-specific exceptions and wired `community.comment.created` into gamification with `ActionType.COMMENT` awards.
- Added and updated backend unit/router/event tests, then verified full backend lint and regression suite pass.
- Implemented frontend TypeScript types (GroupDetail, PostDetail, PostListItem, CommentItem, AuthorInfo, PostCreatePayload, CommentCreatePayload, PaginatedResponse).
- Added server-side data fetching functions (fetchGroupDetail, fetchGroupPosts, fetchPostDetail, fetchPostComments) with snake_case→camelCase mapping.
- Created TanStack Query hooks (useJoinGroup, useCreatePost, useCreateComment) with cache invalidation and toast feedback.
- Built Group Detail page with GroupDetailHeader, JoinButton, PostListSection, PostCard, CreatePostButton, PostComposer, and GroupDetailActions components.
- Built Post Detail/Thread page with ThreadHeader, CommentList, CommentItem, and ReplyComposer components.
- Updated CommunityHubHeader to navigate authenticated users to first group on "＋ 投稿する" click.
- Added i18n keys for ja.json, en.json, vi.json (18 new keys per locale).
- Created 5 frontend test files (JoinButton, PostComposer, ReplyComposer, GroupDetailHeader, PostCard) — all pass.
- All validation gates pass: 411 backend tests, 437 frontend tests (3 pre-existing Gallery failures), 0 lint errors, build succeeds.

### File List

- `backend/modules/community/exceptions.py`
- `backend/modules/community/repository.py`
- `backend/modules/community/router.py`
- `backend/modules/community/schemas.py`
- `backend/modules/community/service.py`
- `backend/modules/gamification/events.py`
- `backend/tests/community/test_repository.py`
- `backend/tests/community/test_router.py`
- `backend/tests/community/test_service.py`
- `backend/tests/gamification/test_gamification_comment_event.py`
- `backend/tests/gamification/test_service.py`
- `apps/web/modules/community/lib/types.ts`
- `apps/web/modules/community/lib/community-data.ts`
- `apps/web/modules/community/hooks/useJoinGroup.ts`
- `apps/web/modules/community/hooks/useCreatePost.ts`
- `apps/web/modules/community/hooks/useCreateComment.ts`
- `apps/web/modules/community/components/JoinButton.tsx`
- `apps/web/modules/community/components/GroupDetailHeader.tsx`
- `apps/web/modules/community/components/GroupDetailActions.tsx`
- `apps/web/modules/community/components/PostCard.tsx`
- `apps/web/modules/community/components/PostListSection.tsx`
- `apps/web/modules/community/components/CreatePostButton.tsx`
- `apps/web/modules/community/components/PostComposer.tsx`
- `apps/web/modules/community/components/ThreadHeader.tsx`
- `apps/web/modules/community/components/CommentItem.tsx`
- `apps/web/modules/community/components/CommentList.tsx`
- `apps/web/modules/community/components/ReplyComposer.tsx`
- `apps/web/modules/community/components/CommunityHubHeader.tsx`
- `apps/web/app/(user)/[locale]/community/page.tsx`
- `apps/web/app/(user)/[locale]/community/[group_slug]/page.tsx`
- `apps/web/app/(user)/[locale]/community/[group_slug]/[post_id]/page.tsx`
- `apps/web/messages/ja.json`
- `apps/web/messages/en.json`
- `apps/web/messages/vi.json`
- `apps/web/modules/community/__tests__/CommunityHubHeader.test.tsx`
- `apps/web/modules/community/__tests__/JoinButton.test.tsx`
- `apps/web/modules/community/__tests__/PostComposer.test.tsx`
- `apps/web/modules/community/__tests__/ReplyComposer.test.tsx`
- `apps/web/modules/community/__tests__/GroupDetailHeader.test.tsx`
- `apps/web/modules/community/__tests__/PostCard.test.tsx`

## Bug Fixes

### BUG-5-2-001: Post creation redirects to `/community/{group}/undefined` (2026-05-10)

**Symptoms:** Sau khi tạo post mới thành công, trang redirect tới `/{locale}/community/{group_slug}/undefined` thay vì `/{locale}/community/{group_slug}/{post_id}`.

**Root cause:** `useCreatePost.ts` gọi `apiClient<PostDetail>(...)` nhưng backend trả về `SingleEnvelope` format `{ data: { id, title, ... } }`. `apiClient` trả về toàn bộ envelope, nên `result.id` = `undefined` (vì `id` nằm trong `result.data.id`).

**Fix:** Thêm `PostDetailEnvelope { data: PostDetail }` wrapper type, gọi `apiClient<PostDetailEnvelope>(...)` rồi unwrap `response.data` — consistent với pattern của `useLikePost`, `useEventRegistration`, etc.

Cùng bug cũng tồn tại trong `useCreateComment.ts` — đã fix tương tự.

**Files changed:**
- `apps/web/modules/community/hooks/useCreatePost.ts` — unwrap SingleEnvelope
- `apps/web/modules/community/hooks/useCreateComment.ts` — unwrap SingleEnvelope
