# Project Structure & Boundaries

## Complete Project Directory Structure

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

## Architectural Boundaries

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

## Requirements to Structure Mapping

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

## Integration Points

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
