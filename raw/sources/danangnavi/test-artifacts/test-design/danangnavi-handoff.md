---
title: 'TEA Test Design → BMAD Handoff Document'
version: '1.0'
workflowType: 'testarch-test-design-handoff'
inputDocuments:
  - _bmad-output/test-artifacts/test-design/test-design-architecture.md
  - _bmad-output/test-artifacts/test-design/test-design-qa.md
sourceWorkflow: 'testarch-test-design'
generatedBy: 'TEA Master Test Architect'
generatedAt: '2026-04-17'
projectName: 'DaNangNavi'
---

# TEA → BMAD Integration Handoff

## Purpose

This document bridges TEA's test design outputs with BMAD's epic/story decomposition workflow (`create-epics-and-stories`). It provides structured integration guidance so that quality requirements, risk assessments, and test strategies flow into implementation planning.

## TEA Artifacts Inventory

| Artifact | Path | BMAD Integration Point |
|----------|------|----------------------|
| Architecture Test Design | `_bmad-output/test-artifacts/test-design/test-design-architecture.md` | Epic quality requirements, story acceptance criteria |
| QA Test Design | `_bmad-output/test-artifacts/test-design/test-design-qa.md` | Story test requirements, execution strategy |
| Risk Assessment | (embedded in both docs) | Epic risk classification, story priority |
| Coverage Strategy | (embedded in QA doc) | Story test requirements |

## Epic-Level Integration Guidance

### Risk References

The following risks should appear as epic-level quality gates:

| Epic | Risks | Quality Gate |
|------|-------|-------------|
| Epic 1 (Auth & Foundation) | R-001 (SEC, 6), R-003 (SEC, 6), R-006 (SEC, 6), R-010 (DATA, 6), R-011 (OPS, 9) | All auth tests pass, RBAC matrix complete, E2E framework operational |
| Epic 2 (Discovery & Search) | R-002 (BUS, 9) | Cross-language search tests pass with bilingual corpus |
| Epic 4 (Reviews) | R-004 (DATA, 4) | EXIF validation tests pass |
| Epic 7 (Coupons) | R-008 (DATA, 4) | Atomic counter tests pass |
| Epic 8 (Business Portal) | R-005 (TECH, 4), R-006 (SEC, 6) | Translation fallback works, BO isolation verified |

### Quality Gates

| Epic | Gate Criteria |
|------|-------------|
| Epic 1 | P0-008 to P0-015 green (auth + RBAC), E2E framework setup complete |
| Epic 2 | P0-001 to P0-003 green (cross-language search), P0-004 green (user journey 1) |
| Epic 3 | P2-001 green (onboarding flow routing) |
| Epic 4 | P1-009 to P1-011 green (review + EXIF), P0-005 green (user journey 2) |
| Epic 8 | P0-006 green (user journey 3), P1-007/P1-008 green (listing CRUD + translation) |
| Epic 9 | P0-007 green (user journey 4), P2-009/P2-010 green (admin reports + moderation) |

## Story-Level Integration Guidance

### P0/P1 Test Scenarios → Story Acceptance Criteria

These critical test scenarios MUST be embedded as acceptance criteria in their respective stories:

| Test ID | Story | Acceptance Criterion |
|---------|-------|---------------------|
| P0-001 to P0-003 | 2-1 Listing Data Model & API | Cross-language search: JP query returns VN listings (katakana, hiragana, kanji) |
| P0-008, P0-009 | 1-4 User Auth | JWT token issued on login, expired token returns 401, refresh rotation works |
| P0-010, P0-011 | 1-4 User Auth | LINE OAuth callback creates user, Google OAuth callback creates user |
| P0-012 to P0-014 | 1-4 User Auth | Guest blocked from save/review/post, User blocked from BO/Admin endpoints |
| P0-015 | 1-5-2 BO Registration | BO-A cannot access BO-B's data |
| P1-002, P1-003 | 1-6 Privacy Controls | User deletion cascades all data, BO deletion cascades all data |
| P1-010, P1-011 | 4-1 Write Review | EXIF validation accepts camera photos, rejects gallery photos |
| P1-012 | 7-2 Coupon Redemption | Coupon claim atomically decrements Redis counter |

### Data-TestId Requirements

Stories involving UI should include these `data-testid` attributes for testability:

| Component | data-testid | Used By |
|-----------|------------|---------|
| Search input | `search-input` | P0-004 (user journey 1) |
| Search button | `search-button` | P0-004 |
| Listing card | `listing-card` | P0-004 |
| Listing detail | `listing-detail` | P0-004 |
| Dual price display | `dual-price` | P0-004, P1-015 |
| Login form | `login-email`, `login-password`, `login-submit` | P0-008 |
| Save/heart button | `save-button` | P0-005 |
| Review form | `review-text`, `review-rating`, `review-submit` | P0-005 |
| BO listing form | `listing-name`, `listing-category`, `listing-submit` | P0-006 |
| Admin moderation queue | `moderation-queue`, `moderation-action` | P0-007 |

## Risk-to-Story Mapping

| Risk ID | Category | P×I | Recommended Story/Epic | Test Level |
|---------|----------|-----|----------------------|-----------|
| R-001 | SEC | 2×3=6 | Story 1-4 (Auth) | API Integration |
| R-002 | BUS | 3×3=9 | Story 2-1 (Listing Data Model) | API Integration |
| R-003 | SEC | 2×3=6 | Story 1-4 (Auth) | API Integration |
| R-004 | DATA | 2×2=4 | Story 4-1 (Reviews) | API Integration |
| R-005 | TECH | 2×2=4 | Story 8-1 (Listing Editor) | API Integration |
| R-006 | SEC | 2×3=6 | Story 1-5-2 (BO Registration) | API Integration |
| R-007 | PERF | 2×2=4 | Cross-epic (NFR) | Perf (k6/Lighthouse) |
| R-008 | DATA | 2×2=4 | Story 7-2 (Coupon Redemption) | API Integration |
| R-009 | SEC | 1×3=3 | Story 2-3 (Search) | Monitor |
| R-010 | DATA | 2×3=6 | Story 1-6 (Privacy Controls) | API Integration |
| R-011 | OPS | 3×3=9 | Cross-epic (Infrastructure) | E2E |

## Recommended BMAD → TEA Workflow Sequence

1. **TEA Test Design** (`TD`) → produces this handoff document ✅ DONE
2. **BMAD Create Epics & Stories** → consumes this handoff, embeds quality requirements
3. **TEA Test Framework** (`TF`) → setup Playwright + test infrastructure
4. **TEA ATDD** (`AT`) → generates acceptance tests per story
5. **BMAD Implementation** → developers implement with test-first guidance
6. **TEA Automate** (`TA`) → generates full test suite
7. **TEA Trace** (`TR`) → validates coverage completeness

## Phase Transition Quality Gates

| From Phase | To Phase | Gate Criteria |
|-----------|---------|-------------|
| Test Design | Epic/Story Creation | All P0 risks have mitigation strategy ✅ |
| Epic/Story Creation | Test Framework | Stories have acceptance criteria from test design |
| Test Framework | ATDD | Playwright operational, Docker test profile running |
| ATDD | Implementation | Failing acceptance tests exist for all P0/P1 scenarios |
| Implementation | Test Automation | All acceptance tests pass |
| Test Automation | Release | Trace matrix shows ≥80% coverage of P0/P1 requirements |
