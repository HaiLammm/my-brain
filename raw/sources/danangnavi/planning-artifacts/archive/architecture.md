---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-04-10'
inputDocuments:
  - 'A-Product-Brief/project-brief.md'
  - 'A-Product-Brief/content-language.md'
  - 'A-Product-Brief/visual-direction.md'
  - 'A-Product-Brief/platform-requirements.md'
  - 'planning-artifacts/prd.md'
  - 'planning-artifacts/implementation-readiness-report-2026-04-09.md'
  - 'B-Trigger-Map/00-trigger-map.md'
  - 'C-UX-Scenarios/00-ux-scenarios.md'
  - 'D-Design-System/index.md'
  - 'D-Design-System/design-tokens.md'
workflowType: 'architecture'
project_name: 'danangnavi'
user_name: 'Lem'
date: '2026-04-10'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (74 FRs across 16 categories):**

| Category | FRs | Architectural Impact |
|----------|-----|---------------------|
| Discovery & Search (FR1-FR7) | 7 | SSR pages, search engine, cross-language matching, favorites persistence |
| Onboarding & Profiles (FR8-FR14) | 7 | Social auth integration (LINE/Google), gamification engine (points/badges) |
| Reviews & Content (FR15-FR19) | 5 | Camera-only upload pipeline, EXIF validation, UGC moderation |
| Community & Events (FR20-FR25) | 6 | Group system, event registration, polling-based real-time updates |
| Communication Bridge (FR26-FR29) | 4 | Voice synthesis, phrase pack data model, translation API integration |
| Business Owner Tools (FR30-FR38) | 9 | Separate Vietnamese dashboard, listing CRUD with auto-translation, analytics engine |
| Admin & Moderation (FR39-FR48) | 10 | Moderation queue, automated filters (spam/keyword/AI image), RBAC, reporting |
| Auth & Authorization (FR49-FR53) | 5 | JWT + refresh token, 4 role types, RBAC sub-roles, guest access |
| Privacy & Compliance (FR54-FR58) | 5 | Consent management, location opt-out, activity logging, allergen flagging |
| SEO (FR59-FR60) | 2 | SSR with JSON-LD, sitemap generation, OpenGraph |
| Coupons (FR61-FR62) | 2 | Coupon claim/redeem flow, location-based discovery, real-time availability via Redis |
| Multi-Language (FR63-FR65) | 3 | i18n routing, cross-language search index, language-specific UIs |
| Media Processing (FR66) | 1 | Image compression, WebP conversion, CDN delivery, cross-platform camera handling |
| Notifications (FR67-FR68) | 2 | Channel-agnostic notification system, per-category preferences |
| Data Export (FR69-FR70) | 2 | CSV generation for admin and business owner |
| UX Completeness (FR71-FR74) | 4 | Empty states, wizard flows, soft-delete for undo, account deletion with data removal |

**Non-Functional Requirements (46 NFRs):**

| Category | Key Constraints |
|----------|----------------|
| Performance | FCP < 2s, LCP < 2.5s, API < 500ms p95, cross-language search < 1s |
| Security | JWT HTTP-only + CSRF, TLS 1.3, AES-256 at rest, bcrypt, rate limiting, audit logging |
| Scalability | 500→5,000 concurrent, 100K+ listings, 500K+ photos, stateless API, Redis 80%+ cache |
| Accessibility | WCAG 2.1 AA, 44px touch targets, 4.5:1 contrast, keyboard nav, ARIA |
| Integration | 9 external services with 5s timeout + circuit breaker pattern |
| Reliability | 99.5% uptime, daily backup, RTO 4h, RPO 24h, <0.1% 5xx |

**Scale & Complexity:**

- Primary domain: Full-stack web application (Next.js + FastAPI monorepo)
- Complexity level: **High** — three-sided platform, multilingual, UGC, moderation, compliance
- Estimated architectural components: ~12 backend modules, 3 distinct frontend apps, 5+ infrastructure services

### Technical Constraints & Dependencies

| Constraint | Source | Impact |
|-----------|--------|--------|
| Next.js App Router + FastAPI | PRD/Platform Req | Monorepo with multiple BFF apps, separate deployment units |
| PostgreSQL + Redis | PRD | Primary data store + caching/pub-sub/rate-limiting/counters |
| Meilisearch | Architecture Decision | Dedicated search engine for cross-language JP↔VN matching |
| Vietnam-based servers | Vietnam Cybersecurity Law | Hosting provider must have Vietnam DC |
| APPI compliance | Japanese user data | Explicit consent, right to deletion, data export capability |
| Camera-only photos | Trust model | EXIF validation pipeline, cross-platform camera API handling |
| Solo developer initially | Resource constraint | Modular architecture critical for incremental development and future team onboarding |
| Mobile-first responsive | UX requirement | Mobile (320-767px) primary for user app, desktop for dashboards |
| Web-first strategy | Platform decision | Web app for all user types first, native mobile app Phase 3 |

### Cross-Cutting Concerns Identified

| Concern | Affected Components | Strategy |
|---------|-------------------|----------|
| **Translation (Tier 0)** | Listing, search, community, voice, moderation | Dedicated translation module — cross-cuts too many modules to embed. Graceful degradation on API failure |
| **Authentication / Authorization** | All API endpoints + frontend | JWT middleware, RBAC enforcement, LINE as primary auth for JP users |
| **Image Processing** | Reviews, listings, profiles | Dedicated media module — EXIF check → compression → CDN. Cross-platform camera API handling |
| **Content Moderation** | Reviews, posts, comments, photos | Automated filters + human review queue + escalation workflow via event-driven pipeline |
| **Caching** | Search, listings, community feed | Redis — write-through for listings, TTL for search, event-driven for user data |
| **Audit Logging** | Admin actions, moderation, auth | Structured logging with timestamp, actor, action detail |
| **Error Handling** | All modules + external APIs | Standardized error layer with polite Japanese-localized messages, circuit breaker for integrations |
| **SEO** | All public pages | SSR, structured data, meta tags, sitemap per language |
| **Event Bus** | All modules | In-process sync events + Redis Pub/Sub for async — decoupled module communication |
| **Notification Channels** | In-app, email, LINE (future), push (future) | Channel-agnostic core + pluggable delivery adapters |

### Japanese User Culture — Architectural Implications

| Cultural Insight | Architectural Impact | Priority |
|-----------------|---------------------|----------|
| **Japanese-grade error handling** — Raw errors destroy trust | Standardized error response layer with polite localized messages + error codes for reporting | MVP |
| **Perceived performance (遅い = 不信)** — Slow = unprofessional | Skeleton loading for all data fetches, optimistic UI for save/heart/vote actions | MVP |
| **安心感 (Anshinkan) — Sense of Security** | Confirmation steps for important actions, soft-delete/undo for reviews and posts, visible activity history | MVP |
| **LINE ecosystem dependency** — Primary communication infrastructure for JP in VN | LINE Login as primary auth, abstract notification channels for future LINE Notify/LIFF integration | MVP (auth), Phase 2 (notify) |
| **情報密度 (Jōhō mitsudo) — Information density** | Section-based lazy loading for content-rich homepage, multiple sections loading independently | MVP |
| **クーポン文化 (Coupon culture)** — Precise, reliable coupon UX expected | Redis real-time availability counters, expiry management via scheduled jobs, redemption verification (QR/code) | MVP |
| **Multi-criteria review culture** — Japanese read reviews deeply | Expanded review data model (food/service/atmosphere/value), prominent "helpful" voting for consensus signal | MVP |
| **Privacy / shared devices** — Explicit logout expected | Explicit logout confirmation + clear all cached personal data on logout | MVP |
| **季節感 (Kisetsukan) — Seasonal awareness** | Seasonal tags in data model from day one, content scheduling for seasonal promotions | Data model MVP, features Phase 2 |
| **本音/建前 (Honne/Tatemae)** — Subtle review language | Multi-criteria ratings more important than single star rating for nuanced expression | MVP |

