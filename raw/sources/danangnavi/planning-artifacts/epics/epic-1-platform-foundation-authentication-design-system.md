# Epic 1: Platform Foundation, Authentication & Design System

Users can access the platform, register/login via LINE, Google, or Zalo social login, and the complete design system with shared UI components is ready for all subsequent feature development.

## Story 1.1: Monorepo Setup & Development Infrastructure

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

## Story 1.2: Design Token System & Core UI Components

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

## Story 1.3: Application Layout Shell & Navigation

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

## Story 1.4: User Authentication — Social Login (LINE & Google)

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

## Story 1.5.2: Business Owner Registration & Agreement (Email + Zalo)

As a Vietnamese business owner,
I want to register with my email or Zalo account and accept a digital agreement,
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

## Story 1.6: Privacy Controls & Account Management

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

## Story 1.5.1: Zalo Social Login (Users)

As a Vietnamese user,
I want to register and login via my Zalo account,
So that I can access the platform quickly using my most familiar app.

**Acceptance Criteria:**

**Given** I am on the Signup Modal
**When** I tap the "Zaloでログイン" button
**Then** I am redirected to Zalo OAuth authorization page at `https://oauth.zaloapp.com/v3/auth`

**Given** the Zalo OAuth flow completes successfully
**When** I am redirected back to the platform
**Then** my account is created with role "User"
**And** a JWT is issued in an HTTP-only cookie with refresh token
**And** a green checkmark success animation plays
**And** I am auto-redirected after 1.5 seconds

**Given** I have an existing account with the same email from another provider
**When** I login via Zalo
**Then** my accounts are auto-linked (consistent with LINE/Google account linking behavior)

**Given** Zalo access tokens expire after 1 hour
**When** the backend stores Zalo tokens
**Then** the system handles the shorter token lifetime appropriately
**And** user sessions still follow platform JWT expiry (24h access, 7d refresh)

---
