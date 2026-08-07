---
id: sources/epic-2-implementation-artifacts-tailor-project
title: Epic 2 — Implementation Artifacts (tailor_project)
type: source
created: 2026-05-14
updated: 2026-05-14
authors:
  - tailor_project team
year: 2026
importance: 3
provenance: replayable
confidence: high
source_type: note
tags:
  - tailor-project
  - implementation
  - epic-2
  - showroom
  - product-management
  - email-reminders
  - inventory-tracking
raw_paths:
  - raw/sources/projects/tailor-project/implementation-artifacts/2-1-hien-thi-listing-grid-san-pham.md
  - raw/sources/projects/tailor-project/implementation-artifacts/2-2-tuong-tac-view-chi-tiet-zoom-anh.md
  - raw/sources/projects/tailor-project/implementation-artifacts/2-3-he-thong-loc-san-pham-da-chieu.md
  - raw/sources/projects/tailor-project/implementation-artifacts/2-4-dashboard-owner-crud-san-pham-ao-dai.md
  - raw/sources/projects/tailor-project/implementation-artifacts/2-5-phac-thao-giao-dien-rule-editor.md
  - raw/sources/projects/tailor-project/implementation-artifacts/2-5-tracker-trang-thai-2-cham.md
  - raw/sources/projects/tailor-project/implementation-artifacts/2-6-timeline-tracking-automated-email-reminders.md
ingest_status: finalized
verify_status: passed
---

## Summary

Bộ 7 artifact triển khai cho **Epic 2 — Digital Showroom & Product Management** của tailor_project, nền tảng may đo bespoke kết hợp AI. Epic 2 bao gồm: hiển thị catalog sản phẩm áo dài dạng grid (Story 2.1), tương tác xem chi tiết và zoom ảnh HD (Story 2.2), hệ thống lọc đa chiều (Story 2.3), CRUD sản phẩm cho Owner (Story 2.4), giao diện Rule Editor chưa triển khai Phase 2 (Story 2.5a), cập nhật trạng thái kho 2 chạm (Story 2.5b), và timeline tracking cùng email nhắc nhở tự động (Story 2.6). 6/7 story đã hoàn thành (done), 1 story chỉ có Phase 1 requirements (Story 2.5a — Rule Editor lưu chỗ cho Phase sau).

## Key Claims

- **Digital Showroom với Server-Side Rendering** — Trang showroom dùng Next.js SSG/ISR kết hợp TanStack Query cho client-side re-fetching khi thay bộ lọc, đảm bảo performance < 500ms cho filter updates và SEO-friendly.
- **Zoom ảnh HD đa nền tảng** — Sử dụng `react-medium-image-zoom` cho hover zoom (desktop) và pinch-to-zoom (mobile), gallery đa ảnh với thumbnail navigation và keyboard accessibility.
- **Lọc sản phẩm đa chiều (5 chiều)** — Lọc theo Dịp/Season, Chất liệu, Màu sắc, Kích cỡ, Loại áo dài; tag-based filter chips với debounce 300ms, URL state persistence, và dynamic color fetching từ backend.
- **CRUD sản phẩm Owner Dashboard** — React Hook Form + Zod validation cho form tạo/sửa sản phẩm; TanStack Query cache invalidation đồng bộ giữa showroom (customer) và products (owner); responsive table/card layout.
- **Cập nhật trạng thái kho 2 chạm** — InventoryCard cho phép Owner cập nhật trạng thái garment chỉ với 2 lần chạm: tap chọn sản phẩm → tap chọn trạng thái mới, với micro-toast xác nhận và optimistic update rollback khi lỗi.
- **Email nhắc nhở trả đồ tự động** — Background scheduler chạy 8:00 AM hàng ngày (asyncio), gửi email 24h trước hạn trả; idempotent nhờ `reminder_sent_at` timestamp; manual trigger endpoint cho Owner.
- **Heritage Palette Design System** — Bảng màu nhất quán: Indigo Depth (#1A2B4C), Silk Ivory (#F9F7F2), Heritage Gold (#D4AF37); typography dual-tone (Cormorant Garamond headings, JetBrains Mono prices, Inter body); touch targets tối thiểu 44x44px.
- **Rule Editor chưa triển khai Phase 2** — Story 2.5a (Phác thảo Giao diện Rule Editor) chỉ có Phase 1 requirements, được giữ làm placeholder cho Epic sau khi Smart Rules engine hoàn thiện.

## Evidence

- **Story 2.1** (Listing Grid): 10/10 tasks done; SSG/ISR optimization, multi-tenant isolation qua `tenant_id`, responsive bottom-sheet layout mobile.
- **Story 2.2** (View Chi Tiết & Zoom Ảnh): 7 tasks với 40+ subtasks; `react-medium-image-zoom@5.4.1` cho zoom; Review follow-up: 9 items resolved (1 Critical, 1 High, 4 Medium, 3 Low); 347 frontend + 67 backend tests.
- **Story 2.3** (Lọc Đa Chiều): 8 tasks; `GarmentMaterial` enum (7 giá trị), `GarmentOccasion` enum, TanStack Query integration, dynamic color API endpoint; Review round 2: 4 more items resolved; 369+ frontend + 64+ backend tests.
- **Story 2.4** (Owner CRUD): 6 tasks; React Hook Form + Zod, ProductForm reuse cho cả create/edit, DeleteConfirmDialog, revalidatePath cho cache sync; 41 new tests (total 416), 0 regressions.
- **Story 2.5a** (Rule Editor): Chỉ Phase 1 requirements, chưa triển khai Phase 2.
- **Story 2.5b** (Tracker 2 chạm): 10/10 tasks done; dedicated `PATCH /api/v1/garments/{id}/status` endpoint, InventoryCard với status buttons ≥44px, micro-toast pattern.
- **Story 2.6** (Timeline & Email Reminders): 18 tasks (10 Story A + 8 Story B); `reminder_sent_at` field trên bảng garments, idempotent email, background scheduler, ReturnTimeline component cho customer view.

## Related concepts

- [[concepts/tailor/digital-showroom]]
- [[concepts/swe/tanstack-query]]
- [[concepts/tailor/design-system]]
- [[concepts/swe/optimistic-update]]
- [[concepts/tailor/design-system]]
- [[concepts/swe/idempotent-scheduled-job]]
- [[concepts/swe/multi-tenant-rls]]
- [[concepts/tailor/dual-mode-ui]]
- [[concepts/tailor/order-status-pipeline]]
- [[concepts/swe/ssot]]
- [[concepts/swe/rbac]]
- [[concepts/swe/react-hook-form-zod]]

## Related sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]
- [[sources/epic-1-implementation-artifacts-tailor-project]]

## People

- [[people/co-lan-owner]]
- [[people/linh-customer]]

## Open questions

- Story 2.5a (Rule Editor) chỉ có Phase 1 requirements — khi nào sẽ triển khai thực tế? Smart Rules engine cần hoàn thiện trước.
- Story 2.6 email reminders sử dụng SMTP trực tiếp — chưa có tích hợp email service provider (SendGrid, SES) cho production.
- Story 2.3 dynamic color fetching tạo endpoint mới `GET /api/v1/garments/colors` — cần theo dõi performance khi số lượng sản phẩm tăng.
- Story 2.4 ProductForm gửi full payload cho PUT endpoint (không phải PATCH) — có rủi ro overwrite data khi concurrent edits.
- Avatar upload cho khách hàng (Epic 1) vẫn dùng local filesystem — ảnh sản phẩm cũng chưa có S3/Cloudinary integration.