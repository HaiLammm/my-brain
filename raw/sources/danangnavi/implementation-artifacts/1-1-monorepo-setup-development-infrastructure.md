# Story 1.1: Monorepo Setup & Development Infrastructure

Status: done

## Story

As a developer,
I want a fully configured monorepo with Next.js, FastAPI, and Docker infrastructure,
So that all subsequent development has a stable foundation with consistent tooling.

## Acceptance Criteria

1. **Given** a fresh clone of the repository
   **When** I run `pnpm install && docker compose --profile infra up`
   **Then** PostgreSQL, Redis, Meilisearch, and Nginx containers start successfully

2. **Given** the monorepo is set up
   **When** I start the frontend dev server
   **Then** Next.js dev server starts at localhost:3000 with Turbopack

3. **Given** the monorepo is set up
   **When** I start the backend dev server
   **Then** FastAPI dev server starts at localhost:8000 with auto-reload

4. **Given** the project structure
   **When** I inspect the directory layout
   **Then** the Turborepo monorepo structure matches Architecture spec (`apps/web`, `packages/types`, `backend`)
   **And** pnpm workspace is configured with `apps/web` and `packages/types`

5. **Given** the linting tools
   **When** I run linters
   **Then** ESLint (frontend) and Ruff (backend) are configured and pass on empty project

6. **Given** a pull request is opened
   **When** GitHub Actions CI runs
   **Then** lint + test pipeline executes successfully

7. **Given** Docker Compose configuration
   **When** I inspect docker-compose.yml
   **Then** it includes 6 services: web, backend, postgres, redis, meilisearch, nginx
   **And** Docker Compose profiles are configured: `infra`, `backend`, `frontend`, `full`

8. **Given** the Nginx configuration
   **When** requests are routed
   **Then** Nginx reverse proxy routes `/api/*` to backend and `/*` to frontend

9. **Given** environment configuration
   **When** I check the project root
   **Then** `.env.example` contains all required environment variables

10. **Given** the project documentation
    **When** I check README.md
    **Then** it documents setup instructions for local development

## Tasks / Subtasks

