# Story 9.2: User & Business Owner Management

Status: review

## Story

As a platform admin,
I want to manage user and business owner accounts with verification workflows,
so that I can maintain platform quality and trust.

## Acceptance Criteria

1. **User Management Page** (`/admin/users`): Searchable, sortable table displaying display_name, email, role, registration date, status (Active/Suspended/Banned), senpai level, last active date; search by name or email; server-side pagination
2. **User Detail Panel**: Full profile info with account details, activity summary (reviews count, posts count, event registrations), moderation history; action buttons: "Suspend" (with reason textarea), "Ban" (with reason + confirmation dialog), "Reactivate"
3. **Business Management Page** (`/admin/users/businesses`): Table displays business_name, owner display_name, category, registration date, verification status (Pending/Verified/Rejected/Suspended), listing count
4. **Business Verification Workflow**: For "Pending" businesses — verification panel shows business details, submitted documents/photos; actions: "Schedule Visit" (date picker), "Verify" (approve with notes), "Reject" (with reason template dropdown); status changes trigger notification to business owner
5. **Audit Logging**: All suspend/ban/verify/reject actions create audit log entries with timestamp, admin actor ID, action type, reason; affected users receive notifications

## Tasks / Subtasks

- [x] Task 1: Backend — Admin User Management API (AC: #1, #2)
  - [x] 1.1 Create Pydantic schemas: `AdminUserListParams` (search, sort_by, sort_order, page, per_page, role_filter, status_filter), `AdminUserOut` (extends UserOut with activity_summary, moderation_history), `AdminUserActionRequest` (action enum, reason)
  - [x] 1.2 Add repository methods: `list_users_paginated()`, `get_user_detail()`, `get_user_activity_summary()`, `get_user_moderation_history()`, `suspend_user()`, `ban_user()`, `reactivate_user()`
  - [x] 1.3 Add service methods with audit logging for every moderation action
  - [x] 1.4 Add router endpoints: `GET /api/v1/admin/users`, `GET /api/v1/admin/users/{user_id}`, `POST /api/v1/admin/users/{user_id}/action`
  - [x] 1.5 Backend tests for repository, service, router layers

- [x] Task 2: Backend — Business Owner Management & Verification API (AC: #3, #4)
  - [x] 2.1 Create schemas: `AdminBusinessListParams`, `AdminBusinessOut`, `VerificationActionRequest` (action: schedule_visit/verify/reject, notes, scheduled_date, reject_reason_template)
  - [x] 2.2 Add `verification_status` column to `users` table (or `listings` table — see Dev Notes) with enum: PENDING, VERIFIED, REJECTED, SUSPENDED
  - [x] 2.3 Repository methods: `list_businesses_paginated()`, `get_business_detail()`, `update_verification_status()`
  - [x] 2.4 Service methods with notification trigger on status change (use existing notification module events)
  - [x] 2.5 Router endpoints: `GET /api/v1/admin/users/businesses`, `GET /api/v1/admin/users/businesses/{user_id}`, `POST /api/v1/admin/users/businesses/{user_id}/verify`
  - [x] 2.6 Backend tests

- [x] Task 3: Backend — Audit Log System (AC: #5)
  - [x] 3.1 Create `audit_logs` table model: id (UUID), admin_user_id (FK→users), target_user_id (FK→users), action (enum), reason (text), metadata (JSONB), created_at
  - [x] 3.2 Repository method: `create_audit_log()`, `get_audit_logs_for_user()`
  - [x] 3.3 Integrate audit logging into user action and verification service methods
  - [x] 3.4 Backend tests

- [x] Task 4: Frontend — User Management Page (AC: #1, #2)
  - [x] 4.1 Create `apps/web/app/(admin)/admin/users/page.tsx` with server component shell
  - [x] 4.2 Create `UserManagementTable` component: sortable columns, search input, role/status filter dropdowns, pagination controls
  - [x] 4.3 Create `UserDetailPanel` component: slide-over or modal with profile info, activity summary cards, moderation history timeline, action buttons
  - [x] 4.4 Create action modals: `SuspendUserModal`, `BanUserModal` (with confirmation), `ReactivateConfirmDialog`
  - [x] 4.5 Add hooks: `useAdminUsers()`, `useAdminUserDetail()`, `useAdminUserAction()` using TanStack Query
  - [x] 4.6 Add API functions in `adminApi.ts`
  - [x] 4.7 Frontend tests

- [x] Task 5: Frontend — Business Management & Verification Pages (AC: #3, #4)
  - [x] 5.1 Create `apps/web/app/(admin)/admin/users/businesses/page.tsx`
  - [x] 5.2 Create `BusinessManagementTable` component with verification status badges
  - [x] 5.3 Create `BusinessVerificationPanel`: business details display, document/photo viewer, action buttons (Schedule Visit, Verify, Reject)
  - [x] 5.4 Create `VerificationActionModals`: date picker for schedule visit, notes textarea for verify, reason template dropdown for reject
  - [x] 5.5 Add hooks: `useAdminBusinesses()`, `useAdminBusinessDetail()`, `useAdminBusinessVerification()`
  - [x] 5.6 Frontend tests

- [x] Task 6: Integration & Navigation Update
  - [x] 6.1 Update `AdminSidebar.tsx` to ensure "Users" and "Businesses" links are active and role-filtered
  - [x] 6.2 Verify BFF proxy routes handle new `/api/admin/users/*` paths
  - [x] 6.3 End-to-end smoke test of full user management flow

## Dev Notes

### Architecture Compliance

- **Backend module**: Extend existing `backend/modules/admin/` — add user management endpoints to the existing admin router or create a sub-router. Do NOT create a separate module.
- **Repository pattern**: Follow the existing `AdminRepository` pattern in `backend/modules/admin/repository.py`. Add new query methods there.
- **Service layer**: Extend `AdminService` in `backend/modules/admin/service.py` with user/business management methods.
- **Auth enforcement**: Use `require_role(UserRole.ADMIN)` dependency on all new endpoints. For sub-role filtering, use `require_admin_sub_role("business")` for verification endpoints.
- **Dependency injection**: Follow FastAPI `Depends()` pattern — NEVER direct module imports between modules.

### Database & Models

- **User model** is in `backend/modules/auth/models.py` — the `users` table already has `role`, `admin_sub_role`, `is_active`, `business_name`, `phone_number`, `zalo_contact` fields.
- **User status**: Currently only `is_active` boolean exists. For Suspended/Banned states, add a `status` column (enum: ACTIVE, SUSPENDED, BANNED) to the `users` table via Alembic migration. Keep `is_active` as a computed property or sync it.
- **Verification status**: Add `verification_status` column to `users` table (applies to BUSINESS_OWNER role users). Enum: PENDING, VERIFIED, REJECTED, SUSPENDED. Default PENDING for new business owners.
- **Audit logs**: Create new `audit_logs` table owned by admin module. Do NOT put it in auth module.
- **Soft-delete awareness**: Always filter `WHERE deleted_at IS NULL` for user queries, matching existing patterns.
- **Naming conventions**: snake_case tables/columns, `idx_{table}_{columns}` for indexes, UUID primary keys.

### Frontend Patterns

- **File locations**: Components go in `apps/web/modules/admin/components/`, hooks in `apps/web/modules/admin/hooks/`, API functions in `apps/web/modules/admin/lib/adminApi.ts`.
- **No next-intl for admin**: Use `useAdminLang()` hook from existing AdminSidebar context. All labels need `labelEn`/`labelVi` variants.
- **Data fetching**: TanStack Query (`@tanstack/react-query`) with appropriate staleTime. Follow existing pattern in `useDashboard.ts`.
- **API client**: Use existing `adminApiClient` from `adminApi.ts` which handles snake_to_camel transformation and cookie-based auth.
- **BFF proxy**: The catch-all route `apps/web/app/api/admin/[...path]/route.ts` already proxies `/api/admin/*` → `/api/v1/admin/*`. New endpoints are automatically covered.
- **Design tokens**: Use existing Tailwind tokens (text-primary, bg-surface, border-default, etc.) matching admin sidebar styling.
- **Tables**: Use standard HTML table with Tailwind styling or create reusable `AdminTable` component if complexity warrants it. Check if a table component already exists before creating one.

### API Response Format

Follow existing architecture standard:
```json
// List response
{ "data": [...], "meta": { "page": 1, "total": 50, "per_page": 20 } }

// Single response
{ "data": { ... } }

// Error response
{ "error": { "code": "USER_NOT_FOUND", "message_en": "...", "message_vi": "...", "detail": null } }
```

Use existing `PaginationMeta` from `modules/listing/schemas.py` for pagination responses.

### Notification Integration

- When verification status changes, emit event via existing event bus pattern (see `backend/modules/*/events.py`).
- Notification module (`backend/modules/notification/`) listens for events and creates notifications.
- Business owner notification messages should be bilingual (Vietnamese primary, English secondary).

### Security Requirements

- Rate limiting: Admin API at 500/min (Redis-backed, already configured in middleware).
- Admin session expiry: 8 hours (480 min) — already enforced.
- CSRF: Double submit cookie pattern — already in middleware.
- All moderation actions MUST be audit-logged before returning success response.

### Testing Standards

- **Backend**: 100% coverage for auth/security paths, 80% for service layer. Use pytest + pytest-asyncio.
- **Frontend**: Vitest + React Testing Library. Test component rendering, user interactions, loading/error states.
- **Test file locations**: Backend tests in `backend/tests/admin/`, frontend tests in `apps/web/modules/admin/components/__tests__/`.

### Previous Story (9-1) Learnings

- Admin module structure already established at `backend/modules/admin/` with router.py, service.py, repository.py, schemas.py, constants.py.
- `asyncio.gather()` used for parallel query execution in service layer — reuse this pattern for aggregating user activity data.
- Revenue endpoints return placeholder data (Phase 2) — similarly, if verification document storage isn't built yet, use placeholder/simple text fields.
- The `useAdminLang()` hook and `AdminLangContext` are already set up in AdminSidebar — reuse for all new admin pages.
- Admin BFF proxy catch-all route is already in place and handles all `/api/admin/*` paths.
- Recharts is available for any chart/visualization needs but likely not needed for this story.

### Project Structure Notes

- All new backend code extends `backend/modules/admin/` — no new modules.
- Frontend pages: `apps/web/app/(admin)/admin/users/page.tsx` and `apps/web/app/(admin)/admin/users/businesses/page.tsx` — these paths are already defined in the architecture document.
- Alembic migration needed for `users` table changes (status column, verification_status column) and new `audit_logs` table.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-9-admin-panel-platform-governance.md — Story 9.2]
- [Source: _bmad-output/planning-artifacts/archive/architecture.md — Lines 826-841 Admin Panel Routes]
- [Source: _bmad-output/planning-artifacts/archive/architecture.md — Lines 359-372 RBAC & Auth]
- [Source: _bmad-output/planning-artifacts/archive/architecture.md — Lines 1044-1053 Moderation Module]
- [Source: _bmad-output/implementation-artifacts/9-1-admin-dashboard-platform-analytics.md — Dev Notes & Completion Notes]

## Dev Agent Record

### Agent Model Used

- openai/gpt-5.4

### Debug Log References

- `python -m pytest backend/tests/admin`
- `python -m pytest backend/tests/admin backend/tests/auth/test_router.py backend/tests/auth/test_profile.py`
- `python -m ruff check backend/modules/admin backend/modules/auth/models.py backend/modules/auth/service.py backend/modules/notification backend/tests/admin backend/migrations/versions/2026_05_05_0001_add_admin_user_management_fields_and_audit_logs.py`
- `pnpm --filter web exec vitest run modules/admin/components/__tests__/*.test.tsx`
- `pnpm --filter web exec eslint "app/(admin)/admin/users/**/*.tsx" "modules/admin/components/**/*.tsx" "modules/admin/hooks/**/*.ts" "modules/admin/lib/adminApi.ts"`
- `pnpm --filter web build`

### Completion Notes List

- Extended the existing admin module with user account listing/detail APIs, moderation actions, business owner verification APIs, and a new `audit_logs` table plus Alembic migration for `users.status` and `users.verification_status`.
- Added soft-delete-aware admin repository queries for user search/sort/pagination, activity summaries, moderation history, business verification listings, submitted photo placeholders, and audit log creation.
- Connected suspend, ban, reactivate, verify, reject, and schedule-visit flows through `AdminService` with audit logging, bilingual notification events, and verification notifications handled by the existing notification module subscribers.
- Built `/admin/users` and `/admin/users/businesses` admin pages with searchable/sortable server-backed tables, detail panels, moderation/verification modals, and TanStack Query hooks via the shared admin BFF proxy.
- Updated the admin sidebar so the nested businesses route highlights correctly without double-activating the parent users item.
- Verified the change with backend pytest coverage for admin/auth paths, frontend Vitest admin component coverage, targeted frontend ESLint, frontend production build, and backend Ruff checks.

### File List

- `_bmad-output/implementation-artifacts/9-2-user-business-owner-management.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `apps/web/app/(admin)/admin/users/page.tsx`
- `apps/web/app/(admin)/admin/users/businesses/page.tsx`
- `apps/web/modules/admin/components/AdminBusinessesPageClient.tsx`
- `apps/web/modules/admin/components/AdminSidebar.tsx`
- `apps/web/modules/admin/components/AdminUsersPageClient.tsx`
- `apps/web/modules/admin/components/BanUserModal.tsx`
- `apps/web/modules/admin/components/BusinessManagementTable.tsx`
- `apps/web/modules/admin/components/BusinessVerificationPanel.tsx`
- `apps/web/modules/admin/components/ReactivateConfirmDialog.tsx`
- `apps/web/modules/admin/components/RejectBusinessModal.tsx`
- `apps/web/modules/admin/components/ScheduleVisitModal.tsx`
- `apps/web/modules/admin/components/SuspendUserModal.tsx`
- `apps/web/modules/admin/components/UserDetailPanel.tsx`
- `apps/web/modules/admin/components/UserManagementTable.tsx`
- `apps/web/modules/admin/components/VerifyBusinessModal.tsx`
- `apps/web/modules/admin/components/__tests__/AdminBusinessesPageClient.test.tsx`
- `apps/web/modules/admin/components/__tests__/AdminSidebar.test.tsx`
- `apps/web/modules/admin/components/__tests__/AdminUsersPageClient.test.tsx`
- `apps/web/modules/admin/hooks/useAdminBusinesses.ts`
- `apps/web/modules/admin/hooks/useAdminUsers.ts`
- `apps/web/modules/admin/lib/adminApi.ts`
- `backend/migrations/versions/2026_05_05_0001_add_admin_user_management_fields_and_audit_logs.py`
- `backend/modules/admin/constants.py`
- `backend/modules/admin/events.py`
- `backend/modules/admin/exceptions.py`
- `backend/modules/admin/models.py`
- `backend/modules/admin/repository.py`
- `backend/modules/admin/router.py`
- `backend/modules/admin/schemas.py`
- `backend/modules/admin/service.py`
- `backend/modules/auth/models.py`
- `backend/modules/auth/service.py`
- `backend/modules/notification/constants.py`
- `backend/modules/notification/subscribers.py`
- `backend/modules/notification/templates.py`
- `backend/tests/admin/test_repository.py`
- `backend/tests/admin/test_router.py`
- `backend/tests/admin/test_service.py`

### Change Log

- 2026-05-05: Implemented story 9.2 user and business owner management across backend admin APIs, audit logging, verification notifications, admin UI flows, and automated validation.
