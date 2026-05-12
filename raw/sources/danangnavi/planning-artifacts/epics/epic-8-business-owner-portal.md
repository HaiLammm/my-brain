# Epic 8: Business Owner Portal

Vietnamese business owners can register, create/edit listings with auto-translation to Japanese, upload photos, manage coupons, view analytics dashboard, and track revenue — all in a Vietnamese-only UI.

## Story 8.1: Listing Editor — Create & Edit with Auto-Translation

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

## Story 8.2: Photo Upload & Media Management (Business)

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

## Story 8.3: Coupon Management (Business)

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

## Story 8.4: Business Analytics Dashboard

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