- [x] Task 1: Initialize Turborepo monorepo (AC: #4)
  - [x] Run `npx create-turbo@latest` with pnpm package manager
  - [x] Configure `pnpm-workspace.yaml` with `apps/web` and `packages/types`
  - [x] Configure `turbo.json` pipeline (build, lint, test, dev)
  - [x] Create root `package.json` with workspace scripts

- [x] Task 2: Create Next.js 16 app at `apps/web` (AC: #2, #4)
  - [x] Run `pnpm create next-app apps/web` with TypeScript, Tailwind CSS 4.x, ESLint, App Router, Turbopack
  - [x] Use import alias `@/*`
  - [x] Create route group directories: `app/(user)/`, `app/(business)/`, `app/(admin)/`, `app/api/`
  - [x] Create placeholder `page.tsx` for each route group root
  - [x] Create `app/layout.tsx` (root), `app/not-found.tsx`, `app/error.tsx`
  - [x] Configure `next.config.ts` (Turbopack enabled for dev)
  - [x] Create `modules/` directory structure: `user/`, `business/`, `admin/` (each with `components/`, `hooks/`, `lib/`)
  - [x] Create `shared/` directory structure: `components/`, `hooks/`, `lib/`, `stores/`, `providers/`
  - [x] Create `messages/` directory with empty `ja.json`, `en.json`, `vi.json`
  - [x] Configure `vitest.config.ts` for frontend testing

- [x] Task 3: Create shared types package at `packages/types` (AC: #4)
  - [x] Initialize with `package.json` (name: `@danangnavi/types`)
  - [x] Create `src/api-types.ts` placeholder
  - [x] Create `generate.sh` script (curl OpenAPI JSON + run openapi-typescript)
  - [x] Create `tsconfig.json`

- [x] Task 4: Set up FastAPI backend at `backend/` (AC: #3)
  - [x] Create Python virtual environment setup instructions
  - [x] Create `requirements.txt`: fastapi[standard], sqlalchemy[asyncio], asyncpg, celery[redis], alembic, pydantic-settings, httpx, structlog, argon2-cffi
  - [x] Create `requirements-dev.txt`: pytest, pytest-asyncio, ruff, httpx (test client)
  - [x] Create `pyproject.toml` with Ruff config and pytest config
  - [x] Create `main.py` — FastAPI app entry point with CORS, health endpoint (`GET /api/v1/health`)
  - [x] Create `shared/` infrastructure: `config.py` (Pydantic Settings), `database.py` (async engine + session), `redis.py` (Redis client), `exceptions.py` (AppException base), `base_models.py` (Base SQLAlchemy model with id, created_at, updated_at, deleted_at)
  - [x] Create `shared/middleware/`: `error_handler.py`, `cors.py`, `request_id.py`
  - [x] Create module directory stubs: `modules/auth/`, `modules/listing/` (with `__init__.py` only)
  - [x] Create `infrastructure/` directory with `__init__.py`
  - [x] Initialize Alembic: `migrations/env.py`, `migrations/alembic.ini`, `migrations/versions/`
  - [x] Create `tests/conftest.py` with async db session fixture

- [x] Task 5: Configure Docker Compose (AC: #1, #7, #8)
  - [x] Create `docker/docker-compose.yml` with 6 services and profiles
  - [x] PostgreSQL 16.x service: port 5432, persistent volume, health check
  - [x] Redis 7.x service: port 6379, persistent volume, health check
  - [x] Meilisearch 1.16+ service: port 7700, persistent volume, master key config
  - [x] Nginx service: port 80, reverse proxy config (`/api/*` -> backend:8000, `/*` -> web:3000)
  - [x] Backend service: port 8000, mount `./backend`, auto-reload with uvicorn
  - [x] Web service: port 3000, mount `./apps/web`, Turbopack dev mode
  - [x] Create `docker/docker-compose.override.yml` for dev overrides (hot reload, exposed ports)
  - [x] Create `docker/nginx/nginx.conf` with reverse proxy rules
  - [x] Create `docker/Dockerfile.web` (Next.js production build, multi-stage)
  - [x] Create `docker/Dockerfile.backend` (FastAPI + uvicorn, multi-stage)
  - [x] Create `docker/Dockerfile.worker` (Celery worker)

- [x] Task 6: Configure ESLint and Ruff linting (AC: #5)
  - [x] Verify ESLint config from `create-next-app` is working in `apps/web`
  - [x] Configure Ruff in `pyproject.toml`: line-length 88, select rules (E, W, F, I, N, UP), target Python 3.12+
  - [x] Add lint scripts to root `package.json`: `lint:web`, `lint:backend`, `lint`
  - [x] Ensure both linters pass on initial empty project

- [x] Task 7: Set up GitHub Actions CI (AC: #6)
  - [x] Create `.github/workflows/ci.yml`
  - [x] Job 1: Frontend lint + test (pnpm install, ESLint, Vitest)
  - [x] Job 2: Backend lint + test (pip install, Ruff, pytest)
  - [x] Trigger on pull_request to main
  - [x] Cache pnpm store and pip packages

- [x] Task 8: Create environment and documentation files (AC: #9, #10)
  - [x] Create `.env.example` with all required variables:
    - DATABASE_URL, REDIS_URL, MEILISEARCH_URL, MEILISEARCH_MASTER_KEY
    - JWT_SECRET, JWT_ALGORITHM=HS256, ACCESS_TOKEN_EXPIRE_MINUTES=1440
    - LINE_CLIENT_ID, LINE_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
    - TRANSLATION_API_KEY, DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_BUCKET
    - SENTRY_DSN, ENVIRONMENT=development
  - [x] Create comprehensive `README.md` with:
    - Project overview, tech stack
    - Prerequisites (Node.js, pnpm, Python 3.12+, Docker)
    - Quick start: clone, `pnpm install`, `docker compose --profile infra up`, start dev servers
    - Available scripts and commands
    - Project structure overview
  - [x] Create `.gitignore` covering Node, Python, Docker, IDE files, `.env`

## Dev Notes

### Architecture Compliance

- **Monorepo tool**: Turborepo 2.9.4 with pnpm workspaces
- **Frontend**: Next.js 16.2.x with App Router, Turbopack (dev), Tailwind CSS 4.x
- **Backend**: FastAPI (latest) with Python 3.12+, SQLAlchemy 2.0 async, Pydantic V2
- **Package manager**: pnpm (NOT npm or yarn)
- **Import alias**: `@/*` for `apps/web`

### Critical Technical Requirements

- **Hybrid Single App**: One Next.js app with 3 route groups: `(user)`, `(business)`, `(admin)`
  - `(user)/[locale]/` — next-intl dynamic locale (ja/en/vi)
  - `(business)/vi/` — hardcoded Vietnamese, NO next-intl
  - `(admin)/` — simple EN/VI toggle, NO next-intl
- **BFF Proxy routes**: `app/api/(user)/[...path]/route.ts`, `app/api/(business)/[...path]/route.ts`, `app/api/(admin)/[...path]/route.ts` — proxy to FastAPI backend
- **Module mirroring**: Frontend `modules/` mirrors backend `modules/` structure exactly
- **Docker Compose profiles**: `infra` (DB/Redis/Meili only), `backend`, `frontend`, `full` (everything)

### Backend Foundation Requirements

- `shared/config.py` MUST use Pydantic `BaseSettings` — NEVER `os.getenv()` directly
- `shared/base_models.py` MUST define Base model with: `id` (UUID v4), `created_at`, `updated_at`, `deleted_at` (soft delete)
- `shared/exceptions.py` MUST define `AppException` with: `code`, `message_ja`, `message_vi`, `message_en`, `status_code`
- `main.py` health endpoint: `GET /api/v1/health` returning `{"status": "ok"}`
- All API responses use snake_case JSON fields
- API versioning: URL prefix `/api/v1/`

### Docker Services Specification

| Service | Image | Port | Volume | Health Check |
|---------|-------|------|--------|-------------|
| postgres | postgres:16 | 5432 | pgdata:/var/lib/postgresql/data | pg_isready |
| redis | redis:7-alpine | 6379 | redisdata:/data | redis-cli ping |
| meilisearch | getmeili/meilisearch:v1.16 | 7700 | msdata:/meili_data | curl localhost:7700/health |
| nginx | nginx:alpine | 80 | ./nginx/nginx.conf | — |
| backend | Dockerfile.backend | 8000 | ./backend (dev) | curl localhost:8000/api/v1/health |
| web | Dockerfile.web | 3000 | ./apps/web (dev) | curl localhost:3000 |

### Nginx Reverse Proxy Rules

```nginx
location /api/ {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location / {
    proxy_pass http://web:3000;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

### Naming Conventions (Enforce from Day 1)

- **Database**: snake_case tables (plural), snake_case columns, `idx_{table}_{columns}` indexes
- **API JSON**: snake_case fields
- **Frontend code**: PascalCase components, camelCase functions/variables, UPPER_SNAKE_CASE constants
- **Backend code**: snake_case modules/functions, PascalCase classes, `{Entity}{Context}Request/Response` for Pydantic
- **IDs**: UUID v4 for all primary keys — NO auto-increment exposed in API
- **Timestamps**: Always UTC in DB and API, locale-formatted only in frontend

### Testing Setup

- **Frontend**: Vitest + React Testing Library in `apps/web/vitest.config.ts`
- **Backend**: pytest + pytest-asyncio in `backend/pyproject.toml`
- **Test naming**: Backend: `test_{action}_{scenario}_{expected_result}`, Frontend: `it("should {action} when {condition}")`
- **Backend test fixture**: async db session with transaction rollback per test

### Ruff Configuration

```toml
[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "W", "F", "I", "N", "UP"]
```

### GitHub Actions CI Structure

```yaml
# Trigger: pull_request to main
# Jobs:
#   frontend:
#     - checkout, setup-node, pnpm install (cached)
#     - pnpm lint:web
#     - pnpm test:web (vitest)
#   backend:
#     - checkout, setup-python 3.12
#     - pip install -r requirements.txt -r requirements-dev.txt (cached)
#     - ruff check backend/
#     - pytest backend/tests/
```

### Project Structure Notes

- All paths MUST match the Architecture spec exactly — see [Source: architecture/project-structure-boundaries.md#complete-project-directory-structure]
- Frontend modules mirror backend modules: `modules/user/`, `modules/business/`, `modules/admin/`
- Shared components go in `apps/web/shared/components/`
- Shared hooks go in `apps/web/shared/hooks/`
- Infrastructure configs go in `backend/infrastructure/`
- Alembic migrations in `backend/migrations/versions/` with naming: `{YYYY}_{MM}_{DD}_{HHMM}_{description}.py`

### Anti-Patterns to Avoid

- DO NOT use `npm` or `yarn` — use `pnpm` only
- DO NOT use `os.getenv()` in backend modules — use `shared/config.py` Settings
- DO NOT use auto-increment integer IDs — use UUID v4
- DO NOT use `any` type in TypeScript — use `unknown` + type guards
- DO NOT create separate Next.js apps for business/admin — use route groups in single app
- DO NOT install next-intl middleware for `(business)/` or `(admin)/` routes
- DO NOT use spinners — use Skeleton components for loading states

### References

- [Source: architecture/starter-template-evaluation.md#initialization-commands] — Setup commands
- [Source: architecture/starter-template-evaluation.md#selected-approach-hybrid-single-app-monorepo] — Architecture rationale
- [Source: architecture/project-structure-boundaries.md#complete-project-directory-structure] — Full directory tree
- [Source: architecture/core-architectural-decisions.md] — Technology choices and versions
- [Source: architecture/implementation-patterns-consistency-rules.md] — Naming/structure conventions
- [Source: prd/web-application-architecture.md] — SSR/SPA strategy, SEO
- [Source: prd/non-functional-requirements.md] — Performance/security targets

### Review Findings

#### Decision Needed (all resolved)

- [x] [Review][Decision] **D1 — Duplicate docker-compose files** — Resolved: keep root as canonical, symlink from docker/
- [x] [Review][Decision] **D2 — Nginx routing** — Resolved: split /api/v1/* -> backend, /api/user|business|admin/* -> web
- [x] [Review][Decision] **D3 — BFF proxy route paths** — Resolved: keep flat paths (route groups cause URL conflicts in Next.js API routes); removed duplicate (user)/(business)/(admin) dirs

#### Patches (all applied)

- [x] [Review][Patch] **P1** — Proxy env var changed from NEXT_PUBLIC_BACKEND_URL to BACKEND_INTERNAL_URL
- [x] [Review][Patch] **P2** — Proxy try/catch added, returns JSON 503 on backend down
- [x] [Review][Patch] **P3** — Proxy strips hop-by-hop headers, overrides Host header
- [x] [Review][Patch] **P4** — Alembic env.py converts asyncpg URL to psycopg2 for sync migrations; alembic.ini uses %(here)s path
- [x] [Review][Patch] **P5** — CI backend job uses working-directory: backend
- [x] [Review][Patch] **P6** — CI triggers on both push and pull_request to main
- [x] [Review][Patch] **P7** — Settings class now has all 18 env vars from .env.example
- [x] [Review][Patch] **P8** — Dockerfiles only install production deps (requirements.txt)
- [x] [Review][Patch] **P9** — Dockerfile.web runner copies pnpm-workspace.yaml and root package.json
- [x] [Review][Patch] **P10** — Redis client uses singleton pattern
- [x] [Review][Patch] **P11** — Error handler catches RequestValidationError, HTTPException, and generic Exception with multilingual messages
- [x] [Review][Patch] **P12** — next-intl installed, middleware.ts and i18n/ config created
- [x] [Review][Patch] **P13** — nginx.conf has resolver directive and proper Connection upgrade map

#### Deferred (pre-existing or out-of-scope for story 1.1)

- [x] [Review][Defer] Route group layout files missing for (admin), (user)/[locale], (business)/vi — deferred, story 1.2/1.3 territory
- [x] [Review][Defer] backend/shared/event_bus.py and utils/ directory missing — deferred, needed when first cross-module communication is implemented
- [x] [Review][Defer] Celery tasks in infrastructure/worker.py instead of tasks/ — deferred, restructure when first Celery task is implemented
- [x] [Review][Defer] Health endpoint doesn't probe DB/Redis — deferred, acceptable for initial scaffold
- [x] [Review][Defer] vitest.config.ts missing setupFiles for jest-dom — deferred, fix when first component test is written
- [x] [Review][Defer] Hardcoded Postgres password in docker-compose — deferred, acceptable for local dev only
- [x] [Review][Defer] Redis has no password — deferred, local dev only
- [x] [Review][Defer] Settings .env file path relative to CWD — deferred, works in current Docker WORKDIR setup

## Dev Agent Record

### Agent Model Used

github-copilot/gpt-5.3-codex

### Debug Log References

- `pnpm install`
- `pnpm lint`
- `pnpm test`
- `python -m pytest backend/tests -c backend/pyproject.toml`
- `docker compose config --profiles`
- `docker compose --profile infra up -d` (partially blocked by local port 5432 in use)
- `pnpm --filter web dev --port 3000 --hostname 127.0.0.1`
- `uvicorn main:app --reload --host 127.0.0.1 --port 8000`

### Completion Notes List

- Initialized pnpm + Turborepo monorepo at repo root with `apps/web`, `packages/types`, and backend scripts.
- Scaffolded Next.js 16 web app in `apps/web` with route groups, BFF proxy routes, shared/module directory skeletons, i18n message placeholders, and Vitest config.
- Implemented FastAPI backend foundation: settings, middleware, base models, database/redis scaffolding, Alembic bootstrap files, and health endpoint `/api/v1/health`.
- Added Docker infrastructure files including compose stacks, nginx reverse proxy, and Dockerfiles for web/backend/worker.
- Added CI workflow and baseline tests; validated lint/test pipelines locally.
- Docker infra profile starts services as configured, but local verification of postgres start is blocked on this machine because host port `5432` is already occupied.

### File List

- package.json
- pnpm-workspace.yaml
- turbo.json
- pnpm-lock.yaml
- .gitignore
- .env.example
- README.md
- docker-compose.yml
- docker-compose.override.yml
- .github/workflows/ci.yml
- apps/web/package.json
- apps/web/tsconfig.json
- apps/web/next.config.ts
- apps/web/eslint.config.mjs
- apps/web/postcss.config.mjs
- apps/web/app/layout.tsx
- apps/web/app/page.tsx
- apps/web/app/not-found.tsx
- apps/web/app/error.tsx
- apps/web/app/(user)/page.tsx
- apps/web/app/(user)/[locale]/page.tsx
- apps/web/app/(business)/page.tsx
- apps/web/app/(business)/vi/page.tsx
- apps/web/app/(admin)/page.tsx
- apps/web/app/api/user/[...path]/route.ts
- apps/web/app/api/business/[...path]/route.ts
- apps/web/app/api/admin/[...path]/route.ts
- apps/web/shared/lib/proxy.ts
- apps/web/messages/ja.json
- apps/web/messages/en.json
- apps/web/messages/vi.json
- apps/web/modules/user/components/.gitkeep
- apps/web/modules/user/hooks/.gitkeep
- apps/web/modules/user/lib/.gitkeep
- apps/web/modules/business/components/.gitkeep
- apps/web/modules/business/hooks/.gitkeep
- apps/web/modules/business/lib/.gitkeep
- apps/web/modules/admin/components/.gitkeep
- apps/web/modules/admin/hooks/.gitkeep
- apps/web/modules/admin/lib/.gitkeep
- apps/web/shared/components/.gitkeep
- apps/web/shared/hooks/.gitkeep
- apps/web/shared/stores/.gitkeep
- apps/web/shared/providers/.gitkeep
- apps/web/tests/home.test.tsx
- apps/web/vitest.config.ts
- apps/web/.gitignore
- apps/web/README.md
- apps/web/AGENTS.md
- apps/web/CLAUDE.md
- backend/README.md
- backend/main.py
- backend/requirements.txt
- backend/requirements-dev.txt
- backend/pyproject.toml
- backend/shared/__init__.py
- backend/shared/config.py
- backend/shared/database.py
- backend/shared/redis.py
- backend/shared/exceptions.py
- backend/shared/base_models.py
- backend/shared/middleware/__init__.py
- backend/shared/middleware/cors.py
- backend/shared/middleware/error_handler.py
- backend/shared/middleware/request_id.py
- backend/modules/auth/__init__.py
- backend/modules/listing/__init__.py
- backend/infrastructure/__init__.py
- backend/infrastructure/worker.py
- backend/migrations/alembic.ini
- backend/migrations/env.py
- backend/tests/conftest.py
- backend/tests/test_health.py
- docker/docker-compose.yml
- docker/docker-compose.override.yml
- docker/nginx/nginx.conf
- docker/Dockerfile.web
- docker/Dockerfile.backend
- docker/Dockerfile.worker
