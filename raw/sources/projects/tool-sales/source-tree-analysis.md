# Source Tree Analysis

> Annotated map of the **actual** repository (deep scan, verified against the working tree). Monorepo, 3 deployable parts + infra + planning artifacts.

## Top Level

```
tool_sales/
├── frontend/          # Part: Next.js 16 operator dashboard (web)
├── backend/           # Part: FastAPI API server (backend)
├── workers/           # Part: Playwright worker fleet (backend)
├── monitoring/        # Grafana + Loki + Promtail (observability stack)
├── docker-compose.yml # 13-service topology (postgres, 3 apps, 5 workers, n8n, monitoring)
├── .github/workflows/ci.yml   # CI: frontend + backend + workers + docker-build
├── _bmad-output/      # Planning + implementation artifacts (PRD, architecture, epics, stories, project-context.md)
├── _bmad/             # BMad method tooling (skills/config — not product code)
├── docs/              # ← this generated documentation set
├── scrape_ng3.py      # CANONICAL NG detector (port source); scrape_*.py, diagnose.py, check_copy.py = standalone utilities
├── index.html / .nojekyll  # GitHub Pages UX-mockup preview (not part of the stack)
└── WORKTREE_RULES.md  # parallel-dev constraints
```

## Frontend (`frontend/`)

```
frontend/
├── app/
│   ├── layout.tsx                  # root layout — ThemeProvider → QueryProvider → TooltipProvider
│   ├── page.tsx                    # cookie-based redirect → /dashboard or /login
│   ├── (auth)/login/               # public auth route (bare shell)
│   └── (app)/                      # guarded routes (sidebar + header + Toaster)
│       ├── layout.tsx              # app shell + single <Toaster>
│       ├── dashboard/  (+_components)   # live status, alerts, today's stats
│       ├── leads/  [id]/  import/  (+_components)  # list / detail / CSV+Sheets import
│       ├── campaigns/  (+_components)   # CRUD + lifecycle
│       ├── our-info/  (+_components)    # sender profile groups & fields
│       ├── prospecting/  (+_components) # Epic 7 — crawl/scrape/enrich + templates
│       ├── discovery/  (+_components)   # crawl tasks
│       ├── review/ng/                   # NG flag review queue
│       ├── contact/{form-understanding, anti-bot-captcha, captcha-queue}/
│       ├── workers/  [type]/  (+_components)   # status grid + job history
│       └── settings/{users, integrations}/     # admin
├── components/
│   ├── ui/                         # shadcn/ui primitives (base-nova)
│   └── shared/                     # header, sidebar, lead-status-badge, providers, theme
├── lib/
│   ├── api/                        # client.ts + per-domain fetchers (leads, campaigns, ng-flags, …)
│   ├── hooks/                      # use-* TanStack Query hooks + use-sse
│   ├── sse/                        # tiered-refresh.ts (live/status/history zones)
│   ├── stores/                     # auth-store, ui-store (Zustand — UI only)
│   └── utils/
├── proxy.ts                        # Next.js 16 middleware — session route guard
├── package.json · next.config.ts · tsconfig.json · components.json · vitest.config.ts
└── AGENTS.md · CLAUDE.md · README.md   # ⚠ Next.js 16 caveats
```

**Entry points:** `app/layout.tsx` (providers), `app/(app)/layout.tsx` (shell), `proxy.ts` (guard), `lib/api/client.ts` (`apiFetch`/`apiUpload`). Tests co-located (`*.test.ts(x)`).

## Backend (`backend/`)

```
backend/
├── app/
│   ├── main.py                     # ENTRY — app factory, lifespan loops, exception handlers, registers 19 routers
│   ├── core/                       # config · database · deps (auth) · exceptions · logging · security
│   ├── routers/                    # 19 modules — HTTP only (auth, leads, campaigns, ng_flags, sse, prospecting, …)
│   ├── services/                   # business logic — *_service.py + ng_engine, event_broker, kpi_refresh, prospecting_scheduler
│   ├── repositories/               # query-only DB access
│   ├── models/                     # 21 SQLAlchemy models (user, lead, campaign, job, ng_flag, form, …)
│   ├── schemas/                    # Pydantic v2 request/response shapes
│   └── scripts/                    # create_admin, etc.
├── alembic/
│   ├── env.py
│   └── versions/                   # 23 migrations (0001_baseline … 0023_prospecting_enrich = HEAD)
├── tests/{core, repositories, routers, services}/   # mirrors app/
├── Dockerfile · docker-entrypoint.sh   # runs `alembic upgrade head` then uvicorn
└── pyproject.toml · alembic.ini · .env.example
```

**Layering (strict):** `routers → services → repositories → models → DB`. Only services call repositories.

## Workers (`workers/`)

```
workers/
├── worker/
│   ├── base.py                     # ENTRY — BaseWorker (poll/heartbeat/checkpoint); WORKER_TYPE dispatch
│   ├── job_queue.py                # SELECT FOR UPDATE SKIP LOCKED claim + terminal writes (fencing)
│   ├── reaper.py                   # standalone — reset stale jobs (5 min), purge old NG evidence
│   ├── config.py · db_tables.py    # env config; Core tables mirroring backend schema (no backend import)
│   ├── jp_normalize.py             # full-width⇄half-width NFKC fold (shared by form + submission)
│   ├── discovery.py                # crawl + NG scan + form discovery
│   ├── ng/                         # keyword_scanner.py (port of scrape_ng3) + scanner.py
│   ├── form/                       # worker · parser · compare · confidence · breaker · budget · state · detect
│   ├── submission/                 # worker · form_fill · checkpoint · rate_limiter · retry_policy · captcha
│   ├── prospecting/                # worker · crawl · scrape · enrich · test · runner · prompt (Epic 7)
│   └── verification/               # verify · css_patterns · rescue · timing
├── tests/                          # 37 files; gated by RUN_DB_TESTS / RUN_BROWSER_TESTS
├── Dockerfile                      # python:3.12-slim + uv + playwright chromium
└── pyproject.toml
```

**Boundary:** zero imports from the backend package — workers reach the DB directly via `db_tables.py` Core tables.

## Monitoring & Infra

```
monitoring/
├── grafana/  (provisioning/datasources/loki.yml + dashboards: pipeline-overview, worker-health)
├── loki/loki-config.yml
└── promtail/promtail-config.yml      # scrape container stdout JSON → Loki
```

## Integration Map (how parts interface)

```
Browser → frontend(:3000) → REST /api/* + SSE → backend(:8000) → PostgreSQL(:5432)
                                                                      ↑ direct DB
                                          worker-{discovery,form,submission,prospecting,reaper}
all services → stdout JSON → promtail → loki(:3100) → grafana(:3001)
```

See: [Frontend](./architecture-frontend.md) · [Backend](./architecture-backend.md) · [Workers](./architecture-workers.md) · [Integration](./integration-architecture.md).
