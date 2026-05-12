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

# Test Design for Architecture: DaNangNavi

**Purpose:** Architectural concerns, testability gaps, and NFR requirements for review by Architecture/Dev teams. Serves as a contract between QA and Engineering on what must be addressed before test development begins.

**Date:** 2026-04-17
**Author:** Murat (TEA Master Test Architect)
**Status:** Architecture Review Pending
**Project:** DaNangNavi
**PRD Reference:** `_bmad-output/planning-artifacts/prd/`
**ADR Reference:** `_bmad-output/planning-artifacts/architecture/`

---

## Executive Summary

**Scope:** System-level test design covering all 9 epics of DaNangNavi — a bilingual (Japanese/Vietnamese) local business and lifestyle guide for Da Nang, Vietnam.

**Business Context** (from PRD):

- **Revenue/Impact:** Platform connecting Japanese expats/tourists with Vietnamese businesses; coupon commissions + business ad revenue
- **Problem:** No dedicated JP-friendly local guide platform exists for Da Nang
- **GA Launch:** MVP targeting Month 1: 5,000 daily visits, 50 businesses

**Architecture:**

- **Fullstack monorepo:** Next.js 16 (React 19) + FastAPI + PostgreSQL + Redis + Meilisearch
- **Auth:** JWT HTTP-only cookies + Argon2id + LINE/Google/Zalo OAuth
- **Infra:** Docker Compose (6 services), DigitalOcean, GitHub Actions CI/CD

**Expected Scale:** 500–1,000 concurrent users at peak, 100K+ listings, 500K+ reviews at Month 6

**Risk Summary:**

- **Total risks**: 11
- **High-priority (≥6)**: 6 risks requiring immediate mitigation (2 blockers, 4 concerns)
- **Test effort**: ~50 scenarios (~2–3 weeks for 1 QA)

---

## Quick Guide

### 🚨 BLOCKERS — Team Must Decide (Can't Proceed Without)

1. **R-002: Cross-language search validation** — Meilisearch CJK tokenization must be verified with real bilingual data corpus before QA can write search tests (recommended owner: Backend)
2. **R-011: E2E test infrastructure** — Playwright must be setup in monorepo with Docker Compose test profile before any E2E tests can run (recommended owner: Dev/DevOps)

**What we need from team:** Complete these 2 items pre-implementation or test development is blocked.

---

### ⚠️ HIGH PRIORITY — Team Should Validate

1. **R-001: Auth security** — JWT refresh rotation + social login callbacks need test-friendly hooks (implementation phase, owner: Backend)
2. **R-003: RBAC enforcement** — Every API endpoint must have role middleware; provide endpoint inventory for test matrix (implementation phase, owner: Backend)
3. **R-006: Multi-tenant isolation** — BusinessOwner data queries must scope by owner_id; verify at repository layer (implementation phase, owner: Backend)
4. **R-010: Account deletion cascade** — FR74 data removal must cascade across all tables (reviews, favorites, posts, coupons, photos); document cascade paths (implementation phase, owner: Backend)

**What we need from team:** Review recommendations and approve (or suggest changes).

---

### 📋 INFO ONLY — Solutions Provided

1. **Test strategy**: 50 scenarios across Unit/Component/API Integration/E2E levels (risk-based pyramid)
2. **Tooling**: Vitest (unit/component), Playwright (E2E), pytest (backend integration)
3. **Execution**: PR (<10 min), Nightly (<30 min), Weekly (<60 min)
4. **Coverage**: P0–P3 prioritized with risk linkage
5. **Quality gates**: P0=100%, P1≥95%, all score≥6 risks mitigated before release

**What we need from team:** Just review and acknowledge.

---

## For Architects and Devs — Open Topics 👷

### Risk Assessment

**Total risks identified**: 11 (2 blockers score=9, 4 high score=6, 4 medium score=4, 1 low score=3)

#### High-Priority Risks (Score ≥6) — IMMEDIATE ATTENTION

