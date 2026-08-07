---
type: concept
title: Race Condition Prevention
slug: race-condition-prevention
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - backend
  - database
  - concurrency
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/luong-hai-lam-4
related_concepts: []
---

## Definition

Race Condition Prevention là tập hợp các chiến lược chống race condition trong tailor_project, bao gồm: `SELECT ... FOR UPDATE` (PostgreSQL row-level lock) khi kiểm tra slot capacity và order inventory; batch fetch thay vì N+1 queries; và double-submit guard ở frontend (useRef flag). Đảm bảo tính nhất quán dữ liệu khi nhiều user thao tác đồng thời (NFR10 — ACID compliance).

## Variants

- **Appointment slot**: `SELECT ... FOR UPDATE` lock row, count existing bookings, nếu < MAX_SLOTS_PER_SESSION (3) thì cho phép tạo, ngược lại raise 409 Conflict.
- **Order creation**: `SELECT ... FOR UPDATE` khi verify garment availability và tính giá; batch fetch garments thay vì query từng cái (eliminates N+1).
- **Double-submit guard**: Frontend useRef flag ngăn user submit form nhiều lần; chỉ clear sau khi nhận response.
- **Cart timing**: Zustand store chỉ clear sau khi order thành công (COD → direct, VNPay/Momo → after confirmation page success).

## Key sources

- [[sources/epic-3-implementation-artifacts-tailor-project]]
- [[sources/luong-hai-lam-4]]

## Related concepts

- [[concepts/swe/authoritative-server-pattern]]
- [[concepts/tailor/payment-gateway-mvp]]
- [[concepts/swe/ssot]]

## Notes

Senior Dev Review (Story 3.3) phát hiện 3 CRITICAL issues: race condition on inventory (fixed với FOR UPDATE + batch fetch), open redirect via payment_url (fixed với allowlist validation), và unauthenticated PII on GET order (flagged cho architecture debt).