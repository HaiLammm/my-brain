---
type: concept
title: Giao diện Hai Chế độ
slug: dual-mode-ui
date_added: 2026-05-12
confidence: high
tags:
  - ux-architecture
  - sao-dang
  - responsive-design
id: concepts/dual-mode-ui
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/rbac
  - concepts/ao-dai-bespoke
---

## Definition

Giao diện Hai Chế độ (Dual-Mode UI) là nguyên tắc kiến trúc UX chia ứng dụng thành hai chế độ hiển thị tuỳ theo vai trò: **Boutique Mode** dành cho khách hàng (nền ngà Ivory, khoảng cách rộng 16–24px, serif heading — Cormorant Garamond) và **Command Mode** dành cho chủ tiệm/thợ may (nền trắng, khoảng cách dày đặc 8–12px, sans-serif — Inter). Chế độ được xác định tự động dựa trên route group: `(customer)` cho Boutique, `(workplace)` cho Command.

## Variants

- **Boutique Mode**: Trải nghiệm mua sắm sang trọng, chỗ rộng, serif heading, bảng màu ấm.
- **Command Mode**: Dashboard vận hành dày đặc thông tin, sans-serif, tối ưu cho tác vụ nhanh.

## Key sources

- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/rbac]]
- [[concepts/ao-dai-bespoke]]

## Mentioned in

## Notes