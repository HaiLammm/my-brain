# Story 1.6: Privacy Controls & Account Management

Status: done

## Story

As a registered user,
I want to control my privacy settings and delete my account if needed,
So that I feel safe using the platform and my data rights are respected.

## Acceptance Criteria

1. **Given** I am a logged-in User, **When** I visit my profile settings page at `/(user)/[locale]/account/settings`, **Then** I can see a "Location tracking" toggle (FR55), the toggle reflects my current consent status (ON by default from registration), and I can turn it OFF to disable location tracking for non-location features
2. **Given** I toggle location tracking OFF, **When** the toggle changes, **Then** the system updates my `ConsentRecord` for `location_tracking` with `granted=false`, shows a confirmation Toast, and the change takes effect immediately
3. **Given** I toggle location tracking back ON, **When** the toggle changes, **Then** the system creates a new `ConsentRecord` for `location_tracking` with `granted=true`, records my IP and user-agent, and shows a confirmation Toast
4. **Given** I want to delete my account, **When** I navigate to account settings and tap "アカウント削除" (Delete Account), **Then** a confirmation Modal dialog explains what will be deleted (reviews, posts, favorites, consent records)
5. **Given** the deletion confirmation dialog is open, **When** I type my display name to confirm, **Then** the "Delete" button becomes enabled. If I type incorrectly, the button remains disabled
6. **Given** I confirm account deletion, **When** deletion processes, **Then** my account is soft-deleted (`deleted_at` set, `is_active=false`), all my refresh tokens are revoked, my session is terminated (cookies cleared), and I am redirected to the homepage
7. **Given** account deletion is confirmed, **When** the backend processes, **Then** a `deletion_requested_at` timestamp is set on my User record, personal data fields are anonymized (display_name, avatar_url, email obfuscated), and a confirmation email/notification is logged (email sending is deferred to Epic 7)
8. **Given** the system infrastructure, **When** data is stored, **Then** all data resides on Vietnam-based servers (FR57) and data encryption uses TLS 1.3 for transit and AES-256 for data at rest (infrastructure-level, no code changes needed — verify in deployment config only)

## Tasks / Subtasks

