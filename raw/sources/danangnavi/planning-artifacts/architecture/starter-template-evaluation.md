# Starter Template Evaluation

## Primary Technology Domain

**Full-stack web application** — Turborepo monorepo with hybrid single Next.js app (route groups) + FastAPI modular backend, based on project requirements analysis.

## Starter Options Considered

| Option | Description | Verdict |
|--------|-------------|---------|
| 3 separate Next.js apps + Turborepo | Independent deployment, independent scaling | ❌ Too much infrastructure overhead for solo dev — 3x Docker builds, 3x CI, 3x env configs, ~$48/mo DigitalOcean |
| 1 Next.js app + route groups (Hybrid) | Single deployment, route-level separation, architecture-ready for future split | ✅ Selected — optimal velocity, $24/mo, zero package publishing overhead |
| Existing full-stack templates (T3, RedwoodJS) | Pre-built starters | ❌ None support FastAPI + Next.js hybrid stack |

## Selected Approach: Hybrid Single App Monorepo

**Rationale:**
- Solo developer velocity: 2 setup stories vs 5 for multi-app
- Cost efficient: $24/mo DigitalOcean Droplet (4GB RAM) vs $48/mo (8GB)
- Route groups provide build-level code separation (tree-shaking ensures admin code doesn't ship to user pages)
- Architecture-ready: frontend `modules/` mirrors backend `modules/` — extract to separate app when scaling requires it
- BFF proxy per route group achieves same API separation as separate apps
- next-intl middleware scoped to user routes only — business/admin bypass i18n entirely

**Verified Current Versions (April 2026):**

| Package | Version | Role |
|---------|---------|------|
| Next.js | 16.2.x | Frontend framework, App Router, SSR |
| Turborepo | 2.9.4 | Monorepo build system, caching, parallel tasks |
| next-intl | Latest | i18n for user routes, Server Component support, ~2KB |
| FastAPI | Latest | Backend framework, async-first, Pydantic V2 |
| SQLAlchemy | 2.0+ | Async ORM, type-safe database operations |
| Alembic | Latest | Database migration management |
| Celery | 5.6.3 | Background task queue, Redis broker |
| Meilisearch | 1.16+ | Search engine, CJK tokenization, cross-language |
| Tailwind CSS | 4.x | Utility-first styling |
| Vitest | Latest | Frontend testing |
| pytest | Latest | Backend testing with pytest-asyncio |
| Docker Compose | Latest | Local dev + production containerization |
| pnpm | Latest | Package manager, workspace support |

## Monorepo Structure

```
danangnavi/
├── apps/
│   └── web/                        # Single Next.js 16 app (Hybrid)
│       ├── app/
│       │   ├── (user)/[locale]/    # Japanese end-user (mobile-first, SSR)
│       │   │   ├── page.tsx        # Homepage with senpai picks
│       │   │   ├── listings/       # Search, browse, detail
│       │   │   ├── community/      # Groups, posts, events
│       │   │   ├── guides/         # Area guides, articles
│       │   │   ├── deals/          # Coupons, deals
│       │   │   └── profile/        # User profile, favorites
│       │   ├── (business)/vi/      # Vietnamese business owner (desktop-first)
│       │   │   ├── dashboard/      # Analytics, revenue
│       │   │   ├── listings/       # Listing editor
│       │   │   └── coupons/        # Coupon manager
│       │   ├── (admin)/            # Admin panel (desktop-only)
│       │   │   ├── dashboard/      # Platform analytics
│       │   │   ├── moderation/     # Content review queue
│       │   │   ├── users/          # User/BO management
│       │   │   └── reports/        # Reporting tools
│       │   └── api/                # BFF proxy routes
│       │       ├── (user)/[...path]/route.ts
│       │       ├── (business)/[...path]/route.ts
│       │       └── (admin)/[...path]/route.ts
│       ├── modules/                # Feature modules (mirrors backend)
│       │   ├── user/               # User-facing components + hooks
│       │   ├── business/           # Business-facing components + hooks
│       │   └── admin/              # Admin-facing components + hooks
│       ├── shared/                 # Design tokens, primitives, utils
│       │   ├── components/         # Shared UI (Button, Card, Badge, Toast)
│       │   ├── hooks/              # Shared hooks
│       │   └── lib/                # API client, utils, constants
│       ├── messages/               # next-intl translation files
│       │   ├── ja.json
│       │   ├── en.json
│       │   └── vi.json
│       └── middleware.ts           # next-intl (user routes only)
├── packages/
│   └── types/                      # Shared TypeScript types (generated from backend schemas)
├── backend/
│   ├── main.py                     # FastAPI app entry point
│   ├── modules/
│   │   ├── auth/                   # JWT, RBAC, LINE/Google social login
│   │   ├── listing/                # CRUD, business hours, location
│   │   ├── translation/            # Tier 0 — Google/DeepL API, cache
│   │   ├── search/                 # Meilisearch integration, cross-language
│   │   ├── community/              # Posts, comments, events, groups
│   │   ├── media/                  # Camera-only upload, EXIF, compression
│   │   ├── moderation/             # Auto-filter + human queue + escalation
│   │   ├── notification/           # Channel-agnostic core + adapters
│   │   ├── analytics/              # Dashboard data, reporting, CSV export
│   │   ├── coupon/                 # Create, claim, redeem, Redis counters
│   │   └── gamification/           # Points, badges, senpai progression
│   ├── shared/                     # Middleware, event bus, utils
│   ├── infrastructure/             # Redis, Meilisearch, CDN configs
│   ├── migrations/                 # Alembic migration files
│   └── tests/                      # pytest + pytest-asyncio
├── docker/
│   ├── docker-compose.yml          # 6 services: web, backend, postgres, redis, meilisearch, nginx
│   ├── Dockerfile.web              # Next.js production build
│   ├── Dockerfile.backend          # FastAPI + uvicorn
│   └── Dockerfile.worker           # Celery workers
├── turbo.json                      # Turborepo pipeline config
├── pnpm-workspace.yaml             # Workspace: apps/web, packages/types
└── package.json                    # Root scripts
```

## i18n Strategy (Per Route Group)

| Route Group | Locale Strategy | Implementation |
|-------------|----------------|----------------|
| `(user)/` | Full i18n — ja (default), en, vi | next-intl middleware, `[locale]` dynamic segment |
| `(business)/` | Vietnamese only — hardcoded | No next-intl, `lang="vi"` attribute, Vietnamese strings inline or simple dict |
| `(admin)/` | English/Vietnamese — simple toggle | No next-intl, lightweight context-based language switch |

next-intl middleware matcher configured to only process `(user)` routes — zero overhead for business/admin.

## Initialization Commands

```bash
# 1. Create Turborepo monorepo
npx create-turbo@latest danangnavi --package-manager pnpm

# 2. Create single Next.js app
cd danangnavi
pnpm create next-app apps/web --typescript --tailwind --eslint --app --turbopack --import-alias "@/*"

# 3. Setup shared types package
mkdir -p packages/types/src && cd packages/types
pnpm init

# 4. Setup FastAPI backend
mkdir -p backend/{modules,shared,infrastructure,migrations,tests}
cd backend && python -m venv .venv
pip install "fastapi[standard]" "sqlalchemy[asyncio]" asyncpg "celery[redis]" alembic pydantic-settings httpx pytest pytest-asyncio ruff

# 5. Docker infrastructure
cd .. && mkdir -p docker
# Create docker-compose.yml with: postgres, redis, meilisearch, web, backend, nginx
```

## Architectural Decisions Provided by Setup

| Decision Area | Choice | Rationale |
|--------------|--------|-----------|
| Frontend architecture | Single app + route groups | Solo dev velocity, cost-efficient, architecture-ready for split |
| Language (Frontend) | TypeScript strict | Type safety, shared types across modules |
| Language (Backend) | Python 3.12+ | FastAPI ecosystem, async/await native |
| Styling | Tailwind CSS 4.x | Rapid development, matches Design System tokens |
| Build tool | Turbopack (Next.js) + Turborepo | Fast builds, monorepo caching |
| Testing (Frontend) | Vitest + React Testing Library | Fast, Vite-compatible |
| Testing (Backend) | pytest + pytest-asyncio | Async test support, mature ecosystem |
| Linting | ESLint (frontend) + Ruff (backend) | Fast, modern linters |
| ORM | SQLAlchemy 2.0 async + Alembic | Type-safe, migration management |
| i18n | next-intl (user routes only) | Server Component support, scoped to where needed |
| Package manager | pnpm | Fast, disk-efficient, workspace support |
| Containerization | Docker Compose | Local dev + DigitalOcean production |
| Deployment | DigitalOcean Droplet ($24/mo 4GB) | Vietnam-accessible, cost-efficient for MVP |

**Note:** Project initialization using these commands should be the first implementation story.
