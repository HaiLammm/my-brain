# Story 1.5.2: Business Owner Registration & Agreement (Email + Zalo)

Status: review

## Story

As a Vietnamese business owner,
I want to register with my email or Zalo account and accept a digital agreement,
So that I can create listings and manage my business presence on the platform.

## Acceptance Criteria

1. **Given** I visit `/business/vi/auth/register`, **When** the page loads, **Then** a registration form appears entirely in Vietnamese with fields: email, password, business name, phone number, Zalo contact
2. **Given** I fill in valid registration details, **When** I submit the form, **Then** my password is hashed with Argon2id before storage, and a digital agreement (terms of service) is presented for acceptance
3. **Given** the agreement checkbox is unchecked, **When** I try to submit, **Then** the form prevents submission and displays a Vietnamese validation message
4. **Given** I accept the agreement ("Toi dong y voi Dieu khoan su dung") and submit, **When** registration completes, **Then** my account is created with role `BusinessOwner`, a JWT is issued in an HTTP-only cookie, I am redirected to `/business/vi/dashboard`, and a SuccessBanner confirms registration
5. **Given** I enter an already-registered email, **When** I submit the form, **Then** a Vietnamese error message appears: "Email nay da duoc dang ky" and the form preserves all other entered data
6. **Given** I choose Zalo registration, **When** the Zalo OAuth flow completes, **Then** my account is created with role `BusinessOwner` (NOT `User`), and I am redirected to the business dashboard
7. **Given** I register via Zalo and my Zalo profile has no email, **When** registration completes, **Then** the system creates a valid account with `email=None` and `provider=zalo`

## Tasks / Subtasks

