---
id: sources/epic-3-implementation-artifacts-tailor-project
title: Epic 3 — Implementation Artifacts (tailor_project)
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
  - epic-3
  - cart
  - checkout
  - payment
  - booking
  - ssot
raw_paths:
  - raw/sources/projects/tailor-project/implementation-artifacts/3-1-cart-state-management.md
  - raw/sources/projects/tailor-project/implementation-artifacts/3-2-render-cart-checkout-details.md
  - raw/sources/projects/tailor-project/implementation-artifacts/3-3-checkout-information-payment-gateway.md
  - raw/sources/projects/tailor-project/implementation-artifacts/3-4-dong-goi-du-lieu-ssot.md
  - raw/sources/projects/tailor-project/implementation-artifacts/3-4-lich-book-appointments-tiem-khach.md
ingest_status: finalized
verify_status: passed
---

## Summary

Bộ 5 artifact triển khai cho **Epic 3 — Cart, Checkout & Booking** của tailor_project. Epic 3 bao gồm: quản lý giỏ hàng client-side với Zustand + localStorage persist (Story 3.1), hiển thị và xác thực giỏ hàng trước thanh toán (Story 3.2), quy trình thanh toán 3 bước — Shipping + Payment + Confirmation (Story 3.3), đóng gói dữ liệu hình học SSOT (Story 3.4a), và lịch đặt hẹn tư vấn Bespoke với calendar UI (Story 3.4b). 4/5 story đã hoàn thành (done), 1 story chỉ có Phase 1 requirements (Story 3.4a — SSOT geometry JSON).

## Key claims

- **Cart State Management thuần client** — Zustand v5 + persist middleware quản lý giỏ hàng hoàn toàn ở client-side; backend chỉ được gọi khi checkout để verify giá và availability ([[concepts/swe/authoritative-server-pattern]]).
- **Authoritative Server Pattern** — Giá và tình trạng kho PHẢI được backend xác thực trước khi cho phép thanh toán; Zustand cart chỉ là Optimistic UI, không phải nguồn sự thật ([[concepts/swe/ssot]], [[concepts/swe/authoritative-server-pattern]]).
- **Checkout flow 3 bước** — (1) Review Cart & Verify → (2) Shipping Info & Payment Method → (3) Confirmation. Mục tiêu: từ Homepage đến Order Confirmation ≤ 3 phút ([[concepts/tailor/checkout-and-payment]]).
- **Payment Gateway MVP** — COD là phương thức mặc định (fallback); VNPay/Momo dùng mock payment URL cho MVP; webhook xử lý ở Story 4.1 ([[concepts/tailor/checkout-and-payment]]).
- **Inline Validation (không Zod)** — Frontend validation dùng hàm inline thay vì Zod library (Zod không có trong deps); pattern nhất quán qua các story 3.2, 3.3, 3.4b ([[concepts/swe/inline-form-validation]]).
- **Race Condition Prevention** — `SELECT ... FOR UPDATE` khi tạo appointment và order; MongoDB/PostgreSQL isolation level; double-submit guard ở frontend ([[concepts/swe/race-condition-prevention]]).
- **Calendar Booking với Slot Management** — Max 3 bookings/slot (sáng/chiều); `get_month_availability()` API; Framer Motion animation; responsive week/month view ([[concepts/tailor/booking-flow]], [[concepts/tailor/booking-flow]]).
- **Server Action Pattern nhất quán** — AbortController timeout 10s; error handling chuẩn hóa; guest checkout hỗ trợ ([[concepts/swe/server-action-pattern]]).

## Evidence

- **Story 3.1** (Cart State Management): 9 tasks với 45+ subtasks; Zustand v5 + persist + devtools; CartItem type với duplicate prevention; CartDrawer slide-in; RentalDateModal + SizeSelectModal; CartBadge trên Navbar; 41 new tests (total 457), code review thêm 9 tests.
- **Story 3.2** (Render Cart Checkout Details): 8 tasks; verifyCartItems Server Action dùng fetchGarmentDetail; CheckoutItemRow với unavailable warning; OrderSummary sidebar; responsive 2-column layout; 42 new tests (total 551+).
- **Story 3.3** (Checkout Information & Payment Gateway): 13 tasks (5 backend + 8 frontend); OrderDB + OrderItemDB models; order_service với Authoritative Server pricing; ShippingFormClient với inline validation; PaymentMethodSelector (COD/VNPay/Momo); OrderConfirmation page; 21 backend + 43 frontend tests. Senior Dev Review: 3 CRITICAL + 8 HIGH + 14 MEDIUM + 8 LOW findings; fixed race condition (FOR UPDATE + batch fetch), open redirect prevention, cart-clear timing.
- **Story 3.4a** (Đóng gói dữ liệu SSOT): Chỉ Phase 1 requirements — Master Geometry JSON với sequence_id, base_hash, deltas, geometry_hash; checksum verification (NFR5). Chưa triển khai Phase 2.
- **Story 3.4b** (Lịch Book Appointments): 15 tasks (6 backend + 1 email + 8 frontend); AppointmentDB model; appointment_service với slot availability; SELECT FOR UPDATE race condition prevention; BookingCalendar (week/month responsive); SlotSelector; BookingForm with inline validation; BookingConfirmationModal với Framer Motion; 23 backend + 40 frontend tests; framer-motion và @testing-library/user-event mới được install.

## Related concepts

- [[concepts/swe/authoritative-server-pattern]]
- [[concepts/swe/zustand-cart-store]]
- [[concepts/tailor/checkout-and-payment]]
- [[concepts/tailor/checkout-and-payment]]
- [[concepts/swe/inline-form-validation]]
- [[concepts/swe/server-action-pattern]]
- [[concepts/swe/race-condition-prevention]]
- [[concepts/tailor/booking-flow]]
- [[concepts/tailor/booking-flow]]
- [[concepts/swe/ssot]]
- [[concepts/swe/optimistic-update]]
- [[concepts/tailor/order-status-pipeline]]
- [[concepts/tailor/unified-order-workflow]]
- [[concepts/tailor/design-system]]
- [[concepts/swe/tanstack-query]]

## Related sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]
- [[sources/epic-1-implementation-artifacts-tailor-project]]
- [[sources/epic-2-implementation-artifacts-tailor-project]]

## People

- [[people/co-lan-owner]]
- [[people/linh-customer]]

## Open questions

- Story 3.4a (SSOT Geometry JSON) chỉ có Phase 1 requirements — khi nào sẽ triển khai? Pattern Engine (Epic 11) cần hoàn thiện trước?
- VNPay/Momo payment gateway hiện dùng mock URL — cần tích hợp sandbox thật khi có merchant account.
- Webhook xử lý payment callback sẽ nằm ở Story 4.1 — chưa triển khai trong Epic 3.
- Province/district/ward dropdown cho địa chỉ giao hàng hiện là text input — cần tích hợp API địa chỉ VN (provinces.open-api.vn) cho production.
- Email service dùng SMTP trực tiếp — chưa có integration với SendGrid/SES cho production.
- Story 3.3 thiếu customer_email field trong OrderDB — cần migration riêng.