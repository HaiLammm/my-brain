# Story 3.4: Senpai Badge System

Status: review

## Story

As a user who has been active on the platform,
I want to earn senpai badge levels that display on my reviews and posts,
So that my contributions are recognized and other users can see my credibility.

## Acceptance Criteria

1. **Given** badge level thresholds (FR13)
   **When** my points reach a threshold
   **Then** the system automatically upgrades my badge level:
   **And** 0-99 points = Newcomer, 100-499 = Contributor, 500-1999 = Senpai, 2000+ = Expert Senpai
   **And** a notification is sent for badge upgrades via event bus (`gamification.user.badge_upgraded`)
   **Note**: Badge level calculation, auto-upgrade, and notification emission are already implemented in Story 3.3 (gamification service). This AC is satisfied by existing code.

2. **Given** my senpai badge (FR14)
   **When** my reviews or community posts are displayed
   **Then** a SenpaiBadge component shows my current level:
   **And** green verified variant for Expert Senpai
   **And** teal variant for Senpai/Contributor
   **And** gray variant for Newcomer
   **Note**: The `SenpaiBadge` component exists (`shared/components/SenpaiBadge.tsx`). This story creates the badge-to-variant mapping utility and public API for future review/post integration (review module = Epic 4, community = Epic 5).

3. **Given** a review displays on a listing page (FR73)
   **When** the reviewer has a senpai badge
   **Then** the review shows: avatar, display name, senpai badge, years in Da Nang, expertise tags
   **Note**: The review module (Epic 4) does not exist yet. This story provides the backend infrastructure (public badge endpoint, batch badge lookup) that Epic 4 will consume.

4. **Given** my user profile page (UX-DR36)
   **When** I view my senpai progress
   **Then** a visual progress tracker shows my journey: Newcomer -> Contributor -> Senpai -> Expert Senpai
   **And** current level is highlighted, next level threshold and remaining points are shown
   **And** a SenpaiTipCard (UX-DR25) with encouragement message appears below the tracker

## Tasks / Subtasks

### Backend -- Public Badge API

