# Core Architectural Decisions

## Decision Priority Analysis

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

## Data Architecture

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

## Authentication & Security

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

## API & Communication Patterns

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API Style | RESTful with resource-oriented URLs | Industry standard, cacheable, well-understood |
| Documentation | Auto-generated OpenAPI via FastAPI + Swagger UI | Zero extra effort, always in sync with code |
| Error Format | Custom JSON: `{error_code, message_ja, message_vi, message_en, detail}` | Japanese-grade error handling — polite, localized, actionable |
| Logging | structlog (structured JSON) | Machine-parseable, request correlation IDs, easy filtering |
| Internal Communication | Event Bus: in-process sync + Redis Pub/Sub async | Decoupled modules, Celery for background tasks |
| Polling | Single unified `GET /api/v1/sync` endpoint, adaptive interval | 1 request instead of 4, 304 Not Modified, bandwidth-efficient |
| External API Resilience | 5s timeout + circuit breaker + exponential retry (3x) | Graceful degradation — translation fail doesn't block listing publish |

## Frontend Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | Zustand | Lightweight (~1KB), simple API, sufficient for polling-based app |
| Data Fetching | TanStack Query (React Query) | Built-in cache, retry, polling, stale-while-revalidate, optimistic updates |
| Form Handling | React Hook Form + Zod | Performant (uncontrolled), type-safe validation, shared schemas with backend |
| Image Optimization | Next.js Image component + sharp | Built-in WebP, lazy loading, responsive sizes |
| Component Architecture | Feature modules mirroring backend (`modules/user/`, `modules/business/`, `modules/admin/`) + shared primitives | Clear ownership, architecture-ready for future app split |
| Rendering Strategy | SSR for public user pages (SEO), client-side for dashboards | Japanese search keywords require SSR, dashboards don't need SEO |
| Performance | Skeleton loading, optimistic UI, section-based lazy loading | Japanese perceived performance expectations (遅い = 不信) |

## Infrastructure & Deployment

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

## Decision Impact Analysis

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