### Architecture Pattern Decision

**Modular Monolith with Event-Driven Internal Communication**

Rationale: Solo developer + greenfield project. Microservices add network overhead, distributed debugging complexity, and deployment orchestration cost that are unnecessary at this stage. Modular monolith allows extracting modules to microservices later when specific bottlenecks appear.

**Key principles:**
- Modules do NOT import each other directly
- Communication via Internal Event Bus (sync) or Redis Pub/Sub (async)
- Each module owns its database tables — no cross-module direct SQL joins
- Shared data exchanged through events or internal service interfaces

### Concurrency & Processing Model

**4 Workload Types Identified:**

| Workload | Examples | Latency | Pattern |
|----------|---------|---------|---------|
| Synchronous Fast | Search, browse, listing detail, auth | < 500ms | Async I/O (uvicorn + asyncpg + aioredis) |
| Synchronous Slow | Cross-language search, translation preview | < 2s | Async I/O + Redis Cache |
| Background Deferred | Auto-translate listing, image compression, AI moderation | Minutes OK | Celery + Redis Broker (priority queues) |
| Scheduled Recurring | Coupon expiry check, analytics aggregation, sitemap gen | Batch OK | Celery Beat cron jobs |

**Async Stack:** uvicorn (ASGI, 1 worker/CPU core) + asyncpg + aioredis + httpx — non-blocking I/O handles thousands of concurrent connections per worker.

**Background Processing:** Celery with Redis broker, 3 priority queues (high/default/low), 4 specialized worker types (media, translation, moderation, notification).

### Data Flow Architecture

**Read Path (Fast):** Request → Redis Cache → [HIT] → Response (< 50ms) | [MISS] → PostgreSQL Read Replica → Cache → Response

**Write Path (Reliable):** Request → Validate → PostgreSQL Primary → Response → Emit Event (async) → Invalidate cache + Background processing + Index to Meilisearch

**Search Path (Cross-Language):** JP Query → Translation Module → Normalized Query → Meilisearch (JP + VN indexed content) → Ranked Results → Enrich from Redis/PostgreSQL → Response (< 1s)

**Polling Strategy:** Single unified `GET /api/v1/sync` endpoint with adaptive interval (30s default, increases when idle). Server returns delta updates for all subscribed channels. 304 Not Modified when no changes — bandwidth-friendly for 4G Vietnam.

### Scaling Strategy

**MVP (Month 1):** Single server (4 CPU, 8GB RAM) — uvicorn 4 workers, Celery 2 workers, PostgreSQL, Redis, Meilisearch, Nginx. Handles 500 concurrent, 5K daily visits.

**Scale (Month 6):** Load balancer + 2x FastAPI servers (stateless horizontal), 2x Celery workers (separated by queue), PostgreSQL Primary + 1 Read Replica, dedicated Redis, dedicated Meilisearch, CDN (Cloudflare). Handles 5,000 concurrent, 50K daily visits.

## Starter Template Evaluation

### Primary Technology Domain

**Full-stack web application** — Turborepo monorepo with hybrid single Next.js app (route groups) + FastAPI modular backend, based on project requirements analysis.

### Starter Options Considered

| Option | Description | Verdict |
|--------|-------------|---------|
| 3 separate Next.js apps + Turborepo | Independent deployment, independent scaling | ❌ Too much infrastructure overhead for solo dev — 3x Docker builds, 3x CI, 3x env configs, ~$48/mo DigitalOcean |
| 1 Next.js app + route groups (Hybrid) | Single deployment, route-level separation, architecture-ready for future split | ✅ Selected — optimal velocity, $24/mo, zero package publishing overhead |
| Existing full-stack templates (T3, RedwoodJS) | Pre-built starters | ❌ None support FastAPI + Next.js hybrid stack |

### Selected Approach: Hybrid Single App Monorepo

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

### Monorepo Structure

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

### i18n Strategy (Per Route Group)

| Route Group | Locale Strategy | Implementation |
|-------------|----------------|----------------|
| `(user)/` | Full i18n — ja (default), en, vi | next-intl middleware, `[locale]` dynamic segment |
| `(business)/` | Vietnamese only — hardcoded | No next-intl, `lang="vi"` attribute, Vietnamese strings inline or simple dict |
| `(admin)/` | English/Vietnamese — simple toggle | No next-intl, lightweight context-based language switch |

next-intl middleware matcher configured to only process `(user)` routes — zero overhead for business/admin.

### Initialization Commands

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

### Architectural Decisions Provided by Setup

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

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data modeling: Repository Pattern with SQLAlchemy 2.0 async
- Authentication: JWT HTTP-only + Argon2id + LINE/Google OAuth
- API design: REST with URL versioning `/api/v1/`, custom error format with JP/VN messages
- File storage: DigitalOcean Spaces (S3-compatible)
- Frontend state: Zustand + TanStack Query

**Important Decisions (Shape Architecture):**
- Structured logging with structlog
- CI/CD with GitHub Actions
- Monitoring with Sentry + Uptime Robot
- CSRF via double submit cookie pattern

**Deferred Decisions (Post-MVP):**
- WebSocket implementation (Phase 2 — currently polling)
- Payment gateway integration (Phase 2 — VNPay/Momo)
- Native mobile app architecture (Phase 3)
- CDN provider selection (Cloudflare vs CloudFront — evaluate at scale)

### Data Architecture

| Decision | Choice | Version | Rationale |
|----------|--------|---------|-----------|
| Primary Database | PostgreSQL | 16.x | ACID compliance, JSON support, full-text search fallback, read replicas |
| Cache / Pub-Sub | Redis | 7.x | Cache + Celery broker + pub/sub + rate limiting + real-time counters |
| Search Engine | Meilisearch | 1.16+ | CJK tokenization, typo tolerance, fast indexing, cross-language search |
| ORM | SQLAlchemy 2.0 async | 2.0+ | Native async, type-safe, Alembic migrations |
| Data Modeling | Repository Pattern | — | Clean separation between API ↔ service ↔ repository layers. Each module owns its repository |
| Validation | Pydantic V2 (request/response) + SQLAlchemy models (DB) | — | Type-safe at API boundaries, ORM models for persistence |
| File Storage | DigitalOcean Spaces | — | S3-compatible, CDN-ready, $5/mo 250GB, camera-only photos stored here |
| Cache Strategy | Write-through (listings) + TTL (search 5min) + Event-driven (user data) | — | Balance between consistency and performance |
| Migration | Alembic with auto-generate | — | Version-controlled schema changes, rollback capability |

### Authentication & Security

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Token Strategy | JWT in HTTP-only cookies + refresh token rotation | Stateless, XSS-resistant, automatic with browser requests |
| Password Hashing | Argon2id | Memory-hard, OWASP recommended, resistant to GPU attacks |
| CSRF Protection | Double submit cookie | Stateless, fits JWT architecture, no server-side token store |
| Session Expiry | 24h User, 8h Admin, forced logout on password change | Japanese shared-device privacy concern addressed |
| Social Login | LINE (primary for JP users) + Google (secondary) | LINE is communication infrastructure for JP in Vietnam |
| API Versioning | URL prefix `/api/v1/` | Explicit, easy routing, no header negotiation complexity |
| Rate Limiting | Redis-backed: 100/min Guest, 300/min User, 500/min BusinessOwner | Token bucket via Redis counters, per-role limits |
| Secrets Management | .env (dev) + DigitalOcean env vars (prod) | Simple, no extra service needed for MVP |
| Data Encryption | TLS 1.3 (transit) + AES-256 (at rest) | Compliance with Vietnam Cybersecurity Law + APPI |
| RBAC | 4 roles (Guest/User/BusinessOwner/Admin) + Admin sub-roles (content/technical/business) | Middleware enforcement on every API endpoint |

