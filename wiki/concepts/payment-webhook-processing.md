---
type: concept
title: Xử lý Webhook Thanh toán (Payment Webhook Processing)
slug: payment-webhook-processing
date_added: 2026-05-15
confidence: unverified
tags:
  - tailor-project
  - payment
  - webhook
  - backend
id: concepts/payment-webhook-processing
created: 2026-05-15
updated: 2026-05-15
key_sources:
  - sources/epic-4-implementation-artifacts-tailor-project
related_concepts:
  - concepts/payment-gateway-mvp
  - concepts/authoritative-server-pattern
  - concepts/race-condition-prevention
  - concepts/audit-trail
  - concepts/event-driven-internal-communication
---

## Definition

Xử lý Webhook Thanh toán là pattern backend nhận callback từ cổng thanh toán, xác thực chữ ký, chuẩn hoá payload, kiểm tra idempotency, ghi transaction và chỉ khi đó mới cập nhật trạng thái thanh toán hoặc trạng thái đơn hàng. Pattern này giúp frontend không phải tin vào query param hoặc redirect URL do bên thứ ba trả về.

## Variants

- **Signature verification** — Xác thực callback bằng HMAC/SHA trước khi xử lý.
- **Idempotent replay** — Callback gọi lặp lại không tạo hiệu ứng phụ lần hai.
- **Transaction audit log** — Lưu toàn bộ giao dịch vào bảng riêng để tra soát.

## Key sources

- [[sources/epic-4-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/payment-gateway-mvp]]
- [[concepts/authoritative-server-pattern]]
- [[concepts/race-condition-prevention]]
- [[concepts/audit-trail]]
- [[concepts/event-driven-internal-communication]]

## Mentioned in

## Notes

Trong Epic 4 của tailor_project, pattern này còn kéo theo xác nhận đơn qua email và polling nhẹ ở trang confirmation để chờ backend nhận callback thật.
