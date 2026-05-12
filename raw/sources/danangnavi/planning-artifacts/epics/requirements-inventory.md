# Requirements Inventory

## Functional Requirements

FR1: Guest can browse the homepage with senpai picks, area highlights, and category navigation
FR2: Guest can search listings by keyword, category, and area
FR3: Guest can filter search results by price range, distance, rating, and tags (e.g., "Japanese-friendly", "Verified")
FR4: Guest can view listing detail with photos, dual-currency pricing (VND + JPY), reviews, business hours, and map location
FR5: Guest can view area/neighborhood guides with local insights
FR6: User can save/unsave listings to personal favorites collection
FR7: User can view and manage their favorites collection
FR8: Guest can register as User via LINE social login or Google social login
FR9: New User can complete an onboarding flow based on their type (newcomer checklist or tourist first-24h guide)
FR10: User can view and edit their profile (display name, bio, interests)
FR11: User can view their contribution history, points balance, and badge level
FR12: System awards contribution points based on user actions (review, comment, photo, post, event attendance, referral)
FR13: System assigns badge levels (Newcomer, Contributor, Senpai, Expert Senpai) based on point thresholds
FR14: User's senpai badge displays on their reviews and community posts
FR15: User can write a review for a listing with text and star rating
FR16: User can upload photos to reviews using camera-only capture (no gallery upload)
FR17: System validates photo EXIF metadata to enforce camera-only policy
FR18: User can mark a review as helpful
FR19: Senpai-badged reviews appear prominently in "Senpai Picks" sections
FR20: Guest can view community groups and public posts (read-only)
FR21: User can join/leave community groups
FR22: User can create posts and comments within joined groups
FR23: User can view and register for community events
FR24: User can view event details (date, location, attendees, description)
FR25: User can receive notifications for contribution milestones and event reminders
FR26: User can access context-based voice translation organized by situation (restaurant, salon, hospital, market)
FR27: User can select a phrase and have the app speak it in Vietnamese
FR28: System provides pre-built phrase packs per business context
FR29: Auto-translated content displays a disclaimer indicating machine translation
FR30: BusinessOwner can register with email/password and accept digital agreement
FR31: BusinessOwner can create and edit a listing in Vietnamese with auto-translation to Japanese
FR32: BusinessOwner can upload photos via camera-only capture
FR33: BusinessOwner can set and update business hours, location, and contact information
FR34: BusinessOwner can review and edit the Japanese translation of their listing
FR35: BusinessOwner can create, edit, and deactivate coupons
FR36: BusinessOwner can view analytics dashboard (views, saves, reviews, coupon redemptions)
FR37: BusinessOwner can view revenue tracking (ad spend, commission breakdown, payment history)
FR38: BusinessOwner can file a fake review complaint through the dashboard
FR39: Admin can view platform-wide dashboard (traffic, revenue, popular sections, user engagement)
FR40: Admin can manage user accounts (view, suspend, ban)
FR41: Admin can manage business owner accounts (view, verify, suspend)
FR42: System automatically filters spam comments, banned keywords, and AI-flags inappropriate images
FR43: Admin can review and action flagged content (approve, remove with reason template)
FR44: Admin can process fake review disputes (investigate, confirm, compensate business owner, ban violator)
FR45: Admin can escalate issues to other admin roles with one click
FR46: Admin can manage staff accounts and assign RBAC roles (content lead, technical, business relations)
FR47: Admin can generate platform reports (weekly/monthly: traffic, revenue, moderation volume)
FR48: Admin can manage business verification workflow (schedule visit, confirm/reject)
FR49: System authenticates users via JWT stored in HTTP-only cookies with refresh token rotation
FR50: System enforces four role types: Guest (default), User, BusinessOwner, Admin
FR51: System enforces RBAC sub-roles for Admin (content, technical, business relations)
FR52: Guest can access public content (browse, search, view) without authentication
FR53: System prompts registration when Guest attempts restricted actions (save, review, post)
FR54: System collects user consent at registration for activity logging and location tracking
FR55: User can disable location tracking for non-location features (community, profile)
FR56: System logs user activity (clicks, likes, searches by topic) for analytics
FR57: System stores all data on Vietnam-based servers
FR58: System flags allergen-related menu terms for human translation review
FR59: System generates SSR pages with Japanese-language meta tags and structured data (JSON-LD) for all public content
FR60: System generates sitemap and OpenGraph tags for social sharing (LINE, Twitter)
FR61: User can browse available coupons near their location or by category
FR62: User can claim and redeem coupons at listings
FR63: System displays all listing content in Japanese for User/Guest
FR64: System displays Business Dashboard entirely in Vietnamese
FR65: System supports cross-language search (Japanese query matches Vietnamese-stored content and vice versa)
FR66: System compresses and optimizes uploaded photos for web delivery
FR67: System delivers in-app notifications for user actions (new review on saved listing, event update, contribution milestone, coupon near expiry)
FR68: User can manage notification preferences (enable/disable by category)
FR69: Admin can export report data in CSV format
FR70: BusinessOwner can export their analytics data
FR71: System displays contextual empty states when no results found (with suggested actions)
FR72: System guides new BusinessOwner through first listing creation with step-by-step wizard
FR73: System displays reviewer's senpai level, years in Da Nang, and expertise tags on their reviews
FR74: User can request account deletion and personal data removal

