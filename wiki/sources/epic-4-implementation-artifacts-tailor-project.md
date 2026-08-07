---
id: sources/epic-4-implementation-artifacts-tailor-project
title: Epic 4 — Implementation Artifacts (tailor_project)
type: source
created: 2026-05-15
updated: 2026-05-15
authors:
  - tailor_project team
year: 2026
importance: 3
provenance: replayable
confidence: unverified
source_type: note
tags:
  - tailor-project
  - implementation
  - epic-4
  - orders
  - customer-profile
  - payments
  - rentals
raw_paths:
  - raw/sources/projects/tailor-project/implementation-artifacts/4-1-xu-ly-state-thanh-toan-qua-webhook.md
  - raw/sources/projects/tailor-project/implementation-artifacts/4-2-visual-bang-don-hang-owner-host.md
  - raw/sources/projects/tailor-project/implementation-artifacts/4-3-owner-theo-doi-thuemuon-dai-han.md
  - raw/sources/projects/tailor-project/implementation-artifacts/4-4a-customer-profile-layout-navbar-icon.md
  - raw/sources/projects/tailor-project/implementation-artifacts/4-4b-thong-tin-ca-nhan-bao-mat.md
  - raw/sources/projects/tailor-project/implementation-artifacts/4-4c-lich-su-mua-hang-trang-thai-don.md
  - raw/sources/projects/tailor-project/implementation-artifacts/4-4d-so-do-co-the.md
  - raw/sources/projects/tailor-project/implementation-artifacts/4-4e-lich-hen-sap-toi.md
  - raw/sources/projects/tailor-project/implementation-artifacts/4-4f-thong-bao-notifications.md
  - raw/sources/projects/tailor-project/implementation-artifacts/4-4g-kho-voucher.md
ingest_status: finalized
verify_status: passed
findings: []
---

## Summary

Đây là bộ 10 implementation artifact thuộc **Epic 4 — Orders & Customer Profile** của tailor_project. Epic này khép kín giai đoạn hậu checkout theo hai mặt: phía vận hành có webhook thanh toán, bảng đơn hàng và bảng quản trị đồ thuê; phía khách hàng có profile hub để tự phục vụ thông tin cá nhân, lịch sử đơn, số đo, lịch hẹn và ví voucher. Nhiều luồng cốt lõi đã có implementation và test riêng, nhưng hồ sơ review/hoàn tất giữa các story chưa đồng đều: trung tâm thông báo vẫn mới dừng ở mức thiết kế, còn voucher wallet thiếu completion notes để xác nhận mức hoàn tất thực tế.

## Key Claims

- **Webhook thanh toán trở thành nguồn xác nhận thật** — Thanh toán VNPay/Momo được chốt qua callback backend có xác thực chữ ký, kiểm tra idempotency, ghi `payment_transactions`, kiểm tra lệch số tiền và chỉ cập nhật `payment_status` từ phía server.
- **Owner có bảng điều phối đơn hàng trực quan** — Epic 4 thêm `/owner/orders` với lọc, phân trang, chi tiết đơn, lịch sử thanh toán và chuyển trạng thái theo ma trận hợp lệ thay vì cho frontend tự quyết định.
- **Luồng thuê đồ được nâng lên thành module vận hành riêng** — `/owner/rentals` theo dõi hạn trả, quá hạn, thống kê, và xử lý nhận trả với đánh giá tình trạng đồ, khấu trừ cọc và reset trạng thái garment.
- **Profile khách hàng trở thành cổng tự phục vụ thống nhất** — `/profile` gom thông tin cá nhân, đổi mật khẩu, đơn hàng, số đo, lịch hẹn, thông báo và voucher trong cùng một shell điều hướng responsive.
- **Dữ liệu cá nhân và số đo được tách rõ quyền chỉnh sửa** — Khách có thể tự cập nhật hồ sơ cơ bản và đổi mật khẩu, nhưng số đo chỉ được xem theo lịch sử versioning vì đây là dữ liệu do thợ/tiệm chịu trách nhiệm.
- **Khách hàng theo dõi được cả đơn hàng lẫn lịch hẹn sau mua** — Epic 4 bổ sung lịch sử đơn, chi tiết đơn, hoá đơn in HTML, danh sách lịch hẹn sắp tới, countdown ngày hẹn và quyền hủy trước ngày hẹn theo rule hiện tại của implementation.
- **Retention layer được mở đường nhưng chưa đồng đều** — Kho voucher đã có hướng triển khai full-stack để gắn voucher theo user, còn trung tâm thông báo trong ứng dụng vẫn ở mức blueprint event-driven và chưa có dấu hiệu hoàn thiện tương đương các story còn lại.

