---
type: concept
title: Đường ống Trạng thái Đơn hàng
slug: order-status-pipeline
date_added: 2026-05-12
confidence: high
tags:
  - state-machine
  - sao-dang
  - order-management
id: concepts/order-status-pipeline
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/unified-order-workflow
  - concepts/transition-as-video
  - concepts/audit-trail
---

## Definition

Đường ống Trạng thái Đơn hàng (Order Status Pipeline) là mô hình máy trạng thái phân nhánh theo loại dịch vụ với 3 luồng trạng thái riêng biệt: **Mua** (Pending → Confirmed → In Production → Shipped → Delivered), **Thuê** (thêm trạng thái Rented/Maintenance + quy trình đặt cọc + CCCD/bảo hiểm), và **Bespoke** (thêm bước Fitting + đặt cọc trước → trả phần còn lại khi nhận). Mỗi nhánh có các bước chuẩn bị (preparation sub-steps) khác nhau: Rent (Cleaning > Altering > Ready), Buy (QC > Packaging), Bespoke (Cutting > Sewing > Fitting > Finishing).

## Variants

- **Buy pipeline**: Thanh toán 100% trước, luồng chuẩn bị ngắn (QC > Packaging).
- **Rent pipeline**: Đặt cọc + CCCD hoặc bảo hiểm, có quy trình trả đồ và hoàn cọc/bảo hiểm.
- **Bespoke pipeline**: Đặt cọc trước, quy trình sản xuất dài (Cắt > May > V thử > Hoàn thiện), trả phần còn lại khi nhận.

## Key sources

- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/unified-order-workflow]]
- [[concepts/transition-as-video]]
- [[concepts/audit-trail]]

## Mentioned in

## Notes