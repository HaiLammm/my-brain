# Báo cáo tiến độ dự án DaNangNavi — 3 tuần (07/04 – 28/04/2026)

---

## Phần 1: Tổng quan & Mục tiêu

### Dự án là gì?

**DaNangNavi** là nền tảng hướng dẫn kinh doanh và đời sống địa phương tại Đà Nẵng, Việt Nam — tương tự Hot Pepper / danang-holic. Nền tảng kết nối người Nhật định cư, người Việt bản địa và du khách với các doanh nghiệp địa phương thông qua danh sách curated, hướng dẫn khu vực, coupon ưu đãi, và khám phá dọc tuyến đường.

### Trạng thái hiện tại

Dự án đang ở **giai đoạn phát triển MVP** — Phase 4 (Implementation) trong quy trình BMad Method. Toàn bộ tài liệu thiết kế (Product Brief, PRD, Architecture, UX Scenarios, Design System, Epic Breakdown) đã hoàn thành trước đó. 3 tuần qua tập trung **100% vào code implementation**.

### Mục tiêu trọng tâm 3 tuần qua

| Tuần | Cột mốc | Kết quả |
|------|---------|---------|
| **Tuần 1** (07–13/04) | Xây dựng nền tảng: monorepo, design tokens, layout shell, xác thực người dùng (LINE, Google, Zalo) | ✅ Hoàn thành |
| **Tuần 2** (14–20/04) | Hệ thống Listing & Discovery: search, listing detail, area guides, favorites, deals/coupons, notifications | ✅ Hoàn thành |
| **Tuần 3** (21–28/04) | Journey Discovery (Google Maps), Onboarding, Profile, Reviews, Community, Translation Tools, Business Portal | ✅ Hoàn thành |

---

## Phần 2: Kết quả đạt được

**Tổng cộng: 70 commits, ~450K dòng code net (insertions - deletions), 37/45 stories đã có implementation.**

### 2.1 Frontend (Next.js 16 + React 19)

#### Các trang/component chính đã hoàn thành:

| Trang/Feature | Mô tả |
|--------------|-------|
| **Homepage** | Hero banner, Senpai Picks carousel, Deals section, Community highlights |
| **Search & Browse** | Tìm kiếm cross-language (Nhật/Việt/Anh), filter theo category/area/price, sort multiple criteria |
| **Listing Detail** | Gallery ảnh, thông tin chi tiết, fair price indicator, map embed, review section |
| **Area Guides** | Hướng dẫn theo khu vực Đà Nẵng, listings theo neighborhood |
| **Favorites Collection** | Lưu/bỏ lưu listing, quản lý collection cá nhân |
| **Journey Discovery** 🌟 | Nhập origin→destination, vẽ route trên bản đồ, gợi ý listings dọc tuyến đường, route personality (food/scenic/fastest), deals dọc route |
| **Onboarding Flow** | Welcome wizard cho người dùng mới, preference setup |
| **User Profile** | Trang cá nhân, edit profile, contribution history |
| **Review System** | Viết review với star rating, upload ảnh (camera-only), helpful votes |
| **Community Hub** | Duyệt nhóm, tạo bài viết/bình luận, like, thread detail |
| **Events & Meetups** | Lịch sự kiện, RSVP, event detail |
| **Voice Translation** | Giao diện dịch giọng nói real-time, conversation mode |
| **Phrase Packs** | Phrasebook theo category, quick phrases |
| **Menu OCR** | Chụp ảnh menu → OCR → dịch tự động |
| **Translation FAB** | Floating Action Button truy cập nhanh translation tools |
| **Business Portal** | Listing editor (tạo/sửa listing), auto-translation preview, business hours, menu items |

#### Cải thiện UX:

- **Đa ngôn ngữ (i18n)**: Hỗ trợ 3 locale (ja/vi/en) với next-intl, URL-based routing (`/ja/`, `/vi/`, `/en/`)
- **Responsive Design**: Mobile-first với Tailwind CSS 4.x design tokens
- **State Management**: Zustand stores cho auth, favorites, journey state
- **SEO**: Dynamic metadata, OG tags, sitemap cho mỗi trang

### 2.2 Backend & Database (FastAPI + PostgreSQL + PostGIS)

#### API Endpoints mới:

