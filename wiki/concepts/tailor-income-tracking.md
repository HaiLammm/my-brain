---
type: concept
title: Tailor Income Tracking
slug: tailor-income-tracking
date_added: 2026-05-16
confidence: medium
tags:
  - tailor-project
  - income
  - tailor
  - reporting
id: TODO
created: 2026-05-16
updated: 2026-05-16
key_sources: []
related_concepts: []
---

## Definition

Tính năng theo dõi thu nhập cho thợ may (Tailor) trong tailor_project. Income Widget hiển thị dưới task list trên Tailor Dashboard, gồm 3 thẻ: Thu nhập tháng này (Heritage Gold), tháng trước (muted), và tỷ lệ tăng trưởng % (Jade Green lên / Red xuống). Biểu đồ cột Recharts so sánh hai tháng. Dữ liệu lấy từ API `GET /api/v1/tailor-tasks/my-income`, backend aggregation GROUP BY month trên completed tasks.

## Key Sources

- [[sources/epic-5-implementation-artifacts-tailor-project]]
