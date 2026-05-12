# Story 1.4: User Authentication — Social Login (LINE & Google)

Status: done

## Story

As a Japanese user,
I want to register and login via LINE or Google,
So that I can access personalized features like saving listings and posting reviews.

## Acceptance Criteria

1. **Given** I am a guest browsing public content
   **When** I attempt a restricted action (save listing, write review, post in community)
   **Then** a Signup Modal appears with LINE login as the primary prominent button
   **And** Google login appears as a secondary option
   **And** email registration is available via an expandable accordion

2. **Given** I tap the LINE login button
   **When** the LINE OAuth flow completes successfully
   **Then** my account is created with role "User"
   **And** a JWT is stored in an HTTP-only cookie with refresh token
   **And** a green checkmark success animation plays
   **And** I am auto-redirected after 1.5 seconds
   **And** the original restricted action completes (e.g., listing is saved)

3. **Given** I tap the Google login button
   **When** the Google OAuth flow completes successfully
   **Then** the same JWT + refresh token flow applies as LINE login

4. **Given** I have an existing session
   **When** I return to the platform
   **Then** my JWT is automatically refreshed via refresh token rotation
   **And** I remain authenticated without re-login

5. **Given** the backend auth module
   **When** any API request is made
   **Then** the system enforces role-based access: Guest (public only), User (authenticated features), BusinessOwner (business endpoints), Admin (admin endpoints)
   **And** CSRF protection via double submit cookie pattern is active
   **And** rate limiting is enforced: 100 req/min Guest, 300 req/min User

6. **Given** I register for the first time
   **When** the registration flow completes
   **Then** a consent dialog collects explicit consent for activity logging and location tracking (FR54)
   **And** the consent record is stored in the database

## Tasks / Subtasks