| Module | Endpoints | Điểm nổi bật |
|--------|-----------|-------------|
| **Auth** | `/auth/login/{provider}`, `/auth/callback/{provider}`, `/auth/logout`, `/auth/me` | OAuth2 flow cho LINE, Google, Zalo; JWT httpOnly cookies |
| **Listings** | `/listings`, `/listings/{id}`, `/listings/search`, `/listings/{id}/reviews` | Full CRUD, Meilisearch integration, fair price calculation |
| **Areas** | `/areas`, `/areas/{slug}` | Neighborhood guides với listing aggregation |
| **Favorites** | `/favorites`, `/favorites/{listing_id}` | Toggle favorite, list with pagination |
| **Deals** | `/deals`, `/deals/{id}/claim` | Coupon browsing, claim & redemption tracking |
| **Notifications** | `/notifications`, `/notifications/preferences` | In-app notifications, preference management |
| **Journey** | `/journeys/directions`, `/journeys/route` | Google Directions API proxy, route-aware listing matching |
| **Onboarding** | `/users/onboarding` | Preference setup, progress tracking |
| **Profile** | `/users/profile`, `/users/{id}/badges` | Edit profile, Senpai badge system |
| **Gamification** | `/gamification/points`, `/gamification/history` | Contribution points engine, level system |
| **Reviews** | `/reviews`, `/reviews/{id}/helpful` | Star ratings, photo upload, helpful votes |
| **Community** | `/community/groups`, `/community/posts`, `/community/comments` | Groups, posts, comments, likes |
| **Events** | `/events`, `/events/{id}/rsvp` | Event listing, RSVP management |
| **Translation** | `/translation/voice`, `/translation/ocr`, `/translation/phrases` | Voice translation, menu OCR (Pillow + Tesseract), phrase packs |
| **Business** | `/business/listings`, `/business/listings/{id}/translate-preview` | Listing CRUD for owners, auto-translation preview |

#### Database & Caching:

- **PostgreSQL 16 + PostGIS**: Geospatial queries cho journey route matching (`ST_Buffer`, `ST_Intersects`, `ST_LineLocatePoint`)
- **Redis 7**: Session cache, rate limiting, journey directions cache (1h TTL), gamification cache
- **Meilisearch 1.16**: Full-text search với cross-language support (Nhật/Việt/Anh), filterable attributes, sortable fields
- **Alembic migrations**: Schema versioning cho toàn bộ models

#### Kiến trúc đáng chú ý:

- **Event-driven architecture**: `shared/events.py` event bus cho cross-module communication (review → gamification points, post → notification)
- **N+1 prevention**: Batch photo loading qua `MediaService.list_grouped_for_owners()` — 1 query thay vì N+1
- **PostGIS CTE optimization**: Route matching dùng CTE với GiST index, ordering theo `ST_LineLocatePoint`

### 2.3 Công nghệ & Thư viện

| Công nghệ | Lý do chọn |
|-----------|-----------|
| **Next.js 16 (App Router)** | Server Components giảm JS bundle, streaming SSR, built-in i18n routing |
| **React 19** | `use()` hook, improved Suspense, Server Actions |
| **Tailwind CSS 4.x** | Design tokens native, CSS-first config, zero-runtime |
| **Zustand 5** | Lightweight state management, không cần provider wrapper |
| **next-intl 4** | ICU message format, server/client component support, URL-based locale |
| **Zod 4** | Frontend validation, type inference từ schema |
| **FastAPI + SQLAlchemy async** | High performance async API, type-safe ORM |
| **PostGIS** | Geospatial indexing cho route-aware discovery — tính năng cốt lõi |
| **Meilisearch** | Typo-tolerant full-text search, faceted filtering, instant results |
| **Leaflet + react-leaflet** | Map rendering miễn phí (OpenStreetMap tiles), lightweight |
| **Google Maps Directions API** | Polyline routing chính xác cho journey discovery |
| **Shadcn/UI patterns** | Accessible, composable components, customizable với Tailwind |

---

## Phần 3: Demo — Kịch bản & Showcase

### Kịch bản Demo 1: "Naoki — Người Nhật mới đến Đà Nẵng"

```
Trang chủ → Xem Senpai Picks → Tìm kiếm "ラーメン" (ramen)
→ Xem listing detail với fair price → Viết review với ảnh
→ Xem contribution points tăng → Kiểm tra Senpai badge progress
```

### Kịch bản Demo 2: "Journey Discovery — Trên đường đi làm" 🌟

```
Trang Journey → Nhập "Nhà ở Hải Châu" → "Văn phòng Sơn Trà"
→ Xem route trên bản đồ → Chọn personality "Food"
→ Xem danh sách quán ăn dọc đường (< 300m từ route)
→ Xem deals/coupons dọc tuyến → Claim coupon
```

### Kịch bản Demo 3: "Tomoko — Du khách cần dịch menu"

```
Vào nhà hàng → Mở Translation FAB → Chụp ảnh menu
→ OCR nhận diện → Hiển thị bản dịch Nhật/Anh
→ Chuyển sang Voice Translation → Nói tiếng Nhật
→ Nghe bản dịch tiếng Việt
```

### Kịch bản Demo 4: "Lan — Chủ quán đăng listing"

```
Đăng ký business account → Vào Business Portal
→ Tạo listing mới (wizard 3 bước) → Nhập thông tin tiếng Việt
→ Xem auto-translate preview sang Nhật/Anh
→ Upload ảnh + set business hours → Publish listing
```

### Showcase kỹ thuật

1. **PostGIS Route Matching**: Giải thích cách `ST_Buffer` tạo vùng 300m quanh polyline, `ST_Intersects` tìm listings trong vùng, `ST_LineLocatePoint` sắp xếp theo thứ tự dọc đường
2. **Cross-language Search**: Meilisearch tokenize tiếng Nhật (CJK) + tiếng Việt (diacritics-insensitive) trong cùng 1 index
3. **Event-driven Gamification**: Viết review → emit event → gamification handler tính điểm → badge check → notification