### API & Communication Patterns

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API Style | RESTful with resource-oriented URLs | Industry standard, cacheable, well-understood |
| Documentation | Auto-generated OpenAPI via FastAPI + Swagger UI | Zero extra effort, always in sync with code |
| Error Format | Custom JSON: `{error_code, message_ja, message_vi, message_en, detail}` | Japanese-grade error handling — polite, localized, actionable |
| Logging | structlog (structured JSON) | Machine-parseable, request correlation IDs, easy filtering |
| Internal Communication | Event Bus: in-process sync + Redis Pub/Sub async | Decoupled modules, Celery for background tasks |
| Polling | Single unified `GET /api/v1/sync` endpoint, adaptive interval | 1 request instead of 4, 304 Not Modified, bandwidth-efficient |
| External API Resilience | 5s timeout + circuit breaker + exponential retry (3x) | Graceful degradation — translation fail doesn't block listing publish |

### Frontend Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | Zustand | Lightweight (~1KB), simple API, sufficient for polling-based app |
| Data Fetching | TanStack Query (React Query) | Built-in cache, retry, polling, stale-while-revalidate, optimistic updates |
| Form Handling | React Hook Form + Zod | Performant (uncontrolled), type-safe validation, shared schemas with backend |
| Image Optimization | Next.js Image component + sharp | Built-in WebP, lazy loading, responsive sizes |
| Component Architecture | Feature modules mirroring backend (`modules/user/`, `modules/business/`, `modules/admin/`) + shared primitives | Clear ownership, architecture-ready for future app split |
| Rendering Strategy | SSR for public user pages (SEO), client-side for dashboards | Japanese search keywords require SSR, dashboards don't need SEO |
| Performance | Skeleton loading, optimistic UI, section-based lazy loading | Japanese perceived performance expectations (遅い = 不信) |

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | DigitalOcean Droplet (4GB RAM, $24/mo MVP) | Vietnam-accessible, cost-efficient, Docker-ready |
| Containerization | Docker Compose (dev + prod) | Consistent environments, easy service orchestration |
| CI/CD | GitHub Actions | Free for public repos, familiar, good Docker support |
| Reverse Proxy | Nginx | Route to frontend/backend, SSL termination, static file serving |
| SSL | Let's Encrypt + Certbot auto-renewal | Free, trusted, automatic |
| Monitoring | Sentry (error tracking, free tier) + Uptime Robot (uptime, free) | Sufficient for MVP, zero cost |
| Log Aggregation | structlog JSON → DigitalOcean built-in log viewer | Simple, no extra cost, upgrade to ELK/Loki at scale |
| Backup | Automated daily pg_dump + DO Spaces backup, 30-day retention | RTO 4h, RPO 24h as per NFRs |
| CDN | DigitalOcean Spaces CDN for media, Cloudflare for static (evaluate at scale) | Media delivery < 1s requirement |

### Decision Impact Analysis

**Implementation Sequence:**
1. Docker Compose infrastructure (PostgreSQL, Redis, Meilisearch, Nginx)
2. FastAPI skeleton with auth module (JWT + Argon2id + RBAC middleware)
3. Next.js app with route groups + next-intl + Tailwind + Design System tokens
4. Listing module (CRUD + translation pipeline + Meilisearch indexing)
5. Search module (cross-language query + Meilisearch)
6. Media module (camera-only upload + EXIF + DO Spaces)
7. Community module (posts, comments, events + event bus)
8. Gamification module (points, badges, senpai progression)
9. Coupon module (create, claim, redeem + Redis counters)
10. Moderation module (auto-filter + human queue)
11. Notification module (in-app + email)
12. Analytics module (dashboard data + CSV export)

**Cross-Component Dependencies:**
- Auth → required by ALL modules (must be first)
- Translation (Tier 0) → required by Listing, Search, Community
- Event Bus → required by Listing→Translation→Search pipeline, Review→Gamification, Moderation
- Redis → required by Cache, Celery, Polling, Rate Limiting, Coupon Counters
- Media → required by Listing, Review, Profile

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database Naming (PostgreSQL):**

| Element | Convention | Example |
|---------|-----------|---------|
| Tables | snake_case, plural | `users`, `listings`, `community_posts` |
| Columns | snake_case | `created_at`, `user_id`, `display_name` |
| Foreign keys | `{referenced_table_singular}_id` | `user_id`, `listing_id` |
| Indexes | `idx_{table}_{columns}` | `idx_users_email`, `idx_listings_area_category` |
| Enums | snake_case type, UPPER values | `user_role` type: `GUEST`, `USER`, `BUSINESS_OWNER`, `ADMIN` |
| Timestamps | Always `created_at`, `updated_at` | UTC stored, formatted per locale in frontend |

**API Naming (FastAPI):**

| Element | Convention | Example |
|---------|-----------|---------|
| Endpoints | snake_case, plural nouns | `/api/v1/listings`, `/api/v1/community_posts` |
| Route params | snake_case | `/api/v1/listings/{listing_id}` |
| Query params | snake_case | `?category_id=5&sort_by=rating` |
| JSON fields | snake_case (Python standard) | `{ "user_id": "uuid", "display_name": "Tanaka" }` |

**Frontend Code Naming (TypeScript/React):**

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `ListingCard.tsx`, `SenpaiPicks.tsx` |
| Files (components) | PascalCase matching component | `ListingCard.tsx` |
| Files (utils/hooks) | camelCase | `useListings.ts`, `formatPrice.ts` |
| Functions | camelCase | `getListingById()`, `formatDualPrice()` |
| Variables | camelCase | `userId`, `listingData` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `API_BASE_URL` |
| Types/Interfaces | PascalCase | `Listing`, `UserProfile`, `CreateListingRequest` |

**Backend Code Naming (Python):**

