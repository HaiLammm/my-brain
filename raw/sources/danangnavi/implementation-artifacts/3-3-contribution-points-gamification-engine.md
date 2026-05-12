# Story 3.3: Contribution Points & Gamification Engine

Status: done

## Story

As a registered user,
I want to earn contribution points for my activity on the platform,
So that my engagement is recognized and I progress toward senpai status.

## Acceptance Criteria

1. **Given** the backend gamification module
   **When** database migrations run
   **Then** tables are created: `contribution_points` (user_id, action_type, points, created_at), `badge_levels` (user_id, level, upgraded_at)
   **And** point values are configured as constants: review=50, comment=10, photo=20, post=30, event_attendance=40, referral=100

2. **Given** I write a review (FR12)
   **When** the review is published
   **Then** the gamification service awards me 50 points via event bus (`review.review.created` → gamification handler)
   **And** my total points balance is updated
   **And** the point award is logged in `contribution_points` table

3. **Given** I post in a community group
   **When** the post is created
   **Then** 30 points are awarded via event bus (`community.post.created` → gamification handler)

4. **Given** I attend a community event
   **When** my attendance is confirmed
   **Then** 40 points are awarded

5. **Given** I view my contribution history (FR11)
   **When** I navigate to my profile
   **Then** my current points balance displays prominently
   **And** a history list shows each point award: action type, points earned, date
   **And** the API endpoint `GET /api/v1/gamification/me` returns my points, history, and current badge level

## Tasks / Subtasks

### Backend — New Gamification Module

