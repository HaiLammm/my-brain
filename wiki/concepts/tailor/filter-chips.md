---
type: concept
title: Filter Chips
slug: filter-chips
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - ui-pattern
  - product-filter
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
related_concepts:
  - concepts/tailor/digital-showroom
  - concepts/swe/tanstack-query
---

## Definition

Filter Chips là UI pattern thay thế dropdown cho bộ lọc sản phẩm, sử dụng tag-based chips cho phép chọn/bỏ nhanh các tiêu chí lọc. Mỗi chip là một nút toggle với Heritage Gold accent khi active. Hỗ trợ multi-select với AND logic, debounce 300ms, và URL state persistence cho bookmarkability.

## Variants

- **5 chiều lọc** (Story 2.3) — Dịp/Season, Chất liệu (Material enum: Lụa, Gấm, Nhung, Voan, Satin, Cotton, Pha), Màu sắc (dynamic fetch từ backend), Kích cỡ (S/M/L/XL/XXL), Loại áo dài (Category enum).
- **Dynamic Color Fetching** — Endpoint `GET /api/v1/garments/colors` trả về danh sách màu hiện có trong database, thay vì hardcode constants.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/tailor/digital-showroom]]
- [[concepts/swe/tanstack-query]]

## Notes