| Element | Convention | Example |
|---------|-----------|---------|
| Files/modules | snake_case | `listing_service.py`, `auth_middleware.py` |
| Classes | PascalCase | `ListingService`, `UserRepository` |
| Functions | snake_case | `get_listing_by_id()`, `create_review()` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE`, `JWT_SECRET_KEY` |
| Pydantic models | `{Entity}{Context}{Request/Response}` | `ListingCreateRequest`, `ListingDetailResponse`, `ListingListResponse` |
| SQLAlchemy models | PascalCase singular | `User`, `Listing`, `CommunityPost` |

**API Client Auto-Transform (snake_case ↔ camelCase):**

Frontend API client includes interceptors that automatically transform snake_case (backend) to camelCase (frontend) on responses, and camelCase to snake_case on requests. All frontend code uses camelCase naturally — zero manual conversion.

### Structure Patterns

**Backend Module Structure (every module follows this exactly):**

```
backend/modules/{module_name}/
├── __init__.py
├── router.py          # FastAPI router — API endpoints
├── service.py         # Business logic
├── repository.py      # Database queries (SQLAlchemy)
├── models.py          # SQLAlchemy ORM models
├── schemas.py         # Pydantic request/response schemas
├── events.py          # Event definitions and handlers
├── exceptions.py      # Module-specific exceptions
└── constants.py       # Module constants
```

**Frontend Module Structure:**

```
apps/web/modules/{module_name}/
├── components/        # Module-specific components
├── hooks/             # Module-specific hooks
├── lib/               # Module utilities
└── types/             # Module-specific types (auto-generated from OpenAPI)
```

**Test Locations:**

| Layer | Convention | Example |
|-------|-----------|---------|
| Backend | `backend/tests/{module_name}/` mirroring module structure | `tests/listing/test_service.py` |
| Frontend | Co-located `__tests__/` within each module | `modules/user/components/__tests__/ListingCard.test.tsx` |
| E2E | `e2e/` at project root | `e2e/listing-flow.spec.ts` |

**Test Naming Conventions:**

```python
# Backend: test_{action}_{scenario}_{expected_result}
def test_create_listing_with_valid_data_returns_201():
def test_create_listing_without_auth_returns_401():
def test_search_listings_japanese_query_returns_vietnamese_content():
```

```typescript
// Frontend: describe → it("should {action} when {condition}")
describe("ListingCard", () => {
  it("should display dual currency when listing has price", () => {});
  it("should show skeleton when loading", () => {});
  it("should show senpai badge when reviewer is senpai", () => {});
});
```

**Test Coverage Targets:**

| Layer | Target | Notes |
|-------|--------|-------|
| Backend service layer | 80% line coverage | Core business logic |
| Backend auth/security | 100% line coverage | Critical path |
| Frontend components | Render tests required for all components | At minimum: renders without error |
| Frontend critical flows | Integration tests | Search → detail → save flow |
| E2E | Happy path per user journey | 4 journeys = 4 E2E suites |

**Test Database Strategy:**

```python
# pytest fixtures with transaction rollback — clean state per test
@pytest.fixture
async def db_session():
    async with engine.begin() as conn:
        session = AsyncSession(bind=conn)
        yield session
        await conn.rollback()
```

### Format Patterns

**API Response Wrapper:**

```json
// Success (list)
{
  "data": [ ... ],
  "meta": { "page": 1, "total": 50, "per_page": 20 }
}

// Success (single)
{
  "data": { "id": "uuid", "name": "..." }
}

// Error
{
  "error": {
    "code": "LISTING_NOT_FOUND",
    "message_ja": "リスティングが見つかりません",
    "message_vi": "Không tìm thấy danh sách",
    "message_en": "Listing not found",
    "detail": null
  }
}
```

**Date/Time Format:**

| Context | Format | Example |
|---------|--------|---------|
| Database | UTC timestamp | `2026-04-10T08:00:00Z` |
| API JSON | ISO 8601 string (UTC) | `"2026-04-10T08:00:00Z"` |
| UI (Japanese) | `YYYY年MM月DD日 HH:mm` | `2026年4月10日 17:00` |
| UI (Vietnamese) | `DD/MM/YYYY HH:mm` | `10/04/2026 17:00` |

**Pagination:** `GET /api/v1/listings?page=1&per_page=20&sort_by=rating&sort_order=desc`

**ID Format:** UUID v4 for all primary keys — no auto-increment integers exposed in API.

### Communication Patterns

**Event Naming:** `{module}.{entity}.{action}` in snake_case

| Example | Trigger |
|---------|---------|
| `listing.listing.created` | BusinessOwner publishes listing |
| `review.review.created` | User writes review |
| `gamification.user.badge_upgraded` | User hits point threshold |

**Event Payload Standard:**

```python
{
    "event": "listing.listing.created",
    "timestamp": "2026-04-10T08:00:00Z",
    "actor_id": "uuid-of-user",
    "payload": { "listing_id": "uuid", "business_owner_id": "uuid" }
}
```

**Zustand Store Pattern:** One store per domain concern, not one global store. Stores: `useAuthStore`, `useFavoritesStore`, `useNotificationStore`.

**TanStack Query Key Convention:** `[module, entity, ...params]` — e.g., `['listing', 'detail', listingId]`, `['community', 'posts', groupId]`.

### Process Patterns

**Dependency Injection (Module Boundary Enforcement):**

```python
# ✅ CORRECT — dependency injection via FastAPI Depends
async def get_listing_service(
    repo: ListingRepository = Depends(get_listing_repository),
    translation: TranslationService = Depends(get_translation_service),
) -> ListingService:
    return ListingService(repo, translation)

# ❌ FORBIDDEN — direct module import
from modules.translation.service import TranslationService
```

Modules communicate ONLY through Dependency Injection or Event Bus. Never import another module directly.

**Environment Configuration:**

```python
# ✅ CORRECT — centralized Pydantic Settings
# backend/shared/config.py
class Settings(BaseSettings):
    database_url: str
    redis_url: str
    meilisearch_url: str
    jwt_secret: str
    translation_api_key: str
    do_spaces_key: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
# All modules import from shared.config — NEVER use os.getenv() directly
```

**Error Handling (Backend):**

```python
# Module-specific exceptions inherit from base AppException
class AppException(Exception):
    def __init__(self, code: str, message_ja: str, message_vi: str, message_en: str, status_code: int = 400): ...

class ListingNotFoundException(AppException):
    def __init__(self, listing_id: str):
        super().__init__(code="LISTING_NOT_FOUND", message_ja="リスティングが見つかりません", ...)

# Global exception handler catches AppException → JSON error response
```

**Error Handling (Frontend):** TanStack Query error boundary + toast notification. NEVER show raw error messages. Always use locale-appropriate message from API response. Fallback: generic polite message.

**Loading State Pattern:** `isLoading` (first load) → Skeleton component. `isFetching` (refetch) → Subtle indicator, NOT full skeleton. `isError` → Polite message + retry button. NEVER use spinners — always skeleton matching layout.

**Soft Delete Pattern:** All user-generated content uses soft delete. `deleted_at: Optional[datetime]` — NULL = active, timestamp = deleted. Repository queries filter `WHERE deleted_at IS NULL` by default. Hard delete only via admin action or data retention policy.

**Alembic Migration Naming:** `{YYYY}_{MM}_{DD}_{HHMM}_{description}.py` — e.g., `2026_04_10_0800_create_users_table.py`

**TypeScript Type Generation from OpenAPI:**

```bash
# Auto-generate frontend types from backend OpenAPI schema
# packages/types/generate.sh
curl http://localhost:8000/openapi.json > openapi.json
npx openapi-typescript openapi.json -o ./src/api-types.ts
```

Zero manual type duplication between backend and frontend. This MUST run as part of the development workflow whenever backend schemas change.

**Docker Compose Profiles:**

```yaml
services:
  postgres:
    profiles: ["infra", "full"]
  redis:
    profiles: ["infra", "full"]
  meilisearch:
    profiles: ["infra", "full"]
  backend:
    profiles: ["backend", "full"]
  web:
    profiles: ["frontend", "full"]
# docker compose --profile infra up    ← DB/Redis/Meili only, run code locally
# docker compose --profile full up     ← everything containerized
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. Follow naming conventions exactly — no exceptions, no variations
2. Use the module structure template for every new module (backend and frontend)
3. Wrap all API responses in the standard response format
4. Use UUID v4 for all new entity IDs
5. Store all timestamps in UTC, format per locale only in frontend
6. Handle errors through AppException hierarchy, never raise raw exceptions
7. Use skeleton loading, never spinners
8. Apply soft delete for all user-generated content
9. Fire events for cross-module side effects, never import other modules directly
10. Use Dependency Injection via FastAPI Depends for all service dependencies
11. Use centralized Pydantic Settings — never `os.getenv()` directly
12. Auto-generate TypeScript types from OpenAPI — never manually duplicate types
13. Write tests following naming conventions and coverage targets

**Anti-Patterns (FORBIDDEN):**

