---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments:
  - 'A-Product-Brief/project-brief.md'
  - 'brainstorming/brainstorming-session-2026-04-05-1710.md'
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 1
  projectDocs: 0
classification:
  projectType: 'web_app'
  domain: 'Local Commerce & Lifestyle Platform'
  complexity: 'high'
  projectContext: 'greenfield'
---

# Product Requirements Document — DaNangNavi

**Author:** Lem
**Date:** 2026-04-09

## Executive Summary

DaNangNavi is a community-powered local life and discovery platform exclusively serving the Japanese community in Da Nang, Vietnam. As Japanese tourism and long-term relocation to Vietnam accelerates, no dedicated platform provides trustworthy, actionable local information for this growing population. Current alternatives — TikTok, Danang Holic, Google Search, word-of-mouth — either inspire without enabling action, or provide one-way editorial content without community trust.

DaNangNavi solves two fundamental needs simultaneously: **reliable local information** and **community connection**. The platform is built on a senpai (trusted long-term resident) model where experienced Japanese expats share verified reviews, guides, and tips — creating an "asking a knowledgeable friend" experience at scale. The B2B2C model provides free access for Japanese users while monetizing through advertising, traffic, and service fees from Vietnamese business owners who want to reach Japanese customers.

### What Makes This Special

The core "aha moment": a new user opens DaNangNavi and sees a senpai — a real Japanese person who has lived in Da Nang for years — reviewing a restaurant nearby. Trust is instant because the reviewer shares their background, taste preferences, and expat experience. This is fundamentally different from anonymous Google reviews or curated editorial content.

The competitive moat is a self-reinforcing flywheel: more senpai sharing → better content → more newcomers → more future senpai. This network effect cannot be replicated by editorial-first competitors. Combined with closed-data philosophy (100% internal content, no imported data), a built-in communication bridge ("press to speak" voice translation), and Da Nang-deep expertise rather than geographic breadth, DaNangNavi occupies a unique position no existing platform addresses.

## Project Classification

| Attribute | Value |
|-----------|-------|
| Project Type | Web Application (Next.js SSR + FastAPI backend) |
| Domain | Local Commerce & Lifestyle Platform |
| Complexity | High — three-sided platform (end user JP + business owner VN + admin), multilingual (JP/VN), community UGC with moderation, location-based services |
| Project Context | Greenfield — new product, no existing codebase |

## Success Criteria

### User Success (Japanese End Users)

- Find a restaurant and save it to favorites within 3 minutes of first use
- Build a personal collection of favorite places for ongoing reference
- Connect directly with Vietnamese business owners through in-app communication (chat/voice translation)
- Discover and join the local Japanese community in Da Nang — feel "I'm not alone here"
- Senpai reviews visible on first session — instant trust signal

### Business Success

| Metric | Month 1 | Month 6 |
|--------|---------|---------|
| Daily visits | 5,000 | 50,000 |
| Business registrations | 50 | 300 |
| Community comments/day | 1,000 | 10,000 |

### Admin Success

- **Dashboard analytics**: Customer data management, per-user preference tracking, page-level access statistics, ad revenue reporting
- **HR & customer management**: Staff role management, business owner account management, user management
- **Automation tools**: Banned keyword filters, AI-powered NSFW image detection, spam scanning — machine handles repetitive work, Admin only handles edge cases
- **Role-based Access Control (RBAC)**: Granular permissions for admin team members
- **Moderation response time**: Target 2-4 hours, maximum 48 hours for all flagged content

### Technical Success

- Full platform MVP covering all 4 roles (Guest, User, BusinessOwner, Admin) end-to-end
- Next.js SSR for SEO performance
- FastAPI backend with real data for MVP
- Responsive design (mobile-first for end users, desktop-optimized for dashboards)

### Measurable Outcomes

| Outcome | Metric | Target |
|---------|--------|--------|
| User retention | 7-day return rate | >30% |
| Search effectiveness | Find-to-save conversion | >15% |
| Community engagement | Active senpai contributors/month | >50 |
| Business satisfaction | Listing completion rate | >80% |
| Moderation SLA | Flagged content resolved <48h | 100% |

## User Journeys

### Journey 1: Tanaka-san — The Newcomer's First Week

