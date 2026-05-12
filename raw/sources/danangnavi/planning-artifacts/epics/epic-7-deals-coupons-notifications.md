# Epic 7: Deals, Coupons & Notifications

Users can browse, claim, and redeem coupons with QR codes, receive in-app notifications for reviews, events, milestones, and expiring coupons, and manage their notification preferences.

## Story 7.1: Deals & Coupons Browsing

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

## Story 7.2: Coupon Claim & Redemption

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

## Story 7.3: Notification System & Preferences

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