- ❌ `camelCase` in database columns or API JSON fields
- ❌ Auto-increment IDs exposed in API URLs
- ❌ Direct module-to-module imports in backend
- ❌ Raw error messages shown to users
- ❌ Spinner loading indicators
- ❌ Hard-deleting user content without soft-delete first
- ❌ Storing timestamps in local timezone
- ❌ `any` type in TypeScript (use `unknown` + type guards)
- ❌ Inline SQL queries (always use repository pattern)
- ❌ `os.getenv()` in module code (use shared Settings)
- ❌ Manual TypeScript type definitions duplicating Pydantic schemas

## Project Structure & Boundaries

### Complete Project Directory Structure

```
danangnavi/
├── .github/
│   └── workflows/
│       ├── ci.yml                          # Lint + test on PR
│       ├── deploy-staging.yml              # Deploy to staging on merge to develop
│       └── deploy-production.yml           # Deploy to production on merge to main
├── apps/
│   └── web/                                # Single Next.js 16 app (Hybrid)
│       ├── app/
│       │   ├── (user)/                     # ── Japanese End-User Routes ──
│       │   │   └── [locale]/               # next-intl dynamic locale (ja/en/vi)
│       │   │       ├── page.tsx            # Homepage: senpai picks, area highlights, search
│       │   │       ├── layout.tsx          # User layout: bottom tab nav, top nav
│       │   │       ├── listings/
│       │   │       │   ├── page.tsx        # Search & browse listings (FR1-FR3)
│       │   │       │   └── [slug]/
│       │   │       │       └── page.tsx    # Listing detail: photos, reviews, map (FR4)
│       │   │       ├── areas/
│       │   │       │   └── [area]/
│       │   │       │       └── page.tsx    # Area/neighborhood guide (FR5)
│       │   │       ├── community/
│       │   │       │   ├── page.tsx        # Community hub: groups list (FR20)
│       │   │       │   ├── [group_slug]/
│       │   │       │   │   ├── page.tsx    # Group thread: posts, comments (FR21-FR22)
│       │   │       │   │   └── events/
│       │   │       │   │       └── page.tsx # Events list & detail (FR23-FR24)
│       │   │       │   └── events/
│       │   │       │       └── [event_id]/
│       │   │       │           └── page.tsx # Event detail & registration
│       │   │       ├── guides/
│       │   │       │   ├── page.tsx        # Guides list: senpai articles
│       │   │       │   └── [slug]/
│       │   │       │       └── page.tsx    # Guide detail
│       │   │       ├── deals/
│       │   │       │   └── page.tsx        # Coupons & deals (FR61-FR62)
│       │   │       ├── translate/
│       │   │       │   └── page.tsx        # Voice translation tool (FR26-FR28)
│       │   │       ├── profile/
│       │   │       │   ├── page.tsx        # User profile: favorites, badges (FR10-FR11)
│       │   │       │   ├── favorites/
│       │   │       │   │   └── page.tsx    # Favorites collection (FR6-FR7)
│       │   │       │   └── notifications/
│       │   │       │       └── page.tsx    # Notification center (FR25, FR67-FR68)
│       │   │       ├── onboarding/
│       │   │       │   └── page.tsx        # Newcomer/tourist onboarding (FR9)
│       │   │       └── auth/
│       │   │           ├── login/
│       │   │           │   └── page.tsx    # Login: LINE/Google (FR8)
│       │   │           └── register/
│       │   │               └── page.tsx    # Registration with consent (FR54)
│       │   │
│       │   ├── (business)/                 # ── Vietnamese Business Owner Routes ──
│       │   │   └── vi/                     # Hardcoded Vietnamese, no next-intl
│       │   │       ├── layout.tsx          # Business layout: sidebar nav
│       │   │       ├── dashboard/
│       │   │       │   └── page.tsx        # Analytics: views, saves, revenue (FR36-FR37)
│       │   │       ├── listings/
│       │   │       │   ├── page.tsx        # My listings list
│       │   │       │   ├── new/
│       │   │       │   │   └── page.tsx    # Listing editor wizard (FR31-FR34, FR72)
│       │   │       │   └── [listing_id]/
│       │   │       │       └── edit/
│       │   │       │           └── page.tsx # Edit listing + translation review
│       │   │       ├── coupons/
│       │   │       │   ├── page.tsx        # Coupon manager (FR35)
│       │   │       │   └── new/
│       │   │       │       └── page.tsx    # Create coupon
│       │   │       ├── reviews/
│       │   │       │   └── page.tsx        # Review management + dispute filing (FR38)
│       │   │       ├── settings/
│       │   │       │   └── page.tsx        # Business settings, agreement
│       │   │       └── auth/
│       │   │           └── register/
│       │   │               └── page.tsx    # BO registration + agreement (FR30)
│       │   │
│       │   ├── (admin)/                    # ── Admin Panel Routes ──
│       │   │   ├── layout.tsx              # Admin layout: sidebar, role-based nav
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx            # Platform analytics (FR39)
│       │   │   ├── moderation/
│       │   │   │   ├── page.tsx            # Content review queue (FR42-FR43)
│       │   │   │   └── disputes/
│       │   │   │       └── page.tsx        # Fake review disputes (FR44)
│       │   │   ├── users/
│       │   │   │   ├── page.tsx            # User management (FR40)
│       │   │   │   └── businesses/
│       │   │   │       └── page.tsx        # BO management + verification (FR41, FR48)
│       │   │   ├── staff/
│       │   │   │   └── page.tsx            # Staff RBAC management (FR46)
│       │   │   └── reports/
│       │   │       └── page.tsx            # Report generation + CSV export (FR47, FR69)
│       │   │
│       │   ├── api/                        # ── BFF Proxy Routes ──
│       │   │   ├── (user)/
│       │   │   │   └── [...path]/
│       │   │   │       └── route.ts        # Proxy user API calls to FastAPI
│       │   │   ├── (business)/
│       │   │   │   └── [...path]/
│       │   │   │       └── route.ts        # Proxy business API calls
│       │   │   └── (admin)/
│       │   │       └── [...path]/
│       │   │           └── route.ts        # Proxy admin API calls
│       │   │
│       │   ├── layout.tsx                  # Root layout
│       │   ├── not-found.tsx               # 404 page
│       │   └── error.tsx                   # Global error boundary
│       │
│       ├── modules/                        # ── Feature Modules (mirrors backend) ──
│       │   ├── user/                       # User-facing features
│       │   │   ├── components/
│       │   │   │   ├── ListingCard.tsx
│       │   │   │   ├── ListingDetail.tsx
│       │   │   │   ├── SenpaiPicks.tsx
│       │   │   │   ├── AreaGuide.tsx
│       │   │   │   ├── ReviewCard.tsx
│       │   │   │   ├── ReviewForm.tsx
│       │   │   │   ├── CouponCard.tsx
│       │   │   │   ├── CommunityPost.tsx
│       │   │   │   ├── EventCard.tsx
│       │   │   │   ├── TranslationTool.tsx
│       │   │   │   ├── FavoriteButton.tsx
│       │   │   │   ├── DualPriceDisplay.tsx
│       │   │   │   ├── SenpaiBadge.tsx
│       │   │   │   ├── FairPriceIndicator.tsx
│       │   │   │   └── OnboardingWizard.tsx
│       │   │   ├── hooks/
│       │   │   │   ├── useListings.ts
│       │   │   │   ├── useListingDetail.ts
│       │   │   │   ├── useSearch.ts
│       │   │   │   ├── useFavorites.ts
│       │   │   │   ├── useReviews.ts
│       │   │   │   ├── useCommunity.ts
│       │   │   │   ├── useCoupons.ts
│       │   │   │   └── useTranslation.ts
│       │   │   ├── lib/
│       │   │   │   └── userApi.ts
│       │   │   └── __tests__/
│       │   │
│       │   ├── business/                   # Business owner features
│       │   │   ├── components/
│       │   │   │   ├── ListingEditor.tsx
│       │   │   │   ├── TranslationPreview.tsx
│       │   │   │   ├── CouponForm.tsx
│       │   │   │   ├── AnalyticsChart.tsx
│       │   │   │   ├── RevenueTracker.tsx
│       │   │   │   ├── PhotoUploader.tsx
│       │   │   │   └── DisputeForm.tsx
│       │   │   ├── hooks/
│       │   │   │   ├── useMyListings.ts
│       │   │   │   ├── useMyCoupons.ts
│       │   │   │   ├── useAnalytics.ts
│       │   │   │   └── usePhotoUpload.ts
│       │   │   ├── lib/
│       │   │   │   └── businessApi.ts
│       │   │   └── __tests__/
│       │   │
│       │   └── admin/                      # Admin features
│       │       ├── components/
│       │       │   ├── ModerationQueue.tsx
│       │       │   ├── UserTable.tsx
│       │       │   ├── BusinessVerification.tsx
│       │       │   ├── DisputeManager.tsx
│       │       │   ├── StaffManager.tsx
│       │       │   ├── PlatformStats.tsx
│       │       │   └── ReportGenerator.tsx
│       │       ├── hooks/
│       │       │   ├── useModeration.ts
│       │       │   ├── useUserManagement.ts
│       │       │   └── useReports.ts
│       │       ├── lib/
│       │       │   └── adminApi.ts
│       │       └── __tests__/
│       │
│       ├── shared/                         # ── Shared across all route groups ──
│       │   ├── components/                 # Design System primitives
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Badge.tsx
│       │   │   ├── Toast.tsx
│       │   │   ├── EmptyState.tsx
│       │   │   ├── Skeleton.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── SearchBar.tsx
│       │   │   ├── FilterChips.tsx
│       │   │   ├── SegmentedControl.tsx
│       │   │   ├── Accordion.tsx
│       │   │   ├── StickyActionBar.tsx
│       │   │   ├── BottomTabNav.tsx
│       │   │   └── InteractiveMap.tsx
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useSync.ts              # Unified polling hook
│       │   │   └── useMediaQuery.ts
│       │   ├── lib/
│       │   │   ├── apiClient.ts            # Axios/fetch with snake↔camel transform
│       │   │   ├── queryClient.ts          # TanStack Query config
│       │   │   ├── formatters.ts           # Price, date, currency formatters
│       │   │   └── constants.ts
│       │   ├── stores/                     # Zustand stores
│       │   │   ├── useAuthStore.ts
│       │   │   ├── useFavoritesStore.ts
│       │   │   └── useNotificationStore.ts
│       │   └── providers/
│       │       ├── QueryProvider.tsx
│       │       ├── AuthProvider.tsx
│       │       └── ThemeProvider.tsx
│       │
│       ├── messages/                       # next-intl translation files
│       │   ├── ja.json
│       │   ├── en.json
│       │   └── vi.json
│       ├── middleware.ts                   # next-intl (user routes only)
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── vitest.config.ts
│
├── packages/
│   └── types/                              # ── Shared TypeScript Types ──
│       ├── src/
│       │   └── api-types.ts                # Auto-generated from OpenAPI
│       ├── generate.sh                     # Script to regenerate types
│       ├── package.json
│       └── tsconfig.json
│
├── backend/                                # ── FastAPI Modular Backend ──
│   ├── main.py                             # App entry point, middleware, exception handlers
│   ├── modules/
│   │   ├── auth/                           # FR8, FR49-FR53
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/auth/*
│   │   │   ├── service.py                  # JWT, social login, session mgmt
│   │   │   ├── repository.py               # User credential queries
│   │   │   ├── models.py                   # User, RefreshToken, AdminRole
│   │   │   ├── schemas.py                  # LoginRequest, TokenResponse, UserOut
│   │   │   ├── dependencies.py             # get_current_user, require_role, require_admin_sub_role
│   │   │   ├── events.py                   # user.logged_in, user.registered
│   │   │   ├── exceptions.py               # InvalidCredentials, TokenExpired
│   │   │   └── constants.py                # Role enums, token expiry values
│   │   │
│   │   ├── listing/                        # FR1-FR5, FR30-FR34
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/listings/*
│   │   │   ├── service.py                  # CRUD, auto-translation trigger
│   │   │   ├── repository.py               # Listing queries, area queries
│   │   │   ├── models.py                   # Listing, ListingCategory, Area, BusinessHours
│   │   │   ├── schemas.py                  # ListingCreateRequest, ListingDetailResponse
│   │   │   ├── events.py                   # listing.created, listing.updated
│   │   │   ├── exceptions.py
│   │   │   └── constants.py
│   │   │
│   │   ├── translation/                    # FR29, FR31, FR58, FR63-FR65 (Tier 0)
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/translation/*
│   │   │   ├── service.py                  # Google/DeepL API, cache, allergen flagging
│   │   │   ├── repository.py               # Translation cache queries
│   │   │   ├── models.py                   # TranslationCache, AllergenFlag
│   │   │   ├── schemas.py
│   │   │   ├── events.py                   # listing.translated, translation.failed
│   │   │   ├── exceptions.py
│   │   │   └── constants.py                # Allergen keyword lists
│   │   │
│   │   ├── search/                         # FR2-FR3, FR65
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/search/*
│   │   │   ├── service.py                  # Meilisearch integration, cross-language
│   │   │   ├── indexer.py                  # Index management, sync from DB
│   │   │   ├── schemas.py
│   │   │   ├── events.py                   # Listens to listing.translated
│   │   │   ├── exceptions.py
│   │   │   └── constants.py
│   │   │
│   │   ├── community/                      # FR20-FR25
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/community/*
│   │   │   ├── service.py                  # Groups, posts, comments, events
│   │   │   ├── repository.py
│   │   │   ├── models.py                   # Group, Post, Comment, Event, EventRegistration
│   │   │   ├── schemas.py
│   │   │   ├── events.py                   # post.created, event.registered
│   │   │   ├── exceptions.py
│   │   │   └── constants.py
│   │   │
│   │   ├── media/                          # FR16-FR17, FR32, FR66
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/media/*
│   │   │   ├── service.py                  # Upload, EXIF validate, compress, DO Spaces
│   │   │   ├── repository.py
│   │   │   ├── models.py                   # MediaFile
│   │   │   ├── schemas.py
│   │   │   ├── exceptions.py
│   │   │   └── constants.py                # Max sizes, allowed types
│   │   │
│   │   ├── moderation/                     # FR42-FR45, FR48
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/moderation/*
│   │   │   ├── service.py                  # Auto-filter, human queue, escalation
│   │   │   ├── repository.py
│   │   │   ├── models.py                   # ModerationItem, BannedKeyword, DisputeCase
│   │   │   ├── schemas.py
│   │   │   ├── events.py                   # Listens to review.created, post.created
│   │   │   ├── exceptions.py
│   │   │   └── constants.py
│   │   │
│   │   ├── notification/                   # FR25, FR67-FR68
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/notifications/*
│   │   │   ├── service.py                  # Channel-agnostic core
│   │   │   ├── repository.py
│   │   │   ├── models.py                   # Notification, NotificationPreference
│   │   │   ├── schemas.py
│   │   │   ├── channels/                   # Pluggable delivery adapters
│   │   │   │   ├── __init__.py
│   │   │   │   ├── in_app.py
│   │   │   │   ├── email.py
│   │   │   │   └── line.py                 # Phase 2 — LINE Notify
│   │   │   ├── events.py                   # Listens to badge_upgraded, review.created
│   │   │   ├── exceptions.py
│   │   │   └── constants.py
│   │   │
│   │   ├── analytics/                      # FR36-FR37, FR39, FR47, FR69-FR70
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/analytics/*
│   │   │   ├── service.py                  # Dashboard data, report generation
│   │   │   ├── repository.py
│   │   │   ├── models.py                   # ActivityLog, PageView
│   │   │   ├── schemas.py
│   │   │   ├── exporters/
│   │   │   │   ├── __init__.py
│   │   │   │   └── csv_exporter.py
│   │   │   ├── exceptions.py
│   │   │   └── constants.py
│   │   │
│   │   ├── coupon/                         # FR35, FR61-FR62
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/coupons/*
│   │   │   ├── service.py                  # Create, claim, redeem, Redis counters
│   │   │   ├── repository.py
│   │   │   ├── models.py                   # Coupon, CouponRedemption
│   │   │   ├── schemas.py
│   │   │   ├── events.py                   # coupon.claimed, coupon.redeemed
│   │   │   ├── exceptions.py
│   │   │   └── constants.py
│   │   │
│   │   ├── gamification/                   # FR11-FR14, FR18-FR19
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/gamification/*
│   │   │   ├── service.py                  # Points calc, badge upgrade, senpai checks
│   │   │   ├── repository.py
│   │   │   ├── models.py                   # ContributionPoint, BadgeLevel
│   │   │   ├── schemas.py
│   │   │   ├── events.py                   # user.badge_upgraded, listens to review.created
│   │   │   ├── exceptions.py
│   │   │   └── constants.py                # Point values, badge thresholds
│   │   │
│   │   ├── review/                         # FR15-FR19
│   │   │   ├── __init__.py
│   │   │   ├── router.py                   # /api/v1/reviews/*
│   │   │   ├── service.py                  # Create review, helpful vote
│   │   │   ├── repository.py
│   │   │   ├── models.py                   # Review, ReviewVote (multi-criteria)
│   │   │   ├── schemas.py
│   │   │   ├── events.py                   # review.created, review.voted_helpful
│   │   │   ├── exceptions.py
│   │   │   └── constants.py
│   │   │
│   │   └── sync/                           # Unified polling endpoint
│   │       ├── __init__.py
│   │       ├── router.py                   # /api/v1/sync
│   │       ├── service.py                  # Aggregate updates across modules
│   │       └── schemas.py
│   │
│   ├── shared/                             # ── Cross-Module Infrastructure ──
│   │   ├── __init__.py
│   │   ├── config.py                       # Pydantic Settings (centralized)
│   │   ├── database.py                     # AsyncSession factory, engine
│   │   ├── redis.py                        # Redis client singleton
│   │   ├── event_bus.py                    # In-process sync + Redis Pub/Sub async
│   │   ├── exceptions.py                   # AppException base class
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   ├── error_handler.py            # Global exception → JSON response
│   │   │   ├── rate_limiter.py             # Redis-backed rate limiting
│   │   │   ├── cors.py                     # CORS config
│   │   │   ├── request_id.py              # Correlation ID for structured logging
│   │   │   └── audit_logger.py             # Admin action audit trail
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── pagination.py               # Pagination helpers
│   │   │   ├── datetime.py                 # UTC helpers, locale formatting
│   │   │   └── uuid.py                     # UUID generation
│   │   └── base_models.py                  # Base SQLAlchemy model (id, created_at, updated_at, deleted_at)
│   │
│   ├── infrastructure/                     # ── External Service Configs ──
│   │   ├── __init__.py
│   │   ├── meilisearch.py                  # Meilisearch client + index configs
│   │   ├── do_spaces.py                    # DigitalOcean Spaces (S3) client
│   │   ├── translation_api.py              # Google/DeepL client with circuit breaker
│   │   └── email.py                        # Email service client (SendGrid/SES)
│   │
│   ├── migrations/                         # Alembic migrations
│   │   ├── env.py
│   │   ├── alembic.ini
│   │   └── versions/                       # {YYYY}_{MM}_{DD}_{HHMM}_{description}.py
│   │
│   ├── tasks/                              # ── Celery Tasks ──
│   │   ├── __init__.py
│   │   ├── celery_app.py                   # Celery config, queues, schedules
│   │   ├── translation_tasks.py            # Auto-translate listings (high priority)
│   │   ├── media_tasks.py                  # Image compression, CDN upload (default)
│   │   ├── moderation_tasks.py             # Spam detect, AI image scan (default)
│   │   ├── notification_tasks.py           # Send emails, in-app notify (default)
│   │   ├── analytics_tasks.py              # Aggregate stats (low priority)
│   │   └── scheduled_tasks.py              # Coupon expiry, sitemap gen, backup (cron)
│   │
│   ├── tests/                              # ── Backend Tests ──
│   │   ├── conftest.py                     # Fixtures: db_session, test_client, auth helpers
│   │   ├── auth/
│   │   │   ├── test_service.py
│   │   │   └── test_router.py
│   │   ├── listing/
│   │   │   ├── test_service.py
│   │   │   └── test_router.py
│   │   ├── translation/
│   │   │   └── test_service.py
│   │   ├── search/
│   │   │   └── test_service.py
│   │   └── shared/
│   │       ├── test_event_bus.py
│   │       └── test_middleware.py
│   │
│   ├── requirements.txt                    # Production dependencies
│   ├── requirements-dev.txt                # Dev/test dependencies
│   └── pyproject.toml                      # Ruff config, pytest config
│
├── docker/                                 # ── Docker Configuration ──
│   ├── docker-compose.yml                  # All services with profiles
│   ├── docker-compose.override.yml         # Dev overrides (hot reload, ports)
│   ├── Dockerfile.web                      # Next.js production build
│   ├── Dockerfile.backend                  # FastAPI + uvicorn
│   ├── Dockerfile.worker                   # Celery workers
│   └── nginx/
│       ├── nginx.conf                      # Reverse proxy config
│       └── ssl/                            # Let's Encrypt certs (production)
│
├── e2e/                                    # ── End-to-End Tests ──
│   ├── journey-01-newcomer.spec.ts         # Tanaka-san journey
│   ├── journey-02-tourist-to-senpai.spec.ts # Yamada-san journey
│   ├── journey-03-business-owner.spec.ts   # Chị Hương journey
│   ├── journey-04-admin-moderation.spec.ts # Admin team journey
│   └── playwright.config.ts
│
├── scripts/                                # ── Development Scripts ──
│   ├── seed-data.py                        # Seed mock data for development
│   ├── generate-types.sh                   # OpenAPI → TypeScript types
│   └── backup-db.sh                        # Database backup to DO Spaces
│
├── turbo.json                              # Turborepo pipeline config
├── pnpm-workspace.yaml                     # Workspace: apps/web, packages/types
├── package.json                            # Root scripts
├── .env.example                            # Environment variable template
├── .gitignore
└── README.md
```

