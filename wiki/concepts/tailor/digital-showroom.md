---
type: concept
title: Digital Showroom
slug: digital-showroom
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - ecommerce
  - product-catalog
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
related_concepts:
  - concepts/swe/tanstack-query
  - concepts/tailor/filter-chips
  - concepts/tailor/heritage-palette
  - concepts/swe/multi-tenant-rls
---

## Definition

Digital Showroom (Showroom Ảo) là giao diện hiển thị catalog sản phẩm áo dài cho khách hàng, kết hợp Server-Side Rendering (SSG/ISR) cho lần tải đầu và TanStack Query cho cập nhật phía client khi thay bộ lọc. Đảm bảo SEO-friendly, performance < 500ms cho filter updates, và responsive mobile-first với touch targets tối thiểu 44x44px.

## Variants

- **Listing Grid** (Story 2.1) — Hiển thị sản phẩm dạng thẻ (card) với ảnh, tên, mô tả, kích cỡ, giá thuê, trạng thái real-time.
- **Product Detail** (Story 2.2) — Trang chi tiết với gallery ảnh HD, zoom hover/pinch, size chart accordion, Buy/Rent toggle.
- **Multi-Filter** (Story 2.3) — Lọc 5 chiều (Dịp, Chất liệu, Màu sắc, Kích cỡ, Loại) với tag-based chips.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/swe/tanstack-query]]
- [[concepts/tailor/filter-chips]]
- [[concepts/tailor/heritage-palette]]
- [[concepts/swe/multi-tenant-rls]]

## Notes