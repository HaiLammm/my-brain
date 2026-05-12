# Epic List

## Epic 1: Platform Foundation, Authentication & Design System
Users can access the platform, register/login via LINE, Google, or Zalo social login, and the shared design system + infrastructure is ready for all subsequent development.
**FRs covered:** FR8, FR30, FR49, FR50, FR52, FR53, FR54, FR55, FR57, FR74
**UX-DRs covered:** UX-DR1-5 (design tokens), UX-DR6 (bottom tab nav), UX-DR14 (CTA button), UX-DR15-19 (section header, empty state, toast, signup modal, modal/bottom sheet), UX-DR21 (sticky action bar), UX-DR22-24 (accordion, save heart, segmented control), UX-DR26-27 (success banner, status badge), UX-DR43 (sign up/login), UX-DR45-46 (skeleton loading, i18n strategy)
**Architecture:** Turborepo monorepo, Next.js 16 hybrid app (route groups), FastAPI modular backend, Docker Compose (6 services), PostgreSQL, Redis, Meilisearch, Nginx, CI/CD, structured logging
**Stories:** 1.1 Monorepo Setup, 1.2 Design Tokens & Core UI, 1.3 Layout Shell & Nav, 1.4 User Auth (Social Login), 1.5.1 Zalo Social Login (Users), 1.5.2 BO Registration (Email + Zalo), 1.6 Privacy & Account Mgmt

## Epic 2: Discovery, Search & Listing Experience
Japanese users can browse the homepage with senpai picks and deals, search/filter listings with cross-language support, view detailed listing pages with dual-currency pricing, fair-price indicators, photo galleries, area guides, and save favorites.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR59, FR60, FR63, FR65, FR66, FR71
**UX-DRs covered:** UX-DR7 (search bar), UX-DR9 (fair price indicator), UX-DR10 (dual price display), UX-DR11 (filter chips), UX-DR12 (senpai/listing card), UX-DR20 (interactive map), UX-DR28 (homepage), UX-DR30 (area guide), UX-DR31 (search/browse), UX-DR32 (listing detail)
**Stories:** 2.1 Listing Data Model & API, 2.2 Homepage, 2.3 Search & Browse, 2.4 Listing Detail, 2.5 Area Guides, 2.6 Favorites

## Epic 3: User Onboarding & Senpai Profile System
New users complete a personalized onboarding flow (newcomer checklist or tourist guide), build their profile, earn contribution points through platform activity, and progress through senpai badge levels (Newcomer → Contributor → Senpai → Expert Senpai).
**FRs covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR73
**UX-DRs covered:** UX-DR8 (senpai badge), UX-DR25 (senpai tip card), UX-DR29 (onboarding flow), UX-DR36 (user profile)
**Stories:** 3.1 Newcomer Onboarding Flow, 3.2 User Profile Page, 3.3 Contribution Points & Gamification, 3.4 Senpai Badge System

## Epic 4: Reviews & Content Creation
Users can write reviews with star ratings and camera-only photos, vote reviews as helpful, and senpai-badged reviews appear prominently in Senpai Picks sections across the platform.
**FRs covered:** FR15, FR16, FR17, FR18, FR19
**UX-DRs covered:** Review section in listing detail, photo upload with EXIF validation, helpful vote UX
**Stories:** 4.1 Write Review with Photos, 4.2 Helpful Votes & Display, 4.3 Senpai Picks

## Epic 5: Community & Events
Users can browse community groups, join discussions, create posts and comments, view and register for community events and meetups — building the senpai community that powers the platform.
**FRs covered:** FR20, FR21, FR22, FR23, FR24
**UX-DRs covered:** UX-DR33 (community hub), UX-DR34 (community thread), UX-DR35 (events & meetups)
**Stories:** 5.1 Community Hub & Groups, 5.2 Join Groups & Post, 5.3 Thread Detail, 5.4 Events & Meetups

## Epic 6: Communication Bridge & Translation Tools
Users can use voice translation, text translation, camera menu OCR, and pre-built phrase packs organized by context (restaurant, salon, hospital) to communicate across the Japanese-Vietnamese language barrier.
**FRs covered:** FR26, FR27, FR28, FR29, FR58
**UX-DRs covered:** UX-DR38 (translation tools page with voice/text/phrasebook/camera OCR), floating translation FAB
**Stories:** 6.1 Voice Translation & Conversation, 6.2 Phrase Packs & Phrasebook, 6.3 Menu OCR & Floating FAB

## Epic 7: Deals, Coupons & Notifications
Users can browse, claim, and redeem coupons with QR codes, receive in-app notifications for reviews, events, milestones, and expiring coupons, and manage their notification preferences.
**FRs covered:** FR25, FR56, FR61, FR62, FR67, FR68
**UX-DRs covered:** UX-DR13 (coupon card), UX-DR39 (deals & coupons page), UX-DR44 (notification center)
**Stories:** 7.1 Deals & Coupons Browsing, 7.2 Coupon Claim & Redemption, 7.3 Notification System & Preferences

## Epic 8: Business Owner Portal
Vietnamese business owners can register, create/edit listings with auto-translation to Japanese, upload photos, manage coupons, view analytics dashboard, track revenue — all in a Vietnamese-only UI with a step-by-step wizard for first listing creation.
**FRs covered:** FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR64, FR70, FR72
**UX-DRs covered:** UX-DR40 (listing editor), UX-DR41 (coupon manager), UX-DR42 (business dashboard)
**Stories:** 8.1 Listing Editor & Auto-Translation, 8.2 Photo Upload & Media, 8.3 Coupon Management, 8.4 Analytics Dashboard

## Epic 9: Admin Panel & Platform Governance
Admins can manage users and business owners, moderate content with automated filters and human review queue, process fake review disputes, manage staff with RBAC roles, run business verification workflows, and generate platform reports with CSV export.
**FRs covered:** FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR51, FR69
**UX-DRs covered:** Admin dashboard, moderation queue, user/BO management, dispute manager, staff manager, report generator pages
**Stories:** 9.1 Admin Dashboard, 9.2 User & BO Management, 9.3 Content Moderation, 9.4 Fake Review Disputes, 9.5 Staff RBAC & Reporting

## Epic 10: Journey-Based Discovery (Google Maps Integration)
Japanese users input origin → destination, see route drawn on Google Maps with up to 3 alternatives, discover internal DaNangNavi listings matched along the polyline (within 300m buffer), filter by route personality (food / scenic / fastest), and see active deals for listings along the way. Realizes Top Breakthrough #1 from the brainstorming session.
**FRs covered:** FR75, FR76, FR77, FR78, FR79, FR80
**UX-DRs covered:** UX-DR47 (journey input & route map page with listings-along-route bottom sheet)
**Architecture:** Google Maps JS API + Directions API (server proxy + Redis cache 24h TTL), PostGIS `ST_DWithin`/`ST_Buffer` for polyline buffer matching, new `journey/` backend module, server-side + browser API keys with referrer/IP restrictions
**Dependencies:** Epic 2 (listing data), Epic 7 (Deals for Story 10.6)
**Principle:** Closed-data — Google Maps provides navigation layer only; 100% listing content is internal DaNangNavi data
**Stories:** 10.1 Google Maps & Route API Foundation, 10.2 Journey Input & Route Display, 10.3 Route-Aware Listing Matching, 10.4 Listings Along Route UI, 10.5 Route Personality Scoring, 10.6 Journey Deals Integration

---