- [x] Task 1: Backend — Consent management endpoints (AC: #1, #2, #3)
  - [x] 1.1 Add `get_consent_records()` method to `AuthRepository` — query all ConsentRecords for a user, ordered by `created_at DESC`
  - [x] 1.2 Add `get_latest_consent()` method to `AuthRepository` — get most recent ConsentRecord for a given `consent_type`
  - [x] 1.3 Add `get_user_consent_status()` method to `AuthService` — returns dict of `{consent_type: granted}` for latest record of each type
  - [x] 1.4 Add `update_consent()` method to `AuthService` — creates a new ConsentRecord (append-only audit trail), reuses existing `record_consent()` pattern but for a single consent type
  - [x] 1.5 Add `GET /api/v1/auth/consent` endpoint to `router.py` — returns current consent status, requires authenticated user
  - [x] 1.6 Add `PUT /api/v1/auth/consent` endpoint to `router.py` — accepts `UpdateConsentRequest` (consent_type + granted), creates new ConsentRecord
  - [x] 1.7 Add `ConsentStatusOut` schema — `{ activity_logging: bool, location_tracking: bool }`
  - [x] 1.8 Add `UpdateConsentRequest` schema — `{ consent_type: str, granted: bool }`

- [x] Task 2: Backend — Account deletion flow (AC: #4, #5, #6, #7)
  - [x] 2.1 Add `deletion_requested_at` column (DateTime, nullable) to User model via Alembic migration
  - [x] 2.2 Add `DeleteAccountRequest` schema — `{ confirm_display_name: str }`
  - [x] 2.3 Add `soft_delete_user()` method to `AuthRepository` — sets `deleted_at`, `is_active=False`, `deletion_requested_at`
  - [x] 2.4 Add `anonymize_user_data()` method to `AuthRepository` — obfuscates `display_name` to "Deleted User", `email` to `deleted_{uuid}@removed.local`, clears `avatar_url`, `phone_number`, `zalo_contact`, `business_name`
  - [x] 2.5 Add `delete_account()` method to `AuthService` — validates `confirm_display_name` matches user's `display_name`, calls `soft_delete_user()`, `anonymize_user_data()`, `revoke_all_refresh_tokens()`
  - [x] 2.6 Add `DELETE /api/v1/auth/account` endpoint to `router.py` — requires authenticated user, validates request, calls service, clears auth cookies, returns 200
  - [x] 2.7 Add `AccountDeletionFailed` exception to `exceptions.py` — trilingual error message

- [x] Task 3: Backend — Tests (AC: #1-#7)
  - [x] 3.1 Repository tests: `test_get_consent_records_returns_all_for_user`, `test_get_latest_consent_returns_most_recent`
  - [x] 3.2 Service tests: `test_get_user_consent_status_returns_latest_per_type`, `test_update_consent_creates_new_record`, `test_update_consent_preserves_audit_trail`
  - [x] 3.3 Service tests: `test_delete_account_with_correct_display_name`, `test_delete_account_with_wrong_display_name_raises_error`, `test_delete_account_anonymizes_data`, `test_delete_account_revokes_all_tokens`
  - [x] 3.4 Router tests: `test_get_consent_returns_status`, `test_get_consent_unauthenticated_returns_401`, `test_put_consent_updates_location_tracking`, `test_delete_account_returns_200_and_clears_cookies`, `test_delete_account_wrong_name_returns_400`

- [x] Task 4: Frontend — Account settings page (AC: #1, #2, #3)
  - [x] 4.1 Create `apps/web/app/(user)/[locale]/account/settings/page.tsx` — account settings page with next-intl
  - [x] 4.2 Create `apps/web/modules/user/components/PrivacySettings.tsx` — location tracking toggle component, fetches current consent status via `GET /auth/consent`, updates via `PUT /auth/consent`
  - [x] 4.3 Toggle uses existing `SegmentedControl` or a simple switch input with Tailwind styling, shows Toast on change
  - [x] 4.4 Add i18n keys to `messages/ja.json`, `messages/en.json`, `messages/vi.json` for account settings labels

- [x] Task 5: Frontend — Account deletion flow (AC: #4, #5, #6)
  - [x] 5.1 Create `apps/web/modules/user/components/DeleteAccountSection.tsx` — "アカウント削除" button at bottom of settings page, styled in red/danger
  - [x] 5.2 Create `apps/web/modules/user/components/DeleteAccountModal.tsx` — uses existing `Modal` component, explains deletion consequences, has text input for display name confirmation, delete button disabled until name matches
  - [x] 5.3 On confirmed deletion: call `DELETE /auth/account`, clear auth store, redirect to `/(user)/[locale]` homepage
  - [x] 5.4 Add i18n keys for deletion dialog text, confirmation prompt, consequences list

- [x] Task 6: Frontend — Tests (AC: #1-#6)
  - [x] 6.1 Create `apps/web/modules/user/components/__tests__/PrivacySettings.test.tsx` — renders toggle with correct initial state, calls API on toggle, shows Toast
  - [x] 6.2 Create `apps/web/modules/user/components/__tests__/DeleteAccountModal.test.tsx` — renders modal, button disabled until name matches, calls API on confirm, redirects on success

## Dev Notes

### Consent System — Append-Only Audit Trail

The existing `ConsentRecord` model already stores individual consent events. **DO NOT** update existing records — create new ones each time. The latest record per `consent_type` determines current status. This provides a full audit trail for APPI compliance.

Existing `record_consent()` in `AuthService` (service.py ~line 391) creates records for both `activity_logging` and `location_tracking` at registration. The new `update_consent()` should create a single new record for the toggled type only.

### Existing Consent Endpoint — POST /auth/consent

There is already a `POST /auth/consent` endpoint (router.py ~line 315) that records initial consent at registration. The new endpoints are:
- `GET /auth/consent` — read current status (new)
- `PUT /auth/consent` — update individual consent type (new)

These are separate from the existing POST which records bulk initial consent.

### Account Deletion — Soft Delete + Anonymization

The `BaseModel` already has `deleted_at` field and all repository queries filter `deleted_at.is_(None)`. Account deletion should:
1. Set `deleted_at` and `is_active = False` on User
2. Anonymize PII fields immediately (display_name, email, avatar_url, business fields)
3. Revoke all refresh tokens via existing `revoke_all_refresh_tokens()` (repository.py ~line 91)
4. Clear auth cookies via existing `_clear_auth_cookies()` (router.py ~line 69)

**DO NOT** physically delete user data — soft delete only. Reviews, posts, and other user content remain but display "Deleted User" as author.

**Email confirmation is deferred** — the notification module (Epic 7) does not exist yet. Log the deletion event; do not attempt to send email.

### Display Name Confirmation Pattern

The deletion confirmation requires typing the exact `display_name` to proceed. This is a safety mechanism to prevent accidental deletion. Compare server-side (case-sensitive) in the `delete_account()` service method, not just client-side.

### Frontend — Consumer Pages Use next-intl

This is a `(user)` route, so next-intl IS used (unlike business portal). All UI text goes through translation files:
- `messages/ja.json` — primary (Japanese default for consumer)
- `messages/en.json` — English alternative
- `messages/vi.json` — Vietnamese alternative

### Frontend — Account Settings Page Location

Create the settings page at `apps/web/app/(user)/[locale]/account/settings/page.tsx`. This follows the existing route group pattern. The page should be accessible from the Profile tab in bottom navigation (future link, not part of this story).

### Existing Components to Reuse

| Component | Location | Usage |
|-----------|----------|-------|
| `Modal` | `shared/components/Modal.tsx` | Deletion confirmation dialog (use `variant="partial"`) |
| `Toast` | `shared/components/Toast.tsx` | Consent update confirmation |
| `PrimaryCTAButton` | `shared/components/PrimaryCTAButton.tsx` | Action buttons |
| `Skeleton` | `shared/components/Skeleton.tsx` | Loading state for consent fetch |
| `useAuth` | `shared/hooks/useAuth.ts` | Get current user, logout after deletion |
| `apiClient` | `shared/lib/apiClient.ts` | API calls (auto camelCase/snake_case transform) |
| `useAuthStore` | `shared/stores/useAuthStore.ts` | Clear user state on deletion |

### API Client Auto-Transform

`apiClient` automatically converts camelCase (frontend) to snake_case (backend) on requests, and vice versa on responses. Schema field names:
- Backend: `consent_type`, `location_tracking`, `activity_logging`, `confirm_display_name`
- Frontend: `consentType`, `locationTracking`, `activityLogging`, `confirmDisplayName`

### Previous Story Intelligence (from 1.5.2)

Key patterns established:
- `ConsentRecord` creation pattern with `consent_type="terms_of_service"` — reuse for `"location_tracking"` updates
- `_find_or_create_social_user()` now accepts optional `role` param — no impact on this story
- Business fields on User model (business_name, phone_number, zalo_contact) — must be anonymized on deletion
- Skeleton loading pattern (no spinners) — apply to consent status loading
- SuccessBanner not needed here — use Toast for feedback

### Migration Considerations

New nullable column `deletion_requested_at` (DateTime) on `users` table. Safe migration — no default needed, no existing data affected.

### Architecture Compliance Checklist

- [ ] Soft delete pattern: Use `deleted_at` from BaseModel
- [ ] Consent audit trail: Append-only ConsentRecords, never update/delete
- [ ] APPI compliance: Right to deletion (FR74), consent management
- [ ] Vietnam Cybersecurity Law: Data on Vietnam servers (FR57) — infra concern only
- [ ] Data encryption: TLS 1.3 transit + AES-256 at rest — infra concern only
- [ ] Role enforcement: `get_current_user` dependency for all new endpoints
- [ ] Module boundaries: All changes within auth module only
- [ ] Error format: Trilingual messages (ja/vi/en) for new exceptions
- [ ] Rate limiting: Existing per-role limits apply automatically
- [ ] JWT cookies: Reuse `_clear_auth_cookies()` for deletion logout
- [ ] Skeleton loading: No spinners for consent status fetch
- [ ] next-intl: Used for (user) route settings page

### File Structure

**New files to create:**
- `backend/migrations/versions/2026_04_17_0001_add_deletion_requested_at_to_users.py` — Alembic migration
- `apps/web/app/(user)/[locale]/account/settings/page.tsx` — Account settings page
- `apps/web/modules/user/components/PrivacySettings.tsx` — Privacy toggle component
- `apps/web/modules/user/components/DeleteAccountSection.tsx` — Deletion trigger section
- `apps/web/modules/user/components/DeleteAccountModal.tsx` — Deletion confirmation modal
- `apps/web/modules/user/components/__tests__/PrivacySettings.test.tsx` — Tests
- `apps/web/modules/user/components/__tests__/DeleteAccountModal.test.tsx` — Tests

**Existing files to modify:**
- `backend/modules/auth/models.py` — Add `deletion_requested_at` to User
- `backend/modules/auth/schemas.py` — Add `ConsentStatusOut`, `UpdateConsentRequest`, `DeleteAccountRequest`
- `backend/modules/auth/service.py` — Add `get_user_consent_status()`, `update_consent()`, `delete_account()`
- `backend/modules/auth/repository.py` — Add `get_consent_records()`, `get_latest_consent()`, `soft_delete_user()`, `anonymize_user_data()`
- `backend/modules/auth/router.py` — Add `GET /consent`, `PUT /consent`, `DELETE /account`
- `backend/modules/auth/exceptions.py` — Add `AccountDeletionFailed`
- `backend/tests/auth/test_service.py` — Add consent + deletion tests
- `backend/tests/auth/test_router.py` — Add consent + deletion endpoint tests
- `apps/web/messages/ja.json` — Add account settings i18n keys
- `apps/web/messages/en.json` — Add account settings i18n keys
- `apps/web/messages/vi.json` — Add account settings i18n keys

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-1-platform-foundation-authentication-design-system.md#Story 1.6]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR55, FR57, FR74]
- [Source: _bmad-output/planning-artifacts/prd/domain-specific-requirements.md#Privacy & Data Protection]
- [Source: _bmad-output/planning-artifacts/prd/non-functional-requirements.md#APPI Compliance]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Authentication & Security]
- [Source: _bmad-output/implementation-artifacts/1-5-2-business-owner-registration-email-zalo.md]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Implemented all 6 Tasks covering backend consent management, account deletion, and full frontend settings page
- Backend: Added `get_consent_records()`, `get_latest_consent()`, `soft_delete_user()`, `anonymize_user_data()` to AuthRepository
- Backend: Added `get_user_consent_status()`, `update_consent()`, `delete_account()` to AuthService
- Backend: Added `GET /consent`, `PUT /consent`, `DELETE /account` endpoints with auth guards
- Backend: Added `AccountDeletionFailed` exception with trilingual messages
- Backend: Added `ConsentStatusOut`, `UpdateConsentRequest`, `DeleteAccountRequest` schemas
- Backend: Added `deletion_requested_at` field to User model with Alembic migration
- Frontend: Created account settings page, PrivacySettings toggle, DeleteAccountSection, DeleteAccountModal
- Frontend: Added i18n keys to ja/en/vi message files
- All 68 backend tests + 83 frontend tests pass with no regressions
- Deletion uses soft-delete + anonymization pattern; no physical deletion
- Consent updates are append-only (audit trail); server-side display name validation for deletion

### File List

**New files:**
- `backend/migrations/versions/2026_04_17_0001_add_deletion_requested_at_to_users.py`
- `apps/web/app/(user)/[locale]/account/settings/page.tsx`
- `apps/web/modules/user/components/PrivacySettings.tsx`
- `apps/web/modules/user/components/DeleteAccountSection.tsx`
- `apps/web/modules/user/components/DeleteAccountModal.tsx`
- `apps/web/modules/user/components/__tests__/PrivacySettings.test.tsx`
- `apps/web/modules/user/components/__tests__/DeleteAccountModal.test.tsx`

**Modified files:**
- `backend/modules/auth/models.py`
- `backend/modules/auth/schemas.py`
- `backend/modules/auth/service.py`
- `backend/modules/auth/repository.py`
- `backend/modules/auth/router.py`
- `backend/modules/auth/exceptions.py`
- `backend/tests/auth/test_service.py`
- `backend/tests/auth/test_router.py`
- `apps/web/messages/ja.json`
- `apps/web/messages/en.json`
- `apps/web/messages/vi.json`

## Change Log

- 2026-04-17: Implemented Story 1.6 — Privacy Controls & Account Management (claude-sonnet-4-6)
- 2026-04-17: Code review completed — 4 patches identified, Edge Case Hunter layer unavailable

### Review Findings

- [x] [Review][Patch] `update_consent` accepts arbitrary `consent_type` string — no whitelist/Literal validation on `UpdateConsentRequest.consent_type`; users can pollute audit log with invalid types [backend/modules/auth/schemas.py]
- [x] [Review][Patch] `anonymize_user_data` unique-email collision on re-deletion — `email = f"deleted_{user.id}@removed.local"` unguarded; re-running anonymization or the same `user.id` collision could raise IntegrityError [backend/modules/auth/repository.py:~130]
- [x] [Review][Patch] Repository-level consent tests are trivial mocks — `TestGetConsentRecords` patches `repo.get_consent_records` then calls the patched mock, asserting mock returns mock; doesn't exercise SQL [backend/tests/auth/test_service.py]
- [x] [Review][Patch] `test_delete_account_anonymizes_data` only asserts mock was called, not that fields were anonymized — weak coverage for Task 3.3 subtask [backend/tests/auth/test_service.py]
- [x] [Review][Patch] `test_delete_account_returns_200_and_clears_cookies` never inspects `Set-Cookie` response headers — test name claims coverage it doesn't provide [backend/tests/auth/test_router.py]
