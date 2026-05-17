---
type: concept
title: KPI Dashboard
slug: kpi-dashboard
date_added: 2026-05-16
confidence: medium
tags:
  - tailor-project
  - dashboard
  - kpi
  - owner
id: TODO
created: 2026-05-16
updated: 2026-05-16
key_sources: []
related_concepts: []
---

## Definition

Bảng điều khiển chỉ số hiệu suất chính (KPI Dashboard) dành cho chủ tiệm (Owner) trong tailor_project. Dashboard hiển thị doanh thu theo ngày/tuần/tháng kèm trend arrows, biểu đồ cột so sánh, thống kê đơn hàng theo trạng thái, cảnh báo sản xuất cho đơn sắp quá hạn, và danh sách lịch hẹn hôm nay. Dữ liệu được backend aggregation qua `/api/v1/kpi/quick-glance` và frontend render với TanStack Query polling 60s.

## Key Sources

- [[sources/epic-5-implementation-artifacts-tailor-project]]
