---
type: concept
title: Dấu vết Kiểm toán (Audit Trail)
confidence: medium
tags:
  - traceability
  - order-management
id: audit-trail
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/tailor-project-prd
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/tailor/unified-order-workflow
---

## Definition

Audit Trail (Dấu vết Kiểm toán) là nguyên tắc thiết kế "Video, Not Snapshot" — mọi chuyển trạng thái của các thực thể có trạng thái (đơn hàng, thanh toán, nhiệm vụ thợ may, trang phục, lịch hẹn, lead CRM) được ghi lại thành sự kiện bất biến với from_status, to_status, changed_by, changed_at và context. Trạng thái hiện tại luôn được suy ra từ sự kiện gần nhất.

## Variants

- **FR100 (Order Transition Log)**: Ghi mọi thay đổi trạng thái đơn hàng.
- **FR101 (Payment Transition Log)**: Ghi mọi trạng thái thanh toán.
- **FR102 (Task Transition Log)**: Ghi chuyển trạng thái nhiệm vụ thợ may.
- **FR103 (Garment Lifecycle Log)**: Ghi vòng đời trang phục thuê.
- **FR104 (Appointment Transition Log)**: Ghi trạng thái lịch hẹn.
- **FR105 (Lead Journey Log)**: Ghi hành trình lead CRM.
- **FR106 (Cross-Entity Analytics)**: Truy vấn lịch sử chuyển trạng thái liên thực thể.

## Key sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/tailor/unified-order-workflow]]
- [[concepts/swe/transition-as-video]]

## Notes