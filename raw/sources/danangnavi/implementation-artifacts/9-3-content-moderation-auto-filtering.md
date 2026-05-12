# Story 9.3: Content Moderation & Auto-Filtering

Status: review

## Story

As a platform admin,
I want automated content filtering and a human review queue,
so that harmful content is caught quickly while minimizing false positives.

## Acceptance Criteria

1. **Given** the backend moderation module (FR42), **when** database migrations run, **then** tables are created: `moderation_items` (content_type, content_id, flag_reason, status, reviewer_id, reviewed_at), `banned_keywords` (keyword, language, severity). Seed data populates an initial banned keywords list for Japanese and Vietnamese.

2. **Given** a user creates a review, post, or comment, **when** the content is submitted, **then** the moderation pipeline automatically: checks text against banned keywords list, runs spam detection scoring, flags content exceeding thresholds. Flagged items are added to the moderation queue with flag reason.

3. **Given** I navigate to `/admin/moderation` (FR43), **when** the moderation queue loads, **then** flagged items display in a priority-sorted list: content preview, flag reason, author info, flagged date, content type (review/post/comment). Filter options: All, Spam, Keywords, Image, Unreviewed.

4. **Given** I review a flagged item, **when** I select it, **then** full content displays with flagged portions highlighted. Action buttons show: "Approve" (removes flag, content stays), "Remove" (with reason template dropdown: spam, harassment, inappropriate, misinformation, other). Removing content soft-deletes it and notifies the author.

5. **Given** I need to escalate an issue (FR45), **when** I tap "Escalate", **then** a role selector shows available admin sub-roles (content lead, technical, business relations). I can add an escalation note. The item is reassigned with priority bump.

## Tasks / Subtasks

