---
type: concept
title: Zustand Cart Store
slug: zustand-cart-store
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - state-management
  - react
  - e-commerce
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources: []
related_concepts: []
---

## Definition

Zustand Cart Store là pattern quản lý giỏ hàng client-side dùng Zustand v5 + persist middleware + devtools. Cart state được lưu hoàn toàn ở client (localStorage key `tailor-cart`), cho phép Optimistic UI — thêm/xóa/sửa item ngay lập tức không chờ server. Backend chỉ được gọi khi checkout để verify giá và availability theo Authoritative Server Pattern.

## Variants

- **CartItem type**: `{ id, garment_id, garment_name, image_url, transaction_type: 'buy'|'rent', size?, start_date?, end_date?, rental_days?, unit_price, total_price }`
- **Duplicate prevention**: Không cho thêm cùng garment_id + loại + size/dates hai lần.
- **Persist**: `createJSONStorage(() => localStorage)` với key `tailor-cart`.
- **Computed values**: `cartCount()` và `cartTotal()` derived từ items array.

## Key sources

- [[sources/epic-3-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/optimistic-update]]
- [[concepts/authoritative-server-pattern]]
- [[concepts/tanstack-query]]
- [[concepts/ssot]]

## Notes

Pattern được triển khai trong Story 3.1. Code review fixes: parseFloat NaN guard (shared `parsePrice()`), CSS block/flex conflict, DRY `formatPrice()` utility, Escape key handling, focus trap hook. Store pattern theo `designStore.ts` đã có trong project.