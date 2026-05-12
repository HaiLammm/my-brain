# Epic 3: User Onboarding & Senpai Profile System

New users complete a personalized onboarding flow, build their profile, earn contribution points, and progress through senpai badge levels from Newcomer to Expert Senpai.

## Story 3.1: Newcomer Onboarding Flow

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

## Story 3.2: User Profile Page

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

## Story 3.3: Contribution Points & Gamification Engine

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

## Story 3.4: Senpai Badge System

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
