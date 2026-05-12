---
workflowStatus: 'completed'
totalSteps: 5
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
nextStep: ''
lastSaved: '2026-04-17'
workflowType: 'testarch-test-design'
inputDocuments:
  - _bmad-output/planning-artifacts/prd/functional-requirements.md
  - _bmad-output/planning-artifacts/prd/non-functional-requirements.md
  - _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md
  - _bmad-output/planning-artifacts/epics/epic-list.md
---

# Test Design for QA: DaNangNavi

**Purpose:** Test execution recipe for QA team. Defines what to test, how to test it, and what QA needs from other teams.

**Date:** 2026-04-17
**Author:** Murat (TEA Master Test Architect)
**Status:** Draft
**Project:** DaNangNavi

**Related:** See Architecture doc (test-design-architecture.md) for testability concerns and architectural blockers.

---

## Executive Summary

**Scope:** System-level test plan covering all 9 epics — bilingual business guide platform (Next.js 16 + FastAPI + PostgreSQL + Redis + Meilisearch)

**Risk Summary:**

- Total Risks: 11 (2 blockers score=9, 4 high score=6, 4 medium score=4, 1 low score=3)
- Critical Categories: SEC (4 risks), DATA (3 risks), BUS (1 blocker)

**Coverage Summary:**

- P0 tests: ~15 (critical paths, security, search)
- P1 tests: ~15 (important features, integration)
- P2 tests: ~14 (secondary flows, edge cases)
- P3 tests: ~6 (performance, accessibility)
- **Total**: ~50 tests (~2–3 weeks with 1 QA)

---

## Not in Scope

| Item | Reasoning | Mitigation |
|------|-----------|-----------|
| **Payment gateway** | Post-MVP (Phase 2) | Manual testing when implemented |
| **Native mobile app** | Phase 3 | Responsive web testing covers mobile UX |
| **WebSocket real-time** | Phase 2 (polling for MVP) | Polling endpoint tested via API |
| **CDN performance** | Infrastructure, not functional | Manual validation + monitoring |

---

## Dependencies & Test Blockers

### Backend/Architecture Dependencies (Pre-Implementation)

**Source:** See Architecture doc "Quick Guide" for detailed mitigation plans

1. **Playwright framework setup** — Dev/DevOps — Pre-implementation
   - QA needs Playwright installed in monorepo with Docker Compose test profile
   - Blocks all E2E test development

2. **Test data seeding API** — Backend — Pre-implementation
   - QA needs `POST /api/test-data/seed` for controlled test states
   - Blocks parallel test execution and edge case testing

3. **Meilisearch bilingual corpus** — Backend — Pre-implementation
   - QA needs CJK-tokenized index with 50+ JP/VN test entries
   - Blocks cross-language search testing (R-002)

### QA Infrastructure Setup (Pre-Implementation)

1. **Test Data Factories** — QA
   - User factory (Guest/User/BusinessOwner/Admin roles) with faker
   - Listing factory with bilingual content (VN + JP)
   - Review factory with star ratings and EXIF-valid photos
   - Coupon factory with expiry dates and claim limits
   - Auto-cleanup fixtures for parallel safety

2. **Test Environments** — QA
   - Local: Docker Compose test profile (PostgreSQL + Redis + Meilisearch)
   - CI/CD: GitHub Actions with service containers
   - Staging: Full stack on DigitalOcean (shared)

**Example factory pattern:**

```typescript
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('@P0 @API @Auth JWT token refresh rotates correctly', async ({ request }) => {
  // Seed user via API
  const user = {
    email: faker.internet.email(),
    password: 'TestPass123!',
    role: 'user',
  };

  const signupRes = await request.post('/api/v1/auth/register', { data: user });
  expect(signupRes.status()).toBe(201);

  // Login to get tokens
  const loginRes = await request.post('/api/v1/auth/login', {
    data: { email: user.email, password: user.password },
  });
  expect(loginRes.status()).toBe(200);

  // Use refresh token
  const refreshRes = await request.post('/api/v1/auth/refresh');
  expect(refreshRes.status()).toBe(200);

  // Verify old refresh token is invalidated (rotation)
  const replayRes = await request.post('/api/v1/auth/refresh');
  expect(replayRes.status()).toBe(401);
});
```

