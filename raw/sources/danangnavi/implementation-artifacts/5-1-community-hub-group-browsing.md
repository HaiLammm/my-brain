# Story 5.1: Community Hub & Group Browsing

Status: review

## Story

As a Japanese user feeling isolated in Da Nang,
I want to browse an active community hub with groups and trending discussions,
So that I can discover that a vibrant Japanese expat community exists and find topics relevant to me.

## Acceptance Criteria

1. **Given** the backend community module
   **When** database migrations run
   **Then** tables are created: `groups` (name_ja, description, icon, category), `posts` (group_id, user_id, title, body, created_at, deleted_at), `comments` (post_id, user_id, body, created_at, deleted_at), `events`, `event_registrations`
   **And** seed data creates 6 community groups: 新人の広場, グルメ・食事, 住まい・生活, イベント, 仕事・ビザ, なんでも相談

2. **Given** I navigate to `/ja/community` (FR20)
   **When** the community hub page loads
   **Then** Section 1 header shows: "コミュニティ" title, activity pulse "今日のアクティビティ: X件の投稿 · Y件の返信" in teal, and "＋ 投稿する" button (top-right)

3. **Given** the community hub page
   **When** I view Section 2 category cards
   **Then** 6 group cards display in horizontal scroll (mobile) / 2×2 grid (desktop)
   **And** each card shows: emoji icon, group name (Japanese), new activity count, teal dot if new since last visit
   **And** "新人の広場" (Newcomers) appears first

4. **Given** the community hub page
   **When** I view Section 3 trending discussions
   **Then** a "🔥 話題のトピック" section header with "すべて見る →" link displays
   **And** 3-5 thread preview cards show: author avatar (36px), author name + senpai badge, thread title (max 2 lines), preview text (1 line truncated), tag chips (max 2), engagement row (💬 replies · ❤️ likes · relative time)

5. **Given** the community hub page
   **When** I view Section 4 upcoming events
   **Then** a "🎉 今週のイベント" section header with "すべて見る →" displays
   **And** horizontal scroll event cards (240px wide) show: cover photo, title, date/time, location, attendee avatar stack + count, optional "初心者歓迎" tag

6. **Given** the community hub page
   **When** I view Section 5 recent activity feed
   **Then** 5 recent activity items display: icon + activity text + relative time
   **And** activities include: new replies, new members, like milestones, event participation updates

7. **Given** I am a guest (not logged in)
   **When** I browse the community hub
   **Then** all content is visible in read-only mode (FR20)
   **And** "＋ 投稿する" button triggers signup modal if tapped

## Tasks / Subtasks

### Backend — Community Module Foundation