- [x] Task 1: Backend — Create `backend/modules/moderation/` module (AC: #1, #2)
  - [x] 1.1 Create module with standard structure: `__init__.py`, `constants.py`, `models.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`, `events.py`, `exceptions.py`
  - [x] 1.2 Define `ModerationItem` model: id (UUID), content_type (enum: review/post/comment), content_id (UUID), flag_reason (enum: banned_keyword/spam/image/manual), flag_detail (text — matched keyword or spam score), status (enum: pending/approved/removed/escalated), severity (enum: low/medium/high/critical), reviewer_id (FK→users, nullable), reviewed_at (datetime, nullable), escalated_to_role (nullable), escalation_note (text, nullable), removal_reason (enum: spam/harassment/inappropriate/misinformation/other, nullable), created_at, updated_at, deleted_at
  - [x] 1.3 Define `BannedKeyword` model: id (UUID), keyword (text), language (enum: ja/vi/en), severity (enum: low/medium/high/critical), is_active (boolean, default true), created_at, updated_at
  - [x] 1.4 Alembic migration for both tables + seed data (Japanese and Vietnamese banned keyword lists)
  - [x] 1.5 Pydantic schemas: `ModerationItemOut`, `ModerationListParams` (filters: content_type, flag_reason, status; pagination), `ModerationActionRequest` (action: approve/remove/escalate, removal_reason, escalation_note, escalated_to_role), `BannedKeywordOut`, `BannedKeywordCreateRequest`

- [x] Task 2: Backend — Auto-moderation pipeline (AC: #2)
  - [x] 2.1 `moderation/service.py` — `check_content(content_text, content_type, content_id, author_id)`: banned keyword matching (case-insensitive, both languages), spam score calculation, threshold-based flagging
  - [x] 2.2 Banned keyword checker: query active keywords, match against content text (substring match, case-insensitive). Flag if any match found; severity = max severity of matched keywords
  - [x] 2.3 Spam detection scoring: simple heuristic-based (excessive caps, repeated characters, URL density, emoji density). Score 0-100; flag if score > configurable threshold (default 70)
  - [x] 2.4 `moderation/events.py` — Subscribe to `review.created`, `post.created`, `comment.created` events. On event, call `check_content()` asynchronously
  - [x] 2.5 If content flagged: create `ModerationItem` with appropriate flag_reason and severity. Content remains visible but marked as under_review (do NOT auto-remove — minimize false positive impact)

- [x] Task 3: Backend — Admin moderation API endpoints (AC: #3, #4, #5)
  - [x] 3.1 Router at `/api/v1/admin/moderation/*`, protected by `require_role(UserRole.ADMIN)`
  - [x] 3.2 `GET /api/v1/admin/moderation/queue` — paginated list, sorted by severity DESC + created_at ASC (highest severity first, oldest within same severity). Filters: content_type, flag_reason, status
  - [x] 3.3 `GET /api/v1/admin/moderation/queue/{item_id}` — full item detail with content preview, author info, flagged portions
  - [x] 3.4 `POST /api/v1/admin/moderation/queue/{item_id}/action` — approve/remove/escalate. Approve: set status=approved, reviewer_id, reviewed_at. Remove: soft-delete the source content, set status=removed, log removal_reason, notify author. Escalate: set escalated_to_role, escalation_note, bump severity, set status=escalated
  - [x] 3.5 `GET /api/v1/admin/moderation/keywords` — list banned keywords (paginated, filterable by language)
  - [x] 3.6 `POST /api/v1/admin/moderation/keywords` — add new keyword
  - [x] 3.7 `DELETE /api/v1/admin/moderation/keywords/{keyword_id}` — soft-delete keyword
  - [x] 3.8 All moderation actions create audit log entries via existing `audit_logs` table (from story 9-2)
  - [x] 3.9 Register router in `backend/main.py`

- [x] Task 4: Backend — Cross-module content resolution (AC: #4)
  - [x] 4.1 Repository method to fetch source content by content_type + content_id: query `reviews`, `community_posts`, or comments table based on content_type
  - [x] 4.2 Soft-delete source content: call appropriate module's soft-delete. Use event bus pattern — emit `moderation.content_removed` event, let source modules handle their own deletion
  - [x] 4.3 Author notification on removal: emit `moderation.content_removed` event → notification module subscriber creates notification with removal reason in Vietnamese

- [x] Task 5: Backend tests (AC: all)
  - [x] 5.1 `backend/tests/moderation/` — test_repository.py, test_service.py, test_router.py
  - [x] 5.2 Test auto-moderation pipeline: keyword detection, spam scoring, threshold flagging
  - [x] 5.3 Test admin actions: approve, remove (with soft-delete verification), escalate
  - [x] 5.4 Test audit logging for all moderation actions
  - [x] 5.5 Test auth enforcement: only ADMIN role can access moderation endpoints

- [x] Task 6: Frontend — Moderation queue page (AC: #3, #4, #5)
  - [x] 6.1 Create `apps/web/app/(admin)/admin/moderation/page.tsx` — server component wrapper
  - [x] 6.2 `ModerationQueuePageClient.tsx` — client component with filter tabs (All/Spam/Keywords/Image/Unreviewed) and paginated table
  - [x] 6.3 `ModerationQueueTable.tsx` — table columns: content preview (truncated), flag reason badge, author name, flagged date, content type badge, severity badge
  - [x] 6.4 `ModerationItemDetailPanel.tsx` — slide-over panel with full content, flagged portions highlighted (bold/red), author profile link, metadata
  - [x] 6.5 `ModerationActionButtons.tsx` — Approve button, Remove button (opens modal), Escalate button (opens modal)
  - [x] 6.6 `RemoveContentModal.tsx` — reason template dropdown (spam/harassment/inappropriate/misinformation/other), confirm button
  - [x] 6.7 `EscalateModal.tsx` — admin sub-role selector (content_lead/technical/business_relations), escalation note textarea, confirm button
  - [x] 6.8 Hooks: `useModeration.ts` — `useModerationQueue()`, `useModerationItemDetail()`, `useModerationAction()`
  - [x] 6.9 Extend `adminApi.ts` with moderation API functions
  - [x] 6.10 All text bilingual via `useAdminLang()` (EN/VI)

- [x] Task 7: Frontend — Keyword management (supplementary)
  - [x] 7.1 `BannedKeywordsPanel.tsx` — collapsible section on moderation page or sub-tab. List keywords with language/severity badges, add/delete actions
  - [x] 7.2 Hook: `useBannedKeywords()` — list, add, delete

- [x] Task 8: Frontend tests
  - [x] 8.1 `__tests__/ModerationQueuePageClient.test.tsx` — renders queue, filters work, pagination
  - [x] 8.2 `__tests__/ModerationItemDetailPanel.test.tsx` — renders detail, action buttons
  - [x] 8.3 Test action modals render and submit correctly

- [x] Task 9: Navigation & Integration
  - [x] 9.1 Update `AdminSidebar.tsx` — add "Moderation" nav item pointing to `/admin/moderation`, visible to all admin sub-roles (content_lead sees it highlighted by default)
  - [x] 9.2 Verify BFF proxy handles `/api/admin/moderation/*` paths (should work via existing catch-all)

## Dev Notes

### Architecture Compliance

- **NEW module**: Create `backend/modules/moderation/` — this is a separate module from `backend/modules/admin/`. Architecture doc explicitly specifies this as its own module (FR42-FR45).
- Module owns tables: `moderation_items`, `banned_keywords`. Do NOT put these in the admin module.
- Admin module (`backend/modules/admin/`) is read-only aggregate. Moderation module has its own router under `/api/v1/admin/moderation/*` but uses `require_role(UserRole.ADMIN)` from auth dependencies.
- Follow existing 9-file module pattern: `__init__.py`, `constants.py`, `models.py`, `schemas.py`, `repository.py`, `service.py`, `router.py`, `events.py`, `exceptions.py`.
- Use `Depends()` for all cross-module access — NEVER direct module imports.

### Existing Code to Reuse — CRITICAL

| What | Where | How to Use |
|------|-------|------------|
| Admin auth dependencies | `backend/modules/auth/dependencies.py` | `require_role(UserRole.ADMIN)`, `require_admin_sub_role()` |
| UserRole/AdminSubRole enums | `backend/modules/auth/constants.py` | Import for role checks |
| Audit log system | `backend/modules/admin/models.py` + `repository.py` | Call `create_audit_log()` for all moderation actions |
| Event bus pattern | `backend/modules/*/events.py` | Subscribe to `review.created`, `post.created`, `comment.created` |
| Notification subscribers | `backend/modules/notification/subscribers.py` | Add subscriber for `moderation.content_removed` event |
| Notification templates | `backend/modules/notification/templates.py` | Add moderation-related notification templates |
| BaseModel | `backend/shared/base_models.py` | id (UUID), created_at, updated_at, deleted_at |
| Admin BFF proxy | `apps/web/app/api/admin/[...path]/route.ts` | Already proxies `/api/admin/*` → `/api/v1/admin/*` — moderation endpoints auto-covered |
| AdminSidebar | `apps/web/modules/admin/components/AdminSidebar.tsx` | Add moderation nav item |
| useAdminLang | `apps/web/modules/admin/components/AdminSidebar.tsx` | Bilingual labels pattern |
| adminApiClient | `apps/web/modules/admin/lib/adminApi.ts` | Extend with moderation API functions |
| TanStack Query hooks | `apps/web/modules/admin/hooks/useDashboard.ts` | Follow same pattern for moderation hooks |
| PaginationMeta | `backend/modules/listing/schemas.py` | Reuse for paginated moderation responses |
| Set-Cookie proxy fix | BFF route | Use `getSetCookie()` + `append()` (known bug fix) |

### Database Schema

**`moderation_items` table:**
```sql
CREATE TABLE moderation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(20) NOT NULL,  -- 'review', 'post', 'comment'
  content_id UUID NOT NULL,
  flag_reason VARCHAR(20) NOT NULL,   -- 'banned_keyword', 'spam', 'image', 'manual'
  flag_detail TEXT,                    -- matched keyword or spam score
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'removed', 'escalated'
  severity VARCHAR(10) NOT NULL DEFAULT 'medium',  -- 'low', 'medium', 'high', 'critical'
  reviewer_id UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  escalated_to_role VARCHAR(20),
  escalation_note TEXT,
  removal_reason VARCHAR(20),         -- 'spam', 'harassment', 'inappropriate', 'misinformation', 'other'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_moderation_items_status ON moderation_items(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_moderation_items_content ON moderation_items(content_type, content_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_moderation_items_severity ON moderation_items(severity, created_at) WHERE deleted_at IS NULL AND status = 'pending';
```

**`banned_keywords` table:**
```sql
CREATE TABLE banned_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  language VARCHAR(5) NOT NULL,       -- 'ja', 'vi', 'en'
  severity VARCHAR(10) NOT NULL DEFAULT 'medium',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_banned_keywords_unique ON banned_keywords(keyword, language);
```

### Content Source Tables (Read-Only Cross-Module)

| Content Type | Table | Module | Soft-Delete Field |
|---|---|---|---|
| review | `reviews` | review | `deleted_at` |
| post | `community_posts` | community | `deleted_at` |
| comment | `community_comments` (or similar) | community | `deleted_at` |

When removing content: emit event → let owning module handle the soft-delete. Do NOT directly UPDATE another module's table from moderation module.

### Event Flow

```
User submits content:
  review.created / post.created / comment.created
    → moderation.events.on_content_created()
      → moderation.service.check_content()
        → keyword check + spam score
        → if flagged: INSERT moderation_items

Admin removes content:
  POST /admin/moderation/queue/{id}/action {action: "remove"}
    → moderation.service.remove_content()
      → UPDATE moderation_items SET status='removed'
      → EMIT moderation.content_removed {content_type, content_id, reason}
        → source module subscriber: soft-delete content
        → notification subscriber: notify author
      → CREATE audit_log entry
```

### Spam Detection Scoring (Simple Heuristic)

Implement a simple rule-based scorer — no external AI service needed for MVP:
- Excessive CAPS ratio (>50% uppercase) → +25 points
- Repeated characters (3+ same char) → +15 points
- URL count (>2 URLs) → +20 points
- Very short content (<10 chars) with URL → +30 points
- Excessive emoji density (>30% emoji) → +10 points
- Score threshold: 70 = flag for review

Store threshold in `moderation/constants.py` for easy tuning.

### Frontend Patterns

- Client-side rendering for all admin pages (architecture decision: SSR for public, CSR for dashboards/admin).
- Path aliases: `@/` imports only, never relative `../`.
- Use existing Tailwind design tokens: `text-primary`, `bg-surface`, `border-default`, `text-text-secondary`.
- No next-intl in admin. Use `useAdminLang()` with `labelEn`/`labelVi` pattern.
- TanStack Query (`@tanstack/react-query`) for data fetching with appropriate `staleTime`.
- Filter tabs: implement as controlled state, pass as query params to API.
- Severity badges: use color coding — critical=red, high=orange, medium=yellow, low=gray.
- Flag reason badges: spam=purple, banned_keyword=red, image=blue, manual=gray.

### API Response Format

```json
// Queue list
{
  "data": [
    {
      "id": "uuid",
      "content_type": "review",
      "content_preview": "This place is terrible...",
      "flag_reason": "banned_keyword",
      "flag_detail": "matched: [keyword]",
      "severity": "high",
      "status": "pending",
      "author": { "id": "uuid", "display_name": "User" },
      "flagged_at": "2026-05-05T10:00:00Z",
      "content_type_label": "Review"
    }
  ],
  "meta": { "page": 1, "total": 50, "per_page": 20 }
}

// Action response
{ "data": { "id": "uuid", "status": "removed", "reviewed_at": "..." } }
```

### Error Codes

- `MODERATION_ITEM_NOT_FOUND` — 404
- `MODERATION_ITEM_ALREADY_RESOLVED` — 409 (item already approved/removed)
- `MODERATION_INVALID_ACTION` — 400 (e.g., escalate without specifying role)
- `ADMIN_UNAUTHORIZED` — 403

### Testing Standards

- Backend auth/security paths: 100% line coverage.
- Backend service layer: 80% line coverage.
- Use existing test fixtures from `backend/tests/conftest.py`.
- Frontend: Vitest + React Testing Library. Mock API responses via MSW or manual mocks.
- Test files: `backend/tests/moderation/`, `apps/web/modules/admin/components/__tests__/`.

### Project Structure

```
NEW FILES:
backend/modules/moderation/
├── __init__.py
├── constants.py          # Thresholds, enums, seed data
├── models.py             # ModerationItem, BannedKeyword
├── schemas.py            # Request/response models
├── repository.py         # DB queries
├── service.py            # Auto-filter pipeline + admin actions
├── router.py             # /api/v1/admin/moderation/*
├── events.py             # Subscribe to content events + emit moderation events
├── exceptions.py         # ModerationItemNotFoundError, etc.

backend/tests/moderation/
├── __init__.py
├── test_repository.py
├── test_service.py
├── test_router.py

backend/migrations/versions/XXXX_create_moderation_tables.py

apps/web/app/(admin)/admin/moderation/
├── page.tsx              # Server component wrapper

apps/web/modules/admin/components/
├── ModerationQueuePageClient.tsx
├── ModerationQueueTable.tsx
├── ModerationItemDetailPanel.tsx
├── ModerationActionButtons.tsx
├── RemoveContentModal.tsx
├── EscalateModal.tsx
├── BannedKeywordsPanel.tsx

apps/web/modules/admin/components/__tests__/
├── ModerationQueuePageClient.test.tsx
├── ModerationItemDetailPanel.test.tsx

apps/web/modules/admin/hooks/
├── useModeration.ts

MODIFIED FILES:
backend/main.py                                    # Register moderation router
backend/modules/notification/subscribers.py         # Add moderation.content_removed subscriber
backend/modules/notification/constants.py           # Add moderation notification type
backend/modules/notification/templates.py           # Add moderation notification templates
apps/web/modules/admin/components/AdminSidebar.tsx  # Add Moderation nav item
apps/web/modules/admin/lib/adminApi.ts              # Add moderation API functions
```

### Previous Story Intelligence (from 9-1 and 9-2)

- **Admin module pattern**: `backend/modules/admin/` has standard 9-file structure with read-only repository queries. Moderation is a SEPARATE module but follows same patterns.
- **Audit log integration**: Story 9-2 created `audit_logs` table with `admin_user_id`, `target_user_id`, `action`, `reason`, `metadata` (JSONB). Reuse `create_audit_log()` from admin repository — extend action enum with moderation-specific actions.
- **AdminSidebar nav**: Already has Dashboard, Users, Businesses items with active-state logic using `pathname.startsWith()`. Add Moderation item following same pattern.
- **BFF proxy**: Catch-all route at `apps/web/app/api/admin/[...path]/route.ts` proxies all `/api/admin/*` to backend. No changes needed.
- **useAdminLang()**: Bilingual pattern established — all labels need `labelEn`/`labelVi`.
- **asyncio.gather()**: Used in admin service for parallel queries — reuse for fetching content + author info in moderation detail endpoint.
- **Notification integration**: Story 9-2 added notification events for verify/reject/ban actions. Follow same pattern for moderation removal notifications.
- **User status column**: Story 9-2 added `status` (ACTIVE/SUSPENDED/BANNED) and `verification_status` columns to users table via migration.
- **ReviewDispute model**: Already exists in `backend/modules/review/models.py` with status workflow. Story 9-4 will build on this — be aware but don't touch it in this story.
- **lint note**: `pnpm lint:web` has pre-existing errors in translation/community modules — not this story's concern. Use scoped lint for changed files only.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-9-admin-panel-platform-governance.md#Story 9.3]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR42-FR45]
- [Source: _bmad-output/planning-artifacts/architecture/index.md — moderation module spec]
- [Source: backend/modules/admin/repository.py — audit log pattern]
- [Source: backend/modules/admin/service.py — asyncio.gather pattern]
- [Source: backend/modules/notification/subscribers.py — event subscriber pattern]
- [Source: backend/modules/review/models.py — ReviewDispute model (do not modify)]
- [Source: apps/web/modules/admin/components/AdminSidebar.tsx — nav item pattern]
- [Source: apps/web/modules/admin/hooks/useDashboard.ts — TanStack Query hook pattern]

## Dev Agent Record

### Agent Model Used

- `openai/gpt-5.4`

### Debug Log References

- `python -m compileall backend/modules/moderation backend/modules/review/events.py backend/modules/review/repository.py backend/modules/community/events.py backend/modules/community/repository.py backend/modules/notification/subscribers.py backend/main.py`
- `pytest backend/tests/moderation -q`
- `ruff check backend/modules/moderation backend/modules/review/events.py backend/modules/review/repository.py backend/modules/community/events.py backend/modules/community/repository.py backend/modules/notification/constants.py backend/modules/notification/subscribers.py backend/modules/notification/templates.py backend/tests/moderation backend/main.py`
- `pytest backend/tests -q`
- `npx vitest run modules/admin/components/__tests__/ModerationQueuePageClient.test.tsx modules/admin/components/__tests__/ModerationItemDetailPanel.test.tsx`
- `npx eslint modules/admin/components/ModerationQueuePageClient.tsx modules/admin/components/ModerationQueueTable.tsx modules/admin/components/ModerationItemDetailPanel.tsx modules/admin/components/ModerationActionButtons.tsx modules/admin/components/RemoveContentModal.tsx modules/admin/components/EscalateModal.tsx modules/admin/components/BannedKeywordsPanel.tsx modules/admin/components/AdminSidebar.tsx modules/admin/components/__tests__/ModerationQueuePageClient.test.tsx modules/admin/components/__tests__/ModerationItemDetailPanel.test.tsx modules/admin/hooks/useModeration.ts modules/admin/lib/adminApi.ts "app/(admin)/admin/moderation/page.tsx"`
- `npx vitest run`

### Completion Notes List

- Added a dedicated backend moderation module with seeded banned keywords, spam scoring heuristics, admin queue APIs, and moderation keyword management.
- Registered auto-moderation subscribers for review/post/comment creation and removal subscribers for review/community content so source tables are soft-deleted via the event bus.
- Added moderation removal notifications plus audit logging for moderation actions and keyword management.
- Built the admin moderation page, queue table, detail panel, action modals, bilingual copy, and banned keyword management UI.
- Expanded backend/frontend tests and updated notification preference expectations so the full backend and full web test suites stay green.

### File List

- `backend/main.py`
- `backend/migrations/versions/2026_05_05_0002_create_moderation_tables.py`
- `backend/modules/community/events.py`
- `backend/modules/community/repository.py`
- `backend/modules/moderation/__init__.py`
- `backend/modules/moderation/constants.py`
- `backend/modules/moderation/events.py`
- `backend/modules/moderation/exceptions.py`
- `backend/modules/moderation/models.py`
- `backend/modules/moderation/repository.py`
- `backend/modules/moderation/router.py`
- `backend/modules/moderation/schemas.py`
- `backend/modules/moderation/service.py`
- `backend/modules/notification/constants.py`
- `backend/modules/notification/subscribers.py`
- `backend/modules/notification/templates.py`
- `backend/modules/review/events.py`
- `backend/modules/review/repository.py`
- `backend/tests/moderation/__init__.py`
- `backend/tests/moderation/test_repository.py`
- `backend/tests/moderation/test_router.py`
- `backend/tests/moderation/test_service.py`
- `backend/tests/notification/test_service.py`
- `apps/web/app/(admin)/admin/moderation/page.tsx`
- `apps/web/modules/admin/components/AdminSidebar.tsx`
- `apps/web/modules/admin/components/BannedKeywordsPanel.tsx`
- `apps/web/modules/admin/components/EscalateModal.tsx`
- `apps/web/modules/admin/components/ModerationActionButtons.tsx`
- `apps/web/modules/admin/components/ModerationItemDetailPanel.tsx`
- `apps/web/modules/admin/components/ModerationQueuePageClient.tsx`
- `apps/web/modules/admin/components/ModerationQueueTable.tsx`
- `apps/web/modules/admin/components/RemoveContentModal.tsx`
- `apps/web/modules/admin/components/__tests__/ModerationItemDetailPanel.test.tsx`
- `apps/web/modules/admin/components/__tests__/ModerationQueuePageClient.test.tsx`
- `apps/web/modules/admin/hooks/useModeration.ts`
- `apps/web/modules/admin/lib/adminApi.ts`
