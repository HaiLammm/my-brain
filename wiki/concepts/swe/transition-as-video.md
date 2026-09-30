---
type: concept
title: Nguyên tắc Video, Không Must-see
confidence: high
tags:
  - event-sourcing
  - sao-dang
  - audit
  - state-machine
id: transition-as-video
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/swe/audit-trail
  - concepts/swe/ssot
  - concepts/tailor/order-status-pipeline
---

## Definition

Nguyên tắc "Video, Not Snapshot" (Ghi lại Toàn bộ Chuyển đổi, Không chỉ Trạng thái Hiện tại) khẳng định rằng mọi thay đổi trạng thái trên mọi thực thể (đơn hàng, thanh toán, nhiệm vụ thợ may, trang phục, lịch hẹn, lead CRM) phải được ghi lại dưới dạng sự kiện bất biến chứa actor, timestamp và context. Trạng thái hiện tại chỉ là giá trị dẫn xuất hoặc cache từ chuỗi sự kiện; lịch sử chuyển đổi mới là nguồn chân lý (source of truth). Điều này cho phép phân tích phễu chuyển đổi (Marketing), đối chiếu dòng tiền (Accounting), phân tích giai đoạn huỷ (Management), và theo dõi SLA/nút thắt cổ chai (Operations).

## Variants

- **Tier 1 (Bắt buộc)**: Đơn hàng (order_status_transitions, order_payment_transitions), Nhiệm vụ thợ may (tailor_task_transitions).
- **Tier 2 (Quan trọng)**: Trang phục (garment_status_transitions), Lịch hẹn (appointment_status_transitions), Lead CRM (lead_status_transitions).
- **Tier 3 (Bổ sung)**: Pattern session, Campaign, Voucher, Notification, Order item rental.

## Key sources

- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/swe/audit-trail]]
- [[concepts/swe/ssot]]
- [[concepts/tailor/order-status-pipeline]]

## Mentioned in

## Notes