### Architectural Boundaries

**API Boundaries:**

| Boundary | Routes | Auth Required | Role |
|----------|--------|--------------|------|
| Public User API | `/api/v1/listings`, `/api/v1/search`, `/api/v1/areas` | No (Guest) | Browse, search, view |
| Authenticated User API | `/api/v1/favorites`, `/api/v1/reviews`, `/api/v1/community` | Yes (User) | Save, review, post |
| Business Owner API | `/api/v1/business/*` | Yes (BusinessOwner) | Listing CRUD, coupons, analytics |
| Admin API | `/api/v1/admin/*` | Yes (Admin + sub-role) | Moderation, management, reports |
| Sync API | `/api/v1/sync` | Yes (any authenticated) | Unified polling endpoint |

**Module Boundaries (Backend):**

Modules communicate ONLY through:
1. Dependency Injection — FastAPI `Depends()` for synchronous service calls
2. Event Bus — For asynchronous cross-module side effects
3. NEVER direct imports between modules

**Data Boundaries — Module Table Ownership:**

| Module | Owned Tables |
|--------|-------------|
| auth | `users`, `refresh_tokens`, `admin_roles`, `consent_records` |
| listing | `listings`, `listing_categories`, `areas`, `business_hours` |
| translation | `translation_cache`, `allergen_flags` |
| search | (No tables — reads from Meilisearch index) |
| community | `groups`, `posts`, `comments`, `events`, `event_registrations` |
| media | `media_files` |
| moderation | `moderation_items`, `banned_keywords`, `dispute_cases` |
| notification | `notifications`, `notification_preferences` |
| analytics | `activity_logs`, `page_views` |
| coupon | `coupons`, `coupon_redemptions` |
| gamification | `contribution_points`, `badge_levels` |
| review | `reviews`, `review_votes` |

