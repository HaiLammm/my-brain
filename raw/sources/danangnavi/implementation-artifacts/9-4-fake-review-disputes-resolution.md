# Story 9.4: Fake Review Disputes & Resolution

Status: review

## Story

As a platform admin,
I want to investigate and resolve fake review complaints from business owners,
so that review integrity is maintained and business owners trust the platform.

## Acceptance Criteria

1. **Given** a business owner files a fake review complaint (from Epic 8, Story 8.4), **when** I navigate to `/admin/moderation/disputes` (FR44), **then** a dispute case list displays: business name, disputed review snippet, complaint reason, filing date, status (Open/Investigating/Resolved).

2. **Given** I open a dispute case, **when** the detail panel loads, **then** I see: the full review content, reviewer profile and history, business owner's complaint with evidence, review metadata (creation date, edit history).

3. **Given** I investigate the dispute, **when** I determine the review is fake, **then** I can "Confirm Fake" → soft-delete the review, notify the business owner of resolution, add warning/ban to the violating reviewer. The business owner receives a notification: "Khiếu nại của bạn đã được giải quyết".

4. **Given** I determine the review is legitimate, **when** I close the dispute, **then** I can "Reject Complaint" → mark dispute as resolved, notify business owner with explanation. The review remains published.

5. **Given** any dispute resolution action, **when** the action completes, **then** an audit log entry records: timestamp, admin, dispute_id, action taken, reason.

## Tasks / Subtasks

