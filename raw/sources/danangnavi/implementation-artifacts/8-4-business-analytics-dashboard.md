# Story 8.4: Business Analytics Dashboard

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Vietnamese business owner,
I want to see how my listing performs and track revenue,
So that I can measure the value of being on DaNangNavi and make data-driven decisions.

## Acceptance Criteria

1. **Given** I navigate to `/business/vi/dashboard` (FR36)
   **When** the dashboard loads
   **Then** status cards show at the top: listing status (Active/Draft count), coupon status (X active), overall views count
   **And** the entire UI is in Vietnamese (FR64)

2. **Given** analytics data exists
   **When** I view the metrics section
   **Then** analytics display: total views, saves/favorites count, review count with average rating, coupon redemptions count
   **And** a simple time-series chart shows views over the last 30 days
   **And** data is fetched from `GET /api/v1/business/analytics/summary`

3. **Given** this is a new dashboard with no data
   **When** the empty state displays
   **Then** metric cards show "0" with help tooltip icons explaining what each metric tracks (UX-DR42)
   **And** a help card suggests: "Chia sẻ link đăng tin của bạn để thu hút khách hàng đầu tiên"

4. **Given** revenue tracking is available (FR37)
   **When** I view the revenue section
   **Then** a "coming soon" placeholder displays: "Doanh thu & thanh toán — Sắp ra mắt"
   **And** a brief description explains: "Theo dõi chi phí quảng cáo, hoa hồng và lịch sử thanh toán"

5. **Given** I want to export my analytics (FR70)
   **When** I tap "Xuất dữ liệu" (Export Data)
   **Then** a CSV file downloads with all analytics data for the selected period
   **And** CSV includes: date, views, saves, reviews, coupon_redemptions columns

6. **Given** I receive a fake review (FR38)
   **When** I tap "Khiếu nại đánh giá" (Report Review) on my reviews section
   **Then** a complaint form opens with fields: review selector (dropdown of reviews on my listings), reason (dropdown: Đánh giá giả / Nội dung không phù hợp / Spam / Khác), evidence description (textarea)
   **And** submitting creates a dispute case and shows confirmation "Khiếu nại đã được gửi"

7. **Given** an activity feed section
   **When** I scroll down
   **Then** recent activities display: new reviews, coupon redemptions, listing views milestones
   **And** each entry has an icon, description in Vietnamese, and relative timestamp
   **And** activities are fetched from `GET /api/v1/business/analytics/activity`

## Tasks / Subtasks

### Backend — Listing View Tracking Infrastructure