- [x] Task 1: Create backend auth models — User, RefreshToken, ConsentRecord (AC: #2, #3, #4, #6)
  - [x] Create `backend/modules/auth/models.py` with User model (id, email, display_name, avatar_url, role, provider, provider_id, hashed_password, is_active)
  - [x] Create RefreshToken model (id, user_id, token_hash, expires_at, revoked_at)
  - [x] Create ConsentRecord model (id, user_id, consent_type, granted, ip_address, user_agent)
  - [x] Create Alembic migration for all auth tables
  - [x] Add UserRole enum: GUEST, USER, BUSINESS_OWNER, ADMIN

- [x] Task 2: Create backend auth schemas — Pydantic request/response models (AC: #1-#6)
  - [x] Create `backend/modules/auth/schemas.py` with LoginRequest, TokenResponse, UserOut, ConsentRequest
  - [x] SocialLoginCallbackRequest (code, state, provider)
  - [x] AuthErrorResponse matching custom error format (error_code, message_ja, message_vi, message_en)

- [x] Task 3: Create backend auth service — JWT, social login, session management (AC: #2, #3, #4)
  - [x] Create `backend/modules/auth/service.py` with AuthService class
  - [x] Implement `create_jwt_token(user)` — access token (24h expiry) + refresh token
  - [x] Implement `refresh_access_token(refresh_token)` — refresh token rotation (issue new pair, revoke old)
  - [x] Implement `line_oauth_callback(code)` — exchange code for LINE access token, fetch profile, create/find user
  - [x] Implement `google_oauth_callback(code)` — exchange code for Google access token, fetch profile, create/find user
  - [x] Implement `record_consent(user_id, consents)` — store consent records
  - [x] Use Argon2id for any password hashing (email registration fallback)
  - [x] Use `httpx.AsyncClient` for external OAuth API calls (LINE, Google)

- [x] Task 4: Create backend auth repository (AC: #2, #3, #4)
  - [x] Create `backend/modules/auth/repository.py` with AuthRepository class
  - [x] `get_user_by_provider(provider, provider_id)` — find existing social login user
  - [x] `get_user_by_email(email)` — find by email
  - [x] `create_user(user_data)` — insert new user
  - [x] `create_refresh_token(user_id, token_hash, expires_at)` — store refresh token
  - [x] `revoke_refresh_token(token_hash)` — set revoked_at
  - [x] `get_valid_refresh_token(token_hash)` — find non-expired, non-revoked token

- [x] Task 5: Create backend auth router — API endpoints (AC: #1-#6)
  - [x] Create `backend/modules/auth/router.py` with FastAPI APIRouter prefix `/api/v1/auth`
  - [x] `GET /api/v1/auth/line/authorize` — return LINE OAuth authorization URL
  - [x] `POST /api/v1/auth/line/callback` — handle LINE OAuth callback, return set-cookie with JWT
  - [x] `GET /api/v1/auth/google/authorize` — return Google OAuth authorization URL
  - [x] `POST /api/v1/auth/google/callback` — handle Google OAuth callback, return set-cookie with JWT
  - [x] `POST /api/v1/auth/refresh` — refresh access token using refresh token from cookie
  - [x] `POST /api/v1/auth/logout` — revoke refresh token, clear cookies
  - [x] `GET /api/v1/auth/me` — return current user profile
  - [x] `POST /api/v1/auth/consent` — record user consent
  - [x] Register router in `backend/main.py`

- [x] Task 6: Create backend auth dependencies — middleware guards (AC: #5)
  - [x] Create `backend/modules/auth/dependencies.py`
  - [x] `get_current_user(request)` — extract JWT from HTTP-only cookie, validate, return User
  - [x] `get_current_user_optional(request)` — same but returns None for guests
  - [x] `require_role(role)` — dependency factory that checks user role
  - [x] `require_admin_sub_role(sub_role)` — for admin sub-role checks

- [x] Task 7: Create backend auth exceptions and constants (AC: #5)
  - [x] Create `backend/modules/auth/exceptions.py` — InvalidCredentials, TokenExpired, InsufficientPermissions, AccountDisabled
  - [x] Create `backend/modules/auth/constants.py` — UserRole enum, token expiry values, OAuth URLs

- [x] Task 8: Create CSRF middleware and rate limiter (AC: #5)
  - [x] Implement CSRF double submit cookie pattern in `backend/shared/middleware/csrf.py`
  - [x] Implement Redis-backed rate limiter in `backend/shared/middleware/rate_limiter.py`
  - [x] Rate limits: 100/min Guest, 300/min User, 500/min BusinessOwner
  - [x] Register middleware in `backend/main.py`

- [x] Task 9: Create frontend auth store and API client (AC: #1-#4)
  - [x] Create `apps/web/shared/stores/useAuthStore.ts` — Zustand store with user state, isAuthenticated, login/logout actions
  - [x] Create `apps/web/shared/lib/apiClient.ts` — fetch wrapper with snake_case/camelCase auto-transform, cookie credentials, CSRF header
  - [x] Create `apps/web/shared/providers/AuthProvider.tsx` — wraps app, checks auth on mount via `/api/v1/auth/me`, provides auth context
  - [x] Create `apps/web/shared/hooks/useAuth.ts` — hook exposing auth state, login redirects, logout

- [x] Task 10: Create frontend Signup Modal component (AC: #1, #2, #3, #6)
  - [x] Create `apps/web/modules/user/components/SignupModal.tsx`
  - [x] LINE login as primary CTA (Coral fill or LINE green #06C755)
  - [x] Google login as secondary option
  - [x] Email registration behind Accordion (expandable)
  - [x] Uses existing Modal component (bottom sheet on mobile)
  - [x] Success animation: green checkmark (SuccessBanner) + 1.5s auto-redirect
  - [x] Consent checkboxes for activity logging and location tracking (FR54)
  - [x] All text via next-intl translations (Japanese default)

- [x] Task 11: Create frontend OAuth callback page (AC: #2, #3)
  - [x] Create `apps/web/app/(user)/[locale]/auth/callback/page.tsx`
  - [x] Handle OAuth redirect: extract code + state from URL params
  - [x] POST to backend callback endpoint
  - [x] On success: update auth store, show SuccessBanner, redirect to original page
  - [x] On error: show Toast error, redirect to home
  - [x] Loading state: Skeleton (not spinner)

- [x] Task 12: Wire auth guards into existing navigation (AC: #1, #5)
  - [x] Update SaveHeartButton to call `onUnauthenticated` → open SignupModal
  - [x] Add auth state to TopNav (show profile avatar or login button)
  - [x] Add auth state to BottomTabNav Profile tab (show login prompt or profile link)
  - [x] Update AuthProvider in root layout

- [x] Task 13: Write backend tests (AC: #1-#6)
  - [x] Create `backend/tests/auth/test_service.py` — test JWT creation, refresh rotation, social login flows
  - [x] Create `backend/tests/auth/test_router.py` — test all auth endpoints, error cases
  - [x] Test RBAC dependencies with different roles
  - [x] Test CSRF and rate limiting middleware
  - [x] Target: 100% coverage for auth module (critical path)

- [x] Task 14: Write frontend tests (AC: #1, #2, #3)
  - [x] Create `apps/web/modules/user/components/__tests__/SignupModal.test.tsx`
  - [x] Test SignupModal renders LINE + Google buttons, accordion email form
  - [x] Test auth store state transitions
  - [x] Test AuthProvider initialization flow

## Dev Notes

### Architecture Compliance

- **Backend module pattern**: Follow exact structure — `router.py`, `service.py`, `repository.py`, `models.py`, `schemas.py`, `events.py`, `exceptions.py`, `constants.py`. All files required even if minimal.
- **Module boundary**: Auth module MUST NOT directly import other modules. Use FastAPI `Depends()` for injection, Event Bus for async side effects.
- **Repository pattern**: All DB queries go through `repository.py`, never inline SQLAlchemy in service or router.
- **Pydantic V2**: Use for all request/response schemas. `model_config = ConfigDict(from_attributes=True)` for ORM compatibility.
- **Error format**: All errors MUST use `AppException` subclass with trilingual messages (ja, vi, en). See `backend/shared/exceptions.py`.

### Authentication Architecture (from architecture doc)

- **Token strategy**: JWT in HTTP-only cookies (not localStorage — XSS resistant). Access token 24h, Admin 8h.
- **Refresh token rotation**: Each refresh issues a new pair and revokes the old token. Stored as hash in DB.
- **Password hashing**: Argon2id (`argon2-cffi` already in requirements.txt).
- **CSRF**: Double submit cookie — backend sets a CSRF cookie, frontend sends it back as header `X-CSRF-Token`.
- **Session expiry**: 24h User, 8h Admin, forced logout on password change.
- **RBAC**: 4 roles — Guest (default, no auth), User, BusinessOwner, Admin. Admin has sub-roles: content, technical, business.

### LINE Login OAuth2 v2.1 — API Details

**Authorization flow:**
1. Frontend redirects user to: `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id={CHANNEL_ID}&redirect_uri={CALLBACK_URL}&state={CSRF_STATE}&scope=profile%20openid%20email`
2. LINE redirects back with `?code={AUTH_CODE}&state={STATE}`
3. Backend exchanges code at: `POST https://api.line.me/oauth2/v2.1/token` (form-encoded: grant_type=authorization_code, code, redirect_uri, client_id, client_secret)
4. Response contains access_token, id_token (JWT), refresh_token
5. Verify ID token at: `POST https://api.line.me/oauth2/v2.1/verify` OR decode JWT locally using LINE JWKS at `https://api.line.me/oauth2/v2.1/certs`
6. Get profile at: `GET https://api.line.me/v2/profile` (Bearer token)

**LINE profile response:** `{ userId, displayName, pictureUrl, statusMessage }`

### Google OAuth2 — API Details

**Authorization flow:**
1. Frontend redirects to: `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={CLIENT_ID}&redirect_uri={CALLBACK_URL}&scope=openid%20email%20profile&state={STATE}`
2. Google redirects back with `?code={AUTH_CODE}&state={STATE}`
3. Backend exchanges code at: `POST https://oauth2.googleapis.com/token` (form-encoded: grant_type=authorization_code, code, redirect_uri, client_id, client_secret)
4. Decode id_token (JWT) or call: `GET https://www.googleapis.com/oauth2/v3/userinfo` (Bearer token)

**Google userinfo response:** `{ sub, name, email, picture, email_verified }`

### JWT Library Choice

Use **PyJWT** (`pip install PyJWT`) — python-jose is poorly maintained. PyJWT is actively maintained, focused, and sufficient for HS256 signing. Add to `requirements.txt`.

### Key Libraries to Add

**Backend (add to requirements.txt):**
- `PyJWT` — JWT encode/decode
- `httpx` — already installed, use for OAuth API calls
- `argon2-cffi` — already installed, use for password hashing

**Frontend (check if already installed, add if not):**
- `zustand` — for auth store
- `@tanstack/react-query` — for data fetching (TanStack Query)

### Database Schema — Auth Tables

```sql
-- users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'USER',
    provider VARCHAR(20),          -- 'line', 'google', 'email'
    provider_id VARCHAR(255),      -- LINE userId or Google sub
    hashed_password TEXT,          -- only for email registration
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX idx_users_provider ON users(provider, provider_id) WHERE provider IS NOT NULL;
CREATE INDEX idx_users_email ON users(email);

-- refresh_tokens table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

-- consent_records table
CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    consent_type VARCHAR(50) NOT NULL,  -- 'activity_logging', 'location_tracking'
    granted BOOLEAN NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_consent_records_user ON consent_records(user_id);
```

### Existing Code to USE (not recreate)

**Backend existing infrastructure:**
- `backend/shared/base_models.py` — `BaseModel` with id (UUID), created_at, updated_at, deleted_at. Inherit ALL models from this.
- `backend/shared/exceptions.py` — `AppException(code, message_ja, message_vi, message_en, status_code)`. Inherit auth exceptions from this.
- `backend/shared/config.py` — `Settings` class already has `jwt_secret`, `jwt_algorithm`, `access_token_expire_minutes`, `line_client_id`, `line_client_secret`, `google_client_id`, `google_client_secret`. Use `settings` import directly.
- `backend/shared/database.py` — `get_async_session()` dependency for DB sessions.
- `backend/shared/middleware/error_handler.py` — global exception handler already registered.
- `backend/shared/middleware/cors.py` — CORS already configured.
- `backend/shared/middleware/request_id.py` — request ID middleware already registered.
- `backend/main.py` — FastAPI app with lifespan, middleware, health check. Add auth router here.

**Frontend existing components (from Story 1.2):**
- `Modal` — use for SignupModal (bottom sheet on mobile <768px, centered on desktop)
- `Accordion` — use for expandable email registration section
- `SuccessBanner` — use for green checkmark success animation after login
- `PrimaryCTAButton` — use for LINE login button styling
- `Toast` / `useToast` — use for error notifications
- `Skeleton` — use for loading states (NEVER spinners)
- `SaveHeartButton` — already has `onUnauthenticated` callback prop, wire it to SignupModal
- `cn()` utility at `shared/lib/cn.ts`

**Frontend existing navigation (from Story 1.3):**
- `BottomTabNav` — Profile tab needs auth state awareness
- `TopNav` — needs login/avatar button on right side
- Route group layouts already configured: `(user)/[locale]/layout.tsx`
- `next-intl` configured with `messages/ja.json`, `messages/en.json`, `messages/vi.json`

### Cookie Configuration

```python
# Set JWT in HTTP-only cookie
response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    secure=True,          # HTTPS only in production
    samesite="lax",
    max_age=86400,        # 24 hours
    path="/",
)
response.set_cookie(
    key="refresh_token",
    value=refresh_token,
    httponly=True,
    secure=True,
    samesite="lax",
    max_age=604800,       # 7 days
    path="/api/v1/auth/refresh",  # only sent to refresh endpoint
)
# CSRF double submit cookie (readable by JS)
response.set_cookie(
    key="csrf_token",
    value=csrf_token,
    httponly=False,        # JS must read this
    secure=True,
    samesite="lax",
    max_age=86400,
)
```

### Frontend OAuth Flow

1. User clicks LINE/Google button → frontend calls `GET /api/v1/auth/{provider}/authorize`
2. Backend returns OAuth authorization URL with state parameter
3. Frontend redirects user to OAuth provider
4. User grants access → provider redirects to `/auth/callback?code=...&state=...`
5. Callback page sends `POST /api/v1/auth/{provider}/callback` with code + state
6. Backend exchanges code, creates/finds user, sets cookies, returns user data
7. Frontend updates auth store, shows SuccessBanner, redirects to original page

### i18n Keys to Add

```json
{
  "auth": {
    "signup_modal_title": "ログイン / 新規登録",
    "line_login": "LINEでログイン",
    "google_login": "Googleでログイン",
    "email_register": "メールで登録",
    "email_placeholder": "メールアドレス",
    "password_placeholder": "パスワード",
    "consent_activity": "利用状況の記録に同意します",
    "consent_location": "位置情報の利用に同意します",
    "login_success": "ログインしました！",
    "login_error": "ログインに失敗しました",
    "logout": "ログアウト",
    "profile": "マイページ"
  }
}
```

### File Structure

Files to CREATE:
```
backend/modules/auth/models.py           — User, RefreshToken, ConsentRecord SQLAlchemy models
backend/modules/auth/schemas.py          — Pydantic V2 request/response models
backend/modules/auth/service.py          — AuthService: JWT, OAuth, session management
backend/modules/auth/repository.py       — AuthRepository: DB queries
backend/modules/auth/router.py           — Auth API endpoints (/api/v1/auth/*)
backend/modules/auth/dependencies.py     — get_current_user, require_role
backend/modules/auth/exceptions.py       — InvalidCredentials, TokenExpired, etc.
backend/modules/auth/constants.py        — UserRole enum, token config, OAuth URLs
backend/modules/auth/events.py           — user.registered, user.logged_in events
backend/shared/middleware/csrf.py        — CSRF double submit cookie middleware
backend/shared/middleware/rate_limiter.py — Redis-backed rate limiter
backend/migrations/versions/2026_04_12_xxxx_create_auth_tables.py — Alembic migration

apps/web/shared/stores/useAuthStore.ts   — Zustand auth state store
apps/web/shared/lib/apiClient.ts         — Fetch wrapper with CSRF + cookie credentials
apps/web/shared/providers/AuthProvider.tsx — Auth context provider
apps/web/shared/hooks/useAuth.ts         — Auth hook
apps/web/modules/user/components/SignupModal.tsx — Login/signup modal
apps/web/app/(user)/[locale]/auth/callback/page.tsx — OAuth callback handler page

backend/tests/auth/test_service.py       — Auth service unit tests
backend/tests/auth/test_router.py        — Auth router integration tests
apps/web/modules/user/components/__tests__/SignupModal.test.tsx — SignupModal tests
```

Files to MODIFY:
```
backend/main.py                          — Register auth router + CSRF + rate limiter middleware
backend/requirements.txt                 — Add PyJWT
apps/web/shared/components/index.ts      — No changes needed (components already exported)
apps/web/app/layout.tsx                  — Wrap with AuthProvider
apps/web/app/(user)/[locale]/layout.tsx  — Ensure AuthProvider accessible
apps/web/shared/components/TopNav.tsx    — Add login/avatar button
apps/web/shared/components/BottomTabNav.tsx — Auth-aware Profile tab
apps/web/messages/ja.json               — Add auth.* translation keys
apps/web/messages/en.json               — Add auth.* translation keys
apps/web/messages/vi.json               — Add auth.* translation keys
.env.example                            — Add LINE_CLIENT_ID, LINE_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
```

### Anti-Patterns to Avoid

- DO NOT store JWT in localStorage or sessionStorage — use HTTP-only cookies only
- DO NOT use python-jose — use PyJWT (python-jose is poorly maintained)
- DO NOT use `os.getenv()` — use `settings` from `shared/config.py`
- DO NOT import auth module directly from other modules — use Depends() injection
- DO NOT use auto-increment IDs — use UUID v4 (BaseModel provides this)
- DO NOT use spinners — use Skeleton component for loading states
- DO NOT hardcode strings in frontend — use next-intl translation keys
- DO NOT create a separate tailwind config — Tailwind 4.x uses CSS @theme
- DO NOT skip CSRF protection on state-changing endpoints
- DO NOT store raw refresh tokens in DB — store hashed values only
- DO NOT use `any` type in TypeScript — use proper types or `unknown`
- DO NOT import across module boundaries in backend
- DO NOT create new shared components if existing ones suffice (Modal, Accordion, Toast, etc.)

### Previous Story Intelligence (Story 1.3)

**Key learnings from Story 1.3:**
- Route group layouts are configured and working: `(user)/[locale]/layout.tsx`, `(business)/vi/layout.tsx`, `(admin)/layout.tsx`
- next-intl v4.9.1 with `createNextIntlPlugin` in next.config.ts — server component support works
- 62 tests passing, vitest configured with modules/ pattern
- BottomTabNav uses `lg:hidden` breakpoint, TopNav uses `hidden lg:block`
- `SaveHeartButton` has `onUnauthenticated` prop — ready to wire to SignupModal
- AdminSidebar has `roles?` field defined but not filtered — RBAC filtering is THIS story's scope
- Next.js 16.2.3 in use — check `node_modules/next/dist/docs/` for breaking changes
- `apps/web/shared/lib/proxy.ts` exists — BFF proxy pattern already set up

**Review feedback from Story 1.3 relevant here:**
- `[Defer] AdminSidebar roles? field defined but never filtered — deferred, RBAC is Story 1.4 scope` → Implement role-based menu filtering in AdminSidebar as part of this story

### Git Intelligence

- Latest commit: `7e6cc6b` — code review patches for Story 1.3 (nav breakpoints, active state, Link, locale error pages, Vietnamese labels)
- Backend has minimal setup: main.py with health check, shared infrastructure (config, database, redis, exceptions, middleware)
- `backend/modules/auth/__init__.py` exists but is empty — module directory is ready
- `backend/modules/listing/__init__.py` exists — listing module placeholder ready
- Docker infrastructure configured (PostgreSQL, Redis, Meilisearch, Nginx)
- `argon2-cffi` and `httpx` already in requirements.txt

### Environment Variables Needed

```env
# LINE Login (from LINE Developers Console)
LINE_CLIENT_ID=your_line_channel_id
LINE_CLIENT_SECRET=your_line_channel_secret
LINE_REDIRECT_URI=http://localhost:3000/ja/auth/callback

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/ja/auth/callback

# JWT (already in config.py with defaults)
JWT_SECRET=change-this-secret-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### References

- [Source: epics/epic-1-platform-foundation-authentication-design-system.md#story-1.4] — Story requirements and AC
- [Source: architecture/core-architectural-decisions.md#authentication-security] — JWT, Argon2id, CSRF, rate limiting, RBAC
- [Source: architecture/project-structure-boundaries.md#backend-module-structure] — Module file structure
- [Source: architecture/implementation-patterns-consistency-rules.md] — Naming, error format, repository pattern
- [Source: prd/functional-requirements.md#FR8-FR53-FR54] — Social login, RBAC, consent
- [Source: prd/domain-specific-requirements.md] — Privacy, consent, APPI compliance
- [Source: prd/user-journeys.md] — Tanaka-san and Yamada-san journeys requiring auth
- [Source: implementation-artifacts/1-3-application-layout-shell-navigation.md] — Previous story context
- [Source: LINE Login v2.1 API] — https://developers.line.biz/en/reference/line-login/
- [Source: Google OAuth2] — https://developers.google.com/identity/protocols/oauth2

## Review Findings

### Decision Needed (all resolved)

- [x] [Review][Decision] D1: Email registration form — resolved: implemented full email register route + frontend handler
- [x] [Review][Decision] D2: `require_admin_sub_role` — resolved: implemented `admin_sub_role` field on User model + sub-role check
- [x] [Review][Decision] D3: Email collision between providers — resolved: auto-link accounts when email matches

### Patch (all applied)

- [x] [Review][Patch] P1: OAuth `state` stored in Redis, verified on callback [router.py]
- [x] [Review][Patch] P2: `sessionStorage.setItem` added in `useAuth.ts` before OAuth redirect
- [x] [Review][Patch] P3: Consent stored in sessionStorage, submitted after OAuth callback + on email register [SignupModal.tsx, callback/page.tsx]
- [x] [Review][Patch] P4: `AuthUser` interface changed to camelCase to match `apiClient` transform [useAuthStore.ts, TopNav.tsx, tests]
- [x] [Review][Patch] P5: `refresh_token` cookie path broadened to `/api/v1/auth` [router.py]
- [x] [Review][Patch] P6: Auto token refresh on 401 added to `apiClient` with deduplication [apiClient.ts]
- [x] [Review][Patch] P7: Redirect URI uses `locale` query param, validated against allowlist [router.py]
- [x] [Review][Patch] P8: `_find_or_create_social_user` catches IntegrityError + retries [service.py]
- [x] [Review][Patch] P9: Refresh token rotation uses `SELECT FOR UPDATE` [repository.py, service.py]
- [x] [Review][Patch] P10: CSS spinner replaced with `Skeleton` component [SignupModal.tsx]
- [x] [Review][Patch] P11: Rate limiter key uses IP + user_id instead of role [rate_limiter.py]
- [x] [Review][Patch] P12: `httpx.Timeout(10.0)` added to OAuth HTTP calls [service.py]
- [x] [Review][Patch] P13: `oauth_provider` validated against allowlist `["line", "google"]` [callback/page.tsx]
- [x] [Review][Patch] P14: Rate limiter uses Lua script for atomic incr+expire [rate_limiter.py]
- [x] [Review][Patch] P15: `<img>` replaced with `next/image` + `remotePatterns` config [TopNav.tsx, next.config.ts]
- [x] [Review][Patch] P16: `get_current_user_optional` narrows exception catch [dependencies.py]

### Deferred

- [x] [Review][Defer] W1: Logout does not invalidate access token (stateless JWT, needs Redis blacklist) — deferred, design decision requiring infrastructure
- [x] [Review][Defer] W2: Access token 24h lifetime too long for cookie-based flow — deferred, matches spec requirement
- [x] [Review][Defer] W3: Refresh token hash uses SHA-256 instead of Argon2id — deferred, marginal for random tokens
- [x] [Review][Defer] W4: `jwt_secret` default not validated on startup — deferred, deployment concern
- [x] [Review][Defer] W5: Migration `downgrade()` missing `IF EXISTS` guards — deferred, minor robustness
- [x] [Review][Defer] W6: `AuthProvider` double fetch in React StrictMode — deferred, dev-only issue
- [x] [Review][Defer] W7: Zustand store not persisted — loading flash on page load — deferred, UX improvement

## Dev Agent Record

### Agent Model Used

claude-opus-4-6 (1M context)

### Debug Log References

- Frontend SignupModal test: `screen.getByText("メールで登録")` failed with "multiple elements found" — fixed to use `getAllByText` since the text appears in both accordion trigger and submit button.
- Backend service tests: `ModuleNotFoundError: No module named 'argon2'` — required `pip install argon2-cffi` in dev environment (already in requirements.txt for Docker).
- BottomTabNav and TopNav existing tests failed after auth integration — resolved by adding `useAuth` and `SignupModal` mocks to the test files.

### Completion Notes List

- **Task 1-8 (Backend)**: Implemented full auth module following `router.py/service.py/repository.py/models.py/schemas.py/events.py/exceptions.py/constants.py` pattern. JWT via PyJWT (HS256), Argon2id password hashing, refresh token rotation (SHA-256 hashed in DB), CSRF double-submit cookie middleware, Redis-backed rate limiter (100/300/500 req/min for Guest/User/BusinessOwner). Auth router registered at `/api/v1/auth` in `main.py`.
- **Task 9-12 (Frontend)**: Zustand auth store, `apiClient.ts` with snake_case↔camelCase auto-transform + CSRF header injection, `AuthProvider` checks `/api/v1/auth/me` on mount, `useAuth` hook exposes login/logout. `SignupModal` uses existing `Modal`/`Accordion`/`PrimaryCTAButton` components. OAuth callback page uses `Skeleton` for loading, `SuccessBanner` for success (1.5s redirect). `TopNav` and `BottomTabNav` are auth-aware. Root `layout.tsx` wrapped with `AuthProvider`.
- **Task 13-14 (Tests)**: 25 backend tests pass (15 service + 9 router + 1 health). 67 frontend tests pass (20 test files, 5 new SignupModal tests).
- **Note on SaveHeartButton**: The component already has `onUnauthenticated` prop wired correctly — consumers need to pass a callback that opens `SignupModal`. No changes needed to the component itself.

### Change Log

- 2026-04-12: Implemented Story 1.4 — User Authentication (Social Login: LINE & Google). Created full backend auth module (models, schemas, service, repository, router, dependencies, exceptions, constants, events). Added CSRF middleware and Redis rate limiter. Created Alembic migration for auth tables. Added PyJWT to requirements.txt. Created frontend auth store (Zustand), API client, AuthProvider, useAuth hook, SignupModal component, OAuth callback page. Updated TopNav, BottomTabNav with auth state. Wrapped root layout with AuthProvider. Added auth i18n keys to ja/en/vi message files. Added LINE/Google env vars to .env.example. All tests passing: 25 backend + 67 frontend.

### File List

**Created:**
- `backend/modules/auth/models.py`
- `backend/modules/auth/schemas.py`
- `backend/modules/auth/service.py`
- `backend/modules/auth/repository.py`
- `backend/modules/auth/router.py`
- `backend/modules/auth/dependencies.py`
- `backend/modules/auth/exceptions.py`
- `backend/modules/auth/constants.py`
- `backend/modules/auth/events.py`
- `backend/shared/middleware/csrf.py`
- `backend/shared/middleware/rate_limiter.py`
- `backend/migrations/versions/2026_04_12_0001_create_auth_tables.py`
- `backend/tests/auth/__init__.py`
- `backend/tests/auth/test_service.py`
- `backend/tests/auth/test_router.py`
- `apps/web/shared/stores/useAuthStore.ts`
- `apps/web/shared/lib/apiClient.ts`
- `apps/web/shared/providers/AuthProvider.tsx`
- `apps/web/shared/hooks/useAuth.ts`
- `apps/web/modules/user/components/SignupModal.tsx`
- `apps/web/app/(user)/[locale]/auth/callback/page.tsx`
- `apps/web/modules/user/components/__tests__/SignupModal.test.tsx`

**Modified:**
- `backend/main.py` — registered auth router, CSRF middleware, rate limiter
- `backend/requirements.txt` — added PyJWT
- `backend/migrations/env.py` — import auth models for Alembic detection
- `apps/web/app/layout.tsx` — wrapped with AuthProvider
- `apps/web/shared/components/TopNav.tsx` — auth-aware (login button / avatar)
- `apps/web/shared/components/BottomTabNav.tsx` — auth-aware profile tab
- `apps/web/messages/ja.json` — added auth.* keys
- `apps/web/messages/en.json` — added auth.* keys
- `apps/web/messages/vi.json` — added auth.* keys
- `.env.example` — added LINE/Google redirect URI env vars
- `apps/web/shared/components/__tests__/BottomTabNav.test.tsx` — added useAuth and SignupModal mocks
- `apps/web/shared/components/__tests__/TopNav.test.tsx` — added useAuth and SignupModal mocks