**Persona:** Tanaka Kenji, 35, IT engineer transferred to Da Nang office. Arrived 3 days ago. Knows zero Vietnamese. His apartment fridge is empty and he's tired of convenience store onigiri.

**Opening Scene:** Tanaka-san searches Google for "ダナン 日本人 おすすめ レストラン" (Da Nang Japanese recommended restaurant). DaNangNavi appears in results. He clicks through and sees a clean, Japanese-friendly interface.

**Rising Action:** The homepage shows "Senpai Picks Near You" — he sees Yamamoto-san (3 years in Da Nang, food lover) recommending a bún chả cá place 800m away. The review is in natural Japanese, with real photos, dual-currency pricing (45,000₫ ≈ ¥270), and a "Japanese-friendly" badge. Tanaka-san taps the heart icon to save it. He browses more listings, saves 5 restaurants to his favorites collection.

**Climax:** He notices the Community section — "Da Nang Japanese Expats" group with 847 members. He joins and sees a post: "Weekend BBQ at My Khe beach — newcomers welcome!" For the first time since arriving, he feels like he's not alone. He signs up for the event.

**Resolution:** By end of week one, Tanaka-san has 12 saved places, joined 3 community groups, attended the BBQ where he met his future regular drinking buddies, and used the voice translation feature to order phở by himself. DaNangNavi is now his daily companion app. Three months later, he writes his first senpai review.

**Requirements revealed:** Homepage with senpai picks, search/discovery, save/favorites, listing detail with dual-currency, community groups, event registration, user profile, voice translation, onboarding flow, SEO optimization for Japanese search terms.

### Journey 2: Yamada-san — From Tourist to Senpai

**Persona:** Yamada Yuki, 28, office lady from Tokyo. First trip to Da Nang. Lands at the airport at 14:00, starving and anxious about being overcharged.

**Opening Scene:** At the airport, Yamada-san sees a DaNangNavi poster (offline campaign) with QR code: "Da Nang guide for Japanese travelers — free coupons inside." She scans it on her phone.

**Rising Action:** The app shows "First Time in Da Nang?" onboarding — a 24-hour guide: SIM card, money exchange, taxi tips, and nearby restaurants with verified fair pricing and first-visit coupons. She uses the voice translation to order her first meal. Over 5 days, she saves 20 places, uses 4 coupons, and writes 3 quick reviews.

**Turning Point:** Back in Tokyo, she keeps checking DaNangNavi — reading community posts, commenting on new listings. Her contribution points start growing: +5 per review, +2 per helpful comment, +10 for photo with camera verification. She notices her profile shows "Contributor Level 2 — 85 points." She plans her second trip.

**Climax:** On her 4th visit to Da Nang (6 months later), Yamada-san hits 500 contribution points. The system awards her **Senpai badge** — "Yamada Yuki ⭐ Senpai — Da Nang Expert." Her reviews now appear in "Senpai Picks." She gets a notification: "Tanaka-san saved your restaurant recommendation!" She feels pride — she's become the trusted guide she once needed.

**Resolution:** The flywheel completes: tourist attracted by senpai content → becomes senpai → attracts next tourist.

**Requirements revealed:** Contribution point system, point thresholds for senpai recognition, badge/level display on profile, senpai-tagged content in discovery feeds, notification system for contribution milestones, long-term engagement mechanics.

**Contribution Point System:**

| Action | Points |
|--------|--------|
| Write review | +5 |
| Helpful comment | +2 |
| Camera-verified photo | +10 |
| Community post | +3 |
| Event attendance | +15 |
| Referred new user | +20 |

| Level | Points | Badge |
|-------|--------|-------|
| Newcomer | 0 | 🆕 |
| Contributor | 100 | ⭐ |
| Senpai | 500 | 🏅 |
| Expert Senpai | 2,000 | 👑 |

### Journey 3: Chị Hương — The Business Owner's First Listing

**Persona:** Nguyen Thi Hương, 40, owns a popular bún chả cá restaurant in Hai Chau district. No English, no Japanese. A DaNangNavi sales rep visits her shop.

**Opening Scene:** The sales rep shows Chị Hương a demo on a tablet: "Japanese tourists and expats will find your restaurant here. Listing is 100% free. You just need photos and your menu." Chị Hương is skeptical but interested — she's seen more Japanese customers lately.

