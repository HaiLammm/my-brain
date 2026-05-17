---
id: sources/epic-5-implementation-artifacts-tailor-project
title: Epic 5 — Implementation Artifacts (tailor_project)
type: source
created: 2026-05-16
updated: 2026-05-16
authors:
  - tailor_project team
year: 2026
importance: 3
provenance: replayable
confidence: unverified
source_type: note
tags:
  - tailor-project
  - implementation
  - epic-5
  - dashboards
  - kpi
  - production-board
  - tailor-workstation
  - income-tracking
raw_paths:
  - raw/sources/projects/tailor-project/implementation-artifacts/5-1-kpi-morning-command-center-dash.md
  - raw/sources/projects/tailor-project/implementation-artifacts/5-2-bang-dieu-phoi-khoi-san-xuat-gap-viec.md
  - raw/sources/projects/tailor-project/implementation-artifacts/5-3-workstation-production-flow-dash-cho-tho-tiem.md
  - raw/sources/projects/tailor-project/implementation-artifacts/5-4-tinh-luongthu-nhap-tho.md
ingest_status: finalized
verify_status: passed
findings:
  - {id: 1, reviewer: external, class: dismiss, claim: "Tailor project Epic 5 implements standard dashboards features (KPI, production board, workstation, income)", evidence: "Confirmatory web search found 6+ real-world tailoring management systems (Tailor Trak, Tailara, DD Tailors, AiPSoft, TailorsCRM, Softhealer) with identical feature sets. No contradictions.", action: No action needed — features match industry standards.}
  - {id: 2, reviewer: external, class: dismiss, claim: All implementation claims in Epic 5 are accurate, evidence: "Adversarial web search found no contradictory evidence. Results confirm production board, tailor task assignment, and income tracking are standard industry requirements for tailoring management software.", action: No action needed — all claims hold against external check.}
---

## Summary

Bộ 4 artifact triển khai cho **Epic 5 — Dashboards** của tailor_project. Epic này gồm: KPI Dashboard cho chủ tiệm với doanh thu, đơn hàng, sản xuất và lịch hẹn (5.1); Bảng Điều Phối Sản Xuất cho chủ tiệm phân việc và theo dõi thợ (5.2); Workstation Dashboard cho thợ may nhận việc và cập nhật trạng thái 1-chạm (5.3); và Income Tracking cho thợ theo dõi thu nhập theo tháng (5.4). Cả 4 story đều triển khai Command Mode layout với Workplace Sidebar dùng chung, sử dụng TanStack Query cho data fetching và Recharts cho biểu đồ. 2/4 story đã done, 2/4 đang ở trạng thái review.

## Key Claims

- **Owner KPI Dashboard cung cấp cái nhìn tổng quan vận hành trong 5 giây** — Story 5.1 thêm `/owner` với 3 thẻ doanh thu (Ngày/Tuần/Tháng) kèm trend arrows, biểu đồ cột Recharts so sánh theo tuần/tháng, thống kê đơn hàng theo trạng thái và loại (mua/thuê), cảnh báo sản xuất cho đơn sắp quá hạn, và danh sách lịch hẹn hôm nay.
- **Workplace Sidebar dùng chung giữa Owner và Tailor** — Sidebar collapsible với Command Mode styling, phân quyền menu: Owner có 8 mục (Dashboard, Sản phẩm, Kho hàng, Đơn hàng, Lịch hẹn, Khách hàng, Nhân viên, Quy tắc), Tailor có 3 mục (Dashboard, Công việc, Lịch hẹn).
- **Production Board cho phép Owner giao việc và theo dõi toàn bộ thợ** — Story 5.2 thêm `/owner/production` với form giao việc (chọn đơn in_production, chọn thợ, deadline, tiền công), bảng danh sách task có sort/filter, countdown deadline, detail drawer, và in-app notification khi giao việc.
- **Tailor Workstation Dashboard cho thợ cập nhật trạng thái 1-chạm** — Story 5.3 thêm `/tailor` với danh sách task cá nhân, 4 thẻ tóm tắt (All/Assigned/In Progress/Completed), status toggle 1-chạm theo luồng Assigned → In Progress → Completed, deadline indicator (xanh/vàng/đỏ), và task detail modal có link Blueprint.
- **Income Tracking cho thợ thấy thu nhập và tăng trưởng theo tháng** — Story 5.4 thêm Income Widget dưới task list với 3 thẻ (Thu nhập tháng này/tháng trước/tăng trưởng), biểu đồ cột so sánh bằng Recharts, tự động refresh khi task hoàn thành.
- **Toàn bộ Epic dùng Authoritative Server Pattern** — Backend là SSOT cho mọi tính toán (KPI, income, task status); frontend chỉ render dữ liệu đã tính sẵn và dùng optimistic updates cho UX mượt.
- **TanStack Query là xương sống data fetching** — Tất cả API calls dùng `useQuery` với `staleTime: 60_000` + `refetchInterval: 60_000`; mutation dùng `useMutation` với optimistic updates và `onSettled` invalidation.

