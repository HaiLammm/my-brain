---
type: concept
title: Xử lý Trả đồ Thuê (Rental Return Processing)
slug: rental-return-processing
date_added: 2026-05-15
confidence: unverified
tags:
  - tailor-project
  - rental
  - returns
  - operations
id: concepts/tailor/rental-return-processing
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/epic-4-implementation-artifacts-tailor-project
related_concepts:
  - concepts/tailor/unified-order-workflow
  - concepts/tailor/order-status-pipeline
  - concepts/swe/optimistic-update
  - concepts/swe/audit-trail
---

## Definition

Xử lý Trả đồ Thuê là quy trình vận hành ghi nhận việc khách trả trang phục thuê, đánh giá tình trạng món đồ, tính khấu trừ cọc và cập nhật lại trạng thái garment trong kho. Nó nối liền dữ liệu đơn hàng, lịch hạn trả và hậu kiểm chất lượng thay vì coi việc trả đồ là thao tác ngoài hệ thống.

## Variants

- **Overdue monitoring** — Theo dõi đồ đang thuê, sắp đến hạn và quá hạn ngay trên board.
- **Condition-based deduction** — Tốt, hư hỏng, mất đồ tương ứng mức hoàn/trừ cọc khác nhau.
- **Return history** — Mỗi lần nhận trả tạo bản ghi riêng để truy hồi sau này.

## Key sources

- [[sources/epic-4-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/tailor/unified-order-workflow]]
- [[concepts/tailor/order-status-pipeline]]
- [[concepts/swe/optimistic-update]]
- [[concepts/swe/audit-trail]]

## Mentioned in

## Notes

Epic 4 triển khai concept này bằng board riêng cho owner, summary cards, xử lý nhận trả có khóa hàng và các badge countdown theo hạn trả.