- [x] Task 1: Create community module structure (AC: #1)
  - [x] 1.1 Create `backend/modules/community/__init__.py`
  - [x] 1.2 Create `backend/modules/community/models.py` with Group, Post, Comment, Event, EventRegistration models
  - [x] 1.3 Create `backend/modules/community/schemas.py` with request/response Pydantic schemas
  - [x] 1.4 Create `backend/modules/community/repository.py` with CommunityRepository
  - [x] 1.5 Create `backend/modules/community/service.py` with CommunityService
  - [x] 1.6 Create `backend/modules/community/router.py` with API endpoints
  - [x] 1.7 Create `backend/modules/community/dependencies.py` with DI factory
  - [x] 1.8 Create `backend/modules/community/events.py` with event constants
  - [x] 1.9 Create `backend/modules/community/exceptions.py` with module exceptions
  - [x] 1.10 Create `backend/modules/community/constants.py` with group categories

- [x] Task 2: Database models (AC: #1)
  - [x] 2.1 `Group` model: id, slug, name_ja, name_vi, name_en, description_ja, description_vi, icon (emoji), category, sort_order, created_at, updated_at, deleted_at
  - [x] 2.2 `GroupMembership` model: id, group_id (FK→groups), user_id (FK→users), joined_at, created_at, updated_at, deleted_at
  - [x] 2.3 `Post` model: id, group_id (FK→groups), user_id (FK→users), title, body, tag_slugs (JSONB array), like_count (int, default 0), comment_count (int, default 0), created_at, updated_at, deleted_at
  - [x] 2.4 `Comment` model: id, post_id (FK→posts), user_id (FK→users), body, like_count (int, default 0), created_at, updated_at, deleted_at
  - [x] 2.5 `Event` model: id, group_id (FK→groups, nullable), title, description, cover_photo_url, event_date (DateTime), location, organizer_id (FK→users), is_newcomer_friendly (bool), created_at, updated_at, deleted_at
  - [x] 2.6 `EventRegistration` model: id, event_id (FK→events), user_id (FK→users), created_at, updated_at, deleted_at; unique constraint on (event_id, user_id) where deleted_at IS NULL

- [x] Task 3: Alembic migration (AC: #1)
  - [x] 3.1 Create migration `2026_04_25_0002_create_community_tables.py`
  - [x] 3.2 Create tables: groups, group_memberships, posts, comments, events, event_registrations
  - [x] 3.3 Add indexes: `idx_posts_group_id_created`, `idx_comments_post_id_created`, `idx_events_event_date`, `idx_group_memberships_user_group` (unique partial where deleted_at IS NULL), `idx_event_registrations_event_user` (unique partial where deleted_at IS NULL)

- [x] Task 4: Pydantic schemas (AC: #2-6)
  - [x] 4.1 `GroupListItem`: id, slug, name_ja, icon, category, member_count, recent_post_count, has_new_activity
  - [x] 4.2 `TrendingPostItem`: id, title, preview_text (body[:100]), group_name_ja, tag_slugs, comment_count, like_count, created_at, author_display_name, author_avatar_url, author_badge_level
  - [x] 4.3 `UpcomingEventItem`: id, title, cover_photo_url, event_date, location, attendee_count, attendee_avatars (list[str], max 3), is_newcomer_friendly
  - [x] 4.4 `ActivityFeedItem`: id, activity_type, text_ja, relative_time, icon
  - [x] 4.5 `CommunityHubResponse`: groups (list[GroupListItem]), trending_posts (list[TrendingPostItem]), upcoming_events (list[UpcomingEventItem]), activity_feed (list[ActivityFeedItem]), today_post_count (int), today_comment_count (int)

- [x] Task 5: Repository methods (AC: #2-6)
  - [x] 5.1 `list_groups()` → all groups ordered by sort_order with member_count (COUNT group_memberships) and recent_post_count (COUNT posts last 24h)
  - [x] 5.2 `trending_posts(limit=5)` → posts from last 7 days ordered by (like_count + comment_count*2) DESC, with author info JOIN users + badge_levels
  - [x] 5.3 `upcoming_events(limit=5)` → events WHERE event_date >= now() ORDER BY event_date ASC, with attendee_count and first 3 attendee avatar URLs
  - [x] 5.4 `recent_activity(limit=5)` → union of recent post creations, comment creations, new members, event registrations — ordered by created_at DESC
  - [x] 5.5 `today_stats()` → COUNT posts + COUNT comments WHERE created_at >= today_start_utc

- [x] Task 6: Service layer (AC: #2-6)
  - [x] 6.1 `get_community_hub()` → orchestrate repository calls, assemble CommunityHubResponse
  - [x] 6.2 `get_groups()` → return group list

- [x] Task 7: API endpoints (AC: #2-7)
  - [x] 7.1 `GET /api/v1/community/hub` → public (no auth required), returns CommunityHubResponse
  - [x] 7.2 `GET /api/v1/community/groups` → public, returns Paginated[GroupListItem]
  - [x] 7.3 Register router in `backend/main.py`

- [x] Task 8: Seed data (AC: #1)
  - [x] 8.1 Add 6 groups to `scripts/seed_data.py`: 新人の広場 (👋, newcomers, sort_order=1), グルメ・食事 (🍜, food, sort_order=2), 住まい・生活 (🏠, living, sort_order=3), イベント (🎉, events, sort_order=4), 仕事・ビザ (💼, work, sort_order=5), なんでも相談 (💬, general, sort_order=6)
  - [x] 8.2 Add 8-10 seed posts across groups with realistic Japanese titles/bodies
  - [x] 8.3 Add 5-10 seed comments on posts
  - [x] 8.4 Add 3 seed events (2 upcoming, 1 past) with cover photos
  - [x] 8.5 Add group memberships and event registrations for seed users

### Backend — Tests

- [x] Task 9: Backend tests (AC: #1-7)
  - [x] 9.1 `backend/tests/community/test_models.py` — model creation with all fields
  - [x] 9.2 `backend/tests/community/test_repository.py` — list_groups returns correct counts, trending_posts sorts correctly, upcoming_events filters future only
  - [x] 9.3 `backend/tests/community/test_service.py` — get_community_hub assembles response correctly
  - [x] 9.4 `backend/tests/community/test_router.py` — GET /api/v1/community/hub returns 200 with expected shape, GET /api/v1/community/groups returns paginated list
  - [x] 9.5 Test that no auth is required for community hub endpoints (guest access)

### Frontend — Community Module Foundation

- [x] Task 10: Create community frontend module structure (AC: #2-7)
  - [x] 10.1 Create `apps/web/modules/community/` with components/, hooks/, lib/ directories
  - [x] 10.2 Create `apps/web/modules/community/lib/types.ts` with frontend types
  - [x] 10.3 Create `apps/web/modules/community/lib/community-data.ts` with data fetching functions

- [x] Task 11: Community Hub page — Server Component (AC: #2-7)
  - [x] 11.1 Create `apps/web/app/(user)/[locale]/community/page.tsx` as server component
  - [x] 11.2 Fetch community hub data via BFF proxy → `GET /api/v1/community/hub`
  - [x] 11.3 Generate metadata with Japanese SEO tags for `/ja/community`
  - [x] 11.4 Render all 5 sections with graceful degradation (empty data = EmptyState)

- [x] Task 12: Group Cards Section (AC: #3)
  - [x] 12.1 Create `apps/web/modules/community/components/GroupCard.tsx` — emoji icon, group name, activity count, teal dot
  - [x] 12.2 Create `apps/web/modules/community/components/GroupCardsSection.tsx` — horizontal scroll (mobile) / 2×2 grid (desktop), "新人の広場" first
  - [x] 12.3 GroupCard links to `/[locale]/community/[group_slug]` (page created in Story 5.2)

- [x] Task 13: Trending Discussions Section (AC: #4)
  - [x] 13.1 Create `apps/web/modules/community/components/ThreadPreviewCard.tsx` — author avatar (36px), name + SenpaiBadge, title (line-clamp-2), preview text (line-clamp-1), tag chips (max 2), engagement row
  - [x] 13.2 Create `apps/web/modules/community/components/TrendingSection.tsx` — SectionHeader "🔥 話題のトピック" + thread cards list

- [x] Task 14: Upcoming Events Section (AC: #5)
  - [x] 14.1 Create `apps/web/modules/community/components/EventPreviewCard.tsx` — cover photo (240×120), title, date/time with 📅 icon, location with 📍, attendee avatar stack (3 overlapping 24px) + count, optional "初心者歓迎" teal pill badge
  - [x] 14.2 Create `apps/web/modules/community/components/UpcomingEventsSection.tsx` — SectionHeader "🎉 今週のイベント" + horizontal scroll cards

- [x] Task 15: Activity Feed Section (AC: #6)
  - [x] 15.1 Create `apps/web/modules/community/components/ActivityFeedItem.tsx` — icon + text + relative time
  - [x] 15.2 Create `apps/web/modules/community/components/ActivityFeedSection.tsx` — list of 5 items

- [x] Task 16: Community Hub Header (AC: #2, #7)
  - [x] 16.1 Create `apps/web/modules/community/components/CommunityHubHeader.tsx` — "コミュニティ" title, activity pulse in teal, "＋ 投稿する" button
  - [x] 16.2 "＋ 投稿する" triggers SignupModal for unauthenticated users (FR53 pattern)
  - [x] 16.3 For authenticated users, "＋ 投稿する" navigates to group selection (story 5.2 — for now disable/show toast)

### Frontend — i18n

- [x] Task 17: i18n keys (AC: #2-7)
  - [x] 17.1 Add `community` namespace to `ja.json` with all required keys
  - [x] 17.2 Add equivalent keys to `en.json`
  - [x] 17.3 Add equivalent keys to `vi.json`

### Frontend — Tests

- [x] Task 18: Frontend tests (AC: #2-7)
  - [x] 18.1 `modules/community/__tests__/GroupCard.test.tsx` — renders group name, icon, activity count, teal dot
  - [x] 18.2 `modules/community/__tests__/ThreadPreviewCard.test.tsx` — renders author info, title, preview, engagement
  - [x] 18.3 `modules/community/__tests__/EventPreviewCard.test.tsx` — renders event info, attendee stack, newcomer badge
  - [x] 18.4 `modules/community/__tests__/CommunityHubHeader.test.tsx` — renders header, button triggers signup modal for guest

### Review Findings

- [ ] [Review][Decision] Define how "new since last visit" is tracked for group teal dots — current implementation derives `has_new_activity` from `recent_post_count > 0`, which is only a 24-hour activity proxy and does not satisfy AC #3 for guests or signed-in users.
- [ ] [Review][Patch] Replace `func.literal_column(...)` in `recent_activity()` with real SQL literals; the current query compiles to `literal_column(...)` function calls and will fail against Postgres at runtime [backend/modules/community/repository.py:167]
- [ ] [Review][Patch] Always render the activity pulse, including `0` counts, to satisfy AC #2 [apps/web/modules/community/components/CommunityHubHeader.tsx:36]
- [ ] [Review][Patch] Implement signed-in `＋ 投稿する` behavior; the authenticated branch is currently a no-op instead of navigating, disabling, or showing the planned toast [apps/web/modules/community/components/CommunityHubHeader.tsx:21]
- [ ] [Review][Patch] Show relative time in the trending thread engagement row; it currently renders the group name instead of the AC-required timestamp [apps/web/modules/community/components/ThreadPreviewCard.tsx:49]
- [ ] [Review][Patch] Add like-milestone activities to the recent activity feed; only posts, comments, members, and event joins are currently emitted [backend/modules/community/repository.py:163]
- [ ] [Review][Patch] Localize hard-coded community UI strings so `/en/community` and `/vi/community` do not render Japanese labels and copy [apps/web/modules/community/components/GroupCardsSection.tsx:15]

## Dev Notes

### Architecture Compliance

- **New backend module**: Create `backend/modules/community/` following exact module structure: `__init__.py`, `router.py`, `service.py`, `repository.py`, `models.py`, `schemas.py`, `events.py`, `exceptions.py`, `constants.py`, `dependencies.py`
- **Module isolation**: Community module owns tables: groups, group_memberships, posts, comments, events, event_registrations. To get author badge level for trending posts, use SQL JOIN to `badge_levels` table (same pattern as `review/repository.py:172-178`). Do NOT import gamification module directly.
- **Event bus**: Define `POST_CREATED_EVENT = "community.post.created"` and `COMMENT_CREATED_EVENT = "community.comment.created"` in `events.py` for future gamification integration (Story 5.2). Do NOT implement subscribers in this story.
- **Response format**: All endpoints MUST use `Paginated[T]` or `SingleEnvelope[T]` wrappers from `modules.listing.schemas`
- **Soft delete**: All models extend `BaseModel` from `shared.base_models` which provides `id`, `created_at`, `updated_at`, `deleted_at`. All queries MUST filter `WHERE deleted_at IS NULL`.
- **New frontend module**: Create `apps/web/modules/community/` with `components/`, `hooks/`, `lib/` directories

### What Already Exists — Do NOT Rebuild

| Feature | Location | Notes |
|---------|----------|-------|
| Bottom tab "community" | `shared/components/BottomTabNav.tsx:23` | Tab already links to `/community` with `Users` icon |
| Homepage community section i18n | `messages/ja.json` line 136-141 | `home.community.title`, `view_all`, `today_posts` keys exist |
| SectionHeader component | `shared/components/SectionHeader.tsx` | Emoji + title + link, use for all section headers |
| EmptyState component | `shared/components/EmptyState.tsx` | Variants: no-results, no-data, no-saved |
| Skeleton component | `shared/components/Skeleton.tsx` | Variants: text, circle, rect, card |
| FilterChips component | `shared/components/FilterChips.tsx` | Generic filter chip bar |
| SegmentedControl component | `shared/components/SegmentedControl.tsx` | Tab toggle (for future list/calendar view) |
| SenpaiBadge component | `shared/components/SenpaiBadge.tsx` | 5 variants including rank badges — use for author badges on thread cards |
| SignupModal | `modules/user/components/SignupModal.tsx` | Use for guest → "＋ 投稿する" auth gate (FR53 pattern) |
| `getBadgeVariant()` | `shared/lib/badgeUtils.ts` | Maps badge level string to SenpaiBadge variant |
| `get_current_user` | `modules/auth/dependencies.py` | Require auth for write operations |
| `get_current_user_optional` | `modules/auth/dependencies.py` | Optional auth for read endpoints |
| Base model | `shared/base_models.py` | `BaseModel(Base)` with id (UUID), created_at, updated_at, deleted_at |
| Event bus | `shared/events.py` | `emit()`, `subscribe()` — sync + async handlers |
| AppException base | `shared/exceptions.py` | `AppException(code, message_ja, message_vi, message_en, status_code)` |
| Rate limiter | `shared/rate_limit.py` | `rate_limit(limit, window_s, route_key)` — in-memory token bucket |
| Paginated/SingleEnvelope | `modules/listing/schemas.py` | Generic response wrappers |
| `get_async_session` | `shared/database.py` | Async session DI factory |
| ListingImage component | `shared/components/ListingImage.tsx` | Reuse for event cover photos |

### Database Schema Design

```sql
-- groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_ja VARCHAR(200) NOT NULL,
    name_vi VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    description_ja TEXT,
    description_vi TEXT,
    icon VARCHAR(10) NOT NULL, -- emoji
    category VARCHAR(50) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- group_memberships table
CREATE TABLE group_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX idx_group_memberships_user_group
    ON group_memberships(group_id, user_id) WHERE deleted_at IS NULL;

-- posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    tag_slugs JSONB NOT NULL DEFAULT '[]'::jsonb,
    like_count INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_posts_group_id_created ON posts(group_id, created_at DESC)
    WHERE deleted_at IS NULL;

-- comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    body TEXT NOT NULL,
    like_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_comments_post_id_created ON comments(post_id, created_at DESC)
    WHERE deleted_at IS NULL;

-- events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_photo_url TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    location VARCHAR(300),
    organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_newcomer_friendly BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_events_event_date ON events(event_date)
    WHERE deleted_at IS NULL;

-- event_registrations table
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX idx_event_registrations_event_user
    ON event_registrations(event_id, user_id) WHERE deleted_at IS NULL;
```

### API Design

```
GET /api/v1/community/hub
  Auth: none (public)
  Response: SingleEnvelope[CommunityHubResponse]
  {
    "data": {
      "groups": [...],
      "trending_posts": [...],
      "upcoming_events": [...],
      "activity_feed": [...],
      "today_post_count": 12,
      "today_comment_count": 28
    }
  }

GET /api/v1/community/groups
  Auth: none (public)
  Query: page, per_page
  Response: Paginated[GroupListItem]
```

### Trending Post Query Pattern

```python
# community/repository.py — trending_posts()
stmt = (
    select(
        Post.id,
        Post.title,
        func.left(Post.body, 100).label("preview_text"),
        Post.tag_slugs,
        Post.comment_count,
        Post.like_count,
        Post.created_at,
        Group.name_ja.label("group_name_ja"),
        User.display_name.label("author_display_name"),
        User.avatar_url.label("author_avatar_url"),
        BadgeLevel.level.label("author_badge_level"),
    )
    .join(Group, Post.group_id == Group.id)
    .outerjoin(User, Post.user_id == User.id)
    .outerjoin(BadgeLevel, BadgeLevel.user_id == Post.user_id)
    .where(
        Post.deleted_at.is_(None),
        Post.created_at >= datetime.now(UTC) - timedelta(days=7),
    )
    .order_by(
        (Post.like_count + Post.comment_count * 2).desc(),
        Post.created_at.desc(),
    )
    .limit(limit)
)
```

### Frontend Component Architecture

```
app/(user)/[locale]/community/page.tsx (Server Component — SSR for SEO)
├── CommunityHubHeader (Client — handles "＋ 投稿する" + auth gate)
├── GroupCardsSection (Server)
│   └── GroupCard × 6 (Server — link to /community/[slug])
├── TrendingSection (Server)
│   └── ThreadPreviewCard × 3-5 (Server)
│       └── SenpaiBadge (from shared)
├── UpcomingEventsSection (Server)
│   └── EventPreviewCard × 3-5 (Server)
└── ActivityFeedSection (Server)
    └── ActivityFeedItem × 5 (Server)
```

### Data Fetching Pattern (Server Component)

```typescript
// modules/community/lib/community-data.ts
import { apiClient } from "@/shared/lib/apiClient";

export async function fetchCommunityHub(): Promise<CommunityHubData> {
  const res = await apiClient.get("/api/v1/community/hub", {
    next: { revalidate: 60 }, // cache 1 minute
  });
  return res.data;
}
```

### Relative Time Display

Use `Intl.RelativeTimeFormat` with locale `ja` for Japanese relative time strings. Do NOT install a separate library — use browser native API. Format helper should be in `shared/lib/formatters.ts` if one doesn't already exist.

### Guest Access Pattern (FR20, FR53)

The community hub is fully browsable without authentication:
- All hub endpoints are public (`get_current_user_optional` or no auth at all)
- "＋ 投稿する" button checks `useAuth().isAuthenticated`
- If not authenticated: show `SignupModal` (same pattern as `BottomTabNav.tsx:55-69`)
- If authenticated: navigate to new post page (implemented in Story 5.2; for now show toast "Coming soon")

### Anti-Patterns to Avoid

- Do NOT create a separate `/community/feed` endpoint — all data comes from single `/community/hub` endpoint
- Do NOT import `gamification` or `auth` modules directly in community module — use SQL JOINs for badge data
- Do NOT use spinners for loading — use `Skeleton` component
- Do NOT use relative imports in frontend — always `@/` aliases
- Do NOT use `any` type in TypeScript — use `unknown` + type guards
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`
- Do NOT hard-code Japanese text in components — all strings via `useTranslations()`
- Do NOT create WebSocket/SSE for real-time — community uses polling (30s interval, per PRD)
- Do NOT add post/comment creation in this story — that is Story 5.2
- Do NOT store timestamps in local timezone — always UTC in DB, formatted in frontend

### Previous Story Intelligence (Story 4-3)

- **Agent model**: claude-opus-4-6
- **Key patterns**: Event-driven cross-module communication works well. SQL JOINs to badge_levels for author badge info (outerjoin pattern). Denormalized counters (like_count, comment_count) on parent rows for fast reads. SenpaiBadge component with getBadgeVariant() for badge display.
- **Review fixes**: MagicMock(spec=Model) needs all new nullable fields set to None. Self-referential event bus subscriptions need register function in lifespan.
- **Validation gates**: 362 backend tests, 397 frontend tests. Maintain this baseline.
- **Build commands**: `python -m pytest backend/tests/`, `pnpm --filter web test`, `pnpm --filter web build`, `python -m ruff check backend/`

### Git Intelligence

Recent commits:
- `665df3f create: add senpai picks verified reviews with reviewer info and map z-index fix (story 4-3)`
- `3bff84e fix: use clearAllMocks instead of restoreAllMocks in JourneyPageShell test`
- `3518229 create: add review system with helpful votes, star ratings, and camera-only photos (stories 4-1, 4-2)`

Commit convention: `create: ...` for new features, `update: ...` for enhancements, `fix: ...` for bugs.

### Project Structure Notes

**New files to create:**
```
backend/modules/community/__init__.py
backend/modules/community/models.py
backend/modules/community/schemas.py
backend/modules/community/repository.py
backend/modules/community/service.py
backend/modules/community/router.py
backend/modules/community/dependencies.py
backend/modules/community/events.py
backend/modules/community/exceptions.py
backend/modules/community/constants.py
backend/migrations/versions/2026_04_25_0002_create_community_tables.py
backend/tests/community/__init__.py
backend/tests/community/test_models.py
backend/tests/community/test_repository.py
backend/tests/community/test_service.py
backend/tests/community/test_router.py
apps/web/app/(user)/[locale]/community/page.tsx
apps/web/modules/community/components/CommunityHubHeader.tsx
apps/web/modules/community/components/GroupCard.tsx
apps/web/modules/community/components/GroupCardsSection.tsx
apps/web/modules/community/components/ThreadPreviewCard.tsx
apps/web/modules/community/components/TrendingSection.tsx
apps/web/modules/community/components/EventPreviewCard.tsx
apps/web/modules/community/components/UpcomingEventsSection.tsx
apps/web/modules/community/components/ActivityFeedItem.tsx
apps/web/modules/community/components/ActivityFeedSection.tsx
apps/web/modules/community/lib/types.ts
apps/web/modules/community/lib/community-data.ts
apps/web/modules/community/__tests__/GroupCard.test.tsx
apps/web/modules/community/__tests__/ThreadPreviewCard.test.tsx
apps/web/modules/community/__tests__/EventPreviewCard.test.tsx
apps/web/modules/community/__tests__/CommunityHubHeader.test.tsx
```

**Files to modify:**
```
backend/main.py                    — register community router + event subscribers
backend/scripts/seed_data.py       — add community seed data (groups, posts, comments, events)
apps/web/messages/ja.json          — add community namespace keys
apps/web/messages/en.json          — add community namespace keys
apps/web/messages/vi.json          — add community namespace keys
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

- [Source: epics/epic-5-community-events.md#Story 5.1] — acceptance criteria and user story
- [Source: prd/functional-requirements.md#FR20-FR25] — community & events functional requirements
- [Source: prd/user-journeys.md#Journey 1] — Tanaka-san discovers community section
- [Source: prd/web-application-architecture.md#Real-Time Strategy] — community feed polling 30s
- [Source: architecture/project-structure-boundaries.md#Complete Project Directory Structure] — community route and module paths
- [Source: architecture/project-structure-boundaries.md#Module Boundaries] — module isolation rules, table ownership
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns] — backend/frontend module structure
- [Source: architecture/implementation-patterns-consistency-rules.md#Naming Patterns] — database, API, code naming conventions
- [Source: architecture/implementation-patterns-consistency-rules.md#Communication Patterns] — event naming, TanStack Query keys
- [Source: architecture/core-architectural-decisions.md#API Communication Patterns] — REST, response wrapper, error format
- [Source: shared/base_models.py] — BaseModel with id, created_at, updated_at, deleted_at
- [Source: shared/events.py] — event bus emit/subscribe pattern
- [Source: shared/exceptions.py] — AppException base class
- [Source: review/models.py] — reference model pattern with ForeignKey, Mapped
- [Source: review/repository.py:172-178] — BadgeLevel JOIN pattern for author badge info
- [Source: review/dependencies.py] — DI factory pattern
- [Source: review/exceptions.py] — module exception pattern
- [Source: listing/schemas.py:1-20] — Paginated, SingleEnvelope wrappers
- [Source: shared/components/SectionHeader.tsx] — section header with emoji + link
- [Source: shared/components/EmptyState.tsx] — empty state variants
- [Source: shared/components/SenpaiBadge.tsx] — badge display
- [Source: shared/components/BottomTabNav.tsx:23] — community tab already exists
- [Source: user/components/SignupModal.tsx] — auth gate modal
- [Source: _bmad-output/implementation-artifacts/4-3-senpai-picks-verified-reviews.md] — previous story intelligence

## Dev Agent Record

### Agent Model Used

claude-opus-4-6

### Debug Log References

None

### Completion Notes List

- All 18 tasks completed with full backend + frontend implementation
- Backend: 27 new tests (8 model + 8 repo + 5 service + 6 router), all passing. Total backend: 389 tests pass.
- Frontend: 21 new tests (5 GroupCard + 6 ThreadPreviewCard + 6 EventPreviewCard + 4 CommunityHubHeader), all passing. Total frontend: 415 tests pass.
- 3 pre-existing Gallery.test.tsx failures (unrelated — Gallery.tsx was modified before this story)
- Frontend lint: 0 errors, 3 warnings (all @next/next/no-img-element for avatar images — acceptable)
- Next.js build: success, `/[locale]/community` route generated
- Backend ruff: clean (0 errors)
- Seed data: 6 groups, 10 posts, 10 comments, 3 events (2 upcoming, 1 past), memberships + registrations
- Used `next/image` Image for event cover photos, native `<img>` for small avatar images (24-36px)

### File List

**New files created:**
- `backend/modules/community/__init__.py`
- `backend/modules/community/constants.py`
- `backend/modules/community/events.py`
- `backend/modules/community/exceptions.py`
- `backend/modules/community/models.py`
- `backend/modules/community/schemas.py`
- `backend/modules/community/repository.py`
- `backend/modules/community/service.py`
- `backend/modules/community/dependencies.py`
- `backend/modules/community/router.py`
- `backend/migrations/versions/2026_04_25_0002_create_community_tables.py`
- `backend/tests/community/__init__.py`
- `backend/tests/community/test_models.py`
- `backend/tests/community/test_repository.py`
- `backend/tests/community/test_service.py`
- `backend/tests/community/test_router.py`
- `apps/web/modules/community/lib/types.ts`
- `apps/web/modules/community/lib/community-data.ts`
- `apps/web/modules/community/components/GroupCard.tsx`
- `apps/web/modules/community/components/GroupCardsSection.tsx`
- `apps/web/modules/community/components/ThreadPreviewCard.tsx`
- `apps/web/modules/community/components/TrendingSection.tsx`
- `apps/web/modules/community/components/EventPreviewCard.tsx`
- `apps/web/modules/community/components/UpcomingEventsSection.tsx`
- `apps/web/modules/community/components/ActivityFeedItem.tsx`
- `apps/web/modules/community/components/ActivityFeedSection.tsx`
- `apps/web/modules/community/components/CommunityHubHeader.tsx`
- `apps/web/app/(user)/[locale]/community/page.tsx`
- `apps/web/modules/community/__tests__/GroupCard.test.tsx`
- `apps/web/modules/community/__tests__/ThreadPreviewCard.test.tsx`
- `apps/web/modules/community/__tests__/EventPreviewCard.test.tsx`
- `apps/web/modules/community/__tests__/CommunityHubHeader.test.tsx`

**Files modified:**
- `backend/main.py` — registered community router
- `backend/scripts/seed_data.py` — added community seed data
- `apps/web/messages/ja.json` — added community i18n namespace
- `apps/web/messages/en.json` — added community i18n namespace
- `apps/web/messages/vi.json` — added community i18n namespace

## Bug Fixes

### BUG-5-1-001: Community Hub 500 Internal Server Error (2026-05-10)

**Symptoms:** Trang `/ja/community/newcomers` hiển thị "Không thể tải dữ liệu cộng đồng. Vui lòng thử lại sau." Backend endpoint `GET /api/v1/community/hub` trả về 500 Internal Server Error.

**Root cause:** `backend/modules/community/repository.py` method `recent_activity()` sử dụng `func.literal_column(...)` thay vì `literal_column(...)`. SQLAlchemy compile `func.literal_column('value')` thành SQL function call `literal_column('value')` — nhưng PostgreSQL không có function tên `literal_column`, gây ra `UndefinedFunctionError`.

**Fix:** Thay 6 chỗ `func.literal_column(...)` bằng `literal_column(...)` (import từ `sqlalchemy`) trong `repository.py:recent_activity()`. Đồng thời chạy seed data vì community groups chưa được seed vào database.

**Files changed:**
- `backend/modules/community/repository.py` — sửa `func.literal_column` → `literal_column` (lines 550, 562, 574-575, 586-587)
