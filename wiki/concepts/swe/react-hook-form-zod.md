---
type: concept
title: React Hook Form + Zod
confidence: high
tags:
  - tailor-project
  - form-validation
  - react
id: react-hook-form-zod
created: 2026-05-14
updated: 2026-05-14
key_sources:
  - sources/epic-2-implementation-artifacts-tailor-project
related_concepts:
  - concepts/swe/ssot
---

## Definition

React Hook Form + Zod là_pattern kết hợp thư viện React Hook Form (quản lý form state và performance) với Zod (schema validation TypeScript-first) dùng trong tailor_project cho form tạo/sửa sản phẩm (ProductForm). Zod schema định nghĩa validation rules (tên tối thiểu 2 ký tự, giá thuê > 0, URL phải là http/https, size_options ít nhất 1) và thông báo lỗi bằng tiếng Việt.

## Variants

- **ProductForm Create/Edit** (Story 2.4) — Re-use cùng một component cho cả tạo mới và chỉnh sửa sản phẩm; Zod validate từng trường, hiển thị lỗi inline.
- **DeleteConfirmDialog** — React Hook Form không dùng (không có form fields), chỉ server action call với toast confirmation.

## Key sources

- [[sources/epic-2-implementation-artifacts-tailor-project]]

## Related concepts

- [[concepts/swe/ssot]]

## Notes