- [x] Task 1 (AC: #1, #2): Create view tracking model and migration
  - [x] 1.1: Create `backend/modules/analytics/__init__.py`, `models.py`, `repository.py`, `service.py`, `router.py`, `schemas.py`, `dependencies.py`, `exceptions.py`, `constants.py` — standard module structure
  - [x] 1.2: Create `ListingViewStat` model in `backend/modules/analytics/models.py`:
    - `id: UUID` (PK), `listing_id: UUID` (FK → listings.id, CASCADE), `view_date: date` (not null), `view_count: int` (default 0, not null)
    - UniqueConstraint on `(listing_id, view_date)` named `uq_listing_view_stats_listing_date`
    - Index on `(listing_id, view_date DESC)` named `idx_listing_view_stats_listing_date`
    - Inherits from `BaseModel` (gets created_at, updated_at, deleted_at)
  - [x] 1.3: Alembic migration: `2026_05_02_0001_create_listing_view_stats_table.py`
  - [x] 1.4: Add `record_view(listing_id)` method to `AnalyticsRepository` — UPSERT: `INSERT ... ON CONFLICT (listing_id, view_date) DO UPDATE SET view_count = view_count + 1`
  - [x] 1.5: Wire view recording into the existing listing detail endpoint via event bus:
    - Add `LISTING_VIEWED = "listing.listing.viewed"` event constant to `backend/modules/listing/constants.py` (or events file)
    - Emit `LISTING_VIEWED` event in `GET /api/v1/listings/{listing_id}` endpoint (fire-and-forget, same pattern as `LISTING_INQUIRY_CREATED`)
    - Subscribe analytics handler in analytics module `__init__.py` or dedicated `events.py`
    - Handler calls `AnalyticsRepository.record_view(listing_id)` — failures logged but don't propagate (same pattern as existing event handlers)

### Backend — Review Dispute Model

- [x] Task 2 (AC: #6): Create review dispute infrastructure
  - [x] 2.1: Create `ReviewDispute` model in `backend/modules/review/models.py`:
    - `id: UUID` (PK), `review_id: UUID` (FK → reviews.id, CASCADE), `business_owner_id: UUID` (FK → users.id, CASCADE), `reason: str` (String(50), CHECK IN ('fake_review', 'inappropriate_content', 'spam', 'other')), `evidence: str | None` (Text), `status: str` (String(20), default 'pending', CHECK IN ('pending', 'investigating', 'resolved_removed', 'resolved_rejected')), `resolved_at: datetime | None`, `resolver_id: UUID | None` (FK → users.id, SET NULL)
    - Inherits `BaseModel`
  - [x] 2.2: Alembic migration: `2026_05_02_0002_create_review_disputes_table.py`
  - [x] 2.3: Add `ReviewDisputeRepository` to `backend/modules/review/repository.py`:
    - `create_dispute(review_id, business_owner_id, reason, evidence)` — insert + flush
    - `list_disputes_for_owner(business_owner_id, page, per_page)` — paginated, order by created_at DESC
    - `get_dispute(dispute_id, business_owner_id)` — single dispute with ownership check
  - [x] 2.4: Add dispute exceptions to `backend/modules/review/exceptions.py`:
    - `ReviewDisputeAlreadyExistsException` (409) — "A dispute for this review already exists"
    - `ReviewNotOnOwnedListingException` (403) — "This review is not on one of your listings"
  - [x] 2.5: Add dispute schemas to `backend/modules/review/schemas.py`:
    - `ReviewDisputeCreateRequest` — `review_id: UUID`, `reason: Literal["fake_review", "inappropriate_content", "spam", "other"]`, `evidence: str | None`
    - `ReviewDisputeResponse` — `id`, `review_id`, `reason`, `evidence`, `status`, `created_at`

### Backend — Analytics Service & Repository

- [x] Task 3 (AC: #1-#5, #7): Create analytics service layer
  - [x] 3.1: `AnalyticsRepository` in `backend/modules/analytics/repository.py`:
    - `total_views(listing_ids: list[UUID]) → int` — SUM(view_count) WHERE listing_id IN (...)
    - `daily_views(listing_ids: list[UUID], days: int = 30) → list[DailyViewRow]` — GROUP BY view_date, SUM(view_count), for last N days, fill missing dates with 0
    - `total_saves(listing_ids: list[UUID]) → int` — COUNT from listing_favorites WHERE listing_id IN (...) AND deleted_at IS NULL
    - `total_review_stats(listing_ids: list[UUID]) → ReviewStatsRow` — SUM(review_count), weighted AVG(rating_avg) from listings
    - `total_coupon_redemptions(listing_ids: list[UUID]) → int` — COUNT from coupon_redemptions JOIN coupons WHERE coupons.listing_id IN (...) AND coupon_redemptions.status IN ('claimed', 'redeemed') AND coupon_redemptions.deleted_at IS NULL
    - `record_view(listing_id: UUID)` — (from Task 1.4)
  - [x] 3.2: `AnalyticsService` in `backend/modules/analytics/service.py`:
    - `__init__(analytics_repo, listing_repo, coupon_repo, review_dispute_repo, session)`
    - `get_summary(user_id) → BusinessAnalyticsSummary`:
      1. Get all listing_ids for user via `listing_repo.list_ids_for_owner(user_id)`
      2. Parallel gather: total_views, daily_views, total_saves, review_stats, coupon_redemptions, listing_status_counts, active_coupon_count
      3. Return assembled summary
    - `get_activity_feed(user_id, page, per_page) → Paginated[ActivityFeedItem]`:
      1. Get listing_ids for user
      2. Query recent events from activity_logs WHERE metadata_json->>'listing_id' IN listing_ids, UNION recent reviews on owned listings, UNION recent coupon redemptions on owned coupons
      3. Order by timestamp DESC, paginate
      4. Return with Vietnamese descriptions
    - `export_csv(user_id, date_from, date_to) → StreamingResponse`:
      1. Get listing_ids for user
      2. Query daily_views, daily_saves, daily_reviews, daily_redemptions for date range
      3. Generate CSV with columns: date, views, saves, new_reviews, coupon_redemptions
      4. Return as StreamingResponse with Content-Disposition header
    - `create_review_dispute(user_id, payload) → ReviewDisputeResponse`:
      1. Verify review exists and is on a listing owned by user_id (JOIN reviews → listings WHERE business_owner_id = user_id)
      2. Check no existing dispute for this review from this owner
      3. Create dispute record
      4. Emit `review.dispute.created` event
      5. Return dispute response
  - [x] 3.3: `BusinessAnalyticsSummary` schema in `backend/modules/analytics/schemas.py`:
    - `listing_counts: ListingStatusCounts` — `{ active: int, draft: int, inactive: int }`
    - `active_coupon_count: int`
    - `total_views: int`
    - `total_saves: int`
    - `total_reviews: int`
    - `average_rating: Decimal | None` (None if no reviews)
    - `total_coupon_redemptions: int`
    - `daily_views: list[DailyViewPoint]` — `[{ date: str, views: int }]` (ISO date strings, last 30 days)
  - [x] 3.4: `ActivityFeedItem` schema:
    - `id: str`, `type: str` (review | coupon_redemption | milestone), `description: str` (Vietnamese), `icon: str`, `created_at: datetime`, `metadata: dict` (listing_id, review_id, etc.)
  - [x] 3.5: `AnalyticsExportRequest` schema:
    - `date_from: date` (default: 30 days ago), `date_to: date` (default: today)
  - [x] 3.6: Add `list_ids_for_owner(user_id)` to existing `ListingRepository` in `backend/modules/listing/repository.py` — `SELECT id FROM listings WHERE business_owner_id = user_id AND deleted_at IS NULL`

### Backend — Analytics Router

- [x] Task 4 (AC: #1-#7): Create `backend/modules/analytics/router.py`
  - [x] 4.1: `GET /api/v1/business/analytics/summary` — Auth: `require_role(UserRole.BUSINESS_OWNER)`. Returns `SingleEnvelope[BusinessAnalyticsSummary]`
  - [x] 4.2: `GET /api/v1/business/analytics/activity` — Auth: BUSINESS_OWNER. Query: `page`, `per_page`. Returns `Paginated[ActivityFeedItem]`
  - [x] 4.3: `GET /api/v1/business/analytics/export` — Auth: BUSINESS_OWNER. Query: `date_from`, `date_to`. Returns `StreamingResponse` (text/csv)
  - [x] 4.4: `POST /api/v1/business/analytics/disputes` — Auth: BUSINESS_OWNER. Body: `ReviewDisputeCreateRequest`. Returns `SingleEnvelope[ReviewDisputeResponse]` (201)
  - [x] 4.5: Register `analytics_router` in `backend/main.py` with prefix `/api/v1/business/analytics` and tag `business-analytics`

### Backend — Dependencies & Events

- [x] Task 5: Wire up dependency injection and events
  - [x] 5.1: Create `backend/modules/analytics/dependencies.py`:
    - `get_analytics_repository(session)` → `AnalyticsRepository`
    - `get_analytics_service(analytics_repo, listing_repo, coupon_repo, review_dispute_repo, session)` → `AnalyticsService`
  - [x] 5.2: Create `backend/modules/analytics/events.py`:
    - Subscribe to `LISTING_VIEWED` event → `handle_listing_viewed(payload)` → calls `analytics_repo.record_view()`
  - [x] 5.3: Wire event subscription in analytics module startup — import and register handler in `backend/main.py` alongside router registration
  - [x] 5.4: Add `REVIEW_DISPUTE_CREATED = "review.dispute.created"` event constant

### Backend — Tests

- [x] Task 6: Tests for analytics module
  - [x] 6.1: `backend/tests/analytics/test_repository.py`:
    - Test `record_view` UPSERT (first view creates row, second increments)
    - Test `total_views` aggregation across multiple listings
    - Test `daily_views` returns correct date range with zero-fill
    - Test `total_saves` counts only non-deleted favorites
    - Test `total_coupon_redemptions` counts claimed + redeemed only
  - [x] 6.2: `backend/tests/analytics/test_service.py`:
    - Test `get_summary` returns all metrics for business owner
    - Test `get_summary` for owner with no listings returns zeros
    - Test `get_activity_feed` returns mixed event types ordered by time
    - Test `export_csv` produces valid CSV with correct columns
    - Test `create_review_dispute` happy path
    - Test `create_review_dispute` for review not on owned listing (403)
    - Test `create_review_dispute` duplicate (409)
  - [x] 6.3: `backend/tests/analytics/test_router.py`:
    - Test all 4 endpoints for 200/201 happy paths
    - Test 403 for non-BUSINESS_OWNER role
    - Test CSV export Content-Type and Content-Disposition headers
    - Test dispute creation with invalid review_id (404)
  - [x] 6.4: Use `db_session` fixture with transaction rollback
  - [x] 6.5: Create test fixtures: seed test listings, reviews, coupons, favorites, view stats owned by a test business owner

### Frontend — Type Definitions

- [x] Task 7 (AC: #1-#7): Add analytics types to `apps/web/modules/business/lib/types.ts`
  - [x] 7.1: `ListingStatusCounts` — `{ active: number; draft: number; inactive: number }`
  - [x] 7.2: `DailyViewPoint` — `{ date: string; views: number }`
  - [x] 7.3: `BusinessAnalyticsSummary`:
    - `listingCounts: ListingStatusCounts`, `activeCouponCount: number`, `totalViews: number`, `totalSaves: number`, `totalReviews: number`, `averageRating: number | null`, `totalCouponRedemptions: number`, `dailyViews: DailyViewPoint[]`
  - [x] 7.4: `ActivityFeedItem` — `{ id: string; type: "review" | "coupon_redemption" | "milestone"; description: string; icon: string; createdAt: string; metadata: Record<string, string> }`
  - [x] 7.5: `ReviewDisputeCreateRequest` — `{ reviewId: string; reason: "fake_review" | "inappropriate_content" | "spam" | "other"; evidence?: string }`
  - [x] 7.6: `ReviewDisputeResponse` — `{ id: string; reviewId: string; reason: string; evidence?: string; status: string; createdAt: string }`
  - [x] 7.7: `AnalyticsExportParams` — `{ dateFrom?: string; dateTo?: string }`

### Frontend — API Client

- [x] Task 8 (AC: #1-#7): Create `apps/web/modules/business/lib/businessAnalyticsApi.ts`
  - [x] 8.1: `getAnalyticsSummary(): Promise<BusinessAnalyticsSummary>` — GET `/api/v1/business/analytics/summary`
  - [x] 8.2: `getActivityFeed(params: { page?, perPage? }): Promise<Paginated<ActivityFeedItem>>` — GET `/api/v1/business/analytics/activity`
  - [x] 8.3: `exportAnalyticsCsv(params: AnalyticsExportParams): Promise<Blob>` — GET `/api/v1/business/analytics/export` with `responseType: 'blob'`
  - [x] 8.4: `createReviewDispute(data: ReviewDisputeCreateRequest): Promise<ReviewDisputeResponse>` — POST `/api/v1/business/analytics/disputes`
  - [x] 8.5: Use `apiClient` from `shared/lib/apiClient.ts` — automatic snake↔camelCase, CSRF, cookies. For CSV export, use raw fetch or axios with `responseType: 'blob'`

### Frontend — Install Chart Library

- [x] Task 9 (AC: #2): Add `recharts` dependency
  - [x] 9.1: `pnpm --filter web add recharts` — lightweight, React-native charting library
  - [x] 9.2: No additional configuration needed — recharts works with Next.js out of the box
  - [x] 9.3: Import only `LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer` — tree-shakeable

### Frontend — Dashboard Components

- [x] Task 10 (AC: #1-#3): Create `apps/web/modules/business/components/AnalyticsDashboard.tsx`
  - [x] 10.1: Main dashboard component that composes all sections
  - [x] 10.2: Use TanStack Query: `queryKey: ['business', 'analytics', 'summary']`, `queryFn: getAnalyticsSummary`, `staleTime: 5 * 60 * 1000` (5 min)
  - [x] 10.3: Layout: status cards row → metrics cards row → views chart → revenue placeholder → reviews section → activity feed
  - [x] 10.4: All text hardcoded Vietnamese (no next-intl — matching business portal pattern)

- [x] Task 11 (AC: #1): Create `apps/web/modules/business/components/StatusCards.tsx`
  - [x] 11.1: Three status cards in a responsive grid (1 col mobile, 3 col desktop):
    - Listing status: icon + "X Đang hoạt động / Y Nháp" with colored counts
    - Coupon status: icon + "X coupon đang hoạt động"
    - Total views: icon + formatted number (e.g., "1,234 lượt xem")
  - [x] 11.2: Each card uses `Card` component from `shared/components/` (or similar pattern)
  - [x] 11.3: Loading state: `Skeleton` cards (3 rectangles)

- [x] Task 12 (AC: #2, #3): Create `apps/web/modules/business/components/MetricsGrid.tsx`
  - [x] 12.1: Four metric cards: Total Views, Saves/Favorites, Reviews (with star rating), Coupon Redemptions
  - [x] 12.2: Each card: icon, Vietnamese label, large number, help tooltip (info icon → tooltip explaining metric)
  - [x] 12.3: Tooltips (AC #3): "Số lượt xem trang tin đăng của bạn", "Số người đã lưu tin đăng", "Số đánh giá và điểm trung bình", "Số lượt sử dụng coupon"
  - [x] 12.4: Zero state: show "0" with same layout (not empty state — just zero values)

- [x] Task 13 (AC: #2): Create `apps/web/modules/business/components/ViewsChart.tsx`
  - [x] 13.1: recharts `LineChart` with `ResponsiveContainer` (height 300px)
  - [x] 13.2: X-axis: date labels (DD/MM format, Vietnamese convention)
  - [x] 13.3: Y-axis: view counts (auto-scaled)
  - [x] 13.4: Single `Line` with stroke color from design tokens (primary blue)
  - [x] 13.5: `Tooltip` showing "DD/MM/YYYY: X lượt xem"
  - [x] 13.6: Section header: "Lượt xem 30 ngày qua"
  - [x] 13.7: Empty chart state: flat line at 0 with message "Chưa có dữ liệu lượt xem"
  - [x] 13.8: Wrap in `'use client'` directive (recharts requires client-side rendering)

- [x] Task 14 (AC: #4): Create `apps/web/modules/business/components/RevenuePlaceholder.tsx`
  - [x] 14.1: A card/section with "coming soon" state
  - [x] 14.2: Title: "Doanh thu & Thanh toán"
  - [x] 14.3: Description: "Theo dõi chi phí quảng cáo, hoa hồng và lịch sử thanh toán. Tính năng này sẽ sớm ra mắt."
  - [x] 14.4: Muted styling (gray text, dashed border or similar)

- [x] Task 15 (AC: #6): Create `apps/web/modules/business/components/ReviewDisputeForm.tsx`
  - [x] 15.1: Modal-based form (reuse `Modal` from shared components)
  - [x] 15.2: Fields:
    - Review selector: dropdown of recent reviews on user's listings (fetch from existing reviews API or include in analytics summary)
    - Reason: dropdown `[{ value: "fake_review", label: "Đánh giá giả" }, { value: "inappropriate_content", label: "Nội dung không phù hợp" }, { value: "spam", label: "Spam" }, { value: "other", label: "Khác" }]`
    - Evidence: textarea, optional, placeholder "Mô tả bằng chứng (không bắt buộc)"
  - [x] 15.3: Submit calls `createReviewDispute()` API
  - [x] 15.4: Success: close modal + toast "Khiếu nại đã được gửi"
  - [x] 15.5: Error handling: show error toast for 409 (duplicate), 403 (not owned)
  - [x] 15.6: Trigger button: "Khiếu nại đánh giá" in the reviews metrics section

- [x] Task 16 (AC: #5): Create CSV export button in dashboard
  - [x] 16.1: "Xuất dữ liệu" button in dashboard header (top-right)
  - [x] 16.2: On click: call `exportAnalyticsCsv()`, create blob URL, trigger download via anchor click
  - [x] 16.3: Loading state: button shows spinner text "Đang xuất..." (disabled during export)
  - [x] 16.4: Filename: `danangnavi-analytics-{YYYY-MM-DD}.csv`

- [x] Task 17 (AC: #7): Create `apps/web/modules/business/components/ActivityFeed.tsx`
  - [x] 17.1: Use TanStack Query: `queryKey: ['business', 'analytics', 'activity']`, infinite query or paginated
  - [x] 17.2: Each activity item: icon (by type), Vietnamese description, relative timestamp (e.g., "2 giờ trước")
  - [x] 17.3: Icon mapping: review → ⭐, coupon_redemption → 🎟️, milestone → 🎉
  - [x] 17.4: Empty state: "Chưa có hoạt động nào" with EmptyState component
  - [x] 17.5: Section header: "Hoạt động gần đây"
  - [x] 17.6: Load more button or infinite scroll (keep simple — "Xem thêm" button)

- [x] Task 18 (AC: #3): Create `apps/web/modules/business/components/HelpCard.tsx`
  - [x] 18.1: Displayed when all metrics are zero (new business owner)
  - [x] 18.2: Message: "Chia sẻ link đăng tin của bạn để thu hút khách hàng đầu tiên"
  - [x] 18.3: CTA: "Xem tin đăng của bạn →" links to `/business/vi/listings`
  - [x] 18.4: Dismissible (local state, no persistence needed)

### Frontend — Route Page

- [x] Task 19 (AC: #1-#7): Create dashboard route page
  - [x] 19.1: `apps/web/app/(business)/vi/dashboard/page.tsx` — renders `AnalyticsDashboard` component
  - [x] 19.2: Client-side rendered (no SSR for business dashboard, matching existing pattern)
  - [x] 19.3: Page metadata: title "Bảng phân tích"
  - [x] 19.4: Uses business layout with `BusinessSidebar` (inherited from `(business)/vi/layout.tsx`)

- [x] Task 20: Update BusinessSidebar navigation
  - [x] 20.1: Update dashboard link in `apps/web/modules/business/components/BusinessSidebar.tsx`:
    - Change "Bảng điều khiển" href from `/vi` to `/vi/dashboard`
    - OR add a separate "Phân tích" (Analytics) nav item pointing to `/vi/dashboard`
  - [x] 20.2: Verify existing `/vi` (business home) still works as landing page with listing preview

### Frontend — Tests

- [x] Task 21: Component tests
  - [x] 21.1: `apps/web/modules/business/components/__tests__/AnalyticsDashboard.test.tsx`:
    - Test renders with analytics data (all sections visible)
    - Test renders with zero data (help card visible, metrics show 0)
    - Test loading state shows skeletons
  - [x] 21.2: `apps/web/modules/business/components/__tests__/ViewsChart.test.tsx`:
    - Test renders chart container
    - Test renders empty state when no data points
  - [x] 21.3: `apps/web/modules/business/components/__tests__/ReviewDisputeForm.test.tsx`:
    - Test renders form fields
    - Test form validation (reason required)
    - Test submit calls API and shows success toast
  - [x] 21.4: `apps/web/modules/business/components/__tests__/ActivityFeed.test.tsx`:
    - Test renders activity items
    - Test empty state
  - [x] 21.5: Mock `apiClient` in all tests. Use `vitest` + React Testing Library
  - [x] 21.6: Mock `useAuth` to return BusinessOwner user
  - [x] 21.7: Mock `recharts` components (recharts doesn't render in jsdom — mock as simple divs)

## Dev Notes

### Critical Architecture Decisions

1. **New `analytics` module** — create `backend/modules/analytics/` following standard module structure. This module handles dashboard data aggregation and CSV export. It does NOT own the data — it queries across listing, review, coupon, and activity_log tables via repository pattern with injected dependencies.

2. **View tracking via `listing_view_stats` table** — dedicated daily-aggregate table instead of individual view logs. UPSERT pattern (`INSERT ON CONFLICT DO UPDATE view_count + 1`) ensures atomic increments. Event-driven: listing detail endpoint emits `LISTING_VIEWED`, analytics handler records the view. Failures don't block the user request.

3. **Review disputes live in the review module** — `ReviewDispute` model in `backend/modules/review/models.py`. Admin processing is deferred to Epic 9. For now, disputes are created by business owners and stored for future admin review.

4. **Revenue section is a placeholder** — Payment infrastructure (VNPay/Momo) is post-MVP (Phase 2). Show a "coming soon" card with description. Do NOT create payment models or mock data.

5. **Chart library: recharts** — lightweight, React-native, tree-shakeable, works with Next.js. Import only needed components. Wrap chart component in `'use client'` directive since recharts requires browser APIs.

6. **CSV export as StreamingResponse** — FastAPI `StreamingResponse` with `text/csv` content type. Generate CSV in-memory with Python `csv` module. Include Content-Disposition header for download filename.

7. **Activity feed is a composite query** — combines data from multiple sources (reviews on owned listings, coupon redemptions on owned coupons, activity logs). Use a UNION query or merge in service layer, ordered by timestamp DESC.

### Existing Code to REUSE (DO NOT recreate)

| What | Location | How to Use |
|------|----------|-----------|
| Listing model (review_count, rating_avg) | `backend/modules/listing/models.py` | Aggregate for review stats |
| ListingFavorite model | `backend/modules/listing/models.py` | COUNT for saves metric |
| ListingRepository | `backend/modules/listing/repository.py` | Add `list_ids_for_owner()` method |
| Coupon + CouponRedemption models | `backend/modules/coupon/models.py` | COUNT for redemption metric |
| CouponRepository | `backend/modules/coupon/repository.py` | Reuse `count_redemptions()` pattern |
| ActivityLog model | `backend/modules/activity/models.py` | Query for activity feed (coupon events) |
| Activity constants | `backend/modules/activity/constants.py` | `COUPON_CLAIMED_ACTION`, `COUPON_REDEEMED_ACTION` |
| Event bus (emit/subscribe) | `backend/shared/events.py` | Wire view tracking + dispute events |
| require_role(UserRole.BUSINESS_OWNER) | `backend/modules/auth/dependencies.py` | Auth on all analytics endpoints |
| SingleEnvelope / Paginated | `backend/modules/listing/schemas.py` | Response wrappers |
| AppException | `backend/shared/exceptions.py` | Base for new exceptions |
| BaseModel | `backend/shared/base_models.py` | Model inheritance (created_at, updated_at, deleted_at) |
| Review model | `backend/modules/review/models.py` | FK for ReviewDispute, query for activity feed |
| apiClient | `apps/web/shared/lib/apiClient.ts` | snake↔camelCase, CSRF, cookies |
| Skeleton | `apps/web/shared/components/Skeleton.tsx` | Loading states |
| EmptyState | `apps/web/shared/components/EmptyState.tsx` | No data states |
| Toast / ToastProvider | `apps/web/shared/components/Toast.tsx` | Success/error notifications |
| Modal | `apps/web/shared/components/Modal.tsx` | Dispute form modal |
| Card pattern | Previous business components | Card-based layout |
| BusinessSidebar | `apps/web/modules/business/components/BusinessSidebar.tsx` | Navigation — update dashboard link |
| getMyListings() | `apps/web/modules/business/lib/businessListingApi.ts` | Could be used for review dispute (listing context) |
| Paginated<T> type | `apps/web/modules/business/lib/types.ts` | Reuse for activity feed pagination |
| TanStack Query | project dependency | Data fetching + caching |

### Anti-Patterns to AVOID

- **DO NOT** create a separate database for analytics — query existing tables with aggregation
- **DO NOT** track individual page views as rows in `activity_logs` — use the dedicated `listing_view_stats` UPSERT table for efficiency
- **DO NOT** implement real payment/revenue tracking — placeholder only (Phase 2)
- **DO NOT** add `next-intl` to business routes — Vietnamese-only, hardcoded strings
- **DO NOT** use spinners — use Skeleton components for loading states
- **DO NOT** use `window.confirm()` — use Modal/ConfirmDialog components
- **DO NOT** use `os.getenv()` — use `shared.config.settings`
- **DO NOT** use `any` type in TypeScript — proper types from `types.ts`
- **DO NOT** import analytics module directly from other modules — use Dependency Injection
- **DO NOT** block the listing detail endpoint with synchronous view recording — use fire-and-forget event pattern
- **DO NOT** use a heavyweight chart library (D3, Chart.js with plugins) — recharts is sufficient
- **DO NOT** implement admin dispute processing — deferred to Epic 9
- **DO NOT** create mock/fake analytics data — show real zeros if no data exists
- **DO NOT** add SSR to the dashboard page — client-side only (matching business portal pattern)

### Source Tree Components to Touch

**Backend (create — new module):**
- `backend/modules/analytics/__init__.py`
- `backend/modules/analytics/models.py` — ListingViewStat
- `backend/modules/analytics/repository.py` — AnalyticsRepository
- `backend/modules/analytics/service.py` — AnalyticsService
- `backend/modules/analytics/router.py` — analytics endpoints
- `backend/modules/analytics/schemas.py` — request/response schemas
- `backend/modules/analytics/dependencies.py` — DI wiring
- `backend/modules/analytics/events.py` — event handlers (view tracking)
- `backend/modules/analytics/exceptions.py` — module exceptions
- `backend/modules/analytics/constants.py` — event names, constants
- `backend/migrations/versions/2026_05_02_0001_create_listing_view_stats_table.py`
- `backend/migrations/versions/2026_05_02_0002_create_review_disputes_table.py`
- `backend/tests/analytics/test_repository.py`
- `backend/tests/analytics/test_service.py`
- `backend/tests/analytics/test_router.py`

**Backend (modify):**
- `backend/main.py` — register analytics router + event subscriptions
- `backend/modules/listing/repository.py` — add `list_ids_for_owner()` method
- `backend/modules/listing/router.py` — emit LISTING_VIEWED event in detail endpoint
- `backend/modules/review/models.py` — add ReviewDispute model
- `backend/modules/review/repository.py` — add ReviewDisputeRepository
- `backend/modules/review/schemas.py` — add dispute schemas
- `backend/modules/review/exceptions.py` — add dispute exceptions

**Frontend (create):**
- `apps/web/modules/business/lib/businessAnalyticsApi.ts` — API client
- `apps/web/modules/business/components/AnalyticsDashboard.tsx` — main dashboard
- `apps/web/modules/business/components/StatusCards.tsx` — status cards row
- `apps/web/modules/business/components/MetricsGrid.tsx` — metric cards
- `apps/web/modules/business/components/ViewsChart.tsx` — recharts line chart
- `apps/web/modules/business/components/RevenuePlaceholder.tsx` — coming soon section
- `apps/web/modules/business/components/ReviewDisputeForm.tsx` — dispute modal
- `apps/web/modules/business/components/ActivityFeed.tsx` — activity feed
- `apps/web/modules/business/components/HelpCard.tsx` — new business owner help
- `apps/web/app/(business)/vi/dashboard/page.tsx` — route page
- `apps/web/modules/business/components/__tests__/AnalyticsDashboard.test.tsx`
- `apps/web/modules/business/components/__tests__/ViewsChart.test.tsx`
- `apps/web/modules/business/components/__tests__/ReviewDisputeForm.test.tsx`
- `apps/web/modules/business/components/__tests__/ActivityFeed.test.tsx`

**Frontend (modify):**
- `apps/web/modules/business/lib/types.ts` — add analytics types
- `apps/web/modules/business/components/BusinessSidebar.tsx` — update dashboard link

### Previous Story Intelligence (Story 8-3)

**Patterns established in 8-1 through 8-3 to follow:**
- Business router registered at `/api/v1/business/` prefix — analytics at `/api/v1/business/analytics`
- Ownership validation: query through listing → business_owner_id relationship
- Frontend uses `apiClient` for all calls with automatic snake↔camelCase
- Tests mock `infrastructure.translation_api` and `infrastructure.do_spaces` where needed
- Business sidebar already includes dashboard link (currently `/vi`)
- Client-side rendering for all business pages (no SSR)
- React Hook Form + Zod for forms (use for dispute form)
- TanStack Query for data fetching with query keys like `['business', 'entity', ...params]`
- Toast for success/error notifications
- EmptyState component for no-data scenarios

**Deferred issues from 8-2/8-3 still open (DO NOT fix in this story):**
- W1: Synchronous S3 + Pillow blocking async event loop (pre-existing)
- W2: Generic `/api/v1/media` IDOR on `owner_id` (pre-existing)
- W3: Generic media upload `owner_type` bypass (pre-existing)

### Git Intelligence

Latest commits (8-1 through 8-3) established:
- `backend/modules/listing/business_service.py` — service pattern for business endpoints
- `backend/modules/listing/business_router.py` — business endpoint auth + ownership pattern
- `backend/modules/coupon/business_service.py` — another service following same pattern
- `backend/modules/coupon/business_router.py` — business coupon endpoints
- `apps/web/modules/business/components/CouponForm.tsx` — latest business form pattern
- `apps/web/modules/business/components/CouponList.tsx` — latest business list pattern
- Event bus usage: `await emit(EVENT_NAME, {"key": "value"})` fire-and-forget pattern

### Testing Standards

- **Backend**: pytest + pytest-asyncio, mock external services (translation, DO Spaces), transaction rollback per test via `db_session` fixture. Target 80% service layer coverage
- **Frontend**: Vitest + React Testing Library, mock `apiClient`, mock `useAuth` (return BusinessOwner user), co-located `__tests__/` directories. Mock `recharts` as simple div wrappers
- **Test naming**: `test_{action}_{scenario}_{expected_result}` (backend), `it("should {action} when {condition}")` (frontend)

### Project Structure Notes

- Business portal routes: `(business)/vi/` route group — Vietnamese-only, desktop-first
- Analytics module is NEW — create following standard module structure at `backend/modules/analytics/`
- ReviewDispute model extends the review module — placed in `backend/modules/review/` since disputes are about reviews
- Dashboard page at `/business/vi/dashboard` is separate from business home at `/business/vi` (which shows listing preview)
- No existing chart library in the project — recharts will be the first (add via pnpm)

### Scope Boundaries

**IN SCOPE:**
- Business analytics summary endpoint (views, saves, reviews, coupons)
- Daily views time-series chart (30 days, recharts LineChart)
- Status cards (listing count, coupon count, total views)
- Metric cards with help tooltips
- CSV export of analytics data
- Review dispute form (create only — admin processing deferred)
- Activity feed (recent reviews, coupon redemptions)
- Help card for new business owners with zero data
- View tracking infrastructure (listing_view_stats table + event-driven recording)
- Revenue placeholder section (coming soon)
- Dashboard route page at `/business/vi/dashboard`
- BusinessSidebar navigation update

**OUT OF SCOPE (deferred):**
- Real revenue/payment tracking → Phase 2 (VNPay/Momo integration)
- Admin dispute processing → Epic 9 (Story 9-4)
- Listing view heatmap or geographic analytics → enhancement
- Competitor comparison analytics → enhancement
- Email reports/scheduled exports → enhancement
- Real-time analytics (WebSocket) → Phase 2
- A/B testing analytics → post-MVP
- Conversion funnel analytics → post-MVP
- Revenue forecasting → post-MVP
- Multi-listing comparison charts → enhancement
- Date range picker for analytics (fixed 30-day window for MVP) → enhancement

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-8-business-owner-portal.md#Story-8.4]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements.md#FR36-FR37-FR38-FR70]
- [Source: _bmad-output/planning-artifacts/prd/success-criteria.md#Business-Success]
- [Source: _bmad-output/planning-artifacts/prd/user-journeys.md#Journey-3-Chi-Huong]
- [Source: _bmad-output/planning-artifacts/architecture/core-architectural-decisions.md#Data-Architecture]
- [Source: _bmad-output/planning-artifacts/architecture/implementation-patterns-consistency-rules.md#Module-Structure]
- [Source: _bmad-output/planning-artifacts/architecture/project-structure-boundaries.md#Business-Routes]
- [Source: backend/modules/listing/models.py — Listing (review_count, rating_avg, business_owner_id), ListingFavorite]
- [Source: backend/modules/review/models.py — Review model structure]
- [Source: backend/modules/coupon/models.py — Coupon, CouponRedemption models]
- [Source: backend/modules/activity/models.py — ActivityLog (append-only audit)]
- [Source: backend/modules/activity/constants.py — COUPON_CLAIMED_ACTION, COUPON_REDEEMED_ACTION]
- [Source: backend/shared/events.py — emit/subscribe event bus pattern]
- [Source: backend/modules/listing/router.py — LISTING_INQUIRY_CREATED event pattern at line 189]
- [Source: backend/modules/listing/repository.py — aggregation query patterns (price_stats_by_bucket)]
- [Source: apps/web/modules/business/components/BusinessSidebar.tsx — nav items, dashboard link]
- [Source: apps/web/modules/business/lib/types.ts — existing business types, Paginated<T>]
- [Source: apps/web/shared/components/ — Skeleton, EmptyState, Toast, Modal, Card patterns]
- [Source: _bmad-output/implementation-artifacts/8-3-coupon-management-business.md — previous story intelligence]

## Dev Agent Record

### Agent Model Used

openai/gpt-5.4

### Debug Log References

- `pnpm --filter web add recharts`
- `python -m pytest backend/tests/analytics`
- `python -m ruff check backend/main.py backend/modules/analytics backend/modules/review/models.py backend/modules/review/repository.py backend/modules/review/schemas.py backend/modules/review/exceptions.py backend/modules/listing/router.py backend/modules/listing/repository.py backend/modules/listing/events.py backend/tests/analytics`
- `pnpm --filter web exec vitest run modules/business/components/__tests__/AnalyticsDashboard.test.tsx modules/business/components/__tests__/ViewsChart.test.tsx modules/business/components/__tests__/ReviewDisputeForm.test.tsx modules/business/components/__tests__/ActivityFeed.test.tsx modules/business/components/__tests__/BusinessSidebar.test.tsx`
- `pnpm --filter web exec eslint "modules/business/components/AnalyticsDashboard.tsx" "modules/business/components/StatusCards.tsx" "modules/business/components/MetricsGrid.tsx" "modules/business/components/ViewsChart.tsx" "modules/business/components/RevenuePlaceholder.tsx" "modules/business/components/HelpCard.tsx" "modules/business/components/ReviewDisputeForm.tsx" "modules/business/components/ActivityFeed.tsx" "modules/business/components/BusinessSidebar.tsx" "modules/business/components/__tests__/AnalyticsDashboard.test.tsx" "modules/business/components/__tests__/ViewsChart.test.tsx" "modules/business/components/__tests__/ReviewDisputeForm.test.tsx" "modules/business/components/__tests__/ActivityFeed.test.tsx" "modules/business/lib/businessAnalyticsApi.ts" "modules/business/lib/types.ts" "app/(business)/vi/dashboard/page.tsx"`
- `python -m pytest backend/tests/analytics -q`
- `python -m ruff check backend/modules/analytics backend/modules/review/models.py backend/migrations/versions/2026_05_02_0002_create_review_disputes_table.py backend/tests/analytics backend/tests/conftest.py`
- `python -m ruff check backend/modules/coupon/service.py`
- `python -m pytest backend/tests/coupon/test_claim_redeem.py::test_redeem_allows_claimed_coupon_after_business_deactivation -q`
- `python -m pytest backend/tests -q`
- `pnpm --filter web exec vitest run modules/business/components/__tests__/ActivityFeed.test.tsx`
- `pnpm --filter web exec vitest run modules/business/components/__tests__/AnalyticsDashboard.test.tsx modules/business/components/__tests__/ViewsChart.test.tsx modules/business/components/__tests__/ReviewDisputeForm.test.tsx modules/business/components/__tests__/ActivityFeed.test.tsx`
- `pnpm --filter web exec vitest run modules/business/components/__tests__/CouponList.test.tsx`
- `pnpm --filter web exec eslint "modules/business/components/ActivityFeed.tsx" "modules/business/lib/types.ts"`
- `pnpm --filter web exec eslint "modules/business/components/__tests__/CouponList.test.tsx"`
- `pnpm --filter web test`

### Completion Notes List

- Implemented a new backend `analytics` module with summary/activity/export/dispute endpoints, CSV streaming, listing view UPSERT tracking, DI wiring, and event subscription for `LISTING_VIEWED`.
- Extended the review module with `ReviewDispute` persistence, owner-scoped validation, dispute exceptions/schemas, and emitted `review.dispute.created` after successful submissions.
- Added the Vietnamese business analytics dashboard route, summary cards, metric tooltips, 30-day views chart, revenue placeholder, export action, review dispute modal, activity feed, and help card in the business portal UI.
- Added targeted backend and frontend regression coverage for analytics summary, activity feed, export, dispute creation, chart empty state, dashboard loading/zero state, and sidebar navigation.
- Added `db_session`-backed analytics repository fixtures that temporarily align the stale local test schema inside rollback transactions, then verify seeded listings, reviews, coupons, favorites, and view stats against real repository queries.
- Resolved the backend core review patches for timezone-safe view aggregation, invalid analytics event payload handling, nullable review labels, bounded streaming CSV export, accurate activity totals, and a `review_disputes.business_owner_id` index.
- Fixed the remaining full-suite regressions by allowing already-claimed coupons to redeem after a business deactivates the coupon and by mocking `next/navigation` in `CouponList.test.tsx`; backend and frontend suites now pass locally.

### File List

- `_bmad-output/implementation-artifacts/8-4-business-analytics-dashboard.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `apps/web/app/(business)/vi/dashboard/page.tsx`
- `apps/web/modules/business/components/ActivityFeed.tsx`
- `apps/web/modules/business/components/AnalyticsDashboard.tsx`
- `apps/web/modules/business/components/BusinessSidebar.tsx`
- `apps/web/modules/business/components/HelpCard.tsx`
- `apps/web/modules/business/components/MetricsGrid.tsx`
- `apps/web/modules/business/components/ReviewDisputeForm.tsx`
- `apps/web/modules/business/components/RevenuePlaceholder.tsx`
- `apps/web/modules/business/components/StatusCards.tsx`
- `apps/web/modules/business/components/ViewsChart.tsx`
- `apps/web/modules/business/components/__tests__/ActivityFeed.test.tsx`
- `apps/web/modules/business/components/__tests__/AnalyticsDashboard.test.tsx`
- `apps/web/modules/business/components/__tests__/CouponList.test.tsx`
- `apps/web/modules/business/components/__tests__/ReviewDisputeForm.test.tsx`
- `apps/web/modules/business/components/__tests__/ViewsChart.test.tsx`
- `apps/web/modules/business/lib/businessAnalyticsApi.ts`
- `apps/web/modules/business/lib/types.ts`
- `apps/web/package.json`
- `backend/main.py`
- `backend/migrations/versions/2026_05_02_0001_create_listing_view_stats_table.py`
- `backend/migrations/versions/2026_05_02_0002_create_review_disputes_table.py`
- `backend/modules/analytics/__init__.py`
- `backend/modules/analytics/constants.py`
- `backend/modules/analytics/dependencies.py`
- `backend/modules/analytics/events.py`
- `backend/modules/analytics/exceptions.py`
- `backend/modules/analytics/models.py`
- `backend/modules/analytics/repository.py`
- `backend/modules/analytics/router.py`
- `backend/modules/analytics/schemas.py`
- `backend/modules/analytics/service.py`
- `backend/modules/coupon/service.py`
- `backend/modules/listing/events.py`
- `backend/modules/listing/repository.py`
- `backend/modules/listing/router.py`
- `backend/modules/review/exceptions.py`
- `backend/modules/review/models.py`
- `backend/modules/review/repository.py`
- `backend/modules/review/schemas.py`
- `backend/tests/analytics/__init__.py`
- `backend/tests/analytics/test_events.py`
- `backend/tests/analytics/test_repository.py`
- `backend/tests/analytics/test_router.py`
- `backend/tests/analytics/test_service.py`
- `backend/tests/conftest.py`
- `pnpm-lock.yaml`

### Review Findings (Backend Core — 2026-05-04)

#### Decision Needed

- [x] [Review][Decision] `asyncio.gather` on shared `AsyncSession` — resolved: separate sessions per query via `_run_analytics()` helper with session-factory fallback [service.py, dependencies.py]
- [x] [Review][Decision] View milestones renamed to `view_summary` — not real threshold milestones, just view counts per listing [repository.py, schemas.py, constants.py, types.ts]
- [x] [Review][Decision] `find_existing_for_review` soft-delete conflict — resolved: removed `deleted_at` filter, no re-dispute allowed [review/repository.py:363]

#### Patch

- [x] [Review][Patch] `date.today()` without timezone — use `datetime.now(UTC).date()` for consistency [repository.py:54,81]
- [x] [Review][Patch] `handle_listing_viewed` missing `ValueError` catch for `uuid.UUID()` parse [events.py:22]
- [x] [Review][Patch] `_review_option_label` crashes when `body` is `None` — add `body or ""` guard [repository.py:442-443]
- [x] [Review][Patch] CSV export has no upper bound on date range — add max 365-day limit [service.py:148-195]
- [x] [Review][Patch] Activity feed `total` count is inaccurate — changes per page request. Use proper COUNT queries or remove total [service.py:117-142]
- [x] [Review][Patch] Missing index on `review_disputes.business_owner_id` [migration 0002]
- [x] [Review][Patch] CSV export not truly streaming — loads entire CSV into StringIO first [service.py:174-195]
- [ ] [Review][Patch] Activity feed `total` includes view summaries beyond the fixed fetch window, so page 2+ can advertise more rows than `recent_view_summaries()` can ever return [service.py:132-170, ActivityFeed.tsx:57-63]
- [ ] [Review][Patch] Parallel analytics reads bypass the injected request session by opening fresh sessions from the global session factory, which can break transaction/test isolation and read stale state [dependencies.py:19-30, service.py:67-75]

#### Deferred

- [x] [Review][Defer] `listing_ids_for_owner` returns draft listings in analytics — design choice, not bug
- [x] [Review][Defer] `review_options` coupled into summary endpoint — refactor later
- [x] [Review][Defer] `activity_log` table not queried in activity feed — integration deferred
- [x] [Review][Defer] No rate limiting/deduplication for view tracking — broader analytics policy choice, keep raw daily totals for MVP [listing/router.py]

### Change Log

- 2026-05-02: Implemented Story 8.4 across backend analytics/dispute APIs, business dashboard UI, targeted regression tests, and analytics routing/event wiring; left the story in-progress because local `db_session` analytics seeding is blocked by a stale test DB schema and full repository regression still shows unrelated pre-existing coupon test failures.
- 2026-05-04: Completed Story 8.4 follow-up work by adding `db_session` analytics fixtures, resolving backend core review patches, fixing the remaining backend/frontend regression failures, and moving the story to `review` after full green suites.
- 2026-05-04: Code review found two follow-up patch items in activity pagination/session isolation; left them as action items and moved the story back to `in-progress`.