## NonFunctional Requirements

NFR1: Page Load (SSR) — FCP < 2s, LCP < 2.5s for public pages (SEO ranking + user retention)
NFR2: Time to Interactive — TTI < 3s, critical for mobile users on 4G
NFR3: API Response — < 500ms (p95) for all REST endpoints under normal load
NFR4: Search Response — < 1s including cross-language matching (JP<>VN)
NFR5: Image Delivery — < 1s for optimized photos via CDN
NFR6: Layout Stability — CLS < 0.1 (Core Web Vitals compliance)
NFR7: Peak Concurrent Users — 500-1,000 simultaneous at peak hours (11-13h, 17-19h)
NFR8: Polling Overhead — < 5% CPU increase per 1,000 connected clients
NFR9: Authentication — JWT in HTTP-only cookies, refresh token rotation, CSRF protection
NFR10: Data Encryption — TLS 1.3 for transit, AES-256 for data at rest
NFR11: Password Storage — bcrypt with salt for BusinessOwner/Admin passwords
NFR12: Session Management — Automatic session expiry (24h User, 8h Admin), forced logout on password change
NFR13: Input Validation — Server-side validation on all endpoints, parameterized queries (SQL injection prevention)
NFR14: File Upload Security — EXIF validation + file type verification + size limits (max 10MB/photo) + malware scan
NFR15: Rate Limiting — API rate limits: 100 req/min Guest, 300 req/min User, 500 req/min BusinessOwner
NFR16: RBAC Enforcement — Role checks on every API endpoint, no client-side-only authorization
NFR17: Audit Logging — All admin actions logged with timestamp, actor, and action detail
NFR18: APPI Compliance — Japanese user data: explicit consent, right to deletion, data export capability
NFR19: Vietnam Cybersecurity Law — All data stored on Vietnam-based servers
NFR20: Month 1 scalability — 5,000 daily visits, 50 businesses, 500 concurrent peak
NFR21: Month 6 scalability — 50,000 daily visits, 300 businesses, 5,000 concurrent peak
NFR22: Database Growth — Support 100K+ listings, 500K+ reviews, 1M+ activity logs without degradation
NFR23: Image Storage — Support 500K+ photos with CDN delivery
NFR24: Horizontal Scaling — Stateless API design allowing additional FastAPI instances behind load balancer
NFR25: Cache Strategy — Redis cache with 80%+ hit rate for listing data and search results
NFR26: Graceful Degradation — Under extreme load: serve cached content, queue non-critical writes
NFR27: WCAG 2.1 AA compliance
NFR28: Font Size — Minimum 16px body text, scalable up to 200%
NFR29: Touch Targets — Minimum 44x44px for all interactive elements
NFR30: Color Contrast — 4.5:1 minimum for normal text, 3:1 for large text
NFR31: Alt Text — Required for all listing images and user-uploaded photos
NFR32: Keyboard Navigation — Full keyboard support for Admin Panel (desktop)
NFR33: Screen Reader — Semantic HTML with ARIA labels for key interactions
NFR34: Language Attributes — lang="ja" on Japanese content, lang="vi" on Vietnamese
NFR35: Motion — Respect prefers-reduced-motion for animations
NFR36: Integration Resilience — All external API calls with 5s timeout and circuit breaker pattern; failed integrations must not block core user flows
NFR37: Uptime — 99.5% (max 1.8 days downtime/year)
NFR38: Data Backup — Daily automated backup with 30-day retention
NFR39: Backup Recovery — Restore within 4 hours (RTO)
NFR40: Data Loss Tolerance — Maximum 24 hours (RPO = daily backup)
NFR41: Error Rate — < 0.1% server errors (5xx) under normal load
NFR42: Monitoring — Alerts for: downtime, error spike, high latency, disk/memory thresholds
NFR43: Incident Response — Alert to Acknowledge < 30min during business hours
NFR44: Database — PostgreSQL with daily pg_dump, transaction logging for point-in-time recovery
NFR45: Responsive design — mobile (375px), tablet (768px), desktop (1280px) breakpoints