---

## Risk Assessment

**Note:** Full risk details in Architecture doc. This section summarizes risks relevant to QA test planning.

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Score | QA Test Coverage |
|---------|----------|-------------|-------|-----------------|
| **R-002** | BUS | Cross-language search CJK tokenization failure | **9** | P0-001 to P0-003: bilingual search integration tests |
| **R-011** | OPS | No E2E tests for critical user journeys | **9** | P0-004 to P0-007: 4 Playwright E2E user journeys |
| **R-001** | SEC | JWT/OAuth authentication bypass | **6** | P0-008 to P0-011: auth lifecycle + social login tests |
| **R-003** | SEC | RBAC endpoint bypass | **6** | P0-012 to P0-015: role × endpoint matrix |
| **R-006** | SEC | Data leakage between roles | **6** | P0-015: multi-tenant isolation tests |
| **R-010** | DATA | Account deletion incomplete | **6** | P1-002, P1-003: cascade deletion verification |

### Medium/Low-Priority Risks

| Risk ID | Category | Description | Score | QA Test Coverage |
|---------|----------|-------------|-------|-----------------|
| R-004 | DATA | Photo EXIF validation bypass | 4 | P1-010, P1-011: EXIF validator tests |
| R-005 | TECH | Translation API failure cascades | 4 | P1-008: circuit breaker verification |
| R-007 | PERF | Performance regression | 4 | P3-001, P3-002: Lighthouse CI + k6 |
| R-008 | DATA | Coupon race condition | 4 | P1-012 + P3-005: atomic counter tests |
| R-009 | SEC | SQL injection via search | 3 | Covered by parameterized queries (monitor) |

---

## Entry Criteria

- [ ] All requirements and assumptions agreed upon by QA, Dev, PM
- [ ] Docker Compose test profile provisioned (PostgreSQL, Redis, Meilisearch)
- [ ] Test data factories ready (user, listing, review, coupon)
- [ ] Pre-implementation blockers resolved (Playwright setup, seeding API, Meilisearch corpus)
- [ ] Feature deployed to test environment
- [ ] Social login test credentials available (LINE, Google, Zalo)

## Exit Criteria

- [ ] All P0 tests passing (100%)
- [ ] All P1 tests passing (≥95%)
- [ ] No open high-priority / high-severity bugs
- [ ] All score≥6 risk mitigations verified
- [ ] RBAC coverage: every endpoint × every role tested

---

## Test Coverage Plan

**IMPORTANT:** P0/P1/P2/P3 = **priority and risk level** (what to focus on if time-constrained), NOT execution timing. See "Execution Strategy" for when tests run.

### P0 (Critical)

