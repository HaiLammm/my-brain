# Story 3.1: Newcomer Onboarding Flow

Status: review

## Story

As a Japanese newcomer who just arrived in Da Nang,
I want to complete a quick questionnaire and receive a personalized first-week checklist,
So that I know exactly what to do in my first week without feeling lost.

## Acceptance Criteria

1. **Given** I tap "はじめる" on the homepage welcome banner or visit `/ja/onboarding`
   **When** the onboarding page loads
   **Then** a welcome header shows with friendly illustration, headline "ダナン生活、一緒に始めましょう！", and a 3-step progress indicator (filled/empty dots)

2. **Given** Step 1 "ダナンに来た理由は？"
   **When** I see the situation options
   **Then** 4 card-style options display: 🏢 仕事で転勤, 💻 フリーランス・ノマド, 🎓 留学, 🏖️ 旅行
   **And** selecting 🏖️ 旅行 redirects to a tourist-specific first-24h guide flow
   **And** selecting any other option advances to Step 2

3. **Given** Step 2 "今、一番困っていることは？"
   **When** I see the urgency topic chips
   **Then** 8 multi-select chips display (住まい, SIM, 銀行, 食事, 交通, ビザ, 病院, 友達)
   **And** I can select maximum 3 chips (toggle on/off)
   **And** a "次へ" button advances to Step 3

4. **Given** Step 3 "職場はどのエリアですか？"
   **When** I see the area selector
   **Then** a simplified Da Nang area list shows 5 areas with Japanese names
   **And** a "まだ決まっていない" fallback option is available
   **And** selecting an area completes the questionnaire

5. **Given** the questionnaire is complete
   **When** the checklist generates
   **Then** a personalized "あなたの1週間プラン" displays with day-by-day tasks prioritized by selected urgency topics
   **And** each task has a checkbox, icon, description, and link to relevant guide/search page
   **And** the recommended next action is marked with ★
   **And** each item has an expandable "先輩のアドバイス" senpai tip (Accordion)
   **And** checklist state persists in localStorage for guests, in user account for registered users

6. **Given** the save progress sticky bar on mobile
   **When** I see "チェックリストを保存しますか？"
   **Then** "LINEで登録" CTA triggers the signup modal
   **And** "あとで" dismisses the bar and checklist remains in localStorage

## Tasks / Subtasks

### Backend