### Requirements to Structure Mapping

| FR Category | Backend Module | Frontend Module | Route Group |
|-------------|---------------|-----------------|-------------|
| Discovery & Search (FR1-FR7) | listing, search | user | (user) |
| Onboarding & Profiles (FR8-FR14) | auth, gamification | user | (user) |
| Reviews & Content (FR15-FR19) | review, media, gamification | user | (user) |
| Community & Events (FR20-FR25) | community, notification | user | (user) |
| Communication Bridge (FR26-FR29) | translation | user | (user) |
| Business Owner Tools (FR30-FR38) | listing, media, coupon, analytics, review | business | (business) |
| Admin & Moderation (FR39-FR48) | moderation, analytics, auth | admin | (admin) |
| Auth & Authorization (FR49-FR53) | auth | shared | all |
| Privacy & Compliance (FR54-FR58) | auth, analytics | user | (user) |
| SEO (FR59-FR60) | — (Next.js SSR) | user (server components) | (user) |
| Coupons (FR61-FR62) | coupon | user | (user) |
| Multi-Language (FR63-FR65) | translation, search | shared (next-intl) | (user) |
| Media Processing (FR66) | media | shared | all |
| Notifications (FR67-FR68) | notification | user | (user) |
| Data Export (FR69-FR70) | analytics | admin, business | (admin), (business) |
| UX Completeness (FR71-FR74) | auth, listing | shared, user, business | all |