## Evidence

- **Story 4.1** tạo migration `013_create_payment_transactions.sql`, service xử lý webhook, endpoint `/api/v1/payments/webhook/{provider}`, email xác nhận đơn, và sau vòng sửa review đạt 22 backend tests + 22 frontend tests cho các nhánh quan trọng.
- **Story 4.2** thêm order board cho owner với `GET /api/v1/orders`, `PATCH /api/v1/orders/{id}/status`, detail drawer, optimistic update và 15 backend tests + 16 frontend tests.
- **Story 4.3** mở rộng domain thuê đồ bằng migration `015_rental_management_tables.sql`, `rental_returns`, `rental_status`, thống kê và xử lý nhận trả; toàn bộ lỗi High/Medium từ review đã được sửa, còn 1 low issue về `next/image` được hoãn.
- **Story 4.4a-4.4b** dựng shell hồ sơ khách hàng và luồng self-service cho profile/password, gồm fallback OAuth không có mật khẩu, validation hai phía, rate limit đổi mật khẩu và nhiều vòng review đã đóng.
- **Story 4.4c-4.4e** triển khai ba lát cắt hậu mua cho khách: `4.4c` có lịch sử đơn với invoice HTML và log review-fix rõ ràng; `4.4d` bổ sung trang số đo read-only theo history; `4.4e` bổ sung danh sách lịch hẹn có hủy lịch. Cả ba đều có test riêng, nhưng hồ sơ follow-up review chỉ được ghi rõ ở `4.4c`, còn `4.4e` vẫn đang ở trạng thái review.
- **Story 4.4f-4.4g** cho thấy độ hoàn thiện không đồng đều: notifications vẫn còn toàn bộ checklist ở trạng thái chưa làm, trong khi voucher wallet đã đánh dấu xong task migration/API/UI nhưng thiếu completion notes để xác nhận mức hoàn tất thực tế.

## Concepts

- [[concepts/swe/payment-webhook-processing]]
- [[concepts/tailor/order-status-pipeline]]
- [[concepts/tailor/rental-return-processing]]
- [[concepts/tailor/customer-self-service-profile]]
- [[concepts/tailor/measurement-versioning]]
- [[concepts/tailor/booking-flow]]
- [[concepts/tailor/customer-voucher-wallet]]
- [[concepts/tailor/in-app-notification-center]]
- [[concepts/swe/optimistic-update]]
- [[concepts/tailor/design-system]]

## Related Sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## People

- [[people/co-lan-owner]]

## Open Questions

- Story 4.4f (Thông báo) hiện vẫn chỉ là thiết kế và checklist công việc. Khi nào module này mới được triển khai thật để nối với order status, lịch hẹn và nhắc trả đồ?
- Story 4.4g (Kho voucher) đã đánh dấu hoàn tất task nhưng phần completion notes trống. Cần xác nhận lại migration, endpoint, UI và test đã thực sự chạy qua end-to-end hay chưa.
- Story 4.2 vẫn ghi nhận một điểm bị hoãn: tìm kiếm theo `customer_email` chưa làm được vì schema đơn hàng chưa có field tương ứng.
- Story 4.3 còn một low issue được giữ lại: `RentalDetailDrawer` vẫn dùng thẻ ảnh thô thay vì `next/image` vì thiếu cấu hình remote patterns.
- Story 4.4c hiện trả hoá đơn dạng HTML có thể in thay vì PDF nhị phân để tránh thêm dependency. Đây là giải pháp tạm hay là quyết định lâu dài?