| Risk ID | Category | Description | P | I | Score | Mitigation | Owner | Timeline |
|---------|----------|-------------|---|---|-------|-----------|-------|----------|
| **R-002** | **BUS** | Cross-language search returns wrong results — CJK tokenization failure | 3 | 3 | **9** | Integration tests with real Meilisearch + bilingual corpus | Backend | Pre-implementation |
| **R-011** | **OPS** | No E2E tests for 4 critical user journeys | 3 | 3 | **9** | Setup Playwright + implement E2E for all PRD journeys | Dev/DevOps | Pre-implementation |
| **R-001** | **SEC** | Authentication bypass — JWT errors, social login callback vulnerable | 2 | 3 | **6** | Comprehensive auth test suite | Backend | Implementation |
| **R-003** | **SEC** | RBAC bypass — endpoint missing role check, privilege escalation | 2 | 3 | **6** | Automated RBAC matrix: every endpoint × every role | Backend | Implementation |
| **R-006** | **SEC** | Data leakage between roles — BO sees other BO's analytics | 2 | 3 | **6** | Multi-tenant isolation tests per module | Backend | Implementation |
| **R-010** | **DATA** | Account deletion incomplete — FR74 misses linked records | 2 | 3 | **6** | Cascade deletion test across all user-linked tables | Backend | Implementation |

#### Medium-Priority Risks (Score 4)

| Risk ID | Category | Description | P | I | Score | Mitigation | Owner |
|---------|----------|-------------|---|---|-------|-----------|-------|
| R-004 | DATA | Photo EXIF validation bypass — gallery photos pass as camera | 2 | 2 | 4 | EXIF validator unit tests + upload integration tests | Backend |
| R-005 | TECH | Translation API failure cascades — blocks listing creation | 2 | 2 | 4 | Circuit breaker tests + queue fallback | Backend |
| R-007 | PERF | Performance regression — SSR > 2.5s LCP, API > 500ms p95 | 2 | 2 | 4 | Lighthouse CI + k6 load tests (post-MVP) | DevOps |
| R-008 | DATA | Coupon race condition — concurrent last-coupon claims | 2 | 2 | 4 | Redis atomic counter tests | Backend |

#### Low-Priority Risks (Score 1–3)

| Risk ID | Category | Description | P | I | Score | Action |
|---------|----------|-------------|---|---|-------|--------|
| R-009 | SEC | SQL injection via search — parameterized queries assumed | 1 | 3 | 3 | Monitor |

---

### Testability Concerns and Architectural Gaps

#### 🚨 ACTIONABLE CONCERNS — Architecture Team Must Address

##### 1. Blockers to Fast Feedback

| Concern | Impact | What Architecture Must Provide | Owner | Timeline |
|---------|--------|-------------------------------|-------|----------|
| **No E2E framework** | Cannot validate user journeys | Playwright setup in monorepo + Docker Compose test profile | Dev/DevOps | Pre-implementation |
| **No test data seeding APIs** | Cannot create controlled test states | `POST /api/test-data/seed` endpoint (dev/staging only) | Backend | Pre-implementation |
| **No external service mocks** | Cannot test Translation API, LINE/Google OAuth in isolation | Mock strategy per integration (httpx mock, OAuth test tokens) | Backend | Implementation |

##### 2. Architectural Improvements Needed

1. **Test environment tiers**
   - **Current problem**: No defined separation between unit (no deps), integration (test containers), E2E (full stack)
   - **Required change**: Docker Compose test profile with PostgreSQL/Redis/Meilisearch test containers
   - **Impact if not fixed**: Slow, flaky tests mixing real and mocked dependencies
   - **Owner**: DevOps
   - **Timeline**: Pre-implementation

2. **API endpoint inventory for RBAC testing**
   - **Current problem**: No centralized list of endpoints × required roles
   - **Required change**: Auto-generate endpoint inventory from FastAPI OpenAPI spec
   - **Impact if not fixed**: Cannot systematically test RBAC coverage
   - **Owner**: Backend
   - **Timeline**: Implementation

---

### Testability Assessment Summary

#### What Works Well

- API-first design (FastAPI + OpenAPI) — all business logic accessible via REST
- Stateless JWT architecture — parallel test safe, no shared session state
- Repository Pattern — clean mock boundaries at service layer
- Modular monolith — feature modules testable in isolation
- Pydantic V2 validation — type-safe request/response contracts
- Docker Compose — reproducible environments

#### Accepted Trade-offs (No Action Required)

