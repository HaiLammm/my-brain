---
type: concept
title: Soft Delete
slug: soft-delete
date_added: 2026-05-12
confidence: high
tags:
  - data-model
  - database
  - soft-delete
  - local-first
id: TODO
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/epic-1-implementation-artifacts-tailor-project
related_concepts:
  - concepts/local-first-data-model
  - concepts/measurement-versioning
---

## Definition

Soft Delete là phương pháp đánh dấu bản ghi đã xóa bằng cờ `is_deleted=True` thay vì xóa hẳn khỏi database, bảo toàn dữ liệu lịch sử và cho phép khôi phục. Kết hợp với các trường `version` (integer) và `updated_at` (timestamp), pattern này hỗ trợ đồng bộ hóa local-first — client ngoại tuyến có thể phát hiện bản ghi đã xóa và cập nhật trạng thái khi đồng bộ lại.

## Variants

- **Boolean flag** — `is_deleted=True/False`; đơn giản, dễ truy vấn.
- **Timestamp delete** — `deleted_at` thay vì boolean; lưu thời điểm xóa chính xác.
- **Tombstone** — Bản ghi đánh dấu xóa riêng; dùng trong event sourcing.

## Key sources

- [[sources/epic-1-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/local-first-data-model]]
- [[concepts/measurement-versioning]]

## Notes

Trong tailor_project, `is_deleted` (BOOLEAN) được thêm vào `customer_profiles` và các bảng nghiệp vụ. Xóa khách hàng = `soft_delete_customer()` set `is_deleted=True`. Các truy vấn service luôn lọc `is_deleted=False` mặc định. Trường `version` (integer, default 1) và `updated_at` (auto-trigger) phục vụ đồng bộ hóa local-first sau này.