**Rising Action:** The sales rep helps her sign up on the Business Dashboard — entirely in Vietnamese. She uploads 5 photos taken directly from her phone camera (camera-only policy). She types her menu items in Vietnamese — the system auto-translates to Japanese. She sets business hours, adds her address (auto-pinned on map), and writes a short description: "Bún chả cá Đà Nẵng chính gốc, 30 năm." It appears in Japanese as "本場ダナンのブンチャーカー、30年の歴史."

**Climax:** One week later, she checks her dashboard: 142 views, 23 saves, 4 reviews (all positive, one from a senpai). She creates her first coupon: "10% off for DaNangNavi users" — takes 2 minutes.

**Resolution:** Within a month, Chị Hương sees a steady stream of Japanese customers showing DaNangNavi coupons. Her revenue from Japanese customers increases 40%. She becomes an advocate, referring 5 other businesses in her street.

**Requirements revealed:** Vietnamese-only business dashboard, camera-only photo upload, auto-translation (VN→JP), listing editor, business hours/location management, analytics dashboard, coupon creation tool.

### Journey 4: Admin Team — Morning Moderation Shift

**Persona:** Admin team of 3 — Linh (content lead), Duc (technical), Tuan (business relations). They manage the platform daily using role-based access.

**Opening Scene:** Linh starts her morning shift at 8:00. She opens the Admin Panel: 12 new flagged items, 3 new business registrations pending verification, platform stats showing 6,200 visits yesterday.

**Rising Action:** The automation system handled 80% of overnight activity: spam filter caught 45 spam comments (auto-deleted), AI image scanner flagged 2 photos as potentially inappropriate (queued for human review), keyword filter blocked 8 posts. Linh reviews the 12 items needing human judgment in 30 minutes.

**Climax:** Linh notices a pattern — several complaints about a listing claiming "Japanese staff available" but reviews say otherwise. She escalates to Tuan (business relations) with one click. Tuan schedules a re-verification visit. Duc checks the technical dashboard: API response times normal, CDN cache hit rate 94%.

**Resolution:** By 10:00, all flagged content resolved (within 2-hour SLA). Linh generates the weekly report: ad revenue up 12%, moderation volume declining (automation improving). The platform runs smoothly because automation handles the routine, humans handle the nuance.

**Requirements revealed:** Admin dashboard with overnight summary, automated moderation, human review queue with one-click actions, role-based access, escalation workflow, business verification management, platform analytics, reporting tools.

### Journey Requirements Summary

| Capability Area | Tanaka (Newcomer) | Yamada (Tourist→Senpai) | Chị Hương (Business) | Admin Team |
|----------------|-------------------|------------------------|----------------------|------------|
| Search & Discovery | ✓ | ✓ | | |
| Listing Detail | ✓ | ✓ | | |
| Save/Favorites | ✓ | ✓ | | |
| Community & Events | ✓ | ✓ | | ✓ (moderate) |
| Voice Translation | ✓ | ✓ | | |
| Contribution Points | | ✓ | | |
| Senpai Badge System | | ✓ | | |
| Coupon System | | ✓ (use) | ✓ (create) | |
| Business Dashboard | | | ✓ | |
| Auto-Translation | | | ✓ | |
| User Onboarding | ✓ | ✓ | | |
| Admin Panel | | | | ✓ |
| Automated Moderation | | | | ✓ |
| Analytics & Reporting | | | ✓ (basic) | ✓ (full) |
| RBAC | | | | ✓ |

## Domain-Specific Requirements

### Privacy & Data Protection

**Data Collection Scope:**
- User activity logs: clicks, likes, search queries by topic, browsing history
- Location data: GPS when app is active, location history stored for personalization
- Contribution data: reviews, photos, comments, community posts
- Business owner data: listing content, analytics access, financial transactions

**Storage & Compliance:**
- All data stored on Vietnam-based servers (Vietnam Cybersecurity Law 2018)
- APPI (Japan) considerations for Japanese user personal data — explicit consent required
- Clear privacy policy in both Japanese and Vietnamese
- Consent flow mandatory at registration — granular opt-in for location tracking and activity logging

**Location Privacy:**
- GPS collected only when app is actively open (not background tracking)
- Location history stored for personalized recommendations
- Users can disable location for non-location features (community, profile)
- Location data retention policy: define maximum storage period

