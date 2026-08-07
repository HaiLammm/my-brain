---
type: concept
title: Server Action Pattern (Next.js)
slug: server-action-pattern
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - nextjs
  - architecture
  - api
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources: []
related_concepts: []
---

## Definition

Server Action Pattern là pattern giao tiếp frontend-backend được dùng nhất quán trong tailor_project, sử dụng Next.js Server Actions (`"use server"`) với AbortController timeout 10s, chuẩn hóa error handling, và hỗ trợ cả authenticated lẫn guest checkout. Mỗi Server Action định nghĩa `BACKEND_URL`, `FETCH_TIMEOUT`, và trả về kiểu `{ success, data?, error? }`.

## Variants

- **verifyCartItems**: Public action, không cần auth; gọi `fetchGarmentDetail()` cho từng item.
- **createOrder**: Guest hoặc authenticated; gửi cart items + shipping + payment method.
- **createAppointment**: Public booking; xử lý 409 Conflict (slot đã đầy).
- **getMonthAvailability**: Public; fetch calendar slot data.

## Key sources

- [[sources/epic-3-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/swe/authoritative-server-pattern]]
- [[concepts/tailor/checkout-and-payment]]
- [[concepts/tailor/booking-flow]]
- [[concepts/swe/tanstack-query]]

## Notes

Pattern khởi tạo trong Story 3.2 (cart-actions.ts), mở rộng ở Story 3.3 (order-actions.ts) và 3.4b (booking-actions.ts). Tất cả follow cùng cấu trúc: AbortController timeout, try/catch/finally, standardized return type. Error messages bằng tiếng Việt cho user-facing errors.