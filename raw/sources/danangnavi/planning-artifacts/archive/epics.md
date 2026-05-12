---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments:
  - "_bmad-output/planning-artifacts/prd/index.md (sharded - 11 files)"
  - "_bmad-output/planning-artifacts/architecture/index.md (sharded - 7 files)"
  - "_bmad-output/A-Product-Brief/project-brief.md"
  - "_bmad-output/B-Trigger-Map/00-trigger-map.md"
  - "_bmad-output/C-UX-Scenarios/00-ux-scenarios.md (5 scenarios, 17 page specs)"
  - "_bmad-output/D-Design-System/index.md (22 components + design-tokens.md)"
  - "_bmad-output/E-Development/deliveries/DD-001-mvp-full-platform.yaml"
  - "_bmad-output/E-Development/test-scenarios/TS-001-mvp-acceptance.yaml"
---

# DaNangNavi - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for DaNangNavi, decomposing the requirements from the PRD, UX Design Scenarios, Design System, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

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

### NonFunctional Requirements

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

### Additional Requirements

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

### UX Design Requirements

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

### FR Coverage Map

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

## Epic List

### Epic 1: Platform Foundation, Authentication & Design System
Users can access the platform, register/login via LINE or Google, and the shared design system + infrastructure is ready for all subsequent development.
**FRs covered:** FR8, FR30, FR49, FR50, FR52, FR53, FR54, FR55, FR57, FR74
**UX-DRs covered:** UX-DR1-5 (design tokens), UX-DR6 (bottom tab nav), UX-DR14 (CTA button), UX-DR15-19 (section header, empty state, toast, signup modal, modal/bottom sheet), UX-DR21 (sticky action bar), UX-DR22-24 (accordion, save heart, segmented control), UX-DR26-27 (success banner, status badge), UX-DR43 (sign up/login), UX-DR45-46 (skeleton loading, i18n strategy)
**Architecture:** Turborepo monorepo, Next.js 16 hybrid app (route groups), FastAPI modular backend, Docker Compose (6 services), PostgreSQL, Redis, Meilisearch, Nginx, CI/CD, structured logging
**Stories:** 1.1 Monorepo Setup, 1.2 Design Tokens & Core UI, 1.3 Layout Shell & Nav, 1.4 User Auth (Social Login), 1.5 BO Registration, 1.6 Privacy & Account Mgmt

### Epic 2: Discovery, Search & Listing Experience
Japanese users can browse the homepage with senpai picks and deals, search/filter listings with cross-language support, view detailed listing pages with dual-currency pricing, fair-price indicators, photo galleries, area guides, and save favorites.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR59, FR60, FR63, FR65, FR66, FR71
**UX-DRs covered:** UX-DR7 (search bar), UX-DR9 (fair price indicator), UX-DR10 (dual price display), UX-DR11 (filter chips), UX-DR12 (senpai/listing card), UX-DR20 (interactive map), UX-DR28 (homepage), UX-DR30 (area guide), UX-DR31 (search/browse), UX-DR32 (listing detail)
**Stories:** 2.1 Listing Data Model & API, 2.2 Homepage, 2.3 Search & Browse, 2.4 Listing Detail, 2.5 Area Guides, 2.6 Favorites

### Epic 3: User Onboarding & Senpai Profile System
New users complete a personalized onboarding flow (newcomer checklist or tourist guide), build their profile, earn contribution points through platform activity, and progress through senpai badge levels (Newcomer → Contributor → Senpai → Expert Senpai).
**FRs covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR73
**UX-DRs covered:** UX-DR8 (senpai badge), UX-DR25 (senpai tip card), UX-DR29 (onboarding flow), UX-DR36 (user profile)
**Stories:** 3.1 Newcomer Onboarding Flow, 3.2 User Profile Page, 3.3 Contribution Points & Gamification, 3.4 Senpai Badge System

### Epic 4: Reviews & Content Creation
Users can write reviews with star ratings and camera-only photos, vote reviews as helpful, and senpai-badged reviews appear prominently in Senpai Picks sections across the platform.
**FRs covered:** FR15, FR16, FR17, FR18, FR19
**UX-DRs covered:** Review section in listing detail, photo upload with EXIF validation, helpful vote UX
**Stories:** 4.1 Write Review with Photos, 4.2 Helpful Votes & Display, 4.3 Senpai Picks

### Epic 5: Community & Events
Users can browse community groups, join discussions, create posts and comments, view and register for community events and meetups — building the senpai community that powers the platform.
**FRs covered:** FR20, FR21, FR22, FR23, FR24
**UX-DRs covered:** UX-DR33 (community hub), UX-DR34 (community thread), UX-DR35 (events & meetups)
**Stories:** 5.1 Community Hub & Groups, 5.2 Join Groups & Post, 5.3 Thread Detail, 5.4 Events & Meetups

### Epic 6: Communication Bridge & Translation Tools
Users can use voice translation, text translation, camera menu OCR, and pre-built phrase packs organized by context (restaurant, salon, hospital) to communicate across the Japanese-Vietnamese language barrier.
**FRs covered:** FR26, FR27, FR28, FR29, FR58
**UX-DRs covered:** UX-DR38 (translation tools page with voice/text/phrasebook/camera OCR), floating translation FAB
**Stories:** 6.1 Voice Translation & Conversation, 6.2 Phrase Packs & Phrasebook, 6.3 Menu OCR & Floating FAB

### Epic 7: Deals, Coupons & Notifications
Users can browse, claim, and redeem coupons with QR codes, receive in-app notifications for reviews, events, milestones, and expiring coupons, and manage their notification preferences.
**FRs covered:** FR25, FR56, FR61, FR62, FR67, FR68
**UX-DRs covered:** UX-DR13 (coupon card), UX-DR39 (deals & coupons page), UX-DR44 (notification center)
**Stories:** 7.1 Deals & Coupons Browsing, 7.2 Coupon Claim & Redemption, 7.3 Notification System & Preferences

### Epic 8: Business Owner Portal
Vietnamese business owners can register, create/edit listings with auto-translation to Japanese, upload photos, manage coupons, view analytics dashboard, track revenue — all in a Vietnamese-only UI with a step-by-step wizard for first listing creation.
**FRs covered:** FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR64, FR70, FR72
**UX-DRs covered:** UX-DR40 (listing editor), UX-DR41 (coupon manager), UX-DR42 (business dashboard)
**Stories:** 8.1 Listing Editor & Auto-Translation, 8.2 Photo Upload & Media, 8.3 Coupon Management, 8.4 Analytics Dashboard

### Epic 9: Admin Panel & Platform Governance
Admins can manage users and business owners, moderate content with automated filters and human review queue, process fake review disputes, manage staff with RBAC roles, run business verification workflows, and generate platform reports with CSV export.
**FRs covered:** FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR51, FR69
**UX-DRs covered:** Admin dashboard, moderation queue, user/BO management, dispute manager, staff manager, report generator pages
**Stories:** 9.1 Admin Dashboard, 9.2 User & BO Management, 9.3 Content Moderation, 9.4 Fake Review Disputes, 9.5 Staff RBAC & Reporting

---

## Epic 1: Platform Foundation, Authentication & Design System

Users can access the platform, register/login via LINE or Google social login, and the complete design system with shared UI components is ready for all subsequent feature development.

### Story 1.1: Monorepo Setup & Development Infrastructure

As a developer,
I want a fully configured monorepo with Next.js, FastAPI, and Docker infrastructure,
So that all subsequent development has a stable foundation with consistent tooling.

**Acceptance Criteria:**