### Content Moderation & Liability

**Moderation Framework:**
- Platform assumes moderation responsibility through Admin team
- Three separate Terms of Service: End User, Business Owner, Admin Staff
- Camera-only photo policy enforced at upload (EXIF metadata validation)

**Fake Review Dispute Process:**
1. Business owner files complaint through Business Dashboard
2. Admin team dispatched for on-site verification
3. Investigation and confirmation of findings
4. If confirmed fake: compensation to business owner + permanent account ban for violator
5. Resolution timeline: target 48 hours, maximum 7 days for on-site verification

**Content Liability:**
- Platform disclaimers for user-generated content accuracy
- Senpai badge does not imply platform endorsement — disclaimer in ToS
- Escalation path: platform mediates → external arbitration if unresolved

### Translation Accuracy & Safety

**Quality Standards:**
- Minimum 80% accuracy threshold before auto-translated content is published
- Food allergy and safety-critical terms flagged for human review
- Disclaimer on all auto-translated content: "This translation is auto-generated. Please verify with staff."

**Business Owner Review:**
- Business owners can review and edit Japanese translations of their listings
- Edit interface shows Vietnamese original alongside Japanese translation
- Changes flagged for quality check before publishing

**Safety-Critical Translation:**
- Menu items containing common allergens (peanuts, shellfish, gluten) auto-flagged
- Medical/health-related content requires human translation verification
- Emergency information (hospital, police) manually translated and verified

### Payment & Commerce (Post-MVP)

**Business Owner Agreement:**
- Digital agreement accepted at registration — covers listing terms, coupon commission rates, platform rules

**Revenue Collection:**
- Ad revenue payments: cash or bank transfer (VND) — flexible for small business owners
- No VAT invoice required from platform to business owners
- Coupon commission deducted automatically, visible in Business Owner Dashboard

**Business Owner Financial Dashboard:**
- Revenue tracking: ad spend, coupon redemptions, commission breakdown
- Payment history and upcoming payment schedule
- Revenue analytics: monthly trends, ROI per coupon campaign

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Senpai Trust Flywheel** — Community-powered trust system unique to the Japanese-in-Vietnam niche. Tourist → Contributor → Senpai growth loop. Trust earned through real contributions, not editorial curation.

**2. Context-Aware Voice Translation ("Press to Speak")** — Pre-built phrase packs organized by business context (restaurant, salon, hospital, market). Zero typing, zero language knowledge required.

**3. Closed-Data Philosophy** — 100% internal content with camera-only photo enforcement. Trust built through curation and verification rather than volume.

**4. Three-Sided Cultural Bridge** — Japanese users, Vietnamese business owners, and Admin team each operate in their native language. Auto-translation connects all three sides seamlessly.

**5. Contribution-Based Social Proof** — Gamification tied to real social authority. Senpai badges represent genuine local expertise verified by contribution history.

### Validation Approach

**Cold Start Strategy:**
1. Recruit 10-15 "Founding Senpai" from existing Japanese expat community (Facebook groups, community events). Incentive: permanent "Founding Senpai" badge + priority display.
2. Admin team creates 50-100 seed listings with high-quality reviews, tagged "DaNangNavi Staff Pick."
3. Sales team onboards 20-30 business owners directly with complete listings.

**Flywheel Tipping Point:**
- Target: 50 active senpai + 200 listings + 500 registered users
- Key metric: "organic content ratio" — user-created vs staff-created content
- Flywheel confirmed when organic content ratio exceeds 60%

### Fallback Plans

**Plan B — Editorial-First Pivot (if organic content < 30% at month 3):** Admin team produces professional "DaNangNavi Guides" content. Use SEO traffic to attract users, then convert to community contributors.

**Plan C — Incentive Program (if Plan B insufficient):** Pay top contributors ¥500-1,000 per quality review. Budget-capped and time-limited (3 months maximum).

## Project Scoping & Phased Development

### MVP Strategy

**Approach:** Full Platform MVP — all 4 roles (Guest, User, BusinessOwner, Admin) functional end-to-end. Deadline flexible and negotiable to ensure quality.

**Resource:** Solo developer, timeline negotiable (target 20+ days)

