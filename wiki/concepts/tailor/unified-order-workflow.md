---
type: concept
title: Quy trình Đặt hàng Thống nhất (Unified Order Workflow)
slug: unified-order-workflow
date_added: 2026-05-12
confidence: medium
tags:
  - e-commerce
  - order-management
id: concepts/tailor/unified-order-workflow
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/tailor-project-prd
  - sources/epic-breakdown-tailor-project
related_concepts:
  - concepts/swe/audit-trail
  - concepts/tailor/ao-dai-bespoke
  - concepts/swe/rbac
  - concepts/tailor/order-status-pipeline
  - concepts/swe/transition-as-video
---

## Definition

Unified Order Workflow (Quy trình Đặt hàng Thống nhất) là luồng công việc đơn hàng duy nhất cho cả 3 loại dịch vụ: Mua, Thuê, và May đo (Bespoke). Quy trình phân nhánh tại cổng thanh toán theo loại dịch vụ, với các bước chuẩn bị khác nhau (Rent: Vệ sinh → Chỉnh sửa → Sẵn sàng; Buy: QC → Đóng gói; Bespoke: Cắt → May → Vừa → Hoàn thiện). Mọi chuyển trạng thái được ghi lại trong audit trail bất biến.

## Variants

- **Bespoke Measurement Gate**: Kiểm tra hồ sơ số đo trước khi đặt may đo.
- **Owner Order Approval**: Chủ tiệm phê duyệt đơn hàng trước khi sản xuất.
- **Service-Type Preparation Steps**: Bước chuẩn bị theo loại dịch vụ.

## Key sources

- [[sources/tailor-project-prd]]
- [[sources/epic-breakdown-tailor-project]]

## Related concepts

- [[concepts/swe/audit-trail]]
- [[concepts/tailor/ao-dai-bespoke]]
- [[concepts/swe/rbac]]
- [[concepts/tailor/order-status-pipeline]]
- [[concepts/swe/transition-as-video]]

## Notes