**Criteria:** Blocks core functionality + High risk (≥6) + No workaround + Affects majority of users

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---------|------------|-----------|-----------|-------|
| **P0-001** | FR65: JP query matches VN listing content | API Integration | R-002 | Meilisearch CJK tokenization |
| **P0-002** | FR65: VN query matches JP-tagged listing | API Integration | R-002 | Reverse direction |
| **P0-003** | FR65: Katakana, hiragana, kanji queries all work | API Integration | R-002 | All JP script types |
| **P0-004** | User Journey 1: Newcomer browses → searches → views listing | E2E | R-011 | Full homepage to detail flow |
| **P0-005** | User Journey 2: Tourist registers → saves → writes review | E2E | R-011 | Registration through content creation |
| **P0-006** | User Journey 3: BO creates listing with auto-translation | E2E | R-011 | Vietnamese input → Japanese output |
| **P0-007** | User Journey 4: Admin moderates flagged content | E2E | R-011 | Moderation queue workflow |
| **P0-008** | FR49: JWT login → token → protected endpoint | API Integration | R-001 | Happy path auth |
| **P0-009** | FR49: Expired token → 401 → refresh rotation | API Integration | R-001 | Token lifecycle |
| **P0-010** | FR8: LINE OAuth callback → user created | API Integration | R-001 | Primary social login |
| **P0-011** | FR8: Google OAuth callback → user created | API Integration | R-001 | Secondary social login |
| **P0-012** | FR52/53: Guest blocked from User-only actions | API Integration | R-003 | Save, review, post |
| **P0-013** | FR50: User cannot access BO endpoints | API Integration | R-003 | Listing CRUD, analytics |
| **P0-014** | FR50: User cannot access Admin endpoints | API Integration | R-003 | Moderation, user management |
| **P0-015** | FR50: BO-A cannot read BO-B's data | API Integration | R-006 | Analytics, listings, coupons |

**Total P0:** 15 tests

---

### P1 (High)

**Criteria:** Important features + Medium/high risk + Common workflows

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---------|------------|-----------|-----------|-------|
| **P1-001** | FR51: Admin sub-roles (content/technical/business) | API Integration | R-003 | RBAC sub-role enforcement |
| **P1-002** | FR74: User deletion cascades all data | API Integration | R-010 | Reviews, favorites, posts, profile |
| **P1-003** | FR74: BO deletion cascades all data | API Integration | R-010 | Listings, coupons, analytics |
| **P1-004** | CSRF double-submit cookie validated | API Integration | R-001 | Security requirement |
| **P1-005** | Rate limiting: 100/300/500 per role | API Integration | R-001 | Redis-backed per-role limits |
| **P1-006** | FR8: Zalo OAuth → BO registered | API Integration | R-001 | BO-specific social login |
| **P1-007** | FR31: Listing CRUD (create/read/update/delete) | API Integration | — | Core business logic |
| **P1-008** | FR31: Listing auto-translation VN→JP | API Integration | R-005 | Translation pipeline |
| **P1-009** | FR15: Review with star rating creation | API Integration | — | Content creation |
| **P1-010** | FR17: EXIF validation pass (camera photo) | API Integration | R-004 | Camera-only enforcement |
| **P1-011** | FR17: EXIF validation reject (gallery photo) | API Integration | R-004 | Gallery blocked |
| **P1-012** | FR62: Coupon claim atomic decrement | API Integration | R-008 | Redis counter |
| **P1-013** | FR2/3: Search filters (price, distance, rating, tags) | API Integration | — | Search refinement |
| **P1-014** | FR59: SSR pages with meta tags + JSON-LD | Component | — | SEO compliance |
| **P1-015** | FR63: Dual-currency price display (VND + JPY) | Unit | — | UI calculation |

**Total P1:** 15 tests

---

### P2 (Medium)

**Criteria:** Secondary features + Low risk + Edge cases

| Test ID | Requirement | Test Level | Risk Link | Notes |
|---------|------------|-----------|-----------|-------|
| **P2-001** | FR9: Onboarding routing (newcomer vs tourist) | E2E | — | Flow branching |
| **P2-002** | FR20-22: Community post + comment + helpful vote | API Integration | — | Community CRUD |
| **P2-003** | FR23-24: Event create + register + attendees | API Integration | — | Events CRUD |
| **P2-004** | FR67: In-app notification delivery | API Integration | — | Review, event, coupon |
| **P2-005** | FR68: Notification preferences toggle | API Integration | — | Enable/disable by category |
| **P2-006** | FR12: Gamification points awarded | Unit | — | Points calculation |
| **P2-007** | FR13: Senpai badge progression | Unit | — | Threshold logic |
| **P2-008** | FR36: Business analytics aggregation | API Integration | — | Views, saves, reviews |
| **P2-009** | FR47/69: Admin reports + CSV export | API Integration | — | Report generation |
| **P2-010** | FR42: Content moderation auto-filter | API Integration | — | Spam, banned keywords |
| **P2-011** | FR44: Fake review dispute flow | API Integration | — | BO complaint → Admin action |
| **P2-012** | FR29: Translation disclaimer displayed | Component | — | Auto-translated indicator |
| **P2-013** | FR71: Empty states with suggested actions | Component | — | UX completeness |
| **P2-014** | FR5: Area/neighborhood guides | E2E | — | Content rendering |