### MVP Feature Set (Phase 1)

**Guest (Unauthenticated):**
- Browse homepage, senpai picks, area guides
- Search & filter listings
- View listing detail (dual-currency pricing, reviews, photos)
- View community posts (read-only)
- Registration/login prompt for restricted actions

**User (Authenticated Japanese End User):**
- Full search & discovery with save/favorites
- Write reviews with camera-only photos
- Community: join groups, post, comment, register for events
- Contribution point system with badge levels (Newcomer → Senpai)
- User profile with favorites collection, contribution history
- Voice translation ("Press to Speak") with context-based phrase packs
- Notification center (contribution milestones, event reminders)
- Onboarding flow (newcomer guide, tourist first-24h)

**BusinessOwner (Vietnamese):**
- Registration with digital agreement
- Listing editor: Vietnamese input with auto-translation to Japanese
- Camera-only photo upload with EXIF validation
- Coupon creation & management
- Analytics dashboard: views, saves, reviews, coupon redemptions
- Revenue tracking: ad spend, commission breakdown, payment history
- Review/edit Japanese translations

**Admin (Team with RBAC):**
- User & business owner management
- Content moderation queue with automation (keyword filter, AI image scan, spam detection)
- Business verification workflow with escalation
- Fake review dispute process (complaint → investigate → resolve)
- Platform analytics: traffic, revenue, popular sections, user engagement
- HR management & staff task assignment
- RBAC: content lead, technical, business relations roles
- Reporting tools (weekly/monthly reports)

### Phase 2 — Growth