## Additional Requirements

- **Starter Template**: Turborepo monorepo with hybrid single Next.js 16 app (route groups) + FastAPI modular backend. Initialization commands specified in Architecture (create-turbo, create-next-app, FastAPI setup, Docker). This impacts Epic 1 Story 1.
- Docker Compose infrastructure with 6 services: web, backend, postgres, redis, meilisearch, nginx
- Repository Pattern with SQLAlchemy 2.0 async for all data access
- JWT HTTP-only cookies + Argon2id password hashing + LINE/Google OAuth for authentication
- REST API with URL versioning `/api/v1/`, custom error format with localized JP/VN/EN messages
- Meilisearch 1.16+ for CJK tokenization and cross-language search
- next-intl for i18n scoped to user routes only (ja default, en, vi); business/admin routes bypass i18n
- Zustand for client state management + TanStack Query for server state/data fetching
- React Hook Form + Zod for form handling with shared validation schemas
- Event Bus: in-process sync + Redis Pub/Sub async for cross-module communication
- Celery 5.6.3 with Redis broker for background tasks (translation, media processing, moderation, notifications)
- DigitalOcean Spaces (S3-compatible) for file/media storage with CDN delivery
- CI/CD with GitHub Actions (lint + test on PR, deploy on merge)
- Structured logging with structlog (JSON format, request correlation IDs)
- Monitoring: Sentry (error tracking) + Uptime Robot (uptime monitoring)
- Auto-generated TypeScript types from OpenAPI schema (zero manual type duplication)
- API client auto-transform snake_case (backend) to camelCase (frontend)
- Soft delete pattern for all user-generated content (deleted_at timestamp)
- Module boundary enforcement: modules communicate only via Dependency Injection or Event Bus, never direct imports
- Backend module structure: router.py, service.py, repository.py, models.py, schemas.py, events.py, exceptions.py, constants.py
- Frontend module structure: components/, hooks/, lib/, mirroring backend modules
- Nginx reverse proxy with SSL termination (Let's Encrypt + Certbot)
- DigitalOcean Droplet deployment ($24/mo 4GB RAM for MVP)
- Database migration management with Alembic (auto-generate, version-controlled)
- Test coverage targets: 80% backend service, 100% auth/security, render tests for all frontend components

## UX Design Requirements

UX-DR1: Implement design token system — 3 brand colors (Navy #1B2A4A, Coral #FF6B4A, Teal #2EC4B6), 3 surface colors, 4 text colors, 4 status colors as CSS custom properties / Tailwind config
UX-DR2: Implement typography token system — Noto Sans JP (primary) + Inter (UI), 6-level type scale (H1 32px to Small 12px) with specified weights and line heights
UX-DR3: Implement spacing token system — 7-level scale (4px to 48px), border radius tokens (sm 8px to full 9999px), shadow tokens (card, card-hover, modal, sticky)
UX-DR4: Implement animation tokens — 3 duration levels (fast 150ms, normal 300ms, slow 500ms) with ease-in-out default easing
UX-DR5: Implement responsive breakpoint tokens — sm 640px, md 768px, lg 1024px, xl 1280px with specified layout changes per breakpoint
UX-DR6: Build Bottom Tab Navigation component — 5 tabs (Home, Search, Community, Deals, Profile), Navy active state, visible on mobile only, hidden on desktop with top nav replacement
UX-DR7: Build Search Bar component — prominent search with placeholder text, search overlay with suggestions, quick filter chips below
UX-DR8: Build Senpai Badge component — green verified variant + teal/gray rank variants (Newcomer, Contributor, Senpai, Expert Senpai), displayed on reviews and community posts
UX-DR9: Build Fair Price Indicator component — 3-tier system (green "Fair", yellow "Slightly High", red "Caution") with senpai average price range
UX-DR10: Build Dual Price Display component — VND primary + JPY secondary in parentheses, with currency toggle option
UX-DR11: Build Filter Chips component — horizontal scrollable, teal active state, used across search, community, deals pages (6+ pages)
UX-DR12: Build Senpai Card / Listing Card component — photo + title + rating + senpai badge + dual price + fair-price indicator + save heart, used in search results, guides, homepage
UX-DR13: Build Coupon Card component — business photo + deal description + savings in JPY + expiry countdown + QR redemption flow
UX-DR14: Build Primary CTA Button component — Coral (#FF6B4A) fill, white text, minimum 44px touch target, used across 7+ pages
UX-DR15: Build Section Header component — emoji + title + "View all" link pattern, consistent across homepage, community, deals
UX-DR16: Build Empty State component — illustration + message + suggested action CTA, used for search no results, empty wallet, new dashboard, no events
UX-DR17: Build Toast Notification component — success/error/info variants, auto-dismiss, used for draft saves, coupon creation, etc.
UX-DR18: Build Signup Modal component — LINE login primary (prominent), Google secondary, email accordion tertiary, triggered by auth-gated actions
UX-DR19: Build Modal / Bottom Sheet component — bottom sheet on mobile, centered modal on tablet/desktop, used for contact forms, coupon details, confirmations
UX-DR20: Build Interactive Map component — listing location markers with price pins, workplace marker, nearby POI markers, commute route display
UX-DR21: Build Sticky Action Bar component — fixed bottom bar on mobile with price + primary/secondary CTA, used on listing detail, listing editor
UX-DR22: Build Expandable Accordion component — for contract guidance, senpai tips, FAQ sections
UX-DR23: Build Save Heart Button component — toggle save/unsave with animation, triggers signup modal if unauthenticated
UX-DR24: Build Segmented Control component — for translation mode selector (Voice/Text/Phrasebook), list/calendar view toggle
UX-DR25: Build Senpai Tip Card component — avatar + name + residency duration + quote + CTA link
UX-DR26: Build Success Banner component — animated checkmark + celebration message, used after listing publish, coupon creation
UX-DR27: Build Status Badge component — for listing status (Active/Draft/Pending), coupon status
UX-DR28: Homepage implementation — hero with Da Nang background + search bar + tagline, newcomer welcome banner (coral CTA), senpai picks horizontal scroll, today's deals, community highlights, category quick links grid (per spec 01.1)
UX-DR29: Newcomer Onboarding flow — 3-step situation questionnaire (why, urgency topics, area) generating personalized checklist with senpai tips, save progress CTA (per spec 01.2)
UX-DR30: Area/Neighborhood Guide page — area overview with map, senpai-recommended spots, commute info, lifestyle rating (per spec 01.3)
UX-DR31: Search/Browse page — search header with filter chips, results list/grid with listing cards, map view toggle with price pins, expandable filter panel with dual-currency budget slider (per spec 01.4)
UX-DR32: Listing Detail page — photo gallery with swipe, listing header with dual price + fair price, key details card, amenities grid, senpai reviews section, contract guidance accordion, location map, sticky action bar with contact form (per spec 01.5)
UX-DR33: Community Hub page — activity pulse header, category cards horizontal scroll, trending discussions with thread preview cards, upcoming events horizontal scroll, recent activity feed (per spec 02.1)
UX-DR34: Community Thread page — thread header, reply cards with senpai badges, reply composer with photo upload, helpful vote button (per spec 02.2)
UX-DR35: Events & Meetups page — list/calendar toggle, event cards with cover photo + attendees + "newcomer welcome" tag, join flow with confirmation modal (per spec 02.3)
UX-DR36: User Profile page — senpai progress tracker (visual journey from Newcomer to Expert Senpai), activity timeline, contribution stats, favorites collection (per spec 02.4)
UX-DR37: Senpai Article/Guide page — hero image, author with senpai badge, ranked restaurant list with ratings/coupons/directions (per spec 03.1)
UX-DR38: Translation Tools page — segmented control (Voice/Text/Phrasebook), voice translation with mic button + conversation bubbles + pronunciation guide + audio playback, quick phrases per context, visual menu OCR helper with camera, floating translation FAB on all pages (per spec 03.2)
UX-DR39: Deals & Coupons page — filter chips, coupon cards with savings in JPY, coupon detail modal with QR code, redemption confirmation with confetti animation, My Coupons used tab (per spec 03.3)
UX-DR40: Listing Editor (Business) — 3-step wizard (info, photos/menu, preview), Vietnamese form, photo grid with cover marking, menu OCR with editable translation table + confidence indicators, live Japanese preview card, post-publish success overlay with coupon prompt (per spec 04.1)
UX-DR41: Coupon Manager (Business) — Vietnamese coupon form, live Japanese customer preview, active/expired coupon list with status badges (per spec 04.2)
UX-DR42: Business Dashboard — status cards (listing + coupon), empty-state metric cards with help tooltips, activity feed, Vietnamese-only UI (per spec 04.3)
UX-DR43: Sign Up / Login page — LINE login primary with prominent button, Google secondary, email accordion, success animation with auto-redirect, triggered as modal by auth-gated actions (per spec 05.1)
UX-DR44: Notification Center — category toggles (reviews, events, community, deals), frequency selector (real-time/daily digest/off), notification list with relative timestamps (per spec 05.2)
UX-DR45: Skeleton loading pattern — always use skeleton matching layout for initial load, subtle indicator for refetch, never spinners
UX-DR46: Consumer UI entirely in Japanese (ja default); Business portal entirely in Vietnamese; Admin panel in English/Vietnamese toggle
UX-DR47: Journey Discovery page — origin/destination input with Places autocomplete (Da Nang-bounded), Google Maps route rendering with up to 3 alternatives, route personality segmented control (🍜食 / 🌅景 / ⚡早), bottom sheet (mobile) / right panel (desktop) with listings-along-route cards ordered by distance-from-origin, Navy price pins on map with Coral dot for deal listings, "お得のみ" filter toggle (per Brainstorming Ideas #1 Journey-Based Discovery, #2 Route Personality, #81 Route-Aware Discovery Engine)

## FR Coverage Map

FR1: Epic 2 - Browse homepage with senpai picks, area highlights, category nav
FR2: Epic 2 - Search listings by keyword, category, area
FR3: Epic 2 - Filter search results by price, distance, rating, tags
FR4: Epic 2 - View listing detail with photos, dual-currency, reviews, map
FR5: Epic 2 - View area/neighborhood guides
FR6: Epic 2 - Save/unsave listings to favorites
FR7: Epic 2 - View and manage favorites collection
FR8: Epic 1 - Register via LINE or Google social login
FR9: Epic 3 - Complete onboarding flow (newcomer/tourist)
FR10: Epic 3 - View and edit profile
FR11: Epic 3 - View contribution history, points, badge level
FR12: Epic 3 - System awards contribution points
FR13: Epic 3 - System assigns badge levels
FR14: Epic 3 - Senpai badge displays on reviews/posts
FR15: Epic 4 - Write review with text and star rating
FR16: Epic 4 - Upload photos to reviews (camera-only)
FR17: Epic 4 - System validates photo EXIF metadata
FR18: Epic 4 - Mark review as helpful
FR19: Epic 4 - Senpai-badged reviews in Senpai Picks
FR20: Epic 5 - View community groups and public posts (read-only)
FR21: Epic 5 - Join/leave community groups
FR22: Epic 5 - Create posts and comments in joined groups
FR23: Epic 5 - View and register for community events
FR24: Epic 5 - View event details
FR25: Epic 7 - Receive notifications for milestones and events
FR26: Epic 6 - Access context-based voice translation
FR27: Epic 6 - Select phrase and speak in Vietnamese
FR28: Epic 6 - Pre-built phrase packs per business context
FR29: Epic 6 - Auto-translated content disclaimer
FR30: Epic 1 - BusinessOwner register with email/password
FR31: Epic 8 - Create/edit listing in Vietnamese with auto-translation
FR32: Epic 8 - Upload photos via camera-only capture
FR33: Epic 8 - Set/update business hours, location, contact
FR34: Epic 8 - Review/edit Japanese translation
FR35: Epic 8 - Create, edit, deactivate coupons
FR36: Epic 8 - View analytics dashboard
FR37: Epic 8 - View revenue tracking
FR38: Epic 8 - File fake review complaint
FR39: Epic 9 - Admin platform-wide dashboard
FR40: Epic 9 - Manage user accounts
FR41: Epic 9 - Manage business owner accounts
FR42: Epic 9 - Auto-filter spam, banned keywords, inappropriate images
FR43: Epic 9 - Review and action flagged content
FR44: Epic 9 - Process fake review disputes
FR45: Epic 9 - Escalate issues to other admin roles
FR46: Epic 9 - Manage staff accounts and RBAC roles
FR47: Epic 9 - Generate platform reports
FR48: Epic 9 - Manage business verification workflow
FR49: Epic 1 - JWT auth with HTTP-only cookies, refresh token rotation
FR50: Epic 1 - Four role types: Guest, User, BusinessOwner, Admin
FR51: Epic 9 - Admin RBAC sub-roles
FR52: Epic 1 - Guest access to public content without auth
FR53: Epic 1 - Registration prompt on restricted actions
FR54: Epic 1 - Collect user consent at registration
FR55: Epic 1 - Disable location tracking option
FR56: Epic 7 - System logs user activity for analytics
FR57: Epic 1 - All data on Vietnam-based servers
FR58: Epic 6 - Flag allergen-related menu terms
FR59: Epic 2 - SSR pages with Japanese meta tags, JSON-LD
FR60: Epic 2 - Sitemap and OpenGraph tags
FR61: Epic 7 - Browse available coupons by location/category
FR62: Epic 7 - Claim and redeem coupons
FR63: Epic 2 - Display listing content in Japanese
FR64: Epic 8 - Business Dashboard in Vietnamese
FR65: Epic 2 - Cross-language search (JP<>VN)
FR66: Epic 2 - Compress and optimize uploaded photos
FR67: Epic 7 - In-app notifications for user actions
FR68: Epic 7 - Manage notification preferences
FR69: Epic 9 - Admin export report data in CSV
FR70: Epic 8 - BusinessOwner export analytics data
FR71: Epic 2 - Contextual empty states
FR72: Epic 8 - First listing creation wizard
FR73: Epic 3 - Display reviewer's senpai level, years, expertise tags
FR74: Epic 1 - Account deletion and data removal
FR75: Epic 10 - Journey input origin/destination with Places autocomplete
FR76: Epic 10 - Route polyline rendering with up to 3 alternatives
FR77: Epic 10 - Route-aware listing matching within 300m buffer (PostGIS)
FR78: Epic 10 - Route personality filter (food/scenic/fastest) re-ranks listings
FR79: Epic 10 - Active deals/coupons displayed for listings along route
FR80: Epic 10 - Directions and route-match results cached in Redis (24h/1h TTL)
