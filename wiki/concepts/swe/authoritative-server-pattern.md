---
type: concept
title: Authoritative Server Pattern
confidence: high
tags:
  - tailor-project
  - architecture
  - security
  - e-commerce
id: authoritative-server-pattern
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/luong-hai-lam-4
related_concepts: []
---

## Definition

Authoritative Server Pattern là chiến lược thiết kế mà trong đó backend đóng vai trò Nguồn Sự thật Duy nhất (SSOT) cho dữ liệu quan trọng như giá, tình trạng kho, và tính hợp lệ của đơn hàng. Frontend (Zustand store) chỉ dùng cho Optimistic UI — hiển thị ngay lập tức để tăng trải nghiệm người dùng — nhưng tất cả dữ liệu PHẢI được backend xác thực lại trước khi cho phép thao tác quản trọng (thanh toán, tạo đơn).

## Variants

- **Price verification**: Backend query GarmentDB để xác thực giá thực tế, không tin giá từ client.
- **Availability check**: Backend verify `status === 'available'` trước khi cho phép checkout.
- **Race condition guard**: Dùng `SELECT ... FOR UPDATE` để lock row khi kiểm tra capacity (slot appointment, inventory).

## Key sources

- [[sources/epic-3-implementation-artifacts-tailor-project]]
- [[sources/luong-hai-lam-4]]

## Related concepts

- [[concepts/swe/ssot]]
- [[concepts/swe/optimistic-update]]
- [[concepts/swe/zustand-cart-store]]
- [[concepts/swe/race-condition-prevention]]

## Notes

Pattern này được áp dụng nhất quán qua Story 3.2 (verifyCartItems), Story 3.3 (create_order verify giá lại), và Story 3.4b (appointment slot availability check). Nguyen tắc cốt lõi: "Never trust client-side data at checkout."