**Given** a fresh clone of the repository
**When** I run `pnpm install && docker compose --profile infra up`
**Then** PostgreSQL, Redis, Meilisearch, and Nginx containers start successfully
**And** Next.js dev server starts at localhost:3000 with Turbopack
**And** FastAPI dev server starts at localhost:8000 with auto-reload
**And** the Turborepo monorepo structure matches Architecture spec (apps/web, packages/types, backend)
**And** pnpm workspace is configured with apps/web and packages/types
**And** ESLint (frontend) and Ruff (backend) linters are configured and pass on empty project
**And** GitHub Actions CI pipeline runs lint + test on PR
**And** Docker Compose includes 6 services: web, backend, postgres, redis, meilisearch, nginx
**And** Nginx reverse proxy routes /api/* to backend and /* to frontend
**And** .env.example contains all required environment variables
**And** README.md documents setup instructions

### Story 1.2: Design Token System & Core UI Components

As a developer,
I want a complete design token system in Tailwind and a library of shared UI components,
So that all pages across the platform have consistent styling and reusable building blocks.

**Acceptance Criteria:**

**Given** the Tailwind CSS 4.x configuration
**When** I inspect the tailwind.config.ts
**Then** all brand colors are configured (Navy #1B2A4A, Coral #FF6B4A, Teal #2EC4B6)
**And** surface colors (#FAFAF8, #FFFFFF, #F5F5F3), text colors, and status colors are defined
**And** typography tokens use Noto Sans JP (primary) and Inter (UI) with 6-level type scale
**And** spacing scale (4px to 48px), border radius (sm 8px to full 9999px), and shadow tokens are configured
**And** animation tokens (fast 150ms, normal 300ms, slow 500ms) are defined
**And** responsive breakpoints (sm 640px, md 768px, lg 1024px, xl 1280px) are configured

**Given** the shared components library at apps/web/shared/components/
**When** I render each component in isolation
**Then** PrimaryCTAButton renders with Coral fill, white text, min 44px touch target
**And** SectionHeader renders with emoji + title + optional "View all" link
**And** EmptyState renders with illustration + message + CTA button
**And** Toast renders in success/error/info variants with auto-dismiss
**And** Modal renders as bottom sheet on mobile (<768px) and centered modal on desktop
**And** StickyActionBar renders fixed at bottom on mobile with price + CTA buttons
**And** Accordion renders with expand/collapse animation (300ms)
**And** SaveHeartButton renders with toggle animation, accepts onUnauthenticated callback
**And** SegmentedControl renders with Navy active state, supports N segments
**And** SuccessBanner renders with animated green checkmark + celebration message
**And** StatusBadge renders Active/Draft/Pending variants with appropriate colors
**And** Skeleton component renders as loading placeholder matching target layout
**And** all components follow design token values exactly

### Story 1.3: Application Layout Shell & Navigation

As a guest user,
I want to see a properly structured navigation with Japanese UI on consumer pages,
So that I can navigate the platform intuitively on any device.

**Acceptance Criteria:**

**Given** I visit the platform on a mobile device (< 768px)
**When** the consumer page loads
**Then** a Bottom Tab Navigation bar appears with 5 tabs: Home, Search, Community, Deals, Profile
**And** active tab shows Navy fill, inactive tabs show gray outline
**And** tab labels are in Japanese (ホーム, 検索, コミュニティ, お得, マイページ)

**Given** I visit the platform on desktop (> 1024px)
**When** the consumer page loads
**Then** a sticky top navigation bar appears with categories
**And** the bottom tab nav is hidden

**Given** the route group structure
**When** I navigate to `(user)/[locale]/*` routes
**Then** next-intl provides Japanese (ja) as default locale with en and vi alternatives
**And** `lang="ja"` attribute is set on Japanese content

**Given** the business portal at `(business)/vi/*`
**When** a business owner visits
**Then** a sidebar navigation renders entirely in Vietnamese
**And** no next-intl middleware processes these routes (zero i18n overhead)
**And** `lang="vi"` attribute is set

**Given** the admin panel at `(admin)/*`
**When** an admin visits
**Then** a sidebar navigation renders with role-based menu items
**And** a simple language toggle (EN/VI) is available

**Given** any route
**When** a 404 or error occurs
**Then** a styled not-found page or error boundary renders in the appropriate language

### Story 1.4: User Authentication — Social Login (LINE & Google)

As a Japanese user,
I want to register and login via LINE or Google,
So that I can access personalized features like saving listings and posting reviews.

**Acceptance Criteria:**

**Given** I am a guest browsing public content
**When** I attempt a restricted action (save listing, write review, post in community)
**Then** a Signup Modal appears with LINE login as the primary prominent button
**And** Google login appears as a secondary option
**And** email registration is available via an expandable accordion

**Given** I tap the LINE login button
**When** the LINE OAuth flow completes successfully
**Then** my account is created with role "User"
**And** a JWT is stored in an HTTP-only cookie with refresh token
**And** a green checkmark success animation plays
**And** I am auto-redirected after 1.5 seconds
**And** the original restricted action completes (e.g., listing is saved)

**Given** I tap the Google login button
**When** the Google OAuth flow completes successfully
**Then** the same JWT + refresh token flow applies as LINE login

**Given** I have an existing session
**When** I return to the platform
**Then** my JWT is automatically refreshed via refresh token rotation
**And** I remain authenticated without re-login

**Given** the backend auth module
**When** any API request is made
**Then** the system enforces role-based access: Guest (public only), User (authenticated features), BusinessOwner (business endpoints), Admin (admin endpoints)
**And** CSRF protection via double submit cookie pattern is active
**And** rate limiting is enforced: 100 req/min Guest, 300 req/min User

**Given** I register for the first time
**When** the registration flow completes
**Then** a consent dialog collects explicit consent for activity logging and location tracking (FR54)
**And** the consent record is stored in the database

### Story 1.5: Business Owner Registration & Agreement

As a Vietnamese business owner,
I want to register with my email and accept a digital agreement,
So that I can create listings and manage my business presence on the platform.

**Acceptance Criteria:**

**Given** I visit the business registration page at `/business/vi/auth/register`
**When** the page loads
**Then** a registration form appears entirely in Vietnamese
**And** fields include: email, password, business name, phone number, Zalo contact

**Given** I fill in valid registration details
**When** I submit the form
**Then** my password is hashed with Argon2id before storage
**And** a digital agreement (terms of service) is presented for acceptance
**And** I must check "Tôi đồng ý với Điều khoản sử dụng" to proceed

**Given** I accept the agreement and submit
**When** registration completes
**Then** my account is created with role "BusinessOwner"
**And** a JWT is issued in an HTTP-only cookie
**And** I am redirected to the business dashboard
**And** a SuccessBanner confirms my registration

**Given** I enter an already-registered email
**When** I submit the form
**Then** a Vietnamese error message appears: "Email này đã được đăng ký"
**And** the form preserves all other entered data

### Story 1.6: Privacy Controls & Account Management

As a registered user,
I want to control my privacy settings and delete my account if needed,
So that I feel safe using the platform and my data rights are respected.

**Acceptance Criteria:**

**Given** I am a logged-in User
**When** I visit my profile settings
**Then** I can see a "Location tracking" toggle (FR55)
**And** the toggle is ON by default (as consented at registration)
**And** I can turn it OFF to disable location tracking for non-location features

**Given** I want to delete my account
**When** I navigate to account settings and tap "アカウント削除" (Delete Account)
**Then** a confirmation dialog explains what will be deleted
**And** I must type my display name to confirm
**And** upon confirmation, my personal data is queued for removal
**And** my session is terminated and I am logged out
**And** a confirmation email/message is sent

**Given** the system infrastructure configuration
**When** data is stored
**Then** all data resides on Vietnam-based servers (FR57)
**And** data encryption uses TLS 1.3 for transit and AES-256 for data at rest

---

## Epic 2: Discovery, Search & Listing Experience

Japanese users can browse the homepage with senpai picks and deals, search/filter listings with cross-language support, view detailed listing pages with dual-currency pricing, fair-price indicators, photo galleries, area guides, and save favorites.

### Story 2.1: Listing Data Model & API Foundation

As a developer,
I want the listing data model, seed data, and REST API endpoints,
So that all listing-related pages have a working backend to fetch data from.

**Acceptance Criteria:**

**Given** the backend listing module
**When** the database migrations run
**Then** tables are created: listings, listing_categories, areas, business_hours
**And** each table follows the base model pattern (UUID v4 PK, created_at, updated_at, deleted_at)
**And** listing model includes: title_vi, title_ja, description_vi, description_ja, price_vnd, latitude, longitude, rating_avg, review_count, is_senpai_verified, category_id, area_id

**Given** the seed data script
**When** I run `python scripts/seed-data.py`
**Then** at least 50 demo listings are created across 6 categories (Restaurant, Cafe, Spa, Hotel, Tour, Housing)
**And** at least 5 Da Nang areas are seeded (Hai Chau, Son Tra, Ngu Hanh Son, Lien Chieu, Thanh Khe)
**And** listings have realistic Japanese and Vietnamese content

**Given** the REST API
**When** I call `GET /api/v1/listings`
**Then** paginated results return with standard response wrapper ({data, meta})
**And** query params support: category_id, area_id, sort_by, sort_order, page, per_page
**When** I call `GET /api/v1/listings/{listing_id}`
**Then** full listing detail returns including business hours, area info, and category
**When** I call `GET /api/v1/areas`
**Then** all Da Nang areas return with name_ja, name_vi, description, and listing count

**Given** photo upload handling (FR66)
**When** a photo is uploaded via the media module
**Then** the image is compressed and optimized for web delivery (WebP format, max 1200px width)
**And** the optimized image URL is stored in the media_files table

### Story 2.2: Homepage — Hero, Senpai Picks & Deals

As a Japanese guest visiting for the first time,
I want to see a welcoming homepage with senpai picks and deals,
So that I immediately understand this platform is made for Japanese people in Da Nang and find relevant content.

**Acceptance Criteria:**

**Given** I visit the homepage at `/ja`
**When** the page loads
**Then** Section 1 displays: full-width Da Nang hero image with search bar, tagline "ダナンのすべてが、ここに。", subtitle about senpai experiences, and 6 quick filter chips (レストラン, カフェ, 住まい, ビザ, 病院, 翻訳)
**And** Section 2 displays: coral newcomer welcome banner with "ダナンへようこそ！" headline, first-week description, and "はじめる →" CTA button
**And** the welcome banner can be dismissed (×) and stays dismissed (localStorage)

**Given** the homepage sections below the fold
**When** I scroll down
**Then** Section 3 "先輩のおすすめ" shows 6 senpai pick cards in horizontal scroll (mobile) / 3-column grid (desktop) with photo, title, rating, senpai badge
**And** Section 4 "今日のお得情報" shows 4 deal cards with business photo, deal description, savings in JPY, expiry countdown, and "すべて見る →" link
**And** Section 5 "コミュニティ" shows 3 recent popular threads with preview text, reply count, and today's post count
**And** Section 6 shows a 2×3 icon grid (mobile) / 6-across (desktop) of category quick links

**Given** SEO requirements (FR59-FR60)
**When** the homepage is server-side rendered
**Then** the page includes Japanese-language meta tags, JSON-LD structured data
**And** OpenGraph tags are present for LINE and Twitter social sharing
**And** a sitemap.xml includes the homepage URL

**Given** the welcome banner "はじめる" CTA
**When** I tap it
**Then** I navigate to the Newcomer Onboarding page

### Story 2.3: Search & Browse with Cross-Language Support

As a Japanese user looking for listings,
I want to search and filter listings with Japanese keywords even when data is stored in Vietnamese,
So that I can find relevant results regardless of language.

**Acceptance Criteria:**

**Given** I navigate to the search page `/ja/listings`
**When** the page loads
**Then** a search bar appears with placeholder "何をお探しですか？"
**And** filter chips are shown: エリア, 予算, タイプ, 先輩おすすめ, 日本語OK
**And** results count displays (e.g., "32件の物件")
**And** sort dropdown offers: おすすめ順, Price ↑, Price ↓, Rating, Newest

**Given** I type a Japanese keyword like "フォー" (pho)
**When** the search executes with debounce
**Then** Meilisearch returns Vietnamese listings matching "phở" via cross-language matching (FR65)
**And** results display as listing cards with: photo, senpai badge, title (Japanese), dual price (VND + ¥JPY), fair-price indicator, rating, senpai snippet, save heart

**Given** I tap a filter chip (e.g., エリア)
**When** I select "ソンチャ" (Son Tra)
**Then** results filter to Son Tra area with the chip highlighted in teal
**And** results count updates

**Given** I tap "リスト / 地図" toggle
**When** I switch to map view
**Then** a Da Nang map displays with Navy price pins (e.g., "¥48K") at each listing location
**And** tapping a pin shows a card preview overlay

**Given** no results match my filters (FR71)
**When** the empty state displays
**Then** a friendly illustration appears with "条件に合う物件が見つかりませんでした"
**And** a "フィルターをリセット" CTA resets all filters

**Given** I arrive from the area guide with pre-applied filters
**When** the search page loads
**Then** the search bar and filter chips reflect the pre-applied filters (e.g., area = Son Tra, type = Housing)

### Story 2.4: Listing Detail Page

As a Japanese user evaluating a listing,
I want to see complete details with dual-currency pricing, senpai reviews, and fair-price context,
So that I can make an informed decision about contacting or saving the listing.

**Acceptance Criteria:**

**Given** I tap a listing card from search results
**When** the listing detail page loads at `/ja/listings/[slug]`
**Then** Section 1 displays a full-width photo gallery with swipe (mobile) / grid (desktop), photo counter "1/12", and "先輩認証済み ✓" badge overlay
**And** Section 2 displays listing header: title, large VND price, JPY equivalent in teal, fair-price indicator with senpai average range, quick specs (rooms, size, floor, parking), star rating, save ♡ and share 📤 buttons

**Given** the listing has detailed information
**When** I scroll down
**Then** Section 3 Key Details shows: address (VI + JP phonetic), commute time to workplace, availability date, contract period, deposit, utilities
**And** Section 4 Amenities shows an icon grid (3 columns) with check marks for available amenities
**And** Section 5 Senpai Reviews shows: star breakdown, featured "Most Helpful" review, review cards with avatar + senpai badge + residency duration + date + rating + text + reviewer tags
**And** Section 6 Contract Guidance shows an accordion with checklist items and senpai tips (FR71 edge case: contract guidance for newcomers)
**And** Section 7 Location Map shows an embedded map with listing pin, workplace marker (if set), and nearby POI markers

**Given** the sticky action bar on mobile
**When** I see it at the bottom
**Then** it shows compact price "¥48,000/月" + Coral "お問い合わせ" CTA + Navy outline "♡ 保存" button
**And** tapping "お問い合わせ" opens a contact form overlay with pre-filled bilingual message template
**And** tapping "♡ 保存" saves to favorites or triggers signup modal if unauthenticated (FR53)

**Given** the page content in Japanese (FR63)
**When** listing data is fetched
**Then** all content displays in Japanese (title_ja, description_ja)
**And** dual-currency pricing shows VND primary + JPY in parentheses (UX-DR10)
**And** the page is SSR with Japanese meta tags and JSON-LD structured data (FR59)

### Story 2.5: Area/Neighborhood Guides

As a Japanese newcomer choosing where to live,
I want to browse area guides with local insights and senpai recommendations,
So that I can pick the right neighborhood based on commute, lifestyle, and budget.

**Acceptance Criteria:**

**Given** I navigate to an area guide at `/ja/areas/[area]`
**When** the page loads
**Then** an area overview section shows: area name (Japanese), description, embedded map highlighting the area boundary
**And** a lifestyle info section shows: average rent range (dual currency), commute times to key locations, atmosphere description, safety rating

**Given** the area has senpai-recommended spots
**When** I scroll down
**Then** a "先輩のおすすめスポット" section shows listing cards for top-rated places in this area
**And** each card includes senpai badge, rating, and a short senpai quote

**Given** I want to search within this area
**When** I tap "このエリアで物件を探す" CTA
**Then** I navigate to the search page with area filter pre-applied

**Given** the areas list page at `/ja/areas`
**When** the page loads
**Then** all Da Nang areas display as cards with: name, photo, listing count, average price range
**And** the page is SSR with Japanese meta tags (FR59)

### Story 2.6: Favorites Collection

As a registered user,
I want to save and manage my favorite listings,
So that I can easily return to listings I'm interested in.

**Acceptance Criteria:**

**Given** I am viewing a listing card or listing detail
**When** I tap the ♡ save heart button (FR6)
**Then** the heart fills with animation and the listing is saved to my favorites
**And** a brief toast confirms "保存しました" (Saved)

**Given** I tap the filled ♡ again
**When** the unsave action triggers
**Then** the heart empties with animation and the listing is removed from favorites

**Given** I am not logged in and tap ♡
**When** the save action triggers (FR53)
**Then** the signup modal appears
**And** after successful login, the save action completes automatically

**Given** I navigate to my favorites at `/ja/profile/favorites` (FR7)
**When** the page loads
**Then** my saved listings display as listing cards with all standard info (photo, title, dual price, rating)
**And** I can unsave from this page
**And** if no favorites exist, an empty state shows with "まだ保存した場所がありません" and a "探す" CTA to search

---

## Epic 3: User Onboarding & Senpai Profile System

New users complete a personalized onboarding flow, build their profile, earn contribution points, and progress through senpai badge levels from Newcomer to Expert Senpai.

### Story 3.1: Newcomer Onboarding Flow

As a Japanese newcomer who just arrived in Da Nang,
I want to complete a quick questionnaire and receive a personalized first-week checklist,
So that I know exactly what to do in my first week without feeling lost.

**Acceptance Criteria:**

**Given** I tap "はじめる" on the homepage welcome banner or visit `/ja/onboarding`
**When** the onboarding page loads
**Then** a welcome header shows with friendly illustration, headline "ダナン生活、一緒に始めましょう！", and a 3-step progress indicator (● ○ ○)

**Given** Step 1 "ダナンに来た理由は？"
**When** I see the situation options
**Then** 4 card-style options display: 🏢 仕事で転勤, 💻 フリーランス・ノマド, 🎓 留学, 🏖️ 旅行
**And** selecting 🏖️ 旅行 redirects to a tourist-specific first-24h guide flow
**And** selecting any other option advances to Step 2

**Given** Step 2 "今、一番困っていることは？"
**When** I see the urgency topic chips
**Then** 8 multi-select chips display (住まい, SIM, 銀行, 食事, 交通, ビザ, 病院, 友達)
**And** I can select maximum 3 chips (toggle on/off)
**And** a "次へ" button advances to Step 3

**Given** Step 3 "職場はどのエリアですか？"
**When** I see the area selector
**Then** a simplified Da Nang area map or list shows 5 areas with Japanese names
**And** a "まだ決まっていない" fallback option is available
**And** selecting an area completes the questionnaire

**Given** the questionnaire is complete
**When** the checklist generates
**Then** a personalized "あなたの1週間プラン" displays with day-by-day tasks prioritized by selected urgency topics
**And** each task has a checkbox, icon, description, and link to relevant guide/search page
**And** the recommended next action is marked with ★
**And** each item has an expandable "先輩のアドバイス" senpai tip (UX-DR25)
**And** checklist state persists in localStorage for guests, in account for registered users

**Given** the save progress sticky bar on mobile
**When** I see "チェックリストを保存しますか？"
**Then** "LINEで登録" CTA triggers the signup modal
**And** "あとで" dismisses the bar and checklist remains in localStorage

### Story 3.2: User Profile Page

As a registered user,
I want to view and edit my profile with my activity and contribution history,
So that I can manage my identity and track my progress on the platform.

**Acceptance Criteria:**

**Given** I navigate to my profile at `/ja/profile`
**When** the page loads
**Then** my profile header shows: avatar, display name, bio, registration date, and "在住X年" (years in Da Nang) if set
**And** an "編集" (Edit) button opens a profile edit form

**Given** I tap the edit button (FR10)
**When** the edit form opens
**Then** I can update: display name, bio (max 200 chars), interests (multi-select chips), and avatar
**And** saving shows a toast "プロフィールを更新しました"

**Given** my profile page
**When** I scroll to the activity section
**Then** an activity timeline shows my recent actions: reviews written, posts made, events attended, listings saved
**And** each entry has a relative timestamp and link to the content

**Given** my profile page
**When** I view the stats section
**Then** contribution stats display: total points, reviews count, posts count, events attended
**And** a link to my favorites collection is visible

### Story 3.3: Contribution Points & Gamification Engine

As a registered user,
I want to earn contribution points for my activity on the platform,
So that my engagement is recognized and I progress toward senpai status.

**Acceptance Criteria:**

**Given** the backend gamification module
**When** database migrations run
**Then** tables are created: contribution_points (user_id, action_type, points, created_at), badge_levels (user_id, level, upgraded_at)
**And** point values are configured as constants: review=50, comment=10, photo=20, post=30, event_attendance=40, referral=100

**Given** I write a review (FR12)
**When** the review is published
**Then** the gamification service awards me 50 points via event bus (review.created → gamification handler)
**And** my total points balance is updated
**And** the point award is logged in contribution_points table

**Given** I post in a community group
**When** the post is created
**Then** 30 points are awarded via event bus (post.created → gamification handler)

**Given** I attend a community event
**When** my attendance is confirmed
**Then** 40 points are awarded

**Given** I view my contribution history (FR11)
**When** I navigate to my profile
**Then** my current points balance displays prominently
**And** a history list shows each point award: action type, points earned, date
**And** the API endpoint `GET /api/v1/gamification/me` returns my points, history, and current badge level

### Story 3.4: Senpai Badge System

As a user who has been active on the platform,
I want to earn senpai badge levels that display on my reviews and posts,
So that my contributions are recognized and other users can see my credibility.

**Acceptance Criteria:**

**Given** badge level thresholds (FR13)
**When** my points reach a threshold
**Then** the system automatically upgrades my badge level:
**And** 0-99 points = Newcomer (新人), 100-499 = Contributor (貢献者), 500-1999 = Senpai (先輩), 2000+ = Expert Senpai (エキスパート先輩)
**And** a notification is sent for badge upgrades via event bus (user.badge_upgraded)

**Given** my senpai badge (FR14)
**When** my reviews or community posts are displayed
**Then** a SenpaiBadge component shows my current level:
**And** green verified variant for Senpai/Expert Senpai
**And** teal variant for Contributor
**And** gray variant for Newcomer

**Given** a review displays on a listing page (FR73)
**When** the reviewer has a senpai badge
**Then** the review shows: avatar, display name, senpai badge, "在住X年" (years in Da Nang), expertise tags (e.g., "家族あり", "リモートワーク")

**Given** my user profile page (UX-DR36)
**When** I view my senpai progress
**Then** a visual progress tracker shows my journey: Newcomer → Contributor → Senpai → Expert Senpai
**And** current level is highlighted, next level threshold and remaining points are shown
**And** a SenpaiTipCard (UX-DR25) with encouragement message appears below the tracker

---

## Epic 4: Reviews & Content Creation

Users can write reviews with star ratings and camera-only photos, vote reviews as helpful, and senpai-badged reviews appear prominently in Senpai Picks sections across the platform.

### Story 4.1: Write Review with Star Rating & Camera-Only Photos

As a registered user who visited a listing,
I want to write a review with a star rating and camera-only photos,
So that I can share my genuine experience and help other Japanese users make informed decisions.

**Acceptance Criteria:**

**Given** the backend review module
**When** database migrations run
**Then** tables are created: reviews (user_id, listing_id, rating, text, created_at, deleted_at), review_votes (review_id, user_id, vote_type)
**And** the review model supports multi-criteria ratings (overall, value, cleanliness, location, service)

**Given** I am on a listing detail page and logged in (FR15)
**When** I tap "レビューを書く" (Write a review)
**Then** a review form opens with: star rating selector (1-5 stars, tap to rate), text area (placeholder: "あなたの経験を教えてください"), and photo upload button
**And** star rating is required, text is required (min 20 chars)

**Given** I tap the photo upload button (FR16)
**When** the device camera opens
**Then** only camera capture is available (no gallery access)
**And** I can take up to 5 photos per review

**Given** I submit a photo (FR17)
**When** the backend processes the upload
**Then** the system validates EXIF metadata to confirm the photo was taken by a camera (not screenshot or downloaded image)
**And** if EXIF validation fails, a polite error message displays: "カメラで撮影した写真のみアップロードできます"
**And** valid photos are compressed and optimized for web delivery (FR66)

**Given** I submit my review
**When** the review is published
**Then** the review appears on the listing detail page with my avatar, name, senpai badge, rating, text, and photos
**And** the listing's average rating and review count are recalculated
**And** a review.created event fires on the event bus (triggers gamification + moderation)
**And** a toast confirms "レビューを投稿しました"

**Given** I am not logged in and tap "レビューを書く"
**When** the auth check triggers (FR53)
**Then** the signup modal appears, and after login, the review form opens

### Story 4.2: Helpful Votes & Review Display

As a user reading reviews on a listing,
I want to mark reviews as helpful and see the most useful reviews first,
So that the best reviews are easy to find and reviewers are encouraged to write quality content.

**Acceptance Criteria:**

**Given** I am viewing reviews on a listing detail page (FR18)
**When** I see a review card
**Then** a "参考になった" (Helpful) button displays with current helpful vote count
**And** tapping it increments the count and the button fills (toggle)
**And** tapping again removes my vote

**Given** I am not logged in and tap "参考になった"
**When** the auth check triggers
**Then** the signup modal appears, and after login, the vote is applied

**Given** the reviews section on listing detail
**When** reviews are loaded
**Then** reviews are sorted by helpfulness (most helpful first) by default
**And** the top review is highlighted with a "最も参考になった" (Most Helpful) badge
**And** a star breakdown summary shows: count per star level (⭐5: 8, ⭐4: 3, etc.)

**Given** a helpful vote is cast
**When** the vote is processed
**Then** the API endpoint `POST /api/v1/reviews/{review_id}/vote` records the vote
**And** a review.voted_helpful event fires (triggers gamification points for the reviewer)

### Story 4.3: Senpai Picks & Verified Reviews

As a Japanese guest browsing listings,
I want to see senpai-verified reviews and Senpai Picks prominently,
So that I can quickly find trustworthy recommendations from experienced community members.

**Acceptance Criteria:**

**Given** a listing has reviews from senpai-badged users (FR19)
**When** the listing detail page loads
**Then** senpai reviews are visually distinguished: green "先輩認証済み ✓" badge on the review card
**And** senpai reviews appear above non-senpai reviews in the default sort

**Given** the homepage "先輩のおすすめ" section
**When** senpai picks are loaded
**Then** only listings with senpai-verified reviews (rating ≥ 4.0 from senpai users) appear in the section
**And** each card shows the senpai reviewer's avatar, name, and a short quote from their review

**Given** the search results page
**When** I toggle the "先輩おすすめ" filter chip
**Then** results filter to show only senpai-verified listings
**And** the chip highlights in teal

**Given** the backend API
**When** `GET /api/v1/listings?senpai_verified=true` is called
**Then** only listings with at least one review from a Senpai or Expert Senpai badge user (rating ≥ 4.0) are returned
**And** the listing response includes `is_senpai_verified: true` flag and the top senpai review snippet

---

## Epic 5: Community & Events

Users can browse community groups, join discussions, create posts and comments, view and register for community events and meetups — building the senpai community that powers the platform.

### Story 5.1: Community Hub & Group Browsing

As a Japanese user feeling isolated in Da Nang,
I want to browse an active community hub with groups and trending discussions,
So that I can discover that a vibrant Japanese expat community exists and find topics relevant to me.

**Acceptance Criteria:**

**Given** the backend community module
**When** database migrations run
**Then** tables are created: groups (name_ja, description, icon, category), posts (group_id, user_id, title, body, created_at, deleted_at), comments (post_id, user_id, body, created_at, deleted_at), events, event_registrations
**And** seed data creates 6 community groups: 新人の広場, グルメ・食事, 住まい・生活, イベント, 仕事・ビザ, なんでも相談

**Given** I navigate to `/ja/community` (FR20)
**When** the community hub page loads
**Then** Section 1 header shows: "コミュニティ" title, activity pulse "今日のアクティビティ: X件の投稿 · Y件の返信" in teal, and "＋ 投稿する" button (top-right)

**Given** the community hub page
**When** I view Section 2 category cards
**Then** 6 group cards display in horizontal scroll (mobile) / 2×2 grid (desktop)
**And** each card shows: emoji icon, group name (Japanese), new activity count, teal dot if new since last visit
**And** "新人の広場" (Newcomers) appears first

**Given** the community hub page
**When** I view Section 3 trending discussions
**Then** a "🔥 話題のトピック" section header with "すべて見る →" link displays
**And** 3-5 thread preview cards show: author avatar (36px), author name + senpai badge, thread title (max 2 lines), preview text (1 line truncated), tag chips (max 2), engagement row (💬 replies · ❤️ likes · relative time)

**Given** the community hub page
**When** I view Section 4 upcoming events
**Then** a "🎉 今週のイベント" section header with "すべて見る →" displays
**And** horizontal scroll event cards (240px wide) show: cover photo, title, date/time, location, attendee avatar stack + count, optional "初心者歓迎" tag

**Given** the community hub page
**When** I view Section 5 recent activity feed
**Then** 5 recent activity items display: icon + activity text + relative time
**And** activities include: new replies, new members, like milestones, event participation updates

**Given** I am a guest (not logged in)
**When** I browse the community hub
**Then** all content is visible in read-only mode (FR20)
**And** "＋ 投稿する" button triggers signup modal if tapped

### Story 5.2: Join Groups & Create Posts/Comments

As a registered user,
I want to join community groups and create posts and comments,
So that I can participate in discussions and connect with other Japanese expats.

**Acceptance Criteria:**

**Given** I am logged in and viewing a community group (FR21)
**When** I see the group I want to join
**Then** a "参加する" (Join) button is visible
**And** tapping it joins me to the group and the button changes to "参加中" (Joined)
**And** tapping "参加中" shows an option to leave the group

**Given** I am a member of a group (FR22)
**When** I tap "＋ 投稿する" (New Post)
**Then** a post composer opens with: title field (required), body text area (required), tag selector (optional, max 3), photo upload button (optional)
**And** submitting creates the post and shows a toast "投稿しました"
**And** a post.created event fires on the event bus (triggers gamification + moderation)

**Given** I am not a member of a group
**When** I tap "＋ 投稿する"
**Then** a prompt asks me to join the group first
**And** after joining, the post composer opens

**Given** I am viewing a thread
**When** I want to reply
**Then** a reply composer at the bottom shows: text area, photo upload icon, "返信" (Reply) submit button
**And** submitting adds my comment to the thread in real-time
**And** a comment.created event fires (triggers gamification)

**Given** I am not logged in and try to post or comment
**When** the auth check triggers (FR53)
**Then** the signup modal appears

### Story 5.3: Community Thread Detail

As a user interested in a discussion topic,
I want to read a full thread with replies and senpai-marked contributions,
So that I can find detailed answers and engage with the community.

**Acceptance Criteria:**

**Given** I tap a thread card on the community hub
**When** the thread detail page loads at `/ja/community/[group_slug]`
**Then** the thread header shows: title, author avatar + name + senpai badge, group name, post date, tag chips
**And** the original post body displays with full text and any attached photos

**Given** the thread has replies
**When** I scroll down
**Then** reply cards display chronologically: avatar (36px), author name + senpai badge, reply text, attached photos, relative timestamp
**And** each reply has a ❤️ like button with count
**And** senpai-badged replies have a subtle visual distinction (teal left border)

**Given** the thread has many replies
**When** I scroll to load more
**Then** pagination loads additional replies (20 per page)
**And** a "もっと見る" button or infinite scroll loads the next batch

**Given** the reply composer at the bottom
**When** I tap it
**Then** the composer expands with text area + photo upload icon + "返信" button
**And** on mobile, the keyboard pushes the composer up

### Story 5.4: Events & Meetups

As a Japanese user wanting to make friends in Da Nang,
I want to browse and register for community events and meetups,
So that I can meet other Japanese expats in person and build real connections.

**Acceptance Criteria:**

**Given** I navigate to the events page at `/ja/community/events` (FR23)
**When** the page loads
**Then** a list/calendar toggle (SegmentedControl) allows switching between list and calendar views
**And** filter chips display: すべて, 今週, 今月, 初心者歓迎

**Given** the events list view
**When** events are displayed
**Then** event cards show: cover photo (240px × 120px), title, date/time with 📅 icon, location with 📍 icon, attendee avatar stack (3 overlapping 24px avatars) + "X人参加予定" count
**And** events tagged "初心者歓迎" (Newcomers Welcome) show a teal pill badge

**Given** I tap an event card (FR24)
**When** the event detail displays
**Then** full details show: title, description, date/time, location (with map link), organizer info, attendee list, and "参加する" (Join) CTA button

**Given** I tap "参加する" on an event
**When** I am logged in
**Then** a confirmation modal appears with checkmark animation
**And** I am added to the attendee list
**And** the attendee count updates
**And** an event.registered event fires (triggers gamification + notification for reminder)

**Given** I am not logged in and tap "参加する"
**When** the auth check triggers
**Then** the signup modal appears, and after login, the registration completes

**Given** no events match the selected filter
**When** the empty state displays
**Then** a friendly message shows "イベントはまだありません" with a suggestion to check back later

---

## Epic 6: Communication Bridge & Translation Tools

Users can use voice translation, text translation, camera menu OCR, and pre-built phrase packs organized by context to communicate across the Japanese-Vietnamese language barrier.

### Story 6.1: Voice Translation & Conversation Interface

As a Japanese tourist at a Vietnamese restaurant,
I want to speak in Japanese and get instant Vietnamese translation with audio playback,
So that I can communicate with staff without knowing Vietnamese.

**Acceptance Criteria:**

**Given** I navigate to `/ja/translate` or tap the translation FAB
**When** the translation page loads
**Then** a SegmentedControl shows 3 tabs: 🎤 音声翻訳 (Voice, default), ✏️ テキスト (Text), 📖 フレーズ集 (Phrasebook)
**And** a language pair indicator shows "日本語 → ベトナム語" with a swap (↔) icon

**Given** I am on the Voice tab (FR26)
**When** I tap the large coral mic button (80px diameter)
**Then** the button pulses with audio amplitude animation
**And** "聞いています..." (Listening...) label appears with animated dots
**And** tapping again or silence detection stops recording

**Given** speech recognition completes
**When** the Japanese text is detected (e.g., "辛くしないでください")
**Then** a Japanese input bubble appears left-aligned (light Navy tint background)
**And** a Vietnamese output bubble appears right-aligned (light Teal tint) with translation (e.g., "Làm ơn đừng cho cay")
**And** a katakana pronunciation guide appears below the Vietnamese text (e.g., "ラム ウン ドゥン チョー カイ")
**And** a teal speaker playback button (36px) appears on the Vietnamese bubble

**Given** I tap the speaker playback button (FR27)
**When** audio generates
**Then** the Vietnamese text is spoken aloud at elevated volume (for showing to staff)
**And** the speaker icon animates with sound waves during playback

**Given** I tap "スタッフに見せる" (Show to staff)
**When** the full-screen mode opens
**Then** the Vietnamese text displays full-screen in large font (36px bold), white background, landscape-friendly
**And** a "戻る (Back)" button at top returns to the conversation view

**Given** I tap the ↔ swap icon
**When** the language direction swaps to VI→JA
**Then** I can now record Vietnamese input and receive Japanese translation (for understanding server responses)

**Given** the conversation history
**When** multiple exchanges occur
**Then** all translation pairs are preserved in a scrollable list for the session
**And** a "クリア" (Clear) button at top resets the conversation

**Given** auto-translated content (FR29)
**When** any translation displays
**Then** a small disclaimer appears: "機械翻訳です" (Machine translation) in caption text

### Story 6.2: Phrase Packs & Phrasebook

As a Japanese user in a specific situation (restaurant, salon, hospital),
I want one-tap access to common phrases with instant translation and audio,
So that I can communicate quickly without speaking into the microphone every time.

**Acceptance Criteria:**

**Given** I am on the Voice translation tab (FR28)
**When** quick phrases are displayed above the mic button
**Then** a context label shows "🍜 レストランでよく使うフレーズ" (context-aware based on location/page)
**And** horizontal scrollable phrase chips display: おすすめは？, 辛くしないで, お会計, これは何ですか？, アレルギーがあります, とても美味しい！, もっと見る (+N)

**Given** I tap a phrase chip (e.g., "辛くしないで")
**When** the instant translation triggers
**Then** the translation pair appears in the conversation area (same as voice result)
**And** Vietnamese audio auto-plays immediately
**And** the chip briefly fills coral to confirm tap

**Given** I tap "アレルギーがあります" (I have allergies)
**When** the chip expands
**Then** sub-options display for specific allergens (エビ, ナッツ, 乳製品, etc.)
**And** selecting one translates the full phrase "I have a [allergen] allergy"

**Given** I tap "もっと見る"
**When** the full phrasebook opens (Phrasebook tab)
**Then** phrases are organized by category: レストラン, サロン, 病院, 市場, タクシー, ホテル, 緊急
**And** each category shows 10-20 pre-built phrases
**And** tapping any phrase shows translation + audio playback

**Given** the Text tab is selected
**When** I type Japanese text manually
**Then** a text input area appears with keyboard
**And** submitting translates to Vietnamese with the same bubble display format
**And** audio playback is available on the result

### Story 6.3: Visual Menu OCR Helper & Floating FAB

As a Japanese tourist looking at a Vietnamese menu,
I want to point my camera at the menu and see Japanese translations overlaid,
So that I can understand what dishes are available without asking anyone.

**Acceptance Criteria:**

**Given** I am on the translation page
**When** I tap "📷 メニューを翻訳" pill button (next to mic button)
**Then** the camera viewfinder opens full-screen with a translucent Navy top bar showing "メニュー翻訳"

**Given** the camera is pointed at a Vietnamese menu
**When** text regions are detected
**Then** semi-transparent teal bounding boxes highlight detected Vietnamese text (30% opacity)
**And** Japanese translation labels appear adjacent to each detected phrase (Navy pill with white text)

**Given** a detected phrase contains allergen-related terms (FR58)
**When** the translation processes
**Then** the allergen term is flagged with a warning icon (⚠️) and red highlight
**And** a note indicates "アレルゲン注意 — 人間による翻訳確認が推奨されます"

**Given** I tap a translated region
**When** the detail tooltip opens
**Then** a white card shows: full Vietnamese phrase, Japanese translation, pronunciation (katakana), and audio playback button

**Given** I tap "撮影して保存" (Capture and save)
**When** the frame freezes
**Then** the annotated image (with Japanese overlays) is saved to the session for later reference

**Given** I tap ✕ or swipe down
**When** the camera closes
**Then** I return to the voice translation mode

**Given** I am on any non-translation page
**When** I see the floating translation FAB
**Then** a coral FAB (56px circle, white mic icon) is positioned bottom-right, 16px from edge, above bottom tab nav
**And** tapping opens the translation tool as a bottom sheet (60vh height)
**And** long-pressing starts voice input immediately
**And** swiping up the bottom sheet expands to full translation page
**And** a small teal dot on the FAB indicates an active translation session with history

---

## Epic 7: Deals, Coupons & Notifications

Users can browse, claim, and redeem coupons with QR codes, receive in-app notifications for reviews, events, milestones, and expiring coupons, and manage their notification preferences.

### Story 7.1: Deals & Coupons Browsing

As a Japanese tourist looking for deals,
I want to browse available coupons by category and location with savings shown in JPY,
So that I can find exclusive deals and save money during my trip.

**Acceptance Criteria:**

**Given** I navigate to the deals page at `/ja/deals` (FR61)
**When** the page loads
**Then** filter chips display: すべて, レストラン, カフェ, スパ, 近くのお得 (nearby)
**And** coupon cards display in a list/grid with: business photo, deal description (Japanese), savings amount in JPY (e.g., "¥500お得"), original/discounted price in dual currency, expiry countdown (e.g., "残り3日"), business name with senpai badge if verified

**Given** I tap the "近くのお得" filter chip
**When** location permission is granted
**Then** coupons sort by proximity to my current location
**And** distance is shown on each card (e.g., "500m")

**Given** I tap a coupon card
**When** the coupon detail modal/bottom sheet opens (UX-DR13)
**Then** full details display: business photo gallery, deal description, terms and conditions, validity period, QR code preview (blurred until claimed), business location on mini map, "クーポンを取得" (Get Coupon) CTA button

**Given** no coupons match the selected filter
**When** the empty state displays
**Then** a friendly message shows with illustration: "お得情報はまだありません" and a "すべてを見る" CTA

### Story 7.2: Coupon Claim & Redemption

As a Japanese user with a coupon,
I want to claim and redeem coupons at businesses using a QR code,
So that I can receive the discount and the business can verify the redemption.

**Acceptance Criteria:**

**Given** the backend coupon module
**When** database migrations run
**Then** tables are created: coupons (listing_id, title_ja, title_vi, discount_type, discount_value, max_redemptions, valid_from, valid_until, created_at), coupon_redemptions (coupon_id, user_id, redeemed_at, status)
**And** Redis counters track real-time redemption counts per coupon

**Given** I tap "クーポンを取得" on a coupon detail (FR62)
**When** I am logged in
**Then** the coupon is claimed to my account
**And** a unique QR code generates for my redemption
**And** the QR code displays clearly with "お店で見せてください" (Show at the store) instruction

**Given** I am at the business and tap "使用する" (Redeem)
**When** the redemption confirmation dialog appears
**Then** I must confirm: "このクーポンを使用しますか？" (Use this coupon?)
**And** upon confirmation, a confetti animation plays followed by a green checkmark
**And** the coupon status changes to "使用済み" (Used)
**And** a coupon.redeemed event fires (triggers analytics + BO notification)

**Given** I navigate to My Coupons at `/ja/deals?tab=mine`
**When** the page loads
**Then** two tabs display: "使える" (Active) and "使用済み" (Used)
**And** active coupons show QR code + expiry countdown
**And** used coupons show grayed card with "使用済み" stamp overlay

**Given** I am not logged in and tap "クーポンを取得"
**When** the auth check triggers (FR53)
**Then** the signup modal appears, and after login, the claim completes

**Given** user activity logging (FR56)
**When** I claim or redeem a coupon
**Then** the activity is logged in activity_logs table (user_id, action_type, metadata, created_at)

### Story 7.3: Notification System & Preferences

As a registered user,
I want to receive relevant notifications and control my notification preferences,
So that I stay informed about things I care about without being overwhelmed.

**Acceptance Criteria:**

**Given** the backend notification module
**When** database migrations run
**Then** tables are created: notifications (user_id, type, title_ja, body_ja, link, is_read, created_at), notification_preferences (user_id, category, frequency)

**Given** various platform events occur (FR67)
**When** relevant triggers fire
**Then** in-app notifications are created for:
**And** new review on a listing I saved → "保存した「[listing name]」に新しいレビューが投稿されました"
**And** event update (time change, cancellation) → "参加予定の「[event name]」が更新されました"
**And** contribution milestone (FR25) → "おめでとう！先輩バッジを獲得しました 🎉"
**And** coupon near expiry → "クーポン「[coupon name]」があと24時間で期限切れです"

**Given** I navigate to the notification center at `/ja/profile/notifications` (FR68)
**When** the page loads
**Then** a notification list displays with: icon, title, body, relative timestamp, read/unread state
**And** unread notifications have a subtle background highlight
**And** tapping a notification marks it as read and navigates to the linked content

**Given** the notification preferences section (UX-DR44)
**When** I view preference controls
**Then** category toggles display for: レビュー (Reviews), イベント (Events), コミュニティ (Community), お得情報 (Deals), マイルストーン (Milestones)
**And** a frequency selector offers: リアルタイム (Real-time), 毎日まとめ (Daily digest), オフ (Off)
**And** changes save automatically with a brief toast confirmation

**Given** the unified polling endpoint
**When** I am logged in and browsing the platform
**Then** `GET /api/v1/sync` returns unread notification count at adaptive intervals
**And** the bottom tab nav Profile icon shows a notification badge with unread count
**And** 304 Not Modified is returned when no new notifications exist (bandwidth-efficient)

---

## Epic 8: Business Owner Portal

Vietnamese business owners can register, create/edit listings with auto-translation to Japanese, upload photos, manage coupons, view analytics dashboard, and track revenue — all in a Vietnamese-only UI.

### Story 8.1: Listing Editor — Create & Edit with Auto-Translation

As a Vietnamese business owner,
I want to create a listing in Vietnamese and have it auto-translated to Japanese with a live preview,
So that Japanese customers can find my business without me needing to know Japanese.

**Acceptance Criteria:**

**Given** I am logged in as BusinessOwner and navigate to `/business/vi/listings/new` (FR31, FR72)
**When** the listing editor loads
**Then** a 3-step progress header shows: "① Thông tin · ② Ảnh & Menu · ③ Xem trước"
**And** estimated time displays: "⏱️ Khoảng 10-15 phút"
**And** the entire UI is in Vietnamese (FR64)

**Given** Step 1 — Basic Information
**When** I fill in the form
**Then** fields include: Tên doanh nghiệp (required), Danh mục (dropdown: Nhà hàng, Quán cà phê, Spa, Khách sạn, Tour, Dịch vụ khác), Địa chỉ (with Google Places auto-suggest), Số điện thoại (required), Giờ mở cửa (with quick presets), Mô tả ngắn (optional, max 200 chars), Zalo liên hệ (optional)
**And** all inputs have 48px height for touch-friendliness
**And** required fields show red asterisk, error states show Vietnamese messages
**And** tapping "Tiếp theo" validates and advances to Step 2

**Given** Step 2 — Photos & Menu (FR33)
**When** I upload business photos
**Then** a photo grid shows uploaded images, first marked "Ảnh bìa" (Cover)
**And** I can reorder by dragging and remove with ×
**And** minimum 3 photos required, maximum 10

**Given** Step 2 — Menu OCR
**When** I tap "📷 Chụp ảnh thực đơn" and photograph my menu
**Then** OCR processing shows spinner "Đang nhận dạng menu..." (3-5 seconds)
**And** results display as an editable table: Món ăn (VI) | Dịch sang tiếng Nhật (JP) | Giá
**And** each row has a confidence indicator: ✅ (high) or ⚠️ (review suggested)
**And** I can tap any cell to correct OCR errors
**And** "＋ Thêm món" adds an empty row

**Given** Step 3 — Preview & Publish (FR34)
**When** the preview step loads
**Then** a split view shows: Vietnamese editor (left/top) and Japanese customer preview (right/bottom)
**And** the Japanese preview shows a live-updating senpai-card with: cover photo, business name in katakana, price range in dual currency, category tag
**And** a scrollable menu preview shows dishes in Japanese with ¥ prices
**And** a 🔄 refresh icon re-triggers translation

**Given** I tap "Đăng tin ngay" (Publish)
**When** form validation passes
**Then** the listing is published and a listing.created event fires (triggers translation pipeline → search indexing)
**And** a full-screen success overlay shows: animated green checkmark, "Tin đăng đã được đăng thành công! 🎉", link to view listing
**And** a next-step prompt card appears: "💡 Tạo coupon để thu hút khách hàng đầu tiên!"
**And** "Tạo Coupon ngay →" CTA navigates to coupon manager
**And** "Bỏ qua" skip link goes to dashboard

**Given** I want to edit an existing listing
**When** I navigate to `/business/vi/listings/[listing_id]/edit`
**Then** the same 3-step form loads pre-filled with existing data
**And** I can review and edit the Japanese translation directly (FR34)
**And** saving fires a listing.updated event

### Story 8.2: Photo Upload & Media Management (Business)

As a Vietnamese business owner,
I want to upload photos of my business with camera capture,
So that Japanese customers see authentic, verified photos of my establishment.

**Acceptance Criteria:**

**Given** I am on Step 2 of the listing editor (FR32)
**When** I tap the upload area (dashed border + "＋" icon)
**Then** the device camera roll/picker opens (allowing camera capture)
**And** selected photos are uploaded to the server

**Given** a photo is uploaded
**When** the backend processes it
**Then** EXIF metadata is validated to confirm camera origin
**And** the photo is compressed and optimized for web (WebP, max 1200px)
**And** the optimized photo is uploaded to DigitalOcean Spaces with CDN URL
**And** a thumbnail is generated for the photo grid

**Given** I have uploaded multiple photos
**When** I view the photo grid
**Then** the first photo is marked "Ảnh bìa" (Cover) with a badge
**And** I can drag to reorder photos
**And** tapping × on a photo shows a brief confirmation before removing
**And** the cover photo changes if the first photo is removed

**Given** upload limits
**When** I have uploaded 10 photos
**Then** the upload button is disabled with message "Đã đạt tối đa 10 ảnh"

### Story 8.3: Coupon Management (Business)

As a Vietnamese business owner,
I want to create and manage coupons with a Japanese customer preview,
So that I can attract Japanese customers with deals they can understand and redeem.

**Acceptance Criteria:**

**Given** I navigate to `/business/vi/coupons/new` (FR35)
**When** the coupon creation form loads
**Then** a Vietnamese form displays with fields: discount type (% off / fixed amount / free item), discount value, coupon title (Vietnamese), description (Vietnamese), validity period (start/end date), maximum redemptions
**And** a live Japanese customer preview card updates as I type (UX-DR41)

**Given** I fill in coupon details and submit
**When** I tap "Tạo Coupon"
**Then** the coupon is created and auto-translated to Japanese
**And** a success toast shows "Coupon đã được tạo thành công"
**And** the coupon appears in my active coupons list

**Given** I navigate to the coupon manager at `/business/vi/coupons`
**When** the page loads
**Then** coupons display in two sections: "Đang hoạt động" (Active) and "Đã hết hạn" (Expired)
**And** each coupon card shows: title, discount, validity dates, redemption count, status badge (Active/Expired/Draft)

**Given** I want to deactivate a coupon
**When** I tap the deactivate option on an active coupon
**Then** a confirmation dialog appears in Vietnamese
**And** upon confirmation, the coupon status changes to inactive
**And** the coupon is no longer visible to Japanese users

**Given** I want to edit a coupon
**When** I tap edit on a coupon
**Then** the form opens pre-filled with existing data
**And** the Japanese preview updates live as I make changes

### Story 8.4: Business Analytics Dashboard

As a Vietnamese business owner,
I want to see how my listing performs and track revenue,
So that I can measure the value of being on DaNangNavi and make data-driven decisions.

**Acceptance Criteria:**

**Given** I navigate to `/business/vi/dashboard` (FR36)
**When** the dashboard loads
**Then** status cards show at the top: listing status (Active/Draft), coupon status (X active), overall views count
**And** the entire UI is in Vietnamese (FR64)

**Given** analytics data exists
**When** I view the metrics section
**Then** analytics display: total views, saves/favorites count, review count with average rating, coupon redemptions count
**And** a simple time-series chart shows views over the last 30 days
**And** data is fetched from `GET /api/v1/analytics/business/me`

**Given** this is a new dashboard with no data
**When** the empty state displays
**Then** metric cards show "0" with help tooltip icons explaining what each metric tracks (UX-DR42)
**And** a help card suggests: "Chia sẻ link đăng tin của bạn để thu hút khách hàng đầu tiên"

**Given** revenue tracking is available (FR37)
**When** I view the revenue section
**Then** revenue metrics show: total ad spend, commission breakdown, payment history
**And** each payment entry shows: date, amount, type, status

**Given** I want to export my analytics (FR70)
**When** I tap "Xuất dữ liệu" (Export Data)
**Then** a CSV file downloads with all analytics data for the selected period

**Given** I receive a fake review (FR38)
**When** I tap "Khiếu nại đánh giá" (Report Review) on my reviews section
**Then** a complaint form opens with fields: review link, reason (dropdown), evidence description
**And** submitting creates a dispute case and shows confirmation "Khiếu nại đã được gửi"

**Given** an activity feed section
**When** I scroll down
**Then** recent activities display: new reviews, coupon redemptions, listing views milestones
**And** each entry has an icon, description in Vietnamese, and relative timestamp

---

## Epic 9: Admin Panel & Platform Governance

Admins can manage users and business owners, moderate content with automated filters and human review queue, process fake review disputes, manage staff with RBAC roles, run business verification workflows, and generate platform reports with CSV export.

### Story 9.1: Admin Dashboard & Platform Analytics

As a platform admin,
I want to see a comprehensive dashboard with traffic, revenue, and engagement metrics,
So that I can monitor platform health and make data-driven decisions.

**Acceptance Criteria:**

**Given** I am logged in as Admin and navigate to `/admin/dashboard` (FR39)
**When** the dashboard loads
**Then** top-level KPI cards display: total daily visits, total registered users, total businesses, total active coupons, total revenue (current month)

**Given** the dashboard metrics section
**When** I view engagement metrics
**Then** charts and figures show: daily visits trend (30-day line chart), popular sections breakdown (pie chart), user engagement metrics (reviews/day, posts/day, event registrations/day), new user registration trend

**Given** the dashboard
**When** I view the revenue section
**Then** revenue metrics show: total revenue, ad revenue, commission revenue, month-over-month growth
**And** a breakdown by business category is available

**Given** the admin layout
**When** the page renders
**Then** a sidebar navigation shows role-appropriate menu items based on my admin sub-role
**And** the UI supports English/Vietnamese toggle

### Story 9.2: User & Business Owner Management

As a platform admin,
I want to manage user and business owner accounts with verification workflows,
So that I can maintain platform quality and trust.

**Acceptance Criteria:**

**Given** I navigate to `/admin/users` (FR40)
**When** the user management page loads
**Then** a searchable, sortable table displays: display name, email, role, registration date, status (Active/Suspended/Banned), senpai level, last active date
**And** I can search by name or email
**And** pagination supports large user lists

**Given** I select a user
**When** I view their detail panel
**Then** full profile info displays: account details, activity summary (reviews, posts, events), moderation history
**And** action buttons show: "Suspend" (with reason input), "Ban" (with reason input + confirmation), "Reactivate"

**Given** I navigate to `/admin/users/businesses` (FR41)
**When** the business management page loads
**Then** a table displays: business name, owner name, category, registration date, verification status (Pending/Verified/Rejected/Suspended), listing count

**Given** a business has "Pending" verification status (FR48)
**When** I click to manage verification
**Then** a verification workflow panel shows: business details, submitted documents, photos
**And** I can: "Schedule Visit" (date picker), "Verify" (approve with notes), "Reject" (with reason template)
**And** verification status changes trigger a notification to the business owner

**Given** I suspend or ban an account
**When** the action completes
**Then** an audit log entry is created: timestamp, admin actor, action, reason (NFR17)
**And** the affected user is notified

### Story 9.3: Content Moderation & Auto-Filtering

As a platform admin,
I want automated content filtering and a human review queue,
So that harmful content is caught quickly while minimizing false positives.

**Acceptance Criteria:**

**Given** the backend moderation module (FR42)
**When** database migrations run
**Then** tables are created: moderation_items (content_type, content_id, flag_reason, status, reviewer_id, reviewed_at), banned_keywords (keyword, language, severity)
**And** seed data populates an initial banned keywords list for Japanese and Vietnamese

**Given** a user creates a review, post, or comment
**When** the content is submitted
**Then** the moderation pipeline automatically: checks text against banned keywords list, runs spam detection scoring, flags content exceeding thresholds
**And** flagged items are added to the moderation queue with flag reason

**Given** I navigate to `/admin/moderation` (FR43)
**When** the moderation queue loads
**Then** flagged items display in a priority-sorted list: content preview, flag reason, author info, flagged date, content type (review/post/comment)
**And** filter options: All, Spam, Keywords, Image, Unreviewed

**Given** I review a flagged item
**When** I select it
**Then** full content displays with the flagged portions highlighted
**And** action buttons show: "Approve" (removes flag, content stays), "Remove" (with reason template dropdown: spam, harassment, inappropriate, misinformation, other)
**And** removing content soft-deletes it and notifies the author

**Given** I need to escalate an issue (FR45)
**When** I tap "Escalate"
**Then** a role selector shows available admin sub-roles (content lead, technical, business relations)
**And** I can add an escalation note
**And** the item is reassigned with priority bump

### Story 9.4: Fake Review Disputes & Resolution

As a platform admin,
I want to investigate and resolve fake review complaints from business owners,
So that review integrity is maintained and business owners trust the platform.

**Acceptance Criteria:**

**Given** a business owner files a fake review complaint (from Epic 8, Story 8.4)
**When** I navigate to `/admin/moderation/disputes` (FR44)
**Then** a dispute case list displays: business name, disputed review snippet, complaint reason, filing date, status (Open/Investigating/Resolved)

**Given** I open a dispute case
**When** the detail panel loads
**Then** I see: the full review content, reviewer profile and history, business owner's complaint with evidence, review metadata (creation date, edit history)

**Given** I investigate the dispute
**When** I determine the review is fake
**Then** I can: "Confirm Fake" → soft-delete the review, notify the business owner of resolution, add warning/ban to the violating reviewer
**And** the business owner receives a notification: "Khiếu nại của bạn đã được giải quyết"

**Given** I determine the review is legitimate
**When** I close the dispute
**Then** I can: "Reject Complaint" → mark dispute as resolved, notify business owner with explanation
**And** the review remains published

**Given** any dispute resolution action
**When** the action completes
**Then** an audit log entry records: timestamp, admin, dispute_id, action taken, reason

### Story 9.5: Staff Management, RBAC & Reporting

As a platform admin,
I want to manage staff accounts with role-based access and generate platform reports,
So that the right people have the right access and stakeholders receive regular performance updates.

**Acceptance Criteria:**

**Given** I navigate to `/admin/staff` (FR46)
**When** the staff management page loads
**Then** a table displays: staff name, email, admin sub-role, last active, status
**And** I can: invite new staff (email), assign/change sub-roles, deactivate accounts

**Given** admin sub-roles (FR51)
**When** roles are assigned
**Then** three sub-roles are available: "Content Lead" (moderation queue, content management), "Technical" (platform settings, monitoring), "Business Relations" (BO verification, dispute resolution)
**And** sidebar navigation menu items are filtered based on the assigned sub-role
**And** API endpoints enforce sub-role checks on every request (NFR16)

**Given** I navigate to `/admin/reports` (FR47)
**When** the reporting page loads
**Then** report templates are available: Weekly Summary, Monthly Summary, Moderation Volume
**And** each template shows: configurable date range, preview of included metrics

**Given** I generate a report
**When** I select a template and date range and tap "Generate"
**Then** a report displays with: traffic metrics, revenue breakdown, user growth, moderation stats, top listings, top community threads
**And** charts and tables render inline

**Given** I want to export a report (FR69)
**When** I tap "CSV出力" / "Xuất CSV" (Export CSV)
**Then** a CSV file downloads containing all report data with proper headers and formatting
**And** date/time values follow ISO 8601 format

---