## Evidence

- **Story 5.1** (KPI Morning Command Center Dash, done): 5 tasks (21 subtasks) — Backend tạo `/api/v1/kpi/quick-glance` với aggregation queries cho revenue daily/weekly/monthly, order stats, production alerts, appointments; Frontend tạo Workplace Sidebar + 5 dashboard components (KPICard, RevenueChart, OrderStatsCard, ProductionAlerts, AppointmentsTodayCard) + TanStack Query client với 60s auto-refresh; Code review sửa 8 issues (3 HIGH: date range selector, error state throw, role-aware sidebar; 4 MEDIUM; 1 LOW). Load time < 2s, API response < 300ms.
- **Story 5.2** (Production Board, review): 7 tasks — Backend thêm 4 Owner-only endpoints vào existing `tailor_tasks.py` router (POST, GET, PATCH, DELETE) với notification_creator cho task assignment; Frontend tạo Production Board page với 8 components (ProductionBoardClient, SummaryCards, TaskTable, Filters, DeadlineCountdown, CreateDialog, DetailDrawer, EditDialog). AI Review phát hiện 15 issues: 5 High (transaction split, return type annotation, null vs not-provided, missing optimistic update), 8 Medium, 2 Low. Đang chờ review follow-ups.
- **Story 5.3** (Tailor Workstation, review): 8 tasks — Tạo `TailorTaskDB` model + migration 014, `tailor_task_service.py` (get_my_tasks, get_task_summary, update_task_status, get_task_detail), 5 Tailor components (TaskSummaryCards, TaskRow, TaskList, TaskDetailModal, TailorDashboardClient). Code review sửa 10 issues: 3 HIGH (inconsistent overdue logic, missing order info in task detail, multi-tenant isolation gap), 4 MEDIUM, 3 LOW. 20 tests (14 unit + 6 API).
- **Story 5.4** (Income Tracking, done): 7 tasks — Backend thêm `get_tailor_monthly_income()` service method + `GET /api/v1/tailor-tasks/my-income` endpoint; Frontend tạo 3 components (IncomeWidget, IncomeSummaryCards, IncomeChart) với Recharts BarChart, tích hợp vào TailorDashboardClient với `["tailor-income"]` invalidation. 7 income unit tests added. 0 TypeScript errors.

## Concepts

- [[concepts/authoritative-server-pattern]]
- [[concepts/tanstack-query]]
- [[concepts/optimistic-update]]
- [[concepts/heritage-palette]]
- [[concepts/appointment-booking]]
- [[concepts/server-action-pattern]]
- [[concepts/order-status-pipeline]]
- [[concepts/kpi-dashboard]]
- [[concepts/production-board]]
- [[concepts/tailor-workstation]]
- [[concepts/tailor-income-tracking]]
- [[concepts/command-mode-layout]]
- [[concepts/workplace-sidebar]]
- [[concepts/status-badge]]
- [[concepts/deadline-countdown]]
- [[concepts/recharts-library]]

## Related Sources

- [[sources/epic-breakdown-tailor-project]]
- [[sources/epic-1-implementation-artifacts-tailor-project]]
- [[sources/epic-2-implementation-artifacts-tailor-project]]
- [[sources/epic-3-implementation-artifacts-tailor-project]]
- [[sources/epic-4-implementation-artifacts-tailor-project]]

## People

## Open Questions

- **Story 5.2 còn 11 High/Medium review issues chưa fix** — Transaction split trong create_task và update_task (commit trước notification), thiếu optimistic update, lỗi return type annotation, TaskUpdateRequest không phân biệt null vs not-provided. Cần follow-up để đạt chất lượng tương đương các story khác.
- **Story 5.3 ở trạng thái review** — Mặc dù code review đã fix 10 issues, story vẫn chưa được đánh dấu done. Cần xác nhận mức độ hoàn tất thực tế.
- **Chưa có E2E tests cho toàn bộ Epic 5** — Các story mới có unit tests và component tests riêng lẻ; chưa có integration test cho luồng Owner giao việc → Tailor nhận → hoàn thành → income cập nhật.
- **Story 5.2 phụ thuộc vào infrastructure đã có từ 5.3** — `tailor_tasks` DB table được tạo trong 5.3 (trước), 5.2 dùng lại; điều này khác với thứ tự story number và có thể gây nhầm lẫn khi đọc timeline.
