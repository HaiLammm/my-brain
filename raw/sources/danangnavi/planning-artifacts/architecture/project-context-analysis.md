# Project Context Analysis

## Requirements Overview

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

## Technical Constraints & Dependencies

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

## Cross-Cutting Concerns Identified

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

## Japanese User Culture — Architectural Implications

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

## Architecture Pattern Decision

**Modular Monolith with Event-Driven Internal Communication**

Rationale: Solo developer + greenfield project. Microservices add network overhead, distributed debugging complexity, and deployment orchestration cost that are unnecessary at this stage. Modular monolith allows extracting modules to microservices later when specific bottlenecks appear.

**Key principles:**
- Modules do NOT import each other directly
- Communication via Internal Event Bus (sync) or Redis Pub/Sub (async)
- Each module owns its database tables — no cross-module direct SQL joins
- Shared data exchanged through events or internal service interfaces

## Concurrency & Processing Model

**4 Workload Types Identified:**

| Workload | Examples | Latency | Pattern |
|----------|---------|---------|---------|
| Synchronous Fast | Search, browse, listing detail, auth | < 500ms | Async I/O (uvicorn + asyncpg + aioredis) |
| Synchronous Slow | Cross-language search, translation preview | < 2s | Async I/O + Redis Cache |
| Background Deferred | Auto-translate listing, image compression, AI moderation | Minutes OK | Celery + Redis Broker (priority queues) |
| Scheduled Recurring | Coupon expiry check, analytics aggregation, sitemap gen | Batch OK | Celery Beat cron jobs |

**Async Stack:** uvicorn (ASGI, 1 worker/CPU core) + asyncpg + aioredis + httpx — non-blocking I/O handles thousands of concurrent connections per worker.

**Background Processing:** Celery with Redis broker, 3 priority queues (high/default/low), 4 specialized worker types (media, translation, moderation, notification).

## Data Flow Architecture

**Read Path (Fast):** Request → Redis Cache → [HIT] → Response (< 50ms) | [MISS] → PostgreSQL Read Replica → Cache → Response

**Write Path (Reliable):** Request → Validate → PostgreSQL Primary → Response → Emit Event (async) → Invalidate cache + Background processing + Index to Meilisearch

**Search Path (Cross-Language):** JP Query → Translation Module → Normalized Query → Meilisearch (JP + VN indexed content) → Ranked Results → Enrich from Redis/PostgreSQL → Response (< 1s)

**Polling Strategy:** Single unified `GET /api/v1/sync` endpoint with adaptive interval (30s default, increases when idle). Server returns delta updates for all subscribed channels. 304 Not Modified when no changes — bandwidth-friendly for 4G Vietnam.

## Scaling Strategy

**MVP (Month 1):** Single server (4 CPU, 8GB RAM) — uvicorn 4 workers, Celery 2 workers, PostgreSQL, Redis, Meilisearch, Nginx. Handles 500 concurrent, 5K daily visits.

**Scale (Month 6):** Load balancer + 2x FastAPI servers (stateless horizontal), 2x Celery workers (separated by queue), PostgreSQL Primary + 1 Read Replica, dedicated Redis, dedicated Meilisearch, CDN (Cloudflare). Handles 5,000 concurrent, 50K daily visits.