---

## Phần 4: Khó khăn & Giải pháp

### 4.1 OAuth Redirect URI trên môi trường Vercel

**Vấn đề**: OAuth callback (LINE, Google, Zalo) cần `redirect_uri` chính xác. Khi deploy trên Vercel, mỗi preview deployment có URL khác nhau, và backend chạy ở domain riêng → `redirect_uri` không khớp.

**Giải pháp**: Build `redirect_uri` dynamically từ request origin — frontend gửi `origin` qua query param khi redirect tới OAuth provider, backend dùng origin đó để construct callback URL. 7 commits fix liên tiếp (13–14/04) để handle edge cases.

### 4.2 asyncpg SSL kết nối Neon PostgreSQL

**Vấn đề**: Neon PostgreSQL yêu cầu SSL, nhưng `asyncpg` không nhận `sslmode=require` trong DATABASE_URL như `psycopg2`.

**Giải pháp**: Thay `sslmode` bằng `ssl=require` trong connection string cho asyncpg driver. Một thay đổi nhỏ nhưng mất thời gian debug vì error message không rõ ràng.

### 4.3 Proxy Set-Cookie header bị mất

**Vấn đề**: Next.js proxy (BFF pattern) tới FastAPI backend, nhưng khi backend trả về multiple `Set-Cookie` headers (access_token + refresh_token), proxy chỉ giữ lại 1 header — do `headers.get('set-cookie')` chỉ trả về header đầu tiên.

**Giải pháp**: Sử dụng `response.headers.getSetCookie()` (trả về array) + `appendHeader()` để forward tất cả Set-Cookie headers. Đây là gotcha phổ biến với Fetch API.

### 4.4 Zalo domain verification

**Vấn đề**: Zalo OAuth yêu cầu verify domain ownership bằng meta tag HOẶC file HTML tại root. Next.js App Router không serve static HTML files ở root path dễ dàng.

**Giải pháp**: Tạo file verification HTML tại `public/` directory + thêm meta tag vào `<head>` layout. Cần 3 commits để đảm bảo meta tag render đúng thời điểm cho Zalo crawler.

### 4.5 PostGIS performance cho route matching

**Vấn đề**: Query tìm listings trong buffer 300m của polyline route ban đầu rất chậm (~2s) do full table scan.

**Giải pháp**: 
- Thêm GiST spatial index trên `listings.location` (geometry column)
- Sử dụng CTE (Common Table Expression) để tách filter → sort → paginate
- Redis cache 1h cho kết quả route matching (key = coords + params)
- Kết quả: query giảm xuống ~50ms

### 4.6 Deferred Work Management

**Vấn đề**: Code review phát hiện nhiều issues không blocking nhưng cần track (security, performance, UX).

**Giải pháp**: Duy trì file `deferred-work.md` — hiện có **~80 items** từ 13 code review sessions. Mỗi item ghi rõ nguồn gốc, mô tả, và file liên quan. Ưu tiên fix theo severity khi story liên quan được implement.

---

## Phần 5: Kế hoạch tiếp theo (3 tuần tới)

### Đầu việc ưu tiên

| Ưu tiên | Việc cần làm | Ước lượng |
|---------|-------------|-----------|
| **P0** | Code review 17 stories đang chờ review → chuyển sang done | 1 tuần |
| **P1** | Epic 8 — Business Portal: Photo upload (8-2), Coupon management (8-3), Analytics dashboard (8-4) | 1 tuần |
| **P2** | Epic 9 — Admin Panel: Dashboard, user management, content moderation, RBAC | 1–2 tuần |
| **P3** | Fix deferred work items (security: open redirect, rate limiting; UX: pagination, accessibility) | Xen kẽ |

### Dự báo rủi ro

| Rủi ro | Mức độ | Giảm thiểu |
|--------|--------|-----------|
| **17 stories chờ review tạo bottleneck** | 🔴 Cao | Batch review, ưu tiên review trước khi code mới |
| **Security items trong deferred-work** (open redirect, missing rate limits) | 🟡 Trung bình | Fix trước khi deploy production, đặc biệt OAuth redirect validation |
| **Epic 9 (Admin Panel) phức tạp** — RBAC, content moderation, dispute resolution | 🟡 Trung bình | Có thể defer 9-4, 9-5 sang phase sau MVP |
| **Google Maps API cost** khi traffic tăng | 🟡 Trung bình | Đã có Redis cache 1h; cần set billing hard-cap |
| **Chưa có E2E tests** | 🟡 Trung bình | Vitest unit tests đã có; cần Playwright E2E cho critical flows |

### Milestone target

- **Tuần 5 (05/05)**: Tất cả stories chuyển sang done (code review xong), Epic 8 hoàn thành
- **Tuần 6 (12/05)**: Epic 9 core (admin dashboard + user management), security fixes
- **Tuần 7 (19/05)**: MVP feature-complete, E2E tests cho critical flows, staging deploy

---

*Báo cáo tạo ngày 28/04/2026. Dữ liệu từ git history 70 commits (07/04–28/04) và sprint-status.yaml.*