- [x] Task 1: Create gamification module structure (AC: #1)
  - [x] 1.1 Create `backend/modules/gamification/__init__.py`
  - [x] 1.2 Create `backend/modules/gamification/models.py` — `ContributionPoint` and `BadgeLevel` SQLAlchemy models
  - [x] 1.3 Create `backend/modules/gamification/schemas.py` — Pydantic request/response schemas
  - [x] 1.4 Create `backend/modules/gamification/constants.py` — point values, badge thresholds, action types, badge level enum
  - [x] 1.5 Create `backend/modules/gamification/repository.py` — DB queries for points and badges
  - [x] 1.6 Create `backend/modules/gamification/service.py` — business logic: award points, check badge upgrade, get user summary
  - [x] 1.7 Create `backend/modules/gamification/events.py` — event name constants + subscriber handlers
  - [x] 1.8 Create `backend/modules/gamification/exceptions.py` — module-specific exceptions
  - [x] 1.9 Create `backend/modules/gamification/router.py` — API endpoints

- [x] Task 2: Database migration (AC: #1)
  - [x] 2.1 Create Alembic migration: `contribution_points` table (id UUID PK, user_id FK→users, action_type VARCHAR(50), points INTEGER, metadata_json JSONB, created_at TIMESTAMPTZ)
  - [x] 2.2 Create Alembic migration: `badge_levels` table (id UUID PK, user_id FK→users UNIQUE, level VARCHAR(30), total_points INTEGER, upgraded_at TIMESTAMPTZ, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
  - [x] 2.3 Add indexes: `idx_contribution_points_user_id`, `idx_contribution_points_user_action`, `idx_badge_levels_user_id`

- [x] Task 3: Gamification service implementation (AC: #2, #3, #4)
  - [x] 3.1 `award_points(user_id, action_type, metadata)` — insert into `contribution_points`, update `badge_levels.total_points` (upsert), check badge threshold, emit `gamification.user.badge_upgraded` if level changes
  - [x] 3.2 `get_user_summary(user_id)` — return total points, current badge level, point history (paginated)
  - [x] 3.3 `get_badge_level_for_points(total_points)` — pure function: 0-99=newcomer, 100-499=contributor, 500-1999=senpai, 2000+=expert_senpai

- [x] Task 4: Event subscribers (AC: #2, #3, #4)
  - [x] 4.1 Create `register_gamification_subscribers()` in events.py
  - [x] 4.2 Subscribe to `review.review.created` → award 50 points
  - [x] 4.3 Subscribe to `community.post.created` → award 30 points
  - [x] 4.4 Subscribe to `community.event.attendance_confirmed` → award 40 points
  - [x] 4.5 Register subscribers in `main.py` lifespan

- [x] Task 5: Gamification API endpoint (AC: #5)
  - [x] 5.1 `GET /api/v1/gamification/me` — requires authenticated user, returns `GamificationSummaryResponse`
  - [x] 5.2 `GET /api/v1/gamification/me/history` — paginated point history, returns `ContributionHistoryResponse`
  - [x] 5.3 Register gamification router in `main.py`

- [x] Task 6: Update auth profile stats endpoint (AC: #5)
  - [x] 6.1 Update `AuthService.get_profile_stats()` to query `badge_levels` table for real `total_points` and `level` instead of hardcoded 0/"newcomer"
  - [x] 6.2 Fallback: if no `badge_levels` row exists for user, return 0/"newcomer" (backward compatible)

- [x] Task 7: Backend tests
  - [x] 7.1 Test point award creates contribution_points row and updates badge_levels
  - [x] 7.2 Test badge level calculation for each threshold boundary (0, 99, 100, 499, 500, 1999, 2000)
  - [x] 7.3 Test badge upgrade emits `gamification.user.badge_upgraded` event
  - [x] 7.4 Test duplicate point guard (if applicable — same action should not award twice)
  - [x] 7.5 Test `GET /api/v1/gamification/me` returns correct summary
  - [x] 7.6 Test `GET /api/v1/gamification/me/history` with pagination
  - [x] 7.7 Test gamification endpoints without auth returns 401
  - [x] 7.8 Test auth profile stats now returns real points from badge_levels table

### Frontend — Profile Gamification Display

- [x] Task 8: Add contribution history to profile (AC: #5)
  - [x] 8.1 Create `apps/web/modules/user/components/ContributionHistory.tsx` — displays point awards timeline
  - [x] 8.2 Each entry: action icon (by type), action description, points earned (+50), relative timestamp
  - [x] 8.3 Load more button for pagination
  - [x] 8.4 EmptyState when no contribution history
  - [x] 8.5 Use TanStack Query key: `['gamification', 'history']`

- [x] Task 9: Update useUserProfile hook (AC: #5)
  - [x] 9.1 Add `gamificationQuery` to `useUserProfile.ts` — fetch `GET /api/v1/gamification/me`
  - [x] 9.2 Add `contributionHistoryQuery` as infinite query — fetch `GET /api/v1/gamification/me/history`
  - [x] 9.3 Define `GamificationSummary` and `ContributionEntry` TypeScript interfaces

- [x] Task 10: Update ProfileStats to link points card (AC: #5)
  - [x] 10.1 Make the points stat card clickable/tappable — scroll to ContributionHistory section or show expanded view
  - [x] 10.2 Display badge level label next to points (e.g., "新人" / "貢献者")

- [x] Task 11: Integrate ContributionHistory into ProfilePage (AC: #5)
  - [x] 11.1 Add `<ContributionHistory />` section to `ProfilePage.tsx` below ActivityTimeline
  - [x] 11.2 Section header: "貢献ポイント履歴" / "Contribution History"

- [x] Task 12: i18n translations
  - [x] 12.1 Add `gamification` namespace keys to `ja.json`, `en.json`, `vi.json`
  - [x] 12.2 Keys: points_label, history_title, empty_state, action types (review, comment, photo, post, event, referral), badge level names (newcomer, contributor, senpai, expert_senpai), points_earned format

- [x] Task 13: Frontend tests
  - [x] 13.1 Render test for ContributionHistory with data
  - [x] 13.2 Test ContributionHistory empty state
  - [x] 13.3 Test ProfileStats displays badge level label

## Dev Notes

### Architecture Compliance

- **New backend module**: Create `backend/modules/gamification/` following the standard module structure exactly: `__init__.py`, `router.py`, `service.py`, `repository.py`, `models.py`, `schemas.py`, `events.py`, `exceptions.py`, `constants.py`. [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns]
- **Module isolation**: Gamification module MUST NOT import any other module directly. Use event bus for cross-module communication. The gamification event handlers receive payloads from events emitted by other modules (review, community). [Source: architecture/implementation-patterns-consistency-rules.md#Process Patterns]
- **Auth stats cross-query**: Auth service already uses raw SQL to count reviews and favorites across module boundaries (`backend/modules/auth/service.py:499-537`). Follow the same pattern to query `badge_levels` table for `total_points` and `level`. This is consistent with existing architecture — read-only cross-table queries are acceptable.
- **Event bus**: Use `shared.events.subscribe()` and `shared.events.emit()` (`backend/shared/events.py`). Register subscribers in a `register_gamification_subscribers()` function, called from `main.py` lifespan alongside `register_notification_subscribers()` and `register_search_event_handlers()`.
- **Badge upgrade notification**: When a badge upgrade occurs, emit `gamification.user.badge_upgraded` event. This event is ALREADY subscribed by the notification module (`backend/modules/notification/subscribers.py:19,122-141`). The payload must include: `user_id`, `badge_label_ja`, `badge_label_vi`, `badge_label_en`, `total_points`. Notification template already exists (`backend/modules/notification/templates.py:36-44`).

### Database Models

**`contribution_points` table** (append-only log, similar to `activity_logs`):
```python
class ContributionPoint(BaseModel):
    __tablename__ = "contribution_points"
    user_id: UUID FK → users.id (CASCADE)
    action_type: String(50), NOT NULL  # "review", "comment", "photo", "post", "event_attendance", "referral"
    points: Integer, NOT NULL
    metadata_json: JSONB, default={}  # optional: listing_id, post_id, etc.
    # Inherits: id (UUID PK), created_at, updated_at, deleted_at from BaseModel
```

**`badge_levels` table** (one row per user, upserted on point award):
```python
class BadgeLevel(BaseModel):
    __tablename__ = "badge_levels"
    __table_args__ = (UniqueConstraint("user_id", name="uq_badge_levels_user_id"),)
    user_id: UUID FK → users.id (CASCADE), UNIQUE
    level: String(30), NOT NULL, default="newcomer"
    total_points: Integer, NOT NULL, default=0
    upgraded_at: DateTime(timezone=True), nullable  # when last level change happened
    # Inherits: id (UUID PK), created_at, updated_at, deleted_at from BaseModel
```

Use `BaseModel` from `shared.base_models` to get `id`, `created_at`, `updated_at`, `deleted_at` fields automatically.

### Point Value Constants

```python
# backend/modules/gamification/constants.py
class ActionType(enum.StrEnum):
    REVIEW = "review"
    COMMENT = "comment"
    PHOTO = "photo"
    POST = "post"
    EVENT_ATTENDANCE = "event_attendance"
    REFERRAL = "referral"

POINT_VALUES: dict[ActionType, int] = {
    ActionType.REVIEW: 50,
    ActionType.COMMENT: 10,
    ActionType.PHOTO: 20,
    ActionType.POST: 30,
    ActionType.EVENT_ATTENDANCE: 40,
    ActionType.REFERRAL: 100,
}

class BadgeLevelType(enum.StrEnum):
    NEWCOMER = "newcomer"
    CONTRIBUTOR = "contributor"
    SENPAI = "senpai"
    EXPERT_SENPAI = "expert_senpai"

BADGE_THRESHOLDS: list[tuple[int, BadgeLevelType]] = [
    (2000, BadgeLevelType.EXPERT_SENPAI),
    (500, BadgeLevelType.SENPAI),
    (100, BadgeLevelType.CONTRIBUTOR),
    (0, BadgeLevelType.NEWCOMER),
]
```

### Event Integration

**Events the gamification module subscribes to:**

| Event | Source Module | Exists Today? | Point Award |
|-------|-------------|---------------|-------------|
| `review.review.created` | review (Epic 4) | Event name defined in notification subscribers, NOT emitted yet | 50 pts |
| `community.post.created` | community (Epic 5) | NOT yet | 30 pts |
| `community.event.attendance_confirmed` | community (Epic 5) | NOT yet | 40 pts |

**Events the gamification module emits:**

| Event | Subscribers | Exists Today? |
|-------|------------|---------------|
| `gamification.user.badge_upgraded` | notification module (`on_contribution_milestone`) | YES — handler + template ready |

**Key insight**: The review write path (Epic 4) and community module (Epic 5) don't exist yet, so event handlers won't fire until those stories are implemented. This is fine — the gamification engine is infrastructure that future modules will activate by emitting the appropriate events.

**Event handler payload expectations:**

```python
# review.review.created payload (emitted by future Epic 4)
{
    "user_id": "uuid",           # reviewer
    "review_id": "uuid",
    "listing_id": "uuid",
    "reviewer_display_name": "str",
    # ... other review fields
}

# gamification.user.badge_upgraded payload (emitted by this module)
{
    "user_id": "uuid",
    "badge_label_ja": "先輩",     # Japanese label for notification
    "badge_label_vi": "Senpai",
    "badge_label_en": "Senpai",
    "total_points": 500,
}
```

### API Endpoints

**`GET /api/v1/gamification/me`** — Requires authenticated user
```json
{
  "data": {
    "total_points": 150,
    "badge_level": "contributor",
    "badge_labels": {
      "ja": "貢献者",
      "vi": "Người đóng góp",
      "en": "Contributor"
    },
    "next_level": "senpai",
    "points_to_next_level": 350
  }
}
```

**`GET /api/v1/gamification/me/history?page=1&per_page=10`** — Requires authenticated user
```json
{
  "data": [
    {
      "id": "uuid",
      "action_type": "review",
      "points": 50,
      "metadata": { "listing_id": "uuid" },
      "created_at": "2026-04-24T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "per_page": 10, "total": 25 }
}
```

### Pydantic Schemas

```python
# backend/modules/gamification/schemas.py
class GamificationSummaryResponse(BaseModel):
    total_points: int
    badge_level: str
    badge_labels: dict[str, str]  # {"ja": "...", "vi": "...", "en": "..."}
    next_level: str | None
    points_to_next_level: int | None

class ContributionPointOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    action_type: str
    points: int
    metadata_json: dict
    created_at: datetime

class ContributionHistoryResponse(BaseModel):
    data: list[ContributionPointOut]
    meta: PaginationMeta  # reuse from modules.listing.schemas
```

### Auth Profile Stats Update

In `backend/modules/auth/service.py`, update `get_profile_stats()`:

```python
# BEFORE (current — hardcoded):
total_points=0,
badge_level="newcomer",

# AFTER (query badge_levels table):
badge_row = (await self.session.execute(
    text("SELECT total_points, level FROM badge_levels WHERE user_id = :uid AND deleted_at IS NULL"),
    {"uid": user.id},
)).one_or_none()
total_points = badge_row.total_points if badge_row else 0
badge_level = badge_row.level if badge_row else "newcomer"
```

### Award Points Flow (Service Logic)

```
1. award_points(user_id, action_type, metadata) called by event handler
2. Look up point value from POINT_VALUES[action_type]
3. INSERT INTO contribution_points (user_id, action_type, points, metadata_json)
4. UPSERT badge_levels: 
   - If row exists: total_points += points, check if level changed
   - If no row: INSERT with total_points=points, level=calculate(points)
5. If level changed:
   - Update badge_levels.level and badge_levels.upgraded_at
   - Emit "gamification.user.badge_upgraded" event with badge labels
6. Commit transaction
```

### Badge Level Labels (for notifications)

```python
BADGE_LABELS: dict[str, dict[str, str]] = {
    "newcomer": {"ja": "新人", "vi": "Người mới", "en": "Newcomer"},
    "contributor": {"ja": "貢献者", "vi": "Người đóng góp", "en": "Contributor"},
    "senpai": {"ja": "先輩", "vi": "Senpai", "en": "Senpai"},
    "expert_senpai": {"ja": "エキスパート先輩", "vi": "Chuyên gia Senpai", "en": "Expert Senpai"},
}
```

### Frontend Integration

**New TypeScript interfaces** (in `useUserProfile.ts` or separate types file):
```typescript
interface GamificationSummary {
  totalPoints: number;
  badgeLevel: string;
  badgeLabels: { ja: string; vi: string; en: string };
  nextLevel: string | null;
  pointsToNextLevel: number | null;
}

interface ContributionEntry {
  id: string;
  actionType: string;
  points: number;
  metadataJson: Record<string, string>;
  createdAt: string;
}
```

**TanStack Query keys**: `['gamification', 'summary']`, `['gamification', 'history']`

**ContributionHistory component pattern**: Follow `ActivityTimeline.tsx` structure — vertical list, icon per type, load more pagination, EmptyState fallback, Skeleton loading.

**i18n namespace**: Add keys under `gamification` in all 3 locale files. Action type labels: `review` → "レビュー投稿" / "Viết đánh giá" / "Wrote a review", etc.

### Existing Components to Reuse

| Component | Location | Usage |
|-----------|----------|-------|
| Skeleton | `shared/components/Skeleton.tsx` | Loading states |
| EmptyState | `shared/components/EmptyState.tsx` | No contribution history |
| SenpaiBadge | `shared/components/SenpaiBadge.tsx` | Badge display (has rank variants) |
| ProfileStats | `modules/user/components/ProfileStats.tsx` | Already shows points card — update to show badge label and make tappable |
| ActivityTimeline | `modules/user/components/ActivityTimeline.tsx` | Reference for timeline UI pattern |
| useAuthStore | `shared/stores/useAuthStore.ts` | Get current user |
| apiClient | `shared/lib/apiClient.ts` | API calls with auto snake↔camel transform |
| PaginationMeta | `modules/listing/schemas.py` (backend) | Reuse for contribution history pagination |

### Existing SenpaiBadge Variants

The `SenpaiBadge` component (`shared/components/SenpaiBadge.tsx`) already defines these variants:
- `"rank-newcomer"` — gray, ニューカマー
- `"rank-contributor"` — teal, コントリビューター
- `"rank-senpai"` — green, 先輩
- `"rank-active"` — (exists but not directly matching badge levels)
- `"verified"` — 先輩認証済み

Map badge levels to SenpaiBadge variants: newcomer→rank-newcomer, contributor→rank-contributor, senpai→rank-senpai, expert_senpai→verified.

### Project Structure Notes

**New files to create:**
```
backend/modules/gamification/
├── __init__.py
├── constants.py
├── events.py
├── exceptions.py
├── models.py
├── repository.py
├── router.py
├── schemas.py
└── service.py

backend/tests/gamification/
├── __init__.py
├── test_service.py
└── test_router.py

backend/migrations/versions/
└── {date}_create_gamification_tables.py

apps/web/modules/user/components/
└── ContributionHistory.tsx

apps/web/modules/user/components/__tests__/
└── ContributionHistory.test.tsx
```

**Files to modify:**
```
backend/main.py                          — register gamification router + event subscribers
backend/modules/auth/service.py          — update get_profile_stats() to query badge_levels
apps/web/modules/user/hooks/useUserProfile.ts   — add gamification queries
apps/web/modules/user/components/ProfilePage.tsx — add ContributionHistory section
apps/web/modules/user/components/ProfileStats.tsx — add badge label, make points tappable
apps/web/messages/ja.json                — add gamification namespace
apps/web/messages/en.json                — add gamification namespace
apps/web/messages/vi.json                — add gamification namespace
```

### Anti-Patterns to Avoid

- Do NOT import gamification module directly in auth service — use raw SQL query on `badge_levels` table (consistent with existing reviews/favorites count pattern)
- Do NOT create gamification tables without proper indexes — `user_id` queries will be frequent
- Do NOT use auto-increment IDs — UUID v4 per architecture
- Do NOT hardcode Japanese strings in components — all via `useTranslations()`
- Do NOT use spinners — use Skeleton components
- Do NOT use `os.getenv()` — use `shared.config.settings`
- Do NOT import other modules directly in gamification — use event bus only
- Do NOT store timestamps in local timezone — UTC in DB
- Do NOT forget soft delete — `contribution_points` uses BaseModel (has `deleted_at`)
- Do NOT create a separate frontend module for gamification — components live in `modules/user/components/` since it's user-facing
- Do NOT duplicate Pydantic schemas as TypeScript types manually — the apiClient auto-transforms snake_case↔camelCase

### Previous Story Intelligence (Story 3.2)

- **Agent**: Story 3.2 was implemented by openai/gpt-5.4 (backend) and claude-opus-4-6 (frontend re-implementation)
- **Auth service pattern**: Profile stats uses raw SQL COUNT queries across module tables — follow same pattern for gamification data
- **Frontend pattern**: TanStack Query with `['auth', 'profile', 'stats']` keys, `useUserProfile` hook wraps all profile queries
- **Profile page composition**: `ProfileHeader` → `ProfileStats` → `ActivityTimeline` — new `ContributionHistory` section goes after `ActivityTimeline`
- **Testing**: 88 test files (366 tests) pass, lint clean, build succeeds — maintain this
- **i18n**: Profile keys in `profile` namespace, gamification keys should be in separate `gamification` namespace
- **FilterChips, QueryProvider, apiClient multipart** — all shared infrastructure was added in Story 3.2

### Git Intelligence

Recent commits show:
- `create: launch onboarding flow and restore clean quality gates` (Story 3.1)
- Feature commits with descriptive messages prefixed by story number
- Build verification (Next.js build must pass) is standard workflow
- Lint checks (ruff for backend, ESLint for frontend) are enforced

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

- [Source: epics/epic-3-user-onboarding-senpai-profile-system.md#Story 3.3]
- [Source: epics/epic-3-user-onboarding-senpai-profile-system.md#Story 3.4] — next story, badge display system
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns]
- [Source: architecture/implementation-patterns-consistency-rules.md#Communication Patterns]
- [Source: architecture/implementation-patterns-consistency-rules.md#Process Patterns]
- [Source: architecture/core-architectural-decisions.md#Data Architecture]
- [Source: prd/web-application-architecture.md#Implementation Stack]
- [Source: backend/shared/events.py] — event bus implementation
- [Source: backend/modules/notification/subscribers.py:19,122-141] — CONTRIBUTION_MILESTONE_EVENT handler
- [Source: backend/modules/notification/templates.py:36-44] — badge upgrade notification template
- [Source: backend/modules/auth/service.py:499-537] — profile stats with hardcoded points placeholder
- [Source: backend/shared/base_models.py] — BaseModel with id, created_at, updated_at, deleted_at

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4 (backend Tasks 1-7), claude-opus-4-6 (frontend Tasks 8-13)

### Debug Log References

- `python -m pytest tests/gamification tests/auth/test_profile.py`
- `python -m ruff check main.py modules/gamification modules/auth/service.py tests/gamification tests/auth/test_profile.py migrations/env.py migrations/versions/2026_04_24_0001_create_gamification_tables.py`
- `PYTHONPATH=. alembic -c migrations/alembic.ini upgrade head`
- `python -m pytest tests`
- `python -m ruff check .`

### Completion Notes List

- Implemented the backend gamification module with constants, SQLAlchemy models, repository, service, event subscribers, exceptions, schemas, and authenticated API routes.
- Added the Alembic migration for `contribution_points` and `badge_levels`, including the requested indexes, and verified the migration applies successfully.
- Registered gamification subscribers/router in `backend/main.py` and updated `AuthService.get_profile_stats()` to read real points and badge level from `badge_levels` with backward-compatible fallback values.
- Added backend tests for service thresholds, duplicate guard behavior, badge upgrade event emission, event subscriber wiring, gamification router responses, unauthenticated access, and auth profile stats integration.
- Implemented frontend Tasks 8-13: ContributionHistory component with pagination/empty state, gamification queries in useUserProfile hook (summary + infinite history), ProfileStats badge level label with tappable points card, i18n gamification namespace in 3 locales, and 4 frontend tests. All 89 test files (371 tests) pass, lint clean, build succeeds.

### File List

- `backend/main.py`
- `backend/migrations/env.py`
- `backend/migrations/versions/2026_04_24_0001_create_gamification_tables.py`
- `backend/modules/auth/service.py`
- `backend/modules/gamification/__init__.py`
- `backend/modules/gamification/constants.py`
- `backend/modules/gamification/events.py`
- `backend/modules/gamification/exceptions.py`
- `backend/modules/gamification/models.py`
- `backend/modules/gamification/repository.py`
- `backend/modules/gamification/router.py`
- `backend/modules/gamification/schemas.py`
- `backend/modules/gamification/service.py`
- `backend/tests/auth/test_profile.py`
- `backend/tests/gamification/__init__.py`
- `backend/tests/gamification/test_router.py`
- `backend/tests/gamification/test_service.py`
- `apps/web/modules/user/components/ContributionHistory.tsx`
- `apps/web/modules/user/components/ProfilePage.tsx`
- `apps/web/modules/user/components/ProfileStats.tsx`
- `apps/web/modules/user/hooks/useUserProfile.ts`
- `apps/web/modules/user/components/__tests__/ContributionHistory.test.tsx`
- `apps/web/modules/user/components/__tests__/ProfileStats.test.tsx`
- `apps/web/modules/user/components/__tests__/profileTestMessages.ts`
- `apps/web/modules/user/components/__tests__/PrivacySettings.test.tsx`
- `apps/web/messages/ja.json`
- `apps/web/messages/en.json`
- `apps/web/messages/vi.json`

### Review Findings

- [x] [Review][Patch] **CRITICAL** Race condition in `award_points` — FIXED: replaced read-modify-write with atomic INSERT ON CONFLICT DO UPDATE via `upsert_badge_points`
- [x] [Review][Patch] **HIGH** TOCTOU duplicate guard — FIXED: atomic upsert serializes per-user badge operations; dedup warning logged when metadata missing
- [x] [Review][Patch] **HIGH** Upsert race on badge_levels for new users — FIXED: INSERT ON CONFLICT handles concurrent inserts atomically
- [x] [Review][Patch] **MEDIUM** Dedup guard bypassed when event payload missing expected metadata key — FIXED: added warning log in service.award_points
- [x] [Review][Patch] **MEDIUM** `t(action_types.${actionType})` crashes on unknown action types — FIXED: added `t.has()` fallback in ContributionHistory
- [x] [Review][Patch] **MEDIUM** `tg(badge_levels.${badgeLevel})` crashes on unknown badge levels — FIXED: added `tg.has()` fallback in ProfileStats
- [x] [Review][Patch] **MEDIUM** badge_levels UniqueConstraint soft-delete conflict — FIXED: changed to partial unique index with `WHERE deleted_at IS NULL`
- [x] [Review][Patch] **MEDIUM** Frontend loading gate missing gamificationQuery.isLoading — FIXED: stats section now waits for gamification data
- [x] [Review][Patch] **LOW** JSON locale files lost trailing newline — FIXED: restored trailing newlines
- [x] [Review][Defer] Event subscriber transaction boundary — points commit independently of source transaction — deferred, event bus design; Epic 4/5 not yet implemented
- [x] [Review][Defer] No cache invalidation for gamification queries after point awards — deferred, review/post creation modules (Epic 4/5) don't exist yet
- [x] [Review][Defer] Offset-based pagination may skip/duplicate items when data changes between pages — deferred, common tradeoff
- [x] [Review][Defer] Event bus emit() runs handlers sequentially — deferred, pre-existing event bus design

## Change Log

- 2026-04-24: Backend Tasks 1-7 implemented by openai/gpt-5.4 — gamification module, migration, event subscribers, API endpoints, auth stats integration, backend tests.
- 2026-04-24: Frontend Tasks 8-13 implemented by claude-opus-4-6 — ContributionHistory component, useUserProfile gamification queries, ProfileStats badge level display, i18n gamification namespace (ja/en/vi), frontend tests. All 89 test files (371 tests) pass, lint clean, build succeeds.
