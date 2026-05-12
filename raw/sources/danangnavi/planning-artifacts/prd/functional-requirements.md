# Functional Requirements

## 1. Discovery & Search

- FR1: Guest can browse the homepage with senpai picks, area highlights, and category navigation
- FR2: Guest can search listings by keyword, category, and area
- FR3: Guest can filter search results by price range, distance, rating, and tags (e.g., "Japanese-friendly", "Verified")
- FR4: Guest can view listing detail with photos, dual-currency pricing (VND + JPY), reviews, business hours, and map location
- FR5: Guest can view area/neighborhood guides with local insights
- FR6: User can save/unsave listings to personal favorites collection
- FR7: User can view and manage their favorites collection

## 2. User Onboarding & Profiles

- FR8: Guest can register as User via LINE social login, Google social login, or Zalo social login
- FR9: New User can complete an onboarding flow based on their type (newcomer checklist or tourist first-24h guide)
- FR10: User can view and edit their profile (display name, bio, interests)
- FR11: User can view their contribution history, points balance, and badge level
- FR12: System awards contribution points based on user actions (review, comment, photo, post, event attendance, referral)
- FR13: System assigns badge levels (Newcomer, Contributor, Senpai, Expert Senpai) based on point thresholds
- FR14: User's senpai badge displays on their reviews and community posts

## 3. Reviews & Content Creation

- FR15: User can write a review for a listing with text and star rating
- FR16: User can upload photos to reviews using camera-only capture (no gallery upload)
- FR17: System validates photo EXIF metadata to enforce camera-only policy
- FR18: User can mark a review as helpful
- FR19: Senpai-badged reviews appear prominently in "Senpai Picks" sections

## 4. Community & Events

- FR20: Guest can view community groups and public posts (read-only)
- FR21: User can join/leave community groups
- FR22: User can create posts and comments within joined groups
- FR23: User can view and register for community events
- FR24: User can view event details (date, location, attendees, description)
- FR25: User can receive notifications for contribution milestones and event reminders

## 5. Communication Bridge

- FR26: User can access context-based voice translation organized by situation (restaurant, salon, hospital, market)
- FR27: User can select a phrase and have the app speak it in Vietnamese
- FR28: System provides pre-built phrase packs per business context
- FR29: Auto-translated content displays a disclaimer indicating machine translation

## 6. Business Owner Tools

- FR30: BusinessOwner can register with email/password or Zalo social login, and accept digital agreement
- FR31: BusinessOwner can create and edit a listing in Vietnamese with auto-translation to Japanese
- FR32: BusinessOwner can upload photos via camera-only capture
- FR33: BusinessOwner can set and update business hours, location, and contact information
- FR34: BusinessOwner can review and edit the Japanese translation of their listing
- FR35: BusinessOwner can create, edit, and deactivate coupons
- FR36: BusinessOwner can view analytics dashboard (views, saves, reviews, coupon redemptions)
- FR37: BusinessOwner can view revenue tracking (ad spend, commission breakdown, payment history)
- FR38: BusinessOwner can file a fake review complaint through the dashboard

## 7. Admin & Moderation

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

## 8. Authentication & Authorization

- FR49: System authenticates users via JWT stored in HTTP-only cookies with refresh token rotation
- FR50: System enforces four role types: Guest (default), User, BusinessOwner, Admin
- FR51: System enforces RBAC sub-roles for Admin (content, technical, business relations)
- FR52: Guest can access public content (browse, search, view) without authentication
- FR53: System prompts registration when Guest attempts restricted actions (save, review, post)

## 9. Privacy & Compliance

- FR54: System collects user consent at registration for activity logging and location tracking
- FR55: User can disable location tracking for non-location features (community, profile)
- FR56: System logs user activity (clicks, likes, searches by topic) for analytics
- FR57: System stores all data on Vietnam-based servers
- FR58: System flags allergen-related menu terms for human translation review

## 10. SEO & Discoverability

- FR59: System generates SSR pages with Japanese-language meta tags and structured data (JSON-LD) for all public content
- FR60: System generates sitemap and OpenGraph tags for social sharing (LINE, Twitter)

## 11. Coupon & Deals (User Side)

- FR61: User can browse available coupons near their location or by category
- FR62: User can claim and redeem coupons at listings

## 12. Multi-Language Content

- FR63: System displays all listing content in Japanese for User/Guest
- FR64: System displays Business Dashboard entirely in Vietnamese
- FR65: System supports cross-language search (Japanese query matches Vietnamese-stored content and vice versa)

## 13. Media Processing

- FR66: System compresses and optimizes uploaded photos for web delivery

## 14. Notifications

- FR67: System delivers in-app notifications for user actions (new review on saved listing, event update, contribution milestone, coupon near expiry)
- FR68: User can manage notification preferences (enable/disable by category)

## 15. Data Export

- FR69: Admin can export report data in CSV format
- FR70: BusinessOwner can export their analytics data

## 16. UX Completeness

- FR71: System displays contextual empty states when no results found (with suggested actions)
- FR72: System guides new BusinessOwner through first listing creation with step-by-step wizard
- FR73: System displays reviewer's senpai level, years in Da Nang, and expertise tags on their reviews
- FR74: User can request account deletion and personal data removal
