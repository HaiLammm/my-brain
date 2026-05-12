---
type: concept
title: Kiểm soát Truy cập Dựa trên Vai trò (RBAC)
slug: rbac
date_added: 2026-05-12
confidence: medium
tags:
  - security
  - access-control
id: concepts/rbac
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/tailor-project-prd
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/unified-order-workflow
  - concepts/ssot
---

## Definition

Role-Based Access Control (RBAC — Kiểm soát Truy cập Dựa trên Vai trò) là mô hình phân quyền trong tailor_project với 3 vai trò chính: Customer (xem danh mục và đơn hàng), Owner/Cô Lan (quản lý sản phẩm, đơn hàng, CRM, tri thức di sản), Tailor/Minh (nhận nhiệm vụ, báo cáo thu nhập, thực thi rập AI). RBAC bảo vệ "Kho Tri Thức" (Smart Rules/Vault) khỏi truy cập trái phép.

## Variants

- **Knowledge Admin**: Vai trò Owner có quyền quản lý tri thức (Smart Rules).
- **Production Execution**: Vai trò Tailor chỉ thực thi sản xuất.
- **View-only**: Vai trò Customer chỉ xem danh mục và đơn hàng.

## Key sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/unified-order-workflow]]
- [[concepts/ssot]]

## Notes