# Story 9.5: Staff Management, RBAC & Reporting

Status: review

## Story

As a platform admin,
I want to manage staff accounts with role-based access and generate platform reports,
so that the right people have the right access and stakeholders receive regular performance updates.

## Acceptance Criteria

1. **Given** I navigate to `/admin/staff` (FR46), **when** the staff management page loads, **then** a table displays: staff name, email, admin sub-role, last active, status. I can: invite new staff (email), assign/change sub-roles, deactivate accounts.

2. **Given** admin sub-roles (FR51), **when** roles are assigned, **then** three sub-roles are available: "Content Lead" (moderation queue, content management), "Technical" (platform settings, monitoring), "Business Relations" (BO verification, dispute resolution). Sidebar navigation menu items are filtered based on the assigned sub-role. API endpoints enforce sub-role checks on every request (NFR16).

3. **Given** I navigate to `/admin/reports` (FR47), **when** the reporting page loads, **then** report templates are available: Weekly Summary, Monthly Summary, Moderation Volume. Each template shows: configurable date range, preview of included metrics.

4. **Given** I generate a report, **when** I select a template and date range and tap "Generate", **then** a report displays with: traffic metrics, revenue breakdown, user growth, moderation stats, top listings, top community threads. Charts and tables render inline.

5. **Given** I want to export a report (FR69), **when** I tap "CSV出力" / "Xuất CSV" (Export CSV), **then** a CSV file downloads containing all report data with proper headers and formatting. Date/time values follow ISO 8601 format.

## Tasks / Subtasks

