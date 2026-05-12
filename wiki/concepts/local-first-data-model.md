---
type: concept
title: Local-first Data Model
slug: local-first-data-model
date_added: 2026-05-12
confidence: medium
tags:
  - data-model
  - local-first
  - sync
  - offline
id: TODO
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/epic-1-implementation-artifacts-tailor-project
related_concepts:
  - concepts/soft-delete
  - concepts/multi-tenant-rls
---

## Definition

Local-first Data Model là cách thiết kế schema database bao gồm các trường hỗ trợ đồng bộ hóa ngoại tuyến: `version` (integer tăng dần cho mỗi lần cập nhật), `is_deleted` (boolean cho soft delete), và `updated_at` (timestamp tự cập nhật). Client có thể hoạt động ngoại tuyến và đồng bộ lại khi có mạng, sử dụng `version` để phát hiện xung đột và `is_deleted` để nhận biết bản ghi đã xóa.

## Variants

- **CRDT-based** — Dùng Conflict-free Replicated Data Types; tự hợp nhất xung đột nhưng phức tạp.
- **Version vector** — Vector phiên bản thay vì integer đơn; phát hiện xung đột chính xác hơn.
- **Last-write-wins** — Đơn giản nhất; ghi sau cùng thắng, có thể mất dữ liệu.

## Key sources

- [[sources/epic-1-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/soft-delete]]
- [[concepts/multi-tenant-rls]]

## Notes

Trong tailor_project, các trường `version` (integer, default 1) và `is_deleted` (boolean, default FALSE) được thêm vào `customer_profiles` và `measurements` trong migration 006 để "local-first ready". Logic đồng bộ hóa thực tế chưa triển khai — chỉ chuẩn bị schema. `updated_at` dùng PostgreSQL trigger tự cập nhật.
