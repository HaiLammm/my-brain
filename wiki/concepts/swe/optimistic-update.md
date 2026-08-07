---
type: concept
title: Optimistic Update
slug: optimistic-update
date_added: 2026-05-14
confidence: high
tags:
  - tailor-project
  - ux-pattern
  - state-management
id: TODO
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
related_concepts:
  - concepts/tailor/order-status-pipeline
  - concepts/swe/tanstack-query
---

## Definition

Optimistic Update là UX pattern cập nhật giao diện ngay lập tức trước khi server xác nhận, tạo cảm giác phản hồi tức thì. Khi server trả lỗi, giao diện tự rollback về trạng thái trước. Trong tailor_project, pattern này được dùng cho cập nhật trạng thái kho (2-touch status update) và xóa sản phẩm.

## Variants

- **2-Touch Status Update** (Story 2.5b) — Tap 1 chọn sản phẩm, tap 2 chọn trạng thái mới; optimistic update hiển thị trạng thái mới ngay, rollback khi API lỗi.
- **Delete with Count Update** (Story 2.4) — Tổng sản phẩm giảm ngay trong UI, rollback nếu delete thất bại.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/tailor/order-status-pipeline]]
- [[concepts/swe/tanstack-query]]

## Notes