- **Polling instead of WebSocket** — simpler to test (HTTP requests vs persistent connections), acceptable for MVP
- **No CDN testing** — DigitalOcean Spaces CDN validated manually, not blocking for functional tests

---

### Risk Mitigation Plans (High-Priority Risks ≥6)

#### R-002: Cross-Language Search (Score: 9) — BLOCKER

**Mitigation Strategy:**

1. Create bilingual test data corpus (50+ entries with JP/VN content pairs)
2. Configure Meilisearch with CJK tokenizer and test indexing
3. Verify: katakana, hiragana, kanji, mixed queries all return correct VN listings

**Owner:** Backend
**Timeline:** Pre-implementation
**Status:** Planned
**Verification:** Integration test suite with 15+ search query variations passes

#### R-011: No E2E Tests (Score: 9) — BLOCKER

**Mitigation Strategy:**

1. Install Playwright in monorepo with Turborepo integration
2. Create Docker Compose test profile for full-stack E2E
3. Implement E2E tests for all 4 PRD user journeys

**Owner:** Dev/DevOps
**Timeline:** Pre-implementation (framework) + Sprint 1 (E2E tests)
**Status:** Planned
**Verification:** 4 E2E user journey tests green in CI

#### R-001: Authentication Bypass (Score: 6) — CONCERN

**Mitigation Strategy:**

1. Test JWT token lifecycle: issue, expire, refresh, revoke
2. Test social login callbacks: valid, expired, tampered tokens
3. Test CSRF double-submit cookie validation

**Owner:** Backend
**Timeline:** Implementation (Epic 1 completion)
**Status:** Planned
**Verification:** Auth test suite covers all token states and OAuth providers

#### R-003: RBAC Bypass (Score: 6) — CONCERN

**Mitigation Strategy:**

1. Generate endpoint inventory from OpenAPI spec
2. Create test matrix: every endpoint × Guest/User/BO/Admin roles
3. Automate as parametrized API tests

**Owner:** Backend
**Timeline:** Implementation
**Status:** Planned
**Verification:** Parametrized RBAC test covers 100% of endpoints

#### R-006: Data Leakage Between Roles (Score: 6) — CONCERN

**Mitigation Strategy:**

1. Verify all repository queries scope by owner_id/user_id
2. Test: BO-A cannot read BO-B's analytics/listings/coupons
3. Test: User cannot access Admin-only data

**Owner:** Backend
**Timeline:** Implementation (per module)
**Status:** Planned
**Verification:** Multi-tenant isolation tests per module pass

#### R-010: Account Deletion Incomplete (Score: 6) — CONCERN

**Mitigation Strategy:**

1. Document all tables with user foreign keys
2. Implement CASCADE or explicit deletion logic
3. Test: after deletion, no orphaned records remain

**Owner:** Backend
**Timeline:** Implementation (Story 1-6)
**Status:** Planned
**Verification:** Deletion test verifies 0 rows across all user-linked tables

---

### Assumptions and Dependencies

#### Assumptions

1. Meilisearch CJK tokenization works out-of-the-box for Japanese (katakana/hiragana/kanji)
2. LINE OAuth test credentials available for CI environment
3. Google OAuth test credentials available for CI environment
4. DigitalOcean Spaces S3-compatible API works with standard AWS SDK mocks

#### Dependencies

1. Docker Compose test profile with PostgreSQL/Redis/Meilisearch — Required before integration tests
2. Playwright monorepo setup — Required before E2E tests
3. Test data seeding API — Required before controlled state tests

#### Risks to Plan

- **Risk**: Meilisearch CJK tokenization may need custom configuration for Japanese
  - **Impact**: R-002 mitigation delayed, search tests blocked
  - **Contingency**: Use PostgreSQL full-text search as fallback for testing, validate Meilisearch separately

---

**End of Architecture Document**

**Next Steps for Architecture Team:**

1. Review Quick Guide (🚨/⚠️/📋) and prioritize blockers
2. Assign owners and timelines for high-priority risks (≥6)
3. Validate assumptions and dependencies
4. Provide feedback to QA on testability gaps

**Next Steps for QA Team:**

1. Wait for pre-implementation blockers to be resolved
2. Refer to companion QA doc (test-design-qa.md) for test scenarios
3. Begin test infrastructure setup (factories, fixtures, environments)