- [x] Task 1: Backend — Staff management endpoints (AC: #1, #2)
  - [x] 1.1 Add staff admin routes to `backend/modules/admin/router.py` under `/api/v1/admin/staff/*`, protected by `require_role(UserRole.ADMIN)`. Only TECHNICAL sub-role admins can manage staff (use `require_admin_sub_role(AdminSubRole.TECHNICAL.value)`)
  - [x] 1.2 `GET /api/v1/admin/staff` — paginated list of users where `role = 'ADMIN'`. Return: display_name, email, admin_sub_role, last_active_at, status. Filterable by sub-role and status. Return `Paginated[StaffListItemResponse]`
  - [x] 1.3 `POST /api/v1/admin/staff/invite` — accepts `StaffInviteRequest` (email, admin_sub_role). Creates a new user with role=ADMIN and the specified sub-role. If user with email exists and is not ADMIN, upgrade role to ADMIN + set sub-role. If already ADMIN, return 409
  - [x] 1.4 `PATCH /api/v1/admin/staff/{user_id}/role` — accepts `StaffRoleUpdateRequest` (admin_sub_role). Updates the user's admin_sub_role. Cannot change own role (prevent self-lockout). Audit log entry created
  - [x] 1.5 `POST /api/v1/admin/staff/{user_id}/deactivate` — sets user status to SUSPENDED. Cannot deactivate self. Audit log entry created
  - [x] 1.6 `POST /api/v1/admin/staff/{user_id}/reactivate` — sets user status back to ACTIVE. Audit log entry created
  - [x] 1.7 Pydantic schemas in `backend/modules/admin/schemas.py`: `StaffListItemResponse`, `StaffListParams`, `StaffInviteRequest`, `StaffRoleUpdateRequest`, `StaffActionResponse`

- [x] Task 2: Backend — Report generation endpoints (AC: #3, #4, #5)
  - [x] 2.1 Create `backend/modules/admin/report_service.py` — report generation logic (NOT a new module, just a new file in admin module)
  - [x] 2.2 Add report routes to `backend/modules/admin/router.py` under `/api/v1/admin/reports/*`
  - [x] 2.3 `GET /api/v1/admin/reports/templates` — returns list of available report templates with metadata (name, description, available metrics)
  - [x] 2.4 `POST /api/v1/admin/reports/generate` — accepts `ReportGenerateRequest` (template: weekly_summary|monthly_summary|moderation_volume, date_from, date_to). Queries aggregated data from relevant tables and returns `SingleEnvelope[ReportDataResponse]`
  - [x] 2.5 `POST /api/v1/admin/reports/export-csv` — accepts same params as generate, returns CSV file response with `Content-Type: text/csv` and `Content-Disposition: attachment`. Date/time in ISO 8601
  - [x] 2.6 Report data aggregation queries: traffic (daily visits from activity logs), revenue (from payments/commissions), user growth (new registrations by date), moderation stats (flagged items, resolved, pending), top listings (by views/reviews), top community threads (by post count/engagement)
  - [x] 2.7 Pydantic schemas: `ReportTemplateResponse`, `ReportGenerateRequest`, `ReportDataResponse` (with nested sections: traffic, revenue, user_growth, moderation, top_listings, top_threads)

- [x] Task 3: Backend — RBAC enforcement audit (AC: #2)
  - [x] 3.1 Review ALL existing admin endpoints and verify sub-role checks are applied. Current state: most endpoints use `require_role(UserRole.ADMIN)` without sub-role checks
  - [x] 3.2 Add `require_admin_sub_role()` to endpoints per sub-role mapping:
    - Content Lead: moderation queue (`/api/v1/admin/moderation/*`), disputes (`/api/v1/admin/moderation/disputes/*`)
    - Technical: staff management (`/api/v1/admin/staff/*`), dashboard (`/api/v1/admin/dashboard/*`)
    - Business Relations: business verification (`/api/v1/admin/users/businesses/*/verify`), disputes
  - [x] 3.3 IMPORTANT: Dashboard view endpoints (`/api/v1/admin/dashboard/*`) should remain accessible to ALL admin sub-roles. Only staff management requires TECHNICAL sub-role
  - [x] 3.4 Reports endpoints accessible to TECHNICAL and BUSINESS sub-roles

- [x] Task 4: Backend tests (AC: all)
  - [x] 4.1 `backend/tests/admin/test_staff_router.py` — test staff list (paginated, filtered by sub-role), invite (new user, existing user upgrade, duplicate 409), role update (success, self-update rejected), deactivate/reactivate
  - [x] 4.2 `backend/tests/admin/test_report_router.py` — test template listing, report generation for each template, CSV export format validation, date range filtering
  - [x] 4.3 Test RBAC enforcement: TECHNICAL can access staff endpoints, CONTENT cannot; verify sub-role filtering on other admin endpoints
  - [x] 4.4 Test audit log creation for staff role changes and deactivation

- [x] Task 5: Frontend — Staff management page at `/admin/staff` (AC: #1, #2)
  - [x] 5.1 Create `apps/web/app/(admin)/admin/staff/page.tsx` — server component wrapper
  - [x] 5.2 `StaffManagementPageClient.tsx` in `apps/web/modules/admin/components/` — client component with sub-role filter tabs (All/Content/Technical/Business) and paginated staff table
  - [x] 5.3 `StaffTable.tsx` — table columns: name, email, sub-role badge (color-coded: Content=purple, Technical=blue, Business=green), last active, status badge
  - [x] 5.4 `InviteStaffModal.tsx` — modal with: email input, sub-role select dropdown (Content Lead/Technical/Business Relations), invite button
  - [x] 5.5 `ChangeRoleModal.tsx` — modal with: current role display, new role dropdown, confirmation, submit
  - [x] 5.6 `StaffActionButtons.tsx` — inline row actions: Change Role, Deactivate/Reactivate (conditionally shown based on status)

- [x] Task 6: Frontend — Reports page at `/admin/reports` (AC: #3, #4, #5)
  - [x] 6.1 Create `apps/web/app/(admin)/admin/reports/page.tsx` — server component wrapper
  - [x] 6.2 `ReportsPageClient.tsx` in `apps/web/modules/admin/components/` — client component with template selector cards, date range picker, Generate button
  - [x] 6.3 `ReportTemplateCard.tsx` — card displaying template name, description, included metrics preview. Three templates: Weekly Summary, Monthly Summary, Moderation Volume
  - [x] 6.4 `ReportViewer.tsx` — renders generated report inline with sections: traffic chart (line), revenue breakdown (bar chart), user growth (line), moderation stats (summary cards), top listings table, top community threads table
  - [x] 6.5 `ReportExportButton.tsx` — "CSV出力" / "Xuất CSV" button triggering file download. Use `window.URL.createObjectURL` for blob download
  - [x] 6.6 Chart rendering: use lightweight charting library already available or Recharts (check existing dependencies first)

- [x] Task 7: Frontend — API hooks and integration (AC: all)
  - [x] 7.1 Extend `apps/web/modules/admin/lib/adminApi.ts` with: staff API functions (`getStaffList()`, `inviteStaff()`, `updateStaffRole()`, `deactivateStaff()`, `reactivateStaff()`), report API functions (`getReportTemplates()`, `generateReport()`, `exportReportCsv()`)
  - [x] 7.2 Create `useStaff.ts` hook in `apps/web/modules/admin/hooks/`: `useStaffList()`, `useInviteStaff()`, `useUpdateStaffRole()`, `useDeactivateStaff()`, `useReactivateStaff()` — follow TanStack Query patterns from `useAdminUsers.ts`
  - [x] 7.3 Create `useReports.ts` hook in `apps/web/modules/admin/hooks/`: `useReportTemplates()`, `useGenerateReport()`, `useExportCsv()` — `useGenerateReport` returns data on-demand (not auto-fetch), `useExportCsv` triggers download
  - [x] 7.4 All text bilingual via `useAdminLang()` (EN/VI). CSV export button: "CSV出力" (JA fallback) / "Xuất CSV" (VI)

- [x] Task 8: Frontend tests
  - [x] 8.1 `__tests__/StaffManagementPageClient.test.tsx` — renders staff table, filters by sub-role, invite modal opens and submits, role change modal works
  - [x] 8.2 `__tests__/ReportsPageClient.test.tsx` — renders template cards, date range selection, generate triggers API call, CSV export triggers download

- [x] Task 9: Navigation & sidebar RBAC update (AC: #2)
  - [x] 9.1 Verify `AdminSidebar.tsx` already has "Staff" nav item with TECHNICAL-only visibility (confirmed: exists at line 86-91). Ensure href is `/admin/staff`
  - [x] 9.2 Add "Reports" nav item to `AdminSidebar.tsx` if not present, with visibility for TECHNICAL and BUSINESS sub-roles, href `/admin/reports`
  - [x] 9.3 Verify BFF proxy handles `/api/admin/staff/*` and `/api/admin/reports/*` paths (covered by existing catch-all at `apps/web/app/api/admin/[...path]/route.ts`)

## Dev Notes

### Architecture Compliance

- **EXTEND existing module**: All staff and report endpoints go in `backend/modules/admin/router.py` — do NOT create new modules. Report service logic goes in a new `report_service.py` file within the admin module.
- Staff routes: `/api/v1/admin/staff/*`, Report routes: `/api/v1/admin/reports/*`
- Use `Depends()` for cross-module access. NEVER direct module imports for business logic.
- Follow 9-file module pattern — only add files within existing `backend/modules/admin/` directory.

### Existing Code to Reuse — CRITICAL

| What | Where | How to Use |
|------|-------|------------|
| `User` model with `admin_sub_role` | `backend/modules/auth/models.py` (line 49) | Already has `admin_sub_role: str \| None` (String(20)). No migration needed |
| `AdminSubRole` enum | `backend/modules/auth/constants.py` | Values: `CONTENT`, `TECHNICAL`, `BUSINESS`. Use for validation |
| `UserRole` enum | `backend/modules/auth/constants.py` | Values: `GUEST`, `USER`, `BUSINESS_OWNER`, `ADMIN` |
| `require_role()` dependency | `backend/modules/auth/dependencies.py` (line 74) | Use for all admin endpoint protection |
| `require_admin_sub_role()` dependency | `backend/modules/auth/dependencies.py` (line 83) | Use for sub-role-specific endpoints. Already validates ADMIN role + sub-role match |
| `create_audit_log()` | `backend/modules/admin/repository.py` | Call for all staff management actions (invite, role change, deactivate/reactivate) |
| AuditLog model | `backend/modules/admin/models.py` (lines 14-44) | Fields: admin_user_id, target_user_id, action, reason, metadata_json |
| Existing audit action constants | `backend/modules/admin/constants.py` | Add new constants: `AUDIT_ACTION_STAFF_INVITED`, `AUDIT_ACTION_STAFF_ROLE_CHANGED`, `AUDIT_ACTION_STAFF_DEACTIVATED`, `AUDIT_ACTION_STAFF_REACTIVATED` |
| Admin user list endpoint pattern | `backend/modules/admin/router.py` | `GET /api/v1/admin/users` — reuse query pattern but filter by role=ADMIN |
| `adminApiClient` | `apps/web/modules/admin/lib/adminApi.ts` | Extend with staff + report API functions. Use existing `Envelope<T>`, `PaginatedEnvelope<T>`, `getCsrfToken()` patterns |
| TanStack Query hook pattern | `apps/web/modules/admin/hooks/useAdminUsers.ts` | Follow for `useStaff.ts` and `useReports.ts` hooks |
| `useAdminLang()` | `apps/web/modules/admin/components/AdminSidebar.tsx` | Bilingual labels EN/VI for all staff + report UI |
| Admin BFF proxy | `apps/web/app/api/admin/[...path]/route.ts` | Auto-proxies `/api/admin/*` → `/api/v1/admin/*`. Staff and report endpoints auto-covered |
| Set-Cookie proxy fix | BFF route | Use `getSetCookie()` + `append()` (known bug fix from earlier stories) |
| `PaginationMeta` | `backend/modules/listing/schemas.py` | Reuse for paginated staff list |
| AdminSidebar Staff entry | `apps/web/modules/admin/components/AdminSidebar.tsx` (line 86-91) | Already exists with TECHNICAL-only visibility. Just verify href |
| User management UI patterns | `apps/web/modules/admin/components/AdminUsersPageClient.tsx` | Follow same table/filter/detail pattern for staff management |

### Database Schema

**No new tables needed.** This story uses:
- Existing `users` table with `role` and `admin_sub_role` columns
- Existing `audit_logs` table for staff action tracking
- Aggregate queries against existing tables for report data (users, reviews, listings, moderation_items, community_posts, coupon_claims, activity_logs)

### RBAC Sub-Role Mapping

| Sub-Role | Accessible Sections | Sidebar Items |
|----------|-------------------|---------------|
| Content Lead (`CONTENT`) | Dashboard, Moderation, Disputes | Dashboard, Moderation (with Disputes) |
| Technical (`TECHNICAL`) | Dashboard, Staff, Reports, ALL sections | Dashboard, Staff, Reports, Moderation, Users, Businesses |
| Business Relations (`BUSINESS`) | Dashboard, Users, Businesses, Disputes, Reports | Dashboard, Users, Businesses, Reports |

TECHNICAL has full access. CONTENT and BUSINESS have scoped access. Dashboard is always visible to all sub-roles.

### Report Templates

```python
REPORT_TEMPLATES = {
    "weekly_summary": {
        "name": "Weekly Summary",
        "description": "Platform performance overview for the past week",
        "metrics": ["traffic", "revenue", "user_growth", "moderation", "top_listings"]
    },
    "monthly_summary": {
        "name": "Monthly Summary",
        "description": "Comprehensive monthly platform analysis",
        "metrics": ["traffic", "revenue", "user_growth", "moderation", "top_listings", "top_threads"]
    },
    "moderation_volume": {
        "name": "Moderation Volume",
        "description": "Content moderation activity and trends",
        "metrics": ["moderation"]
    }
}
```

### CSV Export Format

- Content-Type: `text/csv; charset=utf-8`
- BOM prefix (`\ufeff`) for Excel compatibility with Vietnamese/Japanese characters
- Headers as first row, snake_case column names
- Date/time: ISO 8601 format (`2026-05-07T08:00:00Z`)
- Numbers: no formatting (raw values)
- Filename: `{template}_{date_from}_{date_to}.csv`

### Frontend Component Hierarchy

```
/admin/staff (page.tsx)
└── StaffManagementPageClient.tsx
    ├── Sub-role filter tabs (All/Content/Technical/Business)
    ├── StaffTable.tsx
    │   └── Rows: name, email, sub-role badge, last active, status, actions
    ├── StaffActionButtons.tsx (per row)
    │   ├── "Change Role" → ChangeRoleModal.tsx
    │   └── "Deactivate"/"Reactivate" (inline action)
    ├── InviteStaffModal.tsx (header action button)
    └── Pagination controls

/admin/reports (page.tsx)
└── ReportsPageClient.tsx
    ├── ReportTemplateCard.tsx × 3 (selectable)
    ├── Date range picker (from/to)
    ├── "Generate" button
    ├── ReportViewer.tsx (conditionally rendered after generate)
    │   ├── Traffic section (line chart)
    │   ├── Revenue section (bar chart)
    │   ├── User Growth section (line chart)
    │   ├── Moderation section (summary cards)
    │   ├── Top Listings table
    │   └── Top Community Threads table
    └── ReportExportButton.tsx ("CSV出力" / "Xuất CSV")
```

### Previous Story Intelligence (from 9-4)

- Moderation module fully established with dispute resolution
- Admin sidebar already has Staff nav item placeholder (TECHNICAL-only)
- All admin actions consistently create audit log entries
- TanStack Query hooks with queryKey arrays and mutation invalidation pattern established
- `useAdminLang()` provides bilingual toggle for EN/VI
- BFF proxy auto-covers all `/api/admin/*` routes
- Notification templates follow established pattern in `backend/modules/notification/templates.py`

### Charting Library

Check existing `package.json` for charting dependencies before adding new ones. If Recharts or similar already installed, use that. If none available, add Recharts (`recharts`) — lightweight, React-native, no additional peer dependencies.

### Project Structure Notes

- Backend staff/report routes extend `backend/modules/admin/router.py`
- Backend report logic in new `backend/modules/admin/report_service.py`
- Frontend staff components in `apps/web/modules/admin/components/`
- Frontend hooks in `apps/web/modules/admin/hooks/`
- Page routes: `apps/web/app/(admin)/admin/staff/page.tsx`, `apps/web/app/(admin)/admin/reports/page.tsx`
- Tests: `backend/tests/admin/test_staff_router.py`, `backend/tests/admin/test_report_router.py`, frontend co-located `__tests__/`

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-9-admin-panel-platform-governance.md#Story 9.5]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR46, FR47, FR51, FR69]
- [Source: _bmad-output/planning-artifacts/prd/non-functional-requirements.md#RBAC Enforcement]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure-boundaries.md#Admin Panel Routes]
- [Source: backend/modules/auth/models.py#User.admin_sub_role]
- [Source: backend/modules/auth/constants.py#AdminSubRole]
- [Source: backend/modules/auth/dependencies.py#require_admin_sub_role]
- [Source: backend/modules/admin/router.py — existing admin endpoints]
- [Source: backend/modules/admin/models.py#AuditLog]
- [Source: _bmad-output/implementation-artifacts/9-4-fake-review-disputes-resolution.md]

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- `pytest backend/tests/admin backend/tests/moderation`
- `ruff check backend/modules/admin backend/modules/auth/dependencies.py backend/modules/moderation/router.py backend/tests/admin backend/tests/moderation`
- `npm test -- modules/admin/components/__tests__`
- `npx eslint modules/admin app/'(admin)'/admin/staff/page.tsx app/'(admin)'/admin/reports/page.tsx`
- `npx tsc --noEmit`

### Completion Notes List

- Implemented staff management endpoints, schemas, repository/service flows, and audit actions for invite, role change, deactivate, and reactivate.
- Added admin report generation and CSV export with inline traffic, revenue placeholder, user growth, moderation, top listings, and top thread data sections.
- Tightened admin and moderation RBAC by sub-role across staff, reports, user/business management, moderation queue, and disputes.
- Added `/admin/staff` and `/admin/reports` pages with bilingual UI, TanStack Query hooks, CSV export, Recharts visualizations, and focused frontend tests.

### File List

- backend/modules/auth/dependencies.py
- backend/modules/admin/constants.py
- backend/modules/admin/dependencies.py
- backend/modules/admin/exceptions.py
- backend/modules/admin/report_service.py
- backend/modules/admin/repository.py
- backend/modules/admin/router.py
- backend/modules/admin/schemas.py
- backend/modules/admin/service.py
- backend/modules/moderation/router.py
- backend/tests/admin/test_report_router.py
- backend/tests/admin/test_router.py
- backend/tests/admin/test_staff_router.py
- backend/tests/moderation/test_dispute_router.py
- backend/tests/moderation/test_router.py
- apps/web/app/(admin)/admin/reports/page.tsx
- apps/web/app/(admin)/admin/staff/page.tsx
- apps/web/modules/admin/components/ChangeRoleModal.tsx
- apps/web/modules/admin/components/InviteStaffModal.tsx
- apps/web/modules/admin/components/ReportExportButton.tsx
- apps/web/modules/admin/components/ReportTemplateCard.tsx
- apps/web/modules/admin/components/ReportViewer.tsx
- apps/web/modules/admin/components/ReportsPageClient.tsx
- apps/web/modules/admin/components/StaffActionButtons.tsx
- apps/web/modules/admin/components/StaffManagementPageClient.tsx
- apps/web/modules/admin/components/StaffTable.tsx
- apps/web/modules/admin/components/__tests__/ReportsPageClient.test.tsx
- apps/web/modules/admin/components/__tests__/StaffManagementPageClient.test.tsx
- apps/web/modules/admin/hooks/useReports.ts
- apps/web/modules/admin/hooks/useStaff.ts
- apps/web/modules/admin/lib/adminApi.ts

### Change Log

- 2026-05-07: Implemented story 9.5 staff management, reporting, frontend admin pages, RBAC enforcement, and validation coverage.