- Real routing API with location-based discovery (Journey-Based Discovery)
- WebSocket for real-time chat/messaging
- Payment integration for coupon commissions (VNPay/Momo)
- Push notifications (mobile browser)
- Advanced AI recommendations (taste matching JP food → VN food)
- Community rankings (monthly top 10 from real data)
- Sponsored content & promoted listings
- Senior-Friendly UI mode
- Hidden Gems Collection — curated "Local Secret" spots (brainstorming #37)
- Cross-Cultural Food Map — mapping Japanese food → Vietnamese equivalents (brainstorming #59)
- Contextual Vietnamese Learning — learn phrases at the point of use within listings (brainstorming #61)

### Phase 3 — Expansion

- Native mobile app (iOS/Android)
- Voice Order Assistant with live speech
- AI Trip Planner (5-question → full itinerary)
- Local Experiences Marketplace (10-15% commission)
- Visa Run Concierge (proactive reminders)
- Side-by-Side Compare (2-3 listings)
- Daily Specials Feed from business owners
- Language Buddy integration in community
- Live City Pulse — real-time dashboard: crowd levels, weather, events nearby (brainstorming #45)

### Risk Mitigation Strategy

**Technical Risks:**

| Risk | Mitigation |
|------|------------|
| Auto-translation quality < 80% | Established API (Google/DeepL) + business owner review flow + allergen flagging |
| AI moderation false positives | Conservative thresholds + human review queue for all flagged items |
| Performance under load | SSR caching + Redis + CDN + PostgreSQL query optimization |
| Solo dev bottleneck | Flexible deadline + prioritize core flows first, polish later |

**Market Risks:**

| Risk | Mitigation |
|------|------------|
| Not enough senpai at launch | Cold start: 10-15 Founding Senpai + 50-100 seed listings from staff |
| Business owners skeptical | Direct sales with live demo + 100% free listing + analytics value |
| Low organic growth | Plan B editorial pivot at month 3 + Plan C incentive program |

**Resource Risks:**

| Risk | Mitigation |
|------|------------|
| Timeline overrun | Negotiate deadline + ship core flows first |
| Single point of failure | Clean architecture + documentation + modular monorepo for team onboarding |

## Web Application Architecture

### Technical Overview

DaNangNavi is a hybrid Next.js web application — SSR for public-facing pages (SEO-critical for Japanese search traffic) and SPA behavior for authenticated dashboards. FastAPI backend serves REST API for all three client interfaces.

### Browser Support

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | Latest 2 | Primary |
| Safari | Latest 2 | Primary |
| Edge | Latest 2 | Primary |
| Mobile Chrome (Android) | Latest 2 | Primary |
| Mobile Safari (iOS) | Latest 2 | Primary |
| Firefox | Not targeted but should work | Secondary |

### Responsive Design

- End User App: mobile-first responsive (320-767px primary)
- Business Owner Dashboard: desktop-first, mobile-acceptable (1024px+)
- Admin Panel: desktop-only acceptable for MVP (1024px+)

### SEO Strategy

- SSR for all public pages: homepage, listing detail, area guides, community posts
- Japanese-language meta tags, structured data (JSON-LD) for listings
- URL structure: `/ja/listing/{slug}`, `/ja/area/{area-name}`, `/ja/community/{group-slug}`
- Sitemap generation + OpenGraph tags for social sharing (LINE, Twitter)
- Target keywords: "ダナン レストラン", "ダナン 日本人", "ダナン 生活ガイド"

### Real-Time Strategy

| Feature | Approach | Interval |
|---------|----------|----------|
| Community feed updates | Polling | 30s |
| Notification badge count | Polling | 60s |
| Admin moderation queue | Polling | 30s |
| Business dashboard analytics | Polling | 5min |
| Chat/messaging | Polling for MVP, WebSocket for Growth | 10s |

### Implementation Stack

**Next.js:** App Router, server components for SSR, client components for interactivity, BFF layer proxying to FastAPI, Image component for photo optimization.

**FastAPI:** RESTful API with versioning (`/api/v1/`), PostgreSQL database, Redis caching, background tasks for auto-translation/image moderation/spam detection.

**Authentication:** JWT in HTTP-only cookies with refresh token rotation. Four roles: Guest (default), User, BusinessOwner, Admin (RBAC sub-roles). Social login (LINE, Google) for Users. Email/password for BusinessOwners and Admin. Guest accesses public content; registration required for save/favorite/review/community.

## Functional Requirements

### 1. Discovery & Search

- FR1: Guest can browse the homepage with senpai picks, area highlights, and category navigation
- FR2: Guest can search listings by keyword, category, and area
- FR3: Guest can filter search results by price range, distance, rating, and tags (e.g., "Japanese-friendly", "Verified")
- FR4: Guest can view listing detail with photos, dual-currency pricing (VND + JPY), reviews, business hours, and map location
- FR5: Guest can view area/neighborhood guides with local insights
- FR6: User can save/unsave listings to personal favorites collection
- FR7: User can view and manage their favorites collection

### 2. User Onboarding & Profiles

- FR8: Guest can register as User via LINE social login or Google social login
- FR9: New User can complete an onboarding flow based on their type (newcomer checklist or tourist first-24h guide)
- FR10: User can view and edit their profile (display name, bio, interests)
- FR11: User can view their contribution history, points balance, and badge level
- FR12: System awards contribution points based on user actions (review, comment, photo, post, event attendance, referral)
- FR13: System assigns badge levels (Newcomer, Contributor, Senpai, Expert Senpai) based on point thresholds
- FR14: User's senpai badge displays on their reviews and community posts

### 3. Reviews & Content Creation

- FR15: User can write a review for a listing with text and star rating
- FR16: User can upload photos to reviews using camera-only capture (no gallery upload)
- FR17: System validates photo EXIF metadata to enforce camera-only policy
- FR18: User can mark a review as helpful
- FR19: Senpai-badged reviews appear prominently in "Senpai Picks" sections

### 4. Community & Events

- FR20: Guest can view community groups and public posts (read-only)
- FR21: User can join/leave community groups
- FR22: User can create posts and comments within joined groups
- FR23: User can view and register for community events
- FR24: User can view event details (date, location, attendees, description)
- FR25: User can receive notifications for contribution milestones and event reminders

### 5. Communication Bridge

- FR26: User can access context-based voice translation organized by situation (restaurant, salon, hospital, market)
- FR27: User can select a phrase and have the app speak it in Vietnamese
- FR28: System provides pre-built phrase packs per business context
- FR29: Auto-translated content displays a disclaimer indicating machine translation

### 6. Business Owner Tools

- FR30: BusinessOwner can register with email/password and accept digital agreement
- FR31: BusinessOwner can create and edit a listing in Vietnamese with auto-translation to Japanese
- FR32: BusinessOwner can upload photos via camera-only capture
- FR33: BusinessOwner can set and update business hours, location, and contact information
- FR34: BusinessOwner can review and edit the Japanese translation of their listing
- FR35: BusinessOwner can create, edit, and deactivate coupons
- FR36: BusinessOwner can view analytics dashboard (views, saves, reviews, coupon redemptions)
- FR37: BusinessOwner can view revenue tracking (ad spend, commission breakdown, payment history)
- FR38: BusinessOwner can file a fake review complaint through the dashboard

### 7. Admin & Moderation

- FR39: Admin can view platform-wide dashboard (traffic, revenue, popular sections, user engagement)
- FR40: Admin can manage user accounts (view, suspend, ban)
- FR41: Admin can manage business owner accounts (view, verify, suspend)
- FR42: System automatically filters spam comments, banned keywords, and AI-flags inappropriate images
- FR43: Admin can review and action flagged content (approve, remove with reason template)
- FR44: Admin can process fake review disputes (investigate, confirm, compensate business owner, ban violator)
- FR45: Admin can escalate issues to other admin roles with one click
- FR46: Admin can manage staff accounts and assign RBAC roles (content lead, technical, business relations)
- FR47: Admin can generate platform reports (weekly/monthly: traffic, revenue, moderation volume)
- FR48: Admin can manage business verification workflow (schedule visit, confirm/reject)

### 8. Authentication & Authorization

- FR49: System authenticates users via JWT stored in HTTP-only cookies with refresh token rotation
- FR50: System enforces four role types: Guest (default), User, BusinessOwner, Admin
- FR51: System enforces RBAC sub-roles for Admin (content, technical, business relations)
- FR52: Guest can access public content (browse, search, view) without authentication
- FR53: System prompts registration when Guest attempts restricted actions (save, review, post)

### 9. Privacy & Compliance

- FR54: System collects user consent at registration for activity logging and location tracking
- FR55: User can disable location tracking for non-location features (community, profile)
- FR56: System logs user activity (clicks, likes, searches by topic) for analytics
- FR57: System stores all data on Vietnam-based servers
- FR58: System flags allergen-related menu terms for human translation review

### 10. SEO & Discoverability

- FR59: System generates SSR pages with Japanese-language meta tags and structured data (JSON-LD) for all public content
- FR60: System generates sitemap and OpenGraph tags for social sharing (LINE, Twitter)

### 11. Coupon & Deals (User Side)

- FR61: User can browse available coupons near their location or by category
- FR62: User can claim and redeem coupons at listings

### 12. Multi-Language Content

- FR63: System displays all listing content in Japanese for User/Guest
- FR64: System displays Business Dashboard entirely in Vietnamese
- FR65: System supports cross-language search (Japanese query matches Vietnamese-stored content and vice versa)

### 13. Media Processing

- FR66: System compresses and optimizes uploaded photos for web delivery

### 14. Notifications

- FR67: System delivers in-app notifications for user actions (new review on saved listing, event update, contribution milestone, coupon near expiry)
- FR68: User can manage notification preferences (enable/disable by category)

### 15. Data Export

- FR69: Admin can export report data in CSV format
- FR70: BusinessOwner can export their analytics data

### 16. UX Completeness

- FR71: System displays contextual empty states when no results found (with suggested actions)
- FR72: System guides new BusinessOwner through first listing creation with step-by-step wizard
- FR73: System displays reviewer's senpai level, years in Da Nang, and expertise tags on their reviews
- FR74: User can request account deletion and personal data removal

## Non-Functional Requirements

### Performance

| Metric | Requirement | Context |
|--------|-------------|---------|
| Page Load (SSR) | FCP < 2s, LCP < 2.5s | Public pages — SEO ranking + user retention |
| Time to Interactive | TTI < 3s | Critical for mobile users on 4G |
| API Response | < 500ms (p95) | All REST endpoints under normal load |
| Search Response | < 1s including cross-language matching | FR65 cross-language search JP↔VN |
| Image Delivery | < 1s for optimized photos | Camera-only photos via CDN |
| Layout Stability | CLS < 0.1 | Core Web Vitals compliance |
| Peak Concurrent Users | 500-1,000 simultaneous | Peak hours: 11-13h and 17-19h |
| Polling Overhead | < 5% CPU increase per 1,000 connected clients | Community feed + notification polling |

### Security

| Requirement | Detail |
|-------------|--------|
| Authentication | JWT in HTTP-only cookies, refresh token rotation, CSRF protection |
| Data Encryption | TLS 1.3 for transit, AES-256 for data at rest |
| Password Storage | bcrypt with salt for BusinessOwner/Admin passwords |
| Session Management | Automatic session expiry (24h User, 8h Admin), forced logout on password change |
| Input Validation | Server-side validation on all endpoints, parameterized queries (SQL injection prevention) |
| File Upload Security | EXIF validation + file type verification + size limits (max 10MB/photo) + malware scan |
| Rate Limiting | API rate limits: 100 req/min Guest, 300 req/min User, 500 req/min BusinessOwner |
| RBAC Enforcement | Role checks on every API endpoint, no client-side-only authorization |
| Audit Logging | All admin actions logged with timestamp, actor, and action detail |
| APPI Compliance | Japanese user data: explicit consent, right to deletion (FR74), data export capability |
| Vietnam Cybersecurity Law | All data stored on Vietnam-based servers (FR57) |

### Scalability

| Scenario | Requirement |
|----------|-------------|
| Month 1 | 5,000 daily visits, 50 businesses, 500 concurrent peak |
| Month 6 | 50,000 daily visits, 300 businesses, 5,000 concurrent peak |
| Database Growth | Support 100K+ listings, 500K+ reviews, 1M+ activity logs without degradation |
| Image Storage | Support 500K+ photos with CDN delivery |
| Horizontal Scaling | Stateless API design allowing additional FastAPI instances behind load balancer |
| Cache Strategy | Redis cache with 80%+ hit rate for listing data and search results |
| Database Scaling | Read replicas for analytics queries, connection pooling for concurrent access |
| Graceful Degradation | Under extreme load: serve cached content, queue non-critical writes |

### Accessibility

| Requirement | Detail |
|-------------|--------|
| Standard | WCAG 2.1 AA compliance |
| Font Size | Minimum 16px body text, scalable up to 200% |
| Touch Targets | Minimum 44x44px for all interactive elements |
| Color Contrast | 4.5:1 minimum for normal text, 3:1 for large text |
| Alt Text | Required for all listing images and user-uploaded photos |
| Keyboard Navigation | Full keyboard support for Admin Panel (desktop) |
| Screen Reader | Semantic HTML with ARIA labels for key interactions |
| Language Attributes | `lang="ja"` on Japanese content, `lang="vi"` on Vietnamese |
| Motion | Respect `prefers-reduced-motion` for animations |

### Integration

| Service | Purpose | Criticality | Fallback |
|---------|---------|-------------|----------|
| Google/DeepL Translation API | Auto-translate VN→JP for listings | High | Queue for manual translation |
| LINE Login | Primary social auth for Japanese users | High | Google login as alternative |
| Google OAuth | Secondary social auth | Medium | Email/password registration |
| Google Maps API | Map display + navigation links | Medium | Static map image + address text |
| Payment Gateway (VNPay/Momo) | Business owner ad payments, coupon commissions | Medium (post-MVP) | Bank transfer + cash |
| Email Service (SendGrid/SES) | Transactional emails | High | Queue and retry |
| SMS Service (Twilio/local) | OTP verification, critical notifications | Medium | Email fallback |
| Zalo Bot API | Communication bridge for Vietnamese business owners | Medium | In-app notification fallback |
| CDN (Cloudflare/CloudFront) | Image and static asset delivery | High | Direct server delivery |

**Integration Resilience:** All external API calls with 5s timeout and circuit breaker pattern. Failed integrations must not block core user flows. Integration health monitoring on Admin dashboard.

### Reliability

| Requirement | Target |
|-------------|--------|
| Uptime | 99.5% (max 1.8 days downtime/year) |
| Data Backup | Daily automated backup with 30-day retention |
| Backup Recovery | Restore within 4 hours (RTO) |
| Data Loss Tolerance | Maximum 24 hours (RPO = daily backup) |
| Error Rate | < 0.1% server errors (5xx) under normal load |
| Monitoring | Alerts for: downtime, error spike, high latency, disk/memory thresholds |
| Incident Response | Alert → Acknowledge < 30min during business hours |
| Database | PostgreSQL with daily pg_dump, transaction logging for point-in-time recovery |
