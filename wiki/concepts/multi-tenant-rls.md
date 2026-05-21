---
type: concept
title: Multi-tenant RLS
slug: multi-tenant-rls
date_added: 2026-05-12
confidence: high
tags:
  - database
  - postgresql
  - multi-tenant
  - security
id: TODO
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/epic-1-implementation-artifacts-tailor-project
  - sources/luong-hai-lam-4
related_concepts:
  - concepts/rbac
  - concepts/ssot
---

## Definition

Multi-tenant RLS (Row-Level Security) là phương pháp cô lập dữ liệu giữa các tenant (tiệm may) trong cùng một cơ sở dữ liệu PostgreSQL bằng cách bật RLS và tạo policy lọc theo `tenant_id`. Mỗi truy vấn chỉ trả về dòng thuộc tenant của người dùng đang xác thực, đảm bảo thợ tiệm A không thể xem hay sửa dữ liệu của tiệm B.

## Variants

- **Schema-per-tenant** — Mỗi tenant có schema riêng; cách ly tuyệt đối nhưng phức tạp quản lý migration.
- **Database-per-tenant** — Mỗi tenant có database riêng; cách ly tốt nhất nhưng chi phí cao.
- **Row-Level (shared schema)** — Tất cả tenant dùng chung bảng, phân biệt bằng `tenant_id` + RLS; tiết kiệm tài nguyên, phù hợp MVP.

## Key sources

- [[sources/epic-1-implementation-artifacts-tailor-project]]
- [[sources/luong-hai-lam-4]]

## Related concepts

- [[concepts/rbac]]
- [[concepts/ssot]]

## Notes

Trong tailor_project, phương pháp Row-Level được chọn: thêm `tenant_id` (UUID) vào mọi bảng nghiệp vụ, bật RLS trên `customer_profiles` và `measurements`, tạo 4 policy (SELECT/INSERT/UPDATE/DELETE). Middleware FastAPI tự trích xuất `tenant_id` từ JWT và áp dụng vào truy vấn. Cần đánh index `tenant_id` trên tất cả bảng để tối ưu RLS.
