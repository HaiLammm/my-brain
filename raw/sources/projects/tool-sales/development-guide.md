# Development Guide

> How to run, test, and contribute to each part. Greenfield rebuild of a Japanese B2B sales-form automation pipeline; 7 epics / 38 stories implemented.

## 1. Prerequisites

| Tool | Version | For |
|------|---------|-----|
| Docker + Compose | recent | full stack |
| Node.js | 22 | frontend |
| pnpm | 10 | frontend deps |
| Python | 3.12+ | backend & workers |
| uv | 0.11.x | Python deps (frozen lockfiles) |
| PostgreSQL | 16 | local DB (or via Compose) |
| Claude CLI | — | prospecting worker (Epic 7) only |

Fastest path: `docker compose up -d` (see [Deployment Guide](./deployment-guide.md)). For per-part local dev, read on.

## 2. Frontend (`frontend/`)

```bash
cd frontend
pnpm install
pnpm dev          # http://localhost:3000 (Turbopack)
pnpm test         # Vitest (jsdom), co-located *.test.tsx
pnpm lint         # ESLint 9
pnpm build        # standalone production build
```

- Set `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000/api`). It is **inlined at build** — rebuild after changing.
- **This is Next.js 16** (`AGENTS.md`): middleware is `proxy.ts`, builds are `standalone`, React 19. Read `node_modules/next/dist/docs/` before editing framework-level code.

## 3. Backend (`backend/`)

```bash
cd backend
uv sync
alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000   # http://localhost:8000/docs

# tests (DB-touching tests need a Postgres + RUN_DB_TESTS=1)
RUN_DB_TESTS=1 uv run pytest
uv run ruff check --select E,F,I,UP,B app/
uv run ruff format --check app/

# new migration
alembic revision --autogenerate -m "00NN_story_description"
alembic check        # drift
alembic heads        # confirm single head
```

`JWT_SECRET` must be set (no default). Seed an admin: `python -m app.scripts.create_admin` (uses `ADMIN_EMAIL`/`ADMIN_PASSWORD`).

## 4. Workers (`workers/`)

```bash
cd workers
uv sync
uv run playwright install --with-deps chromium   # discovery/submission need a browser

# run one worker (container sets WORKER_TYPE)
WORKER_TYPE=discovery uv run python -m worker.base   # or form | submission | prospecting
uv run python -m worker.reaper                       # standalone reaper

# tests — pure helpers run offline; gate the rest
uv run pytest                                  # offline-safe helpers
RUN_DB_TESTS=1 uv run pytest                   # + live Postgres
RUN_BROWSER_TESTS=1 uv run pytest              # + Playwright/Chromium
uv run ruff check .
```

Workers connect with `DATABASE_URL`; they **never** call the backend API. Most logic is pure (parser, matcher, breaker, verify) and unit-testable without DB or browser.

## 5. Naming Conventions (per language — do not cross-contaminate)

| Layer | Rule | Example |
|-------|------|---------|
| Python (backend/workers) | `snake_case` funcs/vars/modules, `PascalCase` classes, `UPPER_SNAKE` constants | `get_lead_by_id`, `CampaignService` |
| TypeScript (frontend) | `camelCase` vars/funcs, `PascalCase` components/types, **`kebab-case` filenames** | `useLeads`, `lead-status-badge.tsx` |
| DB | tables `snake_case` plural, FK `{singular}_id`, indexes `ix_{table}_{cols}` | `ng_flags`, `lead_id`, `ix_jobs_status_worker_type` |
| API | `kebab-case` plural nouns, JSON `snake_case` | `/api/ng-flags`, `company_name` |

## 6. House Rules (the things agents get wrong)

1. **No raw `fetch()` in components** — go through a TanStack Query hook → `lib/api/client.ts`.
2. **Zustand = UI state only** — server data belongs in TanStack Query.
3. **Backend layering** — routers→services→repositories→DB; only services call repositories; model↔schema conversion in services.
4. **SQLAlchemy 2.0 async** — `await session.execute(select(...))`, not legacy `Query`.
5. **Error envelope always** — `{error:{code,message,detail}}`; use the `AppError` hierarchy, never raw exceptions.
6. **Structured logs** — every line has `service`, `event`, `timestamp`; worker logs add `job_id`, `lead_id`; no PII/secrets.
7. **Worker checkpoint before any browser side-effect** — prevents double-submit on crash/retry.
8. **NG detection is zero-LLM and mandatory** — keyword + regex + false-positive filters; immutable audit trail; no path reaches submission without passing it.
9. **Check the LLM spend counter before every LLM call** (tiered breaker; budget resets midnight JST).
10. **JP text:** normalize full-width ⇄ half-width before matching form fields.
11. **Tests:** co-located Vitest (frontend); mirror `app/` with pytest (backend). All schema changes via Alembic.
12. **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:` …).

## 7. Parallel Development (`WORKTREE_RULES.md`)

Multiple stories run in isolated git worktrees/branches. Key constraints: one agent = one worktree = one branch; **never `git add -A`** (explicit paths only); reserve a migration revision id per branch and merge with `alembic merge heads` (never renumber); append-only at shared points (`main.py` router includes, `models/__init__.py`); each agent updates only its own `sprint-status.yaml` row; full test suite green before merge; no force-push / destructive ops on `main`.

## 8. Reference Scripts (repo root — port, don't import)

`scrape_ng3.py` is the **canonical NG detector** (Japanese keyword exact-match + regex + false-positive filters) ported into `workers/worker/ng/` and `backend/app/services/ng_engine.py`. Other root scripts (`scrape_danhsach.py`, `scrape_ng*.py`, `diagnose.py`, `check_copy.py`) are standalone pre-screening utilities, not part of the running pipeline.

See also: [Architecture per part](./index.md) · [Deployment Guide](./deployment-guide.md) · `_bmad-output/project-context.md` (the AI-agent rule sheet).
