# Sprint Change Proposal — Add Zalo Social Login

**Date:** 2026-04-14
**Project:** DaNangNavi
**Requested by:** Lem
**Scope Classification:** Minor — Direct implementation by dev team

---

## 1. Issue Summary

### Problem Statement

The current authentication system supports LINE and Google social login for Users (Story 1.4, completed) and email/password registration for Business Owners (Story 1.5, ready-for-dev). However, Zalo is the dominant messaging app in Vietnam with 75M+ users, making it the most natural authentication method for Vietnamese business owners and Vietnamese-residing users.

### Discovery Context

Identified during Story 1.5 preparation — the story already includes a `zalo_contact` field, implicitly acknowledging Zalo as a primary communication channel for Vietnamese business owners. Adding Zalo OAuth login would significantly simplify the registration experience for this user segment.

### Evidence

- Zalo OAuth API available at `https://oauth.zaloapp.com/v3/auth` with standard OAuth2-like flow
- Story 1.5 already references Zalo contact as a business owner field
- Architecture already supports multiple OAuth providers (LINE, Google pattern established)
- User Journey 3 (Chi Huong) describes sales rep assisting registration — Zalo login simplifies this

---

## 2. Impact Analysis

### Epic Impact

| Epic | Impact | Details |
|------|--------|---------|
| Epic 1 | Modified | Add Story 1.7, update Epic description to include Zalo |
| Epic 2-9 | No impact | No auth provider dependencies |

### Story Impact

| Story | Status | Impact |
|-------|--------|--------|
| 1.4 (User Auth) | done | No changes — Zalo builds on existing pattern |
| 1.5 (BO Registration) | ready-for-dev | No changes — keep email registration scope |
| 1.7 (NEW) | backlog | New story for Zalo OAuth (User + Business Owner) |

### Artifact Conflicts

| Artifact | Section | Change |
|----------|---------|--------|
| PRD functional-requirements.md | FR8 | "LINE or Google" → "LINE, Google, or Zalo" |
| PRD functional-requirements.md | FR30 | "email/password" → "email/password or Zalo social login" |
| epics/epic-1-*.md | Description + Story 1.7 | Updated description, added new story |
| epics/epic-list.md | Epic 1 stories | Added "1.7 Zalo Social Login" |
| sprint-status.yaml | development_status | Added 1-7-zalo-social-login entry |

### Technical Impact

- Backend: Add Zalo OAuth flow to auth module (service, router, constants, config)
- Frontend: Add Zalo login button to SignupModal and Business Registration page
- Config: Add ZALO_APP_ID, ZALO_APP_SECRET, ZALO_REDIRECT_URI env vars
- Note: Zalo access tokens expire in 1 hour (vs LINE/Google longer tokens) — backend only uses them to fetch profile, then issues platform JWT, so no impact on user session management

---

## 3. Recommended Approach

**Selected: Direct Adjustment — Add new Story 1.7**

### Rationale

- Story 1.4 is done with proven OAuth pattern — no need to rollback or modify
- Story 1.5 has clear email registration scope — keep it focused
- New story 1.7 is cleanly scoped and reuses established patterns
- Effort is low-medium since LINE/Google OAuth pattern is already implemented

### Effort Estimate

- **Backend:** ~4h — new Zalo OAuth service method, router endpoints, config settings
- **Frontend:** ~4h — Zalo button in SignupModal + Business Register page
- **Tests:** ~2h — Zalo OAuth test cases (mirror LINE/Google tests)
- **Total:** ~1-2 days

### Risk Assessment: Low

- OAuth pattern is proven and tested
- Zalo API is well-documented at developers.zalo.me
- No existing code needs modification (additive only)

### Suggested Implementation Order

1. Story 1.5.1 (Zalo Social Login for Users) — implement first, establishes Zalo OAuth pattern
2. Story 1.5.2 (Business Owner Registration — Email + Zalo) — implement second, reuses Zalo OAuth from 1.5.1
3. Story 1.6 (Privacy Controls) — implement last

---

## 4. Detailed Change Proposals

### 4.1 PRD Changes (Applied)

**FR8:**
```
OLD: Guest can register as User via LINE social login or Google social login
NEW: Guest can register as User via LINE social login, Google social login, or Zalo social login
```

**FR30:**
```
OLD: BusinessOwner can register with email/password and accept digital agreement
NEW: BusinessOwner can register with email/password or Zalo social login, and accept digital agreement
```

### 4.2 Epic 1 Changes (Applied)

- Epic description updated to include Zalo
- Story 1.7 added with full acceptance criteria
- Story list in epic-list.md updated

### 4.3 Sprint Status Changes (Applied)

- Added `1-7-zalo-social-login-user-and-business-owner: backlog` to development_status

---

## 5. Implementation Handoff

### Scope: Minor

Direct implementation by development team. No backlog reorganization needed.

### Handoff Plan

1. **Dev team** implements Story 1.5 first (email BO registration — already ready-for-dev)
2. **Scrum Master** runs `create-story` for Story 1.7 after Story 1.5 is done
3. **Dev team** implements Story 1.7 (Zalo OAuth — reuses patterns from 1.4)
4. **Code review** after each story completion

### Prerequisites for Story 1.7

- Register app at [developers.zalo.me](https://developers.zalo.me/) to obtain app_id and app_secret
- Configure Zalo OAuth callback URL in Zalo Developer Console
- Add ZALO_APP_ID, ZALO_APP_SECRET to .env

### Success Criteria

- Users can login/register via Zalo on the Signup Modal
- Business Owners can register via Zalo on the Business Registration page
- Zalo accounts are auto-linked with existing accounts when email matches
- All existing LINE/Google/email auth flows continue working unchanged
- Test coverage maintained at 100% for auth module

---

**Status:** Approved by Lem on 2026-04-14
**Artifacts updated:** PRD, Epic 1, Epic List, Sprint Status
