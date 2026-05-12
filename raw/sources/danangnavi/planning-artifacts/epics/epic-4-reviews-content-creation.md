# Epic 4: Reviews & Content Creation

Users can write reviews with star ratings and camera-only photos, vote reviews as helpful, and senpai-badged reviews appear prominently in Senpai Picks sections across the platform.

## Story 4.1: Write Review with Star Rating & Camera-Only Photos

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

## Story 4.2: Helpful Votes & Review Display

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

## Story 4.3: Senpai Picks & Verified Reviews

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