- [x] Task 1: Backend — Admin dispute API endpoints (AC: #1, #2)
  - [x] 1.1 Add dispute admin router at `/api/v1/admin/moderation/disputes/*` in `backend/modules/moderation/router.py`, protected by `require_role(UserRole.ADMIN)`
  - [x] 1.2 `GET /api/v1/admin/moderation/disputes` — paginated list of disputes with filters (status: pending/investigating/resolved_removed/resolved_rejected). Join `review_disputes` → `reviews` → `listings` → `users` to include: business name (from listing), review snippet (truncated body), complaint reason, filing date, status. Sort by created_at DESC (newest first). Return `Paginated[DisputeListItemResponse]`
  - [x] 1.3 `GET /api/v1/admin/moderation/disputes/{dispute_id}` — full detail: dispute info, full review content with ratings, reviewer profile (display_name, email, review count, account age, suspension history), business owner complaint (reason, evidence), review metadata (created_at, updated_at). Return `SingleEnvelope[DisputeDetailResponse]`
  - [x] 1.4 Pydantic schemas in `backend/modules/moderation/schemas.py`: `DisputeListItemResponse`, `DisputeDetailResponse`, `DisputeListParams` (status filter, pagination), `DisputeResolveRequest` (action: confirm_fake/reject_complaint, reason: text, reviewer_action: warn/ban/none — only for confirm_fake)

- [x] Task 2: Backend — Dispute resolution logic (AC: #3, #4, #5)
  - [x] 2.1 `POST /api/v1/admin/moderation/disputes/{dispute_id}/resolve` — accepts `DisputeResolveRequest`
  - [x] 2.2 "Confirm Fake" action: update dispute status → `resolved_removed`, set `resolved_at` + `resolver_id`. Soft-delete the review (`reviews.deleted_at = now()`). If `reviewer_action == 'warn'`: no status change, just audit log note. If `reviewer_action == 'ban'`: update reviewer `users.status = 'BANNED'` (reuse pattern from story 9-2)
  - [x] 2.3 "Reject Complaint" action: update dispute status → `resolved_rejected`, set `resolved_at` + `resolver_id`. Review stays published, no reviewer action
  - [x] 2.4 `POST /api/v1/admin/moderation/disputes/{dispute_id}/investigate` — update status from `pending` → `investigating` (admin begins investigation). Simple status transition endpoint
  - [x] 2.5 Audit log entry for every resolve action via `create_audit_log()` from `backend/modules/admin/repository.py`. Metadata includes: dispute_id, action, reason, reviewer_action (if applicable)
  - [x] 2.6 Emit events for notifications: `dispute.resolved_removed` → notify business owner ("Khiếu nại của bạn đã được giải quyết — review đã bị xoá"), `dispute.resolved_rejected` → notify business owner ("Khiếu nại đã được xem xét — review được xác định là hợp lệ"), `dispute.reviewer_banned` → notify reviewer ("Tài khoản của bạn đã bị khoá do vi phạm chính sách")

- [x] Task 3: Backend — Notification integration (AC: #3, #4)
  - [x] 3.1 Add notification templates in `backend/modules/notification/templates.py`: `DISPUTE_RESOLVED_REMOVED`, `DISPUTE_RESOLVED_REJECTED`, `DISPUTE_REVIEWER_BANNED`
  - [x] 3.2 Add event constants in `backend/modules/notification/constants.py`: dispute event types
  - [x] 3.3 Add subscribers in `backend/modules/notification/subscribers.py`: subscribe to `dispute.resolved_removed`, `dispute.resolved_rejected`, `dispute.reviewer_banned`

- [x] Task 4: Backend tests (AC: all)
  - [x] 4.1 `backend/tests/moderation/test_dispute_router.py` — test list disputes (paginated, filtered), detail view, resolve actions
  - [x] 4.2 Test "Confirm Fake": dispute status updated, review soft-deleted, reviewer warned/banned, audit log created, events emitted
  - [x] 4.3 Test "Reject Complaint": dispute status updated, review NOT deleted, audit log created, event emitted
  - [x] 4.4 Test "Investigate": status transitions from pending → investigating
  - [x] 4.5 Test auth enforcement: only ADMIN role can access dispute endpoints
  - [x] 4.6 Test edge cases: resolve already-resolved dispute (409), non-existent dispute (404)

- [x] Task 5: Frontend — Disputes page at `/admin/moderation/disputes` (AC: #1)
  - [x] 5.1 Create `apps/web/app/(admin)/admin/moderation/disputes/page.tsx` — server component wrapper
  - [x] 5.2 `DisputeQueuePageClient.tsx` in `apps/web/modules/admin/components/` — client component with status filter tabs (All/Open/Investigating/Resolved) and paginated table
  - [x] 5.3 `DisputeQueueTable.tsx` — table columns: business name, review snippet (truncated 80 chars), complaint reason badge, filing date, status badge (color-coded: Open=yellow, Investigating=blue, Resolved=green/red)
  - [x] 5.4 Pagination using existing `PaginationMeta` pattern from moderation queue

- [x] Task 6: Frontend — Dispute detail panel (AC: #2, #3, #4)
  - [x] 6.1 `DisputeDetailPanel.tsx` — slide-over or full-page detail view with sections: Review Content (full body, ratings, author info), Reviewer Profile (name, email, review count, account age, past violations), Business Complaint (reason, evidence text), Review Metadata (created_at, updated_at)
  - [x] 6.2 `DisputeResolveActions.tsx` — action buttons: "Begin Investigation" (pending→investigating), "Confirm Fake" (opens modal), "Reject Complaint" (opens modal). Buttons conditionally shown based on dispute status (integrated into DisputeDetailPanel)
  - [x] 6.3 `ConfirmFakeModal.tsx` — modal with: reason textarea (required), reviewer action radio (warn/ban/none), confirmation checkbox ("I confirm this review is fake"), submit button
  - [x] 6.4 `RejectComplaintModal.tsx` — modal with: explanation textarea (required, sent to business owner), submit button

- [x] Task 7: Frontend — API hooks and integration (AC: all)
  - [x] 7.1 Extend `apps/web/modules/admin/lib/adminApi.ts` with dispute API functions: `getDisputeQueue()`, `getDisputeDetail()`, `resolveDispute()`, `investigateDispute()`
  - [x] 7.2 Create `useDisputes.ts` hook in `apps/web/modules/admin/hooks/`: `useDisputeQueue()`, `useDisputeDetail()`, `useResolveDispute()`, `useInvestigateDispute()` — follow TanStack Query patterns from `useDashboard.ts`
  - [x] 7.3 All text bilingual via `useAdminLang()` (EN/VI)

- [x] Task 8: Frontend tests
  - [x] 8.1 `__tests__/DisputeQueuePageClient.test.tsx` — renders table, filters work, pagination
  - [x] 8.2 `__tests__/DisputeDetailPanel.test.tsx` — renders detail sections, action buttons (integrated into DisputeQueuePageClient tests)
  - [x] 8.3 Test resolve modals render and submit correctly (tested via page-level integration tests)

- [x] Task 9: Navigation & Integration
  - [x] 9.1 Update `AdminSidebar.tsx` — add "Disputes" sub-item under Moderation section, pointing to `/admin/moderation/disputes`
  - [x] 9.2 Verify BFF proxy handles `/api/admin/moderation/disputes/*` paths (covered by existing catch-all)
  - [x] 9.3 Register dispute routes in `backend/modules/moderation/router.py` (extend existing moderation router, NOT a new module)

## Dev Notes

### Architecture Compliance

- **EXTEND existing module**: Add dispute endpoints to `backend/modules/moderation/router.py` — do NOT create a new module. The `ReviewDispute` model already lives in `backend/modules/review/models.py` and stays there. Moderation module just queries it.
- Dispute admin routes go under `/api/v1/admin/moderation/disputes/*` — consistent with the existing `/api/v1/admin/moderation/queue/*` pattern from story 9-3.
- Use `Depends()` for cross-module access (review repository, admin audit log). NEVER direct module imports for business logic.
- Follow 9-file module pattern but only add to existing files (no new module directory).

### Existing Code to Reuse — CRITICAL

| What | Where | How to Use |
|------|-------|------------|
| `ReviewDispute` model | `backend/modules/review/models.py` | Already has statuses: pending/investigating/resolved_removed/resolved_rejected, reasons, evidence, resolver_id, resolved_at |
| `ReviewDisputeRepository` | `backend/modules/review/repository.py` | Has `create_dispute()`, `list_disputes_for_owner()`, `get_dispute()`, `find_existing_for_review()`. Extend with admin query methods or create new repository methods |
| Business owner dispute creation | `backend/modules/analytics/router.py` | `POST /api/v1/business/analytics/disputes` — already creates disputes. This story adds admin-side resolution |
| `ReviewDisputeForm.tsx` | `apps/web/modules/business/components/` | Business owner UI already exists — do NOT recreate. This story is admin-side only |
| Audit log system | `backend/modules/admin/models.py` + `repository.py` | Call `create_audit_log()` for all dispute resolution actions |
| Moderation queue UI pattern | `apps/web/modules/admin/components/ModerationQueuePageClient.tsx` | Follow exact same table/filter/detail panel pattern for disputes |
| `ModerationActionButtons.tsx` | `apps/web/modules/admin/components/` | Reuse pattern for dispute action buttons |
| `RemoveContentModal.tsx` | `apps/web/modules/admin/components/` | Reference pattern for ConfirmFakeModal/RejectComplaintModal |
| Notification templates | `backend/modules/notification/templates.py` | Add dispute resolution templates following existing pattern |
| Notification subscribers | `backend/modules/notification/subscribers.py` | Add dispute event subscribers following existing pattern |
| Event bus pattern | `backend/modules/review/events.py` | `REVIEW_DISPUTE_CREATED` already exists. Add `dispute.resolved_*` events |
| User status management | Story 9-2 pattern | Ban reviewer by setting `users.status = 'BANNED'` — same as user management |
| Admin BFF proxy | `apps/web/app/api/admin/[...path]/route.ts` | Auto-proxies `/api/admin/*` → `/api/v1/admin/*`. Dispute endpoints auto-covered |
| `useAdminLang()` | `apps/web/modules/admin/components/AdminSidebar.tsx` | Bilingual labels EN/VI for all dispute UI |
| `adminApiClient` | `apps/web/modules/admin/lib/adminApi.ts` | Extend with dispute API functions |
| TanStack Query hook pattern | `apps/web/modules/admin/hooks/useDashboard.ts` | Follow for useDisputeQueue, useDisputeDetail |
| Set-Cookie proxy fix | BFF route | Use `getSetCookie()` + `append()` (known bug fix from earlier stories) |
| PaginationMeta | `backend/modules/listing/schemas.py` | Reuse for paginated dispute list |

### Database Schema

**`review_disputes` table already exists** (created in story 8-4 migration):
```sql
-- Already in database, DO NOT create again
CREATE TABLE review_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  business_owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL,  -- 'fake_review', 'inappropriate_content', 'spam', 'other'
  evidence TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'investigating', 'resolved_removed', 'resolved_rejected'
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(review_id, business_owner_id)
);
```

**No new tables needed.** This story only adds:
- Admin API endpoints to query and resolve disputes
- Admin UI to view and manage disputes
- Notification templates for resolution outcomes

### Notification Templates to Add

```python
DISPUTE_RESOLVED_REMOVED = "dispute_resolved_removed"
# VI: "Khiếu nại của bạn đã được giải quyết — review đã bị xoá"
# EN: "Your complaint has been resolved — the review has been removed"

DISPUTE_RESOLVED_REJECTED = "dispute_resolved_rejected"
# VI: "Khiếu nại đã được xem xét — review được xác định là hợp lệ"
# EN: "Your complaint has been reviewed — the review was determined to be legitimate"

DISPUTE_REVIEWER_BANNED = "dispute_reviewer_banned"
# VI: "Tài khoản của bạn đã bị khoá do vi phạm chính sách review"
# EN: "Your account has been suspended due to review policy violation"
```

### API Response Patterns

Follow existing envelope pattern:
```python
# Single item
SingleEnvelope[DisputeDetailResponse] = { "data": { ... } }

# Paginated list
Paginated[DisputeListItemResponse] = { "data": [...], "meta": { "page": 1, "per_page": 20, "total": 42 } }
```

### Frontend Component Hierarchy

```
/admin/moderation/disputes (page.tsx)
└── DisputeQueuePageClient.tsx
    ├── Status filter tabs (All/Open/Investigating/Resolved)
    ├── DisputeQueueTable.tsx
    │   └── Rows: business name, review snippet, reason badge, date, status badge
    ├── Pagination controls
    └── DisputeDetailPanel.tsx (slide-over on row click)
        ├── Review content section
        ├── Reviewer profile section
        ├── Business complaint section
        ├── Review metadata section
        └── DisputeResolveActions.tsx
            ├── "Begin Investigation" button
            ├── "Confirm Fake" → ConfirmFakeModal.tsx
            └── "Reject Complaint" → RejectComplaintModal.tsx
```

### Previous Story Intelligence (from 9-3)

- Moderation module at `backend/modules/moderation/` already exists with full CRUD for moderation queue
- Admin sidebar pattern: add nav items in `AdminSidebar.tsx` with role-based visibility
- BFF proxy auto-covers all `/api/admin/*` routes
- `useAdminLang()` provides bilingual toggle for EN/VI
- TanStack Query hooks with `queryKey` arrays and mutation invalidation pattern established
- All admin actions must create audit log entries via `create_audit_log()`

### Project Structure Notes

- Backend dispute routes extend `backend/modules/moderation/router.py` (NOT a separate module)
- Frontend dispute components go in `apps/web/modules/admin/components/` (consistent with moderation queue)
- Frontend dispute hooks go in `apps/web/modules/admin/hooks/`
- Page route: `apps/web/app/(admin)/admin/moderation/disputes/page.tsx`
- Tests: `backend/tests/moderation/test_dispute_router.py`, frontend co-located `__tests__/`

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-9-admin-panel-platform-governance.md#Story 9.4]
- [Source: _bmad-output/planning-artifacts/prd/domain-specific-requirements.md#Fake Review Dispute Process]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR44]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md]
- [Source: backend/modules/review/models.py#ReviewDispute]
- [Source: backend/modules/review/repository.py#ReviewDisputeRepository]
- [Source: backend/modules/moderation/router.py — existing moderation endpoints]
- [Source: _bmad-output/implementation-artifacts/9-3-content-moderation-auto-filtering.md]

## Dev Agent Record

### Agent Model Used

GLM-5.1

### Debug Log References

### Completion Notes List

- Implemented admin dispute API endpoints: GET /disputes (paginated list with status filter), GET /disputes/{id} (full detail), POST /disputes/{id}/investigate (pending→investigating), POST /disputes/{id}/resolve (confirm_fake/reject_complaint)
- Dispute resolution logic: confirm_fake soft-deletes review + optional reviewer ban + audit log + event emission; reject_complaint updates status + audit log + event emission; investigate transitions status
- Added 3 notification templates + 3 notification event types + 3 event subscribers for dispute resolution notifications
- Backend tests: 8 router tests covering list, detail, investigate, resolve (confirm_fake + reject_complaint), auth enforcement, and validation edge cases
- Frontend: DisputeQueuePageClient with status filter tabs, DisputeQueueTable with paginated table, DisputeDetailPanel slide-over with review/reviewer/complaint/metadata sections, ConfirmFakeModal with reason+reviewer_action+confirm checkbox, RejectComplaintModal with explanation
- Frontend API: extended adminApi.ts with dispute functions, created useDisputes.ts hooks following TanStack Query pattern
- Admin sidebar updated with Disputes sub-item under Moderation section
- All bilingual text (EN/VI) via useAdminLang()

### File List

Backend:
- backend/modules/moderation/router.py — Added 4 dispute endpoints
- backend/modules/moderation/schemas.py — Added DisputeListParams, DisputeListItemResponse, DisputeDetailResponse, DisputeResolveRequest, DisputeInvestigateResponse, DisputeResolveOutcomeResponse, DisputeReviewerProfileResponse
- backend/modules/moderation/service.py — Added list_disputes, get_dispute_detail, investigate_dispute, resolve_dispute methods
- backend/modules/moderation/constants.py — Added dispute audit action + event constants
- backend/modules/moderation/exceptions.py — Added DisputeNotFoundException, DisputeAlreadyResolvedException
- backend/modules/review/repository.py — Extended ReviewDisputeRepository with list_disputes_admin and get_dispute_admin
- backend/modules/notification/constants.py — Added DISPUTE_RESOLVED_REMOVED, DISPUTE_RESOLVED_REJECTED, DISPUTE_REVIEWER_BANNED notification types
- backend/modules/notification/templates.py — Added 3 dispute notification templates
- backend/modules/notification/subscribers.py — Added 3 dispute event subscriber handlers + registrations
- backend/tests/moderation/test_dispute_router.py — New test file with 8 tests

Frontend:
- apps/web/modules/admin/lib/adminApi.ts — Extended with dispute API functions
- apps/web/modules/admin/hooks/useDisputes.ts — New hooks file
- apps/web/modules/admin/components/DisputeQueuePageClient.tsx — New page client component
- apps/web/modules/admin/components/DisputeQueueTable.tsx — New table component
- apps/web/modules/admin/components/DisputeDetailPanel.tsx — New detail panel component
- apps/web/modules/admin/components/ConfirmFakeModal.tsx — New modal component
- apps/web/modules/admin/components/RejectComplaintModal.tsx — New modal component
- apps/web/modules/admin/components/AdminSidebar.tsx — Updated with Disputes sub-item
- apps/web/modules/admin/components/__tests__/DisputeQueuePageClient.test.tsx — New test file
- apps/web/app/(admin)/admin/moderation/disputes/page.tsx — New page route