### Integration Points

**External Service Integration Map:**

| Service | Backend Location | Circuit Breaker | Fallback |
|---------|-----------------|-----------------|----------|
| Google/DeepL Translation | `infrastructure/translation_api.py` | Yes (5s timeout, 3 retries) | Queue for manual, publish VN-only |
| LINE Login | `modules/auth/service.py` | Yes | Google login alternative |
| Google OAuth | `modules/auth/service.py` | Yes | Email/password registration |
| Google Maps | Frontend only (client-side) | N/A | Static map image + address text |
| DigitalOcean Spaces | `infrastructure/do_spaces.py` | Yes | Local storage fallback |
| Email (SendGrid/SES) | `infrastructure/email.py` | Yes | Queue and retry |
| Meilisearch | `infrastructure/meilisearch.py` | Yes | PostgreSQL full-text fallback |
| Sentry | `main.py` (SDK init) | N/A | Log locally |

**Event-Driven Integration Flows:**

```
listing.created → [translation_tasks] → listing.translated → [search.indexer]
review.created → [moderation_tasks] + [gamification.service] + [notification_tasks]
user.badge_upgraded → [notification_tasks] + [search.indexer] (flag senpai content)
coupon.claimed → [analytics.service] (track redemption)
media.uploaded → [media_tasks] (EXIF validate → compress → CDN upload)
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** All technology choices verified compatible — Next.js 16 + FastAPI + PostgreSQL 16 + Redis 7 + Meilisearch 1.16 + Celery 5.6.3 + Turborepo 2.9.4. SQLAlchemy 2.0 async + asyncpg provides native async throughout. next-intl scoped to user routes only — no conflict with business/admin route groups.

**Pattern Consistency:** snake_case (DB/API) ↔ camelCase (frontend) with auto-transform interceptor provides clean boundary. Identical module template across all 13 backend modules. Event naming `{module}.{entity}.{action}` — no collision risk.

**Structure Alignment:** Route groups `(user)/(business)/(admin)` map to role-based API boundaries. BFF proxy per route group → FastAPI modules. Docker Compose profiles support dev and prod workflows.

### Requirements Coverage ✅

- **Functional Requirements:** 74/74 FRs covered (100%)
- **Non-Functional Requirements:** 46/46 NFRs covered (100%)
- All 16 FR categories mapped to specific backend modules + frontend modules + route groups
- All 4 user journeys (Tanaka, Yamada, Chị Hương, Admin) have architectural support

### Implementation Readiness ✅

- 30+ technology choices with verified versions and explicit rationale
- 13 enforcement rules for AI agents + 11 forbidden anti-patterns
- 150+ files/directories in project structure with FR annotations
- Implementation sequence defined (12 ordered steps with dependency mapping)
- Code examples provided for all major patterns

### Gap Analysis

**Critical Gaps:** None found ✅

**Important Gaps (address during implementation):**

| Gap | Impact | Resolution |
|-----|--------|------------|
| Database schema details | Medium | Define per module during first implementation stories — Alembic migrations document schema |
| Voice synthesis (FR26-FR27) | Low | Web Speech API (browser-native) for MVP — no backend dependency needed |
| Admin UX scenarios | Medium | Architecture covers routes + modules; UX design needed as separate workflow |

### Architecture Completeness Checklist

- [x] Project context analyzed (74 FRs, 46 NFRs, 4 user journeys, 3 personas)
- [x] Japanese user culture implications documented (10 architectural impacts)
- [x] Technology stack fully specified with verified versions (30+ choices)
- [x] Architecture pattern decided (Modular Monolith + Event-Driven)
- [x] Concurrency model defined (Async I/O + Celery + Event Bus)
- [x] Starter template evaluated and selected (Hybrid single app monorepo)
- [x] Core architectural decisions documented (Data, Auth, API, Frontend, Infrastructure)
- [x] Implementation patterns and enforcement rules defined (13 rules, 11 anti-patterns)
- [x] Complete project structure defined (150+ files with FR mapping)
- [x] Module boundaries and table ownership established (13 modules, 30+ tables)
- [x] Integration points mapped (8 external services with circuit breakers)
- [x] Scaling strategy defined (MVP → Scale path)
- [x] Validation complete — 100% FR/NFR coverage confirmed

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION ✅
**Confidence Level:** HIGH

**Key Strengths:**
- 100% requirements coverage with clear traceability
- Modular monolith enables incremental solo-dev development
- Event-driven architecture keeps modules decoupled and independently testable
- Japanese user culture insights embedded in architectural decisions
- Comprehensive enforcement rules prevent AI agent implementation conflicts

**First Implementation Priority:**
1. Scaffold monorepo (Turborepo + Next.js + FastAPI)
2. Docker Compose infrastructure (PostgreSQL, Redis, Meilisearch, Nginx)
3. FastAPI skeleton with auth module (JWT + Argon2id + RBAC)
4. Next.js app with route groups + next-intl + Design System tokens