**Total P2:** 14 tests

---

### P3 (Low)

**Criteria:** Nice-to-have + Performance + Accessibility

| Test ID | Requirement | Test Level | Notes |
|---------|------------|-----------|-------|
| **P3-001** | NFR: LCP < 2.5s on homepage | Perf (Lighthouse) | Lighthouse CI in nightly |
| **P3-002** | NFR: API p95 < 500ms under 500 users | Perf (k6) | k6 load test nightly |
| **P3-003** | FR26-27: Phrase pack voice playback | E2E | Vietnamese TTS |
| **P3-004** | FR29: Menu OCR camera capture | E2E | Camera mock required |
| **P3-005** | FR62: Concurrent coupon claim (10 users, 1 left) | API Integration | Race condition stress test |
| **P3-006** | NFR: WCAG 2.1 AA key pages | E2E (axe) | Accessibility audit |

**Total P3:** 6 tests

---

## Execution Strategy

**Philosophy:** Run everything in PRs unless significant infrastructure overhead. Playwright with parallelization handles 100s of tests in ~10–15 min.

**Organized by TOOL TYPE:**

### Every PR: Vitest + Playwright Tests (~10 min)

**All functional tests** (from any priority level):

- All Unit/Component tests (Vitest): P1-014, P1-015, P2-006, P2-007, P2-012, P2-013
- All API Integration tests (Playwright/pytest): P0-001 to P0-015, P1-001 to P1-013
- All E2E tests (Playwright): P0-004 to P0-007, P2-001, P2-014
- Parallelized across 4 shards
- Total: ~44 tests

**Why run in PRs:** Fast feedback, no expensive infrastructure

### Nightly: k6 Performance Tests (~30 min)

- P3-001: Lighthouse CI (homepage, listing detail, search)
- P3-002: k6 load test (500 concurrent users, 5 min sustained)
- P3-005: Concurrent coupon claim stress test

**Why defer to nightly:** Expensive compute, long-running

### Weekly: Accessibility + Exploratory (~60 min)

- P3-003: Voice playback E2E (requires TTS service)
- P3-004: Menu OCR E2E (requires camera mock)
- P3-006: WCAG 2.1 AA audit (axe-playwright on key pages)

**Why defer to weekly:** Specialized setup, infrequent validation sufficient

---

## QA Effort Estimate

| Priority | Count | Effort Range | Notes |
|----------|-------|-------------|-------|
| P0 | ~15 | ~30–45 hours | Complex setup (search, E2E, security) |
| P1 | ~15 | ~20–35 hours | Standard API integration coverage |
| P2 | ~14 | ~15–25 hours | Edge cases, secondary flows |
| P3 | ~6 | ~5–10 hours | Performance benchmarks, accessibility |
| **Total** | **~50** | **~70–115 hours** | **~2–3 weeks, 1 QA full-time** |

**Assumptions:**

- Includes test design, implementation, debugging, CI integration
- Excludes ongoing maintenance (~10% effort)
- Assumes test infrastructure (factories, fixtures, Docker test profile) ready

---

## Implementation Planning Handoff