- [x] Task 1: Public badge summary endpoint (AC: #2, #3)
  - [x] 1.1 Add `GET /api/v1/gamification/users/{user_id}` to `router.py` -- no auth required, returns `SingleEnvelope[GamificationSummaryResponse]`
  - [x] 1.2 Reuse existing `GamificationService.get_user_summary(user_id)` -- it already accepts any user_id
  - [x] 1.3 Return 200 with default newcomer values (0 points, newcomer badge) when user has no badge_levels row -- this is already handled by service

- [x] Task 2: Batch badge lookup endpoint (AC: #3)
  - [x] 2.1 Add schema `BatchBadgeLookupRequest(user_ids: list[uuid.UUID])` with max 50 validation to `schemas.py`
  - [x] 2.2 Add schema `BadgeSummaryCompact(badge_level: BadgeLevelType, badge_labels: dict[str, str])` to `schemas.py`
  - [x] 2.3 Add schema `BatchBadgeLookupResponse(data: dict[str, BadgeSummaryCompact])` to `schemas.py`
  - [x] 2.4 Add `get_badge_levels_batch(user_ids: list[uuid.UUID])` to `repository.py` -- single query: `SELECT user_id, level, total_points FROM badge_levels WHERE user_id IN (:ids) AND deleted_at IS NULL`
  - [x] 2.5 Add `get_batch_badge_summaries(user_ids: list[uuid.UUID])` to `service.py` -- returns dict mapping user_id to BadgeSummaryCompact, fills missing users with newcomer defaults
  - [x] 2.6 Add `POST /api/v1/gamification/users/badges` to `router.py` -- no auth required, returns `SingleEnvelope[BatchBadgeLookupResponse]`

- [x] Task 3: Backend tests (AC: #2, #3)
  - [x] 3.1 Test `GET /api/v1/gamification/users/{user_id}` returns correct badge summary for user with points
  - [x] 3.2 Test `GET /api/v1/gamification/users/{user_id}` returns newcomer defaults for user without badge_levels row
  - [x] 3.3 Test `GET /api/v1/gamification/users/{nonexistent_uuid}` returns newcomer defaults (NOT 404)
  - [x] 3.4 Test `POST /api/v1/gamification/users/badges` returns badge data for multiple users
  - [x] 3.5 Test batch endpoint with empty user_ids returns empty dict
  - [x] 3.6 Test batch endpoint rejects list > 50 user_ids (422)
  - [x] 3.7 Test batch endpoint fills missing users with newcomer defaults

### Frontend -- Badge Utility

- [x] Task 4: Badge-to-variant mapping utility (AC: #2)
  - [x] 4.1 Create `apps/web/shared/lib/badgeUtils.ts`
  - [x] 4.2 Export `getBadgeVariant(badgeLevel: string): SenpaiBadgeVariant` function:
    - `"newcomer"` -> `"rank-newcomer"`
    - `"contributor"` -> `"rank-contributor"`
    - `"senpai"` -> `"rank-senpai"`
    - `"expert_senpai"` -> `"verified"`
    - default fallback: `"rank-newcomer"`
  - [x] 4.3 Export `BADGE_THRESHOLDS` constant array: `[{level, threshold, labelKey}]` for progress tracker use
  - [x] 4.4 Export `getBadgeProgressPercent(totalPoints: number, currentLevel: string): number` -- calculates progress within current tier (0-100%)

### Frontend -- SenpaiProgressTracker Component

- [x] Task 5: SenpaiProgressTracker component (AC: #4)
  - [x] 5.1 Create `apps/web/modules/user/components/SenpaiProgressTracker.tsx`
  - [x] 5.2 Props: `{ gamification: GamificationSummary; locale: string }`
  - [x] 5.3 Visual stepper showing 4 levels in order: Newcomer -> Contributor -> Senpai -> Expert Senpai
  - [x] 5.4 Each step shows: badge icon/dot, localized level name, threshold points
  - [x] 5.5 Current level highlighted with accent color and checkmark
  - [x] 5.6 Completed levels have green checkmarks
  - [x] 5.7 Next level shows remaining points in text-text-secondary
  - [x] 5.8 Progress bar between current and next level showing percentage filled
  - [x] 5.9 Use `SenpaiBadge` component to display current badge inline with the active step
  - [x] 5.10 Responsive: full-width on mobile, max-width 600px on desktop
  - [x] 5.11 Section header: i18n key `gamification.progress.title` ("先輩への道")
  - [x] 5.12 Use Skeleton loading state when gamification data is undefined

### Frontend -- SenpaiTipCard Component

- [x] Task 6: SenpaiTipCard component (AC: #4)
  - [x] 6.1 Create `apps/web/shared/components/SenpaiTipCard.tsx`
  - [x] 6.2 Props: `{ avatarUrl?: string; name: string; duration: string; quote: string; ctaLabel?: string; ctaHref?: string; className?: string }`
  - [x] 6.3 Layout per design spec: left border accent (#2EC4B6), white bg, card shadow
  - [x] 6.4 Avatar (40px circle), name + duration in secondary text, quote in body text with Japanese quotation marks
  - [x] 6.5 Optional CTA link in accent color
  - [x] 6.6 Responsive: full-width mobile, max-width 480px desktop
  - [x] 6.7 Desktop hover: `shadow-card-hover` with subtle lift

### Frontend -- Profile Integration

- [x] Task 7: Wire SenpaiProgressTracker + encouragement into ProfilePage (AC: #4)
  - [x] 7.1 Add `<SenpaiProgressTracker>` between `<ProfileStats>` and `<ActivityTimeline>` in `ProfilePage.tsx`
  - [x] 7.2 Pass `gamification={gamificationQuery.data}` and `locale={locale}` props
  - [x] 7.3 Add encouragement `<SenpaiTipCard>` below the progress tracker with level-appropriate message
  - [x] 7.4 Encouragement messages per level (from i18n):
    - Newcomer: "Start by writing your first review or joining a community group!"
    - Contributor: "You're making a difference! Keep sharing your knowledge."
    - Senpai: "You're a trusted senpai now. Your reviews help newcomers feel at home."
    - Expert Senpai: "You're a Da Nang expert! Consider writing guides for newcomers."
  - [x] 7.5 Use a generic senpai avatar/name for the tip card (i18n text, not real user data)

### Frontend -- i18n

- [x] Task 8: i18n translations (AC: #4)
  - [x] 8.1 Add keys under `gamification.progress` namespace in `ja.json`
  - [x] 8.2 Add keys under `gamification.encouragement` namespace in `ja.json`
  - [x] 8.3 Add equivalent keys in `en.json` and `vi.json`

### Frontend -- Tests

- [x] Task 9: Frontend tests (AC: #2, #4)
  - [x] 9.1 `apps/web/shared/lib/__tests__/badgeUtils.test.ts` -- test `getBadgeVariant` mapping for all 4 levels + unknown fallback
  - [x] 9.2 `apps/web/shared/lib/__tests__/badgeUtils.test.ts` -- test `getBadgeProgressPercent` boundaries
  - [x] 9.3 `apps/web/modules/user/components/__tests__/SenpaiProgressTracker.test.tsx` -- render test with contributor level data
  - [x] 9.4 `apps/web/modules/user/components/__tests__/SenpaiProgressTracker.test.tsx` -- render test with expert_senpai (max level)
  - [x] 9.5 `apps/web/shared/components/__tests__/SenpaiTipCard.test.tsx` -- render test with all props
  - [x] 9.6 `apps/web/shared/components/__tests__/SenpaiTipCard.test.tsx` -- render test without optional CTA

## Dev Notes

### Architecture Compliance

- **No new backend module**: Story 3.4 extends the existing `backend/modules/gamification/` module. Do NOT create a new module.
- **Module isolation**: New public endpoints still live in `gamification/router.py`. No cross-module imports needed -- the gamification service already has all necessary logic.
- **Public API pattern**: The new `GET /api/v1/gamification/users/{user_id}` endpoint does NOT use `get_current_user` dependency -- it's public. Follow the pattern of listing detail endpoint which is also public.
- **Batch endpoint**: Use `POST` (not `GET`) for the batch lookup because it accepts a request body with user_ids. Follow the same `SingleEnvelope` response wrapper.

### What Story 3.3 Already Provides

These are **ALREADY IMPLEMENTED** -- do NOT rebuild:

| Feature | Location | Notes |
|---------|----------|-------|
| Badge level calculation | `gamification/service.py:get_badge_level_for_points()` | Pure function: 0-99=newcomer, 100-499=contributor, 500-1999=senpai, 2000+=expert_senpai |
| Badge auto-upgrade | `gamification/service.py:award_points()` | Checks threshold after each point award, updates badge_levels table |
| Badge upgrade notification | `notification/subscribers.py:on_contribution_milestone()` | Already subscribes to `gamification.user.badge_upgraded` event |
| Notification template | `notification/templates.py:CONTRIBUTION_MILESTONE` | Localized congratulation messages |
| `GET /api/v1/gamification/me` | `gamification/router.py` | Returns total_points, badge_level, badge_labels, next_level, points_to_next_level |
| `GET /api/v1/gamification/me/history` | `gamification/router.py` | Paginated contribution history |
| GamificationSummaryResponse | `gamification/schemas.py` | Pydantic schema with all fields |
| Badge constants | `gamification/constants.py` | `BadgeLevelType`, `BADGE_THRESHOLDS`, `BADGE_LABELS`, `BADGE_UPGRADED_EVENT` |
| SenpaiBadge component | `shared/components/SenpaiBadge.tsx` | 5 variants: verified, rank-senpai, rank-contributor, rank-active, rank-newcomer |
| ProfileStats badge display | `modules/user/components/ProfileStats.tsx` | Shows badge level label next to points |
| ContributionHistory | `modules/user/components/ContributionHistory.tsx` | Full contribution history with pagination |
| gamification i18n | `messages/{ja,en,vi}.json` → `gamification` namespace | badge_levels, action_types, history labels |
| useUserProfile hook | `modules/user/hooks/useUserProfile.ts` | GamificationSummary + ContributionEntry types, queries for /me and /me/history |

### Badge Level to SenpaiBadge Variant Mapping

```typescript
// apps/web/shared/lib/badgeUtils.ts
import type { SenpaiBadgeVariant } from "@/shared/components/SenpaiBadge";

const BADGE_VARIANT_MAP: Record<string, SenpaiBadgeVariant> = {
  newcomer: "rank-newcomer",
  contributor: "rank-contributor",
  senpai: "rank-senpai",
  expert_senpai: "verified",
};

export function getBadgeVariant(badgeLevel: string): SenpaiBadgeVariant {
  return BADGE_VARIANT_MAP[badgeLevel] ?? "rank-newcomer";
}
```

### SenpaiProgressTracker Design

Visual stepper layout (mobile-first):

```
 [Section Title: "先輩への道"]
 
 ✅ 新人 (0 pts)          ← completed, green check
 ─────── progress bar ──────
 ✅ 貢献者 (100 pts)       ← completed, green check  
 ─────── progress bar ──────
 ⬤ 先輩 (500 pts)         ← CURRENT, accent highlight + SenpaiBadge
 ═══════ 45% filled ═══════  ← partial progress to next level
 ○ エキスパート先輩 (2000 pts) ← future, gray
```

Progress percentage between current and next level:
```typescript
export function getBadgeProgressPercent(totalPoints: number, currentLevel: string): number {
  const levels = [
    { level: "newcomer", threshold: 0 },
    { level: "contributor", threshold: 100 },
    { level: "senpai", threshold: 500 },
    { level: "expert_senpai", threshold: 2000 },
  ];
  const currentIdx = levels.findIndex(l => l.level === currentLevel);
  if (currentIdx === -1 || currentIdx === levels.length - 1) return 100;
  const currentThreshold = levels[currentIdx].threshold;
  const nextThreshold = levels[currentIdx + 1].threshold;
  return Math.min(100, Math.round(((totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100));
}
```

### SenpaiTipCard Design Spec

From `_bmad-output/D-Design-System/components/senpai-tip-card.md`:
- White background, 1px border `#E5E7EB`, 3px left border accent `#2EC4B6`
- 12px border-radius, 16px padding, card shadow
- Avatar: 40px circle
- Name: 14px SemiBold, duration: 12px Regular secondary
- Quote: 16px Regular, Japanese quotation marks (opening quote mark)
- Optional CTA link in accent color

Tailwind implementation:
```tsx
<div className="rounded-xl border border-gray-200 border-l-[3px] border-l-accent bg-surface-white p-4 shadow-card">
  <div className="flex gap-3">
    <img src={avatarUrl} className="h-10 w-10 rounded-full" />
    <div>
      <p className="text-sm font-semibold">{name}</p>
      <p className="text-xs text-text-secondary">{duration}</p>
    </div>
  </div>
  <p className="mt-3 text-base italic text-text-primary">{quote}</p>
</div>
```

### Batch Badge Endpoint Schema

```python
# New schemas in gamification/schemas.py
class BatchBadgeLookupRequest(BaseModel):
    user_ids: list[uuid.UUID] = Field(..., max_length=50)

class BadgeSummaryCompact(BaseModel):
    badge_level: BadgeLevelType = BadgeLevelType.NEWCOMER
    badge_labels: dict[str, str] = Field(default_factory=dict)

class BatchBadgeLookupResponse(BaseModel):
    data: dict[str, BadgeSummaryCompact] = Field(default_factory=dict)
```

### Repository Batch Query

```python
# New method in gamification/repository.py
async def get_badge_levels_batch(
    self, user_ids: list[uuid.UUID]
) -> list[BadgeLevel]:
    result = await self.session.execute(
        select(BadgeLevel).where(
            BadgeLevel.user_id.in_(user_ids),
            BadgeLevel.deleted_at.is_(None),
        )
    )
    return list(result.scalars().all())
```

### Event Integration Notes

The `gamification.user.badge_upgraded` event is already:
- **Emitted by**: `gamification/service.py:award_points()` when level changes
- **Consumed by**: `notification/subscribers.py:on_contribution_milestone()` which creates an in-app notification
- **No additional event wiring needed** for this story

### Frontend Component Placement in ProfilePage

```tsx
// ProfilePage.tsx — updated section order:
<ProfileHeader />
<ProfileStats />
<SenpaiProgressTracker gamification={gamificationQuery.data} locale={locale} />
{/* SenpaiTipCard rendered inside SenpaiProgressTracker based on current level */}
<ActivityTimeline />
<ContributionHistory />
```

### Existing Components to Reuse

| Component | Location | Usage in This Story |
|-----------|----------|---------------------|
| SenpaiBadge | `shared/components/SenpaiBadge.tsx` | Display in progress tracker active step |
| Skeleton | `shared/components/Skeleton.tsx` | Loading states for SenpaiProgressTracker |
| useTranslations | `next-intl` | All i18n text |
| GamificationSummary | `modules/user/hooks/useUserProfile.ts` | Type for SenpaiProgressTracker props |
| apiClient | `shared/lib/apiClient.ts` | For any new API calls |
| cn | `shared/lib/cn.ts` | Tailwind class merging |

### Future Integration (NOT in this story)

When Epic 4 (Reviews) is implemented:
- ReviewCard component will import `getBadgeVariant` from `shared/lib/badgeUtils.ts`
- Review API will use `POST /api/v1/gamification/users/badges` to batch-fetch reviewer badges
- ReviewCard will render `<SenpaiBadge variant={getBadgeVariant(reviewer.badgeLevel)} />` inline after display name

When Epic 5 (Community) is implemented:
- CommunityPost component will follow the same pattern for post author badges

### Anti-Patterns to Avoid

- Do NOT rebuild badge level calculation -- reuse `gamification/service.py:get_user_summary()`
- Do NOT rebuild SenpaiBadge component -- it exists in `shared/components/SenpaiBadge.tsx`
- Do NOT add auth requirement to public badge endpoints -- badge info is public
- Do NOT use spinners -- use Skeleton components for loading states
- Do NOT hardcode Japanese strings in components -- all via `useTranslations()`
- Do NOT import gamification module in other backend modules -- keep module isolation
- Do NOT create a new frontend module for badge system -- components live in `modules/user/components/` (SenpaiProgressTracker) and `shared/components/` (SenpaiTipCard)
- Do NOT use `any` type in TypeScript -- use proper types from `useUserProfile.ts`
- Do NOT forget `@/` path aliases for imports (NEVER relative `../` paths)
- Do NOT use `os.getenv()` in backend -- use `shared.config.settings`
- Do NOT return 404 for unknown user_id on public badge endpoint -- return newcomer defaults

### Project Structure Notes

**New files to create:**
```
apps/web/shared/lib/badgeUtils.ts
apps/web/shared/lib/__tests__/badgeUtils.test.ts
apps/web/shared/components/SenpaiTipCard.tsx
apps/web/shared/components/__tests__/SenpaiTipCard.test.tsx
apps/web/modules/user/components/SenpaiProgressTracker.tsx
apps/web/modules/user/components/__tests__/SenpaiProgressTracker.test.tsx
```

**Files to modify:**
```
backend/modules/gamification/router.py       -- add 2 new public endpoints
backend/modules/gamification/schemas.py      -- add batch lookup schemas
backend/modules/gamification/service.py      -- add get_batch_badge_summaries()
backend/modules/gamification/repository.py   -- add get_badge_levels_batch()
backend/tests/gamification/test_router.py    -- add tests for new endpoints
apps/web/modules/user/components/ProfilePage.tsx -- add SenpaiProgressTracker section
apps/web/messages/ja.json                    -- add progress + encouragement keys
apps/web/messages/en.json                    -- add progress + encouragement keys
apps/web/messages/vi.json                    -- add progress + encouragement keys
```

### Previous Story Intelligence (Story 3.3)

- **Agent models**: openai/gpt-5.4 (backend), claude-opus-4-6 (frontend)
- **Key learnings from code review**: Race condition in award_points was fixed with atomic upsert; i18n key crashes fixed with `t.has()` fallback; badge_levels unique constraint needed partial index for soft delete. Apply same defensive patterns.
- **Test suite**: 89 test files (371 tests) passed after story 3.3. Maintain this.
- **Build verification**: `python -m pytest backend/tests/`, `pnpm --filter web test`, `pnpm --filter web build` must all pass.
- **i18n pattern**: gamification keys use separate `gamification` namespace (NOT under `profile`)
- **Frontend loading gate**: ProfileStats waits for `gamificationQuery.isLoading` -- SenpaiProgressTracker should do the same

### Git Intelligence

Recent commits:
- `1ad9e22 create: add contribution points gamification engine` (Story 3.3)
- `11e11a6 create: add user profile page and editable profile APIs` (Story 3.2)
- `71a13ee create: launch onboarding flow and restore clean quality gates` (Story 3.1)
- Commit convention: `create: ...` for new features, `update: ...` for enhancements, `fix: ...` for bugs

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

- [Source: epics/epic-3-user-onboarding-senpai-profile-system.md#Story 3.4]
- [Source: epics/epic-3-user-onboarding-senpai-profile-system.md#Story 3.3] -- predecessor story
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns]
- [Source: architecture/implementation-patterns-consistency-rules.md#Communication Patterns]
- [Source: architecture/project-structure-boundaries.md#Module Boundaries]
- [Source: prd/web-application-architecture.md#Implementation Stack]
- [Source: D-Design-System/components/senpai-badge.md] -- SenpaiBadge design spec
- [Source: D-Design-System/components/senpai-tip-card.md] -- SenpaiTipCard design spec
- [Source: backend/modules/gamification/constants.py] -- badge levels, thresholds, labels
- [Source: backend/modules/gamification/service.py] -- badge upgrade logic, get_user_summary
- [Source: backend/modules/gamification/router.py] -- existing /me endpoints
- [Source: backend/modules/gamification/schemas.py] -- GamificationSummaryResponse
- [Source: backend/modules/notification/subscribers.py:19,122-141] -- badge upgrade handler
- [Source: backend/modules/notification/templates.py:36-44] -- badge notification template
- [Source: apps/web/shared/components/SenpaiBadge.tsx] -- existing badge component
- [Source: apps/web/modules/user/components/ProfilePage.tsx] -- profile page composition
- [Source: apps/web/modules/user/components/ProfileStats.tsx] -- stats with badge label
- [Source: apps/web/modules/user/hooks/useUserProfile.ts] -- GamificationSummary type, queries

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4 (backend validation recovery, frontend review patches)

### Debug Log References

- `python -m pytest backend/tests/gamification/test_router.py`
- `python -m pytest backend/tests/test_health.py`
- `python -m pytest backend/tests/gamification`
- `python -m pytest backend/tests`
- `python -m ruff check backend`
- `pnpm --filter web test -- --run`
- `pnpm --filter web lint`
- `pnpm --filter web build`

### Completion Notes List

- Implemented public `GET /api/v1/gamification/users/{user_id}` using the existing `GamificationService.get_user_summary()` flow with newcomer defaults preserved for missing badge rows.
- Added batch badge lookup request/response schemas plus repository and service support to resolve up to 50 user IDs in one query and fill missing users with newcomer badge defaults.
- Added public `POST /api/v1/gamification/users/badges` and covered router behavior for populated, empty, oversized, and partially missing user batches.
- Implemented frontend Tasks 4-9: badgeUtils utility (getBadgeVariant, getBadgeProgressPercent, BADGE_THRESHOLDS), SenpaiProgressTracker visual stepper component with 4-level progression and progress bars, SenpaiTipCard shared component per design spec with avatar/quote/CTA, SenpaiEncouragement wrapper with level-appropriate i18n messages, ProfilePage integration, i18n keys for progress/encouragement in 3 locales (ja/en/vi), and 5 new test files (badgeUtils, SenpaiProgressTracker, SenpaiTipCard).
- Resolved review patch for negative badge progress by clamping `getBadgeProgressPercent()` to the 0-100 range and covering the under-threshold case in unit tests.
- Resolved review patch for `SenpaiProgressTracker` by removing the unused `locale` prop and adding a safe fallback to the newcomer tier when an unknown badge level reaches the UI.
- Restored backend test isolation by clearing Redis-backed middleware rate-limit keys in `backend/tests/conftest.py`, which prevented unrelated suites from failing with global `429` responses.
- Validation gates passed on final state: backend 327 tests, frontend 91 files / 377 tests, backend lint, frontend lint, and Next.js build.

### File List

- `backend/tests/conftest.py`
- `backend/modules/gamification/router.py`
- `backend/modules/gamification/schemas.py`
- `backend/modules/gamification/service.py`
- `backend/modules/gamification/repository.py`
- `backend/tests/gamification/test_router.py`
- `apps/web/shared/lib/badgeUtils.ts`
- `apps/web/shared/lib/__tests__/badgeUtils.test.ts`
- `apps/web/shared/components/SenpaiTipCard.tsx`
- `apps/web/shared/components/__tests__/SenpaiTipCard.test.tsx`
- `apps/web/modules/user/components/SenpaiProgressTracker.tsx`
- `apps/web/modules/user/components/SenpaiEncouragement.tsx`
- `apps/web/modules/user/components/ProfilePage.tsx`
- `apps/web/modules/user/components/__tests__/SenpaiProgressTracker.test.tsx`
- `apps/web/modules/user/components/__tests__/profileTestMessages.ts`
- `apps/web/messages/ja.json`
- `apps/web/messages/en.json`
- `apps/web/messages/vi.json`

### Review Findings

- [x] [Review][Patch] Negative progress percent — `getBadgeProgressPercent` can return negative values when totalPoints < currentThreshold. Add `Math.max(0, ...)` guard. [badgeUtils.ts:39]
- [x] [Review][Patch] Unused `locale` prop — `SenpaiProgressTrackerProps` declares `locale: string` but it's never used. Remove from interface. [SenpaiProgressTracker.tsx:17]
- [x] [Review][Patch] Unknown badgeLevel silent failure — `getLevelIndex` returns -1 for unknown levels, causing all steps to render as "future" with no current indicator. Add fallback. [SenpaiProgressTracker.tsx:21]
- [x] [Review][Defer] Double-wrapped `data.data` in batch badge response — deferred, pre-existing API envelope pattern
- [x] [Review][Defer] No dedup of user_ids in batch endpoint — deferred, pre-existing
- [x] [Review][Defer] No SenpaiEncouragement unit test — deferred, not required by spec

## Change Log

- 2026-04-24: Resolved the remaining frontend review findings, added regression coverage for progress/fallback behavior, and fixed backend Redis rate-limit test isolation so the full validation suite passes again.
