# Project Scoping & Phased Development

## MVP Strategy

**Approach:** Full Platform MVP — all 4 roles (Guest, User, BusinessOwner, Admin) functional end-to-end. Deadline flexible and negotiable to ensure quality.

**Resource:** Solo developer, timeline negotiable (target 20+ days)

## MVP Feature Set (Phase 1)

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

## Phase 2 — Growth

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

## Phase 3 — Expansion

- Native mobile app (iOS/Android)
- Voice Order Assistant with live speech
- AI Trip Planner (5-question → full itinerary)
- Local Experiences Marketplace (10-15% commission)
- Visa Run Concierge (proactive reminders)
- Side-by-Side Compare (2-3 listings)
- Daily Specials Feed from business owners
- Language Buddy integration in community
- Live City Pulse — real-time dashboard: crowd levels, weather, events nearby (brainstorming #45)

## Risk Mitigation Strategy

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