- [x] Task 1: Create onboarding module (AC: #5)
  - [x] 1.1 Create `backend/modules/onboarding/` with standard module structure (router, service, schemas, constants)
  - [x] 1.2 Define `OnboardingRequest` schema: `situation` (enum), `urgency_topics` (list[str], max 3), `area` (str | null)
  - [x] 1.3 Define `ChecklistResponse` schema: list of `ChecklistDay` with tasks
  - [x] 1.4 Implement `POST /api/v1/onboarding/checklist` endpoint (public, no auth required)
  - [x] 1.5 Implement checklist generation logic in `service.py` — map situation + urgency topics + area to day-by-day tasks
  - [x] 1.6 Define checklist task templates in `constants.py` with senpai tips per topic
  - [x] 1.7 Add `GET /api/v1/onboarding/checklist` for authenticated users to retrieve saved checklist
  - [x] 1.8 Add `PATCH /api/v1/onboarding/checklist` for authenticated users to update task completion status

- [x] Task 2: Checklist persistence for authenticated users (AC: #5)
  - [x] 2.1 Create `OnboardingChecklist` model: user_id (FK), situation, urgency_topics (JSON), area, task_completions (JSON), created_at, updated_at
  - [x] 2.2 Create Alembic migration `{date}_create_onboarding_checklist_table.py`
  - [x] 2.3 Implement repository with CRUD operations

- [x] Task 3: Backend tests
  - [x] 3.1 Test checklist generation for each situation type
  - [x] 3.2 Test urgency topic prioritization logic
  - [x] 3.3 Test max 3 topics validation
  - [x] 3.4 Test tourist redirect response
  - [x] 3.5 Test authenticated checklist save/retrieve/update

### Frontend

- [x] Task 4: Create onboarding page route (AC: #1)
  - [x] 4.1 Create `apps/web/app/(user)/[locale]/onboarding/page.tsx` — server component with SEO metadata
  - [x] 4.2 Create `OnboardingWizard` client component as main container

- [x] Task 5: Step 1 — Situation selection (AC: #2)
  - [x] 5.1 Create `OnboardingStep1.tsx` with 4 card-style options
  - [x] 5.2 Implement tourist redirect: selecting 旅行 navigates to `/[locale]/guides/first-24h` (or placeholder page)
  - [x] 5.3 Style cards mobile-first with icon + label, selected state

- [x] Task 6: Step 2 — Urgency topics (AC: #3)
  - [x] 6.1 Create `OnboardingStep2.tsx` with 8 multi-select chips
  - [x] 6.2 Enforce max 3 selection limit with visual feedback
  - [x] 6.3 Use existing design token chip/badge styles

- [x] Task 7: Step 3 — Area selection (AC: #4)
  - [x] 7.1 Create `OnboardingStep3.tsx` with area list + fallback option
  - [x] 7.2 5 areas: Hải Châu (海州), Sơn Trà (山茶), Ngũ Hành Sơn (五行山), Thanh Khê (清渓), Liên Chiểu (連沼)
  - [x] 7.3 Submit questionnaire on area selection

- [x] Task 8: Checklist results page (AC: #5)
  - [x] 8.1 Create `OnboardingChecklist.tsx` — renders day-by-day tasks
  - [x] 8.2 Each task: checkbox + icon + description + link + expandable senpai tip (use Accordion)
  - [x] 8.3 Mark recommended next action with ★
  - [x] 8.4 localStorage persistence for guests: key `danangnavi.onboarding.checklist`
  - [x] 8.5 API persistence for authenticated users (sync localStorage → API on login)

- [x] Task 9: Save progress prompt (AC: #6)
  - [x] 9.1 Create save progress StickyActionBar on mobile
  - [x] 9.2 "LINEで登録" opens existing SignupModal
  - [x] 9.3 "あとで" dismisses bar, sets `danangnavi.onboarding.saveDismissed` in localStorage

- [x] Task 10: i18n translations
  - [x] 10.1 Add `onboarding` namespace to `ja.json`, `en.json`, `vi.json`
  - [x] 10.2 All user-facing strings must be in translation files (no hardcoded Japanese)

- [x] Task 11: Progress indicator component
  - [x] 11.1 Create `StepIndicator.tsx` — 3 dots showing current step (filled/empty)
  - [x] 11.2 Reusable for future wizard flows

- [x] Task 12: Frontend tests
  - [x] 12.1 Render test for each step component
  - [x] 12.2 Test max 3 chip selection enforcement
  - [x] 12.3 Test tourist redirect behavior
  - [x] 12.4 Test localStorage persistence

### Integration

- [x] Task 13: Homepage welcome banner link (AC: #1)
  - [x] 13.1 Add "はじめる" CTA to existing WelcomeBanner component linking to `/[locale]/onboarding`

## Dev Notes

### Architecture Compliance

- **Backend module structure**: Follow exact pattern in `backend/modules/` — router.py, service.py, repository.py, models.py, schemas.py, constants.py, exceptions.py
- **No direct module imports**: If onboarding needs user data, use FastAPI `Depends()` injection, not `from modules.auth import ...`
- **API response format**: Wrap all responses in standard `{ "data": ... }` / `{ "data": [...], "meta": {...} }` format
- **Pydantic schemas**: Name as `OnboardingChecklistRequest`, `OnboardingChecklistResponse` etc.
- **UUID primary keys**: Use UUID v4 for onboarding_checklist table ID
- **Soft delete**: Apply `deleted_at` column to onboarding_checklist table
- **Timestamps**: Store UTC, format per locale in frontend only

### Frontend Patterns

- **Client components**: All interactive onboarding components must have `"use client"` directive
- **Translations**: Use `useTranslations("onboarding")` — never hardcode Japanese strings
- **API client**: Use existing `apiClient()` from `@/shared/lib/apiClient` — handles CSRF, snake↔camel transform automatically
- **Auth state**: Use `useAuthStore()` to check if user is logged in for checklist persistence routing
- **Loading states**: Use Skeleton components, never spinners
- **Error handling**: Try/catch with `showToast()` for user feedback, never raw error messages
- **Path aliases**: Always use `@/` imports, never relative paths

### localStorage Strategy

- **Guest checklist data**: `danangnavi.onboarding.checklist` — JSON with questionnaire answers + task completion state
- **Save bar dismissed**: `danangnavi.onboarding.saveDismissed` — boolean string
- **On login/signup**: Sync localStorage checklist to API, then clear localStorage copy
- **Pattern reference**: See `WelcomeBanner.tsx` (`danangnavi.homepage.welcomeDismissed`) and `JourneyInputs.tsx` (`geolocation_consent`)

### Checklist Generation Logic

The checklist is deterministic — no AI/ML needed. Map urgency topics to predefined task lists:
- Each urgency topic (住まい, SIM, etc.) has a set of 2-3 tasks with day assignments
- Selected topics get prioritized to Day 1-2, others fill Day 3-7
- Area selection customizes task links (e.g., SIM shop near Hải Châu vs Sơn Trà)
- Senpai tips are static content stored in constants, not user-generated

### Existing Components to Reuse

| Component | Location | Usage |
|-----------|----------|-------|
| SignupModal | `modules/user/components/SignupModal.tsx` | "LINEで登録" CTA triggers this |
| StickyActionBar | `shared/components/StickyActionBar.tsx` | Save progress bar, Next/Back nav |
| Accordion | `shared/components/Accordion.tsx` | Expandable senpai tips |
| Toast | `shared/components/Toast.tsx` | Error/success feedback |
| Skeleton | `shared/components/Skeleton.tsx` | Loading states |
| WelcomeBanner | `modules/home/components/WelcomeBanner.tsx` | Add "はじめる" link here |

### Project Structure Notes

- Frontend route: `apps/web/app/(user)/[locale]/onboarding/page.tsx`
- Frontend components: `apps/web/modules/user/components/Onboarding*.tsx`
- Backend module: `backend/modules/onboarding/`
- Backend tests: `backend/tests/onboarding/`
- Migration: `backend/migrations/versions/{date}_create_onboarding_checklist_table.py`

### Anti-Patterns to Avoid

- Do NOT create a separate frontend module `modules/onboarding/` — onboarding components belong in `modules/user/components/`
- Do NOT use `os.getenv()` in backend — use `shared.config.settings`
- Do NOT hardcode any Japanese text in components — all strings via `useTranslations()`
- Do NOT use spinners for loading — use Skeleton
- Do NOT expose auto-increment IDs — use UUID v4
- Do NOT import other backend modules directly — use Depends() or event bus
- Do NOT use `any` type in TypeScript — use proper interfaces

### References

- [Source: epics/epic-3-user-onboarding-senpai-profile-system.md#Story 3.1]
- [Source: architecture/implementation-patterns-consistency-rules.md#Structure Patterns]
- [Source: architecture/project-structure-boundaries.md#Complete Project Directory Structure]
- [Source: architecture/implementation-patterns-consistency-rules.md#Naming Patterns]
- [Source: prd/web-application-architecture.md#Authentication]

## Dev Agent Record

### Agent Model Used

- openai/gpt-5.4

### Debug Log References

- `cd backend && pytest tests/onboarding`
- `cd backend && pytest`
- `cd backend && ruff check main.py modules/onboarding tests/onboarding migrations/versions/2026_04_23_0001_create_onboarding_checklists_table.py`
- `cd apps/web && npm test -- --run modules/user/components/__tests__/OnboardingStep1.test.tsx modules/user/components/__tests__/OnboardingStep2.test.tsx modules/user/components/__tests__/OnboardingStep3.test.tsx modules/user/components/__tests__/OnboardingWizard.test.tsx`
- `cd apps/web && npm test`
- `cd apps/web && npx eslint "app/(user)/[locale]/onboarding/page.tsx" "app/(user)/[locale]/guides/first-24h/page.tsx" "app/(user)/[locale]/auth/callback/page.tsx" "app/(business)/vi/auth/callback/page.tsx" "modules/user/lib/onboarding.ts" "modules/user/components/OnboardingStep1.tsx" "modules/user/components/OnboardingStep2.tsx" "modules/user/components/OnboardingStep3.tsx" "modules/user/components/OnboardingChecklist.tsx" "modules/user/components/OnboardingWizard.tsx" "modules/user/components/StepIndicator.tsx" "modules/user/components/__tests__/OnboardingStep1.test.tsx" "modules/user/components/__tests__/OnboardingStep2.test.tsx" "modules/user/components/__tests__/OnboardingStep3.test.tsx" "modules/user/components/__tests__/OnboardingWizard.test.tsx"`
- `cd apps/web && npm run build`

### Completion Notes List

- Implemented a deterministic onboarding backend module with checklist generation, authenticated persistence, and trilingual error handling.
- Added a full 3-step onboarding wizard, generated checklist UI, guest localStorage persistence, authenticated sync, and a tourist first-24h placeholder route.
- Added onboarding translations and dedicated frontend/backend tests, then validated with full backend pytest, full web vitest, targeted lint on changed files, and a successful Next.js production build.

### File List

- `_bmad-output/implementation-artifacts/3-1-newcomer-onboarding-flow.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `backend/main.py`
- `backend/migrations/versions/2026_04_23_0001_create_onboarding_checklists_table.py`
- `backend/modules/onboarding/__init__.py`
- `backend/modules/onboarding/constants.py`
- `backend/modules/onboarding/dependencies.py`
- `backend/modules/onboarding/exceptions.py`
- `backend/modules/onboarding/models.py`
- `backend/modules/onboarding/repository.py`
- `backend/modules/onboarding/router.py`
- `backend/modules/onboarding/schemas.py`
- `backend/modules/onboarding/service.py`
- `backend/tests/onboarding/test_router.py`
- `backend/tests/onboarding/test_service.py`
- `apps/web/app/(business)/vi/auth/callback/page.tsx`
- `apps/web/app/(user)/[locale]/auth/callback/page.tsx`
- `apps/web/app/(user)/[locale]/guides/first-24h/page.tsx`
- `apps/web/app/(user)/[locale]/onboarding/page.tsx`
- `apps/web/messages/en.json`
- `apps/web/messages/ja.json`
- `apps/web/messages/vi.json`
- `apps/web/modules/user/components/OnboardingChecklist.tsx`
- `apps/web/modules/user/components/OnboardingStep1.tsx`
- `apps/web/modules/user/components/OnboardingStep2.tsx`
- `apps/web/modules/user/components/OnboardingStep3.tsx`
- `apps/web/modules/user/components/OnboardingWizard.tsx`
- `apps/web/modules/user/components/StepIndicator.tsx`
- `apps/web/modules/user/components/__tests__/OnboardingStep1.test.tsx`
- `apps/web/modules/user/components/__tests__/OnboardingStep2.test.tsx`
- `apps/web/modules/user/components/__tests__/OnboardingStep3.test.tsx`
- `apps/web/modules/user/components/__tests__/OnboardingWizard.test.tsx`
- `apps/web/modules/user/components/__tests__/onboardingTestMessages.ts`
- `apps/web/modules/user/lib/onboarding.ts`

## Change Log

- 2026-04-23: Implemented Story 3.1 onboarding flow end-to-end, added backend/frontend tests, and fixed existing auth callback Suspense requirements so `next build` passes.