| Work Item | Owner | Target | Dependencies/Notes |
|-----------|-------|--------|-------------------|
| Playwright monorepo setup | Dev/DevOps | Pre-Sprint 1 | Turborepo integration + Docker test profile |
| Test data seeding API | Backend | Pre-Sprint 1 | Dev/staging only endpoint |
| Meilisearch bilingual corpus | Backend | Pre-Sprint 1 | 50+ JP/VN test entries |
| P0 test implementation | QA | Sprint 1 | Depends on above 3 items |
| P1 test implementation | QA | Sprint 2 | Depends on P0 completion |
| P2/P3 test implementation | QA | Sprint 3+ | As capacity allows |

---

## Interworking & Regression

| Service/Component | Impact | Regression Scope | Validation |
|-------------------|--------|-----------------|-----------|
| **Auth module** | All modules depend on JWT/RBAC | Auth test suite must pass | P0-008 to P0-015 green |
| **Meilisearch** | Search, listing indexing | Search tests must pass | P0-001 to P0-003 green |
| **Redis** | Cache, rate limiting, coupon counters, Celery | Rate limit + coupon tests | P1-005, P1-012 green |
| **Translation API** | Listing creation, content display | Translation pipeline tests | P1-008 green |
| **PostgreSQL** | All data persistence | Migration tests + data integrity | No migration errors |

**Regression test strategy:**

- All P0 + P1 tests must pass before any release
- Cross-module regression: auth changes require full P0 re-run
- Database migrations require P0 data integrity tests

---

## Appendix A: Code Examples & Tagging

**Playwright Tags for Selective Execution:**

```typescript
import { test, expect } from '@playwright/test';

// P0 critical test
test('@P0 @API @Security unauthenticated request returns 401', async ({ request }) => {
  const response = await request.get('/api/v1/users/me');
  expect(response.status()).toBe(401);
});

// P0 E2E user journey
test('@P0 @E2E @Journey newcomer browses and finds listing', async ({ page }) => {
  const searchPromise = page.waitForResponse('**/api/v1/search**');

  await page.goto('/');
  await page.fill('[data-testid="search-input"]', 'ラーメン');
  await page.click('[data-testid="search-button"]');
  await searchPromise;

  await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible();
  await page.locator('[data-testid="listing-card"]').first().click();

  await expect(page.locator('[data-testid="listing-detail"]')).toBeVisible();
  await expect(page.locator('[data-testid="dual-price"]')).toBeVisible();
});

// P1 integration test
test('@P1 @API @Integration listing CRUD works correctly', async ({ request }) => {
  // Create
  const createRes = await request.post('/api/v1/listings', {
    data: {
      name_vi: 'Quán Phở Bà Tám',
      category: 'restaurant',
      area: 'hai-chau',
    },
  });
  expect(createRes.status()).toBe(201);
  const listing = await createRes.json();

  // Read
  const getRes = await request.get(`/api/v1/listings/${listing.id}`);
  expect(getRes.status()).toBe(200);

  // Verify auto-translation
  const detail = await getRes.json();
  expect(detail.name_ja).toBeTruthy();

  // Delete
  const delRes = await request.delete(`/api/v1/listings/${listing.id}`);
  expect(delRes.status()).toBe(204);
});
```

**Run specific tags:**

```bash
# Run only P0 tests
npx playwright test --grep @P0

# Run P0 + P1 tests
npx playwright test --grep "@P0|@P1"

# Run only security tests
npx playwright test --grep @Security

# Run only E2E journey tests
npx playwright test --grep @Journey
```

---

## Appendix B: Knowledge Base References

- **Risk Governance**: `risk-governance.md` — Risk scoring methodology (P×I matrix, gate decisions)
- **Probability-Impact**: `probability-impact.md` — Scoring scale definitions
- **Test Levels Framework**: `test-levels-framework.md` — E2E vs API vs Unit selection rules
- **Test Quality**: `test-quality.md` — Definition of Done (no hard waits, <300 lines, <1.5 min, parallel-safe)

---

**Generated by:** BMad TEA Agent
**Workflow:** `bmad-testarch-test-design`
**Version:** 4.0 (BMad v6)
