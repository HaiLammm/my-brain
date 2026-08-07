---
project_name: 'tool_sales'
user_name: 'Lem'
date: '2026-06-18'
sections_completed: ['technology_stack', 'naming', 'backend_layering', 'frontend', 'workers', 'domain_gates', 'errors_logging', 'security', 'testing_workflow']
existing_patterns_found: 18
status: 'complete'
rule_count: 30
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

> `tool_sales` is a **greenfield rebuild** of a Japanese B2B sales-form automation pipeline. The product code (`frontend/`, `backend/`, `workers/`) is **not yet implemented** — it is fully specified in `_bmad-output/planning-artifacts/architecture.md`. The repository root currently holds **reference scripts** that downstream code must port, not extend.

**Frontend (`frontend/`)**

- Next.js 16.2 — App Router, Turbopack
- TypeScript, Tailwind CSS v4, shadcn/ui (CLI v4)
- TanStack Query (server state) + Zustand (UI-only state)
- React Hook Form + Zod (forms & validation)
- SSE via custom `useSSE()` hook for the alert zone
- Vitest (co-located tests)

**Backend (`backend/`)**

- Python 3.12+, FastAPI
- SQLAlchemy 2.0 **async** + Alembic migrations
- Pydantic v2 (schemas)
- Layering: `routers → services → repositories → DB`
- JWT + httpOnly cookies, bcrypt password hashing
- pytest + httpx (tests mirror `app/` structure)

**Workers (`workers/`)**

- Python 3.12+, Playwright (Chromium)
- 3 worker types: `discovery`, `form_understanding`, `submission` + a `reaper`
- Communicate with backend via **direct DB updates** (no REST callback layer)
- DB-based job queue: `SELECT FOR UPDATE SKIP LOCKED` + heartbeat + reaper

**Data & Infra**

- PostgreSQL (materialized views, job queue), WAL archiving → remote backup
- Docker Compose (7 services), GitHub Actions CI, manual deploy
- Grafana + Loki (structured JSON logs to stdout)

**External services**

- LLM API (provider TBD — Form Understanding only; NG Detection is LLM-free)
- CAPTCHA: 2captcha / CapSolver / Anti-Captcha (per-type mapping, human hand-off queue)
- Google Sheets (lead import), n8n (optional webhook triggers)

**Reference implementations to PORT (not import):**

- `scrape_ng3.py` (repo root) — canonical NG Detection: Japanese keyword exact-match + broad regex + false-positive filters. Source of truth for `workers/ng/`.
- `../auto_b_production/src/auto_b/core/` (sibling tool) — reference for form filling, form detection, opt-out checking, parallel worker pool, stealth, CSS verification selectors, placeholder system.
- External: `sales-tool.vinasaver.vn` — CSS verification library (30+ selectors), stealth settings, placeholder system.

## Critical Implementation Rules

> Source of truth: `_bmad-output/planning-artifacts/architecture.md`.
> These are the non-obvious rules — when in doubt, the architecture doc wins.

### Naming (per language — do not cross-contaminate)

- **Python** (backend/workers): `snake_case` functions/vars/modules, `PascalCase` classes, `UPPER_SNAKE` constants. ❌ never `getUserData()` → ✅ `get_user_data()`.
- **TypeScript** (frontend): `camelCase` vars/functions, `PascalCase` components/types, **`kebab-case` filenames** (`lead-table.tsx`, `use-sse.ts`). ❌ `leads_table.tsx`.
- **DB**: tables `snake_case` plural (`leads`, `ng_flags`); FK `{singular}_id`; indexes `ix_{table}_{cols}`.
- **API**: `kebab-case` plural nouns (`/api/ng-flags`); JSON fields `snake_case` (frontend transforms via TanStack Query).

### Backend layering (strict boundaries)

- `routers → services → repositories → DB`. Routers do HTTP only. **Only services call repositories.** Repositories return SQLAlchemy models, no business logic. Model↔Schema conversion happens in services.
- **SQLAlchemy 2.0 async** — use `await session.execute(select(...))`, not the legacy `Query` API. Pydantic **v2** schemas.

### Frontend rules

- **All API calls go through TanStack Query** — ❌ never raw `fetch()` in a component.
- **Zustand = UI state only** (sidebar, filters, modals). Never store server data in Zustand.
- Forms: React Hook Form + Zod. SSE only via the `useSSE()` hook (alert zone); SSE events named `{entity}.{action}` (`campaign.progress`, `worker.status`).

### Worker & job-queue rules (correctness-critical)

- Workers talk to backend via **direct DB updates** — no REST callback layer.
- Job queue: **`SELECT FOR UPDATE SKIP LOCKED`** + heartbeat column + reaper (reset stuck jobs after 5 min).
- **Checkpoint BEFORE any browser side-effect** (fill/submit) → prevents double-submit on crash/retry.

### Domain gates (legal & cost — never bypass)

- **NG Detection is function-based, ZERO LLM** — keyword exact + regex + false-positive filters, ported from `scrape_ng3.py`. It is a **mandatory pipeline gate**: no code path may reach Submission without passing NG screening. Write an **immutable audit trail** (matched keyword/regex, snippet, timestamp).
- **Form Understanding dual-run**: LLM + rule-based run in parallel → differ ⇒ update rule from LLM + reset counter; identical ⇒ increment; at **200 consecutive matches ⇒ auto-disable LLM**. **Check the LLM spend counter before every LLM call** (tiered circuit breaker 0-70/70-90/90-100%, budget resets midnight JST).
- **JP text**: normalize full-width ⇄ half-width characters before matching form fields.

### Errors, logging, data formats

- API errors **always** `{"error": {"code", "message", "detail"}}` — never raw exceptions. Use the `AppError` hierarchy + FastAPI exception handler. Internal codes: `captcha_timeout`, `field_unmapped`, `verification_inconclusive`.
- Structured **JSON logs to stdout**; every entry has `service`, `event`, `timestamp`. Worker logs add `job_id`, `lead_id`; verification logs add `selector_matched`, `rescue_used`, `rescue_level`.
- Dates ISO 8601 (display JST); `null` never empty string; `true`/`false` never `1`/`0`.

### Security

- JWT + **httpOnly cookies**, bcrypt, 8h session. All endpoints require JWT except `/api/auth/login`; 403 on wrong role. Secrets in env/`.env` only — never hardcoded; no PII in frontend logs.
- **New routers MUST declare `Depends(get_current_user)`** (or `require_role`/`require_admin` from `app/core/deps.py`) unless explicitly public. The only public endpoints are `/api/auth/login`, `/api/auth/logout`, and `/api/health` (liveness probe). 401 = not authenticated (`UnauthorizedError`); 403 = wrong role (`ForbiddenError`).

### Testing & workflow

- Frontend tests **co-located** (`lead-table.test.tsx`, Vitest). Backend tests **mirror `app/`** (`tests/services/test_campaign_service.py`, pytest + httpx).
- All schema changes via **Alembic**. Each service sets explicit `pool_size` (budget ~57/100 total).
- Commits follow **Conventional Commits** (`feat:`, `fix:`, `chore:` …).

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow ALL rules exactly; when in doubt, prefer the more restrictive option and defer to `architecture.md`.
- The product code (`frontend/`, `backend/`, `workers/`) does not exist yet — **scaffold per architecture.md**; port logic from the reference scripts, do not import them.
- Update this file when new patterns emerge.

**For Humans:**

- Keep this file lean and focused on what agents would otherwise get wrong.
- Update when the stack, naming, or pipeline gates change.
- Review periodically; remove rules that become obvious over time.

Last Updated: 2026-06-18