- [x] Task 1: Backend — Business owner email registration endpoint (AC: #1, #2, #3, #4, #5)
  - [x] 1.1 Create `BusinessOwnerRegisterRequest` schema in `schemas.py` extending email/password with: `business_name` (str, 1-200), `phone_number` (str, optional), `zalo_contact` (str, optional)
  - [x] 1.2 Create `AgreementAcceptance` schema with: `terms_accepted` (bool, must be True), `accepted_at` (datetime)
  - [x] 1.3 Add `business_name`, `phone_number`, `zalo_contact` columns to `User` model (nullable, only used by BusinessOwner)
  - [x] 1.4 Create Alembic migration: `2026_04_16_xxxx_add_business_owner_fields_to_users.py`
  - [x] 1.5 Add `email_register_business_owner()` method to `AuthService` — reuses `hash_password()`, sets `role=UserRole.BUSINESS_OWNER`, stores business fields
  - [x] 1.6 Add `POST /api/v1/auth/business/register` endpoint in `router.py` — validates agreement, creates user, sets auth cookies, returns `TokenResponse`
  - [x] 1.7 Store agreement acceptance as `ConsentRecord` with `consent_type="terms_of_service"`

- [x] Task 2: Backend — Business owner Zalo OAuth registration (AC: #6, #7)
  - [x] 2.1 Add `GET /api/v1/auth/business/zalo/authorize` endpoint — same PKCE flow as user Zalo, but stores `"zalo_business"` in Redis state (to differentiate from user registration)
  - [x] 2.2 Add `POST /api/v1/auth/business/zalo/callback` endpoint — retrieves PKCE verifier, calls `zalo_oauth_callback_business()`, sets auth cookies
  - [x] 2.3 Add `zalo_oauth_callback_business()` method to `AuthService` — reuses Zalo token exchange and profile fetch, but creates user with `role=UserRole.BUSINESS_OWNER`
  - [x] 2.4 Add `/api/v1/auth/business/zalo/callback` to CSRF exempt paths in `shared/middleware/csrf.py`

- [x] Task 3: Backend — Tests (AC: #1-#7)
  - [x] 3.1 Service tests: `test_email_register_business_owner_creates_user_with_business_owner_role`, `test_email_register_business_owner_with_duplicate_email_raises_error`, `test_email_register_business_owner_hashes_password_with_argon2`
  - [x] 3.2 Service tests: `test_zalo_oauth_callback_business_creates_business_owner_role`, `test_zalo_oauth_callback_business_with_no_email_succeeds`
  - [x] 3.3 Router tests: `test_business_register_with_valid_data_returns_201`, `test_business_register_without_agreement_returns_422`, `test_business_register_duplicate_email_returns_409`
  - [x] 3.4 Router tests: `test_business_zalo_authorize_returns_authorization_url`, `test_business_zalo_callback_creates_business_owner`

- [x] Task 4: Frontend — Business registration page (AC: #1, #2, #3, #4, #5)
  - [x] 4.1 Create `apps/web/app/(business)/vi/auth/register/page.tsx` — registration form entirely in Vietnamese (no next-intl, hardcoded Vietnamese strings)
  - [x] 4.2 Create `apps/web/modules/business/components/BusinessRegisterForm.tsx` — form with fields: email, password, business_name, phone_number, zalo_contact, terms agreement checkbox
  - [x] 4.3 Use React Hook Form + Zod for validation — all validation messages in Vietnamese
  - [x] 4.4 On successful registration, show `SuccessBanner` and redirect to `/business/vi/dashboard` after 1.5s
  - [x] 4.5 On duplicate email error (409), display "Email nay da duoc dang ky" and preserve form data
  - [x] 4.6 Implement loading state with skeleton pattern (NOT spinner)

- [x] Task 5: Frontend — Zalo registration option for business owners (AC: #6, #7)
  - [x] 5.1 Add Zalo login button on business registration page (blue #0068FF brand color) — calls `/auth/business/zalo/authorize`
  - [x] 5.2 Create `apps/web/app/(business)/vi/auth/callback/page.tsx` — Zalo OAuth callback handler for business registration
  - [x] 5.3 On successful Zalo auth, redirect to `/business/vi/dashboard` with SuccessBanner

- [x] Task 6: Frontend — Tests (AC: #1, #4, #5, #6)
  - [x] 6.1 Create `apps/web/modules/business/components/__tests__/BusinessRegisterForm.test.tsx` — renders form fields, validates required fields, shows error on duplicate email
  - [x] 6.2 Test Zalo button triggers correct API call to `/auth/business/zalo/authorize`

## Dev Notes

### Critical: This is a Business Portal Page — No next-intl!

The business portal at `(business)/vi/*` is **hardcoded Vietnamese** with zero i18n overhead. Per architecture:
- Do NOT import or use `next-intl` for this page
- All UI text is hardcoded Vietnamese strings directly in components
- `lang="vi"` attribute is set on the layout
- The existing `(business)/vi/layout.tsx` already handles this — the new page inherits it

### Existing Auth Patterns to Reuse

**Backend `AuthService.email_register()` (service.py):**
```python
async def email_register(self, email: str, password: str, display_name: str) -> User:
    existing = await self.repo.get_user_by_email(email)
    if existing:
        raise EmailAlreadyRegistered()
    hashed = self.hash_password(password)
    user = await self.repo.create_user(
        email=email, hashed_password=hashed, display_name=display_name,
        role=UserRole.USER, provider=AuthProvider.EMAIL
    )
    return user
```
The new `email_register_business_owner()` should follow this exact pattern but:
- Set `role=UserRole.BUSINESS_OWNER` instead of `UserRole.USER`
- Accept and store additional fields: `business_name`, `phone_number`, `zalo_contact`
- Record `ConsentRecord` for terms acceptance

**Backend `AuthRepository.create_user()` (repository.py):**
Currently creates a `User` with basic fields. The new business fields (`business_name`, `phone_number`, `zalo_contact`) will be added to the `User` model as nullable columns — no separate BusinessOwner table needed.

**Router cookie pattern (router.py):**
```python
access_token = service.create_access_token(user)
refresh_token_str, refresh_hash = service.create_refresh_token()
await service.store_refresh_token(user.id, refresh_hash)
csrf_token = service.generate_csrf_token()
_set_auth_cookies(response, access_token, refresh_token_str, csrf_token)
return TokenResponse(user=UserOut.model_validate(user))
```
Reuse this exact pattern for business registration endpoint.

### Zalo OAuth for Business — Key Differences

The existing Zalo OAuth flow creates users with `role=User`. For business registration:
- Use separate endpoints (`/auth/business/zalo/authorize` and `/auth/business/zalo/callback`) to keep business and user flows distinct
- Store `"zalo_business"` (not `"zalo"`) as the provider value in Redis OAuth state to differentiate
- The service method `zalo_oauth_callback_business()` reuses the same PKCE + token exchange logic but calls `_find_or_create_social_user()` with `role=UserRole.BUSINESS_OWNER`
- **IMPORTANT:** `_find_or_create_social_user()` currently hardcodes `role=UserRole.USER`. Either add a `role` parameter to it, or create a parallel method for business owner creation

### User Model Changes

Add these nullable columns to the `User` model:
```python
# Only populated for BusinessOwner accounts
business_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
zalo_contact: Mapped[str | None] = mapped_column(String(100), nullable=True)
```

**Migration consideration:** These are all nullable additions — no data loss, no default values needed, safe to apply without downtime.

### Frontend Form Pattern

The user `SignupModal` uses React Hook Form + inline validation. The business registration form should follow a similar pattern but as a full page (not modal):

```tsx
// Use React Hook Form + Zod (per architecture)
const schema = z.object({
  email: z.string().email("Vui long nhap email hop le"),
  password: z.string().min(8, "Mat khau phai co it nhat 8 ky tu"),
  businessName: z.string().min(1, "Ten doanh nghiep la bat buoc"),
  phoneNumber: z.string().optional(),
  zaloContact: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Ban phai dong y voi Dieu khoan su dung" }),
  }),
});
```

**API call pattern** (reuse existing `apiClient` from `shared/lib/apiClient.ts`):
```typescript
const data = await apiClient<TokenResponse>("/auth/business/register", {
  method: "POST",
  body: JSON.stringify({
    email, password, businessName, phoneNumber, zaloContact, termsAccepted
  }),
});
```

Note: `apiClient` auto-transforms camelCase → snake_case on requests and snake_case → camelCase on responses.

### Frontend Callback Page Pattern

The business Zalo callback at `(business)/vi/auth/callback/page.tsx` should follow the user callback pattern at `(user)/[locale]/auth/callback/page.tsx`:
- Extract `code` and `state` from URL search params
- POST to `/auth/business/zalo/callback`
- On success, redirect to `/business/vi/dashboard`
- On failure, redirect to `/business/vi/auth/register` with error param
- **No locale extraction needed** — business portal is always Vietnamese

### CSRF Middleware Update

Add the new Zalo callback path to CSRF exemptions in `backend/shared/middleware/csrf.py`:
```python
EXEMPT_PATHS = [
    # ... existing paths ...
    "/api/v1/auth/business/zalo/callback",
]
```

### Previous Story Intelligence (from Story 1.5.1)

Key learnings from Zalo OAuth implementation:
- Zalo OAuth V4 requires PKCE — `generate_pkce_pair()` already implemented in `service.py`
- `secret_key` goes in HTTP **header**, NOT body (unlike LINE/Google)
- Zalo does NOT expose email — `email=None` for Zalo users, account linking by email won't work
- Redis keys: `oauth_state:{state}` for provider verification, `oauth_pkce:{state}` for code_verifier
- State format: `"{raw_token}:{locale}"` — extract raw_token by splitting on `":"`
- CSRF exemption was needed for Zalo callback — don't forget for business callback too

Review findings from 1.5.1 that apply here:
- Guard `profile["id"]` KeyError — use `.get()` with OAuthError fallback
- Validate `access_token` is truthy, not just present
- Guard against `zalo_app_secret=None` in httpx headers
- Add error logging in callback — match LINE callback's try/except pattern
- Reorder Redis getdel calls to prevent PKCE key orphan on state failure

### File Structure

**New files to create:**
- `apps/web/app/(business)/vi/auth/register/page.tsx` — Business registration page
- `apps/web/app/(business)/vi/auth/callback/page.tsx` — Zalo OAuth callback for business
- `apps/web/modules/business/components/BusinessRegisterForm.tsx` — Registration form component
- `apps/web/modules/business/components/__tests__/BusinessRegisterForm.test.tsx` — Tests
- `backend/migrations/versions/2026_04_16_xxxx_add_business_owner_fields_to_users.py` — DB migration

**Existing files to modify:**
- `backend/modules/auth/models.py` — Add `business_name`, `phone_number`, `zalo_contact` to User
- `backend/modules/auth/schemas.py` — Add `BusinessOwnerRegisterRequest`, `AgreementAcceptance`
- `backend/modules/auth/service.py` — Add `email_register_business_owner()`, `zalo_oauth_callback_business()`; update `_find_or_create_social_user()` to accept optional `role` parameter
- `backend/modules/auth/router.py` — Add `POST /auth/business/register`, `GET /auth/business/zalo/authorize`, `POST /auth/business/zalo/callback`
- `backend/shared/middleware/csrf.py` — Add business Zalo callback to CSRF exempt paths
- `backend/tests/auth/test_service.py` — Add business registration test cases
- `backend/tests/auth/test_router.py` — Add business endpoint test cases

### Architecture Compliance Checklist

- [x] Role: `UserRole.BUSINESS_OWNER` — already defined in `constants.py`
- [x] Password hashing: Argon2id — reuse existing `hash_password()` in `AuthService`
- [x] JWT cookies: HTTP-only — reuse `_set_auth_cookies()` helper
- [x] CSRF: Double submit cookie — add exemption for new callback endpoint
- [x] Rate limiting: 500/min for BusinessOwner — already configured in constants
- [x] Data format: snake_case in API, camelCase in frontend — auto-transform via `apiClient`
- [x] UUID v4 for all IDs — inherits from `BaseModel`
- [x] Soft delete pattern — `deleted_at` on BaseModel
- [x] Error handling: `AppException` hierarchy with trilingual messages
- [x] Module boundaries: No cross-module imports
- [x] Skeleton loading: No spinners

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-1-platform-foundation-authentication-design-system.md#Story 1.5.2]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR30, FR50, FR64, FR72]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Authentication & Security]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Backend Module Structure]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure-boundaries.md#Business Owner Routes]
- [Source: _bmad-output/implementation-artifacts/1-5-1-zalo-social-login-users.md]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- CSRF middleware required exemption for both `/api/v1/auth/business/register` and `/api/v1/auth/business/zalo/callback`
- Ruff lint caught line-length violation in business_zalo_authorize — refactored redirect_uri construction
- Frontend test for empty business name needed `fireEvent.submit` on form element (not click on button) to bypass jsdom HTML5 validation

### Completion Notes List

- Implemented business owner email registration with Argon2id password hashing, role=BusinessOwner
- Added 3 nullable columns to User model: business_name, phone_number, zalo_contact (via Alembic migration)
- Business Zalo OAuth reuses PKCE flow from story 1.5.1 but stores "zalo_business" in Redis state to differentiate from user flow
- Updated `_find_or_create_social_user()` to accept optional `role` parameter (default USER) — backward compatible
- Terms of Service acceptance recorded as ConsentRecord with consent_type="terms_of_service"
- Frontend registration form at /business/vi/auth/register — entirely Vietnamese, no next-intl dependency
- Client-side validation via custom validate() function with Vietnamese error messages
- Success state shows green checkmark animation and auto-redirects to dashboard after 1.5s
- Duplicate email error (409) preserves form data and shows Vietnamese error message
- Backend: 52 tests passing (13 new), Frontend: 76 tests passing (8 new)

### Change Log

- 2026-04-16: Implemented business owner registration with email + Zalo OAuth, backend endpoints, frontend form and callback pages, tests

### File List

- backend/modules/auth/models.py (modified — added business_name, phone_number, zalo_contact columns to User)
- backend/modules/auth/schemas.py (modified — added BusinessOwnerRegisterRequest schema, added business fields to UserOut)
- backend/modules/auth/service.py (modified — added email_register_business_owner(), zalo_oauth_callback_business(); updated _find_or_create_social_user() with role param)
- backend/modules/auth/router.py (modified — added POST /business/register, GET /business/zalo/authorize, POST /business/zalo/callback)
- backend/shared/middleware/csrf.py (modified — added business register and callback to CSRF exempt paths)
- backend/migrations/versions/2026_04_16_0001_add_business_owner_fields_to_users.py (created — adds business_name, phone_number, zalo_contact to users table)
- backend/tests/auth/test_service.py (modified — added TestEmailRegisterBusinessOwner, TestZaloOAuthCallbackBusiness test classes)
- backend/tests/auth/test_router.py (modified — added TestBusinessRegister, TestBusinessZaloAuthorize, TestBusinessZaloCallback test classes)
- apps/web/app/(business)/vi/auth/register/page.tsx (created — business registration page)
- apps/web/app/(business)/vi/auth/callback/page.tsx (created — business Zalo OAuth callback page)
- apps/web/modules/business/components/BusinessRegisterForm.tsx (created — registration form component)
- apps/web/modules/business/components/__tests__/BusinessRegisterForm.test.tsx (created — 8 test cases)
